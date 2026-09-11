import { cookies } from "next/headers";
import { Manjari, Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/types";
import type { Metadata } from "next";
import "./globals.css";

// 900 is loaded because font-synthesis is disabled site-wide: without the real
// weight, every font-black in Latin would silently render as 700.
const ui = Source_Sans_3({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
});

const malayalam = Manjari({
  variable: "--font-malayalam",
  subsets: ["malayalam"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "MESTA — Mes Track & Arts",
    template: "%s · MESTA",
  },
  description:
    "Official live platform for MESTA — Mes Track & Arts school kalolsavam at MES HSS Irimbiliyam, Malappuram.",
  openGraph: {
    siteName: "MESTA",
    images: [{ url: "/images/certificate-template.png", width: 1221, height: 864 }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jar = await cookies();
  const locale: Locale = jar.get("kalolsavam_locale")?.value === "en" ? "en" : "ml";

  return (
    <html
      lang={locale}
      className={`${ui.variable} ${display.variable} ${malayalam.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
