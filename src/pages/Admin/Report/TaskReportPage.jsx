import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { Calendar, Download, Printer, Search, Filter, X, CheckCircle, Clock } from 'lucide-react';

export default function TaskReportPage() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [summary, setSummary] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    employeeId: '',
    taskType: '',
    status: '',
    priority: '',
    search: ''
  });

  // Fetch task reports
  const fetchTaskReports = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.reports.tasks, { 
        params: { 
          ...filters,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          employeeId: filters.employeeId || undefined,
          taskType: filters.taskType || undefined,
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          search: filters.search || undefined
        } 
      });
      
      if (response.data.success) {
        setReportData(response.data.data);
        setSummary(response.data.summary);
      } else {
        toast.error('Failed to fetch task reports');
      }
    } catch (error) {
      console.error('Error fetching task reports:', error);
      toast.error('Failed to fetch task reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskReports();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    fetchTaskReports();
  };

  const handleReset = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      employeeId: '',
      taskType: '',
      status: '',
      priority: '',
      search: ''
    });
    setTimeout(fetchTaskReports, 100); // Delay to allow reset to apply
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
            <h1 className="text-2xl font-bold text-gray-900">Task Reports</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track tasks, progress, and employee productivity
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
        <div className="grid grid-cols-7 gap-4">
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
            <label className="block text-xs text-gray-600 mb-1">Task Type</label>
            <select
              value={filters.taskType}
              onChange={(e) => handleFilterChange('taskType', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="call">Call</option>
              <option value="visit">Visit</option>
              <option value="meeting">Meeting</option>
              <option value="followup">Follow-up</option>
              <option value="email">Email</option>
              <option value="presentation">Presentation</option>
              <option value="research">Research</option>
              <option value="administration">Administration</option>
              <option value="other">Other</option>
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
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Search</label>
            <div className="relative flex">
              <input
                type="text"
                placeholder="Task Title, Description..."
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
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
            <div className="text-2xl font-bold text-gray-900">{summary.totalTasks}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{summary.pendingTasks}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">In Progress</div>
            <div className="text-2xl font-bold text-blue-600">{summary.inProgressTasks}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">{summary.completedTasks}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Overdue</div>
            <div className="text-2xl font-bold text-red-600">{summary.overdueTasks}</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Urgent</div>
            <div className="text-2xl font-bold text-orange-600">{summary.urgentTasks}</div>
            <div className="text-xs mt-1 text-gray-600">Avg Progress: {summary.avgProgress}%</div>
          </div>
        </div>
      )}

      {/* Task Type Statistics */}
      {summary && summary.taskTypeStats && Object.keys(summary.taskTypeStats).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Task Type Distribution
          </h3>
          <div className="grid grid-cols-6 gap-4">
            {Object.entries(summary.taskTypeStats).map(([type, count]) => (
              <div key={type} className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{type}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employee Task Statistics */}
      {summary && summary.employeeTaskStats && summary.employeeTaskStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Employee Task Statistics
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Employee</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Department</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Total</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Completed</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Pending</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {summary.employeeTaskStats.map((emp, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700 font-medium">{emp.employeeName}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{emp.department}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{emp.totalTasks}</td>
                    <td className="px-4 py-2 text-sm text-center text-green-600">{emp.completedTasks}</td>
                    <td className="px-4 py-2 text-sm text-center text-yellow-600">{emp.pendingTasks}</td>
                    <td className="px-4 py-2 text-sm text-right">
                      {emp.totalTasks > 0 ? Math.round((emp.completedTasks / emp.totalTasks) * 100) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#398C89]"></div>
          <span className="ml-3 text-gray-600">Loading task reports...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Task Records ({reportData?.length || 0} records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Employee</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Priority</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Scheduled</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Due</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Progress</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData && reportData.length > 0 ? (
                  reportData.map((task, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700 font-medium max-w-xs truncate" title={task.title}>
                        <div className="truncate">{task.title}</div>
                        <div className="text-xs text-gray-500 truncate">{task.description}</div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        <div>{task.employeeName}</div>
                        <div className="text-xs text-gray-500">{task.employeeId}</div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 capitalize">{task.taskType}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700">{formatDate(task.scheduledDate)}</td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700">{formatDate(task.dueDate)}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          task.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              task.progress >= 75 ? 'bg-green-600' :
                              task.progress >= 50 ? 'bg-yellow-500' :
                              task.progress >= 25 ? 'bg-orange-500' :
                              'bg-red-600'
                            }`} 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs mt-1">{task.progress}%</div>
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 capitalize">{task.outcome || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      No task reports found
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