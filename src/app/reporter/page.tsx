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
    <div className="mx-auto min-h-screen max-w-lg bg-paper px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold-deep">{t.reporter}</p>
          <h1 className="font-display text-3xl">{t.liveUpdates}</h1>
        </div>
        <LanguageToggle compact />
      </div>
      <p className="mb-4 text-sm text-muted">{t.reporterHelp}</p>
      <form action={publishLiveUpdateForm} className="grid gap-4">
        <label className="grid gap-1 text-sm font-medium">
          {t.selectStage}
          <select name="stageId" required className="min-h-14 rounded border border-line bg-paper-white px-3 text-base">
            {stages.map((s) => (
              <option key={s.id} value={s.id}>{tName(locale, s)}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {t.selectEvent}
          <select name="eventId" className="min-h-14 rounded border border-line bg-paper-white px-3 text-base">
            <option value="">—</option>
            {today.map((e) => (
              <option key={e.id} value={e.id}>
                {tName(locale, e.programme)} · {tName(locale, e.category)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {t.writeUpdate}
          <textarea name="body" required rows={5} className="rounded border border-line bg-paper-white px-3 py-3 text-base" />
        </label>
        <button className="min-h-14 rounded bg-kerala text-lg font-semibold text-white">
          {t.publishUpdate}
        </button>
      </form>
    </div>
  );
}
