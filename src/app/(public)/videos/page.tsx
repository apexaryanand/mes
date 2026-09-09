import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMedia } from "@/lib/data/queries";

export default async function VideosPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const videos = await getMedia("video");
  return (
    <div className="grid gap-8">
      <PageHeader eyebrow={t.latestMedia} title={t.videos}>
        <ButtonLink href="/submit" variant="outline" size="sm">
          {t.submit}
        </ButtonLink>
      </PageHeader>
      {!videos.length ? (
        <div className="card p-10 text-center text-muted">{t.noItems}</div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        {videos.map((item) => (
          <article key={item.id} className="card overflow-hidden">
            <div className="overflow-hidden">
              {item.url.includes("youtube") ? (
                <iframe
                  title={item.title_en}
                  src={item.url}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnail_url ?? item.url}
                  alt=""
                  className="aspect-video w-full object-cover"
                />
              )}
            </div>
            <h2 className="font-display p-4 text-xl font-bold">
              {locale === "ml" ? item.title_ml : item.title_en}
            </h2>
          </article>
        ))}
      </div>
    </div>
  );
}
