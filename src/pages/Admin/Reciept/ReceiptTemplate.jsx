import React from 'react';

const ReceiptTemplate = ({ receipt, type = "monthly" }) => {
  if (!receipt) return <div>Loading receipt...</div>;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatAmount = (amount) => {
    return `₹${parseInt(amount).toLocaleString('en-IN')}/-`;
  };

  return (
    <div className="bg-white p-8 w-[210mm] h-[297mm] mx-auto shadow-lg print:shadow-none print:p-0 font-sans">
      {/* Company Header */}
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-2xl font-bold uppercase mb-2 tracking-wider">RAPID MEDICOLEGAL</h1>
        <div className="text-sm space-y-1">
          <p className="font-semibold">Rapid Medicolegal Services India Ltd</p>
          <p>Head & Corporate Office - Office No. 5 & 6, 3rd Floor, Star Tower</p>
          <p>1113/1, Panch Bunglow, Shahupuri, Kolhapur, Maharashtra, India. Pin - 416001</p>
          <p>rapidmedicolegal@gmail.com</p>
          <p>+91 942 2584 275, +91 942 1464 275, Landline : 0231-2664275</p>
        </div>
      </div>

      {/* Doctor Details */}
      <div className="border-t-2 border-b-2 border-gray-800 py-3 mb-4">
        <div className="space-y-1 text-sm">
          <p className="font-bold text-lg">{receipt.customer.name} | Receipt Number : {receipt.receiptNumber}</p>
          <p><span className="font-semibold">Qualification :</span> {receipt.customer.qualification || "BAMS, EMS"}</p>
          <p><span className="font-semibold">Specialization :</span> {receipt.customer.specialization || "GENERAL PRACTITIONER"}</p>
          <p><span className="font-semibold">Hospital Name :</span> {receipt.customer.hospitalName || "SANKALP CLINIC"}</p>
          <p><span className="font-semibold">Hospital Address :</span> {receipt.customer.address?.address || "IN FRONT OF PANCHGANGA HOSPITAL, SHUKRAVAR PETH, KOLHAPUR, MAHARASHTRA, INDIA"}</p>
          <p><span className="font-semibold">Registration No :</span> {receipt.customer.registrationNo || "I-106429-A-1, 2023"}</p>
          <p><span className="font-semibold">Membership Year :</span> {type === "monthly" ? "Monthly(By NACH)" : "Yearly"}</p>
        </div>
      </div>

      {/* RECEIPT Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold underline">RECEIPT</h2>
      </div>

      {/* Reference Details */}
      <div className="mb-6 text-sm">
        <p className="font-semibold">
          Ref No: {receipt.referenceNumber || "RML-10633"} / Receipt Date: {formatDate(receipt.paymentDate)}
        </p>
      </div>

      {/* Payment Details Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-800 text-sm">
          <tbody>
            <tr className="border border-gray-800">
              <td className="border border-gray-800 p-2 font-semibold w-1/3">Payment Mode</td>
              <td className="border border-gray-800 p-2 uppercase">{receipt.paymentMethod}</td>
            </tr>
            <tr className="border border-gray-800">
              <td className="border border-gray-800 p-2 font-semibold">Payment Date</td>
              <td className="border border-gray-800 p-2">{formatDate(receipt.paymentDate)}</td>
            </tr>
            {receipt.paymentMethod === 'cheque' && receipt.referenceNumber && (
              <tr className="border border-gray-800">
                <td className="border border-gray-800 p-2 font-semibold">Cheque No.</td>
                <td className="border border-gray-800 p-2">{receipt.referenceNumber}</td>
              </tr>
            )}
            <tr className="border border-gray-800">
              <td className="border border-gray-800 p-2 font-semibold">Amount Paid</td>
              <td className="border border-gray-800 p-2 font-bold">{formatAmount(receipt.amount)}</td>
            </tr>
            {type === "monthly" && (
              <tr className="border border-gray-800">
                <td className="border border-gray-800 p-2 font-semibold">Month</td>
                <td className="border border-gray-800 p-2">PREMIUM OF {new Date().toLocaleString('en', { month: 'long' }).toUpperCase()}</td>
              </tr>
            )}
            {type === "yearly" && receipt.installmentAmount && (
              <>
                <tr className="border border-gray-800">
                  <td className="border border-gray-800 p-2 font-semibold">Payment Type</td>
                  <td className="border border-gray-800 p-2">PART PAYMENT</td>
                </tr>
                <tr className="border border-gray-800">
                  <td className="border border-gray-800 p-2 font-semibold">Balance Amount</td>
                  <td className="border border-gray-800 p-2">{formatAmount(receipt.balanceAmount || "5000")}</td>
                </tr>
                <tr className="border border-gray-800">
                  <td className="border border-gray-800 p-2 font-semibold">Next Installment Date</td>
                  <td className="border border-gray-800 p-2">{formatDate(receipt.nextInstallmentDate)}</td>
                </tr>
              </>
            )}
            <tr className="border border-gray-800">
              <td className="border border-gray-800 p-2 font-semibold">Description</td>
              <td className="border border-gray-800 p-2">{receipt.remarks || "----"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-12 text-sm">
        <p className="mb-4">*T&C Apply</p>
        <div className="flex justify-between items-end">
          <div>
            <p>Date : {formatDate(receipt.paymentDate)}</p>
            <p className="mt-2">Thank you...!</p>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-800 pt-1 w-32 mx-auto">
              <p className="font-semibold">SIGNATURE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTemplate;