import type { Locale } from "@/lib/types";

/** Top-three placements receive downloadable certificates. */
export function isCertificateEligible(rank: number | null | undefined): boolean {
  return rank != null && rank >= 1 && rank <= 3;
}

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
