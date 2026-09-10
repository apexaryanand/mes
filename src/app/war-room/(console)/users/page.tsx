import { updateUserRoleForm } from "@/domains/admin/actions";
import { getAllProfiles } from "@/lib/data/admin-queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import type { AppRole } from "@/lib/types";

const ROLES: AppRole[] = ["super_admin", "war_room", "media_team"];

const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  war_room: "War Room",
  media_team: "Media Team",
};

export default async function UsersPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const profiles = await getAllProfiles();

  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted">
        Create accounts in Supabase Auth, then assign one of three roles here.
      </p>
      {profiles.length ? (
        profiles.map((p) => (
          <form
            key={p.id}
            action={updateUserRoleForm}
            className="card flex flex-wrap items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
          >
            <input type="hidden" name="profileId" value={p.id} />
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-deep font-semibold text-white">
              {p.display_name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.display_name}</p>
              <p className="truncate text-xs text-muted">{p.email ?? p.id}</p>
            </div>
            <select
              name="role"
              defaultValue={p.role}
              className="min-h-10 rounded-xl border border-line bg-paper-white px-2.5 text-sm focus:border-gold"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            <button className="min-h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              {t.edit}
            </button>
          </form>
        ))
      ) : (
        <p className="card p-6 text-center text-sm text-muted">
          No staff profiles yet. Create users in Supabase Auth — profiles are created automatically on first login.
        </p>
      )}
    </div>
  );
}
