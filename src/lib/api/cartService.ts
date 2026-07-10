import axiosClient from "./axiosClient";

export interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_price: string;
  product_image: string | null;
  quantity: number;
  total_price: number;
}

export interface Cart {
  id: number;
  user: number;
  items: CartItem[];
  total_amount: number;
  created_at: string;
}

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await axiosClient.get("/cart/");
    return response.data;
  },

  addItem: async (data: { product: number; quantity: number }): Promise<CartItem> => {
    const response = await axiosClient.post("/cart/items/", data);
    return response.data;
  },

  updateItem: async (id: number, data: { quantity: number }): Promise<CartItem> => {
    const response = await axiosClient.patch(`/cart/items/${id}/`, data);
    return response.data;
  },

  removeItem: async (id: number): Promise<void> => {
    await axiosClient.delete(`/cart/items/${id}/`);
  },
};
