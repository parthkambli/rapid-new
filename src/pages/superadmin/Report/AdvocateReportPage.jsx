// // // src/pages/AdvocateReportPage.jsx
// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { toast } from 'react-toastify';
// // import Table from '../../../components/mainComponents/Table';
// // import { Calendar, Printer, Download } from 'lucide-react';
// // import apiClient, { apiEndpoints } from '../../../services/apiClient';

// // const advocateData = [
// //   {
// //     srNo: 1,
// //     advocateId: "ADV-002",
// //     name: "Adv. Meera Patel",
// //     specialization: "Civil",
// //     enrollmentNo: "BC-1020",
// //     experience: 5,
// //     casesAssigned: 18,
// //     casesClosed: 12,
// //     totalPayment: 42000,
// //     status: "Active",
// //   },
// // ];

// // const totals = {
// //   totalAdvocates: 1,
// //   casesAssigned: 18,
// //   casesClosed: 12,
// //   totalPayments: 42000,
// // };

// // // COLUMNS: Baaki sab
// // const columns = [
// //   { header: "SR No.", accessor: "srNo", render: (v) => <span className="text-gray-700">{v}</span> },
// //   { header: "Advocate ID", accessor: "advocateId", render: (v) => <span className="text-gray-700 font-medium">{v}</span> },
// //   { header: "Name", accessor: "name", render: (v) => <span className="text-gray-700">{v}</span> },
// //   { header: "Specialization", accessor: "specialization", render: (v) => <span className="text-gray-700">{v}</span> },
// //   { header: "Enrollment No", accessor: "enrollmentNo", render: (v) => <span className="text-gray-700">{v}</span> },
// //   { header: "Experience (yrs)", accessor: "experience", render: (v) => <span className="text-gray-700">{v}</span> },
// //   { header: "Cases Assigned", accessor: "casesAssigned", render: (v) => <span className="text-gray-700 font-medium">{v}</span> },
// //   { header: "Cases Closed", accessor: "casesClosed", render: (v) => <span className="text-gray-700 font-medium">{v}</span> },
// //   { header: "Total Payment", accessor: "totalPayment", render: (v) => <span className="text-gray-700 font-medium">₹{v.toLocaleString()}</span> },
// //   {
// //     header: "Status",
// //     accessor: "status",
// //     render: (v) => (
// //       <span className={`text-sm font-medium ${v === "Active" ? "text-green-800" : "text-red-800"}`}>
// //         {v}
// //       </span>
// //     ),
// //   },
// // ];

// // // EXTRA COLUMNS: Sirf Action Buttons
// // const extraColumns = [
// //   {
// //     header: "Action",
// //     render: (row) => (
// //       <div className="flex gap-2 justify-center">
// //         <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
// //           View
// //         </button>
// //         <button className="px-3 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700">
// //           Edit
// //         </button>
// //       </div>
// //     ),
// //   },
// // ];

// // export default function AdvocateReportPage() {
// //   const navigate = useNavigate();
// //   const [advocateData, setAdvocateData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [filters, setFilters] = useState({
// //     dateFrom: '',
// //     dateTo: ''
// //   });

// //   const fetchAdvocateReports = async () => {
// //     setLoading(true);
// //     try {
// //       const params = {};
// //       if (filters.dateFrom) params.dateFrom = filters.dateFrom;
// //       if (filters.dateTo) params.dateTo = filters.dateTo;

// //       const response = await apiClient.get(apiEndpoints.reports.advocates, { params });
// //       // Transform aggregated data to individual advocate records
// //       const transformedData = transformAggregatedData(response.data.data || []);
// //       setAdvocateData(transformedData);
// //     } catch (error) {
// //       console.error('Error fetching advocate reports:', error);
// //       toast.error('Failed to fetch advocate reports');
// //       setAdvocateData([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const transformAggregatedData = (aggregatedData) => {
// //     const advocates = [];
// //     let srNo = 1;

// //     aggregatedData.forEach(group => {
// //       if (group.advocates && group.advocates.length > 0) {
// //         group.advocates.forEach(advocate => {
// //           advocates.push({
// //             srNo: srNo++,
// //             advocateId: `ADV-${String(srNo - 1).padStart(3, '0')}`,
// //             name: advocate.fullName || 'Unknown Advocate',
// //             specialization: advocate.specialization || 'General',
// //             enrollmentNo: advocate.enrollmentNo || 'N/A',
// //             experience: group.avgExperience || 0,
// //             casesAssigned: advocate.totalCases || 0,
// //             casesClosed: advocate.successfulCases || 0,
// //             totalPayment: 0, // This would need to be calculated from payment records
// //             status: group.status || 'Active'
// //           });
// //         });
// //       }
// //     });

// //     return advocates;
// //   };

// //   useEffect(() => {
// //     fetchAdvocateReports();
// //   }, []);

// //   const calculateTotals = (advocates) => {
// //     return {
// //       totalAdvocates: advocates.length,
// //       casesAssigned: advocates.reduce((sum, adv) => sum + (adv.casesAssigned || 0), 0),
// //       casesClosed: advocates.reduce((sum, adv) => sum + (adv.casesClosed || 0), 0),
// //       totalPayments: advocates.reduce((sum, adv) => sum + (adv.totalPayment || 0), 0),
// //     };
// //   };

// //   return (
// //     <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
// //       <h1 className="text-2xl font-bold text-gray-900 mb-6">Advocate Report</h1>

// //       {/* Filters */}
// //       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
// //         <div className="grid grid-cols-4 gap-3 mb-3">
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search By Advocate</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>All</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Sort by Case</label>
// //             <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700" />
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Sort by Date</label>
// //             <div className="relative">
// //               <input type="text" placeholder="To Date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 pr-10" />
// //               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
// //             </div>
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1 opacity-0">.</label>
// //             <div className="relative">
// //               <input type="text" placeholder="From Date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 pr-10" />
// //               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
// //             </div>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-4 gap-3">
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search By Specific Name</label>
// //             <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700" />
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Sort by Status</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>Pending</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search By Month</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>March</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search By Year</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>2026</option>
// //             </select>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Apply / Reset */}
// //       <div className="flex justify-end gap-2 mb-4">
// //         <button className="px-6 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800">
// //           Apply
// //         </button>
// //         <button className="px-6 py-2 border border-gray-300 rounded bg-white text-sm font-medium hover:bg-gray-50">
// //           Reset
// //         </button>
// //       </div>

// //       {/* Summary */}
// //       <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
// //         {(() => {
// //           const totals = calculateTotals(advocateData);
// //           return (
// //         <div className="grid grid-cols-4 gap-6 text-sm">
// //           <div>
// //             <span className="text-gray-600">Total Advocates:</span>
// //             <span className="ml-2 font-bold text-gray-900">{totals.totalAdvocates}</span>
// //           </div>
// //           <div>
// //             <span className="text-gray-600">Cases Assigned:</span>
// //             <span className="ml-2 font-bold text-gray-900">{totals.casesAssigned}</span>
// //           </div>
// //           <div>
// //             <span className="text-gray-600">Cases Closed:</span>
// //             <span className="ml-2 font-bold text-gray-900">{totals.casesClosed}</span>
// //           </div>
// //           <div>
// //             <span className="text-gray-600">Total Payments:</span>
// //             <span className="ml-2 font-bold text-gray-900">₹{totals.totalPayments.toLocaleString()}</span>
// //           </div>
// //         </div>
// //           );
// //         })()}
// //       </div>

// //       {/* Table + Print/Export */}
// //       <div className="bg-white rounded-lg shadow-sm">
// //         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
// //           <div></div>
// //           <div className="flex gap-2">
// //             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
// //               <Printer className="h-4 w-4" />
// //               Print
// //             </button>
// //             <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700">
// //               <Download className="h-4 w-4" />
// //               Export
// //             </button>
// //           </div>
// //         </div>

// //         <div className="p-6">
// //           <Table data={advocateData} columns={columns} extraColumns={extraColumns} />

// //           {/* Total Row */}
// //           {(() => {
// //             const totals = calculateTotals(advocateData);
// //             return (
// //           <div className="mt-4 border-t border-gray-200 pt-3">
// //             <div className="grid grid-cols-11 text-sm font-bold text-gray-900">
// //               <div className="col-span-6 text-right pr-4">Totals (selected):</div>
// //               <div className="col-span-1">{totals.casesAssigned}</div>
// //               <div className="col-span-1">{totals.casesClosed}</div>
// //               <div className="col-span-1">₹{totals.totalPayments.toLocaleString()}</div>
// //               <div className="col-span-2"></div>
// //             </div>
// //           </div>
// //             );
// //           })()}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState } from "react";
// import { Calendar, Download } from "lucide-react";

// export default function AdvocateReportPage() {
//   const [filters, setFilters] = useState({
//     caseNo: "",
//     doctor: "",
//     caseType: "All",
//     status: "All",
//     from: "",
//     to: "",
//   });

//   const cases = [
//     {
//       caseId: "CASE-2025-001",
//       caseNo: "101",
//       doctor: "Dr. Sharma",
//       type: "Medico-legal",
//       stage: "Notice Sent",
//       assigned: "2025-09-01",
//       next: "2025-09-11",
//       status: "Open",
//     },
//     {
//       caseId: "CASE-2025-002",
//       caseNo: "102",
//       doctor: "Dr. Priya",
//       type: "Civil",
//       stage: "Filing",
//       assigned: "2025-09-05",
//       next: "2025-09-15",
//       status: "Open",
//     },
//     {
//       caseId: "CASE-2025-003",
//       caseNo: "103",
//       doctor: "Dr. Kavita",
//       type: "Consumer",
//       stage: "Judgment",
//       assigned: "2025-07-20",
//       next: "-",
//       status: "Closed",
//     },
//     {
//       caseId: "CASE-2025-004",
//       caseNo: "104",
//       doctor: "Dr. Nisha",
//       type: "Medico-legal",
//       stage: "Hearing",
//       assigned: "2025-08-11",
//       next: "2025-09-01",
//       status: "Open",
//     },
//   ];

//   const openCases = cases.filter(c => c.status === "Open").length;
//   const closedCases = cases.filter(c => c.status === "Closed").length;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen max-w-[79vw]">
//       <h1 className="text-xl font-bold mb-4">Report</h1>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
//         <div className="grid grid-cols-6 gap-3 mb-3">
//           <input
//             placeholder="Enter Case No (eg. CASE-2025-001)"
//             className="border px-3 py-2 rounded text-sm"
//           />
//           <input
//             placeholder="Doctor name"
//             className="border px-3 py-2 rounded text-sm"
//           />
//           <select className="border px-3 py-2 rounded text-sm">
//             <option>All</option>
//             <option>Medico-legal</option>
//             <option>Civil</option>
//             <option>Consumer</option>
//           </select>
//           <select className="border px-3 py-2 rounded text-sm">
//             <option>All</option>
//             <option>Open</option>
//             <option>Closed</option>
//           </select>

//           <div className="relative">
//             <input
//               placeholder="dd / mm / yyyy"
//               className="border px-3 py-2 rounded text-sm w-full pr-10"
//             />
//             <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
//           </div>

//           <div className="relative">
//             <input
//               placeholder="dd / mm / yyyy"
//               className="border px-3 py-2 rounded text-sm w-full pr-10"
//             />
//             <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <button className="bg-teal-700 text-white px-6 py-2 rounded text-sm">
//             Generate
//           </button>
//           <button className="border px-6 py-2 rounded text-sm flex items-center gap-2">
//             <Download className="h-4 w-4" />
//             Download CSV
//           </button>
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="grid grid-cols-3 gap-4 mb-4">
//         <div className="bg-white p-4 rounded shadow text-center">
//           <p className="text-gray-500 text-sm">Open Cases</p>
//           <p className="text-xl font-bold">{openCases}</p>
//         </div>
//         <div className="bg-white p-4 rounded shadow text-center">
//           <p className="text-gray-500 text-sm">Closed Cases</p>
//           <p className="text-xl font-bold">{closedCases}</p>
//         </div>
//         <div className="bg-white p-4 rounded shadow text-center">
//           <p className="text-gray-500 text-sm">Total Cases</p>
//           <p className="text-xl font-bold">{cases.length}</p>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded shadow-sm overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100 text-gray-700">
//             <tr>
//               <th className="px-4 py-2 text-left">Case ID</th>
//               <th className="px-4 py-2">Case No</th>
//               <th className="px-4 py-2">Doctor</th>
//               <th className="px-4 py-2">Type</th>
//               <th className="px-4 py-2">Stage</th>
//               <th className="px-4 py-2">Assigned</th>
//               <th className="px-4 py-2">Next</th>
//               <th className="px-4 py-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {cases.map((c, i) => (
//               <tr key={i} className="border-t">
//                 <td className="px-4 py-2">{c.caseId}</td>
//                 <td className="px-4 py-2">{c.caseNo}</td>
//                 <td className="px-4 py-2">{c.doctor}</td>
//                 <td className="px-4 py-2">{c.type}</td>
//                 <td className="px-4 py-2">{c.stage}</td>
//                 <td className="px-4 py-2">{c.assigned}</td>
//                 <td className="px-4 py-2">{c.next}</td>
//                 <td className="px-4 py-2">
//                   <span
//                     className={`px-2 py-1 rounded text-xs ${
//                       c.status === "Open"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-gray-200 text-gray-700"
//                     }`}
//                   >
//                     {c.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }









// src/pages/AdvocateReportPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import Table from "../../../components/mainComponents/Table";
import { Download, Calendar, Printer } from "lucide-react";
import apiClient from "../../../services/apiClient";

export default function AdvocateReportPage() {
  const navigate = useNavigate();

  const [allAdvocates, setAllAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    searchByAdvocate: "",
    fromDate: "",
    toDate: "",
    sortByStatus: "",
    filterBySpecialization: "",
  });

  const buildQueryParams = () => {
    const params = {
      limit: 0, // all records
    };

    if (filters.sortByStatus) {
      params.status = filters.sortByStatus;
    }

    if (filters.filterBySpecialization.trim()) {
      params.specialization = filters.filterBySpecialization.trim();
    }

    return params;
  };

  const fetchAdvocates = async () => {
    setLoading(true);
    try {
      const params = buildQueryParams();
      const res = await apiClient.get("/advocates", { params });
      const raw = res.data.data || [];

      const flat = raw.map((adv, i) => ({
        srNo: i + 1,
        id: adv._id,
        advocateId: adv.advocateId || "N/A",
        name: adv.fullName || "N/A",
        specialization: adv.specialization || [],
        enrollmentNo: adv.barCouncilNumber || adv.enrollmentNo || "N/A",
        experience: adv.experience || 0,
        casesAssigned: Number(adv.assignedCases?.length || 0),
        casesClosed: Number(adv.successfulCases || 0),
        totalPayment: 0, // adjust if payment data becomes available
        status: adv.status
          ? adv.status.charAt(0).toUpperCase() + adv.status.slice(1)
          : "N/A",
        rawCreatedDate: adv.createdAt || null,
      }));

      setAllAdvocates(flat);
      const filtered = applyClientFilters(flat);
      setFilteredAdvocates(filtered);
    } catch (err) {
      console.error("Fetch advocates error:", err);
      toast.error("Failed to load advocate report");
      setAllAdvocates([]);
      setFilteredAdvocates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocates();
  }, [filters.sortByStatus, filters.filterBySpecialization]);

  const applyClientFilters = (data) => {
    let result = [...data];

    if (filters.searchByAdvocate.trim()) {
      const term = filters.searchByAdvocate.trim().toLowerCase();
      result = result.filter((adv) =>
        adv.name?.toLowerCase().includes(term)
      );
    }

    if (filters.fromDate) {
      const from = new Date(filters.fromDate);
      from.setHours(0, 0, 0, 0);
      result = result.filter(
        (adv) => adv.rawCreatedDate && new Date(adv.rawCreatedDate) >= from
      );
    }

    if (filters.toDate) {
      const to = new Date(filters.toDate);
      to.setHours(23, 59, 59, 999);
      result = result.filter(
        (adv) => adv.rawCreatedDate && new Date(adv.rawCreatedDate) <= to
      );
    }

    return result;
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    const filtered = applyClientFilters(allAdvocates);
    setFilteredAdvocates(filtered);
  };

  const handleResetFilters = () => {
    setFilters({
      searchByAdvocate: "",
      fromDate: "",
      toDate: "",
      sortByStatus: "",
      filterBySpecialization: "",
    });
    setFilteredAdvocates([...allAdvocates]);
  };

  const totals = {
    totalAdvocates: filteredAdvocates.length,
    casesAssigned: filteredAdvocates.reduce((sum, a) => sum + a.casesAssigned, 0),
    casesClosed: filteredAdvocates.reduce((sum, a) => sum + a.casesClosed, 0),
    totalPayments: filteredAdvocates.reduce((sum, a) => sum + a.totalPayment, 0),
  };

  const escapeCsv = (value) => {
    let str = Array.isArray(value)
      ? value.join(", ")
      : value != null
      ? String(value)
      : "";
    str = str.replace(/"/g, '""').replace(/\n/g, " ");
    return `"${str}"`;
  };

  const handleExportCSV = () => {
    if (filteredAdvocates.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "SR No.",
      "Advocate ID",
      "Name",
      "Specialization",
      "Enrolment No.",
      "Experience (yrs)",
      "Cases Assigned",
      "Cases Closed",
      "Total Payment",
      "Status",
    ];

    const csvRows = filteredAdvocates.map((a) =>
      [
        a.srNo,
        escapeCsv(a.advocateId),
        escapeCsv(a.name),
        escapeCsv(a.specialization),
        escapeCsv(a.enrollmentNo),
        a.experience,
        a.casesAssigned,
        a.casesClosed,
        a.totalPayment,
        escapeCsv(a.status),
      ].join(",")
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `advocate-report-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  // ────────────────────────────────────────────────
  //  PRINT using hidden iframe (same style as other reports)
  // ────────────────────────────────────────────────
  const handlePrint = () => {
    if (filteredAdvocates.length === 0) {
      toast.error("No data to print");
      return;
    }

    const isFiltered =
      filters.searchByAdvocate ||
      filters.fromDate ||
      filters.toDate ||
      filters.sortByStatus ||
      filters.filterBySpecialization;

    const title = isFiltered
      ? "Advocate Report – Filtered"
      : "Advocate Report – All Advocates";

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
            text-align: center;
            font-weight: bold;
            font-size: 11.5pt;
          }
          @media print {
            body { padding: 12mm; margin: 0; }
          }
        </style>
      </head>
      <body>
        <h1>Advocate Report</h1>
        <div class="subtitle">
          ${isFiltered ? "Filtered View" : "All Advocates"} • 
          ${new Date().toLocaleDateString("en-IN")}
        </div>

        <table>
          <thead>
            <tr>
              <th>SR</th>
              <th>Advocate ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Enrolment No.</th>
              <th>Exp (yrs)</th>
              <th>Assigned</th>
              <th>Closed</th>
              <th class="amount">Payment (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredAdvocates
              .map(
                (a) => `
              <tr>
                <td style="text-align:center;">${a.srNo}</td>
                <td>${a.advocateId || "—"}</td>
                <td>${a.name || "—"}</td>
                <td>${Array.isArray(a.specialization) ? a.specialization.join(", ") : a.specialization || "—"}</td>
                <td>${a.enrollmentNo || "—"}</td>
                <td style="text-align:center;">${a.experience}</td>
                <td style="text-align:center;">${a.casesAssigned}</td>
                <td style="text-align:center;">${a.casesClosed}</td>
                <td class="amount">${a.totalPayment.toLocaleString("en-IN")}</td>
                <td>${a.status}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          Total Advocates: ${totals.totalAdvocates}  
              |     Cases Assigned: ${totals.casesAssigned}  
              |     Cases Closed: ${totals.casesClosed}  
              |     Total Payments: ₹${totals.totalPayments.toLocaleString("en-IN")}
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
      console.error("Could not access print iframe");
      if (document.body.contains(printFrame)) {
        document.body.removeChild(printFrame);
      }
      toast.error("Print preparation failed");
    }
  };

  // Prepare options for React-Select
  const advocateOptions = allAdvocates
    .map((adv) => ({
      value: adv.name,
      label: adv.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const columns = [
    { header: "SR No", render: (r) => r.srNo },
    { header: "Advocate ID", render: (r) => r.advocateId },
    { header: "Name", render: (r) => r.name },
    {
      header: "Specialization",
      render: (r) =>
        Array.isArray(r.specialization)
          ? r.specialization.join(", ")
          : r.specialization || "N/A",
    },
    { header: "Enrolment No.", render: (r) => r.enrollmentNo },
    { header: "Experience (yrs)", render: (r) => r.experience },
    { header: "Cases Assigned", render: (r) => r.casesAssigned },
    { header: "Cases Closed", render: (r) => r.casesClosed },
    {
      header: "Total Payment",
      render: (r) => `₹${r.totalPayment.toLocaleString("en-IN")}`,
    },
    {
      header: "Status",
      render: (r) => (
        <span
          className={r.status === "Active" ? "text-green-600" : "text-red-600"}
        >
          {r.status}
        </span>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/advocate/${row.id}`)}
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-[90vw] mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Advocate Report</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Search by Advocate
            </label>
            <Select
              isClearable
              isSearchable
              placeholder="Type advocate name..."
              value={
                filters.searchByAdvocate
                  ? { value: filters.searchByAdvocate, label: filters.searchByAdvocate }
                  : null
              }
              options={advocateOptions}
              onChange={(option) =>
                handleFilterChange("searchByAdvocate", option ? option.value : "")
              }
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">From Date</label>
            <div className="relative">
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
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
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Status</label>
            <select
              value={filters.sortByStatus}
              onChange={(e) => handleFilterChange("sortByStatus", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Specialization</label>
            <select
              value={filters.filterBySpecialization}
              onChange={(e) =>
                handleFilterChange("filterBySpecialization", e.target.value)
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
            >
              <option value="">All</option>
              <option value="Civil">Civil</option>
              <option value="Consumer">Consumer</option>
              <option value="Criminal">Criminal</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleResetFilters}
            className="px-8 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
            disabled={loading}
          >
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-8 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800"
            disabled={loading}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm font-medium text-gray-700">
          <div>
            Total Advocates:{" "}
            <span className="font-bold text-gray-900">{totals.totalAdvocates}</span>
          </div>
          <div>
            Cases Assigned:{" "}
            <span className="font-bold text-gray-900">{totals.casesAssigned}</span>
          </div>
          <div>
            Cases Closed:{" "}
            <span className="font-bold text-gray-900">{totals.casesClosed}</span>
          </div>
          <div>
            Total Payments:{" "}
            <span className="font-bold text-gray-900">
              ₹{totals.totalPayments.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mb-5">
        <button
          onClick={handlePrint}
          disabled={loading || filteredAdvocates.length === 0}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <Printer size={16} />
          Print Report
        </button>
        <button
          onClick={handleExportCSV}
          disabled={loading || filteredAdvocates.length === 0}
          className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading advocates...</div>
        ) : filteredAdvocates.length === 0 ? (
          <div className="p-12 text-center text-gray-500 italic">
            No advocates match the selected filters
          </div>
        ) : (
          <Table
            data={filteredAdvocates}
            columns={columns}
            pagination={true}
            defaultPageSize={10}
            showSrNo={false}
          />
        )}
      </div>
    </div>
  );
}












// // src/pages/AdvocateReportPage.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import Select from "react-select"; // ← added
// import Table from "../../../components/mainComponents/Table";
// import { Download, Calendar, Printer } from "lucide-react";
// import apiClient from "../../../services/apiClient";

// export default function AdvocateReportPage() {
//   const navigate = useNavigate();

//   const [allAdvocates, setAllAdvocates] = useState([]);
//   const [filteredAdvocates, setFilteredAdvocates] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     searchByAdvocate: "", // will store the selected name string
//     fromDate: "",
//     toDate: "",
//     sortByStatus: "",
//     filterBySpecialization: "",
//   });

//   const buildQueryParams = () => {
//     const params = {
//       limit: 0, // all records
//     };

//     if (filters.sortByStatus) {
//       params.status = filters.sortByStatus;
//     }

//     if (filters.filterBySpecialization.trim()) {
//       params.specialization = filters.filterBySpecialization.trim();
//     }

//     return params;
//   };

//   const fetchAdvocates = async () => {
//     setLoading(true);
//     try {
//       const params = buildQueryParams();
//       const res = await apiClient.get("/advocates", { params });
//       const raw = res.data.data || [];

//       const flat = raw.map((adv, i) => ({
//         srNo: i + 1,
//         id: adv._id,
//         advocateId: adv.advocateId || "N/A",
//         name: adv.fullName || "N/A",
//         specialization: adv.specialization || [],
//         enrollmentNo: adv.barCouncilNumber || adv.enrollmentNo || "N/A",
//         experience: adv.experience || 0,
//         casesAssigned: Number(adv.assignedCases?.length || 0),
//         casesClosed: Number(adv.successfulCases || 0),
//         totalPayment: 0, // adjust if payment data becomes available
//         status: adv.status
//           ? adv.status.charAt(0).toUpperCase() + adv.status.slice(1)
//           : "N/A",
//         rawCreatedDate: adv.createdAt || null,
//       }));

//       setAllAdvocates(flat);
//       const filtered = applyClientFilters(flat);
//       setFilteredAdvocates(filtered);
//     } catch (err) {
//       console.error("Fetch advocates error:", err);
//       toast.error("Failed to load advocate report");
//       setAllAdvocates([]);
//       setFilteredAdvocates([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAdvocates();
//   }, [filters.sortByStatus, filters.filterBySpecialization]);

//   const applyClientFilters = (data) => {
//     let result = [...data];

//     if (filters.searchByAdvocate.trim()) {
//       const term = filters.searchByAdvocate.trim().toLowerCase();
//       result = result.filter((adv) =>
//         adv.name?.toLowerCase().includes(term)
//       );
//     }

//     if (filters.fromDate) {
//       const from = new Date(filters.fromDate);
//       from.setHours(0, 0, 0, 0);
//       result = result.filter(
//         (adv) => adv.rawCreatedDate && new Date(adv.rawCreatedDate) >= from
//       );
//     }

//     if (filters.toDate) {
//       const to = new Date(filters.toDate);
//       to.setHours(23, 59, 59, 999);
//       result = result.filter(
//         (adv) => adv.rawCreatedDate && new Date(adv.rawCreatedDate) <= to
//       );
//     }

//     return result;
//   };

//   const handleFilterChange = (field, value) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleApplyFilters = () => {
//     const filtered = applyClientFilters(allAdvocates);
//     setFilteredAdvocates(filtered);
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       searchByAdvocate: "",
//       fromDate: "",
//       toDate: "",
//       sortByStatus: "",
//       filterBySpecialization: "",
//     });
//     setFilteredAdvocates([...allAdvocates]);
//   };

//   const totals = {
//     totalAdvocates: filteredAdvocates.length,
//     casesAssigned: filteredAdvocates.reduce((sum, a) => sum + a.casesAssigned, 0),
//     casesClosed: filteredAdvocates.reduce((sum, a) => sum + a.casesClosed, 0),
//     totalPayments: filteredAdvocates.reduce((sum, a) => sum + a.totalPayment, 0),
//   };

//   const escapeCsv = (value) => {
//     let str = Array.isArray(value)
//       ? value.join(", ")
//       : value != null
//       ? String(value)
//       : "";
//     str = str.replace(/"/g, '""').replace(/\n/g, " ");
//     return `"${str}"`;
//   };

//   const handleExportCSV = () => {
//     if (filteredAdvocates.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const headers = [
//       "SR No.",
//       "Advocate ID",
//       "Name",
//       "Specialization",
//       "Enrolment No.",
//       "Experience (yrs)",
//       "Cases Assigned",
//       "Cases Closed",
//       "Total Payment",
//       "Status",
//     ];

//     const csvRows = filteredAdvocates.map((a) =>
//       [
//         a.srNo,
//         escapeCsv(a.advocateId),
//         escapeCsv(a.name),
//         escapeCsv(a.specialization),
//         escapeCsv(a.enrollmentNo),
//         a.experience,
//         a.casesAssigned,
//         a.casesClosed,
//         a.totalPayment,
//         escapeCsv(a.status),
//       ].join(",")
//     );

//     const csvContent = [headers.join(","), ...csvRows].join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `advocate-report-${new Date().toISOString().split("T")[0]}.csv`
//     );
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//     toast.success("CSV exported successfully!");
//   };

//   const handlePrint = () => {
//     if (filteredAdvocates.length === 0) {
//       toast.error("No data to print");
//       return;
//     }

//     const isFiltered =
//       filters.searchByAdvocate ||
//       filters.fromDate ||
//       filters.toDate ||
//       filters.sortByStatus ||
//       filters.filterBySpecialization;

//     const title = isFiltered
//       ? "Advocate Report – Filtered"
//       : "Advocate Report – All Advocates";

//     const printWindow = window.open("", "", "width=1100,height=800");

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>${title}</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 20px; font-size: 11pt; }
//           h1 { text-align: center; margin-bottom: 10px; font-size: 16pt; }
//           .subtitle { text-align: center; color: #555; margin-bottom: 16px; font-size: 12pt; }
//           table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
//           th, td { border: 1px solid #333; padding: 8px 10px; text-align: left; }
//           th { background-color: #006d77; color: white; font-weight: bold; }
//           .totals { margin-top: 20px; padding: 12px; background: #f8f8f8; border: 1px solid #ccc; font-weight: bold; text-align: center; }
//         </style>
//       </head>
//       <body>
//         <h1>${title}</h1>
//         ${isFiltered ? '<p class="subtitle">Showing filtered results</p>' : ''}
//         <table>
//           <thead>
//             <tr>
//               <th>SR No</th>
//               <th>Advocate ID</th>
//               <th>Name</th>
//               <th>Specialization</th>
//               <th>Enrolment No.</th>
//               <th>Experience (yrs)</th>
//               <th>Cases Assigned</th>
//               <th>Cases Closed</th>
//               <th>Total Payment</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${filteredAdvocates
//               .map(
//                 (a) => `
//               <tr>
//                 <td>${a.srNo}</td>
//                 <td>${a.advocateId || "—"}</td>
//                 <td>${a.name || "—"}</td>
//                 <td>${Array.isArray(a.specialization) ? a.specialization.join(", ") : a.specialization || "—"}</td>
//                 <td>${a.enrollmentNo || "—"}</td>
//                 <td>${a.experience}</td>
//                 <td>${a.casesAssigned}</td>
//                 <td>${a.casesClosed}</td>
//                 <td>₹${a.totalPayment.toLocaleString("en-IN")}</td>
//                 <td>${a.status}</td>
//               </tr>
//             `
//               )
//               .join("")}
//           </tbody>
//         </table>
//         <div class="totals">
//           Total Advocates: ${totals.totalAdvocates}  
//             |  Cases Assigned: ${totals.casesAssigned}  
//             |  Cases Closed: ${totals.casesClosed}  
//             |  Total Payments: ₹${totals.totalPayments.toLocaleString("en-IN")}
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

//   // Prepare options for React-Select
//   const advocateOptions = allAdvocates
//     .map((adv) => ({
//       value: adv.name,
//       label: adv.name,
//     }))
//     .sort((a, b) => a.label.localeCompare(b.label));

//   const columns = [
//     { header: "SR No", render: (r) => r.srNo },
//     { header: "Advocate ID", render: (r) => r.advocateId },
//     { header: "Name", render: (r) => r.name },
//     {
//       header: "Specialization",
//       render: (r) =>
//         Array.isArray(r.specialization)
//           ? r.specialization.join(", ")
//           : r.specialization || "N/A",
//     },
//     { header: "Enrolment No.", render: (r) => r.enrollmentNo },
//     { header: "Experience (yrs)", render: (r) => r.experience },
//     { header: "Cases Assigned", render: (r) => r.casesAssigned },
//     { header: "Cases Closed", render: (r) => r.casesClosed },
//     {
//       header: "Total Payment",
//       render: (r) => `₹${r.totalPayment.toLocaleString("en-IN")}`,
//     },
//     {
//       header: "Status",
//       render: (r) => (
//         <span
//           className={r.status === "Active" ? "text-green-600" : "text-red-600"}
//         >
//           {r.status}
//         </span>
//       ),
//     },
//     {
//       header: "Action",
//       render: (row) => (
//         <button
//           onClick={() => navigate(`/admin/advocate/${row.id}`)}
//           className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
//         >
//           View
//         </button>
//       ),
//     },
//   ];

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 max-w-[90vw] mx-auto">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Advocate Report</h1>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Search by Advocate
//             </label>
//             <Select
//               isClearable
//               isSearchable
//               placeholder="Type advocate name..."
//               value={
//                 filters.searchByAdvocate
//                   ? { value: filters.searchByAdvocate, label: filters.searchByAdvocate }
//                   : null
//               }
//               options={advocateOptions}
//               onChange={(option) =>
//                 handleFilterChange("searchByAdvocate", option ? option.value : "")
//               }
//               className="text-sm"
//             />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">From Date</label>
//             <div className="relative">
//               <input
//                 type="date"
//                 value={filters.fromDate}
//                 onChange={(e) => handleFilterChange("fromDate", e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
//               />
//               {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" /> */}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">To Date</label>
//             <div className="relative">
//               <input
//                 type="date"
//                 value={filters.toDate}
//                 onChange={(e) => handleFilterChange("toDate", e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
//               />
//               {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" /> */}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Status</label>
//             <select
//               value={filters.sortByStatus}
//               onChange={(e) => handleFilterChange("sortByStatus", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
//             >
//               <option value="">All</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="retired">Retired</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Specialization</label>
//             <select
//               value={filters.filterBySpecialization}
//               onChange={(e) =>
//                 handleFilterChange("filterBySpecialization", e.target.value)
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
//             >
//               <option value="">All</option>
//               <option value="Civil">Civil</option>
//               <option value="Consumer">Consumer</option>
//               <option value="Criminal">Criminal</option>
//             </select>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-4">
//           <button
//             onClick={handleResetFilters}
//             className="px-8 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
//             disabled={loading}
//           >
//             Reset
//           </button>
//           <button
//             onClick={handleApplyFilters}
//             className="px-8 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800"
//             disabled={loading}
//           >
//             Apply
//           </button>
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm font-medium text-gray-700">
//           <div>
//             Total Advocates:{" "}
//             <span className="font-bold text-gray-900">{totals.totalAdvocates}</span>
//           </div>
//           <div>
//             Cases Assigned:{" "}
//             <span className="font-bold text-gray-900">{totals.casesAssigned}</span>
//           </div>
//           <div>
//             Cases Closed:{" "}
//             <span className="font-bold text-gray-900">{totals.casesClosed}</span>
//           </div>
//           <div>
//             Total Payments:{" "}
//             <span className="font-bold text-gray-900">
//               ₹{totals.totalPayments.toLocaleString("en-IN")}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end gap-3 mb-5">
//         <button
//           onClick={handlePrint}
//           disabled={loading || filteredAdvocates.length === 0}
//           className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
//         >
//           <Printer size={16} />
//           Print Report
//         </button>
//         <button
//           onClick={handleExportCSV}
//           disabled={loading || filteredAdvocates.length === 0}
//           className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
//         >
//           <Download size={16} />
//           Export CSV
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="p-12 text-center text-gray-500">Loading advocates...</div>
//         ) : filteredAdvocates.length === 0 ? (
//           <div className="p-12 text-center text-gray-500 italic">
//             No advocates match the selected filters
//           </div>
//         ) : (
//           <Table
//             data={filteredAdvocates}
//             columns={columns}
//             pagination={true}
//             defaultPageSize={10}
//             showSrNo={false}
//           />
//         )}
//       </div>
//     </div>
//   );
// }



