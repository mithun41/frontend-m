import axiosClient from './axiosClient';

export interface StoreSetting {
  delivery_charge_inside_dhaka: string;
  delivery_charge_outside_dhaka: string;
  youtube_video_id?: string;
  bkash_number?: string;
  nagad_number?: string;
  facebook_pixel_id?: string | null;
  facebook_capi_configured?: boolean;
  facebook_test_event_code?: string | null;
  updated_at: string;
}

/** Fields only the dashboard sends; the API never returns them. */
export interface StoreSettingUpdate extends Partial<StoreSetting> {
  facebook_capi_token?: string;
}

export const settingService = {
  getSettings: async (): Promise<StoreSetting> => {
    const response = await axiosClient.get('/settings/');
    return response.data;
  },

  updateSettings: async (data: StoreSettingUpdate): Promise<StoreSetting> => {
    const response = await axiosClient.patch('/settings/', data);
    return response.data;
  }
};
