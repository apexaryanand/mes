import { saveEventSettingsForm } from "@/domains/admin/catalog-actions";
import { updateUserRoleForm } from "@/domains/admin/actions";
import { AdminField, adminInput } from "@/components/admin/admin-field";
import { AdminSubmit } from "@/components/admin/admin-submit";
import { AdminEmpty, AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { adminCopy } from "@/lib/admin/copy";
import { ADMIN_LOCALE } from "@/lib/admin/locale";
import type { AppRole, AuditLog, EventSettings, Profile } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const ROLES: AppRole[] = ["super_admin", "war_room", "media_team"];
const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  war_room: "War Room",
  media_team: "Media Team",
};

export function SettingsPanel({ settings }: { settings: EventSettings }) {
  return (
    <form action={saveEventSettingsForm} className="max-w-2xl rounded-lg border border-zinc-200 bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminField label="Festival name">
          <input name="name_en" required className={adminInput} defaultValue={settings.name_en} />
        </AdminField>
        <AdminField label="Venue">
          <input name="venue_en" required className={adminInput} defaultValue={settings.venue_en} />
        </AdminField>
        <AdminField label="Location">
          <input name="location_en" required className={adminInput} defaultValue={settings.location_en} />
        </AdminField>
        <AdminField label="Start date">
          <input name="start_date" type="date" required className={adminInput} defaultValue={settings.start_date} />
        </AdminField>
        <AdminField label="End date">
          <input name="end_date" type="date" required className={adminInput} defaultValue={settings.end_date} />
        </AdminField>
        <AdminField label={adminCopy.currentDay}>
          <input name="current_day" type="number" min={1} max={3} className={adminInput} defaultValue={settings.current_day ?? 1} />
        </AdminField>
        <AdminField label="Live status">
          <select name="live_status" className={adminInput} defaultValue={settings.live_status}>
            <option value="upcoming">upcoming</option>
            <option value="live">live</option>
            <option value="concluded">concluded</option>
          </select>
        </AdminField>
      </div>
      <AdminSubmit className="mt-4">Save settings</AdminSubmit>
    </form>
  );
}

export function UsersPanel({ profiles }: { profiles: Profile[] }) {
  if (!profiles.length) {
    return (
      <AdminEmpty label="No staff profiles yet. Create users in Supabase Auth — profiles are created automatically on first login." />
    );
  }
  return (
    <div className="grid gap-2">
      {profiles.map((p) => (
        <form key={p.id} action={updateUserRoleForm} className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <input type="hidden" name="profileId" value={p.id} />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-zinc-900">{p.display_name}</p>
            <p className="text-xs text-zinc-500">{p.email ?? p.id}</p>
          </div>
          <select name="role" defaultValue={p.role} className={adminInput}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
          <AdminSubmit variant="secondary">{adminCopy.saveChanges}</AdminSubmit>
        </form>
      ))}
    </div>
  );
}

export function AuditPanel({ logs }: { logs: AuditLog[] }) {
  if (!logs.length) return <AdminEmpty label="No audit entries yet." />;
  return (
    <AdminTable>
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr>
            <AdminTh>Action</AdminTh>
            <AdminTh>Actor</AdminTh>
            <AdminTh>Entity</AdminTh>
            <AdminTh>Time</AdminTh>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <AdminTd className="font-medium">{log.action}</AdminTd>
              <AdminTd>{log.actor_name}</AdminTd>
              <AdminTd className="text-zinc-500">{log.entity_type}</AdminTd>
              <AdminTd className="tabular text-zinc-500">{formatDateTime(log.created_at, ADMIN_LOCALE)}</AdminTd>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminTable>
  );
}
