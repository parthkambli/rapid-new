import React, { useEffect, useRef, useState } from 'react';
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
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);
  const [printFooterSpacer, setPrintFooterSpacer] = useState(0);

  const calculatePrintFooterSpacer = () => {
    if (!pageRef.current || !headerRef.current || !contentRef.current || !footerRef.current) {
      setPrintFooterSpacer(0);
      return;
    }

    if (isSingleDoctor || isSpouseOnly || isSpouseHospitalIndividual) {
      setPrintFooterSpacer(0);
      return;
    }

    const measure = document.createElement('div');
    measure.style.width = '1mm';
    measure.style.height = '1mm';
    measure.style.position = 'absolute';
    measure.style.visibility = 'hidden';
    document.body.appendChild(measure);

    const pxPerMm = measure.getBoundingClientRect().height || 3.78;
    document.body.removeChild(measure);

    const printablePageHeight = 277 * pxPerMm;
    const headerHeight = headerRef.current.getBoundingClientRect().height;
    const contentHeight = contentRef.current.getBoundingClientRect().height;
    const footerHeight = footerRef.current.getBoundingClientRect().height;
    const contentBeforeFooter = headerHeight + contentHeight;
    const usedOnLastPage = contentBeforeFooter % printablePageHeight;
    const remainingOnLastPage = usedOnLastPage === 0 ? printablePageHeight : printablePageHeight - usedOnLastPage;

    let spacer = 0;

    if (remainingOnLastPage >= footerHeight) {
      spacer = remainingOnLastPage - footerHeight;
    } else {
      spacer = 0;
    }

    if (!isLinked) {
      const maxSafeSpacer = printablePageHeight * 0.35;
      spacer = Math.min(spacer, maxSafeSpacer);
    }

    const safeSpacer = spacer < 24 ? 0 : spacer;
    setPrintFooterSpacer(Math.max(0, safeSpacer));
  };

  const primaryDoctor = doctor?.originalDoctor || {};
  const linkedDoctor = doctor?.originalLinkedDoctor || {};
  const isLinked = !!doctor?.hasSpouse;
  const doctorType = primaryDoctor.doctorType || 'individual';
  const isHospital = doctorType === 'hospital' || doctorType === 'hospital_individual';
  const isSingleDoctor = !isLinked && !isHospital;
  const isSpouseOnly = isLinked && !isHospital;
  const isSpouseHospitalIndividual = isLinked && doctorType === 'hospital_individual';
  const isHospitalOnly = !isLinked && doctorType === 'hospital';
  const forceBreakAfterSpouse = isLinked;
  const forceBreakAfterHospitalAuth = !isLinked && doctorType === 'hospital_individual';
  const hospitalAuthBreakClass = '';
  const spouseOnlyPrintClass = isSpouseOnly ? 'spouse-only-print' : '';

  const handlePrint = () => {
    calculatePrintFooterSpacer();
    window.print();
  };

  useEffect(() => {
    const handleBeforePrint = () => {
      calculatePrintFooterSpacer();
    };

    const handleAfterPrint = () => {
      setPrintFooterSpacer(0);
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [salesBill, doctor, policies]);

  useEffect(() => {
    calculatePrintFooterSpacer();
  }, [salesBill, doctor, policies, isLinked, isHospital]);

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

  // Calculate membership years
  const calculateYears = (start, end) => {
    if (!start || !end) return '______';
    const s = new Date(start);
    const e = new Date(end);

    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
      return '______';
    }

    // Treat membership end date as inclusive so 1 Jan 2024 to 31 Dec 2024 counts as 1 year.
    e.setDate(e.getDate() + 1);

    let years = e.getFullYear() - s.getFullYear();
    if (e.getMonth() < s.getMonth() || (e.getMonth() === s.getMonth() && e.getDate() < s.getDate())) {
      years--;
    }

    return years >= 1 ? years : '______';
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

  const membershipBreakClass =
    isSingleDoctor ? 'print-page-break-before' : '';
  const availableDepartmentBreakClass = isHospitalOnly ? 'print-page-break-before' : '';
  const membershipSectionBreakAfterClass = isSpouseHospitalIndividual ? 'print-page-break-after' : '';

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
          .field-row { display: flex; border: 1px solid #d4d4d4; border-top: none; align-items: stretch; min-width: 0; }
          .field-label { color: red; font-weight: 500; min-width: 118px; padding: 7px 8px; border-right: 1px solid #d4d4d4; display: flex; align-items: center; flex-shrink: 0; font-size: 12px; }
          .field-value { flex: 1; min-width: 0; padding: 7px 8px; color: #000; display: flex; align-items: center; white-space: nowrap; overflow: hidden; font-size: 11px; letter-spacing: -0.15px; }
          .field-value1 { flex: 1; min-width: 0; padding: 7px 8px; color: #000; display: flex; align-items: center; white-space: wrap; overflow: hidden; font-size: 10px; letter-spacing: -0.15px; }
          .dept-line { border-bottom: 1px solid #333; flex: 1; margin-left: 5px; min-height: 20px; }
          .field-half { width: 50%; min-width: 0; display: flex; align-items: stretch; flex: 1 1 0; }
          .field-half + .field-half { border-left: 1px solid #d4d4d4; }
          .auth-field-row { display: flex; align-items: stretch; }
          .auth-field-number { width: 40px; min-width: 40px; display: flex; align-items: center; justify-content: center; font-weight: 700; border-right: 1px solid #d4d4d4; }
          .auth-field-number.is-empty { color: transparent; }
          .auth-field-row .field-label { min-width: 165px; }
          .field-value.allow-wrap { white-space: normal; overflow: visible; line-height: 1.3; }
          .form-title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline; margin: 15px 0; }
          .intro-text { margin-bottom: 15px; text-align: justify; font-size: 14px; }
          .section-group .field-row:first-of-type { border-top: 1px solid #d4d4d4;  }
          
          .payment-table { width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #bdbdbd; }
          .payment-table td { border: 1px solid #bdbdbd; padding: 0 10px; height: 50px; vertical-align: middle !important; line-height: 1; }
          .payment-label { font-weight: bold; width: 22%; background-color: #f3f4f6 !important; }
          .payment-val { width: 28%; }
          
          .signature-section { display: flex; justify-content: space-between; margin-top: 80px; padding: 0 30px; }
          .sig-box { text-align: center; width: 220px; }
          .sig-line { border-top: 1px solid #000; margin-bottom: 5px; }
          .print-footer-spacer { display: none; }

          /* ========== PRINT VIEW STYLES ========== */
          @media print {
            @page {
              size: A4;
              margin: 10mm;
            }
 .field-row {
    page-break-inside: avoid;
  }

    table, tr, td {
    page-break-inside: avoid;
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
              min-height: 277mm !important;
              display: flex !important;
              flex-direction: column !important;
              border: none !important;
            }

            .content-wrapper {
                padding: 0 5mm;
                // flex: 1 0 auto !important;
              display: block !important;
                }

            .section-group {
              break-inside: auto;
                page-break-inside: auto;
              margin-top: 25px;
            }
              .field-row {
  page-break-inside: avoid;
}

            .payment-table td {
                height: 50px !important;
                vertical-align: middle !important;
                padding: 0 10px !important;
                border: 1px solid #bdbdbd !important;
            }
            
            .payment-label {
                background-color: #f3f4f6 !important;
                -webkit-print-color-adjust: exact;
            }

            .form-footer-wrapper {
                margin-top: auto !important;
                padding-top: 12mm;
                break-inside: avoid !important;
                page-break-inside: avoid !important;
                page-break-before: auto !important;
            }

            .print-footer-spacer {
                display: block !important;
            }

            .print-page-break-after {
                break-after: page !important;
                page-break-after: always !important;
            }

            .print-page-break-before {
                break-before: page !important;
                page-break-before: always !important;
            }

            .spouse-only-print .section-group {
                margin-top: 18px;
            }

            .spouse-only-print .signature-section {
                margin-top: 32px;
            }

            .spouse-only-print .mt-12 {
                margin-top: 1.5rem !important;
            }

            .spouse-only-print .content-wrapper {
                padding-top: 0 !important;
            }

            .spouse-only-print .form-footer-wrapper {
                padding-top: 6mm !important;
            }

            .spouse-only-print .form-footer-wrapper img {
                height: 28mm !important;
            }

            /* Fix for content lines */
            .field-row {
                border-color: #d4d4d4 !important;
            }

            .field-label,
            .field-half + .field-half,
            .auth-field-number {
                border-color: #d4d4d4 !important;
            }
          }

          @media screen {
            .content-wrapper {
                padding: 0 15mm;
                flex: 1;
            }
            .print-footer-spacer {
                display: none;
            }
            .form-footer-wrapper {
                margin-top: auto;
            }
          }
        `}</style>

        <div ref={pageRef} className={`a4-container ${spouseOnlyPrintClass}`}>
          {/* HEADER - ONLY ONCE AT THE VERY TOP */}
          <div ref={headerRef}>
            <Header />
          </div>

          <div ref={contentRef} className="content-wrapper">
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
                    <span className="field-value1">{Array.isArray(primaryDoctor.specialization) ? primaryDoctor.specialization.join(', ') : primaryDoctor.specialization}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Medical Regi No.:</span>
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
                  {/* <span className="field-value allow-wrap">
                    {primaryDoctor.contactDetails?.currentAddress?.address || '-'} , 
                    {primaryDoctor.contactDetails?.currentAddress?.city || '-'} , 
                    {primaryDoctor.contactDetails?.currentAddress?.taluka || '-'} , 
                    {primaryDoctor.contactDetails?.currentAddress?.district || '-'} , 
                    {primaryDoctor.contactDetails?.currentAddress?.state || '-'} , 
                    {primaryDoctor.contactDetails?.currentAddress?.country || '-'} ,                 
                    {primaryDoctor.contactDetails?.currentAddress?.pinCode && (
                      <span className="font-bold ml-2">, {primaryDoctor.contactDetails.currentAddress.pinCode}</span>
                    )}
                  </span> */}
                  <span className="field-value allow-wrap">
  {[
    primaryDoctor.contactDetails?.currentAddress?.address,
    primaryDoctor.contactDetails?.currentAddress?.city,
    primaryDoctor.contactDetails?.currentAddress?.taluka,
    primaryDoctor.contactDetails?.currentAddress?.district,
    primaryDoctor.contactDetails?.currentAddress?.state,
    primaryDoctor.contactDetails?.currentAddress?.country,
    primaryDoctor.contactDetails?.currentAddress?.pinCode
  ]
    .filter(Boolean)
    .join(' , ') || '-'}
</span>
                </div>
              </div>
            )}

            {/* Doctor 2 Details (Spouse) */}
            {isLinked && (
              <div className={`section-group ${forceBreakAfterSpouse ? 'print-page-break-after' : ''}`}>
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
                    <span className="field-value1">{Array.isArray(linkedDoctor.specialization) ? linkedDoctor.specialization.join(', ') : linkedDoctor.specialization}</span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">Medical Regi No.:</span>
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
                  {/* <span className="field-value allow-wrap">
                    {linkedDoctor.contactDetails?.currentAddress?.address || '_'}
                    {linkedDoctor.contactDetails?.currentAddress?.pinCode && (
                      <span className="font-bold ml-2">, Pin Code: {linkedDoctor.contactDetails.currentAddress.pinCode}</span>
                    )}
                  </span> */}

 <span className="field-value allow-wrap">
  {[
    linkedDoctor.contactDetails?.currentAddress?.address,
    linkedDoctor.contactDetails?.currentAddress?.city,
    linkedDoctor.contactDetails?.currentAddress?.taluka,
    linkedDoctor.contactDetails?.currentAddress?.district,
    linkedDoctor.contactDetails?.currentAddress?.state,
    linkedDoctor.contactDetails?.currentAddress?.country,
    linkedDoctor.contactDetails?.currentAddress?.pinCode
  ]
    .filter(Boolean)
    .join(' , ') || '-'}
</span>

                </div>
              </div>
            )}

            {!isHospital && (
              <div className="section-group">
                <div className="section-header">HOSPITAL / CLINIC DETAILS:</div>
                <div className="field-row">
                  <span className="field-label">Hospital Name:</span>
                  <span className="field-value">
                    {primaryDoctor.hospitalName || primaryDoctor.hospitalDetails?.hospitalName || '________________'}
                  </span>
                </div>
                <div className="field-row">
                  <span className="field-label">Hospital Address:</span>
                  <span className="field-value allow-wrap">
                    {primaryDoctor.hospitalAddress?.address ||
                      primaryDoctor.contactDetails?.clinicAddress?.address ||
                      primaryDoctor.contactDetails?.currentAddress?.address ||
                      '________________'}
                  </span>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">City:</span>
                    <span className="field-value">
                      {primaryDoctor.hospitalAddress?.city ||
                        primaryDoctor.contactDetails?.clinicAddress?.city ||
                        primaryDoctor.contactDetails?.currentAddress?.city ||
                        '________________'}
                    </span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">District:</span>
                    <span className="field-value">
                      {primaryDoctor.hospitalAddress?.district ||
                        primaryDoctor.contactDetails?.clinicAddress?.district ||
                        primaryDoctor.contactDetails?.currentAddress?.district ||
                        '________________'}
                    </span>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-half">
                    <span className="field-label">State:</span>
                    <span className="field-value">
                      {primaryDoctor.hospitalAddress?.state ||
                        primaryDoctor.contactDetails?.clinicAddress?.state ||
                        primaryDoctor.contactDetails?.currentAddress?.state ||
                        '________________'}
                    </span>
                  </div>
                  <div className="field-half">
                    <span className="field-label">Pin code:</span>
                    <span className="field-value">
                      {primaryDoctor.hospitalAddress?.pinCode ||
                        primaryDoctor.contactDetails?.clinicAddress?.pinCode ||
                        primaryDoctor.contactDetails?.currentAddress?.pinCode ||
                        '________________'}
                    </span>
                  </div>
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
                  <span className="field-value allow-wrap">
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

                <div className={`hospital-auth-section ${hospitalAuthBreakClass} ${forceBreakAfterHospitalAuth ? 'print-page-break-after' : ''}`}>
                  <div className="section-header">AUTHORIZED PERSON DETAILS (OWNER/ADMIN):</div>
                  <div className="mt-2">
                    <div className="field-row auth-field-row">
                      <span className="auth-field-number">1.</span>
                      <span className="field-label">Director Name/ Medical Superintendent:</span>
                      <span className="field-value">{primaryDoctor.hospitalDetails?.director?.name}</span>
                    </div>
                    <div className="field-row auth-field-row">
                      <span className="auth-field-number is-empty">.</span>
                      <span className="field-label">Designation:</span>
                      <span className="field-value">________________</span>
                    </div>
                    <div className="field-row auth-field-row">
                      <span className="auth-field-number is-empty">.</span>
                      <span className="field-label">Director contact no..:</span>
                      <span className="field-value">{primaryDoctor.hospitalDetails?.director?.contact}</span>
                    </div>
                    <div className="field-row auth-field-row">
                      <span className="auth-field-number is-empty">.</span>
                      <span className="field-label">Email:</span>
                      <span className="field-value">{primaryDoctor.hospitalDetails?.director?.email}</span>
                    </div>

                    <div className="field-row auth-field-row mt-2">
                      <span className="auth-field-number">2.</span>
                      <span className="field-label">Admin / Mgmt Officer Name:</span>
                      <span className="field-value">{primaryDoctor.hospitalDetails?.admin?.name}</span>
                    </div>
                    <div className="field-row auth-field-row">
                      <span className="auth-field-number is-empty">.</span>
                      <span className="field-label">Contact no..:</span>
                      <span className="field-value">{primaryDoctor.hospitalDetails?.admin?.contact}</span>
                    </div>
                    <div className="field-row auth-field-row">
                      <span className="auth-field-number is-empty">.</span>
                      <span className="field-label">Email :</span>
                      <span className="field-value">{primaryDoctor.hospitalDetails?.admin?.email}</span>
                    </div>
                  </div>
                </div>

                <div className={availableDepartmentBreakClass}>
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
              </div>
            )}

            {/* Membership Details */}
            <div className={`section-group ${membershipBreakClass} ${membershipSectionBreakAfterClass}`}>
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
                      {isMonthly ? `${monthlyAmount} per month` : salesBill.totalAmount?.toLocaleString('en-IN')}
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
              <p className="font-bold">Name of Executive/Officer:
              <span className="border-b border-black w-64 h-6 px-2 font-bold uppercase">
                   {primaryDoctor.createdBy?.fullName || '________________'}
                 </span>
                 </p>
                 <span className="text-[11px] font-medium text-gray-500 uppercase ml-[13rem]">(Sales Person Name)</span>
              {/* <div className=" gap-3 mt-4">
                 <div className="border-b border-black w-64 h-6 px-2 font-bold uppercase">
                   {primaryDoctor.createdBy?.fullName || '________________'}
                 </div>
                 <span className="text-[11px] font-medium text-gray-500 uppercase">(Sales Person Name)</span>
              </div> */}
            </div>
          </div>

          {/* FOOTER - ONLY AT THE VERY BOTTOM OF THE LAST PAGE */}
          <div
            className="print-footer-spacer"
            aria-hidden="true"
            style={{ height: printFooterSpacer ? `${printFooterSpacer}px` : 0 }}
          />
          <div ref={footerRef} className="form-footer-wrapper">
             <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewMembershipForm;
