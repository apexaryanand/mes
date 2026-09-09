import { redirect } from "next/navigation";
import { WarRoomNav } from "@/components/war-room/nav";
import { getSessionProfile } from "@/lib/auth";

export default async function WarRoomConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSessionProfile();
  if (!profile) redirect("/war-room/login");

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 text-ink md:flex-row">
      <WarRoomNav role={profile.role} name={profile.display_name} />
      <div className="min-w-0 flex-1 p-4 md:p-6">{children}</div>
    </div>
  );
}
