import { moderateMediaForm } from "@/domains/admin/actions";
import { WrEmpty, WrSubmit } from "@/components/war-room/primitives";
import { getAllMediaAdmin } from "@/lib/data/admin-queries";
import { getDictionary, statusLabel } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { resolveMediaUrl } from "@/lib/media-url";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function MediaAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const items = (await getAllMediaAdmin()).filter((item) => item.status === "pending");

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">
        Public photo/video submissions awaiting approval. Staff uploads from the media team are published directly.
      </p>
      {items.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="card grid gap-3 overflow-hidden p-4 lg:grid-cols-[11rem_1fr]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveMediaUrl(item.thumbnail_url ?? item.url)}
                alt=""
                className="aspect-[4/3] w-full border-2 border-fest-ink object-cover"
              />
              <div className="min-w-0">
                <StatusBadge status={item.status} label={statusLabel(locale, item.status)} />
                <h2 className="mt-2 font-bold">
                  {locale === "ml" ? item.title_ml : item.title_en}
                </h2>
                <p className="text-sm text-muted">
                  {item.submitted_by_name} · {item.kind}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={moderateMediaForm}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="status" value="approved" />
                    <WrSubmit size="sm">{t.approve}</WrSubmit>
                  </form>
                  <form action={moderateMediaForm}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <WrSubmit variant="danger" size="sm">{t.reject}</WrSubmit>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card">
          <WrEmpty label={t.noItems} />
        </div>
      )}
    </div>
  );
}
