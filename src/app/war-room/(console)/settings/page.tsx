import { saveEventSettingsForm } from "@/domains/admin/catalog-actions";
import { wrInput, wrLabel } from "@/components/war-room/primitives";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getSettings } from "@/lib/data/queries";

export default async function SettingsAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const settings = await getSettings();

  return (
    <form action={saveEventSettingsForm} className="card grid max-w-2xl gap-3 p-3 sm:gap-4 sm:p-5">
      <h2 className="font-display text-lg font-bold">{t.settings}</h2>
      <label className={wrLabel}>
        Festival name (EN)
        <input name="name_en" required className={wrInput} defaultValue={settings.name_en} />
      </label>
      <label className={wrLabel}>
        Festival name (ML)
        <input name="name_ml" required className={wrInput} defaultValue={settings.name_ml} />
      </label>
      <label className={wrLabel}>
        Venue (EN)
        <input name="venue_en" required className={wrInput} defaultValue={settings.venue_en} />
      </label>
      <label className={wrLabel}>
        Venue (ML)
        <input name="venue_ml" required className={wrInput} defaultValue={settings.venue_ml} />
      </label>
      <label className={wrLabel}>
        Location (EN)
        <input name="location_en" required className={wrInput} defaultValue={settings.location_en} />
      </label>
      <label className={wrLabel}>
        Location (ML)
        <input name="location_ml" required className={wrInput} defaultValue={settings.location_ml} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={wrLabel}>
          Start date
          <input name="start_date" type="date" required className={wrInput} defaultValue={settings.start_date} />
        </label>
        <label className={wrLabel}>
          End date
          <input name="end_date" type="date" required className={wrInput} defaultValue={settings.end_date} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={wrLabel}>
          {t.currentDay}
          <input name="current_day" type="number" min={1} max={3} className={wrInput} defaultValue={settings.current_day ?? 1} />
        </label>
        <label className={wrLabel}>
          Live status
          <select name="live_status" className={wrInput} defaultValue={settings.live_status}>
            <option value="upcoming">upcoming</option>
            <option value="live">live</option>
            <option value="concluded">concluded</option>
          </select>
        </label>
      </div>
      <button className="min-h-11 rounded-full bg-kerala-dark text-sm font-semibold text-white">
        Save settings
      </button>
    </form>
  );
}
