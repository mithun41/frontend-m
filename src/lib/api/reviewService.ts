import axiosClient from "./axiosClient";

export interface Review {
  id: number;
  user: string;
  product_name: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
}

export const reviewService = {
  getAll: async (): Promise<Review[]> => {
    const response = await axiosClient.get("/reviews/");
    return response.data;
  },

  create: async (data: any): Promise<Review> => {
    const response = await axiosClient.post("/reviews/", data);
    return response.data;
  },

  update: async (id: number, data: any): Promise<Review> => {
    const response = await axiosClient.patch(`/reviews/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/reviews/${id}/`);
  },
};
