import axiosClient from './axiosClient';

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  price: string;
  quantity: number;
  size?: string;
}

export interface Order {
  id: number;
  order_number: string | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: 'Inside Dhaka' | 'Outside Dhaka';
  payment_method: string;
  sender_number?: string;
  transaction_id?: string;
  status: string;
  total_amount: string;
  delivery_charge: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

export const orderService = {
  getOrders: async (page = 1, search = '', status = ''): Promise<OrderResponse> => {
    let url = `/orders/?page=${page}`;
    if (search) url += `&search=${search}`;
    if (status) url += `&status=${status}`;
    const response = await axiosClient.get(url);
    return response.data;
  },

  createOrder: async (data: any): Promise<Order> => {
    const response = await axiosClient.post('/orders/', data);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<Order> => {
    const response = await axiosClient.patch(`/orders/${id}/`, { status });
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/orders/${id}/`);
  },

  trackOrder: async (data: { order_number: string, phone: string }): Promise<Order> => {
    const response = await axiosClient.post('/track-order/', data);
    return response.data;
  }
};
