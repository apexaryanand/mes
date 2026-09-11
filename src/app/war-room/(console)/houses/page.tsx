import { redirect } from "next/navigation";

export default function HousesRedirect() {
  redirect("/war-room/catalog?tab=houses");
}
