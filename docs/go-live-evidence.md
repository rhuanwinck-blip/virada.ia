# Evidencias Para Go-Live 100%

O `/api/readiness` nao deve ser forcado manualmente. Ele passa para 100% somente quando existir evidencia real dos tres bloqueios externos.

## 1. Revisao LGPD/Juridica

Antes de divulgar em escala, um responsavel juridico precisa revisar:

- Termos de Uso;
- Politica de Privacidade;
- Politica de Cookies;
- consentimento financeiro/Open Finance;
- prazo de retencao;
- fluxo de exportacao, exclusao e revogacao;
- fornecedores: Vercel, Supabase, OpenAI, Mercado Pago, Resend, Pluggy ou Belvo, Sentry/PostHog quando usados.

Depois da aprovacao, configurar na Vercel:

```env
LEGAL_REVIEW_APPROVED_AT=2026-08-03
LEGAL_REVIEW_APPROVER=Nome do responsavel juridico
LEGAL_REVIEW_DOCUMENT_URL=https://link-do-parecer-ou-drive
```

## 2. Provider Open Finance Aprovado

Nao basta ter client id e secret. A Pluggy ou Belvo precisa liberar producao e dados reais para os produtos usados pelo Virada IA.

Evidencias esperadas:

- contrato ou conta de producao ativa;
- produtos autorizados: contas, transacoes e demais escopos usados;
- webhook de producao cadastrado;
- due diligence concluida quando exigida;
- status de dados reais liberado no painel ou por ticket/e-mail.

Depois da aprovacao, configurar:

```env
OPEN_FINANCE_PROVIDER_APPROVED_AT=2026-08-03
OPEN_FINANCE_PROVIDER_APPROVAL_REFERENCE=Pluggy ticket, contrato ou e-mail de aprovacao
```

## 3. Piloto Com Banco Real

Rodar o roteiro em `docs/real-data-pilot.md` com um usuario controlado, uma compra real ou pagamento validado e uma conexao bancaria real.

Depois de concluir sem falhas bloqueantes:

```env
REAL_DATA_PILOT_COMPLETED_AT=2026-08-03
REAL_DATA_PILOT_REPORT_URL=https://link-do-relatorio-do-piloto
```

## Recomendados

Estes nao bloqueiam o readiness, mas reduzem risco de divulgacao:

```env
RESEND_DOMAIN_VERIFIED=true
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_SENTRY_DSN=...
WEB_PUSH_PUBLIC_KEY=...
WEB_PUSH_PRIVATE_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
```

Ultima publicacao operacional: 2026-08-03 20:10 BRT.

Nunca configure uma evidencia como concluida antes do fato existir. O readiness e o contrato operacional do lancamento.
