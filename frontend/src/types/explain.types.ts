export interface ExplainRow {
  id: number;
  select_type: string;
  table: string;
  type: string;
  possible_keys: string;
  key: string;
  key_len: string;
  ref: string;
  rows: number;
  extra: string;
  is_using_index: boolean;
  is_using_where: boolean;
  is_using_temporary: boolean;
  is_using_filesort: boolean;
}

export interface ExplainSummary {
  total_tables: number;
  total_rows_scanned: number;
  using_index_count: number;
  using_where_count: number;
  using_temporary_count: number;
  using_filesort_count: number;
  full_table_scan_count: number;
  type_distribution: Record<string, number>;
  is_optimized: boolean;
  performance_rating: "excellent" | "good" | "fair" | "poor";
}

export interface ExplainRecommendation {
  table: string;
  issue: string;
  suggestion: string;
  severity: "high" | "medium" | "low";
}

export interface ExplainResponse {
  query_type: string;
  explain: ExplainRow[];
  summary: ExplainSummary;
  recommendations: ExplainRecommendation[];
  last_query: string;
  execution_time: number | null;
  row_count: number | null;
}

export interface ExplainLog {
  id: number;
  query: string;
  explain_result: ExplainRow[];
  execution_time: number;
  row_count: number;
  user_id: string | null;
  route: string | null;
  created_at: string;
}

export interface ExplainStats {
  total_explain_logs: number;
  average_execution_time: number | null;
  max_execution_time: number | null;
  min_execution_time: number | null;
  avg_row_count: number | null;
  recent_slow_queries: Array<{
    id: number;
    query: string;
    execution_time: number;
    row_count: number;
    created_at: string;
  }>;
}
