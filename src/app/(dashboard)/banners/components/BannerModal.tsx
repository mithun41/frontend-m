"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bannerService, Banner } from "@/lib/api/bannerService";
import Swal from "sweetalert2";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface BannerModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  bannerToEdit: Banner | null;
}

export default function BannerModal({ open, setOpen, bannerToEdit }: BannerModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    badge_name: "",
    title: "",
    subtitle: "",
    button_1_text: "",
    button_1_link: "",
    button_2_text: "",
    button_2_link: "",
    is_active: true,
  });

  useEffect(() => {
    if (bannerToEdit) {
      setFormData({
        badge_name: bannerToEdit.badge_name || "",
        title: bannerToEdit.title || "",
        subtitle: bannerToEdit.subtitle || "",
        button_1_text: bannerToEdit.button_1_text || "",
        button_1_link: bannerToEdit.button_1_link || "",
        button_2_text: bannerToEdit.button_2_text || "",
        button_2_link: bannerToEdit.button_2_link || "",
        is_active: bannerToEdit.is_active ?? true,
      });
      if (bannerToEdit.image) {
        setImagePreview(bannerToEdit.image.startsWith('/') ? `http://127.0.0.1:8000${bannerToEdit.image}` : bannerToEdit.image);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        badge_name: "",
        title: "",
        subtitle: "",
        button_1_text: "",
        button_1_link: "",
        button_2_text: "",
        button_2_link: "",
        is_active: true,
      });
      setImagePreview(null);
    }
    setSelectedFile(null);
  }, [bannerToEdit, open]);

  const createMutation = useMutation({
    mutationFn: bannerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setOpen(false);
      Swal.fire({
        title: "Success!",
        text: "Banner has been created.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error: any) => {
      console.error(error?.response?.data);
      const errorMsg = error?.response?.data
        ? Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join('\n')
        : "Failed to create banner.";
      Swal.fire("Error!", errorMsg, "error");
    },
    onSettled: () => setIsSubmitting(false)
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: FormData }) => bannerService.update(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setOpen(false);
      Swal.fire({
        title: "Updated!",
        text: "Banner has been updated.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error: any) => {
      console.error(error?.response?.data);
      const errorMsg = error?.response?.data
        ? Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join('\n')
        : "Failed to update banner.";
      Swal.fire("Error!", errorMsg, "error");
    },
    onSettled: () => setIsSubmitting(false)
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bannerToEdit && !selectedFile) {
      Swal.fire("Error!", "Please select a banner image.", "error");
      return;
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, String(value));
    });

    if (selectedFile) {
      submitData.append("image", selectedFile);
    }

    if (bannerToEdit) {
      updateMutation.mutate({ id: bannerToEdit.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {bannerToEdit ? "Edit Banner" : "Add New Banner"}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="space-y-6">
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Banner Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-neutral-700 border-dashed rounded-xl relative group hover:border-primary-500 transition-colors">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <p className="text-white font-medium flex items-center gap-2">
                          <Upload className="w-4 h-4" /> Change Image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                    <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input 
                        type="file" 
                        name="image" 
                        accept="image/*"
                        className="sr-only" 
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Badge Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Badge Name
                </label>
                <input
                  type="text"
                  name="badge_name"
                  value={formData.badge_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  placeholder="e.g. New Arrival"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  placeholder="Banner Title"
                />
              </div>

              {/* Subtitle */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subtitle
                </label>
                <textarea
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none resize-none"
                  placeholder="Banner subtitle or description..."
                />
              </div>

              {/* Button 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Button 1 Text
                </label>
                <input
                  type="text"
                  name="button_1_text"
                  value={formData.button_1_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  placeholder="e.g. Shop Now"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Button 1 Link
                </label>
                <input
                  type="text"
                  name="button_1_link"
                  value={formData.button_1_link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  placeholder="e.g. /shop"
                />
              </div>

              {/* Button 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Button 2 Text
                </label>
                <input
                  type="text"
                  name="button_2_text"
                  value={formData.button_2_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  placeholder="e.g. Learn More"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Button 2 Link
                </label>
                <input
                  type="text"
                  name="button_2_link"
                  value={formData.button_2_link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  placeholder="e.g. /about"
                />
              </div>

              {/* Status */}
              <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-xl">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Active (Display this banner on the homepage)
                </label>
              </div>
            </div>

          </div>

          {/* Footer actions */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                bannerToEdit ? "Update Banner" : "Create Banner"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
