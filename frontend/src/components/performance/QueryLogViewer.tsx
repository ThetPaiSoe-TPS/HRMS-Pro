import React, { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface QueryLogViewerProps {
  queries: any[];
  title?: string;
  totalQueries?: number;
}

export const QueryLogViewer: React.FC<QueryLogViewerProps> = ({
  queries,
  title = "Query Log",
  totalQueries,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!queries || queries.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No queries to display
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <span className="text-sm font-medium text-gray-300">{title}</span>
          {totalQueries !== undefined && (
            <span className="ml-2 text-xs text-gray-500">
              ({totalQueries} queries)
            </span>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-200">
          {expanded ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Query List */}
      {expanded && (
        <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
          {queries.map((query, index) => (
            <div key={index} className="px-4 py-3 hover:bg-gray-800/50">
              <div className="flex items-start gap-3">
                <span className="text-xs text-gray-500 font-mono min-w-[30px]">
                  #{index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-all">
                    {query.query || query.sql || JSON.stringify(query)}
                  </pre>
                  {query.time && (
                    <span className="text-xs text-gray-500 mt-1 block">
                      ⏱️ {query.time}ms
                    </span>
                  )}
                  {query.bindings && query.bindings.length > 0 && (
                    <div className="mt-1 text-xs text-gray-600">
                      Bindings: {JSON.stringify(query.bindings)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {expanded && (
        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
          <span className="text-xs text-gray-500">
            Total: {queries.length} queries executed
          </span>
        </div>
      )}
    </div>
  );
};
