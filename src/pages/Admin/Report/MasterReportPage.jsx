// src/pages/Admin/Report/MasterReportPage.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { Calendar, Download, Printer } from 'lucide-react';

export default function MasterReportPage() {
  const [activeTab, setActiveTab] = useState('owner-snapshot');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Owner Snapshot filters
  const [ownerFilters, setOwnerFilters] = useState({
    dateFrom: '',
    dateTo: '',
    paymentType: 'All',
    mode: 'All',
    searchName: ''
  });

  // Finance Dashboard filters
  const [financeFilters, setFinanceFilters] = useState({
    dateFrom: '',
    dateTo: '',
    category: 'All',
    companyVendor: 'All',
    paymentMode: 'All'
  });

  const fetchMasterReport = async (tab = activeTab) => {
    setLoading(true);
    try {
      const params = { tab };
      
      if (tab === 'owner-snapshot') {
        if (ownerFilters.dateFrom) params.dateFrom = ownerFilters.dateFrom;
        if (ownerFilters.dateTo) params.dateTo = ownerFilters.dateTo;
        if (ownerFilters.paymentType !== 'All') params.paymentType = ownerFilters.paymentType;
        if (ownerFilters.mode !== 'All') params.mode = ownerFilters.mode;
        if (ownerFilters.searchName) params.searchName = ownerFilters.searchName;
      } else if (tab === 'finance-dashboard') {
        if (financeFilters.dateFrom) params.dateFrom = financeFilters.dateFrom;
        if (financeFilters.dateTo) params.dateTo = financeFilters.dateTo;
        if (financeFilters.category !== 'All') params.category = financeFilters.category;
        if (financeFilters.companyVendor !== 'All') params.companyVendor = financeFilters.companyVendor;
        if (financeFilters.paymentMode !== 'All') params.paymentMode = financeFilters.paymentMode;
      }

      const response = await apiClient.get(apiEndpoints.reports.master, { params });
      if (response.data.success) {
        setReportData(response.data.data);
      } else {
        toast.error('Failed to fetch master report');
      }
    } catch (error) {
      console.error('Error fetching master report:', error);
      toast.error('Failed to fetch master report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterReport();
  }, [activeTab]);

  const handleOwnerFilterChange = (field, value) => {
    setOwnerFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFinanceFilterChange = (field, value) => {
    setFinanceFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleResetOwner = () => {
    setOwnerFilters({
      dateFrom: '',
      dateTo: '',
      paymentType: 'All',
      mode: 'All',
      searchName: ''
    });
  };

  const handleResetFinance = () => {
    setFinanceFilters({
      dateFrom: '',
      dateTo: '',
      category: 'All',
      companyVendor: 'All',
      paymentMode: 'All'
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

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Master Reports</h1>
            <p className="text-sm text-gray-600 mt-1">
              Combined view - Doctor inflows, payouts (Advocates & Experts), and Finance (budgets & payments)
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

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-300">
          <button
            onClick={() => {
              setActiveTab('owner-snapshot');
              fetchMasterReport('owner-snapshot');
            }}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'owner-snapshot'
                ? 'bg-[#398C89] text-white border-b-2 border-[#398C89]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Owner Snapshot
          </button>
          <button
            onClick={() => {
              setActiveTab('finance-dashboard');
              fetchMasterReport('finance-dashboard');
            }}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'finance-dashboard'
                ? 'bg-[#398C89] text-white border-b-2 border-[#398C89]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Finance Dashboard
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#398C89]"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      ) : (
        <>
          {/* Owner Snapshot Tab */}
          {activeTab === 'owner-snapshot' && (
            <div>
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">From</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={ownerFilters.dateFrom}
                        onChange={(e) => handleOwnerFilterChange('dateFrom', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">To</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={ownerFilters.dateTo}
                        onChange={(e) => handleOwnerFilterChange('dateTo', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Payment Type</label>
                    <select
                      value={ownerFilters.paymentType}
                      onChange={(e) => handleOwnerFilterChange('paymentType', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option>All</option>
                      <option>Member</option>
                      <option>Policy Payment</option>
                      <option>Case Fees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Mode</label>
                    <select
                      value={ownerFilters.mode}
                      onChange={(e) => handleOwnerFilterChange('mode', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option>All</option>
                      <option>Bank</option>
                      <option>UPI</option>
                      <option>Cash</option>
                      <option>NEFT</option>
                      <option>Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Doctor/Advocate/Expert</label>
                    <input
                      type="text"
                      placeholder="Search name"
                      value={ownerFilters.searchName}
                      onChange={(e) => handleOwnerFilterChange('searchName', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => fetchMasterReport('owner-snapshot')}
                    className="px-4 py-2 bg-[#398C89] text-white rounded text-sm font-medium hover:bg-[#2d6f6c]"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleResetOwner}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              {reportData?.summary && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#E8F5E9] rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">From Doctors (Inflow)</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.fromDoctors)}</div>
                  </div>
                  <div className="bg-[#E8F5E9] rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">To Advocates (Payout)</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.toAdvocates)}</div>
                  </div>
                  <div className="bg-[#E8F5E9] rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">To Experts (Payout)</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.toExperts)}</div>
                  </div>
                  <div className={`rounded-lg p-4 ${reportData.summary.net >= 0 ? 'bg-[#E8F5E9]' : 'bg-[#FFEBEE]'}`}>
                    <div className="text-sm text-gray-600 mb-1">Net (Doctors - Payouts)</div>
                    <div className={`text-2xl font-bold ${reportData.summary.net >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                      {formatCurrency(reportData.summary.net)}
                    </div>
                  </div>
                </div>
              )}

              {/* Doctor Inflows Table */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Doctor Inflows ({reportData?.doctorInflows?.length || 0})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Doctor</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Reason</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Mode</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData?.doctorInflows?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.doctor}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.reason}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.mode}</td>
                          <td className="px-4 py-2 text-sm text-right font-medium text-green-600">+{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                      {(!reportData?.doctorInflows || reportData.doctorInflows.length === 0) && (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payouts Table */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payouts Advocates & Experts (Adv: {reportData?.payouts?.advocates?.length || 0} Exp: {reportData?.payouts?.experts?.length || 0})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Person</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Role</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Mode</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData?.payouts?.advocates?.map((item, index) => (
                        <tr key={`adv-${index}`} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.person}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.role}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.mode}</td>
                          <td className="px-4 py-2 text-sm text-right font-medium text-red-600">-{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                      {reportData?.payouts?.experts?.map((item, index) => (
                        <tr key={`exp-${index}`} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.person}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.role}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.mode}</td>
                          <td className="px-4 py-2 text-sm text-right font-medium text-red-600">-{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                      {(!reportData?.payouts?.advocates?.length && !reportData?.payouts?.experts?.length) && (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* All Items Table */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  All Items (Filtered) ({reportData?.allItems?.length || 0} items)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Details</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Mode</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData?.allItems?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.type}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.details}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.mode}</td>
                          <td className={`px-4 py-2 text-sm text-right font-medium ${item.isInflow ? 'text-green-600' : 'text-red-600'}`}>
                            {item.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(item.amount))}
                          </td>
                        </tr>
                      ))}
                      {(!reportData?.allItems || reportData.allItems.length === 0) && (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Finance Dashboard Tab */}
          {activeTab === 'finance-dashboard' && (
            <div>
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">From</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={financeFilters.dateFrom}
                        onChange={(e) => handleFinanceFilterChange('dateFrom', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">To</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={financeFilters.dateTo}
                        onChange={(e) => handleFinanceFilterChange('dateTo', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Category</label>
                    <select
                      value={financeFilters.category}
                      onChange={(e) => handleFinanceFilterChange('category', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option>All</option>
                      <option>Revenue</option>
                      <option>Salary</option>
                      <option>Office Expense</option>
                      <option>Marketing</option>
                      <option>Insurance Payment</option>
                      <option>Commission</option>
                      <option>Refund</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Company/Vendor</label>
                    <input
                      type="text"
                      placeholder="ICICI, Rent,..."
                      value={financeFilters.companyVendor}
                      onChange={(e) => handleFinanceFilterChange('companyVendor', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
                    <select
                      value={financeFilters.paymentMode}
                      onChange={(e) => handleFinanceFilterChange('paymentMode', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option>All</option>
                      <option>Bank</option>
                      <option>UPI</option>
                      <option>Cash</option>
                      <option>NEFT</option>
                      <option>Card</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => fetchMasterReport('finance-dashboard')}
                    className="px-4 py-2 bg-[#398C89] text-white rounded text-sm font-medium hover:bg-[#2d6f6c]"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleResetFinance}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              {reportData?.summary && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#E8F5E9] rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Revenue</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.revenue)}</div>
                  </div>
                  <div className="bg-[#E8F5E9] rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Total Expenses</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.totalExpenses)}</div>
                  </div>
                  <div className="bg-[#E8F5E9] rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Insurance Paid</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.insurancePaid)}</div>
                  </div>
                  <div className={`rounded-lg p-4 ${reportData.summary.net >= 0 ? 'bg-[#E8F5E9]' : 'bg-[#FFEBEE]'}`}>
                    <div className="text-sm text-gray-600 mb-1">Net (Rev - Exp)</div>
                    <div className={`text-2xl font-bold ${reportData.summary.net >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                      {formatCurrency(reportData.summary.net)}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Snapshot */}
              {reportData?.quickSnapshot && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="text-sm text-gray-600 mb-1">Salaries</div>
                    <div className="text-xl font-bold text-gray-900">{formatCurrency(reportData.quickSnapshot.salaries)}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="text-sm text-gray-600 mb-1">Other Expenses</div>
                    <div className="text-xl font-bold text-gray-900">{formatCurrency(reportData.quickSnapshot.otherExpenses)}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="text-sm text-gray-600 mb-1">Commissions</div>
                    <div className="text-xl font-bold text-gray-900">{formatCurrency(reportData.quickSnapshot.commissions)}</div>
                  </div>
                </div>
              )}

              {/* Insurance Payments by Company */}
              {reportData?.insuranceByCompany && reportData.insuranceByCompany.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Payments by Company</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Company</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportData.insuranceByCompany.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-700">{item.company}</td>
                            <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Salary by Role */}
              {reportData?.salaryByRole && reportData.salaryByRole.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary by Role</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Role</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportData.salaryByRole.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-700">{item.role}</td>
                            <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Transactions Table */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Transactions ({reportData?.transactions?.length || 0} Items)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Company / Vendor</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Details</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Mode</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData?.transactions?.map((item, index) => {
                        const categoryColors = {
                          'Revenue': 'bg-green-100 text-green-800',
                          'Salary': 'bg-blue-100 text-blue-800',
                          'Insurance Payment': 'bg-indigo-100 text-indigo-800',
                          'Marketing': 'bg-orange-100 text-orange-800',
                          'Office Expense': 'bg-gray-100 text-gray-800',
                          'Commission': 'bg-yellow-100 text-yellow-800',
                          'Refund': 'bg-purple-100 text-purple-800'
                        };
                        const categoryColor = categoryColors[item.category] || 'bg-gray-100 text-gray-800';

                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
                            <td className="px-4 py-2 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColor}`}>
                                {item.category}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">{item.companyVendor}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{item.details}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{item.mode}</td>
                            <td className={`px-4 py-2 text-sm text-right font-medium ${item.type === 'inflow' ? 'text-green-600' : 'text-red-600'}`}>
                              {item.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(item.amount))}
                            </td>
                          </tr>
                        );
                      })}
                      {(!reportData?.transactions || reportData.transactions.length === 0) && (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

