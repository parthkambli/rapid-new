





import React, { useState, useEffect, useMemo } from "react";
import Table from "../../../components/mainComponents/Table";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";

const QuotationList = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // Store original data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotationData();
  }, []);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase().trim();
    return data.filter(item => {
      return (
        (item.Code && item.Code.toLowerCase().includes(query)) ||
        (item["Party Name"] && item["Party Name"].toLowerCase().includes(query)) ||
        (item.Narration && item.Narration.toLowerCase().includes(query)) ||
        (item["Entry Date"] && item["Entry Date"].toLowerCase().includes(query)) ||
        (item.id && item.id.toLowerCase().includes(query))
      );
    });
  }, [data, searchQuery]);

  const fetchQuotationData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.quotations.myQuotations);

      if (response.data.success) {
        const mappedData = response.data.data.map(quotation => ({
          id: quotation._id,
          Code: quotation.quotationNumber || `Q${quotation._id.slice(-6).toUpperCase()}`,
          "Party Name": quotation.requester?.name || quotation.doctorName || "N/A",
          Narration: quotation.requestDetails?.additionalRequirements || "N/A",
          "Entry Date": new Date(quotation.createdAt).toLocaleDateString('en-GB'),
          status: quotation.status || "responses_pending",
          totalAmount: quotation.totalAmount || 0,
          clientEmail: quotation.requester?.email || "N/A",
          clientPhone: quotation.requester?.phone || "N/A",
          createdAt: quotation.createdAt,
          rawData: quotation
        }));

        setData(mappedData);
        setAllData(mappedData); // Store original data
      } else {
        toast.error("Failed to load quotation data");
      }
    } catch (error) {
      console.error("Error fetching quotation data:", error);
      setError("Failed to load quotation data");
      toast.error("Failed to load quotation data");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    document.querySelector('input[name="search"]').value = '';
  };

  // Action buttons
  const actions = [
    {
      label: "Print",
      icon: (
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      ),
      onClick: (row) => {
        window.open(`/telecaller/quotation/${row.id}/`, '_blank');
      },
      showAsIcon: true,
    },
    {
      label: "Edit",
      icon: (
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      onClick: (row) => {
        navigate(`/telecaller/quotation/edit/${row.id}`);
      },
      showAsIcon: true,
    },
    {
      label: "Delete",
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2.2 2.2 0 0116.138 21H7.862a2.2 2.2 0 011.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: async (row) => {
        if (window.confirm("Are you sure you want to delete this quotation?")) {
          try {
            const response = await apiClient.delete(apiEndpoints.quotations.delete(row.id));
            if (response.data.success) {
              toast.success("Quotation deleted successfully");
              setData(prevData => prevData.filter(item => item.id !== row.id));
              setAllData(prevData => prevData.filter(item => item.id !== row.id));
            } else {
              throw new Error(response.data.message || "Failed to delete quotation");
            }
          } catch (error) {
            console.error("Error deleting quotation:", error);
            toast.error("Failed to delete quotation");
          }
        }
      },
      showAsIcon: true,
    },
  ];

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quotations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Quotation</h2>
          <button
            onClick={() => navigate("/telecaller/add/quotation")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Quotation
          </button>
        </div>
        <div className="text-red-500 text-center p-4 bg-red-50 rounded">
          {error}
          <button
            onClick={fetchQuotationData}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Quotation</h2>
        <button
          onClick={() => navigate("/telecaller/add/quotation")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Quotation
        </button>
      </div>

      {/* Search input with clear button */}
      <div className="mb-4 relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-1/3">
            <input
              type="text"
              name="search"
              placeholder="Search by Code, Party Name, Narration..."
              value={searchQuery}
              onChange={handleSearch}
              className="p-2 pl-10 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Search icon */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Clear button (only when there's text) */}
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Show results count */}
          {searchQuery && (
            <div className="text-sm text-gray-600">
              Found {filteredData.length} of {data.length} quotations
            </div>
          )}
        </div>
      </div>

      {/* Show message if no results found */}
      {searchQuery && filteredData.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-700">
            No quotations found for "{searchQuery}". Try a different search term.
          </p>
          <button
            onClick={handleClearSearch}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear search
          </button>
        </div>
      )}

      <Table
        data={filteredData} // Pass filtered data to table
        actions={actions}
        excludeColumns={["id", "status", "totalAmount", "clientEmail", "clientPhone", "createdAt", "rawData"]}
        columnOrder={["Code", "Party Name", "Narration", "Entry Date", "Status"]}
      />
    </div>
  );
};

export default QuotationList;













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

//       const response = await apiClient.get(`${apiEndpoints.quotations.myQuotations}?${params.toString()}`);

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
//     navigate(`/telecaller/quotation/edit/${row.id}`);
//   };

//   const actions = [
//     {
//       label: "Print",
//       icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
//       onClick: (row) => window.open(`/telecaller/quotation/${row.id}/`, '_blank'),
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
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Quotation List</h2>
//         <button
//           onClick={() => navigate("/telecaller/add/quotation")}
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

