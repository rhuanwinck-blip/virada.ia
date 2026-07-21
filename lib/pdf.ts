import { jsPDF } from "jspdf";
import { disclaimer } from "@/lib/questions";
import { DiagnosticResult } from "@/lib/scoring";
import { ReportContent } from "@/lib/ai-report";

export function createReportPdf(result: DiagnosticResult, report: ReportContent) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 48;
  let y = 56;

  const write = (text: string, size = 11, gap = 16) => {
    pdf.setFontSize(size);
    const lines = pdf.splitTextToSize(text, pageWidth - margin * 2);
    pdf.text(lines, margin, y);
    y += lines.length * (size + 4) + gap;
    if (y > 760) {
      pdf.addPage();
      y = 56;
    }
  };

  pdf.setFillColor(5, 7, 13);
  pdf.rect(0, 0, pageWidth, 842, "F");
  pdf.setTextColor(247, 248, 252);
  pdf.setFont("helvetica", "bold");
  write("Virada IA", 28, 10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(167, 176, 192);
  write("Relatório educacional de hábitos e organização pessoal", 13, 22);

  pdf.setTextColor(93, 255, 180);
  pdf.setFont("helvetica", "bold");
  write(`Índice de Virada: ${result.viradaIndex}/100`, 22, 18);

  pdf.setTextColor(247, 248, 252);
  write(report.summary, 12, 18);
  write(report.priority, 14, 18);

  pdf.setTextColor(167, 176, 192);
  write("Evidências", 15, 10);
  report.evidence.forEach((item) => write(`- ${item}`, 11, 8));

  pdf.setTextColor(247, 248, 252);
  write("Primeiros 7 dias", 15, 10);
  result.thirtyDayPlan.slice(0, 7).forEach((mission) => {
    write(`Dia ${mission.day}: ${mission.title} (${mission.minutes} min)`, 11, 6);
  });

  pdf.setTextColor(167, 176, 192);
  write("Rotina matinal", 15, 8);
  write(report.routines.morning, 11, 12);
  write("Rotina noturna", 15, 8);
  write(report.routines.night, 11, 12);
  write("Retomada após falhas", 15, 8);
  write(report.recovery, 11, 12);
  write(disclaimer, 9, 0);

  return Buffer.from(pdf.output("arraybuffer"));
}
