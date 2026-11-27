"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/api/productService";
import { getFirstAvailableSize, getProductAvailableStock } from "@/utils/productStock";
import { trackAddToCart } from "@/lib/tracking";
import toast from "react-hot-toast";

export function OrderNowButton({ 
  product, 
  quantity = 1, 
  size, 
  color 
}: { 
  product: Product; 
  quantity?: number; 
  size?: string;
  color?: string;
}) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Determine effective size if product has sizes but size was not explicitly passed
    let effectiveSize = size;
    if (!effectiveSize && product.sizes && product.sizes.length > 0) {
      effectiveSize = getFirstAvailableSize(product) || product.sizes[0].name;
    }

    // Determine effective color if product has colors but color was not explicitly passed
    let effectiveColor = color;
    if (!effectiveColor && product.colors && product.colors.length > 0) {
      effectiveColor = product.colors[0].name;
    }

    const availableStock = getProductAvailableStock(product, effectiveSize);

    if (availableStock <= 0) {
      toast.error("This item is currently out of stock!");
      return;
    }

    const res = addItem({
      product: product.id,
      product_name: product.name,
      product_price: product.price || product.selling_price || "0",
      product_image: product.image_1 || null,
      product_size: effectiveSize,
      product_color: effectiveColor,
      quantity: quantity,
      max_stock: availableStock,
    });
    
    if (!res.success) {
      toast.error(res.message || "Cannot add more than available in stock!");
      return;
    }

    trackAddToCart({ id: product.id, name: product.name, price: parseFloat(String(product.price || product.selling_price || "0")), quantity });
    router.push("/checkout");
  };

  const isOutOfStock = getProductAvailableStock(product, size) <= 0;

  return (
    <button
      onClick={handleOrder}
      disabled={isOutOfStock}
      className={`w-full mt-2 h-9 rounded-md font-semibold uppercase tracking-widest text-[11px] transition-all shadow-md active:scale-[0.98] flex items-center justify-center ${
        isOutOfStock
          ? "bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed shadow-none"
          : "bg-gradient-to-r from-neutral-900 to-neutral-800 text-white hover:from-neutral-800 hover:to-neutral-700"
      }`}
    >
      {isOutOfStock ? "Out of Stock" : "Order Now"}
    </button>
  );
}
