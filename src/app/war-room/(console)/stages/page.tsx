import { redirect } from "next/navigation";

export default function StagesRedirect() {
  redirect("/war-room/catalog?tab=stages");
}
