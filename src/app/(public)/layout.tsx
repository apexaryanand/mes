import { MobileQuickNav } from "@/components/public/mobile-quick-nav";
import { RealtimeRefresh } from "@/components/public/realtime-refresh";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <MobileQuickNav />
      <RealtimeRefresh />
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-3 sm:px-4 sm:py-4 md:py-6">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
