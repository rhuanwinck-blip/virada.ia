alter table public.financial_investments
  add column if not exists provider_investment_id text;

update public.financial_investments
set provider_investment_id = id::text
where provider_investment_id is null;

alter table public.financial_subscriptions
  add column if not exists source_fingerprint text;

update public.financial_subscriptions
set source_fingerprint = md5(concat(user_id::text, ':', service, ':', amount_cents::text, ':', frequency, ':', coalesce(account_or_card, '') ))
where source_fingerprint is null;

alter table public.financial_investments
  alter column provider_investment_id set not null;

alter table public.financial_subscriptions
  alter column source_fingerprint set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'financial_investments_connection_provider_key'
  ) then
    alter table public.financial_investments
      add constraint financial_investments_connection_provider_key unique (connection_id, provider_investment_id);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'financial_subscriptions_user_fingerprint_key'
  ) then
    alter table public.financial_subscriptions
      add constraint financial_subscriptions_user_fingerprint_key unique (user_id, source_fingerprint);
  end if;
end $$;

insert into public.feature_flags(key, description, enabled, audience, metadata)
values
  (
    'open_finance_background_sync',
    'Habilita sincronizacao backend protegida por CRON_SECRET para dados financeiros read-only.',
    false,
    'internal',
    '{"requires": ["CRON_SECRET", "SUPABASE_SERVICE_ROLE_KEY", "PLUGGY_CLIENT_ID", "PLUGGY_CLIENT_SECRET"]}'::jsonb
  )
on conflict (key) do update
set description = excluded.description,
    metadata = excluded.metadata,
    updated_at = now();
