// import React, { useState, useRef } from 'react';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';

// const EmployeeForm = () => {
//   // ===== FORM STATE =====
//   const [formData, setFormData] = useState({
//     personal: { fullName: '', gender: '', aadhar: '', pan: '' },
//     contact: {
//       phone: '', whatsapp: '', email: '', currentAddress: '', currentPin: '', currentCity: '', currentDistrict: '', currentState: '', currentCountry: '',
//       permanentAddress: '', permanentPin: '', permanentCity: '', permanentDistrict: '', permanentState: '', permanentCountry: '',
//       sameAsAbove: false
//     },
//     family: {
//       fullName: '', relation: '', phone: '', email: '', address: '', pin: '', city: '', district: '', state: '', country: '',
//       sameAsAbove: false
//     },
//     job: { doj: '', role: '', designation: '', empType: '', manager: '', workLocation: '' },
//     bank: { name: '', bankName: '', branch: '', account: '', ifsc: '' },
//     salary: { basicSalary: '', travellingAllowance: '', dailyAllowance: '', mobileExpenses: '', totalSalary: '', incentiveDetails: '' },
//     education: { qualification: '', experience: '', skills: '' },
//     documents: {
//       aadhar: null,
//       pan: null,
//       drivingLicense: null,
//       addressProof: null,
//       fitness: null,
//       paPolicy: { file: null, policyNumber: '', startDate: '', endDate: '' },
//       healthPolicy: { file: null, policyNumber: '', startDate: '', endDate: '' },
//       eduDoc: null,
//       expLetter: null
//     },
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // ===== FILE REFS FOR "Choose File" BUTTON =====
//   const fileRefs = {
//     aadhar: useRef(null),
//     pan: useRef(null),
//     drivingLicense: useRef(null),
//     addressProof: useRef(null),
//     fitness: useRef(null),
//     paPolicy: useRef(null),
//     healthPolicy: useRef(null),
//     eduDoc: useRef(null),
//     expLetter: useRef(null),
//   };

//   // ===== HANDLE INPUT CHANGE =====
//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     const [section, field, subField] = name.split('.');

//     // FILE INPUTS
//     if (type === 'file') {
//       if (section === 'documents' && (field === 'paPolicy' || field === 'healthPolicy')) {
//         setFormData(prev => ({
//           ...prev,
//           documents: {
//             ...prev.documents,
//             [field]: { ...prev.documents[field], file: files[0] }
//           }
//         }));
//       } else {
//         setFormData(prev => ({
//           ...prev,
//           documents: { ...prev.documents, [field]: files[0] }
//         }));
//       }
//       return;
//     }

//     // SELECT / RADIO / CHECKBOX → ORIGINAL VALUE
//     if (type === 'select-one' || type === 'radio' || type === 'checkbox') {
//       const finalValue = type === 'checkbox' ? checked : value;
//       if (subField) {
//         setFormData(prev => ({
//           ...prev,
//           [section]: { ...prev[section], [field]: { ...prev[section][field], [subField]: finalValue } }
//         }));
//       } else {
//         setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: finalValue } }));
//       }
//       return;
//     }

//     // TEXT INPUTS → UPPERCASE (except email)
//     let finalValue = value;
//     const isEmailField = name === 'contact.email' || name === 'family.email' || name.includes('.email');
//     if (!isEmailField) finalValue = value.toUpperCase();

//     if (subField) {
//       setFormData(prev => ({
//         ...prev,
//         [section]: { ...prev[section], [field]: { ...prev[section][field], [subField]: finalValue } }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: finalValue } }));
//     }
//   };

//   // ===== HANDLE SUBMIT =====
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate required fields before submission
//     if (!formData.contact.currentDistrict) {
//       setError('Please select a district for current address');
//       return;
//     }
//     if (!formData.contact.sameAsAbove && !formData.contact.permanentDistrict) {
//       setError('Please select a district for permanent address');
//       return;
//     }
//     if (!formData.family.sameAsAbove && !formData.family.district) {
//       setError('Please select a district for family address');
//       return;
//     }

//     // Validate health/PA policy metadata if files are present
//     if (formData.documents.healthPolicy.file &&
//         (!formData.documents.healthPolicy.policyNumber ||
//          !formData.documents.healthPolicy.startDate ||
//          !formData.documents.healthPolicy.endDate)) {
//       setError('Please fill in all health policy details (number, start date, end date)');
//       return;
//     }

//     if (formData.documents.paPolicy.file &&
//         (!formData.documents.paPolicy.policyNumber ||
//          !formData.documents.paPolicy.startDate ||
//          !formData.documents.paPolicy.endDate)) {
//       setError('Please fill in all PA policy details (number, start date, end date)');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const formDataToSend = new FormData();

//       const payload = {
//         fullName: formData.personal.fullName,
//         phoneNumber: formData.contact.phone,
//         email: formData.contact.email,
//         role: formData.job.role,                    // SIRF ROLE
//         joiningDate: formData.job.doj,
//         status: 'active',

//         personalInfo: {
//           gender: formData.personal.gender.toLowerCase(),
//           aadharCardNumber: formData.personal.aadhar,
//           pan: formData.personal.pan,
//         },

//         contactDetails: {
//           phoneNumber: formData.contact.phone,
//           whatsapp: formData.contact.whatsapp,
//           emailId: formData.contact.email,
//           currentAddress: {
//             address: formData.contact.currentAddress,
//             pinCode: formData.contact.currentPin,
//             city: formData.contact.currentCity,
//             district: formData.contact.currentDistrict || '',
//             state: formData.contact.currentState,
//             country: formData.contact.currentCountry,
//           },
//           permanentAddress: {
//             address: formData.contact.sameAsAbove ? formData.contact.currentAddress : formData.contact.permanentAddress,
//             pinCode: formData.contact.sameAsAbove ? formData.contact.currentPin : formData.contact.permanentPin,
//             city: formData.contact.sameAsAbove ? formData.contact.currentCity : formData.contact.permanentCity,
//             district: formData.contact.sameAsAbove ? (formData.contact.currentDistrict || '') : (formData.contact.permanentDistrict || ''),
//             state: formData.contact.sameAsAbove ? formData.contact.currentState : formData.contact.permanentState,
//             country: formData.contact.sameAsAbove ? formData.contact.currentCountry : formData.contact.permanentCountry,
//             sameAsCurrent: formData.contact.sameAsAbove,
//           },
//         },

//         familyDetails: {
//           fullName: formData.family.fullName,
//           relationWithEmployee: formData.family.relation,
//           phoneNumber: formData.family.phone,
//           email: formData.family.email,
//           address: {
//             address: formData.family.sameAsAbove ? formData.contact.currentAddress : formData.family.address,
//             pinCode: formData.family.sameAsAbove ? formData.contact.currentPin : formData.family.pin,
//             city: formData.family.sameAsAbove ? formData.contact.currentCity : formData.family.city,
//             district: formData.family.sameAsAbove ? (formData.contact.currentDistrict || '') : (formData.family.district || ''),
//             state: formData.family.sameAsAbove ? formData.contact.currentState : formData.family.state,
//             country: formData.family.sameAsAbove ? formData.contact.currentCountry : formData.family.country,
//             sameAsCurrent: formData.family.sameAsAbove,
//           },
//         },

//         jobDetails: {
//           dateOfJoining: formData.job.doj,
//           designation: formData.job.designation,
//           employeeType: formData.job.empType,
//           reportingManager: formData.job.manager,
//           workLocation: formData.job.workLocation,
//         },

//         salaryDetails: {
//           basicSalary: Number(formData.salary.basicSalary) || 0,
//           travellingAllowance: Number(formData.salary.travellingAllowance) || 0,
//           dailyAllowance: Number(formData.salary.dailyAllowance) || 0,
//           mobileExpenses: Number(formData.salary.mobileExpenses) || 0,
//           totalSalary: Number(formData.salary.totalSalary) || 0,
//           incentiveDetails: formData.salary.incentiveDetails,
//         },

//         bankDetails: {
//           nameAsPerBankRecord: formData.bank.name,
//           bankName: formData.bank.bankName,
//           branch: formData.bank.branch,
//           accountNumber: formData.bank.account,
//           ifsc: formData.bank.ifsc,
//         },

//         educationExperience: {
//           qualification: formData.education.qualification,
//           experience: formData.education.experience,
//           skills: formData.education.skills.split(',').map(s => s.trim()).filter(Boolean),
//         },
//       };

//       formDataToSend.append('data', JSON.stringify(payload));

//       // File Mapping
//       const fileMap = {
//         aadhar: 'aadharCard',
//         pan: 'panCard',
//         drivingLicense: 'drivingLicense',
//         addressProof: 'addressProof',
//         fitness: 'fitnessCertificate',
//         eduDoc: 'educationDocument',
//         expLetter: 'experienceLetter',
//       };

//       Object.keys(fileMap).forEach(key => {
//         if (formData.documents[key]) {
//           formDataToSend.append(fileMap[key], formData.documents[key]);
//         }
//       });

//       // PA Policy
//       if (formData.documents.paPolicy.file) {
//         formDataToSend.append('paPolicy', formData.documents.paPolicy.file);
//         formDataToSend.append('paPolicyNumber', formData.documents.paPolicy.policyNumber);
//         formDataToSend.append('paPolicyStartDate', formData.documents.paPolicy.startDate);
//         formDataToSend.append('paPolicyEndDate', formData.documents.paPolicy.endDate);
//       }

//       // Health Policy
//       if (formData.documents.healthPolicy.file) {
//         formDataToSend.append('healthPolicy', formData.documents.healthPolicy.file);
//         formDataToSend.append('healthPolicyNumber', formData.documents.healthPolicy.policyNumber);
//         formDataToSend.append('healthPolicyStartDate', formData.documents.healthPolicy.startDate);
//         formDataToSend.append('healthPolicyEndDate', formData.documents.healthPolicy.endDate);
//       }

//       await apiClient.post(apiEndpoints.employees.create, formDataToSend, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       setSuccess('Employee added successfully!');
//       resetForm();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to add employee');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       personal: { fullName: '', gender: '', aadhar: '', pan: '' },
//       contact: {
//         phone: '', whatsapp: '', email: '', currentAddress: '', currentPin: '', currentCity: '', currentDistrict: '', currentState: '', currentCountry: '',
//         permanentAddress: '', permanentPin: '', permanentCity: '', permanentDistrict: '', permanentState: '', permanentCountry: '',
//         sameAsAbove: false
//       },
//       family: {
//         fullName: '', relation: '', phone: '', email: '', address: '', pin: '', city: '', district: '', state: '', country: '',
//         sameAsAbove: false
//       },
//       job: { doj: '', role: '', designation: '', empType: '', manager: '', workLocation: '' },
//       bank: { name: '', bankName: '', branch: '', account: '', ifsc: '' },
//       salary: { basicSalary: '', travellingAllowance: '', dailyAllowance: '', mobileExpenses: '', totalSalary: '', incentiveDetails: '' },
//       education: { qualification: '', experience: '', skills: '' },
//       documents: {
//         aadhar: null, pan: null, drivingLicense: null, addressProof: null, fitness: null,
//         paPolicy: { file: null, policyNumber: '', startDate: '', endDate: '' },
//         healthPolicy: { file: null, policyNumber: '', startDate: '', endDate: '' },
//         eduDoc: null, expLetter: null
//       },
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold mb-6 text-black">Add Employee</h2>

//       {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
//       {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

//       <form onSubmit={handleSubmit}>
//         {/* Personal Information */}
//         <h3 className="text-lg font-semibold mb-4 text-black">Personal Information :</h3>
//         <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-32 text-sm font-medium mb-1 sm:mb-0 text-black">Full Name :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="personal.fullName"
//                 value={formData.personal.fullName}
//                 onChange={handleChange}
//                 placeholder="Enter full name"
//                 required
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-20 text-sm font-medium mb-1 sm:mb-0 text-black">Gender :</label>
//               <div className="flex gap-4 ml-0 sm:ml-2">
//                 <label className="flex items-center text-sm text-black">
//                   <input type="radio" name="personal.gender" value="Male" checked={formData.personal.gender === 'Male'} onChange={handleChange} className="mr-2 text-teal-600 focus:ring-teal-500" required /> Male
//                 </label>
//                 <label className="flex items-center text-sm text-black">
//                   <input type="radio" name="personal.gender" value="Female" checked={formData.personal.gender === 'Female'} onChange={handleChange} className="mr-2 text-teal-600 focus:ring-teal-500" required /> Female
//                 </label>
//               </div>
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-32 text-sm font-medium mb-1 sm:mb-0 text-[#000000]">Aadhar Card Number:</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="personal.aadhar"
//                 value={formData.personal.aadhar}
//                 onChange={handleChange}
//                 placeholder="Enter Aadhar number"
//                 required
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-20 text-sm font-medium mb-1 sm:mb-0 text-#000000">PAN:</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="personal.pan"
//                 value={formData.personal.pan}
//                 onChange={handleChange}
//                 placeholder="Enter PAN number"
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         {/* Employment Contact Details */}
//         <h3 className="text-lg font-semibold mb-4 text-[#000000]">Employment Contact Details :</h3>
//         <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="sm:w-25 text-sm mb-1 md:mr-4 sm:mb-0 text-[#000000]">Phone Number :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.phone"
//                 value={formData.contact.phone}
//                 onChange={handleChange}
//                 placeholder="Enter phone number"
//                 required
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-20 text-sm mb-1 sm:mb-0 text-[#000000]">WhatsApp :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.whatsapp"
//                 value={formData.contact.whatsapp}
//                 onChange={handleChange}
//                 placeholder="Enter WhatsApp number"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
//               <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Email ID :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.email"
//                 value={formData.contact.email}
//                 onChange={handleChange}
//                 placeholder="Enter email ID"
//                 required
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
//               <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Current Address:</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full sm:w-auto rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.currentAddress"
//                 value={formData.contact.currentAddress}
//                 onChange={handleChange}
//                 placeholder="Enter current address"
//                 required
//               />
//               <label className="w-full sm:w-20 text-sm ml-0 sm:ml-4 mt-2 sm:mt-0 mb-1 sm:mb-0 text-[#000000]">Pin code:</label>
//               <input
//                 className="border border-gray-300 p-2 w-full sm:w-24 text-sm rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.currentPin"
//                 value={formData.contact.currentPin}
//                 onChange={handleChange}
//                 placeholder="Enter pin code"
//                 required
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">City :</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.currentCity"
//                 value={formData.contact.currentCity}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select City</option>
//                 <option value="Mumbai">Mumbai</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Bangalore">Bangalore</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">District:</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.currentDistrict"
//                 value={formData.contact.currentDistrict}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select District</option>
//                 <option value="Mumbai">Mumbai</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Bangalore">Bangalore</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">State:</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.currentState"
//                 value={formData.contact.currentState}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select State</option>
//                 <option value="Maharashtra">Maharashtra</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Karnataka">Karnataka</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Country:</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.currentCountry"
//                 value={formData.contact.currentCountry}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Country</option>
//                 <option value="India">India</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
//               <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Permanent Address:</label>
//               <label className="flex items-center text-sm ml-0 sm:ml-4 mb-1 sm:mb-0 text-[#000000]">
//                 <input type="checkbox" name="contact.sameAsAbove" checked={formData.contact.sameAsAbove} onChange={handleChange} className="mr-2 text-teal-600 focus:ring-teal-500" /> Same as above
//               </label>
//               <label className="w-full sm:w-20 text-sm ml-0 sm:ml-8 mt-2 sm:mt-0 mb-1 sm:mb-0 text-[#000000]">Pin code:</label>
//               <input
//                 className="border border-gray-300 p-2 w-full sm:w-24 text-sm rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.permanentPin"
//                 value={formData.contact.permanentPin}
//                 onChange={handleChange}
//                 placeholder="Enter pin code"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">City :</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.permanentCity"
//                 value={formData.contact.permanentCity}
//                 onChange={handleChange}
//               >
//                 <option value="">Select City</option>
//                 <option value="Mumbai">Mumbai</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Bangalore">Bangalore</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">District:</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.permanentDistrict"
//                 value={formData.contact.permanentDistrict}
//                 onChange={handleChange}
//                 required={!formData.contact.sameAsAbove} // Only required if not same as current
//               >
//                 <option value="">Select District</option>
//                 <option value="Mumbai">Mumbai</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Bangalore">Bangalore</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">State:</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.permanentState"
//                 value={formData.contact.permanentState}
//                 onChange={handleChange}
//               >
//                 <option value="">Select State</option>
//                 <option value="Maharashtra">Maharashtra</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Karnataka">Karnataka</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Country:</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="contact.permanentCountry"
//                 value={formData.contact.permanentCountry}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Country</option>
//                 <option value="India">India</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Family Details */}
//         <h3 className="text-lg font-semibold mb-4 text-[#000000]">Family Details :</h3>
//         <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Full Name :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="family.fullName"
//                 value={formData.family.fullName}
//                 onChange={handleChange}
//                 placeholder="Enter full name"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Relation With Employee:</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="family.relation"
//                 value={formData.family.relation}
//                 onChange={handleChange}
//                 placeholder="Enter relation"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="sm:w-25 text-sm mb-1 md:mr-8 sm:mb-0 text-[#000000]">Phone No :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="family.phone"
//                 value={formData.family.phone}
//                 onChange={handleChange}
//                 placeholder="Enter phone number"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Email:</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="family.email"
//                 value={formData.family.email}
//                 onChange={handleChange}
//                 placeholder="Enter email"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
//               <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Address:</label>
//               <label className="flex items-center text-sm ml-0 sm:ml-4 mb-1 sm:mb-0 text-[#000000]">
//                 <input type="checkbox" name="family.sameAsAbove" checked={formData.family.sameAsAbove} onChange={handleChange} className="mr-2 text-teal-600 focus:ring-teal-500" /> Same as above
//               </label>
//               <label className="w-full sm:w-20 text-sm ml-0 sm:ml-8 mt-2 sm:mt-0 mb-1 sm:mb-0 text-[#000000]">Pin code:</label>
//               <input
//                 className="border border-gray-300 p-2 w-full sm:w-24 text-sm rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="family.pin"
//                 value={formData.family.pin}
//                 onChange={handleChange}
//                 placeholder="Enter pin code"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">City :</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="family.city"
//                 value={formData.family.city}
//                 onChange={handleChange}
//               >
//                 <option value="">Select City</option>
//                 <option value="Mumbai">Mumbai</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Bangalore">Bangalore</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">District:</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="family.district"
//                 value={formData.family.district}
//                 onChange={handleChange}
//                 required={!formData.family.sameAsAbove} // Only required if not same as current address
//               >
//                 <option value="">Select District</option>
//                 <option value="Mumbai">Mumbai</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Bangalore">Bangalore</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">State:</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="family.state"
//                 value={formData.family.state}
//                 onChange={handleChange}
//               >
//                 <option value="">Select State</option>
//                 <option value="Maharashtra">Maharashtra</option>
//                 <option value="Delhi">Delhi</option>
//                 <option value="Karnataka">Karnataka</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Country:</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="family.country"
//                 value={formData.family.country}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Country</option>
//                 <option value="India">India</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Job Details */}
//         <h3 className="text-lg font-semibold mb-4 text-[#000000]">Job Details :</h3>
//         <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="sm:w-25 text-sm mb-1 md:mr-2 sm:mb-0 text-[#000000]">Date Of Joining :</label>
//               <input
//                 type="date"
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="job.doj"
//                 value={formData.job.doj}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* ROLE DROPDOWN */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-20 text-sm mb-1 sm:mb-0 text-[#000000]">Role:</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="job.role"
//                 value={formData.job.role}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Role</option>
//                 <option value="salesman">Salesman</option>
//                 <option value="telecaller">Telecaller</option>
//                 <option value  = "admin">Admin User</option>
//               </select>
//             </div>

//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Designation:</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="job.designation"
//                 value={formData.job.designation}
//                 onChange={handleChange}
//                 placeholder="Enter designation"
//                 required
//               />
//             </div>

//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Employee Type:</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="job.empType"
//                 value={formData.job.empType}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="Permanent">Permanent</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Temporary">Temporary</option>
//               </select>
//             </div>

//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Reporting Manager :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="job.manager"
//                 value={formData.job.manager}
//                 onChange={handleChange}
//                 placeholder="Enter manager name"
//                 required
//               />
//             </div>

//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Work Location:</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="job.workLocation"
//                 value={formData.job.workLocation}
//                 onChange={handleChange}
//                 placeholder="Enter location"
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         {/* Salary Details */}
//         <h3 className="text-lg font-semibold mb-4 text-[#000000]">Salary Details :</h3>
//         <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="sm:w-25 text-sm mb-1 md:mr-2 sm:mb-0 text-[#000000]">Basic Salary :</label>
//               <input
//                 type="number"
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="salary.basicSalary"
//                 value={formData.salary.basicSalary}
//                 onChange={handleChange}
//                 placeholder="Enter basic salary"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Travelling Allowance :</label>
//               <input
//                 type="number"
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="salary.travellingAllowance"
//                 value={formData.salary.travellingAllowance}
//                 onChange={handleChange}
//                 placeholder="Enter travelling allowance"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Daily Allowance :</label>
//               <input
//                 type="number"
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="salary.dailyAllowance"
//                 value={formData.salary.dailyAllowance}
//                 onChange={handleChange}
//                 placeholder="Enter daily allowance"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Mobile Expenses :</label>
//               <input
//                 type="number"
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="salary.mobileExpenses"
//                 value={formData.salary.mobileExpenses}
//                 onChange={handleChange}
//                 placeholder="Enter mobile expenses"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Total Salary :</label>
//               <input
//                 type="number"
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="salary.totalSalary"
//                 value={formData.salary.totalSalary}
//                 onChange={handleChange}
//                 placeholder="Enter total salary"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Incentive Details :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="salary.incentiveDetails"
//                 value={formData.salary.incentiveDetails}
//                 onChange={handleChange}
//                 placeholder="Enter incentive details"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Bank Details */}
//         <h3 className="text-lg font-semibold mb-4 text-[#000000]">Bank Details :</h3>
//         <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
//               <label className="sm:w-42 text-sm mb-1 md:mr-2 sm:mb-0 text-[#000000]">Name As Per Bank Record :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="bank.name"
//                 value={formData.bank.name}
//                 onChange={handleChange}
//                 placeholder="Enter name as per bank"
//                 required
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Bank Name :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="bank.bankName"
//                 value={formData.bank.bankName}
//                 onChange={handleChange}
//                 placeholder="Enter bank name"
//                 required
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Branch :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="bank.branch"
//                 value={formData.bank.branch}
//                 onChange={handleChange}
//                 placeholder="Enter branch"
//                 required
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-28 text-sm mb-1 sm:mb-0 text-[#000000]">Account Number :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="bank.account"
//                 value={formData.bank.account}
//                 onChange={handleChange}
//                 placeholder="Enter account number"
//                 required
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">IFSC :</label>
//               <select
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="bank.ifsc"
//                 value={formData.bank.ifsc}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select IFSC</option>
//                 <option value="SBIN0000123">SBIN0000123</option>
//                 <option value="HDFC0000456">HDFC0000456</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Education & Experience */}
//         <h3 className="text-lg font-semibold mb-4 text-[#000000]">Education & Experience :</h3>
//         <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
//           <div className="space-y-4">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Qualification :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="education.qualification"
//                 value={formData.education.qualification}
//                 onChange={handleChange}
//                 placeholder="Enter qualification"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Experience :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="education.experience"
//                 value={formData.education.experience}
//                 onChange={handleChange}
//                 placeholder="Enter experience (years)"
//               />
//             </div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center">
//               <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Skills :</label>
//               <input
//                 className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 name="education.skills"
//                 value={formData.education.skills}
//                 onChange={handleChange}
//                 placeholder="Enter skills"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Upload Documents */}
//      {/* Upload Documents */}
// <h3 className="text-lg font-semibold mb-4 text-[#000000]">Upload Documents :</h3>
// <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
//   <div className="space-y-4">
//     {[
//       { key: 'aadhar', label: 'Aadhar Card :' },
//       { key: 'pan', label: 'PAN Card :' },
//       { key: 'drivingLicense', label: 'Driving License :' },
//       { key: 'addressProof', label: 'Address Proof :' },
//       { key: 'fitness', label: 'Fitness Certificate :' },
//       { key: 'paPolicy', label: 'PA Policy :' },
//       { key: 'healthPolicy', label: 'Health Policy :' },
//       { key: 'eduDoc', label: 'Education Document :' },
//       { key: 'expLetter', label: 'Experience Letter :' }
//     ].map(doc => (
//       <div key={doc.key} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
//         <label className="w-full sm:w-36 text-sm mb-1 sm:mb-0 text-[#000000]">{doc.label}</label>

//         <button
//           type="button"
//           className="border border-gray-300 bg-gray-100 px-4 py-2 text-sm rounded-md hover:bg-gray-200 w-full sm:w-auto transition-colors"
//           onClick={() => fileRefs[doc.key].current?.click()}
//         >
//           Choose File
//         </button>
//         <input
//           ref={fileRefs[doc.key]}
//           id={`file-${doc.key}`}
//           type="file"
//           name={doc.key === 'paPolicy' || doc.key === 'healthPolicy' ? `documents.${doc.key}.file` : `documents.${doc.key}`}
//           onChange={handleChange}
//           className="hidden"
//         />

//         {/* Fixed File Name Display */}
//         <span className="text-sm text-[#000000] w-full sm:w-auto truncate">
//           {(() => {
//             const docData = formData.documents[doc.key];
//             if (doc.key === 'paPolicy' || doc.key === 'healthPolicy') {
//               return docData?.file?.name || 'No File Chosen';
//             }
//             return docData?.name || 'No File Chosen';
//           })()}
//         </span>

//         {/* PA & Health Policy Extra Fields */}
//         {(doc.key === 'paPolicy' || doc.key === 'healthPolicy') && (
//           <div className="flex flex-col gap-2 mt-2 w-full">
//             {formData.documents[doc.key]?.file && (
//               <>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
//                   <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Policy Number:</label>
//                   <input
//                     className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                     name={`documents.${doc.key}.policyNumber`}
//                     value={formData.documents[doc.key].policyNumber || ''}
//                     onChange={handleChange}
//                     placeholder="Enter policy number"
//                     required
//                   />
//                 </div>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
//                   <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Start Date:</label>
//                   <input
//                     type="date"
//                     className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                     name={`documents.${doc.key}.startDate`}
//                     value={formData.documents[doc.key].startDate || ''}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
//                   <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">End Date:</label>
//                   <input
//                     type="date"
//                     className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                     name={`documents.${doc.key}.endDate`}
//                     value={formData.documents[doc.key].endDate || ''}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </>
//             )}
//             {/* Show a note when no file is selected for health/PA policy */}
//             {!formData.documents[doc.key]?.file && (
//               <div className="text-sm text-gray-500 mt-1">
//                 {doc.key === 'healthPolicy'
//                   ? 'Upload file to enter health policy details'
//                   : 'Upload file to enter PA policy details'}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     ))}
//   </div>
// </div>

//         {/* Buttons */}
//         <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-green-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 w-full sm:w-auto"
//           >
//             {loading ? 'Saving...' : 'Save'}
//           </button>
//           <button
//             type="button"
//             className="bg-red-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-red-700 w-full sm:w-auto"
//             onClick={resetForm}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EmployeeForm;

























import React, { useState, useRef, useEffect } from 'react';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from "react-toastify";
import DateInput from '../../../components/DateInput/DateInput';
import LocationInput from '../../../components/LocationInput';

const EmployeeForm = () => {
  // ===== FORM STATE =====
  const [formData, setFormData] = useState({
    personal: { fullName: '', gender: '', aadhar: '', pan: '' },
    contact: {
      phone: '', whatsapp: '', email: '', currentAddress: '', currentPin: '', currentCity: '', currentDistrict: '', currentState: '', currentCountry: '',
      permanentAddress: '', permanentPin: '', permanentCity: '', permanentDistrict: '', permanentState: '', permanentCountry: '',
      sameAsAbove: false
    },
    family: {
      fullName: '', relation: '', phone: '', email: '', address: '', pin: '', city: '', district: '', state: '', country: '',
      sameAsAbove: false
    },
    job: { doj: '', department: '', role: '', designation: '', empType: '', manager: '', workLocation: '' },
    bank: { name: '', bankName: '', branch: '', account: '', ifsc: '' },
    salary: { basicSalary: '', travellingAllowance: '', dailyAllowance: '', mobileExpenses: '', totalSalary: '', incentiveDetails: '' },
    education: { qualification: '', experience: '', skills: '' },
    documents: {
      aadhar: null,
      pan: null,
      drivingLicense: null,
      addressProof: null,
      fitness: null,
      paPolicy: { file: null, policyNumber: '', startDate: '', endDate: '' },
      healthPolicy: { file: null, policyNumber: '', startDate: '', endDate: '' },
      eduDoc: null,
      expLetter: null
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRefs = {
    aadhar: useRef(null), pan: useRef(null), drivingLicense: useRef(null), addressProof: useRef(null),
    fitness: useRef(null), paPolicy: useRef(null), healthPolicy: useRef(null), eduDoc: useRef(null), expLetter: useRef(null),
  };

  // ===== AUTO CALCULATE TOTAL SALARY =====
  useEffect(() => {
    const basic = parseFloat(formData.salary.basicSalary) || 0;
    const travelling = parseFloat(formData.salary.travellingAllowance) || 0;
    const daily = parseFloat(formData.salary.dailyAllowance) || 0;
    const mobile = parseFloat(formData.salary.mobileExpenses) || 0;

    const total = basic + travelling + daily + mobile;

    setFormData(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        totalSalary: total > 0 ? total.toString() : ''
      }
    }));
  }, [formData.salary.basicSalary, formData.salary.travellingAllowance, formData.salary.dailyAllowance, formData.salary.mobileExpenses]);


  // ===== VALIDATION FUNCTIONS =====
  const validateForm = () => {
    const newErrors = {};

    // Personal Information Validations
    if (!formData.personal.fullName.trim()) {
      newErrors.personal = { ...newErrors.personal, fullName: 'Full name is required' };
    }

    if (!formData.personal.gender) {
      newErrors.personal = { ...newErrors.personal, gender: 'Gender is required' };
    }

    // Aadhar validation: 12 digits only
    const aadharRegex = /^\d{12}$/;
    if (!formData.personal.aadhar) {
      newErrors.personal = { ...newErrors.personal, aadhar: 'Aadhar number is required' };
    } else if (!aadharRegex.test(formData.personal.aadhar)) {
      newErrors.personal = { ...newErrors.personal, aadhar: 'Aadhar must be exactly 12 digits' };
    }

    // PAN validation: AAAAA1234F format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!formData.personal.pan) {
      newErrors.personal = { ...newErrors.personal, pan: 'PAN number is required' };
    } else if (!panRegex.test(formData.personal.pan)) {
      newErrors.personal = { ...newErrors.personal, pan: 'PAN must be in AAAAA1234F format' };
    }

    // Contact Details Validations
    const phoneRegex = /^\d{10}$/;
    if (!formData.contact.phone) {
      newErrors.contact = { ...newErrors.contact, phone: 'Phone number is required' };
    } else if (!phoneRegex.test(formData.contact.phone)) {
      newErrors.contact = { ...newErrors.contact, phone: 'Phone must be 10 digits' };
    }

    if (formData.contact.whatsapp && !phoneRegex.test(formData.contact.whatsapp)) {
      newErrors.contact = { ...newErrors.contact, whatsapp: 'WhatsApp must be 10 digits' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.contact.email) {
      newErrors.contact = { ...newErrors.contact, email: 'Email is required' };
    } else if (!emailRegex.test(formData.contact.email)) {
      newErrors.contact = { ...newErrors.contact, email: 'Invalid email format' };
    }

    if (!formData.contact.currentAddress.trim()) {
      newErrors.contact = { ...newErrors.contact, currentAddress: 'Current address is required' };
    }

    const pinRegex = /^\d{6}$/;
    if (!formData.contact.currentPin) {
      newErrors.contact = { ...newErrors.contact, currentPin: 'PIN code is required' };
    } else if (!pinRegex.test(formData.contact.currentPin)) {
      newErrors.contact = { ...newErrors.contact, currentPin: 'PIN must be 6 digits' };
    }

    if (!formData.contact.currentCity) {
      newErrors.contact = { ...newErrors.contact, currentCity: 'City is required' };
    }

    if (!formData.contact.currentState) {
      newErrors.contact = { ...newErrors.contact, currentState: 'State is required' };
    }

    if (!formData.contact.currentCountry) {
      newErrors.contact = { ...newErrors.contact, currentCountry: 'Country is required' };
    }

    // Permanent address validations when not same as current
    if (!formData.contact.sameAsAbove) {
      if (!formData.contact.permanentAddress.trim()) {
        newErrors.contact = { ...newErrors.contact, permanentAddress: 'Permanent address is required' };
      }
      if (!formData.contact.permanentPin) {
        newErrors.contact = { ...newErrors.contact, permanentPin: 'PIN code is required' };
      } else if (!pinRegex.test(formData.contact.permanentPin)) {
        newErrors.contact = { ...newErrors.contact, permanentPin: 'PIN must be 6 digits' };
      }
      if (!formData.contact.permanentCity) {
        newErrors.contact = { ...newErrors.contact, permanentCity: 'City is required' };
      }
      if (!formData.contact.permanentState) {
        newErrors.contact = { ...newErrors.contact, permanentState: 'State is required' };
      }
      if (!formData.contact.permanentCountry) {
        newErrors.contact = { ...newErrors.contact, permanentCountry: 'Country is required' };
      }
    }

    // Family phone validation
    if (formData.family.phone && !phoneRegex.test(formData.family.phone)) {
      newErrors.family = { ...newErrors.family, phone: 'Phone must be 10 digits' };
    }

    // Family email validation
    if (formData.family.email && !emailRegex.test(formData.family.email)) {
      newErrors.family = { ...newErrors.family, email: 'Invalid email format' };
    }

    // Family address validations when not same as current
    if (!formData.family.sameAsAbove) {
      if (formData.family.address && !formData.family.address.trim()) {
        newErrors.family = { ...newErrors.family, address: 'Address is required' };
      }
      if (formData.family.pin && !pinRegex.test(formData.family.pin)) {
        newErrors.family = { ...newErrors.family, pin: 'PIN must be 6 digits' };
      }
    }

    // Job Details Validations
    if (!formData.job.doj) {
      newErrors.job = { ...newErrors.job, doj: 'Date of joining is required' };
    }

    if (!formData.job.department) {
      newErrors.job = { ...newErrors.job, department: 'Department is required' };
    }

    if (!formData.job.role) {
      newErrors.job = { ...newErrors.job, role: 'Role is required' };
    }

    if (!formData.job.designation.trim()) {
      newErrors.job = { ...newErrors.job, designation: 'Designation is required' };
    }

    if (!formData.job.empType) {
      newErrors.job = { ...newErrors.job, empType: 'Employee type is required' };
    }

    if (!formData.job.manager.trim()) {
      newErrors.job = { ...newErrors.job, manager: 'Reporting manager is required' };
    }

    if (!formData.job.workLocation.trim()) {
      newErrors.job = { ...newErrors.job, workLocation: 'Work location is required' };
    }

    // Bank Details Validations
    if (!formData.bank.name.trim()) {
      newErrors.bank = { ...newErrors.bank, name: 'Bank account name is required' };
    }

    if (!formData.bank.bankName.trim()) {
      newErrors.bank = { ...newErrors.bank, bankName: 'Bank name is required' };
    }

    if (!formData.bank.branch.trim()) {
      newErrors.bank = { ...newErrors.bank, branch: 'Branch is required' };
    }

    const accountRegex = /^\d{9,18}$/;
    if (!formData.bank.account) {
      newErrors.bank = { ...newErrors.bank, account: 'Account number is required' };
    } else if (!accountRegex.test(formData.bank.account)) {
      newErrors.bank = { ...newErrors.bank, account: 'Account number must be 9-18 digits' };
    }

    if (!formData.bank.ifsc) {
      newErrors.bank = { ...newErrors.bank, ifsc: 'IFSC code is required' };
    }

    // Salary Validations - numbers only
    const numberRegex = /^\d*\.?\d*$/;
    if (formData.salary.basicSalary && !numberRegex.test(formData.salary.basicSalary)) {
      newErrors.salary = { ...newErrors.salary, basicSalary: 'Must be a valid number' };
    }
    if (formData.salary.travellingAllowance && !numberRegex.test(formData.salary.travellingAllowance)) {
      newErrors.salary = { ...newErrors.salary, travellingAllowance: 'Must be a valid number' };
    }
    if (formData.salary.dailyAllowance && !numberRegex.test(formData.salary.dailyAllowance)) {
      newErrors.salary = { ...newErrors.salary, dailyAllowance: 'Must be a valid number' };
    }
    if (formData.salary.mobileExpenses && !numberRegex.test(formData.salary.mobileExpenses)) {
      newErrors.salary = { ...newErrors.salary, mobileExpenses: 'Must be a valid number' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== HANDLE INPUT CHANGE =====
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const [section, field, subField] = name.split('.');

    // Clear error when user starts typing
    if (errors[section]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: undefined }
      }));
    }

    // FILE INPUTS
    if (type === 'file') {
      if (section === 'documents' && (field === 'paPolicy' || field === 'healthPolicy')) {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [field]: { ...prev.documents[field], file: files[0] }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          documents: { ...prev.documents, [field]: files[0] }
        }));
      }
      return;
    }

    // Handle "Same as above" checkboxes
    if (name === 'contact.sameAsAbove') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          contact: {
            ...prev.contact,
            sameAsAbove: true,
            permanentAddress: prev.contact.currentAddress,
            permanentPin: prev.contact.currentPin,
            permanentCity: prev.contact.currentCity,
            permanentDistrict: prev.contact.currentDistrict,
            permanentState: prev.contact.currentState,
            permanentCountry: prev.contact.currentCountry,
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          contact: {
            ...prev.contact,
            sameAsAbove: false,
            permanentAddress: '',
            permanentPin: '',
            permanentCity: '',
            permanentDistrict: '',
            permanentState: '',
            permanentCountry: '',
          }
        }));
      }
      return;
    }

    if (name === 'family.sameAsAbove') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          family: {
            ...prev.family,
            sameAsAbove: true,
            address: prev.contact.currentAddress,
            pin: prev.contact.currentPin,
            city: prev.contact.currentCity,
            district: prev.contact.currentDistrict,
            state: prev.contact.currentState,
            country: prev.contact.currentCountry,
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          family: {
            ...prev.family,
            sameAsAbove: false,
            address: '',
            pin: '',
            city: '',
            district: '',
            state: '',
            country: '',
          }
        }));
      }
      return;
    }

    // SELECT / RADIO / CHECKBOX → ORIGINAL VALUE
    if (type === 'select-one' || type === 'radio' || type === 'checkbox') {
      const finalValue = type === 'checkbox' ? checked : value;
      if (subField) {
        setFormData(prev => ({
          ...prev,
          [section]: { ...prev[section], [field]: { ...prev[section][field], [subField]: finalValue } }
        }));
      } else {
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: finalValue } }));
      }
      return;
    }

    // INPUT VALIDATION AND FORMATTING
    let finalValue = value;

    // Phone number validation (only digits, max 10)
    if (name.includes('.phone') || name.includes('.whatsapp')) {
      finalValue = value.replace(/\D/g, '').slice(0, 10);
    }
    // Aadhar validation (only digits, max 12)
    else if (name === 'personal.aadhar') {
      finalValue = value.replace(/\D/g, '').slice(0, 12);
    }
    // PAN validation (uppercase, alphanumeric, max 10)
    else if (name === 'personal.pan') {
      finalValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
    }
    // PIN code validation (only digits, max 6)
    else if (name.includes('.Pin') || name.includes('.pin')) {
      finalValue = value.replace(/\D/g, '').slice(0, 6);
    }
    // Bank account (only digits)
    else if (name === 'bank.account') {
      finalValue = value.replace(/\D/g, '');
    }
    // Salary fields (only numbers and decimal)
    // else if (name.includes('salary.')) {
    //   finalValue = value.replace(/[^\d.]/g, '');
    //   // Ensure only one decimal point
    //   const decimalCount = (finalValue.match(/\./g) || []).length;
    //   if (decimalCount > 1) {
    //     finalValue = finalValue.substring(0, finalValue.lastIndexOf('.'));
    //   }
    // }

    // Salary fields ko number banao, lekin incentiveDetails ko mat chhedo
    else if (name.includes('salary.') && !name.includes('incentiveDetails')) {
      finalValue = value.replace(/[^\d.]/g, '');
      // Ensure only one decimal point
      const decimalCount = (finalValue.match(/\./g) || []).length;
      if (decimalCount > 1) {
        finalValue = finalValue.substring(0, finalValue.lastIndexOf('.'));
      }
    }


    // Uppercase for most fields except email
    else if (!name.includes('.email')) {
      finalValue = value.toUpperCase();
    }

    if (subField) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: { ...prev[section][field], [subField]: finalValue } }
      }));
    } else {
      setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: finalValue } }));
    }
  };

  // ===== HANDLE SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      const payload = {
        fullName: formData.personal.fullName,
        phoneNumber: formData.contact.phone,
        email: formData.contact.email,
        role: formData.job.role,
        department: formData.job.department,
        joiningDate: formData.job.doj,
        status: 'active',

        personalInfo: {
          gender: formData.personal.gender.toLowerCase(),
          aadharCardNumber: formData.personal.aadhar,
          pan: formData.personal.pan,
        },

        contactDetails: {
          phoneNumber: formData.contact.phone,
          whatsapp: formData.contact.whatsapp,
          emailId: formData.contact.email,
          currentAddress: {
            address: formData.contact.currentAddress,
            pinCode: formData.contact.currentPin,
            city: formData.contact.currentCity,
            district: formData.contact.currentDistrict || '',
            state: formData.contact.currentState,
            country: formData.contact.currentCountry,
          },
          permanentAddress: {
            address: formData.contact.sameAsAbove ? formData.contact.currentAddress : formData.contact.permanentAddress,
            pinCode: formData.contact.sameAsAbove ? formData.contact.currentPin : formData.contact.permanentPin,
            city: formData.contact.sameAsAbove ? formData.contact.currentCity : formData.contact.permanentCity,
            district: formData.contact.sameAsAbove ? (formData.contact.currentDistrict || '') : (formData.contact.permanentDistrict || ''),
            state: formData.contact.sameAsAbove ? formData.contact.currentState : formData.contact.permanentState,
            country: formData.contact.sameAsAbove ? formData.contact.currentCountry : formData.contact.permanentCountry,
            sameAsCurrent: formData.contact.sameAsAbove,
          },
        },

        familyDetails: {
          fullName: formData.family.fullName,
          relationWithEmployee: formData.family.relation,
          phoneNumber: formData.family.phone,
          email: formData.family.email,
          address: {
            address: formData.family.sameAsAbove ? formData.contact.currentAddress : formData.family.address,
            pinCode: formData.family.sameAsAbove ? formData.contact.currentPin : formData.family.pin,
            city: formData.family.sameAsAbove ? formData.contact.currentCity : formData.family.city,
            district: formData.family.sameAsAbove ? (formData.contact.currentDistrict || '') : (formData.family.district || ''),
            state: formData.family.sameAsAbove ? formData.contact.currentState : formData.family.state,
            country: formData.family.sameAsAbove ? formData.contact.currentCountry : formData.family.country,
            sameAsCurrent: formData.family.sameAsAbove,
          },
        },

        jobDetails: {
          dateOfJoining: formData.job.doj,
          department: formData.job.department,
          designation: formData.job.designation,
          employeeType: formData.job.empType,
          reportingManager: formData.job.manager,
          workLocation: formData.job.workLocation,
        },

        salaryDetails: {
          basicSalary: Number(formData.salary.basicSalary) || 0,
          travellingAllowance: Number(formData.salary.travellingAllowance) || 0,
          dailyAllowance: Number(formData.salary.dailyAllowance) || 0,
          mobileExpenses: Number(formData.salary.mobileExpenses) || 0,
          totalSalary: Number(formData.salary.totalSalary) || 0,
          incentiveDetails: formData.salary.incentiveDetails,
        },

        bankDetails: {
          nameAsPerBankRecord: formData.bank.name,
          bankName: formData.bank.bankName,
          branch: formData.bank.branch,
          accountNumber: formData.bank.account,
          ifsc: formData.bank.ifsc,
        },

        educationExperience: {
          qualification: formData.education.qualification,
          experience: formData.education.experience,
          skills: formData.education.skills.split(',').map(s => s.trim()).filter(Boolean),
        },
      };

      formDataToSend.append('data', JSON.stringify(payload));

      // File Mapping
      const fileMap = {
        aadhar: 'aadharCard',
        pan: 'panCard',
        drivingLicense: 'drivingLicense',
        addressProof: 'addressProof',
        fitness: 'fitnessCertificate',
        eduDoc: 'educationDocument',
        expLetter: 'experienceLetter',
      };

      Object.keys(fileMap).forEach(key => {
        if (formData.documents[key]) {
          formDataToSend.append(fileMap[key], formData.documents[key]);
        }
      });

      // PA Policy
      if (formData.documents.paPolicy.file) {
        formDataToSend.append('paPolicy', formData.documents.paPolicy.file);
        formDataToSend.append('paPolicyNumber', formData.documents.paPolicy.policyNumber);
        formDataToSend.append('paPolicyStartDate', formData.documents.paPolicy.startDate);
        formDataToSend.append('paPolicyEndDate', formData.documents.paPolicy.endDate);
      }

      // Health Policy
      if (formData.documents.healthPolicy.file) {
        formDataToSend.append('healthPolicy', formData.documents.healthPolicy.file);
        formDataToSend.append('healthPolicyNumber', formData.documents.healthPolicy.policyNumber);
        formDataToSend.append('healthPolicyStartDate', formData.documents.healthPolicy.startDate);
        formDataToSend.append('healthPolicyEndDate', formData.documents.healthPolicy.endDate);
      }

      await apiClient.post(apiEndpoints.employees.create, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Employee added successfully!');
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      personal: { fullName: '', gender: '', aadhar: '', pan: '' },
      contact: {
        phone: '', whatsapp: '', email: '', currentAddress: '', currentPin: '', currentCity: '', currentDistrict: '', currentState: '', currentCountry: '',
        permanentAddress: '', permanentPin: '', permanentCity: '', permanentDistrict: '', permanentState: '', permanentCountry: '',
        sameAsAbove: false
      },
      family: {
        fullName: '', relation: '', phone: '', email: '', address: '', pin: '', city: '', district: '', state: '', country: '',
        sameAsAbove: false
      },
      job: { doj: '', department: '', role: '', designation: '', empType: '', manager: '', workLocation: '' },
      bank: { name: '', bankName: '', branch: '', account: '', ifsc: '' },
      salary: { basicSalary: '', travellingAllowance: '', dailyAllowance: '', mobileExpenses: '', totalSalary: '', incentiveDetails: '' },
      education: { qualification: '', experience: '', skills: '' },
      documents: {
        aadhar: null, pan: null, drivingLicense: null, addressProof: null, fitness: null,
        paPolicy: { file: null, policyNumber: '', startDate: '', endDate: '' },
        healthPolicy: { file: null, policyNumber: '', startDate: '', endDate: '' },
        eduDoc: null, expLetter: null
      },
    });
    setErrors({});
  };

  // Helper function to render error message
  const renderError = (section, field) => {
    return errors[section]?.[field] ? (
      <span className="text-red-500 text-xs mt-1 block">{errors[section][field]}</span>
    ) : null;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-black">Add Employee</h2>

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <h3 className="text-lg font-semibold mb-4 text-black">Personal Information :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm font-medium mb-1 sm:mb-0 text-black">Full Name :</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.personal?.fullName ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="personal.fullName"
                  value={formData.personal.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
                {renderError('personal', 'fullName')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm font-medium mb-1 sm:mb-0 text-black">Gender :</label>
              <div className="flex flex-col">
                <div className="flex gap-4 ml-0 sm:ml-2">
                  <label className="flex items-center text-sm text-black">
                    <input type="radio" name="personal.gender" value="Male" checked={formData.personal.gender === 'Male'} onChange={handleChange} className="mr-2 text-teal-600 focus:ring-teal-500" required /> Male
                  </label>
                  <label className="flex items-center text-sm text-black">
                    <input type="radio" name="personal.gender" value="Female" checked={formData.personal.gender === 'Female'} onChange={handleChange} className="mr-2 text-teal-600 focus:ring-teal-500" required /> Female
                  </label>
                </div>
                {renderError('personal', 'gender')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm font-medium mb-1 sm:mb-0 text-[#000000]">Aadhar Card Number:</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.personal?.aadhar ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="personal.aadhar"
                  value={formData.personal.aadhar}
                  onChange={handleChange}
                  placeholder="Enter 12-digit Aadhar"
                  maxLength="12"
                  required
                />
                {renderError('personal', 'aadhar')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm font-medium mb-1 sm:mb-0 text-#000000">PAN:</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.personal?.pan ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="personal.pan"
                  value={formData.personal.pan}
                  onChange={handleChange}
                  placeholder="Enter PAN (AAAAA1234F)"
                  maxLength="10"
                  required
                />
                {renderError('personal', 'pan')}
              </div>
            </div>
          </div>
        </div>

        {/* Employment Contact Details */}
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Employment Contact Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-4 sm:mb-0 text-[#000000]">Phone Number :</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.contact?.phone ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone"
                  maxLength="10"
                  required
                />
                {renderError('contact', 'phone')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm mb-1 sm:mb-0 text-[#000000]">WhatsApp :</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.contact?.whatsapp ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="contact.whatsapp"
                  value={formData.contact.whatsapp}
                  onChange={handleChange}
                  placeholder="Enter 10-digit WhatsApp"
                  maxLength="10"
                />
                {renderError('contact', 'whatsapp')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Email ID :</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.contact?.email ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleChange}
                  placeholder="Enter email ID"
                  type="email"
                  required
                />
                {renderError('contact', 'email')}
              </div>
            </div>

            {/* Current Address Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Current Address:</label>
              <div className="flex-1">
                <input
                  className={`border ${errors.contact?.currentAddress ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full sm:w-auto rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="contact.currentAddress"
                  value={formData.contact.currentAddress}
                  onChange={handleChange}
                  placeholder="Enter current address"
                  required
                />
                {renderError('contact', 'currentAddress')}
              </div>
              <label className="w-full sm:w-20 text-sm ml-0 sm:ml-4 mt-2 sm:mt-0 mb-1 sm:mb-0 text-[#000000]">Pin code:</label>
              <div className="w-full sm:w-24">
                <input
                  className={`border ${errors.contact?.currentPin ? 'border-red-500' : 'border-gray-300'} p-2 w-full text-sm rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="contact.currentPin"
                  value={formData.contact.currentPin}
                  onChange={handleChange}
                  placeholder="6-digit PIN"
                  maxLength="6"
                  required
                />
                {renderError('contact', 'currentPin')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">City :</label>
              <div className="flex-1 w-full">
                <LocationInput
                  type="city"
                  className={`border ${errors.contact?.currentCity ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="contact.currentCity"
                  value={formData.contact.currentCity}
                  onChange={(value) => setFormData(prev => ({
                    ...prev,
                    contact: { ...prev.contact, currentCity: value }
                  }))}
                  required
                />
                {renderError('contact', 'currentCity')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">District:</label>
              <div className="flex-1 w-full">
                <LocationInput
                  type="district"
                  className={`border ${errors.contact?.currentDistrict ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="contact.currentDistrict"
                  value={formData.contact.currentDistrict}
                  onChange={(value) => setFormData(prev => ({
                    ...prev,
                    contact: { ...prev.contact, currentDistrict: value }
                  }))}
                />
                {renderError('contact', 'currentDistrict')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">State:</label>
              <div className="flex-1 w-full">
                <LocationInput
                  type="state"
                  className={`border ${errors.contact?.currentState ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="contact.currentState"
                  value={formData.contact.currentState}
                  onChange={(value) => setFormData(prev => ({
                    ...prev,
                    contact: { ...prev.contact, currentState: value }
                  }))}
                  required
                />
                {renderError('contact', 'currentState')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Country:</label>
              <div className="flex-1 w-full">
                <select
                  className={`border ${errors.contact?.currentCountry ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="contact.currentCountry"
                  value={formData.contact.currentCountry}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                </select>
                {renderError('contact', 'currentCountry')}
              </div>
            </div>

            {/* Permanent Address Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Permanent Address:</label>
              <label className="flex items-center text-sm ml-0 sm:ml-4 mb-1 sm:mb-0 text-[#000000]">
                <input type="checkbox" name="contact.sameAsAbove" checked={formData.contact.sameAsAbove} onChange={handleChange} className="mr-2 text-teal-600 focus:ring-teal-500" /> Same as above
              </label>
            </div>

            {!formData.contact.sameAsAbove && (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
                  <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Permanent Address:</label>
                  <div className="flex-1">
                    <input
                      className={`border ${errors.contact?.permanentAddress ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full sm:w-auto rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                      name="contact.permanentAddress"
                      value={formData.contact.permanentAddress}
                      onChange={handleChange}
                      placeholder="Enter permanent address"
                      required
                    />
                    {renderError('contact', 'permanentAddress')}
                  </div>
                  <label className="w-full sm:w-20 text-sm ml-0 sm:ml-4 mt-2 sm:mt-0 mb-1 sm:mb-0 text-[#000000]">Pin code:</label>
                  <div className="w-full sm:w-24">
                    <input
                      className={`border ${errors.contact?.permanentPin ? 'border-red-500' : 'border-gray-300'} p-2 w-full text-sm rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                      name="contact.permanentPin"
                      value={formData.contact.permanentPin}
                      onChange={handleChange}
                      placeholder="6-digit PIN"
                      maxLength="6"
                      required
                    />
                    {renderError('contact', 'permanentPin')}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">City :</label>
                  <div className="flex-1 w-full">
                    <LocationInput
                      type="city"
                      className={`border ${errors.contact?.permanentCity ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                      name="contact.permanentCity"
                      value={formData.contact.permanentCity}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, permanentCity: value }
                      }))}
                      required
                    />
                    {renderError('contact', 'permanentCity')}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">District:</label>
                  <div className="flex-1 w-full">
                    <LocationInput
                      type="district"
                      className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      name="contact.permanentDistrict"
                      value={formData.contact.permanentDistrict}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, permanentDistrict: value }
                      }))}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">State:</label>
                  <div className="flex-1 w-full">
                    <LocationInput
                      type="state"
                      className={`border ${errors.contact?.permanentState ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                      name="contact.permanentState"
                      value={formData.contact.permanentState}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, permanentState: value }
                      }))}
                      required
                    />
                    {renderError('contact', 'permanentState')}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Country:</label>
                  <div className="flex-1 w-full">
                    <select
                      className={`border ${errors.contact?.permanentCountry ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                      name="contact.permanentCountry"
                      value={formData.contact.permanentCountry}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                    </select>
                    {renderError('contact', 'permanentCountry')}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Family Details */}
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Family Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Full Name :</label>
              <div className="flex-1 w-full">
                <input
                  className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  name="family.fullName"
                  value={formData.family.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Relation With Employee:</label>
              <div className="flex-1 w-full">
                <input
                  className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  name="family.relation"
                  value={formData.family.relation}
                  onChange={handleChange}
                  placeholder="Enter relation"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-8 sm:mb-0 text-[#000000]">Phone No :</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.family?.phone ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="family.phone"
                  value={formData.family.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  maxLength="10"
                />
                {renderError('family', 'phone')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Email:</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.family?.email ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="family.email"
                  value={formData.family.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  type="email"
                />
                {renderError('family', 'email')}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Address:</label>
              <label className="flex items-center text-sm ml-0 sm:ml-4 mb-1 sm:mb-0 text-[#000000]">
                <input type="checkbox" name="family.sameAsAbove" checked={formData.family.sameAsAbove} onChange={handleChange} className="mr-2 text-teal-600 focus:ring-teal-500" /> Same as above
              </label>
            </div>

            {!formData.family.sameAsAbove && (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
                  <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Address:</label>
                  <div className="flex-1">
                    <input
                      className={`border ${errors.family?.address ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full sm:w-auto rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                      name="family.address"
                      value={formData.family.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                    />
                    {renderError('family', 'address')}
                  </div>
                  <label className="w-full sm:w-20 text-sm ml-0 sm:ml-4 mt-2 sm:mt-0 mb-1 sm:mb-0 text-[#000000]">Pin code:</label>
                  <div className="w-full sm:w-24">
                    <input
                      className={`border ${errors.family?.pin ? 'border-red-500' : 'border-gray-300'} p-2 w-full text-sm rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                      name="family.pin"
                      value={formData.family.pin}
                      onChange={handleChange}
                      placeholder="6-digit PIN"
                      maxLength="6"
                    />
                    {renderError('family', 'pin')}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">City :</label>
                  <div className="flex-1 w-full">
                    <LocationInput
                      type="city"
                      className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      name="family.city"
                      value={formData.family.city}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        family: { ...prev.family, city: value }
                      }))}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">District:</label>
                  <div className="flex-1 w-full">
                    <LocationInput
                      type="district"
                      className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      name="family.district"
                      value={formData.family.district}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        family: { ...prev.family, district: value }
                      }))}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">State:</label>
                  <div className="flex-1 w-full">
                    <LocationInput
                      type="state"
                      className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      name="family.state"
                      value={formData.family.state}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        family: { ...prev.family, state: value }
                      }))}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Country:</label>
                  <div className="flex-1 w-full">
                    <select
                      className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      name="family.country"
                      value={formData.family.country}
                      onChange={handleChange}
                    >
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Job Details */}
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Job Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-2 sm:mb-0 text-[#000000]">Date Of Joining :</label>
              <div className="flex-1 w-full">
                <DateInput
                  // type="date"
                  className={`border ${errors.job?.doj ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="job.doj"
                  value={formData.job.doj}
                  onChange={handleChange}
                  required
                  returnFormat='yyyy-mm-dd'
                />
                {renderError('job', 'doj')}
              </div>
            </div>

            {/* DEPARTMENT DROPDOWN */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Department:</label>
              <div className="flex-1 w-full">
                <select
                  className={`border ${errors.job?.department ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="job.department"
                  value={formData.job.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Office Administration">Office Administration</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Medicolegal Department">Medicolegal Department</option>
                  <option value="Service Department">Service Department</option>
                  <option value="A/C & Finance">A/C & Finance</option>
                </select>
                {renderError('job', 'department')}
              </div>
            </div>

            {/* ROLE DROPDOWN */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-20 text-sm mb-1 sm:mb-0 text-[#000000]">Role:</label>
              <div className="flex-1 w-full">
                <select
                  className={`border ${errors.job?.role ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="job.role"
                  value={formData.job.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="salesman">Salesman</option>
                  <option value="telecaller">Telecaller</option>
                  <option value="admin">Admin User</option>
                </select>
                {renderError('job', 'role')}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Designation:</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.job?.designation ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="job.designation"
                  value={formData.job.designation}
                  onChange={handleChange}
                  placeholder="Enter designation"
                  required
                />
                {renderError('job', 'designation')}
              </div>
            </div>

            {/* EMPLOYEE TYPE DROPDOWN */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Employee Type:</label>
              <div className="flex-1 w-full">
                <select
                  className={`border ${errors.job?.empType ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="job.empType"
                  value={formData.job.empType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship / Trainee">Internship / Trainee</option>
                  <option value="Commision Based">Commision Based</option>
                  <option value="Consultant / Advisor">Consultant / Advisor</option>
                </select>
                {renderError('job', 'empType')}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Reporting Manager :</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.job?.manager ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="job.manager"
                  value={formData.job.manager}
                  onChange={handleChange}
                  placeholder="Enter manager name"
                  required
                />
                {renderError('job', 'manager')}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Work Location:</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.job?.workLocation ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="job.workLocation"
                  value={formData.job.workLocation}
                  onChange={handleChange}
                  placeholder="Enter location"
                  required
                />
                {renderError('job', 'workLocation')}
              </div>
            </div>
          </div>
        </div>

        {/* Salary Details */}
        {/* <h3 className="text-lg font-semibold mb-4 text-[#000000]">Salary Details :</h3> */}
        {/* <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-2 sm:mb-0 text-[#000000]">Basic Salary :</label>
              <div className="flex-1 w-full">
                <input
                  type="number"
                  className={`border ${errors.salary?.basicSalary ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="salary.basicSalary"
                  value={formData.salary.basicSalary}
                  onChange={handleChange}
                  placeholder="Enter basic salary"
                />
                {renderError('salary', 'basicSalary')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Travelling Allowance :</label>
              <div className="flex-1 w-full">
                <input
                  type="number"
                  className={`border ${errors.salary?.travellingAllowance ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="salary.travellingAllowance"
                  value={formData.salary.travellingAllowance}
                  onChange={handleChange}
                  placeholder="Enter travelling allowance"
                />
                {renderError('salary', 'travellingAllowance')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Daily Allowance :</label>
              <div className="flex-1 w-full">
                <input
                  type="number"
                  className={`border ${errors.salary?.dailyAllowance ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="salary.dailyAllowance"
                  value={formData.salary.dailyAllowance}
                  onChange={handleChange}
                  placeholder="Enter daily allowance"
                />
                {renderError('salary', 'dailyAllowance')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Mobile Expenses :</label>
              <div className="flex-1 w-full">
                <input
                  type="number"
                  className={`border ${errors.salary?.mobileExpenses ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="salary.mobileExpenses"
                  value={formData.salary.mobileExpenses}
                  onChange={handleChange}
                  placeholder="Enter mobile expenses"
                />
                {renderError('salary', 'mobileExpenses')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Total Salary :</label>
              <div className="flex-1 w-full">
                <input
                  type="number"
                  className="border border-gray-300 bg-gray-100 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  name="salary.totalSalary"
                  value={formData.salary.totalSalary}
                  readOnly
                  placeholder="Auto-calculated"
                />
                <span className="text-xs text-gray-500 mt-1 block">Auto-calculated from above fields</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Incentive Details :</label>
              <div className="flex-1 w-full">
                <input
                  className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  name="salary.incentiveDetails"
                  value={formData.salary.incentiveDetails}
                  onChange={handleChange}
                  placeholder="Enter incentive details"
                />
              </div>
            </div>
          </div>
        </div> */}

        {/* Salary Details */}
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Salary Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="sm:w-25 text-sm mb-1 md:mr-2 sm:mb-0 text-[#000000]">Basic Salary :</label>
              <div className="flex-1 w-full">
                <input
                  type="number"
                  className={`border ${errors.salary?.basicSalary ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="salary.basicSalary"
                  value={formData.salary.basicSalary}
                  onChange={handleChange}
                  placeholder="Enter basic salary"
                />
                {renderError('salary', 'basicSalary')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Travelling Allowance :</label>
              <div className="flex-1 w-full">
                <input
                  type="number"
                  className={`border ${errors.salary?.travellingAllowance ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="salary.travellingAllowance"
                  value={formData.salary.travellingAllowance}
                  onChange={handleChange}
                  placeholder="Enter travelling allowance"
                />
                {renderError('salary', 'travellingAllowance')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Daily Allowance :</label>
              <div className="flex-1 w-full">
                <input
                  type="number"
                  className={`border ${errors.salary?.dailyAllowance ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="salary.dailyAllowance"
                  value={formData.salary.dailyAllowance}
                  onChange={handleChange}
                  placeholder="Enter daily allowance"
                />
                {renderError('salary', 'dailyAllowance')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Mobile Expenses :</label>
              <div className="flex-1 w-full">
                <input
                  type="number"
                  className={`border ${errors.salary?.mobileExpenses ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="salary.mobileExpenses"
                  value={formData.salary.mobileExpenses}
                  onChange={handleChange}
                  placeholder="Enter mobile expenses"
                />
                {renderError('salary', 'mobileExpenses')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Total Salary :</label>
              <div className="flex-1 w-full">
                <input
                  type="number"
                  className="border border-gray-300 bg-gray-100 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  name="salary.totalSalary"
                  value={formData.salary.totalSalary}
                  readOnly
                  placeholder="Auto-calculated"
                />
                <span className="text-xs text-gray-500 mt-1 block">Auto-calculated from above fields</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="w-full sm:w-32 text-sm mb-1 sm:mb-0 text-[#000000]">Incentive Details :</label>
              <div className="flex-1 w-full">
                <input
                  type="text"
                  className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  name="salary.incentiveDetails"
                  value={formData.salary.incentiveDetails}
                  onChange={handleChange}
                  placeholder="Enter incentive details"
                />
              </div>
            </div>
          </div>
        </div>





        {/* Bank Details */}
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Bank Details :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center col-span-1 sm:col-span-2">
              <label className="sm:w-42 text-sm mb-1 md:mr-2 sm:mb-0 text-[#000000]">Name As Per Bank Record :</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.bank?.name ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="bank.name"
                  value={formData.bank.name}
                  onChange={handleChange}
                  placeholder="Enter name as per bank"
                  required
                />
                {renderError('bank', 'name')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Bank Name :</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.bank?.bankName ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="bank.bankName"
                  value={formData.bank.bankName}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  required
                />
                {renderError('bank', 'bankName')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-16 text-sm mb-1 sm:mb-0 text-[#000000]">Branch :</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.bank?.branch ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="bank.branch"
                  value={formData.bank.branch}
                  onChange={handleChange}
                  placeholder="Enter branch"
                  required
                />
                {renderError('bank', 'branch')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-28 text-sm mb-1 sm:mb-0 text-[#000000]">Account Number :</label>
              <div className="flex-1 w-full">
                <input
                  className={`border ${errors.bank?.account ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="bank.account"
                  value={formData.bank.account}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  required
                />
                {renderError('bank', 'account')}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-12 text-sm mb-1 sm:mb-0 text-[#000000]">IFSC :</label>
              <div className="flex-1 w-full">
                <input
                  type="text"
                  className={`border ${errors.bank?.ifsc ? 'border-red-500' : 'border-gray-300'} p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  name="bank.ifsc"
                  value={formData.bank.ifsc}
                  onChange={handleChange}
                  placeholder="Enter IFSC code"
                  required
                />
                {renderError('bank', 'ifsc')}
              </div>
            </div>
          </div>
        </div>

        {/* Education & Experience */}
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Education & Experience :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Qualification :</label>
              <input
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                name="education.qualification"
                value={formData.education.qualification}
                onChange={handleChange}
                placeholder="Enter qualification"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Experience :</label>
              <input
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                name="education.experience"
                value={formData.education.experience}
                onChange={handleChange}
                placeholder="Enter experience (years)"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Skills :</label>
              <input
                className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                name="education.skills"
                value={formData.education.skills}
                onChange={handleChange}
                placeholder="Enter skills"
              />
            </div>
          </div>
        </div>

        {/* Upload Documents */}
        <h3 className="text-lg font-semibold mb-4 text-[#000000]">Upload Documents :</h3>
        <div className="border border-gray-300 mb-6 p-4 sm:p-6 rounded-lg">
          <div className="space-y-4">
            {[
              { key: 'aadhar', label: 'Aadhar Card :' },
              { key: 'pan', label: 'PAN Card :' },
              { key: 'drivingLicense', label: 'Driving License :' },
              { key: 'addressProof', label: 'Address Proof :' },
              { key: 'fitness', label: 'Fitness Certificate :' },
              { key: 'paPolicy', label: 'PA Policy :' },
              { key: 'healthPolicy', label: 'Health Policy :' },
              { key: 'eduDoc', label: 'Education Document :' },
              { key: 'expLetter', label: 'Experience Letter :' }
            ].map(doc => (
              <div key={doc.key} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label className="w-full sm:w-36 text-sm mb-1 sm:mb-0 text-[#000000]">{doc.label}</label>

                <button
                  type="button"
                  className="border border-gray-300 bg-gray-100 px-4 py-2 text-sm rounded-md hover:bg-gray-200 w-full sm:w-auto transition-colors"
                  onClick={() => fileRefs[doc.key].current?.click()}
                >
                  Choose File
                </button>
                <input
                  ref={fileRefs[doc.key]}
                  id={`file-${doc.key}`}
                  type="file"
                  name={doc.key === 'paPolicy' || doc.key === 'healthPolicy' ? `documents.${doc.key}.file` : `documents.${doc.key}`}
                  onChange={handleChange}
                  className="hidden"
                />

                {/* Fixed File Name Display */}
                <span className="text-sm text-[#000000] w-full sm:w-auto truncate">
                  {(() => {
                    const docData = formData.documents[doc.key];
                    if (doc.key === 'paPolicy' || doc.key === 'healthPolicy') {
                      return docData?.file?.name || 'No File Chosen';
                    }
                    return docData?.name || 'No File Chosen';
                  })()}
                </span>

                {/* PA & Health Policy Extra Fields */}
                {(doc.key === 'paPolicy' || doc.key === 'healthPolicy') && formData.documents[doc.key]?.file && (
                  <div className="flex flex-col gap-2 mt-2 w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Policy Number:</label>
                      <input
                        className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        name={`documents.${doc.key}.policyNumber`}
                        value={formData.documents[doc.key].policyNumber || ''}
                        onChange={handleChange}
                        placeholder="Enter policy number"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">Start Date:</label>
                      <DateInput
                        // type="date"
                        className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        name={`documents.${doc.key}.startDate`}
                        value={formData.documents[doc.key].startDate || ''}
                        maxDate={`documents.${doc.key}.endDate`}
                        onChange={handleChange}
                        returnFormat='yyyy-mm-dd'
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <label className="w-full sm:w-24 text-sm mb-1 sm:mb-0 text-[#000000]">End Date:</label>
                      <DateInput
                        // type="date"
                        className="border border-gray-300 p-2 flex-1 text-sm w-full rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        name={`documents.${doc.key}.endDate`}
                        value={formData.documents[doc.key].endDate || ''}
                        minDate={`documents.${doc.key}.startDate`}
                        onChange={handleChange}
                        returnFormat='yyyy-mm-dd'
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 w-full sm:w-auto"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            className="bg-red-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-red-700 w-full sm:w-auto"
            onClick={resetForm}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;