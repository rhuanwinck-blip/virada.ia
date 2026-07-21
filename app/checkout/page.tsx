import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, LockKeyhole } from "lucide-react";

export default function CheckoutPage() {
  return (
    <main className="result-shell">
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA
        </Link>
        <section className="panel" style={{ padding: 30, marginTop: 28, maxWidth: 760 }}>
          <span className="eyebrow">
            <LockKeyhole size={16} /> Checkout seguro
          </span>
          <h1 style={{ marginTop: 16, fontSize: "clamp(2.1rem, 5vw, 4.2rem)" }}>
            Pagamento em modo demonstração.
          </h1>
          <p style={{ color: "var(--secondary)", lineHeight: 1.7 }}>
            O fluxo real está preparado para Mercado Pago, assinatura e webhook. Enquanto `DEMO_MODE=true`, a liberação é
            simulada para validar a experiência sem usar credenciais reais.
          </p>
          <div className="cards-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", marginTop: 22 }}>
            <div className="info-card">
              <CreditCard color="#5DFFB4" size={24} />
              <h3 style={{ marginTop: 12 }}>Plano da Virada 30</h3>
              <p>R$ 47,00, pagamento único.</p>
            </div>
            <div className="info-card">
              <BadgeCheck color="#D6B978" size={24} />
              <h3 style={{ marginTop: 12 }}>Virada Pro</h3>
              <p>R$ 59,90 por mês, com cancelamento na conta.</p>
            </div>
          </div>
          <form action="/api/checkout" method="post" style={{ marginTop: 22 }}>
            <input type="hidden" name="plan" value="one-time" />
            <input type="hidden" name="email" value="demo@viradaia.local" />
            <button className="button" type="submit">
              Simular pagamento aprovado <ArrowRight size={18} />
            </button>
          </form>
          <div className="notice" style={{ marginTop: 18 }}>
            Acesso completo nunca deve ser liberado pelo retorno do navegador em produção. A liberação depende de webhook
            válido ou consulta segura do pagamento.
          </div>
        </section>
      </div>
    </main>
  );
}
