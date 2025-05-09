
-- Enable RLS
alter table public.profiles enable row level security;

-- Create agents table
create table public.agent_configs (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  model text,
  frequency jsonb not null default '{"interval": 1, "unit": "days"}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  is_active boolean default false
);

-- Create agent tasks table
create table public.agent_tasks (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references public.agent_configs not null,
  task_type text not null,
  status text not null default 'scheduled',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  result jsonb
);

-- Create agent logs table
create table public.agent_logs (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references public.agent_configs not null,
  level text not null default 'info',
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb
);

-- Set up Row Level Security (RLS) policies
create policy "Users can only see their own agents"
  on agent_configs for select
  using (auth.uid() = user_id);

create policy "Users can only insert their own agents"
  on agent_configs for insert
  with check (auth.uid() = user_id);

create policy "Users can only update their own agents"
  on agent_configs for update
  using (auth.uid() = user_id);

create policy "Users can only delete their own agents"
  on agent_configs for delete
  using (auth.uid() = user_id);

-- RLS for tasks
create policy "Users can only see tasks for their agents"
  on agent_tasks for select
  using (exists (
    select 1 from agent_configs
    where agent_configs.id = agent_tasks.agent_id
    and agent_configs.user_id = auth.uid()
  ));

-- RLS for logs
create policy "Users can only see logs for their agents"
  on agent_logs for select
  using (exists (
    select 1 from agent_configs
    where agent_configs.id = agent_logs.agent_id
    and agent_configs.user_id = auth.uid()
  ));

-- Enable RLS on all tables
alter table public.agent_configs enable row level security;
alter table public.agent_tasks enable row level security;
alter table public.agent_logs enable row level security;
