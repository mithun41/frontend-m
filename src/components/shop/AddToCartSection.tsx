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

  const getSizeStock = (sizeName: string): number | null => {
    if (product.size_stocks && product.size_stocks.length > 0) {
      const found = product.size_stocks.find(
        (ss) => ss.size_name.toUpperCase() === sizeName.toUpperCase()
      );
      return found ? found.stock : 0;
    }
    return product.stock;
  };

  // Find first size in stock
  const initialAvailableSize = product.sizes && product.sizes.length > 0
    ? product.sizes.find((s) => (getSizeStock(s.name) ?? 0) > 0)?.name || product.sizes[0].name
    : null;

  const [selectedSize, setSelectedSize] = useState<string | null>(initialAvailableSize);
  const [quantity, setQuantity] = useState(1);

  const currentSizeStock = selectedSize ? getSizeStock(selectedSize) : product.stock;
  const isOutOfStock = currentSizeStock !== null ? currentSizeStock <= 0 : product.stock <= 0;

  const increaseQuantity = () => {
    if (currentSizeStock !== null && quantity >= currentSizeStock) {
      toast.error(`Maximum available stock for size ${selectedSize || ''} is ${currentSizeStock}`);
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This size is out of stock!");
      return;
    }
    if (currentSizeStock !== null && quantity > currentSizeStock) {
      toast.error(`Only ${currentSizeStock} items available in stock for size ${selectedSize}!`);
      return;
    }

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
          <div className="flex justify-between items-center text-sm font-medium text-neutral-800 dark:text-neutral-200">
            <span>Size</span>
            {selectedSize && currentSizeStock !== null && (
              <span className={`text-xs ${currentSizeStock > 0 ? 'text-emerald-600 font-semibold' : 'text-red-500 font-semibold'}`}>
                {currentSizeStock > 0 ? `${currentSizeStock} in stock` : 'Out of stock'}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const stock = getSizeStock(size.name);
              const outOfStock = stock !== null && stock <= 0;
              const isSelected = selectedSize === size.name;

              return (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.name)}
                  className={`h-10 px-4 flex items-center justify-center border rounded-md text-sm font-medium transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-900 shadow-sm'
                      : outOfStock
                      ? 'border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-600 line-through opacity-70 cursor-pointer'
                      : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-white'
                  }`}
                >
                  {size.name}
                  {stock !== null && stock > 0 && (
                    <span className="ml-1.5 text-[10px] opacity-75">({stock})</span>
                  )}
                </button>
              );
            })}
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
          disabled={isOutOfStock}
          className="flex-grow bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 h-11 rounded-lg font-semibold uppercase tracking-widest text-[11px] hover:bg-primary-600 dark:hover:bg-primary-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>

      {/* Buy Now */}
      <OrderNowButton product={product} quantity={quantity} size={selectedSize || undefined} />
    </div>
  );
}
