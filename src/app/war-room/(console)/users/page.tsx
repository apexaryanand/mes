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
      <h1 className="font-display text-3xl">{t.userManagement}</h1>
      {demo.profiles.map((p) => (
        <form key={p.id} action={saveRole} className="flex flex-wrap items-center gap-3 rounded border border-line bg-white px-4 py-3">
          <input type="hidden" name="id" value={p.id} />
          <div className="flex-1">
            <p className="font-medium">{p.display_name}</p>
            <p className="text-xs text-muted">{p.email}</p>
          </div>
          <select name="role" defaultValue={p.role} className="min-h-10 rounded border border-line px-2">
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button className="min-h-10 rounded bg-zinc-800 px-3 text-white">{t.edit}</button>
        </form>
      ))}
    </div>
  );
}
