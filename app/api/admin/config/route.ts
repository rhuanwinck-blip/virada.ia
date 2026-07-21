import { NextResponse } from "next/server";
import { defaultAdminConfig } from "@/lib/admin-config";

export async function GET() {
  return NextResponse.json({
    config: defaultAdminConfig,
    auditRequired: true,
    productionAuthRequired: true
  });
}
