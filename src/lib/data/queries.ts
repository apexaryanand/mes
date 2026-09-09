import * as demo from "@/lib/data/demo";
import { createServerSupabase } from "@/lib/supabase/server";
import type {
  Article,
  InterviewView,
  LiveUpdateView,
  MediaItemView,
  PublishedResultView,
  ResultEntryView,
  ScheduledEventView,
  SchoolStanding,
  SearchHit,
} from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/utils";

function hydrateEvent(event: (typeof demo.scheduledEvents)[number]): ScheduledEventView {
  const programme = demo.programmes.find((p) => p.id === event.programme_id)!;
  const category = demo.categories.find((c) => c.id === event.category_id)!;
  const stage = demo.stages.find((s) => s.id === event.stage_id)!;
  return { ...event, programme, category, stage };
}

function publishedSets() {
  return demo.resultSets.filter((s) => s.status === "published");
}

export function hydrateEntries(setId: string): ResultEntryView[] {
  return demo.resultEntries
    .filter((e) => e.result_set_id === setId)
    .map((e) => ({
      ...e,
      school: demo.schools.find((s) => s.id === e.school_id)!,
    }))
    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
}

export function hydratePublishedResults(): PublishedResultView[] {
  return publishedSets()
    .map((set) => {
      const event = demo.scheduledEvents.find((e) => e.id === set.scheduled_event_id)!;
      return {
        event: hydrateEvent(event),
        result_set: set,
        entries: hydrateEntries(set.id),
      };
    })
    .sort((a, b) =>
      (b.result_set.published_at ?? "").localeCompare(a.result_set.published_at ?? ""),
    );
}

export async function remoteClient() {
  return isSupabaseConfigured() ? await createServerSupabase() : null;
}

export async function getSettings() {
  const sb = await remoteClient();
  if (sb) {
    const { data } = await sb.from("event_settings").select("*").limit(1).maybeSingle();
    if (data) return data as typeof demo.settings;
  }
  return demo.settings;
}

export async function getSchools() {
  const sb = await remoteClient();
  if (sb) {
    const { data } = await sb.from("schools").select("*").order("name_en");
    if (data?.length) return data as typeof demo.schools;
  }
  return demo.schools;
}

export async function getSchoolBySlug(slug: string) {
  const schools = await getSchools();
  return schools.find((s) => s.slug === slug) ?? null;
}

export async function getCategories() {
  const sb = await remoteClient();
  if (sb) {
    const { data } = await sb.from("categories").select("*").order("sort_order");
    if (data?.length) return data as typeof demo.categories;
  }
  return demo.categories;
}

export async function getProgrammes() {
  const sb = await remoteClient();
  if (sb) {
    const { data } = await sb.from("programmes").select("*").order("name_en");
    if (data?.length) return data as typeof demo.programmes;
  }
  return demo.programmes;
}

export async function getProgrammeBySlug(slug: string) {
  const programmes = await getProgrammes();
  return programmes.find((p) => p.slug === slug) ?? null;
}

export async function getStages() {
  const sb = await remoteClient();
  if (sb) {
    const { data } = await sb.from("stages").select("*").order("sort_order");
    if (data?.length) return data as typeof demo.stages;
  }
  return demo.stages;
}

export async function getStageBySlug(slug: string) {
  const stages = await getStages();
  return stages.find((s) => s.slug === slug) ?? null;
}

export async function getScheduledEvents(): Promise<ScheduledEventView[]> {
  const sb = await remoteClient();
  if (sb) {
    const { data } = await sb
      .from("scheduled_events")
      .select("*, programme:programmes(*), category:categories(*), stage:stages(*)")
      .order("day_number")
      .order("start_time");
    if (data?.length) return data as ScheduledEventView[];
  }
  return demo.scheduledEvents
    .map(hydrateEvent)
    .sort((a, b) => a.day_number - b.day_number || a.start_time.localeCompare(b.start_time));
}

export async function getEventBySlug(slug: string) {
  const events = await getScheduledEvents();
  return events.find((e) => e.slug === slug) ?? null;
}

export async function getStandings(): Promise<SchoolStanding[]> {
  const sb = await remoteClient();
  if (sb) {
    const { data } = await sb
      .from("school_standings")
      .select("*, school:schools(*)")
      .order("overall_rank", { nullsFirst: false });
    if (data?.length) {
      return (data as SchoolStanding[]).sort(
        (a, b) => (a.overall_rank ?? 999) - (b.overall_rank ?? 999),
      );
    }
  }
  return demo.schoolStandings;
}

export async function getPublishedResults(): Promise<PublishedResultView[]> {
  const sb = await remoteClient();
  if (sb) {
    const { data } = await sb
      .from("result_sets")
      .select(
        "*, scheduled_event:scheduled_events(*, programme:programmes(*), category:categories(*), stage:stages(*)), result_entries(*, school:schools(*))",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (data?.length) {
      return data.map((row) => {
        const r = row as {
          scheduled_event: ScheduledEventView;
          result_entries: ResultEntryView[];
        } & PublishedResultView["result_set"];
        return {
          event: r.scheduled_event,
          result_set: r,
          entries: [...r.result_entries].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99)),
        };
      });
    }
  }
  return hydratePublishedResults();
}

export async function getResultForEvent(eventId: string) {
  const all = await getPublishedResults();
  return all.find((r) => r.event.id === eventId) ?? null;
}

export async function getLiveUpdates(): Promise<LiveUpdateView[]> {
  const sb = await remoteClient();
  if (sb) {
    const { data } = await sb
      .from("live_updates")
      .select("*, stage:stages(*)")
      .eq("is_removed", false)
      .order("created_at", { ascending: false });
    if (data) {
      const events = await getScheduledEvents();
      return data.map((row) => {
        const r = row as LiveUpdateView;
        return {
          ...r,
          event: events.find((e) => e.id === r.scheduled_event_id) ?? null,
        };
      });
    }
  }
  const events = demo.scheduledEvents.map(hydrateEvent);
  return [...demo.liveUpdates]
    .filter((u) => !u.is_removed)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((u) => ({
      ...u,
      stage: demo.stages.find((s) => s.id === u.stage_id) ?? null,
      event: events.find((e) => e.id === u.scheduled_event_id) ?? null,
    }));
}

export async function getArticles(): Promise<Article[]> {
  const sb = await remoteClient();
  if (sb) {
    const { data } = await sb
      .from("articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (data?.length) return data as Article[];
  }
  return demo.articles.filter((a) => a.is_published);
}

export async function getArticleBySlug(slug: string) {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function getInterviews(): Promise<InterviewView[]> {
  const sb = await remoteClient();
  if (sb) {
    const { data } = await sb
      .from("interviews")
      .select("*, school:schools(*), programme:programmes(*)")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (data?.length) {
      const events = await getScheduledEvents();
      return data.map((row) => {
        const r = row as InterviewView;
        return { ...r, event: events.find((e) => e.id === r.scheduled_event_id) ?? null };
      });
    }
  }
  const events = demo.scheduledEvents.map(hydrateEvent);
  return demo.interviews
    .filter((i) => i.is_published)
    .map((i) => ({
      ...i,
      school: demo.schools.find((s) => s.id === i.school_id)!,
      programme: demo.programmes.find((p) => p.id === i.programme_id)!,
      event: events.find((e) => e.id === i.scheduled_event_id) ?? null,
    }));
}

export async function getMedia(kind?: "photo" | "video"): Promise<MediaItemView[]> {
  const sb = await remoteClient();
  if (sb) {
    let q = sb.from("media").select("*").eq("status", "approved").order("published_at", { ascending: false });
    if (kind) q = q.eq("kind", kind);
    const { data } = await q;
    if (data?.length) {
      const events = await getScheduledEvents();
      const schools = await getSchools();
      return data.map((row) => {
        const r = row as MediaItemView;
        return {
          ...r,
          event: events.find((e) => e.id === r.scheduled_event_id) ?? null,
          school: schools.find((s) => s.id === r.school_id) ?? null,
        };
      });
    }
  }
  const events = demo.scheduledEvents.map(hydrateEvent);
  return demo.mediaItems
    .filter((m) => m.status === "approved" && (!kind || m.kind === kind))
    .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""))
    .map((m) => ({
      ...m,
      event: events.find((e) => e.id === m.scheduled_event_id) ?? null,
      school: demo.schools.find((s) => s.id === m.school_id) ?? null,
    }));
}

export async function searchPublic(query: string): Promise<SearchHit[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];
  const [schoolList, programmeList, events, articleList, updates] = await Promise.all([
    getSchools(),
    getProgrammes(),
    getScheduledEvents(),
    getArticles(),
    getLiveUpdates(),
  ]);

  for (const s of schoolList) {
    if (`${s.name_en} ${s.name_ml} ${s.code}`.toLowerCase().includes(q)) {
      hits.push({
        type: "school",
        id: s.id,
        slug: s.slug,
        title_en: s.name_en,
        title_ml: s.name_ml,
        href: `/schools/${s.slug}`,
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
  for (const u of updates) {
    if (u.body.toLowerCase().includes(q)) {
      hits.push({
        type: "live_update",
        id: u.id,
        title_en: u.body.slice(0, 80),
        title_ml: u.body.slice(0, 80),
        href: "/live",
        subtitle_en: u.reporter_name,
        subtitle_ml: u.reporter_name,
      });
    }
  }
  return hits.slice(0, 30);
}

export { demo };
