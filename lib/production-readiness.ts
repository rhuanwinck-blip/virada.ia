import nextPackageJson from "next/package.json";
import reactPackageJson from "react/package.json";
import reactDomPackageJson from "react-dom/package.json";
import { getRuntimeEnv } from "@/lib/security";
import { isSupabaseAdminConfigured } from "@/lib/supabase";

export type ReadinessStatus = "pass" | "warn" | "fail" | "manual";

export type ReadinessCheck = {
  id: string;
  label: string;
  status: ReadinessStatus;
  detail: string;
  required: boolean;
};

export type ProductionReadinessReport = {
  ready: boolean;
  score: number;
  environment: string;
  generatedAt: string;
  blockers: ReadinessCheck[];
  warnings: ReadinessCheck[];
  checks: ReadinessCheck[];
};

const nextMinimum = "15.4.8";
const reactRecommended = "19.2.4";

export function buildProductionReadinessReport(): ProductionReadinessReport {
  const env = getRuntimeEnv();
  const provider = env.FINANCIAL_DATA_PROVIDER;
  const production = env.APP_ENV === "production";
  const demoOff = env.DEMO_MODE === "false";
  const openFinanceProduction = env.OPEN_FINANCE_SANDBOX === "false";
  const checks: ReadinessCheck[] = [
    check("app-env", "Ambiente de producao", production, "APP_ENV precisa ser production.", true),
    check("demo-off", "Demo desligado", demoOff, "DEMO_MODE precisa ser false.", true),
    check("app-url", "URL publica", has(env.NEXT_PUBLIC_APP_URL), "NEXT_PUBLIC_APP_URL precisa apontar para o dominio final.", true),
    check("supabase-public", "Supabase publico", has(env.NEXT_PUBLIC_SUPABASE_URL) && has(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY), "URL e publishable key do Supabase precisam estar configuradas.", true),
    check("supabase-admin", "Supabase service role", isSupabaseAdminConfigured(), "Service role e URL real sao necessarias para sync, auditoria e webhooks.", true),
    check("openai", "OpenAI API", has(env.OPENAI_API_KEY), "OPENAI_API_KEY precisa existir para agentes reais.", true),
    check("payments", "Mercado Pago", has(env.MERCADO_PAGO_ACCESS_TOKEN) && has(env.MERCADO_PAGO_WEBHOOK_SECRET), "Checkout e webhooks precisam de token e secret reais.", true),
    check("email", "Email transacional", has(env.RESEND_API_KEY) && has(env.EMAIL_FROM), "Resend e remetente precisam estar configurados.", true),
    check("cron-secret", "Cron protegido", has(env.CRON_SECRET), "CRON_SECRET protege /api/finance/sync.", true),
    check("open-finance-mode", "Open Finance real", openFinanceProduction, "OPEN_FINANCE_SANDBOX precisa ser false para dados bancarios reais.", true),
    check("finance-encryption", "Criptografia financeira", has(env.FINANCIAL_DATA_ENCRYPTION_KEY), "FINANCIAL_DATA_ENCRYPTION_KEY precisa existir antes de producao.", true),
    provider === "pluggy"
      ? check("pluggy", "Pluggy producao", has(env.PLUGGY_CLIENT_ID) && has(env.PLUGGY_CLIENT_SECRET) && has(env.PLUGGY_WEBHOOK_SECRET), "Pluggy precisa de client id, secret e webhook secret.", true)
      : check("belvo", "Belvo standby", has(env.BELVO_SECRET_ID) && has(env.BELVO_SECRET_PASSWORD) && has(env.BELVO_WEBHOOK_SECRET), "Belvo exige credenciais e validacao final do adapter antes de ser provider principal.", true),
    check("finance-system-user", "Usuario fallback de sync", has(env.OPEN_FINANCE_SYSTEM_USER_ID), "OPEN_FINANCE_SYSTEM_USER_ID e opcional; em producao o cron varre conexoes por usuario via service role.", false),
    check("push", "Web Push", has(env.WEB_PUSH_PUBLIC_KEY) && has(env.WEB_PUSH_PRIVATE_KEY), "Chaves VAPID/Web Push liberam lembretes reais.", false),
    check("calendar", "Google Calendar", has(env.GOOGLE_CLIENT_ID) && has(env.GOOGLE_CLIENT_SECRET) && has(env.GOOGLE_REDIRECT_URI), "Credenciais OAuth liberam agenda real.", false),
    check("whatsapp", "WhatsApp", has(env.WHATSAPP_ACCESS_TOKEN) && has(env.WHATSAPP_PHONE_NUMBER_ID), "WhatsApp Cloud API libera canal real.", false),
    check("monitoring", "Observabilidade", has(env.NEXT_PUBLIC_SENTRY_DSN) && has(env.NEXT_PUBLIC_POSTHOG_KEY), "Sentry/PostHog ajudam a operar producao.", false),
    check("next-safe", "Next.js patched", isAtLeast(nextPackageJson.version, nextMinimum), `Atualize next para >= ${nextMinimum}.`, true),
    check("react-safe", "React patched", isAtLeast(reactPackageJson.version, reactRecommended) && isAtLeast(reactDomPackageJson.version, reactRecommended), `Atualize react/react-dom para >= ${reactRecommended}.`, true),
    manual("legal-review", "Revisao LGPD/juridica", "Termos, privacidade, consentimento financeiro e retencao precisam de revisao humana antes do go-live.", true),
    manual("provider-contract", "Contrato Pluggy/Belvo", "Conta/contrato do provider precisa estar ativo com produtos autorizados.", true),
    manual("real-data-pilot", "Piloto com dados reais", "Rodar teste controlado: conectar, importar, categorizar, revogar e excluir.", true)
  ];

  const blockers = checks.filter((item) => item.required && (item.status === "fail" || item.status === "manual"));
  const warnings = checks.filter((item) => !item.required && item.status !== "pass");
  const passCount = checks.filter((item) => item.status === "pass").length;
  const score = Math.round((passCount / checks.length) * 100);

  return {
    ready: blockers.length === 0,
    score,
    environment: env.APP_ENV,
    generatedAt: new Date().toISOString(),
    blockers,
    warnings,
    checks
  };
}

function check(id: string, label: string, passes: boolean, detail: string, required: boolean): ReadinessCheck {
  return {
    id,
    label,
    status: passes ? "pass" : required ? "fail" : "warn",
    detail,
    required
  };
}

function manual(id: string, label: string, detail: string, required: boolean): ReadinessCheck {
  return {
    id,
    label,
    status: "manual",
    detail,
    required
  };
}

function has(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isAtLeast(value: string | undefined, minimum: string) {
  if (!value) return false;
  const current = normalizeVersion(value);
  const target = normalizeVersion(minimum);
  for (let index = 0; index < 3; index += 1) {
    if (current[index] > target[index]) return true;
    if (current[index] < target[index]) return false;
  }
  return true;
}

function normalizeVersion(value: string) {
  const cleaned = value.replace(/^[^\d]*/, "").split(/[.-]/).slice(0, 3);
  return [0, 1, 2].map((index) => Number(cleaned[index] ?? 0));
}
