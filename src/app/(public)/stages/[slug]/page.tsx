import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDictionary, statusLabel, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents, getStageBySlug } from "@/lib/data/queries";
import { formatTime } from "@/lib/utils";

export default async function StagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const stage = await getStageBySlug(slug);
  if (!stage) notFound();
  const events = (await getScheduledEvents()).filter((e) => e.stage_id === stage.id);

  return (
    <div className="grid gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/stages" className="hover:text-kerala-dark">
          {t.stages}
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-ink">{tName(locale, stage)}</span>
      </nav>
      <header>
        <h1 className="font-display text-display-md font-bold">{tName(locale, stage)}</h1>
        <p className="mt-1 text-muted">
          {locale === "ml" ? stage.location_ml : stage.location_en}
        </p>
      </header>
      <ul className="card divide-y divide-line overflow-hidden">
        {events.map((e) => (
          <li key={e.id}>
            <Link
              href={`/events/${e.slug}`}
              className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-kerala-soft/50"
            >
              <span className="w-20 shrink-0 text-sm">
                <span className="block text-xs uppercase tracking-wide text-muted">
                  {t.day} {e.day_number}
                </span>
                <span className="tabular font-semibold text-kerala-dark">
                  {formatTime(e.start_time, locale)}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{tName(locale, e.programme)}</span>
                <span className="text-sm text-muted">{tName(locale, e.category)}</span>
              </span>
              <StatusBadge status={e.status} label={statusLabel(locale, e.status)} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
