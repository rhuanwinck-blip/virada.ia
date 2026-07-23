import { NextResponse } from "next/server";
import { sendTransactionalEmail } from "@/lib/email";
import { logEvent } from "@/lib/logger";
import { fetchMercadoPagoPayment } from "@/lib/payments";
import { upsertPaymentAccess } from "@/lib/payment-store";
import { getRuntimeEnv, verifyMercadoPagoWebhookSignature } from "@/lib/security";

type MercadoPagoWebhookEvent = {
  id?: string | number;
  type?: string;
  action?: string;
  data?: {
    id?: string | number;
  };
};

export async function POST(request: Request) {
  const start = Date.now();
  const env = getRuntimeEnv();
  const url = new URL(request.url);
  const payload = await request.text();
  let event: MercadoPagoWebhookEvent;
  try {
    event = JSON.parse(payload || "{}") as MercadoPagoWebhookEvent;
  } catch {
    logEvent("warn", "payment_webhook_invalid_payload", { ms: Date.now() - start });
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const dataId = url.searchParams.get("data.id") ?? (event.data?.id != null ? String(event.data.id) : null);

  if (
    env.DEMO_MODE === "false" &&
    !verifyMercadoPagoWebhookSignature({
      dataId,
      requestId: request.headers.get("x-request-id"),
      secret: env.MERCADO_PAGO_WEBHOOK_SECRET,
      signature: request.headers.get("x-signature")
    })
  ) {
    logEvent("warn", "payment_webhook_invalid_signature", {
      dataId,
      requestId: request.headers.get("x-request-id"),
      ms: Date.now() - start
    });
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  if (!dataId) {
    logEvent("warn", "payment_webhook_missing_payment_id", { eventId: event.id, ms: Date.now() - start });
    return NextResponse.json({ error: "missing_payment_id" }, { status: 400 });
  }

  if (event.type && event.type !== "payment") {
    return NextResponse.json({
      ok: true,
      ignored: true,
      eventType: event.type,
      action: event.action
    });
  }

  if (env.DEMO_MODE !== "false") {
    logEvent("info", "payment_webhook_demo_acknowledged", { paymentId: dataId, ms: Date.now() - start });
    return NextResponse.json({
      ok: true,
      paymentId: dataId,
      status: "approved",
      accessReleased: true
    });
  }

  let payment: Awaited<ReturnType<typeof fetchMercadoPagoPayment>>;
  try {
    payment = await fetchMercadoPagoPayment(dataId);
  } catch (error) {
    logEvent("error", "payment_webhook_lookup_failed", {
      paymentId: dataId,
      error: error instanceof Error ? error.message : String(error),
      ms: Date.now() - start
    });
    return NextResponse.json({ error: "payment_lookup_failed" }, { status: 502 });
  }

  const persistence = await upsertPaymentAccess({ payment, rawEvent: event as Record<string, unknown> });
  await notifyPaymentStatus(payment).catch((error) => {
    logEvent("warn", "payment_email_failed", {
      paymentId: payment.id,
      error: error instanceof Error ? error.message : String(error)
    });
  });

  logEvent("info", "payment_webhook_processed", {
    paymentId: payment.id,
    status: payment.status,
    persisted: persistence.persisted,
    persistenceReason: persistence.reason,
    accessReleased: payment.status === "approved",
    ms: Date.now() - start
  });

  return NextResponse.json({
    ok: true,
    eventId: event.id,
    action: event.action,
    paymentId: payment.id,
    status: payment.status,
    externalReference: payment.externalReference,
    persisted: persistence.persisted,
    persistenceReason: persistence.reason,
    accessReleased: payment.status === "approved",
    accessExpiresAt: persistence.accessExpiresAt
  });
}

async function notifyPaymentStatus(payment: Awaited<ReturnType<typeof fetchMercadoPagoPayment>>) {
  if (!payment.email) return;

  if (payment.status === "approved") {
    await sendTransactionalEmail({
      to: payment.email,
      template: "payment_approved",
      subject: "Pagamento aprovado: seu acesso Virada IA foi liberado",
      payload: { name: payment.email.split("@")[0] }
    });
    return;
  }

  if (payment.status === "pending" || payment.status === "in_process") {
    await sendTransactionalEmail({
      to: payment.email,
      template: "payment_pending",
      subject: "Pagamento em processamento no Virada IA",
      payload: { name: payment.email.split("@")[0] }
    });
    return;
  }

  if (
    payment.status === "rejected" ||
    payment.status === "cancelled" ||
    payment.status === "refunded" ||
    payment.status === "charged_back"
  ) {
    await sendTransactionalEmail({
      to: payment.email,
      template: "payment_rejected",
      subject: "Atualizacao sobre seu pagamento no Virada IA",
      payload: { name: payment.email.split("@")[0] }
    });
  }
}
