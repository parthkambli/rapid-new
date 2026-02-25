// src/pages/InquiriesPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Table from "../../../../components/mainComponents/Table";
import { Download, Plus, Calendar, Printer } from "lucide-react"; // ← added Printer
import apiClient, { apiEndpoints } from "../../../../services/apiClient";
import { toast } from "react-toastify";

export default function InquiriesPage() {
  const { id } = useParams();
  const [allInquiries, setAllInquiries] = useState([]); // raw processed data
  const [displayedInquiries, setDisplayedInquiries] = useState([]); // filtered view
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "call",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Filter form state (temporary until View is clicked)
  const [filterForm, setFilterForm] = useState({
    type: "all",
    by: "",
    fromDate: "",
    toDate: "",
  });

  // Applied filters (updated only on View click)
  const [appliedFilters, setAppliedFilters] = useState({
    type: "all",
    by: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    fetchInquiries();
  }, [id]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(apiEndpoints.doctors.get(id));
      const data = response.data.data || response.data;

      let allFollowUps = [];

      if (
        data.followUps &&
        Array.isArray(data.followUps) &&
        data.followUps.length > 0
      ) {
        allFollowUps = [...allFollowUps, ...data.followUps];
      }

      if (
        data.isLinked &&
        data.linkedDoctor &&
        data.linkedDoctor.followUps?.length > 0
      ) {
        allFollowUps = [...allFollowUps, ...data.linkedDoctor.followUps];
      }

      allFollowUps.sort(
        (a, b) =>
          new Date(b.date || b.createdAt || 0) -
          new Date(a.date || a.createdAt || 0),
      );

      const processed = allFollowUps.map((fu) => ({
        type: fu.type || "Follow-up",
        date: fu.date || fu.createdAt,
        note: fu.notes || fu.remarks || "No note",
        by: fu.createdBy?.fullName || "System",
        createdAt: fu.createdAt, // preserve for new column
      }));

      setAllInquiries(processed);
      setDisplayedInquiries(processed); // initial = all
    } catch (err) {
      console.error("Error fetching inquiries/follow-ups:", err);
      setError("Failed to load inquiries/follow-ups.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filterForm });

    let filtered = [...allInquiries];

    // 1. Type
    if (filterForm.type !== "all") {
      filtered = filtered.filter((item) => {
        const itemType = (item.type || "").toLowerCase();
        return itemType === filterForm.type.toLowerCase();
      });
    }

    // 2. By (created by name)
    if (filterForm.by.trim()) {
      const search = filterForm.by.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        (item.by || "").toLowerCase().includes(search),
      );
    }

    // 3. Date range (on 'date' field)
    if (filterForm.fromDate) {
      const from = new Date(filterForm.fromDate);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date || 0);
        return itemDate >= from;
      });
    }

    if (filterForm.toDate) {
      const to = new Date(filterForm.toDate);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date || 0);
        return itemDate <= to;
      });
    }

    setDisplayedInquiries(filtered);
  };

  const handleReset = () => {
    setFilterForm({
      type: "all",
      by: "",
      fromDate: "",
      toDate: "",
    });
    setAppliedFilters({
      type: "all",
      by: "",
      fromDate: "",
      toDate: "",
    });
    setDisplayedInquiries([...allInquiries]);
  };

  const handleExportCSV = () => {
    if (!displayedInquiries.length) return;

    const csv = [
      ["Type", "Date", "Note", "By"],
      ...displayedInquiries.map((r) => [
        r.type || "N/A",
        r.date ? new Date(r.date).toLocaleString("en-IN") : "N/A",
        r.note || "No note",
        r.by || "System",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `inquiries-followups-doctor-${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ────────────────────────────────────────────────
  //          PRINT FULL REPORT (all inquiries/follow-ups)
  // ────────────────────────────────────────────────
  const handlePrint = () => {
    if (allInquiries.length === 0) {
      alert("No inquiries or follow-ups available to print.");
      return;
    }

    const printWindow = window.open("", "", "width=1100,height=800");

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Inquiries & Follow-ups Report - Complete</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; font-size: 11pt; }
          h1 { text-align: center; margin-bottom: 16px; font-size: 18pt; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th, td { border: 1px solid #444; padding: 8px 10px; text-align: left; }
          th { background-color: #006d77; color: white; font-weight: bold; }
          .date { white-space: nowrap; }
          .totals { margin-top: 24px; padding: 12px; background: #f8f8f8; border: 1px solid #ccc; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Inquiries & Follow-ups Report - Complete</h1>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Next Date</th>
              <th>Created Date</th>
              <th>Note</th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            ${allInquiries
              .map((item) => {
                const nextDate = item.date
                  ? new Date(item.date)
                      .toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .replace(",", "")
                  : "N/A";

                const createdDate = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-IN")
                  : "N/A";

                return `
                  <tr>
                    <td>${item.type || "N/A"}</td>
                    <td class="date">${nextDate}</td>
                    <td class="date">${createdDate}</td>
                    <td>${item.note || "No note"}</td>
                    <td>${item.by || "System"}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          Total Entries: ${allInquiries.length}
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

  const handleSave = async () => {
    try {
      await apiClient.post(apiEndpoints.doctors.followup(id), {
        type: formData.type,
        date: formData.date,
        notes: formData.notes,
      });

      toast.success("Follow-up added successfully");
      setShowForm(false);
      setFormData({
        type: "call",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      fetchInquiries(); // Refresh
    } catch (err) {
      console.error("Error adding follow-up:", err);
      toast.error("Failed to add follow-up");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      type: "call",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
              <option value="email">Email</option>
              <option value="other">Other</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>

          {/* By */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">By</label>
            <input
              type="text"
              value={filterForm.by}
              onChange={(e) =>
                setFilterForm({ ...filterForm, by: e.target.value })
              }
              placeholder="Enter name or System..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
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

      {/* Header with Add & Export & Print */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        {/* <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded text-sm font-medium hover:bg-teal-800"
        >
          <Plus className="h-4 w-4" />
          Add Follow-up
        </button> */}

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            disabled={loading || allInquiries.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>

          <button
            onClick={handleExportCSV}
            disabled={displayedInquiries.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-6">
        {displayedInquiries.length > 0 ? (
          <Table
            data={displayedInquiries}
            columns={[
              {
                header: "Type",
                render: (row) => (
                  <span className="font-medium text-gray-900">
                    {row.type || "N/A"}
                  </span>
                ),
              },
              {
                header: "Next Date",
                render: (row) => (
                  <span className="text-gray-700">
                    {row.date
                      ? new Date(row.date)
                          .toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace(",", "")
                      : "N/A"}
                  </span>
                ),
              },
              {
                header: "Date",
                render: (row) => (
                  <span className="text-gray-700">
                    {row.createdAt
                      ? new Date(row.createdAt)
                          .toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replace(",", "")
                      : "N/A"}
                  </span>
                ),
              },
              {
                header: "Note",
                render: (row) => (
                  <span className="text-gray-700">{row.note || "No note"}</span>
                ),
              },
              {
                header: "By",
                render: (row) => (
                  <span className="text-gray-700">{row.by || "System"}</span>
                ),
              },
            ]}
            pagination={true}
            defaultPageSize={10}
            excludeColumns={["_id", "__v", "createdAt", "updatedAt"]}
          />
        ) : (
          <div className="text-center py-12 text-gray-500 italic">
            No inquiries or follow-ups found matching the filters.
          </div>
        )}
      </div>

      {/* Add Follow-up Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Follow-up</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="call">Call</option>
                  <option value="meeting">Meeting</option>
                  <option value="email">Email</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Note / Remarks
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Enter details of the follow-up..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
              >
                Save Follow-up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
