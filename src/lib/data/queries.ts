import { resolveMediaUrl } from "@/lib/media-url";
import { createServerSupabase } from "@/lib/supabase/server";
import type {
  Article,
  EventSettings,
  HouseStanding,
  InterviewView,
  LiveUpdateView,
  MediaItemView,
  Participant,
  PublishedResultView,
  ScheduledEventView,
  SearchHit,
} from "@/lib/types";
import { DEFAULT_SCORING_RULES } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/utils";

export const EMPTY_SETTINGS: EventSettings = {
  id: "00000000-0000-0000-0000-000000000000",
  slug: "mesta-2026",
  name_en: "MESTA — Mes Track & Arts",
  name_ml: "മെസ്റ്റാ — Mes Track & Arts",
  venue_en: "MES HSS Irimbiliyam",
  venue_ml: "MES HSS ഇരിമ്പിളിയം",
  location_en: "",
  location_ml: "",
  start_date: new Date().toISOString().slice(0, 10),
  end_date: new Date().toISOString().slice(0, 10),
  current_day: 1,
  live_status: "upcoming",
  scoring_rules: DEFAULT_SCORING_RULES,
};

export async function remoteClient() {
  if (!isSupabaseConfigured()) return null;
  return await createServerSupabase();
}

export async function getSettings(): Promise<EventSettings> {
  const sb = await remoteClient();
  if (!sb) return EMPTY_SETTINGS;
  const { data } = await sb
    .from("event_settings")
    .select("*")
    .eq("slug", "mesta-2026")
    .maybeSingle();
  return (data as EventSettings | null) ?? EMPTY_SETTINGS;
}

export async function getHouses() {
  const sb = await remoteClient();
  if (!sb) return [];
  const { data } = await sb.from("houses").select("*").order("name_en");
  return data ?? [];
}

export async function getHouseBySlug(slug: string) {
  const houses = await getHouses();
  return houses.find((h) => h.slug === slug) ?? null;
}

export async function getCategories() {
  const sb = await remoteClient();
  if (!sb) return [];
  const { data } = await sb.from("categories").select("*").order("sort_order");
  return data ?? [];
}

export async function getProgrammes() {
  const sb = await remoteClient();
  if (!sb) return [];
  const { data } = await sb.from("programmes").select("*").order("name_en");
  return data ?? [];
}

export async function getProgrammeBySlug(slug: string) {
  const programmes = await getProgrammes();
  return programmes.find((p) => p.slug === slug) ?? null;
}

export async function getStages() {
  const sb = await remoteClient();
  if (!sb) return [];
  const { data } = await sb.from("stages").select("*").order("sort_order");
  return data ?? [];
}

export async function getStageBySlug(slug: string) {
  const stages = await getStages();
  return stages.find((s) => s.slug === slug) ?? null;
}

export async function getParticipants(): Promise<Participant[]> {
  const sb = await remoteClient();
  if (!sb) return [];
  const { data } = await sb
    .from("participants")
    .select("*, house:houses(*)")
    .order("full_name");
  return (data ?? []) as Participant[];
}

export async function getParticipantsLite(): Promise<
  Array<{ id: string; full_name: string; house_id: string }>
> {
  const sb = await remoteClient();
  if (!sb) return [];
  const { data } = await sb
    .from("participants")
    .select("id, full_name, house_id")
    .order("full_name");
  return (data ?? []) as Array<{ id: string; full_name: string; house_id: string }>;
}

export async function getScheduledEvents(): Promise<ScheduledEventView[]> {
  const sb = await remoteClient();
  if (!sb) return [];
  const { data } = await sb
    .from("scheduled_events")
    .select("*, programme:programmes(*), category:categories(*), stage:stages(*)")
    .order("day_number")
    .order("start_time");
  return (data ?? []) as ScheduledEventView[];
}

const EVENT_SELECT = "*, programme:programmes(*), category:categories(*), stage:stages(*)";

export async function getScheduledEventById(id: string): Promise<ScheduledEventView | null> {
  const sb = await remoteClient();
  if (!sb) return null;
  const { data } = await sb
    .from("scheduled_events")
    .select(EVENT_SELECT)
    .eq("id", id)
    .maybeSingle();
  return (data as ScheduledEventView | null) ?? null;
}

export async function getEventBySlug(slug: string) {
  const events = await getScheduledEvents();
  return events.find((e) => e.slug === slug) ?? null;
}

export async function getStandings(): Promise<HouseStanding[]> {
  const sb = await remoteClient();
  if (!sb) return [];
  const { data } = await sb
    .from("house_standings")
    .select("*, house:houses(*)")
    .order("overall_rank", { nullsFirst: false });
  return ((data ?? []) as HouseStanding[]).sort(
    (a, b) => (a.overall_rank ?? 999) - (b.overall_rank ?? 999),
  );
}

export async function getPublishedResults(): Promise<PublishedResultView[]> {
  const sb = await remoteClient();
  if (!sb) return [];
  const { data } = await sb
    .from("result_sets")
    .select(
      "*, scheduled_event:scheduled_events(*, programme:programmes(*), category:categories(*), stage:stages(*)), result_entries(*, house:houses(*))",
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });
  if (!data?.length) return [];
  const out: PublishedResultView[] = [];
  for (const row of data) {
    const r = row as {
      scheduled_event: ScheduledEventView | null;
      result_entries: PublishedResultView["entries"] | null;
    } & PublishedResultView["result_set"];
    if (!r.scheduled_event) continue;
    out.push({
      event: r.scheduled_event,
      result_set: r,
      entries: [...(r.result_entries ?? [])]
        .filter((e) => Boolean(e?.house))
        .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99)),
    });
  }
  return out;
}

export async function getResultForEvent(eventId: string) {
  const all = await getPublishedResults();
  return all.find((r) => r.event.id === eventId) ?? null;
}

export async function getPublishedEntryById(entryId: string) {
  const all = await getPublishedResults();
  for (const block of all) {
    const entry = block.entries.find((e) => e.id === entryId);
    if (entry) {
      return {
        entry,
        event: block.event,
        result_set: block.result_set,
      };
    }
  }
  return null;
}

export async function getLiveUpdates(): Promise<LiveUpdateView[]> {
  const sb = await remoteClient();
  if (!sb) return [];
  const { data } = await sb
    .from("live_updates")
    .select("*, stage:stages(*)")
    .eq("is_removed", false)
    .order("created_at", { ascending: false });
  if (!data) return [];
  const events = await getScheduledEvents();
  return data.map((row) => {
    const r = row as LiveUpdateView;
    return {
      ...r,
      event: events.find((e) => e.id === r.scheduled_event_id) ?? null,
    };
  });
}

export async function getArticles(): Promise<Article[]> {
  const sb = await remoteClient();
  if (!sb) return [];
  const { data } = await sb
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return (data ?? []) as Article[];
}

export async function getArticleBySlug(slug: string) {
  const sb = await remoteClient();
  if (!sb) return null;
  const { data } = await sb.from("articles").select("*").eq("slug", slug).maybeSingle();
  return (data as Article | null) ?? null;
}

export async function getInterviews(): Promise<InterviewView[]> {
  const sb = await remoteClient();
  if (!sb) return [];
  const { data } = await sb
    .from("interviews")
    .select("*, house:houses(*), programme:programmes(*)")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (!data?.length) return [];
  const events = await getScheduledEvents();
  return data.map((row) => {
    const r = row as InterviewView;
    return { ...r, event: events.find((e) => e.id === r.scheduled_event_id) ?? null };
  });
}

export async function getMedia(
  kind?: "photo" | "video",
  section: "gallery" | "reporting" = "gallery",
): Promise<MediaItemView[]> {
  const sb = await remoteClient();
  if (!sb) return [];
  let q = sb
    .from("media")
    .select("*")
    .eq("status", "approved")
    .eq("section", section)
    .order("published_at", { ascending: false });
  if (kind) q = q.eq("kind", kind);
  const { data } = await q;
  if (!data?.length) return [];
  const events = await getScheduledEvents();
  const houses = await getHouses();
  return data.map((row) => {
    const r = row as MediaItemView;
    return {
      ...r,
      section: (r.section ?? "gallery") as MediaItemView["section"],
      url: resolveMediaUrl(r.url),
      thumbnail_url: r.thumbnail_url ? resolveMediaUrl(r.thumbnail_url) : null,
      event: events.find((e) => e.id === r.scheduled_event_id) ?? null,
      house: houses.find((h) => h.id === r.house_id) ?? null,
    };
  });
}

export async function getReportings(): Promise<MediaItemView[]> {
  return getMedia("video", "reporting");
}

export async function searchPublic(query: string): Promise<SearchHit[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];
  const [houseList, programmeList, events, articleList] = await Promise.all([
    getHouses(),
    getProgrammes(),
    getScheduledEvents(),
    getArticles(),
  ]);

  for (const h of houseList) {
    if (`${h.name_en} ${h.name_ml} ${h.code ?? ""}`.toLowerCase().includes(q)) {
      hits.push({
        type: "house",
        id: h.id,
        slug: h.slug,
        title_en: h.name_en,
        title_ml: h.name_ml,
        href: `/houses/${h.slug}`,
      });
    }
  }
  for (const p of programmeList) {
    if (`${p.name_en} ${p.name_ml}`.toLowerCase().includes(q)) {
      hits.push({
        type: "programme",
        id: p.id,
        slug: p.slug,
        title_en: p.name_en,
        title_ml: p.name_ml,
        href: `/programmes/${p.slug}`,
      });
    }
  }
  for (const e of events) {
    const hay = `${e.programme.name_en} ${e.programme.name_ml} ${e.category.name_en} ${e.stage.name_en}`.toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        type: "event",
        id: e.id,
        slug: e.slug,
        title_en: `${e.programme.name_en} · ${e.category.name_en}`,
        title_ml: `${e.programme.name_ml} · ${e.category.name_ml}`,
        href: `/events/${e.slug}`,
        subtitle_en: e.stage.name_en,
        subtitle_ml: e.stage.name_ml,
      });
    }
  }
  for (const a of articleList) {
    if (`${a.title_en} ${a.title_ml} ${a.excerpt_en}`.toLowerCase().includes(q)) {
      hits.push({
        type: "article",
        id: a.id,
        slug: a.slug,
        title_en: a.title_en,
        title_ml: a.title_ml,
        href: `/news/${a.slug}`,
      });
    }
  }
  return hits.slice(0, 30);
}
