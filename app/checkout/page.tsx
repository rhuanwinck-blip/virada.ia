import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { ScannerPanel, StatusPill } from "@/components/PremiumVisuals";

export default function CheckoutPage() {
  return (
    <main className="result-shell">
      <div className="grid-background" />
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA
        </Link>

        <section className="dashboard-hero" style={{ marginTop: 28 }}>
          <ScannerPanel className="dashboard-card" label="Checkout seguro">
            <span className="eyebrow">
              <LockKeyhole size={16} /> Liberação protegida
            </span>
            <h1 style={{ marginTop: 18, fontSize: "clamp(2.2rem, 6vw, 5rem)" }}>
              Seu Plano da Virada fica disponível após confirmação segura.
            </h1>
            <p className="premium-copy">
              O fluxo real está preparado para Mercado Pago, assinatura e webhook. Enquanto `DEMO_MODE=true`, a
              liberação é simulada para validar a experiência sem usar credenciais reais.
            </p>
            <div className="metric-grid">
              <article className="info-card">
                <CreditCard color="#5cffb0" size={24} />
                <h3 style={{ marginTop: 12 }}>Plano da Virada 30</h3>
                <p>R$ 47,00, pagamento único, relatório e plano de 30 dias.</p>
              </article>
              <article className="info-card">
                <BadgeCheck color="#d4ba74" size={24} />
                <h3 style={{ marginTop: 12 }}>Virada Pro</h3>
                <p>R$ 59,90 por mês, check-ins, adaptação e histórico.</p>
              </article>
            </div>
            <form action="/api/checkout" method="post" style={{ marginTop: 22 }}>
              <input type="hidden" name="plan" value="one-time" />
              <input type="hidden" name="email" value="demo@viradaia.local" />
              <button className="button premium-button" type="submit">
                Simular pagamento aprovado <ArrowRight size={18} />
              </button>
            </form>
          </ScannerPanel>

          <ScannerPanel label="O que será desbloqueado">
            <StatusPill tone="gold">
              <Sparkles size={14} /> Alto valor percebido
            </StatusPill>
            <ul className="check-list" style={{ marginTop: 18 }}>
              {[
                "Diagnóstico completo com evidências",
                "Plano personalizado de 30 dias",
                "Missão de hoje e versões mínimas",
                "Assistente IA com contexto",
                "Relatórios e PDF",
                "Check-ins e replanejamento"
              ].map((item) => (
                <li key={item}>
                  <BadgeCheck size={16} color="#5cffb0" /> {item}
                </li>
              ))}
            </ul>
            <div className="notice" style={{ marginTop: 18 }}>
              <ShieldCheck size={18} /> Acesso completo nunca deve ser liberado apenas pelo retorno do navegador em
              produção. A liberação depende de webhook válido ou consulta segura do pagamento.
            </div>
          </ScannerPanel>
        </section>
      </div>
    </main>
  );
}
