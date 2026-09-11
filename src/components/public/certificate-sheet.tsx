import {
  CERTIFICATE_ASPECT,
  CERTIFICATE_TEMPLATE,
  formatCertificateDate,
  formatProgrammeLine,
  rankPrizeDisplay,
} from "@/lib/certificates";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

export type CertificateSheetProps = {
  participantName: string;
  rank: number;
  programme: string;
  category?: string | null;
  publishedAt: string | null;
  locale: Locale;
  className?: string;
};

function Field({
  top,
  width = "72%",
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
        "absolute left-1/2 flex -translate-x-1/2 items-center justify-center bg-[#fbf8ef] px-2 text-center",
        className,
      )}
      style={{ top, width, height }}
    >
      {children}
    </div>
  );
}

/**
 * Official MESTA certificate — latest School Kalolsavam artwork
 * (name, prize, programme line, date). Category rides on the programme line.
 */
export function CertificateSheet({
  participantName,
  rank,
  programme,
  category,
  publishedAt,
  locale,
  className,
}: CertificateSheetProps) {
  const prize = rankPrizeDisplay(rank);
  const date = formatCertificateDate(publishedAt, locale);
  const programmeLine = formatProgrammeLine(programme, category);

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
        {/* [STUDENT NAME] */}
        <Field top="42.2%" height="8.6%" width="70%" className="certificate-student font-display font-black leading-tight">
          {participantName}
        </Field>

        {/* FIRST / SECOND / THIRD PRIZE */}
        <Field
          top="55.4%"
          height="8.4%"
          width="62%"
          className="certificate-prize font-display font-black uppercase tracking-wide"
        >
          <span style={{ color: "#c4a027" }}>{prize}</span>
        </Field>

        {/* [PROGRAMME / EVENT NAME] */}
        <Field
          top="67.6%"
          height="6.4%"
          width="68%"
          className="certificate-programme font-display font-black leading-snug"
        >
          {programmeLine}
        </Field>

        {/* [DATE] after the printed Date: label */}
        <div
          className="certificate-date absolute flex items-center bg-[#fbf8ef] px-1 font-semibold tabular"
          style={{ left: "13.2%", bottom: "12.4%", width: "18%", height: "3.8%" }}
        >
          {date}
        </div>
      </div>
    </div>
  );
}
