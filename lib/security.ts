import crypto from "crypto";
import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_APP_NAME: z.string().default("Virada IA"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  FINANCIAL_DATA_PROVIDER: z.enum(["pluggy", "belvo"]).default("pluggy"),
  PLUGGY_CLIENT_ID: z.string().optional(),
  PLUGGY_CLIENT_SECRET: z.string().optional(),
  PLUGGY_WEBHOOK_SECRET: z.string().optional(),
  BELVO_SECRET_ID: z.string().optional(),
  BELVO_SECRET_PASSWORD: z.string().optional(),
  BELVO_WEBHOOK_SECRET: z.string().optional(),
  FINANCIAL_DATA_ENCRYPTION_KEY: z.string().optional(),
  OPEN_FINANCE_SANDBOX: z.string().default("true"),
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

export function verifyReplayProtectedSignature(input: {
  payload: string;
  signature: string | null;
  secret?: string;
  timestamp: string | null;
  toleranceSeconds?: number;
}) {
  if (!verifyWebhookSignature(input.payload, input.signature, input.secret)) return false;
  if (!input.timestamp) return false;

  const tolerance = input.toleranceSeconds ?? 300;
  const numericTimestamp = Number(input.timestamp);
  const timestampMs = Number.isFinite(numericTimestamp)
    ? numericTimestamp * (numericTimestamp < 10_000_000_000 ? 1000 : 1)
    : Date.parse(input.timestamp);

  if (!Number.isFinite(timestampMs)) return false;
  return Math.abs(Date.now() - timestampMs) <= tolerance * 1000;
}

export function createRequestId() {
  return crypto.randomUUID();
}
