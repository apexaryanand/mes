import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getArticles } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";

export default async function NewsPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const articles = await getArticles();
  const [lead, ...rest] = articles;

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow={t.official} title={t.news} />
      {!articles.length ? (
        <div className="card p-10 text-center text-muted">{t.noItems}</div>
      ) : null}

      {lead ? (
        <Link
          href={`/news/${lead.slug}`}
          className="card card-hover grid gap-4 overflow-hidden md:grid-cols-2"
        >
          <div className="relative min-h-48 [background:var(--grad-hero)]">
            <div className="kolam-bg absolute inset-0 opacity-[0.12]" aria-hidden />
          </div>
          <div className="p-6">
            <span className="chip py-1 text-xs">{lead.category}</span>
            <h2 className="font-display mt-3 text-display-md font-bold leading-tight">
              {locale === "ml" ? lead.title_ml : lead.title_en}
            </h2>
            <p className="mt-3 text-muted">
              {locale === "ml" ? lead.excerpt_ml : lead.excerpt_en}
            </p>
            <p className="mt-4 text-xs text-muted">
              {lead.author_name}
              {lead.published_at ? ` · ${formatDateTime(lead.published_at, locale)}` : ""}
            </p>
          </div>
        </Link>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => (
          <Link key={a.id} href={`/news/${a.slug}`} className="card card-hover flex flex-col p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-deep">
              {a.category}
            </span>
            <h2 className="font-display mt-2 text-xl font-bold leading-snug">
              {locale === "ml" ? a.title_ml : a.title_en}
            </h2>
            <p className="mt-2 flex-1 text-sm text-muted">
              {locale === "ml" ? a.excerpt_ml : a.excerpt_en}
            </p>
            <p className="mt-4 text-xs text-muted">
              {a.author_name}
              {a.published_at ? ` · ${formatDateTime(a.published_at, locale)}` : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
