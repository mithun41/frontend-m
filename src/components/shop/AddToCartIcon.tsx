"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { trackAddToCart } from "@/lib/tracking";
import toast from "react-hot-toast";
import { Product } from "@/lib/api/productService";
import { getFirstAvailableSize, getProductAvailableStock } from "@/utils/productStock";

export function AddToCartIcon({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    const defaultSize = getFirstAvailableSize(product);
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : undefined;
    const availableStock = getProductAvailableStock(product, defaultSize);

    if (availableStock <= 0) {
      toast.error("This product is currently out of stock!");
      return;
    }

    const res = addItem({
      product: product.id,
      product_name: product.name,
      product_price: product.price || product.selling_price || "0",
      product_image: product.image_1 || null,
      product_size: defaultSize,
      product_color: defaultColor,
      quantity: 1,
      max_stock: availableStock,
    });
    
    if (!res.success) {
      toast.error(res.message || "Cannot add more items than available in stock!");
    } else {
      trackAddToCart({ id: product.id, name: product.name, price: parseFloat(String(product.price || product.selling_price || "0")), quantity: 1 });
      if (res.message) {
        toast(res.message, { icon: "⚠️" });
      } else {
        toast.success("Added to cart!");
      }
    }
  };

  const isOutOfStock = getProductAvailableStock(product) <= 0;

  return (
    <button 
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all ${
        isOutOfStock
          ? "bg-neutral-200 text-neutral-400 cursor-not-allowed opacity-60"
          : "bg-white text-neutral-900 hover:bg-primary-500 hover:text-white cursor-pointer"
      }`}
      title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
    >
      <ShoppingCart className="w-4 h-4" />
    </button>
  );
}
