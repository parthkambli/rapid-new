import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { Calendar, Download, Printer, Search, Filter, X } from 'lucide-react';

export default function SalesBillReportPage() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [summary, setSummary] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: '',
    paymentStatus: '',
    clientType: '',
    search: ''
  });

  // Fetch sales bill reports
  const fetchSalesBillReports = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.reports.salesBills, { 
        params: { 
          ...filters,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          status: filters.status || undefined,
          paymentStatus: filters.paymentStatus || undefined,
          clientType: filters.clientType || undefined,
          search: filters.search || undefined
        } 
      });
      
      if (response.data.success) {
        setReportData(response.data.data);
        setSummary(response.data.summary);
      } else {
        toast.error('Failed to fetch sales bill reports');
      }
    } catch (error) {
      console.error('Error fetching sales bill reports:', error);
      toast.error('Failed to fetch sales bill reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesBillReports();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    fetchSalesBillReports();
  };

  const handleReset = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: '',
      paymentStatus: '',
      clientType: '',
      search: ''
    });
    setTimeout(fetchSalesBillReports, 100); // Delay to allow reset to apply
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
            <h1 className="text-2xl font-bold text-gray-900">Sales Bill Reports</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track sales bills, payments, and outstanding amounts across your business
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
            <label className="block text-xs text-gray-600 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
              <option value="renewal">Renewal</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Payment Status</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Client Type</label>
            <select
              value={filters.clientType}
              onChange={(e) => handleFilterChange('clientType', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="doctor">Doctor</option>
              <option value="hospital">Hospital</option>
              <option value="advocate">Advocate</option>
              <option value="expert">Expert</option>
              <option value="individual">Individual</option>
              <option value="organization">Organization</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Search</label>
            <div className="relative flex">
              <input
                type="text"
                placeholder="Bill No, Client..."
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
            <div className="text-sm text-gray-600 mb-1">Total Bills</div>
            <div className="text-2xl font-bold text-gray-900">{summary.totalBills}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Amount</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalAmount)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Outstanding</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalOutstanding)}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Paid Bills</div>
            <div className="text-2xl font-bold text-green-600">{summary.paidBills}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Pending Bills</div>
            <div className="text-2xl font-bold text-yellow-600">{summary.pendingBills}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Partial Payments</div>
            <div className="text-2xl font-bold text-blue-600">{summary.partialBills}</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#398C89]"></div>
          <span className="ml-3 text-gray-600">Loading sales bill reports...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sales Bills ({reportData?.length || 0} records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Bill No</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Client</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Due Date</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Total Amount</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Outstanding</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Payment Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Prepared By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData && reportData.length > 0 ? (
                  reportData.map((bill, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700">{bill.billNumber}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{bill.clientName}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{formatDate(bill.billDate)}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{formatDate(bill.dueDate)}</td>
                      <td className="px-4 py-2 text-sm text-right font-medium">{formatCurrency(bill.totalAmount)}</td>
                      <td className="px-4 py-2 text-sm text-right font-medium text-red-600">{formatCurrency(bill.outstandingAmount)}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                          bill.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          bill.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          bill.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          bill.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {bill.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{bill.preparedBy}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      No sales bill reports found
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