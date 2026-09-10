import { NextResponse } from "next/server";
import { getEventBySlug } from "@/lib/data/queries";
import { getPublishedResults } from "@/lib/data/queries";
import { buildSimplePdf } from "@/lib/pdf";
import { tName } from "@/lib/i18n/dictionaries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return new NextResponse("Not found", { status: 404 });
  }

  const block = (await getPublishedResults()).find((r) => r.event.slug === slug);
  const title = `Official Result Sheet — ${tName("en", event.programme)}`;
  const lines = [
    `Category: ${tName("en", event.category)}`,
    `Stage: ${tName("en", event.stage)} · Day ${event.day_number}`,
    "",
    "Rank  Participant                    House               Marks  Grade",
    ...(block?.entries.slice(0, 8).map((e) => {
      const name = (e.participant_name ?? "—").slice(0, 22).padEnd(22);
      const house = tName("en", e.house).slice(0, 18).padEnd(18);
      return `${String(e.rank).padStart(2)}   ${name}  ${house}  ${String(e.marks ?? "—").padStart(4)}    ${e.grade ?? "—"}`;
    }) ?? ["Results not yet published."]),
    "",
    block?.result_set.official_sheet_signed_by
      ? `Signed: ${block.result_set.official_sheet_signed_by}`
      : "Signed: Convener, MESTA",
      `Generated: ${new Date().toISOString().slice(0, 10)}`,
  ];

  const bytes = buildSimplePdf(title, lines);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="mesta-result-${slug}.pdf"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
