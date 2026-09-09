import Link from "next/link";
import { ResultTable } from "@/components/public/result-table";
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
    <div className="grid gap-6">
      <h1 className="font-display text-3xl">{t.results}</h1>
      <form className="grid gap-3 rounded border border-line bg-paper-white p-4 md:grid-cols-3">
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
        <button className="min-h-11 rounded bg-kerala px-4 text-paper-white md:col-span-3">
          {t.filter}
        </button>
      </form>

      <div className="grid gap-8">
        {filtered.length === 0 ? <p className="text-muted">{t.noResults}</p> : null}
        {filtered.map((block) => (
          <section key={block.result_set.id} className="grid gap-3">
            <div>
              <Link href={`/events/${block.event.slug}`} className="font-display text-2xl hover:underline">
                {tName(locale, block.event.programme)}
              </Link>
              <p className="text-sm text-muted">
                {tName(locale, block.event.category)} · {tName(locale, block.event.stage)} · {t.day}{" "}
                {block.event.day_number}
              </p>
              <p className="mt-1 text-xs">
                <Link href={href({ school: undefined, programme: block.event.programme.slug })} className="text-kerala-dark">
                  {t.programme}
                </Link>
                {" · "}
                <Link href={href({ category: block.event.category.code })} className="text-kerala-dark">
                  {t.category}
                </Link>
                {" · "}
                <Link href={href({ stage: block.event.stage.slug })} className="text-kerala-dark">
                  {t.stage}
                </Link>
              </p>
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
    <label className="grid gap-1 text-sm">
      {label}
      <select
        name={name}
        defaultValue={value ?? ""}
        className="min-h-11 rounded border border-line bg-paper-white px-2"
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
