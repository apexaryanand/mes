import { redirect } from "next/navigation";

export default function InterviewsRedirect() {
  redirect("/war-room/content?tab=interviews");
}
