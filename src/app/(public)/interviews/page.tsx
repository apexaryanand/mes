import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getInterviews } from "@/lib/data/queries";

export default async function InterviewsPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const interviews = await getInterviews();
  return (
    <div className="grid gap-5 sm:gap-8">
      <PageHeader eyebrow={t.official} title={t.interviews} />
      {!interviews.length ? (
        <EmptyState icon="media" title={t.noItems} description={t.emptyHint} />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {interviews.map((item) => (
          <Link
            key={item.id}
            href={`/interviews/${item.slug}`}
            className="card card-hover group relative flex flex-col overflow-hidden"
          >
            <div className="relative aspect-video overflow-hidden border-b-[var(--border-w)] border-fest-ink bg-fest-ink">
              <div
                className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(var(--fest-yellow)_1.5px,transparent_1.5px)] [background-size:20px_20px]"
                aria-hidden
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center border-[var(--border-w)] border-fest-ink bg-fest-yellow text-fest-ink shadow-[var(--shadow-hard-sm)] transition-transform group-hover:scale-110">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </div>
            <div className="p-4">
              <p className="font-display lines-1 line-clamp-2 text-xl font-black">
                {item.winner_name}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-muted">
                {tName(locale, item.house)} · {tName(locale, item.programme)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
