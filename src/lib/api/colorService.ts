import axiosClient from "./axiosClient";
import { Color } from "./productService";

export const colorService = {
  getAll: async (): Promise<Color[]> => {
    const response = await axiosClient.get("/colors/");
    return response.data;
  },

  create: async (data: { name: string; code?: string }): Promise<Color> => {
    const response = await axiosClient.post("/colors/", data);
    return response.data;
  },

  update: async (id: number, data: { name: string; code?: string }): Promise<Color> => {
    const response = await axiosClient.patch(`/colors/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/colors/${id}/`);
  },
};
