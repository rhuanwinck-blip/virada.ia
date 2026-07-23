# Personal OS + Open Finance

Data: 2026-07-22

## Produto

O Virada IA foi reconstruído como um sistema operacional pessoal com cinco áreas principais:

- Início
- Sua Jornada
- Agenda
- Finanças
- Agentes de IA

As áreas compartilham os mesmos dados de objetivos, agenda, projetos, compromissos financeiros, conexões bancárias sandbox, notificações e agentes.

## Open Finance

Provider inicial: Pluggy.

Provider preparado: Belvo.

Interface criada: `FinancialDataProvider`.

Métodos:

- `createConnectToken()`
- `createConnection()`
- `getConnectionStatus()`
- `listInstitutions()`
- `listAccounts()`
- `listBalances()`
- `listTransactions()`
- `listCreditCards()`
- `listBills()`
- `listInvestments()`
- `refreshConnection()`
- `revokeConnection()`
- `handleWebhook()`

O sistema usa um modelo interno normalizado. O restante do produto não depende diretamente do formato Pluggy.

## Referências Oficiais Verificadas

- Pluggy Auth: `https://docs.pluggy.ai/reference/auth`
- Pluggy Connect Token: `https://docs.pluggy.ai/reference/connect-token-create`
- Pluggy Webhooks: `https://docs.pluggy.ai/docs/webhooks`
- Belvo widget/token e fluxos assíncronos: `https://developers.belvo.com/developer_resources/resources-asynchronous-workflows`
- Belvo exemplos de autenticação por `BELVO_SECRET_ID:BELVO_SECRET_PASSWORD`: `https://developers.belvo.com/developer_resources/resources-webhooks-aggregation`

## Sandbox

Variável:

```bash
OPEN_FINANCE_SANDBOX=true
```

Enquanto faltarem credenciais reais, o app:

- cria connect token sandbox;
- simula instituições;
- simula contas;
- simula saldos;
- simula transações;
- simula cartões;
- simula faturas;
- simula investimentos;
- testa refresh;
- testa revogação;
- testa webhook;
- marca todos os dados como sandbox.

Dados sandbox nunca são mostrados como dados reais.

## Rotas Financeiras

- `GET/POST /api/finance/connect-token`
- `GET/POST/PATCH /api/finance/connections`
- `GET /api/finance/accounts`
- `GET /api/finance/transactions`
- `POST /api/finance/categorize`
- `POST /api/finance/webhook/pluggy`

## Segurança

Implementado/preparado:

- segredos somente no backend;
- token temporário para widget;
- nenhuma senha bancária dentro do Virada IA;
- conexão somente leitura;
- sem iniciação de pagamento;
- sem movimentação de dinheiro;
- assinatura de webhook com janela contra replay;
- idempotência por `eventId`;
- payload de webhook sanitizado;
- dados brutos preservados em tabela separada;
- correções do usuário separadas do dado bruto;
- agente financeiro com dados agregados, normalizados, mascarados e minimizados.

## Banco

Migration adicionada:

- `supabase/migrations/004_personal_os_open_finance_schema.sql`

Ela adiciona:

- `profiles`
- `milestones`
- `routine_items`
- `subtasks`
- `assistant_agents`
- `weekly_reviews`
- tabelas `financial_*`
- `credit_cards`
- `credit_card_bills`
- `credit_card_transactions`
- `budgets`
- `audit_logs`
- `feature_flags`

RLS foi habilitado nas tabelas novas. Usuários só acessam dados próprios; categorias, instituições e feature flags têm leitura controlada.

## Limites Atuais

- Produção Pluggy depende de `PLUGGY_CLIENT_ID`, `PLUGGY_CLIENT_SECRET` e `PLUGGY_WEBHOOK_SECRET`.
- Belvo está preparado, mas ainda fica em sandbox até credenciais e ativação.
- Sincronização real em background deve ser ligada a fila/cron em produção.
- Não há iniciação de pagamento nesta fase.
- Não há recomendação específica de investimento.
