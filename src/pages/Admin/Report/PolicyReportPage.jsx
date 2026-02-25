// // // src/pages/PolicyReportPage.jsx
// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import Table from '../../../components/mainComponents/Table';
// // import { Download, Check, X ,Calendar} from 'lucide-react';

// // const policyData = [
// //   {
// //     srNo: 1,
// //     policyDate: "2025-04-11",
// //     company: "Reliance Insurance",
// //     doctor: "Dr. Ram Kumar",
// //     policyNo: "REL-1001",
// //     type: "Health",
// //     amount: 15000,
// //     premium: 11200,
// //     paidBy: "Doctor",
// //     status: "Active",
// //     freshCase: true,
// //     renewCase: false,
// //   },
// //   {
// //     srNo: 2,
// //     policyDate: "2025-04-10",
// //     company: "Star Health",
// //     doctor: "Arun Patel",
// //     policyNo: "STAR-2001",
// //     type: "Life",
// //     amount: 12000,
// //     premium: 7200,
// //     paidBy: "Rapid",
// //     status: "Active",
// //     freshCase: false,
// //     renewCase: true,
// //   },
// //   {
// //     srNo: 3,
// //     policyDate: "2025-04-09",
// //     company: "ICICI Lombard",
// //     doctor: "Dr. Neha Rao",
// //     policyNo: "ICI-3004",
// //     type: "Vehicle",
// //     amount: 8000,
// //     premium: 7800,
// //     paidBy: "Doctor",
// //     status: "Expired",
// //     freshCase: true,
// //     renewCase: false,
// //   },
// //   {
// //     srNo: 4,
// //     policyDate: "2025-04-15",
// //     company: "Reliance Insurance",
// //     doctor: "Dr. Kavita Joshi",
// //     policyNo: "REL-1018",
// //     type: "Health",
// //     amount: 12500,
// //     premium: 11200,
// //     paidBy: "Rapid",
// //     status: "Active",
// //     freshCase: false,
// //     renewCase: true,
// //   },
// //   {
// //     srNo: 5,
// //     policyDate: "2025-07-20",
// //     company: "United Insurance",
// //     doctor: "Dr. Raj Shah",
// //     policyNo: "UNI-501",
// //     type: "Property",
// //     amount: 9000,
// //     premium: 7500,
// //     paidBy: "Doctor",
// //     status: "Active",
// //     freshCase: true,
// //     renewCase: false,
// //   },
// //   {
// //     srNo: 6,
// //     policyDate: "2025-09-12",
// //     company: "Reliance Insurance",
// //     doctor: "Dr. Ram Kumar",
// //     policyNo: "REL-1020",
// //     type: "Health",
// //     amount: 18000,
// //     premium: 11800,
// //     paidBy: "Rapid",
// //     status: "Active",
// //     freshCase: false,
// //     renewCase: true,
// //   },
// //   {
// //     srNo: 7,
// //     policyDate: "2025-09-05",
// //     company: "Star Health",
// //     doctor: "Dr. Priya S",
// //     policyNo: "STAR-2099",
// //     type: "Life",
// //     amount: 15000,
// //     premium: 7200,
// //     paidBy: "Doctor",
// //     status: "Active",
// //     freshCase: true,
// //     renewCase: false,
// //   },
// // ];

// // const totals = {
// //   selected: 7,
// //   amount: 103000,
// //   premium: 103300,
// //   paidByDoctor: 75300,
// //   paidByRapid: 75000,
// // };

// // export default function PolicyReportPage() {
// //   const navigate = useNavigate();

// //   const extraColumns = [

// //     {
// //       header: "Fresh Case",
// //       render: (row) => row.freshCase ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-gray-300" />,
// //     },
// //     {
// //       header: "Renew Case",
// //       render: (row) => row.renewCase ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-gray-300" />,
// //     },
// //   ];

// //   const handleDownloadPDF = () => {
// //     alert("PDF Download - Coming Soon!");
// //   };

// //   return (
// //     <div className="min-h-screen p-6 bg-gray-50">
// //       <h1 className="text-2xl font-bold text-gray-900 mb-6">Policy Report</h1>

// //       {/* Filters */}
// //       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
// //         <div className="grid grid-cols-5 gap-3 mb-3">
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search By Dr</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>All</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Sort by company</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>All</option>
// //             </select>
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
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Sort by Membership</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>Hospital</option>
// //             </select>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-5 gap-3">
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search By City</label>
// //             <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700" />
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search By Paid</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>Rapid</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search by Case</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>Fresh</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search by Month</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>March</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search by Year</label>
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
// //         <div className="grid grid-cols-5 gap-6 text-sm">
// //           <div>
// //             <span className="text-gray-600">Selected Policies:</span>
// //             <span className="ml-2 font-bold text-gray-900">{totals.selected}</span>
// //           </div>
// //           <div>
// //             <span className="text-gray-600">Total Amount:</span>
// //             <span className="ml-2 font-bold text-gray-900">₹{totals.amount.toLocaleString()}</span>
// //           </div>
// //           <div>
// //             <span className="text-gray-600">Total Premium:</span>
// //             <span className="ml-2 font-bold text-gray-900">₹{totals.premium.toLocaleString()}</span>
// //           </div>
// //           <div>
// //             <span className="text-gray-600">Paid by Doctor:</span>
// //             <span className="ml-2 font-bold text-gray-900">₹{totals.paidByDoctor.toLocaleString()}</span>
// //           </div>
// //           <div>
// //             <span className="text-gray-600">Paid by Rapid:</span>
// //             <span className="ml-2 font-bold text-gray-900">₹{totals.paidByRapid.toLocaleString()}</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Table + Download PDF */}
// //       <div className="bg-white rounded-lg shadow-sm">
// //         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
// //           <button
// //             onClick={handleDownloadPDF}
// //             className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800"
// //           >
// //             <Download className="h-4 w-4" />
// //             Download PDF
// //           </button>
// //         </div>

// //         <div className="p-6">
// //           <Table data={policyData} extraColumns={extraColumns} />

// //           {/* Total Row */}
// //           <div className="mt-4 border-t border-gray-200 pt-3">
// //             <div className="grid grid-cols-12 text-sm font-bold text-gray-900">
// //               <div className="col-span-6 text-right pr-4">Total (selected):</div>
// //               <div className="col-span-1">₹103,000</div>
// //               <div className="col-span-1">₹103,300</div>
// //               <div className="col-span-1">7 policies</div>
// //               <div className="col-span-3"></div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }






// src/pages/PolicyReportPage.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import Table from "../../../components/mainComponents/Table";
import { Download, Calendar, Printer } from "lucide-react";
import apiClient, { apiEndpoints } from "../../../services/apiClient";

export default function PolicyReportPage() {
  const [allPolicies, setAllPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const [filters, setFilters] = useState({
    searchByDr: "",
    sortByCompany: "",
    fromDate: "",
    toDate: "",
    sortByMembership: "",
    searchByPaid: "",
    searchByCase: "",
  });

  // Fetch all doctors (paginated)
  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        setDoctorsLoading(true);
        let allDoctors = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const res = await apiClient.get(apiEndpoints.doctors.list, {
            params: { page, limit: 50 },
          });
          const pageDoctors = res.data.data || [];
          allDoctors = [...allDoctors, ...pageDoctors];
          hasMore = res.data.pagination?.current < res.data.pagination?.pages;
          page++;
        }

        setDoctors(allDoctors);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        toast.error("Failed to load doctors list");
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchAllDoctors();
  }, []);

  // Fetch all policies (paginated) + extract unique companies
  useEffect(() => {
    const fetchAllPolicies = async () => {
      setLoading(true);
      try {
        let allPoliciesRaw = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const res = await apiClient.get(apiEndpoints.policies.list, {
            params: { page, limit: 50 },
          });
          const pagePolicies = res.data.data || [];
          allPoliciesRaw = [...allPoliciesRaw, ...pagePolicies];
          hasMore = res.data.pagination?.current < res.data.pagination?.pages;
          page++;
        }

        const flat = allPoliciesRaw.map((p, i) => ({
          srNo: i + 1,
          policyDate:
            p.startDate || p.createdAt
              ? new Date(p.startDate || p.createdAt).toLocaleDateString("en-IN")
              : "—",
          rawStartDate: p.startDate || p.createdAt || null,
          company: p.insuranceCompany?.companyName || "N/A",
          doctor:
            p.policyHolder?.name ||
            p.policyHolder?.entityId?.fullName ||
            p.policyHolder?.entityId?.hospitalName ||
            "N/A",
          policyNo: p.policyNumber || p.policyId || "N/A",
          type: p.insuranceType?.typeName || "N/A",
          amount: Number(p.coverageAmount || 0),
          premium: Number(p.premiumAmount || 0),
          paidBy: p.paidBy === "by_company" ? "Company" : p.paidBy || "N/A",
          status: p.status
            ? p.status.charAt(0).toUpperCase() + p.status.slice(1)
            : "N/A",
          membershipType: p.policyHolder?.type || "unknown",
          renewedFrom: p.renewedFrom,
          isFresh: p.renewedFrom === null ? "✓" : "—",
          isRenew: p.renewedFrom !== null ? "✓" : "—",
        }));

        setAllPolicies(flat);
        setFilteredPolicies(flat);

        const uniqueCompanies = [...new Set(flat.map((p) => p.company))].sort();
        setCompanyOptions(uniqueCompanies.map((name) => ({ value: name, label: name })));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load policies");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPolicies();
  }, []);

  const applyFilters = () => {
    let result = [...allPolicies];

    if (filters.searchByDr) {
      const term = filters.searchByDr.toLowerCase();
      result = result.filter((p) => p.doctor.toLowerCase().includes(term));
    }

    if (filters.sortByCompany) {
      const term = filters.sortByCompany.toLowerCase();
      result = result.filter((p) => p.company.toLowerCase().includes(term));
    }

    if (filters.fromDate) {
      const from = new Date(filters.fromDate);
      result = result.filter((p) => p.rawStartDate && new Date(p.rawStartDate) >= from);
    }

    if (filters.toDate) {
      const to = new Date(filters.toDate);
      to.setHours(23, 59, 59, 999);
      result = result.filter((p) => p.rawStartDate && new Date(p.rawStartDate) <= to);
    }

    if (filters.sortByMembership) {
      if (filters.sortByMembership === "hospital+individual") {
        result = result.filter(
          (p) => p.membershipType === "hospital" || p.membershipType === "doctor"
        );
      } else {
        result = result.filter((p) => p.membershipType === filters.sortByMembership);
      }
    }

    if (filters.searchByPaid) {
      const paid = filters.searchByPaid.toLowerCase();
      if (paid === "rapid") {
        result = result.filter((p) => p.paidBy?.toLowerCase().includes("company"));
      } else {
        result = result.filter((p) => p.paidBy?.toLowerCase().includes(paid));
      }
    }

    if (filters.searchByCase === "fresh") {
      result = result.filter((p) => p.renewedFrom === null);
    } else if (filters.searchByCase === "renew") {
      result = result.filter((p) => p.renewedFrom !== null);
    }

    setFilteredPolicies(result);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchByDr: "",
      sortByCompany: "",
      fromDate: "",
      toDate: "",
      sortByMembership: "",
      searchByPaid: "",
      searchByCase: "",
    });
    setFilteredPolicies(allPolicies);
  };

  const totals = {
    selected: filteredPolicies.length,
    amount: filteredPolicies.reduce((s, p) => s + p.amount, 0),
    premium: filteredPolicies.reduce((s, p) => s + p.premium, 0),
    paidByDoctor: filteredPolicies
      .filter((p) => p.paidBy?.toLowerCase().includes("doctor"))
      .reduce((s, p) => s + p.premium, 0),
    paidByRapid: filteredPolicies
      .filter((p) => p.paidBy?.toLowerCase().includes("company"))
      .reduce((s, p) => s + p.premium, 0),
  };

  const columns = [
    { header: "SR No", render: (r) => r.srNo },
    { header: "Policy Date", render: (r) => r.policyDate },
    { header: "Insurance Company", render: (r) => r.company },
    { header: "Doctor Name", render: (r) => r.doctor },
    { header: "Policy No.", render: (r) => r.policyNo },
    { header: "Insurance Type", render: (r) => r.type },
    { header: "Amount", render: (r) => `₹${r.amount.toLocaleString("en-IN")}` },
    { header: "Premium", render: (r) => `₹${r.premium.toLocaleString("en-IN")}` },
    { header: "Premium Paid By", render: (r) => r.paidBy },
    { header: "Status", render: (r) => r.status },
    {
      header: "Fresh Case",
      render: (r) => <div className="text-center text-lg">{r.isFresh}</div>,
    },
    {
      header: "Renew Case",
      render: (r) => <div className="text-center text-lg">{r.isRenew}</div>,
    },
  ];

  // ────────────────────────────────────────────────
  // PRINT – hidden iframe method (consistent with other reports)
  // ────────────────────────────────────────────────
  const handlePrint = () => {
    if (filteredPolicies.length === 0) {
      toast.info("No policies to print");
      return;
    }

    const isFiltered =
      filters.searchByDr ||
      filters.sortByCompany ||
      filters.fromDate ||
      filters.toDate ||
      filters.sortByMembership ||
      filters.searchByPaid ||
      filters.searchByCase;

    const title = isFiltered ? "Policy Report - Filtered" : "Policy Report - Complete";

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
          .check {
            text-align: center;
            font-size: 14pt;
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
        <h1>Policy Report</h1>
        <div class="subtitle">
          ${isFiltered ? "Filtered View" : "All Policies"} • 
          ${new Date().toLocaleDateString("en-IN")}
        </div>

        <table>
          <thead>
            <tr>
              <th>SR</th>
              <th>Policy Date</th>
              <th>Company</th>
              <th>Doctor</th>
              <th>Policy No.</th>
              <th>Type</th>
              <th class="amount">Amount (₹)</th>
              <th class="amount">Premium (₹)</th>
              <th>Paid By</th>
              <th>Status</th>
              <th>Fresh</th>
              <th>Renew</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPolicies
              .map(
                (p) => `
              <tr>
                <td style="text-align:center;">${p.srNo}</td>
                <td>${p.policyDate}</td>
                <td>${p.company}</td>
                <td>${p.doctor}</td>
                <td>${p.policyNo}</td>
                <td>${p.type}</td>
                <td class="amount">${p.amount.toLocaleString("en-IN")}</td>
                <td class="amount">${p.premium.toLocaleString("en-IN")}</td>
                <td>${p.paidBy}</td>
                <td>${p.status}</td>
                <td class="check">${p.isFresh}</td>
                <td class="check">${p.isRenew}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          Total Policies: ${totals.selected}  
              |     Total Premium: ₹${totals.premium.toLocaleString("en-IN")}
              |     By Doctor: ₹${totals.paidByDoctor.toLocaleString("en-IN")}  
              |     By Rapid: ₹${totals.paidByRapid.toLocaleString("en-IN")}
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
      toast.error("Print preparation failed");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "SR No.",
      "Policy Date",
      "Insurance Company",
      "Doctor Name",
      "Policy No.",
      "Insurance Type",
      "Amount",
      "Premium",
      "Premium Paid By",
      "Status",
      "Fresh Case",
      "Renew Case",
    ];

    const csvRows = filteredPolicies.map((p) =>
      [
        p.srNo,
        `"${p.policyDate.replace(/"/g, '""')}"`,
        `"${p.company.replace(/"/g, '""')}"`,
        `"${p.doctor.replace(/"/g, '""')}"`,
        `"${p.policyNo.replace(/"/g, '""')}"`,
        `"${p.type.replace(/"/g, '""')}"`,
        p.amount,
        p.premium,
        `"${p.paidBy.replace(/"/g, '""')}"`,
        `"${p.status.replace(/"/g, '""')}"`,
        `"${p.isFresh}"`,
        `"${p.isRenew}"`,
      ].join(",")
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const isFiltered =
      filters.searchByDr ||
      filters.sortByCompany ||
      filters.fromDate ||
      filters.toDate ||
      filters.sortByMembership ||
      filters.searchByPaid ||
      filters.searchByCase;

    link.setAttribute(
      "download",
      `policy-report${isFiltered ? "-filtered" : ""}-${new Date().toISOString().split("T")[0]}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  // React-Select options
  const doctorOptions = doctors
    .map((d) => {
      const name = d.fullName || d.name || d.hospitalName || "Unnamed";
      return { value: name, label: name };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-[90vw] mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Policy Report</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Search by Doctor</label>
            <Select
              isClearable
              isSearchable
              placeholder="Search doctor name..."
              value={
                filters.searchByDr
                  ? { value: filters.searchByDr, label: filters.searchByDr }
                  : null
              }
              options={doctorOptions}
              onChange={(opt) => handleFilterChange("searchByDr", opt ? opt.value : "")}
              isLoading={doctorsLoading}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Filter by Company</label>
            <Select
              isClearable
              isSearchable
              placeholder="Search company..."
              value={
                filters.sortByCompany
                  ? { value: filters.sortByCompany, label: filters.sortByCompany }
                  : null
              }
              options={companyOptions}
              onChange={(opt) => handleFilterChange("sortByCompany", opt ? opt.value : "")}
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
            <label className="block text-xs text-gray-600 mb-1">Membership Type</label>
            <select
              value={filters.sortByMembership}
              onChange={(e) => handleFilterChange("sortByMembership", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
            >
              <option value="">All</option>
              <option value="hospital">Hospital</option>
              <option value="doctor">Individual</option>
              <option value="hospital+individual">Hospital + Individual</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Premium Paid By</label>
            <select
              value={filters.searchByPaid}
              onChange={(e) => handleFilterChange("searchByPaid", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
            >
              <option value="">All</option>
              <option value="rapid">Rapid (Company)</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Case Type</label>
            <select
              value={filters.searchByCase}
              onChange={(e) => handleFilterChange("searchByCase", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
            >
              <option value="">All</option>
              <option value="fresh">Fresh</option>
              <option value="renew">Renew</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={applyFilters}
            className="px-8 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="px-8 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 text-sm font-medium text-gray-700">
          <div>
            Selected: <span className="font-bold text-gray-900">{totals.selected}</span>
          </div>
          {/* <div>
            Total Amount:{" "}
            <span className="font-bold text-gray-900">₹{totals.amount.toLocaleString("en-IN")}</span>
          </div> */}
          <div>
            Total Premium:{" "}
            <span className="font-bold text-gray-900">₹{totals.premium.toLocaleString("en-IN")}</span>
          </div>
          <div>
            Paid by Doctor:{" "}
            <span className="font-bold text-gray-900">₹{totals.paidByDoctor.toLocaleString("en-IN")}</span>
          </div>
          <div>
            Paid by Rapid:{" "}
            <span className="font-bold text-gray-900">₹{totals.paidByRapid.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mb-5">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
          disabled={loading || filteredPolicies.length === 0}
        >
          <Printer size={16} />
          Print Report
        </button>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700"
          disabled={loading || filteredPolicies.length === 0}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading policies...</div>
        ) : filteredPolicies.length === 0 ? (
          <div className="p-12 text-center text-gray-500 italic">
            No policies match the current filters
          </div>
        ) : (
          <Table
            data={filteredPolicies}
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












// // // src/pages/PolicyReportPage.jsx
// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import Table from '../../../components/mainComponents/Table';
// // import { Download, Check, X ,Calendar} from 'lucide-react';

// // const policyData = [
// //   {
// //     srNo: 1,
// //     policyDate: "2025-04-11",
// //     company: "Reliance Insurance",
// //     doctor: "Dr. Ram Kumar",
// //     policyNo: "REL-1001",
// //     type: "Health",
// //     amount: 15000,
// //     premium: 11200,
// //     paidBy: "Doctor",
// //     status: "Active",

// //   },
// //   {
// //     srNo: 2,
// //     policyDate: "2025-04-10",
// //     company: "Star Health",
// //     doctor: "Arun Patel",
// //     policyNo: "STAR-2001",
// //     type: "Life",
// //     amount: 12000,
// //     premium: 7200,
// //     paidBy: "Rapid",
// //     status: "Active",

// //   },
// //   {
// //     srNo: 3,
// //     policyDate: "2025-04-09",
// //     company: "ICICI Lombard",
// //     doctor: "Dr. Neha Rao",
// //     policyNo: "ICI-3004",
// //     type: "Vehicle",
// //     amount: 8000,
// //     premium: 7800,
// //     paidBy: "Doctor",
// //     status: "Expired",

// //   },
// //   {
// //     srNo: 4,
// //     policyDate: "2025-04-15",
// //     company: "Reliance Insurance",
// //     doctor: "Dr. Kavita Joshi",
// //     policyNo: "REL-1018",
// //     type: "Health",
// //     amount: 12500,
// //     premium: 11200,
// //     paidBy: "Rapid",
// //     status: "Active",

// //   },
// //   {
// //     srNo: 5,
// //     policyDate: "2025-07-20",
// //     company: "United Insurance",
// //     doctor: "Dr. Raj Shah",
// //     policyNo: "UNI-501",
// //     type: "Property",
// //     amount: 9000,
// //     premium: 7500,
// //     paidBy: "Doctor",
// //     status: "Active",

// //   },
// //   {
// //     srNo: 6,
// //     policyDate: "2025-09-12",
// //     company: "Reliance Insurance",
// //     doctor: "Dr. Ram Kumar",
// //     policyNo: "REL-1020",
// //     type: "Health",
// //     amount: 18000,
// //     premium: 11800,
// //     paidBy: "Rapid",
// //     status: "Active",

// //   },
// //   {
// //     srNo: 7,
// //     policyDate: "2025-09-05",
// //     company: "Star Health",
// //     doctor: "Dr. Priya S",
// //     policyNo: "STAR-2099",
// //     type: "Life",
// //     amount: 15000,
// //     premium: 7200,
// //     paidBy: "Doctor",
// //     status: "Active",

// //   },
// // ];

// // const totals = {
// //   selected: 7,
// //   amount: 103000,
// //   premium: 103300,
// //   paidByDoctor: 75300,
// //   paidByRapid: 75000,
// // };

// // export default function PolicyReportPage() {
// //   const navigate = useNavigate();

// //   const extraColumns = [

// //     {
// //       header: "Fresh Case",
// //       render: (row) => row.freshCase ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-gray-300" />,
// //     },
// //     {
// //       header: "Renew Case",
// //       render: (row) => row.renewCase ? <Check className="h-5 w-5 text-green-600" /> : <Check className="h-5 w-5 text-gray-300" />,
// //     },
// //   ];

// //   const handleDownloadPDF = () => {
// //     alert("PDF Download - Coming Soon!");
// //   };

// //   return (
// //     <div className="min-h-screen p-6 bg-gray-50">
// //       <h1 className="text-2xl font-bold text-gray-900 mb-6">Policy Report</h1>

// //       {/* Filters */}
// //       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
// //         <div className="grid grid-cols-5 gap-3 mb-3">
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search By Dr</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>All</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Sort by company</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>All</option>
// //             </select>
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
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Sort by Membership</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>Hospital</option>
// //             </select>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-5 gap-3">
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search By City</label>
// //             <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700" />
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search By Paid</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>Rapid</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search by Case</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>Fresh</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search by Month</label>
// //             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-200 text-gray-700">
// //               <option>March</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-xs text-gray-600 mb-1">Search by Year</label>
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
// //         <div className="grid grid-cols-5 gap-6 text-sm">
// //           <div>
// //             <span className="text-gray-600">Selected Policies:</span>
// //             <span className="ml-2 font-bold text-gray-900">{totals.selected}</span>
// //           </div>
// //           <div>
// //             <span className="text-gray-600">Total Amount:</span>
// //             <span className="ml-2 font-bold text-gray-900">₹{totals.amount.toLocaleString()}</span>
// //           </div>
// //           <div>
// //             <span className="text-gray-600">Total Premium:</span>
// //             <span className="ml-2 font-bold text-gray-900">₹{totals.premium.toLocaleString()}</span>
// //           </div>
// //           <div>
// //             <span className="text-gray-600">Paid by Doctor:</span>
// //             <span className="ml-2 font-bold text-gray-900">₹{totals.paidByDoctor.toLocaleString()}</span>
// //           </div>
// //           <div>
// //             <span className="text-gray-600">Paid by Rapid:</span>
// //             <span className="ml-2 font-bold text-gray-900">₹{totals.paidByRapid.toLocaleString()}</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Table + Download PDF */}
// //       <div className="bg-white rounded-lg shadow-sm">
// //         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
// //           <button
// //             onClick={handleDownloadPDF}
// //             className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800"
// //           >
// //             <Download className="h-4 w-4" />
// //             Download PDF
// //           </button>
// //         </div>

// //         <div className="p-6">
// //           <Table data={policyData} extraColumns={extraColumns} />

// //           {/* Total Row */}
// //           <div className="mt-4 border-t border-gray-200 pt-3">
// //             <div className="grid grid-cols-12 text-sm font-bold text-gray-900">
// //               <div className="col-span-6 text-right pr-4">Total (selected):</div>
// //               <div className="col-span-1">₹103,000</div>
// //               <div className="col-span-1">₹103,300</div>
// //               <div className="col-span-1">7 policies</div>
// //               <div className="col-span-3"></div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // src/pages/PolicyReportPage.jsx
// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import Table from "../../../components/mainComponents/Table";
// import { Download, Calendar, Printer } from "lucide-react";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";

// export default function PolicyReportPage() {
//   const [allPolicies, setAllPolicies] = useState([]);
//   const [filteredPolicies, setFilteredPolicies] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [doctorsLoading, setDoctorsLoading] = useState(true);

//   const [filters, setFilters] = useState({
//     searchByDr: "",
//     sortByCompany: "",
//     toDate: "",
//     fromDate: "",
//     sortByMembership: "",
//     searchByCity: "",
//     searchByPaid: "",
//     searchByCase: "",
//     searchByMonth: "",
//     searchByYear: "",
//   });

//   // Fetch ALL doctors (handle pagination)
//   useEffect(() => {
//     const fetchAllDoctors = async () => {
//       try {
//         setDoctorsLoading(true);
//         let allDoctors = [];
//         let page = 1;
//         let hasMore = true;

//         while (hasMore) {
//           const res = await apiClient.get(apiEndpoints.doctors.list, {
//             params: { page, limit: 50 },
//           });
//           const pageDoctors = res.data.data || [];
//           allDoctors = [...allDoctors, ...pageDoctors];

//           hasMore = res.data.pagination?.current < res.data.pagination?.pages;
//           page++;
//         }

//         console.log(`[DEBUG] Fetched ${allDoctors.length} doctors`);
//         setDoctors(allDoctors);
//       } catch (err) {
//         console.error("Error fetching doctors:", err);
//         toast.error("Failed to load doctors list");
//       } finally {
//         setDoctorsLoading(false);
//       }
//     };

//     fetchAllDoctors();
//   }, []);

//   // Fetch all policies once
//   useEffect(() => {
//     const fetchAllPolicies = async () => {
//       setLoading(true);
//       try {
//         const res = await apiClient.get(apiEndpoints.policies.list);
//         const raw = res.data.data || [];

//         const flat = raw.map((p, i) => ({
//           srNo: i + 1,
//           policyDate:
//             p.startDate || p.createdAt
//               ? new Date(p.startDate || p.createdAt).toLocaleDateString("en-IN")
//               : "—",
//           rawStartDate: p.startDate || p.createdAt || null,
//           company: p.insuranceCompany?.companyName || "N/A",
//           doctor:
//             p.policyHolder?.name ||
//             p.policyHolder?.entityId?.fullName ||
//             p.policyHolder?.entityId?.hospitalName ||
//             "N/A",
//           policyNo: p.policyNumber || p.policyId || "N/A",
//           type: p.insuranceType?.typeName || "N/A",
//           amount: Number(p.coverageAmount || 0),
//           premium: Number(p.premiumAmount || 0),
//           paidBy: p.paidBy === "by_company" ? "Company" : p.paidBy || "N/A",
//           status: p.status
//             ? p.status.charAt(0).toUpperCase() + p.status.slice(1)
//             : "N/A",
//           membershipType: p.policyHolder?.type || "unknown",
//           renewedFrom: p.renewedFrom,
//         }));

//         setAllPolicies(flat);
//         setFilteredPolicies(flat);
//       } catch (err) {
//         toast.error("Failed to load policies");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllPolicies();
//   }, []);

//   // Apply filters
//   const applyFilters = () => {
//     let result = [...allPolicies];

//     if (filters.searchByDr.trim()) {
//       const term = filters.searchByDr.trim().toLowerCase();
//       result = result.filter((p) => p.doctor.toLowerCase().includes(term));
//     }

//     if (filters.sortByCompany.trim()) {
//       const term = filters.sortByCompany.trim().toLowerCase();
//       result = result.filter((p) => p.company.toLowerCase().includes(term));
//     }

//     if (filters.fromDate) {
//       const from = new Date(filters.fromDate);
//       result = result.filter(
//         (p) => p.rawStartDate && new Date(p.rawStartDate) >= from,
//       );
//     }
//     if (filters.toDate) {
//       const to = new Date(filters.toDate);
//       to.setHours(23, 59, 59, 999);
//       result = result.filter(
//         (p) => p.rawStartDate && new Date(p.rawStartDate) <= to,
//       );
//     }

//     if (filters.sortByMembership) {
//       result = result.filter(
//         (p) => p.membershipType === filters.sortByMembership,
//       );
//     }

//     if (filters.searchByCity.trim()) {
//       const term = filters.searchByCity.trim().toLowerCase();
//       // Placeholder - activate when city field added
//     }

//     if (filters.searchByPaid) {
//       const paid = filters.searchByPaid.toLowerCase();
//       if (paid === "rapid") {
//         result = result.filter((p) =>
//           p.paidBy?.toLowerCase().includes("company"),
//         );
//       } else {
//         result = result.filter((p) => p.paidBy?.toLowerCase().includes(paid));
//       }
//     }

//     if (filters.searchByCase === "fresh") {
//       result = result.filter((p) => p.renewedFrom === null);
//     } else if (filters.searchByCase === "renew") {
//       result = result.filter((p) => p.renewedFrom !== null);
//     }

//     if (filters.searchByMonth || filters.searchByYear) {
//       result = result.filter((p) => {
//         if (!p.rawStartDate) return false;
//         const d = new Date(p.rawStartDate);
//         const monthMatch =
//           !filters.searchByMonth ||
//           d.toLocaleString("en-US", { month: "long" }) ===
//             filters.searchByMonth;
//         const yearMatch =
//           !filters.searchByYear ||
//           d.getFullYear().toString() === filters.searchByYear;
//         return monthMatch && yearMatch;
//       });
//     }

//     setFilteredPolicies(result);
//   };

//   const handleFilterChange = (field, value) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       searchByDr: "",
//       sortByCompany: "",
//       toDate: "",
//       fromDate: "",
//       sortByMembership: "",
//       searchByCity: "",
//       searchByPaid: "",
//       searchByCase: "",
//       searchByMonth: "",
//       searchByYear: "",
//     });
//     setFilteredPolicies(allPolicies);
//   };

//   const totals = {
//     selected: filteredPolicies.length,
//     amount: filteredPolicies.reduce((s, p) => s + p.amount, 0),
//     premium: filteredPolicies.reduce((s, p) => s + p.premium, 0),
//     paidByDoctor: filteredPolicies
//       .filter((p) => p.paidBy?.toLowerCase().includes("doctor"))
//       .reduce((s, p) => s + p.premium, 0),
//     paidByRapid: filteredPolicies
//       .filter((p) => p.paidBy?.toLowerCase().includes("company"))
//       .reduce((s, p) => s + p.premium, 0),
//   };

//   const columns = [
//     { header: "SR No.", render: (r) => r.srNo },
//     { header: "Policy Date", render: (r) => r.policyDate },
//     { header: "Insurance Company", render: (r) => r.company },
//     { header: "Doctor Name", render: (r) => r.doctor },
//     { header: "Policy No.", render: (r) => r.policyNo },
//     { header: "Insurance Type", render: (r) => r.type },
//     { header: "Amount", render: (r) => `₹${r.amount.toLocaleString("en-IN")}` },
//     {
//       header: "Premium",
//       render: (r) => `₹${r.premium.toLocaleString("en-IN")}`,
//     },
//     { header: "Premium Paid By", render: (r) => r.paidBy },
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
//   ];

//   // Print ONLY the visible table + totals (same content as displayed)
//   const handlePrint = () => {
//     // 1. Hide everything except table section and totals
//     const originalStyles = {};
//     const hideSelectors = [
//       "header",
//       "nav",
//       ".filters",
//       ".summary",
//       "button:not(.print-ignore)",
//       "footer",
//       ".mb-6",
//       ".mb-4", // hide filters, summary, buttons
//     ];

//     hideSelectors.forEach((sel) => {
//       document.querySelectorAll(sel).forEach((el) => {
//         originalStyles[el] = el.style.display || "";
//         el.style.display = "none";
//       });
//     });

//     // 2. Add print-friendly styles
//     const style = document.createElement("style");
//     style.innerHTML = `
//       @media print {
//         body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
//         .bg-white { background: white !important; box-shadow: none !important; }
//         table { width: 100%; border-collapse: collapse; font-size: 11pt; }
//         th, td { border: 1px solid #000; padding: 6px; text-align: left; }
//         th { background-color: #f0f0f0; font-weight: bold; }
//         .print-totals { margin-top: 20px; font-weight: bold; font-size: 12pt; }
//       }
//     `;
//     document.head.appendChild(style);

//     // 3. Trigger browser print (prints current visible content)
//     window.print();

//     // 4. Restore after print dialog closes
//     setTimeout(() => {
//       Object.entries(originalStyles).forEach(([el, display]) => {
//         el.style.display = display;
//       });
//       document.head.removeChild(style);
//     }, 100);
//   };

//   // Export CSV (visible data only)
//   const handleExportCSV = () => {
//     const headers = [
//       "SR No.",
//       "Policy Date",
//       "Insurance Company",
//       "Doctor Name",
//       "Policy No.",
//       "Insurance Type",
//       "Amount",
//       "Premium",
//       "Premium Paid By",
//       "Status",
//     ];

//     const csvRows = filteredPolicies.map((p) =>
//       [
//         p.srNo,
//         `"${p.policyDate.replace(/"/g, '""')}"`,
//         `"${p.company.replace(/"/g, '""')}"`,
//         `"${p.doctor.replace(/"/g, '""')}"`,
//         `"${p.policyNo.replace(/"/g, '""')}"`,
//         `"${p.type.replace(/"/g, '""')}"`,
//         p.amount,
//         p.premium,
//         `"${p.paidBy.replace(/"/g, '""')}"`,
//         `"${p.status.replace(/"/g, '""')}"`,
//       ].join(","),
//     );

//     const csvContent = [headers.join(","), ...csvRows].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `policy-report-${new Date().toISOString().split("T")[0]}.csv`,
//     );
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     toast.success("CSV exported successfully!");
//   };

//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 max-w-[79vw]">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Policy Report</h1>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//         <div className="grid grid-cols-5 gap-3 mb-3">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Search By Dr
//             </label>
//             <input
//               type="text"
//               value={filters.searchByDr}
//               onChange={(e) => handleFilterChange("searchByDr", e.target.value)}
//               placeholder="Enter doctor name"
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Sort by company
//             </label>
//             <input
//               type="text"
//               value={filters.sortByCompany}
//               onChange={(e) =>
//                 handleFilterChange("sortByCompany", e.target.value)
//               }
//               placeholder="Enter company name"
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10"
//               />
//               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">To Date</label>
//             <div className="relative">
//               <input
//                 type="date"
//                 value={filters.toDate}
//                 onChange={(e) => handleFilterChange("toDate", e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10"
//               />
//               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Sort by Membership
//             </label>
//             <select
//               value={filters.sortByMembership}
//               onChange={(e) =>
//                 handleFilterChange("sortByMembership", e.target.value)
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             >
//               <option value="">All</option>
//               <option value="hospital">Hospital</option>
//               <option value="doctor">Doctor</option>
//               <option value="individual">Individual</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-5 gap-3">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Search By City
//             </label>
//             <input
//               type="text"
//               value={filters.searchByCity}
//               onChange={(e) =>
//                 handleFilterChange("searchByCity", e.target.value)
//               }
//               placeholder="Enter city name"
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Search By Paid
//             </label>
//             <select
//               value={filters.searchByPaid}
//               onChange={(e) =>
//                 handleFilterChange("searchByPaid", e.target.value)
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             >
//               <option value="">All</option>
//               <option value="Rapid">Rapid</option>
//               <option value="Doctor">Doctor</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Search by Case
//             </label>
//             <select
//               value={filters.searchByCase}
//               onChange={(e) =>
//                 handleFilterChange("searchByCase", e.target.value)
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             >
//               <option value="">All</option>
//               <option value="fresh">Fresh</option>
//               <option value="renew">Renew</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Search by Month
//             </label>
//             <select
//               value={filters.searchByMonth}
//               onChange={(e) =>
//                 handleFilterChange("searchByMonth", e.target.value)
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             >
//               <option value="">All</option>
//               {months.map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">
//               Search by Year
//             </label>
//             <select
//               value={filters.searchByYear}
//               onChange={(e) =>
//                 handleFilterChange("searchByYear", e.target.value)
//               }
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//             >
//               <option value="">All</option>
//               <option value="2025">2025</option>
//               <option value="2026">2026</option>
//               <option value="2027">2027</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Apply / Reset */}
//       <div className="flex justify-end gap-2 mb-6">
//         <button
//           onClick={applyFilters}
//           className="px-8 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800 disabled:opacity-50"
//         >
//           Apply
//         </button>
//         <button
//           onClick={handleResetFilters}
//           className="px-8 py-2 border border-gray-300 rounded bg-white text-sm font-medium hover:bg-gray-50"
//         >
//           Reset
//         </button>
//       </div>

//       {/* Summary */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//         <div className="grid grid-cols-5 gap-6 text-sm font-medium text-gray-600">
//           <div>
//             Selected Policies:{" "}
//             <span className="font-bold text-gray-900">{totals.selected}</span>
//           </div>
//           <div>
//             Total Amount:{" "}
//             <span className="font-bold text-gray-900">
//               ₹{totals.amount.toLocaleString("en-IN")}
//             </span>
//           </div>
//           <div>
//             Total Premium:{" "}
//             <span className="font-bold text-gray-900">
//               ₹{totals.premium.toLocaleString("en-IN")}
//             </span>
//           </div>
//           <div>
//             Paid by Doctor:{" "}
//             <span className="font-bold text-gray-900">
//               ₹{totals.paidByDoctor.toLocaleString("en-IN")}
//             </span>
//           </div>
//           <div>
//             Paid by Rapid:{" "}
//             <span className="font-bold text-gray-900">
//               ₹{totals.paidByRapid.toLocaleString("en-IN")}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Print & Export Buttons */}
//       <div className="flex justify-end gap-3 mb-4">
//         <button
//           onClick={handlePrint}
//           className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 print-ignore"
//         >
//           <Printer size={16} />
//           Print Report
//         </button>
//         <button
//           onClick={handleExportCSV}
//           className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 print-ignore"
//         >
//           <Download size={16} />
//           Export CSV
//         </button>
//       </div>

//       {/* Table + Totals (this section will be visible during print) */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden print-section">
//         <div className="p-6">
//           {filteredPolicies.length > 0 ? (
//             <Table
//               data={filteredPolicies}
//               columns={columns}
//               className="policy-table"
//             />
//           ) : (
//             <div className="text-center py-12 text-gray-500">
//               No policies match the selected filters
//             </div>
//           )}
//         </div>

//         {/* Totals row - visible in print */}
//         {filteredPolicies.length > 0 && (
//           <div className="px-6 py-4 border-t bg-gray-50 print-totals">
//             <div className="grid grid-cols-5 gap-6 text-sm font-medium text-gray-600">
//               <div>
//                 Selected Policies: <strong>{totals.selected}</strong>
//               </div>
//               <div>
//                 Total Amount:{" "}
//                 <strong>₹{totals.amount.toLocaleString("en-IN")}</strong>
//               </div>
//               <div>
//                 Total Premium:{" "}
//                 <strong>₹{totals.premium.toLocaleString("en-IN")}</strong>
//               </div>
//               <div>
//                 Paid by Doctor:{" "}
//                 <strong>₹{totals.paidByDoctor.toLocaleString("en-IN")}</strong>
//               </div>
//               <div>
//                 Paid by Rapid:{" "}
//                 <strong>₹{totals.paidByRapid.toLocaleString("en-IN")}</strong>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Month names
// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];


// // src/pages/PolicyReportPage.jsx
// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import Select from "react-select";
// import Table from "../../../components/mainComponents/Table";
// import { Download, Calendar, Printer } from "lucide-react";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";

// export default function PolicyReportPage() {
//   const [allPolicies, setAllPolicies] = useState([]);
//   const [filteredPolicies, setFilteredPolicies] = useState([]);

//   const [doctors, setDoctors] = useState([]);
//   const [companyOptions, setCompanyOptions] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [doctorsLoading, setDoctorsLoading] = useState(true);

//   const [filters, setFilters] = useState({
//     searchByDr: "",
//     sortByCompany: "",
//     fromDate: "",
//     toDate: "",
//     sortByMembership: "",
//     searchByPaid: "",
//     searchByCase: "",
//     // searchByMonth: "",    // commented out - can be re-enabled later
//     // searchByYear: "",
//   });

//   // Fetch all doctors (paginated)
//   useEffect(() => {
//     const fetchAllDoctors = async () => {
//       try {
//         setDoctorsLoading(true);
//         let allDoctors = [];
//         let page = 1;
//         let hasMore = true;

//         while (hasMore) {
//           const res = await apiClient.get(apiEndpoints.doctors.list, {
//             params: { page, limit: 50 },
//           });
//           const pageDoctors = res.data.data || [];
//           allDoctors = [...allDoctors, ...pageDoctors];
//           hasMore = res.data.pagination?.current < res.data.pagination?.pages;
//           page++;
//         }

//         console.log(`[DEBUG] Fetched ${allDoctors.length} doctors`);
//         setDoctors(allDoctors);
//       } catch (err) {
//         console.error("Error fetching doctors:", err);
//         toast.error("Failed to load doctors list");
//       } finally {
//         setDoctorsLoading(false);
//       }
//     };

//     fetchAllDoctors();
//   }, []);

//   // Fetch all policies (paginated) + extract unique companies
//   useEffect(() => {
//     const fetchAllPolicies = async () => {
//       setLoading(true);
//       try {
//         let allPoliciesRaw = [];
//         let page = 1;
//         let hasMore = true;

//         while (hasMore) {
//           const res = await apiClient.get(apiEndpoints.policies.list, {
//             params: { page, limit: 50 },
//           });
//           const pagePolicies = res.data.data || [];
//           allPoliciesRaw = [...allPoliciesRaw, ...pagePolicies];
//           hasMore = res.data.pagination?.current < res.data.pagination?.pages;
//           page++;
//         }

//         const flat = allPoliciesRaw.map((p, i) => ({
//           srNo: i + 1,
//           policyDate:
//             p.startDate || p.createdAt
//               ? new Date(p.startDate || p.createdAt).toLocaleDateString("en-IN")
//               : "—",
//           rawStartDate: p.startDate || p.createdAt || null,
//           company: p.insuranceCompany?.companyName || "N/A",
//           doctor:
//             p.policyHolder?.name ||
//             p.policyHolder?.entityId?.fullName ||
//             p.policyHolder?.entityId?.hospitalName ||
//             "N/A",
//           policyNo: p.policyNumber || p.policyId || "N/A",
//           type: p.insuranceType?.typeName || "N/A",
//           amount: Number(p.coverageAmount || 0),
//           premium: Number(p.premiumAmount || 0),
//           paidBy: p.paidBy === "by_company" ? "Company" : p.paidBy || "N/A",
//           status: p.status
//             ? p.status.charAt(0).toUpperCase() + p.status.slice(1)
//             : "N/A",
//           membershipType: p.policyHolder?.type || "unknown",
//           renewedFrom: p.renewedFrom,
//           isFresh: p.renewedFrom === null ? "✓" : "—",
//           isRenew: p.renewedFrom !== null ? "✓" : "—",
//         }));

//         setAllPolicies(flat);
//         setFilteredPolicies(flat);

//         // Extract unique companies
//         const uniqueCompanies = [...new Set(flat.map((p) => p.company))].sort();
//         setCompanyOptions(uniqueCompanies.map((name) => ({ value: name, label: name })));
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load policies");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllPolicies();
//   }, []);

//   const applyFilters = () => {
//     let result = [...allPolicies];

//     if (filters.searchByDr) {
//       const term = filters.searchByDr.toLowerCase();
//       result = result.filter((p) => p.doctor.toLowerCase().includes(term));
//     }

//     if (filters.sortByCompany) {
//       const term = filters.sortByCompany.toLowerCase();
//       result = result.filter((p) => p.company.toLowerCase().includes(term));
//     }

//     if (filters.fromDate) {
//       const from = new Date(filters.fromDate);
//       result = result.filter((p) => p.rawStartDate && new Date(p.rawStartDate) >= from);
//     }

//     if (filters.toDate) {
//       const to = new Date(filters.toDate);
//       to.setHours(23, 59, 59, 999);
//       result = result.filter((p) => p.rawStartDate && new Date(p.rawStartDate) <= to);
//     }

//     if (filters.sortByMembership) {
//       if (filters.sortByMembership === "hospital+individual") {
//         result = result.filter(
//           (p) => p.membershipType === "hospital" || p.membershipType === "doctor"
//         );
//       } else {
//         result = result.filter((p) => p.membershipType === filters.sortByMembership);
//       }
//     }

//     if (filters.searchByPaid) {
//       const paid = filters.searchByPaid.toLowerCase();
//       if (paid === "rapid") {
//         result = result.filter((p) => p.paidBy?.toLowerCase().includes("company"));
//       } else {
//         result = result.filter((p) => p.paidBy?.toLowerCase().includes(paid));
//       }
//     }

//     if (filters.searchByCase === "fresh") {
//       result = result.filter((p) => p.renewedFrom === null);
//     } else if (filters.searchByCase === "renew") {
//       result = result.filter((p) => p.renewedFrom !== null);
//     }

//     setFilteredPolicies(result);
//   };

//   const handleFilterChange = (field, value) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       searchByDr: "",
//       sortByCompany: "",
//       fromDate: "",
//       toDate: "",
//       sortByMembership: "",
//       searchByPaid: "",
//       searchByCase: "",
//     });
//     setFilteredPolicies(allPolicies);
//   };

//   const totals = {
//     selected: filteredPolicies.length,
//     amount: filteredPolicies.reduce((s, p) => s + p.amount, 0),
//     premium: filteredPolicies.reduce((s, p) => s + p.premium, 0),
//     paidByDoctor: filteredPolicies
//       .filter((p) => p.paidBy?.toLowerCase().includes("doctor"))
//       .reduce((s, p) => s + p.premium, 0),
//     paidByRapid: filteredPolicies
//       .filter((p) => p.paidBy?.toLowerCase().includes("company"))
//       .reduce((s, p) => s + p.premium, 0),
//   };

//   const columns = [
//     { header: "SR No", render: (r) => r.srNo },
//     { header: "Policy Date", render: (r) => r.policyDate },
//     { header: "Insurance Company", render: (r) => r.company },
//     { header: "Doctor Name", render: (r) => r.doctor },
//     { header: "Policy No.", render: (r) => r.policyNo },
//     { header: "Insurance Type", render: (r) => r.type },
//     { header: "Amount", render: (r) => `₹${r.amount.toLocaleString("en-IN")}` },
//     { header: "Premium", render: (r) => `₹${r.premium.toLocaleString("en-IN")}` },
//     { header: "Premium Paid By", render: (r) => r.paidBy },
//     { header: "Status", render: (r) => r.status },
//     {
//       header: "Fresh Case",
//       render: (r) => <div className="text-center text-lg">{r.isFresh}</div>,
//     },
//     {
//       header: "Renew Case",
//       render: (r) => <div className="text-center text-lg">{r.isRenew}</div>,
//     },
//   ];

//   const handlePrint = () => {
//     const printWindow = window.open("", "", "width=1100,height=800");

//     const isFiltered =
//       filters.searchByDr ||
//       filters.sortByCompany ||
//       filters.fromDate ||
//       filters.toDate ||
//       filters.sortByMembership ||
//       filters.searchByPaid ||
//       filters.searchByCase;

//     const title = isFiltered ? "Policy Report - Filtered" : "Policy Report - Complete";

//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>${title}</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 20px; font-size: 11pt; }
//           h1 { text-align: center; margin-bottom: 10px; font-size: 16pt; }
//           table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
//           th, td { border: 1px solid #333; padding: 8px 10px; text-align: left; }
//           th { background-color: #006d77; color: white; font-weight: bold; }
//           .check { font-size: 16pt; text-align: center; }
//           .totals { margin-top: 20px; padding: 12px; background: #f8f8f8; border: 1px solid #ccc; font-weight: bold; }
//         </style>
//       </head>
//       <body>
//         <h1>${title}</h1>
//         <table>
//           <thead>
//             <tr>
//               <th>SR No</th><th>Policy Date</th><th>Insurance Company</th>
//               <th>Doctor Name</th><th>Policy No.</th><th>Insurance Type</th>
//               <th>Amount</th><th>Premium</th><th>Premium Paid By</th>
//               <th>Status</th><th>Fresh Case</th><th>Renew Case</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${filteredPolicies
//               .map(
//                 (p) => `
//               <tr>
//                 <td>${p.srNo}</td>
//                 <td>${p.policyDate}</td>
//                 <td>${p.company}</td>
//                 <td>${p.doctor}</td>
//                 <td>${p.policyNo}</td>
//                 <td>${p.type}</td>
//                 <td>₹${p.amount.toLocaleString("en-IN")}</td>
//                 <td>₹${p.premium.toLocaleString("en-IN")}</td>
//                 <td>${p.paidBy}</td>
//                 <td>${p.status}</td>
//                 <td class="check">${p.isFresh}</td>
//                 <td class="check">${p.isRenew}</td>
//               </tr>
//             `
//               )
//               .join("")}
//           </tbody>
//         </table>
//         <div class="totals">
//           Total Policies: ${totals.selected} | 
//           Total Amount: ₹${totals.amount.toLocaleString("en-IN")} | 
//           Total Premium: ₹${totals.premium.toLocaleString("en-IN")} | 
//           Paid by Doctor: ₹${totals.paidByDoctor.toLocaleString("en-IN")} | 
//           Paid by Rapid: ₹${totals.paidByRapid.toLocaleString("en-IN")}
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
//     const headers = [
//       "SR No.",
//       "Policy Date",
//       "Insurance Company",
//       "Doctor Name",
//       "Policy No.",
//       "Insurance Type",
//       "Amount",
//       "Premium",
//       "Premium Paid By",
//       "Status",
//       "Fresh Case",
//       "Renew Case",
//     ];

//     const csvRows = filteredPolicies.map((p) =>
//       [
//         p.srNo,
//         `"${p.policyDate.replace(/"/g, '""')}"`,
//         `"${p.company.replace(/"/g, '""')}"`,
//         `"${p.doctor.replace(/"/g, '""')}"`,
//         `"${p.policyNo.replace(/"/g, '""')}"`,
//         `"${p.type.replace(/"/g, '""')}"`,
//         p.amount,
//         p.premium,
//         `"${p.paidBy.replace(/"/g, '""')}"`,
//         `"${p.status.replace(/"/g, '""')}"`,
//         `"${p.isFresh}"`,
//         `"${p.isRenew}"`,
//       ].join(",")
//     );

//     const csvContent = [headers.join(","), ...csvRows].join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;

//     const isFiltered =
//       filters.searchByDr ||
//       filters.sortByCompany ||
//       filters.fromDate ||
//       filters.toDate ||
//       filters.sortByMembership ||
//       filters.searchByPaid ||
//       filters.searchByCase;

//     link.setAttribute(
//       "download",
//       `policy-report${isFiltered ? "-filtered" : ""}-${new Date().toISOString().split("T")[0]}.csv`
//     );

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//     toast.success("CSV exported successfully!");
//   };

//   // ────────────────────────────────────────────────
//   //  React-Select options
//   // ────────────────────────────────────────────────
//   const doctorOptions = doctors
//     .map((d) => {
//       const name = d.fullName || d.name || d.hospitalName || "Unnamed";
//       return { value: name, label: name };
//     })
//     .sort((a, b) => a.label.localeCompare(b.label));

//   return (
//     <div className="min-h-screen p-6 bg-gray-50 max-w-[90vw] mx-auto">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Policy Report</h1>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Search by Doctor</label>
//             <Select
//               isClearable
//               isSearchable
//               placeholder="Search doctor name..."
//               value={
//                 filters.searchByDr
//                   ? { value: filters.searchByDr, label: filters.searchByDr }
//                   : null
//               }
//               options={doctorOptions}
//               onChange={(opt) => handleFilterChange("searchByDr", opt ? opt.value : "")}
//               isLoading={doctorsLoading}
//               className="text-sm"
//             />
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Filter by Company</label>
//             <Select
//               isClearable
//               isSearchable
//               placeholder="Search company..."
//               value={
//                 filters.sortByCompany
//                   ? { value: filters.sortByCompany, label: filters.sortByCompany }
//                   : null
//               }
//               options={companyOptions}
//               onChange={(opt) => handleFilterChange("sortByCompany", opt ? opt.value : "")}
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
//             <label className="block text-xs text-gray-600 mb-1">Membership Type</label>
//             <select
//               value={filters.sortByMembership}
//               onChange={(e) => handleFilterChange("sortByMembership", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
//             >
//               <option value="">All</option>
//               <option value="hospital">Hospital</option>
//               <option value="doctor">Individual</option>
//               <option value="hospital+individual">Hospital + Individual</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Premium Paid By</label>
//             <select
//               value={filters.searchByPaid}
//               onChange={(e) => handleFilterChange("searchByPaid", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
//             >
//               <option value="">All</option>
//               <option value="rapid">Rapid (Company)</option>
//               <option value="doctor">Doctor</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs text-gray-600 mb-1">Case Type</label>
//             <select
//               value={filters.searchByCase}
//               onChange={(e) => handleFilterChange("searchByCase", e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-[38px]"
//             >
//               <option value="">All</option>
//               <option value="fresh">Fresh</option>
//               <option value="renew">Renew</option>
//             </select>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-5">
//           <button
//             onClick={applyFilters}
//             className="px-8 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800"
//           >
//             Apply Filters
//           </button>
//           <button
//             onClick={handleResetFilters}
//             className="px-8 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
//         <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 text-sm font-medium text-gray-700">
//           <div>
//             Selected: <span className="font-bold text-gray-900">{totals.selected}</span>
//           </div>
//           <div>
//             Total Amount:{" "}
//             <span className="font-bold text-gray-900">₹{totals.amount.toLocaleString("en-IN")}</span>
//           </div>
//           <div>
//             Total Premium:{" "}
//             <span className="font-bold text-gray-900">₹{totals.premium.toLocaleString("en-IN")}</span>
//           </div>
//           <div>
//             Paid by Doctor:{" "}
//             <span className="font-bold text-gray-900">₹{totals.paidByDoctor.toLocaleString("en-IN")}</span>
//           </div>
//           <div>
//             Paid by Rapid:{" "}
//             <span className="font-bold text-gray-900">₹{totals.paidByRapid.toLocaleString("en-IN")}</span>
//           </div>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end gap-3 mb-5">
//         <button
//           onClick={handlePrint}
//           className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
//         >
//           <Printer size={16} />
//           Print Report
//         </button>
//         <button
//           onClick={handleExportCSV}
//           className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700"
//         >
//           <Download size={16} />
//           Export CSV
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="p-12 text-center text-gray-500">Loading policies...</div>
//         ) : filteredPolicies.length === 0 ? (
//           <div className="p-12 text-center text-gray-500 italic">
//             No policies match the current filters
//           </div>
//         ) : (
//           <Table
//             data={filteredPolicies}
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


