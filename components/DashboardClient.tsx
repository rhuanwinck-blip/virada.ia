"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Command,
  CreditCard,
  FolderKanban,
  Inbox,
  ListTodo,
  Mail,
  MemoryStick,
  MessageSquareText,
  Mic,
  Moon,
  Pause,
  Play,
  RefreshCcw,
  Settings,
  Timer,
  Trash2,
  UserRound,
  Workflow,
  Zap
} from "lucide-react";
import {
  ActivationOverlay,
  AssessorCommandPalette,
  AssessorCore,
  AudioWave,
  DraftActionCard,
  HolographicPanel,
  MetricTile,
  StatusPill,
  TimelineMap
} from "@/components/AssessorVisuals";
import {
  AssistantDraftAction,
  AssistantEvent,
  AssistantFollowUp,
  AssistantMemory,
  AssistantNavigationItem,
  AssistantProject,
  AssistantRoutine,
  AssistantSectionId,
  AssistantTask,
  assistantNavigation,
  buildDayOrganizationScore,
  buildMorningBriefing,
  buildNightReview,
  demoEvents,
  demoFollowUps,
  demoInbox,
  demoMemories,
  demoNotifications,
  demoProjects,
  demoRoutines,
  demoTasks,
  findFreeWindows,
  findScheduleConflicts,
  integrations,
  parseAssistantIntent,
  replanOverdueItems
} from "@/lib/assistant-core";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type InboxItem = {
  id: string;
  text: string;
  type: string;
  status: string;
};

const navIcons: Record<AssistantSectionId, typeof Command> = {
  central: Command,
  today: Clock3,
  assistant: MessageSquareText,
  calendar: CalendarDays,
  tasks: ListTodo,
  projects: FolderKanban,
  routines: Workflow,
  inbox: Inbox,
  focus: Timer,
  followups: Mail,
  memory: MemoryStick,
  notifications: Bell,
  integrations: Zap,
  subscription: CreditCard,
  settings: Settings
};

const navGroups = ["Comando", "Organizacao", "Acompanhamento", "Sistema"] as const;

export function DashboardClient() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState<AssistantSectionId>("central");
  const [commandOpen, setCommandOpen] = useState(false);
  const [activationOpen, setActivationOpen] = useState(false);
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<AssistantDraftAction | undefined>();
  const [audioActive, setAudioActive] = useState(false);
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => formatClock(new Date()));
  const [events, setEvents] = useState<AssistantEvent[]>(demoEvents);
  const [tasks, setTasks] = useState<AssistantTask[]>(demoTasks);
  const [projects, setProjects] = useState<AssistantProject[]>(demoProjects);
  const [routines, setRoutines] = useState<AssistantRoutine[]>(demoRoutines);
  const [followUps, setFollowUps] = useState<AssistantFollowUp[]>(demoFollowUps);
  const [memories, setMemories] = useState<AssistantMemory[]>(demoMemories);
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(demoInbox);
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      text: "Pode escrever ou gravar tudo que precisa fazer. Eu classifico, organizo e peço confirmação antes de criar algo importante."
    }
  ]);

  const activeItem = assistantNavigation.find((item) => item.id === active) ?? assistantNavigation[0];
  const organizationScore = useMemo(() => buildDayOrganizationScore(tasks, events), [tasks, events]);
  const freeWindows = useMemo(() => findFreeWindows(events), [events]);
  const conflicts = useMemo(() => findScheduleConflicts(events), [events]);
  const briefing = useMemo(() => buildMorningBriefing(tasks, events), [tasks, events]);
  const replanSuggestions = useMemo(() => replanOverdueItems(tasks), [tasks]);

  useEffect(() => {
    if (searchParams.get("payment") === "approved") setActivationOpen(true);
  }, [searchParams]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const commandKey = event.metaKey || event.ctrlKey;
      if (commandKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(formatClock(new Date())), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!focusRunning) return;
    const timer = window.setInterval(() => setFocusSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [focusRunning]);

  function submitCommand(text = input) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const nextDraft = parseAssistantIntent(trimmed);
    setDraft(nextDraft);
    setChat((messages) => [
      ...messages,
      { id: `user-${Date.now()}`, role: "user", text: trimmed },
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: `${nextDraft.summary}. ${nextDraft.followUpQuestion ?? "Posso confirmar quando voce aprovar."}`
      }
    ]);
    setInput("");
  }

  function simulateAudio() {
    setAudioActive(true);
    window.setTimeout(() => {
      setAudioActive(false);
      submitCommand("Amanha as 14h tenho dentista");
    }, 900);
  }

  function confirmDraft() {
    if (!draft) return;
    if (draft.type === "event") {
      setEvents((items) => [
        ...items,
        {
          id: draft.id,
          title: draft.title,
          date: draft.dateLabel,
          start: draft.timeLabel ?? "A definir",
          end: draft.timeLabel ? addMinutes(draft.timeLabel, draft.durationMinutes ?? 30) : "A definir",
          participants: [],
          source: "assistant"
        }
      ]);
    } else if (draft.type === "task" || draft.type === "reminder") {
      setTasks((items) => [
        ...items,
        {
          id: draft.id,
          title: draft.title,
          priority: draft.priority,
          due: draft.dateLabel,
          time: draft.timeLabel,
          durationMinutes: draft.durationMinutes ?? 15,
          status: "pendente",
          subtasks: ["Confirmar contexto", "Executar primeiro passo"],
          reminders: draft.timeLabel ? [`${draft.dateLabel} ${draft.timeLabel}`, "Acompanhar depois se nao concluir"] : ["Pedir horario"]
        }
      ]);
    } else if (draft.type === "routine") {
      setRoutines((items) => [
        ...items,
        {
          id: draft.id,
          title: draft.title,
          schedule: `${draft.dateLabel}${draft.timeLabel ? ` as ${draft.timeLabel}` : ""}`,
          durationMinutes: draft.durationMinutes ?? 10,
          channel: "painel",
          status: "ativa",
          reducedVersion: "Executar versao minima em dia cheio"
        }
      ]);
    } else if (draft.type === "project") {
      setProjects((items) => [
        ...items,
        {
          id: draft.id,
          title: draft.title,
          goal: draft.sourceText,
          deadline: draft.dateLabel,
          progress: 12,
          nextSteps: ["Quebrar em tarefas menores", "Definir primeiro bloco", "Marcar prazo de revisao"],
          risks: draft.missing.length ? ["Ainda faltam detalhes antes de automatizar"] : ["Prazo precisa ser protegido"],
          owner: "Voce"
        }
      ]);
    } else if (draft.type === "follow_up") {
      setFollowUps((items) => [
        ...items,
        {
          id: draft.id,
          title: draft.title,
          waitingFor: "Terceiro a confirmar",
          checkAt: `${draft.dateLabel}${draft.timeLabel ? ` ${draft.timeLabel}` : ""}`,
          nextAction: "Preparar cobranca, mas pedir confirmacao antes de enviar.",
          channel: "painel"
        }
      ]);
    } else {
      setInboxItems((items) => [{ id: draft.id, text: draft.sourceText, type: "nota", status: "classificado" }, ...items]);
    }

    setChat((messages) => [
      ...messages,
      { id: `ok-${Date.now()}`, role: "assistant", text: `Confirmado. ${draft.title} entrou na area correta e continuara visivel para replanejamento.` }
    ]);
    setDraft(undefined);
  }

  function toggleTask(taskId: string) {
    setTasks((items) =>
      items.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "concluida" ? "pendente" : "concluida" } : task
      )
    );
  }

  function removeMemory(memoryId: string) {
    setMemories((items) => items.filter((memory) => memory.id !== memoryId));
  }

  return (
    <main className="dashboard-shell command-theme">
      <div className="command-grid" />
      <aside className="app-sidebar" aria-label="Navegacao do assessor">
        <div className="sidebar-header">
          <Link className="brand" href="/">
            <span className="brand-mark">V</span> Virada IA
          </Link>
          <span className="plan-badge">Assessor demo</span>
        </div>
        {navGroups.map((group) => (
          <div className="sidebar-group" key={group}>
            <h3>{group}</h3>
            {assistantNavigation
              .filter((item) => item.group === group)
              .map((item) => {
                const Icon = navIcons[item.id];
                return (
                  <button className={`sidebar-item ${active === item.id ? "active" : ""}`} key={item.id} onClick={() => setActive(item.id)} type="button">
                    <span>
                      <Icon size={16} /> {item.label}
                    </span>
                    {active === item.id ? <ChevronRight size={15} /> : null}
                  </button>
                );
              })}
          </div>
        ))}
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <strong>{activeItem.label}</strong>
            <p>{activeItem.description}</p>
          </div>
          <div className="topbar-actions">
            <button className="command-trigger" type="button" onClick={() => setCommandOpen(true)}>
              <Command size={16} />
              <span>Buscar acao</span>
              <kbd>Ctrl K</kbd>
            </button>
            <button className="icon-button" type="button" aria-label="Notificacoes">
              <Bell size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="Perfil">
              <UserRound size={18} />
            </button>
          </div>
        </header>

        {renderSection(activeItem)}
      </section>

      <nav className="bottom-nav" aria-label="Navegacao mobile">
        {(["central", "today", "assistant", "calendar", "tasks"] as AssistantSectionId[]).map((id) => {
          const item = assistantNavigation.find((nav) => nav.id === id)!;
          const Icon = navIcons[id];
          return (
            <button className={active === id ? "active" : ""} key={id} onClick={() => setActive(id)} type="button">
              <Icon size={18} />
              {item.label.split(" ")[0]}
            </button>
          );
        })}
      </nav>

      <AssessorCommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} onSelect={setActive} />
      <ActivationOverlay open={activationOpen} onClose={() => setActivationOpen(false)} />
    </main>
  );

  function renderSection(item: AssistantNavigationItem) {
    switch (item.id) {
      case "central":
        return (
          <div className="dashboard-section">
            <div className="dashboard-hero">
              <HolographicPanel className="dashboard-card" label="Central de comando">
                <span className="eyebrow">Agora sao {currentTime}</span>
                <h1>Fale o que precisa fazer. Eu organizo o resto.</h1>
                <p className="premium-copy">
                  Seu dia esta {organizationScore}% organizado. Eu vejo agenda, tarefas, lembretes, follow-ups e memoria
                  antes de sugerir qualquer mudanca.
                </p>
                <CommandComposer />
                <DraftActionCard draft={draft} onConfirm={confirmDraft} onDiscard={() => setDraft(undefined)} />
              </HolographicPanel>
              <HolographicPanel label="Pulso do dia">
                <AssessorCore score={organizationScore} />
                <div className="metric-grid">
                  <MetricTile label="Compromissos" value={`${events.length}`} detail="Agenda de hoje" />
                  <MetricTile label="Pendentes" value={`${tasks.filter((task) => task.status !== "concluida").length}`} detail="Tarefas abertas" tone="blue" />
                </div>
              </HolographicPanel>
            </div>
            <div className="dashboard-module-grid">
              <HolographicPanel label="Chat central">
                <ChatPanel />
              </HolographicPanel>
              <HolographicPanel label="Inbox classificada">
                <InboxList />
              </HolographicPanel>
              <HolographicPanel label="Proatividade">
                <RecommendationList />
              </HolographicPanel>
            </div>
          </div>
        );
      case "today":
        return (
          <div className="dashboard-section">
            <div className="dashboard-hero">
              <HolographicPanel className="dashboard-card" label="Meu Dia">
                <div className="module-title">
                  <div>
                    <span className="eyebrow">
                      <Clock3 size={15} /> {currentTime}
                    </span>
                    <h1>Seu dia esta {organizationScore}% organizado.</h1>
                    <p className="premium-copy">
                      {freeWindows[0]
                        ? `Voce tem ${freeWindows[0].minutes} minutos livres entre dois compromissos. Posso colocar a tarefa do orcamento nesse horario.`
                        : "Nao encontrei janela livre longa. Posso reduzir uma tarefa para versao rapida."}
                    </p>
                  </div>
                  <AssessorCore score={organizationScore} label="Organizacao" />
                </div>
                <TimelineMap events={events} tasks={tasks} />
              </HolographicPanel>
              <HolographicPanel label="Alertas inteligentes">
                <div className="stack-list">
                  {[
                    ["Primeiro compromisso", `${briefing.firstEvent.title} as ${briefing.firstEvent.start}`],
                    ["Tarefa principal", briefing.mainTask.title],
                    ["Conflitos", conflicts.length ? `${conflicts.length} conflito detectado` : "Nenhum conflito"],
                    ["Tempo livre", freeWindows[0] ? `${freeWindows[0].minutes} min livres` : "Sem bloco livre longo"]
                  ].map(([title, body]) => (
                    <div className="stack-item" key={title}>
                      <strong>{title}</strong>
                      <span>{body}</span>
                    </div>
                  ))}
                </div>
              </HolographicPanel>
            </div>
            <div className="cards-grid">
              <MorningBriefingCard />
              <NightReviewCard />
              <ReplanCard />
            </div>
          </div>
        );
      case "assistant":
        return (
          <div className="dashboard-section">
            <div className="dashboard-grid">
              <HolographicPanel className="dashboard-card" label="Assessor IA">
                <h1>Chat por texto e audio com confirmacao.</h1>
                <p className="premium-copy">
                  Em modo demo, a interpretacao e deterministica. Com `OPENAI_API_KEY`, a API pode chamar um modelo real
                  mantendo o mesmo contrato de confirmacao.
                </p>
                <CommandComposer large />
                <ChatPanel />
              </HolographicPanel>
              <HolographicPanel label="Rascunho antes de agir">
                <DraftActionCard draft={draft} onConfirm={confirmDraft} onDiscard={() => setDraft(undefined)} />
              </HolographicPanel>
            </div>
          </div>
        );
      case "calendar":
        return (
          <div className="dashboard-section">
            <HolographicPanel className="dashboard-card" label="Agenda inteligente">
              <h1>Dia, semana, mes, recorrencias e conflitos no mesmo mapa.</h1>
              <p className="premium-copy">
                Google Calendar esta preparado por API. Sem credenciais, o modo demo mostra como eventos, duracao,
                localizacao, participantes e deslocamento serao tratados.
              </p>
              <TimelineMap events={events} tasks={tasks} />
            </HolographicPanel>
            <div className="cards-grid">
              {events.map((event) => (
                <article className="info-card" key={event.id}>
                  <StatusPill>{event.date}</StatusPill>
                  <h3>{event.title}</h3>
                  <p>
                    {event.start} - {event.end}
                    {event.travelMinutes ? ` · ${event.travelMinutes} min de deslocamento` : ""}
                  </p>
                  <small>{event.source === "google_demo" ? "Evento demo do Google Calendar" : "Criado no Virada IA"}</small>
                </article>
              ))}
            </div>
          </div>
        );
      case "tasks":
        return (
          <div className="dashboard-section">
            <HolographicPanel className="dashboard-card" label="Tarefas">
              <h1>Tarefas com prioridade, prazo, duracao, projeto e subtarefas.</h1>
              <p className="premium-copy">Tarefas grandes sao quebradas em passos menores e podem receber lembretes em camadas.</p>
            </HolographicPanel>
            <div className="cards-grid">
              {tasks.map((task) => (
                <article className={`info-card task-card ${task.status}`} key={task.id}>
                  <div className="module-title">
                    <div>
                      <StatusPill tone={task.priority === "critica" ? "red" : task.priority === "alta" ? "amber" : "blue"}>{task.priority}</StatusPill>
                      <h3>{task.title}</h3>
                      <p>
                        {task.due}
                        {task.time ? ` as ${task.time}` : ""} · {task.durationMinutes} min
                      </p>
                    </div>
                    <button className="icon-button" type="button" onClick={() => toggleTask(task.id)} aria-label="Alternar tarefa">
                      <Check size={18} />
                    </button>
                  </div>
                  <ul className="check-list">
                    {task.subtasks.map((subtask) => (
                      <li key={subtask}>
                        <Check size={15} /> {subtask}
                      </li>
                    ))}
                  </ul>
                  <small>{task.reminders.join(" · ")}</small>
                </article>
              ))}
            </div>
          </div>
        );
      case "projects":
        return (
          <div className="dashboard-section">
            <HolographicPanel className="dashboard-card" label="Projetos">
              <h1>Projetos viram objetivo, prazo, progresso e proximos passos.</h1>
              <p className="premium-copy">O assessor acompanha atrasos e sugere a menor proxima acao antes do projeto virar ruído.</p>
            </HolographicPanel>
            <div className="cards-grid">
              {projects.map((project) => (
                <article className="info-card" key={project.id}>
                  <StatusPill>{project.deadline}</StatusPill>
                  <h3>{project.title}</h3>
                  <p>{project.goal}</p>
                  <div className="progress-track">
                    <span style={{ width: `${project.progress}%` }} />
                  </div>
                  <ul className="check-list">
                    {project.nextSteps.map((step) => (
                      <li key={step}>
                        <ChevronRight size={15} /> {step}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        );
      case "routines":
        return (
          <div className="dashboard-section">
            <HolographicPanel className="dashboard-card" label="Rotinas">
              <h1>Rotinas criadas por linguagem natural.</h1>
              <p className="premium-copy">Rotinas podem ser diarias, semanais, mensais, pausadas ou reduzidas em dias cheios.</p>
            </HolographicPanel>
            <div className="cards-grid">
              {routines.map((routine) => (
                <article className="info-card" key={routine.id}>
                  <StatusPill tone={routine.status === "ativa" ? "cyan" : "amber"}>{routine.status}</StatusPill>
                  <h3>{routine.title}</h3>
                  <p>{routine.schedule}</p>
                  <p>Versao reduzida: {routine.reducedVersion}</p>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() =>
                      setRoutines((items) =>
                        items.map((item) => (item.id === routine.id ? { ...item, status: item.status === "ativa" ? "pausada" : "ativa" } : item))
                      )
                    }
                  >
                    {routine.status === "ativa" ? "Pausar" : "Reativar"} <Pause size={16} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        );
      case "inbox":
        return (
          <div className="dashboard-section">
            <HolographicPanel className="dashboard-card" label="Caixa de entrada">
              <h1>Despeje tudo aqui. O assessor classifica.</h1>
              <p className="premium-copy">Ideias, audios, arquivos, compromissos e lembretes entram como inbox antes de virar acao confirmada.</p>
              <CommandComposer />
            </HolographicPanel>
            <InboxList />
          </div>
        );
      case "focus":
        return (
          <div className="dashboard-section">
            <div className="dashboard-hero">
              <HolographicPanel className="dashboard-card" label="Modo foco">
                <h1>{formatDuration(focusSeconds)}</h1>
                <p className="premium-copy">Tarefa atual: {briefing.mainTask.title}. Passo imediato: {briefing.mainTask.subtasks[0]}.</p>
                <div className="inline-actions">
                  <button className="button" type="button" onClick={() => setFocusRunning((value) => !value)}>
                    {focusRunning ? "Pausar" : "Iniciar foco"} {focusRunning ? <Pause size={17} /> : <Play size={17} />}
                  </button>
                  <button className="button secondary" type="button" onClick={() => setFocusSeconds(0)}>
                    Reiniciar <RefreshCcw size={17} />
                  </button>
                </div>
              </HolographicPanel>
              <HolographicPanel label="Bloqueio visual">
                <div className="focus-shield">
                  <Moon size={28} />
                  <h3>Distrações silenciadas</h3>
                  <p>Anotacoes rapidas ficam aqui para nao abrir novas abas durante o foco.</p>
                </div>
              </HolographicPanel>
            </div>
          </div>
        );
      case "followups":
        return (
          <div className="dashboard-section">
            <HolographicPanel className="dashboard-card" label="Follow-ups">
              <h1>O que depende de outras pessoas fica rastreavel.</h1>
              <p className="premium-copy">A IA acompanha prazos de resposta e prepara cobrancas, mas nao envia sem confirmacao.</p>
            </HolographicPanel>
            <div className="cards-grid">
              {followUps.map((followUp) => (
                <article className="info-card" key={followUp.id}>
                  <StatusPill tone="amber">{followUp.checkAt}</StatusPill>
                  <h3>{followUp.title}</h3>
                  <p>Aguardando: {followUp.waitingFor}</p>
                  <p>{followUp.nextAction}</p>
                </article>
              ))}
            </div>
          </div>
        );
      case "memory":
        return (
          <div className="dashboard-section">
            <HolographicPanel className="dashboard-card" label="Memoria pessoal">
              <h1>Memoria controlada pelo usuario.</h1>
              <p className="premium-copy">Tudo que o assessor sabe sobre voce fica visivel, editavel e removivel.</p>
            </HolographicPanel>
            <div className="cards-grid">
              {memories.map((memory) => (
                <article className="info-card" key={memory.id}>
                  <StatusPill tone="blue">{memory.category}</StatusPill>
                  <h3>{memory.label}</h3>
                  <p>{memory.value}</p>
                  <button className="button ghost" type="button" onClick={() => removeMemory(memory.id)}>
                    Excluir memoria <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="dashboard-section">
            <HolographicPanel className="dashboard-card" label="Notificacoes">
              <h1>Lembretes em camadas, nao apenas no horario.</h1>
              <p className="premium-copy">Antecipado, proximo, no horario, acompanhamento depois e reagendamento se nao concluir.</p>
            </HolographicPanel>
            <div className="cards-grid">
              {demoNotifications.map((notification) => (
                <article className="info-card" key={notification.id}>
                  <StatusPill tone={notification.consent ? "cyan" : "amber"}>{notification.consent ? "ativo" : "consentimento pendente"}</StatusPill>
                  <h3>{notification.title}</h3>
                  <p>{notification.channel} · {notification.cadence}</p>
                </article>
              ))}
            </div>
          </div>
        );
      case "integrations":
        return (
          <div className="dashboard-section">
            <HolographicPanel className="dashboard-card" label="Integracoes">
              <h1>Google Calendar, WhatsApp, Web Push, e-mail e OpenAI preparados.</h1>
              <p className="premium-copy">Credenciais conectam canais reais. Sem credenciais, o modo demo deixa claro o que falta.</p>
            </HolographicPanel>
            <div className="cards-grid">
              {integrations.map((integration) => (
                <article className="info-card" key={integration.id}>
                  <StatusPill tone={integration.status === "ready" ? "cyan" : integration.status === "connected" ? "cyan" : "amber"}>
                    {integration.status}
                  </StatusPill>
                  <h3>{integration.label}</h3>
                  <p>{integration.description}</p>
                  <small>{integration.requiredEnv.join(" · ") || "Sem variavel obrigatoria"}</small>
                  <button className="button secondary" type="button" onClick={() => setActive("settings")}>
                    Configurar
                  </button>
                </article>
              ))}
            </div>
          </div>
        );
      case "subscription":
        return (
          <div className="dashboard-section">
            <HolographicPanel className="dashboard-card" label="Assinatura">
              <h1>Pagamento preservado, produto novo liberado por acesso seguro.</h1>
              <p className="premium-copy">
                Checkout e webhook continuam separados. Em producao, liberacao deve depender de webhook valido ou consulta
                segura ao provedor.
              </p>
              <div className="offer-grid">
                <article className="price-card">
                  <StatusPill>Atual</StatusPill>
                  <h3>Assessor demo</h3>
                  <div className="price">R$ 47</div>
                  <p>Acesso local para validar fluxo e UX.</p>
                  <Link className="button" href="/checkout">
                    Abrir checkout
                  </Link>
                </article>
                <article className="price-card featured">
                  <StatusPill tone="amber">Pro</StatusPill>
                  <h3>Assessor Pro</h3>
                  <div className="price">R$ 59,90/mês</div>
                  <p>WhatsApp, push, briefings e historico.</p>
                  <Link className="button" href="/checkout?plan=pro">
                    Atualizar
                  </Link>
                </article>
              </div>
            </HolographicPanel>
          </div>
        );
      case "settings":
        return (
          <div className="dashboard-section">
            <HolographicPanel className="dashboard-card" label="Configuracoes">
              <h1>Preferencias, privacidade e horario silencioso.</h1>
              <p className="premium-copy">O assessor respeita seus limites antes de mandar notificacoes ou sugerir encaixes.</p>
              <div className="contact-form">
                <div className="field">
                  <label htmlFor="work-hours">Horario de trabalho</label>
                  <input id="work-hours" defaultValue="09:00 as 18:00" />
                </div>
                <div className="field">
                  <label htmlFor="silent-hours">Horario silencioso</label>
                  <input id="silent-hours" defaultValue="22:00 as 07:00" />
                </div>
                <label className="checkbox-line">
                  <input type="checkbox" defaultChecked /> Pedir confirmacao antes de qualquer acao externa.
                </label>
                <label className="checkbox-line">
                  <input type="checkbox" defaultChecked /> Permitir memoria pessoal editavel.
                </label>
              </div>
            </HolographicPanel>
          </div>
        );
      default:
        return null;
    }
  }

  function CommandComposer({ large = false }: { large?: boolean }) {
    return (
      <div className={`assessor-composer ${large ? "large" : ""}`}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ex: preciso terminar o orcamento ate quarta, me lembra de ligar para o Joao sexta..."
          aria-label="Mensagem para o assessor"
        />
        <div className="composer-actions">
          <button className="button secondary" type="button" onClick={simulateAudio}>
            <Mic size={17} /> Audio demo
          </button>
          <AudioWave active={audioActive} />
          <button className="button" type="button" onClick={() => submitCommand()}>
            Organizar <SparkIcon />
          </button>
        </div>
      </div>
    );
  }

  function ChatPanel() {
    return (
      <div className="chat-panel">
        {chat.map((message) => (
          <div className={`chat-message ${message.role}`} key={message.id}>
            <small>{message.role === "assistant" ? "Assessor" : "Voce"}</small>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
    );
  }

  function InboxList() {
    return (
      <div className="stack-list">
        {inboxItems.map((item) => (
          <div className="stack-item" key={item.id}>
            <strong>{item.text}</strong>
            <span>
              {item.type} · {item.status}
            </span>
          </div>
        ))}
      </div>
    );
  }

  function RecommendationList() {
    return (
      <div className="stack-list">
        {[
          freeWindows[0]
            ? `Colocar "${briefing.mainTask.title}" no bloco livre de ${freeWindows[0].minutes} minutos.`
            : "Reduzir tarefa principal para uma versao de 10 minutos.",
          conflicts.length ? "Resolver conflito antes de enviar lembretes." : "Agenda sem conflito. Proteger foco antes do proximo compromisso.",
          "Preparar resumo da noite com pendentes e imprevistos."
        ].map((recommendation) => (
          <div className="stack-item" key={recommendation}>
            <strong>Recomendacao da IA</strong>
            <span>{recommendation}</span>
          </div>
        ))}
      </div>
    );
  }

  function MorningBriefingCard() {
    return (
      <article className="info-card">
        <StatusPill>Briefing da manha</StatusPill>
        <h3>{briefing.greeting}</h3>
        <p>Primeiro compromisso: {briefing.firstEvent.title}.</p>
        <p>Sugestao: {briefing.suggestion}</p>
      </article>
    );
  }

  function NightReviewCard() {
    return (
      <article className="info-card">
        <StatusPill tone="blue">Resumo da noite</StatusPill>
        <h3>Fechamento com replanejamento.</h3>
        <ul className="check-list">
          {buildNightReview().map((question) => (
            <li key={question}>
              <ChevronRight size={15} /> {question}
            </li>
          ))}
        </ul>
      </article>
    );
  }

  function ReplanCard() {
    return (
      <article className="info-card">
        <StatusPill tone="amber">Replanejamento</StatusPill>
        <h3>{replanSuggestions[0]?.task.title ?? "Nenhuma pendencia critica"}</h3>
        <p>{replanSuggestions[0]?.suggestion ?? "Quando algo atrasar, vou sugerir novo horario e pedir confirmacao."}</p>
      </article>
    );
  }
}

function SparkIcon() {
  return <Zap size={17} />;
}

function formatClock(date: Date) {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function addMinutes(time: string, minutes: number) {
  if (!/^\d{2}:\d{2}$/.test(time)) return "A definir";
  const [hour, minute] = time.split(":").map(Number);
  const total = hour * 60 + minute + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}
