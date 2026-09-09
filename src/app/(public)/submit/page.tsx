import { SubmitForm } from "@/components/public/submit-form";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function SubmitPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  return (
    <div className="mx-auto grid max-w-lg gap-5">
      <div>
        <span className="section-eyebrow">{t.photos}</span>
        <h1 className="font-display text-display-md mt-1.5 font-bold">{t.submitMedia}</h1>
        <p className="mt-2 text-muted">{t.submitHelp}</p>
      </div>
      <SubmitForm />
    </div>
  );
}
