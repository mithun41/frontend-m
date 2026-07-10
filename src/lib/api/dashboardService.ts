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

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get("/dashboard/stats/");
    return response.data;
  },
};
