import { redirect } from "next/navigation";

export default function ArticlesRedirect() {
  redirect("/war-room/content?tab=articles");
}
