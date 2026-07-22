"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleGauge,
  Clock3,
  Compass,
  Fingerprint,
  GitBranch,
  LockKeyhole,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow
} from "lucide-react";
import { AICompanionPreview, ConnectedNodes, DataFlow, FloatingMetric, PillarRadar, PlanTimeline, ProgressCore, ScannerPanel } from "@/components/PremiumVisuals";
import { PricingCards } from "@/components/PricingCards";
import { faq, painCards } from "@/lib/copy";
import { demoAnswers, disclaimer, pillars } from "@/lib/questions";
import { scoreDiagnostic } from "@/lib/scoring";
import { behaviorPatterns, buildWeeklyPlan } from "@/lib/product-experience";

const result = scoreDiagnostic(demoAnswers);
const weeklyPlan = buildWeeklyPlan(result);

const recognitionCards = [
  "Você começa, mas abandona.",
  "Seu celular consome seu tempo.",
  "Você não sabe qual meta priorizar.",
  "Seu dinheiro não segue um plano.",
  "Sua rotina muda todos os dias.",
  "Você planeja mais do que executa.",
  "Você perde um dia e abandona a semana.",
  "Você sente que poderia estar muito melhor."
];

const productScreens = [
  ["Visão geral", "Índice, missão, prioridade, tendência e insight da IA."],
  ["Hoje", "Missão focada, versão mínima, checklist e conclusão."],
  ["Diagnóstico", "Mapa do momento, evidências, contradições e confiança."],
  ["Meu Plano", "Quatro semanas, marcos, bloqueios e replanejamento."],
  ["Hábitos", "Calendário, sequência, dificuldade e notas."],
  ["Foco", "Sessão rápida, intenção, interrupções e reflexão."],
  ["Evolução", "Linha do tempo, radar comparativo, heatmap e relatório mensal."],
  ["Assistente IA", "Explicações, adaptação, retomada e próxima ação."],
  ["Relatórios", "Inicial, semanal, mensal, PDF e limitações claras."]
];

const stickySteps = [
  {
    title: "Mapeamos seus padrões.",
    body: "As respostas deixam de ser texto solto e viram sinais: clareza, execução, tempo, rotina, dinheiro e energia.",
    visual: "Respostas → sinais"
  },
  {
    title: "Identificamos o bloqueio principal.",
    body: "O sistema cruza pontuações, evidências e contradições para encontrar a alavanca mais realista.",
    visual: "Bloqueio destacado"
  },
  {
    title: "Criamos uma prioridade.",
    body: "Metas demais são reduzidas para uma direção de 30 dias, com critério de conclusão.",
    visual: "Várias metas → uma prioridade"
  },
  {
    title: "Transformamos em ações.",
    body: "O plano vira missões curtas, versões mínimas e checkpoints para manter continuidade.",
    visual: "Calendário vivo"
  },
  {
    title: "Adaptamos quando a vida muda.",
    body: "Falhar um dia não reinicia o processo. O plano reduz, reorganiza e registra a retomada.",
    visual: "Antes → depois"
  }
];

export function PremiumLanding() {
  const reduced = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 90, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 24 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  function move(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <div className="site-shell">
      <div className="grid-background" />
      <div className="orbital-light" />
      <header className="topbar">
        <div className="container topbar-inner">
          <Link className="brand" href="/">
            <span className="brand-mark">V</span> Virada IA
          </Link>
          <nav className="nav" aria-label="Navegação principal">
            <a href="#metodo">Método</a>
            <a href="#produto">Produto</a>
            <a href="#planos">Planos</a>
            <a href="#faq">FAQ</a>
          </nav>
          <Link className="button secondary" href="/diagnostico">
            Começar <ArrowRight size={17} />
          </Link>
        </div>
      </header>

      <main>
        <section className="container hero-immersive" onMouseMove={move}>
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72 }}>
            <span className="eyebrow">
              <Sparkles size={15} /> Sistema inteligente de direção pessoal
            </span>
            <h1>Descubra o que está travando sua evolução antes de tentar mudar tudo novamente.</h1>
            <p>
              O Virada IA analisa seus hábitos, sua rotina, suas prioridades e seus padrões para criar uma direção clara e
              um plano personalizado de 30 dias.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/diagnostico">
                Descobrir meu ponto de virada <ArrowRight size={18} />
              </Link>
              <a className="button secondary" href="#demo">
                Ver uma análise de exemplo
              </a>
            </div>
            <div className="microcopy">
              {["Análise inicial gratuita", "Resultado personalizado", "Sem cartão"].map((item) => (
                <span key={item}>
                  <CheckCircle2 size={15} /> {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hero-console"
            style={reduced ? undefined : { rotateX, rotateY }}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.1 }}
          >
            <ScannerPanel className="signal-board" label="Núcleo de diagnóstico">
              <div className="score-row">
                <ProgressCore score={result.viradaIndex} confidence={result.confidence} trend="+6" />
                <PillarRadar scores={result.pillarScores} compact />
              </div>
              <div className="metric-grid">
                <FloatingMetric label="Bloqueio principal" value="Direção" detail="Muitas frentes abertas, pouca prioridade." tone="green" />
                <FloatingMetric label="Confiança" value={`${result.confidenceScore}%`} detail="Contradições reduzem certeza." tone="blue" delay={0.05} />
                <FloatingMetric label="Missão de hoje" value="15 min" detail="Escolher uma única meta." tone="gold" delay={0.1} />
                <FloatingMetric label="Próximo check-in" value="7 dias" detail="Ajustar sem apagar histórico." tone="violet" delay={0.15} />
              </div>
              <DataFlow stages={["Respostas", "Pontuação", "Padrões", "Prioridade", "Plano", "Acompanhamento"]} />
            </ScannerPanel>
          </motion.div>
        </section>

        <section className="section alt">
          <div className="container">
            <div className="section-header center">
              <span className="eyebrow">Reconhecimento sem culpa</span>
              <h2>Talvez você não esteja parado por falta de vontade.</h2>
              <p>
                Você pode estar tentando corrigir muitas áreas ao mesmo tempo, seguindo planos que não consideram sua
                rotina e começando sempre pela ação errada.
              </p>
            </div>
            <div className="cards-grid">
              {recognitionCards.map((item, index) => (
                <motion.article
                  className="info-card"
                  key={item}
                  initial={{ opacity: 1, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.42, delay: index * 0.04 }}
                >
                  <h3>{item}</h3>
                  <p>{painCards[index % painCards.length][1]}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="metodo">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Quebra de padrão</span>
              <h2>Mais uma lista de tarefas não resolverá.</h2>
            </div>
            <div className="comparison-grid">
              <ScannerPanel label="Método genérico">
                <h3 style={{ marginTop: 14, fontSize: "1.7rem" }}>Rotina pronta, metas excessivas e cobrança.</h3>
                <ul className="check-list" style={{ marginTop: 18 }}>
                  {["Começa pela agenda", "Aumenta a pressão", "Ignora o dia real", "Transforma falha em abandono"].map((item) => (
                    <li key={item}>
                      <LockKeyhole size={16} color="#ff6470" /> {item}
                    </li>
                  ))}
                </ul>
              </ScannerPanel>
              <ScannerPanel label="Virada IA">
                <h3 style={{ marginTop: 14, fontSize: "1.7rem" }}>Diagnóstico, prioridade, ação mínima e adaptação.</h3>
                <ul className="check-list" style={{ marginTop: 18 }}>
                  {["Começa pelo padrão", "Reduz fricção", "Explica a recomendação", "Planeja a retomada"].map((item) => (
                    <li key={item}>
                      <BadgeCheck size={16} color="#5cffb0" /> {item}
                    </li>
                  ))}
                </ul>
              </ScannerPanel>
            </div>
          </div>
        </section>

        <section className="section alt" id="produto">
          <div className="container sticky-story">
            <div className="sticky-copy">
              <span className="eyebrow">Storytelling do produto</span>
              <h2 style={{ marginTop: 18, fontSize: "clamp(2rem, 4vw, 3.7rem)" }}>
                O scroll mostra a transformação de resposta em direção.
              </h2>
              <p className="premium-copy">
                O produto não empilha cards: ele revela como uma vida confusa vira mapa, prioridade, plano e acompanhamento.
              </p>
              <AICompanionPreview result={result} />
            </div>
            <div className="story-stack">
              {stickySteps.map((step, index) => (
                <ScannerPanel key={step.title} label={step.visual}>
                  <span className="step-num">{String(index + 1).padStart(2, "0")}</span>
                  <h3 style={{ marginTop: 14, fontSize: "1.7rem" }}>{step.title}</h3>
                  <p className="premium-copy">{step.body}</p>
                  <PillarRadar scores={result.pillarScores.map((pillar, itemIndex) => ({ ...pillar, score: Math.max(22, pillar.score + index * 6 - itemIndex * 2) }))} compact />
                </ScannerPanel>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">
                <Radar size={15} /> Seis pilares conectados
              </span>
              <h2>Clareza, execução, tempo, rotina, dinheiro e energia não evoluem isolados.</h2>
            </div>
            <div className="pillar-grid">
              {Object.entries(pillars).map(([key, pillar], index) => {
                const score = result.pillarScores.find((item) => item.key === key)?.score ?? 50;
                const Icon = pillar.icon;
                return (
                  <article className="info-card pillar-card" style={{ "--pillar-color": `${pillar.color}2b` } as React.CSSProperties} key={key}>
                    <Icon color={pillar.color} size={25} />
                    <h3 style={{ marginTop: 14 }}>{pillar.name}</h3>
                    <p>{pillar.description}</p>
                    <div className="pillar-score" style={{ marginTop: 18 }}>
                      <motion.span
                        style={{ background: pillar.color }}
                        initial={{ width: "8%" }}
                        whileInView={{ width: `${score + index * 2}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.72 }}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">
                <Workflow size={15} /> IA com contexto
              </span>
              <h2>Inteligência artificial com contexto, não respostas genéricas.</h2>
              <p>
                As pontuações são calculadas por regras, a IA interpreta padrões, as recomendações usam respostas e
                contradições reduzem a confiança. O sistema é educacional e não realiza diagnóstico médico.
              </p>
            </div>
            <DataFlow stages={["Respostas", "Pontuação", "Padrões", "Prioridade", "Plano", "Acompanhamento"]} />
          </div>
        </section>

        <section className="section" id="demo">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Demonstração marcada como exemplo</span>
              <h2>Uma análise realista, explicável e sem promessa milagrosa.</h2>
            </div>
            <div className="dashboard-hero">
              <ScannerPanel label="Exemplo fictício">
                <ProgressCore score={43} confidence="média" trend="- ponto inicial" />
                <h3 style={{ marginTop: 18, fontSize: "1.7rem" }}>Falta de direção combinada com excesso de distração.</h3>
                <p className="premium-copy">
                  Evidências: várias metas ao mesmo tempo, cinco a sete horas de tela, abandono após falhas e ausência de
                  planejamento diário.
                </p>
                <div className="notice">
                  Primeira ação: escolha uma única meta para os próximos 30 dias e reserve 15 minutos para iniciar hoje.
                </div>
              </ScannerPanel>
              <ConnectedNodes items={behaviorPatterns.map((pattern) => ({ title: pattern.title, detail: pattern.action }))} />
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">
                <Clock3 size={15} /> Plano de 30 dias
              </span>
              <h2>Quatro semanas com missão diária, check-in e replanejamento.</h2>
            </div>
            <div className="cards-grid">
              {weeklyPlan.map((week) => (
                <article className="info-card" key={week.week}>
                  <span className="step-num">Semana {week.week}</span>
                  <h3 style={{ marginTop: 12 }}>{week.theme}</h3>
                  <p>{week.objective}</p>
                </article>
              ))}
            </div>
            <ScannerPanel label="Primeiros dias do plano" className="panel" style={{ marginTop: 18 } as React.CSSProperties}>
              <PlanTimeline missions={result.thirtyDayPlan} />
            </ScannerPanel>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">
                <CircleGauge size={15} /> Produto completo
              </span>
              <h2>Dashboard de evolução, não apenas uma área de resultado.</h2>
            </div>
            <div className="dashboard-module-grid">
              {productScreens.map(([title, body]) => (
                <article className="info-card" key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section alt" id="planos">
          <div className="container">
            <div className="section-header center">
              <span className="eyebrow">Planos sem urgência falsa</span>
              <h2>Escolha o nível de acompanhamento que combina com seu momento.</h2>
            </div>
            <PricingCards />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">
                <ShieldCheck size={15} /> Confiança
              </span>
              <h2>Dados protegidos, análise explicável e limitações claras.</h2>
            </div>
            <div className="cards-grid">
              {[
                [Fingerprint, "Sem venda de dados", "Analytics não recebe e-mail, telefone ou respostas completas."],
                [ShieldCheck, "Pagamento seguro", "Acesso completo depende de webhook válido ou consulta segura."],
                [GitBranch, "Plano adaptável", "Replanejamento cria nova versão, sem apagar histórico."],
                [LockKeyhole, "Cancelamento simples", "Assinatura e status aparecem na área da conta."],
                [Compass, "Recomendação explicável", "Cada sugestão mostra motivo, evidência, impacto e dificuldade."],
                [Sparkles, "IA com limites", "Sem diagnóstico médico, prescrição ou conselho financeiro específico."]
              ].map(([Icon, title, body]) => {
                const TypedIcon = Icon as typeof ShieldCheck;
                return (
                  <article className="info-card" key={String(title)}>
                    <TypedIcon color="#5cffb0" size={24} />
                    <h3 style={{ marginTop: 12 }}>{String(title)}</h3>
                    <p>{String(body)}</p>
                  </article>
                );
              })}
            </div>
            <div className="notice" style={{ marginTop: 18 }}>
              {disclaimer}
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
              {faq.map((item) => (
                <article className="faq-item" key={item.question}>
                  <strong>{item.question}</strong>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header center">
              <span className="eyebrow">Primeiro passo possível</span>
              <h2>Você já tentou mudar muitas vezes. Agora descubra por onde deveria ter começado.</h2>
              <p>Menos culpa. Mais clareza. Um plano compatível com sua realidade.</p>
              <Link className="button" href="/diagnostico">
                Fazer minha análise gratuita <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
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
