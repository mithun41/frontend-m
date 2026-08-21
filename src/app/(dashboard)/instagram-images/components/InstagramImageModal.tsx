"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instagramService, InstagramImage } from "@/lib/api/instagramService";
import Swal from "sweetalert2";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

interface InstagramImageModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  imageToEdit: InstagramImage | null;
}

export default function InstagramImageModal({ open, setOpen, imageToEdit }: InstagramImageModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (imageToEdit) {
      if (imageToEdit.image) {
        setImagePreview(getImageUrl(imageToEdit.image));
      } else {
        setImagePreview(null);
      }
    } else {
      setImagePreview(null);
    }
    setSelectedFile(null);
  }, [imageToEdit, open]);

  const createMutation = useMutation({
    mutationFn: instagramService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instagram-images"] });
      setOpen(false);
      Swal.fire({
        title: "Success!",
        text: "Instagram image has been created.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error: any) => {
      console.error(error?.response?.data);
      const errorMsg = error?.response?.data
        ? Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join('\n')
        : "Failed to create instagram image.";
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

    if (!imageToEdit && !selectedFile) {
      Swal.fire("Error!", "Please select an image.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      if (selectedFile) {
        submitData.append("image", selectedFile);
      }

      createMutation.mutate(submitData);
    } catch (err: any) {
      setIsSubmitting(false);
      Swal.fire("Error!", err.message || "Failed to upload image", "error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-neutral-800 shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {imageToEdit ? "Edit Image" : "Add New Image"}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form id="instagram-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Select Image
            </label>
            <div className="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-gray-300 dark:border-neutral-700 border-dashed rounded-xl relative group hover:border-primary-500 transition-colors">
              <div className="space-y-1 text-center w-full">
                {imagePreview ? (
                  <div className="relative w-full h-40 sm:h-52 mb-3">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      unoptimized
                      className="object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <p className="text-white text-xs sm:text-sm font-medium flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Change Image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                  </div>
                )}
                
                <div className="flex text-xs sm:text-sm text-gray-600 dark:text-gray-400 justify-center">
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
                <p className="text-[10px] sm:text-xs text-gray-500">
                  PNG, JPG, WebP up to 10MB
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-2.5 sm:gap-3 bg-gray-50/50 dark:bg-neutral-900 shrink-0">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            form="instagram-form"
            type="submit"
            disabled={isSubmitting}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              "Upload Image"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
