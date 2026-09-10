-- Simplify to three roles + reporting media section

-- Run add_war_room_media_team_roles migration first if applying manually.
update public.profiles
set role = 'war_room'
where role::text in (
  'results_operator',
  'results_verifier',
  'reporter',
  'editor',
  'media_moderator'
);

update public.profiles
set role = 'media_team'
where role::text = 'photographer';

do $$ begin
  create type public.media_section as enum ('gallery', 'reporting');
exception when duplicate_object then null;
end $$;

alter table public.media
  add column if not exists section public.media_section not null default 'gallery';

-- Replace handle_new_user default role
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned public.app_role;
begin
  assigned := coalesce(
    (new.raw_app_meta_data->>'role')::public.app_role,
    'war_room'
  );
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    assigned
  );
  return new;
end;
$$;

-- RLS: schools/catalog — super_admin only
drop policy if exists schools_write on public.schools;
create policy schools_write on public.schools for all
  using (private.has_role(array['super_admin']::public.app_role[]))
  with check (private.has_role(array['super_admin']::public.app_role[]));

drop policy if exists programmes_write on public.programmes;
create policy programmes_write on public.programmes for all
  using (private.has_role(array['super_admin']::public.app_role[]))
  with check (private.has_role(array['super_admin']::public.app_role[]));

drop policy if exists scheduled_events_write on public.scheduled_events;
create policy scheduled_events_write on public.scheduled_events for all
  using (private.has_role(array['super_admin','war_room']::public.app_role[]))
  with check (private.has_role(array['super_admin','war_room']::public.app_role[]));

drop policy if exists participants_write on public.participants;
create policy participants_write on public.participants for all
  using (private.has_role(array['super_admin']::public.app_role[]))
  with check (private.has_role(array['super_admin']::public.app_role[]));

-- Results: war_room + super_admin
drop policy if exists result_sets_operator_write on public.result_sets;
create policy result_sets_operator_write on public.result_sets for insert
  with check (private.has_role(array['super_admin','war_room']::public.app_role[]));

drop policy if exists result_sets_operator_update on public.result_sets;
create policy result_sets_operator_update on public.result_sets for update
  using (
    private.has_role(array['super_admin','war_room']::public.app_role[])
    and status in ('draft','entered','correction_draft')
  )
  with check (
    private.has_role(array['super_admin','war_room']::public.app_role[])
    and status in ('draft','entered','correction_draft','published','archived')
  );

drop policy if exists result_sets_verifier_update on public.result_sets;
create policy result_sets_verifier_update on public.result_sets for update
  using (private.has_role(array['super_admin','war_room']::public.app_role[]))
  with check (private.has_role(array['super_admin','war_room']::public.app_role[]));

drop policy if exists result_sets_staff_read on public.result_sets;
create policy result_sets_staff_read on public.result_sets for select
  using (private.has_role(array['super_admin','war_room']::public.app_role[]));

drop policy if exists result_entries_operator_write on public.result_entries;
create policy result_entries_operator_write on public.result_entries for all
  using (private.has_role(array['super_admin','war_room']::public.app_role[]))
  with check (private.has_role(array['super_admin','war_room']::public.app_role[]));

drop policy if exists result_entries_staff_read on public.result_entries;
create policy result_entries_staff_read on public.result_entries for select
  using (private.has_role(array['super_admin','war_room']::public.app_role[]));

-- Articles: war_room + media_team + super_admin
drop policy if exists articles_write on public.articles;
create policy articles_write on public.articles for all
  using (private.has_role(array['super_admin','war_room','media_team']::public.app_role[]))
  with check (private.has_role(array['super_admin','war_room','media_team']::public.app_role[]));

drop policy if exists articles_staff_read on public.articles;
create policy articles_staff_read on public.articles for select
  using (private.has_role(array['super_admin','war_room','media_team']::public.app_role[]));

-- Interviews: media_team + super_admin
drop policy if exists interviews_write on public.interviews;
create policy interviews_write on public.interviews for all
  using (private.has_role(array['super_admin','media_team']::public.app_role[]))
  with check (private.has_role(array['super_admin','media_team']::public.app_role[]));

drop policy if exists interviews_staff_read on public.interviews;
create policy interviews_staff_read on public.interviews for select
  using (private.has_role(array['super_admin','media_team']::public.app_role[]));

-- Media moderation + staff uploads
drop policy if exists media_moderator_update on public.media;
create policy media_moderator_update on public.media for update
  using (private.has_role(array['super_admin','war_room','media_team']::public.app_role[]))
  with check (private.has_role(array['super_admin','war_room','media_team']::public.app_role[]));

drop policy if exists media_photographer_insert on public.media;
create policy media_staff_insert on public.media for insert
  with check (
    private.has_role(array['super_admin','media_team']::public.app_role[])
    and status in ('pending','approved')
  );

drop policy if exists media_staff_read on public.media;
create policy media_staff_read on public.media for select
  using (private.has_role(array['super_admin','war_room','media_team']::public.app_role[]));

drop policy if exists audit_staff_read on public.audit_logs;
create policy audit_staff_read on public.audit_logs for select
  using (private.has_role(array['super_admin','war_room']::public.app_role[]));

notify pgrst, 'reload schema';
