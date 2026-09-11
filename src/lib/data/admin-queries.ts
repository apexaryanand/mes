import { requireServerSupabase } from "@/lib/supabase/require";
import type {
  Article,
  AuditLog,
  MediaItem,
  Profile,
  PublishedResultView,
  ResultEntryView,
  ResultSet,
  ScheduledEventView,
} from "@/lib/types";

export async function getAllResultSets(): Promise<ResultSet[]> {
  const sb = await requireServerSupabase();
  const { data } = await sb
    .from("result_sets")
    .select("*")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });
  return (data ?? []) as ResultSet[];
}

export async function getResultSetById(id: string) {
  const sb = await requireServerSupabase();
  const { data } = await sb.from("result_sets").select("*").eq("id", id).maybeSingle();
  return (data as ResultSet | null) ?? null;
}

export async function getResultEntries(setId: string): Promise<ResultEntryView[]> {
  const sb = await requireServerSupabase();
  const { data } = await sb
    .from("result_entries")
    .select("*, house:houses(*)")
    .eq("result_set_id", setId)
    .order("rank", { ascending: true, nullsFirst: false });
  return (data ?? []) as ResultEntryView[];
}

export async function getRecentPublished(limit = 6): Promise<PublishedResultView[]> {
  const sb = await requireServerSupabase();
  const { data } = await sb
    .from("result_sets")
    .select(
      "*, scheduled_event:scheduled_events(*, programme:programmes(*), category:categories(*), stage:stages(*)), result_entries(*, house:houses(*))",
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (!data?.length) return [];
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

export async function getAllLiveUpdatesAdmin() {
  const sb = await requireServerSupabase();
  const { data } = await sb.from("live_updates").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllMediaAdmin(): Promise<MediaItem[]> {
  const sb = await requireServerSupabase();
  const { data } = await sb.from("media").select("*").order("created_at", { ascending: false });
  return (data ?? []) as MediaItem[];
}

export async function getPendingMediaAdmin(limit = 50): Promise<MediaItem[]> {
  const sb = await requireServerSupabase();
  const { data } = await sb
    .from("media")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as MediaItem[];
}

export async function getAllArticlesAdmin(): Promise<Article[]> {
  const sb = await requireServerSupabase();
  const { data } = await sb.from("articles").select("*").order("created_at", { ascending: false });
  return (data ?? []) as Article[];
}

export async function getAllInterviewsAdmin() {
  const sb = await requireServerSupabase();
  const { data } = await sb
    .from("interviews")
    .select("*, house:houses(*), programme:programmes(*)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const sb = await requireServerSupabase();
  const { data } = await sb.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100);
  return (data ?? []) as AuditLog[];
}

export async function getAllProfiles(): Promise<Profile[]> {
  const sb = await requireServerSupabase();
  const { data } = await sb.from("profiles").select("*").order("display_name");
  return (data ?? []).map((p) => ({
    id: p.id as string,
    display_name: p.display_name as string,
    role: p.role as Profile["role"],
    email: null,
    is_active: p.is_active as boolean,
  }));
}

export async function getActiveResultSetForEvent(eventId: string) {
  const sb = await requireServerSupabase();
  const { data } = await sb
    .from("result_sets")
    .select("*")
    .eq("scheduled_event_id", eventId)
    .in("status", ["draft", "entered", "verified", "correction_draft"])
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as ResultSet | null) ?? null;
}
