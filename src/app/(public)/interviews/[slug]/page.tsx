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
    <div className="grid gap-4">
      <p className="text-sm">
        <Link href="/interviews">{t.interviews}</Link>
      </p>
      <h1 className="font-display text-4xl">{item.winner_name}</h1>
      <p className="text-muted">
        {tName(locale, item.school)} · {tName(locale, item.programme)}
        {item.rank ? ` · ${item.rank}` : ""}
      </p>
      <iframe
        title={item.winner_name}
        src={item.video_url}
        className="aspect-video w-full rounded border border-line"
        allowFullScreen
      />
      <p>{locale === "ml" ? item.description_ml : item.description_en}</p>
      {item.event ? (
        <Link href={`/events/${item.event.slug}`} className="text-kerala-dark hover:underline">
          {tName(locale, item.event.programme)}
        </Link>
      ) : null}
    </div>
  );
}
