-- Debt Angel — application + plan persistence (002_apply)
-- Run after enabling Supabase Auth (email, magic link, or anonymous sign-in).

-- ── Applications ─────────────────────────────────────────────────────────────

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  -- Contact
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  zip text not null check (char_length(zip) = 5),

  -- Monthly picture
  current_monthly_payment numeric(12, 2) not null check (current_monthly_payment >= 0),
  monthly_budget numeric(12, 2) not null check (monthly_budget >= 0),
  employment text not null,

  -- Goals & qualification
  goal text not null,
  credit_priority text not null,
  timeline text not null,
  consent_at timestamptz not null default now(),

  -- Server-computed plan (authoritative — never trust client-side numbers)
  total_debt numeric(12, 2) not null,
  plan_settlement_low_pct numeric(5, 4) not null,
  plan_settlement_high_pct numeric(5, 4) not null,
  plan_settled_low numeric(12, 2) not null,
  plan_settled_high numeric(12, 2) not null,
  plan_fee_low numeric(12, 2) not null,
  plan_fee_high numeric(12, 2) not null,
  plan_cost_low numeric(12, 2) not null,
  plan_cost_high numeric(12, 2) not null,
  plan_cost_mid numeric(12, 2) not null,
  plan_savings_low numeric(12, 2) not null,
  plan_savings_high numeric(12, 2) not null,
  plan_savings_mid numeric(12, 2) not null,
  plan_months_low int not null,
  plan_months_high int not null,
  plan_suggested_monthly numeric(12, 2) not null,
  plan_minimum_only_total numeric(12, 2) not null,
  plan_minimum_only_months int not null,
  plan_budget_fit text not null,
  plan_comparison jsonb not null,

  status text not null default 'submitted'
    check (status in ('submitted', 'reviewing', 'accepted', 'declined', 'withdrawn')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists applications_user_id_idx on public.applications (user_id);
create index if not exists applications_created_at_idx on public.applications (created_at desc);

-- ── Tradelines (per application) ───────────────────────────────────────────

create table if not exists public.application_tradelines (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,

  creditor text not null,
  type text not null,
  balance numeric(12, 2) not null check (balance >= 0),
  credit_limit numeric(12, 2),
  apr numeric(6, 2) not null check (apr >= 0),
  min_payment numeric(12, 2) not null check (min_payment >= 0),
  opened text,
  status text not null,

  created_at timestamptz not null default now()
);

create index if not exists application_tradelines_application_id_idx
  on public.application_tradelines (application_id);

-- ── updated_at trigger ───────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────

alter table public.applications enable row level security;
alter table public.application_tradelines enable row level security;

-- Applications: users may only read and insert their own rows.
create policy "applications_select_own"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "applications_insert_own"
  on public.applications for insert
  with check (auth.uid() = user_id);

-- Tradelines: users may only read and insert rows tied to their user_id.
create policy "tradelines_select_own"
  on public.application_tradelines for select
  using (auth.uid() = user_id);

create policy "tradelines_insert_own"
  on public.application_tradelines for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );
