import { redirect } from "next/navigation";
import { publishLiveUpdateForm } from "@/domains/admin/actions";
import { getSessionProfile } from "@/lib/auth";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents, getStages } from "@/lib/data/queries";
import { LanguageToggle } from "@/components/ui/language-toggle";

export default async function ReporterPage() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/war-room/login?next=/reporter");
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [stages, events] = await Promise.all([getStages(), getScheduledEvents()]);
  const today = events.filter((e) => ["live", "upcoming", "delayed"].includes(e.status));

  return (
    <div className="min-h-screen bg-[#f1f0ec]">
      <header className="relative overflow-hidden text-white [background:var(--grad-hero)]">
        <div className="kolam-bg absolute inset-0 opacity-[0.12]" aria-hidden />
        <div className="relative mx-auto flex max-w-lg items-center justify-between px-4 py-6">
          <div>
            <p className="section-eyebrow text-gold-light before:[background:var(--grad-gold)]">
              {t.reporter}
            </p>
            <h1 className="font-display mt-1 text-3xl font-black">{t.liveUpdates}</h1>
          </div>
          <LanguageToggle compact />
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        <p className="mb-4 rounded-xl bg-kerala-soft px-4 py-3 text-sm text-kerala-dark">
          {t.reporterHelp}
        </p>
        <form action={publishLiveUpdateForm} className="grid gap-4">
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.selectStage}
            <select
              name="stageId"
              required
              className="min-h-14 rounded-xl border border-line bg-paper-white px-3 text-base font-normal focus:border-gold"
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {tName(locale, s)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.selectEvent}
            <select
              name="eventId"
              className="min-h-14 rounded-xl border border-line bg-paper-white px-3 text-base font-normal focus:border-gold"
            >
              <option value="">—</option>
              {today.map((e) => (
                <option key={e.id} value={e.id}>
                  {tName(locale, e.programme)} · {tName(locale, e.category)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            {t.writeUpdate}
            <textarea
              name="body"
              required
              rows={5}
              className="rounded-xl border border-line bg-paper-white px-3 py-3 text-base font-normal focus:border-gold"
            />
          </label>
          <button className="min-h-14 rounded-full bg-kerala-dark text-lg font-semibold text-white shadow-[var(--shadow-md)] transition-colors hover:bg-kerala-deep">
            {t.publishUpdate}
          </button>
        </form>
      </div>
    </div>
  );
}
