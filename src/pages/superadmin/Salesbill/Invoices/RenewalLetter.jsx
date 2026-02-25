

import React from 'react';

const RenewalContractLetter = () => {
  return (
    <>
      {/* Dashboard mein fit hone wala container */}
      <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg relative font-serif text-black">

        {/* HEADER — bilkul wahi jo tune pasand kiya tha */}
        <div className="border-b-4 border-red-700 flex justify-between items-start mb-6 pb-2 print:fixed print:top-0 print:left-0 print:right-0 print:bg-white print:z-50 print:h-[95px] print:px-10 print:pt-4">
          <img src="/logo.png" alt="Logo" className="h-16" />
          <div className="text-right text-xs leading-tight">
            <strong className="block text-lg text-red-700">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong>
            www.rapidmedicolegal.in | rapidmedicolegal@gmail.com<br />
            <span className="text-[9pt] text-gray-600">360° Medicolegal Protection | An ISO 9001:2015 Certified Company</span>
          </div>
        </div>

        {/* MAIN CONTENT — bilkul original HTML wala (same to same) */}
        <div className="mt-4 text-[13pt] leading-7">

          <div className="text-right font-bold mb-6">
            Date: <span className="bg-yellow-100 px-2 border border-dashed border-gray-600" contentEditable suppressContentEditableWarning>29 NOVEMBER 2025</span>
          </div>

          <div className="text-center text-2xl font-bold border-b border-gray-400 pb-2 mb-6">
            Service Contract Renewal Letter
          </div>

          <div className="mb-6 leading-8 pl-1">
            <strong>TO,</strong><br /><br />
            <span className="bg-yellow-100 px-2 border border-dashed border-gray-600 inline-block" contentEditable suppressContentEditableWarning>DR PRAMOD SHINGARE, DR PRAVIN SHINGARE & DR APARNA SHINGARE</span><br />
            <span className="bg-yellow-100 px-2 border border-dashed border-gray-600 inline-block" contentEditable suppressContentEditableWarning>SHINGARE SKIN & COSMETIC CLINIC,</span><br />
            <span className="bg-yellow-100 px-2 border border-dashed border-gray-600 inline-block" contentEditable suppressContentEditableWarning>NEAR S. T. STAND, IN FRONT OF RAJARAM CHITRA MANDIR,</span><br />
            <span className="bg-yellow-100 px-2 border border-dashed border-gray-600 inline-block" contentEditable suppressContentEditableWarning>ABOVE KALYANI BAZAR, SHOP NO. 6, PETH VADGAON PIN-416112</span>
          </div>

          <div className="text-center font-bold mb-6">Subject: – Service contract renewal letter</div>

          <p className="text-justify indent-8 mb-6">
            This letter is to remind you that our service contract is about to expire on <span className="bg-yellow-100 px-1" contentEditable suppressContentEditableWarning>01 AUGUST 2025</span>. Rapid Medicolegal Services India Ltd. has been serving you with top-notch Services for <strong>ONE</strong> year. Our services have been extended to all your Medico legal & Risk Management Services.
          </p>
          <p className="text-justify indent-8 mb-10">
            You continue to our Medico legal & Risk Management Services renewing the contract.
          </p>

          <h3 className="border-l-4 border-red-700 pl-3 font-bold mb-4 text-[13pt]">MEMBERSHIP DETAILS :</h3>

          <table className="w-full border-collapse border-2 border-black text-[11.5pt] mb-8">
            <tbody>
              <tr>
                <th className="bg-yellow-300 border border-black p-2 text-center font-bold">ID Number</th>
                <td className="border border-black p-2">RML-10593</td>
                <th className="bg-yellow-300 border border-black p-2 text-center font-bold">Insurance Co.</th>
                <td className="border border-black p-2">ICICI LOMBARD GIC LTD.</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Specialization</td>
                <td className="border border-black p-2">BAMS/MD(AYU) & BHMS, FCHD</td>
                <td className="border border-black p-2 font-bold">Insurance Type</td>
                <td className="border border-black p-2">PROFESSIONAL INDEMNITY</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Member Category</td>
                <td colSpan="3" className="border border-black p-2">INDIVIDUAL + HOSPITAL MEMBERSHIP (COVERAGE TO ALL OVER INDIA + ALL COVERAGE OF VISITING QUALIFIED/UNQUALIFIED STAFF)</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Membership Period</td>
                <td className="border border-black p-2">1 YEAR</td>
                <td className="border border-black p-2 font-bold">Indemnity Cover</td>
                <td className="border border-black p-2">50 LAKH FOR EACH DOCTOR</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Type of Service</td>
                <td className="border border-black p-2">SERVICE + INDEMNITY</td>
                <td className="border border-black p-2 font-bold">Service charge</td>
                <td className="border border-black p-2">10000/-</td>
              </tr>
            </tbody>
          </table>

          <h3 className="border-l-4 border-red-700 pl-3 font-bold mb-4 text-[13pt]">Your new charges as below:</h3>

          <table className="w-full border-collapse border-2 border-black text-[11.5pt] mb-8">
            <thead>
              <tr>
                <th className="bg-yellow-300 border border-black p-3 text-center">PERTICULAR</th>
                <th className="bg-yellow-300 border border-black p-3 text-center">INDEMNITY COVER</th>
                <th className="bg-yellow-300 border border-black p-3 text-center">Monthly</th>
                <th className="bg-yellow-300 border border-black p-3 text-center">1 YEARS</th>
                <th className="bg-yellow-300 border border-black p-3 text-center">5 YEARS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-3">INDIVIDUAL-HOSPITAL MEMBERSHIP (COVERAGE TO ALL OVER INDIA + ALL COVERAGE OF VISITING QUALIFIED/UNQUALIFIED STAFF)</td>
                <td className="border border-black p-3 text-center">50 Lakh</td>
                <td className="border border-black p-3 text-center font-bold text-lg">999/-</td>
                <td className="border border-black p-3 text-center font-bold text-lg">10,000/-</td>
                <td className="border border-black p-3 text-center font-bold text-lg">50,000/-</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-red-50 border-2 border-red-700 p-4 my-8 font-bold text-red-700 rounded shadow">
            <strong>NOTE :</strong> We provide 50 Lakh doctor professional Indemnity for DR. PRAMOD SHINGARE,<br />
            50 Lakh for DR PRAVIN SHINGARE and 50 Lakh for DR. APARNA SHINGARE.
          </div>

          <div className="text-left text-green-700 font-bold text-lg tracking-widest my-10">
            STAY WITH US STAY SECURE
          </div>

          <p className="mb-6">You can pay on below bank details or using QR :</p>

          <div className="flex gap-6 mb-10">
            <div className="flex-1 bg-gray-100 p-5 font-mono text-sm border-2 border-dashed border-red-700 rounded">
              <strong>BANK DETAILS :</strong><br />
              NAME : RAPID MEDICOLLEGAL SERVICES<br />
              BANK NAME – ICICI BANK<br />
              BRANCH – RAJARAMPURI, KOLHAPUR<br />
              A/C NO. – <span className="bg-yellow-100 px-1" contentEditable suppressContentEditableWarning>016605017904</span><br />
              IFSC – <span className="bg-yellow-100 px-1" contentEditable suppressContentEditableWarning>ICIC0000166</span>
            </div>
            <div className="w-32 h-32 border-2 border-dashed border-black flex items-center justify-center text-center font-bold text-sm rounded bg-white">
              QR Code<br />for Payment
            </div>
          </div>

          <div className="text-red-700 font-bold mt-10">
            Regards,<br />
            <strong className="text-lg">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong><br />
            24 x 7 ALL INDIA HELP LINE NO.<br />
            +91-9422584275, +91-9421584275, +91-9405734275, +91-9665444275
          </div>
        </div>

        {/* FOOTER — bilkul wahi jo tune pasand kiya tha */}
        <div className="mt-10 border-t border-gray-400 flex justify-between items-start text-[8.5pt] leading-tight print:fixed print:bottom-0 print:left-0 print:right-0 print:bg-white print:z-50 print:h-[75px] print:px-10 print:pt-2">
          <div className="w-[48%] border border-black p-2 bg-gray-100">
            <strong>Head & Corporate Office:</strong><br />
            (KOLHAPUR) E-51/9/2, 3rd Floor, Opp. CBS, Kolhapur, Maharashtra, India. 416001<br />
            Contact: +91-9421464275 | Helpline No. +91-9422584275
          </div>
          <div className="w-[48%] border border-black p-2 bg-gray-100 text-right">
            <div className="text-red-700 font-bold">Page 1 of 1</div>
            <div className="mt-1">
              <strong>Regional Office (MUMBAI):</strong> House No.158, Anaje Master Building, No.7,<br />
              Kasasheb Gadgil Marg, Prabhadevi, Mumbai 400025.<br />
              <strong>Other Branch:</strong> Goa, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu.
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="text-center mt-6 print:hidden">
          <button onClick={() => window.print()} className="px-10 py-3 bg-red-700 hover:bg-red-800 text-white text-lg font-bold rounded">
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-yellow-100 { background-color: #ffffe0 !important; }
          .bg-yellow-300 { background-color: #fef9c3 !important; }
          .bg-red-50 { background-color: #fef2f2 !important; }
          .border-red-700 { border-color: #c00 !important; }
          .text-red-700 { color: #c00 !important; }
          button { display: none !important; }
        }
        body { font-family: 'Times New Roman', Times, serif; }
      `}</style>
    </>
  );
};

export default RenewalContractLetter;