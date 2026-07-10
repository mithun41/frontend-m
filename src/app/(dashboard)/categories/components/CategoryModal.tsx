"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService, Category } from "@/lib/api/categoryService";
import Swal from "sweetalert2";
import { X } from "lucide-react";

interface CategoryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  categoryToEdit?: Category | null;
  categories: Category[];
}

export default function CategoryModal({ open, setOpen, categoryToEdit, categories }: CategoryModalProps) {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<{ name: string; slug: string; parent: number | null }>({
    name: "",
    slug: "",
    parent: null,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Reset form when modal opens or category to edit changes
  useEffect(() => {
    if (open) {
      if (categoryToEdit) {
        setFormData({ name: categoryToEdit.name, slug: categoryToEdit.slug, parent: categoryToEdit.parent || null });
      } else {
        setFormData({ name: "", slug: "", parent: null });
      }
      setErrors({});
    }
  }, [open, categoryToEdit]);

  const createMutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      Swal.fire({
        title: "Success!",
        text: "Category created successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setOpen(false);
    },
    onError: handleError
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; slug: string; parent: number | null }) => 
      categoryService.update(categoryToEdit!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      Swal.fire({
        title: "Success!",
        text: "Category updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setOpen(false);
    },
    onError: handleError
  });

  function handleError(error: any) {
    const data = error?.response?.data;
    if (data && typeof data === 'object') {
      if (data.detail) {
        setErrors({ general: [data.detail] });
      } else {
        setErrors(data);
      }
    } else {
      setErrors({ general: ["Something went wrong. Please try again."] });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    // Auto-generate slug from name if creating
    if (name === "name" && !categoryToEdit) {
      const slugValue = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, name: value, slug: slugValue }));
    } else if (name === "parent") {
      setFormData(prev => ({ ...prev, parent: value ? parseInt(value) : null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryToEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  if (!open) return null;

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Prevent selecting itself or its own subcategories as a parent
  const parentOptions = categories.filter(c => c.id !== categoryToEdit?.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isPending && setOpen(false)}></div>
      
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {categoryToEdit ? "Edit Category" : "Add New Category"}
          </h2>
          <button 
            onClick={() => !isPending && setOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-sm">
                {errors.general[0]}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500 focus:border-transparent'}`}
                required
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.slug ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500 focus:border-transparent'}`}
                required
              />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug[0]}</p>}
              <p className="text-[10px] text-gray-500 mt-1">Unique URL-friendly identifier. Auto-generated from name if left empty.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parent Category</label>
              <select
                name="parent"
                value={formData.parent || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.parent ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500 focus:border-transparent'}`}
              >
                <option value="">None (Top Level)</option>
                {parentOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.parent && <p className="text-xs text-red-500 mt-1">{errors.parent[0]}</p>}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                )}
                {categoryToEdit ? "Save Changes" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
