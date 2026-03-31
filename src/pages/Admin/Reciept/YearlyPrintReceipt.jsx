



























// src/pages/admin/receipts/PrintPremiumReceipt.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiHelpers, apiEndpoints } from "../../../services/apiClient";

import Right from "../../../assets/Salesbill/WNright.png";
import left from "../../../assets/Salesbill/Logo.png";
import stamp from "../../../assets/Salesbill/stamp.png";
import signature from "../../../assets/Salesbill/signature.png";

const PrintPremiumReceipt = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        // Tumhara naya print endpoint
        const response = await apiHelpers.getById(apiEndpoints.receipts.getprintyear, id);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching receipt:", error);
        alert("Failed to load receipt for printing");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  // const formatDate = (dateString) => {
  //   if (!dateString) return "--";
  //   return new Date(dateString).toLocaleDateString("en-GB"); // DD-MM-YYYY
  // };



const formatDate = (isoString) => {
  if (!isoString) return "--";

  // ISO string ko directly parts mein tod do
  const [year, month, day] = isoString.split('T')[0].split('-');
  
  // Day aur month already DD aur MM format mein hote hain
  return `${day}-${month}-${year}`;
};


  if (loading) {
    return <div className="text-center py-20 text-xl font-semibold">Loading receipt...</div>;
  }

  if (!data || !data.receipt) {
    return <div className="text-center py-20 text-xl text-red-600 font-semibold">Receipt not found</div>;
  }

  const receipt = data.receipt;
  const membership = data.membership;
  const currentYearData = data.thisReceiptYearData;

  const doctor = receipt.payer.entityId || {};
  const payer = receipt.payer;

  // Template Data
  const template = {
    // doctorName: (doctor.fullName || "N/A").toUpperCase(),
    doctorName: (payer.name || "N/A").toUpperCase(),
    qualification: doctor.qualification || "--",
    specialization: doctor.specialization?.join(", ") || "GENERAL PRACTITIONER",
    hospitalName: doctor.hospitalName || "--",
    hospitalAddress: [
      doctor.hospitalAddress?.address || "",
      doctor.hospitalAddress?.city || "",
      doctor.hospitalAddress?.state || "",
      doctor.hospitalAddress?.pinCode || "",
      "INDIA"
    ].filter(Boolean).join(", "),
    registrationNo: doctor.licenseNumber || doctor.doctorId || "--",








    
    receiptNumber: receipt.receiptNumber || "--",
    refNo: receipt.referenceNumber || "--",
    receiptDate: formatDate(receipt.receiptDate),
    paymentMode: (receipt.paymentMethod || "CASH").toUpperCase(),
    paymentDate: formatDate(receipt.receiptDate),
    chequeNo: receipt.bankDetails?.chequeNumber || "--",
    // drawnOn: receipt.bankDetails?.bankName || receipt.drawnOnBank || "--",
    drawnOn: receipt.drawnOnBank || "--",
    paymentType: receipt.paymentType === "installment" ? "PART PAYMENT" : "FULL PAYMENT",
    amountPaid: receipt.installmentAmount || receipt.amount || 0,
    description: receipt.remarks || "----",
    date: formatDate(receipt.receiptDate),

    // Smart Next Installment
    showNextInstallment: membership?.showNextInstallment || false,
    nextInstallmentDate: receipt?.nextInstallmentDate 
      ? formatDate(receipt.nextInstallmentDate) 
      : "--",



membershipYearDisplay: (() => {
    // Year label from API
    const year = currentYearData?.yearLabel || "Yearly";

    // Payment method from receipt
    const method = receipt.paymentMethod || "cash";

    // Friendly name mapping
    const methodDisplay = {
      cash: "Cash",
      cheque: "Cheque",
      nach: "NACH",
      neft_rtgs: "NEFT/RTGS",
      online: "Online",
      other: "Other",
    }[method.toLowerCase()] || method.charAt(0).toUpperCase() + method.slice(1);

    // Special case for NACH → Monthly By NACH
    if (method.toLowerCase() === "nach") {
      return `${year} (Monthly By NACH)`;
    }

    // Normal case
    // return `${year} (By ${methodDisplay})`;
    return  ` Yearly `;
  })(),
      
  };

  return (
    <>
      <div className="max-w-3xl border p-4 mx-auto bg-white print:max-w-full print:mx-0 print:p-4" style={{ fontFamily: "Arial, sans-serif" }}>
        {/* Red Top Border */}
        <div className="h-2 bg-red-700"></div>

        {/* Header Logos */}
        <div className="">
          <div className="flex justify-between items-start">
            <img src={left} alt="Logo" className="w-48 h-auto mt-4" />
            <img src={Right} alt="Right Logo" className="w-100 h-auto" />
          </div>

          {/* Doctor Details + RECEIPT Title */}
          <div className="flex justify-between items-start border-t-2 border-b-2 border-gray-400 py-6 mb-8">
            <div className="text-sm leading-relaxed">
              <div className="font-bold text-lg mb-2">
                {template.doctorName}
                <span className="text-gray-600 font-normal text-base">
                  {" "} | Receipt Number: {template.receiptNumber}
                </span>
              </div>
              <div><strong>Qualification :</strong> {template.qualification}</div>
              <div><strong>Specialization :</strong> {template.specialization}</div>
              <div><strong>Hospital Name :</strong> {template.hospitalName}</div>
              <div><strong>Hospital Address :</strong> {template.hospitalAddress}</div>
              <div><strong>Registration No :</strong> {template.registrationNo}</div>
              <div><strong>Membership Year :</strong>  {template.membershipYearDisplay}</div>

              
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-serif tracking-wider text-gray-800">RECEIPT</h1>
            </div>
          </div>

          {/* Ref No & Date */}
          <div className="mb-8 text-sm">
            Ref No : {template.refNo} / Receipt Date: {template.receiptDate}
          </div>



          {/* Overall Membership Plan Summary */}
        
          {/* Current Year Status */}
        

          {/* Payment Details Table */}
          <table className="w-full text-sm border border-gray-400 mb-8">
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 font-semibold bg-gray-100 border-r w-1/3">Payment Mode</td>
                <td className="py-3 px-4">{template.paymentMode}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Payment Date</td>
                <td className="py-3 px-4">{template.paymentDate}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Cheque No.</td>
                <td className="py-3 px-4">{template.chequeNo}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Drawn On</td>
                <td className="py-3 px-4">{template.drawnOn}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Payment Type</td>
                <td className="py-3 px-4">{template.paymentType}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Amount Paid</td>
                <td className="py-3 px-4 font-bold text-lg">
                  ₹{template.amountPaid.toLocaleString("en-IN")}
                </td>
              </tr>

 <tr className="border-b">
                <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Balance</td>
                <td className="py-3 px-4 font-bold text-lg">
             
             {currentYearData.actualRemainingBalance <= 0 
  ? "0" 
  : `₹${(currentYearData.actualRemainingBalance ?? 0).toLocaleString("en-IN")}`}
                {/* {currentYearData.balanceForThisYear <= 0 ? "0" : `₹${currentYearData.balance.toLocaleString("en-IN")}`} */}
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Next Installment Date</td>
                <td className="py-3 px-4">{template.nextInstallmentDate}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Description</td>
                <td className="py-3 px-4">{template.description}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-xs text-gray-600 mb-8">*T&C Apply</div>
        </div>

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
            <strong>Date :</strong> {template.date}
          </div>
          <div className="mt-4 text-lg font-semibold">Thank you...!</div>
        </div>

        {/* Bottom Bar */}
        <div className="h-3 bg-gray-800"></div>
      </div>

      {/* Manual Print Button */}
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

export default PrintPremiumReceipt;





