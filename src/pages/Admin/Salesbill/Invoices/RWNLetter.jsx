











// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import apiClient from '../../../../services/apiClient';
// import { apiEndpoints } from '../../../../services/apiClient';



// import Top from '../../../../assets/Salesbill/WNright.png';
// import Logo from '../../../../assets/Salesbill/Logo.png';
// import stamp from '../../../../assets/Salesbill/stamp.png';
// import signature from '../../../../assets/Salesbill/signature.png';
// import bottom from '../../../../assets/Salesbill/footer.png';

// const RenewalLetterExact = () => {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await apiClient.get(apiEndpoints.salesBills.getRenewalExpiry(id));
//         if (res.data.success) {
//           setData(res.data.letterData);
//         }
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchData();
//   }, [id]);

//   if (loading) return <div className="text-center py-20 text-xl">Loading Renewal Letter...</div>;
//   if (!data) return <div className="text-center py-20 text-red-600">Data not found</div>;


// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;  // ← Dash wala DD-MM-YYYY
// };


//   const { to, dates } = data;

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans text-black">
//       <div className="max-w-3xl mx-auto">
// <div className='shadow-lg'>


//         <div className="bg-white pl-8 pr-8 ">

//           {/* Header */}
//           {/* <div className="flex justify-between items-start pb-5 border-b-4 border-red-700 mb-10">
//             <img src={Logo} alt="Logo" className="w-44" />
//             <div className="text-right text-sm leading-tight">
//               <strong className="text-lg text-red-700 block">RAPID MEDICOLegal SERVICES INDIA LTD.</strong>
//               <span className="text-xs">www.rapidmedicolegal.in</span> | <span className="text-xs">rapidmedicolegal@gmail.com</span>
//               <br />
//               <span className="text-xs text-gray-600">360° Medicolegal Protection | An ISO 9001:2015 Certified Company</span>
//             </div>
//           </div> */}

//             <div className="flex justify-between items-start pb-5 border-b-4 border-red-700 mb-10">
//                       <img src={Logo} alt="Logo" className="w-44 mt-10" />
//                       <div className="text-right text-sm leading-tight">
//                         {/* <strong className="text-lg text-red-700 block">RAPID MEDICOLLEGAL SERVICES INDIA LTD.</strong>
//                         <span className="text-xs">www.rapidmedicolegal.in</span> | <span className="text-xs">rapidmedicolegal@gmail.com</span>
//                         <br />
                       
//                        <span className="text-xs text-gray-600">360° Medicolegal Protection | An ISO 9001:2015 Certified Company</span> */}
                       
//                         <img src={Top} alt="" className='ml-24'/>
//                       </div>
//                     </div>

//           {/* Date */}
//           <div className="text-right mb-6 font-bold">
//             DATE: <span className="ml-2">{new Date().toLocaleDateString('en-IN')}</span>
//           </div>

//           {/* To Address - API se */}
//           <div className="mb-8 text-sm leading-relaxed">
//             <strong>To</strong><br />
//             Dr. {to.doctors}<br />
//             {to.hospitalName}<br />
//             {to.addressLine1}<br />
//             {to.addressLine2}<br />
//             Pin Code - {to.pinCode}<br />
//             Contact No. - {to.contactNo}
//           </div>

//           {/* Welcome Again! */}
//           <div className="text-center text-xl font-bold my-6">
//             Welcome Again!
//           </div>

//           {/* Body - Static Content */}
//           <div className="text-justify text-sm leading-7">
//             <p>Dear Doctor,</p>

//             <p className="mt-4">
//               We are delighted to inform you that your membership with Rapid Medicolegal Services India Ltd. has been successfully renewed. Thank you for placing your trust in our services and continuing to be a valued member.
//             </p>

//             <p className="mt-4">
//               Your renewed membership is now active from{' '}
//               <strong>{formatDate(dates.validFrom)}</strong> to{' '}
//               <strong>{formatDate(dates.validTill)}</strong>.
//               We remain committed to providing you with reliable, expert medicolegal and risk management support whenever you need it.
//             </p>

//             <p className="mt-4">
//               Your continued association inspires us to maintain the highest standards of service and ensure your complete satisfaction. Our team remains your primary point of contact for any questions or assistance.
//             </p>

//             <p className="mt-4">
//               Thank you once again for staying with Rapid Medicolegal Services India Ltd.
//             </p>

//             <p className="mt-6 font-bold text-green-700">Stay with us, stay secure.</p>
//           </div>

//           {/* Signature */}
//           <div className="flex justify-end items-end mt-16 space-x-16">
//             <img src={stamp} alt="Stamp" className="w-40 opacity-95 mr-32" />
//             <div>
//               <img src={signature} alt="Signature" className="w-36" />
//               <p className="text-center mt-2 text-sm font-medium">Authorised Signatory</p>
//               <p className="font-bold">Rapid Medicolegal Services India Ltd.</p>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="mt-16 pt-6 border-t border-gray-400">
//             {/* <div className="border border-black p-3 bg-gray-50 flex-1">
//               <strong>Head & Corporate Office:</strong><br />
//               No. 5 & 6, 3rd Floor, Star Tower, 1131, Panch Bungalow,<br />
//               Shahupuri, Kolhapur, Maharashtra, India. 416001<br />
//               Contact: 9421464275 | Tel: 0231-2664275
//             </div>
//             <div className="border border-black p-3 bg-gray-50 flex-1 text-xs leading-tight">
//               <strong>Regional Office (MUMBAI):</strong><br />
//               House No. 158, Anjie Master Building, No.7, Kasam Gidgil Marg,<br />
//               Prabhadevi, Mumbai 400025. Contact: 942158425<br />
//               <strong>SOLAPUR:</strong> 40, Sarvade Nagar, Mulegaon Road, Solapur, No.4, 1305.<br />
//               Contact: 940573425 | 9105053425<br />
//               <strong>DHARWAD:</strong> Mahadev Niwas, Training College Road, Behind K.C. Park,<br />
//               Dharwad, Karnataka. 580008 Contact: 996544275<br />
//               <strong>Other Branch:</strong> Goa, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu.
//             </div> */}
         
//           </div>
          
//         </div>
//    <img src={bottom} alt="" />
//    </div>
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

//       <style jsx>{`
//         @media print {
//           body { background: white !important; }
//           button { display: none !important; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default RenewalLetterExact;



// import React, { useEffect, useState } from 'react';
// import { useParams,useNavigate } from 'react-router-dom';
// import apiClient from '../../../../services/apiClient';
// import { apiEndpoints } from '../../../../services/apiClient';

// import Top from '../../../../assets/Salesbill/WNright.png';
// import Logo from '../../../../assets/Salesbill/Logo.png';
// import stamp from '../../../../assets/Salesbill/stamp.png';
// import signature from '../../../../assets/Salesbill/signature.png';
// import bottom from '../../../../assets/Salesbill/footer.png';

// const RenewalLetterExact = () => {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await apiClient.get(apiEndpoints.salesBills.getRenewalExpiry(id));
//         if (res.data.success) {
//           setData(res.data.letterData);
//         }
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchData();
//   }, [id]);

//   if (loading) return <div className="text-center py-20 text-xl">Loading Renewal Letter...</div>;
//   if (!data) return <div className="text-center py-20 text-red-600">Data not found</div>;

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;  // ← Dash wala DD-MM-YYYY
//   };

//   const { to, dates } = data;

//   return (
//     <div className="min-h-screen bg-gray-100 py-4 px-4 font-sans text-black">
//       <div className="max-w-3xl mx-auto">
//         <div className='shadow-lg border-2 border-black print:mt-[3mm] print:border-0 print:shadow-none'>

//           <div className="bg-white pl-6 pr-6 print:pl-4 print:pr-4 print:min-h-[calc(100vh-1cm)] print:flex print:flex-col">

//             {/* Header */}
            // <div className="flex justify-between items-start pb-3 border-b-4 border-red-700 mb-4">
            //   <img src={Logo} alt="Logo" className="w-32 mt-4" />
            //   <div className="text-right text-xs leading-tight">
            //     <img src={Top} alt="" className='w-full' />
            //   </div>
            // </div>

//             {/* Date */}
//             <div className="text-right mb-6 font-bold text-xs">
//               DATE: <span className="ml-2">{new Date().toLocaleDateString('en-IN')}</span>
//             </div>

//             {/* To Address - API se */}
//             <div className="mb-6 text-xs leading-relaxed">
//               <strong>To</strong><br />
//               Dr. {to.doctors}<br />
//               {to.hospitalName}<br />
//               {to.addressLine1}<br />
//               {to.addressLine2}<br />
//               Pin Code - {to.pinCode}<br />
//               Contact No. - {to.contactNo}
//             </div>

//             {/* Welcome Again! */}
//             <div className="text-center text-lg font-bold my-6">
//               Welcome Again!
//             </div>

//             {/* Body - Static Content - Main content area that should grow */}
//             <div className="text-justify text-xs leading-5 flex-grow">
//               <p>Dear Doctor,</p>

//               <p className="mt-4">
//                 We are delighted to inform you that your membership with Rapid Medicolegal Services India Ltd. has been successfully renewed. Thank you for placing your trust in our services and continuing to be a valued member.
//               </p>

//               <p className="mt-4">
//                 Your renewed membership is now active from{' '}
//                 <strong>{formatDate(dates.validFrom)}</strong> to{' '}
//                 <strong>{formatDate(dates.validTill)}</strong>.
//                 We remain committed to providing you with reliable, expert medicolegal and risk management support whenever you need it.
//               </p>

//               <p className="mt-4">
//                 Your continued association inspires us to maintain the highest standards of service and ensure your complete satisfaction. Our team remains your primary point of contact for any questions or assistance.
//               </p>

//               <p className="mt-4">
//                 Thank you once again for staying with Rapid Medicolegal Services India Ltd.
//               </p>

//               <p className="mt-6 font-bold text-green-700 text-sm">Stay with us, stay secure.</p>
//             </div>

//             {/* Signature - Will be pushed to bottom */}
//             <div className="flex justify-end items-end mt-12 space-x-8 print:mt-auto">
//               <img src={stamp} alt="Stamp" className="w-28 h-28 opacity-95 mr-16 mb-2" />
//               <div>
//                 <img src={signature} alt="Signature" className="w-28" />
//                 <p className="text-center mt-2 text-xs font-medium">Authorised Signatory</p>
//                 <p className="font-bold text-xs mt-1">Rapid Medicolegal Services India Ltd.</p>
//               </div>
//             </div>

//             {/* Footer - Will be at the bottom */}
//             <div className="mt-12 pt-6 border-t border-gray-400 print:mt-8">
//               <img src={bottom} alt="Footer" className="w-full mt-4 print:mt-4" />
//             </div>
            
//           </div>
//         </div>

//         {/* Print Button */}
//         <div className="text-center mt-6 print:hidden">
//           <button
//             onClick={() => window.print()}
//             className="px-10 py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-lg rounded"
//           >
//             Print / Save as PDF
//           </button>
//             <button
//           onClick={() => navigate(-1)}
//           className="ml-4 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
//         >
//           Back
//         </button>
//         </div>

//       </div>

//       <style jsx>{`
//         @media print {
//           body, .min-h-screen { 
//             background: white !important; 
//             margin: 0;
//             padding: 0;
//             height: auto;
//           }
//           button { display: none !important; }
//           .shadow-lg { 
//             box-shadow: none !important;
//             height: auto !important;
//             margin: 0 !important;
//           }
//           @page { 
//             size: A4;
//             margin: 0.3cm;
//           }
//           .max-w-3xl {
//             max-width: 100% !important;
//             margin: 0 !important;
//             padding: 0 !important;
//             width: 100% !important;
//           }
//           .py-4 {
//             padding-top: 0 !important;
//             padding-bottom: 0 !important;
//           }
//           /* Ensure content doesn't overflow to next page */
//           .bg-white {
//             page-break-inside: avoid;
//             page-break-after: avoid;
//             break-inside: avoid;
//           }
//           /* Prevent footer from being cut */
//           .print\\:min-h-\\[calc\\(100vh-1cm\\)\\] {
//             min-height: calc(100vh - 0.6cm) !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default RenewalLetterExact;





























import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../../services/apiClient';
import { apiEndpoints } from '../../../../services/apiClient';

import Top from '../../../../assets/Salesbill/WNright.png';
import Logo from '../../../../assets/Salesbill/Logo.png';
import stamp from '../../../../assets/Salesbill/stamp.png';
import signature from '../../../../assets/Salesbill/signature.png';
import bottom from '../../../../assets/Salesbill/footer.png';

const RenewalLetterExact = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(apiEndpoints.salesBills.getRenewalExpiry(id));
        if (res.data.success) {
          setData(res.data.letterData);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-xl">Loading Renewal Letter...</div>;
  if (!data) return <div className="text-center py-20 text-red-600">Data not found</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const { to, dates } = data;

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-4 font-sans text-black">
      <div className="max-w-3xl mx-auto">
        <div className="shadow-lg border-2 border-black print:mt-[3mm] print:border-0 print:shadow-none">

          <div className="bg-white pl-6 pr-6 print:pl-4 print:pr-4 print:flex print:flex-col">

            {/* Header */}
            {/* <div className="flex justify-between items-start pb-3 border-b-4 border-red-700 mb-4">
              <img src={Logo} alt="Logo" className="w-32 mt-4" />
              <div className="text-right text-xs leading-tight">
                <img src={Top} alt="" className="w-full" />
              </div>
            </div> */}
 <div className="flex justify-between items-start pb-3 border-b-4 border-red-700 mb-4">
              <img src={Logo} alt="Logo" className="w-52 mt-4" />
              <div className="text-right text-xs leading-tight">
                <img src={Top} alt="" className='w-full' />
              </div>
            </div>
            {/* Date */}
            <div className="text-right mb-6 font-bold text-xs">
              DATE: <span className="ml-2">{new Date().toLocaleDateString('en-IN')}</span>
            </div>

            {/* To Address */}
            <div className="mb-6 text-xs leading-relaxed">
              <strong>To</strong><br />
              Dr. {to.doctors}<br />
              {to.hospitalName}<br />
              {to.addressLine1}<br />
              {to.addressLine2}<br />
              Pin Code - {to.pinCode}<br />
              Contact No. - {to.contactNo}
            </div>

            {/* Welcome Again! */}
            <div className="text-center text-lg font-bold my-6">
              Welcome Again!
            </div>

            {/* Body */}
            <div className="text-justify text-xs leading-5 flex-grow">
              <p>Dear Doctor,</p>

              <p className="mt-4">
                We are delighted to inform you that your membership with Rapid Medicolegal Services India Ltd. has been successfully renewed. Thank you for placing your trust in our services and continuing to be a valued member.
              </p>

              <p className="mt-4">
                Your renewed membership is now active from{' '}
                <strong>{formatDate(dates.validFrom)}</strong> to{' '}
                <strong>{formatDate(dates.validTill)}</strong>.
                We remain committed to providing you with reliable, expert medicolegal and risk management support whenever you need it.
              </p>

              <p className="mt-4">
                Your continued association inspires us to maintain the highest standards of service and ensure your complete satisfaction. Our team remains your primary point of contact for any questions or assistance.
              </p>

              <p className="mt-4">
                Thank you once again for staying with Rapid Medicolegal Services India Ltd.
              </p>

              <p className="mt-6 font-bold text-green-700 text-sm">Stay with us, stay secure.</p>
            </div>

            {/* Signature */}
            <div className="flex justify-end items-end mt-0 space-x-8 print:mt-8">
              <img src={stamp} alt="Stamp" className="w-44 h-44 opacity-95 mr-16 mb-12" />
              <div>
                <img src={signature} alt="Signature" className="w-70" />
                <p className="text-center mt-2 text-xs font-medium">Authorised Signatory</p>
                <p className="font-bold text-xs mt-1">Rapid Medicolegal Services India Ltd.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-400 print:mt-8">
              <img src={bottom} alt="Footer" className="w-full mt-4 print:mt-4" />
            </div>
            
          </div>
        </div>

        {/* Print Button */}
        <div className="text-center mt-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-10 py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-lg rounded"
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

      <style jsx>{`
        @media print {
          /* Reset page margins and background */
          body, .min-h-screen { 
            background: white !important; 
            margin: 0;
            padding: 0;
            height: auto;
          }
          button { display: none !important; }
          .shadow-lg { 
            box-shadow: none !important;
            height: auto !important;
            margin: 0 !important;
          }
          @page { 
            size: A4;
            margin: 0.3cm;
          }
          .max-w-3xl {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          .py-4 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          .bg-white {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .print\\:flex-col {
            min-height: auto !important;
          }

          /* ========== ENLARGE TEXT FOR PRINT ========== */
          /* Base text */
          .text-xs, .leading-5, .leading-relaxed, .text-sm, p, div, span, strong, .font-bold {
            font-size: 12pt !important;
            line-height: 1.5 !important;
          }
          /* Address and to section */
          .mb-6.text-xs, .text-xs.leading-relaxed {
            font-size: 12pt !important;
          }
          /* Date */
          .text-right.mb-6.font-bold.text-xs {
            font-size: 12pt !important;
          }
          /* Welcome Again heading */
          .text-center.text-lg.font-bold {
            font-size: 18pt !important;
          }
          /* Body paragraphs */
          .text-justify.text-xs.leading-5 p {
            font-size: 12pt !important;
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          /* "Stay with us" line */
          .text-green-700.text-sm {
            font-size: 14pt !important;
          }
          /* Signature text */
          .text-center.mt-2.text-xs.font-medium,
          .font-bold.text-xs.mt-1 {
            font-size: 10pt !important;
          }
          /* Reduce margins to fit one page */
          .mt-12 {
            margin-top: 1rem !important;
          }
          .mb-6 {
            margin-bottom: 0.5rem !important;
          }
          .my-6 {
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          .mt-4 {
            margin-top: 0.5rem !important;
          }
          .pt-6 {
            padding-top: 0.5rem !important;
          }
          .mt-6 {
            margin-top: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RenewalLetterExact;