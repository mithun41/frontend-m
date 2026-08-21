"use client";

import { useState } from "react";
import { Product, PhotoWithColor } from "@/lib/api/productService";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { AddToCartSection } from "@/components/shop/AddToCartSection";
import { DiscountBadge } from "@/components/shop/DiscountBadge";

export function ProductViewSection({ product }: { product: Product }) {
  const initialColor = product.colors && product.colors.length > 0 ? product.colors[0].name : null;
  const [activeColor, setActiveColor] = useState<string | null>(initialColor);

  // Construct photos list with colors (supporting both product.photos and product.image_X_color)
  const photos: PhotoWithColor[] = (product.photos && product.photos.length > 0)
    ? product.photos
    : [
        { index: 0, image: product.image_1 || "", color: product.image_1_color || null },
        { index: 1, image: product.image_2 || "", color: product.image_2_color || null },
        { index: 2, image: product.image_3 || "", color: product.image_3_color || null },
        { index: 3, image: product.image_4 || "", color: product.image_4_color || null },
        { index: 4, image: product.image_5 || "", color: product.image_5_color || null },
      ].filter((p) => Boolean(p.image));

  const images = photos.length > 0
    ? photos.map((p) => p.image)
    : [
        product.image_1,
        product.image_2,
        product.image_3,
        product.image_4,
        product.image_5,
      ].filter(Boolean) as string[];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
      {/* Left: Product Gallery */}
      <div className="w-full">
        <ProductGallery 
          images={images}
          photos={photos}
          activeColor={activeColor}
          onColorChange={(color) => setActiveColor(color)}
          sellingPrice={product.selling_price}
          offerPrice={product.offer_price}
          price={product.price}
        />
      </div>

      {/* Right: Product Info & Buy */}
      <div className="flex flex-col py-2 lg:py-0">
        <div className="mb-4">
          <span className="text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-950/20 px-3 py-1 rounded-full border border-primary-100 dark:border-primary-900/30">
            {product.category?.name || "Uncategorized"}
          </span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide mt-2 mb-4 text-neutral-900 dark:text-white leading-tight">
          {product.name}
        </h1>

        {product.short_description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 whitespace-pre-wrap">
            {product.short_description}
          </p>
        )}
        
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800/60">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium text-neutral-900 dark:text-white">
              Tk {parseFloat(product.price || product.selling_price || "0").toFixed(2)}
            </span>
            {product.offer_price && parseFloat(product.offer_price) > 0 && (
              <span className="text-lg text-neutral-500 line-through">
                Tk {parseFloat(product.selling_price || "0").toFixed(2)}
              </span>
            )}
            <DiscountBadge
              sellingPrice={product.selling_price}
              offerPrice={product.offer_price}
              price={product.price}
              className="!text-xs border border-neutral-200 dark:border-neutral-700 font-bold"
            />
          </div>
          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800"></div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-primary-500 text-sm">★</span>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{product.average_rating || 0}</span>
            <span className="text-neutral-400 underline ml-1 cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200">
              ({product.reviews?.length || 0} reviews)
            </span>
          </div>
        </div>

        {/* Action Area (Add to Cart / Order Now) */}
        <AddToCartSection 
          product={product} 
          selectedColor={activeColor}
          onColorChange={(color) => setActiveColor(color)} 
        />
      </div>
    </div>
  );
}
