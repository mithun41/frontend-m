import axiosClient from "./axiosClient";

export interface SalesReportResponse {
  summary: {
    total_orders: number;
    total_revenue: number;
    total_profit: number;
  };
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  sales_data: {
    order_id: number;
    date: string;
    customer_name: string;
    status: string;
    total_amount: number;
    items: {
      product_name: string;
      quantity: number;
      unit_price: number;
      unit_purchase_price: number;
      total_price: number;
      total_purchase_price: number;
      profit: number;
    }[];
  }[];
}

export const reportService = {
  getSalesReport: async (params: { period?: string; start_date?: string; end_date?: string; status?: string; page?: number }): Promise<SalesReportResponse> => {
    const response = await axiosClient.get("/reports/sales/", { params });
    return response.data;
  },
};
