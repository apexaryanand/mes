import { LiveFeed } from "@/components/public/live-feed";
import { PageHeader } from "@/components/ui/page-header";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getLiveUpdates } from "@/lib/data/queries";

export default async function LivePage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const updates = await getLiveUpdates();
  return (
    <div className="grid gap-5 sm:gap-8">
      <PageHeader
        eyebrow={t.reporter}
        title={t.liveUpdates}
        description={t.reporterHelp}
      />
      <LiveFeed updates={updates} />
    </div>
  );
}
