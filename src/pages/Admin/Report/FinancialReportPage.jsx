import React, { useState, useEffect } from 'react';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from 'react-toastify';
import { Calendar, Download, RotateCcw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function FinancialReportPage() {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    type: 'all', // revenue, expenses, bills
    searchTerm: ''
  });

  useEffect(() => {
    fetchFinancialReports();
  }, []);

  const fetchFinancialReports = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.type !== 'all') params.type = filters.type;

      const response = await apiClient.get(apiEndpoints.reports.financial, { params });
      if (response.data.success) {
        setFinancialData(response.data.data || []);
      } else {
        toast.error('Failed to fetch financial reports');
      }
    } catch (error) {
      console.error('Error fetching financial reports:', error);
      toast.error('Error fetching financial reports');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    fetchFinancialReports();
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      type: 'all',
      searchTerm: ''
    });
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

  const getReportType = (type) => {
    switch(type) {
      case 'revenue': return 'Revenue';
      case 'expenses': return 'Expenses';
      case 'bills': return 'Bills';
      default: return 'All Financial';
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-[79vw]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Financial Reports</h1>
        <p className="text-gray-600">Overview of revenue, expenses, and bills across the organization</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <div className="relative">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <div className="relative">
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="all">All Financial</option>
              <option value="revenue">Revenue</option>
              <option value="expenses">Expenses</option>
              <option value="bills">Bills</option>
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-end gap-2 lg:col-span-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Apply Filters'}
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 flex items-center justify-center"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {financialData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {financialData.map((report, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{getReportType(report.type)}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(report.data.reduce((sum, item) => sum + (item.totalAmount || item.totalRevenue || item.totalExpenses || 0), 0))}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  report.type === 'revenue' ? 'bg-green-100' :
                  report.type === 'expenses' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  {report.type === 'revenue' ? <TrendingUp className="h-6 w-6 text-green-600" /> :
                   report.type === 'expenses' ? <TrendingDown className="h-6 w-6 text-red-600" /> :
                   <DollarSign className="h-6 w-6 text-blue-600" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2">Loading financial reports...</span>
        </div>
      )}

      {/* Table */}
      {!loading && financialData.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Financial Data ({getReportType(filters.type)})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month/Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {financialData.map((report, index) => (
                  <React.Fragment key={index}>
                    {report.data.map((item, itemIndex) => (
                      <tr key={itemIndex} className={itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.totalAmount || item.totalRevenue || item.totalExpenses || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.count || item.transactionCount || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                          {Array.isArray(item.categories) ? item.categories.join(', ') : 
                           Array.isArray(item.methods) ? item.methods.join(', ') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && financialData.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No financial data found for the selected criteria.</p>
          </div>
        )
      )}
    </div>
  );
}