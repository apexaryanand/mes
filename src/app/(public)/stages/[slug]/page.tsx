import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
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
      <Breadcrumb
        parentHref="/stages"
        parentLabel={t.stages}
        current={tName(locale, stage)}
      />
      <header>
        <h1 className="font-display text-display-md font-black">{tName(locale, stage)}</h1>
        <p className="mt-1 text-muted">
          {locale === "ml" ? stage.location_ml : stage.location_en}
        </p>
      </header>
      <ul className="card divide-y-2 divide-fest-ink/15 overflow-hidden">
        {events.map((e) => (
          <li key={e.id}>
            <Link
              href={`/events/${e.slug}`}
              className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-fest-yellow-soft sm:gap-4 sm:px-4 sm:py-3.5"
            >
              <span className="w-16 shrink-0 text-sm sm:w-20">
                <span className="block text-xs uppercase tracking-wide text-muted">
                  {t.day} {e.day_number}
                </span>
                <span className="tabular font-black text-fest-red">
                  {formatTime(e.start_time, locale)}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 block font-bold">{tName(locale, e.programme)}</span>
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
