import Link from "next/link";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getInterviews } from "@/lib/data/queries";

export default async function InterviewsPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const interviews = await getInterviews();
  return (
    <div className="grid gap-4">
      <h1 className="font-display text-3xl">{t.interviews}</h1>
      {interviews.map((item) => (
        <Link key={item.id} href={`/interviews/${item.slug}`} className="rounded border border-line bg-paper-white p-4">
          <p className="font-display text-2xl">{item.winner_name}</p>
          <p className="text-sm text-muted">
            {tName(locale, item.school)} · {tName(locale, item.programme)}
          </p>
        </Link>
      ))}
    </div>
  );
}
