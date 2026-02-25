import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { Calendar, Download, Printer, Search, Filter, X } from 'lucide-react';

export default function ReceiptReportPage() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [summary, setSummary] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: '',
    paymentMethod: '',
    amountFrom: '',
    amountTo: '',
    search: ''
  });

  // Fetch receipt reports
  const fetchReceiptReports = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.reports.receipts, { 
        params: { 
          ...filters,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          status: filters.status || undefined,
          paymentMethod: filters.paymentMethod || undefined,
          amountFrom: filters.amountFrom || undefined,
          amountTo: filters.amountTo || undefined,
          search: filters.search || undefined
        } 
      });
      
      if (response.data.success) {
        setReportData(response.data.data);
        setSummary(response.data.summary);
      } else {
        toast.error('Failed to fetch receipt reports');
      }
    } catch (error) {
      console.error('Error fetching receipt reports:', error);
      toast.error('Failed to fetch receipt reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceiptReports();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    fetchReceiptReports();
  };

  const handleReset = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: '',
      paymentMethod: '',
      amountFrom: '',
      amountTo: '',
      search: ''
    });
    setTimeout(fetchReceiptReports, 100); // Delay to allow reset to apply
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
            <h1 className="text-2xl font-bold text-gray-900">Receipt Reports</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track payment receipts, methods, and financial inflows across your business
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
            <label className="block text-xs text-gray-600 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="cleared">Cleared</option>
              <option value="bounced">Bounced</option>
              <option value="cancelled">Cancelled</option>
              <option value="received">Received</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Payment Method</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Methods</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online_transfer">Online Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="upi">UPI</option>
              <option value="neft">NEFT</option>
              <option value="rtgs">RTGS</option>
              <option value="demand_draft">Demand Draft</option>
              <option value="nach">NACH</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Amount From</label>
            <input
              type="number"
              placeholder="Min Amount"
              value={filters.amountFrom}
              onChange={(e) => handleFilterChange('amountFrom', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Amount To</label>
            <input
              type="number"
              placeholder="Max Amount"
              value={filters.amountTo}
              onChange={(e) => handleFilterChange('amountTo', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Search</label>
            <div className="relative flex">
              <input
                type="text"
                placeholder="Receipt No, Payer..."
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
            <div className="text-sm text-gray-600 mb-1">Total Receipts</div>
            <div className="text-2xl font-bold text-gray-900">{summary.totalReceipts}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Amount</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalAmount)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Average Amount</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary.avgAmount)}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Receipts Data</div>
            <div className="text-sm text-gray-700">
              {Object.entries(summary.paymentMethodStats).map(([method, amount], idx) => (
                <div key={idx} className="text-xs">{method}: {formatCurrency(amount)}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#398C89]"></div>
          <span className="ml-3 text-gray-600">Loading receipt reports...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Receipts ({reportData?.length || 0} records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Receipt No</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Payer Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Method</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Received By</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData && reportData.length > 0 ? (
                  reportData.map((receipt, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700 font-medium">{receipt.receiptNumber}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{receipt.payerName}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{formatDate(receipt.receiptDate)}</td>
                      <td className="px-4 py-2 text-sm text-right font-medium text-green-600">{formatCurrency(receipt.amount)}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 capitalize">{receipt.paymentMethod}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          receipt.status === 'cleared' ? 'bg-green-100 text-green-800' :
                          receipt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          receipt.status === 'bounced' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {receipt.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{receipt.receivedBy}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 max-w-xs truncate" title={receipt.remarks}>{receipt.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No receipt reports found
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