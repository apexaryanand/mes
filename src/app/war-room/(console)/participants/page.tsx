import { redirect } from "next/navigation";

export default function ParticipantsRedirect() {
  redirect("/war-room/catalog?tab=participants");
}
