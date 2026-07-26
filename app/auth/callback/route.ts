import { NextResponse } from "next/server";
import { normalizeNextPath } from "@/lib/auth-access";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = normalizeNextPath(requestUrl.searchParams.get("next"), "/dashboard");
  const supabase = await createSupabaseServerClient();

  if (!code || !supabase) {
    return NextResponse.redirect(new URL("/login?state=callback-error", request.url));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?state=callback-error", request.url));
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}
