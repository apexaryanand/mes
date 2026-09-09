import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getArticleBySlug } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  const body = locale === "ml" ? article.body_ml : article.body_en;

  return (
    <article className="mx-auto max-w-2xl">
      <p className="text-sm">
        <Link href="/news">{t.news}</Link>
      </p>
      <p className="mt-4 text-xs uppercase tracking-wide text-gold-deep">{article.category}</p>
      <h1 className="font-display mt-2 text-4xl leading-tight">
        {locale === "ml" ? article.title_ml : article.title_en}
      </h1>
      <p className="mt-3 text-lg text-muted">
        {locale === "ml" ? article.excerpt_ml : article.excerpt_en}
      </p>
      <p className="mt-3 text-sm text-muted">
        {article.author_name}
        {article.published_at ? ` · ${formatDateTime(article.published_at, locale)}` : ""}
      </p>
      <div className="mt-8 grid gap-4 text-lg leading-8">
        {body.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
