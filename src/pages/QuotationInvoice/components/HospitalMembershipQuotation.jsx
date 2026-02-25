
// // components/HospitalMembershipQuotation.jsx
// import React, { forwardRef } from 'react';
// import QuotationLayout from '../layout/QuotationLayout';
// import DoctorInfoSection from './DoctorInfoSection';
// import PageTwoDetails from './PageTwoDetails';
// import ScopeOfServices from './ScopeOfServices';

// const HospitalMembershipQuotation = forwardRef(({ 
//   data = {}, 
//   onPrint 
// }, ref) => {
//   const sampleData = {
//     doctor_name: "Dr. Nagaraj Margankop",
//     hospital_name: "City Medical Center",
//     address: "123 Medical Street, Bangalore, Karnataka - 560001",
//     specialization: "Multispeciality Hospital",
//     membership_type: "HOSPITAL MEMBERSHIP",
//     number_of_beds: "15",
//     indemnity_cover: "10 LAKH",
//     pricing: {
//       monthly: "1,000/-",
//       yearly: "10,000/-",
//       fiveYear: "50,000"
//     },
//     quotation_date: "12.08.2025",
//     valid_till: "12.09.2025",
//     bank_details: {
//       bankName: "HDFC BANK LTD.",
//       accountName: "RAPID MEDICOLEGAL SERVICES INDIA LTD.",
//       accountNumber: "50100342839821",
//       ifscCode: "HDFC0000050",
//       branch: "NEW DELHI"
//     },
//     qr_code_image: ""
//   };

//   const mergedData = { ...sampleData, ...data };

//   return (
//     <QuotationLayout 
//       ref={ref}
//       membershipType="hospital" 
//       onPrint={onPrint}
//     >
//       {/* Page 1: Doctor Info */}
//       <DoctorInfoSection data={mergedData} />
      
//       {/* Page 2: Details, Pricing & Bank Info */}
//       <PageTwoDetails data={mergedData} />
      
//       {/* Page 3: Scope of Services */}
//       <div className="page-break-before-always">
//         <ScopeOfServices membershipType="hospital" />
        
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
//           <p className="text-xs text-gray-600 mt-4 text-center">
//             This is a computer-generated quotation. Please keep this for your records.
//           </p>
//         </div>
//       </div>
//     </QuotationLayout>
//   );
// });

// HospitalMembershipQuotation.displayName = 'HospitalMembershipQuotation';

// export default HospitalMembershipQuotation;











// upar wala code static ui hai aur below wala dynamic ui hai

// // components/HospitalMembershipQuotation.jsx
// import React, { forwardRef } from 'react';
// import QuotationLayout from '../layout/QuotationLayout';
// import DoctorInfoSection from './DoctorInfoSection';
// import DynamicPricingTable from './PricingTable';
// import BankDetailsQR from './BankDetailsQR';
// import ScopeOfServices from './ScopeOfServices';

// // ✅ forwardRef properly implement karo
// const HospitalMembershipQuotation = forwardRef(({ 
//   data = {}, 
//   onPrint 
// }, ref) => {
//   console.log("📍 HospitalQuotation - Received ref:", !!ref);
//   console.log("📍 HospitalQuotation - Data:", data);
  
//   return (
//     <QuotationLayout 
//       ref={ref}  // ✅ Yehi se ref pass ho raha hai
//       membershipType="hospital" 
//       onPrint={onPrint}
//     >
//       {/* Page 1: Doctor Info */}
//       <DoctorInfoSection data={data} />
      
//       {/* Page 2: Details, Pricing & Bank Info */}
//       <div className="page-break-after-always">
//         {/* Doctor/Hospital Info */}
//         <div className="text-green-700 font-semibold text-center text-base mb-6 space-y-1 print:mt-6">
//           <p className="font-bold">DR. NAME - <span className="font-normal">{data.doctor_name}</span></p>
//           <p className="font-bold">HOSPITAL NAME - <span className="font-normal">{data.hospital_name}</span></p>
//           <p className="font-bold">ADDRESS - <span className="font-normal">{data.address}</span></p>
//         </div>

//         <p className="text-red-600 text-center font-bold text-lg mb-6">
//           AS BELOW AS
//         </p>

//         {/* Dynamic Pricing Table */}
//         <DynamicPricingTable data={data} />
        
//         {/* Bank Details */}
//         <div className="mt-10">
//           <BankDetailsQR data={data} />
//         </div>
//       </div>
      
//       {/* Page 3: Scope of Services */}
//       <div className="scope-container ">
//         <ScopeOfServices membershipType="hospital" />

//         {/* <div className='border border-gray-700 mt-4 2xl:mt-10 lg:mt-8 md:mt-6 sm:mt-4 '> 
//           <p className='text-red-600 text-center'>
//           NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
//           </p>
//         </div>
//          */}
// <div className="mt-8 print:mt-4 border-2 border-gray-700 py-3 print:py-2 px-6 final-note no-break-inside ">
//   <p className="text-red-600 text-center font-bold text-base print:text-sm">
//     NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
//   </p>
// </div>

//         {/* Terms & Conditions */}
//         {/* <div className="mt-10 p-4 border border-gray-300 rounded">
//           <p className="font-bold text-lg mb-2">Terms & Conditions:</p>
//           <ol className="list-decimal pl-5 space-y-1 text-sm">
//             <li>This quotation is valid until {data.valid_till || "13.01.2026"}.</li>
//             <li>Membership activation subject to payment realization.</li>
//             <li>All services are governed by the terms of the membership agreement.</li>
//             <li>The company reserves the right to modify services with prior notice.</li>
//             <li>Jurisdiction for all disputes: Delhi Courts.</li>
//           </ol>
//           <p className="text-xs text-gray-600 mt-4 text-center">
//             Quotation ID: {data.quotation_number || data.trno || "N/A"} | 
//             Generated on: {data.quotation_date || "13.12.2025"}
//           </p>
//         </div> */}
//       </div>
//     </QuotationLayout>
//   );
// });

// // ✅ Display name set karo
// HospitalMembershipQuotation.displayName = 'HospitalMembershipQuotation';

// export default HospitalMembershipQuotation;









// import React, { forwardRef } from 'react';
// import QuotationLayout from '../layout/QuotationLayout';
// import DoctorInfoSection from './DoctorInfoSection';
// import DynamicPricingTable from './PricingTable';
// import BankDetailsQR from './BankDetailsQR';
// import ScopeOfServices from './ScopeOfServices';

// const HospitalMembershipQuotation = forwardRef(({ data = {} }, ref) => {
//   console.log("📍 HospitalQuotation Data:", data);
  
//   return (
//     <QuotationLayout ref={ref} membershipType="hospital">
//       {/* Page 1: Doctor Info */}
//       <div className="page-1">
//         <DoctorInfoSection data={data} />
//       </div>
      
//       {/* Page 2: Details, Pricing & Bank Info */}
//       <div className="page-2 page-break-before">
//         {/* Doctor/Hospital Info */}
//         <div className="text-green-700 font-semibold text-center text-base mb-6 space-y-1">
//           <p className="font-bold">DR. NAME - <span className="font-normal">{data.doctor_name || "Dr. Name"}</span></p>
//           <p className="font-bold">HOSPITAL NAME - <span className="font-normal">{data.hospital_name || "Hospital Name"}</span></p>
//           <p className="font-bold">ADDRESS - <span className="font-normal">{data.address || "Address Not Available"}</span></p>
//         </div>

//         <p className="text-red-600 text-center font-bold text-lg mb-6">
//           AS BELOW AS
//         </p>

//         {/* Dynamic Pricing Table */}
//         <div className="pricing-table-wrapper">
//           <DynamicPricingTable data={data} />
//         </div>
        
//         {/* Bank Details */}
//         <div className="bank-details mt-10">
//           <BankDetailsQR data={data} />
//         </div>
//       </div>
      
//       {/* Page 3: Scope of Services AND VALIDITY NOTE */}
//       <div className=" scope-of-services page-3 page-break-before">
//         {/* Scope of Services Section */}
//         <div className="scope-of-services">
//           <ScopeOfServices membershipType="hospital" />
//         </div>
        
//         {/* VALIDITY NOTE - यह ScopeOfServices के अंदर नहीं, बल्कि अलग से */}
//         <div className="validity-note mt-8 border-2 border-gray-700 py-3 px-6">
//           <p className="text-red-600 text-center font-bold text-base">
//             NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
//           </p>
//         </div>
//       </div>
//     </QuotationLayout>
//   );
// });

// HospitalMembershipQuotation.displayName = 'HospitalMembershipQuotation';
// export default HospitalMembershipQuotation;







import React, { forwardRef } from 'react';
import QuotationLayout from '../layout/QuotationLayout';
import DoctorInfoSection from './DoctorInfoSection';
import DynamicPricingTable from './PricingTable';
import BankDetailsQR from './BankDetailsQR';
import ScopeOfServices from './ScopeOfServices';

const HospitalMembershipQuotation = forwardRef(({ data = {} }, ref) => {
  console.log("📍 HospitalQuotation Data:", data);
  
  return (
    <QuotationLayout ref={ref} membershipType="hospital">
      {/* Page 1: Doctor Info */}
      <div className="page-1 doctor-info-section">
        <DoctorInfoSection data={data} />
      </div>
      
      {/* Page 2: Details, Pricing & Bank Info */}
      <div className="page-2 page-break-before pricing-section print:mt-[150px] print:pt-[120px]">
        {/* Doctor/Hospital Info */}
        <div className="doctor-hospital-info text-green-700 font-semibold text-center text-base mb-6 space-y-1">
          {/* <p className="font-bold"><span className="font-normal">{data.doctor_name || "Dr. Name"}</span></p> */}
          <p className="font-bold"><span className="font-normal ">{data.hospital_name || "Hospital Name"}</span></p>
          <p className="font-bold"> <span className="font-normal">{data.address || "Address Not Available"}</span></p>
        </div>

        <p className="text-red-600 text-center font-bold text-lg mb-6">
          AS BELOW AS
        </p>

        {/* Dynamic Pricing Table */}
        <div className="pricing-table-wrapper no-break-inside">
          <DynamicPricingTable data={data} />
        </div>
        
        {/* Bank Details */}
        <div className="bank-details no-break-inside mt-10">
          <BankDetailsQR data={data} />
        </div>
      </div>
      
      {/* Page 3: Scope of Services */}
      <div className="page-3 page-break-before scope-page print:mt-[150px] print:pt-[120px]">
        {/* Scope of Services Section */}
        <div className="scope-of-services-container">
          <ScopeOfServices membershipType="hospital" />
        </div>
        
        {/* VALIDITY NOTE - यह ScopeOfServices के बाद */}
        <div className="validity-note no-break-inside">
          <p className="text-red-600 text-center font-bold text-base">
            NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
          </p>
        </div>
      </div>
    </QuotationLayout>
  );
});

HospitalMembershipQuotation.displayName = 'HospitalMembershipQuotation';
export default HospitalMembershipQuotation;