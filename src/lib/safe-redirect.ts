/** Allow only same-origin relative paths (blocks //evil.com and https://...). */
export function safeNextPath(raw: string | null | undefined, fallback = "/war-room"): string {
  if (!raw) return fallback;
  const next = raw.trim();
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  if (next.includes("://")) return fallback;
  return next;
}
