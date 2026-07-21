import { NextResponse } from "next/server";
import { paymentStates } from "@/lib/payments";
import { getRuntimeEnv, verifyWebhookSignature } from "@/lib/security";

export async function POST(request: Request) {
  const env = getRuntimeEnv();
  const payload = await request.text();
  const signature = request.headers.get("x-virada-signature");

  if (env.DEMO_MODE === "false" && !verifyWebhookSignature(payload, signature, env.MERCADO_PAGO_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const event = JSON.parse(payload || "{}") as { status?: string; id?: string };
  if (!event.status || !(paymentStates as readonly string[]).includes(event.status)) {
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    paymentId: event.id,
    status: event.status,
    accessReleased: event.status === "approved"
  });
}
