"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { reviewService } from "@/lib/api/reviewService";
import { useAuthStore } from "@/store/useAuthStore";
import Swal from "sweetalert2";

interface ProductReviewsProps {
  productId: number;
  reviews: any[];
}

export function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const createMutation = useMutation({
    mutationFn: reviewService.create,
    onSuccess: () => {
      Swal.fire({
        title: "Review Submitted!",
        text: "Your review has been submitted and is waiting for approval.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
      setComment("");
      setRating(5);
    },
    onError: (error: any) => {
      // Check if it's an auth error
      if (error?.response?.status === 401) {
        Swal.fire({
          title: "Please Login",
          text: "You must be logged in to submit a review.",
          icon: "warning",
          confirmButtonColor: "#f59e0b",
        }).then(() => {
          router.push("/login");
        });
      } else {
        Swal.fire("Error!", "Failed to submit review.", "error");
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    
    if (!comment.trim()) {
      Swal.fire("Error", "Please write a comment", "error");
      return;
    }

    createMutation.mutate({
      product: productId,
      rating,
      comment,
      status: "pending",
    });
  };

  const handleInputFocus = () => {
    if (!user) {
      router.push("/login");
    }
  };

  return (
    <div className="mt-20 pt-10 border-t border-neutral-200 dark:border-neutral-800">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Side: Review Form */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Write a Review</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none"
                    disabled={!user}
                  >
                    <svg
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "text-yellow-400"
                          : "text-neutral-300 dark:text-neutral-700"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onFocus={handleInputFocus}
                placeholder={user ? "Share your thoughts about this product..." : "Please login to write a review"}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-colors"
                disabled={!user}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={!user || createMutation.isPending}
              className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-sm ${
                user
                  ? "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md"
                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
              }`}
            >
              {createMutation.isPending ? "Submitting..." : user ? "Submit Review" : "Login to Review"}
            </button>
          </form>
        </div>

        {/* Right Side: Reviews List */}
        <div className="lg:col-span-2 lg:pl-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Customer Reviews ({reviews.length})</h2>
          </div>
          
          {reviews.length === 0 ? (
            <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-xl p-6 text-center border border-neutral-100 dark:border-neutral-800">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedReviews.map((review: any) => (
                <div key={review.id} className="bg-white dark:bg-neutral-900 rounded-xl p-4 shadow-sm border border-neutral-100 dark:border-neutral-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">{review.user}</h4>
                      <div className="flex items-center gap-0.5 mt-0.5 text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? "text-yellow-400" : "text-neutral-300 dark:text-neutral-700"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
              
              {reviews.length > 3 && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    {showAllReviews ? "See Less" : `See All Reviews (${reviews.length})`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
