import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { safeNextPath } from "@/lib/safe-redirect";

export function warRoomErrorPath(path: string, error: string) {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}error=${encodeURIComponent(error)}`;
}

export function redirectWarRoomError(path: string, error: string): never {
  redirect(warRoomErrorPath(path, error));
}

/** Fail back to the page the operator submitted from (or fallback). */
export async function failWarRoom(error: string, fallback = "/war-room"): Promise<never> {
  const headerList = await headers();
  const referer = headerList.get("referer");
  let path = fallback;
  if (referer) {
    try {
      const url = new URL(referer);
      path = safeNextPath(url.pathname || fallback, fallback);
    } catch {
      path = fallback;
    }
  }
  redirectWarRoomError(path, error);
}
