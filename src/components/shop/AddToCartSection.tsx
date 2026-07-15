"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import { OrderNowButton } from "@/components/shop/OrderNowButton";
import { Product } from "@/lib/api/productService";

interface AddToCartSectionProps {
  product: Product;
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0].name : null
  );

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addItem({
      product: product.id,
      product_name: product.name,
      product_price: product.price || product.selling_price || "0",
      product_image: product.image_1 || null,
      product_size: selectedSize || undefined,
      quantity: quantity
    });
    
    toast.success("Added to cart!");
    setQuantity(1);
  };

  return (
    <div className="flex flex-col gap-5 max-w-md">
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Size</span>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.name)}
                className={`h-10 px-4 flex items-center justify-center border rounded-md text-sm font-medium transition-colors ${
                  selectedSize === size.name
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-900'
                    : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-white'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Quantity */}
        <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg h-11 bg-white dark:bg-neutral-950 w-28 shrink-0">
          <button 
            onClick={decreaseQuantity}
            className="flex-1 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            -
          </button>
          <span className="flex-1 text-center font-medium text-sm text-neutral-800 dark:text-neutral-200">
            {quantity}
          </span>
          <button 
            onClick={increaseQuantity}
            className="flex-1 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            +
          </button>
        </div>
        
        {/* Add to Cart */}
        <button 
          onClick={handleAddToCart}
          className="flex-grow bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 h-11 rounded-lg font-semibold uppercase tracking-widest text-[11px] hover:bg-primary-600 dark:hover:bg-primary-500 transition-colors duration-300"
        >
          Add to Cart
        </button>
      </div>

      {/* Buy Now */}
      <OrderNowButton product={product} quantity={quantity} />
    </div>
  );
}
