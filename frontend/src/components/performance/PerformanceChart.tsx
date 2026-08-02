import React from "react";

interface PerformanceChartProps {
  lazyQueries: number;
  eagerQueries: number;
  lazyTime: number;
  eagerTime: number;
  lazyLabel?: string;
  eagerLabel?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  lazyQueries,
  eagerQueries,
  lazyTime,
  eagerTime,
  lazyLabel = "Lazy Loading",
  eagerLabel = "Eager Loading",
}) => {
  const maxQueries = Math.max(lazyQueries, eagerQueries, 10);
  const maxTime = Math.max(lazyTime, eagerTime, 10);

  return (
    <div className="space-y-6">
      {/* Query Count Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Query Count Comparison
        </h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-red-600 font-medium">{lazyLabel}</span>
              <span className="text-red-600 font-medium">
                {lazyQueries} queries
              </span>
            </div>
            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-lg transition-all duration-1000 flex items-center px-3"
                style={{ width: `${(lazyQueries / maxQueries) * 100}%` }}
              >
                <span className="text-white text-xs font-medium">
                  {lazyQueries}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-green-600 font-medium">{eagerLabel}</span>
              <span className="text-green-600 font-medium">
                {eagerQueries} queries
              </span>
            </div>
            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-lg transition-all duration-1000 flex items-center px-3"
                style={{ width: `${(eagerQueries / maxQueries) * 100}%` }}
              >
                <span className="text-white text-xs font-medium">
                  {eagerQueries}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Execution Time Comparison
        </h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-red-600 font-medium">{lazyLabel}</span>
              <span className="text-red-600 font-medium">{lazyTime}ms</span>
            </div>
            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-lg transition-all duration-1000 flex items-center px-3"
                style={{
                  width: `${Math.min((lazyTime / maxTime) * 100, 100)}%`,
                }}
              >
                <span className="text-white text-xs font-medium">
                  {lazyTime}ms
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-green-600 font-medium">{eagerLabel}</span>
              <span className="text-green-600 font-medium">{eagerTime}ms</span>
            </div>
            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-lg transition-all duration-1000 flex items-center px-3"
                style={{
                  width: `${Math.min((eagerTime / maxTime) * 100, 100)}%`,
                }}
              >
                <span className="text-white text-xs font-medium">
                  {eagerTime}ms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Speedup Indicator */}
      <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary-700">
            Performance Improvement
          </span>
          <span className="text-2xl font-bold text-primary-600">
            {lazyTime > 0 ? (lazyTime / eagerTime).toFixed(1) : 0}x
          </span>
        </div>
        <div className="mt-2 w-full h-2 bg-primary-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((eagerTime / lazyTime) * 100, 100)}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-primary-600">
          Eager loading is{" "}
          {lazyTime > 0 ? (lazyTime / eagerTime).toFixed(1) : 0}x faster!
        </p>
      </div>
    </div>
  );
};
