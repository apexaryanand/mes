import { getSupabaseUrl } from "@/lib/utils";

export function resolveMediaUrl(url: string, bucket = "media-public"): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = getSupabaseUrl();
  if (!base) return url;
  if (url.startsWith("public-submissions/")) {
    return `${base}/storage/v1/object/public/media-pending/${url}`;
  }
  return `${base}/storage/v1/object/public/${bucket}/${url}`;
}
