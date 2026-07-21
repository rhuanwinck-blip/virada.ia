import { planTiers } from "@/lib/questions";

export type AdminConfig = {
  prices: Record<string, string>;
  copy: {
    heroTitle: string;
    heroSubtitle: string;
    cta: string;
  };
  featureFlags: Record<string, string | boolean>;
};

export const defaultAdminConfig: AdminConfig = {
  prices: Object.fromEntries(planTiers.map((tier) => [tier.key, tier.price])),
  copy: {
    heroTitle: "Você não precisa mudar tudo. Precisa descobrir o que mudar primeiro.",
    heroSubtitle:
      "Responda algumas perguntas e descubra o que mais está travando seu progresso. Receba uma análise personalizada e um plano de 30 dias criado para sua realidade.",
    cta: "Descobrir meu ponto de virada"
  },
  featureFlags: {
    hero_copy: "default",
    hero_visual: "signal-panel",
    cta_text: "default",
    contact_position: "after-quiz",
    paywall_layout: "three-tier",
    price_one_time: true,
    pro_offer_timing: "after-report",
    quiz_length: "full",
    result_preview: true
  }
};

export const adminMetrics = [
  ["Visitas", "12.480", "+18%"],
  ["Inícios do diagnóstico", "4.930", "+12%"],
  ["Conclusões", "2.890", "+9%"],
  ["Leads", "2.410", "+11%"],
  ["Checkouts", "612", "+6%"],
  ["Pagamentos aprovados", "318", "+4%"],
  ["Receita", "R$ 14.946", "+7%"],
  ["Assinaturas ativas", "84", "+15%"]
] as const;
