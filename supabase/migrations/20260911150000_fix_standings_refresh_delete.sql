-- Supabase enables safe-update on API connections. Unqualified DELETE in
-- refresh_house_standings() fails when result_sets change via PostgREST.

create or replace function private.refresh_house_standings()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.house_standings where house_id is not null;

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
