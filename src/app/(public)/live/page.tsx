import { LiveFeed } from "@/components/public/live-feed";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getLiveUpdates } from "@/lib/data/queries";

export default async function LivePage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const updates = await getLiveUpdates();
  return (
    <div className="grid gap-4">
      <h1 className="font-display text-3xl">{t.liveUpdates}</h1>
      <LiveFeed updates={updates} />
    </div>
  );
}
