"use client";

import Link from "next/link";
import { Save, ShieldCheck } from "lucide-react";
import { adminMetrics, defaultAdminConfig } from "@/lib/admin-config";
import { questions } from "@/lib/questions";

export function AdminPanel() {
  return (
    <main className="admin-shell">
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA Admin
        </Link>
        <div className="section-header" style={{ marginTop: 32 }}>
          <span className="eyebrow">
            <ShieldCheck size={16} /> Ambiente protegido
          </span>
          <h1 style={{ fontSize: "clamp(2.1rem, 5vw, 4.4rem)" }}>Painel administrativo</h1>
          <p>
            Controle de preços, perguntas, mappings, funil, prova social real e logs de auditoria. Em produção, esta
            rota exige autenticação e autorização por e-mail administrativo.
          </p>
        </div>

        <div className="cards-grid">
          {adminMetrics.map(([label, value, delta]) => (
            <article className="info-card" key={label}>
              <p style={{ margin: 0, color: "var(--muted)" }}>{label}</p>
              <h3 style={{ marginTop: 8, fontSize: "1.7rem" }}>{value}</h3>
              <span style={{ color: "var(--green)" }}>{delta}</span>
            </article>
          ))}
        </div>

        <div className="admin-grid" style={{ marginTop: 18 }}>
          <section className="panel" style={{ padding: 24 }}>
            <h2>Configurações editáveis</h2>
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
          </section>

          <aside className="panel" style={{ padding: 24 }}>
            <h2>Questionário</h2>
            <p style={{ color: "var(--secondary)", lineHeight: 1.6 }}>
              {questions.length} perguntas ativas. Cada publicação deve gerar nova versão de scoring e log de auditoria.
            </p>
            <ul className="check-list">
              <li>Ativar/desativar perguntas</li>
              <li>Editar mappings e pesos</li>
              <li>Regenerar relatório</li>
              <li>Exportar CSV</li>
              <li>Consultar pagamentos</li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
