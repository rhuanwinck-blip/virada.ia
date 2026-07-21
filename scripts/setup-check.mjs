const required = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "OPENAI_API_KEY",
  "MERCADO_PAGO_ACCESS_TOKEN",
  "RESEND_API_KEY",
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_SENTRY_DSN",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY"
];

const missing = required.filter((key) => !process.env[key]);
const demoMode = process.env.DEMO_MODE !== "false";

console.log("Virada IA setup check");
console.log(`DEMO_MODE=${demoMode}`);
console.log(`Missing production variables: ${missing.length ? missing.join(", ") : "none"}`);

if (!demoMode && missing.length) {
  process.exitCode = 1;
}
