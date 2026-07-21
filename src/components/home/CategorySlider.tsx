"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Category } from "@/lib/api/categoryService";
import { getImageUrl } from "@/utils/getImageUrl";

interface CategorySliderProps {
  categories: Category[];
}

export function CategorySlider({ categories }: CategorySliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  // Fallback images for categories if not provided
  const defaultImages = [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
  ];

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto w-full">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600 block mb-1">
            Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.15em] uppercase text-gray-900">
            Our Categories
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Scroll Navigation Buttons */}
          <div className="flex gap-2 mr-2">
            <button
              onClick={() => scroll("left")}
              className="p-2.5 rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all text-gray-700 shadow-sm"
              aria-label="Previous Category"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2.5 rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all text-gray-700 shadow-sm"
              aria-label="Next Category"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* See All Button */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black hover:text-primary-600 border-b border-black hover:border-primary-600 pb-1 transition-colors"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Categories Slider */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-none py-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category, idx) => {
          const imageSrc =
            (category.image ? getImageUrl(category.image) : null) ||
            defaultImages[idx % defaultImages.length];

          return (
            <Link
              key={category.id}
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative min-w-[220px] sm:min-w-[280px] lg:min-w-[320px] h-[320px] sm:h-[380px] rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 block"
            >
              <Image
                src={imageSrc}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 320px"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                unoptimized
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300" />

              {/* Text Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start z-10">
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-300 group-hover:text-white mt-1.5 font-medium transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
