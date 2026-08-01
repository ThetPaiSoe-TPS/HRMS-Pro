import React, { useState } from "react";
import {
  CheckBadgeIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import api from "../../../api/axios";

interface IndexingResult {
  search_params: {
    category: string;
    brand: string;
    min_price: number;
    max_price: number;
  };
  performance: {
    single_column: {
      with_index: { time: string; results: number; explain: any };
      without_index: { time: string; results: number; explain: any };
      improvement: number;
    };
    composite_index: {
      with_index: { time: string; results: number; explain: any };
      without_index: { time: string; results: number; explain: any };
      improvement: number;
    };
    price_index: {
      with_index: { time: string; results: number; explain: any };
      without_index: { time: string; results: number; explain: any };
      improvement: number;
    };
    multi_index: {
      with_index: { time: string; results: number };
      without_index: { time: string; results: number };
      improvement: number;
    };
    order_index: {
      with_index: { time: string; results: number };
      without_index: { time: string; results: number };
      improvement: number;
    };
  };
  analysis: {
    average_improvement: string;
    best_performance: { test: string; improvement: number };
    summary: string;
  };
  index_information: {
    total_indexes: number;
    indexes: Record<
      string,
      { columns: string[]; type: string; unique: boolean }
    >;
  };
  recommendations: { test: string; recommendation: string }[];
}

export const IndexingDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IndexingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState({
    category: "Electronics",
    brand: "Apple",
    min_price: 100,
    max_price: 500,
  });

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/indexing/compare", {
        params: {
          category: params.category,
          brand: params.brand,
          min_price: params.min_price,
          max_price: params.max_price,
        },
      });
      setResults(response);
    } catch (err: any) {
      setError(err.response?.data?.message || "Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  const renderPerformanceCard = (
    title: string,
    data: any,
    icon: React.ReactNode,
  ) => {
    if (!data) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h4 className="font-semibold text-gray-900">{title}</h4>
          {data.improvement && data.improvement > 5 && (
            <span className="ml-auto text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
              {data.improvement}x faster
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* With Index */}
          <div className="border border-green-200 rounded-lg p-3 bg-green-50">
            <div className="flex items-center gap-1 text-xs text-green-700 font-medium mb-1">
              <CheckBadgeIcon className="h-3 w-3" />
              With Index
            </div>
            <div className="text-sm font-medium text-gray-900">
              {data.with_index?.time || "N/A"}
            </div>
            <div className="text-xs text-gray-500">
              {data.with_index?.results || 0} results
            </div>
            {data.with_index?.explain?.key && (
              <div className="mt-1 text-xs text-green-600">
                Key: {data.with_index.explain.key}
              </div>
            )}
          </div>

          {/* Without Index */}
          <div className="border border-red-200 rounded-lg p-3 bg-red-50">
            <div className="flex items-center gap-1 text-xs text-red-700 font-medium mb-1">
              <XMarkIcon className="h-3 w-3" />
              Without Index
            </div>
            <div className="text-sm font-medium text-gray-900">
              {data.without_index?.time || "N/A"}
            </div>
            <div className="text-xs text-gray-500">
              {data.without_index?.results || 0} results
            </div>
            {data.without_index?.explain?.type && (
              <div className="mt-1 text-xs text-red-600">
                Type: {data.without_index.explain.type}
              </div>
            )}
          </div>
        </div>

        {data.improvement && (
          <div className="mt-2 text-center text-sm font-medium">
            <span
              className={
                data.improvement > 5 ? "text-green-600" : "text-yellow-600"
              }
            >
              {data.improvement}x faster with indexing
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {/* <DatabaseIcon className="h-6 w-6 text-primary-600" /> */}
            Database Indexing Performance
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Compare query performance with and without database indexes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {results
              ? `${results.performance.single_column.with_index.results} results`
              : "Ready"}
          </span>
        </div>
      </div>

      {/* Search Parameters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={params.category}
              onChange={(e) =>
                setParams({ ...params, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Food">Food</option>
              <option value="Toys">Toys</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <select
              value={params.brand}
              onChange={(e) => setParams({ ...params, brand: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
              <option value="Sony">Sony</option>
              <option value="Nike">Nike</option>
              <option value="Adidas">Adidas</option>
              <option value="Microsoft">Microsoft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              value={params.min_price}
              onChange={(e) =>
                setParams({ ...params, min_price: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              value={params.max_price}
              onChange={(e) =>
                setParams({ ...params, max_price: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-primary-900 text-white rounded-lg hover:bg-secondary-900 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <ChartBarIcon className="h-5 w-5" />
            )}
            Run Performance Test
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary */}
          <div
            className={`rounded-xl p-4 border ${
              parseFloat(results.analysis.average_improvement) > 10
                ? "bg-green-50 border-green-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {parseFloat(results.analysis.average_improvement) > 10 ? (
                <CheckBadgeIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {results.analysis.summary}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Average speedup:{" "}
                  <strong>{results.analysis.average_improvement}</strong>
                  {results.analysis.best_performance && (
                    <span className="ml-2">
                      Best: {results.analysis.best_performance.test} (
                      {results.analysis.best_performance.improvement}x faster)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderPerformanceCard(
              "Single Column Index",
              results.performance.single_column,
              <TableCellsIcon className="h-5 w-5 text-blue-500" />,
            )}
            {renderPerformanceCard(
              "Composite Index",
              results.performance.composite_index,
              <Cog6ToothIcon className="h-5 w-5 text-purple-500" />,
            )}
            {renderPerformanceCard(
              "Price Range Index",
              results.performance.price_index,
              <ChartBarIcon className="h-5 w-5 text-green-500" />,
            )}
            {renderPerformanceCard(
              "Multiple Filters",
              results.performance.multi_index,
            //   <DatabaseIcon className="h-5 w-5 text-indigo-500" />,
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckBadgeIcon className="h-4 w-4 text-primary-600" />
              Recommendations
            </h4>
            <div className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-700 border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                >
                  <span className="font-medium">{rec.test}:</span>{" "}
                  {rec.recommendation}
                </div>
              ))}
            </div>
          </div>

          {/* Index Information */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DocumentTextIcon className="h-4 w-4 text-gray-400" />
              Index Information ({results.index_information.total_indexes}{" "}
              indexes)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(results.index_information.indexes).map(
                ([name, info]) => (
                  <div
                    key={name}
                    className="bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary-600">
                        {name}
                      </span>
                      {info.unique && (
                        <span className="text-xs text-blue-600">(UNIQUE)</span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Columns: {info.columns.join(", ")}
                    </div>
                    <div className="text-xs text-gray-400">
                      Type: {info.type}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexingDemo;
