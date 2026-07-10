"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/api/dashboardService";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users,
  Activity,
  Clock,
  CheckCircle,
  Truck
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const COLORS = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

export default function DashboardHomePage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500">
        <p>Failed to load dashboard data.</p>
      </div>
    );
  }

  // Format data for charts
  const orderStatusData = Object.entries(stats.order_status_summary).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Here is what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary-500" />
            Live Updates
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.total_revenue.toLocaleString()}`} 
          icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
          trend="+12.5%"
          trendUp={true}
          bg="bg-emerald-50 dark:bg-emerald-500/10"
        />
        <StatCard 
          title="Total Profit" 
          value={`$${stats.total_profit.toLocaleString()}`} 
          icon={<TrendingUp className="w-6 h-6 text-primary-500" />}
          trend="+8.2%"
          trendUp={true}
          bg="bg-primary-50 dark:bg-primary-500/10"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.total_orders.toLocaleString()} 
          icon={<ShoppingBag className="w-6 h-6 text-amber-500" />}
          trend="+2.1%"
          trendUp={true}
          bg="bg-amber-50 dark:bg-amber-500/10"
        />
        <StatCard 
          title="Total Customers" 
          value={stats.total_customers.toLocaleString()} 
          icon={<Users className="w-6 h-6 text-rose-500" />}
          trend="+5.4%"
          trendUp={true}
          bg="bg-rose-50 dark:bg-rose-500/10"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Selling Products</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.top_products} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="sold_quantity" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
          <div className="h-[300px] w-full flex flex-col items-center justify-center">
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400">No data available</p>
            )}
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {orderStatusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link href="/orders" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
              {stats.recent_orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">#{order.id.toString().padStart(4, '0')}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{order.customer}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    {format(new Date(order.date), "MMM dd, yyyy h:mm a")}
                  </td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">${order.total_amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recent_orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helpers
function StatCard({ title, value, icon, trend, trendUp, bg }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bg}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center text-sm">
        <span className={`font-semibold ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend}
        </span>
        <span className="text-gray-400 ml-2">vs last month</span>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    case 'shipped':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
    case 'cancelled':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20';
  }
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case 'delivered':
      return <CheckCircle className="w-3.5 h-3.5" />;
    case 'pending':
      return <Clock className="w-3.5 h-3.5" />;
    case 'shipped':
      return <Truck className="w-3.5 h-3.5" />;
    default:
      return <Package className="w-3.5 h-3.5" />;
  }
}
