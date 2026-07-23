# Go-Live De Producao

Este documento separa o que o codigo ja faz do que depende de credenciais, contrato ou revisao humana.

## Estado Atual

Implementado no codigo:

- readiness em `/api/readiness`;
- sync financeiro em `/api/finance/sync`;
- cron Vercel diario em `vercel.json`;
- persistencia Supabase para conexoes, contas, saldos, transacoes, raw payload sanitizado, cartoes, faturas, investimentos, assinaturas, jobs, webhooks e auditoria;
- provider Pluggy com API Key server-side, connect token, item/status, contas, transacoes, cartoes derivados, faturas derivadas, investimentos e revogacao via delete item;
- modo sandbox preservado para preview;
- producao real exige service role, conexoes financeiras ativas e cron protegido por `CRON_SECRET`; `OPEN_FINANCE_SYSTEM_USER_ID` e apenas fallback opcional;
- nenhuma senha bancaria, token de provider, CPF completo, conta completa ou cartao completo vai para o frontend/agente.

## Variaveis Obrigatorias Para Producao

Definir na Vercel:

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

## Supabase

Aplicar migrations em ordem:

1. `001_initial_schema.sql`
2. `002_product_evolution_schema.sql`
3. `003_proactive_assessor_schema.sql`
4. `004_personal_os_open_finance_schema.sql`
5. `005_financial_sync_operations.sql`

Depois conferir:

- RLS ativo nas tabelas financeiras;
- service role somente no backend;
- exportacao/exclusao funcionando;
- opcionalmente, `OPEN_FINANCE_SYSTEM_USER_ID` aponta para um usuario UUID controlado apenas para fallback/demo; em producao o cron varre conexoes ativas por usuario.

## Open Finance Pluggy

No painel Pluggy:

- ativar conta/contrato de producao;
- liberar produtos: accounts, transactions, credit cards/bills quando disponivel, investments;
- configurar webhook para `/api/finance/webhook/pluggy`;
- configurar o secret igual a `PLUGGY_WEBHOOK_SECRET`;
- testar consentimento real com usuario piloto;
- testar revogacao via acao `revoke`.

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

- inserir secrets reais na Vercel;
- aplicar migrations no Supabase real;
- contratar/ativar Pluggy ou Belvo;
- rodar piloto com conta real controlada;
- revisar LGPD, termos, politica de privacidade, retencao e consentimento financeiro com responsavel juridico;
- atualizar dependencias Next/React para versoes corrigidas no lockfile com acesso ao registry.
