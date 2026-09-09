import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMedia } from "@/lib/data/queries";

export default async function VideosPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const videos = await getMedia("video");
  return (
    <div className="grid gap-6">
      <h1 className="font-display text-3xl">{t.videos}</h1>
      {videos.map((item) => (
        <article key={item.id} className="rounded border border-line bg-paper-white p-3">
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
            <img src={item.thumbnail_url ?? item.url} alt="" className="aspect-video w-full object-cover" />
          )}
          <h2 className="mt-3 font-display text-xl">{locale === "ml" ? item.title_ml : item.title_en}</h2>
        </article>
      ))}
    </div>
  );
}
