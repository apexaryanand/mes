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
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/news" className="hover:text-kerala-dark">
          {t.news}
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-ink">
          {locale === "ml" ? article.title_ml : article.title_en}
        </span>
      </nav>
      <span className="section-eyebrow mt-6">{article.category}</span>
      <h1 className="font-display text-display-md mt-2 font-black leading-tight">
        {locale === "ml" ? article.title_ml : article.title_en}
      </h1>
      <p className="mt-4 text-xl text-muted">
        {locale === "ml" ? article.excerpt_ml : article.excerpt_en}
      </p>
      <div className="mt-5 flex items-center gap-3 border-y border-line py-4 text-sm">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-kerala-soft font-semibold text-kerala-dark">
          {article.author_name.charAt(0)}
        </span>
        <div>
          <p className="font-medium">{article.author_name}</p>
          {article.published_at ? (
            <p className="text-xs text-muted">
              {formatDateTime(article.published_at, locale)}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-8 grid gap-5 text-lg leading-8">
        {body.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
