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

function mirror(text: string) {
  return text;
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
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/catalog?tab=houses");

  const name_en = String(formData.get("name_en") ?? "").trim();
  const short_name = String(formData.get("short_name") ?? "").trim() || null;
  const id = String(formData.get("id") ?? "");

  if (!name_en || !id) await failWarRoom("House name is required.", "/war-room/catalog?tab=houses");

  const sb = await requireServerSupabase();
  const { error } = await sb
    .from("houses")
    .update({ name_en, name_ml: mirror(name_en), short_name })
    .eq("id", id);
  if (error) await failWarRoom(error.message, "/war-room/catalog?tab=houses");

  bump({ public: true });
}

export async function saveParticipantForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/catalog?tab=participants");

  const house_id = String(formData.get("house_id") ?? "");
  const full_name = String(formData.get("full_name") ?? "").trim();
  const class_name = String(formData.get("class_name") ?? "").trim() || null;
  const chest_number = String(formData.get("chest_number") ?? "").trim() || null;
  const id = String(formData.get("id") ?? "");

  if (!house_id || !full_name) {
    await failWarRoom("House and name are required.", "/war-room/catalog?tab=participants");
  }

  const sb = await requireServerSupabase();
  const payload = {
    house_id,
    full_name,
    full_name_ml: full_name,
    class_name,
    chest_number,
  };
  if (id) {
    const { error } = await sb.from("participants").update(payload).eq("id", id);
    if (error) await failWarRoom(error.message, "/war-room/catalog?tab=participants");
  } else {
    const { error } = await sb.from("participants").insert(payload);
    if (error) await failWarRoom(error.message, "/war-room/catalog?tab=participants");
  }

  bump();
}

export async function deleteParticipantForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/catalog?tab=participants");
  const id = String(formData.get("id"));
  const sb = await requireServerSupabase();
  const { error } = await sb.from("participants").delete().eq("id", id);
  if (error) await failWarRoom(error.message, "/war-room/catalog?tab=participants");
  bump();
}

export async function importParticipantsCsvForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/catalog?tab=participants");
  const csv = String(formData.get("csv") ?? "");
  const rows = parseCsv(csv);
  if (!rows.length) await failWarRoom("CSV is empty.", "/war-room/catalog?tab=participants");

  const sb = await requireServerSupabase();
  const { data: houses } = await sb.from("houses").select("id, slug");
  const bySlug = new Map((houses ?? []).map((h) => [String(h.slug), h.id as string]));

  const inserts = [];
  for (const row of rows) {
    const [house_slug, full_name, class_name, chest_number] = row;
    const house_id = bySlug.get(house_slug);
    if (!house_id || !full_name) continue;
    inserts.push({
      house_id,
      full_name,
      full_name_ml: full_name,
      class_name: class_name || null,
      chest_number: chest_number || null,
    });
  }

  if (!inserts.length) {
    await failWarRoom("No valid CSV rows. Use house_slug,full_name,class_name,chest_number", "/war-room/catalog?tab=participants");
  }
  const { error } = await sb.from("participants").insert(inserts);
  if (error) await failWarRoom(error.message, "/war-room/catalog?tab=participants");
  bump();
}

export async function saveCategoryForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/catalog?tab=categories");

  const code = String(formData.get("code") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const id = String(formData.get("id") ?? "");

  if (!code || !name_en) {
    await failWarRoom("Code and name are required.", "/war-room/catalog?tab=categories");
  }

  const sb = await requireServerSupabase();
  const payload = { code, name_en, name_ml: mirror(name_en), sort_order };
  if (id) {
    const { error } = await sb.from("categories").update(payload).eq("id", id);
    if (error) await failWarRoom(error.message, "/war-room/catalog?tab=categories");
  } else {
    const { error } = await sb.from("categories").insert(payload);
    if (error) await failWarRoom(error.message, "/war-room/catalog?tab=categories");
  }

  bump({ public: true });
}

export async function saveProgrammeForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/catalog?tab=programmes");

  const name_en = String(formData.get("name_en") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim() || null;
  const item_kind = String(formData.get("item_kind") ?? "individual") as ItemKind;
  const id = String(formData.get("id") ?? "");

  if (!name_en) await failWarRoom("Programme name is required.", "/war-room/catalog?tab=programmes");

  const sb = await requireServerSupabase();
  const payload = { name_en, name_ml: mirror(name_en), code, item_kind };
  if (id) {
    const { error } = await sb.from("programmes").update(payload).eq("id", id);
    if (error) await failWarRoom(error.message, "/war-room/catalog?tab=programmes");
  } else {
    const { uniqueSlug } = await import("@/lib/slug");
    const { data: existing } = await sb.from("programmes").select("slug");
    const slug = uniqueSlug(name_en, (existing ?? []).map((p) => p.slug as string));
    const { error } = await sb.from("programmes").insert({ slug, ...payload });
    if (error) await failWarRoom(error.message, "/war-room/catalog?tab=programmes");
  }

  bump({ public: true });
}

export async function saveStageForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/catalog?tab=stages");

  const name_en = String(formData.get("name_en") ?? "").trim();
  const location_en = String(formData.get("location_en") ?? "").trim() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const id = String(formData.get("id") ?? "");

  if (!name_en) await failWarRoom("Stage name is required.", "/war-room/catalog?tab=stages");

  const sb = await requireServerSupabase();
  const payload = {
    name_en,
    name_ml: mirror(name_en),
    location_en,
    location_ml: location_en,
    sort_order,
  };
  if (id) {
    const { error } = await sb.from("stages").update(payload).eq("id", id);
    if (error) await failWarRoom(error.message, "/war-room/catalog?tab=stages");
  } else {
    const { uniqueSlug } = await import("@/lib/slug");
    const { data: existing } = await sb.from("stages").select("slug");
    const slug = uniqueSlug(name_en, (existing ?? []).map((s) => s.slug as string));
    const { error } = await sb.from("stages").insert({ slug, ...payload });
    if (error) await failWarRoom(error.message, "/war-room/catalog?tab=stages");
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
  if (!can(profile?.role, [])) await failWarRoom("Not allowed.", "/war-room/system?tab=settings");

  const name_en = String(formData.get("name_en") ?? "").trim();
  const venue_en = String(formData.get("venue_en") ?? "").trim();
  const location_en = String(formData.get("location_en") ?? "").trim();
  const payload: Partial<EventSettings> = {
    name_en,
    name_ml: mirror(name_en),
    venue_en,
    venue_ml: mirror(venue_en),
    location_en,
    location_ml: mirror(location_en),
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? ""),
    current_day: Number(formData.get("current_day") ?? 1),
    live_status: String(formData.get("live_status") ?? "upcoming") as EventSettings["live_status"],
  };

  const sb = await requireServerSupabase();
  const { data: existing } = await sb.from("event_settings").select("id").limit(1).maybeSingle();

  if (existing?.id) {
    const { error } = await sb.from("event_settings").update(payload).eq("id", existing.id);
    if (error) await failWarRoom(error.message, "/war-room/system?tab=settings");
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
    if (error) await failWarRoom(error.message, "/war-room/system?tab=settings");
  }

  bump({ public: true });
}
