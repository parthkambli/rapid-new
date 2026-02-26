// // PolicyList.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../../components/mainComponents/Table";
// import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

// const PolicyList = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("policy");

//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pages: 1,
//     total: 0
//   });
//   const [filters, setFilters] = useState({
//     page: 1,
//     limit: 10,
//     search: '',
//     status: '',
//     insuranceCompany: '',
//     insuranceType: '',
//     policyHolderType: '',
//     renewalStatus: ''
//   });

// //   const actions = [
// //     {
// //       label: "Edit",
// //       showAsIcon: false,
// //       onClick: (row) => alert(`Edit: ${row.Name}`),
// //     },
// //     {
// //       label: "Renew",
// //       showAsIcon: false,
// //       onClick: (row) => alert(`Renew: ${row.PolicyNo}`),
// //     },
// //     {
// //       label: "History",
// //       showAsIcon: false,
// //       onClick: (row) => navigate(`/admin/policy-history/${row.PolicyNo}`),
// //     },
// //     {
// //       label: "Delete",
// //       showAsIcon: false,
// //       onClick: (row) => {
// //         if (window.confirm(`Delete ${row.Name}?`)) {
// //           alert("Deleted!");
// //         }
// //       },
// //     },
// //   ];




//   // Fetch policies from API
//   const fetchPolicies = async () => {
//     try {
//       setLoading(true);
//       const response = await apiHelpers.getList(apiEndpoints.policies.list, filters);
//       setPolicies(response.data);
//       setPagination(response.pagination);
//     } catch (error) {
//       console.error('Error fetching policies:', error);
//       // Fallback to empty array if API fails
//       setPolicies([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle filter changes
//   const handleFilterChange = (filterName, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterName]: value,
//       page: 1 // Reset to first page when filtering
//     }));
//   };

//   // Handle page change
//   const handlePageChange = (page) => {
//     setFilters(prev => ({ ...prev, page }));
//   };

//   // Delete policy
//   const handleDeletePolicy = async (policyId, policyNumber) => {
//     if (window.confirm(`Are you sure you want to delete policy ${policyNumber}?`)) {
//       try {
//         await apiClient.delete(apiEndpoints.policies.delete(policyId));
//         fetchPolicies(); // Refresh the list
//         alert('Policy deleted successfully');
//       } catch (error) {
//         console.error('Error deleting policy:', error);
//         alert('Failed to delete policy');
//       }
//     }
//   };

//   // Format policy data for table
//   const formatPolicyData = (policy) => ({
//     Type: policy.policyHolder?.type || 'N/A',
//     Name: policy.policyHolder?.name || 'N/A',
//     Company: policy.insuranceCompany?.companyName || 'N/A',
//     PolicyNo: policy.policyNumber || 'N/A',
//     Cover: policy.coverageAmount ? `₹${policy.coverageAmount.toLocaleString()}` : 'N/A',
//     Start: policy.startDate ? new Date(policy.startDate).toLocaleDateString('en-IN') : 'N/A',
//     End: policy.endDate ? new Date(policy.endDate).toLocaleDateString('en-IN') : 'N/A',
//     Premium: policy.premiumAmount ? `₹${policy.premiumAmount.toLocaleString()}` : 'N/A',
//     PaidBy: policy.premiumPaidBy || 'N/A',
//     Status: policy.status || 'N/A',
//     _id: policy._id,
//     policyNumber: policy.policyNumber
//   });

// const actions = [
//   {
//     label: "Edit",
//     useDropdown: true,
//     showAsIcon: false,
//       onClick: (row) => navigate(`/admin/edit-policy/${row._id}`),
//   },
//   {
//     label: "Renew",
//     useDropdown: true,
//     showAsIcon: false,
//       onClick: (row) => navigate(`/admin/renew-policy/${row._id}`),
//   },
//   {
//     label: "History",
//     useDropdown: true,
//     showAsIcon: false,
//       onClick: (row) => navigate(`/admin/policy-history/${encodeURIComponent(row.policyNumber)}`),
//   },
//   {
//     label: "Delete",
//     useDropdown: true,
//     showAsIcon: false,
//       onClick: (row) => handleDeletePolicy(row._id, row.policyNumber),
//   },
// ];

//   useEffect(() => {
//     fetchPolicies();
//   }, [filters]);

//   return (
//     <div className="max-w-[79vw]  mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//     <div className="flex justify-between">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Policy Details</h2>






// {/* Top Tabs */}
// <div className="flex space-x-2 mb-6 ">
//   {["Insurance Company", "Insurance Type", "Add Policy"].map((tab) => {
//     const isActive = activeTab === tab.toLowerCase().replace(" ", "");

//     return (
//       <button
//         key={tab}
//         onClick={() => {
//           setActiveTab(tab.toLowerCase().replace(" ", ""));
//           if (tab === "Add Policy") navigate("/admin/add-policy");
//           else if (tab === "Insurance Company") navigate("/admin/insurance-companies-list");
//           else if (tab === "Insurance Type") navigate("/admin/insurance-type-list");
//         }}
//         className={`px-6 py-2 text-sm font-medium transition-all duration-200 border-t border border-gray-300 ${
//           isActive
//             ? "bg-[#398C89] text-white border-b-white -mb-px rounded-md"
//             : "bg-[#398C89] text-white border-b-white -mb-px rounded-md"
//             // : "bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-t-md"
//         }`}
//         style={isActive ? { borderBottomColor: 'white' } : {}}
//       >
//         {tab}
//       </button>
//     );
//   })}
// </div>

// </div>


//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Search By Name"
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={filters.search}
//           onChange={(e) => handleFilterChange('search', e.target.value)}
//         />
//         <select
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={filters.status}
//           onChange={(e) => handleFilterChange('status', e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option value="active">Active</option>
//           <option value="expired">Expired</option>
//           <option value="cancelled">Cancelled</option>
//         </select>
//         <select
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={filters.policyHolderType}
//           onChange={(e) => handleFilterChange('policyHolderType', e.target.value)}
//         >
//           <option value="">All Types</option>
//           <option value="doctor">Doctor</option>
//           <option value="hospital">Hospital</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Search By Policy no"
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={filters.policyNumber || ''}
//           onChange={(e) => handleFilterChange('policyNumber', e.target.value)}
//         />
//         <input
//           type="date"
//           placeholder="From Date"
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={filters.startDate || ''}
//           onChange={(e) => handleFilterChange('startDate', e.target.value)}
//         />
//         <input
//           type="date"
//           placeholder="To Date"
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={filters.endDate || ''}
//           onChange={(e) => handleFilterChange('endDate', e.target.value)}
//         />
//       </div>

//       {/* Loading indicator */}
//       {loading && (
//         <div className="text-center py-4">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//           <p className="mt-2 text-gray-600">Loading policies...</p>
//         </div>
//       )}

//       {/* Table */}
//       <Table
//         data={policies.map(formatPolicyData)}
//         actions={actions}
//         headers={["Type", "Name", "Company", "Policy No", "Cover", "Start", "End", "Premium", "Paid By"]}
//       />

//       {/* Pagination */}
//       {pagination.pages > 1 && (
//         <div className="flex justify-center items-center space-x-2 mt-6">
//           <button
//             onClick={() => handlePageChange(pagination.current - 1)}
//             disabled={pagination.current === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//           >
//             Previous
//           </button>
//           <span className="text-sm text-gray-600">
//             Page {pagination.current} of {pagination.pages} ({pagination.total} total)
//           </span>
//           <button
//             onClick={() => handlePageChange(pagination.current + 1)}
//             disabled={pagination.current === pagination.pages}
//             className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PolicyList;






// // PolicyList.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../../components/mainComponents/Table";
// import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

// const PolicyList = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("policy");

//   const [policies, setPolicies] = useState([]); // Raw data from API
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pages: 1,
//     total: 0
//   });

//   // Filter inputs (frontend only)
//   const [filterInputs, setFilterInputs] = useState({
//     searchName: '',
//     status: '',
//     policyHolderType: '',
//     policyNo: '',
//     fromDate: '',
//     toDate: ''
//   });

//   // Fetch all policies without any filters from backend
//   const fetchPolicies = async () => {
//     try {
//       setLoading(true);
//       // Only basic pagination, no filters sent to backend
//       const response = await apiHelpers.getList(apiEndpoints.policies.list, {
//         page: 1,
//         limit: 1000 // Bring as many as possible, or adjust based on your API max
//       });
//       setPolicies(response.data || []);
//       setPagination(response.pagination || { current: 1, pages: 1, total: response.data?.length || 0 });
//     } catch (error) {
//       console.error('Error fetching policies:', error);
//       setPolicies([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Client-side filtering using useMemo
//   const filteredPolicies = useMemo(() => {
//     let filtered = [...policies];

//     // Search by Name
//     if (filterInputs.searchName.trim()) {
//       const searchLower = filterInputs.searchName.toLowerCase().trim();
//       filtered = filtered.filter(policy =>
//         policy.policyHolder?.name?.toLowerCase().includes(searchLower)
//       );
//     }

//     // Search by Policy No
//     if (filterInputs.policyNo.trim()) {
//       const policyNoLower = filterInputs.policyNo.toLowerCase().trim();
//       filtered = filtered.filter(policy =>
//         policy.policyNumber?.toLowerCase().includes(policyNoLower)
//       );
//     }

//     // Status
//     if (filterInputs.status) {
//       filtered = filtered.filter(policy => policy.status === filterInputs.status);
//     }

//     // Policy Holder Type
//     if (filterInputs.policyHolderType) {
//       filtered = filtered.filter(policy => policy.policyHolder?.type === filterInputs.policyHolderType);
//     }

//     // Date Range: From Date
//     if (filterInputs.fromDate) {
//       const from = new Date(filterInputs.fromDate);
//       filtered = filtered.filter(policy => {
//         if (!policy.startDate) return false;
//         return new Date(policy.startDate) >= from;
//       });
//     }

//     // Date Range: To Date
//     if (filterInputs.toDate) {
//       const to = new Date(filterInputs.toDate);
//       to.setHours(23, 59, 59, 999); // Include full day
//       filtered = filtered.filter(policy => {
//         if (!policy.endDate) return false;
//         return new Date(policy.endDate) <= to;
//       });
//     }

//     return filtered;
//   }, [policies, filterInputs]);

//   // Client-side pagination
//   const paginatedPolicies = useMemo(() => {
//     const page = pagination.current;
//     const limit = 10;
//     const start = (page - 1) * limit;
//     const end = start + limit;
//     return filteredPolicies.slice(start, end);
//   }, [filteredPolicies, pagination.current]);

//   const totalPages = Math.ceil(filteredPolicies.length / 10);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPagination(prev => ({ ...prev, current: newPage, pages: totalPages, total: filteredPolicies.length }));
//     }
//   };

//   const handleFilterChange = (name, value) => {
//     setFilterInputs(prev => ({ ...prev, [name]: value }));
//     // Reset to first page on filter change
//     setPagination(prev => ({ ...prev, current: 1 }));
//   };

//   // Delete policy
//   const handleDeletePolicy = async (policyId, policyNumber) => {
//     if (window.confirm(`Are you sure you want to delete policy ${policyNumber}?`)) {
//       try {
//         await apiClient.delete(apiEndpoints.policies.delete(policyId));
//         fetchPolicies(); // Refetch
//         alert('Policy deleted successfully');
//       } catch (error) {
//         console.error('Error deleting policy:', error);
//         alert('Failed to delete policy');
//       }
//     }
//   };

//   // Format data
//   const formatPolicyData = (policy) => ({
//     Type: policy.policyHolder?.type || 'N/A',
//     Name: policy.policyHolder?.name || 'N/A',
//     Company: policy.insuranceCompany?.companyName || 'N/A',
//     PolicyNo: policy.policyNumber || 'N/A',
//     Cover: policy.coverageAmount ? `₹${policy.coverageAmount.toLocaleString()}` : 'N/A',
//     Start: policy.startDate ? new Date(policy.startDate).toLocaleDateString('en-IN') : 'N/A',
//     End: policy.endDate ? new Date(policy.endDate).toLocaleDateString('en-IN') : 'N/A',
//     Premium: policy.premiumAmount ? `₹${policy.premiumAmount.toLocaleString()}` : 'N/A',
//     PaidBy: policy.paidBy || 'N/A',
//     Status: policy.status || 'N/A',
//     _id: policy._id,
//     policyNumber: policy.policyNumber
//   });

//   const actions = [
//     { label: "Edit", useDropdown: true, showAsIcon: false, onClick: (row) => navigate(`/admin/edit-policy/${row._id}`) },
//     { label: "Renew", useDropdown: true, showAsIcon: false, onClick: (row) => navigate(`/admin/renew-policy/${row._id}`) },
//     { label: "History", useDropdown: true, showAsIcon: false, onClick: (row) => navigate(`/admin/policy-history/${encodeURIComponent(row.policyNumber)}`) },
//     { label: "Delete", useDropdown: true, showAsIcon: false, onClick: (row) => handleDeletePolicy(row._id, row.policyNumber) },
//   ];

//   useEffect(() => {
//     fetchPolicies();
//   }, []); // Only once on mount

//   // Update total pages when filters change
//   useEffect(() => {
//     setPagination(prev => ({
//       ...prev,
//       pages: totalPages,
//       total: filteredPolicies.length
//     }));
//   }, [totalPages, filteredPolicies.length]);

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       <div className="flex justify-between">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Policy Details</h2>

//         <div className="flex space-x-2 mb-6">
//           {["Insurance Company", "Insurance Type", "Add Policy"].map((tab) => {
//             const isActive = activeTab === tab.toLowerCase().replace(" ", "");
//             return (
//               <button
//                 key={tab}
//                 onClick={() => {
//                   setActiveTab(tab.toLowerCase().replace(" ", ""));
//                   if (tab === "Add Policy") navigate("/admin/add-policy");
//                   else if (tab === "Insurance Company") navigate("/admin/insurance-companies-list");
//                   else if (tab === "Insurance Type") navigate("/admin/insurance-type-list");
//                 }}
//                 className={`px-6 py-2 text-sm font-medium transition-all duration-200 border-t border border-gray-300 ${
//                   isActive
//                     ? "bg-[#398C89] text-white border-b-white -mb-px rounded-md"
//                     : "bg-[#398C89] text-white border-b-white -mb-px rounded-md"
//                 }`}
//                 style={isActive ? { borderBottomColor: 'white' } : {}}
//               >
//                 {tab}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Filters - Ab sab frontend pe perfectly work kar rahe hain */}
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Search By Name"
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={filterInputs.searchName}
//           onChange={(e) => handleFilterChange('searchName', e.target.value)}
//         />

//         <select
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={filterInputs.status}
//           onChange={(e) => handleFilterChange('status', e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option value="active">Active</option>
//           <option value="expired">Expired</option>
//           <option value="cancelled">Cancelled</option>
//         </select>

//         <select
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={filterInputs.policyHolderType}
//           onChange={(e) => handleFilterChange('policyHolderType', e.target.value)}
//         >
//           <option value="">All Types</option>
//           <option value="doctor">Doctor</option>
//           <option value="hospital">Hospital</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Search By Policy no"
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={filterInputs.policyNo}
//           onChange={(e) => handleFilterChange('policyNo', e.target.value)}
//         />

//         <input
//           type="date"
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={filterInputs.fromDate}
//           onChange={(e) => handleFilterChange('fromDate', e.target.value)}
//         />

//         <input
//           type="date"
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={filterInputs.toDate}
//           onChange={(e) => handleFilterChange('toDate', e.target.value)}
//         />
//       </div>

//       {loading && (
//         <div className="text-center py-4">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//           <p className="mt-2 text-gray-600">Loading policies...</p>
//         </div>
//       )}

//       <Table
//         data={paginatedPolicies.map(formatPolicyData)}
//         actions={actions}
//         headers={["Type", "Name", "Company", "Policy No", "Cover", "Start", "End", "Premium", "Paid By"]}
//       />

//       {/* Client-side Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center space-x-2 mt-6">
//           <button
//             onClick={() => handlePageChange(pagination.current - 1)}
//             disabled={pagination.current === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//           >
//             Previous
//           </button>
//           <span className="text-sm text-gray-600">
//             Page {pagination.current} of {totalPages} ({filteredPolicies.length} total)
//           </span>
//           <button
//             onClick={() => handlePageChange(pagination.current + 1)}
//             disabled={pagination.current === totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PolicyList;




// PolicyList.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../../../components/mainComponents/Table";
import { apiHelpers, apiEndpoints } from "../../../services/apiClient";

const PolicyList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("policy");

  const [allPolicies, setAllPolicies] = useState([]); // Raw data from API
  const [loading, setLoading] = useState(true);
  const [selectedPolicyDocs, setSelectedPolicyDocs] = useState(null); // For viewing documents

  // Filter states (frontend only)
  const [searchName, setSearchName] = useState("");
  const [status, setStatus] = useState("");
  const [policyHolderType, setPolicyHolderType] = useState("");
  const [policyNo, setPolicyNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch all policies once
  useEffect(() => {
    const fetchAllPolicies = async () => {
      try {
        setLoading(true);
        // Fetch without filters, bring maximum possible data
        const response = await apiHelpers.getList(apiEndpoints.policies.list, {
          page: 1,
          limit: 10000, // Adjust if your API supports higher
        });
        setAllPolicies(response.data || []);
      } catch (error) {
        console.error("Error fetching policies:", error);
        setAllPolicies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPolicies();
  }, []);

  // Frontend filtering logic
  const filteredPolicies = useMemo(() => {
    let filtered = allPolicies;

    // Name search
    if (searchName.trim()) {
      const lowerSearch = searchName.toLowerCase().trim();
      filtered = filtered.filter((p) =>
        p.policyHolder?.name?.toLowerCase().includes(lowerSearch)
      );
    }

    // Policy Number search
    if (policyNo.trim()) {
      const lowerPolicyNo = policyNo.toLowerCase().trim();
      filtered = filtered.filter((p) =>
        p.policyNumber?.toLowerCase().includes(lowerPolicyNo)
      );
    }

    // Status filter
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    // Policy Holder Type
    if (policyHolderType) {
      filtered = filtered.filter((p) => p.policyHolder?.type === policyHolderType);
    }

    // From Date filter (createdAt >= fromDate) - Using YYYY-MM-DD comparison
    if (fromDate) {
      filtered = filtered.filter((p) => {
        if (!p.createdAt) return false;
        // Extract YYYY-MM-DD from ISO string and compare directly
        const policyCreatedAt = p.createdAt.split('T')[0];
        return policyCreatedAt >= fromDate;
      });
    }

    // To Date filter (createdAt <= toDate) - Using YYYY-MM-DD comparison
    if (toDate) {
      filtered = filtered.filter((p) => {
        if (!p.createdAt) return false;
        // Extract YYYY-MM-DD from ISO string and compare directly
        const policyCreatedAt = p.createdAt.split('T')[0];
        return policyCreatedAt <= toDate;
      });
    }

    return filtered;
  }, [allPolicies, searchName, policyNo, status, policyHolderType, fromDate, toDate]);

  // Frontend pagination
  const totalItems = filteredPolicies.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredPolicies.slice(start, end);
  }, [filteredPolicies, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, policyNo, status, policyHolderType, fromDate, toDate]);


  const formatDateFromISO = (isoString) => {
    if (!isoString) return "N/A";
    // ISO string se direct YYYY-MM-DD part le lo (T se pehle tak)
    const datePart = isoString.split('T')[0]; // "2029-01-06"
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`; // Indian format: 06/01/2029
  };

  // Helper to format backend file paths to correct URLs
  const formatBackendPath = (path) => {
    if (!path) return '';
    // Fix Windows paths and absolute paths
    const cleanPath = path.toString().replace(/\\/g, '/');

    // Find where 'uploads/' starts
    const uploadsIndex = cleanPath.indexOf('uploads/');

    if (uploadsIndex !== -1) {
      // Extract part starting from 'uploads/'
      const relativePath = cleanPath.substring(uploadsIndex);

      // Get base URL (remove /api if it exists in the env var)
      const apiBase = import.meta.env.VITE_API_URI || 'http://localhost:3000';
      const baseUrl = apiBase.replace(/\/api\/?$/, ''); // Remove trailing /api

      return `${baseUrl}/${relativePath}`;
    }

    // Fallback for paths that might not contain 'uploads/'
    return path.startsWith('http') ? path : `${import.meta.env.VITE_API_URI || 'http://localhost:3000'}/${path}`;
  };

  // Export to CSV
  const handleExport = () => {
    if (!filteredPolicies.length) {
      alert("No data to export");
      return;
    }

    // Define headers
    const headers = [
      "Type", "Name", "Policy Number", "Insurance Company", "Insurance Type",
      "Coverage Amount", "Premium Amount", "Paid By", "Start Date", "End Date", "Status", "Narration"
    ];

    // Map data to rows
    const csvRows = filteredPolicies.map(policy => {
      const type = policy.policyHolder?.type || 'N/A';
      const name = policy.policyHolder?.name || 'N/A';
      const policyNo = policy.policyNumber || 'N/A';
      const company = policy.insuranceCompany?.companyName || 'N/A';
      const insType = policy.insuranceType?.typeName || policy.insuranceType?.name || 'N/A';
      const coverage = policy.coverageAmount || 0;
      const premium = policy.premiumAmount || 0;

      // Fix Paid By logic to match view/edit pages
      let paidBy = policy.paidBy || 'N/A';
      if (paidBy === 'by_company') paidBy = 'By Rapid';
      else if (paidBy === 'by_hospital') paidBy = 'By Hospital';
      else if (paidBy === 'by_doctor') paidBy = 'By Doctor';

      const start = formatDateFromISO(policy.startDate);
      const end = formatDateFromISO(policy.endDate);
      const status = policy.status || 'N/A';
      const narration = policy.narration ? `"${policy.narration.replace(/"/g, '""')}"` : ''; // Escape quotes

      return [
        type, name, policyNo, company, insType,
        coverage, premium, paidBy, start, end, status, narration
      ].join(",");
    });

    // Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `policies_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to calculate duration between start and end dates
  const calculateDuration = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return "N/A";

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Calculate difference in days
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.abs(Math.floor(timeDiff / (1000 * 3600 * 24)));

    // Calculate years, months, and days
    let years = Math.floor(daysDiff / 365);
    let remainingDays = daysDiff % 365;
    let months = Math.floor(remainingDays / 30);

    // Adjust if we have more than 11 months (round to next year)
    if (months >= 12) {
      years += 1;
      months = 0;
    }

    // Recalculate days after adjusting months
    remainingDays = daysDiff - (years * 365) - (months * 30);

    // Format the output
    let durationParts = [];
    if (years > 0) {
      durationParts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    }
    if (months > 0) {
      durationParts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    }
    if (daysDiff > 0 && durationParts.length === 0) {
      // If less than a month, show days
      durationParts.push(`${daysDiff} ${daysDiff === 1 ? 'day' : 'days'}`);
    }

    return durationParts.length > 0 ? durationParts.join(' ') : "0 days";
  };

  // Format for table
  const formatPolicyData = (policy) => ({
    Type: policy.policyHolder?.type || "N/A",
    Name: policy.policyHolder?.name || "N/A",
    Company: policy.insuranceCompany?.companyName || "N/A",
    PolicyNo: policy.policyNumber || "N/A",
    Cover: policy.coverageAmount ? `₹${policy.coverageAmount.toLocaleString("en-IN")}` : "N/A",
    Start: formatDateFromISO(policy.startDate),
    End: formatDateFromISO(policy.endDate),
    Duration: calculateDuration(policy.startDate, policy.endDate),
    // Start: policy.startDate ? new Date(policy.startDate).toLocaleDateString("en-IN") : "N/A",
    // End: policy.endDate ? new Date(policy.endDate).toLocaleDateString("en-IN") : "N/A",
    Premium: policy.premiumAmount ? `₹${policy.premiumAmount.toLocaleString("en-IN")}` : "N/A",
    PaidBy: policy.paidBy || "N/A",
    Status: policy.status?.charAt(0).toUpperCase() + policy.status?.slice(1) || "N/A",
    _id: policy._id,
    policyNumber: policy.policyNumber,
  });

  const location = useLocation();
  const getBasePath = () => {
    if (location.pathname.includes('/sales')) return '/sales';
    if (location.pathname.includes('/telecaller')) return '/telecaller';
    if (location.pathname.includes('/superadmin')) return '/superadmin';
    return '/admin';
  };
  const basePath = getBasePath();

  const actions = [
    {
      label: "View Details",
      useDropdown: true,
      showAsIcon: false,
      onClick: (row) => navigate(`${basePath}/view-policy/${row._id}`),
    },
    {
      label: "Edit",
      useDropdown: true,
      showAsIcon: false,
      onClick: (row) => navigate(`${basePath}/edit-policy/${row._id}`),
    },
    {
      label: "View Documents",
      useDropdown: true,
      showAsIcon: false,
      onClick: (row) => setSelectedPolicyDocs({
        policyNumber: row.policyNumber,
        documents: allPolicies.find(p => p._id === row._id)?.documents || { otherDocuments: [] }
      }),
    },
    {
      label: "Renew",
      useDropdown: true,
      showAsIcon: false,
      onClick: (row) => navigate(`${basePath}/renew-policy/${row._id}`),
    },
    {
      label: "History",
      useDropdown: true,
      showAsIcon: false,
      onClick: (row) => navigate(`${basePath}/policy-history/${encodeURIComponent(row.policyNumber)}`),
    },
    {
      label: "Delete",
      useDropdown: true,
      showAsIcon: false,
      onClick: async (row) => {
        if (window.confirm(`Delete policy ${row.PolicyNo}?`)) {
          // Add your delete API call here if needed
          alert("Delete functionality - implement API call");
        }
      },
    },
  ];

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Policy Details</h2>

        {/* Top Tabs */}
        <div className="flex space-x-2 mb-6">
          {["Insurance Company", "Insurance Type", "Add Policy"].map((tab) => {
            const tabKey = tab.toLowerCase().replace(" ", "");
            const isActive = activeTab === tabKey;

            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tabKey);
                  if (tab === "Add Policy") navigate("/admin/add-policy");
                  else if (tab === "Insurance Company") navigate("/admin/insurance-companies-list");
                  else if (tab === "Insurance Type") navigate("/admin/insurance-type-list");
                }}
                className={`px-6 py-2 text-sm font-medium transition-all duration-200 border-t border border-gray-300 ${isActive
                  ? "bg-[#398C89] text-white border-b-white -mb-px rounded-md"
                  : "bg-[#398C89] text-white border-b-white -mb-px rounded-md"
                  }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <div className="mb-6">
          <button
            onClick={handleExport}
            className="px-6 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Documents Modal */}
      {selectedPolicyDocs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Documents for Policy: {selectedPolicyDocs.policyNumber}
              </h3>
              <button
                onClick={() => setSelectedPolicyDocs(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              {/* Policy Document */}
              <div className="p-3 bg-gray-50 rounded border">
                <p className="font-semibold text-gray-700 mb-2">Policy Document:</p>
                {selectedPolicyDocs.documents?.policyDocument ? (
                  <a
                    href={formatBackendPath(selectedPolicyDocs.documents.policyDocument)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <span className="mr-2">📄</span> View Document
                  </a>
                ) : (
                  <p className="text-gray-400 italic">No document uploaded</p>
                )}
              </div>

              {/* Proposal Form */}
              <div className="p-3 bg-gray-50 rounded border">
                <p className="font-semibold text-gray-700 mb-2">Proposal Form:</p>
                {selectedPolicyDocs.documents?.proposalForm ? (
                  <a
                    href={formatBackendPath(selectedPolicyDocs.documents.proposalForm)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <span className="mr-2">📝</span> View Proposal Form
                  </a>
                ) : (
                  <p className="text-gray-400 italic">No proposal form uploaded</p>
                )}
              </div>

              {/* Other Documents */}
              <div className="p-3 bg-gray-50 rounded border">
                <p className="font-semibold text-gray-700 mb-2">Other Documents:</p>
                {selectedPolicyDocs.documents?.otherDocuments?.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedPolicyDocs.documents.otherDocuments.map((doc, idx) => (
                      <li key={idx}>
                        <a
                          href={formatBackendPath(doc)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          <span className="mr-2">📎</span> View Document {idx + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic">No other documents</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedPolicyDocs(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <input
          type="text"
          placeholder="Search By Name"
          className="p-2 border rounded bg-gray-100 text-sm"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <select
          className="p-2 border rounded bg-gray-100 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          className="p-2 border rounded bg-gray-100 text-sm"
          value={policyHolderType}
          onChange={(e) => setPolicyHolderType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="doctor">Doctor</option>
          <option value="hospital">Hospital</option>
        </select>

        <input
          type="text"
          placeholder="Search By Policy no"
          className="p-2 border rounded bg-gray-100 text-sm"
          value={policyNo}
          onChange={(e) => setPolicyNo(e.target.value)}
        />

        <input
          type="date"
          className="p-2 border rounded bg-gray-100 text-sm"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          className="p-2 border rounded bg-gray-100 text-sm"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading policies...</p>
        </div>
      )}

      {!loading && (
        <>
          <Table
            data={paginatedData.map(formatPolicyData)}
            actions={actions}
            headers={["Type", "Name", "Company", "Policy No", "Cover", "Start", "End", "Duration", "Premium", "Paid By", "Status"]}
            excludeColumns={['Start','End'  , 'policyNumber', '_id', 'startDate', 'endDate']}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages} ({totalItems} total)
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PolicyList;