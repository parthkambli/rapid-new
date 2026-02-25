// // src/pages/Admin/Experts/ExpertBill.jsx
// import React, { useState, useEffect } from "react";
// import { apiHelpers, apiEndpoints } from "../../../services/apiClient";

// const ExpertBill = () => {
//   const [Expert, setExpert] = useState("");
//   const [doctor, setDoctor] = useState("");
//   const [caseNo, setCaseNo] = useState("");
//   const [caseType, setCaseType] = useState("");
//   const [expertsList, setExpertsList] = useState([]);
//   const [doctorsList, setDoctorsList] = useState([]);
//   const [stages, setStages] = useState([
//     { id: 1, stage: "Notice/Reply", amount: 4000, gstPercent: 18 },
//     { id: 2, stage: "Filing", amount: 6000, gstPercent: 18 },
//   ]);
//   const [overallGst, setOverallGst] = useState("");
//   const [otherCharges, setOtherCharges] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [remark, setRemark] = useState("");

//   useEffect(() => {
//     const fetchExpertsAndDoctors = async () => {
//       try {
//         const expertsResponse = await apiHelpers.getList(apiEndpoints.experts.list);
//         setExpertsList(expertsResponse.data);

//         const doctorsResponse = await apiHelpers.getList(apiEndpoints.doctors.list);
//         setDoctorsList(doctorsResponse.data);
//       } catch (error) {
//         console.error("Error fetching experts or doctors:", error);
//         alert("Error fetching initial data.");
//       }
//     };

//     fetchExpertsAndDoctors();
//   }, []);

//   // Auto calculate GST Amount per stage
//   const calculateGstAmt = (amount, gstPercent) => {
//     return ((amount * gstPercent) / 100).toFixed(2);
//   };

//   // Add new stage
//   const addStage = () => {
//     const newStage = {
//       id: Date.now(),
//       stage: "",
//       amount: 0,
//       gstPercent: 18,
//     };
//     setStages([...stages, newStage]);
//   };

//   // Remove stage
//   const removeStage = (id) => {
//     setStages(stages.filter(s => s.id !== id));
//   };

//   // Update stage
//   const updateStage = (id, field, value) => {
//     setStages(stages.map(s => s.id === id ? { ...s, [field]: value } : s));
//   };

//   // Calculate Totals
//   const calculateTotals = () => {
//     let subtotal = 0;
//     let gstTotal = 0;

//     stages.forEach(s => {
//       const amount = parseFloat(s.amount) || 0;
//       const gstPercent = parseFloat(s.gstPercent) || 0;
//       subtotal += amount;
//       gstTotal += (amount * gstPercent) / 100;
//     });

//     // Apply Overall GST if set
//     if (overallGst && parseFloat(overallGst) > 0) {
//       gstTotal = (subtotal * parseFloat(overallGst)) / 100;
//     }

//     const other = parseFloat(otherCharges) || 0;
//     const disc = parseFloat(discount) || 0;
//     const finalTotal = subtotal + gstTotal + other - disc;

//     return { subtotal, gstTotal, other, disc, finalTotal };
//   };

//   const { subtotal, gstTotal, other, disc, finalTotal } = calculateTotals();

//   const handleSave = async () => {
//     // Validation
//     if (!Expert || Expert.trim() === "") {
//       alert("Please select an Expert");
//       return;
//     }
//     if (!doctor || doctor.trim() === "") {
//       alert("Please select a Doctor");
//       return;
//     }
//     if (!caseNo || caseNo.trim() === "") {
//       alert("Please enter a Case No");
//       return;
//     }
//     if (!caseType || caseType.trim() === "" || caseType === "-- Select Case Type --") {
//       alert("Please select a Case Type");
//       return;
//     }

//     const billData = {
//       expert: Expert, // Changed to expert (lowercase) to match backend schema
//       doctor: doctor, // Changed to doctor (lowercase) to match backend schema
//       caseNo, caseType, stages, overallGst, otherCharges, discount, remark,
//       totals: { subtotal, gstTotal, other, disc, finalTotal }
//     };
//     try {
//       const response = await apiHelpers.create(apiEndpoints.expertBills.create, billData);
//       console.log("Bill saved successfully:", response);
//       alert("Bill saved successfully!");
//       handleReset(); // Optionally reset form after successful save
//     } catch (error) {
//       console.error("Error saving bill:", error);
//       const errorMessage = error.response?.data?.message || error.response?.data?.error || "Error saving bill. Please try again.";
//       alert(errorMessage);
//     }
//   };

//   const handleReset = () => {
//     if (confirm("Reset all fields?")) {
//       setExpert(""); setDoctor(""); setCaseNo(""); setCaseType("");
//       setStages([]);
//       setOverallGst(""); setOtherCharges(0); setDiscount(0); setRemark("");
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-2">
//         <h1 className="text-2xl font-bold text-gray-800">Expert Bill</h1>
//         <span className="text-sm text-gray-600">
//           Create / Save Expert billing with stage-wise amounts, GST & final total
//         </span>
//       </div>

//       {/* Top Inputs */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Expert Name</label>
//           <select
//             value={Expert}
//             onChange={e => setExpert(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#398C89]"
//           >
//             <option value="">-- Select Expert --</option>
//             {expertsList.map(exp => (
//               <option key={exp._id} value={exp._id}>{exp.fullName}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
//           <select
//             value={doctor}
//             onChange={e => setDoctor(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//           >
//             <option value="">-- Select Doctor --</option>
//             {doctorsList.map(doc => (
//               <option key={doc._id} value={doc._id}>{doc.fullName}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Case No</label>
//           <input
//             type="text"
//             value={caseNo}
//             onChange={e => setCaseNo(e.target.value)}
//             placeholder="Enter case number (eg. C-2025-001)"
//             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
//           <select
//             value={caseType}
//             onChange={e => setCaseType(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//           >
//             <option value="">-- Select Case Type --</option>
//             <option>Medicolegal</option>
//             <option>Insurance Dispute</option>
//             <option>Consent Issue</option>
//           </select>
//         </div>
//       </div>

//       {/* Stage-wise Amounts */}
//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-3">
//           <h3 className="text-lg font-semibold text-gray-800">Stage wise Amounts</h3>
//           <span className="text-xs text-gray-600">
//             Add multiple stages (e.g. Notice, Filing, Hearing, Judgment)
//           </span>
//           <button
//             onClick={addStage}
//             className="px-4 py-2 bg-[#398C89] text-white rounded-md text-sm font-medium hover:bg-[#2e706e] flex items-center gap-2"
//           >
//             Add Stage
//           </button>
//         </div>

//         <div className="border border-gray-300 rounded-lg overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 text-left text-sm font-medium text-gray-700">Stage</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-700">Amount (₹)</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-700">GST %</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-700">GST Amt (₹)</th>
//                 <th className="p-3 text-center text-sm font-medium text-gray-700">Remove</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stages.map((s, i) => (
//                 <tr key={s.id} className="border-t border-gray-200">
//                   <td className="p-3">
//                     <input
//                       type="text"
//                       value={s.stage}
//                       onChange={e => updateStage(s.id, "stage", e.target.value)}
//                       placeholder="e.g. Notice/Reply"
//                       className="w-full p-2 border border-gray-300 rounded-md text-sm"
//                     />
//                   </td>
//                   <td className="p-3">
//                     <input
//                       type="number"
//                       value={s.amount}
//                       onChange={e => updateStage(s.id, "amount", e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md text-sm"
//                       min="0"
//                     />
//                   </td>
//                   <td className="p-3">
//                     <input
//                       type="number"
//                       value={s.gstPercent}
//                       onChange={e => updateStage(s.id, "gstPercent", e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md text-sm"
//                       min="0"
//                       max="100"
//                     />
//                   </td>
//                   <td className="p-3 text-right font-medium">
//                     ₹{calculateGstAmt(s.amount, s.gstPercent)}
//                   </td>
//                   <td className="p-3 text-center">
//                     <button
//                       onClick={() => removeStage(s.id)}
//                       className="text-red-600 hover:text-red-800 text-xl"
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <p className="text-xs text-gray-600 mt-2">
//           <strong>Tip:</strong> Enter GST at stage-level or change overall GST percent below (if you want one GST for whole bill)
//         </p>
//       </div>

//       {/* Overall GST, Other Charges, Discount */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Overall GST % (optional)</label>
//           <input
//             type="number"
//             value={overallGst}
//             onChange={e => setOverallGst(e.target.value)}
//             placeholder="18"
//             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//             min="0"
//           />
//           <p className="text-xs text-gray-600 mt-1">
//             If set (&gt; 0), final totals will use this GST % applied on subtotal instead of summing stage GSTs.
//           </p>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Other Charges (₹)</label>
//           <input
//             type="number"
//             value={otherCharges}
//             onChange={e => setOtherCharges(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//             min="0"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Discount (₹)</label>
//           <input
//             type="number"
//             value={discount}
//             onChange={e => setDiscount(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//             min="0"
//           />
//         </div>
//       </div>

//       {/* Totals */}
//       <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Subtotal</label>
//           <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
//             ₹{subtotal.toFixed(2)}
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">GST Total</label>
//           <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
//             ₹{gstTotal.toFixed(2)}
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Other Charges</label>
//           <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
//             ₹{other}
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Discount</label>
//           <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
//             -₹{disc}
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Final Total</label>
//           <div className="p-2 bg-[#398C89] text-white rounded-md text-right font-bold text-lg">
//             ₹{finalTotal.toFixed(2)}
//           </div>
//         </div>
//       </div>

//       {/* Remark */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
//         <textarea
//           value={remark}
//           onChange={e => setRemark(e.target.value)}
//           placeholder="Enter remarks or billing notes..."
//           rows={3}
//           className="w-full p-3 border border-gray-300 rounded-md text-sm resize-vertical"
//         />
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-3">
//         <button
//           onClick={handleReset}
//           className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
//         >
//           Reset
//         </button>
//         <button
//           onClick={handleSave}
//           className="px-6 py-2 bg-[#398C89] text-white rounded-md text-sm font-medium hover:bg-[#2e706e]"
//         >
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ExpertBill;













// // src/pages/Admin/Experts/ExpertBill.jsx
// import React, { useState, useEffect } from "react";
// import Select from 'react-select';
// import apiClient, { apiHelpers, apiEndpoints } from "../../../services/apiClient";

// const ExpertBill = () => {
//   const [expert, setExpert] = useState(null);
//   const [doctor, setDoctor] = useState(null);
//   const [caseNo, setCaseNo] = useState("");
//   const [caseType, setCaseType] = useState("");
//   const [expertsList, setExpertsList] = useState([]);
//   const [doctorsList, setDoctorsList] = useState([]);
//   const [doctorCases, setDoctorCases] = useState([]); // Store cases for the selected doctor
//   const [isFetchingCases, setIsFetchingCases] = useState(false); // Track if cases are being fetched
//   const [stages, setStages] = useState([
//     { id: 1, stage: "Notice/Reply", amount: 4000, gstPercent: 18 },
//     { id: 2, stage: "Filing", amount: 6000, gstPercent: 18 },
//   ]);
//   const [overallGst, setOverallGst] = useState("");
//   const [otherCharges, setOtherCharges] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [remark, setRemark] = useState("");

//   useEffect(() => {
//     const fetchExpertsAndDoctors = async () => {
//       try {
//         // Use the experts endpoint which contains the actual expert records
//         const expertsResponse = await apiClient.get('/experts', {
//           params: { page: 1, limit: 100 } // Get all experts
//         });
//         setExpertsList(expertsResponse.data.data || []);

//         const doctorsResponse = await apiClient.get(apiEndpoints.doctors.list, {
//           params: { page: 1, limit: 1000 } // Fetch all doctors
//         });
//         setDoctorsList(doctorsResponse.data.data || []);
//       } catch (error) {
//         console.error("Error fetching experts or doctors:", error);
//         console.log("Error details:", error.response?.data || error.message);

//         // More descriptive error message to help diagnose permission issues
//         if (error.response?.status === 403) {
//           alert("Access denied: You don't have permission to view experts. Please contact your administrator to update your permissions for 'Expert List' read access.");
//         } else if (error.response?.status === 401) {
//           alert("Authentication required: Please log in again.");
//           // Redirect to login
//           window.location.href = '/login';
//         } else {
//           alert("Error fetching experts. Please try again or contact support if the problem persists.");
//         }
//       }
//     };

//     fetchExpertsAndDoctors();
//   }, []);

//   // Function to fetch cases for the selected expert
//   const fetchCasesForExpert = async (expertId) => {
//     if (!expertId) return; // Don't fetch if no expert is selected

//     setIsFetchingCases(true);
//     try {
//       // Fetch query cases assigned to the selected expert
//       const response = await apiClient.get('/query-cases', {
//         params: {
//           assignedExpert: expertId // Filter by assigned expert
//         }
//       });

//       // If there are cases, auto-populate the first case's doctor, caseNo, and caseType
//       if (response.data.data && response.data.data.length > 0) {
//         const firstCase = response.data.data[0];

//         // Auto-populate doctor, caseNo, and caseType from the case
//         setCaseNo(firstCase.caseNo || "");
//         setCaseType(firstCase.caseType || "");

//         // Find and set the doctor from doctorsList
//         const doctorInCase = doctorsList.find(d =>
//           firstCase.doctorName && d.fullName &&
//           firstCase.doctorName.includes(d.fullName)
//         );

//         if (doctorInCase) {
//           setDoctor({
//             value: doctorInCase._id,
//             label: `${doctorInCase.fullName} ${doctorInCase.doctorId ? `(${doctorInCase.doctorId})` : ''}`
//           });
//         } else {
//           // If doctor not found in the list, set it manually (for cases where doctor name format doesn't match exactly)
//           setDoctor({
//             value: firstCase.doctorId || "",
//             label: firstCase.doctorName || ""
//           });
//         }
//       } else {
//         // If no cases found, clear the fields
//         setCaseNo("");
//         setCaseType("");
//         setDoctor(null);
//       }
//     } catch (error) {
//       console.error("Error fetching cases for expert:", error);
//       // Even if there's an error, clear the case fields
//       setCaseNo("");
//       setCaseType("");
//       setDoctor(null);
//       // Don't show an alert as this might happen frequently when selecting experts
//     } finally {
//       setIsFetchingCases(false);
//     }
//   };

//   // Function to fetch cases for the selected doctor
//   const fetchCasesForDoctor = async (doctorId) => {
//     if (!doctorId) return; // Don't fetch if no doctor is selected

//     setIsFetchingCases(true);
//     try {
//       // First, find the doctor from the doctorsList to get the name
//       const selectedDoctor = doctorsList.find(d => d._id === doctorId);
//       if (!selectedDoctor) {
//         console.error("Selected doctor not found in doctors list");
//         return;
//       }

//       // Fetch ALL query cases to properly handle multiple doctors in a case
//       const response = await apiClient.get(apiEndpoints.queryCases.list, {
//         params: {
//           // No specific filter - get all cases to check for doctor name inclusion
//           // status: 'Open' // Removed status filter to fetch all cases
//         }
//       });

//       // Filter cases where the selected doctor's name appears in the doctorName field
//       const filteredCases = (response.data.data || []).filter(caseItem =>
//         caseItem.doctorName &&
//         caseItem.doctorName.includes(selectedDoctor.fullName)
//       );

//       setDoctorCases(filteredCases);

//       // If there are cases, auto-populate the first case
//       if (filteredCases && filteredCases.length > 0) {
//         const firstCase = filteredCases[0];
//         setCaseNo(firstCase.caseNo || "");
//         setCaseType(firstCase.caseType || "");
//       } else {
//         // If no cases found, clear the fields
//         setCaseNo("");
//         setCaseType("");
//       }
//     } catch (error) {
//       console.error("Error fetching cases for doctor:", error);
//       // Even if there's an error, clear the case fields
//       setCaseNo("");
//       setCaseType("");
//       // Don't show an alert as this might happen frequently when selecting doctors
//     } finally {
//       setIsFetchingCases(false);
//     }
//   };

//   // Auto calculate GST Amount per stage
//   const calculateGstAmt = (amount, gstPercent) => {
//     return ((amount * gstPercent) / 100).toFixed(2);
//   };

//   // Add new stage
//   const addStage = () => {
//     const newStage = {
//       id: Date.now(),
//       stage: "",
//       amount: 0,
//       gstPercent: 18,
//     };
//     setStages([...stages, newStage]);
//   };

//   // Remove stage
//   const removeStage = (id) => {
//     setStages(stages.filter(s => s.id !== id));
//   };

//   // Update stage
//   const updateStage = (id, field, value) => {
//     setStages(stages.map(s => s.id === id ? { ...s, [field]: value } : s));
//   };

//   // Calculate Totals
//   const calculateTotals = () => {
//     let subtotal = 0;
//     let gstTotal = 0;

//     stages.forEach(s => {
//       const amount = parseFloat(s.amount) || 0;
//       const gstPercent = parseFloat(s.gstPercent) || 0;
//       subtotal += amount;
//       gstTotal += (amount * gstPercent) / 100;
//     });

//     // Apply Overall GST if set
//     if (overallGst && parseFloat(overallGst) > 0) {
//       gstTotal = (subtotal * parseFloat(overallGst)) / 100;
//     }

//     const other = parseFloat(otherCharges) || 0;
//     const disc = parseFloat(discount) || 0;
//     const finalTotal = subtotal + gstTotal + other - disc;

//     return { subtotal, gstTotal, other, disc, finalTotal };
//   };

//   const { subtotal, gstTotal, other, disc, finalTotal } = calculateTotals();

//   const handleSave = async () => {
//     // Validation
//     if (!expert) {
//       alert("Please select an Expert");
//       return;
//     }
//     if (!doctor) {
//       alert("Please select a Doctor");
//       return;
//     }
//     if (!caseNo || caseNo.trim() === "") {
//       alert("Please enter a Case No");
//       return;
//     }
//     if (!caseType || caseType.trim() === "" || caseType === "-- Select Case Type --") {
//       alert("Please select a Case Type");
//       return;
//     }

//     const billData = {
//       expert: expert.value, // Changed to expert (lowercase) to match backend schema
//       doctor: doctor.value, // Changed to doctor (lowercase) to match backend schema
//       caseNo, caseType, stages, overallGst, otherCharges, discount, remark,
//       totals: { subtotal, gstTotal, other, disc, finalTotal }
//     };
//     try {
//       const response = await apiHelpers.create(apiEndpoints.expertBills.create, billData);
//       console.log("Bill saved successfully:", response);
//       alert("Bill saved successfully!");
//       handleReset(); // Optionally reset form after successful save
//     } catch (error) {
//       console.error("Error saving bill:", error);
//       const errorMessage = error.response?.data?.message || error.response?.data?.error || "Error saving bill. Please try again.";
//       alert(errorMessage);
//     }
//   };

//   const handleReset = () => {
//     if (confirm("Reset all fields?")) {
//       setExpert(null); setDoctor(null); setCaseNo(""); setCaseType("");
//       setStages([]);
//       setOverallGst(""); setOtherCharges(0); setDiscount(0); setRemark("");
//       setDoctorCases([]);
//       setIsFetchingCases(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-2">
//         <h1 className="text-2xl font-bold text-gray-800">Expert Bill</h1>
//         <span className="text-sm text-gray-600">
//           Create / Save Expert billing with stage-wise amounts, GST & final total
//         </span>
//       </div>

//       {/* Top Inputs */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Expert Name</label>
//           <Select
//             value={expert}
//             onChange={async (selectedOption) => {
//               setExpert(selectedOption);

//               // If an expert is selected, fetch their cases
//               if (selectedOption) {
//                 await fetchCasesForExpert(selectedOption.value);
//               } else {
//                 // If expert is cleared, clear the case fields and fetching state
//                 setCaseNo("");
//                 setCaseType("");
//                 setDoctor(null);
//                 setIsFetchingCases(false);
//               }
//             }}
//             options={expertsList.map(exp => ({
//               value: exp._id || exp.id,
//               label: `${exp.fullName || exp.name || exp.fullname || exp.title}`
//             }))}
//             isClearable
//             isSearchable
//             placeholder="Select or search expert..."
//             className="text-sm"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
//           <Select
//             value={doctor}
//             onChange={async (selectedOption) => {
//               setDoctor(selectedOption);

//               // If a doctor is selected, fetch their cases
//               if (selectedOption) {
//                 await fetchCasesForDoctor(selectedOption.value);
//               } else {
//                 // If doctor is cleared, clear the case fields and fetching state
//                 setCaseNo("");
//                 setCaseType("");
//                 setDoctorCases([]);
//                 setIsFetchingCases(false);
//               }
//             }}
//             options={doctorsList.map(doc => ({
//               value: doc._id,
//               label: `${doc.fullName} ${doc.doctorId ? `(${doc.doctorId})` : ''}`
//             }))}
//             isClearable
//             isSearchable
//             placeholder="Select or search doctor..."
//             className="text-sm"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Case No {isFetchingCases && (
//               <span className="ml-2 text-xs text-blue-600 animate-pulse">Fetching cases...</span>
//             )}
//           </label>
//           {isFetchingCases ? (
//             <Select
//               isDisabled
//               isLoading
//               placeholder="Loading cases..."
//               className="text-sm"
//             />
//           ) : doctor && doctorCases.length > 0 ? (
//             <Select
//               value={{ value: caseNo, label: caseNo }}
//               onChange={(selectedOption) => {
//                 setCaseNo(selectedOption.value);
//                 // Find the selected case and automatically set the case type
//                 const selectedCase = doctorCases.find(c => c.caseNo === selectedOption.value);
//                 if (selectedCase) {
//                   setCaseType(selectedCase.caseType || "");
//                 }
//               }}
//               options={doctorCases.map(caseItem => ({
//                 value: caseItem.caseNo,
//                 label: `${caseItem.caseNo} - ${caseItem.id} (${caseItem.queryType})`
//               }))}
//               isSearchable
//               placeholder="Select case..."
//               className="text-sm"
//             />
//           ) : (
//             <input
//               type="text"
//               value={caseNo}
//               onChange={e => setCaseNo(e.target.value)}
//               placeholder="Select doctor first to see cases"
//               disabled={!doctor}
//               className={`w-full p-2 border border-gray-300 rounded-md text-sm ${!doctor ? 'bg-gray-100' : ''}`}
//             />
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
//           <select
//             value={caseType}
//             onChange={e => setCaseType(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//             disabled={!caseNo}  // Disable if no case is selected
//           >
//             <option value="">-- Select Case Type --</option>
//             <option value="Civil">Civil</option>
//             <option value="Criminal">Criminal</option>
//             <option value="Consumer">Consumer</option>
//           </select>
//         </div>
//       </div>

//       {/* Stage-wise Amounts */}
//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-3">
//           <h3 className="text-lg font-semibold text-gray-800">Stage wise Amounts</h3>
//           <span className="text-xs text-gray-600">
//             Add multiple stages (e.g. Notice, Filing, Hearing, Judgment)
//           </span>
//           <button
//             onClick={addStage}
//             className="px-4 py-2 bg-[#398C89] text-white rounded-md text-sm font-medium hover:bg-[#2e706e] flex items-center gap-2"
//           >
//             Add Stage
//           </button>
//         </div>

//         <div className="border border-gray-300 rounded-lg overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 text-left text-sm font-medium text-gray-700">Stage</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-700">Amount (₹)</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-700">GST %</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-700">GST Amt (₹)</th>
//                 <th className="p-3 text-center text-sm font-medium text-gray-700">Remove</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stages.map((s, i) => (
//                 <tr key={s.id} className="border-t border-gray-200">
//                   <td className="p-3">
//                     <input
//                       type="text"
//                       value={s.stage}
//                       onChange={e => updateStage(s.id, "stage", e.target.value)}
//                       placeholder="e.g. Notice/Reply"
//                       className="w-full p-2 border border-gray-300 rounded-md text-sm"
//                     />
//                   </td>
//                   <td className="p-3">
//                     <input
//                       type="number"
//                       value={s.amount}
//                       onChange={e => updateStage(s.id, "amount", e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md text-sm"
//                       min="0"
//                     />
//                   </td>
//                   <td className="p-3">
//                     <input
//                       type="number"
//                       value={s.gstPercent}
//                       onChange={e => updateStage(s.id, "gstPercent", e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md text-sm"
//                       min="0"
//                       max="100"
//                     />
//                   </td>
//                   <td className="p-3 text-right font-medium">
//                     ₹{calculateGstAmt(s.amount, s.gstPercent)}
//                   </td>
//                   <td className="p-3 text-center">
//                     <button
//                       onClick={() => removeStage(s.id)}
//                       className="text-red-600 hover:text-red-800 text-xl"
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <p className="text-xs text-gray-600 mt-2">
//           <strong>Tip:</strong> Enter GST at stage-level or change overall GST percent below (if you want one GST for whole bill)
//         </p>
//       </div>

//       {/* Overall GST, Other Charges, Discount */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Overall GST % (optional)</label>
//           <input
//             type="number"
//             value={overallGst}
//             onChange={e => setOverallGst(e.target.value)}
//             placeholder="18"
//             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//             min="0"
//           />
//           <p className="text-xs text-gray-600 mt-1">
//             If set (&gt; 0), final totals will use this GST % applied on subtotal instead of summing stage GSTs.
//           </p>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Other Charges (₹)</label>
//           <input
//             type="number"
//             value={otherCharges}
//             onChange={e => setOtherCharges(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//             min="0"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Discount (₹)</label>
//           <input
//             type="number"
//             value={discount}
//             onChange={e => setDiscount(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md text-sm"
//             min="0"
//           />
//         </div>
//       </div>

//       {/* Totals */}
//       <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Subtotal</label>
//           <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
//             ₹{subtotal.toFixed(2)}
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">GST Total</label>
//           <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
//             ₹{gstTotal.toFixed(2)}
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Other Charges</label>
//           <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
//             ₹{other}
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Discount</label>
//           <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
//             -₹{disc}
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Final Total</label>
//           <div className="p-2 bg-[#398C89] text-white rounded-md text-right font-bold text-lg">
//             ₹{finalTotal.toFixed(2)}
//           </div>
//         </div>
//       </div>

//       {/* Remark */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
//         <textarea
//           value={remark}
//           onChange={e => setRemark(e.target.value)}
//           placeholder="Enter remarks or billing notes..."
//           rows={3}
//           className="w-full p-3 border border-gray-300 rounded-md text-sm resize-vertical"
//         />
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-3">
//         <button
//           onClick={handleReset}
//           className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
//         >
//           Reset
//         </button>
//         <button
//           onClick={handleSave}
//           className="px-6 py-2 bg-[#398C89] text-white rounded-md text-sm font-medium hover:bg-[#2e706e]"
//         >
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ExpertBill;





// src/pages/Admin/Experts/ExpertBill.jsx
import React, { useState, useEffect } from "react";
import Select from 'react-select';
import apiClient, { apiHelpers, apiEndpoints } from "../../../services/apiClient";

const ExpertBill = () => {
  const [experts, setExperts] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]); // All doctors from API
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Doctors filtered based on expert's cases
  const [doctorCases, setDoctorCases] = useState([]);
  const [expert, setExpert] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [caseNo, setCaseNo] = useState("");
  const [caseType, setCaseType] = useState("");
  const [stages, setStages] = useState([
    { id: 1, stage: "Expert Opinion", amount: 4000, gstPercent: 18 },
    { id: 2, stage: "Medical Review", amount: 6000, gstPercent: 18 },
  ]);
  const [overallGst, setOverallGst] = useState("");
  const [otherCharges, setOtherCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState({
    experts: false,
    allDoctors: false,
    cases: false
  });
  const [error, setError] = useState({
    experts: null,
    allDoctors: null,
    cases: null
  });

  // Fetch experts and all doctors data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch experts
        setLoading(prev => ({ ...prev, experts: true }));
        const expertsResponse = await apiClient.get(apiEndpoints.experts.list, {
          params: { page: 1, limit: 1000 }
        });

        if (expertsResponse.data.success) {
          setExperts(expertsResponse.data.data || []);
        } else {
          setError(prev => ({ ...prev, experts: expertsResponse.data.message || "Failed to load experts" }));
        }
      } catch (err) {
        console.error("Error fetching experts:", err);

        // Handle specific error cases
        if (err.response?.status === 403) {
          setError(prev => ({ ...prev, experts: "Access denied: You don't have permission to view experts" }));
        } else if (err.response?.status === 401) {
          setError(prev => ({ ...prev, experts: "Authentication required. Please log in again." }));
        } else {
          setError(prev => ({ ...prev, experts: err.response?.data?.message || "Error loading experts" }));
        }
      } finally {
        setLoading(prev => ({ ...prev, experts: false }));
      }

      try {
        // Fetch all doctors for reference
        setLoading(prev => ({ ...prev, allDoctors: true }));
        const doctorsResponse = await apiClient.get(apiEndpoints.doctors.list, {
          params: { page: 1, limit: 1000 }
        });
        if (doctorsResponse.data.success) {
          setAllDoctors(doctorsResponse.data.data || []);
        } else {
          setError(prev => ({ ...prev, allDoctors: doctorsResponse.data.message || "Failed to load doctors" }));
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(prev => ({ ...prev, allDoctors: err.response?.data?.message || "Error loading doctors" }));
      } finally {
        setLoading(prev => ({ ...prev, allDoctors: false }));
      }
    };

    fetchData();
  }, []);

  // Function to extract unique doctors from cases
  const extractUniqueDoctorsFromCases = (cases) => {
    const uniqueDoctorsMap = new Map();

    cases.forEach(caseItem => {
      if (caseItem.doctorId && caseItem.doctorName) {
        // Check if we already have this doctor in the map
        if (!uniqueDoctorsMap.has(caseItem.doctorId)) {
          uniqueDoctorsMap.set(caseItem.doctorId, {
            doctorId: caseItem.doctorId,
            doctorName: caseItem.doctorName,
            // Find full doctor details from allDoctors list if available
            doctorDetails: allDoctors.find(d =>
              d.doctorId === caseItem.doctorId ||
              d.fullName === caseItem.doctorName
            )
          });
        }
      }
    });

    return Array.from(uniqueDoctorsMap.values());
  };

  // Function to fetch cases for a selected expert
  const fetchCasesForExpert = async (expertId) => {
    try {
      setLoading(prev => ({ ...prev, cases: true }));
      setError(prev => ({ ...prev, cases: null }));

      // Fetch cases for the selected expert
      const casesResponse = await apiClient.get('/query-cases', {
        params: { assignedExpert: expertId }
      });

      if (casesResponse.data.success) {
        const fetchedCases = casesResponse.data.data || [];
        setDoctorCases(fetchedCases);

        // Extract unique doctors from these cases
        const uniqueDoctors = extractUniqueDoctorsFromCases(fetchedCases);

        // Create filtered doctors list for dropdown
        const filteredDoctorOptions = uniqueDoctors.map(doc => ({
          value: doc.doctorId, // Use doctorId as value
          label: `${doc.doctorName} (${doc.doctorId})`,
          doctorName: doc.doctorName,
          doctorId: doc.doctorId
        }));

        setFilteredDoctors(filteredDoctorOptions);

        // Clear doctor, caseNo and caseType when expert changes
        setDoctor(null);
        setCaseNo("");
        setCaseType("");

      } else {
        setDoctorCases([]);
        setFilteredDoctors([]);
        setDoctor(null);
        setCaseNo("");
        setCaseType("");
        setError(prev => ({ ...prev, cases: casesResponse.data.message || "Failed to load cases" }));
      }
    } catch (err) {
      console.error("Error fetching cases for expert:", err);
      setDoctorCases([]);
      setFilteredDoctors([]);
      setDoctor(null);
      setCaseNo("");
      setCaseType("");
      setError(prev => ({ ...prev, cases: err.response?.data?.message || "Error loading cases" }));
    } finally {
      setLoading(prev => ({ ...prev, cases: false }));
    }
  };

  // Function to auto-fill case details when doctor is selected
  const autoFillCaseDetails = (doctorId) => {
    if (!doctorId) return;

    // Find cases for this specific doctor
    const casesForDoctor = doctorCases.filter(caseItem =>
      caseItem.doctorId === doctorId
    );

    if (casesForDoctor.length > 0) {
      // Take the first case (you can modify logic if needed, e.g., latest case)
      const firstCase = casesForDoctor[0];

      // Auto-fill caseNo and caseType
      setCaseNo(firstCase.caseNo || "");
      setCaseType(firstCase.caseType || "");

      return firstCase;
    }

    return null;
  };

  // Handle doctor selection - with auto-fill
  const handleDoctorChange = (selectedOption) => {
    setDoctor(selectedOption);

    if (selectedOption) {
      // Auto-fill case details for the selected doctor
      const autoFilledCase = autoFillCaseDetails(selectedOption.value);

      if (!autoFilledCase) {
        // If no cases found for this doctor, clear case fields
        setCaseNo("");
        setCaseType("");
      }
    } else {
      // If doctor is cleared, clear case fields
      setCaseNo("");
      setCaseType("");
    }
  };

  // Handle case selection manually (if user wants to change from auto-filled)
  const handleCaseNoChange = (selectedOption) => {
    if (selectedOption) {
      // Find the complete case details
      const selectedCase = doctorCases.find(c => c.caseNo === selectedOption.value);
      if (selectedCase) {
        setCaseNo(selectedCase.caseNo || "");
        setCaseType(selectedCase.caseType || "");
      }
    } else {
      setCaseNo("");
      setCaseType("");
    }
  };

  // Get cases for selected doctor
  const getCasesForSelectedDoctor = () => {
    if (!doctor) return [];

    return doctorCases.filter(caseItem =>
      caseItem.doctorId === doctor.value
    );
  };

  // Auto calculate GST Amount per stage
  const calculateGstAmt = (amount, gstPercent) => {
    return ((amount * gstPercent) / 100).toFixed(2);
  };

  // Add new stage
  const addStage = () => {
    const newStage = {
      id: Date.now(),
      stage: "",
      amount: 0,
      gstPercent: 18,
    };
    setStages([...stages, newStage]);
  };

  // Remove stage
  const removeStage = (id) => {
    setStages(stages.filter(s => s.id !== id));
  };

  // Update stage
  const updateStage = (id, field, value) => {
    setStages(stages.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // Calculate Totals
  const calculateTotals = () => {
    let subtotal = 0;
    let gstTotal = 0;

    stages.forEach(s => {
      const amount = parseFloat(s.amount) || 0;
      const gstPercent = parseFloat(s.gstPercent) || 0;
      subtotal += amount;
      gstTotal += (amount * gstPercent) / 100;
    });

    // Apply Overall GST if set
    if (overallGst && parseFloat(overallGst) > 0) {
      gstTotal = (subtotal * parseFloat(overallGst)) / 100;
    }

    const other = parseFloat(otherCharges) || 0;
    const disc = parseFloat(discount) || 0;
    const finalTotal = subtotal + gstTotal + other - disc;

    return { subtotal, gstTotal, other, disc, finalTotal };
  };

  const { subtotal, gstTotal, other, disc, finalTotal } = calculateTotals();

  const handleSave = async () => {
    // Validate required fields
    if (!expert) {
      alert("Please select an Expert");
      return;
    }
    if (!doctor) {
      alert("Please select a Doctor");
      return;
    }
    if (!caseNo) {
      alert("Please select a Case No");
      return;
    }
    if (!caseType) {
      alert("Please select a Case Type");
      return;
    }

    // Validate stages - ensure all stages have required fields
    const invalidStage = stages.find(s => !s.stage || !s.stage.trim());
    if (invalidStage) {
      alert("Please fill in the stage name for all stages");
      return;
    }

    try {
      // Remove the 'id' field from stages before sending to backend
      const cleanedStages = stages.map(({ id, ...rest }) => rest);

      // Find the actual doctor object from allDoctors to get the MongoDB ID
      const actualDoctor = allDoctors.find(d => d.doctorId === doctor.value || d._id === doctor.value);

      // Use the MongoDB _id for the doctor field, fallback to the selected value if not found
      const doctorIdToSend = actualDoctor?._id || doctor.value;

      const billData = {
        expert: expert.value,
        expertName: expert.label,
        doctor: doctorIdToSend, // Use the MongoDB ID
        doctorName: doctor.doctorName || actualDoctor?.fullName,
        caseNo,
        caseType,
        stages: cleanedStages,
        overallGst,
        otherCharges,
        discount,
        remark,
        totals: { subtotal, gstTotal, other, disc, finalTotal }
      };

      const response = await apiClient.post(apiEndpoints.expertBills.create, billData);

      if (response.data.success) {
        alert("Expert Bill saved successfully!");
        // Reset form after successful save
        handleReset();
      } else {
        alert(`Error: ${response.data.message || 'Failed to save expert bill'}`);
      }
    } catch (error) {
      console.error("Error saving expert bill:", error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while saving the expert bill';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all fields?")) {
      setExpert(null);
      setDoctor(null);
      setCaseNo("");
      setCaseType("");
      setDoctorCases([]);
      setFilteredDoctors([]);
      setStages([
        { id: 1, stage: "Expert Opinion", amount: 4000, gstPercent: 18 },
        { id: 2, stage: "Medical Review", amount: 6000, gstPercent: 18 },
      ]);
      setOverallGst("");
      setOtherCharges(0);
      setDiscount(0);
      setRemark("");
      setError(prev => ({ ...prev, cases: null }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Expert Bill</h1>
        <span className="text-sm text-gray-600">
          Create / Save expert billing with stage-wise amounts, GST & final total
        </span>
      </div>

      {/* Top Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        {/* Expert Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expert Name</label>
          <Select
            value={expert}
            onChange={async (selectedOption) => {
              setExpert(selectedOption);

              if (selectedOption) {
                await fetchCasesForExpert(selectedOption.value);
              } else {
                // If expert is cleared, clear all related fields
                setDoctor(null);
                setCaseNo("");
                setCaseType("");
                setDoctorCases([]);
                setFilteredDoctors([]);
              }
            }}
            options={experts.map(exp => ({
              value: exp._id,
              label: `${exp.fullName || exp.name || ''} ${exp.qualification ? `(${exp.qualification})` : ''}`
            }))}
            isLoading={loading.experts}
            isClearable
            isSearchable
            placeholder={error.experts ? error.experts : "Select or search expert..."}
            className="text-sm"
          />
        </div>

        {/* Doctor Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
          <Select
            value={doctor}
            onChange={handleDoctorChange}
            options={filteredDoctors}
            isLoading={loading.cases}
            isDisabled={!expert || loading.cases}
            isClearable
            isSearchable
            placeholder={
              !expert ? "Select expert first" :
              loading.cases ? "Loading doctors..." :
              filteredDoctors.length === 0 ? "No doctors found for this expert" :
              "Select doctor (case will auto-fill)"
            }
            className="text-sm"
          />

        </div>

        {/* Case No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Case No</label>
          <Select
            value={caseNo ? { value: caseNo, label: caseNo } : null}
            onChange={handleCaseNoChange}
            options={getCasesForSelectedDoctor().map(caseItem => ({
              value: caseItem.caseNo,
              label: `${caseItem.caseNo} (${caseItem.queryType})`
            }))}
            isDisabled={!doctor}
            isClearable
            isSearchable
            placeholder={
              !doctor ? "Select doctor first" :
              getCasesForSelectedDoctor().length === 0 ? "No cases for this doctor" :
              "Change case (auto-filled)"
            }
            className="text-sm"
          />

        </div>

        {/* Case Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
          <input
            type="text"
            value={caseType}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50 font-medium"
            placeholder={doctor ? "Auto-filled from case" : "Select doctor first"}
          />

        </div>
      </div>



      {/* Stage-wise Amounts */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Stage wise Amounts</h3>
          <span className="text-xs text-gray-600">
            Add multiple stages (e.g. Expert Opinion, Medical Review, Court Testimony)
          </span>
          <button
            onClick={addStage}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md text-sm font-medium hover:bg-[#2e706e] flex items-center gap-2"
          >
            Add Stage
          </button>
        </div>

        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Stage</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Amount (₹)</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">GST %</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">GST Amt (₹)</th>
                <th className="p-3 text-center text-sm font-medium text-gray-700">Remove</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((s, i) => (
                <tr key={s.id} className="border-t border-gray-200">
                  <td className="p-3">
                    <input
                      type="text"
                      value={s.stage}
                      onChange={e => updateStage(s.id, "stage", e.target.value)}
                      placeholder="e.g. Expert Opinion"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={s.amount}
                      onChange={e => updateStage(s.id, "amount", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      min="0"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={s.gstPercent}
                      onChange={e => updateStage(s.id, "gstPercent", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="p-3 text-right font-medium">
                    ₹{calculateGstAmt(s.amount, s.gstPercent)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeStage(s.id)}
                      className="text-red-600 hover:text-red-800 text-xl"
                      disabled={stages.length <= 1}
                    >
                      {stages.length > 1 ? "Remove" : "−"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-600 mt-2">
          <strong>Tip:</strong> Enter GST at stage-level or change overall GST percent below (if you want one GST for whole bill)
        </p>
      </div>

      {/* Overall GST, Other Charges, Discount */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Overall GST % (optional)</label>
          <input
            type="number"
            value={overallGst}
            onChange={e => setOverallGst(e.target.value)}
            placeholder="18"
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            min="0"
          />
          <p className="text-xs text-gray-600 mt-1">
            If set (&gt;0), final totals will use this GST % applied on subtotal instead of summing stage GSTs.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Other Charges (₹)</label>
          <input
            type="number"
            value={otherCharges}
            onChange={e => setOtherCharges(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount (₹)</label>
          <input
            type="number"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            min="0"
          />
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Subtotal</label>
          <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
            ₹{subtotal.toFixed(2)}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">GST Total</label>
          <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
            ₹{gstTotal.toFixed(2)}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Other Charges</label>
          <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
            ₹{other}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount</label>
          <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
            -₹{disc}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Final Total</label>
          <div className="p-2 bg-[#398C89] text-white rounded-md text-right font-bold text-lg">
            ₹{finalTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Remark */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
        <textarea
          value={remark}
          onChange={e => setRemark(e.target.value)}
          placeholder="Enter remarks or billing notes..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-md text-sm resize-vertical"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleReset}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={!expert || !doctor || !caseNo || !caseType}
          className={`px-6 py-2 rounded-md text-sm font-medium ${
            !expert || !doctor || !caseNo || !caseType
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#398C89] hover:bg-[#2e706e] text-white'
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ExpertBill;