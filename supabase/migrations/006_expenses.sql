-- Debt Angel — self-reported essential expenses on applications (006_expenses)
-- Additive and safe. The raw per-category map lives in a flexible JSONB column
-- so new categories need no future migration; the total is a server-normalized,
-- authoritative numeric (mirrors income_monthly_net). Existing rows backfill as
-- null (treated as "not provided"). No RLS changes: the existing
-- applications_insert_own / _update_own / _select_own policies already cover
-- these columns. Independent of the CRS credit pull.

alter table public.applications
  add column if not exists essential_expenses jsonb,
  add column if not exists essential_expenses_total numeric(12, 2)
    check (essential_expenses_total is null or essential_expenses_total >= 0);
