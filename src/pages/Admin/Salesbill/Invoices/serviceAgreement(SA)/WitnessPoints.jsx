// // components/WitnessPoints.jsx
// import React from 'react';

// const WitnessPoints = () => (
//   <ol className="list-decimal ml-4 space-y-2 text-[12px] leading-[18px] break-inside-avoid">
//     <li className="mb-4">
//       <span className="font-bold">24×7 Medico-Legal Assistance and 360° Protection:</span> The Company shall provide continuous medico-legal support and complete professional protection to the Doctor and/or Hospital. This includes guidance, case documentation, and coordination with advocates and medico-legal experts whenever required.
//     </li>
//     <li className="mb-4">
//       <span className="font-bold">Comprehensive Case Handling During Membership Period:</span> The Company shall manage, coordinate, and supervise all medico-legal cases pertaining to the Doctor/Hospital during the membership period, including risk management, drafting, case filing, advocate assignment, documentation, and regular follow-up until closure.
//     </li>
//     <li className="mb-4">
//       <span className="font-bold">Membership Coverage Types:</span>
//       <div className="ml-4 mt-2">
//         <b>(a) Individual Doctor Membership:</b> This membership provides medico-legal protection to the Doctor for issues arising from their professional practice. The coverage includes:
//         <ol className="list-roman ml-4 mt-2 space-y-1">
//           <li><b>Coverage for all cases:</b>
//             <ul className="list-disc ml-4 mt-1 space-y-1">
//               <li>Legal assistance in matters of alleged professional negligence or compensation claims before any court, forum, or authority (civil, criminal, consumer).</li>
//               <li>Defense and representation in proceedings initiated under the Bharatiya Nyaya Sanhita (BNS), 2023, or any other applicable laws.</li>
//               <li>Representation and guidance in cases filed before consumer forums or other adjudicating authorities.</li>
//               <li>Assistance and representation in disciplinary inquiries before medical councils or competent regulatory bodies.</li>
//             </ul>
//           </li>
//           <li><b>Drafting & Notice Handling:</b> Drafting and replying to legal notices, complaints, or summons received in connection with the Doctor's professional duties.</li>
//           <li><b>Police or Media Issues:</b> Guidance and legal help in case of harassment, false allegations, or defamatory publications related to medical practice. Initiation of appropriate legal proceedings against any false media reports, defamatory content, or bad publicity made against the Doctor, including print, electronic, or social media, as deemed necessary and in the Doctor's interest.</li>
//           <li><b>Legal Advisory Support:</b> Continuous advisory services on medico-legal queries, record-keeping, consent forms, and patient communication to prevent disputes.</li>
//         </ol>
//         <b>(b) Hospital Membership:</b> This membership provides comprehensive medico-legal and administrative protection to the hospital in relation to its operations and management. The coverage includes:
//         <ol className="list-roman ml-4 mt-2 space-y-1">
//           <li><b>Hospital Negligence & Patient Complaints:</b> Legal assistance in matters arising from alleged hospital negligence, billing disputes, or patient complaints. Assistance in recovery suit from patients under similar section.</li>
//           <li><b>Staff-Related Issues:</b>
//             <ul className="list-disc ml-4 mt-1 space-y-1">
//               <li>Support and representation in cases involving professional misconduct, negligence, or disciplinary actions concerning hospital staff.</li>
//               <li>All coverage to doctors staff, Qualified/Non-Qualified Nursing staff, and on call doctors while engaged with the hospital, for any issue arising from professional practice, alleged negligence, or misconduct during their tenure.</li>
//             </ul>
//           </li>
//           <li><b>Police Complaints, Legal Notices & Financial Offences:</b> Assistance in responding to or defending police complaints, FIRs, or legal notices received by the hospital or its management.</li>
//           <li><b>Third-Party & Vendor Issues:</b> Guidance and legal support for disputes arising from third-party machinery purchases or service agreements.</li>
//           <li><b>Defamation & Media Issues:</b> Legal defense and representation in matters of defamation, false or misleading media reports, and public allegations. Taking necessary legal action against false media reports, defamatory statements, or bad publicity related to the hospital or its associated doctors (print, electronic, or social media), subject to proper authorization.</li>
//           <li><b>Harassment & Threats:</b> Legal guidance in cases of harassment, threats, or obstruction faced by hospital administration or staff while performing professional duties.</li>
//           <li><b>Legal Advisory Support:</b> Continuous advisory services on medico-legal queries, record-keeping, consent forms, and patient communication to prevent disputes.</li>
//         </ol>
//         <b>(c) Individual + Hospital Membership:</b> Provides defined medico-legal assistance for both doctors and the hospital under a single plan, subject to written authorization for the services specified above.
//       </div>
//     </li>
//     <li className="mb-4"><span className="font-bold">Risk Management and Legal Representation:</span> The Company shall assist in professional risk management and medico-legal defense, from the initial complaint or FIR stage up to higher judicial forums, including the Hon'ble Supreme Court of India.</li>
//     <li className="mb-4"><span className="font-bold">Advocate and Expert Fees:</span> For members covered under Company tie-up plans, the Company shall pay advocate and expert fees directly as per the agreed terms. Additional expenses beyond plan limits require prior written approval.</li>
//     <li className="mb-4"><span className="font-bold">Case Updates and Co-ordination:</span> The Company shall maintain transparent co-ordination with advocates and provide timely updates through authorized digital means.</li>
//     <li className="mb-4"><span className="font-bold">Stamp Duty:</span> stamp duty must be payable by the Doctor or Hospital side.</li>
//     <li className="mb-4"><span className="font-bold">Prohibition on Illegal or Unethical Practice:</span> The Company shall not assist in any illegal, unethical, or unlawful activity. Membership may be immediately terminated if such involvement is found.</li>
//     <li className="mb-4"><span className="font-bold">Professional Conduct and Ethical Standards:</span> All services shall adhere to the Medical Council of India (NMC) Code of Ethics and Indian law.</li>
//     <li className="mb-4"><span className="font-bold">Professional Support Commitment:</span> The Company commits to lawful, ethical, and professional conduct while supporting Doctors and Hospitals in medico-legal matters.</li>
//     <li className="mb-4">
//       <span className="font-bold">Additional Terms and Conditions</span>
//       <ol className="list-roman ml-4 mt-2 space-y-1">
//         <li>The Company shall provide all agreed services, legal advice, and representation by experienced medico-legal professionals before appropriate judicial, quasi-judicial, or administrative authorities.</li>
//         <li>The Company undertakes to maintain secrecy and confidentiality of all documents and information shared by the Doctor.</li>
//         <li>The Company shall not disclose any such information to third parties unless required by law or authorized by the Doctor.</li>
//         <li>The Company shall arrange Doctor's Professional Indemnity Insurance through ICICI Lombard / The Oriental Insurance Co. Ltd. or any other insurer, ensuring 1:1 compensation coverage for consumer cases only.</li>
//         <li>The Company shall manage renewal of indemnity insurance and risk management coverage during the active membership period.</li>
//         <li>The Company shall handle all cases from hospital/clinic level up to the Hon'ble Supreme Court of India where necessary.</li>
//         <li>It is the Doctor's duty to provide all necessary information, documents, and cooperation required by the Company to render its services. The Company shall not be liable for non-performance caused by insufficient information.</li>
//       </ol>
//     </li>
//     <li className="mb-4">
//       <span className="font-bold">The Doctor's practice shall be covered under:</span>
//       <ol className="list-roman ml-4 mt-2 space-y-1">
//         <li>Doctor's registered clinic/hospital.</li>
//         <li>Individual and visiting practice across India.</li>
//       </ol>
//     </li>
//     <li className="mb-4">
//       <span className="font-bold">This Agreement does not cover:</span>
//       <ol className="list-roman ml-4 mt-2 space-y-1">
//         <li>Any pre-existing legal suits or ongoing litigation.</li>
//         <li>Legal actions initiated before the date of signing this Agreement.</li>
//         <li>Cases where the cause of action occurred before the Agreement date.</li>
//         <li>Any illegal or unethical practice.</li>
//         <li>Court stamp duty, which remains the Doctor's responsibility after its termination.</li>
//         <li>This Agreement does not cover any legal action initiated after its termination.</li>
//       </ol>
//     </li>
//     <li className="mb-4">
//       <span className="font-bold">Payment Terms:</span>
//       <ol className="list-roman ml-4 mt-2 space-y-1">
//         <li>The membership fee shall be paid as per the chosen plan (monthly/annual).</li>
//         <li>Payments shall be made through authorized modes (Online / Auto Debit / NACH / Bank Transfer/ By Cheque).</li>
//         <li>The Company reserves the right to suspend services for non-payment or delay.</li>
//         <li>Advocate and expert fees beyond membership scope will be billed separately after prior consent.</li>
//         <li>The service fees paid under this agreement are non-refundable under any circumstances, once the service agreement has been signed.</li>
//       </ol>
//     </li>
//     <li className="mb-4"><span className="font-bold">Confidentiality & Data Protection:</span> All client data shall remain confidential and protected under the Information Technology Act, 2000. The Company shall not disclose any personal or case-related data to third parties without lawful authorization or consent.</li>
//     <li className="mb-4"><span className="font-bold">Liability & Limitations:</span> The Company provides advisory, coordination, and legal support services but shall not be held responsible for the outcome of any judicial proceeding. Services are limited to lawful and professional assistance during the membership term.</li>
//     <li className="mb-4">
//       <span className="font-bold">Termination:</span>
//       <ol className="list-roman ml-4 mt-2 space-y-1">
//         <li>Either party may terminate this Agreement with 30 days' written notice.</li>
//         <li>Monthly membership plan has one-year lock-in. no cancellation or disconnection is allowed before completing one year.</li>
//         <li>The Company may terminate the membership immediately in cases involving unethical or illegal activity by the Doctor/Hospital and the delay payments of 7 days.</li>
//       </ol>
//     </li>
//     <li className="mb-4">
//       <span className="font-bold">Dispute Resolution:</span>
//       <ol className="list-roman ml-4 mt-2 space-y-1">
//         <li>Any dispute arising out of this Agreement shall be referred to arbitration under the Arbitration and Conciliation Act, 1996.</li>
//         <li>The Arbitrator shall be a mutually agreed medico-legal professional. The award shall be final and binding. Jurisdiction shall be at the city of the Company's registered office.</li>
//       </ol>
//     </li>
//   </ol>
// );

// export default WitnessPoints;










// Updated components/WitnessPoints.jsx
import React from 'react';

const WitnessPoints = () => (
  <div className="text-black-990  my-4 break-inside-avoid">
    <div>
        {/* <span className="font-bold text-[12px] uppercase">NOW THIS INDENTURE WITNESSES AS UNDER</span> */}
    </div>
    {/* <p className="font-bold uppercase mb-2">NOW THIS INDENTURE WITNESSES AS UNDER</p> */}
    <ol className="list-decimal ml-4 space-y-2 print:pt-[35px]">
        <span className="font-extrabold text-[14px] uppercase list-none">NOW THIS INDENTURE WITNESSES AS UNDER</span>
      <li className="mb-4">
        <span className="font-bold">24×7 Medico-Legal Assistance and 360° Protection:</span> The Company shall provide continuous medico-legal support and complete professional protection to the Doctor and/or Hospital. This includes guidance, case documentation, and coordination with advocates and medico-legal experts whenever required.
      </li>
      <li className="mb-4">
        <span className="font-bold">Comprehensive Case Handling During Membership Period:</span> The Company shall manage, coordinate, and supervise all medico-legal cases pertaining to the Doctor/Hospital during the membership period, including risk management, drafting, case filing, advocate assignment, documentation, and regular follow-up until closure.
      </li>
      <li className="mb-4">
        <span className="font-bold">Membership Coverage Types:</span>
        <div className="ml-4 mt-2">
          <b>(a) Individual Doctor Membership:</b> This membership provides medico-legal protection to the Doctor for issues arising from their professional practice. The coverage includes:
          <div className="ml-4 mt-2">
            <b>i. Coverage for all cases:</b>
            <ul className="list-none ml-4 mt-1 space-y-1">
              <li className="flex items-start"><span className="text-black mr-2 flex-shrink-0">✓</span>Legal assistance in matters of alleged professional negligence or compensation claims before any court, forum, or authority (civil, criminal, consumer).</li>
              <li className="flex items-start"><span className="text-black mr-2 flex-shrink-0">✓</span>Defense and representation in proceedings initiated under the Bharatiya Nyaya Sanhita (BNS), 2023, or any other applicable laws.</li>
              <li className="flex items-start"><span className="text-black mr-2 flex-shrink-0">✓</span>Representation and guidance in cases filed before consumer forums or other adjudicating authorities.</li>
              <li className="flex items-start"><span className="text-black mr-2 flex-shrink-0">✓</span>Assistance and representation in disciplinary inquiries before medical councils or competent regulatory bodies.</li>
            </ul>
          </div>
          <div className="ml-4 mt-2">
            <b>ii. Drafting & Notice Handling:</b> Drafting and replying to legal notices, complaints, or summons received in connection with the Doctor's professional duties.
          </div>
          <div className="ml-4 mt-2">
            <b>iii. Police or Media Issues:</b> Guidance and legal help in case of harassment, false allegations, or defamatory publications related to medical practice. Initiation of appropriate legal proceedings against any false media reports, defamatory content, or bad publicity made against the Doctor, including print, electronic, or social media, as deemed necessary and in the Doctor's interest.
          </div>
          <div className="ml-4 mt-2">
            <b>iv. Legal Advisory Support:</b> Continuous advisory services on medico-legal queries, record-keeping, consent forms, and patient communication to prevent disputes.
          </div>
          <b>(b) Hospital Membership:</b> This membership provides comprehensive medico-legal and administrative protection to the hospital in relation to its operations and management. The coverage includes:
          <div className="ml-4 mt-2">
            <b>i. Hospital Negligence & Patient Complaints:</b> Legal assistance in matters arising from alleged hospital negligence, billing disputes, or patient complaints. Assistance in recovery suit from patients under similar section.
          </div>
          <div className="ml-4 mt-2">
            <b>ii. Staff-Related Issues:</b>
            <ul className="list-none ml-4 mt-1 space-y-1">
              <li className="flex items-start"><span className="text-black mr-2 flex-shrink-0">✓</span>Support and representation in cases involving professional misconduct, negligence, or disciplinary actions concerning hospital staff.</li>
              <li className="flex items-start"><span className="text-black mr-2 flex-shrink-0">✓</span>All coverage to doctors staff, Qualified/Non-Qualified Nursing staff, and on call doctors while engaged with the hospital, for any issue arising from professional practice, alleged negligence, or misconduct during their tenure.</li>
            </ul>
          </div>
          <div className="ml-4 mt-2">
            <b>iii. Police Complaints, Legal Notices & Financial Offences:</b> Assistance in responding to or defending police complaints, FIRs, or legal notices received by the hospital or its management.
          </div>
          <div className="ml-4 mt-2">
            <b>iv. Third-Party & Vendor Issues:</b> Guidance and legal support for disputes arising from third-party machinery purchases or service agreements.
          </div>
          <div className="ml-4 mt-2">
            <b>v. Defamation & Media Issues:</b> Legal defense and representation in matters of defamation, false or misleading media reports, and public allegations. Taking necessary legal action against false media reports, defamatory statements, or bad publicity related to the hospital or its associated doctors (print, electronic, or social media), subject to proper authorization.
          </div>
          <div className="ml-4 mt-2">
            <b>vi. Harassment & Threats:</b> Legal guidance in cases of harassment, threats, or obstruction faced by hospital administration or staff while performing professional duties.
          </div>
          <div className="ml-4 mt-2">
            <b>vii. Legal Advisory Support:</b> Continuous advisory services on medico-legal queries, record-keeping, consent forms, and patient communication to prevent disputes.
          </div>
          <b>(c) Individual + Hospital Membership:</b> Provides defined medico-legal assistance for both doctors and the hospital under a single plan, subject to written authorization for the services specified above.
        </div>
      </li>
      <li className="mb-4"><span className="font-bold">Risk Management and Legal Representation:</span> The Company shall assist in professional risk management and medico-legal defense, from the initial complaint or FIR stage up to higher judicial forums, including the Hon'ble Supreme Court of India.</li>
      <li className="mb-4"><span className="font-bold">Advocate and Expert Fees:</span> For members covered under Company tie-up plans, the Company shall pay advocate and expert fees directly as per the agreed terms. Additional expenses beyond plan limits require prior written approval.</li>
      <li className="mb-4"><span className="font-bold">Case Updates and Co-ordination:</span> The Company shall maintain transparent co-ordination with advocates and provide timely updates through authorized digital means.</li>
      <li className="mb-4"><span className="font-bold">Stamp Duty:</span> stamp duty must be payable by the Doctor or Hospital side.</li>
      <li className="mb-4"><span className="font-bold">Prohibition on Illegal or Unethical Practice:</span> The Company shall not assist in any illegal, unethical, or unlawful activity. Membership may be immediately terminated if such involvement is found.</li>
      <li className="mb-4"><span className="font-bold">Professional Conduct and Ethical Standards:</span> All services shall adhere to the Medical Council of India (NMC) Code of Ethics and Indian law.</li>
      <li className="mb-4 print:pt-[30px] "><span className="font-bold">Professional Support Commitment:</span> The Company commits to lawful, ethical, and professional conduct while supporting Doctors and Hospitals in medico-legal matters.</li>
      <li className="mb-4">
        <span className="font-bold">Additional Terms and Conditions</span>
        <ol className="list-roman ml-4 mt-2 space-y-1">
          <li>The Company shall provide all agreed services, legal advice, and representation by experienced medico-legal professionals before appropriate judicial, quasi-judicial, or administrative authorities.</li>
          <li>The Company undertakes to maintain secrecy and confidentiality of all documents and information shared by the Doctor.</li>
          <li>The Company shall not disclose any such information to third parties unless required by law or authorized by the Doctor.</li>
          <li>The Company shall arrange Doctor's Professional Indemnity Insurance through ICICI Lombard / The Oriental Insurance Co. Ltd. or any other insurer, ensuring 1:1 compensation coverage for consumer cases only.</li>
          <li>The Company shall manage renewal of indemnity insurance and risk management coverage during the active membership period.</li>
          <li>The Company shall handle all cases from hospital/clinic level up to the Hon'ble Supreme Court of India where necessary.</li>
          <li>It is the Doctor's duty to provide all necessary information, documents, and cooperation required by the Company to render its services. The Company shall not be liable for non-performance caused by insufficient information.</li>
        </ol>
      </li>
      <li className="mb-4">
        <span className="font-bold">The Doctor's practice shall be covered under:</span>
        <ol className="list-roman ml-4 mt-2 space-y-1">
          <li>Doctor's registered clinic/hospital.</li>
          <li>Individual and visiting practice across India.</li>
        </ol>
      </li>
      <li className="mb-4">
        <span className="font-bold">This Agreement does not cover:</span>
        <ol className="list-roman ml-4 mt-2 space-y-1">
          <li>Any pre-existing legal suits or ongoing litigation.</li>
          <li>Legal actions initiated before the date of signing this Agreement.</li>
          <li>Cases where the cause of action occurred before the Agreement date.</li>
          <li>Any illegal or unethical practice.</li>
          <li>Court stamp duty, which remains the Doctor's responsibility after its termination.</li>
          <li>This Agreement does not cover any legal action initiated after its termination.</li>
        </ol>
      </li>
      <li className="mb-4">
        <span className="font-bold">Payment Terms:</span>
        <ol className="list-roman ml-4 mt-2 space-y-1">
          <li>The membership fee shall be paid as per the chosen plan (monthly/annual).</li>
          <li>Payments shall be made through authorized modes (Online / Auto Debit / NACH / Bank Transfer/ By Cheque).</li>
          <li>The Company reserves the right to suspend services for non-payment or delay.</li>
          <li>Advocate and expert fees beyond membership scope will be billed separately after prior consent.</li>
          <li>The service fees paid under this agreement are non-refundable under any circumstances, once the service agreement has been signed.</li>
        </ol>
      </li>
      <li className="mb-4"><span className="font-bold">Confidentiality & Data Protection:</span> All client data shall remain confidential and protected under the Information Technology Act, 2000. The Company shall not disclose any personal or case-related data to third parties without lawful authorization or consent.</li>
      <li className="mb-4"><span className="font-bold">Liability & Limitations:</span> The Company provides advisory, coordination, and legal support services but shall not be held responsible for the outcome of any judicial proceeding. Services are limited to lawful and professional assistance during the membership term.</li>
      <li className="mb-4">
        <span className="font-bold">Termination:</span>
        <ol className="list-roman ml-4 mt-2 space-y-1">
          <li>Either party may terminate this Agreement with 30 days' written notice.</li>
          <li>Monthly membership plan has one-year lock-in. no cancellation or disconnection is allowed before completing one year.</li>
          <li>The Company may terminate the membership immediately in cases involving unethical or illegal activity by the Doctor/Hospital and the delay payments of 7 days.</li>
        </ol>
      </li>
      <li className="mb-4">
        <span className="font-bold">Dispute Resolution:</span>
        <ol className="list-roman ml-4 mt-2 space-y-1">
          <li>Any dispute arising out of this Agreement shall be referred to arbitration under the Arbitration and Conciliation Act, 1996.</li>
          <li>The Arbitrator shall be a mutually agreed medico-legal professional. The award shall be final and binding. Jurisdiction shall be at the city of the Company's registered office.</li>
        </ol>
      </li>
    </ol>
  </div>
);

export default WitnessPoints;