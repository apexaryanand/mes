import { moderateMediaForm } from "@/domains/admin/actions";
import * as demo from "@/lib/data/demo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function MediaAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const items = [...demo.mediaItems].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <div className="grid gap-4">
      <h1 className="font-display text-3xl">{t.mediaModeration}</h1>
      {items.map((item) => (
        <article key={item.id} className="grid gap-3 rounded border border-line bg-white p-4 md:grid-cols-[200px_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.thumbnail_url ?? item.url} alt="" className="aspect-[4/3] w-full object-cover" />
          <div>
            <StatusBadge status={item.status} label={item.status} />
            <h2 className="mt-2 font-semibold">{locale === "ml" ? item.title_ml : item.title_en}</h2>
            <p className="text-sm text-muted">{item.submitted_by_name} · {item.kind}</p>
            {item.status === "pending" ? (
              <div className="mt-3 flex gap-2">
                <form action={moderateMediaForm}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="status" value="approved" />
                  <button className="min-h-10 rounded bg-kerala px-3 text-white">{t.approve}</button>
                </form>
                <form action={moderateMediaForm}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <button className="min-h-10 rounded border border-live px-3 text-live">{t.reject}</button>
                </form>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
