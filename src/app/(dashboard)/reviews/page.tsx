"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService, Review } from "@/lib/api/reviewService";
import { DataTable, Column } from "@/components/ui/DataTable";
import ReviewModal from "./components/ReviewModal";
import Swal from "sweetalert2";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: reviews = [], isLoading, isError } = useQuery({
    queryKey: ["reviews"],
    queryFn: reviewService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: reviewService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      Swal.fire({
        title: "Deleted!",
        text: "Review has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete review.", "error");
    }
  });

  const handleEdit = (review: Review) => {
    setReviewToEdit(review);
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
    setReviewToEdit(null);
    setIsModalOpen(true);
  };

  const columns: Column<Review>[] = [
    { key: "id", header: "ID" },
    { key: "user", header: "User" },
    { key: "product_name", header: "Product" },
    { 
      key: "rating", 
      header: "Rating",
      render: (item) => (
        <div className="flex items-center text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < item.rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}>★</span>
          ))}
        </div>
      )
    },
    { 
      key: "comment", 
      header: "Comment",
      render: (item) => (
        <span className="truncate block max-w-[200px]" title={item.comment}>{item.comment}</span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        let bgClass = "bg-gray-100 text-gray-800";
        if (item.status === 'approved') bgClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
        if (item.status === 'rejected') bgClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
        if (item.status === 'pending') bgClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
        
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${bgClass}`}>
            {item.status || "pending"}
          </span>
        );
      }
    },
    { 
      key: "created_at", 
      header: "Date",
      render: (item) => new Date(item.created_at).toLocaleDateString()
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

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      (review.user && review.user.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (review.product_name && review.product_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (review.comment && review.comment.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage product reviews and feedback.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search reviews..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Review
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
          Failed to load reviews.
        </div>
      ) : (
        <DataTable<Review>
          columns={columns}
          data={filteredReviews}
          paginated={true}
          itemsPerPage={10}
        />
      )}

      <ReviewModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        reviewToEdit={reviewToEdit}
      />
    </div>
  );
}
