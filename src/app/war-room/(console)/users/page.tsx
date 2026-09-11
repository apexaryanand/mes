import { WrEmpty, WrSubmit } from "@/components/war-room/primitives";
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

  if (!profiles.length) {
    return (
      <div className="grid gap-4">
        <p className="text-sm text-muted">
          Create accounts in Supabase Auth, then assign one of three roles here.
        </p>
        <div className="card">
          <WrEmpty label="No staff profiles yet. Create users in Supabase Auth — profiles are created automatically on first login." />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">
        Create accounts in Supabase Auth, then assign one of three roles here.
      </p>
      <div className="grid gap-2">
        {profiles.map((p) => (
          <form
            key={p.id}
            action={updateUserRoleForm}
            className="card flex flex-wrap items-center gap-3 px-4 py-3"
          >
            <input type="hidden" name="profileId" value={p.id} />
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-fest-ink bg-fest-yellow font-display text-sm font-black text-fest-ink">
              {p.display_name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1 basis-48">
              <p className="truncate font-bold">{p.display_name}</p>
              <p className="truncate text-xs text-muted">{p.email ?? p.id}</p>
            </div>
            <select
              name="role"
              defaultValue={p.role}
              className="field-input min-h-10 w-auto min-w-[10rem] px-2.5 text-sm"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            <WrSubmit size="sm">{t.edit}</WrSubmit>
          </form>
        ))}
      </div>
    </div>
  );
}
