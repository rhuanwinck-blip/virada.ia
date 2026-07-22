create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  area text not null,
  reason text,
  deadline date,
  indicator text,
  progress integer not null default 0 check (progress between 0 and 100),
  priority integer not null default 3 check (priority between 1 and 5),
  status text not null default 'active',
  next_step text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.routine_blocks (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  period text not null,
  title text not null,
  duration_minutes integer not null check (duration_minutes between 1 and 480),
  recurrence text,
  minimal_version text,
  is_flexible boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  pillar text not null,
  minimal_version text,
  target_frequency text not null default 'daily',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habit_entries (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  entry_date date not null,
  completed boolean not null default false,
  difficulty text,
  note text,
  created_at timestamptz not null default now(),
  unique(habit_id, entry_date)
);

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  intention text not null,
  planned_minutes integer not null check (planned_minutes between 1 and 240),
  actual_minutes integer not null default 0 check (actual_minutes between 0 and 240),
  interruptions integer not null default 0 check (interruptions >= 0),
  reflection text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.financial_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category text not null,
  amount_cents integer not null check (amount_cents >= 0),
  entry_date date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_priorities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  quadrant text not null,
  impact integer not null default 3 check (impact between 1 and 5),
  effort integer not null default 3 check (effort between 1 and 5),
  status text not null default 'suggested',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  reason text not null,
  evidence text,
  impact text not null,
  difficulty text not null,
  estimated_minutes integer,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  acted_at timestamptz
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null default 'Guia Virada',
  context_version text not null default 'v1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  citations jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists public.plan_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  report_id uuid references public.reports(id) on delete set null,
  version integer not null,
  reason text,
  before_snapshot jsonb,
  after_snapshot jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(user_id, version)
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  key text not null,
  title text not null,
  detail text,
  unlocked_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, key)
);

create table if not exists public.library_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  pillar text not null,
  minutes integer not null check (minutes between 1 and 60),
  body text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  kind text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key,
  reminder_time time,
  start_date date,
  reduced_motion boolean not null default false,
  email_notifications boolean not null default true,
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dashboard_widgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  widget_key text not null,
  position integer not null default 0,
  is_visible boolean not null default true,
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, widget_key)
);

create index if not exists goals_user_status_idx on public.goals(user_id, status);
create index if not exists routines_user_status_idx on public.routines(user_id, status);
create index if not exists routine_blocks_routine_position_idx on public.routine_blocks(routine_id, position);
create index if not exists habits_user_pillar_idx on public.habits(user_id, pillar);
create index if not exists habit_entries_habit_date_idx on public.habit_entries(habit_id, entry_date desc);
create index if not exists focus_sessions_user_started_idx on public.focus_sessions(user_id, started_at desc);
create index if not exists financial_entries_user_date_idx on public.financial_entries(user_id, entry_date desc);
create index if not exists user_priorities_user_status_idx on public.user_priorities(user_id, status);
create index if not exists recommendations_user_status_idx on public.recommendations(user_id, status);
create index if not exists ai_conversations_user_updated_idx on public.ai_conversations(user_id, updated_at desc);
create index if not exists ai_messages_conversation_created_idx on public.ai_messages(conversation_id, created_at);
create index if not exists plan_versions_user_version_idx on public.plan_versions(user_id, version desc);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);

alter table public.goals enable row level security;
alter table public.routines enable row level security;
alter table public.routine_blocks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_entries enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.financial_entries enable row level security;
alter table public.user_priorities enable row level security;
alter table public.recommendations enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.plan_versions enable row level security;
alter table public.achievements enable row level security;
alter table public.library_items enable row level security;
alter table public.notifications enable row level security;
alter table public.user_preferences enable row level security;
alter table public.dashboard_widgets enable row level security;

create policy "users manage own goals" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own routines" on public.routines for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own habits" on public.habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own focus sessions" on public.focus_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own financial entries" on public.financial_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own priorities" on public.user_priorities for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own recommendations" on public.recommendations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own conversations" on public.ai_conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own plan versions" on public.plan_versions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own achievements" on public.achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "published library items are readable" on public.library_items for select using (status = 'published');
create policy "users manage own notifications" on public.notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own preferences" on public.user_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own dashboard widgets" on public.dashboard_widgets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage blocks through routines" on public.routine_blocks for all using (
  exists (
    select 1 from public.routines
    where routines.id = routine_blocks.routine_id and routines.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.routines
    where routines.id = routine_blocks.routine_id and routines.user_id = auth.uid()
  )
);

create policy "users manage habit entries through habits" on public.habit_entries for all using (
  exists (
    select 1 from public.habits
    where habits.id = habit_entries.habit_id and habits.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.habits
    where habits.id = habit_entries.habit_id and habits.user_id = auth.uid()
  )
);

create policy "users manage messages through conversations" on public.ai_messages for all using (
  exists (
    select 1 from public.ai_conversations
    where ai_conversations.id = ai_messages.conversation_id and ai_conversations.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.ai_conversations
    where ai_conversations.id = ai_messages.conversation_id and ai_conversations.user_id = auth.uid()
  )
);
