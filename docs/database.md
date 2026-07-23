# Banco De Dados

Migrations:

- `001_initial_schema.sql`: diagnostico, leads, pagamentos, relatorios e auditoria admin.
- `002_product_evolution_schema.sql`: objetivos, rotinas, habitos, foco, recomendacoes, preferencias e widgets.
- `003_proactive_assessor_schema.sql`: tarefas, agenda, lembretes, projetos, inbox, follow-ups, memoria, push, integracoes, mensagens e briefings.
- `004_personal_os_open_finance_schema.sql`: Personal OS, agentes, revisao semanal, Open Finance, cartoes, faturas, investimentos, sync jobs, webhooks financeiros, auditoria e feature flags.
- `005_financial_sync_operations.sql`: idempotencia de investimentos/assinaturas e flag de background sync.

Tabelas financeiras principais:

- `financial_connections`
- `financial_consents`
- `financial_institutions`
- `financial_accounts`
- `financial_balances`
- `financial_transaction_raw`
- `financial_transactions`
- `financial_categories`
- `financial_category_rules`
- `credit_cards`
- `credit_card_bills`
- `credit_card_transactions`
- `financial_subscriptions`
- `financial_commitments`
- `financial_receivables`
- `budgets`
- `financial_goals`
- `financial_investments`
- `financial_sync_jobs`
- `financial_webhook_events`
- `financial_insights`

RLS fica ativa por padrao. Usuarios so acessam seus proprios dados; categorias, instituicoes e feature flags tem leitura controlada. Acesso administrativo deve depender de claims/e-mails autorizados em producao.

Sync financeiro usa service role apenas no backend para:

- gravar snapshot read-only coletado do provider;
- preservar payload bruto sanitizado em `financial_transaction_raw`;
- atualizar jobs em `financial_sync_jobs`;
- persistir webhooks em `financial_webhook_events`;
- auditar acoes sensiveis em `audit_logs`.
