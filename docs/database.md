# Banco de Dados

Migrations:

- `001_initial_schema.sql`: diagnóstico, leads, pagamentos, relatórios e auditoria admin.
- `002_product_evolution_schema.sql`: objetivos, rotinas, hábitos, foco, recomendações, preferências e widgets.
- `003_proactive_assessor_schema.sql`: tarefas, agenda, lembretes, projetos, inbox, follow-ups, memória, push, integrações, mensagens e briefings.
- `004_personal_os_open_finance_schema.sql`: Personal OS, agentes, revisão semanal, Open Finance, cartões, faturas, investimentos, sync jobs, webhooks financeiros, auditoria e feature flags.

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

RLS fica ativa por padrão. Usuários só acessam seus próprios dados; categorias, instituições e feature flags têm leitura controlada. Acesso administrativo deve depender de claims/e-mails autorizados em produção.
