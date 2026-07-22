"use client";

import { RotateCcw } from "lucide-react";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <main className="dashboard-shell" style={{ gridTemplateColumns: "1fr" }}>
      <section className="dashboard-main">
        <div className="panel dashboard-card">
          <span className="eyebrow">Dashboard indisponível</span>
          <h1 style={{ marginTop: 16, fontSize: "clamp(2rem, 5vw, 4rem)" }}>O plano não carregou corretamente.</h1>
          <p className="premium-copy">O estado local foi preservado. Recarregue apenas esta área para continuar.</p>
          <button className="button" type="button" onClick={reset}>
            Recarregar dashboard <RotateCcw size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
