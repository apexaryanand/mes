import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { getDictionary, statusLabel, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents, getStages } from "@/lib/data/queries";
import { cn, formatTime } from "@/lib/utils";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string; stage?: string }>;
}) {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const { day, stage } = await searchParams;
  const [events, stages] = await Promise.all([getScheduledEvents(), getStages()]);
  const dayNum = day ? Number(day) : undefined;
  const filtered = events.filter((e) => {
    if (dayNum && e.day_number !== dayNum) return false;
    if (stage && e.stage.slug !== stage) return false;
    return true;
  });

  const byStage = stages.map((s) => ({
    stage: s,
    items: filtered.filter((e) => e.stage_id === s.id),
  })).filter((g) => g.items.length);

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow={t.stages} title={t.schedule} />
      <div className="surface-glass sticky top-[var(--stack-top)] z-20 -mx-3 flex flex-wrap gap-1.5 border-y-2 border-fest-ink px-3 py-2 sm:-mx-4 sm:gap-2 sm:px-4 sm:py-3 md:mx-0 md:border-x-2">
        {[1, 2, 3].map((d) => (
          <Link
            key={d}
            href={`/schedule?day=${d}${stage ? `&stage=${stage}` : ""}`}
            className={cn("chip", dayNum === d && "chip-active")}
          >
            {t.day} {d}
          </Link>
        ))}
        <Link href="/schedule" className={cn("chip", !dayNum && !stage && "chip-active")}>
          {t.allDays}
        </Link>
      </div>
      {byStage.length === 0 ? (
        <EmptyState title={t.noItems} description={t.emptyHint} />
      ) : null}
      {byStage.map((group) => (
        <section key={group.stage.id}>
          <h2 className="font-display mb-4 flex items-center gap-2.5 text-2xl font-black">
            <span className="h-6 w-2 shrink-0 bg-fest-red" aria-hidden />
            {tName(locale, group.stage)}
          </h2>
          <ol className="card divide-y-2 divide-fest-ink/15 overflow-hidden">
            {group.items.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/events/${e.slug}`}
                  className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-fest-yellow-soft sm:gap-4 sm:px-4 sm:py-3.5"
                >
                  <span className="tabular w-16 shrink-0 text-sm font-black text-fest-red sm:w-20">
                    {formatTime(e.start_time, locale)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block font-bold">
                      {tName(locale, e.programme)}
                    </span>
                    <span className="text-xs text-muted">{tName(locale, e.category)}</span>
                  </span>
                  <StatusBadge status={e.status} label={statusLabel(locale, e.status)} />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
