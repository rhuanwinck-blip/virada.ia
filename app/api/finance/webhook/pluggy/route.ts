import { NextResponse } from "next/server";
import { getFinancialDataProvider } from "@/lib/financial-provider";
import { recordFinancialWebhookEvent } from "@/lib/financial-store";
import { getRuntimeEnv, verifyReplayProtectedSignature, verifySharedSecretHeader } from "@/lib/security";

const processedWebhookKeys = new Set<string>();

export async function POST(request: Request) {
  const env = getRuntimeEnv();
  const payloadText = await request.text();
  const signature = request.headers.get("x-pluggy-signature") ?? request.headers.get("x-virada-signature");
  const timestamp = request.headers.get("x-pluggy-timestamp") ?? request.headers.get("x-virada-timestamp");
  const sharedSecretHeader =
    request.headers.get("x-pluggy-webhook-secret") ??
    request.headers.get("x-virada-webhook-secret") ??
    request.headers.get("authorization");
  const sandboxHeader = request.headers.get("x-open-finance-sandbox") === "true";
  const shouldRequireSignature = env.OPEN_FINANCE_SANDBOX === "false" || Boolean(env.PLUGGY_WEBHOOK_SECRET);

  const signatureVerified = verifyReplayProtectedSignature({
    payload: payloadText,
    signature,
    timestamp,
    secret: env.PLUGGY_WEBHOOK_SECRET
  });
  const sharedSecretVerified = verifySharedSecretHeader(sharedSecretHeader, env.PLUGGY_WEBHOOK_SECRET);
  const webhookAuthenticated = signatureVerified || sharedSecretVerified;

  if (shouldRequireSignature && !webhookAuthenticated && !sandboxHeader) {
    return NextResponse.json({ error: "invalid_financial_webhook_signature" }, { status: 401 });
  }

  const payload = JSON.parse(payloadText || "{}") as Record<string, unknown>;
  const provider = getFinancialDataProvider();
  const event = await provider.handleWebhook(payload);
  const persistence = await recordFinancialWebhookEvent({
    event,
    signatureValid: webhookAuthenticated
  });

  if (processedWebhookKeys.has(event.idempotencyKey)) {
    return NextResponse.json({
      ok: true,
      duplicate: true,
      signatureVerified,
      sharedSecretVerified,
      persistence,
      event: { ...event, status: "duplicate" }
    });
  }

  processedWebhookKeys.add(event.idempotencyKey);

  return NextResponse.json({
    ok: true,
    duplicate: false,
    signatureVerified,
    sharedSecretVerified,
    sandboxAccepted: !webhookAuthenticated,
    persistence,
    syncQueued: event.shouldSync,
    event
  });
}
