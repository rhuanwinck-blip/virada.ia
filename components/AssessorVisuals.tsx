"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, CalendarClock, Check, Command, Loader2, Mic, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  AssistantDraftAction,
  AssistantEvent,
  AssistantNavigationItem,
  AssistantTask,
  assistantNavigation
} from "@/lib/assistant-core";
import { personalOsOnboardingSteps } from "@/lib/personal-os";
import type { AiAgent, PersonalOsArea } from "@/lib/personal-os";

export function HolographicPanel({
  children,
  className = "",
  label = "Sistema ativo",
  compact = false
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
  compact?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className={`holo-panel ${compact ? "compact" : ""} ${className}`}
      initial={{ opacity: 1, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.48 }}
    >
      <div className="holo-panel__label">
        <span />
        {label}
      </div>
      {!reduced ? (
        <>
          <motion.i
            aria-hidden
            className="holo-scan"
            animate={{ y: ["-20%", "124%"] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
          />
          <motion.b
            aria-hidden
            className="holo-pulse"
            animate={{ opacity: [0.25, 0.65, 0.25], scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 5.4, repeat: Infinity }}
          />
        </>
      ) : null}
      <div className="holo-panel__content">{children}</div>
    </motion.section>
  );
}

export function StatusPill({
  children,
  tone = "cyan"
}: {
  children: React.ReactNode;
  tone?: "cyan" | "blue" | "amber" | "red" | "white";
}) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

export function MetricTile({
  label,
  value,
  detail,
  tone = "cyan"
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "cyan" | "blue" | "amber" | "red";
}) {
  return (
    <motion.article className={`metric-tile ${tone}`} whileHover={{ y: -3 }} transition={{ duration: 0.16 }}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </motion.article>
  );
}

export function AssessorCore({ score, label = "Dia organizado" }: { score: number; label?: string }) {
  const reduced = useReducedMotion();
  const value = useMotionValue(reduced ? score : 0);
  const spring = useSpring(value, { stiffness: 88, damping: 20, mass: 0.9 });
  const display = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    value.set(score);
  }, [score, value]);

  return (
    <div className="assessor-core" style={{ "--score": score } as React.CSSProperties}>
      <div className="assessor-core__rings" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="assessor-core__value">
        <motion.strong>{display}</motion.strong>
        <small>%</small>
      </div>
      <p>{label}</p>
    </div>
  );
}

export function AudioWave({ active = false }: { active?: boolean }) {
  return (
    <div className={`audio-wave ${active ? "active" : ""}`} aria-label={active ? "Audio em captura demo" : "Audio pronto"}>
      {Array.from({ length: 18 }, (_, index) => (
        <span key={index} style={{ "--wave-index": index } as React.CSSProperties} />
      ))}
    </div>
  );
}

export function TimelineMap({ events, tasks }: { events: AssistantEvent[]; tasks: AssistantTask[] }) {
  const rows = [
    ...events.map((event) => ({
      id: event.id,
      time: event.start,
      title: event.title,
      meta: `${event.end}${event.location ? ` · ${event.location}` : ""}`,
      type: "Compromisso"
    })),
    ...tasks
      .filter((task) => task.time)
      .map((task) => ({
        id: task.id,
        time: task.time ?? "--:--",
        title: task.title,
        meta: `${task.durationMinutes} min · prioridade ${task.priority}`,
        type: "Tarefa"
      }))
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="timeline-map">
      {rows.map((row, index) => (
        <motion.article
          className={`timeline-map__row ${row.type === "Tarefa" ? "task" : ""}`}
          key={row.id}
          initial={{ opacity: 1, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.34, delay: index * 0.04 }}
        >
          <time>{row.time}</time>
          <span className="timeline-dot" />
          <div>
            <StatusPill tone={row.type === "Tarefa" ? "blue" : "cyan"}>{row.type}</StatusPill>
            <h3>{row.title}</h3>
            <p>{row.meta}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export function PhoneCommandPreview() {
  const messages = [
    ["Voce", "Amanha as 14h tenho dentista."],
    ["Assessor", "Criei um compromisso para amanha as 14h. Quer adicionar deslocamento de 25 min?"],
    ["Voce", "Me lembra de ligar para o Joao sexta."],
    ["Assessor", "Lembrete preparado para sexta. Posso marcar como follow-up se depender da resposta dele."]
  ];

  return (
    <div className="phone-preview" aria-label="Demonstração de conversa com assessor">
      <div className="phone-preview__chrome">
        <span />
        <strong>Virada IA</strong>
        <CalendarClock size={16} />
      </div>
      <div className="phone-preview__screen">
        {messages.map(([role, text], index) => (
          <motion.div
            className={`phone-bubble ${role === "Voce" ? "user" : "assistant"}`}
            key={`${role}-${text}`}
            initial={{ opacity: 1, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: index * 0.18 }}
          >
            <small>{role}</small>
            {text}
          </motion.div>
        ))}
      </div>
      <div className="phone-preview__input">
        <Mic size={17} />
        <AudioWave active />
      </div>
    </div>
  );
}

export function AutomationFlow({ steps }: { steps: string[] }) {
  return (
    <div className="automation-flow">
      {steps.map((step, index) => (
        <div className="automation-flow__step" key={step}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{step}</strong>
          {index < steps.length - 1 ? <i aria-hidden /> : null}
        </div>
      ))}
    </div>
  );
}

export function DraftActionCard({
  draft,
  onConfirm,
  onDiscard
}: {
  draft?: AssistantDraftAction;
  onConfirm?: () => void;
  onDiscard?: () => void;
}) {
  if (!draft) {
    return (
      <div className="empty-state">
        <Sparkles size={20} />
        <h3>Nenhuma acao pendente.</h3>
        <p>Escreva ou grave algo para o assessor classificar antes de criar na sua agenda.</p>
      </div>
    );
  }

  return (
    <article className="draft-card">
      <div className="module-title">
        <div>
          <StatusPill tone={draft.confidence >= 75 ? "cyan" : "amber"}>{draft.type.replace("_", " ")}</StatusPill>
          <h3>{draft.title}</h3>
          <p>{draft.summary}</p>
        </div>
        <strong>{draft.confidence}%</strong>
      </div>
      {draft.missing.length ? <p className="draft-warning">{draft.followUpQuestion}</p> : null}
      <div className="inline-actions">
        <button className="button" type="button" onClick={onConfirm}>
          Confirmar <Check size={17} />
        </button>
        <button className="button ghost" type="button" onClick={onDiscard}>
          Descartar
        </button>
      </div>
    </article>
  );
}

export function AssessorCommandPalette({
  open,
  onClose,
  onSelect
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (id: AssistantNavigationItem["id"]) => void;
}) {
  const [query, setQuery] = useState("");
  const commands = useMemo(
    () =>
      assistantNavigation.filter((item) =>
        `${item.label} ${item.description} ${item.group}`.toLowerCase().includes(query.toLowerCase())
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
          <motion.div className="command-palette" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
            <div className="command-search">
              <Search size={18} />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar area, tarefa ou comando" />
              <button type="button" onClick={onClose} aria-label="Fechar busca">
                <X size={18} />
              </button>
            </div>
            <div className="command-list">
              {commands.map((item) => (
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

export function ActivationOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="unlock-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section
            className="activation-card"
            initial={{ scale: 0.95, y: 22, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 22 }}
          >
            <AssessorCore score={100} label="Assessor ativado" />
            <span className="eyebrow">
              <ShieldCheck size={15} /> Pagamento confirmado
            </span>
            <h2>Seu assessor pessoal esta pronto para configurar o primeiro dia.</h2>
            <div className="activation-steps">
              {personalOsOnboardingSteps.slice(0, 6).map((step) => (
                <span key={step}>
                  <Check size={14} /> {step}
                </span>
              ))}
            </div>
            <button className="button" type="button" onClick={onClose}>
              Abrir central <ArrowRight size={17} />
            </button>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function LoadingSync() {
  return (
    <div className="premium-skeleton" aria-label="Carregando">
      <Loader2 size={22} />
      <span>Sincronizando agenda, tarefas e memoria</span>
    </div>
  );
}

export function ConnectedAreaMap({ areas }: { areas: PersonalOsArea[] }) {
  return (
    <div className="connected-area-map" aria-label="Mapa de areas conectadas">
      <motion.div
        className="connected-area-map__core"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4.8, repeat: Infinity }}
      >
        IA
      </motion.div>
      {areas.map((area, index) => (
        <motion.div
          className={`connected-area-map__node node-${index + 1}`}
          key={area.id}
          initial={{ opacity: 1, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: index * 0.06 }}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{area.label}</strong>
          <small>{area.description}</small>
        </motion.div>
      ))}
    </div>
  );
}

export function OpenFinanceFlow({ activeStep = 3 }: { activeStep?: number }) {
  const steps = [
    "Token backend",
    "Widget oficial",
    "Consentimento",
    "Validação backend",
    "Sincronização",
    "Agente financeiro"
  ];

  return (
    <div className="open-finance-flow" aria-label="Fluxo Open Finance">
      {steps.map((step, index) => (
        <motion.div
          className={`open-finance-flow__step ${index <= activeStep ? "active" : ""}`}
          key={step}
          animate={index === activeStep ? { y: [0, -4, 0] } : undefined}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{step}</strong>
          <small>{index <= activeStep ? "verificado" : "aguardando"}</small>
        </motion.div>
      ))}
    </div>
  );
}

export function FinanceSignalGraph({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => {
    const x = 16 + index * (268 / Math.max(values.length - 1, 1));
    const y = 150 - (value / max) * 112;
    return `${x},${y}`;
  });

  return (
    <div className="finance-signal-graph" aria-label="Grafico financeiro animado">
      <svg viewBox="0 0 304 168" role="img">
        <defs>
          <linearGradient id="financeLine" x1="0" x2="1">
            <stop stopColor="#27DBFF" />
            <stop offset="1" stopColor="#806BFF" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => (
          <line key={line} x1="10" x2="294" y1={32 + line * 34} y2={32 + line * 34} className="finance-grid-line" />
        ))}
        <motion.polyline
          points={points.join(" ")}
          fill="none"
          stroke="url(#financeLine)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        />
        {points.map((point) => {
          const [x, y] = point.split(",");
          return <circle key={point} cx={x} cy={y} r="4" className="finance-dot" />;
        })}
      </svg>
    </div>
  );
}

export function AgentMesh({ agents }: { agents: AiAgent[] }) {
  return (
    <div className="agent-mesh" aria-label="Malha de agentes de IA">
      {agents.map((agent, index) => (
        <motion.article
          className="agent-mesh__node"
          key={agent.id}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.16 }}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{agent.label}</strong>
          <small>{agent.permissions.join(" + ")}</small>
        </motion.article>
      ))}
    </div>
  );
}
