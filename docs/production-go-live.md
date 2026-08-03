# Go-Live De Producao

Este documento separa o que o codigo ja faz do que depende de credenciais, contrato ou revisao humana.

## Status Atual Em 2026-08-03

Ambiente tecnico de producao:

- Vercel em producao em `https://virada-ia.vercel.app`;
- `APP_ENV=production` e `DEMO_MODE=false`;
- Supabase real configurado com service role;
- migrations financeiras, sync, RLS e pagamentos aplicadas;
- OpenAI configurada;
- Mercado Pago real configurado com webhook;
- Resend configurado para envio basico;
- cron protegido por `CRON_SECRET`;
- criptografia financeira configurada;
- Pluggy configurado no backend com client id, client secret e webhook secret;
- webhook Pluggy criado para `/api/finance/webhook/pluggy`;
- webhook Pluggy autenticado por header `X-Virada-Webhook-Secret`;
- teste de webhook Pluggy em producao respondeu 200, persistiu evento e enfileirou sync;
- Vercel Analytics e Speed Insights injetados no layout.

Pendencias de go-live oficial:

- solicitacao de producao Pluggy esta pendente de aprovacao;
- solicitacao de dados reais Pluggy esta pendente de aprovacao;
- due diligence Pluggy ainda nao liberada no painel;
- falta piloto com banco real apos liberacao da Pluggy;
- falta revisao LGPD/juridica humana;
- recomendado configurar dominio proprio e dominio verificado no Resend antes de divulgacao ampla.
- readiness foi atualizado para aceitar evidencias formais de revisao juridica, aprovacao do provider e piloto real sem mascarar bloqueio externo.

## Estado Atual

Implementado no codigo:

- readiness em `/api/readiness`;
- sync financeiro em `/api/finance/sync`;
- cron Vercel diario em `vercel.json`;
- persistencia Supabase para conexoes, contas, saldos, transacoes, raw payload sanitizado, cartoes, faturas, investimentos, assinaturas, jobs, webhooks e auditoria;
- provider Pluggy com client id/client secret server-side, connect token, item/status, contas, transacoes, cartoes derivados, faturas derivadas, investimentos e revogacao via delete item;
- persistencia de pagamento aprovado em `payments` e `user_entitlements`;
- modo sandbox preservado para preview;
- producao real exige service role, conexoes financeiras ativas e cron protegido por `CRON_SECRET`; `OPEN_FINANCE_SYSTEM_USER_ID` e apenas fallback opcional;
- nenhuma senha bancaria, token de provider, CPF completo, conta completa ou cartao completo vai para o frontend/agente.

## Variaveis Obrigatorias Para Producao

Obrigatorias no ambiente de producao da Vercel:

- `APP_ENV=production`
- `DEMO_MODE=false`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `CRON_SECRET`
- `FINANCIAL_DATA_PROVIDER=pluggy`
- `OPEN_FINANCE_SANDBOX=false`
- `FINANCIAL_DATA_ENCRYPTION_KEY`
- `PLUGGY_CLIENT_ID`
- `PLUGGY_CLIENT_SECRET`
- `PLUGGY_WEBHOOK_SECRET`

Opcionais, mas recomendadas:

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`
- `WEB_PUSH_PUBLIC_KEY`
- `WEB_PUSH_PRIVATE_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`

Evidencias que destravam os tres bloqueios manuais do readiness:

- `LEGAL_REVIEW_APPROVED_AT`
- `LEGAL_REVIEW_APPROVER`
- `LEGAL_REVIEW_DOCUMENT_URL`
- `OPEN_FINANCE_PROVIDER_APPROVED_AT`
- `OPEN_FINANCE_PROVIDER_APPROVAL_REFERENCE`
- `REAL_DATA_PILOT_COMPLETED_AT`
- `REAL_DATA_PILOT_REPORT_URL`
- `RESEND_DOMAIN_VERIFIED=true` quando o dominio do Resend estiver validado

Ver `docs/go-live-evidence.md` antes de preencher qualquer uma dessas variaveis.

## Supabase

Migrations esperadas em ordem:

1. `001_initial_schema.sql`
2. `002_product_evolution_schema.sql`
3. `003_proactive_assessor_schema.sql`
4. `004_personal_os_open_finance_schema.sql`
5. `005_financial_sync_operations.sql`
6. `006_payment_entitlements.sql`

Estado atual: migrations aplicadas no Supabase real e grants de service role revisados.

Continuar conferindo:

- RLS ativo nas tabelas financeiras;
- RLS ativo em `user_entitlements`;
- service role somente no backend;
- exportacao/exclusao funcionando;
- opcionalmente, `OPEN_FINANCE_SYSTEM_USER_ID` aponta para um usuario UUID controlado apenas para fallback/demo; em producao o cron varre conexoes ativas por usuario.

## Open Finance Pluggy

No painel Pluggy:

- checklist tecnico concluido: 3 de 3;
- item demo conectado com sucesso;
- webhook configurado para `https://virada-ia.vercel.app/api/finance/webhook/pluggy`;
- header customizado `X-Virada-Webhook-Secret` configurado via API Pluggy;
- solicitacao de producao enviada e pendente;
- solicitacao de dados reais enviada e pendente;
- aguardar Pluggy liberar due diligence;
- apos liberacao, testar consentimento real com usuario piloto;
- apos liberacao, testar revogacao via acao `revoke`.

Quando a aprovacao chegar, configurar `OPEN_FINANCE_PROVIDER_APPROVED_AT` e `OPEN_FINANCE_PROVIDER_APPROVAL_REFERENCE` na Vercel.

## Validacao Antes Do Merge

Executar:

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

Com `DEMO_MODE=false`, `pnpm setup:check` deve falhar enquanto faltar variavel, Open Finance real, `APP_ENV=production` ou upgrade de dependencias.

## Pendencias Externas

Nada disso pode ser resolvido por codigo sozinho:

- aguardar aprovacao Pluggy para producao;
- aguardar aprovacao Pluggy para dados reais;
- completar due diligence Pluggy quando o painel liberar;
- rodar piloto com conta real controlada;
- revisar LGPD, termos, politica de privacidade, retencao e consentimento financeiro com responsavel juridico;
- configurar dominio proprio e dominio de email verificado no Resend;
- fazer compra real controlada no Mercado Pago antes de divulgacao ampla.

O roteiro operacional do piloto real esta em `docs/real-data-pilot.md`.
