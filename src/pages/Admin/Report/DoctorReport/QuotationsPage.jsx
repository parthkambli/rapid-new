// // src/pages/QuotationsPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Table from "../../../../components/mainComponents/Table";
// import { Download } from "lucide-react";
// import apiClient, { apiEndpoints } from "../../../../services/apiClient";

// export default function QuotationsPage() {
//   const { id } = useParams(); // doctor ID from URL
//   const [quotations, setQuotations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) {
//       setLoading(false);
//       return;
//     }

//     const fetchQuotations = async () => {
//       try {
//         setLoading(true);

//         const response = await apiClient.get(apiEndpoints.quotations.list, {
//           params: {
//             limit: 1000, // ← increase only if really necessary
//             // sort: "-createdAt", // optional – uncomment if you want newest first
//           },
//         });

//         const rawData = response.data;
//         const allQuotations =
//           rawData.data || rawData.quotations || rawData.results || [];

//         // Client-side filter: only quotations requested by this doctor
//         const doctorQuotations = allQuotations.filter((quote) => {
//           return quote?.requester?.entityId?._id === id;
//         });

//         setQuotations(doctorQuotations);
//       } catch (error) {
//         console.error("Failed to fetch quotations:", error);
//         if (error.response) {
//           console.error("Status:", error.response.status);
//           console.error("Data:", error.response.data);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuotations();
//   }, [id]);

//   const handleExportCSV = () => {
//     if (quotations.length === 0) return;

//     const headers = ["Quote ID", "Date", "Amount", "Status"];
//     const rows = quotations.map((q) => [
//       q.quotationNumber || q.quoteId || q._id?.slice(-8) || "—",
//       q.createdAt || q.date
//         ? new Date(q.createdAt || q.date).toLocaleDateString("en-GB")
//         : "—",
//       (q.totalAmount || q.amount || 0).toLocaleString("en-IN"),
//       q.status ? q.status.charAt(0).toUpperCase() + q.status.slice(1) : "—",
//     ]);

//     const csvContent = [headers, ...rows]
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `doctor-${id}-quotations.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   const columns = [
//     {
//       header: "Quote ID",
//       render: (row) => (
//         <span className="font-medium text-gray-900">
//           {row.quotationNumber || row.quoteId || row._id?.slice(-8) || "—"}
//         </span>
//       ),
//     },
//     {
//       header: "Date",
//       render: (row) => (
//         <span className="text-gray-700">
//           {row.createdAt || row.date
//             ? new Date(row.createdAt || row.date).toLocaleDateString("en-GB")
//             : "—"}
//         </span>
//       ),
//     },
//     {
//       header: "Amount",
//       render: (row) => (
//         <span className="font-medium text-gray-900">
//           ₹{(row.totalAmount || row.amount || 0).toLocaleString("en-IN")}
//         </span>
//       ),
//     },
//     {
//       header: "Status",
//       render: (row) => (
//         <span className="text-gray-700 capitalize">{row.status || "—"}</span>
//       ),
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="animate-pulse space-y-4">
//           <div className="h-5 bg-gray-200 rounded w-48"></div>
//           <div className="h-40 bg-gray-100 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm">
//       <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//         <h3 className="text-base font-semibold text-gray-900">
//           Quotations {quotations.length > 0 && `(${quotations.length})`}
//         </h3>

//         <button
//           onClick={handleExportCSV}
//           disabled={quotations.length === 0}
//           className={`
//             flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border
//             ${
//               quotations.length === 0
//                 ? "border-gray-200 text-gray-400 cursor-not-allowed"
//                 : "border-gray-300 hover:bg-gray-50 text-gray-700"
//             }
//           `}
//         >
//           <Download size={16} />
//           Export CSV
//         </button>
//       </div>

//       <div className="p-6">
//         {quotations.length > 0 ? (
//           <Table
//             data={quotations}
//             columns={columns}
//             excludeColumns={[
//               "requester",
//               "requestDetails",
//               "documents",
//               "_id",
//               "__v",
//               "createdAt",
//               "updatedAt",
//               "items",
//               "notes",
//               "totalAmount",
//               "quotationNumber",
//               "status",
//               "quoteId",
//               "date",
//               "amount",
//               "trno",
//               "expiryDate",
//               "priority",
//               "isExpired",
//               "createdBy",
//               "responses",
//               "followUps",
//               "updatedBy",
//             ]}
//           />
//         ) : (
//           <div className="text-center py-12 text-gray-500">
//             No quotations found for this doctor.
//           </div>
//         )}
//       </div>
//     </div>
//   );







// src/pages/QuotationsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "../../../../components/mainComponents/Table";
import { Download, Calendar, Printer } from "lucide-react";
import apiClient from "../../../../services/apiClient";

export default function QuotationsPage() {
  const { id } = useParams();

  const [quotations, setQuotations] = useState([]); // raw processed data — ALL quotations
  const [displayedQuotations, setDisplayedQuotations] = useState([]); // filtered view
  const [loading, setLoading] = useState(false);

  // Filter form state
  const [filterForm, setFilterForm] = useState({
    quoteId: "",
    fromDate: "",
    toDate: "",
  });

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    quoteId: "",
    fromDate: "",
    toDate: "",
  });

  const fetchQuotations = async () => {
    if (!id) {
      toast.error("Doctor ID is missing in the URL");
      setQuotations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const endpoint = `/quotations/doctor/${id}`;

      const res = await apiClient.get(endpoint, { params: { limit: 1000 } });

      let raw = res.data.data || [];

      if (!Array.isArray(raw)) {
        raw = raw ? [raw] : [];
      }

      // Sort newest first
      raw.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );

      // Process each quotation dynamically
      const flat = raw.map((q, i) => {
        const item = q.requestDetails?.items?.[0] || {};
        return {
          srNo: i + 1,
          quotationId:
            q.quotationId || q.quotationNumber || q._id?.slice(-8) || "—",
          narration: q.requestDetails?.additionalRequirements || "—",
          entryDate: q.createdAt
            ? new Date(q.createdAt).toLocaleDateString("en-IN")
            : "—",
          rawCreatedDate: q.createdAt || null,
          status: q.status
            ? q.status.charAt(0).toUpperCase() + q.status.slice(1)
            : "—",
          // Dynamic premium fields from items
          ...item, // spreads year_1, year_2, monthly, indemnity, etc.
        };
      });

      setQuotations(flat);
      setDisplayedQuotations(flat);
    } catch (err) {
      console.error("Quotations fetch failed:", err);
      toast.error("Failed to load quotations");
      setQuotations([]);
      setDisplayedQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [id]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filterForm });

    let filtered = [...quotations];

    if (filterForm.quoteId.trim()) {
      const search = filterForm.quoteId.toLowerCase().trim();
      filtered = filtered.filter((q) =>
        (q.quotationId || "").toLowerCase().includes(search),
      );
    }

    if (filterForm.fromDate) {
      const from = new Date(filterForm.fromDate);
      filtered = filtered.filter(
        (q) => new Date(q.rawCreatedDate || 0) >= from,
      );
    }

    if (filterForm.toDate) {
      const to = new Date(filterForm.toDate);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((q) => new Date(q.rawCreatedDate || 0) <= to);
    }

    setDisplayedQuotations(filtered);
  };

  const handleReset = () => {
    setFilterForm({ quoteId: "", fromDate: "", toDate: "" });
    setAppliedFilters({ quoteId: "", fromDate: "", toDate: "" });
    setDisplayedQuotations([...quotations]);
  };

  // Dynamically generate columns based on available keys in items
  const generateDynamicColumns = () => {
    const allKeys = new Set();
    quotations.forEach((q) => {
      if (q) {
        Object.keys(q).forEach((key) => {
          if (
            key.startsWith("year_") ||
            key === "monthly" ||
            key === "indemnity"
          ) {
            allKeys.add(key);
          }
        });
      }
    });

    const dynamicYearColumns = Array.from(allKeys)
      .sort()
      .map((key) => {
        if (key === "indemnity") {
          return {
            header: "Indemnity Limit",
            render: (r) => r[key] || "—",
          };
        } else {
          return {
            header:
              key === "monthly"
                ? "Monthly"
                : key.replace("_", " ").replace("year", "Year"),
            render: (r) =>
              r[key] ? `₹${Number(r[key]).toLocaleString("en-IN")}` : "—",
          };
        }
      });

    return [
      { header: "Quot ID", render: (r) => r.quotationId },
      { header: "Narration", render: (r) => r.narration },
      { header: "Entry Date", render: (r) => r.entryDate },
      ...dynamicYearColumns,
      { header: "Status", render: (r) => r.status },
    ];
  };

  const columns = generateDynamicColumns();

  // ────────────────────────────────────────────────
  // PRINT using hidden iframe (consistent with other reports)
  // ────────────────────────────────────────────────
  const handlePrint = () => {
    const quotationsToPrint = displayedQuotations;

    if (quotationsToPrint.length === 0) {
      toast.info("No quotations available to print.");
      return;
    }

    const isFiltered =
      appliedFilters.quoteId.trim() !== "" ||
      appliedFilters.fromDate !== "" ||
      appliedFilters.toDate !== "";

    const title = isFiltered
      ? "Quotations Report - Filtered"
      : "Quotations Report - Complete";

    // Use same dynamic columns logic for print
    const printHeaders = columns.map((c) => c.header).join("</th><th>");

    const printRows = quotationsToPrint
      .map((q) => {
        const cells = columns
          .map((c) => {
            const value = c.render ? c.render(q) : q[c.header] || "—";
            const alignClass =
              typeof value === "string" && value.startsWith("₹")
                ? ' class="amount"'
                : "";
            return `<td${alignClass}>${value}</td>`;
          })
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - Doctor ${id}</title>
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
            vertical-align: top;
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
        <h1>Quotations Report</h1>
        <div class="subtitle">
          ${isFiltered ? "Filtered View" : "All Quotations"} • 
          ${new Date().toLocaleDateString("en-IN")}
        </div>

        <table>
          <thead>
            <tr>
              <th>${printHeaders}</th>
            </tr>
          </thead>
          <tbody>
            ${printRows}
          </tbody>
        </table>

        <div class="totals">
          Total Quotations: ${quotationsToPrint.length}
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
      toast.error("Print preparation failed. Please try again.");
    }
  };

  const handleExportCSV = () => {
    const headers = columns.map((c) => c.header);

    const csvRows = displayedQuotations.map((q) =>
      columns
        .map(
          (c) =>
            `"${(c.render ? c.render(q) : q[c.header] || "").toString().replace(/"/g, '""')}"`,
        )
        .join(","),
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `quotations-doctor-${id}-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully!");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Quotations Report
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Quote ID</label>
            <input
              type="text"
              value={filterForm.quoteId}
              onChange={(e) =>
                setFilterForm({ ...filterForm, quoteId: e.target.value })
              }
              placeholder="Enter Quote ID..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

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

          <div className="flex items-end gap-3 col-span-2 lg:col-span-2">
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
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-4 gap-6 text-sm font-medium text-gray-600">
          <div>
            Total Quotations:{" "}
            <span className="font-bold text-gray-900">
              {displayedQuotations.length}
            </span>
          </div>
        </div>
      </div>

      {/* Print & Export */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || quotations.length === 0}
        >
          <Printer size={16} />
          Print Report
        </button>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || displayedQuotations.length === 0}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading quotations...
            </div>
          ) : displayedQuotations.length > 0 ? (
            <Table
              data={displayedQuotations}
              columns={columns}
              pagination={true}
              defaultPageSize={10}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              No quotations found matching the filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}











// // src/pages/QuotationsPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import Table from "../../../../components/mainComponents/Table";
// import { Download, Calendar, Printer } from "lucide-react";
// import apiClient from "../../../../services/apiClient";

// export default function QuotationsPage() {
//   const { id } = useParams();

//   const [quotations, setQuotations] = useState([]); // raw processed data — ALL quotations
//   const [displayedQuotations, setDisplayedQuotations] = useState([]); // filtered view
//   const [loading, setLoading] = useState(false);

//   // Filter form state
//   const [filterForm, setFilterForm] = useState({
//     quoteId: "",
//     fromDate: "",
//     toDate: "",
//   });

//   // Applied filters
//   const [appliedFilters, setAppliedFilters] = useState({
//     quoteId: "",
//     fromDate: "",
//     toDate: "",
//   });

//   const fetchQuotations = async () => {
//     if (!id) {
//       toast.error("Doctor ID is missing in the URL");
//       setQuotations([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const endpoint = `/quotations/doctor/${id}`;

//       const res = await apiClient.get(endpoint, { params: { limit: 1000 } });

//       let raw = res.data.data || [];

//       if (!Array.isArray(raw)) {
//         raw = raw ? [raw] : [];
//       }

//       // Sort newest first
//       raw.sort(
//         (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
//       );

//       // Process each quotation dynamically
//       const flat = raw.map((q, i) => {
//         const item = q.requestDetails?.items?.[0] || {};
//         return {
//           srNo: i + 1,
//           quotationId:
//             q.quotationId || q.quotationNumber || q._id?.slice(-8) || "—",
//           narration: q.requestDetails?.additionalRequirements || "—",
//           entryDate: q.createdAt
//             ? new Date(q.createdAt).toLocaleDateString("en-IN")
//             : "—",
//           rawCreatedDate: q.createdAt || null,
//           status: q.status
//             ? q.status.charAt(0).toUpperCase() + q.status.slice(1)
//             : "—",
//           // Dynamic premium fields from items
//           ...item, // spreads year_1, year_2, monthly, indemnity, etc.
//         };
//       });

//       setQuotations(flat);
//       setDisplayedQuotations(flat);
//     } catch (err) {
//       console.error("Quotations fetch failed:", err);
//       toast.error("Failed to load quotations");
//       setQuotations([]);
//       setDisplayedQuotations([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuotations();
//   }, [id]);

//   const handleApplyFilters = () => {
//     setAppliedFilters({ ...filterForm });

//     let filtered = [...quotations];

//     // Search by Quote ID
//     if (filterForm.quoteId.trim()) {
//       const search = filterForm.quoteId.toLowerCase().trim();
//       filtered = filtered.filter((q) =>
//         (q.quotationId || "").toLowerCase().includes(search),
//       );
//     }

//     // From Date
//     if (filterForm.fromDate) {
//       const from = new Date(filterForm.fromDate);
//       filtered = filtered.filter(
//         (q) => new Date(q.rawCreatedDate || 0) >= from,
//       );
//     }

//     // To Date
//     if (filterForm.toDate) {
//       const to = new Date(filterForm.toDate);
//       to.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((q) => new Date(q.rawCreatedDate || 0) <= to);
//     }

//     setDisplayedQuotations(filtered);
//   };

//   const handleReset = () => {
//     setFilterForm({ quoteId: "", fromDate: "", toDate: "" });
//     setAppliedFilters({ quoteId: "", fromDate: "", toDate: "" });
//     setDisplayedQuotations([...quotations]);
//   };

//   // Dynamically generate columns based on available keys in items
//   const generateDynamicColumns = () => {
//     const allKeys = new Set();
//     quotations.forEach((q) => {
//       if (q) {
//         Object.keys(q).forEach((key) => {
//           if (
//             key.startsWith("year_") ||
//             key === "monthly" ||
//             key === "indemnity"
//           ) {
//             allKeys.add(key);
//           }
//         });
//       }
//     });

//     const dynamicYearColumns = Array.from(allKeys)
//       .sort()
//       .map((key) => {
//         if (key === "indemnity") {
//           return {
//             header: "Indemnity Limit",
//             render: (r) => r[key] || "—",
//           };
//         } else {
//           return {
//             header:
//               key === "monthly"
//                 ? "Monthly"
//                 : key.replace("_", " ").replace("year", "Year"),
//             render: (r) =>
//               r[key] ? `₹${Number(r[key]).toLocaleString("en-IN")}` : "—",
//           };
//         }
//       });

//     return [
//       { header: "Quot ID", render: (r) => r.quotationId },
//       { header: "Narration", render: (r) => r.narration },
//       { header: "Entry Date", render: (r) => r.entryDate },
//       ...dynamicYearColumns,
//     ];
//   };

//   const columns = generateDynamicColumns();

//   // ────────────────────────────────────────────────
//   //    PRINT REPORT (filtered if filters applied, otherwise all)
//   // ────────────────────────────────────────────────
//   const handlePrint = () => {
//     const quotationsToPrint = displayedQuotations;

//     if (quotationsToPrint.length === 0) {
//       toast.info("No quotations available to print.");
//       return;
//     }

//     const printWindow = window.open("", "", "width=1200,height=800");

//     const dynamicHeaders = columns.map((c) => c.header).join("</th><th>");

//     const dynamicRows = quotationsToPrint
//       .map((q) => {
//         const cells = columns
//           .map((c) => {
//             const value = c.render ? c.render(q) : q[c.header] || "—";
//             // For better alignment in print
//             const alignClass =
//               typeof value === "string" && value.startsWith("₹")
//                 ? ' class="amount"'
//                 : "";
//             return `<td${alignClass}>${value}</td>`;
//           })
//           .join("");
//         return `<tr>${cells}</tr>`;
//       })
//       .join("");

//     // Optional: nicer title depending on filter state
//     const isFiltered =
//       appliedFilters.quoteId.trim() !== "" ||
//       appliedFilters.fromDate !== "" ||
//       appliedFilters.toDate !== "";

//     const title = isFiltered
//       ? "Quotations Report - Filtered"
//       : "Quotations Report - Complete";

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>${title} - Doctor ${id}</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 24px; font-size: 11pt; line-height: 1.4; }
//           h1 { text-align: center; margin-bottom: 20px; font-size: 18pt; }
//           table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
//           th, td { border: 1px solid #444; padding: 8px 10px; text-align: left; vertical-align: top; }
//           th { background-color: #006d77; color: white; font-weight: bold; }
//           .amount { text-align: right; }
//           .totals { margin-top: 24px; padding: 14px; background: #f8f8f8; border: 1px solid #ccc; font-weight: bold; font-size: 12pt; }
//         </style>
//       </head>
//       <body>
//         <h1>${title}</h1>
        
//         <table>
//           <thead>
//             <tr>
//               <th>${dynamicHeaders}</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${dynamicRows}
//           </tbody>
//         </table>

//         <div class="totals">
//           Total Quotations: ${quotationsToPrint.length}
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
//     const headers = columns.map((c) => c.header);

//     const csvRows = displayedQuotations.map((q) =>
//       columns
//         .map(
//           (c) =>
//             `"${(c.render ? c.render(q) : q[c.header] || "").toString().replace(/"/g, '""')}"`,
//         )
//         .join(","),
//     );

//     const csvContent = [headers.join(","), ...csvRows].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `quotations-doctor-${id}-${new Date().toISOString().split("T")[0]}.csv`,
//     );
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     toast.success("CSV exported successfully!");
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">
//         Quotations Report
//       </h1>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//         <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Quote ID</label>
//             <input
//               type="text"
//               value={filterForm.quoteId}
//               onChange={(e) =>
//                 setFilterForm({ ...filterForm, quoteId: e.target.value })
//               }
//               placeholder="Enter Quote ID..."
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
//             />
//           </div>

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
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//               />
//               {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" /> */}
//             </div>
//           </div>

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
//               {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" /> */}
//             </div>
//           </div>

//           <div className="flex items-end gap-3 col-span-2 lg:col-span-2">
//             <button
//               onClick={handleReset}
//               className="px-6 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100"
//             >
//               Reset
//             </button>
//             <button
//               onClick={handleApplyFilters}
//               className="px-6 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800"
//             >
//               View
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//         <div className="grid grid-cols-4 gap-6 text-sm font-medium text-gray-600">
//           <div>
//             Total Quotations:{" "}
//             <span className="font-bold text-gray-900">
//               {displayedQuotations.length}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Print & Export */}
//       <div className="flex justify-end gap-3 mb-4">
//         <button
//           onClick={handlePrint}
//           className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={loading || quotations.length === 0}
//         >
//           <Printer size={16} />
//           Print Report
//         </button>
//         <button
//           onClick={handleExportCSV}
//           className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={loading || displayedQuotations.length === 0}
//         >
//           <Download size={16} />
//           Export CSV
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <div className="p-6">
//           {loading ? (
//             <div className="text-center py-12 text-gray-500">
//               Loading quotations...
//             </div>
//           ) : displayedQuotations.length > 0 ? (
//             <Table
//               data={displayedQuotations}
//               columns={columns}
//               pagination={true}
//               defaultPageSize={10}
//             />
//           ) : (
//             <div className="text-center py-12 text-gray-500">
//               No quotations found matching the filters.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }