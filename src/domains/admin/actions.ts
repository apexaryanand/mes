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
import { revalidatePublicSite, revalidateWarRoom } from "@/lib/revalidate";
import { failWarRoom, redirectWarRoomError } from "@/lib/war-room-error";
import { safeNextPath } from "@/lib/safe-redirect";

async function bump(opts?: { public?: boolean }) {
  revalidateWarRoom();
  if (opts?.public) revalidatePublicSite();
}

export async function loginAction(_prev: { error: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? "/war-room"));

  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured. Contact the administrator." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase!.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect(next);
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
    house_id: string;
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

  const incomplete = input.entries.filter(
    (e) =>
      (e.participant_name.trim() || e.participant_id || e.marks != null || e.grade) &&
      !(e.house_id && (e.participant_name.trim() || e.participant_id)),
  );
  if (incomplete.length) {
    return { error: "Each filled row needs a participant name (or registered pick) and a house." };
  }

  const prepared = input.entries.filter(
    (e) => e.house_id && (e.participant_name.trim() || e.participant_id),
  );

  const seen = new Set<string>();
  for (const e of prepared) {
    if (!e.participant_id) continue;
    if (seen.has(e.participant_id)) {
      return { error: "The same registered participant cannot appear twice." };
    }
    seen.add(e.participant_id);
  }

  const { data: existing } = await sb
    .from("result_entries")
    .select("house_id, participant_id, participant_name, marks, grade, rank, points")
    .eq("result_set_id", input.resultSetId);

  const nameById = new Map<string, string>();
  const ids = [...new Set(prepared.map((e) => e.participant_id).filter(Boolean))] as string[];
  if (ids.length) {
    const { data: people } = await sb.from("participants").select("id, full_name").in("id", ids);
    for (const p of people ?? []) {
      nameById.set(p.id as string, p.full_name as string);
    }
  }

  const { error: delError } = await sb
    .from("result_entries")
    .delete()
    .eq("result_set_id", input.resultSetId);
  if (delError) return { error: delError.message };

  if (prepared.length) {
    const rows = prepared.map((e) => ({
      result_set_id: input.resultSetId,
      house_id: e.house_id,
      participant_id: e.participant_id ?? null,
      participant_name: (e.participant_id && nameById.get(e.participant_id)) || e.participant_name || null,
      marks: e.marks,
      grade: e.grade,
      rank: e.rank,
    }));
    const { error: insError } = await sb.from("result_entries").insert(rows);
    if (insError) {
      if (existing?.length) {
        await sb.from("result_entries").insert(
          existing.map((e) => ({
            result_set_id: input.resultSetId,
            ...e,
          })),
        );
      }
      return { error: insError.message };
    }
  }

  const status = set.status as ResultSetStatus;
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status !== "entered" && status !== "verified" && status !== "correction_draft") {
    patch.status = "draft";
  }
  const { error: setError } = await sb.from("result_sets").update(patch).eq("id", input.resultSetId);
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

  const { data: openDraft } = await sb
    .from("result_sets")
    .select("id")
    .eq("scheduled_event_id", published.scheduled_event_id)
    .in("status", ["draft", "entered", "correction_draft", "verified"])
    .maybeSingle();
  if (openDraft?.id) {
    return { ok: true, id: openDraft.id as string };
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
    .select("house_id, participant_id, participant_name, marks, grade, rank")
    .eq("result_set_id", resultSetId);

  if (entries?.length) {
    const { error: copyError } = await sb.from("result_entries").insert(
      entries.map((e) => ({
        result_set_id: newSet.id,
        house_id: e.house_id,
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
  const { data: item } = await sb.from("media").select("*").eq("id", id).maybeSingle();
  if (!item) return { error: "Not found." };

  let url = item.url as string;
  let storagePath = (item.storage_path as string | null) ?? null;

  if (status === "approved" && storagePath && !storagePath.startsWith("staff/")) {
    try {
      const svc = requireServiceSupabase();
      const { data: file, error: dlError } = await svc.storage
        .from("media-pending")
        .download(storagePath);
      if (!dlError && file) {
        const dest = `approved/${storagePath.replace(/^public-submissions\//, "")}`;
        const { error: upError } = await svc.storage
          .from("media-public")
          .upload(dest, file, { upsert: true, contentType: file.type });
        if (!upError) {
          storagePath = dest;
          url = dest;
        }
      }
    } catch {
      /* keep pending path; resolveMediaUrl still tries media-pending */
    }
  }

  const { error } = await sb
    .from("media")
    .update({
      status,
      url,
      storage_path: storagePath,
      published_at: status === "approved" ? new Date().toISOString() : null,
      moderated_by: profile?.id ?? null,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function saveArticle(article: Partial<Article> & { title_en: string }) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["war_room", "media_team"])) return { error: "Not allowed." };

  const sb = await requireServerSupabase();
  const title = article.title_en;
  const excerpt = article.excerpt_en ?? "";
  const body = article.body_en ?? "";
  const payload = {
    title_en: title,
    title_ml: title,
    excerpt_en: excerpt,
    excerpt_ml: excerpt,
    body_en: body,
    body_ml: body,
    category: article.category ?? "News",
    related_event_id: article.related_event_id ?? null,
    related_house_id: article.related_house_id ?? null,
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
    house_id: string;
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
    house_id: item.house_id,
    programme_id: item.programme_id,
    scheduled_event_id: item.scheduled_event_id ?? null,
    rank: item.rank ?? 1,
    description_en: item.description_en ?? "",
    description_ml: item.description_en ?? "",
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
  const sb = await requireServerSupabase();
  const { error } = await sb.from("profiles").update({ role }).eq("id", profileId);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function transitionResultForm(formData: FormData) {
  const id = String(formData.get("id"));
  const next = String(formData.get("next")) as ResultSetStatus;
  const result = await transitionResult(id, next);
  if (result && "error" in result && result.error) {
    redirectWarRoomError(`/war-room/results/${id}`, result.error);
  }
  await bump({ public: next === "published" });
}

export async function startCorrectionForm(formData: FormData) {
  const id = String(formData.get("id"));
  const result = await startCorrection(id);
  if (result && "error" in result && result.error) {
    redirectWarRoomError(`/war-room/results/${id}`, result.error);
  }
  await bump();
  if (result && "id" in result && result.id) {
    redirect(`/war-room/results/${result.id}`);
  }
  await failWarRoom("Could not start correction.", `/war-room/results/${id}`);
}

export async function updateEventStatusForm(formData: FormData) {
  const eventId = String(formData.get("eventId"));
  const status = String(formData.get("status")) as EventStatus;
  const result = await updateEventStatus(eventId, status);
  if (result && "error" in result && result.error) {
    await failWarRoom(result.error);
  }
  await bump({ public: true });
}

export async function moderateMediaForm(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as MediaStatus;
  const result = await moderateMedia(id, status);
  if (result && "error" in result && result.error) {
    await failWarRoom(result.error, "/war-room/content?tab=moderation");
  }
  await bump({ public: status === "approved" });
}

export async function createDraftForEventForm(formData: FormData) {
  const from = safeNextPath(String(formData.get("from") ?? "/war-room"));
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["war_room"])) {
    redirectWarRoomError(from, "Not allowed.");
  }

  const eventId = String(formData.get("eventId"));
  if (!eventId) {
    redirectWarRoomError(from, "Missing event.");
  }

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
  if (error || !data) {
    redirectWarRoomError(from, error?.message ?? "Could not create a result draft.");
  }

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
      house_id: String(formData.get(`house_${i}`)),
      participant_id: String(formData.get(`participant_${i}`) || "") || null,
      participant_name: String(formData.get(`name_${i}`) ?? ""),
      marks: formData.get(`marks_${i}`) ? Number(formData.get(`marks_${i}`)) : null,
      grade: (String(formData.get(`grade_${i}`) || "") || null) as ResultEntry["grade"],
      rank: formData.get(`rank_${i}`) ? Number(formData.get(`rank_${i}`)) : null,
    });
  }
  const result = await saveResultDraft({ resultSetId, entries });
  if (result && "error" in result && result.error) {
    redirectWarRoomError(`/war-room/results/${resultSetId}`, result.error);
  }
  await bump();
  redirect(`/war-room/results/${resultSetId}`);
}

export async function updateUserRoleForm(formData: FormData) {
  const profileId = String(formData.get("profileId"));
  const role = String(formData.get("role")) as AppRole;
  const result = await updateUserRole(profileId, role);
  if (result && "error" in result && result.error) {
    await failWarRoom(result.error, "/war-room/system?tab=users");
  }
  await bump();
}
