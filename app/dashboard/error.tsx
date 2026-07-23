"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="dashboard-shell command-theme" style={{ gridTemplateColumns: "1fr" }}>
      <div className="command-grid" />
      <section className="dashboard-main">
        <div className="panel dashboard-card">
          <span className="eyebrow">Dashboard indisponivel</span>
          <h1 style={{ marginTop: 16, fontSize: "clamp(2rem, 5vw, 4rem)" }}>O assessor nao carregou corretamente.</h1>
          <p className="premium-copy">Nenhum envio externo foi executado. Recarregue a central para continuar.</p>
          <button className="button" type="button" onClick={reset}>
            Recarregar central <RotateCcw size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
