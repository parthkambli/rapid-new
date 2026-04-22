


// import React, { useState, useEffect } from "react";
// import { useAuth } from '../../hooks/useAuth';
// import Chart from "react-apexcharts";
// import RenewalActionModal from "../../components/modals/RenewalActionModal";
// import { useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from '../../services/apiClient';

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const { token } = useAuth();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedAlert, setSelectedAlert] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // New API data states
//   const [monthlyDoctors, setMonthlyDoctors] = useState(0);
//   const [yearlyDoctors, setYearlyDoctors] = useState(0);
//   const [salesmanDoctorCount, setSalesmanDoctorCount] = useState(0);
//   const [telecallerDoctorCount, setTelecallerDoctorCount] = useState(0);

//   // Pagination states for Renewal Reminder
//   const [renewalCurrentPage, setRenewalCurrentPage] = useState(1);
//   const [renewalRowsPerPage, setRenewalRowsPerPage] = useState(5);

//   // Pagination states for Monthly Payment Reminder
//   const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
//   const [paymentRowsPerPage, setPaymentRowsPerPage] = useState(5);

//   // Filter state for monthly payment reminders
//   const [paymentFilter, setPaymentFilter] = useState('all'); // 'all', 'upcoming', 'overdue'

//   const API_BASE_URL = import.meta.env.VITE_API_URI;

//   // Skeleton Loader Component
//   const Skeleton = ({ className }) => (
//     <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
//   );

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);

//       // Execute all requests in parallel
//       const [
//         dashboardRes,
//         monthlyRes,
//         yearlyRes,
//         salesmanRes,
//         telecallerRes,
//         monthlyPaymentRemindersRes
//       ] = await Promise.all([
//         fetch(`${API_BASE_URL}/admin/dashboard`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         }),
//         apiClient.get(apiEndpoints.adminDashboard.monthlyDoctors),
//         apiClient.get(apiEndpoints.adminDashboard.yearlyDoctors),
//         apiClient.get(apiEndpoints.adminDashboard.salesmanDoctors),
//         apiClient.get(apiEndpoints.adminDashboard.telecallerDoctors),
//         apiClient.get(apiEndpoints.adminDashboard.monthlyPaymentReminders)
//       ]);

//       // Handle Main Dashboard Data
//       if (!dashboardRes.ok) {
//         throw new Error(`HTTP error! status: ${dashboardRes.status}`);
//       }
//       const dashboardResult = await dashboardRes.json();
//       if (dashboardResult.success) {
//         // Override the monthlyPaymentReminder data with data from the receipt module
//         const monthlyPaymentReminderData = monthlyPaymentRemindersRes.data?.success
//           ? monthlyPaymentRemindersRes.data.data
//           : [];

//         // Update the dashboard data with the receipt-based monthly payment reminders
//         setDashboardData({
//           ...dashboardResult.data,
//           monthlyPaymentReminder: monthlyPaymentReminderData
//         });
//       } else {
//         throw new Error(dashboardResult.message || 'Failed to fetch dashboard data');
//       }

//       // Handle Concurrent API Data
//       if (monthlyRes.data?.success) setMonthlyDoctors(monthlyRes.data.totalCount || 0);
//       if (yearlyRes.data?.success) setYearlyDoctors(yearlyRes.data.totalCount || 0);
//       if (salesmanRes.data?.success) setSalesmanDoctorCount(salesmanRes.data.totalCount || 0);
//       if (telecallerRes.data?.success) setTelecallerDoctorCount(telecallerRes.data.totalCount || 0);

//       // Handle monthly payment reminders data
//       if (monthlyPaymentRemindersRes.data?.success) {
//         // Update the dashboard data with the receipt-based monthly payment reminders
//         setDashboardData(prevData => ({
//           ...prevData,
//           monthlyPaymentReminder: monthlyPaymentRemindersRes.data.data || []
//         }));
//       } else {
//         // If the API call failed, still update with empty array to avoid issues
//         setDashboardData(prevData => ({
//           ...prevData,
//           monthlyPaymentReminder: []
//         }));
//       }

//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching dashboard data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, [token]);

//   const handleRenewClick = (alert) => {
//     // Check if this is a payment reminder (has receiptId) or renewal reminder
//     if (alert.receiptId) {
//       // This is a payment reminder, navigate to create receipt page with SB No. for auto-fill
//       const sbNo = alert.salesBillInfo?.sbNo || alert.sbNo;
//       if (sbNo) {
//         navigate(`/admin/create-receipt?refCode=${encodeURIComponent(sbNo)}`);
//       } else {
//         // Fallback to edit receipt if no SB No. is available
//         navigate(`/admin/edit-receipt/${alert.receiptId}`);
//       }
//     } else {
//       // This is a renewal reminder, open modal
//       setSelectedAlert(alert);
//       setIsModalOpen(true);
//     }
//   };




//   // Handle stats card click
//   const handleStatsClick = (status) => {
//     navigate(`/admin/doctor-list?status=${status.toLowerCase()}`);
//   };


//   const handleMembershipClick = (membershipType) => {
//     navigate(`/admin/doctor-list?membership=${membershipType.toLowerCase().replace(/\s+/g, '_')}`);
//   };


//   const handleModalSuccess = () => {
//     fetchDashboardData(); // Refresh data after update
//   };

//   // Chart data for Weekly Leads
//   const weeklyLeadsOptions = {
//     chart: { id: "weekly-leads", toolbar: { show: false } },
//     xaxis: { categories: dashboardData?.chartData?.weeklyLeads?.categories || ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"] },
//     colors: ["#FEB019", "#008FFB"],
//     legend: { show: true, position: "top" },
//     dataLabels: { enabled: false },
//   };
//   const weeklyLeadsSeries = dashboardData?.chartData?.weeklyLeads?.series || [
//     { name: "Salesman", data: [150, 200, 180, 250, 220, 300, 280] },
//     { name: "Telle Caller", data: [120, 180, 160, 200, 180, 250, 230] },
//   ];

//   // Chart data for Daily Data
//   const dailyDataOptions = {
//     chart: { id: "daily-data", toolbar: { show: false } },
//     xaxis: { categories: dashboardData?.chartData?.dailyData?.categories || ["Total Enquiries", "Pending"] },
//     colors: ["#161A41C7", "#008FFB"],
//     legend: { show: true, position: "top" },
//     dataLabels: { enabled: false },
//   };
//   const dailyDataSeries = dashboardData?.chartData?.dailyData?.series || [
//     { name: "Total", data: [10] },
//     { name: "Pending", data: [4] },
//   ];

//   // Renewal Reminder pagination logic
//   const renewalReminderData = dashboardData?.renewalReminder || [];
//   const renewalTotalPages = Math.ceil(renewalReminderData.length / renewalRowsPerPage);
//   const renewalStartIndex = (renewalCurrentPage - 1) * renewalRowsPerPage;
//   const renewalEndIndex = renewalStartIndex + renewalRowsPerPage;
//   const renewalCurrentData = renewalReminderData.slice(renewalStartIndex, renewalEndIndex);

//   // Monthly Payment Reminder pagination logic with filtering
//   const monthlyPaymentReminderData = dashboardData?.monthlyPaymentReminder || [];

//   // Apply filter based on paymentFilter state
//   const filteredPaymentReminderData = monthlyPaymentReminderData.filter(item => {
//     if (paymentFilter === 'all') return true;
//     if (paymentFilter === 'upcoming') return item.isUpcoming;
//     if (paymentFilter === 'overdue') return item.isOverdue;
//     return true;
//   });

//   const paymentTotalPages = Math.ceil(filteredPaymentReminderData.length / paymentRowsPerPage);
//   const paymentStartIndex = (paymentCurrentPage - 1) * paymentRowsPerPage;
//   const paymentEndIndex = paymentStartIndex + paymentRowsPerPage;
//   const paymentCurrentData = filteredPaymentReminderData.slice(paymentStartIndex, paymentEndIndex);

//   // Pagination handlers for Renewal Reminder
//   const handleRenewalPageChange = (page) => {
//     setRenewalCurrentPage(page);
//   };

//   const handleRenewalRowsPerPageChange = (e) => {
//     setRenewalRowsPerPage(parseInt(e.target.value));
//     setRenewalCurrentPage(1); // Reset to first page when changing rows per page
//   };

//   // Pagination handlers for Monthly Payment Reminder
//   const handlePaymentPageChange = (page) => {
//     setPaymentCurrentPage(page);
//   };

//   const handlePaymentRowsPerPageChange = (e) => {
//     setPaymentRowsPerPage(parseInt(e.target.value));
//     setPaymentCurrentPage(1); // Reset to first page when changing rows per page
//   };

//   // Handler for payment filter change
//   const handlePaymentFilterChange = (filter) => {
//     setPaymentFilter(filter);
//     setPaymentCurrentPage(1); // Reset to first page when changing filter
//   };

//   // const handlePaymentRowsPerPageChange = (e) => {
//   //   setPaymentRowsPerPage(parseInt(e.target.value));
//   //   setPaymentCurrentPage(1); // Reset to first page when changing rows per page
//   // };

//   // Pagination component
//   const Pagination = ({ currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange, totalItems }) => {
//     const pageNumbers = [];
//     const maxPageButtons = 5;

//     let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
//     let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

//     if (endPage - startPage + 1 < maxPageButtons) {
//       startPage = Math.max(1, endPage - maxPageButtons + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }

//     return (
//       <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-4 md:space-y-0">
//         <div className="flex items-center space-x-2">
//           <span className="text-sm text-gray-600">Show:</span>
//           <select
//             value={rowsPerPage}
//             onChange={onRowsPerPageChange}
//             className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="5">5</option>
//             <option value="10">10</option>
//             <option value="25">25</option>
//             <option value="50">50</option>
//           </select>
//           <span className="text-sm text-gray-600">entries</span>
//         </div>

//         <div className="flex items-center space-x-2">
//           <span className="text-sm text-gray-600">
//             Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} entries
//           </span>

//           <div className="flex space-x-1">
//             <button
//               onClick={() => onPageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`px-3 py-1 rounded-md text-sm ${currentPage === 1
//                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//             >
//               Previous
//             </button>

//             {startPage > 1 && (
//               <>
//                 <button
//                   onClick={() => onPageChange(1)}
//                   className="px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 >
//                   1
//                 </button>
//                 {startPage > 2 && <span className="px-2 py-1">...</span>}
//               </>
//             )}

//             {pageNumbers.map(page => (
//               <button
//                 key={page}
//                 onClick={() => onPageChange(page)}
//                 className={`px-3 py-1 rounded-md text-sm ${currentPage === page
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//               >
//                 {page}
//               </button>
//             ))}

//             {endPage < totalPages && (
//               <>
//                 {endPage < totalPages - 1 && <span className="px-2 py-1">...</span>}
//                 <button
//                   onClick={() => onPageChange(totalPages)}
//                   className="px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 >
//                   {totalPages}
//                 </button>
//               </>
//             )}

//             <button
//               onClick={() => onPageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages
//                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="p-6 font-lato bg-gray-50 min-h-screen">
//         <div className="flex justify-between items-center mb-6">
//           <Skeleton className="h-8 w-48" />
//           <Skeleton className="h-4 w-32" />
//         </div>

//         {/* Skeleton: Top Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="p-4 rounded-lg shadow bg-white h-32 flex flex-col items-center justify-center">
//               <Skeleton className="w-16 h-16 rounded-full mb-2" />
//               <Skeleton className="h-4 w-20" />
//             </div>
//           ))}
//         </div>

//         {/* Skeleton: Membership Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="p-4 rounded-lg shadow bg-white h-32 flex flex-col items-center justify-center">
//               <Skeleton className="w-16 h-16 rounded-full mb-2" />
//               <Skeleton className="h-4 w-32" />
//             </div>
//           ))}
//         </div>

//         {/* Skeleton: Monthly/Yearly & Salesman/Telecaller */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-6">
//           {[...Array(2)].map((_, i) => (
//             <div key={i} className="p-4 rounded-lg shadow bg-white h-32 flex flex-col items-center justify-center">
//               <Skeleton className="w-16 h-16 rounded-full mb-2" />
//               <Skeleton className="h-4 w-40" />
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-6">
//           {[...Array(2)].map((_, i) => (
//             <div key={i} className="p-4 rounded-lg shadow bg-white h-32 flex flex-col items-center justify-center">
//               <Skeleton className="w-16 h-16 rounded-full mb-2" />
//               <Skeleton className="h-4 w-40" />
//             </div>
//           ))}
//         </div>


//         {/* Skeleton: Charts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow h-[350px]">
//             <Skeleton className="h-6 w-32 mb-4" />
//             <Skeleton className="h-[280px] w-full" />
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow h-[350px]">
//             <Skeleton className="h-6 w-32 mb-4" />
//             <Skeleton className="h-[280px] w-full" />
//           </div>
//         </div>

//         {/* Skeleton: Tables */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6 h-[400px]">
//           <Skeleton className="h-6 w-48 mb-4" />
//           <div className="space-y-4">
//             {[...Array(5)].map((_, i) => (
//               <Skeleton key={i} className="h-12 w-full" />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 font-lato bg-gray-50 min-h-screen">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
//           <div className="text-red-600 bg-red-50 p-4 rounded-lg">
//             <p className="font-medium">Error loading dashboard data:</p>
//             <p className="mt-2">{error}</p>
//             <p className="mt-2 text-sm text-red-500">Please check your connection and try again.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Map backend data to frontend structure
//   // const stats = [
//   //   { label: "Total Doctor", value: dashboardData?.stats?.totalDoctor || 0, bgColor: "#18514E", textColor: "#FFFFFF" },
//   //   { label: "Hot", value: dashboardData?.stats?.hot || 0, bgColor: "#336563C2", textColor: "#FFFFFF" },
//   //   { label: "Cold", value: dashboardData?.stats?.cold || 0, bgColor: "#89A5A4AB", textColor: "#FFFFFF" },
//   //   { label: "Follow Ups", value: dashboardData?.stats?.followUps || 0, bgColor: "#89A5A4AB", textColor: "#FFFFFF" },
//   //   { label: "Closed", value: dashboardData?.stats?.closed || 0, bgColor: "#18514E", textColor: "#FFFFFF" },
//   //   { label: "Cancel", value: dashboardData?.stats?.cancel || 0, bgColor: "#336563C2", textColor: "#FFFFFF" },
//   // ];

//   // Map backend data to frontend structure with click handlers
//   const stats = [
//     { label: "Total Doctor", value: dashboardData?.stats?.totalDoctor || 0, bgColor: "#18514E", textColor: "#FFFFFF", key: "all" },
//     { label: "Hot", value: dashboardData?.stats?.hot || 0, bgColor: "#336563C2", textColor: "#FFFFFF", key: "hot" },
//     { label: "Cold", value: dashboardData?.stats?.cold || 0, bgColor: "#89A5A4AB", textColor: "#FFFFFF", key: "cold" },
//     { label: "Follow Ups", value: dashboardData?.stats?.followUps || 0, bgColor: "#89A5A4AB", textColor: "#FFFFFF", key: "follow_up" },
//     { label: "Closed", value: dashboardData?.stats?.closed || 0, bgColor: "#18514E", textColor: "#FFFFFF", key: "closed" },
//     { label: "Cancel", value: dashboardData?.stats?.cancel || 0, bgColor: "#336563C2", textColor: "#FFFFFF", key: "cancel" },
//   ];


//   const extendedStats = [
//     { label: "Hospital Membership", value: dashboardData?.membershipStats?.hospitalMembership || 0, bgColor: "#597675", textColor: "#161A41C7", key: "hospital" },
//     { label: "Individual Membership", value: dashboardData?.membershipStats?.individualMembership || 0, bgColor: "#597675", textColor: "#161A41C7", key: "individual" },
//     { label: "Individual + Hospital Membership", value: dashboardData?.membershipStats?.individualPlusHospital || 0, bgColor: "#597675", textColor: "#161A41C7", key: "hospital_individual" },

//     // Updated to use new API data
//     { label: "Total Monthly Doctor", value: monthlyDoctors, bgColor: "#1667A4", textColor: "#161A41C7" },
//     { label: "Total Yearly Doctor", value: yearlyDoctors, bgColor: "#1667A4A6", textColor: "#161A41C7" },
//     { label: "Doctors Added By Salesman", value: salesmanDoctorCount, bgColor: "#ECE876", textColor: "#161A41C7" },
//     { label: "Doctors Added By Telecaller", value: telecallerDoctorCount, bgColor: "#F4BE28", textColor: "#161A41C7" },
//   ];

//   return (
//     <div className="p-6 font-lato bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//         <span className="text-gray-500 text-sm">{new Date().toLocaleDateString('en-GB')}</span> {/* Current date */}
//       </div>

//       {/* Top Stats - 4 columns on desktop */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
//         {/* {stats.map((stat, index) => (
//           <div key={index} className="p-4 rounded-lg shadow flex items-center justify-center" style={{ backgroundColor: stat.bgColor }}>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//                 <span style={{ color: "#161A41C7", fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{stat.value}</span>
//               </div>
//               <p className="text-sm font-medium" style={{ color: stat.textColor }}>{stat.label}</p>
//             </div>
//           </div>
//         ))} */}

//         {stats.map((stat, index) => (
//           <button
//             key={index}
//             onClick={() => handleStatsClick(stat.key)}
//             className="p-4 rounded-lg shadow flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             style={{ backgroundColor: stat.bgColor }}
//             title={`View ${stat.label} Doctors`}
//           >
//             <div className="text-center">
//               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//                 <span style={{ color: "#161A41C7", fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{stat.value}</span>
//               </div>
//               <p className="text-sm font-medium" style={{ color: stat.textColor }}>{stat.label}</p>
//             </div>
//           </button>
//         ))}

//       </div>

//       {/* Second Row - 3 columns for Membership stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//         {/* {extendedStats.slice(0, 3).map((stat, index) => (
//           <div key={index} className="p-4 rounded-lg shadow flex items-center justify-center" style={{ backgroundColor: stat.bgColor }}>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//                 <span style={{ color: stat.textColor, fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{stat.value}</span>
//               </div>
//               <p className="text-sm font-medium" style={{ color: stat.textColor }}>{stat.label}</p>
//             </div>
//           </div>
//         ))} */}

//         {extendedStats.slice(0, 3).map((stat, index) => (
//           <button
//             key={index}
//             onClick={() => handleMembershipClick(stat.key)}
//             className="p-4 rounded-lg shadow flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             style={{ backgroundColor: stat.bgColor }}
//             title={`View ${stat.label} Doctors`}
//           >
//             <div className="text-center">
//               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//                 <span style={{ color: stat.textColor, fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{stat.value}</span>
//               </div>
//               <p className="text-sm font-medium" style={{ color: stat.textColor }}>{stat.label}</p>
//             </div>
//           </button>
//         ))}

//       </div>

//       {/* Third Row - 2 columns for Total Monthly Doctor and Total Yearly Doctor */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-6">
//         <button
//           onClick={() => navigate('/admin/monthly-doctors')}
//           className="p-4 rounded-lg shadow flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
//           style={{ backgroundColor: extendedStats[3].bgColor }}
//           title="View Monthly Doctors"
//         >
//           <div className="text-center">
//             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//               <span style={{ color: extendedStats[3].textColor, fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{monthlyDoctors}</span>
//             </div>
//             <p className="text-sm font-medium" style={{ color: extendedStats[3].textColor }}>Total Monthly Doctor</p>
//           </div>
//         </button>
//         <button
//           onClick={() => navigate('/admin/yearly-doctors')}
//           className="p-4 rounded-lg shadow flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
//           style={{ backgroundColor: extendedStats[4].bgColor }}
//           title="View Yearly Doctors"
//         >
//           <div className="text-center">
//             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//               <span style={{ color: extendedStats[4].textColor, fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{yearlyDoctors}</span>
//             </div>
//             <p className="text-sm font-medium" style={{ color: extendedStats[4].textColor }}>Total Yearly Doctor</p>
//           </div>
//         </button>
//       </div>

//       {/* Fourth Row - 2 columns for Salesman and Telecaller */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-6">
//         <button
//           onClick={() => navigate('/admin/salesman-doctors')}
//           className="p-4 rounded-lg shadow flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
//           style={{ backgroundColor: extendedStats[5].bgColor }}
//           title="View Salesman Doctors"
//         >
//           <div className="text-center">
//             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//               <span style={{ color: extendedStats[5].textColor, fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{salesmanDoctorCount}</span>
//             </div>
//             <p className="text-sm font-medium" style={{ color: extendedStats[5].textColor }}>Doctors Added By Salesman</p>
//           </div>
//         </button>
//         <button
//           onClick={() => navigate('/admin/telecaller-doctors')}
//           className="p-4 rounded-lg shadow flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
//           style={{ backgroundColor: extendedStats[6].bgColor }}
//           title="View Telecaller Doctors"
//         >
//           <div className="text-center">
//             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//               <span style={{ color: extendedStats[6].textColor, fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{telecallerDoctorCount}</span>
//             </div>
//             <p className="text-sm font-medium" style={{ color: extendedStats[6].textColor }}>Doctors Added By Telecaller</p>
//           </div>
//         </button>
//       </div>

//       {/* Charts - 2 columns on desktop */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         {/* Weekly Leads Chart */}
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">Weekly Loads</h2>
//           <Chart options={weeklyLeadsOptions} series={weeklyLeadsSeries} type="bar" height={300} />
//         </div>

//         {/* Daily Data Chart */}
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">Daily Data</h2>
//           <Chart options={dailyDataOptions} series={dailyDataSeries} type="bar" height={300} />
//         </div>
//       </div>

//       {/* Renewal Reminder */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <h2 className="text-lg font-semibold mb-4">Renewal Reminder</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-2 text-left">Sr No</th>
//                 <th className="p-2 text-left">SB No</th>
//                 <th className="p-2 text-left">SB Date</th>
//                 <th className="p-2 text-left">Doctor Name</th>
//                 <th className="p-2 text-left">Membership</th>
//                 <th className="p-2 text-left">Membership Year</th>
//                 <th className="p-2 text-left">Amount</th>
//                 <th className="p-2 text-left">Renewal Date</th>
//                 <th className="p-2 text-left">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {renewalCurrentData.length > 0 ? (
//                 renewalCurrentData.map((row, index) => (
//                   <tr key={index} className="border-t">
//                     <td className="p-2">{row.srNo || 'N/A'}</td>
//                     <td className="p-2">{row.sbNo || 'N/A'}</td>
//                     <td className="p-2">{row.sbDate || 'N/A'}</td>
//                     <td className="p-2">{row.doctorName || 'N/A'}</td>
//                     <td className="p-2">{row.membership || 'N/A'}</td>
//                     <td className="p-2">{row.membershipYear || 'N/A'}</td>
//                     <td className="p-2">{row.amount || 'N/A'}</td>
//                     <td className="p-2">{row.expiryDate || row.renewalDate || 'N/A'}</td>
//                     <td className="p-2">
//                       <button
//                         className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
//                         onClick={() => handleRenewClick(row)}
//                       >
//                         Renew
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="9" className="p-4 text-center text-gray-500">No renewal reminders available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Pagination for Renewal Reminder */}
//           {renewalReminderData.length > 0 && (
//             <Pagination
//               currentPage={renewalCurrentPage}
//               totalPages={renewalTotalPages}
//               onPageChange={handleRenewalPageChange}
//               rowsPerPage={renewalRowsPerPage}
//               onRowsPerPageChange={handleRenewalRowsPerPageChange}
//               totalItems={renewalReminderData.length}
//             />
//           )}
//         </div>
//       </div>

//       {/* Monthly Payment Reminder */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">Monthly Payment Reminder</h2>
//           <div className="flex space-x-2">
//             <select
//               value={paymentFilter}
//               onChange={(e) => handlePaymentFilterChange(e.target.value)}
//               className="border rounded px-3 py-1 text-sm"
//             >
//               <option value="all">All Payments</option>
//               <option value="upcoming">Upcoming</option>
//               <option value="overdue">Overdue</option>
//             </select>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-2 text-left">Sr No</th>
//                 <th className="p-2 text-left">SB No</th>
//                 <th className="p-2 text-left">SB Date</th>
//                 <th className="p-2 text-left">Doctor Name</th>
//                 <th className="p-2 text-left">Membership</th>
//                 <th className="p-2 text-left">Membership Year</th>
//                 <th className="p-2 text-left">Amount</th>
//                 <th className="p-2 text-left">Renewal Date</th>
//                 <th className="p-2 text-left">Status</th>
//                 <th className="p-2 text-left">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paymentCurrentData.length > 0 ? (
//                 paymentCurrentData.map((row, index) => (
//                   <tr key={index} className="border-t">
//                     <td className="p-2">{row.srNo || 'N/A'}</td>
//                     <td className="p-2">{row.sbNo || 'N/A'}</td>
//                     <td className="p-2">{row.sbDate || 'N/A'}</td>
//                     <td className="p-2">{row.doctorName || 'N/A'}</td>
//                     <td className="p-2">{row.membership || 'N/A'}</td>
//                     <td className="p-2">{row.membershipYear || 'N/A'}</td>
//                     <td className="p-2">{row.amount || 'N/A'}</td>
//                     <td className="p-2">{row.expiryDate || row.renewalDate || 'N/A'}</td>
//                     <td className="p-2">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         row.isOverdue ? 'bg-red-100 text-red-800' :
//                         row.isUpcoming ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {row.isOverdue ? 'Overdue' : row.isUpcoming ? 'Upcoming' : 'Pending'}
//                       </span>
//                     </td>
//                     <td className="p-2">
//                       <button
//                         className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
//                         onClick={() => handleRenewClick(row)}
//                       >
//                         Pay
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="10" className="p-4 text-center text-gray-500">No monthly payment reminders available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Pagination for Monthly Payment Reminder */}
//           {filteredPaymentReminderData.length > 0 && (
//             <Pagination
//               currentPage={paymentCurrentPage}
//               totalPages={paymentTotalPages}
//               onPageChange={handlePaymentPageChange}
//               rowsPerPage={paymentRowsPerPage}
//               onRowsPerPageChange={handlePaymentRowsPerPageChange}
//               totalItems={filteredPaymentReminderData.length}
//             />
//           )}
//         </div>
//       </div>

//       {/* Renewal Action Modal */}
//       <RenewalActionModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={handleModalSuccess}
//         alertData={selectedAlert}
//       />
//     </div>
//   );
// };

// export default AdminDashboard;



























import React, { useState, useEffect } from "react";
import { useAuth } from '../../hooks/useAuth';
import Chart from "react-apexcharts";
import RenewalActionModal from "../../components/modals/RenewalActionModal";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from '../../services/apiClient';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New API data states
  const [monthlyDoctors, setMonthlyDoctors] = useState(0);
  const [yearlyDoctors, setYearlyDoctors] = useState(0);
  const [salesmanDoctorCount, setSalesmanDoctorCount] = useState(0);
  const [telecallerDoctorCount, setTelecallerDoctorCount] = useState(0);

  // Pagination states for Renewal Reminder
  const [renewalCurrentPage, setRenewalCurrentPage] = useState(1);
  const [renewalRowsPerPage, setRenewalRowsPerPage] = useState(5);

  // Pagination states for Monthly Payment Reminder
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
  const [paymentRowsPerPage, setPaymentRowsPerPage] = useState(5);

  // Filter state for monthly payment reminders
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all', 'upcoming', 'overdue'

  // Helper function to get start of current month
  const getCurrentMonthStart = () => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-01`;
  };

  // Helper function to get end of current month
  const getCurrentMonthEnd = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`;
  };

  // Date filter states for Renewal Reminder
  const [renewalDateFrom, setRenewalDateFrom] = useState(getCurrentMonthStart()); // Default to start of current month
  const [renewalDateTo, setRenewalDateTo] = useState(getCurrentMonthEnd()); // Default to end of current month
  const [renewalDateFilterType, setRenewalDateFilterType] = useState('expiry'); // 'expiry' or 'sbDate'

  // Date filter states for Monthly Payment Reminder
  const [paymentDateFrom, setPaymentDateFrom] = useState('');
  const [paymentDateTo, setPaymentDateTo] = useState('');
  const [paymentDateFilterType, setPaymentDateFilterType] = useState('expiry'); // 'expiry' or 'sbDate'

  // Helper function to format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString || dateString === 'N/A') return '';

    try {
      // Parse date in dd/mm/yyyy format
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Helper function to parse date string (dd/mm/yyyy) to Date object
  const parseDateString = (dateString) => {
    if (!dateString || dateString === 'N/A') return null;

    try {
      const [day, month, year] = dateString.split('/');
      // Note: month is 0-indexed in JavaScript Date
      return new Date(year, month - 1, day);
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };

  // Helper function to format date for display (fix the one day earlier issue)
  const formatDateForDisplay = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';

    try {
      const date = parseDateString(dateString);
      if (!date || isNaN(date.getTime())) return dateString;

      // Format as dd/mm/yyyy without timezone issues
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date for display:', error);
      return dateString;
    }
  };

  // Skeleton Loader Component
  const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Execute all requests in parallel
      const [
        dashboardRes,
        monthlyRes,
        yearlyRes,
        salesmanRes,
        telecallerRes,
        monthlyPaymentRemindersRes,
        renewalRemindersRes
      ] = await Promise.all([
        apiClient.get(apiEndpoints.adminDashboard.dashboard),
        apiClient.get(apiEndpoints.adminDashboard.monthlyDoctors),
        apiClient.get(apiEndpoints.adminDashboard.yearlyDoctors),
        apiClient.get(apiEndpoints.adminDashboard.salesmanDoctors),
        apiClient.get(apiEndpoints.adminDashboard.telecallerDoctors),
        apiClient.get(apiEndpoints.adminDashboard.monthlyPaymentReminders),
        apiClient.get(apiEndpoints.adminDashboard.renewalReminders) // Add the new renewal reminders endpoint
      ]);

      // Handle Main Dashboard Data
      if (dashboardRes.data?.success) {
        // Override the monthlyPaymentReminder data with data from the receipt module
        const monthlyPaymentReminderData = monthlyPaymentRemindersRes.data?.success
          ? monthlyPaymentRemindersRes.data.data
          : [];

        // Get renewal reminder data from the separate API call
        const renewalReminderData = renewalRemindersRes.data?.success
          ? renewalRemindersRes.data.data
          : [];

        // Update the dashboard data with both monthly payment reminders and renewal reminders
        setDashboardData({
          ...dashboardRes.data.data,
          monthlyPaymentReminder: monthlyPaymentReminderData,
          renewalReminder: renewalReminderData
        });
      } else {
        throw new Error(dashboardRes.data?.message || 'Failed to fetch dashboard data');
      }

      // Handle Concurrent API Data
      if (monthlyRes.data?.success) setMonthlyDoctors(monthlyRes.data.totalCount || 0);
      if (yearlyRes.data?.success) setYearlyDoctors(yearlyRes.data.totalCount || 0);
      if (salesmanRes.data?.success) setSalesmanDoctorCount(salesmanRes.data.totalCount || 0);
      if (telecallerRes.data?.success) setTelecallerDoctorCount(telecallerRes.data.totalCount || 0);

      // Handle monthly payment reminders data
      if (monthlyPaymentRemindersRes.data?.success) {
        // Update the dashboard data with the receipt-based monthly payment reminders
        setDashboardData(prevData => ({
          ...prevData,
          monthlyPaymentReminder: monthlyPaymentRemindersRes.data.data || []
        }));
      } else {
        // If the API call failed, still update with empty array to avoid issues
        setDashboardData(prevData => ({
          ...prevData,
          monthlyPaymentReminder: []
        }));
      }

    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const handleRenewClick = (alert) => {
    // Logic for payment reminders (Pay button)
    if (alert.receiptId) {
      const sbNo = alert.salesBillInfo?.sbNo || alert.sbNo;
      if (sbNo) {
        navigate(`/admin/create-receipt?refCode=${encodeURIComponent(sbNo)}`);
      } else {
        navigate(`/admin/edit-receipt/${alert.receiptId}`);
      }
      return; // Stop execution for payment reminders
    }

    // New logic for renewal reminders (Renew button)
    if (alert.entityType === 'SalesBill') {
      // The entityId is actually a doctor ID, so we pass it to auto-select the doctor in the dropdown
      navigate(`/admin/add-salesbill?doctor_id=${alert.entityId}`);
    } else if (alert.entityType === 'Policy') {
      navigate(`/admin/renew-policy/${alert.entityId}`);
    } else {
      // Fallback for older data or other types: open the modal
      console.warn('Unknown renewal type, opening modal as fallback:', alert);
      setSelectedAlert(alert);
      setIsModalOpen(true);
    }
  };

  // Handle stats card click
  const handleStatsClick = (status) => {
    navigate(`/admin/doctor-list?status=${status.toLowerCase()}`);
  };

  const handleMembershipClick = (membershipType) => {
    navigate(`/admin/doctor-list?membership=${membershipType.toLowerCase().replace(/\s+/g, '_')}`);
  };

  const handleModalSuccess = () => {
    fetchDashboardData(); // Refresh data after update
  };

  // Chart data for Weekly Leads
  const weeklyLeadsOptions = {
    chart: { id: "weekly-leads", toolbar: { show: false } },
    xaxis: { categories: dashboardData?.chartData?.weeklyLeads?.categories || ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"] },
    colors: ["#FEB019", "#008FFB"],
    legend: { show: true, position: "top" },
    dataLabels: { enabled: false },
  };
  const weeklyLeadsSeries = dashboardData?.chartData?.weeklyLeads?.series || [
    { name: "Salesman", data: [150, 200, 180, 250, 220, 300, 280] },
    { name: "Telle Caller", data: [120, 180, 160, 200, 180, 250, 230] },
  ];

  // Chart data for Daily Data
  const dailyDataOptions = {
    chart: { id: "daily-data", toolbar: { show: false } },
    xaxis: { categories: dashboardData?.chartData?.dailyData?.categories || ["Total Enquiries", "Pending"] },
    colors: ["#161A41C7", "#008FFB"],
    legend: { show: true, position: "top" },
    dataLabels: { enabled: false },
  };
  const dailyDataSeries = dashboardData?.chartData?.dailyData?.series || [
    { name: "Total", data: [10] },
    { name: "Pending", data: [4] },
  ];

  // Apply date filter to renewal reminder data
  const applyRenewalDateFilter = (data) => {
    if (!renewalDateFrom && !renewalDateTo) return data;

    return data.filter(item => {
      const dateField = renewalDateFilterType === 'expiry' ? item.expiryDate : item.sbDate;
      if (!dateField || dateField === 'N/A') return false;

      const itemDate = parseDateString(dateField);
      if (!itemDate) return false;

      if (renewalDateFrom) {
        const fromDate = new Date(renewalDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (itemDate < fromDate) return false;
      }

      if (renewalDateTo) {
        const toDate = new Date(renewalDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (itemDate > toDate) return false;
      }

      return true;
    });
  };

  // Apply date filter to monthly payment reminder data
  const applyPaymentDateFilter = (data) => {
    if (!paymentDateFrom && !paymentDateTo) return data;

    return data.filter(item => {
      const dateField = paymentDateFilterType === 'expiry' ? item.expiryDate : item.sbDate;
      if (!dateField || dateField === 'N/A') return false;

      const itemDate = parseDateString(dateField);
      if (!itemDate) return false;

      if (paymentDateFrom) {
        const fromDate = new Date(paymentDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (itemDate < fromDate) return false;
      }

      if (paymentDateTo) {
        const toDate = new Date(paymentDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (itemDate > toDate) return false;
      }

      return true;
    });
  };

  // Renewal Reminder pagination logic with date filtering
  const renewalReminderData = dashboardData?.renewalReminder || [];

  // Filter out policy renewal data and keep only SalesBill-related data
  const salesBillOnlyData = renewalReminderData.filter(item => item.entityType === 'SalesBill');

  const filteredRenewalData = applyRenewalDateFilter(salesBillOnlyData);
  const renewalTotalPages = Math.ceil(filteredRenewalData.length / renewalRowsPerPage);
  const renewalStartIndex = (renewalCurrentPage - 1) * renewalRowsPerPage;
  const renewalEndIndex = renewalStartIndex + renewalRowsPerPage;
  const renewalCurrentData = filteredRenewalData.slice(renewalStartIndex, renewalEndIndex);

  // Monthly Payment Reminder pagination logic with filtering
  const monthlyPaymentReminderData = dashboardData?.monthlyPaymentReminder || [];

  // Apply status filter based on paymentFilter state
  const statusFilteredData = monthlyPaymentReminderData.filter(item => {
    if (paymentFilter === 'all') return true;
    if (paymentFilter === 'upcoming') return item.isUpcoming;
    if (paymentFilter === 'overdue') return item.isOverdue;
    return true;
  });

  // Apply date filter to status filtered data
  const filteredPaymentReminderData = applyPaymentDateFilter(statusFilteredData);
  const paymentTotalPages = Math.ceil(filteredPaymentReminderData.length / paymentRowsPerPage);
  const paymentStartIndex = (paymentCurrentPage - 1) * paymentRowsPerPage;
  const paymentEndIndex = paymentStartIndex + paymentRowsPerPage;
  const paymentCurrentData = filteredPaymentReminderData.slice(paymentStartIndex, paymentEndIndex);

  // Pagination handlers for Renewal Reminder
  const handleRenewalPageChange = (page) => {
    setRenewalCurrentPage(page);
  };

  const handleRenewalRowsPerPageChange = (e) => {
    setRenewalRowsPerPage(parseInt(e.target.value));
    setRenewalCurrentPage(1); // Reset to first page when changing rows per page
  };

  // Pagination handlers for Monthly Payment Reminder
  const handlePaymentPageChange = (page) => {
    setPaymentCurrentPage(page);
  };

  const handlePaymentRowsPerPageChange = (e) => {
    setPaymentRowsPerPage(parseInt(e.target.value));
    setPaymentCurrentPage(1); // Reset to first page when changing rows per page
  };

  // Handler for payment filter change
  const handlePaymentFilterChange = (filter) => {
    setPaymentFilter(filter);
    setPaymentCurrentPage(1); // Reset to first page when changing filter
  };

  // Handler for renewal date filter change
  const handleRenewalDateFilterChange = () => {
    setRenewalCurrentPage(1); // Reset to first page when changing date filter
  };

  // Handler for payment date filter change
  const handlePaymentDateFilterChange = () => {
    setPaymentCurrentPage(1); // Reset to first page when changing date filter
  };

  // Clear renewal date filters
  const clearRenewalDateFilters = () => {
    setRenewalDateFrom('');
    setRenewalDateTo('');
    setRenewalCurrentPage(1);
  };

  // Clear payment date filters
  const clearPaymentDateFilters = () => {
    setPaymentDateFrom('');
    setPaymentDateTo('');
    setPaymentCurrentPage(1);
  };

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange, totalItems }) => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} entries
          </span>

          <div className="flex space-x-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Previous
            </button>

            {startPage > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  1
                </button>
                {startPage > 2 && <span className="px-2 py-1">...</span>}
              </>
            )}

            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {page}
              </button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <span className="px-2 py-1">...</span>}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 font-lato bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Skeleton: Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg shadow bg-white h-32 flex flex-col items-center justify-center">
              <Skeleton className="w-16 h-16 rounded-full mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>

        {/* Skeleton: Membership Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg shadow bg-white h-32 flex flex-col items-center justify-center">
              <Skeleton className="w-16 h-16 rounded-full mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        {/* Skeleton: Monthly/Yearly & Salesman/Telecaller */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg shadow bg-white h-32 flex flex-col items-center justify-center">
              <Skeleton className="w-16 h-16 rounded-full mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg shadow bg-white h-32 flex flex-col items-center justify-center">
              <Skeleton className="w-16 h-16 rounded-full mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>


        {/* Skeleton: Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow h-[350px]">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-[280px] w-full" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow h-[350px]">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-[280px] w-full" />
          </div>
        </div>

        {/* Skeleton: Tables */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 h-[400px]">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 font-lato bg-gray-50 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
          <div className="text-red-600 bg-red-50 p-4 rounded-lg">
            <p className="font-medium">Error loading dashboard data:</p>
            <p className="mt-2">{error}</p>
            <p className="mt-2 text-sm text-red-500">Please check your connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  // Map backend data to frontend structure with click handlers
  const stats = [
    { label: "Total Doctor", value: dashboardData?.stats?.totalDoctor || 0, bgColor: "#18514E", textColor: "#FFFFFF", key: "all" },
    { label: "Hot", value: dashboardData?.stats?.hot || 0, bgColor: "#336563C2", textColor: "#FFFFFF", key: "hot" },
    { label: "Cold", value: dashboardData?.stats?.cold || 0, bgColor: "#89A5A4AB", textColor: "#FFFFFF", key: "cold" },
    { label: "Follow Ups", value: dashboardData?.stats?.followUps || 0, bgColor: "#89A5A4AB", textColor: "#FFFFFF", key: "follow_up" },
    { label: "Closed", value: dashboardData?.stats?.closed || 0, bgColor: "#18514E", textColor: "#FFFFFF", key: "closed" },
    { label: "Cancel", value: dashboardData?.stats?.cancel || 0, bgColor: "#336563C2", textColor: "#FFFFFF", key: "cancel" },
  ];

  const extendedStats = [
    { label: "Hospital Membership", value: dashboardData?.membershipStats?.hospitalMembership || 0, bgColor: "#597675", textColor: "#161A41C7", key: "hospital" },
    { label: "Individual Membership", value: dashboardData?.membershipStats?.individualMembership || 0, bgColor: "#597675", textColor: "#161A41C7", key: "individual" },
    { label: "Individual + Hospital Membership", value: dashboardData?.membershipStats?.individualPlusHospital || 0, bgColor: "#597675", textColor: "#161A41C7", key: "hospital_individual" },

    // Updated to use new API data
    { label: "Total Monthly Doctor", value: monthlyDoctors, bgColor: "#1667A4", textColor: "#161A41C7" },
    { label: "Total Yearly Doctor", value: yearlyDoctors, bgColor: "#1667A4A6", textColor: "#161A41C7" },
    { label: "Doctors Added By Salesman", value: salesmanDoctorCount, bgColor: "#ECE876", textColor: "#161A41C7" },
    { label: "Doctors Added By Telecaller", value: telecallerDoctorCount, bgColor: "#F4BE28", textColor: "#161A41C7" },
  ];

  return (
    <div className="p-6 font-lato bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <span className="text-gray-500 text-sm">{new Date().toLocaleDateString('en-GB')}</span> {/* Current date */}
      </div>

      {/* Top Stats - 4 columns on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((stat, index) => (
          <button
            key={index}
            onClick={() => handleStatsClick(stat.key)}
            className="p-4 rounded-lg shadow flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{ backgroundColor: stat.bgColor }}
            title={`View ${stat.label} Doctors`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                <span style={{ color: "#161A41C7", fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{stat.value}</span>
              </div>
              <p className="text-sm font-medium" style={{ color: stat.textColor }}>{stat.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Second Row - 3 columns for Membership stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {extendedStats.slice(0, 3).map((stat, index) => (
          <button
            key={index}
            onClick={() => handleMembershipClick(stat.key)}
            className="p-4 rounded-lg shadow flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{ backgroundColor: stat.bgColor }}
            title={`View ${stat.label} Doctors`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                <span style={{ color: stat.textColor, fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{stat.value}</span>
              </div>
              <p className="text-sm font-medium" style={{ color: stat.textColor }}>{stat.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Third Row - 2 columns for Total Monthly Doctor and Total Yearly Doctor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/monthly-doctors')}
          className="p-4 rounded-lg shadow flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          style={{ backgroundColor: extendedStats[3].bgColor }}
          title="View Monthly Doctors"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
              <span style={{ color: extendedStats[3].textColor, fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{monthlyDoctors}</span>
            </div>
            <p className="text-sm font-medium" style={{ color: extendedStats[3].textColor }}>Total Monthly Doctor</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/admin/yearly-doctors')}
          className="p-4 rounded-lg shadow flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          style={{ backgroundColor: extendedStats[4].bgColor }}
          title="View Yearly Doctors"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
              <span style={{ color: extendedStats[4].textColor, fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{yearlyDoctors}</span>
            </div>
            <p className="text-sm font-medium" style={{ color: extendedStats[4].textColor }}>Total Yearly Doctor</p>
          </div>
        </button>
      </div>

      {/* Fourth Row - 2 columns for Salesman and Telecaller */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/salesman-doctors')}
          className="p-4 rounded-lg shadow flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          style={{ backgroundColor: extendedStats[5].bgColor }}
          title="View Salesman Doctors"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
              <span style={{ color: extendedStats[5].textColor, fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{salesmanDoctorCount}</span>
            </div>
            <p className="text-sm font-medium" style={{ color: extendedStats[5].textColor }}>Doctors Added By Salesman</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/admin/telecaller-doctors')}
          className="p-4 rounded-lg shadow flex items-center justify-center hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          style={{ backgroundColor: extendedStats[6].bgColor }}
          title="View Telecaller Doctors"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
              <span style={{ color: extendedStats[6].textColor, fontFamily: "Lato", fontWeight: 700, fontSize: "30.59px", lineHeight: "100%", textAlign: "center", verticalAlign: "middle" }}>{telecallerDoctorCount}</span>
            </div>
            <p className="text-sm font-medium" style={{ color: extendedStats[6].textColor }}>Doctors Added By Telecaller</p>
          </div>
        </button>
      </div>

      {/* Charts - 2 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Weekly Leads Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Weekly Loads</h2>
          <Chart options={weeklyLeadsOptions} series={weeklyLeadsSeries} type="bar" height={300} />
        </div>

        {/* Daily Data Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Daily Data</h2>
          <Chart options={dailyDataOptions} series={dailyDataSeries} type="bar" height={300} />
        </div>
      </div>

      {/* Renewal Reminder */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Renewal Reminder</h2>
          <div className="flex items-center space-x-4">
            {/* Date Filter Type */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filter by:</span>
              <select
                value={renewalDateFilterType}
                onChange={(e) => {
                  setRenewalDateFilterType(e.target.value);
                  handleRenewalDateFilterChange();
                }}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="expiry">Expiry Date</option>
                <option value="sbDate">SB Date</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={renewalDateFrom}
                onChange={(e) => {
                  setRenewalDateFrom(e.target.value);
                  handleRenewalDateFilterChange();
                }}
                className="border rounded px-3 py-1 text-sm"
                placeholder="From Date"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={renewalDateTo}
                onChange={(e) => {
                  setRenewalDateTo(e.target.value);
                  handleRenewalDateFilterChange();
                }}
                className="border rounded px-3 py-1 text-sm"
                placeholder="To Date"
              />
              {(renewalDateFrom || renewalDateTo) && (
                <button
                  onClick={clearRenewalDateFilters}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Sr No</th>
                <th className="p-2 text-left">SB No</th>
                <th className="p-2 text-left">SB Date</th>
                <th className="p-2 text-left">Doctor Name</th>
                <th className="p-2 text-left">Membership</th>
                <th className="p-2 text-left">Membership Year</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Renewal Date</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {renewalCurrentData.length > 0 ? (
                renewalCurrentData.map((row, index) => {
                  // Calculate the actual serial number considering pagination
                  const actualIndex = (renewalCurrentPage - 1) * renewalRowsPerPage + index + 1;
                  return (
                    <tr key={index} className="border-t">
                      <td className="p-2">{actualIndex}</td>
                      <td className="p-2">{row.sbNo || 'N/A'}</td>
                      <td className="p-2">{formatDateForDisplay(row.sbDate)}</td>
                      <td className="p-2">{row.doctorName || 'N/A'}</td>
                      <td className="p-2">{row.membership || 'N/A'}</td>
                      <td className="p-2">{row.membershipYear || 'N/A'}</td>
                      <td className="p-2">{row.amount || 'N/A'}</td>
                      <td className="p-2">{formatDateForDisplay(row.expiryDate)}</td>
                      <td className="p-2">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                          onClick={() => handleRenewClick(row)}
                        >
                          Renew
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">
                    {filteredRenewalData.length === 0 && renewalReminderData.length > 0
                      ? "No records found for the selected date range"
                      : "No renewal reminders available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination for Renewal Reminder */}
          {filteredRenewalData.length > 0 && (
            <Pagination
              currentPage={renewalCurrentPage}
              totalPages={renewalTotalPages}
              onPageChange={handleRenewalPageChange}
              rowsPerPage={renewalRowsPerPage}
              onRowsPerPageChange={handleRenewalRowsPerPageChange}
              totalItems={filteredRenewalData.length}
            />
          )}
        </div>
      </div>

      {/* Monthly Payment Reminder */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Monthly Payment Reminder</h2>
          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Status:</span>
              <select
                value={paymentFilter}
                onChange={(e) => handlePaymentFilterChange(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="all">All Payments</option>
                <option value="upcoming">Upcoming</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Date Filter Type */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filter by:</span>
              <select
                value={paymentDateFilterType}
                onChange={(e) => {
                  setPaymentDateFilterType(e.target.value);
                  handlePaymentDateFilterChange();
                }}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="expiry">Expiry Date</option>
                <option value="sbDate">SB Date</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={paymentDateFrom}
                onChange={(e) => {
                  setPaymentDateFrom(e.target.value);
                  handlePaymentDateFilterChange();
                }}
                className="border rounded px-3 py-1 text-sm"
                placeholder="From Date"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={paymentDateTo}
                onChange={(e) => {
                  setPaymentDateTo(e.target.value);
                  handlePaymentDateFilterChange();
                }}
                className="border rounded px-3 py-1 text-sm"
                placeholder="To Date"
              />
              {(paymentDateFrom || paymentDateTo) && (
                <button
                  onClick={clearPaymentDateFilters}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Sr No</th>
                <th className="p-2 text-left">SB No</th>
                <th className="p-2 text-left">SB Date</th>
                <th className="p-2 text-left">Doctor Name</th>
                <th className="p-2 text-left">Membership</th>
                <th className="p-2 text-left">Membership Year</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Renewal Date</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentCurrentData.length > 0 ? (
                paymentCurrentData.map((row, index) => {
                  // Calculate the actual serial number considering pagination
                  const actualIndex = (paymentCurrentPage - 1) * paymentRowsPerPage + index + 1;
                  return (
                    <tr key={index} className="border-t">
                      <td className="p-2">{actualIndex}</td>
                      <td className="p-2">{row.sbNo || 'N/A'}</td>
                      <td className="p-2">{formatDateForDisplay(row.sbDate)}</td>
                      <td className="p-2">{row.doctorName || 'N/A'}</td>
                      <td className="p-2">{row.membership || 'N/A'}</td>
                      <td className="p-2">{row.membershipYear || 'N/A'}</td>
                      <td className="p-2">{row.amount || 'N/A'}</td>
                      <td className="p-2">{formatDateForDisplay(row.expiryDate)}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          row.isOverdue ? 'bg-red-100 text-red-800' :
                          row.isUpcoming ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {row.isOverdue ? 'Overdue' : row.isUpcoming ? 'Upcoming' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                          onClick={() => handleRenewClick(row)}
                        >
                          Pay
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="p-4 text-center text-gray-500">
                    {filteredPaymentReminderData.length === 0 && monthlyPaymentReminderData.length > 0
                      ? "No records found for the selected filters"
                      : "No monthly payment reminders available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination for Monthly Payment Reminder */}
          {filteredPaymentReminderData.length > 0 && (
            <Pagination
              currentPage={paymentCurrentPage}
              totalPages={paymentTotalPages}
              onPageChange={handlePaymentPageChange}
              rowsPerPage={paymentRowsPerPage}
              onRowsPerPageChange={handlePaymentRowsPerPageChange}
              totalItems={filteredPaymentReminderData.length}
            />
          )}
        </div>
      </div>

      {/* Renewal Action Modal */}
      <RenewalActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        alertData={selectedAlert}
      />
    </div>
  );
};

export default AdminDashboard;