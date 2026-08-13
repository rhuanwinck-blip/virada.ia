import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { normalizeNextPath } from "@/lib/auth-access";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const nextPath = normalizeNextPath(requestUrl.searchParams.get("next"), "/dashboard");
  const supabase = await createSupabaseServerClient();

  if (!tokenHash || !type || !supabase) {
    return NextResponse.redirect(buildLoginErrorUrl(request.url, nextPath));
  }

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type
  });

  if (error) {
    return NextResponse.redirect(buildLoginErrorUrl(request.url, nextPath));
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}

function buildLoginErrorUrl(requestUrl: string, nextPath: string) {
  const url = new URL("/login", requestUrl);
  url.searchParams.set("mode", "acesso");
  url.searchParams.set("state", "callback-error");
  url.searchParams.set("next", nextPath);
  return url;
}
