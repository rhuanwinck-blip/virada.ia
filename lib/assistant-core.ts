export type AssistantSectionId =
  | "central"
  | "today"
  | "assistant"
  | "calendar"
  | "tasks"
  | "projects"
  | "routines"
  | "inbox"
  | "focus"
  | "followups"
  | "memory"
  | "notifications"
  | "integrations"
  | "subscription"
  | "settings";

export type AssistantNavigationItem = {
  id: AssistantSectionId;
  label: string;
  description: string;
  group: "Comando" | "Organizacao" | "Acompanhamento" | "Sistema";
};

export type AssistantActionType =
  | "event"
  | "task"
  | "reminder"
  | "routine"
  | "project"
  | "follow_up"
  | "financial_query"
  | "financial_commitment"
  | "financial_goal"
  | "note";

export type AssistantPriority = "critica" | "alta" | "media" | "baixa";

export type AssistantDraftAction = {
  id: string;
  type: AssistantActionType;
  title: string;
  summary: string;
  dateLabel: string;
  timeLabel?: string;
  durationMinutes?: number;
  priority: AssistantPriority;
  confidence: number;
  needsConfirmation: boolean;
  missing: string[];
  followUpQuestion?: string;
  sourceText: string;
};

export type AssistantTask = {
  id: string;
  title: string;
  project?: string;
  priority: AssistantPriority;
  due: string;
  time?: string;
  durationMinutes: number;
  status: "pendente" | "em_andamento" | "concluida" | "atrasada";
  subtasks: string[];
  reminders: string[];
};

export type AssistantEvent = {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  location?: string;
  participants: string[];
  travelMinutes?: number;
  recurring?: string;
  source: "manual" | "google_demo" | "assistant";
};

export type AssistantProject = {
  id: string;
  title: string;
  goal: string;
  deadline: string;
  progress: number;
  nextSteps: string[];
  risks: string[];
  owner: string;
};

export type AssistantRoutine = {
  id: string;
  title: string;
  schedule: string;
  durationMinutes: number;
  channel: "painel" | "push" | "whatsapp" | "email";
  status: "ativa" | "pausada";
  reducedVersion: string;
};

export type AssistantFollowUp = {
  id: string;
  title: string;
  waitingFor: string;
  checkAt: string;
  nextAction: string;
  channel: "painel" | "whatsapp" | "email";
};

export type AssistantMemory = {
  id: string;
  label: string;
  value: string;
  category: "agenda" | "pessoas" | "locais" | "preferencias" | "prioridades";
  editable: boolean;
};

export type AssistantNotification = {
  id: string;
  title: string;
  channel: "painel" | "push" | "whatsapp" | "email" | "calendar";
  cadence: string;
  consent: boolean;
};

export type IntegrationState = {
  id: "google_calendar" | "whatsapp" | "push" | "email" | "openai" | "open_finance";
  label: string;
  status: "demo" | "ready" | "needs_credentials" | "connected";
  description: string;
  requiredEnv: string[];
};

export const assistantNavigation: AssistantNavigationItem[] = [
  { id: "central", label: "Central", description: "Comando do dia, inbox e proximas decisoes.", group: "Comando" },
  { id: "today", label: "Meu Dia", description: "Agenda, tarefas, tempo livre, conflitos e progresso.", group: "Comando" },
  { id: "assistant", label: "Assessor IA", description: "Chat por texto e audio com confirmacao antes de agir.", group: "Comando" },
  { id: "calendar", label: "Agenda", description: "Dia, semana, recorrencias, conflitos e deslocamento.", group: "Organizacao" },
  { id: "tasks", label: "Tarefas", description: "Prioridade, prazo, duracao, subtarefas e status.", group: "Organizacao" },
  { id: "projects", label: "Projetos", description: "Objetivos, prazos, progresso, atrasos e proximos passos.", group: "Organizacao" },
  { id: "routines", label: "Rotinas", description: "Rotinas naturais, recorrencias, pausas e versoes reduzidas.", group: "Organizacao" },
  { id: "inbox", label: "Caixa de Entrada", description: "Despejo de ideias, audios, arquivos e pendencias.", group: "Organizacao" },
  { id: "focus", label: "Foco", description: "Cronometro, tarefa atual, passos e nota rapida.", group: "Acompanhamento" },
  { id: "followups", label: "Follow-ups", description: "Coisas que dependem de outras pessoas.", group: "Acompanhamento" },
  { id: "memory", label: "Memoria", description: "Preferencias pessoais visiveis, editaveis e removiveis.", group: "Acompanhamento" },
  { id: "notifications", label: "Notificacoes", description: "Canais, antecedencia, silencio e consentimento.", group: "Sistema" },
  { id: "integrations", label: "Integracoes", description: "Google Calendar, WhatsApp, e-mail, push e OpenAI.", group: "Sistema" },
  { id: "subscription", label: "Assinatura", description: "Plano, pagamento, acesso e cancelamento.", group: "Sistema" },
  { id: "settings", label: "Configuracoes", description: "Horario de trabalho, silencio, privacidade e dados.", group: "Sistema" }
];

export const demoEvents: AssistantEvent[] = [
  {
    id: "evt-standup",
    title: "Reuniao de alinhamento",
    date: "Hoje",
    start: "09:30",
    end: "10:00",
    participants: ["Equipe"],
    source: "google_demo"
  },
  {
    id: "evt-dentist",
    title: "Dentista",
    date: "Amanha",
    start: "14:00",
    end: "15:00",
    location: "Centro",
    travelMinutes: 25,
    participants: [],
    source: "assistant"
  },
  {
    id: "evt-gym",
    title: "Academia",
    date: "Hoje",
    start: "18:20",
    end: "19:10",
    recurring: "Segunda, quarta e sexta",
    participants: [],
    source: "manual"
  }
];

export const demoTasks: AssistantTask[] = [
  {
    id: "tsk-budget",
    title: "Terminar orcamento do cliente",
    project: "Proposta comercial",
    priority: "alta",
    due: "Quarta",
    time: "16:30",
    durationMinutes: 40,
    status: "em_andamento",
    subtasks: ["Conferir custos", "Revisar margem", "Enviar PDF"],
    reminders: ["Hoje 15:30", "Quarta 09:00"]
  },
  {
    id: "tsk-bill",
    title: "Pagar conta de internet",
    priority: "critica",
    due: "Hoje",
    time: "20:00",
    durationMinutes: 6,
    status: "pendente",
    subtasks: ["Abrir app do banco", "Confirmar vencimento", "Salvar comprovante"],
    reminders: ["Hoje 19:00", "Hoje 20:00", "Amanha 09:00 se nao concluir"]
  },
  {
    id: "tsk-study",
    title: "Estudar 30 minutos",
    project: "Certificacao",
    priority: "media",
    due: "Hoje",
    durationMinutes: 30,
    status: "pendente",
    subtasks: ["Abrir aula", "Anotar 3 pontos", "Marcar proximo topico"],
    reminders: ["No primeiro bloco livre"]
  },
  {
    id: "tsk-sales",
    title: "Conferir vendas da semana",
    priority: "media",
    due: "Segunda",
    time: "08:00",
    durationMinutes: 25,
    status: "pendente",
    subtasks: ["Exportar relatorio", "Marcar anomalias", "Mandar resumo"],
    reminders: ["Toda segunda 07:45"]
  }
];

export const demoProjects: AssistantProject[] = [
  {
    id: "prj-proposal",
    title: "Proposta comercial",
    goal: "Enviar uma proposta clara ate quarta-feira.",
    deadline: "Quarta",
    progress: 58,
    nextSteps: ["Fechar escopo", "Revisar valores", "Preparar envio"],
    risks: ["Cliente pediu retorno rapido", "Custo de implementacao ainda aberto"],
    owner: "Voce"
  },
  {
    id: "prj-cert",
    title: "Certificacao",
    goal: "Estudar quatro blocos por semana sem atropelar agenda.",
    deadline: "30 dias",
    progress: 33,
    nextSteps: ["Escolher modulo de hoje", "Reservar bloco livre", "Registrar duvida"],
    risks: ["Agenda lotada no fim do dia"],
    owner: "Voce"
  }
];

export const demoRoutines: AssistantRoutine[] = [
  {
    id: "rot-priorities",
    title: "Revisar prioridades",
    schedule: "Todo dia as 08:00",
    durationMinutes: 8,
    channel: "push",
    status: "ativa",
    reducedVersion: "Escolher uma unica prioridade"
  },
  {
    id: "rot-sales",
    title: "Conferir vendas",
    schedule: "Toda segunda as 08:00",
    durationMinutes: 25,
    channel: "painel",
    status: "ativa",
    reducedVersion: "Ver total e marcar anomalias"
  },
  {
    id: "rot-night",
    title: "Resumo da noite",
    schedule: "Domingo a quinta as 21:30",
    durationMinutes: 6,
    channel: "painel",
    status: "ativa",
    reducedVersion: "Concluido, pendente, imprevisto"
  }
];

export const demoInbox = [
  { id: "inb-1", text: "Ideia: mandar proposta com duas opcoes de prazo", type: "ideia", status: "classificado" },
  { id: "inb-2", text: "Audio demo: lembrar de ligar para Joao sexta", type: "audio", status: "precisa_confirmar" },
  { id: "inb-3", text: "Arquivo demo: recibo da conta de internet", type: "arquivo", status: "anexado_a_tarefa" }
];

export const demoFollowUps: AssistantFollowUp[] = [
  {
    id: "fol-supplier",
    title: "Cobrar resposta do fornecedor",
    waitingFor: "Fornecedor de materiais",
    checkAt: "Quinta 10:00",
    nextAction: "Se nao responder, enviar mensagem curta pedindo previsao.",
    channel: "whatsapp"
  },
  {
    id: "fol-client",
    title: "Confirmar aprovacao da proposta",
    waitingFor: "Cliente ACME",
    checkAt: "Sexta 15:00",
    nextAction: "Preparar e-mail de follow-up, mas pedir confirmacao antes de enviar.",
    channel: "email"
  }
];

export const demoMemories: AssistantMemory[] = [
  { id: "mem-work", label: "Horario de trabalho", value: "09:00 as 18:00", category: "agenda", editable: true },
  { id: "mem-silent", label: "Horario silencioso", value: "22:00 as 07:00", category: "preferencias", editable: true },
  { id: "mem-gym", label: "Academia", value: "Segunda, quarta e sexta no fim do dia", category: "agenda", editable: true },
  { id: "mem-person", label: "Joao", value: "Contato frequente para alinhamentos comerciais", category: "pessoas", editable: true },
  { id: "mem-priority", label: "Prioridade atual", value: "Fechar proposta comercial antes de iniciar novos projetos", category: "prioridades", editable: true }
];

export const demoNotifications: AssistantNotification[] = [
  { id: "not-morning", title: "Briefing da manha", channel: "push", cadence: "Todo dia util as 07:45", consent: true },
  { id: "not-before", title: "Lembrete antecipado", channel: "painel", cadence: "30 minutos antes", consent: true },
  { id: "not-follow", title: "Acompanhamento depois", channel: "whatsapp", cadence: "Se tarefa critica atrasar", consent: false },
  { id: "not-night", title: "Resumo da noite", channel: "email", cadence: "21:30 quando houver pendencias", consent: false }
];

export const integrations: IntegrationState[] = [
  {
    id: "openai",
    label: "OpenAI",
    status: "needs_credentials",
    description: "IA real para interpretar mensagens, resumir dias e sugerir replanejamento.",
    requiredEnv: ["OPENAI_API_KEY"]
  },
  {
    id: "open_finance",
    label: "Open Finance Pluggy",
    status: "ready",
    description: "Conexao bancaria oficial, somente leitura, com sandbox claro quando faltarem credenciais reais.",
    requiredEnv: ["FINANCIAL_DATA_PROVIDER", "PLUGGY_CLIENT_ID", "PLUGGY_CLIENT_SECRET", "OPEN_FINANCE_SANDBOX"]
  },
  {
    id: "google_calendar",
    label: "Google Calendar",
    status: "ready",
    description: "Eventos, conflitos, recorrencias e convites ficam preparados sem enviar nada sem confirmacao.",
    requiredEnv: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI"]
  },
  {
    id: "whatsapp",
    label: "WhatsApp Cloud API",
    status: "needs_credentials",
    description: "Briefings, lembretes e follow-ups por WhatsApp oficial com consentimento.",
    requiredEnv: ["WHATSAPP_TOKEN", "WHATSAPP_PHONE_NUMBER_ID"]
  },
  {
    id: "push",
    label: "Web Push PWA",
    status: "ready",
    description: "Assinatura de push no navegador para alertas locais e briefing.",
    requiredEnv: ["NEXT_PUBLIC_VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY"]
  },
  {
    id: "email",
    label: "E-mail",
    status: "demo",
    description: "Resumos e confirmacoes por e-mail quando Resend estiver configurado.",
    requiredEnv: ["RESEND_API_KEY", "EMAIL_FROM"]
  }
];

export const onboardingSteps = [
  "Ativar assessor",
  "Confirmar nome",
  "Definir horario de trabalho",
  "Definir horario silencioso",
  "Conectar Google Calendar",
  "Ativar notificacoes",
  "Escolher WhatsApp",
  "Adicionar compromissos fixos",
  "Definir tres prioridades",
  "Gerar primeiro dia",
  "Mostrar primeira notificacao"
];

export function createDraftId(prefix = "draft") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

export function parseAssistantIntent(sourceText: string): AssistantDraftAction {
  const text = sourceText.trim();
  const lower = normalize(text);
  const time = extractTime(lower);
  const dateLabel = extractDateLabel(lower);
  const duration = extractDuration(lower);
  const type = inferActionType(lower);
  const title = buildTitle(text, type);
  const missing = getMissingFields(type, dateLabel, time, lower);
  const priority = inferPriority(lower, type);

  return {
    id: createDraftId("draft"),
    type,
    title,
    summary: buildSummary(type, title, dateLabel, time, duration),
    dateLabel,
    timeLabel: time,
    durationMinutes: duration,
    priority,
    confidence: Math.max(54, 92 - missing.length * 12 - (type === "note" ? 10 : 0)),
    needsConfirmation: true,
    missing,
    followUpQuestion: missing.length ? buildFollowUpQuestion(missing) : undefined,
    sourceText: text
  };
}

export function buildDayOrganizationScore(tasks: AssistantTask[], events: AssistantEvent[]) {
  const scheduledTasks = tasks.filter((task) => task.time).length;
  const pendingTasks = tasks.filter((task) => task.status !== "concluida").length;
  const conflicts = findScheduleConflicts(events).length;
  const base = 46 + scheduledTasks * 8 + events.length * 5 - pendingTasks * 2 - conflicts * 12;
  return Math.max(12, Math.min(94, base));
}

export function findFreeWindows(events: AssistantEvent[]) {
  const ordered = [...events].sort((a, b) => a.start.localeCompare(b.start));
  const windows: { start: string; end: string; minutes: number; suggestion: string }[] = [];
  for (let index = 0; index < ordered.length - 1; index += 1) {
    const current = ordered[index];
    const next = ordered[index + 1];
    const minutes = toMinutes(next.start) - toMinutes(current.end);
    if (minutes >= 30) {
      windows.push({
        start: current.end,
        end: next.start,
        minutes,
        suggestion: minutes >= 40 ? "Colocar tarefa do orcamento" : "Resolver tarefa rapida"
      });
    }
  }
  return windows;
}

export function findScheduleConflicts(events: AssistantEvent[]) {
  const ordered = [...events].sort((a, b) => a.start.localeCompare(b.start));
  const conflicts: { first: AssistantEvent; second: AssistantEvent }[] = [];
  for (let index = 0; index < ordered.length - 1; index += 1) {
    if (toMinutes(ordered[index].end) > toMinutes(ordered[index + 1].start)) {
      conflicts.push({ first: ordered[index], second: ordered[index + 1] });
    }
  }
  return conflicts;
}

export function buildMorningBriefing(tasks = demoTasks, events = demoEvents) {
  const critical = tasks.find((task) => task.priority === "critica" && task.status !== "concluida");
  const firstEvent = [...events].sort((a, b) => a.start.localeCompare(b.start))[0];
  const pendingCount = tasks.filter((task) => task.status !== "concluida").length;
  const conflicts = findScheduleConflicts(events);

  return {
    greeting: `Bom dia. Hoje voce tem ${events.length} compromissos, ${pendingCount} tarefas e ${
      critical ? "uma pendencia importante" : "nenhuma pendencia critica"
    }.`,
    firstEvent,
    mainTask: critical ?? tasks.find((task) => task.priority === "alta") ?? tasks[0],
    conflicts,
    suggestion:
      conflicts.length > 0
        ? "Existe conflito de horario. Posso sugerir um ajuste antes de enviar alertas."
        : "Ha uma janela livre para encaixar a tarefa mais importante sem lotar o dia."
  };
}

export function buildNightReview() {
  return [
    "O que foi concluido?",
    "O que ficou pendente?",
    "O que deve ser reagendado?",
    "Houve algum imprevisto?"
  ];
}

export function replanOverdueItems(tasks = demoTasks) {
  return tasks
    .filter((task) => task.status === "atrasada" || task.priority === "critica")
    .map((task, index) => ({
      task,
      suggestion: index === 0 ? "Reagendar para o primeiro bloco livre de hoje" : "Mover para amanha com lembrete antecipado",
      impact: task.priority === "critica" ? "alto" : "medio",
      requiresConfirmation: true
    }));
}

function inferActionType(lower: string): AssistantActionType {
  if (/(quanto gastei|gastei com|saldo|extrato|fatura|contas vencem|quais contas)/.test(lower)) return "financial_query";
  if (/(juntar|economizar|meta financeira|comprar um carro|valor-alvo|valor alvo)/.test(lower)) return "financial_goal";
  if (/(pagar|boleto|seguro|conta|vence|vencimento|receber)/.test(lower)) return "financial_commitment";
  if (/(cobrar|resposta|retorno|fornecedor|cliente)/.test(lower)) return "follow_up";
  if (/(todo|toda|diariamente|semanal|mensal)/.test(lower)) return "routine";
  if (/(reuniao|dentista|consulta|compromisso|agenda|evento|participante)/.test(lower)) return "event";
  if (/(lembra|lembrar|me cobre|me avisa|alerta|conta)/.test(lower)) return "reminder";
  if (/(projeto|orcamento|proposta|entregar|terminar|finalizar)/.test(lower)) return "project";
  if (/(fazer|preciso|tarefa|estudar|ligar|pagar|comprar|enviar)/.test(lower)) return "task";
  return "note";
}

function extractTime(lower: string) {
  const explicit = lower.match(/\b(\d{1,2})(?::|h)(\d{2})?\b/);
  if (!explicit) return undefined;
  const hour = explicit[1].padStart(2, "0");
  const minute = explicit[2] ?? "00";
  return `${hour}:${minute}`;
}

function extractDateLabel(lower: string) {
  if (lower.includes("amanha")) return "Amanha";
  if (lower.includes("hoje")) return "Hoje";
  if (lower.includes("sexta")) return "Sexta";
  if (lower.includes("quinta")) return "Quinta";
  if (lower.includes("quarta")) return "Quarta";
  if (lower.includes("terca")) return "Terca";
  if (lower.includes("segunda")) return "Segunda";
  if (lower.includes("domingo")) return "Domingo";
  if (lower.includes("sabado")) return "Sabado";
  return "Sem data definida";
}

function extractDuration(lower: string) {
  const minutes = lower.match(/\b(\d{1,3})\s*(min|minutos)\b/);
  if (minutes) return Number(minutes[1]);
  if (lower.includes("rapido") || lower.includes("rapida")) return 10;
  if (lower.includes("reuniao")) return 30;
  if (lower.includes("dentista") || lower.includes("consulta")) return 60;
  return undefined;
}

function buildTitle(text: string, type: AssistantActionType) {
  const cleaned = text
    .replace(/^(me lembra de|me lembre de|preciso|tenho|organize|criar|crie|me cobre para)\s+/i, "")
    .replace(/[.!?]+$/g, "")
    .trim();
  if (cleaned.length > 4) return sentenceCase(cleaned);

  const fallback: Record<AssistantActionType, string> = {
    event: "Novo compromisso",
    task: "Nova tarefa",
    reminder: "Novo lembrete",
    routine: "Nova rotina",
    project: "Novo projeto",
    follow_up: "Novo follow-up",
    financial_query: "Nova consulta financeira",
    financial_commitment: "Novo compromisso financeiro",
    financial_goal: "Nova meta financeira",
    note: "Nova anotacao"
  };
  return fallback[type];
}

function buildSummary(type: AssistantActionType, title: string, dateLabel: string, time?: string, duration?: number) {
  const labels: Record<AssistantActionType, string> = {
    event: "compromisso",
    task: "tarefa",
    reminder: "lembrete",
    routine: "rotina recorrente",
    project: "projeto",
    follow_up: "follow-up",
    financial_query: "consulta financeira",
    financial_commitment: "compromisso financeiro",
    financial_goal: "meta financeira",
    note: "anotacao"
  };
  const parts = [`Transformei isso em ${labels[type]}: ${title}`, dateLabel !== "Sem data definida" ? dateLabel : ""];
  if (time) parts.push(time);
  if (duration) parts.push(`${duration} min`);
  return parts.filter(Boolean).join(" · ");
}

function getMissingFields(type: AssistantActionType, dateLabel: string, time: string | undefined, lower: string) {
  const missing: string[] = [];
  if (["event", "task", "reminder", "follow_up"].includes(type) && dateLabel === "Sem data definida") missing.push("data");
  if (["event", "reminder", "routine"].includes(type) && !time) missing.push("horario");
  if (type === "event" && !/(local|em |no |na )/.test(lower)) missing.push("local opcional");
  if (type === "project" && !/(ate|prazo|quarta|sexta|amanha|hoje)/.test(lower)) missing.push("prazo");
  if (type === "financial_commitment" && dateLabel === "Sem data definida" && !/(vence|vencimento|sexta|quinta|quarta|amanha|hoje)/.test(lower)) missing.push("vencimento");
  if (type === "financial_goal" && !/(r\$|\d)/.test(lower)) missing.push("valor-alvo");
  return missing;
}

function buildFollowUpQuestion(missing: string[]) {
  if (missing.includes("data") && missing.includes("horario")) return "Qual data e horario devo usar antes de confirmar?";
  if (missing.includes("data")) return "Para qual data devo agendar isso?";
  if (missing.includes("horario")) return "Qual horario fica melhor?";
  if (missing.includes("prazo")) return "Qual e o prazo desse projeto?";
  return `Confirma estes detalhes: ${missing.join(", ")}?`;
}

function inferPriority(lower: string, type: AssistantActionType): AssistantPriority {
  if (/(urgente|critico|critica|hoje|conta|prazo|vence|fatura|boleto|pagar|seguro)/.test(lower)) return "critica";
  if (/(orcamento|proposta|cliente|reuniao|fornecedor)/.test(lower)) return "alta";
  if (type === "note") return "baixa";
  return "media";
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function sentenceCase(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function toMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}
