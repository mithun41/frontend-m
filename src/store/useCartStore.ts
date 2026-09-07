import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocalCartItem {
  id: string; // generating a local id like Date.now()
  product: number;
  product_name: string;
  product_price: string;
  product_image: string | null;
  product_size?: string;
  product_color?: string;
  quantity: number;
  total_price: number;
  max_stock?: number;
}

export interface LocalCart {
  items: LocalCartItem[];
  total_amount: number;
}

export interface AddItemResult {
  success: boolean;
  message?: string;
  addedQuantity: number;
}

export interface UpdateItemResult {
  success: boolean;
  message?: string;
}

interface CartState {
  cart: LocalCart;
  addItem: (item: Omit<LocalCartItem, 'id' | 'total_price'>) => AddItemResult;
  updateItem: (id: string, quantity: number) => UpdateItemResult;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getItemInCart: (productId: number, size?: string, color?: string) => LocalCartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: {
        items: [],
        total_amount: 0,
      },
      getItemInCart: (productId, size, color) => {
        const items = get().cart.items;
        return items.find(
          (item) =>
            item.product === productId &&
            (item.product_size || '') === (size || '') &&
            (item.product_color || '') === (color || '')
        );
      },
      addItem: (itemData) => {
        let result: AddItemResult = { success: true, addedQuantity: itemData.quantity };

        set((state) => {
          const existingItemIndex = state.cart.items.findIndex(
            (item) =>
              item.product === itemData.product &&
              (item.product_size || '') === (itemData.product_size || '') &&
              (item.product_color || '') === (itemData.product_color || '')
          );

          const maxStock =
            typeof itemData.max_stock === 'number'
              ? Math.max(0, itemData.max_stock)
              : undefined;

          // If stock is 0, reject immediately
          if (maxStock !== undefined && maxStock <= 0) {
            result = {
              success: false,
              message: 'This item is currently out of stock.',
              addedQuantity: 0,
            };
            return state;
          }

          const newItems = [...state.cart.items];

          if (existingItemIndex >= 0) {
            const existingItem = { ...newItems[existingItemIndex] };
            const currentQty = existingItem.quantity;
            const effectiveMaxStock =
              maxStock !== undefined ? maxStock : existingItem.max_stock;

            if (effectiveMaxStock !== undefined && currentQty >= effectiveMaxStock) {
              result = {
                success: false,
                message: `Stock limit reached (${effectiveMaxStock}). You already have all available items in your cart.`,
                addedQuantity: 0,
              };
              return state;
            }

            let quantityToAdd = itemData.quantity;
            if (effectiveMaxStock !== undefined) {
              const availableSpace = effectiveMaxStock - currentQty;
              quantityToAdd = Math.min(itemData.quantity, availableSpace);
            }

            if (quantityToAdd <= 0) {
              result = {
                success: false,
                message: `Stock limit reached (${effectiveMaxStock}).`,
                addedQuantity: 0,
              };
              return state;
            }

            existingItem.quantity = currentQty + quantityToAdd;
            if (effectiveMaxStock !== undefined) {
              existingItem.max_stock = effectiveMaxStock;
            }
            existingItem.total_price =
              parseFloat(existingItem.product_price) * existingItem.quantity;
            newItems[existingItemIndex] = existingItem;

            if (effectiveMaxStock !== undefined && quantityToAdd < itemData.quantity) {
              result = {
                success: true,
                message: `Added ${quantityToAdd} items. Reached max available stock (${effectiveMaxStock}).`,
                addedQuantity: quantityToAdd,
              };
            } else {
              result = {
                success: true,
                addedQuantity: quantityToAdd,
              };
            }
          } else {
            let quantityToAdd = itemData.quantity;
            if (maxStock !== undefined) {
              quantityToAdd = Math.min(itemData.quantity, maxStock);
            }

            if (quantityToAdd <= 0) {
              result = {
                success: false,
                message: 'This item is currently out of stock.',
                addedQuantity: 0,
              };
              return state;
            }

            newItems.push({
              ...itemData,
              quantity: quantityToAdd,
              max_stock: maxStock,
              id: Date.now().toString() + Math.random().toString(),
              total_price: parseFloat(itemData.product_price) * quantityToAdd,
            });

            if (maxStock !== undefined && quantityToAdd < itemData.quantity) {
              result = {
                success: true,
                message: `Added ${quantityToAdd} items. Reached max available stock (${maxStock}).`,
                addedQuantity: quantityToAdd,
              };
            } else {
              result = {
                success: true,
                addedQuantity: quantityToAdd,
              };
            }
          }

          const newTotalAmount = newItems.reduce(
            (sum, item) => sum + item.total_price,
            0
          );

          return {
            cart: {
              items: newItems,
              total_amount: newTotalAmount,
            },
          };
        });

        return result;
      },
      updateItem: (id, quantity) => {
        let result: UpdateItemResult = { success: true };

        set((state) => {
          const itemToUpdate = state.cart.items.find((item) => item.id === id);
          if (!itemToUpdate) return state;

          let targetQuantity = quantity;
          if (
            typeof itemToUpdate.max_stock === 'number' &&
            itemToUpdate.max_stock > 0
          ) {
            if (quantity > itemToUpdate.max_stock) {
              targetQuantity = itemToUpdate.max_stock;
              result = {
                success: false,
                message: `Maximum available stock is ${itemToUpdate.max_stock}.`,
              };
            }
          }

          if (targetQuantity < 1) return state;

          const newItems = state.cart.items.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                quantity: targetQuantity,
                total_price: parseFloat(item.product_price) * targetQuantity,
              };
            }
            return item;
          });

          const newTotalAmount = newItems.reduce(
            (sum, item) => sum + item.total_price,
            0
          );

          return {
            cart: {
              items: newItems,
              total_amount: newTotalAmount,
            },
          };
        });

        return result;
      },
      removeItem: (id) =>
        set((state) => {
          const newItems = state.cart.items.filter((item) => item.id !== id);
          const newTotalAmount = newItems.reduce(
            (sum, item) => sum + item.total_price,
            0
          );

          return {
            cart: {
              items: newItems,
              total_amount: newTotalAmount,
            },
          };
        }),
      clearCart: () =>
        set(() => ({
          cart: {
            items: [],
            total_amount: 0,
          },
        })),
    }),
    {
      name: 'cart-storage',
    }
  )
);
