export default function Loading() {
  return (
    <main className="result-shell">
      <div className="grid-background" />
      <div className="container">
        <section className="panel dashboard-card" style={{ marginTop: 32 }}>
          <span className="eyebrow">Carregando</span>
          <h1 style={{ marginTop: 16, fontSize: "clamp(2rem, 5vw, 4rem)" }}>Sincronizando sinais do Virada IA.</h1>
          <div className="premium-skeleton" style={{ marginTop: 20 }}>
            <span>Preparando a experiência</span>
          </div>
        </section>
      </div>
    </main>
  );
}
