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
      {updates.map((u) => (
        <article
          key={u.id}
          className={`card p-3 sm:p-4 ${u.is_removed ? "opacity-50" : ""}`}
        >
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold-deep">
            {formatDateTime(u.created_at, locale)}
            <span className="text-line" aria-hidden>
              &bull;
            </span>
            <span className="text-kerala-dark">{u.reporter_name}</span>
          </p>
          <p className="mt-2 leading-relaxed">{u.body}</p>
          {!u.is_removed ? (
            <form action={removeLiveUpdateForm} className="mt-3">
              <input type="hidden" name="id" value={u.id} />
              <button className="rounded-full border border-live px-3 py-1.5 text-xs font-semibold text-live transition-colors hover:bg-live-soft">
                {t.remove}
              </button>
            </form>
          ) : (
            <p className="mt-2 text-xs italic text-muted">removed</p>
          )}
        </article>
      ))}
    </div>
  );
}
