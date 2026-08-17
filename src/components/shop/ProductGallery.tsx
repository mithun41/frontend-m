"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotoWithColor } from '@/lib/api/productService';
import { DiscountBadge } from '@/components/shop/DiscountBadge';

interface ProductGalleryProps {
  images: string[];
  photos?: PhotoWithColor[];
  activeColor?: string | null;
  sellingPrice?: string | number | null;
  offerPrice?: string | number | null;
  price?: string | number | null;
}

export function ProductGallery({
  images,
  photos,
  activeColor,
  sellingPrice,
  offerPrice,
  price,
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // If active color is selected and a photo matches that color, switch to it
  useEffect(() => {
    if (activeColor && photos && photos.length > 0) {
      const matchIdx = photos.findIndex(
        (p) => p.color && p.color.name.toLowerCase() === activeColor.toLowerCase()
      );
      if (matchIdx >= 0) {
        setCurrentIndex(matchIdx);
      }
    }
  }, [activeColor, photos]);

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

  const currentPhoto = photos && photos[currentIndex] ? photos[currentIndex] : null;

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
          src={images[currentIndex] || images[0]}
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

        {/* Color Badge overlay if current photo has color */}
        {currentPhoto?.color && (
          <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5">
            {currentPhoto.color.code && (
              <span 
                className="w-3 h-3 rounded-full border border-neutral-300 dark:border-neutral-600 inline-block shrink-0" 
                style={{ backgroundColor: currentPhoto.color.code }}
              />
            )}
            <span className="text-neutral-800 dark:text-neutral-200">{currentPhoto.color.name}</span>
          </div>
        )}

        {/* Discount Badge overlay */}
        <div className="absolute bottom-4 left-4 z-10">
          <DiscountBadge
            sellingPrice={sellingPrice}
            offerPrice={offerPrice}
            price={price}
          />
        </div>

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
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, i) => {
            const photoColor = photos && photos[i]?.color;
            return (
              <div 
                key={i} 
                onClick={() => setCurrentIndex(i)}
                className={`relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border-2 cursor-pointer transition-all duration-300 ${currentIndex === i ? 'border-primary-500 shadow-md ring-2 ring-primary-500/20' : 'border-neutral-200 dark:border-neutral-800 hover:border-primary-300 opacity-70 hover:opacity-100'}`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  unoptimized
                  sizes="15vw"
                  className="object-contain p-1.5"
                />
                {photoColor && (
                  <div className="absolute bottom-1 right-1 z-10">
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-white dark:border-neutral-800 shadow-sm block" 
                      style={{ backgroundColor: photoColor.code || '#888' }}
                      title={photoColor.name}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
