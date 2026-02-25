import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { Calendar, Download, Printer, Search, Filter, X, Target, TrendingUp } from 'lucide-react';

export default function TargetReportPage() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [summary, setSummary] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    employeeId: '',
    targetType: '',
    status: '',
    search: ''
  });

  // Fetch target reports
  const fetchTargetReports = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.reports.targets, { 
        params: { 
          ...filters,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          employeeId: filters.employeeId || undefined,
          targetType: filters.targetType || undefined,
          status: filters.status || undefined,
          search: filters.search || undefined
        } 
      });
      
      if (response.data.success) {
        setReportData(response.data.data);
        setSummary(response.data.summary);
      } else {
        toast.error('Failed to fetch target reports');
      }
    } catch (error) {
      console.error('Error fetching target reports:', error);
      toast.error('Failed to fetch target reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargetReports();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    fetchTargetReports();
  };

  const handleReset = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      employeeId: '',
      targetType: '',
      status: '',
      search: ''
    });
    setTimeout(fetchTargetReports, 100); // Delay to allow reset to apply
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Target Reports</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track employee targets, achievements, and performance metrics
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-6 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">From Date</label>
            <div className="relative">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">To Date</label>
            <div className="relative">
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Employee</label>
            <input
              type="text"
              placeholder="Employee ID/Name"
              value={filters.employeeId}
              onChange={(e) => handleFilterChange('employeeId', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Target Type</label>
            <select
              value={filters.targetType}
              onChange={(e) => handleFilterChange('targetType', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Search</label>
            <div className="relative flex">
              <input
                type="text"
                placeholder="Employee, Department..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full border border-gray-300 rounded-l px-3 py-2 text-sm pr-10"
              />
              <button 
                onClick={handleSearch}
                className="bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#398C89] text-white rounded text-sm font-medium hover:bg-[#2d6f6c] flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Targets</div>
            <div className="text-2xl font-bold text-gray-900">{summary.totalTargets}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Active Targets</div>
            <div className="text-2xl font-bold text-blue-600">{summary.activeTargets}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">{summary.completedTargets}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Overdue</div>
            <div className="text-2xl font-bold text-red-600">{summary.overdueTargets}</div>
            <div className="text-xs mt-1 text-gray-600">Avg Achievement: {summary.avgAchievementPercentage}%</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#398C89]"></div>
          <span className="ml-3 text-gray-600">Loading target reports...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Target Records ({reportData?.length || 0} records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Employee</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Type</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Period</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Achieved %</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Progress %</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Doctors</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Quotes</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData && reportData.length > 0 ? (
                  reportData.map((target, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700 font-medium">
                        <div>{target.employeeName}</div>
                        <div className="text-xs text-gray-500">{target.employeeId}</div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{target.department}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 capitalize">{target.targetType}</td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700">{formatDate(target.targetPeriod)}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          target.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          target.status === 'completed' ? 'bg-green-100 text-green-800' :
                          target.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {target.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        <span className={`font-medium ${
                          target.achievementPercentage >= 80 ? 'text-green-600' :
                          target.achievementPercentage >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {target.achievementPercentage}%
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              target.progressPercentage >= 80 ? 'bg-green-600' :
                              target.progressPercentage >= 50 ? 'bg-yellow-500' :
                              'bg-red-600'
                            }`} 
                            style={{ width: `${target.progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs mt-1">{target.progressPercentage}%</div>
                      </td>
                      <td className="px-4 py-2 text-sm text-center">
                        <div className="text-gray-500 text-xs">Target: {target.targets.doctorsToContact}</div>
                        <div className="font-medium">Achvd: {target.achievements.doctorsContacted}</div>
                      </td>
                      <td className="px-4 py-2 text-sm text-center">
                        <div className="text-gray-500 text-xs">Target: {target.targets.quotationsToGenerate}</div>
                        <div className="font-medium">Achvd: {target.achievements.quotationsGenerated}</div>
                      </td>
                      <td className="px-4 py-2 text-sm text-center">
                        <div className="text-gray-500 text-xs">Target: {target.targets.revenueTarget}</div>
                        <div className="font-medium">Achvd: {target.achievements.revenueAchieved}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                      No target reports found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}