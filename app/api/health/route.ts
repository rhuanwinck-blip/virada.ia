import { NextResponse } from "next/server";
import { createRequestId, isDemoMode } from "@/lib/security";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "Virada IA",
    demoMode: isDemoMode(),
    requestId: createRequestId(),
    checkedAt: new Date().toISOString()
  });
}
