-- Debt Angel — magic-link account linking (003_auth)
-- Lets verified email users claim applications submitted under anonymous sessions.

create or replace function public.claim_applications_by_email()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  user_email text;
  claimed_count integer;
begin
  user_email := auth.jwt()->>'email';

  if user_email is null or auth.uid() is null then
    return 0;
  end if;

  -- Anonymous sessions cannot claim — they must verify the magic link first.
  if coalesce((auth.jwt()->>'is_anonymous')::boolean, false) = true then
    return 0;
  end if;

  update public.applications a
  set user_id = auth.uid()
  from auth.users u
  where lower(a.email) = lower(user_email)
    and a.user_id = u.id
    and u.id != auth.uid()
    and coalesce(u.is_anonymous, false) = true;

  get diagnostics claimed_count = row_count;
  return claimed_count;
end;
$$;

revoke all on function public.claim_applications_by_email() from public;
grant execute on function public.claim_applications_by_email() to authenticated;
