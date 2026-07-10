"use client";

import { ShoppingCart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/lib/api/cartService";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function AddToCartIcon({ productId }: { productId: number }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: cartService.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success('Added to cart!');
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        toast.error('Please login first');
        setTimeout(() => router.push("/login"), 1000);
      } else {
        toast.error('Failed to add item');
      }
    }
  });

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product details page
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    addMutation.mutate({
      product: productId,
      quantity: 1
    });
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={addMutation.isPending}
      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-900 shadow-xl hover:bg-primary-500 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
      title="Add to Cart"
    >
      <ShoppingCart className="w-4 h-4" />
    </button>
  );
}
