import axiosClient from "./axiosClient";

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  parent: number | null;
  subcategories?: Category[];
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosClient.get("/categories/");
    return response.data;
  },

  create: async (data: FormData | { name: string; slug: string; parent?: number | null }): Promise<Category> => {
    const isFormData = data instanceof FormData;
    const response = await axiosClient.post("/categories/", data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  update: async (id: number, data: FormData | { name: string; slug: string; parent?: number | null }): Promise<Category> => {
    const isFormData = data instanceof FormData;
    const response = await axiosClient.put(`/categories/${id}/`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/categories/${id}/`);
  },
};
