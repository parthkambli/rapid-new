// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { apiEndpoints, apiHelpers } from "../../../services/apiClient";
// import ReceiptTemplate from "../components/ReceiptTemplate";

// const PrintReceipt = () => {
//   const { id } = useParams();
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

//   useEffect(() => {
//     if (receipt) {
//       // Auto-print when component loads
//       setTimeout(() => {
//         window.print();
//       }, 500);
//     }
//   }, [receipt]);

//   if (loading) {
//     return <div className="text-center py-8">Loading receipt for printing...</div>;
//   }

//   if (!receipt) {
//     return <div className="text-center py-8">Receipt not found</div>;
//   }

//   return (
//     <div className="print-container">
//       <ReceiptTemplate receipt={receipt} />
//     </div>
//   );
// };

// export default PrintReceipt;







import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const PrintReceipt = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      const data = await apiHelpers.getById(apiEndpoints.receipts.get, id);
      setReceipt(data);
    } catch (error) {
      console.error('Error fetching receipt:', error);
      alert('Failed to load receipt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (receipt) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [receipt]);

  if (loading) {
    return <div className="text-center py-8">Loading receipt for printing...</div>;
  }

  if (!receipt) {
    return <div className="text-center py-8">Receipt not found</div>;
  }

  return (
    <div className="print-container p-8">
      <div className="max-w-2xl mx-auto bg-white border-2 border-gray-800 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">RECEIPT</h1>
          <div className="border-t-2 border-b-2 border-gray-800 py-2 my-4">
            <p className="text-lg font-semibold">Your Company Name</p>
            <p className="text-sm">Company Address Line 1</p>
            <p className="text-sm">Company Address Line 2</p>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="mb-6">
          <div className="flex justify-between mb-4">
            <div>
              <p><strong>Receipt No:</strong> {receipt.receiptNumber}</p>
              <p><strong>Date:</strong> {new Date(receipt.paymentDate).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p><strong>Amount:</strong> ₹{receipt.amount}</p>
              <p><strong>Payment Mode:</strong> {receipt.paymentMethod?.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-2">Received From:</h3>
          <p><strong>Name:</strong> {receipt.customer?.name || 'N/A'}</p>
          <p><strong>Address:</strong> {receipt.customer?.address?.address || 'N/A'}</p>
          <p><strong>City:</strong> {receipt.customer?.address?.city || 'N/A'}</p>
          <p><strong>Phone:</strong> {receipt.customer?.phoneNumber || 'N/A'}</p>
        </div>

        {/* Amount in Words */}
        <div className="mb-6">
          <p><strong>Amount in Words:</strong> </p>
          <p className="italic">Rupees {convertToWords(receipt.amount)} Only</p>
        </div>

        {/* Remarks */}
        {receipt.remarks && (
          <div className="mb-6">
            <p><strong>Remarks:</strong> {receipt.remarks}</p>
          </div>
        )}

        {/* Signature */}
        <div className="mt-12 text-center">
          <div className="border-t border-gray-800 w-48 mx-auto mt-16"></div>
          <p className="mt-2">Authorized Signature</p>
        </div>
      </div>
    </div>
  );
};

// Helper function to convert numbers to words
const convertToWords = (num) => {
  // Simple implementation - you might want to use a proper library
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  // This is a simplified version - consider using a proper library for production
  if (num === 0) return 'Zero';
  
  let words = '';
  
  // Handle rupees part
  const rupees = Math.floor(num);
  
  if (rupees >= 10000000) {
    words += convertToWords(Math.floor(rupees / 10000000)) + ' Crore ';
    rupees %= 10000000;
  }
  
  if (rupees >= 100000) {
    words += convertToWords(Math.floor(rupees / 100000)) + ' Lakh ';
    rupees %= 100000;
  }
  
  if (rupees >= 1000) {
    words += convertToWords(Math.floor(rupees / 1000)) + ' Thousand ';
    rupees %= 1000;
  }
  
  if (rupees >= 100) {
    words += convertToWords(Math.floor(rupees / 100)) + ' Hundred ';
    rupees %= 100;
  }
  
  if (rupees > 0) {
    if (words !== '') words += 'and ';
    
    if (rupees < 10) {
      words += ones[rupees];
    } else if (rupees < 20) {
      words += teens[rupees - 10];
    } else {
      words += tens[Math.floor(rupees / 10)];
      if (rupees % 10 > 0) {
        words += ' ' + ones[rupees % 10];
      }
    }
  }
  
  return words.trim();
};

export default PrintReceipt;