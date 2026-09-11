import type { Metadata } from "next";
import { CERTIFICATE_TEMPLATE, rankPrizeDisplay } from "@/lib/certificates";
import { absoluteUrl } from "@/lib/share";

export function shareMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(opts.path) || opts.path;
  const image = absoluteUrl(opts.image ?? CERTIFICATE_TEMPLATE);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      type: "article",
      images: [{ url: image, width: 1221, height: 864, alt: opts.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}

export function winnerShareCopy(opts: {
  name: string;
  programme: string;
  rank: number;
}): { title: string; description: string } {
  const prize = rankPrizeDisplay(opts.rank);
  return {
    title: `${opts.name} · ${prize}`,
    description: `${opts.programme} — MESTA Kalolsavam, MES HSS Irimbiliyam`,
  };
}
