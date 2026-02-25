// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const TelecallerReport = () => {
//   // State management
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Filter states
//   const [filters, setFilters] = useState({
//     fromDate: '',
//     toDate: '',
//     enquiryType: 'All',
//     status: 'All',
//     membershipType: 'All',
//     searchTerm: ''
//   });

//   useEffect(() => {
//     fetchReportData();
//   }, []);

//   const fetchReportData = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get(apiEndpoints.reports.doctorstelecaller); // Get doctors report

//       if (response.data.success) {
//         // Map the API response to the format expected by the UI
//         const mappedData = response.data.data.map((item, index) => ({
//           id: item._id || index,
//           date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//           doctor: item.doctorName || item.name || "N/A",
//           membershipType: item.membershipType || "N/A",
//           speciality: item.speciality || "N/A",
//           hospital: item.hospitalName || "N/A",
//           hospitalAddress: item.address || "N/A",
//           contact: item.mobile || item.phone || "N/A",
//           enquiry: item.enquiryType || item.leadType || "Warm",
//           status: item.status || "Pending",
//           followups: item.followupCount || 0,
//           lastFollowup: item.lastFollowup ? new Date(item.lastFollowup).toISOString().split('T')[0] : "-",
//           nextFollowup: item.nextFollowup ? new Date(item.nextFollowup).toISOString().split('T')[0] : "-",
//           quote: item.quotationAmount || item.quote || "-",
//         }));

//         setData(mappedData);
//         setFilteredData(mappedData);
//       } else {
//         toast.error("Failed to load report data");
//       }
//     } catch (error) {
//       console.error("Error fetching report data:", error);
//       setError("Failed to load report data");
//       toast.error("Failed to load report data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle filter changes
//   const handleFilterChange = (filterName, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterName]: value
//     }));
//   };

//   // Apply filters
//   const applyFilters = () => {
//     let filtered = data;

//     // Date range filter
//     if (filters.fromDate) {
//       filtered = filtered.filter(item => item.date >= filters.fromDate);
//     }
//     if (filters.toDate) {
//       filtered = filtered.filter(item => item.date <= filters.toDate);
//     }

//     // Enquiry type filter
//     if (filters.enquiryType !== 'All') {
//       filtered = filtered.filter(item => item.enquiry === filters.enquiryType);
//     }

//     // Status filter
//     if (filters.status !== 'All') {
//       filtered = filtered.filter(item => item.status === filters.status);
//     }

//     // Membership type filter
//     if (filters.membershipType !== 'All') {
//       filtered = filtered.filter(item => item.membershipType === filters.membershipType);
//     }

//     // Search term filter
//     if (filters.searchTerm) {
//       const searchLower = filters.searchTerm.toLowerCase();
//       filtered = filtered.filter(item =>
//         item.doctor.toLowerCase().includes(searchLower) ||
//         item.speciality.toLowerCase().includes(searchLower) ||
//         item.hospital.toLowerCase().includes(searchLower) ||
//         item.hospitalAddress.toLowerCase().includes(searchLower) ||
//         item.contact.includes(filters.searchTerm)
//       );
//     }

//     setFilteredData(filtered);
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       fromDate: '',
//       toDate: '',
//       enquiryType: 'All',
//       status: 'All',
//       membershipType: 'All',
//       searchTerm: ''
//     });
//     // Reset to original loaded data
//     setFilteredData(data);
//   };

//   // Export to Excel
//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
//       'Date': item.date,
//       'Doctor': item.doctor,
//       'Membership Type': item.membershipType,
//       'Speciality': item.speciality,
//       'Hospital': item.hospital,
//       'Hospital Address': item.hospitalAddress,
//       'Contact': item.contact,
//       'Enquiry': item.enquiry,
//       'Status': item.status,
//       'Follow-ups': item.followups,
//       'Last Follow-up': item.lastFollowup,
//       'Next Follow-up': item.nextFollowup,
//       'Quote (₹)': item.quote
//     })));

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Telecaller Report");

//     const today = new Date().toISOString().split('T')[0];
//     XLSX.writeFile(workbook, `Telecaller_Report_${today}.xlsx`);
//   };

//   // Get badge color classes
//   const getEnquiryBadgeClass = (enquiry) => {
//     switch (enquiry) {
//       case 'Hot':
//         return 'bg-red-100 text-red-800';
//       case 'Warm':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'Cold':
//         return 'bg-blue-100 text-blue-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusBadgeClass = (status) => {
//     return status === 'Pending'
//       ? 'bg-yellow-100 text-yellow-800'
//       : 'bg-green-100 text-green-800';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading report...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen p-4 md:p-6">
//         <div className="max-w-[79vw] mx-auto">
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">Telecaller Report</h1>
//             <p className="text-gray-600 mt-1">
//               Track and manage Telecaller enquiries, follow-ups, and membership performance based on date, enquiry type, and status.
//             </p>
//           </div>

//           <div className="text-red-500 text-center p-4 bg-red-50 rounded">
//             {error}
//             <button
//               onClick={fetchReportData}
//               className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 md:p-6">
//       <div className="max-w-[79vw] mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Telecaller Report</h1>
//           <p className="text-gray-600 mt-1">
//             Track and manage Telecaller enquiries, follow-ups, and membership performance based on date, enquiry type, and status.
//           </p>
//         </div>

//         {/* Filter Section */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//             {/* From Date */}
//             <div className="lg:col-span-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 From
//               </label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 value={filters.fromDate}
//                 onChange={(e) => handleFilterChange('fromDate', e.target.value)}
//               />
//             </div>

//             {/* To Date */}
//             <div className="lg:col-span-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 To
//               </label>
//               <input
//                 type="date"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 value={filters.toDate}
//                 onChange={(e) => handleFilterChange('toDate', e.target.value)}
//               />
//             </div>

//             {/* Enquiry Type */}
//             <div className="lg:col-span-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Enquiry Type
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 value={filters.enquiryType}
//                 onChange={(e) => handleFilterChange('enquiryType', e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="Hot">Hot</option>
//                 <option value="Warm">Warm</option>
//                 <option value="Cold">Cold</option>
//               </select>
//             </div>

//             {/* Status */}
//             <div className="lg:col-span-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 value={filters.status}
//                 onChange={(e) => handleFilterChange('status', e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>

//             {/* Membership Type */}
//             <div className="lg:col-span-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Membership Type
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 value={filters.membershipType}
//                 onChange={(e) => handleFilterChange('membershipType', e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="Individual Membership">Individual</option>
//                 <option value="Hospital Membership">Hospital</option>
//                 <option value="Individual + Hospital Membership">Individual + Hospital</option>
//               </select>
//             </div>

//             {/* Search */}
//             <div className="lg:col-span-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Search
//               </label>
//               <input
//                 type="text"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 placeholder="Type to search..."
//                 value={filters.searchTerm}
//                 onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-3 justify-end mt-4">
//             <button
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
//               onClick={resetFilters}
//             >
//               Reset
//             </button>
//             <button
//               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
//               onClick={applyFilters}
//             >
//               Generate
//             </button>
//             <button
//               className="px-4 py-2 border border-green-600 text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors text-sm font-medium"
//               onClick={exportToExcel}
//             >
//               Export to Excel
//             </button>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-green-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Sr No.
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Doctor
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Membership Type
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Speciality
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Hospital
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Hospital Address
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Contact
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Enquiry
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Follow-ups
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Last Follow-up
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Next Follow-up
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Quote (₹)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredData.length > 0 ? (
//                   filteredData.map((item, index) => (
//                     <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                         {index + 1}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                         {item.date}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {item.doctor}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                         {item.membershipType}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                         {item.speciality}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                         {item.hospital}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
//                         {item.hospitalAddress}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                         {item.contact}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEnquiryBadgeClass(item.enquiry)}`}>
//                           {item.enquiry}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
//                           {item.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
//                         {item.followups}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                         {item.lastFollowup}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                         {item.nextFollowup}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                         {item.quote !== '-' ? `₹${item.quote}` : '-'}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="14" className="px-4 py-8 text-center text-sm text-gray-500">
//                       No records found matching your filters.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TelecallerReport;





























// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const TelecallerReport = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [filters, setFilters] = useState({
//     fromDate: '',
//     toDate: '',
//     enquiryType: 'All',
//     status: 'All',
//     membershipType: 'All',
//     searchTerm: ''
//   });

//   useEffect(() => {
//     fetchReportData();
//   }, []);

//   const fetchReportData = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get(apiEndpoints.reports.doctorstelecaller);

//       if (response.data.success) {
//         const mappedData = response.data.data.map((item) => ({
//           id: item.id,
//           date: item.date,
//           doctor: item.drName,
//           membershipType: item.membership,
//           speciality: item.specialty,
//           hospital: item.hospital,
//           hospitalAddress: item.city === '-' ? '' : item.city,
//           contact: 'N/A', // agar phone chahiye to backend me add kar dena
//           enquiry: item.leadStatus.charAt(0).toUpperCase() + item.leadStatus.slice(1),
//           status: item.salesStatus.charAt(0).toUpperCase() + item.salesStatus.slice(1),
//           followups: item.followUps.replace(' FU', ''),
//           lastFollowup: item.lastFollowUp === 'No FU' ? '-' : item.lastFollowUp.split(' (')[0],
//           nextFollowup: item.nextFollowUp === '-' ? '-' : item.nextFollowUp,
//           quote: item.finalPremium === '-' ? '-' : item.finalPremium.replace('₹', '').trim(),
//         }));

//         setData(mappedData);
//         setFilteredData(mappedData);
//       } else {
//         toast.error("Failed to load report data");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setError("Failed to load report data");
//       toast.error("Failed to load report data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (filterName, value) => {
//     setFilters(prev => ({ ...prev, [filterName]: value }));
//   };

//   const applyFilters = () => {
//     let filtered = [...data];

//     if (filters.fromDate) {
//       filtered = filtered.filter(item => item.date >= filters.fromDate);
//     }
//     if (filters.toDate) {
//       filtered = filtered.filter(item => item.date <= filters.toDate);
//     }
//     if (filters.enquiryType !== 'All') {
//       filtered = filtered.filter(item => item.enquiry === filters.enquiryType);
//     }
//     if (filters.status !== 'All') {
//       filtered = filtered.filter(item => item.status === filters.status);
//     }
//     if (filters.membershipType !== 'All') {
//       const map = {
//         'Individual': 'Individual',
//         'Hospital': 'Hospital',
//         'Individual + Hospital Membership': 'Hospital + Individual'
//       };
//       filtered = filtered.filter(item => item.membershipType === map[filters.membershipType]);
//     }
//     if (filters.searchTerm) {
//       const term = filters.searchTerm.toLowerCase();
//       filtered = filtered.filter(item =>
//         item.doctor.toLowerCase().includes(term) ||
//         item.hospital.toLowerCase().includes(term) ||
//         item.speciality.toLowerCase().includes(term) ||
//         item.hospitalAddress.toLowerCase().includes(term)
//       );
//     }

//     setFilteredData(filtered);
//   };

//   const resetFilters = () => {
//     setFilters({
//       fromDate: '', toDate: '', enquiryType: 'All',
//       status: 'All', membershipType: 'All', searchTerm: ''
//     });
//     setFilteredData(data);
//   };

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
//       'Date': item.date,
//       'Doctor': item.doctor,
//       'Membership Type': item.membershipType,
//       'Speciality': item.speciality,
//       'Hospital': item.hospital,
//       'Hospital Address': item.hospitalAddress || '-',
//       'Contact': item.contact,
//       'Enquiry': item.enquiry,
//       'Status': item.status,
//       'Follow-ups': item.followups,
//       'Last Follow-up': item.lastFollowup,
//       'Next Follow-up': item.nextFollowup,
//       'Quote (₹)': item.quote !== '-' ? `₹${item.quote}` : '-'
//     })));

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Telecaller Report");
//     const today = new Date().toISOString().split('T')[0];
//     XLSX.writeFile(workbook, `Telecaller_Report_${today}.xlsx`);
//   };

//   const getEnquiryBadgeClass = (enquiry) => {
//     switch (enquiry) {
//       case 'Hot': return 'bg-red-100 text-red-800';
//       case 'Warm': return 'bg-yellow-100 text-yellow-800';
//       case 'Cold': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusBadgeClass = (status) => {
//     return status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading report...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen p-4 md:p-6">
//         <div className="max-w-[79vw] mx-auto">
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">Telecaller Report</h1>
//           </div>
//           <div className="text-red-500 text-center p-4 bg-red-50 rounded">
//             {error}
//             <button onClick={fetchReportData} className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 md:p-6">
//       <div className="max-w-[79vw] mx-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Telecaller Report</h1>
//           <p className="text-gray-600 mt-1">
//             Track and manage Telecaller enquiries, follow-ups, and membership performance based on date, enquiry type, and status.
//           </p>
//         </div>

//         {/* Filters - Same as before */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//             <div><label className="block text-sm font-medium text-gray-700 mb-1">From</label>
//               <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={filters.fromDate} onChange={e => handleFilterChange('fromDate', e.target.value)} />
//             </div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1">To</label>
//               <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={filters.toDate} onChange={e => handleFilterChange('toDate', e.target.value)} />
//             </div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1">Enquiry Type</label>
//               <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={filters.enquiryType} onChange={e => handleFilterChange('enquiryType', e.target.value)}>
//                 <option value="All">All</option>
//                 <option value="Hot">Hot</option>
//                 <option value="Warm">Warm</option>
//                 <option value="Cold">Cold</option>
//               </select>
//             </div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
//                 <option value="All">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
//               <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={filters.membershipType} onChange={e => handleFilterChange('membershipType', e.target.value)}>
//                 <option value="All">All</option>
//                 <option value="Individual Membership">Individual</option>
//                 <option value="Hospital Membership">Hospital</option>
//                 <option value="Individual + Hospital Membership">Individual + Hospital</option>
//               </select>
//             </div>
//             <div><label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//               <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="Type to search..." value={filters.searchTerm} onChange={e => handleFilterChange('searchTerm', e.target.value)} />
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-3 justify-end mt-4">
//             <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200" onClick={resetFilters}>Reset</button>
//             <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" onClick={applyFilters}>Generate</button>
//             <button className="px-4 py-2 border border-green-600 text-green-600 bg-green-50 rounded-md hover:bg-green-100" onClick={exportToExcel}>Export to Excel</button>
//           </div>
//         </div>

//         {/* Table - 100% same as your original */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-green-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sr No.</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Doctor</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Membership Type</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Speciality</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hospital</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hospital Address</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Enquiry</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Follow-ups</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Follow-up</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Next Follow-up</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quote (₹)</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredData.length > 0 ? (
//                   filteredData.map((item, index) => (
//                     <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.doctor}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.membershipType}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.speciality}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.hospital}</td>
//                       <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">{item.hospitalAddress || '-'}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.contact}</td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEnquiryBadgeClass(item.enquiry)}`}>
//                           {item.enquiry}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
//                           {item.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{item.followups}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.lastFollowup}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.nextFollowup}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                         {item.quote !== '-' ? `₹${item.quote}` : '-'}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="14" className="px-4 py-8 text-center text-sm text-gray-500">
//                       No records found matching your filters.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TelecallerReport;





































// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const TelecallerReport = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [filters, setFilters] = useState({
//     fromDate: '',
//     toDate: '',
//     enquiryType: 'All',
//     status: 'All',
//     membershipType: 'All',
//     searchTerm: ''
//   });

//   useEffect(() => {
//     fetchReportData();
//   }, []);

//   const fetchReportData = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get(apiEndpoints.reports.doctorstelecaller);

//       if (response.data.success) {
//         const mappedData = response.data.data.map((item) => ({
//           id: item.id,
//           date: item.date,
//           doctor: item.drName,
//           membershipType: item.membership,
//           speciality: item.specialty,
//           hospital: item.hospital || '-',
//           hospitalAddress: item.city === '-' ? '' : item.city,
//           contact: 'N/A',
//           leadStatus: item.leadStatus.toLowerCase(),
//           salesStatus: item.salesStatus.toLowerCase(),
//           enquiry: item.leadStatus.charAt(0).toUpperCase() + item.leadStatus.slice(1),
//           statusDisplay: item.salesStatus.charAt(0).toUpperCase() + item.salesStatus.slice(1),
//           followups: item.followUps.replace(' FU', ''),
//           lastFollowup: item.lastFollowUp === 'No FU' ? '-' : item.lastFollowUp.split(' (')[0],
//           nextFollowup: item.nextFollowUp === '-' ? '-' : item.nextFollowUp,
//           quote: item.finalPremium === '-' ? '-' : item.finalPremium.replace('₹', '').trim(),
//           rawPremium: item.finalPremium,
//         }));

//         setData(mappedData);
//         setFilteredData(mappedData);
//       } else {
//         toast.error("Failed to load report data");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setError("Failed to load report data");
//       toast.error("Failed to load report data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const applyFilters = () => {
//     let filtered = [...data];

//     // Date Range
//     if (filters.fromDate) {
//       filtered = filtered.filter(item => item.date >= filters.fromDate);
//     }
//     if (filters.toDate) {
//       filtered = filtered.filter(item => item.date <= filters.toDate);
//     }

//     // Enquiry Type (Lead Status)
//     if (filters.enquiryType !== 'All') {
//       const map = { 'Hot': 'hot', 'Warm': 'warm', 'Cold': 'cold' };
//       filtered = filtered.filter(item => item.leadStatus === map[filters.enquiryType]);
//     }

//     // Status: Pending = Not Converted, Completed = Converted
//     if (filters.status !== 'All') {
//       if (filters.status === 'Pending') {
//         filtered = filtered.filter(item => item.salesStatus !== 'converted');
//       } else if (filters.status === 'Completed') {
//         filtered = filtered.filter(item => item.salesStatus === 'converted');
//       }
//     }

//     // Membership Type
//     if (filters.membershipType !== 'All') {
//       const membershipMap = {
//         'Individual': 'Individual',
//         'Hospital': 'Hospital',
//         'Individual + Hospital': 'Hospital + Individual'
//       };
//       filtered = filtered.filter(item => item.membershipType === membershipMap[filters.membershipType]);
//     }

//     // Search
//     if (filters.searchTerm.trim()) {
//       const term = filters.searchTerm.toLowerCase().trim();
//       filtered = filtered.filter(item =>
//         item.doctor.toLowerCase().includes(term) ||
//         item.hospital.toLowerCase().includes(term) ||
//         item.speciality.toLowerCase().includes(term) ||
//         (item.hospitalAddress && item.hospitalAddress.toLowerCase().includes(term))
//       );
//     }

//     setFilteredData(filtered);
//   };

//   const resetFilters = () => {
//     setFilters({
//       fromDate: '', toDate: '', enquiryType: 'All',
//       status: 'All', membershipType: 'All', searchTerm: ''
//     });
//     setFilteredData(data);
//   };

//   const exportToExcel = () => {
//     const exportData = filteredData.map(item => ({
//       'Date': item.date,
//       'Doctor': item.doctor,
//       'Membership Type': item.membershipType,
//       'Speciality': item.speciality,
//       'Hospital': item.hospital,
//       'Hospital Address': item.hospitalAddress || '-',
//       'Contact': item.contact,
//       'Enquiry': item.enquiry,
//       'Status': item.statusDisplay,
//       'Follow-ups': item.followups,
//       'Last Follow-up': item.lastFollowup,
//       'Next Follow-up': item.nextFollowup,
//       'Quote (₹)': item.rawPremium
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Telecaller Report");
//     XLSX.writeFile(wb, `Telecaller_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
//   };

//   const getEnquiryBadgeClass = (enquiry) => {
//     switch (enquiry) {
//       case 'Hot': return 'bg-red-100 text-red-800';
//       case 'Warm': return 'bg-yellow-100 text-yellow-800';
//       case 'Cold': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusBadgeClass = (status) => {
//     return status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading report...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen p-4 md:p-6    ">
//         <div className="max-w-[79vw] mx-auto">
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">Telecaller Report</h1>
//           </div>
//           <div className="text-red-500 text-center p-4 bg-red-50 rounded">
//             {error}
//             <button onClick={fetchReportData} className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 md:p-6  max-w-[78vw]">
//       <div className="max-w-[79vw] mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Telecaller Report</h1>
//           <p className="text-gray-600 mt-1">
//             Track and manage Telecaller enquiries, follow-ups, and membership performance based on date, enquiry type, and status.
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
//               <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={filters.fromDate} onChange={e => handleFilterChange('fromDate', e.target.value)} />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
//               <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={filters.toDate} onChange={e => handleFilterChange('toDate', e.target.value)} />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry Type</label>
//               <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={filters.enquiryType} onChange={e => handleFilterChange('enquiryType', e.target.value)}>
//                 <option value="All">All</option>
//                 <option value="Hot">Hot</option>
//                 <option value="Warm">Warm</option>
//                 <option value="Cold">Cold</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
//                 <option value="All">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
//               <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={filters.membershipType} onChange={e => handleFilterChange('membershipType', e.target.value)}>
//                 <option value="All">All</option>
//                 <option value="Individual">Individual</option>
//                 <option value="Hospital">Hospital</option>
//                 <option value="Individual + Hospital">Individual + Hospital</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//               <input type="text" placeholder="Type to search..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={filters.searchTerm} onChange={e => handleFilterChange('searchTerm', e.target.value)} />
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-3 justify-end mt-4">
//             <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium" onClick={resetFilters}>Reset</button>
//             <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium" onClick={applyFilters}>Generate</button>
//             <button className="px-4 py-2 border border-green-600 text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors text-sm font-medium" onClick={exportToExcel}>Export to Excel</button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-green-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sr No.</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Doctor</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Membership Type</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Speciality</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hospital</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hospital Address</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Enquiry</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Follow-ups</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Follow-up</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Next Follow-up</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quote (₹)</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredData.length > 0 ? (
//                   filteredData.map((item, index) => (
//                     <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.doctor}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.membershipType}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.speciality}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.hospital}</td>
//                       <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">{item.hospitalAddress || '-'}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.contact}</td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEnquiryBadgeClass(item.enquiry)}`}>
//                           {item.enquiry}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(item.statusDisplay)}`}>
//                           {item.statusDisplay}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{item.followups}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.lastFollowup}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.nextFollowup}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">
//                         {item.rawPremium}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="14" className="px-4 py-8 text-center text-sm text-gray-500">
//                       No records found matching your filters.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TelecallerReport;

















































import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from 'react-toastify';

const TelecallerReport = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    enquiryType: 'All',
    status: 'All',
    membershipType: 'All',
    searchTerm: ''
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.reports.doctorstelecaller);

      if (response.data.success && response.data.data) {
        const rawData = response.data.data;

        const processedData = rawData.map(item => ({
          id: item.id,
          date: item.date, // already in DD/MM/YYYY
          doctor: item.drName || 'N/A',
          isLinked: item.isLinked || false, // Add isLinked flag
          linkedDoctorId: item.linkedDoctorId || null, // Add linked doctor ID
          relationshipType: item.relationshipType || null, // Add relationship type
          membershipType: item.membership || 'Individual',
          speciality: item.specialty || '-',
          hospital: item.hospital || '-',
          city: item.city || '-',
          leadStatus: (item.leadStatus || 'cold').toLowerCase(),
          salesStatus: (item.salesStatus || 'cold').toLowerCase(),
          followUpsCount: item.followUps ? parseInt(item.followUps) : 0,
          // lastFollowUp:
          lastFollowUp:  item.nextFollowUp === '-' ? '-' : item.nextFollowUp,
          nextFollowUp:item.lastFollowUp === 'No FU' ? '-' : item.lastFollowUp.split(' (')[0],
          finalPremium: item.finalPremium === '-' ? '-' : item.finalPremium, // keep ₹ sign
        }));

        setOriginalData(processedData);
        setFilteredData(processedData);
      } else {
        toast.error("No data received");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...originalData];

    // 1. Date Filter
    if (filters.fromDate) {
      result = result.filter(item => item.date >= filters.fromDate);
    }
    if (filters.toDate) {
      result = result.filter(item => item.date <= filters.toDate);
    }

    // 2. Enquiry Type (leadStatus)
    if (filters.enquiryType !== 'All') {
      const map = { 'Hot': 'hot', 'Warm': 'warm', 'Cold': 'cold' };
      result = result.filter(item => item.leadStatus === map[filters.enquiryType]);
    }

    // 3. Status Filter (Pending = not converted, Completed = converted)
    if (filters.status !== 'All') {
      if (filters.status === 'Pending') {
        result = result.filter(item => item.salesStatus !== 'converted');
      } else if (filters.status === 'Completed') {
        result = result.filter(item => item.salesStatus === 'converted');
      }
    }

    // 4. Membership Type
    if (filters.membershipType !== 'All') {
      let target = filters.membershipType;
      if (target === 'Individual + Hospital') target = 'Hospital + Individual';
      result = result.filter(item => item.membershipType === target);
    }

    // 5. Search
    if (filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase().trim();
      result = result.filter(item =>
        item.doctor.toLowerCase().includes(term) ||
        item.hospital.toLowerCase().includes(term) ||
        item.city.toLowerCase().includes(term) ||
        item.speciality.toLowerCase().includes(term)
      );
    }

    setFilteredData(result);
  };

  const resetFilters = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      enquiryType: 'All',
      status: 'All',
      membershipType: 'All',
      searchTerm: ''
    });
    setFilteredData(originalData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading Telecaller Report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-[79vw] mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Telecaller Report</h1>
          <p className="text-gray-600 mt-1">Track doctor leads, follow-ups, and conversions</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <input type="date" className="border rounded px-3 py-2 text-sm" value={filters.fromDate} onChange={e => setFilters({...filters, fromDate: e.target.value})} />
            <input type="date" className="border rounded px-3 py-2 text-sm" value={filters.toDate} onChange={e => setFilters({...filters, toDate: e.target.value})} />

            <select className="border rounded px-3 py-2 text-sm" value={filters.enquiryType} onChange={e => setFilters({...filters, enquiryType: e.target.value})}>
              <option value="All">All Enquiry</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>

            <select className="border rounded px-3 py-2 text-sm" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>

            <select className="border rounded px-3 py-2 text-sm" value={filters.membershipType} onChange={e => setFilters({...filters, membershipType: e.target.value})}>
              <option value="All">All Membership</option>
              <option value="Individual">Individual</option>
              <option value="Hospital">Hospital</option>
              <option value="Individual + Hospital">Individual + Hospital</option>
            </select>

            <input
              type="text"
              placeholder="Search doctor/hospital..."
              className="border rounded px-3 py-2 text-sm"
              value={filters.searchTerm}
              onChange={e => setFilters({...filters, searchTerm: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={resetFilters} className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300">Reset</button>
            <button onClick={applyFilters} className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700">Apply Filter</button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Sr</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Doctor</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Membership</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Speciality</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Hospital</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">City</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Lead</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">FU</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Last FU</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Next FU</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="13" className="text-center py-10 text-gray-500">
                      No data found for selected filters
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, i) => (
                    <tr key={item.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm">{i + 1}</td>
                      <td className="px-4 py-3 text-sm">{item.date}</td>
                      <td className="px-4 py-3 text-sm font-medium">{item.doctor}</td>
                      <td className="px-4 py-3 text-sm">{item.membershipType}</td>
                      <td className="px-4 py-3 text-sm">{item.speciality}</td>
                      <td className="px-4 py-3 text-sm">{item.hospital}</td>
                      <td className="px-4 py-3 text-sm">{item.city}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.leadStatus === 'hot' ? 'bg-red-100 text-red-800' :
                          item.leadStatus === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.leadStatus.charAt(0).toUpperCase() + item.leadStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.salesStatus === 'converted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.salesStatus === 'converted' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">{item.followUpsCount}</td>
                      <td className="px-4 py-3 text-sm">{item.lastFollowUp}</td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{item.nextFollowUp}</td>
                      <td className="px-4 py-3 text-sm font-bold text-green-600">{item.finalPremium}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelecallerReport;