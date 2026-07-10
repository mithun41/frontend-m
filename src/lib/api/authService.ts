import axiosClient from "./axiosClient";
import { ENDPOINTS } from "./endpoints";
import { User } from "@/store/useAuthStore";

export interface LoginResponse {
  refresh: string;
  access: string;
  user: User;
}

export const authService = {
  register: async (userData: any): Promise<any> => {
    const response = await axiosClient.post("/users/register/", userData);
    return response.data;
  },

  login: async (credentials: any): Promise<LoginResponse> => {
    // Note: Assuming the actual Django endpoint is something like /users/login/ 
    // but using ENDPOINTS.LOGIN for now which might need updating if endpoints.ts is different
    const response = await axiosClient.post("/users/login/", credentials);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await axiosClient.get("/users/profile/");
    return response.data;
  },

  updateProfile: async (data: Partial<User> | FormData): Promise<User> => {
    const response = await axiosClient.patch("/users/profile/", data);
    return response.data;
  }
};
