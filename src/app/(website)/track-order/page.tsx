import type { Metadata } from "next";
import TrackOrderClient from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order | DRAVON FIT",
  description:
    "Track the live status of your DRAVON FIT shipment and order delivery by entering your order number and phone number.",
  openGraph: {
    title: "Track Your Order | DRAVON FIT",
    description: "Track the live status of your DRAVON FIT shipment and order delivery.",
    url: "https://dravonfit.com/track-order",
    siteName: "DRAVON FIT",
  },
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
