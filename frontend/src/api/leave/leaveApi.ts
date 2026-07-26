import api from "../axios";
import type {
  LeaveRequest,
  LeaveRequestFormData,
  LeaveFilters,
  LeaveBalance,
  LeaveType,
  PaginatedResponse,
} from "../../types/leave.types";

const mapLeaveRequest = (data: any): LeaveRequest => ({
  id: data.id,
  employee_id: data.employee_id,
  employee: data.employee
    ? {
        id: data.employee.id,
        name: data.employee.name,
        employee_code: data.employee.employee_code,
        photo: data.employee.photo || null, // ✅ Make sure this is included
        department: data.employee.department
          ? {
              id: data.employee.department.id,
              name: data.employee.department.name,
            }
          : undefined,
        position: data.employee.position
          ? {
              id: data.employee.position.id,
              title: data.employee.position.title,
            }
          : undefined,
      }
    : undefined,
  leave_type_id: data.leave_type_id,
  leave_type: data.leave_type
    ? {
        id: data.leave_type.id,
        name: data.leave_type.name,
        code: data.leave_type.code,
      }
    : undefined,
  start_date: data.start_date,
  end_date: data.end_date,
  days: data.days || data.total_days || 1,
  reason: data.reason || "",
  status: data.status || "pending",
  attachment: data.attachment || null,
  attachment_name: data.attachment_original_name || null,
  approved_by: data.approved_by,
  approver: data.approver
    ? {
        id: data.approver.id,
        name: data.approver.name,
      }
    : undefined,
  approved_at: data.approved_at || null,
  rejection_reason: data.rejection_reason || null,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

const mapLeaveType = (data: any): LeaveType => ({
  id: data.id,
  name: data.name,
  code: data.code,
  description: data.description || "",
  days_per_year: data.days_per_year || 0,
  is_paid: data.is_paid ?? true,
  requires_approval: data.requires_approval ?? true,
  max_consecutive_days: data.max_consecutive_days || null,
  carry_forward: data.carry_forward ?? false,
  carry_forward_limit: data.carry_forward_limit || null,
  status: data.status || "active",
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const leaveApi = {
  getLeaveRequests: async (
    filters: LeaveFilters,
  ): Promise<PaginatedResponse<LeaveRequest>> => {
    const params: Record<string, any> = {
      page: filters.page,
      per_page: filters.per_page,
    };
    if (filters.employee_id) params.employee_id = filters.employee_id;
    if (filters.leave_type_id) params.leave_type_id = filters.leave_type_id;
    if (filters.status) params.status = filters.status;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.search) params.search = filters.search;

    const response: any = await api.get("/leave-requests", { params });
    const data = response.data || response || [];
    const dataArray = Array.isArray(data) ? data : [];

    return {
      data: dataArray.map(mapLeaveRequest),
      current_page: response.current_page || 1,
      last_page: response.last_page || 1,
      per_page: response.per_page || 10,
      total: response.total || dataArray.length,
      from: response.from || 0,
      to: response.to || dataArray.length,
    };
  },

  getLeaveRequest: async (id: number): Promise<LeaveRequest> => {
    const response: any = await api.get(`/leave-requests/${id}`);
    return mapLeaveRequest(response);
  },

  createLeaveRequest: async (
    data: LeaveRequestFormData,
  ): Promise<LeaveRequest> => {
    const response: any = await api.post("/leave-requests", data);
    return mapLeaveRequest(response);
  },

  updateLeaveRequest: async (
    id: number,
    data: Partial<LeaveRequestFormData>,
  ): Promise<LeaveRequest> => {
    const response: any = await api.put(`/leave-requests/${id}`, data);
    return mapLeaveRequest(response);
  },

  deleteLeaveRequest: async (id: number): Promise<void> => {
    await api.delete(`/leave-requests/${id}`);
  },

  approveLeaveRequest: async (id: number): Promise<LeaveRequest> => {
    const response: any = await api.post(`/leave-requests/${id}/approve`);
    return mapLeaveRequest(response);
  },

  rejectLeaveRequest: async (
    id: number,
    data: { rejection_reason?: string },
  ): Promise<LeaveRequest> => {
    const response: any = await api.post(`/leave-requests/${id}/reject`, data);
    return mapLeaveRequest(response);
  },

  uploadAttachment: async (
    id: number,
    file: File,
  ): Promise<{ attachment_url: string }> => {
    const formData = new FormData();
    formData.append("attachment", file);
    const response: any = await api.post(
      `/leave-requests/${id}/attachment`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response;
  },

  getLeaveBalance: async (): Promise<LeaveBalance[]> => {
    const response: any = await api.get("/leave-requests/balance");
    return response || [];
  },
};

export const leaveTypeApi = {
  getLeaveTypes: async (filters?: {
    search?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<LeaveType>> => {
    const params: Record<string, any> = {
      page: filters?.page || 1,
      per_page: filters?.per_page || 10,
    };
    if (filters?.search) params.search = filters.search;
    if (filters?.status) params.status = filters.status;

    const response: any = await api.get("/leave-types", { params });
    const data = response.data || response || [];
    const dataArray = Array.isArray(data) ? data : [];

    return {
      data: dataArray.map(mapLeaveType),
      current_page: response.current_page || 1,
      last_page: response.last_page || 1,
      per_page: response.per_page || 10,
      total: response.total || dataArray.length,
      from: response.from || 0,
      to: response.to || dataArray.length,
    };
  },

  getActiveLeaveTypes: async (): Promise<LeaveType[]> => {
    const response: any = await api.get("/leave-types/active");
    const data = response || [];
    return (Array.isArray(data) ? data : []).map(mapLeaveType);
  },

  getLeaveType: async (id: number): Promise<LeaveType> => {
    const response: any = await api.get(`/leave-types/${id}`);
    return mapLeaveType(response);
  },

  createLeaveType: async (data: Partial<LeaveType>): Promise<LeaveType> => {
    const response: any = await api.post("/leave-types", data);
    return mapLeaveType(response);
  },

  updateLeaveType: async (
    id: number,
    data: Partial<LeaveType>,
  ): Promise<LeaveType> => {
    const response: any = await api.put(`/leave-types/${id}`, data);
    return mapLeaveType(response);
  },

  deleteLeaveType: async (id: number): Promise<void> => {
    await api.delete(`/leave-types/${id}`);
  },
};
