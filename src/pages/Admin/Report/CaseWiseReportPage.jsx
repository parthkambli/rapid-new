// src/pages/CaseWiseReportPage.jsx
// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import Table from "../../../components/mainComponents/Table";
// import { Calendar, Download } from "lucide-react";
// import apiClient from "../../../services/apiClient";

// export default function CaseWiseReportPage() {
//   const [allCases, setAllCases] = useState([]); // ← all records (for summary)
//   const [filteredCases, setFilteredCases] = useState([]); // ← filtered for table & CSV
//   const [loading, setLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     advocate: "", // ← now free text (empty = all)
//     doctorName: "",
//     caseNo: "",
//     fromDate: "",
//     toDate: "",
//     caseType: "All Types",
//     caseStatus: "All Status",
//   });

//   // Helper to parse custom "DD/MM/YYYY, HH:mm" format
//   const parseCustomDate = (dateStr) => {
//     if (!dateStr || typeof dateStr !== "string") return null;

//     // Expected: "09/02/2026, 08:31"
//     const match = dateStr.match(
//       /^(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{2}):(\d{2})$/,
//     );
//     if (!match) return null;

//     const [_, dd, mm, yyyy, hh, min] = match;
//     // JavaScript months are 0-based → mm-1
//     // Create date with proper integer conversion
//     const date = new Date(
//       parseInt(yyyy),
//       parseInt(mm) - 1,
//       parseInt(dd),
//       parseInt(hh),
//       parseInt(min),
//     );
//     return isNaN(date.getTime()) ? null : date;
//   };

//   // Fetch ALL cases once on mount (no filters)
//   useEffect(() => {
//     const fetchAllCases = async () => {
//       setLoading(true);
//       try {
//         const res = await apiClient.get("/query-cases/list"); // no params
//         const raw = res.data.data || res.data || [];

//         const formatted = raw.map((c, index) => ({
//           caseId: c._id || c.caseId || `CASE-${index + 1}`,
//           caseNo: c.caseNo || "—",
//           doctor: c.doctor?.name || c.doctorName || "—",
//           type: c.type || c.caseType || "—",
//           stage: c.stage || c.currentStage || "—",
//           assigned: c.assignedDate
//             ? new Date(c.assignedDate).toLocaleDateString("en-GB")
//             : "—",
//           next:
//             c.nextHearing || c.nextDate
//               ? new Date(c.nextHearing || c.nextDate).toLocaleDateString(
//                   "en-GB",
//                 )
//               : "—",
//           status: c.status
//             ? c.status.charAt(0).toUpperCase() + c.status.slice(1)
//             : "Open",
//           // extra fields useful for client-side filtering
//           advocateName: c.advocate?.name || c.advocateName || "",
//           rawCreatedDate: parseCustomDate(c.createdAt), // ← fixed parsing
//         }));

//         setAllCases(formatted);
//         setFilteredCases(formatted); // initial view = all
//         toast.success("Report loaded");
//       } catch (err) {
//         console.error("Case report error:", err);
//         toast.error("Failed to load case wise report");
//         setAllCases([]);
//         setFilteredCases([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllCases();
//   }, []);

//   // Client-side filtering
//   const applyFilters = () => {
//     let result = [...allCases];

//     // Advocate (free text search)
//     if (filters.advocate.trim()) {
//       const term = filters.advocate.trim().toLowerCase();
//       result = result.filter((c) =>
//         (c.advocateName || "").toLowerCase().includes(term),
//       );
//     }

//     // Doctor Name
//     if (filters.doctorName.trim()) {
//       const term = filters.doctorName.trim().toLowerCase();
//       result = result.filter((c) =>
//         (c.doctor || "").toLowerCase().includes(term),
//       );
//     }

//     // Case No
//     if (filters.caseNo.trim()) {
//       const term = filters.caseNo.trim().toLowerCase();
//       result = result.filter((c) =>
//         (c.caseNo || "").toLowerCase().includes(term),
//       );
//     }

//     // From Date – based on createdAt
//     if (filters.fromDate) {
//       const from = new Date(filters.fromDate);
//       from.setHours(0, 0, 0, 0);
//       result = result.filter(
//         (c) => c.rawCreatedDate && c.rawCreatedDate >= from,
//       );
//     }

//     // To Date – based on createdAt
//     if (filters.toDate) {
//       const to = new Date(filters.toDate);
//       to.setHours(23, 59, 59, 999);
//       result = result.filter((c) => c.rawCreatedDate && c.rawCreatedDate <= to);
//     }

//     // Case Type
//     if (filters.caseType !== "All Types") {
//       const typeLower = filters.caseType.toLowerCase();
//       result = result.filter((c) => (c.type || "").toLowerCase() === typeLower);
//     }

//     // Case Status
//     if (filters.caseStatus !== "All Status") {
//       const statusLower = filters.caseStatus.toLowerCase();
//       result = result.filter(
//         (c) => (c.status || "").toLowerCase() === statusLower,
//       );
//     }

//     setFilteredCases(result);
//   };

//   const handleGenerate = () => {
//     applyFilters();
//   };

//   const handleReset = () => {
//     setFilters({
//       advocate: "",
//       doctorName: "",
//       caseNo: "",
//       fromDate: "",
//       toDate: "",
//       caseType: "All Types",
//       caseStatus: "All Status",
//     });
//     setFilteredCases(allCases); // show all again
//   };

//   const handleFilterChange = (field, value) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   // CSV Export – uses filtered data (same as table)
//   const handleDownloadCSV = () => {
//     if (filteredCases.length === 0) {
//       toast.warn("No data to export");
//       return;
//     }

//     const headers = [
//       "Case ID",
//       "Case No",
//       "Doctor",
//       "Type",
//       "Stage",
//       "Assigned",
//       "Next",
//       "Status",
//     ];

//     const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;

//     const rows = filteredCases.map((c) =>
//       [
//         escape(c.caseId),
//         escape(c.caseNo),
//         escape(c.doctor),
//         escape(c.type),
//         escape(c.stage),
//         escape(c.assigned),
//         escape(c.next),
//         escape(c.status),
//       ].join(","),
//     );

//     const csvContent = [headers.join(","), ...rows].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `case-wise-report-${new Date().toISOString().split("T")[0]}.csv`,
//     );
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);

//     toast.success("CSV downloaded");
//   };

//   // Summary cards — always based on ALL data (not filtered)
//   const openCases = allCases.filter(
//     (c) => (c.status || "").toLowerCase() === "open",
//   ).length;

//   const closedCases = allCases.filter(
//     (c) => (c.status || "").toLowerCase() === "closed",
//   ).length;

//   const totalCases = allCases.length;

//   const columns = [
//     {
//       header: "Case ID",
//       render: (r) => (
//         <span className="text-blue-700 font-medium">{r.caseId}</span>
//       ),
//     },
//     { header: "Case No", render: (r) => r.caseNo },
//     { header: "Doctor", render: (r) => r.doctor },
//     { header: "Type", render: (r) => r.type },
//     { header: "Stage", render: (r) => r.stage },
//     { header: "Assigned", render: (r) => r.assigned },
//     { header: "Next", render: (r) => r.next },
//     {
//       header: "Status",
//       render: (r) => (
//         <span
//           className={`font-medium ${
//             r.status === "Open" ? "text-green-700" : "text-red-700"
//           }`}
//         >
//           {r.status}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">
//         Case Wise Report
//       </h1>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
//           {/* <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Advocate Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter advocate name"
//               value={filters.advocate}
//               onChange={(e) => handleFilterChange("advocate", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
//             />
//           </div> */}

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Doctor Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter doctor name"
//               value={filters.doctorName}
//               onChange={(e) => handleFilterChange("doctorName", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
//             />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Case No</label>
//             <input
//               type="text"
//               placeholder="Enter case no (eg. C-2025-001)"
//               value={filters.caseNo}
//               onChange={(e) => handleFilterChange("caseNo", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
//             />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               From Date
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 value={filters.fromDate}
//                 onChange={(e) => handleFilterChange("fromDate", e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               />
//               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">To Date</label>
//             <div className="relative">
//               <input
//                 type="date"
//                 value={filters.toDate}
//                 onChange={(e) => handleFilterChange("toDate", e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-teal-400"
//               />
//               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Case Type
//             </label>
//             <select
//               value={filters.caseType}
//               onChange={(e) => handleFilterChange("caseType", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
//             >
//               <option>All Types</option>
//               {/* <option>Medico-legal</option> */}
//               <option>Civil</option>
//               <option>Consumer</option>
//               <option>Criminal</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Case Status
//             </label>
//             <select
//               value={filters.caseStatus}
//               onChange={(e) => handleFilterChange("caseStatus", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
//             >
//               <option>All Status</option>
//               <option>Open</option>
//               <option>Closed</option>
//               {/* <option>Pending</option> */}
//             </select>
//           </div>

//           <div className="flex items-end gap-3 md:justify-end">
//             <button
//               onClick={handleGenerate}
//               disabled={loading}
//               className=" px-8 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800 disabled:opacity-60 transition"
//             >
//               {loading ? "Loading..." : "Apply Filters"}
//             </button>

//             <button
//               onClick={handleDownloadCSV}
//               disabled={loading || filteredCases.length === 0}
//               className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
//             >
//               <Download size={16} />
//               Download CSV
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Summary Cards — always show totals from ALL cases */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
//         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 text-center">
//           <p className="text-lg font-semibold text-gray-700">Open Cases</p>
//           <p className="text-3xl font-bold text-green-700 mt-2">{openCases}</p>
//         </div>

//         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 text-center">
//           <p className="text-lg font-semibold text-gray-700">Closed Cases</p>
//           <p className="text-3xl font-bold text-red-700 mt-2">{closedCases}</p>
//         </div>

//         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 text-center">
//           <p className="text-lg font-semibold text-gray-700">Total Cases</p>
//           <p className="text-3xl font-bold text-gray-900 mt-2">{totalCases}</p>
//         </div>
//       </div>

//       {/* Main Table with built-in pagination */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <div className="p-6">
//           {loading ? (
//             <div className="text-center py-12 text-gray-500">
//               Loading cases...
//             </div>
//           ) : filteredCases.length === 0 ? (
//             <div className="text-center py-12 text-gray-500 italic">
//               No cases found for the selected filters
//             </div>
//           ) : (
//             <Table
//               data={filteredCases}
//               columns={columns}
//               pagination={true}
//               defaultPageSize={10}
//               showSrNo={false}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// src/pages/CaseWiseReportPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Table from "../../../components/mainComponents/Table";
import { Calendar, Download, RotateCcw } from "lucide-react";
import apiClient from "../../../services/apiClient";
import Select from "react-select"; // ← added

export default function CaseWiseReportPage() {
  const [allCases, setAllCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    advocate: "",
    doctorName: "",
    caseNo: "",
    fromDate: "",
    toDate: "",
    caseType: "All Types",
    caseStatus: "All Status",
  });

  // ────────────────────────────────────────────────
  // Prepare dropdown options (only once when allCases changes)
  // ────────────────────────────────────────────────
  const doctorOptions = useMemo(() => {
    const uniqueDoctors = [...new Set(allCases.map((c) => c.doctor).filter(Boolean))];
    return uniqueDoctors.map((name) => ({
      value: name,
      label: name,
    }));
  }, [allCases]);

  const caseNoOptions = useMemo(() => {
    const uniqueCaseNos = [...new Set(allCases.map((c) => c.caseNo).filter(Boolean))];
    return uniqueCaseNos.map((no) => ({
      value: no,
      label: no,
    }));
  }, [allCases]);

  // Helper to parse custom "DD/MM/YYYY, HH:mm" format
  const parseCustomDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return null;

    const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{2}):(\d{2})$/);
    if (!match) return null;

    const [_, dd, mm, yyyy, hh, min] = match;
    const date = new Date(
      parseInt(yyyy),
      parseInt(mm) - 1,
      parseInt(dd),
      parseInt(hh),
      parseInt(min),
    );
    return isNaN(date.getTime()) ? null : date;
  };

  // Fetch ALL cases once on mount
  useEffect(() => {
    const fetchAllCases = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/query-cases/list");
        const raw = res.data.data || res.data || [];

        const formatted = raw.map((c, index) => ({
          caseId: c._id || c.caseId || `CASE-${index + 1}`,
          caseNo: c.caseNo || "—",
          doctor: c.doctor?.name || c.doctorName || "—",
          type: c.type || c.caseType || "—",
          stage: c.stage || c.currentStage || "—",
          assigned: c.assignedDate
            ? new Date(c.assignedDate).toLocaleDateString("en-GB")
            : "—",
          next:
            c.nextHearing || c.nextDate
              ? new Date(c.nextHearing || c.nextDate).toLocaleDateString("en-GB")
              : "—",
          status: c.status
            ? c.status.charAt(0).toUpperCase() + c.status.slice(1)
            : "Open",
          advocateName: c.advocate?.name || c.advocateName || "",
          rawCreatedDate: parseCustomDate(c.createdAt),
        }));

        setAllCases(formatted);
        setFilteredCases(formatted);
        toast.success("Report loaded");
      } catch (err) {
        console.error("Case report error:", err);
        toast.error("Failed to load case wise report");
        setAllCases([]);
        setFilteredCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCases();
  }, []);

  const applyFilters = () => {
    let result = [...allCases];

    if (filters.advocate.trim()) {
      const term = filters.advocate.trim().toLowerCase();
      result = result.filter((c) =>
        (c.advocateName || "").toLowerCase().includes(term),
      );
    }

    // Doctor Name – exact match from dropdown (or partial if cleared)
    if (filters.doctorName) {
      const term = filters.doctorName.toLowerCase();
      result = result.filter((c) => (c.doctor || "").toLowerCase() === term);
    }

    // Case No – exact match from dropdown
    if (filters.caseNo) {
      const term = filters.caseNo.toLowerCase();
      result = result.filter((c) => (c.caseNo || "").toLowerCase() === term);
    }

    if (filters.fromDate) {
      const from = new Date(filters.fromDate);
      from.setHours(0, 0, 0, 0);
      result = result.filter((c) => c.rawCreatedDate && c.rawCreatedDate >= from);
    }

    if (filters.toDate) {
      const to = new Date(filters.toDate);
      to.setHours(23, 59, 59, 999);
      result = result.filter((c) => c.rawCreatedDate && c.rawCreatedDate <= to);
    }

    if (filters.caseType !== "All Types") {
      const typeLower = filters.caseType.toLowerCase();
      result = result.filter((c) => (c.type || "").toLowerCase() === typeLower);
    }

    if (filters.caseStatus !== "All Status") {
      const statusLower = filters.caseStatus.toLowerCase();
      result = result.filter((c) => (c.status || "").toLowerCase() === statusLower);
    }

    setFilteredCases(result);
  };

  const handleGenerate = () => {
    applyFilters();
  };

  const handleReset = () => {
    setFilters({
      advocate: "",
      doctorName: "",
      caseNo: "",
      fromDate: "",
      toDate: "",
      caseType: "All Types",
      caseStatus: "All Status",
    });
    setFilteredCases(allCases);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDoctorSelect = (option) => {
    handleFilterChange("doctorName", option ? option.value : "");
  };

  const handleCaseNoSelect = (option) => {
    handleFilterChange("caseNo", option ? option.value : "");
  };

  const handleDownloadCSV = () => {
    if (filteredCases.length === 0) {
      toast.warn("No data to export");
      return;
    }

    const headers = [
      "Case ID",
      "Case No",
      "Doctor",
      "Type",
      "Stage",
      "Assigned",
      "Next",
      "Status",
    ];

    const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;

    const rows = filteredCases.map((c) =>
      [
        escape(c.caseId),
        escape(c.caseNo),
        escape(c.doctor),
        escape(c.type),
        escape(c.stage),
        escape(c.assigned),
        escape(c.next),
        escape(c.status),
      ].join(","),
    );

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `case-wise-report-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CSV downloaded");
  };

  const openCases = allCases.filter((c) => (c.status || "").toLowerCase() === "open").length;
  const closedCases = allCases.filter((c) => (c.status || "").toLowerCase() === "closed").length;
  const totalCases = allCases.length;

  const columns = [
    { header: "Case ID", render: (r) => <span className="text-blue-700 font-medium">{r.caseId}</span> },
    { header: "Case No", render: (r) => r.caseNo },
    { header: "Doctor", render: (r) => r.doctor },
    { header: "Type", render: (r) => r.type },
    { header: "Stage", render: (r) => r.stage },
    { header: "Assigned", render: (r) => r.assigned },
    { header: "Next", render: (r) => r.next },
    {
      header: "Status",
      render: (r) => (
        <span
          className={`font-medium ${
            r.status === "Open" ? "text-green-700" : "text-red-700"
          }`}
        >
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Case Wise Report</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Doctor Name</label>
            <Select
              isClearable
              placeholder="Select or type doctor name..."
              options={doctorOptions}
              value={doctorOptions.find((opt) => opt.value === filters.doctorName) || null}
              onChange={handleDoctorSelect}
              className="text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#d1d5db",
                  minHeight: "38px",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#14b8a6" },
                }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Case No</label>
            <Select
              isClearable
              placeholder="Select or type case number..."
              options={caseNoOptions}
              value={caseNoOptions.find((opt) => opt.value === filters.caseNo) || null}
              onChange={handleCaseNoSelect}
              className="text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#d1d5db",
                  minHeight: "38px",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#14b8a6" },
                }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">From Date</label>
            <div className="relative">
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">To Date</label>
            <div className="relative">
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────
            The rest of the component remains 100% unchanged
        ──────────────────────────────────────────────── */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Case Type</label>
            <select
              value={filters.caseType}
              onChange={(e) => handleFilterChange("caseType", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option>All Types</option>
              <option>Civil</option>
              <option>Consumer</option>
              <option>Criminal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Case Status</label>
            <select
              value={filters.caseStatus}
              onChange={(e) => handleFilterChange("caseStatus", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option>All Status</option>
              <option>Open</option>
              <option>Closed</option>
            </select>
          </div>

          <div className="flex items-end gap-3 md:justify-end flex-wrap">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-8 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800 disabled:opacity-60 transition"
            >
              {loading ? "Loading..." : "Apply Filters"}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition disabled:opacity-60"
            >
              <RotateCcw size={16} />
              Reset Filters
            </button>

            <button
              onClick={handleDownloadCSV}
              disabled={loading || filteredCases.length === 0}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
            >
              <Download size={16} />
              Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-lg font-semibold text-gray-700">Open Cases</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{openCases}</p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-lg font-semibold text-gray-700">Closed Cases</p>
          <p className="text-3xl font-bold text-red-700 mt-2">{closedCases}</p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-lg font-semibold text-gray-700">Total Cases</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalCases}</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading cases...</div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-12 text-gray-500 italic">
              No cases found for the selected filters
            </div>
          ) : (
            <Table
              data={filteredCases}
              columns={columns}
              pagination={true}
              defaultPageSize={10}
              showSrNo={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}