

import React from 'react';

export default function ServiceAgreementExact() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg p-[20mm] print:shadow-none print:p-[15mm]">
        
        {/* Header with Logo */}
        <div className="flex justify-between items-start border-b-[3px] border-orange-600 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="leading-none">
              <span className="text-[42px] font-black text-orange-600 tracking-tighter">RAPID</span>
              <span className="text-[20px] text-red-600 font-bold relative -top-4">®</span>
            </div>
            <div className="text-[32px] text-red-600 font-bold leading-none">MEDICOLEGAL</div>
          </div>
          <div className="text-right">
            <div className="text-[14px] font-bold text-gray-800">RAPID MEDICOLEGAL SERVICES INDIA LTD.</div>
            <div className="text-[9px] text-gray-700">rapidmedicolegal@gmail.com | rapidmedicolegal@gmail.com</div>
            <div className="text-[11px] font-semibold text-gray-800 mt-1">360° Medicolegal Protection</div>
            <div className="text-[9px] italic text-gray-600">An ISO 9001:2015 certified Company</div>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-center text-2xl font-bold uppercase mb-6 border-b border-gray-400 pb-3">
          SERVICE AGREEMENT
        </h1>

        {/* Parties Section */}
        <div className="text-[11pt] leading-relaxed text-justify mb-8">
          <p className="text-center font-semibold mb-6">
            This Agreement for providing professional services is made at <strong>Kolhapur</strong> on this day of <strong>29 October, 2025</strong>
          </p>
          <p className="mb-4">
            <strong>DR. AMRITA SHARAD SHINDE</strong> residing at FLAT NO. 8, YASHWANT PARK DHRUV RECIDENCY, KOLHAPUR, 
            MAHARASHTRA, INDIA, PIN CODE-416003 with medical council number – _____________ Herein after referred as the 
            <strong> doctor</strong> the one part.
          </p>
          <p className="text-center text-xl font-bold my-6">AND</p>
          <p className="mb-4">
            <strong>RAPID MEDICOLEGAL SERVICES INDIA LTD.</strong> A COMPANY REGISTERED UNDER THE COMPANIES ACT 2013, THROUGH 
            ITS GENERAL MANAGER HAVING HEAD AND CORPORATE OFFICE AT. OFFICE NO. 5 & 6, 3RD FLOOR, STAR TOWER, 
            1113/1, PANCH BUNGLOW, SHAHUPURI, KOLHAPUR, MAHARASHTRA, INDIA. 416001 herein after referred to as the 
            <strong> service</strong> of the other part.
          </p>
          <p className="text-center font-semibold mt-8">Both parties hereby agree as follows:</p>
        </div>

        {/* Purpose */}
        <div className="mb-6">
          <div className="text-[13pt] font-bold underline mb-3">PURPOSE OF AGREEMENT</div>
          <p className="text-[11pt] leading-relaxed text-justify">
            This Agreement outlines the terms and conditions under which <strong>Rapid Medico-legal Services India Ltd.</strong> 
            shall provide medico-legal Support, documentation, case coordination, and membership-related service 
            to the Doctors and Hospitals.
          </p>
        </div>

        {/* Membership Details Table */}
        <div className="mb-8">
          <div className="font-semibold mb-2 text-[11pt]">Membership Details:</div>
          <table className="w-full border-collapse text-[10pt]">
            <thead>
              <tr>
                <td className="border border-black bg-blue-100 font-bold text-center p-2">Particular</td>
                <td className="border border-black bg-blue-100 font-bold text-center p-2">Details</td>
              </tr>
            </thead>
            <tbody>
              {["Doctor Name","Hospital Name","Qualification","Specialization","M. Register Number","M. Registration Year",
                "Membership Type","Membership Period","Membership ID","Start Date","End Date"].map((item,idx)=>
                <tr key={idx}>
                  <td className="border border-black p-2 font-semibold">{item}</td>
                  <td className="border border-black p-2 h-8"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Policy Details Table */}
        <div className="mb-8">
          <div className="font-semibold mb-2 text-[11pt]">Policy Details:</div>
          <table className="w-full border-collapse text-[10pt]">
            <thead>
              <tr>
                <td className="border border-black bg-blue-100 font-bold text-center p-2">Particular</td>
                <td className="border border-black bg-blue-100 font-bold text-center p-2">Details</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 font-semibold">Insurance Co. Name</td>
                <td className="border border-black p-2 h-8"></td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold">Type of Policy</td>
                <td className="border border-black p-2 h-8"></td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold">Policy Number</td>
                <td className="border border-black p-2 h-8"></td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold">Policy Cover</td>
                <td className="border border-black p-2 h-8"></td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold">Policy Duration</td>
                <td className="border border-black p-2 h-8"></td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold">Policy Premium</td>
                <td className="border border-black p-2">If paid by rapid – INCLUDING SERVICE CHARGES if paid by doctor – PAID BY DOCTOR SIDE</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold">Start Date</td>
                <td className="border border-black p-2 h-8"></td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-semibold">End Date</td>
                <td className="border border-black p-2 h-8"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Details Table */}
        <div className="mb-8">
          <div className="font-semibold mb-2 text-[11pt]">Payment Details:</div>
          <table className="w-full border-collapse text-[10pt]">
            <thead>
              <tr>
                <td className="border border-black bg-blue-100 font-bold text-center p-2">Particular</td>
                <td className="border border-black bg-blue-100 font-bold text-center p-2">Details</td>
              </tr>
            </thead>
            <tbody>
              {["Payment Date","Payment Mode","Cheque no. / Tr. no.","Drawn On","Amount Paid"].map((item,idx)=>
                <tr key={idx}>
                  <td className="border border-black p-2 font-semibold">{item}</td>
                  <td className="border border-black p-2 h-8"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Note Box */}
        <div className="mb-8">
          <div className="font-semibold mb-2 text-[11pt]">Note :</div>
          <div className="border border-gray-300 min-h-[80px] p-3"></div>
        </div>

        {/* WHEREAS Section */}
        <div className="mb-10 text-[11pt] leading-relaxed text-justify">
          <div className="text-[13pt] font-bold mb-4">WHEREAS</div>
          <p className="mb-4">
            The member having his/her medical practice at (Hospital Name, Address)___ 
            ________________________________________________________________________________ Pin code _____.
          </p>
          <p className="mb-4">
            The member is fully aware that the medical profession is subject to potential risks arising from non 
            compliance with various statutory provisions and from cases of medical negligence.
          </p>
          <p className="mb-4">
            The Company is engaged in providing its expert services in the field of Risk Management, Statutory 
            Compliances, Insurance Consultancy, Legal and Para-Legal Assistance to medical professionals.
          </p>
          <p className="mb-4">
            The Company has professional tie-ups and retainer-ship arrangements with advocates, insurance 
            companies, and medico-legal experts across India to support doctors and hospitals in their medico-legal needs.
          </p>
          <p className="mb-4">
            The Company has tie-up with Insurance Companies and is an agent for the whole of India. The Insurance 
            Company covers the compensation part for the Consumer cases only. The Risk Management covers all others 
            risks including giving doorstep services for the product of its primary insurer also and takes the assurance 
            of the payment of compensation by the primary insurer with the limits of insurance cover and as per insurance 
            terms and condition.
          </p>
          <p>
            The Doctor has approaches to the company and applied for the service package offered by the Company on a 
            monthly basis (via NACH Auto Debit)/Annual and the Company has agreed to provide its services in accordance 
            with the terms and conditions set forth herein.
          </p>
        </div>

        {/* NOW THIS INDENTURE */}
        <div className="text-center text-[15pt] font-bold uppercase border-t-[3px] border-b-[3px] border-gray-800 py-3 mb-8">
          NOW THIS INDENTURE WITNESSES AS UNDER
        </div>

        {/* Terms and Conditions */}
        <div className="text-[11pt] leading-relaxed text-justify space-y-6">
          
          <div>
            <strong>1. 24×7 Medico-Legal Assistance and 360° Protection:</strong> The Company shall provide continuous 
            medico-legal support and complete professional protection to the Doctor and/or Hospital. This includes guidance, 
            case documentation, and coordination with advocates and medico-legal expert's whenever required.
          </div>

          <div>
            <strong>2. Comprehensive Case Handling During Membership Period:</strong> The Company shall manage, coordinate, 
            and supervise all medico-legal cases pertaining to the Doctor/Hospital during the membership period, including 
            risk management, drafting, case filling, advocate assignment, documentation, and regular follow-up until closure.
          </div>

          <div>
            <strong>3. Membership Coverage Types:</strong>
            <div className="ml-8 mt-4 space-y-6">
              
              <div>
                <strong>(a) Individual Doctor Membership:</strong> This membership provides medico-legal protection to the 
                Doctor for issues arising from their professional practice. The coverage includes:
                
                <div className="ml-8 mt-3 space-y-4">
                  <div>
                    <strong>i. Coverage for all cases :</strong>
                    <ul className="list-none mt-2 space-y-2">
                      <li className="pl-6 relative">
                        <span className="absolute left-0 font-bold">✓</span> Legal assistance in matters of alleged 
                        professional negligence or compensation claims before any court, forum, or authority (civil, 
                        criminal, or consumer).
                      </li>
                      <li className="pl-6 relative">
                        <span className="absolute left-0 font-bold">✓</span> Defense and representation in proceedings 
                        initiated under the <strong>Bharatiya Nyaya Sanhita (BNS), 2023</strong>, or any other applicable laws.
                      </li>
                      <li className="pl-6 relative">
                        <span className="absolute left-0 font-bold">✓</span> Representation and guidance in cases filed 
                        before consumer forums or other adjudicating authorities.
                      </li>
                      <li className="pl-6 relative">
                        <span className="absolute left-0 font-bold">✓</span> Assistance and representation in disciplinary 
                        inquiries before medical councils or competent regulatory bodies.
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <strong>ii. Drafting & Notice Handling :</strong> Drafting and replying to legal notices, complaints, 
                    or summons received in connection with the Doctor's professional duties.
                  </div>
                  
                  <div>
                    <strong>iii. Police or Media Issues:</strong> Guidance and legal help in case of harassment, false 
                    allegations, or defamatory publications related to medical practice. Initiation of appropriate legal 
                    proceedings against any false media reports, defamatory content, or bad publicity made against the Doctor, 
                    including print, electronic, or social media, as deemed necessary and in the Doctor's interest.
                  </div>
                  
                  <div>
                    <strong>iv. Legal Advisory Support:</strong> Continuous advisory services on medico-legal queries, 
                    record-keeping, consent forms, and patient communication to prevent disputes.
                  </div>
                </div>
              </div>

              <div>
                <strong>(b) Hospital Membership:</strong> This membership provides comprehensive medico-legal and administrative 
                protection to the hospital in relation to its operations and management. The coverage includes:
                
                <div className="ml-8 mt-3 space-y-4">
                  <div>
                    <strong>i. Hospital Negligence & Patient Complaints :</strong> Legal assistance in matters arising from 
                    alleged hospital negligence, billing disputes, or patient complaints. Assistance in bill recovery from 
                    patients under section 138).
                  </div>
                  
                  <div>
                    <strong>ii. Staff-Related Issues :</strong>
                    <ul className="list-none mt-2 space-y-2">
                      <li className="pl-6 relative">
                        <span className="absolute left-0 font-bold">✓</span> Support and representation in cases involving 
                        professional misconduct, negligence, or disciplinary actions concerning hospital staff.
                      </li>
                      <li className="pl-6 relative">
                        <span className="absolute left-0 font-bold">✓</span> All coverage to doctors staff, Qualified/Non 
                        Qualified Nursing staff, and on call doctors while engaged with the hospital, for any issued arising 
                        from professional practice, alleged negligence, or misconduct during their tenure.
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <strong>iii. Police Complaints, Legal Notices & Financial Offences:</strong> Assistance in responding to 
                    or defending police complaints, FIRs, or legal notices received by the hospital or its management.
                  </div>
                  
                  <div>
                    <strong>iv. Third-Party & Vendor Issues :</strong> Guidance and legal support for disputes arising from 
                    third-party machinery purchases or service agreements.
                  </div>
                  
                  <div>
                    <strong>v. Defamation & Media Issues :</strong> Legal defense and representation in matters of defamation, 
                    false or misleading media reports, and public allegations. Taking necessary legal action against false 
                    media reports, defamatory statements, or bad publicity related to the hospital or its associated doctors 
                    (print, electronic, or social media), subject to proper authorization.
                  </div>
                  
                  <div>
                    <strong>vi. Harassment & Threats :</strong> Legal guidance in cases of harassment, threats, or obstruction 
                    faced by hospital administration or staff while performing professional duties.
                  </div>
                  
                  <div>
                    <strong>vii. Legal Advisory Support:</strong> Continuous advisory services on medico-legal queries, 
                    record-keeping, consent forms, and patient communication to prevent disputes.
                  </div>
                </div>
              </div>

              <div>
                <strong>(c) Individual + Hospital Membership:</strong> Provides defined medico-legal assistance for both 
                doctors and the hospital under a single plan, subject to written authorization for the services specified above.
              </div>
            </div>
          </div>

          <div>
            <strong>4. Risk Management and Legal Representation:</strong> The Company shall assist in professional risk 
            management and medico-legal defense, from the initial complaint or FIR stage up to higher judicial forums, 
            including the Hon'ble Supreme Court of India.
          </div>

          <div>
            <strong>5. Advocate and Expert Fees:</strong> For members covered under Company tie-up plans, the Company shall 
            pay advocate and expert fees directly as per the agreed terms. Additional expenses beyond plan limits require 
            prior written approval.
          </div>

          <div>
            <strong>6. Case Updates and Co-ordination:</strong> The Company shall maintain transparent co-ordination with 
            advocates and provide timely updates through authorized digital means.
          </div>

          <div>
            <strong>7. Stamp Duty:</strong> stamp duty must be payable by the Doctor or Hospital side.
          </div>

          <div>
            <strong>8. Prohibition on Illegal or Unethical Practice:</strong> The Company shall not assist in any illegal, 
            unethical, or unlawful activity. Membership may be immediately terminated if such involvement is found.
          </div>

          <div>
            <strong>9. Professional Conduct and Ethical Standards:</strong> All services shall adhere to the Medical Council 
            of India (NMC) Code of Ethics and Indian law.
          </div>

          <div>
            <strong>10. Professional Support Commitment:</strong> The Company commits to lawful, ethical, and professional 
            conduct while supporting Doctors and Hospitals in medico-legal matters.
          </div>

          <div>
            <strong>11. Additional Terms and Conditions</strong>
            <div className="ml-6 mt-2 space-y-2">
              <div>i. The Company shall provide all agreed services, legal advice, and representation by experienced 
              medico-legal professionals before appropriate judicial, quasi-judicial, or administrative authorities.</div>
              <div>ii. The Company undertakes to maintain secrecy and confidentiality of all documents and information 
              shared by the Doctor.</div>
              <div>iii. The Company shall not disclose any such information to third parties unless required by law or 
              authorized by the Doctor.</div>
              <div>iv. The Company shall arrange Doctor's Professional Indemnity Insurance through ICICI Lombard / The 
              Oriental Insurance Co. Ltd. or any other insurer, ensuring 1:1 compensation coverage for consumer cases only.</div>
              <div>v. The Company shall manage renewal of indemnity insurance and risk management coverage during the active 
              membership period.</div>
              <div>vi. The Company shall handle all cases from hospital/clinic level up to the Hon'ble Supreme Court of 
              India where necessary.</div>
              <div>vii. It is the Doctor's duty to provide all necessary information, documents, and cooperation required 
              by the Company to render its services. The Company shall not be liable for non-performance caused by 
              insufficient information.</div>
            </div>
          </div>

          <div>
            <strong>12. The Doctor's practice shall be covered under:</strong>
            <div className="ml-6 mt-2">
              <div>i. Doctor's registered clinic/hospital.</div>
              <div>ii. Individual and visiting practice across India.</div>
            </div>
          </div>

          <div>
            <strong>13. This Agreement does not cover:</strong>
            <div className="ml-6 mt-2 space-y-2">
              <div>i. Any pre-existing legal suits or ongoing litigation.</div>
              <div>ii. Legal actions initiated before the date of signing this Agreement.</div>
              <div>iii. Cases where the cause of action occurred before the Agreement date.</div>
              <div>iv. Any illegal or unethical practice.</div>
              <div>v. Court stamp duty, which remains the Doctor's responsibility.</div>
              <div>vi. This Agreement does not cover any legal action initiated after its termination.</div>
            </div>
          </div>

          <div>
            <strong>14. Payment Terms:</strong>
            <div className="ml-6 mt-2 space-y-2">
              <div>i. The membership fee shall be paid as per the chosen plan (monthly/annual).</div>
              <div>ii. Payments shall be made through authorized modes (Online / Auto Debit / NACH / Bank Transfer/ By Cheque).</div>
              <div>iii. The Company reserves the right to suspend services for non-payment or delay.</div>
              <div>iv. Advocate and expert fees beyond membership scope will be billed separately after prior consent.</div>
              <div>v. The service fees paid under this agreement are non-refundable under any circumstances, once the 
              service agreement has been signed.</div>
            </div>
          </div>

          <div>
            <strong>15. Confidentiality & Data Protection:</strong> All client data shall remain confidential and protected 
            under the Information Technology Act, 2000. The Company shall not disclose any personal or case-related data to 
            third parties without lawful authorization or consent.
          </div>

          <div>
            <strong>16. Liability & Limitations:</strong> The Company provides advisory, coordination, and legal support 
            services but shall not be held responsible for the outcome of any judicial proceeding. Services are limited to 
            lawful and professional assistance during the membership term.
          </div>

          <div>
            <strong>17. Termination:</strong>
            <div className="ml-6 mt-2 space-y-2">
              <div>i. Either party may terminate this Agreement with 30 days' written notice.</div>
              <div>ii. Monthly membership plan have one-year lock-in. no cancellation or disconnection is allowed before 
              completing one year.</div>
              <div>iii. The Company may terminate the membership immediately in cases involving unethical or illegal 
              activity by the Doctor/Hospital and the delay payments of 7 days.</div>
            </div>
          </div>

          <div>
            <strong>18. Dispute Resolution:</strong>
            <div className="ml-6 mt-2 space-y-2">
              <div>i. Any dispute arising out of this Agreement shall be referred to arbitration under the Arbitration and 
              Conciliation Act, 1996.</div>
              <div>ii. The Arbitrator shall be a mutually agreed medico-legal professional. The award shall be final and 
              binding. Jurisdiction shall be at the city of the Company's registered office.</div>
            </div>
          </div>
        </div>

        {/* Scope of Services */}
        <div className="mt-10">
          <div className="font-bold text-lg mb-3">Scope of Services</div>
          <ol className="list-decimal pl-10 space-y-1 text-[11pt]">
            <li>Medico-Legal matters</li>
            <li>Risk Management Services</li>
            <li>Legal Advisory</li>
            <li>Litigation</li>
            <li>Statutory Compliance Free consulting</li>
          </ol>
        </div>

        {/* Witness Statement */}
        <div className="mt-12 text-center leading-loose text-[11pt]">
          In witness where of the parties here to have hereunto set and subscribed their respective hands, this{' '}
          <strong>29/10/2025</strong> day of
        </div>

        {/* Signature Boxes */}
        <div className="mt-12 flex justify-between gap-8">
          <div className="flex-1 text-center">
            <div className="h-40 border-2 border-dashed border-gray-400 bg-gray-50 mb-4"></div>
            <div className="font-bold text-[11pt] leading-relaxed">
              Sd/-<br/>
              The Doctor<br/><br/>
              <div className="uppercase">DR. AMRITA SHARAD SHINDE</div>
            </div>
          </div>
          <div className="flex-1 text-center">
            <div className="h-40 border-2 border-dashed border-gray-400 bg-gray-50 mb-4 flex items-center justify-center">
              <div className="text-gray-400 text-sm">CO. SEAL</div>
            </div>
            <div className="font-bold text-[11pt] leading-relaxed">
              The Company<br/><br/>
              AUTHORIZED SIGNATURE<br/>
              <div className="mt-2">RAPID MEDICOLEGAL SERVICES INDIA LTD.</div>
            </div>
          </div>
        </div>

        {/* Place and Date */}
        <div className="mt-10 text-right font-bold text-[11pt]">
          PLACE - KOLHAPUR<br/>
          DATE - 29/10/2025
        </div>

        {/* Print Button */}
        <div className="mt-8 text-center print:hidden">
          <button 
            onClick={() => window.print()} 
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Print Agreement
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body { margin: 0; padding: 0; }
          @page { size: A4 portrait; margin: 15mm; }
        }
      `}</style>
    </div>
  );
}