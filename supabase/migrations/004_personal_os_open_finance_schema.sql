create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  timezone text not null default 'America/Sao_Paulo',
  work_hours jsonb not null default '{}',
  quiet_hours jsonb not null default '{}',
  notification_preferences jsonb not null default '{}',
  memory_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  goal_id uuid references public.goals(id) on delete cascade,
  title text not null,
  target_date date,
  completed_at timestamptz,
  evidence jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.routine_items (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  title text not null,
  duration_minutes integer check (duration_minutes between 1 and 1440),
  recurrence_rule text,
  minimal_version text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  title text not null,
  status text not null default 'pendente' check (status in ('pendente', 'em_andamento', 'concluida', 'cancelada')),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assistant_agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  key text not null,
  label text not null,
  role text not null,
  permissions jsonb not null default '[]',
  enabled boolean not null default true,
  last_used_at timestamptz,
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, key)
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  week_starts_on date not null,
  wins jsonb not null default '[]',
  pending jsonb not null default '[]',
  conflicts jsonb not null default '[]',
  financial_snapshot jsonb not null default '{}',
  plan_for_next_week jsonb not null default '{}',
  confirmed_by_user boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, week_starts_on)
);

create table if not exists public.financial_institutions (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('pluggy', 'belvo')),
  provider_institution_id text not null,
  name text not null,
  brand_name text,
  country text not null default 'BR',
  products jsonb not null default '[]',
  sandbox boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider, provider_institution_id)
);

create table if not exists public.financial_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  provider text not null check (provider in ('pluggy', 'belvo')),
  provider_item_id text not null,
  institution_id uuid references public.financial_institutions(id) on delete set null,
  status text not null default 'conectando' check (
    status in (
      'conectando',
      'aguardando_consentimento',
      'conectada',
      'sincronizando',
      'atencao_necessaria',
      'consentimento_expirando',
      'consentimento_expirado',
      'revogada',
      'erro_temporario'
    )
  ),
  consent_status text not null default 'pending' check (consent_status in ('active', 'expiring', 'expired', 'revoked', 'pending')),
  consent_expires_at timestamptz,
  last_sync_at timestamptz,
  next_sync_at timestamptz,
  products_authorized jsonb not null default '[]',
  provider_access_ref_encrypted text,
  error_code text,
  error_message text,
  idempotency_key text not null default gen_random_uuid()::text,
  version integer not null default 1,
  sandbox boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, provider, provider_item_id),
  unique(idempotency_key)
);

create table if not exists public.financial_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  connection_id uuid not null references public.financial_connections(id) on delete cascade,
  provider_consent_id text,
  status text not null check (status in ('active', 'expiring', 'expired', 'revoked', 'pending')),
  scopes jsonb not null default '[]',
  purpose text not null,
  granted_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  revocation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.financial_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  connection_id uuid not null references public.financial_connections(id) on delete cascade,
  provider_account_id text not null,
  institution_name text not null,
  name text not null,
  type text not null,
  number_mask text not null,
  holder_mask text,
  currency text not null default 'BRL',
  raw_last_four text,
  status text not null default 'active',
  sandbox boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(connection_id, provider_account_id)
);

create table if not exists public.financial_balances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  account_id uuid not null references public.financial_accounts(id) on delete cascade,
  available_cents bigint not null default 0,
  current_cents bigint not null default 0,
  blocked_cents bigint not null default 0,
  currency text not null default 'BRL',
  provider_updated_at timestamptz,
  created_at timestamptz not null default now(),
  unique(account_id, provider_updated_at)
);

create table if not exists public.financial_transaction_raw (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  connection_id uuid not null references public.financial_connections(id) on delete cascade,
  provider text not null check (provider in ('pluggy', 'belvo', 'manual')),
  provider_transaction_id text not null,
  raw_payload jsonb not null,
  payload_hash text not null,
  received_at timestamptz not null default now(),
  unique(provider, provider_transaction_id, payload_hash)
);

create table if not exists public.financial_categories (
  key text primary key,
  label text not null,
  kind text not null check (kind in ('entrada', 'saida', 'ambos')),
  color text,
  is_system boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  connection_id uuid not null references public.financial_connections(id) on delete cascade,
  account_id uuid references public.financial_accounts(id) on delete set null,
  raw_id uuid references public.financial_transaction_raw(id) on delete set null,
  provider_transaction_id text not null,
  original_description text not null,
  normalized_description text not null,
  amount_cents bigint not null,
  currency text not null default 'BRL',
  transaction_date date not null,
  institution_name text not null,
  category_key text references public.financial_categories(key),
  user_category_key text references public.financial_categories(key),
  type text not null check (type in ('entrada', 'saida')),
  status text not null default 'posted' check (status in ('posted', 'pending', 'deleted')),
  recurrence_status text not null default 'none' check (recurrence_status in ('none', 'candidate', 'confirmed')),
  note text,
  source text not null check (source in ('pluggy', 'belvo', 'manual')),
  external_id text not null,
  synced_at timestamptz not null,
  hidden_from_analysis boolean not null default false,
  split_allocations jsonb not null default '[]',
  attachment_urls jsonb not null default '[]',
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(connection_id, provider_transaction_id)
);

create table if not exists public.financial_category_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  pattern text not null,
  category_key text not null references public.financial_categories(key),
  confidence numeric(4, 3) not null default 0.800,
  source text not null default 'user_correction' check (source in ('deterministic', 'user_correction', 'ai_fallback')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  connection_id uuid not null references public.financial_connections(id) on delete cascade,
  provider_card_id text not null,
  institution_name text not null,
  name text not null,
  final_digits text not null,
  limit_cents bigint,
  available_limit_cents bigint,
  closing_day integer check (closing_day between 1 and 31),
  due_day integer check (due_day between 1 and 31),
  status text not null default 'active',
  sandbox boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(connection_id, provider_card_id)
);

create table if not exists public.credit_card_bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  card_id uuid not null references public.credit_cards(id) on delete cascade,
  due_date date not null,
  closing_date date,
  amount_cents bigint not null default 0,
  projected_amount_cents bigint not null default 0,
  status text not null default 'open' check (status in ('open', 'closed', 'paid', 'overdue')),
  confidence numeric(4, 3) not null default 0.700,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(card_id, due_date)
);

create table if not exists public.credit_card_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  card_id uuid not null references public.credit_cards(id) on delete cascade,
  bill_id uuid references public.credit_card_bills(id) on delete set null,
  provider_transaction_id text not null,
  original_description text not null,
  normalized_description text not null,
  amount_cents bigint not null,
  purchase_date date not null,
  installments jsonb not null default '{}',
  category_key text references public.financial_categories(key),
  status text not null default 'posted',
  raw_payload jsonb not null default '{}',
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(card_id, provider_transaction_id)
);

create table if not exists public.financial_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  connection_id uuid references public.financial_connections(id) on delete set null,
  transaction_id uuid references public.financial_transactions(id) on delete set null,
  service text not null,
  amount_cents bigint not null,
  frequency text not null default 'mensal' check (frequency in ('semanal', 'mensal', 'anual')),
  next_charge_date date,
  account_or_card text,
  status text not null default 'provavel' check (status in ('provavel', 'confirmada', 'em_revisao', 'oculta')),
  confidence numeric(4, 3) not null default 0.700,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.financial_commitments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  amount_cents bigint not null,
  due_date date not null,
  category_key text references public.financial_categories(key),
  status text not null default 'previsto' check (status in ('previsto', 'agendado', 'pago', 'atrasado', 'cancelado')),
  source text not null default 'manual' check (source in ('manual', 'assistant', 'open_finance')),
  linked_task_id uuid references public.tasks(id) on delete set null,
  linked_event_id uuid references public.events(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.financial_receivables (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  amount_cents bigint not null,
  expected_date date not null,
  category_key text references public.financial_categories(key),
  status text not null default 'previsto' check (status in ('previsto', 'recebido', 'atrasado', 'cancelado')),
  source text not null default 'manual' check (source in ('manual', 'assistant', 'open_finance')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  month date not null,
  category_key text not null references public.financial_categories(key),
  limit_cents bigint not null,
  spent_cents bigint not null default 0,
  alert_threshold numeric(4, 3) not null default 0.800,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, month, category_key)
);

create table if not exists public.financial_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  target_amount_cents bigint not null,
  current_amount_cents bigint not null default 0,
  deadline date,
  contribution_plan jsonb not null default '{}',
  status text not null default 'active' check (status in ('active', 'paused', 'done', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.financial_investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  connection_id uuid references public.financial_connections(id) on delete set null,
  institution_name text not null,
  type text not null,
  product text not null,
  balance_cents bigint not null default 0,
  invested_amount_cents bigint,
  provider_updated_at timestamptz,
  manual boolean not null default false,
  raw_payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.financial_sync_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  connection_id uuid not null references public.financial_connections(id) on delete cascade,
  kind text not null check (kind in ('initial', 'incremental', 'manual', 'webhook')),
  status text not null default 'queued' check (status in ('queued', 'running', 'done', 'failed', 'retrying')),
  cursor text,
  idempotency_key text not null,
  attempt integer not null default 0,
  next_attempt_at timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  error_code text,
  error_message text,
  stats jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(idempotency_key)
);

create table if not exists public.financial_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('pluggy', 'belvo')),
  event_id text not null,
  user_id uuid,
  connection_id uuid references public.financial_connections(id) on delete set null,
  event text not null,
  signature_valid boolean not null default false,
  idempotency_key text not null,
  sanitized_payload jsonb not null default '{}',
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(provider, event_id),
  unique(idempotency_key)
);

create table if not exists public.financial_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  insight_type text not null,
  title text not null,
  body text not null,
  confidence numeric(4, 3) not null default 0.700,
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  source_snapshot jsonb not null default '{}',
  requires_confirmation boolean not null default false,
  status text not null default 'new' check (status in ('new', 'accepted', 'dismissed', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  actor_type text not null default 'user' check (actor_type in ('user', 'system', 'provider', 'admin')),
  action text not null,
  resource_type text not null,
  resource_id text,
  request_id text,
  idempotency_key text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text,
  enabled boolean not null default false,
  audience text not null default 'internal',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.financial_categories(key, label, kind, color)
values
  ('alimentacao', 'Alimentação', 'saida', '#27DBFF'),
  ('mercado', 'Mercado', 'saida', '#278BFF'),
  ('transporte', 'Transporte', 'saida', '#806BFF'),
  ('moradia', 'Moradia', 'saida', '#8BDFFF'),
  ('saude', 'Saúde', 'saida', '#27DBFF'),
  ('educacao', 'Educação', 'saida', '#278BFF'),
  ('lazer', 'Lazer', 'saida', '#806BFF'),
  ('viagens', 'Viagens', 'saida', '#8BDFFF'),
  ('compras', 'Compras', 'saida', '#278BFF'),
  ('servicos', 'Serviços', 'saida', '#27DBFF'),
  ('assinaturas', 'Assinaturas', 'saida', '#806BFF'),
  ('impostos', 'Impostos', 'saida', '#8BDFFF'),
  ('transferencias', 'Transferências', 'ambos', '#A8C0D8'),
  ('investimentos', 'Investimentos', 'ambos', '#27DBFF'),
  ('salario', 'Salário', 'entrada', '#8BDFFF'),
  ('vendas', 'Vendas', 'entrada', '#278BFF'),
  ('outras_entradas', 'Outras entradas', 'entrada', '#A8C0D8'),
  ('outros_gastos', 'Outros gastos', 'saida', '#A8C0D8')
on conflict (key) do nothing;

insert into public.feature_flags(key, description, enabled, audience)
values
  ('open_finance_sandbox', 'Habilita fluxo Open Finance sandbox com dados claramente marcados.', true, 'all'),
  ('belvo_provider', 'Provider Belvo preparado para futura ativacao.', false, 'internal'),
  ('payment_initiation', 'Iniciacao de pagamento permanece desligada nesta fase.', false, 'internal')
on conflict (key) do nothing;

create index if not exists milestones_user_goal_idx on public.milestones(user_id, goal_id);
create index if not exists routine_items_routine_position_idx on public.routine_items(routine_id, position);
create index if not exists subtasks_task_position_idx on public.subtasks(task_id, position);
create index if not exists assistant_agents_user_key_idx on public.assistant_agents(user_id, key);
create index if not exists weekly_reviews_user_week_idx on public.weekly_reviews(user_id, week_starts_on desc);
create index if not exists financial_connections_user_status_idx on public.financial_connections(user_id, status);
create index if not exists financial_consents_user_connection_idx on public.financial_consents(user_id, connection_id);
create index if not exists financial_accounts_user_connection_idx on public.financial_accounts(user_id, connection_id);
create index if not exists financial_balances_user_account_idx on public.financial_balances(user_id, account_id);
create index if not exists financial_transactions_user_date_idx on public.financial_transactions(user_id, transaction_date desc);
create index if not exists financial_transactions_user_category_idx on public.financial_transactions(user_id, category_key);
create index if not exists financial_transaction_raw_user_connection_idx on public.financial_transaction_raw(user_id, connection_id);
create index if not exists credit_cards_user_connection_idx on public.credit_cards(user_id, connection_id);
create index if not exists credit_card_bills_user_due_idx on public.credit_card_bills(user_id, due_date);
create index if not exists financial_subscriptions_user_next_idx on public.financial_subscriptions(user_id, next_charge_date);
create index if not exists financial_commitments_user_due_idx on public.financial_commitments(user_id, due_date, status);
create index if not exists financial_receivables_user_expected_idx on public.financial_receivables(user_id, expected_date, status);
create index if not exists budgets_user_month_idx on public.budgets(user_id, month);
create index if not exists financial_goals_user_status_idx on public.financial_goals(user_id, status);
create index if not exists financial_investments_user_connection_idx on public.financial_investments(user_id, connection_id);
create index if not exists financial_sync_jobs_connection_status_idx on public.financial_sync_jobs(connection_id, status);
create index if not exists financial_webhook_events_provider_event_idx on public.financial_webhook_events(provider, event_id);
create index if not exists financial_insights_user_status_idx on public.financial_insights(user_id, status, created_at desc);
create index if not exists audit_logs_user_created_idx on public.audit_logs(user_id, created_at desc);
create index if not exists feature_flags_key_enabled_idx on public.feature_flags(key, enabled);

alter table public.profiles enable row level security;
alter table public.milestones enable row level security;
alter table public.routine_items enable row level security;
alter table public.subtasks enable row level security;
alter table public.assistant_agents enable row level security;
alter table public.weekly_reviews enable row level security;
alter table public.financial_institutions enable row level security;
alter table public.financial_connections enable row level security;
alter table public.financial_consents enable row level security;
alter table public.financial_accounts enable row level security;
alter table public.financial_balances enable row level security;
alter table public.financial_transaction_raw enable row level security;
alter table public.financial_categories enable row level security;
alter table public.financial_transactions enable row level security;
alter table public.financial_category_rules enable row level security;
alter table public.credit_cards enable row level security;
alter table public.credit_card_bills enable row level security;
alter table public.credit_card_transactions enable row level security;
alter table public.financial_subscriptions enable row level security;
alter table public.financial_commitments enable row level security;
alter table public.financial_receivables enable row level security;
alter table public.budgets enable row level security;
alter table public.financial_goals enable row level security;
alter table public.financial_investments enable row level security;
alter table public.financial_sync_jobs enable row level security;
alter table public.financial_webhook_events enable row level security;
alter table public.financial_insights enable row level security;
alter table public.audit_logs enable row level security;
alter table public.feature_flags enable row level security;

create policy "users manage own personal os profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "users manage own milestones" on public.milestones for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own assistant agents" on public.assistant_agents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own weekly reviews" on public.weekly_reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "financial institutions are readable" on public.financial_institutions for select using (true);
create policy "financial categories are readable" on public.financial_categories for select using (true);
create policy "feature flags are readable" on public.feature_flags for select using (true);
create policy "users read own audit logs" on public.audit_logs for select using (auth.uid() = user_id);
create policy "system can insert audit logs" on public.audit_logs for insert with check (true);

create policy "users manage routine items through routines" on public.routine_items for all using (
  exists (
    select 1 from public.routines
    where routines.id = routine_items.routine_id and routines.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.routines
    where routines.id = routine_items.routine_id and routines.user_id = auth.uid()
  )
);

create policy "users manage subtasks through tasks" on public.subtasks for all using (
  exists (
    select 1 from public.tasks
    where tasks.id = subtasks.task_id and tasks.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.tasks
    where tasks.id = subtasks.task_id and tasks.user_id = auth.uid()
  )
);

create policy "users manage own financial connections" on public.financial_connections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial consents" on public.financial_consents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial accounts" on public.financial_accounts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial balances" on public.financial_balances for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial raw transactions" on public.financial_transaction_raw for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial transactions" on public.financial_transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial category rules" on public.financial_category_rules for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own credit cards" on public.credit_cards for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own credit card bills" on public.credit_card_bills for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own credit card transactions" on public.credit_card_transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial subscriptions" on public.financial_subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial commitments" on public.financial_commitments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial receivables" on public.financial_receivables for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own budgets" on public.budgets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial goals" on public.financial_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial investments" on public.financial_investments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial sync jobs" on public.financial_sync_jobs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users read own financial webhook events" on public.financial_webhook_events for select using (auth.uid() = user_id);
create policy "system inserts financial webhook events" on public.financial_webhook_events for insert with check (true);
create policy "users manage own financial insights" on public.financial_insights for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
