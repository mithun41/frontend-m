"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center border border-neutral-100 dark:border-neutral-800 transform animate-in fade-in slide-in-from-bottom-5 duration-700">
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            <CheckCircle className="w-24 h-24 text-green-500 relative z-10" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-4 tracking-tight">
          Order Confirmed!
        </h1>
        
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">
          Thank you for shopping with us! Your order has been placed successfully. We'll send you an email confirmation shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard" 
            className="px-8 py-3.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors"
          >
            View Orders
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
