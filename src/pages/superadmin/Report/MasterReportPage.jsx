// src/pages/superadmin/Report/MasterReportPage.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { Calendar, Download, Printer } from 'lucide-react';
import ReactApexCharts from 'react-apexcharts';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import AsyncSelect from 'react-select/async';

// Memoized chart component to prevent ApexCharts from re-initializing on every render
const MemoizedCashflowChart = React.memo(({ dailyCashflow, formatCurrency, formatDate }) => {
  const series = useMemo(() => ([{
    name: 'Cashflow',
    data: dailyCashflow.map(item => item.amount || 0)
  }]), [dailyCashflow]);

  const options = useMemo(() => ({
    chart: { toolbar: { show: false }, animations: { enabled: true } },
    plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 4, distributed: true } },
    dataLabels: { enabled: false },
    stroke: { show: false },
    colors: dailyCashflow.map(item => item.amount >= 0 ? '#10B981' : '#EF4444'),
    xaxis: {
      categories: dailyCashflow.map(item =>
        new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      ),
      labels: { style: { fontSize: '10px', colors: '#6B7280' }, rotate: -45, rotateAlways: false },
      axisBorder: { show: true, color: '#E5E7EB' },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        formatter: (val) => {
          if (val >= 1000000) return (val / 1000000).toFixed(1) + 'L';
          if (val >= 100000) return (val / 100000).toFixed(1) + 'L';
          if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
          return val.toString();
        },
        style: { fontSize: '10px', colors: '#6B7280' }
      },
      opposite: false,
      tickAmount: 3
    },
    grid: { borderColor: '#F3F4F6', strokeDashArray: 4, yaxis: { lines: { show: true } } },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => formatCurrency(val), title: { formatter: () => '' } },
      x: {
        formatter: (val, opts) => {
          const date = dailyCashflow[opts.dataPointIndex]?.date;
          return date ? formatDate(date) : '';
        }
      }
    },
    legend: { show: false },
    states: { hover: { filter: { type: 'darken', value: 0.8 } } }
  }), [dailyCashflow, formatCurrency, formatDate]);

  return <ReactApexCharts type="bar" height="100%" series={series} options={options} />;
});

export default function MasterReportPage() {
  const printRef = useRef(null);
  const [activeTab, setActiveTab] = useState('owner-snapshot');
  const [vendorSelectKey, setVendorSelectKey] = useState(0);
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
    companyVendor: '',
    paymentMode: 'All'
  });

  // Pagination states for Owner Snapshot tables
  const [doctorInflowsPage, setDoctorInflowsPage] = useState(1);
  const [doctorInflowsRows, setDoctorInflowsRows] = useState(10);
  const [payoutsPage, setPayoutsPage] = useState(1);
  const [payoutsRows, setPayoutsRows] = useState(10);
  const [allItemsPage, setAllItemsPage] = useState(1);
  const [allItemsRows, setAllItemsRows] = useState(10);

  // Pagination states for Finance Dashboard tables
  const [insurancePage, setInsurancePage] = useState(1);
  const [insuranceRows, setInsuranceRows] = useState(10);
  const [salaryPage, setSalaryPage] = useState(1);
  const [salaryRows, setSalaryRows] = useState(10);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsRows, setTransactionsRows] = useState(10);

  const resetOwnerPagination = () => {
    setDoctorInflowsPage(1);
    setPayoutsPage(1);
    setAllItemsPage(1);
  };

  const resetFinancePagination = () => {
    setInsurancePage(1);
    setSalaryPage(1);
    setTransactionsPage(1);
  };

  const applyOwnerFilters = () => {
    resetOwnerPagination();
    fetchMasterReport('owner-snapshot');
  };

  const applyFinanceFilters = () => {
    resetFinancePagination();
    fetchMasterReport('finance-dashboard');
  };

  const fetchMasterReport = async (tab = activeTab, filterOverrides = {}) => {
    setLoading(true);
    try {
      const params = { tab };
      const effectiveOwnerFilters = { ...ownerFilters, ...(filterOverrides.owner || {}) };
      const effectiveFinanceFilters = { ...financeFilters, ...(filterOverrides.finance || {}) };

      if (tab === 'owner-snapshot') {
        if (effectiveOwnerFilters.dateFrom) params.dateFrom = effectiveOwnerFilters.dateFrom;
        if (effectiveOwnerFilters.dateTo) params.dateTo = effectiveOwnerFilters.dateTo;
        if (effectiveOwnerFilters.paymentType !== 'All') params.paymentType = effectiveOwnerFilters.paymentType;
        if (effectiveOwnerFilters.mode !== 'All') params.mode = effectiveOwnerFilters.mode;
        if (effectiveOwnerFilters.searchName) params.searchName = effectiveOwnerFilters.searchName;
      } else if (tab === 'finance-dashboard') {
        if (effectiveFinanceFilters.dateFrom) params.dateFrom = effectiveFinanceFilters.dateFrom;
        if (effectiveFinanceFilters.dateTo) params.dateTo = effectiveFinanceFilters.dateTo;
        if (effectiveFinanceFilters.category !== 'All') params.category = effectiveFinanceFilters.category;
        if (effectiveFinanceFilters.companyVendor?.trim()) params.companyVendor = effectiveFinanceFilters.companyVendor.trim();
        if (effectiveFinanceFilters.paymentMode !== 'All') params.paymentMode = effectiveFinanceFilters.paymentMode;
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

  // Initial fetch on mount only – tab-switch buttons handle their own fetch
  useEffect(() => {
    fetchMasterReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOwnerFilterChange = (field, value) => {
    setOwnerFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFinanceFilterChange = (field, value) => {
    setFinanceFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleResetOwner = () => {
    const resetFilters = {
      dateFrom: '',
      dateTo: '',
      paymentType: 'All',
      mode: 'All',
      searchName: ''
    };
    setOwnerFilters(resetFilters);
    resetOwnerPagination();
    return resetFilters;
  };

  const handleResetFinance = () => {
    const resetFilters = {
      dateFrom: '',
      dateTo: '',
      category: 'All',
      companyVendor: '',
      paymentMode: 'All'
    };
    setFinanceFilters(resetFilters);
    resetFinancePagination();
    return resetFilters;
  };

  useEffect(() => {
    if (!reportData?.doctorInflows?.length) {
      setDoctorInflowsPage(1);
    } else {
      const totalPages = Math.max(1, Math.ceil(reportData.doctorInflows.length / doctorInflowsRows));
      if (doctorInflowsPage > totalPages) {
        setDoctorInflowsPage(totalPages);
      }
    }
  }, [reportData?.doctorInflows?.length, doctorInflowsRows, doctorInflowsPage]);

  useEffect(() => {
    const totalPayouts =
      (reportData?.payouts?.advocates?.length || 0) +
      (reportData?.payouts?.experts?.length || 0) +
      (reportData?.payouts?.insurance?.length || 0);

    if (!totalPayouts) {
      setPayoutsPage(1);
    } else {
      const totalPages = Math.max(1, Math.ceil(totalPayouts / payoutsRows));
      if (payoutsPage > totalPages) {
        setPayoutsPage(totalPages);
      }
    }
  }, [
    reportData?.payouts?.advocates?.length,
    reportData?.payouts?.experts?.length,
    reportData?.payouts?.insurance?.length,
    payoutsRows,
    payoutsPage
  ]);

  useEffect(() => {
    if (!reportData?.allItems?.length) {
      setAllItemsPage(1);
    } else {
      const totalPages = Math.max(1, Math.ceil(reportData.allItems.length / allItemsRows));
      if (allItemsPage > totalPages) {
        setAllItemsPage(totalPages);
      }
    }
  }, [reportData?.allItems?.length, allItemsRows, allItemsPage]);

  useEffect(() => {
    if (!reportData?.insuranceByCompany?.length) {
      setInsurancePage(1);
    } else {
      const totalPages = Math.max(1, Math.ceil(reportData.insuranceByCompany.length / insuranceRows));
      if (insurancePage > totalPages) {
        setInsurancePage(totalPages);
      }
    }
  }, [reportData?.insuranceByCompany?.length, insuranceRows, insurancePage]);

  useEffect(() => {
    if (!reportData?.salaryByRole?.length) {
      setSalaryPage(1);
    } else {
      const totalPages = Math.max(1, Math.ceil(reportData.salaryByRole.length / salaryRows));
      if (salaryPage > totalPages) {
        setSalaryPage(totalPages);
      }
    }
  }, [reportData?.salaryByRole?.length, salaryRows, salaryPage]);

  useEffect(() => {
    if (!reportData?.transactions?.length) {
      setTransactionsPage(1);
    } else {
      const totalPages = Math.max(1, Math.ceil(reportData.transactions.length / transactionsRows));
      if (transactionsPage > totalPages) {
        setTransactionsPage(totalPages);
      }
    }
  }, [reportData?.transactions?.length, transactionsRows, transactionsPage]);

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

  const formatPaymentMode = (mode) => {
    const paymentModeLabels = {
      online_transfer: 'Bank',
      bank_transfer: 'Bank',
      online: 'Online',
      upi: 'UPI',
      cash: 'Cash',
      cheque: 'Cheque',
      neft: 'NEFT',
      rtgs: 'RTGS',
      'neft/rtgs': 'NEFT/RTGS',
      credit_card: 'Credit Card',
      debit_card: 'Debit Card',
      demand_draft: 'Demand Draft',
      nach: 'NACH',
      petty_cash: 'Petty Cash',
      other: 'Other'
    };

    return paymentModeLabels[mode] || mode || '-';
  };

  const financeCategoryOptions = useMemo(() => Array.from(new Set([
    'All',
    'Revenue',
    'Salary',
    'Office Expense',
    'Marketing',
    'Insurance Payment',
    'Commission',
    'Advocate Payment',
    'Expert Payment',
    'Professional Fees',
    'Bank Charges',
    'Travel',
    'Communication',
    'Training',
    'Meals',
    'Other Expense',
    ...(reportData?.transactions?.map(item => item.category).filter(Boolean) || [])
  ])), [reportData?.transactions]);

  // Fetch vendor names from lightweight API (not from heavy reportData)
  const loadVendorOptions = useCallback((inputValue, callback) => {
    apiClient.get(apiEndpoints.reports.masterVendors, { params: { search: inputValue || '' } })
      .then(res => {
        const vendors = (res.data?.data || []).slice(0, 30).map(v => ({ value: v, label: v }));
        callback(vendors);
      })
      .catch(() => callback([]));
  }, []);

  const financePaymentModeOptions = [
    'All',
    'Cash',
    'Cheque',
    'Online Transfer',
    'Online',
    'Bank Transfer',
    'Credit Card',
    'Debit Card',
    'UPI',
    'Demand Draft',
    'RTGS',
    'NEFT',
    'NEFT/RTGS',
    'NACH',
    'Other'
  ];

  // ============ Excel Export Function ============
  const handleExportToExcel = () => {
    if (!reportData) {
      toast.error('No data to export');
      return;
    }

    const wb = XLSX.utils.book_new();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

    if (activeTab === 'owner-snapshot') {
      // Sheet 1: Summary
      if (reportData.summary) {
        const summaryData = [
          ['Owner Snapshot Summary'],
          ['From Doctors (Inflow)', formatCurrency(reportData.summary.fromDoctors)],
          ['To Advocates (Payout)', formatCurrency(reportData.summary.toAdvocates)],
          ['To Experts (Payout)', formatCurrency(reportData.summary.toExperts)],
          ['Net (Doctors - Payouts)', formatCurrency(reportData.summary.net)],
          [],
          ['Filters Applied:'],
          ['Date From', ownerFilters.dateFrom || 'All'],
          ['Date To', ownerFilters.dateTo || 'All'],
          ['Payment Type', ownerFilters.paymentType],
          ['Mode', ownerFilters.mode],
          ['Search Name', ownerFilters.searchName || 'All']
        ];
        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
      }

      // Sheet 2: Doctor Inflows (Only visible/paginated data)
      if (reportData.doctorInflows && reportData.doctorInflows.length > 0) {
        const visibleInflows = reportData.doctorInflows.slice(
          (doctorInflowsPage - 1) * doctorInflowsRows,
          doctorInflowsPage * doctorInflowsRows
        );
        const inflowsData = [
          ['Doctor Inflows'],
          ['Date', 'Doctor', 'Reason', 'Mode', 'Amount']
        ];
        visibleInflows.forEach(item => {
          inflowsData.push([
            formatDate(item.date),
            item.doctor,
            item.reason,
            item.mode,
            item.amount
          ]);
        });
        const inflowsWs = XLSX.utils.aoa_to_sheet(inflowsData);
        XLSX.utils.book_append_sheet(wb, inflowsWs, 'Doctor Inflows');
      }

      // Sheet 3: Payouts (Only visible/paginated data)
      if (reportData.payouts) {
        const allPayouts = [
          ...(reportData.payouts.advocates || []),
          ...(reportData.payouts.experts || []),
          ...(reportData.payouts.insurance || [])
        ];
        const visiblePayouts = allPayouts.slice(
          (payoutsPage - 1) * payoutsRows,
          payoutsPage * payoutsRows
        );
        const payoutsData = [
          ['Payouts - Advocates, Experts & Insurance'],
          ['Date', 'Person/Company', 'Role', 'Mode', 'Amount']
        ];
        visiblePayouts.forEach(item => {
          payoutsData.push([
            formatDate(item.date),
            item.person,
            item.role,
            item.mode,
            item.amount
          ]);
        });
        const payoutsWs = XLSX.utils.aoa_to_sheet(payoutsData);
        XLSX.utils.book_append_sheet(wb, payoutsWs, 'Payouts');
      }

      // Sheet 4: All Items (Only visible/paginated data)
      if (reportData.allItems && reportData.allItems.length > 0) {
        const visibleAllItems = reportData.allItems.slice(
          (allItemsPage - 1) * allItemsRows,
          allItemsPage * allItemsRows
        );
        const allItemsData = [
          ['All Items (Combined)'],
          ['Date', 'Type', 'Name', 'Details', 'Mode', 'Amount']
        ];
        visibleAllItems.forEach(item => {
          allItemsData.push([
            formatDate(item.date),
            item.type,
            item.name,
            item.details,
            item.mode,
            item.amount
          ]);
        });
        const allItemsWs = XLSX.utils.aoa_to_sheet(allItemsData);
        XLSX.utils.book_append_sheet(wb, allItemsWs, 'All Items');
      }
    } else if (activeTab === 'finance-dashboard') {
      // Sheet 1: Summary
      if (reportData.summary) {
        const summaryData = [
          ['Finance Dashboard Summary'],
          ['Total Revenue', formatCurrency(reportData.summary.revenue)],
          ['Total Expenses', formatCurrency(reportData.summary.totalExpenses)],
          ['Insurance Paid (Company)', formatCurrency(reportData.summary.insurancePaid)],
          ['Net (Revenue - Expenses)', formatCurrency(reportData.summary.net)],
          [],
          ['Filters Applied:'],
          ['Date From', financeFilters.dateFrom || 'All'],
          ['Date To', financeFilters.dateTo || 'All'],
          ['Category', financeFilters.category],
          ['Company/Vendor', financeFilters.companyVendor || 'All'],
          ['Payment Mode', financeFilters.paymentMode]
        ];
        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
      }

      // Sheet 2: Insurance by Company (Only visible/paginated data)
      if (reportData.insuranceByCompany && reportData.insuranceByCompany.length > 0) {
        const visibleInsurance = reportData.insuranceByCompany.slice(
          (insurancePage - 1) * insuranceRows,
          insurancePage * insuranceRows
        );
        const insuranceData = [
          ['Insurance by Company'],
          ['Company', 'Amount Paid']
        ];
        visibleInsurance.forEach(item => {
          insuranceData.push([item.company, item.amount]);
        });
        const insuranceWs = XLSX.utils.aoa_to_sheet(insuranceData);
        XLSX.utils.book_append_sheet(wb, insuranceWs, 'Insurance by Company');
      }

      // Sheet 3: Salary by Role (Only visible/paginated data)
      if (reportData.salaryByRole && reportData.salaryByRole.length > 0) {
        const visibleSalary = reportData.salaryByRole.slice(
          (salaryPage - 1) * salaryRows,
          salaryPage * salaryRows
        );
        const salaryData = [
          ['Salary by Role'],
          ['Role', 'Total Salary']
        ];
        visibleSalary.forEach(item => {
          salaryData.push([item.role, item.amount]);
        });
        const salaryWs = XLSX.utils.aoa_to_sheet(salaryData);
        XLSX.utils.book_append_sheet(wb, salaryWs, 'Salary by Role');
      }

      // Sheet 4: Transactions (Only visible/paginated data)
      if (reportData.transactions && reportData.transactions.length > 0) {
        const visibleTransactions = reportData.transactions.slice(
          (transactionsPage - 1) * transactionsRows,
          transactionsPage * transactionsRows
        );
        const transactionsData = [
          ['All Transactions'],
          ['Date', 'Category', 'Company/Vendor', 'Details', 'Mode', 'Amount']
        ];
        visibleTransactions.forEach(item => {
          transactionsData.push([
            formatDate(item.date),
            item.category,
            item.companyVendor,
            item.details,
            formatPaymentMode(item.mode),
            item.amount
          ]);
        });
        const transactionsWs = XLSX.utils.aoa_to_sheet(transactionsData);
        XLSX.utils.book_append_sheet(wb, transactionsWs, 'Transactions');
      }
    }

    // Generate filename with tab name and timestamp
    const filename = `MasterReport_${activeTab}_${timestamp}.xlsx`;
    XLSX.writeFile(wb, filename);
    toast.success('Report exported to Excel successfully!');
  };

  // ============ Print Function ============
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `MasterReport_${activeTab}_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}`,
    onAfterPrint: () => toast.success('Print dialog opened successfully!')
  });

  return (
    <div ref={printRef} className="min-h-screen p-6 bg-gray-50 w-[79vw]">
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
            <button 
              onClick={handleExportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
            {/* <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button> */}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-300">
          <button
            onClick={() => {
              setActiveTab('owner-snapshot');
              resetOwnerPagination();
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
              resetFinancePagination();
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
                    <input
                      type="date"
                      value={ownerFilters.dateFrom}
                      onChange={(e) => handleOwnerFilterChange('dateFrom', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">To</label>
                    <input
                      type="date"
                      value={ownerFilters.dateTo}
                      onChange={(e) => handleOwnerFilterChange('dateTo', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
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
                      <option>Cash</option>
                      <option>Cheque</option>
                      <option>Online Transfer</option>
                      <option>Online</option>
                      <option>Bank Transfer</option>
                      <option>Credit Card</option>
                      <option>Debit Card</option>
                      <option>UPI</option>
                      <option>Demand Draft</option>
                      <option>RTGS</option>
                      <option>NEFT</option>
                      <option>NEFT/RTGS</option>
                      <option>NACH</option>
                      <option>Other</option>
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
                    onClick={applyOwnerFilters}
                    className="px-4 py-2 bg-[#398C89] text-white rounded text-sm font-medium hover:bg-[#2d6f6c]"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      const resetFilters = handleResetOwner();
                      fetchMasterReport('owner-snapshot', { owner: resetFilters });
                    }}
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Doctor Inflows ({reportData?.doctorInflows?.length || 0})
                  </h3>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Rows:</label>
                    <select
                      value={doctorInflowsRows}
                      onChange={(e) => {
                        setDoctorInflowsRows(Number(e.target.value));
                        setDoctorInflowsPage(1);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
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
                      {reportData?.doctorInflows
                        ?.slice((doctorInflowsPage - 1) * doctorInflowsRows, doctorInflowsPage * doctorInflowsRows)
                        .map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.doctor}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.reason}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{formatPaymentMode(item.mode)}</td>
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
                {reportData?.doctorInflows && reportData.doctorInflows.length > 0 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {Math.min((doctorInflowsPage - 1) * doctorInflowsRows + 1, reportData.doctorInflows.length)} to {Math.min(doctorInflowsPage * doctorInflowsRows, reportData.doctorInflows.length)} of {reportData.doctorInflows.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDoctorInflowsPage(prev => Math.max(1, prev - 1))}
                        disabled={doctorInflowsPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {doctorInflowsPage} of {Math.ceil(reportData.doctorInflows.length / doctorInflowsRows)}
                      </span>
                      <button
                        onClick={() => setDoctorInflowsPage(prev => Math.min(Math.ceil(reportData.doctorInflows.length / doctorInflowsRows), prev + 1))}
                        disabled={doctorInflowsPage >= Math.ceil(reportData.doctorInflows.length / doctorInflowsRows)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payouts Table */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payouts - Advocates, Experts & Insurance (Adv: {reportData?.payouts?.advocates?.length || 0}, Exp: {reportData?.payouts?.experts?.length || 0}, Ins: {reportData?.payouts?.insurance?.length || 0})
                  </h3>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Rows:</label>
                    <select
                      value={payoutsRows}
                      onChange={(e) => {
                        setPayoutsRows(Number(e.target.value));
                        setPayoutsPage(1);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Person/Company</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Role</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Mode</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        ...(reportData?.payouts?.advocates || []),
                        ...(reportData?.payouts?.experts || []),
                        ...(reportData?.payouts?.insurance || [])
                      ]
                        .slice((payoutsPage - 1) * payoutsRows, payoutsPage * payoutsRows)
                        .map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.person}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.role}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.mode}</td>
                          <td className="px-4 py-2 text-sm text-right font-medium text-red-600">-{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                      {(!reportData?.payouts?.advocates?.length && !reportData?.payouts?.experts?.length && !reportData?.payouts?.insurance?.length) && (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {reportData?.payouts && (reportData.payouts.advocates?.length || reportData.payouts.experts?.length || reportData.payouts.insurance?.length) > 0 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {Math.min((payoutsPage - 1) * payoutsRows + 1, (reportData.payouts.advocates?.length || 0) + (reportData.payouts.experts?.length || 0) + (reportData.payouts.insurance?.length || 0))} to {Math.min(payoutsPage * payoutsRows, (reportData.payouts.advocates?.length || 0) + (reportData.payouts.experts?.length || 0) + (reportData.payouts.insurance?.length || 0))} of {(reportData.payouts.advocates?.length || 0) + (reportData.payouts.experts?.length || 0) + (reportData.payouts.insurance?.length || 0)} entries
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPayoutsPage(prev => Math.max(1, prev - 1))}
                        disabled={payoutsPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {payoutsPage} of {Math.ceil(((reportData.payouts.advocates?.length || 0) + (reportData.payouts.experts?.length || 0) + (reportData.payouts.insurance?.length || 0)) / payoutsRows)}
                      </span>
                      <button
                        onClick={() => setPayoutsPage(prev => Math.min(Math.ceil(((reportData.payouts.advocates?.length || 0) + (reportData.payouts.experts?.length || 0) + (reportData.payouts.insurance?.length || 0)) / payoutsRows), prev + 1))}
                        disabled={payoutsPage >= Math.ceil(((reportData.payouts.advocates?.length || 0) + (reportData.payouts.experts?.length || 0) + (reportData.payouts.insurance?.length || 0)) / payoutsRows)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* All Items Table */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    All Items (Combined) ({reportData?.allItems?.length || 0} items)
                  </h3>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Rows:</label>
                    <select
                      value={allItemsRows}
                      onChange={(e) => {
                        setAllItemsRows(Number(e.target.value));
                        setAllItemsPage(1);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
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
                      {reportData?.allItems
                        ?.slice((allItemsPage - 1) * allItemsRows, allItemsPage * allItemsRows)
                        .map((item, index) => (
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
                {reportData?.allItems && reportData.allItems.length > 0 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {Math.min((allItemsPage - 1) * allItemsRows + 1, reportData.allItems.length)} to {Math.min(allItemsPage * allItemsRows, reportData.allItems.length)} of {reportData.allItems.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAllItemsPage(prev => Math.max(1, prev - 1))}
                        disabled={allItemsPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {allItemsPage} of {Math.ceil(reportData.allItems.length / allItemsRows)}
                      </span>
                      <button
                        onClick={() => setAllItemsPage(prev => Math.min(Math.ceil(reportData.allItems.length / allItemsRows), prev + 1))}
                        disabled={allItemsPage >= Math.ceil(reportData.allItems.length / allItemsRows)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
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
                    <input
                      type="date"
                      value={financeFilters.dateFrom}
                      onChange={(e) => handleFinanceFilterChange('dateFrom', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">To</label>
                    <input
                      type="date"
                      value={financeFilters.dateTo}
                      onChange={(e) => handleFinanceFilterChange('dateTo', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Category</label>
                    <select
                      value={financeFilters.category}
                      onChange={(e) => handleFinanceFilterChange('category', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      {financeCategoryOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Company/Vendor</label>
                    <AsyncSelect
                      key={vendorSelectKey}
                      loadOptions={loadVendorOptions}
                      defaultOptions
                      cacheOptions
                      value={financeFilters.companyVendor ? { value: financeFilters.companyVendor, label: financeFilters.companyVendor } : null}
                      onChange={(selected) => handleFinanceFilterChange('companyVendor', selected?.value || '')}
                      isClearable
                      placeholder="Type to search vendor..."
                      noOptionsMessage={() => 'Type to search...'}
                      styles={{
                        control: (base) => ({ ...base, minHeight: '38px', fontSize: '0.875rem', borderColor: '#d1d5db' }),
                        menu: (base) => ({ ...base, zIndex: 50, fontSize: '0.875rem' }),
                        placeholder: (base) => ({ ...base, color: '#9ca3af' }),
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
                    <select
                      value={financeFilters.paymentMode}
                      onChange={(e) => handleFinanceFilterChange('paymentMode', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      {financePaymentModeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={applyFinanceFilters}
                    className="px-4 py-2 bg-[#398C89] text-white rounded text-sm font-medium hover:bg-[#2d6f6c]"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      const resetFilters = handleResetFinance();
                      setVendorSelectKey(prev => prev + 1);
                      fetchMasterReport('finance-dashboard', { finance: resetFilters });
                    }}
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
                    <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.revenue)}</div>
                  </div>
                  <div className="bg-[#FFEBEE] rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Total Expenses</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.totalExpenses)}</div>
                  </div>
                  <div className="bg-[#E8F5E9] rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Insurance Paid (Company)</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.insurancePaid)}</div>
                  </div>
                  <div className={`rounded-lg p-4 ${reportData.summary.net >= 0 ? 'bg-[#E8F5E9]' : 'bg-[#FFEBEE]'}`}>
                    <div className="text-sm text-gray-600 mb-1">Net (Revenue - Expenses)</div>
                    <div className={`text-2xl font-bold ${reportData.summary.net >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                      {formatCurrency(reportData.summary.net)}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Snapshot and Cashflow Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Quick Snapshot */}
                {reportData?.quickSnapshot && (
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Snapshot</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Salaries</div>
                        <div className="text-xl font-bold text-gray-900">{formatCurrency(reportData.quickSnapshot.salaries)}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Other Expenses</div>
                        <div className="text-xl font-bold text-gray-900">{formatCurrency(reportData.quickSnapshot.otherExpenses)}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">Commissions</div>
                        <div className="text-xl font-bold text-gray-900">{formatCurrency(reportData.quickSnapshot.commissions)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cashflow (Daily) Chart */}
                {reportData?.dailyCashflow && reportData.dailyCashflow.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Cashflow (Daily)</h3>
                      {financeFilters.dateFrom && financeFilters.dateTo && (
                        <div className="px-4 py-2 bg-[#E8F5E9] rounded-full text-sm text-[#398C89] font-medium">
                          {formatDate(financeFilters.dateFrom)} → {formatDate(financeFilters.dateTo)}
                        </div>
                      )}
                    </div>
                    <div className="h-64">
                      <MemoizedCashflowChart dailyCashflow={reportData.dailyCashflow} formatCurrency={formatCurrency} formatDate={formatDate} />
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded bg-green-500"></div>
                        <span>Positive = Inflow</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded bg-red-500"></div>
                        <span>Negative = Outflow</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Insurance by Company */}
              {reportData?.insuranceByCompany && reportData.insuranceByCompany.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Insurance by Company</h3>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Rows:</label>
                      <select
                        value={insuranceRows}
                        onChange={(e) => {
                          setInsuranceRows(Number(e.target.value));
                          setInsurancePage(1);
                        }}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Company</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount Paid</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportData.insuranceByCompany
                          .slice((insurancePage - 1) * insuranceRows, insurancePage * insuranceRows)
                          .map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-700">{item.company}</td>
                            <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {Math.min((insurancePage - 1) * insuranceRows + 1, reportData.insuranceByCompany.length)} to {Math.min(insurancePage * insuranceRows, reportData.insuranceByCompany.length)} of {reportData.insuranceByCompany.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInsurancePage(prev => Math.max(1, prev - 1))}
                        disabled={insurancePage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {insurancePage} of {Math.ceil(reportData.insuranceByCompany.length / insuranceRows)}
                      </span>
                      <button
                        onClick={() => setInsurancePage(prev => Math.min(Math.ceil(reportData.insuranceByCompany.length / insuranceRows), prev + 1))}
                        disabled={insurancePage >= Math.ceil(reportData.insuranceByCompany.length / insuranceRows)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Salary by Role */}
              {reportData?.salaryByRole && reportData.salaryByRole.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Salary by Role</h3>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Rows:</label>
                      <select
                        value={salaryRows}
                        onChange={(e) => {
                          setSalaryRows(Number(e.target.value));
                          setSalaryPage(1);
                        }}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Role</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Total Salary</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportData.salaryByRole
                          .slice((salaryPage - 1) * salaryRows, salaryPage * salaryRows)
                          .map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-700">{item.role}</td>
                            <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {Math.min((salaryPage - 1) * salaryRows + 1, reportData.salaryByRole.length)} to {Math.min(salaryPage * salaryRows, reportData.salaryByRole.length)} of {reportData.salaryByRole.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSalaryPage(prev => Math.max(1, prev - 1))}
                        disabled={salaryPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {salaryPage} of {Math.ceil(reportData.salaryByRole.length / salaryRows)}
                      </span>
                      <button
                        onClick={() => setSalaryPage(prev => Math.min(Math.ceil(reportData.salaryByRole.length / salaryRows), prev + 1))}
                        disabled={salaryPage >= Math.ceil(reportData.salaryByRole.length / salaryRows)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Transactions Table */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    All Transactions ({reportData?.transactions?.length || 0})
                  </h3>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Rows:</label>
                    <select
                      value={transactionsRows}
                      onChange={(e) => {
                        setTransactionsRows(Number(e.target.value));
                        setTransactionsPage(1);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Company/Vendor</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Details</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Mode</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData?.transactions
                        ?.slice((transactionsPage - 1) * transactionsRows, transactionsPage * transactionsRows)
                        .map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.category}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.companyVendor}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.details}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{item.mode}</td>
                          <td className={`px-4 py-2 text-sm text-right font-medium ${item.type === 'inflow' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.type === 'inflow' ? '+' : ''}{formatCurrency(Math.abs(item.amount))}
                          </td>
                        </tr>
                      ))}
                      {(!reportData?.transactions || reportData.transactions.length === 0) && (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {reportData?.transactions && reportData.transactions.length > 0 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {Math.min((transactionsPage - 1) * transactionsRows + 1, reportData.transactions.length)} to {Math.min(transactionsPage * transactionsRows, reportData.transactions.length)} of {reportData.transactions.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTransactionsPage(prev => Math.max(1, prev - 1))}
                        disabled={transactionsPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {transactionsPage} of {Math.ceil(reportData.transactions.length / transactionsRows)}
                      </span>
                      <button
                        onClick={() => setTransactionsPage(prev => Math.min(Math.ceil(reportData.transactions.length / transactionsRows), prev + 1))}
                        disabled={transactionsPage >= Math.ceil(reportData.transactions.length / transactionsRows)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
