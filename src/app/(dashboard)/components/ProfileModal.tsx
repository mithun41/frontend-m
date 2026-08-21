"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/api/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { X, Camera } from "lucide-react";
import { getImageUrl } from "@/utils/getImageUrl";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface ProfileModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ProfileModal({ open, setOpen }: ProfileModalProps) {
  const queryClient = useQueryClient();
  const setAuthUser = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
    enabled: open,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        address: profile.address || "",
      });
      setPreviewUrl(profile.profile_pic || null);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (updatedUser) => {
      setSuccessMsg("Profile updated successfully!");
      queryClient.setQueryData(["profile"], updatedUser);
      if (accessToken && refreshToken) {
        setAuthUser(updatedUser, accessToken, refreshToken);
      }
      setTimeout(() => {
        setSuccessMsg("");
        setOpen(false);
      }, 2000);
    },
    onError: (error: any) => {
      const errorData = error?.response?.data;
      if (errorData) {
        if (typeof errorData === "string") {
          setErrorMsg(errorData);
        } else if (errorData.detail) {
          setErrorMsg(errorData.detail);
        } else {
          const messages = Object.entries(errorData)
            .map(([field, errs]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ");
              const fieldErrors = Array.isArray(errs) ? errs.join(", ") : String(errs);
              return `${fieldName}: ${fieldErrors}`;
            })
            .join(" | ");
          setErrorMsg(messages || "Failed to update profile.");
        }
      } else {
        setErrorMsg(error?.message || "Failed to update profile.");
      }
    },
  });

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      let profilePicUrl = profile?.profile_pic || "";
      if (selectedFile) {
        profilePicUrl = await uploadToCloudinary(selectedFile);
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      if (formData.phone_number) formDataToSend.append("phone_number", formData.phone_number);
      if (formData.address) formDataToSend.append("address", formData.address);
      if (profilePicUrl) formDataToSend.append("profile_pic", profilePicUrl);

      updateMutation.mutate(formDataToSend);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload profile picture to Cloudinary.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setOpen(false)}></div>
      
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transform transition-all max-h-[92vh] flex flex-col">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">My Profile</h2>
          <button 
            onClick={() => setOpen(false)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <form id="profile-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {successMsg && (
                <div className="p-3 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl text-xs sm:text-sm">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-xs sm:text-sm">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
                <div className="relative group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-gray-800 shadow-md">
                    {previewUrl ? (
                      <img src={getImageUrl(previewUrl) as string} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-gray-400 bg-gray-50 dark:bg-gray-800">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md hover:bg-primary-700 transition-colors">
                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-xs sm:text-sm opacity-60 cursor-not-allowed"
                  required
                  disabled
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-xs sm:text-sm"
                />
              </div>
            </form>
          )}
        </div>

        <div className="p-4 sm:px-6 py-3.5 sm:py-4 flex justify-end gap-2.5 sm:gap-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 shrink-0">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm"
          >
            Cancel
          </button>
          <button
            form="profile-form"
            type="submit"
            disabled={updateMutation.isPending}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-xs sm:text-sm shadow-xs"
          >
            {updateMutation.isPending && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
