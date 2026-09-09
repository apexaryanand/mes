import { saveArticle } from "@/domains/admin/actions";
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

  return (
    <div className="grid gap-6">
      <h1 className="font-display text-3xl">{t.articleManagement}</h1>
      <form action={createArticle} className="grid gap-3 rounded border border-line bg-white p-4">
        <input name="title_en" placeholder="Title (EN)" className="min-h-11 rounded border border-line px-3" required />
        <input name="title_ml" placeholder="തലക്കെട്ട്" className="min-h-11 rounded border border-line px-3" required />
        <input name="excerpt_en" placeholder="Excerpt (EN)" className="min-h-11 rounded border border-line px-3" />
        <input name="excerpt_ml" placeholder="സംഗ്രഹം" className="min-h-11 rounded border border-line px-3" />
        <textarea name="body_en" rows={5} placeholder="Body (EN)" className="rounded border border-line px-3 py-2" />
        <textarea name="body_ml" rows={5} placeholder="ഉള്ളടക്കം" className="rounded border border-line px-3 py-2" />
        <input name="category" defaultValue="News" className="min-h-11 rounded border border-line px-3" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="publish" /> {t.publish}
        </label>
        <button className="min-h-11 rounded bg-kerala text-white">{t.create}</button>
      </form>
      <ul className="grid gap-2">
        {demo.articles.map((a) => (
          <li key={a.id} className="rounded border border-line bg-white px-4 py-3">
            <p className="font-medium">{locale === "ml" ? a.title_ml : a.title_en}</p>
            <p className="text-xs text-muted">{a.is_published ? t.published : t.draft}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
