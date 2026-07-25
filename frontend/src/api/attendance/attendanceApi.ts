import { AttendanceFilters, CheckInOutData, AttendanceStats } from './../../types/attendance.types';

import type { Attendance } from "../../types/attendance.types";
import api from "../axios";
import type { PaginatedResponse } from '../../types/api.types';

const mapAttendance = (data: any): Attendance => ({
  id: data.id,
  employee_id: data.employee_id,
  employee: data.employee
    ? {
        id: data.employee.id,
        name: data.employee.name,
        employee_code: data.employee.employee_code,
        photo: data.employee.photo || null, // ✅ Add photo field
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
  date:
    data.date ||
    (data.check_in ? new Date(data.check_in).toISOString().split("T")[0] : ""),
  check_in: data.check_in
    ? new Date(data.check_in).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null,
  check_out: data.check_out
    ? new Date(data.check_out).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null,
  status: data.status || "present",
  work_hours: data.work_hours !== undefined ? data.work_hours : null,
  overtime_hours:
    data.overtime_hours !== undefined ? data.overtime_hours : null,
  notes: data.note || data.notes || null,
  location_in: data.location_in || null,
  location_out: data.location_out || null,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const attendanceApi = {
  getAttendance: async (
    filters: AttendanceFilters,
  ): Promise<PaginatedResponse<Attendance>> => {
    const params: Record<string, any> = {
      page: filters.page,
      per_page: filters.per_page,
    };
    if (filters.employee_id) params.employee_id = filters.employee_id;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.status) params.status = filters.status;

    const response: any = await api.get("/attendance", { params });

    const data = response.data || response || [];
    const dataArray = Array.isArray(data) ? data : [];

    return {
      data: dataArray.map(mapAttendance),
      current_page: response.current_page || 1,
      last_page: response.last_page || 1,
      per_page: response.per_page || 10,
      total: response.total || dataArray.length,
      from: response.from || 0,
      to: response.to || dataArray.length,
    };
  },

  getAttendanceById: async (id: number): Promise<Attendance> => {
    const response: any = await api.get(`/attendance/${id}`);
    return mapAttendance(response);
  },

  checkIn: async (data: CheckInOutData): Promise<Attendance> => {
    const response: any = await api.post("/attendance/check-in", data);
    return mapAttendance(response);
  },

  checkOut: async (data: CheckInOutData): Promise<Attendance> => {
    const response: any = await api.post("/attendance/check-out", data);
    return mapAttendance(response);
  },

  updateAttendance: async (
    id: number,
    data: Partial<Attendance>,
  ): Promise<Attendance> => {
    const response: any = await api.put(`/attendance/${id}`, data);
    return mapAttendance(response);
  },

  deleteAttendance: async (id: number): Promise<void> => {
    await api.delete(`/attendance/${id}`);
  },

  getSummary: async (date?: string): Promise<AttendanceStats> => {
    const params: Record<string, any> = {};
    if (date) params.date = date;
    const response: any = await api.get("/attendance/summary", { params });
    return response;
  },
};
