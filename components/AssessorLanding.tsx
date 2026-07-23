"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  BellRing,
  CalendarClock,
  CheckCircle2,
  Fingerprint,
  LockKeyhole,
  MessageSquareText,
  Mic,
  RefreshCcw,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  WalletCards,
  Zap
} from "lucide-react";
import {
  AgentMesh,
  AssessorCore,
  AudioWave,
  AutomationFlow,
  ConnectedAreaMap,
  FinanceSignalGraph,
  HolographicPanel,
  MetricTile,
  OpenFinanceFlow,
  PhoneCommandPreview,
  StatusPill
} from "@/components/AssessorVisuals";
import { buildFinancialOverview, sandboxAccounts, sandboxBills, sandboxTransactions } from "@/lib/financial-provider";
import { demoAgents, demoAgendaItems, demoJourneyGoals, personalOsAreas, personalOsOnboardingSteps } from "@/lib/personal-os";

const overview = buildFinancialOverview(sandboxAccounts, sandboxTransactions, sandboxBills);

const productSections = [
  ["Início", "Briefing, agenda, tarefas, contas próximas, saldo consolidado, projetos, riscos e ações sugeridas.", Route],
  ["Sua Jornada", "Objetivos viram metas, metas viram plano, plano vira ação de hoje com revisão semanal.", Target],
  ["Agenda", "Dia, semana, mês, tarefas, projetos, rotinas, lembretes, follow-ups e modo foco.", CalendarClock],
  ["Finanças", "Extrato unificado, contas, cartões, faturas, orçamento, metas, investimentos e alertas.", WalletCards],
  ["Open Finance", "Pluggy inicial, Belvo preparado, conexão oficial, consentimento, sandbox e revogação.", Banknote],
  ["Agentes de IA", "Assessor, Planejador, Financeiro, Projetos, Comunicação e Follow-up com permissões.", MessageSquareText],
  ["Lembretes no celular", "PWA, Web Push, e-mail, Google Calendar e WhatsApp preparado com consentimentos separados.", BellRing],
  ["Briefing diário", "Manhã e noite com prioridades, conflitos, contas, faturas, metas e replanejamento.", Sparkles],
  ["Replanejamento", "Se algo atrasar, a IA mostra impacto, sugere novo horário e pede confirmação.", RefreshCcw],
  ["Memória", "Preferências, horários, locais, categorias e prioridades visíveis, editáveis e removíveis.", Fingerprint],
  ["Segurança", "Somente leitura, sem senha bancária, sem token no navegador e sem movimentação financeira.", ShieldCheck]
];

const stickyStory = [
  {
    label: "Comando natural",
    title: "“Pagar o seguro sexta.”",
    body: "A frase entra como voz ou texto e vira um rascunho, não uma ação escondida.",
    steps: ["Audio/texto", "Classificar", "Pedir confirmação"]
  },
  {
    label: "Finanças",
    title: "Conta a pagar criada.",
    body: "O compromisso financeiro guarda valor, categoria, vencimento e status sem alterar dado bancário bruto.",
    steps: ["Conta", "Categoria", "Vencimento"]
  },
  {
    label: "Agenda",
    title: "A tarefa ganha horário e lembretes.",
    body: "O sistema adiciona evento financeiro, lembrete antecipado e acompanhamento depois do prazo.",
    steps: ["Agenda", "Lembrete", "Follow-up"]
  },
  {
    label: "Início",
    title: "A Central mostra o impacto.",
    body: "O briefing conecta conta, saldo sandbox, tarefa crítica e pergunta se deve ajustar seu dia.",
    steps: ["Briefing", "Risco", "Ação sugerida"]
  }
];

const faq = [
  ["O Virada IA pede minha senha do banco?", "Não. O fluxo bancário usa o widget oficial do provider. O Virada IA recebe dados autorizados, somente leitura, e nunca pede senha bancária dentro do app."],
  ["Os dados sandbox parecem reais?", "Não. Quando faltam credenciais ou o modo sandbox está ativo, a interface marca claramente que são dados de exemplo."],
  ["Ele paga contas automaticamente?", "Não nesta fase. O sistema informa, lembra, organiza e acompanha, mas não movimenta dinheiro nem inicia pagamento."],
  ["A IA recebe CPF ou cartão completo?", "Não. O agente financeiro usa dados agregados, normalizados, mascarados e minimizados."],
  ["Posso revogar a conexão?", "Sim. A área Finanças > Conexões mostra status, consentimento, validade, atualizar, reconectar, revogar e remover dados."],
  ["Funciona sem banco conectado?", "Sim. Contas manuais, metas, agenda e demonstração sandbox continuam funcionando sem fingir que são dados reais."]
];

export function AssessorLanding() {
  const reduced = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 78, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 78, damping: 24 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);

  function move(event: React.MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <div className="site-shell command-theme">
      <div className="command-grid" />
      <header className="topbar">
        <div className="container topbar-inner">
          <Link className="brand" href="/">
            <span className="brand-mark">V</span> Virada IA
          </Link>
          <nav className="nav" aria-label="Navegação principal">
            <a href="#como-funciona">Como funciona</a>
            <a href="#financas">Finanças</a>
            <a href="#seguranca">Segurança</a>
            <a href="#planos">Planos</a>
          </nav>
          <Link className="button secondary" href="/dashboard">
            Abrir demo <ArrowRight size={17} />
          </Link>
        </div>
      </header>

      <main>
        <section className="container assessor-hero personal-os-hero" onMouseMove={move}>
          <motion.div className="hero-copy" initial={{ opacity: 1, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.62 }}>
            <span className="eyebrow">
              <Sparkles size={15} /> Sistema operacional pessoal com IA
            </span>
            <h1>Sua vida inteira. Organizada por uma inteligência que trabalha com você.</h1>
            <p>Agenda, tarefas, objetivos e finanças em um único sistema inteligente que organiza, lembra, acompanha e adapta seu dia.</p>
            <div className="hero-actions">
              <Link className="button" href="/checkout">
                Conhecer meu sistema pessoal <ArrowRight size={18} />
              </Link>
              <a className="button secondary" href="#como-funciona">
                Ver como funciona
              </a>
            </div>
            <div className="microcopy">
              {["Cinco áreas conectadas", "Open Finance read-only", "Ações importantes com confirmação"].map((item) => (
                <span key={item}>
                  <CheckCircle2 size={15} /> {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hero-command-center"
            style={reduced ? undefined : { rotateX, rotateY }}
            initial={{ opacity: 1, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.08 }}
          >
            <HolographicPanel className="command-center-card" label="Central viva">
              <div className="hero-console-grid">
                <AssessorCore score={74} label="Organização" />
                <PhoneCommandPreview />
              </div>
              <div className="metric-grid">
                <MetricTile label="Saldo" value={formatMoney(overview.consolidatedBalance.amount)} detail="consolidado sandbox" />
                <MetricTile label="Agenda" value="3" detail="compromissos hoje" tone="blue" />
                <MetricTile label="Conta" value="1" detail="vence em breve" tone="amber" />
                <MetricTile label="Meta" value="34%" detail="carro conectado" tone="cyan" />
              </div>
            </HolographicPanel>
          </motion.div>
        </section>

        <section className="section alt" id="como-funciona">
          <div className="container dashboard-hero">
            <HolographicPanel label="Demonstração por voz">
              <span className="eyebrow">
                <Mic size={15} /> Entrada natural
              </span>
              <h2 className="section-title">Fale como pessoa. O sistema transforma em agenda, tarefa, conta, meta ou follow-up.</h2>
              <p className="premium-copy">
                “Amanhã às 14h tenho dentista”, “pagar o seguro sexta” e “quero juntar R$ 20.000 para comprar um carro” viram rascunhos com confirmação.
              </p>
              <AudioWave active />
            </HolographicPanel>
            <HolographicPanel label="Tudo conectado">
              <ConnectedAreaMap areas={personalOsAreas} />
            </HolographicPanel>
          </div>
        </section>

        <section className="section">
          <div className="container sticky-story">
            <div className="sticky-copy">
              <span className="eyebrow">Storytelling sticky</span>
              <h2 className="section-title">Uma frase atravessa o sistema inteiro.</h2>
              <p className="premium-copy">
                A promessa do Virada IA aparece no fluxo, não em cards soltos: IA, Finanças, Agenda, Início e Notificações conversam.
              </p>
              <HolographicPanel compact label="Resumo gerado">
                <h3>Seguro na sexta, fatura sandbox em aberto e bloco livre antes da reunião.</h3>
                <p className="premium-copy">A Central pergunta se pode encaixar a tarefa do orçamento e criar lembrete antecipado.</p>
              </HolographicPanel>
            </div>
            <div className="story-stack">
              {stickyStory.map((story, index) => (
                <HolographicPanel key={story.title} label={story.label}>
                  <span className="step-num">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{story.title}</h3>
                  <p className="premium-copy">{story.body}</p>
                  <AutomationFlow steps={story.steps} />
                </HolographicPanel>
              ))}
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">
                <Zap size={15} /> Produto completo
              </span>
              <h2>Não é dashboard administrativo. É uma central de comando pessoal.</h2>
              <p>As seções abaixo são o próprio produto: Início, Jornada, Agenda, Finanças, Open Finance, Agentes, Lembretes, Briefing, Memória e Segurança.</p>
            </div>
            <div className="dashboard-module-grid">
              {productSections.map(([title, body, Icon]) => {
                const TypedIcon = Icon as typeof Sparkles;
                return (
                  <article className="info-card product-surface" key={String(title)}>
                    <TypedIcon size={23} />
                    <h3>{String(title)}</h3>
                    <p>{String(body)}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section" id="financas">
          <div className="container dashboard-hero">
            <HolographicPanel label="Finanças + Open Finance">
              <span className="eyebrow">
                <Banknote size={15} /> Pluggy inicial · Belvo preparado
              </span>
              <h2 className="section-title">Contas bancárias entram por consentimento oficial, nunca por senha dentro do Virada IA.</h2>
              <p className="premium-copy">
                O backend cria token temporário, abre o widget oficial, valida conexão por API/webhook, sincroniza dados e mantém o agente financeiro em leitura.
              </p>
              <OpenFinanceFlow activeStep={5} />
            </HolographicPanel>
            <HolographicPanel label="Extrato e sinal financeiro">
              <FinanceSignalGraph values={[22, 34, 28, 42, 38, 58, 49, 68, 61, 74, 69, 88]} />
              <div className="stack-list">
                <div className="stack-item">
                  <strong>Saldo consolidado</strong>
                  <span>{formatMoney(overview.consolidatedBalance.amount)} · sandbox</span>
                </div>
                <div className="stack-item">
                  <strong>Assinaturas prováveis</strong>
                  <span>{overview.subscriptions.length} recorrências detectadas sem cancelar nada automaticamente.</span>
                </div>
              </div>
            </HolographicPanel>
          </div>
        </section>

        <section className="section alt">
          <div className="container dashboard-hero">
            <HolographicPanel label="Agentes de IA">
              <AgentMesh agents={demoAgents} />
            </HolographicPanel>
            <HolographicPanel label="Contexto autorizado">
              <div className="stack-list">
                {demoAgents.slice(0, 4).map((agent) => (
                  <div className="stack-item" key={agent.id}>
                    <strong>{agent.label}</strong>
                    <span>{agent.currentSuggestion}</span>
                  </div>
                ))}
              </div>
            </HolographicPanel>
          </div>
        </section>

        <section className="section">
          <div className="container dashboard-hero">
            <HolographicPanel label="Briefing diário">
              <h2 className="section-title">Todo dia começa com contexto, não com tela vazia.</h2>
              <p className="premium-copy">
                O briefing reúne compromissos, tarefas prioritárias, contas próximas, fatura, progresso das metas, hábitos, projetos e ações sugeridas.
              </p>
              <div className="stack-list">
                {demoAgendaItems.slice(0, 3).map((item) => (
                  <div className="stack-item" key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.date} · {item.kind} · {item.status}</span>
                  </div>
                ))}
              </div>
            </HolographicPanel>
            <HolographicPanel label="Sua Jornada">
              <div className="stack-list">
                {demoJourneyGoals.map((goal) => (
                  <div className="stack-item" key={goal.id}>
                    <strong>{goal.title}</strong>
                    <span>{goal.target} · {goal.progress}% · {goal.nextAction}</span>
                  </div>
                ))}
              </div>
            </HolographicPanel>
          </div>
        </section>

        <section className="section alt" id="seguranca">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">
                <LockKeyhole size={15} /> Segurança e consentimento
              </span>
              <h2>Segredos ficam no backend. O usuário controla memória, consentimento e revogação.</h2>
            </div>
            <div className="cards-grid">
              {[
                ["Sem senha bancária", "Autenticação acontece no fluxo oficial do provider e da instituição."],
                ["Somente leitura", "Sem iniciação de pagamento, transferência, compra, venda ou crédito."],
                ["Dados minimizados", "CPF, token, conta completa e cartão completo não vão para o modelo."],
                ["Webhook seguro", "Assinatura, replay window, idempotência e payload sanitizado."],
                ["LGPD", "Consentimento, revogação, exclusão, auditoria, exportação e retenção documentadas."],
                ["Sandbox claro", "Demonstração nunca aparece como dado real."]
              ].map(([title, body]) => (
                <article className="info-card" key={title}>
                  <ShieldCheck size={22} />
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="planos">
          <div className="container">
            <div className="section-header center">
              <span className="eyebrow">Onboarding após cadastro</span>
              <h2>Depois do pagamento, o sistema configura o primeiro dia.</h2>
              <p>Open Finance é opcional e explicado antes de qualquer conexão.</p>
            </div>
            <HolographicPanel label="Sequência de ativação">
              <AutomationFlow steps={personalOsOnboardingSteps} />
            </HolographicPanel>
            <div className="offer-grid" style={{ marginTop: 16 }}>
              <article className="price-card">
                <StatusPill>Essencial</StatusPill>
                <h3>Personal OS</h3>
                <div className="price">R$ 47</div>
                <p>Início, Jornada, Agenda, Finanças sandbox, agentes e onboarding completo.</p>
                <Link className="button" href="/checkout">
                  Conhecer meu sistema pessoal
                </Link>
              </article>
              <article className="price-card featured">
                <StatusPill tone="amber">Proativo</StatusPill>
                <h3>Personal OS Pro</h3>
                <div className="price">R$ 59,90/mês</div>
                <p>Briefings, follow-ups, integrações, notificações e histórico avançado.</p>
                <Link className="button" href="/checkout?plan=pro">
                  Ativar plano Pro
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className="section alt" id="faq">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">FAQ</span>
              <h2>Perguntas frequentes</h2>
            </div>
            <div className="faq-grid">
              {faq.map(([question, answer]) => (
                <article className="faq-item" key={question}>
                  <strong>{question}</strong>
                  <p>{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header center">
              <span className="eyebrow">CTA final</span>
              <h2>Sua vida inteira. Uma central inteligente trabalhando com você.</h2>
              <Link className="button" href="/checkout">
                Conhecer meu sistema pessoal <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>© 2026 Virada IA</span>
          <span>
            <a href="/legal/privacidade">Privacidade</a> · <a href="/legal/termos">Termos</a> · <a href="/legal/cookies">Cookies</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
