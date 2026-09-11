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

/**
 * Official MESTA certificate — template artwork with dynamic text overlaid
 * at fixed positions (1491×1055 design).
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
        {/* Student name — covers [STUDENT NAME] */}
        <p
          className="certificate-student absolute left-1/2 w-[78%] -translate-x-1/2 text-center font-display font-black leading-tight"
          style={{ top: "39.5%" }}
        >
          {participantName}
        </p>

        {/* Prize — covers [FIRST PRIZE] */}
        <p
          className="certificate-prize absolute left-1/2 w-[85%] -translate-x-1/2 text-center font-display font-black uppercase tracking-wide"
          style={{ top: "49.8%", color: "#b8891f" }}
        >
          {prize}
        </p>

        {/* Programme — covers Oppana - Girls line */}
        <p
          className="certificate-programme absolute left-1/2 w-[82%] -translate-x-1/2 text-center font-display font-black leading-snug"
          style={{ top: "56.8%" }}
        >
          {programme}
        </p>

        {/* Category — covers HS S Section */}
        <p
          className="certificate-category absolute left-1/2 w-[80%] -translate-x-1/2 text-center text-[0.92em] font-bold uppercase tracking-wide"
          style={{ top: "62.5%" }}
        >
          {category}
        </p>

        {/* Date — bottom left */}
        <p
          className="certificate-date absolute font-semibold tabular"
          style={{ left: "7.5%", bottom: "11.5%" }}
        >
          {date}
        </p>

        {/* Certificate number */}
        <p
          className="certificate-number absolute font-semibold tabular"
          style={{ left: "7.5%", bottom: "5.8%" }}
        >
          {certNo}
        </p>
      </div>
    </div>
  );
}
