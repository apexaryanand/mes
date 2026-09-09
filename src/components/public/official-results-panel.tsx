"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/provider";
import type { AppealStatus, ResultSet } from "@/lib/types";

const appealStatusKey: Record<AppealStatus, string> = {
  none: "appealNone",
  open: "appealOpen",
  under_review: "appealUnderReview",
  closed: "appealClosed",
};

const appealBadgeStatus: Record<AppealStatus, string> = {
  none: "completed",
  open: "pending",
  under_review: "entered",
  closed: "verified",
};

export function OfficialResultsPanel({ resultSet }: { resultSet: ResultSet }) {
  const { t } = useI18n();
  const hasSheet = Boolean(resultSet.official_sheet_url);
  const showAppeal = resultSet.appeal_status !== "none";

  if (!hasSheet && !showAppeal) return null;

  return (
    <div className="card flex flex-wrap items-center justify-between gap-4 p-4">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-gold-deep">
          {t.officialDocuments}
        </p>
        {showAppeal ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">{t.appealStatus}:</span>
            <StatusBadge
              status={appealBadgeStatus[resultSet.appeal_status]}
              label={t[appealStatusKey[resultSet.appeal_status] as keyof typeof t] as string}
            />
          </div>
        ) : null}
        {resultSet.official_sheet_signed_by ? (
          <p className="mt-1 text-xs text-muted">
            {t.signedBy}: {resultSet.official_sheet_signed_by}
          </p>
        ) : null}
      </div>
      {hasSheet ? (
        <Link
          href={resultSet.official_sheet_url!}
          download
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-kerala-dark px-5 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition-colors hover:bg-kerala-deep"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
          </svg>
          {t.downloadOfficialPdf}
        </Link>
      ) : null}
    </div>
  );
}
