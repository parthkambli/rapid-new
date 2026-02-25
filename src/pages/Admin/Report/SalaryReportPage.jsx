import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { Calendar, Download, Printer, Search, Filter, X, Users } from 'lucide-react';

export default function SalaryReportPage() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [summary, setSummary] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    employeeId: '',
    month: '',
    year: '',
    paymentStatus: '',
    search: ''
  });

  // Fetch salary reports
  const fetchSalaryReports = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.reports.salaries, { 
        params: { 
          ...filters,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          employeeId: filters.employeeId || undefined,
          month: filters.month || undefined,
          year: filters.year || undefined,
          paymentStatus: filters.paymentStatus || undefined,
          search: filters.search || undefined
        } 
      });
      
      if (response.data.success) {
        setReportData(response.data.data);
        setSummary(response.data.summary);
      } else {
        toast.error('Failed to fetch salary reports');
      }
    } catch (error) {
      console.error('Error fetching salary reports:', error);
      toast.error('Failed to fetch salary reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryReports();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    fetchSalaryReports();
  };

  const handleReset = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      employeeId: '',
      month: '',
      year: '',
      paymentStatus: '',
      search: ''
    });
    setTimeout(fetchSalaryReports, 100); // Delay to allow reset to apply
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
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
            <h1 className="text-2xl font-bold text-gray-900">Salary Reports</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track employee salaries, payments, and department-wise compensation
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
            <label className="block text-xs text-gray-600 mb-1">Month</label>
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange('month', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Year</label>
            <input
              type="number"
              placeholder="Year"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              min="2020"
              max="2030"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Payment Status</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
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
            <div className="text-sm text-gray-600 mb-1">Total Salaries</div>
            <div className="text-2xl font-bold text-gray-900">{summary.totalSalaries}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Amount Paid</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalAmountPaid)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Basic Salary</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalBasicSalary)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Deductions</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalDeductions)}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Paid Salaries</div>
            <div className="text-2xl font-bold text-green-600">{summary.paidSalaries}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Pending Payments</div>
            <div className="text-2xl font-bold text-yellow-600">{summary.pendingPayments}</div>
          </div>
        </div>
      )}

      {/* Department Statistics */}
      {summary && summary.departmentStats && summary.departmentStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Department-wise Salary Statistics
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Department</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Employees</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Total Salary</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Average Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {summary.departmentStats.map((dept, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700 font-medium">{dept.department}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700">{dept.totalEmployees}</td>
                    <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">{formatCurrency(dept.totalSalary)}</td>
                    <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">{formatCurrency(dept.avgSalary)}</td>
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
          <span className="ml-3 text-gray-600">Loading salary reports...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Salary Records ({reportData?.length || 0} records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Employee ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Designation</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Period</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Basic</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Gross</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Net</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Deductions</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData && reportData.length > 0 ? (
                  reportData.map((salary, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700 font-medium">{salary.employeeId}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{salary.employeeName}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{salary.department}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{salary.designation}</td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700">{salary.salaryPeriod}</td>
                      <td className="px-4 py-2 text-sm text-right text-gray-700">{formatCurrency(salary.basicSalary)}</td>
                      <td className="px-4 py-2 text-sm text-right text-gray-700 font-medium">{formatCurrency(salary.grossSalary)}</td>
                      <td className="px-4 py-2 text-sm text-right font-medium text-green-600">{formatCurrency(salary.netSalary)}</td>
                      <td className="px-4 py-2 text-sm text-right text-red-600">{formatCurrency(salary.totalDeductions)}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          salary.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          salary.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          salary.paymentStatus === 'processed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {salary.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700">{salary.paymentDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="px-4 py-8 text-center text-gray-500">
                      No salary reports found
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