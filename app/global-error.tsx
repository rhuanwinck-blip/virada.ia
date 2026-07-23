"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <main className="result-shell command-theme">
          <div className="command-grid" />
          <div className="container">
            <section className="panel dashboard-card" style={{ marginTop: 32 }}>
              <span className="eyebrow">Erro critico</span>
              <h1 style={{ marginTop: 16, fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                O Virada IA nao conseguiu iniciar esta tela.
              </h1>
              <p className="premium-copy">
                O erro foi registrado para investigacao. Nenhuma acao externa foi enviada durante a falha.
              </p>
              <button className="button" type="button" onClick={reset}>
                Tentar novamente <RotateCcw size={18} />
              </button>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}
