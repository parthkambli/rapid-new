import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../services/apiClient";

import Right from "../../assets/salesbill/WNright.png";
import left from "../../assets/salesbill/logo.png";
import stamp from "../../assets/salesbill/stamp.png";
import signature from "../../assets/salesbill/signature.png";

const DoctorPrintMonthlyReceipt = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        // Try different endpoints in sequence to find the receipt data
        let response;
        let found = false;

        // Array of possible endpoints to try
        const endpointsToTry = [
          () => apiClient.get(`${apiEndpoints.receipts.getprintmonth(id)}`),
          () => apiClient.get(`${apiEndpoints.receipts.getprintyear(id)}`),
          () => apiClient.get(`${apiEndpoints.receipts.get(id)}`)
        ];

        for (const endpointFunc of endpointsToTry) {
          try {
            response = await endpointFunc();

            // Check if the response has data and is successful
            if (response && response.data) {
              // Check if it's a standard API response with success field
              if (response.data.success !== undefined) {
                if (response.data.success) {
                  // Success response - we found the receipt
                  found = true;
                  break;
                } else {
                  // This endpoint returned a failure, try the next one
                  continue;
                }
              } else {
                // This looks like a direct response (possibly from print endpoints), consider it found
                found = true;
                break;
              }
            }
          } catch (error) {
            console.warn(`Endpoint failed, trying next:`, error.message);
            continue; // Try the next endpoint
          }
        }

        if (!found) {
          throw new Error('All receipt endpoints failed or receipt not found/access denied');
        }

        // Handle different response structures based on which endpoint worked
        let receiptData = null;

        // First, check if it's a standard API response with success field
        if (response.data.success !== undefined) {
          if (response.data.success) {
            // It's a standard API response
            receiptData = response.data.data || response.data.receipt || response.data;
          } else {
            throw new Error(response.data.message || 'Receipt not found');
          }
        }
        // Check if it's a print endpoint response with receipt inside
        else if (response.data.receipt) {
          receiptData = response.data.receipt;
        }
        // Check if the entire response is the receipt data
        else {
          receiptData = response.data;
        }

        // If we still don't have receipt data, try to extract from common properties
        if (!receiptData) {
          // Try common property names where receipt data might be stored
          const possibleProps = ['receipt', 'data', 'result', 'details', 'info'];
          for (const prop of possibleProps) {
            if (response.data[prop] && typeof response.data[prop] === 'object') {
              receiptData = response.data[prop];
              break;
            }
          }
        }

        // If still no receipt data, use the whole response as a fallback
        if (!receiptData) {
          receiptData = response.data;
        }

        if (!receiptData || Object.keys(receiptData).length === 0) {
          throw new Error('Receipt data is empty or could not be parsed');
        }

        setData(receiptData);
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
    if (!dateString) return "--";
    return new Date(dateString).toLocaleDateString("en-GB"); // DD-MM-YYYY
  };

  const formatMonthYear = (dateString) => {
    if (!dateString) return "--";
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

  // Handle different data structures
  const receipt = data.receipt || data;
  const doctor = receipt.payer?.entityId || receipt.entityId || {};
  const payer = receipt.payer || {};
  const entity = payer.entityId || {};

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
    doctorName: (receipt.payer?.name || entity.fullName || doctor.fullName || "N/A").toUpperCase(),
    qualification: entity.qualification || doctor.qualification || "--",
    specialization: entity.specialization?.join(", ") || doctor.specialization?.join(", ") || "GENERAL PRACTITIONER",
    hospitalName: entity.hospitalName || doctor.hospitalName || "--",
    hospitalAddress: [
      entity.hospitalAddress?.address || doctor.hospitalAddress?.address || entity.address || doctor.address || "",
      entity.hospitalAddress?.city || doctor.hospitalAddress?.city || entity.city || doctor.city || "",
      entity.hospitalAddress?.state || doctor.hospitalAddress?.state || entity.state || doctor.state || "",
      entity.hospitalAddress?.pinCode || doctor.hospitalAddress?.pinCode || entity.pinCode || doctor.pinCode || "",
      "INDIA"
    ].filter(Boolean).join(", "),
    registrationNo: entity.licenseNumber || entity.doctorId || doctor.licenseNumber || doctor.doctorId || "--",

    receiptNumber: receipt.receiptNumber || receipt.receiptId || receipt._id || "--",
    refNo: receipt.referenceNumber || receipt.refNo || "--",
    receiptDate: formatDate(receipt.receiptDate),

    paymentModeDisplay,
    membershipDisplay: paymentModeDisplay.includes("NACH")
      ? "Monthly (By NACH)"
      : `Monthly (${paymentModeDisplay.replace("By ", "")})`,

    paymentDate: formatDate(receipt.paymentDate || receipt.receiptDate),
    chequeNo: receipt.bankDetails?.chequeNumber || receipt.chequeNo || "--",
    drawnOn: receipt.drawnOnBank || receipt.bankDetails?.bankName || "--",

    amountPaid: receipt.monthlyPremium || receipt.amount || receipt.installmentAmount || 0,
    monthYear: formatMonthYear(receipt.receiptDate),

    description: receipt.remarks || receipt.remark || "----",
    date: formatDate(receipt.receiptDate),
  };

  return (
    <>
      <div className="max-w-3xl border p-4 mx-auto bg-white print:max-w-full print:mx-0 print:p-4" style={{ fontFamily: "Arial, sans-serif" }}>
        {/* Red Top Border */}
        <div className="h-2 bg-red-700"></div>

        {/* Header Logos */}
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
            <div><strong> Membership : </strong> {template.membershipDisplay}</div>
          </div>
          <div className="text-right">
            <h1 className="text-5xl font-serif tracking-wider text-gray-800">RECEIPT</h1>
          </div>
        </div>

        {/* Ref No & Date */}
        <div className="mb-8 text-sm">
          Ref No : {template.refNo} / Receipt Date: {template.receiptDate}
        </div>

        {/* Payment Details Table */}
        <table className="w-full text-sm border border-gray-400 mb-8">
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4 font-semibold bg-gray-100 border-r w-1/3">Payment Mode</td>
              <td className="py-3 px-4 font-medium">{template.paymentModeDisplay}</td>
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
              <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Amount Paid</td>
              <td className="py-3 px-4 font-bold text-lg">
                ₹{(template.amountPaid ?? 0).toLocaleString("en-IN")}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-semibold bg-gray-100 border-r">For the Month of</td>
              <td className="py-3 px-4 font-bold text-lg text-teal-700">PREMIUM OF {template.monthYear}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold bg-gray-100 border-r">Description</td>
              <td className="py-3 px-4">{template.description}</td>
            </tr>
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
            <strong>Date :</strong> {template.date}
          </div>
          <div className="mt-4 text-lg font-semibold">Thank you...!</div>
        </div>

        {/* Bottom Bar */}
        <div className="h-3 bg-gray-800"></div>
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

export default DoctorPrintMonthlyReceipt;