// components/ParagraphBlock.jsx
import React from 'react';

const ParagraphBlock = ({ children }) => (
  <div className="my-4 break-inside-avoid  leading-5">
    {children}
  </div>
);

export default ParagraphBlock;