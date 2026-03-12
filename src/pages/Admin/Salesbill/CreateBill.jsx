// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from "react-toastify";

// const SalesBillForm = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [loadingDoctors, setLoadingDoctors] = useState(false);
//   const [doctors, setDoctors] = useState([]);

//   const today = new Date().toISOString().split("T")[0];

//   // UI form state (matches the design in the screenshot)
//   const [formData, setFormData] = useState({
//     sbNo: "", // Optional manual SB No (billNumber)
//     sbDate: today,
//     type: "New", // New / Renewal etc.
//     oldSbNo: "",
//     doctorId: "",
//     membershipType: "Monthly",
//     membershipYear: "1",
//     particular: "",
//     amount: "",
//     expiry: "",
//     narration: "",
//     note: "",
//   });

//   // Fetch doctors with typeOfEnquiry = "closed" for the dropdown
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         setLoadingDoctors(true);
//         // Using the list endpoint with query parameters to filter by typeOfEnquiry
//         const response = await apiClient.get(apiEndpoints.doctors.list, {
//           params: { limit: 1000, typeOfEnquiry: "closed" },
//         });
//         setDoctors(response.data.data || []);
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//         toast.error("Failed to load doctors list");
//       } finally {
//         setLoadingDoctors(false);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   // Generic input change handler with special logic for doctor selection
//   const handleChange = async (e) => {
//     const { name, value } = e.target;

//     if (name === 'doctorId') {
//       // Update doctor ID
//       setFormData(prev => ({ ...prev, doctorId: value, oldSbNo: "" }));

//       // If a doctor is selected, fetch their latest SB number
//       if (value) {
//         try {
//           // Find the latest sales bill for this doctor
//           const response = await apiClient.get(apiEndpoints.salesBills.list, {
//             params: {
//               'client.entityId': value,
//               limit: 1,
//               sort: '-createdAt' // Get the most recent bill
//             }
//           });

//           if (response.data.success && response.data.data && response.data.data.length > 0) {
//             const latestBill = response.data.data[0];
//             setFormData(prev => ({
//               ...prev,
//               doctorId: value,
//               oldSbNo: latestBill.billNumber || "" // Auto-populate old SB number
//             }));
//           } else {
//             // If no previous bills found, just update the doctor ID
//             setFormData(prev => ({ ...prev, doctorId: value, oldSbNo: "" }));
//           }
//         } catch (error) {
//           console.error("Error fetching doctor's previous SB:", error);
//           // Still update the doctor ID but don't populate old SB No
//           setFormData(prev => ({ ...prev, doctorId: value, oldSbNo: "" }));
//         }
//       }
//     } else {
//       // For other fields, just update normally
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation aligned with screenshot fields
//     if (!formData.doctorId) {
//       toast.error("Please select a Doctor");
//       return;
//     }
//     if (!formData.expiry) {
//       toast.error("Please select Expiry date");
//       return;
//     }
//     if (!formData.amount) {
//       toast.error("Please enter Amount");
//       return;
//     }

//     setLoading(true);

//     try {
//       const amount = parseFloat(formData.amount) || 0;
//       const membershipYears = parseInt(formData.membershipYear, 10) || 1;
//       const quantity = 1; // Single bill line as per simple UI
//       const lineTotal = amount * quantity;

//       const selectedDoctor = doctors.find((d) => d._id === formData.doctorId);

//       // Build backend payload compatible with SalesBill model
//       const billData = {
//         // Use manual SB No if given; otherwise backend will auto-generate
//         ...(formData.sbNo && { billNumber: formData.sbNo }),
//         billDate: formData.sbDate,
//         dueDate: formData.expiry,
//         client: {
//           type: "doctor",
//           name: selectedDoctor?.fullName || "",
//           entityId: formData.doctorId,
//         },
//         items: [
//           {
//             serviceType: "consultation",
//             description:
//               formData.particular ||
//               `${formData.membershipType} Membership - ${membershipYears} Year(s)`,
//             quantity,
//             unitPrice: amount,
//             discount: 0,
//             taxRate: 0,
//             amount: lineTotal,
//           },
//         ],
//         subTotal: lineTotal,
//         discountAmount: 0,
//         taxAmount: 0,
//         totalAmount: lineTotal,
//         paymentTerms: "30_days",
//         currency: "INR",
//         status: "draft",
//         outstandingAmount: lineTotal,
//         notes: formData.narration
//           ? `${formData.narration}${formData.note ? " - " + formData.note : ""}`
//           : formData.note,
//       };

//       const response = await apiClient.post(apiEndpoints.salesBills.create, billData);

//       if (response.data.success) {
//         toast.success("Sales Bill created successfully!");
//         navigate("/admin/salesbill/list");
//       } else {
//         toast.error(response.data.message || "Failed to create sales bill");
//       }
//     } catch (error) {
//       console.error("Error creating sales bill:", error);
//       toast.error(error.response?.data?.message || "Error creating sales bill");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate("/admin/salesbill/list");
//   };

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white rounded-lg">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Bill</h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Row 1: SB details & Doctor */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">SB No</label>
//             <input
//               type="text"
//               name="sbNo"
//               value={formData.sbNo}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               placeholder="Auto if blank"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">SB Date</label>
//             <input
//               type="date"
//               name="sbDate"
//               value={formData.sbDate}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Type</label>
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             >
//               <option value="New">New</option>
//               <option value="Renewal">Renewal</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Old SB No</label>
//             <input
//               type="text"
//               name="oldSbNo"
//               value={formData.oldSbNo}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Doctor</label>
//             <select
//               name="doctorId"
//               value={formData.doctorId}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             >
//               <option value="">
//                 {loadingDoctors ? "Loading..." : "Select Doctor"}
//               </option>
//               {doctors.map((doc) => (
//                 <option key={doc._id} value={doc._id}>
//                   {doc.fullName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Row 2: Membership & Particular */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Membership Type
//             </label>
//             <select
//               name="membershipType"
//               value={formData.membershipType}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             >
//               <option value="Monthly">Monthly</option>
//               <option value="Yearly">Yearly</option>
//               <option value="One-time">One-time</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Membership Year
//             </label>
//             <select
//               name="membershipYear"
//               value={formData.membershipYear}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             >
//               {Array.from({ length: 10 }, (_, i) => i + 1).map((year) => (
//                 <option key={year} value={year.toString()}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Particular
//             </label>
//             <input
//               type="text"
//               name="particular"
//               value={formData.particular}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               placeholder="Note"
//             />
//           </div>
//         </div>

//         {/* Row 3: Amount, Expiry, Narration */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Amount</label>
//             <input
//               type="number"
//               name="amount"
//               value={formData.amount}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               placeholder="0.00"
//               min="0"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Expiry</label>
//             <input
//               type="date"
//               name="expiry"
//               value={formData.expiry}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Narration
//             </label>
//             <input
//               type="text"
//               name="narration"
//               value={formData.narration}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             />
//           </div>
//         </div>

//         {/* Row 4: Note */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Note</label>
//           <textarea
//             name="note"
//             value={formData.note}
//             onChange={handleChange}
//             rows={3}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-start space-x-3 mt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors disabled:opacity-60"
//           >
//             {loading ? "Saving..." : "Save"}
//           </button>
//           <button
//             type="button"
//             onClick={handleCancel}
//             className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SalesBillForm;


























// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from "react-toastify";
// import Select from "react-select";




// const SalesBillForm = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [loadingDoctors, setLoadingDoctors] = useState(false);
//   const [doctors, setDoctors] = useState([]);
//   const [fetchingPreviousBill, setFetchingPreviousBill] = useState(false); // Optional UX

//   const today = new Date().toISOString().split("T")[0];

//   const [formData, setFormData] = useState({
//     sbNo: "",
//     sbDate: today,
//     type: "New",
//     oldSbNo: "",
//     doctorId: "",
//     membershipType: "Monthly",
//     membershipYear: "1",
//     particular: "",
//     amount: "",
//     expiry: "",
//     narration: "",
//     note: "",
//   });

//   // Fetch only closed enquiry doctors
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         setLoadingDoctors(true);
//         const response = await apiClient.get(apiEndpoints.doctors.list, {
//           params: { limit: 1000, typeOfEnquiry: "closed" },
//         });
//         setDoctors(response.data.data || []);
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//         toast.error("Failed to load doctors list");
//       } finally {
//         setLoadingDoctors(false);
//       }
//     };

//     fetchDoctors();
//   }, []);





// const yearOptions = Array.from({ length: 40 }, (_, i) => ({
//   value: String(i + 1), // string rakho kyunki formData me string hai
//   label: `${i + 1}`,
// }));





//   // Main Change Handler
//   const handleChange = async (e) => {
//     const { name, value } = e.target;

//     if (name === "doctorId") {
//       if (!value) {
//         setFormData(prev => ({
//           ...prev,
//           doctorId: "",
//           oldSbNo: "",
//           type: "New",
//         }));
//         return;
//       }

//       // Reset first
//       setFormData(prev => ({
//         ...prev,
//         doctorId: value,
//         oldSbNo: "",
//         type: "New",
//       }));

//       setFetchingPreviousBill(true);

//       try {
//         // Correct query to fetch only this doctor's previous bills
//         const response = await apiClient.get(apiEndpoints.salesBills.list, {
//           params: {
//             // "client.entityId": value,      // This must match your backend field exactly
//         "client.entityId._id": value,
//             "client.type": "doctor",       // Extra safety
//             limit: 1,
//             sort: "-createdAt",
//             status: { $ne: "cancelled" },  // Ignore cancelled bills
//           },
//         });

//         const bills = response.data?.data || [];

//         if (bills.length > 0) {
//           const latestBill = bills[0];
//           setFormData(prev => ({
//             ...prev,
//             doctorId: value,
//             oldSbNo: latestBill.billNumber || "",
//             type: "Renewal", // Auto set to Renewal
//           }));
//           toast.success(`Renewal from: ${latestBill.billNumber}`, { autoClose: 2000 });
//         } else {
//           setFormData(prev => ({
//             ...prev,
//             doctorId: value,
//             oldSbNo: "",
//             type: "New",
//           }));
//           toast.info("New Membership Bill", { autoClose: 2000 });
//         }
//       } catch (error) {
//         console.error("Error fetching previous bill:", error);
//         toast.warn("Could not check previous bill");
//         setFormData(prev => ({ ...prev, doctorId: value })); // Still keep doctor
//       } finally {
//         setFetchingPreviousBill(false);
//       }
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };







// // Add this function inside your component
// const calculateExpiryDate = () => {
//   const startDate = new Date(formData.sbDate);
//   const years = parseInt(formData.membershipYear) || 1;

//   // Add exact 'years' to the date
//   const expiryDate = new Date(startDate);
//   expiryDate.setFullYear(startDate.getFullYear() + years);

//   // Subtract 1 day → so it becomes "1 day before" the anniversary
//   expiryDate.setDate(expiryDate.getDate() - 1);

//   // Format as YYYY-MM-DD for input[type="date"]
//   const formatted = expiryDate.toISOString().split("T")[0];

//   // Auto update expiry field
//   setFormData(prev => ({ ...prev, expiry: formatted }));
// };

// // Call this whenever sbDate or membershipYear changes
// useEffect(() => {
//   if (formData.sbDate && formData.membershipYear) {
//     calculateExpiryDate();
//   }
// }, [formData.sbDate, formData.membershipYear]);






//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.doctorId) return toast.error("Please select a Doctor");
//     if (!formData.expiry) return toast.error("Please select Expiry date");
//     if (!formData.amount || parseFloat(formData.amount) <= 0)
//       return toast.error("Please enter valid Amount");

//     setLoading(true);

//     try {
//       const amount = parseFloat(formData.amount);
//       // const years = parseInt(formData.membershipYear, 40) || 1;
//        const years = Number(formData.membershipYear) || 1;
//       const selectedDoctor = doctors.find(d => d._id === formData.doctorId);

//       const payload = {
//         ...(formData.sbNo && { billNumber: formData.sbNo }),
//         billDate: formData.sbDate,
//         membershipType: formData.membershipType === "One-time" ? null : formData.membershipType === "Monthly" ? "monthly" : "yearly",
//         dueDate: formData.expiry,
//         client: {
//           type: "doctor",
//           name: selectedDoctor?.fullName || "Unknown Doctor",
//           entityId: formData.doctorId,
//         },

// // Ye do fields add karo — renewal identify karne ke liye perfect hain
//   type: formData.type.toLowerCase(),                    // "new" | "renewal"
//   renewalFrom: formData.type === "Renewal" ? formData.oldSbNo : null,



//         items: [
//           {
//             serviceType: "consultation",
//             description:
//               formData.particular ||
//               `${formData.membershipType} Membership - ${years} Year(s)`,
//             // quantity: 1,
//              quantity: years,
//             unitPrice: amount,
//             discount: 0,
//             taxRate: 0,
//             amount: amount,
//           },
//         ],
//         subTotal: amount,
//         totalAmount: amount,
//         outstandingAmount: amount,
//         paymentTerms: "30_days",
//         currency: "INR",
//         // status: "draft",
//         status: formData.type === "Renewal" ? "renewal" : "draft",
//         notes: [formData.narration, formData.note].filter(Boolean).join(" - "),
//       };

//       const response = await apiClient.post(apiEndpoints.salesBills.create, payload);

//       // if (response.data.success) {
//       //   toast.success(`Sales Bill ${formData.type === "Renewal" ? "Renewed" : "Created"} Successfully!`);
//       //   // navigate("/admin/salesbill/list");
//       //   navigate("/admin/salesbill/print/:");
//       // } else {
//       //   toast.error(response.data.message || "Failed to create bill");
//       // }





// if (response.data.success) {
//   const billId = response.data.data?._id;

//   // Toast ko thoda lamba dikhao taaki user dekh sake
//   toast.success(
//     `Sales Bill ${formData.type === "Renewal" ? "Renewed" : "Created"} Successfully! Redirecting to print...`,
//     {
//       autoClose: 3200,   // 3 seconds
//       hideProgressBar: false,
//       position: "top-center"
//     }
//   );

//   // 2.5 seconds baad redirect (toast ke saath sync rahega)
//   setTimeout(() => {
//     navigate(`/admin/salesbill/print/${billId}`);
//   }, 2500);

// } else {
//   toast.error(response.data.message || "Failed to create bill");
// }

//     } catch (error) {
//       console.error("Submit error:", error);
//       toast.error(error.response?.data?.message || "Error creating sales bill");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => navigate("/admin/salesbill/list");

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Sales Bill</h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Row 1 */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">SB No</label>
//             <input
//               type="text"
//               name="sbNo"
//               value={formData.sbNo}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
//               placeholder="Auto-generated"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">SB Date</label>
//             <input
//               type="date"
//               name="sbDate"
//               value={formData.sbDate}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Type</label>
//             <input
//               type="text"
//               value={formData.type}
//               readOnly
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200 font-medium text-gray-700"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Old SB No</label>
//             <input
//               type="text"
//               value={formData.oldSbNo}
//               readOnly
//               className={`mt-1 p-2 w-full border rounded-md font-medium ${
//                 formData.oldSbNo
//                   ? "bg-green-50 border-green-400 text-green-700"
//                   : "bg-gray-100 border-gray-300 text-gray-500"
//               }`}
//               placeholder={formData.oldSbNo ? "" : "None"}
//             />
//             {fetchingPreviousBill && (
//               <p className="text-xs text-blue-600 mt-1">Checking previous bill...</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Doctor *</label>
//             <select
//               name="doctorId"
//               value={formData.doctorId}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
//               required
//             >
//               <option value="">{loadingDoctors ? "Loading..." : "Select Doctor"}</option>
//               {doctors.map((doc) => (
//                 <option key={doc._id} value={doc._id}>
//                   {doc.fullName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Row 2 */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Membership Type</label>
//             <select
//               name="membershipType"
//               value={formData.membershipType}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
//             >
//               <option value="Monthly">Monthly</option>
//               <option value="Yearly">Yearly</option>
//               <option value="One-time">One-time</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Years</label>
//             {/* <select
//               name="membershipYear"
//               value={formData.membershipYear}
//               onChange={handleChange}

//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
//             >
//               {[...Array(40)].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>{i + 1}</option>
//               ))}
//             </select> */}








// <Select
//   options={yearOptions}
//   value={yearOptions.find(
//     (opt) => opt.value === formData.membershipYear
//   )}
//   onChange={(selected) =>
//     setFormData((prev) => ({
//       ...prev,
//       membershipYear: selected.value,
//     }))
//   }
//   isSearchable={false}
//   maxMenuHeight={150}   // 👈 dropdown height FIX + scroll
//   className="mt-1"
//   styles={{
//     control: (base) => ({
//       ...base,
//       minHeight: "42px",
//       borderColor: "#d1d5db", // gray-300
//       backgroundColor: "#f9fafb", // gray-50
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 50, // overlap issues avoid
//     }),
//   }}
// />



//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700">Particular (Optional)</label>
//             <input
//               type="text"
//               name="particular"
//               value={formData.particular}
//               onChange={handleChange}
//               placeholder="Custom description (if any)"
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
//             />
//           </div>
//         </div>

//         {/* Row 3 */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Amount *</label>
//             <input
//               type="number"
//               name="amount"
//               value={formData.amount}
//               onChange={handleChange}
//               min="1"
//               step="0.01"
//               placeholder="0.00"
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
//               required
//             />
//           </div>

//           {/* <div>
//             <label className="block text-sm font-medium text-gray-700">Expiry Date *</label>
//             <input
//               type="date"
//               name="expiry"
//               value={formData.expiry}
//               onChange={handleChange}
//               min={today}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
//               required
//             />
//           </div> */}




//           <div>
//   <label className="block text-sm font-medium text-gray-700">
//     Expiry Date *
//     <span className="text-xs text-blue-600 ml-2">(Auto-calculated)</span>
//   </label>
//   <input
//     type="date"
//     name="expiry"
//     value={formData.expiry}
//     onChange={handleChange}
//     min={today}
//     className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-blue-50 font-medium"
//     required
//   />
//   <p className="text-xs text-gray-500 mt-1">
//     Based on {formData.membershipYear} year(s) from {formData.sbDate}
//   </p>
// </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Narration</label>
//             <input
//               type="text"
//               name="narration"
//               value={formData.narration}
//               onChange={handleChange}
//               placeholder="Payment remarks"
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
//             />
//           </div>
//         </div>

//         {/* Note */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Internal Note</label>
//           <textarea
//             name="note"
//             value={formData.note}
//             onChange={handleChange}
//             rows={3}
//             placeholder="Any internal notes (not visible to doctor)"
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-start gap-4 pt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-8 py-2.5 bg-[#398C89] text-white font-medium rounded-md hover:bg-[#2e706e] transition disabled:opacity-60"
//           >
//             {loading ? "Saving..." : "Save Bill"}
//           </button>
//           <button
//             type="button"
//             onClick={handleCancel}
//             className="px-8 py-2.5 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SalesBillForm;










import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";
import Select from "react-select";

const SalesBillForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // ✅ PERSISTENT SELECTION
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [fetchingPreviousBill, setFetchingPreviousBill] = useState(false);
  const debounceTimerRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    sbNo: "",
    sbDate: today,
    type: "New",
    oldSbNo: "",
    doctorId: "",
    membershipType: "Monthly",
    membershipYear: "1",
    particular: "",
    amount: "",
    expiry: "",
    narration: "",
    note: "",
  });

  // ✅ FETCH DOCTORS - Server-side search implementation
  const fetchDoctorsBySearch = useCallback(async (searchQuery = "") => {
    try {
      setLoadingDoctors(true);
      const response = await apiClient.get(apiEndpoints.doctors.list, {
        params: {
          limit: searchQuery ? 50 : 10, // Search ke waqt thoda kam, shuru me thoda zyada
          typeOfEnquiry: "closed",
          populate: "hospitalAddress,membership",
          ...(searchQuery && searchQuery.trim() ? { search: searchQuery.trim() } : {})
        },
      });

      const doctorsData = response.data.data || [];
      setDoctors(doctorsData);

      // ✅ Convert doctors to react-select format
      const options = doctorsData.map((doctor) => ({
        value: doctor._id,
        label: `${doctor.fullName || "No Name"}${doctor.hospitalName ? ` - ${doctor.hospitalName}` : ""}${doctor.membershipId ? ` (${doctor.membershipId})` : ""
          }${doctor.phoneNumber ? ` 📞 ${doctor.phoneNumber}` : ""
          }`,
        doctorData: doctor,
      }));

      setDoctorOptions(options);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors list");
      setDoctorOptions([]);
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  // ✅ DEBOUNCED SEARCH HANDLER
  const handleDoctorSearchInputChange = useCallback((value, { action }) => {
    // Sirf typing par hi search trigger karo, select ya blur par nahi
    if (action === "input-change") {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        fetchDoctorsBySearch(value);
      }, 500); // 500ms delay for performance
    }
  }, [fetchDoctorsBySearch]);

  // Initial load
  useEffect(() => {
    fetchDoctorsBySearch("");
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [fetchDoctorsBySearch]);

  useEffect(() => {
    const renewFromId = searchParams.get('renew_from');
    const doctorIdFromParam = searchParams.get('doctor_id');

    if (renewFromId) {
      const fetchBillForRenewal = async () => {
        setLoading(true);
        try {
          const response = await apiClient.get(apiEndpoints.salesBills.get(renewFromId));
          if (response.data.success) {
            const billToRenew = response.data.data;

            let membershipType = "One-time";
            if (billToRenew.membershipType === 'monthly') {
              membershipType = "Monthly";
            } else if (billToRenew.membershipType === 'yearly') {
              membershipType = "Yearly";
            }

            setFormData(prev => ({
              ...prev,
              type: 'Renewal',
              oldSbNo: billToRenew.billNumber,
              doctorId: billToRenew.client?.entityId?._id || billToRenew.client?.entityId,
              membershipType: membershipType,
              membershipYear: (billToRenew.items?.[0]?.quantity?.toString() || '1'),
              particular: billToRenew.items?.[0]?.description || '',
              amount: billToRenew.items?.[0]?.unitPrice || '',
              sbDate: today,
              narration: billToRenew.narration || '',
              note: billToRenew.internalNote || '',
            }));

            toast.info(`Renewing from Sales Bill: ${billToRenew.billNumber}`);
          } else {
            toast.error('Could not fetch sales bill data for renewal.');
          }
        } catch (error) {
          console.error("Error fetching bill for renewal:", error);
          toast.error('Failed to load data for renewal.');
        } finally {
          setLoading(false);
        }
      };

      fetchBillForRenewal();
    } else if (doctorIdFromParam) {
      // Auto-select the doctor when coming from renewal reminder
      // And fetch the doctor's previous sales bill to auto-populate type and old SB No
      setFormData(prev => ({
        ...prev,
        doctorId: doctorIdFromParam
      }));

      // Fetch previous bill for this doctor to auto-populate type and old SB No
      const fetchPreviousBill = async () => {
        setFetchingPreviousBill(true);
        try {
          // Query sales bills for this specific doctor - using the correct nested field query
          const response = await apiClient.get(apiEndpoints.salesBills.list, {
            params: {
              "client.entityId._id": doctorIdFromParam,  // Correct way to query nested _id
              "client.type": "doctor",
              limit: 1,
              sort: "-createdAt",
              status: { $ne: "cancelled" },
            },
          });

          const bills = response.data?.data || [];

          if (bills.length > 0) {
            const latestBill = bills[0];
            setFormData(prev => ({
              ...prev,
              doctorId: doctorIdFromParam,
              oldSbNo: latestBill.billNumber || "",
              type: "Renewal", // Auto set to Renewal if previous bill exists
            }));
            toast.success(`Renewal from: ${latestBill.billNumber}`, { autoClose: 2000 });
          } else {
            setFormData(prev => ({
              ...prev,
              doctorId: doctorIdFromParam,
              oldSbNo: "",
              type: "New", // Set to New if no previous bill exists
            }));
            toast.info("New Membership Bill", { autoClose: 2000 });
          }
        } catch (error) {
          console.error("Error fetching previous bill:", error);
          toast.warn("Could not check previous bill");
          setFormData(prev => ({ ...prev, doctorId: doctorIdFromParam, type: "New" }));
        } finally {
          setFetchingPreviousBill(false);
        }
      };

      fetchPreviousBill();
    }
  }, [searchParams]);

  // ✅ YEAR OPTIONS for react-select
  const yearOptions = Array.from({ length: 40 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} Year${i > 0 ? 's' : ''}`,
  }));

  // ✅ MEMBERSHIP TYPE OPTIONS for react-select
  const membershipTypeOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
    { value: "One-time", label: "One-time" },
  ];

  // ✅ MAIN CHANGE HANDLER for regular inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ DOCTOR SELECTION HANDLER for react-select
  const handleDoctorSelect = async (selectedOption) => {
    if (!selectedOption) {
      // Reset if doctor is cleared
      setSelectedDoctor(null);
      setFormData(prev => ({
        ...prev,
        doctorId: "",
        oldSbNo: "",
        type: "New",
      }));
      return;
    }

    const doctorId = selectedOption.value;
    setSelectedDoctor(selectedOption.doctorData); // ✅ Save full object

    // Set doctor immediately in form
    setFormData(prev => ({
      ...prev,
      doctorId: doctorId,
      oldSbNo: "",
      type: "New",
    }));

    setFetchingPreviousBill(true);

    try {
      // Fetch previous bill for this doctor
      const response = await apiClient.get(apiEndpoints.salesBills.list, {
        params: {
          "client.entityId._id": doctorId,
          "client.type": "doctor",
          limit: 1,
          sort: "-createdAt",
          status: { $ne: "cancelled" },
        },
      });

      const bills = response.data?.data || [];

      if (bills.length > 0) {
        const latestBill = bills[0];
        setFormData(prev => ({
          ...prev,
          doctorId: doctorId,
          oldSbNo: latestBill.billNumber || "",
          type: "Renewal",
        }));
        toast.success(`Renewal from: ${latestBill.billNumber}`, { autoClose: 2000 });
      } else {
        setFormData(prev => ({
          ...prev,
          doctorId: doctorId,
          oldSbNo: "",
          type: "New",
        }));
        toast.info("New Membership Bill", { autoClose: 2000 });
      }
    } catch (error) {
      console.error("Error fetching previous bill:", error);
      toast.warn("Could not check previous bill");
      setFormData(prev => ({ ...prev, doctorId: doctorId }));
    } finally {
      setFetchingPreviousBill(false);
    }
  };

  // ✅ CALCULATE EXPIRY DATE
  const calculateExpiryDate = () => {
    const startDate = new Date(formData.sbDate);
    const years = parseInt(formData.membershipYear) || 1;

    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(startDate.getFullYear() + years);
    expiryDate.setDate(expiryDate.getDate() - 1);

    const formatted = expiryDate.toISOString().split("T")[0];
    setFormData(prev => ({ ...prev, expiry: formatted }));
  };

  useEffect(() => {
    if (formData.sbDate && formData.membershipYear) {
      calculateExpiryDate();
    }
  }, [formData.sbDate, formData.membershipYear]);

  // ✅ HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.doctorId) return toast.error("Please select a Doctor");
    if (!formData.expiry) return toast.error("Please select Expiry date");
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      return toast.error("Please enter valid Amount");

    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      const years = Number(formData.membershipYear) || 1;

      // Use the stored selectedDoctor state instead of searching in the 'doctors' array
      // which might have changed during subsequent searches.
      const selectedDoctorDoc = selectedDoctor;

      const payload = {
        ...(formData.sbNo && { billNumber: formData.sbNo }),
        billDate: formData.sbDate,
        membershipType: formData.membershipType === "One-time" ? null : formData.membershipType === "Monthly" ? "monthly" : "yearly",
        dueDate: formData.expiry,
        client: {
          type: "doctor",
          name: selectedDoctorDoc?.fullName || "Unknown Doctor",
          entityId: formData.doctorId,
        },
        type: formData.type.toLowerCase(),
        renewalFrom: formData.type === "Renewal" ? formData.oldSbNo : null,
        items: [
          {
            serviceType: "consultation",
            description:
              formData.particular ||
              // `${formData.membershipType} Membership - ${years} Year(s)`,
              `${formData.membershipType} Membership`,
            quantity: years,
            unitPrice: amount,
            discount: 0,
            taxRate: 0,
            amount: amount,
          },
        ],
        subTotal: amount,
        totalAmount: amount,
        outstandingAmount: amount,
        paymentTerms: "30_days",
        currency: "INR",
        status: formData.type === "Renewal" ? "renewal" : "draft",
        narration: formData.narration || "", // Narration alag
        internalNote: formData.note || "",
        notes: formData.narration || "",
      };

      const response = await apiClient.post(apiEndpoints.salesBills.create, payload);

      if (response.data.success) {
        const billId = response.data.data?._id;

        toast.success(
          `Sales Bill ${formData.type === "Renewal" ? "Renewed" : "Created"} Successfully! Redirecting to print...`,
          {
            autoClose: 3200,
            hideProgressBar: false,
            position: "top-center"
          }
        );

        setTimeout(() => {
          navigate(`/admin/salesbill/print/${billId}`);
        }, 2500);
      } else {
        toast.error(response.data.message || "Failed to create bill");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Error creating sales bill");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/admin/salesbill/list");

  // ✅ CUSTOM STYLES FOR REACT-SELECT
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      borderColor: state.isFocused ? "#398C89" : "#d1d5db",
      backgroundColor: "#f9fafb",
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
    }),
    singleValue: (base) => ({
      ...base,
      color: "#1f2937",
    }),
  };

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Sales Bill</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">SB No</label>
            <input
              type="text"
              name="sbNo"
              value={formData.sbNo}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
              placeholder="Auto-generated"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">SB Date</label>
            <input
              type="date"
              name="sbDate"
              value={formData.sbDate}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              value={formData.type}
              readOnly
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200 font-medium text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Old SB No</label>
            <input
              type="text"
              value={formData.oldSbNo}
              readOnly
              className={`mt-1 p-2 w-full border rounded-md font-medium ${formData.oldSbNo
                ? "bg-green-50 border-green-400 text-green-700"
                : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              placeholder={formData.oldSbNo ? "" : "None"}
            />
            {fetchingPreviousBill && (
              <p className="text-xs text-blue-600 mt-1">Checking previous bill...</p>
            )}
          </div>

          {/* ✅ DOCTOR SELECT - REACT-SELECT VERSION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
            <Select
              name="doctorId"
              options={doctorOptions}
              value={doctorOptions.find(option => option.value === formData.doctorId) || null}
              onChange={handleDoctorSelect}
              onInputChange={handleDoctorSearchInputChange} // ✅ Added debounced input change
              isLoading={loadingDoctors}
              loadingMessage={() => "Searching doctors..."}
              placeholder={loadingDoctors ? "Loading..." : "Search & Select Doctor"}
              isSearchable={true}
              isClearable={true}
              filterOption={() => true} // ✅ Important: Disable client-side filtering
              noOptionsMessage={() => "No doctors found"}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
            {/* ✅ MEMBERSHIP TYPE - REACT-SELECT */}
            <Select
              options={membershipTypeOptions}
              value={membershipTypeOptions.find(option => option.value === formData.membershipType)}
              onChange={(selected) =>
                setFormData(prev => ({ ...prev, membershipType: selected.value }))
              }
              isSearchable={false}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
            {/* ✅ YEARS - REACT-SELECT */}
            <Select
              options={yearOptions}
              value={yearOptions.find(option => option.value === formData.membershipYear)}
              onChange={(selected) =>
                setFormData(prev => ({ ...prev, membershipYear: selected.value }))
              }
              isSearchable={true}
              maxMenuHeight={150}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Particular (Optional)</label>
            <input
              type="text"
              name="particular"
              value={formData.particular}
              onChange={handleChange}
              placeholder="Custom description (if any)"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              step="0.01"
              placeholder="0.00"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expiry Date *
              <span className="text-xs text-blue-600 ml-2">(Auto-calculated)</span>
            </label>
            <input
              type="date"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-blue-50 font-medium"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Based on {formData.membershipYear} year(s) from {formData.sbDate}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Narration</label>
            <input
              type="text"
              name="narration"
              value={formData.narration}
              onChange={handleChange}
              placeholder="Payment remarks"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Internal Note</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={3}
            placeholder="Any internal notes (not visible to doctor)"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-start gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-[#398C89] text-white font-medium rounded-md hover:bg-[#2e706e] transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Bill"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-2.5 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Add some custom CSS for react-select */}
      <style jsx>{`
        .react-select-container :global(.react-select__control) {
          min-height: 42px;
          border-radius: 0.375rem;
        }
        .react-select-container :global(.react-select__menu) {
          z-index: 100;
        }
      `}</style>
    </div>
  );
};

export default SalesBillForm;























































