import axiosClient from "./axiosClient";

export interface DashboardStats {
  total_revenue: number;
  total_profit: number;
  total_orders: number;
  total_products: number;
  total_customers: number;
  order_status_summary: {
    [key: string]: number;
  };
  recent_orders: {
    id: number;
    customer: string;
    total_amount: number;
    status: string;
    date: string;
  }[];
  top_products: {
    id: number;
    name: string;
    sold_quantity: number;
    stock: number;
    price: number;
  }[];
}

export interface CustomerDashboardResponse {
  user: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    profile_pic: string | null;
  };
  order_summary: {
    total_orders: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  recent_orders: {
    order_number: string;
    status: string;
    total_amount: number;
    created_at: string;
  }[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get("/dashboard/stats/");
    return response.data;
  },

  getCustomerDashboard: async (): Promise<CustomerDashboardResponse> => {
    const response = await axiosClient.get("/users/customer/dashboard/");
    return response.data;
  }
};
