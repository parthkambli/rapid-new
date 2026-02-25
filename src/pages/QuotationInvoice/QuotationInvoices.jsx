

// // pages/QuotationInvoices/QuotationInvoices.jsx
// import React from 'react';
// import QuotationController from './components/QuotationController';
// import './styles/print.css';
// import './styles/quotation.css';

// function QuotationInvoices() {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header for UI only (hidden in print) */}
//       <header className="print:hidden bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 shadow-lg">
//         <div className="container mx-auto">
//           <h1 className="text-2xl font-bold text-center">
//             RAPID MEDICOLEGAL SERVICES - QUOTATION GENERATOR
//           </h1>
//           <p className="text-center text-sm mt-1 opacity-90">
//             Generate professional quotations for Hospital, Individual Doctor, and Combined memberships
//           </p>
//           <div className="flex justify-center items-center mt-2 text-xs space-x-4">
//             <span className="flex items-center">
//               <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
//               Hospital Membership
//             </span>
//             <span className="flex items-center">
//               <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
//               Individual Doctor
//             </span>
//             <span className="flex items-center">
//               <span className="w-2 h-2 bg-purple-400 rounded-full mr-1"></span>
//               Combined Membership
//             </span>
//           </div>
//         </div>
//       </header>
      
//       <main className="container mx-auto px-4 py-8">
//         <div className="mb-6 print:hidden">
//           <div className="bg-white rounded-lg shadow p-4">
//             <h2 className="text-lg font-bold text-gray-800 mb-2">How to use:</h2>
//             <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
//               <li>Select membership type (Hospital, Individual, or Combined)</li>
//               <li>View the quotation with real-time data from API</li>
//               <li>Click "Print / Download PDF" to save the quotation</li>
//               <li>The printed version will have proper page breaks and header/footer on each page</li>
//             </ol>
//           </div>
//         </div>
        
//         <QuotationController />
//       </main>
      
//       <footer className="print:hidden bg-gray-900 text-white p-4 text-center text-sm mt-8">
//         <div className="container mx-auto">
//           <p>© 2025 RAPID MEDICOLEGAL SERVICES INDIA LTD. All rights reserved.</p>
//           <p className="mt-1">For support: support@rapidmedicolegal.com | 24×7 Helpline: +91-9422584275</p>
//           <p className="text-xs text-gray-400 mt-2">
//             Registered Office: Delhi, India | CIN: U74999DL2023PTC123456 | GSTIN: 07AABCR1234M1ZX
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default QuotationInvoices;



// pages/QuotationInvoices/QuotationPreview.jsx - UPDATED
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuotationController from './components/QuotationController';
import './styles/print.css';
import './styles/quotation.css';

const QuotationPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // If we have an ID, QuotationController will fetch it automatically
  // We just need to show loading/error states

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading quotation #{id}...</p>
        <p className="text-sm text-gray-500 mt-2">Fetching data from server</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      {/* <header className="print:hidden bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Quotation #{id}</h1>
              <p className="text-sm opacity-90">View and print quotation</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-1 px-4 rounded"
              >
                ← Back
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-1 px-4 rounded"
              >
                New Quotation
              </button>
            </div>
          </div>
        </div>
      </header> */}
      
      <main className="container mx-auto px-4 py-8">
        {/* QuotationController will handle the ID parameter */}
        <QuotationController />
      </main>
      
    
    </div>
  );
};

export default QuotationPreview;