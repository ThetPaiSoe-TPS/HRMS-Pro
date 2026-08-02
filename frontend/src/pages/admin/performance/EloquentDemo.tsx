import React, { useState } from "react";
import {
  CheckBadgeIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalculatorIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { RelationshipCard } from "../../../components/performance/RelationshipCard";
import { eloquentApi } from "../../../api/eloquentApi";

type TabType =
  | "all"
  | "whereHas"
  | "has"
  | "withCount"
  | "withExists"
  | "withSum"
  | "withAvg"
  | "load"
  | "loadMissing"
  | "append";

export const EloquentDemo: React.FC = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [filters, setFilters] = useState({
    has_payrolls: true,
    min_salary: 50000,
    has_leaves: false,
    has_attendance: false,
    payroll_count: 3,
    has_both: false,
    sort_by_count: "payrolls",
    sort_order: "desc",
    with: ["department", "position"],
  });

  const runDemo = async (name: string, apiCall: () => Promise<any>) => {
    setLoading((prev) => ({ ...prev, [name]: true }));
    try {
      const response = await apiCall();
      setResults((prev) => ({ ...prev, [name]: response }));
    } catch (error) {
      console.error(`Demo ${name} failed:`, error);
      setResults((prev) => ({
        ...prev,
        [name]: { error: "Failed to run demo" },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [name]: false }));
    }
  };

  const demos = [
    {
      id: "whereHas",
      title: "whereHas()",
      description: "Filter main records based on conditions in related tables.",
      codeExample: `Employee::whereHas('payrolls', function($q) {\n    $q->where('net_salary', '>', 50000);\n})->get();`,
      badge: "good" as const,
      run: () =>
        runDemo("whereHas", () =>
          eloquentApi.whereHas({
            has_payrolls: filters.has_payrolls,
            min_salary: filters.min_salary,
            has_leaves: filters.has_leaves,
            has_attendance: filters.has_attendance,
          }),
        ),
      controls: (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.has_payrolls}
              onChange={(e) =>
                setFilters({ ...filters, has_payrolls: e.target.checked })
              }
              className="h-4 w-4"
            />
            Has Payrolls
          </label>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Min Salary:</label>
            <input
              type="number"
              value={filters.min_salary}
              onChange={(e) =>
                setFilters({ ...filters, min_salary: Number(e.target.value) })
              }
              className="px-2 py-1 border border-gray-300 rounded text-sm w-24"
            />
          </div>
        </div>
      ),
    },
    {
      id: "has",
      title: "has()",
      description:
        'Simple existence check (faster than whereHas for just "exists").',
      codeExample: `Employee::has('payrolls', '>', 3)->get();`,
      badge: "good" as const,
      run: () =>
        runDemo("has", () =>
          eloquentApi.has({
            has_payrolls: filters.has_payrolls,
            payroll_count: filters.payroll_count,
            has_both: filters.has_both,
          }),
        ),
      controls: (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.has_payrolls}
              onChange={(e) =>
                setFilters({ ...filters, has_payrolls: e.target.checked })
              }
              className="h-4 w-4"
            />
            Has Payrolls
          </label>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Count &gt;:</label>
            <input
              type="number"
              value={filters.payroll_count}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  payroll_count: Number(e.target.value),
                })
              }
              className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
            />
          </div>
        </div>
      ),
    },
    {
      id: "withCount",
      title: "withCount()",
      description: "Adds a count of related records as an attribute.",
      codeExample: `Employee::withCount(['payrolls', 'leaves'])->get();`,
      badge: "good" as const,
      run: () =>
        runDemo("withCount", () =>
          eloquentApi.withCount({
            sort_by_count: filters.sort_by_count,
            sort_order: filters.sort_order,
          }),
        ),
      controls: (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort By:</label>
          <select
            value={filters.sort_by_count}
            onChange={(e) =>
              setFilters({ ...filters, sort_by_count: e.target.value })
            }
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="payrolls">Payrolls</option>
            <option value="leaves">Leaves</option>
            <option value="attendances">Attendances</option>
          </select>
          <select
            value={filters.sort_order}
            onChange={(e) =>
              setFilters({ ...filters, sort_order: e.target.value })
            }
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      ),
    },
    {
      id: "withExists",
      title: "withExists()",
      description: "Adds a boolean flag for existence of related records.",
      codeExample: `Employee::withExists(['payrolls', 'leaves'])->get();`,
      badge: "info" as const,
      run: () => runDemo("withExists", () => eloquentApi.withExists()),
    },
    {
      id: "withSum",
      title: "withSum()",
      description: "Adds a sum of related record values.",
      codeExample: `Employee::withSum('payrolls', 'net_salary')->get();`,
      badge: "good" as const,
      run: () => runDemo("withSum", () => eloquentApi.withSum()),
    },
    {
      id: "withAvg",
      title: "withAvg()",
      description: "Adds an average of related record values.",
      codeExample: `Employee::withAvg('payrolls', 'net_salary')->get();`,
      badge: "info" as const,
      run: () => runDemo("withAvg", () => eloquentApi.withAvg()),
    },
    {
      id: "load",
      title: "load()",
      description: "Loads relationships AFTER the main query has already run.",
      codeExample: `$employees = Employee::all();\n$employees->load('department');`,
      badge: "info" as const,
      run: () =>
        runDemo("load", () => eloquentApi.load({ with: filters.with })),
      controls: (
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={filters.with.includes("department")}
              onChange={(e) => {
                const newWith = e.target.checked
                  ? [...filters.with, "department"]
                  : filters.with.filter((w) => w !== "department");
                setFilters({ ...filters, with: newWith });
              }}
              className="h-4 w-4"
            />
            Department
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={filters.with.includes("position")}
              onChange={(e) => {
                const newWith = e.target.checked
                  ? [...filters.with, "position"]
                  : filters.with.filter((w) => w !== "position");
                setFilters({ ...filters, with: newWith });
              }}
              className="h-4 w-4"
            />
            Position
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={filters.with.includes("payrolls")}
              onChange={(e) => {
                const newWith = e.target.checked
                  ? [...filters.with, "payrolls"]
                  : filters.with.filter((w) => w !== "payrolls");
                setFilters({ ...filters, with: newWith });
              }}
              className="h-4 w-4"
            />
            Payrolls
          </label>
        </div>
      ),
    },
    {
      id: "loadMissing",
      title: "loadMissing()",
      description: "Loads relationships only if they haven't been loaded yet.",
      codeExample: `$employees = Employee::with('department')->get();\n$employees->loadMissing('position');`,
      badge: "info" as const,
      run: () => runDemo("loadMissing", () => eloquentApi.loadMissing()),
    },
    {
      id: "append",
      title: "append()",
      description: "Adds computed/derived attributes to your model.",
      codeExample: `$employee->append(['full_name', 'total_earnings']);`,
      badge: "good" as const,
      run: () => runDemo("append", () => eloquentApi.append()),
    },
  ];

  const filteredDemos =
    activeTab === "all" ? demos : demos.filter((d) => d.id === activeTab);

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "all", label: "All", icon: PlusIcon },
    { id: "whereHas", label: "whereHas", icon: PlusIcon },
    { id: "has", label: "has", icon: MinusIcon },
    { id: "withCount", label: "withCount", icon: ChartBarIcon },
    { id: "withExists", label: "withExists", icon: CheckBadgeIcon },
    { id: "withSum", label: "withSum", icon: CurrencyDollarIcon },
    { id: "withAvg", label: "withAvg", icon: CalculatorIcon },
    { id: "load", label: "load", icon: ArrowPathIcon },
    { id: "loadMissing", label: "loadMissing", icon: ArrowPathIcon },
    { id: "append", label: "append", icon: DocumentTextIcon },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-primary-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-900 flex items-center gap-2">
              {/* <DatabaseIcon className="h-6 w-6 text-primary-600" /> */}
              Eloquent Relationship Demo
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Showcase of with(), load(), whereHas(), has(), withCount(),
              withExists(), withSum(), withAvg(), append()
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {Object.keys(results).filter((k) => results[k]).length} demos run
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="overflow-x-auto px-4 py-2">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-primary-700 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Demos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDemos.map((demo) => (
          <RelationshipCard
            key={demo.id}
            title={demo.title}
            description={demo.description}
            codeExample={demo.codeExample}
            badge={demo.badge}
            onRun={demo.run}
            loading={loading[demo.id]}
            result={results[demo.id]}
          >
            {demo.controls && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {demo.controls}
              </div>
            )}
          </RelationshipCard>
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ChartBarIcon className="h-5 w-5 text-gray-400" />
          Summary of Methods
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Method
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Use Case
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  When to Use
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-mono text-xs text-primary-600">
                  with()
                </td>
                <td className="px-4 py-2 text-gray-600">
                  Eager load relationships
                </td>
                <td className="px-4 py-2 text-gray-500">Avoid N+1 queries</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs text-primary-600">
                  load()
                </td>
                <td className="px-4 py-2 text-gray-600">
                  Load after main query
                </td>
                <td className="px-4 py-2 text-gray-500">Dynamic loading</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs text-primary-600">
                  loadMissing()
                </td>
                <td className="px-4 py-2 text-gray-600">
                  Load only if not loaded
                </td>
                <td className="px-4 py-2 text-gray-500">
                  Avoid duplicate loads
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs text-primary-600">
                  whereHas()
                </td>
                <td className="px-4 py-2 text-gray-600">
                  Filter by related data
                </td>
                <td className="px-4 py-2 text-gray-500">Complex filtering</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs text-primary-600">
                  has()
                </td>
                <td className="px-4 py-2 text-gray-600">Check existence</td>
                <td className="px-4 py-2 text-gray-500">
                  Simple existence check
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs text-primary-600">
                  withCount()
                </td>
                <td className="px-4 py-2 text-gray-600">
                  Count related records
                </td>
                <td className="px-4 py-2 text-gray-500">Statistics</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs text-primary-600">
                  withExists()
                </td>
                <td className="px-4 py-2 text-gray-600">Existence flag</td>
                <td className="px-4 py-2 text-gray-500">Boolean checks</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs text-primary-600">
                  withSum()
                </td>
                <td className="px-4 py-2 text-gray-600">Sum related values</td>
                <td className="px-4 py-2 text-gray-500">Totals</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs text-primary-600">
                  withAvg()
                </td>
                <td className="px-4 py-2 text-gray-600">
                  Average related values
                </td>
                <td className="px-4 py-2 text-gray-500">Averages</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs text-primary-600">
                  append()
                </td>
                <td className="px-4 py-2 text-gray-600">Computed attributes</td>
                <td className="px-4 py-2 text-gray-500">Derived values</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EloquentDemo;
