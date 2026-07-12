"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/lib/api/cartService";
import { orderService } from "@/lib/api/orderService";
import { settingService } from "@/lib/api/settingService";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: !!user,
  });

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingService.getSettings,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Inside Dhaka",
    payment_method: "Cash on Delivery",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const createOrderMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully!");
      router.push("/checkout/success");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.non_field_errors?.[0] || "Failed to place order. Please try again.";
      toast.error(msg);
    }
  });

  if (user === null) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const orderData = {
      ...formData,
      items: cart.items.map(item => ({
        product_id: item.product,
        quantity: item.quantity,
      }))
    };

    createOrderMutation.mutate(orderData);
  };

  if (isLoading || isLoadingSettings) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading checkout...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Your cart is empty</h2>
        <p className="text-neutral-500 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Browse our shop to find something you love.
        </p>
        <button
          onClick={() => router.push("/shop")}
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const subtotal = parseFloat(cart.total_amount.toString());
  let shipping = 0;
  
  if (settings) {
    shipping = formData.city === "Inside Dhaka" 
      ? parseFloat(settings.delivery_charge_inside_dhaka)
      : parseFloat(settings.delivery_charge_outside_dhaka);
  }
  
  const totalAmount = (subtotal + shipping).toFixed(2);
  const displaySubtotal = subtotal.toFixed(2);
  const displayShipping = shipping > 0 ? `৳${shipping.toFixed(2)}` : "Free";

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-8 tracking-tight uppercase">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column: Billing Details */}
          <div className="flex-1 space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                Billing Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-neutral-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Street Address <span className="text-red-500">*</span></label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-neutral-900 dark:text-white resize-none"
                  ></textarea>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">City / Area <span className="text-red-500">*</span></label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-neutral-900 dark:text-white"
                  >
                    <option value="Inside Dhaka">Inside Dhaka</option>
                    <option value="Outside Dhaka">Outside Dhaka</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                Payment Method
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border border-primary-200 bg-primary-50/50 dark:bg-primary-900/10 dark:border-primary-800 rounded-xl cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="payment_method"
                    value="Cash on Delivery"
                    checked={formData.payment_method === "Cash on Delivery"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="font-semibold text-neutral-900 dark:text-white">Cash on Delivery (COD)</span>
                </label>
                <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl opacity-60 bg-neutral-50 dark:bg-neutral-950 cursor-not-allowed">
                  <label className="flex items-center gap-3 cursor-not-allowed">
                    <input type="radio" disabled name="payment_method" className="w-4 h-4 text-neutral-400" />
                    <span className="font-semibold text-neutral-500">Credit Card / Mobile Banking (Coming Soon)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[400px] xl:w-[450px]">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                Your Order
              </h2>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                      {item.product_image ? (
                        <Image
                          src={getImageUrl(item.product_image)}
                          alt={item.product_name}
                          fill
                          unoptimized
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">No Img</div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">{item.product_name}</h4>
                      <p className="text-xs text-neutral-500 mt-1">
                        {item.quantity} x ৳{parseFloat(item.product_price.toString()).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col justify-center text-right">
                      <span className="font-bold text-sm text-neutral-900 dark:text-white">
                        ৳{parseFloat(item.total_price.toString()).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-medium text-neutral-900 dark:text-white">৳{displaySubtotal}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-neutral-900 dark:text-white'}`}>
                    {displayShipping}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-base font-bold text-neutral-900 dark:text-white">Total</span>
                  <span className="text-xl font-extrabold text-primary-600">৳{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 flex justify-center items-center gap-2"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
              
              <p className="text-xs text-center text-neutral-400 mt-4">
                By placing your order, you agree to our Terms & Conditions and Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
