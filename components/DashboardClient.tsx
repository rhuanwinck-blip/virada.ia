"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  Bell,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronRight,
  Command,
  CreditCard,
  Gauge,
  Inbox,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Trash2,
  UserRound,
  WalletCards,
  Zap
} from "lucide-react";
import {
  ActivationOverlay,
  AgentMesh,
  AssessorCore,
  ConnectedAreaMap,
  FinanceSignalGraph,
  HolographicPanel,
  MetricTile,
  OpenFinanceFlow,
  StatusPill
} from "@/components/AssessorVisuals";
import {
  brl,
  buildFinancialOverview,
  categorizeTransaction,
  sanitizeForFinancialAgent,
  sandboxAccounts,
  sandboxBills,
  sandboxCreditCards,
  sandboxFinancialConnections,
  sandboxInvestments,
  sandboxTransactions,
  type FinancialCategory,
  type FinancialConnection,
  type FinancialConnectionStatus,
  type FinancialTransaction
} from "@/lib/financial-provider";
import {
  agendaTabs,
  buildPersonalOsBriefing,
  classifyUniversalInboxInput,
  demoAgendaItems,
  demoAgents,
  demoFinancialCommitments,
  demoHabits,
  demoJourneyGoals,
  demoLifeAreas,
  demoProjects,
  financeTabs,
  journeyTabs,
  personalOsAreas,
  type AgendaItem,
  type FinancialCommitment,
  type PersonalOsAreaId
} from "@/lib/personal-os";

const areaIcons: Record<PersonalOsAreaId, typeof Command> = {
  inicio: Gauge,
  jornada: Target,
  agenda: CalendarDays,
  financas: WalletCards,
  agentes: BrainCircuit
};

type InboxClassification = ReturnType<typeof classifyUniversalInboxInput> & { source: string };

const financeValues = [22, 34, 28, 42, 38, 58, 49, 68, 61, 74, 69, 88];

export function DashboardClient() {
  const searchParams = useSearchParams();
  const [activeArea, setActiveArea] = useState<PersonalOsAreaId>("inicio");
  const [journeyTab, setJourneyTab] = useState(journeyTabs[0]);
  const [agendaTab, setAgendaTab] = useState(agendaTabs[0]);
  const [financeTab, setFinanceTab] = useState(financeTabs[0]);
  const [activationOpen, setActivationOpen] = useState(false);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(demoAgendaItems);
  const [commitments, setCommitments] = useState<FinancialCommitment[]>(demoFinancialCommitments);
  const [connections, setConnections] = useState<FinancialConnection[]>(sandboxFinancialConnections);
  const [connectionStatus, setConnectionStatus] = useState<FinancialConnectionStatus>("conectada");
  const [connectionMessage, setConnectionMessage] = useState("Open Finance em sandbox Pluggy. Dados de exemplo marcados como sandbox.");
  const [inboxInput, setInboxInput] = useState("Pagar o seguro sexta.");
  const [classification, setClassification] = useState<InboxClassification | null>(null);
  const [agentPrompt, setAgentPrompt] = useState("Quanto gastei com alimentação neste mês?");
  const [agentAnswer, setAgentAnswer] = useState("O Agente Financeiro usa apenas dados agregados, normalizados e mascarados.");
  const [weeklyPlanGenerated, setWeeklyPlanGenerated] = useState(false);
  const [categoryOverrides, setCategoryOverrides] = useState<Record<string, FinancialCategory>>({});

  const briefing = useMemo(() => buildPersonalOsBriefing(), []);
  const transactions = useMemo(
    () =>
      sandboxTransactions.map((transaction) =>
        categoryOverrides[transaction.id] ? { ...transaction, category: categoryOverrides[transaction.id], confidence: 0.99 } : transaction
      ),
    [categoryOverrides]
  );
  const overview = useMemo(() => buildFinancialOverview(sandboxAccounts, transactions, sandboxBills), [transactions]);
  const activeAreaMeta = personalOsAreas.find((area) => area.id === activeArea) ?? personalOsAreas[0];
  const sensitiveAgentContext = useMemo(
    () => sanitizeForFinancialAgent({ overview, accounts: sandboxAccounts, transactions }),
    [overview, transactions]
  );

  useEffect(() => {
    if (searchParams.get("payment") === "approved") setActivationOpen(true);
  }, [searchParams]);

  function classifyInbox() {
    const next = classifyUniversalInboxInput(inboxInput);
    setClassification({ ...next, source: inboxInput });
  }

  function confirmClassification() {
    if (!classification) return;

    if (classification.type === "compromisso_financeiro") {
      const newCommitment: FinancialCommitment = {
        id: `commit-${Date.now()}`,
        title: sentenceCase(classification.source.replace(/[.!?]+$/g, "")),
        dueDate: "2026-07-24",
        amount: 318.2,
        status: "agendado",
        category: "servicos",
        linkedAgendaItemId: `agenda-fin-${Date.now()}`
      };
      const newAgenda: AgendaItem = {
        id: newCommitment.linkedAgendaItemId!,
        kind: "financeiro",
        title: newCommitment.title,
        date: "Sexta",
        start: "10:30",
        end: "10:40",
        priority: "critica",
        durationMinutes: 10,
        status: "agendado",
        subtasks: ["Conferir dados", "Pagar no app do banco", "Anexar comprovante"],
        reminders: ["Quinta 18:00", "Sexta 09:30", "Sexta 14:00 se não confirmar"]
      };
      setCommitments((items) => [newCommitment, ...items]);
      setAgendaItems((items) => [newAgenda, ...items]);
      setActiveArea("inicio");
      setConnectionMessage("Compromisso financeiro criado, ligado na Agenda e visível no Início.");
    }

    if (classification.type === "meta_financeira") {
      setActiveArea("jornada");
      setJourneyTab("Metas");
      setConnectionMessage("Meta financeira conectada com Sua Jornada. Nenhuma transferência foi executada.");
    }

    setClassification(null);
    setInboxInput("");
  }

  async function startBankConnection() {
    setConnectionStatus("conectando");
    setConnectionMessage("Criando token temporário no backend...");

    const tokenResponse = await fetch("/api/finance/connect-token", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: "demo-user" })
    }).then((response) => response.json());

    setConnectionStatus("aguardando_consentimento");
    setConnectionMessage(`Token ${tokenResponse.mode ?? "sandbox"} criado. Abrindo widget oficial do provider em modo demonstração.`);

    const connectionResponse = await fetch("/api/finance/connections", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        userId: "demo-user",
        providerItemId: "pluggy-item-sandbox-new",
        institutionId: "pluggy-sandbox-001",
        connectToken: tokenResponse.connectToken
      })
    }).then((response) => response.json());

    setConnections((items) => [
      {
        ...connectionResponse.connection,
        status: "conectada",
        consentStatus: "active",
        accountName: "Conta sandbox validada",
        accountMask: "**** 1208",
        holderMask: "R*** W*****"
      },
      ...items
    ]);
    setConnectionStatus("conectada");
    setConnectionMessage("Backend validou a conexão sandbox, sincronizou contas, saldos, transações, cartões, faturas e investimentos de exemplo.");
  }

  async function refreshConnection(connectionId: string) {
    setConnectionStatus("sincronizando");
    const result = await fetch("/api/finance/connections", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ connectionId, action: "refresh" })
    }).then((response) => response.json());
    setConnectionMessage(result.message);
    setConnectionStatus("conectada");
  }

  async function revokeConnection(connectionId: string) {
    const result = await fetch("/api/finance/connections", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ connectionId, action: "revoke" })
    }).then((response) => response.json());
    setConnections((items) => items.map((item) => (item.id === connectionId ? { ...item, status: "revogada", consentStatus: "revoked" } : item)));
    setConnectionStatus("revogada");
    setConnectionMessage(result.message);
  }

  async function removeConnectionData(connectionId: string) {
    const result = await fetch("/api/finance/connections", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ connectionId, action: "remove_data" })
    }).then((response) => response.json());
    setConnections((items) => items.filter((item) => item.id !== connectionId));
    setConnectionMessage(result.message);
  }

  function answerAgent() {
    const query = classifyUniversalInboxInput(agentPrompt);
    if (query.type === "consulta_financeira") {
      setAgentAnswer(
        `No sandbox, alimentação soma ${formatMoney(sumCategory(transactions, "alimentacao"))}. O contexto enviado ao agente remove ${sensitiveAgentContext.sensitiveFieldsRemoved.join(", ")}.`
      );
      setActiveArea("financas");
      setFinanceTab("Categorias");
      return;
    }

    setAgentAnswer(`${query.summary} Vou pedir confirmação antes de criar ou alterar algo importante.`);
  }

  return (
    <main className="dashboard-shell command-theme personal-os-shell">
      <div className="command-grid" />
      <aside className="app-sidebar personal-os-sidebar" aria-label="Navegação principal">
        <div className="sidebar-header">
          <Link className="brand" href="/">
            <span className="brand-mark">V</span> Virada IA
          </Link>
          <span className="plan-badge">Personal OS</span>
        </div>
        <div className="sidebar-group">
          <h3>Áreas principais</h3>
          {personalOsAreas.map((area) => {
            const Icon = areaIcons[area.id];
            return (
              <button className={`sidebar-item ${activeArea === area.id ? "active" : ""}`} key={area.id} onClick={() => setActiveArea(area.id)} type="button">
                <span>
                  <Icon size={16} /> {area.label}
                </span>
                {activeArea === area.id ? <ChevronRight size={15} /> : null}
              </button>
            );
          })}
        </div>
        <HolographicPanel compact label="Estado geral">
          <AssessorCore score={briefing.organizationScore} label="Organização" />
        </HolographicPanel>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <strong>{activeAreaMeta.label}</strong>
            <p>{activeAreaMeta.description}</p>
          </div>
          <div className="topbar-actions">
            <button className="command-trigger" type="button" onClick={() => setActiveArea("agentes")}>
              <Command size={16} />
              <span>Comando central</span>
              <kbd>IA</kbd>
            </button>
            <button className="icon-button" type="button" aria-label="Notificações" onClick={() => setActiveArea("inicio")}>
              <Bell size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="Perfil" onClick={() => setActiveArea("jornada")}>
              <UserRound size={18} />
            </button>
          </div>
        </header>

        {activeArea === "inicio" ? <InicioPanel /> : null}
        {activeArea === "jornada" ? <JornadaPanel /> : null}
        {activeArea === "agenda" ? <AgendaPanel /> : null}
        {activeArea === "financas" ? <FinancasPanel /> : null}
        {activeArea === "agentes" ? <AgentesPanel /> : null}
      </section>

      <nav className="bottom-nav" aria-label="Navegação mobile">
        {personalOsAreas.map((area) => {
          const Icon = areaIcons[area.id];
          return (
            <button className={activeArea === area.id ? "active" : ""} key={area.id} onClick={() => setActiveArea(area.id)} type="button">
              <Icon size={18} />
              {area.label.split(" ")[0]}
            </button>
          );
        })}
      </nav>

      <ActivationOverlay open={activationOpen} onClose={() => setActivationOpen(false)} />
    </main>
  );

  function InicioPanel() {
    return (
      <div className="dashboard-section">
        <div className="dashboard-hero">
          <HolographicPanel className="dashboard-card" label="Central de comando">
            <span className="eyebrow">
              <Sparkles size={15} /> {formatToday()}
            </span>
            <h1>{briefing.greeting} Sua vida está conectada.</h1>
            <p className="premium-copy">
              {briefing.summary} {briefing.recommendation}
            </p>
            <div className="metric-grid">
              <MetricTile label="Saldo consolidado" value={formatMoney(overview.consolidatedBalance.amount)} detail="Sandbox Pluggy marcado" />
              <MetricTile label="Gasto do mês" value={formatMoney(overview.outcomeThisMonth.amount)} detail="Extrato unificado" tone="blue" />
              <MetricTile label="Contas próximas" value={`${commitments.filter((item) => item.status !== "pago").length}`} detail="Agenda financeira" tone="amber" />
              <MetricTile label="Projetos ativos" value={`${demoProjects.length}`} detail="Ligados a metas" tone="cyan" />
            </div>
          </HolographicPanel>
          <HolographicPanel label="Núcleo central">
            <AssessorCore score={briefing.organizationScore} label="Sistema vivo" />
            <div className="stack-list">
              {overview.alerts.map((alert) => (
                <div className="stack-item" key={alert}>
                  <strong>Oportunidade detectada</strong>
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </HolographicPanel>
        </div>

        <div className="dashboard-module-grid">
          <HolographicPanel label="Timeline inteligente">
            <TimelineList items={agendaItems.slice(0, 5)} />
          </HolographicPanel>
          <HolographicPanel label="Tudo conectado">
            <ConnectedAreaMap areas={personalOsAreas} />
          </HolographicPanel>
          <HolographicPanel label="Financeiro no Início">
            <FinanceSignalGraph values={financeValues} />
            <div className="stack-list">
              <div className="stack-item">
                <strong>Fatura próxima</strong>
                <span>{formatMoney(overview.nextBill?.amount.amount ?? 0)} vence em {overview.nextBill?.dueDate}</span>
              </div>
              <div className="stack-item">
                <strong>Última movimentação</strong>
                <span>{transactions[0].normalizedDescription} · {formatMoney(transactions[0].amount.amount)}</span>
              </div>
            </div>
          </HolographicPanel>
        </div>
      </div>
    );
  }

  function JornadaPanel() {
    return (
      <div className="dashboard-section">
        <AreaTabs tabs={journeyTabs} active={journeyTab} onSelect={setJourneyTab} />
        <div className="dashboard-hero">
          <HolographicPanel className="dashboard-card" label={`Sua Jornada · ${journeyTab}`}>
            <h1>Objetivos viram metas, metas viram ações, ações entram na agenda.</h1>
            <p className="premium-copy">
              {weeklyPlanGenerated
                ? "Plano semanal gerado com blocos protegidos e vínculo financeiro para a meta do carro."
                : "A Jornada usa agenda e finanças autorizadas para sugerir prioridades sem tomar decisões por você."}
            </p>
            <div className="inline-actions">
              <button className="button" type="button" onClick={() => setWeeklyPlanGenerated(true)}>
                Gerar plano semanal <ListChecks size={17} />
              </button>
              <button className="button secondary" type="button" onClick={() => setJourneyTab("Revisão semanal")}>
                Abrir revisão <RefreshCcw size={17} />
              </button>
            </div>
          </HolographicPanel>
          <HolographicPanel label="Áreas da vida">
            <div className="life-area-grid">
              {demoLifeAreas.map((area) => (
                <article className="life-area" key={area.id}>
                  <strong>{area.score}%</strong>
                  <span>{area.label}</span>
                  <small>{area.signal}</small>
                </article>
              ))}
            </div>
          </HolographicPanel>
        </div>
        <div className="cards-grid">
          {demoJourneyGoals.map((goal) => (
            <article className="info-card" key={goal.id}>
              <StatusPill tone={goal.area === "Financeiro" ? "amber" : "cyan"}>{goal.area}</StatusPill>
              <h3>{goal.title}</h3>
              <p>{goal.target}</p>
              <div className="progress-track" aria-label={`Progresso ${goal.progress}%`}>
                <span style={{ width: `${goal.progress}%` }} />
              </div>
              <p>Ação de hoje: {goal.nextAction}</p>
              {goal.financialLink ? <small>Conectado à meta financeira e ao saldo sandbox.</small> : null}
            </article>
          ))}
        </div>
        <div className="dashboard-module-grid">
          <HolographicPanel label="Hábitos e rotinas">
            <div className="stack-list">
              {demoHabits.map((habit) => (
                <div className="stack-item" key={habit.id}>
                  <strong>{habit.title}</strong>
                  <span>{habit.streak} dias · {habit.target} · {habit.today}</span>
                </div>
              ))}
            </div>
          </HolographicPanel>
          <HolographicPanel label="Marcos e conquistas">
            <div className="stack-list">
              {["Primeira semana com briefing diário", "Meta do carro ligada ao orçamento", "Follow-up do fornecedor rastreado"].map((item) => (
                <div className="stack-item done" key={item}>
                  <strong>{item}</strong>
                  <span>Registrado no histórico</span>
                </div>
              ))}
            </div>
          </HolographicPanel>
          <HolographicPanel label="Relatório">
            <FinanceSignalGraph values={[18, 28, 24, 35, 42, 47, 61]} />
          </HolographicPanel>
        </div>
      </div>
    );
  }

  function AgendaPanel() {
    return (
      <div className="dashboard-section">
        <AreaTabs tabs={agendaTabs} active={agendaTab} onSelect={setAgendaTab} />
        <div className="dashboard-hero">
          <HolographicPanel className="dashboard-card" label={`Agenda · ${agendaTab}`}>
            <h1>Dia, semana, mês, tarefas, projetos, rotinas e finanças no mesmo mapa.</h1>
            <p className="premium-copy">
              A agenda cria lembretes financeiros, acompanha follow-ups e sugere versão reduzida quando o dia estoura.
            </p>
            <UniversalInbox />
          </HolographicPanel>
          <HolographicPanel label="Modo foco">
            <div className="focus-shield">
              <Timer size={28} />
              <h3>Próximo bloco: orçamento do cliente</h3>
              <p>40 minutos, 3 subtarefas e lembrete depois para confirmar conclusão.</p>
              <button className="button secondary" type="button" onClick={() => setAgendaTab("Modo foco")}>
                Abrir foco
              </button>
            </div>
          </HolographicPanel>
        </div>
        <div className="dashboard-module-grid">
          <HolographicPanel label="Timeline do dia">
            <TimelineList items={agendaItems} />
          </HolographicPanel>
          <HolographicPanel label="Projetos na agenda">
            <div className="stack-list">
              {demoProjects.map((project) => (
                <div className="stack-item" key={project.id}>
                  <strong>{project.title}</strong>
                  <span>{project.nextStep} · risco: {project.risk}</span>
                </div>
              ))}
            </div>
          </HolographicPanel>
          <HolographicPanel label="Lembretes em camadas">
            <div className="stack-list">
              {agendaItems.flatMap((item) => item.reminders.slice(0, 2).map((reminder) => `${item.title}: ${reminder}`)).slice(0, 6).map((reminder) => (
                <div className="stack-item" key={reminder}>
                  <strong>Lembrete</strong>
                  <span>{reminder}</span>
                </div>
              ))}
            </div>
          </HolographicPanel>
        </div>
      </div>
    );
  }

  function FinancasPanel() {
    return (
      <div className="dashboard-section">
        <AreaTabs tabs={financeTabs} active={financeTab} onSelect={setFinanceTab} />
        <div className="dashboard-hero">
          <HolographicPanel className="dashboard-card" label={`Finanças · ${financeTab}`}>
            <span className="eyebrow">
              <ShieldCheck size={15} /> Open Finance somente leitura
            </span>
            <h1>Extrato unificado, faturas, contas, metas e agente financeiro.</h1>
            <p className="premium-copy">
              Quando não houver credencial real, tudo aparece como sandbox. O Virada IA nunca pede senha bancária, não guarda token no navegador e não movimenta dinheiro.
            </p>
            <div className="metric-grid">
              <MetricTile label="Saldo" value={formatMoney(overview.consolidatedBalance.amount)} detail={`${overview.connectedInstitutions} instituições sandbox`} />
              <MetricTile label="Entradas" value={formatMoney(overview.incomeThisMonth.amount)} detail="Período atual" tone="cyan" />
              <MetricTile label="Saídas" value={formatMoney(overview.outcomeThisMonth.amount)} detail="Categorias corrigíveis" tone="blue" />
              <MetricTile label="Economia" value={formatMoney(overview.savingsThisMonth.amount)} detail="Estimativa sandbox" tone="amber" />
            </div>
          </HolographicPanel>
          <HolographicPanel label="Conexão bancária">
            <OpenFinanceFlow activeStep={connectionStatus === "conectada" ? 5 : connectionStatus === "aguardando_consentimento" ? 2 : 1} />
            <p className="premium-copy">{connectionMessage}</p>
            <button className="button" type="button" onClick={startBankConnection}>
              Conectar conta bancária <Banknote size={17} />
            </button>
          </HolographicPanel>
        </div>
        <FinanceTabContent />
      </div>
    );
  }

  function FinanceTabContent() {
    if (financeTab === "Extrato") {
      return (
        <HolographicPanel label="Extrato unificado">
          <UnifiedStatement transactions={transactions} />
        </HolographicPanel>
      );
    }

    if (financeTab === "Conexões") {
      return (
        <HolographicPanel label="Conexões Open Finance">
          <div className="connection-list">
            {connections.map((connection) => (
              <article className="connection-card" key={connection.id}>
                <div>
                  <StatusPill tone={connection.status === "conectada" ? "cyan" : connection.status === "revogada" ? "red" : "amber"}>
                    {connection.status.replaceAll("_", " ")}
                  </StatusPill>
                  <h3>{connection.institutionName}</h3>
                  <p>{connection.accountName} · {connection.accountType} · {connection.accountMask} · {connection.holderMask}</p>
                  <small>
                    Produtos: {connection.products.join(", ")} · última sync: {formatDateTime(connection.lastSyncAt)} · consentimento até {formatDate(connection.consentExpiresAt)}
                  </small>
                </div>
                <div className="connection-actions">
                  <button className="button secondary" type="button" onClick={() => refreshConnection(connection.id)}>
                    Atualizar <RefreshCcw size={16} />
                  </button>
                  <button className="button secondary" type="button" onClick={() => refreshConnection(connection.id)}>
                    Reconectar <Zap size={16} />
                  </button>
                  <button className="button ghost" type="button" onClick={() => revokeConnection(connection.id)}>
                    Revogar <LockKeyhole size={16} />
                  </button>
                  <button className="button ghost" type="button" onClick={() => removeConnectionData(connection.id)}>
                    Remover dados <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </HolographicPanel>
      );
    }

    if (financeTab === "Categorias") {
      return (
        <div className="dashboard-module-grid">
          <HolographicPanel label="Distribuição por categoria">
            <div className="stack-list">
              {overview.categoryDistribution.map((item) => (
                <div className="stack-item" key={item.category}>
                  <strong>{item.category.replaceAll("_", " ")}</strong>
                  <span>{formatMoney(item.amount.amount)} · {item.percent}%</span>
                </div>
              ))}
            </div>
          </HolographicPanel>
          <HolographicPanel label="Correção de categoria">
            <UnifiedStatement transactions={transactions.slice(0, 4)} compact />
          </HolographicPanel>
          <HolographicPanel label="Regra inteligente">
            <p className="premium-copy">
              Regras determinísticas vêm primeiro, histórico do usuário depois e IA apenas como fallback. Valor, data, conta e identificador original nunca são alterados.
            </p>
          </HolographicPanel>
        </div>
      );
    }

    if (financeTab === "Cartões" || financeTab === "Faturas") {
      return (
        <div className="cards-grid">
          {sandboxCreditCards.map((card) => (
            <article className="info-card" key={card.id}>
              <CreditCard size={22} />
              <h3>{card.name} · final {card.finalDigits}</h3>
              <p>Limite {formatMoney(card.limit.amount)} · disponível {formatMoney(card.availableLimit.amount)} · uso {card.utilization}%</p>
              <p>Fecha dia {card.closingDay}, vence dia {card.dueDay}. Alerta informativo, sem pagamento automático.</p>
            </article>
          ))}
          {sandboxBills.map((bill) => (
            <article className="info-card" key={bill.id}>
              <StatusPill tone="amber">{bill.status}</StatusPill>
              <h3>Fatura {formatDate(bill.dueDate)}</h3>
              <p>Atual {formatMoney(bill.amount.amount)} · projetada {formatMoney(bill.projectedAmount.amount)} · confiança {Math.round(bill.confidence * 100)}%</p>
            </article>
          ))}
        </div>
      );
    }

    if (financeTab === "Assinaturas") {
      return (
        <div className="cards-grid">
          {overview.subscriptions.map((subscription) => (
            <article className="info-card" key={subscription.id}>
              <StatusPill tone={subscription.status === "confirmada" ? "cyan" : "amber"}>{subscription.status}</StatusPill>
              <h3>{subscription.service}</h3>
              <p>{formatMoney(subscription.amount.amount)} · {subscription.frequency} · próxima cobrança {formatDate(subscription.nextChargeDate)}</p>
              <small>O sistema informa e lembra; não cancela assinaturas automaticamente.</small>
            </article>
          ))}
        </div>
      );
    }

    if (financeTab === "Investimentos") {
      return (
        <div className="cards-grid">
          {sandboxInvestments.map((investment) => (
            <article className="info-card" key={investment.id}>
              <StatusPill>{investment.type}</StatusPill>
              <h3>{investment.product}</h3>
              <p>{investment.institutionName} · saldo {formatMoney(investment.balance.amount)} · aplicado {formatMoney(investment.investedAmount.amount)}</p>
              <small>Sem recomendação específica e sem compra/venda.</small>
            </article>
          ))}
        </div>
      );
    }

    if (financeTab.includes("Contas") || financeTab === "Compromissos" || financeTab === "Orçamento" || financeTab === "Metas financeiras") {
      return (
        <div className="dashboard-module-grid">
          <HolographicPanel label="Compromissos financeiros">
            <div className="stack-list">
              {commitments.map((commitment) => (
                <div className="stack-item" key={commitment.id}>
                  <strong>{commitment.title}</strong>
                  <span>{formatMoney(commitment.amount)} · vence {formatDate(commitment.dueDate)} · {commitment.status}</span>
                </div>
              ))}
            </div>
          </HolographicPanel>
          <HolographicPanel label="Meta financeira">
            <h3>Comprar um carro</h3>
            <p className="premium-copy">R$ 6.800 de R$ 20.000 acumulados. Ligada à Jornada e ao aporte mensal de R$ 700.</p>
            <div className="progress-track">
              <span style={{ width: "34%" }} />
            </div>
          </HolographicPanel>
          <HolographicPanel label="Orçamento">
            <div className="stack-list">
              {overview.categoryDistribution.slice(0, 4).map((item) => (
                <div className="stack-item" key={item.category}>
                  <strong>{item.category.replaceAll("_", " ")}</strong>
                  <span>{item.percent}% do gasto sandbox no período</span>
                </div>
              ))}
            </div>
          </HolographicPanel>
        </div>
      );
    }

    return (
      <div className="dashboard-module-grid">
        <HolographicPanel label="Fluxo de caixa">
          <FinanceSignalGraph values={financeValues} />
        </HolographicPanel>
        <HolographicPanel label="Contas conectadas">
          <div className="stack-list">
            {sandboxAccounts.map((account) => (
              <div className="stack-item" key={account.id}>
                <strong>{account.institutionName}</strong>
                <span>{account.name} · {account.numberMask} · {formatMoney(account.balance.amount)}</span>
              </div>
            ))}
          </div>
        </HolographicPanel>
        <HolographicPanel label="Insights financeiros">
          <div className="stack-list">
            {overview.alerts.map((alert) => (
              <div className="stack-item" key={alert}>
                <strong>Insight</strong>
                <span>{alert}</span>
              </div>
            ))}
          </div>
        </HolographicPanel>
      </div>
    );
  }

  function AgentesPanel() {
    return (
      <div className="dashboard-section">
        <div className="dashboard-hero">
          <HolographicPanel className="dashboard-card" label="Central de agentes">
            <h1>Seis agentes especializados, uma memória controlada e permissões explícitas.</h1>
            <p className="premium-copy">
              Agentes usam a mesma base de contexto, mas só acessam dados autorizados. Ações importantes viram rascunho e exigem confirmação.
            </p>
            <div className="assessor-composer">
              <textarea value={agentPrompt} onChange={(event) => setAgentPrompt(event.target.value)} aria-label="Mensagem para agentes" />
              <div className="composer-actions">
                <button className="button" type="button" onClick={answerAgent}>
                  Perguntar ao agente <MessageSquareText size={17} />
                </button>
              </div>
            </div>
            <div className="chat-message assistant">
              <small>Agente</small>
              <p>{agentAnswer}</p>
            </div>
          </HolographicPanel>
          <HolographicPanel label="Malha viva">
            <AgentMesh agents={demoAgents} />
          </HolographicPanel>
        </div>
        <div className="cards-grid">
          {demoAgents.map((agent) => (
            <article className="info-card" key={agent.id}>
              <StatusPill tone={agent.id === "agent-finance" ? "amber" : "cyan"}>{agent.label}</StatusPill>
              <h3>{agent.role}</h3>
              <p>{agent.currentSuggestion}</p>
              <small>Pode: {agent.can.join(", ")}.</small>
              <small> Não pode: {agent.cannot.join(", ")}.</small>
            </article>
          ))}
        </div>
        <HolographicPanel label="Regras do agente financeiro">
          <div className="agent-rules">
            {[
              "Não movimenta dinheiro.",
              "Não acessa senha, CPF, conta completa, cartão completo ou token.",
              "Não recomenda investimento específico.",
              "Não altera valor, data, instituição, conta ou identificador original.",
              "Usa dados agregados, normalizados, mascarados e minimizados."
            ].map((rule) => (
              <span key={rule}>
                <ShieldCheck size={15} /> {rule}
              </span>
            ))}
          </div>
        </HolographicPanel>
      </div>
    );
  }

  function UniversalInbox() {
    return (
      <div className="universal-inbox">
        <div className="field">
          <label htmlFor="universal-inbox">Caixa de entrada universal</label>
          <textarea id="universal-inbox" value={inboxInput} onChange={(event) => setInboxInput(event.target.value)} />
        </div>
        <div className="inline-actions">
          <button className="button secondary" type="button" onClick={classifyInbox}>
            Classificar <Inbox size={17} />
          </button>
          {classification ? (
            <button className="button" type="button" onClick={confirmClassification}>
              Confirmar ação <Check size={17} />
            </button>
          ) : null}
        </div>
        {classification ? (
          <div className="draft-card">
            <StatusPill tone={classification.requiresConfirmation ? "amber" : "cyan"}>{classification.type}</StatusPill>
            <h3>{classification.targetArea}</h3>
            <p>{classification.summary}</p>
          </div>
        ) : null}
      </div>
    );
  }

  function UnifiedStatement({ transactions: rows, compact = false }: { transactions: FinancialTransaction[]; compact?: boolean }) {
    return (
      <div className={`finance-table ${compact ? "compact" : ""}`}>
        {rows.map((transaction) => {
          const categorization = categorizeTransaction({
            description: transaction.originalDescription,
            amount: transaction.amount.amount,
            previousUserCategory: categoryOverrides[transaction.id]
          });
          return (
            <article className="finance-row" key={transaction.id}>
              <div>
                <strong>{transaction.normalizedDescription}</strong>
                <span>
                  {transaction.originalDescription} · {transaction.institutionName} · {formatDate(transaction.date)} · {transaction.status}
                </span>
              </div>
              <b className={transaction.type}>{formatMoney(transaction.amount.amount)}</b>
              <select
                aria-label={`Categoria de ${transaction.normalizedDescription}`}
                value={transaction.category}
                onChange={(event) => setCategoryOverrides((items) => ({ ...items, [transaction.id]: event.target.value as FinancialCategory }))}
              >
                {[
                  "alimentacao",
                  "mercado",
                  "transporte",
                  "moradia",
                  "saude",
                  "educacao",
                  "lazer",
                  "compras",
                  "servicos",
                  "assinaturas",
                  "investimentos",
                  "salario",
                  "vendas",
                  "outros_gastos"
                ].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <small>{Math.round(categorization.confidence * 100)}% · dado bruto preservado</small>
            </article>
          );
        })}
      </div>
    );
  }
}

function AreaTabs({ tabs, active, onSelect }: { tabs: string[]; active: string; onSelect: (tab: string) => void }) {
  return (
    <div className="area-tabs" role="tablist">
      {tabs.map((tab) => (
        <button className={active === tab ? "active" : ""} key={tab} onClick={() => onSelect(tab)} type="button">
          {tab}
        </button>
      ))}
    </div>
  );
}

function TimelineList({ items }: { items: AgendaItem[] }) {
  return (
    <div className="timeline-list">
      {items.map((item) => (
        <article className={`timeline-list__item ${item.kind}`} key={item.id}>
          <time>{item.start ?? item.date}</time>
          <span className="timeline-dot" />
          <div>
            <StatusPill tone={item.priority === "critica" ? "red" : item.kind === "financeiro" ? "amber" : "cyan"}>{item.kind}</StatusPill>
            <h3>{item.title}</h3>
            <p>
              {item.date}
              {item.end ? ` · ${item.start}-${item.end}` : ""} · {item.durationMinutes} min · {item.status}
            </p>
            <small>{item.subtasks.slice(0, 2).join(" · ")}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function formatMoney(value: number) {
  return brl(value).amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value: string) {
  const date = value.includes("T") ? new Date(value) : new Date(`${value}T12:00:00`);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function formatToday() {
  return new Date().toLocaleString("pt-BR", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
}

function sumCategory(transactions: FinancialTransaction[], category: FinancialCategory) {
  return Math.abs(
    transactions
      .filter((transaction) => transaction.category === category && transaction.type === "saida")
      .reduce((sum, transaction) => sum + transaction.amount.amount, 0)
  );
}

function sentenceCase(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
