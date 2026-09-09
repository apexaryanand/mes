import { moderateMediaForm } from "@/domains/admin/actions";
import { getAllMediaAdmin } from "@/lib/data/admin-queries";
import { getDictionary, statusLabel } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function MediaAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const items = await getAllMediaAdmin();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.length ? (
        items.map((item) => (
          <article
            key={item.id}
            className="card grid gap-2 overflow-hidden p-3 sm:grid-cols-[160px_1fr] sm:gap-3 sm:p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.thumbnail_url ?? item.url}
              alt=""
              className="aspect-[4/3] w-full rounded-lg object-cover"
            />
            <div>
              <StatusBadge status={item.status} label={statusLabel(locale, item.status)} />
              <h2 className="mt-2 font-semibold">
                {locale === "ml" ? item.title_ml : item.title_en}
              </h2>
              <p className="text-sm text-muted">
                {item.submitted_by_name} · {item.kind}
              </p>
              {item.status === "pending" ? (
                <div className="mt-3 flex gap-2">
                  <form action={moderateMediaForm}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="status" value="approved" />
                    <button className="min-h-10 rounded-full bg-kerala-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-kerala-deep">
                      {t.approve}
                    </button>
                  </form>
                  <form action={moderateMediaForm}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button className="min-h-10 rounded-full border border-live px-4 text-sm font-semibold text-live transition-colors hover:bg-live-soft">
                      {t.reject}
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          </article>
        ))
      ) : (
        <p className="card p-6 text-center text-sm text-muted md:col-span-2">{t.noItems}</p>
      )}
    </div>
  );
}
