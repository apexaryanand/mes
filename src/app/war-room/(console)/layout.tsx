import { redirect } from "next/navigation";
import { WarRoomShell } from "@/components/war-room/nav";
import { getSessionProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function WarRoomConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSessionProfile();
  if (!profile) redirect("/war-room/login");

  return (
    <WarRoomShell role={profile.role} name={profile.display_name}>
      {children}
    </WarRoomShell>
  );
}
