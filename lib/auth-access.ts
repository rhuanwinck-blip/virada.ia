import type { User } from "@supabase/supabase-js";
import { claimPaymentAccessForUser } from "@/lib/payment-store";
import { createSupabaseServerClient } from "@/lib/supabase";

export type UserEntitlement = {
  id: string;
  user_id: string | null;
  email: string | null;
  plan_key: "one-time" | "pro" | string;
  status: "active" | "pending" | "cancelled";
  source: string;
  provider: string;
  provider_payment_id: string | null;
  starts_at: string | null;
  expires_at: string | null;
};

export type CurrentUserAccess = {
  supabaseConfigured: boolean;
  authenticated: boolean;
  hasAccess: boolean;
  user: User | null;
  entitlement: UserEntitlement | null;
  reason?: "supabase_not_configured" | "not_authenticated" | "missing_email" | "no_active_entitlement" | "entitlement_lookup_failed";
};

export function normalizeNextPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("\n")) {
    return fallback;
  }
  return value;
}

export function isProtectedAppPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname === "/onboarding" || pathname.startsWith("/onboarding/");
}

export async function getCurrentUserAccess(options: { claimEntitlement?: boolean } = {}): Promise<CurrentUserAccess> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      supabaseConfigured: false,
      authenticated: false,
      hasAccess: false,
      user: null,
      entitlement: null,
      reason: "supabase_not_configured"
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabaseConfigured: true,
      authenticated: false,
      hasAccess: false,
      user: null,
      entitlement: null,
      reason: "not_authenticated"
    };
  }

  if (!user.email) {
    return {
      supabaseConfigured: true,
      authenticated: true,
      hasAccess: false,
      user,
      entitlement: null,
      reason: "missing_email"
    };
  }

  if (options.claimEntitlement !== false) {
    await claimPaymentAccessForUser({ userId: user.id, email: user.email }).catch(() => null);
  }

  const result = await supabase
    .from("user_entitlements")
    .select("id,user_id,email,plan_key,status,source,provider,provider_payment_id,starts_at,expires_at")
    .eq("status", "active")
    .order("expires_at", { ascending: false, nullsFirst: false })
    .limit(20);

  if (result.error) {
    return {
      supabaseConfigured: true,
      authenticated: true,
      hasAccess: false,
      user,
      entitlement: null,
      reason: "entitlement_lookup_failed"
    };
  }

  const entitlement = ((result.data ?? []) as UserEntitlement[]).find(isEntitlementActive) ?? null;

  return {
    supabaseConfigured: true,
    authenticated: true,
    hasAccess: Boolean(entitlement),
    user,
    entitlement,
    reason: entitlement ? undefined : "no_active_entitlement"
  };
}

function isEntitlementActive(entitlement: UserEntitlement) {
  if (entitlement.status !== "active") return false;
  if (!entitlement.expires_at) return true;
  return new Date(entitlement.expires_at).getTime() > Date.now();
}
