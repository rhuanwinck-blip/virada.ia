import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const require = createRequire(import.meta.url);
const installedVersions = {
  next: require("next/package.json").version,
  react: require("react/package.json").version,
  "react-dom": require("react-dom/package.json").version
};

const required = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "MERCADO_PAGO_ACCESS_TOKEN",
  "MERCADO_PAGO_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "CRON_SECRET",
  "FINANCIAL_DATA_ENCRYPTION_KEY",
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_SENTRY_DSN",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY"
];

const openFinanceRequired =
  process.env.FINANCIAL_DATA_PROVIDER === "belvo"
    ? ["BELVO_SECRET_ID", "BELVO_SECRET_PASSWORD", "BELVO_WEBHOOK_SECRET"]
    : ["PLUGGY_CLIENT_ID", "PLUGGY_CLIENT_SECRET", "PLUGGY_WEBHOOK_SECRET"];

const missing = [...required, ...openFinanceRequired].filter((key) => !process.env[key]);
const demoMode = process.env.DEMO_MODE !== "false";
const sandbox = process.env.OPEN_FINANCE_SANDBOX !== "false";
const appEnv = process.env.APP_ENV ?? "development";
const dependencyIssues = [
  ["next", installedVersions.next ?? packageJson.dependencies.next, "15.4.8"],
  ["react", installedVersions.react ?? packageJson.dependencies.react, "19.2.4"],
  ["react-dom", installedVersions["react-dom"] ?? packageJson.dependencies["react-dom"], "19.2.4"]
].filter(([, current, minimum]) => !isAtLeast(String(current), String(minimum)));

console.log("Virada IA setup check");
console.log(`APP_ENV=${appEnv}`);
console.log(`DEMO_MODE=${demoMode}`);
console.log(`OPEN_FINANCE_SANDBOX=${sandbox}`);
console.log(`Missing production variables: ${missing.length ? missing.join(", ") : "none"}`);
console.log(
  `Dependency issues: ${
    dependencyIssues.length ? dependencyIssues.map(([name, current, minimum]) => `${name}@${current} < ${minimum}`).join(", ") : "none"
  }`
);

if (!demoMode && (missing.length || sandbox || appEnv !== "production" || dependencyIssues.length)) {
  process.exitCode = 1;
}

function isAtLeast(value, minimum) {
  const current = normalizeVersion(value);
  const target = normalizeVersion(minimum);
  for (let index = 0; index < 3; index += 1) {
    if (current[index] > target[index]) return true;
    if (current[index] < target[index]) return false;
  }
  return true;
}

function normalizeVersion(value) {
  const cleaned = value.replace(/^[^\d]*/, "").split(/[.-]/).slice(0, 3);
  return [0, 1, 2].map((index) => Number(cleaned[index] ?? 0));
}
