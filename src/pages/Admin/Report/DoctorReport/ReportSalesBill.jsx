// src/pages/SalesBillPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Table from "../../../../components/mainComponents/Table";
// import { Download } from "lucide-react";
// import apiClient, { apiEndpoints } from "../../../../services/apiClient";

// export default function SalesBillPage() {
//   const { id } = useParams();
//   const [salesBills, setSalesBills] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSalesBills = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Use the main doctor endpoint — it already includes salesBills
//         const response = await apiClient.get(apiEndpoints.doctors.get(id));
//         const data = response.data.data || response.data;

//         let bills = [];

//         // Main doctor's sales bills
//         if (
//           data.salesBills &&
//           Array.isArray(data.salesBills) &&
//           data.salesBills.length > 0
//         ) {
//           bills = [...bills, ...data.salesBills];
//         }

//         // If there is a linked/spouse doctor, include their bills too
//         if (
//           data.isLinked &&
//           data.linkedDoctor &&
//           data.linkedDoctor.salesBills?.length > 0
//         ) {
//           bills = [...bills, ...data.linkedDoctor.salesBills];
//         }

//         // Sort by date descending (newest first)
//         bills.sort((a, b) => {
//           const dateA = new Date(a.billDate || a.date || 0);
//           const dateB = new Date(b.billDate || b.date || 0);
//           return dateB - dateA;
//         });

//         console.log(`Fetched ${bills.length} sales bills for doctor ${id}`);
//         if (bills.length > 0) {
//           console.log("First bill example:", bills[0]);
//         }

//         setSalesBills(bills);
//       } catch (err) {
//         console.error("Error fetching sales bills:", err);
//         setError("Failed to load sales bills. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchSalesBills();
//   }, [id]);

//   const columns = [
//     {
//       header: "SB No",
//       render: (row) => (
//         <span className="font-medium text-gray-900">
//           {row.billNumber || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Date",
//       render: (row) => (
//         <span className="text-gray-700">
//           {row.billDate || row.date
//             ? new Date(row.billDate || row.date).toLocaleDateString("en-IN")
//             : "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Membership",
//       render: (row) => (
//         <span className="text-gray-700">
//           {row.billId?.membershipType ||
//             row.membershipType ||
//             row.membership ||
//             "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Amount",
//       render: (row) => (
//         <span className="font-semibold text-gray-900">
//           ₹
//           {(row.totalAmount || row.billId?.totalAmount || 0).toLocaleString(
//             "en-IN",
//           )}
//         </span>
//       ),
//     },
//   ];

//   const handleExportCSV = () => {
//     if (!salesBills.length) return;

//     const csv = [
//       ["SB No", "Date", "Membership", "Amount"],
//       ...salesBills.map((r) => [
//         r.billNumber || "N/A",
//         r.billDate || r.date
//           ? new Date(r.billDate || r.date).toLocaleDateString("en-IN")
//           : "N/A",
//         r.billId?.membershipType || r.membershipType || r.membership || "N/A",
//         r.totalAmount || r.billId?.totalAmount || 0,
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `sales-bills-doctor-${id}.csv`);
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
//       <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//         <h3 className="text-lg font-semibold text-gray-900">
//           Sales Bills ({salesBills.length})
//         </h3>

//         <button
//           onClick={handleExportCSV}
//           disabled={salesBills.length === 0}
//           className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <Download className="h-4 w-4" />
//           Export CSV
//         </button>
//       </div>

//       <div className="overflow-x-auto p-6">
//         {salesBills.length > 0 ? (
//           <Table
//             data={salesBills}
//             columns={columns}
//             excludeColumns={[
//               "items",
//               "client",
//               "documents",
//               "doctor",
//               "_id",
//               "__v",
//               "createdAt",
//               "updatedAt",
//               "paymentStatus",
//               "notes",
//               "currency",
//               "paymentTerms",
//               "outstandingAmount",
//               "status",
//               "preparedBy",
//               "reminderSent",
//               "planYears",
//               "planTotalPeriods",
//               "expectedTotalAmount",
//               "periodsPaid",
//               "totalPaidSoFar",
//               "renewalFrom",
//               "payments",
//               "periodType",
//             ]}
//           />
//         ) : (
//           <div className="text-center py-12 text-gray-500 italic">
//             No sales bills found for this doctor or linked spouse.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// //------------------------------------------------------------------------------------
// // src/pages/SalesBillPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Table from "../../../../components/mainComponents/Table";
// import { Download, Calendar, Printer } from "lucide-react";
// import apiClient, { apiEndpoints } from "../../../../services/apiClient";

// export default function SalesBillPage() {
//   const { id } = useParams();
//   const [allSalesBills, setAllSalesBills] = useState([]);
//   const [displayedSalesBills, setDisplayedSalesBills] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Filter form state (temporary until View is clicked)
//   const [filterForm, setFilterForm] = useState({
//     sbNo: "",
//     membership: "all",
//     fromDate: "",
//     toDate: "",
//   });

//   // Applied filters (only updated when View is clicked)
//   const [appliedFilters, setAppliedFilters] = useState({
//     sbNo: "",
//     membership: "all",
//     fromDate: "",
//     toDate: "",
//   });

//   useEffect(() => {
//     fetchSalesBills();
//   }, [id]);

//   const fetchSalesBills = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await apiClient.get(
//         apiEndpoints.doctors.getWithSpouse(id),
//       );
//       const data = response.data.data || response.data;

//       let bills = [];

//       if (
//         data.salesBills &&
//         Array.isArray(data.salesBills) &&
//         data.salesBills.length > 0
//       ) {
//         bills = [...bills, ...data.salesBills];
//       }

//       if (
//         data.isLinked &&
//         data.linkedDoctor &&
//         data.linkedDoctor.salesBills?.length > 0
//       ) {
//         bills = [...bills, ...data.linkedDoctor.salesBills];
//       }

//       // Sort newest first
//       bills.sort((a, b) => {
//         const dateA = new Date(a.billDate || a.date || 0);
//         const dateB = new Date(b.billDate || b.date || 0);
//         return dateB - dateA;
//       });

//       setAllSalesBills(bills);
//       setDisplayedSalesBills(bills);
//     } catch (err) {
//       console.error("Error fetching sales bills:", err);
//       setError("Failed to load sales bills. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApplyFilters = () => {
//     setAppliedFilters({ ...filterForm });

//     let filtered = [...allSalesBills];

//     if (filterForm.sbNo.trim()) {
//       const search = filterForm.sbNo.toLowerCase().trim();
//       filtered = filtered.filter((bill) =>
//         (bill.billNumber || "").toLowerCase().includes(search),
//       );
//     }

//     if (filterForm.membership !== "all") {
//       filtered = filtered.filter((bill) => {
//         const membershipType = (
//           bill.billId?.membershipType || ""
//         ).toLowerCase();
//         return membershipType === filterForm.membership;
//       });
//     }

//     if (filterForm.fromDate) {
//       const from = new Date(filterForm.fromDate);
//       filtered = filtered.filter((bill) => {
//         const billDate = new Date(bill.billDate || bill.date || 0);
//         return billDate >= from;
//       });
//     }

//     if (filterForm.toDate) {
//       const to = new Date(filterForm.toDate);
//       to.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((bill) => {
//         const billDate = new Date(bill.billDate || bill.date || 0);
//         return billDate <= to;
//       });
//     }

//     setDisplayedSalesBills(filtered);
//   };

//   const handleReset = () => {
//     setFilterForm({
//       sbNo: "",
//       membership: "all",
//       fromDate: "",
//       toDate: "",
//     });
//     setAppliedFilters({
//       sbNo: "",
//       membership: "all",
//       fromDate: "",
//       toDate: "",
//     });
//     setDisplayedSalesBills([...allSalesBills]);
//   };

//   const columns = [
//     {
//       header: "SB No",
//       render: (row) => (
//         <span className="font-medium text-gray-900">
//           {row.billNumber || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Date",
//       render: (row) => (
//         <span className="text-gray-700">
//           {row.billDate || row.date
//             ? new Date(row.billDate || row.date).toLocaleDateString("en-IN")
//             : "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Membership",
//       render: (row) => (
//         <span className="text-gray-700">
//           {row.billId?.membershipType || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Amount",
//       render: (row) => {
//         const membershipType = (row.billId?.membershipType || "").toLowerCase();
//         let amount = 0;

//         if (membershipType === "monthly") {
//           amount = row.billId?.items?.[0]?.amount || 0;
//         } else if (membershipType === "yearly") {
//           amount = row.billId?.totalAmount || 0;
//         } else {
//           amount = row.billId?.totalAmount || 0;
//         }

//         return (
//           <span className="font-semibold text-gray-900">
//             ₹{amount.toLocaleString("en-IN")}
//           </span>
//         );
//       },
//     },
//   ];

//   // ────────────────────────────────────────────────
//   //   PRINT using hidden iframe (consistent behavior)
//   // ────────────────────────────────────────────────
//   const handlePrint = () => {
//     const dataToPrint = displayedSalesBills;

//     if (dataToPrint.length === 0) {
//       alert("No sales bills to print.");
//       return;
//     }

//     const isFiltered =
//       appliedFilters.sbNo.trim() ||
//       appliedFilters.membership !== "all" ||
//       appliedFilters.fromDate ||
//       appliedFilters.toDate;

//     const title = isFiltered
//       ? "Sales Bills Report - Filtered"
//       : "Sales Bills Report - Complete";

//     const totalAmount = dataToPrint.reduce((sum, b) => {
//       const mt = (b.billId?.membershipType || "").toLowerCase();
//       let amt = 0;
//       if (mt === "monthly") amt = b.billId?.items?.[0]?.amount || 0;
//       else if (mt === "yearly") amt = b.billId?.totalAmount || 0;
//       else amt = b.billId?.totalAmount || 0;
//       return sum + amt;
//     }, 0);

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>${title}</title>
//         <style>
//           body {
//             font-family: Arial, Helvetica, sans-serif;
//             margin: 0;
//             padding: 20px;
//             font-size: 11pt;
//             color: #111;
//           }
//           h1 {
//             text-align: center;
//             margin: 0 0 12px;
//             font-size: 18pt;
//           }
//           .subtitle {
//             text-align: center;
//             color: #555;
//             margin-bottom: 20px;
//             font-size: 13pt;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 20px 0;
//             font-size: 10.5pt;
//           }
//           th, td {
//             border: 1px solid #888;
//             padding: 8px 10px;
//             text-align: left;
//           }
//           th {
//             background-color: #e0f2f1;
//             color: #1a3c34;
//             font-weight: bold;
//             text-align: center;
//           }
//           .amount {
//             text-align: right;
//             font-weight: 500;
//           }
//           .totals {
//             margin-top: 24px;
//             padding: 14px;
//             background: #f9fafb;
//             border: 1px solid #cbd5e0;
//             border-radius: 6px;
//             font-weight: bold;
//             text-align: center;
//             font-size: 11.5pt;
//           }
//           @media print {
//             body { padding: 12mm; margin: 0; }
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Sales Bills Report</h1>
//         <div class="subtitle">
//           ${isFiltered ? "Filtered View" : "All Bills"} • 
//           ${new Date().toLocaleDateString("en-IN")}
//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th>SB No</th>
//               <th>Date</th>
//               <th>Membership</th>
//               <th class="amount">Amount (₹)</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${dataToPrint
//               .map((bill) => {
//                 const membershipType = (
//                   bill.billId?.membershipType || ""
//                 ).toLowerCase();
//                 let amount = 0;

//                 if (membershipType === "monthly") {
//                   amount = bill.billId?.items?.[0]?.amount || 0;
//                 } else if (membershipType === "yearly") {
//                   amount = bill.billId?.totalAmount || 0;
//                 } else {
//                   amount = bill.billId?.totalAmount || 0;
//                 }

//                 const dateStr =
//                   bill.billDate || bill.date
//                     ? new Date(bill.billDate || bill.date).toLocaleDateString(
//                         "en-IN",
//                       )
//                     : "N/A";

//                 return `
//                   <tr>
//                     <td>${bill.billNumber || "N/A"}</td>
//                     <td>${dateStr}</td>
//                     <td class="center">${bill.billId?.membershipType || "N/A"}</td>
//                     <td class="amount">₹${amount.toLocaleString("en-IN")}</td>
//                   </tr>
//                 `;
//               })
//               .join("")}
//           </tbody>
//         </table>

//         <div class="totals">
//           Total Bills: ${dataToPrint.length}  
//               |    
//           Total Amount: ₹${totalAmount.toLocaleString("en-IN")}
//         </div>
//       </body>
//       </html>
//     `;

//     // Hidden iframe method
//     const printFrame = document.createElement("iframe");
//     printFrame.style.position = "absolute";
//     printFrame.style.width = "0";
//     printFrame.style.height = "0";
//     printFrame.style.left = "-9999px";
//     printFrame.style.top = "-9999px";
//     document.body.appendChild(printFrame);

//     const doc = printFrame.contentDocument || printFrame.contentWindow?.document;
//     if (doc) {
//       doc.open();
//       doc.write(printContent);
//       doc.close();

//       setTimeout(() => {
//         const win = printFrame.contentWindow;
//         if (win) {
//           win.focus();
//           win.print();

//           setTimeout(() => {
//             if (document.body.contains(printFrame)) {
//               document.body.removeChild(printFrame);
//             }
//           }, 1500);
//         }
//       }, 700);
//     } else {
//       console.error("Could not access print iframe");
//       if (document.body.contains(printFrame)) {
//         document.body.removeChild(printFrame);
//       }
//       alert("Print preparation failed. Please try again.");
//     }
//   };

//   const handleExportCSV = () => {
//     if (!displayedSalesBills.length) return;

//     const csv = [
//       ["SB No", "Date", "Membership", "Amount"],
//       ...displayedSalesBills.map((r) => {
//         const membershipType = (r.billId?.membershipType || "").toLowerCase();
//         let amount = 0;

//         if (membershipType === "monthly") {
//           amount = r.billId?.items?.[0]?.amount || 0;
//         } else if (membershipType === "yearly") {
//           amount = r.billId?.totalAmount || 0;
//         } else {
//           amount = r.billId?.totalAmount || 0;
//         }

//         return [
//           `"${r.billNumber || "N/A"}"`,
//           `"${r.billDate || r.date
//             ? new Date(r.billDate || r.date).toLocaleDateString("en-IN")
//             : "N/A"}"`,
//           `"${r.billId?.membershipType || "N/A"}"`,
//           amount,
//         ];
//       }),
//     ]
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `sales-bills-doctor-${id}-${new Date().toISOString().split("T")[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
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
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
//               placeholder="Enter SB No..."
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
//             />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Membership
//             </label>
//             <select
//               value={filterForm.membership}
//               onChange={(e) =>
//                 setFilterForm({ ...filterForm, membership: e.target.value })
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
//             >
//               <option value="all">All</option>
//               <option value="monthly">Monthly</option>
//               <option value="yearly">Yearly</option>
//             </select>
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
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm "
//               />
//             </div>
//           </div>
//         </div>

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
//           Sales Bills ({displayedSalesBills.length})
//         </h3>

//         <div className="flex gap-3">
//           <button
//             onClick={handlePrint}
//             disabled={displayedSalesBills.length === 0}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Printer className="h-4 w-4" />
//             Print Report
//           </button>

//           <button
//             onClick={handleExportCSV}
//             disabled={displayedSalesBills.length === 0}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
//           >
//             <Download className="h-4 w-4" />
//             Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto p-6">
//         {displayedSalesBills.length > 0 ? (
//           <Table
//             data={displayedSalesBills}
//             columns={columns}
//             pagination={true}
//             defaultPageSize={10}
//             excludeColumns={[
//               "items",
//               "client",
//               "documents",
//               "doctor",
//               "_id",
//               "__v",
//               "createdAt",
//               "updatedAt",
//               "paymentStatus",
//               "notes",
//               "currency",
//               "paymentTerms",
//               "outstandingAmount",
//               "status",
//               "preparedBy",
//               "reminderSent",
//               "planYears",
//               "planTotalPeriods",
//               "expectedTotalAmount",
//               "periodsPaid",
//               "totalPaidSoFar",
//               "renewalFrom",
//               "payments",
//               "periodType",
//             ]}
//           />
//         ) : (
//           <div className="text-center py-12 text-gray-500 italic">
//             No sales bills found matching the filters.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }







// src/pages/SalesBillPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Table from "../../../../components/mainComponents/Table";
import { Download, Calendar, Printer } from "lucide-react";
import apiClient, { apiEndpoints } from "../../../../services/apiClient";
import headerImage from "../../../../assets/quotation/Header.png";

export default function SalesBillPage() {
  const { id } = useParams();
  const [allSalesBills, setAllSalesBills] = useState([]);
  const [displayedSalesBills, setDisplayedSalesBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter form state (temporary until View is clicked)
  const [filterForm, setFilterForm] = useState({
    sbNo: "",
    membership: "all",
    fromDate: "",
    toDate: "",
  });

  // Applied filters (only updated when View is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    sbNo: "",
    membership: "all",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    fetchSalesBills();
  }, [id]);

  const fetchSalesBills = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(
        apiEndpoints.doctors.getWithSpouse(id),
      );
      const data = response.data.data || response.data;

      let bills = [];

      if (
        data.salesBills &&
        Array.isArray(data.salesBills) &&
        data.salesBills.length > 0
      ) {
        bills = [...bills, ...data.salesBills];
      }

      if (
        data.isLinked &&
        data.linkedDoctor &&
        data.linkedDoctor.salesBills?.length > 0
      ) {
        bills = [...bills, ...data.linkedDoctor.salesBills];
      }

      // Sort newest first
      bills.sort((a, b) => {
        const dateA = new Date(a.billDate || a.date || 0);
        const dateB = new Date(b.billDate || b.date || 0);
        return dateB - dateA;
      });

      setAllSalesBills(bills);
      setDisplayedSalesBills(bills);
    } catch (err) {
      console.error("Error fetching sales bills:", err);
      setError("Failed to load sales bills. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filterForm });

    let filtered = [...allSalesBills];

    if (filterForm.sbNo.trim()) {
      const search = filterForm.sbNo.toLowerCase().trim();
      filtered = filtered.filter((bill) =>
        (bill.billNumber || "").toLowerCase().includes(search),
      );
    }

    if (filterForm.membership !== "all") {
      filtered = filtered.filter((bill) => {
        const membershipType = (
          bill.billId?.membershipType || ""
        ).toLowerCase();
        return membershipType === filterForm.membership;
      });
    }

    if (filterForm.fromDate) {
      const from = new Date(filterForm.fromDate);
      filtered = filtered.filter((bill) => {
        const billDate = new Date(bill.billDate || bill.date || 0);
        return billDate >= from;
      });
    }

    if (filterForm.toDate) {
      const to = new Date(filterForm.toDate);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((bill) => {
        const billDate = new Date(bill.billDate || bill.date || 0);
        return billDate <= to;
      });
    }

    setDisplayedSalesBills(filtered);
  };

  const handleReset = () => {
    setFilterForm({
      sbNo: "",
      membership: "all",
      fromDate: "",
      toDate: "",
    });
    setAppliedFilters({
      sbNo: "",
      membership: "all",
      fromDate: "",
      toDate: "",
    });
    setDisplayedSalesBills([...allSalesBills]);
  };

  const columns = [
    {
      header: "SB No",
      render: (row) => (
        <span className="font-medium text-gray-900">
          {row.billNumber || "N/A"}
        </span>
      ),
    },
    {
      header: "Date",
      render: (row) => (
        <span className="text-gray-700">
          {row.billDate || row.date
            ? new Date(row.billDate || row.date).toLocaleDateString("en-IN")
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Membership",
      render: (row) => (
        <span className="text-gray-700">
          {row.billId?.membershipType || "N/A"}
        </span>
      ),
    },
    {
      header: "Amount",
      render: (row) => {
        const membershipType = (row.billId?.membershipType || "").toLowerCase();
        let amount = 0;

        if (membershipType === "monthly") {
          amount = row.billId?.items?.[0]?.amount || 0;
        } else if (membershipType === "yearly") {
          amount = row.billId?.totalAmount || 0;
        } else {
          amount = row.billId?.totalAmount || 0;
        }

        return (
          <span className="font-semibold text-gray-900">
            ₹{amount.toLocaleString("en-IN")}
          </span>
        );
      },
    },
  ];

const handlePrint = () => {
  const dataToPrint = displayedSalesBills;

  if (dataToPrint.length === 0) {
    alert("No sales bills to print.");
    return;
  }

  const isFiltered =
    appliedFilters.sbNo.trim() ||
    appliedFilters.membership !== "all" ||
    appliedFilters.fromDate ||
    appliedFilters.toDate;

  const title = isFiltered
    ? "Sales Bills Report - Filtered"
    : "Sales Bills Report - Complete";

  const totalAmount = dataToPrint.reduce((sum, b) => {
    const mt = (b.billId?.membershipType || "").toLowerCase();
    let amt = 0;
    if (mt === "monthly") amt = b.billId?.items?.[0]?.amount || 0;
    else if (mt === "yearly") amt = b.billId?.totalAmount || 0;
    else amt = b.billId?.totalAmount || 0;
    return sum + amt;
  }, 0);

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11pt;
          color: #111;
        }
        * {
          box-sizing: border-box;
        }
        .header-img {
          width: 100%;
          height: auto;
          display: block;
          margin: 0 !important;
          padding: 0 !important;
        }
        h1 {
          text-align: center;
          margin: 8px 0 6px 0;
          font-size: 18pt;
        }
        .subtitle {
          text-align: center;
          color: #555;
          margin: 0 0 16px 0;
          font-size: 13pt;
        }
        .content-wrapper {
          padding: 0 12mm;           /* ← left + right padding for table and totals */
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
          margin: 24px 0;
          padding: 14px;
          background: #f9fafb;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-weight: bold;
          text-align: center;
          font-size: 11.5pt;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
          }
          .header-img {
            margin: 0 !important;
            padding: 0 !important;
          }
          h1, .subtitle {
            margin-top: 6px !important;
          }
          .content-wrapper {
            padding: 0 12mm !important;
          }
        }
      </style>
    </head>
    <body>
      <img 
        src="${headerImage}" 
        alt="RAPID MEDICOLEGAL SERVICES Header" 
        class="header-img"
      />

      <div class="content-wrapper">
        <h1>Sales Bills Report</h1>
        <div class="subtitle">
          ${isFiltered ? "Filtered View" : "All Bills"} • 
          ${new Date().toLocaleDateString("en-IN")}
        </div>

        <table>
          <thead>
            <tr>
              <th>SB No</th>
              <th>Date</th>
              <th>Membership</th>
              <th class="amount">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${dataToPrint
              .map((bill) => {
                const membershipType = (bill.billId?.membershipType || "").toLowerCase();
                let amount = 0;

                if (membershipType === "monthly") {
                  amount = bill.billId?.items?.[0]?.amount || 0;
                } else if (membershipType === "yearly") {
                  amount = bill.billId?.totalAmount || 0;
                } else {
                  amount = bill.billId?.totalAmount || 0;
                }

                const dateStr = bill.billDate || bill.date
                  ? new Date(bill.billDate || bill.date).toLocaleDateString("en-IN")
                  : "N/A";

                return `
                  <tr>
                    <td>${bill.billNumber || "N/A"}</td>
                    <td>${dateStr}</td>
                    <td>${bill.billId?.membershipType || "N/A"}</td>
                    <td class="amount">₹${amount.toLocaleString("en-IN")}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          Total Bills: ${dataToPrint.length}  
              |    
          Total Amount: ₹${totalAmount.toLocaleString("en-IN")}
        </div>
      </div>
    </body>
    </html>
  `;

  // Hidden iframe method (unchanged)
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
    console.error("Could not access print iframe");
    if (document.body.contains(printFrame)) {
      document.body.removeChild(printFrame);
    }
    alert("Print preparation failed. Please try again.");
  }
};

  const handleExportCSV = () => {
    if (!displayedSalesBills.length) return;

    const csv = [
      ["SB No", "Date", "Membership", "Amount"],
      ...displayedSalesBills.map((r) => {
        const membershipType = (r.billId?.membershipType || "").toLowerCase();
        let amount = 0;

        if (membershipType === "monthly") {
          amount = r.billId?.items?.[0]?.amount || 0;
        } else if (membershipType === "yearly") {
          amount = r.billId?.totalAmount || 0;
        } else {
          amount = r.billId?.totalAmount || 0;
        }

        return [
          `"${r.billNumber || "N/A"}"`,
          `"${r.billDate || r.date
            ? new Date(r.billDate || r.date).toLocaleDateString("en-IN")
            : "N/A"}"`,
          `"${r.billId?.membershipType || "N/A"}"`,
          amount,
        ];
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sales-bills-doctor-${id}-${new Date().toISOString().split("T")[0]}.csv`);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              placeholder="Enter SB No..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Membership
            </label>
            <select
              value={filterForm.membership}
              onChange={(e) =>
                setFilterForm({ ...filterForm, membership: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
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
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm "
              />
            </div>
          </div>
        </div>

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
          Sales Bills ({displayedSalesBills.length})
        </h3>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            disabled={displayedSalesBills.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>

          <button
            onClick={handleExportCSV}
            disabled={displayedSalesBills.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-6">
        {displayedSalesBills.length > 0 ? (
          <Table
            data={displayedSalesBills}
            columns={columns}
            pagination={true}
            defaultPageSize={10}
            excludeColumns={[
              "items",
              "client",
              "documents",
              "doctor",
              "_id",
              "__v",
              "createdAt",
              "updatedAt",
              "paymentStatus",
              "notes",
              "currency",
              "paymentTerms",
              "outstandingAmount",
              "status",
              "preparedBy",
              "reminderSent",
              "planYears",
              "planTotalPeriods",
              "expectedTotalAmount",
              "periodsPaid",
              "totalPaidSoFar",
              "renewalFrom",
              "payments",
              "periodType",
            ]}
          />
        ) : (
          <div className="text-center py-12 text-gray-500 italic">
            No sales bills found matching the filters.
          </div>
        )}
      </div>
    </div>
  );
}