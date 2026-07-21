# Banco de Dados

Migration inicial: `supabase/migrations/001_initial_schema.sql`.

Tabelas:

- `diagnostic_sessions`
- `diagnostic_answers`
- `leads`
- `payments`
- `reports`
- `daily_actions`
- `checkins`
- `consent_events`
- `testimonials`
- `admin_audit_logs`

RLS fica ativa por padrão. Acesso administrativo deve depender de claims/e-mails autorizados em produção.
