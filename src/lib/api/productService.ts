import axiosClient from "./axiosClient";
import { Category } from "./categoryService";

export interface Product {
  id: number;
  category: Category;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  purchase_price: string;
  selling_price: string;
  offer_price: string | null;
  price: string;
  image_1: string | null;
  image_2: string | null;
  image_3: string | null;
  image_4: string | null;
  image_5: string | null;
  sizes: { id: number; name: string }[];
  stock: number;
  sold_quantity: number;
  expire_date: string | null;
  created_at: string;
  updated_at: string;
  reviews: any[];
  average_rating: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const productService = {
  getProducts: async (page = 1, params?: Record<string, any>): Promise<PaginatedResponse<Product>> => {
    const response = await axiosClient.get(`/products/`, {
      params: { page, ...params }
    });
    return response.data;
  },

  getProductDetails: async (id: string | number): Promise<Product> => {
    const response = await axiosClient.get(`/products/${id}/`);
    return response.data;
  },

  create: async (data: FormData): Promise<Product> => {
    // Note: using multipart/form-data for image uploads
    const response = await axiosClient.post("/products/", data, {
      transformRequest: [(data, headers) => {
        delete headers['Content-Type'];
        return data;
      }],
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<Product> => {
    const response = await axiosClient.patch(`/products/${id}/`, data, {
      transformRequest: [(data, headers) => {
        delete headers['Content-Type'];
        return data;
      }],
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/products/${id}/`);
  },
};
