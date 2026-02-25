// import React from 'react';
// import { useParams } from 'react-router-dom';
// import useServiceAgreementData from '../Invoices/serviceAgreement(SA)/hooks/useServiceAgreementDate'; // Adjust path if needed
// // Assume you have Header component (same as SA)
// import Header from '../Invoices/serviceAgreement(SA)/Header';
// import Footer from '../Invoices/serviceAgreement(SA)/Footer';

// // Helper to format date
// const formatDate = (isoString) => {
//   if (!isoString) return '________________';
//   try {
//     return new Date(isoString).toLocaleDateString('en-GB'); // DD-MM-YYYY
//   } catch {
//     return '________________';
//   }
// };

// // Helper for full residential address
// const getFullAddress = (addr) => {
//   if (!addr) return '_______________________________________________';
//   const parts = [
//     addr.address || '',
//     addr.city ? `, ${addr.city}` : '',
//     addr.district ? `, Dist. ${addr.district}` : '',
//     addr.taluka ? `, Tal. ${addr.taluka}` : '',
//     addr.state ? `, ${addr.state}` : '',
//     addr.pinCode ? ` - ${addr.pinCode}` : '',
//     addr.country ? `, ${addr.country}` : ''
//   ];
//   return parts.filter(Boolean).join('') || '_______________________________________________';
// };

// // Helper to calculate membership years
// const calculateMembershipYears = (start, end) => {
//   if (!start || !end) return '______';

//   try {
//     // Handle different date formats
//     const parseDate = (dateStr) => {
//       if (!dateStr) return null;

//       // If it's already a Date object, return it
//       if (dateStr instanceof Date) return dateStr;

//       // If it's a string, try to parse it
//       const date = new Date(dateStr);

//       // Check if the date is valid
//       if (isNaN(date.getTime())) {
//         console.error('Invalid date string:', dateStr);
//         return null;
//       }

//       return date;
//     };

//     const s = parseDate(start);
//     const e = parseDate(end);

//     if (!s || !e) {
//       console.error('Could not parse dates:', start, end);
//       return '______';
//     }

//     let years = e.getFullYear() - s.getFullYear();

//     // Adjust if end date is before anniversary in the year
//     if (
//       e.getMonth() < s.getMonth() ||
//       (e.getMonth() === s.getMonth() && e.getDate() < s.getDate())
//     ) {
//       years--;
//     }

//     if (years > 0) {
//       return `${years} Year${years > 1 ? 's' : ''}`;
//     } else {
//       // Fallback: calculate based on days difference
//       const timeDiff = e.getTime() - s.getTime();
//       const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
//       const yearsDiff = Math.floor(daysDiff / 365);

//       if (yearsDiff > 0) {
//         return `${yearsDiff} Year${yearsDiff > 1 ? 's' : ''}`;
//       } else {
//         // If less than a year, calculate months
//         const monthsDiff = Math.floor(daysDiff / 30);

//         // Convert months to years if 12 or more months
//         if (monthsDiff >= 12) {
//           const yearsFromMonths = Math.floor(monthsDiff / 12);
//           return `${yearsFromMonths} Year${yearsFromMonths > 1 ? 's' : ''}`;
//         }

//         return monthsDiff > 0 ? `${monthsDiff} Month${monthsDiff > 1 ? 's' : ''}` : '______';
//       }
//     }
//   } catch (err) {
//     console.error('Error calculating membership years:', err);
//     return '______';
//   }
// };

// const MembershipForm = () => {
//   const { id } = useParams(); // salesBill id
//   const { doctor, salesBill, loading } = useServiceAgreementData('monthly', id); // Reuse hook (adjust type if needed)

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (!doctor || !salesBill) {
//     return <div className="text-center py-8">Error loading membership form data.</div>;
//   }

//   // Extract logic from doctor object (adjust keys as per your backend response)
//   const doctorType = doctor.doctorType || 'individual'; // "individual" or "hospital"
//   const isLinked = doctor.hasSpouse || false; // true if spouse/Doctor 2 exists

//   // Get linked doctor data if available
//   const linkedDoctor = doctor.linkedDoctor || null;

//   // Get first payment details from salesBill
//   const firstPayment = salesBill.payments && salesBill.payments.length > 0
//     ? salesBill.payments[0]
//     : null;

//   const handlePrint = () => {
//     window.print();
//   };

//   // Function to get the highest coverage amount from policies as indemnity premium
//   const getIndemnityPremium = () => {
//     if (!doctor.originalDoctor?.policies || !Array.isArray(doctor.originalDoctor.policies)) {
//       return salesBill.totalAmount || 0;
//     }

//     // Find the highest coverage amount from policies
//     const maxCoverage = doctor.originalDoctor.policies.reduce((max, policy) => {
//       const coverage = policy.coverageAmount || policy.policyId?.coverageAmount || 0;
//       return Math.max(max, coverage);
//     }, 0);

//     return maxCoverage > 0 ? maxCoverage : salesBill.totalAmount || 0;
//   };

//   const indemnityPremium = getIndemnityPremium();

//   return (
//     <>
//       {/* Print Button */}
//       <div className="fixed top-4 right-4 z-50 print:hidden">
//         <button
//           onClick={handlePrint}
//           className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
//         >
//           🖨️ Print Membership Form
//         </button>
//       </div>

//       {/* A4 Container */}
//       <div className="font-[Times New Roman] text-[12px] leading-[18px] print:text-black bg-white min-h-screen">
//         <style jsx global>{`
//           @media print {
//             @page {
//               size: A4 portrait;
//               margin: 12mm 14mm 15mm 14mm;   /* thoda balanced margin */
//             }
//             body {
//               margin: 0;
//               padding: 0;
//               -webkit-print-color-adjust: exact !important;
//               print-color-adjust: exact !important;
//             }
//             .print-hidden { display: none !important; }
//           }

//           .a4-page {
//             width: 210mm;
//             min-height: 297mm;
//             margin: 20px auto;
//             padding: 0 14mm;
//             background: white;
//             box-shadow: 0 4px 14px rgba(0,0,0,0.12);
//             font-family: 'Times New Roman', Times, serif;
//             font-size: 12px;
//             line-height: 1.45;
//             color: #000;
//           }

//           .avoid-break { page-break-inside: avoid; }
//           .section-break { page-break-before: always; margin-top: 24px; }
//           .declaration-section { margin-top: 32px; }

//           .underline-dotted-thick {
//             text-decoration: underline dotted;
//             text-decoration-thickness: 2px;
//             text-underline-offset: 3px;
//           }

//           .bg-gray-100 {
//             background-color: #f5f5f5 !important;
//             padding: 8px 12px;
//             border-radius: 4px;
//           }

//           .text-13 { font-size: 13px; }
//           .text-14 { font-size: 14px; }
//           .leading-6  { line-height: 1.5; }   /* better readability */
//           .leading-5  { line-height: 1.25; }  /* tight sections */

//           @media print {
//             .section-break {
//               page-break-before: always;
//               margin-top: 20px;
//             }

//             .avoid-break {
//               page-break-inside: avoid;
//             }

//             .force-new-page {
//               page-break-before: always !important;
//             }

//             /* Declaration ko last page pe force karo agar content zyada hai */
//             .declaration-section {
//               page-break-before: auto;
//               orphans: 3;   /* min 3 lines bottom pe */
//               widows: 3;    /* min 3 lines top pe */
//             }
//           }
//         `}</style>

//         {/* Page 1 */}
//         <div className="a4-page">
//           <Header /> {/* Your header with logo & company info */}

//           {/* SALE BILL NO Badge */}
//           <div className="flex justify-end mt-4 mr-8">

//           <div className="text-xs font-bold">
//             SALE BILL NO: <span className=' bg-blue-600 text-white px-4 py-1 rounded ml-2'> {salesBill.billNumber || 'RML-XXXXX'}</span>
//           </div>
//           </div>

//           {/* Declaration Text */}
//           <div className="mt-8 text-center text-14 font-bold">
//             DOCTOR MEMBERSHIP FORM
//           </div>

//           <div className="mt-6 text-justify text-[12px] leading-5">
//             As Per Schemes and services of Rapid Medicolegal Services India Ltd. I here voluntarily agree to become a member of Rapid for which I deposit Rs.{' '}
//             <span className="underline-dotted-thick">
//               {salesBill?.totalAmount?.toLocaleString('en-IN') || '________'}
//             </span> for{' '}
//             <span className="underline-dotted-thick">
//               {calculateMembershipYears(salesBill?.billDate, salesBill?.dueDate) || '______'}
//             </span> and I am quoting my details below.
//           </div>

//           {/* Doctor 1 Details */}
//           {doctorType !== 'hospital' && (
//             <div className="avoid-break mt-6">
//               <div className="font-bold text-13 bg-gray-100 p-3">Doctor 1 Details</div>
//               <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-3 text-[12px] leading-6">
//                 <div>Full Name: <span className="underline-dotted-thick">  {doctor.originalDoctor?.fullName || doctor.fullName}</span></div>
//                 <div>Speciality: <span className="underline-dotted-thick">{Array.isArray(doctor.originalDoctor?.specialization) ? doctor.originalDoctor.specialization.join(", ") : Array.isArray(doctor.specialization) ? doctor.specialization.join(", ") : doctor.specialization || '________________'}</span></div>
//                 <div>Qualification: <span className="underline-dotted-thick">{doctor.originalDoctor?.qualification || doctor.qualification}</span></div>
//                 <div>Medical Registration No.: <span className="underline-dotted-thick">{doctor.originalDoctor?.licenseNumber || doctor.licenseNumber}</span></div>
//                 <div>Regi. Year: <span className="underline-dotted-thick">{doctor.originalDoctor?.registrationYear || doctor.registrationYear}</span></div>
//                 <div>Date of Birth: <span className="underline-dotted-thick">{formatDate(doctor.originalDoctor?.dateOfBirth || doctor.dateOfBirth)}</span></div>
//                 <div>Mobile (Wa): <span className="underline-dotted-thick">{doctor.originalDoctor?.whatsappNumber || doctor.originalDoctor?.phoneNumber || doctor.whatsappNumber || doctor.phoneNumber || '________________'}</span></div>
//                 <div>Mobile: <span className="underline-dotted-thick">{doctor.originalDoctor?.phoneNumber || doctor.phoneNumber || '________________'}</span></div>
//                 <div>Email: <span className="underline-dotted-thick">{doctor.originalDoctor?.email || doctor.email || '________________'}</span></div>
//                 <div>Aadhar Number: <span className="underline-dotted-thick">{doctor.originalDoctor?.aadharNumber || doctor.aadharNumber || '________________'}</span></div>
//                 <div>Pan Number: <span className="underline-dotted-thick">{doctor.originalDoctor?.panNumber || doctor.panNumber || '________________'}</span></div>
//                 <div className="col-span-2">
//                   Residential Address: <span className="underline-dotted-thick inline-block min-w-[300px]">{getFullAddress(doctor.originalDoctor?.contactDetails?.currentAddress || doctor.contactDetails?.currentAddress)}</span>
//                 </div>
//                 <div>Pin: <span className="underline-dotted-thick">{doctor.originalDoctor?.contactDetails?.currentAddress?.pinCode || doctor.contactDetails?.currentAddress?.pinCode || '________________'}</span></div>
//               </div>
//             </div>
//           )}

//           {/* Doctor 2 Details (Spouse) */}
//           {isLinked && linkedDoctor && (
//             <div className="avoid-break mt-8 section-break">
//               <div className="font-bold text-13 bg-gray-100 p-3">Doctor 2 (Spouse) Details</div>
//               <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-3 text-[12px] leading-6">
//                 <div>Full Name: <span className="underline-dotted-thick">{linkedDoctor.fullName}</span></div>
//                 <div>Speciality: <span className="underline-dotted-thick">{Array.isArray(linkedDoctor.specialization) ? linkedDoctor.specialization.join(", ") : linkedDoctor.specialization || '________________'}</span></div>
//                 <div>Qualification: <span className="underline-dotted-thick">{linkedDoctor.qualification}</span></div>
//                 <div>Medical Registration No.: <span className="underline-dotted-thick">{linkedDoctor.licenseNumber}</span></div>
//                 <div>Regi. Year: <span className="underline-dotted-thick">{linkedDoctor.registrationYear}</span></div>
//                 <div>Date of Birth: <span className="underline-dotted-thick">{formatDate(linkedDoctor.dateOfBirth)}</span></div>
//                 <div>Mobile (Wa): <span className="underline-dotted-thick">{linkedDoctor.whatsappNumber || linkedDoctor.phoneNumber || '________________'}</span></div>
//                 <div>Mobile: <span className="underline-dotted-thick">{linkedDoctor.phoneNumber || '________________'}</span></div>
//                 <div>Email: <span className="underline-dotted-thick">{linkedDoctor.email || '________________'}</span></div>
//                 <div>Aadhar Number: <span className="underline-dotted-thick">{linkedDoctor.aadharNumber || '________________'}</span></div>
//                 <div>Pan Number: <span className="underline-dotted-thick">{linkedDoctor.panNumber || '________________'}</span></div>
//                 <div className="col-span-2">
//                   Residential Address: <span className="underline-dotted-thick inline-block min-w-[300px]">{getFullAddress(linkedDoctor.contactDetails?.currentAddress)}</span>
//                 </div>
//                 <div>Pin: <span className="underline-dotted-thick">{linkedDoctor.contactDetails?.currentAddress?.pinCode || '________________'}</span></div>
//               </div>
//             </div>
//           )}

//           {/* Hospital / Clinic Details */}
//           {(doctorType === 'hospital' || doctorType === 'hospital_individual') && (
//             <div className="avoid-break mt-8">
//               <div className="font-bold text-13 bg-gray-100 p-3">Hospital / Clinic Details</div>
//               <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-3 text-[12px] leading-6">
//                 <div>Hospital / Clinic Name: <span className="underline-dotted-thick">{doctor.hospitalName}</span></div>
//                 <div>Hospital Address: <span className="underline-dotted-thick inline-block min-w-[300px]">{getFullAddress(doctor.hospitalAddress || doctor.originalDoctor?.hospitalAddress)}</span></div>
//                 <div>City: <span className="underline-dotted-thick">{(doctor.hospitalAddress || doctor.originalDoctor?.hospitalAddress)?.city || '________________'}</span></div>
//                 <div>District: <span className="underline-dotted-thick">{(doctor.hospitalAddress || doctor.originalDoctor?.hospitalAddress)?.district || '________________'}</span></div>
//                 <div>State: <span className="underline-dotted-thick">{(doctor.hospitalAddress || doctor.originalDoctor?.hospitalAddress)?.state || '________________'}</span></div>
//                 <div>Pin Code: <span className="underline-dotted-thick">{(doctor.hospitalAddress || doctor.originalDoctor?.hospitalAddress)?.pinCode || '________________'}</span></div>
//               </div>
//             </div>
//           )}

//           {/* Membership Details */}
//           <div className="avoid-break mt-8">
//             <div className="font-bold text-13 bg-gray-100 p-3">Membership Details</div>
//             <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-3 text-[12px] leading-6">
//               <div>Membership Type: <span className="underline-dotted-thick">{doctor.doctorType}</span></div>
//               <div>Membership Start Date: <span className="underline-dotted-thick">{formatDate(salesBill.billDate)}</span></div>
//               <div>Membership End Date: <span className="underline-dotted-thick">{formatDate(salesBill.dueDate)}</span></div>
//               <div>Membership Period: <span className="underline-dotted-thick">{calculateMembershipYears(salesBill?.billDate, salesBill?.dueDate) || '________________'}</span></div>
//             </div>
//           </div>

//           {/* Hospital Membership Extra Fields (only if hospital) */}
//           {(doctorType === 'hospital') && (
//             <div className="avoid-break mt-8">
//               <div className="font-bold text-13 bg-gray-100 p-3">Hospital Membership Details</div>
//               <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-3 text-[12px] leading-6">
//                 <div>Type of Hospital: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.hospitalType || '________________'}</span></div>
//                 <div>No. of Beds: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.beds || '________________'}</span></div>
//                 <div>Regi No Pan Number: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.hospitalPanNumber || '________________'}</span></div>
//                 <div>Year of Establishment: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.establishmentYear || '________________'}</span></div>
//                 <div>Hospital Contact: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.director?.contact || '________________'}</span></div>
//                 <div>WhatsApp No.: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.admin?.contact || '________________'}</span></div>
//                 <div>Email: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.director?.email || '________________'}</span></div>
//                 <div>Website: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.website || '________________'}</span></div>
//                 <div>Ownership Type: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.ownershipType || '________________'}</span></div>
//                 <div>Departments: <span className="underline-dotted-thick">
//                   {doctor.originalDoctor?.hospitalDetails?.departments && Array.isArray(doctor.originalDoctor.hospitalDetails.departments) && doctor.originalDoctor.hospitalDetails.departments.length > 0
//                     ? doctor.originalDoctor.hospitalDetails.departments.join(', ')
//                     : '________________'}
//                 </span></div>
//               </div>
//             </div>
//           )}

//           {/* Authorized Person Details (only hospital) */}
//           {(doctorType === 'hospital') && (
//             <div className="avoid-break mt-8">
//               <div className="font-bold text-13 bg-gray-100 p-3">Authorized Person Details (Owner/Admin)</div>
//               <div className="mt-3 text-[12px] leading-6">
//                 1. Medical Superintendent / Director :<br />
//                 Name: {doctor.originalDoctor?.hospitalDetails?.director?.name || '________________'} Designation: ________________ Contact No: {doctor.originalDoctor?.hospitalDetails?.director?.contact || '________________'} Email ID: {doctor.originalDoctor?.hospitalDetails?.director?.email || '________________'}<br /><br />
//                 2. Admin / Mgmt Officer Name {doctor.originalDoctor?.hospitalDetails?.admin?.name || '________________'} Contact No {doctor.originalDoctor?.hospitalDetails?.admin?.contact || '________________'} Email ID: {doctor.originalDoctor?.hospitalDetails?.admin?.email || '________________'}<br /><br />
//                 Department Available:<br />
//                 {doctor.originalDoctor?.hospitalDetails?.departments && Array.isArray(doctor.originalDoctor.hospitalDetails.departments) &&
//                   doctor.originalDoctor.hospitalDetails.departments.map((dept, index) => (
//                     <div key={index}>{index + 1}. {dept || '________________'}<br /></div>
//                   ))}
//                 {(!doctor.originalDoctor?.hospitalDetails?.departments ||
//                   !Array.isArray(doctor.originalDoctor.hospitalDetails.departments) ||
//                   doctor.originalDoctor.hospitalDetails.departments.length === 0) &&
//                   <>
//                     1. ________________<br />
//                     2. ________________<br />
//                     3. ________________<br />
//                   </>
//                 }
//               </div>
//             </div>
//           )}

//           {/* Payment Details */}
//           <div className="avoid-break mt-8">
//             <div className="font-bold text-13 bg-gray-100 p-3">Payment Details</div>
//             <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-3 text-[12px] leading-6">
//               {firstPayment ? (
//                 <>
//                   <div>Payment Date: <span className="font-bold">{formatDate(firstPayment.paymentDate)}</span></div>
//                   <div>Payment Mode: <span className="font-bold">{firstPayment.paymentMethod || '________________'}</span></div>
//                   <div>Cheque No.: <span className="font-bold">{firstPayment.paymentMethod === 'cheque' ? (firstPayment.paymentId?.bankDetails?.chequeNumber || firstPayment.referenceNumber) : '—'}</span></div>
//                   <div>Drawn On (Bank): <span className="font-bold">{firstPayment.paymentMethod === 'cheque' ? (firstPayment.paymentId?.drawnOnBank || '________________') : '________________'}</span></div>
//                   <div>Amount Paid: <span className="font-bold">₹{firstPayment.amount?.toLocaleString('en-IN') || '________________'}</span></div>
//                 </>
//               ) : (
//                 <>
//                   <div>Cheque Date: ________________</div>
//                   <div>Cheque No.: ________________</div>
//                   <div>Drawn On (Bank): ________________</div>
//                   <div>Service Charges: ________________</div>
//                   <div>GST: ________________</div>
//                   <div>Indemnity Premium: ₹{indemnityPremium?.toLocaleString('en-IN') || '________________'}</div>
//                   <div>Total Amount: <span className="font-bold">₹{salesBill.totalAmount?.toLocaleString('en-IN') || '________'}</span></div>
//                 </>
//               )}
//               <div>Service Charges: <span className="font-bold">₹{salesBill.subTotal?.toLocaleString('en-IN') || '________________'}</span></div>
//               <div>GST: <span className="font-bold">₹{(salesBill.totalAmount - salesBill.subTotal)?.toLocaleString('en-IN') || '________________'}</span></div>
//               <div>Indemnity Premium: <span className="font-bold">₹{indemnityPremium?.toLocaleString('en-IN') || '________________'}</span></div>
//               <div>Total Amount: <span className="font-bold">₹{salesBill.totalAmount?.toLocaleString('en-IN') || '________'}</span></div>
//               <div>Note: {salesBill.notes || '________________'}</div>
//             </div>
//           </div>

//           {/* Declaration & Signatures */}
//           <div className="declaration-section text-center border-t border-black pt-4">
//             <p className="font-bold text-14">Declaration</p>
//             <p className="mt-2 text-[12px]">
//               I/We hereby declare that we have fully understood the policy coverage details, services, rules, and regulations of Rapid Medicolegal Services India Ltd.
//             </p>

//             <div className="mt-16 grid grid-cols-2 gap-8 text-right">
//               {doctorType === 'hospital' ? (
//                 <div className="col-span-2 text-center">
//                   Hospital Representative Signature: ________________<br />
//                   <span className="text-[10px]">(Name & Designation)</span>
//                 </div>
//               ) : (
//                 <>
//                   <div>
//                     Doctor 1 Signature: ________________<br />
//                     <span className="text-[10px]">(Name: {doctor.fullName})</span>
//                   </div>
//                   {isLinked && (
//                     <div>
//                       Doctor 2 Signature: ________________<br />
//                       <span className="text-[10px]">(Name: {linkedDoctor?.fullName || '________________'})</span>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             <div className="mt-16">
//               Name of Executive/Officer: ________________ (sales person name)
//             </div>
//           </div>

//           {/* Company Footer */}
//           <div className="mt-12 text-center text-[10px] border-t border-black pt-4">
//             <Footer />
//           </div>
//         </div>

//         {/* Visual Page Break Indicator (for screen only) */}
//         <div className="page-break-dotted print:hidden" />

//         {/* Page 2 (only if content overflows - can be extended) */}
//         {/* <div className="a4-page print:hidden">
//           <p className="text-center text-gray-500 mt-20">Page 2 (if content overflows)</p>
//           <p className="text-center mt-4 text-sm">This area will be used if long hospital details or more departments are added.</p>
//         </div> */}
//       </div>
//     </>
//   );
// };

// export default MembershipForm;



import React from 'react';
import { useParams } from 'react-router-dom';
import useServiceAgreementData from '../Invoices/serviceAgreement(SA)/hooks/useServiceAgreementDate';
import Header from '../Invoices/serviceAgreement(SA)/Header';
import Footer from '../Invoices/serviceAgreement(SA)/Footer';

// Helper to format date
const formatDate = (isoString) => {
  if (!isoString) return '________________';
  try {
    return new Date(isoString).toLocaleDateString('en-GB'); // DD-MM-YYYY
  } catch {
    return '________________';
  }
};

// Helper for full residential address
const getFullAddress = (addr) => {
  if (!addr) return '_______________________________________________';
  const parts = [
    addr.address || '',
    addr.city ? `, ${addr.city}` : '',
    addr.district ? `, Dist. ${addr.district}` : '',
    addr.taluka ? `, Tal. ${addr.taluka}` : '',
    addr.state ? `, ${addr.state}` : '',
    addr.pinCode ? ` - ${addr.pinCode}` : '',
    addr.country ? `, ${addr.country}` : ''
  ];
  return parts.filter(Boolean).join('') || '_______________________________________________';
};

// Helper to calculate membership years
const calculateMembershipYears = (start, end) => {
  if (!start || !end) return '______';

  try {
    // Handle different date formats
    const parseDate = (dateStr) => {
      if (!dateStr) return null;

      // If it's already a Date object, return it
      if (dateStr instanceof Date) return dateStr;

      // If it's a string, try to parse it
      const date = new Date(dateStr);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateStr);
        return null;
      }

      return date;
    };

    const s = parseDate(start);
    const e = parseDate(end);

    if (!s || !e) {
      console.error('Could not parse dates:', start, end);
      return '______';
    }

    let years = e.getFullYear() - s.getFullYear();

    // Adjust if end date is before anniversary in the year
    if (
      e.getMonth() < s.getMonth() ||
      (e.getMonth() === s.getMonth() && e.getDate() < s.getDate())
    ) {
      years--;
    }

    if (years > 0) {
      return `${years} Year${years > 1 ? 's' : ''}`;
    } else {
      // Fallback: calculate based on days difference
      const timeDiff = e.getTime() - s.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      const yearsDiff = Math.floor(daysDiff / 365);

      if (yearsDiff > 0) {
        return `${yearsDiff} Year${yearsDiff > 1 ? 's' : ''}`;
      } else {
        // If less than a year, calculate months
        const monthsDiff = Math.floor(daysDiff / 30);

        // Convert months to years if 12 or more months
        if (monthsDiff >= 12) {
          const yearsFromMonths = Math.floor(monthsDiff / 12);
          return `${yearsFromMonths} Year${yearsFromMonths > 1 ? 's' : ''}`;
        }

        return monthsDiff > 0 ? `${monthsDiff} Month${monthsDiff > 1 ? 's' : ''}` : '______';
      }
    }
  } catch (err) {
    console.error('Error calculating membership years:', err);
    return '______';
  }
};

const MembershipForm = () => {
  const { id } = useParams(); // salesBill id
  const { doctor, salesBill, loading } = useServiceAgreementData('monthly', id); // Reuse hook (adjust type if needed)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!doctor || !salesBill) {
    return <div className="text-center py-8">Error loading membership form data.</div>;
  }

  // Extract logic from doctor object (adjust keys as per your backend response)
  const doctorType = doctor.doctorType || 'individual'; // "individual" or "hospital"
  const isLinked = doctor.hasSpouse || false; // true if spouse/Doctor 2 exists

  // Get linked doctor data if available
  const linkedDoctor = doctor.linkedDoctor || null;

  // Get first payment details from salesBill
  const firstPayment = salesBill.payments && salesBill.payments.length > 0
    ? salesBill.payments[0]
    : null;

  const handlePrint = () => {
    window.print();
  };

  // Function to get the highest coverage amount from policies as indemnity premium
  const getIndemnityPremium = () => {
    if (!doctor.originalDoctor?.policies || !Array.isArray(doctor.originalDoctor.policies)) {
      return salesBill.totalAmount || 0;
    }

    // Find the highest coverage amount from policies
    const maxCoverage = doctor.originalDoctor.policies.reduce((max, policy) => {
      const coverage = policy.coverageAmount || policy.policyId?.coverageAmount || 0;
      return Math.max(max, coverage);
    }, 0);

    return maxCoverage > 0 ? maxCoverage : salesBill.totalAmount || 0;
  };

  const indemnityPremium = getIndemnityPremium();

  return (
    <>
      {/* Print Button */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
        >
          🖨️ Print Membership Form
        </button>
      </div>

      {/* A4 Container */}
      <div className="font-[Times New Roman] text-[12px] leading-[1.42] print:text-black bg-white min-h-screen">
        <style jsx global>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm 12mm 12mm 12mm;
            }

            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .print-hidden {
              display: none !important;
            }

            /* Prevent page breaks inside these elements */
            .avoid-break {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* Force page break before */
            .page-break-before {
              page-break-before: always !important;
              break-before: page !important;
            }

            /* Prevent orphans and widows */
            p, div {
              orphans: 3;
              widows: 3;
            }

            /* Keep together related content */
            .keep-together {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* Grid rows should try to stay together */
            .grid-compact > div {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* Allow breaking in long grids if absolutely necessary */
            .grid-compact.allow-break-if-needed {
              page-break-inside: auto !important;
              break-inside: auto !important;
            }

            /* Signature section must stay together */
            .signature-section {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              min-height: 4cm;
            }

            /* Declaration should ideally be on new page if content is long */
            .declaration-section {
              page-break-before: auto !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* If only 1-2 lines fit, push to next page */
            .section-start {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }

            /* Prevent breaking after section titles */
            .section-title {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }

            /* Horizontal dividers */
            hr.divider {
              page-break-after: avoid !important;
              break-after: avoid !important;
              margin: 0.6cm 0 !important;
            }
          }

          /* Screen + Print Styles */
          .a4-page {
            width: 210mm;
            min-height: 297mm;
            margin: 15px auto;
            padding: 0 12mm;
            background: white;
            box-shadow: 0 4px 14px rgba(0,0,0,0.12);
            font-family: 'Times New Roman', Times, serif;
            font-size: 12px;
            line-height: 1.42;
            color: #000;
          }

          @media print {
            .a4-page {
              margin: 0;
              box-shadow: none;
              min-height: auto;
            }
          }

          .avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .section-start {
            margin-top: 0.6cm;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .section-title {
            font-size: 13px;
            font-weight: bold;
            background: #f5f5f5;
            padding: 5px 8px;
            margin-bottom: 0.3cm;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          @media print {
            .section-title {
              background: #f5f5f5 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }

          .grid-compact {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 1cm;
            row-gap: 0.28cm;
          }

          /* Individual grid items stay together */
          .grid-compact > div {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .underline-dotted-thick {
            text-decoration: underline dotted;
            text-decoration-thickness: 2px;
            text-underline-offset: 2.5px;
            display: inline-block;
            min-width: 130px;
          }

          .long-underline {
            min-width: 300px;
          }

          .signature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.8cm;
            margin-top: 1.6cm;
            text-align: center;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .sig-line {
            border-bottom: 1px solid #000;
            margin: 0.4cm 0 0.2cm;
          }

          hr.divider {
            border: none;
            border-top: 1px solid #000;
            margin: 0.6cm 0;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          /* Long text fields should wrap naturally */
          .long-text-field {
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
          }

          /* Keep payment details together */
          .payment-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Hospital details sections */
          .hospital-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Authorized person can break if very long */
          .authorized-person-section {
            page-break-inside: auto !important;
            break-inside: auto !important;
          }

          /* Department list items */
          .dept-list-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Prevent page break right after declaration heading */
          .declaration-section p:first-of-type {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          /* Executive name line should stay with signatures */
          .executive-line {
            margin-top: 1.5cm;
            page-break-before: avoid !important;
            break-before: avoid !important;
          }

          /* Footer should stay together */
          .footer-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: 1cm;
          }
        `}</style>

        <div className="a4-page">
          <Header />

          {/* SALE BILL NO Badge */}
          <div className="flex justify-end mt-3">
            <div className="text-xs font-bold">
              SALE BILL NO: <span className="bg-blue-600 text-white px-4 py-1 rounded ml-2">
                {salesBill.billNumber || 'RML-XXXXX'}
              </span>
            </div>
          </div>

          {/* Declaration Text */}
          <div className="mt-5 text-center text-[14px] font-bold">
            DOCTOR MEMBERSHIP FORM
          </div>

          <div className="mt-4 text-justify leading-[1.45] avoid-break">
            As Per Schemes and services of Rapid Medicolegal Services India Ltd. I here voluntarily agree to become a member of Rapid for which I deposit Rs.{' '}
            <span className="underline-dotted-thick long-underline">
              {salesBill?.totalAmount?.toLocaleString('en-IN') || '________'}
            </span> for{' '}
            <span className="underline-dotted-thick">
              {calculateMembershipYears(salesBill?.billDate, salesBill?.dueDate) || '______'}
            </span> and I am quoting my details below.
          </div>

          <hr className="divider" />

          {/* Doctor 1 Details */}
          {doctorType !== 'hospital' && (
            <div className="avoid-break section-start">
              <div className="section-title">Doctor 1 Details</div>
              <div className="grid-compact">
                <div>Full Name: <span className="underline-dotted-thick"> {doctor.originalDoctor?.fullName || doctor.fullName}</span></div>
                <div>Speciality: <span className="underline-dotted-thick">{Array.isArray(doctor.originalDoctor?.specialization) ? doctor.originalDoctor.specialization.join(", ") : Array.isArray(doctor.specialization) ? doctor.specialization.join(", ") : doctor.specialization || '________________'}</span></div>
                <div>Qualification: <span className="underline-dotted-thick">{doctor.originalDoctor?.qualification || doctor.qualification}</span></div>
                <div>Medical Registration No.: <span className="underline-dotted-thick">{doctor.originalDoctor?.licenseNumber || doctor.licenseNumber}</span></div>
                <div>Regi. Year: <span className="underline-dotted-thick">{doctor.originalDoctor?.registrationYear || doctor.registrationYear}</span></div>
                <div>Date of Birth: <span className="underline-dotted-thick">{formatDate(doctor.originalDoctor?.dateOfBirth || doctor.dateOfBirth)}</span></div>
                <div>Mobile (Wa): <span className="underline-dotted-thick">{doctor.originalDoctor?.whatsappNumber || doctor.originalDoctor?.phoneNumber || doctor.whatsappNumber || doctor.phoneNumber || '________________'}</span></div>
                <div>Mobile: <span className="underline-dotted-thick">{doctor.originalDoctor?.phoneNumber || doctor.phoneNumber || '________________'}</span></div>
                <div>Email: <span className="underline-dotted-thick">{doctor.originalDoctor?.email || doctor.email || '________________'}</span></div>
                <div>Aadhar Number: <span className="underline-dotted-thick">{doctor.originalDoctor?.aadharNumber || doctor.aadharNumber || '________________'}</span></div>
                <div>Pan Number: <span className="underline-dotted-thick">{doctor.originalDoctor?.panNumber || doctor.panNumber || '________________'}</span></div>
                <div className="col-span-2">
                  Residential Address: <span className="underline-dotted-thick long-underline">{getFullAddress(doctor.originalDoctor?.contactDetails?.currentAddress || doctor.contactDetails?.currentAddress)}</span>
                </div>
                <div>Pin: <span className="underline-dotted-thick">{doctor.originalDoctor?.contactDetails?.currentAddress?.pinCode || doctor.contactDetails?.currentAddress?.pinCode || '________________'}</span></div>
              </div>
            </div>
          )}

          {/* Doctor 2 Details (Spouse) */}
          {isLinked && linkedDoctor && (
            <div className="avoid-break section-start">
              <div className="section-title">Doctor 2 (Spouse) Details</div>
              <div className="grid-compact">
                <div>Full Name: <span className="underline-dotted-thick">{linkedDoctor.fullName}</span></div>
                <div>Speciality: <span className="underline-dotted-thick">{Array.isArray(linkedDoctor.specialization) ? linkedDoctor.specialization.join(", ") : linkedDoctor.specialization || '________________'}</span></div>
                <div>Qualification: <span className="underline-dotted-thick">{linkedDoctor.qualification}</span></div>
                <div>Medical Registration No.: <span className="underline-dotted-thick">{linkedDoctor.licenseNumber}</span></div>
                <div>Regi. Year: <span className="underline-dotted-thick">{linkedDoctor.registrationYear}</span></div>
                <div>Date of Birth: <span className="underline-dotted-thick">{formatDate(linkedDoctor.dateOfBirth)}</span></div>
                <div>Mobile (Wa): <span className="underline-dotted-thick">{linkedDoctor.whatsappNumber || linkedDoctor.phoneNumber || '________________'}</span></div>
                <div>Mobile: <span className="underline-dotted-thick">{linkedDoctor.phoneNumber || '________________'}</span></div>
                <div>Email: <span className="underline-dotted-thick">{linkedDoctor.email || '________________'}</span></div>
                <div>Aadhar Number: <span className="underline-dotted-thick">{linkedDoctor.aadharNumber || '________________'}</span></div>
                <div>Pan Number: <span className="underline-dotted-thick">{linkedDoctor.panNumber || '________________'}</span></div>
                <div className="col-span-2">
                  Residential Address: <span className="underline-dotted-thick long-underline">{getFullAddress(linkedDoctor.contactDetails?.currentAddress)}</span>
                </div>
                <div>Pin: <span className="underline-dotted-thick">{linkedDoctor.contactDetails?.currentAddress?.pinCode || '________________'}</span></div>
              </div>
            </div>
          )}

          {/* Hospital / Clinic Details */}
          {(doctorType === 'hospital' || doctorType === 'hospital_individual') && (
            <div className="avoid-break section-start hospital-section">
              <div className="section-title">Hospital / Clinic Details</div>
              <div className="grid-compact">
                <div className="col-span-2">Hospital / Clinic Name: <span className="underline-dotted-thick long-underline">{doctor.hospitalName}</span></div>
                <div className="col-span-2 long-text-field">Hospital Address: <span className="underline-dotted-thick long-underline">{getFullAddress(doctor.hospitalAddress || doctor.originalDoctor?.hospitalAddress)}</span></div>
                <div>City: <span className="underline-dotted-thick">{(doctor.hospitalAddress || doctor.originalDoctor?.hospitalAddress)?.city || '________________'}</span></div>
                <div>District: <span className="underline-dotted-thick">{(doctor.hospitalAddress || doctor.originalDoctor?.hospitalAddress)?.district || '________________'}</span></div>
                <div>State: <span className="underline-dotted-thick">{(doctor.hospitalAddress || doctor.originalDoctor?.hospitalAddress)?.state || '________________'}</span></div>
                <div>Pin Code: <span className="underline-dotted-thick">{(doctor.hospitalAddress || doctor.originalDoctor?.hospitalAddress)?.pinCode || '________________'}</span></div>
              </div>
            </div>
          )}

          <hr className="divider" />

          {/* Membership Details */}
          <div className="avoid-break section-start">
            <div className="section-title">Membership Details</div>
            <div className="grid-compact">
              <div>Membership Type: <span className="underline-dotted-thick">{doctor.doctorType}</span></div>
              <div>Membership Start Date: <span className="underline-dotted-thick">{formatDate(salesBill.billDate)}</span></div>
              <div>Membership End Date: <span className="underline-dotted-thick">{formatDate(salesBill.dueDate)}</span></div>
              <div>Membership Period: <span className="underline-dotted-thick">{calculateMembershipYears(salesBill?.billDate, salesBill?.dueDate) || '________________'}</span></div>
            </div>
          </div>

          {/* Hospital Membership Extra Fields (only if hospital) */}
          {(doctorType === 'hospital') && (
            <div className="avoid-break section-start hospital-section">
              <div className="section-title">Hospital Membership Details</div>
              <div className="grid-compact">
                <div>Type of Hospital: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.hospitalType || '________________'}</span></div>
                <div>No. of Beds: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.beds || '________________'}</span></div>
                <div>Regi No Pan Number: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.hospitalPanNumber || '________________'}</span></div>
                <div>Year of Establishment: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.establishmentYear || '________________'}</span></div>
                <div>Hospital Contact: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.director?.contact || '________________'}</span></div>
                <div>WhatsApp No.: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.admin?.contact || '________________'}</span></div>
                <div>Email: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.director?.email || '________________'}</span></div>
                <div>Website: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.website || '________________'}</span></div>
                <div>Ownership Type: <span className="underline-dotted-thick">{doctor.originalDoctor?.hospitalDetails?.ownershipType || '________________'}</span></div>
                <div className="col-span-2 long-text-field">
                  Departments: <span className="underline-dotted-thick long-underline">
                    {doctor.originalDoctor?.hospitalDetails?.departments && Array.isArray(doctor.originalDoctor.hospitalDetails.departments) && doctor.originalDoctor.hospitalDetails.departments.length > 0
                      ? doctor.originalDoctor.hospitalDetails.departments.join(', ')
                      : '________________'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Authorized Person Details (only hospital) */}
          {(doctorType === 'hospital') && (
            <div className="section-start authorized-person-section">
              <div className="section-title">Authorized Person Details (Owner/Admin)</div>
              <div className="mt-2 text-[12px] leading-[1.45]">
                1. Medical Superintendent / Director :<br />
                Name: {doctor.originalDoctor?.hospitalDetails?.director?.name || '________________'} Designation: ________________ Contact No: {doctor.originalDoctor?.hospitalDetails?.director?.contact || '________________'} Email ID: {doctor.originalDoctor?.hospitalDetails?.director?.email || '________________'}<br /><br />
                2. Admin / Mgmt Officer Name {doctor.originalDoctor?.hospitalDetails?.admin?.name || '________________'} Contact No {doctor.originalDoctor?.hospitalDetails?.admin?.contact || '________________'} Email ID: {doctor.originalDoctor?.hospitalDetails?.admin?.email || '________________'}<br /><br />
                Department Available:<br />
                {doctor.originalDoctor?.hospitalDetails?.departments && Array.isArray(doctor.originalDoctor.hospitalDetails.departments) &&
                  doctor.originalDoctor.hospitalDetails.departments.map((dept, index) => (
                    <div key={index} className="dept-list-item">{index + 1}. {dept || '________________'}<br /></div>
                  ))}
                {(!doctor.originalDoctor?.hospitalDetails?.departments ||
                  !Array.isArray(doctor.originalDoctor.hospitalDetails.departments) ||
                  doctor.originalDoctor.hospitalDetails.departments.length === 0) &&
                  <>
                    1. ________________<br />
                    2. ________________<br />
                    3. ________________<br />
                  </>
                }
              </div>
            </div>
          )}

          <hr className="divider" />

          {/* Payment Details */}
          <div className="avoid-break section-start payment-section">
            <div className="section-title">Payment Details</div>
            <div className="grid-compact mt-2">
              {firstPayment ? (
                <>
                  <div>Payment Date: <span className="font-bold">{formatDate(firstPayment.paymentDate)}</span></div>
                  <div>Payment Mode: <span className="font-bold">{firstPayment.paymentMethod || '________________'}</span></div>
                  <div>Cheque No.: <span className="font-bold">{firstPayment.paymentMethod === 'cheque' ? (firstPayment.paymentId?.chequeNumber || firstPayment.referenceNumber) : '—'}</span></div>
                  <div>Drawn On (Bank): <span className="font-bold">{firstPayment.paymentMethod === 'cheque' ? (firstPayment.paymentId?.drawnOnBank || '________________') : '________________'}</span></div>
                  <div>Amount Paid: <span className="font-bold">₹{firstPayment.amount?.toLocaleString('en-IN') || '________________'}</span></div>
                </>
              ) : (
                <>
                  <div>Cheque Date: ________________</div>
                  <div>Cheque No.: ________________</div>
                  <div>Drawn On (Bank): ________________</div>
                  <div>Service Charges: ________________</div>
                  <div>GST: ________________</div>
                  <div>Indemnity Premium: ₹{indemnityPremium?.toLocaleString('en-IN') || '________________'}</div>
                  <div>Total Amount: <span className="font-bold">₹{salesBill.totalAmount?.toLocaleString('en-IN') || '________'}</span></div>
                </>
              )}
              <div>Service Charges: <span className="font-bold">₹{salesBill.subTotal?.toLocaleString('en-IN') || '________________'}</span></div>
              <div>GST: <span className="font-bold">₹{(salesBill.totalAmount - salesBill.subTotal)?.toLocaleString('en-IN') || '________________'}</span></div>
              <div>Indemnity Premium: <span className="font-bold">₹{indemnityPremium?.toLocaleString('en-IN') || '________________'}</span></div>
              <div>Total Amount: <span className="font-bold">₹{salesBill.totalAmount?.toLocaleString('en-IN') || '________'}</span></div>
              <div className="col-span-2 long-text-field">Note: {salesBill.notes || '________________'}</div>
            </div>
          </div>

          <hr className="divider" />

          {/* Declaration & Signatures */}
          <div className="avoid-break declaration-section mt-6 text-center">
            <p className="font-bold text-[14px] mb-3">Declaration</p>
            <p className="text-[12px] leading-[1.45] mb-6">
              I/We hereby declare that we have fully understood the policy coverage details, services, rules, and regulations of Rapid Medicolegal Services India Ltd.
            </p>

            <div className="signature-grid">
              {doctorType === 'hospital' ? (
                <div className="col-span-2">
                  <div className="sig-line"></div>
                  <div>Hospital Representative Signature</div>
                  <div className="text-[10px]">(Name & Designation)</div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="sig-line"></div>
                    <div>Doctor 1 Signature</div>
                    <div className="text-[10px]">(Name: {doctor.fullName})</div>
                  </div>
                  {isLinked && (
                    <div>
                      <div className="sig-line"></div>
                      <div>Doctor 2 Signature</div>
                      <div className="text-[10px]">(Name: {linkedDoctor?.fullName || '________________'})</div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-10 text-center">
              Name of Executive/Officer: <span className="underline-dotted long-underline">________________</span> (sales person name)
            </div>
          </div>

          {/* Company Footer */}
          <div className="mt-10 pt-4 border-t border-black text-center text-[10px]">
            <Footer />
          </div>
        </div>

        {/* Visual Page Break (screen only) */}
        <div className="page-break-dotted print:hidden" />
      </div>
    </>
  );
};

export default MembershipForm;