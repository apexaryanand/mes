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

  return (
    <div className="grid gap-6">
      <h1 className="font-display text-3xl">{t.interviewManagement}</h1>
      <form action={createInterview} className="grid gap-3 rounded border border-line bg-white p-4">
        <input name="winner_name" placeholder="Winner name" required className="min-h-11 rounded border border-line px-3" />
        <select name="school_id" className="min-h-11 rounded border border-line px-3">
          {demo.schools.map((s) => (
            <option key={s.id} value={s.id}>{tName(locale, s)}</option>
          ))}
        </select>
        <select name="programme_id" className="min-h-11 rounded border border-line px-3">
          {demo.programmes.map((p) => (
            <option key={p.id} value={p.id}>{tName(locale, p)}</option>
          ))}
        </select>
        <input name="rank" type="number" defaultValue={1} className="min-h-11 rounded border border-line px-3" />
        <input name="video_url" placeholder="https://www.youtube.com/embed/..." required className="min-h-11 rounded border border-line px-3" />
        <textarea name="description_en" placeholder="Description EN" className="rounded border border-line px-3 py-2" />
        <textarea name="description_ml" placeholder="വിവരണം" className="rounded border border-line px-3 py-2" />
        <button className="min-h-11 rounded bg-kerala text-white">{t.create}</button>
      </form>
      <ul className="grid gap-2">
        {demo.interviews.map((i) => (
          <li key={i.id} className="rounded border border-line bg-white px-4 py-3">
            {i.winner_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
