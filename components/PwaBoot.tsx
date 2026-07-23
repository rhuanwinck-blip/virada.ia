"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics-client";

export function PwaBoot() {
  useEffect(() => {
    initAnalytics();

    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failure should not block the app shell.
    });
  }, []);

  return null;
}
