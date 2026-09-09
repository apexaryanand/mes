import {
  computeEntryPoints,
  computeSchoolStandings,
} from "@/domains/results/scoring";
import {
  DEFAULT_SCORING_RULES,
  type Article,
  type AuditLog,
  type Category,
  type EventSettings,
  type GradeCode,
  type Interview,
  type ItemKind,
  type LiveUpdate,
  type MediaItem,
  type Programme,
  type Profile,
  type ResultEntry,
  type ResultSet,
  type ScheduledEvent,
  type School,
  type Stage,
} from "@/lib/types";

const uid = (prefix: string, n: number) =>
  `${prefix}-${String(n).padStart(3, "0")}`;

export const settings: EventSettings = {
  id: uid("set", 1),
  slug: "mes-hss-irimbiliyam-2026",
  name_en: "Sub-District Kerala School Kalolsavam",
  name_ml: "ഉപജില്ലാ കേരള സ്കൂൾ കലോത്സവം",
  venue_en: "MES HSS Irimbiliyam",
  venue_ml: "MES HSS ഇരിമ്പിളിയം",
  location_en: "Irimbiliyam, Malappuram, Kerala",
  location_ml: "ഇരിമ്പിളിയം, മലപ്പുറം, കേരളം",
  start_date: "2026-09-08",
  end_date: "2026-09-10",
  current_day: 2,
  live_status: "live",
  scoring_rules: DEFAULT_SCORING_RULES,
};

export const schools: School[] = [
  ["mes-hss-irimbiliyam", "19001", "MES HSS Irimbiliyam", "MES HSS ഇരിമ്പിളിയം", "MES HSS"],
  ["ghss-kuttippuram", "19040", "GHSS Kuttippuram", "ജി.എച്ച്.എസ്.എസ്. കുറ്റിപ്പുറം", "GHSS KTM"],
  ["msm-hss-kallingalparamba", "19023", "MSM HSS Kallingalparamba", "MSM HSS കല്ലിങ്ങൽപറമ്പ്", "MSM HSS"],
  ["irhs-pookkattiri", "19096", "IRHS Pookkattiri", "ഐ.ആർ.എച്ച്.എസ്. പൂക്കാട്ടിരി", "IRHS"],
  ["vvmhs-marakkara", "19057", "VVMHS Marakkara", "വി.വി.എം.എച്ച്.എസ്. മാരക്കര", "VVMHS"],
  ["bhss-mavandiyur", "19037", "BHSS Mavandiyur", "ബി.എച്ച്.എസ്.എസ്. മാവണ്ടിയൂർ", "BHSS"],
  ["ghss-valanchery", "19012", "GHSS Valanchery", "ജി.എച്ച്.എസ്.എസ്. വളാഞ്ചേരി", "GHSS VLY"],
  ["amhss-kannamangalam", "19044", "AMHSS Kannamangalam", "എ.എം.എച്ച്.എസ്.എസ്. കണ്ണമംഗലം", "AMHSS"],
  ["ptm-hss-thirunavaya", "19061", "PTM HSS Thirunavaya", "പി.ടി.എം. HSS തിരൂനാവായ", "PTM HSS"],
  ["ghs-irimbiliyam", "19008", "GHS Irimbiliyam", "ജി.എച്ച്.എസ്. ഇരിമ്പിളിയം", "GHS IRB"],
  ["iss-hss-ponnani", "19077", "ISS HSS Ponnani", "ഐ.എസ്.എസ്. HSS പൊന്നാനി", "ISS HSS"],
  ["gvhss-kuttippuram", "19041", "GVHSS Kuttippuram", "ജി.വി.എച്ച്.എസ്.എസ്. കുറ്റിപ്പുറം", "GVHSS"],
  ["hmyhss-valanchery", "19015", "HMYHSS Valanchery", "HMYHSS വളാഞ്ചേരി", "HMYHSS"],
  ["ppm-hss-kottakkal", "19082", "PPM HSS Kottakkal", "പി.പി.എം. HSS കോട്ടക്കൽ", "PPM HSS"],
  ["snhss-irimbiliyam", "19009", "SNHSS Irimbiliyam", "എസ്.എൻ.എച്ച്.എസ്.എസ്. ഇരിമ്പിളിയം", "SNHSS"],
  ["dh-hss-chemmad", "19090", "Darul Huda HSS Chemmad", "ദാറുൽ ഹുദ HSS ചെമ്മാട്", "DH HSS"],
].map(([slug, code, name_en, name_ml, short_name], i) => ({
  id: uid("sch", i + 1),
  slug,
  code,
  name_en,
  name_ml,
  short_name,
}));

export const categories: Category[] = [
  ["HS_GEN", "HS General", "എച്ച്.എസ്. ജനറൽ"],
  ["HS_B", "HS Boys", "എച്ച്.എസ്. ബോയ്സ്"],
  ["HS_G", "HS Girls", "എച്ച്.എസ്. ഗേൾസ്"],
  ["HSS_GEN", "HSS General", "എച്ച്.എസ്.എസ്. ജനറൽ"],
  ["HSS_B", "HSS Boys", "എച്ച്.എസ്.എസ്. ബോയ്സ്"],
  ["HSS_G", "HSS Girls", "എച്ച്.എസ്.എസ്. ഗേൾസ്"],
  ["UP", "UP", "യു.പി."],
  ["LP", "LP", "എൽ.പി."],
].map(([code, name_en, name_ml], i) => ({
  id: uid("cat", i + 1),
  code,
  name_en,
  name_ml,
  sort_order: i + 1,
}));

const programmeSeed: Array<[string, string, string, ItemKind]> = [
  ["oppana", "Oppana", "ഓപ്പന", "group"],
  ["malayalam-recitation", "Malayalam Recitation", "മലയാളം പദ്യച്ചൊല്ലൽ", "individual"],
  ["english-recitation", "English Recitation", "ഇംഗ്ലീഷ് പദ്യച്ചൊല്ലൽ", "individual"],
  ["kathakali", "Kathakali", "കഥകളി", "individual"],
  ["bharatanatyam", "Bharatanatyam", "ഭരതനാട്യം", "individual"],
  ["mohiniyattam", "Mohiniyattam", "മോഹിനിയാട്ടം", "individual"],
  ["light-music", "Light Music", "ലളിതഗാനം", "individual"],
  ["mappilapattu", "Mappilapattu", "മാപ്പിളപ്പാട്ട്", "individual"],
  ["kolkali", "Kolkali", "കോൽക്കളി", "group"],
  ["margamkali", "Margamkali", "മാർഗംകളി", "group"],
  ["mono-act", "Mono Act", "മോണോ ആക്ട്", "individual"],
  ["folk-dance", "Folk Dance", "നാടൻ നൃത്തം", "group"],
  ["group-song", "Group Song", "ഗ്രൂപ്പ് സോംഗ്", "group"],
  ["mimicry", "Mimicry", "മിമിക്രി", "individual"],
  ["ottanthullal", "Ottanthullal", "ഓട്ടൻതുള്ളൽ", "individual"],
  ["chenda", "Chenda", "ചെണ്ട", "individual"],
  ["violin", "Violin", "വയലിൻ", "individual"],
  ["fancy-dress", "Fancy Dress", "ഫാൻസി ഡ്രസ്", "individual"],
];

export const programmes: Programme[] = programmeSeed.map(
  ([slug, name_en, name_ml, item_kind], i) => ({
    id: uid("prg", i + 1),
    slug,
    code: `P${String(i + 1).padStart(2, "0")}`,
    name_en,
    name_ml,
    item_kind,
    allows_multiple_per_school: false,
  }),
);

export const stages: Stage[] = [
  ["main-stage", "Main Stage", "പ്രധാന വേദി", "School auditorium", "സ്കൂൾ ഓഡിറ്റോറിയം"],
  ["oppana-hall", "Stage 2 · Oppana Hall", "വേദി 2 · ഓപ്പന ഹാൾ", "Indoor hall", "ഇൻഡോർ ഹാൾ"],
  ["music-pavilion", "Stage 3 · Music Pavilion", "വേദി 3 · സംഗീത മണ്ഡപം", "Open pavilion", "ഓപ്പൺ പവലിയൻ"],
  ["dance-court", "Stage 4 · Dance Court", "വേദി 4 · നൃത്ത മൈതാനം", "East court", "കിഴക്കൻ മൈതാനം"],
  ["literary-hall", "Stage 5 · Literary Hall", "വേദി 5 · സാഹിത്യ ഹാൾ", "Library block", "ലൈബ്രറി ബ്ലോക്ക്"],
  ["open-ground", "Stage 6 · Open Ground", "വേദി 6 · ഓപ്പൺ ഗ്രൗണ്ട്", "Main ground", "പ്രധാന മൈതാനം"],
].map(([slug, name_en, name_ml, location_en, location_ml], i) => ({
  id: uid("stg", i + 1),
  slug,
  name_en,
  name_ml,
  location_en,
  location_ml,
  sort_order: i + 1,
}));

type EventSeed = {
  programme: number;
  category: number;
  stage: number;
  day: number;
  date: string;
  time: string;
  end?: string;
  status: ScheduledEvent["status"];
};

const eventSeeds: EventSeed[] = [
  { programme: 2, category: 1, stage: 5, day: 1, date: "2026-09-08", time: "09:30", status: "completed" },
  { programme: 3, category: 1, stage: 5, day: 1, date: "2026-09-08", time: "11:00", status: "completed" },
  { programme: 7, category: 3, stage: 3, day: 1, date: "2026-09-08", time: "10:00", status: "completed" },
  { programme: 8, category: 2, stage: 3, day: 1, date: "2026-09-08", time: "12:00", status: "completed" },
  { programme: 11, category: 1, stage: 5, day: 1, date: "2026-09-08", time: "14:00", status: "completed" },
  { programme: 14, category: 2, stage: 1, day: 1, date: "2026-09-08", time: "15:30", status: "completed" },
  { programme: 5, category: 3, stage: 4, day: 1, date: "2026-09-08", time: "10:30", status: "completed" },
  { programme: 16, category: 2, stage: 6, day: 1, date: "2026-09-08", time: "11:30", status: "completed" },
  { programme: 1, category: 3, stage: 2, day: 2, date: "2026-09-09", time: "09:30", status: "live" },
  { programme: 10, category: 6, stage: 2, day: 2, date: "2026-09-09", time: "11:30", status: "upcoming" },
  { programme: 9, category: 2, stage: 6, day: 2, date: "2026-09-09", time: "10:00", status: "live" },
  { programme: 6, category: 6, stage: 4, day: 2, date: "2026-09-09", time: "09:00", status: "completed" },
  { programme: 4, category: 4, stage: 1, day: 2, date: "2026-09-09", time: "10:15", status: "delayed" },
  { programme: 12, category: 6, stage: 4, day: 2, date: "2026-09-09", time: "12:00", status: "upcoming" },
  { programme: 13, category: 4, stage: 3, day: 2, date: "2026-09-09", time: "11:00", status: "upcoming" },
  { programme: 15, category: 1, stage: 1, day: 2, date: "2026-09-09", time: "14:00", status: "upcoming" },
  { programme: 17, category: 5, stage: 3, day: 2, date: "2026-09-09", time: "15:00", status: "upcoming" },
  { programme: 18, category: 8, stage: 5, day: 2, date: "2026-09-09", time: "09:45", status: "completed" },
  { programme: 7, category: 6, stage: 3, day: 2, date: "2026-09-09", time: "16:00", status: "upcoming" },
  { programme: 2, category: 4, stage: 5, day: 3, date: "2026-09-10", time: "09:30", status: "upcoming" },
  { programme: 1, category: 6, stage: 2, day: 3, date: "2026-09-10", time: "10:00", status: "upcoming" },
  { programme: 5, category: 6, stage: 4, day: 3, date: "2026-09-10", time: "10:30", status: "upcoming" },
  { programme: 8, category: 5, stage: 3, day: 3, date: "2026-09-10", time: "11:00", status: "upcoming" },
  { programme: 11, category: 4, stage: 1, day: 3, date: "2026-09-10", time: "13:30", status: "upcoming" },
];

export const scheduledEvents: ScheduledEvent[] = eventSeeds.map((seed, i) => {
  const programme = programmes[seed.programme - 1];
  const category = categories[seed.category - 1];
  return {
    id: uid("evt", i + 1),
    slug: `${programme.slug}-${category.code.toLowerCase().replace("_", "-")}`,
    programme_id: programme.id,
    category_id: category.id,
    stage_id: stages[seed.stage - 1].id,
    day_number: seed.day,
    event_date: seed.date,
    start_time: seed.time,
    end_time: seed.end ?? null,
    status: seed.status,
    notes: seed.status === "delayed" ? "Judges panel delayed by 20 minutes" : null,
  };
});

const malayalamNames = [
  "Amina Fathima",
  "Muhammed Irfan",
  "Sreelekshmi P",
  "Fathimathul Zahra",
  "Adithyan K",
  "Najah Banu",
  "Abhinav Menon",
  "Diya Fathima",
  "Harshad Ali",
  "Keerthana M",
  "Rishan Ahmed",
  "Anagha Krishnan",
  "Nihal Rahman",
  "Meenakshi R",
  "Faisal N",
  "Hrudya S",
];

function pickSchools(eventIndex: number, count: number): School[] {
  const start = (eventIndex * 3) % schools.length;
  const out: School[] = [];
  for (let i = 0; i < count; i++) {
    out.push(schools[(start + i) % schools.length]);
  }
  return out;
}

function marksFor(rank: number, jitter: number): number {
  const base = [92, 88, 84, 79, 74, 68, 63][Math.min(rank - 1, 6)];
  return Math.max(60, Math.min(99, base + ((jitter % 5) - 2)));
}

function gradeFor(marks: number): GradeCode {
  if (marks >= 80) return "A";
  if (marks >= 70) return "B";
  return "C";
}

const publishedEventIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 11, 17];
const enteredEventIndexes = [8];
const draftEventIndexes = [12];

export const resultSets: ResultSet[] = [];
export const resultEntries: ResultEntry[] = [];

function addSet(
  eventIndex: number,
  status: ResultSet["status"],
  publishedAt: string | null,
  version = 1,
) {
  const event = scheduledEvents[eventIndex];
  const appealByIndex: Record<number, ResultSet["appeal_status"]> = {
    2: "under_review",
    5: "closed",
  };
  const set: ResultSet = {
    id: uid("rst", resultSets.length + 1),
    scheduled_event_id: event.id,
    version,
    status,
    supersedes_id: null,
    entered_by: "demo-operator",
    verified_by: status === "published" || status === "verified" ? "demo-verifier" : null,
    published_by: status === "published" ? "demo-verifier" : null,
    entered_at: "2026-09-08T12:00:00+05:30",
    verified_at:
      status === "published" || status === "verified"
        ? "2026-09-08T12:20:00+05:30"
        : null,
    published_at: publishedAt,
    appeal_status:
      status === "published" ? (appealByIndex[eventIndex] ?? "none") : "none",
    official_sheet_url:
      status === "published"
        ? `/documents/official-results/${event.slug}`
        : null,
    official_sheet_signed_by:
      status === "published" ? "Convener, Sub-District Kalolsavam" : null,
    created_at: "2026-09-08T11:40:00+05:30",
    updated_at: publishedAt ?? "2026-09-08T12:00:00+05:30",
  };
  resultSets.push(set);
  const programme = programmes.find((p) => p.id === event.programme_id)!;
  const schoolCount = 5 + (eventIndex % 4);
  const chosen = pickSchools(eventIndex, schoolCount);
  chosen.forEach((school, i) => {
    const rank = i + 1;
    const marks = marksFor(rank, eventIndex + i);
    const grade = gradeFor(marks);
    resultEntries.push({
      id: uid("ent", resultEntries.length + 1),
      result_set_id: set.id,
      school_id: school.id,
      participant_name: malayalamNames[(eventIndex + i) % malayalamNames.length],
      marks,
      grade,
      rank,
      points:
        status === "published"
          ? computeEntryPoints({
              grade,
              rank,
              itemKind: programme.item_kind,
            })
          : 0,
    });
  });
}

publishedEventIndexes.forEach((idx, i) => {
  addSet(idx, "published", `2026-09-08T${String(10 + (i % 8)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:00+05:30`);
});
enteredEventIndexes.forEach((idx) => addSet(idx, "entered", null));
draftEventIndexes.forEach((idx) => addSet(idx, "draft", null));

const publishedEntries = resultEntries.filter((e) => {
  const set = resultSets.find((s) => s.id === e.result_set_id);
  return set?.status === "published";
});

export const schoolStandings = computeSchoolStandings(publishedEntries, schools);

export const liveUpdates: LiveUpdate[] = [
  {
    id: uid("liv", 1),
    stage_id: stages[1].id,
    scheduled_event_id: scheduledEvents[8].id,
    reporter_name: "Anjali · JRC",
    body: "The audience is packed as the next Oppana team takes the floor. Green and gold umbrellas line the hall.",
    media_url: null,
    media_kind: null,
    created_at: "2026-09-09T17:42:00+05:30",
    is_removed: false,
  },
  {
    id: uid("liv", 2),
    stage_id: stages[5].id,
    scheduled_event_id: scheduledEvents[10].id,
    reporter_name: "Ramees · Scout",
    body: "Kolkali on Stage 6 is LIVE. The rhythm from the sticks is carrying across the ground.",
    media_url: null,
    media_kind: null,
    created_at: "2026-09-09T17:28:00+05:30",
    is_removed: false,
  },
  {
    id: uid("liv", 3),
    stage_id: stages[0].id,
    scheduled_event_id: scheduledEvents[12].id,
    reporter_name: "Diya · Little KITES",
    body: "Kathakali on the main stage is delayed. Judges have not yet arrived from Stage 4.",
    media_url: null,
    media_kind: null,
    created_at: "2026-09-09T17:05:00+05:30",
    is_removed: false,
  },
  {
    id: uid("liv", 4),
    stage_id: stages[3].id,
    scheduled_event_id: scheduledEvents[11].id,
    reporter_name: "Anjali · JRC",
    body: "Mohiniyattam (HSS Girls) has just concluded. Results are on the way to the War Room.",
    media_url: null,
    media_kind: null,
    created_at: "2026-09-09T16:40:00+05:30",
    is_removed: false,
  },
  {
    id: uid("liv", 5),
    stage_id: stages[4].id,
    scheduled_event_id: scheduledEvents[0].id,
    reporter_name: "Nihal · Reporter",
    body: "Malayalam Recitation HS General results have been published. Three A grades from the morning session.",
    media_url: null,
    media_kind: null,
    created_at: "2026-09-08T18:12:00+05:30",
    is_removed: false,
  },
  {
    id: uid("liv", 6),
    stage_id: stages[2].id,
    scheduled_event_id: null,
    reporter_name: "Fathima · JRC",
    body: "Light rain over the music pavilion. Events continue; volunteers are moving chairs under the canopy.",
    media_url: null,
    media_kind: null,
    created_at: "2026-09-09T15:55:00+05:30",
    is_removed: false,
  },
];

export const articles: Article[] = [
  {
    id: uid("art", 1),
    slug: "day-one-closes-with-three-a-grades-in-recitation",
    title_en: "Day one closes with a surge of A grades in recitation",
    title_ml: "പദ്യച്ചൊല്ലലിൽ ഏ ഗ്രേഡുകളോടെ ഒന്നാം ദിനം അവസാനിച്ചു",
    excerpt_en:
      "Literary Hall stayed full until dusk as Malayalam and English recitation set the tone for the championship.",
    excerpt_ml:
      "മലയാളം-ഇംഗ്ലീഷ് പദ്യച്ചൊല്ലൽ ചാമ്പ്യൻഷിപ്പിന് ടോൺ സെറ്റ് ചെയ്തുകൊണ്ട് സാഹിത്യ ഹാൾ സന്ധ്യവരെ നിറഞ്ഞു.",
    body_en:
      "The first day of the Sub-District Kalolsavam at MES HSS Irimbiliyam belonged to the literary stage.\n\nBy late afternoon, three A grades had already been confirmed in Malayalam Recitation (HS General), and the War Room published the sheet within twenty minutes of the last performance.\n\nTeachers from visiting schools crowded the results board near the auditorium. “The standard is higher than last year,” said a volunteer from GHSS Kuttippuram.\n\nTomorrow the festival moves outdoors: Oppana, Kolkali and Kathakali share the second-day bill.",
    body_ml:
      "MES HSS ഇരിമ്പിളിയത്തെ ഉപജില്ലാ കലോത്സവത്തിന്റെ ഒന്നാം ദിനം സാഹിത്യ വേദിയുടേതായിരുന്നു.\n\nഉച്ചകഴിഞ്ഞ് തന്നെ മലയാളം പദ്യച്ചൊല്ലൽ (എച്ച്.എസ്. ജനറൽ) മൂന്ന് ഏ ഗ്രേഡുകൾ സ്ഥിരീകരിച്ചു. അവസാന പെർഫോമൻസിന് ഇരുപത് മിനിറ്റിനുള്ളിൽ വാർ റൂം ഫലം പ്രസിദ്ധീകരിച്ചു.\n\nനാളെ ഓപ്പന, കോൽക്കളി, കഥകളി എന്നിവയോടെ രണ്ടാം ദിനം പുറത്തേക്ക് നീങ്ങും.",
    cover_image_url: null,
    author_name: "Little KITES Editorial",
    category: "Day summary",
    related_event_id: scheduledEvents[0].id,
    related_school_id: null,
    published_at: "2026-09-08T19:10:00+05:30",
    is_published: true,
  },
  {
    id: uid("art", 2),
    slug: "oppana-hall-fills-before-the-first-bell",
    title_en: "Oppana Hall fills before the first bell",
    title_ml: "ആദ്യ മണി മുഴങ്ങും മുമ്പേ ഓപ്പന ഹാൾ നിറഞ്ഞു",
    excerpt_en:
      "Parents queued along the corridor as HS Girls Oppana opened Day 2 — the loudest room on campus.",
    excerpt_ml:
      "എച്ച്.എസ്. ഗേൾസ് ഓപ്പനയോടെ രണ്ടാം ദിനം തുടങ്ങിയപ്പോൾ കാമ്പസിലെ ഏറ്റവും ഉച്ചത്തിലുള്ള മുറി ഓപ്പന ഹാളായിരുന്നു.",
    body_en:
      "Stage 2 has the festival’s most impatient audience. Oppana teams rehearse in the courtyard, then disappear into the hall in a flash of sequins and jasmine.\n\nJRC runners are already carrying the first scores toward the War Room. Nothing is public until verification — but the noise from the hall suggests the morning will be close.",
    body_ml:
      "വേദി 2-ലാണ് ഉത്സവത്തിലെ ഏറ്റവും അക്ഷമരായ പ്രേക്ഷകർ. ഓപ്പന ടീമുകൾ മുറ്റത്ത് റിഹേഴ്‌സ് ചെയ്ത ശേഷം ഹാളിലേക്ക് കടക്കുന്നു.\n\nജെആർസി റണ്ണേഴ്‌സ് ആദ്യ സ്കോറുകൾ വാർ റൂമിലേക്ക് എത്തിക്കുന്നു. സ്ഥിരീകരണം വരെ ഒന്നും പൊതുവായി വരില്ല.",
    cover_image_url: null,
    author_name: "Anjali · JRC",
    category: "Highlight",
    related_event_id: scheduledEvents[8].id,
    related_school_id: schools[0].id,
    published_at: "2026-09-09T10:20:00+05:30",
    is_published: true,
  },
  {
    id: uid("art", 3),
    slug: "behind-the-war-room",
    title_en: "Inside the War Room: how a result becomes public",
    title_ml: "വാർ റൂമിനകത്ത്: ഒരു ഫലം പൊതുവാകുന്ന വിധം",
    excerpt_en:
      "Draft, enter, verify, publish. Little KITES walks through the four-step sheet that keeps rankings honest.",
    excerpt_ml:
      "ഡ്രാഫ്റ്റ്, എന്റർ, സ്ഥിരീകരണം, പ്രസിദ്ധീകരണം. റാങ്കിങ് നീതിയുക്തമാക്കുന്ന നാല് ഘട്ടങ്ങൾ.",
    body_en:
      "No judge types into this website. A Scout or JRC student brings the paper. An operator enters marks. A second student checks every row. Only then does the public page move.\n\nIf a published sheet is wrong, the War Room starts a correction version. The old sheet is archived. The audit log keeps both.",
    body_ml:
      "ജഡ്ജിമാർ ഈ വെബ്‌സൈറ്റിൽ മാർക്ക് ഇടില്ല. സ്കൗട്ടോ ജെആർസിയോ കടലാസ് എത്തിക്കുന്നു. ഓപ്പറേറ്റർ മാർക്ക് നൽകുന്നു. രണ്ടാമത്തെ വിദ്യാർത്ഥി ഓരോ വരിയും പരിശോധിക്കുന്നു. അതിന് ശേഷമേ പൊതു പേജ് മാറൂ.",
    cover_image_url: null,
    author_name: "Little KITES Editorial",
    category: "Behind the scenes",
    related_event_id: null,
    related_school_id: null,
    published_at: "2026-09-09T08:00:00+05:30",
    is_published: true,
  },
];

export const interviews: Interview[] = [
  {
    id: uid("int", 1),
    slug: "sreelekshmi-malayalam-recitation",
    winner_name: "Sreelekshmi P",
    school_id: schools[1].id,
    programme_id: programmes[1].id,
    scheduled_event_id: scheduledEvents[0].id,
    rank: 1,
    description_en:
      "First place, Malayalam Recitation HS General — a measured, quiet performance that filled Literary Hall.",
    description_ml:
      "മലയാളം പദ്യച്ചൊല്ലൽ എച്ച്.എസ്. ജനറൽ ഒന്നാം സ്ഥാനം.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    published_at: "2026-09-08T20:00:00+05:30",
    is_published: true,
  },
  {
    id: uid("int", 2),
    slug: "najah-bharatanatyam",
    winner_name: "Najah Banu",
    school_id: schools[0].id,
    programme_id: programmes[4].id,
    scheduled_event_id: scheduledEvents[6].id,
    rank: 1,
    description_en: "HS Girls Bharatanatyam winner, interviewed after the evening announcement.",
    description_ml: "എച്ച്.എസ്. ഗേൾസ് ഭരതനാട്യം വിജയി.",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    published_at: "2026-09-08T21:10:00+05:30",
    is_published: true,
  },
];

export const mediaItems: MediaItem[] = [
  {
    id: uid("med", 1),
    kind: "photo",
    title_en: "Oppana Hall, opening of Day 2",
    title_ml: "രണ്ടാം ദിനം, ഓപ്പന ഹാൾ",
    caption_en: "Volunteers hold the line as the first team enters.",
    caption_ml: "ആദ്യ ടീം ഹാളിലേക്ക് കടക്കുമ്പോൾ.",
    url: "/images/photo-1.svg",
    thumbnail_url: "/images/photo-1.svg",
    scheduled_event_id: scheduledEvents[8].id,
    school_id: schools[0].id,
    submitted_by_name: "War Room photo desk",
    status: "approved",
    published_at: "2026-09-09T10:05:00+05:30",
    created_at: "2026-09-09T10:00:00+05:30",
  },
  {
    id: uid("med", 2),
    kind: "photo",
    title_en: "Literary Hall recitation",
    title_ml: "സാഹിത്യ ഹാളിലെ പദ്യച്ചൊല്ലൽ",
    caption_en: "A packed house for Malayalam Recitation.",
    caption_ml: "മലയാളം പദ്യച്ചൊല്ലലിന് നിറഞ്ഞ ഹാൾ.",
    url: "/images/photo-2.svg",
    thumbnail_url: "/images/photo-2.svg",
    scheduled_event_id: scheduledEvents[0].id,
    school_id: schools[1].id,
    submitted_by_name: "Little KITES",
    status: "approved",
    published_at: "2026-09-08T13:00:00+05:30",
    created_at: "2026-09-08T12:50:00+05:30",
  },
  {
    id: uid("med", 3),
    kind: "photo",
    title_en: "Kolkali on the open ground",
    title_ml: "ഓപ്പൺ ഗ്രൗണ്ടിലെ കോൽക്കളി",
    caption_en: "Stage 6, mid-morning.",
    caption_ml: "വേദി 6, രാവിലെ.",
    url: "/images/photo-3.svg",
    thumbnail_url: "/images/photo-3.svg",
    scheduled_event_id: scheduledEvents[10].id,
    school_id: schools[2].id,
    submitted_by_name: "Public submission",
    status: "approved",
    published_at: "2026-09-09T11:20:00+05:30",
    created_at: "2026-09-09T10:40:00+05:30",
  },
  {
    id: uid("med", 4),
    kind: "video",
    title_en: "Main stage crowd, Day 2",
    title_ml: "പ്രധാന വേദിയിലെ ജനക്കൂട്ടം",
    caption_en: "Short clip from the auditorium steps.",
    caption_ml: "ഓഡിറ്റോറിയം പടിക്കൽ നിന്നുള്ള ക്ലിപ്പ്.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail_url: "/images/video-1.svg",
    scheduled_event_id: scheduledEvents[12].id,
    school_id: null,
    submitted_by_name: "Photographer desk",
    status: "approved",
    published_at: "2026-09-09T12:00:00+05:30",
    created_at: "2026-09-09T11:50:00+05:30",
  },
  {
    id: uid("med", 5),
    kind: "photo",
    title_en: "Pending: courtyard rehearsal",
    title_ml: "തീരുമാനമാകാത്തത്: മുറ്റത്തെ റിഹേഴ്‌സൽ",
    caption_en: "Uploaded by a parent. Waiting for War Room review.",
    caption_ml: "രക്ഷിതാവ് അയച്ചത്. വാർ റൂം പരിശോധനയ്ക്ക് കാത്തിരിക്കുന്നു.",
    url: "/images/photo-4.svg",
    thumbnail_url: "/images/photo-4.svg",
    scheduled_event_id: scheduledEvents[8].id,
    school_id: schools[4].id,
    submitted_by_name: "Parent visitor",
    status: "pending",
    published_at: null,
    created_at: "2026-09-09T16:22:00+05:30",
  },
  {
    id: uid("med", 6),
    kind: "photo",
    title_en: "Rejected test upload",
    title_ml: "നിരസിച്ച ടെസ്റ്റ് അപ്‌ലോഡ്",
    caption_en: "Unrelated image, rejected in moderation.",
    caption_ml: "ബന്ധമില്ലാത്ത ചിത്രം, നിരസിച്ചു.",
    url: "/images/photo-5.svg",
    thumbnail_url: "/images/photo-5.svg",
    scheduled_event_id: null,
    school_id: null,
    submitted_by_name: "Anonymous",
    status: "rejected",
    published_at: null,
    created_at: "2026-09-09T09:12:00+05:30",
  },
];

export const profiles: Profile[] = [
  { id: "demo-admin", display_name: "Super Admin", role: "super_admin", email: "admin@kalolsavam.local", is_active: true },
  { id: "demo-operator", display_name: "Results Operator", role: "results_operator", email: "operator@kalolsavam.local", is_active: true },
  { id: "demo-verifier", display_name: "Results Verifier", role: "results_verifier", email: "verifier@kalolsavam.local", is_active: true },
  { id: "demo-reporter", display_name: "Anjali", role: "reporter", email: "reporter@kalolsavam.local", is_active: true },
  { id: "demo-moderator", display_name: "Media Moderator", role: "media_moderator", email: "media@kalolsavam.local", is_active: true },
  { id: "demo-editor", display_name: "Editor", role: "editor", email: "editor@kalolsavam.local", is_active: true },
  { id: "demo-photo", display_name: "Photographer", role: "photographer", email: "photo@kalolsavam.local", is_active: true },
];

export const auditLogs: AuditLog[] = [
  {
    id: uid("aud", 1),
    actor_id: "demo-verifier",
    actor_name: "Results Verifier",
    action: "publish_result",
    entity_type: "result_set",
    entity_id: resultSets[0].id,
    details: { event: scheduledEvents[0].slug },
    created_at: resultSets[0].published_at ?? "2026-09-08T12:20:00+05:30",
  },
  {
    id: uid("aud", 2),
    actor_id: "demo-operator",
    actor_name: "Results Operator",
    action: "enter_result",
    entity_type: "result_set",
    entity_id: resultSets[resultSets.length - 2].id,
    details: { status: "entered" },
    created_at: "2026-09-09T11:10:00+05:30",
  },
];

export const demoUsers = [
  { email: "admin@kalolsavam.local", password: "demo-admin", role: "super_admin" as const },
  { email: "operator@kalolsavam.local", password: "demo-operator", role: "results_operator" as const },
  { email: "verifier@kalolsavam.local", password: "demo-verifier", role: "results_verifier" as const },
  { email: "reporter@kalolsavam.local", password: "demo-reporter", role: "reporter" as const },
  { email: "media@kalolsavam.local", password: "demo-media", role: "media_moderator" as const },
  { email: "editor@kalolsavam.local", password: "demo-editor", role: "editor" as const },
  { email: "photo@kalolsavam.local", password: "demo-photo", role: "photographer" as const },
];
