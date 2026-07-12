"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService, Category } from "@/lib/api/categoryService";
import { DataTable, Column } from "@/components/ui/DataTable";
import CategoryModal from "./components/CategoryModal";
import Swal from "sweetalert2";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const { data: rawCategories = [], isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });

  // Flatten nested categories for the datatable
  const flattenCategories = (cats: Category[], depth = 0): (Category & { depth: number })[] => {
    let result: (Category & { depth: number })[] = [];
    cats.forEach(c => {
      result.push({ ...c, depth });
      if (c.subcategories && c.subcategories.length > 0) {
        result = result.concat(flattenCategories(c.subcategories, depth + 1));
      }
    });
    return result;
  };

  const categories = flattenCategories(rawCategories);

  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      Swal.fire({
        title: "Deleted!",
        text: "Category has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete category.", "error");
    }
  });

  const handleEdit = (category: Category) => {
    setCategoryToEdit(category);
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
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const columns: Column<Category & { depth: number }>[] = [
    { key: "id", header: "ID" },
    {
      key: "image",
      header: "Image",
      render: (item) => (
        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden relative shrink-0">
          {item.image ? (
            <Image
              src={getImageUrl(item.image)}
              alt={item.name}
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
      key: "name", 
      header: "Name", 
      render: (item) => (
        <div style={{ paddingLeft: `${item.depth * 20}px` }} className="flex items-center gap-2">
          {item.depth > 0 && <span className="text-gray-400">↳</span>}
          <span className={`font-semibold ${item.depth === 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {item.name}
          </span>
        </div>
      ) 
    },
    { key: "slug", header: "Slug" },
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your product categories here.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
          Failed to load categories.
        </div>
      ) : (
        <DataTable<Category & { depth: number }>
          columns={columns}
          data={categories}
          paginated={true}
          itemsPerPage={20}
        />
      )}

      <CategoryModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        categoryToEdit={categoryToEdit}
        categories={categories}
      />
    </div>
  );
}
