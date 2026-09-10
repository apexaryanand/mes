import { saveInterview } from "@/domains/admin/actions";
import { getAllInterviewsAdmin } from "@/lib/data/admin-queries";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getHouses, getProgrammes } from "@/lib/data/queries";
import { revalidatePath } from "next/cache";

async function createInterview(formData: FormData) {
  "use server";
  await saveInterview({
    winner_name: String(formData.get("winner_name") ?? ""),
    video_url: String(formData.get("video_url") ?? ""),
    house_id: String(formData.get("house_id") ?? ""),
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
  const [houses, programmes, interviews] = await Promise.all([
    getHouses(),
    getProgrammes(),
    getAllInterviewsAdmin(),
  ]);

  const field =
    "field-input text-sm";
  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_1fr]">
      <form action={createInterview} className="card grid h-fit gap-3 p-3 sm:p-5">
        <p className="section-eyebrow">{t.create}</p>
        <label className="grid gap-1 text-sm font-medium">
          Winner name
          <input name="winner_name" required className={field} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">
            {t.house}
            <select name="house_id" required className={field}>
              {houses.map((h) => (
                <option key={h.id} value={h.id}>
                  {tName(locale, h)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {t.programme}
            <select name="programme_id" required className={field}>
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>
                  {tName(locale, p)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="grid gap-1 text-sm font-medium">
          {t.rank}
          <input name="rank" type="number" defaultValue={1} className={field} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Video URL
          <input name="video_url" placeholder="https://www.youtube.com/embed/..." required className={field} />
        </label>
        <textarea name="description_en" placeholder="Description EN" className={`${field} py-2`} />
        <textarea name="description_ml" placeholder="വിവരണം" className={`${field} py-2`} />
        <button className="min-h-11 rounded-full bg-kerala-dark font-semibold text-white transition-colors hover:bg-kerala-deep">
          {t.create}
        </button>
      </form>
      <ul className="grid h-fit gap-2">
        {interviews.map((i) => (
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
