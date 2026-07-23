# Deploy

Destino pedido: Vercel.

Ambientes:

- development;
- preview;
- production.

## Preview

Preview pode rodar com:

- `DEMO_MODE=true`;
- `OPEN_FINANCE_SANDBOX=true`;
- dados financeiros marcados como sandbox.

## Production

Antes de publicar producao:

1. Configure todas as variaveis em `docs/production-go-live.md`.
2. Rode `/api/readiness`.
3. Rode `pnpm setup:check` com `DEMO_MODE=false`.
4. Aplique migrations no Supabase real.
5. Configure webhook Pluggy em `/api/finance/webhook/pluggy`.
6. Configure `CRON_SECRET`; o cron chama `/api/finance/sync` uma vez ao dia via `vercel.json`.
7. Rode piloto com dados reais controlados.

Nao publicar producao enquanto readiness tiver `blockers` ou testes criticos falharem.
