import OpenAI from "openai";
import { z } from "zod";
import { DiagnosticResult } from "@/lib/scoring";
import { isDemoMode } from "@/lib/security";

export const reportSchema = z.object({
  summary: z.string(),
  priority: z.string(),
  evidence: z.array(z.string()),
  routines: z.object({
    morning: z.string(),
    night: z.string()
  }),
  recovery: z.string(),
  financialEducation: z.string()
});

export type ReportContent = z.infer<typeof reportSchema>;

export async function generateAiReport(result: DiagnosticResult): Promise<ReportContent> {
  if (isDemoMode() || !process.env.OPENAI_API_KEY) {
    return fallbackReport(result);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "Crie uma análise educacional de hábitos em português do Brasil. Não use termos médicos, psicológicos, cura, tratamento ou promessa garantida."
      },
      {
        role: "user",
        content: JSON.stringify({
          viradaIndex: result.viradaIndex,
          mainBlocker: result.mainBlocker,
          topBlockers: result.topBlockers,
          contradictions: result.contradictions,
          plan: result.thirtyDayPlan.slice(0, 7)
        })
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "virada_report",
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["summary", "priority", "evidence", "routines", "recovery", "financialEducation"],
          properties: {
            summary: { type: "string" },
            priority: { type: "string" },
            evidence: { type: "array", items: { type: "string" } },
            routines: {
              type: "object",
              additionalProperties: false,
              required: ["morning", "night"],
              properties: {
                morning: { type: "string" },
                night: { type: "string" }
              }
            },
            recovery: { type: "string" },
            financialEducation: { type: "string" }
          }
        }
      }
    }
  });

  const parsed = JSON.parse(response.output_text);
  return reportSchema.parse(parsed);
}

export function fallbackReport(result: DiagnosticResult): ReportContent {
  return {
    summary: `${result.pattern} O melhor começo é reduzir o plano para uma prioridade visível e uma ação diária curta.`,
    priority: `Prioridade dos próximos 30 dias: fortalecer ${result.mainBlocker.name.toLowerCase()} antes de tentar ampliar o plano.`,
    evidence: [
      `Índice de Virada: ${result.viradaIndex}/100`,
      `Principal ponto de bloqueio: ${result.mainBlocker.name}`,
      `Nível de confiança: ${result.confidence} (${result.confidenceScore}%)`
    ],
    routines: {
      morning:
        "Abra o dia escolhendo uma ação de 10 a 20 minutos, removendo uma distração e deixando claro o que será considerado progresso suficiente.",
      night:
        "Feche o dia registrando o que avançou, o que travou e qual versão menor será feita amanhã se a energia estiver baixa."
    },
    recovery:
      "Quando falhar, não reinicie do zero. Reduza a missão para metade do tamanho, execute uma versão mínima e registre o retorno.",
    financialEducation:
      "Para organização financeira básica, acompanhe gastos variáveis por sete dias e defina um teto semanal simples. Isso é educacional e não substitui orientação especializada."
  };
}
