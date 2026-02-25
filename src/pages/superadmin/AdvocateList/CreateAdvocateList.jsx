
// // src/pages/Admin/Advocates/CreateAdvocateForm.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from "react-toastify";
// import DateInput from "../../../components/DateInput/DateInput";
// import LocationInput from "../../../components/LocationInput";

// // ================= PREVIEW MODAL =================
// const ImagePreviewModal = ({ isOpen, onClose, preview }) => {
//   if (!isOpen || !preview) return null;

//   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

//   const getUrl = (path) => {
//     if (!path) return '';
//     if (path.startsWith('http')) return path;
//     // Convert Windows path to URL path
//     const normalizedPath = path.replace(/\\/g, '/');
//     const filename = normalizedPath.split('/').pop();
//     return `${API_BASE_URL}/uploads/${filename}`;
//   };

//   const url = preview.previewUrl || getUrl(preview.path);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
//       <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
//           <h3 className="text-xl font-bold">Document Preview: {preview.name}</h3>
//           <button onClick={onClose} className="text-3xl hover:text-red-600">&times;</button>
//         </div>
//         <div className="p-8 flex flex-col items-center">
//           {preview.type?.startsWith('image/') || (url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif'))) ? (
//             <img src={url} alt={preview.name} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" />
//           ) : (
//             <>
//               <div className="w-40 h-40 bg-red-100 rounded-full flex items-center justify-center mb-6">
//                 <span className="text-8xl text-red-600">📄</span>
//               </div>
//               <a href={url} target="_blank" rel="noopener noreferrer"
//                 className="px-8 py-4 bg-red-600 text-white text-lg rounded-lg hover:bg-red-700">
//                 Open in New Tab
//               </a>
//             </>
//           )}
//           <p></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ================= FILE UPLOAD COMPONENT =================
// const FileUpload = ({ label, file, onFileSelect, onPreviewClick, onRemove }) => {
//   const displayName = file ? file.name : 'No file chosen';

//   const handleChange = (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;

//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       onFileSelect({
//         file: selected,
//         name: selected.name,
//         type: selected.type,
//         size: selected.size,
//         previewUrl: ev.target.result,
//         exists: false
//       });
//     };
//     reader.readAsDataURL(selected);
//   };

//   const handlePreviewClick = () => {
//     if (!file) return;

//     const previewObj = {
//       name: file.name,
//       type: file.type || 'application/pdf',
//       previewUrl: file.previewUrl || null,
//       path: file.path || null
//     };
//     onPreviewClick(previewObj);
//   };

//   return (
//     <div className="space-y-3">
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       <label className="cursor-pointer block">
//         <input type="file" className="hidden" onChange={handleChange} accept="image/*,.pdf" />
//         <div className={`border-2 border-dashed rounded-lg p-6 text-center transition
//           ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}>
//           <p className={`text-sm font-medium ${file ? 'text-green-700' : 'text-gray-600'}`}>
//             {file ? 'Change File' : 'Choose File'}
//           </p>
//           <p className="text-xs text-gray-500 mt-1">{displayName}</p>
//         </div>
//       </label>

//       {file && (
//         <div className="relative">
//           <div
//             onClick={handlePreviewClick}
//             className="cursor-pointer p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition shadow-sm"
//           >
//             {file.previewUrl ? (
//               <div className="flex items-center gap-4">
//                 <img src={file.previewUrl} alt="preview" className="w-24 h-24 object-cover rounded-lg shadow" />
//                 <div>
//                   <p className="font-medium text-sm">{file.name}</p>
//                   <p className="text-xs text-blue-600 font-medium">Click to view full size →</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center gap-4">
//                 <div className="text-6xl text-red-600">📄</div>
//                 <div>
//                   <p className="font-medium text-sm">{file.name}</p>
//                   <p className="text-xs text-blue-600 font-medium">Click to preview document →</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Remove button - only show for existing files in edit mode */}
//           {file.exists && (
//             <button
//               type="button"
//               onClick={() => onRemove && onRemove()}
//               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
//             >
//               ×
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const CreateAdvocateForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const editData = location.state?.editData;

//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentPreview, setCurrentPreview] = useState(null);

//   const [formData, setFormData] = useState({
//     fullName: "", dob: "", gender: "Male", contact1: "", contact2: "", email: "",
//     address: "", city: "", taluka: "", district: "", state: "",
//     enrollmentNo: "", enrollmentYear: "", qualifications: "", specialization: "",
//     courtPracticing: "", experience: "", officeAddress: "",
//     accountHolderName: "", bankName: "", branch: "", accountNumber: "", ifsc: "", upi: "",
//     pan: "", gst: "", aadhar: "", license: "", narration: "",
//     status: "active", // Default status
//     panFile: null, gstFile: null, aadharFile: null, licenseFile: null,
//   });

//   // Dropdown options
//   const states = ["Maharashtra", "Gujarat", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Rajasthan"];
//   const districts = ["Mumbai", "Pune", "Thane", "Nagpur", "Nashik", "Aurangabad"];
//   const cities = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Kalyan"];
//   const talukas = ["Andheri", "Borivali", "Kurla", "Pune City", "Hadapsar"];

//   // Initialize form when entering edit mode
//   useEffect(() => {
//     if (editData) {
//       console.log("Edit Data received:", editData);

//       const formatDob = (date) => {
//         if (!date) return "";
//         const d = new Date(date);
//         return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
//       };

//       // Safe function to get string value or empty
//       const safeStr = (val) => (val ? String(val) : "");

//       // Safe function for address fields
//       const safeAddress = (addressObj, field) => {
//         if (!addressObj || typeof addressObj !== 'object') return "";
//         return safeStr(addressObj[field] || "");
//       };

//       // Create a new state object for the edit data to avoid reference issues
//       const newFormData = {
//         fullName: safeStr(editData.fullName).toUpperCase(),
//         dob: formatDob(editData.dob),
//         gender: safeStr(editData.gender || "Male"),
//         contact1: safeStr(editData.phoneNumber),
//         contact2: safeStr(editData.whatsappNumber),
//         email: safeStr(editData.email).toLowerCase(),
//         address: safeAddress(editData.residentialAddress, "address").toUpperCase(),
//         city: safeAddress(editData.residentialAddress, "city"),
//         taluka: safeAddress(editData.residentialAddress, "taluka"),
//         district: safeAddress(editData.residentialAddress, "district"),
//         state: safeAddress(editData.residentialAddress, "state"),
//         enrollmentNo: safeStr(editData.barCouncilNumber),
//         enrollmentYear: editData.enrollmentYear || (editData.enrollmentDate ? new Date(editData.enrollmentDate).getFullYear().toString() : ""),
//         qualifications: Array.isArray(editData.qualifications)
//           ? editData.qualifications.map(q => q.degree).join(', ')
//           : safeStr(editData.qualifications),
//         specialization: Array.isArray(editData.specialization)
//           ? editData.specialization[0] || ""
//           : (typeof editData.specialization === 'string' ? editData.specialization.split(',')[0].trim() : safeStr(editData.specialization)),
//         courtPracticing: Array.isArray(editData.courts) && editData.courts.length > 0
//           ? editData.courts.map(c => c.courtName).join(', ')
//           : safeStr(editData.courtPracticing),
//         experience: safeStr(editData.experience),
//         officeAddress: editData.officeAddress && typeof editData.officeAddress === 'object'
//           ? safeStr(editData.officeAddress.address).toUpperCase()
//           : safeStr(editData.officeAddress).toUpperCase(),
//         accountHolderName: editData.billingDetails?.bankDetails?.accountHolderName
//           ? safeStr(editData.billingDetails.bankDetails.accountHolderName).toUpperCase()
//           : "",
//         bankName: editData.billingDetails?.bankDetails?.bankName
//           ? safeStr(editData.billingDetails.bankDetails.bankName).toUpperCase()
//           : "",
//         branch: editData.officeAddress && typeof editData.officeAddress === 'object'
//           ? safeStr(editData.officeAddress.branch).toUpperCase()
//           : "",
//         accountNumber: editData.billingDetails?.bankDetails?.accountNumber
//           ? safeStr(editData.billingDetails.bankDetails.accountNumber)
//           : "",
//         ifsc: editData.billingDetails?.bankDetails?.ifscCode
//           ? safeStr(editData.billingDetails.bankDetails.ifscCode).toUpperCase()
//           : "",
//         upi: safeStr(editData.upi),
//         pan: editData.billingDetails?.panNumber
//           ? safeStr(editData.billingDetails.panNumber).toUpperCase()
//           : "",
//         gst: editData.billingDetails?.gstNumber
//           ? safeStr(editData.billingDetails.gstNumber).toUpperCase()
//           : "",
//         aadhar: safeStr(editData.aadhar),
//         license: safeStr(editData.license),
//         narration: safeStr(editData.remarks || editData.narration),
//         status: safeStr(editData.status || "active"),

//         // Document files - ensure we create fresh objects to avoid reference issues
//         panFile: editData.documents?.panFile ? {
//           name: editData.documents.panFile.split('\\').pop().split('/').pop(),
//           path: editData.documents.panFile,
//           exists: true
//         } : null,
//         gstFile: editData.documents?.gstFile ? {
//           name: editData.documents.gstFile.split('\\').pop().split('/').pop(),
//           path: editData.documents.gstFile,
//           exists: true
//         } : null,
//         aadharFile: editData.documents?.photoIdProof ? {
//           name: editData.documents.photoIdProof.split('\\').pop().split('/').pop(),
//           path: editData.documents.photoIdProof,
//           exists: true
//         } : null,
//         licenseFile: editData.documents?.addressProof ? {
//           name: editData.documents.addressProof.split('\\').pop().split('/').pop(),
//           path: editData.documents.addressProof,
//           exists: true
//         } : null,
//       };

//       setFormData(newFormData);
//     }
//     // Remove editData from dependency array to prevent re-execution on every render
//   }, []); // Only run once on mount

//   const openPreview = (previewObj) => {
//     setCurrentPreview(previewObj);
//     setModalOpen(true);
//   };

//   const handleInput = (field, value) => {
//     let val = value;

//     // Special handling for different field types
//     switch (field) {
//       case 'email':
//         val = value.toLowerCase();
//         break;

//       case 'contact1':
//       case 'contact2':
//         val = value.replace(/\D/g, '').slice(0, 10);
//         break;

//       case 'aadhar':
//         val = value.replace(/\D/g, '').slice(0, 12);
//         break;

//       case 'accountNumber':
//         val = value.replace(/\D/g, '').slice(0, 18);
//         break;

//       case 'pan':
//         // Allow only alphanumeric characters and convert to uppercase
//         val = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
//         // Ensure the format matches PAN: 5 letters + 4 numbers + 1 letter
//         if (val.length > 10) val = val.slice(0, 10);
//         break;

//       case 'enrollmentYear':
//         val = value.replace(/\D/g, '').slice(0, 4);
//         break;

//       case 'experience':
//         val = value.replace(/\D/g, '').slice(0, 2);
//         break;

//       case 'gst':
//         val = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
//         break;

//       default:
//         // For text fields, convert to uppercase except email
//         if (!['email', 'contact1', 'contact2', 'aadhar', 'accountNumber', 'experience', 'pan', 'gst', 'ifsc', 'upi', 'enrollmentNo'].includes(field)) {
//           val = value.toUpperCase();
//         }
//     }

//     setFormData(prev => ({ ...prev, [field]: val }));
//   };

//   const handleSelect = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   // Function to handle file removal
//   const removeFile = (field) => {
//     setFormData(prev => ({ ...prev, [field]: null }));
//   };

//   const validate = () => {
//     if (!formData.fullName.trim()) return "Full Name is required";
//     if (formData.contact1 && formData.contact1.length !== 10) return "Contact No 1 must be 10 digits";
//     if (!formData.enrollmentNo.trim()) return "Enrollment No is required";
//     if (formData.dob && !/^\d{2}-\d{2}-\d{4}$/.test(formData.dob)) return "Date of Birth must be in DD-MM-YYYY format";
//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Valid email required";
//     if (formData.aadhar && formData.aadhar.length !== 12) return "Aadhar must be 12 digits";
//     if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) return "Invalid PAN (e.g., ABCDE1234F)";
//     return null;
//   };

//   const handleSave = async () => {
//     const err = validate();
//     if (err) {
//       toast.error(err);
//       return;
//     }

//     setLoading(true);
//     try {
//       // Prepare the data according to backend structure
//       const payload = {
//         fullName: formData.fullName,
//         phoneNumber: formData.contact1,
//         whatsappNumber: formData.contact2,
//         email: formData.email,
//         gender: formData.gender,
//         barCouncilNumber: formData.enrollmentNo,
//         specialization: formData.specialization ? [formData.specialization] : [],
//         experience: parseInt(formData.experience) || 0,
//         aadhar: formData.aadhar,
//         license: formData.license,
//         upi: formData.upi,
//         practiceType: "individual",
//         status: formData.status,
//         availability: "available",
//         remarks: formData.narration,

//         residentialAddress: {
//           address: formData.address,
//           city: formData.city,
//           taluka: formData.taluka,
//           district: formData.district,
//           state: formData.state,
//           country: "India"
//         },

//         officeAddress: formData.officeAddress,

//         billingDetails: {
//           bankDetails: {
//             bankName: formData.bankName,
//             accountNumber: formData.accountNumber,
//             ifscCode: formData.ifsc,
//             accountHolderName: formData.accountHolderName
//           },
//           gstNumber: formData.gst,
//           panNumber: formData.pan
//         },

//         qualifications: formData.qualifications ? formData.qualifications.split(',').map(q => ({ degree: q.trim() })) : [],
//         courts: formData.courtPracticing ? formData.courtPracticing.split(',').map(c => ({
//           courtName: c.trim(),
//           courtType: "other"
//         })) : [],

//         communicationPreferences: {
//           email: true,
//           sms: true,
//           whatsapp: true,
//           phone: true
//         }
//       };

//       // Add date fields if they exist
//       if (formData.dob) {
//         const [d, m, y] = formData.dob.split('-');
//         payload.dob = `${y}-${m}-${d}`;
//       }

//       if (formData.enrollmentYear) {
//         payload.enrollmentYear = parseInt(formData.enrollmentYear, 10);
//       }

//       const fd = new FormData();
//       fd.append('data', JSON.stringify(payload));

//       // Add files if they exist (newly uploaded, not existing ones)
//       if (formData.panFile && !formData.panFile.exists) {
//         fd.append('panFile', formData.panFile.file);
//       }
//       if (formData.gstFile && !formData.gstFile.exists) {
//         fd.append('gstFile', formData.gstFile.file);
//       }
//       if (formData.aadharFile && !formData.aadharFile.exists) {
//         fd.append('photoIdProof', formData.aadharFile.file);
//       }
//       if (formData.licenseFile && !formData.licenseFile.exists) {
//         fd.append('addressProof', formData.licenseFile.file);
//       }

//       // For updates, also indicate which existing files to keep or delete
//       if (editData?._id) {
//         // Add flags for existing files - if exists but not replaced with new file, preserve
//         // If a file field is null, it means it was removed
//         if (formData.panFile?.exists && !formData.panFile?.file) fd.append('deletePanFile', 'true');
//         else if (formData.panFile?.exists) fd.append('keepExistingPanFile', 'true');

//         if (formData.gstFile?.exists && !formData.gstFile?.file) fd.append('deleteGstFile', 'true');
//         else if (formData.gstFile?.exists) fd.append('keepExistingGstFile', 'true');

//         if (formData.aadharFile?.exists && !formData.aadharFile?.file) fd.append('deleteAadharFile', 'true');
//         else if (formData.aadharFile?.exists) fd.append('keepExistingAadharFile', 'true');

//         if (formData.licenseFile?.exists && !formData.licenseFile?.file) fd.append('deleteLicenseFile', 'true');
//         else if (formData.licenseFile?.exists) fd.append('keepExistingLicenseFile', 'true');
//       }

//       let res;
//       if (editData?._id) {
//         res = await apiClient.put(
//           apiEndpoints.advocates.update(editData._id),
//           fd,
//           { headers: { 'Content-Type': 'multipart/form-data' } }
//         );
//       } else {
//         res = await apiClient.post(
//           apiEndpoints.advocates.create,
//           fd,
//           { headers: { 'Content-Type': 'multipart/form-data' } }
//         );
//       }

//       if (res.data.success) {
//         toast.success(editData ? "Advocate updated successfully!" : "Advocate created successfully!");
//         navigate("/admin/advocate-list");
//       } else {
//         toast.error(res.data.message || "Operation failed");
//       }
//     } catch (e) {
//       console.error("Save error:", e);
//       toast.error(e.response?.data?.message || "Save failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
//         {editData ? "Edit Advocate" : "Create Advocate"}
//       </h2>

//       {/* Personal Details */}
//       <div className="mb-10">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//             <input type="text" value={formData.fullName} onChange={(e) => handleInput('fullName', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//             <DateInput value={formData.dob} onChange={(v) => setFormData(prev => ({ ...prev, dob: v }))} />
//           </div>

//           <div className="flex items-center space-x-8 mt-6">
//             <label className="flex items-center cursor-pointer">
//               <input type="radio" name="gender" checked={formData.gender === "Male"}
//                 onChange={() => setFormData(prev => ({ ...prev, gender: "Male" }))}
//                 className="mr-2 w-4 h-4" />
//               Male
//             </label>
//             <label className="flex items-center cursor-pointer">
//               <input type="radio" name="gender" checked={formData.gender === "Female"}
//                 onChange={() => setFormData(prev => ({ ...prev, gender: "Female" }))}
//                 className="mr-2 w-4 h-4" />
//               Female
//             </label>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Contact No 1 *</label>
//             <input type="text" value={formData.contact1} onChange={(e) => handleInput('contact1', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" placeholder="10 digits" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Contact No 2</label>
//             <input type="text" value={formData.contact2} onChange={(e) => handleInput('contact2', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" placeholder="10 digits" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input type="email" value={formData.email} onChange={(e) => handleInput('email', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md lowercase" placeholder="example@gmail.com" />
//           </div>

//           <div className="md:col-span-2 lg:col-span-3">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//             <textarea value={formData.address} onChange={(e) => handleInput('address', e.target.value)} rows={2}
//               className="w-full p-3 border border-gray-300 rounded-md resize-vertical" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
//             <LocationInput
//               value={formData.state}
//               onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
//               type="state"
//               placeholder="Select or type state"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
//             <LocationInput
//               value={formData.district}
//               onChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
//               type="district"
//               placeholder="Select or type district"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//             <LocationInput
//               value={formData.city}
//               onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
//               type="city"
//               placeholder="Select or type city"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
//             <LocationInput
//               value={formData.taluka}
//               onChange={(value) => setFormData(prev => ({ ...prev, taluka: value }))}
//               type="taluka"
//               placeholder="Select or type taluka"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Professional Details */}
//       <div className="mb-10">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment No *</label>
//             <input type="text" value={formData.enrollmentNo} onChange={(e) => handleInput('enrollmentNo', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" placeholder="Bar Council Registration No" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Year</label>
//             <input type="text" value={formData.enrollmentYear} onChange={(e) => handleInput('enrollmentYear', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" maxLength="4" placeholder="YYYY" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
//             <input type="text" value={formData.qualifications} onChange={(e) => handleInput('qualifications', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" placeholder="LLB, LLM, etc." />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
//             <select value={formData.specialization} onChange={(e) => handleSelect('specialization', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md bg-white">
//               <option value="">-- Select --</option>
//               <option value="Civil">Civil</option>
//               <option value="Criminal">Criminal</option>
//               <option value="Consumer">Consumer</option>
//               <option value="Family">Family</option>
//               <option value="Corporate">Corporate</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Court Practicing In</label>
//             <input type="text" value={formData.courtPracticing} onChange={(e) => handleInput('courtPracticing', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" placeholder="Supreme Court, High Court, etc." />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
//             <input type="number" value={formData.experience} onChange={(e) => handleInput('experience', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" min="0" max="50" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select value={formData.status} onChange={(e) => handleSelect('status', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md bg-white">
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="retired">Retired</option>
//             </select>
//           </div>
//           <div className="md:col-span-2 lg:col-span-3">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
//             <textarea placeholder="Office Address" value={formData.officeAddress} onChange={(e) => handleInput('officeAddress', e.target.value)} rows={2}
//               className="w-full p-3 border border-gray-300 rounded-md resize-vertical" />
//           </div>
//         </div>
//       </div>

//       {/* Bank Details */}
//       <div className="mb-10">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank / Payment Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
//             <input type="text" placeholder="Account Holder Name" value={formData.accountHolderName} onChange={(e) => handleInput('accountHolderName', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
//             <input type="text" placeholder="Bank Name" value={formData.bankName} onChange={(e) => handleInput('bankName', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
//             <input type="text" placeholder="Branch" value={formData.branch} onChange={(e) => handleInput('branch', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
//             <input type="text" placeholder="Account Number" value={formData.accountNumber} onChange={(e) => handleInput('accountNumber', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Number</label>
//             <input type="text" placeholder="IFSC Number" value={formData.ifsc} onChange={(e) => handleInput('ifsc', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md uppercase" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID (Optional)</label>
//             <input type="text" placeholder="UPI ID" value={formData.upi} onChange={(e) => handleInput('upi', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//         </div>
//       </div>

//       {/* Upload Documents */}
//       <div className="mb-10">
//         <h3 className="text-lg font-semibold text-gray-800 mb-6">Upload Documents</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
//             <input type="text" value={formData.pan} onChange={(e) => handleInput('pan', e.target.value)}
//               placeholder="ABCDE1234F" className="w-full p-3 border border-gray-300 rounded-md mb-3 uppercase" />
//             <FileUpload label="PAN Card" file={formData.panFile} onFileSelect={(f) => setFormData(prev => ({ ...prev, panFile: f }))} onPreviewClick={openPreview} onRemove={() => removeFile('panFile')} />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
//             <input type="text" placeholder="GST NUMBER" value={formData.gst} onChange={(e) => handleInput('gst', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md mb-3 uppercase" />
//             <FileUpload label="GST Certificate" file={formData.gstFile} onFileSelect={(f) => setFormData(prev => ({ ...prev, gstFile: f }))} onPreviewClick={openPreview} onRemove={() => removeFile('gstFile')} />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
//             <input type="text" value={formData.aadhar} onChange={(e) => handleInput('aadhar', e.target.value)}
//               placeholder="12 digits" className="w-full p-3 border border-gray-300 rounded-md mb-3" />
//             <FileUpload label="Aadhar Card (Photo ID Proof)" file={formData.aadharFile} onFileSelect={(f) => setFormData(prev => ({ ...prev, aadharFile: f }))} onPreviewClick={openPreview} onRemove={() => removeFile('aadharFile')} />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
//             <input type="text" value={formData.license} onChange={(e) => handleInput('license', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md mb-3 uppercase " />
//             <FileUpload label="License" file={formData.licenseFile} onFileSelect={(f) => setFormData(prev => ({ ...prev, licenseFile: f }))} onPreviewClick={openPreview} onRemove={() => removeFile('licenseFile')} />
//           </div>
//         </div>
//       </div>

//       {/* Narration */}
//       <div className="mb-10">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Narration / Remarks</label>
//         <textarea value={formData.narration} onChange={(e) => handleInput('narration', e.target.value)}
//           rows={4} placeholder="Enter narration or remarks..." className="w-full p-4 border border-gray-300 rounded-md resize-vertical" />
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-6">
//         <button onClick={() => navigate(-1)} disabled={loading}
//           className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition">
//           Cancel
//         </button>
//         <button onClick={handleSave} disabled={loading}
//           className="px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2">
//           {loading ? (
//             <>
//               <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
//               Saving...
//             </>
//           ) : (
//             editData ? "Update Advocate" : "Create Advocate"
//           )}
//         </button>
//       </div>

//       <ImagePreviewModal isOpen={modalOpen} onClose={() => setModalOpen(false)} preview={currentPreview} />
//     </div>
//   );
// };

// export default CreateAdvocateForm;













// // src/pages/Admin/Advocates/CreateAdvocateForm.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from "react-toastify";
// import DateInput from "../../../components/DateInput/DateInput";

// // ================= PREVIEW MODAL =================
// const ImagePreviewModal = ({ isOpen, onClose, preview }) => {
//   if (!isOpen || !preview) return null;

//   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

//   const getUrl = (path) => {
//     if (!path) return '';
//     if (path.startsWith('http')) return path;
//     return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
//   };

//   const url = preview.previewUrl || getUrl(preview.path);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
//       <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
//           <h3 className="text-xl font-bold">Document Preview: {preview.name}</h3>
//           <button onClick={onClose} className="text-3xl hover:text-red-600">&times;</button>
//         </div>
//         <div className="p-8 flex flex-col items-center">
//           {preview.type?.startsWith('image/') || preview.previewUrl ? (
//             <img src={url} alt={preview.name} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" />
//           ) : (
//             <>
//               <div className="w-40 h-40 bg-red-100 rounded-full flex items-center justify-center mb-6">
//                 <span className="text-8xl text-red-600">📄</span>
//               </div>
//               <a href={url} target="_blank" rel="noopener noreferrer"
//                 className="px-8 py-4 bg-red-600 text-white text-lg rounded-lg hover:bg-red-700">
//                 Open in New Tab
//               </a>
//             </>
//           )}
//           <p className="mt-6 text-sm text-gray-600">{preview.name}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ================= FILE UPLOAD COMPONENT (Fixed Preview Click) =================
// const FileUpload = ({ label, file, onFileSelect, onPreviewClick }) => {
//   const displayName = file ? file.name : 'No file chosen';

//   const handleChange = (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;

//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       onFileSelect({
//         file: selected,
//         name: selected.name,
//         type: selected.type,
//         size: selected.size,
//         previewUrl: ev.target.result,
//         exists: false
//       });
//     };
//     reader.readAsDataURL(selected);
//   };

//   // Existing file (from edit mode) ke liye preview click handle
//   // const handlePreviewClick = () => {
//   //   if (!file) return;

//   //   // Create preview object for modal
//   //   const previewObj = {
//   //     name: file.name,
//   //     type: file.type || 'application/pdf',
//   //     previewUrl: file.previewUrl || null,
//   //     path: file.path || null  // for existing files from server
//   //   };
//   //   onPreviewClick(previewObj);
//   // };

//   // FileUpload component ke andar – handlePreviewClick ko update karo
// const handlePreviewClick = () => {
//   if (!file) return;

//   const previewObj = {
//     name: file.name,
//     type: file.type || 'application/pdf',
//     previewUrl: file.previewUrl || null,
//     path: file.path || null
//   };

//   // Yeh line add karo – modal open karega
//   onPreviewClick(previewObj);
//   // Agar parent mein setModalOpen hai to automatically open ho jayega jab currentPreview set hoga
// };

//   return (
//     <div className="space-y-3">
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       <label className="cursor-pointer block">
//         <input type="file" className="hidden" onChange={handleChange} accept="image/*,.pdf" />
//         <div className={`border-2 border-dashed rounded-lg p-6 text-center transition
//           ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}>
//           <p className={`text-sm font-medium ${file ? 'text-green-700' : 'text-gray-600'}`}>
//             {file ? 'Change File' : 'Choose File'}
//           </p>
//           <p className="text-xs text-gray-500 mt-1">{displayName}</p>
//         </div>
//       </label>

//       {/* Thumbnail Preview - Clickable */}
//       {file && (
//         <div
//           onClick={handlePreviewClick}
//           className="cursor-pointer p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition shadow-sm"
//         >
//           {file.previewUrl ? (
//             <div className="flex items-center gap-4">
//               <img src={file.previewUrl} alt="preview" className="w-24 h-24 object-cover rounded-lg shadow" />
//               <div>
//                 <p className="font-medium text-sm">{file.name}</p>
//                 <p className="text-xs text-blue-600 font-medium">Click to view full size →</p>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center gap-4">
//               <div className="text-6xl text-red-600">📄</div>
//               <div>
//                 <p className="font-medium text-sm">{file.name}</p>
//                 <p className="text-xs text-blue-600 font-medium">Click to preview document →</p>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const CreateAdvocateForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const editData = location.state?.editData;

//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentPreview, setCurrentPreview] = useState(null);

//   const [formData, setFormData] = useState({
//     fullName: "", dob: "", gender: "Male", contact1: "", contact2: "", email: "",
//     address: "", city: "", taluka: "", district: "", state: "",
//     enrollmentNo: "", enrollmentYear: "", qualifications: "", specialization: "",
//     courtPracticing: "", experience: "", officeAddress: "",
//     accountHolderName: "", bankName: "", branch: "", accountNumber: "", ifsc: "", upi: "",
//     pan: "", gst: "", aadhar: "", license: "", narration: "",
//     panFile: null, gstFile: null, aadharFile: null, licenseFile: null,
//   });

//   // Dropdown options
//   const states = ["Maharashtra", "Gujarat", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Rajasthan"];
//   const districts = ["Mumbai", "Pune", "Thane", "Nagpur", "Nashik", "Aurangabad"];
//   const cities = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Kalyan"];
//   const talukas = ["Andheri", "Borivali", "Kurla", "Pune City", "Hadapsar"];

//   useEffect(() => {
//     if (editData) {
//       const formatDob = (date) => {
//         if (!date) return "";
//         const d = new Date(date);
//         return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
//       };

//       setFormData({
//         fullName: editData.fullName?.toUpperCase() || "",
//         dob: formatDob(editData.dob),
//         gender: editData.gender || "Male",
//         contact1: editData.phoneNumber || "",
//         contact2: editData.whatsappNumber || "",
//         email: (editData.email || "").toLowerCase(),
//         address: editData.residentialAddress?.address?.toUpperCase() || "",
//         city: editData.residentialAddress?.city || "",
//         taluka: editData.residentialAddress?.taluka || "",
//         district: editData.residentialAddress?.district || "",
//         state: editData.residentialAddress?.state || "",
//         enrollmentNo: editData.barCouncilNumber || "",
//         enrollmentYear: editData.enrollmentYear || "",
//         qualifications: editData.qualifications || "",
//         specialization: editData.specialization || "",
//         courtPracticing: editData.courtPracticing || "",
//         experience: editData.experience || "",
//         officeAddress: editData.officeAddress?.toUpperCase() || "",
//         accountHolderName: editData.accountHolderName?.toUpperCase() || "",
//         bankName: editData.bankName?.toUpperCase() || "",
//         branch: editData.branch?.toUpperCase() || "",
//         accountNumber: editData.accountNumber || "",
//         ifsc: editData.ifsc?.toUpperCase() || "",
//         upi: editData.upi || "",
//         pan: editData.pan?.toUpperCase() || "",
//         gst: editData.gst?.toUpperCase() || "",
//         aadhar: editData.aadhar || "",
//         license: editData.license || "",
//         narration: editData.narration || "",
//         panFile: editData.documents?.panFile ? { name: editData.documents.panFile.split('/').pop(), path: editData.documents.panFile, exists: true } : null,
//         gstFile: editData.documents?.gstFile ? { name: editData.documents.gstFile.split('/').pop(), path: editData.documents.gstFile, exists: true } : null,
//         aadharFile: editData.documents?.aadharFile ? { name: editData.documents.aadharFile.split('/').pop(), path: editData.documents.aadharFile, exists: true } : null,
//         licenseFile: editData.documents?.licenseFile ? { name: editData.documents.licenseFile.split('/').pop(), path: editData.documents.licenseFile, exists: true } : null,
//       });
//     }
//   }, [editData]);

//   // CreateAdvocateForm ke andar – yeh function replace kar do
// const openPreview = (previewObj) => {
//   setCurrentPreview(previewObj);
//   setModalOpen(true); // ← Yeh line add karo – modal open karega
// };

//   const handleInput = (field, value) => {
//     let val = value;

//     // Uppercase for text fields (except email & numbers)
//     if (!['email', 'contact1', 'contact2', 'aadhar', 'accountNumber', 'ifsc', 'upi'].includes(field)) {
//       val = value.toUpperCase();
//     }

//     // Only digits for phone & aadhar
//     if (['contact1', 'contact2'].includes(field)) val = value.replace(/\D/g, '').slice(0, 10);
//     if (field === 'aadhar') val = value.replace(/\D/g, '').slice(0, 12);
//     if (field === 'accountNumber') val = value.replace(/\D/g, '').slice(0, 18);
//     // if (field === 'pan') val = value.replace(/\D/g, '').slice(0, 10).toUpperCase();
//     if (field === 'pan') {
//   val = value
//     .toUpperCase()
//     .replace(/[^A-Z0-9]/g, '') // only alphanumeric
//     .slice(0, 10);             // max 10 chars
// }

//     if (field === 'enrollmentYear') val = value.replace(/\D/g, '').slice(0, 4);

//     // Email lowercase
//     if (field === 'email') val = value.toLowerCase();

//     setFormData(prev => ({ ...prev, [field]: val }));
//   };

//   const validate = () => {
//     if (!formData.fullName.trim()) return "Full Name is required";
//     if (formData.contact1.length !== 10) return "Contact No 1 must be 10 digits";
//     if (!formData.enrollmentNo.trim()) return "Enrollment No is required";
//     if (!formData.dob) return "Date of Birth is required";
//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Valid email required";
//     if (formData.aadhar && formData.aadhar.length !== 12) return "Aadhar must be 12 digits";
//     if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) return "Invalid PAN (e.g., ABCDE1234F)";
//     return null;
//   };

//   const handleSave = async () => {
//     const err = validate();
//     if (err) {
//       toast.error(err);
//       return;
//     }

//     setLoading(true);
//     try {
//       const fd = new FormData();
//       const payload = { ...formData };

//       // Convert DOB
//       if (payload.dob) {
//         const [d, m, y] = payload.dob.split('-');
//         payload.dob = `${y}-${m}-${d}`;
//       }

//       fd.append('data', JSON.stringify(payload));

//       if (formData.panFile && !formData.panFile.exists) fd.append('panFile', formData.panFile.file);
//       if (formData.gstFile && !formData.gstFile.exists) fd.append('gstFile', formData.gstFile.file);
//       if (formData.aadharFile && !formData.aadharFile.exists) fd.append('aadharFile', formData.aadharFile.file);
//       if (formData.licenseFile && !formData.licenseFile.exists) fd.append('licenseFile', formData.licenseFile.file);

//       const res = editData?._id
//         ? await apiClient.put(apiEndpoints.advocates.update(editData._id), fd, { headers: { 'Content-Type': 'multipart/form-data' } })
//         : await apiClient.post(apiEndpoints.advocates.create, fd, { headers: { 'Content-Type': 'multipart/form-data' } });

//       if (res.data.success) {
//         toast.success(editData ? "Advocate updated!" : "Advocate created!");
//         navigate("/admin/advocate-list");
//       } else {
//         toast.error(res.data.message || "Failed");
//       }
//     } catch (e) {
//       toast.error(e.response?.data?.message || "Save failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
//         {editData ? "Edit Advocate" : "Create Advocate"}
//       </h2>

//       {/* Personal Details */}
//       <div className="mb-10">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//             <input type="text" value={formData.fullName} onChange={(e) => handleInput('fullName', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//             <DateInput value={formData.dob} onChange={(v) => setFormData(prev => ({ ...prev, dob: v }))} />
//           </div>

//           <div className="flex items-center space-x-8 mt-6">
//             <label className="flex items-center"><input type="radio" checked={formData.gender === "Male"} onChange={() => setFormData(prev => ({ ...prev, gender: "Male" }))} className="mr-2" /> Male</label>
//             <label className="flex items-center"><input type="radio" checked={formData.gender === "Female"} onChange={() => setFormData(prev => ({ ...prev, gender: "Female" }))} className="mr-2" /> Female</label>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Contact No 1</label>
//             <input type="text" value={formData.contact1} onChange={(e) => handleInput('contact1', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" placeholder="10 digits" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Contact No 2</label>
//             <input type="text" value={formData.contact2} onChange={(e) => handleInput('contact2', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" placeholder="10 digits" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input type="text" value={formData.email} onChange={(e) => handleInput('email', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md lowercase" placeholder="example@gmail.com" />
//           </div>

//           <div className="md:col-span-2 lg:col-span-3">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//             <textarea value={formData.address} onChange={(e) => handleInput('address', e.target.value)} rows={2}
//               className="w-full p-3 border border-gray-300 rounded-md resize-vertical" />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//             <select value={formData.city} onChange={(e) => handleInput('city', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md">
//               <option>Select City</option>
//               {cities.map(c => <option key={c}>{c}</option>)}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
//             <select value={formData.taluka} onChange={(e) => handleInput('taluka', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md">
//               <option>Select Taluka</option>
//               {talukas.map(t => <option key={t}>{t}</option>)}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
//             <select value={formData.district} onChange={(e) => handleInput('district', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md">
//               <option>Select District</option>
//               {districts.map(d => <option key={d}>{d}</option>)}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
//             <select value={formData.state} onChange={(e) => handleInput('state', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md">
//               <option>Select State</option>
//               {states.map(s => <option key={s}>{s}</option>)}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Professional Details */}
//       <div className="mb-10">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment No (Bar/Council Reg No)</label>
//             <input type="text" value={formData.enrollmentNo} onChange={(e) => handleInput('enrollmentNo', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Year</label>
//             <input type="text" value={formData.enrollmentYear} onChange={(e) => handleInput('enrollmentYear', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" maxLength="4" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
//             <input type="text" value={formData.qualifications} onChange={(e) => handleInput('qualifications', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
//             <select value={formData.specialization} onChange={(e) => handleInput('specialization', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md">
//               <option>-- Select --</option>
//               <option>Civil</option>
//               <option>Criminal</option>
//               <option>Consumer</option>
//               <option>Family</option>
//               <option>Corporate</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Court Practicing In</label>
//             <input type="text" value={formData.courtPracticing} onChange={(e) => handleInput('courtPracticing', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
//             <input type="number" value={formData.experience} onChange={(e) => handleInput('experience', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" min="0" />
//           </div>
//           <div className="md:col-span-2 lg:col-span-3">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
//             <textarea placeholder="Office Address" value={formData.officeAddress} onChange={(e) => handleInput('officeAddress', e.target.value)} rows={2}
//               className="w-full p-3 border border-gray-300 rounded-md resize-vertical" />
//           </div>
//         </div>
//       </div>

//       {/* Bank Details */}
//       <div className="mb-10">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank / Payment Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
//             <input type="text" placeholder="Account Holder Name" value={formData.accountHolderName} onChange={(e) => handleInput('accountHolderName', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
//             <input type="text" placeholder="Bank Name" value={formData.bankName} onChange={(e) => handleInput('bankName', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
//             <input type="text" placeholder="Branch"  value={formData.branch} onChange={(e) => handleInput('branch', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
//             <input type="text" placeholder="Account Number" value={formData.accountNumber} onChange={(e) => handleInput('accountNumber', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Number</label>
//             <input type="text" placeholder="IFSC Number" value={formData.ifsc} onChange={(e) => handleInput('ifsc', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md uppercase" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID (Optional)</label>
//             <input type="text" placeholder="UPI ID" value={formData.upi} onChange={(e) => handleInput('upi', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md" />
//           </div>
//         </div>
//       </div>

//       {/* Upload Documents */}
//       <div className="mb-10">
//         <h3 className="text-lg font-semibold text-gray-800 mb-6">Upload Documents</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
//             <input type="text" value={formData.pan} onChange={(e) => handleInput('pan', e.target.value)}
//               placeholder="ABCDE1234F" className="w-full p-3 border border-gray-300 rounded-md mb-3 uppercase" />
//             <FileUpload label="" file={formData.panFile} onFileSelect={(f) => setFormData(prev => ({ ...prev, panFile: f }))} onPreviewClick={openPreview} />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
//             <input type="text" value={formData.gst} onChange={(e) => handleInput('gst', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md mb-3 uppercase" />
//             <FileUpload label="" file={formData.gstFile} onFileSelect={(f) => setFormData(prev => ({ ...prev, gstFile: f }))}  onPreviewClick={openPreview} />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
//             <input type="text" value={formData.aadhar} onChange={(e) => handleInput('aadhar', e.target.value)}
//               placeholder="12 digits" className="w-full p-3 border border-gray-300 rounded-md mb-3" />
//             <FileUpload label="" file={formData.aadharFile} onFileSelect={(f) => setFormData(prev => ({ ...prev, aadharFile: f }))} onPreviewClick={openPreview} />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
//             <input type="text" value={formData.license} onChange={(e) => handleInput('license', e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md mb-3 uppercase" />
//             <FileUpload label="" file={formData.licenseFile} onFileSelect={(f) => setFormData(prev => ({ ...prev, licenseFile: f }))} onPreviewClick={openPreview} />
//           </div>
//         </div>
//       </div>

//       {/* Narration */}
//       <div className="mb-10">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Narration</label>
//         <textarea value={formData.narration} onChange={(e) => handleInput('narration', e.target.value)}
//           rows={4} placeholder="Enter narration..." className="w-full p-4 border border-gray-300 rounded-md resize-vertical" />
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-6">
//         <button onClick={() => navigate(-1)} disabled={loading}
//           className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50">
//           Cancel
//         </button>
//         <button onClick={handleSave} disabled={loading}
//           className="px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
//           {loading ? "Saving..." : "Save"}
//         </button>
//       </div>

//       <ImagePreviewModal isOpen={modalOpen} onClose={() => setModalOpen(false)} preview={currentPreview} />
//     </div>
//   );
// };

// export default CreateAdvocateForm;









// src/pages/Admin/Advocates/CreateAdvocateForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";
import DateInput from "../../../components/DateInput/DateInput";
import LocationInput from "../../../components/LocationInput";

// ================= PREVIEW MODAL =================
const ImagePreviewModal = ({ isOpen, onClose, preview }) => {
  if (!isOpen || !preview) return null;

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const getUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Convert Windows path to URL path
    const normalizedPath = path.replace(/\\/g, '/');
    const filename = normalizedPath.split('/').pop();
    return `${API_BASE_URL}/uploads/${filename}`;
  };

  const url = preview.previewUrl || getUrl(preview.path);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Document Preview: {preview.name}</h3>
          <button onClick={onClose} className="text-3xl hover:text-red-600">&times;</button>
        </div>
        <div className="p-8 flex flex-col items-center">
          {preview.type?.startsWith('image/') || (url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif'))) ? (
            <img src={url} alt={preview.name} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" />
          ) : (
            <>
              <div className="w-40 h-40 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-8xl text-red-600">📄</span>
              </div>
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 bg-red-600 text-white text-lg rounded-lg hover:bg-red-700">
                Open in New Tab
              </a>
            </>
          )}
          <p></p>
        </div>
      </div>
    </div>
  );
};

// ================= FILE UPLOAD COMPONENT =================
const FileUpload = ({ label, file, onFileSelect, onPreviewClick, onRemove }) => {
  const displayName = file ? file.name : 'No file chosen';

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      onFileSelect({
        file: selected,
        name: selected.name,
        type: selected.type,
        size: selected.size,
        previewUrl: ev.target.result,
        exists: false
      });
    };
    reader.readAsDataURL(selected);
  };

  const handlePreviewClick = () => {
    if (!file) return;

    const previewObj = {
      name: file.name,
      type: file.type || 'application/pdf',
      previewUrl: file.previewUrl || null,
      path: file.path || null
    };
    onPreviewClick(previewObj);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <label className="cursor-pointer block">
        <input type="file" className="hidden" onChange={handleChange} accept="image/*,.pdf" />
        <div className={`border-2 border-dashed rounded-lg p-6 text-center transition
          ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}>
          <p className={`text-sm font-medium ${file ? 'text-green-700' : 'text-gray-600'}`}>
            {file ? 'Change File' : 'Choose File'}
          </p>
          <p className="text-xs text-gray-500 mt-1">{displayName}</p>
        </div>
      </label>

      {file && (
        <div className="relative">
          <div
            onClick={handlePreviewClick}
            className="cursor-pointer p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition shadow-sm"
          >
            {file.previewUrl ? (
              <div className="flex items-center gap-4">
                <img src={file.previewUrl} alt="preview" className="w-24 h-24 object-cover rounded-lg shadow" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-blue-600 font-medium">Click to view full size →</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-6xl text-red-600">📄</div>
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-blue-600 font-medium">Click to preview document →</p>
                </div>
              </div>
            )}
          </div>

          {/* Remove button - only show for existing files in edit mode */}
          {file.exists && (
            <button
              type="button"
              onClick={() => onRemove && onRemove()}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const CreateAdvocateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "", dob: "", gender: "Male", contact1: "", contact2: "", email: "",
    address: "", city: "", taluka: "", district: "", state: "",
    enrollmentNo: "", enrollmentYear: "", qualifications: "", specialization: "",
    courtPracticing: "", experience: "", officeAddress: "",
    accountHolderName: "", bankName: "", branch: "", accountNumber: "", ifsc: "", upi: "",
    pan: "", gst: "", aadhar: "", license: "", narration: "",
    status: "active", // Default status
    panFile: null, gstFile: null, aadharFile: null, licenseFile: null,
  });

  // Dropdown options
  const states = ["Maharashtra", "Gujarat", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Rajasthan"];
  const districts = ["Mumbai", "Pune", "Thane", "Nagpur", "Nashik", "Aurangabad"];
  const cities = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Kalyan"];
  const talukas = ["Andheri", "Borivali", "Kurla", "Pune City", "Hadapsar"];

  // Initialize form when entering edit mode
  useEffect(() => {
    if (editData) {
      console.log("Edit Data received:", editData);

      const formatDob = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
      };

      // Safe function to get string value or empty
      const safeStr = (val) => (val ? String(val) : "");

      // Safe function for address fields
      const safeAddress = (addressObj, field) => {
        if (!addressObj || typeof addressObj !== 'object') return "";
        return safeStr(addressObj[field] || "");
      };

      // Create a new state object for the edit data to avoid reference issues
      const newFormData = {
        fullName: safeStr(editData.fullName).toUpperCase(),
        dob: formatDob(editData.dob),
        gender: safeStr(editData.gender || "Male"),
        contact1: safeStr(editData.phoneNumber),
        contact2: safeStr(editData.whatsappNumber),
        email: safeStr(editData.email).toLowerCase(),
        address: safeAddress(editData.residentialAddress, "address").toUpperCase(),
        city: safeAddress(editData.residentialAddress, "city"),
        taluka: safeAddress(editData.residentialAddress, "taluka"),
        district: safeAddress(editData.residentialAddress, "district"),
        state: safeAddress(editData.residentialAddress, "state"),
        enrollmentNo: safeStr(editData.barCouncilNumber),
        enrollmentYear: editData.enrollmentYear || (editData.enrollmentDate ? new Date(editData.enrollmentDate).getFullYear().toString() : ""),
        qualifications: Array.isArray(editData.qualifications)
          ? editData.qualifications.map(q => q.degree).join(', ')
          : safeStr(editData.qualifications),
        specialization: Array.isArray(editData.specialization)
          ? editData.specialization[0] || ""
          : (typeof editData.specialization === 'string' ? editData.specialization.split(',')[0].trim() : safeStr(editData.specialization)),
        courtPracticing: Array.isArray(editData.courts) && editData.courts.length > 0
          ? editData.courts.map(c => c.courtName).join(', ')
          : safeStr(editData.courtPracticing),
        experience: safeStr(editData.experience),
        officeAddress: editData.officeAddress && typeof editData.officeAddress === 'object'
          ? safeStr(editData.officeAddress.address).toUpperCase()
          : safeStr(editData.officeAddress).toUpperCase(),
        accountHolderName: editData.billingDetails?.bankDetails?.accountHolderName
          ? safeStr(editData.billingDetails.bankDetails.accountHolderName).toUpperCase()
          : "",
        bankName: editData.billingDetails?.bankDetails?.bankName
          ? safeStr(editData.billingDetails.bankDetails.bankName).toUpperCase()
          : "",
        branch: editData.officeAddress && typeof editData.officeAddress === 'object'
          ? safeStr(editData.officeAddress.branch).toUpperCase()
          : "",
        accountNumber: editData.billingDetails?.bankDetails?.accountNumber
          ? safeStr(editData.billingDetails.bankDetails.accountNumber)
          : "",
        ifsc: editData.billingDetails?.bankDetails?.ifscCode
          ? safeStr(editData.billingDetails.bankDetails.ifscCode).toUpperCase()
          : "",
        upi: safeStr(editData.upi),
        pan: editData.billingDetails?.panNumber
          ? safeStr(editData.billingDetails.panNumber).toUpperCase()
          : "",
        gst: editData.billingDetails?.gstNumber
          ? safeStr(editData.billingDetails.gstNumber).toUpperCase()
          : "",
        aadhar: safeStr(editData.aadhar),
        license: safeStr(editData.license),
        narration: safeStr(editData.remarks || editData.narration),
        status: safeStr(editData.status || "active"),

        // Document files - ensure we create fresh objects to avoid reference issues
        panFile: editData.documents?.panFile ? {
          name: editData.documents.panFile.split('\\').pop().split('/').pop(),
          path: editData.documents.panFile,
          exists: true
        } : null,
        gstFile: editData.documents?.gstFile ? {
          name: editData.documents.gstFile.split('\\').pop().split('/').pop(),
          path: editData.documents.gstFile,
          exists: true
        } : null,
        aadharFile: editData.documents?.photoIdProof ? {
          name: editData.documents.photoIdProof.split('\\').pop().split('/').pop(),
          path: editData.documents.photoIdProof,
          exists: true
        } : null,
        licenseFile: editData.documents?.addressProof ? {
          name: editData.documents.addressProof.split('\\').pop().split('/').pop(),
          path: editData.documents.addressProof,
          exists: true
        } : null,
      };

      setFormData(newFormData);
    }
    // Remove editData from dependency array to prevent re-execution on every render
  }, []); // Only run once on mount

  const openPreview = (previewObj) => {
    setCurrentPreview(previewObj);
    setModalOpen(true);
  };

  const handleInput = (field, value) => {
    let val = value;

    // Special handling for different field types
    switch (field) {
      case 'email':
        val = value.toLowerCase();
        break;

      case 'contact1':
      case 'contact2':
        val = value.replace(/\D/g, '').slice(0, 10);
        break;

      case 'aadhar':
        val = value.replace(/\D/g, '').slice(0, 12);
        break;

      case 'accountNumber':
        val = value.replace(/\D/g, '').slice(0, 18);
        break;

      case 'pan':
        // Allow only alphanumeric characters and convert to uppercase
        val = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        // Ensure the format matches PAN: 5 letters + 4 numbers + 1 letter
        if (val.length > 10) val = val.slice(0, 10);
        break;

      case 'enrollmentYear':
        val = value.replace(/\D/g, '').slice(0, 4);
        break;

      case 'experience':
        val = value.replace(/\D/g, '').slice(0, 2);
        break;

      case 'gst':
        val = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
        break;

      default:
        // For text fields, convert to uppercase except email
        if (!['email', 'contact1', 'contact2', 'aadhar', 'accountNumber', 'experience', 'pan', 'gst', 'ifsc', 'upi', 'enrollmentNo'].includes(field)) {
          val = value.toUpperCase();
        }
    }

    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Function to handle file removal
  const removeFile = (field) => {
    setFormData(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    if (!formData.fullName.trim()) return "Full Name is required";
    if (formData.contact1 && formData.contact1.length !== 10) return "Contact No 1 must be 10 digits";
    if (!formData.enrollmentNo.trim()) return "Enrollment No is required";
    if (formData.dob && !/^\d{2}-\d{2}-\d{4}$/.test(formData.dob)) return "Date of Birth must be in DD-MM-YYYY format";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Valid email required";
    if (formData.aadhar && formData.aadhar.length !== 12) return "Aadhar must be 12 digits";
    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) return "Invalid PAN (e.g., ABCDE1234F)";
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setLoading(true);
    try {
      // Prepare the data according to backend structure
      const payload = {
        fullName: formData.fullName,
        phoneNumber: formData.contact1,
        whatsappNumber: formData.contact2,
        email: formData.email,
        gender: formData.gender,
        barCouncilNumber: formData.enrollmentNo,
        specialization: formData.specialization ? [formData.specialization] : [],
        experience: parseInt(formData.experience) || 0,
        aadhar: formData.aadhar,
        license: formData.license,
        upi: formData.upi,
        practiceType: "individual",
        status: formData.status,
        availability: "available",
        remarks: formData.narration,

        residentialAddress: {
          address: formData.address,
          city: formData.city,
          taluka: formData.taluka,
          district: formData.district,
          state: formData.state,
          country: "India"
        },

        officeAddress: formData.officeAddress,

        billingDetails: {
          bankDetails: {
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifsc,
            accountHolderName: formData.accountHolderName
          },
          gstNumber: formData.gst,
          panNumber: formData.pan
        },

        qualifications: formData.qualifications ? formData.qualifications.split(',').map(q => ({ degree: q.trim() })) : [],
        courts: formData.courtPracticing ? formData.courtPracticing.split(',').map(c => ({
          courtName: c.trim(),
          courtType: "other"
        })) : [],

        communicationPreferences: {
          email: true,
          sms: true,
          whatsapp: true,
          phone: true
        }
      };

      // Add date fields if they exist
      if (formData.dob) {
        const [d, m, y] = formData.dob.split('-');
        payload.dob = `${y}-${m}-${d}`;
      }

      if (formData.enrollmentYear) {
        payload.enrollmentYear = parseInt(formData.enrollmentYear, 10);
      }

      const fd = new FormData();
      fd.append('data', JSON.stringify(payload));

      // Add files if they exist (newly uploaded, not existing ones)
      if (formData.panFile && !formData.panFile.exists) {
        fd.append('panFile', formData.panFile.file);
      }
      if (formData.gstFile && !formData.gstFile.exists) {
        fd.append('gstFile', formData.gstFile.file);
      }
      if (formData.aadharFile && !formData.aadharFile.exists) {
        fd.append('photoIdProof', formData.aadharFile.file);
      }
      if (formData.licenseFile && !formData.licenseFile.exists) {
        fd.append('addressProof', formData.licenseFile.file);
      }

      // For updates, also indicate which existing files to keep or delete
      if (editData?._id) {
        // Add flags for existing files - if exists but not replaced with new file, preserve
        // If a file field is null, it means it was removed
        if (formData.panFile?.exists && !formData.panFile?.file) fd.append('deletePanFile', 'true');
        else if (formData.panFile?.exists) fd.append('keepExistingPanFile', 'true');

        if (formData.gstFile?.exists && !formData.gstFile?.file) fd.append('deleteGstFile', 'true');
        else if (formData.gstFile?.exists) fd.append('keepExistingGstFile', 'true');

        if (formData.aadharFile?.exists && !formData.aadharFile?.file) fd.append('deleteAadharFile', 'true');
        else if (formData.aadharFile?.exists) fd.append('keepExistingAadharFile', 'true');

        if (formData.licenseFile?.exists && !formData.licenseFile?.file) fd.append('deleteLicenseFile', 'true');
        else if (formData.licenseFile?.exists) fd.append('keepExistingLicenseFile', 'true');
      }

      let res;
      if (editData?._id) {
        res = await apiClient.put(
          apiEndpoints.advocates.update(editData._id),
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        res = await apiClient.post(
          apiEndpoints.advocates.create,
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      if (res.data.success) {
        toast.success(editData ? "Advocate updated successfully!" : "Advocate created successfully!");
        navigate("/admin/advocate-list");
      } else {
        toast.error(res.data.message || "Operation failed");
      }
    } catch (e) {
      console.error("Save error:", e);
      toast.error(e.response?.data?.message || "Save failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        {editData ? "Edit Advocate" : "Create Advocate"}
      </h2>

      {/* Personal Details */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" value={formData.fullName} onChange={(e) => handleInput('fullName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <DateInput value={formData.dob} onChange={(v) => setFormData(prev => ({ ...prev, dob: v }))} />
          </div>

          <div className="flex items-center space-x-8 mt-6">
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="gender" checked={formData.gender === "Male"}
                onChange={() => setFormData(prev => ({ ...prev, gender: "Male" }))}
                className="mr-2 w-4 h-4" />
              Male
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="gender" checked={formData.gender === "Female"}
                onChange={() => setFormData(prev => ({ ...prev, gender: "Female" }))}
                className="mr-2 w-4 h-4" />
              Female
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact No 1 *</label>
            <input type="text" value={formData.contact1} onChange={(e) => handleInput('contact1', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" placeholder="10 digits" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact No 2</label>
            <input type="text" value={formData.contact2} onChange={(e) => handleInput('contact2', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" placeholder="10 digits" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={formData.email} onChange={(e) => handleInput('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md lowercase" placeholder="example@gmail.com" />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea value={formData.address} onChange={(e) => handleInput('address', e.target.value)} rows={2}
              className="w-full p-3 border border-gray-300 rounded-md resize-vertical" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <LocationInput
              value={formData.state}
              onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
              type="state"
              placeholder="Select or type state"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <LocationInput
              value={formData.district}
              onChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
              type="district"
              placeholder="Select or type district"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <LocationInput
              value={formData.city}
              onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
              type="city"
              placeholder="Select or type city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
            <LocationInput
              value={formData.taluka}
              onChange={(value) => setFormData(prev => ({ ...prev, taluka: value }))}
              type="taluka"
              placeholder="Select or type taluka"
            />
          </div>
        </div>
      </div>

      {/* Professional Details */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment No *</label>
            <input type="text" value={formData.enrollmentNo} onChange={(e) => handleInput('enrollmentNo', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" placeholder="Bar Council Registration No" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Year</label>
            <input type="text" value={formData.enrollmentYear} onChange={(e) => handleInput('enrollmentYear', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" maxLength="4" placeholder="YYYY" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
            <input type="text" value={formData.qualifications} onChange={(e) => handleInput('qualifications', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" placeholder="LLB, LLM, etc." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <select value={formData.specialization} onChange={(e) => handleSelect('specialization', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white">
              <option value="">-- Select --</option>
              <option value="Civil">Civil</option>
              <option value="Criminal">Criminal</option>
              <option value="Consumer">Consumer</option>
              <option value="Family">Family</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Court Practicing In</label>
            <input type="text" value={formData.courtPracticing} onChange={(e) => handleInput('courtPracticing', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" placeholder="Supreme Court, High Court, etc." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
            <input type="number" value={formData.experience} onChange={(e) => handleInput('experience', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" min="0" max="50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={formData.status} onChange={(e) => handleSelect('status', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="retired">Retired</option>
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
            <textarea placeholder="Office Address" value={formData.officeAddress} onChange={(e) => handleInput('officeAddress', e.target.value)} rows={2}
              className="w-full p-3 border border-gray-300 rounded-md resize-vertical" />
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank / Payment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
            <input type="text" placeholder="Account Holder Name" value={formData.accountHolderName} onChange={(e) => handleInput('accountHolderName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input type="text" placeholder="Bank Name" value={formData.bankName} onChange={(e) => handleInput('bankName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <input type="text" placeholder="Branch" value={formData.branch} onChange={(e) => handleInput('branch', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input type="text" placeholder="Account Number" value={formData.accountNumber} onChange={(e) => handleInput('accountNumber', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Number</label>
            <input type="text" placeholder="IFSC Number" value={formData.ifsc} onChange={(e) => handleInput('ifsc', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md uppercase" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID (Optional)</label>
            <input type="text" placeholder="UPI ID" value={formData.upi} onChange={(e) => handleInput('upi', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      {/* Upload Documents */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Upload Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input type="text" value={formData.pan} onChange={(e) => handleInput('pan', e.target.value)}
              placeholder="ABCDE1234F" className="w-full p-3 border border-gray-300 rounded-md mb-3 uppercase" />
            <FileUpload label="PAN Card" file={formData.panFile} onFileSelect={(f) => setFormData(prev => ({ ...prev, panFile: f }))} onPreviewClick={openPreview} onRemove={() => removeFile('panFile')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
            <input type="text" placeholder="GST NUMBER" value={formData.gst} onChange={(e) => handleInput('gst', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mb-3 uppercase" />
            <FileUpload label="GST Certificate" file={formData.gstFile} onFileSelect={(f) => setFormData(prev => ({ ...prev, gstFile: f }))} onPreviewClick={openPreview} onRemove={() => removeFile('gstFile')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
            <input type="text" value={formData.aadhar} onChange={(e) => handleInput('aadhar', e.target.value)}
              placeholder="12 digits" className="w-full p-3 border border-gray-300 rounded-md mb-3" />
            <FileUpload label="Aadhar Card (Photo ID Proof)" file={formData.aadharFile} onFileSelect={(f) => setFormData(prev => ({ ...prev, aadharFile: f }))} onPreviewClick={openPreview} onRemove={() => removeFile('aadharFile')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
            <input type="text" value={formData.license} onChange={(e) => handleInput('license', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mb-3 uppercase " />
            <FileUpload label="License" file={formData.licenseFile} onFileSelect={(f) => setFormData(prev => ({ ...prev, licenseFile: f }))} onPreviewClick={openPreview} onRemove={() => removeFile('licenseFile')} />
          </div>
        </div>
      </div>

      {/* Narration */}
      <div className="mb-10">
        <label className="block text-sm font-medium text-gray-700 mb-1">Narration / Remarks</label>
        <textarea value={formData.narration} onChange={(e) => handleInput('narration', e.target.value)}
          rows={4} placeholder="Enter narration or remarks..." className="w-full p-4 border border-gray-300 rounded-md resize-vertical" />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-6">
        <button onClick={() => navigate(-1)} disabled={loading}
          className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition">
          Cancel
        </button>
        <button onClick={handleSave} disabled={loading}
          className="px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2">
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Saving...
            </>
          ) : (
            editData ? "Update Advocate" : "Create Advocate"
          )}
        </button>
      </div>

      <ImagePreviewModal isOpen={modalOpen} onClose={() => setModalOpen(false)} preview={currentPreview} />
    </div>
  );
};

export default CreateAdvocateForm;