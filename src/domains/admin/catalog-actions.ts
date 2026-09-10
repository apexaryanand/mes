"use server";

import { can, getSessionProfile } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";
import { requireServerSupabase } from "@/lib/supabase/require";
import type { EventSettings, ItemKind, ScoringRules } from "@/lib/types";

async function bump() {
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/", "layout");
}

function parseCsv(text: string) {
  return text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

export async function saveSchoolForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) return;

  const name_en = String(formData.get("name_en") ?? "").trim();
  const name_ml = String(formData.get("name_ml") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim() || null;
  const short_name = String(formData.get("short_name") ?? "").trim() || null;
  const id = String(formData.get("id") ?? "");

  if (!name_en || !name_ml) return;

  const sb = await requireServerSupabase();
  const { data: existing } = await sb.from("schools").select("slug");
  const slugs = (existing ?? []).map((s) => s.slug as string);

  if (id) {
    const { error } = await sb
      .from("schools")
      .update({ name_en, name_ml, code, short_name })
      .eq("id", id);
    if (error) return;
  } else {
    const slug = uniqueSlug(name_en, slugs);
    const { error } = await sb.from("schools").insert({
      slug,
      name_en,
      name_ml,
      code,
      short_name,
    });
    if (error) return;
  }

  await bump();
  return;
}

export async function deleteSchoolForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) return;
  const id = String(formData.get("id"));
  const sb = await requireServerSupabase();
  const { error } = await sb.from("schools").delete().eq("id", id);
  if (error) return;
  await bump();
  return;
}

export async function importSchoolsCsvForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) return;
  const csv = String(formData.get("csv") ?? "");
  const rows = parseCsv(csv);
  if (!rows.length) return;

  const sb = await requireServerSupabase();
  const { data: existing } = await sb.from("schools").select("slug");
  const slugs = (existing ?? []).map((s) => s.slug as string);
  const inserts = [];

  for (const row of rows) {
    const [code, name_en, name_ml, short_name] = row;
    if (!name_en || !name_ml) continue;
    const slug = uniqueSlug(name_en, [...slugs, ...inserts.map((i) => i.slug)]);
    inserts.push({
      slug,
      code: code || null,
      name_en,
      name_ml,
      short_name: short_name || null,
    });
    slugs.push(slug);
  }

  if (!inserts.length) return;
  const { error } = await sb.from("schools").insert(inserts);
  if (error) return;
  await bump();
  return;
}

export async function saveParticipantForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) return;

  const school_id = String(formData.get("school_id") ?? "");
  const full_name = String(formData.get("full_name") ?? "").trim();
  const full_name_ml = String(formData.get("full_name_ml") ?? "").trim() || null;
  const class_name = String(formData.get("class_name") ?? "").trim() || null;
  const chest_number = String(formData.get("chest_number") ?? "").trim() || null;
  const id = String(formData.get("id") ?? "");

  if (!school_id || !full_name) return;

  const sb = await requireServerSupabase();
  if (id) {
    const { error } = await sb
      .from("participants")
      .update({ school_id, full_name, full_name_ml, class_name, chest_number })
      .eq("id", id);
    if (error) return;
  } else {
    const { error } = await sb.from("participants").insert({
      school_id,
      full_name,
      full_name_ml,
      class_name,
      chest_number,
    });
    if (error) return;
  }

  await bump();
  return;
}

export async function deleteParticipantForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) return;
  const id = String(formData.get("id"));
  const sb = await requireServerSupabase();
  const { error } = await sb.from("participants").delete().eq("id", id);
  if (error) return;
  await bump();
  return;
}

export async function importParticipantsCsvForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) return;
  const csv = String(formData.get("csv") ?? "");
  const rows = parseCsv(csv);
  if (!rows.length) return;

  const sb = await requireServerSupabase();
  const { data: schools } = await sb.from("schools").select("id, code");
  const byCode = new Map((schools ?? []).map((s) => [String(s.code), s.id as string]));

  const inserts = [];
  for (const row of rows) {
    const [school_code, full_name, full_name_ml, class_name, chest_number] = row;
    const school_id = byCode.get(school_code);
    if (!school_id || !full_name) continue;
    inserts.push({
      school_id,
      full_name,
      full_name_ml: full_name_ml || null,
      class_name: class_name || null,
      chest_number: chest_number || null,
    });
  }

  if (!inserts.length) return;
  const { error } = await sb.from("participants").insert(inserts);
  if (error) return;
  await bump();
  return;
}

export async function saveCategoryForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) return;

  const code = String(formData.get("code") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  const name_ml = String(formData.get("name_ml") ?? "").trim();
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const id = String(formData.get("id") ?? "");

  if (!code || !name_en || !name_ml) return;

  const sb = await requireServerSupabase();
  if (id) {
    const { error } = await sb
      .from("categories")
      .update({ code, name_en, name_ml, sort_order })
      .eq("id", id);
    if (error) return;
  } else {
    const { error } = await sb.from("categories").insert({ code, name_en, name_ml, sort_order });
    if (error) return;
  }

  await bump();
  return;
}

export async function saveProgrammeForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) return;

  const name_en = String(formData.get("name_en") ?? "").trim();
  const name_ml = String(formData.get("name_ml") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim() || null;
  const item_kind = String(formData.get("item_kind") ?? "individual") as ItemKind;
  const id = String(formData.get("id") ?? "");

  if (!name_en || !name_ml) return;

  const sb = await requireServerSupabase();
  if (id) {
    const { error } = await sb
      .from("programmes")
      .update({ name_en, name_ml, code, item_kind })
      .eq("id", id);
    if (error) return;
  } else {
    const { data: existing } = await sb.from("programmes").select("slug");
    const slug = uniqueSlug(name_en, (existing ?? []).map((p) => p.slug as string));
    const { error } = await sb.from("programmes").insert({
      slug,
      name_en,
      name_ml,
      code,
      item_kind,
    });
    if (error) return;
  }

  await bump();
  return;
}

export async function saveStageForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) return;

  const name_en = String(formData.get("name_en") ?? "").trim();
  const name_ml = String(formData.get("name_ml") ?? "").trim();
  const location_en = String(formData.get("location_en") ?? "").trim() || null;
  const location_ml = String(formData.get("location_ml") ?? "").trim() || null;
  const sort_order = Number(formData.get("sort_order") ?? 0);
  const id = String(formData.get("id") ?? "");

  if (!name_en || !name_ml) return;

  const sb = await requireServerSupabase();
  if (id) {
    const { error } = await sb
      .from("stages")
      .update({ name_en, name_ml, location_en, location_ml, sort_order })
      .eq("id", id);
    if (error) return;
  } else {
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
    if (error) return;
  }

  await bump();
  return;
}

export async function saveScheduledEventForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) {
    return;
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
    return;
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
    if (error) return;
  } else {
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
    if (error) return;
  }

  await bump();
  return;
}

export async function saveEventSettingsForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, [])) return;

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
    if (error) return;
  } else {
    const { error } = await sb.from("event_settings").insert({
      slug: "mes-hss-irimbiliyam-2026",
      ...payload,
      scoring_rules: {
        grade_points: { A: 5, B: 3, C: 1 },
        rank_points: { "1": 0, "2": 0, "3": 0 },
        group_multiplier: 1,
        grade_thresholds: { A: 80, B: 70, C: 60 },
        max_marks: 100,
      } satisfies ScoringRules,
    });
    if (error) return;
  }

  await bump();
  return;
}
