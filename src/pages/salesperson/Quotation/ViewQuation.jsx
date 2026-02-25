// import React, { useState, useEffect } from 'react';

// const ViewQuotation = () => {
//   const [quotationData, setQuotationData] = useState({
//     date: '',
//     hospitalName: '',
//     membershipDetails: [],
//     charges: '',
//     note: ''
//   });

//   // Dummy data for initial render
//   useEffect(() => {
//     setQuotationData({
//       date: '26/08/2025',
//       hospitalName: 'M/s Chandan Neuro Sciences Hospital',
//       membershipDetails: [
//         { particular: 'HOSPITAL MEMBERSHIP (ALL COVERAGE OF VISITING DOCTORS & QUALIFIED/UNQUALIFIED NURSING STAFF)', specialization: 'HOSPITAL', area: '' }
//       ],
//       charges: 'Rs 6000/-',
//       note: 'ABOVE QUOTATION IS FOR 150 BEDS.'
//     });
//   }, []);

//   // Fetch data from API (placeholder logic)
//   const fetchQuotationData = async () => {
// //     try {
// //       // Replace with actual API call
// //       const response = await fetch('https://api.example.com/quotation');
// //       const data = await response.json();
//       setQuotationData({
//         date: data.date || '',
//         hospitalName: data.hospitalName || '',
//         membershipDetails: data.membershipDetails || [],
//         charges: data.charges || '',
//         note: data.note || ''
//       });
// //     } catch (error) {
// //       console.error('Error fetching quotation data:', error);
//     // }
//   };

//   useEffect(() => {
//     fetchQuotationData();
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <div className="bg-white p-6 rounded shadow">
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center">
//             <img src="https://via.placeholder.com/150x50" alt="Logo" className="mr-2" />
//             <div>
//               <h1 className="text-xl font-bold">RAPID MEDICLEGAL SERVICES INDIA LTD.</h1>
//               <p className="text-sm">360° Medicolegal Protection</p>
//               <p className="text-sm">An ISO 9001:2015 certified Company</p>
//               <p className="text-sm">info@rapidmedicolegal.in | rapidmedicolegal@gmail.com</p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p>DATE - {quotationData.date}</p>
//           </div>
//         </div>

//         <div className="mb-4">
//           <p>Respected Doctor,</p>
//           <h2 className="text-lg font-semibold mb-2">Greetings from RAPID MEDICLEGAL SERVICES INDIA LTD.</h2>
//           <p className="text-red-600">!! You are invited!!</p>
//           <h3 className="text-lg font-semibold">TO BE THE PART OF INDIA’S ONLY</h3>
//           <h3 className="text-lg font-semibold">MEDICOLEGAL SERVICES & RISK MANAGEMENT COMPANY</h3>
//           <h3 className="text-lg font-semibold">FOR THE DOCTORS</h3>
//         </div>

//         <div className="mb-4">
//           <p>RAPID MEDICLEGAL SERVICES INDIA LTD. is a limited company incorporated under Indian Companies Act, 2013 with its offices throughout India. The company is having understanding with premiere Insurance Companies. The company through its massive network and trained professional specializes in liability and medical insurance policies in particular.</p>
//           <h4 className="font-semibold">Here’s why?</h4>
//           <ul className="list-disc list-inside text-green-600">
//             <li>India’s only risk Management Company in a complete or true sense with its nationwide operation.</li>
//             <li>A truly international standard service company with India’s top most legal and medico legal professionals.</li>
//             <li>24x7 services right at your doorstep.</li>
//             <li>Online connectivity with all experts, 100% crisis management infrastructure.</li>
//             <li>A platform to study national and international trends, problems and safety measurements through its dedicated website and regular journals.</li>
//             <li>Get covered for all medico legal, criminal and medical councils. This service is not given or managed by any other company or agents.</li>
//             <li>Get covered for all cases of consumer nature and prior cases. This facility is exclusive available for the entire doctors who are insured through any other company or agent. No question asked. If you are opting for us then we declare to take all your prior matters whenever it comes. We will arrange for all helps and compensation free of cost.</li>
//             <li>Get participated in our medico legal events, seminars or lectures which currently you are being deprived of and which we organize on regular intervals.</li>
//             <li>More than 600 empanelled lawyers to give a big accessibility and help in event of crisis. Due to our national infrastructure you must be reassured of getting on time services anywhere.</li>
//             <li>Get access to specialization wise medico legal experts who are doctor cum lawyer to represent your all medico legal cases.</li>
//             <li>Get recovery of hospital bills from TPA. Get your hospital documents and records.</li>
//           </ul>
//         </div>

//         <div className="mb-4">
//           <h3 className="text-lg font-semibold">M/s CHANDAN NEURO SCIENCES HOSPITAL</h3>
//           <p>18B/22, LAXMI PETH, DAMANI NAGHAR, NEAR RELIENCE MARKET, DEGAON ROAD, SOLAPUR, MAHARASHTRA INDIA</p>
//           <p>AS BELOW AS</p>
//           <table className="w-full mb-4">
//             <thead>
//               <tr>
//                 <th className="border p-2">Particular</th>
//                 <th className="border p-2">Specialization</th>
//                 <th className="border p-2">Area</th>
//               </tr>
//             </thead>
//             <tbody>
//               {quotationData.membershipDetails.map((item, index) => (
//                 <tr key={index}>
//                   <td className="border p-2">{item.particular}</td>
//                   <td className="border p-2">{item.specialization}</td>
//                   <td className="border p-2">{item.area}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <h3 className="text-lg font-semibold">Your new Yearly Membership Plan as below:</h3>
//           <table className="w-full mb-4">
//             <tbody>
//               <tr>
//                 <td className="border p-2">Year</td>
//                 <td className="border p-2">5 Year</td>
//               </tr>
//               <tr>
//                 <td className="border p-2">Charges</td>
//                 <td className="border p-2">{quotationData.charges}</td>
//               </tr>
//             </tbody>
//           </table>

//           <p className="italic">{quotationData.note}</p>
//         </div>

//         <div className="mb-4">
//           <p>Regards,</p>
//           <p>RAPID MEDICLEGAL SERVICES INDIA LTD.</p>
//           <p>24 x 7 ALL INDIA HELP LINE NO.</p>
//           <p>+91-9422584275, +91-9421584275, +91-9405734275, +91-865444275</p>
//           <p>NOTES:</p>
//           <ol className="list-decimal list-inside">
//             <li>RAPID MEDICLEGAL SERVICES INDIA LTD will handle all Medicolegal matters, Medicolegal cases & all legal notice of M/s CHANDAN NEURO SCIENCES HOSPITAL</li>
//             <li>We also take responsibility of legal compensation if hospital have error & omission policy/ doctor professional indemnity. In above quoted charges RAPID MEDICLEGAL SERVICES INDIA LTD will take care of all Consumer, criminal and civil court cases responsibility of CHANDAN NEURO SCIENCES HOSPITAL</li>
//             <li>RAPID MEDICLEGAL SERVICES INDIA LTD will also guide you about pre-litigation & post-litigation Matters of medicolegal cases. RAPID MEDICLEGAL SERVICES INDIA LTD will take all responsibility related to medical compensation, medicolegal issues, risk management & medicolegal opinion of M/s CHANDAN NEURO SCIENCES HOSPITAL</li>
//             <li>Owner, pay roll doctors, qualified nursing staff on call all doctors.</li>
//             <li>Looking forward for your approval the given quotation so we can start our services and you will be safe for all legal matters in hands RAPID MEDICLEGAL SERVICES INDIA LTD. India’s top most brand in medicolegal services, so you can fully concentrate on your profession.</li>
//             <li>Concentrate on your profession & handover your risk to RAPID.</li>
//           </ol>

//           <div className="mt-4">
//             <p>Register Office: S.R. No. 75/24, Plot No. 6, Bharati Nagar, R.K Nagar, Morewadi, Tal-Karveer, Kolhapur, Maharashtra, India, 416013 | Contact: 0231-2664275, 9421464275</p>
//             <p>Head & Corporate Office: (KOLHAPUR OFFICE No. 5 & 6, 3rd Floor, Star Tower, 1113/1, Panch bunglow, Shahupuri, Kolhapur, Maharashtra, India, 416001 | Contact: +91-9421464275</p>
//             <p>Regional Office: (MUMBAI) House No 158, Ananje Master Building, No-7, Kakasaheb Gadgil Marg, Prabhadevi, Mumbai 400025, Contact: +91-9421584275. (SOLAPURI) 40, Sarvade Nagar, Mulegaon Road, Solapur, India, 413005 | Contact: +91-9405734275. (DHARWAD) Mahadev Nilay, Training College Road, Behind, K.C. Park, Dharwad, Karnataka, India, 580008 | Contact: +91-865444275.</p>
//             <p>Other Branch: Goa, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewQuotation;








import React, { useState, useEffect } from 'react';

const ViewQuotation = () => {
  const [quotationData, setQuotationData] = useState({
    date: '',
    hospitalName: '',
    membershipDetails: [],
    charges: '',
    note: ''
  });

  // Dummy data for initial render
  useEffect(() => {
    setQuotationData({
      date: '26/08/2025',
      hospitalName: 'M/s Chandan Neuro Sciences Hospital',
      membershipDetails: [
        { particular: 'HOSPITAL MEMBERSHIP (ALL COVERAGE OF VISITING DOCTORS & QUALIFIED/UNQUALIFIED NURSING STAFF)', specialization: 'HOSPITAL', area: '' }
      ],
      charges: 'Rs 6000/-',
      note: 'ABOVE QUOTATION IS FOR 150 BEDS.'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4 m-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-gray-700 h-3"></div>
        
        <div className="p-4 sm:p-6">
          {/* Logo and Company Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 border-b-2 border-gray-200 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-0">
              <div className="bg-orange-500 text-white p-2 rounded mr-0 sm:mr-4 mb-2 sm:mb-0">
                <div className="flex items-center">
                  <span className="text-2xl font-bold">RAPID</span>
                  <span className="ml-1 text-xs">®</span>
                </div>
                <div className="text-xs">MEDICOLEGAL</div>
                <div className="text-xs text-green-300">360° Medicolegal Protection</div>
                <div className="text-xs">An ISO 9001:2015 certified Company</div>
              </div>
              <div className="text-sm">
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">RAPID MEDICOLEGAL SERVICES INDIA LTD.</h1>
                <p className="text-green-600 font-semibold">360° Medicolegal Protection</p>
                <p className="text-gray-600">An ISO 9001:2015 certified Company</p>
                <p className="text-blue-600 text-xs">info@rapidmedicolegal.in | rapidmedicolegal@gmail.com</p>
              </div>
            </div>
            <div className="text-right bg-gray-100 p-2 rounded">
              <p className="font-semibold">DATE - <span className="text-red-600">{quotationData.date}</span></p>
            </div>
          </div>

          {/* Greeting Section */}
          <div className="mb-6">
            <p className="text-gray-700 mb-2">Respected Doctor,</p>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Greetings from <span className="text-orange-600">RAPID MEDICOLEGAL SERVICES INDIA LTD.</span></h2>
            <div className="text-center bg-red-50 p-4 rounded mb-4">
              <p className="text-red-600 font-bold text-lg">!! You are invited !!</p>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mt-2">TO BE THE PART OF INDIA'S ONLY</h3>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">MEDICOLEGAL SERVICES & RISK MANAGEMENT COMPANY</h3>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">FOR THE DOCTORS</h3>
            </div>
          </div>

          {/* Company Description */}
          <div className="mb-6 text-sm text-gray-700 leading-relaxed">
            <p className="mb-4">
              <span className="font-semibold text-orange-600">RAPID MEDICOLEGAL SERVICES INDIA LTD.</span> is a limited company incorporated under Indian Companies Act, 2013 with its offices throughout India. The company is having understanding with premiere Insurance Companies. The company through its massive network and trained professional specializes in liability and medical insurance policies in particular.
            </p>
            
            <h4 className="font-semibold text-gray-800 mb-3">Here's why?</h4>
            <div className="space-y-2">
              {[
                "India's only risk Management Company in a complete or true sense with its nationwide operation.",
                "A truly international standard service company with India's top most legal and medico legal professionals.",
                "24x7 services right at your doorstep.",
                "Online connectivity with all experts, 100% crisis management infrastructure.",
                "A platform to study national and international trends, problems and safety measurements through its dedicated website and regular journals.",
                "Get covered for all medico legal, criminal and medical councils. This service is not given or managed by any other company or agents.",
                "Get covered for all cases of consumer nature and prior cases. This facility is exclusive available for the entire doctors who are insured through any other company or agent.",
                "Get participated in our medico legal events, seminars or lectures which currently you are being deprived of and which we organize on regular intervals.",
                "More than 600 empanelled lawyers to give a big accessibility and help in event of crisis.",
                "Get access to specialization wise medico legal experts who are doctor cum lawyer to represent your all medico legal cases.",
                "Get recovery of hospital bills from TPA. Get your hospital documents and records."
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span className="text-green-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hospital Details */}
          <div className="mb-6">
            <div className="bg-green-50 p-4 rounded mb-4">
              <h3 className="text-lg font-bold text-green-600 mb-2">M/s CHANDAN NEURO SCIENCES HOSPITAL</h3>
              <p className="text-green-700 text-sm">18B/22, LAXMI PETH, DAMANI NAGHAR, NEAR RELIANCE MARKET, DEGAON ROAD, SOLAPUR, MAHARASHTRA INDIA</p>
              <p className="text-red-600 font-semibold mt-2 text-center">AS BELOW AS</p>
            </div>

            {/* Membership Details Table */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border-2 border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left font-semibold">Particular</th>
                    <th className="border border-gray-300 p-2 text-left font-semibold">Specialization</th>
                    <th className="border border-gray-300 p-2 text-left font-semibold">Area</th>
                  </tr>
                </thead>
                <tbody>
                  {quotationData.membershipDetails.map((item, index) => (
                    <tr key={index} className="bg-red-50">
                      <td className="border border-gray-300 p-2 text-red-600 font-semibold">{item.particular}</td>
                      <td className="border border-gray-300 p-2 text-red-600 font-semibold">{item.specialization}</td>
                      <td className="border border-gray-300 p-2 text-red-600">{item.area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Membership Plan Table */}
            <h3 className="text-base font-semibold mb-3 text-gray-800">Your new Yearly Membership Plan as below:</h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full sm:w-1/2 border-collapse border-2 border-gray-300 text-sm">
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold">Year</td>
                    <td className="border border-gray-300 p-3 text-red-600 font-bold">5 Year</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold">Charges</td>
                    <td className="border border-gray-300 p-3 text-red-600 font-bold text-lg">{quotationData.charges}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
              <p className="text-gray-700 font-semibold">Note:- <span className="text-red-600">{quotationData.note}</span></p>
            </div>
          </div>

          {/* Contact and Notes Section */}
          <div className="mb-6">
            <p className="text-gray-700 mb-2">Regards,</p>
            <p className="text-green-600 font-bold mb-2">RAPID MEDICOLEGAL SERVICES INDIA LTD.</p>
            <p className="text-gray-700 font-semibold mb-2">24 x 7 ALL INDIA HELP LINE NO.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['+91-9422584275', '+91-9421584275', '+91-9405734275', '+91-865444275'].map((phone, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                  {phone}
                </span>
              ))}
            </div>

            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-bold text-red-600 mb-3 text-lg">NOTES</h4>
              <div className="space-y-3 text-sm">
                {[
                  "RAPID MEDICOLEGAL SERVICES INDIA LTD will handle all Medicolegal matters, Medicolegal cases & all legal notice of M/s CHANDAN NEURO SCIENCES HOSPITAL",
                  "We also take responsibility of legal compensation if hospital have error & omission policy/ doctor professional indemnity. In above quoted charges RAPID MEDICOLEGAL SERVICES INDIA LTD will take care of all Consumer, criminal and civil court cases responsibility of CHANDAN NEURO SCIENCES HOSPITAL",
                  "RAPID MEDICOLEGAL SERVICES INDIA LTD will also guide you about pre-litigation & post-litigation Matters of medicolegal cases. RAPID MEDICOLEGAL SERVICES INDIA LTD will take all responsibility related to medical compensation, medicolegal issues, risk management & medicolegal opinion of M/s CHANDAN NEURO SCIENCES HOSPITAL",
                  "Owner, pay roll doctors, qualified nursing staff on call all doctors.",
                  "Looking forward for your approval the given quotation so we can start our services and you will be safe for all legal matters in hands RAPID MEDICOLEGAL SERVICES INDIA LTD. India's top most brand in medicolegal services, so you can fully concentrate on your profession.",
                  "Concentrate on your profession & handover your risk to RAPID."
                ].map((note, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-red-600 font-bold mr-2 mt-0.5">{index + 1})</span>
                    <span className="text-red-700 leading-relaxed">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Office Addresses */}
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded text-xs leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h5 className="font-bold text-orange-600 mb-2">Register Office:</h5>
                <p className="text-gray-700">S.R. No. 75/24, Plot No. 6, Bharati Nagar, R.K Nagar, Morewadi, Tal-Karveer, Kolhapur, Maharashtra, India, 416013</p>
                <p className="text-green-600 font-semibold">Contact: 0231-2664275, 9421464275</p>
              </div>
              
              <div>
                <h5 className="font-bold text-orange-600 mb-2">Head & Corporate Office:</h5>
                <p className="text-gray-700">(KOLHAPUR OFFICE) No. 5 & 6, 3rd Floor, Star Tower, 1113/1, Panch bunglow, Shahupuri, Kolhapur, Maharashtra, India, 416001</p>
                <p className="text-green-600 font-semibold">Contact: +91-9421464275</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h5 className="font-bold text-orange-600 mb-2">Regional Offices:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="font-semibold text-gray-800">MUMBAI:</p>
                  <p className="text-gray-700">House No 158, Ananje Master Building, No-7, Kakasaheb Gadgil Marg, Prabhadevi, Mumbai 400025</p>
                  <p className="text-green-600 font-semibold">+91-9421584275</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">SOLAPUR:</p>
                  <p className="text-gray-700">40, Sarvade Nagar, Mulegaon Road, Solapur, India, 413005</p>
                  <p className="text-green-600 font-semibold">+91-9405734275</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">DHARWAD:</p>
                  <p className="text-gray-700">Mahadev Nilay, Training College Road, Behind, K.C. Park, Dharwad, Karnataka, India, 580008</p>
                  <p className="text-green-600 font-semibold">+91-865444275</p>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="font-semibold text-orange-600">Other Branches:</p>
                <p className="text-gray-700">Goa, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Gradient */}
        <div className="bg-gradient-to-r from-gray-700 via-yellow-500 to-orange-500 h-3"></div>
      </div>
    </div>
  );
};

export default ViewQuotation;