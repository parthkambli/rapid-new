

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../../components/mainComponents/Table";
// import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

// const ReceiptList = () => {
//   const navigate = useNavigate();
//   const [receipts, setReceipts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 1000,
//     total: 0,
//     totalPages: 0,
//   });

//   // Search & Filter States
//   const [searchTrNo, setSearchTrNo] = useState("");
//   const [searchDoctor, setSearchDoctor] = useState(""); // ← NEW FIELD
//   const [searchSaleBillNo, setSearchSaleBillNo] = useState(""); // ← NEW FIELD
//   const [searchAmount, setSearchAmount] = useState("");
//   const [searchPaymentMode, setSearchPaymentMode] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   // Fetch receipts with all filters
//   // const fetchReceipts = async (page = 1) => {
//   //   setLoading(true);
//   //   try {
//   //     const params = {
//   //       page,
//   //       limit: pagination.limit,
//   //     };

//   //     // Add only non-empty filters
//   //     if (searchTrNo?.trim()) params.receiptNumber = searchTrNo.trim();
//   //     if (searchDoctor?.trim()) params.search = searchDoctor.trim();
//   //     if (searchSaleBillNo?.trim()) params.saleBillNo = searchSaleBillNo.trim(); // ← NEW FILTER
//   //     if (searchAmount?.trim()) params.amount = searchAmount.trim();
//   //     if (searchPaymentMode) params.paymentMethod = searchPaymentMode;
//   //     if (fromDate) params.fromDate = fromDate;
//   //     if (toDate) params.toDate = toDate;

//   //     const response = await apiClient.get(apiEndpoints.receipts.list, { params });

//   //     if (response.data && Array.isArray(response.data.data)) {
//   //       setReceipts(response.data.data);
//   //       setPagination((prev) => ({
//   //         ...prev,
//   //         page: response.data.page || 1,
//   //         total: response.data.total || 0,
//   //         totalPages: response.data.totalPages || 0,
//   //       }));
//   //     } else if (Array.isArray(response.data)) {
//   //       setReceipts(response.data);
//   //     } else {
//   //       setReceipts([]);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching receipts:", error);
//   //     alert("Failed to fetch receipts");
//   //     setReceipts([]);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };




// const fetchReceipts = async (page = 1) => {
//   setLoading(true);
//   try {
//     const params = {
//       page,
//       limit: pagination.limit,
//     };

//     // Add only non-empty filters
//     if (searchTrNo?.trim()) params.receiptNumber = searchTrNo.trim();
//     if (searchDoctor?.trim()) params.search = searchDoctor.trim();
//     if (searchSaleBillNo?.trim()) params.saleBillNo = searchSaleBillNo.trim();
//     if (searchAmount?.trim()) params.amount = searchAmount.trim();
//     if (searchPaymentMode) params.paymentMethod = searchPaymentMode;
//     if (fromDate) params.fromDate = fromDate;
//     if (toDate) params.toDate = toDate;

//     const response = await apiClient.get(apiEndpoints.receipts.list, { params });

//     let fetchedData = []; // ← Yeh variable banao

//     if (response.data && Array.isArray(response.data.data)) {
//       fetchedData = response.data.data;
//       setPagination((prev) => ({
//         ...prev,
//         page: response.data.page || 1,
//         total: response.data.total || 0,
//         totalPages: response.data.totalPages || 0,
//       }));
//     } else if (Array.isArray(response.data)) {
//       fetchedData = response.data;
//     }

//     // ← Yahan sort karo (newest first)
//     fetchedData.sort((a, b) => {
//       const dateA = new Date(a.createdAt || a.receiptDate || 0);
//       const dateB = new Date(b.createdAt || b.receiptDate || 0);
//       return dateB - dateA; // newest pehle
//     });

//     setReceipts(fetchedData); // ← Sirf ek baar set karo

//   } catch (error) {
//     console.error("Error fetching receipts:", error);
//     alert("Failed to fetch receipts");
//     setReceipts([]);
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchReceipts(1);
//   }, []);

//   const handleDeleteReceipt = async (receipt) => {
//     if (window.confirm(`Are you sure you want to delete receipt ${receipt.receiptNumber}?`)) {
//       try {
//         await apiHelpers.delete(apiEndpoints.receipts.delete, receipt._id);
//         alert("Receipt deleted successfully");
//         fetchReceipts(pagination.page);
//       } catch (error) {
//         console.error("Error deleting receipt:", error);
//         alert("Failed to delete receipt");
//       }
//     }
//   };

// const handlePrintReceipt = async (receipt) => {
//     try {
//       const token = localStorage.getItem('token');

//       // Step 1: Fetch receipt details
//       const response = await fetch(`
// http://localhost:3000/api/receipts/${receipt._id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch receipt details');
//       }

//       const receiptData = await response.json();

//       // Default print path
//       let printPath = `/admin/print-receipt/${receipt._id}`;

//       // Step 2: Check if linked to a SalesBill
//       if (receiptData.data.paymentAgainst && receiptData.data.paymentAgainst.referenceId) {
//         const billNumber = receiptData.data.referenceNumber;

//         // Fetch bill details to get membership type
//         const billResponse = await fetch(`
// http://localhost:3000/api/receipts/bill-details/${billNumber}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         if (billResponse.ok) {
//           const billData = await billResponse.json();
//           const membershipType = billData.data?.membershipType;

//           if (membershipType === 'monthly') {
//             printPath = `/admin/print-monthly-receipt/${receipt._id}`;
//           } else if (membershipType === 'yearly') {
//             printPath = `/admin/print-yearly-receipt/${receipt._id}`;
//           }
//           // agar membershipType kuch aur ya null hai to default rahega
//         }
//         // agar bill fetch fail ho to bhi default path rahega
//       }

//       // Final navigation using React Router (same tab)
//       navigate(printPath);

//     } catch (error) {
//       console.error('Error determining receipt type for print:', error);
//       // Fallback to default receipt print
//       navigate(`/admin/print-receipt/${receipt._id}`);
//     }
//   };

//   const actions = [
//     {
//       label: "Edit",
//       useDropdown: true,
//       onClick: (row) => navigate(`/admin/edit-receipt/${row._id}`),
//     },
//     {
//       label: "Print",
//       useDropdown: true,
//       onClick: handlePrintReceipt,
//     },
//     {
//       label: "View",
//       useDropdown: true,
//       onClick: (row) => navigate(`/admin/view-receipt/${row._id}`),
//     },
//     {
//       label: "Delete",
//       useDropdown: true,
//       onClick: handleDeleteReceipt,
//     },
//   ];

//   const tableColumns = [
//     { header: "Sr No", render: (row, idx) => (pagination.page - 1) * pagination.limit + idx + 1 },
//     { header: "Receipt No", render: (row) => row.receiptNumber || "N/A" },
//     {
//       header: "Doctor Name",
//       render: (row) => {
//         // Check if the payer entity has spouse information
//         const doctor = row.payer?.entityId;
//         if (doctor && doctor.linkedDoctorId && doctor.relationshipType === 'spouse') {
//           // If there's a linked spouse, show combined name
//           const spouseName = doctor.linkedDoctorId?.fullName;
//           return `${doctor.fullName} `;
//         }
//         // Otherwise, show the regular name
//         return row.payer?.entityId?.fullName || row.payer?.name || "N/A";
//       }
//     },
//     { header: "Sale Bill No", render: (row) => row.referenceNumber || row.saleBillNo || "N/A" },
//     { header: "Date", render: (row) => row.receiptDate ? new Date(row.receiptDate).toLocaleDateString() : "N/A" },
//     { header: "Amount", render: (row) => `₹${row.amount || 0}` },
//     { header: "Payment Mode", render: (row) => row.paymentMethod ? row.paymentMethod.charAt(0).toUpperCase() + row.paymentMethod.slice(1) : "N/A" },


//     {
//       header: "Payment Type",
//       render: (row) => (
//         <span className={`px-2 py-1 rounded text-xs ${
//           row.paymentType === 'installment'
//             ? 'bg-blue-100 text-blue-800'
//             : 'bg-purple-100 text-purple-800'
//         }`}>
//           {row.paymentType ? row.paymentType.charAt(0).toUpperCase() + row.paymentType.slice(1) : "Full"}
//         </span>
//       )
//     },
//     {
//       header: "Status",
//       render: (row) => (
//         <span
//           className={`px-2 py-1 rounded text-xs ${row.status === "received"
//             ? "bg-green-100 text-green-800"
//             : row.status === "pending"
//               ? "bg-yellow-100 text-yellow-800"
//               : "bg-red-100 text-red-800"
//             }`}
//         >
//           {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "Unknown"}
//         </span>
//       ),
//     },
//   ];

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchReceipts(1); // Always search from page 1
//   };

//   const handleReset = () => {
//     setSearchTrNo("");
//     setSearchDoctor("");
//     setSearchSaleBillNo(""); // ← Reset new field
//     setSearchAmount("");
//     setSearchPaymentMode("");
//     setFromDate("");
//     setToDate("");
//     fetchReceipts(1);
//   };

//   const handlePageChange = (newPage) => {
//     fetchReceipts(newPage);
//   };

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Receipt Management</h2>
//         <div className="space-x-2">
//           <button
//             onClick={() => navigate("/admin/create-bulk-receipt")}
//             className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors"
//           >
//             Create Bulk Receipt
//           </button>
//           <button
//             onClick={() => navigate("/admin/addbank")}
//             className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors"
//           >
//             Add Bank Account
//           </button>
//           <button
//             onClick={() => navigate("/admin/create-receipt")}
//             className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors"
//           >
//             Create Receipt
//           </button>
//         </div>
//       </div>

//       {/* Search Filters */}
//       <form onSubmit={handleSearch}>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
//           {/* Receipt No */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Receipt No</label>
//             <input
//               type="text"
//               value={searchTrNo}
//               onChange={(e) => setSearchTrNo(e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
//               placeholder="Receipt No..."
//             />
//           </div>

//           {/* Doctor Name - NEW */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Search Doctor</label>
//             <input
//               type="text"
//               value={searchDoctor}
//               onChange={(e) => setSearchDoctor(e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
//               placeholder="Doctor Name..."
//             />
//           </div>

//           {/* Sale Bill No - NEW */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Sale Bill No</label>
//             <input
//               type="text"
//               value={searchSaleBillNo}
//               onChange={(e) => setSearchSaleBillNo(e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
//               placeholder="Sale Bill No..."
//             />
//           </div>

//           {/* Amount */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Amount</label>
//             <input
//               type="text"
//               value={searchAmount}
//               onChange={(e) => setSearchAmount(e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
//               placeholder="Amount..."
//             />
//           </div>

//           {/* Payment Mode */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
//             <select
//               value={searchPaymentMode}
//               onChange={(e) => setSearchPaymentMode(e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
//             >
//               <option value="">All</option>
//               <option value="cash">Cash</option>
//               <option value="cheque">Cheque</option>
//               <option value="online">Online</option>
//               <option value="nach">NACH</option>
//               <option value="neft_rtgs">NEFT/RTGS</option>
//             </select>
//           </div>

//           {/* From Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">From Date</label>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
//             />
//           </div>

//           {/* To Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">To Date</label>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
//             />
//           </div>

//           {/* Search & Reset Buttons */}
//           <div className="flex items-end space-x-2 col-span-1 lg:col-span-6">
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Search
//             </button>
//             <button
//               type="button"
//               onClick={handleReset}
//               className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//             >
//               Reset All
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* Table */}
//       {loading ? (
//         <div className="text-center py-8">Loading receipts...</div>
//       ) : (
//         <Table
//           data={receipts}
//           actions={actions}
//           columns={tableColumns}

//           excludeColumns={["createdAt", "updatedAt", "receiptId", "taxDeducted", 'currency', 'remarks', 'isFirstPayment']}
//           pagination={true}
//           currentPage={pagination.page}
//           totalPages={pagination.totalPages}
//           onPageChange={handlePageChange}
//           totalItems={pagination.total}
//         />
//       )}

//       {!loading && receipts.length === 0 && (
//         <div className="text-center py-8 text-gray-500">No receipts found</div>
//       )}
//     </div>
//   );
// };

// export default ReceiptList;





import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/mainComponents/Table";
import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const ReceiptList = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 1000,
    total: 0,
    totalPages: 0,
  });

  // Search & Filter States
  const [searchTrNo, setSearchTrNo] = useState("");
  const [searchDoctor, setSearchDoctor] = useState(""); // ← NEW FIELD
  const [searchSaleBillNo, setSearchSaleBillNo] = useState(""); // ← NEW FIELD
  const [searchAmount, setSearchAmount] = useState("");
  const [searchPaymentMode, setSearchPaymentMode] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch receipts with all filters
  // const fetchReceipts = async (page = 1) => {
  //   setLoading(true);
  //   try {
  //     const params = {
  //       page,
  //       limit: pagination.limit,
  //     };

  //     // Add only non-empty filters
  //     if (searchTrNo?.trim()) params.receiptNumber = searchTrNo.trim();
  //     if (searchDoctor?.trim()) params.search = searchDoctor.trim();
  //     if (searchSaleBillNo?.trim()) params.saleBillNo = searchSaleBillNo.trim(); // ← NEW FILTER
  //     if (searchAmount?.trim()) params.amount = searchAmount.trim();
  //     if (searchPaymentMode) params.paymentMethod = searchPaymentMode;
  //     if (fromDate) params.fromDate = fromDate;
  //     if (toDate) params.toDate = toDate;

  //     const response = await apiClient.get(apiEndpoints.receipts.list, { params });

  //     if (response.data && Array.isArray(response.data.data)) {
  //       setReceipts(response.data.data);
  //       setPagination((prev) => ({
  //         ...prev,
  //         page: response.data.page || 1,
  //         total: response.data.total || 0,
  //         totalPages: response.data.totalPages || 0,
  //       }));
  //     } else if (Array.isArray(response.data)) {
  //       setReceipts(response.data);
  //     } else {
  //       setReceipts([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching receipts:", error);
  //     alert("Failed to fetch receipts");
  //     setReceipts([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };




const fetchReceipts = async (page = 1) => {
  setLoading(true);
  try {
    const params = {
      page,
      limit: pagination.limit,
    };

    // Add only non-empty filters
    if (searchTrNo?.trim()) params.receiptNumber = searchTrNo.trim();
    if (searchDoctor?.trim()) params.search = searchDoctor.trim();
    if (searchSaleBillNo?.trim()) params.saleBillNo = searchSaleBillNo.trim();
    if (searchAmount?.trim()) params.amount = searchAmount.trim();
    if (searchPaymentMode) params.paymentMethod = searchPaymentMode;
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    const response = await apiClient.get(apiEndpoints.receipts.list, { params });

    let fetchedData = []; // ← Yeh variable banao

    if (response.data && Array.isArray(response.data.data)) {
      fetchedData = response.data.data;
      setPagination((prev) => ({
        ...prev,
        page: response.data.page || 1,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
      }));
    } else if (Array.isArray(response.data)) {
      fetchedData = response.data;
    }

    // ← Yahan sort karo (newest first)
    fetchedData.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.receiptDate || 0);
      const dateB = new Date(b.createdAt || b.receiptDate || 0);
      return dateB - dateA; // newest pehle
    });

    setReceipts(fetchedData); // ← Sirf ek baar set karo

  } catch (error) {
    console.error("Error fetching receipts:", error);
    alert("Failed to fetch receipts");
    setReceipts([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchReceipts(1);
  }, []);

  const handleDeleteReceipt = async (receipt) => {
    if (window.confirm(`Are you sure you want to delete receipt ${receipt.receiptNumber}?`)) {
      try {
        await apiHelpers.delete(apiEndpoints.receipts.delete, receipt._id);
        alert("Receipt deleted successfully");
        fetchReceipts(pagination.page);
      } catch (error) {
        console.error("Error deleting receipt:", error);
        alert("Failed to delete receipt");
      }
    }
  };

const handlePrintReceipt = async (receipt) => {
    try {
      const token = localStorage.getItem('token');

      // Step 1: Fetch receipt details
      const response = await fetch(`
http://localhost:3000/api/receipts/${receipt._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch receipt details');
      }

      const receiptData = await response.json();

      // Default print path
      let printPath = `/admin/print-receipt/${receipt._id}`;

      // Step 2: Check if linked to a SalesBill
      if (receiptData.data.paymentAgainst && receiptData.data.paymentAgainst.referenceId) {
        const billNumber = receiptData.data.referenceNumber;

        // Fetch bill details to get membership type
        const billResponse = await fetch(`
http://localhost:3000/api/receipts/bill-details/${billNumber}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (billResponse.ok) {
          const billData = await billResponse.json();
          const membershipType = billData.data?.membershipType;

          if (membershipType === 'monthly') {
            printPath = `/admin/print-monthly-receipt/${receipt._id}`;
          } else if (membershipType === 'yearly') {
            printPath = `/admin/print-yearly-receipt/${receipt._id}`;
          }
          // agar membershipType kuch aur ya null hai to default rahega
        }
        // agar bill fetch fail ho to bhi default path rahega
      }

      // Final navigation using React Router (same tab)
      navigate(printPath);

    } catch (error) {
      console.error('Error determining receipt type for print:', error);
      // Fallback to default receipt print
      navigate(`/admin/print-receipt/${receipt._id}`);
    }
  };

  const actions = [
    {
      label: "Edit",
      useDropdown: true,
      onClick: (row) => navigate(`/admin/edit-receipt/${row._id}`),
    },
    {
      label: "Print",
      useDropdown: true,
      onClick: handlePrintReceipt,
    },
    {
      label: "View",
      useDropdown: true,
      onClick: (row) => navigate(`/admin/view-receipt/${row._id}`),
    },
    {
      label: "Delete",
      useDropdown: true,
      onClick: handleDeleteReceipt,
    },
  ];

  const tableColumns = [
    { header: "Sr No", render: (row, idx) => (pagination.page - 1) * pagination.limit + idx + 1 },
    { header: "Receipt No", render: (row) => row.receiptNumber || "N/A" },
    {
      header: "Doctor Name",
      render: (row) => {
        // Check if the payer entity has spouse information
        const doctor = row.payer?.entityId;
        if (doctor && doctor.linkedDoctorId && doctor.relationshipType === 'spouse') {
          // If there's a linked spouse, show combined name
          const spouseName = doctor.linkedDoctorId?.fullName;
          return `${doctor.fullName} `;
        }
        // Otherwise, show the regular name
        return row.payer?.entityId?.fullName || row.payer?.name || "N/A";
      }
    },
    { header: "Sale Bill No", render: (row) => row.referenceNumber || row.saleBillNo || "N/A" },
    { header: "Date", render: (row) => row.receiptDate ? new Date(row.receiptDate).toLocaleDateString() : "N/A" },
    { header: "Amount", render: (row) => `₹${row.amount || 0}` },
    { header: "Payment Mode", render: (row) => row.paymentMethod ? row.paymentMethod.charAt(0).toUpperCase() + row.paymentMethod.slice(1) : "N/A" },


    {
      header: "Payment Type",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.paymentType === 'installment'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800'
        }`}>
          {row.paymentType ? row.paymentType.charAt(0).toUpperCase() + row.paymentType.slice(1) : "Full"}
        </span>
      )
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs ${row.status === "received"
            ? "bg-green-100 text-green-800"
            : row.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "Unknown"}
        </span>
      ),
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReceipts(1); // Always search from page 1
  };

  const handleReset = () => {
    setSearchTrNo("");
    setSearchDoctor("");
    setSearchSaleBillNo(""); // ← Reset new field
    setSearchAmount("");
    setSearchPaymentMode("");
    setFromDate("");
    setToDate("");
    fetchReceipts(1);
  };

  const handlePageChange = (newPage) => {
    fetchReceipts(newPage);
  };

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Receipt Management</h2>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/admin/create-bulk-receipt")}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors"
          >
            Create Bulk Receipt
          </button>
          <button
            onClick={() => navigate("/admin/addbank")}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors"
          >
            Add Bank Account
          </button>
          <button
            onClick={() => navigate("/admin/create-receipt")}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors"
          >
            Create Receipt
          </button>
        </div>
      </div>

      {/* Search Filters */}
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {/* Receipt No */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Receipt No</label>
            <input
              type="text"
              value={searchTrNo}
              onChange={(e) => setSearchTrNo(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
              placeholder="Receipt No..."
            />
          </div>

          {/* Doctor Name - NEW */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Search Doctor</label>
            <input
              type="text"
              value={searchDoctor}
              onChange={(e) => setSearchDoctor(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
              placeholder="Doctor Name..."
            />
          </div>

          {/* Sale Bill No - NEW */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Sale Bill No</label>
            <input
              type="text"
              value={searchSaleBillNo}
              onChange={(e) => setSearchSaleBillNo(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
              placeholder="Sale Bill No..."
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="text"
              value={searchAmount}
              onChange={(e) => setSearchAmount(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
              placeholder="Amount..."
            />
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
            <select
              value={searchPaymentMode}
              onChange={(e) => setSearchPaymentMode(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
            >
              <option value="">All</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
              <option value="nach">NACH</option>
              <option value="neft_rtgs">NEFT/RTGS</option>
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
            />
          </div>

          {/* Search & Reset Buttons */}
          <div className="flex items-end space-x-2 col-span-1 lg:col-span-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Reset All
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">Loading receipts...</div>
      ) : (
        <Table
          data={receipts}
          actions={actions}
          columns={tableColumns}

          excludeColumns={["createdAt", "updatedAt", "receiptId", "taxDeducted", 'currency', 'remarks', 'isFirstPayment']}
          pagination={true}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={pagination.total}
        />
      )}

      {!loading && receipts.length === 0 && (
        <div className="text-center py-8 text-gray-500">No receipts found</div>
      )}
    </div>
  );
};

export default ReceiptList;