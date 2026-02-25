// import React, { useState, useEffect } from "react";
// import Table from "../../../components/mainComponents/Table";
// import { useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from 'react-toastify';

// const QuotationList = () => {
//   const [quotations, setQuotations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pages: 1,
//     total: 0
//   });
//   const [limit] = useState(10); // Items per page
//   const navigate = useNavigate();

//   // Fetch quotations from backend
//   const fetchQuotations = async (page = 1, search = '') => {
//     try {
//       setLoading(true);
      
//       // Build query parameters
//       const params = new URLSearchParams({
//         page: page,
//         limit: limit
//       });
      
//       if (search) {
//         params.append('search', search);
//       }

//       const response = await apiClient.get(`${apiEndpoints.quotations.list}?${params.toString()}`);
      
//       if (response.data.success) {
//         // Format the data for the table
//         const formattedData = response.data.data.map(quotation => ({
//           id: quotation._id,
//           Code: `Q ${quotation.quotationNumber || quotation._id.substring(0, 6)}`,
//           "Party Name": quotation.clientName || quotation.doctorName || 'N/A',
//           Narration: quotation.description || quotation.remarks || 'N/A',
//           "Entry Date": new Date(quotation.createdAt).toLocaleDateString('en-GB'),
//           status: quotation.status || 'Draft',
//           totalAmount: quotation.totalAmount || 0,
//           clientEmail: quotation.clientEmail || 'N/A',
//           clientPhone: quotation.clientPhone || 'N/A',
//         }));
        
//         setQuotations(formattedData);
//         setPagination(response.data.pagination || { current: 1, pages: 1, total: 0 });
//       } else {
//         toast.error(response.data.message || 'Failed to fetch quotations');
//       }
//     } catch (error) {
//       console.error('Error fetching quotations:', error);
//       setError(error.message);
//       toast.error('Error fetching quotations');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchQuotations(1, searchTerm);
//   }, []);

//   // Handle search
//   const handleSearch = (e) => {
//     e.preventDefault();
//     const term = e.target.search.value;
//     setSearchTerm(term);
//     fetchQuotations(1, term); // Reset to page 1 when searching
//   };

//   // Handle page change
//   const goToPage = (page) => {
//     if (page >= 1 && page <= pagination.pages) {
//       fetchQuotations(page, searchTerm);
//     }
//   };

//   // Handle delete quotation
//   const handleDelete = async (row) => {
//     if (window.confirm(`Are you sure you want to delete quotation ${row.Code}?`)) {
//       try {
//         const response = await apiClient.delete(apiEndpoints.quotations.delete(row.id));
//         if (response.data.success) {
//           toast.success('Quotation deleted successfully');
//           // Refresh the list
//           fetchQuotations(pagination.current, searchTerm);
//         } else {
//           toast.error(response.data.message || 'Failed to delete quotation');
//         }
//       } catch (error) {
//         console.error('Error deleting quotation:', error);
//         toast.error('Error deleting quotation');
//       }
//     }
//   };

//   // Handle edit quotation
//   const handleEdit = (row) => {
//     navigate(`/admin/quotations/${row.id}/edit`);
//   };

//   // Define action buttons (print, edit, delete)
//   const actions = [
//     {
//       label: "Print",
//       icon: (
//         <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//         </svg>
//       ),
//       onClick: (row) => {
//         // In a real app, this would open a print view
//         console.log("Print quotation:", row);
//         // Example: navigate to print view
//         window.open(`/admin/quotations/${row.id}/print`, '_blank');
//       },
//       showAsIcon: true,
//     },
//     {
//       label: "Edit",
//       icon: (
//         <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 013.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//         </svg>
//       ),
//       onClick: handleEdit,
//       showAsIcon: true,
//     },
//     {
//       label: "Delete",
//       icon: (
//         <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//         </svg>
//       ),
//       onClick: handleDelete,
//       showAsIcon: true,
//     },
//   ];

//   // Extra columns for additional information
//   const extraColumns = [
//     {
//       header: "Status",
//       render: (row) => (
//         <span className={`px-2 py-1 rounded-full text-xs ${
//           row.status === 'Draft' ? 'bg-gray-200 text-gray-800' :
//           row.status === 'Sent' ? 'bg-blue-200 text-blue-800' :
//           row.status === 'Accepted' ? 'bg-green-200 text-green-800' :
//           row.status === 'Rejected' ? 'bg-red-200 text-red-800' :
//           'bg-yellow-200 text-yellow-800'
//         }`}>
//           {row.status}
//         </span>
//       ),
//     },
//     {
//       header: "Amount",
//       render: (row) => `₹${row.totalAmount?.toLocaleString() || '0'}`,
//     },
//     {
//       header: "Contact",
//       render: (row) => (
//         <div>
//           <div>{row.clientEmail}</div>
//           <div className="text-xs text-gray-500">{row.clientPhone}</div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold text-gray-800">Quotation List</h2>
//         <button
//           onClick={() => navigate("/admin/create-quotation")}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           Create Quotation
//         </button>
//       </div>

//       {/* Search Form */}
//       <form onSubmit={handleSearch} className="mb-4">
//         <div className="flex flex-col md:flex-row gap-2">
//           <input
//             type="text"
//             name="search"
//             placeholder="Search by Party Name, Code, etc."
//             defaultValue={searchTerm}
//             className="p-2 border rounded w-full md:w-1/3"
//           />
//           <button
//             type="submit"
//             className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//           >
//             Search
//           </button>
//           <button
//             type="button"
//             onClick={() => {
//               document.querySelector('input[name="search"]').value = '';
//               setSearchTerm('');
//               fetchQuotations(1, '');
//             }}
//             className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//           >
//             Clear
//           </button>
//         </div>
//       </form>

//       {/* Loading indicator */}
//       {loading && (
//         <div className="flex justify-center items-center h-64">
//           <p>Loading quotations...</p>
//         </div>
//       )}

//       {/* Error message */}
//       {error && !loading && (
//         <div className="flex justify-center items-center h-64">
//           <p className="text-red-500">Error loading quotations: {error}</p>
//         </div>
//       )}

//       {/* Table */}
//       {!loading && !error && (
//         <>
//           <Table
//             data={quotations}
//             actions={actions}
//             extraColumns={extraColumns}
//           />

//           {/* Pagination Controls */}
//           {pagination.pages > 1 && (
//             <div className="flex items-center justify-between mt-4 p-4">
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-600">
//                   Page {pagination.current} of {pagination.pages} ({pagination.total} total)
//                 </span>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => goToPage(1)}
//                   disabled={pagination.current === 1}
//                   className={`px-3 py-1 rounded-md text-sm ${
//                     pagination.current === 1
//                       ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                 >
//                   First
//                 </button>

//                 <button
//                   onClick={() => goToPage(Math.max(1, pagination.current - 1))}
//                   disabled={pagination.current === 1}
//                   className={`px-3 py-1 rounded-md text-sm ${
//                     pagination.current === 1
//                       ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                 >
//                   Previous
//                 </button>

//                 {/* Page number buttons */}
//                 {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
//                   const pageNum = Math.min(pagination.current + i - 2, pagination.pages);
//                   if (pageNum >= 1 && pageNum <= pagination.pages) {
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => goToPage(pageNum)}
//                         className={`px-3 py-1 rounded-md text-sm ${
//                           pagination.current === pageNum
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   }
//                   return null;
//                 })}

//                 <button
//                   onClick={() => goToPage(Math.min(pagination.pages, pagination.current + 1))}
//                   disabled={pagination.current === pagination.pages}
//                   className={`px-3 py-1 rounded-md text-sm ${
//                     pagination.current === pagination.pages
//                       ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                 >
//                   Next
//                 </button>

//                 <button
//                   onClick={() => goToPage(pagination.pages)}
//                   disabled={pagination.current === pagination.pages}
//                   className={`px-3 py-1 rounded-md text-sm ${
//                     pagination.current === pagination.pages
//                       ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                 >
//                   Last
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default QuotationList;




























// import React, { useState, useEffect } from "react";
// import Table from "../../../components/mainComponents/Table";
// import { useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from 'react-toastify';

// const QuotationList = () => {
//   const [quotations, setQuotations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pages: 1,
//     total: 0
//   });
//   const [limit] = useState(10);
//   const navigate = useNavigate();

//   const fetchQuotations = async (page = 1, search = '') => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams({
//         page,
//         limit,
//         ...(search && { search })
//       });

//       const response = await apiClient.get(`${apiEndpoints.quotations.list}?${params.toString()}`);

//       if (response.data.success) {
//         const formattedData = response.data.data.map(quotation => ({
//           id: quotation._id, // Needed for edit/delete
//           // Code: quotation.trno || `Q${quotation._id.slice(-6).toUpperCase()}`,
//           Code: quotation.quotationNumber,
//           "Party Name": quotation.requester?.name || quotation.doctorName || 'N/A',
//           Narration: quotation.requestDetails?.additionalRequirements || 'N/A',
//           "Entry Date": new Date(quotation.createdAt).toLocaleDateString('en-GB'),
//           status: quotation.status || 'responses_pending', // Only this will be used
//           totalAmount: quotation.totalAmount || 0,
//           clientEmail: quotation.requester?.email || 'N/A',
//           clientPhone: quotation.requester?.phone || 'N/A',
//         }));

//         setQuotations(formattedData);
//         setPagination(response.data.pagination || { current: 1, pages: 1, total: 0 });
//       }
//     } catch (error) {
//       toast.error('Failed to load quotations');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuotations(1, searchTerm);
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const term = e.target.search.value.trim();
//     setSearchTerm(term);
//     fetchQuotations(1, term);
//   };

//   const goToPage = (page) => {
//     if (page >= 1 && page <= pagination.pages) {
//       fetchQuotations(page, searchTerm);
//     }
//   };

//   const handleDelete = async (row) => {
//     if (!window.confirm(`Delete quotation ${row.Code}?`)) return;

//     try {
//       await apiClient.delete(apiEndpoints.quotations.delete(row.id));
//       toast.success('Quotation deleted');
//       fetchQuotations(pagination.current, searchTerm);
//     } catch (error) {
//       toast.error('Failed to delete');
//     }
//   };

//   const handleEdit = (row) => {
//     navigate(`/admin/quotations/${row.id}/edit`);
//   };

//   const actions = [
//     {
//       label: "Print",
//       icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
//       onClick: (row) => window.open(`/admin/quotation/${row.id}/`, '_blank'),
//       showAsIcon: true,
//     },
//     {
//       label: "Edit",
//       icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 013.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
//       onClick: handleEdit,
//       showAsIcon: true,
//     },
//     {
//       label: "Delete",
//       icon: <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2.2 2.2 0 0116.138 21H7.862a2.2 2.2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
//       onClick: handleDelete,
//       showAsIcon: true,
//     },
//   ];

//   // Only show these columns + extra custom ones
//   const visibleColumns = ["Code", "Party Name", "Narration", "Entry Date"];

//   const extraColumns = [
//     {
//       header: "Status",
//       render: (row) => {
//         const status = row.status;
//         const color = {
//           draft: 'bg-gray-200 text-gray-800',
//           responses_pending: 'bg-yellow-200 text-yellow-800',
//           sent: 'bg-blue-200 text-blue-800',
//           accepted: 'bg-green-200 text-green-800',
//           rejected: 'bg-red-200 text-red-800',
//         }[status?.toLowerCase()] || 'bg-gray-200 text-gray-700';

//         return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{status.replace(/_/g, ' ').toUpperCase()}</span>;
//       }
//     },
//     // {
//     //   header: "Amount",
//     //   render: (row) => <span className="font-medium">₹{Number(row.totalAmount || 0).toLocaleString('en-IN')}</span>
//     // },
//     // {
//     //   header: "Contact",
//     //   render: (row) => (
//     //     <div className="text-sm">
//     //       <div>{row.clientEmail}</div>
//     //       <div className="text-xs text-gray-500">{row.clientPhone}</div>
//     //     </div>
//     //   )
//     // }
//   ];

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Quotation List</h2>
//         <button
//           onClick={() => navigate("/admin/create-quotation")}
//           className="px-5 py-2.5 bg-[#15BBB3] text-white rounded-lg hover:bg-[#13a89e] transition"
//         >
//           + Create Quotation
//         </button>
//       </div>

//       <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-3">
//         <input
//           type="text"
//           name="search"
//           placeholder="Search by Code, Party Name..."
//           defaultValue={searchTerm}
//           className="px-4 py-2 border border-gray-300 rounded-lg flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-[#15BBB3]"
//         />
//         <button type="submit" className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
//           Search
//         </button>
//         <button
//           type="button"
//           onClick={() => {
//             document.querySelector('input[name="search"]').value = '';
//             setSearchTerm('');
//             fetchQuotations(1, '');
//           }}
//           className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
//         >
//           Clear
//         </button>
//       </form>

//       {loading ? (
//         <div className="flex justify-center py-20">
//           <div className="animate-spin w-10 h-10 border-4 border-[#15BBB3] border-t-transparent rounded-full"></div>
//         </div>
//       ) : (
//         <Table
//           data={quotations}
//           actions={actions}
//           extraColumns={extraColumns}
//           excludeColumns={["id", "status", "totalAmount", "clientEmail", "clientPhone"]} // Hide these from auto-detection
//           columnOrder={[...visibleColumns, "Status"]} // Exact order
//           pagination={true}
//         />
//       )}
//     </div>
//   );
// };

// export default QuotationList;





// import React, { useState, useEffect } from "react";
// import Table from "../../../components/mainComponents/Table";
// import { useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from 'react-toastify';

// const QuotationList = () => {
//   const [quotations, setQuotations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pages: 1,
//     total: 0,
//     limit: 10
//   });
//   const navigate = useNavigate();

//   const fetchQuotations = async (page = 1, search = '', newLimit = pagination.limit) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: newLimit.toString(),
//         ...(search && { search })
//       });

//       const response = await apiClient.get(`${apiEndpoints.quotations.list}?${params.toString()}`);

//       if (response.data.success) {
//         const formattedData = response.data.data.map(quotation => ({
//           id: quotation._id,
//           Code: quotation.quotationNumber || `Q${quotation._id.slice(-6).toUpperCase()}`,
//           "Party Name": quotation.requester?.name || quotation.doctorName || 'N/A',
//           Narration: quotation.requestDetails?.additionalRequirements || 'N/A',
//           "Entry Date": new Date(quotation.createdAt).toLocaleDateString('en-GB'),
//           status: quotation.status || 'responses_pending',
//           totalAmount: quotation.totalAmount || 0,
//           clientEmail: quotation.requester?.email || 'N/A',
//           clientPhone: quotation.requester?.phone || 'N/A',
//           createdAt: quotation.createdAt,
//           rawData: quotation
//         }));

//         setQuotations(formattedData);
        
//         // Update pagination state from backend response
//         if (response.data.pagination) {
//           setPagination({
//             current: response.data.pagination.current || 1,
//             pages: response.data.pagination.pages || 1,
//             total: response.data.pagination.total || 0,
//             limit: newLimit
//           });
//         }
//       }
//     } catch (error) {
//       toast.error('Failed to load quotations');
//       console.error('Fetch error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuotations(1, searchTerm);
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const term = e.target.search.value.trim();
//     setSearchTerm(term);
//     fetchQuotations(1, term);
//   };

//   const handlePageChange = (page) => {
//     fetchQuotations(page, searchTerm);
//   };

//   const handlePageSizeChange = (pageSize) => {
//     fetchQuotations(1, searchTerm, pageSize);
//   };

//   const handleDelete = async (row) => {
//     if (!window.confirm(`Delete quotation ${row.Code}?`)) return;

//     try {
//       await apiClient.delete(apiEndpoints.quotations.delete(row.id));
//       toast.success('Quotation deleted');
      
//       // Re-fetch current page or previous page if current becomes empty
//       const remainingItems = pagination.total - 1;
//       const itemsOnCurrentPage = quotations.length - 1;
//       let newPage = pagination.current;
      
//       if (itemsOnCurrentPage === 0 && pagination.current > 1) {
//         newPage = pagination.current - 1;
//       }
      
//       fetchQuotations(newPage, searchTerm);
//     } catch (error) {
//       toast.error('Failed to delete');
//       console.error('Delete error:', error);
//     }
//   };

//   const handleEdit = (row) => {
//     navigate(`/admin/quotations/${row.id}/edit`);
//   };

//   const actions = [
//     {
//       label: "Print",
//       icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
//       onClick: (row) => window.open(`/admin/quotation/${row.id}/`, '_blank'),
//       showAsIcon: true,
//     },
//     {
//       label: "Edit",
//       icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
//       onClick: handleEdit,
//       showAsIcon: true,
//     },
//     {
//       label: "Delete",
//       icon: <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2.2 2.2 0 0116.138 21H7.862a2.2 2.2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
//       onClick: handleDelete,
//       showAsIcon: true,
//     },
//   ];

//   const visibleColumns = ["Code", "Party Name", "Narration", "Entry Date"];

//   const extraColumns = [
//     {
//       header: "Status",
//       render: (row) => {
//         const status = row.status;
//         const color = {
//           draft: 'bg-gray-200 text-gray-800',
//           responses_pending: 'bg-yellow-200 text-yellow-800',
//           sent: 'bg-blue-200 text-blue-800',
//           accepted: 'bg-green-200 text-green-800',
//           rejected: 'bg-red-200 text-red-800',
//         }[status?.toLowerCase()] || 'bg-gray-200 text-gray-700';

//         return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{status.replace(/_/g, ' ').toUpperCase()}</span>;
//       }
//     }
//   ];

//   return (
//     <div className="p-6 bg-gray-50  w-[85vw] min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Quotation List</h2>
//         <button
//           onClick={() => navigate("/admin/create-quotation")}
//           className="px-5 py-2.5 bg-[#15BBB3] text-white rounded-lg hover:bg-[#13a89e] transition"
//         >
//           + Create Quotation
//         </button>
//       </div>

//       <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-3">
//         <input
//           type="text"
//           name="search"
//           placeholder="Search by Code, Party Name..."
//           defaultValue={searchTerm}
//           className="px-4 py-2 border border-gray-300 rounded-lg flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-[#15BBB3]"
//         />
//         <button type="submit" className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
//           Search
//         </button>
//         <button
//           type="button"
//           onClick={() => {
//             document.querySelector('input[name="search"]').value = '';
//             setSearchTerm('');
//             fetchQuotations(1, '');
//           }}
//           className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
//         >
//           Clear
//         </button>
//       </form>

//       {loading ? (
//         <div className="flex justify-center py-20">
//           <div className="animate-spin w-10 h-10 border-4 border-[#15BBB3] border-t-transparent rounded-full"></div>
//         </div>
//       ) : (
//         <Table
//           data={quotations}
//           actions={actions}
//           extraColumns={extraColumns}
//           excludeColumns={["id", "status", "totalAmount", "clientEmail", "clientPhone", "createdAt", "rawData"]}
//           columnOrder={["Code", "Party Name", "Narration", "Entry Date", "Status"]}
//           pagination={true}
//           serverPagination={true}
//           totalServerItems={pagination.total}
//           currentServerPage={pagination.current}
//           defaultPageSize={pagination.limit}
//           onPageChange={handlePageChange}
//           onPageSizeChange={handlePageSizeChange}
//         />
//       )}
//     </div>
//   );
// };

// export default QuotationList;








import React, { useState, useEffect } from "react";
import Table from "../../../components/mainComponents/Table";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from 'react-toastify';

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);       // dynamic, controlled by table
  const [totalItems, setTotalItems] = useState(0);    // total from backend

  const navigate = useNavigate();

  const fetchQuotations = async (page = 1, search = '', limit = pageSize) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });

      const response = await apiClient.get(`${apiEndpoints.quotations.list}?${params.toString()}`);

      if (response.data.success) {
        const formattedData = response.data.data.map(quotation => ({
          id: quotation._id,
          Code: quotation.quotationNumber || `Q${quotation._id.slice(-6).toUpperCase()}`,
          "Party Name": quotation.requester?.name || quotation.doctorName || 'N/A',
          Narration: quotation.requestDetails?.additionalRequirements || 'N/A',
          "Entry Date": new Date(quotation.createdAt).toLocaleDateString('en-GB'),
          status: quotation.status || 'responses_pending',
          totalAmount: quotation.totalAmount || 0,
          clientEmail: quotation.requester?.email || 'N/A',
          clientPhone: quotation.requester?.phone || 'N/A',
          createdAt: quotation.createdAt,
          rawData: quotation
        }));

        setQuotations(formattedData);
        
        // Use backend pagination info
        if (response.data.pagination) {
          setTotalItems(response.data.pagination.total || 0);
          setCurrentPage(response.data.pagination.current || page);
        }
      } else {
        toast.error('Failed to load quotations');
      }
    } catch (error) {
      toast.error('Failed to load quotations');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchQuotations(1, searchTerm);
  }, []);

  // Re-fetch when page or page size changes
  useEffect(() => {
    fetchQuotations(currentPage, searchTerm);
  }, [currentPage, pageSize]);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = e.target.search.value.trim();
    setSearchTerm(term);
    setCurrentPage(1); // reset to page 1 on new search
    fetchQuotations(1, term);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    document.querySelector('input[name="search"]').value = '';
    setCurrentPage(1);
    fetchQuotations(1, '');
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete quotation ${row.Code}?`)) return;

    try {
      await apiClient.delete(apiEndpoints.quotations.delete(row.id));
      toast.success('Quotation deleted');
      
      // Re-fetch current page (backend will handle if page becomes empty)
      fetchQuotations(currentPage, searchTerm);
    } catch (error) {
      toast.error('Failed to delete');
      console.error('Delete error:', error);
    }
  };

  const handleEdit = (row) => {
    navigate(`/admin/quotations/${row.id}/edit`);
  };

  const actions = [
    {
      label: "Print",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
      onClick: (row) => window.open(`/admin/quotation/${row.id}/`, '_blank'),
      showAsIcon: true,
    },
    {
      label: "Edit",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
      onClick: handleEdit,
      showAsIcon: true,
    },
    {
      label: "Delete",
      icon: <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2.2 2.2 0 0116.138 21H7.862a2.2 2.2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
      onClick: handleDelete,
      showAsIcon: true,
    },
  ];

  const visibleColumns = ["Code", "Party Name", "Narration", "Entry Date"];

  const extraColumns = [
    {
      header: "Status",
      render: (row) => {
        const status = row.status;
        const color = {
          draft: 'bg-gray-200 text-gray-800',
          responses_pending: 'bg-yellow-200 text-yellow-800',
          sent: 'bg-blue-200 text-blue-800',
          accepted: 'bg-green-200 text-green-800',
          rejected: 'bg-red-200 text-red-800',
        }[status?.toLowerCase()] || 'bg-gray-200 text-gray-700';

        return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{status.replace(/_/g, ' ').toUpperCase()}</span>;
      }
    }
  ];

  return (
    <div className="p-6 bg-gray-50 w-[85vw] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quotation List</h2>
        <button
          onClick={() => navigate("/admin/create-quotation")}
          className="px-5 py-2.5 bg-[#15BBB3] text-white rounded-lg hover:bg-[#13a89e] transition"
        >
          + Create Quotation
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name="search"
          placeholder="Search by Code, Party Name..."
          defaultValue={searchTerm}
          className="px-4 py-2 border border-gray-300 rounded-lg flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-[#15BBB3]"
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
          <div className="animate-spin w-10 h-10 border-4 border-[#15BBB3] border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <Table
          data={quotations}
          actions={actions}
          extraColumns={extraColumns}
          excludeColumns={["id", "status", "totalAmount", "clientEmail", "clientPhone", "createdAt", "rawData"]}
          columnOrder={["Code", "Party Name", "Narration", "Entry Date", "Status"]}
          pagination={true}
          serverPagination={true}
          totalServerItems={totalItems}
          currentServerPage={currentPage}
          defaultPageSize={pageSize}                    // initial value
          onPageChange={(newPage) => setCurrentPage(newPage)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
};

export default QuotationList;