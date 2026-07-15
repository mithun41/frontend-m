"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { orderService, Order } from "@/lib/api/orderService";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { Package, Search, Clock, CheckCircle2, Truck, Check } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function TrackOrderPage() {
  const [formData, setFormData] = useState({
    order_number: "",
    phone: "",
  });
  
  const [order, setOrder] = useState<Order | null>(null);

  const trackMutation = useMutation({
    mutationFn: orderService.trackOrder,
    onSuccess: (data) => {
      setOrder(data);
    },
    onError: (error: any) => {
      setOrder(null);
      const msg = error?.response?.data?.error || "Order not found. Please check your details.";
      toast.error(msg);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.order_number || !formData.phone) {
      toast.error("Please provide both order number and phone number.");
      return;
    }
    trackMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white uppercase tracking-tight mb-4 flex items-center justify-center gap-3">
            <Package className="w-8 h-8 text-primary-600" />
            Track Your Order
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Enter your order number and phone number to see the current status of your shipment.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-10 shadow-sm border border-neutral-200 dark:border-neutral-800 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="order_number"
                placeholder="Order Number (e.g. ORD-1234)"
                value={formData.order_number}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white"
                required
              />
            </div>
            <div className="flex-1">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={trackMutation.isPending}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold tracking-wider uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {trackMutation.isPending ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track
                </>
              )}
            </button>
          </form>
        </div>

        {order && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-10 shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-neutral-100 dark:border-neutral-800 gap-4">
              <div>
                <p className="text-sm text-neutral-500 font-medium mb-1">Order Number</p>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{order.order_number}</h2>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-neutral-500 font-medium mb-1">Order Date</p>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </h2>
              </div>
            </div>

            {/* Order Status Tracker */}
            <div className="mb-12">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 uppercase tracking-wider text-center">Status</h3>
              
              {order.status === 'Cancelled' ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800/30 rounded-xl p-6 text-center font-semibold">
                  This order has been cancelled.
                </div>
              ) : (
                <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 dark:bg-neutral-800 w-full -z-10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 transition-all duration-1000"
                      style={{ width: `${(getStatusStep(order.status) - 1) * 33.33}%` }}
                    />
                  </div>
                  
                  {[
                    { label: 'Pending', icon: Clock, step: 1 },
                    { label: 'Processing', icon: CheckCircle2, step: 2 },
                    { label: 'Shipped', icon: Truck, step: 3 },
                    { label: 'Delivered', icon: Check, step: 4 }
                  ].map((s) => {
                    const isCompleted = getStatusStep(order.status) >= s.step;
                    const isCurrent = getStatusStep(order.status) === s.step;
                    
                    return (
                      <div key={s.step} className="flex flex-col items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                          isCompleted 
                            ? 'bg-primary-600 border-white dark:border-neutral-900 text-white shadow-lg' 
                            : 'bg-neutral-100 dark:bg-neutral-800 border-white dark:border-neutral-900 text-neutral-400'
                        }`}>
                          <s.icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                        </div>
                        <span className={`text-xs md:text-sm font-bold uppercase tracking-wider ${
                          isCompleted ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'
                        }`}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Details */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">Shipping Details</h3>
                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <p><span className="font-semibold text-neutral-900 dark:text-white">Name:</span> {order.name}</p>
                  <p><span className="font-semibold text-neutral-900 dark:text-white">Phone:</span> {order.phone}</p>
                  <p><span className="font-semibold text-neutral-900 dark:text-white">Address:</span> {order.address}, {order.city}</p>
                  <p><span className="font-semibold text-neutral-900 dark:text-white">Payment:</span> {order.payment_method}</p>
                </div>
              </div>
              
              {/* Items Summary */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold text-neutral-500">
                        {item.quantity}x
                      </div>
                      <div className="flex-1">
                        <Link href={`/shop/${item.product}`} className="text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 line-clamp-1">
                          {item.product_name}
                        </Link>
                        <p className="text-xs text-neutral-500">৳{parseFloat(item.price).toFixed(2)}</p>
                      </div>
                      <div className="font-bold text-sm text-neutral-900 dark:text-white">
                        ৳{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-sm">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span>৳{(parseFloat(order.total_amount) - parseFloat(order.delivery_charge)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Delivery</span>
                    <span>৳{parseFloat(order.delivery_charge).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-900 dark:text-white text-base pt-2">
                    <span>Total</span>
                    <span className="text-primary-600">৳{parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
