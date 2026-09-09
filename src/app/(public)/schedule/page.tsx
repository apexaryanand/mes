import Link from "next/link";
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
      <div className="surface-glass sticky top-[68px] z-10 -mx-4 flex flex-wrap gap-2 rounded-none border-y border-line px-4 py-3 md:mx-0 md:rounded-full md:border md:px-4">
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
        <div className="card p-10 text-center text-muted">{t.noItems}</div>
      ) : null}
      {byStage.map((group) => (
        <section key={group.stage.id}>
          <h2 className="font-display mb-4 flex items-center gap-2 text-2xl font-bold">
            <span className="h-5 w-1.5 rounded-full [background:var(--grad-gold)]" />
            {tName(locale, group.stage)}
          </h2>
          <ol className="card divide-y divide-line overflow-hidden">
            {group.items.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/events/${e.slug}`}
                  className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-kerala-soft/50"
                >
                  <span className="w-20 shrink-0 tabular text-sm font-bold text-kerala-dark">
                    {formatTime(e.start_time, locale)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
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
