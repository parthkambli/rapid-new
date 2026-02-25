// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";

// // Get API base URL for document serving (remove /api suffix)
// const getApiBaseUrl = () => {
//   try {
//     // Try to get from environment variable (Vite)
//     if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
//       const apiUrl = import.meta.env.VITE_API_URL;
//       return apiUrl.replace('/api', '');
//     }
//   } catch (e) {
//     // Fallback if import.meta is not available
//   }
//   // Default fallback
//   return 'http://localhost:3000';
// };

// const getDocumentUrl = (filePath) => {
//   if (!filePath) return null;
//   try {
//     const baseUrl = getApiBaseUrl();

//     // Convert server path to URL
//     // Server stores: /home/khalid/production-pj/rapid/rapid-apis/uploads/advocates/file.png
//     // Should map to: http://localhost:3000/uploads/advocates/file.png
//     if (filePath.startsWith("/home")) {
//       // Extract the path after 'uploads'
//       const uploadsIndex = filePath.indexOf("/uploads");
//       if (uploadsIndex !== -1) {
//         const relativePath = filePath.substring(uploadsIndex);
//         return `${baseUrl}${relativePath}`;
//       }
//     }
//     // If already a relative path starting with /uploads
//     if (filePath.startsWith("/uploads")) {
//       return `${baseUrl}${filePath}`;
//     }
//     return filePath;
//   } catch (error) {
//     console.error("Error generating document URL:", error);
//     return null;
//   }
// };

// const ViewAdvocate = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [advocate, setAdvocate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAdvocate = async () => {
//       try {
//         setLoading(true);
//         const response = await apiClient.get(apiEndpoints.advocates.get(id));
//         setAdvocate(response.data.data);
//       } catch (err) {
//         console.error("Error fetching advocate:", err);
//         setError(err.response?.data?.message || "Failed to fetch advocate details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdvocate();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-lg text-gray-600">Loading advocate details...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-[79vw] mx-auto p-6">
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">View Advocate</h2>
//         </div>
//         <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//           Error: {error}
//         </div>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   if (!advocate) {
//     return (
//       <div className="max-w-[79vw] mx-auto p-6">
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">View Advocate</h2>
//         </div>
//         <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
//           Advocate not found
//         </div>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">View Advocate</h2>
//         <div className="flex gap-3">
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium"
//           >
//             Go Back
//           </button>
//           <button
//             onClick={() => navigate(`/admin/create-advocate`, { state: { editData: advocate } })}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
//           >
//             Edit
//           </button>
//         </div>
//       </div>

//       {/* Advocate Details */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Personal Information */}
//         <div className="bg-gray-50 p-4 rounded-lg border">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
//           <div className="space-y-3">
//             <div>
//               <label className="text-sm font-medium text-gray-600">Advocate ID</label>
//               <p className="text-gray-800">{advocate.advocateId || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Full Name</label>
//               <p className="text-gray-800">{advocate.fullName || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Email</label>
//               <p className="text-gray-800">{advocate.email || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Phone</label>
//               <p className="text-gray-800">{advocate.phoneNumber || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">WhatsApp</label>
//               <p className="text-gray-800">{advocate.whatsappNumber || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Bar Council Number</label>
//               <p className="text-gray-800">{advocate.barCouncilNumber || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Status</label>
//               <span className={`inline-block px-2 py-1 text-xs rounded-full ${advocate.status === 'active' ? 'bg-green-100 text-green-800' :
//                 advocate.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
//                   advocate.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-red-100 text-red-800'
//                 }`}>
//                 {advocate.status?.charAt(0).toUpperCase() + advocate.status?.slice(1) || "N/A"}
//               </span>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Specialization</label>
//               <p className="text-gray-800">
//                 {Array.isArray(advocate.specialization)
//                   ? advocate.specialization.join(', ')
//                   : advocate.specialization || "N/A"}
//               </p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Experience (Years)</label>
//               <p className="text-gray-800">{advocate.experience || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Practice Type</label>
//               <p className="text-gray-800">
//                 {advocate.practiceType ?
//                   advocate.practiceType.charAt(0).toUpperCase() + advocate.practiceType.slice(1) :
//                   "N/A"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Residential Address */}
//         <div className="bg-gray-50 p-4 rounded-lg border">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Residential Address</h3>
//           <div className="space-y-3">
//             <div>
//               <label className="text-sm font-medium text-gray-600">Address</label>
//               <p className="text-gray-800">{advocate.residentialAddress?.address || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">City</label>
//               <p className="text-gray-800">{advocate.residentialAddress?.city || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">State</label>
//               <p className="text-gray-800">{advocate.residentialAddress?.state || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Country</label>
//               <p className="text-gray-800">{advocate.residentialAddress?.country || "N/A"}</p>
//             </div>
//             {/* <div>
//               <label className="text-sm font-medium text-gray-600">Pincode</label>
//               <p className="text-gray-800">{advocate.residentialAddress?.pinCode || "N/A"}</p>
//             </div> */}
//           </div>
//         </div>

//         {/* Office Address */}
//         <div className="bg-gray-50 p-4 rounded-lg border">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Office Address</h3>
//           <div className="space-y-3">
//             <div>
//               <label className="text-sm font-medium text-gray-600">Office Address</label>
//               <p className="text-gray-800">{advocate.officeAddress?.address || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Office City</label>
//               <p className="text-gray-800">{advocate.officeAddress?.city || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Office State</label>
//               <p className="text-gray-800">{advocate.officeAddress?.state || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Office Country</label>
//               <p className="text-gray-800">{advocate.officeAddress?.country || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Office Pincode</label>
//               <p className="text-gray-800">{advocate.officeAddress?.pinCode || "N/A"}</p>
//             </div>
//           </div>
//         </div>

//         {/* Firm Address (if different from office) */}
//         {advocate.firmAddress && (
//           <div className="bg-gray-50 p-4 rounded-lg border">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Firm Address</h3>
//             <div className="space-y-3">
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Firm Address</label>
//                 <p className="text-gray-800">{advocate.firmAddress.address || "N/A"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Firm City</label>
//                 <p className="text-gray-800">{advocate.firmAddress.city || "N/A"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Firm State</label>
//                 <p className="text-gray-800">{advocate.firmAddress.state || "N/A"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Firm Country</label>
//                 <p className="text-gray-800">{advocate.firmAddress.country || "N/A"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Firm Pincode</label>
//                 <p className="text-gray-800">{advocate.firmAddress.pinCode || "N/A"}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Professional Information */}
//         <div className="bg-gray-50 p-4 rounded-lg border">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Professional Information</h3>
//           <div className="space-y-3">
//             <div>
//               <label className="text-sm font-medium text-gray-600">Firm Name</label>
//               <p className="text-gray-800">{advocate.firmName || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Date of Enrollment</label>
//               <p className="text-gray-800">
//                 {advocate.enrollmentDate
//                   ? new Date(advocate.enrollmentDate).toLocaleDateString()
//                   : "N/A"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Qualifications */}
//         {advocate.qualifications && advocate.qualifications.length > 0 && (
//           <div className="bg-gray-50 p-4 rounded-lg border md:col-span-2">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Qualifications</h3>
//             <div className="space-y-2">
//               {advocate.qualifications.map((qual, index) => (
//                 <div key={index} className="bg-white p-3 rounded border">
//                   <p className="font-medium">{qual.degree || "N/A"}</p>
//                   <p className="text-sm text-gray-600">{qual.university || "N/A"}</p>
//                   <p className="text-sm text-gray-600">
//                     Year: {qual.year || "N/A"} | Specialization: {qual.specialization || "N/A"}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Courts */}
//         {advocate.courts && advocate.courts.length > 0 && (
//           <div className="bg-gray-50 p-4 rounded-lg border md:col-span-2">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Courts</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {advocate.courts.map((court, index) => (
//                 <div key={index} className="bg-white p-3 rounded border">
//                   <p className="font-medium">{court.courtName || "N/A"}</p>
//                   <p className="text-sm text-gray-600">
//                     Type: {court.courtType ?
//                       court.courtType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) :
//                       "N/A"}
//                   </p>
//                   {/* <p className="text-sm text-gray-600">Jurisdiction: {court.jurisdiction || "N/A"}</p>
//                   <p className="text-sm text-gray-600">Enrollment No: {court.enrollmentNumber || "N/A"}</p> */}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Performance & Rating */}
//         {/* <div className="bg-gray-50 p-4 rounded-lg border">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Performance & Rating</h3>
//           <div className="space-y-3">
//             <div>
//               <label className="text-sm font-medium text-gray-600">Rating</label>
//               <p className="text-gray-800">
//                 {advocate.rating !== undefined ? `${advocate.rating}/5` : "N/A"}
//               </p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Total Cases</label>
//               <p className="text-gray-800">{advocate.totalCases || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Successful Cases</label>
//               <p className="text-gray-800">{advocate.successfulCases || "N/A"}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Success Rate</label>
//               <p className="text-gray-800">{advocate.successRate !== undefined ? `${advocate.successRate}%` : "N/A"}</p>
//             </div>
//           </div>
//         </div> */}

//         {/* Fee Structure */}
//         {advocate.feeStructure && (
//           <div className="bg-gray-50 p-4 rounded-lg border">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Fee Structure</h3>
//             <div className="space-y-3">
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Consultation Fee</label>
//                 <p className="text-gray-800">₹{advocate.feeStructure.consultationFee || "0"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Case Fee</label>
//                 <p className="text-gray-800">₹{advocate.feeStructure.caseFee || "0"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Hourly Rate</label>
//                 <p className="text-gray-800">₹{advocate.feeStructure.hourlyRate || "0"}</p>
//               </div>
//               {advocate.feeStructure.contingencyFee && (
//                 <>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Contingency Fee %</label>
//                     <p className="text-gray-800">{advocate.feeStructure.contingencyFee.percentage || "N/A"}%</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Contingency Conditions</label>
//                     <p className="text-gray-800">{advocate.feeStructure.contingencyFee.conditions || "N/A"}</p>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Billing Details */}
//         {advocate.billingDetails && (
//           <div className="bg-gray-50 p-4 rounded-lg border md:col-span-2">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Billing Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-600">PAN Number</label>
//                 <p className="text-gray-800">{advocate.billingDetails.panNumber || "N/A"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">GST Number</label>
//                 <p className="text-gray-800">{advocate.billingDetails.gstNumber || "N/A"}</p>
//               </div>
//               {advocate.billingDetails.bankDetails && (
//                 <>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Bank Name</label>
//                     <p className="text-gray-800">{advocate.billingDetails.bankDetails.bankName || "N/A"}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Account Holder Name</label>
//                     <p className="text-gray-800">{advocate.billingDetails.bankDetails.accountHolderName || "N/A"}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">Account Number</label>
//                     <p className="text-gray-800">{advocate.billingDetails.bankDetails.accountNumber || "N/A"}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-600">IFSC Code</label>
//                     <p className="text-gray-800">{advocate.billingDetails.bankDetails.ifscCode || "N/A"}</p>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Documents */}
//         {advocate.documents && (
//           <div className="bg-gray-50 p-4 rounded-lg border md:col-span-2">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Documents</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {advocate.documents.panFile && (
//                 <div className="bg-white p-3 rounded border">
//                   <label className="text-sm font-medium text-gray-600 block mb-2">PAN Card</label>
//                   <a
//                     href={getDocumentUrl(advocate.documents.panFile)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-800 text-sm"
//                   >
//                     View Document
//                   </a>
//                   <img
//                     src={getDocumentUrl(advocate.documents.panFile)}
//                     alt="PAN Card"
//                     className="mt-2 w-full h-32 object-cover rounded border"
//                     onError={(e) => { e.target.style.display = 'none'; }}
//                   />
//                 </div>
//               )}

//               {advocate.documents.gstFile && (
//                 <div className="bg-white p-3 rounded border">
//                   <label className="text-sm font-medium text-gray-600 block mb-2">GST Certificate</label>
//                   <a
//                     href={getDocumentUrl(advocate.documents.gstFile)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-800 text-sm"
//                   >
//                     View Document
//                   </a>
//                   <img
//                     src={getDocumentUrl(advocate.documents.gstFile)}
//                     alt="GST Certificate"
//                     className="mt-2 w-full h-32 object-cover rounded border"
//                     onError={(e) => { e.target.style.display = 'none'; }}
//                   />
//                 </div>
//               )}

//               {advocate.documents.photoIdProof && (
//                 <div className="bg-white p-3 rounded border">
//                   <label className="text-sm font-medium text-gray-600 block mb-2">Aadhar Card</label>
//                   <a
//                     href={getDocumentUrl(advocate.documents.photoIdProof)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-800 text-sm"
//                   >
//                     View Document
//                   </a>
//                   <img
//                     src={getDocumentUrl(advocate.documents.photoIdProof)}
//                     alt="Aadhar Card"
//                     className="mt-2 w-full h-32 object-cover rounded border"
//                     onError={(e) => { e.target.style.display = 'none'; }}
//                   />
//                 </div>
//               )}

//               {advocate.documents.addressProof && (
//                 <div className="bg-white p-3 rounded border">
//                   <label className="text-sm font-medium text-gray-600 block mb-2">License/Address Proof</label>
//                   <a
//                     href={getDocumentUrl(advocate.documents.addressProof)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-800 text-sm"
//                   >
//                     View Document
//                   </a>
//                   <img
//                     src={getDocumentUrl(advocate.documents.addressProof)}
//                     alt="License/Address Proof"
//                     className="mt-2 w-full h-32 object-cover rounded border"
//                     onError={(e) => { e.target.style.display = 'none'; }}
//                   />
//                 </div>
//               )}

//               {advocate.documents.barCouncilCertificate && (
//                 <div className="bg-white p-3 rounded border">
//                   <label className="text-sm font-medium text-gray-600 block mb-2">Bar Council Certificate</label>
//                   <a
//                     href={getDocumentUrl(advocate.documents.barCouncilCertificate)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-800 text-sm"
//                   >
//                     View Document
//                   </a>
//                   <img
//                     src={getDocumentUrl(advocate.documents.barCouncilCertificate)}
//                     alt="Bar Council Certificate"
//                     className="mt-2 w-full h-32 object-cover rounded border"
//                     onError={(e) => { e.target.style.display = 'none'; }}
//                   />
//                 </div>
//               )}

//               {advocate.documents.enrollmentCertificate && (
//                 <div className="bg-white p-3 rounded border">
//                   <label className="text-sm font-medium text-gray-600 block mb-2">Enrollment Certificate</label>
//                   <a
//                     href={getDocumentUrl(advocate.documents.enrollmentCertificate)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-800 text-sm"
//                   >
//                     View Document
//                   </a>
//                   <img
//                     src={getDocumentUrl(advocate.documents.enrollmentCertificate)}
//                     alt="Enrollment Certificate"
//                     className="mt-2 w-full h-32 object-cover rounded border"
//                     onError={(e) => { e.target.style.display = 'none'; }}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Additional Information */}
//         <div className="bg-gray-50 p-4 rounded-lg border md:col-span-2">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Additional Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium text-gray-600">Availability</label>
//               <p className="text-gray-800">
//                 {advocate.availability ?
//                   advocate.availability.charAt(0).toUpperCase() + advocate.availability.slice(1) :
//                   "N/A"}
//               </p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-600">Communication Preferences</label>
//               <div className="text-sm text-gray-800">
//                 {advocate.communicationPreferences ? (
//                   <div>
//                     <span className={advocate.communicationPreferences.email ? 'text-green-600' : 'text-red-600'}>Email</span>,
//                     <span className={advocate.communicationPreferences.sms ? 'text-green-600' : 'text-red-600'}> SMS</span>,
//                     <span className={advocate.communicationPreferences.whatsapp ? 'text-green-600' : 'text-red-600'}> WhatsApp</span>,
//                     <span className={advocate.communicationPreferences.phone ? 'text-green-600' : 'text-red-600'}> Phone</span>
//                   </div>
//                 ) : "N/A"}
//               </div>
//             </div>
//             <div className="md:col-span-2">
//               <label className="text-sm font-medium text-gray-600">Remarks</label>
//               <p className="text-gray-800">{advocate.remarks || "N/A"}</p>
//             </div>
//             <div className="md:col-span-2">
//               <label className="text-sm font-medium text-gray-600">Special Notes</label>
//               <p className="text-gray-800">{advocate.specialNotes || "N/A"}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="mt-6 flex justify-end gap-3">
//         <button
//           onClick={() => navigate(-1)}
//           className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium"
//         >
//           Go Back
//         </button>
//         <button
//           onClick={() => navigate(`/admin/create-advocate`, { state: { editData: advocate } })}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
//         >
//           Edit Advocate
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ViewAdvocate;





import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";

// Get API base URL from environment
const getApiBaseUrl = () => {
  try {
    // For Vite environment
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URI) {
      const apiUrl = import.meta.env.VITE_API_URI;
      return apiUrl.replace('/api', '');
    }
  } catch (e) {
    // Fallback
  }
  // Default fallback
  return 'http://localhost:3000';
};

// Function to convert server file path to accessible URL
const getDocumentUrl = (filePath) => {
  if (!filePath) return null;
  
  const baseUrl = getApiBaseUrl();
  
  // If already a URL, return as is
  if (filePath.startsWith('http')) {
    return filePath;
  }
  
  // Handle Windows paths (C:\Users\...\uploads\...)
  if (filePath.includes('\\')) {
    // Extract filename from Windows path
    const fileName = filePath.split('\\').pop();
    // Determine upload type from path
    if (filePath.includes('pan-cards')) {
      return `${baseUrl}/uploads/pan-cards/${fileName}`;
    } else if (filePath.includes('aadhar-cards')) {
      return `${baseUrl}/uploads/aadhar-cards/${fileName}`;
    } else if (filePath.includes('advocates')) {
      return `${baseUrl}/uploads/advocates/${fileName}`;
    } else if (filePath.includes('address-proofs')) {
      return `${baseUrl}/uploads/address-proofs/${fileName}`;
    } else if (filePath.includes('qualification-certificates')) {
      return `${baseUrl}/uploads/qualification-certificates/${fileName}`;
    } else if (filePath.includes('bar-council-certificates')) {
      return `${baseUrl}/uploads/bar-council-certificates/${fileName}`;
    } else if (filePath.includes('enrollment-certificates')) {
      return `${baseUrl}/uploads/enrollment-certificates/${fileName}`;
    }
    // Default to uploads folder
    return `${baseUrl}/uploads/${fileName}`;
  }
  
  // Handle Linux paths (/home/.../uploads/...)
  if (filePath.startsWith('/home') || filePath.startsWith('/uploads')) {
    // Extract path after 'uploads'
    const uploadsIndex = filePath.indexOf('/uploads');
    if (uploadsIndex !== -1) {
      const relativePath = filePath.substring(uploadsIndex);
      return `${baseUrl}${relativePath}`;
    }
  }
  
  // If it's just a filename, assume it's in uploads folder
  if (!filePath.includes('/') && !filePath.includes('\\')) {
    return `${baseUrl}/uploads/${filePath}`;
  }
  
  // Return as relative path
  return `${baseUrl}${filePath.startsWith('/') ? filePath : '/' + filePath}`;
};

const ViewAdvocate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advocate, setAdvocate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docModalOpen, setDocModalOpen] = useState(false);

  useEffect(() => {
    const fetchAdvocate = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(apiEndpoints.advocates.get(id));
        setAdvocate(response.data.data);
      } catch (err) {
        console.error("Error fetching advocate:", err);
        setError(err.response?.data?.message || "Failed to fetch advocate details");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocate();
  }, [id]);

  const openDocumentModal = (docType, docPath) => {
    if (!docPath) return;
    
    const docTypes = {
      panFile: "PAN Card",
      gstFile: "GST Certificate", 
      photoIdProof: "Aadhar Card",
      addressProof: "License",
      barCouncilCertificate: "Bar Council Certificate",
      enrollmentCertificate: "Enrollment Certificate"
    };
    
    setSelectedDoc({
      type: docTypes[docType] || docType,
      url: getDocumentUrl(docPath),
      path: docPath
    });
    setDocModalOpen(true);
  };

  const closeDocumentModal = () => {
    setSelectedDoc(null);
    setDocModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading advocate details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[79vw] mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">View Advocate</h2>
        </div>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!advocate) {
    return (
      <div className="max-w-[79vw] mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">View Advocate</h2>
        </div>
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Advocate not found
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">View Advocate</h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate(`/admin/create-advocate`, { state: { editData: advocate } })}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Advocate Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Advocate ID</label>
                <p className="text-gray-800">{advocate.advocateId || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-gray-800">{advocate.fullName || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-800">{advocate.email || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-800">{advocate.phoneNumber || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">WhatsApp</label>
                <p className="text-gray-800">{advocate.whatsappNumber || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Bar Council Number</label>
                <p className="text-gray-800">{advocate.barCouncilNumber || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${advocate.status === 'active' ? 'bg-green-100 text-green-800' :
                  advocate.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    advocate.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                  }`}>
                  {advocate.status?.charAt(0).toUpperCase() + advocate.status?.slice(1) || "N/A"}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Specialization</label>
                <p className="text-gray-800">
                  {Array.isArray(advocate.specialization)
                    ? advocate.specialization.join(', ')
                    : advocate.specialization || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Experience (Years)</label>
                <p className="text-gray-800">{advocate.experience || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Residential Address */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Residential Address</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-gray-800">{advocate.residentialAddress?.address || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">City</label>
                <p className="text-gray-800">{advocate.residentialAddress?.city || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">State</label>
                <p className="text-gray-800">{advocate.residentialAddress?.state || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Country</label>
                <p className="text-gray-800">{advocate.residentialAddress?.country || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Office Address */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Office Address</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Office Address</label>
                <p className="text-gray-800">{advocate.officeAddress?.address || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Office City</label>
                <p className="text-gray-800">{advocate.officeAddress?.city || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Office State</label>
                <p className="text-gray-800">{advocate.officeAddress?.state || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Office Country</label>
                <p className="text-gray-800">{advocate.officeAddress?.country || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Branch</label>
                <p className="text-gray-800">{advocate.officeAddress?.branch || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Professional Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Practice Type</label>
                <p className="text-gray-800">
                  {advocate.practiceType ?
                    advocate.practiceType.charAt(0).toUpperCase() + advocate.practiceType.slice(1) :
                    "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Enrollment Year</label>
                <p className="text-gray-800">
                  {advocate.enrollmentYear
                    ? advocate.enrollmentYear
                    : advocate.enrollmentDate
                      ? new Date(advocate.enrollmentDate).getFullYear()
                      : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Aadhar Number</label>
                <p className="text-gray-800">{advocate.aadhar || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">License Number</label>
                <p className="text-gray-800">{advocate.license || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Qualifications */}
          {advocate.qualifications && advocate.qualifications.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Qualifications</h3>
              <div className="space-y-2">
                {advocate.qualifications.map((qual, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <p className="font-medium text-gray-800">{qual.degree || "N/A"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courts */}
          {advocate.courts && advocate.courts.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Courts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advocate.courts.map((court, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <p className="font-medium text-gray-800">{court.courtName || "N/A"}</p>
                    <p className="text-sm text-gray-600">
                      Type: {court.courtType ?
                        court.courtType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) :
                        "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing Details */}
          {advocate.billingDetails && (
            <div className="bg-gray-50 p-4 rounded-lg border md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Billing Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">PAN Number</label>
                  <p className="text-gray-800">{advocate.billingDetails.panNumber || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">GST Number</label>
                  <p className="text-gray-800">{advocate.billingDetails.gstNumber || "N/A"}</p>
                </div>
                {advocate.billingDetails.bankDetails && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Bank Name</label>
                      <p className="text-gray-800">{advocate.billingDetails.bankDetails.bankName || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Account Holder Name</label>
                      <p className="text-gray-800">{advocate.billingDetails.bankDetails.accountHolderName || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Account Number</label>
                      <p className="text-gray-800">{advocate.billingDetails.bankDetails.accountNumber || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">IFSC Code</label>
                      <p className="text-gray-800">{advocate.billingDetails.bankDetails.ifscCode || "N/A"}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          {advocate.documents && (
            <div className="bg-gray-50 p-4 rounded-lg border md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {advocate.documents.panFile && (
                  <div className="bg-white p-3 rounded border hover:shadow-md transition-shadow">
                    <label className="text-sm font-medium text-gray-600 block mb-2">PAN Card</label>
                    <button
                      onClick={() => openDocumentModal('panFile', advocate.documents.panFile)}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      View Document
                    </button>
                  </div>
                )}

                {advocate.documents.gstFile && (
                  <div className="bg-white p-3 rounded border hover:shadow-md transition-shadow">
                    <label className="text-sm font-medium text-gray-600 block mb-2">GST Certificate</label>
                    <button
                      onClick={() => openDocumentModal('gstFile', advocate.documents.gstFile)}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      View Document
                    </button>
                  </div>
                )}

                {advocate.documents.photoIdProof && (
                  <div className="bg-white p-3 rounded border hover:shadow-md transition-shadow">
                    <label className="text-sm font-medium text-gray-600 block mb-2">Aadhar Card</label>
                    <button
                      onClick={() => openDocumentModal('photoIdProof', advocate.documents.photoIdProof)}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      View Document
                    </button>
                  </div>
                )}

                {advocate.documents.addressProof && (
                  <div className="bg-white p-3 rounded border hover:shadow-md transition-shadow">
                    <label className="text-sm font-medium text-gray-600 block mb-2">Licencse</label>
                    <button
                      onClick={() => openDocumentModal('addressProof', advocate.documents.addressProof)}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      View Document
                    </button>
                  </div>
                )}

                {advocate.documents.barCouncilCertificate && (
                  <div className="bg-white p-3 rounded border hover:shadow-md transition-shadow">
                    <label className="text-sm font-medium text-gray-600 block mb-2">Bar Council Certificate</label>
                    <button
                      onClick={() => openDocumentModal('barCouncilCertificate', advocate.documents.barCouncilCertificate)}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      View Document
                    </button>
                  </div>
                )}

                {advocate.documents.enrollmentCertificate && (
                  <div className="bg-white p-3 rounded border hover:shadow-md transition-shadow">
                    <label className="text-sm font-medium text-gray-600 block mb-2">Enrollment Certificate</label>
                    <button
                      onClick={() => openDocumentModal('enrollmentCertificate', advocate.documents.enrollmentCertificate)}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      View Document
                    </button>
                  </div>
                )}

                {advocate.documents.qualificationCertificates && advocate.documents.qualificationCertificates.length > 0 && (
                  <div className="bg-white p-3 rounded border hover:shadow-md transition-shadow">
                    <label className="text-sm font-medium text-gray-600 block mb-2">Qualification Certificates ({advocate.documents.qualificationCertificates.length})</label>
                    <div className="space-y-1">
                      {advocate.documents.qualificationCertificates.map((cert, index) => (
                        <button
                          key={index}
                          onClick={() => openDocumentModal('qualificationCertificate', cert)}
                          className="text-blue-600 hover:text-blue-800 text-xs underline block"
                        >
                          Certificate {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {advocate.documents.otherDocuments && advocate.documents.otherDocuments.length > 0 && (
                  <div className="bg-white p-3 rounded border hover:shadow-md transition-shadow">
                    <label className="text-sm font-medium text-gray-600 block mb-2">Other Documents ({advocate.documents.otherDocuments.length})</label>
                    <div className="space-y-1">
                      {advocate.documents.otherDocuments.map((doc, index) => (
                        <button
                          key={index}
                          onClick={() => openDocumentModal('otherDocument', doc)}
                          className="text-blue-600 hover:text-blue-800 text-xs underline block"
                        >
                          Document {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="bg-gray-50 p-4 rounded-lg border md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Availability</label>
                <p className="text-gray-800">
                  {advocate.availability ?
                    advocate.availability.charAt(0).toUpperCase() + advocate.availability.slice(1) :
                    "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">UPI ID</label>
                <p className="text-gray-800">{advocate.upi || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Remarks</label>
                <p className="text-gray-800">{advocate.remarks || "N/A"}</p>
              </div>
              {advocate.communicationPreferences && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 block mb-2">Communication Preferences</label>
                  <div className="flex flex-wrap gap-4">
                    <span className={`flex items-center ${advocate.communicationPreferences.email ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={`w-3 h-3 rounded-full mr-2 ${advocate.communicationPreferences.email ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Email
                    </span>
                    <span className={`flex items-center ${advocate.communicationPreferences.sms ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={`w-3 h-3 rounded-full mr-2 ${advocate.communicationPreferences.sms ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      SMS
                    </span>
                    <span className={`flex items-center ${advocate.communicationPreferences.whatsapp ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={`w-3 h-3 rounded-full mr-2 ${advocate.communicationPreferences.whatsapp ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      WhatsApp
                    </span>
                    <span className={`flex items-center ${advocate.communicationPreferences.phone ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={`w-3 h-3 rounded-full mr-2 ${advocate.communicationPreferences.phone ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Phone
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate(`/admin/create-advocate`, { state: { editData: advocate } })}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Edit Advocate
          </button>
        </div>
      </div>

      {/* Document Preview Modal */}
      {docModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Document: {selectedDoc.type}</h3>
              <button 
                onClick={closeDocumentModal}
                className="text-3xl hover:text-red-600 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-8 flex flex-col items-center">
              <div className="mb-4 w-full">
            
              </div>
              
              {selectedDoc.url ? (
                selectedDoc.url.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                  <img 
                    src={selectedDoc.url} 
                    alt={selectedDoc.type} 
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      console.error("Failed to load image:", selectedDoc.url);
                      e.target.alt = "Failed to load image";
                      e.target.className = "max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg bg-red-50 p-8";
                      e.target.innerHTML = ''; // Clear image
                      e.target.parentElement.innerHTML = `
                        <div class="text-center p-8">
                          <div class="text-6xl mb-4">📄</div>
                          <p class="text-lg text-gray-700 mb-4">Cannot display image preview</p>
                          <a href="${selectedDoc.url}" target="_blank" rel="noopener noreferrer" 
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block">
                            Open Document Directly
                          </a>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="text-8xl mb-6">📄</div>
                    <p className="text-lg text-gray-700 mb-6">This document cannot be previewed in browser</p>
                    <a 
                      href={selectedDoc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg inline-block"
                    >
                      Open Document
                    </a>
                  </div>
                )
              ) : (
                <div className="text-center p-8">
                  <div className="text-6xl mb-4 text-red-500">❌</div>
                  <p className="text-lg text-gray-700 mb-4">Document URL could not be generated</p>
                  <p className="text-sm text-gray-600">Path: {selectedDoc.path}</p>
                </div>
              )}
              
          
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewAdvocate;