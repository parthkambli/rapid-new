

// // PolicyList.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Table from "../../../components/mainComponents/Table";
// import { apiHelpers, apiEndpoints } from "../../../services/apiClient";

// const PolicyList = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("policy");

//   const [allPolicies, setAllPolicies] = useState([]); // Raw data from API
//   const [loading, setLoading] = useState(true);
//   const [selectedPolicyDocs, setSelectedPolicyDocs] = useState(null); // For viewing documents

//   // Filter states (frontend only)
//   const [searchName, setSearchName] = useState("");
//   const [status, setStatus] = useState("");
//   const [policyHolderType, setPolicyHolderType] = useState("");
//   const [policyNo, setPolicyNo] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   // Fetch all policies once
//   useEffect(() => {
//     const fetchAllPolicies = async () => {
//       try {
//         setLoading(true);
//         // Fetch without filters, bring maximum possible data
//         const response = await apiHelpers.getList(apiEndpoints.policies.list, {
//           page: 1,
//           limit: 10000, // Adjust if your API supports higher
//         });
//         setAllPolicies(response.data || []);
//       } catch (error) {
//         console.error("Error fetching policies:", error);
//         setAllPolicies([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllPolicies();
//   }, []);

//   // Frontend filtering logic
//   const filteredPolicies = useMemo(() => {
//     let filtered = allPolicies;

//     // Name search
//     if (searchName.trim()) {
//       const lowerSearch = searchName.toLowerCase().trim();
//       filtered = filtered.filter((p) =>
//         p.policyHolder?.name?.toLowerCase().includes(lowerSearch)
//       );
//     }

//     // Policy Number search
//     if (policyNo.trim()) {
//       const lowerPolicyNo = policyNo.toLowerCase().trim();
//       filtered = filtered.filter((p) =>
//         p.policyNumber?.toLowerCase().includes(lowerPolicyNo)
//       );
//     }

//     // Status filter
//     if (status) {
//       filtered = filtered.filter((p) => p.status === status);
//     }

//     // Policy Holder Type
//     if (policyHolderType) {
//       filtered = filtered.filter((p) => p.policyHolder?.type === policyHolderType);
//     }

//     // From Date filter (startDate >= fromDate)
//     if (fromDate) {
//       const from = new Date(fromDate);
//       filtered = filtered.filter((p) => {
//         if (!p.startDate) return false;
//         return new Date(p.startDate) >= from;
//       });
//     }

//     // To Date filter (endDate <= toDate)
//     if (toDate) {
//       const to = new Date(toDate);
//       to.setHours(23, 59, 59, 999); // Include full day
//       filtered = filtered.filter((p) => {
//         if (!p.endDate) return false;
//         return new Date(p.endDate) <= to;
//       });
//     }

//     return filtered;
//   }, [allPolicies, searchName, policyNo, status, policyHolderType, fromDate, toDate]);

//   // Frontend pagination
//   const totalItems = filteredPolicies.length;
//   const totalPages = Math.ceil(totalItems / pageSize);

//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * pageSize;
//     const end = start + pageSize;
//     return filteredPolicies.slice(start, end);
//   }, [filteredPolicies, currentPage]);

//   // Reset page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchName, policyNo, status, policyHolderType, fromDate, toDate]);


//   const formatDateFromISO = (isoString) => {
//     if (!isoString) return "N/A";
//     // ISO string se direct YYYY-MM-DD part le lo (T se pehle tak)
//     const datePart = isoString.split('T')[0]; // "2029-01-06"
//     const [year, month, day] = datePart.split('-');
//     return `${day}/${month}/${year}`; // Indian format: 06/01/2029
//   };

//   // Helper to format backend file paths to correct URLs
//   const formatBackendPath = (path) => {
//     if (!path) return '';
//     // Fix Windows paths and absolute paths
//     const cleanPath = path.toString().replace(/\\/g, '/');

//     // Find where 'uploads/' starts
//     const uploadsIndex = cleanPath.indexOf('uploads/');

//     if (uploadsIndex !== -1) {
//       // Extract part starting from 'uploads/'
//       const relativePath = cleanPath.substring(uploadsIndex);

//       // Get base URL (remove /api if it exists in the env var)
//       const apiBase = import.meta.env.VITE_API_URI || 'http://localhost:3000';
//       const baseUrl = apiBase.replace(/\/api\/?$/, ''); // Remove trailing /api

//       return `${baseUrl}/${relativePath}`;
//     }

//     // Fallback for paths that might not contain 'uploads/'
//     return path.startsWith('http') ? path : `${import.meta.env.VITE_API_URI || 'http://localhost:3000'}/${path}`;
//   };

//   // Export to CSV
//   const handleExport = () => {
//     if (!filteredPolicies.length) {
//       alert("No data to export");
//       return;
//     }

//     // Define headers
//     const headers = [
//       "Type", "Name", "Policy Number", "Insurance Company", "Insurance Type",
//       "Coverage Amount", "Premium Amount", "Paid By", "Start Date", "End Date", "Status", "Narration"
//     ];

//     // Map data to rows
//     const csvRows = filteredPolicies.map(policy => {
//       const type = policy.policyHolder?.type || 'N/A';
//       const name = policy.policyHolder?.name || 'N/A';
//       const policyNo = policy.policyNumber || 'N/A';
//       const company = policy.insuranceCompany?.companyName || 'N/A';
//       const insType = policy.insuranceType?.typeName || policy.insuranceType?.name || 'N/A';
//       const coverage = policy.coverageAmount || 0;
//       const premium = policy.premiumAmount || 0;

//       // Fix Paid By logic to match view/edit pages
//       let paidBy = policy.paidBy || 'N/A';
//       if (paidBy === 'by_company') paidBy = 'By Rapid';
//       else if (paidBy === 'by_hospital') paidBy = 'By Hospital';
//       else if (paidBy === 'by_doctor') paidBy = 'By Doctor';

//       const start = formatDateFromISO(policy.startDate);
//       const end = formatDateFromISO(policy.endDate);
//       const status = policy.status || 'N/A';
//       const narration = policy.narration ? `"${policy.narration.replace(/"/g, '""')}"` : ''; // Escape quotes

//       return [
//         type, name, policyNo, company, insType,
//         coverage, premium, paidBy, start, end, status, narration
//       ].join(",");
//     });

//     // Combine headers and rows
//     const csvContent = [headers.join(","), ...csvRows].join("\n");

//     // Create download link
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `policies_export_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Format for table
//   const formatPolicyData = (policy) => ({
//     Type: policy.policyHolder?.type || "N/A",
//     Name: policy.policyHolder?.name || "N/A",
//     Company: policy.insuranceCompany?.companyName || "N/A",
//     PolicyNo: policy.policyNumber || "N/A",
//     Cover: policy.coverageAmount ? `₹${policy.coverageAmount.toLocaleString("en-IN")}` : "N/A",


//     Start: formatDateFromISO(policy.startDate),
//     End: formatDateFromISO(policy.endDate),
//     // Start: policy.startDate ? new Date(policy.startDate).toLocaleDateString("en-IN") : "N/A",
//     // End: policy.endDate ? new Date(policy.endDate).toLocaleDateString("en-IN") : "N/A",
//     Premium: policy.premiumAmount ? `₹${policy.premiumAmount.toLocaleString("en-IN")}` : "N/A",
//     PaidBy: policy.paidBy || "N/A",
//     Status: policy.status?.charAt(0).toUpperCase() + policy.status?.slice(1) || "N/A",
//     _id: policy._id,
//     policyNumber: policy.policyNumber,
//   });

//   const location = useLocation();
//   const getBasePath = () => {
//     if (location.pathname.includes('/sales')) return '/sales';
//     if (location.pathname.includes('/telecaller')) return '/telecaller';
//     // if (location.pathname.includes('/superadmin')) return '/superadmin';
//     return '/admin';
//   };
//   const basePath = getBasePath();

//   const actions = [
//     {
//       label: "View Details",
//       useDropdown: true,
//       showAsIcon: false,
//       onClick: (row) => navigate(`${basePath}/view-policy/${row._id}`),
//     },
//     {
//       label: "Edit",
//       useDropdown: true,
//       showAsIcon: false,
//       onClick: (row) => navigate(`${basePath}/edit-policy/${row._id}`),
//     },
//     {
//       label: "View Documents",
//       useDropdown: true,
//       showAsIcon: false,
//       onClick: (row) => setSelectedPolicyDocs({
//         policyNumber: row.policyNumber,
//         documents: allPolicies.find(p => p._id === row._id)?.documents || { otherDocuments: [] }
//       }),
//     },
//     {
//       label: "Renew",
//       useDropdown: true,
//       showAsIcon: false,
//       onClick: (row) => navigate(`${basePath}/renew-policy/${row._id}`),
//     },
//     {
//       label: "History",
//       useDropdown: true,
//       showAsIcon: false,
//       onClick: (row) => navigate(`${basePath}/policy-history/${encodeURIComponent(row.policyNumber)}`),
//     },
//     {
//       label: "Delete",
//       useDropdown: true,
//       showAsIcon: false,
//       onClick: async (row) => {
//         if (window.confirm(`Delete policy ${row.PolicyNo}?`)) {
//           // Add your delete API call here if needed
//           alert("Delete functionality - implement API call");
//         }
//       },
//     },
//   ];

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       <div className="flex justify-between">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Policy Details</h2>

//         {/* Top Tabs */}
//         <div className="flex space-x-2 mb-6">
//           {["Insurance Company", "Insurance Type", "Add Policy"].map((tab) => {
//             const tabKey = tab.toLowerCase().replace(" ", "");
//             const isActive = activeTab === tabKey;

//             return (
//               <button
//                 key={tab}
//                 onClick={() => {
//                   setActiveTab(tabKey);
//                   if (tab === "Add Policy") navigate("/admin/add-policy");
//                   else if (tab === "Insurance Company") navigate("/admin/insurance-companies-list");
//                   else if (tab === "Insurance Type") navigate("/admin/insurance-type-list");
//                 }}
//                 className={`px-6 py-2 text-sm font-medium transition-all duration-200 border-t border border-gray-300 ${isActive
//                   ? "bg-[#398C89] text-white border-b-white -mb-px rounded-md"
//                   : "bg-[#398C89] text-white border-b-white -mb-px rounded-md"
//                   }`}
//               >
//                 {tab}
//               </button>
//             );
//           })}
//         </div>
//         <div className="mb-6">
//           <button
//             onClick={handleExport}
//             className="px-6 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//           >
//             Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Documents Modal */}
//       {selectedPolicyDocs && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-gray-800">
//                 Documents for Policy: {selectedPolicyDocs.policyNumber}
//               </h3>
//               <button
//                 onClick={() => setSelectedPolicyDocs(null)}
//                 className="text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 &times;
//               </button>
//             </div>

//             <div className="space-y-4">
//               {/* Policy Document */}
//               <div className="p-3 bg-gray-50 rounded border">
//                 <p className="font-semibold text-gray-700 mb-2">Policy Document:</p>
//                 {selectedPolicyDocs.documents?.policyDocument ? (
//                   <a
//                     href={formatBackendPath(selectedPolicyDocs.documents.policyDocument)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//                   >
//                     <span className="mr-2">📄</span> View Document
//                   </a>
//                 ) : (
//                   <p className="text-gray-400 italic">No document uploaded</p>
//                 )}
//               </div>

//               {/* Proposal Form */}
//               <div className="p-3 bg-gray-50 rounded border">
//                 <p className="font-semibold text-gray-700 mb-2">Proposal Form:</p>
//                 {selectedPolicyDocs.documents?.proposalForm ? (
//                   <a
//                     href={formatBackendPath(selectedPolicyDocs.documents.proposalForm)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//                   >
//                     <span className="mr-2">📝</span> View Proposal Form
//                   </a>
//                 ) : (
//                   <p className="text-gray-400 italic">No proposal form uploaded</p>
//                 )}
//               </div>

//               {/* Other Documents */}
//               <div className="p-3 bg-gray-50 rounded border">
//                 <p className="font-semibold text-gray-700 mb-2">Other Documents:</p>
//                 {selectedPolicyDocs.documents?.otherDocuments?.length > 0 ? (
//                   <ul className="space-y-2">
//                     {selectedPolicyDocs.documents.otherDocuments.map((doc, idx) => (
//                       <li key={idx}>
//                         <a
//                           href={formatBackendPath(doc)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//                         >
//                           <span className="mr-2">📎</span> View Document {idx + 1}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-400 italic">No other documents</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => setSelectedPolicyDocs(null)}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Search By Name"
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
//         />

//         <select
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option value="active">Active</option>
//           <option value="expired">Expired</option>
//           <option value="cancelled">Cancelled</option>
//         </select>

//         <select
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={policyHolderType}
//           onChange={(e) => setPolicyHolderType(e.target.value)}
//         >
//           <option value="">All Types</option>
//           <option value="doctor">Doctor</option>
//           <option value="hospital">Hospital</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Search By Policy no"
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={policyNo}
//           onChange={(e) => setPolicyNo(e.target.value)}
//         />

//         <input
//           type="date"
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//         />

//         <input
//           type="date"
//           className="p-2 border rounded bg-gray-100 text-sm"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//         />
//       </div>

//       {loading && (
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//           <p className="mt-2 text-gray-600">Loading policies...</p>
//         </div>
//       )}

//       {!loading && (
//         <>
//           <Table
//             data={paginatedData.map(formatPolicyData)}
//             actions={actions}
//             headers={["Type", "Name", "Company", "Policy No", "Cover", "Start", "End", "Premium", "Paid By", "Status"]}
//           />

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center space-x-4 mt-6">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>

//               <span className="text-sm text-gray-700">
//                 Page {currentPage} of {totalPages} ({totalItems} total)
//               </span>

//               <button
//                 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//                 className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
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

    // From Date filter (startDate >= fromDate)
    if (fromDate) {
      const from = new Date(fromDate);
      filtered = filtered.filter((p) => {
        if (!p.startDate) return false;
        return new Date(p.startDate) >= from;
      });
    }

    // To Date filter (endDate <= toDate)
    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999); // Include full day
      filtered = filtered.filter((p) => {
        if (!p.endDate) return false;
        return new Date(p.endDate) <= to;
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