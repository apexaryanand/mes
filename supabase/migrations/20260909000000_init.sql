-- Kalolsavam Live schema
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon, authenticated;

create type public.app_role as enum (
  'super_admin',
  'results_operator',
  'results_verifier',
  'reporter',
  'media_moderator',
  'editor',
  'photographer'
);

create type public.event_status as enum (
  'upcoming',
  'live',
  'completed',
  'delayed',
  'cancelled'
);

create type public.result_set_status as enum (
  'draft',
  'entered',
  'verified',
  'published',
  'archived',
  'correction_draft'
);

create type public.grade_code as enum ('A', 'B', 'C');
create type public.media_kind as enum ('photo', 'video');
create type public.media_status as enum ('pending', 'approved', 'rejected');
create type public.item_kind as enum ('individual', 'group');
create type public.live_status as enum ('upcoming', 'live', 'concluded');

create table public.event_settings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null default 'mes-hss-irimbiliyam-2026',
  name_en text not null,
  name_ml text not null,
  venue_en text not null,
  venue_ml text not null,
  location_en text not null,
  location_ml text not null,
  start_date date not null,
  end_date date not null,
  current_day integer,
  live_status public.live_status not null default 'live',
  scoring_rules jsonb not null default '{
    "grade_points": {"A": 5, "B": 3, "C": 1},
    "rank_points": {"1": 0, "2": 0, "3": 0},
    "group_multiplier": 1,
    "grade_thresholds": {"A": 80, "B": 70, "C": 60},
    "max_marks": 100
  }'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  code text unique,
  name_en text not null,
  name_ml text not null,
  short_name text,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name_en text not null,
  name_ml text not null,
  sort_order integer not null default 0
);

create table public.programmes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  code text unique,
  name_en text not null,
  name_ml text not null,
  item_kind public.item_kind not null default 'individual',
  allows_multiple_per_school boolean not null default false
);

create table public.stages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_ml text not null,
  location_en text,
  location_ml text,
  sort_order integer not null default 0
);

create table public.scheduled_events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  programme_id uuid not null references public.programmes (id) on delete restrict,
  category_id uuid not null references public.categories (id) on delete restrict,
  stage_id uuid not null references public.stages (id) on delete restrict,
  day_number integer not null check (day_number between 1 and 3),
  event_date date not null,
  start_time time not null,
  end_time time,
  status public.event_status not null default 'upcoming',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (programme_id, category_id)
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role public.app_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.result_sets (
  id uuid primary key default gen_random_uuid(),
  scheduled_event_id uuid not null references public.scheduled_events (id) on delete cascade,
  version integer not null default 1,
  status public.result_set_status not null default 'draft',
  supersedes_id uuid references public.result_sets (id),
  entered_by uuid references public.profiles (id),
  verified_by uuid references public.profiles (id),
  published_by uuid references public.profiles (id),
  entered_at timestamptz,
  verified_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index result_sets_one_published
  on public.result_sets (scheduled_event_id)
  where status = 'published' and deleted_at is null;

create unique index result_sets_one_active_draft
  on public.result_sets (scheduled_event_id)
  where status in ('draft', 'entered', 'verified', 'correction_draft')
    and deleted_at is null;

create table public.result_entries (
  id uuid primary key default gen_random_uuid(),
  result_set_id uuid not null references public.result_sets (id) on delete cascade,
  school_id uuid not null references public.schools (id) on delete restrict,
  participant_name text,
  marks numeric(6,2) check (marks is null or (marks >= 0 and marks <= 100)),
  grade public.grade_code,
  rank integer check (rank is null or rank > 0),
  points numeric(8,2) not null default 0,
  created_at timestamptz not null default now(),
  unique (result_set_id, school_id)
);

create table public.school_standings (
  school_id uuid primary key references public.schools (id) on delete cascade,
  total_points numeric(10,2) not null default 0,
  grade_a_count integer not null default 0,
  grade_b_count integer not null default 0,
  grade_c_count integer not null default 0,
  wins_count integer not null default 0,
  overall_rank integer,
  updated_at timestamptz not null default now()
);

create table public.live_updates (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid references public.stages (id) on delete set null,
  scheduled_event_id uuid references public.scheduled_events (id) on delete set null,
  reporter_id uuid references public.profiles (id),
  reporter_name text not null,
  body text not null check (char_length(body) between 1 and 2000),
  media_url text,
  media_kind public.media_kind,
  created_at timestamptz not null default now(),
  is_removed boolean not null default false
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_ml text not null,
  excerpt_en text not null default '',
  excerpt_ml text not null default '',
  body_en text not null default '',
  body_ml text not null default '',
  cover_image_url text,
  author_name text not null,
  category text not null default 'News',
  related_event_id uuid references public.scheduled_events (id) on delete set null,
  related_school_id uuid references public.schools (id) on delete set null,
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  winner_name text not null,
  school_id uuid not null references public.schools (id) on delete restrict,
  programme_id uuid not null references public.programmes (id) on delete restrict,
  scheduled_event_id uuid references public.scheduled_events (id) on delete set null,
  rank integer,
  description_en text not null default '',
  description_ml text not null default '',
  video_url text not null,
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  kind public.media_kind not null,
  title_en text not null default '',
  title_ml text not null default '',
  caption_en text,
  caption_ml text,
  url text not null,
  thumbnail_url text,
  storage_path text,
  scheduled_event_id uuid references public.scheduled_events (id) on delete set null,
  school_id uuid references public.schools (id) on delete set null,
  submitted_by_name text,
  status public.media_status not null default 'pending',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  moderated_by uuid references public.profiles (id)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id),
  actor_name text not null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

create index scheduled_events_stage_day_idx
  on public.scheduled_events (stage_id, day_number, status, start_time);
create index scheduled_events_status_idx on public.scheduled_events (status);
create index result_sets_event_status_idx on public.result_sets (scheduled_event_id, status);
create index result_entries_school_idx on public.result_entries (school_id);
create index result_entries_set_idx on public.result_entries (result_set_id);
create index live_updates_created_idx on public.live_updates (created_at desc);
create index live_updates_stage_idx on public.live_updates (stage_id);
create index articles_published_idx on public.articles (published_at desc) where is_published;
create index media_status_idx on public.media (status, created_at desc);
create index schools_name_trgm on public.schools using gin (name_en gin_trgm_ops);
create index programmes_name_trgm on public.programmes using gin (name_en gin_trgm_ops);
create index articles_title_trgm on public.articles using gin (title_en gin_trgm_ops);
create index live_updates_body_trgm on public.live_updates using gin (body gin_trgm_ops);

-- Role helpers (private, security definer)
create or replace function private.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles
  where id = auth.uid() and is_active = true
$$;

create or replace function private.has_role(roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(private.current_role() = any(roles), false)
$$;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select private.current_role() is not null
$$;

create or replace function public.compute_entry_points(
  p_grade public.grade_code,
  p_rank integer,
  p_item_kind public.item_kind
)
returns numeric
language plpgsql
stable
as $$
declare
  rules jsonb;
  points numeric := 0;
  multiplier numeric := 1;
begin
  select scoring_rules into rules from public.event_settings limit 1;
  if rules is null then
    rules := '{
      "grade_points": {"A": 5, "B": 3, "C": 1},
      "rank_points": {"1": 0, "2": 0, "3": 0},
      "group_multiplier": 1
    }'::jsonb;
  end if;
  if p_grade is not null then
    points := points + coalesce((rules->'grade_points'->>p_grade::text)::numeric, 0);
  end if;
  if p_rank between 1 and 3 then
    points := points + coalesce((rules->'rank_points'->>p_rank::text)::numeric, 0);
  end if;
  if p_item_kind = 'group' then
    multiplier := coalesce((rules->>'group_multiplier')::numeric, 1);
  end if;
  return points * multiplier;
end;
$$;

create or replace function private.refresh_school_standings()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.school_standings;

  insert into public.school_standings (
    school_id, total_points, grade_a_count, grade_b_count, grade_c_count, wins_count, overall_rank, updated_at
  )
  with published as (
    select e.school_id, e.grade, e.rank, e.points
    from public.result_entries e
    join public.result_sets s on s.id = e.result_set_id
    where s.status = 'published' and s.deleted_at is null
  ),
  aggregated as (
    select
      sch.id as school_id,
      coalesce(sum(p.points), 0) as total_points,
      count(*) filter (where p.grade = 'A')::int as grade_a_count,
      count(*) filter (where p.grade = 'B')::int as grade_b_count,
      count(*) filter (where p.grade = 'C')::int as grade_c_count,
      count(*) filter (where p.rank = 1)::int as wins_count
    from public.schools sch
    left join published p on p.school_id = sch.id
    group by sch.id
  ),
  ranked as (
    select
      a.*,
      case
        when a.total_points > 0 then
          rank() over (
            order by a.total_points desc, a.grade_a_count desc, a.wins_count desc
          )
        else null
      end as overall_rank
    from aggregated a
  )
  select school_id, total_points, grade_a_count, grade_b_count, grade_c_count, wins_count, overall_rank, now()
  from ranked;
end;
$$;

create or replace function private.apply_entry_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  item public.item_kind;
  set_status public.result_set_status;
begin
  select rs.status, pr.item_kind
    into set_status, item
  from public.result_sets rs
  join public.scheduled_events se on se.id = rs.scheduled_event_id
  join public.programmes pr on pr.id = se.programme_id
  where rs.id = new.result_set_id;

  if set_status = 'published' then
    new.points := public.compute_entry_points(new.grade, new.rank, coalesce(item, 'individual'));
  else
    new.points := 0;
  end if;
  return new;
end;
$$;

create trigger result_entries_points
before insert or update on public.result_entries
for each row execute function private.apply_entry_points();

create or replace function private.on_result_set_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE'
     and new.status = 'published'
     and (old.status is distinct from 'published') then
    update public.result_entries e
    set points = public.compute_entry_points(
      e.grade,
      e.rank,
      pr.item_kind
    )
    from public.scheduled_events se
    join public.programmes pr on pr.id = se.programme_id
    where e.result_set_id = new.id
      and se.id = new.scheduled_event_id;

    if new.supersedes_id is not null then
      update public.result_sets
      set status = 'archived', updated_at = now()
      where id = new.supersedes_id;
    end if;
  end if;

  perform private.refresh_school_standings();
  return new;
end;
$$;

create trigger result_sets_standings
after insert or update or delete on public.result_sets
for each row execute function private.on_result_set_change();

create or replace function private.write_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (actor_id, actor_name, action, entity_type, entity_id, details)
  values (
    auth.uid(),
    coalesce((select display_name from public.profiles where id = auth.uid()), 'system'),
    lower(tg_op) || '_' || tg_table_name,
    tg_table_name,
    coalesce(new.id, old.id),
    jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new))
  );
  return coalesce(new, old);
end;
$$;

create trigger result_sets_audit
after insert or update on public.result_sets
for each row execute function private.write_audit();

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
    'reporter'
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function private.sync_role_to_app_metadata()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update auth.users
  set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', new.role::text)
  where id = new.id;
  return new;
end;
$$;

create trigger profiles_sync_app_metadata
after insert or update of role on public.profiles
for each row execute function private.sync_role_to_app_metadata();

-- RLS
alter table public.event_settings enable row level security;
alter table public.schools enable row level security;
alter table public.categories enable row level security;
alter table public.programmes enable row level security;
alter table public.stages enable row level security;
alter table public.scheduled_events enable row level security;
alter table public.profiles enable row level security;
alter table public.result_sets enable row level security;
alter table public.result_entries enable row level security;
alter table public.school_standings enable row level security;
alter table public.live_updates enable row level security;
alter table public.articles enable row level security;
alter table public.interviews enable row level security;
alter table public.media enable row level security;
alter table public.audit_logs enable row level security;

create policy event_settings_read on public.event_settings for select using (true);
create policy event_settings_write on public.event_settings for all
  using (private.has_role(array['super_admin']::public.app_role[]))
  with check (private.has_role(array['super_admin']::public.app_role[]));

create policy schools_read on public.schools for select using (true);
create policy schools_write on public.schools for all
  using (private.has_role(array['super_admin','results_operator']::public.app_role[]))
  with check (private.has_role(array['super_admin','results_operator']::public.app_role[]));

create policy categories_read on public.categories for select using (true);
create policy categories_write on public.categories for all
  using (private.has_role(array['super_admin']::public.app_role[]))
  with check (private.has_role(array['super_admin']::public.app_role[]));

create policy programmes_read on public.programmes for select using (true);
create policy programmes_write on public.programmes for all
  using (private.has_role(array['super_admin','results_operator']::public.app_role[]))
  with check (private.has_role(array['super_admin','results_operator']::public.app_role[]));

create policy stages_read on public.stages for select using (true);
create policy stages_write on public.stages for all
  using (private.has_role(array['super_admin']::public.app_role[]))
  with check (private.has_role(array['super_admin']::public.app_role[]));

create policy scheduled_events_read on public.scheduled_events for select using (true);
create policy scheduled_events_write on public.scheduled_events for all
  using (private.has_role(array['super_admin','results_operator','results_verifier']::public.app_role[]))
  with check (private.has_role(array['super_admin','results_operator','results_verifier']::public.app_role[]));

create policy profiles_self on public.profiles for select
  using (id = auth.uid() or private.is_staff());
create policy profiles_admin on public.profiles for all
  using (private.has_role(array['super_admin']::public.app_role[]))
  with check (private.has_role(array['super_admin']::public.app_role[]));

create policy result_sets_public_read on public.result_sets for select
  using (status = 'published' and deleted_at is null);
create policy result_sets_staff_read on public.result_sets for select
  using (private.has_role(array['super_admin','results_operator','results_verifier']::public.app_role[]));
create policy result_sets_operator_write on public.result_sets for insert
  with check (private.has_role(array['super_admin','results_operator']::public.app_role[]));
create policy result_sets_operator_update on public.result_sets for update
  using (
    private.has_role(array['super_admin','results_operator']::public.app_role[])
    and status in ('draft','entered','correction_draft')
  )
  with check (
    private.has_role(array['super_admin','results_operator']::public.app_role[])
    and status in ('draft','entered','correction_draft')
  );
create policy result_sets_verifier_update on public.result_sets for update
  using (private.has_role(array['super_admin','results_verifier']::public.app_role[]))
  with check (private.has_role(array['super_admin','results_verifier']::public.app_role[]));

create policy result_entries_public_read on public.result_entries for select
  using (
    exists (
      select 1 from public.result_sets s
      where s.id = result_set_id and s.status = 'published' and s.deleted_at is null
    )
  );
create policy result_entries_staff_read on public.result_entries for select
  using (private.has_role(array['super_admin','results_operator','results_verifier']::public.app_role[]));
create policy result_entries_operator_write on public.result_entries for all
  using (private.has_role(array['super_admin','results_operator']::public.app_role[]))
  with check (private.has_role(array['super_admin','results_operator']::public.app_role[]));

create policy standings_read on public.school_standings for select using (true);

create policy live_updates_public_read on public.live_updates for select
  using (is_removed = false);
create policy live_updates_staff_read on public.live_updates for select
  using (private.is_staff());
create policy live_updates_reporter_insert on public.live_updates for insert
  with check (private.has_role(array['super_admin','reporter']::public.app_role[]));
create policy live_updates_staff_update on public.live_updates for update
  using (private.has_role(array['super_admin','editor','reporter']::public.app_role[]))
  with check (private.has_role(array['super_admin','editor','reporter']::public.app_role[]));

create policy articles_public_read on public.articles for select using (is_published = true);
create policy articles_staff_read on public.articles for select
  using (private.has_role(array['super_admin','editor']::public.app_role[]));
create policy articles_write on public.articles for all
  using (private.has_role(array['super_admin','editor']::public.app_role[]))
  with check (private.has_role(array['super_admin','editor']::public.app_role[]));

create policy interviews_public_read on public.interviews for select using (is_published = true);
create policy interviews_staff_read on public.interviews for select
  using (private.has_role(array['super_admin','editor','photographer']::public.app_role[]));
create policy interviews_write on public.interviews for all
  using (private.has_role(array['super_admin','editor','photographer']::public.app_role[]))
  with check (private.has_role(array['super_admin','editor','photographer']::public.app_role[]));

create policy media_public_read on public.media for select using (status = 'approved');
create policy media_staff_read on public.media for select
  using (private.has_role(array['super_admin','media_moderator','photographer','editor']::public.app_role[]));
create policy media_anon_insert on public.media for insert
  with check (status = 'pending');
create policy media_photographer_insert on public.media for insert
  with check (
    private.has_role(array['super_admin','photographer']::public.app_role[])
    and status in ('pending','approved')
  );
create policy media_moderator_update on public.media for update
  using (private.has_role(array['super_admin','media_moderator','photographer']::public.app_role[]))
  with check (private.has_role(array['super_admin','media_moderator','photographer']::public.app_role[]));
create policy media_moderator_delete on public.media for delete
  using (private.has_role(array['super_admin','media_moderator']::public.app_role[]));

create policy audit_staff_read on public.audit_logs for select
  using (private.has_role(array['super_admin','results_verifier']::public.app_role[]));

-- Storage
insert into storage.buckets (id, name, public)
values
  ('media-pending', 'media-pending', false),
  ('media-public', 'media-public', true),
  ('article-covers', 'article-covers', true),
  ('interviews', 'interviews', true)
on conflict (id) do nothing;

create policy pending_upload on storage.objects for insert
  with check (bucket_id = 'media-pending');

create policy pending_staff_read on storage.objects for select
  using (
    bucket_id = 'media-pending'
    and private.has_role(array['super_admin','media_moderator','photographer']::public.app_role[])
  );

create policy public_media_read on storage.objects for select
  using (bucket_id in ('media-public', 'article-covers', 'interviews'));

create policy public_media_staff_write on storage.objects for insert
  with check (
    bucket_id in ('media-public', 'article-covers', 'interviews')
    and private.has_role(array['super_admin','media_moderator','photographer','editor']::public.app_role[])
  );

create policy public_media_staff_update on storage.objects for update
  using (
    bucket_id in ('media-public', 'article-covers', 'interviews', 'media-pending')
    and private.has_role(array['super_admin','media_moderator','photographer','editor']::public.app_role[])
  );

notify pgrst, 'reload schema';
