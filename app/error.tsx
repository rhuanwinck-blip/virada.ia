"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="result-shell command-theme">
      <div className="command-grid" />
      <div className="container">
        <section className="panel dashboard-card" style={{ marginTop: 32 }}>
          <span className="eyebrow">Erro controlado</span>
          <h1 style={{ marginTop: 16, fontSize: "clamp(2rem, 5vw, 4rem)" }}>Nao conseguimos carregar esta area agora.</h1>
          <p className="premium-copy">Seu assessor nao cria, envia nem altera acoes externas quando uma tela falha. Tente novamente.</p>
          <button className="button" type="button" onClick={reset}>
            Tentar novamente <RotateCcw size={18} />
          </button>
        </section>
      </div>
    </main>
  );
}
