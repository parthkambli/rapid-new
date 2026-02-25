import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../services/apiClient";

const DoctorViewReceipt = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      // Try different endpoints in sequence to find the receipt data
      let response;
      let found = false;

      // Array of possible endpoints to try
      const endpointsToTry = [
        () => apiClient.get(`${apiEndpoints.receipts.get(id)}`),
        () => apiClient.get(`${apiEndpoints.receipts.getprintyear(id)}`),
        () => apiClient.get(`${apiEndpoints.receipts.getprintmonth(id)}`)
      ];

      for (const endpointFunc of endpointsToTry) {
        try {
          response = await endpointFunc();

          // Check if the response has data and is successful
          if (response && response.data) {
            // Check if it's a standard API response with success field
            if (response.data.success !== undefined) {
              if (response.data.success) {
                // Success response - we found the receipt
                found = true;
                break;
              } else {
                // This endpoint returned a failure, try the next one
                continue;
              }
            } else {
              // This looks like a direct response (possibly from print endpoints), consider it found
              found = true;
              break;
            }
          }
        } catch (error) {
          console.warn(`Endpoint failed, trying next:`, error.message);
          continue; // Try the next endpoint
        }
      }

      if (!found) {
        throw new Error('All receipt endpoints failed or receipt not found/access denied');
      }

      // Handle different response structures based on which endpoint worked
      let receiptData = null;

      // First, check if it's a standard API response with success field
      if (response.data.success !== undefined) {
        if (response.data.success) {
          // It's a standard API response
          receiptData = response.data.data || response.data.receipt;
        } else {
          throw new Error(response.data.message || 'Receipt not found');
        }
      }
      // Check if it's a print endpoint response with receipt inside
      else if (response.data.receipt) {
        receiptData = response.data.receipt;
      }
      // Check if the entire response is the receipt data
      else {
        receiptData = response.data;
      }

      // If we still don't have receipt data, try to extract from common properties
      if (!receiptData) {
        // Try common property names where receipt data might be stored
        const possibleProps = ['receipt', 'data', 'result', 'details', 'info'];
        for (const prop of possibleProps) {
          if (response.data[prop] && typeof response.data[prop] === 'object') {
            receiptData = response.data[prop];
            break;
          }
        }
      }

      // If still no receipt data, use the whole response as a fallback
      if (!receiptData) {
        receiptData = response.data;
      }

      if (!receiptData || Object.keys(receiptData).length === 0) {
        throw new Error('Receipt data is empty or could not be parsed');
      }

      setReceipt(receiptData);
    } catch (error) {
      console.error('Error fetching receipt:', error);
      alert(`Failed to load receipt: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    // Open the print version in a new tab/window
    window.open(`/doctor/print-receipt/${id}`, '_blank');
  };

  if (loading) {
    return <div className="text-center py-8">Loading receipt...</div>;
  }

  if (!receipt) {
    return <div className="text-center py-8">Receipt not found</div>;
  }

  // Get payer details safely - handle different data structures
  const payer = receipt.payer || receipt.entityId || receipt.doctor || {};
  const entity = payer.entityId || {};
  const payerName = payer.name || entity.fullName || receipt.payerName || receipt.name || 'N/A';
  const contactPerson = payer.contactPerson || entity.fullName || receipt.name || 'N/A';
  const phoneNumber = payer.phoneNumber || entity.phoneNumber || receipt.phoneNumber || 'N/A';
  const email = payer.email || entity.email || receipt.email || 'N/A';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Receipt Details</h2>
        <div className="space-x-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Print Receipt
          </button>
        </div>
      </div>

      {/* Receipt Details */}
      <div className="bg-white border rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Receipt Information</h3>
            <div className="space-y-2">
              <p><strong>Receipt Number:</strong> {receipt.receiptNumber || receipt.receiptId || receipt._id || 'N/A'}</p>
              <p><strong>Date:</strong> {
                new Date(receipt.receiptDate || receipt.paymentDate || receipt.createdAt || receipt.date || Date.now()).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
              }</p>
              <p><strong>Time:</strong> {
                new Date(receipt.receiptDate || receipt.paymentDate || receipt.createdAt || receipt.date || Date.now()).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })
              }</p>
              <p><strong>Amount:</strong> ₹{receipt.amount?.toLocaleString('en-IN') || receipt.totalAmount || receipt.total || 0}</p>
              <p><strong>Currency:</strong> {receipt.currency || 'INR'}</p>
              <p><strong>Payment Method:</strong> {receipt.paymentMethod?.toUpperCase() || receipt.mode?.toUpperCase() || receipt.payment_mode?.toUpperCase() || 'N/A'}</p>
              <p><strong>Status:</strong>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${receipt.status === 'received' || receipt.status === 'active' || receipt.status === 'cleared' ? 'bg-green-100 text-green-800' :
                  receipt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {receipt.status?.toUpperCase() || 'N/A'}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Payer Information</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {payerName}</p>
              <p><strong>Type:</strong> {payer.type?.toUpperCase() || receipt.type?.toUpperCase() || 'N/A'}</p>
              <p><strong>Contact Person:</strong> {contactPerson}</p>
              <p><strong>Phone:</strong> {phoneNumber}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Doctor ID:</strong> {entity._id || payer.entityId?._id || payer.doctorId || receipt.doctorId || 'N/A'}</p>
              <p><strong>Membership ID:</strong> {payer.entityId?.membershipId || payer.membershipId || receipt.membershipId || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Payment & Bank Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <div className="space-y-2">
              <p><strong>Reference Number:</strong> {receipt.referenceNumber || receipt.refNo || receipt.bankDetails?.referenceNumber || 'N/A'}</p>
              <p><strong>Reference Date:</strong> {receipt.refDate || receipt.ref_date ? new Date(receipt.refDate || receipt.ref_date).toLocaleDateString('en-IN') : 'N/A'}</p>
              <p><strong>Tax Deducted:</strong> ₹{receipt.taxDeducted?.toLocaleString('en-IN') || receipt.tax_deducted || 0}</p>
              <p><strong>Received By:</strong> {receipt.receivedBy?.fullName || receipt.received_by?.name || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Payer Address</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Address:</strong> {payer.address?.address || entity.address?.address || receipt.address?.address || receipt.hospitalAddress?.address || 'N/A'}</p>
              <p><strong>City:</strong> {payer.address?.city || entity.address?.city || receipt.address?.city || receipt.hospitalAddress?.city || 'N/A'}</p>
              <p><strong>State:</strong> {payer.address?.state || entity.address?.state || receipt.address?.state || receipt.hospitalAddress?.state || 'N/A'}</p>
              <p><strong>PIN Code:</strong> {payer.address?.pinCode || entity.address?.pinCode || receipt.address?.pinCode || receipt.hospitalAddress?.pinCode || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Bank / Cheque Details */}
        {(receipt.paymentMethod && receipt.paymentMethod !== 'cash' && receipt.paymentMethod !== 'Cash') && (
          <div className="mb-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Bank / Instrument Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {(receipt.paymentMethod === 'cheque' || receipt.paymentMethod === 'Cheque' || receipt.paymentMethod === 'nach' || receipt.paymentMethod === 'NACH') && (
                <>
                  <p><strong>Cheque No:</strong> {receipt.chequeNo || receipt.cheque_number || receipt.bankDetails?.chequeNumber || 'N/A'}</p>
                  <p><strong>Cheque Date:</strong> {(receipt.chequeDate || receipt.cheque_date || receipt.bankDetails?.chequeDate) ? new Date(receipt.chequeDate || receipt.cheque_date || receipt.bankDetails?.chequeDate).toLocaleDateString('en-IN') : 'N/A'}</p>
                </>
              )}
              <p><strong>Drawn on Bank:</strong> {receipt.drawnOnBank || receipt.drawn_on_bank || receipt.bankDetails?.drawnOnBank || 'N/A'}</p>
              <p><strong>Bank Account:</strong> {
                receipt.cashBankAc?.bankName
                  ? `${receipt.cashBankAc.bankName} - ${receipt.cashBankAc.accountNumber || ''}`
                  : (receipt.bankDetails?.bankName || receipt.bankDetails?.accountNumber || receipt.cashBankAc || 'N/A')
              }</p>
            </div>
          </div>
        )}

        {/* Monthly / Yearly Payment Details */}
        {(receipt.debitType || receipt.debit_type || receipt.monthlyPremium || receipt.monthly_premium || receipt.nextInstallmentDate || receipt.next_installment_date) && (
          <div className="mb-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Subscription Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Monthly Fields */}
              {receipt.debitType && <p><strong>Debit Type:</strong> {receipt.debitType.toUpperCase()}</p>}
              {receipt.debit_type && <p><strong>Debit Type:</strong> {receipt.debit_type.toUpperCase()}</p>}
              {receipt.debitOn && <p><strong>Debit On:</strong> {receipt.debitOn}</p>}
              {receipt.debit_on && <p><strong>Debit On:</strong> {receipt.debit_on}</p>}
              {receipt.debitDate && <p><strong>Debit Date:</strong> {new Date(receipt.debitDate).toLocaleDateString('en-IN')}</p>}
              {receipt.debit_date && <p><strong>Debit Date:</strong> {new Date(receipt.debit_date).toLocaleDateString('en-IN')}</p>}
              {receipt.monthlyPremium && <p><strong>Monthly Premium:</strong> ₹{receipt.monthlyPremium.toLocaleString('en-IN')}</p>}
              {receipt.monthly_premium && <p><strong>Monthly Premium:</strong> ₹{receipt.monthly_premium.toLocaleString('en-IN')}</p>}
              {receipt.gst && <p><strong>GST:</strong> {receipt.gst}</p>}

              {/* Yearly / Installment Fields */}
              {receipt.paymentType && <p><strong>Payment Type:</strong> {receipt.paymentType === 'installment' ? 'Installment' : 'Full Payment'}</p>}
              {receipt.payment_type && <p><strong>Payment Type:</strong> {receipt.payment_type === 'installment' ? 'Installment' : 'Full Payment'}</p>}
              {receipt.installmentAmount && <p><strong>Installment Amount:</strong> ₹{receipt.installmentAmount.toLocaleString('en-IN')}</p>}
              {receipt.installment_amount && <p><strong>Installment Amount:</strong> ₹{receipt.installment_amount.toLocaleString('en-IN')}</p>}
              {receipt.nextInstallmentDate && <p><strong>Next Installment:</strong> {new Date(receipt.nextInstallmentDate).toLocaleDateString('en-IN')}</p>}
              {receipt.next_installment_date && <p><strong>Next Installment:</strong> {new Date(receipt.next_installment_date).toLocaleDateString('en-IN')}</p>}
            </div>
          </div>
        )}

        {(receipt.remarks || receipt.remark || receipt.comments) && (
          <div className="mb-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Remarks</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{receipt.remarks || receipt.remark || receipt.comments || 'N/A'}</p>
          </div>
        )}

        {/* Created/Updated Info */}
        <div className="text-xs text-gray-500 border-t pt-4">
          <p><strong>Created:</strong> {new Date(receipt.createdAt || receipt.created_at || receipt.createdAt || Date.now()).toLocaleString('en-IN')}</p>
          <p><strong>Last Updated:</strong> {new Date(receipt.updatedAt || receipt.updated_at || receipt.updatedAt || Date.now()).toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorViewReceipt;