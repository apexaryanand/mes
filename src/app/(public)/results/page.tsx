import Link from "next/link";
import { ResultTable } from "@/components/public/result-table";
import { PageHeader } from "@/components/ui/page-header";
import { tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  getCategories,
  getProgrammes,
  getPublishedResults,
  getSchools,
  getStages,
} from "@/lib/data/queries";

type Search = Promise<{
  school?: string;
  programme?: string;
  category?: string;
  stage?: string;
  day?: string;
  status?: string;
}>;

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const filters = await searchParams;
  const [results, schools, programmes, categories, stages] = await Promise.all([
    getPublishedResults(),
    getSchools(),
    getProgrammes(),
    getCategories(),
    getStages(),
  ]);

  const filtered = results.filter((r) => {
    if (filters.school && !r.entries.some((e) => e.school.slug === filters.school)) return false;
    if (filters.programme && r.event.programme.slug !== filters.programme) return false;
    if (filters.category && r.event.category.code !== filters.category) return false;
    if (filters.stage && r.event.stage.slug !== filters.stage) return false;
    if (filters.day && String(r.event.day_number) !== filters.day) return false;
    if (filters.status && r.event.status !== filters.status) return false;
    return true;
  });

  function href(next: Record<string, string | undefined>) {
    const merged = { ...filters, ...next };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    const q = params.toString();
    return q ? `/results?${q}` : "/results";
  }

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow={t.official} title={t.results} />
      <form className="card grid gap-4 p-5 md:grid-cols-3">
        <FilterSelect
          name="school"
          label={t.school}
          value={filters.school}
          allLabel={t.allSchools}
          options={schools.map((s) => [s.slug, tName(locale, s)])}
        />
        <FilterSelect
          name="programme"
          label={t.programme}
          value={filters.programme}
          allLabel={t.allProgrammes}
          options={programmes.map((p) => [p.slug, tName(locale, p)])}
        />
        <FilterSelect
          name="category"
          label={t.category}
          value={filters.category}
          allLabel={t.allCategories}
          options={categories.map((c) => [c.code, tName(locale, c)])}
        />
        <FilterSelect
          name="stage"
          label={t.stage}
          value={filters.stage}
          allLabel={t.allStages}
          options={stages.map((s) => [s.slug, tName(locale, s)])}
        />
        <FilterSelect
          name="day"
          label={t.day}
          value={filters.day}
          allLabel={t.allDays}
          options={["1", "2", "3"].map((d) => [d, `${t.day} ${d}`])}
        />
        <FilterSelect
          name="status"
          label={t.status}
          value={filters.status}
          allLabel={t.all}
          options={[
            ["completed", t.completed],
            ["live", t.live],
            ["delayed", t.delayed],
          ]}
        />
        <button className="min-h-11 rounded-full bg-kerala-dark px-5 font-semibold text-white transition-colors hover:bg-kerala-deep md:col-span-3">
          {t.filter}
        </button>
      </form>

      <div className="grid gap-10">
        {filtered.length === 0 ? (
          <div className="card p-10 text-center text-muted">{t.noResults}</div>
        ) : null}
        {filtered.map((block) => (
          <section key={block.result_set.id} className="grid gap-4">
            <div>
              <Link
                href={`/events/${block.event.slug}`}
                className="font-display text-display-md font-bold hover:underline"
              >
                {tName(locale, block.event.programme)}
              </Link>
              <p className="mt-1 text-sm text-muted">
                {tName(locale, block.event.category)} · {tName(locale, block.event.stage)} ·{" "}
                {t.day} {block.event.day_number}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href={href({ programme: block.event.programme.slug })} className="chip">
                  {t.programme}
                </Link>
                <Link href={href({ category: block.event.category.code })} className="chip">
                  {t.category}
                </Link>
                <Link href={href({ stage: block.event.stage.slug })} className="chip">
                  {t.stage}
                </Link>
              </div>
            </div>
            <ResultTable entries={block.entries} />
          </section>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({
  name,
  label,
  value,
  allLabel,
  options,
}: {
  name: string;
  label: string;
  value?: string;
  allLabel: string;
  options: Array<[string, string] | string[]>;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <select
        name={name}
        defaultValue={value ?? ""}
        className="min-h-11 rounded-xl border border-line bg-paper-white px-3 font-normal transition-colors focus:border-gold"
      >
        <option value="">{allLabel}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
