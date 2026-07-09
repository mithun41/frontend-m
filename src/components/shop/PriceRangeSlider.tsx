"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PriceRangeSliderProps {
  minLimit: number;
  maxLimit: number;
}

export function PriceRangeSlider({ minLimit, maxLimit }: PriceRangeSliderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial from URL or default to limits
  const initialMin = parseInt(searchParams.get("minPrice") || String(minLimit), 10);
  const initialMax = parseInt(searchParams.get("maxPrice") || String(maxLimit), 10);

  const [minPrice, setMinPrice] = useState<number>(initialMin);
  const [maxPrice, setMaxPrice] = useState<number>(initialMax);

  const createQueryString = useCallback(
    (min: number, max: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (min > minLimit) params.set("minPrice", min.toString());
      else params.delete("minPrice");

      if (max < maxLimit) params.set("maxPrice", max.toString());
      else params.delete("maxPrice");

      return params.toString();
    },
    [searchParams, minLimit, maxLimit]
  );

  // Debounce updating the URL
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only push to URL if values are valid (min <= max)
      if (minPrice <= maxPrice) {
        const query = createQueryString(minPrice, maxPrice);
        router.push(pathname + (query ? `?${query}` : ""), { scroll: false });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [minPrice, maxPrice, pathname, router, createQueryString]);

  // Sync state if URL changes externally
  useEffect(() => {
    const urlMin = parseInt(searchParams.get("minPrice") || String(minLimit), 10);
    const urlMax = parseInt(searchParams.get("maxPrice") || String(maxLimit), 10);
    setMinPrice(urlMin);
    setMaxPrice(urlMax);
  }, [searchParams, minLimit, maxLimit]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxPrice - 1);
    setMinPrice(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minPrice + 1);
    setMaxPrice(value);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setMinPrice(val === "" ? minLimit : Number(val));
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setMaxPrice(val === "" ? maxLimit : Number(val));
  };

  // Calculate percentage for the active track
  const minPercent = ((minPrice - minLimit) / (maxLimit - minLimit)) * 100;
  const maxPercent = ((maxPrice - minLimit) / (maxLimit - minLimit)) * 100;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Input Boxes */}
      <div className="flex items-center justify-between gap-2">
        {/* Min Input */}
        <div className="flex-1 flex items-center border border-neutral-300 rounded px-3 py-2 focus-within:border-neutral-500 transition-colors bg-white">
          <input
            type="text"
            value={minPrice}
            onChange={handleMinInputChange}
            className="w-full text-sm outline-none bg-transparent text-center"
          />
        </div>

        <span className="text-neutral-400 font-medium">—</span>

        {/* Max Input */}
        <div className="flex-1 flex items-center border border-neutral-300 rounded px-3 py-2 focus-within:border-neutral-500 transition-colors bg-white">
          <input
            type="text"
            value={maxPrice}
            onChange={handleMaxInputChange}
            className="w-full text-sm outline-none bg-transparent text-center"
          />
        </div>
      </div>

      {/* Range Limits Text */}
      <div className="flex items-center justify-between text-xs text-neutral-500 mt-2">
        <span>{minLimit.toFixed(2)} BDT + VAT</span>
        <span>{maxLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BDT + VAT</span>
      </div>

      {/* Dual Range Slider */}
      <div className="relative w-full h-8 mt-1">
        {/* Track Background */}
        <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-neutral-200 rounded-full -translate-y-1/2"></div>
        {/* Active Track */}
        <div 
          className="absolute top-1/2 h-1.5 bg-[#4b4b4b] rounded-full -translate-y-1/2 pointer-events-none"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        ></div>

        {/* Min Range Input */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={minPrice}
          onChange={handleMinChange}
          className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#4b4b4b] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#4b4b4b] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
          style={{ zIndex: minPrice > maxLimit - 100 ? 5 : 3 }}
        />
        
        {/* Max Range Input */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={maxPrice}
          onChange={handleMaxChange}
          className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#4b4b4b] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#4b4b4b] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
}
