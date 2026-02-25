// import React, { useState, useEffect } from 'react';
// import Table from '../../../components/mainComponents/Table';

// const SalesBill = () => {
//   const [searchName, setSearchName] = useState('Raj Sharma');
//   const [searchSBNo, setSearchSBNo] = useState('');
//   const [searchOldSBNo, setSearchOldSBNo] = useState('');
//   const [searchMembershipType, setSearchMembershipType] = useState('');
//   const [searchMembershipYear, setSearchMembershipYear] = useState('');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [data, setData] = useState([
//     { srNo: 1, sbNo: '123', oldSBNo: '12.09.25', sbDate: '12.09.25', sbType: 'New', docToName: 'Dr. Ram Kumar', membership: 'fkshfk', membershipPeriod: 'fkshfk', amount: 'fkshfk', narration: 'fkshfk', expiryDate: 'fkshfk', action: '' },
//     { srNo: 1, sbNo: '123', oldSBNo: '12.09.25', sbDate: '12.09.25', sbType: 'New', docToName: 'Dr. Ram Kumar', membership: 'fkshfk', membershipPeriod: 'fkshfk', amount: 'fkshfk', narration: 'fkshfk', expiryDate: 'fkshfk', action: '' },
//     { srNo: 1, sbNo : '123', oldSBNo: '12.09.25', sbDate: '12.09.25', sbType: 'New', docToName: 'Dr. Ram Kumar', membership: 'fkshfk', membershipPeriod: 'fkshfk', amount: 'fkshfk', narration: 'fkshfk', expiryDate: 'fkshfk', action: '' },
//   ]);

//   const fetchData = async () => {
//     // API call placeholder
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSearch = () => {
//     // Add filtering logic here based on search fields
//     const filteredData = data; // Placeholder, replace with actual filtering
//     setData(filteredData);
//   };

// //   const actions = [
// //     {
// //       label: 'Edit',
// //       icon: '✏️',
// //       showAsIcon: false,
// //       onClick: (row) => alert(`Edit ${row.sbNo}`),
// //     },
// //     {
// //       label: 'Print',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`Print ${row.sbNo}`),
// //     },
// //     {
// //       label: 'SA',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`SA for ${row.sbNo}`),
// //     },
// //     {
// //       label: 'SAWHF',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`SAWHF for ${row.sbNo}`),
// //     },
// //     {
// //       label: 'WN',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`WN for ${row.sbNo}`),
// //     },
// //     {
// //       label: 'Renewed',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`Renewed for ${row.sbNo}`),
// //     },
// //     {
// //       label: 'Renewal letter',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`Renewal letter for ${row.sbNo}`),
// //     },
// //     {
// //       label: 'Membership Form',
// //       icon: null,
// //       showAsIcon: false,
// //       onClick: (row) => alert(`Membership Form for ${row.sbNo}`),
// //     },
// //   ];

// const actions = [
//   { label: 'Edit', icon: '✏️', showAsIcon: true, onClick: (row) => alert(`Edit ${row.sbNo}`) },
//   { label: 'Print', useDropdown: true, onClick: (row) => alert(`Print ${row.sbNo}`) },
//   { label: 'SA', useDropdown: true, onClick: (row) => alert(`SA for ${row.sbNo}`) },
//   { label: 'SAWHF', useDropdown: true, onClick: (row) => alert(`SAWHF for ${row.sbNo}`) },
//   { label: 'WN', useDropdown: true, onClick: (row) => alert(`WN for ${row.sbNo}`) },
//   { label: 'Renewed', useDropdown: true, onClick: (row) => alert(`Renewed for ${row.sbNo}`) },
//   { label: 'Renewal letter', useDropdown: true, onClick: (row) => alert(`Renewal letter for ${row.sbNo}`) },
//   { label: 'Membership Form', useDropdown: true, onClick: (row) => alert(`Membership Form for ${row.sbNo}`) },
// ];

//   const extraColumns = [
//     // No extra columns needed for this layout
//   ];

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 min-h-screen mt-16">
//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-semibold text-gray-800">Sales Bill</h1>
//           <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-medium">
//             Create Sale Bill
//           </button>
//         </div>
//         <div className="grid grid-cols-5 gap-4 mb-6">
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search By Name</label>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={searchName}
//               onChange={(e) => setSearchName(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search SB No</label>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={searchSBNo}
//               onChange={(e) => setSearchSBNo(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search Old SB No</label>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={searchOldSBNo}
//               onChange={(e) => setSearchOldSBNo(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">From Date</label>
//             <input
//               type="date"
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">To Date</label>
//             <input
//               type="date"
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search Membership Type</label>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={searchMembershipType}
//               onChange={(e) => setSearchMembershipType(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search Membership Year</label>
//             <input
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               value={searchMembershipYear}
//               onChange={(e) => setSearchMembershipYear(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <Table
//           data={data}
//           extraColumns={extraColumns}
//           actions={actions}
//         />
//       </div>
//     </div>
//   );
// };

// export default SalesBill;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import Table from '../../../components/mainComponents/Table';
// import { Link } from 'react-router-dom';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const SalesBill = () => {
//   const [filters, setFilters] = useState({
//     searchName: '',
//     searchSBNo: '',
//     searchOldSBNo: '',
//     searchMembershipType: '',
//     searchMembershipYear: '',
//     fromDate: '',
//     toDate: ''
//   });

//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true); // Initially true because we load data on mount
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   const navigate = useNavigate();

//   // Function to calculate years difference between two dates
//   const calculateMembershipPeriod = (billDate, dueDate) => {
//     if (!billDate || !dueDate) return 'N/A';

//     try {
//       const start = new Date(billDate);
//       const end = new Date(dueDate);

//       if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//         return 'N/A';
//       }

//       const diffInMs = end.getTime() - start.getTime();
//       const msInYear = 1000 * 60 * 60 * 24 * 365.25;
//       const years = diffInMs / msInYear;
//       const roundedYears = Math.round(years);

//       if (roundedYears === 0) {
//         const months = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
//         return months > 0 ? `${months} Month${months > 1 ? 's' : ''}` : '< 1 Month';
//       }

//       return `${roundedYears} Year${roundedYears > 1 ? 's' : ''}`;
//     } catch (error) {
//       console.error('Error calculating membership period:', error);
//       return 'N/A';
//     }
//   };

//   // Function to extract year from date for filtering
//   const getYearFromDate = (dateString) => {
//     if (!dateString) return null;
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return null;
//       return date.getFullYear();
//     } catch (error) {
//       return null;
//     }
//   };

//   // Fetch data function (default: no search filters)
//   const fetchData = async (page = 1, applySearch = false) => {
//     try {
//       setLoading(true);

//       let query = {
//         page,
//         limit: 15 // Increased page size
//       };

//       // Only add search filters if applySearch is true
//       if (applySearch) {
//         if (filters.searchName.trim()) query.search = filters.searchName.trim();
//         if (filters.searchSBNo.trim()) query.billNumber = filters.searchSBNo.trim();
//         if (filters.searchOldSBNo.trim()) query.oldBillNumber = filters.searchOldSBNo.trim();
//         if (filters.searchMembershipType.trim()) query.membershipType = filters.searchMembershipType.trim();

//         if (filters.fromDate || filters.toDate) {
//           if (filters.fromDate) query.dateFrom = filters.fromDate;
//           if (filters.toDate) query.dateTo = filters.toDate;
//         }
//       }

//       const response = await apiClient.get(apiEndpoints.salesBills.list, { params: query });

//       if (response.data.success) {
//         const transformedData = response.data.data.map((bill, index) => {
//           const membershipPeriod = calculateMembershipPeriod(bill.billDate, bill.dueDate);
//           const billYear = getYearFromDate(bill.billDate);

//           return {
//             id: bill.billId || bill._id,
//             srNo: index + 1,
//             sbNo: bill.billNumber,
//             oldSBNo: bill.relatedDocuments?.quotationId || '',
//             sbDate: bill.billDate ? new Date(bill.billDate).toLocaleDateString('en-GB') : '',
//             sbType: bill.status === 'draft' ? 'New' : bill.status.charAt(0).toUpperCase() + bill.status.slice(1),
//             doctorName: bill.client?.name || '',
//             membership: bill.items?.length > 0 ? bill?.membershipType || 'N/A' : 'N/A',
//             membershipPeriod: membershipPeriod,
//             amount: `₹${bill.totalAmount?.toLocaleString('en-IN') || '0'}`,
//             narration: bill.notes || '',
//             expiryDate: bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-GB') : '',
//             billYear: billYear,
//             _id: bill._id,
//             client: bill.client
//           };
//         });

//         setData(transformedData);

//         // Apply membership year filter on frontend only if search is applied and year filter exists
//         if (applySearch && filters.searchMembershipYear.trim()) {
//           const filtered = transformedData.filter(item => {
//             if (!item.billYear) return false;
//             return item.billYear.toString() === filters.searchMembershipYear.trim();
//           });
//           setFilteredData(filtered);
//           setIsSearchApplied(true);
//         } else {
//           setFilteredData(transformedData);
//           setIsSearchApplied(applySearch);
//         }

//         if (response.data.pagination) {
//           setTotalPages(response.data.pagination.pages || 1);
//           setTotalCount(response.data.pagination.total || 0);
//         }
//       } else {
//         toast.error(response.data.message || 'Failed to fetch sales bills');
//         setData([]);
//         setFilteredData([]);
//       }
//     } catch (error) {
//       console.error('Error fetching sales bills:', error);
//       toast.error(error.response?.data?.message || 'Error fetching sales bills');
//       setData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load all data on component mount
//   useEffect(() => {
//     fetchData(1, false); // Load all data without any filters initially
//   }, []);

//   // Handle filter change
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle search button click
//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1);

//     const hasAnyFilter =
//       filters.searchName.trim() ||
//       filters.searchSBNo.trim() ||
//       filters.searchOldSBNo.trim() ||
//       filters.searchMembershipType.trim() ||
//       filters.searchMembershipYear.trim() ||
//       filters.fromDate ||
//       filters.toDate;

//     if (hasAnyFilter) {
//       fetchData(1, true);
//     } else {
//       fetchData(1, false);
//       toast.info('No filters applied, showing all bills');
//     }
//   };

//   // Clear all filters and reload all data
//   const handleClearFilters = () => {
//     const resetFilters = {
//       searchName: '',
//       searchSBNo: '',
//       searchOldSBNo: '',
//       searchMembershipType: '',
//       searchMembershipYear: '',
//       fromDate: '',
//       toDate: ''
//     };

//     setFilters(resetFilters);
//     setCurrentPage(1);
//     setIsSearchApplied(false);

//     // Reload all data without filters
//     fetchData(1, false);
//     toast.success('All filters cleared, showing all bills');
//   };

//   const deleteSalesBill = async (row) => {
//     if (window.confirm(`Are you sure you want to delete sales bill ${row.sbNo}?`)) {
//       try {
//         const response = await apiClient.delete(apiEndpoints.salesBills.delete(row._id));

//         if (response.data.success) {
//           toast.success('Sales bill deleted successfully!');
//           fetchData(currentPage); // Refresh current page
//         } else {
//           toast.error(response.data.message || 'Failed to delete sales bill');
//         }
//       } catch (error) {
//         console.error('Error deleting sales bill:', error);
//         toast.error(error.response?.data?.message || 'Error deleting sales bill');
//       }
//     }
//   };

//   useEffect(() => {
//     fetchData(currentPage);
//   }, [currentPage]);

//   // Handle search
//   // const handleSearch = (e) => {
//   //   e.preventDefault();
//   //   setCurrentPage(1); // Reset to first page when searching
//   //   fetchData(1);
//   // };

//   const actions = [
//     { label: 'Edit', useDropdown: true, onClick: (row) => navigate(`/admin/edit-salesbill/${row._id}`) },
//     { label: 'Print', useDropdown: true, onClick: (row) => navigate(`/admin/salesbill/print/${row._id}`) },
//     { label: 'SA', useDropdown: true, onClick: (row) => navigate(`/admin/salesbill/sa/${row._id}`) },
//     { label: 'SAWHF', useDropdown: true, onClick: (row) => console.log(`SAWHF for ${row.sbNo}`) },
//     { label: 'WN', useDropdown: true, onClick: (row) => navigate(`/admin/salesbill/WN/${row._id}`) },
//     {
//       label: 'Renewed',
//       useDropdown: true,
//       onClick: (row) => {
//         if (row.sbType !== 'Renewal') {
//           toast.warn('This action is only available for Renewal bills');
//           return;
//         }
//         navigate(`/admin/salesbill/renewed/${row._id}`);
//       }
//     },
//     {
//       label: 'Renewal letter',
//       useDropdown: true,
//       onClick: (row) => {
//         if (row.sbType !== 'Renewal') {
//           toast.warn('This action is only available for Renewal bills');
//           return;
//         }
//         navigate(`/admin/salesbill/rwnl/${row._id}`);
//       }
//     },
//     { label: 'Membership Form', useDropdown: true, onClick: (row) => console.log(`Membership Form for ${row.sbNo}`) },
//     { label: 'Delete', useDropdown: false, onClick: deleteSalesBill, danger: true }, // Added delete action
//   ];

//   const extraColumns = [];

//   const hasActiveFilters = Object.values(filters).some(value => value.trim() !== '');

//   return (
//     <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 min-h-screen py-4">
//       <div className="mb-4 sm:mb-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
//           <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800">Sales Bill</h1>
//           <Link to="/admin/add-salesbill">
//             <button className="w-full sm:w-auto px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-medium text-sm sm:text-base">
//               Create Sale Bill
//             </button>
//           </Link>
//         </div>

//         {/* Search Form */}
//         <form onSubmit={handleSearch} className="mb-4 sm:mb-6">
//           {/* First Row - 5 fields */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4">
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search By Name</label>
//               <input
//                 name="searchName"
//                 className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
//                 value={filters.searchName}
//                 onChange={handleFilterChange}
//                 placeholder="Doctor name"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search SB No</label>
//               <input
//                 name="searchSBNo"
//                 className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
//                 value={filters.searchSBNo}
//                 onChange={handleFilterChange}
//                 placeholder="Bill number"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search Old SB No</label>
//               <input
//                 name="searchOldSBNo"
//                 className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
//                 value={filters.searchOldSBNo}
//                 onChange={handleFilterChange}
//                 placeholder="Old bill number"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">From Date</label>
//               <input
//                 type="date"
//                 name="fromDate"
//                 className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
//                 value={filters.fromDate}
//                 onChange={handleFilterChange}
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">To Date</label>
//               <input
//                 type="date"
//                 name="toDate"
//                 className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
//                 value={filters.toDate}
//                 onChange={handleFilterChange}
//               />
//             </div>
//           </div>

//           {/* Second Row */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search Membership Type</label>
//               <input
//                 name="searchMembershipType"
//                 className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
//                 value={filters.searchMembershipType}
//                 onChange={handleFilterChange}
//                 placeholder="Membership type"
//               />
//             </div>

//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search Membership Year</label>
//               <input
//                 type="text"
//                 name="searchMembershipYear"
//                 className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
//                 value={filters.searchMembershipYear}
//                 onChange={handleFilterChange}
//                 placeholder="e.g., 2025"
//               />
//             </div>

//             <div className="flex items-end">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium text-xs sm:text-sm flex items-center justify-center"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Searching...
//                   </>
//                 ) : (
//                   'Search'
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Clear Filters button */}
//           {(hasActiveFilters || isSearchApplied) && (
//             <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
//               <button
//                 type="button"
//                 onClick={handleClearFilters}
//                 disabled={loading}
//                 className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors font-medium text-xs sm:text-sm"
//               >
//                 Clear All Filters
//               </button>

//               {hasActiveFilters && (
//                 <span className="text-xs sm:text-sm text-gray-600 font-medium">
//                   ({Object.values(filters).filter(v => v.trim() !== '').length} filter{Object.values(filters).filter(v => v.trim() !== '').length > 1 ? 's' : ''} selected)
//                 </span>
//               )}
//             </div>
//           )}
//         </form>

//         {/* Search status */}
//         {isSearchApplied && !loading && (
//           <div className="mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//               <div className="flex items-center">
//                 <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                 </svg>
//                 <span className="text-xs sm:text-sm font-medium text-blue-800">
//                   {filters.searchMembershipYear ? (
//                     <>Filtered by bill year: <span className="font-bold">{filters.searchMembershipYear}</span></>
//                   ) : (
//                     <>Filters applied</>
//                   )}
//                 </span>
//               </div>
//               <div className="text-xs sm:text-sm font-medium text-blue-700">
//                 Showing {filteredData.length} of {data.length} bills
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {loading ? (
//         <div className="flex flex-col justify-center items-center h-48 sm:h-64 md:h-80">
//           <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-teal-500"></div>
//           <p className="mt-4 text-sm sm:text-base text-gray-600 font-medium">Loading sales bills...</p>
//         </div>
//       ) : filteredData.length === 0 ? (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
//           <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2a2 2 0 00-2 2v-2a2 2 0 012-2h2z" />
//           </svg>
//           <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">No sales bills found</h3>
//           <p className="mt-2 text-sm sm:text-base text-gray-500">
//             {isSearchApplied ? 'Try adjusting your filters' : 'There are no sales bills yet'}
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//             <Table
//               data={data}
//               extraColumns={extraColumns}
//               actions={actions}
//               headers={[
//                 "Sr No.",
//                 "SB No",
//                 "Old SB No",
//                 "SB Date",
//                 "SB Type",
//                 "Doctor Name",
//                 "Membership",
// "Membership Period",
//                 "Amount",
//                 "Narration",
//                 "Expiry Date"
//               ]}
//               excludeColumns={['billYear']}
//               columnOrder={['srNo',]}
//               pagination={true}
//             />
//           </div>

//         </>
//       )}
//     </div>
//   );
// };

// export default SalesBill;





















// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import Table from '../../../components/mainComponents/Table';
// import { Link } from 'react-router-dom';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const SalesBill = () => {
//   const [filters, setFilters] = useState({
//     searchName: '',
//     searchSBNo: '',
//     searchOldSBNo: '',
//     searchMembershipType: '',
//     searchMembershipYear: '',
//     fromDate: '',
//     toDate: ''
//   });

//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [isSearchApplied, setIsSearchApplied] = useState(false);

//   const navigate = useNavigate();

//   const calculateMembershipPeriod = (billDate, dueDate) => {
//     if (!billDate || !dueDate) return 'N/A';
//     try {
//       const start = new Date(billDate);
//       const end = new Date(dueDate);
//       if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'N/A';

//       const diffInMs = end.getTime() - start.getTime();
//       const msInYear = 1000 * 60 * 60 * 24 * 365.25;
//       const years = diffInMs / msInYear;
//       const roundedYears = Math.round(years);

//       if (roundedYears === 0) {
//         const months = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
//         return months > 0 ? `${months} Month${months > 1 ? 's' : ''}` : '< 1 Month';
//       }
//       return `${roundedYears} Year${roundedYears > 1 ? 's' : ''}`;
//     } catch (error) {
//       console.error('Error calculating membership period:', error);
//       return 'N/A';
//     }
//   };

//   const getYearFromDate = (dateString) => {
//     if (!dateString) return null;
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? null : date.getFullYear();
//   };

//   const fetchData = async (page = 1, applySearch = false) => {
//     try {
//       setLoading(true);

//       let query = { page, limit: 1000 };

//       if (applySearch) {
//         if (filters.searchName.trim()) query.search = filters.searchName.trim();
//         if (filters.searchSBNo.trim()) query.billNumber = filters.searchSBNo.trim();
//         if (filters.searchOldSBNo.trim()) query.oldBillNumber = filters.searchOldSBNo.trim();
//         if (filters.searchMembershipType.trim()) query.membershipType = filters.searchMembershipType.trim();
//         if (filters.fromDate) query.dateFrom = filters.fromDate;
//         if (filters.toDate) query.dateTo = filters.toDate;
//       }

//       const response = await apiClient.get(apiEndpoints.salesBills.list, { params: query });

//       if (response.data.success) {
//         const transformedData = response.data.data.map((bill, index) => {
//           const membershipPeriod = calculateMembershipPeriod(bill.billDate, bill.dueDate);
//           const billYear = getYearFromDate(bill.billDate);

//           // Helper to format date strictly from ISO string (UTC) to DD/MM/YYYY
//           // avoiding local timezone conversion shifts
//           const formatDate = (isoString) => {
//             if (!isoString) return '';
//             return isoString.split('T')[0].split('-').reverse().join('/');
//           };

// const isMonthly = bill.membershipType === 'monthly';
//   const itemAmount =
//     bill.items && bill.items.length > 0 ? bill.items[0].amount : 0;

//   const displayAmount = isMonthly ? itemAmount : bill.totalAmount;

//           return {
//             id: bill.billId || bill._id,
//             srNo: (page - 1) * 15 + index + 1,
//             sbNo: bill.billNumber || '',
//             oldSBNo: bill.renewalFrom || '',
//             sbDate: formatDate(bill.billDate),
//             sbType: bill.status === 'draft' ? 'New' : bill.status.charAt(0).toUpperCase() + bill.status.slice(1),
//             doctorName: bill.client?.name || '',
//             membership: bill.membershipType || 'N/A',
//             membershipPeriod: membershipPeriod,
//             // amount: `₹${(bill.totalAmount || 0).toLocaleString('en-IN')}`,
//             amount: `₹${(displayAmount || 0).toLocaleString('en-IN')}`,

//             narration: bill.notes || '',
//             expiryDate: formatDate(bill.dueDate),
//             billYear: billYear,
//             _id: bill._id,
//             client: bill.client
//           };
//         });

//         setData(transformedData);

//         let finalData = transformedData;
//         if (applySearch && filters.searchMembershipYear.trim()) {
//           finalData = transformedData.filter(item =>
//             item.billYear?.toString() === filters.searchMembershipYear.trim()
//           );
//         }

//         setFilteredData(finalData);
//         setIsSearchApplied(applySearch);

//         if (response.data.pagination) {
//           setTotalPages(response.data.pagination.pages || 1);
//           setTotalCount(response.data.pagination.total || 0);
//         }
//       } else {
//         toast.error(response.data.message || 'Failed to fetch sales bills');
//         setData([]);
//         setFilteredData([]);
//       }
//     } catch (error) {
//       console.error('Error fetching sales bills:', error);
//       toast.error(error.response?.data?.message || 'Error fetching sales bills');
//       setData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(1, false);
//   }, []);

//   useEffect(() => {
//     const hasAnyFilter = Object.values(filters).some(v => v.toString().trim() !== '');
//     fetchData(currentPage, hasAnyFilter);
//   }, [currentPage]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1);
//     const hasAnyFilter = Object.values(filters).some(v => v.toString().trim() !== '');
//     fetchData(1, hasAnyFilter);
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       searchName: '',
//       searchSBNo: '',
//       searchOldSBNo: '',
//       searchMembershipType: '',
//       searchMembershipYear: '',
//       fromDate: '',
//       toDate: ''
//     });
//     setCurrentPage(1);
//     setIsSearchApplied(false);
//     fetchData(1, false);
//     toast.success('All filters cleared');
//   };

//   const deleteSalesBill = async (row) => {
//     if (window.confirm(`Are you sure you want to delete sales bill ${row.sbNo}?`)) {
//       try {
//         const response = await apiClient.delete(apiEndpoints.salesBills.delete(row._id));
//         if (response.data.success) {
//           toast.success('Sales bill deleted successfully!');
//           const hasFilters = Object.values(filters).some(v => v.toString().trim() !== '');
//           fetchData(currentPage, hasFilters);
//         } else {
//           toast.error(response.data.message || 'Failed to delete');
//         }
//       } catch (error) {
//         toast.error(error.response?.data?.message || 'Error deleting sales bill');
//       }
//     }
//   };

// const isRenewalNear = (expiryDateStr) => {
//   if (!expiryDateStr || expiryDateStr.trim() === '') {
//     return false;
//   }

//   // Parse DD/MM/YYYY string safely
//   const parts = expiryDateStr.split('/');
//   if (parts.length !== 3) return false;

//   const day   = Number(parts[0]);
//   const month = Number(parts[1]);
//   const year  = Number(parts[2]);

//   // Invalid date check
//   if (isNaN(day) || isNaN(month) || isNaN(year)) return false;

//   // Create expiry date → end of that day (23:59:59)
//   const expiry = new Date(year, month - 1, day, 23, 59, 59);

//   // Invalid date (e.g. 32/13/2025)
//   if (isNaN(expiry.getTime())) return false;

//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // start of today

//   const diffMs = expiry - today;
//   const daysUntilExpiry = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

//   // ──────────────────────────────────────────────
//   // Your exact rule:
//   // visible if: already expired OR expires today OR expires in ≤ 7 days
//   // ──────────────────────────────────────────────
//   return daysUntilExpiry <= 7;
//   // ──────────────────────────────────────────────
// };

//   const actions = [
//     { label: 'Edit', useDropdown: true, onClick: (row) => navigate(`/admin/edit-salesbill/${row._id}`) },
//     { label: 'Print', useDropdown: true, onClick: (row) => navigate(`/admin/salesbill/print/${row._id}`) },
//     // { label: 'SA', useDropdown: true, onClick: (row) => navigate(`/admin/salesbill/sa/${row._id}`) },
//     {
//       label: 'SA', useDropdown: true, onClick: (row) => {
//         const membershipType = row.membership.toLowerCase();
//         const path = membershipType === 'monthly' ? `/admin/salesbill/sa/monthly/${row._id}` : `/admin/salesbill/sa/yearly/${row._id}`;
//         navigate(path);
//       }
//     },
//     // { label: 'SAWHF', useDropdown: true, onClick: (row) => console.log(`SAWHF for ${row.sbNo}`) },
//     // SAWHF ke liye

//     {
//       label: 'SAWHF',
//       useDropdown: true,
//       onClick: (row) => {
//         const membershipType = row.membership.toLowerCase();
//         const path = `/admin/salesbill/sa-whf/${membershipType}/${row._id}`;
//         navigate(path);
//       }
//     },

//     { label: 'WN', useDropdown: true, onClick: (row) => navigate(`/admin/salesbill/WN/${row._id}`) },
//     {
//       label: 'Renewed',
//       useDropdown: true,
//       onClick: (row) => {
//         if (row.sbType !== 'Renewal') {
//           toast.warn('This action is only available for Renewal bills');
//           return;
//         }
//         navigate(`/admin/salesbill/renewed/${row._id}`);
//       }
//     },
// {
//   label: 'Renewal letter',
//   useDropdown: true,
//   onClick: (row) => {
//     // Must be original bill
//     if (row.oldSBNo) {
//       toast.warn('Renewal letter is only available for the original (source) bill.');
//       return;
//     }

//     // Safety check (shouldn't happen if data is clean)
//     if (row.sbType === 'Renewal') {
//       toast.warn('This is a renewed bill. Letter is attached to the original.');
//       return;
//     }

//     // The key check: is expiry near / already expired / up to 7 days future
//     if (!isRenewalNear(row.expiryDate)) {
//       toast.info(`Renewal letter is not yet available.\nExpiry: ${row.expiryDate}`);
//       return;
//     }

//     // All good → show letter
//     navigate(`/admin/salesbill/rwnl/${row._id}`);
//   }
// },
//     { label: 'Membership Form', useDropdown: true, onClick: (row) => navigate(`/admin/salesbill/membership-form/${row._id}`) },
//     { label: 'Delete', useDropdown: false, onClick: deleteSalesBill, danger: true },
//   ];

//   // Count how many filters are active
//   const activeFilterCount = Object.values(filters).filter(v => v.toString().trim() !== '').length;
//   const hasActiveFilters = activeFilterCount > 0;

//   return (
//     <div className="md:w-[70vw]  mx-auto px-2 sm:px-4 md:px-6 lg:px-4 min-h-screen py-4 lg:w-[80vw]">
//       <div className="mb-4 sm:mb-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
//           <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800">Sales Bill</h1>
//           <Link to="/admin/add-salesbill">
//             <button className="w-full sm:w-auto px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-medium text-sm sm:text-base">
//               Create Sale Bill
//             </button>
//           </Link>
//         </div>

//         <form onSubmit={handleSearch} className="mb-4 sm:mb-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4">
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search By Name</label>
//               <input name="searchName" value={filters.searchName} onChange={handleFilterChange} placeholder="Doctor name" className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search SB No</label>
//               <input name="searchSBNo" value={filters.searchSBNo} onChange={handleFilterChange} placeholder="Bill number" className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search Old SB No</label>
//               <input name="searchOldSBNo" value={filters.searchOldSBNo} onChange={handleFilterChange} placeholder="Old bill number" className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">From Date</label>
//               <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">To Date</label>
//               <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search Membership Type</label>
//               <input name="searchMembershipType" value={filters.searchMembershipType} onChange={handleFilterChange} placeholder="Membership type" className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search Membership Year</label>
//               <input type="text" name="searchMembershipYear" value={filters.searchMembershipYear} onChange={handleFilterChange} placeholder="e.g., 2025" className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm" />
//             </div>
//             <div className="flex items-end">
//               <button type="submit" disabled={loading} className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors font-medium text-xs sm:text-sm flex items-center justify-center">
//                 {loading ? 'Searching...' : 'Search'}
//               </button>
//             </div>
//           </div>

//           {/* Clear Filters + Active Filter Count */}
//           {(hasActiveFilters || isSearchApplied) && (
//             <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
//               <button
//                 type="button"
//                 onClick={handleClearFilters}
//                 disabled={loading}
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300 font-medium text-sm transition-colors"
//               >
//                 Clear All Filters
//               </button>

//               {hasActiveFilters && (
//                 <span className="text-sm font-medium text-gray-600 flex items-center">
//                   <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-bold mr-2">
//                     {activeFilterCount}
//                   </span>
//                   filter{activeFilterCount > 1 ? 's' : ''} selected
//                 </span>
//               )}
//             </div>
//           )}
//         </form>
//       </div>

//       {loading ? (
//         <div className="flex flex-col items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600"></div>
//           <p className="mt-4 text-gray-600">Loading sales bills...</p>
//         </div>
//       ) : filteredData.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg border">
//           <h3 className="text-lg font-medium text-gray-900">No sales bills found</h3>
//           <p className="mt-2 text-gray-500">
//             {isSearchApplied ? 'Try adjusting your search filters' : 'No bills have been created yet'}
//           </p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow border overflow-hidden">
//           <div className="overflow-x-auto">
//             {/* Table height auto - no fixed height, no row cutting */}
//             <Table
//               data={filteredData}
//               actions={actions}
//               headers={[
//                 "Sr No.",
//                 "SB No",
//                 "Old SB No",
//                 "SB Date",
//                 "SB Type",
//                 "Doctor Name",
//                 "Membership",
//                 "Membership Period",
//                 "Amount",
//                 "Narration",
//                 "Expiry Date"
//               ]}
//               excludeColumns={['id', 'billYear', '_id', 'client']}
//               pagination={{
//                 currentPage,
//                 totalPages,
//                 totalCount,
//                 onPageChange: setCurrentPage
//               }}
//             // Agar Table component mein height prop ho to remove karo, ya auto set karo
//             // height="auto"  // Agar support karta hai to
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesBill;





















import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Table from '../../../components/mainComponents/Table';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from 'react-toastify';

const ReceiptList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);       // can be changed by user in table
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');   // simple global search – adjust as needed
  // Add more filters if your receipt list has them (date range, receipt number, patient name, etc.)

  const navigate = useNavigate();

  const fetchReceipts = async (page = 1, limit = pageSize) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit,
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      // Add more filters here when you have them, example:
      // if (filters.fromDate) params.dateFrom = filters.fromDate;
      // if (filters.paymentMode) params.paymentMode = filters.paymentMode;

      const response = await apiClient.get(apiEndpoints.receipts.list, { params });

      if (response.data.success) {
        const formattedData = response.data.data.map(receipt => ({
          id: receipt._id,
          receiptNo: receipt.receiptNumber || `REC-${receipt._id.slice(-6).toUpperCase()}`,
          receiptDate: new Date(receipt.receiptDate || receipt.createdAt).toLocaleDateString('en-GB'),
          patientName: receipt.patient?.name || receipt.partyName || 'N/A',
          amount: `₹${(receipt.amount || 0).toLocaleString('en-IN')}`,
          paymentMode: receipt.paymentMode || 'N/A',
          billNo: receipt.relatedBill?.billNumber || '-',
          status: receipt.status || 'active',
          // add more fields your table needs
          _raw: receipt, // optional – if you need full object later
        }));

        setData(formattedData);

        if (response.data.pagination) {
          setTotalItems(response.data.pagination.total || 0);
        }
      } else {
        toast.error(response.data.message || 'Failed to load receipts');
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
      toast.error('Error loading receipts');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchReceipts(1, pageSize);
  }, []);

  // Re-fetch on page / size / search change
  useEffect(() => {
    fetchReceipts(currentPage, pageSize);
  }, [currentPage, pageSize, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // fetch will be triggered by useEffect
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete receipt ${row.receiptNo}?`)) return;

    try {
      await apiClient.delete(apiEndpoints.receipts.delete(row.id));
      toast.success('Receipt deleted');
      fetchReceipts(currentPage, pageSize);
    } catch (err) {
      toast.error('Failed to delete receipt');
    }
  };

  const actions = [
    {
      label: 'View',
      onClick: (row) => navigate(`/admin/receipt/view/${row.id}`),
    },
    {
      label: 'Print',
      onClick: (row) => window.open(`/admin/receipt/print/${row.id}`, '_blank'),
    },
    {
      label: 'Delete',
      danger: true,
      onClick: handleDelete,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Receipts</h2>
        {/* <button onClick={() => navigate("/admin/create-receipt")}>+ New Receipt</button> */}
      </div>

      {/* Search + filters bar */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by receipt no, patient name, bill no..."
          className="px-4 py-2 border border-gray-300 rounded-lg flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button type="submit" className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
          Search
        </button>
        <button
          type="button"
          onClick={handleClearSearch}
          className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Clear
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900">No receipts found</h3>
          <p className="mt-2 text-gray-500">
            {searchTerm ? 'Try adjusting your search' : 'No receipts recorded yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <Table
              data={data}
              actions={actions}
              headers={[
                "Receipt No",
                "Date",
                "Patient / Party",
                "Amount",
                "Payment Mode",
                "Bill No",
                // "Status" // add if needed
              ]}
              excludeColumns={['id', '_raw']}
              pagination={true}
              serverPagination={true}
              totalServerItems={totalItems}
              currentServerPage={currentPage}
              defaultPageSize={pageSize}
              onPageChange={(newPage) => setCurrentPage(newPage)}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptList;