

// import React from 'react';

// import Logo from '../../../../assets/Salesbill/Logo.png';
// import stamp from '../../../../assets/Salesbill/stamp.png';
// import signature from '../../../../assets/Salesbill/signature.png';
// import bottom from '../../../../assets/Salesbill/bottom.png';




// const RenewalContractLetter = () => {
//   return (
//     <>
//       {/* Dashboard mein fit hone wala container */}
//       <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg relative font-serif text-black">

//         {/* HEADER — bilkul wahi jo tune pasand kiya tha */}
//         <div className="border-b-4 border-red-700 flex justify-between items-start mb-6 pb-2 print:fixed print:top-0 print:left-0 print:right-0 print:bg-white print:z-50 print:h-[95px] print:px-10 print:pt-4">
//           <img src={Logo} alt="Logo" className="h-16" />
//           <div className="text-right text-xs leading-tight">
//             <strong className="block text-lg text-red-700">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong>
//             www.rapidmedicolegal.in | rapidmedicolegal@gmail.com<br />
//             <span className="text-[9pt] text-gray-600">360° Medicolegal Protection | An ISO 9001:2015 Certified Company</span>
//           </div>
//         </div>

//         {/* MAIN CONTENT — bilkul original HTML wala (same to same) */}
//         <div className="mt-4 text-[13pt] leading-7">

//           <div className="text-right font-bold mb-6">
//             Date: <span className="bg-yellow-100 px-2 border border-dashed border-gray-600" contentEditable suppressContentEditableWarning>29 NOVEMBER 2025</span>
//           </div>

//           <div className="text-center text-2xl font-bold border-b border-gray-400 pb-2 mb-6">
//             Service Contract Renewal Letter
//           </div>

//           <div className="mb-6 leading-8 pl-1">
//             <strong>TO,</strong><br /><br />
//             <span className="bg-yellow-100 px-2 border border-dashed border-gray-600 inline-block" contentEditable suppressContentEditableWarning>DR PRAMOD SHINGARE, DR PRAVIN SHINGARE & DR APARNA SHINGARE</span><br />
//             <span className="bg-yellow-100 px-2 border border-dashed border-gray-600 inline-block" contentEditable suppressContentEditableWarning>SHINGARE SKIN & COSMETIC CLINIC,</span><br />
//             <span className="bg-yellow-100 px-2 border border-dashed border-gray-600 inline-block" contentEditable suppressContentEditableWarning>NEAR S. T. STAND, IN FRONT OF RAJARAM CHITRA MANDIR,</span><br />
//             <span className="bg-yellow-100 px-2 border border-dashed border-gray-600 inline-block" contentEditable suppressContentEditableWarning>ABOVE KALYANI BAZAR, SHOP NO. 6, PETH VADGAON PIN-416112</span>
//           </div>

//           <div className="text-center font-bold mb-6">Subject: – Service contract renewal letter</div>

//           <p className="text-justify indent-8 mb-6">
//             This letter is to remind you that our service contract is about to expire on <span className="bg-yellow-100 px-1" contentEditable suppressContentEditableWarning>01 AUGUST 2025</span>. Rapid Medicolegal Services India Ltd. has been serving you with top-notch Services for <strong>ONE</strong> year. Our services have been extended to all your Medico legal & Risk Management Services.
//           </p>
//           <p className="text-justify indent-8 mb-10">
//             You continue to our Medico legal & Risk Management Services renewing the contract.
//           </p>

//           <h3 className="border-l-4 border-red-700 pl-3 font-bold mb-4 text-[13pt]">MEMBERSHIP DETAILS :</h3>

//           <table className="w-full border-collapse border-2 border-black text-[11.5pt] mb-8">
//             <tbody>
//               <tr>
//                 <th className="bg-yellow-300 border border-black p-2 text-center font-bold">ID Number</th>
//                 <td className="border border-black p-2">RML-10593</td>
//                 <th className="bg-yellow-300 border border-black p-2 text-center font-bold">Insurance Co.</th>
//                 <td className="border border-black p-2">ICICI LOMBARD GIC LTD.</td>
//               </tr>
//               <tr>
//                 <td className="border border-black p-2 font-bold">Specialization</td>
//                 <td className="border border-black p-2">BAMS/MD(AYU) & BHMS, FCHD</td>
//                 <td className="border border-black p-2 font-bold">Insurance Type</td>
//                 <td className="border border-black p-2">PROFESSIONAL INDEMNITY</td>
//               </tr>
//               <tr>
//                 <td className="border border-black p-2 font-bold">Member Category</td>
//                 <td colSpan="3" className="border border-black p-2">INDIVIDUAL + HOSPITAL MEMBERSHIP (COVERAGE TO ALL OVER INDIA + ALL COVERAGE OF VISITING QUALIFIED/UNQUALIFIED STAFF)</td>
//               </tr>
//               <tr>
//                 <td className="border border-black p-2 font-bold">Membership Period</td>
//                 <td className="border border-black p-2">1 YEAR</td>
//                 <td className="border border-black p-2 font-bold">Indemnity Cover</td>
//                 <td className="border border-black p-2">50 LAKH FOR EACH DOCTOR</td>
//               </tr>
//               <tr>
//                 <td className="border border-black p-2 font-bold">Type of Service</td>
//                 <td className="border border-black p-2">SERVICE + INDEMNITY</td>
//                 <td className="border border-black p-2 font-bold">Service charge</td>
//                 <td className="border border-black p-2">10000/-</td>
//               </tr>
//             </tbody>
//           </table>

//           <h3 className="border-l-4 border-red-700 pl-3 font-bold mb-4 text-[13pt]">Your new charges as below:</h3>

//           <table className="w-full border-collapse border-2 border-black text-[11.5pt] mb-8">
//             <thead>
//               <tr>
//                 <th className="bg-yellow-300 border border-black p-3 text-center">PERTICULAR</th>
//                 <th className="bg-yellow-300 border border-black p-3 text-center">INDEMNITY COVER</th>
//                 <th className="bg-yellow-300 border border-black p-3 text-center">Monthly</th>
//                 <th className="bg-yellow-300 border border-black p-3 text-center">1 YEARS</th>
//                 <th className="bg-yellow-300 border border-black p-3 text-center">5 YEARS</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className="border border-black p-3">INDIVIDUAL-HOSPITAL MEMBERSHIP (COVERAGE TO ALL OVER INDIA + ALL COVERAGE OF VISITING QUALIFIED/UNQUALIFIED STAFF)</td>
//                 <td className="border border-black p-3 text-center">50 Lakh</td>
//                 <td className="border border-black p-3 text-center font-bold text-lg">999/-</td>
//                 <td className="border border-black p-3 text-center font-bold text-lg">10,000/-</td>
//                 <td className="border border-black p-3 text-center font-bold text-lg">50,000/-</td>
//               </tr>
//             </tbody>
//           </table>

//           <div className="bg-red-50 border-2 border-red-700 p-4 my-8 font-bold text-red-700 rounded shadow">
//             <strong>NOTE :</strong> We provide 50 Lakh doctor professional Indemnity for DR. PRAMOD SHINGARE,<br />
//             50 Lakh for DR PRAVIN SHINGARE and 50 Lakh for DR. APARNA SHINGARE.
//           </div>

//           <div className="text-left text-green-700 font-bold text-lg tracking-widest my-10">
//             STAY WITH US STAY SECURE
//           </div>

//           <p className="mb-6">You can pay on below bank details or using QR :</p>

//           <div className="flex gap-6 mb-10">
//             <div className="flex-1 bg-gray-100 p-5 font-mono text-sm border-2 border-dashed border-red-700 rounded">
//               <strong>BANK DETAILS :</strong><br />
//               NAME : RAPID MEDICOLLEGAL SERVICES<br />
//               BANK NAME – ICICI BANK<br />
//               BRANCH – RAJARAMPURI, KOLHAPUR<br />
//               A/C NO. – <span className="bg-yellow-100 px-1" contentEditable suppressContentEditableWarning>016605017904</span><br />
//               IFSC – <span className="bg-yellow-100 px-1" contentEditable suppressContentEditableWarning>ICIC0000166</span>
//             </div>
//             <div className="w-32 h-32 border-2 border-dashed border-black flex items-center justify-center text-center font-bold text-sm rounded bg-white">
//               QR Code<br />for Payment
//             </div>
//           </div>

//           <div className="text-red-700 font-bold mt-10">
//             Regards,<br />
//             <strong className="text-lg">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong><br />
//             24 x 7 ALL INDIA HELP LINE NO.<br />
//             +91-9422584275, +91-9421584275, +91-9405734275, +91-9665444275
//           </div>
//         </div>

//         {/* FOOTER — bilkul wahi jo tune pasand kiya tha */}
//         <div className="mt-10 border-t border-gray-400 flex justify-between items-start text-[8.5pt] leading-tight print:fixed print:bottom-0 print:left-0 print:right-0 print:bg-white print:z-50 print:h-[75px] print:px-10 print:pt-2">
//           <div className="w-[48%] border border-black p-2 bg-gray-100">
//             <strong>Head & Corporate Office:</strong><br />
//             (KOLHAPUR) E-51/9/2, 3rd Floor, Opp. CBS, Kolhapur, Maharashtra, India. 416001<br />
//             Contact: +91-9421464275 | Helpline No. +91-9422584275
//           </div>
//           <div className="w-[48%] border border-black p-2 bg-gray-100 text-right">
//             <div className="text-red-700 font-bold">Page 1 of 1</div>
//             <div className="mt-1">
//               <strong>Regional Office (MUMBAI):</strong> House No.158, Anaje Master Building, No.7,<br />
//               Kasasheb Gadgil Marg, Prabhadevi, Mumbai 400025.<br />
//               <strong>Other Branch:</strong> Goa, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu.
//             </div>
//           </div>
//         </div>

//         {/* Print Button */}
//         <div className="text-center mt-6 print:hidden">
//           <button onClick={() => window.print()} className="px-10 py-3 bg-red-700 hover:bg-red-800 text-white text-lg font-bold rounded">
//             Print / Save as PDF
//           </button>
//         </div>
//       </div>

//       {/* Print Styles */}
//       <style jsx global>{`
//         @media print {
//           @page { size: A4; margin: 0; }
//           body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//           .bg-yellow-100 { background-color: #ffffe0 !important; }
//           .bg-yellow-300 { background-color: #fef9c3 !important; }
//           .bg-red-50 { background-color: #fef2f2 !important; }
//           .border-red-700 { border-color: #c00 !important; }
//           .text-red-700 { color: #c00 !important; }
//           button { display: none !important; }
//         }
//         body { font-family: 'Times New Roman', Times, serif; }
//       `}</style>
//     </>
//   );
// };

// export default RenewalContractLetter;










// import React from 'react';

// import Logo from '../../../../assets/Salesbill/Logo.png';
// import stamp from '../../../../assets/Salesbill/stamp.png';
// import signature from '../../../../assets/Salesbill/signature.png';
// import bottom from '../../../../assets/Salesbill/bottom.png';




// const RenewalContractLetter = () => {
//   return (
//     <>
//       {/* Dashboard mein fit hone wala container */}
//       <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg relative font-serif text-black">

//         {/* HEADER — bilkul wahi jo tune pasand kiya tha */}
//         <div className="border-b-4 border-red-700 flex justify-between items-start mb-6 pb-2 print:fixed print:top-0 print:left-0 print:right-0 print:bg-white print:z-50 print:h-[95px] print:px-10 print:pt-4">
//           <img src={Logo} alt="Logo" className="h-16 " />
//           <div className="text-right text-xs leading-tight">
//             <strong className="block text-lg text-red-700">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong>
//             www.rapidmedicolegal.in | rapidmedicolegal@gmail.com<br />
//             <span className="text-[9pt] text-gray-600">360° Medicolegal Protection | An ISO 9001:2015 Certified Company</span>
//           </div>
//         </div>

//         {/* MAIN CONTENT — bilkul original HTML wala (same to same) */}
//         <div className="mt-4 text-[13pt] leading-7">

//           <div className="text-right font-bold mb-6">
//             Date: <span className="bg-yellow-100 px-2 border border-dashed border-gray-600" contentEditable suppressContentEditableWarning>29 NOVEMBER 2025</span>
//           </div>

//           <div className="text-center text-2xl font-bold border-b print:mt-[40px] print:pt-[40px]  border-gray-400 pb-2 mb-6">
//             Service Contract Renewal Letter
//           </div>

//           <div className="mb-6 leading-8 pl-1">
//             <strong className='print:mt-2'>TO,</strong><br /><br />
//             <span className="bg-yellow-100 px-2 border border-dashed border-gray-600 inline-block" contentEditable suppressContentEditableWarning>DR PRAMOD SHINGARE, DR PRAVIN SHINGARE & DR APARNA SHINGARE</span><br />
//             <span className="bg-yellow-100 px-2 border border-dashed border-gray-600 inline-block" contentEditable suppressContentEditableWarning>SHINGARE SKIN & COSMETIC CLINIC,</span><br />
//             <span className="bg-yellow-100 px-2 border border-dashed border-gray-600 inline-block" contentEditable suppressContentEditableWarning>NEAR S. T. STAND, IN FRONT OF RAJARAM CHITRA MANDIR,</span><br />
//             <span className="bg-yellow-100 px-2 border border-dashed border-gray-600 inline-block" contentEditable suppressContentEditableWarning>ABOVE KALYANI BAZAR, SHOP NO. 6, PETH VADGAON PIN-416112</span>
//           </div>

//           <div className="text-center font-bold mb-6 ">Subject: – Service contract renewal letter</div>

//           <p className="text-justify indent-8 mb-6">
//             This letter is to remind you that our service contract is about to expire on <span className="bg-yellow-100 px-1" contentEditable suppressContentEditableWarning>01 AUGUST 2025</span>. Rapid Medicolegal Services India Ltd. has been serving you with top-notch Services for <strong>ONE</strong> year. Our services have been extended to all your Medico legal & Risk Management Services.
//           </p>
//           <p className="text-justify indent-8 mb-10">
//             You continue to our Medico legal & Risk Management Services renewing the contract.
//           </p>

//           <h3 className="border-l-4 border-red-700 pl-3 font-bold mb-4 text-[13pt]  print:mt-4 ">MEMBERSHIP DETAILS :</h3>

//           <table className="w-full border-collapse border-2 border-black text-[11.5pt] mb-8 print:break-after-page ">
//             <tbody>
//               <tr>
//                 <th className="bg-yellow-300 border border-black p-2 text-center font-bold">ID Number</th>
//                 <td className="border border-black p-2">RML-10593</td>
//                 <th className="bg-yellow-300 border border-black p-2 text-center font-bold">Insurance Co.</th>
//                 <td className="border border-black p-2">ICICI LOMBARD GIC LTD.</td>
//               </tr>
//               <tr>
//                 <td className="border border-black p-2 font-bold">Specialization</td>
//                 <td className="border border-black p-2">BAMS/MD(AYU) & BHMS, FCHD</td>
//                 <td className="border border-black p-2 font-bold">Insurance Type</td>
//                 <td className="border border-black p-2">PROFESSIONAL INDEMNITY</td>
//               </tr>
//               <tr>
//                 <td className="border border-black p-2 font-bold">Member Category</td>
//                 <td colSpan="3" className="border border-black p-2">INDIVIDUAL + HOSPITAL MEMBERSHIP (COVERAGE TO ALL OVER INDIA + ALL COVERAGE OF VISITING QUALIFIED/UNQUALIFIED STAFF)</td>
//               </tr>
//               <tr>
//                 <td className="border border-black p-2 font-bold">Membership Period</td>
//                 <td className="border border-black p-2">1 YEAR</td>
//                 <td className="border border-black p-2 font-bold">Indemnity Cover</td>
//                 <td className="border border-black p-2">50 LAKH FOR EACH DOCTOR</td>
//               </tr>
//               <tr>
//                 <td className="border border-black p-2 font-bold">Type of Service</td>
//                 <td className="border border-black p-2">SERVICE + INDEMNITY</td>
//                 <td className="border border-black p-2 font-bold">Service charge</td>
//                 <td className="border border-black p-2">10000/-</td>
//               </tr>
//             </tbody>
//           </table>

//           <h3 className="border-l-4 border-red-700 pl-3 font-bold mb-4 text-[13pt] print:mt-[180px] ">Your new charges as below:</h3>

//           <table className="w-full border-collapse border-2 border-black text-[11.5pt] mb-8">
//             <thead>
//               <tr>
//                 <th className="bg-yellow-300 border border-black p-3 text-center">PERTICULAR</th>
//                 <th className="bg-yellow-300 border border-black p-3 text-center">INDEMNITY COVER</th>
//                 <th className="bg-yellow-300 border border-black p-3 text-center">Monthly</th>
//                 <th className="bg-yellow-300 border border-black p-3 text-center">1 YEARS</th>
//                 <th className="bg-yellow-300 border border-black p-3 text-center">5 YEARS</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className="border border-black p-3">INDIVIDUAL-HOSPITAL MEMBERSHIP (COVERAGE TO ALL OVER INDIA + ALL COVERAGE OF VISITING QUALIFIED/UNQUALIFIED STAFF)</td>
//                 <td className="border border-black p-3 text-center">50 Lakh</td>
//                 <td className="border border-black p-3 text-center font-bold text-lg">999/-</td>
//                 <td className="border border-black p-3 text-center font-bold text-lg">10,000/-</td>
//                 <td className="border border-black p-3 text-center font-bold text-lg">50,000/-</td>
//               </tr>
//             </tbody>
//           </table>

//           <div className="bg-red-50 border-2 border-red-700 p-4 my-8 font-bold text-red-700 rounded shadow">
//             <strong>NOTE :</strong> We provide 50 Lakh doctor professional Indemnity for DR. PRAMOD SHINGARE,<br />
//             50 Lakh for DR PRAVIN SHINGARE and 50 Lakh for DR. APARNA SHINGARE.
//           </div>

//           <div className="text-left text-green-700 font-bold text-lg tracking-widest my-10 print:mt-[50px]">
//             STAY WITH US STAY SECURE
//           </div>

//           <p className="mb-6">You can pay on below bank details or using QR :</p>

//           <div className="flex gap-6 mb-10">
//             <div className="flex-1 bg-gray-100 p-5 font-mono text-sm border-2 border-dashed border-red-700 rounded">
//               <strong>BANK DETAILS :</strong><br />
//               NAME : RAPID MEDICOLLEGAL SERVICES<br />
//               BANK NAME – ICICI BANK<br />
//               BRANCH – RAJARAMPURI, KOLHAPUR<br />
//               A/C NO. – <span className="bg-yellow-100 px-1" contentEditable suppressContentEditableWarning>016605017904</span><br />
//               IFSC – <span className="bg-yellow-100 px-1" contentEditable suppressContentEditableWarning>ICIC0000166</span>
//             </div>
//             <div className="w-32 h-32 border-2 border-dashed border-black flex items-center justify-center text-center font-bold text-sm rounded bg-white">
//               QR Code<br />for Payment
//             </div>
//           </div>

//           <div className="text-red-700 font-bold mt-10">
//             Regards,<br />
//             <strong className="text-lg">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong><br />
//             24 x 7 ALL INDIA HELP LINE NO.<br />
//             +91-9422584275, +91-9421584275, +91-9405734275, +91-9665444275
//           </div>
//         </div>

//         {/* FOOTER — bilkul wahi jo tune pasand kiya tha */}
//         <div className="mt-10 border-t border-gray-400 flex justify-between items-start text-[8.5pt] h-auto leading-tight  print:bg-white print:z-50 print:h-[75px] print:px-10 print:pt-2">
//           <div className="w-[48%] h-auto border border-black p-2 bg-gray-100">
//             <strong>Head & Corporate Office:</strong><br />
//             (KOLHAPUR) E-51/9/2, 3rd Floor, Opp. CBS, Kolhapur, Maharashtra, India. 416001<br />
//             Contact: +91-9421464275 | Helpline No. +91-9422584275
//           </div>
//           <div className="w-[48%] h-auto border border-black p-2 bg-gray-100 text-right">
//             <div className="text-red-700 font-bold">Page 1 of 1</div>
//             <div className="mt-1">
//               <strong>Regional Office (MUMBAI):</strong> House No.158, Anaje Master Building, No.7,<br />
//               Kasasheb Gadgil Marg, Prabhadevi, Mumbai 400025.<br />
//               <strong>Other Branch:</strong> Goa, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu.
//             </div>
//           </div>
//         </div>

//         {/* Print Button */}
//         <div className="text-center mt-6 print:hidden">
//           <button onClick={() => window.print()} className="px-10 py-3 bg-red-700 hover:bg-red-800 text-white text-lg font-bold rounded">
//             Print / Save as PDF
//           </button>
//         </div>
//       </div>

//       {/* Print Styles */}
//       <style jsx global>{`
//         @media print {
//           @page { size: A4; margin: 0; }
//           body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//           .bg-yellow-100 { background-color: #ffffe0 !important; }
//           .bg-yellow-300 { background-color: #fef9c3 !important; }
//           .bg-red-50 { background-color: #fef2f2 !important; }
//           .border-red-700 { border-color: #c00 !important; }
//           .text-red-700 { color: #c00 !important; }
//           button { display: none !important; }
//         }
//         body { font-family: 'Times New Roman', Times, serif; }
//       `}</style>
//     </>
//   );
// };

// export default RenewalContractLetter;




// import React from 'react';
// import HeaderImg from '../../../../assets/quotation/Header.png'
// import FooterImg from '../../../../assets/quotation/footer.png'
// import QrImg from '../../../../assets/quotation/paymentQr.png';
// import useServiceAgreementData from '../Invoices/serviceAgreement(SA)/hooks/useServiceAgreementDate' ;
// // All images as base64 or imported (since you want single file, we'll use placeholder comments)
// // In real project, import them. Here for single-file, we'll assume they are imported or use direct URLs if available.
// // For demo, we'll keep as imported paths (you can replace with actual imports)

// const RenewalContractLetter = () => {
//   // Dummy data - fully flexible, you can connect to API later
//   const data = {
//     date: "29 NOVEMBER 2025",
//     doctors: "DR PRAMOD SHINGARE, DR PRAVIN SHINGARE & DR APARNA SHINGARE",
//     clinicName: "SHINGARE SKIN & COSMETIC CLINIC,",
//     addressLine1: "NEAR S. T. STAND, IN FRONT OF RAJARAM CHITRA MANDIR,",
//     addressLine2: "ABOVE KALYANI BAZAR, SHOP NO. 6, PETH VADGAON PIN-416112",
//     expiryDate: "01 AUGUST 2025",
//     idNumber: "RML-10593",
//     insuranceCo: "ICICI LOMBARD GIC LTD.",
//     specialization: "BAMS/MD(AYU) & BHMS, FCHD, MD(AM) & BAMS(MUHS)",
//     insuranceType: "PROFESSIONAL INDEMNITY",
//     memberCategory: "INDIVIDUAL + HOSPITAL MEMBERSHIP (COVERAGE TO ALL OVER INDIA + ALL COVERAGE OF VISITING DOCTORS/QUALIFIED/UNQUALIFIED STAFF)",
//     membershipPeriod: "1 YEAR",
//     indemnityCover: "50 LAKH FOR EACH DOCTOR",
//     typeOfService: "SERVICE + INDEMNITY",
//     serviceCharge: "10000/-",
//     accountNo: "016605017904",
//     ifsc: "ICIC0000166",
//   };

//   return (
//     <>
//       <div className="max-w-4xl mx-auto bg-white shadow-lg font-serif text-black">

//         {/* Page 1 */}
//         <div className="relative min-h-screen">

//           {/* Header */}
//           <div className="border-b-4 border-orange-400 flex justify-between items-start pb-4 px-10 pt-6">
//             <div className="h-20 w-48 bg-gray-200 border-2 border-dashed rounded">
//               {/* <img src={Logo} alt="Logo" className="h-full w-full object-contain" /> */}
//               <div className="flex items-center justify-center h-full text-gray-500 text-xs">LOGO</div>
//             </div>
//             <div className="text-right text-xs leading-tight">
//               <strong className="block text-xl text-red-700">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong>
//               www.rapidmedicolegal.in | rapidmedicolegal@gmail.com<br />
//               <span className="text-xs text-gray-600">360° Medicolegal Protection | An ISO 9001:2015 Certified Company</span>
//             </div>
//           </div>

//           {/* Main Content - Page 1 */}
//           <div className="px-10 pt-8 text-sm leading-7">

//             <div className="text-right font-bold mb-6">
//               Date : {data.date}
//             </div>

//             <div className="text-center text-2xl font-bold border-b-2 border-gray-400 pb-4 mb-8">
//               Service Contract Renewal Letter
//             </div>

//             <div className="mb-8 leading-8">
//               <strong>TO,</strong><br /><br />
//               {data.doctors}<br />
//               {data.clinicName}<br />
//               {data.addressLine1}<br />
//               {data.addressLine2}
//             </div>

//             <div className="text-center font-bold mb-6">Subject : – Service contract renewal letter</div>

//             <p className="text-justify indent-8 mb-6">
//               This letter is to remind you that our service contract is about to expire on <strong>{data.expiryDate}</strong>.
//               Rapid Medicolegal Services India Ltd. has been serving you with top-notch Services for ONE year. Our services have been extended to all your Medico legal & Risk Management Services.
//             </p>

//             <p className="text-justify indent-8 mb-10">
//               You continue to our Medico legal & Risk Management Services renewing the contract.
//             </p>

//             <h3 className="border-l-4 border-red-700 pl-4 font-bold mb-4 text-lg">
//               MEMBERSHIP DETAILS :
//             </h3>

//             <table className="w-full border-2 border-black text-xs mb-10">
//               <tbody>
//                 <tr>
//                   <th className="bg-yellow-200 border border-black p-2 text-center font-bold">ID Number</th>
//                   <td className="border border-black p-2">{data.idNumber}</td>
//                   <th className="bg-yellow-200 border border-black p-2 text-center font-bold">Insurance Co.</th>
//                   <td className="border border-black p-2">{data.insuranceCo}</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-black p-2 font-bold">Specialization</td>
//                   <td className="border border-black p-2">{data.specialization}</td>
//                   <td className="border border-black p-2 font-bold">Insurance Type</td>
//                   <td className="border border-black p-2">{data.insuranceType}</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-black p-2 font-bold">Member Category</td>
//                   <td colSpan="3" className="border border-black p-2">{data.memberCategory}</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-black p-2 font-bold">Membership Period</td>
//                   <td className="border border-black p-2">{data.membershipPeriod}</td>
//                   <td className="border border-black p-2 font-bold">Indemnity Cover</td>
//                   <td className="border border-black p-2">{data.indemnityCover}</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-black p-2 font-bold">Type Of Service</td>
//                   <td className="border border-black p-2">{data.typeOfService}</td>
//                   <td className="border border-black p-2 font-bold">Amount to be paid indemnity charges</td>
//                   <td className="border border-black p-2">INCLUDING SERVICE CHARGES</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-black p-2 font-bold">Service charge</td>
//                   <td colSpan="3" className="border border-black p-2">{data.serviceCharge}</td>
//                 </tr>
//               </tbody>
//             </table>

//           </div>

//           {/* Footer */}
//           <div className="absolute bottom-0 left-0 right-0 border-t-2 border-gray-400 px-10 py-3 text-xs flex justify-between">
//             <div className="w-1/2 border border-gray-400 bg-gray-100 p-3">
//               <strong>Head & Corporate Office:</strong> House No.2787, 1st Floor, Journalist Colony, Opp. Bank of Maharashtra, A/P - Tarabai Park, Kolhapur, Maharashtra, India - 416003<br />
//               Contact: +91-9421464275 | Helpline No. +91-9422584275
//             </div>
//             <div className="w-1/2 border border-gray-400 bg-gray-100 p-3 text-right">
//               <div className="text-red-700 font-bold">Page 1 of 2</div>
//               <strong>Regional Office (MUMBAI):</strong> House No.7, Kasasheb Gadgil Marg, Prabhadevi, Mumbai 400025.<br />
//               <strong>Other Branch:</strong> Goa, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu.
//             </div>
//           </div>
//         </div>

//         {/* Page 2 */}
//         <div className="relative min-h-screen break-before-page">

//           {/* Header (repeat on page 2) */}
//           <div className="border-b-4 border-orange-400 flex justify-between items-start pb-4 px-10 pt-6">
//             <div className="h-20 w-48 bg-gray-200 border-2 border-dashed rounded">
//               <div className="flex items-center justify-center h-full text-gray-500 text-xs">LOGO</div>
//             </div>
//             <div className="text-right text-xs leading-tight">
//               <strong className="block text-xl text-red-700">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong>
//               www.rapidmedicolegal.in | rapidmedicolegal@gmail.com<br />
//               <span className="text-xs text-gray-600">360° Medicolegal Protection | An ISO 9001:2015 Certified Company</span>
//             </div>
//           </div>

//           <div className="px-10 pt-20 text-sm">

//             <h3 className="border-l-4 border-red-700 pl-4 font-bold mb-6 text-lg">
//               Your new charges as below:
//             </h3>

//             <table className="w-full border-2 border-black mb-10 text-sm">
//               <thead>
//                 <tr>
//                   <th className="bg-yellow-300 border border-black p-3">PERTICULAR</th>
//                   <th className="bg-yellow-300 border border-black p-3">INDEMNITY COVER</th>
//                   <th className="bg-yellow-300 border border-black p-3">Monthly</th>
//                   <th className="bg-yellow-300 border border-black p-3">1 YEARS</th>
//                   <th className="bg-yellow-300 border border-black p-3">5 YEARS</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="border border-black p-4 text-left">
//                     INDIVIDUAL+HOSPITAL MEMBERSHIP (COVERAGE TO ALL OVER INDIA + ALL COVERAGE OF VISITING DOCTORS/QUALIFIED/UNQUALIFIED STAFF)
//                   </td>
//                   <td className="border border-black p-4 text-center">50 Lakh</td>
//                   <td className="border border-black p-4 text-center font-bold text-lg">999/-</td>
//                   <td className="border border-black p-4 text-center font-bold text-lg">10,000/-</td>
//                   <td className="border border-black p-4 text-center font-bold text-lg">50,000/-</td>
//                 </tr>
//               </tbody>
//             </table>

//             <div className="bg-red-50 border-2 border-red-700 p-4 my-8 font-bold text-red-700 rounded">
//               <strong>NOTE :</strong> We provide 50 Lakh doctor professional Indemnity for DR. PRAMOD SHINGARE,<br />
//               50 Lakh FOR DR PRAVIN SHINGARE AND 50 Lakh FOR DR. APARNA SHINGARE.
//             </div>

//             <div className="text-green-700 font-bold text-xl tracking-widest my-10">
//               STAY WITH US STAY SECURE
//             </div>

//             <p className="mb-6">YOU CAN PAY ON BELOW BANK DETAILS OR USING QR :</p>

//             <div className="flex gap-10 mb-10 items-start">
//               <div className="flex-1 bg-gray-100 p-6 border-2 border-dashed border-red-700 rounded text-sm">
//                 <strong>BANK DETAILS :</strong><br />
//                 NAME : RAPID MEDICOLLEGAL SERVICES<br />
//                 BANK NAME – ICICI BANK<br />
//                 BRANCH – RAJARAMPURI, KOLHAPUR<br />
//                 A/C NO. – {data.accountNo}<br />
//                 IFSC – {data.ifsc}
//               </div>
//               <div className="w-40 h-40 bg-white border-4 border-dashed border-black flex items-center justify-center text-center text-sm font-bold rounded">
//                 QR Code<br />for Payment
//               </div>
//             </div>

//             <div className="text-red-700 font-bold mt-12">
//               Regards,<br />
//               <strong className="text-xl">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong><br />
//               24 x 7 ALL INDIA HELP LINE NO.<br />
//               +91-9422584275, +91-9421584275, +91-9405734275, +91-9665444275
//             </div>

//           </div>

//           {/* Footer Page 2 */}
//           <div className="absolute bottom-0 left-0 right-0 border-t-2 border-gray-400 px-10 py-3 text-xs flex justify-between">
//             <div className="w-1/2 border border-gray-400 bg-gray-100 p-3">
//               <strong>Head & Corporate Office:</strong> House No.2787, 1st Floor, Journalist Colony, Opp. Bank of Maharashtra, A/P - Tarabai Park, Kolhapur, Maharashtra, India - 416003<br />
//               Contact: +91-9421464275 | Helpline No. +91-9422584275
//             </div>
//             <div className="w-1/2 border border-gray-400 bg-gray-100 p-3 text-right">
//               <div className="text-red-700 font-bold">Page 2 of 2</div>
//               <strong>Regional Office (MUMBAI):</strong> House No.7, Kasasheb Gadgil Marg, Prabhadevi, Mumbai 400025.<br />
//               <strong>Other Branch:</strong> Goa, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu.
//             </div>
//           </div>
//         </div>

//         {/* Print Button */}
//         <div className="text-center my-10 print:hidden">
//           <button onClick={() => window.print()} className="px-12 py-4 bg-red-700 hover:bg-red-800 text-white text-lg font-bold rounded">
//             Print / Save as PDF
//           </button>
//         </div>

//       </div>

//       {/* Print Styles */}
//       <style jsx global>{`
//         @media print {
//           @page { size: A4; margin: 10mm; }
//           body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//           .break-before-page { break-before: page; }
//           .bg-yellow-200, .bg-yellow-300 { background-color: #fef9c3 !important; }
//           .bg-red-50 { background-color: #fef2f2 !important; }
//           .border-red-700 { border-color: #b91c1c !important; }
//           .text-red-700 { color: #b91c1c !important; }
//           .text-green-700 { color: #166534 !important; }
//           button { display: none !important; }
//         }
//         body { font-family: 'Times New Roman', Times, serif; }
//       `}</style>
//     </>
//   );
// };

// export default RenewalContractLetter;





// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../../services/apiClient";
// import HeaderImg from '../../../../assets/quotation/Header.png';
// import FooterImg from '../../../../assets/quotation/footer.png';
// import QrImg from '../../../../assets/quotation/paymentQr.png';

// const RenewalContractLetter = () => {
//   const { id } = useParams();
//   const printTriggered = useRef(false);

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) {
//         setError("Invalid bill ID");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);

//         // 1. Fetch Sales Bill
//         const billRes = await apiClient.get(apiEndpoints.salesBills.get(id));
//         const bill = billRes.data.data;

//         if (!bill.client) {
//           throw new Error("Client information not found in bill");
//         }

//         // Extract primary doctor ID from bill
//         let primaryDoctorId = bill.client?.entityId?._id || bill.client?.entityId || bill.client?._id;
//         if (!primaryDoctorId) {
//           throw new Error("Doctor ID not found in bill");
//         }

//         console.log("Primary Doctor ID from bill:", primaryDoctorId);

//         // 2. Fetch primary doctor full details
//         let primaryDoctor = {};
//         try {
//           const docRes = await apiClient.get(apiEndpoints.doctors.get(primaryDoctorId));
//           primaryDoctor = docRes.data.data || {};
//         } catch (err) {
//           console.warn("Could not fetch primary doctor details, using embedded data");
//           primaryDoctor = bill.client.entityId || {};
//         }

//         // 3. Check for spouse and collect all relevant doctor IDs
//         const doctorIdsToSearch = [primaryDoctorId];

//         if (primaryDoctor.linkedDoctorId && primaryDoctor.relationshipType === 'spouse') {
//           const spouseId = primaryDoctor.linkedDoctorId.toString();
//           if (!doctorIdsToSearch.includes(spouseId)) {
//             doctorIdsToSearch.push(spouseId);
//           }
//           console.log("Spouse detected, searching quotations for both IDs:", doctorIdsToSearch);
//         }

//         // 4. Find the latest quotation among primary + spouse
//         let quotation = null;
//         let latestDate = null;

//         for (const docId of doctorIdsToSearch) {
//           try {
//             const quoRes = await apiClient.get(apiEndpoints.quotations.getLatestForDoctor(docId));
//             if (quoRes.data.success && quoRes.data.data) {
//               const thisQuotation = quoRes.data.data;
//               const thisDate = new Date(thisQuotation.createdAt);

//               if (!quotation || thisDate > latestDate) {
//                 quotation = thisQuotation;
//                 latestDate = thisDate;
//               }
//             }
//           } catch (e) {
//             // Silent fail — just skip this ID
//             console.log(`No quotation found for doctor ID: ${docId}`);
//           }
//         }

//         // 5. Extract pricing data from quotation (only last row)
//         let priceRows = [];
//         let selectedYears = [1, 5]; // fallback
//         let showMonthly = false;

//         if (quotation) {
//           const items = quotation.requestDetails?.items || [];
//           const terms = quotation.requestDetails?.policyTerms || [];

//           showMonthly = quotation.requestDetails?.paymentFrequency === 'monthly';
//           selectedYears = terms.length > 0 ? [...new Set(terms)].sort((a, b) => a - b) : [1, 5];

//           // Take only the last item
//           if (items.length > 0) {
//             const lastItem = items[items.length - 1];
//             priceRows = [{
//               indemnity: lastItem.indemnity || "Custom Limit",
//               monthly: lastItem.monthly ? `₹${Number(lastItem.monthly).toLocaleString('en-IN')}/-` : "-",
//               ...selectedYears.reduce((acc, y) => {
//                 const yearKey = `year_${y}`;
//                 const value = lastItem[yearKey];
//                 acc[`y${y}`] = value ? `₹${Number(value).toLocaleString('en-IN')}/-` : "-";
//                 return acc;
//               }, {})
//             }];
//           }
//         }

//         // Fallback pricing if no quotation found
//         if (priceRows.length === 0) {
//           priceRows = [{
//             indemnity: "₹50,00,000",
//             monthly: "999/-",
//             y1: "10,000/-",
//             y5: "50,000/-"
//           }];
//           selectedYears = [1, 5];
//           showMonthly = true;
//         }

//         // 6. Get spouse name if exists (for display)
//         let spouseName = "";
//         if (primaryDoctor.linkedDoctorId && primaryDoctor.relationshipType === 'spouse') {
//           try {
//             const spouseRes = await apiClient.get(apiEndpoints.doctors.get(primaryDoctor.linkedDoctorId));
//             spouseName = spouseRes.data.data?.fullName || "Spouse";
//           } catch (err) {
//             spouseName = "Spouse";
//           }
//         }

//         // Combined doctor name
//         const doctorsName = spouseName
//           ? `${primaryDoctor.fullName || "Dr."} & ${spouseName}`
//           : primaryDoctor.fullName || bill.client?.name || "DOCTOR NAME NOT FOUND";

//         const formatted = {
//           currentDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),

//           doctorsName,
//           clinicName: primaryDoctor.hospitalName ? `${primaryDoctor.hospitalName},` : "CLINIC NAME NOT AVAILABLE,",
//           addressLine1: primaryDoctor.hospitalAddress?.address || "ADDRESS LINE 1 NOT AVAILABLE,",
//           addressLine2: [
//             primaryDoctor.hospitalAddress?.city,
//             primaryDoctor.hospitalAddress?.state,
//             primaryDoctor.hospitalAddress?.district,
//             primaryDoctor.hospitalAddress?.taluka,
//             primaryDoctor.hospitalAddress?.pinCode ? `PIN-${primaryDoctor.hospitalAddress.pinCode}` : ""
//           ].filter(Boolean).join(', ') || "ADDRESS LINE 2 NOT AVAILABLE",

//           expiryDate: bill.dueDate
//             ? new Date(bill.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
//             : "EXPIRY DATE NOT AVAILABLE",

//           idNumber: primaryDoctor.membershipId || "RML-XXXXX",
//           insuranceCo: "ICICI LOMBARD GIC LTD.",
//           specialization: Array.isArray(primaryDoctor.specialization)
//             ? primaryDoctor.specialization.join(', ')
//             : primaryDoctor.specialization || "SPECIALIZATION NOT AVAILABLE",

//           membershipType: primaryDoctor.membershipType || "INDIVIDUAL MEMBERSHIP (COVERAGE TO ALL OVER INDIA + ALL COVERAGE OF VISITING DOCTORS/QUALIFIED/UNQUALIFIED STAFF)",

//           indemnityCover: priceRows[0]?.indemnity || "₹50,00,000",
//           serviceCharge: bill.totalAmount ? `${bill.totalAmount.toLocaleString('en-IN')}/-` : "10,000/-",

//           // Dynamic pricing
//           priceRows,
//           selectedYears,
//           showMonthly
//         };

//         setData(formatted);

//       } catch (err) {
//         console.error("Error loading renewal data:", err);
//         setError("Failed to load renewal data. Using sample template.");

//         // Strong fallback
//         setData({
//           currentDate: "31 DECEMBER 2025",
//           doctorsName: "DR. RAHUL & MISS RAHUL",
//           clinicName: "SKIN CLINIC,",
//           addressLine1: "SAMPLE ADDRESS LINE 1",
//           addressLine2: "KOLHAPUR, MAHARASHTRA, PIN-416001",
//           expiryDate: "31 DECEMBER 2025",
//           idNumber: "RML-12345",
//           insuranceCo: "ICICI LOMBARD GIC LTD.",
//           specialization: "Skin Specialist",
//           membershipType: "INDIVIDUAL MEMBERSHIP",
//           indemnityCover: "₹25,00,000",
//           serviceCharge: "10,000/-",
//           priceRows: [
//             { indemnity: "₹25,00,000", monthly: "-", y1: "₹899/-", y2: "₹1,800/-", y3: "₹2,700/-", y4: "₹3,600/-" }
//           ],
//           selectedYears: [1, 2, 3, 4],
//           showMonthly: false
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   // Auto print
//   useEffect(() => {
//     if (loading || !data || printTriggered.current) return;
//     if (window.location.search.includes("printed=true")) return;

//     printTriggered.current = true;
//     const timer = setTimeout(() => {
//       window.print();
//       window.history.replaceState({}, "", `${window.location.pathname}?printed=true`);
//     }, 1200);
//     return () => clearTimeout(timer);
//   }, [data, loading]);

//   if (loading) {
//     return <div className="flex items-center justify-center h-screen text-xl">Loading Renewal Letter...</div>;
//   }

//   if (error && !data) {
//     return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;
//   }

//   return (
//     <>
//       <div className="flex flex-col items-center bg-gray-100 min-h-screen py-8 print:bg-white print:py-0 print:m-0 md:max-w-7xl mx-auto overflow-x-auto">

//         {/* Page 1 */}
//         <div className="bg-white shadow-2xl print:shadow-none w-[210mm] min-h-[297mm] mx-auto my-4">
//           <img src={HeaderImg} alt="Header" className="w-full" />
//           <div className="px-12 pt-6 pb-10 text-sm leading-7 font-serif">
//             <div className="text-right font-bold mb-4">Date : {data.currentDate}</div>

//             <h1 className="text-center text-2xl font-bold border-b-2 border-gray-400 pb-4 mb-8">
//               Service Contract Renewal Letter
//             </h1>

//             <div className="mb-4">
//               <strong>TO,</strong><br />
//               <div className="leading-8">
//                 {data.doctorsName}<br />
//                 {data.clinicName}<br />
//                 {data.addressLine1}<br />
//                 {data.addressLine2}
//               </div>
//             </div>

//             <div className="text-center text-lg font-bold mb-4">
//               Subject : – Service contract renewal letter
//             </div>

//             <p className="text-justify indent-8 mb-6">
//               This letter is to remind you that our service contract is about to expire on <strong className="text-red-600">{data.expiryDate}</strong>.
//               Rapid Medicolegal Services India Ltd. has been serving you with top-notch Services for ONE year. Our services have been extended to all your Medico legal & Risk Management Services.
//             </p>

//             <p className="text-center indent-8 mb-4">
//               You continue to our Medico legal & Risk Management Services renewing the contract.
//             </p>

//             <h3 className="border-l-4 border-red-700 pl-4 font-bold mb-4 text-lg">
//               MEMBERSHIP DETAILS :
//             </h3>

//             <table className="w-full border-2 border-black text-xs mb-4">
//               <tbody>
//                 <tr>
//                   <th className="border border-black p-2 text-center font-bold">ID Number</th>
//                   <td className="border border-black p-2">{data.idNumber}</td>
//                   <th className="border border-black p-2 text-center font-bold">Insurance Co.</th>
//                   <td className="border border-black p-2">{data.insuranceCo}</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-black p-2 font-bold">Specialization</td>
//                   <td className="border border-black p-2">{data.specialization}</td>
//                   <td className="border border-black p-2 font-bold">Insurance Type</td>
//                   <td className="border border-black p-2">PROFESSIONAL INDEMNITY</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-black p-2 font-bold">Member Category</td>
//                   <td className="border border-black p-2">{data.membershipType}</td>
//                   <td className="border border-black p-2 font-bold">Indemnity Cover</td>
//                   <td className="border border-black p-2">{data.indemnityCover} FOR EACH DOCTOR</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-black p-2 font-bold">Membership Period</td>
//                   <td className="border border-black p-2">1 YEAR</td>
//                   <td className="border border-black p-2 font-bold">Amount to be paid (Including Service Charges)</td>
//                   <td className="border border-black p-2">{data.indemnityCover}</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-black p-2 font-bold">Type Of Service</td>
//                   <td className="border border-black p-2">SERVICE + INDEMNITY</td>
//                   <td className="border border-black p-2 font-bold">Service charge</td>
//                   <td className="border border-black p-2 uppercase">Including Service Charge</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//           <img src={FooterImg} alt="Footer" className="w-full" />
//         </div>

//         {/* Page 2 - New Charges Table */}
//         <div className="bg-white shadow-2xl mt-8 print:mt-0 print:shadow-none w-[210mm] min-h-[297mm] mx-auto my-4">
//           <img src={HeaderImg} alt="Header" className="w-full" />
//           <div className="px-12 pt-6 pb-10 text-sm leading-7 font-serif">

//             <h3 className="border-l-4 border-red-700 pl-4 font-bold mb-6 text-lg">
//               Your new charges as below:
//             </h3>

//             <table className="w-full border-2 border-black text-sm mb-10">
//               <thead>
//                 <tr>
//                   <th className="bg-yellow-300 border border-black p-3">PARTICULAR</th>
//                   <th className="bg-yellow-300 border border-black p-3">INDEMNITY COVER</th>
//                   {data.showMonthly && <th className="bg-yellow-300 border border-black p-3">Monthly</th>}
//                   {data.selectedYears.map(y => (
//                     <th key={y} className="bg-yellow-300 border border-black p-3">
//                       {y} YEAR{y > 1 ? 'S' : ''}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.priceRows.map((row, i) => (
//                   <tr key={i}>
//                     <td className="border border-black p-4 text-left align-top">
//                       {data.membershipType}
//                     </td>
//                     <td className="border border-black p-4 text-center font-bold text-lg">{row.indemnity}</td>
//                     {data.showMonthly && (
//                       <td className="border border-black p-4 text-center font-bold text-lg">{row.monthly}</td>
//                     )}
//                     {data.selectedYears.map(y => (
//                       <td key={y} className="border border-black p-4 text-center font-bold text-lg">
//                         {row[`y${y}`]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="bg-red-50 border-2 border-red-700 p-4 my-8 font-bold text-red-700 rounded">
//               <strong>NOTE :</strong> We provide {data.indemnityCover} professional indemnity for each doctor as per policy.
//             </div>

//             <div className="text-green-700 font-bold text-xl tracking-widest my-12">
//               STAY WITH US STAY SECURE
//             </div>

//             <p className="mb-6 text-base">YOU CAN PAY ON BELOW BANK DETAILS OR USING QR :</p>

//             <div className="flex gap-12 mb-12 items-center">
//               <div className="flex-1 bg-gray-100 p-6 rounded text-sm font-medium">
//                 <strong>BANK DETAILS :</strong><br />
//                 NAME : RAPID MEDICOLLEGAL SERVICES<br />
//                 BANK NAME – ICICI BANK<br />
//                 BRANCH – RAJARAMPURI, KOLHAPUR<br />
//                 A/C NO. – 016605017904<br />
//                 IFSC – ICIC0000166
//               </div>
//               <div className="w-48 h-48 bg-white rounded overflow-hidden shadow-lg">
//                 <img src={QrImg} alt="Payment QR" className="w-full h-full object-cover" />
//               </div>
//             </div>

//             <div className="text-red-500 font-bold mt-16 text-base">
//               Regards,<br />
//               <strong className="mt-6">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong><br />
//               24 x 7 ALL INDIA HELP LINE NO.<br />
//               +91-9422584275, +91-9421584275, +91-9405734275, +91-9665444275
//             </div>
//           </div>
//           <img src={FooterImg} alt="Footer" className="w-full" />
//         </div>
//       </div>

//       {/* Print Button - Screen Only */}
//       <div className="text-center my-10 print:hidden">
//         <button
//           onClick={() => window.print()}
//           className="px-12 py-4 bg-red-700 hover:bg-red-800 text-white text-lg font-bold rounded shadow-lg"
//         >
//           Print / Save as PDF
//         </button>
//       </div>

//       <style jsx global>{`
//         @media print {
//           @page { size: A4; margin: 0; }
//           body, html { margin: 0; padding: 0; background: white !important; }
//           .bg-yellow-300 { background-color: #fef9c3 !important; -webkit-print-color-adjust: exact; }
//           .bg-red-50 { background-color: #fef2f2 !important; -webkit-print-color-adjust: exact; }
//           .border-red-700 { border-color: #c00 !important; }
//           .text-red-700 { color: #c00 !important; }
//           .text-green-700 { color: #166534 !important; }
//         }
//         @media screen and (max-width: 768px) {
//           .w-[210mm] {
//             width: 100% !important;
//             min-width: 100% !important;
//           }
//           .px-12 {
//             padding-left: 1rem;
//             padding-right: 1rem;
//           }
//           table {
//             font-size: 0.75rem;
//           }
//           th, td {
//             padding: 0.5rem !important;
//           }
//         }
//         body { font-family: 'Times New Roman', Times, serif; }
//       `}</style>
//     </>
//   );
// };

// export default RenewalContractLetter;






// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../../services/apiClient";
// import HeaderImg from '../../../../assets/quotation/Header.png';
// import FooterImg from '../../../../assets/quotation/footer.png';
// import QrImg from '../../../../assets/quotation/paymentQr.png';

// const RenewalContractLetter = () => {
//   const { id } = useParams();
//   const printTriggered = useRef(false);

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) {
//         setError("Invalid bill ID");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);

//         const billRes = await apiClient.get(apiEndpoints.salesBills.get(id));
//         const bill = billRes.data.data;

//         if (!bill.client) throw new Error("Client information not found in bill");

//         let primaryDoctorId = bill.client?.entityId?._id || bill.client?.entityId || bill.client?._id;
//         if (!primaryDoctorId) throw new Error("Doctor ID not found in bill");

//         let primaryDoctor = {};
//         try {
//           const docRes = await apiClient.get(apiEndpoints.doctors.get(primaryDoctorId));
//           primaryDoctor = docRes.data.data || {};
//         } catch (err) {
//           console.warn("Could not fetch primary doctor details");
//           primaryDoctor = bill.client.entityId || {};
//         }

//         const doctorIdsToSearch = [primaryDoctorId];
//         if (primaryDoctor.linkedDoctorId && primaryDoctor.relationshipType === 'spouse') {
//           const spouseId = primaryDoctor.linkedDoctorId.toString();
//           if (!doctorIdsToSearch.includes(spouseId)) doctorIdsToSearch.push(spouseId);
//         }

//         let quotation = null;
//         let latestDate = null;

//         for (const docId of doctorIdsToSearch) {
//           try {
//             const quoRes = await apiClient.get(apiEndpoints.quotations.getLatestForDoctor(docId));
//             if (quoRes.data.success && quoRes.data.data) {
//               const thisQuotation = quoRes.data.data;
//               const thisDate = new Date(thisQuotation.createdAt);
//               if (!quotation || thisDate > latestDate) {
//                 quotation = thisQuotation;
//                 latestDate = thisDate;
//               }
//             }
//           } catch (e) {
//             console.log(`No quotation found for doctor ID: ${docId}`);
//           }
//         }

//         let priceRows = [];
//         let selectedYears = [1, 5];
//         let showMonthly = false;

//         if (quotation) {
//           const items = quotation.requestDetails?.items || [];
//           const terms = quotation.requestDetails?.policyTerms || [];

//           showMonthly = quotation.requestDetails?.paymentFrequency === 'monthly';
//           selectedYears = terms.length > 0 ? [...new Set(terms)].sort((a, b) => a - b) : [1, 5];

//           if (items.length > 0) {
//             const lastItem = items[items.length - 1];
//             priceRows = [{
//               indemnity: lastItem.indemnity || "Custom Limit",
//               monthly: lastItem.monthly ? `₹${Number(lastItem.monthly).toLocaleString('en-IN')}/-` : "-",
//               ...selectedYears.reduce((acc, y) => {
//                 const yearKey = `year_${y}`;
//                 const value = lastItem[yearKey];
//                 acc[`y${y}`] = value ? `₹${Number(value).toLocaleString('en-IN')}/-` : "-";
//                 return acc;
//               }, {})
//             }];
//           }
//         }

//         if (priceRows.length === 0) {
//           priceRows = [{
//             indemnity: "₹50,00,000",
//             monthly: "999/-",
//             y1: "10,000/-",
//             y5: "50,000/-"
//           }];
//           selectedYears = [1, 5];
//           showMonthly = true;
//         }

//         let spouseName = "";
//         if (primaryDoctor.linkedDoctorId && primaryDoctor.relationshipType === 'spouse') {
//           try {
//             const spouseRes = await apiClient.get(apiEndpoints.doctors.get(primaryDoctor.linkedDoctorId));
//             spouseName = spouseRes.data.data?.fullName || "Spouse";
//           } catch (err) {
//             spouseName = "Spouse";
//           }
//         }

//         const doctorsName = spouseName
//           ? `${primaryDoctor.fullName || "Dr."} & ${spouseName}`
//           : primaryDoctor.fullName || bill.client?.name || "DOCTOR NAME NOT FOUND";

//         const formatted = {
//           currentDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),
//           doctorsName,
//           clinicName: primaryDoctor.hospitalName ? `${primaryDoctor.hospitalName},` : "CLINIC NAME NOT AVAILABLE,",
//           addressLine1: primaryDoctor.hospitalAddress?.address || "ADDRESS LINE 1 NOT AVAILABLE,",
//           addressLine2: [
//             primaryDoctor.hospitalAddress?.city,
//             primaryDoctor.hospitalAddress?.state,
//             primaryDoctor.hospitalAddress?.district,
//             primaryDoctor.hospitalAddress?.taluka,
//             primaryDoctor.hospitalAddress?.pinCode ? `PIN-${primaryDoctor.hospitalAddress.pinCode}` : ""
//           ].filter(Boolean).join(', ') || "ADDRESS LINE 2 NOT AVAILABLE",
//           expiryDate: bill.dueDate
//             ? new Date(bill.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
//             : "EXPIRY DATE NOT AVAILABLE",
//           idNumber: primaryDoctor.membershipId || "RML-XXXXX",
//           insuranceCo: "ICICI LOMBARD GIC LTD.",
//           specialization: Array.isArray(primaryDoctor.specialization)
//             ? primaryDoctor.specialization.join(', ')
//             : primaryDoctor.specialization || "SPECIALIZATION NOT AVAILABLE",
//           membershipType: primaryDoctor.membershipType || "INDIVIDUAL MEMBERSHIP (COVERAGE TO ALL OVER INDIA + ALL COVERAGE OF VISITING DOCTORS/QUALIFIED/UNQUALIFIED STAFF)",
//           indemnityCover: priceRows[0]?.indemnity || "₹50,00,000",
//           serviceCharge: bill.totalAmount ? `${bill.totalAmount.toLocaleString('en-IN')}/-` : "10,000/-",
//           priceRows,
//           selectedYears,
//           showMonthly
//         };

//         setData(formatted);

//       } catch (err) {
//         console.error("Error:", err);
//         setError("Failed to load renewal data.");

//         setData({
//           currentDate: "31 DECEMBER 2025",
//           doctorsName: "DR. RAHUL & MISS RAHUL",
//           clinicName: "SKIN CLINIC,",
//           addressLine1: "SAMPLE ADDRESS LINE 1",
//           addressLine2: "KOLHAPUR, MAHARASHTRA, PIN-416001",
//           expiryDate: "31 DECEMBER 2025",
//           idNumber: "RML-12345",
//           insuranceCo: "ICICI LOMBARD GIC LTD.",
//           specialization: "Skin Specialist",
//           membershipType: "INDIVIDUAL MEMBERSHIP",
//           indemnityCover: "₹25,00,000",
//           serviceCharge: "10,000/-",
//           priceRows: [{ indemnity: "₹25,00,000", monthly: "-", y1: "₹899/-", y2: "₹1,800/-", y3: "₹2,700/-", y4: "₹3,600/-" }],
//           selectedYears: [1, 2, 3, 4],
//           showMonthly: false
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   useEffect(() => {
//     if (loading || !data || printTriggered.current) return;
//     if (window.location.search.includes("printed=true")) return;

//     printTriggered.current = true;
//     const timer = setTimeout(() => {
//       window.print();
//       window.history.replaceState({}, "", `${window.location.pathname}?printed=true`);
//     }, 1200);
//     return () => clearTimeout(timer);
//   }, [data, loading]);

//   if (loading) return <div className="flex items-center justify-center h-screen text-xl">Loading Renewal Letter...</div>;
//   if (error && !data) return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;

//   return (
//     <>
//       {/* Outer container with horizontal scroll ONLY on screen */}
//       <div className="overflow-x-auto bg-gray-100 min-h-screen py-8 print:overflow-visible print:bg-white print:py-0">
//         <div className="min-w-[210mm] mx-auto">

//           {/* Page 1 */}
//           <div className="bg-white shadow-2xl print:shadow-none w-[210mm] min-h-[297mm] mx-auto my-8 print:my-0">
//             <img src={HeaderImg} alt="Header" className="w-full" />
//             <div className="px-12 pt-6 pb-10 text-sm leading-7 font-serif">
//               <div className="text-right font-bold mb-4">Date : {data.currentDate}</div>
//               <h1 className="text-center text-2xl font-bold border-b-2 border-gray-400 pb-4 mb-8">
//                 Service Contract Renewal Letter
//               </h1>
//               <div className="mb-4">
//                 <strong>TO,</strong><br />
//                 <div className="leading-8">
//                   {data.doctorsName}<br />
//                   {data.clinicName}<br />
//                   {data.addressLine1}<br />
//                   {data.addressLine2}
//                 </div>
//               </div>
//               <div className="text-center text-lg font-bold mb-4">
//                 Subject : – Service contract renewal letter
//               </div>
//               <p className="text-justify indent-8 mb-6">
//                 This letter is to remind you that our service contract is about to expire on <strong className="text-red-600">{data.expiryDate}</strong>.
//                 Rapid Medicolegal Services India Ltd. has been serving you with top-notch Services for ONE year. Our services have been extended to all your Medico legal & Risk Management Services.
//               </p>
//               <p className="text-center indent-8 mb-4">
//                 You continue to our Medico legal & Risk Management Services renewing the contract.
//               </p>
//               <h3 className="border-l-4 border-red-700 pl-4 font-bold mb-4 text-lg">
//                 MEMBERSHIP DETAILS :
//               </h3>
//               <table className="w-full border-2 border-black text-xs mb-4">
//                 <tbody>
//                   <tr>
//                     <th className="border border-black p-2 text-center font-bold">ID Number</th>
//                     <td className="border border-black p-2">{data.idNumber}</td>
//                     <th className="border border-black p-2 text-center font-bold">Insurance Co.</th>
//                     <td className="border border-black p-2">{data.insuranceCo}</td>
//                   </tr>
//                   <tr>
//                     <td className="border border-black p-2 font-bold">Specialization</td>
//                     <td className="border border-black p-2">{data.specialization}</td>
//                     <td className="border border-black p-2 font-bold">Insurance Type</td>
//                     <td className="border border-black p-2">PROFESSIONAL INDEMNITY</td>
//                   </tr>
//                   <tr>
//                     <td className="border border-black p-2 font-bold">Member Category</td>
//                     <td className="border border-black p-2">{data.membershipType}</td>
//                     <td className="border border-black p-2 font-bold">Indemnity Cover</td>
//                     <td className="border border-black p-2">{data.indemnityCover} FOR EACH DOCTOR</td>
//                   </tr>
//                   <tr>
//                     <td className="border border-black p-2 font-bold">Membership Period</td>
//                     <td className="border border-black p-2">1 YEAR</td>
//                     <td className="border border-black p-2 font-bold">Amount to be paid (Including Service Charges)</td>
//                     <td className="border border-black p-2">{data.indemnityCover}</td>
//                   </tr>
//                   <tr>
//                     <td className="border border-black p-2 font-bold">Type Of Service</td>
//                     <td className="border border-black p-2">SERVICE + INDEMNITY</td>
//                     <td className="border border-black p-2 font-bold">Service charge</td>
//                     <td className="border border-black p-2 uppercase">Including Service Charge</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//             <img src={FooterImg} alt="Footer" className="w-full" />
//           </div>

//           {/* Page 2 */}
//           <div className="bg-white shadow-2xl print:shadow-none w-[210mm] min-h-[297mm] mx-auto my-8 print:my-0">
//             <img src={HeaderImg} alt="Header" className="w-full" />
//             <div className="px-12 pt-6 pb-10 text-sm leading-7 font-serif">
//               <h3 className="border-l-4 border-red-700 pl-4 font-bold mb-6 text-lg">
//                 Your new charges as below:
//               </h3>

//               <div className="overflow-x-auto print:overflow-visible">
//                 <table className="w-full min-w-[600px] border-2 border-black text-sm mb-10">
//                   <thead>
//                     <tr>
//                       <th className="bg-yellow-300 border border-black p-3">PARTICULAR</th>
//                       <th className="bg-yellow-300 border border-black p-3">INDEMNITY COVER</th>
//                       {data.showMonthly && <th className="bg-yellow-300 border border-black p-3">Monthly</th>}
//                       {data.selectedYears.map(y => (
//                         <th key={y} className="bg-yellow-300 border border-black p-3">
//                           {y} YEAR{y > 1 ? 'S' : ''}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data.priceRows.map((row, i) => (
//                       <tr key={i}>
//                         <td className="border border-black p-4 text-left align-top">
//                           {data.membershipType}
//                         </td>
//                         <td className="border border-black p-4 text-center font-bold text-lg">{row.indemnity}</td>
//                         {data.showMonthly && (
//                           <td className="border border-black p-4 text-center font-bold text-lg">{row.monthly}</td>
//                         )}
//                         {data.selectedYears.map(y => (
//                           <td key={y} className="border border-black p-4 text-center font-bold text-lg">
//                             {row[`y${y}`]}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="bg-red-50 border-2 border-red-700 p-4 my-8 font-bold text-red-700 rounded">
//                 <strong>NOTE :</strong> We provide {data.indemnityCover} professional indemnity for each doctor as per policy.
//               </div>

//               <div className="text-green-700 font-bold text-xl tracking-widest my-12">
//                 STAY WITH US STAY SECURE
//               </div>

//               <p className="mb-6 text-base">YOU CAN PAY ON BELOW BANK DETAILS OR USING QR :</p>

//               <div className="flex gap-12 mb-12 items-center">
//                 <div className="flex-1 bg-gray-100 p-6 rounded text-sm font-medium">
//                   <strong>BANK DETAILS :</strong><br />
//                   NAME : RAPID MEDICOLLEGAL SERVICES<br />
//                   BANK NAME – ICICI BANK<br />
//                   BRANCH – RAJARAMPURI, KOLHAPUR<br />
//                   A/C NO. – 016605017904<br />
//                   IFSC – ICIC0000166
//                 </div>
//                 <div className="w-48 h-48 bg-white rounded overflow-hidden shadow-lg">
//                   <img src={QrImg} alt="Payment QR" className="w-full h-full object-cover" />
//                 </div>
//               </div>

//               <div className="text-red-500 font-bold mt-16 text-base">
//                 Regards,<br />
//                 <strong className="mt-6">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong><br />
//                 24 x 7 ALL INDIA HELP LINE NO.<br />
//                 +91-9422584275, +91-9421584275, +91-9405734275, +91-9665444275
//               </div>
//             </div>
//             <img src={FooterImg} alt="Footer" className="w-full" />
//           </div>
//         </div>
//       </div>

//       <div className="text-center my-10 print:hidden">
//         <button onClick={() => window.print()} className="px-12 py-4 bg-red-700 hover:bg-red-800 text-white text-lg font-bold rounded shadow-lg">
//           Print / Save as PDF
//         </button>
//       </div>

//       <style jsx global>{`
//         @media print {
//           @page { size: A4; margin: 0; }
//           body, html { margin: 0; padding: 0; background: white !important; }
//           .bg-yellow-300 { background-color: #fef9c3 !important; -webkit-print-color-adjust: exact; }
//           .bg-red-50 { background-color: #fef2f2 !important; -webkit-print-color-adjust: exact; }
//           .border-red-700 { border-color: #c00 !important; }
//           .text-red-700 { color: #c00 !important; }
//           .text-green-700 { color: #166534 !important; }
//         }
//         body { font-family: 'Times New Roman', Times, serif; }
//       `}</style>
//     </>
//   );
// };

// export default RenewalContractLetter;








import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../../services/apiClient";
import HeaderImg from '../../../../assets/quotation/Header.png';
import FooterImg from '../../../../assets/quotation/footer.png';
import QrImg from '../../../../assets/quotation/PaymentQr.png';

const RenewalContractLetter = () => {
  const { id } = useParams();
  const printTriggered = useRef(false);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Invalid bill ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Fetch Sales Bill (this is the CURRENT renewal bill)
        const billRes = await apiClient.get(apiEndpoints.salesBills.get(id));
        const bill = billRes.data.data;

        if (!bill.client) throw new Error("Client information not found in bill");

        let primaryDoctorId = bill.client?.entityId?._id || bill.client?.entityId || bill.client?._id;
        if (!primaryDoctorId) throw new Error("Doctor ID not found in bill");

        // 2. Fetch primary doctor details
        let primaryDoctor = {};
        try {
          const docRes = await apiClient.get(apiEndpoints.doctors.get(primaryDoctorId));
          primaryDoctor = docRes.data.data || {};
        } catch (err) {
          console.warn("Could not fetch primary doctor details");
          primaryDoctor = bill.client.entityId || {};
        }

        // 3. Spouse handling for quotation search
        const doctorIdsToSearch = [primaryDoctorId];
        if (primaryDoctor.linkedDoctorId && primaryDoctor.relationshipType === 'spouse') {
          const spouseId = primaryDoctor.linkedDoctorId.toString();
          if (!doctorIdsToSearch.includes(spouseId)) doctorIdsToSearch.push(spouseId);
        }

        // 4. Fetch latest quotation (for Page 2 - future charges)
        let quotation = null;
        let latestDate = null;

        for (const docId of doctorIdsToSearch) {
          try {
            const quoRes = await apiClient.get(apiEndpoints.quotations.getLatestForDoctor(docId));
            if (quoRes.data.success && quoRes.data.data) {
              const thisQuotation = quoRes.data.data;
              const thisDate = new Date(thisQuotation.createdAt);
              if (!quotation || thisDate > latestDate) {
                quotation = thisQuotation;
                latestDate = thisDate;
              }
            }
          } catch (e) {
            console.log(`No quotation found for doctor ID: ${docId}`);
          }
        }

        // 5. Extract NEW charges from quotation (Page 2 only)
        let newPriceRows = [];
        let newSelectedYears = [1, 5];
        let newShowMonthly = false;
        let newIndemnityCover = "₹50,00,000"; // fallback

        if (quotation) {
          const items = quotation.requestDetails?.items || [];
          const terms = quotation.requestDetails?.policyTerms || [];

          newShowMonthly = quotation.requestDetails?.paymentFrequency === 'monthly';
          newSelectedYears = terms.length > 0 ? [...new Set(terms)].sort((a, b) => a - b) : [1, 5];

          if (items.length > 0) {
            const lastItem = items[items.length - 1]; // Only last row
            newIndemnityCover = lastItem.indemnity || "₹50,00,000";

            newPriceRows = [{
              indemnity: lastItem.indemnity || "Custom Limit",
              monthly: lastItem.monthly ? `₹${Number(lastItem.monthly).toLocaleString('en-IN')}/-` : "-",
              ...newSelectedYears.reduce((acc, y) => {
                const yearKey = `year_${y}`;
                const value = lastItem[yearKey];
                acc[`y${y}`] = value ? `₹${Number(value).toLocaleString('en-IN')}/-` : "-";
                return acc;
              }, {})
            }];
          }
        }

        // Fallback for new charges
        if (newPriceRows.length === 0) {
          newPriceRows = [{
            indemnity: "₹50,00,000",
            monthly: "999/-",
            y1: "10,000/-",
            y5: "50,000/-"
          }];
          newSelectedYears = [1, 5];
          newShowMonthly = true;
          newIndemnityCover = "₹50,00,000";
        }

        // 6. Spouse name for display
        let spouseName = "";
        if (primaryDoctor.linkedDoctorId && primaryDoctor.relationshipType === 'spouse') {
          try {
            const spouseRes = await apiClient.get(apiEndpoints.doctors.get(primaryDoctor.linkedDoctorId));
            spouseName = spouseRes.data.data?.fullName || "Spouse";
          } catch (err) {
            spouseName = "Spouse";
          }
        }

        const doctorsName = spouseName
          ? `${primaryDoctor.fullName || "Dr."} & ${spouseName}`
          : primaryDoctor.fullName || bill.client?.name || "DOCTOR NAME NOT FOUND";

        // 7. Calculate membership period (dynamic)
        const calculateMembershipPeriod = (billDate, dueDate) => {
          if (!billDate || !dueDate) return '1 YEAR';
          try {
            const start = new Date(billDate);
            const end = new Date(dueDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) return '1 YEAR';

            const diffInMs = end.getTime() - start.getTime();
            const msInYear = 1000 * 60 * 60 * 24 * 365.25;
            const years = diffInMs / msInYear;
            const roundedYears = Math.round(years);

            if (roundedYears === 0) {
              const months = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
              return months > 0 ? `${months} Month${months > 1 ? 's' : ''}` : '1 YEAR';
            }
            return `${roundedYears} Year${roundedYears > 1 ? 's' : ''}`;
          } catch (error) {
            console.error('Error calculating membership period:', error);
            return '1 YEAR';
          }
        };

        const membershipPeriod = calculateMembershipPeriod(bill.billDate, bill.dueDate);
        const currentIndemnity = primaryDoctor.currentIndemnity || "₹50,00,000";

        // 8. Get the most recent sales bill number from the doctor's salesBills array for ID Number
        let oldBillNumber = "RML-XXXXX";
        if (primaryDoctor.salesBills && primaryDoctor.salesBills.length > 0) {
          // Sort by billDate to get the most recent one
          const sortedBills = primaryDoctor.salesBills.sort((a, b) => new Date(b.billDate || b.createdAt) - new Date(a.billDate || a.createdAt));
          oldBillNumber = sortedBills[0].billNumber || sortedBills[0].number || sortedBills[0].billNumber || "RML-XXXXX";
        }

        // 9. Fetch service charge from old sales bill
        let serviceChargeAmount = 0;
        if (bill.renewalFrom) {
          try {
            const oldBillRes = await apiClient.get(apiEndpoints.salesBills.getByNumber(bill.renewalFrom));
            if (oldBillRes.data.success && oldBillRes.data.data && oldBillRes.data.data.items && oldBillRes.data.data.items.length > 0) {
              serviceChargeAmount = oldBillRes.data.data.items[0].amount || 0;
            }
          } catch (err) {
            console.warn("Could not fetch old bill items for service charge");
            serviceChargeAmount = bill.items && bill.items.length > 0 ? bill.items[0].amount || 0 : 0;
          }
        }

        // 10. Fetch particular text from latest quotation - specifically from additionalRequirements field
        let particularText = "WE PROVIDE 50 LAKH INDEMNITY ";
        if (quotation && quotation.requestDetails && quotation.requestDetails.additionalRequirements) {
          particularText = quotation.requestDetails.additionalRequirements;
        }

        // 11. Fetch special conditions from latest quotation for note section
        let specialConditions = "Indemnity Cover Required";
        if (quotation && quotation.requestDetails && quotation.requestDetails.additionalRequirements) {
          specialConditions = quotation.requestDetails.additionalRequirements;
        }

        const formatted = {
          currentDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),

          doctorsName: doctorsName,
          clinicName: primaryDoctor.hospitalName ? `${primaryDoctor.hospitalName},` : "CLINIC NAME NOT AVAILABLE,",
          
          // Address logic: if no address, show nothing
          addressLine1: primaryDoctor.hospitalAddress?.address || "",
          addressLine2: [
            primaryDoctor.hospitalAddress?.city,
            primaryDoctor.hospitalAddress?.state,
            primaryDoctor.hospitalAddress?.district,
            primaryDoctor.hospitalAddress?.taluka,
            primaryDoctor.hospitalAddress?.pinCode ? `PIN-${primaryDoctor.hospitalAddress.pinCode}` : ""
          ].filter(Boolean).join(', ') || "",

          expiryDate: bill.dueDate
            ? new Date(bill.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
            : "EXPIRY DATE NOT AVAILABLE",

          // ID Number from the most recent sales bill in the doctor's salesBills array
          idNumber: oldBillNumber,
          insuranceCo: "ICICI LOMBARD GIC LTD.",
          specialization: Array.isArray(primaryDoctor.specialization)
            ? primaryDoctor.specialization.join(', ')
            : primaryDoctor.specialization || "SPECIALIZATION NOT AVAILABLE",

          membershipType: primaryDoctor.membershipType || "INDIVIDUAL MEMBERSHIP (COVERAGE TO ALL OVER INDIA + ALL COVERAGE OF VISITING DOCTORS/QUALIFIED/UNQUALIFIED STAFF)",

          // PAGE 1: Current membership indemnity (with spouse logic)
          currentIndemnityCover: primaryDoctor.linkedDoctorId && primaryDoctor.relationshipType === 'spouse' 
            ? `${currentIndemnity} FOR EACH DOCTOR` 
            : `${currentIndemnity} /`,

          // PAGE 2: New charges from quotation
          newIndemnityCover: newIndemnityCover,
          newPriceRows: newPriceRows,
          newSelectedYears: newSelectedYears,
          newShowMonthly: newShowMonthly,

          membershipPeriod: membershipPeriod,
          // Service charge from old sales bill items
          serviceCharge: serviceChargeAmount ? `₹${serviceChargeAmount.toLocaleString('en-IN')}/-` : "₹0/-",
          
          // Particular text for Page 2 table
          particularText: particularText,
          
          // Special conditions for note section
          specialConditions: specialConditions,
        };

        setData(formatted);

      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load data.");

        setData({
          currentDate: "31 DECEMBER 2025",
          doctorsName: "DR. RAHUL & MISS RAHUL",
          clinicName: "SKIN CLINIC,",
          addressLine1: "", // Empty if not available
          addressLine2: "", // Empty if not available
          expiryDate: "31 DECEMBER 2025",
          idNumber: "RML-12345", // From old sales bill
          insuranceCo: "ICICI LOMBARD GIC LTD.",
          specialization: "Skin Specialist",
          membershipType: "INDIVIDUAL MEMBERSHIP",
          currentIndemnityCover: "₹25,00,000 /", // With spouse logic
          newIndemnityCover: "₹25,00,000",    // New (from quotation)
          newPriceRows: [{ indemnity: "₹25,00,000", monthly: "-", y1: "₹899/-", y2: "₹1,800/-", y3: "₹2,700/-", y4: "₹3,600/-" }],
          newSelectedYears: [1, 2, 3, 4],
          newShowMonthly: false,
          serviceCharge: "₹1000/-", // From old sales bill items
          particularText: "WE PROVIDE 50 LAKH INDEMNITY ", // From latest quotation
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Auto print
  useEffect(() => {
    if (loading || !data || printTriggered.current) return;
    if (window.location.search.includes("printed=true")) return;

    printTriggered.current = true;
    const timer = setTimeout(() => {
      window.print();
      window.history.replaceState({}, "", `${window.location.pathname}?printed=true`);
    }, 1200);
    return () => clearTimeout(timer);
  }, [data, loading]);

  if (loading) return <div className="flex items-center justify-center h-screen text-xl">Loading Renewal Letter...</div>;
  if (error && !data) return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;

  return (
    <>
      <div className="overflow-x-auto bg-gray-100 min-h-screen py-8 print:overflow-visible print:bg-white print:py-0">
        <div className="min-w-[210mm] mx-auto">

          {/* Page 1 - CURRENT Membership */}
          <div className="bg-white shadow-2xl print:shadow-none w-[210mm] min-h-[297mm] mx-auto my-8 print:my-0">
            <img src={HeaderImg} alt="Header" className="w-full" />
            <div className="px-12 pt-6 pb-10 text-sm leading-7 font-serif">
              <div className="text-right font-bold mb-4">Date : {data.currentDate}</div>
              <h1 className="text-center text-2xl font-bold border-b-2 border-gray-400 pb-4 mb-8">
                Service Contract Renewal Letter
              </h1>
              <div className="mb-4">
                <strong>TO,</strong><br />
                <div className="leading-8">
                  {data.doctorsName}<br />
                  {data.clinicName}<br />
                  {/* Only show address if it exists */}
                  {data.addressLine1 && <>{data.addressLine1}<br /></>}
                  {data.addressLine2 && <>{data.addressLine2}</>}
                </div>
              </div>
              <div className="text-center text-lg font-bold mb-4">
                Subject : – Service contract renewal letter
              </div>
              <p className="text-justify indent-8 mb-6">
                This letter is to remind you that our service contract is about to expire on <strong className="text-red-600">{data.expiryDate}</strong>.
                Rapid Medicolegal Services India Ltd. has been serving you with top-notch Services for <strong className="text-red-600">{data.membershipPeriod.toUpperCase()}</strong>. Our services have been extended to all your Medico legal & Risk Management Services.
              </p>
              <p className="text-center indent-8 mb-4">
                You continue to our Medico legal & Risk Management Services renewing the contract.
              </p>
              <h3 className="border-l-4 border-red-700 pl-4 font-bold mb-4 text-lg">
                MEMBERSHIP DETAILS :
              </h3>
              <table className="w-full border-2 border-black text-xs mb-4">
                <tbody>
                  <tr>
                    {/* Highlight key in light gray with bold font */}
                    <th className="border border-black p-2 text-center font-bold bg-gray-100 text-black ">ID Number</th>
                    <td className="border border-black p-2">{data.idNumber}</td>
                    <th className="border border-black p-2 text-center font-bold bg-gray-100 text-black">Insurance Co.</th>
                    <td className="border border-black p-2">{data.insuranceCo}</td>
                  </tr>
                  <tr>  
                    <td className="border border-black p-2 font-bold bg-gray-100 text-black">Specialization</td>
                    <td className="border border-black p-2">{data.specialization}</td>
                    <td className="border border-black p-2 font-bold bg-gray-100 text-black">Insurance Type</td>
                    <td className="border border-black p-2">PROFESSIONAL INDEMNITY</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-100 text-black">Member Category</td>
                    <td className="border border-black p-2">{data.membershipType}</td>
                    <td className="border border-black p-2 font-bold bg-gray-100 text-black">Indemnity Cover</td>
                    <td className="border border-black p-2">{data.currentIndemnityCover}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-100 text-black">Membership Period</td>
                    <td className="border border-black p-2 uppercase">{data.membershipPeriod}</td>
                    <td className="border border-black p-2 font-bold bg-gray-100 text-black">Amount to be paid (Including Service Charges)</td>
                    <td className="border border-black p-2">{data.currentIndemnityCover}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-gray-100 text-black">Type Of Service</td>
                    <td className="border border-black p-2">SERVICE + INDEMNITY</td>
                    <td className="border border-black p-2 font-bold bg-gray-100 text-black">Service charge</td>
                    <td className="border border-black p-2 uppercase">{data.serviceCharge}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <img src={FooterImg} alt="Footer" className="w-full h-[28mm] mt-4" />
          </div>

          {/* Page 2 - NEW / FUTURE Charges */}
          <div className="bg-white shadow-2xl print:shadow-none w-[210mm] min-h-[297mm] mx-auto my-8 print:my-0">
            <img src={HeaderImg} alt="Header" className="w-full" />
            <div className="px-12 pt-6 pb-10 text-sm leading-7 font-serif">
              <h3 className="border-l-4 border-red-700 pl-4 font-bold mb-6 text-lg">
                Your new charges as below:
              </h3>

              <div className="overflow-x-auto print:overflow-visible">
                <table className="w-full min-w-[600px] border-2 border-black text-sm mb-10">
                  <thead>
                    <tr>
                      <th className="bg-yellow-300 border border-black p-3">PARTICULAR</th>
                      <th className="bg-yellow-300 border border-black p-3">INDEMNITY COVER</th>
                      {data.newShowMonthly && <th className="bg-yellow-300 border border-black p-3">MONTHLY</th>}
                      {data.newSelectedYears.map(y => (
                        <th key={y} className="bg-yellow-300 border border-black p-3">
                          {y} YEAR{y > 1 ? 'S' : ''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.newPriceRows.map((row, i) => (
                      <tr key={i}>
                        <td className="border border-black p-4 text-left align-top">
                          {data.membershipType}
                        </td>
                        <td className="border border-black p-4 text-center font-bold text-lg">{row.indemnity}</td>
                        {data.newShowMonthly && (
                          <td className="border border-black p-4 text-center font-bold text-lg">{row.monthly}</td>
                        )}
                        {data.newSelectedYears.map(y => (
                          <td key={y} className="border border-black p-4 text-center font-bold text-lg">
                            {row[`y${y}`]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-red-50 border-2 border-red-700 p-4 my-8 font-bold text-red-700 rounded">
                <strong>NOTE :</strong> {data.specialConditions}
              </div>

              <div className="text-green-700 font-bold text-xl tracking-widest my-12">
                STAY WITH US STAY SECURE
              </div>

              <p className="mb-6 text-base">YOU CAN PAY ON BELOW BANK DETAILS OR USING QR :</p>

              <div className="flex gap-12 mb-12 items-center">
                <div className="flex-1 bg-gray-100 p-6 rounded text-sm font-medium">
                  <strong>BANK DETAILS :</strong><br />
                  NAME : RAPID MEDICOLLEGAL SERVICES<br />
                  BANK NAME – ICICI BANK<br />
                  BRANCH – RAJARAMPURI, KOLHAPUR<br />
                  A/C NO. – 016605017904<br />
                  IFSC – ICIC0000166
                </div>
                <div className="w-48 h-48 bg-white rounded overflow-hidden shadow-lg">
                  <img src={QrImg} alt="Payment QR" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="text-red-500 font-bold mt-16 text-base">
                Regards,<br />
                <strong className="mt-6">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong><br />
                24 x 7 ALL INDIA HELP LINE NO.<br />
                +91-9422584275, +91-9421584275, +91-9405734275, +91-9665444275
              </div>
            </div>
            <img src={FooterImg} alt="Footer" className="w-full h-[28mm] print:h-[30mm] mt-4" />
          </div>
        </div>
      </div>

      <div className="text-center my-10 print:hidden">
        <button onClick={() => window.print()} className="px-12 py-4 bg-red-700 hover:bg-red-800 text-white text-lg font-bold rounded shadow-lg">
          Print / Save as PDF
        </button>
      </div>

      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 0; }
          body, html { margin: 0; padding: 0; background: white !important; }
          .bg-yellow-300 { background-color: #fef9c3 !important; -webkit-print-color-adjust: exact; }
          .bg-red-50 { background-color: #fef2f2 !important; -webkit-print-color-adjust: exact; }
          .border-red-700 { border-color: #c00 !important; }
          .text-red-700 { color: #c00 !important; }
          .text-green-700 { color: #166534 !important; }
        }
        body { font-family: 'Times New Roman', Times, serif; }
      `}</style>
    </>
  );
};

export default RenewalContractLetter;