import React, { useState, useEffect } from 'react';
import {
  FunnelIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  XMarkIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  ChartBarIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { ScopeCard } from '../../../components/performance/ScopeCard';
import { scopeApi, type ScopeComparison, type ScopeResult } from '../../../api/scopeApi';

type TabType = 'local' | 'global' | 'compare';

export const ScopeDemo: React.FC = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, ScopeResult>>({});
  const [activeTab, setActiveTab] = useState<TabType>('local');
  const [globalEnabled, setGlobalEnabled] = useState(true);
  const [comparison, setComparison] = useState<ScopeComparison | null>(null);
  const [filterValues, setFilterValues] = useState({
    department: '',
    minSalary: '',
    maxSalary: '',
    search: '',
  });

  // Local scopes definitions
  const localScopes = [
    {
      id: 'active',
      title: 'Active Employees',
      description: 'Filter employees with status = active',
      icon: <CheckBadgeIcon className="h-5 w-5 text-green-600" />,
      badge: 'active' as const,
      run: () => runScope('active'),
    },
    {
      id: 'inactive',
      title: 'Inactive Employees',
      description: 'Filter employees with status = inactive',
      icon: <XMarkIcon className="h-5 w-5 text-red-600" />,
      badge: 'inactive' as const,
      run: () => runScope('inactive'),
    },
    {
      id: 'senior',
      title: 'Senior Employees',
      description: 'Employees with 5+ years of experience',
      icon: <ClockIcon className="h-5 w-5 text-blue-600" />,
      badge: 'info' as const,
      run: () => runScope('senior'),
    },
    {
      id: 'active-senior',
      title: 'Active Senior',
      description: 'Active employees with 5+ years experience',
      icon: <UserGroupIcon className="h-5 w-5 text-purple-600" />,
      badge: 'info' as const,
      run: () => runScope('active-senior'),
    },
    {
      id: 'hired-this-year',
      title: 'Hired This Year',
      description: 'Employees hired in current year',
      icon: <CalendarIcon className="h-5 w-5 text-yellow-600" />,
      badge: 'info' as const,
      run: () => runScope('hired-this-year'),
    },
    {
      id: 'high-salary',
      title: 'High Salary',
      description: 'Employees with salary > 50,000',
      icon: <CurrencyDollarIcon className="h-5 w-5 text-green-600" />,
      badge: 'info' as const,
      run: () => runScope('high-salary'),
    },
    {
      id: 'with-payrolls',
      title: 'With Payrolls',
      description: 'Employees who have payroll records',
      icon: <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />,
      badge: 'info' as const,
      run: () => runScope('with-payrolls'),
    },
    {
      id: 'without-payrolls',
      title: 'Without Payrolls',
      description: 'Employees without any payroll records',
      icon: <XMarkIcon className="h-5 w-5 text-orange-600" />,
      badge: 'info' as const,
      run: () => runScope('without-payrolls'),
    },
  ];

  const runScope = async (scopeId: string, params?: any) => {
    setLoading(prev => ({ ...prev, [scopeId]: true }));
    try {
      const result = await scopeApi.runLocalScope(scopeId, params);
      setResults(prev => ({ ...prev, [scopeId]: result }));
    } catch (error) {
      console.error(`Scope ${scopeId} failed:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [scopeId]: false }));
    }
  };

  const runAllScopes = async () => {
    for (const scope of localScopes) {
      await scope.run();
    }
  };

  const toggleGlobalScope = async () => {
    setLoading(prev => ({ ...prev, global: true }));
    try {
      const result = await scopeApi.toggleGlobalScope(!globalEnabled);
      setGlobalEnabled(!globalEnabled);
      setResults(prev => ({ ...prev, global: result }));
    } catch (error) {
      console.error('Toggle global scope failed:', error);
    } finally {
      setLoading(prev => ({ ...prev, global: false }));
    }
  };

  const fetchComparison = async () => {
    setLoading(prev => ({ ...prev, comparison: true }));
    try {
      const data = await scopeApi.compareScopes();
      setComparison(data);
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setLoading(prev => ({ ...prev, comparison: false }));
    }
  };

  useEffect(() => {
    if (activeTab === 'compare') {
      fetchComparison();
    }
  }, [activeTab]);

  const renderLocalScopes = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {localScopes.map((scope) => (
        <ScopeCard
          key={scope.id}
          title={scope.title}
          description={scope.description}
          icon={scope.icon}
          badge={scope.badge}
          onRun={scope.run}
          loading={loading[scope.id]}
          result={results[scope.id]}
          isGlobal={false}
        />
      ))}
    </div>
  );

  const renderGlobalScope = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5 text-purple-600" />
              Global Scope: Order by Name
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Automatically applied to ALL queries. Orders employees by name (A-Z).
            </p>
          </div>
          <button
            onClick={toggleGlobalScope}
            disabled={loading.global}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              globalEnabled
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
            }`}
          >
            {loading.global ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              globalEnabled ? '✅ Enabled' : '❌ Disabled'
            )}
          </button>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700">SQL with Global Scope:</p>
          <code className="text-xs text-gray-600 font-mono mt-1 block">
            SELECT * FROM employees ORDER BY name ASC
          </code>
          <p className="text-xs text-gray-500 mt-2">
            {globalEnabled
              ? '✅ Global scope is ACTIVE - All queries will be ordered by name'
              : '❌ Global scope is INACTIVE - No automatic ordering'}
          </p>
        </div>

        {results.global && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800">✅ Global Scope Test Results</p>
            <p className="text-sm text-green-700 mt-1">
              Found {results.global.data?.length || 0} employees
            </p>
            <div className="mt-2 max-h-40 overflow-y-auto">
              {results.global.data?.slice(0, 5).map((emp) => (
                <div key={emp.id} className="text-sm text-gray-600 py-0.5">
                  • {emp.name} ({emp.employee_code})
                </div>
              ))}
              {results.global.data?.length > 5 && (
                <p className="text-xs text-gray-500 mt-1">
                  ... and {results.global.data.length - 5} more
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Global Scope Example Queries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">How Global Scope Affects Queries</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700">Without Global Scope:</p>
            <code className="text-xs text-gray-600 font-mono block mt-1">
              Employee::all()
            </code>
            <p className="text-xs text-gray-500 mt-1">→ No ordering, natural order</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm font-medium text-purple-700">With Global Scope:</p>
            <code className="text-xs text-purple-700 font-mono block mt-1">
              Employee::all()
            </code>
            <p className="text-xs text-purple-600 mt-1">→ ORDER BY name ASC (auto-applied!)</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-700">Remove Global Scope:</p>
            <code className="text-xs text-blue-700 font-mono block mt-1">
              {'Employee::withoutGlobalScope(\'ordered\')->get()'}
            </code>
            <p className="text-xs text-blue-600 mt-1">→ No ordering, natural order</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComparison = () => (
    <div className="space-y-6">
      {loading.comparison ? (
        <div className="text-center py-12">Loading comparison...</div>
      ) : !comparison ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No comparison data</h3>
          <button
            onClick={fetchComparison}
            className="mt-4 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-secondary-900 hover:text-black transition-colors"
          >
            Run Comparison
          </button>
        </div>
      ) : (
        <>
          {/* Local Scopes Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-blue-600" />
              Local Scopes Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Scope</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Records</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparison.local_scopes.map((scope, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 font-mono text-xs text-primary-700">
                        {scope.name}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-900">{scope.count}</td>
                      <td className="px-4 py-2 text-gray-600">{scope.time}</td>
                      <td className="px-4 py-2 text-gray-500">{scope.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Global Scope Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5 text-purple-600" />
              Global Scope Status
            </h3>
            <div className={`p-4 rounded-lg border ${comparison.global_scope.is_active ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{comparison.global_scope.name}</p>
                  <p className="text-sm text-gray-600">{comparison.global_scope.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${comparison.global_scope.is_active ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>
                  {comparison.global_scope.is_active ? '✅ Active' : '❌ Inactive'}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>Records: {comparison.global_scope.count}</span>
                <span>Time: {comparison.global_scope.time}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border border-primary-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">📊 Summary</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• <strong>Local Scopes</strong> are used <em>when needed</em> for specific filters</li>
              <li>• <strong>Global Scopes</strong> are applied <em>automatically</em> to ALL queries</li>
              <li>• Global scopes are great for: <em>ordering, tenant filtering, soft-delete, multi-tenancy</em></li>
              <li>• Local scopes are great for: <em>reusable filters, status filtering, date ranges</em></li>
              <li>• You can combine both: <code className="bg-gray-200 px-1 rounded">{`Employee::active()->senior()->get()`}</code></li>
            </ul>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-primary-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-900 flex items-center gap-2">
              <FunnelIcon className="h-6 w-6 text-primary-600" />
              Local & Global Scopes Demo
            </h1>
              <p className="mt-1 text-sm text-gray-500">
              {'Local Scopes: Reusable query filters · Global Scopes: Automatically applied to ALL queries'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'local' && (
              <button
                onClick={runAllScopes}
                className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-secondary-900 hover:text-black transition-colors text-sm flex items-center gap-2"
              >
                <PlayIcon className="h-4 w-4" />
                Run All Scopes
              </button>
            )}
            <button
              onClick={() => {
                if (activeTab === 'local') {
                  // Refresh all local scopes
                  localScopes.forEach(scope => scope.run());
                } else if (activeTab === 'global') {
                  toggleGlobalScope();
                } else if (activeTab === 'compare') {
                  fetchComparison();
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('local')}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'local'
                ? 'border-b-2 border-primary-700 text-primary-700 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="h-4 w-4" />
            Local Scopes
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'global'
                ? 'border-b-2 border-primary-700 text-primary-700 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <GlobeAltIcon className="h-4 w-4" />
            Global Scopes
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'compare'
                ? 'border-b-2 border-primary-700 text-primary-700 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ChartBarIcon className="h-4 w-4" />
            Comparison
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'local' && renderLocalScopes()}
      {activeTab === 'global' && renderGlobalScope()}
      {activeTab === 'compare' && renderComparison()}
    </div>
  );
};

export default ScopeDemo;