import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession } from "@/lib/payments";

const schema = z.object({
  plan: z.enum(["one-time", "pro"]).default("one-time"),
  email: z.string().email().optional(),
  diagnosticId: z.string().optional()
});

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  const raw = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_checkout_payload" }, { status: 400 });
  }

  let session: Awaited<ReturnType<typeof createCheckoutSession>>;
  try {
    session = await createCheckoutSession(parsed.data);
  } catch {
    if (contentType.includes("application/json")) {
      return NextResponse.json({ error: "checkout_unavailable" }, { status: 502 });
    }

    const fallbackUrl = new URL("/checkout?payment=error", request.url);
    return NextResponse.redirect(fallbackUrl, 303);
  }

  if (contentType.includes("application/json")) {
    return NextResponse.json(session);
  }

  return NextResponse.redirect(new URL(session.checkoutUrl, request.url), 303);
}
