import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents, getStages } from "@/lib/data/queries";
import { formatTime } from "@/lib/utils";

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
    <div className="grid gap-6">
      <h1 className="font-display text-3xl">{t.schedule}</h1>
      <div className="sticky top-16 z-10 flex flex-wrap gap-2 bg-paper py-2">
        {[1, 2, 3].map((d) => (
          <Link
            key={d}
            href={`/schedule?day=${d}${stage ? `&stage=${stage}` : ""}`}
            className={`min-h-10 rounded border px-3 py-2 text-sm ${dayNum === d ? "border-kerala bg-kerala text-white" : "border-line bg-paper-white"}`}
          >
            {t.day} {d}
          </Link>
        ))}
        <Link href="/schedule" className="min-h-10 rounded border border-line bg-paper-white px-3 py-2 text-sm">
          {t.allDays}
        </Link>
      </div>
      {byStage.map((group) => (
        <section key={group.stage.id}>
          <h2 className="font-display mb-3 text-2xl">{tName(locale, group.stage)}</h2>
          <ol className="grid gap-2">
            {group.items.map((e) => (
              <li key={e.id}>
                <Link href={`/events/${e.slug}`} className="flex items-center gap-3 rounded border border-line bg-paper-white px-4 py-3">
                  <span className="w-20 tabular text-sm font-semibold">
                    {formatTime(e.start_time, locale)}
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">{tName(locale, e.programme)}</span>
                    <span className="text-xs text-muted">{tName(locale, e.category)}</span>
                  </span>
                  <StatusBadge status={e.status} label={e.status} />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
