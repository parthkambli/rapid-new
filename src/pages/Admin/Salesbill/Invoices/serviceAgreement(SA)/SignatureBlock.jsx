// // components/SignatureBlock.jsx
// import React from 'react';
// import signatureImg from '../../../../../assets/Salesbill/signature.png';
// import stampImg     from '../../../../../assets/Salesbill/stamp.png';
// import FooterImg from './Footer'
// const SignatureBlock = ({ doctorName, date }) => (
//   <div className=" mx-auto break-inside-avoid">
//     <div className="text-[14px] mt-4 ml-10 text-left mb-6">
//       In witness whereof the parties hereto have hereunto set and subscribed their respective hands, this <b>{date}</b> day of
//     </div>
//     <div className="text-[12px] my-4">Sd/-</div>
//     <div className="text-[12px] my-4">The Doctor</div>
//     <div className="text-center ml-24 my-8">
//       <div className="h-16 flex items-end justify-center">
//         {/* <img src={signatureImg} alt="Doctor Signature" className="h-12" /> */}
//         <p className='h-12'></p>
//       </div>
//       <strong>{doctorName}</strong>
//     </div>
//     <div className="text-[12px] my-4 ">The Company</div>
//     <div className="text-center ml-24 my-8">
//       <div className="h-28 flex items-end justify-center">
//         <img src={signatureImg} alt="Authorized Signature" className="h-18" />
//       </div>
//       <strong>AUTHORIZED SIGNATURE</strong><br />
//       <strong>RAPID MEDICO LEGAL SERVICES INDIA LTD.</strong><br />
//       <img src={stampImg} alt="Company Stamp" className="h-32 mx-auto mt-4 " />
//     </div>
//     <div className="text-right mt-16 text-[12px] mb-8">
//       CO. SEAL<br />
//       PLACE - KOLHAPUR<br />
//       DATE - {date}
//     </div>
//     <FooterImg />
//   </div>
// );

// export default SignatureBlock;

// components/SignatureBlock.jsx
import React from 'react';
import signatureImg from '../../../../../assets/Salesbill/signature.png';
import stampImg from '../../../../../assets/Salesbill/stamp.png';
import FooterImg from './Footer';

const SignatureBlock = ({ doctorName, date, hideFooter = false }) => (
  <div className="mx-auto break-inside-avoid">
    <div className="text-[14px] mt-4 ml-10 text-left mb-6">
      In witness whereof the parties hereto have hereunto set and subscribed their respective hands, this <b>{date}</b> day of
    </div>
    
    <div className="text-[12px] my-4">Sd/-</div>
    <div className="text-[12px] my-4">The Doctor</div>
    
    <div className="text-center ml-24 my-8">
      <div className="h-16 flex items-end justify-center">
        <p className='h-12'></p>
      </div>
      <strong>{doctorName}</strong>
    </div>
    
    <div className="text-[12px] my-4">The Company</div>
    
    <div className="text-center ml-24 my-8">
      <div className="h-28 flex items-end justify-center">
        <img src={signatureImg} alt="Authorized Signature" className="h-18" />
      </div>
      <strong>AUTHORIZED SIGNATURE</strong><br />
      <strong>RAPID MEDICO LEGAL SERVICES INDIA LTD.</strong><br />
      <img src={stampImg} alt="Company Stamp" className="h-32 w-32 mx-auto mt-4" />
    </div>
    
    <div className="text-right mt-16 text-[12px] mb-8">
      CO. SEAL<br />
      PLACE - KOLHAPUR<br />
      DATE - {date}
    </div>
    
    {/* ✅ Conditionally render footer */}
    {!hideFooter && <FooterImg />}
  </div>
);

export default SignatureBlock;