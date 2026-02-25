

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import apiClient from "../../../services/apiClient";
// import Select from "react-select"; // ✅ React-select import

// const CreateQueryCase = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const editData = location.state?.editData; // Get edit data if navigated from edit button
//   const isEditMode = !!editData; // Check if we're in edit mode

//   const [formData, setFormData] = useState({
//     // Doctor Details
//     doctorName: "",
//     doctorId: "",
//     caseNo: "",
//     queryType: "",
//     caseType: "",
//     subType: "",
//     queryDescription: "",

//     // Patient Details
//     patientName: "",
//     ageGender: "",
//     contactNo: "",
//     address: "",

//     // Opponent Details
//     opponentName: "",
//     relation: "",
//     opponentType: "",
//     opponentContact: "",
//     opponentEmail: "",
//     opponentAddress: "",

//     // Additional
//     caseStage: "",
//     tags: "",
//   });

//   const [doctors, setDoctors] = useState([]);
//   const [doctorOptions, setDoctorOptions] = useState([]); // ✅ React-select ke liye options
//   const [selectedDoctorId, setSelectedDoctorId] = useState(""); // Track selected doctor ID
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // ✅ Custom styles for react-select
//   const customSelectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: "38px",
//       borderColor: state.isFocused ? "#398C89" : "#d1d5db",
//       backgroundColor: "white",
//       boxShadow: state.isFocused ? "0 0 0 1px #398C89" : "none",
//       "&:hover": {
//         borderColor: "#398C89",
//       },
//     }),
//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isSelected ? "#398C89" : state.isFocused ? "#e6f7f7" : "white",
//       color: state.isSelected ? "white" : "#333",
//       "&:active": {
//         backgroundColor: "#2e706e",
//       },
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 50,
//     }),
//     placeholder: (base) => ({
//       ...base,
//       color: "#9ca3af",
//       fontSize: "14px",
//     }),
//     singleValue: (base) => ({
//       ...base,
//       color: "#1f2937",
//       fontSize: "14px",
//     }),
//   };

//   // Load edit data if in edit mode
//   useEffect(() => {
//     if (editData) {
//       console.log('Edit data received:', editData); // Debug log

//       setFormData({
//         doctorName: editData.doctorName || "",
//         doctorId: editData.doctorId || "",
//         caseNo: editData.caseNo || "",
//         queryType: editData.queryType || "",
//         caseType: editData.caseType || "",
//         subType: editData.subType || "",
//         queryDescription: editData.queryDescription || editData.originalQuery || "",
//         patientName: editData.patientName || editData.patient || "",
//         ageGender: editData.ageGender || "",
//         contactNo: editData.contactNo || "",
//         address: editData.address || "",
//         opponentName: editData.opponentName || editData.opponent || "",
//         relation: editData.relation || "",
//         opponentType: editData.opponentType || "",
//         opponentContact: editData.opponentContact || "",
//         opponentEmail: editData.opponentEmail || "",
//         opponentAddress: editData.opponentAddress || "",
//         caseStage: editData.caseStage || editData.status || "",
//         tags: Array.isArray(editData.tags) ? editData.tags.join(', ') : (editData.tags || ""),
//       });

//       console.log('Form data set:', {
//         doctorName: editData.doctorName,
//         patientName: editData.patientName || editData.patient,
//         opponentName: editData.opponentName || editData.opponent,
//         queryDescription: editData.queryDescription || editData.originalQuery
//       }); // Debug log
//     }
//   }, [editData]);

//   // Fetch doctors whose typeOfEnquiry is "closed"
//   const fetchClosedEnquiryDoctors = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await apiClient.get('/doctors', {
//         params: {
//           typeOfEnquiry: 'closed',
//           limit: 100 // Limit to 100 results to avoid too many options
//         }
//       });

//       const doctorsData = response.data.data || [];
//       setDoctors(doctorsData);
      
//       // ✅ Convert doctors to react-select options format
//       const options = doctorsData.map((doctor) => ({
//         value: doctor._id,
//         label: `${doctor.fullName} (ID: ${doctor.doctorId})`,
//         doctorData: doctor,
//       }));
      
//       setDoctorOptions(options);
//     } catch (err) {
//       console.error('Error fetching doctors:', err);
//       setError('Failed to fetch doctors with closed enquiries');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClosedEnquiryDoctors();
//   }, []);

//   // Set selected doctor ID when doctors are loaded and we're in edit mode
//   useEffect(() => {
//     if (editData && doctorOptions.length > 0 && formData.doctorName) {
//       // Find the doctor by name or doctorId
//       const matchingDoctor = doctors.find(
//         (doc) => doc.fullName === formData.doctorName || doc.doctorId === formData.doctorId
//       );

//       if (matchingDoctor) {
//         setSelectedDoctorId(matchingDoctor._id);
//         console.log('Selected doctor set:', matchingDoctor.fullName, matchingDoctor._id);
//       } else {
//         console.log('No matching doctor found for:', formData.doctorName, formData.doctorId);
//       }
//     }
//   }, [doctors, editData, formData.doctorName, formData.doctorId, doctorOptions]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Handle doctor selection from react-select
//   const handleDoctorSelect = (selectedOption) => {
//     if (!selectedOption) {
//       // Reset if doctor is cleared
//       setSelectedDoctorId("");
//       setFormData(prev => ({
//         ...prev,
//         doctorName: "",
//         doctorId: ""
//       }));
//       return;
//     }

//     const doctorId = selectedOption.value;
//     setSelectedDoctorId(doctorId);

//     const selectedDoctor = doctors.find(doctor => doctor._id === doctorId);
//     if (selectedDoctor) {
//       setFormData(prev => ({
//         ...prev,
//         doctorName: selectedDoctor.fullName,
//         doctorId: selectedDoctor.doctorId
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Prepare the data to be sent to the API
//       const queryCaseData = {
//         doctorName: formData.doctorName,
//         doctorId: formData.doctorId,
//         caseNo: formData.caseNo,
//         queryType: formData.queryType,
//         caseType: formData.caseType,
//         subType: formData.subType,
//         queryDescription: formData.queryDescription,

//         patientName: formData.patientName,
//         ageGender: formData.ageGender,
//         contactNo: formData.contactNo,
//         address: formData.address,

//         opponentName: formData.opponentName,
//         relation: formData.relation,
//         opponentType: formData.opponentType,
//         opponentContact: formData.opponentContact,
//         opponentEmail: formData.opponentEmail,
//         opponentAddress: formData.opponentAddress,

//         caseStage: formData.caseStage,
//         tags: formData.tags,
//       };

//       let response;
//       if (isEditMode) {
//         // Update existing query case
//         response = await apiClient.put(`/query-cases/${editData._id}`, queryCaseData);
//       } else {
//         // Create new query case
//         response = await apiClient.post('/query-cases', queryCaseData);
//       }

//       if (response.data.success) {
//         alert(isEditMode ? "Case updated successfully!" : "Case created successfully!");
//         navigate(-1); // Go back to previous page
//       } else {
//         alert(`Failed to ${isEditMode ? 'update' : 'create'} case. Please try again.`);
//       }
//     } catch (error) {
//       console.error(`Error ${isEditMode ? 'updating' : 'creating'} query case:`, error);
//       alert(`Error ${isEditMode ? 'updating' : 'creating'} case: ${error.response?.data?.message || error.message || 'Please try again'}`);
//     }
//   };

//   return (
//     <div className="max-w-[85vw] mx-auto  p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditMode ? 'Edit case' : 'Add new case'}</h2>

//       <form onSubmit={handleSubmit} className="space-y-8">

//         {/* Doctor Details */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-3">Doctor Details</h3>

//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
//               {error}
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1  ">
//                 <div>
//                   <p className="flex gap-[5px] items-center">
//                     <p>Doctor Name</p> <span className="text-red-700">*</span>
//                   </p>
//                 </div>
//               </label>
              
//               {/* ✅ React-select Implementation */}
//               <Select
//                 name="doctorName"
//                 options={doctorOptions}
//                 value={doctorOptions.find(option => option.value === selectedDoctorId) || null}
//                 onChange={handleDoctorSelect}
//                 isLoading={loading}
//                 loadingMessage={() => "Loading doctors..."}
//                 placeholder="Select doctor "
//                 isSearchable={true}
//                 isClearable={true}
//                 noOptionsMessage={() => "No doctors found"}
//                 styles={customSelectStyles}
//                 className="react-select-container"
//                 classNamePrefix="react-select"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Doctor ID</label>
//               <input
//                 type="text"
//                 name="doctorId"
//                 value={formData.doctorId}
//                 onChange={handleChange}
//                 placeholder="e.g. D-1024"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 readOnly
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Case No</label>
//               <input
//                 type="text"
//                 name="caseNo"
//                 value={formData.caseNo}
//                 onChange={handleChange}
//                 placeholder="e.g. C-2025-001"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                
                
//               />
//             </div>

//             <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Query Type <span className="text-red-600"> *</span>
//                 </label>
//                 <select
//                   name="queryType"
//                   value={formData.queryType}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 >
//                   <option value="">Select </option>
//                   <option>Medicolegal Issue</option>
//                   <option>Bill Recovery</option>
//                   <option>Consent Issue</option>
//                   <option>Insurance Dispute</option>
//                   <option>Legal Consulting</option>
//                   <option>Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Case Type </label>
//                 <select
//                   name="caseType"
//                   value={formData.caseType}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 >
//                   <option value="">--</option>
//                   <option>Civil</option>
//                   <option>Criminal</option>
//                   <option>Consumer</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Sub Type </label>
//                 <select
//                   name="subType"
//                   value={formData.subType}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 >
//                   <option value="">--</option>
//                   <option>Property Dispute</option>
//                   <option>Recovery Suit</option>
//                   <option>Medical Negligence</option>
//                   <option>IPC 138</option>
//                   <option>BNS 165</option>
//                   <option>Unfair Fraud(e) Practice</option>
//                   <option>Other</option>
//                 </select>
//               </div>
//             </div>

//             <div className="lg:col-span-4">
//               <label className="block text-sm font-medium text-gray-600 mb-1">Query Description </label>
//               <textarea
//                 name="queryDescription"
//                 value={formData.queryDescription}
//                 onChange={handleChange}
//                 placeholder="Short description..."
//                 rows={3}
//                 className="w-full p-3 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>
//           </div>
//         </div>

//         <hr className="border-gray-300" />

//         {/* Patient Details */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-3">Patient Details </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Patient Name <span className="text-red-600"> </span>
//               </label>
//               <input
//                 type="text"
//                 name="patientName"
//                 value={formData.patientName}
//                 onChange={handleChange}
//                 placeholder="Patient full name"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Age | Gender </label>
//               <input
//                 type="text"
//                 name="ageGender"
//                 value={formData.ageGender}
//                 onChange={handleChange}
//                 placeholder="e.g. 47 | M"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Contact No </label>
//               <input
//                 type="text"
//                 name="contactNo"
//                 value={formData.contactNo}
//                 onChange={handleChange}
//                 placeholder="10-digit mobile"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>

//             <div className="lg:col-span-4">
//               <label className="block text-sm font-medium text-gray-600 mb-1">Address </label>
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 placeholder="F1 Flat / Street / City / PIN"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>
//           </div>
//         </div>

//         <hr className="border-gray-300" />

//         {/* Opponent Party Details */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-3">Opponent Party Details </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Opponent Name</label>
//               <input
//                 type="text"
//                 name="opponentName"
//                 value={formData.opponentName}
//                 onChange={handleChange}
//                 placeholder="Name"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Relation with Patient </label>
//               <select
//                 name="relation"
//                 value={formData.relation}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               >
//                 <option value="">--</option>
//                 <option>Self</option>
//                 <option>Spouse</option>
//                 <option>Parent</option>
//                 <option>Child</option>
//                 <option>Sibling</option>
//                 <option>Other Relative</option>
//                 <option>Attendant / Caregiver</option>
//                 <option>Legal Heir</option>
//                 <option>Not Applicable</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Opponent Type </label>
//               <select
//                 name="opponentType"
//                 value={formData.opponentType}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               >
//                 <option value="">--</option>
//                 <option>Patient</option>
//                 <option>Relative</option>
//                 <option>Insurance Company</option>
//                 <option>Advocate</option>
//                 <option>NGO / Trust</option>
//                 <option>Government</option>
//                 <option>Other</option>
//               </select>
//             </div>

//             <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Contact </label>
//                 <input
//                   type="text"
//                   name="opponentContact"
//                   value={formData.opponentContact}
//                   onChange={handleChange}
//                   placeholder="Phone / Email"
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Email </label>
//                 <input
//                   type="email"
//                   name="opponentEmail"
//                   value={formData.opponentEmail}
//                   onChange={handleChange}
//                   placeholder="opponent@example.com"
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Address </label>
//                 <input
//                   type="text"
//                   name="opponentAddress"
//                   value={formData.opponentAddress}
//                   onChange={handleChange}
//                   placeholder="Address"
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <hr className="border-gray-300" />

//         {/* Additional */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-3">Additional (optional)</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Case Stage</label>
//               <select
//                 name="caseStage"
//                 value={formData.caseStage}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               >
//                 <option value="">--</option>
//                 <option>Query Raised</option>
//                 <option>Legal Consultation</option>
//                 <option>Expert Opinion</option>
//                 <option>Referred to Civil Surgeon</option>
//                 <option>Show Cause Notice</option>
//                 <option>Notice Received</option>
//                 <option>Notice Replied</option>
//                 <option>Mediation / Settlement</option>
//                 <option>Bill Recovery</option>
//                 <option>FIR / Complaint Filed</option>
//                 <option>Case Filed</option>
//                 <option>Evidence</option>
//                 <option>Cross Examination</option>
//                 <option>Arguments</option>
//                 <option>Order Reserved</option>
//                 <option>Judgement</option>
//                 <option>Appeal</option>
//                 <option>Execution</option>
//                 <option>Other</option>
//                 <option>Close</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Tags </label>
//               <input
//                 type="text"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 placeholder="Comma separated, e.g. urgent, insurance"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 pt-6">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-6 py-2 bg-[#398C89] text-white rounded hover:bg-[#2e706e] text-sm font-medium"
//           >
//             Save
//           </button>
//         </div>
//       </form>

//       {/* Custom CSS for react-select */}
//       <style jsx>{`
//         .react-select-container :global(.react-select__control) {
//           min-height: 38px;
//           border-radius: 0.25rem;
//         }
//         .react-select-container :global(.react-select__value-container) {
//           padding: 2px 8px;
//         }
//         .react-select-container :global(.react-select__input) {
//           font-size: 14px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CreateQueryCase;













// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import apiClient from "../../../services/apiClient";

// const CreateQueryCase = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const editData = location.state?.editData; // Get edit data if navigated from edit button
//   const isEditMode = !!editData; // Check if we're in edit mode

//   const [formData, setFormData] = useState({
//     // Doctor Details
//     doctorName: "",
//     doctorId: "",
//     caseNo: "",
//     queryType: "",
//     caseType: "",
//     subType: "",
//     queryDescription: "",

//     // Patient Details
//     patientName: "",
//     ageGender: "",
//     contactNo: "",
//     address: "",

//     // Opponent Details
//     opponentName: "",
//     relation: "",
//     opponentType: "",
//     opponentContact: "",
//     opponentEmail: "",
//     opponentAddress: "",

//     // Additional
//     caseStage: "",
//     tags: "",
//   });

//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctorId, setSelectedDoctorId] = useState(""); // Track selected doctor ID
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Load edit data if in edit mode
//   useEffect(() => {
//     if (editData) {
//       console.log('Edit data received:', editData); // Debug log

//       setFormData({
//         doctorName: editData.doctorName || "",
//         doctorId: editData.doctorId || "",
//         caseNo: editData.caseNo || "",
//         queryType: editData.queryType || "",
//         caseType: editData.caseType || "",
//         subType: editData.subType || "",
//         queryDescription: editData.queryDescription || editData.originalQuery || "",
//         patientName: editData.patientName || editData.patient || "",
//         ageGender: editData.ageGender || "",
//         contactNo: editData.contactNo || "",
//         address: editData.address || "",
//         opponentName: editData.opponentName || editData.opponent || "",
//         relation: editData.relation || "",
//         opponentType: editData.opponentType || "",
//         opponentContact: editData.opponentContact || "",
//         opponentEmail: editData.opponentEmail || "",
//         opponentAddress: editData.opponentAddress || "",
//         caseStage: editData.caseStage || editData.status || "",
//         tags: Array.isArray(editData.tags) ? editData.tags.join(', ') : (editData.tags || ""),
//       });

//       console.log('Form data set:', {
//         doctorName: editData.doctorName,
//         patientName: editData.patientName || editData.patient,
//         opponentName: editData.opponentName || editData.opponent,
//         queryDescription: editData.queryDescription || editData.originalQuery
//       }); // Debug log
//     }
//   }, [editData]);

//   // Fetch doctors whose typeOfEnquiry is "closed"
//   const fetchClosedEnquiryDoctors = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await apiClient.get('/doctors', {
//         params: {
//           typeOfEnquiry: 'closed',
//           limit: 100 // Limit to 100 results to avoid too many options
//         }
//       });

//       setDoctors(response.data.data || []);
//     } catch (err) {
//       console.error('Error fetching doctors:', err);
//       setError('Failed to fetch doctors with closed enquiries');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClosedEnquiryDoctors();
//   }, []);

//   // Set selected doctor ID when doctors are loaded and we're in edit mode
//   useEffect(() => {
//     if (editData && doctors.length > 0 && formData.doctorName) {
//       // Find the doctor by name or doctorId
//       const matchingDoctor = doctors.find(
//         (doc) => doc.fullName === formData.doctorName || doc.doctorId === formData.doctorId
//       );

//       if (matchingDoctor) {
//         setSelectedDoctorId(matchingDoctor._id);
//         console.log('Selected doctor set:', matchingDoctor.fullName, matchingDoctor._id);
//       } else {
//         console.log('No matching doctor found for:', formData.doctorName, formData.doctorId);
//       }
//     }
//   }, [doctors, editData, formData.doctorName, formData.doctorId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle doctor selection from dropdown
//   const handleDoctorChange = (e) => {
//     const doctorId = e.target.value;
//     setSelectedDoctorId(doctorId); // Update selected doctor ID

//     if (doctorId === "") {
//       setFormData(prev => ({
//         ...prev,
//         doctorName: "",
//         doctorId: ""
//       }));
//     } else {
//       const selectedDoctor = doctors.find(doctor => doctor._id === doctorId);
//       if (selectedDoctor) {
//         setFormData(prev => ({
//           ...prev,
//           doctorName: selectedDoctor.fullName,
//           doctorId: selectedDoctor.doctorId
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Prepare the data to be sent to the API
//       const queryCaseData = {
//         doctorName: formData.doctorName,
//         doctorId: formData.doctorId,
//         caseNo: formData.caseNo,
//         queryType: formData.queryType,
//         caseType: formData.caseType,
//         subType: formData.subType,
//         queryDescription: formData.queryDescription,

//         patientName: formData.patientName,
//         ageGender: formData.ageGender,
//         contactNo: formData.contactNo,
//         address: formData.address,

//         opponentName: formData.opponentName,
//         relation: formData.relation,
//         opponentType: formData.opponentType,
//         opponentContact: formData.opponentContact,
//         opponentEmail: formData.opponentEmail,
//         opponentAddress: formData.opponentAddress,

//         caseStage: formData.caseStage,
//         tags: formData.tags,
//       };

//       let response;
//       if (isEditMode) {
//         // Update existing query case
//         response = await apiClient.put(`/query-cases/${editData._id}`, queryCaseData);
//       } else {
//         // Create new query case
//         response = await apiClient.post('/query-cases', queryCaseData);
//       }

//       if (response.data.success) {
//         alert(isEditMode ? "Case updated successfully!" : "Case created successfully!");
//         navigate(-1); // Go back to previous page
//       } else {
//         alert(`Failed to ${isEditMode ? 'update' : 'create'} case. Please try again.`);
//       }
//     } catch (error) {
//       console.error(`Error ${isEditMode ? 'updating' : 'creating'} query case:`, error);
//       alert(`Error ${isEditMode ? 'updating' : 'creating'} case: ${error.response?.data?.message || error.message || 'Please try again'}`);
//     }
//   };

//   return (
//     <div className="max-w-[85vw] mx-auto  p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditMode ? 'Edit case' : 'Add new case'}</h2>

//       <form onSubmit={handleSubmit} className="space-y-8">

//         {/* Doctor Details */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-3">Doctor Details</h3>

//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
//               {error}
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1  ">
//               <div>
//              <p className="flex gap-[5px] items-center">
//              <p>  Doctor Name  </p> <span className="text-red-700 " >*</span>
//               </p>   
//                 </div>  
//               </label>
//               {loading ? (
//                 <div className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-100">
//                   Loading...
//                 </div>
//               ) : (
//                 <select
//                   name="doctorName"
//                   value={selectedDoctorId}
//                   onChange={handleDoctorChange}
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 >
//                   <option value="">Select doctor (optional)</option>
//                   {doctors.map((doctor) => (
//                     <option key={doctor._id} value={doctor._id}>
//                       {doctor.fullName} (ID: {doctor.doctorId})
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Doctor ID</label>
//               <input
//                 type="text"
//                 name="doctorId"
//                 value={formData.doctorId}
//                 onChange={handleChange}
//                 placeholder="e.g. D-1024"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 readOnly
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Case No</label>
//               <input
//                 type="text"
//                 name="caseNo"
//                 value={formData.caseNo}
//                 onChange={handleChange}
//                 placeholder="e.g. C-2025-001"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 readOnly
//                 disabled
//               />
//             </div>

//             <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Query Type <span className="text-red-600"> *</span>
//                 </label>
//                 <select
//                   name="queryType"
//                   value={formData.queryType}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 >
//                   <option value="">Select </option>
//                   <option>Medicolegal Issue</option>
//                   <option>Bill Recovery</option>
//                   <option>Consent Issue</option>
//                   <option>Insurance Dispute</option>
//                   <option>Legal Consulting</option>
//                   <option>Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Case Type </label>
//                 <select
//                   name="caseType"
//                   value={formData.caseType}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 >
//                   <option value="">--</option>
//                   <option>Civil</option>
//                   <option>Criminal</option>
//                   <option>Consumer</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Sub Type </label>
//                 <select
//                   name="subType"
//                   value={formData.subType}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 >
//                   <option value="">--</option>
//                   <option>Property Dispute</option>
//                   <option>Recovery Suit</option>
//                   <option>Medical Negligence</option>
//                   <option>IPC 138</option>
//                   <option>BNS 165</option>
//                   <option>Unfair Fraud(e) Practice</option>
//                   <option>Other</option>
//                 </select>
//               </div>
//             </div>

//             <div className="lg:col-span-4">
//               <label className="block text-sm font-medium text-gray-600 mb-1">Query Description </label>
//               <textarea
//                 name="queryDescription"
//                 value={formData.queryDescription}
//                 onChange={handleChange}
//                 placeholder="Short description..."
//                 rows={3}
//                 className="w-full p-3 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>
//           </div>
//         </div>

//         <hr className="border-gray-300" />

//         {/* Patient Details */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-3">Patient Details </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Patient Name <span className="text-red-600"> *</span>
//               </label>
//               <input
//                 type="text"
//                 name="patientName"
//                 value={formData.patientName}
//                 onChange={handleChange}
//                 placeholder="Patient full name"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Age | Gender </label>
//               <input
//                 type="text"
//                 name="ageGender"
//                 value={formData.ageGender}
//                 onChange={handleChange}
//                 placeholder="e.g. 47 | M"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Contact No </label>
//               <input
//                 type="text"
//                 name="contactNo"
//                 value={formData.contactNo}
//                 onChange={handleChange}
//                 placeholder="10-digit mobile"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>

//             <div className="lg:col-span-4">
//               <label className="block text-sm font-medium text-gray-600 mb-1">Address </label>
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 placeholder="F1 Flat / Street / City / PIN"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>
//           </div>
//         </div>

//         <hr className="border-gray-300" />

//         {/* Opponent Party Details */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-3">Opponent Party Details </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Opponent Name</label>
//               <input
//                 type="text"
//                 name="opponentName"
//                 value={formData.opponentName}
//                 onChange={handleChange}
//                 placeholder="Name"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Relation with Patient </label>
//               <select
//                 name="relation"
//                 value={formData.relation}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               >
//                 <option value="">--</option>
//                 <option>Self</option>
//                 <option>Spouse</option>
//                 <option>Parent</option>
//                 <option>Child</option>
//                 <option>Sibling</option>
//                 <option>Other Relative</option>
//                 <option>Attendant / Caregiver</option>
//                 <option>Legal Heir</option>
//                 <option>Not Applicable</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Opponent Type </label>
//               <select
//                 name="opponentType"
//                 value={formData.opponentType}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               >
//                 <option value="">--</option>
//                 <option>Patient</option>
//                 <option>Relative</option>
//                 <option>Insurance Company</option>
//                 <option>Advocate</option>
//                 <option>NGO / Trust</option>
//                 <option>Government</option>
//                 <option>Other</option>
//               </select>
//             </div>

//             <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Contact </label>
//                 <input
//                   type="text"
//                   name="opponentContact"
//                   value={formData.opponentContact}
//                   onChange={handleChange}
//                   placeholder="Phone / Email"
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Email </label>
//                 <input
//                   type="email"
//                   name="opponentEmail"
//                   value={formData.opponentEmail}
//                   onChange={handleChange}
//                   placeholder="opponent@example.com"
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Address </label>
//                 <input
//                   type="text"
//                   name="opponentAddress"
//                   value={formData.opponentAddress}
//                   onChange={handleChange}
//                   placeholder="Address"
//                   className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <hr className="border-gray-300" />

//         {/* Additional */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-3">Additional (optional)</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Case Stage</label>
//               <select
//                 name="caseStage"
//                 value={formData.caseStage}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               >
//                 <option value="">--</option>
//                 <option>Query Raised</option>
//                 <option>Legal Consultation</option>
//                 <option>Expert Opinion</option>
//                 <option>Referred to Civil Surgeon</option>
//                 <option>Show Cause Notice</option>
//                 <option>Notice Received</option>
//                 <option>Notice Replied</option>
//                 <option>Mediation / Settlement</option>
//                 <option>Bill Recovery</option>
//                 <option>FIR / Complaint Filed</option>
//                 <option>Case Filed</option>
//                 <option>Evidence</option>
//                 <option>Cross Examination</option>
//                 <option>Arguments</option>
//                 <option>Order Reserved</option>
//                 <option>Judgement</option>
//                 <option>Appeal</option>
//                 <option>Execution</option>
//                 <option>Other</option>
//                 <option>Close</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Tags </label>
//               <input
//                 type="text"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 placeholder="Comma separated, e.g. urgent, insurance"
//                 className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 pt-6">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-6 py-2 bg-[#398C89] text-white rounded hover:bg-[#2e706e] text-sm font-medium"
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateQueryCase;




import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../../services/apiClient";
import Select from "react-select"; // ✅ React-select import

const CreateQueryCase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData; // Get edit data if navigated from edit button
  const isEditMode = !!editData; // Check if we're in edit mode

  const [formData, setFormData] = useState({
    // Doctor Details
    doctorName: "",
    doctorId: "",
    caseNo: "",
    queryType: "",
    caseType: "",
    subType: "",
    queryDescription: "",

    // Patient Details
    patientName: "",
    ageGender: "",
    contactNo: "",
    address: "",

    // Opponent Details
    opponentName: "",
    relation: "",
    opponentType: "",
    opponentContact: "",
    opponentEmail: "",
    opponentAddress: "",

    // Additional
    caseStage: "",
    tags: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]); // ✅ React-select ke liye options
  const [selectedDoctorId, setSelectedDoctorId] = useState(""); // Track selected doctor ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Custom styles for react-select
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      borderColor: state.isFocused ? "#398C89" : "#d1d5db",
      backgroundColor: "white",
      boxShadow: state.isFocused ? "0 0 0 1px #398C89" : "none",
      "&:hover": {
        borderColor: "#398C89",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#398C89" : state.isFocused ? "#e6f7f7" : "white",
      color: state.isSelected ? "white" : "#333",
      "&:active": {
        backgroundColor: "#2e706e",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
      fontSize: "14px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#1f2937",
      fontSize: "14px",
    }),
  };

  // Load edit data if in edit mode
  useEffect(() => {
    if (editData) {
      console.log('Edit data received:', editData); // Debug log

      setFormData({
        doctorName: editData.doctorName || "",
        doctorId: editData.doctorId || "",
        caseNo: editData.caseNo || "",
        queryType: editData.queryType || "",
        caseType: editData.caseType || "",
        subType: editData.subType || "",
        queryDescription: editData.queryDescription || editData.originalQuery || "",
        patientName: editData.patientName || editData.patient || "",
        ageGender: editData.ageGender || "",
        contactNo: editData.contactNo || "",
        address: editData.address || "",
        opponentName: editData.opponentName || editData.opponent || "",
        relation: editData.relation || "",
        opponentType: editData.opponentType || "",
        opponentContact: editData.opponentContact || "",
        opponentEmail: editData.opponentEmail || "",
        opponentAddress: editData.opponentAddress || "",
        caseStage: editData.caseStage || editData.status || "",
        tags: Array.isArray(editData.tags) ? editData.tags.join(', ') : (editData.tags || ""),
      });

      console.log('Form data set:', {
        doctorName: editData.doctorName,
        patientName: editData.patientName || editData.patient,
        opponentName: editData.opponentName || editData.opponent,
        queryDescription: editData.queryDescription || editData.originalQuery
      }); // Debug log
    }
  }, [editData]);

  // Fetch doctors whose typeOfEnquiry is "closed"
  const fetchClosedEnquiryDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/doctors', {
        params: {
          typeOfEnquiry: 'closed',
          limit: 100 // Limit to 100 results to avoid too many options
        }
      });

      const doctorsData = response.data.data || [];
      setDoctors(doctorsData);
      
      // ✅ Convert doctors to react-select options format
      const options = doctorsData.map((doctor) => ({
        value: doctor._id,
        label: `${doctor.fullName} (ID: ${doctor.doctorId})`,
        doctorData: doctor,
      }));
      
      setDoctorOptions(options);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to fetch doctors with closed enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClosedEnquiryDoctors();
  }, []);

  // Set selected doctor ID when doctors are loaded and we're in edit mode
  useEffect(() => {
    if (editData && doctorOptions.length > 0 && formData.doctorName) {
      // Find the doctor by name or doctorId
      const matchingDoctor = doctors.find(
        (doc) => doc.fullName === formData.doctorName || doc.doctorId === formData.doctorId
      );

      if (matchingDoctor) {
        setSelectedDoctorId(matchingDoctor._id);
        console.log('Selected doctor set:', matchingDoctor.fullName, matchingDoctor._id);
      } else {
        console.log('No matching doctor found for:', formData.doctorName, formData.doctorId);
      }
    }
  }, [doctors, editData, formData.doctorName, formData.doctorId, doctorOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle doctor selection from react-select
  const handleDoctorSelect = (selectedOption) => {
    if (!selectedOption) {
      // Reset if doctor is cleared
      setSelectedDoctorId("");
      setFormData(prev => ({
        ...prev,
        doctorName: "",
        doctorId: ""
      }));
      return;
    }

    const doctorId = selectedOption.value;
    setSelectedDoctorId(doctorId);

    const selectedDoctor = doctors.find(doctor => doctor._id === doctorId);
    if (selectedDoctor) {
      setFormData(prev => ({
        ...prev,
        doctorName: selectedDoctor.fullName,
        doctorId: selectedDoctor.doctorId
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare the data to be sent to the API
      const queryCaseData = {
        doctorName: formData.doctorName,
        doctorId: formData.doctorId,
        caseNo: formData.caseNo,
        queryType: formData.queryType,
        caseType: formData.caseType,
        subType: formData.subType,
        queryDescription: formData.queryDescription,

        patientName: formData.patientName,
        ageGender: formData.ageGender,
        contactNo: formData.contactNo,
        address: formData.address,

        opponentName: formData.opponentName,
        relation: formData.relation,
        opponentType: formData.opponentType,
        opponentContact: formData.opponentContact,
        opponentEmail: formData.opponentEmail,
        opponentAddress: formData.opponentAddress,

        caseStage: formData.caseStage,
        tags: formData.tags,
      };

      let response;
      if (isEditMode) {
        // Update existing query case
        response = await apiClient.put(`/query-cases/${editData._id}`, queryCaseData);
      } else {
        // Create new query case
        response = await apiClient.post('/query-cases', queryCaseData);
      }

      if (response.data.success) {
        alert(isEditMode ? "Case updated successfully!" : "Case created successfully!");
        navigate(-1); // Go back to previous page
      } else {
        alert(`Failed to ${isEditMode ? 'update' : 'create'} case. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} query case:`, error);
      alert(`Error ${isEditMode ? 'updating' : 'creating'} case: ${error.response?.data?.message || error.message || 'Please try again'}`);
    }
  };

  return (
    <div className="max-w-[85vw] mx-auto  p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditMode ? 'Edit case' : 'Add new case'}</h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Doctor Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Doctor Details</h3>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1  ">
                <div>
                  <p className="flex gap-[5px] items-center">
                    <p>Doctor Name</p> <span className="text-red-700">*</span>
                  </p>
                </div>
              </label>
              
              {/* ✅ React-select Implementation */}
              <Select
                name="doctorName"
                options={doctorOptions}
                value={doctorOptions.find(option => option.value === selectedDoctorId) || null}
                onChange={handleDoctorSelect}
                isLoading={loading}
                loadingMessage={() => "Loading doctors..."}
                placeholder="Select doctor "
                isSearchable={true}
                isClearable={true}
                noOptionsMessage={() => "No doctors found"}
                styles={customSelectStyles}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Doctor ID</label>
              <input
                type="text"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                placeholder="e.g. D-1024"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Case No</label>
              <input
                type="text"
                name="caseNo"
                value={formData.caseNo}
                onChange={handleChange}
                placeholder="e.g. C-2025-001"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                
                
              />
            </div>

            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Query Type <span className="text-red-600"> *</span>
                </label>
                <select
                  name="queryType"
                  value={formData.queryType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                >
                  <option value="">Select </option>
                  <option>Medicolegal Issue</option>
                  <option>Bill Recovery</option>
                  <option>Consent Issue</option>
                  <option>Insurance Dispute</option>
                  <option>Legal Consulting</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Case Type </label>
                <select
                  name="caseType"
                  value={formData.caseType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                >
                  <option value="">--</option>
                  {/* <option>Medico Legal</option> */}
                  <option>Civil</option>
                  <option>Criminal</option>
                  <option>Consumer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Sub Type </label>
                <select
                  name="subType"
                  value={formData.subType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                >
                  <option value="">--</option>
                  <option>Property Dispute</option>
                  <option>Recovery Suit</option>
                  <option>Medical Negligence</option>
                  <option>IPC 138</option>
                  <option>BNS 165</option>
                  <option>Unfair Fraud(e) Practice</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="lg:col-span-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Query Description </label>
              <textarea
                name="queryDescription"
                value={formData.queryDescription}
                onChange={handleChange}
                placeholder="Short description..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Patient Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Patient Details </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Patient Name <span className="text-red-600"> </span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Patient full name"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Age | Gender </label>
              <input
                type="text"
                name="ageGender"
                value={formData.ageGender}
                onChange={handleChange}
                placeholder="e.g. 47 | M"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Contact No </label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                placeholder="10-digit mobile"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              />
            </div>

            <div className="lg:col-span-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Address </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="F1 Flat / Street / City / PIN"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Opponent Party Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Opponent Party Details </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Opponent Name</label>
              <input
                type="text"
                name="opponentName"
                value={formData.opponentName}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Relation with Patient </label>
              <select
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              >
                <option value="">--</option>
                <option>Self</option>
                <option>Spouse</option>
                <option>Parent</option>
                <option>Child</option>
                <option>Sibling</option>
                <option>Other Relative</option>
                <option>Attendant / Caregiver</option>
                <option>Legal Heir</option>
                <option>Not Applicable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Opponent Type </label>
              <select
                name="opponentType"
                value={formData.opponentType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              >
                <option value="">--</option>
                <option>Patient</option>
                <option>Relative</option>
                <option>Insurance Company</option>
                <option>Advocate</option>
                <option>NGO / Trust</option>
                <option>Government</option>
                <option>Other</option>
              </select>
            </div>

            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Contact </label>
                <input
                  type="text"
                  name="opponentContact"
                  value={formData.opponentContact}
                  onChange={handleChange}
                  placeholder="Phone / Email"
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email </label>
                <input
                  type="email"
                  name="opponentEmail"
                  value={formData.opponentEmail}
                  onChange={handleChange}
                  placeholder="opponent@example.com"
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Address </label>
                <input
                  type="text"
                  name="opponentAddress"
                  value={formData.opponentAddress}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Additional */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Additional (optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Case Stage</label>
              <select
                name="caseStage"
                value={formData.caseStage}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              >
                <option value="">--</option>
                <option>Query Raised</option>
                <option>Legal Consultation</option>
                <option>Expert Opinion</option>
                <option>Referred to Civil Surgeon</option>
                <option>Show Cause Notice</option>
                <option>Notice Received</option>
                <option>Notice Replied</option>
                <option>Mediation / Settlement</option>
                <option>Bill Recovery</option>
                <option>FIR / Complaint Filed</option>
                <option>Case Filed</option>
                <option>Evidence</option>
                <option>Cross Examination</option>
                <option>Arguments</option>
                <option>Order Reserved</option>
                <option>Judgement</option>
                <option>Appeal</option>
                <option>Execution</option>
                <option>Other</option>
                <option>Close</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tags </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Comma separated, e.g. urgent, insurance"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#398C89] text-white rounded hover:bg-[#2e706e] text-sm font-medium"
          >
            Save
          </button>
        </div>
      </form>

      {/* Custom CSS for react-select */}
      <style jsx>{`
        .react-select-container :global(.react-select__control) {
          min-height: 38px;
          border-radius: 0.25rem;
        }
        .react-select-container :global(.react-select__value-container) {
          padding: 2px 8px;
        }
        .react-select-container :global(.react-select__input) {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default CreateQueryCase;