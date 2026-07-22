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
  "VocÃª comeÃ§a, mas abandona.",
  "Seu celular consome seu tempo.",
  "VocÃª nÃ£o sabe qual meta priorizar.",
  "Seu dinheiro nÃ£o segue um plano.",
  "Sua rotina muda todos os dias.",
  "VocÃª planeja mais do que executa.",
  "VocÃª perde um dia e abandona a semana.",
  "VocÃª sente que poderia estar muito melhor."
];

const productScreens = [
  ["VisÃ£o geral", "Ãndice, missÃ£o, prioridade, tendÃªncia e insight da IA."],
  ["Hoje", "MissÃ£o focada, versÃ£o mÃ­nima, checklist e conclusÃ£o."],
  ["DiagnÃ³stico", "Mapa do momento, evidÃªncias, contradiÃ§Ãµes e confianÃ§a."],
  ["Meu Plano", "Quatro semanas, marcos, bloqueios e replanejamento."],
  ["HÃ¡bitos", "CalendÃ¡rio, sequÃªncia, dificuldade e notas."],
  ["Foco", "SessÃ£o rÃ¡pida, intenÃ§Ã£o, interrupÃ§Ãµes e reflexÃ£o."],
  ["EvoluÃ§Ã£o", "Linha do tempo, radar comparativo, heatmap e relatÃ³rio mensal."],
  ["Assistente IA", "ExplicaÃ§Ãµes, adaptaÃ§Ã£o, retomada e prÃ³xima aÃ§Ã£o."],
  ["RelatÃ³rios", "Inicial, semanal, mensal, PDF e limitaÃ§Ãµes claras."]
];

const stickySteps = [
  {
    title: "Mapeamos seus padrÃµes.",
    body: "As respostas deixam de ser texto solto e viram sinais: clareza, execuÃ§Ã£o, tempo, rotina, dinheiro e energia.",
    visual: "Respostas â†’ sinais"
  },
  {
    title: "Identificamos o bloqueio principal.",
    body: "O sistema cruza pontuaÃ§Ãµes, evidÃªncias e contradiÃ§Ãµes para encontrar a alavanca mais realista.",
    visual: "Bloqueio destacado"
  },
  {
    title: "Criamos uma prioridade.",
    body: "Metas demais sÃ£o reduzidas para uma direÃ§Ã£o de 30 dias, com critÃ©rio de conclusÃ£o.",
    visual: "VÃ¡rias metas â†’ uma prioridade"
  },
  {
    title: "Transformamos em aÃ§Ãµes.",
    body: "O plano vira missÃµes curtas, versÃµes mÃ­nimas e checkpoints para manter continuidade.",
    visual: "CalendÃ¡rio vivo"
  },
  {
    title: "Adaptamos quando a vida muda.",
    body: "Falhar um dia nÃ£o reinicia o processo. O plano reduz, reorganiza e registra a retomada.",
    visual: "Antes â†’ depois"
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
          <nav className="nav" aria-label="NavegaÃ§Ã£o principal">
            <a href="#metodo">MÃ©todo</a>
            <a href="#produto">Produto</a>
            <a href="#planos">Planos</a>
            <a href="#faq">FAQ</a>
          </nav>
          <Link className="button secondary" href="/diagnostico">
            ComeÃ§ar <ArrowRight size={17} />
          </Link>
        </div>
      </header>

      <main>
        <section className="container hero-immersive" onMouseMove={move}>
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72 }}>
            <span className="eyebrow">
              <Sparkles size={15} /> Sistema inteligente de direÃ§Ã£o pessoal
            </span>
            <h1>Descubra o que estÃ¡ travando sua evoluÃ§Ã£o antes de tentar mudar tudo novamente.</h1>
            <p>
              O Virada IA analisa seus hÃ¡bitos, sua rotina, suas prioridades e seus padrÃµes para criar uma direÃ§Ã£o clara e
              um plano personalizado de 30 dias.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/diagnostico">
                Descobrir meu ponto de virada <ArrowRight size={18} />
              </Link>
              <a className="button secondary" href="#demo">
                Ver uma anÃ¡lise de exemplo
              </a>
            </div>
            <div className="microcopy">
              {["AnÃ¡lise inicial gratuita", "Resultado personalizado", "Sem cartÃ£o"].map((item) => (
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
            <ScannerPanel className="signal-board" label="NÃºcleo de diagnÃ³stico">
              <div className="score-row">
                <ProgressCore score={result.viradaIndex} confidence={result.confidence} trend="+6" />
                <PillarRadar scores={result.pillarScores} compact />
              </div>
              <div className="metric-grid">
                <FloatingMetric label="Bloqueio principal" value="DireÃ§Ã£o" detail="Muitas frentes abertas, pouca prioridade." tone="green" />
                <FloatingMetric label="ConfianÃ§a" value={`${result.confidenceScore}%`} detail="ContradiÃ§Ãµes reduzem certeza." tone="blue" delay={0.05} />
                <FloatingMetric label="MissÃ£o de hoje" value="15 min" detail="Escolher uma Ãºnica meta." tone="gold" delay={0.1} />
                <FloatingMetric label="PrÃ³ximo check-in" value="7 dias" detail="Ajustar sem apagar histÃ³rico." tone="violet" delay={0.15} />
              </div>
              <DataFlow stages={["Respostas", "PontuaÃ§Ã£o", "PadrÃµes", "Prioridade", "Plano", "Acompanhamento"]} />
            </ScannerPanel>
          </motion.div>
        </section>

        <section className="section alt">
          <div className="container">
            <div className="section-header center">
              <span className="eyebrow">Reconhecimento sem culpa</span>
              <h2>Talvez vocÃª nÃ£o esteja parado por falta de vontade.</h2>
              <p>
                VocÃª pode estar tentando corrigir muitas Ã¡reas ao mesmo tempo, seguindo planos que nÃ£o consideram sua
                rotina e comeÃ§ando sempre pela aÃ§Ã£o errada.
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
              <span className="eyebrow">Quebra de padrÃ£o</span>
              <h2>Mais uma lista de tarefas nÃ£o resolverÃ¡.</h2>
            </div>
            <div className="comparison-grid">
              <ScannerPanel label="MÃ©todo genÃ©rico">
                <h3 style={{ marginTop: 14, fontSize: "1.7rem" }}>Rotina pronta, metas excessivas e cobranÃ§a.</h3>
                <ul className="check-list" style={{ marginTop: 18 }}>
                  {["ComeÃ§a pela agenda", "Aumenta a pressÃ£o", "Ignora o dia real", "Transforma falha em abandono"].map((item) => (
                    <li key={item}>
                      <LockKeyhole size={16} color="#ff6470" /> {item}
                    </li>
                  ))}
                </ul>
              </ScannerPanel>
              <ScannerPanel label="Virada IA">
                <h3 style={{ marginTop: 14, fontSize: "1.7rem" }}>DiagnÃ³stico, prioridade, aÃ§Ã£o mÃ­nima e adaptaÃ§Ã£o.</h3>
                <ul className="check-list" style={{ marginTop: 18 }}>
                  {["ComeÃ§a pelo padrÃ£o", "Reduz fricÃ§Ã£o", "Explica a recomendaÃ§Ã£o", "Planeja a retomada"].map((item) => (
                    <li key={item}>
                      <BadgeCheck size={16} color="#58c7ff" /> {item}
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
                O scroll mostra a transformaÃ§Ã£o de resposta em direÃ§Ã£o.
              </h2>
              <p className="premium-copy">
                O produto nÃ£o empilha cards: ele revela como uma vida confusa vira mapa, prioridade, plano e acompanhamento.
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
              <h2>Clareza, execuÃ§Ã£o, tempo, rotina, dinheiro e energia nÃ£o evoluem isolados.</h2>
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
              <h2>InteligÃªncia artificial com contexto, nÃ£o respostas genÃ©ricas.</h2>
              <p>
                As pontuaÃ§Ãµes sÃ£o calculadas por regras, a IA interpreta padrÃµes, as recomendaÃ§Ãµes usam respostas e
                contradiÃ§Ãµes reduzem a confianÃ§a. O sistema Ã© educacional e nÃ£o realiza diagnÃ³stico mÃ©dico.
              </p>
            </div>
            <DataFlow stages={["Respostas", "PontuaÃ§Ã£o", "PadrÃµes", "Prioridade", "Plano", "Acompanhamento"]} />
          </div>
        </section>

        <section className="section" id="demo">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">DemonstraÃ§Ã£o marcada como exemplo</span>
              <h2>Uma anÃ¡lise realista, explicÃ¡vel e sem promessa milagrosa.</h2>
            </div>
            <div className="dashboard-hero">
              <ScannerPanel label="Exemplo fictÃ­cio">
                <ProgressCore score={43} confidence="mÃ©dia" trend="- ponto inicial" />
                <h3 style={{ marginTop: 18, fontSize: "1.7rem" }}>Falta de direÃ§Ã£o combinada com excesso de distraÃ§Ã£o.</h3>
                <p className="premium-copy">
                  EvidÃªncias: vÃ¡rias metas ao mesmo tempo, cinco a sete horas de tela, abandono apÃ³s falhas e ausÃªncia de
                  planejamento diÃ¡rio.
                </p>
                <div className="notice">
                  Primeira aÃ§Ã£o: escolha uma Ãºnica meta para os prÃ³ximos 30 dias e reserve 15 minutos para iniciar hoje.
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
              <h2>Quatro semanas com missÃ£o diÃ¡ria, check-in e replanejamento.</h2>
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
              <h2>Dashboard de evoluÃ§Ã£o, nÃ£o apenas uma Ã¡rea de resultado.</h2>
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
              <span className="eyebrow">Planos sem urgÃªncia falsa</span>
              <h2>Escolha o nÃ­vel de acompanhamento que combina com seu momento.</h2>
            </div>
            <PricingCards />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">
                <ShieldCheck size={15} /> ConfianÃ§a
              </span>
              <h2>Dados protegidos, anÃ¡lise explicÃ¡vel e limitaÃ§Ãµes claras.</h2>
            </div>
            <div className="cards-grid">
              {[
                [Fingerprint, "Sem venda de dados", "Analytics nÃ£o recebe e-mail, telefone ou respostas completas."],
                [ShieldCheck, "Pagamento seguro", "Acesso completo depende de webhook vÃ¡lido ou consulta segura."],
                [GitBranch, "Plano adaptÃ¡vel", "Replanejamento cria nova versÃ£o, sem apagar histÃ³rico."],
                [LockKeyhole, "Cancelamento simples", "Assinatura e status aparecem na Ã¡rea da conta."],
                [Compass, "RecomendaÃ§Ã£o explicÃ¡vel", "Cada sugestÃ£o mostra motivo, evidÃªncia, impacto e dificuldade."],
                [Sparkles, "IA com limites", "Sem diagnÃ³stico mÃ©dico, prescriÃ§Ã£o ou conselho financeiro especÃ­fico."]
              ].map(([Icon, title, body]) => {
                const TypedIcon = Icon as typeof ShieldCheck;
                return (
                  <article className="info-card" key={String(title)}>
                    <TypedIcon color="#58c7ff" size={24} />
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
              <span className="eyebrow">Primeiro passo possÃ­vel</span>
              <h2>VocÃª jÃ¡ tentou mudar muitas vezes. Agora descubra por onde deveria ter comeÃ§ado.</h2>
              <p>Menos culpa. Mais clareza. Um plano compatÃ­vel com sua realidade.</p>
              <Link className="button" href="/diagnostico">
                Fazer minha anÃ¡lise gratuita <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <span>Â© 2026 Virada IA</span>
          <span>
            <a href="/legal/privacidade">Privacidade</a> Â· <a href="/legal/termos">Termos</a> Â·{" "}
            <a href="/legal/cookies">Cookies</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
