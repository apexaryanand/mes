import { updateUserRole } from "@/domains/admin/actions";
import * as demo from "@/lib/data/demo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import type { AppRole } from "@/lib/types";
import { revalidatePath } from "next/cache";

const ROLES: AppRole[] = [
  "super_admin",
  "results_operator",
  "results_verifier",
  "reporter",
  "media_moderator",
  "editor",
  "photographer",
];

async function saveRole(formData: FormData) {
  "use server";
  await updateUserRole(String(formData.get("id")), String(formData.get("role")) as AppRole);
  revalidatePath("/war-room/users");
}

export default async function UsersPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  return (
    <div className="grid gap-3">
      {demo.profiles.map((p) => (
        <form
          key={p.id}
          action={saveRole}
          className="card flex flex-wrap items-center gap-3 px-4 py-3"
        >
          <input type="hidden" name="id" value={p.id} />
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-deep font-semibold text-white">
            {p.display_name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{p.display_name}</p>
            <p className="truncate text-xs text-muted">{p.email}</p>
          </div>
          <select
            name="role"
            defaultValue={p.role}
            className="min-h-10 rounded-xl border border-line bg-paper-white px-2.5 text-sm focus:border-gold"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <button className="min-h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            {t.edit}
          </button>
        </form>
      ))}
    </div>
  );
}
