import axiosClient from "./axiosClient";
import { ENDPOINTS } from "./endpoints";

// Interfaces for typing our data
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface Category {
  id: number;
  name: string;
}

export const shopService = {
  // Fetch all products
  getProducts: async (params?: any): Promise<Product[]> => {
    const response = await axiosClient.get(ENDPOINTS.PRODUCTS, { params });
    return response.data;
  },

  // Fetch product details
  getProductDetails: async (id: string | number): Promise<Product> => {
    const response = await axiosClient.get(ENDPOINTS.PRODUCT_DETAILS(id));
    return response.data;
  },

  // Fetch categories
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosClient.get(ENDPOINTS.CATEGORIES);
    return response.data;
  }
};
