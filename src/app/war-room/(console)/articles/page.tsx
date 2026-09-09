import { saveArticle } from "@/domains/admin/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import * as demo from "@/lib/data/demo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

async function createArticle(formData: FormData) {
  "use server";
  await saveArticle({
    title_en: String(formData.get("title_en") ?? ""),
    title_ml: String(formData.get("title_ml") ?? ""),
    excerpt_en: String(formData.get("excerpt_en") ?? ""),
    excerpt_ml: String(formData.get("excerpt_ml") ?? ""),
    body_en: String(formData.get("body_en") ?? ""),
    body_ml: String(formData.get("body_ml") ?? ""),
    slug: slugify(String(formData.get("title_en") ?? "article")),
    category: String(formData.get("category") ?? "News"),
    is_published: formData.get("publish") === "on",
  });
  revalidatePath("/", "layout");
}

export default async function ArticlesAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);

  const field =
    "min-h-11 rounded-xl border border-line bg-paper-white px-3 text-sm focus:border-gold";
  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_1.1fr]">
      <form action={createArticle} className="card grid h-fit gap-3 p-3 sm:p-5">
        <p className="section-eyebrow">{t.create}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="title_en" placeholder="Title (EN)" className={field} required />
          <input name="title_ml" placeholder="തലക്കെട്ട്" className={field} required />
          <input name="excerpt_en" placeholder="Excerpt (EN)" className={field} />
          <input name="excerpt_ml" placeholder="സംഗ്രഹം" className={field} />
        </div>
        <textarea name="body_en" rows={5} placeholder="Body (EN)" className={`${field} py-2`} />
        <textarea name="body_ml" rows={5} placeholder="ഉള്ളടക്കം" className={`${field} py-2`} />
        <input name="category" defaultValue="News" className={field} />
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="publish" className="h-4 w-4 rounded accent-[var(--kerala-green)]" />
          {t.publish}
        </label>
        <button className="min-h-11 rounded-full bg-kerala-dark font-semibold text-white transition-colors hover:bg-kerala-deep">
          {t.create}
        </button>
      </form>
      <ul className="grid h-fit gap-2">
        {demo.articles.map((a) => (
          <li key={a.id} className="card flex items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
            <p className="min-w-0 truncate font-medium">
              {locale === "ml" ? a.title_ml : a.title_en}
            </p>
            <StatusBadge
              status={a.is_published ? "published" : "draft"}
              label={a.is_published ? t.published : t.draft}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
