import axiosClient from "./axiosClient";

export interface Banner {
  id: number;
  badge_name: string;
  title: string;
  subtitle: string;
  button_1_text: string;
  button_1_link: string;
  button_2_text: string;
  button_2_link: string;
  image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const bannerService = {
  getAll: async (): Promise<Banner[]> => {
    const response = await axiosClient.get("/banners/");
    return response.data;
  },

  create: async (data: FormData): Promise<Banner> => {
    const response = await axiosClient.post("/banners/", data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<Banner> => {
    const response = await axiosClient.patch(`/banners/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/banners/${id}/`);
  },
};
