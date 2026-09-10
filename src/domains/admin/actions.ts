"use server";

import { can, getSessionProfile } from "@/lib/auth";
import { getActiveResultSetForEvent } from "@/lib/data/admin-queries";
import { requireServerSupabase, requireServiceSupabase } from "@/lib/supabase/require";
import type {
  AppRole,
  Article,
  EventStatus,
  MediaStatus,
  ResultEntry,
  ResultSetStatus,
} from "@/lib/types";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

async function bump() {
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/", "layout");
}

export async function loginAction(_prev: { error: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/war-room");

  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured. Contact the administrator." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase!.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect(next || "/war-room");
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    await supabase!.auth.signOut();
  }
  redirect("/war-room/login");
}

export async function saveResultDraft(input: {
  resultSetId: string;
  entries: Array<{
    id?: string;
    school_id: string;
    participant_id?: string | null;
    participant_name: string;
    marks: number | null;
    grade: ResultEntry["grade"];
    rank: number | null;
  }>;
}) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["war_room"])) return { error: "Not allowed." };

  const sb = await requireServerSupabase();
  const { data: set } = await sb
    .from("result_sets")
    .select("id, status")
    .eq("id", input.resultSetId)
    .maybeSingle();
  if (!set) return { error: "Result set not found." };
  if (set.status === "published") return { error: "Published results cannot be edited." };

  const { error: delError } = await sb
    .from("result_entries")
    .delete()
    .eq("result_set_id", input.resultSetId);
  if (delError) return { error: delError.message };

  if (input.entries.length) {
    const rows = [];
    for (const e of input.entries) {
      let participant_name = e.participant_name || null;
      if (e.participant_id) {
        const { data: p } = await sb
          .from("participants")
          .select("full_name")
          .eq("id", e.participant_id)
          .maybeSingle();
        if (p?.full_name) participant_name = p.full_name as string;
      }
      rows.push({
        result_set_id: input.resultSetId,
        school_id: e.school_id,
        participant_id: e.participant_id ?? null,
        participant_name,
        marks: e.marks,
        grade: e.grade,
        rank: e.rank,
      });
    }
    const { error: insError } = await sb.from("result_entries").insert(rows);
    if (insError) return { error: insError.message };
  }

  const { error: setError } = await sb
    .from("result_sets")
    .update({ status: "draft", updated_at: new Date().toISOString() })
    .eq("id", input.resultSetId);
  if (setError) return { error: setError.message };

  return { ok: true };
}

export async function transitionResult(resultSetId: string, next: ResultSetStatus) {
  const profile = await getSessionProfile();
  const sb = await requireServerSupabase();
  const { data: set } = await sb.from("result_sets").select("*").eq("id", resultSetId).maybeSingle();
  if (!set) return { error: "Not found." };

  const op = profile?.role;
  if (!can(op, ["war_room"])) return { error: "Not allowed." };

  if (next === "entered" && !["draft", "correction_draft"].includes(set.status as string)) {
    return { error: "Can only submit drafts for confirmation." };
  }
  if (next === "published" && set.status !== "entered" && set.status !== "verified") {
    return { error: "Confirm only after submission for review." };
  }
  if (set.status === "published" && next !== "correction_draft") {
    return { error: "Published results are locked." };
  }

  const patch: Record<string, unknown> = {
    status: next,
    updated_at: new Date().toISOString(),
  };

  if (next === "entered") {
    patch.entered_at = new Date().toISOString();
    patch.entered_by = profile?.id ?? null;
  }
  if (next === "published") {
    patch.published_at = new Date().toISOString();
    patch.published_by = profile?.id ?? null;
    patch.verified_at = new Date().toISOString();
    patch.verified_by = profile?.id ?? null;
  }

  const { error } = await sb.from("result_sets").update(patch).eq("id", resultSetId);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function startCorrection(resultSetId: string) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["war_room"])) return { error: "Not allowed." };

  const sb = await requireServerSupabase();
  const { data: published } = await sb.from("result_sets").select("*").eq("id", resultSetId).maybeSingle();
  if (!published || published.status !== "published") {
    return { error: "Only published sets can be corrected." };
  }

  const { data: newSet, error: setError } = await sb
    .from("result_sets")
    .insert({
      scheduled_event_id: published.scheduled_event_id,
      version: (published.version as number) + 1,
      status: "correction_draft",
      supersedes_id: published.id,
    })
    .select("id")
    .single();
  if (setError || !newSet) return { error: setError?.message ?? "Could not start correction." };

  const { data: entries } = await sb
    .from("result_entries")
    .select("school_id, participant_id, participant_name, marks, grade, rank")
    .eq("result_set_id", resultSetId);

  if (entries?.length) {
    const { error: copyError } = await sb.from("result_entries").insert(
      entries.map((e) => ({
        result_set_id: newSet.id,
        school_id: e.school_id,
        participant_id: e.participant_id,
        participant_name: e.participant_name,
        marks: e.marks,
        grade: e.grade,
        rank: e.rank,
        points: 0,
      })),
    );
    if (copyError) return { error: copyError.message };
  }

  void profile;
  return { ok: true, id: newSet.id as string };
}

export async function updateEventStatus(eventId: string, status: EventStatus) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["war_room"])) {
    return { error: "Not allowed." };
  }
  const sb = await requireServerSupabase();
  const { error } = await sb
    .from("scheduled_events")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", eventId);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function moderateMedia(id: string, status: MediaStatus) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["war_room"])) return { error: "Not allowed." };
  const sb = await requireServerSupabase();
  const { error } = await sb
    .from("media")
    .update({
      status,
      published_at: status === "approved" ? new Date().toISOString() : null,
      moderated_by: profile?.id ?? null,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function saveArticle(article: Partial<Article> & { title_en: string; title_ml: string }) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["war_room", "media_team"])) return { error: "Not allowed." };

  const sb = await requireServerSupabase();
  const payload = {
    title_en: article.title_en,
    title_ml: article.title_ml,
    excerpt_en: article.excerpt_en ?? "",
    excerpt_ml: article.excerpt_ml ?? "",
    body_en: article.body_en ?? "",
    body_ml: article.body_ml ?? "",
    category: article.category ?? "News",
    related_event_id: article.related_event_id ?? null,
    related_school_id: article.related_school_id ?? null,
    is_published: Boolean(article.is_published),
    published_at: article.is_published ? new Date().toISOString() : null,
    author_name: profile?.display_name ?? "Staff",
    updated_at: new Date().toISOString(),
  };

  if (article.id) {
    const { error } = await sb.from("articles").update(payload).eq("id", article.id);
    if (error) return { error: error.message };
  } else {
    const slug = article.slug ?? `article-${Date.now()}`;
    const { error } = await sb.from("articles").insert({ ...payload, slug });
    if (error) return { error: error.message };
  }
  return { ok: true };
}

export async function saveInterview(
  item: {
    winner_name: string;
    video_url: string;
    school_id: string;
    programme_id: string;
    scheduled_event_id?: string | null;
    rank?: number | null;
    description_en?: string;
    description_ml?: string;
  },
) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["media_team"])) return { error: "Not allowed." };

  const sb = await requireServerSupabase();
  const { error } = await sb.from("interviews").insert({
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
  if (error) return { error: error.message };
  void profile;
  return { ok: true };
}

export async function updateUserRole(profileId: string, role: AppRole) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) return { error: "Not allowed." };
  const sb = requireServiceSupabase();
  const { error } = await sb.from("profiles").update({ role }).eq("id", profileId);
  if (error) return { error: error.message };
  return { ok: true };
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

export async function createDraftForEventForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["war_room"])) return;

  const eventId = String(formData.get("eventId"));
  const existing = await getActiveResultSetForEvent(eventId);
  if (existing) {
    redirect(`/war-room/results/${existing.id}`);
  }

  const sb = await requireServerSupabase();
  const { data, error } = await sb
    .from("result_sets")
    .insert({ scheduled_event_id: eventId, status: "draft", version: 1 })
    .select("id")
    .single();
  if (error || !data) return;

  await bump();
  redirect(`/war-room/results/${data.id}`);
}

export async function saveResultDraftForm(formData: FormData) {
  const resultSetId = String(formData.get("resultSetId"));
  const count = Number(formData.get("count") ?? 0);
  const entries = [];
  for (let i = 0; i < count; i++) {
    entries.push({
      id: String(formData.get(`id_${i}`) || "") || undefined,
      school_id: String(formData.get(`school_${i}`)),
      participant_id: String(formData.get(`participant_${i}`) || "") || null,
      participant_name: String(formData.get(`name_${i}`) ?? ""),
      marks: formData.get(`marks_${i}`) ? Number(formData.get(`marks_${i}`)) : null,
      grade: (String(formData.get(`grade_${i}`) || "") || null) as ResultEntry["grade"],
      rank: formData.get(`rank_${i}`) ? Number(formData.get(`rank_${i}`)) : null,
    });
  }
  await saveResultDraft({ resultSetId, entries });
  await bump();
}

export async function updateUserRoleForm(formData: FormData) {
  const profileId = String(formData.get("profileId"));
  const role = String(formData.get("role")) as AppRole;
  await updateUserRole(profileId, role);
  await bump();
}
