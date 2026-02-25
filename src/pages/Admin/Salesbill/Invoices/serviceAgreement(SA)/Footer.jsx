// // components/Footer.jsx
// import React from 'react';
// import footerImg from '../../../../../assets/quotation/footer.png'; // Assume asset path for footer image

// const Footer = () => (
//   <div className="break-before-avoid w-full mt-8 print:mt-0">
//     <img src={footerImg} alt="Rapid MedicoLegal Footer" className="w-full h-auto" />
//   </div>
// );

// export default Footer;







// Updated components/Footer.jsx (renamed to FooterImg in SignatureBlock, but assuming it's used)
import React from 'react';
import footerImg from '../../../../../assets/quotation/footer.png'; // Assume asset path for footer image

const Footer = () => (
  <div className="w-full mt-8 print:mt-0 break-before-avoid "> {/* Kept break-before-avoid for footer stability */}
    <img src={footerImg} alt="Rapid MedicoLegal Footer" className="w-full h-[27mm] print:h-[35mm]" />
  </div>
);

export default Footer;