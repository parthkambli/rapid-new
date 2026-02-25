import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";

export default function ViewExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper functions for date formatting
  const formatDateToDDMMYY = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
    return `${day}-${month}-${year}`;
  };

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

  // Fetch expense from API
  const fetchExpense = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(apiEndpoints.expenses.get(id));
      const expenseData = response.data.data || response.data;

      // Determine the category based on the expense data
      let category = "";
      if (expenseData.category === 'professional_fees') {
        // Check relatedPerson type first, then subCategory
        if (expenseData.relatedPerson?.type === 'expert' || expenseData.subCategory === 'expert') {
          category = 'expert';
        } else {
          category = 'advocate';
        }
      } else if (expenseData.category === 'office_supplies') {
        category = 'office';
      } else if (expenseData.category === 'utilities' || expenseData.category === 'bank_transfer') {
        category = 'bank';
      }

      // Determine the name based on the related person type
      let advocateName = "";
      let expertName = "";
      if (expenseData.relatedPerson?.type === 'advocate') {
        advocateName = expenseData.vendor?.name || "";
      } else if (expenseData.relatedPerson?.type === 'expert') {
        expertName = expenseData.vendor?.name || "";
      } else if (expenseData.category === 'professional_fees') {
        // Fallback to subcategory if relatedPerson type is not specified
        if (expenseData.subCategory === 'advocate') {
          advocateName = expenseData.vendor?.name || "";
        } else if (expenseData.subCategory === 'expert') {
          expertName = expenseData.vendor?.name || "";
        }
      }

      setExpense({
        ...expenseData,
        category: category,
        paymentDate: expenseData.expenseDate ? new Date(expenseData.expenseDate).toISOString().split('T')[0] : "",
        paymentDateFormatted: expenseData.expenseDate ? formatDateToDDMMYY(expenseData.expenseDate) : "",
        paidBy: expenseData.vendor?.name || expenseData.paidBy || expenseData.bankName || "",
        officeExpenseType: expenseData.subCategory || "Stationery",
        officeRecipient: expenseData.vendor?.name || "",
        officeAmount: expenseData.amount?.toString() || "",
        officeRemarks: expenseData.remarks || "",
        bankName: expenseData.bankName || "",
        bankTxnRef: expenseData.voucherNo || "",
        bankAmount: expenseData.amount?.toString() || "",
        bankRemarks: expenseData.remarks || "",
        advocateName: advocateName,
        expertName: expertName,
        notes: expenseData.note || expenseData.remarks || "",
        taxApplicable: expenseData.taxApplicable !== undefined ? expenseData.taxApplicable : true,
        taxRate: expenseData.taxRate !== undefined ? expenseData.taxRate : 18,
        personType: expenseData.relatedPerson?.type || "",
        personId: expenseData.relatedPerson?.refId || "",
        chequeNumber: expenseData.chequeNumber || "",
        chequeDate: expenseData.chequeDate ? formatDateToDDMMYY(new Date(expenseData.chequeDate)) : "",
        chequeDateISO: expenseData.chequeDate ? new Date(expenseData.chequeDate).toISOString().split('T')[0] : "",
      });
    } catch (err) {
      console.error("Error fetching expense:", err);
      setError(err.response?.data?.message || "Failed to load expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

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

  if (loading) {
    return (
      <div className="mx-auto p-8 min-h-screen max-w-[79vw] flex items-center justify-center">
        <p className="text-gray-500">Loading expense details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-8 min-h-screen max-w-[79vw]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#1B504E] text-white rounded hover:bg-[#16403f]"
        >
          Back
        </button>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="mx-auto p-8 min-h-screen max-w-[79vw]">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Expense not found
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#1B504E] text-white rounded hover:bg-[#16403f]"
        >
          Back
        </button>
      </div>
    );
  }

  // Calculate total based on category
  let total = 0;
  if (expense.category === "office") {
    total = parseFloat(expense.officeAmount) || 0;
  } else if (expense.category === "bank") {
    total = parseFloat(expense.bankAmount) || 0;
  } else if (expense.category === "advocate" || expense.category === "expert") {
    total = (expense.caseRows || []).reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
  }

  return (
    <div className="mx-auto p-8 min-h-screen max-w-[79vw]">
      <h1 className="text-2xl mb-6 font-bold text-gray-800">
        View Payment Entry
      </h1>

      {/* Payment Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold mb-6 text-black">Payment Details</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Date of Payment
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                {expense.paymentDateFormatted || '-'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Payment ID / Voucher No.
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                {expense.voucherNo || '-'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Payment Mode
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                {formatPaymentMethod(expense.paymentMethod) || '-'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Conditionally show Paid By field based on payment mode */}
            {expense.paymentMethod !== "cash" && (
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Paid By
                </label>
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  {expense.paidBy || '-'}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Payment Category
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                {expense.category === 'office' && 'Office Expenses'}
                {expense.category === 'bank' && 'Bank Charges'}
                {expense.category === 'advocate' && 'Advocate Payment'}
                {expense.category === 'expert' && 'Expert Payment'}
                {!expense.category && '-'}
              </div>
            </div>
          </div>

          {/* Conditional fields for Cheque payments */}
          {expense.paymentMethod === "cheque" && (
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Cheque Number
                </label>
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  {expense.chequeNumber || '-'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Cheque Date
                </label>
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  {expense.chequeDate || '-'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Office Expenses Section */}
      {expense.category === "office" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-6 text-black">Office Expenses</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Expense Type</label>
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  {expense.officeExpenseType || '-'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Employee / Recipient Name</label>
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  {expense.officeRecipient || '-'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Amount</label>
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  ₹{expense.officeAmount || '0.00'}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">Remarks</label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 min-h-[72px]">
                {expense.officeRemarks || '-'}
              </div>
            </div>
            <div className="text-lg font-bold text-red-700">
              Total: ₹ {total.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Bank Charges Section */}
      {expense.category === "bank" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-6 text-black">Bank Charges</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Bank Name</label>
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  {expense.bankName || '-'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Transaction Reference No.</label>
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  {expense.bankTxnRef || '-'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Amount</label>
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                  ₹{expense.bankAmount || '0.00'}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">Remarks</label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 min-h-[72px]">
                {expense.bankRemarks || '-'}
              </div>
            </div>
            <div className="text-lg font-bold text-red-700">
              Total: ₹ {total.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Advocate / Expert Section */}
      {(expense.category === "advocate" || expense.category === "expert") && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-6 text-black">
            {expense.category === "advocate" ? "Advocate" : "Expert"} Payment
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                {expense.category === "advocate" ? "Advocate" : "Expert"} Name
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                {expense[expense.category === "advocate" ? "advocateName" : "expertName"] || '-'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-gray-700">Cases</label>
              </div>

              {(expense.caseRows || []).map((row, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                    {row.doctor || '-'}
                  </div>
                  <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                    {row.caseStage || '-'}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 flex-grow">
                      ₹{row.amount || '0.00'}
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-lg font-bold text-red-700">
                Total: ₹ {total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tax Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold mb-6 text-black">Tax Settings</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="taxApplicable"
              checked={expense.taxApplicable}
              disabled
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 bg-gray-50"
            />
            <label htmlFor="taxApplicable" className="ml-3 block text-sm font-medium text-gray-700">
              Apply Tax
            </label>
          </div>

          {expense.taxApplicable && (
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                {expense.taxRate || '0'}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes & Attachment */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold mb-6 text-black">Notes & Attachment</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">
              Notes / Additional Info
            </label>
            <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 min-h-[144px]">
              {expense.notes || '-'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">
              Upload Attachment
            </label>
            {expense.attachment ? (
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <p className="text-sm text-green-600">File: {expense.attachment.split('/').pop()}</p>
                <button
                  onClick={() => handleDownload(expense.attachment, "Attachment")}
                  className="text-blue-600 hover:text-blue-800 underline text-sm mt-2 inline-block"
                >
                  Download File
                </button>
              </div>
            ) : (
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500">
                No attachment uploaded
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-black">
            Base Amount: <span className="text-red-700 ml-4">₹ {total.toFixed(2)}</span>
            {expense.taxApplicable && (
              <div className="block">
                <div className="text-lg font-bold text-black">
                  Final Amount: <span className="text-red-700">₹ {(total + (total * expense.taxRate) / 100).toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  (includes {expense.taxRate}% tax: ₹ {(total * expense.taxRate / 100).toFixed(2)})
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Link to={`/admin/create-expense?id=${expense._id}`}>
              <button className="bg-green-600 text-white px-10 py-3 rounded-lg hover:bg-green-700 font-medium text-lg">
                Edit Entry
              </button>
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="bg-yellow-500 text-white px-10 py-3 rounded-lg hover:bg-yellow-600 font-medium text-lg"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}