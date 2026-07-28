import api from "../axios";
import type {
  Announcement,
  AnnouncementFilters,
  AnnouncementStats,
  AnnouncementFormData,
  AnnouncementAttachment,
} from "../../types/announcement.types";
import type { PaginatedResponse } from "../../types/api.types";

const mapAnnouncement = (data: any): Announcement => ({
  id: data.id,
  title: data.title,
  content: data.content,
  summary: data.summary || "",
  type: data.type || "general",
  priority: data.priority || "medium",
  status: data.status || "draft",
  is_pinned: data.is_pinned || false,
  is_important: data.is_important || false,
  target_type: data.target_type || "all",
  target_id: data.target_id || null,
  start_date: data.start_date || null,
  end_date: data.end_date || null,
  created_by: data.created_by,
  creator: data.creator
    ? {
        id: data.creator.id,
        name: data.creator.name,
        email: data.creator.email,
      }
    : undefined,
  published_at: data.published_at || null,
  view_count: data.view_count || 0,
  attachments: (data.attachments || []).map((att: any) => ({
    id: att.id,
    announcement_id: att.announcement_id,
    file_name: att.file_name,
    file_path: att.file_path,
    file_size: att.file_size,
    mime_type: att.mime_type,
    file_url: att.file_url,
    created_at: att.created_at,
    updated_at: att.updated_at,
  })),
  created_at: data.created_at,
  updated_at: data.updated_at,
  deleted_at: data.deleted_at || null,
});

export const announcementApi = {
  getAnnouncements: async (
    filters: AnnouncementFilters,
  ): Promise<PaginatedResponse<Announcement>> => {
    const params: Record<string, any> = {
      page: filters.page,
      per_page: filters.per_page,
    };
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.pinned) params.pinned = filters.pinned;
    if (filters.important) params.important = filters.important;

    const response: any = await api.get("/announcements", { params });
    const data = response.data || response || [];
    const dataArray = Array.isArray(data) ? data : [];

    return {
      data: dataArray.map(mapAnnouncement),
      current_page: response.current_page || 1,
      last_page: response.last_page || 1,
      per_page: response.per_page || 10,
      total: response.total || dataArray.length,
      from: response.from || 0,
      to: response.to || dataArray.length,
    };
  },

  getAnnouncement: async (id: number): Promise<Announcement> => {
    const response: any = await api.get(`/announcements/${id}`);
    return mapAnnouncement(response);
  },

  createAnnouncement: async (data: FormData): Promise<Announcement> => {
    const response: any = await api.post("/announcements", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapAnnouncement(response);
  },

  updateAnnouncement: async (
    id: number,
    data: FormData,
  ): Promise<Announcement> => {
    const response: any = await api.put(`/announcements/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapAnnouncement(response);
  },

  deleteAnnouncement: async (id: number): Promise<void> => {
    await api.delete(`/announcements/${id}`);
  },

  publishAnnouncement: async (id: number): Promise<Announcement> => {
    const response: any = await api.post(`/announcements/${id}/publish`);
    return mapAnnouncement(response);
  },

  archiveAnnouncement: async (id: number): Promise<Announcement> => {
    const response: any = await api.post(`/announcements/${id}/archive`);
    return mapAnnouncement(response);
  },

  pinAnnouncement: async (id: number): Promise<Announcement> => {
    const response: any = await api.post(`/announcements/${id}/pin`);
    return mapAnnouncement(response);
  },

  markImportant: async (id: number): Promise<Announcement> => {
    const response: any = await api.post(`/announcements/${id}/important`);
    return mapAnnouncement(response);
  },

  uploadAttachment: async (
    id: number,
    file: File,
  ): Promise<AnnouncementAttachment> => {
    const formData = new FormData();
    formData.append("attachment", file);
    const response: any = await api.post(
      `/announcements/${id}/attachments`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response;
  },

  deleteAttachment: async (id: number): Promise<void> => {
    await api.delete(`/announcements/attachments/${id}`);
  },

  getDashboard: async (): Promise<Announcement[]> => {
    const response: any = await api.get("/announcements/dashboard");
    const data = response || [];
    return (Array.isArray(data) ? data : []).map(mapAnnouncement);
  },

  getStats: async (): Promise<AnnouncementStats> => {
    const response: any = await api.get("/announcements/stats");
    return response;
  },
};
