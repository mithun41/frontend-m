import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocalCartItem {
  id: string; // generating a local id like Date.now()
  product: number;
  product_name: string;
  product_price: string;
  product_image: string | null;
  product_size?: string;
  quantity: number;
  total_price: number;
}

export interface LocalCart {
  items: LocalCartItem[];
  total_amount: number;
}

interface CartState {
  cart: LocalCart;
  addItem: (item: Omit<LocalCartItem, 'id' | 'total_price'>) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: {
        items: [],
        total_amount: 0,
      },
      addItem: (itemData) =>
        set((state) => {
          const existingItemIndex = state.cart.items.findIndex(
            (item) => item.product === itemData.product && item.product_size === itemData.product_size
          );

          let newItems = [...state.cart.items];
          if (existingItemIndex >= 0) {
            const existingItem = newItems[existingItemIndex];
            existingItem.quantity += itemData.quantity;
            existingItem.total_price = parseFloat(existingItem.product_price) * existingItem.quantity;
          } else {
            newItems.push({
              ...itemData,
              id: Date.now().toString() + Math.random().toString(),
              total_price: parseFloat(itemData.product_price) * itemData.quantity,
            });
          }

          const newTotalAmount = newItems.reduce((sum, item) => sum + item.total_price, 0);

          return {
            cart: {
              items: newItems,
              total_amount: newTotalAmount,
            },
          };
        }),
      updateItem: (id, quantity) =>
        set((state) => {
          const newItems = state.cart.items.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                quantity,
                total_price: parseFloat(item.product_price) * quantity,
              };
            }
            return item;
          });

          const newTotalAmount = newItems.reduce((sum, item) => sum + item.total_price, 0);

          return {
            cart: {
              items: newItems,
              total_amount: newTotalAmount,
            },
          };
        }),
      removeItem: (id) =>
        set((state) => {
          const newItems = state.cart.items.filter((item) => item.id !== id);
          const newTotalAmount = newItems.reduce((sum, item) => sum + item.total_price, 0);

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
