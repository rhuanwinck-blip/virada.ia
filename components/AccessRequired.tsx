import Link from "next/link";
import { CreditCard, LogIn, ShieldCheck } from "lucide-react";
import { HolographicPanel, StatusPill } from "@/components/AssessorVisuals";

type AccessRequiredProps = {
  email?: string | null;
  nextPath: string;
  paymentState?: string | null;
  reason?: string;
};

export function AccessRequired({ email, nextPath, paymentState, reason }: AccessRequiredProps) {
  const paymentApproved = paymentState === "approved";

  return (
    <main className="result-shell command-theme">
      <div className="command-grid" />
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA
        </Link>

        <section className="dashboard-hero" style={{ marginTop: 28 }}>
          <HolographicPanel className="dashboard-card" label="Acesso protegido">
            <StatusPill tone={paymentApproved ? "amber" : "cyan"}>
              <ShieldCheck size={14} /> {paymentApproved ? "Pagamento em validacao" : "Login necessario"}
            </StatusPill>
            <h1>{paymentApproved ? "Entre com o mesmo e-mail usado no Mercado Pago." : "Esta area agora precisa de conta."}</h1>
            <p className="premium-copy">
              {paymentApproved
                ? "Assim que o webhook confirmar o pagamento, o acesso aparece aqui automaticamente. Use o mesmo e-mail informado no checkout."
                : "Dashboard, onboarding e dados financeiros ficam fechados por sessao Supabase e acesso ativo."}
            </p>
            {email ? (
              <div className="notice">
                <ShieldCheck size={18} /> Voce esta logado como {email}, mas ainda nao encontramos um acesso ativo para este e-mail.
              </div>
            ) : null}
            {reason === "entitlement_lookup_failed" ? (
              <div className="notice">
                <ShieldCheck size={18} /> Nao conseguimos consultar seu acesso agora. Tente novamente em alguns segundos.
              </div>
            ) : null}
            <div className="inline-actions" style={{ marginTop: 20 }}>
              <Link className="button" href={`/login?next=${encodeURIComponent(nextPath)}`}>
                Entrar ou criar conta <LogIn size={17} />
              </Link>
              <Link className="button secondary" href="/checkout">
                Comprar acesso <CreditCard size={17} />
              </Link>
              {email ? (
                <a className="button ghost" href="/auth/logout">
                  Sair desta conta
                </a>
              ) : null}
            </div>
          </HolographicPanel>

          <HolographicPanel label="Como o acesso funciona">
            <div className="stack-list">
              <div className="stack-item done">
                <strong>1. Pagamento</strong>
                <span>Mercado Pago confirma e envia webhook para o Virada IA.</span>
              </div>
              <div className="stack-item done">
                <strong>2. E-mail</strong>
                <span>O acesso fica vinculado ao e-mail usado no checkout.</span>
              </div>
              <div className="stack-item">
                <strong>3. Login</strong>
                <span>Ao entrar com esse e-mail, o dashboard e o onboarding liberam.</span>
              </div>
            </div>
          </HolographicPanel>
        </section>
      </div>
    </main>
  );
}
