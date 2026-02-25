// // src/pages/Admin/Salesbill/Invoices/SAWHF-YearlyPlan.jsx
// import React from 'react';
// import { useParams } from 'react-router-dom';
// import useServiceAgreementData from './serviceAgreement(SA)/hooks/useServiceAgreementDate';
// import Header from './serviceAgreement(SA)/Header';
// import SectionBox from './serviceAgreement(SA)/SectionBox';
// import InfoTable from './serviceAgreement(SA)/InfoTable';
// import ParagraphBlock from './serviceAgreement(SA)/ParagraphBlock';
// import WitnessPoints from './serviceAgreement(SA)/WitnessPoints';
// import ScopeOfServices from './serviceAgreement(SA)/ScopeOfservices';
// import SignatureBlock from './serviceAgreement(SA)/SignatureBlock';

// const SAWHFYearlyPlan = () => {
//   const { id } = useParams();
//   const { doctor, members, policies, salesBill, loading, error } = useServiceAgreementData('yearly', id);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (error || !doctor || !policies || !salesBill) {
//     return <div className="text-center py-8 text-red-600">Error loading agreement data: {error || 'Missing Data'}</div>;
//   }

//   const agreementDate = new Date(salesBill.createdAt || salesBill.paymentStats?.paymentDate || Date.now()).toLocaleDateString('en-GB', {
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric'
//   });

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <>
//       <div className="text-end max-w-[80vw] sm:mb-4 my-6 print:hidden">
//         <button
//           onClick={handlePrint}
//           className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-colors text-sm"
//         >
//           🖨️ Print SAWHF
//         </button>
//         <button
//           onClick={() => { window.history.back() }}
//           className="w-full sm:w-auto px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 ml-4  bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-medium text-sm sm:text-base">
//           Back
//         </button>
//       </div>

//       <div className="font-[Times New Roman] text-[12px] leading-[18px] print:text-black bg-white">
//         <style jsx global>{`
//           @media print {
//             @page {
//               size: A4 portrait;
//               margin: 10mm 12mm 15mm 12mm;
//             }
//             body {
//               -webkit-print-color-adjust: exact !important;
//               print-color-adjust: exact !important;
//               margin: 0 !important;
//               padding: 0 !important;
//               font-size: 12px !important;
//               line-height: 18px !important;
//             }
//             .print-hidden {
//               display: none !important;
//             }
//             .a4-container {
//               max-width: 210mm !important;
//               width: 100% !important;
//               margin: 0 !important;
//               padding: 0 !important;
//               box-shadow: none !important;
//               page-break-inside: avoid !important;
//               orphans: 3 !important;
//               widows: 3 !important;
//             }
//             .break-before-page {
//               page-break-before: always !important;
//               break-before: page !important;
//             }
//             .break-inside-avoid {
//               page-break-inside: avoid !important;
//               break-inside: avoid !important;
//             }
//             table {
//               page-break-inside: avoid !important;
//               width: 100% !important;
//             }
//             th, td {
//               page-break-inside: avoid !important;
//             }
//             ol, ul {
//               page-break-inside: avoid !important;
//             }
//             .section-box {
//               page-break-inside: avoid !important;
//             }
//             /* Header spacing for SAWHF */
//             .header-spacing {
//               height: 95px !important;
//               margin-bottom: 0 !important;
//             }
//           }
//           .a4-container {
//             max-width: 210mm;
//             margin: 0 auto;
//             padding: 0 10mm;
//             box-shadow: 0 0 10px rgba(0,0,0,0.1);
//           }
//           @media screen {
//             .a4-container {
//               background: white;
//               min-height: 297mm;
//             }
//           }
//         `}</style>

//         <div className="a4-container">
//           {/* Header nahi dikhega lekin same height ka space chhodna hai - SAWHF */}
//           <div className="header-spacing h-[95px] print:h-[95px] mb-4 print:mb-0 invisible print:visible"></div>

//           <div className="break-inside-avoid">
//             <div className="section-box">
//               {/* SAWHF Title */}
//               <div className="text-center mb-6 border-b-2 border-gray-800 pb-2">
//                 <h1 className="text-lg font-bold uppercase print:mt-2 ">SERVICE AGREEMENT (SAWHF)</h1>
//               </div>

//               <SectionBox title="SERVICE AGREEMENT">
//                 <p className="mb-2">This Agreement for providing professional services is made at <b>{salesBill.city || 'Kolhapur'}</b> on this day of <b>{agreementDate}</b></p>
//                 {doctor.hasSpouse && doctor.spouseInfo ? (
//                   <p className="mb-2"><b>{doctor.fullName} & {doctor.spouseInfo.fullName}</b> residing at {doctor.address}, {doctor.city}, {doctor.state}, {doctor.country}, PIN CODE-{doctor.pincode} with medical council number <b>{doctor.medicalCouncilNumber} & {doctor.spouseInfo.medicalCouncilNumber}</b> Herein after referred as the doctor the one part.</p>
//                 ) : (
//                   <p className="mb-2"><b>{doctor.fullName}</b> residing at {doctor.address}, {doctor.city}, {doctor.state}, {doctor.country}, PIN CODE-{doctor.pincode} with medical council number <b>{doctor.medicalCouncilNumber}</b> Herein after referred as the doctor the one part.</p>
//                 )}
//                 <p className="mb-2 text-center uppercase font-bold">AND</p>
//                 <p>RAPID MEDICOLEGAL SERVICES INDIA LTD. A COMPANY REGISTERED UNDER THE COMPANIES ACT 2013, THROUGH ITS GENERAL MANAGER HAVING HEAD AND CORPORATE OFFICE AT OFFICE NO. 5 & 6, 3RD FLOOR, STAR TOWER, 1113/1, PANCH BUNGLOW, SHAHUPURI, KOLHAPUR, MAHARASHTRA, INDIA. 416001 herein after referred to as the service of the other part.</p>
//                 <p className="text-center mt-4">Both parties hereby agree as follows:</p>
//               </SectionBox>
//             </div>

//             {/* Group Purpose + Tables to avoid splits */}
//             <div className="break-inside-avoid">
//               <div className="section-box">
//                 <SectionBox title="PURPOSE OF AGREEMENT">
//                   <p>This Agreement outlines the terms and conditions under which Rapid Medico-legal Services India Ltd. shall provide medico-legal Support, documentation, case coordination, and membership-related service to the Doctors and Hospitals.</p>
//                 </SectionBox>
//               </div>
//             </div>

//             <InfoTable title="Membership Details" tableType="membership" data={members} />

//             <div className='print:pt-[10px]'>
//               <InfoTable title="Policy Details" tableType="policy" data={policies} />
//             </div>

//             <InfoTable title="Payment Details" tableType="payment" data={salesBill.paymentStats} />
//           </div>

//           {/* WHEREAS block - keep intact */}
//           <div className="break-inside-avoid">
//             <ParagraphBlock>
//               <p className="mb-2 font-bold uppercase print:pt-[40px]">WHEREAS</p>
//               <p>The member having his/her medical practice at (Hospital Name, Address) <span className='underline'>{doctor.formattedHospitalAddress || 'N/A'}</span>.</p>
//               <p>The member is fully aware that the medical profession is subject to potential risks arising from non-compliance with various statutory provisions and from cases of medical negligence.</p>
//               <p>The Company is engaged in providing its expert services in the field of Risk Management, Statutory Compliances, Insurance Consultancy, Legal and Para-Legal Assistance to medical professionals. The Company has professional tie-ups and retainer-ship arrangements with advocates, insurance companies, and medico-legal experts across India to support doctors and hospitals in their medico-legal needs.</p>
//               <p>The Company has tie-up with Insurance Companies and is an agent for the whole of India. The Insurance Company covers the compensation part for the Consumer cases only. The Risk Management covers all others risks including giving doorstep services for the product of its primary insurer also and takes the assurance of the payment of compensation by the primary insurer with the limits of insurance cover and as per insurance terms and conditions.</p>
//               <p>The Doctor has approaches to the company and applied for the service package offered by the Company on a yearly basis/Annual and the Company has agreed to provide its services in accordance with the terms and conditions set forth herein.</p>
//             </ParagraphBlock>
//           </div>

//           <WitnessPoints />

//           {/* Group Scope + Signature together on final page */}
//           <div className="break-before-page break-inside-avoid min-h-[140mm] flex flex-col justify-end">
//             <ScopeOfServices color="text-red-600" />
//             <SignatureBlock doctorName={doctor.hasSpouse && doctor.spouseInfo ? `${doctor.fullName} & ${doctor.spouseInfo.fullName}` : doctor.fullName} date={agreementDate} hideFooter={true} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SAWHFYearlyPlan;


// src/pages/Admin/Salesbill/Invoices/SAWHF-YearlyPlan.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import useServiceAgreementData from './serviceAgreement(SA)/hooks/useServiceAgreementDate';
import Header from './serviceAgreement(SA)/Header';
import SectionBox from './serviceAgreement(SA)/SectionBox';
import InfoTable from './serviceAgreement(SA)/InfoTable';
import ParagraphBlock from './serviceAgreement(SA)/ParagraphBlock';
import WitnessPoints from './serviceAgreement(SA)/WitnessPoints';
import ScopeOfServices from './serviceAgreement(SA)/ScopeOfservices';
import SignatureBlock from './serviceAgreement(SA)/SignatureBlock';

const SAWHFYearlyPlan = () => {
  const { id } = useParams();
  const { doctor, members, policies, salesBill, loading, error } = useServiceAgreementData('yearly', id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !doctor || !policies || !salesBill) {
    return <div className="text-center py-8 text-red-600">Error loading agreement data: {error || 'Missing Data'}</div>;
  }

  const agreementDate = new Date(salesBill.createdAt || salesBill.paymentStats?.paymentDate || Date.now()).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="text-end max-w-[80vw] sm:mb-4 my-6 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-colors text-sm"
        >
          🖨️ Print SAWHF
        </button>
        <button
          onClick={() => { window.history.back() }}
          className="w-full sm:w-auto px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 ml-4  bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-medium text-sm sm:text-base">
          Back
        </button>
      </div>

      <div className="font-[Times New Roman] text-[12px] leading-[18px] print:text-black bg-white">
        <style jsx global>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm 12mm 15mm 12mm;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              margin: 0 !important;
              padding: 0 !important;
              font-size: 12px !important;
              line-height: 18px !important;
            }
            .print-hidden {
              display: none !important;
            }
            .a4-container {
              max-width: 210mm !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              page-break-inside: avoid !important;
              orphans: 3 !important;
              widows: 3 !important;
            }
            .break-before-page {
              page-break-before: always !important;
              break-before: page !important;
            }
            .break-inside-avoid {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            table {
              page-break-inside: avoid !important;
              width: 100% !important;
            }
            th, td {
              page-break-inside: avoid !important;
            }
            ol, ul {
              page-break-inside: avoid !important;
            }
            .section-box {
              page-break-inside: avoid !important;
            }
            /* Header spacing for SAWHF */
            .header-spacing {
              height: 95px !important;
              margin-bottom: 0 !important;
            }
          }
          .a4-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 0 10mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          @media screen {
            .a4-container {
              background: white;
              min-height: 297mm;
            }
          }
        `}</style>

        <div className="a4-container">
          {/* Header nahi dikhega lekin same height ka space chhodna hai - SAWHF */}
          <div className="header-spacing h-[95px] print:h-[95px] mb-4 print:mb-0 invisible print:visible"></div>

          <div className="break-inside-avoid">
            <div className="section-box">
              {/* SAWHF Title */}
              <div className="text-center mb-6 border-b-2 border-gray-800 pb-2">
                <h1 className="text-lg font-bold uppercase print:mt-2 ">SERVICE AGREEMENT (SAWHF)</h1>
              </div>

              <SectionBox title="SERVICE AGREEMENT">
                <p className="mb-2">This Agreement for providing professional services is made at <b>{salesBill.city || 'Kolhapur'}</b> on this day of <b>{agreementDate}</b></p>
                {doctor.hasSpouse && doctor.spouseInfo ? (
                  <p className="mb-2"><b>{doctor.fullName} & {doctor.spouseInfo.fullName}</b> residing at {doctor.address}, {doctor.city}, {doctor.state}, {doctor.country}, PIN CODE-{doctor.pincode} with medical council number <b>{doctor.medicalCouncilNumber} & {doctor.spouseInfo.medicalCouncilNumber}</b> Herein after referred as the doctor the one part.</p>
                ) : doctor.doctorType === 'hospital' ? (
                  <p className="mb-2"><b>{doctor.hospitalName}</b> having its registered office at {doctor.hospitalAddress}, {doctor.city}, {doctor.state}, {doctor.country}, PIN CODE-{doctor.pincode} Herein after referred as the doctor the one part.</p>
                ) : doctor.doctorType === 'hospital_individual' && !doctor.hasSpouse ? (
                  <p className="mb-2"><b>{doctor.fullName}</b> (representing {doctor.hospitalName}) residing at {doctor.address}, {doctor.city}, {doctor.state}, {doctor.country}, PIN CODE-{doctor.pincode} with medical council number <b>{doctor.medicalCouncilNumber}</b> Herein after referred as the doctor the one part.</p>
                ) : (
                  <p className="mb-2"><b>{doctor.fullName}</b> residing at {doctor.address}, {doctor.city}, {doctor.state}, {doctor.country}, PIN CODE-{doctor.pincode} with medical council number <b>{doctor.medicalCouncilNumber}</b> Herein after referred as the doctor the one part.</p>
                )}
                <p className="mb-2 text-center uppercase font-bold">AND</p>
                <p>RAPID MEDICOLEGAL SERVICES INDIA LTD. A COMPANY REGISTERED UNDER THE COMPANIES ACT 2013, THROUGH ITS GENERAL MANAGER HAVING HEAD AND CORPORATE OFFICE AT OFFICE NO. 5 & 6, 3RD FLOOR, STAR TOWER, 1113/1, PANCH BUNGLOW, SHAHUPURI, KOLHAPUR, MAHARASHTRA, INDIA. 416001 herein after referred to as the service of the other part.</p>
                <p className="text-center mt-4">Both parties hereby agree as follows:</p>
              </SectionBox>
            </div>

            {/* Group Purpose + Tables to avoid splits */}
            <div className="break-inside-avoid">
              <div className="section-box">
                <SectionBox title="PURPOSE OF AGREEMENT">
                  <p>This Agreement outlines the terms and conditions under which Rapid Medico-legal Services India Ltd. shall provide medico-legal Support, documentation, case coordination, and membership-related service to the Doctors and Hospitals.</p>
                </SectionBox>
              </div>
            </div>

            <InfoTable title="Membership Details" tableType="membership" data={members} />

            <div className='print:pt-[10px]'>
              <InfoTable title="Policy Details" tableType="policy" data={policies} />
            </div>

            <InfoTable title="Payment Details" tableType="payment" data={salesBill.paymentStats} />
          </div>

          {/* WHEREAS block - keep intact */}
          <div className="break-inside-avoid">
            <ParagraphBlock>
              <p className="mb-2 font-bold uppercase print:pt-[40px]">WHEREAS</p>
              {doctor.doctorType === 'hospital' ? (
                <p>The member having its medical practice at <span className='underline'>{doctor.formattedHospitalAddress || 'N/A'}</span>.</p>
              ) : (
                <p>The member having his/her medical practice at <span className='underline'>{doctor.formattedHospitalAddress || 'N/A'}</span>.</p>
              )}
              <p>The member is fully aware that the medical profession is subject to potential risks arising from non-compliance with various statutory provisions and from cases of medical negligence.</p>
              <p>The Company is engaged in providing its expert services in the field of Risk Management, Statutory Compliances, Insurance Consultancy, Legal and Para-Legal Assistance to medical professionals. The Company has professional tie-ups and retainer-ship arrangements with advocates, insurance companies, and medico-legal experts across India to support doctors and hospitals in their medico-legal needs.</p>
              <p>The Company has tie-up with Insurance Companies and is an agent for the whole of India. The Insurance Company covers the compensation part for the Consumer cases only. The Risk Management covers all others risks including giving doorstep services for the product of its primary insurer also and takes the assurance of the payment of compensation by the primary insurer with the limits of insurance cover and as per insurance terms and conditions.</p>
              <p>The Doctor has approaches to the company and applied for the service package offered by the Company on a yearly basis/Annual and the Company has agreed to provide its services in accordance with the terms and conditions set forth herein.</p>
            </ParagraphBlock>
          </div>

          <WitnessPoints />

          {/* Group Scope + Signature together on final page */}
          <div className="break-before-page break-inside-avoid min-h-[140mm] flex flex-col justify-end">
            <ScopeOfServices color="text-red-600" />
            <SignatureBlock
              doctorName={
                doctor.hasSpouse && doctor.spouseInfo
                  ? `${doctor.fullName} & ${doctor.spouseInfo.fullName}`
                  : doctor.doctorType === 'hospital_individual' && !doctor.hasSpouse
                  ? `${doctor.fullName} (representing ${doctor.hospitalName})`
                  : doctor.doctorType === 'hospital'
                  ? doctor.hospitalName
                  : doctor.fullName
              }
              date={agreementDate}
              hideFooter={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SAWHFYearlyPlan;