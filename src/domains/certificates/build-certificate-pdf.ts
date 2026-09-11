export type CertificatePdfInput = {
  festivalName: string;
  venue: string;
  participantName: string;
  programme: string;
  category: string;
  house: string;
  rankLabel: string;
  grade: string | null;
  marks: number | null;
  publishedDate: string;
};

function safe(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/** Single-page portrait certificate PDF (ASCII-safe Helvetica). */
export function buildCertificatePdf(input: CertificatePdfInput): Uint8Array {
  const detail =
    input.grade && input.marks != null
      ? `Grade ${input.grade} · Marks ${input.marks}`
      : input.grade
        ? `Grade ${input.grade}`
        : input.marks != null
          ? `Marks ${input.marks}`
          : "";

  const stream = [
    "BT",
    "/F1 16 Tf",
    `72 750 Td (${safe(input.festivalName)}) Tj`,
    "0 -20 Td /F1 10 Tf",
    `(${safe(input.venue)}) Tj`,
    "0 -36 Td /F1 14 Tf",
    "(CERTIFICATE OF ACHIEVEMENT) Tj",
    "0 -28 Td /F1 11 Tf",
    "(This is to certify that) Tj",
    "0 -26 Td /F1 18 Tf",
    `(${safe(input.participantName)}) Tj`,
    "0 -28 Td /F1 11 Tf",
    `(has been awarded ${safe(input.rankLabel)} in) Tj`,
    "0 -18 Td",
    `(${safe(input.programme)} — ${safe(input.category)}) Tj`,
    "0 -18 Td",
    `(${safe(`Representing ${input.house}`)}) Tj`,
    ...(detail ? ["0 -18 Td", `(${safe(detail)}) Tj`] : []),
    "0 -28 Td",
    `(Date: ${safe(input.publishedDate)}) Tj`,
    "0 -24 Td",
    "(Convener, MESTA Kalolsavam) Tj",
    "ET",
  ].join("\n");

  const streamLen = stream.length;
  const objects = [
    "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj",
    "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj",
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj",
    `4 0 obj<< /Length ${streamLen} >>stream\n${stream}\nendstream endobj`,
    "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>endobj",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += `${obj}\n`;
  }
  const xrefPos = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}
