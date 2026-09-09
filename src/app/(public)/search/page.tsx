import { SearchResults } from "@/components/public/search-results";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { searchPublic } from "@/lib/data/queries";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const { q } = await searchParams;
  const hits = q ? await searchPublic(q) : [];
  return (
    <div className="grid gap-6">
      <h1 className="font-display text-display-md font-bold">{t.search}</h1>
      <SearchResults query={q ?? ""} hits={hits} />
    </div>
  );
}
