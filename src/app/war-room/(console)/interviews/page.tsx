import { saveInterview } from "@/domains/admin/actions";
import * as demo from "@/lib/data/demo";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { revalidatePath } from "next/cache";

async function createInterview(formData: FormData) {
  "use server";
  await saveInterview({
    winner_name: String(formData.get("winner_name") ?? ""),
    video_url: String(formData.get("video_url") ?? ""),
    school_id: String(formData.get("school_id") ?? ""),
    programme_id: String(formData.get("programme_id") ?? ""),
    description_en: String(formData.get("description_en") ?? ""),
    description_ml: String(formData.get("description_ml") ?? ""),
    rank: Number(formData.get("rank") ?? 1),
  });
  revalidatePath("/", "layout");
}

export default async function InterviewsAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);

  const field =
    "min-h-11 rounded-xl border border-line bg-paper-white px-3 text-sm focus:border-gold";
  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_1fr]">
      <form action={createInterview} className="card grid h-fit gap-3 p-3 sm:p-5">
        <p className="section-eyebrow">{t.create}</p>
        <input name="winner_name" placeholder="Winner name" required className={field} />
        <div className="grid gap-3 sm:grid-cols-2">
          <select name="school_id" className={field}>
            {demo.schools.map((s) => (
              <option key={s.id} value={s.id}>
                {tName(locale, s)}
              </option>
            ))}
          </select>
          <select name="programme_id" className={field}>
            {demo.programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {tName(locale, p)}
              </option>
            ))}
          </select>
        </div>
        <input name="rank" type="number" defaultValue={1} className={field} />
        <input name="video_url" placeholder="https://www.youtube.com/embed/..." required className={field} />
        <textarea name="description_en" placeholder="Description EN" className={`${field} py-2`} />
        <textarea name="description_ml" placeholder="വിവരണം" className={`${field} py-2`} />
        <button className="min-h-11 rounded-full bg-kerala-dark font-semibold text-white transition-colors hover:bg-kerala-deep">
          {t.create}
        </button>
      </form>
      <ul className="grid h-fit gap-2">
        {demo.interviews.map((i) => (
          <li key={i.id} className="card flex items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-kerala-soft text-kerala-dark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="font-medium">{i.winner_name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
