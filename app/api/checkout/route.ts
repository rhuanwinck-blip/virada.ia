import { NextResponse } from "next/server";
import { z } from "zod";
import { logEvent } from "@/lib/logger";
import { createCheckoutSession } from "@/lib/payments";

const schema = z.object({
  plan: z.enum(["one-time", "pro"]).default("one-time"),
  email: z.string().email().optional(),
  diagnosticId: z.string().optional()
});

export async function POST(request: Request) {
  const start = Date.now();
  const contentType = request.headers.get("content-type") || "";
  const raw = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    logEvent("warn", "checkout_invalid_payload", { contentType, ms: Date.now() - start });
    return NextResponse.json({ error: "invalid_checkout_payload" }, { status: 400 });
  }

  let session: Awaited<ReturnType<typeof createCheckoutSession>>;
  try {
    session = await createCheckoutSession(parsed.data);
  } catch (error) {
    logEvent("error", "checkout_session_failed", {
      plan: parsed.data.plan,
      error: error instanceof Error ? error.message : String(error),
      ms: Date.now() - start
    });
    if (contentType.includes("application/json")) {
      return NextResponse.json({ error: "checkout_unavailable" }, { status: 502 });
    }

    const fallbackUrl = new URL("/checkout?payment=error", request.url);
    return NextResponse.redirect(fallbackUrl, 303);
  }

  if (contentType.includes("application/json")) {
    logEvent("info", "checkout_session_created", {
      plan: parsed.data.plan,
      provider: session.provider,
      status: session.status,
      ms: Date.now() - start
    });
    return NextResponse.json(session);
  }

  logEvent("info", "checkout_session_redirect", {
    plan: parsed.data.plan,
    provider: session.provider,
    status: session.status,
    ms: Date.now() - start
  });
  return NextResponse.redirect(new URL(session.checkoutUrl, request.url), 303);
}
