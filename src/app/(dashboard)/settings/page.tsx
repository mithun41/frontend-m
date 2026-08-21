"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingService, StoreSetting } from "@/lib/api/settingService";
import Swal from "sweetalert2";
import { Truck, Play, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    delivery_charge_inside_dhaka: "",
    delivery_charge_outside_dhaka: "",
    youtube_video_id: "",
    bkash_number: "",
    nagad_number: "",
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: settingService.getSettings,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        delivery_charge_inside_dhaka: settings.delivery_charge_inside_dhaka,
        delivery_charge_outside_dhaka: settings.delivery_charge_outside_dhaka,
        youtube_video_id: settings.youtube_video_id || "",
        bkash_number: settings.bkash_number || "",
        nagad_number: settings.nagad_number || "",
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<StoreSetting>) => settingService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      Swal.fire({
        toast: true,
        position: 'center',
        icon: 'success',
        title: 'Settings updated successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      Swal.fire({
        toast: true,
        position: 'center',
        icon: 'error',
        title: 'Failed to update settings.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 text-sm">Loading settings...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Store Settings</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage global store configurations and delivery charges.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xs border border-gray-200/80 dark:border-gray-800 overflow-hidden">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary-500" />
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Delivery Charges</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Inside Dhaka Charge (৳)</label>
              <input
                type="number"
                step="0.01"
                name="delivery_charge_inside_dhaka"
                value={formData.delivery_charge_inside_dhaka}
                onChange={handleChange}
                required
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Outside Dhaka Charge (৳)</label>
              <input
                type="number"
                step="0.01"
                name="delivery_charge_outside_dhaka"
                value={formData.delivery_charge_outside_dhaka}
                onChange={handleChange}
                required
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Payment Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">bKash Personal Number</label>
                <input
                  type="text"
                  name="bkash_number"
                  value={formData.bkash_number}
                  onChange={handleChange}
                  placeholder="e.g. 01700000000"
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Nagad Personal Number</label>
                <input
                  type="text"
                  name="nagad_number"
                  value={formData.nagad_number}
                  onChange={handleChange}
                  placeholder="e.g. 01700000000"
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-red-500" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Home Video Settings</h2>
            </div>
            
            <div className="space-y-1.5 max-w-md">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">YouTube Video ID</label>
              <input
                type="text"
                name="youtube_video_id"
                value={formData.youtube_video_id}
                onChange={handleChange}
                placeholder="e.g. 7wtfhZwyrcc"
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-[11px] text-gray-500">The 11-character code at the end of a YouTube URL (e.g. youtube.com/watch?v=<span className="font-semibold text-gray-700 dark:text-gray-300">7wtfhZwyrcc</span>).</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-xs sm:text-sm transition-colors shadow-xs disabled:opacity-50 w-full sm:w-auto"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
