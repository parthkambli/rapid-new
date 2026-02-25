// import React, { useState } from "react";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const AddDoctorForm = () => {
//   const navigate = useNavigate();
//   const [membershipType, setMembershipType] = useState("Individual");
//   const [doctors, setDoctors] = useState([{
//     doctorName: "",
//     specialty: "",
//     mobile: "",
//     whatsapp: "",
//     qualification: "",
//     email: "",
//     hospitalName: "",
//     hospitalAddress: "",
//     hospitalPinCode: "",
//     regLicenseNo: "",
//     hospitalPan: "",
//     contactNo: "",
//     hospitalWhastApp: "",
//     hospitalEmail: "",
//   }]);
//   const [linkSpouses, setLinkSpouses] = useState(false);
//   // Remove the global sameHospitalDetails state since we'll handle it differently
//   const [mainFormData, setMainFormData] = useState({
//     mlId: "",
//     date: new Date().toISOString().split('T')[0],
//     status: "cold",
//     followUpDate: "",
//     remarks: "",
//     hospitalType: "Hospital",
//     numberOfBeds: "",
//     yearOfEstablishment: "",
//     ownershipType: "Private",
//     medicalSuperintendentName: "",
//     adminOfficerName: "",
//     directorContactNo: "",
//     doctorType: "individual",
//     // Hospital fields
//     hospitalName: "",
//     hospitalAddress: "",
//     hospitalPinCode: "",
//     regLicenseNo: "",
//     hospitalPan: "",
//     contactNo: "",
//     hospitalWhastApp: "",
//     hospitalEmail: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleMainFormDataChange = (e, field) => {
//     let value = e.target.value;

//     // List of fields that should NOT be uppercased (dropdowns, dates, emails)
//     const excludeFromUppercase = [
//       'email', 'hospitalEmail', 'followUpDate', 'date',
//       'status', 'hospitalType', 'ownershipType', 'doctorType'
//     ];

//     if (!excludeFromUppercase.includes(field)) {
//       value = value.toUpperCase();
//     }

//     setMainFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleDoctorChange = (index, field, value) => {
//     // Apply uppercase for text fields (not email, mobile, etc.)
//     if (['doctorName', 'specialty', 'qualification', 'hospitalName', 'hospitalAddress', 'regLicenseNo', 'hospitalPan'].includes(field)) {
//       value = value.toUpperCase();
//     }

//     const updatedDoctors = [...doctors];
//     updatedDoctors[index] = {
//       ...updatedDoctors[index],
//       [field]: value
//     };
//     setDoctors(updatedDoctors);
//   };

//   const handleAddDoctor = () => {
//     setDoctors([...doctors, {
//       doctorName: "",
//       specialty: "",
//       mobile: "",
//       whatsapp: "",
//       qualification: "",
//       email: "",
//       hospitalName: "",
//       hospitalAddress: "",
//       hospitalPinCode: "",
//       regLicenseNo: "",
//       hospitalPan: "",
//       contactNo: "",
//       hospitalWhastApp: "",
//       hospitalEmail: "",
//     }]);
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const createdDoctors = [];

//       for (let i = 0; i < doctors.length; i++) {
//         const doctor = doctors[i];

//         // Hospital + Individual के लिए hospital details properly set करें
//         const getHospitalDetails = () => {
//           if (membershipType === "Hospital + Individual" || membershipType === "Individual") {
//             return {
//               hospitalType: mainFormData.hospitalType || "Hospital",
//               beds: mainFormData.numberOfBeds ? parseInt(mainFormData.numberOfBeds) : undefined,
//               establishmentYear: mainFormData.yearOfEstablishment || "",
//               website: "",
//               ownershipType: mainFormData.ownershipType || "Private",
//               director: {
//                 name: mainFormData.medicalSuperintendentName || "",
//                 contact: mainFormData.directorContactNo || "",
//                 email: ""
//               },
//               admin: {
//                 name: mainFormData.adminOfficerName || "",
//                 contact: "",
//                 email: ""
//               },
//               departments: []
//             };
//           }
//           return {};
//         };

//         const doctorData = {
//           // Basic Info
//           fullName: doctor.doctorName,
//           email: doctor.email?.toLowerCase() || "",
//           phoneNumber: doctor.mobile || "",
//           whatsappNumber: doctor.whatsapp || "",

//           // Professional Info
//           specialization: doctor.specialty ? [doctor.specialty] : [],
//           qualification: doctor.qualification || "",
//           licenseNumber: doctor.regLicenseNo || "",

//           // Hospital Info - Hospital + Individual के लिए mainFormData से लें
//           hospitalName: membershipType === "Hospital + Individual" ?
//             (mainFormData.hospitalName || doctor.hospitalName) :
//             (doctor.hospitalName || mainFormData.hospitalName || ""),

//           hospitalAddress: {
//             address: membershipType === "Hospital + Individual" ?
//               (mainFormData.hospitalAddress || doctor.hospitalAddress || "") :
//               (doctor.hospitalAddress || mainFormData.hospitalAddress || ""),
//             city: "",
//             state: "",
//             district: "",
//             taluka: "",
//             pinCode: membershipType === "Hospital + Individual" ?
//               (mainFormData.hospitalPinCode || doctor.hospitalPinCode || "") :
//               (doctor.hospitalPinCode || mainFormData.hospitalPinCode || ""),
//             country: "India"
//           },

//           // Contact Details
//           contactDetails: {
//             phoneNumber: doctor.mobile || "",
//             whatsapp: doctor.whatsapp || "",
//             emailId: doctor.email?.toLowerCase() || "",
//             currentAddress: {
//               address: "",
//               pinCode: "",
//               city: "",
//               state: "",
//               district: "",
//               taluka: "",
//               country: "India"
//             }
//           },

//           // Status
//           doctorStatus: mainFormData.status.toLowerCase(),
//           typeOfEnquiry: (function (s) {
//             const map = {
//               hot: 'hot', warm: 'hot', cold: 'cold',
//               follow_up: 'follow_up', close: 'closed',
//               converted: 'closed', lost: 'cancel'
//             };
//             return map[s] || 'cold';
//           })(mainFormData.status.toLowerCase()),
//           status: "pending",
//           doctorType: mainFormData.doctorType,

//           // Hospital Details - Hospital + Individual के लिए properly set करें
//           hospitalDetails: getHospitalDetails(),

//           // Follow-ups
//           followUps: mainFormData.followUpDate ? [{
//             date: new Date(mainFormData.followUpDate),
//             type: 'call',
//             notes: mainFormData.remarks || 'Scheduled follow-up',
//             nextFollowUpDate: new Date(mainFormData.followUpDate),
//             createdAt: new Date()
//           }] : [],

//           // Remarks
//           remarks: mainFormData.remarks || "",

//           // Membership Info
//           membershipId: mainFormData.mlId || undefined,
//           membershipType: membershipType
//         };

//         const response = await apiClient.post(apiEndpoints.salesman.addDoctor, doctorData);
//         if (response.data.success) {
//           createdDoctors.push(response.data.data);
//         } else {
//           throw new Error(response.data.message || "Failed to create doctor");
//         }
//       }

//       // Spouse linking logic - Hospital + Individual के लिए proper hospital details के साथ
//       if (doctors.length === 2 && linkSpouses && (membershipType === "Individual" || membershipType === "Hospital + Individual")) {
//         const doctor1Id = createdDoctors[0]._id;
//         const doctor2Id = createdDoctors[1]._id;

//         try {
//           // Update both doctors with spouse linking
//           await apiClient.put(apiEndpoints.doctors.update(doctor1Id), {
//             linkedDoctorId: doctor2Id,
//             relationshipType: 'spouse'
//           });

//           await apiClient.put(apiEndpoints.doctors.update(doctor2Id), {
//             linkedDoctorId: doctor1Id,
//             relationshipType: 'spouse'
//           });

//           toast.success(`${membershipType} membership created with ${doctors.length} doctors linked as spouses!`);
//         } catch (spouseError) {
//           console.error("Spouse linking failed:", spouseError);
//           toast.success(`${membershipType} membership created successfully! (Spouse linking failed)`);
//         }
//       } else {
//         toast.success(`${membershipType} membership created with ${doctors.length} doctor(s) successfully!`);
//       }

//       // Reset form
//       setMainFormData({
//         mlId: "",
//         date: new Date().toISOString().split('T')[0],
//         status: "cold",
//         followUpDate: "",
//         remarks: "",
//         hospitalType: "Hospital",
//         numberOfBeds: "",
//         yearOfEstablishment: "",
//         ownershipType: "Private",
//         medicalSuperintendentName: "",
//         adminOfficerName: "",
//         directorContactNo: "",
//         doctorType: "individual",
//         // Hospital fields
//         hospitalName: "",
//         hospitalAddress: "",
//         hospitalPinCode: "",
//         regLicenseNo: "",
//         hospitalPan: "",
//         contactNo: "",
//         hospitalWhastApp: "",
//         hospitalEmail: "",
//       });
//       setDoctors([{
//         doctorName: "", specialty: "", mobile: "", whatsapp: "", qualification: "", email: "",
//         hospitalName: "", hospitalAddress: "", hospitalPinCode: "", regLicenseNo: "", hospitalPan: "",
//         contactNo: "", hospitalWhastApp: "", hospitalEmail: "",
//       }]);
//       setLinkSpouses(false);

//       // Navigate back to the doctors list with a refresh indicator
//       navigate('/sales/all-doctors');

//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       toast.error("Error creating doctor: " + (error.message || "Unknown error"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reusable Doctor Block
//   const renderDoctorBlock = (index) => (
//     <div key={index} className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-800">Doctor {index + 1} Details</h2>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Name of Doctor</label>
//           <input
//             type="text"
//             placeholder="Enter Doctor Name"
//             value={doctors[index]?.doctorName || ""}
//             onChange={(e) => handleDoctorChange(index, 'doctorName', e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
//           <input
//             type="text"
//             placeholder="Enter Specialty"
//             value={doctors[index]?.specialty || ""}
//             onChange={(e) => handleDoctorChange(index, 'specialty', e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No</label>
//           <input
//             type="number"
//             placeholder="Enter Mobile No"
//             value={doctors[index]?.mobile || ""}
//             onChange={(e) => {
//               if (e.target.value.length <= 10) {
//                 handleDoctorChange(index, "mobile", e.target.value);
//               }
//             }}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">WA No</label>
//           <input
//             type="number"
//             placeholder="Enter WhatsApp No"
//             value={doctors[index]?.whatsapp || ""}
//             onChange={(e) => {
//               if (e.target.value.length <= 10) {
//                 handleDoctorChange(index, "whatsapp", e.target.value);
//               }
//             }}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
//           <input
//             type="text"
//             placeholder="Qualification"
//             value={doctors[index]?.qualification || ""}
//             onChange={(e) => handleDoctorChange(index, 'qualification', e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
//           <input
//             type="email"
//             placeholder="Email"
//             value={doctors[index]?.email || ""}
//             onChange={(e) => handleDoctorChange(index, 'email', e.target.value.toLowerCase())}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//           />
//         </div>
//       </div>

//       {/* Hospital Details for Individual membership type */}
//       {membershipType === "Individual" && (
//         <div className="mt-6 pt-6 border-t border-gray-200">
//           <h3 className="text-md font-semibold text-gray-700 mb-4">Hospital/Clinic Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter Hospital Name"
//                 value={doctors[index]?.hospitalName || ""}
//                 onChange={(e) => handleDoctorChange(index, 'hospitalName', e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Address</label>
//               <input
//                 type="text"
//                 placeholder="Enter Hospital Address"
//                 value={doctors[index]?.hospitalAddress || ""}
//                 onChange={(e) => handleDoctorChange(index, 'hospitalAddress', e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
//               <input
//                 type="number"
//                 placeholder="6-digit Pin Code"
//                 value={doctors[index]?.hospitalPinCode || ""}
//                 onChange={(e) => handleDoctorChange(index, 'hospitalPinCode', e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {index === 0 && (
//         <div className="flex flex-col">
//           <button
//             onClick={handleAddDoctor}
//             className="mt-6 px-5 py-2 font-medium rounded-md hover:transition flex items-center gap-2 bg-teal-600 text-white hover:bg-teal-700"
//           >
//             <span className="text-xl">+</span> Add Another Doctor
//           </button>

//           {(membershipType === 'Individual' || membershipType === 'Hospital + Individual') && doctors.length === 2 && (
//             <div className="flex items-center mt-4">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={linkSpouses}
//                   onChange={(e) => setLinkSpouses(e.target.checked)}
//                   className="form-checkbox h-5 w-5 text-teal-600"
//                 />
//                 <span className="ml-2 text-gray-700 font-medium">Link as spouses</span>
//               </label>
//             </div>
//           )}

//           {(membershipType === 'Individual' || membershipType === 'Hospital + Individual') && doctors.length > 2 && (
//             <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-2 rounded">
//               Note: Spouse linking is only available for exactly 2 doctors.
//             </div>
//           )}
//         </div>
//       )}
//       {index > 0 && (
//         <button
//           onClick={() => {
//             const updated = [...doctors];
//             updated.splice(index, 1);
//             setDoctors(updated);
//           }}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//         >
//           Remove Doctor
//         </button>
//       )}
//     </div>
//   );

//   const renderFullHospitalForm = () => {
//     return (
//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">Hospital Details</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
//             <input
//               type="text"
//               placeholder="Enter Hospital Name"
//               value={mainFormData.hospitalName || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'hospitalName')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Type of Hospital</label>
//             <select
//               value={mainFormData.hospitalType}
//               onChange={(e) => handleMainFormDataChange(e, 'hospitalType')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             >
//               <option>Maternity Home</option>
//               <option>Clinic</option>
//               <option>Hospital</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">No. of Beds</label>
//             <input
//               type="number"
//               placeholder="No. of Beds"
//               value={mainFormData.numberOfBeds || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'numberOfBeds')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
//             <input
//               type="number"
//               placeholder="Contact No"
//               value={mainFormData.contactNo || ""}
//               onChange={(e) => {
//                 if (e.target.value.length <= 10) {
//                   handleMainFormDataChange(e, "contactNo");
//                 }
//               }}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
//             <input
//               type="number"
//               placeholder="WhatsApp"
//               value={mainFormData.hospitalWhastApp || ""}
//               onChange={(e) => {
//                 if (e.target.value.length <= 10) {
//                   handleMainFormDataChange(e, "hospitalWhastApp");
//                 }
//               }}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//             <input
//               type="text"
//               placeholder="Address"
//               value={mainFormData.hospitalAddress || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'hospitalAddress')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
//             <input
//               type="number"
//               placeholder="6-digit Pin Code"
//               value={mainFormData.hospitalPinCode || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'hospitalPinCode')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               placeholder="Email"
//               value={mainFormData.hospitalEmail || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'hospitalEmail')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Admin / Mgmt Officer Name</label>
//             <input
//               type="text"
//               placeholder="Admin / Mgmt Officer Name"
//               value={mainFormData.adminOfficerName || ""}
//               onChange={(e) => handleMainFormDataChange(e, 'adminOfficerName')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Admin Contact No</label>
//             <input
//               type="number"
//               placeholder="Admin Contact No"
//               value={mainFormData.directorContactNo || ""}
//               onChange={(e) => {
//                 if (e.target.value.length <= 10) {
//                   handleMainFormDataChange(e, "directorContactNo");
//                 }
//               }}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-lato">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h1>

//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">MLID</label>
//             <input
//               type="text"
//               placeholder="Enter Membership ID"
//               value={mainFormData.mlId}
//               onChange={(e) => handleMainFormDataChange(e, 'mlId')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//             <input
//               type="date"
//               value={mainFormData.date}
//               onChange={(e) => handleMainFormDataChange(e, 'date')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Type of Membership</label>
//             <select
//               value={membershipType}
//               onChange={(e) => {
//                 setMembershipType(e.target.value);
//                 if (e.target.value === "Individual") {
//                   setDoctors([{ doctorName: "", specialty: "", mobile: "", whatsapp: "", qualification: "", email: "", hospitalName: "", hospitalAddress: "", hospitalPinCode: "", regLicenseNo: "", hospitalPan: "", contactNo: "", hospitalWhastApp: "", hospitalEmail: "" }]);
//                   setMainFormData(prev => ({ ...prev, doctorType: "individual" }));
//                   setLinkSpouses(false);
//                 } else if (e.target.value === "Hospital") {
//                   setDoctors([{}]);
//                   setMainFormData(prev => ({ ...prev, doctorType: "hospital" }));
//                   setLinkSpouses(false);
//                 } else {
//                   setDoctors([{ doctorName: "", specialty: "", mobile: "", whatsapp: "", qualification: "", email: "", hospitalName: "", hospitalAddress: "", hospitalPinCode: "", regLicenseNo: "", hospitalPan: "", contactNo: "", hospitalWhastApp: "", hospitalEmail: "" }]);
//                   setMainFormData(prev => ({ ...prev, doctorType: "hospital_individual" }));
//                   setLinkSpouses(false);
//                 }
//               }}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none text-teal-700 font-medium"
//             >
//               <option value="Individual">Individual</option>
//               <option value="Hospital">Hospital</option>
//               <option value="Hospital + Individual">Hospital + Individual</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {membershipType === "Individual" && (
//         <>
//           {doctors.map((_, i) => renderDoctorBlock(i))}
//         </>
//       )}

//       {membershipType === "Hospital" && renderFullHospitalForm()}

//       {membershipType === "Hospital + Individual" && (
//         <>
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-blue-800">Hospital + Individual Membership</h3>
//                 <div className="mt-2 text-sm text-blue-700">
//                   <p>• Fill hospital details below - they will be shared with all doctors</p>
//                   <p>• Add individual doctor details above</p>
//                   <p>• Hospital information will be automatically applied to all doctors</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {doctors.map((_, i) => renderDoctorBlock(i))}
//           {renderFullHospitalForm()}
//         </>
//       )}

//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">Status & Follow-up</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               value={mainFormData.status}
//               onChange={(e) => handleMainFormDataChange(e, 'status')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             >
//               <option value="hot">Hot</option>
//               <option value="warm">Warm</option>
//               <option value="cold">Cold</option>
//               <option value="close">Close</option>
//               <option value="converted">Converted</option>
//               <option value="lost">Lost</option>
//               <option value="follow_up">Follow Up</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
//             <input
//               type="date"
//               value={mainFormData.followUpDate}
//               onChange={(e) => handleMainFormDataChange(e, 'followUpDate')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//             />
//           </div>
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Narration / Remarks</label>
//             <textarea
//               rows={3}
//               placeholder="Enter remarks here..."
//               value={mainFormData.remarks}
//               onChange={(e) => handleMainFormDataChange(e, 'remarks')}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none resize-none"
//             ></textarea>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end gap-3">
//         <button
//           onClick={handleSave}
//           disabled={loading}
//           className={`px-6 py-2 text-white font-medium rounded-md transition ${loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
//         >
//           {loading ? 'Saving...' : 'Save'}
//         </button>
//         <button
//           onClick={() => navigate('/sales/all-doctors')}
//           className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={() => navigate('/sales/add/quotation')}
//           className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
//         >
//           Give Quote
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddDoctorForm;





import React, { useState } from "react";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddDoctorForm = () => {
  const navigate = useNavigate();
  const [membershipType, setMembershipType] = useState("Individual");
  const [doctors, setDoctors] = useState([{
    doctorName: "",
    specialty: "",
    mobile: "",
    whatsapp: "",
    qualification: "",
    email: "",
    hospitalName: "",
    hospitalAddress: "",
    hospitalPinCode: "",
    regLicenseNo: "",
    hospitalPan: "",
    contactNo: "",
    hospitalWhastApp: "",
    hospitalEmail: "",
  }]);
  const [linkSpouses, setLinkSpouses] = useState(false);
  // Remove the global sameHospitalDetails state since we'll handle it differently
  const [mainFormData, setMainFormData] = useState({
    mlId: "",
    date: new Date().toISOString().split('T')[0],
    status: "cold",
    followUpDate: "",
    remarks: "",
    hospitalType: "Hospital",
    numberOfBeds: "",
    yearOfEstablishment: "",
    ownershipType: "Private",
    medicalSuperintendentName: "",
    adminOfficerName: "",
    directorContactNo: "",
    doctorType: "individual",
    // Hospital fields
    hospitalName: "",
    hospitalAddress: "",
    hospitalPinCode: "",
    regLicenseNo: "",
    hospitalPan: "",
    contactNo: "",
    hospitalWhastApp: "",
    hospitalEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [isGiveQuote, setIsGiveQuote] = useState(false);

  const handleMainFormDataChange = (e, field) => {
    let value = e.target.value;

    // Uppercase logic for text fields (except email, remarks, and status fields)
    if (field !== 'email' && field !== 'hospitalEmail' && field !== 'followUpDate' &&
        field !== 'date' && field !== 'status') {
      value = value.toUpperCase();
    }

    setMainFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDoctorChange = (index, field, value) => {
    // Apply uppercase for text fields (not email, mobile, etc.)
    if (['doctorName', 'specialty', 'qualification', 'hospitalName', 'hospitalAddress', 'regLicenseNo', 'hospitalPan'].includes(field)) {
      value = value.toUpperCase();
    }

    const updatedDoctors = [...doctors];
    updatedDoctors[index] = {
      ...updatedDoctors[index],
      [field]: value
    };
    setDoctors(updatedDoctors);
  };

  const handleAddDoctor = () => {
    setDoctors([...doctors, {
      doctorName: "",
      specialty: "",
      mobile: "",
      whatsapp: "",
      qualification: "",
      email: "",
      hospitalName: "",
      hospitalAddress: "",
      hospitalPinCode: "",
      regLicenseNo: "",
      hospitalPan: "",
      contactNo: "",
      hospitalWhastApp: "",
      hospitalEmail: "",
    }]);
  };

  // const handleSave = async (shouldNavigateToQuotation = false) => {
  //   setLoading(true);
  //   try {
  //     const createdDoctors = [];

  //     for (let i = 0; i < doctors.length; i++) {
  //       const doctor = doctors[i];

  //       // Hospital + Individual के लिए hospital details properly set करें
  //       const getHospitalDetails = () => {
  //         if (membershipType === "Hospital + Individual" || membershipType === "Individual") {
  //           return {
  //             hospitalType: mainFormData.hospitalType || "Hospital",
  //             beds: mainFormData.numberOfBeds ? parseInt(mainFormData.numberOfBeds) : undefined,
  //             establishmentYear: mainFormData.yearOfEstablishment || "",
  //             website: "",
  //             ownershipType: mainFormData.ownershipType || "Private",
  //             director: {
  //               name: mainFormData.medicalSuperintendentName || "",
  //               contact: mainFormData.directorContactNo || "",
  //               email: ""
  //             },
  //             admin: {
  //               name: mainFormData.adminOfficerName || "",
  //               contact: "",
  //               email: ""
  //             },
  //             departments: []
  //           };
  //         }
  //         return {};
  //       };

  //       const doctorData = {
  //         // Basic Info
  //         fullName: doctor.doctorName,
  //         email: doctor.email?.toLowerCase() || "",
  //         phoneNumber: doctor.mobile || "",
  //         whatsappNumber: doctor.whatsapp || "",

  //         // Professional Info
  //         specialization: doctor.specialty ? [doctor.specialty] : [],
  //         qualification: doctor.qualification || "",
  //         licenseNumber: doctor.regLicenseNo || "",

  //         // Hospital Info - Hospital + Individual के लिए mainFormData से लें
  //         hospitalName: membershipType === "Hospital + Individual" ?
  //           (mainFormData.hospitalName || doctor.hospitalName) :
  //           (doctor.hospitalName || mainFormData.hospitalName || ""),

  //         hospitalAddress: {
  //           address: membershipType === "Hospital + Individual" ?
  //             (mainFormData.hospitalAddress || doctor.hospitalAddress || "") :
  //             (doctor.hospitalAddress || mainFormData.hospitalAddress || ""),
  //           city: "",
  //           state: "",
  //           district: "",
  //           taluka: "",
  //           pinCode: membershipType === "Hospital + Individual" ?
  //             (mainFormData.hospitalPinCode || doctor.hospitalPinCode || "") :
  //             (doctor.hospitalPinCode || mainFormData.hospitalPinCode || ""),
  //           country: "India"
  //         },

  //         // Contact Details
  //         contactDetails: {
  //           phoneNumber: doctor.mobile || "",
  //           whatsapp: doctor.whatsapp || "",
  //           emailId: doctor.email?.toLowerCase() || "",
  //           currentAddress: {
  //             address: "",
  //             pinCode: "",
  //             city: "",
  //             state: "",
  //             district: "",
  //             taluka: "",
  //             country: "India"
  //           }
  //         },

  //         // Status
  //         typeOfEnquiry: "cold",
  //         doctorStatus: mainFormData.status.toLowerCase(),
  //         status: "pending",
  //         doctorType: mainFormData.doctorType,

  //         // Hospital Details - Hospital + Individual के लिए properly set करें
  //         hospitalDetails: getHospitalDetails(),

  //         // Follow-ups
  //         followUps: mainFormData.followUpDate ? [{
  //           date: new Date(mainFormData.followUpDate),
  //           type: 'call',
  //           notes: mainFormData.remarks || 'Scheduled follow-up',
  //           nextFollowUpDate: new Date(mainFormData.followUpDate),
  //           createdAt: new Date()
  //         }] : [],

  //         // Remarks
  //         remarks: mainFormData.remarks || "",

  //         // Membership Info
  //         membershipId: mainFormData.mlId || undefined,
  //         membershipType: membershipType
  //       };

  //       const response = await apiClient.post(apiEndpoints.doctors.create, doctorData);
  //       if (response.data.success) {
  //         createdDoctors.push(response.data.data);
  //       } else {
  //         throw new Error(response.data.message || "Failed to create doctor");
  //       }
  //     }

  //     // Spouse linking logic - Hospital + Individual के लिए proper hospital details के साथ
  //     if (doctors.length === 2 && linkSpouses && (membershipType === "Individual" || membershipType === "Hospital + Individual")) {
  //       const doctor1Id = createdDoctors[0]._id;
  //       const doctor2Id = createdDoctors[1]._id;

  //       try {
  //         // Update both doctors with spouse linking
  //         await apiClient.put(apiEndpoints.doctors.update(doctor1Id), {
  //           linkedDoctorId: doctor2Id,
  //           relationshipType: 'spouse'
  //         });

  //         await apiClient.put(apiEndpoints.doctors.update(doctor2Id), {
  //           linkedDoctorId: doctor1Id,
  //           relationshipType: 'spouse'
  //         });

  //         toast.success(`${membershipType} membership created with ${doctors.length} doctors linked as spouses!`);
  //       } catch (spouseError) {
  //         console.error("Spouse linking failed:", spouseError);
  //         toast.success(`${membershipType} membership created successfully! (Spouse linking failed)`);
  //       }
  //     } else {
  //       toast.success(`${membershipType} membership created with ${doctors.length} doctor(s) successfully!`);
  //     }

  //     // Reset form
  //     setMainFormData({
  //       mlId: "",
  //       date: new Date().toISOString().split('T')[0],
  //       status: "cold",
  //       followUpDate: "",
  //       remarks: "",
  //       hospitalType: "Hospital",
  //       numberOfBeds: "",
  //       yearOfEstablishment: "",
  //       ownershipType: "Private",
  //       medicalSuperintendentName: "",
  //       adminOfficerName: "",
  //       directorContactNo: "",
  //       doctorType: "individual",
  //       // Hospital fields
  //       hospitalName: "",
  //       hospitalAddress: "",
  //       hospitalPinCode: "",
  //       regLicenseNo: "",
  //       hospitalPan: "",
  //       contactNo: "",
  //       hospitalWhastApp: "",
  //       hospitalEmail: "",
  //     });
  //     setDoctors([{
  //       doctorName: "", specialty: "", mobile: "", whatsapp: "", qualification: "", email: "",
  //       hospitalName: "", hospitalAddress: "", hospitalPinCode: "", regLicenseNo: "", hospitalPan: "",
  //       contactNo: "", hospitalWhastApp: "", hospitalEmail: "",
  //     }]);
  //     setLinkSpouses(false);

  //     // Navigate based on whether "Give Quote" was clicked
  //     if (shouldNavigateToQuotation) {
  //       // Navigate to create quotation page with the first created doctor's ID
  //       const firstDoctorId = createdDoctors[0]?._id;
  //       if (firstDoctorId) {
  //         navigate("/sales/add/quotation", {
  //           state: {
  //             doctorId: firstDoctorId,
  //             from: "add-doctor"
  //           }
  //         });
  //       } else {
  //         navigate('/sales/all-doctors');
  //       }
  //     } else {
  //       navigate('/sales/all-doctors');
  //     }

  //   } catch (error) {
  //     console.error("Error creating doctor:", error);
  //     toast.error("Error creating doctor: " + (error.message || "Unknown error"));
  //   } finally {
  //     setLoading(false);
  //   }
  // };


// salesman ke AddDoctorForm mein handleSave function ko update karen:

// const handleSave = async (shouldNavigateToQuotation = false) => {
//   setLoading(true);
//   try {
//     const createdDoctors = [];

//     for (let i = 0; i < doctors.length; i++) {
//       const doctor = doctors[i];

//       // Hospital + Individual के लिए hospital details properly set करें
//       const getHospitalDetails = () => {
//         if (membershipType === "Hospital + Individual" || membershipType === "Hospital") {
//           return {
//             hospitalType: mainFormData.hospitalType || "Hospital",
//             beds: mainFormData.numberOfBeds ? parseInt(mainFormData.numberOfBeds) : undefined,
//             establishmentYear: mainFormData.yearOfEstablishment || "",
//             website: "",
//             ownershipType: mainFormData.ownershipType || "Private",
//             director: {
//               name: mainFormData.medicalSuperintendentName || "",
//               contact: mainFormData.directorContactNo || "",
//               email: ""
//             },
//             admin: {
//               name: mainFormData.adminOfficerName || "",
//               contact: "",
//               email: ""
//             },
//             departments: []
//           };
//         }
//         return {};
//       };

//       // ================= IMPORTANT FIX =================
//       // Admin form jaisa logic: Hospital only ke liye fullName mein hospital name daalo
//       let fullName = "";
//       if (membershipType === "Hospital") {
//         // Hospital only: fullName should be hospital name
//         fullName = mainFormData.hospitalName || "";
//       } else if (membershipType === "Individual") {
//         // Individual: fullName should be doctor name
//         fullName = doctor.doctorName || "";
//       } else if (membershipType === "Hospital + Individual") {
//         // Hospital + Individual: fullName should be doctor name
//         fullName = doctor.doctorName || "";
//       }

//       const doctorData = {
//         // Basic Info - FIXED: fullName ko properly set karo
//         fullName: fullName,
//         email: doctor.email?.toLowerCase() || "",
//         phoneNumber: doctor.mobile || "",
//         whatsappNumber: doctor.whatsapp || "",

//         // Professional Info
//         specialization: doctor.specialty ? [doctor.specialty] : [],
//         qualification: doctor.qualification || "",
//         licenseNumber: doctor.regLicenseNo || "",

//         // Hospital Info - FIXED: Hospital name ko properly set karo
//         hospitalName: membershipType === "Hospital" ? 
//           (mainFormData.hospitalName || "") :
//           membershipType === "Hospital + Individual" ?
//             (mainFormData.hospitalName || doctor.hospitalName) :
//             (doctor.hospitalName || ""),

//         hospitalAddress: {
//           address: membershipType === "Hospital" ? 
//             (mainFormData.hospitalAddress || "") :
//             membershipType === "Hospital + Individual" ?
//               (mainFormData.hospitalAddress || doctor.hospitalAddress || "") :
//               (doctor.hospitalAddress || ""),
//           city: "",
//           state: "",
//           district: "",
//           taluka: "",
//           pinCode: membershipType === "Hospital" ?
//             (mainFormData.hospitalPinCode || "") :
//             membershipType === "Hospital + Individual" ?
//               (mainFormData.hospitalPinCode || doctor.hospitalPinCode || "") :
//               (doctor.hospitalPinCode || ""),
//           country: "India"
//         },

//         // Contact Details
//         contactDetails: {
//           phoneNumber: doctor.mobile || "",
//           whatsapp: doctor.whatsapp || "",
//           emailId: doctor.email?.toLowerCase() || "",
//           currentAddress: {
//             address: "",
//             pinCode: "",
//             city: "",
//             state: "",
//             district: "",
//             taluka: "",
//             country: "India"
//           }
//         },

//         // Status
//         typeOfEnquiry: "cold",
//         doctorStatus: mainFormData.status.toLowerCase(),
//         status: "pending",
        
//         // ================= IMPORTANT: doctorType set karo membershipType ke hisaab se =================
//         doctorType: membershipType === "Hospital" ? "hospital" : 
//                    membershipType === "Hospital + Individual" ? "hospital_individual" : "individual",

//         // Hospital Details - FIXED: Hospital type ke liye properly set karo
//         hospitalDetails: getHospitalDetails(),

//         // Follow-ups
//         followUps: mainFormData.followUpDate ? [{
//           date: new Date(mainFormData.followUpDate),
//           type: 'call',
//           notes: mainFormData.remarks || 'Scheduled follow-up',
//           nextFollowUpDate: new Date(mainFormData.followUpDate),
//           createdAt: new Date()
//         }] : [],

//         // Remarks
//         remarks: mainFormData.remarks || "",

//         // Membership Info
//         membershipId: mainFormData.mlId || undefined,
//         membershipType: membershipType
//       };

//       const response = await apiClient.post(apiEndpoints.doctors.create, doctorData);
//       if (response.data.success) {
//         createdDoctors.push(response.data.data);
//       } else {
//         throw new Error(response.data.message || "Failed to create doctor");
//       }
//     }

//     // Spouse linking logic - FIXED: sirf Individual aur Hospital+Individual ke liye
//     if (doctors.length === 2 && linkSpouses && 
//         (membershipType === "Individual" || membershipType === "Hospital + Individual")) {
//       const doctor1Id = createdDoctors[0]._id;
//       const doctor2Id = createdDoctors[1]._id;

//       try {
//         await apiClient.put(apiEndpoints.doctors.update(doctor1Id), {
//           linkedDoctorId: doctor2Id,
//           relationshipType: 'spouse'
//         });

//         await apiClient.put(apiEndpoints.doctors.update(doctor2Id), {
//           linkedDoctorId: doctor1Id,
//           relationshipType: 'spouse'
//         });

//         toast.success(`${membershipType} membership created with ${doctors.length} doctors linked as spouses!`);
//       } catch (spouseError) {
//         console.error("Spouse linking failed:", spouseError);
//         toast.success(`${membershipType} membership created successfully! (Spouse linking failed)`);
//       }
//     } else {
//       toast.success(`${membershipType} membership created with ${doctors.length} doctor(s) successfully!`);
//     }

//     // Reset form
//     setMainFormData({
//       mlId: "",
//       date: new Date().toISOString().split('T')[0],
//       status: "cold",
//       followUpDate: "",
//       remarks: "",
//       hospitalType: "Hospital",
//       numberOfBeds: "",
//       yearOfEstablishment: "",
//       ownershipType: "Private",
//       medicalSuperintendentName: "",
//       adminOfficerName: "",
//       directorContactNo: "",
//       doctorType: "individual",
//       hospitalName: "",
//       hospitalAddress: "",
//       hospitalPinCode: "",
//       regLicenseNo: "",
//       hospitalPan: "",
//       contactNo: "",
//       hospitalWhastApp: "",
//       hospitalEmail: "",
//     });
//     setDoctors([{
//       doctorName: "", specialty: "", mobile: "", whatsapp: "", qualification: "", email: "",
//       hospitalName: "", hospitalAddress: "", hospitalPinCode: "", regLicenseNo: "", hospitalPan: "",
//       contactNo: "", hospitalWhastApp: "", hospitalEmail: "",
//     }]);
//     setLinkSpouses(false);

//     if (shouldNavigateToQuotation) {
//       const firstDoctorId = createdDoctors[0]?._id;
//       if (firstDoctorId) {
//         navigate("/sales/add/quotation", {
//           state: {
//             doctorId: firstDoctorId,
//             from: "add-doctor"
//           }
//         });
//       } else {
//         navigate('/sales/all-doctors');
//       }
//     } else {
//       navigate('/sales/all-doctors');
//     }

//   } catch (error) {
//     console.error("Error creating doctor:", error);
//     toast.error("Error creating doctor: " + (error.message || "Unknown error"));
//   } finally {
//     setLoading(false);
//   }
// };

const handleSave = async (shouldNavigateToQuotation = false) => {
  setLoading(true);
  try {
    const createdDoctors = [];

    // ================= HOSPITAL ONLY TYPE =================
    if (membershipType === "Hospital") {
      console.log("Hospital form data:", mainFormData); // Debug ke liye
      
      // Validate required fields for Hospital
      if (!mainFormData.hospitalName || !mainFormData.contactNo) {
        toast.error('Please fill in required fields: Hospital Name and Contact Number');
        setLoading(false);
        return;
      }

      const hospitalData = {
        // Basic Info
        fullName: mainFormData.hospitalName.toUpperCase() || "",
        email: mainFormData.hospitalEmail?.toLowerCase() || "",
        phoneNumber: mainFormData.contactNo || "", // ← Yeh field
        whatsappNumber: mainFormData.hospitalWhastApp || "", // ← Yeh field

        // Professional Info
        specialization: [],
        qualification: mainFormData.hospitalPan || "",
        licenseNumber: mainFormData.regLicenseNo || "",

        // Hospital Info
        hospitalName: mainFormData.hospitalName.toUpperCase() || "",
        hospitalAddress: {
          address: (mainFormData.hospitalAddress || "").toUpperCase(),
          city: "",
          state: "",
          district: "",
          taluka: "",
          pinCode: mainFormData.hospitalPinCode || "",
          country: "India"
        },

        // Contact Details
        contactDetails: {
          phoneNumber: mainFormData.contactNo || "", // ← Yeh field
          whatsapp: mainFormData.hospitalWhastApp || "", // ← Yeh field
          emailId: mainFormData.hospitalEmail?.toLowerCase() || "",
          currentAddress: {
            address: (mainFormData.hospitalAddress || "").toUpperCase(),
            pinCode: mainFormData.hospitalPinCode || "",
            city: "",
            state: "",
            district: "",
            taluka: "",
            country: "India"
          }
        },

        // Hospital Details
        hospitalDetails: {
          hospitalType: mainFormData.hospitalType || "Hospital",
          beds: mainFormData.numberOfBeds ? parseInt(mainFormData.numberOfBeds) : undefined,
          establishmentYear: mainFormData.yearOfEstablishment || "",
          website: "",
          ownershipType: mainFormData.ownershipType || "Private",
          director: {
            name: (mainFormData.medicalSuperintendentName || "").toUpperCase(),
            contact: mainFormData.directorContactNo || "",
            email: ""
          },
          admin: {
            name: (mainFormData.adminOfficerName || "").toUpperCase(),
            contact: "",
            email: ""
          },
          departments: []
        },

        // Status
        typeOfEnquiry: mainFormData.status?.toLowerCase() || "cold",
        doctorStatus: mainFormData.status?.toLowerCase() || "cold",
        status: "pending",
        doctorType: "hospital",

        // Follow-ups
        followUps: mainFormData.followUpDate ? [{
          date: new Date(mainFormData.followUpDate),
          type: 'call',
          notes: mainFormData.remarks || 'Scheduled follow-up',
          nextFollowUpDate: new Date(mainFormData.followUpDate),
          createdAt: new Date()
        }] : [],

        // Remarks
        remarks: mainFormData.remarks || "",

        // Membership Info
        membershipId: mainFormData.mlId || undefined,
        membershipDate: mainFormData.date ? new Date(mainFormData.date) : new Date(),
        membershipType: "Hospital"
      };

      console.log("Hospital API Payload:", hospitalData); // Debug ke liye

      const response = await apiClient.post(apiEndpoints.doctors.create, hospitalData);
      if (response.data.success) {
        createdDoctors.push(response.data.data);
        toast.success("Hospital membership created successfully!");
      } else {
        throw new Error(response.data.message || "Failed to create hospital");
      }
    }
    
    // ================= INDIVIDUAL TYPE =================
    else if (membershipType === "Individual") {
      for (let i = 0; i < doctors.length; i++) {
        const doctor = doctors[i];

        console.log(`Doctor ${i + 1} data:`, doctor); // Debug ke liye

        // Validate required fields for Individual
        if (!doctor.doctorName || !doctor.mobile) {
          toast.error(`Please fill in required fields for Doctor ${i + 1}: Name and Mobile Number`);
          setLoading(false);
          return;
        }

        const doctorData = {
          // Basic Info
          fullName: doctor.doctorName.toUpperCase() || "",
          email: doctor.email?.toLowerCase() || "",
          phoneNumber: doctor.mobile || "",
          whatsappNumber: doctor.whatsapp || "",

          // Professional Info
          specialization: doctor.specialty ? [doctor.specialty.toUpperCase()] : [],
          qualification: doctor.qualification.toUpperCase() || "",
          licenseNumber: doctor.regLicenseNo || "",

          // Hospital Info
          hospitalName: doctor.hospitalName.toUpperCase() || "",
          hospitalAddress: {
            address: (doctor.hospitalAddress || "").toUpperCase(),
            city: "",
            state: "",
            district: "",
            taluka: "",
            pinCode: doctor.hospitalPinCode || "",
            country: "India"
          },

          // Contact Details
          contactDetails: {
            phoneNumber: doctor.mobile || "",
            whatsapp: doctor.whatsapp || "",
            emailId: doctor.email?.toLowerCase() || "",
            currentAddress: {
              address: "",
              pinCode: "",
              city: "",
              state: "",
              district: "",
              taluka: "",
              country: "India"
            }
          },

          // Status
          typeOfEnquiry: mainFormData.status?.toLowerCase() || "cold",
          doctorStatus: mainFormData.status?.toLowerCase() || "cold",
          status: "pending",
          doctorType: "individual",

          // Follow-ups
          followUps: mainFormData.followUpDate ? [{
            date: new Date(mainFormData.followUpDate),
            type: 'call',
            notes: mainFormData.remarks || 'Scheduled follow-up',
            nextFollowUpDate: new Date(mainFormData.followUpDate),
            createdAt: new Date()
          }] : [],

          // Remarks
          remarks: mainFormData.remarks || "",

          // Membership Info
          membershipId: mainFormData.mlId || undefined,
          membershipDate: mainFormData.date ? new Date(mainFormData.date) : new Date(),
          membershipType: "Individual"
        };

        console.log(`Doctor ${i + 1} API Payload:`, doctorData); // Debug ke liye

        const response = await apiClient.post(apiEndpoints.doctors.create, doctorData);
        if (response.data.success) {
          createdDoctors.push(response.data.data);
        } else {
          throw new Error(response.data.message || `Failed to create doctor ${i + 1}`);
        }
      }
      
      if (doctors.length > 0) {
        toast.success(`Individual membership created with ${doctors.length} doctor(s) successfully!`);
      }
    }
    
    // ================= HOSPITAL + INDIVIDUAL TYPE =================
    else if (membershipType === "Hospital + Individual") {
      console.log("Hospital+Individual form data:", mainFormData); // Debug ke liye
      
      // Validate hospital fields first
      if (!mainFormData.hospitalName || !mainFormData.contactNo) {
        toast.error('Please fill in required hospital fields: Hospital Name and Contact Number');
        setLoading(false);
        return;
      }

      for (let i = 0; i < doctors.length; i++) {
        const doctor = doctors[i];

        console.log(`Doctor ${i + 1} data:`, doctor); // Debug ke liye

        // Validate doctor fields
        if (!doctor.doctorName || !doctor.mobile) {
          toast.error(`Please fill in required fields for Doctor ${i + 1}: Name and Mobile Number`);
          setLoading(false);
          return;
        }

        const doctorData = {
          // Basic Info
          fullName: doctor.doctorName.toUpperCase() || "",
          email: doctor.email?.toLowerCase() || "",
          phoneNumber: doctor.mobile || "",
          whatsappNumber: doctor.whatsapp || "",

          // Professional Info
          specialization: doctor.specialty ? [doctor.specialty.toUpperCase()] : [],
          qualification: doctor.qualification.toUpperCase() || "",
          licenseNumber: doctor.regLicenseNo || "",

          // Hospital Info (Hospital + Individual ke liye hospital data use karo)
          hospitalName: mainFormData.hospitalName.toUpperCase() || "",
          hospitalAddress: {
            address: (mainFormData.hospitalAddress || "").toUpperCase(),
            city: "",
            state: "",
            district: "",
            taluka: "",
            pinCode: mainFormData.hospitalPinCode || "",
            country: "India"
          },

          // Contact Details
          contactDetails: {
            phoneNumber: doctor.mobile || "",
            whatsapp: doctor.whatsapp || "",
            emailId: doctor.email?.toLowerCase() || "",
            currentAddress: {
              address: "",
              pinCode: "",
              city: "",
              state: "",
              district: "",
              taluka: "",
              country: "India"
            }
          },

          // Hospital Details
          hospitalDetails: {
            hospitalType: mainFormData.hospitalType || "Hospital",
            beds: mainFormData.numberOfBeds ? parseInt(mainFormData.numberOfBeds) : undefined,
            establishmentYear: mainFormData.yearOfEstablishment || "",
            website: "",
            ownershipType: mainFormData.ownershipType || "Private",
            director: {
              name: (mainFormData.medicalSuperintendentName || "").toUpperCase(),
              contact: mainFormData.directorContactNo || "",
              email: ""
            },
            admin: {
              name: (mainFormData.adminOfficerName || "").toUpperCase(),
              contact: "",
              email: ""
            },
            departments: []
          },

          // Status
          typeOfEnquiry: mainFormData.status?.toLowerCase() || "cold",
          doctorStatus: mainFormData.status?.toLowerCase() || "cold",
          status: "pending",
          doctorType: "hospital_individual",

          // Follow-ups
          followUps: mainFormData.followUpDate ? [{
            date: new Date(mainFormData.followUpDate),
            type: 'call',
            notes: mainFormData.remarks || 'Scheduled follow-up',
            nextFollowUpDate: new Date(mainFormData.followUpDate),
            createdAt: new Date()
          }] : [],

          // Remarks
          remarks: mainFormData.remarks || "",

          // Membership Info
          membershipId: mainFormData.mlId || undefined,
          membershipDate: mainFormData.date ? new Date(mainFormData.date) : new Date(),
          membershipType: "Hospital + Individual"
        };

        console.log(`Doctor ${i + 1} API Payload:`, doctorData); // Debug ke liye

        const response = await apiClient.post(apiEndpoints.doctors.create, doctorData);
        if (response.data.success) {
          createdDoctors.push(response.data.data);
        } else {
          throw new Error(response.data.message || `Failed to create doctor ${i + 1}`);
        }
      }
      
      if (doctors.length > 0) {
        toast.success(`Hospital + Individual membership created with ${doctors.length} doctor(s) successfully!`);
      }
    }

    // ================= SPOUSE LINKING LOGIC =================
    // Sirf Individual aur Hospital+Individual ke liye, exactly 2 doctors hain to link karo
    if (doctors.length === 2 && linkSpouses && 
        (membershipType === "Individual" || membershipType === "Hospital + Individual")) {
      const doctor1Id = createdDoctors[0]._id;
      const doctor2Id = createdDoctors[1]._id;

      try {
        await apiClient.put(apiEndpoints.doctors.update(doctor1Id), {
          linkedDoctorId: doctor2Id,
          relationshipType: 'spouse'
        });

        await apiClient.put(apiEndpoints.doctors.update(doctor2Id), {
          linkedDoctorId: doctor1Id,
          relationshipType: 'spouse'
        });

        toast.success(`Doctors linked as spouses successfully!`);
      } catch (spouseError) {
        console.error("Spouse linking failed:", spouseError);
        // Spouse linking fail ho to bhi membership create ho gaya, bas warning show karo
        toast.warning("Membership created but spouse linking failed");
      }
    }

    // ================= RESET FORM =================
    setMainFormData({
      mlId: "",
      date: new Date().toISOString().split('T')[0],
      status: "cold",
      followUpDate: "",
      remarks: "",
      hospitalType: "Hospital",
      numberOfBeds: "",
      yearOfEstablishment: "",
      ownershipType: "Private",
      medicalSuperintendentName: "",
      adminOfficerName: "",
      directorContactNo: "",
      doctorType: "individual",
      // Hospital fields
      hospitalName: "",
      hospitalAddress: "",
      hospitalPinCode: "",
      regLicenseNo: "",
      hospitalPan: "",
      contactNo: "",
      hospitalWhastApp: "",
      hospitalEmail: "",
    });
    
    setDoctors([{
      doctorName: "", specialty: "", mobile: "", whatsapp: "", qualification: "", email: "",
      hospitalName: "", hospitalAddress: "", hospitalPinCode: "", regLicenseNo: "", hospitalPan: "",
      contactNo: "", hospitalWhastApp: "", hospitalEmail: "",
    }]);
    
    setLinkSpouses(false);

    // ================= NAVIGATION =================
    if (shouldNavigateToQuotation) {
      // Give Quote button click kiye to quotation page pe navigate karo
      const firstDoctorId = createdDoctors[0]?._id;
      if (firstDoctorId) {
        navigate("/sales/add/quotation", {
          state: {
            doctorId: firstDoctorId,
            from: "add-doctor"
          }
        });
      } else {
        navigate('/sales/all-doctors');
      }
    } else {
      // Normal Save button click kiye to doctor list page pe jao
      navigate('/sales/all-doctors');
    }

  } catch (error) {
    console.error("Error creating doctor/hospital:", error);
    toast.error("Error: " + (error.response?.data?.message || error.message || "Unknown error"));
  } finally {
    setLoading(false);
  }
};

  // Reusable Doctor Block
  const renderDoctorBlock = (index) => (
    <div key={index} className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Doctor {index + 1} Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name of Doctor</label>
          <input
            type="text"
            placeholder="Enter Doctor Name"
            value={doctors[index]?.doctorName || ""}
            onChange={(e) => handleDoctorChange(index, 'doctorName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
          <input
            type="text"
            placeholder="Enter Specialty"
            value={doctors[index]?.specialty || ""}
            onChange={(e) => handleDoctorChange(index, 'specialty', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No</label>
          <input
            type="number"
            placeholder="Enter Mobile No"
            value={doctors[index]?.mobile || ""}
            onChange={(e) => {
              if (e.target.value.length <= 10) {
                handleDoctorChange(index, "mobile", e.target.value);
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WA No</label>
          <input
            type="number"
            placeholder="Enter WhatsApp No"
            value={doctors[index]?.whatsapp || ""}
            onChange={(e) => {
              if (e.target.value.length <= 10) {
                handleDoctorChange(index, "whatsapp", e.target.value);
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
          <input
            type="text"
            placeholder="Qualification"
            value={doctors[index]?.qualification || ""}
            onChange={(e) => handleDoctorChange(index, 'qualification', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
          <input
            type="email"
            placeholder="Email"
            value={doctors[index]?.email || ""}
            onChange={(e) => handleDoctorChange(index, 'email', e.target.value.toLowerCase())}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      </div>

      {/* Hospital Details for Individual membership type */}
      {membershipType === "Individual" && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-4">Hospital/Clinic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
              <input
                type="text"
                placeholder="Enter Hospital Name"
                value={doctors[index]?.hospitalName || ""}
                onChange={(e) => handleDoctorChange(index, 'hospitalName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Address</label>
              <input
                type="text"
                placeholder="Enter Hospital Address"
                value={doctors[index]?.hospitalAddress || ""}
                onChange={(e) => handleDoctorChange(index, 'hospitalAddress', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
              <input
                type="number"
                placeholder="6-digit Pin Code"
                value={doctors[index]?.hospitalPinCode || ""}
                onChange={(e) => handleDoctorChange(index, 'hospitalPinCode', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {index === 0 && (
        <div className="flex flex-col">
          <button
            onClick={handleAddDoctor}
            className="mt-6 px-5 py-2 font-medium rounded-md hover:transition flex items-center gap-2 bg-teal-600 text-white hover:bg-teal-700"
          >
            <span className="text-xl">+</span> Add Another Doctor
          </button>

          {(membershipType === 'Individual' || membershipType === 'Hospital + Individual') && doctors.length === 2 && (
            <div className="flex items-center mt-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkSpouses}
                  onChange={(e) => setLinkSpouses(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-teal-600"
                />
                <span className="ml-2 text-gray-700 font-medium">Link as spouses</span>
              </label>
            </div>
          )}

          {(membershipType === 'Individual' || membershipType === 'Hospital + Individual') && doctors.length > 2 && (
            <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-2 rounded">
              Note: Spouse linking is only available for exactly 2 doctors.
            </div>
          )}
        </div>
      )}
      {index > 0 && (
        <button
          onClick={() => {
            const updated = [...doctors];
            updated.splice(index, 1);
            setDoctors(updated);
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Remove Doctor
        </button>
      )}
    </div>
  );

  const renderFullHospitalForm = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Hospital Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
            <input
              type="text"
              placeholder="Enter Hospital Name"
              value={mainFormData.hospitalName || ""}
              onChange={(e) => handleMainFormDataChange(e, 'hospitalName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type of Hospital</label>
            <select
              value={mainFormData.hospitalType}
              onChange={(e) => handleMainFormDataChange(e, 'hospitalType')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option>Maternity Home</option>
              <option>Clinic</option>
              <option>Hospital</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. of Beds</label>
            <input
              type="number"
              placeholder="No. of Beds"
              value={mainFormData.numberOfBeds || ""}
              onChange={(e) => handleMainFormDataChange(e, 'numberOfBeds')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
            <input
              type="number"
              placeholder="Contact No"
              value={mainFormData.contactNo || ""}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  handleMainFormDataChange(e, "contactNo");
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input
              type="number"
              placeholder="WhatsApp"
              value={mainFormData.hospitalWhastApp || ""}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  handleMainFormDataChange(e, "hospitalWhastApp");
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              placeholder="Address"
              value={mainFormData.hospitalAddress || ""}
              onChange={(e) => handleMainFormDataChange(e, 'hospitalAddress')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
            <input
              type="number"
              placeholder="6-digit Pin Code"
              value={mainFormData.hospitalPinCode || ""}
              onChange={(e) => handleMainFormDataChange(e, 'hospitalPinCode')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={mainFormData.hospitalEmail || ""}
              onChange={(e) => handleMainFormDataChange(e, 'hospitalEmail')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin / Mgmt Officer Name</label>
            <input
              type="text"
              placeholder="Admin / Mgmt Officer Name"
              value={mainFormData.adminOfficerName || ""}
              onChange={(e) => handleMainFormDataChange(e, 'adminOfficerName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Contact No</label>
            <input
              type="number"
              placeholder="Admin Contact No"
              value={mainFormData.directorContactNo || ""}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  handleMainFormDataChange(e, "directorContactNo");
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-lato">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MLID</label>
            <input
              type="text"
              placeholder="Enter Membership ID"
              value={mainFormData.mlId}
              onChange={(e) => handleMainFormDataChange(e, 'mlId')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={mainFormData.date}
              onChange={(e) => handleMainFormDataChange(e, 'date')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type of Membership</label>
            <select
              value={membershipType}
              onChange={(e) => {
                setMembershipType(e.target.value);
                if (e.target.value === "Individual") {
                  setDoctors([{ doctorName: "", specialty: "", mobile: "", whatsapp: "", qualification: "", email: "", hospitalName: "", hospitalAddress: "", hospitalPinCode: "", regLicenseNo: "", hospitalPan: "", contactNo: "", hospitalWhastApp: "", hospitalEmail: "" }]);
                  setMainFormData(prev => ({ ...prev, doctorType: "individual" }));
                  setLinkSpouses(false);
                } else if (e.target.value === "Hospital") {
                  setDoctors([{}]);
                  setMainFormData(prev => ({ ...prev, doctorType: "hospital" }));
                  setLinkSpouses(false);
                } else {
                  setDoctors([{ doctorName: "", specialty: "", mobile: "", whatsapp: "", qualification: "", email: "", hospitalName: "", hospitalAddress: "", hospitalPinCode: "", regLicenseNo: "", hospitalPan: "", contactNo: "", hospitalWhastApp: "", hospitalEmail: "" }]);
                  setMainFormData(prev => ({ ...prev, doctorType: "hospital_individual" }));
                  setLinkSpouses(false);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none text-teal-700 font-medium"
            >
              <option value="Individual">Individual</option>
              <option value="Hospital">Hospital</option>
              <option value="Hospital + Individual">Hospital + Individual</option>
            </select>
          </div>
        </div>
      </div>

      {membershipType === "Individual" && (
        <>
          {doctors.map((_, i) => renderDoctorBlock(i))}
        </>
      )}

      {membershipType === "Hospital" && renderFullHospitalForm()}

      {membershipType === "Hospital + Individual" && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Hospital + Individual Membership</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>• Fill hospital details below - they will be shared with all doctors</p>
                  <p>• Add individual doctor details above</p>
                  <p>• Hospital information will be automatically applied to all doctors</p>
                </div>
              </div>
            </div>
          </div>
          {doctors.map((_, i) => renderDoctorBlock(i))}
          {renderFullHospitalForm()}
        </>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Status & Follow-up</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={mainFormData.status}
              onChange={(e) => handleMainFormDataChange(e, 'status')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="hot">Hot</option>

              <option value="cold">Cold</option>
              <option value="close">Close</option>

              <option value="cancel">Cancel (Membership Expired)</option>
              <option value="follow_up">Follow Up</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
            <input
              type="date"
              value={mainFormData.followUpDate}
              onChange={(e) => handleMainFormDataChange(e, 'followUpDate')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Narration / Remarks</label>
            <textarea
              rows={3}
              placeholder="Enter remarks here..."
              value={mainFormData.remarks}
              onChange={(e) => handleMainFormDataChange(e, 'remarks')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => handleSave(false)}
          disabled={loading}
          className={`px-6 py-2 text-white font-medium rounded-md transition ${loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => navigate('/sales/doctor-list')}
          className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSave(true)}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
        >
          Give Quote
        </button>
      </div>
    </div>
  );
};

export default AddDoctorForm;