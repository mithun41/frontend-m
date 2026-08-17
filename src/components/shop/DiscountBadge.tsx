"use client";

import React from "react";
import { calculateDiscountPercent } from "@/utils/discount";

interface DiscountBadgeProps {
  sellingPrice?: string | number | null;
  offerPrice?: string | number | null;
  price?: string | number | null;
  className?: string;
}

export function DiscountBadge({
  sellingPrice,
  offerPrice,
  price,
  className = "",
}: DiscountBadgeProps) {
  const percent = calculateDiscountPercent(sellingPrice, offerPrice, price);

  if (percent <= 0) return null;

  return (
    <div
      className={`bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 shadow-sm uppercase tracking-wider rounded-sm pointer-events-none select-none ${className}`}
    >
      {percent}% OFF
    </div>
  );
}
