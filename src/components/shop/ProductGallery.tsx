"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
        <span className="text-neutral-400">No Image Available</span>
      </div>
    );
  }

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      <div 
        ref={containerRef}
        className="relative aspect-square w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 cursor-zoom-in group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[currentIndex]}
          alt={`Product view ${currentIndex + 1}`}
          fill
          priority
          unoptimized
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain transition-transform duration-200 ease-out"
          style={{
            transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
          }}
        />

        {/* Slider Controls */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border-2 cursor-pointer transition-all duration-300 ${currentIndex === i ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-primary-300 opacity-60 hover:opacity-100'}`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${i + 1}`}
                fill
                unoptimized
                sizes="15vw"
                className="object-contain p-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
