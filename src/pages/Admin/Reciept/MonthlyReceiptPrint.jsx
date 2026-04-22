



// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { apiHelpers, apiEndpoints } from "../../../services/apiClient";

// import Right from "../../../assets/salesbill/WNright.png";
// import left from "../../../assets/salesbill/logo.png";
// import stamp from "../../../assets/salesbill/stamp.png";
// import signature from "../../../assets/salesbill/signature.png";

// const MonthlyPremiumReceipt = () => {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchReceipt = async () => {
//       try {
//         // Abhi ke liye yearly print endpoint use kar rahe hain
//         // Jab monthly ka alag endpoint ban jaaye to neeche wali line uncomment kar dena
//         // const response = await apiHelpers.getById(apiEndpoints.receipts.getprintmonthly, id);
        
//         const response = await apiHelpers.getById(apiEndpoints.receipts.getprintmonth, id);
//         setData(response.data);
//       } catch (error) {
//         console.error("Error fetching receipt:", error);
//         alert("Failed to load monthly receipt for printing");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReceipt();
//   }, [id]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "--";
//     return new Date(dateString).toLocaleDateString("en-GB"); // DD-MM-YYYY
//   };

//   const formatMonthYear = (dateString) => {
//     if (!dateString) return "--";
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", { month: "long", year: "numeric" });
//     // Output: "December 2025"
//   };

//   if (loading) {
//     return <div className="text-center py-20 text-xl font-semibold">Loading receipt...</div>;
//   }

//   if (!data || !data.receipt) {
//     return <div className="text-center py-20 text-xl text-red-600 font-semibold">Receipt not found</div>;
//   }

//   const receipt = data.receipt;
//   const doctor = receipt.payer?.entityId || {};
  

//   // Payment mode ko friendly display mein convert karo
//   const getPaymentModeDisplay = (method) => {
//     if (!method) return "By Cash";
//     const lower = method.toLowerCase();
//     const map = {
//       cash: "Cash",
//       cheque: "Cheque",
//       nach: "NACH",
//       neft_rtgs: "NEFT/RTGS",
//       online: "Online",
//       other: "Other",
//     };
//     const friendly = map[lower] || method.toUpperCase();

//     if (lower === "nach") {
//       return "Monthly By NACH";
//     }
//     return `By ${friendly}`;
//   };

//   const paymentModeDisplay = getPaymentModeDisplay(receipt.paymentMethod);

//   const template = {
//     // doctorName: (doctor.fullName || "N/A").toUpperCase(),
//     doctorName: (receipt.payer.name || "N/A").toUpperCase(),
//     qualification: doctor.qualification || "--",
//     specialization: doctor.specialization?.join(", ") || "GENERAL PRACTITIONER",
//     hospitalName: doctor.hospitalName || "--",
//     hospitalAddress: [
//       doctor.hospitalAddress?.address || "",
//       doctor.hospitalAddress?.city || "",
//       doctor.hospitalAddress?.state || "",
//       doctor.hospitalAddress?.pinCode || "",
//       "INDIA"
//     ].filter(Boolean).join(", "),
//     registrationNo: doctor.licenseNumber || doctor.doctorId || "--",

//     receiptNumber: receipt.receiptNumber || "--",
//     refNo: receipt.referenceNumber || "--",
//     receiptDate: formatDate(receipt.receiptDate),

//     paymentModeDisplay,
//     membershipDisplay: paymentModeDisplay.includes("NACH") 
//       ? "Monthly (By NACH)" 
//       : `Monthly (${paymentModeDisplay.replace("By ", "")})`,

//     paymentDate: formatDate(receipt.paymentDate || receipt.receiptDate),
//     chequeNo: receipt.bankDetails?.chequeNumber || "--",
//     drawnOn: receipt.drawnOnBank || "--",

//     amountPaid: receipt.monthlyPremium || receipt.amount || receipt.installmentAmount || 0,
//     monthYear: formatMonthYear(receipt.receiptDate),

//     description: receipt.remarks || "----",
//     date: formatDate(receipt.receiptDate),
//   };

//   return (
//     <>
//       <div className="max-w-3xl border p-4 mx-auto bg-white print:max-w-full print:mx-0 print:p-4" style={{ fontFamily: "Arial, sans-serif" }}>
//         {/* Red Top Border */}
//         <div className="h-2 bg-red-700"></div>

//         {/* Header Logos */}
//         <div className="flex justify-between items-start">
//           <img src={left} alt="Logo" className="w-48 h-auto mt-4" />
//           <img src={Right} alt="Right Logo" className="w-100 h-auto" />
//         </div>

//         {/* Doctor Details + RECEIPT Title */}
//         <div className="flex justify-between items-start border-t-2 border-b-2 border-gray-400 py-6 mb-8">
//           <div className="text-sm leading-relaxed">
//             <div className="font-bold text-lg mb-2">
//               {template.doctorName}
//               <span className="text-gray-600 font-normal text-base">
//                 {" "} | Receipt Number: {template.receiptNumber}
//               </span>
//             </div>
//             <div><strong>Qualification :</strong> {template.qualification}</div>
//             <div><strong>Specialization :</strong> {template.specialization}</div>
//             <div><strong>Hospital Name :</strong> {template.hospitalName}</div>
//             <div><strong>Hospital Address :</strong> {template.hospitalAddress}</div>
//             <div><strong>Registration No :</strong> {template.registrationNo}</div>
//             <div><strong> Membership : </strong> {template.membershipDisplay}</div>
           
//           </div>
//           <div className="text-right">
//             <h1 className="text-5xl font-serif tracking-wider text-gray-800">RECEIPT</h1>
//           </div>
//         </div>

//         {/* Ref No & Date */}
//         <div className="mb-8 text-sm">
//           Ref No : {template.refNo} / Receipt Date: {template.receiptDate}
//         </div>

//         {/* Payment Details Table */}
//         <table className="w-full text-sm border border-gray-400 mb-8">
//           <tbody>
//             <tr className="border-b">
//               <td className="py-3 px-4 font-semibold bg-gray-100 border-r w-1/3">Payment Mode</td>
//               <td className="py-3 px-4 font-medium">{template.paymentModeDisplay}</td>
//             </tr>
//             <tr className="border-b">
//               <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Payment Date</td>
//               <td className="py-3 px-4">{template.paymentDate}</td>
//             </tr>
//             <tr className="border-b">
//               <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Cheque No.</td>
//               <td className="py-3 px-4">{template.chequeNo}</td>
//             </tr>
//             <tr className="border-b">
//               <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Drawn On</td>
//               <td className="py-3 px-4">{template.drawnOn}</td>
//             </tr>
//             <tr className="border-b">
//               <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Amount Paid</td>
//               <td className="py-3 px-4 font-bold text-lg">
//                 ₹{(template.amountPaid ?? 0).toLocaleString("en-IN")}
//               </td>
//             </tr>
//             <tr className="border-b">
//               <td className="py-3 px-4 font-semibold bg-gray-100 border-r">For the Month of</td>
//               <td className="py-3 px-4 font-bold text-lg text-teal-700">PREMIUM OF {template.monthYear}</td>
//             </tr>
//             <tr>
//               <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Description</td>
//               <td className="py-3 px-4">{template.description}</td>
//             </tr>
//           </tbody>
//         </table>

//         <div className="text-xs text-gray-600 mb-8">*T&C Apply</div>

//         {/* Footer */}
//         <div className="px-8 pb-8">
//           <div className="flex justify-end items-end gap-16">
//             <div className="relative">
//               <img src={stamp} alt="Stamp" className="w-40 h-40 opacity-90" />
//             </div>
//             <div className="text-center">
//               <img src={signature} alt="Signature" className="w-48 h-auto mb-2" />
//               <div className="font-semibold text-sm">SIGNATURE</div>
//             </div>
//           </div>

//           <div className="mt-10 text-sm">
//             <strong>Date :</strong> {template.date}
//           </div>
//           <div className="mt-4 text-lg font-semibold">Thank you...!</div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="h-3 bg-gray-800"></div>
//       </div>

//       {/* Print Button */}
//       <div className="fixed bottom-4 right-4 print:hidden z-50">
//         <button
//           onClick={() => window.print()}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2"
//         >
//           🖨️ Print Receipt
//         </button>
//       </div>
//     </>
//   );
// };

// export default MonthlyPremiumReceipt;


















import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiHelpers, apiEndpoints } from "../../../services/apiClient";

import header from "../../../assets/Salesbill/Header.png"
import Right from "../../../assets/Salesbill/WNright.png";
import left from "../../../assets/Salesbill/Logo.png";
import stamp from "../../../assets/Salesbill/stamp.png";
import signature from "../../../assets/Salesbill/signature.png";
import Header from "../../../assets/Salesbill/Header.png";

const MonthlyPremiumReceipt = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await apiHelpers.getById(apiEndpoints.receipts.getprintmonth, id);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching receipt:", error);
        alert("Failed to load monthly receipt for printing");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-GB"); // DD-MM-YYYY
  };

  const formatMonthYear = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
    // Output: "December 2025"
  };

  if (loading) {
    return <div className="text-center py-20 text-xl font-semibold">Loading receipt...</div>;
  }

  if (!data || !data.receipt) {
    return <div className="text-center py-20 text-xl text-red-600 font-semibold">Receipt not found</div>;
  }

  const receipt = data.receipt;
  const doctor = receipt.payer?.entityId || {};

  // Payment mode ko friendly display mein convert karo
  const getPaymentModeDisplay = (method) => {
    if (!method) return "By Cash";
    const lower = method.toLowerCase();
    const map = {
      cash: "Cash",
      cheque: "Cheque",
      nach: "NACH",
      neft_rtgs: "NEFT/RTGS",
      online: "Online",
      other: "Other",
    };
    const friendly = map[lower] || method.toUpperCase();

    if (lower === "nach") {
      return "Monthly By NACH";
    }
    return `By ${friendly}`;
  };

  const paymentModeDisplay = getPaymentModeDisplay(receipt.paymentMethod);

  const template = {
    // doctorName: (receipt.payer.name || "N/A").toUpperCase(),
       doctorName: (doctor.fullName || "N/A").toUpperCase(),
    qualification: doctor.qualification || null,
    specialization: doctor.specialization?.join(", ") || "GENERAL PRACTITIONER",
    hospitalName: doctor.hospitalName || null,
    hospitalAddress: [
      doctor.hospitalAddress?.address || "",
      doctor.hospitalAddress?.city || "",
      doctor.hospitalAddress?.district || "",
      doctor.hospitalAddress?.state || "",
       "INDIA",
       doctor.hospitalAddress?.pinCode || ""
    ].filter(Boolean).join(", "),
    registrationNo: doctor.licenseNumber || doctor.doctorId || null,

    receiptNumber: receipt.receiptNumber || null,
    refNo: receipt.referenceNumber || null,
    receiptDate: formatDate(receipt.receiptDate),

    paymentModeDisplay,
    membershipDisplay: paymentModeDisplay.includes("NACH")
      ? "Monthly (By NACH)"
      : `Monthly (${paymentModeDisplay.replace("By ", "")})`,

    paymentDate: formatDate(receipt.paymentDate || receipt.receiptDate),
    chequeNo: receipt.bankDetails?.chequeNumber || null,
    chequeDate: receipt.bankDetails?.chequeDate ? formatDate(receipt.bankDetails.chequeDate) : null,
    drawnOn: receipt.drawnOnBank || null,

    amountPaid: receipt.monthlyPremium || receipt.amount || receipt.installmentAmount || 0,
    monthYear: formatMonthYear(receipt.receiptDate),

    description: receipt.remarks || null,
    date: formatDate(receipt.receiptDate),
  };

  // डॉक्टर डिटेल्स में केवल उन्हीं फ़ील्ड्स को शामिल करें जिनका डेटा है
  const doctorDetails = [
    { label: "Qualification", value: template.qualification },
    { label: "Specialization", value: template.specialization },
    { label: "Hospital Name", value: template.hospitalName },
    { label: "Hospital Address", value: template.hospitalAddress },
    { label: "Registration No", value: template.registrationNo },
    { label: "Membership", value: template.membershipDisplay }
  ].filter(item => item.value && item.value !== "--");

  // पेमेंट डिटेल्स में केवल उन्हीं फ़ील्ड्स को शामिल करें जिनका डेटा है
  const paymentDetails = [
    { 
      label: "Payment Mode", 
      value: template.paymentModeDisplay,
      alwaysShow: true // यह फ़ील्ड हमेशा दिखाई देगी
    },
    { 
      label: "Payment Date", 
      value: template.paymentDate,
      alwaysShow: true // यह फ़ील्ड हमेशा दिखाई देगी
    },
    { 
      label: "Cheque No.", 
      value: template.chequeNo,
      condition: () => template.paymentModeDisplay.toLowerCase().includes("cheque")
    },
    { 
      label: "Cheque Date", 
      value: template.chequeDate,
      condition: () => template.paymentModeDisplay.toLowerCase().includes("cheque")
    },
    // { 
    //   label: "Drawn On", 
    //   value: template.drawnOn,
    //   condition: () => template.paymentModeDisplay.toLowerCase().includes("cheque") && template.drawnOn
    // },
    {
  label: "Drawn On",
  value: template.drawnOn,
  condition: () =>
    template.drawnOn &&
    template.drawnOn.trim() !== ""
},
    { 
      label: "Amount Paid", 
      value: template.amountPaid ? `₹${template.amountPaid.toLocaleString("en-IN")}` : null,
      alwaysShow: true,
      isAmount: true
    },
    { 
      label: "For the Month of", 
      value: template.monthYear ? `PREMIUM OF ${template.monthYear}` : null,
      alwaysShow: true,
      isMonth: true
    },
    { 
      label: "Description", 
      value: template.description,
      alwaysShow: true
    }
  ].filter(item => {
    if (item.alwaysShow) return true;
    if (item.condition && !item.condition()) return false;
    return item.value && item.value !== "--" && item.value !== "null";
  });

  return (
    <>
      <div className="max-w-3xl border p-4 mx-auto bg-white print:max-w-full print:mx-0 print:p-4" style={{ fontFamily: "Arial, sans-serif" }}>
        {/* Red Top Border */}
        {/* <div className="h-2 bg-red-700"></div> */}

        {/* Header Logos */}
        <div className="flex justify-between items-start">
          {/* <img src={left} alt="Logo" className="w-48 h-auto mt-4" />
          <img src={Right} alt="Right Logo" className="w-100 h-auto" /> */}
       <img src={header} alt="" className="w-full h-[170px]" />
        </div>

        {/* Doctor Details + RECEIPT Title */}
        <div className="flex justify-between items-start border-t-2 border-b-2 border-gray-400 py-6 mb-8">
          <div className="text-sm leading-relaxed">
            <div className="font-bold text-lg mb-2">
              {template.doctorName}
              {template.receiptNumber && (
                <span className="text-gray-600 font-normal text-base">
                  {" "} | Receipt Number: {template.receiptNumber}
                </span>
              )}
            </div>
            
            {/* डॉक्टर डिटेल्स - केवल मौजूद डेटा दिखाएं */}
            {doctorDetails.map((detail, index) => (
              <div key={index}>
                <strong>{detail.label} :</strong> {detail.value}
              </div>
            ))}
           
          </div>
          <div className="text-right">
            <h1 className="text-5xl font-serif tracking-wider text-gray-800">RECEIPT</h1>
          </div>
        </div>

        {/* Ref No & Date - केवल तभी दिखाएं जब डेटा हो */}
        {(template.refNo || template.receiptDate) && (
          <div className="mb-8 text-sm">
            {template.refNo && `Ref No : ${template.refNo}`}
            {template.refNo && template.receiptDate && " / "}
            {template.receiptDate && `Receipt Date: ${template.receiptDate}`}
          </div>
        )}

        {/* Payment Details Table */}
        <table 
          className="max-w-2xl text-sm border border-gray-400 mb-8"
        >
          <tbody>
            {paymentDetails.map((detail, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4 font-semibold bg-gray-100 border-r w-1/3">
                  {detail.label}
                </td>
                <td className={`py-3 px-4 ${detail.isAmount ? 'font-bold text-lg' : ''} ${detail.isMonth ? 'font-bold text-lg text-teal-700' : ''}`}>
                  {detail.value || "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-xs text-gray-600 mb-8">*T&C Apply</div>

        {/* Footer */}
        <div className="px-8 pb-8">
          <div className="flex justify-end items-end gap-16">
            <div className="relative">
              <img src={stamp} alt="Stamp" className="w-40 h-40 opacity-90" />
            </div>
            <div className="text-center">
              <img src={signature} alt="Signature" className="w-48 h-auto mb-2" />
              <div className="font-semibold text-sm">SIGNATURE</div>
            </div>
          </div>

          <div className="mt-10 text-sm">
            {template.date && (
              <>
                <strong>Date :</strong> {template.date}
              </>
            )}
          </div>
          {/* <div className="mt-4 text-lg font-semibold">Thank you...!</div> */}
        </div>

        {/* Bottom Bar */}
        {/* <div className="h-3 bg-gray-800"></div> */}
      </div>

      {/* Print Button */}
      <div className="fixed bottom-4 right-4 print:hidden z-50">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2"
        >
          🖨️ Print Receipt
        </button>
      </div>
    </>
  );
};

export default MonthlyPremiumReceipt;



// src/pages/admin/receipts/MonthlyPremiumReceipt.jsx







// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { apiHelpers, apiEndpoints } from "../../../services/apiClient";

// import Right from "../../../assets/salesbill/WNright.png";
// import left from "../../../assets/salesbill/logo.png";
// import stamp from "../../../assets/salesbill/stamp.png";
// import signature from "../../../assets/salesbill/signature.png";

// const MonthlyPremiumReceipt = () => {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchReceipt = async () => {
//       try {
//         const response = await apiHelpers.getById(apiEndpoints.receipts.getprintmonth, id);
//         setData(response.data);
//       } catch (error) {
//         console.error("Error fetching receipt:", error);
//         alert("Failed to load monthly receipt for printing");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReceipt();
//   }, [id]);

//   const formatDate = (dateString) => {
//     if (!dateString) return null;
//     return new Date(dateString).toLocaleDateString("en-GB");
//   };

//   const formatMonthYear = (dateString) => {
//     if (!dateString) return null;
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", { month: "long", year: "numeric" });
//   };

//   const getPaymentModeDisplay = (method) => {
//     if (!method) return "By Cash";
//     const lower = method.toLowerCase();
//     const map = {
//       cash: "Cash",
//       cheque: "Cheque",
//       nach: "NACH",
//       neft_rtgs: "NEFT/RTGS",
//       online: "Online",
//       other: "Other",
//     };
//     const friendly = map[lower] || method.toUpperCase();

//     if (lower === "nach") {
//       return "Monthly By NACH";
//     }
//     return `By ${friendly}`;
//   };

//   if (loading) {
//     return <div className="text-center py-20 text-xl font-semibold">Loading receipt...</div>;
//   }

//   if (!data || !data.receipt) {
//     return <div className="text-center py-20 text-xl text-red-600 font-semibold">Receipt not found</div>;
//   }

//   const receipt = data.receipt;
//   const doctor = receipt.payer?.entityId || {};

//   const paymentModeDisplay = getPaymentModeDisplay(receipt.paymentMethod);

//   const template = {
//     doctorName: (receipt.payer.name || "N/A").toUpperCase(),
//     qualification: doctor.qualification || null,
//     specialization: doctor.specialization?.join(", ") || "GENERAL PRACTITIONER",
//     hospitalName: doctor.hospitalName || null,
//     hospitalAddress: [
//       doctor.hospitalAddress?.address || "",
//       doctor.hospitalAddress?.city || "",
//       doctor.hospitalAddress?.state || "",
//       doctor.hospitalAddress?.pinCode || "",
//       "INDIA"
//     ].filter(Boolean).join(", "),
//     registrationNo: doctor.licenseNumber || doctor.doctorId || null,
//     receiptNumber: receipt.receiptNumber || null,
//     refNo: receipt.referenceNumber || null,
//     receiptDate: formatDate(receipt.receiptDate),
//     paymentModeDisplay,
//     membershipDisplay: paymentModeDisplay.includes("NACH") 
//       ? "Monthly (By NACH)" 
//       : `Monthly (${paymentModeDisplay.replace("By ", "")})`,
//     paymentDate: formatDate(receipt.paymentDate || receipt.receiptDate),
//     chequeNo: receipt.bankDetails?.chequeNumber || null,
//     drawnOn: receipt.drawnOnBank || null,
//     amountPaid: receipt.monthlyPremium || receipt.amount || receipt.installmentAmount || 0,
//     monthYear: formatMonthYear(receipt.receiptDate),
//     description: receipt.remarks || null,
//     date: formatDate(receipt.receiptDate),
//   };

//   const doctorDetails = [
//     { label: "Qualification", value: template.qualification },
//     { label: "Specialization", value: template.specialization },
//     { label: "Hospital Name", value: template.hospitalName },
//     { label: "Hospital Address", value: template.hospitalAddress },
//     { label: "Registration No", value: template.registrationNo },
//     { label: "Membership", value: template.membershipDisplay }
//   ].filter(item => item.value && item.value !== "--");

//   const paymentDetails = [
//     { 
//       label: "Payment Mode", 
//       value: template.paymentModeDisplay,
//       alwaysShow: true
//     },
//     { 
//       label: "Payment Date", 
//       value: template.paymentDate,
//       alwaysShow: true
//     },
//     { 
//       label: "Cheque No.", 
//       value: template.chequeNo,
//       condition: () => template.paymentModeDisplay.toLowerCase().includes("cheque")
//     },
//     { 
//       label: "Drawn On", 
//       value: template.drawnOn,
//       condition: () => template.paymentModeDisplay.toLowerCase().includes("cheque") && template.drawnOn
//     },
//     { 
//       label: "Amount Paid", 
//       value: template.amountPaid ? `₹${template.amountPaid.toLocaleString("en-IN")}` : null,
//       alwaysShow: true,
//       isAmount: true
//     },
//     { 
//       label: "For the Month of", 
//       value: template.monthYear ? `PREMIUM OF ${template.monthYear}` : null,
//       alwaysShow: true,
//       isMonth: true
//     },
//     { 
//       label: "Description", 
//       value: template.description,
//       alwaysShow: true
//     }
//   ].filter(item => {
//     if (item.alwaysShow) return true;
//     if (item.condition && !item.condition()) return false;
//     return item.value && item.value !== "--" && item.value !== "null";
//   });

//   return (
//     <>
//       <div 
//         className="page-container mx-auto bg-white print:bg-white" 
//         style={{ 
//           fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//           maxWidth: '794px',
//           minHeight: '1123px',
//           padding: '20px',
//           margin: '0 auto',
//           boxSizing: 'border-box'
//         }}
//       >
//         {/* Red Top Border */}
//         <div className="h-1.5 bg-red-700 mb-6"></div>

//         {/* Header Logos */}
//         <div className="flex justify-between items-start mb-6">
//           <img 
//             src={left} 
//             alt="Logo" 
//             className="w-auto h-auto mt-6" 
//             // style={{ maxWidth: '150px' }}
//           />
//           <img 
//             src={Right} 
//             alt="Right Logo" 
//             className="w-auto h-auto" 
//             // style={{ maxWidth: '120px' }}
//           />
//         </div>

//         {/* Doctor Details + RECEIPT Title */}
//         <div className="flex justify-between items-start border-t border-b border-gray-300 py-4 mb-6">
//           <div className="text-xs leading-tight flex-1 pr-4">
//             <div className="font-bold text-base mb-1 flex items-center gap-2">
//               <span>{template.doctorName}</span>
//               {template.receiptNumber && (
//                 <span className="text-gray-600 font-normal text-sm">
//                   | Receipt: {template.receiptNumber}
//                 </span>
//               )}
//             </div>
            
//             {/* Compact Doctor Details */}
//             {doctorDetails.length > 0 && (
//               <div className="grid grid-cols-2 gap-y-1">
//                 {doctorDetails.map((detail, index) => (
//                   <div key={index} className={detail.label === "Hospital Address" ? "col-span-2" : ""}>
//                     <span className="font-medium">{detail.label}:</span> {detail.value}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           <div className="text-right flex-shrink-0">
//             <h1 className="text-3xl font-serif tracking-tight text-gray-800 font-bold">RECEIPT</h1>
//             <div className="text-xs text-gray-600 mt-1">
//               {template.refNo && `Ref: ${template.refNo}`}
//               {template.refNo && template.receiptDate && " | "}
//               {template.receiptDate && `Date: ${template.receiptDate}`}
//             </div>
//           </div>
//         </div>

//         {/* Payment Details Table */}
//         <div className="mb-6">
//           <table className="w-full text-sm border border-gray-300">
//             <tbody>
//               {paymentDetails.map((detail, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="py-2 px-3 font-semibold bg-gray-50 border-r w-2/5">
//                     {detail.label}
//                   </td>
//                   <td className={`py-2 px-3 ${detail.isAmount ? 'font-bold text-base text-green-700' : ''} ${detail.isMonth ? 'font-bold text-base text-teal-700' : ''}`}>
//                     {detail.value || "--"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="text-xs text-gray-500 mb-6 italic">*T&C Apply</div>

//         {/* Footer */}
//         <div className="mt-8">
//           <div className="flex justify-between items-end mt-12">
//             <div className="text-xs text-gray-700">
//               {template.date && (
//                 <div><strong>Date:</strong> {template.date}</div>
//               )}
//               <div className="mt-2 text-sm font-semibold">Thank you for your payment!</div>
//             </div>
            
//             <div className="flex items-end gap-8">
//               <div className="relative">
//                 <img 
//                   src={stamp} 
//                   alt="Stamp" 
//                   className="w-32 h-32 opacity-90"
//                   style={{ maxWidth: '130px' }}
//                 />
//               </div>
//               <div className="text-center">
//                 <img 
//                   src={signature} 
//                   alt="Signature" 
//                   className="w-36 h-auto mb-1"
//                   style={{ maxWidth: '140px' }}
//                 />
//                 <div className="font-semibold text-xs">AUTHORIZED SIGNATURE</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="h-1.5 bg-gray-800 mt-8"></div>
//       </div>

//       {/* Print Button */}
//       <div className="fixed bottom-4 right-4 print:hidden z-50">
//         <button
//           onClick={() => window.print()}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
//         >
//           🖨️ Print Receipt
//         </button>
//       </div>

//       {/* Print Styles */}
//       <style jsx>{`
//         @media print {
//           .page-container {
//             max-width: 100% !important;
//             margin: 0 !important;
//             padding: 15px !important;
//             min-height: 100vh !important;
//           }
//           body {
//             margin: 0;
//             padding: 0;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default MonthlyPremiumReceipt; 