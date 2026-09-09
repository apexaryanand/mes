import { cookies } from "next/headers";
import { Manjari, Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/types";
import type { Metadata } from "next";
import "./globals.css";

const ui = Source_Sans_3({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const malayalam = Manjari({
  variable: "--font-malayalam",
  subsets: ["malayalam"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Kalolsavam Live · MES HSS Irimbiliyam",
    template: "%s · Kalolsavam Live",
  },
  description:
    "Official live platform for the Sub-District Kerala School Kalolsavam hosted at MES HSS Irimbiliyam, Malappuram.",
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
