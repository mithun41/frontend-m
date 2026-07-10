import axiosClient from "./axiosClient";

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  subcategories?: Category[];
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosClient.get("/categories/");
    return response.data;
  },

  create: async (data: { name: string; slug: string; parent?: number | null }): Promise<Category> => {
    const response = await axiosClient.post("/categories/", data);
    return response.data;
  },

  update: async (id: number, data: { name: string; slug: string; parent?: number | null }): Promise<Category> => {
    const response = await axiosClient.put(`/categories/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/categories/${id}/`);
  },
};
