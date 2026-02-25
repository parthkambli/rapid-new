// InvoiceHeader.jsx
import React from 'react';

const InvoiceHeader = () => {
  return (
    <div className="header border-b-2 border-gray-800 pb-3 mb-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            RAPID MEDICOLEGAL SERVICES INDIA LTD.
          </h1>
          <div className="text-sm font-semibold text-gray-600 mb-1">
            360° Medicolegal Protection
          </div>
          <div className="text-xs text-gray-500">
            An ISO 9001:2015 certified Company
          </div>
        </div>
        <div className="text-right text-xs text-gray-600">
          <div>rapidmedicolegal.in</div>
          <div>rapidmedicolegal@gmail.com</div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;