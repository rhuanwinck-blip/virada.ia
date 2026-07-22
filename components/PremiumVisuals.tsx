"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Check,
  Command,
  Loader2,
  Search,
  Sparkles,
  X
} from "lucide-react";
import { DailyMission, DiagnosticResult, PillarScore } from "@/lib/scoring";
import { dashboardNavigation, motionTokens } from "@/lib/product-experience";

export function ProgressCore({
  score,
  label = "Índice de Virada",
  confidence,
  trend = "+8"
}: {
  score: number;
  label?: string;
  confidence?: string;
  trend?: string;
}) {
  const reduced = useReducedMotion();
  const value = useMotionValue(reduced ? score : 0);
  const spring = useSpring(value, motionTokens.softSpring);
  const display = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    value.set(score);
  }, [score, value]);

  return (
    <div className="progress-core" style={{ "--score": score } as React.CSSProperties}>
      <div className="progress-core__ring">
        <motion.strong>{display}</motion.strong>
        <span>/100</span>
      </div>
      <div className="progress-core__meta">
        <span>{label}</span>
        <b>{trend} desde o início</b>
        {confidence ? <small>Confiança {confidence}</small> : null}
      </div>
    </div>
  );
}

export function PillarRadar({ scores, compact = false }: { scores: PillarScore[]; compact?: boolean }) {
  const center = 120;
  const radius = compact ? 64 : 86;
  const points = scores.map((pillar, index) => {
    const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
    const distance = (pillar.score / 100) * radius;
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
      labelX: center + Math.cos(angle) * (radius + 22),
      labelY: center + Math.sin(angle) * (radius + 22),
      pillar
    };
  });
  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");
  const rings = [0.34, 0.67, 1];

  return (
    <div className={compact ? "radar-card compact" : "radar-card"}>
      <svg viewBox="0 0 240 240" role="img" aria-label="Radar dos seis pilares">
        {rings.map((ratio) => (
          <polygon
            key={ratio}
            points={scores
              .map((_, index) => {
                const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
                return `${center + Math.cos(angle) * radius * ratio},${center + Math.sin(angle) * radius * ratio}`;
              })
              .join(" ")}
            className="radar-ring"
          />
        ))}
        {scores.map((_, index) => {
          const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={center + Math.cos(angle) * radius}
              y2={center + Math.sin(angle) * radius}
              className="radar-axis"
            />
          );
        })}
        <motion.polygon
          points={polygon}
          className="radar-area"
          initial={{ opacity: 1, scale: 0.86 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          style={{ transformOrigin: "center" }}
        />
        {points.map((point) => (
          <g key={point.pillar.key}>
            <circle cx={point.x} cy={point.y} r="4.5" fill={point.pillar.color} />
            {!compact ? (
              <text x={point.labelX} y={point.labelY} className="radar-label" textAnchor="middle">
                {point.pillar.name.split(" ")[0]}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function ScannerPanel({
  children,
  className = "",
  label = "Análise em andamento",
  style
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`scanner-panel ${className}`}
      style={style}
      initial={{ opacity: 1, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
    >
      <div className="scanner-panel__label">
        <span />
        {label}
      </div>
      {!reduced ? <motion.i aria-hidden animate={{ y: ["-18%", "118%"] }} transition={{ duration: 4.6, repeat: Infinity, ease: "linear" }} /> : null}
      {children}
    </motion.div>
  );
}

export function FloatingMetric({
  label,
  value,
  detail,
  tone = "green",
  delay = 0
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "green" | "blue" | "gold" | "violet" | "cyan";
  delay?: number;
}) {
  return (
    <motion.article
      className={`floating-metric ${tone}`}
      initial={{ opacity: 1, y: 12, rotateX: 4 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -4 }}
    >
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </motion.article>
  );
}

export function DataFlow({ stages }: { stages: string[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="data-flow" aria-label="Fluxo de inteligência">
      {stages.map((stage, index) => (
        <div className="data-flow__item" key={stage}>
          <motion.div
            className="data-flow__node"
            initial={{ scale: 0.9, opacity: 1 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.div>
          <span>{stage}</span>
          {index < stages.length - 1 ? (
            <motion.i
              aria-hidden
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: reduced ? 0 : 0.55, delay: index * 0.07 + 0.18 }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function ConnectedNodes({ items }: { items: { title: string; detail: string; tone?: string }[] }) {
  return (
    <div className="connected-nodes">
      {items.map((item, index) => (
        <motion.article
          className="node-card"
          key={item.title}
          initial={{ opacity: 1, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: index * 0.06 }}
        >
          <span className={`node-dot ${item.tone || "green"}`} />
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
        </motion.article>
      ))}
    </div>
  );
}

export function PlanTimeline({ missions }: { missions: DailyMission[] }) {
  const preview = missions.slice(0, 8);

  return (
    <div className="plan-timeline">
      {preview.map((mission, index) => (
        <motion.article
          className="timeline-day"
          key={mission.day}
          initial={{ opacity: 1, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42, delay: index * 0.05 }}
        >
          <span>Dia {mission.day}</span>
          <strong>{mission.title}</strong>
          <small>{mission.minutes} min</small>
        </motion.article>
      ))}
    </div>
  );
}

export function HabitHeatmap({ completed }: { completed: number[] }) {
  return (
    <div className="habit-heatmap" aria-label="Mapa de hábitos dos últimos 35 dias">
      {Array.from({ length: 35 }, (_, index) => {
        const day = index + 1;
        const intensity = completed.includes(day) ? 3 : day % 7 === 0 ? 2 : day % 5 === 0 ? 1 : 0;
        return <span className={`heat-${intensity}`} key={day} title={`Dia ${day}`} />;
      })}
    </div>
  );
}

export function UnlockExperience({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="unlock-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section
            className="unlock-card"
            initial={{ scale: 0.94, y: 22, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ type: "spring", ...motionTokens.spring }}
          >
            <div className="unlock-check" aria-hidden>
              <motion.svg viewBox="0 0 64 64">
                <motion.circle cx="32" cy="32" r="26" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.55 }} />
                <motion.path d="M20 33.5 28.2 41 45 23" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.48, delay: 0.28 }} />
              </motion.svg>
            </div>
            <span className="eyebrow premium-eyebrow">
              <Sparkles size={15} /> Pagamento aprovado
            </span>
            <h2>Seu plano foi liberado.</h2>
            <p>
              O diagnóstico completo, o plano de 30 dias, o assistente IA, os relatórios e as missões de evolução já
              estão disponíveis.
            </p>
            <div className="unlock-grid">
              {["Diagnóstico completo", "Plano de 30 dias", "Missões guiadas", "Guia Virada", "PDF e relatórios", "Check-ins"].map((item) => (
                <span key={item}>
                  <Check size={15} /> {item}
                </span>
              ))}
            </div>
            <button className="button premium-button" type="button" onClick={onClose}>
              Conhecer meu plano <ArrowRight size={18} />
            </button>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function CommandPalette({
  open,
  onClose,
  onSelect
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const commands = useMemo(
    () =>
      dashboardNavigation.filter((item) =>
        `${item.label} ${item.group} ${item.description}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="command-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="command-palette" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
            <div className="command-search">
              <Search size={18} />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar ação, página ou insight" />
              <button type="button" onClick={onClose} aria-label="Fechar command palette">
                <X size={18} />
              </button>
            </div>
            <div className="command-list">
              {commands.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                >
                  <Command size={16} />
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function AICompanionPreview({ result }: { result: DiagnosticResult }) {
  return (
    <ScannerPanel className="ai-preview" label="Guia Virada">
      <div className="ai-avatar">
        <Sparkles size={20} />
      </div>
      <h3>Por que esta é sua prioridade?</h3>
      <p>
        Seu menor pilar agora é {result.mainBlocker.name.toLowerCase()}. Em vez de aumentar cobrança, vou reduzir o
        plano para uma ação de até 15 minutos e proteger continuidade.
      </p>
      <div className="ai-suggestions">
        {["Reduza minha missão", "Organize minha semana", "Como retomar?"].map((item) => (
          <button key={item} type="button">
            {item}
          </button>
        ))}
      </div>
    </ScannerPanel>
  );
}

export function PremiumSkeleton() {
  return (
    <div className="premium-skeleton" aria-label="Carregando">
      <Loader2 size={22} />
      <span>Sincronizando sinais do seu plano</span>
    </div>
  );
}

export function StatusPill({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "blue" | "gold" | "red" }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}
