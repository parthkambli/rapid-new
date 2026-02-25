// // src/pages/ExpenseReportPage.jsx
// import React, { useEffect, useState } from "react";
// import Table from "../../../components/mainComponents/Table";
// import { Printer, Download } from "lucide-react";

// // ────────────────────────────────────────────────
// // Column Definitions
// // ────────────────────────────────────────────────
// const columns = [
//   { header: "SR No", accessor: "srNo" },
//   {
//     header: "Date",
//     accessor: "date",
//     render: (v) => (v ? new Date(v).toLocaleDateString("en-GB") : "-"),
//   },
//   {
//     header: "Category",
//     accessor: "categoryDisplay",
//   },
//   { header: "Description", accessor: "description" },
//   { header: "Vendor", accessor: "vendor" },
//   { header: "Paid By", accessor: "paidBy" },
//   {
//     header: "Amount",
//     accessor: "amount",
//     render: (v) => (v ? `₹${Number(v).toLocaleString("en-IN")}` : "-"),
//   },
//   { header: "Mode", accessor: "mode" },
//   { header: "Receipt No", accessor: "receiptNo" },
//   {
//     header: "Status",
//     accessor: "status",
//     render: (value) => {
//       // Safeguard: make sure we have a string
//       const status = String(value || "draft")
//         .trim()
//         .toLowerCase();

//       let colorClass = "text-yellow-700 bg-yellow-50";
//       if (status === "approved") colorClass = "text-green-700 bg-green-50";
//       if (status === "paid") colorClass = "text-blue-700 bg-blue-50";
//       if (status === "rejected") colorClass = "text-red-700 bg-red-50";

//       // Capitalize first letter safely
//       const displayText = status
//         ? status.charAt(0).toUpperCase() + status.slice(1)
//         : "Draft";

//       return (
//         <span
//           className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${colorClass}`}
//         >
//           {displayText}
//         </span>
//       );
//     },
//   },
// ];

// const extraColumns = [
//   {
//     header: "Action",
//     render: () => (
//       <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
//         View
//       </button>
//     ),
//   },
// ];

// // ────────────────────────────────────────────────
// // Helper
// // ────────────────────────────────────────────────
// function formatPaymentMethod(method, chequeNo) {
//   if (!method) return "-";
//   const m = String(method).toLowerCase();
//   if (m === "cash") return "Cash";
//   if (m === "bank_transfer") return "Bank Transfer";
//   if (m === "cheque" || chequeNo)
//     return `Cheque${chequeNo ? ` #${chequeNo}` : ""}`;
//   return String(method).charAt(0).toUpperCase() + String(method).slice(1);
// }

// export default function ExpenseReportPage() {
//   const [tableData, setTableData] = useState([]);
//   const [totals, setTotals] = useState({
//     totalExpenses: 0,
//     totalAmount: 0,
//     paidByCash: 0,
//     paidByBank: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [filters, setFilters] = useState({
//     fromDate: "",
//     toDate: "",
//     category: "",
//     paidBy: "",
//     minAmount: "",
//     search: "",
//   });

//   const fetchExpenses = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const API_BASE = (
//         import.meta.env.VITE_API_URI || "http://localhost:5000"
//       ).trim();
//       const url = `${API_BASE}/expenses`;

//       console.log("Fetching from:", url);

//       const token = localStorage.getItem("token") || "";

//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//       });

//       if (!res.ok) {
//         let errorText = "";
//         try {
//           errorText = await res.text();
//         } catch {}
//         if (res.status === 401) {
//           throw new Error("401 Unauthorized – please log in or check token");
//         }
//         throw new Error(
//           `HTTP ${res.status}${errorText ? ` - ${errorText.substring(0, 140)}` : ""}`,
//         );
//       }

//       const json = await res.json();

//       if (!json?.success || !Array.isArray(json.data)) {
//         throw new Error("Invalid API response format");
//       }

//       // Transform
//       const transformed = json.data.map((exp, index) => ({
//         srNo: index + 1,
//         date: exp.expenseDate,
//         categoryDisplay: exp.subCategory
//           ? `${exp.category} • ${exp.subCategory}`
//           : exp.category || "-",
//         vendor: exp.vendor?.name || "-",
//         description: exp.description || exp.title || "-",
//         paidBy: exp.bankName || "Self",
//         mode: formatPaymentMethod(exp.paymentMethod, exp.chequeNumber),
//         receiptNo: exp.voucherNo || exp.chequeNumber || "-",
//         amount: Number(exp.amount) || 0,
//         status: exp.status,
//       }));

//       // Client-side filter
//       let filtered = transformed;

//       if (filters.fromDate) {
//         filtered = filtered.filter(
//           (item) => new Date(item.date) >= new Date(filters.fromDate),
//         );
//       }
//       if (filters.toDate) {
//         filtered = filtered.filter(
//           (item) => new Date(item.date) <= new Date(filters.toDate),
//         );
//       }
//       if (filters.category) {
//         filtered = filtered.filter((item) =>
//           item.categoryDisplay
//             .toLowerCase()
//             .includes(filters.category.toLowerCase()),
//         );
//       }
//       if (filters.paidBy) {
//         filtered = filtered.filter((item) =>
//           item.mode.toLowerCase().includes(filters.paidBy.toLowerCase()),
//         );
//       }
//       if (filters.minAmount) {
//         const min = Number(filters.minAmount);
//         if (!isNaN(min))
//           filtered = filtered.filter((item) => item.amount >= min);
//       }
//       if (filters.search) {
//         const term = filters.search.toLowerCase();
//         filtered = filtered.filter(
//           (item) =>
//             (item.description || "").toLowerCase().includes(term) ||
//             (item.vendor || "").toLowerCase().includes(term) ||
//             (item.receiptNo || "").toLowerCase().includes(term),
//         );
//       }

//       setTableData(filtered);

//       setTotals({
//         totalExpenses: filtered.length,
//         totalAmount: filtered.reduce((sum, r) => sum + r.amount, 0),
//         paidByCash: filtered
//           .filter((r) => r.mode?.toLowerCase().includes("cash"))
//           .reduce((sum, r) => sum + r.amount, 0),
//         paidByBank: filtered
//           .filter((r) => !r.mode?.toLowerCase().includes("cash"))
//           .reduce((sum, r) => sum + r.amount, 0),
//       });
//     } catch (err) {
//       console.error("Expenses fetch failed:", err);
//       setError(err.message || "Failed to load expenses. Check console.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const resetFilters = () => {
//     setFilters({
//       fromDate: "",
//       toDate: "",
//       category: "",
//       paidBy: "",
//       minAmount: "",
//       search: "",
//     });
//   };

//   const exportCSV = () => {
//     if (!tableData.length) return;

//     const headers = [
//       "SR No",
//       "Date",
//       "Category",
//       "Description",
//       "Vendor",
//       "Paid By",
//       "Amount",
//       "Mode",
//       "Receipt No",
//       "Status",
//     ];

//     const rows = tableData.map((row) =>
//       [
//         row.srNo,
//         row.date ? new Date(row.date).toLocaleDateString("en-GB") : "",
//         `"${(row.categoryDisplay || "").replace(/"/g, '""')}"`,
//         `"${(row.description || "").replace(/"/g, '""')}"`,
//         `"${row.vendor || ""}"`,
//         `"${row.paidBy || ""}"`,
//         row.amount,
//         `"${row.mode || ""}"`,
//         `"${row.receiptNo || ""}"`,
//         row.status || "Draft",
//       ].join(","),
//     );

//     const csv = [headers.join(","), ...rows].join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `expense-report-${new Date().toISOString().slice(0, 10)}.csv`;
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-full mx-auto">
//         <h1 className="text-2xl font-bold text-gray-900 mb-1">
//           Expense Report
//         </h1>
//         <p className="text-sm text-gray-600 mb-6">
//           View, filter and export expense transactions
//         </p>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1.5">
//                 From Date
//               </label>
//               <input
//                 type="date"
//                 value={filters.fromDate}
//                 onChange={(e) =>
//                   setFilters({ ...filters, fromDate: e.target.value })
//                 }
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             <div>
//               <label className="block text-xs text-gray-600 mb-1.5">
//                 To Date
//               </label>
//               <input
//                 type="date"
//                 value={filters.toDate}
//                 onChange={(e) =>
//                   setFilters({ ...filters, toDate: e.target.value })
//                 }
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             <div>
//               <label className="block text-xs text-gray-600 mb-1.5">
//                 Category
//               </label>
//               <select
//                 value={filters.category}
//                 onChange={(e) =>
//                   setFilters({ ...filters, category: e.target.value })
//                 }
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
//               >
//                 <option value="">All Categories</option>
//                 <option value="professional_fees">Professional Fees</option>
//                 <option value="office_supplies">Office Supplies</option>
//                 <option value="utilities">Utilities</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs text-gray-600 mb-1.5">
//                 Payment Mode
//               </label>
//               <select
//                 value={filters.paidBy}
//                 onChange={(e) =>
//                   setFilters({ ...filters, paidBy: e.target.value })
//                 }
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
//               >
//                 <option value="">All Modes</option>
//                 <option value="cash">Cash</option>
//                 <option value="bank">Bank / Transfer</option>
//                 <option value="cheque">Cheque</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs text-gray-600 mb-1.5">
//                 Min Amount (₹)
//               </label>
//               <input
//                 type="number"
//                 value={filters.minAmount}
//                 onChange={(e) =>
//                   setFilters({ ...filters, minAmount: e.target.value })
//                 }
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1">
//               <label className="block text-xs text-gray-600 mb-1.5">
//                 Search
//               </label>
//               <input
//                 type="text"
//                 placeholder="Search vendor, description, receipt..."
//                 value={filters.search}
//                 onChange={(e) =>
//                   setFilters({ ...filters, search: e.target.value })
//                 }
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             <div className="flex items-end gap-3 pt-5 sm:pt-0">
//               <button
//                 onClick={resetFilters}
//                 className="px-5 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition"
//               >
//                 Reset
//               </button>
//               <button
//                 onClick={fetchExpenses}
//                 className="px-6 py-2 bg-teal-700 text-white rounded-md text-sm hover:bg-teal-800 transition"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
//             {error}
//           </div>
//         )}

//         {/* Summary */}
//         <div className="bg-white rounded-lg shadow-sm p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           <div>
//             <p className="text-sm text-gray-600">Total Expenses</p>
//             <p className="text-2xl font-bold">{totals.totalExpenses}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Total Amount</p>
//             <p className="text-2xl font-bold">
//               ₹{totals.totalAmount.toLocaleString("en-IN")}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Paid by Cash</p>
//             <p className="text-2xl font-bold">
//               ₹{totals.paidByCash.toLocaleString("en-IN")}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Paid by Bank/Other</p>
//             <p className="text-2xl font-bold">
//               ₹{totals.paidByBank.toLocaleString("en-IN")}
//             </p>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b flex justify-end gap-3">
//             <button
//               onClick={() => window.print()}
//               disabled={loading || !tableData.length}
//               className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 transition"
//             >
//               <Printer size={16} /> Print
//             </button>
//             <button
//               onClick={exportCSV}
//               disabled={loading || !tableData.length}
//               className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50 transition"
//             >
//               <Download size={16} /> Export CSV
//             </button>
//           </div>

//           <div className="p-6">
//             <Table
//               data={tableData}
//               columns={columns}
//               extraColumns={extraColumns}
//               loading={loading}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









// src/pages/ExpenseReportPage.jsx
import React, { useEffect, useState } from "react";
import Table from "../../../components/mainComponents/Table";
import { Printer, Download } from "lucide-react";

// Helper
function formatPaymentMethod(method, chequeNo) {
  if (!method) return "-";
  const m = String(method).toLowerCase();
  if (m === "cash") return "Cash";
  if (m === "bank_transfer") return "Bank Transfer";
  if (m === "cheque" || chequeNo)
    return `Cheque${chequeNo ? ` #${chequeNo}` : ""}`;
  return String(method).charAt(0).toUpperCase() + String(method).slice(1);
}

export default function ExpenseReportPage() {
  const [rawData, setRawData] = useState([]); // full unfiltered transformed data
  const [filteredData, setFilteredData] = useState([]); // filtered → shown in Table

  const [totals, setTotals] = useState({
    totalExpenses: 0,
    totalAmount: 0,
    paidByCash: 0,
    paidByBank: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    category: "",
    paidBy: "",
    minAmount: "",
    search: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: "",
    toDate: "",
    category: "",
    paidBy: "",
    minAmount: "",
    search: "",
  });

  // Fetch all expenses once
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_BASE = (
        import.meta.env.VITE_API_URI || "http://localhost:5000"
      ).trim();
      const url = `${API_BASE}/expenses`;

      const token = localStorage.getItem("token") || "";

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        if (res.status === 401)
          throw new Error("401 Unauthorized – please log in");
        const text = await res.text().catch(() => "");
        throw new Error(
          `HTTP ${res.status}${text ? ` - ${text.substring(0, 140)}` : ""}`,
        );
      }

      const json = await res.json();

      if (!json?.success || !Array.isArray(json.data)) {
        throw new Error("Invalid API response format");
      }

      const raw = json.data;

      const transformed = raw.map((exp) => ({
        date: exp.expenseDate
          ? new Date(exp.expenseDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "-",
        rawDate: exp.expenseDate || null,
        categoryDisplay: exp.subCategory
          ? `${exp.category} • ${exp.subCategory}`
          : exp.category || "-",
        description: exp.description || exp.title || "-",
        vendor: exp.vendor?.name || "-",
        paidBy: exp.bankName || "Self",
        amount: Number(exp.amount) || 0,
        mode: formatPaymentMethod(exp.paymentMethod, exp.chequeNumber),
        receiptNo: exp.voucherNo || exp.chequeNumber || "-",
        // status: exp.status || "draft",
        original: exp,
      }));

      setRawData(transformed);
      setFilteredData(transformed);
      updateTotals(transformed);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load expenses");
      setRawData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (!rawData.length) return;

    let result = [...rawData];

    const f = appliedFilters;

    if (f.fromDate || f.toDate) {
      const from = f.fromDate ? new Date(f.fromDate) : null;
      const to = f.toDate ? new Date(f.toDate) : null;
      if (to) to.setHours(23, 59, 59, 999);

      result = result.filter((exp) => {
        if (!exp.rawDate) return false;
        const d = new Date(exp.rawDate);
        return (!from || d >= from) && (!to || d <= to);
      });
    }

    if (f.category) {
      const term = f.category.toLowerCase();
      result = result.filter((exp) =>
        exp.categoryDisplay.toLowerCase().includes(term),
      );
    }

    if (f.paidBy) {
      const term = f.paidBy.toLowerCase();
      result = result.filter((exp) => exp.mode.toLowerCase().includes(term));
    }

    if (f.minAmount) {
      const min = Number(f.minAmount);
      if (!isNaN(min)) result = result.filter((exp) => exp.amount >= min);
    }

    if (f.search) {
      const term = f.search.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.description.toLowerCase().includes(term) ||
          exp.vendor.toLowerCase().includes(term) ||
          exp.receiptNo.toLowerCase().includes(term),
      );
    }

    setFilteredData(result);
    updateTotals(result);
  }, [rawData, appliedFilters]);

  const updateTotals = (data) => {
    setTotals({
      totalExpenses: data.length,
      totalAmount: data.reduce((sum, r) => sum + r.amount, 0),
      paidByCash: data
        .filter((r) => r.mode?.toLowerCase().includes("cash"))
        .reduce((sum, r) => sum + r.amount, 0),
      paidByBank: data
        .filter((r) => !r.mode?.toLowerCase().includes("cash"))
        .reduce((sum, r) => sum + r.amount, 0),
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleReset = () => {
    const empty = {
      fromDate: "",
      toDate: "",
      category: "",
      paidBy: "",
      minAmount: "",
      search: "",
    };
    setFilters(empty);
    setAppliedFilters(empty);
  };

  // ────────────────────────────────────────────────
  //  PRINT using hidden iframe (same behavior as AccountStatement)
  // ────────────────────────────────────────────────
  const handlePrint = () => {
    const dataToPrint = filteredData;

    if (dataToPrint.length === 0) {
      alert("No expenses available to print.");
      return;
    }

    const isFiltered =
      appliedFilters.fromDate !== "" ||
      appliedFilters.toDate !== "" ||
      appliedFilters.category !== "" ||
      appliedFilters.paidBy !== "" ||
      appliedFilters.minAmount !== "" ||
      appliedFilters.search !== "";

    const title = isFiltered
      ? "Expense Report - Filtered"
      : "Expense Report - Complete";

    const printTotals = {
      total: dataToPrint.length,
      amount: dataToPrint.reduce((s, r) => s + r.amount, 0),
      paidByCash: dataToPrint
        .filter((r) => r.mode?.toLowerCase().includes("cash"))
        .reduce((s, r) => s + r.amount, 0),
      paidByBank: dataToPrint
        .filter((r) => !r.mode?.toLowerCase().includes("cash"))
        .reduce((s, r) => s + r.amount, 0),
    };

    // Build clean print-friendly HTML
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            padding: 20px;
            font-size: 11pt;
            margin: 0;
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
            margin-bottom: 24px;
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
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Expense Report</h1>
        <div class="subtitle">
          ${isFiltered ? "Filtered View" : "All Expenses"}<br/>
          ${new Date().toLocaleDateString("en-IN")}
        </div>

        <table>
          <thead>
            <tr>
              <th>SR</th>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Vendor</th>
              <th>Paid By</th>
              <th class="amount">Amount (₹)</th>
              <th>Mode</th>
              <th>Receipt No</th>
            </tr>
          </thead>
          <tbody>
            ${dataToPrint
              .map(
                (exp, i) => `
              <tr>
                <td style="text-align:center;">${i + 1}</td>
                <td>${exp.date}</td>
                <td>${exp.categoryDisplay}</td>
                <td>${exp.description}</td>
                <td>${exp.vendor}</td>
                <td>${exp.paidBy}</td>
                <td class="amount">${exp.amount.toLocaleString("en-IN")}</td>
                <td>${exp.mode}</td>
                <td>${exp.receiptNo}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          Total Expenses: ${printTotals.total}  
              |    
          Total Amount: ₹${printTotals.amount.toLocaleString("en-IN")}  
              |    
          Cash: ₹${printTotals.paidByCash.toLocaleString("en-IN")}  
              |    
          Bank/Other: ₹${printTotals.paidByBank.toLocaleString("en-IN")}
        </div>
      </body>
      </html>
    `;

    // Hidden iframe method – same as AccountStatementPage
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

      // Give it a moment to render styles
      setTimeout(() => {
        const win = printFrame.contentWindow;
        if (win) {
          win.focus();
          win.print();

          // Cleanup
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

  // ────────────────────────────────────────────────
  // EXPORT CSV (unchanged)
  // ────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = [
      "SR No",
      "Date",
      "Category",
      "Description",
      "Vendor",
      "Paid By",
      "Amount",
      "Mode",
      "Receipt No",
    ];

    const csvRows = filteredData.map((exp, i) =>
      [
        i + 1,
        `"${exp.date.replace(/"/g, '""')}"`,
        `"${exp.categoryDisplay.replace(/"/g, '""')}"`,
        `"${exp.description.replace(/"/g, '""')}"`,
        `"${exp.vendor.replace(/"/g, '""')}"`,
        `"${exp.paidBy.replace(/"/g, '""')}"`,
        exp.amount,
        `"${exp.mode.replace(/"/g, '""')}"`,
        `"${exp.receiptNo.replace(/"/g, '""')}"`,
      ].join(","),
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `expense-report-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Expense Report
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          View, filter and export expense transactions
        </p>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Professional Fees, Travel, Rent"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5">
                Payment Mode
              </label>
              <select
                value={filters.paidBy}
                onChange={(e) => handleFilterChange("paidBy", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Modes</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank / Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5">
                Min Amount (₹)
              </label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) =>
                  handleFilterChange("minAmount", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1.5">
                Search
              </label>
              <input
                type="text"
                placeholder="Search vendor, description, receipt..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-end gap-3 pt-5 sm:pt-0">
              <button
                onClick={handleReset}
                className="px-5 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                disabled={loading}
                className="px-6 py-2 bg-teal-700 text-white rounded-md text-sm hover:bg-teal-800 transition disabled:opacity-60"
              >
                {loading ? "Loading..." : "Apply Filters"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold">{totals.totalExpenses}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold">
              ₹{totals.totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Paid by Cash</p>
            <p className="text-2xl font-bold">
              ₹{totals.paidByCash.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Paid by Bank/Other</p>
            <p className="text-2xl font-bold">
              ₹{totals.paidByBank.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Print & Export Buttons */}
        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
            disabled={loading || rawData.length === 0}
          >
            <Printer size={16} />
            Print Report
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700"
            disabled={loading || filteredData.length === 0}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading expenses...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center text-gray-500 italic">
              No expenses match the selected filters
            </div>
          ) : (
            <Table
              data={filteredData}
              pagination={true}
              defaultPageSize={10}
              showSrNo={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}






















// // src/pages/ExpenseReportPage.jsx
// import React, { useEffect, useState } from "react";
// import Table from "../../../components/mainComponents/Table";
// import { Printer, Download } from "lucide-react";

// // Helper
// function formatPaymentMethod(method, chequeNo) {
//   if (!method) return "-";
//   const m = String(method).toLowerCase();
//   if (m === "cash") return "Cash";
//   if (m === "bank_transfer") return "Bank Transfer";
//   if (m === "cheque" || chequeNo)
//     return `Cheque${chequeNo ? ` #${chequeNo}` : ""}`;
//   return String(method).charAt(0).toUpperCase() + String(method).slice(1);
// }

// export default function ExpenseReportPage() {
//   const [rawData, setRawData] = useState([]); // full unfiltered transformed data
//   const [filteredData, setFilteredData] = useState([]); // filtered → shown in Table

//   const [totals, setTotals] = useState({
//     totalExpenses: 0,
//     totalAmount: 0,
//     paidByCash: 0,
//     paidByBank: 0,
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [filters, setFilters] = useState({
//     fromDate: "",
//     toDate: "",
//     category: "",
//     paidBy: "",
//     minAmount: "",
//     search: "",
//   });

//   const [appliedFilters, setAppliedFilters] = useState({
//     fromDate: "",
//     toDate: "",
//     category: "",
//     paidBy: "",
//     minAmount: "",
//     search: "",
//   });

//   // Fetch all expenses once
//   const fetchExpenses = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const API_BASE = (
//         import.meta.env.VITE_API_URI || "http://localhost:5000"
//       ).trim();
//       const url = `${API_BASE}/expenses`;

//       const token = localStorage.getItem("token") || "";

//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//       });

//       if (!res.ok) {
//         if (res.status === 401)
//           throw new Error("401 Unauthorized – please log in");
//         const text = await res.text().catch(() => "");
//         throw new Error(
//           `HTTP ${res.status}${text ? ` - ${text.substring(0, 140)}` : ""}`,
//         );
//       }

//       const json = await res.json();

//       if (!json?.success || !Array.isArray(json.data)) {
//         throw new Error("Invalid API response format");
//       }

//       const raw = json.data;

//       const transformed = raw.map((exp) => ({
//         date: exp.expenseDate
//           ? new Date(exp.expenseDate).toLocaleDateString("en-GB", {
//               day: "2-digit",
//               month: "2-digit",
//               year: "numeric",
//             })
//           : "-",
//         rawDate: exp.expenseDate || null,
//         categoryDisplay: exp.subCategory
//           ? `${exp.category} • ${exp.subCategory}`
//           : exp.category || "-",
//         description: exp.description || exp.title || "-",
//         vendor: exp.vendor?.name || "-",
//         paidBy: exp.bankName || "Self",
//         amount: Number(exp.amount) || 0,
//         mode: formatPaymentMethod(exp.paymentMethod, exp.chequeNumber),
//         receiptNo: exp.voucherNo || exp.chequeNumber || "-",
//         // status: exp.status || "draft",
//         original: exp,
//       }));

//       setRawData(transformed);
//       setFilteredData(transformed);
//       updateTotals(transformed);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError(err.message || "Failed to load expenses");
//       setRawData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   useEffect(() => {
//     if (!rawData.length) return;

//     let result = [...rawData];

//     const f = appliedFilters;

//     if (f.fromDate || f.toDate) {
//       const from = f.fromDate ? new Date(f.fromDate) : null;
//       const to = f.toDate ? new Date(f.toDate) : null;
//       if (to) to.setHours(23, 59, 59, 999);

//       result = result.filter((exp) => {
//         if (!exp.rawDate) return false;
//         const d = new Date(exp.rawDate);
//         return (!from || d >= from) && (!to || d <= to);
//       });
//     }

//     if (f.category) {
//       const term = f.category.toLowerCase();
//       result = result.filter((exp) =>
//         exp.categoryDisplay.toLowerCase().includes(term),
//       );
//     }

//     if (f.paidBy) {
//       const term = f.paidBy.toLowerCase();
//       result = result.filter((exp) => exp.mode.toLowerCase().includes(term));
//     }

//     if (f.minAmount) {
//       const min = Number(f.minAmount);
//       if (!isNaN(min)) result = result.filter((exp) => exp.amount >= min);
//     }

//     if (f.search) {
//       const term = f.search.toLowerCase();
//       result = result.filter(
//         (exp) =>
//           exp.description.toLowerCase().includes(term) ||
//           exp.vendor.toLowerCase().includes(term) ||
//           exp.receiptNo.toLowerCase().includes(term),
//       );
//     }

//     setFilteredData(result);
//     updateTotals(result);
//   }, [rawData, appliedFilters]);

//   const updateTotals = (data) => {
//     setTotals({
//       totalExpenses: data.length,
//       totalAmount: data.reduce((sum, r) => sum + r.amount, 0),
//       paidByCash: data
//         .filter((r) => r.mode?.toLowerCase().includes("cash"))
//         .reduce((sum, r) => sum + r.amount, 0),
//       paidByBank: data
//         .filter((r) => !r.mode?.toLowerCase().includes("cash"))
//         .reduce((sum, r) => sum + r.amount, 0),
//     });
//   };

//   const handleFilterChange = (field, value) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleApplyFilters = () => {
//     setAppliedFilters({ ...filters });
//   };

//   const handleReset = () => {
//     const empty = {
//       fromDate: "",
//       toDate: "",
//       category: "",
//       paidBy: "",
//       minAmount: "",
//       search: "",
//     };
//     setFilters(empty);
//     setAppliedFilters(empty);
//   };

//   // ────────────────────────────────────────────────
//   // PRINT filtered data when filters are active, otherwise all
//   // ────────────────────────────────────────────────
//   const handlePrint = () => {
//     const dataToPrint = filteredData;

//     if (dataToPrint.length === 0) {
//       alert("No expenses available to print.");
//       return;
//     }

//     // Check if any filter is actually applied
//     const isFiltered =
//       appliedFilters.fromDate !== "" ||
//       appliedFilters.toDate !== "" ||
//       appliedFilters.category !== "" ||
//       appliedFilters.paidBy !== "" ||
//       appliedFilters.minAmount !== "" ||
//       appliedFilters.search !== "";

//     const title = isFiltered
//       ? "Expense Report - Filtered"
//       : "Expense Report - Complete";

//     const printTotals = {
//       total: dataToPrint.length,
//       amount: dataToPrint.reduce((s, r) => s + r.amount, 0),
//       paidByCash: dataToPrint
//         .filter((r) => r.mode?.toLowerCase().includes("cash"))
//         .reduce((s, r) => s + r.amount, 0),
//       paidByBank: dataToPrint
//         .filter((r) => !r.mode?.toLowerCase().includes("cash"))
//         .reduce((s, r) => s + r.amount, 0),
//     };

//     const printWindow = window.open("", "", "width=1100,height=800");

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>${title}</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 20px; font-size: 11pt; margin: 0; }
//           h1 { text-align: center; margin-bottom: 20px; font-size: 16pt; }
//           table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
//           th, td { border: 1px solid #333; padding: 8px 10px; text-align: left; }
//           th { background-color: #006d77; color: white; font-weight: bold; }
//           td { vertical-align: middle; }
//           .totals { margin-top: 20px; padding: 12px; background: #f8f8f8; border: 1px solid #ccc; font-weight: bold; text-align: center; }
//         </style>
//       </head>
//       <body>
//         <h1>${title}</h1>
//         <table>
//           <thead>
//             <tr>
//               <th>SR No</th>
//               <th>Date</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Vendor</th>
//               <th>Paid By</th>
//               <th>Amount</th>
//               <th>Mode</th>
//               <th>Receipt No</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${dataToPrint
//               .map(
//                 (exp, i) => `
//               <tr>
//                 <td>${i + 1}</td>
//                 <td>${exp.date}</td>
//                 <td>${exp.categoryDisplay}</td>
//                 <td>${exp.description}</td>
//                 <td>${exp.vendor}</td>
//                 <td>${exp.paidBy}</td>
//                 <td>₹${exp.amount.toLocaleString("en-IN")}</td>
//                 <td>${exp.mode}</td>
//                 <td>${exp.receiptNo}</td>
//                 <td>${exp.status || "-"}</td>
//               </tr>
//             `,
//               )
//               .join("")}
//           </tbody>
//         </table>
//         <div class="totals">
//           Total Expenses: ${printTotals.total} | 
//           Total Amount: ₹${printTotals.amount.toLocaleString("en-IN")} | 
//           Paid by Cash: ₹${printTotals.paidByCash.toLocaleString("en-IN")} | 
//           Paid by Bank/Other: ₹${printTotals.paidByBank.toLocaleString("en-IN")}
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

//   // ────────────────────────────────────────────────
//   // EXPORT CSV (already uses filtered data – good)
//   // ────────────────────────────────────────────────
//   const handleExportCSV = () => {
//     const headers = [
//       "SR No",
//       "Date",
//       "Category",
//       "Description",
//       "Vendor",
//       "Paid By",
//       "Amount",
//       "Mode",
//       "Receipt No",
//       "Status",
//     ];

//     const csvRows = filteredData.map((exp, i) =>
//       [
//         i + 1,
//         `"${exp.date.replace(/"/g, '""')}"`,
//         `"${exp.categoryDisplay.replace(/"/g, '""')}"`,
//         `"${exp.description.replace(/"/g, '""')}"`,
//         `"${exp.vendor.replace(/"/g, '""')}"`,
//         `"${exp.paidBy.replace(/"/g, '""')}"`,
//         exp.amount,
//         `"${exp.mode.replace(/"/g, '""')}"`,
//         `"${exp.receiptNo.replace(/"/g, '""')}"`,
//         `"${(exp.status || "-").replace(/"/g, '""')}"`,
//       ].join(","),
//     );

//     const csvContent = [headers.join(","), ...csvRows].join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `expense-report-${new Date().toISOString().split("T")[0]}.csv`,
//     );
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-full mx-auto">
//         <h1 className="text-2xl font-bold text-gray-900 mb-1">
//           Expense Report
//         </h1>
//         <p className="text-sm text-gray-600 mb-6">
//           View, filter and export expense transactions
//         </p>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
//             <div>
//               <label className="block text-xs text-gray-600 mb-1.5">
//                 From Date
//               </label>
//               <input
//                 type="date"
//                 value={filters.fromDate}
//                 onChange={(e) => handleFilterChange("fromDate", e.target.value)}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs text-gray-600 mb-1.5">
//                 To Date
//               </label>
//               <input
//                 type="date"
//                 value={filters.toDate}
//                 onChange={(e) => handleFilterChange("toDate", e.target.value)}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs text-gray-600 mb-1.5">
//                 Category
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Professional Fees, Travel, Rent"
//                 value={filters.category}
//                 onChange={(e) => handleFilterChange("category", e.target.value)}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400"
//               />
//             </div>

//             <div>
//               <label className="block text-xs text-gray-600 mb-1.5">
//                 Payment Mode
//               </label>
//               <select
//                 value={filters.paidBy}
//                 onChange={(e) => handleFilterChange("paidBy", e.target.value)}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               >
//                 <option value="">All Modes</option>
//                 <option value="cash">Cash</option>
//                 <option value="bank">Bank / Transfer</option>
//                 <option value="cheque">Cheque</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs text-gray-600 mb-1.5">
//                 Min Amount (₹)
//               </label>
//               <input
//                 type="number"
//                 value={filters.minAmount}
//                 onChange={(e) =>
//                   handleFilterChange("minAmount", e.target.value)
//                 }
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1">
//               <label className="block text-xs text-gray-600 mb-1.5">
//                 Search
//               </label>
//               <input
//                 type="text"
//                 placeholder="Search vendor, description, receipt..."
//                 value={filters.search}
//                 onChange={(e) => handleFilterChange("search", e.target.value)}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>

//             <div className="flex items-end gap-3 pt-5 sm:pt-0">
//               <button
//                 onClick={handleReset}
//                 className="px-5 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition"
//               >
//                 Reset
//               </button>
//               <button
//                 onClick={handleApplyFilters}
//                 disabled={loading}
//                 className="px-6 py-2 bg-teal-700 text-white rounded-md text-sm hover:bg-teal-800 transition disabled:opacity-60"
//               >
//                 {loading ? "Loading..." : "Apply Filters"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
//             {error}
//           </div>
//         )}

//         {/* Summary */}
//         <div className="bg-white rounded-lg shadow-sm p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           <div>
//             <p className="text-sm text-gray-600">Total Expenses</p>
//             <p className="text-2xl font-bold">{totals.totalExpenses}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Total Amount</p>
//             <p className="text-2xl font-bold">
//               ₹{totals.totalAmount.toLocaleString("en-IN")}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Paid by Cash</p>
//             <p className="text-2xl font-bold">
//               ₹{totals.paidByCash.toLocaleString("en-IN")}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Paid by Bank/Other</p>
//             <p className="text-2xl font-bold">
//               ₹{totals.paidByBank.toLocaleString("en-IN")}
//             </p>
//           </div>
//         </div>

//         {/* Print & Export Buttons */}
//         <div className="flex justify-end gap-3 mb-4">
//           <button
//             onClick={handlePrint}
//             className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
//             disabled={loading || rawData.length === 0}
//           >
//             <Printer size={16} />
//             Print Report
//           </button>
//           <button
//             onClick={handleExportCSV}
//             className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700"
//             disabled={loading || filteredData.length === 0}
//           >
//             <Download size={16} />
//             Export CSV
//           </button>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           {loading ? (
//             <div className="p-12 text-center text-gray-500">
//               Loading expenses...
//             </div>
//           ) : filteredData.length === 0 ? (
//             <div className="p-12 text-center text-gray-500 italic">
//               No expenses match the selected filters
//             </div>
//           ) : (
//             <Table
//               data={filteredData}
//               pagination={true}
//               defaultPageSize={10}
//               showSrNo={true}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






