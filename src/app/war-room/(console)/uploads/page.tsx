import { redirect } from "next/navigation";

export default function UploadsRedirect() {
  redirect("/war-room/content?tab=uploads");
}
