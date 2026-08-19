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
    <section className="relative w-full h-[240px] xs:h-[280px] sm:h-[380px] md:h-[500px] lg:h-[600px] overflow-hidden bg-neutral-900">
      {/* Slides */}
      {initialBanners.map((slide, index) => {
        const hasText = Boolean(
          slide.badge_name ||
          slide.title ||
          slide.subtitle ||
          (slide.button_1_text && slide.button_1_link) ||
          (slide.button_2_text && slide.button_2_link)
        );

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="absolute inset-0">
              {slide.image && (
                <Image
                  src={getImageUrl(slide.image)}
                  alt={slide.title || "Banner"}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  unoptimized
                />
              )}
              {/* Gradient Overlay for text contrast only if there is text */}
              {hasText && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent sm:via-black/50 sm:to-black/20" />
              )}
            </div>

            {/* Clickable slide link if button_1_link exists but no buttons */}
            {slide.button_1_link && !slide.button_1_text && !slide.button_2_text && (
              <Link
                href={slide.button_1_link}
                className="absolute inset-0 z-20"
                aria-label={slide.title || "Banner link"}
              />
            )}
            
            {hasText && (
              <div className="relative z-20 h-full flex items-center justify-start px-4 sm:px-12 lg:px-24">
                <div className="max-w-4xl flex flex-col items-start gap-1.5 sm:gap-4 md:gap-6 transition-all duration-700 delay-300 transform translate-y-0">
                  {slide.badge_name && (
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary-400 bg-black/40 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm">
                      {slide.badge_name}
                    </span>
                  )}
                  {slide.title && (
                    <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white max-w-2xl drop-shadow-lg line-clamp-2 sm:line-clamp-none">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="text-xs sm:text-base md:text-lg lg:text-xl text-neutral-200 max-w-lg leading-snug sm:leading-relaxed drop-shadow-md line-clamp-2 sm:line-clamp-none">
                      {slide.subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2">
                    {slide.button_1_text && slide.button_1_link && (
                      <Link
                        href={slide.button_1_link}
                        className="px-4 py-1.5 sm:px-8 sm:py-3 text-xs sm:text-base bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors shadow-lg"
                      >
                        {slide.button_1_text}
                      </Link>
                    )}
                    {slide.button_2_text && slide.button_2_link && (
                      <Link
                        href={slide.button_2_link}
                        className="px-4 py-1.5 sm:px-8 sm:py-3 text-xs sm:text-base bg-transparent border border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
                      >
                        {slide.button_2_text}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {initialBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5 sm:w-8 sm:h-8" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all focus:outline-none"
          >
            <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-3 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-3">
            {initialBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  index === current ? "bg-white w-5 sm:w-8" : "bg-white/50 w-1.5 sm:w-2.5 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
