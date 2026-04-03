// InvoiceFooter.jsx
import React from 'react';

const InvoiceFooter = () => {
  return (
    <div className="footer border-t-2 border-gray-800 pt-3 mt-6 text-xs text-gray-600 w-full max-w-full">
      <div className="flex flex-wrap justify-between w-full">
        <div className="w-full md:w-1/2 mb-4 md:mb-0 md:pr-4">
          <div className="mb-2">
            <strong>Register Office:</strong><br />
            S.R. No. 75/24, Plot No. 6, Bharati Nagar, R K Nagar, Morewadi,<br />
            Tal-Karveer, Kolhapur, Maharashtra, India. 416013<br />
            Contact: 0231-2664275, 9421464275
          </div>
          <div>
            <strong>Head & Corporate Office (KOLHAPUR):</strong><br />
            No. 5 & 6, 3rd Floor, Star Tower, 1113/1, Panch bunglow,<br />
            Shahupuri, Kolhapur, Maharashtra, India. 416001<br />
            Contact: +91-9421464275
          </div>
        </div>

        <div className="w-full md:w-1/2 md:pl-4">
          <div className="mb-2">
            <strong>Regional Offices:</strong><br />
            <strong>MUMBAI:</strong> House No 158, Ananje Master Building, No-7,<br />
            Kakasaheb Gadgil Marg, Prohadevi, Mumbai 400025.<br />
            Contact: +91-9421584275<br />
            <strong>SOLAPUR:</strong> 40, Sarvade Nagar, Mulegaon Road, Solapur, India. 413005<br />
            Contact: +91-9405734275
          </div>
          <div className="mb-2">
            <strong>DHARWAD:</strong> Mahadev Nilay, Training College Road,<br />
            Behind, K. C. Park, Dharwad, Karnataka, India. 580008<br />
            Contact: +91-9665444275
          </div>
          <div>
            <strong>Other Branches:</strong><br />
            Goa, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu.
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;