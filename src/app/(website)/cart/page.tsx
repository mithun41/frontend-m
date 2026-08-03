import type { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Shopping Cart | DRAVON FIT",
  description: "View and manage items in your DRAVON FIT shopping cart before proceeding to checkout.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartPage() {
  return <CartClient />;
}
