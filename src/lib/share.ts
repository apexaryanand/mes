export function buildWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function resultShareMessage(opts: {
  locale: "ml" | "en";
  programme: string;
  category: string;
  winner?: string;
  house?: string;
  rank?: number | null;
  pageUrl: string;
}): string {
  const { locale, programme, category, winner, house, rank, pageUrl } = opts;
  if (locale === "ml") {
    const parts = [
      `🏆 MESTA ഫലം: ${programme}`,
      category,
      winner && rank ? `${rank} സ്ഥാനം: ${winner}` : null,
      house ? `ഹൗസ്: ${house}` : null,
      pageUrl,
    ].filter(Boolean);
    return parts.join("\n");
  }
  const parts = [
    `🏆 MESTA result: ${programme}`,
    category,
    winner && rank ? `${rank}${rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th"}: ${winner}` : null,
    house ? `House: ${house}` : null,
    pageUrl,
  ].filter(Boolean);
  return parts.join("\n");
}

export function liveUpdateShareMessage(opts: {
  locale: "ml" | "en";
  body: string;
  stage?: string;
  pageUrl: string;
}): string {
  const { locale, body, stage, pageUrl } = opts;
  if (locale === "ml") {
    return [stage ? `📍 ${stage}` : "📢 MESTA ലൈവ്", body, pageUrl].join("\n");
  }
  return [stage ? `📍 ${stage}` : "📢 MESTA Live", body, pageUrl].join("\n");
}

export function certificateShareMessage(opts: {
  locale: "ml" | "en";
  name: string;
  programme: string;
  category: string;
  house: string;
  rank: number;
  certificateUrl: string;
}): string {
  const { locale, name, programme, category, house, rank, certificateUrl } = opts;
  const rankEn =
    rank === 1 ? "1st" : rank === 2 ? "2nd" : rank === 3 ? "3rd" : `${rank}th`;
  if (locale === "ml") {
    return [
      `🏆 MESTA സർട്ടിഫിക്കറ്റ്`,
      `${name}`,
      `${programme} · ${category}`,
      `${rank} സ്ഥാനം · ${house}`,
      certificateUrl,
    ].join("\n");
  }
  return [
    `🏆 MESTA Certificate`,
    `${name}`,
    `${programme} · ${category}`,
    `${rankEn} place · ${house}`,
    certificateUrl,
  ].join("\n");
}

export function winnerShareMessage(opts: {
  locale: "ml" | "en";
  name: string;
  programme: string;
  house: string;
  pageUrl: string;
}): string {
  const { locale, name, programme, house, pageUrl } = opts;
  if (locale === "ml") {
    return `🎉 വിജയി: ${name}\n${programme} · ${house}\n${pageUrl}`;
  }
  return `🎉 Winner: ${name}\n${programme} · ${house}\n${pageUrl}`;
}
