"use client";

import Link from "next/link";
import { CheckCircle, Copy, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order_number");
  const phone = searchParams.get("phone");

  const copyToClipboard = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      toast.success("Order number copied to clipboard!");
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl p-8 md:p-12 max-w-xl w-full text-center border border-neutral-100 dark:border-neutral-800 transform animate-in fade-in slide-in-from-bottom-5 duration-700">
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            <CheckCircle className="w-24 h-24 text-green-500 relative z-10" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-4 tracking-tight">
          Order Confirmed!
        </h1>
        
        <p className="text-neutral-500 dark:text-neutral-400 mb-6">
          Thank you for shopping with us! Your order has been placed successfully.
        </p>

        {orderNumber && (
          <div className="mb-8">
            <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800/30 rounded-2xl p-6 mb-4">
              <div className="flex items-center justify-center gap-2 mb-2 text-primary-600 dark:text-primary-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-bold uppercase tracking-wider text-sm">Please save this information</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                You will need your Order Number and Phone Number to track your order status.
              </p>
              
              <div className="bg-white dark:bg-neutral-950 rounded-xl p-4 flex flex-col items-center border border-primary-100 dark:border-primary-900/50">
                <span className="text-xs text-neutral-400 uppercase font-bold tracking-widest mb-1">Order Number</span>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-neutral-900 dark:text-white tracking-wider">{orderNumber}</span>
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-neutral-500 transition-colors"
                    title="Copy Order Number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {phone && (
                  <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 w-full">
                    <span className="text-xs text-neutral-400 uppercase font-bold tracking-widest block mb-1">Phone Number Used</span>
                    <span className="text-lg font-bold text-neutral-700 dark:text-neutral-300">{phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={orderNumber && phone ? `/track-order?order_number=${orderNumber}&phone=${phone}` : "/track-order"} 
            className="px-8 py-3.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors"
          >
            Track Order
          </Link>
          <Link 
            href="/shop" 
            className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors shadow-md hover:shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
