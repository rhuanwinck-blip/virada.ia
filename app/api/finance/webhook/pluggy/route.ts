import { NextResponse } from "next/server";
import { getFinancialDataProvider } from "@/lib/financial-provider";
import { getRuntimeEnv, verifyReplayProtectedSignature } from "@/lib/security";

const processedWebhookKeys = new Set<string>();

export async function POST(request: Request) {
  const env = getRuntimeEnv();
  const payloadText = await request.text();
  const signature = request.headers.get("x-pluggy-signature") ?? request.headers.get("x-virada-signature");
  const timestamp = request.headers.get("x-pluggy-timestamp") ?? request.headers.get("x-virada-timestamp");
  const sandboxHeader = request.headers.get("x-open-finance-sandbox") === "true";
  const shouldRequireSignature = env.OPEN_FINANCE_SANDBOX === "false" || Boolean(env.PLUGGY_WEBHOOK_SECRET);

  const signatureVerified = verifyReplayProtectedSignature({
    payload: payloadText,
    signature,
    timestamp,
    secret: env.PLUGGY_WEBHOOK_SECRET
  });

  if (shouldRequireSignature && !signatureVerified && !sandboxHeader) {
    return NextResponse.json({ error: "invalid_financial_webhook_signature" }, { status: 401 });
  }

  const payload = JSON.parse(payloadText || "{}") as Record<string, unknown>;
  const provider = getFinancialDataProvider();
  const event = await provider.handleWebhook(payload);

  if (processedWebhookKeys.has(event.idempotencyKey)) {
    return NextResponse.json({
      ok: true,
      duplicate: true,
      signatureVerified,
      event: { ...event, status: "duplicate" }
    });
  }

  processedWebhookKeys.add(event.idempotencyKey);

  return NextResponse.json({
    ok: true,
    duplicate: false,
    signatureVerified,
    sandboxAccepted: !signatureVerified,
    event
  });
}
