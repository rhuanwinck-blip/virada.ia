# Virada IA

Sistema operacional pessoal com inteligencia artificial.

Promessa: **Sua vida inteira. Organizada por uma inteligencia que trabalha com voce.**

## O Que Esta Implementado

- Landing page longa, futurista azul, com hero imersivo, comando por voz, storytelling sticky, Inicio, Jornada, Agenda, Financas, Open Finance, Agentes, Lembretes, Briefing, Replanejamento, Memoria, Seguranca, Planos, FAQ e CTA final.
- Dashboard reconstruido com as cinco areas principais: **Inicio**, **Sua Jornada**, **Agenda**, **Financas** e **Agentes de IA**.
- Inicio como central de comando com briefing, prioridades, compromissos, tarefas, contas proximas, saldo consolidado, ultimas movimentacoes, metas, projetos e acoes sugeridas.
- Sua Jornada com areas da vida, objetivos, metas, plano semanal, habitos, rotinas, marcos, conquistas, revisao semanal e relatorios.
- Agenda com hoje, calendario, compromissos, tarefas, projetos, rotinas, lembretes, follow-ups, caixa de entrada universal e modo foco.
- Financas com visao geral, extrato unificado, contas, cartoes, faturas, categorias, orcamento, assinaturas, compromissos, contas a pagar/receber, metas financeiras, investimentos, relatorios e conexoes.
- Open Finance read-only com interface `FinancialDataProvider`, provider inicial `PluggyFinancialDataProvider`, `BelvoFinancialDataProvider` preparado e sandbox claro.
- Fluxo funcional de conexao bancaria sandbox via backend: token temporario, conexao, validacao, refresh, revogacao e remocao de dados.
- Sync financeiro backend em `/api/finance/sync`, cron Vercel diario, persistencia Supabase opcional e readiness de producao em `/api/readiness`.
- Pluggy em modo producao com endpoints server-side para item/status, contas, transacoes, cartoes derivados, faturas derivadas, investimentos e revogacao do item.
- Categorizacao financeira em camadas: regra deterministica, correcao do usuario e fallback de IA previsto.
- Agente financeiro com dados agregados, mascarados e minimizados; sem CPF, senha, token, conta completa ou cartao completo.
- Onboarding pos-cadastro/pagamento com objetivos, rotina, Google Calendar, notificacoes, WhatsApp opcional, Open Finance opcional, contas manuais, primeira meta e briefing.
- PWA, Web Push, Google Calendar, WhatsApp Cloud API e e-mail preservados/preparados.
- Pagamentos, checkout, webhook Mercado Pago, LGPD, APIs existentes e infraestrutura preservados.

## Rodar Localmente

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`.

## Validacao

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm db:migrate
pnpm db:types
pnpm setup:check
```

## Variaveis

Com `DEMO_MODE=true` e `OPEN_FINANCE_SANDBOX=true`, o app funciona sem credenciais reais e marca os dados como sandbox.

Principais variaveis:

- `FINANCIAL_DATA_PROVIDER=pluggy`
- `OPEN_FINANCE_SANDBOX=true`
- `PLUGGY_CLIENT_ID`
- `PLUGGY_CLIENT_SECRET`
- `PLUGGY_WEBHOOK_SECRET`
- `BELVO_SECRET_ID`
- `BELVO_SECRET_PASSWORD`
- `BELVO_WEBHOOK_SECRET`
- `FINANCIAL_DATA_ENCRYPTION_KEY`
- `OPEN_FINANCE_SYSTEM_USER_ID`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
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
- Visuais holograficos: `components/AssessorVisuals.tsx`
- Produto Personal OS: `lib/personal-os.ts`
- Open Finance/provider: `lib/financial-provider.ts`
- Parser do assessor: `lib/assistant-core.ts`
- Seguranca: `lib/security.ts`
- Onboarding: `components/OnboardingClient.tsx`
- Finance APIs: `app/api/finance/*`
- Sync/readiness: `app/api/finance/sync/route.ts`, `app/api/readiness/route.ts`, `lib/financial-sync.ts`, `lib/financial-store.ts`, `lib/production-readiness.ts`
- Checkout: `app/checkout/page.tsx` e `app/api/checkout/route.ts`
- Pagamentos/webhook: `lib/payments.ts` e `app/api/payments/webhook/route.ts`
- Banco: `supabase/migrations/001_initial_schema.sql` a `005_financial_sync_operations.sql`

## Documentacao

- `docs/personal-os-open-finance-audit.md`
- `docs/personal-os-open-finance-redesign.md`
- `docs/proactive-assessor-redesign.md`
- `docs/security.md`
- `docs/database.md`
- `docs/production-go-live.md`

## Limites De Seguranca

O Virada IA organiza, explica, categoriza, lembra e prepara acoes. Ele nao pede senha bancaria, nao armazena token bancario no navegador, nao movimenta dinheiro, nao inicia pagamentos, nao recomenda investimento especifico e nao executa acoes externas importantes sem confirmacao explicita do usuario.
