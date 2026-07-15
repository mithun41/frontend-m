import axiosClient from "./axiosClient";

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  profile_pic: string | null;
  role: string;
}

export const userService = {
  getUsers: async (page: number = 1, search: string = "", role: string = "") => {
    let url = `/users/?page=${page}`;
    if (search) url += `&search=${search}`;
    if (role) url += `&role=${role}`;
    const response = await axiosClient.get(url);
    return response.data;
  },
};
