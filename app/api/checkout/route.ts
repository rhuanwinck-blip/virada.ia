import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession } from "@/lib/payments";

const schema = z.object({
  plan: z.enum(["one-time", "pro"]).default("one-time"),
  email: z.string().email().default("demo@viradaia.local"),
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

  const session = await createCheckoutSession(parsed.data);

  if (contentType.includes("application/json")) {
    return NextResponse.json(session);
  }

  return NextResponse.redirect(new URL("/onboarding?payment=approved", request.url), 303);
}
