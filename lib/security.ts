import crypto from "crypto";
import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_APP_NAME: z.string().default("Virada IA"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_SECRET_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  SUPABASE_ANON_KEY: z.string().optional(),
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
  OPEN_FINANCE_SYSTEM_USER_ID: z.string().uuid().optional(),
  MERCADO_PAGO_ACCESS_TOKEN: z.string().optional(),
  MERCADO_PAGO_WEBHOOK_SECRET: z.string().optional(),
  MERCADO_PAGO_PUBLIC_KEY: z.string().optional(),
  MERCADO_PAGO_ONE_TIME_PRODUCT_ID: z.string().optional(),
  MERCADO_PAGO_PRO_PLAN_ID: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  EMAIL_REPLY_TO: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  N8N_ENABLED: z.string().default("false"),
  N8N_WEBHOOK_URL: z.string().url().optional().or(z.literal("")),
  N8N_WEBHOOK_SECRET: z.string().optional(),
  WEB_PUSH_PUBLIC_KEY: z.string().optional(),
  WEB_PUSH_PRIVATE_KEY: z.string().optional(),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_TOKEN: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  AUTOMATION_SIGNING_SECRET: z.string().optional(),
  REPORT_SIGNING_SECRET: z.string().optional(),
  ADMIN_EMAILS: z.string().optional(),
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
