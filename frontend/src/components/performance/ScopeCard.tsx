import React,{ type ReactNode }  from "react";
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  XMarkIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

interface ScopeCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  badge?: "active" | "inactive" | "info";
  onRun: () => void;
  loading?: boolean;
  result?: any;
  children?: ReactNode;
  isGlobal?: boolean;
}

export const ScopeCard: React.FC<ScopeCardProps> = ({
  title,
  description,
  icon,
  badge,
  onRun,
  loading = false,
  result,
  children,
  isGlobal = false,
}) => {
  const badgeColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    inactive: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const badgeLabels = {
    active: "Active",
    inactive: "Inactive",
    info: "Info",
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border p-4 ${isGlobal ? "border-primary-200 bg-primary-50/30" : "border-gray-100"}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-50">{icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              {badge && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeColors[badge]}`}
                >
                  {badge === "active" && (
                    <CheckBadgeIcon className="h-3 w-3 mr-0.5" />
                  )}
                  {badge === "inactive" && (
                    <XMarkIcon className="h-3 w-3 mr-0.5" />
                  )}
                  {badgeLabels[badge]}
                </span>
              )}
              {isGlobal && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  🌍 Global
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <button
          onClick={onRun}
          disabled={loading}
          className="px-3 py-1.5 text-sm bg-primary-700 text-white rounded-lg hover:bg-secondary-900 hover:text-black transition-colors disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
        >
          {loading ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
          Run
        </button>
      </div>

      {/* Content */}
      {children && <div className="mt-3">{children}</div>}

      {/* Result */}
      {result && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Result
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {result.meta?.scope_name || "Completed"}
            </span>
            <span className="text-sm font-medium text-primary-600">
              {result.data?.length || 0} records
            </span>
          </div>
          {result.meta?.query && (
            <p className="text-xs text-gray-400 font-mono mt-1 truncate">
              {result.meta.query}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
