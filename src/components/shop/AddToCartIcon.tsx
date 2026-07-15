"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import { Product } from "@/lib/api/productService";

export function AddToCartIcon({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    addItem({
      product: product.id,
      product_name: product.name,
      product_price: product.price || product.selling_price || "0",
      product_image: product.image_1 || null,
      quantity: 1
    });
    
    toast.success('Added to cart!');
  };

  return (
    <button 
      onClick={handleAdd}
      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-900 shadow-xl hover:bg-primary-500 hover:text-white transition-colors cursor-pointer"
      title="Add to Cart"
    >
      <ShoppingCart className="w-4 h-4" />
    </button>
  );
}
