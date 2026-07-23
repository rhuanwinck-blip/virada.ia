create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  description text,
  priority text not null default 'media' check (priority in ('critica', 'alta', 'media', 'baixa')),
  status text not null default 'pendente' check (status in ('pendente', 'em_andamento', 'concluida', 'atrasada', 'cancelada')),
  due_at timestamptz,
  scheduled_for timestamptz,
  duration_minutes integer check (duration_minutes between 1 and 1440),
  project_id uuid,
  responsible text,
  recurrence_rule text,
  notes text,
  subtasks jsonb not null default '[]',
  reminders jsonb not null default '[]',
  source text not null default 'assistant',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text,
  participants jsonb not null default '[]',
  recurrence_rule text,
  travel_minutes integer check (travel_minutes between 0 and 600),
  google_event_id text,
  source text not null default 'assistant',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  task_id uuid references public.tasks(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  title text not null,
  remind_at timestamptz not null,
  level text not null default 'on_time' check (level in ('early', 'near', 'on_time', 'after', 'reschedule')),
  channel text not null default 'painel' check (channel in ('painel', 'push', 'whatsapp', 'email', 'calendar')),
  status text not null default 'scheduled' check (status in ('scheduled', 'sent', 'snoozed', 'cancelled')),
  requires_confirmation boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  goal text not null,
  deadline date,
  progress integer not null default 0 check (progress between 0 and 100),
  status text not null default 'active' check (status in ('active', 'paused', 'done', 'cancelled')),
  files jsonb not null default '[]',
  notes text,
  responsible text,
  ai_suggestion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tasks
  add constraint tasks_project_id_fkey foreign key (project_id) references public.projects(id) on delete set null;

create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique(project_id, task_id)
);

create table if not exists public.inbox_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  kind text not null default 'text' check (kind in ('text', 'audio', 'file', 'idea', 'task', 'event', 'reminder')),
  raw_content text not null,
  attachment_url text,
  classification text,
  status text not null default 'new' check (status in ('new', 'classified', 'needs_info', 'confirmed', 'archived')),
  missing_fields jsonb not null default '[]',
  draft_action jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  waiting_for text,
  related_task_id uuid references public.tasks(id) on delete set null,
  check_at timestamptz not null,
  next_action text,
  channel text not null default 'painel' check (channel in ('painel', 'push', 'whatsapp', 'email')),
  status text not null default 'waiting' check (status in ('waiting', 'ready_to_nudge', 'done', 'cancelled')),
  requires_confirmation boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category text not null check (category in ('agenda', 'pessoas', 'locais', 'preferencias', 'prioridades')),
  label text not null,
  value text not null,
  source text not null default 'user',
  editable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.routines
  add column if not exists schedule text,
  add column if not exists duration_minutes integer check (duration_minutes is null or duration_minutes between 1 and 1440),
  add column if not exists channel text default 'painel',
  add column if not exists reduced_version text,
  add column if not exists paused_until timestamptz,
  add column if not exists reminder_enabled boolean not null default true;

alter table public.notifications
  add column if not exists channel text default 'painel',
  add column if not exists scheduled_for timestamptz,
  add column if not exists sent_at timestamptz,
  add column if not exists consent_required boolean not null default false,
  add column if not exists action_url text,
  add column if not exists metadata jsonb not null default '{}';

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  endpoint text not null,
  p256dh text,
  auth text,
  user_agent text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, endpoint)
);

create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  provider text not null check (provider in ('google_calendar', 'whatsapp', 'openai', 'web_push', 'email')),
  status text not null default 'needs_credentials' check (status in ('needs_credentials', 'ready', 'connected', 'disabled', 'error')),
  access_token_encrypted text,
  refresh_token_encrypted text,
  external_account_id text,
  settings jsonb not null default '{}',
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, provider)
);

create table if not exists public.assistant_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  conversation_id uuid,
  role text not null check (role in ('user', 'assistant', 'system', 'tool')),
  content text not null,
  channel text not null default 'text' check (channel in ('text', 'audio', 'system')),
  draft_action jsonb,
  confirmed_action_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_briefings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  briefing_date date not null,
  delivery_time time,
  summary text not null,
  first_event_id uuid references public.events(id) on delete set null,
  main_task_id uuid references public.tasks(id) on delete set null,
  conflicts jsonb not null default '[]',
  suggestions jsonb not null default '[]',
  delivered_channels jsonb not null default '[]',
  created_at timestamptz not null default now(),
  unique(user_id, briefing_date)
);

create table if not exists public.daily_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  review_date date not null,
  completed jsonb not null default '[]',
  pending jsonb not null default '[]',
  unexpected text,
  replan_snapshot jsonb not null default '{}',
  confirmed_by_user boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, review_date)
);

create index if not exists tasks_user_status_due_idx on public.tasks(user_id, status, due_at);
create index if not exists events_user_start_idx on public.events(user_id, starts_at);
create index if not exists reminders_user_remind_idx on public.reminders(user_id, remind_at, status);
create index if not exists projects_user_status_idx on public.projects(user_id, status);
create index if not exists project_tasks_project_position_idx on public.project_tasks(project_id, position);
create index if not exists inbox_items_user_status_idx on public.inbox_items(user_id, status, created_at desc);
create index if not exists follow_ups_user_check_idx on public.follow_ups(user_id, check_at, status);
create index if not exists user_memories_user_category_idx on public.user_memories(user_id, category);
create index if not exists push_subscriptions_user_enabled_idx on public.push_subscriptions(user_id, enabled);
create index if not exists integrations_user_provider_idx on public.integrations(user_id, provider);
create index if not exists assistant_messages_user_created_idx on public.assistant_messages(user_id, created_at desc);
create index if not exists daily_briefings_user_date_idx on public.daily_briefings(user_id, briefing_date desc);
create index if not exists daily_reviews_user_date_idx on public.daily_reviews(user_id, review_date desc);

alter table public.tasks enable row level security;
alter table public.events enable row level security;
alter table public.reminders enable row level security;
alter table public.projects enable row level security;
alter table public.project_tasks enable row level security;
alter table public.inbox_items enable row level security;
alter table public.follow_ups enable row level security;
alter table public.user_memories enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.integrations enable row level security;
alter table public.assistant_messages enable row level security;
alter table public.daily_briefings enable row level security;
alter table public.daily_reviews enable row level security;

create policy "users manage own assistant tasks" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own assistant events" on public.events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own assistant reminders" on public.reminders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own assistant projects" on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own inbox items" on public.inbox_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own follow ups" on public.follow_ups for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own memories" on public.user_memories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own push subscriptions" on public.push_subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own integrations" on public.integrations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own assistant messages" on public.assistant_messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own daily briefings" on public.daily_briefings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own daily reviews" on public.daily_reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage project task joins through project" on public.project_tasks for all using (
  exists (
    select 1 from public.projects
    where projects.id = project_tasks.project_id and projects.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.projects
    where projects.id = project_tasks.project_id and projects.user_id = auth.uid()
  )
);
