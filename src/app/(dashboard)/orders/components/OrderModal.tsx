"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Package, MapPin, User, Calendar, CreditCard, Mail, Phone, ShoppingBag, Truck, CheckCircle, Clock } from "lucide-react";
import { orderService, Order } from "@/lib/api/orderService";
import Swal from "sweetalert2";
import { useAuthStore } from "@/store/useAuthStore";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    case 'Shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800';
    case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
    case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Pending': return <Clock className="w-3.5 h-3.5" />;
    case 'Processing': return <Package className="w-3.5 h-3.5" />;
    case 'Shipped': return <Truck className="w-3.5 h-3.5" />;
    case 'Delivered': return <CheckCircle className="w-3.5 h-3.5" />;
    case 'Cancelled': return <X className="w-3.5 h-3.5" />;
    default: return <Clock className="w-3.5 h-3.5" />;
  }
}

export default function OrderModal({ open, onClose, orderId }: OrderModalProps) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const listData = queryClient.getQueryData<any>(["orders", 1, "", ""]);
      let found = listData?.results?.find((o: Order) => o.id === orderId);
      if (!found) {
        const res = await orderService.getOrders(1, orderId?.toString() || "");
        found = res.results.find((o: Order) => o.id === orderId);
      }
      return found as Order;
    },
    enabled: !!orderId,
  });

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const updateMutation = useMutation({
    mutationFn: (newStatus: string) => orderService.updateStatus(orderId!, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      Swal.fire({ toast: true, position: 'center', icon: 'success', title: 'Status updated successfully.', showConfirmButton: false, timer: 1500 });
      onClose();
    },
    onError: () => {
      Swal.fire({ toast: true, position: 'center', icon: 'error', title: 'Failed to update status.', showConfirmButton: false, timer: 1500 });
    }
  });

  const handleUpdateStatus = () => {
    if (!status || status === order?.status) {
      onClose();
      return;
    }
    updateMutation.mutate(status);
  };

  if (!open) return null;

  const subtotal = order ? parseFloat(order.total_amount) - parseFloat(order.delivery_charge || "0") : 0;
  const deliveryCharge = order ? parseFloat(order.delivery_charge || "0") : 0;
  const total = order ? parseFloat(order.total_amount) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800">
        
        {/* Header Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600"></div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 sm:px-8 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center border border-primary-100 dark:border-primary-800 text-primary-600 dark:text-primary-400 shrink-0 shadow-xs">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Order <span className="text-primary-600">{order?.order_number || `#${orderId}`}</span>
              </h2>
              {order && (
                <div className="flex items-center gap-1.5 mt-0.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {order && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status}
              </div>
            )}
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950 p-4 sm:p-6 md:p-8 custom-scrollbar">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="text-sm font-medium animate-pulse">Loading order details...</p>
            </div>
          ) : !order ? (
            <div className="py-24 text-center text-gray-500 font-medium text-base">Order not found.</div>
          ) : (
            <div className="flex flex-col gap-6 sm:gap-8">
              
              {/* Info Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                
                {/* Customer Info */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-200/70 dark:border-gray-800 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-50 dark:border-gray-800">
                    <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Customer</h3>
                  </div>
                  <div className="space-y-2.5">
                    <p className="text-gray-900 dark:text-white font-bold text-base">{order.name}</p>
                    <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <a href={`mailto:${order.email}`} className="hover:text-primary-600 truncate">{order.email}</a>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <a href={`tel:${order.phone}`} className="hover:text-primary-600 font-medium">{order.phone}</a>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-200/70 dark:border-gray-800 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-50 dark:border-gray-800">
                    <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Shipping Address</h3>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    <p className="whitespace-pre-wrap">{order.address}</p>
                    <div className="inline-flex px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold mt-1 text-xs">
                      {order.city}
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-200/70 dark:border-gray-800 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-50 dark:border-gray-800">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Payment</h3>
                  </div>
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-400 mb-0.5 text-[11px]">Method</p>
                      <p className="font-bold text-gray-900 dark:text-white">{order.payment_method}</p>
                    </div>
                    {order.sender_number && (
                      <div>
                        <p className="text-gray-400 mb-0.5 text-[11px]">Sender Number</p>
                        <p className="font-bold text-gray-900 dark:text-white">{order.sender_number}</p>
                      </div>
                    )}
                    {order.transaction_id && (
                      <div>
                        <p className="text-gray-400 mb-0.5 text-[11px]">Transaction ID</p>
                        <p className="font-bold text-gray-900 dark:text-white break-all">{order.transaction_id}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Order Items & Summary */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-200/70 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">Order Items</h3>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)} Items
                  </span>
                </div>
                
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">
                        <th className="px-4 sm:px-6 py-3.5">Product</th>
                        <th className="px-4 sm:px-6 py-3.5 text-center">Price</th>
                        <th className="px-4 sm:px-6 py-3.5 text-center">Qty</th>
                        <th className="px-4 sm:px-6 py-3.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs sm:text-sm">
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                          <td className="px-4 sm:px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700">
                                <Package className="w-5 h-5 text-gray-400" />
                              </div>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {item.product_name}
                                {item.size && (
                                  <span className="block text-xs text-gray-500 font-normal mt-0.5">Size: {item.size}</span>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-center font-semibold text-gray-600 dark:text-gray-300">
                            Tk {parseFloat(item.price).toFixed(2)}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-center">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-xs">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-right font-black text-gray-900 dark:text-white">
                            Tk {(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Section */}
                <div className="bg-gray-50/80 dark:bg-gray-800/30 p-4 sm:p-6 md:px-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 sm:gap-6">
                  
                  {/* Status Updater */}
                  <div className="w-full md:w-80 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/70 dark:border-gray-800 shadow-xs">
                    <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Update Order Status</label>
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={user?.role !== 'admin'}
                        className="w-full pl-3.5 pr-8 py-2.5 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 cursor-pointer appearance-none disabled:opacity-50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="w-full md:w-80 bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-200/70 dark:border-gray-800 shadow-xs space-y-2.5">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Subtotal</span>
                      <span className="font-bold text-gray-900 dark:text-white">Tk {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Delivery Charge</span>
                      <span className="font-bold text-gray-900 dark:text-white">Tk {deliveryCharge.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <span className="text-sm sm:text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">Total</span>
                      <span className="text-2xl sm:text-3xl font-black text-primary-600 tracking-tight">Tk {total.toFixed(2)}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-8 py-3.5 sm:py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2.5 sm:gap-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-700"
          >
            Close
          </button>
          {user?.role === 'admin' && (
            <button
              type="button"
              onClick={handleUpdateStatus}
              disabled={updateMutation.isPending || status === order?.status}
              className="px-5 sm:px-8 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all disabled:opacity-50 shadow-md shadow-primary-500/20 flex items-center gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
