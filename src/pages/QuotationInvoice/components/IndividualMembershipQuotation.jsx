// // components/IndividualMembershipQuotation.jsx
// import React, { forwardRef } from 'react';
// import QuotationLayout from '../layout/QuotationLayout';
// import DoctorInfoSection from './DoctorInfoSection';
// import PageTwoDetails from './PageTwoDetails';
// import ScopeOfServices from './ScopeOfServices';

// const IndividualMembershipQuotation = forwardRef(({ 
//   data = {}, 
//   onPrint 
// }, ref) => {
//   const sampleData = {
//     doctor_name: "Dr. Jane Smith",
//     hospital_name: "Not Applicable",
//     address: "789 Clinic Road, Delhi - 110001",
//     specialization: "Neurology",
//     membership_type: "INDIVIDUAL DOCTOR MEMBERSHIP",
//     number_of_beds: "N/A",
//     indemnity_cover: "5 LAKH",
//     pricing: {
//       monthly: "500/-",
//       yearly: "5,000/-",
//       fiveYear: "25,000"
//     },
//     quotation_date: "12.08.2025",
//     valid_till: "12.09.2025",
//     qr_code_image: ""
//   };

//   const mergedData = { ...sampleData, ...data };

//   return (
//     <QuotationLayout 
//       ref={ref}
//       membershipType="individual" 
//       onPrint={onPrint}
//     >
//       {/* Page 1: Doctor Info */}
//       <DoctorInfoSection data={mergedData} />
      
//       {/* Page 2: Details, Pricing & Bank Info */}
//       <PageTwoDetails data={mergedData} />
      
//       {/* Page 3: Scope of Services */}
//       <div className="page-break-before-always">
//         <ScopeOfServices membershipType="individual" />
        
//         {/* Terms & Conditions */}
//         <div className="mt-10 p-4 border border-gray-300 rounded">
//           <p className="font-bold text-lg mb-2">Terms & Conditions:</p>
//           <ol className="list-decimal pl-5 space-y-1 text-sm">
//             <li>This quotation is valid until {mergedData.valid_till}.</li>
//             <li>Membership activation subject to payment realization.</li>
//             <li>All services are governed by the terms of the membership agreement.</li>
//             <li>The company reserves the right to modify services with prior notice.</li>
//             <li>Jurisdiction for all disputes: Delhi Courts.</li>
//           </ol>
//         </div>
//       </div>
//     </QuotationLayout>
//   );
// });

// IndividualMembershipQuotation.displayName = 'IndividualMembershipQuotation';

// export default IndividualMembershipQuotation;









// // components/IndividualMembershipQuotation.jsx
// import React, { forwardRef } from 'react';
// import QuotationLayout from '../layout/QuotationLayout';
// import DoctorInfoSection from './DoctorInfoSection';
// import DynamicPricingTable from './PricingTable';
// import BankDetailsQR from './BankDetailsQR';
// import ScopeOfServices from './ScopeOfServices';

// const IndividualMembershipQuotation = forwardRef(({ 
//   data = {}, 
//   onPrint 
// }, ref) => {
  
//   // Individual doctor ke liye data modify karo
//   const individualData = {
//     ...data,
//     membership_type: "INDIVIDUAL DOCTOR MEMBERSHIP",
//     // Individual doctors ke liye beds show nahi karna
//     number_of_beds: "N/A",
//     // Hospital name adjust karo agar "Not Available" ho to
//     hospital_name: data.hospital_name === "Hospital Name Not Available" 
//       ? "Not Applicable (Individual Practice)" 
//       : data.hospital_name,
//     // Specialization adjust karo
//     specialization: data.specialization || "General Practitioner",
//     // Individual ke liye note add karo
//     note: data.note || "Individual doctor membership covers personal practice only. Coverage does not extend to hospital staff or facilities."
//   };

//   return (
//     <QuotationLayout 
//       ref={ref}
//       membershipType="individual" 
//       onPrint={onPrint}
//     >
//       {/* Page 1: Doctor Info */}
//       <DoctorInfoSection data={individualData} />
      
//       {/* Page 2: Details, Pricing & Bank Info */}
//       <div className="page-break-after-always">
//         {/* Doctor Info for Individual - Green Text */}
//         <div className="text-green-700 font-semibold text-center text-base mb-6 space-y-1">
//           <p className="font-bold ">DR. NAME - <span className="font-normal">{individualData.doctor_name}</span></p>
//           {/* <p className="font-bold text-center">HOSPITAL NAME - <span className="font-normal">{individualData.hospital_name}</span></p> */}
//           <p className="font-bold ">ADDRESS - <span className="font-normal">{individualData.address}</span></p>
//           <p className="font-bold">SPECIALIZATION - <span className="font-normal">{individualData.specialization}</span></p>
//         </div>

//         <p className="text-red-600 font-bold text-center text-lg mb-2">
//           AS BELOW AS
//         </p>

//         {/* Dynamic Pricing Table for Individual */}
//         <DynamicPricingTable data={individualData} />
        
//         {/* Bank Details */}
//         <div className="mt-10">
//           <BankDetailsQR data={individualData} />
//         </div>
//       </div>
      
//       {/* Page 3: Scope of Services */}
//       <div className="page-break-before-always">
//         <ScopeOfServices membershipType="individual" />

//  <div className="mt-8 print:mt-4 border-2 border-gray-700 py-3 print:py-2 px-6 page-break-inside-avoid">
//   <p className="text-red-600 text-center font-bold text-base print:text-sm">
//     NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
//   </p>
// </div>
        
//         {/* Individual-specific terms */}
//         {/* <div className="mt-10 p-4 border border-gray-300 rounded">
//           <p className="font-bold text-lg mb-2">Terms & Conditions for Individual Doctor:</p>
//           <ol className="list-decimal pl-5 space-y-1 text-sm">
//             <li>This quotation is valid until {individualData.valid_till || "13.01.2026"}.</li>
//             <li>Membership covers individual practice only. Hospital/nursing home practice requires separate coverage.</li>
//             <li>Membership activation subject to payment realization and KYC verification.</li>
//             <li>Coverage limited to medico-legal cases arising from professional services rendered by the doctor.</li>
//             <li>Does not cover criminal cases involving intentional wrong-doing or fraud.</li>
//             <li>The company reserves the right to modify services with 30 days prior notice.</li>
//             <li>Jurisdiction for all disputes: Delhi Courts.</li>
//           </ol>
          
//           <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
//             <p className="font-bold text-sm text-yellow-800">Important for Individual Doctors:</p>
//             <ul className="list-disc pl-5 mt-1 text-xs text-yellow-700">
//               <li>Coverage is for individual professional practice only</li>
//               <li>Visiting/consultant practice at multiple hospitals is covered</li>
//               <li>24×7 medico-legal helpline support included</li>
//               <li>Professional indemnity insurance arrangement assistance provided</li>
//             </ul>
//           </div>
          
//           <p className="text-xs text-gray-600 mt-4 text-center">
//             Quotation ID: {individualData.quotation_number || individualData.trno || "N/A"} | 
//             Doctor ID: {individualData.doctor_id || "N/A"} | 
//             Generated on: {individualData.quotation_date || "13.12.2025"}
//           </p>
//         </div> */}
//       </div>
//     </QuotationLayout>
//   );
// });

// IndividualMembershipQuotation.displayName = 'IndividualMembershipQuotation';

// export default IndividualMembershipQuotation;





import React, { forwardRef } from 'react';
import QuotationLayout from '../layout/QuotationLayout';
import DoctorInfoSection from './DoctorInfoSection';
import DynamicPricingTable from './PricingTable';
import BankDetailsQR from './BankDetailsQR';
import ScopeOfServices from './ScopeOfServices';

const IndividualMembershipQuotation = forwardRef(({ data = {} }, ref) => {
  
  // Individual doctor के लिए data prepare करें
  const individualData = {
    ...data,
    // Force INDIVIDUAL type
    membership_type: "INDIVIDUAL DOCTOR MEMBERSHIP",
    // Individual doctors के लिए beds नहीं दिखाना
    number_of_beds: "N/A",
    // Hospital name adjust करें
    hospital_name: data.hospital_name?.includes("Hospital") 
      ? "Not Applicable (Individual Practice)" 
      : "Individual Practice",
    // Specialization adjust करें
    specialization: data.specialization || "General Practitioner",
    // Individual के लिए note
    note: data.note || "Individual doctor membership covers personal practice only. Does not extend to hospital staff or facilities."
  };

  console.log("📍 Individual Quotation Data:", individualData);

  return (
    <QuotationLayout ref={ref} membershipType="individual">
      {/* Page 1: Doctor Info */}
      <div className="page-1 doctor-info-section">
        <DoctorInfoSection data={individualData} />
      </div>
      
      {/* Page 2: Details, Pricing & Bank Info */}
      <div className="page-2 page-break-before pricing-section  print:mt-[150px] print:pt-[120px]">
        {/* Doctor Info for Individual - Green Text */}
        <div className="doctor-hospital-info text-green-700 font-semibold text-center text-base mb-6 space-y-1">
          <p className="font-bold"><span className="font-normal">{individualData.doctor_name || "Dr. Name"}</span></p>
          <p className="font-bold"><span className="font-normal">{data.hospital_name || "Hospital Name"}</span></p>

          {/* <p className="font-bold">SPECIALIZATION - <span className="font-normal">{individualData.specialization}</span></p> */}
          <p className="font-bold"> <span className="font-normal">{individualData.address || "Address Not Available"}</span></p>
        </div>

        <p className="text-red-600 text-center font-bold text-lg mb-6">
          AS BELOW AS
        </p>

        {/* Dynamic Pricing Table for Individual */}
        <div className="pricing-table-wrapper no-break-inside">
          <DynamicPricingTable data={individualData} />
        </div>
        
        {/* Bank Details */}
        <div className="bank-details no-break-inside mt-10">
          <BankDetailsQR data={individualData} />
        </div>
      </div>
      
      {/* Page 3: Scope of Services */}
      <div className="page-3 page-break-before scope-page print:mt-[150px] print:pt-[120px]">
        {/* Scope of Services Section */}
        <div className="scope-of-services-container">
          <ScopeOfServices membershipType="individual" data={individualData} />
        </div>
        
        {/* VALIDITY NOTE */}
        <div className="validity-note no-break-inside">
          <p className="text-red-600 text-center font-bold text-base">
            NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
          </p>
        </div>
      </div>
    </QuotationLayout>
  );
});

IndividualMembershipQuotation.displayName = 'IndividualMembershipQuotation';
export default IndividualMembershipQuotation;