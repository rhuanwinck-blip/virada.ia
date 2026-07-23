import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const enabled = Boolean(dsn) && process.env.NODE_ENV === "production";

Sentry.init({
  dsn,
  enabled,
  environment: process.env.APP_ENV || process.env.NODE_ENV,
  tracesSampleRate: enabled ? 0.1 : 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: enabled ? 1.0 : 0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true
    })
  ]
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
