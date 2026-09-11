import { NextResponse } from "next/server";
import { buildCertificatePdf } from "@/domains/certificates/build-certificate-pdf";
import { rankPrizeLabel } from "@/lib/certificates";
import { getPublishedEntryById, getSettings } from "@/lib/data/queries";
import { tName } from "@/lib/i18n/dictionaries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ entryId: string }> },
) {
  const { entryId } = await params;
  const block = await getPublishedEntryById(entryId);
  if (!block || !block.entry.participant_name) {
    return new NextResponse("Not found", { status: 404 });
  }

  const settings = await getSettings();
  const publishedDate = block.result_set.published_at
    ? new Date(block.result_set.published_at).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const bytes = buildCertificatePdf({
    festivalName: settings.name_en,
    venue: settings.venue_en,
    participantName: block.entry.participant_name,
    programme: tName("en", block.event.programme),
    category: tName("en", block.event.category),
    house: tName("en", block.entry.house),
    rankLabel: rankPrizeLabel("en", block.entry.rank ?? 1),
    grade: block.entry.grade,
    marks: block.entry.marks,
    publishedDate,
  });

  const slug = block.event.slug;
  const rank = block.entry.rank ?? 1;
  const filename = `mesta-certificate-${slug}-rank${rank}.pdf`;

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
