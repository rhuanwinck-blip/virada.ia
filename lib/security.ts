import crypto from "crypto";
import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_APP_NAME: z.string().default("Virada IA"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  MERCADO_PAGO_ACCESS_TOKEN: z.string().optional(),
  MERCADO_PAGO_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  DEMO_MODE: z.string().default("true"),
  APP_ENV: z.string().default("development")
});

export function getRuntimeEnv() {
  return envSchema.parse(process.env);
}

export function isDemoMode() {
  const env = getRuntimeEnv();
  return env.DEMO_MODE !== "false" || env.APP_ENV !== "production";
}

export function signPayload(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyWebhookSignature(payload: string, signature: string | null, secret?: string) {
  if (!secret || !signature) return false;
  const expected = signPayload(payload, secret);
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function createRequestId() {
  return crypto.randomUUID();
}
