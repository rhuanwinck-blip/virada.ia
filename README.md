# Virada IA

Sistema operacional pessoal com inteligência artificial.

Promessa: **Sua vida inteira. Organizada por uma inteligência que trabalha com você.**

## O Que Está Implementado

- Landing page longa, futurista azul, com hero imersivo, comando por voz, storytelling sticky, Início, Jornada, Agenda, Finanças, Open Finance, Agentes, Lembretes, Briefing, Replanejamento, Memória, Segurança, Planos, FAQ e CTA final.
- Dashboard reconstruído com as cinco áreas principais: **Início**, **Sua Jornada**, **Agenda**, **Finanças** e **Agentes de IA**.
- Início como central de comando com briefing, prioridades, compromissos, tarefas, contas próximas, saldo consolidado, últimas movimentações, metas, projetos e ações sugeridas.
- Sua Jornada com áreas da vida, objetivos, metas, plano semanal, hábitos, rotinas, marcos, conquistas, revisão semanal e relatórios.
- Agenda com hoje, calendário, compromissos, tarefas, projetos, rotinas, lembretes, follow-ups, caixa de entrada universal e modo foco.
- Finanças com visão geral, extrato unificado, contas, cartões, faturas, categorias, orçamento, assinaturas, compromissos, contas a pagar/receber, metas financeiras, investimentos, relatórios e conexões.
- Open Finance read-only com interface `FinancialDataProvider`, provider inicial `PluggyFinancialDataProvider`, `BelvoFinancialDataProvider` preparado e sandbox claro.
- Fluxo funcional de conexão bancária sandbox via backend: token temporário, conexão, validação, refresh, revogação e remoção de dados.
- Categorização financeira em camadas: regra determinística, correção do usuário e fallback de IA previsto.
- Agente financeiro com dados agregados, mascarados e minimizados; sem CPF, senha, token, conta completa ou cartão completo.
- Onboarding pós-cadastro/pagamento com objetivos, rotina, Google Calendar, notificações, WhatsApp opcional, Open Finance opcional, contas manuais, primeira meta e briefing.
- PWA, Web Push, Google Calendar, WhatsApp Cloud API e e-mail preservados/preparados.
- Pagamentos, checkout, webhook Mercado Pago, LGPD, APIs existentes e infraestrutura preservados.

## Rodar Localmente

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`.

## Validação

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm db:migrate
pnpm db:types
```

## Variáveis

Com `DEMO_MODE=true` e `OPEN_FINANCE_SANDBOX=true`, o app funciona sem credenciais reais e marca os dados como sandbox.

Principais variáveis:

- `FINANCIAL_DATA_PROVIDER=pluggy`
- `OPEN_FINANCE_SANDBOX=true`
- `PLUGGY_CLIENT_ID`
- `PLUGGY_CLIENT_SECRET`
- `PLUGGY_WEBHOOK_SECRET`
- `BELVO_SECRET_ID`
- `BELVO_SECRET_PASSWORD`
- `BELVO_WEBHOOK_SECRET`
- `FINANCIAL_DATA_ENCRYPTION_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_WEBHOOK_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WEB_PUSH_PUBLIC_KEY`
- `WEB_PUSH_PRIVATE_KEY`

Nunca envie `.env` real ao GitHub.

## Arquitetura Principal

- Landing: `components/AssessorLanding.tsx`
- Dashboard Personal OS: `components/DashboardClient.tsx`
- Visuais holográficos: `components/AssessorVisuals.tsx`
- Produto Personal OS: `lib/personal-os.ts`
- Open Finance/provider: `lib/financial-provider.ts`
- Parser do assessor: `lib/assistant-core.ts`
- Segurança: `lib/security.ts`
- Onboarding: `components/OnboardingClient.tsx`
- Finance APIs: `app/api/finance/*`
- Checkout: `app/checkout/page.tsx` e `app/api/checkout/route.ts`
- Pagamentos/webhook: `lib/payments.ts` e `app/api/payments/webhook/route.ts`
- Banco: `supabase/migrations/001_initial_schema.sql` a `004_personal_os_open_finance_schema.sql`

## Documentação

- `docs/personal-os-open-finance-audit.md`
- `docs/personal-os-open-finance-redesign.md`
- `docs/proactive-assessor-redesign.md`
- `docs/security.md`
- `docs/database.md`

## Limites De Segurança

O Virada IA organiza, explica, categoriza, lembra e prepara ações. Ele não pede senha bancária, não armazena token bancário no navegador, não movimenta dinheiro, não inicia pagamentos, não recomenda investimento específico e não executa ações externas importantes sem confirmação explícita do usuário.
