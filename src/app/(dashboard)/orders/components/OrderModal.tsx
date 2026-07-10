"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Package, MapPin, User, Calendar, CreditCard, Mail, Phone, ShoppingBag, Truck, CheckCircle, Clock } from "lucide-react";
import { orderService, Order } from "@/lib/api/orderService";
import Swal from "sweetalert2";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Pending': return <Clock className="w-4 h-4" />;
    case 'Processing': return <Package className="w-4 h-4" />;
    case 'Shipped': return <Truck className="w-4 h-4" />;
    case 'Delivered': return <CheckCircle className="w-4 h-4" />;
    case 'Cancelled': return <X className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
}

export default function OrderModal({ open, onClose, orderId }: OrderModalProps) {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Ribbon */}
        <div className="h-2.5 w-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600"></div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-8 py-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center border border-primary-100 text-primary-600 shadow-sm">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Order <span className="text-primary-600">{order?.order_number || `#${orderId}`}</span>
              </h2>
              {order && (
                <div className="flex items-center gap-2 mt-1.5 text-sm text-gray-500 font-medium">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {order && (
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status}
              </div>
            )}
            <button onClick={onClose} className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors bg-gray-50 border border-transparent hover:border-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 md:p-8 custom-scrollbar">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4 text-gray-400">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="font-medium animate-pulse">Loading order details...</p>
            </div>
          ) : !order ? (
            <div className="py-32 text-center text-gray-500 font-medium text-lg">Order not found.</div>
          ) : (
            <div className="flex flex-col gap-8">
              
              {/* Info Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Customer Info */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-gray-900">Customer Details</h3>
                  </div>
                  <div className="space-y-3.5">
                    <p className="text-gray-900 font-bold text-lg">{order.name}</p>
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <a href={`mailto:${order.email}`} className="hover:text-primary-600 font-medium truncate">{order.email}</a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <a href={`tel:${order.phone}`} className="hover:text-primary-600 font-medium">{order.phone}</a>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-gray-900">Shipping Address</h3>
                  </div>
                  <div className="space-y-3 text-sm text-gray-600 leading-relaxed font-medium">
                    <p className="whitespace-pre-wrap">{order.address}</p>
                    <div className="inline-flex px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 font-bold mt-2 border border-gray-100">
                      {order.city}
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-gray-900">Payment Info</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1 font-medium">Method</p>
                      <p className="font-bold text-gray-900">{order.payment_method}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1 font-medium">Status</p>
                      <p className="font-bold text-gray-900">{order.status}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Order Items & Summary */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 text-lg">Order Items</h3>
                  <span className="text-sm font-bold text-gray-600 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)} Items
                  </span>
                </div>
                
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] uppercase tracking-widest text-gray-500 font-bold">
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4 text-center">Unit Price</th>
                        <th className="px-6 py-4 text-center">Quantity</th>
                        <th className="px-6 py-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-white transition-colors">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                              <span className="font-bold text-gray-900">{item.product_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-gray-600">
                            ৳{parseFloat(item.price).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-700 font-bold text-xs border border-gray-100 group-hover:bg-white transition-colors">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-black text-gray-900 text-base">
                            ৳{(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Section */}
                <div className="bg-gray-50/80 p-6 md:px-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  
                  {/* Status Updater */}
                  <div className="w-full md:w-80 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Update Order Status</label>
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-bold text-gray-800 bg-white cursor-pointer appearance-none shadow-sm hover:border-gray-300 transition-colors"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="w-full md:w-80 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-bold">Subtotal</span>
                      <span className="font-bold text-gray-900">৳{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-bold">Delivery Charge</span>
                      <span className="font-bold text-gray-900">৳{deliveryCharge.toFixed(2)}</span>
                    </div>
                    <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                      <span className="text-lg font-black text-gray-900 uppercase tracking-wider">Total</span>
                      <span className="text-3xl font-black text-primary-600 tracking-tight">৳{total.toFixed(2)}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-white border-t border-gray-100 flex justify-end gap-4 rounded-b-[2rem]">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-gray-50 rounded-xl transition-all uppercase tracking-wider border border-gray-200 hover:border-gray-300"
          >
            Close Window
          </button>
          <button
            type="button"
            onClick={handleUpdateStatus}
            disabled={updateMutation.isPending || status === order?.status}
            className="px-8 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-primary-600 uppercase tracking-wider shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
          >
            {updateMutation.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
