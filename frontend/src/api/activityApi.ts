import api from "./axios";

export interface Activity {
  id: number;
  action: string;
  description: string;
  time: string;
  icon: string;
  color: string;
  ip: string;
  created_at: string;
}

export const activityApi = {
  getMyActivities: async (limit = 10): Promise<Activity[]> => {
    const data: any = await api.get(`/auth/profile/activities?limit=${limit}`);
    return data?.data || data || [];
  },
};