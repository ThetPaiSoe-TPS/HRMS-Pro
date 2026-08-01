import React, { useState, useEffect } from "react";
import {
  CheckBadgeIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ClockIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ShieldCheckIcon,
  ServerIcon,  PlayIcon,
  StopIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import api from "../../../api/axios";

interface Operation {
  query: string;
  status: string;
  id?: number;
}

interface TransactionResult {
  success: boolean;
  message: string;
  operations: Operation[];
  execution_time?: string;
  is_transactional: boolean;
  warning?: string;
  error?: string;
}

interface TransactionHistory {
  logs: any[];
  stats: {
    total: number;
    success: number;
    failed: number;
    rolled_back: number;
  };
}

export const TransactionDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [history, setHistory] = useState<TransactionHistory | null>(null);
  const [activeTab, setActiveTab] = useState<"demo" | "history">("demo");
  const [demoType, setDemoType] = useState<
    "success" | "failed" | "with" | "without"
  >("success");

  const runDemo = async (type: "success" | "failed" | "with" | "without") => {
    setLoading(true);
    setResult(null);

    try {
      let endpoint = "";
      switch (type) {
        case "success":
          endpoint = "/transactions/successful";
          break;
        case "failed":
          endpoint = "/transactions/failed";
          break;
        case "with":
          endpoint = "/transactions/with-transaction";
          break;
        case "without":
          endpoint = "/transactions/without-transaction";
          break;
      }

      const response = await api.get(endpoint);
      setResult(response);
    } catch (err: any) {
      console.error("Demo failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get("/transactions/history");
      setHistory(response);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "rolled_back":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "inconsistent":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckBadgeIcon className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XMarkIcon className="h-5 w-5 text-red-500" />;
      case "rolled_back":
        return <ArrowPathIcon className="h-5 w-5 text-yellow-500" />;
      case "inconsistent":
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const renderOperationLog = (operation: Operation, index: number) => {
    const statusColor =
      operation.status === "success"
        ? "text-green-600"
        : operation.status === "rolled_back"
          ? "text-yellow-600"
          : operation.status === "inconsistent"
            ? "text-orange-600"
            : "text-gray-600";

    return (
      <div
        key={index}
        className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
      >
        <div className="mt-1">
          {operation.status === "success" && (
            <CheckBadgeIcon className="h-4 w-4 text-green-500" />
          )}
          {operation.status === "rolled_back" && (
            <ArrowPathIcon className="h-4 w-4 text-yellow-500" />
          )}
          {operation.status === "inconsistent" && (
            <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />
          )}
          {operation.status === "running" && (
            <ClockIcon className="h-4 w-4 text-blue-500 animate-pulse" />
          )}
          {operation.status === "failed" && (
            <XMarkIcon className="h-4 w-4 text-red-500" />
          )}
        </div>
        <div className="flex-1">
          <code className="text-sm font-mono text-gray-700">
            {operation.query}
          </code>
          {operation.id && (
            <span className="ml-2 text-xs text-gray-500">
              (ID: {operation.id})
            </span>
          )}
        </div>
        <div className={`text-sm font-medium ${statusColor}`}>
          {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
        </div>
      </div>
    );
  };

  const renderDemo = () => {
    if (!result) {
      return (
        <div className="text-center py-12">
          {/* <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" /> */}
          <h3 className="text-lg font-medium text-gray-900">
            Transaction Demo
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Select a demo type and click "Run Demo" to see how transactions work
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Result Summary */}
        <div
          className={`rounded-xl border p-4 ${
            result.success
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckBadgeIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            ) : result.is_transactional ? (
              <ArrowPathIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            ) : (
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-semibold text-gray-900">{result.message}</h4>
              {result.execution_time && (
                <p className="text-sm text-gray-600 mt-0.5">
                  ⏱️ {result.execution_time}
                </p>
              )}
              {result.warning && (
                <p className="text-sm text-orange-600 mt-1">{result.warning}</p>
              )}
              {result.error && (
                <p className="text-sm text-red-600 mt-1">
                  Error: {result.error}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Type Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
              result.is_transactional
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-orange-100 text-orange-800 border border-orange-200"
            }`}
          >
            {result.is_transactional ? (
              <ShieldCheckIcon className="h-4 w-4" />
            ) : (
              <ExclamationTriangleIcon className="h-4 w-4" />
            )}
            {result.is_transactional
              ? "With Transaction (ACID)"
              : "No Transaction"}
          </span>
          <span className="text-xs text-gray-500">
            {result.is_transactional
              ? "✅ Data integrity guaranteed"
              : "⚠️ Risk of partial updates"}
          </span>
        </div>

        {/* Operations Log */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <DocumentTextIcon className="h-4 w-4 text-gray-400" />
              Operations Log
            </h4>
            <span className="text-xs text-gray-500">
              {result.operations.length} operations
            </span>
          </div>
          <div className="p-4">
            {result.operations.map((op, idx) => renderOperationLog(op, idx))}
          </div>
        </div>

        {/* Visual Diagram */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TableCellsIcon className="h-4 w-4 text-gray-400" />
            Transaction Flow
          </h4>
          <div className="space-y-2">
            {result.operations.map((op, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gray-200 text-gray-600">
                  {idx + 1}
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      op.status === "success"
                        ? "bg-green-500 w-full"
                        : op.status === "failed"
                          ? "bg-red-500 w-1/2"
                          : op.status === "rolled_back"
                            ? "bg-yellow-500 w-full"
                            : op.status === "inconsistent"
                              ? "bg-orange-500 w-1/2"
                              : "bg-blue-500 w-3/4 animate-pulse"
                    }`}
                  />
                </div>
                <span className="text-xs text-gray-500 w-20 text-right">
                  {op.status}
                </span>
              </div>
            ))}
            {/* Final Status */}
            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-300">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary-100 text-primary-700">
                ✓
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    result.success ? "bg-green-500 w-full" : "bg-red-500 w-full"
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  result.success ? "text-green-600" : "text-red-600"
                } w-20 text-right`}
              >
                {result.success ? "COMMIT" : "ROLLBACK"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    if (!history) {
      return (
        <div className="text-center py-12">
          <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No transaction history
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Run some demos to see history here.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {history.stats.total}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500">✅ Success</p>
            <p className="text-2xl font-bold text-green-600">
              {history.stats.success}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500">❌ Failed</p>
            <p className="text-2xl font-bold text-red-600">
              {history.stats.failed}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500">🔄 Rolled Back</p>
            <p className="text-2xl font-bold text-yellow-600">
              {history.stats.rolled_back}
            </p>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Transaction
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Operations
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    When
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-500">
                      #{log.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {log.name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}
                      >
                        {getStatusIcon(log.status)}
                        {log.status.charAt(0).toUpperCase() +
                          log.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.operations?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.execution_time}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {log.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
            Database Transaction Demo
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Visualize how database transactions ensure data integrity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {result ? "Demo Run" : "Ready"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab("demo")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "demo"
                ? "border-primary-900 text-primary-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <PlayIcon className="h-4 w-4" />
            Demo
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "history"
                ? "border-primary-900 text-primary-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ClockIcon className="h-4 w-4" />
            History
          </button>
        </nav>
      </div>

      {activeTab === "demo" && (
        <>
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Demo Type
                </label>
                <select
                  value={demoType}
                  onChange={(e) => setDemoType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="success">✅ Successful Transaction</option>
                  <option value="failed">
                    ❌ Failed Transaction (Rollback)
                  </option>
                  <option value="with">
                    🔄 With Transaction (Rollback Demo)
                  </option>
                  <option value="without">
                    ⚠️ Without Transaction (Data Inconsistency)
                  </option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => runDemo(demoType)}
                  disabled={loading}
                  className="px-6 py-2 bg-primary-900 text-white rounded-lg hover:bg-secondary-900 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <PlayIcon className="h-5 w-5" />
                  )}
                  Run Demo
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Success</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600">Failed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-600">Rolled Back</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-gray-600">In Progress</span>
              </div>
            </div>
          </div>

          {/* Results */}
          {renderDemo()}
        </>
      )}

      {activeTab === "history" && renderHistory()}
    </div>
  );
};

export default TransactionDemo;
