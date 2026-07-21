create extension if not exists "pgcrypto";

create table if not exists public.diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  anonymous_id text not null,
  user_id uuid,
  status text not null default 'started',
  virada_index integer,
  main_blocker text,
  confidence integer,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.diagnostic_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.diagnostic_sessions(id) on delete cascade,
  question_key text not null,
  pillar text not null,
  value integer not null check (value between 1 and 5),
  created_at timestamptz not null default now(),
  unique(session_id, question_key)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.diagnostic_sessions(id) on delete set null,
  email text not null,
  name text not null,
  age_range text,
  main_pain text,
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  provider text not null default 'mercado-pago',
  provider_payment_id text unique,
  plan_key text not null,
  status text not null,
  amount_cents integer not null,
  idempotency_key text not null unique,
  raw_event jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.diagnostic_sessions(id) on delete cascade,
  payment_id uuid references public.payments(id) on delete set null,
  status text not null default 'queued',
  content jsonb,
  pdf_path text,
  created_at timestamptz not null default now(),
  ready_at timestamptz
);

create table if not exists public.daily_actions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  day integer not null check (day between 1 and 30),
  title text not null,
  pillar text not null,
  completed_at timestamptz
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  week integer not null,
  answers jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.consent_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  consent_type text not null,
  granted boolean not null,
  policy_version text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  body text not null,
  source text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid,
  action text not null,
  resource text not null,
  before jsonb,
  after jsonb,
  request_id text,
  created_at timestamptz not null default now()
);

alter table public.diagnostic_sessions enable row level security;
alter table public.diagnostic_answers enable row level security;
alter table public.leads enable row level security;
alter table public.payments enable row level security;
alter table public.reports enable row level security;
alter table public.daily_actions enable row level security;
alter table public.checkins enable row level security;
alter table public.consent_events enable row level security;
alter table public.testimonials enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "users can read own sessions" on public.diagnostic_sessions for select using (auth.uid() = user_id);
create policy "users can read own reports" on public.reports for select using (
  exists (
    select 1 from public.diagnostic_sessions ds
    where ds.id = reports.session_id and ds.user_id = auth.uid()
  )
);
create policy "approved testimonials are public" on public.testimonials for select using (approved = true);
