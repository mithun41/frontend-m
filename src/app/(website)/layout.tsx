import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackingPixels } from "@/components/tracking/TrackingPixels";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TrackingPixels />
      <Navbar />
      <main className="flex-1 flex flex-col pt-20">{children}</main>
      <Footer />
    </>
  );
}
