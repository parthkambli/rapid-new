

// // src/pages/Admin/Experts/ExpertList.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../../components/mainComponents/Table";
// import { Link } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";


// // Modal Component - Full Updated Version
// const ExpertViewModal = ({ expert, isOpen, onClose }) => {
//   if (!isOpen || !expert) return null;

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Format communication preferences
//   const getCommunicationPrefs = () => {
//     if (!expert.communicationPreferences) return 'Not specified';

//     const prefs = expert.communicationPreferences;
//     const activePrefs = [];

//     if (prefs.email) activePrefs.push('Email');
//     if (prefs.sms) activePrefs.push('SMS');
//     if (prefs.whatsapp) activePrefs.push('WhatsApp');
//     if (prefs.phone) activePrefs.push('Phone');

//     return activePrefs.length > 0 ? activePrefs.join(', ') : 'None';
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Modal Header */}
//         <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <div className="bg-[#398C89] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
//               {expert.fullName?.charAt(0) || 'E'}
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-gray-800">{expert.fullName}</h3>
//               <div className="flex flex-col md:flex-row items-center gap-3">
//                 <p className="text-sm text-gray-600">ID: {expert.expertId || expert._id}</p>
//                 <span className={`px-2 py-1 rounded text-xs font-medium ${expert.status === 'active' ? 'bg-green-100 text-green-800' :
//                   expert.status === 'inactive' ? 'bg-red-100 text-red-800' :
//                     expert.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-gray-100 text-gray-800'
//                   }`}>
//                   {expert.status?.toUpperCase() || 'ACTIVE'}
//                 </span>
//                 <span className={`px-2 py-1 rounded text-xs font-medium ${expert.availability === 'available' ? 'bg-blue-100 text-blue-800' :
//                   expert.availability === 'unavailable' ? 'bg-gray-100 text-gray-800' :
//                     'bg-orange-100 text-orange-800'
//                   }`}>
//                   {expert.availability?.toUpperCase() || 'N/A'}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-2xl"
//           >
//             &times;
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="p-6">
//           {/* Three Column Layout for Main Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             {/* Column 1: Personal Information */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                 Personal Information
//               </h4>

//               <div className="space-y-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Email</span>
//                   <span className="text-gray-900">{expert.email || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Phone Number</span>
//                   <span className="text-gray-900">{expert.phoneNumber || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">WhatsApp</span>
//                   <span className="text-gray-900">{expert.whatsappNumber || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Gender</span>
//                   <span className="text-gray-900">{expert.gender || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Column 2: Professional Information */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                 Professional Information
//               </h4>

//               <div className="space-y-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Organization</span>
//                   <span className="text-gray-900">{expert.organizationName || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Designation</span>
//                   <span className="text-gray-900">{expert.designation || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Qualification</span>
//                   <span className="text-gray-900">{expert.qualification || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Experience</span>
//                   <span className="text-gray-900">{expert.experience || 0} years</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">License Number</span>
//                   <span className="text-gray-900">{expert.licenseNumber || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Column 3: Performance & Communication */}
//             {/* <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                 Performance & Communication
//               </h4>
              
//               <div className="space-y-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Rating</span>
//                   <div className="flex items-center gap-1">
//                     <span className="text-yellow-500">★</span>
//                     <span className="text-gray-900">{expert.rating?.toFixed(1) || '0.0'}/5.0</span>
//                   </div>
//                 </div>
                
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Total Consultations</span>
//                   <span className="text-gray-900">{expert.totalConsultations || 0}</span>
//                 </div>
                
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Completed</span>
//                   <span className="text-gray-900">{expert.completedConsultations || 0}</span>
//                 </div>
                
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Communication Pref.</span>
//                   <span className="text-gray-900">{getCommunicationPrefs()}</span>
//                 </div>
//               </div>
//             </div> */}
//           </div>

//           {/* Full Width Sections */}

//           {/* Expertise Section */}
//           {expert.expertise && expert.expertise.length > 0 && (
//             <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-800 mb-3">Areas of Expertise</h4>
//               <div className="flex flex-wrap gap-2">
//                 {expert.expertise.map((exp, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
//                   >
//                     {exp}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Address Section */}
//           <div className="mb-6 p-4 bg-green-50 rounded-lg">
//             <h4 className="text-lg font-semibold text-gray-800 mb-3">Office Address</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium text-gray-600">Address</span>
//                 <span className="text-gray-900">
//                   {expert.officeAddress?.address || 'N/A'}
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">City</span>
//                   <span className="text-gray-900">{expert.officeAddress?.city || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">State</span>
//                   <span className="text-gray-900">{expert.officeAddress?.state || 'N/A'}</span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Pincode</span>
//                   <span className="text-gray-900">{expert.officeAddress?.pinCode || expert.officeAddress?.pincode || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Country</span>
//                   <span className="text-gray-900">{expert.officeAddress?.country || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Specializations Section */}
//           {expert.specializations && expert.specializations.length > 0 && (
//             <div className="mb-6 p-4 bg-purple-50 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-800 mb-3">Specializations</h4>
//               <div className="flex flex-wrap gap-2">
//                 {expert.specializations.map((spec, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
//                   >
//                     {spec}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Notes Sections */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Remarks */}
//             {expert.remarks && (
//               <div className="p-4 bg-yellow-50 rounded-lg">
//                 <h4 className="text-lg font-semibold text-gray-800 mb-2">Bank Details & Remarks</h4>
//                 <p className="text-gray-700 whitespace-pre-line">{expert.remarks}</p>
//               </div>
//             )}

//             {/* Special Notes */}
//             {expert.specialNotes && (
//               <div className="p-4 bg-orange-50 rounded-lg">
//                 <h4 className="text-lg font-semibold text-gray-800 mb-2">Special Notes</h4>
//                 <p className="text-gray-700 whitespace-pre-line">{expert.specialNotes}</p>
//               </div>
//             )}
//           </div>

//           {/* Metadata Section */}
//           <div className="mt-8 pt-6 border-t border-gray-200">
//             <div className="grid  grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
//               <div className="flex flex-col md:ml-6 ml-[10px]">
//                 <span className="font-medium">Created By</span>
//                 <span className="text-gray-900">
//                   {expert.createdBy?.fullName || 'Admin User'}
//                 </span>
//               </div>

//               <div className="flex flex-col">
//                 <span className="font-medium">Created On</span>
//                 <span className="text-gray-900">{formatDate(expert.createdAt)}</span>
//               </div>

//               <div className="flex flex-col md:ml-2 ml-[10px]">
//                 <span className="font-medium ">Last Updated</span>
//                 <span className="text-gray-900">{formatDate(expert.updatedAt)}</span>
//               </div>

//               {/* <div className="flex flex-col">
//                 <span className="font-medium">Assigned Cases</span>
//                 <span className="text-gray-900">{expert.assignedCases?.length || 0}</span>
//               </div> */}
//             </div>
//           </div>




//           {/* // Modal Component mein documents display */}
//           {expert.documents && (
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-800 mb-3">Documents</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                 {expert.documents.medicalDegreeCertificate && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-600">Medical Degree:</span>
//                     <a
//                       href={expert.documents.medicalDegreeCertificate}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline cursor-pointer hover:text-blue-800"
//                     >
//                       View
//                     </a>
//                   </div>
//                 )}

//                 {expert.documents.barCouncilCertificate && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-600">Bar Council Certificate:</span>
//                     <a
//                       href={expert.documents.barCouncilCertificate}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline cursor-pointer hover:text-blue-800"
//                     >
//                       View
//                     </a>
//                   </div>
//                 )}

//                 {expert.documents.idProof && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-600">ID Proof:</span>
//                     <a
//                       href={expert.documents.idProof}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline cursor-pointer hover:text-blue-800"
//                     >
//                       View
//                     </a>
//                   </div>
//                 )}

//                 {expert.documents.photo && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-600">Photo:</span>
//                     <a
//                       href={expert.documents.photo}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline cursor-pointer hover:text-blue-800"
//                     >
//                       View
//                     </a>
//                   </div>
//                 )}

//                 {expert.documents.addressProof && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-600">Address Proof:</span>
//                     <a
//                       href={expert.documents.addressProof}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline cursor-pointer hover:text-blue-800"
//                     >
//                       View
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}


//         </div>

//         {/* Modal Footer */}
//         <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between items-center">
//           <div className="text-sm text-gray-500">
//             Expert ID: <span className="font-medium text-gray-700">{expert.expertId || expert._id}</span>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// const ExpertList = () => {
//   const navigate = useNavigate();
//   const [experts, setExperts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchName, setSearchName] = useState("");
//   const [searchStatus, setSearchStatus] = useState("All");
//   const [searchExpertise, setSearchExpertise] = useState("All");
//   const [searchCity, setSearchCity] = useState("");

//   // Modal state
//   const [selectedExpert, setSelectedExpert] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Fetch experts from API
//   const fetchExperts = async (searchParams = {}) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = {
//         page: 1,
//         limit: 100,
//         ...searchParams
//       };

//       // Use list endpoint with all params
//       const response = await apiClient.get(apiEndpoints.experts.list, { params });
//       setExperts(response.data.data || []);
//     } catch (err) {
//       console.error('Error fetching experts:', err);
//       setError(err.response?.data?.message || 'Failed to fetch experts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExperts();
//   }, []);

//   // Handle search
//   useEffect(() => {
//     const searchParams = {};

//     if (searchName) {
//       searchParams.search = searchName;
//     }
//     if (searchStatus !== "All") {
//       searchParams.status = searchStatus.toLowerCase();
//     }
//     if (searchExpertise !== "All") {
//       searchParams.expertise = searchExpertise;
//     }
//     if (searchCity) {
//       searchParams.city = searchCity;
//     }

//     const timeoutId = setTimeout(() => {
//       fetchExperts(searchParams);
//     }, 500);

//     return () => clearTimeout(timeoutId);
//   }, [searchName, searchStatus, searchExpertise, searchCity]);

//   const handleDelete = async (row) => {
//     if (!window.confirm(`Are you sure you want to delete ${row.fullName}?`)) return;

//     try {
//       setLoading(true);
//       await apiClient.delete(apiEndpoints.experts.delete(row._id || row.id));
//       await fetchExperts(); // Refresh the list
//     } catch (err) {
//       console.error('Error deleting expert:', err);
//       setError(err.response?.data?.message || 'Failed to delete expert');
//       alert(err.response?.data?.message || 'Failed to delete expert');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (row) => {
//     // Original data (not flattened) find karenge
//     const originalExpert = experts.find(exp =>
//       (exp._id || exp.id) === (row._id || row.id)
//     ) || row;
//     navigate(`/admin/create-expert`, { state: { editData: originalExpert } });
//   };

//   // NEW: Handle View with Modal
//   const handleView = (row) => {
//     // Original data (not flattened) find karenge
//     const originalExpert = experts.find(exp =>
//       (exp._id || exp.id) === (row._id || row.id)
//     ) || row;

//     setSelectedExpert(originalExpert);
//     setIsModalOpen(true);
//   };

//   // Modal close handler
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedExpert(null);
//   };

//   // Flatten expert data for Table component (similar to EmployeeList)
//   const flattenedExperts = experts.map(expert => {
//     const {
//       officeAddress,
//       specializations,
//       assignedCases,
//       documents,
//       communicationPreferences,
//       ...simpleData
//     } = expert;

//     // Format DOB to DD-MM-YYYY
//     const formatDOB = (dateString) => {
//       if (!dateString) return '';
//       // Check if it's already in the expected format
//       if (dateString.includes('-') && dateString.includes(':')) {
//         // It's an ISO string like "2000-01-01T00:00:00.000Z"
//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) return ''; // Invalid date
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
//         const year = date.getFullYear();
//         return `${day}-${month}-${year}`;
//       }
//       return dateString; // Return as is if already formatted
//     };

//     return {
//       ...simpleData,
//       city: officeAddress?.city || '',
//       expertise: Array.isArray(simpleData.expertise) ? simpleData.expertise.join(', ') : simpleData.expertise || '',
//       status: simpleData.status || 'active',
//       dob: formatDOB(simpleData.dob)
//     };
//   });

//   const filteredExperts = flattenedExperts;

//   return (
//     <div className="max-w-[79vw]  mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Expert List</h2>
//         <div className="flex gap-3">

//           <Link
//             to="/admin/create-expert-bill"

//           >
//             <button
//               // onClick={() => alert("Create Expert Bill")}
//               className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium"
//             >
//               Create Expert Bill
//             </button>
//           </Link>
//           <Link
//             to="/admin/expert-bills"

//           >
//             <button
//               // onClick={() => alert("Create Expert Bill")}
//               className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium"
//             >
//               View Expert Bill
//             </button>
//           </Link>

//           <Link
//             to="/admin/create-expert"

//           >
//             <button

//               className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium"
//             >
//               Create Expert List
//             </button>
//           </Link>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {/* Loading State */}
//       {loading && (
//         <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
//           Loading experts...
//         </div>
//       )}

//       {/* Filters */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Search By Name"
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//         />
//         <select
//           value={searchExpertise}
//           onChange={(e) => setSearchExpertise(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//         >
//           <option value="All">All Expertise</option>
//           <option value="Medical Negligence">Medical Negligence</option>
//           <option value="Compensation / Assessment">Compensation / Assessment</option>
//           <option value="Consent & Documentation">Consent & Documentation</option>
//           <option value="Forensic Medicine">Forensic Medicine</option>
//           <option value="Criminal Cases">Criminal Cases</option>
//           <option value="Insurance / Audits">Insurance / Audits</option>
//           <option value="Consumer Court Cases">Consumer Court Cases</option>
//           <option value="Expert Witness">Expert Witness</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Search By City"
//           value={searchCity}
//           onChange={(e) => setSearchCity(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//         />
//         <button
//           onClick={() => {
//             setSearchName("");
//             setSearchExpertise("All");
//             setSearchCity("");
//           }}
//           className="p-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
//         >
//           Clear Filters
//         </button>
//       </div>

//       {/* Table - Using Your Table Component */}
//       {filteredExperts.length === 0 && !loading ? (
//         <div className="text-center py-8 text-gray-500">
//           No experts found. {searchName || searchStatus !== "All" || searchExpertise !== "All" ? "Try adjusting your filters." : ""}
//         </div>
//       ) : (
//         <Table
//           data={filteredExperts}
//           extraColumns={[
//             {
//               header: "Actions",
//               render: (row) => (
//                 <div className="flex gap-2 justify-center">
//                   <button
//                     onClick={() => handleView(row)}
//                     className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
//                   >
//                     View
//                   </button>
//                   <button
//                     onClick={() => handleEdit(row)}
//                     className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(row)}
//                     className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ),
//             },
//           ]}
//           excludeColumns={['createdAt', 'updatedAt', 'user', 'specialNotes', 'remarks', 'rating', 'totalConsultations', 'completedConsultations', 'availability', 'licenseNumber', 'qualification', 'designation', 'organizationName', 'phoneNumber', 'whatsappNumber', 'documents', 'expertise', 'officeAddress', 'communicationPreferences', 'assignedCases']}
//           columnOrder={['expertId', 'fullName', 'gender', 'dob', 'city', 'experience', 'email']}
//           pagination={true}
//         />
//       )}

//       {/* View Modal */}
//       <ExpertViewModal
//         expert={selectedExpert}
//         isOpen={isModalOpen}
//         onClose={closeModal}
//       />
//     </div>
//   );
// };

// export default ExpertList;









// // src/pages/Admin/Experts/ExpertList.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../../components/mainComponents/Table";
// import { Link } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";


// // Modal Component - Full Updated Version
// const ExpertViewModal = ({ expert, isOpen, onClose }) => {
//   if (!isOpen || !expert) return null;

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Format communication preferences
//   const getCommunicationPrefs = () => {
//     if (!expert.communicationPreferences) return 'Not specified';

//     const prefs = expert.communicationPreferences;
//     const activePrefs = [];

//     if (prefs.email) activePrefs.push('Email');
//     if (prefs.sms) activePrefs.push('SMS');
//     if (prefs.whatsapp) activePrefs.push('WhatsApp');
//     if (prefs.phone) activePrefs.push('Phone');

//     return activePrefs.length > 0 ? activePrefs.join(', ') : 'None';
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Modal Header */}
//         <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <div className="bg-[#398C89] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
//               {expert.fullName?.charAt(0) || 'E'}
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-gray-800">{expert.fullName}</h3>
//               <div className="flex items-center gap-3">
//                 <p className="text-sm text-gray-600">ID: {expert.expertId || expert._id}</p>
//                 <span className={`px-2 py-1 rounded text-xs font-medium ${
//                   expert.status === 'active' ? 'bg-green-100 text-green-800' :
//                   expert.status === 'inactive' ? 'bg-red-100 text-red-800' :
//                   expert.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
//                   'bg-gray-100 text-gray-800'
//                 }`}>
//                   {expert.status?.toUpperCase() || 'ACTIVE'}
//                 </span>
//                 <span className={`px-2 py-1 rounded text-xs font-medium ${
//                   expert.availability === 'available' ? 'bg-blue-100 text-blue-800' :
//                   expert.availability === 'unavailable' ? 'bg-gray-100 text-gray-800' :
//                   'bg-orange-100 text-orange-800'
//                 }`}>
//                   {expert.availability?.toUpperCase() || 'N/A'}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-2xl"
//           >
//             &times;
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="p-6">
//           {/* Three Column Layout for Main Info */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             {/* Column 1: Personal Information */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                 Personal Information
//               </h4>

//               <div className="space-y-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Email</span>
//                   <span className="text-gray-900">{expert.email || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Phone Number</span>
//                   <span className="text-gray-900">{expert.phoneNumber || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">WhatsApp</span>
//                   <span className="text-gray-900">{expert.whatsappNumber || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Gender</span>
//                   <span className="text-gray-900">{expert.gender || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Column 2: Professional Information */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                 Professional Information
//               </h4>

//               <div className="space-y-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Organization</span>
//                   <span className="text-gray-900">{expert.organizationName || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Designation</span>
//                   <span className="text-gray-900">{expert.designation || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Qualification</span>
//                   <span className="text-gray-900">{expert.qualification || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Experience</span>
//                   <span className="text-gray-900">{expert.experience || 0} years</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">License Number</span>
//                   <span className="text-gray-900">{expert.licenseNumber || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Column 3: Performance & Communication */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                 Performance & Communication
//               </h4>

//               <div className="space-y-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Rating</span>
//                   <div className="flex items-center gap-1">
//                     <span className="text-yellow-500">★</span>
//                     <span className="text-gray-900">{expert.rating?.toFixed(1) || '0.0'}/5.0</span>
//                   </div>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Total Consultations</span>
//                   <span className="text-gray-900">{expert.totalConsultations || 0}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Completed</span>
//                   <span className="text-gray-900">{expert.completedConsultations || 0}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Communication Pref.</span>
//                   <span className="text-gray-900">{getCommunicationPrefs()}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Full Width Sections */}

//           {/* Expertise Section */}
//           {expert.expertise && expert.expertise.length > 0 && (
//             <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-800 mb-3">Areas of Expertise</h4>
//               <div className="flex flex-wrap gap-2">
//                 {expert.expertise.map((exp, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
//                   >
//                     {exp}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Address Section */}
//           <div className="mb-6 p-4 bg-green-50 rounded-lg">
//             <h4 className="text-lg font-semibold text-gray-800 mb-3">Office Address</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium text-gray-600">Address</span>
//                 <span className="text-gray-900">
//                   {expert.officeAddress?.address || 'N/A'}
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">City</span>
//                   <span className="text-gray-900">{expert.officeAddress?.city || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">State</span>
//                   <span className="text-gray-900">{expert.officeAddress?.state || 'N/A'}</span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Pincode</span>
//                   <span className="text-gray-900">{expert.officeAddress?.pinCode || expert.officeAddress?.pincode || 'N/A'}</span>
//                 </div>

//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-600">Country</span>
//                   <span className="text-gray-900">{expert.officeAddress?.country || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Specializations Section */}
//           {expert.specializations && expert.specializations.length > 0 && (
//             <div className="mb-6 p-4 bg-purple-50 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-800 mb-3">Specializations</h4>
//               <div className="flex flex-wrap gap-2">
//                 {expert.specializations.map((spec, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
//                   >
//                     {spec}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Notes Sections */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Remarks */}
//             {expert.remarks && (
//               <div className="p-4 bg-yellow-50 rounded-lg">
//                 <h4 className="text-lg font-semibold text-gray-800 mb-2">Bank Details & Remarks</h4>
//                 <p className="text-gray-700 whitespace-pre-line">{expert.remarks}</p>
//               </div>
//             )}

//             {/* Special Notes */}
//             {expert.specialNotes && (
//               <div className="p-4 bg-orange-50 rounded-lg">
//                 <h4 className="text-lg font-semibold text-gray-800 mb-2">Special Notes</h4>
//                 <p className="text-gray-700 whitespace-pre-line">{expert.specialNotes}</p>
//               </div>
//             )}
//           </div>

//           {/* Metadata Section */}
//           <div className="mt-8 pt-6 border-t border-gray-200">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
//               <div className="flex flex-col">
//                 <span className="font-medium">Created By</span>
//                 <span className="text-gray-900">
//                   {expert.createdBy?.fullName || 'Admin User'}
//                 </span>
//               </div>

//               <div className="flex flex-col">
//                 <span className="font-medium">Created On</span>
//                 <span className="text-gray-900">{formatDate(expert.createdAt)}</span>
//               </div>

//               <div className="flex flex-col">
//                 <span className="font-medium">Last Updated</span>
//                 <span className="text-gray-900">{formatDate(expert.updatedAt)}</span>
//               </div>

//               <div className="flex flex-col">
//                 <span className="font-medium">Assigned Cases</span>
//                 <span className="text-gray-900">{expert.assignedCases?.length || 0}</span>
//               </div>
//             </div>
//           </div>

//           {/* Documents Section (if available) */}
//           {expert.documents && Object.keys(expert.documents).length > 0 && (
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//               <h4 className="text-lg font-semibold text-gray-800 mb-3">Documents</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                 {expert.documents.qualificationCertificate && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-600">Qualification Certificate:</span>
//                     <span className="text-blue-600 underline cursor-pointer">View</span>
//                   </div>
//                 )}

//                 {expert.documents.licenseCertificate && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-600">License Certificate:</span>
//                     <span className="text-blue-600 underline cursor-pointer">View</span>
//                   </div>
//                 )}

//                 {expert.documents.photoIdProof && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-600">Photo ID Proof:</span>
//                     <span className="text-blue-600 underline cursor-pointer">View</span>
//                   </div>
//                 )}

//                 {expert.documents.addressProof && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-600">Address Proof:</span>
//                     <span className="text-blue-600 underline cursor-pointer">View</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Modal Footer */}
//         <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between items-center">
//           <div className="text-sm text-gray-500">
//             Expert ID: <span className="font-medium text-gray-700">{expert.expertId || expert._id}</span>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// const ExpertList = () => {
//   const navigate = useNavigate();
//   const [experts, setExperts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchName, setSearchName] = useState("");
//   const [searchStatus, setSearchStatus] = useState("All");
//   const [searchExpertise, setSearchExpertise] = useState("All");
//   const [searchCity, setSearchCity] = useState("");

//   // Modal state
//   const [selectedExpert, setSelectedExpert] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Fetch experts from API
//   const fetchExperts = async (searchParams = {}) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = {
//         page: 1,
//         limit: 100,
//         ...searchParams
//       };

//       // Use search endpoint if there's a search query
//       if (searchParams.q) {
//         const response = await apiClient.get(apiEndpoints.experts.search, { params });
//         setExperts(response.data.data || []);
//       } else {
//         const response = await apiClient.get(apiEndpoints.experts.list, { params });
//         setExperts(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching experts:', err);
//       setError(err.response?.data?.message || 'Failed to fetch experts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExperts();
//   }, []);

//   // Handle search
//   useEffect(() => {
//     const searchParams = {};

//     if (searchName) {
//       searchParams.q = searchName;
//     }
//     if (searchStatus !== "All") {
//       searchParams.status = searchStatus.toLowerCase();
//     }
//     if (searchExpertise !== "All") {
//       searchParams.expertise = searchExpertise;
//     }

//     const timeoutId = setTimeout(() => {
//       if (searchName) {
//         fetchExperts({ q: searchName });
//       } else {
//         fetchExperts(searchParams);
//       }
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [searchName, searchStatus, searchExpertise]);

//   const handleDelete = async (row) => {
//     if (!window.confirm(`Are you sure you want to delete ${row.fullName}?`)) return;

//     try {
//       setLoading(true);
//       await apiClient.delete(apiEndpoints.experts.delete(row._id || row.id));
//       await fetchExperts(); // Refresh the list
//     } catch (err) {
//       console.error('Error deleting expert:', err);
//       setError(err.response?.data?.message || 'Failed to delete expert');
//       alert(err.response?.data?.message || 'Failed to delete expert');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (row) => {
//     navigate(`/Superadmin/create-expert`, { state: { editData: row } });
//   };

//   // NEW: Handle View with Modal
//   const handleView = (row) => {
//     // Original data (not flattened) find karenge
//     const originalExpert = experts.find(exp => 
//       (exp._id || exp.id) === (row._id || row.id)
//     ) || row;

//     setSelectedExpert(originalExpert);
//     setIsModalOpen(true);
//   };

//   // Modal close handler
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedExpert(null);
//   };

//   // Flatten expert data for Table component (similar to EmployeeList)
//   const flattenedExperts = experts.map(expert => {
//     const {
//       officeAddress,
//       specializations,
//       assignedCases,
//       documents,
//       communicationPreferences,
//       ...simpleData
//     } = expert;

//     return {
//       ...simpleData,
//       city: officeAddress?.city || '',
//       expertise: Array.isArray(simpleData.expertise) ? simpleData.expertise.join(', ') : simpleData.expertise || '',
//       status: simpleData.status || 'active'
//     };
//   });

//   // Filter experts by city if searchCity is set
//   const filteredExperts = searchCity
//     ? flattenedExperts.filter(exp =>
//         exp.city?.toLowerCase().includes(searchCity.toLowerCase())
//       )
//     : flattenedExperts;

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Expert List</h2>
//         <div className="flex gap-3">

//            <Link
//             to="/Superadmin/create-expert-bill"

//             >
//           <button
//             // onClick={() => alert("Create Expert Bill")}
//             className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium"
//           >
//             Create Expert Bill
//           </button>
//        </Link>

//             <Link
//             to="/Superadmin/create-expert"

//             >
//           <button

//             className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium"
//           >
//             Create Expert List
//           </button>
//           </Link>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {/* Loading State */}
//       {loading && (
//         <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
//           Loading experts...
//         </div>
//       )}

//       {/* Filters */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Search By Name"
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//         />
//         <select 
//           value={searchStatus}
//           onChange={(e) => setSearchStatus(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//         >
//           <option value="All">All Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//           <option value="busy">Busy</option>
//           <option value="unavailable">Unavailable</option>
//         </select>
//         <select 
//           value={searchExpertise}
//           onChange={(e) => setSearchExpertise(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//         >
//           <option value="All">All Expertise</option>
//           <option value="Medical Negligence">Medical Negligence</option>
//           <option value="Compensation / Assessment">Compensation / Assessment</option>
//           <option value="Consent & Documentation">Consent & Documentation</option>
//           <option value="Forensic Medicine">Forensic Medicine</option>
//           <option value="Criminal Cases">Criminal Cases</option>
//           <option value="Insurance / Audits">Insurance / Audits</option>
//           <option value="Consumer Court Cases">Consumer Court Cases</option>
//           <option value="Expert Witness">Expert Witness</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Search By City"
//           value={searchCity}
//           onChange={(e) => setSearchCity(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//         />
//       </div>

//       {/* Table - Using Your Table Component */}
//       {filteredExperts.length === 0 && !loading ? (
//         <div className="text-center py-8 text-gray-500">
//           No experts found. {searchName || searchStatus !== "All" || searchExpertise !== "All" ? "Try adjusting your filters." : ""}
//         </div>
//       ) : (
//         <Table
//           data={filteredExperts}
//           extraColumns={[
//             {
//               header: "Actions",
//               render: (row) => (
//                 <div className="flex gap-2 justify-center">
//                   <button
//                     onClick={() => handleView(row)}
//                     className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
//                   >
//                     View
//                   </button>
//                   <button
//                     onClick={() => handleEdit(row)}
//                     className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(row)}
//                     className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ),
//             },
//           ]}
//         />
//       )}

//       {/* View Modal */}
//       <ExpertViewModal
//         expert={selectedExpert}
//         isOpen={isModalOpen}
//         onClose={closeModal}
//       />
//     </div>
//   );
// };

// export default ExpertList;










// src/pages/Admin/Experts/ExpertList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/mainComponents/Table";
import { Link } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";


// Modal Component - Full Updated Version
const ExpertViewModal = ({ expert, isOpen, onClose }) => {
  if (!isOpen || !expert) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format communication preferences
  const getCommunicationPrefs = () => {
    if (!expert.communicationPreferences) return 'Not specified';

    const prefs = expert.communicationPreferences;
    const activePrefs = [];

    if (prefs.email) activePrefs.push('Email');
    if (prefs.sms) activePrefs.push('SMS');
    if (prefs.whatsapp) activePrefs.push('WhatsApp');
    if (prefs.phone) activePrefs.push('Phone');

    return activePrefs.length > 0 ? activePrefs.join(', ') : 'None';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#398C89] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
              {expert.fullName?.charAt(0) || 'E'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{expert.fullName}</h3>
              <div className="flex flex-col md:flex-row items-center gap-3">
                <p className="text-sm text-gray-600">ID: {expert.expertId || expert._id}</p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${expert.status === 'active' ? 'bg-green-100 text-green-800' :
                  expert.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    expert.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                  {expert.status?.toUpperCase() || 'ACTIVE'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${expert.availability === 'available' ? 'bg-blue-100 text-blue-800' :
                  expert.availability === 'unavailable' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                  {expert.availability?.toUpperCase() || 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Three Column Layout for Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Column 1: Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h4>

              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Email</span>
                  <span className="text-gray-900">{expert.email || 'N/A'}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Phone Number</span>
                  <span className="text-gray-900">{expert.phoneNumber || 'N/A'}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">WhatsApp</span>
                  <span className="text-gray-900">{expert.whatsappNumber || 'N/A'}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Gender</span>
                  <span className="text-gray-900">{expert.gender || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Professional Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Professional Information
              </h4>

              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Organization</span>
                  <span className="text-gray-900">{expert.organizationName || 'N/A'}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Designation</span>
                  <span className="text-gray-900">{expert.designation || 'N/A'}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Qualification</span>
                  <span className="text-gray-900">{expert.qualification || 'N/A'}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Experience</span>
                  <span className="text-gray-900">{expert.experience || 0} years</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">License Number</span>
                  <span className="text-gray-900">{expert.licenseNumber || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Column 3: Performance & Communication */}
            {/* <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Performance & Communication
              </h4>
              
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-900">{expert.rating?.toFixed(1) || '0.0'}/5.0</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Total Consultations</span>
                  <span className="text-gray-900">{expert.totalConsultations || 0}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Completed</span>
                  <span className="text-gray-900">{expert.completedConsultations || 0}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Communication Pref.</span>
                  <span className="text-gray-900">{getCommunicationPrefs()}</span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Full Width Sections */}

          {/* Expertise Section */}
          {expert.expertise && expert.expertise.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Areas of Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {expert.expertise.map((exp, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Address Section */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Office Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Address</span>
                <span className="text-gray-900">
                  {expert.officeAddress?.address || 'N/A'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">City</span>
                  <span className="text-gray-900">{expert.officeAddress?.city || 'N/A'}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">State</span>
                  <span className="text-gray-900">{expert.officeAddress?.state || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Pincode</span>
                  <span className="text-gray-900">{expert.officeAddress?.pinCode || expert.officeAddress?.pincode || 'N/A'}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">Country</span>
                  <span className="text-gray-900">{expert.officeAddress?.country || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specializations Section */}
          {expert.specializations && expert.specializations.length > 0 && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {expert.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Remarks */}
            {expert.remarks && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Bank Details & Remarks</h4>
                <p className="text-gray-700 whitespace-pre-line">{expert.remarks}</p>
              </div>
            )}

            {/* Special Notes */}
            {expert.specialNotes && (
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Special Notes</h4>
                <p className="text-gray-700 whitespace-pre-line">{expert.specialNotes}</p>
              </div>
            )}
          </div>

          {/* Metadata Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid  grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex flex-col md:ml-6 ml-[10px]">
                <span className="font-medium">Created By</span>
                <span className="text-gray-900">
                  {expert.createdBy?.fullName || 'Admin User'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium">Created On</span>
                <span className="text-gray-900">{formatDate(expert.createdAt)}</span>
              </div>

              <div className="flex flex-col md:ml-2 ml-[10px]">
                <span className="font-medium ">Last Updated</span>
                <span className="text-gray-900">{formatDate(expert.updatedAt)}</span>
              </div>

              {/* <div className="flex flex-col">
                <span className="font-medium">Assigned Cases</span>
                <span className="text-gray-900">{expert.assignedCases?.length || 0}</span>
              </div> */}
            </div>
          </div>




          {/* // Modal Component mein documents display */}
          {expert.documents && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {expert.documents.medicalDegreeCertificate && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Medical Degree:</span>
                    <a
                      href={expert.documents.medicalDegreeCertificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                    >
                      View
                    </a>
                  </div>
                )}

                {expert.documents.barCouncilCertificate && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Bar Council Certificate:</span>
                    <a
                      href={expert.documents.barCouncilCertificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                    >
                      View
                    </a>
                  </div>
                )}

                {expert.documents.idProof && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">ID Proof:</span>
                    <a
                      href={expert.documents.idProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                    >
                      View
                    </a>
                  </div>
                )}

                {expert.documents.photo && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Photo:</span>
                    <a
                      href={expert.documents.photo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                    >
                      View
                    </a>
                  </div>
                )}

                {expert.documents.addressProof && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Address Proof:</span>
                    <a
                      href={expert.documents.addressProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                    >
                      View
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}


        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Expert ID: <span className="font-medium text-gray-700">{expert.expertId || expert._id}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const ExpertList = () => {
  const navigate = useNavigate();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("All");
  const [searchExpertise, setSearchExpertise] = useState("All");
  const [searchCity, setSearchCity] = useState("");

  // Modal state
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch experts from API
  const fetchExperts = async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: 1,
        limit: 100,
        ...searchParams
      };

      // Use list endpoint with all params
      const response = await apiClient.get(apiEndpoints.experts.list, { params });
      setExperts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching experts:', err);
      setError(err.response?.data?.message || 'Failed to fetch experts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  // Handle search
  useEffect(() => {
    const searchParams = {};

    if (searchName) {
      searchParams.search = searchName;
    }
    if (searchStatus !== "All") {
      searchParams.status = searchStatus.toLowerCase();
    }
    if (searchExpertise !== "All") {
      searchParams.expertise = searchExpertise;
    }
    if (searchCity) {
      searchParams.city = searchCity;
    }

    const timeoutId = setTimeout(() => {
      fetchExperts(searchParams);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchName, searchStatus, searchExpertise, searchCity]);

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete ${row.fullName}?`)) return;

    try {
      setLoading(true);
      await apiClient.delete(apiEndpoints.experts.delete(row._id || row.id));
      await fetchExperts(); // Refresh the list
    } catch (err) {
      console.error('Error deleting expert:', err);
      setError(err.response?.data?.message || 'Failed to delete expert');
      alert(err.response?.data?.message || 'Failed to delete expert');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    // Original data (not flattened) find karenge
    const originalExpert = experts.find(exp =>
      (exp._id || exp.id) === (row._id || row.id)
    ) || row;
    navigate(`/admin/create-expert`, { state: { editData: originalExpert } });
  };

  // NEW: Handle View with Modal
  const handleView = (row) => {
    // Original data (not flattened) find karenge
    const originalExpert = experts.find(exp =>
      (exp._id || exp.id) === (row._id || row.id)
    ) || row;

    setSelectedExpert(originalExpert);
    setIsModalOpen(true);
  };

  // Modal close handler
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpert(null);
  };

  // Flatten expert data for Table component (similar to EmployeeList)
  const flattenedExperts = experts.map(expert => {
    const {
      officeAddress,
      specializations,
      assignedCases,
      documents,
      communicationPreferences,
      ...simpleData
    } = expert;

    // Format DOB to DD-MM-YYYY
    const formatDOB = (dateString) => {
      if (!dateString) return '';
      // Check if it's already in the expected format
      if (dateString.includes('-') && dateString.includes(':')) {
        // It's an ISO string like "2000-01-01T00:00:00.000Z"
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ''; // Invalid date
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
      return dateString; // Return as is if already formatted
    };

    return {
      ...simpleData,
      city: officeAddress?.city || '',
      expertise: Array.isArray(simpleData.expertise) ? simpleData.expertise.join(', ') : simpleData.expertise || '',
      status: simpleData.status || 'active',
      dob: formatDOB(simpleData.dob)
    };
  });

  const filteredExperts = flattenedExperts;

  return (
    <div className="max-w-[79vw]  mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Expert List</h2>
        <div className="flex gap-3">

          <Link
            to="/admin/create-expert-bill"

          >
            <button
              // onClick={() => alert("Create Expert Bill")}
              className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium"
            >
              Create Expert Bill
            </button>
          </Link>
          <Link
            to="/admin/expert-bills"

          >
            <button
              // onClick={() => alert("Create Expert Bill")}
              className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium"
            >
              View Expert Bill
            </button>
          </Link>

          <Link
            to="/admin/create-expert"

          >
            <button

              className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium"
            >
              Create Expert List
            </button>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Loading experts...
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <input
          type="text"
          placeholder="Search By Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        />
        <select
          value={searchExpertise}
          onChange={(e) => setSearchExpertise(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        >
          <option value="All">All Expertise</option>
          <option value="Medical Negligence">Medical Negligence</option>
          <option value="Compensation / Assessment">Compensation / Assessment</option>
          <option value="Consent & Documentation">Consent & Documentation</option>
          <option value="Forensic Medicine">Forensic Medicine</option>
          <option value="Criminal Cases">Criminal Cases</option>
          <option value="Insurance / Audits">Insurance / Audits</option>
          <option value="Consumer Court Cases">Consumer Court Cases</option>
          <option value="Expert Witness">Expert Witness</option>
        </select>
        <input
          type="text"
          placeholder="Search By City"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        />
        <button
          onClick={() => {
            setSearchName("");
            setSearchExpertise("All");
            setSearchCity("");
          }}
          className="p-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Table - Using Your Table Component */}
      {filteredExperts.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">
          No experts found. {searchName || searchStatus !== "All" || searchExpertise !== "All" ? "Try adjusting your filters." : ""}
        </div>
      ) : (
        <Table
          data={filteredExperts}
          extraColumns={[
            {
              header: "Actions",
              render: (row) => (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleView(row)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(row)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(row)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          excludeColumns={['createdAt', 'updatedAt', 'user', 'specialNotes', 'remarks', 'rating', 'totalConsultations', 'completedConsultations', 'availability', 'licenseNumber', 'qualification', 'designation', 'organizationName', 'phoneNumber', 'whatsappNumber', 'documents', 'expertise', 'officeAddress', 'communicationPreferences', 'assignedCases']}
          columnOrder={['expertId', 'fullName', 'gender', 'dob', 'city', 'experience', 'email']}
          pagination={true}
        />
      )}

      {/* View Modal */}
      <ExpertViewModal
        expert={selectedExpert}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default ExpertList;