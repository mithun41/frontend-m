"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instagramService, InstagramImage } from "@/lib/api/instagramService";
import { DataTable, Column } from "@/components/ui/DataTable";
import InstagramImageModal from "./components/InstagramImageModal";
import Swal from "sweetalert2";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export default function InstagramImagesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: images = [], isLoading, isError } = useQuery({
    queryKey: ["instagram-images"],
    queryFn: instagramService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: instagramService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instagram-images"] });
      Swal.fire({
        title: "Deleted!",
        text: "Image has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete image.", "error");
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

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const columns: Column<InstagramImage>[] = [
    { 
      key: "id", 
      header: "ID",
      render: (item) => <span className="font-semibold text-xs text-gray-500">#{item.id}</span>
    },
    {
      key: "image",
      header: "Image Preview",
      render: (item) => (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden relative shrink-0 shadow-xs">
          {item.image ? (
            <Image
              src={getImageUrl(item.image)}
              alt="Instagram Image"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-400" />
          )}
        </div>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Instagram Images</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your homepage Instagram section images here.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-xs text-sm w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Upload Image
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center text-sm">
          Failed to load Instagram images.
        </div>
      ) : (
        <DataTable<InstagramImage>
          columns={columns}
          data={images}
          paginated={true}
          itemsPerPage={10}
        />
      )}

      <InstagramImageModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        imageToEdit={null}
      />
    </div>
  );
}
