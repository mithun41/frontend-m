import type { Metadata } from "next";
import { Montserrat, Cinzel } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dravonfit.com"),
  title: {
    default: "DRAVON FIT | Premium Gym Gear & Fitness Apparel",
    template: "%s | DRAVON FIT",
  },
  description:
    "Discover premium gym gear, fitness accessories, and high-performance athletic apparel at DRAVON FIT. Engineered for ultimate strength, durability, and style.",
  keywords: [
    "DRAVON FIT",
    "gym gear",
    "fitness apparel",
    "workout accessories",
    "gym equipment",
    "athletic wear",
    "fitness gear online",
    "lifting accessories",
  ],
  authors: [{ name: "DRAVON FIT Team" }],
  creator: "DRAVON FIT",
  publisher: "DRAVON FIT",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dravonfit.com",
    siteName: "DRAVON FIT",
    title: "DRAVON FIT | Premium Gym Gear & Fitness Apparel",
    description:
      "Discover premium gym gear, fitness accessories, and high-performance athletic apparel at DRAVON FIT.",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "DRAVON FIT Logo & Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DRAVON FIT | Premium Gym Gear & Fitness Apparel",
    description:
      "Discover premium gym gear, fitness accessories, and high-performance athletic apparel at DRAVON FIT.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
