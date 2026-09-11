import type { Locale } from "@/lib/types";

/** Top-three placements receive downloadable certificates. */
export function isCertificateEligible(rank: number | null | undefined): boolean {
  return rank != null && rank >= 1 && rank <= 3;
}

/** Uppercase prize line as on the printed template (FIRST PRIZE, etc.). */
export function rankPrizeDisplay(rank: number): string {
  if (rank === 1) return "FIRST PRIZE";
  if (rank === 2) return "SECOND PRIZE";
  if (rank === 3) return "THIRD PRIZE";
  return `${rank}TH PRIZE`;
}

export function formatCertificateNumber(entryId: string, publishedAt: string | null): string {
  const year = publishedAt ? new Date(publishedAt).getFullYear() : new Date().getFullYear();
  const code = entryId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `MESTA-${year}-${code}`;
}

export function formatCertificateDate(publishedAt: string | null, locale: Locale): string {
  if (!publishedAt) return "—";
  const d = new Date(publishedAt);
  if (locale === "ml") {
    return d.toLocaleDateString("ml-IN", { day: "numeric", month: "long", year: "numeric" });
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** Single programme line on the new template (category is no longer its own field). */
export function formatProgrammeLine(programme: string, category?: string | null): string {
  const p = programme.trim();
  const c = category?.trim();
  if (p && c && p.toLowerCase() !== c.toLowerCase()) return `${p}  ·  ${c}`;
  return p || c || "";
}

export const CERTIFICATE_TEMPLATE = "/images/certificate-template.png";
/** New official artwork: 1221 × 864 */
export const CERTIFICATE_DESIGN_W = 1221;
export const CERTIFICATE_DESIGN_H = 864;
export const CERTIFICATE_ASPECT = CERTIFICATE_DESIGN_W / CERTIFICATE_DESIGN_H;

export function rankPrizeLabel(locale: Locale, rank: number): string {
  if (locale === "ml") {
    if (rank === 1) return "ഒന്നാം സ്ഥാനം";
    if (rank === 2) return "രണ്ടാം സ്ഥാനം";
    if (rank === 3) return "മൂന്നാം സ്ഥാനം";
    return `${rank}ാം സ്ഥാനം`;
  }
  if (rank === 1) return "First Prize";
  if (rank === 2) return "Second Prize";
  if (rank === 3) return "Third Prize";
  return `${rank}th Place`;
}

export function certificatePagePath(entryId: string): string {
  return `/certificates/${entryId}`;
}

export function certificatePdfPath(entryId: string): string {
  return `/documents/certificates/${entryId}`;
}
