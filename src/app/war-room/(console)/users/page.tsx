import { redirect } from "next/navigation";

export default function UsersRedirect() {
  redirect("/war-room/system?tab=users");
}
