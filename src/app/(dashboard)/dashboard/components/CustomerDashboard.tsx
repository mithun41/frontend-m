"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/api/dashboardService";
import { 
  ShoppingBag, 
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Package
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function CustomerDashboard() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["customer-dashboard-stats"],
    queryFn: dashboardService.getCustomerDashboard,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Welcome back, {stats.user.name.split(" ")[0]}!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here is an overview of your recent orders and account activity.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Orders" 
          value={stats.order_summary.total_orders.toString()} 
          icon={<ShoppingBag className="w-6 h-6 text-primary-500" />}
          bg="bg-primary-50 dark:bg-primary-500/10"
        />
        <StatCard 
          title="Pending Orders" 
          value={stats.order_summary.pending.toString()} 
          icon={<Clock className="w-6 h-6 text-amber-500" />}
          bg="bg-amber-50 dark:bg-amber-500/10"
        />
        <StatCard 
          title="Delivered" 
          value={stats.order_summary.delivered.toString()} 
          icon={<CheckCircle className="w-6 h-6 text-emerald-500" />}
          bg="bg-emerald-50 dark:bg-emerald-500/10"
        />
        <StatCard 
          title="Cancelled" 
          value={stats.order_summary.cancelled.toString()} 
          icon={<XCircle className="w-6 h-6 text-rose-500" />}
          bg="bg-rose-50 dark:bg-rose-500/10"
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link href="/orders" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            View All Orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Order No</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
              {stats.recent_orders.map((order) => (
                <tr key={order.order_number} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">#{order.order_number}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    {format(new Date(order.created_at), "MMM dd, yyyy h:mm a")}
                  </td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">৳{order.total_amount.toLocaleString()}</td>
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
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No recent orders found. Start shopping!
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
function StatCard({ title, value, icon, bg }: { title: string, value: string, icon: any, bg: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bg}`}>
          {icon}
        </div>
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
    case 'cancelled':
      return <XCircle className="w-3.5 h-3.5" />;
    default:
      return <Package className="w-3.5 h-3.5" />;
  }
}
