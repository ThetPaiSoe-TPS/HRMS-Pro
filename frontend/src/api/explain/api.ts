import type { ExplainLog, ExplainResponse, ExplainStats } from "../../types/explain.types";
import api from "../axios";

export const explainApi = {
  /**
   * Analyze a query using EXPLAIN
   */
  analyze: async (queryType: string): Promise<ExplainResponse> => {
    const response = await api.post<ExplainResponse>('/explain/analyze', { query_type: queryType });
    return response;
  },

  /**
   * Get explain logs
   */
  getLogs: async (limit: number = 50): Promise<{ logs: ExplainLog[]; total: number }> => {
    const response = await api.get<{ logs: ExplainLog[]; total: number }>('/explain/logs', {
      params: { limit }
    });
    return response;
  },

  /**
   * Get explain statistics
   */
  getStats: async (): Promise<ExplainStats> => {
    const response = await api.get<ExplainStats>('/explain/stats');
    return response;
  },
};