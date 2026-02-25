// // src/pages/Admin/Report/MasterReportPage.jsx
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import apiClient, { apiEndpoiCnts } from '../../../services/apiClient';
// import { Calendar, Download, Printer } from 'lucide-react';

// export default function MasterReportPage() {
//   const [activeTab, setActiveTab] = useState('owner-snapshot');
//   const [loading, setLoading] = useState(false);
//   const [reportData, setReportData] = useState(null);

//   // Owner Snapshot filters
//   const [ownerFilters, setOwnerFilters] = useState({
//     dateFrom: '',
//     dateTo: '',
//     paymentType: 'All',
//     mode: 'All',
//     searchName: ''
//   });

//   // Finance Dashboard filters
//   const [financeFilters, setFinanceFilters] = useState({
//     dateFrom: '',
//     dateTo: '',
//     category: 'All',
//     companyVendor: 'All',
//     paymentMode: 'All'
//   });

//   const fetchMasterReport = async (tab = activeTab) => {
//     setLoading(true);
//     try {
//       const params = { tab };

//       if (tab === 'owner-snapshot') {
//         if (ownerFilters.dateFrom) params.dateFrom = ownerFilters.dateFrom;
//         if (ownerFilters.dateTo) params.dateTo = ownerFilters.dateTo;
//         if (ownerFilters.paymentType !== 'All') params.paymentType = ownerFilters.paymentType;
//         if (ownerFilters.mode !== 'All') params.mode = ownerFilters.mode;
//         if (ownerFilters.searchName) params.searchName = ownerFilters.searchName;
//       } else if (tab === 'finance-dashboard') {
//         if (financeFilters.dateFrom) params.dateFrom = financeFilters.dateFrom;
//         if (financeFilters.dateTo) params.dateTo = financeFilters.dateTo;
//         if (financeFilters.category !== 'All') params.category = financeFilters.category;
//         if (financeFilters.companyVendor !== 'All') params.companyVendor = financeFilters.companyVendor;
//         if (financeFilters.paymentMode !== 'All') params.paymentMode = financeFilters.paymentMode;
//       }

//       const response = await apiClient.get(apiEndpoints.reports.master, { params });
//       if (response.data.success) {
//         setReportData(response.data.data);
//       } else {
//         toast.error('Failed to fetch master report');
//       }
//     } catch (error) {
//       console.error('Error fetching master report:', error);
//       toast.error('Failed to fetch master report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMasterReport();
//   }, [activeTab]);

//   const handleOwnerFilterChange = (field, value) => {
//     setOwnerFilters(prev => ({ ...prev, [field]: value }));
//   };

//   const handleFinanceFilterChange = (field, value) => {
//     setFinanceFilters(prev => ({ ...prev, [field]: value }));
//   };

//   const handleResetOwner = () => {
//     setOwnerFilters({
//       dateFrom: '',
//       dateTo: '',
//       paymentType: 'All',
//       mode: 'All',
//       searchName: ''
//     });
//   };

//   const handleResetFinance = () => {
//     setFinanceFilters({
//       dateFrom: '',
//       dateTo: '',
//       category: 'All',
//       companyVendor: 'All',
//       paymentMode: 'All'
//     });
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount || 0);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB');
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-2">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Master Reports</h1>
//             <p className="text-sm text-gray-600 mt-1">
//               Combined view - Doctor inflows, payouts (Advocates & Experts), and Finance (budgets & payments)
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 flex items-center gap-2">
//               <Download className="w-4 h-4" />
//               Export to Excel
//             </button>
//             <button className="px-4 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 flex items-center gap-2">
//               <Printer className="w-4 h-4" />
//               Print
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 border-b border-gray-300">
//           <button
//             onClick={() => {
//               setActiveTab('owner-snapshot');
//               fetchMasterReport('owner-snapshot');
//             }}
//             className={`px-6 py-3 font-medium text-sm ${
//               activeTab === 'owner-snapshot'
//                 ? 'bg-[#398C89] text-white border-b-2 border-[#398C89]'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             Owner Snapshot
//           </button>
//           <button
//             onClick={() => {
//               setActiveTab('finance-dashboard');
//               fetchMasterReport('finance-dashboard');
//             }}
//             className={`px-6 py-3 font-medium text-sm ${
//               activeTab === 'finance-dashboard'
//                 ? 'bg-[#398C89] text-white border-b-2 border-[#398C89]'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             Finance Dashboard
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center p-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#398C89]"></div>
//           <span className="ml-3 text-gray-600">Loading...</span>
//         </div>
//       ) : (
//         <>
//           {/* Owner Snapshot Tab */}
//           {activeTab === 'owner-snapshot' && (
//             <div>
//               {/* Filters */}
//               <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//                 <div className="grid grid-cols-5 gap-4">
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">From</label>
//                     <div className="relative">
//                       <input
//                         type="date"
//                         value={ownerFilters.dateFrom}
//                         onChange={(e) => handleOwnerFilterChange('dateFrom', e.target.value)}
//                         className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                       />
//                       <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">To</label>
//                     <div className="relative">
//                       <input
//                         type="date"
//                         value={ownerFilters.dateTo}
//                         onChange={(e) => handleOwnerFilterChange('dateTo', e.target.value)}
//                         className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                       />
//                       <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">Payment Type</label>
//                     <select
//                       value={ownerFilters.paymentType}
//                       onChange={(e) => handleOwnerFilterChange('paymentType', e.target.value)}
//                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                     >
//                       <option>All</option>
//                       <option>Member</option>
//                       <option>Policy Payment</option>
//                       <option>Case Fees</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">Mode</label>
//                     <select
//                       value={ownerFilters.mode}
//                       onChange={(e) => handleOwnerFilterChange('mode', e.target.value)}
//                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                     >
//                       <option>All</option>
//                       <option>Bank</option>
//                       <option>UPI</option>
//                       <option>Cash</option>
//                       <option>NEFT</option>
//                       <option>Card</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">Doctor/Advocate/Expert</label>
//                     <input
//                       type="text"
//                       placeholder="Search name"
//                       value={ownerFilters.searchName}
//                       onChange={(e) => handleOwnerFilterChange('searchName', e.target.value)}
//                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex gap-2 mt-4">
//                   <button
//                     onClick={() => fetchMasterReport('owner-snapshot')}
//                     className="px-4 py-2 bg-[#398C89] text-white rounded text-sm font-medium hover:bg-[#2d6f6c]"
//                   >
//                     Apply
//                   </button>
//                   <button
//                     onClick={handleResetOwner}
//                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300"
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>

//               {/* Summary Cards */}
//               {reportData?.summary && (
//                 <div className="grid grid-cols-4 gap-4 mb-6">
//                   <div className="bg-[#E8F5E9] rounded-lg p-4">
//                     <div className="text-sm text-gray-600 mb-1">From Doctors (Inflow)</div>
//                     <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.fromDoctors)}</div>
//                   </div>
//                   <div className="bg-[#E8F5E9] rounded-lg p-4">
//                     <div className="text-sm text-gray-600 mb-1">To Advocates (Payout)</div>
//                     <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.toAdvocates)}</div>
//                   </div>
//                   <div className="bg-[#E8F5E9] rounded-lg p-4">
//                     <div className="text-sm text-gray-600 mb-1">To Experts (Payout)</div>
//                     <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.toExperts)}</div>
//                   </div>
//                   <div className={`rounded-lg p-4 ${reportData.summary.net >= 0 ? 'bg-[#E8F5E9]' : 'bg-[#FFEBEE]'}`}>
//                     <div className="text-sm text-gray-600 mb-1">Net (Doctors - Payouts)</div>
//                     <div className={`text-2xl font-bold ${reportData.summary.net >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
//                       {formatCurrency(reportData.summary.net)}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Doctor Inflows Table */}
//               <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Doctor Inflows ({reportData?.doctorInflows?.length || 0})
//                 </h3>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Doctor</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Reason</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Mode</th>
//                         <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {reportData?.doctorInflows?.map((item, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.doctor}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.reason}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.mode}</td>
//                           <td className="px-4 py-2 text-sm text-right font-medium text-green-600">+{formatCurrency(item.amount)}</td>
//                         </tr>
//                       ))}
//                       {(!reportData?.doctorInflows || reportData.doctorInflows.length === 0) && (
//                         <tr>
//                           <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No data available</td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Payouts Table */}
//               <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Payouts Advocates & Experts (Adv: {reportData?.payouts?.advocates?.length || 0} Exp: {reportData?.payouts?.experts?.length || 0})
//                 </h3>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Person</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Role</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Mode</th>
//                         <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {reportData?.payouts?.advocates?.map((item, index) => (
//                         <tr key={`adv-${index}`} className="hover:bg-gray-50">
//                           <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.person}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.role}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.mode}</td>
//                           <td className="px-4 py-2 text-sm text-right font-medium text-red-600">-{formatCurrency(item.amount)}</td>
//                         </tr>
//                       ))}
//                       {reportData?.payouts?.experts?.map((item, index) => (
//                         <tr key={`exp-${index}`} className="hover:bg-gray-50">
//                           <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.person}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.role}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.mode}</td>
//                           <td className="px-4 py-2 text-sm text-right font-medium text-red-600">-{formatCurrency(item.amount)}</td>
//                         </tr>
//                       ))}
//                       {(!reportData?.payouts?.advocates?.length && !reportData?.payouts?.experts?.length) && (
//                         <tr>
//                           <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No data available</td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* All Items Table */}
//               <div className="bg-white rounded-lg shadow-sm p-4">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   All Items (Filtered) ({reportData?.allItems?.length || 0} items)
//                 </h3>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Type</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Name</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Details</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Mode</th>
//                         <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {reportData?.allItems?.map((item, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.type}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.name}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.details}</td>
//                           <td className="px-4 py-2 text-sm text-gray-700">{item.mode}</td>
//                           <td className={`px-4 py-2 text-sm text-right font-medium ${item.isInflow ? 'text-green-600' : 'text-red-600'}`}>
//                             {item.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(item.amount))}
//                           </td>
//                         </tr>
//                       ))}
//                       {(!reportData?.allItems || reportData.allItems.length === 0) && (
//                         <tr>
//                           <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No data available</td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Finance Dashboard Tab */}
//           {activeTab === 'finance-dashboard' && (
//             <div>
//               {/* Filters */}
//               <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//                 <div className="grid grid-cols-5 gap-4">
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">From</label>
//                     <div className="relative">
//                       <input
//                         type="date"
//                         value={financeFilters.dateFrom}
//                         onChange={(e) => handleFinanceFilterChange('dateFrom', e.target.value)}
//                         className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                       />
//                       <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">To</label>
//                     <div className="relative">
//                       <input
//                         type="date"
//                         value={financeFilters.dateTo}
//                         onChange={(e) => handleFinanceFilterChange('dateTo', e.target.value)}
//                         className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                       />
//                       <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">Category</label>
//                     <select
//                       value={financeFilters.category}
//                       onChange={(e) => handleFinanceFilterChange('category', e.target.value)}
//                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                     >
//                       <option>All</option>
//                       <option>Revenue</option>
//                       <option>Salary</option>
//                       <option>Office Expense</option>
//                       <option>Marketing</option>
//                       <option>Insurance Payment</option>
//                       <option>Commission</option>
//                       <option>Refund</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">Company/Vendor</label>
//                     <input
//                       type="text"
//                       placeholder="ICICI, Rent,..."
//                       value={financeFilters.companyVendor}
//                       onChange={(e) => handleFinanceFilterChange('companyVendor', e.target.value)}
//                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1">Payment Mode</label>
//                     <select
//                       value={financeFilters.paymentMode}
//                       onChange={(e) => handleFinanceFilterChange('paymentMode', e.target.value)}
//                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                     >
//                       <option>All</option>
//                       <option>Bank</option>
//                       <option>UPI</option>
//                       <option>Cash</option>
//                       <option>NEFT</option>
//                       <option>Card</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 mt-4">
//                   <button
//                     onClick={() => fetchMasterReport('finance-dashboard')}
//                     className="px-4 py-2 bg-[#398C89] text-white rounded text-sm font-medium hover:bg-[#2d6f6c]"
//                   >
//                     Apply
//                   </button>
//                   <button
//                     onClick={handleResetFinance}
//                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300"
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>

//               {/* Summary Cards */}
//               {reportData?.summary && (
//                 <div className="grid grid-cols-4 gap-4 mb-6">
//                   <div className="bg-[#E8F5E9] rounded-lg p-4">
//                     <div className="text-sm text-gray-600 mb-1">Revenue</div>
//                     <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.revenue)}</div>
//                   </div>
//                   <div className="bg-[#E8F5E9] rounded-lg p-4">
//                     <div className="text-sm text-gray-600 mb-1">Total Expenses</div>
//                     <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.totalExpenses)}</div>
//                   </div>
//                   <div className="bg-[#E8F5E9] rounded-lg p-4">
//                     <div className="text-sm text-gray-600 mb-1">Insurance Paid</div>
//                     <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.summary.insurancePaid)}</div>
//                   </div>
//                   <div className={`rounded-lg p-4 ${reportData.summary.net >= 0 ? 'bg-[#E8F5E9]' : 'bg-[#FFEBEE]'}`}>
//                     <div className="text-sm text-gray-600 mb-1">Net (Rev - Exp)</div>
//                     <div className={`text-2xl font-bold ${reportData.summary.net >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
//                       {formatCurrency(reportData.summary.net)}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Quick Snapshot */}
//               {reportData?.quickSnapshot && (
//                 <div className="grid grid-cols-3 gap-4 mb-6">
//                   <div className="bg-white rounded-lg shadow-sm p-4">
//                     <div className="text-sm text-gray-600 mb-1">Salaries</div>
//                     <div className="text-xl font-bold text-gray-900">{formatCurrency(reportData.quickSnapshot.salaries)}</div>
//                   </div>
//                   <div className="bg-white rounded-lg shadow-sm p-4">
//                     <div className="text-sm text-gray-600 mb-1">Other Expenses</div>
//                     <div className="text-xl font-bold text-gray-900">{formatCurrency(reportData.quickSnapshot.otherExpenses)}</div>
//                   </div>
//                   <div className="bg-white rounded-lg shadow-sm p-4">
//                     <div className="text-sm text-gray-600 mb-1">Commissions</div>
//                     <div className="text-xl font-bold text-gray-900">{formatCurrency(reportData.quickSnapshot.commissions)}</div>
//                   </div>
//                 </div>
//               )}

//               {/* Insurance Payments by Company */}
//               {reportData?.insuranceByCompany && reportData.insuranceByCompany.length > 0 && (
//                 <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Payments by Company</h3>
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Company</th>
//                           <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {reportData.insuranceByCompany.map((item, index) => (
//                           <tr key={index} className="hover:bg-gray-50">
//                             <td className="px-4 py-2 text-sm text-gray-700">{item.company}</td>
//                             <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}

//               {/* Salary by Role */}
//               {reportData?.salaryByRole && reportData.salaryByRole.length > 0 && (
//                 <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary by Role</h3>
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Role</th>
//                           <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {reportData.salaryByRole.map((item, index) => (
//                           <tr key={index} className="hover:bg-gray-50">
//                             <td className="px-4 py-2 text-sm text-gray-700">{item.role}</td>
//                             <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}

//               {/* Transactions Table */}
//               <div className="bg-white rounded-lg shadow-sm p-4">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Transactions ({reportData?.transactions?.length || 0} Items)
//                 </h3>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Category</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Company / Vendor</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Details</th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Mode</th>
//                         <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {reportData?.transactions?.map((item, index) => {
//                         const categoryColors = {
//                           'Revenue': 'bg-green-100 text-green-800',
//                           'Salary': 'bg-blue-100 text-blue-800',
//                           'Insurance Payment': 'bg-indigo-100 text-indigo-800',
//                           'Marketing': 'bg-orange-100 text-orange-800',
//                           'Office Expense': 'bg-gray-100 text-gray-800',
//                           'Commission': 'bg-yellow-100 text-yellow-800',
//                           'Refund': 'bg-purple-100 text-purple-800'
//                         };
//                         const categoryColor = categoryColors[item.category] || 'bg-gray-100 text-gray-800';

//                         return (
//                           <tr key={index} className="hover:bg-gray-50">
//                             <td className="px-4 py-2 text-sm text-gray-700">{formatDate(item.date)}</td>
//                             <td className="px-4 py-2 text-sm">
//                               <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColor}`}>
//                                 {item.category}
//                               </span>
//                             </td>
//                             <td className="px-4 py-2 text-sm text-gray-700">{item.companyVendor}</td>
//                             <td className="px-4 py-2 text-sm text-gray-700">{item.details}</td>
//                             <td className="px-4 py-2 text-sm text-gray-700">{item.mode}</td>
//                             <td className={`px-4 py-2 text-sm text-right font-medium ${item.type === 'inflow' ? 'text-green-600' : 'text-red-600'}`}>
//                               {item.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(item.amount))}
//                             </td>
//                           </tr>
//                         );
//                       })}
//                       {(!reportData?.transactions || reportData.transactions.length === 0) && (
//                         <tr>
//                           <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No data available</td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// src/pages/Admin/Report/MasterReportPage.jsx
// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import {
//   Calendar,
//   Download,
//   Printer,
//   TrendingUp,
//   TrendingDown,
//   ArrowRightLeft,
// } from "lucide-react";

// const dummyDoctorInflows = [
//   {
//     date: "2025-09-01",
//     doctor: "Dr. Amit Sharma",
//     reason: "Membership Renewal",
//     mode: "Bank",
//     amount: 15000,
//   },
//   {
//     date: "2025-09-02",
//     doctor: "Dr. Nisha Rao",
//     reason: "Policy Premium (Rapid)",
//     mode: "UPI",
//     amount: 12000,
//   },
//   {
//     date: "2025-09-05",
//     doctor: "Dr. Kavita Joshi",
//     reason: "Case Fees",
//     mode: "NEFT",
//     amount: 18000,
//   },
//   {
//     date: "2025-09-10",
//     doctor: "Dr. Rahul Verma",
//     reason: "Membership New",
//     mode: "Cash",
//     amount: 14000,
//   },
//   {
//     date: "2025-09-14",
//     doctor: "Dr. Priya Mehta",
//     reason: "Policy Premium (Care)",
//     mode: "Bank",
//     amount: 16000,
//   },
//   {
//     date: "2025-09-19",
//     doctor: "Dr. Sameer Patil",
//     reason: "Case Fees",
//     mode: "UPI",
//     amount: 11000,
//   },
//   {
//     date: "2025-09-27",
//     doctor: "Dr. Kavita Joshi",
//     reason: "Add-on cover",
//     mode: "UPI",
//     amount: 6000,
//   },
//   {
//     date: "2025-09-29",
//     doctor: "Dr. Nisha Rao",
//     reason: "Case Fees",
//     mode: "Bank",
//     amount: 9000,
//   },
// ];

// const dummyAdvocatePayouts = [
//   {
//     date: "2025-09-07",
//     person: "Adv. Priya Sharma",
//     role: "Advocate",
//     mode: "Bank",
//     amount: 10000,
//     details: "Case 21A drafting",
//   },
//   {
//     date: "2025-09-12",
//     person: "Adv. Sameer Patel",
//     role: "Advocate",
//     mode: "NEFT",
//     amount: 7000,
//     details: "Hearing appearance",
//   },
//   {
//     date: "2025-09-22",
//     person: "Adv. Rahul Verma",
//     role: "Advocate",
//     mode: "Bank",
//     amount: 9000,
//     details: "Final summary prep",
//   },
// ];

// const dummyExpertPayouts = [
//   {
//     date: "2025-09-08",
//     person: "Dr. V. Kulkarni",
//     role: "Expert",
//     mode: "UPI",
//     amount: 8000,
//     details: "Ortho opinion",
//   },
//   {
//     date: "2025-09-17",
//     person: "Dr. A. Deshpande",
//     role: "Expert",
//     mode: "Bank",
//     amount: 9500,
//     details: "Neuro affidavit",
//   },
//   {
//     date: "2025-09-24",
//     person: "Dr. M. Shah",
//     role: "Expert",
//     mode: "NEFT",
//     amount: 12000,
//     details: "Forensic review",
//   },
// ];

// const dummyFinanceTransactions = [
//   {
//     date: "2025-09-01",
//     category: "Revenue",
//     companyVendor: "Memberships",
//     details: "New/renewals (day 1)",
//     mode: "Bank",
//     amount: 120000,
//   },
//   {
//     date: "2025-09-01",
//     category: "Salary",
//     companyVendor: "Payroll",
//     details: "Telecallers",
//     mode: "Bank",
//     amount: -90000,
//   },
//   {
//     date: "2025-09-01",
//     category: "Salary",
//     companyVendor: "Payroll",
//     details: "Sales Team",
//     mode: "Bank",
//     amount: -140000,
//   },
//   {
//     date: "2025-09-01",
//     category: "Salary",
//     companyVendor: "Payroll",
//     details: "Admin & Ops",
//     mode: "Bank",
//     amount: -80000,
//   },
//   {
//     date: "2025-09-03",
//     category: "Insurance Payment",
//     companyVendor: "ICICI Lombard",
//     details: "Doctor PI bulk",
//     mode: "NEFT",
//     amount: -150000,
//   },
//   {
//     date: "2025-09-04",
//     category: "Marketing",
//     companyVendor: "Facebook Ads",
//     details: "Lead gen",
//     mode: "Card",
//     amount: -30000,
//   },
//   {
//     date: "2025-09-05",
//     category: "Revenue",
//     companyVendor: "Case Services",
//     details: "Advisory fees",
//     mode: "UPI",
//     amount: 45000,
//   },
//   {
//     date: "2025-09-06",
//     category: "Office Expense",
//     companyVendor: "Rent",
//     details: "September rent",
//     mode: "Bank",
//     amount: -60000,
//   },
//   {
//     date: "2025-09-08",
//     category: "Insurance Payment",
//     companyVendor: "CareShield Insurance",
//     details: "Hospital E&O",
//     mode: "Bank",
//     amount: -70000,
//   },
//   {
//     date: "2025-09-10",
//     category: "Office Expense",
//     companyVendor: "Utilities",
//     details: "Power + Internet",
//     mode: "UPI",
//     amount: -12000,
//   },
//   {
//     date: "2025-09-12",
//     category: "Revenue",
//     companyVendor: "Memberships",
//     details: "Batch renewal",
//     mode: "NEFT",
//     amount: 90000,
//   },
//   {
//     date: "2025-09-14",
//     category: "Commission",
//     companyVendor: "Channel Partner",
//     details: "Policy referrals",
//     mode: "NEFT",
//     amount: -25000,
//   },
//   {
//     date: "2025-09-18",
//     category: "Marketing",
//     companyVendor: "Google Ads",
//     details: "Search",
//     mode: "Card",
//     amount: -22000,
//   },
//   {
//     date: "2025-09-20",
//     category: "Revenue",
//     companyVendor: "Workshops",
//     details: "Medico-legal training",
//     mode: "Bank",
//     amount: 25000,
//   },
//   {
//     date: "2025-09-22",
//     category: "Insurance Payment",
//     companyVendor: "ICICI Lombard",
//     details: "Top-up covers",
//     mode: "Bank",
//     amount: -50000,
//   },
//   {
//     date: "2025-09-25",
//     category: "Refund",
//     companyVendor: "Dr. X",
//     details: "Membership refund",
//     mode: "Bank",
//     amount: -8000,
//   },
// ];

// function computeReportData(tab, filters) {
//   if (tab === "owner-snapshot") {
//     const filteredInflows = dummyDoctorInflows.filter((item) => {
//       const itemDate = new Date(item.date);
//       const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
//       const to = filters.dateTo ? new Date(filters.dateTo) : null;
//       const dateOk = (!from || itemDate >= from) && (!to || itemDate <= to);
//       const modeOk = filters.mode === "All" || item.mode === filters.mode;
//       const nameOk =
//         !filters.searchName ||
//         item.doctor.toLowerCase().includes(filters.searchName.toLowerCase());
//       let typeOk = true;
//       if (filters.paymentType !== "All") {
//         if (filters.paymentType === "Member")
//           typeOk = item.reason.includes("Membership");
//         else if (filters.paymentType === "Policy Payment")
//           typeOk =
//             item.reason.includes("Policy") || item.reason === "Add-on cover";
//         else if (filters.paymentType === "Case Fees")
//           typeOk = item.reason === "Case Fees";
//       }
//       return dateOk && modeOk && nameOk && typeOk;
//     });

//     const filterPayouts = (items) =>
//       items.filter((item) => {
//         const itemDate = new Date(item.date);
//         const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
//         const to = filters.dateTo ? new Date(filters.dateTo) : null;
//         const dateOk = (!from || itemDate >= from) && (!to || itemDate <= to);
//         const modeOk = filters.mode === "All" || item.mode === filters.mode;
//         const nameOk =
//           !filters.searchName ||
//           item.person.toLowerCase().includes(filters.searchName.toLowerCase());
//         return dateOk && modeOk && nameOk;
//       });

//     const filteredAdv = filterPayouts(dummyAdvocatePayouts);
//     const filteredExp = filterPayouts(dummyExpertPayouts);

//     const allItems = [
//       ...filteredInflows.map((i) => ({
//         date: i.date,
//         type: "Doctor Inflow",
//         name: i.doctor,
//         details: i.reason,
//         mode: i.mode,
//         amount: i.amount,
//       })),
//       ...filteredAdv.map((a) => ({
//         date: a.date,
//         type: "Advocate Payout",
//         name: a.person,
//         details: a.details,
//         mode: a.mode,
//         amount: -a.amount,
//       })),
//       ...filteredExp.map((e) => ({
//         date: e.date,
//         type: "Expert Payout",
//         name: e.person,
//         details: e.details,
//         mode: e.mode,
//         amount: -e.amount,
//       })),
//     ].sort((a, b) => new Date(a.date) - new Date(b.date));

//     const sum = (arr, key) => arr.reduce((s, i) => s + (i[key] || 0), 0);

//     const summary = {
//       fromDoctors: sum(filteredInflows, "amount"),
//       toAdvocates: sum(filteredAdv, "amount"),
//       toExperts: sum(filteredExp, "amount"),
//       net:
//         sum(filteredInflows, "amount") -
//         sum(filteredAdv, "amount") -
//         sum(filteredExp, "amount"),
//     };

//     return {
//       summary,
//       doctorInflows: filteredInflows,
//       payouts: { advocates: filteredAdv, experts: filteredExp },
//       allItems,
//     };
//   } else if (tab === "finance-dashboard") {
//     const filtered = dummyFinanceTransactions.filter((t) => {
//       const itemDate = new Date(t.date);
//       const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
//       const to = filters.dateTo ? new Date(filters.dateTo) : null;
//       const dateOk = (!from || itemDate >= from) && (!to || itemDate <= to);
//       const catOk =
//         filters.category === "All" || t.category === filters.category;
//       const vendorOk =
//         !filters.companyVendor ||
//         t.companyVendor
//           .toLowerCase()
//           .includes(filters.companyVendor.toLowerCase());
//       const modeOk =
//         filters.paymentMode === "All" || t.mode === filters.paymentMode;
//       return dateOk && catOk && vendorOk && modeOk;
//     });

//     const summary = {
//       revenue: filtered.reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0),
//       totalExpenses: filtered.reduce(
//         (s, t) => s + (t.amount < 0 ? -t.amount : 0),
//         0,
//       ),
//       insurancePaid: filtered.reduce(
//         (s, t) =>
//           s +
//           (t.category === "Insurance Payment" && t.amount < 0 ? -t.amount : 0),
//         0,
//       ),
//       net: filtered.reduce((s, t) => s + t.amount, 0),
//     };

//     const quickSnapshot = {
//       salaries: filtered.reduce(
//         (s, t) => s + (t.category === "Salary" ? -t.amount : 0),
//         0,
//       ),
//       otherExpenses: filtered.reduce(
//         (s, t) =>
//           s +
//           (t.category === "Office Expense" ||
//           t.category === "Marketing" ||
//           t.category === "Refund"
//             ? -t.amount
//             : 0),
//         0,
//       ),
//       commissions: filtered.reduce(
//         (s, t) => s + (t.category === "Commission" ? -t.amount : 0),
//         0,
//       ),
//     };

//     const insMap = {};
//     filtered.forEach((t) => {
//       if (t.category === "Insurance Payment" && t.amount < 0) {
//         insMap[t.companyVendor] = (insMap[t.companyVendor] || 0) + -t.amount;
//       }
//     });
//     const insuranceByCompany = Object.entries(insMap).map(
//       ([company, amount]) => ({ company, amount }),
//     );

//     const salMap = {};
//     filtered.forEach((t) => {
//       if (t.category === "Salary") {
//         const role = t.details;
//         salMap[role] = (salMap[role] || 0) + -t.amount;
//       }
//     });
//     const salaryByRole = Object.entries(salMap).map(([role, amount]) => ({
//       role,
//       amount,
//     }));

//     const dailyMap = {};
//     filtered.forEach((t) => {
//       dailyMap[t.date] = (dailyMap[t.date] || 0) + t.amount;
//     });

//     return {
//       summary,
//       quickSnapshot,
//       insuranceByCompany,
//       salaryByRole,
//       transactions: filtered.sort(
//         (a, b) => new Date(a.date) - new Date(b.date),
//       ),
//       dailyCashflow: dailyMap,
//     };
//   }
// }

// export default function MasterReportPage() {
//   const [activeTab, setActiveTab] = useState("owner-snapshot");
//   const [loading, setLoading] = useState(false);
//   const [reportData, setReportData] = useState(null);

//   const [ownerFilters, setOwnerFilters] = useState({
//     dateFrom: "",
//     dateTo: "",
//     paymentType: "All",
//     mode: "All",
//     searchName: "",
//   });

//   const [financeFilters, setFinanceFilters] = useState({
//     dateFrom: "",
//     dateTo: "",
//     category: "All",
//     companyVendor: "",
//     paymentMode: "All",
//   });

//   const updateReportData = (tab = activeTab) => {
//     setLoading(true);
//     try {
//       const filters = tab === "owner-snapshot" ? ownerFilters : financeFilters;
//       const data = computeReportData(tab, filters);
//       setReportData(data);
//     } catch (error) {
//       console.error("Error computing report data:", error);
//       toast.error("Failed to compute master report");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     updateReportData();
//   }, [activeTab]);

//   const handleOwnerFilterChange = (field, value) => {
//     setOwnerFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleFinanceFilterChange = (field, value) => {
//     setFinanceFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleResetOwner = () => {
//     setOwnerFilters({
//       dateFrom: "",
//       dateTo: "",
//       paymentType: "All",
//       mode: "All",
//       searchName: "",
//     });
//   };

//   const handleResetFinance = () => {
//     setFinanceFilters({
//       dateFrom: "",
//       dateTo: "",
//       category: "All",
//       companyVendor: "",
//       paymentMode: "All",
//     });
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(Math.abs(amount || 0));
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     return new Date(dateString).toLocaleDateString("en-GB");
//   };

//   const isPositive = (value) => (value || 0) >= 0;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="mb-8">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Master Reports</h1>
//             <p className="text-gray-600 mt-1">
//               Combined view — Doctor inflows, payouts (Advocates & Experts), and
//               Finance (budgets & payments)
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow transition-all">
//               <Download size={16} /> Export Excel
//             </button>
//             <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium shadow transition-all">
//               <Printer size={16} /> Print
//             </button>
//           </div>
//         </div>

//         <div className="flex border-b border-gray-200">
//           <button
//             onClick={() => {
//               setActiveTab("owner-snapshot");
//               updateReportData("owner-snapshot");
//             }}
//             className={`px-8 py-3.5 font-medium transition-all ${
//               activeTab === "owner-snapshot"
//                 ? "border-b-2 border-teal-600 text-teal-700 font-semibold bg-teal-50/30"
//                 : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//             }`}
//           >
//             Owner Snapshot
//           </button>
//           <button
//             onClick={() => {
//               setActiveTab("finance-dashboard");
//               updateReportData("finance-dashboard");
//             }}
//             className={`px-8 py-3.5 font-medium transition-all ${
//               activeTab === "finance-dashboard"
//                 ? "border-b-2 border-teal-600 text-teal-700 font-semibold bg-teal-50/30"
//                 : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//             }`}
//           >
//             Finance Dashboard
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center py-32">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//           <span className="ml-5 text-gray-700 font-medium text-lg">
//             Loading report data...
//           </span>
//         </div>
//       ) : activeTab === "owner-snapshot" ? (
//         <div className="space-y-8">
//           {/* Filters */}
//           <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
//               <div>
//                 <label className="block text-sm text-gray-600 font-medium mb-1.5">
//                   From
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={ownerFilters.dateFrom}
//                     onChange={(e) =>
//                       handleOwnerFilterChange("dateFrom", e.target.value)
//                     }
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                   />
//                   <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-600 font-medium mb-1.5">
//                   To
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={ownerFilters.dateTo}
//                     onChange={(e) =>
//                       handleOwnerFilterChange("dateTo", e.target.value)
//                     }
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                   />
//                   <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-600 font-medium mb-1.5">
//                   Payment Type
//                 </label>
//                 <select
//                   value={ownerFilters.paymentType}
//                   onChange={(e) =>
//                     handleOwnerFilterChange("paymentType", e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                 >
//                   <option>All</option>
//                   <option>Member</option>
//                   <option>Policy Payment</option>
//                   <option>Case Fees</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-600 font-medium mb-1.5">
//                   Mode
//                 </label>
//                 <select
//                   value={ownerFilters.mode}
//                   onChange={(e) =>
//                     handleOwnerFilterChange("mode", e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                 >
//                   <option>All</option>
//                   <option>Bank</option>
//                   <option>UPI</option>
//                   <option>Cash</option>
//                   <option>NEFT</option>
//                   <option>Card</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-600 font-medium mb-1.5">
//                   Doctor/Advocate/Expert
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Search name"
//                   value={ownerFilters.searchName}
//                   onChange={(e) =>
//                     handleOwnerFilterChange("searchName", e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-4 mt-6">
//               <button
//                 onClick={() => updateReportData("owner-snapshot")}
//                 className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm transition-all"
//               >
//                 Apply
//               </button>
//               <button
//                 onClick={handleResetOwner}
//                 className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium border border-gray-300 transition-all"
//               >
//                 Reset
//               </button>
//             </div>
//           </div>

//           {/* Summary Cards */}
//           {reportData?.summary && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-md transition-shadow">
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-sm font-medium text-gray-600">
//                     Doctor Inflows
//                   </span>
//                   <TrendingUp size={20} className="text-green-600" />
//                 </div>
//                 <div className="text-3xl font-bold text-gray-900">
//                   {formatCurrency(reportData.summary.fromDoctors)}
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-md transition-shadow">
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-sm font-medium text-gray-600">
//                     Advocate Payouts
//                   </span>
//                   <TrendingDown size={20} className="text-red-600" />
//                 </div>
//                 <div className="text-3xl font-bold text-gray-900">
//                   {formatCurrency(reportData.summary.toAdvocates)}
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-md transition-shadow">
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-sm font-medium text-gray-600">
//                     Expert Payouts
//                   </span>
//                   <TrendingDown size={20} className="text-red-600" />
//                 </div>
//                 <div className="text-3xl font-bold text-gray-900">
//                   {formatCurrency(reportData.summary.toExperts)}
//                 </div>
//               </div>

//               <div
//                 className={`rounded-xl shadow border p-6 hover:shadow-md transition-shadow ${
//                   isPositive(reportData.summary.net)
//                     ? "bg-green-50 border-green-200"
//                     : "bg-red-50 border-red-200"
//                 }`}
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-sm font-medium text-gray-700">
//                     Net (Doctors – Payouts)
//                   </span>
//                   <ArrowRightLeft
//                     size={20}
//                     className={
//                       isPositive(reportData.summary.net)
//                         ? "text-green-600"
//                         : "text-red-600"
//                     }
//                   />
//                 </div>
//                 <div
//                   className={`text-3xl font-extrabold ${
//                     isPositive(reportData.summary.net)
//                       ? "text-green-700"
//                       : "text-red-700"
//                   }`}
//                 >
//                   {isPositive(reportData.summary.net) ? "+" : "-"}
//                   {formatCurrency(reportData.summary.net)}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Side-by-side Tables */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Doctor Inflows */}
//             <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col">
//               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Doctor Inflows{" "}
//                   <span className="text-sm font-normal text-gray-500 ml-2">
//                     ({reportData?.doctorInflows?.length || 0})
//                   </span>
//                 </h3>
//               </div>
//               <div className="overflow-auto flex-1">
//                 <table className="w-full min-w-[480px] border-collapse">
//                   <thead>
//                     <tr className="bg-[#ddfff5] border-b border-gray-300">
//                       <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                         Doctor
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                         Reason
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                         Mode
//                       </th>
//                       <th className="px-6 py-4 text-right text-xs font-bold text-green-700 uppercase tracking-wider">
//                         Amount
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {reportData?.doctorInflows?.map((item, index) => (
//                       <tr
//                         key={index}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 text-sm text-gray-700">
//                           {formatDate(item.date)}
//                         </td>
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                           {item.doctor}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700">
//                           {item.reason}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700">
//                           {item.mode}
//                         </td>
//                         <td className="px-6 py-4 text-right font-medium text-green-600">
//                           +{formatCurrency(item.amount)}
//                         </td>
//                       </tr>
//                     ))}
//                     {(!reportData?.doctorInflows ||
//                       reportData.doctorInflows.length === 0) && (
//                       <tr>
//                         <td
//                           colSpan="5"
//                           className="px-6 py-16 text-center text-gray-500 italic"
//                         >
//                           No inflows found in selected period
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Payouts */}
//             <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col">
//               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Payouts{" "}
//                   <span className="text-sm font-normal text-gray-500 ml-2">
//                     (Adv: {reportData?.payouts?.advocates?.length || 0} | Exp:{" "}
//                     {reportData?.payouts?.experts?.length || 0})
//                   </span>
//                 </h3>
//               </div>
//               <div className="overflow-auto flex-1">
//                 <table className="w-full min-w-[480px] border-collapse">
//                   <thead>
//                     <tr className="bg-[#ddfff5] border-b border-gray-300">
//                       <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                         Person
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                         Role
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                         Mode
//                       </th>
//                       <th className="px-6 py-4 text-right text-xs font-bold text-green-700 uppercase tracking-wider">
//                         Amount
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {reportData?.payouts?.advocates?.map((item, index) => (
//                       <tr
//                         key={`adv-${index}`}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 text-sm text-gray-700">
//                           {formatDate(item.date)}
//                         </td>
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                           {item.person}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700">
//                           {item.role}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700">
//                           {item.mode}
//                         </td>
//                         <td className="px-6 py-4 text-right font-medium text-red-600">
//                           -{formatCurrency(item.amount)}
//                         </td>
//                       </tr>
//                     ))}
//                     {reportData?.payouts?.experts?.map((item, index) => (
//                       <tr
//                         key={`exp-${index}`}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 text-sm text-gray-700">
//                           {formatDate(item.date)}
//                         </td>
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                           {item.person}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700">
//                           {item.role}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700">
//                           {item.mode}
//                         </td>
//                         <td className="px-6 py-4 text-right font-medium text-red-600">
//                           -{formatCurrency(item.amount)}
//                         </td>
//                       </tr>
//                     ))}
//                     {!reportData?.payouts?.advocates?.length &&
//                       !reportData?.payouts?.experts?.length && (
//                         <tr>
//                           <td
//                             colSpan="5"
//                             className="px-6 py-16 text-center text-gray-500 italic"
//                           >
//                             No payouts found in selected period
//                           </td>
//                         </tr>
//                       )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* All Items */}
//           <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 All Items (Filtered){" "}
//                 <span className="text-sm font-normal text-gray-500 ml-2">
//                   ({reportData?.allItems?.length || 0} items)
//                 </span>
//               </h3>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[900px] border-collapse">
//                 <thead>
//                   <tr className="bg-[#ddfff5] border-b border-gray-300">
//                     <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                       Type
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                       Details
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
//                       Mode
//                     </th>
//                     <th className="px-6 py-4 text-right text-xs font-bold text-green-700 uppercase tracking-wider">
//                       Amount
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {reportData?.allItems?.map((item, index) => (
//                     <tr
//                       key={index}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4 text-sm text-gray-700">
//                         {formatDate(item.date)}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-700">
//                         {item.type}
//                       </td>
//                       <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                         {item.name}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-700">
//                         {item.details}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-700">
//                         {item.mode}
//                       </td>
//                       <td
//                         className={`px-6 py-4 text-right font-medium ${
//                           item.amount >= 0 ? "text-green-600" : "text-red-600"
//                         }`}
//                       >
//                         {item.amount >= 0 ? "+" : ""}
//                         {formatCurrency(item.amount)}
//                       </td>
//                     </tr>
//                   ))}
//                   {(!reportData?.allItems ||
//                     reportData.allItems.length === 0) && (
//                     <tr>
//                       <td
//                         colSpan="6"
//                         className="px-6 py-16 text-center text-gray-500 italic"
//                       >
//                         No transactions match the selected filters
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div>
//           <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
//             <p className="text-center text-gray-500 py-10">
//               Finance Dashboard view (placeholder)
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }












// src/pages/Admin/Report/MasterReportPage.jsx



import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Calendar,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
} from "lucide-react";

const dummyDoctorInflows = [
  {
    date: "2025-09-01",
    doctor: "Dr. Amit Sharma",
    reason: "Membership Renewal",
    mode: "Bank",
    amount: 15000,
  },
  {
    date: "2025-09-02",
    doctor: "Dr. Nisha Rao",
    reason: "Policy Premium (Rapid)",
    mode: "UPI",
    amount: 12000,
  },
  {
    date: "2025-09-05",
    doctor: "Dr. Kavita Joshi",
    reason: "Case Fees",
    mode: "NEFT",
    amount: 18000,
  },
  {
    date: "2025-09-10",
    doctor: "Dr. Rahul Verma",
    reason: "Membership New",
    mode: "Cash",
    amount: 14000,
  },
  {
    date: "2025-09-14",
    doctor: "Dr. Priya Mehta",
    reason: "Policy Premium (Care)",
    mode: "Bank",
    amount: 16000,
  },
  {
    date: "2025-09-19",
    doctor: "Dr. Sameer Patil",
    reason: "Case Fees",
    mode: "UPI",
    amount: 11000,
  },
  {
    date: "2025-09-27",
    doctor: "Dr. Kavita Joshi",
    reason: "Add-on cover",
    mode: "UPI",
    amount: 6000,
  },
  {
    date: "2025-09-29",
    doctor: "Dr. Nisha Rao",
    reason: "Case Fees",
    mode: "Bank",
    amount: 9000,
  },
];

const dummyAdvocatePayouts = [
  {
    date: "2025-09-07",
    person: "Adv. Priya Sharma",
    role: "Advocate",
    mode: "Bank",
    amount: 10000,
    details: "Case 21A drafting",
  },
  {
    date: "2025-09-12",
    person: "Adv. Sameer Patel",
    role: "Advocate",
    mode: "NEFT",
    amount: 7000,
    details: "Hearing appearance",
  },
  {
    date: "2025-09-22",
    person: "Adv. Rahul Verma",
    role: "Advocate",
    mode: "Bank",
    amount: 9000,
    details: "Final summary prep",
  },
];

const dummyExpertPayouts = [
  {
    date: "2025-09-08",
    person: "Dr. V. Kulkarni",
    role: "Expert",
    mode: "UPI",
    amount: 8000,
    details: "Ortho opinion",
  },
  {
    date: "2025-09-17",
    person: "Dr. A. Deshpande",
    role: "Expert",
    mode: "Bank",
    amount: 9500,
    details: "Neuro affidavit",
  },
  {
    date: "2025-09-24",
    person: "Dr. M. Shah",
    role: "Expert",
    mode: "NEFT",
    amount: 12000,
    details: "Forensic review",
  },
];

const dummyFinanceTransactions = [
  {
    date: "2025-09-01",
    category: "Revenue",
    companyVendor: "Memberships",
    details: "New/renewals (day 1)",
    mode: "Bank",
    amount: 120000,
  },
  {
    date: "2025-09-01",
    category: "Salary",
    companyVendor: "Payroll",
    details: "Telecallers",
    mode: "Bank",
    amount: -90000,
  },
  {
    date: "2025-09-01",
    category: "Salary",
    companyVendor: "Payroll",
    details: "Sales Team",
    mode: "Bank",
    amount: -140000,
  },
  {
    date: "2025-09-01",
    category: "Salary",
    companyVendor: "Payroll",
    details: "Admin & Ops",
    mode: "Bank",
    amount: -80000,
  },
  {
    date: "2025-09-03",
    category: "Insurance Payment",
    companyVendor: "ICICI Lombard",
    details: "Doctor PI bulk",
    mode: "NEFT",
    amount: -150000,
  },
  {
    date: "2025-09-04",
    category: "Marketing",
    companyVendor: "Facebook Ads",
    details: "Lead gen",
    mode: "Card",
    amount: -30000,
  },
  {
    date: "2025-09-05",
    category: "Revenue",
    companyVendor: "Case Services",
    details: "Advisory fees",
    mode: "UPI",
    amount: 45000,
  },
  {
    date: "2025-09-06",
    category: "Office Expense",
    companyVendor: "Rent",
    details: "September rent",
    mode: "Bank",
    amount: -60000,
  },
  {
    date: "2025-09-08",
    category: "Insurance Payment",
    companyVendor: "CareShield Insurance",
    details: "Hospital E&O",
    mode: "Bank",
    amount: -70000,
  },
  {
    date: "2025-09-10",
    category: "Office Expense",
    companyVendor: "Utilities",
    details: "Power + Internet",
    mode: "UPI",
    amount: -12000,
  },
  {
    date: "2025-09-12",
    category: "Revenue",
    companyVendor: "Memberships",
    details: "Batch renewal",
    mode: "NEFT",
    amount: 90000,
  },
  {
    date: "2025-09-14",
    category: "Commission",
    companyVendor: "Channel Partner",
    details: "Policy referrals",
    mode: "NEFT",
    amount: -25000,
  },
  {
    date: "2025-09-18",
    category: "Marketing",
    companyVendor: "Google Ads",
    details: "Search",
    mode: "Card",
    amount: -22000,
  },
  {
    date: "2025-09-20",
    category: "Revenue",
    companyVendor: "Workshops",
    details: "Medico-legal training",
    mode: "Bank",
    amount: 25000,
  },
  {
    date: "2025-09-22",
    category: "Insurance Payment",
    companyVendor: "ICICI Lombard",
    details: "Top-up covers",
    mode: "Bank",
    amount: -50000,
  },
  {
    date: "2025-09-25",
    category: "Refund",
    companyVendor: "Dr. X",
    details: "Membership refund",
    mode: "Bank",
    amount: -8000,
  },
];

function computeReportData(tab, filters) {
  if (tab === "owner-snapshot") {
    const filteredInflows = dummyDoctorInflows.filter((item) => {
      const itemDate = new Date(item.date);
      const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const to = filters.dateTo ? new Date(filters.dateTo) : null;
      const dateOk = (!from || itemDate >= from) && (!to || itemDate <= to);
      const modeOk = filters.mode === "All" || item.mode === filters.mode;
      const nameOk =
        !filters.searchName ||
        item.doctor.toLowerCase().includes(filters.searchName.toLowerCase());
      let typeOk = true;
      if (filters.paymentType !== "All") {
        if (filters.paymentType === "Member")
          typeOk = item.reason.includes("Membership");
        else if (filters.paymentType === "Policy Payment")
          typeOk =
            item.reason.includes("Policy") || item.reason === "Add-on cover";
        else if (filters.paymentType === "Case Fees")
          typeOk = item.reason === "Case Fees";
      }
      return dateOk && modeOk && nameOk && typeOk;
    });

    const filterPayouts = (items) =>
      items.filter((item) => {
        const itemDate = new Date(item.date);
        const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
        const to = filters.dateTo ? new Date(filters.dateTo) : null;
        const dateOk = (!from || itemDate >= from) && (!to || itemDate <= to);
        const modeOk = filters.mode === "All" || item.mode === filters.mode;
        const nameOk =
          !filters.searchName ||
          item.person.toLowerCase().includes(filters.searchName.toLowerCase());
        return dateOk && modeOk && nameOk;
      });

    const filteredAdv = filterPayouts(dummyAdvocatePayouts);
    const filteredExp = filterPayouts(dummyExpertPayouts);

    const allItems = [
      ...filteredInflows.map((i) => ({
        date: i.date,
        type: "Doctor Inflow",
        name: i.doctor,
        details: i.reason,
        mode: i.mode,
        amount: i.amount,
      })),
      ...filteredAdv.map((a) => ({
        date: a.date,
        type: "Advocate Payout",
        name: a.person,
        details: a.details,
        mode: a.mode,
        amount: -a.amount,
      })),
      ...filteredExp.map((e) => ({
        date: e.date,
        type: "Expert Payout",
        name: e.person,
        details: e.details,
        mode: e.mode,
        amount: -e.amount,
      })),
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    const sum = (arr, key) => arr.reduce((s, i) => s + (i[key] || 0), 0);

    const summary = {
      fromDoctors: sum(filteredInflows, "amount"),
      toAdvocates: sum(filteredAdv, "amount"),
      toExperts: sum(filteredExp, "amount"),
      net:
        sum(filteredInflows, "amount") -
        sum(filteredAdv, "amount") -
        sum(filteredExp, "amount"),
    };

    return {
      summary,
      doctorInflows: filteredInflows,
      payouts: { advocates: filteredAdv, experts: filteredExp },
      allItems,
    };
  } else if (tab === "finance-dashboard") {
    const filtered = dummyFinanceTransactions.filter((t) => {
      const itemDate = new Date(t.date);
      const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const to = filters.dateTo ? new Date(filters.dateTo) : null;
      const dateOk = (!from || itemDate >= from) && (!to || itemDate <= to);
      const catOk =
        filters.category === "All" || t.category === filters.category;
      const vendorOk =
        !filters.companyVendor ||
        t.companyVendor
          .toLowerCase()
          .includes(filters.companyVendor.toLowerCase());
      const modeOk =
        filters.paymentMode === "All" || t.mode === filters.paymentMode;
      return dateOk && catOk && vendorOk && modeOk;
    });

    const summary = {
      revenue: filtered.reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0),
      totalExpenses: filtered.reduce(
        (s, t) => s + (t.amount < 0 ? -t.amount : 0),
        0,
      ),
      insurancePaid: filtered.reduce(
        (s, t) =>
          s +
          (t.category === "Insurance Payment" && t.amount < 0 ? -t.amount : 0),
        0,
      ),
      net: filtered.reduce((s, t) => s + t.amount, 0),
    };

    const quickSnapshot = {
      salaries: filtered.reduce(
        (s, t) => s + (t.category === "Salary" ? -t.amount : 0),
        0,
      ),
      otherExpenses: filtered.reduce(
        (s, t) =>
          s +
          (t.category === "Office Expense" ||
          t.category === "Marketing" ||
          t.category === "Refund"
            ? -t.amount
            : 0),
        0,
      ),
      commissions: filtered.reduce(
        (s, t) => s + (t.category === "Commission" ? -t.amount : 0),
        0,
      ),
    };

    const insMap = {};
    filtered.forEach((t) => {
      if (t.category === "Insurance Payment" && t.amount < 0) {
        insMap[t.companyVendor] = (insMap[t.companyVendor] || 0) + -t.amount;
      }
    });
    const insuranceByCompany = Object.entries(insMap).map(
      ([company, amount]) => ({ company, amount }),
    );

    const salMap = {};
    filtered.forEach((t) => {
      if (t.category === "Salary") {
        const role = t.details;
        salMap[role] = (salMap[role] || 0) + -t.amount;
      }
    });
    const salaryByRole = Object.entries(salMap).map(([role, amount]) => ({
      role,
      amount,
    }));

    const dailyMap = {};
    filtered.forEach((t) => {
      dailyMap[t.date] = (dailyMap[t.date] || 0) + t.amount;
    });

    return {
      summary,
      quickSnapshot,
      insuranceByCompany,
      salaryByRole,
      transactions: filtered.sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      ),
      dailyCashflow: dailyMap,
    };
  }
}

export default function MasterReportPage() {
  const [activeTab, setActiveTab] = useState("owner-snapshot");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const [ownerFilters, setOwnerFilters] = useState({
    dateFrom: "",
    dateTo: "",
    paymentType: "All",
    mode: "All",
    searchName: "",
  });

  const [financeFilters, setFinanceFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "All",
    companyVendor: "",
    paymentMode: "All",
  });

  const updateReportData = (tab = activeTab) => {
    setLoading(true);
    try {
      const filters = tab === "owner-snapshot" ? ownerFilters : financeFilters;
      const data = computeReportData(tab, filters);
      setReportData(data);
    } catch (error) {
      console.error("Error computing report data:", error);
      toast.error("Failed to compute master report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateReportData();
  }, [activeTab]);

  const handleOwnerFilterChange = (field, value) => {
    setOwnerFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinanceFilterChange = (field, value) => {
    setFinanceFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetOwner = () => {
    setOwnerFilters({
      dateFrom: "",
      dateTo: "",
      paymentType: "All",
      mode: "All",
      searchName: "",
    });
  };

  const handleResetFinance = () => {
    setFinanceFilters({
      dateFrom: "",
      dateTo: "",
      category: "All",
      companyVendor: "",
      paymentMode: "All",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.abs(amount || 0));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const isPositive = (value) => (value || 0) >= 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Master Reports</h1>
            <p className="text-gray-600 mt-1">
              Combined view — Doctor inflows, payouts (Advocates & Experts), and
              Finance (budgets & payments)
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow transition-all">
              <Download size={16} /> Export Excel
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium shadow transition-all">
              <Printer size={16} /> Print
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab("owner-snapshot");
              updateReportData("owner-snapshot");
            }}
            className={`px-8 py-3.5 font-medium transition-all ${
              activeTab === "owner-snapshot"
                ? "border-b-2 border-teal-600 text-teal-700 font-semibold bg-teal-50/30"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Owner Snapshot
          </button>
          <button
            onClick={() => {
              setActiveTab("finance-dashboard");
              updateReportData("finance-dashboard");
            }}
            className={`px-8 py-3.5 font-medium transition-all ${
              activeTab === "finance-dashboard"
                ? "border-b-2 border-teal-600 text-teal-700 font-semibold bg-teal-50/30"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Finance Dashboard
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <span className="ml-5 text-gray-700 font-medium text-lg">
            Loading report data...
          </span>
        </div>
      ) : activeTab === "owner-snapshot" ? (
        <div className="space-y-8">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  From
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={ownerFilters.dateFrom}
                    onChange={(e) =>
                      handleOwnerFilterChange("dateFrom", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" /> */}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  To
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={ownerFilters.dateTo}
                    onChange={(e) =>
                      handleOwnerFilterChange("dateTo", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" /> */}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Payment Type
                </label>
                <select
                  value={ownerFilters.paymentType}
                  onChange={(e) =>
                    handleOwnerFilterChange("paymentType", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option>All</option>
                  <option>Member</option>
                  <option>Policy Payment</option>
                  <option>Case Fees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Mode
                </label>
                <select
                  value={ownerFilters.mode}
                  onChange={(e) =>
                    handleOwnerFilterChange("mode", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Doctor/Advocate/Expert
                </label>
                <input
                  type="text"
                  placeholder="Search name"
                  value={ownerFilters.searchName}
                  onChange={(e) =>
                    handleOwnerFilterChange("searchName", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => updateReportData("owner-snapshot")}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm transition-all"
              >
                Apply
              </button>
              <button
                onClick={handleResetOwner}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium border border-gray-300 transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          {reportData?.summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Doctor Inflows
                  </span>
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.fromDoctors)}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Advocate Payouts
                  </span>
                  <TrendingDown size={20} className="text-red-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.toAdvocates)}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Expert Payouts
                  </span>
                  <TrendingDown size={20} className="text-red-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.toExperts)}
                </div>
              </div>

              <div
                className={`rounded-xl shadow border p-6 hover:shadow-md transition-shadow ${
                  isPositive(reportData.summary.net)
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Net (Doctors – Payouts)
                  </span>
                  <ArrowRightLeft
                    size={20}
                    className={
                      isPositive(reportData.summary.net)
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  />
                </div>
                <div
                  className={`text-3xl font-extrabold ${
                    isPositive(reportData.summary.net)
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {isPositive(reportData.summary.net) ? "+" : "-"}
                  {formatCurrency(reportData.summary.net)}
                </div>
              </div>
            </div>
          )}

          {/* Side-by-side Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Doctor Inflows */}
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Doctor Inflows{" "}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({reportData?.doctorInflows?.length || 0})
                  </span>
                </h3>
              </div>
              <div className="overflow-auto flex-1">
                <table className="w-full min-w-[480px] border-collapse">
                  <thead>
                    <tr className="bg-[#ddfff5] border-b border-gray-300">
                      <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                        Mode
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-green-700 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData?.doctorInflows?.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {item.doctor}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.reason}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.mode}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-green-600">
                          +{formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    {(!reportData?.doctorInflows ||
                      reportData.doctorInflows.length === 0) && (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-16 text-center text-gray-500 italic"
                        >
                          No inflows found in selected period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payouts */}
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Payouts{" "}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Adv: {reportData?.payouts?.advocates?.length || 0} | Exp:{" "}
                    {reportData?.payouts?.experts?.length || 0})
                  </span>
                </h3>
              </div>
              <div className="overflow-auto flex-1">
                <table className="w-full min-w-[480px] border-collapse">
                  <thead>
                    <tr className="bg-[#ddfff5] border-b border-gray-300">
                      <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                        Person
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                        Mode
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-green-700 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData?.payouts?.advocates?.map((item, index) => (
                      <tr
                        key={`adv-${index}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {item.person}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.role}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.mode}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-red-600">
                          -{formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    {reportData?.payouts?.experts?.map((item, index) => (
                      <tr
                        key={`exp-${index}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {item.person}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.role}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.mode}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-red-600">
                          -{formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    {!reportData?.payouts?.advocates?.length &&
                      !reportData?.payouts?.experts?.length && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-16 text-center text-gray-500 italic"
                          >
                            No payouts found in selected period
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* All Items */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                All Items (Filtered){" "}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({reportData?.allItems?.length || 0} items)
                </span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-[#ddfff5] border-b border-gray-300">
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-green-700 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reportData?.allItems?.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.details}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.mode}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-medium ${
                          item.amount >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.amount >= 0 ? "+" : ""}
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                  {(!reportData?.allItems ||
                    reportData.allItems.length === 0) && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-16 text-center text-gray-500 italic"
                      >
                        No transactions match the selected filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  From
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={financeFilters.dateFrom}
                    onChange={(e) =>
                      setFinanceFilters((prev) => ({
                        ...prev,
                        dateFrom: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" /> */}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  To
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={financeFilters.dateTo}
                    onChange={(e) =>
                      setFinanceFilters((prev) => ({
                        ...prev,
                        dateTo: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" /> */}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Category
                </label>
                <select
                  value={financeFilters.category}
                  onChange={(e) =>
                    setFinanceFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Company/Vendor
                </label>
                <input
                  type="text"
                  placeholder="ICICI, Rent, ..."
                  value={financeFilters.companyVendor}
                  onChange={(e) =>
                    setFinanceFilters((prev) => ({
                      ...prev,
                      companyVendor: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">
                  Payment Mode
                </label>
                <select
                  value={financeFilters.paymentMode}
                  onChange={(e) =>
                    setFinanceFilters((prev) => ({
                      ...prev,
                      paymentMode: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => updateReportData("finance-dashboard")}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm transition-all"
              >
                Apply
              </button>
              <button
                onClick={handleResetFinance}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium border border-gray-300 transition-all"
              >
                Reset
              </button>
              {/* <button
                onClick={() => toast.info("Exported CSV")}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-sm transition-all"
              >
                Export CSV
              </button> */}
            </div>
          </div>

          {/* Summary Cards */}
          {reportData?.summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Revenue
                  </span>
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.revenue)}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Total Expenses
                  </span>
                  <TrendingDown size={20} className="text-red-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.totalExpenses)}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Insurance Paid
                  </span>
                  <TrendingDown size={20} className="text-red-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.insurancePaid)}
                </div>
              </div>

              <div
                className={`rounded-xl shadow border p-6 hover:shadow-md transition-shadow ${
                  isPositive(reportData.summary.net)
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Net (Rev - Exp)
                  </span>
                  <ArrowRightLeft
                    size={20}
                    className={
                      isPositive(reportData.summary.net)
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  />
                </div>
                <div
                  className={`text-3xl font-extrabold ${
                    isPositive(reportData.summary.net)
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {isPositive(reportData.summary.net) ? "+" : "-"}
                  {formatCurrency(reportData.summary.net)}
                </div>
              </div>
            </div>
          )}

          {/* Cashflow (Daily) + Quick Snapshot - side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cashflow (Daily) */}
            {reportData?.dailyCashflow && (
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cashflow (Daily)
                  </h3>
                  <span className="text-sm text-gray-500">
                    {financeFilters.dateFrom || "01/09/2025"} →{" "}
                    {financeFilters.dateTo || "30/09/2025"}
                  </span>
                </div>
                <div className="relative h-48 bg-gray-50 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-end justify-around px-4 pb-6 gap-1">
                    {Object.entries(reportData.dailyCashflow)
                      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
                      .map(([date, value], index) => {
                        const height =
                          Math.min(Math.abs(value) / 50000, 1) * 100;
                        const isPositive = value >= 0;
                        return (
                          <div
                            key={date}
                            className="flex flex-col items-center"
                            style={{ width: "6%" }}
                          >
                            <div
                              className={`w-full rounded-t ${
                                isPositive ? "bg-green-500" : "bg-red-500"
                              }`}
                              style={{
                                height: `${height}%`,
                                minHeight: value === 0 ? "2px" : `${height}%`,
                              }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-1">
                              {date.split("-")[2]}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Positive = inflow (revenue), Negative = outflow (expenses)
                </p>
              </div>
            )}

            {/* Quick Snapshot */}
            {reportData?.quickSnapshot && (
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Snapshot
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      Salaries
                    </div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      {formatCurrency(reportData.quickSnapshot.salaries)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      Other Expenses
                    </div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      {formatCurrency(reportData.quickSnapshot.otherExpenses)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      Commissions
                    </div>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      {formatCurrency(reportData.quickSnapshot.commissions)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Insurance Payments by Company + Salary by Role - side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insurance Payments by Company */}
            {reportData?.insuranceByCompany?.length > 0 && (
              <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Insurance Payments by Company
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#ddfff5] border-b border-gray-300">
                        <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-green-700 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {reportData.insuranceByCompany.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {item.company}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-red-600">
                            -{formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Salary by Role */}
            {reportData?.salaryByRole?.length > 0 && (
              <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Salary by Role
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#ddfff5] border-b border-gray-300">
                        <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-green-700 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {reportData.salaryByRole.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {item.role}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-red-600">
                            {formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Transactions ({reportData?.transactions?.length || 0} items)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-[#ddfff5] border-b border-gray-300">
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                      Company / Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-green-700 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reportData?.transactions?.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            item.category === "Revenue"
                              ? "bg-green-100 text-green-800"
                              : item.category === "Salary"
                                ? "bg-blue-100 text-blue-800"
                                : item.category === "Insurance Payment"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : item.category === "Marketing"
                                    ? "bg-orange-100 text-orange-800"
                                    : item.category === "Office Expense"
                                      ? "bg-gray-100 text-gray-800"
                                      : item.category === "Commission"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.companyVendor}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.details}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.mode}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-red-600">
                        {item.amount < 0 ? "-" : "+"}
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                  {(!reportData?.transactions ||
                    reportData.transactions.length === 0) && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-16 text-center text-gray-500 italic"
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
