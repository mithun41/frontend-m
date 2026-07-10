"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/lib/api/reportService";
import { format } from "date-fns";
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag,
  Calendar,
  Filter,
  Download
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

type Period = 'today' | '7_days' | '1_month' | 'custom';

export default function SalesReportPage() {
  const [period, setPeriod] = useState<Period>('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ["sales-report", period, startDate, endDate],
    queryFn: () => reportService.getSalesReport({ 
      period: period !== 'custom' ? period : undefined,
      start_date: period === 'custom' ? startDate : undefined,
      end_date: period === 'custom' ? endDate : undefined
    }),
  });

  // Calculate daily sales for chart
  const chartData = report?.sales_data.reduce((acc: any[], order) => {
    const dateStr = format(new Date(order.date), "MMM dd");
    const existing = acc.find(item => item.date === dateStr);
    
    // Calculate profit for this order
    const orderProfit = order.items.reduce((sum, item) => sum + (item.profit || 0), 0);

    if (existing) {
      existing.revenue += Number(order.total_amount);
      existing.profit += orderProfit;
    } else {
      acc.push({
        date: dateStr,
        revenue: Number(order.total_amount),
        profit: orderProfit
      });
    }
    return acc;
  }, [])?.reverse() || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Sales Report</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Detailed analysis of your sales performance</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
            <button 
              onClick={() => setPeriod('today')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${period === 'today' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Today
            </button>
            <button 
              onClick={() => setPeriod('7_days')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${period === '7_days' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setPeriod('1_month')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${period === '1_month' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              1 Month
            </button>
            <button 
              onClick={() => setPeriod('custom')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${period === 'custom' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Custom
            </button>
          </div>

          {period === 'custom' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <span className="text-gray-400">-</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : isError || !report ? (
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 text-center">
          Failed to load sales report.
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Orders</p>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{report.summary.total_orders.toLocaleString()}</h3>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
                <ShoppingBag className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">${report.summary.total_revenue.toLocaleString()}</h3>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                <DollarSign className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Net Profit</p>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">${report.summary.total_profit.toLocaleString()}</h3>
              </div>
              <div className="p-4 bg-primary-50 dark:bg-primary-500/10 rounded-xl">
                <TrendingUp className="w-8 h-8 text-primary-500" />
              </div>
            </div>
          </div>

          {/* Chart Section */}
          {(period !== 'today' && chartData.length > 0) && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue vs Profit Trend</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#f3f4f6'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="revenue" name="Revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Detailed Sales Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Detailed Sales Breakdown</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold w-1/4">Order Info</th>
                    <th className="p-4 font-semibold w-2/4">Items</th>
                    <th className="p-4 font-semibold text-right w-1/4">Financials</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                  {report.sales_data.map((order) => {
                    const orderProfit = order.items.reduce((sum, item) => sum + (item.profit || 0), 0);
                    
                    return (
                      <tr key={order.order_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors align-top">
                        {/* Order Info */}
                        <td className="p-4">
                          <div className="font-bold text-gray-900 dark:text-white mb-1">#{order.order_id.toString().padStart(4, '0')}</div>
                          <div className="text-gray-500 text-xs mb-2">{format(new Date(order.date), "MMM dd, yyyy h:mm a")}</div>
                          <div className="font-medium text-gray-700 dark:text-gray-300">{order.customer_name}</div>
                          <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-200">
                            {order.status}
                          </div>
                        </td>
                        
                        {/* Items */}
                        <td className="p-4">
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-start text-sm bg-gray-50/50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">{item.product_name}</span>
                                  <div className="text-gray-500 text-xs mt-0.5">
                                    Qty: {item.quantity} × Sell: ${item.unit_price} (Buy: ${item.unit_purchase_price})
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-gray-900 dark:text-white">${item.total_price}</div>
                                  <div className="text-xs text-emerald-600 font-medium">+${item.profit} profit</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Financials */}
                        <td className="p-4 text-right">
                          <div className="space-y-2">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                              <span>Total Amount:</span>
                              <span className="font-bold text-gray-900 dark:text-white">${order.total_amount}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                              <span>Total Profit:</span>
                              <span className="font-bold text-emerald-600">${orderProfit}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {report.sales_data.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-gray-500">
                        No sales found for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
