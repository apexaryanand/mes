import { moderateMediaForm, saveArticle, saveInterview } from "@/domains/admin/actions";
import { uploadStaffMediaForm } from "@/domains/media/staff-actions";
import { AdminField, adminInput } from "@/components/admin/admin-field";
import { AdminSubmit } from "@/components/admin/admin-submit";
import { AdminEmpty } from "@/components/admin/admin-table";
import { adminCopy } from "@/lib/admin/copy";
import { adminStatusLabel } from "@/lib/admin/status";
import { revalidatePublicSite, revalidateWarRoom } from "@/lib/revalidate";
import { failWarRoom } from "@/lib/war-room-error";
import { resolveMediaUrl } from "@/lib/media-url";
import { slugify } from "@/lib/utils";
import type { Article, House, MediaItem, Programme } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";

async function createArticle(formData: FormData) {
  "use server";
  const result = await saveArticle({
    title_en: String(formData.get("title_en") ?? ""),
    excerpt_en: String(formData.get("excerpt_en") ?? ""),
    body_en: String(formData.get("body_en") ?? ""),
    slug: slugify(String(formData.get("title_en") ?? "article")),
    category: String(formData.get("category") ?? "News"),
    is_published: formData.get("publish") === "on",
  });
  if (result && "error" in result && result.error) {
    await failWarRoom(result.error, "/war-room/content?tab=articles");
  }
  revalidateWarRoom();
  revalidatePublicSite();
}

async function createInterview(formData: FormData) {
  "use server";
  const result = await saveInterview({
    winner_name: String(formData.get("winner_name") ?? ""),
    video_url: String(formData.get("video_url") ?? ""),
    house_id: String(formData.get("house_id") ?? ""),
    programme_id: String(formData.get("programme_id") ?? ""),
    description_en: String(formData.get("description_en") ?? ""),
    rank: Number(formData.get("rank") ?? 1),
  });
  if (result && "error" in result && result.error) {
    await failWarRoom(result.error, "/war-room/content?tab=interviews");
  }
  revalidateWarRoom();
  revalidatePublicSite();
}

export function ModerationPanel({ items }: { items: MediaItem[] }) {
  if (!items.length) return <AdminEmpty />;
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 lg:grid-cols-[10rem_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolveMediaUrl(item.thumbnail_url ?? item.url)} alt="" className="aspect-[4/3] w-full rounded object-cover" />
          <div className="min-w-0">
            <StatusBadge status={item.status} label={adminStatusLabel(item.status)} />
            <h2 className="mt-2 font-medium text-zinc-900">{item.title_en}</h2>
            <p className="text-sm text-zinc-500">{item.submitted_by_name} · {item.kind}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <form action={moderateMediaForm}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="status" value="approved" />
                <AdminSubmit variant="primary">{adminCopy.approve}</AdminSubmit>
              </form>
              <form action={moderateMediaForm}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="status" value="rejected" />
                <AdminSubmit variant="danger">{adminCopy.reject}</AdminSubmit>
              </form>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ArticlesPanel({ articles }: { articles: Article[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
      <form action={createArticle} className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-3 font-medium text-zinc-900">{adminCopy.create} article</h3>
        <div className="grid gap-3">
          <AdminField label="Title">
            <input name="title_en" required className={adminInput} />
          </AdminField>
          <AdminField label="Excerpt">
            <input name="excerpt_en" className={adminInput} />
          </AdminField>
          <AdminField label="Category">
            <input name="category" defaultValue="News" className={adminInput} />
          </AdminField>
          <AdminField label="Body">
            <textarea name="body_en" rows={6} className={adminInput} />
          </AdminField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="publish" />
            Publish now
          </label>
          <AdminSubmit>{adminCopy.create}</AdminSubmit>
        </div>
      </form>
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-3 font-medium text-zinc-900">Published articles</h3>
        <ul className="divide-y divide-zinc-100">
          {articles.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="font-medium">{a.title_en}</span>
              <StatusBadge status={a.is_published ? "published" : "draft"} label={a.is_published ? adminCopy.published : adminCopy.draft} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function UploadsPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form action={uploadStaffMediaForm} className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-3 font-medium text-zinc-900">{adminCopy.photos}</h3>
        <input type="hidden" name="kind" value="photo" />
        <input type="hidden" name="section" value="gallery" />
        <div className="grid gap-3">
          <AdminField label="Title"><input name="title_en" required className={adminInput} /></AdminField>
          <AdminField label={adminCopy.caption}><textarea name="caption_en" rows={2} className={adminInput} /></AdminField>
          <AdminField label="File"><input name="file" type="file" accept="image/*" required className={adminInput} /></AdminField>
          <AdminSubmit>{adminCopy.upload}</AdminSubmit>
        </div>
      </form>
      <form action={uploadStaffMediaForm} className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-3 font-medium text-zinc-900">{adminCopy.videos}</h3>
        <input type="hidden" name="kind" value="video" />
        <input type="hidden" name="section" value="gallery" />
        <div className="grid gap-3">
          <AdminField label="Title"><input name="title_en" required className={adminInput} /></AdminField>
          <AdminField label="File"><input name="file" type="file" accept="video/*" className={adminInput} /></AdminField>
          <AdminField label="Or video URL"><input name="video_url" className={adminInput} placeholder="https://..." /></AdminField>
          <AdminSubmit>{adminCopy.upload}</AdminSubmit>
        </div>
      </form>
      <form action={uploadStaffMediaForm} className="rounded-lg border border-zinc-200 bg-white p-4 lg:col-span-2">
        <h3 className="mb-3 font-medium text-zinc-900">{adminCopy.reportings}</h3>
        <p className="mb-3 text-sm text-zinc-600">{adminCopy.reportingsHelp}</p>
        <input type="hidden" name="kind" value="video" />
        <input type="hidden" name="section" value="reporting" />
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Title"><input name="title_en" required className={adminInput} /></AdminField>
          <AdminField label="Description"><textarea name="caption_en" rows={2} className={adminInput} /></AdminField>
          <AdminField label="Video file"><input name="file" type="file" accept="video/*" className={adminInput} /></AdminField>
          <AdminField label="Or embed URL"><input name="video_url" className={adminInput} /></AdminField>
        </div>
        <AdminSubmit className="mt-3">{adminCopy.publish}</AdminSubmit>
      </form>
    </div>
  );
}

export function InterviewsPanel({
  houses,
  programmes,
  interviews,
}: {
  houses: House[];
  programmes: Programme[];
  interviews: Array<{ id: string; winner_name: string; video_url: string }>;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <form action={createInterview} className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-3 font-medium text-zinc-900">{adminCopy.create} interview</h3>
        <div className="grid gap-3">
          <AdminField label="Winner name"><input name="winner_name" required className={adminInput} /></AdminField>
          <AdminField label="Video URL"><input name="video_url" required className={adminInput} /></AdminField>
          <AdminField label={adminCopy.house}>
            <select name="house_id" required className={adminInput}>
              {houses.map((h) => <option key={h.id} value={h.id}>{h.name_en}</option>)}
            </select>
          </AdminField>
          <AdminField label={adminCopy.programme}>
            <select name="programme_id" required className={adminInput}>
              {programmes.map((p) => <option key={p.id} value={p.id}>{p.name_en}</option>)}
            </select>
          </AdminField>
          <AdminField label="Description"><textarea name="description_en" rows={3} className={adminInput} /></AdminField>
          <AdminField label={adminCopy.rank}><input name="rank" type="number" min={1} max={3} defaultValue={1} className={adminInput} /></AdminField>
          <AdminSubmit>{adminCopy.create}</AdminSubmit>
        </div>
      </form>
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-3 font-medium text-zinc-900">Interviews</h3>
        <ul className="divide-y divide-zinc-100 text-sm">
          {interviews.map((i) => (
            <li key={i.id} className="py-2">
              <p className="font-medium">{i.winner_name}</p>
              <p className="truncate text-xs text-zinc-500">{i.video_url}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
