




// import React from "react";
// import Top from '../../../assets/Salesbill/top.png'
// import Logo from '../../../assets/Salesbill/Logo.png'
// import signature from '../../../assets/Salesbill/signature.png'
// import stamp from '../../../assets/Salesbill/stamp.png'
// import bottom from '../../../assets/Salesbill/bottom.png'




// export default function Invoice() {
//   return (
//     <div className="w-full max-w-[800px] mx-auto bg-white p-8 text-black font-sans border border-gray-300">
      



// {/* 
// <div>
// <img src={Top} alt="" />


// <div className="flex justify-around">
//   <div>
//   <img src={Logo} alt=""    />
// </div>

//  <div className="text-center mb-6 w-[20vw]">
//         <h2 className="text-sm  uppercase">
//           Rapid Medicolegal Services India Ltd
//         </h2>
//         <p className="mt-2">
//           Office no. 5, 6, 3rd Floor, Star Tower, Pach Bungalow, Shahupuri,
//           Kolhapur, Maharashtra, India.
//         </p>
//         <p className="mt-1">Email: rapidmedicolegal@gmail.com</p>
//         <p className="mt-1">
//           Contact: 9421464275 &nbsp;&nbsp; Lanline: 0231-2664275
//         </p>
//       </div>

// </div>

// </div> */}



// <div className="w-full max-w-[900px] mx-auto mt-6">
  
//   {/* TOP BAR IMAGE (optional) */}
//   <img src={Top} alt="top" className="w-full mb-4" />

//   <div className="flex justify-between items-start w-full">

//     {/* LEFT LOGO */}
//     <div className="w-[200px]">
//       <img src={Logo} alt="logo" className="w-full object-contain" />
//     </div>

//     {/* RIGHT BOX WITH BORDER */}
//     <div className="border border-black p-3 w-[350px] text-center leading-tight text-[14px]">
//       <h2 className="text-sm font-semibold">
//         Rapid Medicolegal Services India Ltd
//       </h2>

//       <p className="mt-1">
//         Address : Office no. 5, 6, 3<sup>rd</sup> Floor, Star Tower,
//       </p>
//       <p>Pach Bunglow, Shahupuri, Kolhapur,</p>
//       <p>Maharashtra, India.</p>

//       <p className="mt-1 font-medium underline text-blue-700">
//         Email-rapidmedicolegal@gmail.com
//       </p>

//       <p className="mt-1">Contact : 9421464275</p>
//       <p>Lanline : 0231-2664275</p>
//     </div>

//   </div>
// </div>


//       {/* Company Header */}
     

//       {/* Doctor Name */}
//       <div className="text-left font-semibold mb-8 mt-8">
//         DR. RAHUL PAWAR & DR. GEETANJALI PAWAR
//       </div>

//       {/* Invoice Title */}
//       <h1 className="text-center text-2xl font-bold underline mb-6">INVOICE</h1>

//       {/* Invoice Number */}
//       <div className="mb-6">
//         <p>
//           <span className="font-semibold">INVOICE NUMBER :</span>{" "}
//           RML-10482/FEB 2024
//         </p>
//       </div>

//       {/* Table */}
//       <table className="w-full border border-black border-collapse text-left">
//         <thead>
//           <tr>
//             <th className="border border-black px-2 py-1 w-16">SrNo</th>
//             <th className="border border-black px-2 py-1">Description</th>
//             <th className="border border-black px-2 py-1">Membership Type</th>
//             <th className="border border-black px-2 py-1">Membership Year</th>
//             <th className="border border-black px-2 py-1 w-28">Amount</th>
//           </tr>
//         </thead>

//         <tbody>
//           <tr>
//             <td className="border border-black px-2 py-1">1</td>
//             <td className="border border-black px-2 py-1">
//               Medicoleg And Risk Management Service
//             </td>
//             <td className="border border-black px-2 py-1">Yearly</td>
//             <td className="border border-black px-2 py-1">1 year</td>
//             <td className="border border-black px-2 py-1">10,000/-</td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Net Amount */}
//       <div className="mt-6 text-right pr-2">
//         <p className="font-semibold">
//           Net Amount: &nbsp;&nbsp; 10,000/-
//         </p>
//       </div>

//       {/* Signature + Date */}
//       {/* <div className="flex justify-between mt-16">
//         <p className="font-medium">Date : 10-02-2024</p>
//         <img src={signature} alt="" />
//         <p className="font-medium pr-4">SIGNATURE</p>
//       </div> */}



// <div className="w-full mt-20 flex items-center justify-between">

//   {/* LEFT SIDE DATE */}
//   <p className="font-semibold text-[14px]">
//     Date : 10-02-2024
//   </p>

//   {/* CENTER — STAMP + SIGNATURE (right side of stamp) */}
//   <div className="relative flex items-center justify-center w-[250px]">

//     {/* STAMP */}
//     <img
//       src={stamp}
//       alt="stamp"
//       className="w-[130px] h-[130px] object-contain"
//     />

//     {/* SIGNATURE IMAGE ON RIGHT SIDE OF STAMP */}
//     <img
//       src={signature}
//       alt="signature"
//       className="w-[140px] absolute right-[-80px] top-[35px] rotate-[8deg]"
//     />
//   </div>

//   {/* RIGHT SIDE SIGNATURE LABEL */}
//   <p className="font-semibold text-[14px] mr-4">
//     SIGNATURE
//   </p>
// </div>

// {/* THANK YOU */}
// <p className="mt-10 font-semibold text-[16px]">Thank you...!</p>







//       {/* Footer */}
//       <div>
//             <img src={bottom} alt="" />
//         </div>
//     </div>
//   );
// }















// import React, { useEffect, useState } from 'react';

// import Logo from '../../../../assets/Salesbill/Logo.png';
// import stamp from '../../../../assets/Salesbill/stamp.png';
// import signature from '../../../../assets/Salesbill/signature.png';
// import bottom from '../../../../assets/Salesbill/bottom.png';


// const InvoiceReceipt = () => {
//   const [today, setToday] = useState('');

//   useEffect(() => {
//     const date = new Date().toLocaleDateString('en-GB');
//     setToday(date);
//   }, []);

//   return (
//     <>
//       <div className="min-h-screen  py-10 px-4 font-sans">
//         <div className="max-w-4xl mx-auto">
//           {/* Receipt Container */}
//           <div className="relative bg-white border-4 border-black shadow-2xl overflow-hidden">
//             {/* Top Red Border */}
//             <div className="absolute top-0 left-12 right-12 h-2 bg-red-700"></div>

//             {/* Main Content */}
//             <div className="p-12 pt-16 pb-20">
//               {/* Header */}
//               <div className="flex justify-between items-start pb-6 border-b-4 border-red-700">
//                 <img src={Logo} alt="Logo" className="w-48" />
//                 <div className="text-right text-sm leading-relaxed">
//                   <strong className="text-lg block mb-1">
//                     Rapid Medicolegal Services India Ltd
//                   </strong>
//                   Office no. 5, 6, 3rd Floor, Star Tower,<br />
//                   Pach Bungalow, Shahupuri, Kolhapur,<br />
//                   Maharashtra, India.<br />
//                   Email: rapidmedicolegal@gmail.com<br />
//                   Mob: 9421464275 | Landline: 0231-2664275
//                 </div>
//               </div>

//               {/* Doctor Name */}
//               <div className="my-8">
//                 <div className="text-left text-lg font-bold" contentEditable suppressContentEditableWarning>
//                   Dr. Rahul Pawar & Dr. Geetanjali Pawar
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
//                   <span contentEditable suppressContentEditableWarning className="ml-2">
//                     RML-REC-2025/001
//                   </span>
//                 </div>
//                 <div>
//                   <strong>Date:</strong> <span className="ml-2">{today}</span>
//                 </div>
//               </div>

//               {/* Updated Table with Membership Year */}
//               <table className="w-full border-collapse text-lg mt-10">
//                 <thead>
//                   <tr className="border-2 border-black">
//                     <th className="border-2 border-black p-4 text-left w-[8%]">Sr.No</th>
//                     <th className="border-2 border-black p-4 text-left">Particulars</th>
//                     <th className="border-2 border-black p-4 text-center">Membership Type</th>
//                     <th className="border-2 border-black p-4 text-center">Membership Year</th>
//                     <th className="border-2 border-black p-4 text-right">Amount (₹)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr className="border-2 border-black">
//                     <td className="border-2 border-black p-4" contentEditable suppressContentEditableWarning>1</td>
//                     <td className="border-2 border-black p-4" contentEditable suppressContentEditableWarning>
//                       Medicolegal And Risk Management Service
//                     </td>
//                     <td className="border-2 border-black p-4 text-center" contentEditable suppressContentEditableWarning>
//                       Yearly
//                     </td>
//                     <td className="border-2 border-black p-4 text-center" contentEditable suppressContentEditableWarning>
//                       1 Year
//                     </td>
//                     <td className="border-2 border-black p-4 text-right" contentEditable suppressContentEditableWarning>
//                       899.00
//                     </td>
//                   </tr>

//                   {/* Total Row */}
//                   <tr className="border-2 border-black font-bold text-xl">
//                     <td colSpan="4" className="p-4 text-right border-2 border-black">
//                       Total Amount Received:
//                     </td>
//                     <td className="p-4 text-right border-2 border-black">
//                       ₹2,399.00
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>

//               {/* Stamp & Signature */}
//               <div className="flex justify-end items-end mt-16 space-x-16">
//                 <img src={stamp} alt="Company Stamp" className="w-40 opacity-95" />
//                 <div>
//                   <img src={signature} alt="Signature" className="w-32" />
//                 </div>
//               </div>

//               {/* Bottom Date */}
//               <div className="mt-16 text-lg">
//                 <strong>Date:</strong> <span>{today}</span>
//               </div>

//               {/* Thank You */}
//               <div className="mt-10 text-left text-2xl font-bold">
//                 Thank you!
//               </div>
//             </div>

//             {/* Bottom Black Border */}
//             <div className="flex justify-center">
//                          <img src={bottom} alt="Bottom Design" className="w-full max-w-2xl" />
//                        </div>
//           </div>

//           {/* Print Button */}
//           <div className="text-center mt-10">
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
//           body { background: white; margin: 0; padding: 20px; }
//           .min-h-screen { background: white; }
//           button { display: none !important; }
//         }
//       `}</style>
//     </>
//   );
// };

// export default InvoiceReceipt;





















import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../../../services/apiClient';
import { toast } from 'react-toastify';

import Logo from '../../../../assets/Salesbill/Logo.png';
import stamp from '../../../../assets/Salesbill/stamp.png';
import signature from '../../../../assets/Salesbill/signature.png';
import bottom from '../../../../assets/Salesbill/bottom.png';

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

  if (loading) return <div className="text-center py-20 text-2xl">Loading Invoice...</div>;
  if (!bill) return <div className="text-center py-20 text-red-600 text-2xl">Invoice Not Found!</div>;

  const doctorName = bill.client?.name || "N/A";
  const invoiceDate = new Date(bill.billDate).toLocaleDateString('en-GB');
  const membershipType = bill.membershipType;
  const displayType = membershipType === "monthly" ? "Monthly" : 
                     membershipType === "yearly" ? "Yearly" : "One Time";

  // Calculate membership duration (if available in items description or notes)
  let membershipYear = "1 Year";
  const itemDesc = bill.items[0]?.description?.toLowerCase() || "";
  if (itemDesc.includes("2 year")) membershipYear = "2 Years";
  else if (itemDesc.includes("3 year")) membershipYear = "3 Years";
  else if (membershipType === "monthly") membershipYear = "1 Month";

  return (
    <>
      <div className="min-h-screen py-10 px-4 font-sans bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white border-4 border-black shadow-2xl overflow-hidden">

            <div className="absolute top-0 left-12 right-12 h-2 bg-red-700"></div>

            <div className="p-12 pt-16 pb-20">

              {/* Header */}
              <div className="flex justify-between items-start pb-6 border-b-4 border-red-700">
                <img src={Logo} alt="Logo" className="w-48" />
                <div className="text-right text-sm leading-relaxed">
                  <strong className="text-lg block mb-1">
                    Rapid Medicolegal Services India Ltd
                  </strong>
                  Office no. 5, 6, 3rd Floor, Star Tower,<br />
                  Pach Bungalow, Shahupuri, Kolhapur,<br />
                  Maharashtra, India.<br />
                  Email: rapidmedicolegal@gmail.com<br />
                  Mob: 9421464275 | Landline: 0231-2664275
                </div>
              </div>

              {/* Doctor Name */}
              <div className="my-8">
                <div className="text-left text-2xl font-bold text-gray-800">
                  {doctorName}
                </div>
              </div>

              {/* INVOICE Title */}
              <h1 className="text-center text-6xl font-bold uppercase tracking-wider my-8 underline">
                Invoice
              </h1>

              {/* Invoice No & Date */}
              <div className="grid grid-cols-2 gap-8 my-8 text-lg">
                <div>
                  <strong>Invoice number:</strong>{' '}
                  <span className="ml-2 font-bold text-xl">{bill.billNumber}</span>
                </div>
                <div>
                  <strong>Date:</strong>{' '}
                  <span className="ml-2">{invoiceDate}</span>
                </div>
              </div>

              {/* Dynamic Table - Yearly/Multi-Year wala design */}
              <table className="w-full border-collapse text-lg mt-10">
                <thead>
                  <tr className="border-2 border-black">
                    <th className="border-2 border-black p-4 text-left w-[8%]">Sr.No</th>
                    <th className="border-2 border-black p-4 text-left">Particulars</th>
                    <th className="border-2 border-black p-4 text-center">Membership Type</th>
                    {membershipType !== "monthly" && (
                      <th className="border-2 border-black p-4 text-center">Membership Year</th>
                    )}
                    <th className="border-2 border-black p-4 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item, i) => (
                    <tr key={i} className="border-2 border-black">
                      <td className="border-2 border-black p-4 text-center">{i + 1}</td>
                      <td className="border-2 border-black p-4">
                        {item.description || "Medicolegal And Risk Management Service"}
                      </td>
                      <td className="border-2 border-black p-4 text-center font-medium">
                        {displayType}
                      </td>
                      {membershipType !== "monthly" && (
                        <td className="border-2 border-black p-4 text-center font-medium">
                          {membershipYear}
                        </td>
                      )}
                      <td className="border-2 border-black p-4 text-right font-bold">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr className="border-2 border-black font-bold text-xl bg-gray-100">
                    <td colSpan={membershipType === "monthly" ? 3 : 4} className="p-4 text-right border-2 border-black">
                      Total Amount:
                    </td>
                    <td className="p-4 text-right border-2 border-black">
                      ₹{bill.totalAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Stamp & Signature */}
              <div className="flex justify-end items-end mt-20 space-x-20">
                <img src={stamp} alt="Stamp" className="w-40 opacity-95" />
                <div className="text-center">
                  <img src={signature} alt="Signature" className="w-36 mx-auto" />
                  <p className="mt-2 text-sm font-medium">Authorised Signatory</p>
                </div>
              </div>

              {/* Bottom Date */}
              <div className="mt-16 text-lg">
                <strong>Date:</strong> <span>{invoiceDate}</span>
              </div>

              {/* Thank You */}
              <div className="mt-12 text-left text-3xl font-bold text-red-700">
                Thank you!
              </div>
            </div>

            {/* Bottom Design */}
            <div className="flex justify-center">
              <img src={bottom} alt="Bottom" className="w-full max-w-3xl" />
            </div>
          </div>

          {/* Print Button */}
          <div className="text-center mt-12 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-12 py-4 bg-red-700 hover:bg-red-800 text-white text-xl font-semibold rounded shadow-lg transition"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body, .min-h-screen { background: white !important; margin: 0; padding: 10px; }
          button { display: none !important; }
          @page { margin: 0.5cm; }
        }
      `}</style>
    </>
  );
};

export default InvoiceReceipt;