
// import React from 'react';

// const WelcomeLetter = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans text-black">
//       <div className="max-w-3xl mx-auto">

//         {/* Main Letter - EXACT SAME DESIGN */}
//         <div className="bg-white border-2 border-black p-10 shadow-lg relative">

//           {/* Header */}
//           <div className="flex justify-between items-start pb-5 border-b-4 border-red-700 mb-10">
//             <img src="/logo.png" alt="Logo" className="w-44" />
//             <div className="text-right text-sm leading-tight">
//               <strong className="text-lg text-red-700 block">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong>
//               <span className="text-xs">www.rapidmedicolegal.in</span> | <span className="text-xs">rapidmedicolegal@gmail.com</span>
//               <br />
//               <span className="text-xs text-gray-600">360° Medicolegal Protection | An ISO 9001:2015 Certified Company</span>
//             </div>
//           </div>

//           {/* Date */}
//           <div className="text-right mb-6 font-bold">
//             DATE - <span className="ml-2 underline">28/11/2025</span>
//           </div>

//           {/* To Address - Real Data */}
//           <div className="mb-8 text-sm leading-relaxed">
//             <strong>To</strong><br /><br />
//             <strong>DR VISHAL NAIK & DR SAGAR NAIK</strong><br />
//             <strong>DR. NAIK MATERNITY, SURGERY AND LAPAROSCOPIC CENTER</strong><br />
//             37 B TULJABHAVANI HSG. SCO. SANEGURUJI VASAHAT,<br />
//             RADHANAGRI ROAD, KOLHAPUR, MAHARASHTRA, INDIA,<br />
//             Pin Code - 416012<br />
//             CONTACT NO. - 982219967
//           </div>

//           {/* Welcome Title */}
//           <div className="text-center text-2xl font-bold my-8 text-red-700">
//             Welcome to Rapid Medicolegal Services India Ltd.
//           </div>

//           {/* Letter Body */}
//           <div className="text-justify text-sm leading-7">
//             <p>Dear Doctor,</p>

//             <p className="mt-4">
//               We are delighted to welcome you as a valued Member of Rapid Medicolegal Services India Ltd. We are honored to have earned your trust and are confident that our association will bring you complete peace of mind in every aspect of medicolegal and risk management support.
//             </p>

//             <p className="mt-4">
//               At Rapid Medicolegal Services India Ltd., we take great pride in offering our members responsive, reliable, and expert services tailored exclusively for medical professionals. Your satisfaction and security are our top priorities, and we are committed to standing beside you at every step of your professional journey.
//             </p>

//             <p className="mt-4">
//               As your primary point of contact for all medicolegal and risk management matters, our team is always available to assist you with dedication and efficiency. We encourage you to reach out to us anytime with your queries, feedback, or suggestions — your inputs help us serve you even better.
//             </p>

//             <p className="mt-6">
//               Thank you for becoming a part of the Rapid family.<br />
//               Together, we will continue to uphold professional excellence and legal security for the medical community.
//             </p>

//             <p className="mt-8 font-bold text-green-700 text-lg">
//               Stay with us, stay secure.
//             </p>
//           </div>

//           {/* Closing */}
//           <div className="mt-16 text-left">
//             Yours Faithfully,<br /><br /><br />
//             <strong className="text-lg">Rapid Medicolegal Services India Ltd.</strong>
//           </div>

//           {/* Stamp + Signature */}
//           <div className="flex justify-between items-end mt-12">
//             <img src="/stamp.png" alt="Stamp" className="w-36 opacity-90" />
//             <div className="text-right">
//               <img src="/signature.png" alt="Signature" className="w-32" />
//             </div>
//           </div>

//           {/* Footer Offices - Exact Same Two Boxes */}
//           <div className="mt-16 pt-6 border-t border-gray-400 flex gap-6 text-xs leading-tight">
//             <div className="border border-black p-3 bg-gray-50 flex-1">
//               <strong>Head & Corporate Office (KOLHAPUR Office)</strong><br />
//               No. 5 & 6, 3rd Floor, Star Tower, 1131/1, Panch bungalow,<br />
//               Shahupuri, Kolhapur, Maharashtra, India. 416001<br />
//               Contact: +91-9421464275
//             </div>
//             <div className="border border-black p-3 bg-gray-50 flex-1">
//               <strong>Regional Office (MUMBAI)</strong><br />
//               House No.158, Ananjie Master Building, No-7, Kasasheb Gadgil Marg,<br />
//               Prabhadevi, Mumbai 400025. Contact: +91-9421584275<br /><br />
//               <strong>SOLAPUR | DHARWAD |</strong> Other Branch: Goa, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu.
//             </div>
//           </div>
//         </div>

//         {/* Print Button */}
//         <div className="text-center mt-10">
//           <button
//             onClick={() => window.print()}
//             className="px-10 py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-lg rounded"
//           >
//             Print / Save as PDF
//           </button>
//         </div>
//       </div>

//       {/* Print CSS */}
//       <style jsx>{`
//         @media print {
//           body, .min-h-screen { background: white !important; margin: 0; padding: 20px; }
//           button { display: none !important; }
//           .shadow-lg { box-shadow: none !important; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default WelcomeLetter;















import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../../../services/apiClient';
import { toast } from 'react-toastify';

import Logo from '../../../../assets/Salesbill/Logo.png';
import stamp from '../../../../assets/Salesbill/stamp.png';
import signature from '../../../../assets/Salesbill/signature.png';

const WelcomeLetter = () => {
  const { id } = useParams(); // bill ID from URL
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      if (!id) {
        toast.error("Invalid link");
        return;
      }

      try {
        setLoading(true);
        const res = await apiClient.get(apiEndpoints.salesBills.get(id));

        if (res.data.success) {
          setBill(res.data.data);
          // Auto print after 1 second
          setTimeout(() => window.print(), 1200);
        } else {
          toast.error("Bill not found");
          navigate("/admin/salesbill/list");
        }
      } catch (err) {
        toast.error("Failed to load welcome letter");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold text-gray-600">
        Preparing Welcome Letter...
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="text-center py-20 text-3xl text-red-600">
        Welcome Letter Not Found!
      </div>
    );
  }

  const client = bill.client;
  const entity = client?.entityId || {};

  // Doctor Name(s)
  const doctorNames = entity.fullName 
    ? entity.fullName.includes("&") 
      ? entity.fullName 
      : `Dr. ${entity.fullName}`
    : "Valued Doctor";

  // Hospital / Clinic Name
  const hospitalName = entity.hospitalName || entity.fullName || "Clinic/Hospital";

  // Full Address
  const address = entity.hospitalAddress || entity.address || {};
  const addressLine1 = address.address || "";
  const addressLine2 = `${address.city || ""}${address.city && address.state ? ", " : ""}${address.state || ""}`;
  const pinCode = address.pinCode || "";
  const phone = entity.phoneNumber || entity.whatsappNumber || "N/A";

  // Date
  const letterDate = new Date(bill.billDate).toLocaleDateString('en-GB');

  return (
    <div className="min-h-screen  py-10 px-4 font-sans text-black">
      <div className="max-w-3xl mx-auto">

        {/* Main Letter */}
        <div className="bg-white border-2 border-black p-10 shadow-lg relative">

          {/* Header */}
          <div className="flex justify-between items-start pb-5 border-b-4 border-red-700 mb-10">
            <img src={Logo} alt="Logo" className="w-44" />
            <div className="text-right text-sm leading-tight">
              <strong className="text-lg text-red-700 block">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong>
              <span className="text-xs">www.rapidmedicolegal.in</span> | <span className="text-xs">rapidmedicolegal@gmail.com</span>
              <br />
              <span className="text-xs text-gray-600">360° Medicolegal Protection | An ISO 9001:2015 Certified Company</span>
            </div>
          </div>

          {/* Date */}
          <div className="text-right mb-6 font-bold">
            DATE - <span className="ml-2 underline">{letterDate}</span>
          </div>

          {/* To Address - DYNAMIC */}
          <div className="mb-8 text-sm leading-relaxed">
            <strong>To</strong><br /><br />
            <strong>{doctorNames.toUpperCase()}</strong><br />
            <strong>{hospitalName.toUpperCase()}</strong><br />
            {addressLine1 && <>{addressLine1.toUpperCase()}<br /></>}
            {addressLine2 && <>{addressLine2.toUpperCase()}<br /></>}
            {pinCode && <>Pin Code - {pinCode}<br /></>}
            CONTACT NO. - {phone}
          </div>

          {/* Welcome Title */}
          <div className="text-center text-2xl font-bold my-8 text-red-700">
            Welcome to Rapid Medicolegal Services India Ltd.
          </div>

          {/* Letter Body */}
          <div className="text-justify text-sm leading-7">
            <p>Dear Doctor,</p>

            <p className="mt-4">
              We are delighted to welcome you as a valued Member of Rapid Medicolegal Services India Ltd. We are honored to have earned your trust and are confident that our association will bring you complete peace of mind in every aspect of medicolegal and risk management support.
            </p>

            <p className="mt-4">
              At Rapid Medicolegal Services India Ltd., we take great pride in offering our members responsive, reliable, and expert services tailored exclusively for medical professionals. Your satisfaction and security are our top priorities, and we are committed to standing beside you at every step of your professional journey.
            </p>

            <p className="mt-4">
              As your primary point of contact for all medicolegal and risk management matters, our team is always available to assist you with dedication and efficiency. We encourage you to reach out to us anytime with your queries, feedback, or suggestions — your inputs help us serve you even better.
            </p>

            <p className="mt-6">
              Thank you for becoming a part of the Rapid family.<br />
              Together, we will continue to uphold professional excellence and legal security for the medical community.
            </p>

            <p className="mt-8 font-bold text-green-700 text-lg">
              Stay with us, stay secure.
            </p>
          </div>

          {/* Closing */}
          {/* <div className="mt-16 text-left">
            Yours Faithfully,<br /><br /><br />
            <strong className="text-lg">Rapid Medicolegal Services India Ltd.</strong>
          </div> */}

          {/* Stamp + Signature */}
          {/* <div className="flex justify-between items-end mt-12">
            <img src={stamp} alt="Stamp" className="w-36 opacity-90" />
            <div className="text-right">
              <img src={signature} alt="Signature" className="w-32" />
            </div>
          </div> */}



          {/* Closing Section - EXACTLY as per your screenshot */}
<div className="mt-20 relative">

  {/* Yours faithfully + Company Name - Right aligned, below signature */}
  <div className="absolute right-0 top-24 text-right leading-relaxed">
    <div className="font-medium">Yours faithfully,</div>
    <div className="mt-8 font-bold text-sm">
      Rapid Medicolegal Services India Ltd.
    </div>
  </div>

  {/* Stamp (Left) + Signature (Right) */}
  <div className="flex justify-between items-start">
    {/* Company Stamp - Left */}
    <div>
      <img 
        src={stamp} 
        alt="Company Stamp" 
        className="w-32 opacity-95" 
      />
    </div>

    {/* Signature - Right */}
    <div className="text-right">
      <img 
        src={signature} 
        alt="Signature" 
        className="w-36 inline-block" 
      />
      <div className="mt-2 text-sm font-medium text-gray-700">
        Authorised Signatory
      </div>
    </div>
  </div>

</div>

          {/* Footer Offices */}
          <div className="mt-16 pt-6 border-t border-gray-400 flex gap-6 text-xs leading-tight">
            <div className="border border-black p-3 bg-gray-50 flex-1">
              <strong>Head & Corporate Office (KOLHAPUR Office)</strong><br />
              No. 5 & 6, 3rd Floor, Star Tower, 1131/1, Panch bungalow,<br />
              Shahupuri, Kolhapur, Maharashtra, India. 416001<br />
              Contact: +91-9421464275
            </div>
            <div className="border border-black p-3 bg-gray-50 flex-1">
              <strong>Regional Office (MUMBAI)</strong><br />
              House No.158, Ananjie Master Building, No-7, Kasasheb Gadgil Marg,<br />
              Prabhadevi, Mumbai 400025. Contact: +91-9421584275<br /><br />
              <strong>SOLAPUR | DHARWAD |</strong> Other Branch: Goa, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu.
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="text-center mt-10 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-10 py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-lg rounded shadow-lg"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Print CSS */}
      <style jsx>{`
        @media print {
          body, .min-h-screen { background: white !important; margin: 0; padding: 20px; }
          button { display: none !important; }
          .shadow-lg { box-shadow: none !important; }
          @page { margin: 1cm; }
        }
      `}</style>
    </div>
  );
};

export default WelcomeLetter;