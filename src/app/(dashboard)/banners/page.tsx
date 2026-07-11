"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerService, Banner } from "@/lib/api/bannerService";
import { DataTable, Column } from "@/components/ui/DataTable";
import BannerModal from "./components/BannerModal";
import Swal from "sweetalert2";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function BannersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState<Banner | null>(null);

  const { data: banners = [], isLoading, isError } = useQuery({
    queryKey: ["banners"],
    queryFn: bannerService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: bannerService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      Swal.fire({
        title: "Deleted!",
        text: "Banner has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete banner.", "error");
    }
  });

  const handleEdit = (banner: Banner) => {
    setBannerToEdit(banner);
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
    setBannerToEdit(null);
    setIsModalOpen(true);
  };

  const columns: Column<Banner>[] = [
    { key: "id", header: "ID" },
    {
      key: "image",
      header: "Image",
      render: (item) => (
        <div className="w-16 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden relative shrink-0">
          {item.image ? (
            <Image
              src={item.image.startsWith('/') ? `http://127.0.0.1:8000${item.image}` : item.image}
              alt={item.title}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <ImageIcon className="w-4 h-4 text-gray-400" />
          )}
        </div>
      )
    },
    { 
      key: "badge_name", 
      header: "Badge Name", 
      render: (item) => (
        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-semibold">
          {item.badge_name || "N/A"}
        </span>
      ) 
    },
    { 
      key: "title", 
      header: "Title",
      render: (item) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {item.title}
        </span>
      )
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => (
        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {item.is_active ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-3">
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
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Banners</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your homepage banners here.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
          Failed to load banners.
        </div>
      ) : (
        <DataTable<Banner>
          columns={columns}
          data={banners}
          paginated={true}
          itemsPerPage={10}
        />
      )}

      <BannerModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        bannerToEdit={bannerToEdit}
      />
    </div>
  );
}
