
// import React from "react";
// import paymentQr from "../../../assets/quotation/PaymentQr.png";

// const BankDetailsQR = ({ data }) => {
//   const { doctor_name = "Dr. John Doe" } = data || {};

//   return (
//     <div className="p-6 max-w-5xl mx-auto">

//       <h3 className="text-black font-bold text-lg mb-4">
//         YOU CAN PAY ON BELOW BANK DETAILS :
//       </h3>

//       <div className="flex  md:items-center md:flex-row gap-8 items-start">

//         {/* LEFT : BANK DETAILS */}
//         <div className="flex-1 border border-gray-200 p-6 rounded-lg">
//           <h3 className="text-red-600 font-bold text-lg mb-4">
//             BANK DETAILS :
//           </h3>

//           <div className="space-y-3 text-sm">
//             <div className="flex">
//               <span className="font-semibold w-40">NAME :</span>
//               <span>RAPID MEDICOLEGAL SERVICES</span>
//             </div>
//             <div className="flex">
//               <span className="font-semibold w-40">BANK NAME :</span>
//               <span>ICICI BANK</span>
//             </div>
//             <div className="flex">
//               <span className="font-semibold w-40">BRANCH :</span>
//               <span>RAJARAMPURI, KOLHAPUR</span>
//             </div>
//             <div className="flex">
//               <span className="font-semibold w-40">A/C NO. :</span>
//               <span>016605010794</span>
//             </div>
//             <div className="flex">
//               <span className="font-semibold w-40">IFSC :</span>
//               <span>ICIC0000166</span>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT : QR IMAGE (ONLY IMAGE LOGIC + LEFT BORDER) */}
//         <div className="flex  items-center pl-1 border-l-4 border-gray-500">
//           <img
//             src={paymentQr}
//             alt="Payment QR Code"
//             className="w-45 h-45  object-contain"
//           />
//         </div>

//       </div>

//       {/* REGARDS */}
//       <div className="mt-8 text-green-700 mb-4">
//         <p className="font-semibold text-lg text-black">Regards,</p>
//         <p className="font-bold">
//           RAPID MEDICOLEGAL SERVICES INDIA LTD.
//         </p>

//         <div className="mt-3 text-sm">
//           <p className="font-semibold">24 x 7 ALL INDIA HELP LINE NO.</p>
//           <p className="font-bold text-green-700">
//             +91-9422584275, +91-9421584275, +91-9405734275, +91-9665444275
//           </p>
//         </div>
//       </div>

//       {/* <p className="text-xs text-gray-600 mt-6 text-center">
//         Please mention "Membership - {doctor_name}" in payment remarks.
//       </p> */}

//     </div>
//   );
// };

// export default BankDetailsQR;




// import React from "react";
// import paymentQr from "../../../assets/quotation/PaymentQr.png";

// const BankDetailsQR = ({ data }) => {
//   const { doctor_name = "Dr. John Doe" } = data || {};

//   return (
//     <div className="p-4 print:p-0 max-w-5xl mx-auto page-break-inside-avoid">
//       <h3 className="text-black font-bold text-lg print:text-[12pt] mb-3 print:mb-2">
//         YOU CAN PAY ON BELOW BANK DETAILS :
//       </h3>

//       <div className="flex flex-col md:flex-row md:items-center gap-6 print:gap-4 items-start">
//         {/* LEFT : BANK DETAILS */}
//         <div className="flex-1 border border-gray-300 p-4 print:p-3 rounded-lg print:border-gray-400">
//           <h3 className="text-red-600 font-bold text-lg print:text-[12pt] mb-3 print:mb-2">
//             BANK DETAILS :
//           </h3>

//           <div className="space-y-2 print:space-y-1 text-sm print:text-[9pt]">
//             <div className="flex">
//               <span className="font-semibold w-28 print:w-24">NAME :</span>
//               <span>RAPID MEDICOLEGAL SERVICES</span>
//             </div>
//             <div className="flex">
//               <span className="font-semibold w-28 print:w-24">BANK NAME :</span>
//               <span>ICICI BANK</span>
//             </div>
//             <div className="flex">
//               <span className="font-semibold w-28 print:w-24">BRANCH :</span>
//               <span>RAJARAMPURI, KOLHAPUR</span>
//             </div>
//             <div className="flex">
//               <span className="font-semibold w-28 print:w-24">A/C NO. :</span>
//               <span>016605010794</span>
//             </div>
//             <div className="flex">
//               <span className="font-semibold w-28 print:w-24">IFSC :</span>
//               <span>ICIC0000166</span>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT : QR IMAGE */}
//         <div className="flex items-center pl-3 print:pl-2 border-l-4 border-gray-500 print:border-gray-400">
//           <img
//             src={paymentQr}
//             alt="Payment QR Code"
//             className="w-40 h-40 print:w-35 print:h-35 object-contain"
//           />
//         </div>
//       </div>

//       {/* REGARDS */}
//       <div className="mt-6 print:mt-4 text-green-700 mb-3 print:mb-2">
//         <p className="font-semibold text-lg print:text-[12pt] text-black">Regards,</p>
//         <p className="font-bold text-base print:text-[11pt]">
//           RAPID MEDICOLEGAL SERVICES INDIA LTD.
//         </p>

//         <div className="mt-2 print:mt-1 text-sm print:text-[9pt]">
//           <p className="font-semibold">24 x 7 ALL INDIA HELP LINE NO.</p>
//           <p className="font-bold text-green-700">
//             +91-9422584275, +91-9421584275, +91-9405734275, +91-9665444275
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BankDetailsQR;





// BankDetailsQR.jsx - COMPACT VERSION FOR PRINT
import React from "react";
import paymentQr from "../../../assets/quotation/PaymentQr.png";

const BankDetailsQR = ({ data }) => {
  return (
    <div className="bank-details-container page-break-inside-avoid">
      <h3 className="text-black font-bold text-sm print:text-[10pt] mb-2">
        YOU CAN PAY ON BELOW BANK DETAILS :
      </h3>


      <div className="flex flex-col md:flex-row md:items-center gap-3 print:flex-row print:items-center print:gap-2">
        {/* BANK DETAILS - Left side */}
        <div className="flex-1 border border-gray-300 p-3 print:p-2">
          <h3 className="text-red-600 font-bold text-sm print:text-[10pt] mb-2">
            BANK DETAILS :
          </h3>

          <div className="space-y-1 print:space-y-0.5 text-xs print:text-[8pt]">
            <div className="flex">
              <span className="font-semibold w-24 print:w-20">NAME :</span>
              <span>RAPID MEDICOLEGAL SERVICES</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24 print:w-20">BANK NAME :</span>
              <span>ICICI BANK</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24 print:w-20">BRANCH :</span>
              <span>RAJARAMPURI, KOLHAPUR</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24 print:w-20">A/C NO. :</span>
              <span>016605010794</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-24 print:w-20">IFSC :</span>
              <span>ICIC0000166</span>
            </div>
          </div>
        </div>

        {/* QR IMAGE - Right side with border */}
        <div className="flex items-center justify-center pl-2 print:pl-2 border-l-2 print:border-l-2 border-gray-400">
          <img
            src={paymentQr}
            alt="Payment QR Code"
            className="w-32 h-32 print:w-32 print:h-32 object-contain"
          />
        </div>
      </div>
      {/* REGARDS */}
      <div className="mt-3 print:mt-[50px] text-green-700">
        <p className="font-semibold text-sm print:text-[10pt] text-black">Regards,</p>
        <p className="font-bold text-xs print:text-[9pt]">
          RAPID MEDICOLEGAL SERVICES INDIA LTD.
        </p>

        <div className="mt-1 text-xs print:text-[8pt]">
          <p className="font-semibold">24 x 7 ALL INDIA HELP LINE NO.</p>
          <p className="font-bold text-green-700">
            +91-9422584275, +91-9421584275, +91-9405734275, +91-9665444275
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsQR;