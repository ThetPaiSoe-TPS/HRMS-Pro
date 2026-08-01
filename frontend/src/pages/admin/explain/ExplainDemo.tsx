import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CpuChipIcon,
  ClockIcon,
  TableCellsIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import type { ExplainResponse } from "../../../types/explain.types";
import { explainApi } from "../../../api/explain/api";

// Query type options
const queryTypes = [
  {
    value: "employee_search",
    label: "Employee Search (LIKE)",
    description: "Search employees by name or email using LIKE",
  },
  {
    value: "product_search",
    label: "Product Search (Basic)",
    description: "Basic product search by category and price",
  },
  {
    value: "product_with_index",
    label: "Product Search (With Index)",
    description: "Product search using indexes (optimized)",
  },
  {
    value: "product_no_index",
    label: "Product Search (No Index)",
    description: "Product search without indexes (unoptimized)",
  },
  {
    value: "complex_query",
    label: "Complex Query with Subqueries",
    description: "Advanced query with subqueries and joins",
  },
];

// Type color mapping
const typeColors: Record<string, string> = {
  ALL: "bg-red-100 text-red-800 border-red-200",
  index: "bg-yellow-100 text-yellow-800 border-yellow-200",
  range: "bg-blue-100 text-blue-800 border-blue-200",
  ref: "bg-green-100 text-green-800 border-green-200",
  eq_ref: "bg-emerald-100 text-emerald-800 border-emerald-200",
  const: "bg-emerald-100 text-emerald-800 border-emerald-200",
  system: "bg-emerald-100 text-emerald-800 border-emerald-200",
  NULL: "bg-gray-100 text-gray-800 border-gray-200",
};

const severityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-blue-100 text-blue-800 border-blue-200",
};

const performanceBadges: Record<
  string,
  { color: string; icon: any; label: string }
> = {
  excellent: {
    color: "bg-green-100 text-green-800",
    icon: CheckBadgeIcon,
    label: "Excellent",
  },
  good: {
    color: "bg-blue-100 text-blue-800",
    icon: CheckBadgeIcon,
    label: "Good",
  },
  fair: {
    color: "bg-yellow-100 text-yellow-800",
    icon: ExclamationTriangleIcon,
    label: "Fair",
  },
  poor: { color: "bg-red-100 text-red-800", icon: XMarkIcon, label: "Poor" },
};

export const ExplainDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [queryType, setQueryType] = useState("product_with_index");
  const [results, setResults] = useState<ExplainResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"analyze" | "logs" | "stats">(
    "analyze",
  );
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [expandedQueries, setExpandedQueries] = useState<number[]>([]);

  // Fetch stats and logs on mount
  useEffect(() => {
    if (activeTab === "stats") {
      fetchStats();
    }
    if (activeTab === "logs") {
      fetchLogs();
    }
  }, [activeTab]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await explainApi.analyze(queryType);
      setResults(response);
    } catch (err: any) {
      setError(err.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await explainApi.getLogs(20);
      setLogs(response.logs);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await explainApi.getStats();
      setStats(response);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const getTypeColor = (type: string) => {
    return typeColors[type] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getSeverityColor = (severity: string) => {
    return severityColors[severity] || "bg-gray-100 text-gray-800";
  };

  const toggleQueryExpand = (id: number) => {
    setExpandedQueries((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const formatTime = (ms: number) => {
    if (ms < 1) return "< 1ms";
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // ✅ Helper: Safely format execution time
  const formatExecutionTime = (
    time: number | string | null | undefined,
  ): string => {
    if (time === null || time === undefined) return "N/A";
    const num = typeof time === "string" ? parseFloat(time) : time;
    if (isNaN(num)) return "N/A";
    if (num < 1) return "< 1ms";
    if (num < 1000) return `${num.toFixed(2)}ms`;
    return `${(num / 1000).toFixed(2)}s`;
  };

  // ✅ Helper: Safely format number
  const formatNumber = (value: number | string | null | undefined): number => {
    if (value === null || value === undefined) return 0;
    return typeof value === "string" ? parseFloat(value) || 0 : value;
  };

  // ============================================
  // RENDER: Analyze Tab
  // ============================================
  const renderAnalyzeTab = () => (
    <div className="space-y-6">
      {/* Query Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Query to Analyze
            </label>
            <select
              value={queryType}
              onChange={(e) => setQueryType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              {queryTypes.map((qt) => (
                <option key={qt.value} value={qt.value}>
                  {qt.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {queryTypes.find((qt) => qt.value === queryType)?.description}
            </p>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-2 bg-primary-900 text-white rounded-lg hover:bg-secondary-900 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <MagnifyingGlassIcon className="h-5 w-5" />
              )}
              Analyze Query
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <TableCellsIcon className="h-4 w-4" />
                <p className="text-xs font-medium">Tables Analyzed</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {results.summary?.total_tables || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <ClockIcon className="h-4 w-4" />
                <p className="text-xs font-medium">Execution Time</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {results.execution_time
                  ? formatTime(results.execution_time * 1000)
                  : "N/A"}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <DocumentTextIcon className="h-4 w-4" />
                <p className="text-xs font-medium">Rows Scanned</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {results.summary?.total_rows_scanned || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <ChartBarIcon className="h-4 w-4" />
                <p className="text-xs font-medium">Performance</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {results.summary?.performance_rating &&
                  (() => {
                    const badge =
                      performanceBadges[results.summary.performance_rating];
                    if (!badge) return null;
                    const Icon = badge.icon;
                    return (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
                      >
                        <Icon className="h-4 w-4" />
                        {badge.label}
                      </span>
                    );
                  })()}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {results.recommendations && results.recommendations.length > 0 && (
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
              <h4 className="text-sm font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                Optimization Recommendations
              </h4>
              <div className="space-y-3">
                {results.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-yellow-100"
                  >
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(rec.severity)} flex-shrink-0 mt-0.5`}
                    >
                      {rec.severity.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Table: <span className="font-mono">{rec.table}</span>
                      </p>
                      <p className="text-sm text-gray-700 mt-0.5">
                        {rec.issue}
                      </p>
                      <p className="text-sm text-yellow-700 mt-0.5">
                        💡 {rec.suggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Query Preview */}
          {results.last_query && (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                Executed Query
              </h4>
              <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                {results.last_query}
              </pre>
            </div>
          )}

          {/* EXPLAIN Table */}
          {results.explain && results.explain.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">
                  EXPLAIN Output
                </h4>
                <span className="text-xs text-gray-500">
                  {results.explain.length} rows
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        id
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        select_type
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        table
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        type
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        possible_keys
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        key
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        rows
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        extra
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.explain.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {row.id}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600">
                          {row.select_type}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium text-gray-900">
                          {row.table}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(row.type)}`}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600">
                          {row.possible_keys || "-"}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`text-sm font-medium ${row.key ? "text-green-600" : "text-gray-400"}`}
                          >
                            {row.key || "-"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {row.rows}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600">
                          {row.extra && row.extra !== "N/A" ? (
                            <div className="flex flex-wrap gap-1">
                              {row.is_using_index && (
                                <span className="inline-flex px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700">
                                  Using index
                                </span>
                              )}
                              {row.is_using_where && (
                                <span className="inline-flex px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                                  Using where
                                </span>
                              )}
                              {row.is_using_temporary && (
                                <span className="inline-flex px-1.5 py-0.5 rounded text-xs bg-yellow-100 text-yellow-700">
                                  Using temporary
                                </span>
                              )}
                              {row.is_using_filesort && (
                                <span className="inline-flex px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-700">
                                  Using filesort
                                </span>
                              )}
                              {!row.is_using_index &&
                                !row.is_using_where &&
                                !row.is_using_temporary &&
                                !row.is_using_filesort &&
                                row.extra}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ============================================
  // RENDER: Logs Tab (✅ Fixed)
  // ============================================
  const renderLogsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Query Logs</h3>
        <button
          onClick={fetchLogs}
          className="text-sm text-primary-900 hover:text-primary-700 flex items-center gap-1"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No logs found</h3>
          <p className="text-sm text-gray-500">
            Run some queries to see EXPLAIN logs here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div
                className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleQueryExpand(log.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs text-gray-500">#{log.id}</span>
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {log.query.length > 100
                      ? log.query.substring(0, 100) + "..."
                      : log.query}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                  {/* ✅ FIX: Use safe formatter */}
                  <span>{formatExecutionTime(log.execution_time)}</span>
                  <span>{log.row_count || 0} rows</span>
                  <span>
                    {log.created_at
                      ? new Date(log.created_at).toLocaleString()
                      : "N/A"}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    {expandedQueries.includes(log.id) ? "▲" : "▼"}
                  </button>
                </div>
              </div>
              {expandedQueries.includes(log.id) && (
                <div className="p-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Query
                    </label>
                    <pre className="mt-1 text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                      {log.query}
                    </pre>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      EXPLAIN Result
                    </label>
                    <div className="mt-1 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">
                              table
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">
                              type
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">
                              key
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">
                              rows
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">
                              extra
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {log.explain_result?.map((row: any, idx: number) => (
                            <tr key={idx} className="border-b border-gray-100">
                              <td className="px-2 py-1 font-mono text-xs">
                                {row.table}
                              </td>
                              <td className="px-2 py-1">
                                <span
                                  className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${getTypeColor(row.type)}`}
                                >
                                  {row.type}
                                </span>
                              </td>
                              <td className="px-2 py-1 font-mono text-xs">
                                {row.key || "-"}
                              </td>
                              <td className="px-2 py-1 text-xs">{row.rows}</td>
                              <td className="px-2 py-1 text-xs text-gray-600">
                                {row.extra || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ============================================
  // RENDER: Stats Tab (✅ Fixed)
  // ============================================
  const renderStatsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        EXPLAIN Statistics
      </h3>

      {!stats ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            Loading statistics...
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we fetch the data.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Total Queries Analyzed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total_explain_logs || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Avg Execution Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {/* ✅ FIX: Use safe formatter */}
                {formatExecutionTime(stats.average_execution_time)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Avg Rows Scanned</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avg_row_count !== null &&
                stats.avg_row_count !== undefined
                  ? Math.round(formatNumber(stats.avg_row_count))
                  : "N/A"}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Slow Queries</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.recent_slow_queries?.length || 0}
              </p>
            </div>
          </div>

          {/* Slow Queries */}
          {stats.recent_slow_queries &&
            stats.recent_slow_queries.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-red-50 border-b border-red-200">
                  <h4 className="text-sm font-semibold text-red-800 flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    {`Slow Queries (>100ms)`}
                  </h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {stats.recent_slow_queries.map((query, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 truncate flex-1">
                          {query.query}
                        </span>
                        <span className="text-sm font-bold text-red-600 ml-4">
                          {/* ✅ FIX: Use safe formatter */}
                          {formatExecutionTime(query.execution_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{query.row_count} rows</span>
                        <span>
                          {new Date(query.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </>
      )}
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CpuChipIcon className="h-6 w-6 text-primary-900" />
            Query EXPLAIN Analyzer
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze and optimize database queries using MySQL EXPLAIN
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {results ? "Analyzed" : "Ready"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab("analyze")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "analyze"
                ? "border-primary-600 text-primary-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            Analyze
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "logs"
                ? "border-primary-600 text-primary-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ListBulletIcon className="h-4 w-4" />
            Logs
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "stats"
                ? "border-primary-600 text-primary-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ChartBarIcon className="h-4 w-4" />
            Statistics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "analyze" && renderAnalyzeTab()}
      {activeTab === "logs" && renderLogsTab()}
      {activeTab === "stats" && renderStatsTab()}
    </div>
  );
};

export default ExplainDemo;
