import React, { useState, useEffect, useCallback } from "react";
import Table from "../../../components/mainComponents/Table";
import { Link, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";

export default function ExpenseList() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [expensesRaw, setExpensesRaw] = useState([]); // Store raw data for documents
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    mode: "",
    category: "",
    voucherNo: "",
    date: "",
  });

  // Helper function to format payment method
  const formatPaymentMethod = (method) => {
    if (!method) return "";
    const methodMap = {
      "cash": "Cash",
      "neft/rtgs": "NEFT/RTGS",
      "cheque": "Cheque",
      "upi": "UPI",
      "bank_transfer": "Bank Transfer",
      "credit_card": "Credit Card",
      "debit_card": "Debit Card",
      "petty_cash": "Petty Cash"
    };
    return methodMap[method.toLowerCase()] || method.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper function to format status
  const formatStatus = (status) => {
    if (!status) return "Draft";
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  // Map API expense data to display format - Only minimal essential fields
  const mapExpenseData = (expense) => {
    return {
      _id: expense._id, // Keep for actions
      date: expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString("en-GB") : "",
      title: expense.title || "",
      category: expense.category ? expense.category.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "",
      vendor: expense.vendor?.name || "-",
      amount: `₹${expense.amount?.toLocaleString("en-IN") || "0"}`,
      // status: formatStatus(expense.status),
    };
  };

  // Fetch expenses from API
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: 1,
        limit: 1000, // Get all expenses for now
      };

      // Apply filters
      if (filters.name) {
        params.search = filters.name;
      }
      if (filters.mode) {
        params.paymentMethod = filters.mode.toLowerCase();
      }
      if (filters.category) {
        params.category = filters.category.toLowerCase().replace(/\s+/g, "_");
      }
      if (filters.date) {
        params.fromDate = filters.date;
        params.toDate = filters.date;
      }

      const response = await apiClient.get(apiEndpoints.expenses.list, { params });
      const expensesData = response.data.data || response.data || [];

      // Store raw data for document access
      setExpensesRaw(expensesData);

      const mappedData = expensesData.map(mapExpenseData);

      // Additional client-side filtering for voucherNo if needed
      let filtered = mappedData;
      if (filters.voucherNo) {
        filtered = mappedData.filter((exp) =>
          exp.voucherNo.toLowerCase().includes(filters.voucherNo.toLowerCase())
        );
      }

      setExpenses(filtered);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(err.response?.data?.message || "Failed to load expenses. Please try again.");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleEdit = (row) => {
    navigate(`/superadmin/create-expense?id=${row._id}`);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete expense ${row.voucherNo || row.id}?`)) return;

    try {
      setLoading(true);
      await apiClient.delete(apiEndpoints.expenses.delete(row._id || row.id));
      await fetchExpenses(); // Refresh the list
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError(err.response?.data?.message || "Failed to delete expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (row) => {
    navigate(`/superadmin/expense/${row._id}`);
  };

  const handleViewDocuments = (rawExpense) => {
    setSelectedExpense(rawExpense);
    setShowDocumentsModal(true);
    setShowDetailsModal(false); // Close details modal when opening documents
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    
    // If it's already a URL, return as is
    if (filePath.startsWith('http')) {
      return filePath;
    }
    
    // If it starts with /uploads, it's already a relative path
    if (filePath.startsWith('/uploads')) {
      const baseURL = apiClient.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:3000';
      return `${baseURL}${filePath}`;
    }
    
    // If it's an absolute path (Windows or Unix), extract the uploads portion
    if (filePath.includes('uploads')) {
      const uploadsIndex = filePath.lastIndexOf('uploads');
      if (uploadsIndex !== -1) {
        const relativePath = filePath.substring(uploadsIndex).replace(/\\/g, '/');
        const baseURL = apiClient.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:3000';
        return `${baseURL}/${relativePath}`;
      }
    }
    
    // Default: assume it's a relative path from uploads
    const baseURL = apiClient.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:3000';
    return `${baseURL}/uploads/${filePath}`;
  };

  const handleDownload = (filePath, fileName) => {
    const url = getFileUrl(filePath);
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-[79vw]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#1B504E]">Expense</h2>
        <Link to="/superadmin/create-expense">
          <button className="bg-[#1B504E] text-white px-5 py-2 rounded hover:bg-[#16403f]">
            Create Expense
          </button>
        </Link>
      </div>

      {/* Filter Inputs */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <input
          name="name"
          placeholder="Search By name"
          value={filters.name}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <select
          name="mode"
          value={filters.mode}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">Sort by mode</option>
          <option value="cash">Cash</option>
          <option value="neft/rtgs">NEFT/RTGS</option>
          <option value="upi">UPI</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="cheque">Cheque</option>
          <option value="credit_card">Credit Card</option>
          <option value="debit_card">Debit Card</option>
        </select>
        <input
          name="category"
          placeholder="Search By category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <input
          name="voucherNo"
          placeholder="Search By voucher no"
          value={filters.voucherNo}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <p className="text-gray-500">Loading expenses...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <Table
          data={expenses}
          actions={[
            {
              label: "View",
              showAsIcon: true,
              icon: <span className="bg-[#1B504E] text-white px-3 py-1 rounded text-xs hover:bg-[#16403f]">View</span>,
              onClick: handleView,
            },
            {
              label: "Edit",
              showAsIcon: true,
              icon: <span className="bg-green-500 text-white px-3 py-1 rounded text-xs">Edit</span>,
              onClick: handleEdit,
            },
            {
              label: "Delete",
              showAsIcon: true,
              icon: <span className="bg-red-500 text-white px-3 py-1 rounded text-xs">Delete</span>,
              onClick: handleDelete,
            },
          ]}
        />
      )}

      {/* Expense Details Modal */}
      {showDetailsModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[#1B504E] text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-xl font-semibold">Expense Details</h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedExpense(null);
                }}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Title</label>
                    <p className="text-base text-gray-900 mt-1">{selectedExpense.title || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Expense ID</label>
                    <p className="text-base text-gray-900 mt-1">{selectedExpense.expenseId || selectedExpense.expenseNumber || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedExpense.category ? selectedExpense.category.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sub Category</label>
                    <p className="text-base text-gray-900 mt-1">{selectedExpense.subCategory || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedExpense.expenseDate ? new Date(selectedExpense.expenseDate).toLocaleDateString("en-GB") : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="text-base text-gray-900 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedExpense.status === "approved" ? "bg-green-100 text-green-800" :
                        selectedExpense.status === "draft" ? "bg-gray-100 text-gray-800" :
                          selectedExpense.status === "rejected" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                        }`}>
                        {formatStatus(selectedExpense.status)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vendor/Recipient</label>
                    <p className="text-base text-gray-900 mt-1">{selectedExpense.vendor?.name || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      ₹{selectedExpense.amount?.toLocaleString("en-IN") || "0"}
                    </p>
                  </div>
                  {selectedExpense.taxApplicable && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tax Rate</label>
                        <p className="text-base text-gray-900 mt-1">{selectedExpense.taxRate || 0}%</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tax Amount</label>
                        <p className="text-base text-gray-900 mt-1">
                          ₹{(selectedExpense.taxAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Total Amount</label>
                        <p className="text-lg font-semibold text-[#1B504E] mt-1">
                          ₹{((selectedExpense.amount || 0) + (selectedExpense.taxAmount || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Method</label>
                    <p className="text-base text-gray-900 mt-1">{formatPaymentMethod(selectedExpense.paymentMethod) || "-"}</p>
                  </div>
                  {selectedExpense.bankName && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bank Name</label>
                      <p className="text-base text-gray-900 mt-1">{selectedExpense.bankName}</p>
                    </div>
                  )}
                  {selectedExpense.voucherNo && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Voucher No</label>
                      <p className="text-base text-gray-900 mt-1">{selectedExpense.voucherNo}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h4 className="text-lg font-semibold text-[#1B504E] mb-4">Additional Information</h4>
                <div className="grid grid-cols-2 gap-6">
                  {selectedExpense.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-base text-gray-900 mt-1">{selectedExpense.description}</p>
                    </div>
                  )}
                  {selectedExpense.remarks && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Remarks</label>
                      <p className="text-base text-gray-900 mt-1">{selectedExpense.remarks}</p>
                    </div>
                  )}
                  {selectedExpense.note && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Note</label>
                      <p className="text-base text-gray-900 mt-1">{selectedExpense.note}</p>
                    </div>
                  )}
                  {selectedExpense.internalNotes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Internal Notes</label>
                      <p className="text-base text-gray-900 mt-1">{selectedExpense.internalNotes}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reimbursable</label>
                    <p className="text-base text-gray-900 mt-1">{selectedExpense.reimbursable ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reimbursed</label>
                    <p className="text-base text-gray-900 mt-1">{selectedExpense.reimbursed ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              {(selectedExpense.attachment || (selectedExpense.documents && (
                selectedExpense.documents.bill ||
                selectedExpense.documents.receipt ||
                selectedExpense.documents.invoice ||
                (selectedExpense.documents.otherDocuments && selectedExpense.documents.otherDocuments.length > 0)
              ))) && (
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-[#1B504E]">Documents</h4>
                      <button
                        onClick={() => handleViewDocuments(selectedExpense)}
                        className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                      >
                        View All Documents
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedExpense.attachment ? "1 attachment" : ""}
                      {selectedExpense.documents?.bill ? ", Bill" : ""}
                      {selectedExpense.documents?.receipt ? ", Receipt" : ""}
                      {selectedExpense.documents?.invoice ? ", Invoice" : ""}
                      {selectedExpense.documents?.otherDocuments?.length > 0 ? `, ${selectedExpense.documents.otherDocuments.length} other document(s)` : ""}
                    </p>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6 mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedExpense(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEdit({ _id: selectedExpense._id });
                  }}
                  className="px-4 py-2 bg-[#1B504E] text-white rounded hover:bg-[#16403f]"
                >
                  Edit Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocumentsModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Documents - {selectedExpense.title || selectedExpense.expenseNumber}
              </h3>
              <button
                onClick={() => {
                  setShowDocumentsModal(false);
                  setSelectedExpense(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Attachment */}
              {selectedExpense.attachment && (
                <div className="border border-gray-200 rounded p-4">
                  <h4 className="font-semibold mb-2">Attachment</h4>
                  <button
                    onClick={() => handleDownload(selectedExpense.attachment, "Attachment")}
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    📎 {selectedExpense.attachment.split('/').pop() || 'View Attachment'}
                  </button>
                </div>
              )}

              {/* Documents Object */}
              {selectedExpense.documents && (
                <>
                  {selectedExpense.documents.bill && (
                    <div className="border border-gray-200 rounded p-4">
                      <h4 className="font-semibold mb-2">Bill</h4>
                      <button
                        onClick={() => handleDownload(selectedExpense.documents.bill, "Bill")}
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        📎 {selectedExpense.documents.bill.split('/').pop() || 'View Bill'}
                      </button>
                    </div>
                  )}

                  {selectedExpense.documents.receipt && (
                    <div className="border border-gray-200 rounded p-4">
                      <h4 className="font-semibold mb-2">Receipt</h4>
                      <button
                        onClick={() => handleDownload(selectedExpense.documents.receipt, "Receipt")}
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        📎 {selectedExpense.documents.receipt.split('/').pop() || 'View Receipt'}
                      </button>
                    </div>
                  )}

                  {selectedExpense.documents.invoice && (
                    <div className="border border-gray-200 rounded p-4">
                      <h4 className="font-semibold mb-2">Invoice</h4>
                      <button
                        onClick={() => handleDownload(selectedExpense.documents.invoice, "Invoice")}
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        📎 {selectedExpense.documents.invoice.split('/').pop() || 'View Invoice'}
                      </button>
                    </div>
                  )}

                  {selectedExpense.documents.otherDocuments && selectedExpense.documents.otherDocuments.length > 0 && (
                    <div className="border border-gray-200 rounded p-4">
                      <h4 className="font-semibold mb-2">Other Documents</h4>
                      <div className="space-y-2">
                        {selectedExpense.documents.otherDocuments.map((doc, index) => (
                          <div key={index}>
                            <button
                              onClick={() => handleDownload(doc, `Document ${index + 1}`)}
                              className="text-blue-600 hover:text-blue-800 underline text-sm"
                            >
                              📎 {doc.split('/').pop() || `Document ${index + 1}`}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {!selectedExpense.attachment &&
                (!selectedExpense.documents ||
                  (!selectedExpense.documents.bill &&
                    !selectedExpense.documents.receipt &&
                    !selectedExpense.documents.invoice &&
                    (!selectedExpense.documents.otherDocuments || selectedExpense.documents.otherDocuments.length === 0))) && (
                  <p className="text-gray-500 text-center py-4">No documents available</p>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && expenses.length === 0 && (
        <div className="flex justify-center items-center p-8">
          <p className="text-gray-500">No expenses found.</p>
        </div>
      )}
    </div>
  );
}
