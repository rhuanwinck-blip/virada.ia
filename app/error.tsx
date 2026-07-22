"use client";

import { RotateCcw } from "lucide-react";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="result-shell">
      <div className="grid-background" />
      <div className="container">
        <section className="panel dashboard-card" style={{ marginTop: 32 }}>
          <span className="eyebrow">Erro controlado</span>
          <h1 style={{ marginTop: 16, fontSize: "clamp(2rem, 5vw, 4rem)" }}>Não conseguimos carregar esta área agora.</h1>
          <p className="premium-copy">Suas respostas e progresso local permanecem preservados. Tente novamente em alguns segundos.</p>
          <button className="button" type="button" onClick={reset}>
            Tentar novamente <RotateCcw size={18} />
          </button>
        </section>
      </div>
    </main>
  );
}
