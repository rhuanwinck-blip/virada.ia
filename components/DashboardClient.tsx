"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { demoAnswers } from "@/lib/questions";
import { loadAnswers, loadProgress, toggleProgress } from "@/lib/local-store";
import { scoreDiagnostic } from "@/lib/scoring";

export function DashboardClient() {
  const [done, setDone] = useState<number[]>([]);
  const result = scoreDiagnostic(typeof window === "undefined" ? demoAnswers : loadAnswers() ?? demoAnswers);

  useEffect(() => setDone(loadProgress()), []);

  return (
    <main className="dashboard-shell">
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA
        </Link>
        <div className="dashboard-grid" style={{ marginTop: 28 }}>
          <section className="panel" style={{ padding: 26 }}>
            <span className="eyebrow">
              <CalendarDays size={16} /> Plano de 30 dias
            </span>
            <h1 style={{ marginTop: 16, fontSize: "clamp(2rem, 5vw, 4rem)" }}>
              Uma ação por dia para fortalecer {result.mainBlocker.name.toLowerCase()}.
            </h1>
            <div className="day-grid" style={{ marginTop: 26 }}>
              {result.thirtyDayPlan.map((mission) => (
                <button
                  className={`day-cell ${done.includes(mission.day) ? "done" : ""}`}
                  key={mission.day}
                  onClick={() => setDone(toggleProgress(mission.day))}
                  type="button"
                >
                  <strong style={{ color: "var(--text)" }}>Dia {mission.day}</strong>
                  <br />
                  {mission.title}
                  <br />
                  <span style={{ color: "var(--muted)" }}>{mission.minutes} min</span>
                </button>
              ))}
            </div>
          </section>

          <aside className="panel" style={{ padding: 24 }}>
            <h2 style={{ fontSize: "1.35rem" }}>Evolução</h2>
            <p style={{ color: "var(--secondary)", lineHeight: 1.65 }}>
              {done.length} de 30 missões concluídas. O sistema valoriza retomada, não perfeição.
            </p>
            <div className="progress-track" style={{ margin: "18px 0" }}>
              <span style={{ width: `${Math.round((done.length / 30) * 100)}%` }} />
            </div>
            <div className="notice">
              <CheckCircle2 size={17} /> Check-in semanal demo: reduza, reorganize e retome caso tenha falhado.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
