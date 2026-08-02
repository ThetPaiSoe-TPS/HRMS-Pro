import api from './axios';

export interface LoadingComparisonResult {
  comparison: {
    lazy_loading: {
      time: string;
      queries: number;
      description: string;
      sample_queries?: string[];
    };
    eager_loading: {
      time: string;
      queries: number;
      description: string;
      sample_queries?: string[];
    };
    improvement: string;
    query_reduction: string;
  };
  recommendation: string;
  code_example: {
    bad: string;
    good: string;
  };
}

export interface QueryLogResult {
  results: any[];
  total_queries: number;
  queries: any[];
  warning?: string;
  success?: string;
  fix?: string;
  employee_count?: number;
  limit_used?: number;
}

export interface EmployeeCountResult {
  count: number;
  dropdown_options: number[];
}

export const performanceApi = {
  // Compare lazy vs eager loading
  compareLoading: async (): Promise<LoadingComparisonResult> => {
    const response = await api.get('/employees/loading-comparison');
    return response;
  },

  // Show lazy loading with query log
  showLazyLoading: async (limit: number = 10): Promise<QueryLogResult> => {
    const response = await api.get('/employees/lazy-loading', { params: { limit } });
    return response;
  },

   // Show eager loading with query log
  showEagerLoading: async (limit: number = 10): Promise<QueryLogResult> => {
    const response = await api.get('/employees/eager-loading', { params: { limit } });
    return response;
  },

  // Get total employee count and dynamic dropdown options
  getEmployeeCount: async (): Promise<EmployeeCountResult> => {
    const response = await api.get('/employees/count');
    return response;
  },
};