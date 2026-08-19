"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import { OrderNowButton } from "@/components/shop/OrderNowButton";
import { Product } from "@/lib/api/productService";
import { getSizeStock, getFirstAvailableSize } from "@/utils/productStock";

interface AddToCartSectionProps {
  product: Product;
  selectedColor?: string | null;
  onColorChange?: (colorName: string) => void;
}

export function AddToCartSection({ product, selectedColor: propSelectedColor, onColorChange }: AddToCartSectionProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.cart.items);

  const hasSizes = Boolean(product.sizes && product.sizes.length > 0);

  // Find first size in stock if sizes exist
  const initialAvailableSize = hasSizes
    ? getFirstAvailableSize(product) || product.sizes[0].name
    : null;

  // Initial color
  const initialColor = product.colors && product.colors.length > 0
    ? product.colors[0].name
    : null;

  const [selectedSize, setSelectedSize] = useState<string | null>(initialAvailableSize);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    propSelectedColor !== undefined ? propSelectedColor : initialColor
  );
  const [quantity, setQuantity] = useState(1);

  // Sync selectedColor if changed from outside (e.g. image clicked in gallery)
  useEffect(() => {
    if (propSelectedColor !== undefined) {
      setSelectedColor(propSelectedColor);
    }
  }, [propSelectedColor]);

  const currentSizeStock = hasSizes && selectedSize
    ? getSizeStock(product, selectedSize)
    : Math.max(0, product.stock || 0);

  const existingInCart = cartItems.find(
    (item) =>
      item.product === product.id &&
      (item.product_size || "") === (selectedSize || "") &&
      (item.product_color || "") === (selectedColor || "")
  );
  const inCartQty = existingInCart ? existingInCart.quantity : 0;
  const remainingStock = Math.max(0, currentSizeStock - inCartQty);
  const isOutOfStock = currentSizeStock <= 0;
  const isMaxInCart = currentSizeStock > 0 && remainingStock <= 0;

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    if (onColorChange) {
      onColorChange(colorName);
    }
  };

  const increaseQuantity = () => {
    if (quantity >= remainingStock) {
      if (inCartQty > 0) {
        toast.error(`Stock limit reached! You already have ${inCartQty} in your cart (Total stock: ${currentSizeStock}).`);
      } else {
        toast.error(`Maximum available stock is ${currentSizeStock}.`);
      }
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product/size is out of stock!");
      return;
    }
    if (isMaxInCart) {
      toast.error(`You already have all available items (${currentSizeStock}) in your cart!`);
      return;
    }
    if (quantity > remainingStock) {
      toast.error(`Only ${remainingStock} more available to add (Total stock: ${currentSizeStock})!`);
      return;
    }

    const res = addItem({
      product: product.id,
      product_name: product.name,
      product_price: product.price || product.selling_price || "0",
      product_image: product.image_1 || null,
      product_size: selectedSize || undefined,
      product_color: selectedColor || undefined,
      quantity: quantity,
      max_stock: currentSizeStock,
    });

    if (!res.success) {
      toast.error(res.message || "Cannot add more than available stock!");
    } else {
      if (res.message) {
        toast(res.message, { icon: "⚠️" });
      } else {
        toast.success("Added to cart!");
      }
      setQuantity(1);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-md">
      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-medium text-neutral-800 dark:text-neutral-200">
            <span>Color: <span className="font-semibold text-neutral-900 dark:text-white">{selectedColor}</span></span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((color) => {
              const isSelected = selectedColor?.toLowerCase() === color.name.toLowerCase();

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleColorSelect(color.name)}
                  className={`h-9 px-3.5 flex items-center gap-2 border rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-900 shadow-sm ring-2 ring-primary-500/20'
                      : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-600'
                  }`}
                >
                  {color.code && (
                    <span 
                      className={`w-3.5 h-3.5 rounded-full border shrink-0 ${isSelected ? 'border-white/50 dark:border-neutral-800' : 'border-neutral-300 dark:border-neutral-600'}`}
                      style={{ backgroundColor: color.code }}
                    />
                  )}
                  <span>{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-medium text-neutral-800 dark:text-neutral-200">
            <span>Size</span>
            {selectedSize && (
              <span className={`text-xs font-semibold ${
                currentSizeStock <= 0 
                  ? 'text-red-500' 
                  : inCartQty > 0 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {currentSizeStock <= 0 
                  ? 'Out of stock' 
                  : inCartQty > 0 
                  ? `${currentSizeStock} in stock (${inCartQty} in cart)` 
                  : `${currentSizeStock} in stock`}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const stock = getSizeStock(product, size.name);
              const outOfStock = stock <= 0;
              const isSelected = selectedSize === size.name;

              return (
                <button
                  key={size.id}
                  onClick={() => {
                    setSelectedSize(size.name);
                    setQuantity(1);
                  }}
                  className={`h-10 px-4 flex items-center justify-center border rounded-md text-sm font-medium transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-900 shadow-sm'
                      : outOfStock
                      ? 'border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-600 line-through opacity-70 cursor-pointer'
                      : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-white'
                  }`}
                >
                  {size.name}
                  {stock > 0 && (
                    <span className="ml-1.5 text-[10px] opacity-75">({stock})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* If product has no sizes, show stock availability */}
      {!hasSizes && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">Availability:</span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            product.stock > 0 
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
          }`}>
            {product.stock > 0 
              ? inCartQty > 0 
                ? `${product.stock} in stock (${inCartQty} in cart)` 
                : `${product.stock} in stock` 
              : 'Out of stock'}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Quantity */}
        <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-lg h-11 bg-white dark:bg-neutral-950 w-28 shrink-0">
          <button 
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || isOutOfStock || isMaxInCart}
            className="flex-1 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="flex-1 text-center font-medium text-sm text-neutral-800 dark:text-neutral-200">
            {isOutOfStock || isMaxInCart ? 0 : quantity}
          </span>
          <button 
            onClick={increaseQuantity}
            disabled={quantity >= remainingStock || isOutOfStock || isMaxInCart}
            className="flex-1 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
        
        {/* Add to Cart */}
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock || isMaxInCart}
          className="flex-grow bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 h-11 rounded-lg font-semibold uppercase tracking-widest text-[11px] hover:bg-primary-600 dark:hover:bg-primary-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? "Out of Stock" : isMaxInCart ? "Max in Cart" : "Add to Cart"}
        </button>
      </div>

      {/* Buy Now */}
      <OrderNowButton 
        product={product} 
        quantity={quantity} 
        size={selectedSize || undefined} 
        color={selectedColor || undefined} 
      />
    </div>
  );
}
