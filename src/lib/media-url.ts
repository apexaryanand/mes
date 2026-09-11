import { getSupabaseUrl } from "@/lib/utils";

export function resolveMediaUrl(url: string, bucket = "media-public"): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = getSupabaseUrl();
  if (!base) return url;
  if (url.startsWith("public-submissions/")) {
    return `${base}/storage/v1/object/public/media-pending/${url}`;
  }
  if (url.startsWith("approved/")) {
    return `${base}/storage/v1/object/public/media-public/${url}`;
  }
  return `${base}/storage/v1/object/public/${bucket}/${url}`;
}

export function youtubeEmbedUrl(url: string): string | null {
  try {
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (url.includes("youtube.com")) {
      if (url.includes("/embed/")) return url;
      const parsed = new URL(url);
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
  } catch {
    return null;
  }
  return null;
}
