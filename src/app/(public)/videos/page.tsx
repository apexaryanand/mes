import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMedia } from "@/lib/data/queries";

export default async function VideosPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const videos = await getMedia("video");
  return (
    <div className="grid gap-5 sm:gap-8">
      <PageHeader eyebrow={t.latestMedia} title={t.videos}>
        <ButtonLink href="/submit" variant="outline" size="sm">
          {t.submit}
        </ButtonLink>
      </PageHeader>
      {!videos.length ? (
        <EmptyState
          icon="media"
          title={t.noItems}
          description={t.emptyHint}
          actionHref="/submit"
          actionLabel={t.submitMedia}
        />
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        {videos.map((item) => (
          <article key={item.id} className="card flex flex-col overflow-hidden">
            <div className="overflow-hidden border-b-[var(--border-w)] border-fest-ink">
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
            <h2 className="font-display line-clamp-2 p-4 text-xl font-black">
              {locale === "ml" ? item.title_ml : item.title_en}
            </h2>
          </article>
        ))}
      </div>
    </div>
  );
}
