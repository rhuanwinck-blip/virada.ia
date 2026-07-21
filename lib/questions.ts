import {
  ArrowUpRight,
  BatteryCharging,
  CalendarCheck2,
  Clock3,
  Compass,
  CreditCard,
  LucideIcon,
  Repeat2
} from "lucide-react";

export type PillarKey =
  | "clarity"
  | "execution"
  | "time"
  | "routine"
  | "money"
  | "energy";

export type Question = {
  key: string;
  pillar: PillarKey;
  label: string;
  helper: string;
  kind: "scale" | "choice";
  inverted?: boolean;
  options?: { value: number; label: string }[];
};

export type AnswerMap = Record<string, number>;

export const pillars: Record<
  PillarKey,
  {
    name: string;
    shortName: string;
    color: string;
    description: string;
    icon: LucideIcon;
  }
> = {
  clarity: {
    name: "Clareza e direção",
    shortName: "Clareza",
    color: "#5DFFB4",
    description: "Prioridade, metas e senso de direção para os próximos dias.",
    icon: Compass
  },
  execution: {
    name: "Execução e constância",
    shortName: "Execução",
    color: "#5C8DFF",
    description: "Capacidade de transformar intenção em ação repetida.",
    icon: Repeat2
  },
  time: {
    name: "Tempo e distrações",
    shortName: "Tempo",
    color: "#9C6BFF",
    description: "Controle do celular, mensagens, urgências e foco profundo.",
    icon: Clock3
  },
  routine: {
    name: "Rotina e organização",
    shortName: "Rotina",
    color: "#D6B978",
    description: "Ambiente, agenda, começo do dia e fechamento da noite.",
    icon: CalendarCheck2
  },
  money: {
    name: "Dinheiro e controle",
    shortName: "Dinheiro",
    color: "#16C784",
    description: "Visibilidade básica de gastos, compromissos e limites.",
    icon: CreditCard
  },
  energy: {
    name: "Energia e hábitos",
    shortName: "Energia",
    color: "#FF7068",
    description: "Sono, alimentação, pausas e nível prático de energia diária.",
    icon: BatteryCharging
  }
};

export const questions: Question[] = [
  {
    key: "priority_defined",
    pillar: "clarity",
    kind: "scale",
    label: "Hoje você consegue dizer qual é sua prioridade principal dos próximos 30 dias?",
    helper: "Não precisa ser uma meta perfeita. Pense no que guiaria suas decisões amanhã."
  },
  {
    key: "too_many_goals",
    pillar: "clarity",
    kind: "scale",
    inverted: true,
    label: "Você tenta melhorar várias áreas ao mesmo tempo?",
    helper: "Exemplo: rotina, dinheiro, treino, estudos e trabalho na mesma semana."
  },
  {
    key: "clear_next_step",
    pillar: "clarity",
    kind: "scale",
    label: "Quando acorda, você sabe qual pequeno passo faria o dia valer a pena?",
    helper: "Um passo simples, possível e conectado ao que importa."
  },
  {
    key: "abandons_plans",
    pillar: "execution",
    kind: "scale",
    inverted: true,
    label: "Você costuma iniciar planos e abandonar antes de enxergar resultado?",
    helper: "Considere projetos pessoais, estudos, treinos, organização ou finanças."
  },
  {
    key: "keeps_small_commitments",
    pillar: "execution",
    kind: "scale",
    label: "Você cumpre pequenos compromissos mesmo em dias comuns?",
    helper: "Pequenos compromissos contam mais que grandes viradas ocasionais."
  },
  {
    key: "restarts_after_failure",
    pillar: "execution",
    kind: "scale",
    label: "Quando falha um dia, você consegue reduzir o plano e retomar?",
    helper: "A retomada é mais importante que manter uma sequência perfeita."
  },
  {
    key: "screen_time_high",
    pillar: "time",
    kind: "scale",
    inverted: true,
    label: "O celular consome mais tempo do que você gostaria?",
    helper: "Pense em redes sociais, vídeos curtos, mensagens e checagens automáticas."
  },
  {
    key: "focus_blocks",
    pillar: "time",
    kind: "scale",
    label: "Você consegue reservar blocos de 20 minutos sem interrupções?",
    helper: "Blocos curtos já são suficientes para gerar tração."
  },
  {
    key: "reactive_days",
    pillar: "time",
    kind: "scale",
    inverted: true,
    label: "Seu dia costuma ser dominado por mensagens, urgências e obrigações dos outros?",
    helper: "A sensação é viver reagindo, não escolhendo."
  },
  {
    key: "morning_anchor",
    pillar: "routine",
    kind: "scale",
    label: "Você tem algum ritual simples para começar o dia com direção?",
    helper: "Pode ser olhar a agenda, escolher uma ação ou preparar o ambiente."
  },
  {
    key: "night_review",
    pillar: "routine",
    kind: "scale",
    label: "Você fecha o dia sabendo o que avançou e o que fica para amanhã?",
    helper: "Sem julgamento: só uma revisão curta e objetiva."
  },
  {
    key: "environment_friction",
    pillar: "routine",
    kind: "scale",
    inverted: true,
    label: "Seu ambiente aumenta a chance de distração ou bagunça?",
    helper: "Mesa, notificações, abas abertas, objetos e tarefas soltas."
  },
  {
    key: "knows_spending",
    pillar: "money",
    kind: "scale",
    label: "Você sabe para onde foi a maior parte do seu dinheiro no último mês?",
    helper: "Não é contabilidade completa. É visibilidade básica."
  },
  {
    key: "spending_surprises",
    pillar: "money",
    kind: "scale",
    inverted: true,
    label: "O fim do mês costuma trazer surpresas financeiras?",
    helper: "Gastos pequenos, assinaturas, parcelas ou compras por impulso."
  },
  {
    key: "has_basic_limit",
    pillar: "money",
    kind: "scale",
    label: "Você tem um limite simples para gastos variáveis da semana?",
    helper: "Um teto simples já reduz bastante a confusão."
  },
  {
    key: "sleep_supports_day",
    pillar: "energy",
    kind: "scale",
    label: "Seu sono costuma sustentar bem o dia seguinte?",
    helper: "Pense em regularidade e sensação de energia, não em perfeição."
  },
  {
    key: "energy_crashes",
    pillar: "energy",
    kind: "scale",
    inverted: true,
    label: "Você tem quedas fortes de energia que derrubam seus planos?",
    helper: "Quedas que fazem você trocar intenção por sobrevivência."
  },
  {
    key: "daily_movement",
    pillar: "energy",
    kind: "scale",
    label: "Você inclui alguma pausa, caminhada ou movimento no dia?",
    helper: "Mesmo 5 a 10 minutos contam."
  },
  {
    key: "current_moment",
    pillar: "clarity",
    kind: "choice",
    label: "Qual frase mais parece seu momento atual?",
    helper: "Isso ajuda a personalizar a leitura do resultado.",
    options: [
      { value: 2, label: "Tenho muita vontade, mas pouca direção" },
      { value: 3, label: "Tenho direção, mas pouca constância" },
      { value: 4, label: "Estou razoavelmente organizado e quero avançar" },
      { value: 1, label: "Estou sobrecarregado e não sei por onde começar" }
    ]
  }
];

export const demoAnswers: AnswerMap = {
  priority_defined: 2,
  too_many_goals: 5,
  clear_next_step: 2,
  abandons_plans: 4,
  keeps_small_commitments: 2,
  restarts_after_failure: 2,
  screen_time_high: 5,
  focus_blocks: 2,
  reactive_days: 4,
  morning_anchor: 1,
  night_review: 2,
  environment_friction: 4,
  knows_spending: 2,
  spending_surprises: 4,
  has_basic_limit: 1,
  sleep_supports_day: 3,
  energy_crashes: 4,
  daily_movement: 2,
  current_moment: 2
};

export const painOptions = [
  "Quero mudar, mas não sei por onde começar",
  "Começo projetos e abandono",
  "Perco muito tempo no celular",
  "Não sei onde meu dinheiro foi parar",
  "Minha rotina controla minhas decisões",
  "Sinto que tenho potencial, mas falta organização"
];

export const planTiers = [
  {
    key: "free",
    name: "Plano gratuito",
    price: "R$ 0",
    accent: "#5C8DFF",
    bullets: [
      "Índice de Virada",
      "Pontuação resumida dos seis pilares",
      "Principal ponto de bloqueio",
      "Uma ação imediata"
    ]
  },
  {
    key: "one-time",
    name: "Plano da Virada 30",
    price: "R$ 47,00",
    accent: "#5DFFB4",
    featured: true,
    bullets: [
      "Análise completa",
      "Três bloqueios principais",
      "Plano diário de 30 dias",
      "Rotinas, checklists e PDF"
    ]
  },
  {
    key: "pro",
    name: "Virada Pro",
    price: "R$ 59,90/mês",
    accent: "#D6B978",
    bullets: [
      "Tudo do plano de 30 dias",
      "Check-in semanal",
      "Adaptação do plano",
      "Histórico de evolução"
    ]
  }
];

export const disclaimer =
  "O Virada IA oferece uma análise educacional baseada nas informações fornecidas pelo usuário. Não realiza diagnóstico médico ou psicológico e não substitui profissionais de saúde, psicologia, finanças, contabilidade ou outras áreas especializadas.";

export const showcaseSteps = [
  {
    kicker: "01",
    title: "Índice de Virada",
    body: "Uma leitura objetiva do quanto sua rotina atual sustenta progresso real.",
    icon: ArrowUpRight
  },
  {
    kicker: "02",
    title: "Principal bloqueio",
    body: "O sistema identifica a área que mais parece travar as demais.",
    icon: Compass
  },
  {
    kicker: "03",
    title: "Plano de 30 dias",
    body: "Uma prioridade, ações curtas e retomada planejada para dias imperfeitos.",
    icon: CalendarCheck2
  }
];
