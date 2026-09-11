import {
  deleteParticipantForm,
  importParticipantsCsvForm,
  saveCategoryForm,
  saveHouseForm,
  saveParticipantForm,
  saveProgrammeForm,
  saveStageForm,
} from "@/domains/admin/catalog-actions";
import { AdminField, adminInput } from "@/components/admin/admin-field";
import { AdminSubmit } from "@/components/admin/admin-submit";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { HouseBadge } from "@/components/public/house-badge";
import { adminCopy } from "@/lib/admin/copy";
import type { Category, House, Participant, Programme, Stage } from "@/lib/types";

export function HousesPanel({ houses }: { houses: House[] }) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-zinc-600">{adminCopy.housesHelp}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {houses.map((house) => (
          <form key={house.id} action={saveHouseForm} className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-medium text-zinc-900">{adminCopy.edit} {adminCopy.house}</h3>
              <HouseBadge house={house} />
            </div>
            <input type="hidden" name="id" value={house.id} />
            <div className="grid gap-3">
              <AdminField label="Name">
                <input name="name_en" required className={adminInput} defaultValue={house.name_en} />
              </AdminField>
              <AdminField label="Short name">
                <input name="short_name" className={adminInput} defaultValue={house.short_name ?? ""} />
              </AdminField>
              <AdminSubmit>{adminCopy.saveChanges}</AdminSubmit>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

export function ProgrammesPanel({ programmes }: { programmes: Programme[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[18rem_1fr]">
      <form action={saveProgrammeForm} className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-3 font-medium text-zinc-900">{adminCopy.addProgramme}</h3>
        <div className="grid gap-3">
          <AdminField label="Name">
            <input name="name_en" required className={adminInput} />
          </AdminField>
          <AdminField label="Code">
            <input name="code" className={adminInput} />
          </AdminField>
          <AdminField label="Type">
            <select name="item_kind" className={adminInput}>
              <option value="individual">Individual</option>
              <option value="group">Group</option>
            </select>
          </AdminField>
          <AdminSubmit>{adminCopy.create}</AdminSubmit>
        </div>
      </form>
      <AdminTable>
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>
              <AdminTh>Name</AdminTh>
              <AdminTh>Code</AdminTh>
              <AdminTh>Type</AdminTh>
            </tr>
          </thead>
          <tbody>
            {programmes.map((p) => (
              <tr key={p.id}>
                <AdminTd className="font-medium">{p.name_en}</AdminTd>
                <AdminTd>{p.code ?? "—"}</AdminTd>
                <AdminTd>{p.item_kind}</AdminTd>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTable>
    </div>
  );
}

export function CategoriesPanel({ categories }: { categories: Category[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[18rem_1fr]">
      <form action={saveCategoryForm} className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-3 font-medium text-zinc-900">{adminCopy.addCategory}</h3>
        <div className="grid gap-3">
          <AdminField label="Code">
            <input name="code" required className={adminInput} />
          </AdminField>
          <AdminField label="Name">
            <input name="name_en" required className={adminInput} />
          </AdminField>
          <AdminField label="Sort order">
            <input name="sort_order" type="number" defaultValue={0} className={adminInput} />
          </AdminField>
          <AdminSubmit>{adminCopy.create}</AdminSubmit>
        </div>
      </form>
      <AdminTable>
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>
              <AdminTh>Code</AdminTh>
              <AdminTh>Name</AdminTh>
              <AdminTh>Order</AdminTh>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <AdminTd className="font-mono text-xs">{c.code}</AdminTd>
                <AdminTd>{c.name_en}</AdminTd>
                <AdminTd>{c.sort_order}</AdminTd>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTable>
    </div>
  );
}

export function StagesPanel({ stages }: { stages: Stage[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[18rem_1fr]">
      <form action={saveStageForm} className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-3 font-medium text-zinc-900">{adminCopy.addStage}</h3>
        <div className="grid gap-3">
          <AdminField label="Name">
            <input name="name_en" required className={adminInput} />
          </AdminField>
          <AdminField label="Location">
            <input name="location_en" className={adminInput} />
          </AdminField>
          <AdminField label="Sort order">
            <input name="sort_order" type="number" defaultValue={0} className={adminInput} />
          </AdminField>
          <AdminSubmit>{adminCopy.create}</AdminSubmit>
        </div>
      </form>
      <AdminTable>
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>
              <AdminTh>Name</AdminTh>
              <AdminTh>Location</AdminTh>
              <AdminTh>Order</AdminTh>
            </tr>
          </thead>
          <tbody>
            {stages.map((s) => (
              <tr key={s.id}>
                <AdminTd className="font-medium">{s.name_en}</AdminTd>
                <AdminTd>{s.location_en ?? "—"}</AdminTd>
                <AdminTd>{s.sort_order}</AdminTd>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTable>
    </div>
  );
}

export function ParticipantsPanel({
  houses,
  participants,
}: {
  houses: House[];
  participants: Participant[];
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <form action={saveParticipantForm} className="rounded-lg border border-zinc-200 bg-white p-4">
          <h3 className="mb-3 font-medium text-zinc-900">{adminCopy.addParticipant}</h3>
          <div className="grid gap-3">
            <AdminField label={adminCopy.house}>
              <select name="house_id" required className={adminInput}>
                <option value="">—</option>
                {houses.map((h) => (
                  <option key={h.id} value={h.id}>{h.code} · {h.name_en}</option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Name">
              <input name="full_name" required className={adminInput} />
            </AdminField>
            <AdminField label="Class">
              <input name="class_name" className={adminInput} placeholder="10 A" />
            </AdminField>
            <AdminField label="Chest no.">
              <input name="chest_number" className={adminInput} />
            </AdminField>
            <AdminSubmit>{adminCopy.create}</AdminSubmit>
          </div>
        </form>
        <form action={importParticipantsCsvForm} className="rounded-lg border border-zinc-200 bg-white p-4">
          <h3 className="mb-3 font-medium text-zinc-900">{adminCopy.bulkImport}</h3>
          <p className="mb-3 text-xs text-zinc-500">{adminCopy.participantsCsvFormat}</p>
          <textarea name="csv" rows={8} className={`${adminInput} min-h-40 font-mono text-xs`} />
          <AdminSubmit className="mt-3 w-full">{adminCopy.importCsv}</AdminSubmit>
        </form>
      </div>
      <AdminTable>
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>
              <AdminTh>{adminCopy.participant}</AdminTh>
              <AdminTh>{adminCopy.house}</AdminTh>
              <AdminTh>Class</AdminTh>
              <AdminTh />
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id}>
                <AdminTd className="font-medium">{p.full_name}</AdminTd>
                <AdminTd>{p.house?.name_en ?? "—"}</AdminTd>
                <AdminTd className="text-zinc-500">{p.class_name ?? "—"}</AdminTd>
                <AdminTd className="text-right">
                  <form action={deleteParticipantForm} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
                      {adminCopy.remove}
                    </button>
                  </form>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTable>
    </div>
  );
}
