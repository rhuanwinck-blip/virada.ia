"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleGauge,
  Command,
  CreditCard,
  FileText,
  HelpCircle,
  LayoutDashboard,
  MessageSquareText,
  Play,
  RotateCcw,
  Search,
  Target,
  Timer,
  Trophy,
  UserRound
} from "lucide-react";
import {
  AICompanionPreview,
  CommandPalette,
  ConnectedNodes,
  FloatingMetric,
  HabitHeatmap,
  PillarRadar,
  PlanTimeline,
  ProgressCore,
  ScannerPanel,
  StatusPill,
  UnlockExperience
} from "@/components/PremiumVisuals";
import { demoAnswers } from "@/lib/questions";
import { loadAnswers, loadProgress, toggleProgress } from "@/lib/local-store";
import { scoreDiagnostic } from "@/lib/scoring";
import {
  achievements,
  behaviorPatterns,
  buildEvolutionSeries,
  buildWeeklyPlan,
  dashboardEmptyStates,
  dashboardNavigation,
  financeEntries,
  getPillarTrend,
  goals,
  libraryItems,
  priorityMap,
  routineBlocks,
  smartRecommendations
} from "@/lib/product-experience";

const navIcons = {
  overview: LayoutDashboard,
  today: Timer,
  plan: CalendarDays,
  assistant: MessageSquareText,
  evolution: CircleGauge
};

export function DashboardClient() {
  const searchParams = useSearchParams();
  const [done, setDone] = useState<number[]>([]);
  const [active, setActive] = useState("overview");
  const [commandOpen, setCommandOpen] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(0);
  const [reflection, setReflection] = useState("");

  const result = useMemo(
    () => scoreDiagnostic(typeof window === "undefined" ? demoAnswers : loadAnswers() ?? demoAnswers),
    []
  );
  const todayMission = result.thirtyDayPlan.find((mission) => !done.includes(mission.day)) ?? result.thirtyDayPlan[0];
  const weeklyPlan = buildWeeklyPlan(result);
  const evolution = buildEvolutionSeries(result, done);
  const activeItem = dashboardNavigation.find((item) => item.id === active) ?? dashboardNavigation[0];
  const completedRate = Math.round((done.length / result.thirtyDayPlan.length) * 100);

  useEffect(() => {
    setDone(loadProgress());
  }, []);

  useEffect(() => {
    if (searchParams.get("payment") === "approved") setUnlockOpen(true);
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
    if (!focusRunning) return;
    const timer = window.setInterval(() => setFocusMinutes((value) => value + 1), 60000);
    return () => window.clearInterval(timer);
  }, [focusRunning]);

  function completeMission(day = todayMission.day) {
    setDone(toggleProgress(day));
  }

  return (
    <main className="dashboard-shell">
      <aside className="app-sidebar" aria-label="Navegação do produto">
        <div className="sidebar-header">
          <Link className="brand" href="/">
            <span className="brand-mark">V</span> Virada IA
          </Link>
          <span className="plan-badge">Pro demo</span>
        </div>
        {["Agora", "Entender", "Evoluir", "Inteligencia", "Conta"].map((group) => (
          <div className="sidebar-group" key={group}>
            <h3>{group === "Inteligencia" ? "Inteligência" : group}</h3>
            {dashboardNavigation
              .filter((item) => item.group === group)
              .map((item) => (
                <button
                  className={`sidebar-item ${active === item.id ? "active" : ""}`}
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  type="button"
                >
                  <span>{item.label}</span>
                  {active === item.id ? <ChevronRight size={15} /> : null}
                </button>
              ))}
          </div>
        ))}
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <strong>{activeItem.label}</strong>
            <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: ".86rem" }}>{activeItem.description}</p>
          </div>
          <div className="topbar-actions">
            <button className="command-trigger" type="button" onClick={() => setCommandOpen(true)}>
              <Command size={16} />
              <span>Buscar ação</span>
              <kbd>Ctrl K</kbd>
            </button>
            <button className="icon-button" type="button" aria-label="Buscar">
              <Search size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="Notificações">
              <Bell size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="Perfil">
              <UserRound size={18} />
            </button>
          </div>
        </header>

        {renderSection()}
      </section>

      <nav className="bottom-nav" aria-label="Navegação mobile">
        {["overview", "today", "plan", "assistant", "evolution"].map((id) => {
          const item = dashboardNavigation.find((nav) => nav.id === id)!;
          const Icon = navIcons[id as keyof typeof navIcons];
          return (
            <button className={active === id ? "active" : ""} key={id} onClick={() => setActive(id)} type="button">
              <Icon size={18} />
              {item.label.split(" ")[0]}
            </button>
          );
        })}
      </nav>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} onSelect={setActive} />
      <UnlockExperience open={unlockOpen} onClose={() => setUnlockOpen(false)} />
    </main>
  );

  function renderSection() {
    switch (active) {
      case "overview":
        return (
          <div className="dashboard-section">
            <div className="dashboard-hero">
              <ScannerPanel className="dashboard-card" label="Visão geral">
                <span className="eyebrow">Boa noite, Rhuan</span>
                <h1>Seu foco continua sendo recuperar o controle da sua rotina.</h1>
                <p className="premium-copy">
                  O sistema prioriza {result.mainBlocker.name.toLowerCase()} porque essa área ainda segura as demais.
                </p>
                <div className="metric-grid">
                  <FloatingMetric label="Concluídas" value={`${done.length}/30`} detail="Missões registradas" />
                  <FloatingMetric label="Continuidade" value={`${completedRate}%`} detail="O plano valoriza retomada" tone="blue" />
                </div>
              </ScannerPanel>
              <ScannerPanel className="mission-card" label="Missão de hoje">
                <StatusPill>Prioridade atual</StatusPill>
                <h2>{todayMission.title}</h2>
                <p className="premium-copy">{todayMission.instruction}</p>
                <div className="mission-actions">
                  <button className="button" type="button" onClick={() => setActive("today")}>
                    Iniciar missão <Play size={17} />
                  </button>
                  <button className="button secondary" type="button" onClick={() => completeMission()}>
                    Concluir <Check size={17} />
                  </button>
                </div>
              </ScannerPanel>
            </div>

            <div className="dashboard-module-grid">
              <ScannerPanel label="Núcleo de progresso">
                <ProgressCore score={result.viradaIndex + Math.min(8, done.length)} confidence={result.confidence} />
              </ScannerPanel>
              <ScannerPanel label="Mapa dos pilares">
                <PillarRadar scores={result.pillarScores} compact />
              </ScannerPanel>
              <AICompanionPreview result={result} />
            </div>

            <div className="dashboard-module-grid">
              {[
                ["Hoje", todayMission.title],
                ["Amanhã", result.thirtyDayPlan[todayMission.day]?.title ?? result.thirtyDayPlan[1].title],
                ["Próximo check-in", "Revisar peso do plano e ajustar a semana"]
              ].map(([label, value]) => (
                <article className="info-card" key={label}>
                  <span className="step-num">{label}</span>
                  <h3 style={{ marginTop: 12 }}>{value}</h3>
                </article>
              ))}
            </div>
          </div>
        );
      case "today":
        return (
          <div className="dashboard-section">
            <ScannerPanel className="dashboard-card" label="Missão focada">
              <div className="module-title">
                <div>
                  <h1 style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>{todayMission.title}</h1>
                  <p>{todayMission.minutes} minutos · Pilar {todayMission.pillar}</p>
                </div>
                <StatusPill tone={focusRunning ? "green" : "gold"}>{focusRunning ? "Foco ativo" : "Pronto"}</StatusPill>
              </div>
              <p className="premium-copy">{todayMission.instruction}</p>
              <div className="dashboard-module-grid">
                <article className="info-card">
                  <h3>Versão mínima</h3>
                  <p>Se o dia estiver difícil, faça apenas 10 minutos e registre a retomada.</p>
                </article>
                <article className="info-card">
                  <h3>Critério de conclusão</h3>
                  <p>Você conclui quando a ação foi iniciada e a próxima decisão ficou clara.</p>
                </article>
                <article className="info-card">
                  <h3>Motivo</h3>
                  <p>Essa ação reduz fricção antes de exigir uma rotina maior.</p>
                </article>
              </div>
              <div className="mission-actions" style={{ marginTop: 18 }}>
                <button className="button" type="button" onClick={() => setFocusRunning((value) => !value)}>
                  {focusRunning ? "Pausar foco" : "Iniciar modo foco"} <Timer size={17} />
                </button>
                <button className="button secondary" type="button" onClick={() => completeMission()}>
                  Concluir missão <Check size={17} />
                </button>
                <button className="button ghost" type="button" onClick={() => setActive("replan")}>
                  Adaptar <RotateCcw size={17} />
                </button>
              </div>
            </ScannerPanel>
            <div className="dashboard-grid">
              <section className="panel dashboard-card">
                <div className="module-title">
                  <div>
                    <h2>Reflexão curta</h2>
                    <p>Opcional e não clínico. Serve para adaptar o plano.</p>
                  </div>
                  <StatusPill tone="blue">{focusMinutes} min focados</StatusPill>
                </div>
                <div className="contact-form">
                  <div className="field">
                    <label htmlFor="reflection">O que dificultou hoje?</label>
                    <textarea id="reflection" value={reflection} onChange={(event) => setReflection(event.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="difficulty">Dificuldade percebida</label>
                    <select id="difficulty">
                      <option>Leve</option>
                      <option>Média</option>
                      <option>Alta</option>
                    </select>
                  </div>
                </div>
              </section>
              <aside className="panel dashboard-card">
                <h2>Impacto ao concluir</h2>
                <p className="premium-copy">
                  A conclusão atualiza a continuidade, libera reflexão curta e recalibra a próxima ação.
                </p>
                <HabitHeatmap completed={done} />
              </aside>
            </div>
          </div>
        );
      case "plan":
      case "calendar":
        return (
          <div className="dashboard-section">
            <ScannerPanel className="dashboard-card" label={active === "plan" ? "Meu plano" : "Calendário"}>
              <div className="module-title">
                <div>
                  <h1 style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>Plano de 30 dias adaptável.</h1>
                  <p>Quatro semanas, missões, versões mínimas, marcos, bloqueios e check-ins.</p>
                </div>
                <StatusPill>{done.length} dias concluídos</StatusPill>
              </div>
              <PlanTimeline missions={result.thirtyDayPlan} />
            </ScannerPanel>
            <div className="cards-grid">
              {weeklyPlan.map((week) => (
                <article className="info-card" key={week.week}>
                  <span className="step-num">Semana {week.week}</span>
                  <h3 style={{ marginTop: 12 }}>{week.theme}</h3>
                  <p>{week.objective}</p>
                  <div className="progress-track">
                    <span style={{ width: `${Math.min(100, week.missions.filter((mission) => done.includes(mission.day)).length * 14)}%` }} />
                  </div>
                </article>
              ))}
            </div>
            <section className="panel dashboard-card">
              <div className="day-grid">
                {result.thirtyDayPlan.map((mission) => (
                  <button className={`day-cell ${done.includes(mission.day) ? "done" : ""}`} key={mission.day} onClick={() => completeMission(mission.day)} type="button">
                    <strong style={{ color: "var(--text)" }}>Dia {mission.day}</strong>
                    <br />
                    {mission.title}
                    <br />
                    <span style={{ color: "var(--muted)" }}>{mission.minutes} min</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        );
      case "diagnostic":
      case "pillars":
        return (
          <div className="dashboard-section">
            <div className="dashboard-hero">
              <ScannerPanel className="dashboard-card" label="Mapa do seu momento">
                <ProgressCore score={result.viradaIndex} confidence={result.confidence} trend="linha base" />
                <h2 style={{ marginTop: 18 }}>Principal bloqueio: {result.mainBlocker.name}</h2>
                <p className="premium-copy">{result.pattern}</p>
                <div className="notice">Limitação: análise educacional baseada nas respostas fornecidas, sem diagnóstico médico.</div>
              </ScannerPanel>
              <ScannerPanel label="Radar dos pilares">
                <PillarRadar scores={result.pillarScores} />
              </ScannerPanel>
            </div>
            <div className="cards-grid">
              {result.pillarScores.map((pillar) => {
                const trend = getPillarTrend(pillar.key, pillar.score);
                return (
                  <article className="info-card" key={pillar.key}>
                    <StatusPill tone={trend.trend >= 0 ? "green" : "red"}>{trend.trend >= 0 ? `+${trend.trend}` : trend.trend}</StatusPill>
                    <h3 style={{ marginTop: 12 }}>{pillar.name}</h3>
                    <p>{pillar.description}</p>
                    <div className="pillar-score">
                      <span style={{ width: `${pillar.score}%`, background: pillar.color }} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        );
      case "patterns":
      case "priorities":
        return (
          <div className="dashboard-section">
            <ScannerPanel className="dashboard-card" label={active === "patterns" ? "Padrões identificados" : "Mapa de prioridades"}>
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                {active === "patterns" ? "Entenda o padrão antes de repetir o ciclo." : "Ordem clara para decidir o que vem primeiro."}
              </h1>
              <p className="premium-copy">
                Cada item mostra evidência, impacto e ação recomendada. Nada aqui é depoimento ou dado real de terceiros.
              </p>
            </ScannerPanel>
            {active === "patterns" ? (
              <ConnectedNodes items={behaviorPatterns.map((pattern) => ({ title: pattern.title, detail: `${pattern.evidence} Ação: ${pattern.action}` }))} />
            ) : (
              <div className="comparison-grid">
                {priorityMap.map((zone) => (
                  <article className="info-card" key={zone.zone}>
                    <StatusPill tone={zone.tone === "green" ? "green" : zone.tone === "blue" ? "blue" : "gold"}>{zone.zone}</StatusPill>
                    <ul className="check-list" style={{ marginTop: 14 }}>
                      {zone.items.map((item) => (
                        <li key={item}>
                          <Target size={16} color="#5cffb0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}
          </div>
        );
      case "goals":
      case "routine":
      case "habits":
      case "focus":
      case "finance":
      case "checkins":
      case "evolution":
        return renderEvolutionArea(active);
      case "assistant":
      case "recommendations":
      case "replan":
      case "simulations":
        return renderIntelligenceArea(active);
      case "reports":
      case "achievements":
      case "library":
      case "notifications":
      case "subscription":
      case "settings":
      case "help":
        return renderAccountArea(active);
      default:
        return null;
    }
  }

  function renderEvolutionArea(id: string) {
    const titles: Record<string, string> = {
      goals: "Metas transformadas em próximos passos.",
      routine: "Rotina simples, flexível e compatível com sua realidade.",
      habits: "Hábitos acompanhados sem gamificação infantil.",
      focus: "Sessões de foco curtas e rastreáveis.",
      finance: "Organização financeira educacional e manual.",
      checkins: "Check-in semanal para adaptar sem apagar histórico.",
      evolution: "Evolução visual com dados reais quando existirem."
    };

    return (
      <div className="dashboard-section">
        <ScannerPanel className="dashboard-card" label={activeItem.label}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>{titles[id]}</h1>
          <p className="premium-copy">Cada área tem função prática e estado demo explícito enquanto não há backend persistente.</p>
        </ScannerPanel>

        {id === "goals" ? (
          <div className="cards-grid">
            {goals.map((goal) => (
              <article className="info-card" key={goal.title}>
                <StatusPill tone={goal.status === "Prioridade" ? "green" : "blue"}>{goal.status}</StatusPill>
                <h3 style={{ marginTop: 12 }}>{goal.title}</h3>
                <p>{goal.why}</p>
                <div className="pillar-score"><span style={{ width: `${goal.progress}%` }} /></div>
                <p><strong>Próximo passo:</strong> {goal.nextStep}</p>
              </article>
            ))}
          </div>
        ) : null}

        {id === "routine" ? (
          <div className="cards-grid">
            {routineBlocks.map((block) => (
              <article className="info-card" key={block.title}>
                <StatusPill tone="gold">{block.period}</StatusPill>
                <h3 style={{ marginTop: 12 }}>{block.title}</h3>
                <p>{block.duration} · {block.flexibility}</p>
                <p>Versão mínima: {block.minimal}</p>
              </article>
            ))}
          </div>
        ) : null}

        {id === "habits" ? (
          <div className="dashboard-grid">
            <section className="panel dashboard-card">
              <HabitHeatmap completed={done} />
            </section>
            <aside className="panel dashboard-card">
              <h2>Sequência e retomada</h2>
              <p className="premium-copy">{done.length} registros concluídos. Melhor período: 4 dias. Dificuldade atual: média.</p>
            </aside>
          </div>
        ) : null}

        {id === "focus" ? (
          <div className="dashboard-grid">
            <section className="panel dashboard-card">
              <h2>Sessão rápida</h2>
              <p className="premium-copy">Intenção: avançar na ação principal sem notificações.</p>
              <button className="button" type="button" onClick={() => setFocusRunning((value) => !value)}>
                {focusRunning ? "Pausar sessão" : "Iniciar 20 minutos"} <Timer size={17} />
              </button>
            </section>
            <aside className="panel dashboard-card">
              <FloatingMetric label="Tempo focado" value={`${focusMinutes} min`} detail="Histórico local desta sessão" />
            </aside>
          </div>
        ) : null}

        {id === "finance" ? (
          <div className="cards-grid">
            {financeEntries.map((entry) => (
              <article className="info-card" key={entry.category}>
                <CreditCard color="#5cffb0" size={22} />
                <h3 style={{ marginTop: 12 }}>{entry.category}</h3>
                <p>{entry.value} · {entry.signal}</p>
              </article>
            ))}
          </div>
        ) : null}

        {id === "checkins" ? (
          <section className="panel dashboard-card">
            <div className="contact-form">
              {["Quantas ações concluiu?", "O que ficou difícil?", "O plano ficou pesado?", "O que deve ser reduzido?"].map((question) => (
                <div className="field" key={question}>
                  <label>{question}</label>
                  <input placeholder="Resposta curta" />
                </div>
              ))}
              <button className="button" type="button">Enviar check-in <Check size={17} /></button>
            </div>
          </section>
        ) : null}

        {id === "evolution" ? (
          <div className="dashboard-grid">
            <section className="panel dashboard-card">
              <div className="module-title">
                <div>
                  <h2>Índice ao longo do tempo</h2>
                  <p>Demonstração até haver histórico real.</p>
                </div>
                <StatusPill tone="blue">Exemplo</StatusPill>
              </div>
              <div className="plan-timeline">
                {evolution.map((value, index) => (
                  <article className="timeline-day" key={index}>
                    <span>Marco {index + 1}</span>
                    <strong>{value}/100</strong>
                    <small>Índice estimado</small>
                  </article>
                ))}
              </div>
            </section>
            <aside className="panel dashboard-card">
              <HabitHeatmap completed={done} />
            </aside>
          </div>
        ) : null}
      </div>
    );
  }

  function renderIntelligenceArea(id: string) {
    return (
      <div className="dashboard-section">
        <ScannerPanel className="dashboard-card" label={activeItem.label}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
            {id === "assistant" && "Guia Virada com contexto do seu plano."}
            {id === "recommendations" && "Recomendações com motivo, evidência e impacto."}
            {id === "replan" && "Replaneje sem apagar o que aconteceu."}
            {id === "simulations" && "Simule cenários antes de mudar o plano."}
          </h1>
          <p className="premium-copy">A IA não prescreve, não faz diagnóstico médico e não inventa dados fora do seu histórico.</p>
        </ScannerPanel>

        {id === "assistant" ? <AICompanionPreview result={result} /> : null}

        {id === "recommendations" ? (
          <div className="cards-grid">
            {smartRecommendations.map((item) => (
              <article className="info-card" key={item.title}>
                <StatusPill>{item.impact} impacto</StatusPill>
                <h3 style={{ marginTop: 12 }}>{item.title}</h3>
                <p>{item.reason}</p>
                <p><strong>Evidência:</strong> {item.evidence}</p>
                <div className="mission-actions">
                  <button className="button secondary" type="button">Aceitar</button>
                  <button className="button ghost" type="button">Adaptar</button>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {id === "replan" ? (
          <div className="comparison-grid">
            <article className="info-card">
              <StatusPill tone="gold">Antes</StatusPill>
              <h3 style={{ marginTop: 12 }}>Missão de 30 minutos</h3>
              <p>Exigia energia alta e dependia de horário ideal.</p>
            </article>
            <article className="info-card">
              <StatusPill>Depois</StatusPill>
              <h3 style={{ marginTop: 12 }}>Missão de 12 minutos</h3>
              <p>Reduzida para caber no dia real, mantendo o mesmo objetivo.</p>
            </article>
          </div>
        ) : null}

        {id === "simulations" ? (
          <div className="cards-grid">
            {["Se eu tiver só 10 minutos", "Se eu falhar três dias", "Se minha rotina mudar"].map((scenario) => (
              <article className="info-card" key={scenario}>
                <h3>{scenario}</h3>
                <p>A simulação reduz o plano, preserva histórico e sugere uma próxima ação possível.</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  function renderAccountArea(id: string) {
    return (
      <div className="dashboard-section">
        <ScannerPanel className="dashboard-card" label={activeItem.label}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
            {id === "reports" && "Relatórios com data, versão, confiança e limitações."}
            {id === "achievements" && "Conquistas discretas, sem ruído infantil."}
            {id === "library" && "Biblioteca prática filtrada pelo diagnóstico."}
            {id === "notifications" && "Alertas úteis, consentidos e controláveis."}
            {id === "subscription" && "Assinatura, pagamentos e cancelamento simples."}
            {id === "settings" && "Preferências, privacidade e dados."}
            {id === "help" && "Ajuda clara sobre produto, limites e suporte."}
          </h1>
          <p className="premium-copy">A área preserva transparência, segurança e controle do usuário.</p>
        </ScannerPanel>

        {id === "reports" ? (
          <div className="cards-grid">
            {["Relatório inicial", "Relatório semanal", "Relatório mensal"].map((report, index) => (
              <article className="info-card" key={report}>
                <FileText color="#5cffb0" size={22} />
                <h3 style={{ marginTop: 12 }}>{report}</h3>
                <p>{index === 0 ? "Pronto em modo demo com PDF." : "Será gerado quando houver histórico real."}</p>
              </article>
            ))}
          </div>
        ) : null}

        {id === "achievements" ? (
          <div className="cards-grid">
            {achievements.map((achievement) => (
              <article className="info-card" key={achievement.title}>
                <Trophy color={achievement.unlocked ? "#d4ba74" : "#69758a"} size={22} />
                <h3 style={{ marginTop: 12 }}>{achievement.title}</h3>
                <p>{achievement.detail}</p>
              </article>
            ))}
          </div>
        ) : null}

        {id === "library" ? (
          <div className="cards-grid">
            {libraryItems.map((item) => (
              <article className="info-card" key={item.title}>
                <StatusPill tone="blue">{item.pillar}</StatusPill>
                <h3 style={{ marginTop: 12 }}>{item.title}</h3>
                <p>{item.minutes} minutos de leitura prática.</p>
              </article>
            ))}
          </div>
        ) : null}

        {["notifications", "subscription", "settings", "help"].includes(id) ? (
          <div className="cards-grid">
            {dashboardEmptyStates.map((state) => (
              <article className="info-card" key={state.state}>
                <HelpCircle color="#5cffb0" size={22} />
                <h3 style={{ marginTop: 12 }}>{state.title}</h3>
                <p>{state.body}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}
