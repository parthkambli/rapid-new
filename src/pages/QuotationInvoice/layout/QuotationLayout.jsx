


// import React, { forwardRef } from 'react';
// import HeaderImage from '../components/HeaderImage';
// import FooterImage from '../components/FooterImage';

// const   QuotationLayout = forwardRef(({ children, membershipType }, ref) => {
//   return (
//     <div className="bg-gray-100 min-h-screen print:min-h-0 print:bg-white">
//       <div
//         ref={ref}
//         className="mx-auto bg-white print:shadow-none"
//         style={{ width: '210mm', maxWidth: '100%' }}
//       >
//         {/* SCREEN VIEW */}
//         <div className="print:hidden">
//           <HeaderImage />
//           <div className="px-8 pt-6 pb-20"> {/* Comfortable screen padding */}
//             {children}
//           </div>
//           <FooterImage />
//         </div>

//         {/* PRINT VIEW - Har page pe header/footer repeat */}
//         <div className="hidden print:block">
//           {/* Page Container with exact A4 */}
//           <div className="page-a4">
//             <HeaderImage />
//             <div className="content-area">
//               {children}
//             </div>
//             <FooterImage />
//           </div>

//           {/* Additional pages ke liye placeholder - content overflow hone pe automatically repeat hoga */}
//           {/* React mein multiple pages ke liye children mein page-break use kar rahe hain */}
//         </div>
//       </div>
//     </div>
//   );
// });

// export default QuotationLayout;






// import React, { forwardRef } from 'react';
// import HeaderImage from '../components/HeaderImage';
// import FooterImage from '../components/FooterImage';

// const QuotationLayout = forwardRef(({ children, membershipType }, ref) => {
//   return (
//     <div className="bg-gray-100 min-h-screen print:bg-white">
//       {/* PRINT VIEW */}
//       <div className="hidden print:block print-wrapper" ref={ref}>
//         {/* HEADER - EVERY PAGE */}
//         <div className="print-header">
//           <HeaderImage />
//         </div>
        
//         {/* CONTENT AREA */}
//         <div className="print-content">
//           {children}
//         </div>
        
//         {/* FOOTER - EVERY PAGE */}
//         <div className="print-footer">
//           <FooterImage />
//         </div>
//       </div>
      
//       {/* SCREEN VIEW */}
//       <div className="print:hidden bg-white mx-auto" style={{ maxWidth: '210mm' }}>
//         <div className="screen-header mt-12">
//           {/* RAPID MEDICOLEGAL SERVICES INDIA LTD. - QUOTATION PREVIEW */}
//           < HeaderImage />
//         </div>
        
//         <div className="px-10 py-8">
//           {children}
//         </div>
        
//         <div className="screen-footer">
//           {/* Click PRINT button to generate professional quotation */}
//           < FooterImage />
//         </div>
//       </div>
//     </div>
//   );
// });

// export default QuotationLayout;







// import React, { forwardRef } from 'react';
// import HeaderImage from '../components/HeaderImage';
// import FooterImage from '../components/FooterImage';

// const QuotationLayout = forwardRef(({ children, membershipType }, ref) => {
//   return (
//     <div className="bg-gray-100 min-h-screen print:min-h-0 print:bg-white">
//       {/* PRINT VIEW ONLY - Header/Footer FIXED position */}
//       <div className="hidden print:block print-wrapper" ref={ref}>
//         {/* Header - EVERY PAGE (FIXED) */}
//         <div className="print-header fixed top-0 left-0 right-0 z-50">
//           <HeaderImage />
//         </div>
        
//         {/* Footer - EVERY PAGE (FIXED) */}
//         <div className="print-footer fixed bottom-0 left-0 right-0 z-50">
//           <FooterImage />
//         </div>
        
//         {/* Content Area with safe margins */}
//         <div className="print-content relative z-10">
//           {children}
//         </div>
//       </div>
      
//       {/* SCREEN VIEW ONLY - NO Header/Footer in content */}
//       <div className="print:hidden bg-white mx-auto max-w-4xl shadow-lg">
//         {/* Screen Header (Preview Only) */}
//         <div className="bg-blue-800 text-white p-4 text-center">
//           <h1 className="text-xl font-bold">QUOTATION PREVIEW</h1>
//           <p className="text-sm">Use PRINT button for professional version</p>
//         </div>
        
//         {/* Content for screen */}
//         <div className="p-8">
//           {children}
//         </div>
        
//         {/* Screen Footer (Preview Only) */}
//         <div className="bg-gray-100 p-4 text-center text-sm text-gray-600 border-t">
//           <p>This is a preview. Actual print will have proper header/footer.</p>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default QuotationLayout;






// QuotationLayout.jsx - SIMPLE VERSION
import React, { forwardRef } from 'react';
import HeaderImage from '../components/HeaderImage';
import FooterImage from '../components/FooterImage';

const QuotationLayout = forwardRef(({ children, membershipType }, ref) => {
  return (
    <div className="bg-gray-100 min-h-screen print:min-h-0 print:bg-white">
      {/* PRINT VIEW */}
      <div className="hidden print:block print-wrapper" ref={ref}>
        {/* Fixed Header - Visible on every page */}
        <div className="print-header fixed top-0 left-0 right-0">
          <HeaderImage />
        </div>
        
        {/* Fixed Footer - Visible on every page */}
        <div className="print-footer fixed bottom-0 left-0 right-0">
          <FooterImage />
        </div>
        
        {/* Main Content */}
        <div className="print-content">
          {children}
        </div>
      </div>
      
      {/* SCREEN VIEW */}
      <div className="print:hidden bg-white mx-auto max-w-4xl shadow-lg">
        {/* <div className="bg-blue-800 text-white p-4 text-center">
          <h1 className="text-xl font-bold">QUOTATION PREVIEW</h1>
          <p className="text-sm">Use PRINT button for professional version</p>
        </div> */}
        <div>
          <HeaderImage />
        </div>
        
        <div className="p-8">
          {children}
        </div>
        
        <div className="">
          {/* <p>This is a preview. Actual print will have proper header/footer.</p> */}
          <FooterImage />
        </div>
      </div>
    </div>
  );
});

export default QuotationLayout;