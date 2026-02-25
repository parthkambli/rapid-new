// components/SectionBox.jsx
import React from 'react';

const SectionBox = ({ title, children, className = '' }) => (
  <div className={`border border-gray-200 p-4 my-4 ${className} break-inside-avoid`}>
    {title && <div className="font-bold uppercase text-sm mb-3">{title}</div>}
    {children}
  </div>
);

export default SectionBox;