import { LoadingSync } from "@/components/AssessorVisuals";

export default function DashboardLoading() {
  return (
    <main className="dashboard-shell command-theme" style={{ gridTemplateColumns: "1fr" }}>
      <div className="command-grid" />
      <section className="dashboard-main">
        <div className="panel dashboard-card">
          <span className="eyebrow">Dashboard</span>
          <h1 style={{ marginTop: 16, fontSize: "clamp(2rem, 5vw, 4rem)" }}>Organizando agenda, tarefas e memoria.</h1>
          <LoadingSync />
        </div>
      </section>
    </main>
  );
}
