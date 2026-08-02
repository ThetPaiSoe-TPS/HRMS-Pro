import api from "./axios";

export interface Employee {
  id: number;
  name: string;
  email: string;
  employee_code: string;
  status: string;
  hire_date: string;
  salary: number;
  formatted_salary?: string;
  department?: { id: number; name: string };
  position?: { id: number; title: string };
  experience_years?: number;
  status_badge?: string;
}

export interface ScopeResult {
  data: Employee[];
  meta: {
    total: number;
    scope_name: string;
    query: string;
    has_global_scope: boolean;
  };
}

export interface ScopeComparison {
  local_scopes: {
    name: string;
    count: number;
    time: string;
    description: string;
  }[];
  global_scope: {
    name: string;
    count: number;
    time: string;
    description: string;
    is_active: boolean;
  };
}

export const scopeApi = {
  // ✅ Run a local scope
  runLocalScope: async (scope: string, params?: any): Promise<ScopeResult> => {
    const response = await api.get(`/employees/scope/local/${scope}`, {
      params,
    });
    return response;
  },

  // ✅ Get all local scopes
  getLocalScopes: async (): Promise<ScopeComparison> => {
    const response = await api.get("/employees/scope/local/all");
    return response;
  },

  // ✅ Toggle global scope
  toggleGlobalScope: async (enabled: boolean): Promise<ScopeResult> => {
    const response = await api.post("/employees/scope/global/toggle", {
      enabled,
    });
    return response;
  },

  // ✅ Get global scope status
  getGlobalScopeStatus: async (): Promise<{
    enabled: boolean;
    query: string;
  }> => {
    const response = await api.get("/employees/scope/global/status");
    return response;
  },

  // ✅ Compare local vs global
  compareScopes: async (): Promise<ScopeComparison> => {
    const response = await api.get("/employees/scope/compare");
    return response;
  },

  // ✅ Run scope with filter
  runFilteredScope: async (
    scope: string,
    filters: any,
  ): Promise<ScopeResult> => {
    const response = await api.post(
      `/employees/scope/local/${scope}/filter`,
      filters,
    );
    return response;
  },
};
