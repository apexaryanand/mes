import { removeLiveUpdateForm } from "@/domains/admin/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getLiveUpdates } from "@/lib/data/queries";
import * as demo from "@/lib/data/demo";
import { formatDateTime } from "@/lib/utils";

export default async function LiveAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const updates = [...demo.liveUpdates].sort((a, b) => b.created_at.localeCompare(a.created_at));
  void getLiveUpdates;

  return (
    <div className="grid gap-3">
      <h1 className="font-display text-3xl">{t.liveUpdates}</h1>
      {updates.map((u) => (
        <article key={u.id} className={`rounded border border-line bg-white p-4 ${u.is_removed ? "opacity-50" : ""}`}>
          <p className="text-xs text-muted">
            {formatDateTime(u.created_at, locale)} · {u.reporter_name}
          </p>
          <p className="mt-2">{u.body}</p>
          {!u.is_removed ? (
            <form action={removeLiveUpdateForm} className="mt-2">
              <input type="hidden" name="id" value={u.id} />
              <button className="text-sm text-live">{t.remove}</button>
            </form>
          ) : (
            <p className="text-xs text-muted">removed</p>
          )}
        </article>
      ))}
    </div>
  );
}
