alter table public.payments
  add column if not exists user_id uuid,
  add column if not exists email text,
  add column if not exists external_reference text,
  add column if not exists paid_at timestamptz,
  add column if not exists access_expires_at timestamptz;

create table if not exists public.user_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  plan_key text not null,
  status text not null default 'pending' check (status in ('active', 'pending', 'cancelled')),
  source text not null default 'payment' check (source in ('payment', 'admin', 'migration')),
  provider text not null default 'mercado-pago',
  provider_payment_id text,
  payment_id uuid references public.payments(id) on delete set null,
  external_reference text,
  starts_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider, provider_payment_id)
);

create index if not exists payments_user_status_idx on public.payments(user_id, status);
create index if not exists payments_email_status_idx on public.payments(lower(email), status);
create index if not exists user_entitlements_user_status_idx on public.user_entitlements(user_id, status);
create index if not exists user_entitlements_email_status_idx on public.user_entitlements(lower(email), status);
create index if not exists user_entitlements_provider_payment_idx on public.user_entitlements(provider, provider_payment_id);

alter table public.user_entitlements enable row level security;

create policy "users read own entitlements" on public.user_entitlements for select using (
  auth.uid() = user_id
  or lower(coalesce(email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
);
