"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  CheckCircle2,
  Command,
  Fingerprint,
  GitBranch,
  LockKeyhole,
  MessageSquareText,
  Mic,
  RefreshCcw,
  Route,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";
import {
  AssessorCore,
  AudioWave,
  AutomationFlow,
  HolographicPanel,
  MetricTile,
  PhoneCommandPreview,
  StatusPill,
  TimelineMap
} from "@/components/AssessorVisuals";
import {
  buildMorningBriefing,
  demoEvents,
  demoMemories,
  demoNotifications,
  demoProjects,
  demoRoutines,
  demoTasks,
  findFreeWindows,
  integrations,
  onboardingSteps
} from "@/lib/assistant-core";

const briefing = buildMorningBriefing();
const freeWindows = findFreeWindows(demoEvents);

const scrollStory = [
  {
    label: "Entrada natural",
    title: "A pessoa fala do jeito dela.",
    body: "Audio, texto, ideia solta, prazo, cobranca ou compromisso entram na mesma central.",
    flow: ["Mensagem", "Audio", "Arquivo"]
  },
  {
    label: "Classificacao",
    title: "O assessor entende o tipo de acao.",
    body: "Tarefa, agenda, rotina, lembrete, follow-up, projeto ou nota aparecem como rascunho antes de criar.",
    flow: ["Classificar", "Pedir detalhe", "Confirmar"]
  },
  {
    label: "Agenda viva",
    title: "O dia ganha horario, prioridade e contexto.",
    body: "O sistema encontra janelas livres, conflitos e tarefas que cabem no tempo real.",
    flow: ["Agenda", "Tarefas", "Tempo livre"]
  },
  {
    label: "Proatividade",
    title: "Ele volta antes de virar problema.",
    body: "Lembra antes, cobra no horario, acompanha depois e sugere reagendamento se algo atrasar.",
    flow: ["Antes", "Durante", "Depois"]
  }
];

const sections = [
  ["Demonstração por áudio", "Fale: 'amanha as 14h tenho dentista'. O assessor cria um rascunho com horario, duracao e pergunta se deve considerar deslocamento.", Mic],
  ["Organização automática", "Entradas soltas viram agenda, tarefa, lembrete, rotina, projeto, follow-up ou nota.", Command],
  ["Agenda e tarefas", "Dia, semana, recorrencias, conflitos, tempo livre e prioridade aparecem no mesmo mapa.", CalendarClock],
  ["Lembretes no celular", "Push, painel, e-mail, WhatsApp e Calendar ficam sob consentimento e horario silencioso.", BellRing],
  ["Briefing da manhã", briefing.greeting, Sparkles],
  ["Replanejamento automático", "Se voce atrasar, nada e apagado. O assessor mostra impacto e pede confirmacao para reagendar.", RefreshCcw],
  ["Projetos", "Objetivo, prazo, tarefas, progresso, arquivos, notas, responsaveis e proximos passos.", GitBranch],
  ["Memória pessoal", "Preferencias, horarios, pessoas, locais e prioridades ficam visiveis, editaveis e removiveis.", Fingerprint],
  ["Dashboard", "Central de comando holografica com Meu Dia, Assessor IA, Agenda, Tarefas e Follow-ups.", Route],
  ["Integrações", "Google Calendar, WhatsApp Cloud API, OpenAI, Web Push e e-mail preparados para credenciais reais.", Zap],
  ["Planos", "Compra libera onboarding, configuracao do primeiro dia e canais de notificacao.", CheckCircle2],
  ["Segurança", "Nenhuma mensagem externa importante sai sem confirmacao explicita do usuario.", ShieldCheck],
  ["FAQ", "Modo demo existe para validar produto sem fingir dados reais nem bloquear redesign por credencial.", MessageSquareText]
];

const faq = [
  ["Ele envia WhatsApp sozinho?", "Nao. O WhatsApp oficial fica preparado, mas qualquer envio importante exige consentimento e configuracao."],
  ["Funciona sem Google Calendar?", "Sim. O modo demo organiza agenda localmente e mostra exatamente quais variaveis faltam para conectar a agenda real."],
  ["Posso apagar memorias?", "Sim. A memoria pessoal aparece em pagina propria para visualizar, editar e excluir."],
  ["E se eu nao cumprir o dia?", "O assessor pergunta o que ficou pendente, mostra impacto e sugere um novo encaixe sem marcar nada como concluido sozinho."]
];

export function AssessorLanding() {
  const reduced = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 82, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 82, damping: 24 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  function move(event: React.MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <div className="site-shell command-theme">
      <div className="command-grid" />
      <div className="blue-aurora" />
      <header className="topbar">
        <div className="container topbar-inner">
          <Link className="brand" href="/">
            <span className="brand-mark">V</span> Virada IA
          </Link>
          <nav className="nav" aria-label="Navegacao principal">
            <a href="#demo-audio">Audio</a>
            <a href="#produto">Produto</a>
            <a href="#integracoes">Integracoes</a>
            <a href="#planos">Planos</a>
          </nav>
          <Link className="button secondary" href="/dashboard">
            Abrir demo <ArrowRight size={17} />
          </Link>
        </div>
      </header>

      <main>
        <section className="container assessor-hero" onMouseMove={move}>
          <motion.div className="hero-copy" initial={{ opacity: 1, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.62 }}>
            <span className="eyebrow">
              <Sparkles size={15} /> Assessor pessoal proativo com IA
            </span>
            <h1>Um assessor pessoal. Sempre atento ao seu dia.</h1>
            <p>
              Fale o que precisa fazer. A inteligencia artificial organiza sua agenda, suas tarefas, seus compromissos e
              lembra voce na hora certa.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/checkout">
                Quero meu assessor pessoal <ArrowRight size={18} />
              </Link>
              <a className="button secondary" href="#produto">
                Ver como funciona
              </a>
            </div>
            <div className="microcopy">
              {["Texto e audio", "Confirmacao antes de agir", "Modo demo sem credenciais"].map((item) => (
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
            <HolographicPanel className="command-center-card" label="Central do assessor">
              <div className="hero-console-grid">
                <AssessorCore score={68} />
                <PhoneCommandPreview />
              </div>
              <div className="metric-grid">
                <MetricTile label="Proximo" value="14:00" detail="Dentista com alerta 30 min antes" />
                <MetricTile label="Livre" value="40 min" detail="Janela para orcamento" tone="blue" />
                <MetricTile label="Critico" value="1" detail="Conta precisa de confirmacao" tone="amber" />
                <MetricTile label="Conflitos" value="0" detail="Agenda atual sem sobreposicao" tone="cyan" />
              </div>
            </HolographicPanel>
          </motion.div>
        </section>

        <section className="section alt" id="demo-audio">
          <div className="container dashboard-hero">
            <HolographicPanel label="Audio para acao">
              <span className="eyebrow">
                <Mic size={15} /> Demonstracao por audio
              </span>
              <h2 className="section-title">Diga uma frase. O assessor transforma em rascunho confirmado.</h2>
              <p className="premium-copy">
                Me lembra de ligar para o Joao sexta vira lembrete ou follow-up. Se faltar horario, ele pergunta antes de
                criar.
              </p>
              <AudioWave active />
              <div className="notice">
                Nenhuma acao externa importante e enviada sem confirmacao. O sistema primeiro prepara, mostra impacto e pede
                autorizacao.
              </div>
            </HolographicPanel>
            <HolographicPanel label="Agenda preenchendo">
              <TimelineMap events={demoEvents} tasks={demoTasks} />
            </HolographicPanel>
          </div>
        </section>

        <section className="section" id="produto">
          <div className="container sticky-story">
            <div className="sticky-copy">
              <span className="eyebrow">Storytelling do produto</span>
              <h2 className="section-title">Do caos falado para um dia organizado.</h2>
              <p className="premium-copy">
                A landing mostra o produto trabalhando: entrada natural, classificacao, agenda viva e acompanhamento
                proativo.
              </p>
              <HolographicPanel label="Briefing da manha" compact>
                <h3>{briefing.greeting}</h3>
                <p className="premium-copy">
                  Primeiro compromisso: {briefing.firstEvent.title} as {briefing.firstEvent.start}. Tarefa principal:{" "}
                  {briefing.mainTask.title}.
                </p>
              </HolographicPanel>
            </div>
            <div className="story-stack">
              {scrollStory.map((story, index) => (
                <HolographicPanel key={story.title} label={story.label}>
                  <span className="step-num">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{story.title}</h3>
                  <p className="premium-copy">{story.body}</p>
                  <AutomationFlow steps={story.flow} />
                </HolographicPanel>
              ))}
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">
                <BellRing size={15} /> Diferencial proativo
              </span>
              <h2>Ele nao espera voce lembrar que esqueceu.</h2>
              <p>
                O assessor identifica conflito, sugere janelas livres, cobra antes do prazo, pergunta se algo foi concluido
                e replaneja pendencias com confirmacao.
              </p>
            </div>
            <div className="cards-grid">
              {[
                ["Conflitos", "Aviso antes de compromissos sobrepostos ou deslocamento apertado."],
                ["Janelas livres", freeWindows[0] ? `${freeWindows[0].minutes} minutos livres para encaixar tarefa importante.` : "Detecta blocos livres no dia."],
                ["Acompanhamento", "Depois do horario, pergunta se voce conseguiu comparecer ou concluir."],
                ["Replanejamento", "Mostra impacto, sugere novo horario e espera sua confirmacao."],
                ["Prioridade", "Se tudo parece urgente, destaca o que protege o dia."],
                ["Resumo", "Fecha a noite com concluidos, pendentes, imprevistos e proximo dia."]
              ].map(([title, body]) => (
                <article className="info-card" key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">
                <Route size={15} /> Sistema completo
              </span>
              <h2>Todas as areas tem funcao real, sem abas vazias.</h2>
            </div>
            <div className="dashboard-module-grid">
              {sections.map(([title, body, Icon]) => {
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

        <section className="section alt">
          <div className="container dashboard-hero">
            <HolographicPanel label="Projetos">
              {demoProjects.map((project) => (
                <article className="project-row" key={project.id}>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.goal}</p>
                  </div>
                  <strong>{project.progress}%</strong>
                </article>
              ))}
            </HolographicPanel>
            <HolographicPanel label="Rotinas e memoria">
              <div className="stack-list">
                {demoRoutines.slice(0, 2).map((routine) => (
                  <div className="stack-item" key={routine.id}>
                    <strong>{routine.title}</strong>
                    <span>{routine.schedule}</span>
                  </div>
                ))}
                {demoMemories.slice(0, 3).map((memory) => (
                  <div className="stack-item" key={memory.id}>
                    <strong>{memory.label}</strong>
                    <span>{memory.value}</span>
                  </div>
                ))}
              </div>
            </HolographicPanel>
          </div>
        </section>

        <section className="section" id="integracoes">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">
                <Zap size={15} /> Integracoes preparadas
              </span>
              <h2>Credenciais reais conectam canais. O redesign nao fica bloqueado por elas.</h2>
            </div>
            <div className="cards-grid">
              {integrations.map((integration) => (
                <article className="info-card" key={integration.id}>
                  <StatusPill tone={integration.status === "ready" ? "cyan" : integration.status === "demo" ? "blue" : "amber"}>
                    {integration.status}
                  </StatusPill>
                  <h3>{integration.label}</h3>
                  <p>{integration.description}</p>
                  <small>{integration.requiredEnv.join(" · ")}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section alt" id="planos">
          <div className="container">
            <div className="section-header center">
              <span className="eyebrow">Compra e ativacao</span>
              <h2>Depois da compra, o assessor configura o primeiro dia.</h2>
              <p>Onboarding com nome, horarios, notificacoes, WhatsApp, compromissos fixos e tres prioridades.</p>
            </div>
            <HolographicPanel label="Sequencia de onboarding">
              <AutomationFlow steps={onboardingSteps} />
            </HolographicPanel>
            <div className="offer-grid" style={{ marginTop: 16 }}>
              <article className="price-card">
                <StatusPill>Essencial</StatusPill>
                <h3>Assessor Pessoal</h3>
                <div className="price">R$ 47</div>
                <p>Central, Meu Dia, tarefas, agenda, lembretes e modo demo completo.</p>
                <Link className="button" href="/checkout">
                  Quero meu assessor pessoal
                </Link>
              </article>
              <article className="price-card featured">
                <StatusPill tone="amber">Proativo</StatusPill>
                <h3>Assessor Pro</h3>
                <div className="price">R$ 59,90/mês</div>
                <p>Briefings, follow-ups, integracoes, WhatsApp, replanejamento e historico.</p>
                <Link className="button" href="/checkout?plan=pro">
                  Ativar plano Pro
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container dashboard-hero">
            <HolographicPanel label="Seguranca">
              <span className="eyebrow">
                <LockKeyhole size={15} /> Controle do usuario
              </span>
              <h2 className="section-title">Memoria e notificacoes sob seu controle.</h2>
              <p className="premium-copy">
                O assessor pode sugerir, organizar e preparar. Enviar mensagem externa, alterar calendario conectado ou
                acionar terceiros exige autorizacao.
              </p>
            </HolographicPanel>
            <HolographicPanel label="Canais">
              <div className="stack-list">
                {demoNotifications.map((notification) => (
                  <div className="stack-item" key={notification.id}>
                    <strong>{notification.title}</strong>
                    <span>
                      {notification.channel} · {notification.consent ? "ativo" : "aguardando consentimento"}
                    </span>
                  </div>
                ))}
              </div>
            </HolographicPanel>
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
              <span className="eyebrow">Central pronta</span>
              <h2>Fale o que precisa fazer. Seu assessor organiza o resto.</h2>
              <Link className="button" href="/checkout">
                Quero meu assessor pessoal <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>© 2026 Virada IA</span>
          <span>
            <a href="/legal/privacidade">Privacidade</a> · <a href="/legal/termos">Termos</a> ·{" "}
            <a href="/legal/cookies">Cookies</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
