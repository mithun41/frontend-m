import type { Metadata } from "next";
import SuccessClient from "./SuccessClient";

export const metadata: Metadata = {
  title: "Order Successful | DRAVON FIT",
  description: "Thank you for your order at DRAVON FIT.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutSuccessPage() {
  return <SuccessClient />;
}
