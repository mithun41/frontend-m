"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, Product } from "@/lib/api/productService";
import { DataTable, Column } from "@/components/ui/DataTable";
import ProductModal from "./components/ProductModal";
import Swal from "sweetalert2";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", currentPage],
    queryFn: () => productService.getProducts(currentPage),
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Swal.fire({
        title: "Deleted!",
        text: "Product has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete product.", "error");
    }
  });

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

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

  const handleAdd = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const columns: Column<Product>[] = [
    { 
      key: "image_1", 
      header: "Image", 
      render: (item) => (
        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative border border-gray-200 dark:border-gray-700 shrink-0">
          {item.image_1 ? (
            <Image src={item.image_1} alt={item.name} fill className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-[10px]">No img</span>
            </div>
          )}
        </div>
      )
    },
    { 
      key: "name", 
      header: "Product Details", 
      render: (item) => (
        <div className="min-w-[140px] max-w-[260px]">
          <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
          <p className="text-xs text-gray-500">{item.category?.name}</p>
          {item.colors && item.colors.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.colors.map(c => (
                <span 
                  key={c.id} 
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                >
                  {c.code && <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ backgroundColor: c.code }} />}
                  {c.name}
                </span>
              ))}
            </div>
          )}
        </div>
      ) 
    },
    { 
      key: "price", 
      header: "Price",
      render: (item) => (
        <div className="whitespace-nowrap">
          <span className="font-bold text-gray-900 dark:text-white">৳{item.price}</span>
          {item.offer_price && (
            <span className="ml-1.5 text-xs text-gray-400 line-through">৳{item.selling_price}</span>
          )}
        </div>
      )
    },
    { 
      key: "stock", 
      header: "Stock",
      render: (item) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${item.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : item.stock > 0 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
          {item.stock} in stock
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your inventory and pricing here.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-xs text-sm w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center text-sm">
          Failed to load products.
        </div>
      ) : (
        <DataTable<Product>
          columns={columns}
          data={data?.results || []}
          paginated={true}
          itemsPerPage={10}
          serverPagination={true}
          totalItems={data?.count || 0}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {isModalOpen && (
        <ProductModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          productToEdit={productToEdit}
        />
      )}
    </div>
  );
}
