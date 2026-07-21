import { AnswerMap, PillarKey, pillars, questions } from "@/lib/questions";

export type PillarScore = {
  key: PillarKey;
  name: string;
  score: number;
  color: string;
  description: string;
};

export type Contradiction = {
  key: string;
  title: string;
  detail: string;
  severity: "low" | "medium" | "high";
};

export type DiagnosticResult = {
  viradaIndex: number;
  pillarScores: PillarScore[];
  mainBlocker: PillarScore;
  topBlockers: PillarScore[];
  confidence: "baixa" | "média" | "alta";
  confidenceScore: number;
  contradictions: Contradiction[];
  pattern: string;
  freeAction: string;
  preview: string[];
  thirtyDayPlan: DailyMission[];
};

export type DailyMission = {
  day: number;
  title: string;
  minutes: number;
  pillar: PillarKey;
  instruction: string;
};

const pillarKeys = Object.keys(pillars) as PillarKey[];

function normalize(questionKey: string, value: number): number {
  const question = questions.find((item) => item.key === questionKey);
  if (!question) return 0;
  const clamped = Math.max(1, Math.min(5, value));
  const raw = ((clamped - 1) / 4) * 100;
  return Math.round(question.inverted ? 100 - raw : raw);
}

function mean(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function band(value: number): "baixo" | "médio" | "alto" {
  if (value < 40) return "baixo";
  if (value < 70) return "médio";
  return "alto";
}

export function detectContradictions(answers: AnswerMap): Contradiction[] {
  const contradictions: Contradiction[] = [];

  if ((answers.priority_defined ?? 0) >= 4 && (answers.too_many_goals ?? 0) >= 4) {
    contradictions.push({
      key: "direction-overload",
      title: "Direção declarada com excesso de frentes",
      detail:
        "Você indica ter prioridade, mas também tenta mudar muitas áreas ao mesmo tempo. O plano precisa proteger foco.",
      severity: "medium"
    });
  }

  if ((answers.focus_blocks ?? 0) >= 4 && (answers.screen_time_high ?? 0) >= 4) {
    contradictions.push({
      key: "focus-screen",
      title: "Foco possível, mas distração ainda alta",
      detail:
        "Há capacidade de foco curto, porém o celular aparece como vazamento relevante de tempo.",
      severity: "low"
    });
  }

  if ((answers.keeps_small_commitments ?? 0) >= 4 && (answers.abandons_plans ?? 0) >= 4) {
    contradictions.push({
      key: "commitment-abandon",
      title: "Compromissos pequenos funcionam, planos grandes não",
      detail:
        "Isso sugere que sua virada deve começar por ações menores, com menos fricção e revisão semanal.",
      severity: "high"
    });
  }

  return contradictions;
}

export function scoreDiagnostic(answers: AnswerMap): DiagnosticResult {
  const pillarScores = pillarKeys.map((key) => {
    const values = questions
      .filter((question) => question.pillar === key)
      .map((question) => normalize(question.key, answers[question.key] ?? 3));

    return {
      key,
      name: pillars[key].name,
      score: mean(values),
      color: pillars[key].color,
      description: pillars[key].description
    };
  });

  const sortedAscending = [...pillarScores].sort((a, b) => a.score - b.score);
  const mainBlocker = sortedAscending[0];
  const topBlockers = sortedAscending.slice(0, 3);
  const viradaIndex = Math.round(
    pillarScores.reduce((sum, item) => sum + item.score, 0) / pillarScores.length
  );
  const answeredCount = questions.filter((question) => answers[question.key] !== undefined).length;
  const completeness = answeredCount / questions.length;
  const contradictions = detectContradictions(answers);
  const confidenceScore = Math.round(
    Math.max(0.35, completeness - contradictions.length * 0.06) * 100
  );
  const confidence = confidenceScore >= 78 ? "alta" : confidenceScore >= 58 ? "média" : "baixa";
  const blockerBand = band(mainBlocker.score);

  return {
    viradaIndex,
    pillarScores,
    mainBlocker,
    topBlockers,
    confidence,
    confidenceScore,
    contradictions,
    pattern: buildPattern(mainBlocker.key, blockerBand),
    freeAction: buildFreeAction(mainBlocker.key),
    preview: buildPreview(topBlockers),
    thirtyDayPlan: buildThirtyDayPlan(mainBlocker.key, topBlockers.map((item) => item.key))
  };
}

function buildPattern(key: PillarKey, blockerBand: "baixo" | "médio" | "alto"): string {
  const patterns: Record<PillarKey, string> = {
    clarity:
      "O principal ponto de bloqueio parece ser falta de prioridade clara. Quando tudo concorre ao mesmo tempo, o plano fica pesado e a execução perde tração.",
    execution:
      "Seu padrão sugere intenção real, mas baixa proteção para continuidade. A virada deve começar por compromissos pequenos que sobrevivem a dias comuns.",
    time:
      "Seu tempo parece estar sendo fragmentado por distrações e demandas reativas. Antes de criar uma rotina maior, é preciso recuperar blocos curtos de atenção.",
    routine:
      "A organização diária ainda não sustenta suas decisões. Pequenos rituais de abertura e fechamento podem reduzir a sensação de dias soltos.",
    money:
      "A falta de visibilidade financeira básica parece consumir energia mental. O objetivo inicial não é planilha perfeita, é controle simples e recorrente.",
    energy:
      "Seu nível de energia aparece como limitador prático. O plano precisa respeitar seu corpo e começar por ações curtas, com menos atrito."
  };

  const severity =
    blockerBand === "baixo"
      ? "Esse é um bloqueio forte agora."
      : blockerBand === "médio"
        ? "Esse bloqueio ainda pesa, mas já existe base para avançar."
        : "Essa área não está ruim, mas é a menor alavanca entre as avaliadas.";

  return `${patterns[key]} ${severity}`;
}

function buildFreeAction(key: PillarKey): string {
  const actions: Record<PillarKey, string> = {
    clarity:
      "Escolha uma única meta de 30 dias e escreva uma ação de 15 minutos que possa ser feita hoje.",
    execution:
      "Reduza sua próxima ação até ela caber em 10 minutos e marque um horário específico para executá-la.",
    time:
      "Defina um bloco de 20 minutos sem notificações e deixe o celular fora do alcance físico.",
    routine:
      "Prepare uma lista de três itens para amanhã: uma prioridade, uma obrigação e uma pequena manutenção.",
    money:
      "Liste os cinco maiores gastos recentes e escolha um limite simples para gastos variáveis desta semana.",
    energy:
      "Escolha uma ação de energia de baixo atrito para hoje: água, caminhada curta, pausa real ou horário de dormir."
  };

  return actions[key];
}

function buildPreview(blockers: PillarScore[]): string[] {
  return [
    `Plano priorizando ${blockers[0].name.toLowerCase()}`,
    `Ações calibradas para ${blockers[1].name.toLowerCase()} e ${blockers[2].name.toLowerCase()}`,
    "Rotina matinal e noturna enxutas",
    "Estratégia de retomada depois de falhas",
    "PDF completo com checklists e visão semanal"
  ];
}

function buildThirtyDayPlan(primary: PillarKey, blockers: PillarKey[]): DailyMission[] {
  const missionByPillar: Record<PillarKey, string[]> = {
    clarity: [
      "Defina a meta única dos próximos 30 dias",
      "Escreva o motivo prático dessa meta",
      "Remova uma meta concorrente da semana",
      "Transforme a meta em um primeiro passo de 15 minutos",
      "Revise se a prioridade ainda está clara"
    ],
    execution: [
      "Execute a menor versão possível da sua ação principal",
      "Registre o que dificultou a constância hoje",
      "Crie uma regra de retomada para dias ruins",
      "Repita uma ação pequena antes de aumentar o plano",
      "Comemore evidência de execução, não perfeição"
    ],
    time: [
      "Faça um bloco de foco de 20 minutos",
      "Desative notificações de um app por 24 horas",
      "Defina dois horários para checar mensagens",
      "Remova uma distração do ambiente",
      "Revise onde o tempo vazou hoje"
    ],
    routine: [
      "Escolha uma âncora matinal de 5 minutos",
      "Prepare o ambiente para a primeira ação de amanhã",
      "Feche o dia com três linhas de revisão",
      "Agrupe tarefas pequenas em um único bloco",
      "Simplifique uma rotina que ficou pesada"
    ],
    money: [
      "Anote os gastos variáveis de hoje",
      "Defina um teto semanal simples",
      "Cancele ou pausar uma despesa sem uso",
      "Revise compras por impulso dos últimos sete dias",
      "Separe uma categoria para observar nesta semana"
    ],
    energy: [
      "Faça uma pausa real de 10 minutos",
      "Planeje um horário de desligamento à noite",
      "Inclua uma caminhada curta ou alongamento",
      "Troque uma exigência alta por uma ação leve",
      "Observe o que mais drenou energia hoje"
    ]
  };

  const rotation = [primary, ...blockers.filter((key) => key !== primary)];
  while (rotation.length < 3) {
    const next = pillarKeys.find((key) => !rotation.includes(key));
    if (!next) break;
    rotation.push(next);
  }

  return Array.from({ length: 30 }, (_, index) => {
    const pillar = rotation[index % rotation.length];
    const missionPool = missionByPillar[pillar];
    const title = missionPool[index % missionPool.length];

    return {
      day: index + 1,
      title,
      pillar,
      minutes: index % 5 === 0 ? 30 : index % 2 === 0 ? 20 : 10,
      instruction:
        "Faça a versão possível hoje. Se o dia estiver difícil, reduza a ação pela metade e registre a retomada."
    };
  });
}

export function getScoreBand(score: number): string {
  if (score < 35) return "crítico";
  if (score < 55) return "atenção";
  if (score < 75) return "em construção";
  return "forte";
}
