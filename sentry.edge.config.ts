import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const enabled = Boolean(dsn) && process.env.APP_ENV === "production";

Sentry.init({
  dsn,
  enabled,
  environment: process.env.APP_ENV || process.env.NODE_ENV,
  tracesSampleRate: enabled ? 0.05 : 0,
  sendDefaultPii: false
});
