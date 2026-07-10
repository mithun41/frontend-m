"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Eye, Trash2, ArrowLeft, ArrowRight, Package } from "lucide-react";
import { orderService } from "@/lib/api/orderService";
import Swal from "sweetalert2";
import OrderModal from "./components/OrderModal";
import { DataTable, Column } from "@/components/ui/DataTable";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["orders", page, search, statusFilter],
    queryFn: () => orderService.getOrders(page, search, statusFilter),
  });

  const deleteMutation = useMutation({
    mutationFn: orderService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      Swal.fire({
        toast: true,
        position: 'center',
        icon: 'success',
        title: 'Order deleted successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      Swal.fire({
        toast: true,
        position: 'center',
        icon: 'error',
        title: 'Failed to delete order.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const openOrderDetails = (id: number) => {
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search by name, email, phone, or ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-48 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto w-full">
          {isLoading ? (
            <div className="py-20 text-center text-gray-500">Loading orders...</div>
          ) : (
            <DataTable 
              columns={[
                { 
                  key: "order_number", 
                  header: "Order Number", 
                  render: (order) => <span className="font-semibold text-gray-900">{order.order_number}</span> 
                },
                { 
                  key: "customer", 
                  header: "Customer", 
                  render: (order) => <span className="text-sm font-medium text-gray-900 block">{order.name}</span> 
                },
                { 
                  key: "contact", 
                  header: "Contact", 
                  render: (order) => (
                    <>
                      <span className="text-xs text-gray-500 block">{order.email}</span>
                      <span className="text-xs text-gray-500 block">{order.phone}</span>
                    </>
                  ) 
                },
                { 
                  key: "date", 
                  header: "Date", 
                  render: (order) => <span className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</span> 
                },
                { 
                  key: "total", 
                  header: "Total", 
                  render: (order) => <span className="text-sm font-bold text-gray-900">৳{parseFloat(order.total_amount).toFixed(2)}</span> 
                },
                { 
                  key: "status", 
                  header: "Status", 
                  render: (order) => (
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md
                      ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'}`}
                    >
                      {order.status}
                    </span>
                  ) 
                },
                { 
                  key: "actions", 
                  header: "Actions", 
                  render: (order) => (
                    <div className="flex justify-start gap-2">
                      <button
                        onClick={() => openOrderDetails(order.id)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) 
                }
              ]}
              data={data?.results || []}
              paginated={true}
              serverPagination={true}
              totalItems={data?.count || 0}
              currentPage={page}
              itemsPerPage={20}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      </div>

      <OrderModal 
        open={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrderId(null);
        }}
        orderId={selectedOrderId}
      />
    </div>
  );
}
