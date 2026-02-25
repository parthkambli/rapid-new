import React from 'react';
import InvoiceHeader from './HeaderInvoice';
import InvoiceFooter from './FooterInvoice';

const HospitalMembershipInvoice = ({ doctorData, hospitalData, membershipData }) => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  
  return (
    <div className="invoice-container bg-white mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Page 1 - Introduction */}
      <div className="page p-8 h-full flex flex-col">
        <InvoiceHeader />
        
        <div className="content flex-1">
          {/* Salutation */}
          <div className="mb-6">
            <p className="text-gray-800">Respected Doctor,</p>
            <p className="text-right font-semibold text-gray-800">Date: {currentDate}</p>
          </div>

          {/* Greeting Section */}
          <div className="text-center mb-8">
            <p className="text-gray-700 mb-4">Greetings from RAPID MEDICOLEGAL SERVICES INDIA LTD.</p>
            <h2 className="text-red-600 text-xl font-bold mb-2">!! You are invited !!</h2>
            <h3 className="text-gray-800 font-semibold leading-relaxed">
              TO BE THE PART OF INDIA'S ONLY<br />
              MEDICOLEGAL SERVICES & RISK MANAGEMENT COMPANY<br />
              FOR THE DOCTORS
            </h3>
          </div>

          {/* Description */}
          <div className="mb-6 text-justify leading-relaxed">
            <p className="text-gray-700">
              RAPID MEDICOLEGAL SERVICES INDIA LTD. is a limited company incorporated under 
              Indian Companies Act, 2013 with its offices throughout India. The company is 
              having understanding with premiere Insurance Companies. The company through 
              its massive network and trained professional specializes in liability and 
              medical insurance policies in particular.
            </p>
          </div>

          {/* Features List */}
          <div className="mb-6">
            <h4 className="text-gray-800 font-semibold mb-3">Here's why?</h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-2 text-justify">
              <li>India's only risk Management Company in a complete or true sense with its nationwide operation.</li>
              <li>A truly international standard service company with India's top most legal and medico legal professionals. 24x7 services right at your doorstep.</li>
              <li>Online connectivity with all experts. 100% crisis management infrastructure.</li>
              <li>A platform to study national and international trends, problems and safety measurements through its dedicated website and regular journals.</li>
              <li>Get covered for all medico legal, criminal and medical councils. This service is not given or managed by any other company or agent.</li>
              <li>Get covered for all cases of consumer nature and prior cases. This facility is exclusive available for the entire doctors who are insured through any other company or agent. No question asked. If you are opting for us then we declare to take all your prior matters whenever it comes. We will arrange for all helps and compensation free of cost.</li>
              <li>Get participated in our medico legal events, seminars or lectures which currently you are being deprived of and which we organize on regular intervals.</li>
              <li>More than 2000+ empanelled lawyers to give a big accessibility and help in event of crisis. Due to our national infrastructure you must be reassured of getting on time services anywhere.</li>
              <li>Get access to specialization wise medico legal experts who are doctor cum lawyer to represent your all medico-legal cases.</li>
              <li>Get recovery of hospital bills from TPA. Get your hospital documents and records</li>
            </ul>
          </div>

          {/* Doctor Info */}
          <div className="mt-8 font-semibold text-gray-800">
            <p>DR. NAME: {doctorData?.name}</p>
          </div>
        </div>

        <InvoiceFooter />
      </div>

      {/* Page Break */}
      <div className="page-break"></div>

      {/* Page 2 - Hospital Details & Membership */}
      <div className="page p-8 h-full flex flex-col">
        <InvoiceHeader />
        
        <div className="content flex-1">
          {/* Hospital Information */}
          <div className="mb-6">
            <p className="font-semibold text-gray-800">HOSPITAL NAME: {hospitalData?.name}</p>
            <p className="font-semibold text-gray-800">ADDRESS: {hospitalData?.address}</p>
          </div>

          <div className="text-center my-6">
            <p className="font-semibold text-gray-800">AS BELOW AS</p>
          </div>

          {/* Hospital Membership Table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full border border-gray-800 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-800 p-2 font-semibold text-center">Membership Type</th>
                  <th className="border border-gray-800 p-2 font-semibold text-center">Specialization</th>
                  <th className="border border-gray-800 p-2 font-semibold text-center">No. of beds</th>
                  <th className="border border-gray-800 p-2 font-semibold text-center">Indemnity Cover</th>
                  <th className="border border-gray-800 p-2 font-semibold text-center">Monthly</th>
                  <th className="border border-gray-800 p-2 font-semibold text-center">1 Year</th>
                  <th className="border border-gray-800 p-2 font-semibold text-center">5 Year</th>
                </tr>
              </thead>
              {/* <tbody>
                <tr>
                  <td className="border border-gray-800 p-2 text-center">
                    HOSPITAL MEMBERSHIP<br />
                    (COVERAGE OF ALL DOCTOR STAFF,<br />
                    QUALIFIED/NON QUALIFIED NURSING STAFF)
                  </td>
                  <td className="border border-gray-800 p-2 text-center">{membershipData?.specialization}</td>
                  <td className="border border-gray-800 p-2 text-center">{membershipData?.numberOfBeds}</td>
                  <td className="border border-gray-800 p-2 text-center">{membershipData?.indemnityCover}</td>
                  <td className="border border-gray-800 p-2 text-center">{membershipData?.monthly}</td>
                  <td className="border border-gray-800 p-2 text-center">{membershipData?.yearly}</td>
                  <td className="border border-gray-800 p-2 text-center">{membershipData?.fiveYear}</td>
                </tr>
              </tbody> */}



<tbody>
  {membershipData?.priceMatrix && membershipData.priceMatrix.length > 0 ? (
    membershipData.priceMatrix.map((row, index) => (
      <tr key={index}>
        <td className="border border-gray-800 p-2 text-center text-xs leading-tight">
          {membershipData.membershipType?.includes('HOSPITAL') 
            ? 'HOSPITAL + INDIVIDUAL MEMBERSHIP\n(COVERAGE OF ALL DOCTOR STAFF,\nQUALIFIED/NON QUALIFIED NURSING STAFF)'
            : 'INDIVIDUAL MEMBERSHIP\n(COVERAGE TO ALL OVER INDIA)'
          }
        </td>
        <td className="border border-gray-800 p-2 text-center">
          {membershipData.specialization}
        </td>
        {membershipData.membershipType?.includes('HOSPITAL') && (
          <td className="border border-gray-800 p-2 text-center">
            {membershipData.numberOfBeds || 'N/A'}
          </td>
        )}
        <td className="border border-gray-800 p-2 text-center font-bold text-blue-700">
          {row.indemnity}
        </td>
        <td className="border border-gray-800 p-2 text-center">
          {row.monthly ? `₹${Number(row.monthly).toLocaleString('en-IN')}` : '-'}
        </td>
        <td className="border border-gray-800 p-2 text-center">
          {row.y1 ? `₹${Number(row.y1).toLocaleString('en-IN')}` : '-'}
        </td>
        <td className="border border-gray-800 p-2 text-center">
          {row.y5 ? `₹${Number(row.y5).toLocaleString('en-IN')}` : '-'}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center p-6 text-red-600">
        No pricing data
      </td>
    </tr>
  )}
</tbody>


            </table>
          </div>

          {/* Note Section */}
          <div className="mb-8">
            <p className="font-semibold text-gray-800 mb-2">NOTE:</p>
            <p className="font-semibold text-gray-800 mb-4">YOU CAN PAY ON BELOW BANK DETAILS:</p>
            <div className="ml-5 space-y-1 text-gray-700">
              <p><strong>BANK DETAILS:</strong></p>
              <p>NAME: RAPID MEDICOLEGAL SERVICES</p>
              <p>BANK NAME - ICICI BANK</p>
              <p>BRANCH - RAJARAMPURI KOLHAPUR</p>
              <p>A/C NO. - 016605017904</p>
              <p>IFSC - ICIC0000166</p>
            </div>
          </div>

          {/* Regards Section */}
          <div className="mb-6 space-y-2 text-gray-700">
            <p>Regards,</p>
            <p className="font-semibold">RAPID MEDICOLEGAL SERVICES INDIA LTD.</p>
            <p>24 x 7 ALL INDIA HELP LINE NO.</p>
            <p>+91-9422584275, +91-9421584275, +91-9405734275, +91-9665444275.</p>
          </div>
        </div>

        <InvoiceFooter />
      </div>

      {/* Page Break */}
      <div className="page-break"></div>

      {/* Page 3 - Services & Terms */}
      <div className="page p-8 h-full flex flex-col">
        <InvoiceHeader />
        
        <div className="content flex-1">
          {/* Services List */}
          <div className="mb-6">
            <h4 className="text-gray-800 font-semibold mb-4 text-center">HOSPITAL MEMBERSHIP SERVICES</h4>
            <ol className="list-decimal pl-5 space-y-4 text-justify text-gray-700">
              <li>
                <strong>24×7 Legal & Medico-Legal Support:</strong>
                <br />
                Continuous medico-legal and risk management support for the hospital and its staff, including guidance, documentation, and expert coordination.
              </li>
              <li>
                <strong>Comprehensive Case Handling:</strong>
                <br />
                End-to-end management of all medico-legal, consumers, criminal, and civil matters arising against the hospital during the membership period.
              </li>
              <li>
                <strong>Hospital Risk Coverage:</strong>
                <br />
                <div className="ml-4 mt-2">
                  <div className="flex items-start mb-1">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Legal protection in cases related to:</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Staff negligence or unqualified staff issues</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Equipment malfunction or software-related errors</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>False media allegations, harassment, or defamation</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>TPA and bill recovery disputes</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <strong>Advocate & Legal Representation:</strong>
                <br />
                The Company shall manage cases from the hospital level up to the Hon'ble Supreme Court of India through its empanelled lawyers and medico-legal experts.
              </li>
              <li>
                <strong>Legal Compensation & Indemnity:</strong>
                <br />
                In coordination with the hospital's Error & Omission Policy or Indemnity Insurance, the Company shall support the compensation and legal process as per agreed plan terms.
              </li>
              <li>
                <strong>Staff Coverage:</strong>
                <br />
                Covers all employed, on-call, and visiting doctors, as well as nursing and paramedical staff working under the hospital's authorization.
              </li>
              <li>
                <strong>Case Monitoring & Updates:</strong>
                <br />
                Regular follow-ups and case progress updates through secure digital platforms.
              </li>
              <li>
                <strong>Confidentiality & Ethical Practice:</strong>
                <br />
                All cases handled with complete confidentiality and compliance with NMC and Indian laws.
              </li>
              <li>
                <strong>Professional Risk Management:</strong>
                <br />
                360° medico-legal defense and risk control enabling the hospital to operate confidently and focus on patient care.
              </li>
            </ol>
          </div>

          {/* Quotation Note */}
          <div className="mt-8 text-center p-4 border-2 border-red-600 rounded bg-red-50">
            <p className="text-red-600 font-bold text-sm">
              NOTE: THIS QUOTATION VALID FOR UP TO 7 DAYS FROM THE ISSUE DATE.
            </p>
          </div>
        </div>

        <InvoiceFooter />
      </div>
    </div>
  );
};

export default HospitalMembershipInvoice;