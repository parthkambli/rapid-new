












// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';
// import { toast } from 'react-toastify';

// import Top from '../../../../assets/Salesbill/WNright.png';
// import Logo from '../../../../assets/Salesbill/Logo.png';
// import stamp from '../../../../assets/Salesbill/stamp.png';
// import signature from '../../../../assets/Salesbill/signature.png';
// import bottom from '../../../../assets/Salesbill/footer.png';


// const WelcomeLetter = () => {
//   const { id } = useParams(); // bill ID from URL
//   const navigate = useNavigate();
//   const [bill, setBill] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBill = async () => {
//       if (!id) {
//         toast.error("Invalid link");
//         return;
//       }

//       try {
//         setLoading(true);
//         const res = await apiClient.get(apiEndpoints.salesBills.get(id));

//         if (res.data.success) {
//           setBill(res.data.data);
//           // Auto print after 1 second
//           setTimeout(() => window.print(), 1200);
//         } else {
//           toast.error("Bill not found");
//           navigate("/admin/salesbill/list");
//         }
//       } catch (err) {
//         toast.error("Failed to load welcome letter");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBill();
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-2xl font-bold text-gray-600">
//         Preparing Welcome Letter...
//       </div>
//     );
//   }

//   if (!bill) {
//     return (
//       <div className="text-center py-20 text-3xl text-red-600">
//         Welcome Letter Not Found!
//       </div>
//     );
//   }

//   const client = bill.client;
//   const entity = client?.entityId || {};


//      const  doctorNames =  client.name ? `Dr. ${client.name}` : "Valued Doctor";


//   // Hospital / Clinic Name
//   const hospitalName = entity.hospitalName || entity.fullName || "Clinic/Hospital";

//   // Full Address
//   const address = entity.hospitalAddress || entity.address || {};
//   const addressLine1 = address.address || "";
//   const addressLine2 = `${address.city || ""}${address.city && address.state ? ", " : ""}${address.state || ""}`;
//   const pinCode = address.pinCode || "";
//   const phone = entity.phoneNumber || entity.whatsappNumber || "N/A";

//   // Date
//   const letterDate = new Date(bill.billDate).toLocaleDateString('en-GB');

//   return (
//     <div className="min-h-screen  py-10 px-4 font-sans text-black">
//       <div className="max-w-3xl mx-auto">
// <div className='shadow-lg  border-2 border-black'>

//         {/* Main Letter */}
//         <div className="bg-white pl-8 pr-8   relative">

//           {/* Header */}
//           <div className="flex justify-between items-start pb-5 border-b-4 border-red-700 mb-10">
//             <img src={Logo} alt="Logo" className="w-44 mt-10" />
//             <div className="text-right text-sm leading-tight">
            
//               <img src={Top} alt="" />
//             </div>
//           </div>

//           {/* Date */}
//           <div className="text-right mb-6 font-bold">
//             DATE - <span className="ml-2 underline">{letterDate}</span>
//           </div>

//           {/* To Address - DYNAMIC */}
//           <div className="mb-8 text-sm leading-relaxed">
//             <strong>To</strong><br /><br />
//             <strong>{doctorNames.toUpperCase()}</strong><br />
//             <strong>{hospitalName.toUpperCase()}</strong><br />
//             {addressLine1 && <>{addressLine1.toUpperCase()}<br /></>}
//             {addressLine2 && <>{addressLine2.toUpperCase()}<br /></>}
//             {pinCode && <>Pin Code - {pinCode}<br /></>}
//             CONTACT NO. - {phone}
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

         



//           {/* Closing Section - EXACTLY as per your screenshot */}
// <div className="mt-20 relative">

//   {/* Yours faithfully + Company Name - Right aligned, below signature */}
//   <div className="absolute right-0 top-24 text-right leading-relaxed">
//     <div className="font-medium">Yours faithfully,</div>
//     <div className="mt-8 font-bold text-sm">
//       Rapid Medicolegal Services India Ltd.
//     </div>
//   </div>

//   {/* Stamp (Left) + Signature (Right) */}
//   <div className="flex justify-between items-start">
//     {/* Company Stamp - Left */}
//     <div>
//       <img 
//         src={stamp} 
//         alt="Company Stamp" 
//         className="w-32 opacity-95" 
//       />
//     </div>

//     {/* Signature - Right */}
//     <div className="text-right">
//       <img 
//         src={signature} 
//         alt="Signature" 
//         className="w-36 inline-block" 
//       />
//       <div className="mt-2 text-sm font-medium text-gray-700">
//         Authorised Signatory
//       </div>
//     </div>
//   </div>

// </div>

//           {/* Footer Offices */}
//           <div className="mt-12 pt-2 border-t border-gray-400 flex gap-6 text-xs leading-tight">
          
//           </div>




//           </div>
//             <img src={bottom} alt="" />
//         </div>

//         {/* Print Button */}
//         <div className="text-center mt-10 print:hidden">
//           <button
//             onClick={() => window.print()}
//             className="px-10 py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-lg rounded shadow-lg"
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
//           @page { margin: 1cm; }
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

import Top from '../../../../assets/Salesbill/WNright.png';
import Logo from '../../../../assets/Salesbill/Logo.png';
import stamp from '../../../../assets/Salesbill/stamp.png';
import signature from '../../../../assets/Salesbill/signature.png';
import bottom from '../../../../assets/Salesbill/footer.png';


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

  const doctorNames = client.name ? `Dr. ${client.name}` : "Valued Doctor";

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
    <div className="min-h-screen py-4 px-4 font-sans text-black">
      <div className="max-w-3xl mx-auto">
        <div className='shadow-lg border-2 border-black'>

          {/* Main Letter */}
          <div className="bg-white pl-6 pr-6 relative">

            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b-4 border-red-700 mb-4">
              <img src={Logo} alt="Logo" className="w-32 mt-4 print:w-[180px]" />
              <div className="text-right text-xs leading-tight">
                <img src={Top} alt="" className="w-full" />
              </div>
            </div>

            {/* Date */}
            <div className="text-right mb-3 font-bold text-xs">
              DATE - <span className="ml-2 underline">{letterDate}</span>
            </div>

            {/* To Address - DYNAMIC */}
            <div className="mb-4 text-xs leading-relaxed">
              <strong>To</strong><br /><br />
              <strong>{doctorNames.toUpperCase()}</strong><br />
              <strong>{hospitalName.toUpperCase()}</strong><br />
              {addressLine1 && <>{addressLine1.toUpperCase()}<br /></>}
              {addressLine2 && <>{addressLine2.toUpperCase()}<br /></>}
              {pinCode && <>Pin Code - {pinCode}<br /></>}
              CONTACT NO. - {phone}
            </div>

            {/* Welcome Title */}
            <div className="text-center text-lg font-bold my-4 text-red-700">
              Welcome to Rapid Medicolegal Services India Ltd.
            </div>

            {/* Letter Body */}
            <div className="text-justify text-xs leading-5">
              <p>Dear Doctor,</p>

              <p className="mt-2">
                We are delighted to welcome you as a valued Member of Rapid Medicolegal Services India Ltd. We are honored to have earned your trust and are confident that our association will bring you complete peace of mind in every aspect of medicolegal and risk management support.
              </p>

              <p className="mt-2">
                At Rapid Medicolegal Services India Ltd., we take great pride in offering our members responsive, reliable, and expert services tailored exclusively for medical professionals. Your satisfaction and security are our top priorities, and we are committed to standing beside you at every step of your professional journey.
              </p>

              <p className="mt-2">
                As your primary point of contact for all medicolegal and risk management matters, our team is always available to assist you with dedication and efficiency. We encourage you to reach out to us anytime with your queries, feedback, or suggestions — your inputs help us serve you even better.
              </p>

              <p className="mt-3">
                Thank you for becoming a part of the Rapid family.<br />
                Together, we will continue to uphold professional excellence and legal security for the medical community.
              </p>

              <p className="mt-4 font-bold text-green-700 text-sm">
                Stay with us, stay secure.
              </p>
            </div>

            {/* Closing Section - EXACTLY as per your screenshot */}
            <div className="mt-8 ">

              {/* Yours faithfully + Company Name - Right aligned, below signature */}
              <div className="  text-right leading-relaxed">
                <div className="font-medium text-xs ">Yours faithfully,</div>
                <div className="mt-2 font-bold text-xs">
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
                    className="w-24 h-24 opacity-95" 
                  />
                </div>

                {/* Signature - Right */}
                <div className="text-right">
                  <img 
                    src={signature} 
                    alt="Signature" 
                    className="w-28 inline-block" 
                  />
                  <div className="mt-2 text-xs font-medium text-gray-700">
                    Authorised Signatory
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Offices */}
            <div className="mt-6 pt-2 border-t border-gray-400 flex gap-6 text-xs leading-tight">
            </div>

          </div>
          <img src={bottom} alt="" className="w-full print:mx-[4mm]" />
        </div>

        {/* Print Button */}
        <div className="text-center mt-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-10 py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-lg rounded shadow-lg"
          >
            Print / Save as PDF
          </button>
            <button
          onClick={() => navigate(-1)}
          className="ml-4 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
        </div>
      </div>

      {/* Print CSS */}
      <style jsx>{`
        @media print {
          body, .min-h-screen { 
            background: white !important; 
            margin: 0; 
            padding: 0;
          }
          button { display: none !important; }
          .shadow-lg { box-shadow: none !important; }
          @page { 
            size: A4;
            margin: 0.3cm;
          }
          .max-w-3xl {
            max-width: 100% !important;
            margin: 0 !important;
          }
          .py-4 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeLetter;