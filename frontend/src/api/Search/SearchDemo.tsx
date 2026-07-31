import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  ClockIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import api from "../axios";

interface PerformanceResult {
  search_term: string;
  performance: {
    employees: {
      like_query: {
        time: string;
        results_count: number;
        sample_results: any[];
      };
      fulltext_query: {
        time: string;
        results_count: number;
        sample_results: any[];
        relevance?: number;
      };
      improvement_factor: number;
    };
    demo_records?: {
      like_query: {
        time: string;
        results_count: number;
      };
      fulltext_query: {
        time: string;
        results_count: number;
      };
      improvement_factor: number;
    };
  };
  analysis: {
    summary: string;
    details: any;
    recommendation: string;
  };
  demo_data_available?: boolean;
  index_info?: any;
}

export const SearchDemo: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PerformanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "performance" | "advanced" | "global"
  >("performance");

  const handleSearch = async () => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      setError("Please enter at least 2 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/search/performance", {
        params: { query: searchTerm.trim() },
      });
      setResults(response);
    } catch (err: any) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const renderPerformanceComparison = () => {
    if (!results) {
      return (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            Search Performance Demo
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Enter a search term above to compare the performance of
            <span className="font-medium"> LIKE queries</span> vs
            <span className="font-medium text-primary-900">
              {" "}
              Full-Text Search
            </span>
          </p>
        </div>
      );
    }

    // Extract data from the correct structure
    const { performance, analysis } = results;

    // Get employee performance data
    const employeePerformance = performance.employees;
    const likeQuery = employeePerformance.like_query;
    const fulltextQuery = employeePerformance.fulltext_query;
    const improvementFactor = employeePerformance.improvement_factor || 0;

    return (
      <div className="space-y-6">
        {/* Summary Card */}
        <div
          className={`rounded-xl p-4 border ${
            improvementFactor > 3
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {improvementFactor > 3 ? (
              <CheckBadgeIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium text-gray-900">
                {analysis?.summary || "Search performance analysis"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {analysis?.recommendation ||
                  "Full-text search is recommended for better performance"}
              </p>
            </div>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* LIKE Query */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-red-600">
              <XMarkIcon className="h-5 w-5" />
              <h4 className="font-semibold">LIKE Query</h4>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time:</span>
                <span className="font-medium text-red-600">
                  {likeQuery?.time || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Results:</span>
                <span className="font-medium">
                  {likeQuery?.results_count || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Method:</span>
                <span className="text-sm text-gray-600">Table scan</span>
              </div>
            </div>
          </div>

          {/* Full-Text Query */}
          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-4 relative">
            <div className="absolute -top-2 -right-2 bg-primary-900 text-white text-xs px-2 py-0.5 rounded-full">
              RECOMMENDED
            </div>
            <div className="flex items-center gap-2 text-primary-900">
              <CheckBadgeIcon className="h-5 w-5" />
              <h4 className="font-semibold">Full-Text Search</h4>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time:</span>
                <span className="font-medium text-green-600">
                  {fulltextQuery?.time || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Results:</span>
                <span className="font-medium">
                  {fulltextQuery?.results_count || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Method:</span>
                <span className="text-sm text-primary-900">Inverted Index</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Speedup:</span>
                <span className="font-bold text-green-600">
                  {improvementFactor}x faster
                </span>
              </div>
            </div>
          </div>

          {/* Natural Language - Using Demo Records if available */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-purple-600">
              <ChartBarIcon className="h-5 w-5" />
              <h4 className="font-semibold">Natural Language</h4>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time:</span>
                <span className="font-medium text-purple-600">
                  {performance.demo_records?.fulltext_query?.time || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Results:</span>
                <span className="font-medium">
                  {performance.demo_records?.fulltext_query?.results_count || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Method:</span>
                <span className="text-sm text-purple-600">
                  Relevance scoring
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <XMarkIcon className="h-4 w-4 text-red-500" />
              LIKE Query Results (First 3)
            </h4>
            {!likeQuery?.sample_results ||
            likeQuery.sample_results.length === 0 ? (
              <p className="text-sm text-gray-500">No results found</p>
            ) : (
              likeQuery.sample_results.map((item: any, index: number) => (
                <div
                  key={index}
                  className="py-2 border-b border-gray-100 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {item.name || item.title || "Record"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.email || item.content || ""}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckBadgeIcon className="h-4 w-4 text-primary-900" />
              Full-Text Results (First 3)
            </h4>
            {!fulltextQuery?.sample_results ||
            fulltextQuery.sample_results.length === 0 ? (
              <p className="text-sm text-gray-500">No results found</p>
            ) : (
              fulltextQuery.sample_results.map((item: any, index: number) => (
                <div
                  key={index}
                  className="py-2 border-b border-gray-100 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {item.name || item.title || "Record"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.email || item.content || ""}
                  </p>
                  {item.relevance && (
                    <p className="text-xs text-primary-900 mt-0.5">
                      Relevance: {(item.relevance * 100).toFixed(2)}%
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Index Information */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <DocumentTextIcon className="h-4 w-4 text-gray-400" />
            Index Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full-Text Indexes
              </h5>
              <div className="mt-2 space-y-1">
                <div className="text-sm text-gray-700">
                  • employees (name, employee_code, email)
                </div>
                <div className="text-sm text-gray-700">
                  • search_demo_records (title, content)
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Benefits
              </h5>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckBadgeIcon className="h-4 w-4 text-green-500" />
                  <span>Faster than LIKE on large datasets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckBadgeIcon className="h-4 w-4 text-green-500" />
                  <span>Relevance scoring available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckBadgeIcon className="h-4 w-4 text-green-500" />
                  <span>Boolean operators supported (+, -)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MagnifyingGlassIcon className="h-6 w-6 text-primary-900" />
            Search Performance Demo
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Compare the performance of LIKE queries vs Full-Text Search
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {results
              ? `${results.performance?.employees?.fulltext_query?.results_count || 0} results`
              : "Ready"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab("performance")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "performance"
                ? "border-primary-600 text-primary-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Performance Comparison
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "global"
                ? "border-primary-600 text-primary-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Global Search
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "advanced"
                ? "border-primary-600 text-primary-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Advanced Search
          </button>
        </nav>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter search term (e.g., 'Laravel optimization' or 'performance') or employee name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-primary-900 rounded-lg text-white hover:bg-secondary-900 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5" />
            )}
            Search
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <p className="mt-1 text-xs text-gray-500">
          <strong>Pro tip:</strong> Try searching for terms like "Laravel",
          "database", "index", or "performance"
        </p>
      </div>

      {/* Content */}
      {activeTab === "performance" && renderPerformanceComparison()}

      {activeTab === "global" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Global Search</h3>
            <p className="mt-2 text-sm text-gray-500">
              Search across employees, announcements, and demo records
            </p>
            <p className="mt-4 text-xs text-gray-400">
              <span className="font-medium">Tip:</span> Use + for required, -
              for excluded terms
              <br />
              Example:{" "}
              <span className="bg-gray-100 px-2 py-0.5 rounded">
                +laravel +database -elastic
              </span>
            </p>
          </div>
        </div>
      )}

      {activeTab === "advanced" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              Advanced Search
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Filter by category, relevance scoring, and limit results
            </p>
            <p className="mt-4 text-xs text-gray-400">
              <span className="font-medium">Available categories:</span>{" "}
              Laravel, Database, Search, Performance, Optimization
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDemo;
