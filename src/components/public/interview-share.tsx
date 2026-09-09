"use client";

import { WhatsAppShareButton } from "@/components/public/whatsapp-share";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import { absoluteUrl, winnerShareMessage } from "@/lib/share";
import type { InterviewView } from "@/lib/types";

export function InterviewShare({ item }: { item: InterviewView }) {
  const { locale } = useI18n();
  const text = winnerShareMessage({
    locale,
    name: item.winner_name,
    programme: tName(locale, item.programme),
    school: tName(locale, item.school),
    pageUrl: absoluteUrl(`/interviews/${item.slug}`),
  });
  return <WhatsAppShareButton text={text} />;
}
