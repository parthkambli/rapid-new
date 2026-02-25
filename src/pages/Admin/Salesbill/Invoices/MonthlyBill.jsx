// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';
// import { toast } from 'react-toastify';

// import Top from '../../../../assets/Salesbill/right.png'
// import Logo from '../../../../assets/Salesbill/Logo.png';
// import stamp from '../../../../assets/Salesbill/stamp.png';
// import signature from '../../../../assets/Salesbill/signature.png';
// import bottom from '../../../../assets/Salesbill/bottom.png';

// const InvoiceReceipt = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [bill, setBill] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBill = async () => {
//       if (!id) {
//         toast.error("Invalid bill ID");
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await apiClient.get(apiEndpoints.salesBills.get(id));

//         if (response.data.success) {
//           setBill(response.data.data);
//           // Auto print after load
//           setTimeout(() => window.print(), 1000);
//         } else {
//           toast.error("Bill not found");
//           navigate("/admin/salesbill/list");
//         }
//       } catch (error) {
//         toast.error("Failed to load invoice");
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBill();
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-xl">
//         Loading Invoice...
//       </div>
//     );
//   }

//   if (!bill) {
//     return (
//       <div className="text-center text-red-600 text-2xl mt-20">
//         Invoice Not Found!
//       </div>
//     );
//   }

//   const doctorName = bill.client?.name || "Unknown Doctor";
//   const membershipDisplay = bill.membershipType === "monthly" ? "Monthly" :
//                           bill.membershipType === "yearly" ? "Yearly" : "One Time";
//   const invoiceDate = new Date(bill.billDate).toLocaleDateString('en-GB');
//   const amountInWords = numberToWords(Math.round(bill.totalAmount)); // Optional bonus

//   return (
//     <>
//       <div className="min-h-screen py-10 px-4 font-sans bg-gray-50">
//         <div className="max-w-4xl mx-auto">
//           {/* Receipt Container */}
//           <div className="relative bg-white border-4 border-black shadow-2xl overflow-hidden">
//             {/* Top Red Border */}
//             <div className="absolute top-0 left-12 right-12 h-2 bg-red-700 mt-4"></div>

//             {/* Main Content */}
//             <div className="p-12 pt-16 pb-20">
//               {/* Header */}
//               <div className="flex justify-between items-start pb-6 border-b-4 border-red-700">
//                 <img src={Logo} alt="Logo" className="w-48" />
//                 <div className="text-right text-sm leading-relaxed">
//                   {/* <strong className="text-lg block mb-1">
//                     Rapid Medicolegal Services India Ltd
//                   </strong>
//                   Office no. 5, 6, 3rd Floor, Star Tower,<br />
//                   Pach Bungalow, Shahupuri, Kolhapur,<br />
//                   Maharashtra, India.<br />
//                   Email: rapidmedicolegal@gmail.com<br />
//                   Mob: 9421464275 | Landline: 0231-2664275 */}
//                   <img src={Top} alt="" />
//                 </div>
//               </div>

//               {/* Doctor Name */}
//               <div className="my-8">
//                 <div className="text-left text-2xl font-bold">
//                   {doctorName}
//                 </div>
//               </div>

//               {/* INVOICE Title */}
//               <h1 className="text-center text-6xl font-bold uppercase tracking-wider my-8 underline">
//                 Invoice
//               </h1>

//               {/* Invoice No & Date */}
//               <div className="grid grid-cols-2 gap-8 my-8 text-lg">
//                 <div>
//                   <strong>Invoice number:</strong>{' '}
//                   <span className="ml-2 font-bold">{bill.billNumber}</span>
//                 </div>
//                 <div>
//                   <strong>Date:</strong>{' '}
//                   <span className="ml-2">{invoiceDate}</span>
//                 </div>
//               </div>

//               {/* Table */}
//               <table className="w-full border-collapse text-lg mt-10">
//                 <thead>
//                   <tr className="border-2 border-black">
//                     <th className="border-2 border-black p-4 text-left w-[10%]">Sr.No</th>
//                     <th className="border-2 border-black p-4 text-left">Particulars</th>
//                     <th className="border-2 border-black p-4 text-center">Membership Type</th>
//                     <th className="border-2 border-black p-4 text-right">Amount (₹)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bill.items.map((item, index) => (
//                     <tr key={item._id || index} className="border-2 border-black">
//                       <td className="border-2 border-black p-4 text-center">{index + 1}</td>
//                       <td className="border-2 border-black p-4">
//                         {item.description || "Medicolegal And Risk Management Service"}
//                       </td>
//                       <td className="border-2 border-black p-4 text-center font-medium">
//                         {membershipDisplay}
//                       </td>
//                       <td className="border-2 border-black p-4 text-right font-bold">
//                         ₹{item.amount.toLocaleString('en-IN')}
//                       </td>
//                     </tr>
//                   ))}
//                   <tr className="border-2 border-black font-bold text-xl bg-gray-50">
//                     <td colSpan="3" className="p-4 text-right border-2 border-black">
//                       Total Amount:
//                     </td>
//                     <td className="p-4 text-right border-2 border-black">
//                       ₹{bill.totalAmount.toLocaleString('en-IN')}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>

//               {/* Amount in Words (Optional but professional) */}
//               {bill.totalAmount > 0 && (
//                 <div className="mt-6 text-right italic text-lg">
//                   <strong>Amount in Words:</strong> {amountInWords} Rupees Only
//                 </div>
//               )}

//               {/* Stamp & Signature */}
//               <div className="flex justify-end items-end mt-16 space-x-16">
//                 <img src={stamp} alt="Stamp" className="  w-40 opacity-95" />
//                 <div>
//                   <img src={signature} alt="Signature" className="w-36" />
//                   <p className="text-center mt-2 text-sm font-medium">Authorised Signatory</p>
//                 </div>
//               </div>

//               {/* Bottom Date */}
//               <div className="mt-16 text-lg">
//                 <strong>Date:</strong> <span>{invoiceDate}</span>
//               </div>

//               {/* Thank You */}
//               <div className="mt-10 text-left text-2xl font-bold text-red-700">
//                 Thank you!
//               </div>
//             </div>

//             {/* Bottom Design */}
//             <div className="flex justify-center">
//               <img src={bottom} alt="Bottom Design" className="w-full max-w-2xl" />
//             </div>
//           </div>

//           {/* Print Button - Sirf screen pe dikhega */}
//           <div className="text-center mt-10 print:hidden">
//             <button
//               onClick={() => window.print()}
//               className="px-12 py-4 bg-red-700 hover:bg-red-800 text-white text-xl font-semibold rounded shadow-lg transition"
//             >
//               Print / Save as PDF
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Print Styles */}
//       <style jsx>{`
//         @media print {
//           body { background: white !important; margin: 0; padding: 10px; }
//           .print\\:hidden { display: none !important; }
//           @page { margin: 0.5cm; }
//         }
//       `}</style>
//     </>
//   );
// };

// // Bonus: Number to Words (Simple version)
// function numberToWords(num) {
//   const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
//     "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
//   const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
//   const thousands = ["", "Thousand", "Lakh", "Crore"];

//   if (num === 0) return "Zero";
//   let word = "";
//   let i = 0;
//   while (num > 0) {
//     if (num % 1000 !== 0) {
//       word = belowThousand(num % 1000) + (thousands[i] ? " " + thousands[i] : "") + " " + word;
//     }
//     num = Math.floor(num / 1000);
//     i++;
//   }
//   return word.trim();

//   function belowThousand(n) {
//     if (n === 0) return "";
//     if (n < 20) return ones[n];
//     if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
//     return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + belowThousand(n % 100) : "");
//   }
// }

// export default InvoiceReceipt;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../../services/apiClient";
import { toast } from "react-toastify";

import Top from "../../../../assets/Salesbill/right.png";
import Logo from "../../../../assets/Salesbill/Logo.png";
import stamp from "../../../../assets/Salesbill/stamp.png";
import signature from "../../../../assets/Salesbill/signature.png";

const InvoiceReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      if (!id) {
        toast.error("Invalid bill ID");
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get(apiEndpoints.salesBills.get(id));

        if (response.data.success) {
          setBill(response.data.data);
        } else {
          toast.error("Bill not found");
          navigate("/admin/salesbill/list");
        }
      } catch (error) {
        toast.error("Failed to load invoice");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading Invoice...
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="text-center text-red-600 text-2xl mt-20">
        Invoice Not Found!
      </div>
    );
  }

  const doctorName = bill.client?.name || "Unknown Doctor";
  const membershipDisplay =
    bill.membershipType === "monthly"
      ? "Monthly"
      : bill.membershipType === "yearly"
        ? "Yearly"
        : "One Time";
  const invoiceDate = new Date(bill.billDate)
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("/");

  const itemAmount = bill.items?.[0]?.amount || 0;
  const amountInWords = numberToWords(Math.round(itemAmount));

  return (
    <>
      <div className="min-h-screen py-4 px-4 font-sans bg-gray-50 flex items-center justify-center">
        <div className="w-full" style={{ maxWidth: "190mm" }}>
          {/* Receipt Container */}
          <div className="relative bg-white border-4 border-black shadow-2xl overflow-hidden">
            {/* Top Red Border */}
            <div className="absolute top-0 left-12 right-12 h-1.5 bg-red-700 mt-2"></div>

            {/* Main Content */}
            <div className="p-8 pt-10 pb-8">
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b-4 border-red-700">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-42"
                  style={{ width: "160px" }}
                />
                <div className="text-right text-xs leading-relaxed">
                  <img
                    src={Top}
                    alt=""
                    className="w-full"
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              </div>

              {/* Doctor Name */}
              <div className="my-4">
                <div className="text-left text-xl font-bold">{doctorName}</div>
              </div>

              {/* INVOICE Title */}
              <h1 className="text-center text-5xl font-bold uppercase tracking-wider my-5 underline">
                Invoice
              </h1>

              {/* Invoice No & Date */}
              <div className="grid grid-cols-2 gap-4 my-4 text-base">
                <div>
                  <strong>Invoice number:</strong>{" "}
                  <span className="ml-2 font-bold">{bill.billNumber}</span>
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  <span className="ml-2">{invoiceDate}</span>
                </div>
              </div>

              {/* Table */}
              <table className="w-full border-collapse text-base mt-5">
                <thead>
                  <tr className="border-2 border-black">
                    <th
                      className="border-2 border-black p-3 text-left"
                      style={{ width: "10%" }}
                    >
                      Sr.No
                    </th>
                    <th className="border-2 border-black p-3 text-left">
                      Particulars
                    </th>
                    <th
                      className="border-2 border-black p-3 text-center"
                      style={{ width: "20%" }}
                    >
                      Membership Type
                    </th>
                    <th
                      className="border-2 border-black p-3 text-right"
                      style={{ width: "18%" }}
                    >
                      Amount (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className="border-2 border-black"
                    >
                      <td className="border-2 border-black p-3 text-center">
                        {index + 1}
                      </td>
                      <td className="border-2 border-black p-3">
                        {item.description ||
                          "Medicolegal And Risk Management Service"}
                      </td>
                      <td className="border-2 border-black p-3 text-center font-medium">
                        {membershipDisplay}
                      </td>
                      <td className="border-2 border-black p-3 text-right font-bold">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Amount in Words */}
              {bill.totalAmount > 0 && (
                <div className="mt-4 text-right italic text-base">
                  <strong>Amount in Words:</strong> {amountInWords} Rupees Only
                </div>
              )}

              {/* Stamp & Signature */}
              <div className="flex justify-end items-end mt-8 space-x-10">
                <img src={stamp} alt="Stamp" className="w-32 h-32 opacity-95" />
                <div>
                  <img src={signature} alt="Signature" className="w-28" />
                  <p className="text-center mt-2 text-sm font-medium">
                    Authorised Signatory
                  </p>
                </div>
              </div>

              {/* Bottom Date */}
              <div className="mt-8 text-base">
                <strong>Date:</strong> <span>{invoiceDate}</span>
              </div>

              {/* Thank You */}
              <div className="mt-6 text-left text-2xl font-bold border-b-8 border-gray-700 text-red-700 pb-6">
                Thank you!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 100vh !important;
          }

          .min-h-screen {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 10mm;
          }

          .py-4 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }

          .px-4 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          /* Ensure width is maintained in print */
          .w-full {
            max-width: 190mm !important;
          }
        }
      `}</style>
    </>
  );
};

// Number to Words
function numberToWords(num) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["", "Thousand", "Lakh", "Crore"];

  if (num === 0) return "Zero";
  let word = "";
  let i = 0;
  while (num > 0) {
    if (num % 1000 !== 0) {
      word =
        belowThousand(num % 1000) +
        (thousands[i] ? " " + thousands[i] : "") +
        " " +
        word;
    }
    num = Math.floor(num / 1000);
    i++;
  }
  return word.trim();

  function belowThousand(n) {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    if (n < 100)
      return (
        tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
      );
    return (
      ones[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 !== 0 ? " " + belowThousand(n % 100) : "")
    );
  }
}

export default InvoiceReceipt;
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../../services/apiClient";
// import { toast } from "react-toastify";

// import Top from "../../../../assets/Salesbill/right.png";
// import Logo from "../../../../assets/Salesbill/Logo.png";
// import stamp from "../../../../assets/Salesbill/stamp.png";
// import signature from "../../../../assets/Salesbill/signature.png";
// import bottom from "../../../../assets/Salesbill/bottom.png";

// const InvoiceReceipt = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [bill, setBill] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBill = async () => {
//       if (!id) {
//         toast.error("Invalid bill ID");
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await apiClient.get(apiEndpoints.salesBills.get(id));

//         if (response.data.success) {
//           setBill(response.data.data);
//           // Auto print after load
//           // setTimeout(() => window.print(), 1000);
//         } else {
//           toast.error("Bill not found");
//           navigate("/admin/salesbill/list");
//         }
//       } catch (error) {
//         toast.error("Failed to load invoice");
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBill();
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-xl">
//         Loading Invoice...
//       </div>
//     );
//   }

//   if (!bill) {
//     return (
//       <div className="text-center text-red-600 text-2xl mt-20">
//         Invoice Not Found!
//       </div>
//     );
//   }

//   const doctorName = bill.client?.name || "Unknown Doctor";
//   const membershipDisplay =
//     bill.membershipType === "monthly"
//       ? "Monthly"
//       : bill.membershipType === "yearly"
//         ? "Yearly"
//         : "One Time";
//   // const invoiceDate = new Date(bill.billDate).toLocaleDateString('en-GB');
//   const invoiceDate = new Date(bill.billDate)
//     .toISOString()
//     .split("T")[0]
//     .split("-")
//     .reverse()
//     .join("/");

//   const itemAmount = bill.items?.[0]?.amount || 0;
//   const amountInWords = numberToWords(Math.round(itemAmount));
//   // const amountInWords = numberToWords(Math.round(bill.totalAmount));

//   return (
//     <>
//       <div className="min-h-screen py-4 px-4 font-sans bg-gray-50">
//         <div className="max-w-3xl mx-auto">
//           {/* Receipt Container */}
//           <div className="relative bg-white border-4 print:mt-[210px] border-black shadow-2xl overflow-hidden">
//             {/* Top Red Border */}
//             <div className="absolute top-0 left-12 right-12 h-1.5 bg-red-700 mt-2"></div>

//             {/* Main Content */}
//             <div className="p-6 pt-8 pb-6">
//               {/* Header */}
//               <div className="flex justify-between items-start pb-3 border-b-4 border-red-700">
//                 <img src={Logo} alt="Logo" className="w-42 print:mt-8" />
//                 <div className="text-right text-xs leading-relaxed">
//                   <img src={Top} alt="" className="w-full" />
//                 </div>
//               </div>

//               {/* Doctor Name */}
//               <div className="my-3">
//                 <div className="text-left text-lg font-bold">{doctorName}</div>
//               </div>

//               {/* INVOICE Title */}
//               <h1 className="text-center text-4xl font-bold uppercase tracking-wider my-3 underline">
//                 Invoice
//               </h1>

//               {/* Invoice No & Date */}
//               <div className="grid grid-cols-2 gap-4 my-3 text-sm">
//                 <div>
//                   <strong>Invoice number:</strong>{" "}
//                   <span className="ml-2 font-bold">{bill.billNumber}</span>
//                 </div>
//                 <div>
//                   <strong>Date:</strong>{" "}
//                   <span className="ml-2">{invoiceDate}</span>
//                 </div>
//               </div>

//               {/* Table */}
//               <table className="w-full border-collapse text-sm mt-4">
//                 <thead>
//                   <tr className="border-2 border-black">
//                     <th className="border-2 border-black p-2 text-left w-[10%]">
//                       Sr.No
//                     </th>
//                     <th className="border-2 border-black p-2 text-left">
//                       Particulars
//                     </th>
//                     <th className="border-2 border-black p-2 text-center">
//                       Membership Type
//                     </th>
//                     <th className="border-2 border-black p-2 text-right">
//                       Amount (₹)
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bill.items.map((item, index) => (
//                     <tr
//                       key={item._id || index}
//                       className="border-2 border-black"
//                     >
//                       <td className="border-2 border-black p-2 text-center">
//                         {index + 1}
//                       </td>
//                       <td className="border-2 border-black p-2">
//                         {item.description ||
//                           "Medicolegal And Risk Management Service"}
//                       </td>
//                       <td className="border-2 border-black p-2 text-center font-medium">
//                         {membershipDisplay}
//                       </td>
//                       <td className="border-2 border-black p-2 text-right font-bold">
//                         ₹{item.amount.toLocaleString("en-IN")}
//                         {/* ₹{bill.totalAmount.toLocaleString('en-IN')} */}
//                       </td>
//                     </tr>
//                   ))}
//                   {/* <tr className="border-2 border-black font-bold text-base bg-gray-50">
//                     <td colSpan="3" className="p-2 text-right border-2 border-black">
//                       Total Amount:
//                     </td>
//                     <td className="p-2 text-right border-2 border-black">
//                       ₹{bill.totalAmount.toLocaleString('en-IN')}
//                     </td>
//                   </tr> */}
//                 </tbody>
//               </table>

//               {/* Amount in Words */}
//               {bill.totalAmount > 0 && (
//                 <div className="mt-3 text-right italic text-sm">
//                   <strong>Amount in Words:</strong> {amountInWords} Rupees Only
//                 </div>
//               )}

//               {/* Stamp & Signature */}
//               <div className="flex justify-end items-end mt-6 space-x-8 print:mt-[120px]">
//                 <img
//                   src={stamp}
//                   alt="Stamp"
//                   className="w-28  h-28 opacity-95"
//                 />
//                 <div>
//                   <img src={signature} alt="Signature" className="w-24" />
//                   <p className="text-center mt-1 text-xs font-medium">
//                     Authorised Signatory
//                   </p>
//                 </div>
//               </div>

//               {/* Bottom Date */}
//               <div className="mt-6 text-sm">
//                 <strong>Date:</strong> <span>{invoiceDate}</span>
//               </div>

//               {/* Thank You */}
//               <div className="mt-4 text-left text-xl font-bold border-b-8 border-gray-700 text-red-700  pb-6">
//                 Thank you!
//               </div>
//             </div>

//             {/* Bottom Design
//             <div className="flex justify-center">
//               <img src={bottom} alt="Bottom Design" className="w-full max-w-xl" />
//             </div> */}
//           </div>

//           {/* Print Button - Sirf screen pe dikhega */}
//           {/* <div className="text-center mt-6 print:hidden">
//             <button
//               onClick={() => window.print()}
//               className="px-12 py-4 bg-red-700 hover:bg-red-800 text-white text-xl font-semibold rounded shadow-lg transition"
//             >
//               Print / Save as PDF
//             </button>
//           </div> */}
//         </div>
//       </div>

//       {/* Print Styles */}
//       <style jsx>{`
//         @media print {
//           body {
//             background: white !important;
//             margin: 0;
//             padding: 0;
//           }
//           .print\\:hidden {
//             display: none !important;
//           }
//           @page {
//             size: A4;
//             margin: 0.3cm;
//           }
//           /* Print specific adjustments */
//           .max-w-4xl {
//             max-width: 100% !important;
//             margin: 0 !important;
//           }
//           .py-4 {
//             padding-top: 0 !important;
//             padding-bottom: 0 !important;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// // Number to Words
// function numberToWords(num) {
//   const ones = [
//     "",
//     "One",
//     "Two",
//     "Three",
//     "Four",
//     "Five",
//     "Six",
//     "Seven",
//     "Eight",
//     "Nine",
//     "Ten",
//     "Eleven",
//     "Twelve",
//     "Thirteen",
//     "Fourteen",
//     "Fifteen",
//     "Sixteen",
//     "Seventeen",
//     "Eighteen",
//     "Nineteen",
//   ];
//   const tens = [
//     "",
//     "",
//     "Twenty",
//     "Thirty",
//     "Forty",
//     "Fifty",
//     "Sixty",
//     "Seventy",
//     "Eighty",
//     "Ninety",
//   ];
//   const thousands = ["", "Thousand", "Lakh", "Crore"];

//   if (num === 0) return "Zero";
//   let word = "";
//   let i = 0;
//   while (num > 0) {
//     if (num % 1000 !== 0) {
//       word =
//         belowThousand(num % 1000) +
//         (thousands[i] ? " " + thousands[i] : "") +
//         " " +
//         word;
//     }
//     num = Math.floor(num / 1000);
//     i++;
//   }
//   return word.trim();

//   function belowThousand(n) {
//     if (n === 0) return "";
//     if (n < 20) return ones[n];
//     if (n < 100)
//       return (
//         tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
//       );
//     return (
//       ones[Math.floor(n / 100)] +
//       " Hundred" +
//       (n % 100 !== 0 ? " " + belowThousand(n % 100) : "")
//     );
//   }
// }

// export default InvoiceReceipt;
