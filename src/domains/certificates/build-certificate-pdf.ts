import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  formatCertificateDate,
  formatCertificateNumber,
  rankPrizeDisplay,
} from "@/lib/certificates";
import type { Locale } from "@/lib/types";

export type CertificatePdfInput = {
  entryId: string;
  locale: Locale;
  participantName: string;
  programme: string;
  category: string;
  rank: number;
  publishedAt: string | null;
};

const DESIGN_W = 1491;
const DESIGN_H = 1055;
const PAGE_W = 842;
const PAGE_H = 595;
const SX = PAGE_W / DESIGN_W;
const SY = PAGE_H / DESIGN_H;

const NAVY = rgb(0.1, 0.2, 0.32);
const GOLD = rgb(0.72, 0.54, 0.12);

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

/** Landscape A4 PDF with the official template image and dynamic text overlays. */
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
  const certNo = formatCertificateNumber(input.entryId, input.publishedAt);
  const date = formatCertificateDate(input.publishedAt, input.locale);

  drawCentered(page, input.participantName, DESIGN_W / 2, 418, 42, serifBold, NAVY);
  drawCentered(page, prize, DESIGN_W / 2, 525, 34, serifBold, GOLD);
  drawCentered(page, input.programme, DESIGN_W / 2, 600, 28, serifBold, NAVY);
  drawCentered(page, input.category, DESIGN_W / 2, 660, 20, serifBold, NAVY);
  drawLeft(page, date, 112, 935, 16, serif, NAVY);
  drawLeft(page, certNo, 112, 990, 14, serif, NAVY);

  return pdfDoc.save();
}
