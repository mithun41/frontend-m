"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Product } from "@/lib/api/productService";

export function OrderNowButton({ product, quantity = 1, size }: { product: Product, quantity?: number, size?: string }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      product: product.id,
      product_name: product.name,
      product_price: product.price || product.selling_price || "0",
      product_image: product.image_1 || null,
      product_size: size,
      quantity: quantity
    });
    
    router.push("/checkout");
  };

  return (
    <button
      onClick={handleOrder}
      className="w-full mt-2 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white h-9 rounded-md font-semibold uppercase tracking-widest text-[11px] hover:from-neutral-800 hover:to-neutral-700 transition-all shadow-md active:scale-[0.98] flex items-center justify-center"
    >
      Order Now
    </button>
  );
}
