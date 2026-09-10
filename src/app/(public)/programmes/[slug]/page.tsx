import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDictionary, statusLabel, tName } from "@/lib/i18n/dictionaries";
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
    <div className="grid gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/programmes" className="hover:text-kerala-dark">
          {t.programmes}
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-ink">{tName(locale, programme)}</span>
      </nav>
      <h1 className="font-display text-display-md font-bold">{tName(locale, programme)}</h1>
      <ul className="card divide-y-2 divide-fest-ink/15 overflow-hidden">
        {events.map((e) => (
          <li key={e.id}>
            <Link
              href={`/events/${e.slug}`}
              className="flex items-center justify-between gap-3 px-3 py-3 transition-colors hover:bg-fest-yellow-soft sm:px-4 sm:py-3.5"
            >
              <div className="min-w-0">
                <p className="line-clamp-2 font-bold">{tName(locale, e.category)}</p>
                <p className="text-sm text-muted">
                  {tName(locale, e.stage)} · {t.day} {e.day_number}
                </p>
              </div>
              <StatusBadge status={e.status} label={statusLabel(locale, e.status)} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
