import api from './axios';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data: any;
  action_url: string;
  icon: string;
  color: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  time_ago: string;
}

export interface NotificationSettings {
  announcements: { enabled: boolean; email: boolean };
  leave: { enabled: boolean; email: boolean };
  payroll: { enabled: boolean; email: boolean };
  attendance: { enabled: boolean; email: boolean };
  system: { enabled: boolean; email: boolean };
}

export const notificationApi = {
  // Get all notifications
  get: async (params?: { unread_only?: boolean; type?: string; page?: number }): Promise<{
    notifications: Notification[];
    unread_count: number;
  }> => {
    const response = await api.get('/notifications', { params });
    return response;
  },

  // Get unread count
  getUnreadCount: async (): Promise<{ unread_count: number }> => {
    const response = await api.get('/notifications/unread-count');
    return response;
  },

  // Mark as read
  markAsRead: async (id: number): Promise<void> => {
    await api.put(`/notifications/mark-read/${id}`);
  },

  // Mark all as read
  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/mark-all-read');
  },

  // Delete notification
  delete: async (id: number): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },

  // Delete all notifications
  deleteAll: async (): Promise<void> => {
    await api.delete('/notifications/all');
  },

  // Get settings
  getSettings: async (): Promise<NotificationSettings> => {
    const response = await api.get('/notifications/settings');
    return response;
  },

  // Update settings
  updateSettings: async (settings: NotificationSettings): Promise<NotificationSettings> => {
    const response = await api.put('/notifications/settings', settings);
    return response;
  },
};