"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@/lib/api/bannerService";

import { getImageUrl } from "@/lib/utils";

export function HeroSlider({ initialBanners = [] }: { initialBanners?: Banner[] }) {
  const [current, setCurrent] = useState(0);

  // If no banners, we could render a default fallback, but an empty section is also fine.
  const hasBanners = initialBanners && initialBanners.length > 0;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === initialBanners.length - 1 ? 0 : prev + 1));
  }, [initialBanners.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? initialBanners.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!hasBanners) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, hasBanners]);

  if (!hasBanners) {
    return null; // Or a placeholder
  }

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-neutral-900">
      {/* Slides */}
      {initialBanners.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="absolute inset-0 opacity-40">
            <Image
              src={getImageUrl(slide.image)}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
              unoptimized
            />
          </div>
          
          <div className="relative z-20 h-full flex items-center justify-start px-6 sm:px-12 lg:px-24">
            <div className="max-w-4xl flex flex-col items-start gap-6 transition-all duration-700 delay-300 transform translate-y-0">
              {slide.badge_name && (
                <span className="text-xs font-semibold uppercase tracking-widest text-primary-400 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  {slide.badge_name}
                </span>
              )}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white max-w-2xl drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl text-neutral-200 max-w-lg leading-relaxed drop-shadow-md">
                {slide.subtitle}
              </p>
              <div className="flex gap-4 mt-2">
                {slide.button_1_text && slide.button_1_link && (
                  <Link
                    href={slide.button_1_link}
                    className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors shadow-lg"
                  >
                    {slide.button_1_text}
                  </Link>
                )}
                {slide.button_2_text && slide.button_2_link && (
                  <Link
                    href={slide.button_2_link}
                    className="px-8 py-3 bg-transparent border border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
                  >
                    {slide.button_2_text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {initialBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all focus:outline-none"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all focus:outline-none"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {initialBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current ? "bg-primary-400 w-8" : "bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
