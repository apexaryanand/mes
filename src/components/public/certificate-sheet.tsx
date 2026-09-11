import {
  CERTIFICATE_ASPECT,
  CERTIFICATE_TEMPLATE,
  formatCertificateDate,
  formatCertificateNumber,
  rankPrizeDisplay,
} from "@/lib/certificates";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

export type CertificateSheetProps = {
  entryId: string;
  participantName: string;
  rank: number;
  programme: string;
  category: string;
  publishedAt: string | null;
  locale: Locale;
  className?: string;
};

function Field({
  top,
  width = "78%",
  height = "7.2%",
  className,
  children,
}: {
  top: string;
  width?: string;
  height?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute left-1/2 flex -translate-x-1/2 items-center justify-center bg-[#f8f4e8] px-2 text-center",
        className,
      )}
      style={{ top, width, height }}
    >
      {children}
    </div>
  );
}

/**
 * Official MESTA certificate — template artwork with dynamic text overlaid
 * on cream bands that cover the baked-in placeholders.
 */
export function CertificateSheet({
  entryId,
  participantName,
  rank,
  programme,
  category,
  publishedAt,
  locale,
  className,
}: CertificateSheetProps) {
  const prize = rankPrizeDisplay(rank);
  const certNo = formatCertificateNumber(entryId, publishedAt);
  const date = formatCertificateDate(publishedAt, locale);

  return (
    <div
      className={cn("certificate-frame relative mx-auto w-full max-w-[920px]", className)}
      style={{ aspectRatio: String(CERTIFICATE_ASPECT) }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CERTIFICATE_TEMPLATE}
        alt=""
        className="absolute inset-0 h-full w-full object-contain"
        draggable={false}
      />

      <div className="certificate-overlay absolute inset-0 text-[#1a3352]">
        <Field top="37.8%" height="8.4%" className="certificate-student font-display font-black leading-tight">
          {participantName}
        </Field>
        <Field
          top="48.6%"
          height="7.6%"
          className="certificate-prize font-display font-black uppercase tracking-wide"
        >
          <span style={{ color: "#b8891f" }}>{prize}</span>
        </Field>
        <Field top="56.2%" height="6.4%" width="82%" className="certificate-programme font-display font-black leading-snug">
          {programme}
        </Field>
        <Field top="61.8%" height="5.2%" width="70%" className="certificate-category font-bold uppercase tracking-wide">
          {category}
        </Field>

        <div
          className="certificate-date absolute flex items-center bg-[#f8f4e8] px-1 font-semibold tabular"
          style={{ left: "16.5%", bottom: "11.2%", width: "22%", height: "3.6%" }}
        >
          {date}
        </div>
        <div
          className="certificate-number absolute flex items-center bg-[#f8f4e8] px-1 font-semibold tabular"
          style={{ left: "22%", bottom: "5.6%", width: "24%", height: "3.4%" }}
        >
          {certNo}
        </div>
      </div>
    </div>
  );
}
