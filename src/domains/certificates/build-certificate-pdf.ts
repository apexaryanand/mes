import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  CERTIFICATE_DESIGN_H,
  CERTIFICATE_DESIGN_W,
  formatCertificateDate,
  formatProgrammeLine,
  rankPrizeDisplay,
} from "@/lib/certificates";

export type CertificatePdfInput = {
  participantName: string;
  programme: string;
  category?: string | null;
  rank: number;
  publishedAt: string | null;
};

const DESIGN_W = CERTIFICATE_DESIGN_W;
const DESIGN_H = CERTIFICATE_DESIGN_H;
const PAGE_W = 842;
const PAGE_H = 595;
const SX = PAGE_W / DESIGN_W;
const SY = PAGE_H / DESIGN_H;

const CREAM = rgb(0.984, 0.973, 0.937);
const NAVY = rgb(0.1, 0.2, 0.32);
const GOLD = rgb(0.77, 0.63, 0.15);

function coverBand(
  page: ReturnType<PDFDocument["addPage"]>,
  designX: number,
  designY: number,
  designW: number,
  designH: number,
) {
  page.drawRectangle({
    x: designX * SX,
    y: toPdfY(designY + designH),
    width: designW * SX,
    height: designH * SY,
    color: CREAM,
  });
}

function pdfSafe(text: string): string {
  return text.normalize("NFKD").replace(/[^\x00-\x7F]/g, "");
}

function toPdfY(designY: number): number {
  return PAGE_H - designY * SY;
}

function drawCentered(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  centerX: number,
  designY: number,
  size: number,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  color: ReturnType<typeof rgb>,
) {
  const safe = pdfSafe(text);
  if (!safe.trim()) return;
  const fontSize = size * SX;
  const width = font.widthOfTextAtSize(safe, fontSize);
  page.drawText(safe, {
    x: centerX * SX - width / 2,
    y: toPdfY(designY) - fontSize * 0.35,
    size: fontSize,
    font,
    color,
  });
}

function drawLeft(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  designX: number,
  designY: number,
  size: number,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  color: ReturnType<typeof rgb>,
) {
  const safe = pdfSafe(text);
  if (!safe.trim()) return;
  const fontSize = size * SX;
  page.drawText(safe, {
    x: designX * SX,
    y: toPdfY(designY) - fontSize * 0.35,
    size: fontSize,
    font,
    color,
  });
}

/** Landscape A4 PDF with the current official template and dynamic text overlays. */
export async function buildCertificatePdf(input: CertificatePdfInput): Promise<Uint8Array> {
  const templatePath = path.join(process.cwd(), "public/images/certificate-template.png");
  const templateBytes = await readFile(templatePath);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  const png = await pdfDoc.embedPng(templateBytes);
  page.drawImage(png, { x: 0, y: 0, width: PAGE_W, height: PAGE_H });

  const serifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const prize = rankPrizeDisplay(input.rank);
  const date = formatCertificateDate(input.publishedAt, "en");
  const programmeLine = formatProgrammeLine(input.programme, input.category);
  const name =
    pdfSafe(input.participantName).trim() ||
    input.participantName.replace(/[^\w\s.-]/g, "").trim();

  // Cover baked-in placeholders on the new 1221×864 artwork
  coverBand(page, 210, 360, 800, 78);
  coverBand(page, 280, 470, 660, 78);
  coverBand(page, 250, 575, 720, 58);
  coverBand(page, 155, 740, 230, 34);

  drawCentered(page, name || "Winner", DESIGN_W / 2, 400, 36, serifBold, NAVY);
  drawCentered(page, prize, DESIGN_W / 2, 510, 32, serifBold, GOLD);
  drawCentered(page, programmeLine, DESIGN_W / 2, 608, 22, serifBold, NAVY);
  drawLeft(page, date, 162, 758, 14, serif, NAVY);

  return pdfDoc.save();
}
