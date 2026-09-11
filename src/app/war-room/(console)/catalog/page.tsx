import { Suspense } from "react";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminTabs } from "@/components/admin/admin-tabs";
import {
  CategoriesPanel,
  HousesPanel,
  ParticipantsPanel,
  ProgrammesPanel,
  StagesPanel,
} from "@/components/admin/catalog-panels";
import { adminCopy } from "@/lib/admin/copy";
import { getCategories, getHouses, getParticipants, getProgrammes, getStages } from "@/lib/data/queries";

const TABS = [
  { id: "houses", label: adminCopy.housesTab },
  { id: "programmes", label: adminCopy.programmesTab },
  { id: "categories", label: adminCopy.categoriesTab },
  { id: "stages", label: adminCopy.stagesTab },
  { id: "participants", label: adminCopy.participantsTab },
];

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "houses" } = await searchParams;
  const [houses, programmes, categories, stages, participants] = await Promise.all([
    getHouses(),
    getProgrammes(),
    getCategories(),
    getStages(),
    getParticipants(),
  ]);

  return (
    <AdminPage title={adminCopy.catalog} description={adminCopy.catalogHelp}>
      <Suspense fallback={null}>
        <AdminTabs basePath="/war-room/catalog" tabs={TABS} />
      </Suspense>
      <div className="pt-4">
        {tab === "houses" ? <HousesPanel houses={houses} /> : null}
        {tab === "programmes" ? <ProgrammesPanel programmes={programmes} /> : null}
        {tab === "categories" ? <CategoriesPanel categories={categories} /> : null}
        {tab === "stages" ? <StagesPanel stages={stages} /> : null}
        {tab === "participants" ? <ParticipantsPanel houses={houses} participants={participants} /> : null}
      </div>
    </AdminPage>
  );
}
