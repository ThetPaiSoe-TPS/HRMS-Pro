import api from "./axios";

export interface RelationshipDemoResult {
  success: boolean;
  message: string;
  data: any;
}

export const eloquentApi = {
  // whereHas() - Filter by related data
  whereHas: async (params?: {
    has_payrolls?: boolean;
    min_salary?: number;
    has_leaves?: boolean;
    has_attendance?: boolean;
  }): Promise<RelationshipDemoResult> => {
    const response = await api.get("/employees/where-has", { params });
    return response;
  },

  // has() - Check existence
  has: async (params?: {
    has_payrolls?: boolean;
    payroll_count?: number;
    has_both?: boolean;
  }): Promise<RelationshipDemoResult> => {
    const response = await api.get("/employees/has", { params });
    return response;
  },

  // withCount() - Count related records
  withCount: async (params?: {
    sort_by_count?: string;
    sort_order?: string;
  }): Promise<RelationshipDemoResult> => {
    const response = await api.get("/employees/with-count", { params });
    return response;
  },

  // withExists() - Check existence
  withExists: async (): Promise<RelationshipDemoResult> => {
    const response = await api.get("/employees/with-exists");
    return response;
  },

  // withSum() - Sum related values
  withSum: async (): Promise<RelationshipDemoResult> => {
    const response = await api.get("/employees/with-sum");
    return response;
  },

  // withAvg() - Average related values
  withAvg: async (): Promise<RelationshipDemoResult> => {
    const response = await api.get("/employees/with-avg");
    return response;
  },

  // load() - Dynamic loading
  load: async (params?: {
    with?: string[];
  }): Promise<RelationshipDemoResult> => {
    const response = await api.get("/employees/load", { params });
    return response;
  },

  // loadMissing() - Load only missing
  loadMissing: async (): Promise<RelationshipDemoResult> => {
    const response = await api.get("/employees/load-missing");
    return response;
  },

  // append() - Computed attributes
  append: async (): Promise<RelationshipDemoResult> => {
    const response = await api.get("/employees/append");
    return response;
  },
};
