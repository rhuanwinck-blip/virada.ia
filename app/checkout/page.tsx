import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { AutomationFlow, HolographicPanel, StatusPill } from "@/components/AssessorVisuals";
import { onboardingSteps } from "@/lib/assistant-core";

export default function CheckoutPage() {
  return (
    <main className="result-shell command-theme">
      <div className="command-grid" />
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA
        </Link>

        <section className="dashboard-hero" style={{ marginTop: 28 }}>
          <HolographicPanel className="dashboard-card" label="Checkout seguro">
            <span className="eyebrow">
              <LockKeyhole size={16} /> Liberacao protegida
            </span>
            <h1>Ative seu assessor pessoal proativo.</h1>
            <p className="premium-copy">
              O checkout preserva a infraestrutura existente. Em `DEMO_MODE=true`, o retorno aprovado simula liberacao
              para validar onboarding e dashboard sem usar credenciais reais.
            </p>
            <div className="metric-grid">
              <article className="info-card">
                <CreditCard color="#58c7ff" size={24} />
                <h3>Assessor Pessoal</h3>
                <p>R$ 47,00, pagamento unico, central, agenda, tarefas, lembretes e primeiro dia.</p>
              </article>
              <article className="info-card">
                <BadgeCheck color="#9ee8ff" size={24} />
                <h3>Assessor Pro</h3>
                <p>R$ 59,90 por mes, WhatsApp, push, briefings, replanejamento e historico.</p>
              </article>
            </div>
            <form action="/api/checkout" method="post" style={{ marginTop: 22 }}>
              <input type="hidden" name="plan" value="one-time" />
              <input type="hidden" name="email" value="demo@viradaia.local" />
              <button className="button" type="submit">
                Simular pagamento aprovado <ArrowRight size={18} />
              </button>
            </form>
          </HolographicPanel>

          <HolographicPanel label="Depois da compra">
            <StatusPill tone="amber">
              <Sparkles size={14} /> Onboarding do assessor
            </StatusPill>
            <AutomationFlow steps={onboardingSteps.slice(0, 7)} />
            <div className="notice" style={{ marginTop: 18 }}>
              <ShieldCheck size={18} /> Em producao, acesso completo nunca deve depender apenas do retorno do navegador. A
              liberacao precisa de webhook valido ou consulta segura do pagamento.
            </div>
          </HolographicPanel>
        </section>
      </div>
    </main>
  );
}
