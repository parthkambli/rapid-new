
// src/pages/Admin/RenewalAlertList/ServiceRenewalAlertList.jsx
import React, { useState, useEffect } from "react";
import Table from "../../../components/mainComponents/Table";
import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const ServiceRenewalAlertList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [search, setSearch] = useState("");
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState("");          // ← Changed: Default is "" → All Months
  const [year, setYear] = useState(currentYear.toString());

  // Fetch service renewal alerts from backend
  useEffect(() => {
    const fetchServiceRenewalAlerts = async () => {
      try {
        setLoading(true);

        // Build query params for filtering
        const queryParams = {
          limit: 1000 // Get all matching records
        };
        if (search) queryParams.search = search;
        if (month) queryParams.month = month;     // only sent if month is selected
        if (year) queryParams.year = year;

        const response = await apiHelpers.getList(
          apiEndpoints.renewalAlerts.serviceRenewals,
          queryParams
        );
        setData(response.data || []);
      } catch (err) {
        console.error("Error fetching service renewal alerts:", err);
        setError(err.message || "Failed to fetch service renewal alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRenewalAlerts();
  }, [search, month, year]);

  // Handle export to CSV
  const handleExport = () => {
    if (!data.length) {
      alert("No data to export");
      return;
    }

    const headers = [
      "SrNo",
      "SB No",
      "SB Date",
      "Doctor Name",
      "Membership",
      "Period",
      "Amount",
      "Expiry Date"
    ];

    const csvRows = data.map(row => {
      return [
        row.srNo,
        row.sbNo,
        row.sbDate,
        `"${row.doctorName || ""}"`,
        row.membership || "",
        row.membershipPeriod || "",
        row.amount ? row.amount.replace(/₹|,/g, '') : '',
        row.expiryDate || ""
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Service_Renewals_${month || "All"}_${year || "All"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Service Renewal Alert List</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-center">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Name, SB No, or Membership"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89] w-full"
        />

        {/* Month Dropdown - Default: All Months */}
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

        {/* Custom Year Input */}
        <input
          type="number"
          placeholder="Enter Year (e.g. 2023)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="2000"
          max="2100"
          className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89] w-full"
        />

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium transition-colors w-full sm:w-auto"
        >
          Export to CSV
        </button>
      </div>

      {/* Loading / Error / Table */}
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
          No renewal alerts found for the selected filters
        </div>
      ) : (
        <Table
          data={data}
          headers={[
            "SrNo",
            "SB No",
            "SB Date",
            "Doctor Name",
            "Membership",
            "Period",
            "Amount",
            "Expiry Date",
          ]}
          pagination={true}
        />
      )}
    </div>
  );
};

export default ServiceRenewalAlertList;