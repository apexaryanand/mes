import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMedia } from "@/lib/data/queries";

export default async function PhotosPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const photos = await getMedia("photo");
  return (
    <div className="grid gap-4">
      <h1 className="font-display text-3xl">{t.photos}</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {photos.map((item) => (
          <figure key={item.id} className="overflow-hidden rounded border border-line bg-paper-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={locale === "ml" ? item.title_ml : item.title_en} className="aspect-[4/3] w-full object-cover" />
            <figcaption className="p-2 text-sm">
              {locale === "ml" ? item.title_ml : item.title_en}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
