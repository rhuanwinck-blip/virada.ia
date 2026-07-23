import { NextResponse } from "next/server";
import { fetchMercadoPagoPayment } from "@/lib/payments";
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
  const env = getRuntimeEnv();
  const url = new URL(request.url);
  const payload = await request.text();
  let event: MercadoPagoWebhookEvent;
  try {
    event = JSON.parse(payload || "{}") as MercadoPagoWebhookEvent;
  } catch {
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
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  if (!dataId) {
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
  } catch {
    return NextResponse.json({ error: "payment_lookup_failed" }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    eventId: event.id,
    action: event.action,
    paymentId: payment.id,
    status: payment.status,
    externalReference: payment.externalReference,
    accessReleased: payment.status === "approved"
  });
}
