import { DemoBanner } from "@/components/public/demo-banner";
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
      <DemoBanner />
      <SiteHeader />
      <RealtimeRefresh />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
      <SiteFooter />
    </>
  );
}
