import type { FinancialCategory } from "@/lib/financial-provider";

export type PersonalOsAreaId = "inicio" | "jornada" | "agenda" | "financas" | "agentes";

export type PersonalOsArea = {
  id: PersonalOsAreaId;
  label: string;
  description: string;
};

export type JourneyGoal = {
  id: string;
  title: string;
  area: "Carreira" | "Saude" | "Financeiro" | "Relacionamentos" | "Aprendizado" | "Casa";
  target: string;
  current: string;
  deadline: string;
  progress: number;
  nextAction: string;
  financialLink?: string;
  conflict?: string;
};

export type LifeArea = {
  id: string;
  label: string;
  score: number;
  signal: string;
  nextReview: string;
};

export type HabitSignal = {
  id: string;
  title: string;
  streak: number;
  target: string;
  today: "feito" | "pendente" | "reduzido";
};

export type AgendaItem = {
  id: string;
  kind: "compromisso" | "tarefa" | "projeto" | "rotina" | "lembrete" | "follow_up" | "financeiro";
  title: string;
  date: string;
  start?: string;
  end?: string;
  priority: "critica" | "alta" | "media" | "baixa";
  durationMinutes: number;
  status: "pendente" | "em_andamento" | "concluida" | "atrasada" | "aguardando" | "agendado";
  owner?: string;
  location?: string;
  participants?: string[];
  subtasks: string[];
  reminders: string[];
  notes?: string;
};

export type ProjectSignal = {
  id: string;
  title: string;
  objective: string;
  progress: number;
  deadline: string;
  nextStep: string;
  risk: string;
};

export type FinancialCommitment = {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  status: "previsto" | "agendado" | "pago" | "atrasado";
  category: FinancialCategory;
  linkedAgendaItemId?: string;
};

export type AiAgent = {
  id: string;
  label: string;
  role: string;
  permissions: string[];
  can: string[];
  cannot: string[];
  currentSuggestion: string;
};

export const personalOsAreas: PersonalOsArea[] = [
  {
    id: "inicio",
    label: "Início",
    description: "Central de comando com agenda, prioridades, riscos e finanças conectadas."
  },
  {
    id: "jornada",
    label: "Sua Jornada",
    description: "Objetivos, metas, hábitos, evolução, marcos, revisões e planos."
  },
  {
    id: "agenda",
    label: "Agenda",
    description: "Hoje, calendário, tarefas, projetos, rotinas, lembretes, follow-ups e foco."
  },
  {
    id: "financas",
    label: "Finanças",
    description: "Open Finance, extrato unificado, contas, cartões, faturas, orçamento e metas."
  },
  {
    id: "agentes",
    label: "Agentes de IA",
    description: "Agentes especializados usando contexto autorizado e ações confirmadas."
  }
];

export const journeyTabs = [
  "Visão geral",
  "Áreas da vida",
  "Objetivos",
  "Metas",
  "Plano de ação",
  "Hábitos",
  "Rotinas",
  "Marcos",
  "Evolução",
  "Conquistas",
  "Revisão semanal",
  "Relatórios"
];

export const agendaTabs = [
  "Hoje",
  "Calendário",
  "Compromissos",
  "Tarefas",
  "Projetos",
  "Rotinas",
  "Lembretes",
  "Follow-ups",
  "Caixa de entrada",
  "Modo foco"
];

export const financeTabs = [
  "Visão",
  "Extrato",
  "Contas",
  "Cartões",
  "Faturas",
  "Categorias",
  "Orçamento",
  "Assinaturas",
  "Compromissos",
  "Contas a pagar",
  "Contas a receber",
  "Metas financeiras",
  "Investimentos",
  "Relatórios",
  "Conexões"
];

export const demoLifeAreas: LifeArea[] = [
  { id: "life-career", label: "Carreira", score: 72, signal: "Produto digital com proximo passo travado por pagamento.", nextReview: "Sexta 17:00" },
  { id: "life-health", label: "Saúde", score: 61, signal: "Academia mantida, sono abaixo do ideal em dois dias.", nextReview: "Domingo 20:30" },
  { id: "life-finance", label: "Financeiro", score: 68, signal: "Meta do carro avanca se aporte mensal continuar.", nextReview: "Quinta 08:20" },
  { id: "life-learning", label: "Aprendizado", score: 54, signal: "Estudo precisa de bloco protegido antes da noite.", nextReview: "Hoje 16:10" }
];

export const demoJourneyGoals: JourneyGoal[] = [
  {
    id: "goal-product",
    title: "Criar uma renda extra",
    area: "Carreira",
    target: "Lançar meu produto digital",
    current: "Página de pagamento em revisão",
    deadline: "30 dias",
    progress: 42,
    nextAction: "Revisar a página de pagamento durante 20 minutos.",
    conflict: "Disputa agenda com orçamento do cliente."
  },
  {
    id: "goal-car",
    title: "Comprar um carro",
    area: "Financeiro",
    target: "Juntar R$ 20.000",
    current: "R$ 6.800 acumulados",
    deadline: "12 meses",
    progress: 34,
    nextAction: "Confirmar aporte mensal de R$ 700 na quinta.",
    financialLink: "financial-goal-car"
  },
  {
    id: "goal-health",
    title: "Ter uma rotina mais estável",
    area: "Saude",
    target: "Treinar 3x por semana e dormir antes das 23h",
    current: "2 treinos feitos, sono irregular",
    deadline: "Semanal",
    progress: 58,
    nextAction: "Versão reduzida: 12 minutos de mobilidade se perder academia."
  }
];

export const demoHabits: HabitSignal[] = [
  { id: "habit-priority", title: "Revisar prioridades", streak: 8, target: "Dias úteis 08:00", today: "feito" },
  { id: "habit-study", title: "Estudo de certificação", streak: 3, target: "4 blocos por semana", today: "pendente" },
  { id: "habit-night", title: "Resumo da noite", streak: 5, target: "Domingo a quinta 21:30", today: "reduzido" }
];

export const demoAgendaItems: AgendaItem[] = [
  {
    id: "agenda-standup",
    kind: "compromisso",
    title: "Reunião de alinhamento",
    date: "Hoje",
    start: "09:30",
    end: "10:00",
    priority: "media",
    durationMinutes: 30,
    status: "concluida",
    participants: ["Equipe"],
    subtasks: ["Registrar decisões", "Mover pendências para projetos"],
    reminders: ["10 min antes"]
  },
  {
    id: "agenda-budget",
    kind: "tarefa",
    title: "Terminar orçamento do cliente",
    date: "Hoje",
    start: "16:30",
    end: "17:10",
    priority: "alta",
    durationMinutes: 40,
    status: "em_andamento",
    owner: "Você",
    subtasks: ["Conferir custos", "Revisar margem", "Enviar PDF"],
    reminders: ["15:30", "Acompanhar se não concluir"]
  },
  {
    id: "agenda-insurance",
    kind: "financeiro",
    title: "Pagar seguro auto",
    date: "Sexta",
    start: "10:30",
    end: "10:40",
    priority: "critica",
    durationMinutes: 10,
    status: "agendado",
    subtasks: ["Conferir boleto", "Pagar no app do banco", "Anexar comprovante"],
    reminders: ["Quinta 18:00", "Sexta 09:30", "Sexta 14:00 se não confirmar"],
    notes: "Criado a partir do compromisso financeiro."
  },
  {
    id: "agenda-dentist",
    kind: "compromisso",
    title: "Dentista",
    date: "Amanhã",
    start: "14:00",
    end: "15:00",
    priority: "media",
    durationMinutes: 60,
    status: "pendente",
    location: "Centro",
    subtasks: ["Confirmar endereço", "Reservar 25 min de deslocamento"],
    reminders: ["Amanhã 12:45", "Acompanhar retorno"]
  }
];

export const demoProjects: ProjectSignal[] = [
  {
    id: "project-payment-page",
    title: "Página de pagamento",
    objective: "Aumentar conversão do produto digital",
    progress: 58,
    deadline: "Quarta",
    nextStep: "Revisar prova de valor e botão de checkout.",
    risk: "Pagamento não pode ser quebrado durante o redesign."
  },
  {
    id: "project-commercial-proposal",
    title: "Proposta comercial",
    objective: "Enviar proposta clara ao cliente ACME",
    progress: 64,
    deadline: "Quinta",
    nextStep: "Fechar escopo e anexar PDF.",
    risk: "Custo de implementação ainda aberto."
  }
];

export const demoFinancialCommitments: FinancialCommitment[] = [
  {
    id: "commit-insurance",
    title: "Seguro auto",
    dueDate: "2026-07-24",
    amount: 318.2,
    status: "agendado",
    category: "servicos",
    linkedAgendaItemId: "agenda-insurance"
  },
  {
    id: "commit-internet",
    title: "Internet residencial",
    dueDate: "2026-07-23",
    amount: 119.9,
    status: "previsto",
    category: "moradia"
  },
  {
    id: "commit-car-goal",
    title: "Aporte meta carro",
    dueDate: "2026-07-25",
    amount: 700,
    status: "previsto",
    category: "investimentos"
  }
];

export const demoAgents: AiAgent[] = [
  {
    id: "agent-personal",
    label: "Assessor Pessoal",
    role: "Organiza o dia, cria compromissos, lembra e acompanha pendências.",
    permissions: ["agenda", "tarefas", "memoria", "notificacoes"],
    can: ["preparar briefing", "criar rascunhos", "reorganizar atrasos"],
    cannot: ["enviar mensagem externa sem confirmação"],
    currentSuggestion: "Posso mover o estudo para o bloco livre antes da academia."
  },
  {
    id: "agent-planner",
    label: "Planejador",
    role: "Transforma objetivos em planos semanais e prioridades.",
    permissions: ["jornada", "agenda", "projetos"],
    can: ["montar semana", "encontrar conflitos", "sugerir sequência"],
    cannot: ["apagar metas sem confirmação"],
    currentSuggestion: "A meta do produto digital precisa de dois blocos protegidos."
  },
  {
    id: "agent-finance",
    label: "Financeiro",
    role: "Consulta dados autorizados, explica gastos, categoriza e alerta vencimentos.",
    permissions: ["financas_mascaradas", "agenda_financeira"],
    can: ["resumir mês", "identificar recorrências", "criar lembrete financeiro"],
    cannot: ["movimentar dinheiro", "recomendar investimento específico", "alterar dado bruto"],
    currentSuggestion: "Existem três cobranças recorrentes prováveis em sandbox."
  },
  {
    id: "agent-projects",
    label: "Projetos",
    role: "Divide etapas, acompanha prazos e identifica bloqueios.",
    permissions: ["projetos", "tarefas"],
    can: ["quebrar entregas", "sugerir próximo passo", "registrar bloqueio"],
    cannot: ["concluir etapa sozinho"],
    currentSuggestion: "A proposta comercial precisa de revisão de margem hoje."
  },
  {
    id: "agent-comms",
    label: "Comunicação",
    role: "Prepara mensagens, e-mails e cobranças educadas.",
    permissions: ["follow_ups", "contatos"],
    can: ["rascunhar mensagem", "ajustar tom", "agendar cobrança"],
    cannot: ["enviar sem consentimento"],
    currentSuggestion: "Posso preparar a cobrança do fornecedor para quinta."
  },
  {
    id: "agent-followup",
    label: "Follow-up",
    role: "Acompanha itens dependentes de terceiros.",
    permissions: ["follow_ups", "notificacoes"],
    can: ["lembrar de cobrar", "registrar resposta", "sugerir novo contato"],
    cannot: ["pressionar contato automaticamente"],
    currentSuggestion: "Cliente ACME precisa de retorno até sexta 15:00."
  }
];

export const personalOsOnboardingSteps = [
  "Ativação do sistema",
  "Nome",
  "Objetivos",
  "Horários de trabalho",
  "Compromissos fixos",
  "Rotina",
  "Horário silencioso",
  "Google Calendar",
  "Notificações",
  "WhatsApp",
  "Open Finance",
  "Contas manuais",
  "Primeira meta",
  "Gerar primeiro dia",
  "Primeiro briefing"
];

export function buildPersonalOsBriefing() {
  const openTasks = demoAgendaItems.filter((item) => item.status !== "concluida" && item.kind !== "compromisso");
  const commitments = demoFinancialCommitments.filter((item) => item.status !== "pago");
  const nextCommitment = commitments.sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  const topGoal = demoJourneyGoals.sort((a, b) => b.progress - a.progress)[0];

  return {
    greeting: "Boa tarde, Rhuan.",
    summary: `Você tem 3 compromissos, ${openTasks.length} tarefas prioritárias e uma fatura sandbox vencendo em breve.`,
    organizationScore: 74,
    generalProgress: 61,
    riskLevel: "moderado",
    nextCommitment,
    topGoal,
    freeWindow: "45 minutos livres antes da reunião de revisão",
    recommendation: "Posso colocar a tarefa do orçamento nesse período e criar lembrete para o seguro."
  };
}

export function classifyUniversalInboxInput(text: string) {
  const lower = text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  if (/(quanto gastei|gastei|contas vencem|fatura|saldo|extrato)/.test(lower)) {
    return {
      type: "consulta_financeira",
      targetArea: "Finanças",
      requiresConfirmation: false,
      summary: "Consulta financeira preparada com dados agregados e mascarados."
    };
  }

  if (/(pagar|boleto|seguro|vence|receber)/.test(lower)) {
    return {
      type: "compromisso_financeiro",
      targetArea: "Finanças + Agenda + Início",
      requiresConfirmation: true,
      summary: "Vou criar uma conta a pagar, adicionar na agenda e acompanhar depois do vencimento."
    };
  }

  if (/(juntar|economizar|comprar um carro|meta financeira)/.test(lower)) {
    return {
      type: "meta_financeira",
      targetArea: "Sua Jornada + Finanças",
      requiresConfirmation: true,
      summary: "Vou criar uma meta na Jornada e uma meta financeira vinculada."
    };
  }

  if (/(reuniao|dentista|consulta|amanha|hoje|sexta)/.test(lower)) {
    return {
      type: "agenda",
      targetArea: "Agenda",
      requiresConfirmation: true,
      summary: "Vou criar um rascunho de compromisso com horário e lembretes."
    };
  }

  return {
    type: "inbox",
    targetArea: "Caixa de entrada",
    requiresConfirmation: true,
    summary: "Vou classificar isso antes de transformar em ação."
  };
}
