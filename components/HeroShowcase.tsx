"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Activity, CalendarCheck2, CircleGauge, Sparkles } from "lucide-react";

const bars = [
  ["Clareza", 42, "#5DFFB4"],
  ["Execução", 38, "#5C8DFF"],
  ["Tempo", 31, "#9C6BFF"],
  ["Rotina", 47, "#D6B978"],
  ["Dinheiro", 40, "#16C784"],
  ["Energia", 45, "#FF7068"]
] as const;

export function HeroShowcase() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="hero-visual panel"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      style={{ padding: 22, position: "relative", overflow: "hidden" }}
    >
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent, rgba(93,255,180,0.12), transparent)",
          width: "42%",
          transform: "skewX(-12deg)"
        }}
        animate={reduced ? undefined : { x: ["-80%", "240%"] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
      />
      <div style={{ position: "relative", display: "grid", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div className="eyebrow">
              <Sparkles size={15} /> Análise em andamento
            </div>
            <h3 style={{ marginTop: 14, fontSize: "1.35rem" }}>Painel de Virada</h3>
          </div>
          <div className="score-dial" style={{ "--score": 43, width: 112 } as React.CSSProperties}>
            <div className="score-dial-inner">
              <strong style={{ fontFamily: "var(--font-sora)", fontSize: 30 }}>43</strong>
            </div>
          </div>
        </div>

        <div className="bar-list">
          {bars.map(([label, value, color], index) => (
            <motion.div
              className="bar-row"
              key={label}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="bar-label">
                <span>{label}</span>
                <span>{value}/100</span>
              </div>
              <div className="pillar-score">
                <motion.span
                  style={{ background: color }}
                  initial={{ width: "10%" }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: reduced ? 0 : 1.1, delay: index * 0.08 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12
          }}
        >
          <div className="info-card">
            <CircleGauge color="#5DFFB4" size={22} />
            <h3 style={{ marginTop: 12 }}>Bloqueio principal</h3>
            <p>Falta de direção combinada com excesso de distração.</p>
          </div>
          <div className="info-card">
            <CalendarCheck2 color="#D6B978" size={22} />
            <h3 style={{ marginTop: 12 }}>Missão de hoje</h3>
            <p>15 minutos para escolher uma única meta dos próximos 30 dias.</p>
          </div>
        </div>

        <div className="notice" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Activity size={18} /> Plano ajustado para dias reais, não para uma rotina perfeita.
        </div>
      </div>
    </motion.div>
  );
}
