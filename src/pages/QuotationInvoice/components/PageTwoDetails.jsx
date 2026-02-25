// components/PageTwoDetails.jsx
import React from 'react';
import PricingTable from './PricingTable';
import BankDetailsQR from './BankDetailsQR';

const PageTwoDetails = ({ data }) => {
  const {
    doctor_name = "DR. JOHN DOE",
    hospital_name = "CITY HOSPITAL",
    address = "Mumbai, Maharashtra",
    specialization = "MULTI SPECIALITY",
    membership_type = "HOSPITAL MEMBERSHIP",
    number_of_beds = "15",
    indemnity_cover = "10 LAKH"
  } = data || {};

  return (
    <section className="pricing-container page-break-inside-avoid no-break-inside mb-8">
      {/* Doctor/Hospital Info in Green */}
      <div className="text-green-700 font-semibold text-center text-base mb-6 space-y-1">
        <p className="font-bold">DR. NAME - <span className="font-normal">{doctor_name}</span></p>
        <p className="font-bold">HOSPITAL NAME - <span className="font-normal">{hospital_name}</span></p>
        <p className="font-bold">ADDRESS - <span className="font-normal">{address}</span></p>
      </div>

      {/* Red "AS BELOW AS" */}
      <p className="text-red-600 text-center font-bold text-lg mb-6">
        AS BELOW AS
      </p>

      {/* Pricing Table */}
      {/* <PricingTable data={{
        membership_type,
        specialization,
        number_of_beds,
        indemnity_cover
      }} /> */}

      {/* <PricingTable data={data} /> */}

      <div className="pricing-table-wrapper">
  <PricingTable data={data} />
</div>

      {/* Bank Details */}
      <div className="mt-10 bank-details no-break-inside ">
        <BankDetailsQR data={data} />
      </div>
    </section>
  );
};

export default PageTwoDetails;  