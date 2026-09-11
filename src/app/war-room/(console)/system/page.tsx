import { Suspense } from "react";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { AuditPanel, SettingsPanel, UsersPanel } from "@/components/admin/system-panels";
import { adminCopy } from "@/lib/admin/copy";
import { getSessionProfile } from "@/lib/auth";
import { getAllProfiles, getAuditLogs } from "@/lib/data/admin-queries";
import { getSettings } from "@/lib/data/queries";
import type { AppRole } from "@/lib/types";

const TAB_ROLES: Record<string, AppRole[]> = {
  settings: ["super_admin"],
  users: ["super_admin"],
  audit: ["super_admin", "war_room"],
};

export default async function SystemPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const profile = await getSessionProfile();
  const role = profile?.role ?? "war_room";
  const tabs = [
    { id: "settings", label: adminCopy.settingsTab },
    { id: "users", label: adminCopy.users },
    { id: "audit", label: adminCopy.audit },
  ].filter((t) => TAB_ROLES[t.id]?.includes(role) || role === "super_admin");

  const { tab = tabs[0]?.id ?? "audit" } = await searchParams;
  const active = tabs.some((t) => t.id === tab) ? tab : tabs[0]?.id;

  const [settings, profiles, logs] = await Promise.all([
    active === "settings" ? getSettings() : Promise.resolve(null),
    active === "users" ? getAllProfiles() : Promise.resolve([]),
    active === "audit" ? getAuditLogs() : Promise.resolve([]),
  ]);

  return (
    <AdminPage title={adminCopy.system} description={adminCopy.systemHelp}>
      <Suspense fallback={null}>
        <AdminTabs basePath="/war-room/system" tabs={tabs} />
      </Suspense>
      <div className="pt-4">
        {active === "settings" && settings ? <SettingsPanel settings={settings} /> : null}
        {active === "users" ? <UsersPanel profiles={profiles} /> : null}
        {active === "audit" ? <AuditPanel logs={logs} /> : null}
      </div>
    </AdminPage>
  );
}
