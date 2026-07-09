"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    tag: "Exclusive Collection 2026",
    title: "Redefine Your Modern Lifestyle.",
    description: "Discover curated, premium products crafted for quality, comfort, and ultimate utility. Experience seamless shopping."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&q=80",
    tag: "Summer Sale",
    title: "Up to 50% Off Premium Gear.",
    description: "Upgrade your everyday carry with our latest summer collection. Limited time offer."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80",
    tag: "New Arrivals",
    title: "Smart Accessories for Smart Living.",
    description: "Explore our newest tech accessories designed to keep you connected and productive."
  }
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-neutral-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="absolute inset-0 opacity-40">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
          
          <div className="relative z-20 h-full flex items-center justify-start px-6 sm:px-12 lg:px-24">
            <div className="max-w-4xl flex flex-col items-start gap-6 transition-all duration-700 delay-300 transform translate-y-0">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-400 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                {slide.tag}
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white max-w-2xl drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl text-neutral-200 max-w-lg leading-relaxed drop-shadow-md">
                {slide.description}
              </p>
              <div className="flex gap-4 mt-2">
                <Link
                  href="/products"
                  className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors shadow-lg"
                >
                  Shop Collection
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-3 bg-transparent border border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
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
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? "bg-primary-400 w-8" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
