"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, BarChart3, FlaskConical, Save, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { ScannerPanel, StatusPill } from "@/components/PremiumVisuals";
import { adminMetrics, defaultAdminConfig } from "@/lib/admin-config";
import { questions } from "@/lib/questions";
import { adminSections } from "@/lib/product-experience";

export function AdminPanel() {
  const [active, setActive] = useState("Visão geral");

  return (
    <main className="admin-shell">
      <div className="grid-background" />
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA Admin
        </Link>

        <section className="dashboard-hero" style={{ marginTop: 28 }}>
          <ScannerPanel className="dashboard-card" label="Ambiente protegido">
            <span className="eyebrow">
              <ShieldCheck size={16} /> Admin separado do produto
            </span>
            <h1 style={{ marginTop: 18, fontSize: "clamp(2.2rem, 6vw, 5rem)" }}>Centro de controle da Virada IA.</h1>
            <p className="premium-copy">
              Controle funil, perguntas, scoring, prompts, biblioteca, preços, feature flags, auditoria e erros sem
              afetar a experiência do usuário final.
            </p>
            <div className="metric-grid">
              <StatusCard label="Perguntas ativas" value={`${questions.length}`} detail="versionadas por scoring" />
              <StatusCard label="Flags" value={`${Object.keys(defaultAdminConfig.featureFlags).length}`} detail="testes e releases" />
            </div>
          </ScannerPanel>

          <ScannerPanel label="Saúde operacional">
            <div className="bar-list">
              {[
                ["APIs", "Operando"],
                ["Pagamentos", "Demo seguro"],
                ["Relatórios", "Fila pronta"],
                ["Analytics", "Sem PII"]
              ].map(([label, value]) => (
                <div className="bar-label" key={label}>
                  <span>{label}</span>
                  <strong style={{ color: "var(--green)" }}>{value}</strong>
                </div>
              ))}
            </div>
          </ScannerPanel>
        </section>

        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="admin-module-grid">
            {adminMetrics.map(([label, value, delta]) => (
              <article className="info-card" key={label}>
                <p style={{ margin: 0, color: "var(--muted)" }}>{label}</p>
                <h3 style={{ marginTop: 8, fontSize: "1.7rem" }}>{value}</h3>
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
                  <h2>Áreas administrativas</h2>
                  <p>Todos os módulos têm finalidade operacional.</p>
                </div>
              </div>
              <div className="bar-list">
                {adminSections.map((section) => (
                  <button className={`sidebar-item ${active === section ? "active" : ""}`} key={section} onClick={() => setActive(section)} type="button">
                    {section}
                  </button>
                ))}
              </div>
            </aside>

            <ScannerPanel className="dashboard-card" label={active}>
              {renderAdminModule(active)}
            </ScannerPanel>
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
      <h3 style={{ marginTop: 8, fontSize: "1.7rem" }}>{value}</h3>
      <p>{detail}</p>
    </article>
  );
}

function renderAdminModule(active: string) {
  if (active === "Visão geral") {
    return (
      <>
        <h2>Funil e qualidade do produto</h2>
        <p className="premium-copy">Acompanhe conversão sem urgência falsa e sem dados pessoais em eventos de analytics.</p>
        <div className="data-flow" style={{ marginTop: 18 }}>
          {["Visita", "Diagnóstico", "Lead", "Resultado", "Checkout", "Plano"].map((step, index) => (
            <div className="data-flow__item" key={step}>
              <div className="data-flow__node">{index + 1}</div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (["Preços", "Planos", "Feature flags", "Testes A/B"].includes(active)) {
    return (
      <>
        <h2>Configurações editáveis</h2>
        <p className="premium-copy">Mudanças devem gerar versão, auditoria e rollout controlado.</p>
        <div className="contact-form" style={{ marginTop: 18 }}>
          {Object.entries(defaultAdminConfig.prices).map(([key, value]) => (
            <div className="field" key={key}>
              <label htmlFor={key}>Preço: {key}</label>
              <input id={key} defaultValue={value} />
            </div>
          ))}
          <div className="field">
            <label htmlFor="hero">Título do hero</label>
            <input id="hero" defaultValue={defaultAdminConfig.copy.heroTitle} />
          </div>
          <button className="button" type="button">
            Salvar versão <Save size={18} />
          </button>
        </div>
      </>
    );
  }

  if (["Perguntas", "Scoring", "Prompts", "Recomendações"].includes(active)) {
    return (
      <>
        <h2>Inteligência auditável</h2>
        <p className="premium-copy">
          {questions.length} perguntas ativas. Cada publicação deve gerar nova versão de scoring, prompts e log de auditoria.
        </p>
        <div className="cards-grid" style={{ marginTop: 18 }}>
          {[
            ["Mappings", "Pilares, pesos e perguntas"],
            ["Contradições", "Regras que reduzem confiança"],
            ["Prompts", "Limites de IA e resposta estruturada"]
          ].map(([title, body]) => (
            <article className="info-card" key={title}>
              <SlidersHorizontal color="#5cffb0" size={22} />
              <h3 style={{ marginTop: 12 }}>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </>
    );
  }

  if (["Erros", "Auditoria", "Configurações"].includes(active)) {
    return (
      <>
        <h2>Governança e segurança</h2>
        <p className="premium-copy">Logs, request IDs, status de integrações e permissões administrativas.</p>
        <div className="cards-grid" style={{ marginTop: 18 }}>
          <article className="info-card">
            <AlertTriangle color="#ff6470" size={22} />
            <h3 style={{ marginTop: 12 }}>Erros críticos</h3>
            <p>Nenhum erro crítico em modo demo.</p>
          </article>
          <article className="info-card">
            <Activity color="#5cffb0" size={22} />
            <h3 style={{ marginTop: 12 }}>Auditoria</h3>
            <p>Alterações sensíveis devem salvar antes/depois e request id.</p>
          </article>
          <article className="info-card">
            <FlaskConical color="#558cff" size={22} />
            <h3 style={{ marginTop: 12 }}>Experimentos</h3>
            <p>Testes A/B sem manipulação ou urgência falsa.</p>
          </article>
        </div>
      </>
    );
  }

  return (
    <>
      <h2>{active}</h2>
      <p className="premium-copy">
        Módulo preparado para operação: filtros, visão de status, exportação e edição controlada entram aqui sem misturar
        visual do admin com a experiência do usuário.
      </p>
      <div className="cards-grid" style={{ marginTop: 18 }}>
        {["Status", "Fila", "Ação segura"].map((item) => (
          <article className="info-card" key={item}>
            <BarChart3 color="#5cffb0" size={22} />
            <h3 style={{ marginTop: 12 }}>{item}</h3>
            <p>Estado funcional de demonstração, pronto para conectar ao backend real.</p>
          </article>
        ))}
      </div>
    </>
  );
}
