
// src/pages/ReceiptsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Table from "../../../../components/mainComponents/Table";
import { Download, Calendar, Printer } from "lucide-react";  // ← added Printer
import apiClient, { apiEndpoints } from "../../../../services/apiClient";

export default function ReceiptsPage() {
  const { id } = useParams();
  const [allReceipts, setAllReceipts] = useState([]); // raw fetched data
  const [displayedReceipts, setDisplayedReceipts] = useState([]); // filtered view
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter form state (temporary until View is clicked)
  const [filterForm, setFilterForm] = useState({
    receiptNo: "",
    sbNo: "",
    paymentMode: "all",
    fromDate: "",
    toDate: "",
  });

  // Applied filters (updated only on View click)
  const [appliedFilters, setAppliedFilters] = useState({
    receiptNo: "",
    sbNo: "",
    paymentMode: "all",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    fetchReceipts();
  }, [id]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch receipts for this doctor
      const response = await apiClient.get(apiEndpoints.receipts.list, {
        params: { doctor: id, limit: 1000 },
      });

      let receipts = response.data.data || response.data.receipts || [];

      // Extra safety filter by doctor ID
      receipts = receipts.filter((r) => {
        return (
          r.payer?.entityId?._id === id ||
          r.doctor === id ||
          r.doctorId === id ||
          r.payerId === id
        );
      });

      // Sort newest first
      receipts.sort((a, b) => {
        const dateA = new Date(a.receiptDate || a.createdAt || 0);
        const dateB = new Date(b.receiptDate || b.createdAt || 0);
        return dateB - dateA;
      });

      setAllReceipts(receipts);
      setDisplayedReceipts(receipts); // initial = all
    } catch (err) {
      console.error("Error fetching receipts:", err);
      setError("Failed to load receipts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filterForm });

    let filtered = [...allReceipts];

    // 1. Search by Receipt No
    if (filterForm.receiptNo.trim()) {
      const search = filterForm.receiptNo.toLowerCase().trim();
      filtered = filtered.filter((r) =>
        (r.receiptNumber || "").toLowerCase().includes(search),
      );
    }

    // 2. Search by SB No — now using referenceNumber
    if (filterForm.sbNo.trim()) {
      const search = filterForm.sbNo.toLowerCase().trim();
      filtered = filtered.filter((r) =>
        (r.referenceNumber || "").toLowerCase().includes(search),
      );
    }

    // 3. Payment Mode
    if (filterForm.paymentMode !== "all") {
      filtered = filtered.filter((r) => {
        const mode = (r.paymentMethod || "").toLowerCase();
        return mode === filterForm.paymentMode.toLowerCase();
      });
    }

    // 4. Date range
    if (filterForm.fromDate) {
      const from = new Date(filterForm.fromDate);
      filtered = filtered.filter((r) => {
        const rDate = new Date(r.receiptDate || r.createdAt || 0);
        return rDate >= from;
      });
    }

    if (filterForm.toDate) {
      const to = new Date(filterForm.toDate);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((r) => {
        const rDate = new Date(r.receiptDate || r.createdAt || 0);
        return rDate <= to;
      });
    }

    setDisplayedReceipts(filtered);
  };

  const handleReset = () => {
    setFilterForm({
      receiptNo: "",
      sbNo: "",
      paymentMode: "all",
      fromDate: "",
      toDate: "",
    });
    setAppliedFilters({
      receiptNo: "",
      sbNo: "",
      paymentMode: "all",
      fromDate: "",
      toDate: "",
    });
    setDisplayedReceipts([...allReceipts]);
  };

  const columns = [
    {
      header: "Receipt No",
      render: (row) => (
        <span className="font-medium text-gray-900">
          {row.receiptNumber || "N/A"}
        </span>
      ),
    },
    {
      header: "Date",
      render: (row) => (
        <span className="text-gray-700">
          {row.receiptDate || row.createdAt
            ? new Date(row.receiptDate || row.createdAt).toLocaleDateString(
                "en-IN",
              )
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Payment Mode",
      render: (row) => (
        <span className="text-gray-700 capitalize">
          {row.paymentMethod || "N/A"}
        </span>
      ),
    },
    {
      header: "Amount",
      render: (row) => (
        <span className="font-semibold text-gray-900">
          ₹{(row.amount || 0).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Reference / SB No",
      render: (row) => (
        <span className="text-gray-700">{row.referenceNumber || "N/A"}</span>
      ),
    },
  ];

  // ────────────────────────────────────────────────
  //          PRINT FULL REPORT (all receipts)
  // ────────────────────────────────────────────────
  const handlePrint = () => {
    if (allReceipts.length === 0) {
      alert("No receipts available to print.");
      return;
    }

    const printWindow = window.open("", "", "width=1100,height=800");

    const totalAmount = allReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipts Report - Complete</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; font-size: 11pt; }
          h1 { text-align: center; margin-bottom: 16px; font-size: 18pt; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th, td { border: 1px solid #444; padding: 8px 10px; text-align: left; }
          th { background-color: #006d77; color: white; font-weight: bold; }
          .amount { text-align: right; }
          .center { text-align: center; }
          .totals { margin-top: 24px; padding: 12px; background: #f8f8f8; border: 1px solid #ccc; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Receipts Report - Complete</h1>
        <table>
          <thead>
            <tr>
              <th>Receipt No</th>
              <th>Date</th>
              <th>Payment Mode</th>
              <th class="amount">Amount</th>
              <th>Reference / SB No</th>
            </tr>
          </thead>
          <tbody>
            ${allReceipts
              .map((r) => {
                const dateStr = r.receiptDate || r.createdAt
                  ? new Date(r.receiptDate || r.createdAt).toLocaleDateString("en-IN")
                  : "N/A";

                return `
                  <tr>
                    <td>${r.receiptNumber || "N/A"}</td>
                    <td>${dateStr}</td>
                    <td class="center">${r.paymentMethod || "N/A"}</td>
                    <td class="amount">₹${(r.amount || 0).toLocaleString("en-IN")}</td>
                    <td>${r.referenceNumber || "N/A"}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          Total Receipts: ${allReceipts.length}  
            |  Total Amount Received: ₹${totalAmount.toLocaleString("en-IN")}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  const handleExportCSV = () => {
    if (!displayedReceipts.length) return;

    const csv = [
      ["Receipt No", "Date", "Payment Mode", "Amount", "Reference / SB No"],
      ...displayedReceipts.map((r) => [
        r.receiptNumber || "N/A",
        r.receiptDate || r.createdAt
          ? new Date(r.receiptDate || r.createdAt).toLocaleDateString("en-IN")
          : "N/A",
        r.paymentMethod || "N/A",
        r.amount || 0,
        r.referenceNumber || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `receipts-doctor-${id}.csv`);
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
          {/* Search by Receipt No */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Search by Receipt No
            </label>
            <input
              type="text"
              value={filterForm.receiptNo}
              onChange={(e) =>
                setFilterForm({ ...filterForm, receiptNo: e.target.value })
              }
              placeholder="Enter Receipt No..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Search by SB No */}
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
              placeholder="Enter SB No (e.g. RML-10000)"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Payment Mode
            </label>
            <select
              value={filterForm.paymentMode}
              onChange={(e) =>
                setFilterForm({ ...filterForm, paymentMode: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
              <option value="upi">UPI</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* From Date */}
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
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* To Date */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">To Date</label>
            <div className="relative">
              <input
                type="date"
                value={filterForm.toDate}
                onChange={(e) =>
                  setFilterForm({ ...filterForm, toDate: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
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
          Receipts ({displayedReceipts.length})
        </h3>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            disabled={allReceipts.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>

          <button
            onClick={handleExportCSV}
            disabled={displayedReceipts.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-6">
        {displayedReceipts.length > 0 ? (
          <Table
            data={displayedReceipts}
            columns={columns}
            pagination={true}
            defaultPageSize={10}
            excludeColumns={[
              "_id",
              "__v",
              "createdAt",
              "updatedAt",
              "payer",
              "doctor",
              "status",
              "transactionRef",
              "notes",
              "currency",
            ]}
          />
        ) : (
          <div className="text-center py-12 text-gray-500 italic">
            No receipts found matching the filters.
          </div>
        )}
      </div>
    </div>
  );
}