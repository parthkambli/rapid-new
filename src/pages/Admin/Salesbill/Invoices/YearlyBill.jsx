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
//       if (!id) return toast.error("Invalid invoice");

//       try {
//         setLoading(true);
//         const res = await apiClient.get(apiEndpoints.salesBills.get(id));
//         if (res.data.success) {
//           setBill(res.data.data);
//           setTimeout(() => window.print(), 1000);
//         } else {
//           toast.error("Bill not found");
//           navigate("/admin/salesbill/list");
//         }
//       } catch (err) {
//         toast.error("Failed to load invoice");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBill();
//   }, [id, navigate]);

//   if (loading) return <div className="text-center py-20 text-2xl">Loading Invoice...</div>;
//   if (!bill) return <div className="text-center py-20 text-red-600 text-2xl">Invoice Not Found!</div>;

//   const doctorName = bill.client?.name || "N/A";
//   const invoiceDate = new Date(bill.billDate).toLocaleDateString('en-GB');
//   const membershipType = bill.membershipType;
//   const displayType = membershipType === "monthly" ? "Monthly" :
//                      membershipType === "yearly" ? "Yearly" : "One Time";

//   // Calculate membership duration (if available in items description or notes)
//   let membershipYear = "1 Year";
//   const itemDesc = bill.items[0]?.description?.toLowerCase() || "";
//   if (itemDesc.includes("2 year")) membershipYear = "2 Years";
//   else if (itemDesc.includes("3 year")) membershipYear = "3 Years";
//   else if (membershipType === "monthly") membershipYear = "1 Month";

//   return (
//     <>
//       <div className="min-h-screen py-10 px-4 font-sans bg-gray-50">
//         <div className="max-w-4xl mx-auto m-2">
//           <div className="relative bg-white border-4 border-black shadow-2xl overflow-hidden">

//             <div className="absolute top-0 left-12 right-12 h-2 bg-red-700"></div>

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
//                     <img src={Top} alt="" />
//                 </div>
//               </div>

//               {/* Doctor Name */}
//               <div className="my-8">
//                 <div className="text-left text-2xl font-bold text-gray-800">
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
//                   <span className="ml-2 font-bold text-xl">{bill.billNumber}</span>
//                 </div>
//                 <div>
//                   <strong>Date:</strong>{' '}
//                   <span className="ml-2">{invoiceDate}</span>
//                 </div>
//               </div>

//               {/* Dynamic Table - Yearly/Multi-Year wala design */}
//               <table className="w-full border-collapse text-lg mt-10">
//                 <thead>
//                   <tr className="border-2 border-black">
//                     <th className="border-2 border-black p-4 text-left w-[8%]">Sr.No</th>
//                     <th className="border-2 border-black p-4 text-left">Particulars</th>
//                     <th className="border-2 border-black p-4 text-center">Membership Type</th>
//                     {membershipType !== "monthly" && (
//                       <th className="border-2 border-black p-4 text-center">Membership Year</th>
//                     )}
//                     <th className="border-2 border-black p-4 text-right">Amount (₹)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bill.items.map((item, i) => (
//                     <tr key={i} className="border-2 border-black">
//                       <td className="border-2 border-black p-4 text-center">{i + 1}</td>
//                       <td className="border-2 border-black p-4">
//                         {item.description || "Medicolegal And Risk Management Service"}
//                       </td>
//                       <td className="border-2 border-black p-4 text-center font-medium">
//                         {displayType}
//                       </td>
//                       {membershipType !== "monthly" && (
//                         <td className="border-2 border-black p-4 text-center font-medium">
//                           {membershipYear}
//                         </td>
//                       )}
//                       <td className="border-2 border-black p-4 text-right font-bold">
//                         ₹{item.amount.toLocaleString('en-IN')}
//                       </td>
//                     </tr>
//                   ))}

//                   {/* Total Row */}
//                   <tr className="border-2 border-black font-bold text-xl bg-gray-100">
//                     <td colSpan={membershipType === "monthly" ? 3 : 4} className="p-4 text-right border-2 border-black">
//                       Total Amount:
//                     </td>
//                     <td className="p-4 text-right border-2 border-black">
//                       ₹{bill.totalAmount.toLocaleString('en-IN')}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>

//               {/* Stamp & Signature */}
//               <div className="flex justify-end items-end mt-20 space-x-20">
//                 <img src={stamp} alt="Stamp" className="w-40 opacity-95" />
//                 <div className="text-center">
//                   <img src={signature} alt="Signature" className="w-36 mx-auto" />
//                   <p className="mt-2 text-sm font-medium">Authorised Signatory</p>
//                 </div>
//               </div>

//               {/* Bottom Date */}
//               <div className="mt-16 text-lg">
//                 <strong>Date:</strong> <span>{invoiceDate}</span>
//               </div>

//               {/* Thank You */}
//               <div className="mt-12 text-left text-3xl font-bold text-red-700">
//                 Thank you!
//               </div>
//             </div>

//             {/* Bottom Design */}
//             <div className="flex justify-center">
//               <img src={bottom} alt="Bottom" className="w-full max-w-3xl" />
//             </div>
//           </div>

//           {/* Print Button */}
//           <div className="text-center mt-12 print:hidden">
//             <button
//               onClick={() => window.print()}
//               className="px-12 py-4 bg-red-700 hover:bg-red-800 text-white text-xl font-semibold rounded shadow-lg transition"
//             >
//               Print / Save as PDF
//             </button>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @media print {
//           body, .min-h-screen { background: white !important; margin: 0; padding: 10px; }
//           button { display: none !important; }
//           @page { margin: 0.5cm; }
//         }
//       `}</style>
//     </>
//   );
// };

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
      if (!id) return toast.error("Invalid invoice");

      try {
        setLoading(true);
        const res = await apiClient.get(apiEndpoints.salesBills.get(id));
        if (res.data.success) {
          setBill(res.data.data);
          setTimeout(() => window.print(), 1000);
        } else {
          toast.error("Bill not found");
          navigate("/admin/salesbill/list");
        }
      } catch (err) {
        toast.error("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [id, navigate]);

  if (loading)
    return <div className="text-center py-20 text-2xl">Loading Invoice...</div>;
  if (!bill)
    return (
      <div className="text-center py-20 text-red-600 text-2xl">
        Invoice Not Found!
      </div>
    );

  const doctorName = bill.client?.name || "N/A";
  const invoiceDate = new Date(bill.billDate)
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("/");
  const membershipType = bill.membershipType;
  const displayType =
    membershipType === "monthly"
      ? "Monthly"
      : membershipType === "yearly"
        ? "Yearly"
        : "One Time";

  let membershipYear = "N/A";

  if (membershipType === "monthly") {
    membershipYear = "1 Month";
  } else if (bill.planYears && bill.planYears > 0) {
    membershipYear = `${bill.planYears} Year${bill.planYears > 1 ? "s" : ""}`;
  } else if (bill.billDate && bill.dueDate) {
    const start = new Date(bill.billDate);
    const end = new Date(bill.dueDate);
    const diffYears = Math.round((end - start) / (1000 * 60 * 60 * 24 * 365));
    membershipYear = `${diffYears} Year${diffYears > 1 ? "s" : ""}`;
  }

  return (
    <>
      <div className="min-h-screen py-4 px-4 font-sans bg-gray-50 flex items-center justify-center">
        <div className="w-full" style={{ maxWidth: "190mm" }}>
          <div className="relative bg-white border-4 border-black shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-12 right-12 h-1.5 bg-red-700 mt-2"></div>

            <div className="p-8 pt-10 pb-8">
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b-4 border-red-700">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-36"
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
                <div className="text-left text-xl font-bold text-gray-800">
                  {doctorName}
                </div>
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

              {/* Dynamic Table */}
              <table className="w-full border-collapse text-base mt-5">
                <thead>
                  <tr className="border-2 border-black">
                    <th
                      className="border-2 border-black p-3 text-left"
                      style={{ width: "8%" }}
                    >
                      Sr.No
                    </th>
                    <th className="border-2 border-black p-3 text-left">
                      Particulars
                    </th>
                    <th
                      className="border-2 border-black p-3 text-center"
                      style={{ width: "15%" }}
                    >
                      Membership Type
                    </th>
                    {membershipType !== "monthly" && (
                      <th
                        className="border-2 border-black p-3 text-center"
                        style={{ width: "15%" }}
                      >
                        Membership Year
                      </th>
                    )}
                    <th
                      className="border-2 border-black p-3 text-right"
                      style={{ width: "18%" }}
                    >
                      Amount (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item, i) => (
                    <tr key={i} className="border-2 border-black">
                      <td className="border-2 border-black p-3 text-center">
                        {i + 1}
                      </td>
                      <td className="border-2 border-black p-3">
                        {item.description ||
                          "Medicolegal And Risk Management Service"}
                      </td>
                      <td className="border-2 border-black p-3 text-center font-medium">
                        {displayType}
                      </td>
                      {membershipType !== "monthly" && (
                        <td className="border-2 border-black p-3 text-center font-medium">
                          {membershipYear}
                        </td>
                      )}
                      <td className="border-2 border-black p-3 text-right font-bold">
                        ₹{bill.totalAmount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Stamp & Signature */}
              <div className="flex justify-end items-end mt-8 space-x-10">
                <img src={stamp} alt="Stamp" className="w-32 h-32 opacity-95" />
                <div className="text-center">
                  <img
                    src={signature}
                    alt="Signature"
                    className="w-28 mx-auto"
                  />
                  <p className="mt-2 text-sm font-medium">
                    Authorised Signatory
                  </p>
                </div>
              </div>

              {/* Bottom Date */}
              <div className="mt-8 text-base">
                <strong>Date:</strong> <span>{invoiceDate}</span>
              </div>

              {/* Thank You */}
              <div className="mt-6 text-left text-2xl font-bold border-b-8 border-gray-700 pb-6 text-red-700">
                Thank you!
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body,
          .min-h-screen {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 100vh !important;
          }

          button {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 10mm;
          }

          .min-h-screen {
            padding: 0 !important;
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
//       if (!id) return toast.error("Invalid invoice");

//       try {
//         setLoading(true);
//         const res = await apiClient.get(apiEndpoints.salesBills.get(id));
//         if (res.data.success) {
//           setBill(res.data.data);
//           setTimeout(() => window.print(), 1000);
//         } else {
//           toast.error("Bill not found");
//           navigate("/admin/salesbill/list");
//         }
//       } catch (err) {
//         toast.error("Failed to load invoice");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBill();
//   }, [id, navigate]);

//   if (loading)
//     return <div className="text-center py-20 text-2xl">Loading Invoice...</div>;
//   if (!bill)
//     return (
//       <div className="text-center py-20 text-red-600 text-2xl">
//         Invoice Not Found!
//       </div>
//     );

//   const doctorName = bill.client?.name || "N/A";
//   // const invoiceDate = new Date(bill.billDate).toLocaleDateString('en-GB');
//   const invoiceDate = new Date(bill.billDate)
//     .toISOString()
//     .split("T")[0]
//     .split("-")
//     .reverse()
//     .join("/");
//   const membershipType = bill.membershipType;
//   const displayType =
//     membershipType === "monthly"
//       ? "Monthly"
//       : membershipType === "yearly"
//         ? "Yearly"
//         : "One Time";

//   // // Calculate membership duration (if available in items description or notes)
//   // let membershipYear = "1 Year";
//   // const itemDesc = bill.items[0]?.description?.toLowerCase() || "";
//   // if (itemDesc.includes("2 year")) membershipYear = "2 Years";
//   // else if (itemDesc.includes("3 year")) membershipYear = "3 Years";
//   // else if (membershipType === "monthly") membershipYear = "1 Month";

//   // // Calculate membership duration
//   // let membershipYear = "1 Year";

//   // const itemDesc = bill.items[0]?.description?.toLowerCase() || "";

//   // if (membershipType === "monthly") {
//   //   membershipYear = "1 Month";
//   // } else {
//   //   // Extract number before "year"
//   //   const match = itemDesc.match(/(\d+)\s*year/);

//   //   if (match) {
//   //     const years = match[1];
//   //     membershipYear = `${years} Year${years > 1 ? "s" : ""}`;
//   //   }
//   // }

//   // const membershipType = bill.membershipType;

//   let membershipYear = "N/A";

//   if (membershipType === "monthly") {
//     membershipYear = "1 Month";
//   } else if (bill.planYears && bill.planYears > 0) {
//     membershipYear = `${bill.planYears} Year${bill.planYears > 1 ? "s" : ""}`;
//   } else if (bill.billDate && bill.dueDate) {
//     const start = new Date(bill.billDate);
//     const end = new Date(bill.dueDate);
//     const diffYears = Math.round((end - start) / (1000 * 60 * 60 * 24 * 365));
//     membershipYear = `${diffYears} Year${diffYears > 1 ? "s" : ""}`;
//   }

//   return (
//     <>
//       <div className="min-h-screen py-4 px-4 font-sans bg-gray-50">
//         <div className="max-w-3xl mx-auto">
//           <div className="relative bg-white border-4 print:mt-[2mm] border-black shadow-2xl overflow-hidden">
//             <div className="absolute top-0 left-12 right-12 h-1.5 bg-red-700 mt-2"></div>

//             <div className="p-6 pt-8 pb-6 print:pb-0">
//               {/* Header */}
//               <div className="flex justify-between items-start pb-3 border-b-4 border-red-700">
//                 <img src={Logo} alt="Logo" className="w-36 print:w-[180px]" />
//                 <div className="text-right text-xs leading-relaxed">
//                   <img src={Top} alt="" className="w-full" />
//                 </div>
//               </div>

//               {/* Doctor Name */}
//               <div className="my-3">
//                 <div className="text-left text-lg font-bold text-gray-800">
//                   {doctorName}
//                 </div>
//               </div>

//               {/* INVOICE Title */}
//               <h1 className="text-center text-4xl font-bold uppercase tracking-wider my-3 underline">
//                 Invoice
//               </h1>

//               {/* Invoice No & Date */}
//               <div className="grid grid-cols-2 gap-4 my-3 text-sm">
//                 <div>
//                   <strong>Invoice number:</strong>{" "}
//                   <span className="ml-2 font-bold text-base">
//                     {bill.billNumber}
//                   </span>
//                 </div>
//                 <div>
//                   <strong>Date:</strong>{" "}
//                   <span className="ml-2">{invoiceDate}</span>
//                 </div>
//               </div>

//               {/* Dynamic Table - Yearly/Multi-Year wala design */}
//               <table className="w-full border-collapse text-sm mt-4">
//                 <thead>
//                   <tr className="border-2 border-black">
//                     <th className="border-2 border-black p-2 text-left w-[8%]">
//                       Sr.No
//                     </th>
//                     <th className="border-2 border-black p-2 text-left">
//                       Particulars
//                     </th>
//                     <th className="border-2 border-black p-2 text-center">
//                       Membership Type
//                     </th>
//                     {membershipType !== "monthly" && (
//                       <th className="border-2 border-black p-2 text-center">
//                         Membership Year
//                       </th>
//                     )}
//                     <th className="border-2 border-black p-2 text-right">
//                       Amount (₹)
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bill.items.map((item, i) => (
//                     <tr key={i} className="border-2 border-black">
//                       <td className="border-2 border-black p-2 text-center">
//                         {i + 1}
//                       </td>
//                       <td className="border-2 border-black p-2">
//                         {item.description ||
//                           "Medicolegal And Risk Management Service"}
//                       </td>
//                       <td className="border-2 border-black p-2 text-center font-medium">
//                         {displayType}
//                       </td>
//                       {membershipType !== "monthly" && (
//                         <td className="border-2 border-black p-2 text-center font-medium">
//                           {membershipYear}
//                         </td>
//                       )}
//                       <td className="border-2 border-black p-2 text-right font-bold">
//                         {/* ₹{item.amount.toLocaleString('en-IN')} */}₹
//                         {bill.totalAmount.toLocaleString("en-IN")}
//                       </td>
//                     </tr>
//                   ))}

//                   {/* Total Row */}
//                   {/* <tr className="border-2 border-black font-bold text-base bg-gray-100">
//                     <td colSpan={membershipType === "monthly" ? 3 : 4} className="p-2 text-right border-2 border-black">
//                       Total Amount:
//                     </td>
//                     <td className="p-2 text-right border-2 border-black">
//                       ₹{bill.totalAmount.toLocaleString('en-IN')}
//                     </td>
//                   </tr> */}
//                 </tbody>
//               </table>

//               {/* Stamp & Signature */}
//               <div className="flex justify-end items-end mt-6 space-x-8">
//                 <img src={stamp} alt="Stamp" className="w-28 h-28 opacity-95" />
//                 <div className="text-center">
//                   <img
//                     src={signature}
//                     alt="Signature"
//                     className="w-24 mx-auto"
//                   />
//                   <p className="mt-1 text-xs font-medium">
//                     Authorised Signatory
//                   </p>
//                 </div>
//               </div>

//               {/* Bottom Date */}
//               <div className="mt-6 text-sm">
//                 <strong>Date:</strong> <span>{invoiceDate}</span>
//               </div>

//               {/* Thank You */}
//               <div className="mt-4 text-left text-xl font-bold border-b-8 border-gray-700   pb-6 text-red-700">
//                 Thank you!
//               </div>
//             </div>

//             {/* Bottom Design */}
//             {/* <div className="flex justify-center">
//               <img src={bottom} alt="Bottom" className="w-full max-w-xl" />
//             </div> */}
//           </div>

//           {/* Print Button */}
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

//       <style jsx>{`
//         @media print {
//           body,
//           .min-h-screen {
//             background: white !important;
//             margin: 0;
//             padding: 0;
//           }
//           button {
//             display: none !important;
//           }
//           @page {
//             size: A4;
//             margin: 0.3cm;
//           }
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

// export default InvoiceReceipt;
