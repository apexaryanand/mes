import { redirect } from "next/navigation";

export default function ProgrammesRedirect() {
  redirect("/war-room/catalog?tab=programmes");
}
