import { PageHeader } from "@/components/ui/page-header";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getReportings } from "@/lib/data/queries";

export default async function ReportingsPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const items = await getReportings();

  return (
    <div className="grid gap-5 sm:gap-8">
      <PageHeader eyebrow={t.reportings} title={t.reportings} description={t.reportingsHelp} />
      {!items.length ? (
        <div className="card p-10 text-center text-muted">{t.noItems}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="card overflow-hidden">
              <div className="aspect-video bg-ink">
                {item.url.includes("youtube.com") || item.url.includes("youtu.be") ? (
                  <iframe
                    src={item.url.includes("embed") ? item.url : item.url.replace("watch?v=", "embed/")}
                    title={locale === "ml" ? item.title_ml : item.title_en}
                    className="h-full w-full"
                    allowFullScreen
                  />
                ) : (
                  <video src={item.url} controls className="h-full w-full" />
                )}
              </div>
              <div className="p-4">
                <h2 className="font-display text-lg font-bold">
                  {locale === "ml" ? item.title_ml : item.title_en}
                </h2>
                {item.caption_en ? (
                  <p className="mt-1 text-sm text-muted">
                    {locale === "ml" ? item.caption_ml : item.caption_en}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
