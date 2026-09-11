"use server";

import { can, getSessionProfile } from "@/lib/auth";
import { requireServerSupabase } from "@/lib/supabase/require";
import type { EventSettings, ItemKind, ScoringRules } from "@/lib/types";
import { revalidatePublicSite, revalidateWarRoom } from "@/lib/revalidate";
import { failWarRoom } from "@/lib/war-room-error";

function bump(opts?: { public?: boolean }) {
  revalidateWarRoom();
  if (opts?.public) revalidatePublicSite();
}

function parseCsv(text: string) {
  return text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

export async function saveHouseForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/houses");

  const name_en = String(formData.get("name_en") ?? "").trim();
  const name_ml = String(formData.get("name_ml") ?? "").trim();
  const short_name = String(formData.get("short_name") ?? "").trim() || null;
  const id = String(formData.get("id") ?? "");

  if (!name_en || !name_ml || !id) await failWarRoom("House name is required.", "/war-room/houses");

  const sb = await requireServerSupabase();
  const { error } = await sb
    .from("houses")
    .update({ name_en, name_ml, short_name })
    .eq("id", id);
  if (error) await failWarRoom(error.message, "/war-room/houses");

  bump({ public: true });
}

export async function saveParticipantForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/participants");

  const house_id = String(formData.get("house_id") ?? "");
  const full_name = String(formData.get("full_name") ?? "").trim();
  const full_name_ml = String(formData.get("full_name_ml") ?? "").trim() || null;
  const class_name = String(formData.get("class_name") ?? "").trim() || null;
  const chest_number = String(formData.get("chest_number") ?? "").trim() || null;
  const id = String(formData.get("id") ?? "");

  if (!house_id || !full_name) {
    await failWarRoom("House and name are required.", "/war-room/participants");
  }

  const sb = await requireServerSupabase();
  if (id) {
    const { error } = await sb
      .from("participants")
      .update({ house_id, full_name, full_name_ml, class_name, chest_number })
      .eq("id", id);
    if (error) await failWarRoom(error.message, "/war-room/participants");
  } else {
    const { error } = await sb.from("participants").insert({
      house_id,
      full_name,
      full_name_ml,
      class_name,
      chest_number,
    });
    if (error) await failWarRoom(error.message, "/war-room/participants");
  }

  bump();
}

export async function deleteParticipantForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/participants");
  const id = String(formData.get("id"));
  const sb = await requireServerSupabase();
  const { error } = await sb.from("participants").delete().eq("id", id);
  if (error) await failWarRoom(error.message, "/war-room/participants");
  bump();
}

export async function importParticipantsCsvForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/participants");
  const csv = String(formData.get("csv") ?? "");
  const rows = parseCsv(csv);
  if (!rows.length) await failWarRoom("CSV is empty.", "/war-room/participants");

  const sb = await requireServerSupabase();
  const { data: houses } = await sb.from("houses").select("id, slug");
  const bySlug = new Map((houses ?? []).map((h) => [String(h.slug), h.id as string]));

  const inserts = [];
  for (const row of rows) {
    const [house_slug, full_name, full_name_ml, class_name, chest_number] = row;
    const house_id = bySlug.get(house_slug);
    if (!house_id || !full_name) continue;
    inserts.push({
      house_id,
      full_name,
      full_name_ml: full_name_ml || null,
      class_name: class_name || null,
      chest_number: chest_number || null,
    });
  }

  if (!inserts.length) {
    await failWarRoom("No valid CSV rows. Use house_slug,full_name,…", "/war-room/participants");
  }
  const { error } = await sb.from("participants").insert(inserts);
  if (error) await failWarRoom(error.message, "/war-room/participants");
  bump();
}

export async function saveCategoryForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/categories");

  const code = String(formData.get("code") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  const name_ml = String(formData.get("name_ml") ?? "").trim();
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const id = String(formData.get("id") ?? "");

  if (!code || !name_en || !name_ml) {
    await failWarRoom("Code and names are required.", "/war-room/categories");
  }

  const sb = await requireServerSupabase();
  if (id) {
    const { error } = await sb
      .from("categories")
      .update({ code, name_en, name_ml, sort_order })
      .eq("id", id);
    if (error) await failWarRoom(error.message, "/war-room/categories");
  } else {
    const { error } = await sb.from("categories").insert({ code, name_en, name_ml, sort_order });
    if (error) await failWarRoom(error.message, "/war-room/categories");
  }

  bump({ public: true });
}

export async function saveProgrammeForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/programmes");

  const name_en = String(formData.get("name_en") ?? "").trim();
  const name_ml = String(formData.get("name_ml") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim() || null;
  const item_kind = String(formData.get("item_kind") ?? "individual") as ItemKind;
  const id = String(formData.get("id") ?? "");

  if (!name_en || !name_ml) await failWarRoom("Programme names are required.", "/war-room/programmes");

  const sb = await requireServerSupabase();
  if (id) {
    const { error } = await sb
      .from("programmes")
      .update({ name_en, name_ml, code, item_kind })
      .eq("id", id);
    if (error) await failWarRoom(error.message, "/war-room/programmes");
  } else {
    const { uniqueSlug } = await import("@/lib/slug");
    const { data: existing } = await sb.from("programmes").select("slug");
    const slug = uniqueSlug(name_en, (existing ?? []).map((p) => p.slug as string));
    const { error } = await sb.from("programmes").insert({
      slug,
      name_en,
      name_ml,
      code,
      item_kind,
    });
    if (error) await failWarRoom(error.message, "/war-room/programmes");
  }

  bump({ public: true });
}

export async function saveStageForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/stages");

  const name_en = String(formData.get("name_en") ?? "").trim();
  const name_ml = String(formData.get("name_ml") ?? "").trim();
  const location_en = String(formData.get("location_en") ?? "").trim() || null;
  const location_ml = String(formData.get("location_ml") ?? "").trim() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const id = String(formData.get("id") ?? "");

  if (!name_en || !name_ml) await failWarRoom("Stage names are required.", "/war-room/stages");

  const sb = await requireServerSupabase();
  if (id) {
    const { error } = await sb
      .from("stages")
      .update({ name_en, name_ml, location_en, location_ml, sort_order })
      .eq("id", id);
    if (error) await failWarRoom(error.message, "/war-room/stages");
  } else {
    const { uniqueSlug } = await import("@/lib/slug");
    const { data: existing } = await sb.from("stages").select("slug");
    const slug = uniqueSlug(name_en, (existing ?? []).map((s) => s.slug as string));
    const { error } = await sb.from("stages").insert({
      slug,
      name_en,
      name_ml,
      location_en,
      location_ml,
      sort_order,
    });
    if (error) await failWarRoom(error.message, "/war-room/stages");
  }

  bump({ public: true });
}

export async function saveScheduledEventForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["war_room"])) {
    await failWarRoom("Not allowed.", "/war-room/schedule");
  }

  const programme_id = String(formData.get("programme_id") ?? "");
  const category_id = String(formData.get("category_id") ?? "");
  const stage_id = String(formData.get("stage_id") ?? "");
  const day_number = Number(formData.get("day_number") ?? 1);
  const event_date = String(formData.get("event_date") ?? "");
  const start_time = String(formData.get("start_time") ?? "");
  const end_time = String(formData.get("end_time") ?? "") || null;
  const status = String(formData.get("status") ?? "upcoming");
  const id = String(formData.get("id") ?? "");

  if (!programme_id || !category_id || !stage_id || !event_date || !start_time) {
    await failWarRoom("Programme, category, stage, date and start time are required.", "/war-room/schedule");
  }

  const sb = await requireServerSupabase();
  const [{ data: programme }, { data: category }] = await Promise.all([
    sb.from("programmes").select("name_en").eq("id", programme_id).maybeSingle(),
    sb.from("categories").select("code").eq("id", category_id).maybeSingle(),
  ]);
  const slugBase = `${programme?.name_en ?? "event"}-${category?.code ?? "cat"}-${day_number}`;

  if (id) {
    const { error } = await sb
      .from("scheduled_events")
      .update({
        programme_id,
        category_id,
        stage_id,
        day_number,
        event_date,
        start_time,
        end_time,
        status,
      })
      .eq("id", id);
    if (error) await failWarRoom(error.message, "/war-room/schedule");
  } else {
    const { uniqueSlug } = await import("@/lib/slug");
    const { data: existing } = await sb.from("scheduled_events").select("slug");
    const slug = uniqueSlug(slugBase, (existing ?? []).map((e) => e.slug as string));
    const { error } = await sb.from("scheduled_events").insert({
      slug,
      programme_id,
      category_id,
      stage_id,
      day_number,
      event_date,
      start_time,
      end_time,
      status,
    });
    if (error) await failWarRoom(error.message, "/war-room/schedule");
  }

  bump({ public: true });
}

export async function saveEventSettingsForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/settings");

  const payload: Partial<EventSettings> = {
    name_en: String(formData.get("name_en") ?? "").trim(),
    name_ml: String(formData.get("name_ml") ?? "").trim(),
    venue_en: String(formData.get("venue_en") ?? "").trim(),
    venue_ml: String(formData.get("venue_ml") ?? "").trim(),
    location_en: String(formData.get("location_en") ?? "").trim(),
    location_ml: String(formData.get("location_ml") ?? "").trim(),
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? ""),
    current_day: Number(formData.get("current_day") ?? 1),
    live_status: String(formData.get("live_status") ?? "upcoming") as EventSettings["live_status"],
  };

  const sb = await requireServerSupabase();
  const { data: existing } = await sb.from("event_settings").select("id").limit(1).maybeSingle();

  if (existing?.id) {
    const { error } = await sb.from("event_settings").update(payload).eq("id", existing.id);
    if (error) await failWarRoom(error.message, "/war-room/settings");
  } else {
    const { error } = await sb.from("event_settings").insert({
      slug: "mesta-2026",
      ...payload,
      scoring_rules: {
        grade_points: { A: 5, B: 3, C: 1 },
        rank_points: { "1": 0, "2": 0, "3": 0 },
        group_multiplier: 1,
        grade_thresholds: { A: 80, B: 70, C: 60 },
        max_marks: 100,
      } satisfies ScoringRules,
    });
    if (error) await failWarRoom(error.message, "/war-room/settings");
  }

  bump({ public: true });
}
