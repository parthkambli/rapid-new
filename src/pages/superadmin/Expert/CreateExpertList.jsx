// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import LocationInput from "../../../components/LocationInput";

// export default function ExpertForm() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const editData = location.state?.editData;
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     gender: "Male",
//     dob: "",
//     contact1: "",
//     contact2: "",
//     email: "",
//     address: "",
//     city: "",
//     taluka: "",
//     district: "",
//     state: "",

//     // Professional Details
//     medicalDegree: "",
//     medicalRegNo: "",
//     medicalRegYear: "",
//     medicalSpecialization: "",
//     medicalExperience: "",
//     lawDegree: "",
//     barCouncilNo: "",
//     lawSpecialization: "",
//     legalExperience: "",

//     // Current Role
//     currentRole: "Doctor",
//     workplace: "",
//     designation: "",
//     languagesKnown: "",

//     // Areas of Expertise
//     areasOfExpertise: {
//       "Medical Negligence": false,
//       "Compensation / Assessment": false,
//       "Consent & Documentation": false,
//       "Forensic Medicine": false,
//       "Criminal Cases": false,
//       "Insurance / Audits": false,
//       "Consumer Court Cases": false,
//       "Expert Witness": false,
//     },

//     // Case Involvement
//     caseInvolvement: "Both",

//     // Bank Details
//     accountHolderName: "",
//     bankName: "",
//     branch: "",
//     accountNumber: "",
//     ifsc: "",
//     upi: "",
//     gst: "",
//     pan: "",

//     // Files
//     medicalDegreeCertificate: null,
//     barCouncilCertificate: null,
//     idProof: null,
//     photo: null,
//     addressProof: null,
//   });

//   // Document preview URLs
//   const [documentPreviews, setDocumentPreviews] = useState({
//     medicalDegreeCertificate: null,
//     barCouncilCertificate: null,
//     idProof: null,
//     photo: null,
//     addressProof: null,
//   });

//   // Load edit data if available
//   useEffect(() => {
//     if (editData) {
//       console.log('Edit data received:', editData); // Debug log
//       console.log('editData.medicalRegYear:', editData.medicalRegYear);
//       console.log('editData.lawSpecialization:', editData.lawSpecialization);

//       // Map backend expertise array to form structure
//       const expertiseObj = {};
//       if (Array.isArray(editData.expertise)) {
//         editData.expertise.forEach(area => {
//           expertiseObj[area] = true;
//         });
//       }

//       // Format date for input field (YYYY-MM-DD)
//       const formatDateForInput = (dateString) => {
//         if (!dateString) return "";
//         const date = new Date(dateString);
//         return date.toISOString().split('T')[0];
//       };

//       // Parse qualification string to extract medical and law degrees
//       const qualificationParts = editData.qualification ? editData.qualification.split(', ') : [];

//       // Extract languages from specialNotes if present
//       const extractLanguages = (specialNotes) => {
//         if (!specialNotes) return "";
//         const languageMatch = specialNotes.match(/Languages:\s*([^\n]+)/);
//         return languageMatch ? languageMatch[1].trim() : "";
//       };

//       // Extract case involvement preference from specialNotes
//       const extractCaseInvolvement = (specialNotes) => {
//         if (!specialNotes) return "Both";
//         const lines = specialNotes.split('\n');
//         const firstLine = lines[0]?.trim();
//         if (firstLine && (firstLine.includes('Court') || firstLine.includes('Opinion') || firstLine.includes('Both'))) {
//           return firstLine;
//         }
//         return "Both";
//       };

//       // Set document preview URLs from editData (documents are nested in editData.documents)
//       const docPreviews = {
//         medicalDegreeCertificate: editData.documents?.medicalDegreeCertificate || null,
//         barCouncilCertificate: editData.documents?.barCouncilCertificate || null,
//         idProof: editData.documents?.idProof || null,
//         photo: editData.documents?.photo || null,
//         addressProof: editData.documents?.addressProof || null,
//       };

//       setDocumentPreviews(docPreviews);

//       setFormData({
//         // Personal Information
//         fullName: editData.fullName || "",
//         gender: editData.gender || "Male",
//         dob: formatDateForInput(editData.dob),
//         contact1: editData.phoneNumber || "",
//         contact2: editData.whatsappNumber || "",
//         email: editData.email || "",

//         // Address Information
//         address: editData.officeAddress?.address || "",
//         city: editData.officeAddress?.city || "",
//         taluka: editData.officeAddress?.taluka || editData.taluka || "",
//         district: editData.officeAddress?.district || editData.district || "",
//         state: editData.officeAddress?.state || "",

//         // Professional Details - Medical
//         medicalDegree: qualificationParts[0] || "",
//         medicalRegNo: editData.licenseNumber || "",
//         medicalRegYear: editData.medicalRegYear || "", // Get from backend field
//         medicalSpecialization: qualificationParts[1] || "",
//         medicalExperience: editData.experience?.toString() || "",

//         // Professional Details - Legal
//         lawDegree: qualificationParts.length > 2 ? qualificationParts[2] : "",
//         barCouncilNo: editData.licenseNumber || "", // Same as medical reg no in current model
//         lawSpecialization: editData.lawSpecialization || "", // Get from backend field
//         legalExperience: editData.experience?.toString() || "",

//         // Current Role
//         currentRole: editData.designation || "Doctor",
//         workplace: editData.organizationName || "",
//         designation: editData.designation || "",
//         languagesKnown: extractLanguages(editData.specialNotes),

//         // Areas of Expertise
//         areasOfExpertise: {
//           "Medical Negligence": expertiseObj["Medical Negligence"] || false,
//           "Compensation / Assessment": expertiseObj["Compensation / Assessment"] || false,
//           "Consent & Documentation": expertiseObj["Consent & Documentation"] || false,
//           "Forensic Medicine": expertiseObj["Forensic Medicine"] || false,
//           "Criminal Cases": expertiseObj["Criminal Cases"] || false,
//           "Insurance / Audits": expertiseObj["Insurance / Audits"] || false,
//           "Consumer Court Cases": expertiseObj["Consumer Court Cases"] || false,
//           "Expert Witness": expertiseObj["Expert Witness"] || false,
//         },

//         // Case Involvement
//         caseInvolvement: extractCaseInvolvement(editData.specialNotes),

//         // Bank Details
//         accountHolderName: editData.billingDetails?.bankDetails?.accountHolderName || "",
//         bankName: editData.billingDetails?.bankDetails?.bankName || "",
//         branch: editData.billingDetails?.bankDetails?.branch || "",
//         accountNumber: editData.billingDetails?.bankDetails?.accountNumber || "",
//         ifsc: editData.billingDetails?.bankDetails?.ifscCode || "",
//         upi: editData.billingDetails?.upiId || "",
//         gst: editData.billingDetails?.gstNumber || "",
//         pan: editData.billingDetails?.panNumber || "",

//         // Files - preserve existing document URLs for edit mode (from nested documents object)
//         medicalDegreeCertificate: editData.documents?.medicalDegreeCertificate || null,
//         barCouncilCertificate: editData.documents?.barCouncilCertificate || null,
//         idProof: editData.documents?.idProof || null,
//         photo: editData.documents?.photo || null,
//         addressProof: editData.documents?.addressProof || null,
//       });
//     }
//   }, [editData]);

//   // Cleanup function to revoke object URLs
//   useEffect(() => {
//     return () => {
//       // Revoke all document preview URLs to prevent memory leaks
//       Object.values(documentPreviews).forEach(url => {
//         if (url && typeof url === 'string' && url.startsWith('blob:')) {
//           URL.revokeObjectURL(url);
//         }
//       });
//     };
//   }, [documentPreviews]);

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;

//     if (type === "checkbox") {
//       if (name.startsWith("expertise_")) {
//         const area = name.replace("expertise_", "");
//         setFormData({
//           ...formData,
//           areasOfExpertise: {
//             ...formData.areasOfExpertise,
//             [area]: checked,
//           },
//         });
//       } else {
//         setFormData({
//           ...formData,
//           [name]: checked,
//         });
//       }
//     } else if (type === "file") {
//       const file = files[0];
//       if (file) {
//         // Create a preview URL for the selected file
//         const previewUrl = URL.createObjectURL(file);

//         // Update document previews
//         setDocumentPreviews(prev => ({
//           ...prev,
//           [name]: previewUrl
//         }));

//         // Update form data
//         setFormData({
//           ...formData,
//           [name]: file,
//         });
//       } else {
//         // If no file is selected, clear the preview
//         setDocumentPreviews(prev => ({
//           ...prev,
//           [name]: null
//         }));
//       }
//     } else {
//       let processedValue = value;

//       // Apply formatting based on field type
//       switch (name) {
//         // Name fields - Auto uppercase
//         case 'fullName':
//         case 'accountHolderName':
//         case 'bankName':
//         case 'workplace':
//         case 'designation':
//           processedValue = value.toUpperCase();
//           break;

//         // Email - Auto lowercase
//         case 'email':
//           processedValue = value.toLowerCase();
//           break;

//         // PAN Card - Auto uppercase + validation
//         case 'pan':
//           processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
//           if (processedValue.length > 10) {
//             processedValue = processedValue.substring(0, 10);
//           }
//           break;

//         // GST - Auto uppercase + validation
//         case 'gst':
//           processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
//           if (processedValue.length > 15) {
//             processedValue = processedValue.substring(0, 15);
//           }
//           break;

//         // Phone numbers - Only numbers
//         case 'contact1':
//         case 'contact2':
//           processedValue = value.replace(/[^0-9]/g, '');
//           if (processedValue.length > 10) {
//             processedValue = processedValue.substring(0, 10);
//           }
//           break;

//         // IFSC Code - Auto uppercase
//         case 'ifsc':
//           processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
//           if (processedValue.length > 11) {
//             processedValue = processedValue.substring(0, 11);
//           }
//           break;

//         // Account Number - Only numbers
//         case 'accountNumber':
//           processedValue = value.replace(/[^0-9]/g, '');
//           break;

//         // Address fields - Proper case (first letter capital)
//         case 'address':
//         case 'city':
//         case 'taluka':
//         case 'district':
//         case 'state':
//           processedValue = value.replace(/\b\w/g, l => l.toUpperCase());
//           break;

//         // Medical/Legal fields - Proper case
//         case 'medicalDegree':
//         case 'lawDegree':
//         case 'medicalSpecialization':
//         case 'lawSpecialization':
//         case 'languagesKnown':
//           processedValue = value.replace(/\b\w/g, l => l.toUpperCase());
//           break;

//         // Registration numbers - Auto uppercase
//         case 'medicalRegNo':
//         case 'barCouncilNo':
//         case 'medicalRegYear':
//           processedValue = value.toUpperCase();
//           break;

//         // Experience - Only numbers
//         case 'medicalExperience':
//         case 'legalExperience':
//           processedValue = value.replace(/[^0-9]/g, '');
//           if (processedValue.length > 2) {
//             processedValue = processedValue.substring(0, 2);
//           }
//           break;

//         default:
//           processedValue = value;
//       }

//       setFormData({
//         ...formData,
//         [name]: processedValue,
//       });
//     }
//   };

//   // Validation function
//   const validateForm = () => {
//     const errors = [];

//     // Required fields
//     if (!formData.fullName.trim()) {
//       errors.push("Full Name is required");
//     }

//     if (!formData.email.trim()) {
//       errors.push("Email is required");
//     } else {
//       // Email format validation
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(formData.email)) {
//         errors.push("Please enter a valid email address");
//       }
//     }

//     // Phone number validation
//     if (formData.contact1 && formData.contact1.length !== 10) {
//       errors.push("Contact number 1 must be 10 digits");
//     }

//     if (formData.contact2 && formData.contact2.length !== 10) {
//       errors.push("Contact number 2 must be 10 digits");
//     }

//     // PAN Card validation
//     if (formData.pan) {
//       const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//       if (!panRegex.test(formData.pan)) {
//         errors.push("PAN Card format should be: ABCDE1234F");
//       }
//     }

//     // GST validation
//     if (formData.gst) {
//       if (formData.gst.length !== 15) {
//         errors.push("GST number must be 15 characters");
//       }
//     }

//     // IFSC Code validation
//     if (formData.ifsc) {
//       const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
//       if (!ifscRegex.test(formData.ifsc)) {
//         errors.push("IFSC Code format should be: ABCD0123456");
//       }
//     }

//     // Experience validation
//     if (formData.medicalExperience && (parseInt(formData.medicalExperience) > 50)) {
//       errors.push("Medical experience cannot exceed 50 years");
//     }

//     if (formData.legalExperience && (parseInt(formData.legalExperience) > 50)) {
//       errors.push("Legal experience cannot exceed 50 years");
//     }

//     return errors;
//   };

//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Validate form
//       const validationErrors = validateForm();
//       if (validationErrors.length > 0) {
//         setError(validationErrors.join(', '));
//         return;
//       }

//       // Create FormData for file upload
//       const formDataToSend = new FormData();

//       // Prepare payload (exclude files)
//       const {
//         medicalDegreeCertificate,
//         barCouncilCertificate,
//         idProof,
//         photo,
//         addressProof,
//         ...formFields
//       } = formData;

//       // Transform form data to match backend Expert model structure
//       const payload = {
//         // Basic Information
//         fullName: formFields.fullName,
//         gender: formFields.gender,
//         dob: formFields.dob || null,
//         email: formFields.email,
//         phoneNumber: formFields.contact1,
//         whatsappNumber: formFields.contact2,

//         // Professional Information
//         expertise: Object.keys(formFields.areasOfExpertise).filter(
//           key => formFields.areasOfExpertise[key]
//         ),
//         qualification: [
//           formFields.medicalDegree,
//           formFields.medicalSpecialization,
//           formFields.lawDegree
//         ].filter(Boolean).join(', '),
//         experience: parseInt(formFields.medicalExperience) || parseInt(formFields.legalExperience) || 0,
//         licenseNumber: formFields.medicalRegNo || formFields.barCouncilNo,
//         medicalRegYear: formFields.medicalRegYear, // Add this field directly
//         lawSpecialization: formFields.lawSpecialization, // Add this field directly

//         // Organization/Firm
//         organizationName: formFields.workplace,
//         designation: formFields.designation,

//         // Contact Information
//         officeAddress: {
//           address: formFields.address || '',
//           city: formFields.city || '',
//           taluka: formFields.taluka || '',
//           district: formFields.district || '',
//           state: formFields.state || '',
//           pinCode: formFields.pinCode || '', // Add pinCode if needed
//           country: formFields.country || 'India'
//         },

//         // Billing Details
//         billingDetails: {
//           bankDetails: {
//             accountHolderName: formFields.accountHolderName,
//             bankName: formFields.bankName,
//             branch: formFields.branch,
//             accountNumber: formFields.accountNumber,
//             ifscCode: formFields.ifsc
//           },
//           gstNumber: formFields.gst,
//           panNumber: formFields.pan,
//           upiId: formFields.upi
//         },

//         // Special Notes (combine case involvement and languages)
//         specialNotes: [
//           formFields.caseInvolvement,
//           formFields.languagesKnown ? `Languages: ${formFields.languagesKnown}` : ""
//         ].filter(Boolean).join('\n'),

//         // Additional fields for form compatibility (ensure these don't get lost)
//         currentRole: formFields.currentRole,
//         medicalRegYear: formFields.medicalRegYear,
//         lawSpecialization: formFields.lawSpecialization,
//         legalExperience: formFields.legalExperience,

//         // Ensure address fields are explicitly included
//         address: formFields.address,
//         city: formFields.city,
//         taluka: formFields.taluka,
//         district: formFields.district,
//         state: formFields.state,
//         pinCode: formFields.pinCode || '',
//         country: formFields.country || 'India'
//       };

//       // Append JSON data
//       formDataToSend.append('data', JSON.stringify(payload));

//       // Debug: Log the payload being sent
//       console.log('Payload being sent:', payload);
//       console.log('Address data:', payload.officeAddress);
//       console.log('Medical Reg Year:', payload.medicalRegYear);
//       console.log('Law Specialization:', payload.lawSpecialization);
//       console.log('Form Data medicalRegYear:', formFields.medicalRegYear);

//       // Append files if they exist
//       // In edit mode, only append files that have been newly selected (not the existing URLs)
//       if (medicalDegreeCertificate instanceof File) {
//         formDataToSend.append('medicalDegreeCertificate', medicalDegreeCertificate);
//       }
//       if (barCouncilCertificate instanceof File) {
//         formDataToSend.append('barCouncilCertificate', barCouncilCertificate);
//       }
//       if (idProof instanceof File) {
//         formDataToSend.append('idProof', idProof);
//       }
//       if (photo instanceof File) {
//         formDataToSend.append('photo', photo);
//       }
//       if (addressProof instanceof File) {
//         formDataToSend.append('addressProof', addressProof);
//       }

//       // Send request
//       let response;
//       if (editData && editData._id) {
//         // Update existing expert
//         response = await apiClient.put(
//           apiEndpoints.experts.update(editData._id),
//           formDataToSend,
//           {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
//       } else {
//         // Create new expert
//         response = await apiClient.post(
//           apiEndpoints.experts.create,
//           formDataToSend,
//           {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
//       }

//       if (response.data.success) {
//         alert(editData ? "Expert updated successfully!" : "Expert created successfully!");
//         navigate("/admin/expert-list");
//       } else {
//         setError(response.data.message || "Failed to save expert");
//       }
//     } catch (err) {
//       console.error('Error saving expert:', err);
//       setError(err.response?.data?.message || "Failed to save expert. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     if (confirm("Are you sure you want to cancel?")) {
//       navigate("/admin/expert-list");
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">
//         {editData ? "Edit Expert" : "Create Expert"}
//       </h2>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       <h2 className="text-lg font-semibold mb-4">Expert Information</h2>

//       {/* Personal Information */}
//       <section className="mb-6 border-b pb-4">
//         <h3 className="text-lg font-semibold mb-3">Personal Information</h3>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               className="border w-full p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//               placeholder="Enter full name (AUTO CAPS)"
//               style={{ textTransform: 'uppercase' }}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//             <div className="flex gap-4 mt-1">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="gender"
//                   value="Male"
//                   checked={formData.gender === "Male"}
//                   onChange={handleChange}
//                   className="mr-1"
//                 />
//                 Male
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="gender"
//                   value="Female"
//                   checked={formData.gender === "Female"}
//                   onChange={handleChange}
//                   className="mr-1"
//                 />
//                 Female
//               </label>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//             <input
//               type="date"
//               name="dob"
//               value={formData.dob}
//               onChange={handleChange}
//               className="border w-full p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Contact No 1</label>
//               <input
//                 type="text"
//                 name="contact1"
//                 value={formData.contact1}
//                 onChange={handleChange}
//                 className="border w-full p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//                 placeholder="10 digits only"
//                 maxLength="10"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Contact No 2</label>
//               <input
//                 type="text"
//                 name="contact2"
//                 value={formData.contact2}
//                 onChange={handleChange}
//                 className="border w-full p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//                 placeholder="10 digits only"
//                 maxLength="10"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="border w-full p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//               placeholder="email@example.com (auto lowercase)"
//               style={{ textTransform: 'lowercase' }}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               className="border w-full p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//               placeholder="Enter address"
//             />
//           </div>

//           <div className="grid grid-cols-4 gap-2 col-span-2">
//             <LocationInput
//               label="State"
//               value={formData.state}
//               onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
//               type="state"
//               placeholder="Select State"
//             />
//             <LocationInput
//               label="District"
//               value={formData.district}
//               onChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
//               type="district"
//               placeholder="Select District"
//             />
//             <LocationInput
//               label="City"
//               value={formData.city}
//               onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
//               type="city"
//               placeholder="Select City"
//             />
//             <LocationInput
//               label="Taluka"
//               value={formData.taluka}
//               onChange={(value) => setFormData(prev => ({ ...prev, taluka: value }))}
//               type="taluka"
//               placeholder="Select Taluka"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Professional Details */}
//       <section className="mb-6 border-b pb-4">
//         <h3 className="text-lg font-semibold mb-3">Professional Details</h3>

//         <h4 className="font-medium mb-2">Medical</h4>
//         <div className="grid grid-cols-4 gap-2 mb-2">
//           <input
//             type="text"
//             name="medicalDegree"
//             value={formData.medicalDegree}
//             onChange={handleChange}
//             placeholder="Medical Degree"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//           <input
//             type="text"
//             name="medicalRegNo"
//             value={formData.medicalRegNo}
//             onChange={handleChange}
//             placeholder="Reg No"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//           <input
//             type="text"
//             name="medicalRegYear"
//             value={formData.medicalRegYear}
//             onChange={handleChange}
//             placeholder="Reg Year"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//           <input
//             type="text"
//             name="medicalSpecialization"
//             value={formData.medicalSpecialization}
//             onChange={handleChange}
//             placeholder="Specialization"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//         </div>

//         <input
//           type="text"
//           name="medicalExperience"
//           value={formData.medicalExperience}
//           onChange={handleChange}
//           placeholder="Years of Medical Experience (max 50)"
//           maxLength="2"
//           className="border p-2 rounded w-1/3 focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//         />

//         <h4 className="font-medium mt-4 mb-2">Legal</h4>
//         <div className="grid grid-cols-3 gap-2 mb-2">
//           <input
//             type="text"
//             name="lawDegree"
//             value={formData.lawDegree}
//             onChange={handleChange}
//             placeholder="Law Degree"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//           <input
//             type="text"
//             name="barCouncilNo"
//             value={formData.barCouncilNo}
//             onChange={handleChange}
//             placeholder="Bar Council No"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//           <input
//             type="text"
//             name="lawSpecialization"
//             value={formData.lawSpecialization}
//             onChange={handleChange}
//             placeholder="Specialization in Law"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//         </div>

//         <input
//           type="text"
//           name="legalExperience"
//           value={formData.legalExperience}
//           onChange={handleChange}
//           placeholder="Years of Legal Practice (max 50)"
//           maxLength="2"
//           className="border p-2 rounded w-1/3 focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//         />
//       </section>

//       {/* Current Role */}
//       <section className="mb-6 border-b pb-4">
//         <h3 className="text-lg font-semibold mb-3">Current Role</h3>

//         <div className="grid grid-cols-4 gap-2">
//           <select
//             name="currentRole"
//             value={formData.currentRole}
//             onChange={handleChange}
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           >
//             <option value="Doctor">Doctor</option>
//             <option value="Lawyer">Lawyer</option>
//             <option value="Other">Other</option>
//           </select>
//           <input
//             type="text"
//             name="workplace"
//             value={formData.workplace}
//             onChange={handleChange}
//             placeholder="Workplace"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//           <input
//             type="text"
//             name="designation"
//             value={formData.designation}
//             onChange={handleChange}
//             placeholder="Designation"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//           <input
//             type="text"
//             name="languagesKnown"
//             value={formData.languagesKnown}
//             onChange={handleChange}
//             placeholder="Languages Known"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//         </div>
//       </section>

//       {/* Areas of Expertise */}
//       <section className="mb-6 border-b pb-4">
//         <h3 className="text-lg font-semibold mb-3">Areas of Expertise</h3>
//         <div className="grid grid-cols-2 gap-y-2">
//           {[
//             "Medical Negligence",
//             "Compensation / Assessment",
//             "Consent & Documentation",
//             "Forensic Medicine",
//             "Criminal Cases",
//             "Insurance / Audits",
//             "Consumer Court Cases",
//             "Expert Witness",
//           ].map((area) => (
//             <label key={area} className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 name={`expertise_${area}`}
//                 checked={formData.areasOfExpertise[area] || false}
//                 onChange={handleChange}
//               />
//               {area}
//             </label>
//           ))}
//         </div>
//       </section>

//       {/* Case Involvement */}
//       <section className="mb-6 border-b pb-4">
//         <h3 className="text-lg font-semibold mb-3">Case Involvement Preference</h3>
//         <div className="flex gap-4">
//           <label className="flex items-center">
//             <input
//               type="radio"
//               name="caseInvolvement"
//               value="Both"
//               checked={formData.caseInvolvement === "Both"}
//               onChange={handleChange}
//               className="mr-1"
//             />
//             Both
//           </label>
//           <label className="flex items-center">
//             <input
//               type="radio"
//               name="caseInvolvement"
//               value="Willing to Appear in Court"
//               checked={formData.caseInvolvement === "Willing to Appear in Court"}
//               onChange={handleChange}
//               className="mr-1"
//             />
//             Willing to Appear in Court
//           </label>
//           <label className="flex items-center">
//             <input
//               type="radio"
//               name="caseInvolvement"
//               value="Written Opinion Only"
//               checked={formData.caseInvolvement === "Written Opinion Only"}
//               onChange={handleChange}
//               className="mr-1"
//             />
//             Written Opinion Only
//           </label>
//         </div>
//       </section>

//       {/* Bank / Payment Details */}
//       <section className="mb-6 border-b pb-4">
//         <h3 className="text-lg font-semibold mb-3">Bank / Payment Details</h3>

//         <div className="grid grid-cols-3 gap-2 mb-2">
//           <input
//             type="text"
//             name="accountHolderName"
//             value={formData.accountHolderName}
//             onChange={handleChange}
//             placeholder="Account Holder Name"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//           <input
//             type="text"
//             name="bankName"
//             value={formData.bankName}
//             onChange={handleChange}
//             placeholder="Bank Name"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//           <input
//             type="text"
//             name="branch"
//             value={formData.branch}
//             onChange={handleChange}
//             placeholder="Branch"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//         </div>

//         <div className="grid grid-cols-3 gap-2">
//           <input
//             type="text"
//             name="accountNumber"
//             value={formData.accountNumber}
//             onChange={handleChange}
//             placeholder="Account Number (numbers only)"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//           <input
//             type="text"
//             name="ifsc"
//             value={formData.ifsc}
//             onChange={handleChange}
//             placeholder="IFSC Code (ABCD0123456 - AUTO CAPS)"
//             maxLength="11"
//             style={{ textTransform: 'uppercase' }}
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//           <input
//             type="text"
//             name="upi"
//             value={formData.upi}
//             onChange={handleChange}
//             placeholder="UPI ID (Optional)"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//           />
//           <input
//             type="text"
//             name="gst"
//             value={formData.gst}
//             onChange={handleChange}
//             placeholder="GST Number (15 chars - AUTO CAPS)"
//             maxLength="15"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//             style={{ textTransform: 'uppercase' }}
//           />
//           <input
//             type="text"
//             name="pan"
//             value={formData.pan}
//             onChange={handleChange}
//             placeholder="PAN Number (ABCDE1234F - AUTO CAPS)"
//             maxLength="10"
//             className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//             style={{ textTransform: 'uppercase' }}
//           />
//         </div>
//       </section>

//       {/* Upload Documents */}
//       <section className="mb-6">
//         <h3 className="text-lg font-semibold mb-3">Upload Documents</h3>

//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Medical Degree Certificate</label>
//             <input
//               type="file"
//               name="medicalDegreeCertificate"
//               onChange={handleChange}
//               className="border p-2 w-full rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//               accept=".pdf,.jpg,.jpeg,.png"
//             />
//             {(documentPreviews.medicalDegreeCertificate || (formData.medicalDegreeCertificate && typeof formData.medicalDegreeCertificate === 'string')) && (
//               <div className="mt-2">
//                 <a
//                   href={documentPreviews.medicalDegreeCertificate || formData.medicalDegreeCertificate}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:underline text-sm"
//                 >
//                   Preview Medical Degree Certificate
//                 </a>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Bar Council Certificate</label>
//             <input
//               type="file"
//               name="barCouncilCertificate"
//               onChange={handleChange}
//               className="border p-2 w-full rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//               accept=".pdf,.jpg,.jpeg,.png"
//             />
//             {(documentPreviews.barCouncilCertificate || (formData.barCouncilCertificate && typeof formData.barCouncilCertificate === 'string')) && (
//               <div className="mt-2">
//                 <a
//                   href={documentPreviews.barCouncilCertificate || formData.barCouncilCertificate}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:underline text-sm"
//                 >
//                   Preview Bar Council Certificate
//                 </a>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof (Aadhaar/PAN)</label>
//             <input
//               type="file"
//               name="idProof"
//               onChange={handleChange}
//               className="border p-2 w-full rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//               accept=".pdf,.jpg,.jpeg,.png"
//             />
//             {(documentPreviews.idProof || (formData.idProof && typeof formData.idProof === 'string')) && (
//               <div className="mt-2">
//                 <a
//                   href={documentPreviews.idProof || formData.idProof}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:underline text-sm"
//                 >
//                   Preview ID Proof
//                 </a>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
//             <input
//               type="file"
//               name="photo"
//               onChange={handleChange}
//               className="border p-2 w-full rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//               accept=".jpg,.jpeg,.png"
//             />
//             {(documentPreviews.photo || (formData.photo && typeof formData.photo === 'string')) && (
//               <div className="mt-2">
//                 <a
//                   href={documentPreviews.photo || formData.photo}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:underline text-sm"
//                 >
//                   Preview Photo
//                 </a>
//               </div>
//             )}
//           </div>

//           <div className="col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Address Proof (Optional)</label>
//             <input
//               type="file"
//               name="addressProof"
//               onChange={handleChange}
//               className="border p-2 w-full rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
//               accept=".pdf,.jpg,.jpeg,.png"
//             />
//             {(documentPreviews.addressProof || (formData.addressProof && typeof formData.addressProof === 'string')) && (
//               <div className="mt-2">
//                 <a
//                   href={documentPreviews.addressProof || formData.addressProof}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:underline text-sm"
//                 >
//                   Preview Address Proof
//                 </a>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Submit Buttons */}
//       <div className="flex justify-end gap-3">
//         <button
//           onClick={handleCancel}
//           disabled={loading}
//           className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSave}
//           disabled={loading}
//           className="bg-[#398C89] text-white px-4 py-2 rounded hover:bg-[#2e706e] disabled:opacity-50"
//         >
//           {loading ? "Saving..." : editData ? "Update Expert" : "Save Expert"}
//         </button>
//       </div>
//     </div>
//   );
// }












import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import LocationInput from "../../../components/LocationInput";

export default function ExpertForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "Male",
    dob: "",
    contact1: "",
    contact2: "",
    email: "",
    address: "",
    city: "",
    taluka: "",
    district: "",
    state: "",

    // Professional Details
    medicalDegree: "",
    medicalRegNo: "",
    medicalRegYear: "",
    medicalSpecialization: "",
    medicalExperience: "",
    lawDegree: "",
    barCouncilNo: "",
    lawSpecialization: "",
    legalExperience: "",

    // Current Role
    currentRole: "Doctor",
    workplace: "",
    designation: "",
    languagesKnown: "",

    // Areas of Expertise
    areasOfExpertise: {
      "Medical Negligence": false,
      "Compensation / Assessment": false,
      "Consent & Documentation": false,
      "Forensic Medicine": false,
      "Criminal Cases": false,
      "Insurance / Audits": false,
      "Consumer Court Cases": false,
      "Expert Witness": false,
    },

    // Case Involvement
    caseInvolvement: "Both",

    // Bank Details
    accountHolderName: "",
    bankName: "",
    branch: "",
    accountNumber: "",
    ifsc: "",
    upi: "",
    gst: "",
    pan: "",

    // Files
    medicalDegreeCertificate: null,
    barCouncilCertificate: null,
    idProof: null,
    photo: null,
    addressProof: null,
  });

  // Document preview URLs
  const [documentPreviews, setDocumentPreviews] = useState({
    medicalDegreeCertificate: null,
    barCouncilCertificate: null,
    idProof: null,
    photo: null,
    addressProof: null,
  });

  // Load edit data if available
  useEffect(() => {
    if (editData) {
      console.log('Edit data received:', editData); // Debug log
      console.log('editData.medicalRegYear:', editData.medicalRegYear);
      console.log('editData.lawSpecialization:', editData.lawSpecialization);

      // Map backend expertise array to form structure
      const expertiseObj = {};
      if (Array.isArray(editData.expertise)) {
        editData.expertise.forEach(area => {
          expertiseObj[area] = true;
        });
      }

      // Format date for input field (YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      // Parse qualification string to extract medical and law degrees
      const qualificationParts = editData.qualification ? editData.qualification.split(', ') : [];

      // Extract languages from specialNotes if present
      const extractLanguages = (specialNotes) => {
        if (!specialNotes) return "";
        const languageMatch = specialNotes.match(/Languages:\s*([^\n]+)/);
        return languageMatch ? languageMatch[1].trim() : "";
      };

      // Extract case involvement preference from specialNotes
      const extractCaseInvolvement = (specialNotes) => {
        if (!specialNotes) return "Both";
        const lines = specialNotes.split('\n');
        const firstLine = lines[0]?.trim();
        if (firstLine && (firstLine.includes('Court') || firstLine.includes('Opinion') || firstLine.includes('Both'))) {
          return firstLine;
        }
        return "Both";
      };

      // Set document preview URLs from editData (documents are nested in editData.documents)
      const docPreviews = {
        medicalDegreeCertificate: editData.documents?.medicalDegreeCertificate || null,
        barCouncilCertificate: editData.documents?.barCouncilCertificate || null,
        idProof: editData.documents?.idProof || null,
        photo: editData.documents?.photo || null,
        addressProof: editData.documents?.addressProof || null,
      };

      setDocumentPreviews(docPreviews);

      setFormData({
        // Personal Information
        fullName: editData.fullName || "",
        gender: editData.gender || "Male",
        dob: formatDateForInput(editData.dob),
        contact1: editData.phoneNumber || "",
        contact2: editData.whatsappNumber || "",
        email: editData.email || "",

        // Address Information
        address: editData.officeAddress?.address || "",
        city: editData.officeAddress?.city || "",
        taluka: editData.officeAddress?.taluka || editData.taluka || "",
        district: editData.officeAddress?.district || editData.district || "",
        state: editData.officeAddress?.state || "",

        // Professional Details - Medical
        medicalDegree: qualificationParts[0] || "",
        medicalRegNo: editData.licenseNumber || "",
        medicalRegYear: editData.medicalRegYear || "", // Get from backend field
        medicalSpecialization: qualificationParts[1] || "",
        medicalExperience: editData.experience?.toString() || "",

        // Professional Details - Legal
        lawDegree: qualificationParts.length > 2 ? qualificationParts[2] : "",
        barCouncilNo: editData.licenseNumber || "", // Same as medical reg no in current model
        lawSpecialization: editData.lawSpecialization || "", // Get from backend field
        legalExperience: editData.experience?.toString() || "",

        // Current Role
        currentRole: editData.designation || "Doctor",
        workplace: editData.organizationName || "",
        designation: editData.designation || "",
        languagesKnown: extractLanguages(editData.specialNotes),

        // Areas of Expertise
        areasOfExpertise: {
          "Medical Negligence": expertiseObj["Medical Negligence"] || false,
          "Compensation / Assessment": expertiseObj["Compensation / Assessment"] || false,
          "Consent & Documentation": expertiseObj["Consent & Documentation"] || false,
          "Forensic Medicine": expertiseObj["Forensic Medicine"] || false,
          "Criminal Cases": expertiseObj["Criminal Cases"] || false,
          "Insurance / Audits": expertiseObj["Insurance / Audits"] || false,
          "Consumer Court Cases": expertiseObj["Consumer Court Cases"] || false,
          "Expert Witness": expertiseObj["Expert Witness"] || false,
        },

        // Case Involvement
        caseInvolvement: extractCaseInvolvement(editData.specialNotes),

        // Bank Details
        accountHolderName: editData.billingDetails?.bankDetails?.accountHolderName || "",
        bankName: editData.billingDetails?.bankDetails?.bankName || "",
        branch: editData.billingDetails?.bankDetails?.branch || "",
        accountNumber: editData.billingDetails?.bankDetails?.accountNumber || "",
        ifsc: editData.billingDetails?.bankDetails?.ifscCode || "",
        upi: editData.billingDetails?.upiId || "",
        gst: editData.billingDetails?.gstNumber || "",
        pan: editData.billingDetails?.panNumber || "",

        // Files - preserve existing document URLs for edit mode (from nested documents object)
        medicalDegreeCertificate: editData.documents?.medicalDegreeCertificate || null,
        barCouncilCertificate: editData.documents?.barCouncilCertificate || null,
        idProof: editData.documents?.idProof || null,
        photo: editData.documents?.photo || null,
        addressProof: editData.documents?.addressProof || null,
      });
    }
  }, [editData]);

  // Cleanup function to revoke object URLs
  useEffect(() => {
    return () => {
      // Revoke all document preview URLs to prevent memory leaks
      Object.values(documentPreviews).forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [documentPreviews]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      if (name.startsWith("expertise_")) {
        const area = name.replace("expertise_", "");
        setFormData({
          ...formData,
          areasOfExpertise: {
            ...formData.areasOfExpertise,
            [area]: checked,
          },
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked,
        });
      }
    } else if (type === "file") {
      const file = files[0];
      if (file) {
        // Create a preview URL for the selected file
        const previewUrl = URL.createObjectURL(file);

        // Update document previews
        setDocumentPreviews(prev => ({
          ...prev,
          [name]: previewUrl
        }));

        // Update form data
        setFormData({
          ...formData,
          [name]: file,
        });
      } else {
        // If no file is selected, clear the preview
        setDocumentPreviews(prev => ({
          ...prev,
          [name]: null
        }));
      }
    } else {
      let processedValue = value;

      // Apply formatting based on field type
      switch (name) {
        // Name fields - Auto uppercase
        case 'fullName':
        case 'accountHolderName':
        case 'bankName':
        case 'workplace':
        case 'designation':
          processedValue = value.toUpperCase();
          break;

        // Email - Auto lowercase
        case 'email':
          processedValue = value.toLowerCase();
          break;

        // PAN Card - Auto uppercase + validation
        case 'pan':
          processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (processedValue.length > 10) {
            processedValue = processedValue.substring(0, 10);
          }
          break;

        // GST - Auto uppercase + validation
        case 'gst':
          processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (processedValue.length > 15) {
            processedValue = processedValue.substring(0, 15);
          }
          break;

        // Phone numbers - Only numbers
        case 'contact1':
        case 'contact2':
          processedValue = value.replace(/[^0-9]/g, '');
          if (processedValue.length > 10) {
            processedValue = processedValue.substring(0, 10);
          }
          break;

        // IFSC Code - Auto uppercase
        case 'ifsc':
          processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (processedValue.length > 11) {
            processedValue = processedValue.substring(0, 11);
          }
          break;

        // Account Number - Only numbers
        case 'accountNumber':
          processedValue = value.replace(/[^0-9]/g, '');
          break;

        // Address fields - Proper case (first letter capital)
        case 'address':
        case 'city':
        case 'taluka':
        case 'district':
        case 'state':
          processedValue = value.replace(/\b\w/g, l => l.toUpperCase());
          break;

        // Medical/Legal fields - Proper case
        case 'medicalDegree':
        case 'lawDegree':
        case 'medicalSpecialization':
        case 'lawSpecialization':
        case 'languagesKnown':
          processedValue = value.replace(/\b\w/g, l => l.toUpperCase());
          break;

        // Registration numbers - Auto uppercase
        case 'medicalRegNo':
        case 'barCouncilNo':
        case 'medicalRegYear':
          processedValue = value.toUpperCase();
          break;

        // Experience - Only numbers
        case 'medicalExperience':
        case 'legalExperience':
          processedValue = value.replace(/[^0-9]/g, '');
          if (processedValue.length > 2) {
            processedValue = processedValue.substring(0, 2);
          }
          break;

        default:
          processedValue = value;
      }

      setFormData({
        ...formData,
        [name]: processedValue,
      });
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = [];

    // Required fields
    if (!formData.fullName.trim()) {
      errors.push("Full Name is required");
    }

    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push("Please enter a valid email address");
      }
    }

    // Phone number validation
    if (formData.contact1 && formData.contact1.length !== 10) {
      errors.push("Contact number 1 must be 10 digits");
    }

    if (formData.contact2 && formData.contact2.length !== 10) {
      errors.push("Contact number 2 must be 10 digits");
    }

    // PAN Card validation
    if (formData.pan) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(formData.pan)) {
        errors.push("PAN Card format should be: ABCDE1234F");
      }
    }

    // GST validation
    if (formData.gst) {
      if (formData.gst.length !== 15) {
        errors.push("GST number must be 15 characters");
      }
    }

    // IFSC Code validation
    if (formData.ifsc) {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(formData.ifsc)) {
        errors.push("IFSC Code format should be: ABCD0123456");
      }
    }

    // Experience validation
    if (formData.medicalExperience && (parseInt(formData.medicalExperience) > 50)) {
      errors.push("Medical experience cannot exceed 50 years");
    }

    if (formData.legalExperience && (parseInt(formData.legalExperience) > 50)) {
      errors.push("Legal experience cannot exceed 50 years");
    }

    return errors;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate form
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Prepare payload (exclude files)
      const {
        medicalDegreeCertificate,
        barCouncilCertificate,
        idProof,
        photo,
        addressProof,
        ...formFields
      } = formData;

      // Transform form data to match backend Expert model structure
      const payload = {
        // Basic Information
        fullName: formFields.fullName,
        gender: formFields.gender,
        dob: formFields.dob || null,
        email: formFields.email,
        phoneNumber: formFields.contact1,
        whatsappNumber: formFields.contact2,

        // Professional Information
        expertise: Object.keys(formFields.areasOfExpertise).filter(
          key => formFields.areasOfExpertise[key]
        ),
        qualification: [
          formFields.medicalDegree,
          formFields.medicalSpecialization,
          formFields.lawDegree
        ].filter(Boolean).join(', '),
        experience: parseInt(formFields.medicalExperience) || parseInt(formFields.legalExperience) || 0,
        licenseNumber: formFields.medicalRegNo || formFields.barCouncilNo,
        medicalRegYear: formFields.medicalRegYear, // Add this field directly
        lawSpecialization: formFields.lawSpecialization, // Add this field directly

        // Organization/Firm
        organizationName: formFields.workplace,
        designation: formFields.designation,

        // Contact Information
        officeAddress: {
          address: formFields.address || '',
          city: formFields.city || '',
          taluka: formFields.taluka || '',
          district: formFields.district || '',
          state: formFields.state || '',
          pinCode: formFields.pinCode || '', // Add pinCode if needed
          country: formFields.country || 'India'
        },

        // Billing Details
        billingDetails: {
          bankDetails: {
            accountHolderName: formFields.accountHolderName,
            bankName: formFields.bankName,
            branch: formFields.branch,
            accountNumber: formFields.accountNumber,
            ifscCode: formFields.ifsc
          },
          gstNumber: formFields.gst,
          panNumber: formFields.pan,
          upiId: formFields.upi
        },

        // Special Notes (combine case involvement and languages)
        specialNotes: [
          formFields.caseInvolvement,
          formFields.languagesKnown ? `Languages: ${formFields.languagesKnown}` : ""
        ].filter(Boolean).join('\n'),

        // Additional fields for form compatibility (ensure these don't get lost)
        currentRole: formFields.currentRole,
        medicalRegYear: formFields.medicalRegYear,
        lawSpecialization: formFields.lawSpecialization,
        legalExperience: formFields.legalExperience,

        // Ensure address fields are explicitly included
        address: formFields.address,
        city: formFields.city,
        taluka: formFields.taluka,
        district: formFields.district,
        state: formFields.state,
        pinCode: formFields.pinCode || '',
        country: formFields.country || 'India'
      };

      // Append JSON data
      formDataToSend.append('data', JSON.stringify(payload));

      // Debug: Log the payload being sent
      console.log('Payload being sent:', payload);
      console.log('Address data:', payload.officeAddress);
      console.log('Medical Reg Year:', payload.medicalRegYear);
      console.log('Law Specialization:', payload.lawSpecialization);
      console.log('Form Data medicalRegYear:', formFields.medicalRegYear);

      // Append files if they exist
      // In edit mode, only append files that have been newly selected (not the existing URLs)
      if (medicalDegreeCertificate instanceof File) {
        formDataToSend.append('medicalDegreeCertificate', medicalDegreeCertificate);
      }
      if (barCouncilCertificate instanceof File) {
        formDataToSend.append('barCouncilCertificate', barCouncilCertificate);
      }
      if (idProof instanceof File) {
        formDataToSend.append('idProof', idProof);
      }
      if (photo instanceof File) {
        formDataToSend.append('photo', photo);
      }
      if (addressProof instanceof File) {
        formDataToSend.append('addressProof', addressProof);
      }

      // Send request
      let response;
      if (editData && editData._id) {
        // Update existing expert
        response = await apiClient.put(
          apiEndpoints.experts.update(editData._id),
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Create new expert
        response = await apiClient.post(
          apiEndpoints.experts.create,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      if (response.data.success) {
        alert(editData ? "Expert updated successfully!" : "Expert created successfully!");
        navigate("/admin/expert-list");
      } else {
        setError(response.data.message || "Failed to save expert");
      }
    } catch (err) {
      console.error('Error saving expert:', err);
      setError(err.response?.data?.message || "Failed to save expert. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel?")) {
      navigate("/admin/expert-list");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {editData ? "Edit Expert" : "Create Expert"}
      </h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-4">Expert Information</h2>

      {/* Personal Information */}
      <section className="mb-6 border-b pb-4">
        <h3 className="text-lg font-semibold mb-3">Personal Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="border w-full p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
              placeholder="Enter full name (AUTO CAPS)"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  className="mr-1"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  className="mr-1"
                />
                Female
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="border w-full p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact No 1</label>
              <input
                type="text"
                name="contact1"
                value={formData.contact1}
                onChange={handleChange}
                className="border w-full p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
                placeholder="10 digits only"
                maxLength="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact No 2</label>
              <input
                type="text"
                name="contact2"
                value={formData.contact2}
                onChange={handleChange}
                className="border w-full p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
                placeholder="10 digits only"
                maxLength="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border w-full p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
              placeholder="email@example.com (auto lowercase)"
              style={{ textTransform: 'lowercase' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border w-full p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
              placeholder="Enter address"
            />
          </div>

          <div className="grid grid-cols-4 gap-2 col-span-2">
            <LocationInput
              label="State"
              value={formData.state}
              onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
              type="state"
              placeholder="Select State"
            />
            <LocationInput
              label="District"
              value={formData.district}
              onChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
              type="district"
              placeholder="Select District"
            />
            <LocationInput
              label="City"
              value={formData.city}
              onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
              type="city"
              placeholder="Select City"
            />
            <LocationInput
              label="Taluka"
              value={formData.taluka}
              onChange={(value) => setFormData(prev => ({ ...prev, taluka: value }))}
              type="taluka"
              placeholder="Select Taluka"
            />
          </div>
        </div>
      </section>

      {/* Professional Details */}
      <section className="mb-6 border-b pb-4">
        <h3 className="text-lg font-semibold mb-3">Professional Details</h3>

        <h4 className="font-medium mb-2">Medical</h4>
        <div className="grid grid-cols-4 gap-2 mb-2">
          <input
            type="text"
            name="medicalDegree"
            value={formData.medicalDegree}
            onChange={handleChange}
            placeholder="Medical Degree"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
          <input
            type="text"
            name="medicalRegNo"
            value={formData.medicalRegNo}
            onChange={handleChange}
            placeholder="Reg No"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
          <input
            type="text"
            name="medicalRegYear"
            value={formData.medicalRegYear}
            onChange={handleChange}
            placeholder="Reg Year"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
          <input
            type="text"
            name="medicalSpecialization"
            value={formData.medicalSpecialization}
            onChange={handleChange}
            placeholder="Specialization"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
        </div>

        <input
          type="text"
          name="medicalExperience"
          value={formData.medicalExperience}
          onChange={handleChange}
          placeholder="Years of Medical Experience (max 50)"
          maxLength="2"
          className="border p-2 rounded w-1/3 focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
        />

        <h4 className="font-medium mt-4 mb-2">Legal</h4>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <input
            type="text"
            name="lawDegree"
            value={formData.lawDegree}
            onChange={handleChange}
            placeholder="Law Degree"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
          <input
            type="text"
            name="barCouncilNo"
            value={formData.barCouncilNo}
            onChange={handleChange}
            placeholder="Bar Council No"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
          <input
            type="text"
            name="lawSpecialization"
            value={formData.lawSpecialization}
            onChange={handleChange}
            placeholder="Specialization in Law"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
        </div>

        <input
          type="text"
          name="legalExperience"
          value={formData.legalExperience}
          onChange={handleChange}
          placeholder="Years of Legal Practice (max 50)"
          maxLength="2"
          className="border p-2 rounded w-1/3 focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
        />
      </section>

      {/* Current Role */}
      <section className="mb-6 border-b pb-4">
        <h3 className="text-lg font-semibold mb-3">Current Role</h3>

        <div className="grid grid-cols-4 gap-2">
          <select
            name="currentRole"
            value={formData.currentRole}
            onChange={handleChange}
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          >
            <option value="Doctor">Doctor</option>
            <option value="Lawyer">Lawyer</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="workplace"
            value={formData.workplace}
            onChange={handleChange}
            placeholder="Workplace"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Designation"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
          <input
            type="text"
            name="languagesKnown"
            value={formData.languagesKnown}
            onChange={handleChange}
            placeholder="Languages Known"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
        </div>
      </section>

      {/* Areas of Expertise */}
      <section className="mb-6 border-b pb-4">
        <h3 className="text-lg font-semibold mb-3">Areas of Expertise</h3>
        <div className="grid grid-cols-2 gap-y-2">
          {[
            "Medical Negligence",
            "Compensation / Assessment",
            "Consent & Documentation",
            "Forensic Medicine",
            "Criminal Cases",
            "Insurance / Audits",
            "Consumer Court Cases",
            "Expert Witness",
          ].map((area) => (
            <label key={area} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={`expertise_${area}`}
                checked={formData.areasOfExpertise[area] || false}
                onChange={handleChange}
              />
              {area}
            </label>
          ))}
        </div>
      </section>

      {/* Case Involvement */}
      <section className="mb-6 border-b pb-4">
        <h3 className="text-lg font-semibold mb-3">Case Involvement Preference</h3>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="caseInvolvement"
              value="Both"
              checked={formData.caseInvolvement === "Both"}
              onChange={handleChange}
              className="mr-1"
            />
            Both
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="caseInvolvement"
              value="Willing to Appear in Court"
              checked={formData.caseInvolvement === "Willing to Appear in Court"}
              onChange={handleChange}
              className="mr-1"
            />
            Willing to Appear in Court
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="caseInvolvement"
              value="Written Opinion Only"
              checked={formData.caseInvolvement === "Written Opinion Only"}
              onChange={handleChange}
              className="mr-1"
            />
            Written Opinion Only
          </label>
        </div>
      </section>

      {/* Bank / Payment Details */}
      <section className="mb-6 border-b pb-4">
        <h3 className="text-lg font-semibold mb-3">Bank / Payment Details</h3>

        <div className="grid grid-cols-3 gap-2 mb-2">
          <input
            type="text"
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleChange}
            placeholder="Account Holder Name"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="Bank Name"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Branch"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Account Number (numbers only)"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
          <input
            type="text"
            name="ifsc"
            value={formData.ifsc}
            onChange={handleChange}
            placeholder="IFSC Code (ABCD0123456 - AUTO CAPS)"
            maxLength="11"
            style={{ textTransform: 'uppercase' }}
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
          <input
            type="text"
            name="upi"
            value={formData.upi}
            onChange={handleChange}
            placeholder="UPI ID (Optional)"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
          <input
            type="text"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            placeholder="GST Number (15 chars - AUTO CAPS)"
            maxLength="15"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
            style={{ textTransform: 'uppercase' }}
          />
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            placeholder="PAN Number (ABCDE1234F - AUTO CAPS)"
            maxLength="10"
            className="border p-2 rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
            style={{ textTransform: 'uppercase' }}
          />
        </div>
      </section>

      {/* Upload Documents */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Upload Documents</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medical Degree Certificate</label>
            <input
              type="file"
              name="medicalDegreeCertificate"
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {(documentPreviews.medicalDegreeCertificate || (formData.medicalDegreeCertificate && typeof formData.medicalDegreeCertificate === 'string')) && (
              <div className="mt-2">
                <a
                  href={documentPreviews.medicalDegreeCertificate || formData.medicalDegreeCertificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Preview Medical Degree Certificate
                </a>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bar Council Certificate</label>
            <input
              type="file"
              name="barCouncilCertificate"
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {(documentPreviews.barCouncilCertificate || (formData.barCouncilCertificate && typeof formData.barCouncilCertificate === 'string')) && (
              <div className="mt-2">
                <a
                  href={documentPreviews.barCouncilCertificate || formData.barCouncilCertificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Preview Bar Council Certificate
                </a>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof (Aadhaar/PAN)</label>
            <input
              type="file"
              name="idProof"
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {(documentPreviews.idProof || (formData.idProof && typeof formData.idProof === 'string')) && (
              <div className="mt-2">
                <a
                  href={documentPreviews.idProof || formData.idProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Preview ID Proof
                </a>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
              accept=".jpg,.jpeg,.png"
            />
            {(documentPreviews.photo || (formData.photo && typeof formData.photo === 'string')) && (
              <div className="mt-2">
                <a
                  href={documentPreviews.photo || formData.photo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Preview Photo
                </a>
              </div>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Proof (Optional)</label>
            <input
              type="file"
              name="addressProof"
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {(documentPreviews.addressProof || (formData.addressProof && typeof formData.addressProof === 'string')) && (
              <div className="mt-2">
                <a
                  href={documentPreviews.addressProof || formData.addressProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Preview Address Proof
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#398C89] text-white px-4 py-2 rounded hover:bg-[#2e706e] disabled:opacity-50"
        >
          {loading ? "Saving..." : editData ? "Update Expert" : "Save Expert"}
        </button>
      </div>
    </div>
  );
}
