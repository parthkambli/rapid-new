// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { apiEndpoints, apiHelpers } from "../../../services/apiClient";
// import ReceiptTemplate from "../components/ReceiptTemplate";

// const ViewReceipt = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [receipt, setReceipt] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchReceipt();
//   }, [id]);

//   const fetchReceipt = async () => {
//     try {
//       const data = await apiHelpers.getById(apiEndpoints.receipts.get, id);
//       setReceipt(data);
//     } catch (error) {
//       console.error('Error fetching receipt:', error);
//       alert('Failed to load receipt');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = () => {
//     window.open(`/admin/print-receipt/${id}`, '_blank');
//   };

//   const handleEdit = () => {
//     navigate(`/admin/edit-receipt/${id}`);
//   };

//   const handleBack = () => {
//     navigate('/admin/receipts');
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading receipt...</div>;
//   }

//   if (!receipt) {
//     return <div className="text-center py-8">Receipt not found</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Receipt Details</h2>
//         <div className="space-x-2">
//           <button
//             onClick={handlePrint}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Print Receipt
//           </button>
//           <button
//             onClick={handleEdit}
//             className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//           >
//             Edit Receipt
//           </button>
//           <button
//             onClick={handleBack}
//             className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//           >
//             Back to List
//           </button>
//         </div>
//       </div>

//       {/* Receipt Preview */}
//       <div className="bg-white border rounded-lg shadow-lg">
//         <ReceiptTemplate receipt={receipt} />
//       </div>
//     </div>
//   );
// };

// export default ViewReceipt;









// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

// const ViewReceipt = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [receipt, setReceipt] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchReceipt();
//   }, [id]);

//   const fetchReceipt = async () => {
//     try {
//       const data = await apiHelpers.getById(apiEndpoints.receipts.get, id);
//       setReceipt(data);
//     } catch (error) {
//       console.error('Error fetching receipt:', error);
//       alert('Failed to load receipt');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = () => {
//     window.open(`/admin/print-receipt/${id}`, '_blank');
//   };

//   const handleEdit = () => {
//     navigate(`/admin/edit-receipt/${id}`);
//   };

//   const handleBack = () => {
//     navigate('/admin/receipt-list');
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading receipt...</div>;
//   }

//   if (!receipt) {
//     return <div className="text-center py-8">Receipt not found</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Receipt Details</h2>
//         <div className="space-x-2">
//           <button
//             onClick={handlePrint}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Print Receipt
//           </button>
//           <button
//             onClick={handleEdit}
//             className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//           >
//             Edit Receipt
//           </button>
//           <button
//             onClick={handleBack}
//             className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//           >
//             Back to List
//           </button>
//         </div>
//       </div>

//       {/* Receipt Details */}
//       <div className="bg-white border rounded-lg shadow-lg p-6">
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Receipt Information</h3>
//             <div className="space-y-2">
//               <p><strong>Receipt Number:</strong> {receipt.receiptNumber}</p>
//               <p><strong>Date:</strong> {new Date(receipt.paymentDate).toLocaleDateString()}</p>
//               <p><strong>Amount:</strong> ₹{receipt.amount}</p>
//               <p><strong>Payment Method:</strong> {receipt.paymentMethod}</p>
//               <p><strong>Status:</strong> 
//                 <span className={`ml-2 px-2 py-1 rounded text-xs ${
//                   receipt.status === 'received' ? 'bg-green-100 text-green-800' :
//                   receipt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                   'bg-red-100 text-red-800'
//                 }`}>
//                   {receipt.status}
//                 </span>
//               </p>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
//             <div className="space-y-2">
//               <p><strong>Name:</strong> {receipt.customer?.name || 'N/A'}</p>
//               <p><strong>Contact Person:</strong> {receipt.customer?.contactPerson || 'N/A'}</p>
//               <p><strong>Phone:</strong> {receipt.customer?.phoneNumber || 'N/A'}</p>
//               <p><strong>Email:</strong> {receipt.customer?.email || 'N/A'}</p>
//             </div>
//           </div>
//         </div>

//         {receipt.remarks && (
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">Remarks</h3>
//             <p className="text-gray-700">{receipt.remarks}</p>
//           </div>
//         )}

//         {receipt.referenceNumber && (
//           <div>
//             <h3 className="text-lg font-semibold mb-2">Reference</h3>
//             <p className="text-gray-700">{receipt.referenceNumber}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewReceipt;









import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const ViewReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      const response = await apiHelpers.getById(apiEndpoints.receipts.get, id);
      // Extract data from response based on your API structure
      setReceipt(response.data || response);
    } catch (error) {
      console.error('Error fetching receipt:', error);
      alert('Failed to load receipt');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.open(`/admin/print-receipt/${id}`, '_blank');
  };

  const handleEdit = () => {
    navigate(`/admin/edit-receipt/${id}`);
  };

  const handleBack = () => {
    navigate('/admin/receipt-list');
  };

  if (loading) {
    return <div className="text-center py-8">Loading receipt...</div>;
  }

  if (!receipt) {
    return <div className="text-center py-8">Receipt not found</div>;
  }

  // Get payer details safely
  const payer = receipt.payer || {};
  const payerName = payer.name || payer.entityId?.fullName || 'N/A';
  const contactPerson = payer.contactPerson || payer.entityId?.fullName || 'N/A';
  const phoneNumber = payer.phoneNumber || payer.entityId?.phoneNumber || 'N/A';
  const email = payer.email || payer.entityId?.email || 'N/A';

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
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Edit Receipt
          </button>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to List
          </button>
        </div>
      </div>

      {/* Receipt Details */}
      <div className="bg-white border rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Receipt Information</h3>
            <div className="space-y-2">
              <p><strong>Receipt Number:</strong> {receipt.receiptNumber || receipt.receiptId}</p>
              <p><strong>Date:</strong> {
                new Date(receipt.receiptDate || receipt.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
              }</p>
              <p><strong>Time:</strong> {
                new Date(receipt.receiptDate || receipt.createdAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })
              }</p>
              <p><strong>Amount:</strong> ₹{receipt.amount?.toLocaleString('en-IN') || 0}</p>
              <p><strong>Currency:</strong> {receipt.currency || 'INR'}</p>
              <p><strong>Payment Method:</strong> {receipt.paymentMethod?.toUpperCase() || 'N/A'}</p>
              <p><strong>Status:</strong>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${receipt.status === 'received' ? 'bg-green-100 text-green-800' :
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
              <p><strong>Type:</strong> {payer.type?.toUpperCase() || 'N/A'}</p>
              <p><strong>Contact Person:</strong> {contactPerson}</p>
              <p><strong>Phone:</strong> {phoneNumber}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Doctor ID:</strong> {payer.entityId?.doctorId || payer.doctorId || 'N/A'}</p>
              <p><strong>Membership ID:</strong> {payer.entityId?.membershipId || payer.membershipId || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Payment & Bank Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <div className="space-y-2">
              <p><strong>Reference Number:</strong> {receipt.referenceNumber || receipt.bankDetails?.referenceNumber || 'N/A'}</p>
              <p><strong>Reference Date:</strong> {receipt.refDate ? new Date(receipt.refDate).toLocaleDateString('en-IN') : 'N/A'}</p>
              <p><strong>Tax Deducted:</strong> ₹{receipt.taxDeducted?.toLocaleString('en-IN') || 0}</p>
              <p><strong>Received By:</strong> {receipt.receivedBy?.fullName || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Payer Address</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Address:</strong> {payer.address?.address || payer.entityId?.hospitalAddress?.address || 'N/A'}</p>
              <p><strong>City:</strong> {payer.address?.city || payer.entityId?.hospitalAddress?.city || 'N/A'}</p>
              <p><strong>State:</strong> {payer.address?.state || payer.entityId?.hospitalAddress?.state || 'N/A'}</p>
              <p><strong>PIN Code:</strong> {payer.address?.pinCode || payer.entityId?.hospitalAddress?.pinCode || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Bank / Cheque Details */}
        {receipt.paymentMethod !== 'cash' && (
          <div className="mb-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Bank / Instrument Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {receipt.paymentMethod === 'cheque' && (
                <>
                  <p><strong>Cheque No:</strong> {receipt.chequeNo || receipt.bankDetails?.chequeNumber || 'N/A'}</p>
                  <p><strong>Cheque Date:</strong> {(receipt.chequeDate || receipt.bankDetails?.chequeDate) ? new Date(receipt.chequeDate || receipt.bankDetails?.chequeDate).toLocaleDateString('en-IN') : 'N/A'}</p>
                </>
              )}
              <p><strong>Drawn on Bank:</strong> {receipt.drawnOnBank || receipt.bankDetails?.drawnOnBank || 'N/A'}</p>
              <p><strong>Bank Account:</strong> {
                receipt.cashBankAc?.bankName
                  ? `${receipt.cashBankAc.bankName} - ${receipt.cashBankAc.accountNumber || ''}`
                  : (receipt.bankDetails?.bankName || receipt.cashBankAc || 'N/A')
              }</p>
            </div>
          </div>
        )}

        {/* Monthly / Yearly Payment Details */}
        {(receipt.debitType || receipt.monthlyPremium || receipt.nextInstallmentDate) && (
          <div className="mb-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Subscription Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Monthly Fields */}
              {receipt.debitType && <p><strong>Debit Type:</strong> {receipt.debitType.toUpperCase()}</p>}
              {receipt.debitOn && <p><strong>Debit On:</strong> {receipt.debitOn}</p>}
              {receipt.debitDate && <p><strong>Debit Date:</strong> {new Date(receipt.debitDate).toLocaleDateString('en-IN')}</p>}
              {receipt.monthlyPremium && <p><strong>Monthly Premium:</strong> ₹{receipt.monthlyPremium.toLocaleString('en-IN')}</p>}
              {receipt.gst && <p><strong>GST:</strong> {receipt.gst}</p>}

              {/* Yearly / Installment Fields */}
              {receipt.paymentType && <p><strong>Payment Type:</strong> {receipt.paymentType === 'installment' ? 'Installment' : 'Full Payment'}</p>}
              {receipt.installmentAmount && <p><strong>Installment Amount:</strong> ₹{receipt.installmentAmount.toLocaleString('en-IN')}</p>}
              {receipt.nextInstallmentDate && <p><strong>Next Installment:</strong> {new Date(receipt.nextInstallmentDate).toLocaleDateString('en-IN')}</p>}
            </div>
          </div>
        )}

        {receipt.remarks && (
          <div className="mb-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Remarks</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{receipt.remarks}</p>
          </div>
        )}

        {/* Created/Updated Info */}
        <div className="text-xs text-gray-500 border-t pt-4">
          <p><strong>Created:</strong> {new Date(receipt.createdAt).toLocaleString('en-IN')}</p>
          <p><strong>Last Updated:</strong> {new Date(receipt.updatedAt).toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewReceipt;