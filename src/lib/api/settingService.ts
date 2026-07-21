import axiosClient from './axiosClient';

export interface StoreSetting {
  delivery_charge_inside_dhaka: string;
  delivery_charge_outside_dhaka: string;
  youtube_video_id?: string;
  bkash_number?: string;
  nagad_number?: string;
  updated_at: string;
}

export const settingService = {
  getSettings: async (): Promise<StoreSetting> => {
    const response = await axiosClient.get('/settings/');
    return response.data;
  },

  updateSettings: async (data: Partial<StoreSetting>): Promise<StoreSetting> => {
    const response = await axiosClient.patch('/settings/', data);
    return response.data;
  }
};
