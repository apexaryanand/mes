import { uploadStaffMediaForm } from "@/domains/media/staff-actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { wrInput, wrLabel, WrSubmit } from "@/components/war-room/primitives";

export default async function MediaUploadsPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const field = `${wrInput} min-h-11`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form action={uploadStaffMediaForm} className="card grid gap-3 p-3 sm:p-5">
        <h2 className="font-display text-lg font-bold">{t.photos}</h2>
        <input type="hidden" name="kind" value="photo" />
        <input type="hidden" name="section" value="gallery" />
        <label className={wrLabel}>
          Title (EN)
          <input name="title_en" required className={field} />
        </label>
        <label className={wrLabel}>
          Title (ML)
          <input name="title_ml" required className={field} />
        </label>
        <label className={wrLabel}>
          {t.caption} (EN)
          <textarea name="caption_en" rows={2} className={field} />
        </label>
        <label className={wrLabel}>
          File
          <input name="file" type="file" accept="image/*" required className={field} />
        </label>
        <WrSubmit>
          {t.upload}
        </WrSubmit>
      </form>

      <form action={uploadStaffMediaForm} className="card grid gap-3 p-3 sm:p-5">
        <h2 className="font-display text-lg font-bold">{t.videos}</h2>
        <input type="hidden" name="kind" value="video" />
        <input type="hidden" name="section" value="gallery" />
        <label className={wrLabel}>
          Title (EN)
          <input name="title_en" required className={field} />
        </label>
        <label className={wrLabel}>
          Title (ML)
          <input name="title_ml" required className={field} />
        </label>
        <label className={wrLabel}>
          File
          <input name="file" type="file" accept="video/*" className={field} />
        </label>
        <label className={wrLabel}>
          Or video URL
          <input name="video_url" placeholder="https://..." className={field} />
        </label>
        <WrSubmit>
          {t.upload}
        </WrSubmit>
      </form>

      <form action={uploadStaffMediaForm} className="card grid gap-3 p-3 sm:p-5 lg:col-span-2">
        <h2 className="font-display text-lg font-bold">{t.reportings}</h2>
        <p className="text-sm text-muted">{t.reportingsHelp}</p>
        <input type="hidden" name="kind" value="video" />
        <input type="hidden" name="section" value="reporting" />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={wrLabel}>
            Title (EN)
            <input name="title_en" required className={field} />
          </label>
          <label className={wrLabel}>
            Title (ML)
            <input name="title_ml" required className={field} />
          </label>
        </div>
        <label className={wrLabel}>
          Description
          <textarea name="caption_en" rows={2} className={field} />
        </label>
        <label className={wrLabel}>
          Edited video file
          <input name="file" type="file" accept="video/*" className={field} />
        </label>
        <label className={wrLabel}>
          Or YouTube / embed URL
          <input name="video_url" placeholder="https://www.youtube.com/embed/..." className={field} />
        </label>
        <WrSubmit>
          {t.publish}
        </WrSubmit>
      </form>
    </div>
  );
}
