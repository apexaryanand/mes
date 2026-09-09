insert into public.event_settings (
  name_en, name_ml, venue_en, venue_ml, location_en, location_ml,
  start_date, end_date, current_day, live_status
) values (
  'Sub-District Kerala School Kalolsavam',
  'ഉപജില്ലാ കേരള സ്കൂൾ കലോത്സവം',
  'MES HSS Irimbiliyam',
  'MES HSS ഇരിമ്പിളിയം',
  'Irimbiliyam, Malappuram, Kerala',
  'ഇരിമ്പിളിയം, മലപ്പുറം, കേരളം',
  '2026-09-08',
  '2026-09-10',
  2,
  'live'
);

insert into public.schools (slug, code, name_en, name_ml, short_name) values
  ('mes-hss-irimbiliyam', '19001', 'MES HSS Irimbiliyam', 'MES HSS ഇരിമ്പിളിയം', 'MES HSS'),
  ('ghss-kuttippuram', '19040', 'GHSS Kuttippuram', 'ജി.എച്ച്.എസ്.എസ്. കുറ്റിപ്പുറം', 'GHSS KTM'),
  ('msm-hss-kallingalparamba', '19023', 'MSM HSS Kallingalparamba', 'MSM HSS കല്ലിങ്ങൽപറമ്പ്', 'MSM HSS'),
  ('irhs-pookkattiri', '19096', 'IRHS Pookkattiri', 'ഐ.ആർ.എച്ച്.എസ്. പൂക്കാട്ടിരി', 'IRHS'),
  ('vvmhs-marakkara', '19057', 'VVMHS Marakkara', 'വി.വി.എം.എച്ച്.എസ്. മാരക്കര', 'VVMHS'),
  ('bhss-mavandiyur', '19037', 'BHSS Mavandiyur', 'ബി.എച്ച്.എസ്.എസ്. മാവണ്ടിയൂർ', 'BHSS'),
  ('ghss-valanchery', '19012', 'GHSS Valanchery', 'ജി.എച്ച്.എസ്.എസ്. വളാഞ്ചേരി', 'GHSS VLY'),
  ('amhss-kannamangalam', '19044', 'AMHSS Kannamangalam', 'എ.എം.എച്ച്.എസ്.എസ്. കണ്ണമംഗലം', 'AMHSS'),
  ('ptm-hss-thirunavaya', '19061', 'PTM HSS Thirunavaya', 'പി.ടി.എം. HSS തിരൂനാവായ', 'PTM HSS'),
  ('ghs-irimbiliyam', '19008', 'GHS Irimbiliyam', 'ജി.എച്ച്.എസ്. ഇരിമ്പിളിയം', 'GHS IRB'),
  ('iss-hss-ponnani', '19077', 'ISS HSS Ponnani', 'ഐ.എസ്.എസ്. HSS പൊന്നാനി', 'ISS HSS'),
  ('gvhss-kuttippuram', '19041', 'GVHSS Kuttippuram', 'ജി.വി.എച്ച്.എസ്.എസ്. കുറ്റിപ്പുറം', 'GVHSS'),
  ('hmyhss-valanchery', '19015', 'HMYHSS Valanchery', 'HMYHSS വളാഞ്ചേരി', 'HMYHSS'),
  ('ppm-hss-kottakkal', '19082', 'PPM HSS Kottakkal', 'പി.പി.എം. HSS കോട്ടക്കൽ', 'PPM HSS'),
  ('snhss-irimbiliyam', '19009', 'SNHSS Irimbiliyam', 'എസ്.എൻ.എച്ച്.എസ്.എസ്. ഇരിമ്പിളിയം', 'SNHSS'),
  ('dh-hss-chemmad', '19090', 'Darul Huda HSS Chemmad', 'ദാറുൽ ഹുദ HSS ചെമ്മാട്', 'DH HSS');

insert into public.categories (code, name_en, name_ml, sort_order) values
  ('HS_GEN', 'HS General', 'എച്ച്.എസ്. ജനറൽ', 1),
  ('HS_B', 'HS Boys', 'എച്ച്.എസ്. ബോയ്സ്', 2),
  ('HS_G', 'HS Girls', 'എച്ച്.എസ്. ഗേൾസ്', 3),
  ('HSS_GEN', 'HSS General', 'എച്ച്.എസ്.എസ്. ജനറൽ', 4),
  ('HSS_B', 'HSS Boys', 'എച്ച്.എസ്.എസ്. ബോയ്സ്', 5),
  ('HSS_G', 'HSS Girls', 'എച്ച്.എസ്.എസ്. ഗേൾസ്', 6),
  ('UP', 'UP', 'യു.പി.', 7),
  ('LP', 'LP', 'എൽ.പി.', 8);

insert into public.programmes (slug, code, name_en, name_ml, item_kind) values
  ('oppana', 'P01', 'Oppana', 'ഓപ്പന', 'group'),
  ('malayalam-recitation', 'P02', 'Malayalam Recitation', 'മലയാളം പദ്യച്ചൊല്ലൽ', 'individual'),
  ('english-recitation', 'P03', 'English Recitation', 'ഇംഗ്ലീഷ് പദ്യച്ചൊല്ലൽ', 'individual'),
  ('kathakali', 'P04', 'Kathakali', 'കഥകളി', 'individual'),
  ('bharatanatyam', 'P05', 'Bharatanatyam', 'ഭരതനാട്യം', 'individual'),
  ('mohiniyattam', 'P06', 'Mohiniyattam', 'മോഹിനിയാട്ടം', 'individual'),
  ('light-music', 'P07', 'Light Music', 'ലളിതഗാനം', 'individual'),
  ('mappilapattu', 'P08', 'Mappilapattu', 'മാപ്പിളപ്പാട്ട്', 'individual'),
  ('kolkali', 'P09', 'Kolkali', 'കോൽക്കളി', 'group'),
  ('margamkali', 'P10', 'Margamkali', 'മാർഗംകളി', 'group'),
  ('mono-act', 'P11', 'Mono Act', 'മോണോ ആക്ട്', 'individual'),
  ('folk-dance', 'P12', 'Folk Dance', 'നാടൻ നൃത്തം', 'group'),
  ('group-song', 'P13', 'Group Song', 'ഗ്രൂപ്പ് സോംഗ്', 'group'),
  ('mimicry', 'P14', 'Mimicry', 'മിമിക്രി', 'individual'),
  ('ottanthullal', 'P15', 'Ottanthullal', 'ഓട്ടൻതുള്ളൽ', 'individual'),
  ('chenda', 'P16', 'Chenda', 'ചെണ്ട', 'individual'),
  ('violin', 'P17', 'Violin', 'വയലിൻ', 'individual'),
  ('fancy-dress', 'P18', 'Fancy Dress', 'ഫാൻസി ഡ്രസ്', 'individual');

insert into public.stages (slug, name_en, name_ml, location_en, location_ml, sort_order) values
  ('main-stage', 'Main Stage', 'പ്രധാന വേദി', 'School auditorium', 'സ്കൂൾ ഓഡിറ്റോറിയം', 1),
  ('oppana-hall', 'Stage 2 · Oppana Hall', 'വേദി 2 · ഓപ്പന ഹാൾ', 'Indoor hall', 'ഇൻഡോർ ഹാൾ', 2),
  ('music-pavilion', 'Stage 3 · Music Pavilion', 'വേദി 3 · സംഗീത മണ്ഡപം', 'Open pavilion', 'ഓപ്പൺ പവലിയൻ', 3),
  ('dance-court', 'Stage 4 · Dance Court', 'വേദി 4 · നൃത്ത മൈതാനം', 'East court', 'കിഴക്കൻ മൈതാനം', 4),
  ('literary-hall', 'Stage 5 · Literary Hall', 'വേദി 5 · സാഹിത്യ ഹാൾ', 'Library block', 'ലൈബ്രറി ബ്ലോക്ക്', 5),
  ('open-ground', 'Stage 6 · Open Ground', 'വേദി 6 · ഓപ്പൺ ഗ്രൗണ്ട്', 'Main ground', 'പ്രധാന മൈതാനം', 6);

-- Seed a representative schedule. Full fixture data also lives in src/lib/data/demo.ts
insert into public.scheduled_events (
  slug, programme_id, category_id, stage_id, day_number, event_date, start_time, status
)
select
  p.slug || '-' || lower(replace(c.code, '_', '-')),
  p.id, c.id, s.id, v.day, v.event_date::date, v.start_time::time, v.status::public.event_status
from (values
  ('malayalam-recitation', 'HS_GEN', 'literary-hall', 1, '2026-09-08', '09:30', 'completed'),
  ('english-recitation', 'HS_GEN', 'literary-hall', 1, '2026-09-08', '11:00', 'completed'),
  ('light-music', 'HS_G', 'music-pavilion', 1, '2026-09-08', '10:00', 'completed'),
  ('mappilapattu', 'HS_B', 'music-pavilion', 1, '2026-09-08', '12:00', 'completed'),
  ('bharatanatyam', 'HS_G', 'dance-court', 1, '2026-09-08', '10:30', 'completed'),
  ('oppana', 'HS_G', 'oppana-hall', 2, '2026-09-09', '09:30', 'live'),
  ('kolkali', 'HS_B', 'open-ground', 2, '2026-09-09', '10:00', 'live'),
  ('mohiniyattam', 'HSS_G', 'dance-court', 2, '2026-09-09', '09:00', 'completed'),
  ('kathakali', 'HSS_GEN', 'main-stage', 2, '2026-09-09', '10:15', 'delayed'),
  ('margamkali', 'HSS_G', 'oppana-hall', 2, '2026-09-09', '11:30', 'upcoming'),
  ('malayalam-recitation', 'HSS_GEN', 'literary-hall', 3, '2026-09-10', '09:30', 'upcoming')
) as v(programme_slug, category_code, stage_slug, day, event_date, start_time, status)
join public.programmes p on p.slug = v.programme_slug
join public.categories c on c.code = v.category_code
join public.stages s on s.slug = v.stage_slug;

-- Publish sample results for completed Day 1 events
do $$
declare
  ev record;
  rs_id uuid;
  sch record;
  rnk int;
  mk numeric;
  grd public.grade_code;
begin
  for ev in
    select se.id
    from public.scheduled_events se
    where se.status = 'completed'
  loop
    insert into public.result_sets (scheduled_event_id, version, status, published_at, entered_at, verified_at)
    values (ev.id, 1, 'draft', null, now(), null)
    returning id into rs_id;

    rnk := 0;
    for sch in
      select id from public.schools order by code limit 6
    loop
      rnk := rnk + 1;
      mk := greatest(60, 94 - rnk * 4);
      grd := case when mk >= 80 then 'A' when mk >= 70 then 'B' else 'C' end;
      insert into public.result_entries (result_set_id, school_id, participant_name, marks, grade, rank)
      values (rs_id, sch.id, 'Participant ' || rnk, mk, grd, rnk);
    end loop;

    update public.result_sets
    set status = 'entered', entered_at = now()
    where id = rs_id;

    update public.result_sets
    set status = 'verified', verified_at = now()
    where id = rs_id;

    update public.result_sets
    set status = 'published', published_at = now()
    where id = rs_id;
  end loop;
end $$;

insert into public.live_updates (stage_id, reporter_name, body, created_at)
select s.id, 'Anjali · JRC', 'The audience is packed as the next performance is about to begin.', now()
from public.stages s where s.slug = 'oppana-hall';

insert into public.articles (
  slug, title_en, title_ml, excerpt_en, excerpt_ml, body_en, body_ml,
  author_name, category, published_at, is_published
) values (
  'day-one-closes-with-three-a-grades-in-recitation',
  'Day one closes with a surge of A grades in recitation',
  'പദ്യച്ചൊല്ലലിൽ ഏ ഗ്രേഡുകളോടെ ഒന്നാം ദിനം അവസാനിച്ചു',
  'Literary Hall stayed full until dusk as recitation set the tone for the championship.',
  'പദ്യച്ചൊല്ലൽ ചാമ്പ്യൻഷിപ്പിന് ടോൺ സെറ്റ് ചെയ്തു.',
  'The first day of the Sub-District Kalolsavam at MES HSS Irimbiliyam belonged to the literary stage.',
  'MES HSS ഇരിമ്പിളിയത്തെ ഉപജില്ലാ കലോത്സവത്തിന്റെ ഒന്നാം ദിനം സാഹിത്യ വേദിയുടേതായിരുന്നു.',
  'Little KITES Editorial',
  'Day summary',
  now(),
  true
);
