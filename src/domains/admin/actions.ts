"use server";

import * as demo from "@/lib/data/demo";
import { computeEntryPoints, computeSchoolStandings } from "@/domains/results/scoring";
import type {
  AppRole,
  Article,
  EventStatus,
  Interview,
  MediaStatus,
  ResultEntry,
  ResultSetStatus,
} from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { can, getSessionProfile } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

function recomputeDemoStandings() {
  const publishedIds = new Set(
    demo.resultSets.filter((s) => s.status === "published").map((s) => s.id),
  );
  const entries = demo.resultEntries.filter((e) => publishedIds.has(e.result_set_id));
  const next = computeSchoolStandings(entries, demo.schools);
  demo.schoolStandings.splice(0, demo.schoolStandings.length, ...next);
}

export async function loginAction(_prev: { error: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/war-room");

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
  } else {
    const user = demo.demoUsers.find((u) => u.email === email && u.password === password);
    if (!user) return { error: "Invalid demo credentials." };
    const jar = await cookies();
    jar.set("kalolsavam_demo_role", user.role, { path: "/", httpOnly: true });
    jar.set("kalolsavam_demo_email", user.email, { path: "/", httpOnly: true });
  }
  redirect(next || "/war-room");
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    await supabase!.auth.signOut();
  }
  const jar = await cookies();
  jar.delete("kalolsavam_demo_role");
  jar.delete("kalolsavam_demo_email");
  redirect("/war-room/login");
}

export async function saveResultDraft(input: {
  resultSetId: string;
  entries: Array<{
    id?: string;
    school_id: string;
    participant_name: string;
    marks: number | null;
    grade: ResultEntry["grade"];
    rank: number | null;
  }>;
}) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["results_operator"])) {
    return { error: "Not allowed." };
  }
  const set = demo.resultSets.find((s) => s.id === input.resultSetId);
  if (!set) return { error: "Result set not found." };
  if (set.status === "published") return { error: "Published results cannot be edited." };

  const remaining = demo.resultEntries.filter((e) => e.result_set_id !== set.id);
  const event = demo.scheduledEvents.find((e) => e.id === set.scheduled_event_id)!;
  const programme = demo.programmes.find((p) => p.id === event.programme_id)!;
  const nextRows: ResultEntry[] = input.entries.map((e, i) => ({
    id: e.id ?? `ent-new-${Date.now()}-${i}`,
    result_set_id: set.id,
    school_id: e.school_id,
    participant_name: e.participant_name || null,
    marks: e.marks,
    grade: e.grade,
    rank: e.rank,
    points: 0,
  }));
  demo.resultEntries.splice(0, demo.resultEntries.length, ...remaining, ...nextRows);
  set.status = "draft";
  set.updated_at = new Date().toISOString();
  void programme;
  return { ok: true };
}

export async function transitionResult(resultSetId: string, next: ResultSetStatus) {
  const profile = await getSessionProfile();
  const set = demo.resultSets.find((s) => s.id === resultSetId);
  if (!set) return { error: "Not found." };

  const op = profile?.role;
  if (next === "entered" && !can(op, ["results_operator"])) return { error: "Not allowed." };
  if ((next === "verified" || next === "published") && !can(op, ["results_verifier"])) {
    return { error: "Not allowed." };
  }
  if (set.status === "published" && next !== "correction_draft") {
    return { error: "Published results are locked." };
  }

  const event = demo.scheduledEvents.find((e) => e.id === set.scheduled_event_id)!;
  const programme = demo.programmes.find((p) => p.id === event.programme_id)!;

  if (next === "published") {
    const rows = demo.resultEntries.filter((e) => e.result_set_id === set.id);
    for (const row of rows) {
      row.points = computeEntryPoints({
        grade: row.grade,
        rank: row.rank,
        itemKind: programme.item_kind,
      });
    }
    set.published_at = new Date().toISOString();
    set.published_by = profile?.id ?? null;
    if (set.supersedes_id) {
      const prev = demo.resultSets.find((s) => s.id === set.supersedes_id);
      if (prev) prev.status = "archived";
    }
    demo.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: profile?.id ?? null,
      actor_name: profile?.display_name ?? "system",
      action: "publish_result",
      entity_type: "result_set",
      entity_id: set.id,
      details: { event: event.slug },
      created_at: new Date().toISOString(),
    });
  }

  if (next === "entered") {
    set.entered_at = new Date().toISOString();
    set.entered_by = profile?.id ?? null;
  }
  if (next === "verified") {
    set.verified_at = new Date().toISOString();
    set.verified_by = profile?.id ?? null;
  }
  set.status = next;
  set.updated_at = new Date().toISOString();
  recomputeDemoStandings();
  return { ok: true };
}

export async function startCorrection(resultSetId: string) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["results_verifier"])) return { error: "Not allowed." };
  const published = demo.resultSets.find((s) => s.id === resultSetId);
  if (!published || published.status !== "published") return { error: "Only published sets can be corrected." };
  const copyId = `rst-corr-${Date.now()}`;
  demo.resultSets.push({
    ...published,
    id: copyId,
    version: published.version + 1,
    status: "correction_draft",
    supersedes_id: published.id,
    published_at: null,
    published_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const copies = demo.resultEntries
    .filter((e) => e.result_set_id === published.id)
    .map((e, i) => ({ ...e, id: `ent-corr-${Date.now()}-${i}`, result_set_id: copyId, points: 0 }));
  demo.resultEntries.push(...copies);
  return { ok: true, id: copyId };
}

export async function updateEventStatus(eventId: string, status: EventStatus) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["results_operator", "results_verifier"])) {
    return { error: "Not allowed." };
  }
  const event = demo.scheduledEvents.find((e) => e.id === eventId);
  if (!event) return { error: "Not found." };
  event.status = status;
  return { ok: true };
}

export async function publishLiveUpdate(input: {
  stageId: string;
  eventId?: string;
  body: string;
}) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["reporter"])) return { error: "Not allowed." };
  if (!input.body.trim()) return { error: "Write an update first." };
  demo.liveUpdates.unshift({
    id: `liv-${Date.now()}`,
    stage_id: input.stageId,
    scheduled_event_id: input.eventId ?? null,
    reporter_name: profile?.display_name ?? "Reporter",
    body: input.body.trim(),
    media_url: null,
    media_kind: null,
    created_at: new Date().toISOString(),
    is_removed: false,
  });
  return { ok: true };
}

export async function removeLiveUpdate(id: string) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["editor", "reporter"])) return { error: "Not allowed." };
  const row = demo.liveUpdates.find((u) => u.id === id);
  if (row) row.is_removed = true;
  return { ok: true };
}

export async function moderateMedia(id: string, status: MediaStatus) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["media_moderator"])) return { error: "Not allowed." };
  const row = demo.mediaItems.find((m) => m.id === id);
  if (!row) return { error: "Not found." };
  row.status = status;
  row.published_at = status === "approved" ? new Date().toISOString() : null;
  return { ok: true };
}

export async function saveArticle(article: Partial<Article> & { title_en: string; title_ml: string }) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["editor"])) return { error: "Not allowed." };
  const existing = article.id ? demo.articles.find((a) => a.id === article.id) : null;
  if (existing) Object.assign(existing, article);
  else {
    demo.articles.unshift({
      id: `art-${Date.now()}`,
      slug: article.slug ?? `article-${Date.now()}`,
      title_en: article.title_en,
      title_ml: article.title_ml,
      excerpt_en: article.excerpt_en ?? "",
      excerpt_ml: article.excerpt_ml ?? "",
      body_en: article.body_en ?? "",
      body_ml: article.body_ml ?? "",
      cover_image_url: null,
      author_name: profile?.display_name ?? "Editor",
      category: article.category ?? "News",
      related_event_id: article.related_event_id ?? null,
      related_school_id: article.related_school_id ?? null,
      published_at: article.is_published ? new Date().toISOString() : null,
      is_published: Boolean(article.is_published),
    });
  }
  return { ok: true };
}

export async function saveInterview(item: Partial<Interview> & { winner_name: string; video_url: string; school_id: string; programme_id: string }) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["editor", "photographer"])) return { error: "Not allowed." };
  demo.interviews.unshift({
    id: `int-${Date.now()}`,
    slug: `interview-${Date.now()}`,
    winner_name: item.winner_name,
    school_id: item.school_id,
    programme_id: item.programme_id,
    scheduled_event_id: item.scheduled_event_id ?? null,
    rank: item.rank ?? 1,
    description_en: item.description_en ?? "",
    description_ml: item.description_ml ?? "",
    video_url: item.video_url,
    published_at: new Date().toISOString(),
    is_published: true,
  });
  return { ok: true };
}

export async function updateUserRole(profileId: string, role: AppRole) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) return { error: "Not allowed." };
  const row = demo.profiles.find((p) => p.id === profileId);
  if (row) row.role = role;
  return { ok: true };
}

async function bump() {
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/", "layout");
}

export async function transitionResultForm(formData: FormData) {
  const id = String(formData.get("id"));
  const next = String(formData.get("next")) as ResultSetStatus;
  await transitionResult(id, next);
  await bump();
}

export async function startCorrectionForm(formData: FormData) {
  const id = String(formData.get("id"));
  const result = await startCorrection(id);
  await bump();
  if (result && "id" in result && result.id) {
    redirect(`/war-room/results/${result.id}`);
  }
}

export async function updateEventStatusForm(formData: FormData) {
  const eventId = String(formData.get("eventId"));
  const status = String(formData.get("status")) as EventStatus;
  await updateEventStatus(eventId, status);
  await bump();
}

export async function moderateMediaForm(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as MediaStatus;
  await moderateMedia(id, status);
  await bump();
}

export async function removeLiveUpdateForm(formData: FormData) {
  await removeLiveUpdate(String(formData.get("id")));
  await bump();
}

export async function publishLiveUpdateForm(formData: FormData) {
  await publishLiveUpdate({
    stageId: String(formData.get("stageId")),
    eventId: String(formData.get("eventId") || "") || undefined,
    body: String(formData.get("body") ?? ""),
  });
  await bump();
}

export async function createDraftForEventForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["results_operator"])) return;
  const eventId = String(formData.get("eventId"));
  const existing = demo.resultSets.find(
    (s) => s.scheduled_event_id === eventId && !["archived", "published"].includes(s.status),
  );
  if (existing) {
    redirect(`/war-room/results/${existing.id}`);
  }
  const id = `rst-new-${Date.now()}`;
  demo.resultSets.push({
    id,
    scheduled_event_id: eventId,
    version: 1,
    status: "draft",
    supersedes_id: null,
    entered_by: profile?.id ?? null,
    verified_by: null,
    published_by: null,
    entered_at: null,
    verified_at: null,
    published_at: null,
    appeal_status: "none",
    official_sheet_url: null,
    official_sheet_signed_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/", "layout");
  redirect(`/war-room/results/${id}`);
}

export async function saveResultDraftForm(formData: FormData) {
  const resultSetId = String(formData.get("resultSetId"));
  const count = Number(formData.get("count") ?? 0);
  const entries = [];
  for (let i = 0; i < count; i++) {
    entries.push({
      id: String(formData.get(`id_${i}`) || "") || undefined,
      school_id: String(formData.get(`school_${i}`)),
      participant_name: String(formData.get(`name_${i}`) ?? ""),
      marks: formData.get(`marks_${i}`) ? Number(formData.get(`marks_${i}`)) : null,
      grade: (String(formData.get(`grade_${i}`) || "") || null) as ResultEntry["grade"],
      rank: formData.get(`rank_${i}`) ? Number(formData.get(`rank_${i}`)) : null,
    });
  }
  const result = await saveResultDraft({ resultSetId, entries });
  await bump();
  void result;
}
