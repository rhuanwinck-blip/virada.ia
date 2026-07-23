import { NextResponse } from "next/server";
import { z } from "zod";

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z
    .object({
      p256dh: z.string(),
      auth: z.string()
    })
    .optional(),
  consent: z.boolean()
});

export async function GET() {
  return NextResponse.json({
    provider: "web_push",
    status: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY ? "ready" : "needs_credentials",
    publicKeyConfigured: Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
    externalNotificationSent: false
  });
}

export async function POST(request: Request) {
  const parsed = subscriptionSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_push_subscription" }, { status: 400 });
  }

  if (!parsed.data.consent) {
    return NextResponse.json({ error: "missing_user_consent" }, { status: 403 });
  }

  return NextResponse.json({
    stored: false,
    mode: "demo_contract",
    externalNotificationSent: false,
    message: "Assinatura validada. Persistencia real deve salvar em push_subscriptions com RLS."
  });
}
