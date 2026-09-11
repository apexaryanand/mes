import { Suspense } from "react";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminTabs } from "@/components/admin/admin-tabs";
import {
  ArticlesPanel,
  InterviewsPanel,
  ModerationPanel,
  UploadsPanel,
} from "@/components/admin/content-panels";
import { adminCopy } from "@/lib/admin/copy";
import { getSessionProfile } from "@/lib/auth";
import { getAllArticlesAdmin, getAllInterviewsAdmin, getPendingMediaAdmin } from "@/lib/data/admin-queries";
import { getHouses, getProgrammes } from "@/lib/data/queries";
import type { AppRole } from "@/lib/types";

const TAB_ROLES: Record<string, AppRole[]> = {
  moderation: ["super_admin", "war_room"],
  articles: ["super_admin", "war_room", "media_team"],
  uploads: ["super_admin", "media_team"],
  interviews: ["super_admin", "media_team"],
};

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const profile = await getSessionProfile();
  const role = profile?.role ?? "media_team";
  const tabs = [
    { id: "moderation", label: adminCopy.moderation },
    { id: "articles", label: adminCopy.articlesTab },
    { id: "uploads", label: adminCopy.uploads },
    { id: "interviews", label: adminCopy.interviewsTab },
  ].filter((t) => TAB_ROLES[t.id]?.includes(role) || role === "super_admin");

  const { tab = tabs[0]?.id ?? "moderation" } = await searchParams;
  const active = tabs.some((t) => t.id === tab) ? tab : tabs[0]?.id;

  const [pendingMedia, articles, houses, programmes, interviews] = await Promise.all([
    TAB_ROLES.moderation.includes(role) || role === "super_admin" ? getPendingMediaAdmin() : Promise.resolve([]),
    getAllArticlesAdmin(),
    getHouses(),
    getProgrammes(),
    getAllInterviewsAdmin(),
  ]);

  return (
    <AdminPage title={adminCopy.content} description={adminCopy.contentHelp}>
      <Suspense fallback={null}>
        <AdminTabs basePath="/war-room/content" tabs={tabs} />
      </Suspense>
      <div className="pt-4">
        {active === "moderation" ? <ModerationPanel items={pendingMedia} /> : null}
        {active === "articles" ? <ArticlesPanel articles={articles} /> : null}
        {active === "uploads" ? <UploadsPanel /> : null}
        {active === "interviews" ? (
          <InterviewsPanel houses={houses} programmes={programmes} interviews={interviews} />
        ) : null}
      </div>
    </AdminPage>
  );
}
