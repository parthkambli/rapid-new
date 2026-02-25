


import React, { useState } from 'react';

export default function ServiceAgreement() {
  const [formData, setFormData] = useState({
    date: '29 October, 2025',
    councilNumber: '_________________',
    doctorName: 'DR. AMRITA SHARAD SHINDE',
    hospitalName: '',
    qualification: '',
    specialization: '',
    registerNumber: '',
    registrationYear: '',
    membershipType: '',
    membershipPeriod: '',
    membershipId: '',
    startDate: '',
    endDate: '',
    insuranceCoName: '',
    policyType: '',
    policyNumber: '',
    policyCover: '',
    policyDuration: '',
    policyPremium: 'If paid by rapid – INCLUDING SERVICE CHARGES if paid by doctor – PAID BY DOCTOR SIDE',
    policyStartDate: '',
    policyEndDate: '',
    paymentDate: '',
    paymentMode: '',
    chequeNo: '',
    drawnOn: '',
    amountPaid: '',
    note: '',
    signatureDate: '29/10/2025',
    finalDate: '29/10/2025'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='border p-4 rounded-xl'>
    <div className="bg-white min-h-screen ">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-yellow-500 via-yellow-500 to-blue-900 text-white px-5 py-3">
        <div>
          <img 
            src="https://i.imgur.com/0Y5oK8Z.png" 
            alt="Logo" 
            className="h-16 mb-1"
          />
          <div className="text-[9px]">360° Medicolegal Protection</div>
          <div className="text-[9px]">An ISO 9001:2015 Certified Company</div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold">RAPID MEDICOLEGAL SERVICES INDIA LTD.</div>
          <div className="text-[9px]">rapidmedicolegal.in | rapidmedicolegal@gmail.com</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-10 py-5 font-serif">
        <div className="text-center text-xs font-bold my-5 uppercase">
          SERVICE AGREEMENT
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          This Agreement for providing professional services is made at Kolhapur on this day of{' '}
          <input
            type="text"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="bg-yellow-50 border border-dashed border-gray-400 px-2 py-1 min-w-[160px] inline-block"
          />
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <strong>DR. AMRITA SHARAD SHINDE</strong> residing at <b>FLAT NO. 8, YASHWANT PARK DHRUV RECIDENCY, KOLHAPUR, MAHARASHTRA, INDIA, PIN CODE-416003</b> with medical council number –{' '}
          <input
            type="text"
            value={formData.councilNumber}
            onChange={(e) => handleChange('councilNumber', e.target.value)}
            className="bg-yellow-50 border border-dashed border-gray-400 px-2 py-1 min-w-[160px] inline-block"
          />
          {' '}Herein after referred as the doctor the one part.
        </div>

        <div className="text-center text-xs font-bold my-7 uppercase">AND</div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <strong>RAPID MEDICOLEGAL SERVICES INDIA LTD. A COMPANY REGISTERED UNDER THE COMPANIES ACT 2013, THROUGH ITS GENERAL MANAGER HAVING HEAD AND CORPORATE OFFICE AT OFFICE NO. 5 & 6, 3RD FLOOR, STAR TOWER, 1113/1, PANCH BUNGLOW, SHAHUPURI, KOLHAPUR, MAHARASHTRA, INDIA. 416001</strong> herein after referred to as the service of the other part.
        </div>

        <div className="text-center my-6">
          Both parties hereby agree as follows:
        </div>

        {/* Purpose Box */}
        <div className="p-5 my-7 border border-gray-300">
          <div className="text-sm font-bold uppercase mb-3">PURPOSE OF AGREEMENT</div>
          <div className="text-[13px] text-justify leading-relaxed">
            This Agreement outlines the terms and conditions under which Rapid Medico-legal Services India Ltd. shall provide medico-legal Support, documentation, case coordination, and membership-related service to the Doctors and Hospitals.
          </div>
        </div>

        <strong className="text-[13px]">Membership Details:</strong>
        <table className="w-full border-collapse my-5 text-xs">
          <tbody>
            <tr>
              <th className="bg-blue-100 border border-black p-2 font-bold">Particular</th>
              <th className="bg-blue-100 border border-black p-2 font-bold">Details</th>
            </tr>
            {[
              { label: 'Doctor Name', field: 'doctorName' },
              { label: 'Hospital Name', field: 'hospitalName' },
              { label: 'Qualification', field: 'qualification' },
              { label: 'Specialization', field: 'specialization' },
              { label: 'M. Register Number', field: 'registerNumber' },
              { label: 'M. Registration Year', field: 'registrationYear' },
              { label: 'Membership Type', field: 'membershipType' },
              { label: 'Membership Period', field: 'membershipPeriod' },
              { label: 'Membership ID', field: 'membershipId' },
              { label: 'Start Date', field: 'startDate' },
              { label: 'End Date', field: 'endDate' }
            ].map((item, idx) => (
              <tr key={idx}>
                <td className="border border-black p-2">{item.label}</td>
                <td className="border border-black p-2">
                  <input
                    type="text"
                    value={formData[item.field]}
                    onChange={(e) => handleChange(item.field, e.target.value)}
                    className="bg-yellow-50 border border-dashed border-gray-400 px-2 py-1 w-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <strong className="text-[13px]">Policy Details:</strong>
        <table className="w-full border-collapse my-5 text-xs">
          <tbody>
            <tr>
              <th className="bg-blue-100 border border-black p-2 font-bold">Particular</th>
              <th className="bg-blue-100 border border-black p-2 font-bold">Details</th>
            </tr>
            {[
              { label: 'Insurance Co. Name', field: 'insuranceCoName' },
              { label: 'Type of Policy', field: 'policyType' },
              { label: 'Policy Number', field: 'policyNumber' },
              { label: 'Policy Cover', field: 'policyCover' },
              { label: 'Policy Duration', field: 'policyDuration' },
              { label: 'Policy Premium', field: 'policyPremium', large: true },
              { label: 'Start Date', field: 'policyStartDate' },
              { label: 'End Date', field: 'policyEndDate' }
            ].map((item, idx) => (
              <tr key={idx}>
                <td className="border border-black p-2">{item.label}</td>
                <td className="border border-black p-2">
                  <input
                    type="text"
                    value={formData[item.field]}
                    onChange={(e) => handleChange(item.field, e.target.value)}
                    className="bg-yellow-50 border border-dashed border-gray-400 px-2 py-1 w-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex gap-4 mb-5">
          <table className="w-1/2 border-collapse text-xs">
            <tbody>
              <tr>
                <th className="bg-blue-100 border border-black p-2 font-bold">Particular</th>
                <th className="bg-blue-100 border border-black p-2 font-bold">Details</th>
              </tr>
              {[
                { label: 'Payment Date', field: 'paymentDate' },
                { label: 'Payment Mode', field: 'paymentMode' },
                { label: 'Cheque no. / Tr. no.', field: 'chequeNo' },
                { label: 'Drawn On', field: 'drawnOn' },
                { label: 'Amount Paid', field: 'amountPaid' },
                { label: 'Note :', field: 'note' }
              ].map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-black p-2">{item.label}</td>
                  <td className="border border-black p-2">
                    <input
                      type="text"
                      value={formData[item.field]}
                      onChange={(e) => handleChange(item.field, e.target.value)}
                      className="bg-yellow-50 border border-dashed border-gray-400 px-2 py-1 w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="w-1/2 border-collapse text-xs">
            <tbody>
              <tr>
                <th colSpan="2" className="bg-blue-100 border border-black p-2 font-bold">Upcoming Payment Schedule:</th>
              </tr>
              <tr>
                <td className="border border-black p-2">Payment Frequency</td>
                <td className="border border-black p-2">Monthly</td>
              </tr>
              <tr>
                <td className="border border-black p-2">Debit type</td>
                <td className="border border-black p-2">By Nach (Auto Debit)</td>
              </tr>
              <tr>
                <td className="border border-black p-2">Debit Date</td>
                <td className="border border-black p-2">27th of every month</td>
              </tr>
              <tr>
                <td className="border border-black p-2">GST</td>
                <td className="border border-black p-2">NA</td>
              </tr>
              <tr>
                <td className="border border-black p-2">Monthly Premium</td>
                <td className="border border-black p-2">899/-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-[13px] my-4"><strong>WHEREAS</strong></div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          The member having his/her medical practice at (Hospital Name, Address)________________________ Pin code ____.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          The member is fully aware that the medical profession is subject to potential risks arising from non compliance with various statutory provisions and from cases of medical negligence...
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          The Company is engaged in providing its expert services in the field of Risk Management, Statutory Compliances, Insurance Consultancy, Legal and Para-Legal Assistance to medical professionals.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          The Company has professional tie-ups and retainer-ship arrangements with advocates, insurance companies, and medico-legal experts across India to support doctors and hospitals in their medico-legal needs.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          The Company has tie-up with Insurance Companies and is an agent for the whole of India. The Insurance Company covers the compensation part for the Consumer cases only. The Risk Management covers all others risks including giving doorstep services for the product of its primary insurer also and takes the assurance of the payment of compensation by the primary insurer with the limits of insurance cover and as per insurance terms and condition.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          The Doctor has approaches to the company and applied for the service package offered by the Company on a monthly basis (via NACH Auto Debit)/Annual and the Company has agreed to provide its services in accordance with the terms and conditions set forth herein.
        </div>

        <div className="text-red-600 text-[13px] my-4">NOW THIS INDENTURE WITNESSES AS UNDER</div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">1. 24×7 Medico-Legal Assistance and 360° Protection:</span> The Company shall provide continuous medico-legal support and complete professional protection to the Doctor and/or Hospital. This includes guidance, case documentation, and coordination with advocates and medico-legal expert's whenever required.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">2. Comprehensive Case Handling During Membership Period:</span> The Company shall manage, coordinate, and supervise all medico-legal cases pertaining to the Doctor/Hospital during the membership period, including risk management, drafting, case filling, advocate assignment, documentation, and regular follow-up until closure.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">3. Membership Coverage Types:</span>
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>(a) Individual Doctor Membership:</b> This membership provides medico-legal protection to the Doctor for issues arising from their professional practice. The coverage includes:
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>i. Coverage for all cases:</b>
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          ✓ Legal assistance in matters of alleged professional negligence or compensation claims before any court, forum, or authority (civil, criminal, consumer).
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          ✓ Defense and representation in proceedings initiated under the Bharatiya Nyaya Sanhita (BNS), 2023, or any other applicable laws.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          ✓ Representation and guidance in cases filed before consumer forums or other adjudicating authorities.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          ✓ Assistance and representation in disciplinary inquiries before medical councils or competent regulatory bodies.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>ii. Drafting & Notice Handling:</b> Drafting and replying to legal notices, complaints, or summons received in connection with the Doctor's professional duties.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>iii. Police or Media Issues:</b> Guidance and legal help in case of harassment, false allegations, or defamatory publications related to medical practice. Initiation of appropriate legal proceedings against any false media reports, defamatory content, or bad publicity made against the Doctor, including print, electronic, or social media, as deemed necessary and in the Doctor's interest.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>iv. Legal Advisory Support:</b> Continuous advisory services on medico-legal queries, record-keeping, consent forms, and patient communication to prevent disputes.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>(b) Hospital Membership:</b> This membership provides comprehensive medico-legal and administrative protection to the hospital in relation to its operations and management. The coverage includes:
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>i. Hospital Negligence & Patient Complaints:</b> Legal assistance in matters arising from alleged hospital negligence, billing disputes, or patient complaints. Assistance in recovery suit from patients under similar section.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>ii. Staff-Related Issues:</b>
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          ✓ Support and representation in cases involving professional misconduct, negligence, or disciplinary actions concerning hospital staff.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          ✓ All coverage to doctors staff, Qualified/Non Qualified Nursing staff, and on call doctors while engaged with the hospital, for any issued arising from professional practice, alleged negligence, or misconduct during their tenure.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>iii. Police Complaints, Legal Notices & Financial Offences:</b> Assistance in responding to or defending police complaints, FIRs, or legal notices received by the hospital or its management.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>iv. Third-Party & Vendor Issues:</b> Guidance and legal support for disputes arising from third-party machinery purchases or service agreements.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>v. Defamation & Media Issues:</b> Legal defense and representation in matters of defamation, false or misleading media reports, and public allegations. Taking necessary legal action against false media reports, defamatory statements, or bad publicity related to the hospital or its associated doctors (print, electronic, or social media), subject to proper authorization.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>vi. Harassment & Threats:</b> Legal guidance in cases of harassment, threats, or obstruction faced by hospital administration or staff while performing professional duties.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>vii. Legal Advisory Support:</b> Continuous advisory services on medico-legal queries, record-keeping, consent forms, and patient communication to prevent disputes.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          <b>(c) Individual + Hospital Membership:</b> Provides defined medico-legal assistance for both doctors and the hospital under a single plan, subject to written authorization for the services specified above.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">4. Risk Management and Legal Representation:</span> The Company shall assist in professional risk management and medico-legal defense, from the initial complaint or FIR stage up to higher judicial forums, including the Hon'ble Supreme Court of India.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">5. Advocate and Expert Fees:</span> For members covered under Company tie-up plans, the Company shall pay advocate and expert fees directly as per the agreed terms. Additional expenses beyond plan limits require prior written approval.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">6. Case Updates and Co-ordination:</span> The Company shall maintain transparent co-ordination with advocates and provide timely updates through authorized digital means.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">7. Stamp Duty:</span> stamp duty must be payable by the Doctor or Hospital side.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">8. Prohibition on Illegal or Unethical Practice:</span> The Company shall not assist in any illegal, unethical, or unlawful activity. Membership may be immediately terminated if such involvement is found.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">9. Professional Conduct and Ethical Standards:</span> All services shall adhere to the Medical Council of India (NMC) Code of Ethics and Indian law.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">10. Professional Support Commitment:</span> The Company commits to lawful, ethical, and professional conduct while supporting Doctors and Hospitals in medico-legal matters.
        </div>

        <div className="font-bold text-[13px] my-4">11. Additional Terms and Conditions</div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <b>i.</b> The Company shall provide all agreed services, legal advice, and representation by experienced medico-legal professionals before appropriate judicial, quasi-judicial, or administrative authorities.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <b>ii.</b> The Company undertakes to maintain secrecy and confidentiality of all documents and information shared by the Doctor.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <b>iii.</b> The Company shall not disclose any such information to third parties unless required by law or authorized by the Doctor.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <b>iv.</b> The Company shall arrange Doctor's Professional Indemnity Insurance through ICICI Lombard / The Oriental Insurance Co. Ltd. or any other insurer, ensuring 1:1 compensation coverage for consumer cases only.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <b>v.</b> The Company shall manage renewal of indemnity insurance and risk management coverage during the active membership period.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <b>vi.</b> The Company shall handle all cases from hospital/clinic level up to the Hon'ble Supreme Court of India where necessary.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <b>vii.</b> It is the Doctor's duty to provide all necessary information, documents, and cooperation required by the Company to render its services. The Company shall not be liable for non-performance caused by insufficient information.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">12. The Doctor's practice shall be covered under:</span>
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          i. Doctor's registered clinic/hospital.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          ii. Individual and visiting practice across India.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">13. This Agreement does not cover:</span>
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          i. Any pre-existing legal suits or ongoing litigation.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          ii. Legal actions initiated before the date of signing this Agreement.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          iii. Cases where the cause of action occurred before the Agreement date.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          iv. Any illegal or unethical practice.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          v. Court stamp duty, which remains the Doctor's responsibility.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          vi. This Agreement does not cover any legal action initiated after its termination.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">14. Payment Terms:</span>
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          i. The membership fee shall be paid as per the chosen plan (monthly/annual).
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          ii. Payments shall be made through authorized modes (Online / Auto Debit / NACH / Bank Transfer/ By Cheque).
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          iii. The Company reserves the right to suspend services for non-payment or delay.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          iv. Advocate and expert fees beyond membership scope will be billed separately after prior consent.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          v. The service fees paid under this agreement are non-refundable under any circumstances, once the service agreement has been signed.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">15. Confidentiality & Data Protection:</span> All client data shall remain confidential and protected under the Information Technology Act, 2000. The Company shall not disclose any personal or case-related data to third parties without lawful authorization or consent.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">16. Liability & Limitations:</span> The Company provides advisory, coordination, and legal support services but shall not be held responsible for the outcome of any judicial proceeding. Services are limited to lawful and professional assistance during the membership term.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">17. Termination:</span>
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          i. Either party may terminate this Agreement with 30 days' written notice.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          ii. Monthly membership plan have one-year lock-in. no cancellation or disconnection is allowed before completing one year.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          iii. The Company may terminate the membership immediately in cases involving unethical or illegal activity by the Doctor/Hospital and the delay payments of 7 days.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          <span className="font-bold">18. Dispute Resolution:</span>
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          i. Any dispute arising out of this Agreement shall be referred to arbitration under the Arbitration and Conciliation Act, 1996.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-2 ml-8">
          ii. The Arbitrator shall be a mutually agreed medico-legal professional. The award shall be final and binding. Jurisdiction shall be at the city of the Company's registered office.
        </div>

        <div className="font-bold text-[13px] mt-9 mb-4 text-blue-900">
          Terms and conditions (FOR MONTHLY MEMBERSHIP PLAN)
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          i. Contracts duration is one year or more, unless otherwise determined by the parties under his agreement/contract.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          ii. Upon the execution of ECS/CCSI/NACH/ Direct Debit MANDATE Rapid Medicolegal Services India Ltd. is authorized to DEDUCT the installment amount until Rapid Medicolegal Services India Ltd received advance notice as specified in clause 4(iv) of the terms and service.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          iii. In case payment mode opted by the vendors/service providers ECS, CCSI & NACH, then the contract would be AUTOMATICALLY RENEWED on the some terms and conditions unless determined by parties. The automatic renewal is at the absolute discretion of Rapid Medicolegal Services India Ltd.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          iv. If terminate ECS/CCSI/NACH/Direct Debit facility, then vendors/service providers has to provide prior written NOTICE OF 3 MONTHS to Rapid Medicolegal Services India Ltd, only upon the completion of minimum tenure of 9 (Nine) months from the effective date.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          v. Rapid Medicolegal Services India Ltd reserves the right to terminate the contract or its services at its discretion with or without cause or by serving 30 (Thirty) days written notice to the Advertiser/s.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          vi. If the Vendors/service provider opts to pay the fee/consideration by paying installment's payment schemes, the service shall be activated once the first ECS/CCSI/NACH payment is credited on Rapid Medicolegal Services India Ltd account as per the payment plan.
        </div>

        <div className="text-justify leading-relaxed text-[13px] my-4">
          vii. In case of any disputes, differences ond/or claims arising out of the contract shall be settled by Arbitration in accordance with the provisions of Arbitration & Conciliation Act, 1996 or any statutory amendment thereof. The Arbitrator shall be appointed by the authorized representative/Director of Rapid Medicolegal Services India Ltd. The proceeding shall be conducted in English and held at Kolhapur. The Award shall be final and binding. The Court of the arbitration proceeding and jurisdiction of court of Kolhpaur have the exclusive jurisdiction.
        </div>

        <div className="font-bold text-[13px] mt-10 mb-4">Scope of Services</div>

        <ol className="ml-5 list-decimal text-[13px]">
          <li>Medico-Legal matters</li>
          <li>Risk Management Services</li>
          <li>Legal Advisory</li>
          <li>Litigation</li>
          <li>Statutory Compliance Free consulting</li>
        </ol>

        <div className="text-[13px] mt-16 ml-10">
          In witness whereof the parties hereto have hereunto set and subscribed their respective hands, this{' '}
          <input
            type="text"
            value={formData.signatureDate}
            onChange={(e) => handleChange('signatureDate', e.target.value)}
            className="bg-yellow-50 border border-dashed border-gray-400 px-2 py-1 min-w-[100px] inline-block"
          /> day of
        </div>

        <div className="text-[13px] my-4">Sd/-</div>

        <div className="text-[13px] my-4">The Doctor</div>

        <div className="text-center ml-24 my-8">
          <div className="h-16"></div>
          <strong>DR. AMRITA SHARAD SHINDE</strong>
        </div>

        <div className="text-[13px] my-4">The Company</div>

        <div className="text-center ml-24 my-8">
          <div className="h-20"></div>
          <strong>AUTHORIZED SIGNATURE</strong><br />
          <strong>RAPID MEDICO LEGAL SERVICES INDIA LTD.</strong><br />
          <img src="https://i.imgur.com/0Y5oK8Z.png" alt="stamp" className="h-12 mx-auto mt-2" />
        </div>

        <div className="text-right mt-16 text-[13px]">
          CO. SEAL<br />
          PLACE - KOLHAPUR<br />
          DATE - <input
            type="text"
            value={formData.finalDate}
            onChange={(e) => handleChange('finalDate', e.target.value)}
            className="bg-yellow-50 border border-dashed border-gray-400 px-2 py-1 min-w-[100px] inline-block"
          />
        </div>

        {/* Footer */}
        <div className="mt-12 border-t-4 border-double border-black pt-4 text-center text-[9px]">
          Register Office: S.R. No. 75/24, Plot No. 6, Bharati Nagar, R K Nagar, Morewadi, Tal-Karveer, Kolhapur, Maharashtra, India - 416013 |
          Head & Corporate Office: Office No. 5 & 6, 3rd Floor, Star Tower, 1113/1, Panch Bunglow, Shahupuri, Kolhapur<br />
          Helpline: +91-9421464275 | Branches: Mumbai • Solapur • Goa • Gujarat • Andhra Pradesh • Telangana • Tamil Nadu
        </div>
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="fixed bottom-5 right-5 px-12 py-4 bg-yellow-500 text-white text-2xl rounded-xl shadow-2xl hover:bg-yellow-600 transition-colors print:hidden"
      >
        Print / Save as PDF
      </button>

      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: A4;
            margin: 10mm 12mm 15mm 12mm;
          }
        }
      `}</style>
    </div>
    </div>
  );
}