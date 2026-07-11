"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/lib/api/cartService";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function OrderNowButton({ productId, quantity = 1 }: { productId: number, quantity?: number }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: cartService.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/checkout");
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        toast.error("Please login first");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        toast.error("Failed to add item");
      }
    }
  });

  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
    <button
      onClick={handleOrder}
      disabled={addMutation.isPending}
      className="w-full mt-2 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white h-9 rounded-md font-semibold uppercase tracking-widest text-[11px] hover:from-neutral-800 hover:to-neutral-700 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
    >
      {addMutation.isPending ? (
        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      ) : (
        "Order Now"
      )}
    </button>
  );
}
