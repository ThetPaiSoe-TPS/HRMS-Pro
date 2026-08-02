import React,{ type ReactNode }  from "react";
import {
  CheckBadgeIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface RelationshipCardProps {
  title: string;
  description: string;
  codeExample: string;
  children: ReactNode;
  onRun: () => void;
  loading?: boolean;
  result?: any;
  badge?: "good" | "bad" | "info";
}

export const RelationshipCard: React.FC<RelationshipCardProps> = ({
  title,
  description,
  codeExample,
  children,
  onRun,
  loading = false,
  result,
  badge,
}) => {
  const badgeColors = {
    good: "bg-green-100 text-green-800",
    bad: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  const badgeIcons = {
    good: <CheckBadgeIcon className="h-4 w-4" />,
    bad: <XMarkIcon className="h-4 w-4" />,
    info: <ArrowPathIcon className="h-4 w-4" />,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {badge && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeColors[badge]}`}
            >
              {badgeIcons[badge]}
              {badge === "good" ? "Good" : badge === "bad" ? "Bad" : "Info"}
            </span>
          )}
        </div>
        <button
          onClick={onRun}
          disabled={loading}
          className="px-3 py-1.5 text-sm bg-primary-700 text-white rounded-lg hover:bg-secondary-900 hover:text-black transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          {loading ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
          ) : (
            "Run Demo"
          )}
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-600">{description}</p>

        <div className="bg-gray-900 rounded-lg p-3">
          <code className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
            {codeExample}
          </code>
        </div>

        {children}

        {result && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Result
            </p>
            <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
