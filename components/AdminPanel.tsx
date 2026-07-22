"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, BellRing, CalendarClock, FlaskConical, Save, ShieldCheck, SlidersHorizontal, Zap } from "lucide-react";
import { HolographicPanel, StatusPill } from "@/components/AssessorVisuals";
import { adminMetrics, defaultAdminConfig } from "@/lib/admin-config";
import { assistantNavigation, integrations } from "@/lib/assistant-core";

const adminSections = [
  "Visao geral",
  "Usuarios",
  "Agenda",
  "Tarefas",
  "Projetos",
  "Rotinas",
  "Inbox",
  "IA e prompts",
  "Memoria",
  "Notificacoes",
  "Google Calendar",
  "WhatsApp",
  "Web Push",
  "Pagamentos",
  "Assinaturas",
  "Consentimentos",
  "Auditoria",
  "Erros",
  "Feature flags",
  "Configuracoes"
];

export function AdminPanel() {
  const [active, setActive] = useState("Visao geral");

  return (
    <main className="admin-shell command-theme">
      <div className="command-grid" />
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA Admin
        </Link>

        <section className="dashboard-hero" style={{ marginTop: 28 }}>
          <HolographicPanel className="dashboard-card" label="Ambiente protegido">
            <span className="eyebrow">
              <ShieldCheck size={16} /> Operacao do assessor
            </span>
            <h1>Centro operacional do assessor pessoal.</h1>
            <p className="premium-copy">
              Admin separado do usuario final para monitorar filas, integrações, consentimentos, pagamento, prompts, erros e
              auditoria sem misturar dados sensiveis.
            </p>
            <div className="metric-grid">
              <StatusCard label="Areas do produto" value={`${assistantNavigation.length}`} detail="sem abas vazias" />
              <StatusCard label="Integracoes" value={`${integrations.length}`} detail="demo, prontas ou com credenciais pendentes" />
            </div>
          </HolographicPanel>

          <HolographicPanel label="Saude operacional">
            <div className="bar-list">
              {[
                ["Checkout", "Preservado"],
                ["Webhooks", "Assinatura validada"],
                ["Google Calendar", "Contrato pronto"],
                ["WhatsApp", "Aguardando credenciais"]
              ].map(([label, value]) => (
                <div className="bar-label" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </HolographicPanel>
        </section>

        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="admin-module-grid">
            {adminMetrics.map(([label, value, delta]) => (
              <article className="info-card" key={label}>
                <p style={{ margin: 0, color: "var(--muted)" }}>{label}</p>
                <h3>{value}</h3>
                <StatusPill>{delta}</StatusPill>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="dashboard-grid">
            <aside className="panel dashboard-card">
              <div className="module-title">
                <div>
                  <h2>Modulos administrativos</h2>
                  <p>Todos existem para operacao, governanca ou configuracao.</p>
                </div>
              </div>
              <div className="bar-list">
                {adminSections.map((section) => (
                  <button className={`sidebar-item ${active === section ? "active" : ""}`} key={section} onClick={() => setActive(section)} type="button">
                    <span>{section}</span>
                  </button>
                ))}
              </div>
            </aside>

            <HolographicPanel className="dashboard-card" label={active}>
              {renderAdminModule(active)}
            </HolographicPanel>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="info-card">
      <p style={{ margin: 0, color: "var(--muted)" }}>{label}</p>
      <h3>{value}</h3>
      <p>{detail}</p>
    </article>
  );
}

function renderAdminModule(active: string) {
  if (active === "Visao geral") {
    return (
      <>
        <h2>Funil do assessor</h2>
        <p className="premium-copy">Acompanhe visita, checkout, ativacao, onboarding, primeiro comando, primeira confirmacao e retencao.</p>
        <div className="data-flow" style={{ marginTop: 18 }}>
          {["Visita", "Checkout", "Ativacao", "Onboarding", "Comando", "Confirmacao"].map((step, index) => (
            <div className="data-flow__item" key={step}>
              <div className="data-flow__node">{index + 1}</div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (["IA e prompts", "Feature flags", "Configuracoes"].includes(active)) {
    return (
      <>
        <h2>Configuracoes editaveis</h2>
        <p className="premium-copy">Mudancas sensiveis devem gerar versao, request id, autor e diffs de auditoria.</p>
        <div className="contact-form" style={{ marginTop: 18 }}>
          <div className="field">
            <label htmlFor="confirmations">Politica de confirmacao</label>
            <input id="confirmations" defaultValue="Acoes externas importantes sempre exigem confirmacao" />
          </div>
          <div className="field">
            <label htmlFor="hero">Titulo do hero</label>
            <input id="hero" defaultValue="Um assessor pessoal. Sempre atento ao seu dia." />
          </div>
          <div className="field">
            <label htmlFor="demo">Demo mode</label>
            <input id="demo" defaultValue={String(defaultAdminConfig.featureFlags.demoMode)} />
          </div>
          <button className="button" type="button">
            Salvar versao <Save size={18} />
          </button>
        </div>
      </>
    );
  }

  if (["Google Calendar", "WhatsApp", "Web Push", "Notificacoes"].includes(active)) {
    return (
      <>
        <h2>Canais e consentimento</h2>
        <p className="premium-copy">Configure canais sem disparar mensagens reais ate que o usuario autorize.</p>
        <div className="cards-grid" style={{ marginTop: 18 }}>
          {integrations.map((integration) => (
            <article className="info-card" key={integration.id}>
              <Zap color="#58c7ff" size={22} />
              <h3>{integration.label}</h3>
              <p>{integration.description}</p>
            </article>
          ))}
        </div>
      </>
    );
  }

  if (["Erros", "Auditoria", "Consentimentos"].includes(active)) {
    return (
      <>
        <h2>Governanca</h2>
        <p className="premium-copy">Logs, consentimentos, envios, alteracoes de memoria, integrações e permissoes administrativas.</p>
        <div className="cards-grid" style={{ marginTop: 18 }}>
          <article className="info-card">
            <AlertTriangle color="#ff6f91" size={22} />
            <h3>Erros criticos</h3>
            <p>Nenhum erro critico em modo demo.</p>
          </article>
          <article className="info-card">
            <Activity color="#58c7ff" size={22} />
            <h3>Auditoria</h3>
            <p>Alteracoes sensiveis salvam antes/depois e request id.</p>
          </article>
          <article className="info-card">
            <FlaskConical color="#9ee8ff" size={22} />
            <h3>Experimentos</h3>
            <p>Testes sem urgencia falsa e sem manipular consentimento.</p>
          </article>
        </div>
      </>
    );
  }

  return (
    <>
      <h2>{active}</h2>
      <p className="premium-copy">Modulo funcional para status, filtros, fila, edicao segura e exportacao controlada.</p>
      <div className="cards-grid" style={{ marginTop: 18 }}>
        {[
          [CalendarClock, "Status", "Visao operacional com itens ativos e pendentes."],
          [BellRing, "Fila", "Acoes aguardando confirmacao, envio ou credencial."],
          [SlidersHorizontal, "Acao segura", "Edicao gera auditoria antes de afetar usuarios."]
        ].map(([Icon, title, body]) => {
          const TypedIcon = Icon as typeof CalendarClock;
          return (
            <article className="info-card" key={String(title)}>
              <TypedIcon color="#58c7ff" size={22} />
              <h3>{String(title)}</h3>
              <p>{String(body)}</p>
            </article>
          );
        })}
      </div>
    </>
  );
}
