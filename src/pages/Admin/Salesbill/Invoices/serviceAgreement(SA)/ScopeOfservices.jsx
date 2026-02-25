// components/ScopeOfServices.jsx
import React from 'react';

const ScopeOfServices = ({ color = 'text-black' }) => (
  <div className={`my-4 break-inside-avoid ${color}`}>
    <div className="font-bold text-[12px] mt-10 mb-4 uppercase">Scope of Services</div>
    <ol className="ml-5 list-decimal space-y-1">
      <li>Medico-Legal matters</li>
      <li>Risk Management Services</li>
      <li>Legal Advisory</li>
      <li>Litigation</li>
      <li>Statutory Compliance Free consulting</li>
    </ol>
  </div>
);

export default ScopeOfServices;