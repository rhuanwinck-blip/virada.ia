import { NextResponse } from "next/server";
import { demoAnswers } from "@/lib/questions";
import { generateAiReport } from "@/lib/ai-report";
import { createReportPdf } from "@/lib/pdf";
import { scoreDiagnostic } from "@/lib/scoring";

export async function GET() {
  const result = scoreDiagnostic(demoAnswers);
  const report = await generateAiReport(result);
  const pdf = createReportPdf(result, report);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="relatorio-virada-ia-demo.pdf"',
      "Cache-Control": "no-store"
    }
  });
}
