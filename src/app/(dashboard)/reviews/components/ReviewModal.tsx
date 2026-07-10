"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService, Review } from "@/lib/api/reviewService";
import Swal from "sweetalert2";
import { X } from "lucide-react";

interface ReviewModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reviewToEdit: Review | null;
}

export default function ReviewModal({ open, setOpen, reviewToEdit }: ReviewModalProps) {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    user: "",
    product_name: "",
    rating: 5,
    comment: "",
    status: "pending",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (reviewToEdit) {
        setFormData({
          user: reviewToEdit.user || "",
          product_name: reviewToEdit.product_name || "",
          rating: reviewToEdit.rating || 5,
          comment: reviewToEdit.comment || "",
          status: reviewToEdit.status || "pending",
        });
      } else {
        setFormData({
          user: "",
          product_name: "",
          rating: 5,
          comment: "",
          status: "pending",
        });
      }
      setErrors({});
    }
  }, [open, reviewToEdit]);

  const createMutation = useMutation({
    mutationFn: reviewService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      Swal.fire({ title: "Success!", text: "Review created successfully.", icon: "success", timer: 1500, showConfirmButton: false });
      setOpen(false);
    },
    onError: () => {
      Swal.fire("Error!", "Failed to create review.", "error");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => reviewService.update(reviewToEdit!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      Swal.fire({ title: "Success!", text: "Review updated successfully.", icon: "success", timer: 1500, showConfirmButton: false });
      setOpen(false);
    },
    onError: () => {
      Swal.fire("Error!", "Failed to update review.", "error");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.comment.trim()) {
      setErrors({ comment: "Comment is required" });
      return;
    }

    if (reviewToEdit) {
      // For update, we use PATCH and only send editable fields 
      // (avoiding user and product_name since they might be read-only on backend)
      const updateData = {
        rating: formData.rating,
        comment: formData.comment,
        status: formData.status
      };
      updateMutation.mutate(updateData);
    } else {
      createMutation.mutate(formData);
    }
  };

  if (!open) return null;
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isPending && setOpen(false)}></div>
      
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {reviewToEdit ? "Edit Review" : "Add New Review"}
          </h2>
          <button 
            onClick={() => !isPending && setOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="review-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    User
                  </label>
                  <input
                    type="text"
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    disabled={!!reviewToEdit}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    disabled={!!reviewToEdit}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comment
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all resize-none ${errors.comment ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary-500'}`}
                required
              ></textarea>
              {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment}</p>}
            </div>

          </form>
        </div>

        {/* Footer (Action Buttons) */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 shrink-0 bg-gray-50/50 dark:bg-gray-900">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            form="review-form"
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isPending && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            {reviewToEdit ? "Save Changes" : "Create Review"}
          </button>
        </div>

      </div>
    </div>
  );
}
