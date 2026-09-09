import { SubmitForm } from "@/components/public/submit-form";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function SubmitPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  return (
    <div className="mx-auto grid max-w-lg gap-4">
      <h1 className="font-display text-3xl">{t.submitMedia}</h1>
      <p className="text-muted">{t.submitHelp}</p>
      <SubmitForm />
    </div>
  );
}
