



// src/pages/Admin/RenewalAlertList/IndemnityRenewalAlertList.jsx
import React, { useState, useEffect } from "react";
import Table from "../../../components/mainComponents/Table";
import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const IndemnityRenewalAlertList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [search, setSearch] = useState("");
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(""); // Default: All Months
  const [year, setYear] = useState(currentYear.toString());

  // Fetch indemnity renewal alerts from backend
  useEffect(() => {
    const fetchIndemnityRenewalAlerts = async () => {
      try {
        setLoading(true);

        const queryParams = {
          limit: 1000
        };
        if (search) queryParams.search = search;
        if (month) queryParams.month = month;
        if (year) queryParams.year = year;

        const response = await apiHelpers.getList(
          apiEndpoints.renewalAlerts.indemnityRenewals,
          queryParams
        );
        setData(response.data || []);
      } catch (err) {
        console.error("Error fetching indemnity renewal alerts:", err);
        setError(err.message || "Failed to fetch indemnity renewal alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchIndemnityRenewalAlerts();
  }, [search, month, year]);

  // Handle export (headers भी अपडेट कर दिए हैं - Insurance Cover और SB No हटा दिए)
  const handleExport = () => {
    if (!data.length) {
      alert("No data to export");
      return;
    }

    const headers = [
      "SrNo",
      "Doctor Name",
      "Policy Start Date",
      "Policy No",
      "Policy Type",
      "Premium",
      "Expiry Date"
    ];

    const csvRows = data.map(row => {
      return [
        row.srNo || "",
        `"${row.doctorName || ""}"`,
        row.policyStartDate || "",
        row.policyNo || "",
        row.policyType || "",
        row.premium ? row.premium.replace(/₹|,/g, '') : '',
        row.expiryDate || ""
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Indemnity_Renewals_${month || "All"}_${year || "All"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Indemnity Renewal Alert List</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by Doctor, Policy or SB No"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89] w-full"
        />

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89] w-full"
        >
          <option value="">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        <input
          type="number"
          placeholder="Enter Year (e.g. 2025)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="2000"
          max="2100"
          className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89] w-full"
        />

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium transition-colors w-full sm:w-auto"
        >
          Export to CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#398C89]"></div>
          <p className="mt-2 text-gray-600">Loading alerts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No indemnity renewal alerts found for the selected filters
        </div>
      ) : (
        <Table
          data={data}
          headers={[
            "SrNo",
            "Doctor Name",
            "Policy Start Date",
            "Policy No",
            "Policy Type",
            "Premium",
            "Expiry Date",
          ]}
          excludeColumns={[ "sbNo", "SB No"]}  // ← ये hide हो जाएंगे
          pagination={true}
         
        />
      )}
    </div>
  );
};

export default IndemnityRenewalAlertList;