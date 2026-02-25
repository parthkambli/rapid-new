// src/pages/ReceiptsPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import Table from "../../../../components/mainComponents/Table"; // assuming this is correct now
// import { Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";
// import apiClient, { apiEndpoints } from "../../../../services/apiClient";

// export default function ReceiptsPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [receipts, setReceipts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalDocs, setTotalDocs] = useState(0);

//   // Filters
//   const [filters, setFilters] = useState({
//     dateFrom: "",
//     dateTo: "",
//     paymentMethod: "",
//     search: "",
//   });

//   const fetchReceipts = async () => {
//     if (!id) {
//       toast.error("No doctor selected");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log(`[DEBUG] Fetching receipts for doctor ID: ${id}`);

//       // Try different param names — backend might expect one of these
//       const params = {
//         doctor: id, // original
//         doctorId: id, // common alternative
//         payer: id, // if payer.entityId is used
//         payerId: id,
//         limit: 1000,
//         page: 1,
//       };

//       console.log("[DEBUG] Request params (trying multiple):", params);

//       const response = await apiClient.get(apiEndpoints.receipts.list, {
//         params,
//       });

//       console.log("[DEBUG] Full API response:", response.data);

//       let data = response.data.data || response.data.receipts || [];

//       // Extra safety: client-side filter by doctor ID if backend doesn't
//       data = data.filter((receipt) => {
//         // Check common fields where doctor ID might be stored
//         return (
//           receipt.payer?.entityId?._id === id ||
//           receipt.payer?.entityId === id ||
//           receipt.doctor === id ||
//           receipt.doctorId === id ||
//           receipt.payerId === id
//         );
//       });

//       console.log(
//         `[DEBUG] Receipts after strict doctor filter: ${data.length}`,
//       );
//       if (data.length > 0) {
//         console.log("[DEBUG] First filtered receipt:", data[0]);
//       } else if (response.data.data?.length > 0) {
//         console.log(
//           "[WARNING] Backend returned receipts but none matched doctor ID",
//         );
//         console.log(
//           "Sample unfiltered receipt payer:",
//           response.data.data[0]?.payer,
//         );
//       } else {
//         console.log("[DEBUG] API returned no receipts at all");
//       }

//       // Apply user filters
//       if (filters.dateFrom || filters.dateTo) {
//         const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
//         const to = filters.dateTo ? new Date(filters.dateTo) : null;
//         if (to) to.setHours(23, 59, 59, 999);
//         data = data.filter((r) => {
//           if (!r.receiptDate) return false;
//           const rDate = new Date(r.receiptDate);
//           return (!from || rDate >= from) && (!to || rDate <= to);
//         });
//       }

//       if (filters.paymentMethod) {
//         data = data.filter((r) => r.paymentMethod === filters.paymentMethod);
//       }

//       if (filters.search) {
//         const searchLower = filters.search.toLowerCase();
//         data = data.filter(
//           (r) =>
//             r.receiptNumber?.toLowerCase().includes(searchLower) ||
//             r.payer?.name?.toLowerCase().includes(searchLower),
//         );
//       }

//       console.log(
//         `[DEBUG] Final receipts count after all filters: ${data.length}`,
//       );

//       setReceipts(data);

//       const hasFilter = Object.values(filters).some((v) => !!v);
//       if (hasFilter) {
//         setTotalPages(1);
//         setTotalDocs(data.length);
//       } else {
//         const pagination = response.data.pagination || {};
//         setTotalPages(pagination.pages || 1);
//         setTotalDocs(pagination.total || data.length);
//       }
//     } catch (error) {
//       console.error("[ERROR] Fetch receipts failed:", error);
//       if (error.response) {
//         console.error("Response status:", error.response.status);
//         console.error("Response data:", error.response.data);
//       }
//       toast.error("Failed to load receipts");
//       setReceipts([]);
//       setTotalPages(1);
//       setTotalDocs(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExportCSV = () => {
//     if (receipts.length === 0) {
//       toast.info("No receipts to export");
//       return;
//     }

//     // Define CSV headers
//     const headers = [
//       "Receipt No",
//       "Date",
//       "Payment Mode",
//       "Amount (₹)",
//       "Payer Name",
//       "Transaction/Reference",
//       "Status",
//     ];

//     // Map receipts to rows
//     const rows = receipts.map((receipt) => {
//       const payerName =
//         receipt.payer?.name ||
//         receipt.payer?.entityId?.fullName ||
//         receipt.payer?.entityId?.hospitalName ||
//         "—";

//       return [
//         receipt.receiptNumber || receipt.receiptId || "—",
//         receipt.receiptDate
//           ? new Date(receipt.receiptDate).toLocaleDateString("en-GB")
//           : "—",
//         receipt.paymentMethod ? receipt.paymentMethod.toUpperCase() : "—",
//         receipt.amount ? receipt.amount.toLocaleString("en-IN") : "0",
//         payerName,
//         receipt.transactionId || receipt.reference || receipt.trno || "—",
//         receipt.status || "—",
//       ];
//     });

//     // Build CSV content
//     const csvContent = [
//       headers.join(","),
//       ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
//     ].join("\n");

//     // Create blob and trigger download
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `receipts-doctor-${id}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);

//     toast.success("Receipts exported successfully!");
//   };

//   useEffect(() => {
//     fetchReceipts();
//   }, [id, page, filters]);

//   const handleFilterChange = (field, value) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//     setPage(1);
//   };

//   const handleReset = () => {
//     setFilters({
//       dateFrom: "",
//       dateTo: "",
//       paymentMethod: "",
//       search: "",
//     });
//     setPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages && !loading) {
//       setPage(newPage);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount || 0);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "—";
//     return new Date(dateString).toLocaleDateString("en-GB");
//   };

//   const tableData = receipts.map((row) => ({
//     _id: row._id,
//     // id: row._id,
//     receiptNo: row.receiptNumber || row.receiptId || "—",
//     date: formatDate(row.receiptDate),
//     mode: row.paymentMethod ? row.paymentMethod.toUpperCase() : "—",
//     amount: formatCurrency(row.amount),
//     original: row,
//   }));

//   const actions = [
//     // {
//     //   label: "View",
//     //   icon: (
//     //     <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded font-medium">
//     //       <Eye className="h-3 w-3" />
//     //       View
//     //     </span>
//     //   ),
//     //   showAsIcon: true,
//     //   useDropdown: false,
//     //   onClick: (row) => {
//     //     console.log("View receipt:", row.original);
//     //   },
//     // },
//   ];

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Receipts</h1>

//       {/* Filters */}
//       {/* <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="flex flex-col">
//             <label className="text-xs text-gray-600 mb-1">From Date</label>
//             <input
//               type="date"
//               value={filters.dateFrom}
//               onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
//               className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-xs text-gray-600 mb-1">To Date</label>
//             <input
//               type="date"
//               value={filters.dateTo}
//               onChange={(e) => handleFilterChange("dateTo", e.target.value)}
//               className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-xs text-gray-600 mb-1">Payment Mode</label>
//             <select
//               value={filters.paymentMethod}
//               onChange={(e) =>
//                 handleFilterChange("paymentMethod", e.target.value)
//               }
//               className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
//             >
//               <option value="">All Modes</option>
//               <option value="cash">Cash</option>
//               <option value="neft">NEFT</option>
//               <option value="upi">UPI</option>
//               <option value="online">Online Transfer</option>
//             </select>
//           </div>
//           <div className="flex flex-col">
//             <label className="text-xs text-gray-600 mb-1">Search</label>
//             <input
//               type="text"
//               placeholder="Receipt No / Payer"
//               value={filters.search}
//               onChange={(e) => handleFilterChange("search", e.target.value)}
//               className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
//             />
//           </div>
//         </div>

//         <div className="flex gap-2 mt-4">
//           <button
//             onClick={handleReset}
//             className="px-4 py-1.5 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 text-sm"
//           >
//             Reset
//           </button>
//           <button
//             onClick={fetchReceipts}
//             disabled={loading}
//             className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium disabled:opacity-50"
//           >
//             {loading ? "Loading..." : "View"}
//           </button>
//         </div>
//       </div> */}

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//           <h3 className="text-lg font-semibold text-gray-900">
//             Receipts ({receipts.length})
//           </h3>
//           <button
//             onClick={handleExportCSV}
//             disabled={receipts.length === 0 || loading}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Download className="w-4 h-4" />
//             Export CSV
//           </button>
//         </div>

//         <Table
//           data={tableData}
//           actions={actions}
//           onRowClick={(transformedRow) => {
//             console.log("Clicked receipt:", transformedRow.original);
//           }}
//         />

//         {/* Pagination */}
//         {!loading && totalPages > 1 && (
//           <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
//             <div>
//               Showing {receipts.length} of {totalDocs} receipts
//             </div>
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => handlePageChange(page - 1)}
//                 disabled={page === 1 || loading}
//                 className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ChevronLeft className="h-5 w-5" />
//               </button>
//               <span className="font-medium">
//                 Page {page} of {totalPages}
//               </span>
//               <button
//                 onClick={() => handlePageChange(page + 1)}
//                 disabled={page === totalPages || loading}
//                 className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ChevronRight className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         )}

//         {loading && (
//           <div className="p-6 text-center text-gray-500">
//             Loading receipts...
//           </div>
//         )}

//         {!loading && receipts.length === 0 && (
//           <div className="p-12 text-center text-gray-500 italic">
//             No receipts found for this doctor.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






// src/pages/ReceiptsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Table from "../../../../components/mainComponents/Table";
import { Download, Calendar, Printer } from "lucide-react";
import apiClient, { apiEndpoints } from "../../../../services/apiClient";

export default function ReceiptsPage() {
  const { id } = useParams();
  const [allReceipts, setAllReceipts] = useState([]); // raw fetched data
  const [displayedReceipts, setDisplayedReceipts] = useState([]); // filtered view
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter form state (temporary until View is clicked)
  const [filterForm, setFilterForm] = useState({
    receiptNo: "",
    sbNo: "",
    paymentMode: "all",
    fromDate: "",
    toDate: "",
  });

  // Applied filters (updated only on View click)
  const [appliedFilters, setAppliedFilters] = useState({
    receiptNo: "",
    sbNo: "",
    paymentMode: "all",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    fetchReceipts();
  }, [id]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(apiEndpoints.receipts.list, {
        params: { doctor: id, limit: 1000 },
      });

      let receipts = response.data.data || response.data.receipts || [];

      // Extra safety filter by doctor ID
      receipts = receipts.filter((r) => {
        return (
          r.payer?.entityId?._id === id ||
          r.doctor === id ||
          r.doctorId === id ||
          r.payerId === id
        );
      });

      // Sort newest first
      receipts.sort((a, b) => {
        const dateA = new Date(a.receiptDate || a.createdAt || 0);
        const dateB = new Date(b.receiptDate || b.createdAt || 0);
        return dateB - dateA;
      });

      setAllReceipts(receipts);
      setDisplayedReceipts(receipts); // initial = all
    } catch (err) {
      console.error("Error fetching receipts:", err);
      setError("Failed to load receipts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filterForm });

    let filtered = [...allReceipts];

    if (filterForm.receiptNo.trim()) {
      const search = filterForm.receiptNo.toLowerCase().trim();
      filtered = filtered.filter((r) =>
        (r.receiptNumber || "").toLowerCase().includes(search),
      );
    }

    if (filterForm.sbNo.trim()) {
      const search = filterForm.sbNo.toLowerCase().trim();
      filtered = filtered.filter((r) =>
        (r.referenceNumber || "").toLowerCase().includes(search),
      );
    }

    if (filterForm.paymentMode !== "all") {
      filtered = filtered.filter((r) => {
        const mode = (r.paymentMethod || "").toLowerCase();
        return mode === filterForm.paymentMode.toLowerCase();
      });
    }

    if (filterForm.fromDate) {
      const from = new Date(filterForm.fromDate);
      filtered = filtered.filter((r) => {
        const rDate = new Date(r.receiptDate || r.createdAt || 0);
        return rDate >= from;
      });
    }

    if (filterForm.toDate) {
      const to = new Date(filterForm.toDate);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((r) => {
        const rDate = new Date(r.receiptDate || r.createdAt || 0);
        return rDate <= to;
      });
    }

    setDisplayedReceipts(filtered);
  };

  const handleReset = () => {
    setFilterForm({
      receiptNo: "",
      sbNo: "",
      paymentMode: "all",
      fromDate: "",
      toDate: "",
    });
    setAppliedFilters({
      receiptNo: "",
      sbNo: "",
      paymentMode: "all",
      fromDate: "",
      toDate: "",
    });
    setDisplayedReceipts([...allReceipts]);
  };

  const columns = [
    {
      header: "Receipt No",
      render: (row) => (
        <span className="font-medium text-gray-900">
          {row.receiptNumber || "N/A"}
        </span>
      ),
    },
    {
      header: "Date",
      render: (row) => (
        <span className="text-gray-700">
          {row.receiptDate || row.createdAt
            ? new Date(row.receiptDate || row.createdAt).toLocaleDateString(
                "en-IN",
              )
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Payment Mode",
      render: (row) => (
        <span className="text-gray-700 capitalize">
          {row.paymentMethod || "N/A"}
        </span>
      ),
    },
    {
      header: "Amount",
      render: (row) => (
        <span className="font-semibold text-gray-900">
          ₹{(row.amount || 0).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Reference / SB No",
      render: (row) => (
        <span className="text-gray-700">{row.referenceNumber || "N/A"}</span>
      ),
    },
  ];

  // ────────────────────────────────────────────────
  // PRINT using hidden iframe (same as other reports)
  // ────────────────────────────────────────────────
  const handlePrint = () => {
    const receiptsToPrint = displayedReceipts;

    if (receiptsToPrint.length === 0) {
      alert("No receipts available to print.");
      return;
    }

    const isFiltered =
      appliedFilters.receiptNo.trim() !== "" ||
      appliedFilters.sbNo.trim() !== "" ||
      appliedFilters.paymentMode !== "all" ||
      appliedFilters.fromDate !== "" ||
      appliedFilters.toDate !== "";

    const title = isFiltered
      ? "Receipts Report - Filtered"
      : "Receipts Report - Complete";

    const totalAmount = receiptsToPrint.reduce(
      (sum, r) => sum + (r.amount || 0),
      0
    );

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 11pt;
            color: #111;
          }
          h1 {
            text-align: center;
            margin: 0 0 12px;
            font-size: 18pt;
          }
          .subtitle {
            text-align: center;
            color: #555;
            margin-bottom: 20px;
            font-size: 13pt;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 10.5pt;
          }
          th, td {
            border: 1px solid #888;
            padding: 8px 10px;
            text-align: left;
          }
          th {
            background-color: #e0f2f1;
            color: #1a3c34;
            font-weight: bold;
            text-align: center;
          }
          .amount {
            text-align: right;
            font-weight: 500;
          }
          .totals {
            margin-top: 24px;
            padding: 14px;
            background: #f9fafb;
            border: 1px solid #cbd5e0;
            border-radius: 6px;
            font-weight: bold;
            text-align: center;
            font-size: 11.5pt;
          }
          @media print {
            body { padding: 12mm; margin: 0; }
          }
        </style>
      </head>
      <body>
        <h1>Receipts Report</h1>
        <div class="subtitle">
          ${isFiltered ? "Filtered View" : "All Receipts"} • 
          ${new Date().toLocaleDateString("en-IN")}
        </div>

        <table>
          <thead>
            <tr>
              <th>Receipt No</th>
              <th>Date</th>
              <th>Payment Mode</th>
              <th class="amount">Amount (₹)</th>
              <th>Reference / SB No</th>
            </tr>
          </thead>
          <tbody>
            ${receiptsToPrint
              .map((r) => {
                const dateStr = r.receiptDate || r.createdAt
                  ? new Date(r.receiptDate || r.createdAt).toLocaleDateString("en-IN")
                  : "N/A";

                return `
                  <tr>
                    <td>${r.receiptNumber || "N/A"}</td>
                    <td>${dateStr}</td>
                    <td>${r.paymentMethod || "N/A"}</td>
                    <td class="amount">₹${(r.amount || 0).toLocaleString("en-IN")}</td>
                    <td>${r.referenceNumber || "N/A"}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          Total Receipts: ${receiptsToPrint.length}  
              |    
          Total Amount Received: ₹${totalAmount.toLocaleString("en-IN")}
        </div>
      </body>
      </html>
    `;

    // Hidden iframe method
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "absolute";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.left = "-9999px";
    printFrame.style.top = "-9999px";
    document.body.appendChild(printFrame);

    const doc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printContent);
      doc.close();

      setTimeout(() => {
        const win = printFrame.contentWindow;
        if (win) {
          win.focus();
          win.print();

          setTimeout(() => {
            if (document.body.contains(printFrame)) {
              document.body.removeChild(printFrame);
            }
          }, 1500);
        }
      }, 700);
    } else {
      console.error("Could not access print iframe document");
      if (document.body.contains(printFrame)) {
        document.body.removeChild(printFrame);
      }
      alert("Print preparation failed. Please try again.");
    }
  };

  const handleExportCSV = () => {
    if (!displayedReceipts.length) return;

    const csv = [
      ["Receipt No", "Date", "Payment Mode", "Amount", "Reference / SB No"],
      ...displayedReceipts.map((r) => [
        r.receiptNumber || "N/A",
        r.receiptDate || r.createdAt
          ? new Date(r.receiptDate || r.createdAt).toLocaleDateString("en-IN")
          : "N/A",
        r.paymentMethod || "N/A",
        r.amount || 0,
        r.referenceNumber || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `receipts-doctor-${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-red-600 py-12">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Filters Section */}
      <div className="p-4 border-b bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search by Receipt No */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Search by Receipt No
            </label>
            <input
              type="text"
              value={filterForm.receiptNo}
              onChange={(e) =>
                setFilterForm({ ...filterForm, receiptNo: e.target.value })
              }
              placeholder="Enter Receipt No..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Search by SB No */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Search by SB No
            </label>
            <input
              type="text"
              value={filterForm.sbNo}
              onChange={(e) =>
                setFilterForm({ ...filterForm, sbNo: e.target.value })
              }
              placeholder="Enter SB No (e.g. RML-10000)"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Payment Mode
            </label>
            <select
              value={filterForm.paymentMode}
              onChange={(e) =>
                setFilterForm({ ...filterForm, paymentMode: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
              <option value="upi">UPI</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              From Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={filterForm.fromDate}
                onChange={(e) =>
                  setFilterForm({ ...filterForm, fromDate: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* To Date */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">To Date</label>
            <div className="relative">
              <input
                type="date"
                value={filterForm.toDate}
                onChange={(e) =>
                  setFilterForm({ ...filterForm, toDate: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-6 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800"
          >
            View
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Receipts ({displayedReceipts.length})
        </h3>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            disabled={displayedReceipts.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>

          <button
            onClick={handleExportCSV}
            disabled={displayedReceipts.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-6">
        {displayedReceipts.length > 0 ? (
          <Table
            data={displayedReceipts}
            columns={columns}
            pagination={true}
            defaultPageSize={10}
            excludeColumns={[
              "_id",
              "__v",
              "createdAt",
              "updatedAt",
              "payer",
              "doctor",
              "status",
              "transactionRef",
              "notes",
              "currency",
            ]}
          />
        ) : (
          <div className="text-center py-12 text-gray-500 italic">
            No receipts found matching the filters.
          </div>
        )}
      </div>
    </div>
  );
}






// // src/pages/ReceiptsPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Table from "../../../../components/mainComponents/Table";
// import { Download, Calendar, Printer } from "lucide-react";  // ← added Printer
// import apiClient, { apiEndpoints } from "../../../../services/apiClient";

// export default function ReceiptsPage() {
//   const { id } = useParams();
//   const [allReceipts, setAllReceipts] = useState([]); // raw fetched data
//   const [displayedReceipts, setDisplayedReceipts] = useState([]); // filtered view
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Filter form state (temporary until View is clicked)
//   const [filterForm, setFilterForm] = useState({
//     receiptNo: "",
//     sbNo: "",
//     paymentMode: "all",
//     fromDate: "",
//     toDate: "",
//   });

//   // Applied filters (updated only on View click)
//   const [appliedFilters, setAppliedFilters] = useState({
//     receiptNo: "",
//     sbNo: "",
//     paymentMode: "all",
//     fromDate: "",
//     toDate: "",
//   });

//   useEffect(() => {
//     fetchReceipts();
//   }, [id]);

//   const fetchReceipts = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch receipts for this doctor
//       const response = await apiClient.get(apiEndpoints.receipts.list, {
//         params: { doctor: id, limit: 1000 },
//       });

//       let receipts = response.data.data || response.data.receipts || [];

//       // Extra safety filter by doctor ID
//       receipts = receipts.filter((r) => {
//         return (
//           r.payer?.entityId?._id === id ||
//           r.doctor === id ||
//           r.doctorId === id ||
//           r.payerId === id
//         );
//       });

//       // Sort newest first
//       receipts.sort((a, b) => {
//         const dateA = new Date(a.receiptDate || a.createdAt || 0);
//         const dateB = new Date(b.receiptDate || b.createdAt || 0);
//         return dateB - dateA;
//       });

//       setAllReceipts(receipts);
//       setDisplayedReceipts(receipts); // initial = all
//     } catch (err) {
//       console.error("Error fetching receipts:", err);
//       setError("Failed to load receipts. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApplyFilters = () => {
//     setAppliedFilters({ ...filterForm });

//     let filtered = [...allReceipts];

//     // 1. Search by Receipt No
//     if (filterForm.receiptNo.trim()) {
//       const search = filterForm.receiptNo.toLowerCase().trim();
//       filtered = filtered.filter((r) =>
//         (r.receiptNumber || "").toLowerCase().includes(search),
//       );
//     }

//     // 2. Search by SB No — now using referenceNumber
//     if (filterForm.sbNo.trim()) {
//       const search = filterForm.sbNo.toLowerCase().trim();
//       filtered = filtered.filter((r) =>
//         (r.referenceNumber || "").toLowerCase().includes(search),
//       );
//     }

//     // 3. Payment Mode
//     if (filterForm.paymentMode !== "all") {
//       filtered = filtered.filter((r) => {
//         const mode = (r.paymentMethod || "").toLowerCase();
//         return mode === filterForm.paymentMode.toLowerCase();
//       });
//     }

//     // 4. Date range
//     if (filterForm.fromDate) {
//       const from = new Date(filterForm.fromDate);
//       filtered = filtered.filter((r) => {
//         const rDate = new Date(r.receiptDate || r.createdAt || 0);
//         return rDate >= from;
//       });
//     }

//     if (filterForm.toDate) {
//       const to = new Date(filterForm.toDate);
//       to.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((r) => {
//         const rDate = new Date(r.receiptDate || r.createdAt || 0);
//         return rDate <= to;
//       });
//     }

//     setDisplayedReceipts(filtered);
//   };

//   const handleReset = () => {
//     setFilterForm({
//       receiptNo: "",
//       sbNo: "",
//       paymentMode: "all",
//       fromDate: "",
//       toDate: "",
//     });
//     setAppliedFilters({
//       receiptNo: "",
//       sbNo: "",
//       paymentMode: "all",
//       fromDate: "",
//       toDate: "",
//     });
//     setDisplayedReceipts([...allReceipts]);
//   };

//   const columns = [
//     {
//       header: "Receipt No",
//       render: (row) => (
//         <span className="font-medium text-gray-900">
//           {row.receiptNumber || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Date",
//       render: (row) => (
//         <span className="text-gray-700">
//           {row.receiptDate || row.createdAt
//             ? new Date(row.receiptDate || row.createdAt).toLocaleDateString(
//                 "en-IN",
//               )
//             : "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Payment Mode",
//       render: (row) => (
//         <span className="text-gray-700 capitalize">
//           {row.paymentMethod || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Amount",
//       render: (row) => (
//         <span className="font-semibold text-gray-900">
//           ₹{(row.amount || 0).toLocaleString("en-IN")}
//         </span>
//       ),
//     },
//     {
//       header: "Reference / SB No",
//       render: (row) => (
//         <span className="text-gray-700">{row.referenceNumber || "N/A"}</span>
//       ),
//     },
//   ];

//   // ────────────────────────────────────────────────
//   //          PRINT REPORT (filtered if filters applied, otherwise all)
//   // ────────────────────────────────────────────────
//   const handlePrint = () => {
//     const receiptsToPrint = displayedReceipts;

//     if (receiptsToPrint.length === 0) {
//       alert("No receipts available to print.");
//       return;
//     }

//     const printWindow = window.open("", "", "width=1100,height=800");

//     const totalAmount = receiptsToPrint.reduce((sum, r) => sum + (r.amount || 0), 0);

//     // Optional: nicer title depending on whether filters are active
//     const isFiltered = appliedFilters.receiptNo.trim() !== "" ||
//                        appliedFilters.sbNo.trim() !== "" ||
//                        appliedFilters.paymentMode !== "all" ||
//                        appliedFilters.fromDate !== "" ||
//                        appliedFilters.toDate !== "";

//     const title = isFiltered ? "Receipts Report - Filtered" : "Receipts Report - Complete";

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>${title}</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 20px; font-size: 11pt; }
//           h1 { text-align: center; margin-bottom: 16px; font-size: 18pt; }
//           table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
//           th, td { border: 1px solid #444; padding: 8px 10px; text-align: left; }
//           th { background-color: #006d77; color: white; font-weight: bold; }
//           .amount { text-align: right; }
//           .center { text-align: center; }
//           .totals { margin-top: 24px; padding: 12px; background: #f8f8f8; border: 1px solid #ccc; font-weight: bold; }
//         </style>
//       </head>
//       <body>
//         <h1>${title}</h1>
//         <table>
//           <thead>
//             <tr>
//               <th>Receipt No</th>
//               <th>Date</th>
//               <th>Payment Mode</th>
//               <th class="amount">Amount</th>
//               <th>Reference / SB No</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${receiptsToPrint
//               .map((r) => {
//                 const dateStr = r.receiptDate || r.createdAt
//                   ? new Date(r.receiptDate || r.createdAt).toLocaleDateString("en-IN")
//                   : "N/A";

//                 return `
//                   <tr>
//                     <td>${r.receiptNumber || "N/A"}</td>
//                     <td>${dateStr}</td>
//                     <td class="center">${r.paymentMethod || "N/A"}</td>
//                     <td class="amount">₹${(r.amount || 0).toLocaleString("en-IN")}</td>
//                     <td>${r.referenceNumber || "N/A"}</td>
//                   </tr>
//                 `;
//               })
//               .join("")}
//           </tbody>
//         </table>

//         <div class="totals">
//           Total Receipts: ${receiptsToPrint.length}  
//             |  Total Amount Received: ₹${totalAmount.toLocaleString("en-IN")}
//         </div>
//       </body>
//       </html>
//     `;

//     printWindow.document.write(printContent);
//     printWindow.document.close();

//     printWindow.onload = () => {
//       printWindow.focus();
//       printWindow.print();
//     };
//   };

//   const handleExportCSV = () => {
//     if (!displayedReceipts.length) return;

//     const csv = [
//       ["Receipt No", "Date", "Payment Mode", "Amount", "Reference / SB No"],
//       ...displayedReceipts.map((r) => [
//         r.receiptNumber || "N/A",
//         r.receiptDate || r.createdAt
//           ? new Date(r.receiptDate || r.createdAt).toLocaleDateString("en-IN")
//           : "N/A",
//         r.paymentMethod || "N/A",
//         r.amount || 0,
//         r.referenceNumber || "N/A",
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `receipts-doctor-${id}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//           <div className="h-64 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm p-6 text-center text-red-600 py-12">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm">
//       {/* Filters Section */}
//       <div className="p-4 border-b bg-gray-50">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//           {/* Search by Receipt No */}
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Search by Receipt No
//             </label>
//             <input
//               type="text"
//               value={filterForm.receiptNo}
//               onChange={(e) =>
//                 setFilterForm({ ...filterForm, receiptNo: e.target.value })
//               }
//               placeholder="Enter Receipt No..."
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
//             />
//           </div>

//           {/* Search by SB No */}
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Search by SB No
//             </label>
//             <input
//               type="text"
//               value={filterForm.sbNo}
//               onChange={(e) =>
//                 setFilterForm({ ...filterForm, sbNo: e.target.value })
//               }
//               placeholder="Enter SB No (e.g. RML-10000)"
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
//             />
//           </div>

//           {/* Payment Mode */}
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Payment Mode
//             </label>
//             <select
//               value={filterForm.paymentMode}
//               onChange={(e) =>
//                 setFilterForm({ ...filterForm, paymentMode: e.target.value })
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
//             >
//               <option value="all">All</option>
//               <option value="cash">Cash</option>
//               <option value="card">Card</option>
//               <option value="bank transfer">Bank Transfer</option>
//               <option value="cheque">Cheque</option>
//               <option value="upi">UPI</option>
//               <option value="other">Other</option>
//             </select>
//           </div>

//           {/* From Date */}
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               From Date
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 value={filterForm.fromDate}
//                 onChange={(e) =>
//                   setFilterForm({ ...filterForm, fromDate: e.target.value })
//                 }
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm "
//               />
//               {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" /> */}
//             </div>
//           </div>

//           {/* To Date */}
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">To Date</label>
//             <div className="relative">
//               <input
//                 type="date"
//                 value={filterForm.toDate}
//                 onChange={(e) =>
//                   setFilterForm({ ...filterForm, toDate: e.target.value })
//                 }
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//               />
//               {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" /> */}
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 mt-4">
//           <button
//             onClick={handleReset}
//             className="px-6 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100"
//           >
//             Reset
//           </button>
//           <button
//             onClick={handleApplyFilters}
//             className="px-6 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800"
//           >
//             View
//           </button>
//         </div>
//       </div>

//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//         <h3 className="text-lg font-semibold text-gray-900">
//           Receipts ({displayedReceipts.length})
//         </h3>

//         <div className="flex gap-3">
//           <button
//             onClick={handlePrint}
//             disabled={allReceipts.length === 0}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Printer className="h-4 w-4" />
//             Print Report
//           </button>

//           <button
//             onClick={handleExportCSV}
//             disabled={displayedReceipts.length === 0}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
//           >
//             <Download className="h-4 w-4" />
//             Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto p-6">
//         {displayedReceipts.length > 0 ? (
//           <Table
//             data={displayedReceipts}
//             columns={columns}
//             pagination={true}
//             defaultPageSize={10}
//             excludeColumns={[
//               "_id",
//               "__v",
//               "createdAt",
//               "updatedAt",
//               "payer",
//               "doctor",
//               "status",
//               "transactionRef",
//               "notes",
//               "currency",
//             ]}
//           />
//         ) : (
//           <div className="text-center py-12 text-gray-500 italic">
//             No receipts found matching the filters.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




