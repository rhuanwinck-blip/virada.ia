export default function DashboardLoading() {
  return (
    <main className="dashboard-shell" style={{ gridTemplateColumns: "1fr" }}>
      <section className="dashboard-main">
        <div className="panel dashboard-card">
          <span className="eyebrow">Dashboard</span>
          <h1 style={{ marginTop: 16, fontSize: "clamp(2rem, 5vw, 4rem)" }}>Organizando seu plano.</h1>
          <div className="premium-skeleton" style={{ marginTop: 20 }}>
            <span>Carregando missão, pilares e recomendações</span>
          </div>
        </div>
      </section>
    </main>
  );
}
