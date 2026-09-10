-- MESTA: schools → houses (school kalolsavam)

create type public.house_color as enum ('blue', 'red', 'yellow', 'green');

alter table public.schools rename to houses;
alter table public.houses add column if not exists color public.house_color;

alter table public.school_standings rename to house_standings;
alter table public.house_standings rename column school_id to house_id;

alter table public.participants rename column school_id to house_id;

alter table public.result_entries rename column school_id to house_id;
alter table public.result_entries drop constraint if exists result_entries_result_set_id_school_id_key;
create unique index if not exists result_entries_set_participant_unique
  on public.result_entries (result_set_id, participant_id)
  where participant_id is not null;

alter table public.programmes rename column allows_multiple_per_school to allows_multiple_per_house;

alter table public.interviews rename column school_id to house_id;
alter table public.articles rename column related_school_id to related_house_id;
alter table public.media rename column school_id to house_id;

-- Refresh standings for houses
create or replace function private.refresh_house_standings()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.house_standings;

  insert into public.house_standings (
    house_id, total_points, grade_a_count, grade_b_count, grade_c_count, wins_count, overall_rank, updated_at
  )
  with published as (
    select e.house_id, e.grade, e.rank, e.points
    from public.result_entries e
    join public.result_sets s on s.id = e.result_set_id
    where s.status = 'published' and s.deleted_at is null
  ),
  aggregated as (
    select
      h.id as house_id,
      coalesce(sum(p.points), 0) as total_points,
      count(*) filter (where p.grade = 'A')::int as grade_a_count,
      count(*) filter (where p.grade = 'B')::int as grade_b_count,
      count(*) filter (where p.grade = 'C')::int as grade_c_count,
      count(*) filter (where p.rank = 1)::int as wins_count
    from public.houses h
    left join published p on p.house_id = h.id
    group by h.id
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
  select house_id, total_points, grade_a_count, grade_b_count, grade_c_count, wins_count, overall_rank, now()
  from ranked;
end;
$$;

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

  perform private.refresh_house_standings();
  return new;
end;
$$;

-- RLS policy renames for houses
drop policy if exists schools_read on public.houses;
drop policy if exists schools_write on public.houses;
create policy houses_read on public.houses for select using (true);
create policy houses_write on public.houses for all
  using (private.has_role(array['super_admin']::public.app_role[]))
  with check (private.has_role(array['super_admin']::public.app_role[]));

drop policy if exists standings_read on public.house_standings;
create policy standings_read on public.house_standings for select using (true);

-- Seed four houses
truncate public.houses cascade;

insert into public.houses (slug, code, name_en, name_ml, short_name, color) values
  ('blue-house', 'BLU', 'Blue House', 'നീല ഹൗസ്', 'Blue', 'blue'),
  ('red-house', 'RED', 'Red House', 'ചുവപ്പ് ഹൗസ്', 'Red', 'red'),
  ('yellow-house', 'YLW', 'Yellow House', 'മഞ്ഞ ഹൗസ്', 'Yellow', 'yellow'),
  ('green-house', 'GRN', 'Green House', 'പച്ച ഹൗസ്', 'Green', 'green');

insert into public.event_settings (
  name_en, name_ml, venue_en, venue_ml, location_en, location_ml,
  start_date, end_date, current_day, live_status, slug
) values (
  'MESTA — Mes Track & Arts',
  'മെസ്റ്റാ — Mes Track & Arts',
  'MES HSS Irimbiliyam',
  'MES HSS ഇരിമ്പിളിയം',
  'Irimbiliyam, Malappuram, Kerala',
  'ഇരിമ്പിളിയം, മലപ്പുറം, കേരളം',
  current_date,
  current_date + interval '3 days',
  1,
  'upcoming',
  'mesta-2026'
) on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ml = excluded.name_ml,
  venue_en = excluded.venue_en,
  venue_ml = excluded.venue_ml;

notify pgrst, 'reload schema';
