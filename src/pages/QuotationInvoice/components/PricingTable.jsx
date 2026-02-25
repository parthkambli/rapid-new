// const PricingTable = ({ data }) => {
//   const { membership_type = "HOSPITAL MEMBERSHIP" , note = "Note: All the above mentioned prices are exclusive of taxes. hjasghjavdajsvajhvdajvjdsajvajvsdsjavuiiewguifdgfiwguhwgfuhvsajhvsjhvajhasvjhdsavjhsdvdjsHfdsjhfvdsajhdgvajhdsgajhgskjglaskgasdhfjhsgdjhdfsgjhfsgfjhdsgfjdhsgfjhfdskgjhfdsagvjhfdsvfjdvfdsjvfdsvjjavjsadcvajsavjdvjhavjdsavjavjdsavjdsahcsakjshjksfdhgjkfsjhgdgfdjhgjhfdgfjhdsgjhgjhfdgjhfdsgjhsfdgjhszdgfdsjhfsdvjhsfvjhfdsgvjhdgvfdjhsgfdsjhg"} = data || {};

//   // Force hospital pricing as per image
//   const pricing = { monthly: "1000/-", yearly: "10,000/-", fiveYear: "50,000" };
//   const beds = "15 BEDS";
//   const indemnity = "10 LAKH";

//   return (
//     <div className="mb-8 overflow-x-auto">
//       <table className="w-full border-collapse border-2 border-black text-sm">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-black p-2 text-left">Membership Type</th>
//             <th className="border border-black p-2 text-left">Specialization</th>
//             <th className="border border-black p-2 text-left">No of beds</th>
//             <th className="border border-black p-2 text-left">Indemnity Cover</th>
//             <th className="border border-black p-2 text-center">Monthly</th>
//             <th className="border border-black p-2 text-center">1 Year</th>
//             <th className="border border-black p-2 text-center">5 Year</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr className="mb-2">
//             <td className="border border-black p-2">
//               <span className="text-red-600 font-bold">{membership_type}</span><br />
//               <span className="text-xs">(COVERAGE OF ALL DOCTOR STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)</span>
//             </td>
//             <td className="border border-black p-2">MULTISPECIALITY HOSPITAL</td>
//             <td className="border border-black p-2 text-center">{beds}</td>
//             <td className="border border-black p-2 text-center text-red-600 font-bold">{indemnity}</td>
//             <td className="border border-black p-2 text-center">{pricing.monthly}</td>
//             <td className="border border-black p-2 text-center">{pricing.yearly}</td>
//             <td className="border border-black p-2 text-center">{pricing.fiveYear}</td>
//           </tr>

//         </tbody>
//       </table>
// <div className="w-full mt-4 border-2 border-black text-sm">
//   <div className="grid grid-cols-[180px_1fr] min-w-0">

//     {/* Left Cell */}
//     <div className="border-r-2 border-black p-2 flex items-center justify-center">
//       <span className="text-red-600 font-bold">NOTE</span>
//     </div>

//     {/* Right Cell */}
//     <div
//       className="
//         p-2
//         min-h-[40px]
//         min-w-0
//         whitespace-normal
//         break-words
//         overflow-hidden
//       "
//     >
//       {note ? (
//         <span>{note}</span>
//       ) : (
//         <span className="text-gray-500 italic">
//           {{ note_from_api }}
//         </span>
//       )}
//     </div>

//   </div>
// </div>

//     </div>
//   );
// };

// export default PricingTable;

// upar wala sahi h ui aur ye niche api lagane ka try kr rh hu okk agar api mein mistakes hui to upar ka ui lena h okk

// // components/DynamicPricingTable.jsx
// import React from 'react';
// import { getYearColumns, getPriceForYear } from '../utils/quotationDataMapper';

// const DynamicPricingTable = ({ data }) => {
//   const {
//     membership_type = "HOSPITAL MEMBERSHIP",
//     specialization = "Multispeciality Hospital",
//     number_of_beds = "N/A",
//     note = "",
//     pricing_items = [],
//     policy_years = [1, 5]
//   } = data || {};

//   const yearColumns = getYearColumns(policy_years);
//   const isIndividual = membership_type.includes('INDIVIDUAL') && !membership_type.includes('COMBINED');
//   const showBedsColumn = !isIndividual && number_of_beds !== "N/A";

//   // Format price with commas
//   const formatPrice = (price) => {
//     if (!price) return "";
//     const num = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, '')) : price;
//     if (isNaN(num)) return price;
//     return num.toLocaleString('en-IN') + "/-";
//   };

//   return (
//     <div className="mb-8 overflow-x-auto md:mx-4 page-break-inside-avoid">
//       <table className="w-full border-collapse border-2 border-black text-sm page-break-inside-avoid">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-black p-2 text-left min-w-[180px]">Membership Type</th>
//             <th className="border border-black p-2 text-left min-w-[120px]">Specialization</th>
//             {showBedsColumn && (
//               <th className="border border-black p-2 text-left min-w-[80px]">No. of beds</th>
//             )}
//             <th className="border border-black p-2 text-left min-w-[100px]">Indemnity Cover</th>
//             <th className="border border-black p-2 text-center min-w-[80px]">Monthly</th>

//             {/* Dynamic Year Columns */}
//             {yearColumns.map((yearCol, index) => (
//               <th key={index} className="border border-black p-2 text-center min-w-[80px]">
//                 {yearCol}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {pricing_items.length > 0 ? (
//             pricing_items.map((item, rowIndex) => (
//               <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                 {rowIndex === 0 && (
//                   <>
//                     <td rowSpan={pricing_items.length} className="border border-black p-2 align-top">
//                       <span className="text-red-600 font-bold">{membership_type}</span>
//                       <br />
//                       <span className="text-xs">
//                         {membership_type.includes('HOSPITAL')
//                           ? "(COVERAGE OF ALL DOCTOR STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)"
//                           : "(COVERAGE FOR INDIVIDUAL PRACTICE ONLY)"}
//                       </span>
//                     </td>
//                     <td rowSpan={pricing_items.length} className="border border-black p-2">
//                       {specialization}
//                     </td>
//                     {showBedsColumn && (
//                       <td rowSpan={pricing_items.length} className="border border-black p-2 text-center">
//                         {number_of_beds} BEDS
//                       </td>
//                     )}
//                   </>
//                 )}

//                 <td className="border border-black p-2 text-center">
//                   <span className="text-red-600 font-bold">
//                     {item.indemnity || "Custom"}
//                   </span>
//                 </td>

//                 <td className="border border-black p-2 text-center">
//                   {formatPrice(item.monthly)}
//                 </td>

//                 {/* Dynamic Year Prices */}
//                 {policy_years.map((year, colIndex) => (
//                   <td key={colIndex} className="border border-black p-2 text-center">
//                     {formatPrice(getPriceForYear(item, year))}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           ) : (
//             // Fallback row if no pricing items
//             <tr>
//               <td className="border border-black p-2">
//                 <span className="text-red-600 font-bold">{membership_type}</span>
//                 <br />
//                 <span className="text-xs">
//                   {membership_type.includes('HOSPITAL')
//                     ? "(COVERAGE OF ALL DOCTOR STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)"
//                     : "(COVERAGE FOR INDIVIDUAL PRACTICE ONLY)"}
//                 </span>
//               </td>
//               <td className="border border-black p-2">{specialization}</td>
//               {showBedsColumn && (
//                 <td className="border border-black p-2 text-center">
//                   {number_of_beds} BEDS
//                 </td>
//               )}
//               <td className="border border-black p-2 text-center text-red-600 font-bold">
//                 10 LAKH
//               </td>
//               <td className="border border-black p-2 text-center">1,000/-</td>
//               {policy_years.map((year, index) => (
//                 <td key={index} className="border border-black p-2 text-center">
//                   {year === 1 ? "10,000/-" : year === 5 ? "50,000/-" : "Custom"}
//                 </td>
//               ))}
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Note Section */}
//       <div className="mt-4 border-2 border-black text-sm md:mx-4">
//         <div className="grid grid-cols-[180px_1fr] min-w-0">
//           <div className="border-r-2 border-black p-2 flex items-center justify-center">
//             <span className="text-red-600 font-bold">NOTE</span>
//           </div>
//           <div className="p-2 min-h-[40px] min-w-0 whitespace-normal break-words overflow-hidden">
//             {note ? (
//               <span>{note}</span>
//             ) : (
//               <span className="text-gray-500 italic">
//                 All prices are exclusive of taxes. Terms and conditions apply.
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DynamicPricingTable;

// // components/DynamicPricingTable.jsx
// import React from 'react';
// import { getYearColumns, getPriceForYear } from '../utils/quotationDataMapper';

// const DynamicPricingTable = ({ data }) => {
//   const {
//     membership_type = "HOSPITAL MEMBERSHIP",
//     specialization = "Multispeciality Hospital",
//     number_of_beds = "N/A",
//     note = "",
//     pricing_items = [],
//     policy_years = [1, 5]
//   } = data || {};

//   const yearColumns = getYearColumns(policy_years);
//   const isIndividual = membership_type.includes('INDIVIDUAL') && !membership_type.includes('COMBINED');
//   const showBedsColumn = !isIndividual && number_of_beds !== "N/A";

//   // Format price with commas
//   const formatPrice = (price) => {
//     if (!price) return "";
//     const num = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, '')) : price;
//     if (isNaN(num)) return price;
//     return num.toLocaleString('en-IN') + "/-";
//   };

//   // DynamicPricingTable.jsx - Add this wrapper
// return (
//   <div className="mb-8 page-break-inside-avoid">
//     <div className="overflow-x-auto">
//     {/* <table className="w-full border-collapse border-2 border-black text-sm page-break-inside-avoid"> */}
//     <table className="w-full border-2 border-black text-xs print:text-[9pt] table-fixed">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-black p-2 text-left ">Membership Type</th>
//             <th className="border border-black p-2 text-left ">Specialization</th>
//             {showBedsColumn && (
//               <th className="border border-black p-2 text-left ">No. of beds</th>
//             )}
//             <th className="border border-black p-2 text-left ">Indemnity Cover</th>
//             <th className="border border-black p-2 text-center  ">Monthly</th>

//             {/* Dynamic Year Columns */}
//             {yearColumns.map((yearCol, index) => (
//               <th key={index} className="border border-black p-2 text-center min-w-[80px]">
//                 {yearCol}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {pricing_items.length > 0 ? (
//             pricing_items.map((item, rowIndex) => (
//               <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                 {rowIndex === 0 && (
//                   <>
//                     <td rowSpan={pricing_items.length} className="border border-black p-2 align-top">
//                       <span className="text-red-600 font-bold">{membership_type}</span>
//                       <br />
//                       <span className="text-xs">
//                         {membership_type.includes('HOSPITAL')
//                           ? "(COVERAGE OF ALL DOCTOR STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)"
//                           : "(COVERAGE FOR INDIVIDUAL PRACTICE ONLY)"}
//                       </span>
//                     </td>
//                     <td rowSpan={pricing_items.length} className="border border-black p-2">
//                       {specialization}
//                     </td>
//                     {showBedsColumn && (
//                       <td rowSpan={pricing_items.length} className="border border-black p-2 text-center">
//                         {number_of_beds} BEDS
//                       </td>
//                     )}
//                   </>
//                 )}

//                 <td className="border border-black p-2 text-center">
//                   <span className="text-red-600 font-bold">
//                     {item.indemnity || "Custom"}
//                   </span>
//                 </td>

//                 <td className="border border-black p-2 text-center">
//                   {formatPrice(item.monthly)}
//                 </td>

//                 {/* Dynamic Year Prices */}
//                 {policy_years.map((year, colIndex) => (
//                   <td key={colIndex} className="border border-black p-2 text-center">
//                     {formatPrice(getPriceForYear(item, year))}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           ) : (
//             // Fallback row if no pricing items
//             <tr>
//               <td className="border border-black p-2">
//                 <span className="text-red-600 font-bold">{membership_type}</span>
//                 <br />
//                 <span className="text-xs">
//                   {membership_type.includes('HOSPITAL')
//                     ? "(COVERAGE OF ALL DOCTOR STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)"
//                     : "(COVERAGE FOR INDIVIDUAL PRACTICE ONLY)"}
//                 </span>
//               </td>
//               <td className="border border-black p-2">{specialization}</td>
//               {showBedsColumn && (
//                 <td className="border border-black p-2 text-center">
//                   {number_of_beds} BEDS
//                 </td>
//               )}
//               <td className="border border-black p-2 text-center text-red-600 font-bold">
//                 10 LAKH
//               </td>
//               <td className="border border-black p-2 text-center">1,000/-</td>
//               {policy_years.map((year, index) => (
//                 <td key={index} className="border border-black p-2 text-center">
//                   {year === 1 ? "10,000/-" : year === 5 ? "50,000/-" : "Custom"}
//                 </td>
//               ))}
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>

//     {/* Note Box */}
//     <div className="mt-4 border-2 border-black">
//       <div className="grid grid-cols-[150px_1fr]">
//         <div className="border-r-2 border-black p-2 bg-gray-100 text-center">
//           <span className="text-red-600 font-bold">NOTE</span>
//         </div>
//         <div className="p-2 text-xs">
//           {note || "All prices are exclusive of taxes. Terms and conditions apply."}
//         </div>
//       </div>
//     </div>
//   </div>
// );
// };

// export default DynamicPricingTable;

// import React from 'react';
// import { getYearColumns, getPriceForYear } from '../utils/quotationDataMapper';

// const DynamicPricingTable = ({ data }) => {
//   const {
//     membership_type = "HOSPITAL MEMBERSHIP",
//     specialization = "Multispeciality Hospital",
//     number_of_beds = "N/A",
//     note = "",
//     pricing_items = [],
//     policy_years = [1, 5]
//   } = data || {};

//   const yearColumns = getYearColumns(policy_years);
//   const isIndividual = membership_type.includes('INDIVIDUAL') && !membership_type.includes('COMBINED');
//   const showBedsColumn = !isIndividual && number_of_beds !== "N/A";

//   // Format price with commas
//   const formatPrice = (price) => {
//     if (!price) return "";
//     const num = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, '')) : price;
//     if (isNaN(num)) return price;
//     return "₹" + num.toLocaleString('en-IN') + "/-";
//   };

//   return (
//     <div className="mb-6 page-break-inside-avoid">
//       {/* Mobile Scroll Wrapper */}
//       <div className="overflow-x-auto print:overflow-visible -mx-2 px-2 print:mx-0 print:px-0">
//         <div className="min-w-[800px] print:min-w-full">
//           <table className="w-full allow-break border-collapse border-2 border-black text-xs print:text-[8pt]">
//             <thead>
//               <tr className="bg-gray-100 print:bg-gray-100">
//                 <th
//                   className="border border-black p-3 print:p-2 text-left align-top"
//                   style={{ width: '18%' }}
//                 >
//                   Membership Type
//                 </th>
//                 <th
//                   className="border border-black p-3 print:p-2 text-left align-top"
//                   style={{ width: '15%' }}
//                 >
//                   Specialization
//                 </th>
//                 {showBedsColumn && (
//                   <th
//                     className="border border-black p-3 print:p-2 text-left align-top"
//                     style={{ width: '10%' }}
//                   >
//                     No. of beds
//                   </th>
//                 )}
//                 <th
//                   className="border border-black p-3 print:p-2 text-left align-top"
//                   style={{ width: '15%' }}
//                 >
//                   Indemnity Cover
//                 </th>
//                 <th
//                   className="border border-black p-3 print:p-2 text-center align-top"
//                   style={{ width: '10%' }}
//                 >
//                   Monthly
//                 </th>

//                 {/* Dynamic Year Columns */}
//                 {yearColumns.map((yearCol, index) => (
//                   <th
//                     key={index}
//                     className="border border-black p-3 print:p-2 text-center align-top"
//                     style={{ width: '10%' }}
//                   >
//                     {yearCol}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {pricing_items.length > 0 ? (
//                 pricing_items.map((item, rowIndex) => (
//                   <tr
//                     key={rowIndex}
//                     className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50 print:bg-gray-50'}
//                   >
//                     {rowIndex === 0 && (
//                       <>
//                         <td
//                           rowSpan={pricing_items.length}
//                           className="border border-black p-3 print:p-2 align-top"
//                         >
//                           <span className="text-red-600 font-bold block mb-1">
//                             {membership_type}
//                           </span>
//                           <span className="text-[9pt] print:text-[7pt] text-gray-600 block">
//                             {membership_type.includes('HOSPITAL')
//                               ? "(COVERAGE OF ALL DOCTOR STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)"
//                               : "(COVERAGE FOR INDIVIDUAL PRACTICE ONLY)"}
//                           </span>
//                         </td>
//                         <td
//                           rowSpan={pricing_items.length}
//                           className="border border-black p-3 print:p-2 align-top"
//                         >
//                           {specialization}
//                         </td>
//                         {showBedsColumn && (
//                           <td
//                             rowSpan={pricing_items.length}
//                             className="border border-black p-3 print:p-2 text-center align-top"
//                           >
//                             <span className="font-bold">{number_of_beds}</span> BEDS
//                           </td>
//                         )}
//                       </>
//                     )}

//                     <td className="border border-black p-3 print:p-2 text-center align-top">
//                       <span className="text-red-600 font-bold">
//                         {item.indemnity || "Custom"}
//                       </span>
//                     </td>

//                     <td className="border border-black p-3 print:p-2 text-center align-top">
//                       {formatPrice(item.monthly)}
//                     </td>

//                     {/* Dynamic Year Prices */}
//                     {policy_years.map((year, colIndex) => (
//                       <td
//                         key={colIndex}
//                         className="border border-black p-3 print:p-2 text-center align-top"
//                       >
//                         {formatPrice(getPriceForYear(item, year))}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : (
//                 // Fallback row if no pricing items
//                 <tr>
//                   <td className="border border-black p-3 print:p-2 align-top">
//                     <span className="text-red-600 font-bold">{membership_type}</span>
//                     <br />
//                     <span className="text-[9pt] print:text-[7pt]">
//                       {membership_type.includes('HOSPITAL')
//                         ? "(COVERAGE OF ALL DOCTOR STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)"
//                         : "(COVERAGE FOR INDIVIDUAL PRACTICE ONLY)"}
//                     </span>
//                   </td>
//                   <td className="border border-black p-3 print:p-2">{specialization}</td>
//                   {showBedsColumn && (
//                     <td className="border border-black p-3 print:p-2 text-center">
//                       <span className="font-bold">{number_of_beds}</span> BEDS
//                     </td>
//                   )}
//                   <td className="border border-black p-3 print:p-2 text-center text-red-600 font-bold">
//                     10 LAKH
//                   </td>
//                   <td className="border border-black p-3 print:p-2 text-center">₹1,000/-</td>
//                   {policy_years.map((year, index) => (
//                     <td key={index} className="border border-black p-3 print:p-2 text-center">
//                       {year === 1 ? "₹10,000/-" : year === 5 ? "₹50,000/-" : "Custom"}
//                     </td>
//                   ))}
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Note Box - Print Safe */}
//       <div className="mt-4 border-2 border-black page-break-inside-avoid">
//         <div className="grid grid-cols-[150px_1fr] print:grid-cols-[40mm_1fr]">
//           <div className="border-r-2 border-black p-3 print:p-2 bg-gray-100 text-center flex items-center justify-center">
//             <span className="text-red-600 font-bold text-sm print:text-[9pt]">NOTE</span>
//           </div>
//           <div className="p-3 print:p-2 text-xs print:text-[8pt]">
//             {note || "All prices are exclusive of taxes. Terms and conditions apply."}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DynamicPricingTable;

// import React from 'react';
// import { getYearColumns, getPriceForYear } from '../utils/quotationDataMapper';

// const DynamicPricingTable = ({ data }) => {
//   const {
//     membership_type = "HOSPITAL MEMBERSHIP",
//     specialization = "Multispeciality Hospital",
//     number_of_beds = "N/A",
//     note = "",
//     pricing_items = [],
//     policy_years = [1, 2, 3] // Default to 1,2,3 years
//   } = data || {};

//   const yearColumns = getYearColumns(policy_years);

//   // FIXED LOGIC: Membership type detection
//   const isIndividual = membership_type.includes('INDIVIDUAL') && !membership_type.includes('COMBINED');
//   const isCombined = membership_type.includes('COMBINED');
//   const isHospital = membership_type.includes('HOSPITAL') && !isCombined;

//   // FIXED: Show beds column logic
//   const showBedsColumn = (isHospital || isCombined) && number_of_beds !== "N/A";

//   // Format price with commas
//   const formatPrice = (price) => {
//     if (!price) return "";
//     const num = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, '')) : price;
//     if (isNaN(num)) return price;
//     return "₹" + num.toLocaleString('en-IN') + "/-";
//   };

//   // FIXED: Get description based on membership type
//   // const getMembershipDescription = () => {
//   //   if (isIndividual) {
//   //     return "(COVERAGE FOR INDIVIDUAL PRACTICE ONLY)";
//   //   } else if (isCombined) {
//   //     return "(COVERAGE OF DOCTOR + HOSPITAL STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)";
//   //   } else {
//   //     return "(COVERAGE OF ALL DOCTOR STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)";
//   //   }
//   // };

//   // FIXED: Get description based on membership type
// const getMembershipDescription = () => {
//   if (isIndividual) {
//     return "(COVERAGE FOR INDIVIDUAL PRACTICE ONLY)";
//   } else if (isCombined) {
//     return "(COVERAGE OF DOCTOR + HOSPITAL STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)";
//   } else if (isHospital) {
//     return "(COVERAGE OF ALL DOCTOR STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)";
//   }
//   return "";
// };

//   return (
//     <div className="mb-6 page-break-inside-avoid">
//       {/* Mobile Scroll Wrapper */}
//       <div className="overflow-x-auto print:overflow-visible -mx-2 px-2 print:mx-0 print:px-0">
//         <div className="min-w-[800px] print:min-w-full">
//           <table className="w-full allow-break border-collapse border-2 border-black text-xs print:text-[8pt]">
//             <thead>
//               <tr className="bg-gray-100 print:bg-gray-100">
//                 <th
//                   className="border border-black p-3 print:p-2 text-left align-top"
//                   style={{ width: '18%' }}
//                 >
//                   Membership Type
//                 </th>
//                 <th
//                   className="border border-black p-3 print:p-2 text-left align-top"
//                   style={{ width: '15%' }}
//                 >
//                   Specialization
//                 </th>
//                 {showBedsColumn && (
//                   <th
//                     className="border border-black p-3 print:p-2 text-left align-top"
//                     style={{ width: '10%' }}
//                   >
//                     No. of beds
//                   </th>
//                 )}
//                 <th
//                   className="border border-black p-3 print:p-2 text-left align-top"
//                   style={{ width: '15%' }}
//                 >
//                   Indemnity Cover
//                 </th>
//                 <th
//                   className="border border-black p-3 print:p-2 text-center align-top"
//                   style={{ width: '10%' }}
//                 >
//                   Monthly
//                 </th>

//                 {/* Dynamic Year Columns */}
//                 {yearColumns.map((yearCol, index) => (
//                   <th
//                     key={index}
//                     className="border border-black p-3 print:p-2 text-center align-top"
//                     style={{ width: '10%' }}
//                   >
//                     {yearCol}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {pricing_items.length > 0 ? (
//                 pricing_items.map((item, rowIndex) => (
//                   <tr
//                     key={rowIndex}
//                     className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50 print:bg-gray-50'}
//                   >
//                     {rowIndex === 0 && (
//                       <>
//                         <td
//                           rowSpan={pricing_items.length}
//                           className="border border-black p-3 print:p-2 align-top"
//                         >
//                           <span className="text-red-600 font-bold block mb-1">
//                             {membership_type}
//                           </span>
//                           <span className="text-[9pt] print:text-[7pt] text-gray-600 block">
//                             {getMembershipDescription()}
//                           </span>
//                         </td>
//                         <td
//                           rowSpan={pricing_items.length}
//                           className="border border-black p-3 print:p-2 align-top"
//                         >
//                           {specialization}
//                         </td>
//                         {showBedsColumn && (
//                           <td
//                             rowSpan={pricing_items.length}
//                             className="border border-black p-3 print:p-2 text-center align-top"
//                           >
//                             <span className="font-bold">{number_of_beds}</span> BEDS
//                           </td>
//                         )}
//                       </>
//                     )}

//                     <td className="border border-black p-3 print:p-2 text-center align-top">
//                       <span className="text-red-600 font-bold">
//                         {item.indemnity || "25,00,000"}
//                       </span>
//                     </td>

//                     <td className="border border-black p-3 print:p-2 text-center align-top">
//                       {formatPrice(item.monthly)}
//                     </td>

//                     {/* Dynamic Year Prices */}
//                     {policy_years.map((year, colIndex) => (
//                       <td
//                         key={colIndex}
//                         className="border border-black p-3 print:p-2 text-center align-top"
//                       >
//                         {formatPrice(getPriceForYear(item, year))}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : (
//                 // Fallback row if no pricing items
//                 <tr>
//                   <td className="border border-black p-3 print:p-2 align-top">
//                     <span className="text-red-600 font-bold">{membership_type}</span>
//                     <br />
//                     <span className="text-[9pt] print:text-[7pt]">
//                       {getMembershipDescription()}
//                     </span>
//                   </td>
//                   <td className="border border-black p-3 print:p-2">{specialization}</td>
//                   {showBedsColumn && (
//                     <td className="border border-black p-3 print:p-2 text-center">
//                       <span className="font-bold">{number_of_beds}</span> BEDS
//                     </td>
//                   )}
//                   <td className="border border-black p-3 print:p-2 text-center text-red-600 font-bold">
//                     ₹25,00,000
//                   </td>
//                   <td className="border border-black p-3 print:p-2 text-center">
//                     {isIndividual ? "₹1,200/-" : "₹1,000/-"}
//                   </td>
//                   {policy_years.map((year, index) => {
//                     let price = "";
//                     if (year === 1) price = isIndividual ? "₹10,800/-" : "₹10,000/-";
//                     else if (year === 2) price = "₹20,000/-";
//                     else if (year === 3) price = "₹30,000/-";
//                     else if (year === 5) price = "₹50,000/-";

//                     return (
//                       <td key={index} className="border border-black p-3 print:p-2 text-center">
//                         {price}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Note Box - Print Safe */}
//       <div className="mt-4 border-2 border-black page-break-inside-avoid">
//         <div className="grid grid-cols-[150px_1fr] print:grid-cols-[40mm_1fr]">
//           <div className="border-r-2 border-black p-3 print:p-2 bg-gray-100 text-center flex items-center justify-center">
//             <span className="text-red-600 font-bold text-sm print:text-[9pt]">NOTE</span>
//           </div>
//           <div className="p-3 print:p-2 text-xs print:text-[8pt]">
//             {note || "All prices are exclusive of taxes. Terms and conditions apply."}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DynamicPricingTable;

// // DynamicPricingTable.jsx - COMPACT FOR PRINT
// import React from 'react';
// import { getYearColumns, getPriceForYear } from '../utils/quotationDataMapper';

// const DynamicPricingTable = ({ data }) => {
//   const {
//     membership_type = "HOSPITAL MEMBERSHIP",
//     specialization = "Multispeciality Hospital",
//     number_of_beds = "N/A",
//     note = "",
//     pricing_items = [],
//     policy_years = [1, 2, 3]
//   } = data || {};

//   const yearColumns = getYearColumns(policy_years);

//   // Membership type detection
//   const isIndividual = membership_type.includes('INDIVIDUAL') && !membership_type.includes('COMBINED');
//   const isCombined = membership_type.includes('COMBINED');
//   const isHospital = membership_type.includes('HOSPITAL') && !isCombined;

//   // Show beds column
//   const showBedsColumn = (isHospital || isCombined) && number_of_beds !== "N/A";

//   // Format price
//   const formatPrice = (price) => {
//     if (!price) return "";
//     const num = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, '')) : price;
//     if (isNaN(num)) return price;
//     return "₹" + num.toLocaleString('en-IN') + "/-";
//   };

//   // Get description
//   const getMembershipDescription = () => {
//     if (isIndividual) {
//       return "(COVERAGE FOR INDIVIDUAL PRACTICE ONLY)";
//     } else if (isCombined) {
//       return "(COVERAGE OF DOCTOR + HOSPITAL STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)";
//     } else if (isHospital) {
//       return "(COVERAGE OF ALL DOCTOR STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)";
//     }
//     return "";
//   };

//   return (
//     <div className="mb-4">
//       <div className="overflow-x-auto">
//         <div className="min-w-full">
//           <table className="w-full border-collapse border border-black text-xs">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-black p-2 text-left">Membership Type</th>
//                 <th className="border border-black p-2 text-left">Specialization</th>
//                 {showBedsColumn && (
//                   <th className="border border-black p-2 text-left">No. of beds</th>
//                 )}
//                 <th className="border border-black p-2 text-left">Indemnity Cover</th>
//                 <th className="border border-black p-2 text-center">Monthly</th>
//                 {yearColumns.map((yearCol, index) => (
//                   <th key={index} className="border border-black p-2 text-center">
//                     {yearCol}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {pricing_items.length > 0 ? (
//                 pricing_items.map((item, rowIndex) => (
//                   <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                     {rowIndex === 0 && (
//                       <>
//                         <td rowSpan={pricing_items.length} className="border border-black p-2 align-top">
//                           <span className="text-red-600 font-bold block mb-1">
//                             {membership_type}
//                           </span>
//                           <span className="text-[8pt] text-gray-600 block">
//                             {getMembershipDescription()}
//                           </span>
//                         </td>
//                         <td rowSpan={pricing_items.length} className="border border-black p-2 align-top">
//                           {specialization}
//                         </td>
//                         {showBedsColumn && (
//                           <td rowSpan={pricing_items.length} className="border border-black p-2 text-center align-top">
//                             <span className="font-bold">{number_of_beds}</span> BEDS
//                           </td>
//                         )}
//                       </>
//                     )}

//                     <td className="border border-black p-2 text-center">
//                       <span className="text-red-600 font-bold">
//                         {item.indemnity || "25,00,000"}
//                       </span>
//                     </td>

//                     <td className="border border-black p-2 text-center">
//                       {formatPrice(item.monthly)}
//                     </td>

//                     {policy_years.map((year, colIndex) => (
//                       <td key={colIndex} className="border border-black p-2 text-center">
//                         {formatPrice(getPriceForYear(item, year))}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="border border-black p-2 align-top">
//                     <span className="text-red-600 font-bold">{membership_type}</span>
//                     <br />
//                     <span className="text-[8pt]">
//                       {getMembershipDescription()}
//                     </span>
//                   </td>
//                   <td className="border border-black p-2">{specialization}</td>
//                   {showBedsColumn && (
//                     <td className="border border-black p-2 text-center">
//                       <span className="font-bold">{number_of_beds}</span> BEDS
//                     </td>
//                   )}
//                   <td className="border border-black p-2 text-center text-red-600 font-bold">
//                     ₹25,00,000
//                   </td>
//                   <td className="border border-black p-2 text-center">
//                     {isIndividual ? "₹1,200/-" : "₹1,000/-"}
//                   </td>
//                   {policy_years.map((year, index) => {
//                     let price = "";
//                     if (year === 1) price = isIndividual ? "₹10,800/-" : "₹10,000/-";
//                     else if (year === 2) price = "₹20,000/-";
//                     else if (year === 3) price = "₹30,000/-";

//                     return (
//                       <td key={index} className="border border-black p-2 text-center">
//                         {price}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Note Box */}
//       <div className="mt-3 border border-black">
//         <div className="grid grid-cols-[100px_1fr]">
//           <div className="border-r border-black p-2 bg-gray-100 text-center flex items-center justify-center">
//             <span className="text-red-600 font-bold text-xs">NOTE</span>
//           </div>
//           <div className="p-2 text-xs">
//             {note || "All prices are exclusive of taxes. Terms and conditions apply."}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DynamicPricingTable;

// DynamicPricingTable.jsx - WITH CONDITIONAL MONTHLY COLUMN
import React from "react";
import { getYearColumns, getPriceForYear } from "../utils/quotationDataMapper";

const DynamicPricingTable = ({ data }) => {
  const {
    membership_type = "HOSPITAL MEMBERSHIP",
    specialization = "Multispeciality Hospital",
    number_of_beds = "N/A",
    note = "",
    pricing_items = [],
    policy_years = [1, 2, 3],
  } = data || {};

  const yearColumns = getYearColumns(policy_years);

  // Membership type detection
  const isIndividual =
    membership_type.includes("INDIVIDUAL") &&
    !membership_type.includes("COMBINED");
  const isCombined = membership_type.includes("COMBINED");
  const isHospital = membership_type.includes("HOSPITAL") && !isCombined;

  // Show beds column
  const showBedsColumn = (isHospital || isCombined) && number_of_beds !== "N/A";

  // Check if ANY pricing item has monthly value - CRITICAL FIX
  const hasMonthlyPrice = pricing_items.some(
    (item) =>
      item.monthly !== undefined &&
      item.monthly !== null &&
      item.monthly !== "",
  );

  // Format price
  const formatPrice = (price) => {
    if (!price && price !== 0) return "";
    if (price === 0) return "₹0/-";

    const num =
      typeof price === "string"
        ? parseInt(price.replace(/[^0-9]/g, ""))
        : price;
    if (isNaN(num)) return price;
    return "₹" + num.toLocaleString("en-IN") + "/-";
  };

  // Get description
  const getMembershipDescription = () => {
    if (isIndividual) {
      return "(COVERAGE FOR INDIVIDUAL PRACTICE ONLY)";
    } else if (isCombined) {
      return "(COVERAGE OF DOCTOR + HOSPITAL STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)";
    } else if (isHospital) {
      return "(COVERAGE OF ALL DOCTOR STAFF, QUALIFIED/NON QUALIFIED NURSING STAFF)";
    }
    return "";
  };

  return (
    <div className="mb-4">
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left">
                  Membership Type
                </th>
                <th className="border border-black p-2 text-left">
                  Specialization
                </th>
                {showBedsColumn && (
                  <th className="border border-black p-2 text-left">
                    No. of beds
                  </th>
                )}
                <th className="border border-black p-2 text-left">
                  Indemnity Cover
                </th>

                {/* Conditionally show Monthly column */}
                {hasMonthlyPrice && (
                  <th className="border border-black p-2 text-center">
                    Monthly
                  </th>
                )}

                {/* Dynamic Year Columns */}
                {yearColumns.map((yearCol, index) => (
                  <th
                    key={index}
                    className="border border-black p-2 text-center"
                  >
                    {yearCol}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricing_items.length > 0 ? (
                pricing_items.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {rowIndex === 0 && (
                      <>
                        <td rowSpan={pricing_items.length} className="border border-black p-2 align-top">
                          <span className="text-red-600 font-bold block mb-1">
                            {membership_type}
                          </span>
                          <span className="text-[8pt] text-gray-600 block">
                            {getMembershipDescription()}
                          </span>
                        </td>
                        <td rowSpan={pricing_items.length} className="border border-black p-2 align-top">
                          {specialization}
                        </td>
                        {showBedsColumn && (
                          <td rowSpan={pricing_items.length} className="border border-black p-2 text-center align-top">
                            <span className="font-bold">{number_of_beds}</span> BEDS
                          </td>
                        )}
                      </>
                    )}

                    <td className="border border-black p-2 text-center">
                      <span className="text-red-600 font-bold">
                        {item.indemnity || "₹25,00,000"}
                      </span>
                    </td>

                    {/* Conditionally show Monthly cell */}
                    {hasMonthlyPrice && (
                      <td className="border border-black p-2 text-center">
                        {formatPrice(item.monthly)}
                      </td>
                    )}

                    {/* Dynamic Year Prices */}
                    {policy_years.map((year, colIndex) => (
                      <td
                        key={colIndex}
                        className="border border-black p-2 text-center"
                      >
                        {formatPrice(getPriceForYear(item, year))}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                // Fallback row if no pricing items
                <tr>
                  <td className="border border-black p-2 align-top">
                    <span className="text-red-600 font-bold">
                      {membership_type}
                    </span>
                    <br />
                    <span className="text-[8pt]">
                      {getMembershipDescription()}
                    </span>
                  </td>
                  <td className="border border-black p-2">{specialization}</td>
                  {showBedsColumn && (
                    <td className="border border-black p-2 text-center">
                      <span className="font-bold">{number_of_beds}</span> BEDS
                    </td>
                  )}
                  <td className="border border-black p-2 text-center text-red-600 font-bold">
                    ₹25,00,000
                  </td>

                  {/* Conditionally show Monthly in fallback */}
                  {hasMonthlyPrice && (
                    <td className="border border-black p-2 text-center">
                      {isIndividual ? "₹1,200/-" : "₹1,000/-"}
                    </td>
                  )}

                  {policy_years.map((year, index) => {
                    let price = "";
                    if (year === 1)
                      price = isIndividual ? "₹10,800/-" : "₹10,000/-";
                    else if (year === 2) price = "₹20,000/-";
                    else if (year === 3) price = "₹30,000/-";

                    return (
                      <td
                        key={index}
                        className="border border-black p-2 text-center"
                      >
                        {price}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note Box */}
      <div className="mt-3 border border-black">
        <div className="grid grid-cols-[100px_1fr]">
          <div className="border-r border-black p-2 bg-gray-100 text-center flex items-center justify-center">
            <span className="text-red-600 font-bold text-xs">NOTE</span>
          </div>
          <div className="p-2 text-xs">
            {note ||
              "All prices are exclusive of taxes. Terms and conditions apply."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPricingTable;
