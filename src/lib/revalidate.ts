import { revalidatePath } from "next/cache";

/** Refresh War Room pages after a mutation without nuking the public site cache. */
export function revalidateWarRoom() {
  revalidatePath("/war-room", "layout");
}

/** Refresh public surfaces after a publish or catalog change that is visible on the site. */
export function revalidatePublicSite() {
  revalidatePath("/");
  revalidatePath("/results");
  revalidatePath("/schedule");
  revalidatePath("/live");
  revalidatePath("/houses");
  revalidatePath("/programmes");
  revalidatePath("/stages");
  revalidatePath("/events");
  revalidatePath("/news");
  revalidatePath("/photos");
  revalidatePath("/videos");
  revalidatePath("/interviews");
}

export function revalidateEventPage(slug: string) {
  if (!slug) return;
  revalidatePath(`/events/${slug}`);
}
