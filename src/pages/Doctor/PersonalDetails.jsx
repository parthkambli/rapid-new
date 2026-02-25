// import React, { useState, useEffect } from 'react';
// import { formatDateToDDMMYYYY } from '../../utils/dateFormatter';
// import apiClient, { apiEndpoints } from '../../services/apiClient';

// const DoctorPersonalDetails = () => {
//   const [loading, setLoading] = useState(true);
//   const [doctor, setDoctor] = useState(null);
//   const [receipts, setReceipts] = useState([]);
//   const [membershipHistory, setMembershipHistory] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const receiptsPerPage = 5;

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         // Fetch user info to get doctor ID
//         const userResponse = await apiClient.get(apiEndpoints.auth.me);

//         if (userResponse.data.success) {
//           let doctorId = null;

//           // Try different ways to get the doctor ID
//           if (userResponse.data.user && userResponse.data.user.doctorId) {
//             doctorId = userResponse.data.user.doctorId;
//           } else if (userResponse.data.user && userResponse.data.user.doctor && userResponse.data.user.doctor._id) {
//             doctorId = userResponse.data.user.doctor._id;
//           } else if (userResponse.data.doctorId) {
//             doctorId = userResponse.data.doctorId;
//           } else if (userResponse.data.user && userResponse.data.user._id) {
//             // Fallback to user ID if doctor ID not found
//             doctorId = userResponse.data.user._id;
//           }

//           // Fetch doctor information if we have a doctor ID
//           if (doctorId) {
//             // Try to fetch doctor details using the doctor-specific API
//             try {
//               const doctorResponse = await apiClient.get(apiEndpoints.doctors.get(doctorId));
//               if (doctorResponse.data.success) {
//                 setDoctor(doctorResponse.data.data); // Note: API returns data under 'data' property
//               }
//             } catch (err) {
//               console.warn('Could not fetch doctor info from doctor API:', err.message);

//               // Fallback to user response data
//               if (userResponse.data.user && userResponse.data.user.doctor) {
//                 setDoctor(userResponse.data.user.doctor);
//               } else if (userResponse.data.user) {
//                 setDoctor(userResponse.data.user);
//               }
//             }
//           }

//           // Fetch receipts for the doctor
//           const receiptsResponse = await apiClient.get(apiEndpoints.receipts.list);
//           if (receiptsResponse.data.success) {
//             // Filter receipts for the current doctor and receipts for their linked doctor
//             const allReceipts = Array.isArray(receiptsResponse.data.data) ? receiptsResponse.data.data : [];

//             const doctorReceipts = allReceipts.filter(receipt => {
//               // Main doctor ID (the one who owns the receipt)
//               const receiptOwnerId = receipt.payer?.entityId?._id;
//               // Linked doctor ID (the spouse/linked doctor)
//               const receiptLinkedDoctorId = receipt.payer?.entityId?.linkedDoctorId;

//               // Include receipts where:
//               // 1. The receipt belongs to the current doctor (receiptOwnerId === doctorId)
//               // 2. The receipt belongs to the main doctor that the current doctor is linked to (receiptLinkedDoctorId === doctorId)
//               return receiptOwnerId === doctorId || receiptLinkedDoctorId === doctorId;
//             });

//             setReceipts(doctorReceipts);
//           }

//           // Create membership history from policies
//           const policies = doctor?.policies || userResponse.data.user?.doctor?.policies || [];
//           const history = policies.map((policy, index) => ({
//             period: `${policy.startDate ? formatDateToDDMMYYYY(policy.startDate) : 'N/A'} → ${policy.endDate ? formatDateToDDMMYYYY(policy.endDate) : 'N/A'}`,
//             membership: policy.policyType || 'N/A',
//             amount: `₹${policy.coverageAmount || policy.coverage_amount || '0'}`,
//             payment: policy.paymentMode || 'N/A',
//             status: policy.status || 'N/A',
//             receiptId: policy.receiptId || null, // If policy has associated receipt
//             _id: policy._id || index.toString()
//           }));

//           setMembershipHistory(history);
//         } else {
//           console.error('Failed to fetch user data:', userResponse.data.message || 'Unknown error');
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, []);

//   const handleViewReceipt = (receiptId) => {
//     // Navigate to the doctor-specific receipt view page
//     window.open(`/doctor/view-receipt/${receiptId}`, '_blank');
//   };

//   const handleDownloadReceipt = (receiptId) => {
//     // For download, we'll use the print endpoint which generates a PDF-like view
//     window.open(`/doctor/print-receipt/${receiptId}`, '_blank');
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6">
//       <div className="mb-6">
//         <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Personal Details</h1>
//         <p className="text-sm sm:text-base text-gray-600">Manage your personal information</p>
//       </div>

//       {/* Personal Details Section */}
//       <div className="mb-8">
//         <h2 className="text-lg sm:text-xl font-bold text-teal-800 mb-4">Personal Details</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-teal-50 p-4 rounded-lg">
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">FULL NAME</p>
//             <p className="font-medium text-sm sm:text-base break-words">{doctor?.fullName || 'N/A'}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">PHONE NUMBER</p>
//             <p className="font-medium text-sm sm:text-base break-words">{doctor?.contactDetails?.phoneNumber || doctor?.phoneNumber || 'N/A'}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">EMAIL</p>
//             <p className="font-medium text-sm sm:text-base break-words">{doctor?.contactDetails?.emailId || doctor?.email || 'N/A'}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">SPECIALIZATION</p>
//             <p className="font-medium text-sm sm:text-base break-words">{Array.isArray(doctor?.specialization) ? doctor?.specialization.join(', ') : (doctor?.specialization || 'N/A')}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">HOSPITAL NAME</p>
//             <p className="font-medium text-sm sm:text-base break-words">{doctor?.hospitalName || 'N/A'}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">ADDRESS</p>
//             <p className="font-medium text-sm sm:text-base break-words">{doctor?.hospitalAddress?.address || doctor?.contactDetails?.currentAddress?.address || 'N/A'}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">CITY</p>
//             <p className="font-medium text-sm sm:text-base break-words">{doctor?.hospitalAddress?.city || doctor?.contactDetails?.currentAddress?.city || 'N/A'}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">STATE</p>
//             <p className="font-medium text-sm sm:text-base break-words">{doctor?.hospitalAddress?.state || doctor?.contactDetails?.currentAddress?.state || 'N/A'}</p>
//           </div>
//         </div>
//       </div>

//       {/* My Profile Section - Focus on personal details */}
//       <div className="mb-8">
//         <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">My Profile</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-teal-50 p-4 rounded-lg">
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">MEMBERSHIP TYPE</p>
//             <p className="font-medium text-sm sm:text-base break-words">{doctor?.doctorType || 'N/A'}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">SPECIALIZATION</p>
//             <p className="font-medium text-sm sm:text-base break-words">{Array.isArray(doctor?.specialization) ? doctor?.specialization.join(', ') : (doctor?.specialization || 'N/A')}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">HOSPITAL NAME</p>
//             <p className="font-medium text-sm sm:text-base break-words">{doctor?.hospitalName || 'N/A'}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">STATUS</p>
//             <p className="font-medium text-sm sm:text-base text-teal-600 bg-teal-100 inline-block px-2 py-1 rounded">{doctor?.status || 'N/A'}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">LINKED SPOUSE</p>
//             <p className="font-medium text-sm sm:text-base break-words">{doctor?.linkedDoctorId ? `Yes (${doctor?.relationshipType || 'N/A'})` : 'No'}</p>
//           </div>
//           <div>
//             <p className="text-xs sm:text-sm text-gray-600">REGISTRATION DATE</p>
//             <p className="font-medium text-sm sm:text-base break-words">{doctor?.createdAt ? formatDateToDDMMYYYY(doctor?.createdAt) : 'N/A'}</p>
//           </div>
//         </div>
//       </div>

//       {/* Receipts Section */}
//       <div className="mb-8">
//         <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Receipts</h2>
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           {receipts.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt No</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {receipts.slice((currentPage - 1) * receiptsPerPage, currentPage * receiptsPerPage).map((receipt) => (
//                     <tr key={receipt._id}>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600 break-words max-w-xs">{receipt.receiptNumber || receipt.receiptId || receipt._id || 'N/A'}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 break-words max-w-xs">
//                         {receipt.receiptDate
//                           ? `${formatDateToDDMMYYYY(receipt.receiptDate)}`
//                           : receipt.startDate && receipt.endDate
//                               ? `${formatDateToDDMMYYYY(receipt.startDate)} → ${formatDateToDDMMYYYY(receipt.endDate)}`
//                               : receipt.period || 'N/A'}
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">₹{receipt.amount?.toLocaleString('en-IN') || '0'}</td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize break-words max-w-xs">{receipt.paymentMethod || receipt.mode || 'N/A'}</td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                           ${receipt.status === 'received' || receipt.status === 'active' ? 'bg-green-100 text-green-800' :
//                             receipt.status === 'bounced' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                           {receipt.status || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 whitespace-nowrap text-sm">
//                         <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
//                           <button
//                             onClick={() => handleViewReceipt(receipt._id)}
//                             className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 whitespace-nowrap"
//                           >
//                             View
//                           </button>
//                           <button
//                             onClick={() => handleDownloadReceipt(receipt._id)}
//                             className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 whitespace-nowrap"
//                           >
//                             Download
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* Pagination Controls */}
//               {receipts.length > receiptsPerPage && (
//                 <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
//                   <div className="flex-1 flex justify-between sm:hidden">
//                     <button
//                       onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
//                       disabled={currentPage === 1}
//                       className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
//                         currentPage === 1
//                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : 'bg-white text-gray-700 hover:bg-gray-50'
//                       }`}
//                     >
//                       Previous
//                     </button>
//                     <button
//                       onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(receipts.length / receiptsPerPage)))}
//                       disabled={currentPage === Math.ceil(receipts.length / receiptsPerPage)}
//                       className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
//                         currentPage === Math.ceil(receipts.length / receiptsPerPage)
//                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : 'bg-white text-gray-700 hover:bg-gray-50'
//                       }`}
//                     >
//                       Next
//                     </button>
//                   </div>
//                   <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                     <div>
//                       <p className="text-sm text-gray-700">
//                         Showing <span className="font-medium">{(currentPage - 1) * receiptsPerPage + 1}</span> to{' '}
//                         <span className="font-medium">
//                           {Math.min(currentPage * receiptsPerPage, receipts.length)}
//                         </span>{' '}
//                         of <span className="font-medium">{receipts.length}</span> results
//                       </p>
//                     </div>
//                     <div>
//                       <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                         <button
//                           onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
//                           disabled={currentPage === 1}
//                           className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
//                             currentPage === 1
//                               ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                               : 'bg-white text-gray-500 hover:bg-gray-50'
//                           }`}
//                         >
//                           <span className="sr-only">Previous</span>
//                           &lt;
//                         </button>

//                         {/* Page numbers */}
//                         {[...Array(Math.min(5, Math.ceil(receipts.length / receiptsPerPage)))].map((_, i) => {
//                           let pageNum;
//                           if (Math.ceil(receipts.length / receiptsPerPage) <= 5) {
//                             // If total pages <= 5, show all
//                             pageNum = i + 1;
//                           } else if (currentPage <= 3) {
//                             // If current page is in first 3, show first 5
//                             pageNum = i + 1;
//                           } else if (currentPage >= Math.ceil(receipts.length / receiptsPerPage) - 2) {
//                             // If current page is in last 3, show last 5
//                             pageNum = Math.ceil(receipts.length / receiptsPerPage) - 4 + i;
//                           } else {
//                             // Otherwise, show 2 before and after current page
//                             pageNum = currentPage - 2 + i;
//                           }

//                           return (
//                             <button
//                               key={pageNum}
//                               onClick={() => setCurrentPage(pageNum)}
//                               className={`relative inline-flex items-center px-3 py-1 border text-sm font-medium ${
//                                 currentPage === pageNum
//                                   ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
//                                   : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                               }`}
//                             >
//                               {pageNum}
//                             </button>
//                           );
//                         })}

//                         <button
//                           onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(receipts.length / receiptsPerPage)))}
//                           disabled={currentPage === Math.ceil(receipts.length / receiptsPerPage)}
//                           className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
//                             currentPage === Math.ceil(receipts.length / receiptsPerPage)
//                               ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                               : 'bg-white text-gray-500 hover:bg-gray-50'
//                           }`}
//                         >
//                           <span className="sr-only">Next</span>
//                           &gt;
//                         </button>
//                       </nav>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="p-8 text-center text-gray-500">
//               No receipts found.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Membership History */}
//       <div>
//         <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Membership History</h2>
//         <div className="bg-teal-50 p-4 rounded-lg overflow-x-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 mb-2 text-xs sm:text-sm text-gray-600 font-medium">
//             <p>Period</p>
//             <p>Membership</p>
//             <p>Amount</p>
//             <p>Payment</p>
//             <p>Status</p>
//             <p>Receipt</p>
//           </div>
//           {membershipHistory.length > 0 ? (
//             membershipHistory.map((item, index) => (
//               <div key={item._id || index} className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 mb-4 items-center text-xs sm:text-sm">
//                 <p className="font-medium break-words">{item.period}</p>
//                 <p className="text-teal-600 bg-teal-100 px-2 py-1 rounded inline-block break-words">{item.membership}</p>
//                 <p className="break-words">{item.amount}</p>
//                 <p className="break-words">{item.payment}</p>
//                 <p
//                   className={`px-2 py-1 rounded inline-block ${item.status === 'Active'
//                       ? 'bg-teal-100 text-teal-600'
//                       : item.status === 'Completed'
//                         ? 'bg-green-100 text-green-600'
//                         : 'bg-orange-100 text-orange-600'
//                     }`}
//                 >
//                   {item.status}
//                 </p>
//                 <div className="flex space-x-2">
//                   {item.receiptId ? (
//                     <>
//                       <button
//                         onClick={() => handleViewReceipt(item.receiptId)}
//                         className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 whitespace-nowrap"
//                       >
//                         View
//                       </button>
//                       <button
//                         onClick={() => handleDownloadReceipt(item.receiptId)}
//                         className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 whitespace-nowrap"
//                       >
//                         Download
//                       </button>
//                     </>
//                   ) : (
//                     <span className="text-gray-400 text-xs">N/A</span>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-4 text-gray-500">
//               No membership history found
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorPersonalDetails;



// import React, { useState, useEffect } from 'react';
// import { formatDateToDDMMYYYY } from '../../utils/dateFormatter';
// import apiClient, { apiEndpoints } from '../../services/apiClient';

// const DoctorPersonalDetails = () => {
//   const [loading, setLoading] = useState(true);
//   const [doctor, setDoctor] = useState(null);
//   const [receipts, setReceipts] = useState([]);
//   const [membershipHistory, setMembershipHistory] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const receiptsPerPage = 5;

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         const userResponse = await apiClient.get(apiEndpoints.auth.me);

//         if (userResponse.data.success) {
//           let doctorId = null;

//           if (userResponse.data.user && userResponse.data.user.doctorId) {
//             doctorId = userResponse.data.user.doctorId;
//           } else if (userResponse.data.user && userResponse.data.user.doctor && userResponse.data.user.doctor._id) {
//             doctorId = userResponse.data.user.doctor._id;
//           } else if (userResponse.data.doctorId) {
//             doctorId = userResponse.data.doctorId;
//           } else if (userResponse.data.user && userResponse.data.user._id) {
//             doctorId = userResponse.data.user._id;
//           }

//           if (doctorId) {
//             try {
//               const doctorResponse = await apiClient.get(apiEndpoints.doctors.get(doctorId));
//               if (doctorResponse.data.success) {
//                 setDoctor(doctorResponse.data.data);
//               }
//             } catch (err) {
//               console.warn('Could not fetch doctor info from doctor API:', err.message);
//               if (userResponse.data.user && userResponse.data.user.doctor) {
//                 setDoctor(userResponse.data.user.doctor);
//               } else if (userResponse.data.user) {
//                 setDoctor(userResponse.data.user);
//               }
//             }
//           }

//           const receiptsResponse = await apiClient.get(apiEndpoints.receipts.list);
//           if (receiptsResponse.data.success) {
//             const allReceipts = Array.isArray(receiptsResponse.data.data) ? receiptsResponse.data.data : [];

//             const doctorReceipts = allReceipts.filter(receipt => {
//               const receiptOwnerId = receipt.payer?.entityId?._id;
//               const receiptLinkedDoctorId = receipt.payer?.entityId?.linkedDoctorId;
//               return receiptOwnerId === doctorId || receiptLinkedDoctorId === doctorId;
//             });

//             setReceipts(doctorReceipts);
//           }

//           const policies = doctor?.policies || userResponse.data.user?.doctor?.policies || [];
//           const history = policies.map((policy, index) => ({
//             period: `${policy.startDate ? formatDateToDDMMYYYY(policy.startDate) : 'N/A'} → ${policy.endDate ? formatDateToDDMMYYYY(policy.endDate) : 'N/A'}`,
//             membership: policy.policyType || 'N/A',
//             amount: `₹${policy.coverageAmount || policy.coverage_amount || '0'}`,
//             payment: policy.paymentMode || 'N/A',
//             status: policy.status || 'N/A',
//             receiptId: policy.receiptId || null,
//             _id: policy._id || index.toString()
//           }));

//           setMembershipHistory(history);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, []);

//   const handleViewReceipt = (receiptId) => {
//     window.open(`/doctor/view-receipt/${receiptId}`, '_blank');
//   };

//   const handleDownloadReceipt = (receiptId) => {
//     window.open(`/doctor/print-receipt/${receiptId}`, '_blank');
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   const totalPages = Math.ceil(receipts.length / receiptsPerPage);
//   const showPagination = receipts.length > receiptsPerPage;

//   return (
//     <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Personal Details</h1>
//         <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your personal information</p>
//       </div>

//       {/* Personal Details Section */}
//       <div className="mb-8">
//         <h2 className="text-xl font-bold text-teal-800 mb-4">Personal Details</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-teal-50 p-5 rounded-xl shadow-sm">
//           {[
//             { label: 'FULL NAME', value: doctor?.fullName || 'N/A' },
//             { label: 'PHONE NUMBER', value: doctor?.contactDetails?.phoneNumber || doctor?.phoneNumber || 'N/A' },
//             { label: 'EMAIL', value: doctor?.contactDetails?.emailId || doctor?.email || 'N/A' },
//             { label: 'SPECIALIZATION', value: Array.isArray(doctor?.specialization) ? doctor.specialization.join(', ') : (doctor?.specialization || 'N/A') },
//             { label: 'HOSPITAL NAME', value: doctor?.hospitalName || 'N/A' },
//             { label: 'ADDRESS', value: doctor?.hospitalAddress?.address || doctor?.contactDetails?.currentAddress?.address || 'N/A' },
//             { label: 'CITY', value: doctor?.hospitalAddress?.city || doctor?.contactDetails?.currentAddress?.city || 'N/A' },
//             { label: 'STATE', value: doctor?.hospitalAddress?.state || doctor?.contactDetails?.currentAddress?.state || 'N/A' },
//           ].map((item, idx) => (
//             <div key={idx}>
//               <p className="text-xs text-gray-600 font-medium uppercase">{item.label}</p>
//               <p className="font-medium text-gray-900 mt-1 break-words">{item.value}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* My Profile Section */}
//       <div className="mb-10">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">My Profile</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-teal-50 p-5 rounded-xl shadow-sm">
//           {[
//             { label: 'MEMBERSHIP TYPE', value: doctor?.doctorType || 'N/A' },
//             { label: 'SPECIALIZATION', value: Array.isArray(doctor?.specialization) ? doctor.specialization.join(', ') : (doctor?.specialization || 'N/A') },
//             { label: 'HOSPITAL NAME', value: doctor?.hospitalName || 'N/A' },
//             { label: 'STATUS', value: doctor?.status || 'N/A', isStatus: true },
//             { label: 'LINKED SPOUSE', value: doctor?.linkedDoctorId ? `Yes (${doctor?.relationshipType || 'N/A'})` : 'No' },
//             { label: 'REGISTRATION DATE', value: doctor?.createdAt ? formatDateToDDMMYYYY(doctor.createdAt) : 'N/A' },
//           ].map((item, idx) => (
//             <div key={idx}>
//               <p className="text-xs text-gray-600 font-medium uppercase">{item.label}</p>
//               {item.isStatus ? (
//                 <span className="mt-1 inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-full font-medium">
//                   {item.value}
//                 </span>
//               ) : (
//                 <p className="font-medium text-gray-900 mt-1 break-words">{item.value}</p>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Receipts Section - FIXED SCROLL */}
//       <div className="mb-10">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">Receipts</h2>
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {receipts.length > 0 ? (
//             <div className="relative overflow-x-auto">
//               {/* Mobile view - card layout */}
//               <div className="block sm:hidden space-y-4 p-4">
//                 {receipts
//                   .slice((currentPage - 1) * receiptsPerPage, currentPage * receiptsPerPage)
//                   .map((receipt) => (
//                     <div key={receipt._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <div className="grid grid-cols-2 gap-3 mb-3">
//                         <div>
//                           <p className="text-xs text-gray-500">Receipt No</p>
//                           <p className="text-sm font-medium text-blue-600">
//                             {receipt.receiptNumber || receipt.receiptId || receipt._id || 'N/A'}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500">Date</p>
//                           <p className="text-sm text-gray-900">
//                             {receipt.receiptDate
//                               ? formatDateToDDMMYYYY(receipt.receiptDate)
//                               : receipt.startDate && receipt.endDate
//                               ? `${formatDateToDDMMYYYY(receipt.startDate)} → ${formatDateToDDMMYYYY(receipt.endDate)}`
//                               : receipt.period || 'N/A'}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500">Amount</p>
//                           <p className="text-sm font-medium text-gray-900">
//                             ₹{(receipt.amount || 0).toLocaleString('en-IN')}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500">Mode</p>
//                           <p className="text-sm text-gray-600 capitalize">
//                             {receipt.paymentMethod || receipt.mode || 'N/A'}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span
//                           className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
//                             receipt.status === 'received' || receipt.status === 'active'
//                               ? 'bg-green-100 text-green-800'
//                               : receipt.status === 'bounced'
//                               ? 'bg-red-100 text-red-800'
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}
//                         >
//                           {receipt.status || 'N/A'}
//                         </span>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleViewReceipt(receipt._id)}
//                             className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700"
//                           >
//                             View
//                           </button>
//                           <button
//                             onClick={() => handleDownloadReceipt(receipt._id)}
//                             className="bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700"
//                           >
//                             Download
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//               </div>

//               {/* Desktop view - table layout */}
//               <div className="hidden sm:block overflow-x-auto w-full">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Receipt No</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Mode</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {receipts
//                       .slice((currentPage - 1) * receiptsPerPage, currentPage * receiptsPerPage)
//                       .map((receipt) => (
//                         <tr key={receipt._id} className="hover:bg-gray-50">
//                           <td className="px-4 py-3 text-sm font-medium text-blue-600 whitespace-nowrap">
//                             {receipt.receiptNumber || receipt.receiptId || receipt._id || 'N/A'}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
//                             {receipt.receiptDate
//                               ? formatDateToDDMMYYYY(receipt.receiptDate)
//                               : receipt.startDate && receipt.endDate
//                               ? `${formatDateToDDMMYYYY(receipt.startDate)} → ${formatDateToDDMMYYYY(receipt.endDate)}`
//                               : receipt.period || 'N/A'}
//                           </td>
//                           <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
//                             ₹{(receipt.amount || 0).toLocaleString('en-IN')}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-600 capitalize whitespace-nowrap">
//                             {receipt.paymentMethod || receipt.mode || 'N/A'}
//                           </td>
//                           <td className="px-4 py-3">
//                             <span
//                               className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
//                                 receipt.status === 'received' || receipt.status === 'active'
//                                   ? 'bg-green-100 text-green-800'
//                                   : receipt.status === 'bounced'
//                                   ? 'bg-red-100 text-red-800'
//                                   : 'bg-yellow-100 text-yellow-800'
//                               }`}
//                             >
//                               {receipt.status || 'N/A'}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 text-sm">
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() => handleViewReceipt(receipt._id)}
//                                 className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 whitespace-nowrap"
//                               >
//                                 View
//                               </button>
//                               <button
//                                 onClick={() => handleDownloadReceipt(receipt._id)}
//                                 className="bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 whitespace-nowrap"
//                               >
//                                 Download
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ) : (
//             <div className="p-10 text-center text-gray-500">No receipts found.</div>
//           )}

//           {/* Pagination */}
//           {showPagination && (
//             <div className="px-4 py-4 flex items-center justify-between border-t border-gray-200 sm:px-6">
//               <div className="flex-1 flex justify-between sm:hidden">
//                 <button
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className={`px-4 py-2 border rounded-md text-sm ${
//                     currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'
//                   }`}
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className={`ml-3 px-4 py-2 border rounded-md text-sm ${
//                     currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>

//               <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//                 <p className="text-sm text-gray-700">
//                   Showing <span className="font-medium">{(currentPage - 1) * receiptsPerPage + 1}</span> to{' '}
//                   <span className="font-medium">{Math.min(currentPage * receiptsPerPage, receipts.length)}</span> of{' '}
//                   <span className="font-medium">{receipts.length}</span> results
//                 </p>

//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                   <button
//                     onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className={`relative inline-flex items-center px-3 py-2 rounded-l-md border text-sm ${
//                       currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'
//                     }`}
//                   >
//                     &lt;
//                   </button>

//                   {[...Array(totalPages)].map((_, i) => {
//                     const page = i + 1;
//                     return (
//                       <button
//                         key={page}
//                         onClick={() => setCurrentPage(page)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === page
//                             ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     );
//                   })}

//                   <button
//                     onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className={`relative inline-flex items-center px-3 py-2 rounded-r-md border text-sm ${
//                       currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'
//                     }`}
//                   >
//                     &gt;
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Membership History - FIXED SCROLL */}
//       <div>
//         <h2 className="text-xl font-bold text-gray-900 mb-4">Membership History</h2>
//         <div className="bg-teal-50 rounded-xl shadow-sm overflow-hidden">
//           {membershipHistory.length > 0 ? (
//             <>
//               {/* Mobile view - card layout */}
//               <div className="block sm:hidden space-y-4 p-4">
//                 {membershipHistory.map((item, index) => (
//                   <div key={item._id || index} className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="grid grid-cols-2 gap-3 mb-3">
//                       <div>
//                         <p className="text-xs text-gray-500">Period</p>
//                         <p className="text-sm font-medium">{item.period}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Membership</p>
//                         <span className="text-sm text-teal-700 bg-teal-100 px-2 py-1 rounded-full">
//                           {item.membership}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Amount</p>
//                         <p className="text-sm">{item.amount}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Payment</p>
//                         <p className="text-sm">{item.payment}</p>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs ${
//                           item.status === 'Active'
//                             ? 'bg-teal-100 text-teal-700'
//                             : item.status === 'Completed'
//                             ? 'bg-green-100 text-green-700'
//                             : 'bg-orange-100 text-orange-700'
//                         }`}
//                       >
//                         {item.status}
//                       </span>
//                       <div className="flex gap-2">
//                         {item.receiptId ? (
//                           <>
//                             <button
//                               onClick={() => handleViewReceipt(item.receiptId)}
//                               className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700"
//                             >
//                               View
//                             </button>
//                             <button
//                               onClick={() => handleDownloadReceipt(item.receiptId)}
//                               className="bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700"
//                             >
//                               Download
//                             </button>
//                           </>
//                         ) : (
//                           <span className="text-gray-400 text-xs">N/A</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Desktop view - table layout */}
//               <div className="hidden sm:block overflow-x-auto">
//                 <div className="min-w-[900px] p-5">
//                   <div className="grid grid-cols-6 gap-4 mb-3 text-xs font-medium text-gray-600 uppercase">
//                     <div>Period</div>
//                     <div>Membership</div>
//                     <div>Amount</div>
//                     <div>Payment</div>
//                     <div>Status</div>
//                     <div>Receipt</div>
//                   </div>

//                   {membershipHistory.map((item, index) => (
//                     <div
//                       key={item._id || index}
//                       className="grid grid-cols-6 gap-4 py-4 border-t border-gray-200 text-sm items-center"
//                     >
//                       <div className="font-medium whitespace-nowrap">{item.period}</div>
//                       <div className="text-teal-700 bg-teal-100 px-3 py-1 rounded-full inline-block whitespace-nowrap">
//                         {item.membership}
//                       </div>
//                       <div className="whitespace-nowrap">{item.amount}</div>
//                       <div className="whitespace-nowrap">{item.payment}</div>
//                       <div>
//                         <span
//                           className={`px-3 py-1 rounded-full whitespace-nowrap ${
//                             item.status === 'Active'
//                               ? 'bg-teal-100 text-teal-700'
//                               : item.status === 'Completed'
//                               ? 'bg-green-100 text-green-700'
//                               : 'bg-orange-100 text-orange-700'
//                           }`}
//                         >
//                           {item.status}
//                         </span>
//                       </div>
//                       <div className="flex gap-2">
//                         {item.receiptId ? (
//                           <>
//                             <button
//                               onClick={() => handleViewReceipt(item.receiptId)}
//                               className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 whitespace-nowrap"
//                             >
//                               View
//                             </button>

//                           </>
//                         ) : (
//                           <span className="text-gray-400 text-xs">N/A</span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="text-center py-8 text-gray-500">No membership history found</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorPersonalDetails;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateToDDMMYYYY } from '../../utils/dateFormatter';
import apiClient, { apiEndpoints } from '../../services/apiClient';

const DoctorPersonalDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [activeMembership, setActiveMembership] = useState(null);
  const [membershipHistory, setMembershipHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get logged-in user
        const userRes = await apiClient.get(apiEndpoints.auth.me);
        if (!userRes.data.success) throw new Error('Failed to fetch user');

        const user = userRes.data.user;
        const doctorId = user.doctorId || user.doctor?._id;

        if (!doctorId) throw new Error('No doctor ID found');

        // Use with-spouse endpoint to get complete doctor info (main + linked/spouse)
        const doctorRes = await apiClient.get(apiEndpoints.doctors.getWithSpouse(doctorId));
        if (!doctorRes.data.success) throw new Error('Failed to fetch doctor with spouse');

        const responseData = doctorRes.data.data;
        const mainDoctor = responseData.mainDoctor || responseData;
        setDoctor(mainDoctor);

        // Prepare membership data based on the API response structure
        // Using billDate and dueDate from salesBills instead of main doctor startDate/endDate

        // Find the most recent bill for active membership
        const bills = mainDoctor.salesBills || [];
        const sortedBills = bills.sort((a, b) => new Date(b.billId?.dueDate || b.billId?.endDate) - new Date(a.billId?.dueDate || a.billId?.endDate));
        const latestBill = sortedBills.length > 0 ? sortedBills[0] : null;

        // Get the bill details
        const billDetails = latestBill?.billId || latestBill || {};

        // Find the most recent payment for active membership
        const latestPayment = billDetails.payments && billDetails.payments.length > 0
          ? billDetails.payments[0]
          : (mainDoctor.payments && mainDoctor.payments.length > 0
            ? mainDoctor.payments[0]
            : null);

        // Use billDate and dueDate from the bill
        const billDate = billDetails.billDate;
        const dueDate = billDetails.dueDate;

        let duration = 'N/A';
        let completedYears = 0;

        if (billDate && dueDate) {
          const start = new Date(billDate);
          const end = new Date(dueDate);

          // Calculate duration in years
          const diffTime = Math.abs(end - start);
          const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
          duration = `${Math.round(diffYears)} Years`;

          // Calculate completed years from billDate to today
          const today = new Date();
          if (today >= start) {
            const timeSinceStart = Math.abs(today - start);
            const yearsSinceStart = timeSinceStart / (1000 * 60 * 60 * 24 * 365);
            completedYears = Math.floor(yearsSinceStart);

            // If current date exceeds end date, completed years is the full duration
            if (today > end) {
              completedYears = diffYears;
            }
          }
        }

        // Format dates for display
        const formattedBillDate = billDate ? formatDateToDDMMYYYY(billDate) : 'N/A';
        const formattedDueDate = dueDate ? formatDateToDDMMYYYY(dueDate) : 'N/A';

        // Determine membership type with special handling for hospital_individual
        let membershipType = mainDoctor.doctorType || 'Individual';
        if (membershipType === 'hospital_individual') {
          membershipType = 'Individual + Hospital';
        }

        // Map status based on due date only (period completion)
        let uiStatus = 'Active'; // Default status
        if (dueDate) {
          const dueDateTime = new Date(dueDate);
          const today = new Date();

          // If due date has passed, show "Completed", otherwise "Active"
          if (today > dueDateTime) {
            uiStatus = 'Completed';
          } else {
            uiStatus = 'Active';
          }
        }

        // Check if membership type is monthly
        const isMonthlyMembership = billDetails.membershipType === 'monthly';

        // Get the amount based on membership type
        let displayAmount = 'N/A';
        if (isMonthlyMembership && billDetails.items && billDetails.items.length > 0) {
          // For monthly membership, get the first item's amount
          const monthlyAmount = billDetails.items[0]?.amount || billDetails.items[0]?.unitPrice || 0;
          displayAmount = `₹${Number(monthlyAmount).toLocaleString('en-IN')}`;
        } else if (billDetails.totalAmount) {
          // For non-monthly membership, use totalAmount
          displayAmount = `₹${Number(billDetails.totalAmount).toLocaleString('en-IN')}`;
        }

        // Active membership data
        setActiveMembership({
          type: membershipType,
          duration: duration,
          startDate: formattedBillDate,
          endDate: formattedDueDate,
          amount: displayAmount,
          completedYears: completedYears,
          paymentMode: latestPayment ? latestPayment.paymentMethod : 'N/A',
          status: uiStatus,
          receiptId: latestBill?._id || billDetails.receiptId || null,
          isMonthlyMembership: isMonthlyMembership
        });

        // Membership History - using salesBills as per API structure
        const history = sortedBills.map(billItem => {
          const bill = billItem.billId || billItem;

          // Find latest payment for this bill
          const billLatestPayment = bill.payments && bill.payments.length > 0
            ? bill.payments[0]
            : latestPayment; // fallback to main latest payment

          // Map status based on due date only (period completion)
          let billUiStatus = 'Active';
          if (bill.dueDate) {
            const dueDateTime = new Date(bill.dueDate);
            const today = new Date();

            // If due date has passed, show "Completed", otherwise "Active"
            if (today > dueDateTime) {
              billUiStatus = 'Completed';
            } else {
              billUiStatus = 'Active';
            }
          }

          // Determine membership type for history with special handling
          // Use main doctor's type instead of bill's membership type to show Individual/Hospital
          let historyMembershipType = mainDoctor.doctorType || 'Individual';
          if (historyMembershipType === 'hospital_individual') {
            historyMembershipType = 'Individual + Hospital';
          }

          // Determine amount based on membership type
          let historyAmount = '₹12,000'; // Default value
          if (bill.membershipType === 'monthly' && bill.items && bill.items.length > 0) {
            // For monthly membership, get the first item's amount
            const monthlyAmount = bill.items[0]?.amount || bill.items[0]?.unitPrice || 0;
            historyAmount = `₹${Number(monthlyAmount).toLocaleString('en-IN')}`;
          } else if (bill.totalAmount || bill.amount) {
            // For non-monthly membership, use totalAmount or amount
            historyAmount = `₹${Number(bill.totalAmount || bill.amount).toLocaleString('en-IN')}`;
          }

          // Format period based on status and membership type
          // Show "Present" only for monthly memberships when active, for yearly show actual end date
          const startDateFormatted = formatDateToDDMMYYYY(bill.billDate || bill.startDate || 'N/A');
          const isMonthlyMembership = bill.membershipType === 'monthly';
          const endDateFormatted = billUiStatus === 'Active' && isMonthlyMembership ? 'Present' : formatDateToDDMMYYYY(bill.dueDate || bill.endDate || 'N/A');
          const periodFormatted = `${startDateFormatted} → ${endDateFormatted}`;

          return {
            period: periodFormatted,
            membership: historyMembershipType,
            amount: historyAmount,
            payment: billLatestPayment ? billLatestPayment.paymentMethod : 'N/A',
            status: billUiStatus,
            receiptId: billItem._id || bill.receiptId || null
          };
        });

        setMembershipHistory(history);

      } catch (err) {
        console.error('Error fetching personal details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto bg-white min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Personal Details</h1>
      <p className="text-gray-600 mb-8">Manage your personal information</p>

      {/* Personal Details - unchanged */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-teal-800 mb-4">Personal Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-teal-50 p-6 rounded-xl shadow-sm">
          {[
            { label: 'FULL NAME', value: doctor?.fullName || 'N/A' },
            { label: 'PHONE NUMBER', value: doctor?.contactDetails?.phoneNumber || doctor?.phoneNumber || 'N/A' },
            { label: 'EMAIL', value: doctor?.contactDetails?.emailId || doctor?.email || 'N/A' },
            { label: 'SPECIALIZATION', value: Array.isArray(doctor?.specialization) ? doctor.specialization.join(', ') : (doctor?.specialization || 'N/A') },
            { label: 'HOSPITAL NAME', value: doctor?.hospitalName || 'N/A' },
            { label: 'ADDRESS', value: doctor?.hospitalAddress?.address || doctor?.contactDetails?.currentAddress?.address || 'N/A' },
            { label: 'CITY', value: doctor?.hospitalAddress?.city || doctor?.contactDetails?.currentAddress?.city || 'N/A' },
            { label: 'STATE', value: doctor?.hospitalAddress?.state || doctor?.contactDetails?.currentAddress?.state || 'N/A' },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{item.label}</p>
              <p className="font-medium text-gray-900 mt-1.5 break-words">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Membership Details - Updated based on task.md requirements */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-teal-800 mb-4">Membership Details</h2>
        <div className="bg-teal-50 rounded-xl shadow-sm border border-teal-100 overflow-hidden">
          {activeMembership ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column */}
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-medium">MEMBERSHIP TYPE</p>
                    <p className="text-lg font-semibold text-teal-800 mt-1">{activeMembership.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-medium">START DATE</p>
                    <p className="text-lg font-semibold text-teal-800 mt-1">{activeMembership.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-medium">AMOUNT</p>
                    <p className="text-lg font-semibold text-teal-800 mt-1">{activeMembership.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-medium">PAYMENT MODE</p>
                    <p className="text-lg font-semibold text-teal-800 mt-1">{activeMembership.paymentMode}</p>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  {!activeMembership.isMonthlyMembership && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-medium">DURATION</p>
                      <p className="text-lg font-semibold text-teal-800 mt-1">{activeMembership.duration}</p>
                    </div>
                  )}
                  {!activeMembership.isMonthlyMembership && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-medium">END DATE</p>
                      <p className="text-lg font-semibold text-teal-800 mt-1">{activeMembership.endDate}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-medium">COMPLETED YEARS</p>
                    <p className="text-lg font-semibold text-teal-800 mt-1">{activeMembership.completedYears}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-medium">STATUS</p>
                    <span className="inline-block mt-1 px-4 py-1.5 bg-teal-100 text-teal-800 font-semibold rounded-full text-lg">
                      {activeMembership.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Receipt action for current membership - REMOVED DOWNLOAD BUTTON as per task.md */}

            </div>
          ) : (
            <div className="p-10 text-center text-gray-600">No active membership found</div>
          )}
        </div>
      </div>

      {/* Membership History - Updated based on task.md requirements */}
      <div>
        <h2 className="text-xl font-bold text-teal-800 mb-4">Membership History</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {membershipHistory.length > 0 ? (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 text-xs font-medium text-gray-600 uppercase border-b">
                  <div>PERIOD</div>
                  <div>MEMBERSHIP</div>
                  <div>AMOUNT</div>
                  <div>PAYMENT</div>
                  <div>STATUS</div>
                  <div>RECEIPT</div>
                </div>

                {membershipHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-6 gap-4 px-6 py-4 border-b last:border-0 items-center text-sm"
                  >
                    <div className="font-medium">{item.period}</div>
                    <div>
                      <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
                        {item.membership}
                      </span>
                    </div>
                    <div className="font-medium">{item.amount}</div>
                    <div>{item.payment}</div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Active' ? 'bg-teal-100 text-teal-700' :
                          item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate('/doctor/payments')}
                        className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {membershipHistory.map((item, idx) => (
                  <div key={idx} className="p-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Period</p>
                        <p className="font-medium mt-1">{item.period}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Membership</p>
                        <span className="inline-block mt-1 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm">
                          {item.membership}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Amount</p>
                        <p className="font-medium mt-1">{item.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Payment</p>
                        <p className="mt-1">{item.payment}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                          item.status === 'Active' ? 'bg-teal-100 text-teal-700' :
                          item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {item.status}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate('/doctor/payments')}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-600">No membership history available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPersonalDetails;