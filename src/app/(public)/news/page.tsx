import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getArticles } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";

export default async function NewsPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const articles = await getArticles();
  return (
    <div className="grid gap-4">
      <h1 className="font-display text-3xl">{t.news}</h1>
      {articles.map((a) => (
        <Link key={a.id} href={`/news/${a.slug}`} className="rounded border border-line bg-paper-white p-4">
          <p className="text-xs uppercase tracking-wide text-gold-deep">{a.category}</p>
          <h2 className="font-display mt-1 text-2xl">{locale === "ml" ? a.title_ml : a.title_en}</h2>
          <p className="mt-2 text-muted">{locale === "ml" ? a.excerpt_ml : a.excerpt_en}</p>
          <p className="mt-2 text-xs text-muted">
            {a.author_name}
            {a.published_at ? ` · ${formatDateTime(a.published_at, locale)}` : ""}
          </p>
        </Link>
      ))}
    </div>
  );
}
