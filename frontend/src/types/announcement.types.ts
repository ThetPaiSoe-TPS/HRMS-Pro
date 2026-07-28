export interface Announcement {
  id: number;
  title: string;
  content: string;
  summary?: string;
  type: 'general' | 'hr' | 'payroll' | 'event' | 'policy' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'published' | 'archived';
  is_pinned: boolean;
  is_important: boolean;
  target_type: 'all' | 'department' | 'role' | 'specific';
  target_id?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  created_by: number;
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  published_at?: string | null;
  view_count?: number;
  attachments?: AnnouncementAttachment[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface AnnouncementAttachment {
  id: number;
  announcement_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementFormData {
  title: string;
  content: string;
  summary: string;
  type: 'general' | 'hr' | 'payroll' | 'event' | 'policy' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'published' | 'archived';
  is_pinned: boolean;
  is_important: boolean;
  target_type: 'all' | 'department' | 'role' | 'specific';
  target_id: number | null;
  start_date: string;
  end_date: string;
  attachments?: File[];
}

export interface AnnouncementFilters {
  search: string;
  type: string;
  status: string;
  priority: string;
  pinned: boolean;
  important: boolean;
  page: number;
  per_page: number;
}

export interface AnnouncementStats {
  total: number;
  draft: number;
  published: number;
  archived: number;
  pinned: number;
  important: number;
}