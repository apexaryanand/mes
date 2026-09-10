import Link from "next/link";
import { HouseBadge, houseColorHex } from "@/components/public/house-badge";
import { LeadingHouses } from "@/components/public/leading-houses";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getHouses, getStandings } from "@/lib/data/queries";

export default async function HousesPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [houses, standings] = await Promise.all([getHouses(), getStandings()]);

  return (
    <div className="grid gap-5 sm:gap-10">
      <PageHeader eyebrow={t.points} title={t.houses} />
      <section>
        <SectionHeader eyebrow={t.overallRank} title={t.leadingHouses} />
        <LeadingHouses standings={standings} />
      </section>
      <section>
        <SectionHeader eyebrow={t.all} title={t.houses} />
        <ul className="grid gap-3 sm:grid-cols-2">
          {houses.map((house) => {
            const hex = houseColorHex(house.color);
            const standing = standings.find((s) => s.house_id === house.id);
            return (
              <li key={house.id}>
                <Link
                  href={`/houses/${house.slug}`}
                  className="card card-hover flex items-center gap-4 p-4 transition-colors"
                  style={{ borderLeftWidth: 5, borderLeftColor: hex }}
                >
                  <span
                    className="font-display flex h-12 w-12 shrink-0 items-center justify-center border-2 border-fest-ink text-lg font-black text-white shadow-[var(--shadow-hard-xs)]"
                    style={{ backgroundColor: hex }}
                  >
                    {standing?.overall_rank ? `#${standing.overall_rank}` : "—"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 flex flex-wrap items-center gap-2">
                      <HouseBadge house={house} />
                    </span>
                    <span className="font-display lines-1 line-clamp-2 block text-lg font-black">
                      {tName(locale, house)}
                    </span>
                    <span className="block text-sm text-muted">
                      {standing?.total_points ?? 0} {t.points}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
