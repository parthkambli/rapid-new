

import React from 'react';

const RenewalLetterExact = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans text-black">
      <div className="max-w-3xl mx-auto">
        
        {/* Main Letter */}
        <div className="bg-white border-2 border-black p-10 shadow-lg relative">
          
          {/* Header */}
          <div className="flex justify-between items-start pb-5 border-b-4 border-red-700 mb-10">
            <img src="/logo.png" alt="Logo" className="w-44" />
            <div className="text-right text-sm leading-tight">
              <strong className="text-lg text-red-700 block">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong>
              <span className="text-xs">www.rapidmedicolegal.in</span> | <span className="text-xs">rapidmedicolegal@gmail.com</span>
              <br />
              <span className="text-xs text-gray-600">360° Medicolegal Protection | An ISO 9001:2015 Certified Company</span>
            </div>
          </div>

          {/* Date */}
          <div className="text-right mb-6 font-bold">
            DATE: <span contentEditable className="bg-yellow-100 border border-dashed border-gray-400 px-1 ml-1">28/11/2025</span>
          </div>

          {/* To Address */}
          <div className="mb-8 text-sm leading-relaxed">
            <strong>To</strong><br />
            <div contentEditable className="bg-yellow-100 border border-dashed border-gray-400 inline-block px-1">Dr. [Doctor Name 1] & Dr. [Doctor Name 2]</div><br />
            <div contentEditable className="bg-yellow-100 border border-dashed border-gray-400 inline-block px-1">[Clinic/Hospital Name]</div><br />
            <div contentEditable className="bg-yellow-100 border border-dashed border-gray-400 inline-block px-1">[Address Line 1]</div><br />
            <div contentEditable className="bg-yellow-100 border border-dashed border-gray-400 inline-block px-1">[Address Line 2, City, State]</div><br />
            <div contentEditable className="bg-yellow-100 border border-dashed border-gray-400 inline-block px-1">Pin Code - [PIN]</div><br />
            <div contentEditable className="bg-yellow-100 border border-dashed border-gray-400 inline-block px-1">Contact No. - [Phone]</div>
          </div>

          {/* Welcome Again */}
          <div className="text-center text-xl font-bold my-6">
            Welcome Again!
          </div>

          {/* Body */}
          <div className="text-justify text-sm leading-7">
            <p>Dear Doctor,</p>
            <p className="mt-4">
              We are delighted to inform you that your membership with Rapid Medicolegal Services India Ltd. has been successfully renewed. Thank you for placing your trust in our services and continuing to be a valued member.
            </p>
            <p className="mt-4">
              Your renewed membership is now active from{' '}
              <span contentEditable className="bg-blue-100 px-1 rounded">01/12/2025</span> to{' '}
              <span contentEditable className="bg-blue-100 px-1 rounded">30/11/2026</span>. 
              We remain committed to providing you with reliable, expert medicolegal and risk management support whenever you need it.
            </p>
            <p className="mt-4">
              Your continued association inspires us to maintain the highest standards of service and ensure your complete satisfaction. Our team remains your primary point of contact for any questions or assistance.
            </p>
            <p className="mt-4">Thank you once again for staying with Rapid Medicolegal Services India Ltd.</p>
            <p className="mt-6 font-bold text-green-700">Stay with us, stay secure.</p>
          </div>

          {/* Closing */}
          <div className="mt-12 text-right">
            Yours faithfully,<br />
            <strong className="text-lg">Rapid Medicolegal Services India Ltd.</strong>
          </div>

          {/* Stamp + Signature */}
          <div className="flex justify-between items-end mt-16">
            <img src="/stamp.png" alt="Stamp" className="w-36 opacity-90" />
            <div className="text-right">
              <img src="/signature.png" alt="Signature" className="w-32" />
            </div>
          </div>

          {/* Footer Offices */}
          <div className="mt-16 pt-6 border-t border-gray-400 flex gap-6 text-xs">
            <div className="border border-black p-3 bg-gray-50 flex-1">
              <strong>Head & Corporate Office:</strong><br />
              No. 5 & 6, 3rd Floor, Star Tower, 1131, Panch Bungalow,<br />
              Shahupuri, Kolhapur, Maharashtra, India. 416001<br />
              Contact: 9421464275 | Tel: 0231-2664275
            </div>
            <div className="border border-black p-3 bg-gray-50 flex-1 text-xs leading-tight">
              <strong>Regional Office (MUMBAI):</strong><br />
              House No. 158, Anjie Master Building, No.7, Kasam Gidgil Marg,<br />
              Prabhadevi, Mumbai 400025. Contact: 942158425<br />
              <strong>SOLAPUR:</strong> 40, Sarvade Nagar, Mulegaon Road, Solapur, No.4, 1305.<br />
              Contact: 940573425 | 9105053425<br />
              <strong>DHARWAD:</strong> Mahadev Niwas, Training College Road, Behind K.C. Park,<br />
              Dharwad, Karnataka. 580008 Contact: 996544275<br />
              <strong>Other Branch:</strong> Goa, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu.
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => window.print()}
            className="px-10 py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-lg rounded"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Print CSS */}
      <style jsx>{`
        @media print {
          body { background: white !important; padding: 20px; }
          .min-h-screen { background: white !important; }
          button { display: none !important; }
          .bg-yellow-100, .bg-blue-100 { background: transparent !important; }
          .border-dashed { border: none !important; }
        }
      `}</style>
    </div>
  );
};

export default RenewalLetterExact;