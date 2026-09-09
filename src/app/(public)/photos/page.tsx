import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMedia } from "@/lib/data/queries";

export default async function PhotosPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const photos = await getMedia("photo");
  return (
    <div className="grid gap-5 sm:gap-8">
      <PageHeader eyebrow={t.latestMedia} title={t.photos}>
        <ButtonLink href="/submit" variant="outline" size="sm">
          {t.submit}
        </ButtonLink>
      </PageHeader>
      {!photos.length ? (
        <div className="card p-10 text-center text-muted">{t.noItems}</div>
      ) : null}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((item) => (
          <figure
            key={item.id}
            className="group relative overflow-hidden rounded-[var(--radius)] border border-line bg-paper-white shadow-[var(--shadow-sm)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={locale === "ml" ? item.title_ml : item.title_en}
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-sm font-medium text-white">
              {locale === "ml" ? item.title_ml : item.title_en}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
