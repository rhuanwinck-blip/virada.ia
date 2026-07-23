import { NextResponse } from "next/server";
import { buildProductionReadinessReport } from "@/lib/production-readiness";

export async function GET() {
  const report = buildProductionReadinessReport();
  return NextResponse.json(report, {
    status: report.ready ? 200 : 424
  });
}
