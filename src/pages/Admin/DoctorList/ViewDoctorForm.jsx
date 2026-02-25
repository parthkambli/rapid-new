




























// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from "react-toastify";

// // Get API base URL for document serving (remove /api suffix)
// const getApiBaseUrl = () => {
//   try {
//     // Try to get from environment variable (Vite)
//     if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URI) {
//       const apiUrl = import.meta.env.VITE_API_URI;
//       return apiUrl.replace('/api', '');
//     }
//   } catch (e) {
//     // Fallback if import.meta is not available
//   }
//   // Default fallback
//   return 'http://localhost:3000';
// };

// // ================= IMAGE PREVIEW MODAL =================
// const ImagePreviewModal = ({ isOpen, onClose, preview }) => {
//   if (!isOpen || !preview) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
//       <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//         {/* Modal Header */}
//         <div className="flex items-center justify-between p-4 border-b bg-gray-50">
//           <h3 className="text-lg font-semibold text-gray-800">
//             Document Preview: {preview.name}
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
//           >
//             ×
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="p-4 overflow-auto max-h-[70vh]">
//           {preview.type?.startsWith('image/') ? (
//             <div className="flex flex-col items-center">
//               <img
//                 src={preview.url}
//                 alt={preview.name || 'Preview'}
//                 className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
//               />
//               <div className="mt-4 text-center">
//                 <p className="text-sm text-gray-600">
//                   File: {preview.name}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   Type: {preview.type} | Size: {(preview.size / 1024).toFixed(2)} KB
//                 </p>
//               </div>
//             </div>
//           ) : preview.type?.includes('pdf') ? (
//             <div className="flex flex-col items-center">
//               <div className="w-32 h-32 flex items-center justify-center bg-red-100 rounded-lg mb-4">
//                 <span className="text-4xl text-red-600">📄</span>
//               </div>
//               <p className="text-lg font-medium text-gray-700">PDF Document</p>
//               <p className="text-sm text-gray-600 mt-2">{preview.name}</p>
//               <a
//                 href={preview.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//               >
//                 <span className="mr-2">📂</span>
//                 Open PDF in New Tab
//               </a>
//             </div>
//           ) : preview.type?.includes('word') || preview.type?.includes('document') ? (
//             <div className="flex flex-col items-center">
//               <div className="w-32 h-32 flex items-center justify-center bg-blue-100 rounded-lg mb-4">
//                 <span className="text-4xl text-blue-600">📝</span>
//               </div>
//               <p className="text-lg font-medium text-gray-700">Word Document</p>
//               <p className="text-sm text-gray-600 mt-2">{preview.name}</p>
//               <a
//                 href={preview.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 <span className="mr-2">📂</span>
//                 Open Document
//               </a>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center">
//               <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
//                 <span className="text-4xl text-gray-600">📎</span>
//               </div>
//               <p className="text-lg font-medium text-gray-700">Document Preview</p>
//               <p className="text-sm text-gray-600 mt-2">{preview.name}</p>
//               <a
//                 href={preview.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="mt-4 inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
//               >
//                 <span className="mr-2">📂</span>
//                 Open File
//               </a>
//             </div>
//           )}
//         </div>

//         {/* Modal Footer */}
//         <div className="p-4 border-t bg-gray-50 flex justify-between">
//           <button
//             onClick={() => window.open(preview.url, '_blank')}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Open in New Tab
//           </button>
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
//           >
//             Close Preview
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ================= HELPER COMPONENTS =================
// const Input = ({ label, value, onChange, placeholder, type = "text", className = "", debounce = false }) => {
//   const [localValue, setLocalValue] = useState(value || '');
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     setLocalValue(value || '');
//   }, [value]);

//   const handleChange = useCallback((e) => {
//     const newValue = e.target.value;
//     setLocalValue(newValue);

//     if (debounce) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         onChange?.(newValue);
//       }, 300);
//     } else {
//       onChange?.(newValue);
//     }
//   }, [onChange, debounce]);

//   return (
//     <div className={className}>
//       <label className="block  text-sm font-medium text-gray-700 mb-1">{label}</label>
//       <input
//         type={type}
//         value={localValue}
//         onChange={handleChange}
//         placeholder={placeholder}
//         className="w-full uppercase p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
//       />
//     </div>
//   );
// };

// const InputNum = ({
//   label,
//   value = '',
//   onChange,
//   placeholder = '',
//   maxLength,
//   allowAlpha = false,
//   className = '',
//   debounce = false
// }) => {
//   const [localValue, setLocalValue] = useState(value);
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     setLocalValue(value);
//   }, [value]);

//   const handleChange = useCallback((e) => {
//     let inputValue = e.target.value;

//     if (!allowAlpha) {
//       inputValue = inputValue.replace(/[^0-9]/g, '');
//     }

//     if (maxLength && inputValue.length > maxLength) {
//       inputValue = inputValue.slice(0, maxLength);
//     }

//     setLocalValue(inputValue);

//     if (debounce) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         onChange?.(inputValue);
//       }, 300);
//     } else {
//       onChange?.(inputValue);
//     }
//   }, [onChange, maxLength, allowAlpha, debounce]);

//   return (
//     <div className={className}>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label}
//       </label>
//       <input
//         type="text"
//         inputMode={allowAlpha ? "text" : "numeric"}
//         value={localValue}
//         onChange={handleChange}
//         placeholder={placeholder}
//         maxLength={maxLength}
//         className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm
//                    focus:ring-2 focus:ring-[#15BBB3] focus:border-[#15BBB3]
//                    outline-none transition
//                    [appearance:textfield]
//                    [&::-webkit-outer-spin-button]:hidden
//                    [&::-webkit-inner-spin-button]:hidden`}
//       />
//       {maxLength && (
//         <p className="text-xs text-gray-500 mt-1 text-right">
//           {localValue?.length || 0}/{maxLength}
//         </p>
//       )}
//     </div>
//   );
// };

// const EmailInput = ({ label, value, onChange, placeholder, className = "", debounce = false }) => {
//   const [localValue, setLocalValue] = useState(value || '');
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     setLocalValue(value || '');
//   }, [value]);

//   const handleChange = useCallback((e) => {
//     const val = e.target.value.toLowerCase();
//     setLocalValue(val);

//     if (debounce) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         onChange?.(val);
//       }, 300);
//     } else {
//       onChange?.(val);
//     }
//   }, [onChange, debounce]);

//   return (
//     <div className={className}>
//       <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//       <input
//         type="email"
//         value={localValue}
//         onChange={handleChange}
//         placeholder={placeholder || "example@email.com"}
//         className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-[#15BBB3] focus:border-[#15BBB3] lowercase focus:outline-none"
//       />
//     </div>
//   );
// };

// const WebsiteInput = ({ label, value, onChange, placeholder, className = "", debounce = false }) => {
//   const [localValue, setLocalValue] = useState(value || '');
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     setLocalValue(value || '');
//   }, [value]);

//   const handleChange = useCallback((e) => {
//     const val = e.target.value.toLowerCase();
//     setLocalValue(val);

//     if (debounce) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         onChange?.(val);
//       }, 300);
//     } else {
//       onChange?.(val);
//     }
//   }, [onChange, debounce]);

//   return (
//     <div className={className}>
//       <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//       <input
//         type="url"
//         value={localValue}
//         onChange={handleChange}
//         placeholder={placeholder || "www.example.com"}
//         className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-[#15BBB3] focus:border-[#15BBB3] lowercase focus:outline-none"
//       />
//     </div>
//   );
// };

// const FormSelect = ({ label, value, onChange, options, className = "" }) => (
//   <div className={className}>
//     <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <select
//       value={value || ''}
//       onChange={(e) => onChange?.(e.target.value)}
//       className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
//     >
//       <option value="">Select</option>
//       {options.map(opt => (
//         <option key={opt} value={opt}>{opt}</option>
//       ))}
//     </select>
//   </div>
// );

// const TextArea = ({ label, value, onChange, placeholder, rows = 3, className = "", debounce = false }) => {
//   const [localValue, setLocalValue] = useState(value || '');
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     setLocalValue(value || '');
//   }, [value]);

//   const handleChange = useCallback((e) => {
//     const val = e.target.value;
//     setLocalValue(val);

//     if (debounce) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         onChange?.(val);
//       }, 300);
//     } else {
//       onChange?.(val);
//     }
//   }, [onChange, debounce]);

//   return (
//     <div className={className}>
//       <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//       <textarea
//         value={localValue}
//         onChange={handleChange}
//         placeholder={placeholder}
//         rows={rows}
//         className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
//       />
//     </div>
//   );
// };

// // ================= FILE UPLOAD COMPONENT WITH PREVIEW =================
// const FileUploadInput = ({
//   label,
//   fileType,
//   currentFile,
//   onFileSelect,
//   preview,
//   onPreviewClick
// }) => {
//   const [filePreview, setFilePreview] = useState(null);
//   const fileInputRef = useRef(null);

//   // Reset preview when currentFile changes
//   useEffect(() => {
//     if (currentFile && typeof currentFile === 'string') {
//       setFilePreview({
//         url: getDocumentUrl(currentFile),
//         name: currentFile.split('/').pop(),
//         type: currentFile.split('.').pop().toLowerCase() === 'pdf' ? 'application/pdf' : 'image/*'
//       });
//     } else {
//       setFilePreview(null);
//     }
//   }, [currentFile]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setFilePreview({
//           url: e.target.result,
//           name: file.name,
//           type: file.type,
//           size: file.size
//         });
//       };
//       reader.readAsDataURL(file);

//       onFileSelect?.(file, fileType);
//     }
//   };

//   const getDocumentUrl = (filePath) => {
//     if (!filePath) return null;
//     try {
//       const baseUrl = getApiBaseUrl();
//       if (filePath.includes("uploads/")) {
//         let relativePath = filePath;
//         if (filePath.includes("uploads/")) {
//           const uploadsIndex = filePath.lastIndexOf("uploads/");
//           relativePath = filePath.substring(uploadsIndex);
//         }
//         return `${baseUrl}/${relativePath}`;
//       }
//       if (filePath.startsWith("/uploads")) {
//         return `${baseUrl}${filePath}`;
//       }
//       if (filePath.startsWith("http")) {
//         return filePath;
//       }
//       return filePath;
//     } catch (error) {
//       console.error("Error generating document URL:", error);
//       return null;
//     }
//   };

//   const fileName = currentFile
//     ? (typeof currentFile === 'string' ? currentFile.split('/').pop() : currentFile.name || 'Uploaded')
//     : 'No file chosen';

//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//       <div className="flex items-center gap-2">
//         <input
//           ref={fileInputRef}
//           type="file"
//           onChange={handleFileChange}
//           accept="image/*,.pdf,.doc,.docx"
//           className="hidden"
//         />
//         <button
//           type="button"
//           onClick={() => fileInputRef.current?.click()}
//           className="flex-1 p-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 text-left"
//         >
//           Choose File
//         </button>
//         {fileName && (
//           <span className="text-xs text-gray-500 truncate max-w-[200px]" title={fileName}>
//             {fileName}
//           </span>
//         )}
//       </div>

//       {/* File Preview */}
//       {(filePreview || preview) && (
//         <div className="mt-2">
//           <div className="p-2 border border-gray-200 rounded bg-gray-50">
//             <div className="flex justify-between items-center mb-1">
//               <p className="text-xs text-gray-500">Preview:</p>
//               <button
//                 type="button"
//                 onClick={() => onPreviewClick?.(filePreview || preview)}
//                 className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
//               >
//                 Full Preview
//               </button>
//             </div>

//             <div
//               className="flex items-start space-x-2 cursor-pointer"
//               onClick={() => onPreviewClick?.(filePreview || preview)}
//             >
//               {(filePreview?.type || preview?.type)?.startsWith('image/') ? (
//                 <div className="relative flex-shrink-0 group">
//                   <img
//                     src={filePreview?.url || preview?.url}
//                     alt={filePreview?.name || preview?.name || 'Preview'}
//                     className="w-16 h-16 object-cover rounded border group-hover:opacity-90 transition"
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity rounded border flex items-center justify-center">
//                     <span className="text-white text-xs font-bold">VIEW</span>
//                   </div>
//                 </div>
//               ) : (filePreview?.type || preview?.type)?.includes('pdf') ? (
//                 <div className="w-16 h-16 flex flex-col items-center justify-center bg-red-100 rounded border group hover:bg-red-200 transition">
//                   <span className="text-2xl text-red-600">📄</span>
//                   <span className="text-[10px] text-red-700 mt-1">PDF</span>
//                 </div>
//               ) : (filePreview?.type || preview?.type)?.includes('word') || (filePreview?.type || preview?.type)?.includes('document') ? (
//                 <div className="w-16 h-16 flex flex-col items-center justify-center bg-blue-100 rounded border group hover:bg-blue-200 transition">
//                   <span className="text-2xl text-blue-600">📝</span>
//                   <span className="text-[10px] text-blue-700 mt-1">DOC</span>
//                 </div>
//               ) : (
//                 <div className="w-16 h-16 flex flex-col items-center justify-center bg-gray-200 rounded border group hover:bg-gray-300 transition">
//                   <span className="text-2xl text-gray-600">📎</span>
//                   <span className="text-[10px] text-gray-700 mt-1">FILE</span>
//                 </div>
//               )}
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-medium text-gray-700 truncate" title={filePreview?.name || preview?.name}>
//                   {filePreview?.name || preview?.name}
//                 </p>
//                 <p className="text-xs text-gray-500">{filePreview?.type || preview?.type || 'Document'}</p>
//                 <div className="flex gap-2 mt-1">
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onPreviewClick?.(filePreview || preview);
//                     }}
//                     className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
//                   >
//                     🔍 Preview
//                   </button>
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       const url = filePreview?.url || preview?.url;
//                       if (url) window.open(url, '_blank');
//                     }}
//                     className="text-xs text-green-600 hover:text-green-800 hover:underline"
//                   >
//                     📂 Open
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View current file link */}
//       {currentFile && typeof currentFile === 'string' && !filePreview && !preview && (
//         <button
//           type="button"
//           onClick={() => {
//             const url = getDocumentUrl(currentFile);
//             if (url) window.open(url, '_blank');
//           }}
//           className="mt-1 text-xs text-blue-600 hover:underline"
//         >
//           View current file
//         </button>
//       )}
//     </div>
//   );
// };

// // ================= FORM INPUT COMPONENT =================
// const FormInput = ({ label, value, onChange, type = "text", placeholder = "", className = "", debounce = false }) => {
//   const [localValue, setLocalValue] = useState(value || '');
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     setLocalValue(value || '');
//   }, [value]);

//   const handleChange = useCallback((e) => {
//     const val = e.target.value;
//     setLocalValue(val);

//     if (debounce) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         onChange?.(val);
//       }, 300);
//     } else {
//       onChange?.(val);
//     }
//   }, [onChange, debounce]);

//   return (
//     <div className={className}>
//       <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//       <input
//         type={type}
//         value={localValue}
//         onChange={handleChange}
//         placeholder={placeholder}
//         className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
//       />
//     </div>
//   );
// };

// // ================= MAIN COMPONENT =================
// const ViewDoctorForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const isEditMode = searchParams.get('edit') === 'true';

//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [saving, setSaving] = useState(false);

//   // Preview modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentPreview, setCurrentPreview] = useState(null);

//   // Array to hold multiple doctors (Main + Spouse/Linked)
//   const [doctors, setDoctors] = useState([]);

//   // Form state for editing
//   const [formData, setFormData] = useState({
//     fullName: '',
//     dateOfBirth: '',
//     email: '',
//     phoneNumber: '',
//     whatsappNumber: '',
//     qualification: '',
//     experience: '',
//     licenseNumber: '',
//     registrationYear: '',
//     aadharNumber: '',
//     panNumber: '',
//     specialization: [],
//     hospitalName: '',
//     membershipDate: '',
//     membershipType: '',
//     typeOfEnquiry: '',
//     doctorStatus: '',
//     status: '',
//     remarks: '',
//     hospitalAddress: {
//       address: '',
//       city: '',
//       state: '',
//       district: '',
//       taluka: '',
//       pinCode: '',
//       country: 'India'
//     },
//     hospitalDetails: {
//       hospitalType: '',
//       beds: '',
//       establishmentYear: '',
//       website: '',
//       ownershipType: 'Private',
//       director: { name: '', contact: '', email: '' },
//       admin: { name: '', contact: '', email: '' },
//       departments: []
//     },
//     contactDetails: {
//       phoneNumber: '',
//       whatsapp: '',
//       emailId: '',
//       currentAddress: {
//         address: '',
//         city: '',
//         state: '',
//         district: '',
//         taluka: '',
//         pinCode: '',
//         country: 'India'
//       }
//     },
//     documents: {
//       // Individual Documents
//       aadhar: '',
//       pan: '',
//       medicalRegistration: '',
//       additionalQualification: '',
//       visitingCard: '',
//       bankDetails: '',
//       // Hospital Documents
//       hospitalPanDocument: '',
//       registrationCertificate: '',
//       hospitalGstDocument: '',
//       ownerPanCard: '',
//       ownerAadhaarCard: '',
//       // Legacy fields
//       license: '',
//       qualificationDoc: '',
//       otherDocs: []
//     }
//   });

//   // File preview state
//   const [filePreviews, setFilePreviews] = useState({});

//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         setLoading(true);
//         const response = await apiClient.get(apiEndpoints.doctors.getWithSpouse(id));
//         if (response.data.success) {
//           const doctorData = response.data.data;
//           // If the doctor is linked with a spouse, use mainDoctor data
//           // Otherwise, use the original data structure
//           const processedDoctorData = doctorData.isLinked ? { ...doctorData.mainDoctor, isLinked: true, relationshipType: doctorData.relationshipType, linkedDoctor: doctorData.linkedDoctor } : doctorData;
//           setDoctor(processedDoctorData);

//           // Fetch and set all linked doctors
//           const docs = doctorData.isLinked
//             ? [doctorData.mainDoctor, doctorData.linkedDoctor]
//             : [doctorData];
//           setDoctors(docs);

//           // If in edit mode, populate form data
//           if (isEditMode) {
//             const membershipDateValue = processedDoctorData.membershipDate
//               ? new Date(processedDoctorData.membershipDate).toISOString().split('T')[0]
//               : processedDoctorData.createdAt
//                 ? new Date(processedDoctorData.createdAt).toISOString().split('T')[0]
//                 : '';

//             setFormData({
//               fullName: processedDoctorData.fullName || '',
//               dateOfBirth: processedDoctorData.dateOfBirth ? new Date(processedDoctorData.dateOfBirth).toISOString().split('T')[0] : '',
//               email: processedDoctorData.email || '',
//               phoneNumber: processedDoctorData.phoneNumber || '',
//               whatsappNumber: processedDoctorData.whatsappNumber || '',
//               qualification: processedDoctorData.qualification || '',
//               experience: processedDoctorData.experience || '',
//               licenseNumber: processedDoctorData.licenseNumber || '',
//               registrationYear: processedDoctorData.registrationYear || '',
//               aadharNumber: processedDoctorData.aadharNumber || '',
//               panNumber: processedDoctorData.panNumber || '',
//               specialization: processedDoctorData.specialization || [],
//               hospitalName: processedDoctorData.hospitalName || '',
//               membershipDate: membershipDateValue,
//               membershipType: processedDoctorData.membershipType || '',
//               typeOfEnquiry: processedDoctorData.typeOfEnquiry || '',
//               doctorStatus: processedDoctorData.doctorStatus || '',
//               status: processedDoctorData.status || '',
//               remarks: processedDoctorData.remarks || '',
//               hospitalAddress: processedDoctorData.hospitalAddress || {
//                 address: '', city: '', state: '', district: '', taluka: '', pinCode: '', country: 'India'
//               },
//               hospitalDetails: processedDoctorData.hospitalDetails || {
//                 hospitalType: '', beds: '', establishmentYear: '', website: '', ownershipType: 'Private',
//                 director: { name: '', contact: '', email: '' },
//                 admin: { name: '', contact: '', email: '' },
//                 departments: []
//               },
//               contactDetails: processedDoctorData.contactDetails || {
//                 phoneNumber: '', whatsapp: '', emailId: '',
//                 currentAddress: { address: '', city: '', state: '', district: '', taluka: '', pinCode: '', country: 'India' }
//               },
//               documents: {
//                 // Individual Documents
//                 aadhar: processedDoctorData.documents?.aadhar || '',
//                 pan: processedDoctorData.documents?.pan || '',
//                 medicalRegistration: processedDoctorData.documents?.medicalRegistration || '',
//                 additionalQualification: processedDoctorData.documents?.additionalQualification || '',
//                 visitingCard: processedDoctorData.documents?.visitingCard || '',
//                 bankDetails: processedDoctorData.documents?.bankDetails || '',
//                 // Hospital Documents
//                 hospitalPanDocument: processedDoctorData.documents?.hospitalPanDocument || '',
//                 registrationCertificate: processedDoctorData.documents?.registrationCertificate || '',
//                 hospitalGstDocument: processedDoctorData.documents?.hospitalGstDocument || '',
//                 ownerPanCard: processedDoctorData.documents?.ownerPanCard || '',
//                 ownerAadhaarCard: processedDoctorData.documents?.ownerAadhaarCard || '',
//                 // Legacy fields for backward compatibility
//                 license: processedDoctorData.documents?.license || '',
//                 qualificationDoc: processedDoctorData.documents?.qualificationDoc || '',
//                 otherDocs: processedDoctorData.documents?.otherDocs || []
//               }
//             });
//           }
//         } else {
//           setError("Failed to fetch doctor details");
//         }
//       } catch (err) {
//         console.error("Error fetching doctor:", err);
//         setError(err.response?.data?.message || "Failed to load doctor details");
//         toast.error("Failed to load doctor details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchDoctor();
//     }
//   }, [id, isEditMode]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   };




//   const handleDocumentClick = (filePath) => {
//     try {
//       const url = getDocumentUrl(filePath);
//       if (url) {
//         window.open(url, "_blank");
//       } else {
//         toast.error("Unable to open document. Invalid file path.");
//       }
//     } catch (error) {
//       console.error("Error opening document:", error);
//       toast.error("Error opening document. Please try again.");
//     }
//   };


//   const getDocumentUrl = (filePath) => {
//     if (!filePath) return null;
//     try {
//       const baseUrl = getApiBaseUrl();
//       if (filePath.includes("uploads/")) {
//         let relativePath = filePath;
//         if (filePath.includes("uploads/")) {
//           const uploadsIndex = filePath.lastIndexOf("uploads/");
//           relativePath = filePath.substring(uploadsIndex);
//         }
//         return `${baseUrl}/${relativePath}`;
//       }
//       if (filePath.startsWith("/uploads")) {
//         return `${baseUrl}${filePath}`;
//       }
//       if (filePath.startsWith("http")) {
//         return filePath;
//       }
//       return filePath;
//     } catch (error) {
//       console.error("Error generating document URL:", error);
//       return null;
//     }
//   };

//   // Preview handlers
//   const handlePreviewClick = (preview) => {
//     setCurrentPreview(preview);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setCurrentPreview(null);
//   };

//   // Form update handlers
//   const handleInputChange = (field, value) => {
//     setFormData(prev => {
//       const keys = field.split('.');
//       if (keys.length === 1) {
//         return { ...prev, [field]: value };
//       } else if (keys.length === 2) {
//         return {
//           ...prev,
//           [keys[0]]: {
//             ...prev[keys[0]],
//             [keys[1]]: value
//           }
//         };
//       } else if (keys.length === 3) {
//         return {
//           ...prev,
//           [keys[0]]: {
//             ...prev[keys[0]],
//             [keys[1]]: {
//               ...prev[keys[0]][keys[1]],
//               [keys[2]]: value
//             }
//           }
//         };
//       }
//       return prev;
//     });

//     // Mirror some fields to doctors[0] if they exist there
//     const doctorSpecificFields = [
//       'fullName', 'dateOfBirth', 'email', 'phoneNumber', 'whatsappNumber',
//       'qualification', 'licenseNumber', 'registrationYear', 'aadharNumber', 'panNumber', 'specialization'
//     ];
//     if (doctorSpecificFields.includes(field)) {
//       setDoctors(prev => {
//         if (prev.length === 0) return prev;
//         const newDoctors = [...prev];
//         newDoctors[0] = { ...newDoctors[0], [field]: value };
//         return newDoctors;
//       });
//     }
//   };

//   const handleDoctorInputChange = (index, field, value) => {
//     setDoctors(prev => {
//       const newDoctors = [...prev];
//       const keys = field.split('.');
//       let current = { ...newDoctors[index] };
//       newDoctors[index] = current;

//       if (keys.length === 1) {
//         current[field] = value;
//       } else if (keys.length === 2) {
//         current[keys[0]] = { ...current[keys[0]], [keys[1]]: value };
//       } else if (keys.length === 3) {
//         current[keys[0]] = { ...current[keys[0]] };
//         current[keys[0]][keys[1]] = { ...current[keys[0]][keys[1]], [keys[2]]: value };
//       }
//       return newDoctors;
//     });

//     // If it's the first doctor, also update top-level formData for compatibility
//     if (index === 0) {
//       handleInputChange(field, value);
//     }
//   };

//   const handleAddDoctor = () => {
//     setDoctors(prev => [...prev, {
//       fullName: '',
//       dateOfBirth: '',
//       email: '',
//       phoneNumber: '',
//       whatsappNumber: '',
//       qualification: '',
//       licenseNumber: '',
//       registrationYear: '',
//       aadharNumber: '',
//       panNumber: '',
//       specialization: [],
//       documents: {
//         aadhar: '',
//         pan: '',
//         medicalRegistration: '',
//         additionalQualification: '',
//         visitingCard: '',
//         bankDetails: '',
//         otherDocs: []
//       }
//     }]);
//   };

//   // File upload handler with preview
//   const handleFileUpload = async (file, fileType) => {
//     if (!file) return;

//     // Create preview immediately
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setFilePreviews(prev => ({
//         ...prev,
//         [fileType]: {
//           url: e.target.result,
//           name: file.name,
//           type: file.type,
//           size: file.size
//         }
//       }));
//     };
//     reader.readAsDataURL(file);

//     const formData = new FormData();
//     const fieldNameMap = {
//       aadhar: 'aadharCard',
//       pan: 'panCard',
//       medicalRegistration: 'medicalRegistration',
//       additionalQualification: 'additionalQualification',
//       visitingCard: 'visitingCard',
//       bankDetails: 'bankDetails',
//       hospitalPanDocument: 'hospitalPanDocument',
//       registrationCertificate: 'registrationCertificate',
//       hospitalGstDocument: 'hospitalGstDocument',
//       ownerPanCard: 'ownerPanCard',
//       ownerAadhaarCard: 'ownerAadhaarCard',
//       license: 'medicalRegistration',
//       qualificationDoc: 'additionalQualification'
//     };

//     if (fileType === 'otherDocs') {
//       formData.append('otherDocs', file);
//     } else {
//       const backendFieldName = fieldNameMap[fileType] || fileType;
//       formData.append(backendFieldName, file);
//     }

//     try {
//       const response = await apiClient.post(apiEndpoints.doctors.uploadDocuments, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.data.success) {
//         if (fileType === 'otherDocs') {
//           const otherDocPath = response.data.data.otherDocs ? response.data.data.otherDocs[0] : response.data.data[Object.keys(response.data.data)[0]];

//           setFormData(prev => ({
//             ...prev,
//             documents: {
//               ...prev.documents,
//               otherDocs: [...(prev.documents.otherDocs || []), otherDocPath]
//             }
//           }));
//         } else {
//           const backendFieldName = fieldNameMap[fileType] || fileType;
//           const filePath = response.data.data[backendFieldName];

//           setFormData(prev => ({
//             ...prev,
//             documents: {
//               ...prev.documents,
//               [fileType]: filePath
//             }
//           }));
//         }

//         toast.success(`${fileType === 'otherDocs' ? 'Document' : fileType} uploaded successfully`);
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       toast.error(`Failed to upload ${fileType === 'otherDocs' ? 'document' : fileType}`);
//     }
//   };

//   const handleDoctorFileUpload = async (index, file, fileType) => {
//     if (!file) return;

//     // Create preview
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setFilePreviews(prev => ({
//         ...prev,
//         [`${index}_${fileType}`]: {
//           url: e.target.result,
//           name: file.name,
//           type: file.type,
//           size: file.size
//         }
//       }));
//     };
//     reader.readAsDataURL(file);

//     const formDataUpload = new FormData();
//     const fieldNameMap = {
//       aadhar: 'aadharCard',
//       pan: 'panCard',
//       medicalRegistration: 'medicalRegistration',
//       additionalQualification: 'additionalQualification',
//       visitingCard: 'visitingCard',
//       bankDetails: 'bankDetails',
//       license: 'medicalRegistration',
//       qualificationDoc: 'additionalQualification'
//     };

//     const backendFieldName = fieldNameMap[fileType] || fileType;
//     formDataUpload.append(backendFieldName, file);

//     try {
//       const response = await apiClient.post(apiEndpoints.doctors.uploadDocuments, formDataUpload, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.data.success) {
//         const filePath = response.data.data[backendFieldName];

//         setDoctors(prev => {
//           const newDoctors = [...prev];
//           newDoctors[index] = {
//             ...newDoctors[index],
//             documents: {
//               ...(newDoctors[index].documents || {}),
//               [fileType]: filePath
//             }
//           };
//           return newDoctors;
//         });

//         // Sync with first doctor if needed
//         if (index === 0) {
//           setFormData(prev => ({
//             ...prev,
//             documents: {
//               ...prev.documents,
//               [fileType]: filePath
//             }
//           }));
//         }

//         toast.success(`Individual document uploaded successfully`);
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       toast.error(`Failed to upload individual document`);
//     }
//   };

//   // Save/Update handler
//   const handleSave = async () => {
//     try {
//       setSaving(true);

//       // We need to update all doctors in the array
//       const updatePromises = doctors.map(async (doc, index) => {
//         const docId = doc._id || (index === 0 ? id : null);
//         if (!docId) return null;

//         // Prepare data for this specific doctor
//         // We use shared fields from formData and specific fields from the doc object
//         const updateData = {
//           ...formData, // Shared membership/hospital info
//           ...doc,      // Doctor-specific info (fullName, email, etc.)
//           dateOfBirth: doc.dateOfBirth ? new Date(doc.dateOfBirth) : undefined,
//           membershipDate: formData.membershipDate ? new Date(formData.membershipDate) : undefined,
//           specialization: Array.isArray(doc.specialization) ? doc.specialization : [],
//           documents: {
//             // Individual documents for this doctor
//             aadhar: doc.documents?.aadhar || (index === 0 ? formData.documents.aadhar : '') || '',
//             pan: doc.documents?.pan || (index === 0 ? formData.documents.pan : '') || '',
//             medicalRegistration: doc.documents?.medicalRegistration || (index === 0 ? formData.documents.medicalRegistration : '') || '',
//             additionalQualification: doc.documents?.additionalQualification || (index === 0 ? formData.documents.additionalQualification : '') || '',
//             visitingCard: doc.documents?.visitingCard || (index === 0 ? formData.documents.visitingCard : '') || '',
//             bankDetails: doc.documents?.bankDetails || (index === 0 ? formData.documents.bankDetails : '') || '',

//             // Shared Hospital Documents
//             hospitalPanDocument: formData.documents.hospitalPanDocument || '',
//             registrationCertificate: formData.documents.registrationCertificate || '',
//             hospitalGstDocument: formData.documents.hospitalGstDocument || '',
//             ownerPanCard: formData.documents.ownerPanCard || '',
//             ownerAadhaarCard: formData.documents.ownerAadhaarCard || '',

//             // Legacy/Common
//             license: doc.documents?.license || (index === 0 ? formData.documents.license : '') || '',
//             qualificationDoc: doc.documents?.qualificationDoc || (index === 0 ? formData.documents.qualificationDoc : '') || '',
//             otherDocs: Array.isArray(formData.documents.otherDocs) ? formData.documents.otherDocs : []
//           }
//         };

//         return apiClient.put(apiEndpoints.doctors.update(docId), updateData);
//       });

//       await Promise.all(updatePromises.filter(p => p !== null));

//       toast.success("Doctor details updated successfully");

//       // Refresh doctor data
//       const response = await apiClient.get(apiEndpoints.doctors.getWithSpouse(id));
//       if (response.data.success) {
//         const doctorData = response.data.data;
//         const processedDoctorData = doctorData.isLinked ? { ...doctorData.mainDoctor, isLinked: true, relationshipType: doctorData.relationshipType, linkedDoctor: doctorData.linkedDoctor } : doctorData;
//         setDoctor(processedDoctorData);
//         setDoctors(doctorData.isLinked ? [doctorData.mainDoctor, doctorData.linkedDoctor] : [doctorData]);
//       }

//       // Exit edit mode
//       navigate(`/view-doctor/${id}`);
//     } catch (error) {
//       console.error("Error updating doctor:", error);
//       toast.error(error.response?.data?.message || "Failed to update doctor");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-lg">Loading doctor details...</div>
//       </div>
//     );
//   }

//   if (error || !doctor) {
//     return (
//       <div className="p-8 text-center">
//         <p className="text-red-600">{error || "Doctor not found"}</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 bg-teal-500 text-white px-4 py-2 rounded"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   const isHospital = doctor.doctorType === "hospital";
//   const isIndividual = doctor.doctorType === "individual";
//   const isHospitalIndividual = doctor.doctorType === "hospital_individual";

//   // Render edit form
//   if (isEditMode) {
//     return (
//       <>
//         <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-2xl font-bold text-gray-800">Edit Doctor Details</h1>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => navigate(`/view-doctor/${id}`)}
//                   className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   disabled={saving}
//                   className="bg-[#15BBB3] text-white px-4 py-2 rounded hover:bg-[#13a89e] disabled:opacity-50"
//                 >
//                   {saving ? 'Saving...' : 'Save Changes'}
//                 </button>
//               </div>
//             </div>

//             {/* Basic Information */}
//             <div className="border-b pb-6 mb-6">
//               <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Basic Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Membership ID</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.membershipId || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.doctorId || "N/A"}
//                   </div>
//                 </div>
//                 <Input
//                   label="Membership Date"
//                   type="date"
//                   value={formData.membershipDate}
//                   onChange={(v) => handleInputChange('membershipDate', v)}
//                   debounce={true}
//                 />
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Type of Membership</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {formData.doctorType || doctor.doctorType || "N/A"}
//                   </div>
//                 </div>
//                 <FormSelect
//                   label="Status"
//                   value={formData.status}
//                   onChange={(v) => handleInputChange('status', v)}
//                   options={['pending', 'accepted', 'rejected', 'active', 'inactive']}
//                 />
//                 <FormSelect
//                   label="Enquiry Status"
//                   value={formData.typeOfEnquiry}
//                   onChange={(v) => handleInputChange('typeOfEnquiry', v)}
//                   options={['cold', 'warm', 'hot', 'follow_up', 'closed']}
//                 />
//               </div>
//             </div>

//             {/* Doctor Information (Repeated for each linked doctor) */}
//             {(isIndividual || isHospitalIndividual) && doctors.map((doc, index) => (
//               <div key={index} className="border-b pb-6 mb-6 bg-gray-50/50 p-4 rounded-lg">
//                 <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">
//                   {doctors.length > 1 ? `Doctor ${index + 1} Information` : 'Doctor Information'}
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <Input
//                     label="Full Name"
//                     value={doc.fullName || ''}
//                     onChange={(v) => handleDoctorInputChange(index, 'fullName', v)}
//                     debounce={true}
//                   />
//                   <Input
//                     label="Date of Birth"
//                     type="date"
//                     value={doc.dateOfBirth ? (typeof doc.dateOfBirth === 'string' ? doc.dateOfBirth.split('T')[0] : new Date(doc.dateOfBirth).toISOString().split('T')[0]) : ''}
//                     onChange={(v) => handleDoctorInputChange(index, 'dateOfBirth', v)}
//                     debounce={true}
//                   />
//                   <EmailInput
//                     label="Email"
//                     value={doc.email || ''}
//                     onChange={(v) => handleDoctorInputChange(index, 'email', v)}
//                     debounce={true}
//                   />
//                   <InputNum
//                     label="Phone Number"
//                     value={doc.phoneNumber || ''}
//                     onChange={(v) => handleDoctorInputChange(index, 'phoneNumber', v)}
//                     maxLength={10}
//                     debounce={true}
//                   />
//                   <InputNum
//                     label="WhatsApp Number"
//                     value={doc.whatsappNumber || ''}
//                     onChange={(v) => handleDoctorInputChange(index, 'whatsappNumber', v)}
//                     maxLength={10}
//                     debounce={true}
//                   />
//                   <Input
//                     label="Qualification"
//                     value={doc.qualification || ''}
//                     onChange={(v) => handleDoctorInputChange(index, 'qualification', v)}
//                     debounce={true}
//                   />
//                   <Input
//                     label="Reg No"
//                     value={doc.licenseNumber || ''}
//                     onChange={(v) => handleDoctorInputChange(index, 'licenseNumber', v)}
//                     debounce={true}
//                   />
//                   <Input
//                     label="Registration Year"
//                     value={doc.registrationYear || ''}
//                     onChange={(v) => handleDoctorInputChange(index, 'registrationYear', v)}
//                     debounce={true}
//                   />
//                   <InputNum
//                     label="Aadhar Number"
//                     value={doc.aadharNumber || ''}
//                     onChange={(v) => handleDoctorInputChange(index, 'aadharNumber', v)}
//                     maxLength={12}
//                     debounce={true}
//                   />
//                   <InputNum
//                     label="PAN Number"
//                     value={doc.panNumber || ''}
//                     onChange={(v) => handleDoctorInputChange(index, 'panNumber', v)}
//                     maxLength={10}
//                     allowAlpha={true}
//                     debounce={true}
//                   />
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
//                     <input
//                       type="text"
//                       value={Array.isArray(doc.specialization) ? doc.specialization.join(', ') : doc.specialization || ''}
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         const specialties = value.split(',').map(s => s.trim()).filter(s => s);
//                         handleDoctorInputChange(index, 'specialization', specialties);
//                       }}
//                       placeholder="Comma separated"
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3] focus:outline-none"
//                     />
//                   </div>
//                 </div>
//                 {index === 0 && isHospitalIndividual && doctors.length < 2 && (
//                   <button
//                     onClick={handleAddDoctor}
//                     className="mt-6 bg-[#15BBB3] text-white px-4 py-2 rounded hover:bg-[#13a89e] flex items-center gap-2"
//                   >
//                     <span>+</span> Add Spouse Doctor
//                   </button>
//                 )}
//               </div>
//             ))}

//             {/* Hospital Information */}
//             {(isHospital || isHospitalIndividual) && (
//               <>
//                 <div className="border-b pb-6 mb-6">
//                   <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Information</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <Input
//                       label="Hospital Name"
//                       value={formData.hospitalName}
//                       onChange={(v) => handleInputChange('hospitalName', v)}
//                       debounce={true}
//                     />
//                     {formData.hospitalDetails && (
//                       <>
//                         <FormSelect
//                           label="Hospital Type"
//                           value={formData.hospitalDetails.hospitalType}
//                           onChange={(v) => handleInputChange('hospitalDetails.hospitalType', v)}
//                           options={['Multi-Speciality', 'Maternity Home', 'Diagnostic Center', 'Super Speciality Hospital', 'Dental Case', 'Other']}
//                         />
//                         <InputNum
//                           label="No. of Beds"
//                           type="number"
//                           value={formData.hospitalDetails.beds}
//                           onChange={(v) => handleInputChange('hospitalDetails.beds', v)}
//                           debounce={true}
//                         />
//                         <Input
//                           label="Year of Establishment"
//                           value={formData.hospitalDetails.establishmentYear}
//                           onChange={(v) => handleInputChange('hospitalDetails.establishmentYear', v)}
//                           debounce={true}
//                         />
//                         <WebsiteInput
//                           label="Website"
//                           value={formData.hospitalDetails.website}
//                           onChange={(v) => handleInputChange('hospitalDetails.website', v)}
//                           debounce={true}
//                         />
//                         <FormSelect
//                           label="Ownership Type"
//                           value={formData.hospitalDetails.ownershipType}
//                           onChange={(v) => handleInputChange('hospitalDetails.ownershipType', v)}
//                           options={['Private', 'Government', 'Trust', 'Corporate']}
//                         />
//                         <Input
//                           label="Director Name"
//                           value={formData.hospitalDetails.director?.name || ''}
//                           onChange={(v) => handleInputChange('hospitalDetails.director.name', v)}
//                           debounce={true}
//                         />
//                         <InputNum
//                           label="Director Contact"
//                           value={formData.hospitalDetails.director?.contact || ''}
//                           onChange={(v) => handleInputChange('hospitalDetails.director.contact', v)}
//                           maxLength={10}
//                           debounce={true}
//                         />
//                         <EmailInput
//                           label="Director Email"
//                           value={formData.hospitalDetails.director?.email || ''}
//                           onChange={(v) => handleInputChange('hospitalDetails.director.email', v)}
//                           debounce={true}
//                         />
//                         <Input
//                           label="Admin Name"
//                           value={formData.hospitalDetails.admin?.name || ''}
//                           onChange={(v) => handleInputChange('hospitalDetails.admin.name', v)}
//                           debounce={true}
//                         />
//                         <InputNum
//                           label="Admin Contact"
//                           value={formData.hospitalDetails.admin?.contact || ''}
//                           onChange={(v) => handleInputChange('hospitalDetails.admin.contact', v)}
//                           maxLength={10}
//                           debounce={true}
//                         />
//                         <EmailInput
//                           label="Admin Email"
//                           value={formData.hospitalDetails.admin?.email || ''}
//                           onChange={(v) => handleInputChange('hospitalDetails.admin.email', v)}
//                           debounce={true}
//                         />
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Hospital Address */}
//                 {formData.hospitalAddress && (
//                   <div className="border-b pb-6 mb-6">
//                     <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Address</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="col-span-3">
//                         <Input
//                           label="Address"
//                           value={formData.hospitalAddress.address}
//                           onChange={(v) => handleInputChange('hospitalAddress.address', v)}
//                           debounce={true}
//                         />
//                       </div>
//                       <InputNum
//                         label="Pin Code"
//                         value={formData.hospitalAddress.pinCode}
//                         onChange={(v) => handleInputChange('hospitalAddress.pinCode', v)}
//                         maxLength={6}
//                         debounce={true}
//                       />
//                       <Input
//                         label="City"
//                         value={formData.hospitalAddress.city}
//                         onChange={(v) => handleInputChange('hospitalAddress.city', v)}
//                         debounce={true}
//                       />
//                       <Input
//                         label="Taluka"
//                         value={formData.hospitalAddress.taluka}
//                         onChange={(v) => handleInputChange('hospitalAddress.taluka', v)}
//                         debounce={true}
//                       />
//                       <Input
//                         label="District"
//                         value={formData.hospitalAddress.district}
//                         onChange={(v) => handleInputChange('hospitalAddress.district', v)}
//                         debounce={true}
//                       />
//                       <Input
//                         label="State"
//                         value={formData.hospitalAddress.state}
//                         onChange={(v) => handleInputChange('hospitalAddress.state', v)}
//                         debounce={true}
//                       />
//                       <Input
//                         label="Country"
//                         value={formData.hospitalAddress.country}
//                         onChange={(v) => handleInputChange('hospitalAddress.country', v)}
//                         debounce={true}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* Contact Information */}
//             <div className="border-b pb-6 mb-6">
//               <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Contact Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <InputNum
//                   label="Phone Number"
//                   value={formData.phoneNumber || formData.contactDetails?.phoneNumber || ''}
//                   onChange={(v) => {
//                     handleInputChange('phoneNumber', v);
//                     if (formData.contactDetails) {
//                       handleInputChange('contactDetails.phoneNumber', v);
//                     }
//                   }}
//                   maxLength={10}
//                   debounce={true}
//                 />
//                 <InputNum
//                   label="WhatsApp Number"
//                   value={formData.whatsappNumber || formData.contactDetails?.whatsapp || ''}
//                   onChange={(v) => {
//                     handleInputChange('whatsappNumber', v);
//                     if (formData.contactDetails) {
//                       handleInputChange('contactDetails.whatsapp', v);
//                     }
//                   }}
//                   maxLength={10}
//                   debounce={true}
//                 />
//                 <EmailInput
//                   label="Email"
//                   value={formData.email || formData.contactDetails?.emailId || ''}
//                   onChange={(v) => {
//                     handleInputChange('email', v);
//                     if (formData.contactDetails) {
//                       handleInputChange('contactDetails.emailId', v);
//                     }
//                   }}
//                   debounce={true}
//                 />
//               </div>
//             </div>

//             {/* Residential Address (for Individual/Hospital+Individual) */}
//             {(isIndividual || isHospitalIndividual) && formData.contactDetails?.currentAddress && (
//               <div className="border-b pb-6 mb-6">
//                 <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Residential Address</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="col-span-3">
//                     <Input
//                       label="Address"
//                       value={formData.contactDetails.currentAddress.address}
//                       onChange={(v) => handleInputChange('contactDetails.currentAddress.address', v)}
//                       debounce={true}
//                     />
//                   </div>
//                   <InputNum
//                     label="Pin Code"
//                     value={formData.contactDetails.currentAddress.pinCode}
//                     onChange={(v) => handleInputChange('contactDetails.currentAddress.pinCode', v)}
//                     maxLength={6}
//                     debounce={true}
//                   />
//                   <Input
//                     label="City"
//                     value={formData.contactDetails.currentAddress.city}
//                     onChange={(v) => handleInputChange('contactDetails.currentAddress.city', v)}
//                     debounce={true}
//                   />
//                   <Input
//                     label="Taluka"
//                     value={formData.contactDetails.currentAddress.taluka}
//                     onChange={(v) => handleInputChange('contactDetails.currentAddress.taluka', v)}
//                     debounce={true}
//                   />
//                   <Input
//                     label="District"
//                     value={formData.contactDetails.currentAddress.district}
//                     onChange={(v) => handleInputChange('contactDetails.currentAddress.district', v)}
//                     debounce={true}
//                   />
//                   <Input
//                     label="State"
//                     value={formData.contactDetails.currentAddress.state}
//                     onChange={(v) => handleInputChange('contactDetails.currentAddress.state', v)}
//                     debounce={true}
//                   />
//                   <Input
//                     label="Country"
//                     value={formData.contactDetails.currentAddress.country}
//                     onChange={(v) => handleInputChange('contactDetails.currentAddress.country', v)}
//                     debounce={true}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Remarks */}
//             <div className="border-b pb-6 mb-6">
//               <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Remarks</h2>
//               <TextArea
//                 value={formData.remarks}
//                 onChange={(v) => handleInputChange('remarks', v)}
//                 rows={4}
//                 placeholder="Enter remarks..."
//                 debounce={true}
//               />
//             </div>

//             {/* Documents */}
//             <div className="pb-6 mb-6">
//               <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Documents</h2>

//               {/* Individual Documents (Repeated for each linked doctor) */}
//               {(isIndividual || isHospitalIndividual) && doctors.map((doc, index) => (
//                 <div key={index} className="mb-8 p-4 bg-blue-50/30 rounded-lg border border-blue-100">
//                   <h3 className="text-lg font-medium text-blue-600 mb-4 border-b border-blue-100 pb-2">
//                     {doctors.length > 1 ? `Doctor ${index + 1} Individual Documents` : 'Individual Documents'}
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <FileUploadInput
//                       label="Aadhar"
//                       fileType="aadhar"
//                       currentFile={doc.documents?.aadhar || (index === 0 ? formData.documents.aadhar : '')}
//                       onFileSelect={(file) => handleDoctorFileUpload(index, file, 'aadhar')}
//                       preview={filePreviews[`${index}_aadhar`]}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                     <FileUploadInput
//                       label="PAN Card"
//                       fileType="pan"
//                       currentFile={doc.documents?.pan || (index === 0 ? formData.documents.pan : '')}
//                       onFileSelect={(file) => handleDoctorFileUpload(index, file, 'pan')}
//                       preview={filePreviews[`${index}_pan`]}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                     <FileUploadInput
//                       label="Medical Registration"
//                       fileType="medicalRegistration"
//                       currentFile={doc.documents?.medicalRegistration || (index === 0 ? formData.documents.medicalRegistration : '')}
//                       onFileSelect={(file) => handleDoctorFileUpload(index, file, 'medicalRegistration')}
//                       preview={filePreviews[`${index}_medicalRegistration`]}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                     <FileUploadInput
//                       label="Additional Qualification"
//                       fileType="additionalQualification"
//                       currentFile={doc.documents?.additionalQualification || (index === 0 ? formData.documents.additionalQualification : '')}
//                       onFileSelect={(file) => handleDoctorFileUpload(index, file, 'additionalQualification')}
//                       preview={filePreviews[`${index}_additionalQualification`]}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                     <FileUploadInput
//                       label="Visiting Card"
//                       fileType="visitingCard"
//                       currentFile={doc.documents?.visitingCard || (index === 0 ? formData.documents.visitingCard : '')}
//                       onFileSelect={(file) => handleDoctorFileUpload(index, file, 'visitingCard')}
//                       preview={filePreviews[`${index}_visitingCard`]}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                     <FileUploadInput
//                       label="Bank Details"
//                       fileType="bankDetails"
//                       currentFile={doc.documents?.bankDetails || (index === 0 ? formData.documents.bankDetails : '')}
//                       onFileSelect={(file) => handleDoctorFileUpload(index, file, 'bankDetails')}
//                       preview={filePreviews[`${index}_bankDetails`]}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                   </div>
//                 </div>
//               ))}

//               {(isHospital || isHospitalIndividual) && (
//                 <div className="mb-6">
//                   <h3 className="text-lg font-medium text-green-600 mb-3">Hospital Documents</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <FileUploadInput
//                       label="Hospital PAN Document"
//                       fileType="hospitalPanDocument"
//                       currentFile={formData.documents.hospitalPanDocument || doctor?.documents?.hospitalPanDocument}
//                       onFileSelect={(file) => handleFileUpload(file, 'hospitalPanDocument')}
//                       preview={filePreviews.hospitalPanDocument}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                     <FileUploadInput
//                       label="Registration Certificate"
//                       fileType="registrationCertificate"
//                       currentFile={formData.documents.registrationCertificate || doctor?.documents?.registrationCertificate}
//                       onFileSelect={(file) => handleFileUpload(file, 'registrationCertificate')}
//                       preview={filePreviews.registrationCertificate}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                     <FileUploadInput
//                       label="Hospital GST Document"
//                       fileType="hospitalGstDocument"
//                       currentFile={formData.documents.hospitalGstDocument || doctor?.documents?.hospitalGstDocument}
//                       onFileSelect={(file) => handleFileUpload(file, 'hospitalGstDocument')}
//                       preview={filePreviews.hospitalGstDocument}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                     <FileUploadInput
//                       label="Owner PAN Card"
//                       fileType="ownerPanCard"
//                       currentFile={formData.documents.ownerPanCard || doctor?.documents?.ownerPanCard}
//                       onFileSelect={(file) => handleFileUpload(file, 'ownerPanCard')}
//                       preview={filePreviews.ownerPanCard}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                     <FileUploadInput
//                       label="Owner Aadhaar Card"
//                       fileType="ownerAadhaarCard"
//                       currentFile={formData.documents.ownerAadhaarCard || doctor?.documents?.ownerAadhaarCard}
//                       onFileSelect={(file) => handleFileUpload(file, 'ownerAadhaarCard')}
//                       preview={filePreviews.ownerAadhaarCard}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                     {/* Legacy documents */}
//                     <FileUploadInput
//                       label="License/Registration"
//                       fileType="license"
//                       currentFile={formData.documents.license || doctor?.documents?.license}
//                       onFileSelect={(file) => handleFileUpload(file, 'license')}
//                       preview={filePreviews.license}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                     <FileUploadInput
//                       label="Qualification Document"
//                       fileType="qualificationDoc"
//                       currentFile={formData.documents.qualificationDoc || doctor?.documents?.qualificationDoc}
//                       onFileSelect={(file) => handleFileUpload(file, 'qualificationDoc')}
//                       preview={filePreviews.qualificationDoc}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Other documents */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-medium text-gray-700 mb-3">Other Documents</h3>
//                 <div className="space-y-2">
//                   {formData.documents?.otherDocs && formData.documents.otherDocs.length > 0 && (
//                     <>
//                       {formData.documents.otherDocs.map((doc, idx) => (
//                         <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                           <span className="text-sm text-gray-700 truncate">{doc.split('/').pop()}</span>
//                           <div className="flex space-x-2">
//                             <button
//                               type="button"
//                               onClick={() => window.open(getDocumentUrl(doc), '_blank')}
//                               className="text-xs text-blue-600 hover:underline"
//                             >
//                               View
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => {
//                                 setFormData(prev => ({
//                                   ...prev,
//                                   documents: {
//                                     ...prev.documents,
//                                     otherDocs: prev.documents.otherDocs.filter((_, i) => i !== idx)
//                                   }
//                                 }));
//                               }}
//                               className="text-xs text-red-600 hover:underline"
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </>
//                   )}
//                   <div className="mt-4">
//                     <FileUploadInput
//                       label="Upload New Document"
//                       fileType="otherDocs"
//                       currentFile={null}
//                       onFileSelect={(file) => handleFileUpload(file, 'otherDocs')}
//                       preview={filePreviews.otherDocs}
//                       onPreviewClick={handlePreviewClick}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-center space-x-3 mt-6 pt-6 border-t">
//               <button
//                 onClick={() => navigate(`/view-doctor/${id}`)}
//                 className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="bg-[#15BBB3] text-white px-6 py-2 rounded hover:bg-[#13a89e] disabled:opacity-50"
//               >
//                 {saving ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Preview Modal */}
//         <ImagePreviewModal
//           isOpen={modalOpen}
//           onClose={closeModal}
//           preview={currentPreview}
//         />
//       </>
//     );
//   }




//   // ================= VIEW MODE (existing code - kept unchanged) =================
//   // [Rest of the view mode code remains exactly the same as your original]
//   // I'm omitting it here to save space, but it should be included in your actual file
//   // ...




//   {/* Basic Information */ }
//   <div className="border-b pb-6 mb-6">
//     <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Basic Information</h2>
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Membership ID</label>
//         <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//           {doctor.membershipId || "N/A"}
//         </div>
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
//         <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//           {doctor.doctorId || "N/A"}
//         </div>
//       </div>
//       <FormInput
//         label="Membership Date"
//         type="date"
//         value={formData.membershipDate}
//         onChange={(v) => handleInputChange('membershipDate', v)}
//       />
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Type of Membership</label>
//         <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//           {formData.doctorType || doctor.doctorType || "N/A"}
//         </div>
//       </div>
//       <FormSelect
//         label="Status"
//         value={formData.status}
//         onChange={(v) => handleInputChange('status', v)}
//         options={['pending', 'accepted', 'rejected', 'active', 'inactive']}
//       />
//       <FormSelect
//         label="Enquiry Status"
//         value={formData.typeOfEnquiry}
//         onChange={(v) => handleInputChange('typeOfEnquiry', v)}
//         options={['cold', 'warm', 'hot', 'follow_up', 'closed']}
//       />
//       {/* <FormSelect
//                 label="Sales Status"
//                 value={formData.doctorStatus}
//                 onChange={(v) => handleInputChange('doctorStatus', v)}
//                 options={['cold', 'warm', 'hot', 'follow_up', 'close']}
//               /> */}
//     </div>
//   </div>

//   {/* Doctor Information (for Individual/Hospital+Individual) */ }
//   {
//     (isIndividual || isHospitalIndividual) && (
//       <div className="border-b pb-6 mb-6">
//         <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Doctor Information</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <FormInput
//             label="Full Name"
//             value={formData.fullName}
//             onChange={(v) => handleInputChange('fullName', v)}
//           />
//           <FormInput
//             label="Date of Birth"
//             type="date"
//             value={formData.dateOfBirth}
//             onChange={(v) => handleInputChange('dateOfBirth', v)}
//           />
//           <FormInput
//             label="Email"
//             type="email"
//             value={formData.email}
//             onChange={(v) => handleInputChange('email', v)}
//           />
//           <FormInput
//             label="Phone Number"
//             value={formData.phoneNumber}
//             onChange={(v) => handleInputChange('phoneNumber', v)}
//           />
//           <FormInput
//             label="WhatsApp Number"
//             value={formData.whatsappNumber}
//             onChange={(v) => handleInputChange('whatsappNumber', v)}
//           />
//           <FormInput
//             label="Qualification"
//             value={formData.qualification}
//             onChange={(v) => handleInputChange('qualification', v)}
//           />
//           {/* <FormInput
//                   label="Experience"
//                   value={formData.experience}
//                   onChange={(v) => handleInputChange('experience', v)}
//                 /> */}
//           <FormInput
//             label="Reg No"
//             value={formData.licenseNumber}
//             onChange={(v) => handleInputChange('licenseNumber', v)}
//           />
//           <FormInput
//             label="Registration Year"
//             value={formData.registrationYear}
//             onChange={(v) => handleInputChange('registrationYear', v)}
//           />
//           <FormInput
//             label="Aadhar Number"
//             value={formData.aadharNumber}
//             onChange={(v) => handleInputChange('aadharNumber', v)}
//           />
//           <FormInput
//             label="PAN Number"
//             value={formData.panNumber}
//             onChange={(v) => handleInputChange('panNumber', v)}
//           />
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
//             <input
//               type="text"
//               value={Array.isArray(formData.specialization) ? formData.specialization.join(', ') : formData.specialization || ''}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 const specialties = value.split(',').map(s => s.trim()).filter(s => s);
//                 handleInputChange('specialization', specialties);
//               }}
//               placeholder="Comma separated"
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3]"
//             />
//           </div>
//         </div>
//       </div>
//     )
//   }

//   {/* Hospital Information */ }
//   {
//     (isHospital || isHospitalIndividual) && (
//       <>
//         <div className="border-b pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <FormInput
//               label="Hospital Name"
//               value={formData.hospitalName}
//               onChange={(v) => handleInputChange('hospitalName', v)}
//             />
//             {formData.hospitalDetails && (
//               <>
//                 <FormSelect
//                   label="Hospital Type"
//                   value={formData.hospitalDetails.hospitalType}
//                   onChange={(v) => handleInputChange('hospitalDetails.hospitalType', v)}
//                   options={['Multi-Speciality', 'Maternity Home', 'Diagnostic Center', 'Super Speciality Hospital', 'Dental Case', 'Other']}
//                 />
//                 <FormInput
//                   label="No. of Beds"
//                   type="number"
//                   value={formData.hospitalDetails.beds}
//                   onChange={(v) => handleInputChange('hospitalDetails.beds', v)}
//                 />
//                 <FormInput
//                   label="Year of Establishment"
//                   value={formData.hospitalDetails.establishmentYear}
//                   onChange={(v) => handleInputChange('hospitalDetails.establishmentYear', v)}
//                 />
//                 <FormInput
//                   label="Website"
//                   value={formData.hospitalDetails.website}
//                   onChange={(v) => handleInputChange('hospitalDetails.website', v)}
//                 />
//                 <FormSelect
//                   label="Ownership Type"
//                   value={formData.hospitalDetails.ownershipType}
//                   onChange={(v) => handleInputChange('hospitalDetails.ownershipType', v)}
//                   options={['Private', 'Government', 'Trust', 'Corporate']}
//                 />
//                 <FormInput
//                   label="Director Name"
//                   value={formData.hospitalDetails.director?.name || ''}
//                   onChange={(v) => handleInputChange('hospitalDetails.director.name', v)}
//                 />
//                 <FormInput
//                   label="Director Contact"
//                   value={formData.hospitalDetails.director?.contact || ''}
//                   onChange={(v) => handleInputChange('hospitalDetails.director.contact', v)}
//                 />
//                 <FormInput
//                   label="Director Email"
//                   type="email"
//                   value={formData.hospitalDetails.director?.email || ''}
//                   onChange={(v) => handleInputChange('hospitalDetails.director.email', v)}
//                 />
//                 <FormInput
//                   label="Admin Name"
//                   value={formData.hospitalDetails.admin?.name || ''}
//                   onChange={(v) => handleInputChange('hospitalDetails.admin.name', v)}
//                 />
//                 <FormInput
//                   label="Admin Contact"
//                   value={formData.hospitalDetails.admin?.contact || ''}
//                   onChange={(v) => handleInputChange('hospitalDetails.admin.contact', v)}
//                 />
//                 <FormInput
//                   label="Admin Email"
//                   type="email"
//                   value={formData.hospitalDetails.admin?.email || ''}
//                   onChange={(v) => handleInputChange('hospitalDetails.admin.email', v)}
//                 />
//               </>
//             )}
//           </div>
//         </div>

//         {/* Hospital Address */}
//         {formData.hospitalAddress && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Address</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="col-span-3">
//                 <FormInput
//                   label="Address"
//                   value={formData.hospitalAddress.address}
//                   onChange={(v) => handleInputChange('hospitalAddress.address', v)}
//                 />
//               </div>
//               <FormInput
//                 label="Pin Code"
//                 value={formData.hospitalAddress.pinCode}
//                 onChange={(v) => handleInputChange('hospitalAddress.pinCode', v)}
//               />
//               <FormInput
//                 label="City"
//                 value={formData.hospitalAddress.city}
//                 onChange={(v) => handleInputChange('hospitalAddress.city', v)}
//               />
//               <FormInput
//                 label="Taluka"
//                 value={formData.hospitalAddress.taluka}
//                 onChange={(v) => handleInputChange('hospitalAddress.taluka', v)}
//               />
//               <FormInput
//                 label="District"
//                 value={formData.hospitalAddress.district}
//                 onChange={(v) => handleInputChange('hospitalAddress.district', v)}
//               />
//               <FormInput
//                 label="State"
//                 value={formData.hospitalAddress.state}
//                 onChange={(v) => handleInputChange('hospitalAddress.state', v)}
//               />
//               <FormInput
//                 label="Country"
//                 value={formData.hospitalAddress.country}
//                 onChange={(v) => handleInputChange('hospitalAddress.country', v)}
//               />
//             </div>
//           </div>
//         )}
//       </>
//     )
//   }

//   {/* Contact Information */ }
//   <div className="border-b pb-6 mb-6">
//     <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Contact Information</h2>
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <FormInput
//         label="Phone Number"
//         value={formData.phoneNumber || formData.contactDetails?.phoneNumber || ''}
//         onChange={(v) => {
//           handleInputChange('phoneNumber', v);
//           if (formData.contactDetails) {
//             handleInputChange('contactDetails.phoneNumber', v);
//           }
//         }}
//       />
//       <FormInput
//         label="WhatsApp Number"
//         value={formData.whatsappNumber || formData.contactDetails?.whatsapp || ''}
//         onChange={(v) => {
//           handleInputChange('whatsappNumber', v);
//           if (formData.contactDetails) {
//             handleInputChange('contactDetails.whatsapp', v);
//           }
//         }}
//       />
//       <FormInput
//         label="Email"
//         type="email"
//         value={formData.email || formData.contactDetails?.emailId || ''}
//         onChange={(v) => {
//           handleInputChange('email', v);
//           if (formData.contactDetails) {
//             handleInputChange('contactDetails.emailId', v);
//           }
//         }}
//       />
//     </div>
//   </div>

//   {/* Residential Address (for Individual/Hospital+Individual) */ }
//   {
//     (isIndividual || isHospitalIndividual) && formData.contactDetails?.currentAddress && (
//       <div className="border-b pb-6 mb-6">
//         <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Residential Address</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="col-span-3">
//             <FormInput
//               label="Address"
//               value={formData.contactDetails.currentAddress.address}
//               onChange={(v) => handleInputChange('contactDetails.currentAddress.address', v)}
//             />
//           </div>
//           <FormInput
//             label="Pin Code"
//             value={formData.contactDetails.currentAddress.pinCode}
//             onChange={(v) => handleInputChange('contactDetails.currentAddress.pinCode', v)}
//           />
//           <FormInput
//             label="City"
//             value={formData.contactDetails.currentAddress.city}
//             onChange={(v) => handleInputChange('contactDetails.currentAddress.city', v)}
//           />
//           <FormInput
//             label="Taluka"
//             value={formData.contactDetails.currentAddress.taluka}
//             onChange={(v) => handleInputChange('contactDetails.currentAddress.taluka', v)}
//           />
//           <FormInput
//             label="District"
//             value={formData.contactDetails.currentAddress.district}
//             onChange={(v) => handleInputChange('contactDetails.currentAddress.district', v)}
//           />
//           <FormInput
//             label="State"
//             value={formData.contactDetails.currentAddress.state}
//             onChange={(v) => handleInputChange('contactDetails.currentAddress.state', v)}
//           />
//           <FormInput
//             label="Country"
//             value={formData.contactDetails.currentAddress.country}
//             onChange={(v) => handleInputChange('contactDetails.currentAddress.country', v)}
//           />
//         </div>
//       </div>
//     )
//   }

//   {/* Remarks */ }
//   <div className="border-b pb-6 mb-6">
//     <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Remarks</h2>
//     <textarea
//       value={formData.remarks}
//       onChange={(e) => handleInputChange('remarks', e.target.value)}
//       rows={4}
//       className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#15BBB3] focus:border-[#15BBB3]"
//       placeholder="Enter remarks..."
//     />
//   </div>

//   {/* Documents */ }
//   <div className="pb-6 mb-6">
//     <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Documents</h2>

//     {(isIndividual || isHospitalIndividual) && (
//       <div className="mb-6">
//         <h3 className="text-lg font-medium text-blue-600 mb-3">Individual Documents</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FileUploadInput
//             label="Aadhar"
//             fileType="aadhar"
//             currentFile={formData.documents.aadhar || doctor?.documents?.aadhar}
//             onFileSelect={(file) => handleFileUpload(file, 'aadhar')}
//           />
//           <FileUploadInput
//             label="PAN"
//             fileType="pan"
//             currentFile={formData.documents.pan || doctor?.documents?.pan}
//             onFileSelect={(file) => handleFileUpload(file, 'pan')}
//           />
//           <FileUploadInput
//             label="Medical Registration"
//             fileType="medicalRegistration"
//             currentFile={formData.documents.medicalRegistration || doctor?.documents?.medicalRegistration}
//             onFileSelect={(file) => handleFileUpload(file, 'medicalRegistration')}
//           />
//           <FileUploadInput
//             label="Additional Qualification"
//             fileType="additionalQualification"
//             currentFile={formData.documents.additionalQualification || doctor?.documents?.additionalQualification}
//             onFileSelect={(file) => handleFileUpload(file, 'additionalQualification')}
//           />
//           <FileUploadInput
//             label="Visiting Card"
//             fileType="visitingCard"
//             currentFile={formData.documents.visitingCard || doctor?.documents?.visitingCard}
//             onFileSelect={(file) => handleFileUpload(file, 'visitingCard')}
//           />
//           <FileUploadInput
//             label="Bank Details"
//             fileType="bankDetails"
//             currentFile={formData.documents.bankDetails || doctor?.documents?.bankDetails}
//             onFileSelect={(file) => handleFileUpload(file, 'bankDetails')}
//           />
//           {/* Legacy documents */}
//           <FileUploadInput
//             label="License/Registration"
//             fileType="license"
//             currentFile={formData.documents.license || doctor?.documents?.license}
//             onFileSelect={(file) => handleFileUpload(file, 'license')}
//           />
//           <FileUploadInput
//             label="Qualification Document"
//             fileType="qualificationDoc"
//             currentFile={formData.documents.qualificationDoc || doctor?.documents?.qualificationDoc}
//             onFileSelect={(file) => handleFileUpload(file, 'qualificationDoc')}
//           />
//         </div>
//       </div>
//     )}

//     {(isHospital || isHospitalIndividual) && (
//       <div className="mb-6">
//         <h3 className="text-lg font-medium text-green-600 mb-3">Hospital Documents</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FileUploadInput
//             label="Hospital PAN Document"
//             fileType="hospitalPanDocument"
//             currentFile={formData.documents.hospitalPanDocument || doctor?.documents?.hospitalPanDocument}
//             onFileSelect={(file) => handleFileUpload(file, 'hospitalPanDocument')}
//           />
//           <FileUploadInput
//             label="Registration Certificate"
//             fileType="registrationCertificate"
//             currentFile={formData.documents.registrationCertificate || doctor?.documents?.registrationCertificate}
//             onFileSelect={(file) => handleFileUpload(file, 'registrationCertificate')}
//           />
//           <FileUploadInput
//             label="Hospital GST Document"
//             fileType="hospitalGstDocument"
//             currentFile={formData.documents.hospitalGstDocument || doctor?.documents?.hospitalGstDocument}
//             onFileSelect={(file) => handleFileUpload(file, 'hospitalGstDocument')}
//           />
//           <FileUploadInput
//             label="Owner PAN Card"
//             fileType="ownerPanCard"
//             currentFile={formData.documents.ownerPanCard || doctor?.documents?.ownerPanCard}
//             onFileSelect={(file) => handleFileUpload(file, 'ownerPanCard')}
//           />
//           <FileUploadInput
//             label="Owner Aadhaar Card"
//             fileType="ownerAadhaarCard"
//             currentFile={formData.documents.ownerAadhaarCard || doctor?.documents?.ownerAadhaarCard}
//             onFileSelect={(file) => handleFileUpload(file, 'ownerAadhaarCard')}
//           />
//           {/* Legacy documents */}
//           <FileUploadInput
//             label="License/Registration"
//             fileType="license"
//             currentFile={formData.documents.license || doctor?.documents?.license}
//             onFileSelect={(file) => handleFileUpload(file, 'license')}
//           />
//           <FileUploadInput
//             label="Qualification Document"
//             fileType="qualificationDoc"
//             currentFile={formData.documents.qualificationDoc || doctor?.documents?.qualificationDoc}
//             onFileSelect={(file) => handleFileUpload(file, 'qualificationDoc')}
//           />
//         </div>
//       </div>
//     )}

//     {/* Other documents - shown for all types - only show documents not already displayed in specific fields */}
//     <div className="mb-6">
//       <h3 className="text-lg font-medium text-gray-700 mb-3">Other Documents</h3>
//       <div className="space-y-2">
//         {doctor?.documents?.otherDocs && doctor.documents.otherDocs.length > 0 && (
//           <>
//             {doctor.documents.otherDocs
//               .filter(doc => {
//                 // Filter out documents that are already shown in specific fields
//                 const allSpecificDocs = [
//                   doctor.documents.hospitalPanDocument,
//                   doctor.documents.registrationCertificate,
//                   doctor.documents.hospitalGstDocument,
//                   doctor.documents.ownerPanCard,
//                   doctor.documents.ownerAadhaarCard,
//                   doctor.documents.license,
//                   doctor.documents.qualificationDoc,
//                   doctor.documents.aadhar,
//                   doctor.documents.pan,
//                   doctor.documents.medicalRegistration,
//                   doctor.documents.additionalQualification,
//                   doctor.documents.visitingCard,
//                   doctor.documents.bankDetails
//                 ].filter(path => path); // Remove null/undefined values

//                 // Return true only if this document is not in the specific docs
//                 return !allSpecificDocs.includes(doc);
//               })
//               .map((doc, idx) => (
//                 <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                   <span className="text-sm text-gray-700 truncate">{doc.split('/').pop()}</span>
//                   <div className="flex space-x-2">
//                     <button
//                       type="button"
//                       onClick={() => handleDocumentClick(doc)}
//                       className="text-xs text-blue-600 hover:underline"
//                     >
//                       View
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         // Remove document from the otherDocs array
//                         setFormData(prev => ({
//                           ...prev,
//                           documents: {
//                             ...prev.documents,
//                             otherDocs: prev.documents.otherDocs.filter((_, i) => i !== idx)
//                           }
//                         }));
//                         // Update uploaded files state
//                         setUploadedFiles(prev => ({
//                           ...prev,
//                           otherDocs: prev.otherDocs ? prev.otherDocs.filter((_, i) => i !== idx) : []
//                         }));
//                       }}
//                       className="text-xs text-red-600 hover:underline"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//           </>
//         )}
//         <div className="mt-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Document</label>
//           <div className="flex items-center gap-2">
//             <input
//               type="file"
//               onChange={(e) => {
//                 const file = e.target.files[0];
//                 if (file) {
//                   handleFileUpload(file, 'otherDocs');
//                 }
//               }}
//               accept="image/*,.pdf,.doc,.docx"
//               className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* Action Buttons */ }
//   <div className="flex justify-center space-x-3 mt-6 pt-6 border-t">
//     <button
//       onClick={() => navigate(`/view-doctor/${id}`)}
//       className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
//     >
//       Cancel
//     </button>
//     <button
//       onClick={handleSave}
//       disabled={saving}
//       className="bg-[#15BBB3] text-white px-6 py-2 rounded hover:bg-[#13a89e] disabled:opacity-50"
//     >
//       {saving ? 'Saving...' : 'Save Changes'}
//     </button>
//   </div>



//   // Render view mode (existing code)
//   return (
//     <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">View Doctor Details</h1>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//           >
//             Back
//           </button>
//         </div>

//         {/* Basic Information */}
//         <div className="border-b pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Basic Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Membership ID</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.membershipId || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.doctorId || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Membership Date</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {/* {doctor.membershipDate ? formatDate(doctor.membershipDate) : "N/A"} */}
//                 {doctor.createdAt ? formatDate(doctor.createdAt) : "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Type of Membership</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.membershipType || doctor.doctorType || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Status</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.status || "N/A"}
//               </div>
//             </div>
//             {/* <div>
//               <label className="block text-sm font-medium text-gray-700">Created Date</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.createdAt ? formatDate(doctor.createdAt) : "N/A"}
//               </div> */}
//             {/* </div> */}
//           </div>
//         </div>

//         {/* Doctor/Individual Information */}
//         {(isIndividual || isHospitalIndividual) && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Doctor Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.fullName || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.dateOfBirth ? formatDate(doctor.dateOfBirth) : "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Qualification</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.qualification || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Specialization</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.specialization && doctor.specialization.length > 0
//                     ? doctor.specialization.join(", ")
//                     : "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Reg No</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.licenseNumber || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Registration Year</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.registrationYear || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.aadharNumber || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">PAN Number</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.panNumber || "N/A"}
//                 </div>
//               </div>
//               {/* <div>
//                 <label className="block text-sm font-medium text-gray-700">Experience</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.experience || "N/A"}
//                 </div>
//               </div> */}
//             </div>
//           </div>
//         )}

//         {/* Spouse Information - Show only if the doctor is linked as a spouse */}
//         {doctor.isLinked && doctor.relationshipType === 'spouse' && doctor.linkedDoctor && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Spouse Doctors Information</h2>

//             {/* Doctor 1 Information */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                 <span className="bg-[#15BBB3] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
//                 Doctor 1 Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.fullName || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.doctorId || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Registration No</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.licenseNumber || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.email || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.phoneNumber || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Qualification</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.qualification || "N/A"}
//                   </div>
//                 </div>
//               </div>

//               {/* Doctor 1 Documents */}
//               <div className="mt-4">
//                 <h4 className="text-md font-medium text-gray-800 mb-2">Doctor 1 Documents</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {doctor.documents?.aadhar && (
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.aadhar)}
//                       className="p-2 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left text-sm"
//                     >
//                       Aadhar: {doctor.documents.aadhar.split("/").pop() || "View Document"}
//                     </button>
//                   )}
//                   {doctor.documents?.pan && (
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.pan)}
//                       className="p-2 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left text-sm"
//                     >
//                       PAN: {doctor.documents.pan.split("/").pop() || "View Document"}
//                     </button>
//                   )}
//                   {doctor.documents?.medicalRegistration && (
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.medicalRegistration)}
//                       className="p-2 bg-yellow-50 border border-yellow-300 rounded text-yellow-700 hover:bg-yellow-100 text-left text-sm"
//                     >
//                       Medical Registration: {doctor.documents.medicalRegistration.split("/").pop() || "View Document"}
//                     </button>
//                   )}
//                   {doctor.documents?.otherDocs && doctor.documents.otherDocs.length > 0 &&
//                     doctor.documents.otherDocs.map((doc, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => handleDocumentClick(doc)}
//                         className="p-2 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left text-sm"
//                       >
//                         Other Doc {idx + 1}: {doc.split("/").pop() || `Document ${idx + 1}`}
//                       </button>
//                     ))
//                   }
//                 </div>
//               </div>
//             </div>

//             {/* Doctor 2 Information */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                 <span className="bg-[#15BBB3] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
//                 Doctor 2 Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.fullName || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.doctorId || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Registration No</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.licenseNumber || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.email || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.phoneNumber || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Qualification</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.qualification || "N/A"}
//                   </div>
//                 </div>
//               </div>

//               {/* Doctor 2 Documents */}
//               <div className="mt-4">
//                 <h4 className="text-md font-medium text-gray-800 mb-2">Doctor 2 Documents</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {doctor.linkedDoctor.documents?.aadhar && (
//                     <button
//                       onClick={() => handleDocumentClick(doctor.linkedDoctor.documents.aadhar)}
//                       className="p-2 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left text-sm"
//                     >
//                       Aadhar: {doctor.linkedDoctor.documents.aadhar.split("/").pop() || "View Document"}
//                     </button>
//                   )}
//                   {doctor.linkedDoctor.documents?.pan && (
//                     <button
//                       onClick={() => handleDocumentClick(doctor.linkedDoctor.documents.pan)}
//                       className="p-2 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left text-sm"
//                     >
//                       PAN: {doctor.linkedDoctor.documents.pan.split("/").pop() || "View Document"}
//                     </button>
//                   )}
//                   {doctor.linkedDoctor.documents?.medicalRegistration && (
//                     <button
//                       onClick={() => handleDocumentClick(doctor.linkedDoctor.documents.medicalRegistration)}
//                       className="p-2 bg-yellow-50 border border-yellow-300 rounded text-yellow-700 hover:bg-yellow-100 text-left text-sm"
//                     >
//                       Medical Registration: {doctor.linkedDoctor.documents.medicalRegistration.split("/").pop() || "View Document"}
//                     </button>
//                   )}
//                   {doctor.linkedDoctor.documents?.otherDocs && doctor.linkedDoctor.documents.otherDocs.length > 0 &&
//                     doctor.linkedDoctor.documents.otherDocs.map((doc, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => handleDocumentClick(doc)}
//                         className="p-2 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left text-sm"
//                       >
//                         Other Doc {idx + 1}: {doc.split("/").pop() || `Document ${idx + 1}`}
//                       </button>
//                     ))
//                   }
//                 </div>
//               </div>
//             </div>

//             {/* Relationship Information */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//               <h3 className="text-md font-medium text-gray-800 mb-3">Relationship Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Relationship Type</label>
//                   <div className="mt-1 p-2 bg-white border border-gray-300 rounded text-gray-700">
//                     {doctor.relationshipType || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Linked Doctor ID</label>
//                   <div className="mt-1 p-2 bg-white border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor._id || "N/A"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Hospital Information */}
//         {(isHospital || isHospitalIndividual) && doctor.hospitalName && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalName || "N/A"}
//                 </div>
//               </div>
//               {doctor.hospitalDetails && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Hospital Type</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.hospitalType || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">No. of Beds</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.beds || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Year of Establishment</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.establishmentYear || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Website</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.website || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Ownership Type</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.ownershipType || "N/A"}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {doctor.hospitalDetails?.director && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Director Name</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.director.name || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Director Contact</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.director.contact || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Director Email</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.director.email || "N/A"}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {doctor.hospitalDetails?.admin && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Admin Name</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.admin.name || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Admin Contact</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.admin.contact || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Admin Email</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.admin.email || "N/A"}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {doctor.hospitalDetails?.departments && doctor.hospitalDetails.departments.length > 0 && (
//                 <div className="col-span-3">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
//                   <div className="flex flex-wrap gap-2">
//                     {doctor.hospitalDetails.departments.map((dept, idx) => (
//                       <span
//                         key={idx}
//                         className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                       >
//                         {dept}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Hospital Address */}
//         {(isHospital || isHospitalIndividual) && doctor.hospitalAddress && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Address</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="col-span-3">
//                 <label className="block text-sm font-medium text-gray-700">Address</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.address || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Pin Code</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.pinCode || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">City</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.city || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Taluka</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.taluka || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">District</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.district || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">State</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.state || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Country</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.country || "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Contact Information */}
//         <div className="border-b pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Contact Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.phoneNumber || doctor.contactDetails?.phoneNumber || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.whatsappNumber || doctor.contactDetails?.whatsapp || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.email || doctor.contactDetails?.emailId || "N/A"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Residential Address (for Individual/Hospital+Individual) */}
//         {(isIndividual || isHospitalIndividual) && doctor.contactDetails?.currentAddress && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Residential Address</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="col-span-3">
//                 <label className="block text-sm font-medium text-gray-700">Address</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.address || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Pin Code</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.pinCode || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">City</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.city || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Taluka</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.taluka || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">District</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.district || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">State</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.state || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Country</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.country || "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Status & Follow-up */}
//         <div className="border-b pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Status & Follow-up</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Enquiry Status</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.typeOfEnquiry || "N/A"}
//               </div>
//             </div>
//             {doctor.followUps && doctor.followUps.length > 0 && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Last Follow-up Date</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {formatDate(doctor.followUps[doctor.followUps.length - 1].date)}
//                 </div>
//               </div>
//             )}
//           </div>
//           {doctor.followUps && doctor.followUps.length > 0 && (
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up History</label>
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 {doctor.followUps.map((followUp, idx) => (
//                   <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="font-medium text-sm">Notes: <strong>{followUp.notes || "No notes"} </strong></p>
//                         <p className="font-medium text-sm">FullName: <strong>{followUp.createdBy?.fullName || "N/A"}</strong> </p>
//                         <p className="font-medium text-sm">Role: <strong> {followUp.createdBy?.role || "N/A"}</strong></p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Date: {formatDate(followUp.date)} | Type: {followUp.type || "N/A"}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           Created at: {formatDate(followUp.createdAt)}
//                         </p>
//                         {followUp.nextFollowUpDate && (
//                           <p className="text-xs text-gray-500">
//                             Next Follow-up: {formatDate(followUp.nextFollowUpDate)}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Remarks */}
//         {doctor.remarks && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Remarks</h2>
//             <div className="p-3 bg-gray-50 border border-gray-300 rounded text-gray-700">
//               {doctor.remarks}
//             </div>
//           </div>
//         )}

//         {/* Documents */}
//         <div className="pb-6 mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-[#15BBB3]">Documents</h2>
//             {doctor.documents && (
//               <span className="text-sm text-gray-500">
//                 {[
//                   doctor.documents.aadhar ? 1 : 0,
//                   doctor.documents.pan ? 1 : 0,
//                   doctor.documents.medicalRegistration ? 1 : 0,
//                   doctor.documents.additionalQualification ? 1 : 0,
//                   doctor.documents.visitingCard ? 1 : 0,
//                   doctor.documents.bankDetails ? 1 : 0,
//                   doctor.documents.hospitalPanDocument ? 1 : 0,
//                   doctor.documents.registrationCertificate ? 1 : 0,
//                   doctor.documents.hospitalGstDocument ? 1 : 0,
//                   doctor.documents.ownerPanCard ? 1 : 0,
//                   doctor.documents.ownerAadhaarCard ? 1 : 0,
//                   doctor.documents.otherDocs?.length || 0
//                 ].reduce((a, b) => a + b, 0)} document(s)
//               </span>
//             )}
//           </div>

//           {(isIndividual || isHospitalIndividual) && (
//             <div className="mb-6">
//               <h3 className="text-lg font-medium text-blue-600 mb-3">Individual Documents</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {doctor.documents?.aadhar && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Aadhar
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.aadhar)}
//                       className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.aadhar.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {doctor.documents?.pan && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       PAN
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.pan)}
//                       className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.pan.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {doctor.documents?.medicalRegistration && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Medical Registration
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.medicalRegistration)}
//                       className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.medicalRegistration.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {doctor.documents?.additionalQualification && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Additional Qualification
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.additionalQualification)}
//                       className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.additionalQualification.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {doctor.documents?.visitingCard && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Visiting Card
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.visitingCard)}
//                       className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.visitingCard.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {doctor.documents?.bankDetails && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Bank Details
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.bankDetails)}
//                       className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.bankDetails.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {/* Legacy individual document */}
//                 {doctor.documents?.license && !doctor.documents.medicalRegistration && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       License/Registration
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.license)}
//                       className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.license.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {doctor.documents?.qualificationDoc && !doctor.documents.pan && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Qualification Document
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.qualificationDoc)}
//                       className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.qualificationDoc.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {(isHospital || isHospitalIndividual) && (
//             <div className="mb-6">
//               <h3 className="text-lg font-medium text-green-600 mb-3">Hospital Documents</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {doctor.documents?.hospitalPanDocument && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Hospital PAN Document
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.hospitalPanDocument)}
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.hospitalPanDocument.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {doctor.documents?.registrationCertificate && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Registration Certificate
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.registrationCertificate)}
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.registrationCertificate.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {doctor.documents?.hospitalGstDocument && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Hospital GST Document
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.hospitalGstDocument)}
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.hospitalGstDocument.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {doctor.documents?.ownerPanCard && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Owner PAN Card
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.ownerPanCard)}
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.ownerPanCard.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {doctor.documents?.ownerAadhaarCard && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Owner Aadhaar Card
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.ownerAadhaarCard)}
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.ownerAadhaarCard.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {/* Legacy hospital document */}
//                 {doctor.documents?.license && !doctor.documents.medicalRegistration && !doctor.documents.registrationCertificate && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       License/Registration
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.license)}
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.license.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//                 {doctor.documents?.qualificationDoc && !doctor.documents.pan && !doctor.documents.hospitalGstDocument && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Qualification Document
//                     </label>
//                     <button
//                       onClick={() => handleDocumentClick(doctor.documents.qualificationDoc)}
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.qualificationDoc.split("/").pop() || "View Document"}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Other documents - shown for all types - only show documents not already displayed in specific fields */}
//           {doctor.documents?.otherDocs && doctor.documents.otherDocs.length > 0 && (
//             <div className="mb-6">
//               <h3 className="text-lg font-medium text-gray-700 mb-3">Other Documents</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                 {doctor.documents.otherDocs
//                   .filter(doc => {
//                     // Filter out documents that are already shown in specific fields
//                     const allSpecificDocs = [
//                       doctor.documents.hospitalPanDocument,
//                       doctor.documents.registrationCertificate,
//                       doctor.documents.hospitalGstDocument,
//                       doctor.documents.ownerPanCard,
//                       doctor.documents.ownerAadhaarCard,
//                       doctor.documents.license,
//                       doctor.documents.qualificationDoc,
//                       doctor.documents.aadhar,
//                       doctor.documents.pan,
//                       doctor.documents.medicalRegistration,
//                       doctor.documents.additionalQualification,
//                       doctor.documents.visitingCard,
//                       doctor.documents.bankDetails
//                     ].filter(path => path); // Remove null/undefined values

//                     // Return true only if this document is not in the specific docs
//                     return !allSpecificDocs.includes(doc);
//                   })
//                   .map((doc, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => handleDocumentClick(doc)}
//                       className="p-3 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left"
//                     >
//                       <span className="truncate block text-sm">
//                         {doc.split("/").pop() || `Document ${idx + 1}`}
//                       </span>
//                     </button>
//                   ))}
//               </div>
//             </div>
//           )}

//           {(!doctor.documents ||
//             (!doctor.documents.aadhar &&
//               !doctor.documents.pan &&
//               !doctor.documents.medicalRegistration &&
//               !doctor.documents.additionalQualification &&
//               !doctor.documents.visitingCard &&
//               !doctor.documents.bankDetails &&
//               !doctor.documents.hospitalPanDocument &&
//               !doctor.documents.registrationCertificate &&
//               !doctor.documents.hospitalGstDocument &&
//               !doctor.documents.ownerPanCard &&
//               !doctor.documents.ownerAadhaarCard &&
//               !doctor.documents.otherDocs || doctor.documents.otherDocs.length === 0)) && (
//               <div className="text-center text-gray-500 py-4">
//                 No documents uploaded
//               </div>
//             )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-center space-x-3 mt-6 pt-6 border-t">
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
//           >
//             Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );


// };

// export default ViewDoctorForm;





// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from "react-toastify";

// // Helper function to format dates
// const formatDate = (dateString) => {
//   if (!dateString) return "N/A";
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// };

// // ================= MAIN COMPONENT =================
// const ViewDoctor = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Array to hold multiple doctors (Main + Spouse/Linked)
//   const [doctors, setDoctors] = useState([]);





// const buildFileUrl = (filePath) => {
//   if (!filePath) return '#';

//   // uploads ke baad ka path nikaalo
//   const index = filePath.toLowerCase().indexOf('uploads');
//   if (index === -1) return '#';

//   const relativePath = filePath
//     .substring(index)
//     .replace(/\\/g, '/'); // Windows → URL

//   return `http://localhost:3000/${relativePath}`;
// };



//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         setLoading(true);
//         const response = await apiClient.get(apiEndpoints.doctors.getWithSpouse(id));
//         if (response.data.success) {
//           const doctorData = response.data.data;
//           // If the doctor is linked with a spouse, use mainDoctor data
//           // Otherwise, use the original data structure
//           const processedDoctorData = doctorData.isLinked ? { ...doctorData.mainDoctor, isLinked: true, relationshipType: doctorData.relationshipType, linkedDoctor: doctorData.linkedDoctor } : doctorData;
//           setDoctor(processedDoctorData);

//           // Fetch and set all linked doctors
//           const docs = doctorData.isLinked
//             ? [doctorData.mainDoctor, doctorData.linkedDoctor]
//             : [doctorData];
//           setDoctors(docs);
//         } else {
//           setError("Failed to fetch doctor details");
//         }
//       } catch (err) {
//         console.error("Error fetching doctor:", err);
//         setError(err.response?.data?.message || "Failed to load doctor details");
//         toast.error("Failed to load doctor details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchDoctor();
//     }
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-lg">Loading doctor details...</div>
//       </div>
//     );
//   }

//   if (error || !doctor) {
//     return (
//       <div className="p-8 text-center">
//         <p className="text-red-600">{error || "Doctor not found"}</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 bg-teal-500 text-white px-4 py-2 rounded"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   const isHospital = doctor.doctorType === "hospital";
//   const isIndividual = doctor.doctorType === "individual";
//   const isHospitalIndividual = doctor.doctorType === "hospital_individual";

//   return (
//     <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">View Doctor Details</h1>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//           >
//             Back
//           </button>
//         </div>

//         {/* Basic Information */}
//         <div className="border-b pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Basic Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Membership ID</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.membershipId || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.doctorId || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Membership Date</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.membershipDate ? formatDate(doctor.membershipDate) : (doctor.createdAt ? formatDate(doctor.createdAt) : "N/A")}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Type of Membership</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.membershipType || doctor.doctorType || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Status</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.status || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Enquiry Status</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.typeOfEnquiry || "N/A"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Doctor/Individual Information */}
//         {(isIndividual || isHospitalIndividual) && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Doctor Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.fullName || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.dateOfBirth ? formatDate(doctor.dateOfBirth) : "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Qualification</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.qualification || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Specialization</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.specialization && doctor.specialization.length > 0
//                     ? doctor.specialization.join(", ")
//                     : "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Reg No</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.licenseNumber || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Registration Year</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.registrationYear || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.aadharNumber || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">PAN Number</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.panNumber || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Experience</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.experience || "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Hospital Details for Individual Doctors */}
//         {isIndividual && doctor.hospitalName && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalName || "N/A"}
//                 </div>
//               </div>
//               {doctor.hospitalAddress && (
//                 <>
//                   <div className="col-span-3">
//                     <label className="block text-sm font-medium text-gray-700">Hospital Address</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.address || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Pin Code</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.pinCode || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">City</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.city || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Taluka</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.taluka || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">District</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.district || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">State</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.state || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Country</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.country || "N/A"}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Spouse Information - Show only if the doctor is linked as a spouse */}
//         {doctor.isLinked && doctor.relationshipType === 'spouse' && doctor.linkedDoctor && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Spouse Doctors Information</h2>

//             {/* Doctor 1 Information */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                 <span className="bg-[#15BBB3] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
//                 Doctor 1 Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.fullName || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.doctorId || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Registration No</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.licenseNumber || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.email || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.phoneNumber || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Qualification</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.qualification || "N/A"}
//                   </div>
//                 </div>
//               </div>

//               {/* Doctor 1 Documents */}
//               <div className="mt-4">
//                 <h4 className="text-md font-medium text-gray-800 mb-2">Doctor 1 Documents</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {doctor.documents?.aadhar && (
//                     <a
//                       href={buildFileUrl(doctor.documents.aadhar)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
//                     >
//                       Aadhar: {doctor.documents.aadhar.split("/").pop() || "View Document"}
//                     </a>
//                   )}
//                   {doctor.documents?.pan && (
//                     <a
//                       // href={`${'http://localhost:3000'}/uploads/${doctor.documents.pan.split('/').pop()}`}
//                       href={buildFileUrl(doctor.documents.pan)}

//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
//                     >
//                       PAN: {doctor.documents.pan.split("/").pop() || "View Document"}
//                     </a>
//                   )}
//                   {doctor.documents?.medicalRegistration && (
//                     <a
//                                             href={buildFileUrl(doctor.documents.medicalRegistration)}

//                       // href={`${'http://localhost:3000'}/uploads/${doctor.documents.medicalRegistration.split('/').pop()}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 bg-yellow-50 border border-yellow-300 rounded text-yellow-700 hover:bg-yellow-100 text-left"
//                     >
//                       Medical Registration: {doctor.documents.medicalRegistration.split("/").pop() || "View Document"}
//                     </a>
//                   )}
//                   {doctor.documents?.otherDocs && doctor.documents.otherDocs.length > 0 &&
//                     doctor.documents.otherDocs.map((doc, idx) => (
//                       <a
//                         key={idx}
//                         // href={`${'http://localhost:3000'}/uploads/${doc.split('/').pop()}`}
//                           href={buildFileUrl(doc)}

//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="p-2 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left"
//                       >
//                         Other Doc {idx + 1}: {doc.split("/").pop() || `Document ${idx + 1}`}
//                       </a>
//                     ))
//                   }
//                 </div>
//               </div>
//             </div>

//             {/* Doctor 2 Information */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                 <span className="bg-[#15BBB3] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
//                 Doctor 2 Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.fullName || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.doctorId || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Registration No</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.licenseNumber || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.email || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.phoneNumber || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Qualification</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.qualification || "N/A"}
//                   </div>
//                 </div>
//               </div>

//               {/* Doctor 2 Documents */}
//               <div className="mt-4">
//                 <h4 className="text-md font-medium text-gray-800 mb-2">Doctor 2 Documents</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {doctor.linkedDoctor.documents?.aadhar && (
//                     <a
//                       // href={`${'http://localhost:3000'}/uploads/${doctor.linkedDoctor.documents.aadhar.split('/').pop()}`}
//    href={buildFileUrl(doctor.linkedDoctor.documents.aadhar)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left"
//                     >
//                       Aadhar: {doctor.linkedDoctor.documents.aadhar.split("/").pop() || "View Document"}
//                     </a>
//                   )}
//                   {doctor.linkedDoctor.documents?.pan && (
//                     <a
//                       // href={`${'http://localhost:3000'}/uploads/${doctor.linkedDoctor.documents.pan.split('/').pop()}`}
//                        href={buildFileUrl(doctor.linkedDoctor.documents.pan)}

//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left"
//                     >
//                       PAN: {doctor.linkedDoctor.documents.pan.split("/").pop() || "View Document"}
//                     </a>
//                   )}
//                   {doctor.linkedDoctor.documents?.medicalRegistration && (
//                     <a
//                       // href={`${'http://localhost:3000'}/uploads/${doctor.linkedDoctor.documents.medicalRegistration.split('/').pop()}`}
//                                            href={buildFileUrl(doctor.linkedDoctor.documents.medicalRegistration)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 bg-yellow-50 border border-yellow-300 rounded text-yellow-700 hover:bg-yellow-100 text-left"
//                     >
//                       Medical Registration: {doctor.linkedDoctor.documents.medicalRegistration.split("/").pop() || "View Document"}
//                     </a>
//                   )}
//                   {doctor.linkedDoctor.documents?.otherDocs && doctor.linkedDoctor.documents.otherDocs.length > 0 &&
//                     doctor.linkedDoctor.documents.otherDocs.map((doc, idx) => (
//                       <a
//                         key={idx}
//                         href={buildFileUrl(doc)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="p-2 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left"
//                       >
//                         Other Doc {idx + 1}: {doc.split("/").pop() || `Document ${idx + 1}`}
//                       </a>
//                     ))
//                   }
//                 </div>
//               </div>
//             </div>

//             {/* Relationship Information */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//               <h3 className="text-md font-medium text-gray-800 mb-3">Relationship Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Relationship Type</label>
//                   <div className="mt-1 p-2 bg-white border border-gray-300 rounded text-gray-700">
//                     {doctor.relationshipType || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Linked Doctor ID</label>
//                   <div className="mt-1 p-2 bg-white border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor._id || "N/A"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Hospital Information */}
//         {(isHospital || isHospitalIndividual) && doctor.hospitalName && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalName || "N/A"}
//                 </div>
//               </div>
//               {doctor.hospitalDetails && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Hospital Type</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.hospitalType || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">No. of Beds</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.beds || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Year of Establishment</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.establishmentYear || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Website</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.website || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Ownership Type</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.ownershipType || "N/A"}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {doctor.hospitalDetails?.director && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Director Name</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.director.name || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Director Contact</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.director.contact || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Director Email</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.director.email || "N/A"}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {doctor.hospitalDetails?.admin && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Admin Name</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.admin.name || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Admin Contact</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.admin.contact || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Admin Email</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.admin.email || "N/A"}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {doctor.hospitalDetails?.departments && doctor.hospitalDetails.departments.length > 0 && (
//                 <div className="col-span-3">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
//                   <div className="flex flex-wrap gap-2">
//                     {doctor.hospitalDetails.departments.map((dept, idx) => (
//                       <span
//                         key={idx}
//                         className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                       >
//                         {dept}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Hospital Address */}
//         {(isHospital || isHospitalIndividual) && doctor.hospitalAddress && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Address</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="col-span-3">
//                 <label className="block text-sm font-medium text-gray-700">Address</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.address || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Pin Code</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.pinCode || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">City</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.city || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Taluka</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.taluka || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">District</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.district || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">State</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.state || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Country</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.country || "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Contact Information */}
//         <div className="border-b pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Contact Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.phoneNumber || doctor.contactDetails?.phoneNumber || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.whatsappNumber || doctor.contactDetails?.whatsapp || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.email || doctor.contactDetails?.emailId || "N/A"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Residential Address (for Individual/Hospital+Individual) */}
//         {(isIndividual || isHospitalIndividual) && doctor.contactDetails?.currentAddress && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Residential Address</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="col-span-3">
//                 <label className="block text-sm font-medium text-gray-700">Address</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.address || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Pin Code</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.pinCode || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">City</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.city || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Taluka</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.taluka || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">District</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.district || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">State</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.state || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Country</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.country || "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Status & Follow-up */}
//         <div className="border-b pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Status & Follow-up</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Enquiry Status</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.typeOfEnquiry || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Doctor Status</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.doctorStatus || "N/A"}
//               </div>
//             </div>
//             {doctor.followUps && doctor.followUps.length > 0 && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Last Follow-up Date</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {formatDate(doctor.followUps[doctor.followUps.length - 1].date)}
//                 </div>
//               </div>
//             )}
//           </div>
//           {doctor.followUps && doctor.followUps.length > 0 && (
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up History</label>
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 {doctor.followUps.map((followUp, idx) => (
//                   <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="font-medium text-sm">Notes: <strong>{followUp.notes || "No notes"} </strong></p>
//                         <p className="font-medium text-sm">FullName: <strong>{followUp.createdBy?.fullName || "N/A"}</strong> </p>
//                         <p className="font-medium text-sm">Role: <strong> {followUp.createdBy?.role || "N/A"}</strong></p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Date: {formatDate(followUp.date)} | Type: {followUp.type || "N/A"}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           Created at: {formatDate(followUp.createdAt)}
//                         </p>
//                         {followUp.nextFollowUpDate && (
//                           <p className="text-xs text-gray-500">
//                             Next Follow-up: {formatDate(followUp.nextFollowUpDate)}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Remarks */}
//         {doctor.remarks && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Remarks</h2>
//             <div className="p-3 bg-gray-50 border border-gray-300 rounded text-gray-700">
//               {doctor.remarks}
//             </div>
//           </div>
//         )}

//         {/* Documents */}
//         <div className="pb-6 mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-[#15BBB3]">Documents</h2>
//             {doctor.documents && (
//               <span className="text-sm text-gray-500">
//                 {[
//                   doctor.documents.aadhar ? 1 : 0,
//                   doctor.documents.pan ? 1 : 0,
//                   doctor.documents.medicalRegistration ? 1 : 0,
//                   doctor.documents.additionalQualification ? 1 : 0,
//                   doctor.documents.visitingCard ? 1 : 0,
//                   doctor.documents.bankDetails ? 1 : 0,
//                   doctor.documents.hospitalPanDocument ? 1 : 0,
//                   doctor.documents.registrationCertificate ? 1 : 0,
//                   doctor.documents.hospitalGstDocument ? 1 : 0,
//                   doctor.documents.ownerPanCard ? 1 : 0,
//                   doctor.documents.ownerAadhaarCard ? 1 : 0,
//                   doctor.documents.otherDocs?.length || 0
//                 ].reduce((a, b) => a + b, 0)} document(s)
//               </span>
//             )}
//           </div>

//           {(isIndividual || isHospitalIndividual) && (
//             <div className="mb-6">
//               {/* Display documents for each linked doctor */}
//               {doctors && doctors.length > 0 ? (
//                 doctors.map((doc, index) => (
//                   <div key={index} className="mb-8 p-4 bg-blue-50/30 rounded-lg border border-blue-100">
//                     <h3 className="text-lg font-medium text-blue-600 mb-3 border-b border-blue-100 pb-2">
//                       {doctors.length > 1 ? `Doctor ${index + 1} Individual Documents` : 'Individual Documents'}
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {doc.documents?.aadhar && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Aadhar
//                           </label>
//                           <a
//                             href={buildFileUrl(doc.documents.aadhar)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                           >
//                             <span className="truncate block">
//                               {doc.documents.aadhar.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         </div>
//                       )}
//                       {doc.documents?.pan && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             PAN
//                           </label>
//                           <a
//                             href={buildFileUrl(doc.documents.pan)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                           >
//                             <span className="truncate block">
//                               {doc.documents.pan.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         </div>
//                       )}
//                       {doc.documents?.medicalRegistration && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Medical Registration
//                           </label>
//                           <a
//                             href={buildFileUrl(doc.documents.medicalRegistration)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                           >
//                             <span className="truncate block">
//                               {doc.documents.medicalRegistration.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         </div>
//                       )}
//                       {doc.documents?.additionalQualification && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Additional Qualification
//                           </label>
//                           <a
//                             href={buildFileUrl(doc.documents.additionalQualification)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                           >
//                             <span className="truncate block">
//                               {doc.documents.additionalQualification.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         </div>
//                       )}
//                       {doc.documents?.visitingCard && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Visiting Card
//                           </label>
//                           <a
//                             href={buildFileUrl(doc.documents.visitingCard)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                           >
//                             <span className="truncate block">
//                               {doc.documents.visitingCard.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         </div>
//                       )}
//                       {doc.documents?.bankDetails && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Bank Details
//                           </label>
//                           <a
//                             href={buildFileUrl(doc.documents.bankDetails)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                           >
//                             <span className="truncate block">
//                               {doc.documents.bankDetails.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         </div>
//                       )}
//                       {/* Legacy individual document */}
//                       {doc.documents?.license && !doc.documents.medicalRegistration && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             License/Registration
//                           </label>
//                           <a
//                             href={buildFileUrl(doc.documents.license)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                           >
//                             <span className="truncate block">
//                               {doc.documents.license.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         </div>
//                       )}
//                       {doc.documents?.qualificationDoc && !doc.documents.pan && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Qualification Document
//                           </label>
//                           <a
//                             href={buildFileUrl(doc.documents.qualificationDoc)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                           >
//                             <span className="truncate block">
//                               {doc.documents.qualificationDoc.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 // Fallback to original logic if no doctors array exists
//                 <div>
//                   <h3 className="text-lg font-medium text-blue-600 mb-3">Individual Documents</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {doctor.documents?.aadhar && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Aadhar
//                         </label>
//                         <a
//                           href={buildFileUrl(doctor.documents.aadhar)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                         >
//                           <span className="truncate block">
//                             {doctor.documents.aadhar.split("/").pop() || "View Document"}
//                           </span>
//                         </a>
//                       </div>
//                     )}
//                     {doctor.documents?.pan && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           PAN
//                         </label>
//                         <a
//                           href={buildFileUrl(doctor.documents.pan)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                         >
//                           <span className="truncate block">
//                             {doctor.documents.pan.split("/").pop() || "View Document"}
//                           </span>
//                         </a>
//                       </div>
//                     )}
//                     {doctor.documents?.medicalRegistration && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Medical Registration
//                         </label>
//                         <a
//                           href={buildFileUrl(doctor.documents.medicalRegistration)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                         >
//                           <span className="truncate block">
//                             {doctor.documents.medicalRegistration.split("/").pop() || "View Document"}
//                           </span>
//                         </a>
//                       </div>
//                     )}
//                     {doctor.documents?.additionalQualification && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Additional Qualification
//                         </label>
//                         <a
//                           href={buildFileUrl(doctor.documents.additionalQualification)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                         >
//                           <span className="truncate block">
//                             {doctor.documents.additionalQualification.split("/").pop() || "View Document"}
//                           </span>
//                         </a>
//                       </div>
//                     )}
//                     {doctor.documents?.visitingCard && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Visiting Card
//                         </label>
//                         <a
//                           href={buildFileUrl(doctor.documents.visitingCard)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                         >
//                           <span className="truncate block">
//                             {doctor.documents.visitingCard.split("/").pop() || "View Document"}
//                           </span>
//                         </a>
//                       </div>
//                     )}
//                     {doctor.documents?.bankDetails && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Bank Details
//                         </label>
//                         <a
//                           href={buildFileUrl(doctor.documents.bankDetails)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                         >
//                           <span className="truncate block">
//                             {doctor.documents.bankDetails.split("/").pop() || "View Document"}
//                           </span>
//                         </a>
//                       </div>
//                     )}
//                     {/* Legacy individual document */}
//                     {doctor.documents?.license && !doctor.documents.medicalRegistration && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           License/Registration
//                         </label>
//                         <a
//                           href={buildFileUrl(doctor.documents.license)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                         >
//                           <span className="truncate block">
//                             {doctor.documents.license.split("/").pop() || "View Document"}
//                           </span>
//                         </a>
//                       </div>
//                     )}
//                     {doctor.documents?.qualificationDoc && !doctor.documents.pan && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Qualification Document
//                         </label>
//                         <a
//                           href={buildFileUrl(doctor.documents.qualificationDoc)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block"
//                         >
//                           <span className="truncate block">
//                             {doctor.documents.qualificationDoc.split("/").pop() || "View Document"}
//                           </span>
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {(isHospital || isHospitalIndividual) && (
//             <div className="mb-6">
//               <h3 className="text-lg font-medium text-green-600 mb-3">Hospital Documents</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {doctor.documents?.hospitalPanDocument && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Hospital PAN Document
//                     </label>
//                     <a
//                       href={buildFileUrl(doctor.documents.hospitalPanDocument)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.hospitalPanDocument.split("/").pop() || "View Document"}
//                       </span>
//                     </a>
//                   </div>
//                 )}
//                 {doctor.documents?.registrationCertificate && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Registration Certificate
//                     </label>
//                     <a
//                       href={buildFileUrl(doctor.documents.registrationCertificate)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.registrationCertificate.split("/").pop() || "View Document"}
//                       </span>
//                     </a>
//                   </div>
//                 )}
//                 {doctor.documents?.hospitalGstDocument && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Hospital GST Document
//                     </label>
//                     <a
//                       href={buildFileUrl(doctor.documents.hospitalGstDocument)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.hospitalGstDocument.split("/").pop() || "View Document"}
//                       </span>
//                     </a>
//                   </div>
//                 )}
//                 {doctor.documents?.ownerPanCard && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Owner PAN Card
//                     </label>
//                     <a
//                       href={buildFileUrl(doctor.documents.ownerPanCard)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.ownerPanCard.split("/").pop() || "View Document"}
//                       </span>
//                     </a>
//                   </div>
//                 )}
//                 {doctor.documents?.ownerAadhaarCard && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Owner Aadhaar Card
//                     </label>
//                     <a
//                       href={buildFileUrl(doctor.documents.ownerAadhaarCard)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.ownerAadhaarCard.split("/").pop() || "View Document"}
//                       </span>
//                     </a>
//                   </div>
//                 )}
//                 {/* Legacy hospital document */}
//                 {doctor.documents?.license && !doctor.documents.medicalRegistration && !doctor.documents.registrationCertificate && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       License/Registration
//                     </label>
//                     <a
//                       href={buildFileUrl(doctor.documents.license)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.license.split("/").pop() || "View Document"}
//                       </span>
//                     </a>
//                   </div>
//                 )}
//                 {doctor.documents?.qualificationDoc && !doctor.documents.pan && !doctor.documents.hospitalGstDocument && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Qualification Document
//                     </label>
//                     <a
//                       href={buildFileUrl(doctor.documents.qualificationDoc)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block"
//                     >
//                       <span className="truncate block">
//                         {doctor.documents.qualificationDoc.split("/").pop() || "View Document"}
//                       </span>
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Other documents - shown for all types - only show documents not already displayed in specific fields */}
//           {doctor.documents?.otherDocs && doctor.documents.otherDocs.length > 0 && (
//             <div className="mb-6">
//               <h3 className="text-lg font-medium text-gray-700 mb-3">Other Documents</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                 {doctor.documents.otherDocs
//                   .filter(doc => {
//                     // Filter out documents that are already shown in specific fields
//                     const allSpecificDocs = [
//                       doctor.documents.hospitalPanDocument,
//                       doctor.documents.registrationCertificate,
//                       doctor.documents.hospitalGstDocument,
//                       doctor.documents.ownerPanCard,
//                       doctor.documents.ownerAadhaarCard,
//                       doctor.documents.license,
//                       doctor.documents.qualificationDoc,
//                       doctor.documents.aadhar,
//                       doctor.documents.pan,
//                       doctor.documents.medicalRegistration,
//                       doctor.documents.additionalQualification,
//                       doctor.documents.visitingCard,
//                       doctor.documents.bankDetails
//                     ].filter(path => path); // Remove null/undefined values

//                     // Return true only if this document is not in the specific docs
//                     return !allSpecificDocs.includes(doc);
//                   })
//                   .map((doc, idx) => (
//                     <a
//                       key={idx}
//                       href={buildFileUrl(doc)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-3 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left block"
//                     >
//                       <span className="truncate block text-sm">
//                         {doc.split("/").pop() || `Document ${idx + 1}`}
//                       </span>
//                     </a>
//                   ))}
//               </div>
//             </div>
//           )}

//           {(!doctor.documents ||
//             (!doctor.documents.aadhar &&
//               !doctor.documents.pan &&
//               !doctor.documents.medicalRegistration &&
//               !doctor.documents.additionalQualification &&
//               !doctor.documents.visitingCard &&
//               !doctor.documents.bankDetails &&
//               !doctor.documents.hospitalPanDocument &&
//               !doctor.documents.registrationCertificate &&
//               !doctor.documents.hospitalGstDocument &&
//               !doctor.documents.ownerPanCard &&
//               !doctor.documents.ownerAadhaarCard &&
//               !doctor.documents.otherDocs || doctor.documents.otherDocs.length === 0)) && (
//               <div className="text-center text-gray-500 py-4">
//                 No documents uploaded
//               </div>
//             )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-center space-x-3 mt-6 pt-6 border-t">
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
//           >
//             Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewDoctor;
























import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";
import DateInput from "../../../components/DateInput/DateInput";
import LocationInput from "../../../components/LocationInput";

// ================= MAIN COMPONENT =================
const ViewDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Array to hold multiple doctors (Main + Spouse/Linked)
  const [doctors, setDoctors] = useState([]);
  
  // Form state for viewing
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    qualification: '',
    experience: '',
    licenseNumber: '',
    registrationYear: '',
    aadharNumber: '',
    panNumber: '',
    specialization: [],
    hospitalName: '',
    membershipDate: '',
    membershipType: '',
    typeOfEnquiry: '',
    doctorStatus: '',
    status: '',
    remarks: '',
    hospitalAddress: {
      address: '',
      city: '',
      state: '',
      district: '',
      taluka: '',
      pinCode: '',
      country: 'India'
    },
    hospitalDetails: {
      hospitalType: '',
      beds: '',
      establishmentYear: '',
      website: '',
      ownershipType: 'Private',
      licenseNumber: '',
      director: { name: '', contact: '', email: '' },
      admin: { name: '', contact: '', email: '' },
      departments: [],
      departmentsOther: ''
    },
    contactDetails: {
      phoneNumber: '',
      whatsapp: '',
      emailId: '',
      currentAddress: {
        address: '',
        city: '',
        state: '',
        district: '',
        taluka: '',
        pinCode: '',
        country: 'India'
      }
    },
    documents: {
      // Individual Documents
      aadhar: '',
      pan: '',
      medicalRegistration: '',
      additionalQualification: '',
      visitingCard: '',
      bankDetails: '',
      // Hospital Documents
      hospitalPanDocument: '',
      registrationCertificate: '',
      hospitalGstDocument: '',
      ownerPanCard: '',
      ownerAadhaarCard: '',
      // Legacy fields
      license: '',
      qualificationDoc: '',
      otherDocs: []
    },
    followUps: [],
    linkAsSpouses: false
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(apiEndpoints.doctors.getWithSpouse(id));
        if (response.data.success) {
          const doctorData = response.data.data;
          
          // If the doctor is linked with a spouse, use mainDoctor data
          const processedDoctorData = doctorData.isLinked ? 
            { ...doctorData.mainDoctor, isLinked: true, relationshipType: doctorData.relationshipType, linkedDoctor: doctorData.linkedDoctor } : 
            doctorData;
          
          setDoctor(processedDoctorData);
          
          // Fetch and set all linked doctors
          const docs = doctorData.isLinked
            ? [doctorData.mainDoctor, doctorData.linkedDoctor]
            : [doctorData];
          
          setDoctors(docs);
          
          // Populate form data
          const membershipDateValue = processedDoctorData.membershipDate
            ? new Date(processedDoctorData.membershipDate).toISOString().split('T')[0]
            : processedDoctorData.createdAt
              ? new Date(processedDoctorData.createdAt).toISOString().split('T')[0]
              : '';
          
          setFormData({
            fullName: processedDoctorData.fullName || '',
            dateOfBirth: processedDoctorData.dateOfBirth ? new Date(processedDoctorData.dateOfBirth).toISOString().split('T')[0] : '',
            email: processedDoctorData.email || '',
            phoneNumber: processedDoctorData.phoneNumber || '',
            whatsappNumber: processedDoctorData.whatsappNumber || '',
            qualification: processedDoctorData.qualification || '',
            experience: processedDoctorData.experience || '',
            licenseNumber: processedDoctorData.licenseNumber || '',
            registrationYear: processedDoctorData.registrationYear || '',
            aadharNumber: processedDoctorData.aadharNumber || '',
            panNumber: processedDoctorData.panNumber || '',
            specialization: processedDoctorData.specialization || [],
            membershipDate: membershipDateValue,
            membershipType: processedDoctorData.membershipType || '',
            typeOfEnquiry: processedDoctorData.typeOfEnquiry || '',
            doctorStatus: processedDoctorData.doctorStatus || '',
            status: processedDoctorData.status || '',
            remarks: processedDoctorData.remarks || '',
            doctorType: processedDoctorData.doctorType || 'individual',
            hospitalName: processedDoctorData.hospitalName || '',
            hospitalAddress: processedDoctorData.hospitalAddress || {
              address: '', city: '', state: '', district: '', taluka: '', pinCode: '', country: 'India'
            },
            hospitalDetails: processedDoctorData.hospitalDetails || {
              hospitalType: '', beds: '', establishmentYear: '', website: '', ownershipType: 'Private',
              director: { name: '', contact: '', email: '' },
              admin: { name: '', contact: '', email: '' },
              departments: [],
              departmentsOther: ''
            },
            contactDetails: processedDoctorData.contactDetails || {
              phoneNumber: '', whatsapp: '', emailId: '',
              currentAddress: { address: '', city: '', state: '', district: '', taluka: '', pinCode: '', country: 'India' }
            },
            documents: {
              // Individual Documents
              aadhar: processedDoctorData.documents?.aadhar || '',
              pan: processedDoctorData.documents?.pan || '',
              medicalRegistration: processedDoctorData.documents?.medicalRegistration || '',
              additionalQualification: processedDoctorData.documents?.additionalQualification || '',
              visitingCard: processedDoctorData.documents?.visitingCard || '',
              bankDetails: processedDoctorData.documents?.bankDetails || '',
              // Hospital Documents
              hospitalPanDocument: processedDoctorData.documents?.hospitalPanDocument || '',
              registrationCertificate: processedDoctorData.documents?.registrationCertificate || '',
              hospitalGstDocument: processedDoctorData.documents?.hospitalGstDocument || '',
              ownerPanCard: processedDoctorData.documents?.ownerPanCard || '',
              ownerAadhaarCard: processedDoctorData.documents?.ownerAadhaarCard || '',
              // Legacy fields for backward compatibility
              license: processedDoctorData.documents?.license || '',
              qualificationDoc: processedDoctorData.documents?.qualificationDoc || '',
              otherDocs: processedDoctorData.documents?.otherDocs || []
            },
            followUps: processedDoctorData.followUps || [],
            linkAsSpouses: processedDoctorData.isLinked && processedDoctorData.relationshipType === 'spouse'
          });
        } else {
          setError("Failed to fetch doctor details");
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError(err.response?.data?.message || "Failed to load doctor details");
        toast.error("Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDoctor();
    }
  }, [id]);

  // State for preview modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);

  // Preview handlers
  const handlePreviewClick = (preview) => {
    setCurrentPreview(preview);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentPreview(null);
  };

  // Helper function to get document name for a specific doctor
  const getDoctorDocumentName = (index, docType) => {
    if (index === 0) {
      return formData.documents[docType] || doctors[index]?.documents?.[docType] || '';
    } else {
      return doctors[index]?.documents?.[docType] || '';
    }
  };

  // Helper function to get file preview URL
  // const getDocumentUrl = (fileName) => {
  //   if (!fileName) return null;
  //   if (fileName.startsWith('http')) return fileName;
  //   return `${'http://localhost:3000'}/uploads/${fileName.split('/').pop()}`;
  // };


  const getDocumentUrl = (fileName) => {
  if (!fileName) return '#';

  // uploads ke baad ka path nikaalo
  const index = fileName.toLowerCase().indexOf('uploads');
  if (index === -1) return '#';

  const relativePath = fileName
    .substring(index)
    .replace(/\\/g, '/'); // Windows → URL

  return `http://localhost:3000/${relativePath}`;
};

  // Function to download document
  const downloadDocument = (fileName, docType) => {
    const url = getDocumentUrl(fileName);
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading doctor details...</div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error || "Doctor not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-teal-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Determine doctor types based on formData.doctorType
  const isHospital = formData.doctorType === "hospital";
  const isIndividual = formData.doctorType === "individual";
  const isHospitalIndividual = formData.doctorType === "hospital_individual";

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Doctor Details</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/doctor-list')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to List
            </button>
            <button
              onClick={() => navigate(`/admin-edit-doctor/${id}`)}
              className="bg-[#15BBB3] text-white px-4 py-2 rounded hover:bg-[#13a89e]"
            >
              Edit Doctor
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Membership ID</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.membershipId || "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {doctor.doctorId || "N/A"}
              </div>
            </div>
            <div>
              {/* <label className="block text-sm font-medium text-gray-700">Membership Date</label> */}
              {/* <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {formData.membershipDate ? new Date(formData.membershipDate).toLocaleDateString() : "N/A"}
              </div> */}

               <DateInput
                            label="Membership Date"
                            value={formData.membershipDate}
                            onChange={(v) => handleInputChange('membershipDate', v)}
                            returnFormat='yyyy-mm-dd'
                          disabled
                          />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type of Membership</label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                {formData.doctorType ? formData.doctorType.replace('_', ' ').toUpperCase() : "N/A"}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {formData.status || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enquiry Status</label>
                <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
                  {formData.typeOfEnquiry || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Information (Repeated for each linked doctor) */}
        {(isIndividual || isHospitalIndividual) && doctors.map((doc, index) => (
          <div key={index} className="border-b pb-6 mb-6 bg-gray-50/50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">
              {doctors.length > 1 ? `Doctor ${index + 1} Information` : 'Doctor Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name of Doctor</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.fullName || 'N/A'}
                </div>
              </div>
              <div>
                {/* <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.dateOfBirth ? new Date(doc.dateOfBirth).toLocaleDateString() : 'N/A'}
                </div> */}
                 <DateInput
                                label="Date of Birth"
                                returnFormat='yyyy-mm-dd'
                                value={doc.dateOfBirth ? (typeof doc.dateOfBirth === 'string' ? doc.dateOfBirth.split('T')[0] : new Date(doc.dateOfBirth).toISOString().split('T')[0]) : ''}
                           disabled
                                onChange={(v) => handleDoctorInputChange(index, 'dateOfBirth', v)}
                              />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.qualification || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {Array.isArray(doc.specialization) ? doc.specialization.join(', ') : doc.specialization || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registered Number</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.licenseNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reg. Year</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.registrationYear || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.phoneNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WA No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.whatsappNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.email || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.aadharNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.panNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.address || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.pinCode || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.city || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.taluka || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.district || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.state || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {doc.contactDetails?.currentAddress?.country || 'N/A'}
                </div>
              </div>
            </div>

            {/* Hospital Details for Individual - Always show (doctorType === 'individual') */}
            {isIndividual && (
              <>
                <h3 className="text-lg font-semibold text-[#15BBB3] mt-8 mb-4">Hospital Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name of Hospital/Clinic</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalName || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Address</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.address || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.pinCode || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.country || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.state || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.district || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.taluka || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {doc.hospitalAddress?.city || 'N/A'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Hospital Information (ONLY for Hospital / Hospital + Individual types) */}
        {(isHospital || isHospitalIndividual) && (
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalName || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Hospital</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.hospitalType || 'N/A'}
                </div>
              </div>
              {formData.hospitalDetails.hospitalType === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Type (Other)</label>
                  <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                    {formData.hospitalDetails.typeOther || 'N/A'}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. of Beds</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.beds || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regi / License No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.licenseNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year of Establishment</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.establishmentYear || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital PAN</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.hospitalPanNumber || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.address || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.pinCode || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.city || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.taluka || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.district || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.state || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalAddress.country || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.phoneNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.whatsapp || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.emailId || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.website || 'N/A'}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Ownership / Admin</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ownership Type</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.ownershipType || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Superintendent / Director Name</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.director?.name || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Director Contact No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.director?.contact || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.director?.email || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin / Mgmt Officer Name</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.admin?.name || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.admin?.contact || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.admin?.email || 'N/A'}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Departments Available</h3>
            <div className="flex flex-wrap gap-4">
              {formData.hospitalDetails.departments && formData.hospitalDetails.departments.length > 0 ? (
                formData.hospitalDetails.departments.map(dept => (
                  <span key={dept} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {dept}
                  </span>
                ))
              ) : (
                <div className="text-gray-500">No departments specified</div>
              )}
            </div>
            {formData.hospitalDetails.departments?.includes('Other') && formData.hospitalDetails.departmentsOther && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Departments</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.hospitalDetails.departmentsOther}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact Information */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {formData.phoneNumber || formData.contactDetails?.phoneNumber || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {formData.whatsappNumber || formData.contactDetails?.whatsapp || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {formData.email || formData.contactDetails?.emailId || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Residential Address (for Individual/Hospital+Individual) */}
        {(isIndividual || isHospitalIndividual) && formData.contactDetails?.currentAddress && (
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Residential Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.address || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.pinCode || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.city || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.taluka || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.district || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.state || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                  {formData.contactDetails.currentAddress.country || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Follow-up Section */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Follow-up Information</h2>
          {/* Follow-up History */}
          {formData.followUps && formData.followUps.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Follow-up History</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {formData.followUps.map((followUp, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">Notes: <strong>{followUp.notes || "No notes"} </strong></p>
                        <p className="text-xs text-gray-500 mt-1">
                          Date: {new Date(followUp.date).toLocaleDateString()} | Type: {followUp.type || "N/A"}
                        </p>
                        {followUp.nextFollowUpDate && (
                          <p className="text-xs text-gray-500">
                            Next Follow-up: {new Date(followUp.nextFollowUpDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 mb-6">No follow-up history</div>
          )}
        </div>

        {/* Spouse Linking Status */}
        {(isIndividual || isHospitalIndividual) && doctors.length === 2 && (
          <div className="border-b pb-6 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <div className={`h-4 w-4 rounded mt-1 ${formData.linkAsSpouses ? 'bg-teal-600' : 'bg-gray-300'}`}></div>
              <label className="ml-3 block text-sm text-gray-700 flex-1">
                <span className="font-medium">
                  {formData.linkAsSpouses ? 'Linked as spouses' : 'Not linked as spouses'}
                </span>
                {formData.linkAsSpouses && ' - Names will appear together on bills (e.g., "Raju & Sunita")'}
              </label>
            </div>
          </div>
        )}

        {/* Remarks */}
        {formData.remarks && (
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Remarks</h2>
            <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
              {formData.remarks}
            </div>
          </div>
        )}

        {/* Documents Section */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Documents</h2>
          
          {/* Individual Documents (Repeated for each linked doctor) */}
          {(isIndividual || isHospitalIndividual) && doctors.map((doc, index) => (
            <div key={index} className="mb-8 p-4 bg-blue-50/30 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-blue-600 mb-4 border-b border-blue-100 pb-2">
                {doctors.length > 1 ? `Doctor ${index + 1} Individual Documents` : 'Individual Documents'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['aadhar', 'pan', 'medicalRegistration', 'additionalQualification', 'visitingCard', 'bankDetails'].map(docType => {
                  const fileName = getDoctorDocumentName(index, docType);
                  return (
                    <DocumentView
                      key={docType}
                      label={docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      fileName={fileName}
                      onViewClick={() => fileName && downloadDocument(fileName, docType)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          
          {(isHospital || isHospitalIndividual) && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-green-600 mb-3">Hospital Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'hospitalPanDocument', label: 'Hospital PAN Document' },
                  { key: 'registrationCertificate', label: 'Registration Certificate' },
                  { key: 'hospitalGstDocument', label: 'Hospital GST Document' },
                  { key: 'ownerPanCard', label: 'Owner PAN Card' },
                  { key: 'ownerAadhaarCard', label: 'Owner Aadhaar Card' },
                  { key: 'license', label: 'License/Registration' },
                  { key: 'qualificationDoc', label: 'Qualification Document' }
                ].map(doc => (
                  <DocumentView
                    key={doc.key}
                    label={doc.label}
                    fileName={formData.documents[doc.key]}
                    onViewClick={() => formData.documents[doc.key] && downloadDocument(formData.documents[doc.key], doc.key)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Other documents */}
          {formData.documents?.otherDocs && formData.documents.otherDocs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Other Documents</h3>
              <div className="space-y-2">
                {formData.documents.otherDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700 truncate">{doc.split('/').pop()}</span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => downloadDocument(doc, 'other')}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3 mt-6 pt-6 border-t">
          <button
            onClick={() => navigate(`/doctors`)}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/edit-doctor/${id}`)}
            className="bg-[#15BBB3] text-white px-6 py-2 rounded hover:bg-[#13a89e]"
          >
            Edit Doctor
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        preview={currentPreview} 
      />
    </div>
  );
};

// ================= DOCUMENT VIEW COMPONENT =================
const DocumentView = ({ label, fileName, onViewClick }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className={`border rounded-lg px-4 py-2 text-sm flex justify-between items-center ${
        fileName ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
      }`}>
        <span className={fileName ? 'text-green-700 font-medium' : 'text-gray-600'}>
          {fileName ? 'Uploaded' : 'Not Uploaded'}
        </span>
        {fileName && (
          <button
            onClick={onViewClick}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Document
          </button>
        )}
      </div>
      {fileName && (
        <div className="text-xs text-gray-500 truncate">
          File: {fileName.split('/').pop()}
        </div>
      )}
    </div>
  );
};

// ================= IMAGE PREVIEW MODAL =================
const ImagePreviewModal = ({ isOpen, onClose, preview }) => {
  if (!isOpen || !preview) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            Document Preview: {preview.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-4 overflow-auto max-h-[70vh]">
          {preview.type?.startsWith('image/') ? (
            <div className="flex flex-col items-center">
              <img
                src={preview.url}
                alt={preview.name || 'Preview'}
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  File: {preview.name}
                </p>
                <p className="text-xs text-gray-500">
                  Type: {preview.type} | Size: {(preview.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          ) : preview.type?.includes('pdf') ? (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 flex items-center justify-center bg-red-100 rounded-lg mb-4">
                <span className="text-4xl text-red-600">📄</span>
              </div>
              <p className="text-lg font-medium text-gray-700">PDF Document</p>
              <p className="text-sm text-gray-600 mt-2">{preview.name}</p>
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <span className="mr-2">📂</span>
                Open PDF in New Tab
              </a>
            </div>
          ) : preview.type?.includes('word') || preview.type?.includes('document') ? (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 flex items-center justify-center bg-blue-100 rounded-lg mb-4">
                <span className="text-4xl text-blue-600">📝</span>
              </div>
              <p className="text-lg font-medium text-gray-700">Word Document</p>
              <p className="text-sm text-gray-600 mt-2">{preview.name}</p>
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <span className="mr-2">📂</span>
                Open Document
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
                <span className="text-4xl text-gray-600">📎</span>
              </div>
              <p className="text-lg font-medium text-gray-700">Document Preview</p>
              <p className="text-sm text-gray-600 mt-2">{preview.name}</p>
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                <span className="mr-2">📂</span>
                Open File
              </a>
            </div>
          )}
        </div>
        {/* Modal Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDoctor;


































































// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from "react-toastify";

// // ================= MAIN COMPONENT =================
// const ViewDoctor = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Array to hold multiple doctors (Main + Spouse/Linked)
//   const [doctors, setDoctors] = useState([]);

//   // Helper function to format dates - FIXED VERSION
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
    
//     try {
//       // Handle both string and Date object
//       const date = new Date(dateString);
      
//       // Check if date is valid
//       if (isNaN(date.getTime())) {
//         return "Invalid Date";
//       }
      
//       // Add timezone offset to fix date shift issue
//       const adjustedDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
      
//       return adjustedDate.toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       });
//     } catch (error) {
//       console.error("Error formatting date:", dateString, error);
//       return "N/A";
//     }
//   };

//   // Helper function to build correct file URL - FIXED VERSION
//   // const buildFileUrl = (filePath) => {
//   //   if (!filePath) return null;
    
//   //   // Remove any local file system paths (C:\\, D:\\, etc.)
//   //   let cleanPath = filePath.replace(/^[A-Za-z]:\\/, ''); // Remove Windows drive letter
//   //   cleanPath = cleanPath.replace(/\\/g, '/'); // Replace backslashes with forward slashes
    
//   //   // Check if it's already a full URL
//   //   if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
//   //     return cleanPath;
//   //   }
    
//   //   // Check if it starts with 'uploads/'
//   //   if (cleanPath.toLowerCase().startsWith('uploads/')) {
//   //     return `http://localhost:3000/${cleanPath}`;
//   //   }
    
//   //   // If it's just a filename, assume it's in uploads folder
//   //   if (!cleanPath.includes('/') && cleanPath.includes('.')) {
//   //     return `http://localhost:3000/uploads/${cleanPath}`;
//   //   }
    
//   //   // Try to extract filename if path is complex
//   //   const filename = cleanPath.split('/').pop();
//   //   return `http://localhost:3000/uploads/${filename}`;
//   // };



//   const buildFileUrl = (filePath) => {
//   if (!filePath) return '#';

//   // uploads ke baad ka path nikaalo
//   const index = filePath.toLowerCase().indexOf('uploads');
//   if (index === -1) return '#';

//   const relativePath = filePath
//     .substring(index)
//     .replace(/\\/g, '/'); // Windows → URL

//   return `http://localhost:3000/${relativePath}`;
// };




//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         setLoading(true);
//         const response = await apiClient.get(apiEndpoints.doctors.getWithSpouse(id));
//         if (response.data.success) {
//           const doctorData = response.data.data;
//           // If the doctor is linked with a spouse, use mainDoctor data
//           // Otherwise, use the original data structure
//           const processedDoctorData = doctorData.isLinked ? { ...doctorData.mainDoctor, isLinked: true, relationshipType: doctorData.relationshipType, linkedDoctor: doctorData.linkedDoctor } : doctorData;
//           setDoctor(processedDoctorData);

//           // Fetch and set all linked doctors
//           const docs = doctorData.isLinked
//             ? [doctorData.mainDoctor, doctorData.linkedDoctor]
//             : [doctorData];
//           setDoctors(docs);
//         } else {
//           setError("Failed to fetch doctor details");
//         }
//       } catch (err) {
//         console.error("Error fetching doctor:", err);
//         setError(err.response?.data?.message || "Failed to load doctor details");
//         toast.error("Failed to load doctor details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchDoctor();
//     }
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-lg">Loading doctor details...</div>
//       </div>
//     );
//   }

//   if (error || !doctor) {
//     return (
//       <div className="p-8 text-center">
//         <p className="text-red-600">{error || "Doctor not found"}</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 bg-teal-500 text-white px-4 py-2 rounded"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   const isHospital = doctor.doctorType === "hospital";
//   const isIndividual = doctor.doctorType === "individual";
//   const isHospitalIndividual = doctor.doctorType === "hospital_individual";

//   // Check if file URL is valid
//   const isValidFileUrl = (url) => {
//     return url && url !== '#';
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">View Doctor Details</h1>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//           >
//             Back
//           </button>
//         </div>

//         {/* Basic Information */}
//         <div className="border-b pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Basic Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Membership ID</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.membershipId || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.doctorId || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Membership Date</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.membershipDate ? formatDate(doctor.membershipDate) : (doctor.createdAt ? formatDate(doctor.createdAt) : "N/A")}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Type of Membership</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.membershipType || doctor.doctorType || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Status</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.status || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Enquiry Status</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.typeOfEnquiry || "N/A"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Doctor/Individual Information */}
//         {(isIndividual || isHospitalIndividual) && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Doctor Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.fullName || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.dateOfBirth ? formatDate(doctor.dateOfBirth) : "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Qualification</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.qualification || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Specialization</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.specialization && doctor.specialization.length > 0
//                     ? doctor.specialization.join(", ")
//                     : "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Reg No</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.licenseNumber || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Registration Year</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.registrationYear || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.aadharNumber || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">PAN Number</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.panNumber || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Experience</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.experience || "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Hospital Details for Individual Doctors */}
//         {isIndividual && doctor.hospitalName && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalName || "N/A"}
//                 </div>
//               </div>
//               {doctor.hospitalAddress && (
//                 <>
//                   <div className="col-span-3">
//                     <label className="block text-sm font-medium text-gray-700">Hospital Address</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.address || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Pin Code</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.pinCode || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">City</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.city || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Taluka</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.taluka || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">District</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.district || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">State</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.state || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Country</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalAddress.country || "N/A"}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Spouse Information - Show only if the doctor is linked as a spouse */}
//         {doctor.isLinked && doctor.relationshipType === 'spouse' && doctor.linkedDoctor && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Spouse Doctors Information</h2>

//             {/* Doctor 1 Information */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                 <span className="bg-[#15BBB3] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
//                 Doctor 1 Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.fullName || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.doctorId || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Registration No</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.licenseNumber || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.email || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.phoneNumber || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Qualification</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.qualification || "N/A"}
//                   </div>
//                 </div>
//               </div>

//               {/* Doctor 1 Documents */}
//               <div className="mt-4">
//                 <h4 className="text-md font-medium text-gray-800 mb-2">Doctor 1 Documents</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {doctor.documents?.aadhar && (
//                     <a
//                       href={buildFileUrl(doctor.documents.aadhar)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left truncate"
//                     >
//                       Aadhar: {doctor.documents.aadhar.split("/").pop() || "View Document"}
//                     </a>
//                   )}
//                   {doctor.documents?.pan && (
//                     <a
//                       href={buildFileUrl(doctor.documents.pan)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left truncate"
//                     >
//                       PAN: {doctor.documents.pan.split("/").pop() || "View Document"}
//                     </a>
//                   )}
//                   {doctor.documents?.medicalRegistration && (
//                     <a
//                       href={buildFileUrl(doctor.documents.medicalRegistration)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 bg-yellow-50 border border-yellow-300 rounded text-yellow-700 hover:bg-yellow-100 text-left truncate"
//                     >
//                       Medical Registration: {doctor.documents.medicalRegistration.split("/").pop() || "View Document"}
//                     </a>
//                   )}
//                   {doctor.documents?.otherDocs && doctor.documents.otherDocs.length > 0 &&
//                     doctor.documents.otherDocs.map((doc, idx) => (
//                       <a
//                         key={idx}
//                         href={buildFileUrl(doc)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="p-2 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left truncate"
//                       >
//                         Other Doc {idx + 1}: {doc.split("/").pop() || `Document ${idx + 1}`}
//                       </a>
//                     ))
//                   }
//                 </div>
//               </div>
//             </div>

//             {/* Doctor 2 Information */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                 <span className="bg-[#15BBB3] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
//                 Doctor 2 Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.fullName || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.doctorId || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Registration No</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.licenseNumber || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.email || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.phoneNumber || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Qualification</label>
//                   <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor.qualification || "N/A"}
//                   </div>
//                 </div>
//               </div>

//               {/* Doctor 2 Documents */}
//               <div className="mt-4">
//                 <h4 className="text-md font-medium text-gray-800 mb-2">Doctor 2 Documents</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {doctor.linkedDoctor.documents?.aadhar && (
//                     <a
//                       href={buildFileUrl(doctor.linkedDoctor.documents.aadhar)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left truncate"
//                     >
//                       Aadhar: {doctor.linkedDoctor.documents.aadhar.split("/").pop() || "View Document"}
//                     </a>
//                   )}
//                   {doctor.linkedDoctor.documents?.pan && (
//                     <a
//                       href={buildFileUrl(doctor.linkedDoctor.documents.pan)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left truncate"
//                     >
//                       PAN: {doctor.linkedDoctor.documents.pan.split("/").pop() || "View Document"}
//                     </a>
//                   )}
//                   {doctor.linkedDoctor.documents?.medicalRegistration && (
//                     <a
//                       href={buildFileUrl(doctor.linkedDoctor.documents.medicalRegistration)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 bg-yellow-50 border border-yellow-300 rounded text-yellow-700 hover:bg-yellow-100 text-left truncate"
//                     >
//                       Medical Registration: {doctor.linkedDoctor.documents.medicalRegistration.split("/").pop() || "View Document"}
//                     </a>
//                   )}
//                   {doctor.linkedDoctor.documents?.otherDocs && doctor.linkedDoctor.documents.otherDocs.length > 0 &&
//                     doctor.linkedDoctor.documents.otherDocs.map((doc, idx) => (
//                       <a
//                         key={idx}
//                         href={buildFileUrl(doc)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="p-2 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left truncate"
//                       >
//                         Other Doc {idx + 1}: {doc.split("/").pop() || `Document ${idx + 1}`}
//                       </a>
//                     ))
//                   }
//                 </div>
//               </div>
//             </div>

//             {/* Relationship Information */}
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//               <h3 className="text-md font-medium text-gray-800 mb-3">Relationship Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Relationship Type</label>
//                   <div className="mt-1 p-2 bg-white border border-gray-300 rounded text-gray-700">
//                     {doctor.relationshipType || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Linked Doctor ID</label>
//                   <div className="mt-1 p-2 bg-white border border-gray-300 rounded text-gray-700">
//                     {doctor.linkedDoctor._id || "N/A"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Hospital Information */}
//         {(isHospital || isHospitalIndividual) && doctor.hospitalName && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalName || "N/A"}
//                 </div>
//               </div>
//               {doctor.hospitalDetails && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Hospital Type</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.hospitalType || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">No. of Beds</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.beds || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Year of Establishment</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.establishmentYear || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Website</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.website || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Ownership Type</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.ownershipType || "N/A"}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {doctor.hospitalDetails?.director && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Director Name</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.director.name || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Director Contact</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.director.contact || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Director Email</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.director.email || "N/A"}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {doctor.hospitalDetails?.admin && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Admin Name</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.admin.name || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Admin Contact</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.admin.contact || "N/A"}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Admin Email</label>
//                     <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                       {doctor.hospitalDetails.admin.email || "N/A"}
//                     </div>
//                   </div>
//                 </>
//               )}
//               {doctor.hospitalDetails?.departments && doctor.hospitalDetails.departments.length > 0 && (
//                 <div className="col-span-3">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
//                   <div className="flex flex-wrap gap-2">
//                     {doctor.hospitalDetails.departments.map((dept, idx) => (
//                       <span
//                         key={idx}
//                         className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                       >
//                         {dept}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Hospital Address */}
//         {(isHospital || isHospitalIndividual) && doctor.hospitalAddress && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Hospital Address</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="col-span-3">
//                 <label className="block text-sm font-medium text-gray-700">Address</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.address || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Pin Code</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.pinCode || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">City</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.city || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Taluka</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.taluka || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">District</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.district || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">State</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.state || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Country</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.hospitalAddress.country || "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Contact Information */}
//         <div className="border-b pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Contact Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.phoneNumber || doctor.contactDetails?.phoneNumber || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.whatsappNumber || doctor.contactDetails?.whatsapp || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.email || doctor.contactDetails?.emailId || "N/A"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Residential Address (for Individual/Hospital+Individual) */}
//         {(isIndividual || isHospitalIndividual) && doctor.contactDetails?.currentAddress && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Residential Address</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="col-span-3">
//                 <label className="block text-sm font-medium text-gray-700">Address</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.address || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Pin Code</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.pinCode || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">City</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.city || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Taluka</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.taluka || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">District</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.district || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">State</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.state || "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Country</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {doctor.contactDetails.currentAddress.country || "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Status & Follow-up */}
//         <div className="border-b pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Status & Follow-up</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Enquiry Status</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.typeOfEnquiry || "N/A"}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Doctor Status</label>
//               <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                 {doctor.doctorStatus || "N/A"}
//               </div>
//             </div>
//             {doctor.followUps && doctor.followUps.length > 0 && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Last Follow-up Date</label>
//                 <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-700">
//                   {formatDate(doctor.followUps[doctor.followUps.length - 1].date)}
//                 </div>
//               </div>
//             )}
//           </div>
//           {doctor.followUps && doctor.followUps.length > 0 && (
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up History</label>
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 {doctor.followUps.map((followUp, idx) => (
//                   <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="font-medium text-sm">Notes: <strong>{followUp.notes || "No notes"} </strong></p>
//                         <p className="font-medium text-sm">FullName: <strong>{followUp.createdBy?.fullName || "N/A"}</strong> </p>
//                         <p className="font-medium text-sm">Role: <strong> {followUp.createdBy?.role || "N/A"}</strong></p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Date: {formatDate(followUp.date)} | Type: {followUp.type || "N/A"}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           Created at: {formatDate(followUp.createdAt)}
//                         </p>
//                         {followUp.nextFollowUpDate && (
//                           <p className="text-xs text-gray-500">
//                             Next Follow-up: {formatDate(followUp.nextFollowUpDate)}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Remarks */}
//         {doctor.remarks && (
//           <div className="border-b pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-[#15BBB3] mb-4">Remarks</h2>
//             <div className="p-3 bg-gray-50 border border-gray-300 rounded text-gray-700">
//               {doctor.remarks}
//             </div>
//           </div>
//         )}

//         {/* Documents */}
//         <div className="pb-6 mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-[#15BBB3]">Documents</h2>
//             {doctor.documents && (
//               <span className="text-sm text-gray-500">
//                 {[
//                   doctor.documents.aadhar ? 1 : 0,
//                   doctor.documents.pan ? 1 : 0,
//                   doctor.documents.medicalRegistration ? 1 : 0,
//                   doctor.documents.additionalQualification ? 1 : 0,
//                   doctor.documents.visitingCard ? 1 : 0,
//                   doctor.documents.bankDetails ? 1 : 0,
//                   doctor.documents.hospitalPanDocument ? 1 : 0,
//                   doctor.documents.registrationCertificate ? 1 : 0,
//                   doctor.documents.hospitalGstDocument ? 1 : 0,
//                   doctor.documents.ownerPanCard ? 1 : 0,
//                   doctor.documents.ownerAadhaarCard ? 1 : 0,
//                   doctor.documents.otherDocs?.length || 0
//                 ].reduce((a, b) => a + b, 0)} document(s)
//               </span>
//             )}
//           </div>

//           {/* Display documents with proper links */}
//           {(isIndividual || isHospitalIndividual) && (
//             <div className="mb-6">
//               {/* Display documents for each linked doctor */}
//               {doctors && doctors.length > 0 ? (
//                 doctors.map((doc, index) => (
//                   <div key={index} className="mb-8 p-4 bg-blue-50/30 rounded-lg border border-blue-100">
//                     <h3 className="text-lg font-medium text-blue-600 mb-3 border-b border-blue-100 pb-2">
//                       {doctors.length > 1 ? `Doctor ${index + 1} Individual Documents` : 'Individual Documents'}
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {doc.documents?.aadhar && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Aadhar
//                           </label>
//                           {isValidFileUrl(buildFileUrl(doc.documents.aadhar)) ? (
//                             <a
//                               href={buildFileUrl(doc.documents.aadhar)}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block truncate"
//                             >
//                               <span className="truncate block">
//                                 {doc.documents.aadhar.split("/").pop() || "View Document"}
//                               </span>
//                             </a>
//                           ) : (
//                             <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                               <span className="truncate block">
//                                 {doc.documents.aadhar.split("/").pop() || "Document not accessible"}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                       {doc.documents?.pan && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             PAN
//                           </label>
//                           {isValidFileUrl(buildFileUrl(doc.documents.pan)) ? (
//                             <a
//                               href={buildFileUrl(doc.documents.pan)}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block truncate"
//                             >
//                               <span className="truncate block">
//                                 {doc.documents.pan.split("/").pop() || "View Document"}
//                               </span>
//                             </a>
//                           ) : (
//                             <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                               <span className="truncate block">
//                                 {doc.documents.pan.split("/").pop() || "Document not accessible"}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                       {doc.documents?.medicalRegistration && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Medical Registration
//                           </label>
//                           {isValidFileUrl(buildFileUrl(doc.documents.medicalRegistration)) ? (
//                             <a
//                               href={buildFileUrl(doc.documents.medicalRegistration)}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block truncate"
//                             >
//                               <span className="truncate block">
//                                 {doc.documents.medicalRegistration.split("/").pop() || "View Document"}
//                               </span>
//                             </a>
//                           ) : (
//                             <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                               <span className="truncate block">
//                                 {doc.documents.medicalRegistration.split("/").pop() || "Document not accessible"}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                       {doc.documents?.additionalQualification && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Additional Qualification
//                           </label>
//                           {isValidFileUrl(buildFileUrl(doc.documents.additionalQualification)) ? (
//                             <a
//                               href={buildFileUrl(doc.documents.additionalQualification)}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block truncate"
//                             >
//                               <span className="truncate block">
//                                 {doc.documents.additionalQualification.split("/").pop() || "View Document"}
//                               </span>
//                             </a>
//                           ) : (
//                             <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                               <span className="truncate block">
//                                 {doc.documents.additionalQualification.split("/").pop() || "Document not accessible"}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                       {doc.documents?.visitingCard && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Visiting Card
//                           </label>
//                           {isValidFileUrl(buildFileUrl(doc.documents.visitingCard)) ? (
//                             <a
//                               href={buildFileUrl(doc.documents.visitingCard)}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block truncate"
//                             >
//                               <span className="truncate block">
//                                 {doc.documents.visitingCard.split("/").pop() || "View Document"}
//                               </span>
//                             </a>
//                           ) : (
//                             <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                               <span className="truncate block">
//                                 {doc.documents.visitingCard.split("/").pop() || "Document not accessible"}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                       {doc.documents?.bankDetails && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Bank Details
//                           </label>
//                           {isValidFileUrl(buildFileUrl(doc.documents.bankDetails)) ? (
//                             <a
//                               href={buildFileUrl(doc.documents.bankDetails)}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block truncate"
//                             >
//                               <span className="truncate block">
//                                 {doc.documents.bankDetails.split("/").pop() || "View Document"}
//                               </span>
//                             </a>
//                           ) : (
//                             <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                               <span className="truncate block">
//                                 {doc.documents.bankDetails.split("/").pop() || "Document not accessible"}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 // Fallback to original logic if no doctors array exists
//                 <div>
//                   <h3 className="text-lg font-medium text-blue-600 mb-3">Individual Documents</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {doctor.documents?.aadhar && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Aadhar
//                         </label>
//                         {isValidFileUrl(buildFileUrl(doctor.documents.aadhar)) ? (
//                           <a
//                             href={buildFileUrl(doctor.documents.aadhar)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block truncate"
//                           >
//                             <span className="truncate block">
//                               {doctor.documents.aadhar.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         ) : (
//                           <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                             <span className="truncate block">
//                               {doctor.documents.aadhar.split("/").pop() || "Document not accessible"}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                     {doctor.documents?.pan && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           PAN
//                         </label>
//                         {isValidFileUrl(buildFileUrl(doctor.documents.pan)) ? (
//                           <a
//                             href={buildFileUrl(doctor.documents.pan)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block truncate"
//                           >
//                             <span className="truncate block">
//                               {doctor.documents.pan.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         ) : (
//                           <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                             <span className="truncate block">
//                               {doctor.documents.pan.split("/").pop() || "Document not accessible"}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                     {doctor.documents?.medicalRegistration && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Medical Registration
//                         </label>
//                         {isValidFileUrl(buildFileUrl(doctor.documents.medicalRegistration)) ? (
//                           <a
//                             href={buildFileUrl(doctor.documents.medicalRegistration)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block truncate"
//                           >
//                             <span className="truncate block">
//                               {doctor.documents.medicalRegistration.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         ) : (
//                           <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                             <span className="truncate block">
//                               {doctor.documents.medicalRegistration.split("/").pop() || "Document not accessible"}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                     {doctor.documents?.additionalQualification && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Additional Qualification
//                         </label>
//                         {isValidFileUrl(buildFileUrl(doctor.documents.additionalQualification)) ? (
//                           <a
//                             href={buildFileUrl(doctor.documents.additionalQualification)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block truncate"
//                           >
//                             <span className="truncate block">
//                               {doctor.documents.additionalQualification.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         ) : (
//                           <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                             <span className="truncate block">
//                               {doctor.documents.additionalQualification.split("/").pop() || "Document not accessible"}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                     {doctor.documents?.visitingCard && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Visiting Card
//                         </label>
//                         {isValidFileUrl(buildFileUrl(doctor.documents.visitingCard)) ? (
//                           <a
//                             href={buildFileUrl(doctor.documents.visitingCard)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block truncate"
//                           >
//                             <span className="truncate block">
//                               {doctor.documents.visitingCard.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         ) : (
//                           <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                             <span className="truncate block">
//                               {doctor.documents.visitingCard.split("/").pop() || "Document not accessible"}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                     {doctor.documents?.bankDetails && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Bank Details
//                         </label>
//                         {isValidFileUrl(buildFileUrl(doctor.documents.bankDetails)) ? (
//                           <a
//                             href={buildFileUrl(doctor.documents.bankDetails)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="w-full p-3 bg-blue-50 border border-blue-300 rounded text-blue-700 hover:bg-blue-100 text-left block truncate"
//                           >
//                             <span className="truncate block">
//                               {doctor.documents.bankDetails.split("/").pop() || "View Document"}
//                             </span>
//                           </a>
//                         ) : (
//                           <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                             <span className="truncate block">
//                               {doctor.documents.bankDetails.split("/").pop() || "Document not accessible"}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {(isHospital || isHospitalIndividual) && (
//             <div className="mb-6">
//               <h3 className="text-lg font-medium text-green-600 mb-3">Hospital Documents</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {doctor.documents?.hospitalPanDocument && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Hospital PAN Document
//                     </label>
//                     {isValidFileUrl(buildFileUrl(doctor.documents.hospitalPanDocument)) ? (
//                       <a
//                         href={buildFileUrl(doctor.documents.hospitalPanDocument)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block truncate"
//                       >
//                         <span className="truncate block">
//                           {doctor.documents.hospitalPanDocument.split("/").pop() || "View Document"}
//                         </span>
//                       </a>
//                     ) : (
//                       <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                         <span className="truncate block">
//                           {doctor.documents.hospitalPanDocument.split("/").pop() || "Document not accessible"}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {doctor.documents?.registrationCertificate && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Registration Certificate
//                     </label>
//                     {isValidFileUrl(buildFileUrl(doctor.documents.registrationCertificate)) ? (
//                       <a
//                         href={buildFileUrl(doctor.documents.registrationCertificate)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block truncate"
//                       >
//                         <span className="truncate block">
//                           {doctor.documents.registrationCertificate.split("/").pop() || "View Document"}
//                         </span>
//                       </a>
//                     ) : (
//                       <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                         <span className="truncate block">
//                           {doctor.documents.registrationCertificate.split("/").pop() || "Document not accessible"}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {doctor.documents?.hospitalGstDocument && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Hospital GST Document
//                     </label>
//                     {isValidFileUrl(buildFileUrl(doctor.documents.hospitalGstDocument)) ? (
//                       <a
//                         href={buildFileUrl(doctor.documents.hospitalGstDocument)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block truncate"
//                       >
//                         <span className="truncate block">
//                           {doctor.documents.hospitalGstDocument.split("/").pop() || "View Document"}
//                         </span>
//                       </a>
//                     ) : (
//                       <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                         <span className="truncate block">
//                           {doctor.documents.hospitalGstDocument.split("/").pop() || "Document not accessible"}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {doctor.documents?.ownerPanCard && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Owner PAN Card
//                     </label>
//                     {isValidFileUrl(buildFileUrl(doctor.documents.ownerPanCard)) ? (
//                       <a
//                         href={buildFileUrl(doctor.documents.ownerPanCard)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block truncate"
//                       >
//                         <span className="truncate block">
//                           {doctor.documents.ownerPanCard.split("/").pop() || "View Document"}
//                         </span>
//                       </a>
//                     ) : (
//                       <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                         <span className="truncate block">
//                           {doctor.documents.ownerPanCard.split("/").pop() || "Document not accessible"}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {doctor.documents?.ownerAadhaarCard && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Owner Aadhaar Card
//                     </label>
//                     {isValidFileUrl(buildFileUrl(doctor.documents.ownerAadhaarCard)) ? (
//                       <a
//                         href={buildFileUrl(doctor.documents.ownerAadhaarCard)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-full p-3 bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 text-left block truncate"
//                       >
//                         <span className="truncate block">
//                           {doctor.documents.ownerAadhaarCard.split("/").pop() || "View Document"}
//                         </span>
//                       </a>
//                     ) : (
//                       <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-500">
//                         <span className="truncate block">
//                           {doctor.documents.ownerAadhaarCard.split("/").pop() || "Document not accessible"}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Other documents */}
//           {doctor.documents?.otherDocs && doctor.documents.otherDocs.length > 0 && (
//             <div className="mb-6">
//               <h3 className="text-lg font-medium text-gray-700 mb-3">Other Documents</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                 {doctor.documents.otherDocs.map((doc, idx) => {
//                   const fileUrl = buildFileUrl(doc);
//                   return isValidFileUrl(fileUrl) ? (
//                     <a
//                       key={idx}
//                       href={fileUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-3 bg-gray-50 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-left block truncate"
//                     >
//                       <span className="truncate block text-sm">
//                         {doc.split("/").pop() || `Document ${idx + 1}`}
//                       </span>
//                     </a>
//                   ) : (
//                     <div
//                       key={idx}
//                       className="p-3 bg-gray-50 border border-gray-300 rounded text-gray-500"
//                     >
//                       <span className="truncate block text-sm">
//                         {doc.split("/").pop() || `Document ${idx + 1}`}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {(!doctor.documents ||
//             (!doctor.documents.aadhar &&
//               !doctor.documents.pan &&
//               !doctor.documents.medicalRegistration &&
//               !doctor.documents.additionalQualification &&
//               !doctor.documents.visitingCard &&
//               !doctor.documents.bankDetails &&
//               !doctor.documents.hospitalPanDocument &&
//               !doctor.documents.registrationCertificate &&
//               !doctor.documents.hospitalGstDocument &&
//               !doctor.documents.ownerPanCard &&
//               !doctor.documents.ownerAadhaarCard &&
//               (!doctor.documents.otherDocs || doctor.documents.otherDocs.length === 0))) && (
//               <div className="text-center text-gray-500 py-4">
//                 No documents uploaded
//               </div>
//             )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-center space-x-3 mt-6 pt-6 border-t">
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
//           >
//             Back
//           </button>
//           <button
//             onClick={() => navigate(`/edit-doctor/${id}`)}
//             className="bg-[#15BBB3] text-white px-6 py-2 rounded hover:bg-[#13a89e]"
//           >
//             Edit Doctor
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewDoctor;  