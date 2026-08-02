import React, { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { PerformanceChart } from "../../../components/performance/PerformanceChart";
import { QueryLogViewer } from "../../../components/performance/QueryLogViewer";
import { performanceApi, type LoadingComparisonResult, type QueryLogResult, type EmployeeCountResult } from "../../../api/performanceApi";

type TabType = "comparison" | "lazy" | "eager" | "code";

export const LoadingDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("comparison");
  const [comparisonResult, setComparisonResult] =
    useState<LoadingComparisonResult | null>(null);
  const [lazyResult, setLazyResult] = useState<QueryLogResult | null>(null);
  const [eagerResult, setEagerResult] = useState<QueryLogResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [employeeCountInfo, setEmployeeCountInfo] = useState<EmployeeCountResult | null>(null);
  const [selectedLimit, setSelectedLimit] = useState(10);

  const fetchEmployeeCount = async () => {
    try {
      const result = await performanceApi.getEmployeeCount();
      setEmployeeCountInfo(result);
      if (result.dropdown_options.length > 0) {
        setSelectedLimit(result.dropdown_options[0]);
      }
    } catch (err: any) {
      console.error("Failed to fetch employee count:", err);
    }
  };

  useEffect(() => {
    fetchEmployeeCount();
  }, []);

  const dropdownOptions = employeeCountInfo?.dropdown_options || [5, 10];
  const totalEmployees = employeeCountInfo?.count || 0;

  const runComparison = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await performanceApi.compareLoading();
      setComparisonResult(response);
    } catch (err: any) {
      setError(err.response?.data?.message || "Test failed");
    } finally {
      setLoading(false);
    }
  };

  const runLazyDemo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await performanceApi.showLazyLoading(selectedLimit);
      setLazyResult(response);
    } catch (err: any) {
      setError(err.response?.data?.message || "Lazy loading demo failed");
    } finally {
      setLoading(false);
    }
  };

  const runEagerDemo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await performanceApi.showEagerLoading(selectedLimit);
      setEagerResult(response);
    } catch (err: any) {
      setError(err.response?.data?.message || "Eager loading demo failed");
    } finally {
      setLoading(false);
    }
  };

  const runAllDemos = async () => {
    await runComparison();
    await runLazyDemo();
    await runEagerDemo();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ChartBarIcon className="h-6 w-6 text-primary-600" />
            Lazy Loading vs Eager Loading
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Understand the N+1 problem and how eager loading solves it
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Employees:</label>
            <select
              value={selectedLimit}
              onChange={(e) => setSelectedLimit(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              {dropdownOptions.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {totalEmployees > 0 && (
              <span className="text-xs text-gray-500">
                (Total in DB: {totalEmployees})
              </span>
            )}
          </div>
          <button
            onClick={runAllDemos}
            disabled={loading}
            className="px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-secondary-900 hover:text-black transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
            Run All Tests
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("comparison")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "comparison"
                ? "border-primary-900 text-primary-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ChartBarIcon className="h-4 w-4 inline mr-1" />
            Comparison
          </button>
          <button
            onClick={() => setActiveTab("lazy")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "lazy"
                ? "border-primary-900 text-primary-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <XMarkIcon className="h-4 w-4 inline mr-1 text-red-500" />
            Lazy Loading (N+1)
          </button>
          <button
            onClick={() => setActiveTab("eager")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "eager"
                ? "border-primary-900 text-primary-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <CheckBadgeIcon className="h-4 w-4 inline mr-1 text-green-500" />
            Eager Loading
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "code"
                ? "border-primary-900 text-primary-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <CodeBracketIcon className="h-4 w-4 inline mr-1" />
            Code Examples
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "comparison" && (
          <div>
            {!comparisonResult ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  Run the test to see comparison
                </h3>
                <p className="text-sm text-gray-500">
                  Click "Run All Tests" to see lazy vs eager loading performance
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 rounded-xl border border-red-200 p-6">
                    <div className="flex items-center gap-2 text-red-600 mb-3">
                      <XMarkIcon className="h-6 w-6" />
                      <h3 className="font-semibold">Lazy Loading (N+1)</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-bold text-red-600">
                          {comparisonResult.comparison.lazy_loading.time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Queries:</span>
                        <span className="font-bold text-red-600">
                          {comparisonResult.comparison.lazy_loading.queries}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {comparisonResult.comparison.lazy_loading.description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                    <div className="flex items-center gap-2 text-green-600 mb-3">
                      <CheckBadgeIcon className="h-6 w-6" />
                      <h3 className="font-semibold">Eager Loading</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-bold text-green-600">
                          {comparisonResult.comparison.eager_loading.time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Queries:</span>
                        <span className="font-bold text-green-600">
                          {comparisonResult.comparison.eager_loading.queries}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {comparisonResult.comparison.eager_loading.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <PerformanceChart
                  lazyQueries={comparisonResult.comparison.lazy_loading.queries}
                  eagerQueries={
                    comparisonResult.comparison.eager_loading.queries
                  }
                  lazyTime={parseFloat(
                    comparisonResult.comparison.lazy_loading.time,
                  )}
                  eagerTime={parseFloat(
                    comparisonResult.comparison.eager_loading.time,
                  )}
                />

                {/* Result Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Speed Improvement</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {comparisonResult.comparison.improvement}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Queries Saved</p>
                      <p className="text-2xl font-bold text-green-600">
                        {comparisonResult.comparison.query_reduction}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Recommendation</p>
                      <p className="text-sm font-medium text-gray-900">
                        {comparisonResult.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "lazy" && (
          <div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">N+1 Problem</h4>
                  <p className="text-sm text-red-700">
                    Each employee triggers a separate query to load their
                    department. For {selectedLimit} employees, this creates{" "}
                    {selectedLimit + 1} total queries!
                  </p>
                </div>
              </div>
            </div>

            {!lazyResult ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <XMarkIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  Run lazy loading demo
                </h3>
                <button
                  onClick={runLazyDemo}
                  disabled={loading}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Show N+1 Problem
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Queries</p>
                      <p className="text-2xl font-bold text-red-600">
                        {lazyResult.total_queries}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Results</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {lazyResult.results?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {lazyResult.warning && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      {lazyResult.warning}
                    </p>
                    {lazyResult.fix && (
                      <p className="text-sm text-yellow-700 mt-1">
                        💡 {lazyResult.fix}
                      </p>
                    )}
                  </div>
                )}

                <QueryLogViewer
                  queries={lazyResult.queries || []}
                  title="Lazy Loading Queries"
                  totalQueries={lazyResult.total_queries}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "eager" && (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckBadgeIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800">Optimized!</h4>
                  <p className="text-sm text-green-700">
                    Using Eager Loading reduces queries from {selectedLimit + 1}{" "}
                    to just 2 queries! All department data is loaded in one go.
                  </p>
                </div>
              </div>
            </div>

            {!eagerResult ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <CheckBadgeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  Run eager loading demo
                </h3>
                <button
                  onClick={runEagerDemo}
                  disabled={loading}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Show Optimized Queries
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Queries</p>
                      <p className="text-2xl font-bold text-green-600">
                        {eagerResult.total_queries}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Results</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {eagerResult.results?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {eagerResult.success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      {eagerResult.success}
                    </p>
                  </div>
                )}

                <QueryLogViewer
                  queries={eagerResult.queries || []}
                  title="Eager Loading Queries"
                  totalQueries={eagerResult.total_queries}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "code" && (
          <div className="space-y-6">
            {/* Bad Example */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-semibold text-red-800 flex items-center gap-2 mb-3">
                <XMarkIcon className="h-5 w-5" />❌ Bad: Lazy Loading (N+1
                Problem)
              </h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`// ❌ LAZY LOADING - N+1 Problem
$employees = Employee::all();  // 1 query

foreach ($employees as $employee) {
    // ❌ Each iteration creates a NEW query!
    echo $employee->department->name;  // N queries
}

// Total queries: 1 + N
// For 100 employees: 101 queries! 😱`}</code>
              </pre>
              <p className="mt-3 text-sm text-red-700">
                ⚠️ This creates {selectedLimit} extra queries for{" "}
                {selectedLimit} employees!
              </p>
            </div>

            {/* Good Example */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-green-800 flex items-center gap-2 mb-3">
                <CheckBadgeIcon className="h-5 w-5" />✅ Good: Eager Loading
                (Optimized)
              </h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`// ✅ EAGER LOADING - Optimized
$employees = Employee::with('department')->get();  // 2 queries

foreach ($employees as $employee) {
    // ✅ Already loaded! No extra queries!
    echo $employee->department->name;
}

// Total queries: 2 only!
// For 100 employees: 2 queries! 🚀`}</code>
              </pre>
              <p className="mt-3 text-sm text-green-700">
                ✅ Only 2 queries total! {selectedLimit + 1 - 2} queries saved!
              </p>
            </div>

            {/* How to Detect N+1 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 flex items-center gap-2 mb-3">
                <DocumentTextIcon className="h-5 w-5" />
                🔍 How to Detect N+1
              </h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`// 1️⃣ Enable Query Log
DB::enableQueryLog();

// 2️⃣ Run your code
$employees = Employee::all();
foreach ($employees as $employee) {
    echo $employee->department->name;
}

// 3️⃣ Check total queries
$queries = DB::getQueryLog();
echo "Total queries: " . count($queries);

// 4️⃣ Install Laravel Debugbar
composer require barryvdh/laravel-debugbar --dev
// Check the "Database" tab`}</code>
              </pre>
            </div>

            {/* Performance Comparison */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-semibold text-purple-800 flex items-center gap-2 mb-3">
                <ChartBarIcon className="h-5 w-5" />
                📊 Performance Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-purple-100">
                      <th className="px-4 py-2 text-left text-purple-800">
                        Employees
                      </th>
                      <th className="px-4 py-2 text-left text-purple-800">
                        Lazy Loading (N+1)
                      </th>
                      <th className="px-4 py-2 text-left text-purple-800">
                        Eager Loading
                      </th>
                      <th className="px-4 py-2 text-left text-purple-800">
                        Saved Queries
                      </th>
                      <th className="px-4 py-2 text-left text-purple-800">
                        Speedup
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-200">
                    <tr>
                      <td className="px-4 py-2 font-medium">10</td>
                      <td className="px-4 py-2 text-red-600">11 queries</td>
                      <td className="px-4 py-2 text-green-600">2 queries</td>
                      <td className="px-4 py-2 text-blue-600">9 saved</td>
                      <td className="px-4 py-2 text-purple-600">5.5x faster</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">50</td>
                      <td className="px-4 py-2 text-red-600">51 queries</td>
                      <td className="px-4 py-2 text-green-600">2 queries</td>
                      <td className="px-4 py-2 text-blue-600">49 saved</td>
                      <td className="px-4 py-2 text-purple-600">25x faster</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">100</td>
                      <td className="px-4 py-2 text-red-600">101 queries</td>
                      <td className="px-4 py-2 text-green-600">2 queries</td>
                      <td className="px-4 py-2 text-blue-600">99 saved</td>
                      <td className="px-4 py-2 text-purple-600">50x faster</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingDemo;
