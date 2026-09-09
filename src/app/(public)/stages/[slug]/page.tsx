import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
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
    <div className="grid gap-4">
      <p className="text-sm">
        <Link href="/stages">{t.stages}</Link>
      </p>
      <h1 className="font-display text-4xl">{tName(locale, stage)}</h1>
      <p className="text-muted">{locale === "ml" ? stage.location_ml : stage.location_en}</p>
      {events.map((e) => (
        <Link key={e.id} href={`/events/${e.slug}`} className="flex items-center gap-3 rounded border border-line bg-paper-white p-4">
          <span className="w-24 text-sm">{t.day} {e.day_number}<br />{formatTime(e.start_time, locale)}</span>
          <span className="flex-1">
            <span className="block font-medium">{tName(locale, e.programme)}</span>
            <span className="text-sm text-muted">{tName(locale, e.category)}</span>
          </span>
          <StatusBadge status={e.status} label={e.status} />
        </Link>
      ))}
    </div>
  );
}
