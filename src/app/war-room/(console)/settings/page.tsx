import { redirect } from "next/navigation";

export default function SettingsRedirect() {
  redirect("/war-room/system?tab=settings");
}
