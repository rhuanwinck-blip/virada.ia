import { LoadingSync } from "@/components/AssessorVisuals";

export default function Loading() {
  return (
    <main className="result-shell command-theme">
      <div className="command-grid" />
      <div className="container">
        <section className="panel dashboard-card" style={{ marginTop: 32 }}>
          <span className="eyebrow">Carregando</span>
          <h1 style={{ marginTop: 16, fontSize: "clamp(2rem, 5vw, 4rem)" }}>Sincronizando seu assessor pessoal.</h1>
          <LoadingSync />
        </section>
      </div>
    </main>
  );
}
