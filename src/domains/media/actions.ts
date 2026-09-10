"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getRequestDictionary } from "@/lib/i18n/server";

export async function submitPublicMedia(
  _prev: { ok: boolean; message: string },
  formData: FormData,
): Promise<{ ok: boolean; message: string }> {
  const { t } = await getRequestDictionary();
  const name = String(formData.get("name") ?? "").slice(0, 80);
  const caption = String(formData.get("caption") ?? "").slice(0, 240);
  const details = String(formData.get("details") ?? "").slice(0, 1000);
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Please choose a photo or video." };
  }
  if (file.size > 40 * 1024 * 1024) {
    return { ok: false, message: "File is too large (40MB max)." };
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return { ok: false, message: "Uploads are unavailable right now. Please try again later." };
  }

  const kind = file.type.startsWith("video") ? "video" : "photo";
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `public-submissions/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("media-pending")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) {
    return { ok: false, message: uploadError.message };
  }

  const { error } = await supabase.from("media").insert({
    kind,
    title_en: caption || "Public submission",
    title_ml: caption || "പൊതു സമർപ്പണം",
    caption_en: details || caption,
    caption_ml: details || caption,
    url: path,
    storage_path: path,
    submitted_by_name: name || "Visitor",
    status: "pending",
    section: "gallery",
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: t.submissionReceived };
}
