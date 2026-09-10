"use server";

import { can, getSessionProfile } from "@/lib/auth";
import { resolveMediaUrl } from "@/lib/media-url";
import { requireServerSupabase } from "@/lib/supabase/require";
import type { MediaKind, MediaSection } from "@/lib/types";

async function bump() {
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/", "layout");
}

export async function uploadStaffMediaForm(formData: FormData) {
  const profile = await getSessionProfile();
  if (!can(profile?.role, ["media_team"])) return;

  const kind = String(formData.get("kind") ?? "photo") as MediaKind;
  const section = String(formData.get("section") ?? "gallery") as MediaSection;
  const title_en = String(formData.get("title_en") ?? "").trim();
  const title_ml = String(formData.get("title_ml") ?? "").trim();
  const caption_en = String(formData.get("caption_en") ?? "").trim();
  const caption_ml = String(formData.get("caption_ml") ?? "").trim();
  const externalUrl = String(formData.get("video_url") ?? "").trim();
  const file = formData.get("file");

  if (!title_en || !title_ml) return;

  const sb = await requireServerSupabase();
  let publicUrl = externalUrl;
  let storagePath: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > 80 * 1024 * 1024) return;
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `staff/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await sb.storage
      .from("media-public")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) return;
    storagePath = path;
    publicUrl = resolveMediaUrl(path);
  } else if (!externalUrl) {
    return;
  }

  const { error } = await sb.from("media").insert({
    kind: externalUrl && !file ? "video" : kind,
    section,
    title_en,
    title_ml,
    caption_en: caption_en || null,
    caption_ml: caption_ml || null,
    url: publicUrl,
    storage_path: storagePath,
    submitted_by_name: profile?.display_name ?? "Media team",
    status: "approved",
    published_at: new Date().toISOString(),
    moderated_by: profile?.id ?? null,
  });
  if (error) return;

  await bump();
}
