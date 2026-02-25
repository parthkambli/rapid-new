// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import apiClient from "../../../services/apiClient";
// import Select from "react-select";
// import Table from "../../../components/mainComponents/Table";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import { Printer, Download } from "lucide-react";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// export default function EmployeeReport() {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   const [selectedNameOption, setSelectedNameOption] = useState(null);
//   const [selectedIdOption, setSelectedIdOption] = useState(null);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch employees list once
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await apiClient.get("/employees/dropdown");
//         setEmployees(res.data?.data || []);
//       } catch (err) {
//         toast.error("Failed to load employee list");
//       }
//     };
//     fetchEmployees();
//   }, []);

//   // Reset employee selection if role filter excludes current selection
//   useEffect(() => {
//     if (!selectedEmployeeId) return;

//     const selectedEmp = employees.find((e) => e._id === selectedEmployeeId);
//     if (selectedEmp && selectedRole && selectedEmp.role !== selectedRole) {
//       setSelectedEmployeeId("");
//       setSelectedNameOption(null);
//       setSelectedIdOption(null);
//       setReportData(null);
//     }
//   }, [selectedRole, employees, selectedEmployeeId]);

//   const fetchReportData = async () => {
//     if (!selectedEmployeeId) {
//       toast.warn("Please select an employee first");
//       return;
//     }

//     setLoading(true);
//     try {
//       const params = { employeeId: selectedEmployeeId };
//       if (startDate) params.startDate = startDate;
//       if (endDate) params.endDate = endDate;
//       if (selectedRole) params.role = selectedRole;

//       const res = await apiClient.get("/employees/reports", { params });
//       setReportData(res.data || null);
//       toast.success("Report loaded successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load report");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-fetch when employee or date range changes
//   useEffect(() => {
//     if (selectedEmployeeId) {
//       fetchReportData();
//     }
//   }, [selectedEmployeeId, startDate, endDate, selectedRole]);

//   // Sync name ↔ id dropdowns
//   const handleNameChange = (option) => {
//     setSelectedNameOption(option);
//     setSelectedIdOption(
//       option
//         ? {
//             value: option.value,
//             label: employees.find((e) => e._id === option.value)?.employeeId || "No ID",
//           }
//         : null
//     );
//     setSelectedEmployeeId(option ? option.value : "");
//   };

//   const handleIdChange = (option) => {
//     setSelectedIdOption(option);
//     setSelectedNameOption(
//       option
//         ? {
//             value: option.value,
//             label: employees.find((e) => e._id === option.value)?.fullName || "Unnamed",
//           }
//         : null
//     );
//     setSelectedEmployeeId(option ? option.value : "");
//   };

//   const nameOptions = employees
//     .filter((emp) => !selectedRole || emp.role === selectedRole)
//     .map((emp) => ({
//       value: emp._id,
//       label: emp.fullName || "Unnamed",
//     }));

//   const idOptions = employees
//     .filter((emp) => !selectedRole || emp.role === selectedRole)
//     .map((emp) => ({
//       value: emp._id,
//       label: emp.employeeId || "No ID",
//     }));

//   // Extract data with safe defaults
//   const target = reportData?.targetOverview || {};
//   const att = reportData?.attendanceSummary || {};
//   const tasks = reportData?.taskSummary || {};
//   const sal = reportData?.salarySummary || {};

//   // Chart data
//   const chartData = {
//     labels: ["Target Given", "Target Completed", "Attendance %"],
//     datasets: [
//       {
//         label: "Performance",
//         data: [
//           target.targetGiven || 0,
//           target.targetCompleted || 0,
//           parseFloat(att.attendancePercent?.replace("%", "")) || 0,
//         ],
//         backgroundColor: [
//           "rgba(251, 146, 60, 0.82)",
//           "rgba(96, 165, 250, 0.82)",
//           "rgba(52, 211, 153, 0.82)",
//         ],
//         borderColor: ["rgb(194, 65, 12)", "rgb(37, 99, 235)", "rgb(5, 150, 105)"],
//         borderWidth: 2,
//         borderRadius: 10,
//         borderSkipped: false,
//         barThickness: 48,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       title: { display: false },
//       tooltip: {
//         backgroundColor: "rgba(17, 24, 39, 0.94)",
//         titleFont: { size: 14, weight: 600 },
//         bodyFont: { size: 13 },
//         padding: 12,
//         cornerRadius: 10,
//         callbacks: {
//           label: (context) => {
//             const value = context.parsed.y;
//             const label = context.label;
//             if (label.includes("Attendance")) return `${label}: ${value.toFixed(1)}%`;
//             return `${label}: ${value.toLocaleString("en-IN")}`;
//           },
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         suggestedMax:
//           Math.max(target.targetGiven || 0, target.targetCompleted || 0, 100) * 1.18 || 120,
//         grid: { color: "rgba(0, 0, 0, 0.04)" },
//         ticks: { stepSize: 20, font: { size: 12 } },
//       },
//       x: {
//         grid: { display: false },
//         ticks: { font: { size: 13 } },
//       },
//     },
//   };

//   // Prepare salary table rows
//   const allSalaryRecords = sal.salaryRecords || [];

//   const filteredSalaryRecords = allSalaryRecords.filter((record) => {
//     const dateStr =
//       record.paymentDate ||
//       record.payDate ||
//       record.salaryPeriod?.endDate ||
//       record.createdAt;

//     if (!dateStr) return true;

//     const recordDate = new Date(dateStr);
//     if (isNaN(recordDate.getTime())) return false;

//     let match = true;
//     if (startDate) match = match && recordDate >= new Date(startDate);
//     if (endDate) {
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
//       match = match && recordDate <= end;
//     }
//     return match;
//   });

//   const salaryTableData = filteredSalaryRecords.map((record, index) => ({
//     srNo: index + 1,
//     presentDays: record.presentDays ?? 0,
//     grossSalary: record.grossSalary ?? 0,
//     incentive: record.incentives ?? 0,
//     pf: record.providentFund ?? 0,
//     advanceGiven: (record.advanceSalary || []).reduce((sum, a) => sum + (a.amount || 0), 0),
//     deductions: record.totalDeductions ?? 0,
//     totalPay: (record.grossSalary ?? 0) + (record.incentives ?? 0),
//     netPay: record.netSalary ?? 0,
//     payDate:
//       record.paymentDate
//         ? new Date(record.paymentDate).toLocaleDateString("en-IN")
//         : record.salaryPeriod?.endDate
//         ? new Date(record.salaryPeriod.endDate).toLocaleDateString("en-IN")
//         : "—",
//     finalPay: record.netSalary ?? 0, // or use record.finalPay if you add it later
//     balanceOnAdvance: record.balanceOnAdvance ?? 0, // ← FIXED HERE
//   }));

//   // Print salary table
//   const handlePrint = () => {
//     if (!salaryTableData.length) {
//       toast.warn("No salary data to print");
//       return;
//     }

//     const printWindow = window.open("", "_blank", "width=1100,height=900");
//     if (!printWindow) {
//       toast.error("Popup blocked. Please allow popups.");
//       return;
//     }

//     const emp = employees.find((e) => e._id === selectedEmployeeId);
//     const empName = emp ? `${emp.fullName} (${emp.employeeId || "—"})` : "Employee";

//     const content = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>Salary Report - ${empName}</title>
//   <style>
//     body { font-family: Arial, sans-serif; margin: 20px; font-size: 11pt; }
//     h1 { text-align: center; color: #1f2937; }
//     .subtitle { text-align: center; color: #4b5563; margin-bottom: 20px; }
//     table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//     th, td { border: 1px solid #374151; padding: 8px; text-align: right; }
//     th { background: #0f766e; color: white; text-align: center; }
//     td:first-child { text-align: center; }
//     .amount { font-family: 'Segoe UI', sans-serif; }
//     .footer { text-align: center; color: #6b7280; font-size: 9pt; margin-top: 40px; }
//     @page { size: landscape; margin: 12mm; }
//   </style>
// </head>
// <body>
//   <h1>Salary & Payment Details</h1>
//   <div class="subtitle">${empName} • ${startDate || "—"} to ${endDate || "—"}</div>
  
//   <table>
//     <thead>
//       <tr>
//         <th>SR</th>
//         <th>Present Days</th>
//         <th>Gross</th>
//         <th>Incentive</th>
//         <th>PF</th>
//         <th>Advance</th>
//         <th>Deductions</th>
//         <th>Total Pay</th>
//         <th>Net Pay</th>
//         <th>Pay Date</th>
//         <th>Final Pay</th>
//         <th>Balance on Advance</th>
//       </tr>
//     </thead>
//     <tbody>
//       ${salaryTableData
//         .map(
//           (row) => `
//         <tr>
//           <td>${row.srNo}</td>
//           <td>${row.presentDays}</td>
//           <td class="amount">₹${row.grossSalary.toLocaleString("en-IN")}</td>
//           <td class="amount">₹${row.incentive.toLocaleString("en-IN")}</td>
//           <td class="amount">₹${row.pf.toLocaleString("en-IN")}</td>
//           <td class="amount">₹${row.advanceGiven.toLocaleString("en-IN")}</td>
//           <td class="amount">₹${row.deductions.toLocaleString("en-IN")}</td>
//           <td class="amount">₹${row.totalPay.toLocaleString("en-IN")}</td>
//           <td class="amount">₹${row.netPay.toLocaleString("en-IN")}</td>
//           <td>${row.payDate}</td>
//           <td class="amount">₹${row.finalPay.toLocaleString("en-IN")}</td>
//           <td class="amount">₹${row.balanceOnAdvance.toLocaleString("en-IN")}</td>
//         </tr>`
//         )
//         .join("")}
//     </tbody>
//   </table>

//   <div class="footer">Generated on ${new Date().toLocaleString("en-IN")} • Confidential</div>
// </body>
// </html>`;

//     printWindow.document.write(content);
//     printWindow.document.close();
//     printWindow.onload = () => {
//       printWindow.focus();
//       setTimeout(() => printWindow.print(), 400);
//     };
//   };

//   // CSV download
//   const handleDownloadCSV = () => {
//     if (!salaryTableData.length) {
//       toast.warn("No salary data to download");
//       return;
//     }

//     const headers = [
//       "Present Days",
//       "Gross Salary",
//       "Incentive",
//       "PF",
//       "Advance Given",
//       "Deductions",
//       "Total Pay",
//       "Net Pay",
//       "Pay Date",
//       "Final Pay",
//       "Balance on Advance",
//     ];

//     const rows = salaryTableData.map((row) =>
//       [
//         row.presentDays,
//         row.grossSalary,
//         row.incentive,
//         row.pf,
//         row.advanceGiven,
//         row.deductions,
//         row.totalPay,
//         row.netPay,
//         `"${row.payDate.replace(/"/g, '""')}"`,
//         row.finalPay,
//         row.balanceOnAdvance,
//       ].join(",")
//     );

//     const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `Salary_${selectedEmployeeId || "report"}.csv`;
//     link.click();
//     URL.revokeObjectURL(url);
//     toast.success("CSV downloaded");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-[95vw] mx-auto">
//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow p-6 mb-8">
//           <h1 className="text-2xl font-bold mb-6 text-gray-800">
//             Employee Performance & Salary Report
//           </h1>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Search by Name
//               </label>
//               <Select
//                 options={nameOptions}
//                 value={selectedNameOption}
//                 onChange={handleNameChange}
//                 placeholder="Select employee name..."
//                 isClearable
//                 isSearchable
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Search by ID
//               </label>
//               <Select
//                 options={idOptions}
//                 value={selectedIdOption}
//                 onChange={handleIdChange}
//                 placeholder="Select employee ID..."
//                 isClearable
//                 isSearchable
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//               <select
//                 value={selectedRole}
//                 onChange={(e) => setSelectedRole(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
//               >
//                 <option value="">All Roles</option>
//                 <option value="telecaller">Telecaller</option>
//                 <option value="salesman">Salesman</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
//               />
//             </div>
//             <div className="flex items-end">
//               <button
//                 onClick={fetchReportData}
//                 disabled={loading || !selectedEmployeeId}
//                 className="w-full bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded font-medium disabled:opacity-60 transition"
//               >
//                 {loading ? "Loading..." : "Generate Report"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {loading ? (
//           <div className="text-center py-16">
//             <div className="animate-spin h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading report...</p>
//           </div>
//         ) : reportData && selectedEmployeeId ? (
//           <>
//             {/* KPI Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//               <div className="bg-white p-6 rounded-lg shadow text-center">
//                 <h3 className="text-sm font-medium text-gray-500">Target Given</h3>
//                 <p className="text-3xl font-bold text-orange-600 mt-2">
//                   {target.targetGiven || 0}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow text-center">
//                 <h3 className="text-sm font-medium text-gray-500">Target Completed</h3>
//                 <p className="text-3xl font-bold text-blue-600 mt-2">
//                   {target.targetCompleted || 0}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow text-center">
//                 <h3 className="text-sm font-medium text-gray-500">Completion %</h3>
//                 <p className="text-3xl font-bold text-teal-600 mt-2">
//                   {target.targetCompletionPercent || "0%"}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow text-center">
//                 <h3 className="text-sm font-medium text-gray-500">Attendance %</h3>
//                 <p className="text-3xl font-bold text-green-600 mt-2">
//                   {att.attendancePercent || "0%"}
//                 </p>
//               </div>
//             </div>

//             {/* Chart */}
//             <div className="bg-white rounded-xl shadow p-6 mb-10">
//               <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">
//                 Performance Overview
//               </h2>
//               <div className="h-96 md:h-[420px]">
//                 <Bar data={chartData} options={chartOptions} />
//               </div>
//             </div>

//             {/* Salary Section */}
//             <div className="bg-white rounded-lg shadow p-6 border-2 border-teal-500 mb-10">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold">Salary & Payment Details</h2>
//                 {salaryTableData.length > 0 && (
//                   <div className="flex gap-3">
//                     <button
//                       onClick={handlePrint}
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm flex items-center gap-2"
//                     >
//                       <Printer size={16} /> Print
//                     </button>
//                     <button
//                       onClick={handleDownloadCSV}
//                       className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm flex items-center gap-2"
//                     >
//                       <Download size={16} /> CSV
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {salaryTableData.length > 0 ? (
//                 <Table
//                   data={salaryTableData}
//                   columns={[
//                     { header: "SR No", key: "srNo" },
//                     { header: "Present Days", key: "presentDays" },
//                     {
//                       header: "Gross Salary",
//                       render: (row) => `₹${row.grossSalary.toLocaleString("en-IN")}`,
//                     },
//                     {
//                       header: "Incentive",
//                       render: (row) => `₹${row.incentive.toLocaleString("en-IN")}`,
//                     },
//                     {
//                       header: "PF",
//                       render: (row) => `₹${row.pf.toLocaleString("en-IN")}`,
//                     },
//                     {
//                       header: "Advance Given",
//                       render: (row) => `₹${row.advanceGiven.toLocaleString("en-IN")}`,
//                     },
//                     {
//                       header: "Deductions",
//                       render: (row) => `₹${row.deductions.toLocaleString("en-IN")}`,
//                     },
//                     {
//                       header: "Total Pay",
//                       render: (row) => `₹${row.totalPay.toLocaleString("en-IN")}`,
//                     },
//                     {
//                       header: "Net Pay",
//                       render: (row) => `₹${row.netPay.toLocaleString("en-IN")}`,
//                     },
//                     { header: "Pay Date", key: "payDate" },
//                     {
//                       header: "Final Pay",
//                       render: (row) => `₹${row.finalPay.toLocaleString("en-IN")}`,
//                     },
//                     {
//                       header: "Balance on Advance",
//                       render: (row) => `₹${row.balanceOnAdvance.toLocaleString("en-IN")}`,
//                     },
//                   ]}
//                   pagination={true}
//                   defaultPageSize={10}
//                   showSrNo={false} // already have srNo column
//                 />
//               ) : (
//                 <div className="text-center py-12 text-gray-600">
//                   No salary records found in selected period
//                 </div>
//               )}
//             </div>

//             {/* Optional: Task & Attendance sections can stay as they were */}
//           </>
//         ) : (
//           !loading &&
//           !selectedEmployeeId && (
//             <div className="bg-white rounded-lg shadow p-12 text-center text-gray-600">
//               <p className="text-lg font-medium text-gray-700">
//                 Select an employee to view their performance and salary report
//               </p>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// }



// src/pages/EmployeeReport.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../../../services/apiClient";
import Select from "react-select";
import Table from "../../../components/mainComponents/Table";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Printer, Download } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function EmployeeReport() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedNameOption, setSelectedNameOption] = useState(null);
  const [selectedIdOption, setSelectedIdOption] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch employees list once
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await apiClient.get("/employees/dropdown");
        setEmployees(res.data?.data || []);
      } catch (err) {
        toast.error("Failed to load employee list");
      }
    };
    fetchEmployees();
  }, []);

  // Reset employee selection if role filter excludes current selection
  useEffect(() => {
    if (!selectedEmployeeId) return;

    const selectedEmp = employees.find((e) => e._id === selectedEmployeeId);
    if (selectedEmp && selectedRole && selectedEmp.role !== selectedRole) {
      setSelectedEmployeeId("");
      setSelectedNameOption(null);
      setSelectedIdOption(null);
      setReportData(null);
    }
  }, [selectedRole, employees, selectedEmployeeId]);

  const fetchReportData = async () => {
    if (!selectedEmployeeId) {
      toast.warn("Please select an employee first");
      return;
    }

    setLoading(true);
    try {
      const params = { employeeId: selectedEmployeeId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (selectedRole) params.role = selectedRole;

      const res = await apiClient.get("/employees/reports", { params });
      setReportData(res.data || null);
      toast.success("Report loaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when employee or date range changes
  useEffect(() => {
    if (selectedEmployeeId) {
      fetchReportData();
    }
  }, [selectedEmployeeId, startDate, endDate, selectedRole]);

  // Sync name ↔ id dropdowns
  const handleNameChange = (option) => {
    setSelectedNameOption(option);
    setSelectedIdOption(
      option
        ? {
            value: option.value,
            label: employees.find((e) => e._id === option.value)?.employeeId || "No ID",
          }
        : null
    );
    setSelectedEmployeeId(option ? option.value : "");
  };

  const handleIdChange = (option) => {
    setSelectedIdOption(option);
    setSelectedNameOption(
      option
        ? {
            value: option.value,
            label: employees.find((e) => e._id === option.value)?.fullName || "Unnamed",
          }
        : null
    );
    setSelectedEmployeeId(option ? option.value : "");
  };

  const nameOptions = employees
    .filter((emp) => !selectedRole || emp.role === selectedRole)
    .map((emp) => ({
      value: emp._id,
      label: emp.fullName || "Unnamed",
    }));

  const idOptions = employees
    .filter((emp) => !selectedRole || emp.role === selectedRole)
    .map((emp) => ({
      value: emp._id,
      label: emp.employeeId || "No ID",
    }));

  // Extract data with safe defaults
  const target = reportData?.targetOverview || {};
  const att = reportData?.attendanceSummary || {};
  const tasks = reportData?.taskSummary || {};
  const sal = reportData?.salarySummary || {};

  // Chart data (unchanged)
  const chartData = {
    labels: ["Target Given", "Target Completed", "Attendance %"],
    datasets: [
      {
        label: "Performance",
        data: [
          target.targetGiven || 0,
          target.targetCompleted || 0,
          parseFloat(att.attendancePercent?.replace("%", "")) || 0,
        ],
        backgroundColor: [
          "rgba(251, 146, 60, 0.82)",
          "rgba(96, 165, 250, 0.82)",
          "rgba(52, 211, 153, 0.82)",
        ],
        borderColor: ["rgb(194, 65, 12)", "rgb(37, 99, 235)", "rgb(5, 150, 105)"],
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
        barThickness: 48,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.94)",
        titleFont: { size: 14, weight: 600 },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            const label = context.label;
            if (label.includes("Attendance")) return `${label}: ${value.toFixed(1)}%`;
            return `${label}: ${value.toLocaleString("en-IN")}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax:
          Math.max(target.targetGiven || 0, target.targetCompleted || 0, 100) * 1.18 || 120,
        grid: { color: "rgba(0, 0, 0, 0.04)" },
        ticks: { stepSize: 20, font: { size: 12 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 13 } },
      },
    },
  };

  // Prepare salary table rows (unchanged)
  const allSalaryRecords = sal.salaryRecords || [];

  const filteredSalaryRecords = allSalaryRecords.filter((record) => {
    const dateStr =
      record.paymentDate ||
      record.payDate ||
      record.salaryPeriod?.endDate ||
      record.createdAt;

    if (!dateStr) return true;

    const recordDate = new Date(dateStr);
    if (isNaN(recordDate.getTime())) return false;

    let match = true;
    if (startDate) match = match && recordDate >= new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      match = match && recordDate <= end;
    }
    return match;
  });

  const salaryTableData = filteredSalaryRecords.map((record, index) => ({
    srNo: index + 1,
    presentDays: record.presentDays ?? 0,
    grossSalary: record.grossSalary ?? 0,
    incentive: record.incentives ?? 0,
    pf: record.providentFund ?? 0,
    advanceGiven: (record.advanceSalary || []).reduce((sum, a) => sum + (a.amount || 0), 0),
    deductions: record.totalDeductions ?? 0,
    totalPay: (record.grossSalary ?? 0) + (record.incentives ?? 0),
    netPay: record.netSalary ?? 0,
    payDate:
      record.paymentDate
        ? new Date(record.paymentDate).toLocaleDateString("en-IN")
        : record.salaryPeriod?.endDate
        ? new Date(record.salaryPeriod.endDate).toLocaleDateString("en-IN")
        : "—",
    finalPay: record.netSalary ?? 0,
    balanceOnAdvance: record.balanceOnAdvance ?? 0,
  }));

  // ────────────────────────────────────────────────
  // PRINT Salary & Payment Details using hidden iframe
  // ────────────────────────────────────────────────
  const handlePrint = () => {
    if (!salaryTableData.length) {
      toast.warn("No salary data to print");
      return;
    }

    const emp = employees.find((e) => e._id === selectedEmployeeId);
    const empName = emp ? `${emp.fullName} (${emp.employeeId || "—"})` : "Employee";

    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Salary Report - ${empName}</title>
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
            color: #1f2937;
          }
          .subtitle {
            text-align: center;
            color: #4b5563;
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
            text-align: right;
          }
          th {
            background-color: #e0f2f1;
            color: #1a3c34;
            font-weight: bold;
            text-align: center;
          }
          td:first-child {
            text-align: center;
          }
          .amount {
            font-family: 'Segoe UI', sans-serif;
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
          .footer {
            text-align: center;
            color: #6b7280;
            font-size: 9pt;
            margin-top: 40px;
          }
          @media print {
            body { padding: 12mm; margin: 0; }
            @page { size: landscape; margin: 12mm; }
          }
        </style>
      </head>
      <body>
        <h1>Salary & Payment Details</h1>
        <div class="subtitle">
          ${empName} • ${startDate || "—"} to ${endDate || "—"}
        </div>

        <table>
          <thead>
            <tr>
              <th>SR</th>
              <th>Present Days</th>
              <th>Gross</th>
              <th>Incentive</th>
              <th>PF</th>
              <th>Advance</th>
              <th>Deductions</th>
              <th>Total Pay</th>
              <th>Net Pay</th>
              <th>Pay Date</th>
              <th>Final Pay</th>
              <th>Balance on Advance</th>
            </tr>
          </thead>
          <tbody>
            ${salaryTableData
              .map(
                (row) => `
              <tr>
                <td style="text-align:center;">${row.srNo}</td>
                <td>${row.presentDays}</td>
                <td class="amount">₹${row.grossSalary.toLocaleString("en-IN")}</td>
                <td class="amount">₹${row.incentive.toLocaleString("en-IN")}</td>
                <td class="amount">₹${row.pf.toLocaleString("en-IN")}</td>
                <td class="amount">₹${row.advanceGiven.toLocaleString("en-IN")}</td>
                <td class="amount">₹${row.deductions.toLocaleString("en-IN")}</td>
                <td class="amount">₹${row.totalPay.toLocaleString("en-IN")}</td>
                <td class="amount">₹${row.netPay.toLocaleString("en-IN")}</td>
                <td>${row.payDate}</td>
                <td class="amount">₹${row.finalPay.toLocaleString("en-IN")}</td>
                <td class="amount">₹${row.balanceOnAdvance.toLocaleString("en-IN")}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          Total Salary Records: ${salaryTableData.length}  
              |    
          Total Net Pay (shown): ₹${salaryTableData
            .reduce((sum, r) => sum + r.netPay, 0)
            .toLocaleString("en-IN")}
        </div>

        <div class="footer">
          Generated on ${new Date().toLocaleString("en-IN")} • Confidential
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

  // CSV download (unchanged)
  const handleDownloadCSV = () => {
    if (!salaryTableData.length) {
      toast.warn("No salary data to download");
      return;
    }

    const headers = [
      "Present Days",
      "Gross Salary",
      "Incentive",
      "PF",
      "Advance Given",
      "Deductions",
      "Total Pay",
      "Net Pay",
      "Pay Date",
      "Final Pay",
      "Balance on Advance",
    ];

    const rows = salaryTableData.map((row) =>
      [
        row.presentDays,
        row.grossSalary,
        row.incentive,
        row.pf,
        row.advanceGiven,
        row.deductions,
        row.totalPay,
        row.netPay,
        `"${row.payDate.replace(/"/g, '""')}"`,
        row.finalPay,
        row.balanceOnAdvance,
      ].join(",")
    );

    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Salary_${selectedEmployeeId || "report"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[95vw] mx-auto">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Employee Performance & Salary Report
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name
              </label>
              <Select
                options={nameOptions}
                value={selectedNameOption}
                onChange={handleNameChange}
                placeholder="Select employee name..."
                isClearable
                isSearchable
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by ID
              </label>
              <Select
                options={idOptions}
                value={selectedIdOption}
                onChange={handleIdChange}
                placeholder="Select employee ID..."
                isClearable
                isSearchable
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Roles</option>
                <option value="telecaller">Telecaller</option>
                <option value="salesman">Salesman</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchReportData}
                disabled={loading || !selectedEmployeeId}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded font-medium disabled:opacity-60 transition"
              >
                {loading ? "Loading..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading report...</p>
          </div>
        ) : reportData && selectedEmployeeId ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <h3 className="text-sm font-medium text-gray-500">Target Given</h3>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {target.targetGiven || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <h3 className="text-sm font-medium text-gray-500">Target Completed</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {target.targetCompleted || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <h3 className="text-sm font-medium text-gray-500">Completion %</h3>
                <p className="text-3xl font-bold text-teal-600 mt-2">
                  {target.targetCompletionPercent || "0%"}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <h3 className="text-sm font-medium text-gray-500">Attendance %</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {att.attendancePercent || "0%"}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow p-6 mb-10">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">
                Performance Overview
              </h2>
              <div className="h-96 md:h-[420px]">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Salary Section */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-teal-500 mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Salary & Payment Details</h2>
                {salaryTableData.length > 0 && (
                  <div className="flex gap-3">
                    <button
                      onClick={handlePrint}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm flex items-center gap-2"
                    >
                      <Printer size={16} /> Print
                    </button>
                    <button
                      onClick={handleDownloadCSV}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm flex items-center gap-2"
                    >
                      <Download size={16} /> CSV
                    </button>
                  </div>
                )}
              </div>

              {salaryTableData.length > 0 ? (
                <Table
                  data={salaryTableData}
                  columns={[
                    { header: "SR No", key: "srNo" },
                    { header: "Present Days", key: "presentDays" },
                    {
                      header: "Gross Salary",
                      render: (row) => `₹${row.grossSalary.toLocaleString("en-IN")}`,
                    },
                    {
                      header: "Incentive",
                      render: (row) => `₹${row.incentive.toLocaleString("en-IN")}`,
                    },
                    {
                      header: "PF",
                      render: (row) => `₹${row.pf.toLocaleString("en-IN")}`,
                    },
                    {
                      header: "Advance Given",
                      render: (row) => `₹${row.advanceGiven.toLocaleString("en-IN")}`,
                    },
                    {
                      header: "Deductions",
                      render: (row) => `₹${row.deductions.toLocaleString("en-IN")}`,
                    },
                    {
                      header: "Total Pay",
                      render: (row) => `₹${row.totalPay.toLocaleString("en-IN")}`,
                    },
                    {
                      header: "Net Pay",
                      render: (row) => `₹${row.netPay.toLocaleString("en-IN")}`,
                    },
                    { header: "Pay Date", key: "payDate" },
                    {
                      header: "Final Pay",
                      render: (row) => `₹${row.finalPay.toLocaleString("en-IN")}`,
                    },
                    {
                      header: "Balance on Advance",
                      render: (row) => `₹${row.balanceOnAdvance.toLocaleString("en-IN")}`,
                    },
                  ]}
                  pagination={true}
                  defaultPageSize={10}
                  showSrNo={false} // already have srNo column
                />
              ) : (
                <div className="text-center py-12 text-gray-600">
                  No salary records found in selected period
                </div>
              )}
            </div>
          </>
        ) : (
          !loading &&
          !selectedEmployeeId && (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-600">
              <p className="text-lg font-medium text-gray-700">
                Select an employee to view their performance and salary report
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}