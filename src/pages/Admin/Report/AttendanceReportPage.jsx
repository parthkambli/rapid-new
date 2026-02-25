import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { Calendar, Download, Printer, Search, Filter, X, Users } from 'lucide-react';

export default function AttendanceReportPage() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [summary, setSummary] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    employeeId: '',
    status: '',
    search: ''
  });

  // Fetch attendance reports
  const fetchAttendanceReports = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.reports.attendance, { 
        params: { 
          ...filters,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          employeeId: filters.employeeId || undefined,
          status: filters.status || undefined,
          search: filters.search || undefined
        } 
      });
      
      if (response.data.success) {
        setReportData(response.data.data);
        setSummary(response.data.summary);
      } else {
        toast.error('Failed to fetch attendance reports');
      }
    } catch (error) {
      console.error('Error fetching attendance reports:', error);
      toast.error('Failed to fetch attendance reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceReports();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    fetchAttendanceReports();
  };

  const handleReset = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      employeeId: '',
      status: '',
      search: ''
    });
    setTimeout(fetchAttendanceReports, 100); // Delay to allow reset to apply
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track employee attendance, working hours, and leave patterns
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
        <div className="grid grid-cols-5 gap-4">
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
            <label className="block text-xs text-gray-600 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="half_day">Half Day</option>
              <option value="late">Late</option>
              <option value="early_leave">Early Leave</option>
              <option value="leave">On Leave</option>
              <option value="holiday">Holiday</option>
              <option value="weekend">Weekend</option>
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
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Records</div>
            <div className="text-2xl font-bold text-gray-900">{summary.totalRecords}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Present Days</div>
            <div className="text-2xl font-bold text-green-600">{summary.presentDays}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Absent Days</div>
            <div className="text-2xl font-bold text-red-600">{summary.absentDays}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Half Days</div>
            <div className="text-2xl font-bold text-yellow-600">{summary.halfDays}</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Late Days</div>
            <div className="text-2xl font-bold text-orange-600">{summary.lateDays}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Leave Days</div>
            <div className="text-2xl font-bold text-blue-600">{summary.leaveDays}</div>
          </div>
        </div>
      )}

      {/* Employee Statistics */}
      {summary && summary.employeeStats && summary.employeeStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Employee Statistics
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Employee ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Department</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Total Days</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Present</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Absent</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Late</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {summary.employeeStats.map((employee, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{employee.employeeId}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 font-medium">{employee.employeeName}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{employee.department}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{employee.totalDays}</td>
                    <td className="px-4 py-2 text-sm text-center text-green-600">{employee.presentDays}</td>
                    <td className="px-4 py-2 text-sm text-center text-red-600">{employee.absentDays}</td>
                    <td className="px-4 py-2 text-sm text-center text-orange-600">{employee.lateDays}</td>
                    <td className="px-4 py-2 text-sm text-right font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.attendancePercentage >= 90 ? 'bg-green-100 text-green-800' :
                        employee.attendancePercentage >= 75 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {employee.attendancePercentage}%
                      </span>
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
          <span className="ml-3 text-gray-600">Loading attendance reports...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Attendance Records ({reportData?.length || 0} records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Employee ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Check In</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Check Out</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Hours</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Overtime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData && reportData.length > 0 ? (
                  reportData.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700 font-medium">{record.employeeId}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{record.employeeName}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{record.department}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{formatDate(record.date)}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'present' ? 'bg-green-100 text-green-800' :
                          record.status === 'absent' ? 'bg-red-100 text-red-800' :
                          record.status === 'half_day' ? 'bg-yellow-100 text-yellow-800' :
                          record.status === 'late' ? 'bg-orange-100 text-orange-800' :
                          record.status === 'leave' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {record.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700">{formatTime(record.checkInTime)}</td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700">{formatTime(record.checkOutTime)}</td>
                      <td className="px-4 py-2 text-sm text-center font-medium">{record.workingHours}</td>
                      <td className="px-4 py-2 text-sm text-center text-blue-600">{record.overtimeHours}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      No attendance reports found
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