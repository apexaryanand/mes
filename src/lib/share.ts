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
  school?: string;
  rank?: number | null;
  pageUrl: string;
}): string {
  const { locale, programme, category, winner, school, rank, pageUrl } = opts;
  if (locale === "ml") {
    const parts = [
      `🏆 കലോത്സവം ഫലം: ${programme}`,
      category,
      winner && rank ? `${rank} സ്ഥാനം: ${winner}` : null,
      school ? `സ്കൂൾ: ${school}` : null,
      pageUrl,
    ].filter(Boolean);
    return parts.join("\n");
  }
  const parts = [
    `🏆 Kalolsavam result: ${programme}`,
    category,
    winner && rank ? `${rank}${rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th"}: ${winner}` : null,
    school ? `School: ${school}` : null,
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
    return [stage ? `📍 ${stage}` : "📢 കലോത്സവം ലൈവ്", body, pageUrl].join("\n");
  }
  return [stage ? `📍 ${stage}` : "📢 Kalolsavam Live", body, pageUrl].join("\n");
}

export function winnerShareMessage(opts: {
  locale: "ml" | "en";
  name: string;
  programme: string;
  school: string;
  pageUrl: string;
}): string {
  const { locale, name, programme, school, pageUrl } = opts;
  if (locale === "ml") {
    return `🎉 വിജയി: ${name}\n${programme} · ${school}\n${pageUrl}`;
  }
  return `🎉 Winner: ${name}\n${programme} · ${school}\n${pageUrl}`;
}
