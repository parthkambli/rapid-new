// // components/CombinedMembershipQuotation.jsx
// import React, { forwardRef } from 'react';
// import QuotationLayout from '../layout/QuotationLayout';
// import DoctorInfoSection from './DoctorInfoSection';
// import PageTwoDetails from './PageTwoDetails';
// import ScopeOfServices from './ScopeOfServices';

// const CombinedMembershipQuotation = forwardRef(({ 
//   data = {}, 
//   onPrint 
// }, ref) => {
//   const sampleData = {
//     doctor_name: "Dr. Rajesh Kumar",
//     hospital_name: "City Medical Center",
//     address: "321 Hospital Lane, Chennai, Tamil Nadu - 600001",
//     specialization: "Multispeciality",
//     membership_type: "COMBINED HOSPITAL + INDIVIDUAL",
//     number_of_beds: "30",
//     indemnity_cover: "20 LAKH",
//     pricing: {
//       monthly: "2,000/-",
//       yearly: "20,000/-",
//       fiveYear: "100,000"
//     },
//     quotation_date: "12.08.2025",
//     valid_till: "12.09.2025",
//     qr_code_image: ""
//   };

//   const mergedData = { ...sampleData, ...data };

//   return (
//     <QuotationLayout 
//       ref={ref}
//       membershipType="combined" 
//       onPrint={onPrint}
//     >
//       {/* Page 1: Doctor Info */}
//       <DoctorInfoSection data={mergedData} />
      
//       {/* Page 2: Details, Pricing & Bank Info */}
//       <PageTwoDetails data={mergedData} />
      
//       {/* Page 3: Scope of Services */}
//       <div className="page-break-before-always">
//         <ScopeOfServices membershipType="combined" />
        
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

// CombinedMembershipQuotation.displayName = 'CombinedMembershipQuotation';

// export default CombinedMembershipQuotation;








// // components/CombinedMembershipQuotation.jsx
// import React, { forwardRef } from 'react';
// import QuotationLayout from '../layout/QuotationLayout';
// import DoctorInfoSection from './DoctorInfoSection';
// import DynamicPricingTable from './PricingTable';
// import BankDetailsQR from './BankDetailsQR';
// import ScopeOfServices from './ScopeOfServices';

// // const CombinedMembershipQuotation = forwardRef(({ 
// //   data = {}, 
// //   onPrint 
// // }, ref) => {
  
// //   // Combined membership ke liye data modify karo
// //   const combinedData = {
// //     ...data,
// //     membership_type: "COMBINED HOSPITAL + INDIVIDUAL",
// //     // Combined ke liye beds show karo agar available ho
// //     number_of_beds: data.number_of_beds === "N/A" || !data.number_of_beds 
// //       ? "15" 
// //       : data.number_of_beds,
// //     // Combined ke liye note adjust karo
// //     note: data.note || "Combined membership covers both hospital facilities and individual doctor practice. Comprehensive coverage includes hospital staff and doctor's personal practice."
// //   };

// //   return (
// //     <QuotationLayout 
// //       ref={ref}
// //       membershipType="combined" 
// //       onPrint={onPrint}
// //     >
// //       {/* Page 1: Doctor Info */}
// //       <DoctorInfoSection data={combinedData} />
      
// //       {/* Page 2: Details, Pricing & Bank Info */}
// //       <div className="page-break-after-always">
// //         {/* Doctor & Hospital Info for Combined - Green Text */}
// //         <div className="text-green-700 font-semibold text-center text-base mb-6 space-y-1">
// //           <p className="font-bold text-center">DR. NAME - <span className="font-normal">{combinedData.doctor_name}</span></p>
// //           <p className="font-bold">HOSPITAL NAME - <span className="font-normal">{combinedData.hospital_name}</span></p>
// //           <p className="font-bold">ADDRESS - <span className="font-normal">{combinedData.address}</span></p>
// //           {/* <p className="font-bold">SPECIALIZATION/HOSPITAL TYPE - <span className="font-normal">{combinedData.specialization}</span></p>
// //           <p className="font-bold">NO. OF BEDS - <span className="font-normal">{combinedData.number_of_beds}</span></p> */}
// //         </div>

// //         <p className="text-red-600 text-center font-bold text-lg mb-2">
// //           AS BELOW AS
// //         </p>

// //         {/* Dynamic Pricing Table for Combined */}
// //         <DynamicPricingTable data={combinedData} />
        
// //         {/* Bank Details */}
// //         <div className="mt-10">
// //           <BankDetailsQR data={combinedData} />
// //         </div>
// //       </div>
      
// //       {/* Page 3: Scope of Services */}
// //       {/* <div className="page-break-before-always">
// //         <ScopeOfServices membershipType="combined" />



      
// // <div className="mt-8 print:mt-4 border-2 border-gray-700 py-3 print:py-2 px-4 md:mb-4 sm:mb-2">
// //   <p className="text-red-600 text-center font-bold text-base print:text-sm">
// //     NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
// //   </p>
// // </div>
        

// //       </div> */}

// //       <div className="page-break-before-always">
// //   <ScopeOfServices membershipType="combined" />
// //  <div className="mt-8 print:mt-4 border-2 border-gray-700 py-3 print:py-2 px-6 page-break-inside-avoid">
// //   <p className="text-red-600 text-center font-bold text-base print:text-sm">
// //     NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
// //   </p>
// // </div>
// // </div>
// //     </QuotationLayout>
// //   );
// // });

// // components/CombinedMembershipQuotation.jsx - WITH DEBUG LOGS
// const CombinedMembershipQuotation = forwardRef(({ data = {}, onPrint }, ref) => {
  
//   // ✅ ADD DEBUG LOGS
//   console.log("🔧 COMBINED QUOTATION - RAW DATA:", data);
//   console.log("🔧 Doctor Name:", data.doctor_name);
//   console.log("🔧 Hospital Name:", data.hospital_name);
//   console.log("🔧 Address:", data.address);
//   console.log("🔧 Membership Type:", data.membership_type);

//   // ✅ FALLBACK DATA IF EMPTY
//   const combinedData = {
//     ...data,
//     doctor_name: data.doctor_name || "Doctor Name Not Available",
//     hospital_name: data.hospital_name || "Hospital Name Not Available",
//     address: data.address || "Address Not Available",
//     membership_type: data.membership_type || "COMBINED HOSPITAL + INDIVIDUAL",
//     specialization: data.specialization || "Multi-Speciality",
//     number_of_beds: data.number_of_beds || "15",
//   };

//   console.log("🔧 FINAL COMBINED DATA:", combinedData);

//   return (
//     <QuotationLayout ref={ref} membershipType="combined" onPrint={onPrint}>
//       {/* Page 1: Doctor Info */}
//       <DoctorInfoSection data={combinedData} />
      
//       {/* Page 2: Details */}
//       <div className="page-break-after-always">
//         {/* ✅ SIMPLIFIED - DIRECT DATA DISPLAY */}
//         <div className="text-green-700 font-semibold text-center text-base mb-6 space-y-1">
//           {combinedData.doctor_name && (
//             <p className="font-bold">DR. NAME - <span className="font-normal">{combinedData.doctor_name}</span></p>
//           )}
//           {combinedData.hospital_name && (
//             <p className="font-bold">HOSPITAL NAME - <span className="font-normal">{combinedData.hospital_name}</span></p>
//           )}
//           {combinedData.address && (
//             <p className="font-bold">ADDRESS - <span className="font-normal">{combinedData.address}</span></p>
//           )}
//         </div>

//         <p className="text-red-600 text-center font-bold text-lg mb-2">
//           AS BELOW AS
//         </p>

//         <DynamicPricingTable data={combinedData} />
        
//         <div className="mt-10">
//           <BankDetailsQR data={combinedData} />
//         </div>
//       </div>
      
//       {/* Page 3: Scope */}
//       <div className="page-break-before-always">
//         <ScopeOfServices membershipType="combined" data={combinedData} />
        
//         <div className="mt-8 print:mt-4 border-2 border-gray-700 py-3 print:py-2 px-6 page-break-inside-avoid">
//           <p className="text-red-600 text-center font-bold text-base print:text-sm">
//             NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
//           </p>
//         </div>
//       </div>
//     </QuotationLayout>
//   );
// });

// CombinedMembershipQuotation.displayName = 'CombinedMembershipQuotation';

// export default CombinedMembershipQuotation;





// import React, { forwardRef } from 'react';
// import QuotationLayout from '../layout/QuotationLayout';
// import DoctorInfoSection from './DoctorInfoSection';
// import DynamicPricingTable from './PricingTable';
// import BankDetailsQR from './BankDetailsQR';
// import ScopeOfServices from './ScopeOfServices';

// const CombinedMembershipQuotation = forwardRef(({ data = {} }, ref) => {
  
//   // Debug logs
//   console.log("🔧 COMBINED QUOTATION - RAW DATA:", data);
  
//   // COMBINED membership के लिए data prepare करें
//   const combinedData = {
//     ...data,
//     // Force COMBINED type - यह बहुत IMPORTANT है
//     membership_type: "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP",
//     // Combined के लिए beds दिखाएं
//     number_of_beds: data.number_of_beds === "N/A" || !data.number_of_beds 
//       ? "15" 
//       : data.number_of_beds,
//     // Hospital name ensure करें
//     hospital_name: data.hospital_name || "Hospital Name",
//     // Combined के लिए note
//     note: data.note || "Combined membership covers both hospital facilities and individual doctor practice. Comprehensive coverage includes hospital staff and doctor's personal practice.",
//     // Combined के लिए specialization
//     specialization: data.specialization || "Multi-Speciality Hospital"
//   };

//   console.log("🔧 FINAL COMBINED DATA:", {
//     type: combinedData.membership_type,
//     doctor: combinedData.doctor_name,
//     hospital: combinedData.hospital_name,
//     beds: combinedData.number_of_beds
//   });

//   return (
//     <QuotationLayout ref={ref} membershipType="combined">
//       {/* Page 1: Doctor Info */}
//       <div className="page-1 doctor-info-section">
//         <DoctorInfoSection data={combinedData} />
//       </div>
      
//       {/* Page 2: Details, Pricing & Bank Info */}
//       <div className="page-2 page-break-before pricing-section">
//         {/* Doctor & Hospital Info for Combined */}
//         <div className="doctor-hospital-info text-green-700 font-semibold text-center text-base mb-6 space-y-1">
//           <p className="font-bold">DR. NAME - <span className="font-normal">{combinedData.doctor_name || "Dr. Name"}</span></p>
//           <p className="font-bold">HOSPITAL NAME - <span className="font-normal">{combinedData.hospital_name || "Hospital Name"}</span></p>
//           <p className="font-bold">ADDRESS - <span className="font-normal">{combinedData.address || "Address Not Available"}</span></p>
//           <p className="font-bold">HOSPITAL TYPE - <span className="font-normal">{combinedData.specialization}</span></p>
//           <p className="font-bold">NO. OF BEDS - <span className="font-normal">{combinedData.number_of_beds}</span></p>
//         </div>

//         <p className="text-red-600 text-center font-bold text-lg mb-6">
//           AS BELOW AS
//         </p>

//         {/* Dynamic Pricing Table for Combined */}
//         <div className="pricing-table-wrapper no-break-inside">
//           <DynamicPricingTable data={combinedData} />
//         </div>
        
//         {/* Bank Details */}
//         <div className="bank-details no-break-inside mt-10">
//           <BankDetailsQR data={combinedData} />
//         </div>
//       </div>
      
//       {/* Page 3: Scope of Services */}
//       <div className="page-3 page-break-before scope-page">
//         {/* Scope of Services Section */}
//         <div className="scope-of-services-container">
//           <ScopeOfServices membershipType="combined" data={combinedData} />
//         </div>
        
//         {/* VALIDITY NOTE */}
//         <div className="validity-note no-break-inside">
//           <p className="text-red-600 text-center font-bold text-base">
//             NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
//           </p>
//         </div>
//       </div>
//     </QuotationLayout>
//   );
// });

// CombinedMembershipQuotation.displayName = 'CombinedMembershipQuotation';
// export default CombinedMembershipQuotation;






// import React, { forwardRef } from 'react';
// import QuotationLayout from '../layout/QuotationLayout';
// import DoctorInfoSection from './DoctorInfoSection';
// import DynamicPricingTable from './PricingTable';
// import BankDetailsQR from './BankDetailsQR';
// import ScopeOfServices from './ScopeOfServices';

// const CombinedMembershipQuotation = forwardRef(({ data = {} }, ref) => {
  
//   // IMPORTANT: Force COMBINED membership type display
//   const combinedData = {
//     ...data,
//     // This is the CRITICAL fix - Force the membership_type to COMBINED
//     membership_type: "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP",
    
//     // Combined के लिए proper description
//     membership_description: "(COVERAGE OF DOCTOR + HOSPITAL STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)",
    
//     // Hospital details for combined
//     hospital_name: data.hospital_name || "Hospital Name",
//     number_of_beds: data.number_of_beds === "N/A" ? "15" : data.number_of_beds,
    
//     // Combined-specific note
//     note: data.note || "Combined membership covers both hospital facilities and individual doctor practice. Comprehensive coverage includes hospital staff and doctor's personal practice."
//   };

//   console.log("✅ COMBINED QUOTATION DATA:", {
//     membership_type: combinedData.membership_type,
//     doctor: combinedData.doctor_name,
//     hospital: combinedData.hospital_name,
//     beds: combinedData.number_of_beds
//   });

//   return (
//     <QuotationLayout ref={ref} membershipType="combined">
//       {/* Page 1: Doctor Info */}
//       <div className="page-1 doctor-info-section">
//         <DoctorInfoSection data={combinedData} />
//       </div>
      
//       {/* Page 2: Details, Pricing & Bank Info */}
//       <div className="page-2 page-break-before pricing-section">
//         {/* Combined के लिए Doctor + Hospital Info */}
//         <div className="doctor-hospital-info text-green-700 font-semibold text-center text-base mb-6 space-y-1">
//           <p className="font-bold">DR. NAME - <span className="font-normal">{combinedData.doctor_name || "Dr. Name"}</span></p>
//           <p className="font-bold">HOSPITAL NAME - <span className="font-normal">{combinedData.hospital_name || "Hospital Name"}</span></p>
//           <p className="font-bold">ADDRESS - <span className="font-normal">{combinedData.address || "Address Not Available"}</span></p>
//           <p className="font-bold">HOSPITAL TYPE - <span className="font-normal">{combinedData.specialization || "Multi-Speciality Hospital"}</span></p>
//           <p className="font-bold">NO. OF BEDS - <span className="font-normal">{combinedData.number_of_beds}</span></p>
//         </div>

//         <p className="text-red-600 text-center font-bold text-lg mb-6">
//           AS BELOW AS
//         </p>

//         {/* Dynamic Pricing Table for Combined */}
//         <div className="pricing-table-wrapper no-break-inside">
//           <DynamicPricingTable data={combinedData} />
//         </div>
        
//         {/* Bank Details */}
//         <div className="bank-details no-break-inside mt-10">
//           <BankDetailsQR data={combinedData} />
//         </div>
//       </div>
      
//       {/* Page 3: Scope of Services */}
//       <div className="page-3 page-break-before scope-page">
//         {/* Scope of Services Section */}
//         <div className="scope-of-services-container">
//           <ScopeOfServices membershipType="combined" data={combinedData} />
//         </div>
        
//         {/* VALIDITY NOTE */}
//         <div className="validity-note no-break-inside">
//           <p className="text-red-600 text-center font-bold text-base">
//             NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
//           </p>
//         </div>
//       </div>
//     </QuotationLayout>
//   );
// });

// CombinedMembershipQuotation.displayName = 'CombinedMembershipQuotation';
// export default CombinedMembershipQuotation;










// // CombinedMembershipQuotation.jsx
// import React, { forwardRef } from 'react';
// import QuotationLayout from '../layout/QuotationLayout';
// import DoctorInfoSection from './DoctorInfoSection';
// import DynamicPricingTable from './PricingTable';
// import BankDetailsQR from './BankDetailsQR';
// import ScopeOfServices from './ScopeOfServices';

// const CombinedMembershipQuotation = forwardRef(({ data = {} }, ref) => {
  
//   console.log("🔧 COMBINED_QUOTATION - INCOMING DATA:", data);

//   // NORMALIZE membership type string
//   const normalizeMembershipType = (type) => {
//     if (!type) return "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP";
    
//     if (type.includes('COMBINED') || type.includes('HOSPITAL + INDIVIDUAL')) {
//       return "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP";
//     }
//     return type;
//   };

//   // Extract doctor name properly
//   const getDoctorName = () => {
//     if (data.doctor_name) {
//       // Remove "Dr." prefix if exists to avoid duplication
//       return data.doctor_name.replace(/^Dr\.\s*/i, '').trim();
//     }
//     return "Name Not Available";
//   };

//   // Extract hospital name properly
//   const getHospitalName = () => {
//     if (data.hospital_name && data.hospital_name !== "Hospital Name") {
//       return data.hospital_name;
//     }
//     return `${getDoctorName()}'s Hospital`;
//   };

//   const combinedData = {
//     ...data,
//     // CRITICAL: Normalize membership type
//     membership_type: normalizeMembershipType(data.membership_type),
    
//     // Ensure proper names
//     doctor_name: getDoctorName(),
//     hospital_name: getHospitalName(),
    
//     // Ensure hospital details are shown
//     number_of_beds: data.number_of_beds === "N/A" ? "15" : data.number_of_beds,
    
//     // Combined-specific note
//     note: data.note || "Combined membership covers both hospital facilities and individual doctor practice. Comprehensive coverage includes hospital staff and doctor's personal practice."
//   };

//   console.log("✅ NORMALIZED_COMBINED_DATA:", {
//     membership_type: combinedData.membership_type,
//     doctor_name: combinedData.doctor_name,
//     hospital_name: combinedData.hospital_name,
//     beds: combinedData.number_of_beds
//   });

//   return (
//     <QuotationLayout ref={ref} membershipType="combined">
//       {/* Page 1: Doctor Info */}
//       <div className="page-1 doctor-info-section">
//         <DoctorInfoSection data={combinedData} />
//       </div>
      
//       {/* Page 2: Details, Pricing & Bank Info */}
//       <div className="page-2 page-break-before pricing-section">
//         {/* Combined के लिए Doctor + Hospital Info */}
//         <div className="doctor-hospital-info text-green-700 font-semibold text-center text-base mb-6 space-y-1">
//           <p className="font-bold">DR. NAME - <span className="font-normal">{combinedData.doctor_name || "Dr. Name"}</span></p>
//           <p className="font-bold">HOSPITAL NAME - <span className="font-normal">{combinedData.hospital_name || "Hospital Name"}</span></p>
//           <p className="font-bold">ADDRESS - <span className="font-normal">{combinedData.address || "Address Not Available"}</span></p>
//           <p className="font-bold">HOSPITAL TYPE - <span className="font-normal">{combinedData.specialization || "Multi-Speciality Hospital"}</span></p>
//           <p className="font-bold">NO. OF BEDS - <span className="font-normal">{combinedData.number_of_beds}</span></p>
//         </div>

//         <p className="text-red-600 text-center font-bold text-lg mb-6">
//           AS BELOW AS
//         </p>

//         {/* Dynamic Pricing Table for Combined */}
//         <div className="pricing-table-wrapper no-break-inside">
//           <DynamicPricingTable data={combinedData} />
//         </div>
        
//         {/* Bank Details */}
//         <div className="bank-details no-break-inside mt-10">
//           <BankDetailsQR data={combinedData} />
//         </div>
//       </div>
      
//       {/* Page 3: Scope of Services */}
//       <div className="page-3 page-break-before scope-page">
//         {/* Scope of Services Section */}
//         <div className="scope-of-services-container">
//           <ScopeOfServices membershipType="combined" data={combinedData} />
//         </div>
        
//         {/* VALIDITY NOTE */}
//         <div className="validity-note no-break-inside">
//           <p className="text-red-600 text-center font-bold text-base">
//             NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
//           </p>
//         </div>
//       </div>
//     </QuotationLayout>
//   );
// });

// CombinedMembershipQuotation.displayName = 'CombinedMembershipQuotation';
// export default CombinedMembershipQuotation;



// CombinedMembershipQuotation.jsx - FINAL
import React, { forwardRef } from 'react';
import QuotationLayout from '../layout/QuotationLayout';
import DoctorInfoSection from './DoctorInfoSection';
import DynamicPricingTable from './PricingTable';
import BankDetailsQR from './BankDetailsQR';
import ScopeOfServices from './ScopeOfServices';

const CombinedMembershipQuotation = forwardRef(({ data = {} }, ref) => {
  
  // Prepare combined data
  const combinedData = {
    ...data,
    // Force combined membership type
    membership_type: "COMBINED HOSPITAL + INDIVIDUAL MEMBERSHIP",
    
    // Ensure proper names
    doctor_name: data.doctor_name || "Dr. Name",
    hospital_name: data.hospital_name || "Hospital Name",
    number_of_beds: data.number_of_beds === "N/A" ? "15" : data.number_of_beds,
  };

  return (
    <QuotationLayout ref={ref} membershipType="combined">
      {/* PAGE 1: Doctor Info */}
      <div className="page-1">
        <DoctorInfoSection data={combinedData} />
      </div>
      
      {/* PAGE 2: Pricing & Bank Details */}
      <div className="page-2 page-break-before print:mt-[130px] print:pt-[120px]">
        {/* Doctor/Hospital Info */}
        <div className="doctor-hospital-info text-green-700 text-center mb-4">
          <p className="font-bold print:pt-[40px]"> <span className="font-normal">{combinedData.doctor_name}</span></p>
          <p className="font-bold"><span className="font-normal">{combinedData.hospital_name}</span></p>
          <p className="font-bold"><span className="font-normal">{combinedData.address || "Address Not Available"}</span></p>
          {/* <p className="font-bold">HOSPITAL TYPE - <span className="font-normal">{combinedData.specialization || "Multi-Speciality Hospital"}</span></p> */}
          {/* <p className="font-bold">NO. OF BEDS - <span className="font-normal">{combinedData.number_of_beds}</span></p> */}
        </div>

        <p className="text-red-600 text-center font-bold text-lg mb-4">
          AS BELOW AS
        </p>

        {/* Pricing Table */}
        <div className="mb-6">
          <DynamicPricingTable data={combinedData} />
        </div>
        
        {/* Bank Details */}
        <div className="mt-8">
          <BankDetailsQR data={combinedData} />
        </div>
      </div>
      
      {/* PAGE 3 & 4: Scope of Services */}
      <div className="page-3 page-break-before mt-[130px] pt-[120px]">
        <div className="scope-of-services-container mb-6">
          <ScopeOfServices membershipType="combined" data={combinedData} />
        </div>
        
        {/* Validity Note - Will appear on last page */}
        <div className="validity-note">
          <p className="text-red-600 text-center font-bold">
            NOTE : THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
          </p>
        </div>
      </div>
    </QuotationLayout>
  );
});

export default CombinedMembershipQuotation;