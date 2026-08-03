import React, { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  TrashIcon,
  PlayIcon,
  EyeIcon,
  TableCellsIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import api from "../../../api/axios";

interface CacheResult {
  data: any[];
  time: string;
  cached: boolean;
  count: number;
  source: string;
  table: string;
  columns?: string[];
}

interface CompareResult {
  iterations: number;
  without_cache: {
    average_time: string;
    total_time: string;
    sample_data: any[];
    data_source: string;
  };
  with_cache: {
    first_run: string;
    average_time: string;
    total_time: string;
    sample_data: any[];
    data_source: string;
  };
  improvement: {
    speedup: string;
    time_saved: string;
    percentage: string;
  };
  recommendation: string;
  data_info: {
    table: string;
    total_records: number;
    with_relations: string;
  };
}

interface CacheStats {
  total_queries: number;
  cache_hits: number;
  cache_misses: number;
  hit_rate: string;
  avg_without_cache: number;
  avg_with_cache: number;
  total_time_saved: number;
}

export const CacheDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [withCacheResult, setWithCacheResult] = useState<CacheResult | null>(
    null,
  );
  const [withoutCacheResult, setWithoutCacheResult] =
    useState<CacheResult | null>(null);
  const [departmentResult, setDepartmentResult] = useState<any>(null);
  const [payrollResult, setPayrollResult] = useState<any>(null);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(
    null,
  );
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [activeTab, setActiveTab] = useState<"compare" | "stats">("compare");
  const [iterations, setIterations] = useState(5);
  const [selectedDepartment, setSelectedDepartment] = useState(1);
  const [showData, setShowData] = useState(true);

  const runWithCache = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cache/with");
      setWithCacheResult(response);
    } catch (error) {
      console.error("With cache failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const runWithoutCache = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cache/without");
      setWithoutCacheResult(response);
    } catch (error) {
      console.error("Without cache failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const runDepartmentStats = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cache/department-stats", {
        params: { department_id: selectedDepartment },
      });
      setDepartmentResult(response);
    } catch (error) {
      console.error("Department stats failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const runPayrollSummary = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cache/payroll-summary");
      setPayrollResult(response);
    } catch (error) {
      console.error("Payroll summary failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const runCompare = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cache/compare", {
        params: { iterations },
      });
      setCompareResult(response);
    } catch (error) {
      console.error("Compare failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/cache/stats");
      setStats(response);
    } catch (error) {
      console.error("Stats failed:", error);
    }
  };

  const clearCache = async () => {
    if (!confirm("Clear all cache?")) return;
    try {
      await api.delete("/cache/clear-all");
      await fetchStats();
    } catch (error) {
      console.error("Clear cache failed:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const renderDataTable = (data: any[], columns: string[], title: string) => {
    if (!data || data.length === 0) return null;

    const displayColumns = columns || Object.keys(data[0] || {});

    return (
      <div className="mt-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          {title}
        </p>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {displayColumns.slice(0, 6).map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {col.replace("_", " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.slice(0, 5).map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {displayColumns.slice(0, 6).map((col) => (
                    <td key={col} className="px-3 py-2 text-sm text-gray-700">
                      {typeof row[col] === "object"
                        ? JSON.stringify(row[col]).substring(0, 30)
                        : String(row[col] || "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 5 && (
            <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200">
              Showing 5 of {data.length} records
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCompare = () => (
    <div className="space-y-6">
      {/* Data Source Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={runWithCache}
          className="bg-white rounded-xl shadow-sm border border-green-200 p-4 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">
                ✅ With Cache
              </p>
              <p className="text-xs text-gray-500">Employees + Departments</p>
            </div>
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <PlayIcon className="h-5 w-5 text-green-600" />
            )}
          </div>
          {withCacheResult && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-600">⏱️ {withCacheResult.time}</p>
              <p className="text-xs text-gray-600">
                📊 {withCacheResult.count} records
              </p>
              <p className="text-xs text-green-600">
                💾 {withCacheResult.source}
              </p>
              {showData &&
                withCacheResult.data &&
                renderDataTable(
                  withCacheResult.data,
                  withCacheResult.columns || ["id", "name", "email", "status"],
                  "Cached Data",
                )}
            </div>
          )}
        </button>

        <button
          onClick={runWithoutCache}
          className="bg-white rounded-xl shadow-sm border border-red-200 p-4 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">
                ❌ Without Cache
              </p>
              <p className="text-xs text-gray-500">Employees + Departments</p>
            </div>
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <PlayIcon className="h-5 w-5 text-red-600" />
            )}
          </div>
          {withoutCacheResult && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-600">
                ⏱️ {withoutCacheResult.time}
              </p>
              <p className="text-xs text-gray-600">
                📊 {withoutCacheResult.count} records
              </p>
              <p className="text-xs text-red-600">
                💾 {withoutCacheResult.source}
              </p>
              {showData &&
                withoutCacheResult.data &&
                renderDataTable(
                  withoutCacheResult.data,
                  withoutCacheResult.columns || [
                    "id",
                    "name",
                    "email",
                    "status",
                  ],
                  "Database Data",
                )}
            </div>
          )}
        </button>

        <button
          onClick={runPayrollSummary}
          className="bg-white rounded-xl shadow-sm border border-purple-200 p-4 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">
                💰 Payroll Summary
              </p>
              <p className="text-xs text-gray-500">Payrolls + Employees</p>
            </div>
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <PlayIcon className="h-5 w-5 text-purple-600" />
            )}
          </div>
{payrollResult && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-600">⏱️ {payrollResult.time}</p>
              <p className="text-xs text-green-600">
                💾 {payrollResult.source}
              </p>
              {showData && payrollResult.data && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600">
                    Total: {payrollResult.data.total_payrolls || 0}
                  </p>
                  <p className="text-xs text-gray-600">
                    Amount: $
                    {Number(payrollResult.data.total_amount || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Avg Salary: $
                    {Number(payrollResult.data.avg_salary || 0).toFixed(2)}
                  </p>

                  {/* Recent Payrolls Table */}
                  {payrollResult.data.recent_payrolls &&
                    payrollResult.data.recent_payrolls.length > 0 &&
                    renderDataTable(
                      payrollResult.data.recent_payrolls.map(
                        (p: any) => ({
                          employee: p.employee?.name || `#${p.employee_id}`,
                          payroll_month: p.payroll_month,
                          gross_salary: p.gross_salary,
                          net_salary: p.net_salary,
                          status: p.status,
                        }),
                      ),
                      payrollResult.recent_columns || [
                        "employee",
                        "payroll_month",
                        "gross_salary",
                        "net_salary",
                        "status",
                      ],
                      "Recent Payrolls",
                    )}

                  {/* Payrolls by Month Table */}
                  {payrollResult.data.by_month &&
                    payrollResult.data.by_month.length > 0 &&
                    renderDataTable(
                      payrollResult.data.by_month.map((m: any) => ({
                        month: m.month,
                        count: m.count,
                        total: m.total,
                      })),
                      payrollResult.month_columns || [
                        "month",
                        "count",
                        "total",
                      ],
                      "Payrolls by Month",
                    )}
                </div>
              )}
            </div>
          )}
        </button>
      </div>

      {/* Performance Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
            Performance Comparison
          </h3>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Iterations:</label>
            <select
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
            >
              {[3, 5, 10, 20].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <button
              onClick={runCompare}
              disabled={loading}
              className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-secondary-900 hover:text-black transition-colors disabled:opacity-50 text-sm flex items-center gap-2"
            >
              {loading ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
              Run Comparison
            </button>
          </div>
        </div>

        {compareResult && (
          <div className="space-y-4">
            {/* Data Info */}
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
              <p>
                📊 <strong>Table:</strong> {compareResult.data_info.table}
              </p>
              <p>
                📈 <strong>Total Records:</strong>{" "}
                {compareResult.data_info.total_records}
              </p>
              <p>
                🔗 <strong>Relations:</strong>{" "}
                {compareResult.data_info.with_relations}
              </p>
            </div>

            {/* Sample Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-red-200 rounded-lg p-3">
                <p className="text-xs font-medium text-red-600 mb-2">
                  ❌ Without Cache - Sample Data
                </p>
                {compareResult.without_cache.sample_data &&
                compareResult.without_cache.sample_data.length > 0 ? (
                  <div className="space-y-1">
                    {compareResult.without_cache.sample_data.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-gray-700 border-b border-gray-100 py-1"
                        >
                          {item.name} ({item.email})
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No sample data</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  ⏱️ {compareResult.without_cache.average_time}
                </p>
              </div>
              <div className="border border-green-200 rounded-lg p-3">
                <p className="text-xs font-medium text-green-600 mb-2">
                  ✅ With Cache - Sample Data
                </p>
                {compareResult.with_cache.sample_data &&
                compareResult.with_cache.sample_data.length > 0 ? (
                  <div className="space-y-1">
                    {compareResult.with_cache.sample_data.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-700 border-b border-gray-100 py-1"
                      >
                        {item.name} ({item.email})
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No sample data</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  ⏱️ {compareResult.with_cache.average_time}
                </p>
              </div>
            </div>

            {/* Performance Bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-500">Without Cache</p>
                <p className="text-2xl font-bold text-red-600">
                  {compareResult.without_cache.average_time}
                </p>
                <p className="text-xs text-gray-400">
                  Average of {compareResult.iterations} runs
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-500">With Cache</p>
                <p className="text-2xl font-bold text-green-600">
                  {compareResult.with_cache.average_time}
                </p>
                <p className="text-xs text-gray-400">
                  Average of {compareResult.iterations} runs
                </p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg text-center border border-primary-200">
                <p className="text-sm text-primary-600">Speed Improvement</p>
                <p className="text-2xl font-bold text-primary-700">
                  {compareResult.improvement.speedup}
                </p>
                <p className="text-xs text-primary-500">
                  Saved {compareResult.improvement.time_saved} per request
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(100 - parseFloat(compareResult.improvement.percentage), 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Without Cache</span>
              <span>{compareResult.improvement.percentage} faster</span>
              <span>With Cache</span>
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 {compareResult.recommendation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Cache Statistics</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-white text-sm hover:bg-secondary-900 hover:text-black transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4 inline" /> Refresh
          </button>
          <button
            onClick={clearCache}
            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
          >
            <TrashIcon className="h-4 w-4" />
            Clear All
          </button>
        </div>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500">Total Queries</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total_queries}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500">✅ Cache Hits</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.cache_hits}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500">❌ Cache Misses</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.cache_misses}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500">Hit Rate</p>
              <p className="text-2xl font-bold text-primary-600">
                {stats.hit_rate}
              </p>
            </div>
          </div>

          {stats.total_queries > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Performance Impact
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Avg Without Cache:</span>
                  <span className="font-medium text-red-600">
                    {stats.avg_without_cache.toFixed(2)}ms
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Avg With Cache:</span>
                  <span className="font-medium text-green-600">
                    {stats.avg_with_cache.toFixed(2)}ms
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Time Saved:</span>
                  <span className="font-medium text-primary-600">
                    {stats.total_time_saved.toFixed(2)}ms
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full transition-all duration-1000"
                    style={{
                      width: `${stats.total_queries > 0 ? Math.min((stats.cache_hits / stats.total_queries) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Cache Miss</span>
                  <span>{stats.hit_rate}</span>
                  <span>Cache Hit</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-primary-700 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-900 flex items-center gap-2">
              {/* <DatabaseIcon className="h-6 w-6 text-primary-600" /> */}
              Caching Performance Demo
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Compare query performance with and without caching using real data
              from {withCacheResult?.table || "employees"} table
            </p>
          </div>
          <button
            onClick={() => setShowData(!showData)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            {showData ? (
              <EyeIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
            {showData ? "Hide Data" : "Show Data"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("compare")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "compare"
                ? "border-b-2 border-primary-700 text-primary-700 bg-primary-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ChartBarIcon className="h-4 w-4" />
            Compare
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "stats"
                ? "border-b-2 border-primary-700 text-primary-700 bg-primary-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <DocumentTextIcon className="h-4 w-4" />
            Statistics
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "compare" && renderCompare()}
      {activeTab === "stats" && renderStats()}
    </div>
  );
};

export default CacheDemo;
