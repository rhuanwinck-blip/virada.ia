import { NextResponse } from "next/server";
import { getCurrentUserAccess } from "@/lib/auth-access";

export async function POST() {
  const access = await getCurrentUserAccess({ claimEntitlement: true });

  if (!access.supabaseConfigured) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  }

  if (!access.authenticated || !access.user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    hasAccess: access.hasAccess,
    plan: access.entitlement?.plan_key ?? null,
    expiresAt: access.entitlement?.expires_at ?? null
  });
}
