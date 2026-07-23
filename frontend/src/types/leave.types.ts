
export interface LeaveType {
  id: number;
  name: string;
  code: string;
  description?: string;
  days_per_year: number;
  is_paid: boolean;
  requires_approval: boolean;
  max_consecutive_days: number | null;
  carry_forward: boolean;
  carry_forward_limit: number | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
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
  leave_type_id: number;
  leave_type?: LeaveType;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  attachment?: string;
  attachment_name?: string;
  approved_by?: number;
  approver?: {
    id: number;
    name: string;
  };
  approved_at?: string;
  rejected_by?: number;
  rejected_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveFormData {
  employee_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  attachment?: File | null;
}

export interface LeaveFilters {
  employee_id: string;
  leave_type_id: string;
  status: string;
  date_from: string;
  date_to: string;
  page: number;
  per_page: number;
}

export interface LeaveBalance {
  leave_type_id: number;
  leave_type_name: string;
  total: number;
  used: number;
  pending: number;
  available: number;
  carry_forward: number;
}

export interface LeaveApprovalData {
  status: 'approved' | 'rejected';
  rejection_reason?: string;
}