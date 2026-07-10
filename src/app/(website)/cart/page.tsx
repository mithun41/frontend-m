"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/lib/api/cartService";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { Trash2, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { settingService } from "@/lib/api/settingService";

export default function CartPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const { data: cart, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: !!user,
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingService.getSettings,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => 
      cartService.updateItem(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      Swal.fire("Error", "Failed to update item quantity.", "error");
    }
  });

  const removeMutation = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      Swal.fire("Error", "Failed to remove item from cart.", "error");
    }
  });

  const handleUpdateQuantity = (id: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    updateMutation.mutate({ id, quantity: newQuantity });
  };

  const handleRemove = (id: number) => {
    removeMutation.mutate(id);
  };

  if (!user) return null; // Redirecting in useEffect

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center items-center">
        <p className="text-red-500 mb-4">Failed to load cart data.</p>
        <button onClick={() => queryClient.invalidateQueries({ queryKey: ["cart"] })} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Try Again</button>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen py-12 text-neutral-900 dark:text-neutral-50">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-24">
        
        <h1 className="text-3xl font-bold tracking-tight mb-10">Your Shopping Cart</h1>

        {isEmpty ? (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-16 text-center shadow-sm border border-neutral-100 dark:border-neutral-800">
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Your cart is empty</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-sm mx-auto">
              Looks like you haven&apos;t added anything to your cart yet. Browse our store to find something you love.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl font-semibold uppercase tracking-wider text-sm transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 dark:border-neutral-800">
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Total</div>
                  <div className="col-span-1"></div>
                </div>

                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {cart.items.map((item) => (
                    <div key={item.id} className="py-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                      
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center gap-4 w-full">
                        <Link href={`/shop/${item.product}`} className="shrink-0 relative w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden group">
                          {item.product_image ? (
                            <Image 
                              src={item.product_image.startsWith('/') ? `http://127.0.0.1:8000${item.product_image}` : item.product_image} 
                              alt={item.product_name} 
                              fill 
                              unoptimized
                              className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">No Image</div>
                          )}
                        </Link>
                        <div className="flex flex-col">
                          <Link href={`/shop/${item.product}`} className="font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
                            {item.product_name}
                          </Link>
                          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">
                            {parseFloat(item.product_price).toFixed(2)} BDT
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-2 w-full flex justify-between md:justify-center items-center mt-4 md:mt-0">
                        <div className="md:hidden text-sm font-medium text-neutral-500">Qty:</div>
                        <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg h-10 bg-neutral-50 dark:bg-neutral-950 w-24">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            disabled={updateMutation.isPending || removeMutation.isPending || item.quantity <= 1}
                            className="flex-1 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-semibold text-sm text-neutral-800 dark:text-neutral-200">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            disabled={updateMutation.isPending || removeMutation.isPending}
                            className="flex-1 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total & Remove */}
                      <div className="col-span-4 w-full flex justify-between md:justify-end items-center mt-2 md:mt-0">
                        <div className="font-bold text-neutral-900 dark:text-white md:mr-6">
                          {parseFloat(item.total_price.toString()).toFixed(2)} BDT
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={removeMutation.isPending || updateMutation.isPending}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 dark:border-neutral-800 sticky top-6">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between items-start gap-4 text-neutral-600 dark:text-neutral-400">
                    <span className="shrink-0">Subtotal ({cart.items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                    <span className="font-medium text-neutral-900 dark:text-white text-right">{parseFloat(cart.total_amount.toString()).toFixed(2)} BDT</span>
                  </div>
                  <div className="flex justify-between items-start gap-4 text-neutral-600 dark:text-neutral-400">
                    <span className="shrink-0">Shipping Estimate</span>
                    <span className="font-medium text-neutral-900 dark:text-white text-right text-xs">
                      {settings ? `Inside Dhaka: ৳${settings.delivery_charge_inside_dhaka} | Outside: ৳${settings.delivery_charge_outside_dhaka}` : 'Calculated at checkout'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-4 text-neutral-600 dark:text-neutral-400">
                    <span className="shrink-0">Tax Estimate</span>
                    <span className="font-medium text-neutral-900 dark:text-white text-right">Calculated at checkout</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-neutral-900 dark:text-white">Estimated Total</span>
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{parseFloat(cart.total_amount.toString()).toFixed(2)} BDT</span>
                  </div>
                </div>

                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold uppercase tracking-widest text-sm transition-all shadow-sm shadow-primary-500/25 hover:shadow-md"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
