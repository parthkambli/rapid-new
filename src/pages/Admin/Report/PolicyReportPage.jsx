
// src/pages/PolicyReportPage.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const debounceTimerRef = useRef(null);

  const [filters, setFilters] = useState({
    searchByDr: "",
    sortByCompany: "",
    fromDate: "",
    toDate: "",
    sortByMembership: "",
    searchByPaid: "",
    searchByCase: "",
  });

  // Debounced server-side doctor search
  const fetchDoctorsBySearch = useCallback(async (searchQuery) => {
    try {
      setDoctorsLoading(true);
      const response = await apiClient.get(apiEndpoints.doctors.forpolicy, {
        params: {
          page: 1,
          limit: 50,
          ...(searchQuery && searchQuery.trim() ? { search: searchQuery.trim() } : {})
        }
      });
      const fetchedDoctors = response.data?.data || [];
      setDoctors(fetchedDoctors);
    } catch (err) {
      console.error('Error searching doctors:', err);
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  const handleDoctorSearchChange = useCallback((value, { action }) => {
    if (action === 'set-value' || action === 'input-blur' || action === 'menu-close') return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => fetchDoctorsBySearch(value), 300);
  }, [fetchDoctorsBySearch]);

  // Initial fetch on mount
  useEffect(() => {
    fetchDoctorsBySearch("");
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, [fetchDoctorsBySearch]);

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
  const doctorOptions = (Array.isArray(doctors) ? doctors : [])
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
              onInputChange={handleDoctorSearchChange}
              onChange={(opt) => handleFilterChange("searchByDr", opt ? opt.value : "")}
              isLoading={doctorsLoading}
              loadingMessage={() => "Searching..."}
              filterOption={() => true} // Let the server handle filtering
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





