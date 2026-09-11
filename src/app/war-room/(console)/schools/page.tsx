import { redirect } from "next/navigation";

export default function SchoolsRedirect() {
  redirect("/war-room/catalog?tab=houses");
}
