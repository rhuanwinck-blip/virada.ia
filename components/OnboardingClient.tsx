"use client";

import Link from "next/link";
import { ArrowRight, Banknote, BellRing, CalendarClock, Check, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { AssessorCore, HolographicPanel, StatusPill } from "@/components/AssessorVisuals";
import { personalOsOnboardingSteps } from "@/lib/personal-os";

export function OnboardingClient() {
  const [step, setStep] = useState(0);
  const progress = Math.round(((step + 1) / personalOsOnboardingSteps.length) * 100);

  return (
    <main className="result-shell command-theme">
      <div className="command-grid" />
      <div className="container">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span> Virada IA
        </Link>

        <section className="dashboard-hero" style={{ marginTop: 28 }}>
          <HolographicPanel className="dashboard-card" label="Ativacao do assessor">
            <span className="eyebrow">
              <Sparkles size={15} /> Etapa {step + 1} de {personalOsOnboardingSteps.length}
            </span>
            <h1>{personalOsOnboardingSteps[step]}</h1>
            <p className="premium-copy">{copyByStep(step)}</p>
            <div className="progress-track" aria-label={`Progresso ${progress}%`}>
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="onboarding-form">
              {renderStep(step)}
              <div className="inline-actions">
                <button className="button secondary" type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
                  Voltar
                </button>
              {step < personalOsOnboardingSteps.length - 1 ? (
                  <button className="button" type="button" onClick={() => setStep((value) => value + 1)}>
                    Continuar <ArrowRight size={17} />
                  </button>
                ) : (
                  <Link className="button" href="/dashboard?payment=approved">
                    Abrir meu dia <ArrowRight size={17} />
                  </Link>
                )}
              </div>
            </div>
          </HolographicPanel>

          <HolographicPanel label="Nucleo ativando">
            <AssessorCore score={progress} label="Ativacao" />
            <div className="stack-list">
              {personalOsOnboardingSteps.map((item, index) => (
                <div className={`stack-item ${index <= step ? "done" : ""}`} key={item}>
                  <strong>{item}</strong>
                  <span>{index < step ? "Concluido" : index === step ? "Atual" : "Aguardando"}</span>
                </div>
              ))}
            </div>
          </HolographicPanel>
        </section>
      </div>
    </main>
  );
}

function renderStep(step: number) {
  if (step === 0) {
    return (
      <div className="activation-visual">
        <Sparkles size={28} />
        <strong>Assessor em modo demo pronto para configurar sua rotina.</strong>
      </div>
    );
  }

  if (step === 7) {
    return (
      <div className="info-card">
        <CalendarClock color="#58c7ff" />
        <h3>Google Calendar</h3>
        <p>Conexao preparada. Sem credenciais, o modo demo segue com agenda local.</p>
        <StatusPill tone="amber">Aguardando OAuth</StatusPill>
      </div>
    );
  }

  if (step === 8) {
    return (
      <div className="info-card">
        <BellRing color="#58c7ff" />
        <h3>Notificacoes</h3>
        <p>Push PWA preparado. O navegador pedira permissao apenas quando voce ativar.</p>
        <label className="checkbox-line">
          <input type="checkbox" defaultChecked /> Ativar lembretes no painel e preparar push.
        </label>
      </div>
    );
  }

  if (step === 9) {
    return (
      <div className="info-card">
        <MessageCircle color="#58c7ff" />
        <h3>WhatsApp oficial</h3>
        <p>O canal fica desligado ate existir consentimento e credenciais da Cloud API.</p>
        <label className="checkbox-line">
          <input type="checkbox" /> Quero configurar WhatsApp depois.
        </label>
      </div>
    );
  }

  if (step === 10) {
    return (
      <div className="info-card">
        <Banknote color="#58c7ff" />
        <h3>Open Finance opcional</h3>
        <p>
          O Virada IA cria um token temporário no backend e abre o fluxo oficial do provider. A conexão é somente leitura,
          pode ser revogada e não pede senha bancária dentro do app.
        </p>
        <div className="notice">
          Dados acessados: contas, saldos, transações, cartões, faturas e investimentos quando disponíveis. Finalidade:
          organizar sua vida financeira, alertar vencimentos e alimentar o agente financeiro com dados mascarados.
        </div>
        <label className="checkbox-line">
          <input type="checkbox" /> Quero conectar bancos depois.
        </label>
        <StatusPill tone="amber">Sandbox até validar credenciais Pluggy</StatusPill>
      </div>
    );
  }

  if (step === 11) {
    return (
      <div className="info-card">
        <ShieldCheck color="#58c7ff" />
        <h3>Contas manuais opcionais</h3>
        <p>Você pode cadastrar contas a pagar, contas a receber, orçamento e metas mesmo sem banco conectado.</p>
        <label className="checkbox-line">
          <input type="checkbox" defaultChecked /> Criar seguro auto como conta a pagar e lembrete na agenda.
        </label>
      </div>
    );
  }

  if (step === 13 || step === 14) {
    return (
      <div className="info-card">
        <Check color="#58c7ff" />
        <h3>Primeiro dia gerado</h3>
        <p>Briefing inicial: 3 compromissos, 4 tarefas, uma fatura sandbox, seguro na agenda e uma janela livre para o orçamento.</p>
      </div>
    );
  }

  return (
    <div className="contact-form">
      <div className="field">
        <label htmlFor={`onboarding-${step}`}>{fieldLabel(step)}</label>
        <input id={`onboarding-${step}`} defaultValue={fieldDefault(step)} />
      </div>
    </div>
  );
}

function copyByStep(step: number) {
  const copy = [
    "Vamos acender a central e preparar permissões sem executar nada fora do app.",
    "Seu nome personaliza briefing, conversa e notificações.",
    "Objetivos dão contexto para metas, agenda, finanças e agentes.",
    "Horários de trabalho ajudam a encontrar janelas livres sem lotar seu dia.",
    "Compromissos fixos protegem rotina, deslocamento e recorrências.",
    "Rotina define hábitos, versões reduzidas e revisão da noite.",
    "Horário silencioso impede alertas fora do período permitido.",
    "Conecte calendário para eventos reais ou continue no modo demo.",
    "Ative notificações com consentimento e antecedência controlada.",
    "WhatsApp oficial é opcional e nunca envia mensagem sem autorização.",
    "Open Finance é opcional, somente leitura e feito pelo fluxo oficial do provider.",
    "Contas manuais cobrem boletos, recebíveis e orçamento sem banco conectado.",
    "A primeira meta une Sua Jornada e Finanças.",
    "O primeiro dia será montado com agenda, tarefas, finanças e tempo livre.",
    "Veja o primeiro briefing e abra sua Central."
  ];
  return copy[step] ?? copy[0];
}

function fieldLabel(step: number) {
  const labels = ["", "Nome", "Objetivos", "Horário de trabalho", "Compromissos fixos", "Rotina", "Horário silencioso", "", "", "", "", "", "Primeira meta"];
  return labels[step] ?? "Resposta";
}

function fieldDefault(step: number) {
  const defaults = [
    "",
    "Rhuan",
    "Renda extra, carro, rotina estável",
    "09:00 às 18:00",
    "Academia segunda, quarta e sexta",
    "Revisar prioridades 08:00; resumo da noite 21:30",
    "22:00 às 07:00",
    "",
    "",
    "",
    "",
    "",
    "Juntar R$ 20.000 para comprar um carro"
  ];
  return defaults[step] ?? "";
}
