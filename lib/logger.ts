type LogLevel = "info" | "warn" | "error";

export function logEvent(level: LogLevel, message: string, context: Record<string, unknown> = {}) {
  const payload = {
    level,
    message,
    app: "virada-ia",
    environment: process.env.APP_ENV || "development",
    timestamp: new Date().toISOString(),
    ...context
  };

  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}
