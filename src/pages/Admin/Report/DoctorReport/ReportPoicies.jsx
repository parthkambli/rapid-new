// src/pages/PoliciesPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Table from "../../../../components/mainComponents/Table";
// import { Download } from "lucide-react";
// import apiClient, { apiEndpoints } from "../../../../services/apiClient";

// export default function PoliciesPage() {
//   const { id } = useParams();
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPolicies = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch from the main doctor endpoint — it already includes policies
//         const response = await apiClient.get(apiEndpoints.doctors.get(id));
//         const data = response.data.data || response.data;

//         let allPolicies = [];

//         // Main doctor's policies
//         if (
//           data.policies &&
//           Array.isArray(data.policies) &&
//           data.policies.length > 0
//         ) {
//           allPolicies = [...allPolicies, ...data.policies];
//         }

//         // If there is a linked/spouse doctor, include their policies too
//         if (
//           data.isLinked &&
//           data.linkedDoctor &&
//           data.linkedDoctor.policies?.length > 0
//         ) {
//           allPolicies = [...allPolicies, ...data.linkedDoctor.policies];
//         }

//         // Sort by startDate descending (newest first)
//         allPolicies.sort((a, b) => {
//           const dateA = new Date(a.startDate || 0);
//           const dateB = new Date(b.startDate || 0);
//           return dateB - dateA;
//         });

//         console.log(`Fetched ${allPolicies.length} policies for doctor ${id}`);
//         if (allPolicies.length > 0) {
//           console.log("First policy example:", allPolicies[0]);
//         }

//         setPolicies(allPolicies);
//       } catch (err) {
//         console.error("Error fetching policies:", err);
//         setError("Failed to load policies. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchPolicies();
//   }, [id]);

//   const columns = [
//     {
//       header: "Policy No",
//       render: (row) => (
//         <span className="font-medium text-gray-900">
//           {row.policyNumber || row.policyId || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Type",
//       render: (row) => (
//         <span className="text-gray-700">{row.policyType || "N/A"}</span>
//       ),
//     },
//     {
//       header: "Start Date",
//       render: (row) => (
//         <span className="text-gray-700">
//           {row.startDate
//             ? new Date(row.startDate).toLocaleDateString("en-IN")
//             : "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "End Date",
//       render: (row) => (
//         <span className="text-gray-700">
//           {row.endDate
//             ? new Date(row.endDate).toLocaleDateString("en-IN")
//             : "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Premium",
//       render: (row) => (
//         <span className="font-semibold text-gray-900">
//           ₹{(row.premiumAmount || 0).toLocaleString("en-IN")}
//         </span>
//       ),
//     },
//     {
//       header: "Status",
//       render: (row) => (
//         <span
//           className={`text-sm font-medium ${
//             row.status === "active"
//               ? "text-green-600"
//               : row.status === "expired"
//                 ? "text-red-600"
//                 : "text-gray-600"
//           }`}
//         >
//           {row.status
//             ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
//             : "N/A"}
//         </span>
//       ),
//     },
//   ];

//   const handleExportCSV = () => {
//     if (!policies.length) return;

//     const csv = [
//       ["Policy No", "Type", "Start Date", "End Date", "Premium", "Status"],
//       ...policies.map((r) => [
//         r.policyNumber || r.policyId || "N/A",
//         r.policyType || "N/A",
//         r.startDate ? new Date(r.startDate).toLocaleDateString("en-IN") : "N/A",
//         r.endDate ? new Date(r.endDate).toLocaleDateString("en-IN") : "N/A",
//         r.premiumAmount || 0,
//         r.status || "N/A",
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `policies-doctor-${id}.csv`);
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
//           Policies ({policies.length})
//         </h3>

//         <button
//           onClick={handleExportCSV}
//           disabled={policies.length === 0}
//           className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <Download className="h-4 w-4" />
//           Export CSV
//         </button>
//       </div>

//       <div className="overflow-x-auto p-6">
//         {policies.length > 0 ? (
//           <Table
//             data={policies}
//             columns={columns}
//             excludeColumns={[
//               "_id",
//               "__v",
//               "createdAt",
//               "updatedAt",
//               "policyHistory",
//               "relatedSalesBillId",
//               "renewedFrom",
//               "renewedTo",
//               "paidBy",
//               "renewalStatus",
//               "renewalReminderSent",
//               "totalPremiumPaid",
//               "createdBy",
//               "documents",
//               "policyHolder",
//               "coverageAmount",
//               "status", // already in columns
//             ]}
//           />
//         ) : (
//           <div className="text-center py-12 text-gray-500 italic">
//             No policies found for this doctor or linked spouse.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }








// src/pages/PoliciesPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Table from "../../../../components/mainComponents/Table";
import { Download, Calendar, Printer } from "lucide-react";
import apiClient, { apiEndpoints } from "../../../../services/apiClient";

export default function PoliciesPage() {
  const { id } = useParams();
  const [allPolicies, setAllPolicies] = useState([]); // raw fetched data
  const [displayedPolicies, setDisplayedPolicies] = useState([]); // filtered view
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter form state (temporary until View is clicked)
  const [filterForm, setFilterForm] = useState({
    policyNo: "",
    type: "all", // "all" | "doctor" | "hospital"
    company: "",
    fromDate: "",
    toDate: "",
  });

  // Applied filters (updated only on View click)
  const [appliedFilters, setAppliedFilters] = useState({
    policyNo: "",
    type: "all",
    company: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    fetchPolicies();
  }, [id]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(apiEndpoints.doctors.get(id));
      const data = response.data.data || response.data;

      let policies = [];

      if (
        data.policies &&
        Array.isArray(data.policies) &&
        data.policies.length > 0
      ) {
        policies = [...policies, ...data.policies];
      }

      if (
        data.isLinked &&
        data.linkedDoctor &&
        data.linkedDoctor.policies?.length > 0
      ) {
        policies = [...policies, ...data.linkedDoctor.policies];
      }

      // Sort newest start date first
      policies.sort((a, b) => {
        const dateA = new Date(a.startDate || 0);
        const dateB = new Date(b.startDate || 0);
        return dateB - dateA;
      });

      setAllPolicies(policies);
      setDisplayedPolicies(policies); // initial = all
    } catch (err) {
      console.error("Error fetching policies:", err);
      setError("Failed to load policies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filterForm });

    let filtered = [...allPolicies];

    if (filterForm.policyNo.trim()) {
      const search = filterForm.policyNo.toLowerCase().trim();
      filtered = filtered.filter((p) =>
        (p.policyNumber || p.policyId || "").toLowerCase().includes(search),
      );
    }

    if (filterForm.type !== "all") {
      filtered = filtered.filter((p) => {
        const type = (p.policyType || "").toLowerCase();
        return type === filterForm.type;
      });
    }

    if (filterForm.company.trim()) {
      const search = filterForm.company.toLowerCase().trim();
      filtered = filtered.filter((p) =>
        (p.policyId?.insuranceCompany?.companyName || "")
          .toLowerCase()
          .includes(search),
      );
    }

    if (filterForm.fromDate) {
      const from = new Date(filterForm.fromDate);
      filtered = filtered.filter((p) => {
        const start = new Date(p.startDate || 0);
        return start >= from;
      });
    }

    if (filterForm.toDate) {
      const to = new Date(filterForm.toDate);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((p) => {
        const start = new Date(p.startDate || 0);
        return start <= to;
      });
    }

    setDisplayedPolicies(filtered);
  };

  const handleReset = () => {
    setFilterForm({
      policyNo: "",
      type: "all",
      company: "",
      fromDate: "",
      toDate: "",
    });
    setAppliedFilters({
      policyNo: "",
      type: "all",
      company: "",
      fromDate: "",
      toDate: "",
    });
    setDisplayedPolicies([...allPolicies]);
  };

  const columns = [
    {
      header: "Policy No",
      render: (row) => (
        <span className="font-medium text-gray-900">
          {row.policyNumber || row.policyId || "N/A"}
        </span>
      ),
    },
    {
      header: "Type",
      render: (row) => (
        <span className="text-gray-700 capitalize">
          {row.policyType || "N/A"}
        </span>
      ),
    },
    {
      header: "Company",
      render: (row) => (
        <span className="text-gray-700">
          {row.policyId?.insuranceCompany?.companyName || "N/A"}
        </span>
      ),
    },
    {
      header: "Start Date",
      render: (row) => (
        <span className="text-gray-700">
          {row.startDate
            ? new Date(row.startDate).toLocaleDateString("en-IN")
            : "N/A"}
        </span>
      ),
    },
    {
      header: "End Date",
      render: (row) => (
        <span className="text-gray-700">
          {row.endDate
            ? new Date(row.endDate).toLocaleDateString("en-IN")
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Premium",
      render: (row) => (
        <span className="font-semibold text-gray-900">
          ₹{(row.premiumAmount || 0).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`text-sm font-medium ${
            row.status === "active"
              ? "text-green-600"
              : row.status === "expired"
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {row.status
            ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
            : "N/A"}
        </span>
      ),
    },
  ];

  // ────────────────────────────────────────────────
  // PRINT using hidden iframe (consistent with other reports)
  // ────────────────────────────────────────────────
  const handlePrint = () => {
    const policiesToPrint = displayedPolicies;

    if (policiesToPrint.length === 0) {
      alert("No policies available to print.");
      return;
    }

    const totalPremium = policiesToPrint.reduce(
      (sum, p) => sum + (p.premiumAmount || 0),
      0
    );

    const isFiltered =
      appliedFilters.policyNo.trim() !== "" ||
      appliedFilters.type !== "all" ||
      appliedFilters.company.trim() !== "" ||
      appliedFilters.fromDate !== "" ||
      appliedFilters.toDate !== "";

    const title = isFiltered
      ? "Policies Report - Filtered"
      : "Policies Report - Complete";

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
        <h1>Policies Report</h1>
        <div class="subtitle">
          ${isFiltered ? "Filtered View" : "All Policies"} • 
          ${new Date().toLocaleDateString("en-IN")}
        </div>

        <table>
          <thead>
            <tr>
              <th>Policy No</th>
              <th>Type</th>
              <th>Company</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th class="amount">Premium (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${policiesToPrint
              .map((p) => {
                const startDate = p.startDate
                  ? new Date(p.startDate).toLocaleDateString("en-IN")
                  : "N/A";
                const endDate = p.endDate
                  ? new Date(p.endDate).toLocaleDateString("en-IN")
                  : "N/A";

                return `
                  <tr>
                    <td>${p.policyNumber || p.policyId || "N/A"}</td>
                    <td>${p.policyType || "N/A"}</td>
                    <td>${p.policyId?.insuranceCompany?.companyName || "N/A"}</td>
                    <td>${startDate}</td>
                    <td>${endDate}</td>
                    <td class="amount">₹${(p.premiumAmount || 0).toLocaleString("en-IN")}</td>
                    <td>${p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : "N/A"}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          Total Policies: ${policiesToPrint.length}  
              |    
          Total Premium: ₹${totalPremium.toLocaleString("en-IN")}
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
    if (!displayedPolicies.length) return;

    const csv = [
      [
        "Policy No",
        "Type",
        "Company",
        "Start Date",
        "End Date",
        "Premium",
        "Status",
      ],
      ...displayedPolicies.map((r) => [
        r.policyNumber || r.policyId || "N/A",
        r.policyType || "N/A",
        r.policyId?.insuranceCompany?.companyName || "N/A",
        r.startDate ? new Date(r.startDate).toLocaleDateString("en-IN") : "N/A",
        r.endDate ? new Date(r.endDate).toLocaleDateString("en-IN") : "N/A",
        r.premiumAmount || 0,
        r.status || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `policies-doctor-${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          {/* Policy No */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Policy No
            </label>
            <input
              type="text"
              value={filterForm.policyNo}
              onChange={(e) =>
                setFilterForm({ ...filterForm, policyNo: e.target.value })
              }
              placeholder="Enter Policy No..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Type</label>
            <select
              value={filterForm.type}
              onChange={(e) =>
                setFilterForm({ ...filterForm, type: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All</option>
              <option value="doctor">Doctor</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Company</label>
            <input
              type="text"
              value={filterForm.company}
              onChange={(e) =>
                setFilterForm({ ...filterForm, company: e.target.value })
              }
              placeholder="Enter Company Name..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* From Date (Start Date) */}
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

          {/* To Date (Start Date) */}
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
          Policies ({displayedPolicies.length})
        </h3>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            disabled={loading || allPolicies.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>

          <button
            onClick={handleExportCSV}
            disabled={displayedPolicies.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-6">
        {displayedPolicies.length > 0 ? (
          <Table
            data={displayedPolicies}
            columns={columns}
            pagination={true}
            defaultPageSize={10}
            excludeColumns={[
              "_id",
              "__v",
              "createdAt",
              "updatedAt",
              "policyHistory",
              "relatedSalesBillId",
              "renewedFrom",
              "renewedTo",
              "paidBy",
              "renewalStatus",
              "renewalReminderSent",
              "totalPremiumPaid",
              "createdBy",
              "documents",
              "policyHolder",
              "coverageAmount",
              "status", // already in columns
            ]}
          />
        ) : (
          <div className="text-center py-12 text-gray-500 italic">
            No policies found matching the filters.
          </div>
        )}
      </div>
    </div>
  );
}









// // src/pages/PoliciesPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Table from "../../../../components/mainComponents/Table";
// import { Download, Calendar, Printer } from "lucide-react"; // ← added Printer
// import apiClient, { apiEndpoints } from "../../../../services/apiClient";

// export default function PoliciesPage() {
//   const { id } = useParams();
//   const [allPolicies, setAllPolicies] = useState([]); // raw fetched data
//   const [displayedPolicies, setDisplayedPolicies] = useState([]); // filtered view
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Filter form state (temporary until View is clicked)
//   const [filterForm, setFilterForm] = useState({
//     policyNo: "",
//     type: "all", // "all" | "doctor" | "hospital"
//     company: "",
//     fromDate: "",
//     toDate: "",
//   });

//   // Applied filters (updated only on View click)
//   const [appliedFilters, setAppliedFilters] = useState({
//     policyNo: "",
//     type: "all",
//     company: "",
//     fromDate: "",
//     toDate: "",
//   });

//   useEffect(() => {
//     fetchPolicies();
//   }, [id]);

//   const fetchPolicies = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await apiClient.get(apiEndpoints.doctors.get(id));
//       const data = response.data.data || response.data;

//       let policies = [];

//       if (
//         data.policies &&
//         Array.isArray(data.policies) &&
//         data.policies.length > 0
//       ) {
//         policies = [...policies, ...data.policies];
//       }

//       if (
//         data.isLinked &&
//         data.linkedDoctor &&
//         data.linkedDoctor.policies?.length > 0
//       ) {
//         policies = [...policies, ...data.linkedDoctor.policies];
//       }

//       // Sort newest start date first
//       policies.sort((a, b) => {
//         const dateA = new Date(a.startDate || 0);
//         const dateB = new Date(b.startDate || 0);
//         return dateB - dateA;
//       });

//       setAllPolicies(policies);
//       setDisplayedPolicies(policies); // initial = all
//     } catch (err) {
//       console.error("Error fetching policies:", err);
//       setError("Failed to load policies. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApplyFilters = () => {
//     setAppliedFilters({ ...filterForm });

//     let filtered = [...allPolicies];

//     // 1. Policy No
//     if (filterForm.policyNo.trim()) {
//       const search = filterForm.policyNo.toLowerCase().trim();
//       filtered = filtered.filter((p) =>
//         (p.policyNumber || p.policyId || "").toLowerCase().includes(search),
//       );
//     }

//     // 2. Type (doctor / hospital)
//     if (filterForm.type !== "all") {
//       filtered = filtered.filter((p) => {
//         const type = (p.policyType || "").toLowerCase();
//         return type === filterForm.type;
//       });
//     }

//     // 3. Company (insurance company name)
//     if (filterForm.company.trim()) {
//       const search = filterForm.company.toLowerCase().trim();
//       filtered = filtered.filter((p) =>
//         (p.policyId?.insuranceCompany?.companyName || "")
//           .toLowerCase()
//           .includes(search),
//       );
//     }

//     // 4. Start Date range
//     if (filterForm.fromDate) {
//       const from = new Date(filterForm.fromDate);
//       filtered = filtered.filter((p) => {
//         const start = new Date(p.startDate || 0);
//         return start >= from;
//       });
//     }

//     if (filterForm.toDate) {
//       const to = new Date(filterForm.toDate);
//       to.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((p) => {
//         const start = new Date(p.startDate || 0);
//         return start <= to;
//       });
//     }

//     setDisplayedPolicies(filtered);
//   };

//   const handleReset = () => {
//     setFilterForm({
//       policyNo: "",
//       type: "all",
//       company: "",
//       fromDate: "",
//       toDate: "",
//     });
//     setAppliedFilters({
//       policyNo: "",
//       type: "all",
//       company: "",
//       fromDate: "",
//       toDate: "",
//     });
//     setDisplayedPolicies([...allPolicies]);
//   };

//   const columns = [
//     {
//       header: "Policy No",
//       render: (row) => (
//         <span className="font-medium text-gray-900">
//           {row.policyNumber || row.policyId || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Type",
//       render: (row) => (
//         <span className="text-gray-700 capitalize">
//           {row.policyType || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Company",
//       render: (row) => (
//         <span className="text-gray-700">
//           {row.policyId?.insuranceCompany?.companyName || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Start Date",
//       render: (row) => (
//         <span className="text-gray-700">
//           {row.startDate
//             ? new Date(row.startDate).toLocaleDateString("en-IN")
//             : "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "End Date",
//       render: (row) => (
//         <span className="text-gray-700">
//           {row.endDate
//             ? new Date(row.endDate).toLocaleDateString("en-IN")
//             : "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Premium",
//       render: (row) => (
//         <span className="font-semibold text-gray-900">
//           ₹{(row.premiumAmount || 0).toLocaleString("en-IN")}
//         </span>
//       ),
//     },
//     {
//       header: "Status",
//       render: (row) => (
//         <span
//           className={`text-sm font-medium ${
//             row.status === "active"
//               ? "text-green-600"
//               : row.status === "expired"
//                 ? "text-red-600"
//                 : "text-gray-600"
//           }`}
//         >
//           {row.status
//             ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
//             : "N/A"}
//         </span>
//       ),
//     },
//   ];

//   // ────────────────────────────────────────────────
//   //    PRINT REPORT (filtered if filters applied, otherwise all)
//   // ────────────────────────────────────────────────
//   const handlePrint = () => {
//     const policiesToPrint = displayedPolicies;

//     if (policiesToPrint.length === 0) {
//       alert("No policies available to print.");
//       return;
//     }

//     const printWindow = window.open("", "", "width=1200,height=800");

//     const totalPremium = policiesToPrint.reduce(
//       (sum, p) => sum + (p.premiumAmount || 0),
//       0,
//     );

//     // Determine if filters are active
//     const isFiltered =
//       appliedFilters.policyNo.trim() !== "" ||
//       appliedFilters.type !== "all" ||
//       appliedFilters.company.trim() !== "" ||
//       appliedFilters.fromDate !== "" ||
//       appliedFilters.toDate !== "";

//     const title = isFiltered ? "Policies Report - Filtered" : "Policies Report - Complete";

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
//               <th>Policy No</th>
//               <th>Type</th>
//               <th>Company</th>
//               <th>Start Date</th>
//               <th>End Date</th>
//               <th class="amount">Premium</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${policiesToPrint
//               .map((p) => {
//                 const startDate = p.startDate
//                   ? new Date(p.startDate).toLocaleDateString("en-IN")
//                   : "N/A";
//                 const endDate = p.endDate
//                   ? new Date(p.endDate).toLocaleDateString("en-IN")
//                   : "N/A";

//                 return `
//                   <tr>
//                     <td>${p.policyNumber || p.policyId || "N/A"}</td>
//                     <td class="center">${p.policyType || "N/A"}</td>
//                     <td>${p.policyId?.insuranceCompany?.companyName || "N/A"}</td>
//                     <td>${startDate}</td>
//                     <td>${endDate}</td>
//                     <td class="amount">₹${(p.premiumAmount || 0).toLocaleString("en-IN")}</td>
//                     <td>${p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : "N/A"}</td>
//                   </tr>
//                 `;
//               })
//               .join("")}
//           </tbody>
//         </table>

//         <div class="totals">
//           Total Policies: ${policiesToPrint.length}  
//             |  Total Premium: ₹${totalPremium.toLocaleString("en-IN")}
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
//     if (!displayedPolicies.length) return;

//     const csv = [
//       [
//         "Policy No",
//         "Type",
//         "Company",
//         "Start Date",
//         "End Date",
//         "Premium",
//         "Status",
//       ],
//       ...displayedPolicies.map((r) => [
//         r.policyNumber || r.policyId || "N/A",
//         r.policyType || "N/A",
//         r.policyId?.insuranceCompany?.companyName || "N/A",
//         r.startDate ? new Date(r.startDate).toLocaleDateString("en-IN") : "N/A",
//         r.endDate ? new Date(r.endDate).toLocaleDateString("en-IN") : "N/A",
//         r.premiumAmount || 0,
//         r.status || "N/A",
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `policies-doctor-${id}.csv`);
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
//           {/* Policy No */}
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Policy No
//             </label>
//             <input
//               type="text"
//               value={filterForm.policyNo}
//               onChange={(e) =>
//                 setFilterForm({ ...filterForm, policyNo: e.target.value })
//               }
//               placeholder="Enter Policy No..."
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
//             />
//           </div>

//           {/* Type */}
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Type</label>
//             <select
//               value={filterForm.type}
//               onChange={(e) =>
//                 setFilterForm({ ...filterForm, type: e.target.value })
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
//             >
//               <option value="all">All</option>
//               <option value="doctor">Doctor</option>
//               <option value="hospital">Hospital</option>
//             </select>
//           </div>

//           {/* Company */}
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Company</label>
//             <input
//               type="text"
//               value={filterForm.company}
//               onChange={(e) =>
//                 setFilterForm({ ...filterForm, company: e.target.value })
//               }
//               placeholder="Enter Company Name..."
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
//             />
//           </div>

//           {/* From Date (Start Date) */}
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

//           {/* To Date (Start Date) */}
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
//           Policies ({displayedPolicies.length})
//         </h3>

//         <div className="flex gap-3">
//           <button
//             onClick={handlePrint}
//             disabled={loading || allPolicies.length === 0}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Printer className="h-4 w-4" />
//             Print Report
//           </button>

//           <button
//             onClick={handleExportCSV}
//             disabled={displayedPolicies.length === 0}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
//           >
//             <Download className="h-4 w-4" />
//             Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto p-6">
//         {displayedPolicies.length > 0 ? (
//           <Table
//             data={displayedPolicies}
//             columns={columns}
//             pagination={true}
//             defaultPageSize={10}
//             excludeColumns={[
//               "_id",
//               "__v",
//               "createdAt",
//               "updatedAt",
//               "policyHistory",
//               "relatedSalesBillId",
//               "renewedFrom",
//               "renewedTo",
//               "paidBy",
//               "renewalStatus",
//               "renewalReminderSent",
//               "totalPremiumPaid",
//               "createdBy",
//               "documents",
//               "policyHolder",
//               "coverageAmount",
//               "status", // already in columns
//             ]}
//           />
//         ) : (
//           <div className="text-center py-12 text-gray-500 italic">
//             No policies found matching the filters.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



