// // components/Header.jsx
// import React from 'react';
// import headerImg from '../../../../../assets/quotation/Header.png'; // Assume asset path

// const Header = () => (
//   <div className="break-after-page w-full mb-4 print:mb-0">
//     <img src={headerImg} alt="Rapid MedicoLegal Header" className="w-full h-auto" />
//   </div>
// );

// export default Header;




// Updated components/Header.jsx
import React from 'react';
import headerImg from '../../../../../assets/quotation/Header.png'; // Assume asset path

const Header = () => (
  <div className="w-full mb-4 print:mb-0"> {/* Removed break-after-page to prevent Page 1 isolation */}
    <img src={headerImg} alt="Rapid MedicoLegal Header" className="w-full h-auto" />
  </div>
);

export default Header;