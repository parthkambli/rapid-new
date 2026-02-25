// // DoctorInfoSection.jsx - Dynamic Info Section
// import React from 'react';

// const DoctorInfoSection = ({ data }) => {
//   const {
//     doctor_name = "{{doctor_name}}",
//     hospital_name = "{{hospital_name}}",
//     address = "{{address}}",
//     specialization = "{{specialization}}",
//     membership_type = "{{membership_type}}",
//     quotation_date = "12.08.2025",
//     valid_till = "12.09.2025"
//   } = data;

//   return (
//     <div className="mb-8">
//       {/* Date Section */}
//       <div className="flex justify-between items-start mb-6">
//         <div>
//           <p className="text-lg font-semibold">Respected Doctor,</p>
//         </div>
//         <div className="text-right">
//           <p className="text-sm">
//             <span className="font-semibold">Date:</span> {quotation_date}
//           </p>
//         </div>
//       </div>

//       {/* Greetings Section */}
//       <div className="mb-6">
//         <p className="text-lg mb-4">
//           <span className="font-bold">Greetings from RAPID MEDICOLEGAL SERVICES INDIA LTD.</span>
//         </p>
//         <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 mb-4">
//           <p className="text-center text-xl font-bold text-blue-700">
//             !! You are invited!!
//           </p>
//           <p className="text-center text-lg font-semibold text-blue-600">
//             TO BE THE PART OF INDIA'S ONLY
//           </p>
//           <p className="text-center text-lg font-semibold text-blue-600">
//             MEDICOLEGAL SERVICES & RISK MANAGEMENT COMPANY
//           </p>
//           <p className="text-center font-bold">FOR THE DOCTORS</p>
//         </div>
//       </div>

//       {/* Company Introduction */}
//       <div className="text-sm mb-6">
//         <p className="mb-2">
//           RAPID MEDICOLEGAL SERVICES INDIA LTD. is a limited company incorporated under Indian Companies Act, 2013 with its offices throughout India. The company is having understanding with premiere Insurance Companies. The company through its massive network and trained professional specializes in liability and medical insurance policies in particular.
//         </p>
//         <p className="font-bold mb-2">Here's why?</p>
//       </div>

//       {/* Bullet Points */}
//       <div className="mb-6 pl-4">
//         {[
//           "India's only risk Management Company in a complete or true sense with its nationwide operation.",
//           "A truly international standard service company with India's top most legal and medico legal professionals. 24x7 services right at your doorstep.",
//           "Online connectivity with all experts. 100% crisis management infrastructure.",
//           "A platform to study national and international trends, problems and safety measurements through its dedicated website and regular journals.",
//           "Get covered for all medico legal, criminal and medical councils. This service is not given or managed by any other company or agent.",
//           "Get covered for all cases of consumer nature and prior cases. This facility is exclusive available for the entire doctors who are insured through any other company or agent. No question asked. If you are opting for us then we declare to take all your prior matters whenever it comes. We will arrange for all helps and compensation free of cost.",
//           "Get participated in our medico legal events, seminars or lectures which currently you are being deprived of and which we organize on regular intervals.",
//           "More than 2000+ empanelled lawyers to give a big accessibility and help in event of crisis. Due to our national infrastructure you must be reassured of getting on time services anywhere.",
//           "Get access to specialization wise medico legal experts who are doctor cum lawyer to represent your all medico-legal cases.",
//           "Get recovery of hospital bills from TPA. Get your hospital documents and records"
//         ].map((point, index) => (
//           <div key={index} className="flex items-start mb-1">
//             <span className="mr-2">➢</span>
//             <span className="text-sm">{point}</span>
//           </div>
//         ))}
//       </div>

//       {/* Doctor/Hospital Details */}
//       <div className="border-t-2 border-b-2 border-gray-300 py-4 my-6">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <p className="font-bold">DR. NAME:</p>
//             <p className="text-lg">{doctor_name}</p>
//           </div>
//           <div>
//             <p className="font-bold">HOSPITAL NAME:</p>
//             <p className="text-lg">{hospital_name}</p>
//           </div>
//           <div className="col-span-2">
//             <p className="font-bold">ADDRESS:</p>
//             <p className="text-lg">{address}</p>
//           </div>
//           <div>
//             <p className="font-bold">SPECIALIZATION:</p>
//             <p className="text-lg">{specialization}</p>
//           </div>
//           <div>
//             <p className="font-bold">MEMBERSHIP TYPE:</p>
//             <p className="text-lg">{membership_type}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorInfoSection;







// import React from "react";

// const DoctorInfoSection = ({ data }) => {
//   const {
//     quotation_date = "12.08.2025"
//   } = data || {};

//   return (
//     <section className="page page-break-after">

//       {/* Top Line */}
//       <div className="flex justify-between mb-6">
//         <p className="font-semibold text-base">Respected Doctor,</p>
//         <p className="text-sm font-semibold">
//           Date : <span className="font-normal">{quotation_date}</span>
//         </p>
//       </div>

//       {/* Center Headings */}
//       <div className="text-center mb-6 leading-7">
//         <p className="font-bold text-lg text-black">
//           Greetings from <span className="text-orange-600">RAPID MEDICOLEGAL SERVICES INDIA LTD.</span>
//         </p>

//         <p className="font-bold text-black mt-3">!! You are invited!!</p>

//         <p className="font-bold text-black">
//           TO BE THE PART OF INDIA’S ONLY
//         </p>

//         <p className="font-bold text-black">
//           MEDICOLEGAL SERVICES & RISK MANAGEMENT COMPANY
//         </p>

//         <p className="font-bold text-black">
//           FOR THE DOCTORS
//         </p>
//       </div>

//       {/* Company Intro */}
//       <div className="text-sm text-justify mb-4">
//         <p>
//           <span className="font-semibold text-orange-600">
//             RAPID MEDICOLEGAL SERVICES INDIA LTD.
//           </span>{" "}
//           is a limited company incorporated under Indian Companies Act, 2013
//           with its offices throughout India. The company is having understanding
//           with premier Insurance Companies and specializes in liability and
//           medical insurance policies.
//         </p>

//         <p className="font-bold mt-3">Here’s why?</p>
//       </div>

//       {/* Bullet Points */}
//       <ul className="space-y-1 text-sm">
//         {[
//           "India’s only risk management company with nationwide operation.",
//           "24x7 medico-legal services at your doorstep.",
//           "100% crisis management infrastructure.",
//           "National & international medico-legal trend analysis.",
//           "Coverage for medico-legal, criminal & medical council cases.",
//           "Prior & consumer cases covered without question.",
//           "Regular medico-legal seminars & events.",
//           "2000+ empanelled lawyers across India.",
//           "Doctor-cum-lawyer medico-legal experts.",
//           "Hospital bill recovery support from TPA."
//         ].map((item, i) => (
//           <li key={i} className="flex gap-2">
//             <span className="text-orange-600 font-bold">➢</span>
//             <span>{item}</span>
//           </li>
//         ))}
//       </ul>

//     </section>
//   );
// };

// export default DoctorInfoSection;









// // components/DoctorInfoSection.jsx
// import React from 'react';

// const DoctorInfoSection = ({ data }) => {
//   const {
//     quotation_date = "12.08.2025"
//   } = data || {};

//   return (
//     <section className="page-break-after-always mb-8">
//       {/* Top Line - Respeted Doctor and Date */}
//       <div className="flex justify-between items-start mb-8 md:p-10 ">
//         <p className="text-lg font-bold text-gray-800">Respected Doctor,</p>
//         <div className="text-right">
//           <p className="text-sm">
//             <span className="font-bold">Date :</span> <span className="font-normal">{quotation_date}</span>
//           </p>
//         </div>
//       </div>

//       {/* Center Headings with Orange Company Name */}
//       <div className="text-center  mb-8 space-y-2"  >
//         <p className="text-xl font-bold text-gray-900">
//           Greetings from <span className="text-orange-600 font-extrabold">RAPID MEDICOLEGAL SERVICES INDIA LTD.</span>
//         </p>
        
//         <div className="mt-6 space-y-3">
//           <p className="text-2xl font-black text-center text-gray-900 tracking-wide">
//             !! You are invited!!
//           </p>
          
//           <p className="text-lg font-bold text-gray-900">
//             TO BE THE PART OF INDIA'S ONLY
//           </p>
          
//           <p className="text-lg font-bold text-gray-900">
//             MEDICOLEGAL SERVICES & RISK MANAGEMENT COMPANY
//           </p>
          
//           <p className="text-xl font-black text-gray-900 mt-4">
//             FOR THE DOCTORS
//           </p>
//         </div>
//       </div>

//       {/* Company Introduction */}
//       <div className="text-sm text-justify mb-6 md:p-10">
//         <p className="mb-3">
//           <span className="font-bold text-orange-600">
//             RAPID MEDICOLEGAL SERVICES INDIA LTD.
//           </span>{' '}
//           is a limited company incorporated under Indian Companies Act, 2013 with its offices throughout India. The company is having understanding with premiere Insurance Companies. The company through its massive network and trained professional specializes in liability and medical insurance policies in particular.
//         </p>
        
//       </div>

//       {/* Orange Bullet Points */}
//         <p className="font-bold text-gray-900 text-lg md:p-6">Here's why?</p>
//       <div className="space-y-1 print:space-y-0.5 text-sm print:text-xs md:p-6">
//         {[
//           "India's only risk Management Company in a complete or true sense with its nationwide operation.",
//           "A truly international standard service company with India's top most legal and medico legal professionals. 24x7 services right at your doorstep.",
//           "Online connectivity with all experts. 100% crisis management infrastructure.",
//           "A platform to study national and international trends, problems and safety measurements through its dedicated website and regular journals.",
//           "Get covered for all medico legal, criminal and medical councils. This service is not given or managed by any other company or agent.",
//           "Get covered for all cases of consumer nature and prior cases. This facility is exclusive available for the entire doctors who are insured through any other company or agent. No question asked. If you are opting for us then we declare to take all your prior matters whenever it comes. We will arrange for all helps and compensation free of cost.",
//           "Get participated in our medico legal events, seminars or lectures which currently you are being deprived of and which we organize on regular intervals.",
//           "More than 2000+ empanelled lawyers to give a big accessibility and help in event of crisis. Due to our national infrastructure you must be reassured of getting on time services anywhere.",
//           "Get access to specialization wise medico legal experts who are doctor cum lawyer to represent your all medico-legal cases.",
//           "Get recovery of hospital bills from TPA. Get your hospital documents and records"
//         ].map((point, index) => (
//           <div
//       key={index}
//       className="grid grid-cols-[24px_1fr] gap-x-4 items-start "
//     >
//       {/* Bullet */}
//       <span className="text-orange-600 font-bold text-lg ">➢</span>

//       {/* Text */}
//       {/* <p className="text-sm text-gray-700 leading-5 text-justify"> */}
//       <p className="leading-tight print:leading-none">
//         {point}
//       </p>
//     </div>
//   ))}
// </div>
//     </section>
//   );
// };

// export default DoctorInfoSection;




import React from 'react';

const DoctorInfoSection = ({ data }) => {
  const {
    quotation_date = "12.08.2025"
  } = data || {};

  return (
    <section className="doctor-info no-break-inside">
      {/* Top Line - COMPACT */}
      <div className="flex justify-between items-start mb-4 print:mb-2">
        <p className="text-base print:text-[11pt] font-bold text-gray-800">Respected Doctor,</p>
        <div className="text-right">
          <p className="text-xs print:text-[9pt]">
            <span className="font-bold">Date :</span> <span className="font-normal">{quotation_date}</span>
          </p>
        </div>
      </div>

      {/* Center Headings - COMPACT */}
      <div className="text-center mb-4 print:mb-2">
        <p className="text-lg print:text-[12pt] font-bold text-gray-900 mb-1">
          Greetings from <span className="text-orange-600 font-extrabold">RAPID MEDICOLEGAL SERVICES INDIA LTD.</span>
        </p>
        
        <div className="space-y-1">
          <p className="text-xl print:text-[14pt] font-black text-gray-900">
            !! You are invited!!
          </p>
          
          <p className="text-base print:text-[11pt] font-bold text-gray-900">
            TO BE THE PART OF INDIA'S ONLY
          </p>
          
          <p className="text-base print:text-[11pt] font-bold text-gray-900">
            MEDICOLEGAL SERVICES & RISK MANAGEMENT COMPANY
          </p>
          
          <p className="text-lg print:text-[12pt] font-black text-gray-900 mt-1">
            FOR THE DOCTORS
          </p>
        </div>
      </div>

      {/* Company Introduction - COMPACT */}
      <div className="text-xs print:text-[9pt] text-justify mb-3">
        <p>
          <span className="font-bold text-orange-600">
            RAPID MEDICOLEGAL SERVICES INDIA LTD.
          </span>{' '}
          is a limited company incorporated under Indian Companies Act, 2013 with its offices throughout India. The company is having understanding with premiere Insurance Companies. The company through its massive network and trained professional specializes in liability and medical insurance policies in particular.
        </p>
      </div>

      {/* Orange Bullet Points - COMPACT */}
      <p className="font-bold text-gray-900 text-base print:text-[11pt] mb-2">Here's why?</p>
      
      <div className="space-y-1 text-sm print:text-[8pt]">
        {[
          "India's only risk Management Company in a complete or true sense with its nationwide operation.",
          "A truly international standard service company with India's top most legal and medico legal professionals. 24x7 services right at your doorstep.",
          "Online connectivity with all experts. 100% crisis management infrastructure.",
          "A platform to study national and international trends, problems and safety measurements through its dedicated website and regular journals.",
          "Get covered for all medico legal, criminal and medical councils. This service is not given or managed by any other company or agent.",
          "Get covered for all cases of consumer nature and prior cases. This facility is exclusive available for the entire doctors who are insured through any other company or agent. No question asked. If you are opting for us then we declare to take all your prior matters whenever it comes. We will arrange for all helps and compensation free of cost.",
          "Get participated in our medico legal events, seminars or lectures which currently you are being deprived of and which we organize on regular intervals.",
          "More than 2000+ empanelled lawyers to give a big accessibility and help in event of crisis. Due to our national infrastructure you must be reassured of getting on time services anywhere.",
          "Get access to specialization wise medico legal experts who are doctor cum lawyer to represent your all medico-legal cases.",
          "Get recovery of hospital bills from TPA. Get your hospital documents and records"
        ].map((point, index) => (
          <div key={index} className="flex items-start gap-1 mb-0.5">
            {/* Bullet */}
            <span className="text-orange-600 font-bold text-xs mt-0.5 flex-shrink-0">➢</span>
            
            {/* Text - NO TEXT-JUSTIFY, left align */}
            <p className="leading-tight text-left">
              {point}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DoctorInfoSection;