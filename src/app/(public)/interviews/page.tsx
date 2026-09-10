import Link from "next/link";
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
        <div className="card p-10 text-center text-muted">{t.noItems}</div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {interviews.map((item) => (
          <Link
            key={item.id}
            href={`/interviews/${item.slug}`}
            className="card card-hover group relative flex flex-col overflow-hidden"
          >
            <div className="relative aspect-video [background:var(--grad-hero)]">
              <div className="kolam-bg absolute inset-0 opacity-[0.12]" aria-hidden />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-kerala-dark shadow-lg transition-transform group-hover:scale-110">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </div>
            <div className="p-4">
              <p className="font-display text-xl font-bold">{item.winner_name}</p>
              <p className="mt-0.5 text-sm text-muted">
                {tName(locale, item.house)} · {tName(locale, item.programme)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
