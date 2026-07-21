"use client";

import posthog from "posthog-js";
import { AnalyticsEventName, sanitizeAnalyticsProperties } from "@/lib/events";

let initialized = false;

export function initAnalytics() {
  if (initialized || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    capture_pageview: false,
    persistence: "localStorage+cookie"
  });
  initialized = true;
}

export function captureEvent(name: AnalyticsEventName, properties: Record<string, unknown> = {}) {
  if (!initialized) return;
  posthog.capture(name, sanitizeAnalyticsProperties(properties));
}
