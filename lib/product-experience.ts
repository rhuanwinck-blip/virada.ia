import { DiagnosticResult } from "@/lib/scoring";
import { PillarKey, pillars } from "@/lib/questions";

export type DashboardNavItem = {
  id: string;
  label: string;
  group: "Agora" | "Entender" | "Evoluir" | "Inteligencia" | "Conta";
  description: string;
};

export const dashboardNavigation: DashboardNavItem[] = [
  { id: "overview", label: "Visao Geral", group: "Agora", description: "Status, prioridade e proxima acao." },
  { id: "today", label: "Hoje", group: "Agora", description: "Missao atual, foco e conclusao." },
  { id: "plan", label: "Meu Plano", group: "Agora", description: "Plano de 30 dias com versoes minimas." },
  { id: "calendar", label: "Calendario", group: "Agora", description: "Ritmo semanal e proximos check-ins." },
  { id: "diagnostic", label: "Meu Diagnostico", group: "Entender", description: "Mapa do momento e evidencias." },
  { id: "pillars", label: "Pilares", group: "Entender", description: "Radar dos seis pilares." },
  { id: "patterns", label: "Padroes Identificados", group: "Entender", description: "Comportamentos recorrentes e impacto." },
  { id: "priorities", label: "Mapa de Prioridades", group: "Entender", description: "Ordem de impacto e esforco." },
  { id: "reports", label: "Relatorios", group: "Entender", description: "Inicial, semanal, mensal e PDF." },
  { id: "goals", label: "Metas", group: "Evoluir", description: "Metas reduzidas em proximos passos." },
  { id: "routine", label: "Rotina", group: "Evoluir", description: "Blocos flexiveis por periodo." },
  { id: "habits", label: "Habitos", group: "Evoluir", description: "Sequencia, taxa e notas." },
  { id: "focus", label: "Foco", group: "Evoluir", description: "Sessao rapida e historico." },
  { id: "finance", label: "Organizacao Financeira", group: "Evoluir", description: "Educacional, manual e simples." },
  { id: "checkins", label: "Check-ins", group: "Evoluir", description: "Revisao semanal e adaptacao." },
  { id: "evolution", label: "Evolucao", group: "Evoluir", description: "Tendencias, retomadas e marcos." },
  { id: "assistant", label: "Assistente IA", group: "Inteligencia", description: "Guia Virada com contexto interno." },
  { id: "recommendations", label: "Recomendacoes", group: "Inteligencia", description: "Feed com motivo e evidencias." },
  { id: "replan", label: "Replanejar", group: "Inteligencia", description: "Antes/depois sem apagar historico." },
  { id: "simulations", label: "Simulacoes", group: "Inteligencia", description: "Cenarios de tempo, energia e foco." },
  { id: "achievements", label: "Conquistas", group: "Conta", description: "Marcos discretos de progresso." },
  { id: "library", label: "Biblioteca", group: "Conta", description: "Conteudos curtos filtrados pelo diagnostico." },
  { id: "notifications", label: "Notificacoes", group: "Conta", description: "Alertas e preferencias." },
  { id: "subscription", label: "Assinatura", group: "Conta", description: "Plano, status e cancelamento." },
  { id: "settings", label: "Configuracoes", group: "Conta", description: "Privacidade, dados e preferencias." },
  { id: "help", label: "Ajuda", group: "Conta", description: "Limites, suporte e funcionamento." }
];

export const motionTokens = {
  fast: 0.15,
  normal: 0.3,
  elegant: 0.5,
  narrative: 0.8,
  spring: { stiffness: 160, damping: 24, mass: 0.8 },
  softSpring: { stiffness: 90, damping: 22, mass: 1 }
};

export const dashboardEmptyStates = [
  {
    state: "Sem historico",
    title: "A evolucao aparece depois das primeiras missoes.",
    body: "Enquanto ainda nao ha dados reais, o painel mostra uma demonstracao marcada como exemplo."
  },
  {
    state: "Relatorio gerando",
    title: "Estamos estruturando sua leitura.",
    body: "O relatorio combina score, evidencias, contradicoes e plano antes de liberar o PDF."
  },
  {
    state: "Pagamento pendente",
    title: "O plano completo fica bloqueado ate confirmacao segura.",
    body: "Em producao, a liberacao depende do webhook ou de uma consulta confiavel ao provedor."
  }
];

export const behaviorPatterns = [
  {
    id: "auto-distraction",
    title: "Distração automática",
    level: "Alto",
    evidence: "Tempo fragmentado por checagens e notificações.",
    impact: "Reduz blocos de foco e aumenta a sensação de atraso.",
    action: "Criar um bloco de 20 minutos com o celular fora do alcance."
  },
  {
    id: "decision-avoidance",
    title: "Evitação de decisão",
    level: "Médio",
    evidence: "Muitas frentes abertas e pouca escolha de prioridade.",
    impact: "O plano cresce antes de existir uma direção clara.",
    action: "Escolher uma meta única para os próximos 30 dias."
  },
  {
    id: "all-or-nothing",
    title: "Tudo ou nada",
    level: "Médio",
    evidence: "Falhar um dia tende a contaminar a semana.",
    impact: "A retomada demora mais do que a própria falha.",
    action: "Definir uma versão mínima de 10 minutos para dias ruins."
  },
  {
    id: "open-loop",
    title: "Dia sem fechamento",
    level: "Baixo",
    evidence: "Pouca revisão sobre o que avançou e o que fica para amanhã.",
    impact: "A manhã seguinte começa sem critério de conclusão.",
    action: "Fechar o dia com três linhas: avanço, trava e próxima ação."
  }
];

export const priorityMap = [
  {
    zone: "Importante e urgente",
    items: ["Definir a meta de 30 dias", "Remover uma distração do ambiente"],
    tone: "green"
  },
  {
    zone: "Alto impacto, baixo esforço",
    items: ["Missão mínima diária", "Revisão noturna de 3 linhas"],
    tone: "cyan"
  },
  {
    zone: "Importante e não urgente",
    items: ["Construir rotina semanal", "Mapear gastos variáveis"],
    tone: "blue"
  },
  {
    zone: "Baixo esforço, baixa prioridade",
    items: ["Organizar lista completa", "Ajustar detalhes do ambiente"],
    tone: "violet"
  }
];

export const smartRecommendations = [
  {
    title: "Reduzir a missão de hoje para 15 minutos",
    reason: "A confiança melhora quando a ação cabe no dia real.",
    evidence: "Padrão de abandono após planos grandes.",
    impact: "Alto",
    difficulty: "Baixa",
    time: "15 min"
  },
  {
    title: "Trocar múltiplas metas por uma decisão semanal",
    reason: "Seu bloqueio principal é direção, não falta de vontade.",
    evidence: "Prioridade indefinida combinada com excesso de frentes.",
    impact: "Alto",
    difficulty: "Média",
    time: "20 min"
  },
  {
    title: "Criar um teto manual para gastos variáveis",
    reason: "A área financeira precisa de visibilidade, não recomendação de investimento.",
    evidence: "Surpresas no fim do mês e pouco controle semanal.",
    impact: "Médio",
    difficulty: "Baixa",
    time: "12 min"
  }
];

export const goals = [
  {
    title: "Recuperar controle da rotina",
    area: "Rotina",
    why: "Diminuir dias reativos e aumentar previsibilidade.",
    deadline: "30 dias",
    indicator: "4 fechamentos de dia por semana",
    progress: 38,
    nextStep: "Escolher a prioridade de amanhã antes das 22h",
    status: "Em andamento"
  },
  {
    title: "Reduzir vazamento de tempo no celular",
    area: "Foco",
    why: "Abrir espaço para decisões e execução curta.",
    deadline: "14 dias",
    indicator: "3 blocos sem notificações por semana",
    progress: 46,
    nextStep: "Ativar modo foco por 20 minutos hoje",
    status: "Prioridade"
  },
  {
    title: "Ter visibilidade financeira básica",
    area: "Dinheiro",
    why: "Reduzir ansiedade causada por gastos invisíveis.",
    deadline: "21 dias",
    indicator: "7 registros manuais na semana",
    progress: 22,
    nextStep: "Registrar cinco gastos recentes",
    status: "A iniciar"
  }
];

export const routineBlocks = [
  { period: "Manhã", title: "Escolher a ação principal", duration: "5 min", flexibility: "Fixo", minimal: "Escrever uma linha" },
  { period: "Trabalho/estudo", title: "Bloco de foco curto", duration: "20 min", flexibility: "Flexível", minimal: "10 min sem notificações" },
  { period: "Tarde", title: "Checagem de pendências", duration: "12 min", flexibility: "Flexível", minimal: "Listar 3 pendências" },
  { period: "Noite", title: "Fechamento do dia", duration: "8 min", flexibility: "Fixo", minimal: "Avanço, trava, próxima ação" },
  { period: "Fim de semana", title: "Revisão leve", duration: "25 min", flexibility: "Flexível", minimal: "Escolher prioridade da semana" }
];

export const financeEntries = [
  { category: "Assinaturas", value: "R$ 89", signal: "revisar uso" },
  { category: "Alimentação fora", value: "R$ 214", signal: "acompanhar" },
  { category: "Transporte", value: "R$ 132", signal: "dentro do padrão" },
  { category: "Compras por impulso", value: "R$ 76", signal: "reduzir gatilho" }
];

export const achievements = [
  { title: "Primeiro diagnóstico", detail: "Mapa inicial concluído", unlocked: true },
  { title: "Primeira ação", detail: "Missão diária iniciada", unlocked: true },
  { title: "Primeira retomada", detail: "Plano reduzido após falha", unlocked: true },
  { title: "Primeiro check-in", detail: "Revisão semanal enviada", unlocked: false },
  { title: "Evolução de pilar", detail: "Melhora detectada em um pilar", unlocked: false }
];

export const libraryItems = [
  { title: "Como escolher uma prioridade real", pillar: "Clareza", minutes: 4 },
  { title: "Retomar sem reiniciar do zero", pillar: "Execução", minutes: 3 },
  { title: "Bloco de foco de 20 minutos", pillar: "Tempo", minutes: 5 },
  { title: "Controle financeiro sem planilha perfeita", pillar: "Dinheiro", minutes: 6 },
  { title: "Fechamento do dia em três linhas", pillar: "Rotina", minutes: 3 }
];

export const adminSections = [
  "Visão geral",
  "Usuários",
  "Funil",
  "Diagnósticos",
  "Relatórios",
  "Pagamentos",
  "Assinaturas",
  "Conteúdo",
  "Biblioteca",
  "Perguntas",
  "Scoring",
  "Prompts",
  "Recomendações",
  "Notificações",
  "Depoimentos",
  "Preços",
  "Planos",
  "Feature flags",
  "Testes A/B",
  "Erros",
  "Auditoria",
  "Configurações"
];

export function getPillarTrend(key: PillarKey, score: number) {
  const trendByPillar: Record<PillarKey, number> = {
    clarity: 7,
    execution: 4,
    time: -3,
    routine: 6,
    money: 2,
    energy: 1
  };

  return {
    key,
    name: pillars[key].shortName,
    score,
    trend: trendByPillar[key],
    status: score < 40 ? "Crítico" : score < 58 ? "Atenção" : score < 76 ? "Construindo" : "Forte"
  };
}

export function buildWeeklyPlan(result: DiagnosticResult) {
  const themes = [
    "Clareza e redução",
    "Execução mínima",
    "Rotina que aguenta dias reais",
    "Continuidade e replanejamento"
  ];

  return themes.map((theme, weekIndex) => {
    const start = weekIndex * 7;
    const missions = result.thirtyDayPlan.slice(start, weekIndex === 3 ? 30 : start + 7);
    return {
      week: weekIndex + 1,
      theme,
      objective:
        weekIndex === 0
          ? "Diminuir ruído e escolher uma prioridade."
          : weekIndex === 1
            ? "Transformar prioridade em ação curta."
            : weekIndex === 2
              ? "Ajustar ambiente, horário e retomada."
              : "Revisar, adaptar e fechar o ciclo.",
      missions
    };
  });
}

export function buildEvolutionSeries(result: DiagnosticResult, done: number[]) {
  const base = Math.max(24, result.viradaIndex - 11);
  return [base, base + 3, base + 5, result.viradaIndex, result.viradaIndex + Math.min(8, done.length)];
}
