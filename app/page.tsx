import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Fingerprint,
  LockKeyhole,
  ShieldCheck
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { HeroShowcase } from "@/components/HeroShowcase";
import { MobileCta } from "@/components/MobileCta";
import { PricingCards } from "@/components/PricingCards";
import { disclaimer, pillars, showcaseSteps } from "@/lib/questions";
import { faq, painCards } from "@/lib/copy";

export default function Home() {
  return (
    <div className="site-shell">
      <div className="grid-background" />
      <header className="topbar">
        <div className="container topbar-inner">
          <Link className="brand" href="/">
            <span className="brand-mark">V</span> Virada IA
          </Link>
          <nav className="nav" aria-label="Navegação principal">
            <a href="#como-funciona">Como funciona</a>
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
        <section className="container hero">
          <div>
            <span className="eyebrow">Análise personalizada de hábitos e direção</span>
            <h1>Você não precisa mudar tudo. Precisa descobrir o que mudar primeiro.</h1>
            <p>
              Responda algumas perguntas e descubra o que mais está travando seu progresso. Receba uma análise
              personalizada e um plano de 30 dias criado para sua realidade.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/diagnostico">
                Descobrir meu ponto de virada <ArrowRight size={18} />
              </Link>
              <a className="button secondary" href="#como-funciona">
                Ver como funciona
              </a>
            </div>
            <div className="microcopy">
              <span>
                <CheckCircle2 size={15} /> Sem cartão na etapa gratuita
              </span>
              <span>
                <CheckCircle2 size={15} /> Resultado em poucos minutos
              </span>
              <span>
                <CheckCircle2 size={15} /> 100% online
              </span>
            </div>
          </div>
          <HeroShowcase />
        </section>

        <AnimatedSection className="section alt">
          <div className="container">
            <div className="section-header center">
              <span className="eyebrow">Identificação sem culpa</span>
              <h2>Você sente que poderia estar vivendo muito melhor?</h2>
              <p>
                Talvez o problema não seja falta de vontade. Talvez você ainda não tenha identificado qual mudança deve
                acontecer primeiro.
              </p>
            </div>
            <div className="cards-grid">
              {painCards.map(([title, body]) => (
                <article className="info-card" key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section" id="como-funciona">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Como funciona</span>
              <h2>Uma análise feita para o seu momento atual.</h2>
            </div>
            <div className="steps">
              {[
                ["Responda perguntas rápidas", "Conte como está sua rotina, seu tempo, seu dinheiro e suas prioridades."],
                ["Receba seu Índice de Virada", "Veja sua pontuação e qual área parece exercer maior impacto sobre as demais."],
                ["Entenda o padrão", "Descubra quais comportamentos estão mantendo você no mesmo ciclo."],
                ["Comece pela ação certa", "Receba um plano de 30 dias com uma prioridade e ações executáveis."]
              ].map(([title, body], index) => (
                <article className="step" key={title}>
                  <div className="step-num">{String(index + 1).padStart(2, "0")}</div>
                  <h3 style={{ marginTop: 28 }}>{title}</h3>
                  <p style={{ color: "var(--secondary)", lineHeight: 1.6 }}>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <section className="section alt" id="produto">
          <div className="container sticky-showcase">
            <div className="sticky-copy">
              <span className="eyebrow">Demonstração do produto</span>
              <h2 style={{ marginTop: 18, fontSize: "clamp(2rem, 4vw, 3.7rem)" }}>
                Não é mais uma lista de tarefas.
              </h2>
              <p style={{ color: "var(--secondary)", lineHeight: 1.7 }}>
                O Virada IA transforma suas respostas em uma direção clara, um plano executável e um sistema para
                continuar mesmo quando a motivação desaparecer.
              </p>
            </div>
            <div className="mock-stack">
              {showcaseSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <AnimatedSection className="info-card" key={step.title}>
                    <Icon color="#5DFFB4" size={26} />
                    <div className="step-num" style={{ marginTop: 18 }}>
                      {step.kicker}
                    </div>
                    <h3 style={{ marginTop: 10, fontSize: "1.45rem" }}>{step.title}</h3>
                    <p>{step.body}</p>
                  </AnimatedSection>
                );
              })}
              <AnimatedSection className="panel" style={{ padding: 24 }}>
                <div className="bar-list">
                  {["Missão de hoje", "Visão semanal", "Replanejamento", "Painel de progresso"].map((item, index) => (
                    <div className="bar-row" key={item}>
                      <div className="bar-label">
                        <span>{item}</span>
                        <strong style={{ color: "var(--text)" }}>{index === 0 ? "Pronta" : "Demo"}</strong>
                      </div>
                      <div className="pillar-score">
                        <span style={{ width: `${78 - index * 10}%`, background: index % 2 ? "#5C8DFF" : "#5DFFB4" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <AnimatedSection className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Seis pilares</span>
              <h2>Veja quais áreas sustentam seu progresso.</h2>
            </div>
            <div className="pillars">
              {Object.values(pillars).map((pillar, index) => {
                const Icon = pillar.icon;
                const score = [62, 48, 34, 55, 41, 59][index];
                return (
                  <article className="info-card" key={pillar.name}>
                    <Icon color={pillar.color} size={26} />
                    <h3 style={{ marginTop: 14 }}>{pillar.name}</h3>
                    <p>{pillar.description}</p>
                    <div className="pillar-score">
                      <span style={{ width: `${score}%`, background: pillar.color }} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section alt">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Entrega</span>
              <h2>Um plano criado para sua realidade.</h2>
              <p>
                Você não receberá uma rotina perfeita feita para alguém que acorda às 5h, medita, lê 40 páginas e
                prepara três refeições antes do café. O plano será ajustado ao tempo, às dificuldades e aos comportamentos
                informados.
              </p>
            </div>
            <div className="cards-grid">
              {[
                "Prioridade dos próximos 30 dias",
                "Plano diário e visão semanal",
                "Rotina matinal e noturna",
                "Plano de redução de distrações",
                "Organização financeira básica",
                "Estratégia para retomar após falhas"
              ].map((item) => (
                <article className="info-card" key={item}>
                  <BadgeCheck color="#5DFFB4" size={22} />
                  <h3 style={{ marginTop: 12 }}>{item}</h3>
                </article>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Resultado gratuito</span>
              <h2>Veja uma prévia antes de desbloquear o plano completo.</h2>
            </div>
            <div className="result-grid">
              <div className="panel score-hero">
                <div className="score-dial" style={{ "--score": 43 } as React.CSSProperties}>
                  <div className="score-dial-inner">
                    <div>
                      <div className="score-number">43</div>
                      <div style={{ color: "var(--muted)", textAlign: "center" }}>/100</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.7rem" }}>Falta de direção combinada com excesso de distração.</h3>
                  <p style={{ color: "var(--secondary)", lineHeight: 1.65 }}>
                    Você informou que deseja melhorar várias áreas ao mesmo tempo, mas não possui uma prioridade definida.
                    Criar uma rotina complexa agora provavelmente aumentaria sua chance de desistir.
                  </p>
                  <div className="notice">Ação gratuita: escolha uma única meta de 30 dias e reserve 15 minutos hoje.</div>
                </div>
              </div>
              <div className="panel" style={{ padding: 24 }}>
                <h3>Relatório completo</h3>
                <ul className="check-list" style={{ marginTop: 14 }}>
                  {["Evidências das respostas", "Três bloqueios principais", "Plano de 30 dias", "PDF e dashboard"].map(
                    (item) => (
                      <li key={item}>
                        <LockKeyhole size={16} color="#D6B978" /> {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="section alt" id="planos">
          <div className="container">
            <div className="section-header center">
              <span className="eyebrow">Oferta</span>
              <h2>Menos promessas. Mais direção.</h2>
            </div>
            <PricingCards />
          </div>
        </AnimatedSection>

        <AnimatedSection className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Segurança e confiança</span>
              <h2>Sem pressão artificial. Sem exposição pública. Sem venda de dados.</h2>
            </div>
            <div className="cards-grid">
              {[
                [ShieldCheck, "Pagamento seguro", "Liberação somente após webhook válido ou consulta segura."],
                [Fingerprint, "Informações protegidas", "Eventos de analytics não carregam e-mail, telefone ou respostas completas."],
                [LockKeyhole, "Controle do Pro", "Cancelamento dentro da conta e histórico de consentimentos."]
              ].map(([Icon, title, body]) => {
                const TypedIcon = Icon as typeof ShieldCheck;
                return (
                  <article className="info-card" key={String(title)}>
                    <TypedIcon color="#5DFFB4" size={24} />
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
        </AnimatedSection>

        <AnimatedSection className="section alt" id="faq">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">FAQ</span>
              <h2>Perguntas frequentes</h2>
            </div>
            <div className="faq-grid">
              {faq.map((item) => (
                <div className="faq-item" key={item.question}>
                  <strong>{item.question}</strong>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <section className="section">
          <div className="container">
            <div className="section-header center">
              <span className="eyebrow">Primeiro passo possível</span>
              <h2>Você não precisa de mais uma segunda-feira.</h2>
              <p>Precisa de uma direção clara, uma prioridade e uma ação pequena que possa começar hoje.</p>
              <Link className="button" href="/diagnostico">
                Descobrir meu ponto de virada <ArrowRight size={18} />
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
      <MobileCta />
    </div>
  );
}
