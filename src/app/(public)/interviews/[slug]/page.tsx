import Link from "next/link";
import { notFound } from "next/navigation";
import { InterviewShare } from "@/components/public/interview-share";
import { Breadcrumb } from "@/components/ui/breadcrumb";
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
      <Breadcrumb
        parentHref="/interviews"
        parentLabel={t.interviews}
        current={item.winner_name}
      />
      <header>
        <h1 className="font-display text-display-md font-black">{item.winner_name}</h1>
        <p className="mt-1 text-muted">
          {tName(locale, item.house)} · {tName(locale, item.programme)}
          {item.rank ? ` · ${item.rank}` : ""}
        </p>
        <div className="mt-3">
          <InterviewShare item={item} />
        </div>
      </header>
      <iframe
        title={item.winner_name}
        src={item.video_url}
        className="aspect-video w-full overflow-hidden border-[var(--border-w)] border-fest-ink shadow-[var(--shadow-hard)]"
        allowFullScreen
      />
      <p className="text-lg leading-relaxed">
        {locale === "ml" ? item.description_ml : item.description_en}
      </p>
      {item.event ? (
        <Link
          href={`/events/${item.event.slug}`}
          className="nav-underline inline-flex items-center gap-1.5 font-bold text-fest-ink"
        >
          {tName(locale, item.event.programme)}
          <span aria-hidden>&rarr;</span>
        </Link>
      ) : null}
    </div>
  );
}
