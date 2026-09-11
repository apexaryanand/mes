import { NextResponse } from "next/server";
import { buildCertificatePdf } from "@/domains/certificates/build-certificate-pdf";
import { isCertificateEligible } from "@/lib/certificates";
import { getPublishedEntryById } from "@/lib/data/queries";
import { tName } from "@/lib/i18n/dictionaries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ entryId: string }> },
) {
  const { entryId } = await params;
  const block = await getPublishedEntryById(entryId);

  if (
    !block ||
    !isCertificateEligible(block.entry.rank) ||
    !block.entry.participant_name
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const bytes = await buildCertificatePdf({
    participantName: block.entry.participant_name,
    programme: tName("en", block.event.programme),
    category: tName("en", block.event.category),
    rank: block.entry.rank ?? 1,
    publishedAt: block.result_set.published_at,
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
