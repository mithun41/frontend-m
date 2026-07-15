import axiosClient from './axiosClient';

export interface ContactData {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  reply?: string | null;
  replied_at?: string | null;
  status?: 'pending' | 'replied' | 'closed';
  created_at?: string;
}

export const contactService = {
  submitContactForm: async (data: ContactData) => {
    const response = await axiosClient.post('/contacts/', data);
    return response.data;
  },
  
  getContacts: async (page = 1, search = "") => {
    const response = await axiosClient.get(`/contacts/`, {
      params: { page, search },
    });
    return response.data;
  },

  updateContact: async (id: number, data: Partial<ContactData>) => {
    const response = await axiosClient.patch(`/contacts/${id}/`, data);
    return response.data;
  },

  deleteContact: async (id: number) => {
    const response = await axiosClient.delete(`/contacts/${id}/`);
    return response.data;
  },
};
