-- Participants (students) registry for result entry
create table public.participants (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  full_name text not null,
  full_name_ml text,
  class_name text,
  chest_number text,
  created_at timestamptz not null default now()
);

create index participants_school_idx on public.participants (school_id);
create index participants_name_trgm on public.participants using gin (full_name gin_trgm_ops);

alter table public.result_entries
  add column if not exists participant_id uuid references public.participants (id) on delete set null;

alter table public.participants enable row level security;

create policy participants_read on public.participants for select using (true);
create policy participants_write on public.participants for all
  using (private.has_role(array['super_admin','results_operator']::public.app_role[]))
  with check (private.has_role(array['super_admin','results_operator']::public.app_role[]));

notify pgrst, 'reload schema';
