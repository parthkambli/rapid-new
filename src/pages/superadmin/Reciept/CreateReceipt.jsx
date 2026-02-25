// // CreateReceipt.jsx
// import React, { useState } from "react";

// const CreateReceipt = () => {
//   const [activeTab, setActiveTab] = useState("monthly"); // "monthly" or "yearly"

//   // Form states
//   const [receiptNo, setReceiptNo] = useState("");
//   const [receiptDate, setReceiptDate] = useState("");
//   const [refCode, setRefCode] = useState("");
//   const [refDate, setRefDate] = useState("");
//   const [paymentMode, setPaymentMode] = useState("Cash");
//   const [cashBankAc, setCashBankAc] = useState("");
//   const [amount, setAmount] = useState("");
//   const [chequeNo, setChequeNo] = useState("");
//   const [chequeDate, setChequeDate] = useState("");
//   const [drawnOnBank, setDrawnOnBank] = useState("");
//   const [paymentType, setPaymentType] = useState("Full");
//   const [nextInstallmentDate, setNextInstallmentDate] = useState("");
//   const [installmentAmt, setInstallmentAmt] = useState("");
//   const [narration, setNarration] = useState("");

//   // Monthly fields
//   const [debitType, setDebitType] = useState("");
//   const [debitOn, setDebitOn] = useState("");
//   const [debitDate, setDebitDate] = useState("");
//   const [gst, setGst] = useState("");
//   const [monthlyPremium, setMonthlyPremium] = useState("");

//   const handleSave = () => {
//     console.log("Form Submitted:", {
//       receiptNo,
//       receiptDate,
//       refCode,
//       refDate,
//       paymentMode,
//       cashBankAc,
//       amount,
//       chequeNo,
//       chequeDate,
//       drawnOnBank,
//       paymentType,
//       nextInstallmentDate,
//       installmentAmt,
//       narration,
//       ...(activeTab === "monthly" && {
//         debitType,
//         debitOn,
//         debitDate,
//         gst,
//         monthlyPremium,
//       }),
//     });
//     alert("Receipt Saved!");
//   };

//   const handleCancel = () => {
//     if (window.confirm("Are you sure you want to cancel?")) {
//       window.history.back();
//     }
//   };

//   return (
//     <div className="max-w-[79vw]  mx-auto p-6 bg-white   rounded-lg ">

//      <div className="flex justify-between">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Receipt</h2>

//       {/* Tabs */}
//       <div className="flex space-x-8 mb-6 border-gray-300">
//         <button
//           onClick={() => setActiveTab("monthly")}
//           className={`px-6 py-2 font-medium rounded-t-md transition-colors ${
//             activeTab === "monthly"
//               ? "bg-[#398C89] text-white"
//               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//         >
//           Monthly
//         </button>
//         <button
//           onClick={() => setActiveTab("yearly")}
//           className={`px-6 py-2 font-medium rounded-t-md transition-colors ${
//             activeTab === "yearly"
//               ? "bg-[#398C89] text-white"
//               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//         >
//           Yearly
//         </button>
//       </div>
// </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//         {/* Row 1 */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Receipt No.</label>
//           <input
//             type="text"
//             value={receiptNo}
//             onChange={(e) => setReceiptNo(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Receipt No."
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Receipt Date:</label>
//           <input
//             type="date"
//             value={receiptDate}
//             onChange={(e) => setReceiptDate(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Ref Code:</label>
//           <input
//             type="text"
//             value={refCode}
//             onChange={(e) => setRefCode(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Ref Code"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Ref Date:</label>
//           <input
//             type="date"
//             value={refDate}
//             onChange={(e) => setRefDate(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//           />
//         </div>
//       </div>

//       {/* Payment Mode - Radio */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
//         <div className="flex flex-wrap gap-6">
//           {["Cash", "Cheque", "NACH", "NEFT/RTGS", "Online Transfer", "Other"].map((mode) => (
//             <label key={mode} className="flex items-center space-x-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="paymentMode"
//                 value={mode}
//                 checked={paymentMode === mode}
//                 onChange={(e) => setPaymentMode(e.target.value)}
//                 className="text-[#398C89] focus:ring-[#398C89]"
//               />
//               <span className="text-sm text-gray-700">{mode}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Cash/Bank A/c + Doctor/Hospital A/c Name */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Cash / Bank A/c:</label>
//           <select
//             value={cashBankAc}
//             onChange={(e) => setCashBankAc(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//           >
//             <option value="">Select Account</option>
//             <option value="SBI-1234">SBI - 1234</option>
//             <option value="HDFC-5678">HDFC - 5678</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Doctor/Hospital A/c Name:</label>
//           <input
//             type="text"
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Doctor/Hospital A/c Name"
//           />
//         </div>
//       </div>

//       {/* Amount + Cheque No + Cheque Date */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Amount:</label>
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Amount"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Cheque No.:</label>
//           <input
//             type="text"
//             value={chequeNo}
//             onChange={(e) => setChequeNo(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Cheque No."
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Cheque Date / Payment Date:</label>
//           <input
//             type="date"
//             value={chequeDate}
//             onChange={(e) => setChequeDate(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//           />
//         </div>
//       </div>

//       {/* Drawn on Bank + Payment Type + Next Installment Date */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Drawn on Bank:</label>
//           <input
//             type="text"
//             value={drawnOnBank}
//             onChange={(e) => setDrawnOnBank(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Drawn on Bank"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Payment Type:</label>
//           <select
//             value={paymentType}
//             onChange={(e) => setPaymentType(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//           >
//             <option value="Full">Full</option>
//             <option value="Installment">Installment</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Next Installment Date:</label>
//           <input
//             type="date"
//             value={nextInstallmentDate}
//             onChange={(e) => setNextInstallmentDate(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//           />
//         </div>
//       </div>

//       {/* Installment Amt */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">Installment Amt:</label>
//         <input
//           type="number"
//           value={installmentAmt}
//           onChange={(e) => setInstallmentAmt(e.target.value)}
//           className="mt-1 p-2 w-full md:w-1/3 border border-gray-300 rounded-md bg-gray-100"
//           placeholder="Installment Amount"
//         />
//       </div>

//       {/* Narration */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700">Narration:</label>
//         <textarea
//           value={narration}
//           onChange={(e) => setNarration(e.target.value)}
//           rows={3}
//           className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//           placeholder="Enter narration..."
//         />
//       </div>

//       {/* Monthly Details - Only in Monthly Tab */}
//       {activeTab === "monthly" && (
//         <div className="border-t pt-6 mt-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Debit Type:</label>
//               <select
//                 value={debitType}
//                 onChange={(e) => setDebitType(e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               >
//                 <option value="">Select</option>
//                 <option value="ACH">ACH</option>
//                 <option value="NACH">NACH</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Debit On:</label>
//               <input
//                 type="text"
//                 value={debitOn}
//                 onChange={(e) => setDebitOn(e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//                 placeholder="Debit On"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Debit Date:</label>
//               <input
//                 type="date"
//                 value={debitDate}
//                 onChange={(e) => setDebitDate(e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">GST:</label>
//               <input
//                 type="text"
//                 value={gst}
//                 onChange={(e) => setGst(e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//                 placeholder="GST"
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700">Monthly Premium:</label>
//               <input
//                 type="number"
//                 value={monthlyPremium}
//                 onChange={(e) => setMonthlyPremium(e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//                 placeholder="Monthly Premium"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Save / Cancel Buttons */}
//       <div className="flex justify-start space-x-3 mt-8">
//         <button
//           onClick={handleSave}
//           className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors"
//         >
//           Save
//         </button>
//         <button
//           onClick={handleCancel}
//           className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateReceipt;



// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

// const CreateReceipt = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [activeTab, setActiveTab] = useState("monthly");
//   const [banks, setBanks] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [saving, setSaving] = useState(false);

//   // Form states
//   const [formData, setFormData] = useState({
//     receiptNumber: "",
//     receiptDate: new Date().toISOString().split('T')[0],
//     refCode: "",
//     refDate: "",
//     paymentMethod: "cash",
//     cashBankAc: "",
//     amount: "",
//     chequeNo: "",
//     chequeDate: "",
//     drawnOnBank: "",
//     paymentType: "full",
//     nextInstallmentDate: "",
//     installmentAmt: "",
//     narration: "",
//     customer: {
//       type: "doctor",
//       entityId: "",
//       name: "",
//       contactPerson: "",
//       phoneNumber: "",
//       email: "",
//       address: {
//         address: "",
//         city: "",
//         state: "",
//         pinCode: "",
//         country: "India"
//       }
//     },
//     // Monthly fields
//     debitType: "",
//     debitOn: "",
//     debitDate: "",
//     gst: "",
//     monthlyPremium: "",
//   });

//   // Fetch banks, doctors and receipt data
//   useEffect(() => {
//     fetchBanks();
//     fetchDoctors();

//     if (id) {
//       setIsEditMode(true);
//       fetchReceiptData();
//     }
//   }, [id]);

//   const fetchBanks = async () => {
//     try {
//       const data = await apiHelpers.getList(apiEndpoints.banks.list);
//       setBanks(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Error fetching banks:', error);
//       setBanks([]);
//     }
//   };


//   const getDoctorDisplayText = (doctor) => {
//     const fullName = doctor.fullName || doctor.name || "Unnamed";
//     const hospitalName = doctor.hospitalName || "";

//     // Agar hospital name hai toh dono show karenge, nahi toh sirf fullName
//     return hospitalName ? `${fullName} - ${hospitalName}` : fullName;
//   };


//   const fetchDoctors = async () => {
//     try {
//       const data = await apiHelpers.getList(apiEndpoints.doctors.list);
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Error fetching doctors:', error);
//       setDoctors([]);
//     }
//   };

//   const fetchReceiptData = async () => {
//     setLoading(true);
//     try {
//       const data = await apiHelpers.getById(apiEndpoints.receipts.get, id);

//       setFormData({
//         receiptNumber: data.receiptNumber || "",
//         receiptDate: data.paymentDate ? new Date(data.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         refCode: data.referenceNumber || "",
//         refDate: data.refDate || "",
//         paymentMethod: data.paymentMethod || "cash",
//         cashBankAc: data.cashBankAc || "",
//         amount: data.amount || "",
//         chequeNo: data.chequeNo || "",
//         chequeDate: data.chequeDate ? new Date(data.chequeDate).toISOString().split('T')[0] : "",
//         drawnOnBank: data.drawnOnBank || "",
//         paymentType: data.paymentType || "full",
//         nextInstallmentDate: data.nextInstallmentDate ? new Date(data.nextInstallmentDate).toISOString().split('T')[0] : "",
//         installmentAmt: data.installmentAmount || "",
//         narration: data.remarks || "",
//         customer: data.customer || {
//           type: "doctor",
//           entityId: "",
//           name: "",
//           contactPerson: "",
//           phoneNumber: "",
//           email: "",
//           address: {
//             address: "",
//             city: "",
//             state: "",
//             pinCode: "",
//             country: "India"
//           }
//         },
//         debitType: data.debitType || "",
//         debitOn: data.debitOn || "",
//         debitDate: data.debitDate ? new Date(data.debitDate).toISOString().split('T')[0] : "",
//         gst: data.gst || "",
//         monthlyPremium: data.monthlyPremium || "",
//       });
//     } catch (error) {
//       console.error('Error fetching receipt:', error);
//       alert('Failed to load receipt data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     if (field.startsWith('customer.')) {
//       const customerField = field.replace('customer.', '');
//       setFormData(prev => ({
//         ...prev,
//         customer: {
//           ...prev.customer,
//           [customerField]: value
//         }
//       }));
//     } else if (field.startsWith('customer.address.')) {
//       const addressField = field.replace('customer.address.', '');
//       setFormData(prev => ({
//         ...prev,
//         customer: {
//           ...prev.customer,
//           address: {
//             ...prev.customer.address,
//             [addressField]: value
//           }
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [field]: value
//       }));
//     }
//   };

//   // const handleDoctorSelect = (doctorId) => {
//   //   const selectedDoctor = doctors.find(d => d._id === doctorId);
//   //   if (selectedDoctor) {
//   //     setFormData(prev => ({
//   //       ...prev,
//   //       customer: {
//   //         ...prev.customer,
//   //         entityId: selectedDoctor._id,
//   //         name: selectedDoctor.name,
//   //         contactPerson: selectedDoctor.contactPerson || selectedDoctor.name,
//           // phoneNumber: selectedDoctor.phone || "",
//           // email: selectedDoctor.email || "",
//           // address: {
//           //   ...prev.customer.address,
//           //   address: selectedDoctor.address?.address || "",
//           //   city: selectedDoctor.address?.city || "",
//           //   state: selectedDoctor.address?.state || "",
//           //   pinCode: selectedDoctor.address?.pinCode || "",
//           //   country: selectedDoctor.address?.country || "India"
//   //         }
//   //       }
//   //     }));
//   //   }
//   // };


//   const handleDoctorSelect = (doctorId) => {
//     const selectedDoctor = doctors.find(d => d._id === doctorId);
//     if (selectedDoctor) {
//       const fullName = selectedDoctor.fullName || selectedDoctor.name || "";
//       const hospitalName = selectedDoctor.hospitalName || "";

//       // Display name banayege: "Full Name - Hospital Name" (agar hospital name hai toh)
//       const displayName = hospitalName ? `${fullName} - ${hospitalName}` : fullName;

//       setFormData(prev => ({
//         ...prev,
//         customer: {
//           ...prev.customer,
//           entityId: selectedDoctor._id,
//           name: displayName, // Yahan combined name store karenge
//           contactPerson: fullName, // Contact person ke liye sirf fullName
//           // ... rest of the code
//           phoneNumber: selectedDoctor.phone || "",
//           email: selectedDoctor.email || "",
//           address: {
//             ...prev.customer.address,
//             address: selectedDoctor.address?.address || "",
//             city: selectedDoctor.address?.city || "",
//             state: selectedDoctor.address?.state || "",
//             pinCode: selectedDoctor.address?.pinCode || "",
//             country: selectedDoctor.address?.country || "India"
//         }
//       }}));
//     }
//   };


//   const handleSave = async () => {
//     if (!formData.amount || !formData.customer.entityId) {
//       alert("Please fill required fields: Amount and Customer");
//       return;
//     }

//     setSaving(true);
//     try {
//       const receiptData = {
//         receiptNumber: formData.receiptNumber || `RC${Date.now()}`,
//         customer: formData.customer,
//         amount: parseFloat(formData.amount),
//         paymentMethod: formData.paymentMethod,
//         paymentDate: formData.chequeDate || formData.receiptDate,
//         status: "received",
//         referenceNumber: formData.chequeNo || formData.refCode,
//         remarks: formData.narration,
//         chequeNo: formData.chequeNo,
//         chequeDate: formData.chequeDate,
//         drawnOnBank: formData.drawnOnBank,
//         ...(activeTab === "monthly" && {
//           debitType: formData.debitType,
//           debitOn: formData.debitOn,
//           debitDate: formData.debitDate,
//           gst: formData.gst,
//           monthlyPremium: formData.monthlyPremium
//         }),
//         ...(activeTab === "yearly" && formData.paymentType === "installment" && {
//           nextInstallmentDate: formData.nextInstallmentDate,
//           installmentAmount: formData.installmentAmt
//         })
//       };

//       if (isEditMode) {
//         await apiHelpers.update(apiEndpoints.receipts.update, id, receiptData);
//         alert("Receipt updated successfully!");
//       } else {
//         await apiHelpers.create(apiEndpoints.receipts.create, receiptData);
//         alert("Receipt created successfully!");
//       }

//       navigate('/admin/receipts');
//     } catch (error) {
//       console.error('Error saving receipt:', error);
//       alert(`Failed to ${isEditMode ? 'update' : 'create'} receipt: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
//       navigate('/admin/receipts');
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading...</div>;
//   }

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white rounded-lg">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">
//           {isEditMode ? 'Edit Receipt' : 'Create Receipt'}
//         </h2>

//         {/* Tabs */}
//         <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
//           <button
//             onClick={() => setActiveTab("monthly")}
//             className={`px-6 py-2 font-medium rounded-md transition-colors ${
//               activeTab === "monthly"
//                 ? "bg-[#398C89] text-white"
//                 : "bg-transparent text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             Monthly
//           </button>
//           <button
//             onClick={() => setActiveTab("yearly")}
//             className={`px-6 py-2 font-medium rounded-md transition-colors ${
//               activeTab === "yearly"
//                 ? "bg-[#398C89] text-white"
//                 : "bg-transparent text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             Yearly
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//         {/* Row 1 */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Receipt No.</label>
//           <input
//             type="text"
//             value={formData.receiptNumber}
//             onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Auto-generated if empty"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Receipt Date:</label>
//           <input
//             type="date"
//             value={formData.receiptDate}
//             onChange={(e) => handleInputChange('receiptDate', e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Ref Code:</label>
//           <input
//             type="text"
//             value={formData.refCode}
//             onChange={(e) => handleInputChange('refCode', e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Ref Code"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Ref Date:</label>
//           <input
//             type="date"
//             value={formData.refDate}
//             onChange={(e) => handleInputChange('refDate', e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//           />
//         </div>
//       </div>

//       {/* Customer Selection */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Select Doctor/Hospital *</label>
//           <select
//             value={formData.customer.entityId}
//             onChange={(e) => handleDoctorSelect(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             required
//           >
//             <option value="">Select Doctor/Hospital</option>
//             {doctors.map(doctor => (
//               // <option key={doctor._id} value={doctor._id}>
//               //   {doctor.name} - {doctor.qualification}
//               // </option>

// <option key={doctor._id} value={doctor._id}>
//   {getDoctorDisplayText(doctor)}
//   {doctor.qualification && ` - ${doctor.qualification}`}
//   {doctor.doctorId && ` (${doctor.doctorId})`}
// </option>

//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Contact Person</label>
//           <input
//             type="text"
//             value={formData.customer.contactPerson}
//             onChange={(e) => handleInputChange('customer.contactPerson', e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Contact Person"
//           />
//         </div>
//       </div>

//       {/* Customer Details */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//           <input
//             type="text"
//             value={formData.customer.phoneNumber}
//             onChange={(e) => handleInputChange('customer.phoneNumber', e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Phone Number"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <input
//             type="email"
//             value={formData.customer.email}
//             onChange={(e) => handleInputChange('customer.email', e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Email"
//           />
//         </div>
//       </div>

//       {/* Address */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-gray-700">Address</label>
//           <input
//             type="text"
//             value={formData.customer.address.address}
//             onChange={(e) => handleInputChange('customer.address.address', e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Full Address"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">City</label>
//           <input
//             type="text"
//             value={formData.customer.address.city}
//             onChange={(e) => handleInputChange('customer.address.city', e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="City"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">State</label>
//           <input
//             type="text"
//             value={formData.customer.address.state}
//             onChange={(e) => handleInputChange('customer.address.state', e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="State"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">PIN Code</label>
//           <input
//             type="text"
//             value={formData.customer.address.pinCode}
//             onChange={(e) => handleInputChange('customer.address.pinCode', e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="PIN Code"
//           />
//         </div>
//       </div>

//       {/* Payment Mode - Radio */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode *</label>
//         <div className="flex flex-wrap gap-6">
//           {["cash", "cheque", "nach", "neft_rtgs", "online", "other"].map((mode) => (
//             <label key={mode} className="flex items-center space-x-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="paymentMode"
//                 value={mode}
//                 checked={formData.paymentMethod === mode}
//                 onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
//                 className="text-[#398C89] focus:ring-[#398C89]"
//               />
//               <span className="text-sm text-gray-700 capitalize">
//                 {mode.replace('_', '/')}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Amount + Cheque No + Cheque Date */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Amount *</label>
//           <input
//             type="number"
//             value={formData.amount}
//             onChange={(e) => handleInputChange('amount', e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             placeholder="Amount"
//             required
//           />
//         </div>
//         {formData.paymentMethod === 'cheque' && (
//           <>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Cheque No.</label>
//               <input
//                 type="text"
//                 value={formData.chequeNo}
//                 onChange={(e) => handleInputChange('chequeNo', e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//                 placeholder="Cheque No."
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Cheque Date</label>
//               <input
//                 type="date"
//                 value={formData.chequeDate}
//                 onChange={(e) => handleInputChange('chequeDate', e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               />
//             </div>
//           </>
//         )}
//       </div>

//       {/* Bank Details */}
//       {formData.paymentMethod !== 'cash' && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Bank Account</label>
//             <select
//               value={formData.cashBankAc}
//               onChange={(e) => handleInputChange('cashBankAc', e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             >
//               <option value="">Select Bank Account</option>
//               {banks.map(bank => (
//                 <option key={bank._id} value={bank._id}>
//                   {bank.bankName} - {bank.accountNumber}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Drawn on Bank</label>
//             <input
//               type="text"
//               value={formData.drawnOnBank}
//               onChange={(e) => handleInputChange('drawnOnBank', e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               placeholder="Bank Name"
//             />
//           </div>
//         </div>
//       )}

//       {/* Yearly Installment Details */}
//       {activeTab === "yearly" && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Payment Type</label>
//             <select
//               value={formData.paymentType}
//               onChange={(e) => handleInputChange('paymentType', e.target.value)}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             >
//               <option value="full">Full Payment</option>
//               <option value="installment">Installment</option>
//             </select>
//           </div>
//           {formData.paymentType === "installment" && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Installment Amount</label>
//                 <input
//                   type="number"
//                   value={formData.installmentAmt}
//                   onChange={(e) => handleInputChange('installmentAmt', e.target.value)}
//                   className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//                   placeholder="Installment Amount"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Next Installment Date</label>
//                 <input
//                   type="date"
//                   value={formData.nextInstallmentDate}
//                   onChange={(e) => handleInputChange('nextInstallmentDate', e.target.value)}
//                   className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//                 />
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {/* Monthly Details - Only in Monthly Tab */}
//       {activeTab === "monthly" && (
//         <div className="border-t pt-6 mt-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Debit Type:</label>
//               <select
//                 value={formData.debitType}
//                 onChange={(e) => handleInputChange('debitType', e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               >
//                 <option value="">Select</option>
//                 <option value="ach">ACH</option>
//                 <option value="nach">NACH</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Debit On:</label>
//               <input
//                 type="text"
//                 value={formData.debitOn}
//                 onChange={(e) => handleInputChange('debitOn', e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//                 placeholder="Debit On"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Debit Date:</label>
//               <input
//                 type="date"
//                 value={formData.debitDate}
//                 onChange={(e) => handleInputChange('debitDate', e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">GST:</label>
//               <input
//                 type="text"
//                 value={formData.gst}
//                 onChange={(e) => handleInputChange('gst', e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//                 placeholder="GST"
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700">Monthly Premium:</label>
//               <input
//                 type="number"
//                 value={formData.monthlyPremium}
//                 onChange={(e) => handleInputChange('monthlyPremium', e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//                 placeholder="Monthly Premium"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Narration */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700">Narration</label>
//         <textarea
//           value={formData.narration}
//           onChange={(e) => handleInputChange('narration', e.target.value)}
//           rows={3}
//           className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//           placeholder="Enter narration..."
//         />
//       </div>

//       {/* Save / Cancel Buttons */}
//       <div className="flex justify-start space-x-3 mt-8">
//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors disabled:opacity-50"
//         >
//           {saving ? "Saving..." : (isEditMode ? "Update Receipt" : "Save Receipt")}
//         </button>
//         <button
//           onClick={handleCancel}
//           className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateReceipt;




































































// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

// const CreateReceipt = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [activeTab, setActiveTab] = useState("monthly");
//   const [banks, setBanks] = useState([]);
//   const [doctors, setDoctors] = useState([]); // Ab yeh sirf bill-wale doctors honge
//   const [loading, setLoading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [saving, setSaving] = useState(false);

//   // Form states
//   const [formData, setFormData] = useState({
//     receiptNumber: "",
//     receiptDate: new Date().toISOString().split('T')[0],
//     refCode: "",
//     refDate: "",
//     paymentMethod: "cash",
//     cashBankAc: "",
//     amount: "",
//     chequeNo: "",
//     chequeDate: "",
//     drawnOnBank: "",
//     paymentType: "full",
//     nextInstallmentDate: "",
//     installmentAmt: "",
//     narration: "",
//     customer: {
//       type: "doctor",
//       entityId: "",
//       name: "",
//       contactPerson: "",
//       phoneNumber: "",
//       email: "",
//       address: {
//         address: "",
//         city: "",
//         state: "",
//         pinCode: "",
//         country: "India"
//       }
//     },
//     debitType: "",
//     debitOn: "",
//     debitDate: "",
//     gst: "",
//     monthlyPremium: "",
//   });

//   // Fetch banks and bill-wale doctors only
//   useEffect(() => {
//     fetchBanks();
//     fetchDoctorsForReceipt(); // <-- Yeh nayi function use kar rahe hain

//     if (id) {
//       setIsEditMode(true);
//       fetchReceiptData();
//     }
//   }, [id]);

//   const fetchBanks = async () => {
//     try {
//       const data = await apiHelpers.getList(apiEndpoints.banks.list);
//       setBanks(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Error fetching banks:', error);
//       setBanks([]);
//     }
//   };

//   // Yeh nayi function — sirf bill-wale doctors lata hai
//   const fetchDoctorsForReceipt = async () => {
//     try {
//       const response = await apiHelpers.getList(apiEndpoints.doctors.foreceipt);
//       const doctorList = response.data || response; // Agar {data: [...]} aaya to
//       setDoctors(Array.isArray(doctorList) ? doctorList : []);
//     } catch (error) {
//       console.error('Error fetching doctors for receipt:', error);
//       setDoctors([]);
//     }
//   };

//   const fetchReceiptData = async () => {
//     setLoading(true);
//     try {
//       const data = await apiHelpers.getById(apiEndpoints.receipts.get, id);

//       setFormData({
//         receiptNumber: data.receiptNumber || "",
//         receiptDate: data.paymentDate ? new Date(data.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         refCode: data.referenceNumber || "",
//         refDate: data.refDate || "",
//         paymentMethod: data.paymentMethod || "cash",
//         cashBankAc: data.cashBankAc || "",
//         amount: data.amount || "",
//         chequeNo: data.chequeNo || "",
//         chequeDate: data.chequeDate ? new Date(data.chequeDate).toISOString().split('T')[0] : "",
//         drawnOnBank: data.drawnOnBank || "",
//         paymentType: data.paymentType || "full",
//         nextInstallmentDate: data.nextInstallmentDate ? new Date(data.nextInstallmentDate).toISOString().split('T')[0] : "",
//         installmentAmt: data.installmentAmount || "",
//         narration: data.remarks || "",
//         customer: data.customer || {
//           type: "doctor",
//           entityId: "",
//           name: "",
//           contactPerson: "",
//           phoneNumber: "",
//           email: "",
//           address: {
//             address: "",
//             city: "",
//             state: "",
//             pinCode: "",
//             country: "India"
//           }
//         },
//         debitType: data.debitType || "",
//         debitOn: data.debitOn || "",
//         debitDate: data.debitDate ? new Date(data.debitDate).toISOString().split('T')[0] : "",
//         gst: data.gst || "",
//         monthlyPremium: data.monthlyPremium || "",
//       });
//     } catch (error) {
//       console.error('Error fetching receipt:', error);
//       alert('Failed to load receipt data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     if (field.startsWith('customer.')) {
//       const customerField = field.replace('customer.', '');
//       if (customerField.startsWith('address.')) {
//         const addressField = customerField.replace('address.', '');
//         setFormData(prev => ({
//           ...prev,
//           customer: {
//             ...prev.customer,
//             address: {
//               ...prev.customer.address,
//               [addressField]: value
//             }
//           }
//         }));
//       } else {
//         setFormData(prev => ({
//           ...prev,
//           customer: {
//             ...prev.customer,
//             [customerField]: value
//           }
//         }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [field]: value
//       }));
//     }
//   };

//   // Perfect auto-fill — latest API ke hisaab se
//   const handleDoctorSelect = (doctorId) => {
//     const selectedDoctor = doctors.find(d => d._id === doctorId);
//     if (!selectedDoctor) return;

//     const fullName = selectedDoctor.fullName || "Dr. Unknown";
//     const hospitalName = selectedDoctor.hospitalName || "";
//     const displayName = hospitalName ? `${fullName} - ${hospitalName}` : fullName;

//     setFormData(prev => ({
//       ...prev,
//       customer: {
//         ...prev.customer,
//         entityId: selectedDoctor._id,
//         name: displayName,
//         contactPerson: fullName,
//         phoneNumber: selectedDoctor.phoneNumber || "",
//         email: selectedDoctor.email || "",
//         address: {
//           address: selectedDoctor.address?.full || 
//                    `${selectedDoctor.hospitalAddress?.address || ""}, ${selectedDoctor.hospitalAddress?.taluka || ""}, ${selectedDoctor.hospitalAddress?.city || ""}`.replace(/^,+/g, '').trim(),
//           city: selectedDoctor.hospitalAddress?.city || selectedDoctor.address?.city || "",
//           state: selectedDoctor.hospitalAddress?.state || selectedDoctor.address?.state || "",
//           pinCode: selectedDoctor.hospitalAddress?.pinCode || selectedDoctor.address?.pinCode || "",
//           country: "India"
//         }
//       }
//     }));
//   };

//   const handleSave = async () => {
//     if (!formData.amount || !formData.customer.entityId) {
//       alert("Please fill required fields: Amount and Customer");
//       return;
//     }

//     setSaving(true);
//     try {
//       const receiptData = {
//         receiptNumber: formData.receiptNumber || `RC${Date.now()}`,
//         customer: formData.customer,
//         amount: parseFloat(formData.amount),
//         paymentMethod: formData.paymentMethod,
//         paymentDate: formData.chequeDate || formData.receiptDate,
//         status: "received",
//         referenceNumber: formData.chequeNo || formData.refCode,
//         remarks: formData.narration,
//         chequeNo: formData.chequeNo,
//         chequeDate: formData.chequeDate,
//         drawnOnBank: formData.drawnOnBank,
//         ...(activeTab === "monthly" && {
//           debitType: formData.debitType,
//           debitOn: formData.debitOn,
//           debitDate: formData.debitDate,
//           gst: formData.gst,
//           monthlyPremium: formData.monthlyPremium
//         }),
//         ...(activeTab === "yearly" && formData.paymentType === "installment" && {
//           nextInstallmentDate: formData.nextInstallmentDate,
//           installmentAmount: formData.installmentAmt
//         })
//       };

//       if (isEditMode) {
//         await apiHelpers.update(apiEndpoints.receipts.update, id, receiptData);
//         alert("Receipt updated successfully!");
//       } else {
//         await apiHelpers.create(apiEndpoints.receipts.create, receiptData);
//         alert("Receipt created successfully!");
//       }

//       navigate('/admin/receipts');
//     } catch (error) {
//       console.error('Error saving receipt:', error);
//       alert(`Failed to ${isEditMode ? 'update' : 'create'} receipt: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
//       navigate('/admin/receipts');
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading...</div>;
//   }

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white rounded-lg">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">
//           {isEditMode ? 'Edit Receipt' : 'Create Receipt'}
//         </h2>
//         <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
//           <button
//             onClick={() => setActiveTab("monthly")}
//             className={`px-6 py-2 font-medium rounded-md transition-colors ${activeTab === "monthly" ? "bg-[#398C89] text-white" : "bg-transparent text-gray-700 hover:bg-gray-300"}`}
//           >
//             Monthly
//           </button>
//           <button
//             onClick={() => setActiveTab("yearly")}
//             className={`px-6 py-2 font-medium rounded-md transition-colors ${activeTab === "yearly" ? "bg-[#398C89] text-white" : "bg-transparent text-gray-700 hover:bg-gray-300"}`}
//           >
//             Yearly
//           </button>
//         </div>
//       </div>

//       {/* Baki sab UI bilkul same hai — koi change nahi kiya */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Receipt No.</label>
//           <input type="text" value={formData.receiptNumber} onChange={(e) => handleInputChange('receiptNumber', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Auto-generated if empty" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Receipt Date:</label>
//           <input type="date" value={formData.receiptDate} onChange={(e) => handleInputChange('receiptDate', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Ref Code:</label>
//           <input type="text" value={formData.refCode} onChange={(e) => handleInputChange('refCode', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Ref Code" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Ref Date:</label>
//           <input type="date" value={formData.refDate} onChange={(e) => handleInputChange('refDate', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" />
//         </div>
//       </div>

//       {/* Doctor Dropdown — ab sirf bill-wale doctors */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Select Doctor/Hospital *</label>
//           <select
//             value={formData.customer.entityId}
//             onChange={(e) => handleDoctorSelect(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             required
//           >
//             <option value="">Select Doctor/Hospital</option>
//             {doctors.map(doctor => (
//               <option key={doctor._id} value={doctor._id}>
//                 {doctor.fullName}
//                 {doctor.hospitalName && ` - ${doctor.hospitalName}`}
//                 {doctor.membershipId && ` (${doctor.membershipId})`}
//                 {doctor.latestSalesBill && ` | Last Bill: ${doctor.latestSalesBill.billNumber}`}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Contact Person</label>
//           <input type="text" value={formData.customer.contactPerson} onChange={(e) => handleInputChange('customer.contactPerson', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Contact Person" />
//         </div>
//       </div>

//       {/* Baaki sab fields same */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//           <input type="text" value={formData.customer.phoneNumber} onChange={(e) => handleInputChange('customer.phoneNumber', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Phone Number" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <input type="email" value={formData.customer.email} onChange={(e) => handleInputChange('customer.email', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Email" />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-gray-700">Address</label>
//           <input type="text" value={formData.customer.address.address} onChange={(e) => handleInputChange('customer.address.address', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Full Address" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">City</label>
//           <input type="text" value={formData.customer.address.city} onChange={(e) => handleInputChange('customer.address.city', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="City" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">State</label>
//           <input type="text" value={formData.customer.address.state} onChange={(e) => handleInputChange('customer.address.state', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="State" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">PIN Code</label>
//           <input type="text" value={formData.customer.address.pinCode} onChange={(e) => handleInputChange('customer.address.pinCode', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="PIN Code" />
//         </div>
//       </div>

//       {/* Baaki sab form same hi hai — neeche tak copy-paste kar de */}
//       {/* ... Payment Mode, Amount, Bank, Monthly/Yearly, Narration, Buttons ... */}
//       {/* Main neeche wala part same rakha hai jo pehle tha */}

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode *</label>
//         <div className="flex flex-wrap gap-6">
//           {["cash", "cheque", "nach", "neft_rtgs", "online", "other"].map((mode) => (
//             <label key={mode} className="flex items-center space-x-2 cursor-pointer">
//               <input type="radio" name="paymentMode" value={mode} checked={formData.paymentMethod === mode} onChange={(e) => handleInputChange('paymentMethod', e.target.value)} className="text-[#398C89] focus:ring-[#398C89]" />
//               <span className="text-sm text-gray-700 capitalize">{mode.replace('_', '/')}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Amount *</label>
//           <input type="number" value={formData.amount} onChange={(e) => handleInputChange('amount', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Amount" required />
//         </div>
//         {formData.paymentMethod === 'cheque' && (
//           <>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Cheque No.</label>
//               <input type="text" value={formData.chequeNo} onChange={(e) => handleInputChange('chequeNo', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Cheque No." />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Cheque Date</label>
//               <input type="date" value={formData.chequeDate} onChange={(e) => handleInputChange('chequeDate', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" />
//             </div>
//           </>
//         )}
//       </div>

//       {formData.paymentMethod !== 'cash' && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Bank Account</label>
//             <select value={formData.cashBankAc} onChange={(e) => handleInputChange('cashBankAc', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100">
//               <option value="">Select Bank Account</option>
//               {banks.map(bank => (
//                 <option key={bank._id} value={bank._id}>{bank.bankName} - {bank.accountNumber}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Drawn on Bank</label>
//             <input type="text" value={formData.drawnOnBank} onChange={(e) => handleInputChange('drawnOnBank', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Bank Name" />
//           </div>
//         </div>
//       )}

//       {activeTab === "yearly" && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Payment Type</label>
//             <select value={formData.paymentType} onChange={(e) => handleInputChange('paymentType', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100">
//               <option value="full">Full Payment</option>
//               <option value="installment">Installment</option>
//             </select>
//           </div>
//           {formData.paymentType === "installment" && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Installment Amount</label>
//                 <input type="number" value={formData.installmentAmt} onChange={(e) => handleInputChange('installmentAmt', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Installment Amount" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Next Installment Date</label>
//                 <input type="date" value={formData.nextInstallmentDate} onChange={(e) => handleInputChange('nextInstallmentDate', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" />
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {activeTab === "monthly" && (
//         <div className="border-t pt-6 mt-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Debit Type:</label>
//               <select value={formData.debitType} onChange={(e) => handleInputChange('debitType', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100">
//                 <option value="">Select</option>
//                 <option value="ach">ACH</option>
//                 <option value="nach">NACH</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Debit On:</label>
//               <input type="text" value={formData.debitOn} onChange={(e) => handleInputChange('debitOn', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Debit On" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Debit Date:</label>
//               <input type="date" value={formData.debitDate} onChange={(e) => handleInputChange('debitDate', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">GST:</label>
//               <input type="text" value={formData.gst} onChange={(e) => handleInputChange('gst', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="GST" />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700">Monthly Premium:</label>
//               <input type="number" value={formData.monthlyPremium} onChange={(e) => handleInputChange('monthlyPremium', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Monthly Premium" />
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700">Narration</label>
//         <textarea value={formData.narration} onChange={(e) => handleInputChange('narration', e.target.value)} rows={3} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Enter narration..." />
//       </div>

//       <div className="flex justify-start space-x-3 mt-8">
//         <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] transition-colors disabled:opacity-50">
//           {saving ? "Saving..." : (isEditMode ? "Update Receipt" : "Save Receipt")}
//         </button>
//         <button onClick={handleCancel} className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateReceipt;





































// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

// const CreateReceipt = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [activeTab, setActiveTab] = useState("monthly");
//   const [banks, setBanks] = useState([]);           // ← Ab receipt-bank-details se aayenge
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [saving, setSaving] = useState(false);

//   // Form states
//   const [formData, setFormData] = useState({
//     receiptNumber: "",
//     receiptDate: new Date().toISOString().split('T')[0],
//     refCode: "",                    // ← YEH AB AUTO-FILL HOGA
//     refDate: "",
//     paymentMethod: "cash",
//     cashBankAc: "",
//     amount: "",
//     chequeNo: "",
//     chequeDate: "",
//     drawnOnBank: "",                // ← YEH BHI AUTO-FILL HOGA JAB BANK SELECT KAREGA
//     paymentType: "full",
//     nextInstallmentDate: "",
//     installmentAmt: "",
//     narration: "",
//     customer: {
//       type: "doctor",
//       entityId: "",
//       name: "",
//       contactPerson: "",
//       phoneNumber: "",
//       email: "",
//       address: {
//         address: "",
//         city: "",
//         state: "",
//         pinCode: "",
//         country: "India"
//       }
//     },
//     debitType: "",
//     debitOn: "",
//     debitDate: "",
//     gst: "",
//     monthlyPremium: "",
//   });

//   // Fetch receipt-bank-details & doctors for receipt
//   useEffect(() => {
//     fetchReceiptBanks();        // ← Ab yeh receipt-bank-details fetch karega
//     fetchDoctorsForReceipt();

//     if (id) {
//       setIsEditMode(true);
//       fetchReceiptData();
//     }
//   }, [id]);

//   // 1. Fetch Banks from receipt-bank-details API
//   const fetchReceiptBanks = async () => {
//     try {
//       const response = await apiHelpers.getList(apiEndpoints.recBankDetails.list);
//       const bankList = response?.data || response || [];
//       setBanks(Array.isArray(bankList) ? bankList : []);
//     } catch (error) {
//       console.error('Error fetching receipt bank details:', error);
//       setBanks([]);
//     }
//   };

//   // 2. Fetch Doctors (jo bill-wale hain)
//   const fetchDoctorsForReceipt = async () => {
//     try {
//       const response = await apiHelpers.getList(apiEndpoints.doctors.foreceipt);
//       const doctorList = response?.data || response || [];
//       setDoctors(Array.isArray(doctorList) ? doctorList : []);
//     } catch (error) {
//       console.error('Error fetching doctors for receipt:', error);
//       setDoctors([]);
//     }
//   };

//   const fetchReceiptData = async () => {
//     setLoading(true);
//     try {
//       const data = await apiHelpers.getById(apiEndpoints.receipts.get, id);

//       setFormData({
//         receiptNumber: data.receiptNumber || "",
//         receiptDate: data.paymentDate ? new Date(data.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         refCode: data.referenceNumber || "",
//         refDate: data.refDate || "",
//         paymentMethod: data.paymentMethod || "cash",
//         cashBankAc: data.cashBankAc || "",
//         amount: data.amount || "",
//         chequeNo: data.chequeNo || "",
//         chequeDate: data.chequeDate ? new Date(data.chequeDate).toISOString().split('T')[0] : "",
//         drawnOnBank: data.drawnOnBank || "",
//         paymentType: data.paymentType || "full",
//         nextInstallmentDate: data.nextInstallmentDate ? new Date(data.nextInstallmentDate).toISOString().split('T')[0] : "",
//         installmentAmt: data.installmentAmount || "",
//         narration: data.remarks || "",
//         customer: data.customer || {
//           type: "doctor",
//           entityId: "",
//           name: "",
//           contactPerson: "",
//           phoneNumber: "",
//           email: "",
//           address: { address: "", city: "", state: "", pinCode: "", country: "India" }
//         },
//         debitType: data.debitType || "",
//         debitOn: data.debitOn || "",
//         debitDate: data.debitDate ? new Date(data.debitDate).toISOString().split('T')[0] : "",
//         gst: data.gst || "",
//         monthlyPremium: data.monthlyPremium || "",
//       });
//     } catch (error) {
//       console.error('Error fetching receipt:', error);
//       alert('Failed to load receipt data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     if (field.startsWith('customer.')) {
//       const customerField = field.replace('customer.', '');
//       if (customerField.startsWith('address.')) {
//         const addressField = customerField.replace('address.', '');
//         setFormData(prev => ({
//           ...prev,
//           customer: {
//             ...prev.customer,
//             address: {
//               ...prev.customer.address,
//               [addressField]: value
//             }
//           }
//         }));
//       } else {
//         setFormData(prev => ({
//           ...prev,
//           customer: {
//             ...prev.customer,
//             [customerField]: value
//           }
//         }));
//       }
//     } else {
//       setFormData(prev => ({ ...prev, [field]: value }));
//     }
//   };








// // test 
// // Yeh function add kar do component ke andar (koi bhi jagah, useEffect ke upar)
// // const getCurrentUserId = () => {
// //   try {
// //     const persistData = localStorage.getItem('persist:root');
// //     if (!persistData) return null;

// //     const parsed = JSON.parse(persistData);
// //     const authData = parsed.auth;
// //     if (!authData) return null;

// //     const authObj = JSON.parse(authData);

// //     // YEH LINE SABSE IMP HAI → _id bhejo, userId nahi!
// //     return authObj.user?._id || null;  // ← MongoDB ObjectId
// //   } catch (error) {
// //     console.error("Error parsing persist:root", error);
// //     return null;
// //   }
// // };













// const getCurrentUserId = () => {
//   try {
//     const persistData = localStorage.getItem('persist:root');
//     if (!persistData) {
//       console.warn("persist:root not found");
//       return null;
//     }

//     const allData = JSON.parse(persistData);
//     const authString = allData.auth;

//     if (!authString) {
//       console.warn("auth not found in persist:root");
//       return null;
//     }

//     let authObj;
//     try {
//       authObj = JSON.parse(authString); // Pehli baar parse
//     } catch (e) {
//       // Agar already parsed hai (kabhi kabhi hota hai Redux mein)
//       authObj = authString;
//     }

//     const user = typeof authObj === 'object' ? authObj.user : authObj;

//     if (!user) {
//       console.warn("User not found in auth");
//       return null;
//     }

//     // YE SABSE IMP HAI → hamesha user._id bhejo, user.userId nahi!
//     const mongoId = user._id;

//     if (!mongoId || mongoId === "ADM415921") {
//       console.error("Wrong ID detected! Using userId instead of _id", user);
//       return null;
//     }

//     console.log("Correct receivedBy ID:", mongoId); // → 6905ea97c1957ee4b383d699
//     return mongoId;

//   } catch (error) {
//     console.error("Critical error in getCurrentUserId:", error);
//     return null;
//   }
// };







//   // DOCTOR SELECT → REF CODE AUTO-FILL + FULL DETAILS
//   const handleDoctorSelect = (doctorId) => {
//     const selectedDoctor = doctors.find(d => d._id === doctorId);
//     if (!selectedDoctor) return;

//     const fullName = selectedDoctor.fullName || "Dr. Unknown";
//     const hospitalName = selectedDoctor.hospitalName || "";
//     const displayName = hospitalName ? `${fullName} - ${hospitalName}` : fullName;

//     // Latest Sales Bill Number → Ref Code mein daal do
//     const latestBillNumber = selectedDoctor.latestSalesBill?.billNumber || "";

//     setFormData(prev => ({
//       ...prev,
//       refCode: latestBillNumber,  // ← AUTO-FILL REF CODE
//       customer: {
//         ...prev.customer,
//         entityId: selectedDoctor._id,
//         name: displayName,
//         contactPerson: fullName,
//         phoneNumber: selectedDoctor.phoneNumber || "",
//         email: selectedDoctor.email || "",
//         address: {
//           address: selectedDoctor.address?.full ||
//                    `${selectedDoctor.hospitalAddress?.address || ""}, ${selectedDoctor.hospitalAddress?.taluka || ""}, ${selectedDoctor.hospitalAddress?.city || ""}`.replace(/^,+/g, '').trim(),
//           city: selectedDoctor.hospitalAddress?.city || selectedDoctor.address?.city || "",
//           state: selectedDoctor.hospitalAddress?.state || selectedDoctor.address?.state || "",
//           pinCode: selectedDoctor.hospitalAddress?.pinCode || selectedDoctor.address?.pinCode || "",
//           country: "India"
//         }
//       }
//     }));
//   };

//   // BANK SELECT → DRAWN ON BANK AUTO-FILL
//   const handleBankSelect = (bankId) => {
//     const selectedBank = banks.find(b => b._id === bankId);
//     if (!selectedBank) return;

//     setFormData(prev => ({
//       ...prev,
//       cashBankAc: selectedBank._id,
//       drawnOnBank: selectedBank.bankName || selectedBank.bankName || "Unknown Bank"
//     }));
//   };

//   // const handleSave = async () => {
//   //   if (!formData.amount || !formData.customer.entityId) {
//   //     alert("Please fill required fields: Amount and Customer");
//   //     return;
//   //   }

//   //   setSaving(true);
//   //   try {
//   //     const receiptData = {
//   //       receiptNumber: formData.receiptNumber || `RC${Date.now()}`,
//   //       customer: formData.customer,
//   //       amount: parseFloat(formData.amount),
//   //       paymentMethod: formData.paymentMethod,
//   //       paymentDate: formData.chequeDate || formData.receiptDate,
//   //       status: "received",
//   //       referenceNumber: formData.refCode,
//   //       remarks: formData.narration,
//   //       chequeNo: formData.chequeNo,
//   //       chequeDate: formData.chequeDate,
//   //       drawnOnBank: formData.drawnOnBank,
//   //       cashBankAc: formData.cashBankAc,
//   //       ...(activeTab === "monthly" && {
//   //         debitType: formData.debitType,
//   //         debitOn: formData.debitOn,
//   //         debitDate: formData.debitDate,
//   //         gst: formData.gst,
//   //         monthlyPremium: formData.monthlyPremium
//   //       }),
//   //       ...(activeTab === "yearly" && formData.paymentType === "installment" && {
//   //         nextInstallmentDate: formData.nextInstallmentDate,
//   //         installmentAmount: formData.installmentAmt
//   //       })
//   //     };

//   //     if (isEditMode) {
//   //       await apiHelpers.update(apiEndpoints.receipts.update, id, receiptData);
//   //       alert("Receipt updated successfully!");
//   //     } else {
//   //       await apiHelpers.create(apiEndpoints.receipts.create, receiptData);
//   //       alert("Receipt created successfully!");
//   //     }

//   //     navigate('/admin/receipts');
//   //   } catch (error) {
//   //     console.error('Error saving receipt:', error);
//   //     alert(`Failed to ${isEditMode ? 'update' : 'create'} receipt: ${error.response?.data?.message || error.message}`);
//   //   } finally {
//   //     setSaving(false);
//   //   }
//   // };















// const handleSave = async () => {
//   if (!formData.amount || !formData.customer.entityId) {
//     alert("Please fill required fields: Amount and Customer");
//     return;
//   }

//   setSaving(true);

//   // YEH LINE CHANGE KI HAI → persist:root se user _id nikaal rahe hain
//   const receivedById = getCurrentUserId();
//   console.log("Final receivedBy ID being sent:", receivedById); // ← YEH CONSOLE MEIN DEKHO!

//   if (!receivedById) {
//     alert("User session expired! Please login again.");
//     navigate('/login');
//     setSaving(false);
//     return;
//   }

//   try {
//     const receiptData = {
//       receiptNumber: formData.receiptNumber || `RC${Date.now()}`,

//       // PAYER → Doctor ki full details
//       payer: {
//         type: "doctor",
//         entityId: formData.customer.entityId,        // Doctor ka _id
//         name: formData.customer.name,
//         contactPerson: formData.customer.contactPerson || formData.customer.name,
//         phoneNumber: formData.customer.phoneNumber || "",
//         email: formData.customer.email || "",
//         address: formData.customer.address
//       },

//       // RECEIVED BY → Jo login hai uska _id (persist:root se)
//       receivedBy: receivedById,  // ← Perfect ObjectId string

//       amount: parseFloat(formData.amount),
//       paymentMethod: formData.paymentMethod,
//       paymentDate: formData.chequeDate || formData.receiptDate,
//       status: "received",
//       referenceNumber: formData.refCode || formData.chequeNo || "",
//       remarks: formData.narration,
//       chequeNo: formData.chequeNo,
//       chequeDate: formData.chequeDate,
//       drawnOnBank: formData.drawnOnBank,
//       cashBankAc: formData.cashBankAc || undefined,

//       // Monthly fields
//       ...(activeTab === "monthly" && {
//         debitType: formData.debitType || undefined,
//         debitOn: formData.debitOn || undefined,
//         debitDate: formData.debitDate || undefined,
//         gst: formData.gst || undefined,
//         monthlyPremium: formData.monthlyPremium ? parseFloat(formData.monthlyPremium) : undefined
//       }),

//       // Yearly installment
//       ...(activeTab === "yearly" && formData.paymentType === "installment" && {
//         nextInstallmentDate: formData.nextInstallmentDate || undefined,
//         installmentAmount: formData.installmentAmt ? parseFloat(formData.installmentAmt) : undefined
//       })
//     };

//     if (isEditMode) {
//       await apiHelpers.update(apiEndpoints.receipts.update, id, receiptData);
//       alert("Receipt updated successfully!");
//     } else {
//       await apiHelpers.create(apiEndpoints.receipts.create, receiptData);
//       alert("Receipt created successfully!");
//     }

//     navigate('/admin/receipt-list');
//   } catch (error) {
//     console.error('Error saving receipt:', error);
//     const msg = error.response?.data?.message || error.message || "Unknown error";
//     alert(`Failed to save receipt: ${msg}`);
//   } finally {
//     setSaving(false);
//   }
// };



//   const handleCancel = () => {
//     if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
//       navigate('/admin/receipt-list');
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8 text-xl">Loading...</div>;
//   }

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">
//           {isEditMode ? 'Edit Receipt' : 'Create Receipt'}
//         </h2>
//         <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
//           <button
//             onClick={() => setActiveTab("monthly")}
//             className={`px-6 py-2 font-medium rounded-md transition-colors ${activeTab === "monthly" ? "bg-[#398C89] text-white" : "bg-transparent text-gray-700 hover:bg-gray-300"}`}
//           >
//             Monthly
//           </button>
//           <button
//             onClick={() => setActiveTab("yearly")}
//             className={`px-6 py-2 font-medium rounded-md transition-colors ${activeTab === "yearly" ? "bg-[#398C89] text-white" : "bg-transparent text-gray-700 hover:bg-gray-300"}`}
//           >
//             Yearly
//           </button>
//         </div>
//       </div>

//       {/* Receipt Basic Info */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Receipt No.</label>
//           <input type="text" value={formData.receiptNumber} onChange={(e) => handleInputChange('receiptNumber', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Auto-generated" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Receipt Date</label>
//           <input type="date" value={formData.receiptDate} onChange={(e) => handleInputChange('receiptDate', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Ref Code (Bill No.)</label>
//           <input type="text" value={formData.refCode} readOnly className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed" placeholder="Auto-filled from latest bill" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Ref Date</label>
//           <input type="date" value={formData.refDate} onChange={(e) => handleInputChange('refDate', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" />
//         </div>
//       </div>

//       {/* Doctor Selection */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Select Doctor/Hospital *</label>
//           <select
//             value={formData.customer.entityId}
//             onChange={(e) => handleDoctorSelect(e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             required
//           >
//             <option value="">Select Doctor/Hospital</option>
//             {doctors.map(doctor => (
//               <option key={doctor._id} value={doctor._id}>
//                 {doctor.fullName}
//                 {doctor.hospitalName && ` - ${doctor.hospitalName}`}
//                 {doctor.membershipId && ` (${doctor.membershipId})`}
//                 {doctor.latestSalesBill && ` | Last Bill: ${doctor.latestSalesBill.billNumber}`}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Contact Person</label>
//           <input type="text" value={formData.customer.contactPerson} onChange={(e) => handleInputChange('customer.contactPerson', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" />
//         </div>
//       </div>

//       {/* Contact & Address */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div><label className="block text-sm font-medium text-gray-700">Phone</label><input type="text" value={formData.customer.phoneNumber} onChange={(e) => handleInputChange('customer.phoneNumber', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" /></div>
//         <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" value={formData.customer.email} onChange={(e) => handleInputChange('customer.email', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" /></div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="lg:col-span-2"><label className="block text-sm font-medium text-gray-700">Address</label><input type="text" value={formData.customer.address.address} onChange={(e) => handleInputChange('customer.address.address', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" /></div>
//         <div><label className="block text-sm font-medium text-gray-700">City</label><input type="text" value={formData.customer.address.city} onChange={(e) => handleInputChange('customer.address.city', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" /></div>
//         <div><label className="block text-sm font-medium text-gray-700">State</label><input type="text" value={formData.customer.address.state} onChange={(e) => handleInputChange('customer.address.state', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" /></div>
//         <div><label className="block text-sm font-medium text-gray-700">PIN</label><input type="text" value={formData.customer.address.pinCode} onChange={(e) => handleInputChange('customer.address.pinCode', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" /></div>
//       </div>

//       {/* Payment Mode */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode *</label>
//         <div className="flex flex-wrap gap-6">
//           {["cash", "cheque", "nach", "neft_rtgs", "online", "other"].map((mode) => (
//             <label key={mode} className="flex items-center space-x-2 cursor-pointer">
//               <input type="radio" name="paymentMode" value={mode} checked={formData.paymentMethod === mode} onChange={(e) => handleInputChange('paymentMethod', e.target.value)} className="text-[#398C89]" />
//               <span className="text-sm text-gray-700 capitalize">{mode.replace('_', '/')}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Amount & Cheque */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div><label className="block text-sm font-medium text-gray-700">Amount *</label><input type="number" value={formData.amount} onChange={(e) => handleInputChange('amount', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" required /></div>
//         {formData.paymentMethod === 'cheque' && (
//           <>
//             <div><label className="block text-sm font-medium text-gray-700">Cheque No.</label><input type="text" value={formData.chequeNo} onChange={(e) => handleInputChange('chequeNo', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" /></div>
//             <div><label className="block text-sm font-medium text-gray-700">Cheque Date</label><input type="date" value={formData.chequeDate} onChange={(e) => handleInputChange('chequeDate', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" /></div>
//           </>
//         )}
//       </div>

//       {/* Bank Selection (Only for non-cash) */}
//       {formData.paymentMethod !== 'cash' && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Our Bank Account *</label>
//             <select
//               value={formData.cashBankAc}
//               onChange={(e) => {
//                 handleInputChange('cashBankAc', e.target.value);
//                 handleBankSelect(e.target.value);
//               }}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//             >
//               <option value="">Select Bank Account</option>
//               {banks.map(bank => (
//                 <option key={bank._id} value={bank._id}>
//                   {bank.bankName} - {bank.accountNumber} ({bank.ifsc || 'IFSC'})
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Drawn on Bank</label>
//             <input type="text" value={formData.drawnOnBank} readOnly className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed" placeholder="Auto-filled on bank selection" />
//           </div>
//         </div>
//       )}

//       {/* Yearly Installment */}
//       {activeTab === "yearly" && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Payment Type</label>
//             <select value={formData.paymentType} onChange={(e) => handleInputChange('paymentType', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100">
//               <option value="full">Full Payment</option>
//               <option value="installment">Installment</option>
//             </select>
//           </div>
//           {formData.paymentType === "installment" && (
//             <>
//               <div><label className="block text-sm font-medium text-gray-700">Installment Amount</label><input type="number" value={formData.installmentAmt} onChange={(e) => handleInputChange('installmentAmt', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" /></div>
//               <div><label className="block text-sm font-medium text-gray-700">Next Installment Date</label><input type="date" value={formData.nextInstallmentDate} onChange={(e) => handleInputChange('nextInstallmentDate', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" /></div>
//             </>
//           )}
//         </div>
//       )}

//       {/* Monthly Details */}
//       {activeTab === "monthly" && (
//         <div className="border-t pt-6 mt-6 bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Payment Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div><label className="block text-sm font-medium text-gray-700">Debit Type</label>
//               <select value={formData.debitType} onChange={(e) => handleInputChange('debitType', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white">
//                 <option value="">Select</option>
//                 <option value="ach">ACH</option>
//                 <option value="nach">NACH</option>
//               </select>
//             </div>
//             <div><label className="block text-sm font-medium text-gray-700">Debit On</label><input type="text" value={formData.debitOn} onChange={(e) => handleInputChange('debitOn', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white" /></div>
//             <div><label className="block text-sm font-medium text-gray-700">Debit Date</label><input type="date" value={formData.debitDate} onChange={(e) => handleInputChange('debitDate', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white" /></div>
//             <div><label className="block text-sm font-medium text-gray-700">GST</label><input type="text" value={formData.gst} onChange={(e) => handleInputChange('gst', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white" /></div>
//             <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Monthly Premium</label><input type="number" value={formData.monthlyPremium} onChange={(e) => handleInputChange('monthlyPremium', e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white" /></div>
//           </div>
//         </div>
//       )}

//       {/* Narration */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700">Narration / Remarks</label>
//         <textarea value={formData.narration} onChange={(e) => handleInputChange('narration', e.target.value)} rows={4} className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100" placeholder="Any additional notes..." />
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-start space-x-4 mt-8">
//         <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-[#398C89] text-white font-medium rounded-md hover:bg-[#2e706e] transition disabled:opacity-50">
//           {saving ? "Saving..." : (isEditMode ? "Update Receipt" : "Create Receipt")}
//         </button>
//         <button onClick={handleCancel} className="px-8 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition">
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateReceipt;



























import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const CreateReceipt = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("monthly");
  const [banks, setBanks] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchingBill, setSearchingBill] = useState(false);

  const billSearchTimeout = useRef(null);

  const [formData, setFormData] = useState({
    receiptNumber: "",
    receiptDate: new Date().toISOString().split("T")[0],
    refCode: "",
    refDate: "",
    paymentMethod: "cash",
    cashBankAc: "",
    amount: "",
    chequeNo: "",
    chequeDate: "",
    drawnOnBank: "",
    paymentType: "full",
    nextInstallmentDate: "",
    installmentAmt: "",
    narration: "",
    customer: {
      type: "doctor",
      entityId: "",
      name: "",
      contactPerson: "",
      phoneNumber: "",
      email: "",
      address: { address: "", city: "", state: "", pinCode: "", country: "India" },
    },
    debitType: "",
    debitOn: "",
    debitDate: "",
    gst: "",
    monthlyPremium: "",
  });

  useEffect(() => {
    fetchReceiptBanks();
    fetchDoctorsForReceipt();
    if (id) {
      setIsEditMode(true);
      fetchReceiptData();
    }
    return () => {
      if (billSearchTimeout.current) clearTimeout(billSearchTimeout.current);
    };
  }, [id]);

  const fetchReceiptBanks = async () => {
    try {
      const response = await apiHelpers.getList(apiEndpoints.recBankDetails.list);
      const bankList = response?.data || response || [];
      setBanks(Array.isArray(bankList) ? bankList : []);
    } catch (error) {
      console.error("Error fetching receipt bank details:", error);
      setBanks([]);
    }
  };

  const fetchDoctorsForReceipt = async () => {
    try {
      const response = await apiHelpers.getList(apiEndpoints.doctors.foreceipt);
      const doctorList = response?.data || response || [];
      setDoctors(Array.isArray(doctorList) ? doctorList : []);
    } catch (error) {
      console.error("Error fetching doctors for receipt:", error);
      setDoctors([]);
    }
  };

  const fetchReceiptData = async () => {
    setLoading(true);
    try {
      const data = await apiHelpers.getById(apiEndpoints.receipts.get, id);
      setFormData({
        receiptNumber: data.receiptNumber || "",
        receiptDate: data.paymentDate ? new Date(data.paymentDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        refCode: data.referenceNumber || "",
        refDate: data.refDate || "",
        paymentMethod: data.paymentMethod || "cash",
        cashBankAc: data.cashBankAc || "",
        amount: data.amount || "",
        chequeNo: data.chequeNo || "",
        chequeDate: data.chequeDate ? new Date(data.chequeDate).toISOString().split("T")[0] : "",
        drawnOnBank: data.drawnOnBank || "",
        paymentType: data.paymentType || "full",
        nextInstallmentDate: data.nextInstallmentDate ? new Date(data.nextInstallmentDate).toISOString().split("T")[0] : "",
        installmentAmt: data.installmentAmount || "",
        narration: data.remarks || "",
        customer: data.payer || {
          type: "doctor",
          entityId: "",
          name: "",
          contactPerson: "",
          phoneNumber: "",
          email: "",
          address: { address: "", city: "", state: "", pinCode: "", country: "India" },
        },
        debitType: data.debitType || "",
        debitOn: data.debitOn || "",
        debitDate: data.debitDate ? new Date(data.debitDate).toISOString().split("T")[0] : "",
        gst: data.gst || "",
        monthlyPremium: data.monthlyPremium || "",
      });
    } catch (error) {
      console.error("Error fetching receipt:", error);
      alert("Failed to load receipt data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith("customer.")) {
      const customerField = field.replace("customer.", "");
      if (customerField.startsWith("address.")) {
        const addressField = customerField.replace("address.", "");
        setFormData((prev) => ({
          ...prev,
          customer: {
            ...prev.customer,
            address: { ...prev.customer.address, [addressField]: value },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          customer: { ...prev.customer, [customerField]: value },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getCurrentUserId = () => {
    try {
      const persistData = localStorage.getItem("persist:root");
      if (!persistData) return null;
      const allData = JSON.parse(persistData);
      const authString = allData.auth;
      if (!authString) return null;
      let authObj;
      try {
        authObj = JSON.parse(authString);
      } catch (e) {
        authObj = authString;
      }
      const user = typeof authObj === "object" ? authObj.user : authObj;
      return user?._id || null;
    } catch (error) {
      return null;
    }
  };

  // Bill Number se Doctor Auto-Fill
  const fetchDoctorByBillNumber = async (billNumber) => {
    const trimmed = billNumber.trim().toUpperCase();
    if (!trimmed || trimmed.length < 4 || searchingBill) return;

    setSearchingBill(true);
    try {
      const response = await apiHelpers.getList(apiEndpoints.salesBills.getDoctorByBillNumber(trimmed));
      const result = response?.data || response;

      if (!result?.doctor?._id) {
        setSearchingBill(false);
        return;
      }

      const doctor = result.doctor;
      const bill = result.bill;

      const fullName = doctor.fullName || "Dr. Unknown";
      const hospitalName = doctor.hospitalName || "";
      const displayName = hospitalName ? `${fullName} - ${hospitalName}` : fullName;

      setFormData((prev) => ({
        ...prev,
        refCode: bill.billNumber,
        refDate: bill.billDate ? new Date(bill.billDate).toISOString().split("T")[0] : "",
        customer: {
          type: "doctor",
          entityId: doctor._id,
          name: displayName,
          contactPerson: fullName,
          phoneNumber: doctor.phoneNumber || "",
          email: doctor.email || "",
          address: {
            address: doctor.address || "",
            city: doctor.city || "",
            state: doctor.state || "",
            pinCode: doctor.pinCode || "",
            country: "India",
          },
        },
      }));
    } catch (error) {
      console.log("Bill number not found");
    } finally {
      setSearchingBill(false);
    }
  };

  const handleDoctorSelect = (doctorId) => {
    const selectedDoctor = doctors.find((d) => d._id === doctorId);
    if (!selectedDoctor) return;

    const fullName = selectedDoctor.fullName || "Dr. Unknown";
    const hospitalName = selectedDoctor.hospitalName || "";
    const displayName = hospitalName ? `${fullName} - ${hospitalName}` : fullName;
    const latestBillNumber = selectedDoctor.latestSalesBill?.billNumber || "";

    setFormData((prev) => ({
      ...prev,
      refCode: latestBillNumber,
      customer: {
        ...prev.customer,
        entityId: selectedDoctor._id,
        name: displayName,
        contactPerson: fullName,
        phoneNumber: selectedDoctor.phoneNumber || "",
        email: selectedDoctor.email || "",
        address: {
          address: selectedDoctor.address?.full ||
            `${selectedDoctor.hospitalAddress?.address || ""}, ${selectedDoctor.hospitalAddress?.taluka || ""}, ${selectedDoctor.hospitalAddress?.city || ""}`.replace(/^,+/g, "").trim(),
          city: selectedDoctor.hospitalAddress?.city || selectedDoctor.address?.city || "",
          state: selectedDoctor.hospitalAddress?.state || selectedDoctor.address?.state || "",
          pinCode: selectedDoctor.hospitalAddress?.pinCode || selectedDoctor.address?.pinCode || "",
          country: "India",
        },
      },
    }));
  };

  const handleBankSelect = (bankId) => {
    const selectedBank = banks.find((b) => b._id === bankId);
    if (!selectedBank) return;
    setFormData((prev) => ({
      ...prev,
      cashBankAc: selectedBank._id,
      drawnOnBank: selectedBank.bankName || "Unknown Bank",
    }));
  };

  const handleSave = async () => {
    if (!formData.amount || !formData.customer.entityId) {
      alert("Please fill required fields: Amount and Customer");
      return;
    }

    setSaving(true);
    const receivedById = getCurrentUserId();
    if (!receivedById) {
      alert("User session expired! Please login again.");
      navigate("/login");
      setSaving(false);
      return;
    }

    try {
      const receiptData = {
        receiptNumber: formData.receiptNumber || `RC${Date.now()}`,
        payer: {
          type: "doctor",
          entityId: formData.customer.entityId,
          name: formData.customer.name,
          contactPerson: formData.customer.contactPerson || formData.customer.name,
          phoneNumber: formData.customer.phoneNumber || "",
          email: formData.customer.email || "",
          address: formData.customer.address,
        },
        receivedBy: receivedById,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        paymentDate: formData.chequeDate || formData.receiptDate,
        status: "received",
        referenceNumber: formData.refCode || formData.chequeNo || "",
        remarks: formData.narration,
        // Bank details should be grouped under bankDetails object
        bankDetails: {
          ...(formData.paymentMethod !== 'cash' && {
            bankName: formData.cashBankAc || undefined,
            chequeNumber: formData.paymentMethod === 'cheque' ? formData.chequeNo : undefined,
            chequeDate: formData.paymentMethod === 'cheque' ? formData.chequeDate : undefined,
            referenceNumber: formData.paymentMethod !== 'cash' ? formData.refCode : undefined,
            drawnOnBank: formData.drawnOnBank || undefined
          })
        },
        ...(activeTab === "monthly" && {
          debitType: formData.debitType || undefined,
          debitOn: formData.debitOn || undefined,
          debitDate: formData.debitDate || undefined,
          gst: formData.gst || undefined,
          monthlyPremium: formData.monthlyPremium ? parseFloat(formData.monthlyPremium) : undefined,
        }),
        ...(activeTab === "yearly" && formData.paymentType === "installment" && {
          nextInstallmentDate: formData.nextInstallmentDate || undefined,
          installmentAmount: formData.installmentAmt ? parseFloat(formData.installmentAmt) : undefined,
        }),
      };

      if (isEditMode) {
        await apiHelpers.update(apiEndpoints.receipts.update, id, receiptData);
        alert("Receipt updated successfully!");
      } else {
        await apiHelpers.create(apiEndpoints.receipts.create, receiptData);
        alert("Receipt created successfully!");
      }
      navigate("/Superadmin/receipt-list");
    } catch (error) {
      console.error("Error saving receipt:", error);
      const msg = error.response?.data?.message || error.message || "Unknown error";
      alert(`Failed to save receipt: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      navigate("/Superadmin/receipt-list");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit Receipt" : "Create Receipt"}
        </h2>
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-6 py-2 font-medium rounded-md transition-colors ${activeTab === "monthly" ? "bg-[#398C89] text-white" : "bg-transparent text-gray-700 hover:bg-gray-300"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab("yearly")}
            className={`px-6 py-2 font-medium rounded-md transition-colors ${activeTab === "yearly" ? "bg-[#398C89] text-white" : "bg-transparent text-gray-700 hover:bg-gray-300"}`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Receipt Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Receipt No.</label>
          <input
            type="text"
            value={formData.receiptNumber}
            onChange={(e) => handleInputChange("receiptNumber", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            placeholder="Auto-generated"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Receipt Date</label>
          <input
            type="date"
            value={formData.receiptDate}
            onChange={(e) => handleInputChange("receiptDate", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center justify-between">
            <span>Ref Code (Bill No.)</span>
            {searchingBill && <span className="text-xs text-blue-600 animate-pulse">Searching...</span>}
          </label>
          <input
            type="text"
            value={formData.refCode}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              handleInputChange("refCode", val);
              if (billSearchTimeout.current) clearTimeout(billSearchTimeout.current);
              billSearchTimeout.current = setTimeout(() => {
                fetchDoctorByBillNumber(val);
              }, 800);
            }}
            className="mt-1 p-2 w-full border-2 border-[#398C89] rounded-md font-semibold focus:ring-2 focus:ring-[#398C89]/30"
            placeholder="Type Bill No. → Auto-fill Doctor"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ref Date</label>
          <input
            type="date"
            value={formData.refDate}
            readOnly
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-200"
          />
        </div>
      </div>

      {/* Doctor Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Doctor/Hospital *</label>
          <select
            value={formData.customer.entityId}
            onChange={(e) => handleDoctorSelect(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            required
          >
            <option value="">Select Doctor/Hospital</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.fullName}
                {doctor.hospitalName && ` - ${doctor.hospitalName}`}
                {doctor.membershipId && ` (${doctor.membershipId})`}
                {doctor.latestSalesBill && ` | Last Bill: ${doctor.latestSalesBill.billNumber}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Person</label>
          <input
            type="text"
            value={formData.customer.contactPerson}
            onChange={(e) => handleInputChange("customer.contactPerson", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>

      {/* Contact & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            value={formData.customer.phoneNumber}
            onChange={(e) => handleInputChange("customer.phoneNumber", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.customer.email}
            onChange={(e) => handleInputChange("customer.email", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={formData.customer.address.address}
            onChange={(e) => handleInputChange("customer.address.address", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={formData.customer.address.city}
            onChange={(e) => handleInputChange("customer.address.city", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            value={formData.customer.address.state}
            onChange={(e) => handleInputChange("customer.address.state", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">PIN</label>
          <input
            type="text"
            value={formData.customer.address.pinCode}
            onChange={(e) => handleInputChange("customer.address.pinCode", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>

      {/* Payment Mode */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode *</label>
        <div className="flex flex-wrap gap-6">
          {["cash", "cheque", "nach", "neft_rtgs", "online", "other"].map((mode) => (
            <label key={mode} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMode"
                value={mode}
                checked={formData.paymentMethod === mode}
                onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                className="text-[#398C89]"
              />
              <span className="text-sm text-gray-700 capitalize">{mode.replace("_", "/")}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amount & Cheque */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount *</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            required
          />
        </div>
        {formData.paymentMethod === "cheque" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cheque No.</label>
              <input
                type="text"
                value={formData.chequeNo}
                onChange={(e) => handleInputChange("chequeNo", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cheque Date</label>
              <input
                type="date"
                value={formData.chequeDate}
                onChange={(e) => handleInputChange("chequeDate", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </>
        )}
      </div>

      {/* Bank Selection (Non-cash) */}
      {formData.paymentMethod !== "cash" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Our Bank Account *</label>
            <select
              value={formData.cashBankAc}
              onChange={(e) => {
                handleInputChange("cashBankAc", e.target.value);
                handleBankSelect(e.target.value);
              }}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            >
              <option value="">Select Bank Account</option>
              {banks.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.bankName} - {bank.accountNumber} ({bank.ifsc || "IFSC"})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Drawn on Bank</label>
            <input
              type="text"
              value={formData.drawnOnBank}
              onChange={(e) => handleInputChange("drawnOnBank", e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              placeholder="Enter bank name"
            />
          </div>
        </div>
      )}

      {/* Yearly Installment */}
      {activeTab === "yearly" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <select
              value={formData.paymentType}
              onChange={(e) => handleInputChange("paymentType", e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
            >
              <option value="full">Full Payment</option>
              <option value="installment">Installment</option>
            </select>
          </div>
          {formData.paymentType === "installment" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Installment Amount</label>
                <input
                  type="number"
                  value={formData.installmentAmt}
                  onChange={(e) => handleInputChange("installmentAmt", e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Next Installment Date</label>
                <input
                  type="date"
                  value={formData.nextInstallmentDate}
                  onChange={(e) => handleInputChange("nextInstallmentDate", e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Monthly Details */}
      {activeTab === "monthly" && (
        <div className="border-t pt-6 mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Debit Type</label>
              <select
                value={formData.debitType}
                onChange={(e) => handleInputChange("debitType", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
              >
                <option value="">Select</option>
                <option value="ach">ACH</option>
                <option value="nach">NACH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Debit On</label>
              <input
                type="text"
                value={formData.debitOn}
                onChange={(e) => handleInputChange("debitOn", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Debit Date</label>
              <input
                type="date"
                value={formData.debitDate}
                onChange={(e) => handleInputChange("debitDate", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GST</label>
              <input
                type="text"
                value={formData.gst}
                onChange={(e) => handleInputChange("gst", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Monthly Premium</label>
              <input
                type="number"
                value={formData.monthlyPremium}
                onChange={(e) => handleInputChange("monthlyPremium", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Narration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Narration / Remarks</label>
        <textarea
          value={formData.narration}
          onChange={(e) => handleInputChange("narration", e.target.value)}
          rows={4}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          placeholder="Any additional notes..."
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-start space-x-4 mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-[#398C89] text-white font-medium rounded-md hover:bg-[#2e706e] transition disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditMode ? "Update Receipt" : "Create Receipt"}
        </button>
        <button
          onClick={handleCancel}
          className="px-8 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateReceipt;