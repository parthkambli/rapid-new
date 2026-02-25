// // ScopeOfServices.jsx - Scope of Services Content
// import React from 'react';

// const ScopeOfServices = ({ membershipType = 'hospital' }) => {
//   const isCombined = membershipType === 'combined';
  
//   const services = [
//     {
//       title: "24×7 Integrated Medico-Legal Protection",
//       content: "The Company shall provide round-the-clock medico-legal assistance and complete legal protection to both Dr. Nagaraj Margankop and his Hospital(HOSPITAL NAME). Services include case guidance, documentation, notice handling, and direct coordination with medico-legal experts and advocates nationwide."
//     },
//     {
//       title: "Comprehensive Case Management",
//       content: "The Company will handle and supervise all medico-legal, civil, criminal, and consumer cases pertaining to both the Doctor and Hospital during the active membership period.",
//       bullets: [
//         "Case registration and documentation",
//         "Advocate and expert appointment",
//         "Court representation and coordination",
//         "Regular progress reporting until final closure"
//       ]
//     },
//     {
//       title: "Legal Representation & Risk Management",
//       content: "Professional defense and risk management from the initial complaint / FIR stage up to the Hon'ble Supreme Court of India, ensuring full protection at every level — clinic, district court, consumer forum, High Court, and Supreme Court."
//     },
//     {
//       title: "Combined Coverage Includes:",
//       bullets: [
//         "Doctor's individual and visiting practice across India",
//         "Hospital-based medico-legal matters including:",
//         "Staff negligence or malpractice (qualified/unqualified staff)",
//         "Hospital equipment or software-related legal issues",
//         "TPA and bill recovery disputes",
//         "False media allegations, harassment, or defamation",
//         "MLC (Medico-Legal Case) documentation and support"
//       ]
//     },
//     {
//       title: "Staff & Associated Professionals Coverage",
//       content: "The membership shall extend to owner, payroll doctors, visiting consultants, nursing and paramedical staff authorized by the hospital management."
//     },
//     {
//       title: "Advocate & Expert Coordination",
//       content: "The Company shall appoint experienced advocates and medico-legal experts from its national panel (600+ professionals). Advocate and expert fees will be managed by the Company under the agreed membership terms."
//     },
//     {
//       title: "Insurance & Compensation Support",
//       content: "RAPID MEDICOLEGAL SERVICES INDIA LTD. shall assist in arranging and renewing Professional Indemnity Insurance for both Doctor and Hospital through ICICI Lombard / The Oriental Insurance Co. Ltd. / or other approved insurers.",
//       subBullets: [
//         "Ensures 1:1 compensation coverage for consumer and civil cases",
//         "Criminal case defense covered within membership without additional premium."
//       ]
//     }
//   ];

//   const additionalServices = isCombined ? [
//     {
//       title: "Transparency & Digital Case Updates",
//       content: "All case-related communication, updates, and document submissions shall be managed via secure digital platforms to ensure transparency and real-time tracking."
//     },
//     {
//       title: "Confidentiality & Ethical Practice",
//       content: "All documents, communications, and records shared by the Doctor/Hospital shall remain strictly confidential. The Company operates fully within Indian legal frameworks and adheres to the National Medical Commission (NMC) Code of Ethics. No assistance will be provided for any illegal or unethical activity."
//     },
//     {
//       title: "Professional Risk Management Commitment",
//       content: "RAPID MEDICOLEGAL SERVICES INDIA LTD. commits to:",
//       bullets: [
//         "Protecting both the Doctor and Hospital from all medico-legal liabilities",
//         "Managing professional risks and litigation stress",
//         "Enabling uninterrupted focus on clinical practice and patient care"
//       ]
//     }
//   ] : [];

//   return (
//     <div className="mb-8">
//       <h2 className="text-center font-bold text-2xl mb-6 border-b-2 border-gray-800 pb-2">
//         Scope of Services:
//       </h2>
      
//       <div className="space-y-6">
//         {services.map((service, index) => (
//           <div key={index} className="page-break-inside-avoid">
//             <h3 className="font-bold text-lg mb-2">{service.title}</h3>
//             <p className="mb-3 text-justify">{service.content}</p>
            
//             {service.bullets && (
//               <ul className="list-disc pl-5 mb-3">
//                 {service.bullets.map((bullet, idx) => (
//                   <li key={idx} className="mb-1 flex items-start">
//                     <span className="mr-2">✓</span>
//                     <span>{bullet}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
            
//             {service.subBullets && (
//               <div className="pl-5">
//                 {service.subBullets.map((subBullet, idx) => (
//                   <div key={idx} className="flex items-start mb-1">
//                     <span className="mr-2">•</span>
//                     <span>{subBullet}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
        
//         {additionalServices.map((service, index) => (
//           <div key={`additional-${index}`} className="page-break-inside-avoid">
//             <h3 className="font-bold text-lg mb-2">{service.title}</h3>
//             <p className="mb-3 text-justify">{service.content}</p>
            
//             {service.bullets && (
//               <ul className="list-disc pl-5 mb-3">
//                 {service.bullets.map((bullet, idx) => (
//                   <li key={idx} className="mb-1 flex items-start">
//                     <span className="mr-2">✓</span>
//                     <span>{bullet}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ScopeOfServices;















// // ScopeOfServices.jsx - Updated with exact content for all 3 membership types
// import React from 'react';

// const ScopeOfServices = ({ membershipType = 'hospital' }) => {
  
//   // HOSPITAL MEMBERSHIP CONTENT (9 points)
//   const hospitalServices = [
//     {
//       title: "24×7 Legal & Medico-Legal Support:",
//       content: "Continuous medico-legal and risk management support for the hospital and its staff, including guidance, documentation, and expert coordination."
//     },
//     {
//       title: "Comprehensive Case Handling:",
//       content: "End-to-end management of all medico-legal, consumers, criminal, and civil matters arising against the hospital during the membership period."
//     },
//     {
//       title: "Hospital Risk Coverage:",
//       content: null,
//       bullets: [
//         "Legal protection in cases related to:",
//         "Staff negligence or unqualified staff issues",
//         "Equipment malfunction or software-related errors",
//         "False media allegations, harassment, or defamation",
//         "TPA and bill recovery disputes"
//       ]
//     },
//     {
//       title: "Advocate & Legal Representation:",
//       content: "The Company shall manage cases from the hospital level up to the Hon'ble Supreme Court of India through its empanelled lawyers and medico-legal experts."
//     },
//     {
//       title: "Legal Compensation & Indemnity:",
//       content: "In coordination with the hospital's Error & Omission Policy or Indemnity Insurance, the Company shall support the compensation and legal process as per agreed plan terms."
//     },
//     {
//       title: "Staff Coverage:",
//       content: "Covers all employed, on-call, and visiting doctors, as well as nursing and paramedical staff working under the hospital's authorization."
//     },
//     {
//       title: "Case Monitoring & Updates:",
//       content: "Regular follow-ups and case progress updates through secure digital platforms."
//     },
//     {
//       title: "Confidentiality & Ethical Practice:",
//       content: "All cases handled with complete confidentiality and compliance with NMC and Indian laws."
//     },
//     {
//       title: "Professional Risk Management:",
//       content: "360° medico-legal defense and risk control enabling the hospital to operate confidently and focus on patient care."
//     }
//   ];

//   // INDIVIDUAL DOCTOR MEMBERSHIP CONTENT (10 points)
//   const individualServices = [
//     {
//       title: "24×7 Medico-Legal Assistance:",
//       content: "Continuous medico-legal guidance, legal notice handling, and coordination with medico-legal experts and advocates across India."
//     },
//     {
//       title: "Professional Protection:",
//       content: "Complete medico-legal coverage for civil, criminal, and consumer cases arising from the doctor's professional practice."
//     },
//     {
//       title: "Case Handling:",
//       content: "Management of all medico-legal matters from registration to case closure — including documentation, representation, and regular updates."
//     },
//     {
//       title: "Risk Management & Representation:",
//       content: "Assistance and defense from initial complaint or FIR stage up to the Hon'ble Supreme Court of India."
//     },
//     {
//       title: "Advocate & Expert Coordination:",
//       content: "The Company shall appoint qualified legal experts and bear advocate/expert fees as per plan terms."
//     },
//     {
//       title: "Insurance & Compensation Support:",
//       content: "Arrangement and renewal of Doctor's Professional Indemnity Insurance through ICICI Lombard / Oriental Insurance / other approved insurers, ensuring 1:1 compensation for eligible cases."
//     },
//     {
//       title: "Confidentiality & Ethical Compliance:",
//       content: "All medico-legal services shall follow NMC (National Medical Commission) guidelines and Indian laws, maintaining full confidentiality."
//     },
//     {
//       title: "Practice Coverage:",
//       content: "Legal coverage for the doctor's individual and visiting practice throughout India."
//     },
//     {
//       title: "Digital Case Updates:",
//       content: "Regular case progress updates through authorized digital platforms."
//     },
//     {
//       title: "Professional Commitment:",
//       content: "Enables the doctor to focus on medical practice while the Company manages all medico-legal and legal risks."
//     }
//   ];

//   // COMBINED MEMBERSHIP CONTENT (10 points)
//   const combinedServices = [
//     {
//       title: "24×7 Integrated Medico-Legal Protection",
//       content: "The Company shall provide round-the-clock medico-legal assistance and complete legal protection to both Dr. Nagaraj Margankop and his Hospital(HOSPITAL NAME). Services include case guidance, documentation, notice handling, and direct coordination with medico-legal experts and advocates nationwide."
//     },
//     {
//       title: "Comprehensive Case Management",
//       content: "The Company will handle and supervise all medico-legal, civil, criminal, and consumer cases pertaining to both the Doctor and Hospital during the active membership period.",
//       bullets: [
//         "Case registration and documentation",
//         "Advocate and expert appointment",
//         "Court representation and coordination",
//         "Regular progress reporting until final closure"
//       ]
//     },
//     {
//       title: "Legal Representation & Risk Management",
//       content: "Professional defense and risk management from the initial complaint / FIR stage up to the Hon'ble Supreme Court of India, ensuring full protection at every level — clinic, district court, consumer forum, High Court, and Supreme Court."
//     },
//     {
//       title: "Combined Coverage Includes:",
//       content: null,
//       bullets: [
//         "Doctor's individual and visiting practice across India",
//         "Hospital-based medico-legal matters including:",
//         "Staff negligence or malpractice (qualified/unqualified staff)",
//         "Hospital equipment or software-related legal issues",
//         "TPA and bill recovery disputes",
//         "False media allegations, harassment, or defamation",
//         "MLC (Medico-Legal Case) documentation and support"
//       ]
//     },
//     {
//       title: "Staff & Associated Professionals Coverage",
//       content: "The membership shall extend to owner, payroll doctors, visiting consultants, nursing and paramedical staff authorized by the hospital management."
//     },
//     {
//       title: "Advocate & Expert Coordination",
//       content: "The Company shall appoint experienced advocates and medico-legal experts from its national panel (600+ professionals). Advocate and expert fees will be managed by the Company under the agreed membership terms."
//     },
//     {
//       title: "Insurance & Compensation Support",
//       content: "RAPID MEDICOLEGAL SERVICES INDIA LTD. shall assist in arranging and renewing Professional Indemnity Insurance for both Doctor and Hospital through ICICI Lombard / The Oriental Insurance Co. Ltd. / or other approved insurers.",
//       subBullets: [
//         "Ensures 1:1 compensation coverage for consumer and civil cases",
//         "Criminal case defense covered within membership without additional premium."
//       ]
//     },
//     {
//       title: "Transparency & Digital Case Updates",
//       content: "All case-related communication, updates, and document submissions shall be managed via secure digital platforms to ensure transparency and real-time tracking."
//     },
//     {
//       title: "Confidentiality & Ethical Practice",
//       content: "All documents, communications, and records shared by the Doctor/Hospital shall remain strictly confidential. The Company operates fully within Indian legal frameworks and adheres to the National Medical Commission (NMC) Code of Ethics. No assistance will be provided for any illegal or unethical activity."
//     },
//     {
//       title: "Professional Risk Management Commitment",
//       content: "RAPID MEDICOLEGAL SERVICES INDIA LTD. commits to:",
//       bullets: [
//         "Protecting both the Doctor and Hospital from all medico-legal liabilities",
//         "Managing professional risks and litigation stress",
//         "Enabling uninterrupted focus on clinical practice and patient care"
//       ]
//     }
//   ];

//   // Select services based on membership type
//   const getServices = () => {
//     switch(membershipType) {
//       case 'hospital':
//         return hospitalServices;
//       case 'individual':
//         return individualServices;
//       case 'combined':
//         return combinedServices;
//       default:
//         return hospitalServices;
//     }
//   };

//   const services = getServices();

//   return (
//     <div className="mb-8 md:p-10">
//       <h2 className="font-bold text-2xl mb-6  border-gray-800 p-2">
//         Scope of Services:
//       </h2>
      
//       <div className="space-y-6">
//         {services.map((service, index) => (
//           <div key={index} className="page-break-inside-avoid">
//             <div className="flex items-start mb-2">
//               <span className="font-bold text-gray-700 mr-2 min-w-[20px]">
//                 {index + 1}.
//               </span>
//               <h3 className="font-bold text-lg">{service.title}</h3>
//             </div>
            
//             {service.content && (
//               <p className="mb-3 text-justify pl-7">{service.content}</p>
//             )}
            
//             {service.bullets && (
//               <ul className="list-none pl-7 mb-3 space-y-1">
//                 {service.bullets.map((bullet, idx) => {
//                   // Check if it's a sub-heading or regular bullet
//                   const isSubHeading = bullet.endsWith(':');
//                   const isBlackTick = membershipType === 'combined' && index === 3;
                  
//                   return (
//                     <li key={idx} className="flex items-start">
//                       {isSubHeading ? (
//                         <>
//                           <span className="mr-2 font-bold">{bullet}</span>
//                         </>
//                       ) : (
//                         <>
//                           <span className="mr-2 mt-1 flex-shrink-0">
//                             {isBlackTick ? (
//                               <span className="text-black">✓</span>
//                             ) : (
//                               <span className="text-green-600">✓</span>
//                             )}
//                           </span>
//                           <span>{bullet}</span>
//                         </>
//                       )}
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
            
//             {service.subBullets && (
//               <div className="pl-7 space-y-1">
//                 {service.subBullets.map((subBullet, idx) => (
//                   <div key={idx} className="flex items-start">
//                     <span className="mr-2">•</span>
//                     <span>{subBullet}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ScopeOfServices;
















// // ScopeOfServices.jsx - Updated with exact content for all 3 membership types
// import React from 'react';

// const ScopeOfServices = ({ membershipType = 'hospital' }) => {
  
//   // HOSPITAL MEMBERSHIP CONTENT (9 points)
//   const hospitalServices = [
//     {
//       title: "24×7 Legal & Medico-Legal Support:",
//       content: "Continuous medico-legal and risk management support for the hospital and its staff, including guidance, documentation, and expert coordination."
//     },
//     {
//       title: "Comprehensive Case Handling:",
//       content: "End-to-end management of all medico-legal, consumers, criminal, and civil matters arising against the hospital during the membership period."
//     },
//     {
//       title: "Hospital Risk Coverage:",
//       content: null,
//       bullets: [
//         "Legal protection in cases related to:",
//         "Staff negligence or unqualified staff issues",
//         "Equipment malfunction or software-related errors",
//         "False media allegations, harassment, or defamation",
//         "TPA and bill recovery disputes"
//       ]
//     },
//     {
//       title: "Advocate & Legal Representation:",
//       content: "The Company shall manage cases from the hospital level up to the Hon'ble Supreme Court of India through its empanelled lawyers and medico-legal experts."
//     },
//     {
//       title: "Legal Compensation & Indemnity:",
//       content: "In coordination with the hospital's Error & Omission Policy or Indemnity Insurance, the Company shall support the compensation and legal process as per agreed plan terms."
//     },
//     {
//       title: "Staff Coverage:",
//       content: "Covers all employed, on-call, and visiting doctors, as well as nursing and paramedical staff working under the hospital's authorization."
//     },
//     {
//       title: "Case Monitoring & Updates:",
//       content: "Regular follow-ups and case progress updates through secure digital platforms."
//     },
//     {
//       title: "Confidentiality & Ethical Practice:",
//       content: "All cases handled with complete confidentiality and compliance with NMC and Indian laws."
//     },
//     {
//       title: "Professional Risk Management:",
//       content: "360° medico-legal defense and risk control enabling the hospital to operate confidently and focus on patient care."
//     }
//   ];

//   // INDIVIDUAL DOCTOR MEMBERSHIP CONTENT (10 points)
//   const individualServices = [
//     {
//       title: "24×7 Medico-Legal Assistance:",
//       content: "Continuous medico-legal guidance, legal notice handling, and coordination with medico-legal experts and advocates across India."
//     },
//     {
//       title: "Professional Protection:",
//       content: "Complete medico-legal coverage for civil, criminal, and consumer cases arising from the doctor's professional practice."
//     },
//     {
//       title: "Case Handling:",
//       content: "Management of all medico-legal matters from registration to case closure — including documentation, representation, and regular updates."
//     },
//     {
//       title: "Risk Management & Representation:",
//       content: "Assistance and defense from initial complaint or FIR stage up to the Hon'ble Supreme Court of India."
//     },
//     {
//       title: "Advocate & Expert Coordination:",
//       content: "The Company shall appoint qualified legal experts and bear advocate/expert fees as per plan terms."
//     },
//     {
//       title: "Insurance & Compensation Support:",
//       content: "Arrangement and renewal of Doctor's Professional Indemnity Insurance through ICICI Lombard / Oriental Insurance / other approved insurers, ensuring 1:1 compensation for eligible cases."
//     },
//     {
//       title: "Confidentiality & Ethical Compliance:",
//       content: "All medico-legal services shall follow NMC (National Medical Commission) guidelines and Indian laws, maintaining full confidentiality."
//     },
//     {
//       title: "Practice Coverage:",
//       content: "Legal coverage for the doctor's individual and visiting practice throughout India."
//     },
//     {
//       title: "Digital Case Updates:",
//       content: "Regular case progress updates through authorized digital platforms."
//     },
//     {
//       title: "Professional Commitment:",
//       content: "Enables the doctor to focus on medical practice while the Company manages all medico-legal and legal risks."
//     }
//   ];

//   // COMBINED MEMBERSHIP CONTENT (10 points)
//   const combinedServices = [
//     {
//       title: "24×7 Integrated Medico-Legal Protection",
//       content: "The Company shall provide round-the-clock medico-legal assistance and complete legal protection to both Dr. Nagaraj Margankop and his Hospital(HOSPITAL NAME). Services include case guidance, documentation, notice handling, and direct coordination with medico-legal experts and advocates nationwide."
//     },
//     {
//       title: "Comprehensive Case Management",
//       content: "The Company will handle and supervise all medico-legal, civil, criminal, and consumer cases pertaining to both the Doctor and Hospital during the active membership period.",
//       bullets: [
//         "Case registration and documentation",
//         "Advocate and expert appointment",
//         "Court representation and coordination",
//         "Regular progress reporting until final closure"
//       ]
//     },
//     {
//       title: "Legal Representation & Risk Management",
//       content: "Professional defense and risk management from the initial complaint / FIR stage up to the Hon'ble Supreme Court of India, ensuring full protection at every level — clinic, district court, consumer forum, High Court, and Supreme Court."
//     },
//     {
//       title: "Combined Coverage Includes:",
//       content: null,
//       bullets: [
//         "Doctor's individual and visiting practice across India",
//         "Hospital-based medico-legal matters including:",
//         "Staff negligence or malpractice (qualified/unqualified staff)",
//         "Hospital equipment or software-related legal issues",
//         "TPA and bill recovery disputes",
//         "False media allegations, harassment, or defamation",
//         "MLC (Medico-Legal Case) documentation and support"
//       ]
//     },
//     {
//       title: "Staff & Associated Professionals Coverage",
//       content: "The membership shall extend to owner, payroll doctors, visiting consultants, nursing and paramedical staff authorized by the hospital management."
//     },
//     {
//       title: "Advocate & Expert Coordination",
//       content: "The Company shall appoint experienced advocates and medico-legal experts from its national panel (600+ professionals). Advocate and expert fees will be managed by the Company under the agreed membership terms."
//     },
//     {
//       title: "Insurance & Compensation Support",
//       content: "RAPID MEDICOLEGAL SERVICES INDIA LTD. shall assist in arranging and renewing Professional Indemnity Insurance for both Doctor and Hospital through ICICI Lombard / The Oriental Insurance Co. Ltd. / or other approved insurers.",
//       subBullets: [
//         "Ensures 1:1 compensation coverage for consumer and civil cases",
//         "Criminal case defense covered within membership without additional premium."
//       ]
//     },
//     {
//       title: "Transparency & Digital Case Updates",
//       content: "All case-related communication, updates, and document submissions shall be managed via secure digital platforms to ensure transparency and real-time tracking."
//     },
//     {
//       title: "Confidentiality & Ethical Practice",
//       content: "All documents, communications, and records shared by the Doctor/Hospital shall remain strictly confidential. The Company operates fully within Indian legal frameworks and adheres to the National Medical Commission (NMC) Code of Ethics. No assistance will be provided for any illegal or unethical activity."
//     },
//     {
//       title: "Professional Risk Management Commitment",
//       content: "RAPID MEDICOLEGAL SERVICES INDIA LTD. commits to:",
//       bullets: [
//         "Protecting both the Doctor and Hospital from all medico-legal liabilities",
//         "Managing professional risks and litigation stress",
//         "Enabling uninterrupted focus on clinical practice and patient care"
//       ]
//     }
//   ];

//   // Select services based on membership type
//   const getServices = () => {
//     switch(membershipType) {
//       case 'hospital':
//         return hospitalServices;
//       case 'individual':
//         return individualServices;
//       case 'combined':
//         return combinedServices;
//       default:
//         return hospitalServices;
//     }
//   };

//   const services = getServices();

//   return (
//   <div className="mt-4 print:mt-2">
//     <h2 className="font-bold text-2xl print:text-xl mb-4 print:mb-3 text-center print:text-left">
//       Scope of Services:
//     </h2>

//     <div className="text-sm print:text-xs">
//       {services.map((service, index) => (
//         <div key={index} className="mb-4 print:mb-3">
//           <div className="flex items-start gap-3">
//             <span className="font-bold text-gray-800 flex-shrink-0 w-6 text-right">
//               {index + 1}.
//             </span>
//             <h3 className="font-bold text-base print:text-sm">{service.title}</h3>
//           </div>

//           {service.content && (
//             <p className="pl-10 pr-4 text-justify mt-1 print:mt-0.5">
//               {service.content}
//             </p>
//           )}

//           {service.bullets && (
//             <ul className="pl-12 pr-4 list-none mt-1 print:mt-0.5">
//               {service.bullets.map((bullet, idx) => {
//                 const isSubHeading = bullet.endsWith(':');
//                 const isBlackTick = membershipType === 'combined' && index === 3;

//                 return (
//                   <li key={idx} className="flex items-start gap-3 mt-1 print:mt-0.5">
//                     {isSubHeading ? (
//                       <span className="font-bold">{bullet}</span>
//                     ) : (
//                       <>
//                         <span className="mt-1 flex-shrink-0">
//                           {isBlackTick ? '✓' : <span className="text-green-600">✓</span>}
//                         </span>
//                         <span>{bullet}</span>
//                       </>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           )}

//           {service.subBullets && (
//             <div className="pl-14 pr-4 mt-1 print:mt-0.5">
//               {service.subBullets.map((subBullet, idx) => (
//                 <div key={idx} className="flex items-start gap-3 mt-1 print:mt-0.5">
//                   <span className="mt-1">•</span>
//                   <span>{subBullet}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   </div>
// );

// };

// export default ScopeOfServices;








// import React from 'react';

// const ScopeOfServices = ({ membershipType = 'hospital' , data={} }) => {
//   const doctorName = data.doctor_name || "Dr. Name Not Available";
//   const hospitalName = data.hospital_name || "Hospital Name Not Available";

//   // HOSPITAL MEMBERSHIP CONTENT (9 points)
//   const hospitalServices = [
//     {
//       title: "24×7 Legal & Medico-Legal Support:",
//       content: "Continuous medico-legal and risk management support for the hospital and its staff, including guidance, documentation, and expert coordination."
//     },
//     {
//       title: "Comprehensive Case Handling:",
//       content: "End-to-end management of all medico-legal, consumers, criminal, and civil matters arising against the hospital during the membership period."
//     },
//     {
//       title: "Hospital Risk Coverage:",
//       content: null,
//       bullets: [
//         "Legal protection in cases related to:",
//         "Staff negligence or unqualified staff issues",
//         "Equipment malfunction or software-related errors",
//         "False media allegations, harassment, or defamation",
//         "TPA and bill recovery disputes"
//       ]
//     },
//     {
//       title: "Advocate & Legal Representation:",
//       content: "The Company shall manage cases from the hospital level up to the Hon'ble Supreme Court of India through its empanelled lawyers and medico-legal experts."
//     },
//     {
//       title: "Legal Compensation & Indemnity:",
//       content: "In coordination with the hospital's Error & Omission Policy or Indemnity Insurance, the Company shall support the compensation and legal process as per agreed plan terms."
//     },
//     {
//       title: "Staff Coverage:",
//       content: "Covers all employed, on-call, and visiting doctors, as well as nursing and paramedical staff working under the hospital's authorization."
//     },
//     {
//       title: "Case Monitoring & Updates:",
//       content: "Regular follow-ups and case progress updates through secure digital platforms."
//     },
//     {
//       title: "Confidentiality & Ethical Practice:",
//       content: "All cases handled with complete confidentiality and compliance with NMC and Indian laws."
//     },
//     {
//       title: "Professional Risk Management:",
//       content: "360° medico-legal defense and risk control enabling the hospital to operate confidently and focus on patient care."
//     }
//   ];

//   // INDIVIDUAL DOCTOR MEMBERSHIP CONTENT (10 points)
//   const individualServices = [
//     {
//       title: "24×7 Medico-Legal Assistance:",
//       content: "Continuous medico-legal guidance, legal notice handling, and coordination with medico-legal experts and advocates across India."
//     },
//     {
//       title: "Professional Protection:",
//       content: "Complete medico-legal coverage for civil, criminal, and consumer cases arising from the doctor's professional practice."
//     },
//     {
//       title: "Case Handling:",
//       content: "Management of all medico-legal matters from registration to case closure — including documentation, representation, and regular updates."
//     },
//     {
//       title: "Risk Management & Representation:",
//       content: "Assistance and defense from initial complaint or FIR stage up to the Hon'ble Supreme Court of India."
//     },
//     {
//       title: "Advocate & Expert Coordination:",
//       content: "The Company shall appoint qualified legal experts and bear advocate/expert fees as per plan terms."
//     },
//     {
//       title: "Insurance & Compensation Support:",
//       content: "Arrangement and renewal of Doctor's Professional Indemnity Insurance through ICICI Lombard / Oriental Insurance / other approved insurers, ensuring 1:1 compensation for eligible cases."
//     },
//     {
//       title: "Confidentiality & Ethical Compliance:",
//       content: "All medico-legal services shall follow NMC (National Medical Commission) guidelines and Indian laws, maintaining full confidentiality."
//     },
//     {
//       title: "Practice Coverage:",
//       content: "Legal coverage for the doctor's individual and visiting practice throughout India."
//     },
//     {
//       title: "Digital Case Updates:",
//       content: "Regular case progress updates through authorized digital platforms."
//     },
//     {
//       title: "Professional Commitment:",
//       content: "Enables the doctor to focus on medical practice while the Company manages all medico-legal and legal risks."
//     }
//   ];


// // CombinedServices array को update करें
// // COMBINED MEMBERSHIP CONTENT (10 points)
// const combinedServices = [
//   // {
//   //   title: "24×7 Integrated Medico-Legal Protection:",
//   //   content: `The Company shall provide round-the-clock medico-legal assistance and complete legal protection to both Dr. ${doctorName} and his/her Hospital (${hospitalName}). Services include case guidance, documentation, notice handling, and direct coordination with medico-legal experts and advocates nationwide.`
//   // },


//  {
//     title: "24×7 Integrated Medico-Legal Protection:",
//     content: `The Company shall provide round-the-clock medico-legal assistance and complete legal protection to both Dr. ${data.doctor_name || "Name"} and his/her Hospital (${data.hospital_name || "Hospital Name"}). Services include case guidance, documentation, notice handling, and direct coordination with medico-legal experts and advocates nationwide.`
//   },

//   {
//     title: "Comprehensive Case Management:",
//     content: "The Company will handle and supervise all medico-legal, civil, criminal, and consumer cases pertaining to both the Doctor and Hospital during the active membership period.",
//     bullets: [
//       "Case registration and documentation",
//       "Advocate and expert appointment",
//       "Court representation and coordination",
//       "Regular progress reporting until final closure"
//     ]
//   },
//   {
//     title: "Legal Representation & Risk Management:",
//     content: "Professional defense and risk management from the initial complaint / FIR stage up to the Hon'ble Supreme Court of India, ensuring full protection at every level — clinic, district court, consumer forum, High Court, and Supreme Court."
//   },
//   {
//     title: "Combined Coverage Includes:",
//     content: null,
//     bullets: [
//       "Doctor's individual and visiting practice across India",
//       "Hospital-based medico-legal matters including:",
//       " Staff negligence or malpractice (qualified/unqualified staff)",
//       " Hospital equipment or software-related legal issues",
//       " TPA and bill recovery disputes",
//       " False media allegations, harassment, or defamation",
//       " MLC (Medico-Legal Case) documentation and support"
//     ]
//   },
//   {
//     title: "Staff & Associated Professionals Coverage:",
//     content: "The membership shall extend to owner, payroll doctors, visiting consultants, nursing and paramedical staff authorized by the hospital management."
//   },
//   {
//     title: "Advocate & Expert Coordination:",
//     content: "The Company shall appoint experienced advocates and medico-legal experts from its national panel (600+ professionals). Advocate and expert fees will be managed by the Company under the agreed membership terms."
//   },
//   {
//     title: "Insurance & Compensation Support:",
//     content: "RAPID MEDICOLEGAL SERVICES INDIA LTD. shall assist in arranging and renewing Professional Indemnity Insurance for both Doctor and Hospital through ICICI Lombard / The Oriental Insurance Co. Ltd. / or other approved insurers.",
//     subBullets: [
//       "Ensures 1:1 compensation coverage for consumer and civil cases",
//       "Criminal case defense covered within membership without additional premium."
//     ]
//   },
//   {
//     title: "Transparency & Digital Case Updates:",
//     content: "All case-related communication, updates, and document submissions shall be managed via secure digital platforms to ensure transparency and real-time tracking."
//   },
//   {
//     title: "Confidentiality & Ethical Practice:",
//     content: "All documents, communications, and records shared by the Doctor/Hospital shall remain strictly confidential. The Company operates fully within Indian legal frameworks and adheres to the National Medical Commission (NMC) Code of Ethics. No assistance will be provided for any illegal or unethical activity."
//   },
//   {
//     title: "Professional Risk Management Commitment:",
//     content: "RAPID MEDICOLEGAL SERVICES INDIA LTD. commits to:",
//     bullets: [
//       "Protecting both the Doctor and Hospital from all medico-legal liabilities",
//       "Managing professional risks and litigation stress",
//       "Enabling uninterrupted focus on clinical practice and patient care"
//     ]
//   }
// ];


//   // Select services based on membership type
//   const getServices = () => {
//     switch(membershipType) {
//       case 'hospital':
//         return hospitalServices;
//       case 'individual':
//         return individualServices;
//       case 'combined':
//         return combinedServices;
//       default:
//         return hospitalServices;
//     }
//   };

//   const services = getServices();

//   return (
//     <div className="mt-2 scope-of-services no-break-inside">
//       <h2 className="font-bold text-xl print:text-[14pt] mb-2 text-left">
//         Scope of Services:
//       </h2>

//       <div className="text-xs print:text-[9pt] scope-items">
//         {services.map((service, index) => (
//           <div key={index} className="mb-2 scope-item no-break-inside ">
//             <div className="flex items-start">
//               <span className="font-bold text-gray-800 flex-shrink-0 w-5">
//                 {index + 1}.
//               </span>
//               <h3 className="font-bold text-sm print:text-[9pt] ml-1">
//                 {service.title}
//               </h3>
//             </div>

//             {service.content && (
//               <p className="ml-6 text-left leading-tight mt-0.5">
//                 {service.content}
//               </p>
//             )}

//             {service.bullets && (
//               <ul className="ml-6 list-none">
//                 {service.bullets.map((bullet, idx) => {
//                   const isSubHeading = bullet.endsWith(':');
//                   const isBlackTick = membershipType === 'combined' && index === 3;

//                   return (
//                     <li key={idx} className="flex items-start mt-0.5">
//                       {isSubHeading ? (
//                         <span className="font-bold text-xs">{bullet}</span>
//                       ) : (
//                         <>
//                           <span className="mt-0.5 mr-1 flex-shrink-0">
//                             {isBlackTick ? '✓' : <span className="text-green-600">✓</span>}
//                           </span>
//                           <span className="leading-tight">{bullet}</span>
//                         </>
//                       )}
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}

//             {service.subBullets && (
//               <div className="ml-8">
//                 {service.subBullets.map((subBullet, idx) => (
//                   <div key={idx} className="flex items-start mt-0.5">
//                     <span className="mt-0.5 mr-1">•</span>
//                     <span className="leading-tight">{subBullet}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ScopeOfServices;





// ScopeOfServices.jsx - UPDATED FOR BETTER PAGE BREAKS
import React from 'react';

const ScopeOfServices = ({ membershipType = 'hospital', data = {} }) => {
  const doctorName = data.doctor_name || "Dr. Name Not Available";
  const hospitalName = data.hospital_name || "Hospital Name Not Available";

  // HOSPITAL MEMBERSHIP CONTENT (9 points) - COMPACT
  const hospitalServices = [
    {
      title: "24×7 Legal & Medico-Legal Support:",
      content: "Continuous medico-legal and risk management support for the hospital and its staff, including guidance, documentation, and expert coordination."
    },
    {
      title: "Comprehensive Case Handling:",
      content: "End-to-end management of all medico-legal, consumers, criminal, and civil matters arising against the hospital during the membership period."
    },
    {
      title: "Hospital Risk Coverage:",
      content: null,
      bullets: [
        "Legal protection in cases related to:",
        "Staff negligence or unqualified staff issues",
        "Equipment malfunction or software-related errors",
        "False media allegations, harassment, or defamation",
        "TPA and bill recovery disputes"
      ]
    },
    {
      title: "Advocate & Legal Representation:",
      content: "The Company shall manage cases from the hospital level up to the Hon'ble Supreme Court of India through its empanelled lawyers and medico-legal experts."
    },
    {
      title: "Legal Compensation & Indemnity:",
      content: "In coordination with the hospital's Error & Omission Policy or Indemnity Insurance, the Company shall support the compensation and legal process as per agreed plan terms."
    },
    {
      title: "Staff Coverage:",
      content: "Covers all employed, on-call, and visiting doctors, as well as nursing and paramedical staff working under the hospital's authorization."
    },
    {
      title: "Case Monitoring & Updates:",
      content: "Regular follow-ups and case progress updates through secure digital platforms."
    },
    {
      title: "Confidentiality & Ethical Practice:",
      content: "All cases handled with complete confidentiality and compliance with NMC and Indian laws."
    },
    {
      title: "Professional Risk Management:",
      content: "360° medico-legal defense and risk control enabling the hospital to operate confidently and focus on patient care."
    }
  ];

  // INDIVIDUAL DOCTOR MEMBERSHIP CONTENT (10 points) - COMPACT
  const individualServices = [
    {
      title: "24×7 Medico-Legal Assistance:",
      content: "Continuous medico-legal guidance, legal notice handling, and coordination with medico-legal experts and advocates across India."
    },
    {
      title: "Professional Protection:",
      content: "Complete medico-legal coverage for civil, criminal, and consumer cases arising from the doctor's professional practice."
    },
    {
      title: "Case Handling:",
      content: "Management of all medico-legal matters from registration to case closure — including documentation, representation, and regular updates."
    },
    {
      title: "Risk Management & Representation:",
      content: "Assistance and defense from initial complaint or FIR stage up to the Hon'ble Supreme Court of India."
    },
    {
      title: "Advocate & Expert Coordination:",
      content: "The Company shall appoint qualified legal experts and bear advocate/expert fees as per plan terms."
    },
    {
      title: "Insurance & Compensation Support:",
      content: "Arrangement and renewal of Doctor's Professional Indemnity Insurance through ICICI Lombard / Oriental Insurance / other approved insurers, ensuring 1:1 compensation for eligible cases."
    },
    {
      title: "Confidentiality & Ethical Compliance:",
      content: "All medico-legal services shall follow NMC (National Medical Commission) guidelines and Indian laws, maintaining full confidentiality."
    },
    {
      title: "Practice Coverage:",
      content: "Legal coverage for the doctor's individual and visiting practice throughout India."
    },
    {
      title: "Digital Case Updates:",
      content: "Regular case progress updates through authorized digital platforms."
    },
    {
      title: "Professional Commitment:",
      content: "Enables the doctor to focus on medical practice while the Company manages all medico-legal and legal risks."
    }
  ];




// COMBINED MEMBERSHIP CONTENT - Split into two parts
  const combinedServicesPart1 = [
    {
      title: "24×7 Integrated Medico-Legal Protection:",
      content: `The Company shall provide round-the-clock medico-legal assistance and complete legal protection to both Dr. ${doctorName} and his/her Hospital (${hospitalName}). Services include case guidance, documentation, notice handling, and direct coordination with medico-legal experts and advocates nationwide.`
    },
    {
      title: "Comprehensive Case Management:",
      content: "The Company will handle and supervise all medico-legal, civil, criminal, and consumer cases pertaining to both the Doctor and Hospital during the active membership period.",
      bullets: [
        "Case registration and documentation",
        "Advocate and expert appointment",
        "Court representation and coordination",
        "Regular progress reporting until final closure"
      ]
    },
    {
      title: "Legal Representation & Risk Management:",
      content: "Professional defense and risk management from the initial complaint / FIR stage up to the Hon'ble Supreme Court of India, ensuring full protection at every level — clinic, district court, consumer forum, High Court, and Supreme Court."
    },
    {
      title: "Combined Coverage Includes:",
      content: null,
      bullets: [
        "Doctor's individual and visiting practice across India",
        "Hospital-based medico-legal matters including:",
        "✓ Staff negligence or malpractice (qualified/unqualified staff)",
        "✓ Hospital equipment or software-related legal issues",
        "✓ TPA and bill recovery disputes",
        "✓ False media allegations, harassment, or defamation",
        "✓ MLC (Medico-Legal Case) documentation and support"
      ]
    },
    {
      title: "Staff & Associated Professionals Coverage:",
      content: "The membership shall extend to owner, payroll doctors, visiting consultants, nursing and paramedical staff authorized by the hospital management."
    },
  {
      title: "Advocate & Expert Coordination:",
      content: "The Company shall appoint experienced advocates and medico-legal experts from its national panel (600+ professionals). Advocate and expert fees will be managed by the Company under the agreed membership terms."
    },
    {
      title: "Insurance & Compensation Support:",
      content: "RAPID MEDICOLEGAL SERVICES INDIA LTD. shall assist in arranging and renewing Professional Indemnity Insurance for both Doctor and Hospital through ICICI Lombard / The Oriental Insurance Co. Ltd. / or other approved insurers.",
      subBullets: [
        "Ensures 1:1 compensation coverage for consumer and civil cases",
        "Criminal case defense covered within membership without additional premium."
      ]
    },
    {
      title: "Transparency & Digital Case Updates:",
      content: "All case-related communication, updates, and document submissions shall be managed via secure digital platforms to ensure transparency and real-time tracking."
    },

  ];
  const combinedServicesPart2 = [
    {
      title: "Confidentiality & Ethical Practice:",
      content: "All documents, communications, and records shared by the Doctor/Hospital shall remain strictly confidential. The Company operates fully within Indian legal frameworks and adheres to the National Medical Commission (NMC) Code of Ethics. No assistance will be provided for any illegal or unethical activity."
    },
    {
      title: "Professional Risk Management Commitment:",
      content: "RAPID MEDICOLEGAL SERVICES INDIA LTD. commits to:",
      bullets: [
        "Protecting both the Doctor and Hospital from all medico-legal liabilities",
        "Managing professional risks and litigation stress",
        "Enabling uninterrupted focus on clinical practice and patient care"
      ]
    }
  ];


  // COMBINED MEMBERSHIP CONTENT - OPTIMIZED FOR PRINT
  const combinedServices = [
    {
      title: "24×7 Integrated Medico-Legal Protection:",
      content: `The Company shall provide round-the-clock medico-legal assistance and complete legal protection to both Dr. ${doctorName} and his/her Hospital (${hospitalName}). Services include case guidance, documentation, notice handling, and direct coordination with medico-legal experts and advocates nationwide.`
    },
    {
      title: "Comprehensive Case Management:",
      content: "The Company will handle and supervise all medico-legal, civil, criminal, and consumer cases pertaining to both the Doctor and Hospital during the active membership period.",
      bullets: [
        "Case registration and documentation",
        "Advocate and expert appointment",
        "Court representation and coordination",
        "Regular progress reporting until final closure"
      ]
    },
    {
      title: "Legal Representation & Risk Management:",
      content: "Professional defense and risk management from the initial complaint / FIR stage up to the Hon'ble Supreme Court of India, ensuring full protection at every level — clinic, district court, consumer forum, High Court, and Supreme Court."
    },
    {
      title: "Combined Coverage Includes:",
      content: null,
      bullets: [
        "Doctor's individual and visiting practice across India",
        "Hospital-based medico-legal matters including:",
        "✓ Staff negligence or malpractice (qualified/unqualified staff)",
        "✓ Hospital equipment or software-related legal issues",
        "✓ TPA and bill recovery disputes",
        "✓ False media allegations, harassment, or defamation",
        "✓ MLC (Medico-Legal Case) documentation and support"
      ]
    },
    {
      title: "Staff & Associated Professionals Coverage:",
      content: "The membership shall extend to owner, payroll doctors, visiting consultants, nursing and paramedical staff authorized by the hospital management."
    },
    {
      title: "Advocate & Expert Coordination:",
      content: "The Company shall appoint experienced advocates and medico-legal experts from its national panel (600+ professionals). Advocate and expert fees will be managed by the Company under the agreed membership terms."
    },
    {
      title: "Insurance & Compensation Support:",
      content: "RAPID MEDICOLEGAL SERVICES INDIA LTD. shall assist in arranging and renewing Professional Indemnity Insurance for both Doctor and Hospital through ICICI Lombard / The Oriental Insurance Co. Ltd. / or other approved insurers.",
      subBullets: [
        "Ensures 1:1 compensation coverage for consumer and civil cases",
        "Criminal case defense covered within membership without additional premium."
      ]
    },
    {
      title: "Transparency & Digital Case Updates:",
      content: "All case-related communication, updates, and document submissions shall be managed via secure digital platforms to ensure transparency and real-time tracking."
    },
    {
      title: "Confidentiality & Ethical Practice:",
      content: "All documents, communications, and records shared by the Doctor/Hospital shall remain strictly confidential. The Company operates fully within Indian legal frameworks and adheres to the National Medical Commission (NMC) Code of Ethics. No assistance will be provided for any illegal or unethical activity."
    },
    {
      title: "Professional Risk Management Commitment:",
      content: "RAPID MEDICOLEGAL SERVICES INDIA LTD. commits to:",
      bullets: [
        "Protecting both the Doctor and Hospital from all medico-legal liabilities",
        "Managing professional risks and litigation stress",
        "Enabling uninterrupted focus on clinical practice and patient care"
      ]
    }
  ];

  // Select services based on membership type
  // const getServices = () => {
  //   switch (membershipType) {
  //     case 'hospital':
  //       return hospitalServices;
  //     case 'individual':
  //       return individualServices;
  //     case 'combined':
  //       return combinedServices;
  //     default:
  //       return hospitalServices;
  //   }
  // };




   const getServices = () => {
    switch (membershipType) {
      case 'hospital':
        return { part1: hospitalServices, part2: [] };
      case 'individual':
        return { part1: individualServices, part2: [] };
      case 'combined':
        return { part1: combinedServicesPart1, part2: combinedServicesPart2 };
      default:
        return { part1: hospitalServices, part2: [] };
    }
  };

  const services = getServices();
  const renderServiceItem = (service, index) => (
    <div key={index} className="mb-2 scope-item">
      <div className="flex items-start">
        <span className="font-bold text-gray-800 flex-shrink-0 w-5">
          {index + 1}.
        </span>
        <h3 className="font-bold text-sm ml-1">
          {service.title}
        </h3>
      </div>

      {service.content && (
        <p className="ml-6 text-left leading-tight mt-0.5">
          {service.content}
        </p>
      )}

      {service.bullets && (
        <ul className="ml-6 list-none">
          {service.bullets.map((bullet, idx) => {
            const isSubHeading = bullet.endsWith(':');
            return (
              <li key={idx} className="flex items-start mt-0.5">
                {isSubHeading ? (
                  <span className="font-bold text-xs">{bullet}</span>
                ) : (
                  <>
                    <span className="mt-0.5 mr-1 flex-shrink-0">
                      {bullet.startsWith('✓') ? '✓' : <span className="text-green-600">✓</span>}
                    </span>
                    <span className="leading-tight">{bullet.replace(/^✓\s*/, '')}</span>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {service.subBullets && (
        <div className="ml-8">
          {service.subBullets.map((subBullet, idx) => (
            <div key={idx} className="flex items-start mt-0.5">
              <span className="mt-0.5 mr-1">•</span>
              <span className="leading-tight">{subBullet}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="scope-of-services">
      <h2 className="font-bold text-xl mb-3 text-left">
        Scope of Services:
      </h2>

      <div className="text-xs">
        {/* Part 1 - Will be on page 3 */}
        <div className="services-part-1">
          {services.part1.map((service, index) => renderServiceItem(service, index))}
        </div>

        {/* Part 2 - Will automatically go to page 4 */}
        {services.part2.length > 0 && (
          <div className="services-part-2 page-break-before mt-4 print:mt-[100px] print:pt-[100px]">
            {services.part2.map((service, index) => 
              renderServiceItem(service, index + services.part1.length)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScopeOfServices;