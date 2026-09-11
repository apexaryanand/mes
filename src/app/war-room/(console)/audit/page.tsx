import { redirect } from "next/navigation";

export default function AuditRedirect() {
  redirect("/war-room/system?tab=audit");
}
