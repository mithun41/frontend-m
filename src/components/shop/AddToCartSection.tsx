"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/lib/api/cartService";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { OrderNowButton } from "@/components/shop/OrderNowButton";

interface AddToCartSectionProps {
  productId: number;
}

export function AddToCartSection({ productId }: AddToCartSectionProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const addMutation = useMutation({
    mutationFn: cartService.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart!");
      setQuantity(1); // Reset after adding
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        toast.error("Please login to add items");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        const msg = error?.response?.data?.non_field_errors?.[0] || "Failed to add item to cart.";
        toast.error(msg);
      }
    }
  });

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    
    addMutation.mutate({
      product: productId,
      quantity: quantity
    });
  };

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="flex items-center gap-3">
        {/* Quantity */}
        <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg h-11 bg-white dark:bg-neutral-950 w-28 shrink-0">
          <button 
            onClick={decreaseQuantity}
            className="flex-1 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            -
          </button>
          <span className="flex-1 text-center font-medium text-sm text-neutral-800 dark:text-neutral-200">
            {quantity}
          </span>
          <button 
            onClick={increaseQuantity}
            className="flex-1 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            +
          </button>
        </div>
        
        {/* Add to Cart */}
        <button 
          onClick={handleAddToCart}
          disabled={addMutation.isPending}
          className="flex-grow bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 h-11 rounded-lg font-semibold uppercase tracking-widest text-[11px] hover:bg-primary-600 dark:hover:bg-primary-500 transition-colors duration-300 disabled:opacity-50"
        >
          {addMutation.isPending ? "Adding..." : "Add to Cart"}
        </button>
      </div>

      {/* Buy Now */}
      <OrderNowButton productId={productId} quantity={quantity} />
    </div>
  );
}
