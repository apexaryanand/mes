import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getInterviews } from "@/lib/data/queries";

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const interviews = await getInterviews();
  const item = interviews.find((i) => i.slug === slug);
  if (!item) notFound();

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/interviews" className="hover:text-kerala-dark">
          {t.interviews}
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-ink">{item.winner_name}</span>
      </nav>
      <header>
        <h1 className="font-display text-display-md font-bold">{item.winner_name}</h1>
        <p className="mt-1 text-muted">
          {tName(locale, item.school)} · {tName(locale, item.programme)}
          {item.rank ? ` · ${item.rank}` : ""}
        </p>
      </header>
      <iframe
        title={item.winner_name}
        src={item.video_url}
        className="aspect-video w-full overflow-hidden rounded-[var(--radius)] border border-line shadow-[var(--shadow-md)]"
        allowFullScreen
      />
      <p className="text-lg leading-relaxed">
        {locale === "ml" ? item.description_ml : item.description_en}
      </p>
      {item.event ? (
        <Link
          href={`/events/${item.event.slug}`}
          className="inline-flex items-center gap-1.5 font-semibold text-kerala-dark hover:text-gold-deep"
        >
          {tName(locale, item.event.programme)}
          <span aria-hidden>&rarr;</span>
        </Link>
      ) : null}
    </div>
  );
}
