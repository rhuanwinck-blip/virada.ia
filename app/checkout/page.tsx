import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { AutomationFlow, HolographicPanel, StatusPill } from "@/components/AssessorVisuals";
import { onboardingSteps } from "@/lib/assistant-core";

type CheckoutPageProps = {
  searchParams?: Promise<{ plan?: string; payment?: string }>;
};

const checkoutPlans = {
  "one-time": {
    name: "Assessor Pessoal",
    price: "R$ 47,00",
    description: "Pagamento unico, central, agenda, tarefas, lembretes e primeiro dia."
  },
  pro: {
    name: "Assessor Pro",
    price: "R$ 59,90",
    description: "Primeiro mes com WhatsApp, push, briefings, replanejamento e historico."
  }
} as const;

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const selectedPlan = params?.plan === "pro" ? "pro" : "one-time";
  const plan = checkoutPlans[selectedPlan];
  const paymentState = params?.payment;

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
              Pagamento processado pelo Mercado Pago com retorno seguro para liberar o onboarding e manter o historico
              da sua jornada.
            </p>
            {paymentState === "error" ? (
              <div className="notice" style={{ marginBottom: 18 }}>
                <ShieldCheck size={18} /> Nao conseguimos iniciar o pagamento agora. Confira o e-mail e tente novamente.
              </div>
            ) : null}
            <div className="metric-grid">
              <article className="info-card">
                <CreditCard color="#58c7ff" size={24} />
                <h3>{checkoutPlans["one-time"].name}</h3>
                <p>
                  {checkoutPlans["one-time"].price}, {checkoutPlans["one-time"].description}
                </p>
              </article>
              <article className="info-card">
                <BadgeCheck color="#9ee8ff" size={24} />
                <h3>{checkoutPlans.pro.name}</h3>
                <p>
                  {checkoutPlans.pro.price}, {checkoutPlans.pro.description}
                </p>
              </article>
            </div>
            <form action="/api/checkout" className="contact-form" method="post" style={{ marginTop: 22 }}>
              <input type="hidden" name="plan" value={selectedPlan} />
              <label className="field">
                <span>E-mail para receber acesso</span>
                <input autoComplete="email" name="email" placeholder="voce@email.com" required type="email" />
              </label>
              <button className="button" type="submit">
                Pagar {plan.price} no Mercado Pago <ArrowRight size={18} />
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
