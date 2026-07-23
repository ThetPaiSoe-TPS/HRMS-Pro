
export interface Attendance {
  id: number;
  employee_id: number;
  employee?: {
    id: number;
    name: string;
    employee_code: string;
    department: {
      id: number;
      name: string;
    };
    position: {
      id: number;
      title: string;
    };
  };
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  work_hours: number | null;
  overtime_hours: number | null;
  notes: string | null;
  location_in?: string | null;
  location_out?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceFormData {
  employee_id: number;
  date: string;
  check_in: string;
  check_out: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  work_hours: number;
  overtime_hours: number;
  notes: string;
}

export interface AttendanceFilters {
  employee_id: string;
  date_from: string;
  date_to: string;
  status: string;
  page: number;
  per_page: number;
}

export interface AttendanceStats {
  total_employees: number;
  present: number;
  absent: number;
  late: number;
  half_day: number;
  on_leave: number;
  present_percentage: number;
}

export interface CheckInOutData {
  employee_id: number;
  latitude?: string;
  longitude?: string;
  location?: string;
  notes?: string;
}

export interface AttendanceReportFilters {
  date_from: string;
  date_to: string;
  department_id: string;
  employee_id: string;
  status: string;
}

export interface AttendanceSummary {
  date: string;
  total_employees: number;
  present: number;
  absent: number;
  late: number;
  half_day: number;
  on_leave: number;
  present_percentage: number;
}

export interface EmployeeAttendanceSummary {
  employee_id: number;
  employee_name: string;
  employee_code: string;
  department: string;
  total_days: number;
  present: number;
  absent: number;
  late: number;
  half_day: number;
  on_leave: number;
  attendance_rate: number;
}