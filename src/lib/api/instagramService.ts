import axiosClient from "./axiosClient";

export interface InstagramImage {
  id: number;
  image: string;
}

export const instagramService = {
  getAll: async (): Promise<InstagramImage[]> => {
    const response = await axiosClient.get("/instagram-images/");
    return response.data;
  },

  getById: async (id: number): Promise<InstagramImage> => {
    const response = await axiosClient.get(`/instagram-images/${id}/`);
    return response.data;
  },

  create: async (data: FormData): Promise<InstagramImage> => {
    const response = await axiosClient.post("/instagram-images/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/instagram-images/${id}/`);
  },
};
