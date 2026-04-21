import React from 'react';
import { useParams } from 'react-router-dom';
import useServiceAgreementData from '../Invoices/serviceAgreement(SA)/hooks/useServiceAgreementDate';
import Header from '../Invoices/serviceAgreement(SA)/Header';
import Footer from '../Invoices/serviceAgreement(SA)/Footer';

// Helper to format date
const formatDate = (isoString) => {
  if (!isoString) return '________________';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '________________';
    return date.toLocaleDateString('en-GB'); // DD-MM-YYYY
  } catch {
    return '________________';
  }
};

const NewMembershipForm = () => {
  const { id } = useParams();
  const { doctor, salesBill, policies, loading, error } = useServiceAgreementData('monthly', id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !doctor || !salesBill) {
    return <div className="text-center py-8">Error loading membership form data: {error || 'Data not found'}</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const primaryDoctor = doctor.originalDoctor || {};
  const linkedDoctor = doctor.originalLinkedDoctor || {};
  const isLinked = !!doctor.hasSpouse;
  const doctorType = primaryDoctor.doctorType || 'individual';
  const isHospital = doctorType === 'hospital' || doctorType === 'hospital_individual';

  // Calculate membership years
  const calculateYears = (start, end) => {
    if (!start || !end) return '______';
    const s = new Date(start);
    const e = new Date(end);
    let years = e.getFullYear() - s.getFullYear();
    if (e.getMonth() < s.getMonth() || (e.getMonth() === s.getMonth() && e.getDate() < s.getDate())) {
      years--;
    }
    return years > 0 ? years : '______';
  };

  const membershipYears = calculateYears(salesBill.billDate, salesBill.dueDate);
  const firstPayment = salesBill.payments && salesBill.payments.length > 0 ? salesBill.payments[0] : null;

  const isMonthly = salesBill.membershipType?.toLowerCase() === 'monthly';
  const monthlyAmount = salesBill.upcomingPayments?.monthlyPremium || (salesBill.items?.find(i => i.serviceType === 'consultation')?.amount?.toLocaleString('en-IN')) || salesBill.totalAmount?.toLocaleString('en-IN');

  // Indemnity Premium Logic
  const primaryPolicy = policies && policies.length > 0 ? policies[0] : null;
  let indemnityPremiumDisplay = '-';
  if (primaryPolicy) {
    if (primaryPolicy.paidBy === 'by_company') {
      indemnityPremiumDisplay = 'PAID BY RAPID';
    } else if (primaryPolicy.paidBy === 'by_doctor') {
      indemnityPremiumDisplay = `₹${primaryPolicy.premiumAmount?.toLocaleString('en-IN')} (BY DOCTOR)`;
    } else {
      indemnityPremiumDisplay = 'INCLUDING SERVICES CHARGES';
    }
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
        >
          🖨️ Print Membership Form
        </button>
      </div>

      <div className="bg-white min-h-screen font-serif text-[14px] leading-relaxed">
        <style jsx global>{`
          /* ========== SCREEN VIEW STYLES ========== */
          .a4-container {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            color: black;
            display: flex;
            flex-direction: column;
          }
          
          .section-header { background-color: #999; color: white; padding: 6px 12px; font-weight: bold; text-transform: uppercase; margin-top: 25px; margin-bottom: 10px; font-size: 14px; }
          .field-row { display: flex; border-bottom: 1px solid #eee; padding: 7px 0; align-items: center; }
          .field-label { color: red; font-weight: 500; min-width: 160px; }
          .field-value { flex: 1; padding-left: 10px; color: #000; }
          .dept-line { border-bottom: 1px solid #333; flex: 1; margin-left: 5px; min-height: 20px; }
          .field-half { width: 50%; display: flex; align-items: center; }
          .form-title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline; margin: 15px 0; }
          .intro-text { margin-bottom: 15px; text-align: justify; font-size: 14px; }
          
          .payment-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .payment-table td { border: 1px solid #ccc; padding: 0 10px; height: 50px; vertical-align: middle !important; line-height: 1; }
          .payment-label { font-weight: bold; width: 22%; background-color: #f3f4f6 !important; }
          .payment-val { width: 28%; }
          
          .signature-section { display: flex; justify-content: space-between; margin-top: 50px; padding: 0 30px; }
          .sig-box { text-align: center; width: 220px; }
          .sig-line { border-top: 1px solid #000; margin-bottom: 5px; }

          /* ========== PRINT VIEW STYLES ========== */
          @media print {
            @page {
              size: A4;
              margin: 10mm;
            }

            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .a4-container {
              width: 100% !important;
              margin: 0 !important;
              box-shadow: none !important;
              min-height: 277mm !important; /* Ensure content stretches to at least one page */
              display: flex !important;
              flex-direction: column !important;
              border: none !important;
            }

            .content-wrapper {
                flex-grow: 1 !important; /* This pushes the footer down */
                padding: 0 5mm;
            }

            .section-group {
              break-inside: avoid;
              margin-top: 25px;
            }

            .payment-table td {
                height: 50px !important;
                vertical-align: middle !important;
                padding: 0 10px !important;
            }
            
            .payment-label {
                background-color: #f3f4f6 !important;
                -webkit-print-color-adjust: exact;
            }

            .form-footer-wrapper {
                margin-top: auto !important; /* KEY: Pushes footer to absolute bottom of last page */
                padding-top: 30px;
                break-inside: avoid;
            }

            /* Fix for content lines */
            .field-row {
                border-bottom: 1px solid #f0f0f0 !important;
            }
          }

          @media screen {
            .content-wrapper {
                padding: 0 15mm;
                flex: 1;
            }
            .form-footer-wrapper {
                margin-top: auto;
            }
          }
        `}</style>

        <div className="a4-container">
          {/* HEADER - ONLY ONCE AT THE VERY TOP */}
          <Header />

          <div className="content-wrapper">
            <div className="flex justify-end items-center gap-3 mt-4">
              <span className="font-bold">SALE BILL NO-</span>
              <span className="bg-blue-700 text-white px-5 py-1 rounded font-bold">
                {salesBill.billNumber || 'RML-XXXXX'}
              </span>
            </div>

            <h1 className="form-title">MEMBERSHIP FORM</h1>

            <div className="intro-text">
              As Per Schemes and services of Rapid Medicolegal Services India Ltd. I here by voluntarily to be a member
              of Rapid for Which I Deposit Rs. <span className="underline decoration-dotted font-bold px-2">{isMonthly ? monthlyAmount : (salesBill.totalAmount?.toLocaleString('en-IN') || '________')}</span> 
              {isMonthly ? (
                <span className="bg-yellow-300 px-2 font-bold ml-1">month / per month</span>
              ) : (
                <> for <span className="bg-yellow-300 px-2 font-bold">{membershipYears} Years</span></>
              )}
              {" "}and I am quoting my details below.
            </div>

            {/* Doctor 1 Details */}
            {(doctorType === 'individual' || doctorType === 'hospital_individual') && (
              <div className="section-group">
                <div className="section-header">DOCTOR DETAILS _1</div>
                <div className="field-row">
                  <span className="field-label">Full Name:</span>
                  <span className="field-value font-bold">{primaryDoctor.fullName}</span>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Qualification:</span>
                    <span className="field-value">{primaryDoctor.qualification}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Speciality:</span>
                    <span className="field-value">{Array.isArray(primaryDoctor.specialization) ? primaryDoctor.specialization.join(', ') : primaryDoctor.specialization}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Medical Registration No.:</span>
                    <span className="field-value">{primaryDoctor.licenseNumber}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Regi. Year:</span>
                    <span className="field-value">{primaryDoctor.registrationYear}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Date of Birth:</span>
                    <span className="field-value">{formatDate(primaryDoctor.dateOfBirth)}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Mobile:</span>
                    <span className="field-value">{primaryDoctor.phoneNumber}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Mobile (Wa):</span>
                    <span className="field-value">{primaryDoctor.whatsappNumber}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Email:</span>
                    <span className="field-value">{primaryDoctor.email}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Aadhar Number:</span>
                    <span className="field-value">{primaryDoctor.aadharNumber}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Pan Number:</span>
                    <span className="field-value uppercase">{primaryDoctor.panNumber}</span>
                  </div>
                </div>
                <div className="field-row">
                  <span className="field-label">Residential Address:</span>
                  <span className="field-value">
                    {primaryDoctor.contactDetails?.currentAddress?.address || '________________'},
                    {primaryDoctor.contactDetails?.currentAddress?.taluka || '________________'},
                    {primaryDoctor.contactDetails?.currentAddress?.district || '________________'},
                        {primaryDoctor.contactDetails?.currentAddress?.city || '________________'},
                    {primaryDoctor.contactDetails?.currentAddress?.state || '________________'},
                    {primaryDoctor.contactDetails?.currentAddress?.country || '________________'},
                
                    {primaryDoctor.contactDetails?.currentAddress?.pinCode && (
                      <span className="font-bold ml-2">, {primaryDoctor.contactDetails.currentAddress.pinCode}</span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Doctor 2 Details (Spouse) */}
            {isLinked && (
              <div className="section-group">
                <div className="section-header">DOCTOR DETAILS _2</div>
                <div className="field-row">
                  <span className="field-label">Full Name:</span>
                  <span className="field-value font-bold">{linkedDoctor.fullName}</span>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Qualification:</span>
                    <span className="field-value">{linkedDoctor.qualification}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Speciality:</span>
                    <span className="field-value">{Array.isArray(linkedDoctor.specialization) ? linkedDoctor.specialization.join(', ') : linkedDoctor.specialization}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Medical Registration No.:</span>
                    <span className="field-value font-semibold">{linkedDoctor.licenseNumber}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Regi. Year:</span>
                    <span className="field-value">{linkedDoctor.registrationYear}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Date of Birth:</span>
                    <span className="field-value">{formatDate(linkedDoctor.dateOfBirth)}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Mobile:</span>
                    <span className="field-value">{linkedDoctor.phoneNumber}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Mobile (Wa):</span>
                    <span className="field-value">{linkedDoctor.whatsappNumber}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Email:</span>
                    <span className="field-value">{linkedDoctor.email}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Aadhar Number:</span>
                    <span className="field-value">{linkedDoctor.aadharNumber}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Pan Number:</span>
                    <span className="field-value uppercase">{linkedDoctor.panNumber}</span>
                  </div>
                </div>
                <div className="field-row">
                  <span className="field-label">Residential Address:</span>
                  <span className="field-value">
                    {linkedDoctor.contactDetails?.currentAddress?.address || '________________'}
                    {linkedDoctor.contactDetails?.currentAddress?.pinCode && (
                      <span className="font-bold ml-2">, Pin Code: {linkedDoctor.contactDetails.currentAddress.pinCode}</span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Hospital Details */}
            {isHospital && (
              <div className="section-group">
                <div className="section-header">HOSPITAL DETAILS:</div>
                <div className="field-row">
                  <span className="field-label">Hospital / Clinic Name:</span>
                  <span className="field-value font-bold">{primaryDoctor.hospitalName}</span>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Type Of Hospital:</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.hospitalType}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">No. of Beds:</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.beds}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Registration No.:</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.licenseNumber}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Year of Establishment:</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.establishmentYear}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Hospital pan no:</span>
                    <span className="field-value uppercase">{primaryDoctor.hospitalDetails?.hospitalPanNumber}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Mobile:</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.director?.contact}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Mobile (Wa):</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.admin?.contact}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Email:</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.director?.email}</span>
                  </div>
                </div>
                <div className="field-row">
                  <span className="field-label">Hospital Address</span>
                  <span className="field-value">
                    {primaryDoctor.hospitalAddress?.address}
                    {primaryDoctor.hospitalAddress?.pinCode && (
                      <span className="font-bold ml-2">, Pin Code: {primaryDoctor.hospitalAddress.pinCode}</span>
                    )}
                  </span>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">City:</span>
                    <span className="field-value">{primaryDoctor.hospitalAddress?.city}</span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">District :</span>
                    <span className="field-value">{primaryDoctor.hospitalAddress?.district}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">State:</span>
                    <span className="field-value">{primaryDoctor.hospitalAddress?.state}</span>
                  </div>
                </div>

                <div className="section-header">AUTHORIZED PERSON DETAILS (OWNER/ADMIN):</div>
                <div className="mt-2 pl-2">
                  <div className="field-row">
                    <span className="mr-2">1.</span>
                    <span className="field-label">Director Name/ Medical Superintendent:</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.director?.name}</span>
                  </div>
                  <div className="field-row ml-6">
                    <span className="field-label">Designation:</span>
                    <span className="field-value">________________</span>
                  </div>
                  <div className="field-row ml-6">
                    <span className="field-label">Director contact no..:</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.director?.contact}</span>
                  </div>
                  <div className="field-row ml-6">
                    <span className="field-label">Email:</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.director?.email}</span>
                  </div>

                  <div className="field-row mt-2">
                    <span className="mr-2">2.</span>
                    <span className="field-label">Admin / Mgmt Officer Name:</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.admin?.name}</span>
                  </div>
                  <div className="field-row ml-6">
                    <span className="field-label">Contact no..:</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.admin?.contact}</span>
                  </div>
                  <div className="field-row ml-6">
                    <span className="field-label">Email :</span>
                    <span className="field-value">{primaryDoctor.hospitalDetails?.admin?.email}</span>
                  </div>
                </div>

                <div className="section-header">AVAILABLE DEPARTMENT:</div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-2 mt-2 pl-4">
                  {(primaryDoctor.hospitalDetails?.departments || ['________________', '________________', '________________']).map((dept, i) => (
                    <div key={i} className="flex items-center">
                      <span className="font-bold">{i+1}.</span>
                      <div className="dept-line">{dept}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Membership Details */}
            <div className="section-group">
              <div className="section-header">MEMBERSHIP DETAILS:</div>
              <div className="field-row">
                <span className="field-label">Membership Type:</span>
                <span className="field-value font-semibold uppercase">{primaryDoctor.doctorType}</span>
              </div>
              <div className="field-row">
                <span className="field-label">Memberhsip plan:</span>
                <span className="field-value font-bold text-blue-700">{salesBill.membershipType}</span>
              </div>
              <div className="field-row">
                <span className="field-label">Start Date:</span>
                <span className="field-value">{formatDate(salesBill.billDate)}</span>
              </div>
              {isMonthly ? (
                <>
                  <div className="field-row">
                    <span className="field-label">Membership End Date:</span>
                    <span className="field-value text-red-600 font-bold leading-tight">A Mandatory Lock-in Period of one year Applies; Thereafter membership continues until terminated by Doctor.</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="field-row">
                    <span className="field-label">End Date:</span>
                    <span className="field-value">{formatDate(salesBill.dueDate)}</span>
                  </div>
                  <div className="field-row">
                    <span className="field-label">Membership Period:</span>
                    <span className="field-value font-bold">{membershipYears} Year(s)</span>
                  </div>
                </>
              )}
            </div>

            {/* Payment Details */}
            <div className="section-group">
              <div className="section-header">PAYMENT DETAILS:</div>
              <table className="payment-table">
                <tbody>
                  <tr>
                    <td className="payment-label">Payment Date</td>
                    <td className="payment-val">{formatDate(firstPayment?.paymentDate || salesBill.billDate)}</td>
                    <td className="payment-label">Service Charges</td>
                    <td className="payment-val">
                      ₹{isMonthly 
                        ? (salesBill.items?.find(i => i.serviceType === 'consultation')?.amount || salesBill.subTotal)?.toLocaleString('en-IN')
                        : salesBill.subTotal?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td className="payment-label">Payment Mode</td>
                    <td className="payment-val uppercase">{firstPayment?.paymentMethod || '---'}</td>
                    <td className="payment-label">GST</td>
                    <td className="payment-val">₹{(salesBill.totalAmount - salesBill.subTotal)?.toLocaleString('en-IN')}</td>
                  </tr>
                  {firstPayment?.paymentMethod?.toLowerCase() === 'cheque' && (
                    <>
                      <tr>
                        <td className="payment-label">Cheque No.</td>
                        <td className="payment-val">
                          {firstPayment?.paymentId?.chequeNo || 
                           firstPayment?.paymentId?.bankDetails?.chequeNumber || 
                           firstPayment?.referenceNumber || '---'}
                        </td>
                        <td className="payment-label">Cheque Date</td>
                        <td className="payment-val">
                          {formatDate(firstPayment?.paymentId?.chequeDate || 
                                      firstPayment?.paymentId?.bankDetails?.chequeDate || 
                                      firstPayment?.paymentDate)}
                        </td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td className="payment-label">Ref / Tr No.</td>
                    <td className="payment-val">{firstPayment?.referenceNumber || 'PAYMENTS ONLINE TRANSFER'}</td>
                    <td className="payment-label">Indemnity Premium</td>
                    <td className="payment-val text-xs font-bold uppercase">{indemnityPremiumDisplay}</td>
                  </tr>
                  <tr>
                    <td className="payment-label">Drawn On</td>
                    <td className="payment-val">{firstPayment?.paymentId?.drawnOnBank || firstPayment?.paymentId?.bankDetails?.bankName || '-'}</td>
                    <td className="payment-label">Total</td>
                    <td className="payment-val font-bold text-blue-800">
                      {isMonthly ? monthlyAmount : salesBill.totalAmount?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Declaration */}
            <div className="mt-8 italic text-gray-700">
              I / We hereby declare that we have fully understood the policy coverage details, services, rules, and regulations of Rapid Medicolegal Services India Ltd.
            </div>

            <div className="signature-section">
              <div className="sig-box">
                <div className="sig-line"></div>
                <span className="font-bold">Doctor 1 Signature</span>
              </div>
              {isLinked && (
                <div className="sig-box">
                  <div className="sig-line"></div>
                  <span className="font-bold">Doctor 2 Signature</span>
                </div>
              )}
            </div>

            <div className="mt-12 mb-4">
              <span className="font-bold">Name of Executive/Officer:</span>
              <div className="flex items-end gap-3 mt-4">
                 <div className="border-b border-black w-64 h-6 px-2 font-bold uppercase">
                   {primaryDoctor.createdBy?.fullName || '________________'}
                 </div>
                 <span className="text-[11px] font-medium text-gray-500 uppercase">(Sales Person Name)</span>
              </div>
            </div>
          </div>

          {/* FOOTER - ONLY AT THE VERY BOTTOM OF THE LAST PAGE */}
          <div className="form-footer-wrapper">
             <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewMembershipForm;
