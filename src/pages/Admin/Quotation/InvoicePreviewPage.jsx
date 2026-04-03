// import React from 'react';
// import { useSearchParams } from 'react-router-dom';
// import InvoiceIndividualMembership from './invoices/IndividualMembershipInvoice';
// import HospitalMembershipInvoice from './invoices/HospitalMembershipInvoice';
// import CombinedMembershipInvoice from './invoices/CombinedMembershipInvoice';

// const InvoicePreviewPage = () => {
//   // Get membership type from URL parameters
//   const [searchParams] = useSearchParams();
//   const membershipType = searchParams.get('type') || 'INDIVIDUAL MEMBERSHIP';

//   // Sample data for the invoice components
//   const sampleData = {
//     doctorData: {
//       name: "DR. JOHN SMITH",
//     },
//     hospitalData: {
//       name: "MEDICAL HOSPITAL",
//       address: "123 MEDICAL STREET, CITY, STATE - 123456"
//     },
//     membershipData: {
//       specialization: "GENERAL PRACTICE",
//       indemnityCover: "50 LAKH",
//       monthly: "999/-",
//       yearly: "9999/-",
//       fiveYear: "44995/-",
//       numberOfBeds: "50"
//     }
//   };

//   const renderInvoice = () => {
//     switch (membershipType) {
//       case 'INDIVIDUAL MEMBERSHIP':
//         return <InvoiceIndividualMembership {...sampleData} />;
//       case 'HOSPITAL MEMBERSHIP':
//         return <HospitalMembershipInvoice {...sampleData} />;
//       case 'HOSPITAL + INDIVIDUAL MEMBERSHIP':
//         return <CombinedMembershipInvoice {...sampleData} />;
//       default:
//         return (
//           <div className="flex items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg">
//             <div className="text-center">
//               <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Membership Type</h2>
//               <p className="text-red-500">
//                 Membership type "{membershipType}" is not supported.
//                 <br />
//                 Supported types: INDIVIDUAL MEMBERSHIP, HOSPITAL MEMBERSHIP, HOSPITAL + INDIVIDUAL MEMBERSHIP
//               </p>
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Quotation Invoice</h1>
//           <p className="text-gray-600">Membership Type: {membershipType}</p>
//         </div>

//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//           {renderInvoice()}
//         </div>

//         <div className="mt-6 text-center">
//           <button
//             onClick={() => window.print()}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Print Invoice
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoicePreviewPage;








































// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import IndividualMembershipInvoice from './invoices/IndividualMembershipInvoice';
// import HospitalMembershipInvoice from './invoices/HospitalMembershipInvoice';
// import CombinedMembershipInvoice from './invoices/CombinedMembershipInvoice';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';

// const QuotationPreview = ({
//   formData,
//   selectedYears = [],
//   priceMatrix = [],
//   onEdit,
//   onGeneratePDF,
//   quotationId: propQuotationId  // Optional prop to pass quotationId from parent
// }) => {
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Get quotationId from URL params if available
//   const { id: urlQuotationId } = useParams();

//   // Determine which quotation ID to use (priority: prop > URL param > null)
//   const quotationId = propQuotationId || urlQuotationId;

//   useEffect(() => {
//     // If we have a quotation ID, fetch the invoice data from the API
//     if (quotationId) {
//       fetchInvoiceData();
//     }
//   }, [quotationId]);

//   const fetchInvoiceData = async () => {
//     if (!quotationId) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await apiClient.get(apiEndpoints.quotations.invoiceData(quotationId));

//       if (response.data.success) {
//         setInvoiceData(response.data.data);
//       } else {
//         setError(response.data.message || 'Failed to fetch invoice data');
//       }
//     } catch (err) {
//       console.error('Error fetching invoice data:', err);
//       setError('Error fetching invoice data: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // If we have quotationId and are waiting for data, show loading
//   if (quotationId && loading) {
//     return (
//       <div className="mt-8 flex flex-col items-center justify-center min-h-[300px]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D78] mb-4"></div>
//         <p className="text-gray-600">Loading invoice data...</p>
//       </div>
//     );
//   }

//   // If there's an error, show error message
//   if (quotationId && error) {
//     return (
//       <div className="mt-8">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//           <strong className="font-bold">Error: </strong>
//           <span className="block sm:inline">{error}</span>
//           <button
//             onClick={fetchInvoiceData}
//             className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Determine which data to use: API data if available, otherwise form data
//   const useApiData = quotationId && invoiceData;
//   const displayData = useApiData ? invoiceData : null;

//   // If no API data and no form data, use a default
//   const finalData = displayData || {
//     doctorData: formData ? {
//       name: formData.doctorName?.split(' (')[0] || 'N/A',
//       area: formData.area || 'N/A'
//     } : {
//       name: 'N/A',
//       area: 'N/A'
//     },
//     hospitalData: formData ? {
//       name: formData.hospitalName || "Hospital Name",
//       address: formData.hospitalAddress || "Hospital Address"
//     } : {
//       name: "Hospital Name",
//       address: "Hospital Address"
//     },
//     membershipData: formData ? {
//       specialization: formData.specialization || 'N/A',
//       numberOfBeds: formData.numberOfBeds || '15 BEDS',
//       indemnityCover: priceMatrix[0]?.indemnity || formData.indemnityCover || '50 LAKH',
//       monthly: priceMatrix[0]?.monthly || formData.monthly || '1000/-',
//       yearly: selectedYears.includes('1') ? (priceMatrix[0]?.y1 || formData.yearly || '10,000/-') : 'N/A',
//       fiveYear: selectedYears.includes('5') ? (priceMatrix[0]?.y5 || formData.fiveYear || '50,000') : 'N/A'
//     } : {
//       specialization: 'N/A',
//       numberOfBeds: '15 BEDS',
//       indemnityCover: '50 LAKH',
//       monthly: '1000/-',
//       yearly: '10,000/-',
//       fiveYear: '50,000'
//     }
//   };

//   const renderInvoiceComponent = () => {
//     // If we have form data, use the membership type from it, otherwise default to individual
//     const membershipType = formData?.membershipType || "INDIVIDUAL MEMBERSHIP";

//     switch(membershipType) {
//       case 'INDIVIDUAL MEMBERSHIP':
//         return <IndividualMembershipInvoice
//           doctorData={finalData.doctorData}
//           hospitalData={finalData.hospitalData}
//           membershipData={finalData.membershipData}
//         />;
//       case 'HOSPITAL MEMBERSHIP':
//         return <HospitalMembershipInvoice
//           doctorData={finalData.doctorData}
//           hospitalData={finalData.hospitalData}
//           membershipData={finalData.membershipData}
//         />;
//       case 'HOSPITAL + INDIVIDUAL MEMBERSHIP':
//         return <CombinedMembershipInvoice
//           doctorData={finalData.doctorData}
//           hospitalData={finalData.hospitalData}
//           membershipData={finalData.membershipData}
//         />;
//       default:
//         return <IndividualMembershipInvoice
//           doctorData={finalData.doctorData}
//           hospitalData={finalData.hospitalData}
//           membershipData={finalData.membershipData}
//         />;
//     }
//   };

//   return (
//     <div className="mt-8">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-bold text-gray-800">Quotation Preview</h2>
//         <div className="flex gap-3">
//           <button
//             onClick={onEdit}
//             className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition"
//           >
//             Edit Quotation
//           </button>
//           <button
//             onClick={onGeneratePDF}
//             className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
//           >
//             Generate PDF
//           </button>
//         </div>
//       </div>

//       {/* Preview Container with A4 styling */}
//       <div className="bg-white border-2 border-gray-300 rounded-lg p-4 max-w-4xl mx-auto">
//         <div className="a4-preview">
//           {renderInvoiceComponent()}
//         </div>
//       </div>

//       {/* Additional Information */}
//       {!useApiData && formData && (
//         <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <h3 className="font-semibold text-yellow-800 mb-2">Quotation Summary</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//             <div>
//               <strong>Membership Type:</strong> {formData.membershipType}
//             </div>
//             <div>
//               <strong>Doctor:</strong> {formData.doctorName?.split(' (')[0] || 'N/A'}
//             </div>
//             <div>
//               <strong>Specialization:</strong> {formData.specialization}
//             </div>
//             <div>
//               <strong>Selected Years:</strong> {selectedYears.join(', ')} year(s)
//             </div>
//             <div>
//               <strong>Payment Type:</strong> {formData.monthly ? 'Monthly' : 'Yearly'}
//             </div>
//             <div>
//               <strong>Indemnity Cover:</strong> {formData.indemnityCover ? 'Yes' : 'No'}
//             </div>
//             <div>
//               <strong>Area:</strong> {formData.area}
//             </div>
//             <div>
//               <strong>Quotation Date:</strong> {formData.quotationDate}
//             </div>
//           </div>
//           {formData.narration && (
//             <div className="mt-3">
//               <strong>Narration:</strong> {formData.narration}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Show source indicator */}
//       <div className="mt-4 text-xs text-gray-500 text-center">
//         {useApiData ? 'Data loaded from database' : 'Data from current form'}
//       </div>
//     </div>
//   );
// };

// export default QuotationPreview;































import React from 'react';
import { useLocation } from 'react-router-dom';
import CombinedMembershipInvoice from '../Quotation/invoices/CombinedMembershipInvoice';
import IndividualMembershipInvoice from '../Quotation/invoices/IndividualMembershipInvoice';
import HospitalMembershipInvoice from '../Quotation/invoices/HospitalMembershipInvoice';

const InvoicePreviewPage = () => {
  const location = useLocation();
  const { doctorData, hospitalData, membershipData, membershipType } = location.state || {};

  // Agar data nahi hai toh error dikhao
  if (!doctorData || !membershipData) {
    return (
      <div className="p-10 text-center text-red-600 text-2xl">
        No Data! Pehle Create Quotation se "Generate PDF" click karo.
      </div>
    );
  }

  // Teeno me se sahi wala render karo
  const renderInvoice = () => {
    if (membershipType?.includes('COMBINED') || membershipType?.includes('HOSPITAL + INDIVIDUAL')) {
      return <CombinedMembershipInvoice doctorData={doctorData} hospitalData={hospitalData} membershipData={membershipData} />;
    }
    if (membershipType?.includes('HOSPITAL')) {
      return <HospitalMembershipInvoice doctorData={doctorData} hospitalData={hospitalData} membershipData={membershipData} />;
    }
    return <IndividualMembershipInvoice doctorData={doctorData} hospitalData={hospitalData} membershipData={membershipData} />;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white">
        {renderInvoice()}
      </div>

      <div className="text-center my-8 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-green-700"
        >
          Download PDF
        </button>
        <p className="text-gray-600 mt-2">Print → Save as PDF → A4</p>
      </div>

      <style jsx>{`
        @media print {
          body * { visibility: hidden; }
          .max-w-4xl, .max-w-4xl * { visibility: visible; }
          .max-w-4xl { position: absolute; left: 0; top: 0; width: 210mm; }
          .print\\:hidden { display: none; }
          @page { size: A4; margin: 5mm; }
          
          /* Ensure header and footer stay within page width */
          .header, .footer {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          
          /* Ensure proper page breaks */
          .page {
            page-break-after: always;
            page-break-inside: avoid;
          }
          
          /* Ensure content doesn't overflow */
          .content {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Force proper table rendering */
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoicePreviewPage;