// // src/pages/ExpertReportPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import Table from '../../../components/mainComponents/Table';
// import { Calendar, Printer, Download } from 'lucide-react';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';

// const expertData = [
//   {
//     srNo: 1,
//     expertId: "EXP-001",
//     name: "Dr. Anita Kalra",
//     type: "Doctor",
//     specialization: "Forensic Medicine",
//     regNo: "FMI-100",
//     experience: 10,
//     casesAssigned: 45,
//     casesClosed: 40,
//     totalPayment: 110000,
//     status: "Active",
//   },
//   {
//     srNo: 2,
//     expertId: "EXP-002",
//     name: "Mr. Rakesh Sharma",
//     type: "Legal",
//     specialization: "Expert Witness",
//     regNo: "LE-210",
//     experience: 7,
//     casesAssigned: 22,
//     casesClosed: 18,
//     totalPayment: 85000,
//     status: "Active",
//   },
//   {
//     srNo: 3,
//     expertId: "EXP-003",
//     name: "Dr. Sandeep Rao",
//     type: "Both",
//     specialization: "Forensic Pathology",
//     regNo: "FP-305",
//     experience: 14,
//     casesAssigned: 78,
//     casesClosed: 70,
//     totalPayment: 730000,
//     status: "Active",
//   },
//   {
//     srNo: 4,
//     expertId: "EXP-004",
//     name: "Ms. Neeta Singh",
//     type: "Doctor",
//     specialization: "Forensic Medicine",
//     regNo: "FM-412",
//     experience: 6,
//     casesAssigned: 12,
//     casesClosed: 6,
//     totalPayment: 72000,
//     status: "On Leave",
//   },
//   {
//     srNo: 5,
//     expertId: "EXP-005",
//     name: "Adv. Manoj Verma",
//     type: "Legal",
//     specialization: "Legal Expert",
//     regNo: "LE-612",
//     experience: 11,
//     casesAssigned: 45,
//     casesClosed: 38,
//     totalPayment: 118000,
//     status: "Active",
//   },
//   {
//     srNo: 6,
//     expertId: "EXP-006",
//     name: "Dr. Kavya Patel",
//     type: "Doctor",
//     specialization: "Forensic Toxicology",
//     regNo: "FT-651",
//     experience: 5,
//     casesAssigned: 28,
//     casesClosed: 24,
//     totalPayment: 67000,
//     status: "Active",
//   },
//   {
//     srNo: 7,
//     expertId: "EXP-007",
//     name: "Dr. Arun Mishra",
//     type: "Doctor",
//     specialization: "Forensic Pathology",
//     regNo: "FP-702",
//     experience: 9,
//     casesAssigned: 32,
//     casesClosed: 30,
//     totalPayment: 115000,
//     status: "Active",
//   },
//   {
//     srNo: 8,
//     expertId: "EXP-008",
//     name: "Ms. Supta Rao",
//     type: "Legal",
//     specialization: "Expert Witness",
//     regNo: "LE-808",
//     experience: 5,
//     casesAssigned: 6,
//     casesClosed: 7,
//     totalPayment: 62000,
//     status: "Active",
//   },
// ];

// const totals = {
//   totalExperts: 8,
//   casesAssigned: 265,
//   casesClosed: 230,
//   totalPayments: 968000,
// };

// // COLUMNS: Baaki sab
// const columns = [
//   { header: "Sr No", accessor: "srNo", render: (v) => <span className="text-gray-700">{v}</span> },
//   { header: "Expert ID", accessor: "expertId", render: (v) => <span className="text-gray-700 font-medium">{v}</span> },
//   { header: "Name", accessor: "name", render: (v) => <span className="text-gray-700">{v}</span> },
//   { header: "Type", accessor: "type", render: (v) => <span className="text-gray-700">{v}</span> },
//   { header: "Specialization", accessor: "specialization", render: (v) => <span className="text-gray-700">{v}</span> },
//   { header: "Reg No", accessor: "regNo", render: (v) => <span className="text-gray-700">{v}</span> },
//   { header: "Experience", accessor: "experience", render: (v) => <span className="text-gray-700">{v} yrs</span> },
//   { header: "Cases Assigned", accessor: "casesAssigned", render: (v) => <span className="text-gray-700 font-medium">{v}</span> },
//   { header: "Cases Closed", accessor: "casesClosed", render: (v) => <span className="text-gray-700 font-medium">{v}</span> },
//   { header: "Total Payment", accessor: "totalPayment", render: (v) => <span className="text-gray-700 font-medium">₹{v.toLocaleString()}</span> },
//   {
//     header: "Status",
//     accessor: "status",
//     render: (v) => (
//       <span className={`text-sm font-medium ${v === "Active" ? "text-green-800" : v === "On Leave" ? "text-yellow-800" : "text-red-800"}`}>
//         {v}
//       </span>
//     ),
//   },
// ];

// // EXTRA COLUMNS: Sirf Action Buttons
// const extraColumns = [
//   {
//     header: "Action",
//     render: (row) => (
//       <div className="flex gap-2 justify-center">
//         <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
//           View
//         </button>
//         <button className="px-3 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700">
//           Edit
//         </button>
//         <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
//           Delete
//         </button>
//       </div>
//     ),
//   },
// ];

// export default function ExpertReportPage() {
//   const navigate = useNavigate();
//   const [expertData, setExpertData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     dateFrom: '',
//     dateTo: ''
//   });

//   const fetchExpertReports = async () => {
//     setLoading(true);
//     try {
//       const params = {};
//       if (filters.dateFrom) params.dateFrom = filters.dateFrom;
//       if (filters.dateTo) params.dateTo = filters.dateTo;

//       const response = await apiClient.get(apiEndpoints.reports.experts, { params });
//       const transformedData = transformAggregatedData(response.data.data || []);
//       setExpertData(transformedData);
//     } catch (error) {
//       console.error('Error fetching expert reports:', error);
//       toast.error('Failed to fetch expert reports');
//       setExpertData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformAggregatedData = (aggregatedData) => {
//     const experts = [];
//     let srNo = 1;

//     aggregatedData.forEach(group => {
//       if (group.experts && group.experts.length > 0) {
//         group.experts.forEach(expert => {
//           experts.push({
//             srNo: srNo++,
//             expertId: `EXP-${String(srNo - 1).padStart(3, '0')}`,
//             name: expert.fullName || 'Unknown Expert',
//             type: expert.type || 'Expert',
//             specialization: expert.expertise || 'General',
//             regNo: expert.registrationNumber || 'N/A',
//             experience: group.avgExperience || 0,
//             casesAssigned: expert.totalConsultations || 0,
//             casesClosed: Math.round((expert.totalConsultations || 0) * (group.completionRate || 0) / 100),
//             totalPayment: 0, // Would need payment integration
//             status: group.status || 'Active'
//           });
//         });
//       }
//     });

//     return experts;
//   };

//   useEffect(() => {
//     fetchExpertReports();
//   }, []);

//   const calculateTotals = (experts) => {
//     return {
//       totalExperts: experts.length,
//       casesAssigned: experts.reduce((sum, exp) => sum + (exp.casesAssigned || 0), 0),
//       casesClosed: experts.reduce((sum, exp) => sum + (exp.casesClosed || 0), 0),
//       totalPayments: experts.reduce((sum, exp) => sum + (exp.totalPayment || 0), 0),
//     };
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Expert Report</h1>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//         <div className="grid grid-cols-4 gap-3 mb-3">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Search by Name</label>
//             <input type="text" placeholder="Enter expert name" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700" />
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Search by Expert ID</label>
//             <input type="text" placeholder="e.g. EXP-001" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700" />
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Type</label>
//             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
//               <option>All</option>
//               <option>Doctor</option>
//               <option>Legal</option>
//               <option>Both</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Joined (From To)</label>
//             <div className="relative">
//               <input type="text" placeholder="dd/mm/yyyy" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 pr-10" />
//               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-4 gap-3">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Specialization</label>
//             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
//               <option>All</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Experience (min yrs)</label>
//             <input type="number" placeholder="e.g. 4" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700" />
//           </div>
//           <div></div>
//           <div className="flex justify-end items-end gap-2">
//             <button className="px-6 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800">
//               Apply
//             </button>
//             <button className="px-6 py-2 border border-gray-300 rounded bg-white text-sm font-medium hover:bg-gray-50">
//               Reset
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
//         {(() => {
//           const totals = calculateTotals(expertData);
//           return (
//         <div className="grid grid-cols-4 gap-6 text-sm">
//           <div>
//             <span className="text-gray-600">Total Experts:</span>
//             <span className="ml-2 font-bold text-gray-900">{totals.totalExperts}</span>
//           </div>
//           <div>
//             <span className="text-gray-600">Cases Assigned:</span>
//             <span className="ml-2 font-bold text-gray-900">{totals.casesAssigned}</span>
//           </div>
//           <div>
//             <span className="text-gray-600">Cases Closed:</span>
//             <span className="ml-2 font-bold text-gray-900">{totals.casesClosed}</span>
//           </div>
//           <div>
//             <span className="text-gray-600">Total Payments:</span>
//             <span className="ml-2 font-bold text-gray-900">₹{totals.totalPayments.toLocaleString()}</span>
//           </div>
//         </div>
//           );
//         })()}
//       </div>

//       {/* Table + Print/Export */}
//       <div className="bg-white rounded-lg shadow-sm">
//         <div className="px-6 py-4 border-b border-gray-200 flex justify-end items-center">
//           <div className="flex gap-2">
//             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
//               <Printer className="h-4 w-4" />
//               Print
//             </button>
//             <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700">
//               <Download className="h-4 w-4" />
//               Export CSV
//             </button>
//           </div>
//         </div>

//         <div className="p-6">
//           <Table data={expertData} columns={columns} extraColumns={extraColumns} />

//           {/* Total Row */}
//           {(() => {
//             const totals = calculateTotals(expertData);
//             return (
//           <div className="mt-4 border-t border-gray-200 pt-3">
//             <div className="grid grid-cols-12 text-sm font-bold text-gray-900">
//               <div className="col-span-7 text-right pr-4">Totals (selected):</div>
//               <div className="col-span-1">{totals.casesAssigned}</div>
//               <div className="col-span-1">{totals.casesClosed}</div>
//               <div className="col-span-1">₹{totals.totalPayments.toLocaleString()}</div>
//               <div className="col-span-2"></div>
//             </div>
//           </div>
//             );
//           })()}
//         </div>
//       </div>
//     </div>
//   );


// src/pages/ExpertReportPage.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Table from "../../../components/mainComponents/Table";
import { Download, Calendar, Printer } from "lucide-react";
import apiClient from "../../../services/apiClient";

export default function ExpertReportPage() {
  const [allExperts, setAllExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    searchByName: "",
    searchByExpertId: "",
    type: "All",
    specialization: "",
    experienceMin: "",
    joinedFrom: "",
    joinedTo: "",
  });

  // Fetch experts once on mount
  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/experts");

        const raw = res.data.data || res.data || [];

        const flat = raw.map((exp, index) => {
          const assignedCasesArray = Array.isArray(exp.assignedCases)
            ? exp.assignedCases
            : [];

          const casesAssigned = assignedCasesArray.length;
          const casesClosed = assignedCasesArray.filter(
            (caseItem) => caseItem.status === "Closed"
          ).length;

          return {
            srNo: index + 1,
            expertId: exp.expertId || exp._id?.slice(-6) || "N/A",
            name: exp.fullName || exp.name || "N/A",
            type: exp.designation || "N/A",
            specialization: exp.lawSpecialization || "N/A",
            regNo: exp.licenseNumber || "N/A",
            experience: Number(exp.experienceYears || exp.experience || 0),
            casesAssigned,
            casesClosed,
            totalPayment: Number(exp.totalPayment || exp.totalPayments || 0),
            status: exp.status
              ? exp.status.charAt(0).toUpperCase() + exp.status.slice(1)
              : "N/A",
            rawJoinedDate: exp.createdAt || exp.joinedDate || null,
          };
        });

        setAllExperts(flat);
        setFilteredExperts(flat);
      } catch (err) {
        console.error("Experts fetch error:", err);
        toast.error("Failed to load expert data");
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  const applyFilters = () => {
    let result = [...allExperts];

    if (filters.searchByName.trim()) {
      const term = filters.searchByName.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(term));
    }

    if (filters.searchByExpertId.trim()) {
      const term = filters.searchByExpertId.toLowerCase();
      result = result.filter((e) => e.expertId.toLowerCase().includes(term));
    }

    if (filters.type !== "All") {
      const typeLower = filters.type.toLowerCase();
      result = result.filter((e) => {
        const des = (e.type || "").toLowerCase();
        if (typeLower === "doctor") return des === "doctor";
        if (typeLower === "lawyer") return des === "lawyer" || des === "legal";
        return false;
      });
    }

    if (filters.specialization.trim()) {
      const term = filters.specialization.trim().toLowerCase();
      result = result.filter((e) =>
        (e.specialization || "").toLowerCase().includes(term)
      );
    }

    if (filters.experienceMin !== "") {
      const min = Number(filters.experienceMin);
      if (!isNaN(min)) {
        result = result.filter((e) => e.experience >= min);
      }
    }

    if (filters.joinedFrom) {
      const from = new Date(filters.joinedFrom);
      result = result.filter(
        (e) => e.rawJoinedDate && new Date(e.rawJoinedDate) >= from
      );
    }

    if (filters.joinedTo) {
      const to = new Date(filters.joinedTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter(
        (e) => e.rawJoinedDate && new Date(e.rawJoinedDate) <= to
      );
    }

    setFilteredExperts(result);
  };

  const handleReset = () => {
    setFilters({
      searchByName: "",
      searchByExpertId: "",
      type: "All",
      specialization: "",
      experienceMin: "",
      joinedFrom: "",
      joinedTo: "",
    });
    setFilteredExperts(allExperts);
  };

  const totals = {
    totalExperts: filteredExperts.length,
    casesAssigned: filteredExperts.reduce((sum, e) => sum + e.casesAssigned, 0),
    casesClosed: filteredExperts.reduce((sum, e) => sum + e.casesClosed, 0),
    totalPayments: filteredExperts.reduce((sum, e) => sum + e.totalPayment, 0),
  };

  // ────────────────────────────────────────────────
  //  PRINT using hidden iframe (consistent with AccountStatement & ExpenseReport)
  // ────────────────────────────────────────────────
  const handlePrint = () => {
    if (filteredExperts.length === 0) {
      toast.info("No experts to print");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Expert Report</title>
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
          .summary {
            margin: 20px 0 30px;
            padding: 14px;
            background: #f9fafb;
            border: 1px solid #cbd5e0;
            border-radius: 6px;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: space-between;
            font-weight: bold;
            font-size: 11.5pt;
          }
          .totals {
            margin-top: 24px;
            padding: 14px;
            background: #f0f9f8;
            border: 1px solid #a3d9d4;
            border-radius: 6px;
            text-align: center;
            font-weight: bold;
          }
          @media print {
            body { padding: 12mm; margin: 0; }
          }
        </style>
      </head>
      <body>
        <h1>Expert Report</h1>
        <div class="subtitle">
          As of ${new Date().toLocaleDateString("en-IN")}
        </div>

        <div class="summary">
          <div>Total Experts: ${totals.totalExperts}</div>
          <div>Cases Assigned: ${totals.casesAssigned}</div>
          <div>Cases Closed: ${totals.casesClosed}</div>
          <div>Total Payments: ₹${totals.totalPayments.toLocaleString("en-IN")}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>SR</th>
              <th>Expert ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Specialization</th>
              <th>Reg No</th>
              <th>Exp (yrs)</th>
              <th>Assigned</th>
              <th>Closed</th>
              <th class="amount">Payment (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredExperts
              .map(
                (e) => `
              <tr>
                <td style="text-align:center;">${e.srNo}</td>
                <td>${e.expertId}</td>
                <td>${e.name}</td>
                <td>${e.type}</td>
                <td>${e.specialization}</td>
                <td>${e.regNo}</td>
                <td style="text-align:center;">${e.experience}</td>
                <td style="text-align:center;">${e.casesAssigned}</td>
                <td style="text-align:center;">${e.casesClosed}</td>
                <td class="amount">${e.totalPayment.toLocaleString("en-IN")}</td>
                <td>${e.status}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          Filtered selection summary • 
          ${totals.totalExperts} experts • 
          ${totals.casesAssigned} assigned • 
          ${totals.casesClosed} closed • 
          ₹${totals.totalPayments.toLocaleString("en-IN")} total payments
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

  const handleExportCSV = () => {
    const headers = [
      "SR No.",
      "Expert ID",
      "Name",
      "Type",
      "Specialization",
      "Reg No",
      "Experience (yrs)",
      "Cases Assigned",
      "Cases Closed",
      "Total Payment",
      "Status",
    ];

    const escape = (val) =>
      `"${String(val ?? "")
        .replace(/"/g, '""')
        .replace(/\n/g, " ")}"`;

    const rows = filteredExperts.map((e) =>
      [
        e.srNo,
        escape(e.expertId),
        escape(e.name),
        escape(e.type),
        escape(e.specialization),
        escape(e.regNo),
        e.experience,
        e.casesAssigned,
        e.casesClosed,
        e.totalPayment,
        escape(e.status),
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expert-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  };

  const columns = [
    { header: "SR No.", render: (r) => r.srNo },
    { header: "Expert ID", render: (r) => r.expertId },
    { header: "Name", render: (r) => r.name },
    { header: "Type", render: (r) => r.type },
    { header: "Specialization", render: (r) => r.specialization },
    { header: "Reg No", render: (r) => r.regNo },
    { header: "Experience", render: (r) => `${r.experience} yrs` },
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
          className={
            r.status === "Active"
              ? "text-green-600 font-medium"
              : r.status === "On Leave"
              ? "text-yellow-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Expert Report</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Search by Name
            </label>
            <input
              type="text"
              placeholder="Enter expert name"
              value={filters.searchByName}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  searchByName: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Search by Expert ID
            </label>
            <input
              type="text"
              placeholder="e.g. EXP-001"
              value={filters.searchByExpertId}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  searchByExpertId: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All</option>
              <option value="Doctor">Doctor</option>
              <option value="Lawyer">Lawyer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Specialization
            </label>
            <input
              type="text"
              placeholder="e.g. Criminal, Neurology, Family Law..."
              value={filters.specialization}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  specialization: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Experience (min yrs)
            </label>
            <input
              type="number"
              placeholder="e.g. 4"
              min="0"
              value={filters.experienceMin}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  experienceMin: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Joined : From
            </label>
            <div className="relative">
              <input
                type="date"
                value={filters.joinedFrom}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    joinedFrom: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">To</label>
            <div className="relative">
              <input
                type="date"
                value={filters.joinedTo}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, joinedTo: e.target.value }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-end gap-3">
            <button
              onClick={applyFilters}
              className="px-10 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800 transition"
            >
              Apply
            </button>
            <button
              onClick={handleReset}
              className="px-10 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition"
            >
              Reset
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 italic mt-3">
          Filter experts and view assigned / closed cases summary.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Experts</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totals.totalExperts}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Cases Assigned</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totals.casesAssigned}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Cases Closed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totals.casesClosed}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Payments</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ₹{totals.totalPayments.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Actions & Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-end gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
            disabled={loading || filteredExperts.length === 0}
          >
            <Printer size={16} />
            Print
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 transition"
            disabled={loading || filteredExperts.length === 0}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              Loading experts...
            </div>
          ) : filteredExperts.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No experts match the selected filters
            </div>
          ) : (
            <Table
              data={filteredExperts}
              columns={columns}
              pagination={true}
              defaultPageSize={10}
              showSrNo={false} // we have custom SR No column
            />
          )}
        </div>
      </div>
    </div>
  );
}


// // src/pages/ExpertReportPage.jsx
// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import Table from "../../../components/mainComponents/Table";
// import { Download, Calendar, Printer } from "lucide-react";
// import apiClient from "../../../services/apiClient";

// export default function ExpertReportPage() {
//   const [allExperts, setAllExperts] = useState([]);
//   const [filteredExperts, setFilteredExperts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [filters, setFilters] = useState({
//     searchByName: "",
//     searchByExpertId: "",
//     type: "All",
//     specialization: "",
//     experienceMin: "",
//     joinedFrom: "",
//     joinedTo: "",
//   });

//   // Fetch experts once on mount
//   useEffect(() => {
//     const fetchExperts = async () => {
//       setLoading(true);
//       try {
//         const res = await apiClient.get("/experts");

//         const raw = res.data.data || res.data || [];

//         const flat = raw.map((exp, index) => {
//           // Get assignedCases array
//           const assignedCasesArray = Array.isArray(exp.assignedCases)
//             ? exp.assignedCases
//             : [];

//           // Count total assigned cases (non-empty array)
//           const casesAssigned = assignedCasesArray.length;

//           // Count closed cases (status === "Closed")
//           const casesClosed = assignedCasesArray.filter(
//             (caseItem) => caseItem.status === "Closed",
//           ).length;

//           return {
//             srNo: index + 1,
//             expertId: exp.expertId || exp._id?.slice(-6) || "N/A",
//             name: exp.fullName || exp.name || "N/A",
//             type: exp.designation || "N/A",
//             specialization: exp.lawSpecialization || "N/A",
//             regNo: exp.licenseNumber || "N/A",
//             experience: Number(exp.experienceYears || exp.experience || 0),
//             casesAssigned,
//             casesClosed,
//             totalPayment: Number(exp.totalPayment || exp.totalPayments || 0),
//             status: exp.status
//               ? exp.status.charAt(0).toUpperCase() + exp.status.slice(1)
//               : "N/A",
//             rawJoinedDate: exp.createdAt || exp.joinedDate || null,
//           };
//         });

//         setAllExperts(flat);
//         setFilteredExperts(flat);
//       } catch (err) {
//         console.error("Experts fetch error:", err);
//         toast.error("Failed to load expert data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExperts();
//   }, []);

//   const applyFilters = () => {
//     let result = [...allExperts];

//     if (filters.searchByName.trim()) {
//       const term = filters.searchByName.toLowerCase();
//       result = result.filter((e) => e.name.toLowerCase().includes(term));
//     }

//     if (filters.searchByExpertId.trim()) {
//       const term = filters.searchByExpertId.toLowerCase();
//       result = result.filter((e) => e.expertId.toLowerCase().includes(term));
//     }

//     if (filters.type !== "All") {
//       const typeLower = filters.type.toLowerCase();
//       result = result.filter((e) => {
//         const des = (e.type || "").toLowerCase();
//         if (typeLower === "doctor") return des === "doctor";
//         if (typeLower === "lawyer") return des === "lawyer" || des === "legal";
//         return false;
//       });
//     }

//     if (filters.specialization.trim()) {
//       const term = filters.specialization.trim().toLowerCase();
//       result = result.filter((e) =>
//         (e.specialization || "").toLowerCase().includes(term),
//       );
//     }

//     if (filters.experienceMin !== "") {
//       const min = Number(filters.experienceMin);
//       if (!isNaN(min)) {
//         result = result.filter((e) => e.experience >= min);
//       }
//     }

//     if (filters.joinedFrom) {
//       const from = new Date(filters.joinedFrom);
//       result = result.filter(
//         (e) => e.rawJoinedDate && new Date(e.rawJoinedDate) >= from,
//       );
//     }

//     if (filters.joinedTo) {
//       const to = new Date(filters.joinedTo);
//       to.setHours(23, 59, 59, 999);
//       result = result.filter(
//         (e) => e.rawJoinedDate && new Date(e.rawJoinedDate) <= to,
//       );
//     }

//     setFilteredExperts(result);
//   };

//   const handleReset = () => {
//     setFilters({
//       searchByName: "",
//       searchByExpertId: "",
//       type: "All",
//       specialization: "",
//       experienceMin: "",
//       joinedFrom: "",
//       joinedTo: "",
//     });
//     setFilteredExperts(allExperts);
//   };

//   const totals = {
//     totalExperts: filteredExperts.length,
//     casesAssigned: filteredExperts.reduce((sum, e) => sum + e.casesAssigned, 0),
//     casesClosed: filteredExperts.reduce((sum, e) => sum + e.casesClosed, 0),
//     totalPayments: filteredExperts.reduce((sum, e) => sum + e.totalPayment, 0),
//   };

//   const handlePrint = () => {
//     const printWindow = window.open("", "", "width=1100,height=800");

//     const content = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Expert Report</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 20px; font-size: 11pt; }
//           h1 { text-align: center; margin-bottom: 20px; }
//           table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
//           th, td { border: 1px solid #444; padding: 8px 10px; text-align: left; }
//           th { background: #006d77; color: white; }
//           .summary { display: flex; justify-content: space-between; margin-bottom: 30px; font-weight: bold; flex-wrap: wrap; gap: 16px; }
//           .totals { margin-top: 30px; padding: 15px; background: #f8f8f8; border: 1px solid #ccc; text-align: center; font-weight: bold; }
//         </style>
//       </head>
//       <body>
//         <h1>Expert Report</h1>

//         <div class="summary">
//           <div>Total Experts: ${totals.totalExperts}</div>
//           <div>Cases Assigned: ${totals.casesAssigned}</div>
//           <div>Cases Closed: ${totals.casesClosed}</div>
//           <div>Total Payments: ₹${totals.totalPayments.toLocaleString("en-IN")}</div>
//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th>SR No.</th>
//               <th>Expert ID</th>
//               <th>Name</th>
//               <th>Type</th>
//               <th>Specialization</th>
//               <th>Reg No</th>
//               <th>Experience</th>
//               <th>Cases Assigned</th>
//               <th>Cases Closed</th>
//               <th>Total Payment</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${filteredExperts
//               .map(
//                 (e) => `
//               <tr>
//                 <td>${e.srNo}</td>
//                 <td>${e.expertId}</td>
//                 <td>${e.name}</td>
//                 <td>${e.type}</td>
//                 <td>${e.specialization}</td>
//                 <td>${e.regNo}</td>
//                 <td>${e.experience} yrs</td>
//                 <td>${e.casesAssigned}</td>
//                 <td>${e.casesClosed}</td>
//                 <td>₹${e.totalPayment.toLocaleString("en-IN")}</td>
//                 <td>${e.status}</td>
//               </tr>
//             `,
//               )
//               .join("")}
//           </tbody>
//         </table>

//         <div class="totals">
//           Totals (filtered selection): 
//           ${totals.totalExperts} experts • 
//           ${totals.casesAssigned} assigned • 
//           ${totals.casesClosed} closed • 
//           ₹${totals.totalPayments.toLocaleString("en-IN")} total payments
//         </div>
//       </body>
//       </html>
//     `;

//     printWindow.document.write(content);
//     printWindow.document.close();
//     printWindow.onload = () => {
//       printWindow.focus();
//       printWindow.print();
//     };
//   };

//   const handleExportCSV = () => {
//     const headers = [
//       "SR No.",
//       "Expert ID",
//       "Name",
//       "Type",
//       "Specialization",
//       "Reg No",
//       "Experience (yrs)",
//       "Cases Assigned",
//       "Cases Closed",
//       "Total Payment",
//       "Status",
//     ];

//     const escape = (val) =>
//       `"${String(val ?? "")
//         .replace(/"/g, '""')
//         .replace(/\n/g, " ")}"`;

//     const rows = filteredExperts.map((e) =>
//       [
//         e.srNo,
//         escape(e.expertId),
//         escape(e.name),
//         escape(e.type),
//         escape(e.specialization),
//         escape(e.regNo),
//         e.experience,
//         e.casesAssigned,
//         e.casesClosed,
//         e.totalPayment,
//         escape(e.status),
//       ].join(","),
//     );

//     const csv = [headers.join(","), ...rows].join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `expert-report-${new Date().toISOString().split("T")[0]}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);

//     toast.success("CSV exported successfully");
//   };

//   const columns = [
//     { header: "SR No.", render: (r) => r.srNo },
//     { header: "Expert ID", render: (r) => r.expertId },
//     { header: "Name", render: (r) => r.name },
//     { header: "Type", render: (r) => r.type },
//     { header: "Specialization", render: (r) => r.specialization },
//     { header: "Reg No", render: (r) => r.regNo },
//     { header: "Experience", render: (r) => `${r.experience} yrs` },
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
//           className={
//             r.status === "Active"
//               ? "text-green-600 font-medium"
//               : r.status === "On Leave"
//                 ? "text-yellow-600 font-medium"
//                 : "text-red-600 font-medium"
//           }
//         >
//           {r.status}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Expert Report</h1>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Search by Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter expert name"
//               value={filters.searchByName}
//               onChange={(e) =>
//                 setFilters((prev) => ({
//                   ...prev,
//                   searchByName: e.target.value,
//                 }))
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//             />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Search by Expert ID
//             </label>
//             <input
//               type="text"
//               placeholder="e.g. EXP-001"
//               value={filters.searchByExpertId}
//               onChange={(e) =>
//                 setFilters((prev) => ({
//                   ...prev,
//                   searchByExpertId: e.target.value,
//                 }))
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//             />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Type</label>
//             <select
//               value={filters.type}
//               onChange={(e) =>
//                 setFilters((prev) => ({ ...prev, type: e.target.value }))
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//             >
//               <option value="All">All</option>
//               <option value="Doctor">Doctor</option>
//               <option value="Lawyer">Lawyer</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Specialization
//             </label>
//             <input
//               type="text"
//               placeholder="e.g. Criminal, Neurology, Family Law..."
//               value={filters.specialization}
//               onChange={(e) =>
//                 setFilters((prev) => ({
//                   ...prev,
//                   specialization: e.target.value,
//                 }))
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Experience (min yrs)
//             </label>
//             <input
//               type="number"
//               placeholder="e.g. 4"
//               min="0"
//               value={filters.experienceMin}
//               onChange={(e) =>
//                 setFilters((prev) => ({
//                   ...prev,
//                   experienceMin: e.target.value,
//                 }))
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//             />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Joined : From
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 value={filters.joinedFrom}
//                 onChange={(e) =>
//                   setFilters((prev) => ({
//                     ...prev,
//                     joinedFrom: e.target.value,
//                   }))
//                 }
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//               />
//               {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" /> */}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">To</label>
//             <div className="relative">
//               <input
//                 type="date"
//                 value={filters.joinedTo}
//                 onChange={(e) =>
//                   setFilters((prev) => ({ ...prev, joinedTo: e.target.value }))
//                 }
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
//               />
//               {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" /> */}
//             </div>
//           </div>

//           <div className="flex items-end gap-3">
//             <button
//               onClick={applyFilters}
//               className="px-10 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800 transition"
//             >
//               Apply
//             </button>
//             <button
//               onClick={handleReset}
//               className="px-10 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition"
//             >
//               Reset
//             </button>
//           </div>
//         </div>

//         <p className="text-xs text-gray-500 italic mt-3">
//           Filter experts and view assigned / closed cases summary.
//         </p>
//       </div>

//       {/* Summary cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
//           <p className="text-sm text-gray-600">Total Experts</p>
//           <p className="text-2xl font-bold text-gray-900 mt-1">
//             {totals.totalExperts}
//           </p>
//         </div>
//         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
//           <p className="text-sm text-gray-600">Cases Assigned</p>
//           <p className="text-2xl font-bold text-gray-900 mt-1">
//             {totals.casesAssigned}
//           </p>
//         </div>
//         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
//           <p className="text-sm text-gray-600">Cases Closed</p>
//           <p className="text-2xl font-bold text-gray-900 mt-1">
//             {totals.casesClosed}
//           </p>
//         </div>
//         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
//           <p className="text-sm text-gray-600">Total Payments</p>
//           <p className="text-2xl font-bold text-gray-900 mt-1">
//             ₹{totals.totalPayments.toLocaleString("en-IN")}
//           </p>
//         </div>
//       </div>

//       {/* Actions & Table */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200 flex justify-end gap-4">
//           <button
//             onClick={handlePrint}
//             className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
//             disabled={loading || filteredExperts.length === 0}
//           >
//             <Printer size={16} />
//             Print
//           </button>
//           <button
//             onClick={handleExportCSV}
//             className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 transition"
//             disabled={loading || filteredExperts.length === 0}
//           >
//             <Download size={16} />
//             Export CSV
//           </button>
//         </div>

//         <div className="p-6">
//           {loading ? (
//             <div className="text-center py-16 text-gray-500">
//               Loading experts...
//             </div>
//           ) : filteredExperts.length === 0 ? (
//             <div className="text-center py-16 text-gray-500">
//               No experts match the selected filters
//             </div>
//           ) : (
//             <Table
//               data={filteredExperts}
//               columns={columns}
//               pagination={true}
//               defaultPageSize={10}
//               showSrNo={false} // we have custom SR No column
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
