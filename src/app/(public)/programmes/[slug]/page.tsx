import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getProgrammeBySlug, getScheduledEvents } from "@/lib/data/queries";

export default async function ProgrammePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const programme = await getProgrammeBySlug(slug);
  if (!programme) notFound();
  const events = (await getScheduledEvents()).filter((e) => e.programme_id === programme.id);

  return (
    <div className="grid gap-4">
      <p className="text-sm">
        <Link href="/programmes">{t.programmes}</Link>
      </p>
      <h1 className="font-display text-4xl">{tName(locale, programme)}</h1>
      {events.map((e) => (
        <Link key={e.id} href={`/events/${e.slug}`} className="flex items-center justify-between rounded border border-line bg-paper-white p-4">
          <div>
            <p className="font-medium">{tName(locale, e.category)}</p>
            <p className="text-sm text-muted">
              {tName(locale, e.stage)} · {t.day} {e.day_number}
            </p>
          </div>
          <StatusBadge status={e.status} label={e.status} />
        </Link>
      ))}
    </div>
  );
}
