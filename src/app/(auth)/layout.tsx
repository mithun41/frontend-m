import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Account Authentication | DRAVON FIT",
  robots: {
    index: false,
    follow: false,
  },
};


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Navbar /> */}
      <main className="flex-1 flex flex-col  ">{children}</main>
      {/* <Footer /> */}
    </>
  );
}
