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
// import Table from '../../components/mainComponents/Table';
// import { Link } from 'react-router-dom';
// import apiClient, { apiEndpoints } from '../../services/apiClient';
// import { toast } from 'react-toastify';

// const SalesBill = () => {
//   const [searchName, setSearchName] = useState('');
//   const [searchSBNo, setSearchSBNo] = useState('');
//   const [searchOldSBNo, setSearchOldSBNo] = useState('');
//   const [searchMembershipType, setSearchMembershipType] = useState('');
//   const [searchMembershipYear, setSearchMembershipYear] = useState('');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);



//   const navigate = useNavigate();

//   const fetchData = async (page = 1) => {
//     try {
//       setLoading(true);

//       let query = {
//         page,
//         limit: 15 // Increased page size
//       };

//       // Add search filters
//       if (searchName) query.search = searchName;
//       if (searchSBNo) query.billNumber = searchSBNo;
//       if (searchOldSBNo) query.oldBillNumber = searchOldSBNo;
//       if (searchMembershipType) query.membershipType = searchMembershipType;
//       if (searchMembershipYear) query.membershipYear = searchMembershipYear;
//       if (fromDate || toDate) {
//         if (fromDate) query.dateFrom = fromDate;
//         if (toDate) query.dateTo = toDate;
//       }

//       const response = await apiClient.get(apiEndpoints.salesBills.list, { params: query });

//       if (response.data.success) {
//         // Transform backend data to match frontend table structure
//         const transformedData = response.data.data.map((bill, index) => ({
//           id: bill.billId || bill._id, // Use billId if available, otherwise use _id
//           srNo: (page - 1) * 15 + index + 1, // Proper sequential numbering
//           sbNo: bill.billNumber,
//           oldSBNo: bill.relatedDocuments?.quotationId || '', // If related to old bill
//           sbDate: bill.billDate ? new Date(bill.billDate).toLocaleDateString('en-GB') : '',
//           sbType: bill.status === 'draft' ? 'New' : bill.status.charAt(0).toUpperCase() + bill.status.slice(1),
//           docToName: bill.client?.name || '',
//           membership: bill.items?.length > 0 ? bill?.membershipType || 'N/A' : 'N/A',
//           membershipPeriod: bill.servicePeriod
//             ? `${bill.servicePeriod.startDate ? new Date(bill.servicePeriod.startDate).toLocaleDateString('en-GB') : ''} - ${bill.servicePeriod.endDate ? new Date(bill.servicePeriod.endDate).toLocaleDateString('en-GB') : ''}`
//             : '',
//           amount: `₹${bill.totalAmount?.toLocaleString('en-IN') || '0'}`,
//           narration: bill.notes || '',
//           expiryDate: bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-GB') : '',
//           _id: bill._id, // Keep the original _id for operations
//           client: bill.client
//         }));

//         setData(transformedData);

//         if (response.data.pagination) {
//           setTotalPages(response.data.pagination.pages || 1);
//           setTotalCount(response.data.pagination.total || 0);
//         }
//       } else {
//         toast.error(response.data.message || 'Failed to fetch sales bills');
//       }
//     } catch (error) {
//       console.error('Error fetching sales bills:', error);
//       toast.error(error.response?.data?.message || 'Error fetching sales bills');
//     } finally {
//       setLoading(false);
//     }
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
//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1); // Reset to first page when searching
//     fetchData(1);
//   };

//   const actions = [
//     { label: 'Edit', useDropdown: true, onClick: (row) => navigate(`/admin/edit-salesbill/${row._id}`) },
//     {
//   label: 'Print',
//   useDropdown: true,
//   onClick: (row) => {
//     // Option 1: Simple navigation (best for most cases)
//     navigate(`/admin/salesbill/print/${row._id}`);

//     // Ya phir billNumber se bhi kar sakta hai (agar _id nahi hai toh)
//     // navigate(`/admin/salesbill/print/${row.billNumber}`);
//   }
// },
//   {
//   label: 'SA',
//   useDropdown: true,
//   onClick: (row) => {
//     // Option 1: Simple navigation (best for most cases)
//     navigate(`/admin/salesbill/sa/${row._id}`);

//     // Ya phir billNumber se bhi kar sakta hai (agar _id nahi hai toh)
//     // navigate(`/admin/salesbill/print/${row.billNumber}`);
//   }
// },

//     // { label: 'Print', useDropdown: true, onClick: (row) => console.log(`Print ${row.sbNo}`) },
//     // { label: 'SA', useDropdown: true, onClick: (row) => console.log(`SA for ${row.sbNo}`) },
//     { label: 'SAWHF', useDropdown: true, onClick: (row) => console.log(`SAWHF for ${row.sbNo}`) },
//     // { label: 'WN', useDropdown: true, onClick: (row) => console.log(`WN for ${row.sbNo}`) },


//      {
//   label: 'WN',
//   useDropdown: true,
//   onClick: (row) => {
//     // Option 1: Simple navigation (best for most cases)
//     navigate(`/admin/salesbill/WN/${row._id}`);

//     // Ya phir billNumber se bhi kar sakta hai (agar _id nahi hai toh)
//     // navigate(`/admin/salesbill/print/${row.billNumber}`);
//   }
// },
//     // { label: 'Renewed', useDropdown: true, onClick: (row) => console.log(`Renewed for ${row.sbNo}`) },

// //     {
// //   label: 'Renewed',
// //   useDropdown: true,
// //   onClick: (row) => {
// //     // Option 1: Simple navigation (best for most cases)
// //     navigate(`/admin/salesbill/renewed/${row._id}`);

// //     // Ya phir billNumber se bhi kar sakta hai (agar _id nahi hai toh)
// //     // navigate(`/admin/salesbill/print/${row.billNumber}`);
// //   }
// // },

// //     {
// //   label: 'Renewal letter',
// //   useDropdown: true,
// //   onClick: (row) => {
// //     // Option 1: Simple navigation (best for most cases)
// //     navigate(`/admin/salesbill/rwnl/${row._id}`);

// //     // Ya phir billNumber se bhi kar sakta hai (agar _id nahi hai toh)
// //     // navigate(`/admin/salesbill/print/${row.billNumber}`);
// //   }
// // },



// {
//   label: 'Renewed',
//   useDropdown: true,
//   onClick: (row) => {
//     if (row.sbType !== 'Renewal') {
//       toast.warn('This action is only available for Renewal bills');
//       return;
//     }
//     navigate(`/admin/salesbill/renewed/${row._id}`);
//   }
// },

// {
//   label: 'Renewal letter',
//   useDropdown: true,
//   onClick: (row) => {
//     if (row.sbType !== 'Renewal') {
//       toast.warn('This action is only available for Renewal bills');
//       return;
//     }
//     navigate(`/admin/salesbill/rwnl/${row._id}`);
//   }
// },




//     // { label: 'Renewal letter', useDropdown: true, onClick: (row) => console.log(`Renewal letter for ${row.sbNo}`) },
//     { label: 'Membership Form', useDropdown: true, onClick: (row) => console.log(`Membership Form for ${row.sbNo}`) },
//     { label: 'Delete', useDropdown: false, onClick: deleteSalesBill, danger: true }, // Added delete action
//   ];

//   const extraColumns = [
//     // No extra columns needed for this layout
//   ];

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 min-h-screen">
//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-semibold text-gray-800">Sales Bill</h1>
//           <Link to="/telecaller/add-salesbill">
//             <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-medium">
//               Create Sale Bill
//             </button>
//           </Link>
//         </div>

//         <form onSubmit={handleSearch}>
//           <div className="grid grid-cols-5 gap-4 mb-6">
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 mb-1">Search By Name</label>
//               <input
//                 className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
//                 value={searchName}
//                 onChange={(e) => setSearchName(e.target.value)}
//                 placeholder="Doctor name"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 mb-1">Search SB No</label>
//               <input
//                 className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
//                 value={searchSBNo}
//                 onChange={(e) => setSearchSBNo(e.target.value)}
//                 placeholder="Bill number"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 mb-1">Search Old SB No</label>
//               <input
//                 className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
//                 value={searchOldSBNo}
//                 onChange={(e) => setSearchOldSBNo(e.target.value)}
//                 placeholder="Old bill number"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 mb-1">From Date</label>
//               <input
//                 type="date"
//                 className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 mb-1">To Date</label>
//               <input
//                 type="date"
//                 className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-4 mb-6">
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 mb-1">Search Membership Type</label>
//               <input
//                 className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
//                 value={searchMembershipType}
//                 onChange={(e) => setSearchMembershipType(e.target.value)}
//                 placeholder="Membership type"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 mb-1">Search Membership Year</label>
//               <input
//                 className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
//                 value={searchMembershipYear}
//                 onChange={(e) => setSearchMembershipYear(e.target.value)}
//                 placeholder="Membership year"
//               />
//             </div>
//             <div className="flex items-end">
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium w-full"
//               >
//                 Search
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
//         </div>
//       ) : (
//         <>
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ overflow: "visible" }}>
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
//                 // "Membership Period",
//                 "Amount",
//                 "Narration",
//                 "Expiry Date"
//               ]}
//             />
//           </div>

//           {/* Pagination controls */}
//           {totalPages > 1 && (
//             <div className="flex justify-between items-center mt-4">
//               <div className="text-sm text-gray-600">
//                 Showing {data.length > 0 ? ((currentPage - 1) * 15) + 1 : 0} to {(currentPage - 1) * 15 + data.length} of {totalCount} sales bills
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
//                 >
//                   Previous
//                 </button>

//                 <span className="px-3 py-1 bg-teal-500 text-white rounded">
//                   {currentPage} of {totalPages}
//                 </span>

//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default SalesBill;

















import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Table from '../../components/mainComponents/Table';
import { Link } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../services/apiClient';
import { toast } from 'react-toastify';

const SalesBill = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);                    // raw page from server
  const [displayedData, setDisplayedData] = useState([]);  // after client-side filters
  const [loading, setLoading] = useState(false);

  // Pagination — server-controlled
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    searchName: '',
    searchSBNo: '',
    searchOldSBNo: '',
    searchMembershipType: '',
    searchMembershipYear: '',
    fromDate: '',
    toDate: ''
  });

  const calculateMembershipPeriod = (billDate, dueDate) => {
    if (!billDate || !dueDate) return 'N/A';
    try {
      const start = new Date(billDate);
      const end = new Date(dueDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'N/A';

      const diffInMs = end.getTime() - start.getTime();
      const msInYear = 1000 * 60 * 60 * 24 * 365.25;
      const years = diffInMs / msInYear;
      const roundedYears = Math.round(years);

      if (roundedYears === 0) {
        const months = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
        return months > 0 ? `${months} Month${months > 1 ? 's' : ''}` : '< 1 Month';
      }
      return `${roundedYears} Year${roundedYears > 1 ? 's' : ''}`;
    } catch (error) {
      console.error('Error calculating membership period:', error);
      return 'N/A';
    }
  };

  const getYearFromDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.getFullYear();
  };

  const fetchSalesBills = async (page = currentPage, limit = pageSize) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
      };

      // Safe server-side filters (avoid oldBillNumber to prevent crash)
      if (filters.searchName.trim())        params.search          = filters.searchName.trim();
      if (filters.searchSBNo.trim())        params.billNumber      = filters.searchSBNo.trim();
      // oldBillNumber intentionally NOT sent — handled client-side below
      if (filters.searchMembershipType.trim()) params.membershipType = filters.searchMembershipType.trim();
      if (filters.fromDate)                 params.dateFrom         = filters.fromDate;
      if (filters.toDate)                   params.dateTo           = filters.toDate;

      console.log("Fetching sales bills with params:", params);

      const response = await apiClient.get(apiEndpoints.salesBills.list, { params });

      if (response.data.success) {
        const bills = response.data.data || [];

        const transformed = bills.map((bill, index) => {
          const membershipPeriod = calculateMembershipPeriod(bill.billDate, bill.dueDate);
          const billYear = getYearFromDate(bill.billDate);

          const formatDate = (isoString) => {
            if (!isoString) return '';
            return isoString.split('T')[0].split('-').reverse().join('/');
          };

          const isMonthly = bill.membershipType === 'monthly';
          const itemAmount = bill.items?.[0]?.amount || 0;
          const displayAmount = isMonthly ? itemAmount : bill.totalAmount;

          return {
            id: bill.billId || bill._id,
            srNo: (page - 1) * limit + index + 1,
            sbNo: bill.billNumber || '',
            oldSBNo: bill.renewalFrom || '',
            sbDate: formatDate(bill.billDate),
            sbType: bill.status === 'draft' ? 'New' : bill.status.charAt(0).toUpperCase() + bill.status.slice(1),
            doctorName: bill.client?.name || '',
            membership: bill.membershipType || 'N/A',
            membershipPeriod,
            amount: `₹${(displayAmount || 0).toLocaleString('en-IN')}`,
            narration: bill.notes || '',
            expiryDate: formatDate(bill.dueDate),
            billYear,
            _id: bill._id,
            client: bill.client,
            // keep original renewalFrom for client-side filtering
            renewalFrom: bill.renewalFrom || ''
          };
        });

        setData(transformed);

        // Server pagination
        if (response.data.pagination) {
          setTotalItems(response.data.pagination.total || 0);
          setTotalPages(response.data.pagination.pages || 1);
        } else {
          setTotalItems(transformed.length);
          setTotalPages(1);
        }
      } else {
        toast.error(response.data.message || 'Failed to fetch sales bills');
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching sales bills:', error);
      toast.error(error.response?.data?.message || 'Error fetching sales bills');
      setData([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filters (Old SB No + Membership Year)
  useEffect(() => {
    let result = [...data];

    // Client-side: Old SB No (renewalFrom)
    if (filters.searchOldSBNo.trim()) {
      const term = filters.searchOldSBNo.trim().toLowerCase();
      result = result.filter(item => 
        item.renewalFrom?.toLowerCase().includes(term)
      );
    }

    // Client-side: Membership Year
    if (filters.searchMembershipYear.trim()) {
      const yearStr = filters.searchMembershipYear.trim();
      result = result.filter(item => 
        item.billYear?.toString() === yearStr
      );
    }

    setDisplayedData(result);
  }, [data, filters.searchOldSBNo, filters.searchMembershipYear]);

  // Initial fetch + refetch on page/size change
  useEffect(() => {
    fetchSalesBills(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Refetch when server-side filters change
  useEffect(() => {
    setCurrentPage(1); // reset page when filters change
    fetchSalesBills(1, pageSize);
  }, [filters.searchName, filters.searchSBNo, filters.searchMembershipType, filters.fromDate, filters.toDate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      searchName: '',
      searchSBNo: '',
      searchOldSBNo: '',
      searchMembershipType: '',
      searchMembershipYear: '',
      fromDate: '',
      toDate: ''
    });
    setCurrentPage(1);
    toast.success('All filters cleared');
  };

  const deleteSalesBill = async (row) => {
    if (!window.confirm(`Are you sure you want to delete sales bill ${row.sbNo}?`)) return;

    try {
      const response = await apiClient.delete(apiEndpoints.salesBills.delete(row._id));
      if (response.data.success) {
        toast.success('Sales bill deleted successfully!');
        fetchSalesBills(currentPage, pageSize);
      } else {
        toast.error(response.data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting sales bill');
    }
  };

  const isRenewalNear = (expiryDateStr) => {
    if (!expiryDateStr || expiryDateStr.trim() === '') return false;

    const parts = expiryDateStr.split('/');
    if (parts.length !== 3) return false;

    const day   = Number(parts[0]);
    const month = Number(parts[1]);
    const year  = Number(parts[2]);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;

    const expiry = new Date(year, month - 1, day, 23, 59, 59);
    if (isNaN(expiry.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = expiry - today;
    const daysUntilExpiry = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return daysUntilExpiry <= 7;
  };

  const actions = [
    { label: 'Edit', useDropdown: true, onClick: (row) => navigate(`/telecaller/edit-salesbill/${row._id}`) },
    { label: 'Print', useDropdown: true, onClick: (row) => navigate(`/telecaller/salesbill/print/${row._id}`) },
    {
      label: 'SA',
      useDropdown: true,
      onClick: (row) => {
        const membershipType = row.membership.toLowerCase();
        const path = membershipType === 'monthly' ? `/telecaller/salesbill/sa/monthly/${row._id}` : `/telecaller/salesbill/sa/yearly/${row._id}`;
        navigate(path);
      }
    },
    {
      label: 'SAWHF',
      useDropdown: true,
      onClick: (row) => {
        const membershipType = row.membership.toLowerCase();
        const path = membershipType === 'monthly' ? `/telecaller/salesbill/sa-whf-monthly/${row._id}` : `/telecaller/salesbill/sa-whf-yearly/${row._id}`;
        navigate(path);
      }
    },
    { label: 'WN', useDropdown: true, onClick: (row) => navigate(`/telecaller/salesbill/WN/${row._id}`) },
    {
      label: 'Renewed',
      useDropdown: true,
      onClick: (row) => {
        if (row.sbType !== 'Renewal') {
          toast.warn('This action is only available for Renewal bills');
          return;
        }
        navigate(`/telecaller/salesbill/renewed/${row._id}`);
      }
    },
    {
      label: 'Renewal letter',
      useDropdown: true,
      onClick: (row) => {
        if (row.oldSBNo) {
          toast.warn('Renewal letter is only available for the original (source) bill.');
          return;
        }
        if (row.sbType === 'Renewal') {
          toast.warn('This is a renewed bill. Letter is attached to the original.');
          return;
        }
        if (!isRenewalNear(row.expiryDate)) {
          toast.info(`Renewal letter is not yet available.\nExpiry: ${row.expiryDate}`);
          return;
        }
        navigate(`/telecaller/salesbill/rwnl/${row._id}`);
      }
    },
    { label: 'Membership Form', useDropdown: true, onClick: (row) => navigate(`/telecaller/salesbill/membership-form/${row._id}`) },
    { label: 'Delete', useDropdown: false, onClick: deleteSalesBill, danger: true },
  ];

  return (
    <div className="md:w-[70vw] mx-auto px-2 sm:px-4 md:px-6 lg:px-4 min-h-screen py-4 lg:w-[80vw]">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800">Sales Bill</h1>
          <Link to="/telecaller/add-salesbill">
            <button className="w-full sm:w-auto px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-medium text-sm sm:text-base">
              Create Sale Bill
            </button>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search By Name</label>
              <input
                name="searchName"
                value={filters.searchName}
                onChange={handleFilterChange}
                placeholder="Doctor name"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search SB No</label>
              <input
                name="searchSBNo"
                value={filters.searchSBNo}
                onChange={handleFilterChange}
                placeholder="Bill number"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search Old SB No</label>
              <input
                name="searchOldSBNo"
                value={filters.searchOldSBNo}
                onChange={handleFilterChange}
                placeholder="Old bill number"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search Membership Type</label>
              <input
                name="searchMembershipType"
                value={filters.searchMembershipType}
                onChange={handleFilterChange}
                placeholder="Membership type"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Search Membership Year</label>
              <input
                type="text"
                name="searchMembershipYear"
                value={filters.searchMembershipYear}
                onChange={handleFilterChange}
                placeholder="e.g., 2025"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors font-medium text-xs sm:text-sm flex items-center justify-center"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {Object.values(filters).some(v => v.trim() !== '') && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleClearFilters}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300 font-medium text-sm transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading sales bills...</p>
        </div>
      ) : displayedData.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900">No sales bills found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search filters
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <Table
              data={displayedData}
              actions={actions}
              headers={[
                "Sr No.",
                "SB No",
                "Old SB No",
                "SB Date",
                "SB Type",
                "Doctor Name",
                "Membership",
                "Membership Period",
                "Amount",
                "Narration",
                "Expiry Date"
              ]}
              excludeColumns={['id', 'billYear', '_id', 'client', 'renewalFrom']}
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
              showSrNo={false} // manual calculation
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesBill;