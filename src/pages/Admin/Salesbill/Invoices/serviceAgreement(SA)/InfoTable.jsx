// // import React from 'react';

// // const predefinedRows = {
// //   membership: [
// //     { label: 'Membership ID', key: 'membershipId' },
// //     { label: 'Doctor Name', key: 'fullName' },
// //     { label: 'Hospital Name', key: 'hospitalName' },
// //     { label: 'Qualification', key: 'qualification' },
// //     { label: 'Specialization', key: 'specialization' },
// //     { label: 'MCI Registration No', key: 'registrationNumber' },
// //     { label: 'MCI Registration Year', key: 'registrationYear' },
// //     { label: 'Membership Type', key: 'doctorType' },
// //     { label: 'Membership Plan', key: 'membershipType' },
// //     { label: 'Membership Period', key: 'membershipPeriod', conditional: true },
// //     { label: 'Start Date', key: 'startDate' },
// //     { label: 'End Date', key: 'endDate', conditional: true },
// //     { label: 'Total Service Charge', key: 'totalServiceCharge', suffixKey: 'membershipType' }
// //   ],
// //   policy: [
// //     { label: 'Doctor / Hospital Name', key: 'holderName' },
// //     { label: 'Insurance Co. Name', key: 'insuranceCoName' },
// //     { label: 'Type of Policy', key: 'policyType' },
// //     { label: 'Policy Number', key: 'policyNumber' },
// //     { label: 'Policy Cover', key: 'policyCover' },
// //     { label: 'Policy Duration', key: 'policyDuration' },
// //     { label: 'Policy Premium', key: 'policyPremium' },
// //     { label: 'Start Date', key: 'policyStartDate' },
// //     { label: 'End Date', key: 'policyEndDate' }
// //   ],
// //   payment: [
// //     { label: 'Payment Date', key: 'paymentDate' },
// //     { label: 'Payment Mode', key: 'paymentMode' },
// //     { label: 'Cheque no. / Tr. no.', key: 'chequeNo' },
// //     { label: 'Drawn On', key: 'drawnOn' },
// //     { label: 'Amount Paid', key: 'amountPaid' }
// //   ],
// //   upcoming: [
// //     { label: 'Payment Frequency', key: 'paymentFrequency' },
// //     { label: 'Debit Type', key: 'debitType' },
// //     { label: 'Debit Date', key: 'debitDate' },
// //     { label: 'GST', key: 'gst' },
// //     { label: 'Monthly Premium', key: 'monthlyPremium' }
// //   ]
// // };

// // const InfoTable = ({ title, tableType, data, salesBill, className = '' }) => {
// //   const rows = predefinedRows[tableType] || [];

// //   // Handle Array Data (e.g., Dynamic List of Members) - Render Column-wise Table
// //   if (Array.isArray(data)) {
// //     // Special handling for membership table to determine dynamic columns
// //     if (tableType === 'membership') {
// //       // Determine the number of columns to render based on the data
// //       let columnsToRender = [];

// //       // 🔴 FIX: Properly analyze the data structure
// //       // Check doctor type from the first item
// //       const doctorType = data[0]?.doctorType;
      
// //       // Check if hospital should be shown
// //       const hasHospital = doctorType === 'hospital' || doctorType === 'hospital_individual';
// //       const shouldShowHospital = hasHospital && data[0]?.hospitalName && data[0]?.hospitalName !== 'N/A';

// //       // 🎯 FIXED LOGIC: Analyze the actual data composition
// //       // Count how many doctors and hospitals we have
// //       const doctorItems = data.filter(item => item.doctorType !== 'hospital');
// //       const hospitalItems = data.filter(item => item.doctorType === 'hospital');
      
// //       const hasMultipleDoctors = doctorItems.length > 1;
// //       const hasSingleDoctor = doctorItems.length === 1;
// //       const hasHospitalItem = hospitalItems.length > 0;

// //       console.log('Data analysis:', {
// //         totalItems: data.length,
// //         doctorItems: doctorItems.length,
// //         hospitalItems: hospitalItems.length,
// //         doctorType,
// //         hasMultipleDoctors,
// //         hasSingleDoctor,
// //         hasHospitalItem
// //       });

// //       // Build columns based on the actual composition
// //       if (hasMultipleDoctors) {
// //         // ✅ CASE 1: Multiple doctors (spouse case) - could be 2 or 3 columns
// //         columnsToRender = doctorItems.map((doctor, idx) => ({
// //           type: 'doctor',
// //           index: data.indexOf(doctor),
// //           label: `${doctor?.fullName || `Doctor ${idx + 1}`}`
// //         }));

// //         // Add hospital column if applicable (for hospital_individual type with spouse)
// //         if (shouldShowHospital && doctorType === 'hospital_individual' && hasHospitalItem) {
// //           const hospitalItem = hospitalItems[0];
// //           columnsToRender.push({ 
// //             type: 'hospital', 
// //             index: data.indexOf(hospitalItem), 
// //             label: 'Hospital' 
// //           });
// //         }
// //       } else if (hasSingleDoctor && hasHospitalItem) {
// //         // ✅ CASE 2: Single doctor with hospital (NO spouse) - 2 columns
// //         const doctorItem = doctorItems[0];
// //         const hospitalItem = hospitalItems[0];
        
// //         columnsToRender = [
// //           { type: 'doctor', index: data.indexOf(doctorItem), label: `${doctorItem?.fullName || 'Doctor'}` },
// //           { type: 'hospital', index: data.indexOf(hospitalItem), label: 'Hospital' }
// //         ];
// //         console.log('Setting up single doctor + hospital (2 columns)');
// //       } else if (hasHospitalItem && !hasSingleDoctor) {
// //         // ✅ CASE 3: Hospital only (no individual doctor)
// //         const hospitalItem = hospitalItems[0];
// //         columnsToRender = [
// //           { type: 'hospital', index: data.indexOf(hospitalItem), label: 'Hospital' }
// //         ];
// //       } else {
// //         // ✅ CASE 4: Single doctor (no hospital, no spouse)
// //         const doctorItem = doctorItems[0];
// //         columnsToRender = [
// //           { type: 'doctor', index: data.indexOf(doctorItem), label: `${doctorItem?.fullName || 'Doctor'}` }
// //         ];
// //       }

// //       const numberOfColumns = columnsToRender.length;
// //       const columnWidth = numberOfColumns > 0 ? `${Math.floor(65 / numberOfColumns)}%` : '65%';
// //       const particularWidth = numberOfColumns > 0 ? `${100 - Math.floor(65 / numberOfColumns) * numberOfColumns}%` : '35%';

// //       // Filter rows based on conditional logic for membership type
// //       const filteredRows = rows.filter(row => {
// //         if (row.conditional) {
// //           return data.some(member => member.membershipType?.toLowerCase() !== 'monthly');
// //         }
// //         return true;
// //       });

// //       return (
// //         <div className={`my-4 ${className} break-inside-avoid overflow-x-auto print:overflow-visible`}>
// //           {title && <strong className="text-[12px] block mb-2 print:pt-[10px]">{title}:</strong>}
// //           <table className="w-full border-collapse border border-black text-[12px] print:text-[12px] min-w-full table-fixed">
// //             <thead>
// //               <tr>
// //                 <th className="bg-blue-100 border border-black p-2 font-bold" style={{width: particularWidth}}>Particular</th>
// //                 {columnsToRender.map((col, idx) => (
// //                   <th key={idx} className="bg-blue-100 border border-black p-2 font-bold text-center print:text-center" style={{width: columnWidth}}>
// //                     {col.label}
// //                   </th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {filteredRows.length > 0 ? (
// //                 filteredRows.map((row, rowIndex) => {
// //                   // 🔴 CRITICAL FIX: Membership Type, Membership Plan, Hospital Name, and Total Service Charge
// //                   // MUST START FROM PARTICULAR COLUMN, NOT INSIDE DOCTOR/HOSPITAL COLUMNS
// //                   if (row.key === 'membershipId' || row.key === 'doctorType' || row.key === 'membershipType' ||
// //                       row.key === 'membershipPeriod' || row.key === 'startDate' || row.key === 'endDate' ||
// //                       row.key === 'hospitalName' || row.key === 'totalServiceCharge') {

// //                     // Use first item's data since these are shared values
// //                     const item = data[0];
// //                     let displayValue = item[row.key] || '-';

// //                     // Special handling for specific fields
// //                     if (row.key === 'membershipId' && salesBill) {
// //                       displayValue = salesBill.billNumber || item?.membershipId || '-';
// //                     }

// //                     if (row.key === 'totalServiceCharge' && row.suffixKey === 'membershipType') {
// //                       const membershipType = item?.membershipType?.toUpperCase();
// //                       displayValue = membershipType === 'MONTHLY' ? `${displayValue} /MONTH ` : displayValue;
// //                     }

// //                     return (
// //                       <tr key={rowIndex}>
// //                         <td className="border border-black p-2 font-medium text-left align-top break-words overflow-wrap break-word word-wrap"
// //                             style={{width: particularWidth, maxWidth: particularWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>
// //                           {row.label}
// //                         </td>
// //                         <td className="border border-black p-2 text-left align-top break-words overflow-wrap break-word word-wrap"
// //                             colSpan={numberOfColumns}
// //                             style={{width: '65%', maxWidth: '65%', verticalAlign: 'top', wordBreak: 'break-word'}}>
// //                           {displayValue}
// //                         </td>
// //                       </tr>
// //                     );
// //                   }

// //                   // Special handling for doctor-specific fields (Name, Qualification, etc.)
// //                   else if (row.key === 'fullName' || row.key === 'qualification' ||
// //                           row.key === 'specialization' || row.key === 'registrationNumber' ||
// //                           row.key === 'registrationYear') {
// //                     return (
// //                       <tr key={rowIndex}>
// //                         <td className="border border-black p-2 font-medium text-left align-top break-words"
// //                             style={{width: particularWidth}}>
// //                           {row.label}
// //                         </td>
// //                         {columnsToRender.map((col, colIdx) => {
// //                           let displayValue = '-';

// //                           if (col.type === 'doctor') {
// //                             // For doctor columns, use the corresponding doctor's data
// //                             const doctorData = data[col.index];

// //                             switch(row.key) {
// //                               case 'fullName':
// //                                 displayValue = doctorData?.fullName || '-';
// //                                 break;
// //                               case 'qualification':
// //                                 displayValue = doctorData?.qualification || '-';
// //                                 break;
// //                               case 'specialization':
// //                                 displayValue = Array.isArray(doctorData?.specialization) ?
// //                                   doctorData.specialization.join(', ') : doctorData?.specialization || '-';
// //                                 break;
// //                               case 'registrationNumber':
// //                                 displayValue = doctorData?.registrationNumber || '-';
// //                                 break;
// //                               case 'registrationYear':
// //                                 displayValue = doctorData?.registrationYear || '-';
// //                                 break;
// //                               default:
// //                                 displayValue = doctorData?.[row.key] || '-';
// //                             }
// //                           } else if (col.type === 'hospital') {
// //                             // For hospital column, use the hospital's data
// //                             const hospitalData = data[col.index];

// //                             switch(row.key) {
// //                               case 'fullName':
// //                                 displayValue = '-';
// //                                 break;
// //                               case 'qualification':
// //                                 displayValue = '-';
// //                                 break;
// //                               case 'specialization':
// //                                 displayValue = hospitalData?.specialization || hospitalData?.hospitalDetails?.hospitalType || '-';
// //                                 break;
// //                               case 'registrationNumber':
// //                                 displayValue = hospitalData?.registrationNumber || hospitalData?.hospitalDetails?.licenseNumber || '-';
// //                                 break;
// //                               case 'registrationYear':
// //                                 displayValue = hospitalData?.registrationYear || hospitalData?.hospitalDetails?.establishmentYear || '-';
// //                                 break;
// //                               default:
// //                                 displayValue = hospitalData?.[row.key] || '-';
// //                             }
// //                           }

// //                           return (
// //                             <td key={colIdx} className="border border-black p-2 text-left align-top break-words"
// //                                 style={{width: columnWidth}}>
// //                               {displayValue}
// //                             </td>
// //                           );
// //                         })}
// //                       </tr>
// //                     );
// //                   }

// //                   // Special handling for hospitalName - merge across all columns
// //                   else if (row.key === 'hospitalName') {
// //                     // For hospital columns or when hospital is involved, show hospital name merged
// //                     const hasHospitalColumn = columnsToRender.some(col => col.type === 'hospital');
                    
// //                     if (hasHospitalColumn) {
// //                       return (
// //                         <tr key={rowIndex}>
// //                           <td className="border border-black p-2 font-medium text-left align-top break-words overflow-wrap break-word word-wrap" style={{width: particularWidth, maxWidth: particularWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>{row.label}</td>
// //                           <td key="hospital-name-cell" className="border border-black p-2 text-left align-top break-words overflow-wrap break-word word-wrap" style={{width: '65%', maxWidth: '65%', verticalAlign: 'top', wordBreak: 'break-word'}} colSpan={numberOfColumns}>
// //                             {data[0]?.hospitalName || '-'}
// //                           </td>
// //                         </tr>
// //                       );
// //                     } else {
// //                       return (
// //                         <tr key={rowIndex}>
// //                           <td className="border border-black p-2 font-medium text-left align-top break-words" style={{width: particularWidth}}>{row.label}</td>
// //                           {columnsToRender.map((col, colIdx) => {
// //                             let displayValue = '-';

// //                             if (col.type === 'doctor') {
// //                               const doctorData = data[col.index];
// //                               displayValue = doctorData?.hospitalName || '-';
// //                             }

// //                             return (
// //                               <td key={colIdx} className="border border-black p-2 text-left align-top break-words" style={{width: columnWidth}}>
// //                                 {displayValue}
// //                               </td>
// //                             );
// //                           })}
// //                         </tr>
// //                       );
// //                     }
// //                   }

// //                   // Default handling for other rows
// //                   else {
// //                     return (
// //                       <tr key={rowIndex}>
// //                         <td className="border border-black p-2 font-medium text-left align-top break-words overflow-wrap break-word word-wrap"
// //                             style={{width: particularWidth, maxWidth: particularWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>
// //                           {row.label}
// //                         </td>
// //                         {columnsToRender.map((col, colIdx) => {
// //                           const displayValue = data[col.index]?.[row.key] || '-';
// //                           return (
// //                             <td key={colIdx} className="border border-black p-2 text-left align-top break-words overflow-wrap break-word word-wrap"
// //                                 style={{width: columnWidth, maxWidth: columnWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>
// //                               {displayValue}
// //                             </td>
// //                           );
// //                         })}
// //                       </tr>
// //                     );
// //                   }
// //                 })
// //               ) : (
// //                 <tr>
// //                   <td colSpan={numberOfColumns + 1} className="border border-black p-2 text-center text-gray-500">
// //                     No records found
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       );
// //     } else {
// //       // Handle other table types (policy, payment, etc.) as before
// //       const columnWidth = `${Math.floor(65 / data.length)}%`;
// //       const particularWidth = `${100 - Math.floor(65 / data.length) * data.length}%`;

// //       // Filter rows based on conditional logic for membership type
// //       const filteredRows = tableType === 'membership'
// //         ? rows.filter(row => {
// //             if (row.conditional) {
// //               return data.some(member => member.membershipType?.toLowerCase() !== 'monthly');
// //             }
// //             return true;
// //           })
// //         : rows;

// //       return (
// //         <div className={`my-4 ${className} break-inside-avoid overflow-x-auto print:overflow-visible`}>
// //           {title && <strong className="text-[12px] block mb-2 print:pt-[10px]">{title}:</strong>}
// //           <table className="w-full border-collapse border border-black text-[12px] print:text-[12px] min-w-full table-fixed">
// //             <thead>
// //               <tr>
// //                 <th className="bg-blue-100 border border-black p-2 font-bold" style={{width: particularWidth}}>Particular</th>
// //                 <th className="bg-blue-100 border border-black p-2 font-bold text-center print:text-center" colSpan={data.length} style={{width: '65%'}}>Details</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {filteredRows.length > 0 ? (
// //                 filteredRows.map((row, rowIndex) => {
// //                   // Special handling for membership table to merge Total Service Charge row
// //                   if (tableType === 'membership' && row.key === 'totalServiceCharge') {
// //                     return (
// //                       <tr key={rowIndex}>
// //                         <td className="border border-black p-2 font-medium text-left align-top break-words overflow-wrap break-word word-wrap" style={{width: particularWidth, maxWidth: particularWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>{row.label}</td>
// //                         <td key="total-service-charge-cell" className="border border-black p-2 text-left align-top break-words overflow-wrap break-word word-wrap" style={{width: '65%', maxWidth: '65%', verticalAlign: 'top', wordBreak: 'break-word'}} colSpan={data.length}>
// //                           {data.length > 0 ? (() => {
// //                             const item = data[0];
// //                             let displayValue = item[row.key] || '-';

// //                             if (row.suffixKey === 'membershipType' && tableType === 'membership' && row.key === 'totalServiceCharge') {
// //                               const membershipType = item?.membershipType?.toUpperCase();
// //                               displayValue = membershipType === 'MONTHLY' ? `${displayValue} /MONTH` : displayValue;
// //                             } else {
// //                               displayValue = `${displayValue}${row.suffix || ''}`;
// //                             }

// //                             return displayValue;
// //                           })() : '-'}
// //                         </td>
// //                       </tr>
// //                     );
// //                   }
// //                   // Special handling for membership ID, type, plan, dates, hospital name, and total service charge - merge across all columns
// //                   else if (tableType === 'membership' && (row.key === 'membershipId' || row.key === 'doctorType' || row.key === 'membershipType' ||
// //                            row.key === 'membershipPeriod' || row.key === 'startDate' || row.key === 'endDate' ||
// //                            row.key === 'hospitalName' || row.key === 'totalServiceCharge')) {
// //                     return (
// //                       <tr key={rowIndex}>
// //                         <td className="border border-black p-2 font-medium text-left align-top break-words overflow-wrap break-word word-wrap" style={{width: particularWidth, maxWidth: particularWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>{row.label}</td>
// //                         <td key={`${row.key}-merged-cell`} className="border border-black p-2 text-left align-top break-words overflow-wrap break-word word-wrap" style={{width: '65%', maxWidth: '65%', verticalAlign: 'top', wordBreak: 'break-word'}} colSpan={data.length}>
// //                           {data.length > 0 ? (() => {
// //                             const item = data[0];
// //                             let displayValue = item[row.key] || '-';

// //                             if (row.key === 'membershipId' && salesBill) {
// //                               displayValue = salesBill.billNumber || item?.membershipId || '-';
// //                             }

// //                             return displayValue;
// //                           })() : '-'}
// //                         </td>
// //                       </tr>
// //                     );
// //                   } else {
// //                     return (
// //                       <tr key={rowIndex}>
// //                         <td className="border border-black p-2 font-medium text-left align-top break-words overflow-wrap break-word word-wrap" style={{width: particularWidth, maxWidth: particularWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>{row.label}</td>
// //                         {data.map((item, itemIndex) => {
// //                           let displayValue = item[row.key] || '-';

// //                           if (row.key === 'membershipId' && salesBill) {
// //                             displayValue = salesBill.billNumber || item?.membershipId || '-';
// //                           }

// //                           if (row.suffixKey === 'membershipType' && tableType === 'membership' && row.key === 'totalServiceCharge') {
// //                             const membershipType = item?.membershipType?.toUpperCase();
// //                             displayValue = membershipType === 'MONTHLY' ? `${displayValue} /MONTH` : displayValue;
// //                           } else {
// //                             displayValue = `${displayValue}${row.suffix || ''}`;
// //                           }

// //                           return (
// //                             <td key={itemIndex} className="border border-black p-2 text-left align-top break-words overflow-wrap break-word word-wrap" style={{width: columnWidth, maxWidth: columnWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>
// //                               {displayValue}
// //                             </td>
// //                           );
// //                         })}
// //                       </tr>
// //                     );
// //                   }
// //                 }).filter(tr => tr !== null)
// //               ) : (
// //                 <tr>
// //                   <td colSpan={data.length + 1} className="border border-black p-2 text-center text-gray-500">
// //                     No records found
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       );
// //     }
// //   }

// //   // Default Handle Object Data - Render Vertical Table
// //   const filteredRows = tableType === 'membership'
// //     ? rows.filter(row => {
// //         if (row.conditional) {
// //           return data?.membershipType?.toLowerCase() !== 'monthly';
// //         }
// //         return true;
// //       })
// //     : rows;

// //   return (
// //     <div className={`my-4 ${className} break-inside-avoid overflow-x-auto print:overflow-visible`}>
// //       {title && <strong className="text-[12px] block mb-2 print:pt-[30px]">{title}:</strong>}
// //       <table className="w-full border-collapse border border-black text-[12px] print:text-[12px] min-w-full table-fixed">
// //         <thead>
// //           <tr>
// //             <th className="bg-blue-100 border border-black p-2 font-bold" style={{width: '35%'}}>Particular</th>
// //             <th className="bg-blue-100 border border-black p-2 font-bold" style={{width: '65%'}}>Details</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {filteredRows.map((row) => {
// //             const value = data?.[row.key] || '';
// //             let displayValue = value;
// //             if (row.suffixKey === 'membershipType' && tableType === 'membership' && row.key === 'totalServiceCharge') {
// //               displayValue = data?.[row.suffixKey]?.toUpperCase() === 'MONTHLY' ? `${value} /MONTH` : value;
// //             } else {
// //               displayValue = `${value}${row.suffix || ''}`;
// //             }
// //             return (
// //               <tr key={row.label}>
// //                 <td className="border border-black p-2 font-medium text-left align-top break-words overflow-wrap break-word word-wrap" style={{width: '35%', maxWidth: '35%', verticalAlign: 'top', wordBreak: 'break-word'}}>{row.label}</td>
// //                 <td className="border border-black p-2 text-left align-top break-words overflow-wrap break-word word-wrap" style={{width: '65%', maxWidth: '65%', verticalAlign: 'top', wordBreak: 'break-word'}}>{displayValue}</td>
// //               </tr>
// //             );
// //           })}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default InfoTable;

// import React from 'react';

// const predefinedRows = {
//   membership: [
//     { label: 'Membership ID', key: 'membershipId' },
//     { label: 'Doctor Name', key: 'fullName' },
//     { label: 'Hospital Name', key: 'hospitalName' },
//     { label: 'Qualification', key: 'qualification' },
//     { label: 'Specialization', key: 'specialization' },
//     { label: 'MCI Registration No', key: 'registrationNumber' },
//     { label: 'MCI Registration Year', key: 'registrationYear' },
//     { label: 'Membership Type', key: 'doctorType' },
//     { label: 'Membership Plan', key: 'membershipType' },
//     { label: 'Membership Period', key: 'membershipPeriod', conditional: true },
//     { label: 'Start Date', key: 'startDate' },
//     { label: 'End Date', key: 'endDate', conditional: true },
//     { label: 'Total Service Charge', key: 'totalServiceCharge', suffixKey: 'membershipType' }
//   ],
//   policy: [
//     { label: 'Doctor / Hospital Name', key: 'holderName' },
//     { label: 'Insurance Co. Name', key: 'insuranceCoName' },
//     { label: 'Type of Policy', key: 'policyType' },
//     { label: 'Policy Number', key: 'policyNumber' },
//     { label: 'Policy Cover', key: 'policyCover' },
//     { label: 'Policy Duration', key: 'policyDuration' },
//     { label: 'Policy Premium', key: 'policyPremium' },
//     { label: 'Start Date', key: 'policyStartDate' },
//     { label: 'End Date', key: 'policyEndDate' }
//   ],
//   payment: [
//     { label: 'Payment Date', key: 'paymentDate' },
//     { label: 'Payment Mode', key: 'paymentMode' },
//     { label: 'Cheque no. / Tr. no.', key: 'chequeNo' },
//     // { label: 'Drawn On', key: 'drawnOn' },
//     { label: 'Drawn On', key: 'drawnOnBank' },
//     { label: 'Amount Paid', key: 'amountPaid' }
//   ],
//   upcoming: [
//     { label: 'Payment Frequency', key: 'paymentFrequency' },
//     { label: 'Debit Type', key: 'debitType' },
//     { label: 'Debit Date', key: 'debitDate' },
//     { label: 'GST', key: 'gst' },
//     { label: 'Monthly Premium', key: 'monthlyPremium' }
//   ]
// };

// const InfoTable = ({ title, tableType, data, salesBill, className = '' }) => {
//   const rows = predefinedRows[tableType] || [];

//   // Handle Array Data (e.g., Dynamic List of Members) - Render Column-wise Table
//   if (Array.isArray(data)) {
//     // Special handling for membership table to determine dynamic columns
//     if (tableType === 'membership') {
//       // ✅ FIXED: Case-insensitive comparison
//       const doctorType = data[0]?.doctorType?.toLowerCase();
//       const doctorTypeUpper = data[0]?.doctorType;

//       console.log('Membership table data analysis:', {
//         totalItems: data.length,
//         doctorType,
//         doctorTypeUpper,
//         data: data.map(d => ({
//           name: d.fullName,
//           hospitalName: d.hospitalName,
//           type: d.doctorType,
//           isHospitalOnly: d.isHospitalOnly,
//           fullData: d
//         }))
//       });

//       // Count items by type (case-insensitive)
//       const hospitalOnlyItems = data.filter(item => 
//         item.doctorType?.toLowerCase() === 'hospital' || 
//         item.isHospitalOnly === true
//       );

//       const doctorItems = data.filter(item => 
//         item.doctorType?.toLowerCase() === 'individual' || 
//         (item.doctorType?.toLowerCase() === 'hospital_individual' && !item.isHospitalOnly)
//       );

//       console.log('Filtered items:', {
//         doctorItems: doctorItems.map(d => ({ name: d.fullName, type: d.doctorType, isHospitalOnly: d.isHospitalOnly })),
//         hospitalOnlyItems: hospitalOnlyItems.map(h => ({ name: h.fullName, hospitalName: h.hospitalName, type: h.doctorType, isHospitalOnly: h.isHospitalOnly })),
//         doctorType,
//         doctorItemsCount: doctorItems.length,
//         hospitalOnlyItemsCount: hospitalOnlyItems.length
//       });

//       // Build columns based on the actual composition
//       let columnsToRender = [];

//       // ✅ CASE 1: hospital_individual WITH spouse (3 columns)
//       if ((doctorType === 'hospital_individual' || doctorTypeUpper === 'HOSPITAL_INDIVIDUAL') && 
//           doctorItems.length >= 2 && hospitalOnlyItems.length >= 1) {
//         columnsToRender = [
//           { type: 'doctor', index: data.indexOf(doctorItems[0]), label: `${doctorItems[0]?.fullName || 'Doctor 1'}` },
//           { type: 'doctor', index: data.indexOf(doctorItems[1]), label: `${doctorItems[1]?.fullName || 'Doctor 2'}` },
//           { type: 'hospital', index: data.indexOf(hospitalOnlyItems[0]), label: 'Hospital' }
//         ];
//         console.log('Setting up hospital_individual WITH spouse (3 columns)', columnsToRender);
//       }
//       // ✅ CASE 2: hospital_individual WITHOUT spouse (2 columns)
//       else if ((doctorType === 'hospital_individual' || doctorTypeUpper === 'HOSPITAL_INDIVIDUAL') && 
//                doctorItems.length === 1 && hospitalOnlyItems.length === 1) {
//         columnsToRender = [
//           { type: 'doctor', index: data.indexOf(doctorItems[0]), label: `${doctorItems[0]?.fullName || 'Doctor'}` },
//           { type: 'hospital', index: data.indexOf(hospitalOnlyItems[0]), label: 'Hospital' }
//         ];
//         console.log('Setting up hospital_individual WITHOUT spouse (2 columns)', columnsToRender);
//       }
//       // ✅ CASE 3: Multiple doctors without hospital (individual with spouse)
//       else if (doctorItems.length >= 2 && hospitalOnlyItems.length === 0) {
//         columnsToRender = doctorItems.map((doctor, idx) => ({
//           type: 'doctor',
//           index: data.indexOf(doctor),
//           label: `${doctor?.fullName || `Doctor ${idx + 1}`}`
//         }));
//         console.log('Setting up individual WITH spouse (2 columns)', columnsToRender);
//       }
//       // ✅ CASE 4: Hospital only (no individual doctor)
//       else if (hospitalOnlyItems.length >= 1 && doctorItems.length === 0) {
//         const hospitalItem = hospitalOnlyItems[0];
//         columnsToRender = [
//           { type: 'hospital', index: data.indexOf(hospitalItem), label: 'Hospital' }
//         ];
//         console.log('Setting up hospital only (1 column)', columnsToRender);
//       }
//       // ✅ CASE 5: Single doctor (no hospital, no spouse)
//       else {
//         const doctorItem = doctorItems[0] || data[0];
//         columnsToRender = [
//           { type: 'doctor', index: data.indexOf(doctorItem), label: `${doctorItem?.fullName || 'Doctor'}` }
//         ];
//         console.log('Setting up single doctor (1 column)', columnsToRender);
//       }

//       const numberOfColumns = columnsToRender.length;
//       const columnWidth = numberOfColumns > 0 ? `${Math.floor(65 / numberOfColumns)}%` : '65%';
//       const particularWidth = numberOfColumns > 0 ? `${100 - Math.floor(65 / numberOfColumns) * numberOfColumns}%` : '35%';

//       // Filter rows based on conditional logic for membership type
//       const filteredRows = rows.filter(row => {
//         if (row.conditional) {
//           return data.some(member => member.membershipType?.toLowerCase() !== 'monthly');
//         }
//         return true;
//       });

//       return (
//         <div className={`my-4 ${className} break-inside-avoid overflow-x-auto print:overflow-visible`}>
//           {title && <strong className="text-[12px] block mb-2 print:pt-[10px]">{title}:</strong>}
//           <table className="w-full border-collapse border border-black text-[12px] print:text-[12px] min-w-full table-fixed">
//             <thead>
//               <tr>
//                 <th className="bg-blue-100 border border-black p-2 font-bold" style={{width: particularWidth}}>Particular</th>
//                 <th className="bg-blue-100 border border-black p-2 font-bold text-center print:text-center" colSpan={numberOfColumns} style={{width: '65%'}}>
//                   Details
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredRows.length > 0 ? (
//                 filteredRows.map((row, rowIndex) => {
//                   // 🔴 CRITICAL FIX: Shared values (Membership ID, Type, Plan, Dates, Hospital Name, Total Service Charge)
//                   if (row.key === 'membershipId' || row.key === 'doctorType' || row.key === 'membershipType' ||
//                       row.key === 'membershipPeriod' || row.key === 'startDate' || row.key === 'endDate' ||
//                       row.key === 'hospitalName' || row.key === 'totalServiceCharge') {

//                     // Use first item's data since these are shared values
//                     const item = data[0];
//                     let displayValue = item[row.key] || '-';

//                     // Special handling for specific fields
//                     if (row.key === 'membershipId' && salesBill) {
//                       displayValue = salesBill.billNumber || item?.membershipId || '-';
//                     }

//                     if (row.key === 'totalServiceCharge' && row.suffixKey === 'membershipType') {
//                       const membershipType = item?.membershipType?.toUpperCase();
//                       displayValue = membershipType === 'MONTHLY' ? `${displayValue} /MONTH ` : displayValue;
//                     }

//                     return (
//                       <tr key={rowIndex}>
//                         <td className="border border-black p-2 font-medium text-left align-top break-words overflow-wrap break-word word-wrap"
//                             style={{width: particularWidth, maxWidth: particularWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>
//                           {row.label}
//                         </td>
//                         <td className="border border-black p-2 text-left align-top break-words overflow-wrap break-word word-wrap"
//                             colSpan={numberOfColumns}
//                             style={{width: '65%', maxWidth: '65%', verticalAlign: 'top', wordBreak: 'break-word'}}>
//                           {displayValue}
//                         </td>
//                       </tr>
//                     );
//                   }

//                   // Special handling for doctor-specific fields (Name, Qualification, etc.)
//                   else if (row.key === 'fullName' || row.key === 'qualification' ||
//                           row.key === 'specialization' || row.key === 'registrationNumber' ||
//                           row.key === 'registrationYear') {
//                     return (
//                       <tr key={rowIndex}>
//                         <td className="border border-black p-2 font-medium text-left align-top break-words"
//                             style={{width: particularWidth}}>
//                           {row.label}
//                         </td>
//                         {columnsToRender.map((col, colIdx) => {
//                           let displayValue = '-';

//                           if (col.type === 'doctor') {
//                             // For doctor columns, use the corresponding doctor's data
//                             const doctorData = data[col.index];

//                             switch(row.key) {
//                               case 'fullName':
//                                 displayValue = doctorData?.fullName || '-';
//                                 break;
//                               case 'qualification':
//                                 displayValue = doctorData?.qualification || '-';
//                                 break;
//                               case 'specialization':
//                                 displayValue = Array.isArray(doctorData?.specialization) ?
//                                   doctorData.specialization.join(', ') : doctorData?.specialization || '-';
//                                 break;
//                               case 'registrationNumber':
//                                 displayValue = doctorData?.registrationNumber || '-';
//                                 break;
//                               case 'registrationYear':
//                                 displayValue = doctorData?.registrationYear || '-';
//                                 break;
//                               default:
//                                 displayValue = doctorData?.[row.key] || '-';
//                             }
//                           } else if (col.type === 'hospital') {
//                             // For hospital column, use the hospital's data
//                             const hospitalData = data[col.index];

//                             switch(row.key) {
//                               case 'fullName':
//                                 displayValue = '-';
//                                 break;
//                               case 'qualification':
//                                 displayValue = '-';
//                                 break;
//                               case 'specialization':
//                                 displayValue = hospitalData?.specialization || hospitalData?.hospitalDetails?.hospitalType || 'Hospital Management';
//                                 break;
//                               case 'registrationNumber':
//                                 displayValue = hospitalData?.registrationNumber || hospitalData?.hospitalDetails?.licenseNumber || '-';
//                                 break;
//                               case 'registrationYear':
//                                 displayValue = hospitalData?.registrationYear || hospitalData?.hospitalDetails?.establishmentYear || '-';
//                                 break;
//                               default:
//                                 displayValue = hospitalData?.[row.key] || '-';
//                             }
//                           }

//                           return (
//                             <td key={colIdx} className="border border-black p-2 text-left align-top break-words"
//                                 style={{width: columnWidth}}>
//                               {displayValue}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     );
//                   }

//                   // Default handling for other rows
//                   else {
//                     return (
//                       <tr key={rowIndex}>
//                         <td className="border border-black p-2 font-medium text-left align-top break-words overflow-wrap break-word word-wrap"
//                             style={{width: particularWidth, maxWidth: particularWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>
//                           {row.label}
//                         </td>
//                         {columnsToRender.map((col, colIdx) => {
//                           const displayValue = data[col.index]?.[row.key] || '-';
//                           return (
//                             <td key={colIdx} className="border border-black p-2 text-left align-top break-words overflow-wrap break-word word-wrap"
//                                 style={{width: columnWidth, maxWidth: columnWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>
//                               {displayValue}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     );
//                   }
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan={numberOfColumns + 1} className="border border-black p-2 text-center text-gray-500">
//                     No records found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       );
//     } else {
//       // ✅ FIXED: Policy table mein bhi single "Details" column header
//       const columnWidth = `${Math.floor(65 / data.length)}%`;
//       const particularWidth = `${100 - Math.floor(65 / data.length) * data.length}%`;

//       return (
//         <div className={`my-4 ${className} break-inside-avoid overflow-x-auto print:overflow-visible`}>
//           {title && <strong className="text-[12px] block mb-2 print:pt-[10px]">{title}:</strong>}
//           <table className="w-full border-collapse border border-black text-[12px] print:text-[12px] min-w-full table-fixed">
//             <thead>
//               <tr>
//                 <th className="bg-blue-100 border border-black p-2 font-bold" style={{width: particularWidth}}>Particular</th>
//                 <th className="bg-blue-100 border border-black p-2 font-bold text-center print:text-center" colSpan={data.length} style={{width: '65%'}}>
//                   Details
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   <td className="border border-black p-2 font-medium text-left align-top break-words overflow-wrap break-word word-wrap" 
//                       style={{width: particularWidth, maxWidth: particularWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>
//                     {row.label}
//                   </td>
//                   {data.map((item, itemIndex) => {
//                     let displayValue = item[row.key] || '-';
//                     if (row.suffixKey === 'membershipType' && tableType === 'membership' && row.key === 'totalServiceCharge') {
//                       const membershipType = item?.membershipType?.toUpperCase();
//                       displayValue = membershipType === 'MONTHLY' ? `${displayValue} /MONTH` : displayValue;
//                     }
//                     return (
//                       <td key={itemIndex} className="border border-black p-2 text-left align-top break-words overflow-wrap break-word word-wrap"
//                           style={{width: columnWidth, maxWidth: columnWidth, verticalAlign: 'top', wordBreak: 'break-word'}}>
//                         {displayValue}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       );
//     }
//   }

//   // Default Handle Object Data - Render Vertical Table
//   const filteredRows = tableType === 'membership'
//     ? rows.filter(row => {
//         if (row.conditional) {
//           return data?.membershipType?.toLowerCase() !== 'monthly';
//         }
//         return true;
//       })
//     : rows;

//   return (
//     <div className={`my-4 ${className} break-inside-avoid overflow-x-auto print:overflow-visible`}>
//       {title && <strong className="text-[12px] block mb-2 print:pt-[30px]">{title}:</strong>}
//       <table className="w-full border-collapse border border-black text-[12px] print:text-[12px] min-w-full table-fixed">
//         <thead>
//           <tr>
//             <th className="bg-blue-100 border border-black p-2 font-bold" style={{width: '35%'}}>Particular</th>
//             <th className="bg-blue-100 border border-black p-2 font-bold" style={{width: '65%'}}>Details</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredRows.map((row) => {
//             const value = data?.[row.key] || '';
//             let displayValue = value;
//             if (row.suffixKey === 'membershipType' && tableType === 'membership' && row.key === 'totalServiceCharge') {
//               displayValue = data?.[row.suffixKey]?.toUpperCase() === 'MONTHLY' ? `${value} /MONTH` : value;
//             } else {
//               displayValue = `${value}${row.suffix || ''}`;
//             }
//             return (
//               <tr key={row.label}>
//                 <td className="border border-black p-2 font-medium text-left align-top break-words overflow-wrap break-word word-wrap" style={{width: '35%', maxWidth: '35%', verticalAlign: 'top', wordBreak: 'break-word'}}>{row.label}</td>
//                 <td className="border border-black p-2 text-left align-top break-words overflow-wrap break-word word-wrap" style={{width: '65%', maxWidth: '65%', verticalAlign: 'top', wordBreak: 'break-word'}}>{displayValue}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default InfoTable;



import React from 'react';

const predefinedRows = {
  membership: [
    { label: 'Membership ID', key: 'membershipId' },
    { label: 'Doctor Name', key: 'fullName' },
    { label: 'Hospital Name', key: 'hospitalName' },
    { label: 'Qualification', key: 'qualification' },
    { label: 'Specialization', key: 'specialization' },
    { label: 'MCI Registration No', key: 'registrationNumber' },
    { label: 'MCI Registration Year', key: 'registrationYear' },
    { label: 'Membership Type', key: 'doctorType' },
    { label: 'Membership Plan', key: 'membershipType' },
    { label: 'Membership Period', key: 'membershipPeriod', conditional: true },
    { label: 'Start Date', key: 'startDate' },
    { label: 'End Date', key: 'endDate', conditional: true },
    { label: 'Total Service Charge', key: 'totalServiceCharge', suffixKey: 'membershipType' }
  ],
  policy: [
    { label: 'Doctor / Hospital Name', key: 'holderName' },
    { label: 'Insurance Co. Name', key: 'insuranceCoName' },
    { label: 'Type of Policy', key: 'policyType' },
    { label: 'Policy Number', key: 'policyNumber' },
    { label: 'Policy Cover', key: 'policyCover' },
    { label: 'Policy Duration', key: 'policyDuration' },
    { label: 'Policy Premium', key: 'policyPremium' },
    { label: 'Start Date', key: 'policyStartDate' },
    { label: 'End Date', key: 'policyEndDate' }
  ],
  payment: [
    { label: 'Payment Date', key: 'paymentDate' },
    { label: 'Payment Mode', key: 'paymentMode' },
    { label: 'Cheque no. / Tr. no.', key: 'chequeNo' },
    { label: 'Drawn On', key: 'drawnOnBank' },
    { label: 'Amount Paid', key: 'amountPaid' }
  ],
  upcoming: [
    { label: 'Payment Frequency', key: 'paymentFrequency' },
    { label: 'Debit Type', key: 'debitType' },
    { label: 'Debit Date', key: 'debitDate' },
    { label: 'GST', key: 'gst' },
    { label: 'Monthly Premium', key: 'monthlyPremium' }
  ]
};

const InfoTable = ({ title, tableType, data, salesBill, className = '' }) => {
  const rows = predefinedRows[tableType] || [];

  const getValue = (item, row) => {
    if (row.key === 'drawnOnBank') {
      return item?.drawnOnBank || item?.drawnOn || '-';
    }

    let value = item?.[row.key];

    if (Array.isArray(value)) {
      return value.join(', ') || '-';
    }

    if (row.key === 'totalServiceCharge' && row.suffixKey === 'membershipType') {
      const membershipType = item?.[row.suffixKey]?.toUpperCase();
      return membershipType === 'MONTHLY' ? `${value || ''} /MONTH` : (value || '-');
    }

    return value || '-';
  };

  // ============================ ARRAY DATA ============================
  if (Array.isArray(data)) {
    if (tableType === 'membership') {
      const doctorType = data[0]?.doctorType?.toLowerCase();
      const doctorTypeUpper = data[0]?.doctorType;

      const hospitalOnlyItems = data.filter(item =>
        item.doctorType?.toLowerCase() === 'hospital' || item.isHospitalOnly === true
      );

      const doctorItems = data.filter(item =>
        item.doctorType?.toLowerCase() === 'individual' ||
        (item.doctorType?.toLowerCase() === 'hospital_individual' && !item.isHospitalOnly)
      );

      let columnsToRender = [];

      if ((doctorType === 'hospital_individual' || doctorTypeUpper === 'HOSPITAL_INDIVIDUAL') &&
          doctorItems.length >= 2 && hospitalOnlyItems.length >= 1) {
        columnsToRender = [
          { type: 'doctor', index: data.indexOf(doctorItems[0]), label: doctorItems[0]?.fullName || 'Doctor 1' },
          { type: 'doctor', index: data.indexOf(doctorItems[1]), label: doctorItems[1]?.fullName || 'Doctor 2' },
          { type: 'hospital', index: data.indexOf(hospitalOnlyItems[0]), label: 'Hospital' }
        ];
      } else if ((doctorType === 'hospital_individual' || doctorTypeUpper === 'HOSPITAL_INDIVIDUAL') &&
                 doctorItems.length === 1 && hospitalOnlyItems.length === 1) {
        columnsToRender = [
          { type: 'doctor', index: data.indexOf(doctorItems[0]), label: doctorItems[0]?.fullName || 'Doctor' },
          { type: 'hospital', index: data.indexOf(hospitalOnlyItems[0]), label: 'Hospital' }
        ];
      } else if (doctorItems.length >= 2 && hospitalOnlyItems.length === 0) {
        columnsToRender = doctorItems.map((doctor, idx) => ({
          type: 'doctor',
          index: data.indexOf(doctor),
          label: doctor?.fullName || `Doctor ${idx + 1}`
        }));
      } else if (hospitalOnlyItems.length >= 1 && doctorItems.length === 0) {
        columnsToRender = [
          { type: 'hospital', index: data.indexOf(hospitalOnlyItems[0]), label: 'Hospital' }
        ];
      } else {
        const doctorItem = doctorItems[0] || data[0];
        columnsToRender = [
          { type: 'doctor', index: data.indexOf(doctorItem), label: doctorItem?.fullName || 'Doctor' }
        ];
      }

      const numberOfColumns = columnsToRender.length;
      const singleColWidthPercent = numberOfColumns > 0 ? Math.floor(65 / numberOfColumns) : 0;
      const columnWidth = `${singleColWidthPercent}%`;
      const particularWidth = `${100 - singleColWidthPercent * numberOfColumns}%`;

      const hasHospitalColumn = columnsToRender.some(col => col.type === 'hospital');
      const numDoctors = columnsToRender.filter(col => col.type === 'doctor').length;

      const filteredRows = rows.filter(row => {
        if (row.conditional) {
          return data.some(member => member.membershipType?.toLowerCase() !== 'monthly');
        }
        return true;
      });

      return (
        <div className={`my-4 ${className} break-inside-avoid overflow-x-auto print:overflow-visible`}>
          {title && <strong className="text-[12px] block mb-2 print:pt-[10px]">{title}:</strong>}
          <table className="w-full border-collapse border border-black text-[12px] print:text-[12px] min-w-full table-fixed">
            <thead>
              <tr>
                <th className="bg-blue-100 border border-black p-2 font-bold" style={{ width: particularWidth }}>Particular</th>
                <th className="bg-blue-100 border border-black p-2 font-bold text-center" colSpan={numberOfColumns} style={{ width: '65%' }}>
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rowIndex) => {
                // Shared rows (colspan)
                if (row.key === 'membershipId' || row.key === 'doctorType' || row.key === 'membershipType' ||
                    row.key === 'membershipPeriod' || row.key === 'startDate' || row.key === 'endDate' ||
                    row.key === 'hospitalName' || row.key === 'totalServiceCharge') {

                  const item = data[0];
                  let displayValue = getValue(item, row);

                  if (row.key === 'membershipId' && salesBill) {
                    displayValue = salesBill.billNumber || item?.membershipId || '-';
                  }

                  return (
                    <tr key={rowIndex}>
                      <td className="border border-black p-2 font-medium text-left align-top break-words" style={{ width: particularWidth }}>
                        {row.label}
                      </td>
                      <td className="border border-black p-2 text-left align-top break-words" colSpan={numberOfColumns} style={{ width: '65%' }}>
                        {displayValue}
                      </td>
                    </tr>
                  );
                }

                // ==================== DOCTOR NAME ROW SPECIAL HANDLING ====================
                if (row.key === 'fullName' && hasHospitalColumn && numDoctors > 0) {
                  const doctorCols = columnsToRender.filter(col => col.type === 'doctor');
                  const spanForLast = numberOfColumns - (numDoctors - 1);
                  const lastDoctorWidth = `${singleColWidthPercent * spanForLast}%`;

                  return (
                    <tr key={rowIndex}>
                      <td className="border border-black p-2 font-medium text-left align-top break-words" style={{ width: particularWidth }}>
                        {row.label}
                      </td>

                      {/* Normal doctor columns except last */}
                      {doctorCols.slice(0, -1).map((col, idx) => {
                        const itemData = data[col.index];
                        return (
                          <td key={idx} className="border border-black p-2 text-left align-top break-words" style={{ width: columnWidth }}>
                            {itemData?.fullName || '-'}
                          </td>
                        );
                      })}

                      {/* Last doctor column spans hospital column */}
                      {numDoctors > 0 && (
                        <td
                          colSpan={spanForLast}
                          className="border border-black p-2 text-left align-top break-words"
                          style={{ width: lastDoctorWidth }}
                        >
                          {doctorCols[numDoctors - 1]
                            ? data[doctorCols[numDoctors - 1].index]?.fullName || '-'
                            : '-'}
                        </td>
                      )}
                    </tr>
                  );
                }

                // Normal rendering for all other rows
                return (
                  <tr key={rowIndex}>
                    <td className="border border-black p-2 font-medium text-left align-top break-words" style={{ width: particularWidth }}>
                      {row.label}
                    </td>
                    {columnsToRender.map((col, colIdx) => {
                      let displayValue = '-';
                      const itemData = data[col.index];

                      if (col.type === 'doctor') {
                        if (row.key === 'fullName') displayValue = itemData?.fullName || '-';
                        else if (row.key === 'qualification') displayValue = itemData?.qualification || '-';
                        else if (row.key === 'specialization') {
                          displayValue = Array.isArray(itemData?.specialization)
                            ? itemData.specialization.join(', ')
                            : itemData?.specialization || '-';
                        } else if (row.key === 'registrationNumber') {
                          displayValue = itemData?.registrationNumber || itemData?.licenseNumber || '-';
                        } else if (row.key === 'registrationYear') {
                          displayValue = itemData?.registrationYear || '-';
                        } else {
                          displayValue = getValue(itemData, row);
                        }
                      } else if (col.type === 'hospital') {
                        if (row.key === 'fullName') displayValue = '-';
                        else if (row.key === 'qualification') displayValue = '-';
                        else if (row.key === 'specialization') {
                          displayValue = itemData?.specialization ||
                                         itemData?.hospitalDetails?.hospitalType ||
                                         'Hospital Management';
                        } else if (row.key === 'registrationNumber') {
                          displayValue = itemData?.registrationNumber ||
                                         itemData?.hospitalDetails?.licenseNumber || '-';
                        } else if (row.key === 'registrationYear') {
                          displayValue = itemData?.registrationYear ||
                                         itemData?.hospitalDetails?.establishmentYear || '-';
                        } else if (row.key === 'hospitalName') {
                          displayValue = itemData?.hospitalName || '-';
                        } else {
                          displayValue = getValue(itemData, row);
                        }
                      }

                      return (
                        <td key={colIdx} className="border border-black p-2 text-left align-top break-words" style={{ width: columnWidth }}>
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    // ============================ NON-MEMBERSHIP ARRAY TABLES ============================
    else {
      const columnWidth = `${Math.floor(65 / data.length)}%`;
      const particularWidth = `${100 - Math.floor(65 / data.length) * data.length}%`;

      return (
        <div className={`my-4 ${className} break-inside-avoid overflow-x-auto print:overflow-visible`}>
          {title && <strong className="text-[12px] block mb-2 print:pt-[10px]">{title}:</strong>}
          <table className="w-full border-collapse border border-black text-[12px] print:text-[12px] min-w-full table-fixed">
            <thead>
              <tr>
                <th className="bg-blue-100 border border-black p-2 font-bold" style={{ width: particularWidth }}>Particular</th>
                <th className="bg-blue-100 border border-black p-2 font-bold text-center" colSpan={data.length} style={{ width: '65%' }}>
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border border-black p-2 font-medium text-left align-top break-words" style={{ width: particularWidth }}>
                    {row.label}
                  </td>
                  {data.map((item, itemIndex) => (
                    <td key={itemIndex} className="border border-black p-2 text-left align-top break-words" style={{ width: columnWidth }}>
                      {getValue(item, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }

  // ============================ SINGLE OBJECT DATA ============================
  const filteredRows = tableType === 'membership'
    ? rows.filter(row => {
        if (row.conditional) {
          return data?.membershipType?.toLowerCase() !== 'monthly';
        }
        return true;
      })
    : rows;

  return (
    <div className={`my-4 ${className} break-inside-avoid overflow-x-auto print:overflow-visible`}>
      {title && <strong className="text-[12px] block mb-2 print:pt-[30px]">{title}:</strong>}
      <table className="w-full border-collapse border border-black text-[12px] print:text-[12px] min-w-full table-fixed">
        <thead>
          <tr>
            <th className="bg-blue-100 border border-black p-2 font-bold" style={{ width: '35%' }}>Particular</th>
            <th className="bg-blue-100 border border-black p-2 font-bold" style={{ width: '65%' }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => {
            let displayValue = getValue(data, row);

            if (row.key === 'membershipId' && salesBill) {
              displayValue = salesBill.billNumber || data?.membershipId || '-';
            }

            return (
              <tr key={row.label}>
                <td className="border border-black p-2 font-medium text-left align-top break-words" style={{ width: '35%' }}>
                  {row.label}
                </td>
                <td className="border border-black p-2 text-left align-top break-words" style={{ width: '65%' }}>
                  {displayValue}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InfoTable;