// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import apiClient from "../../../services/apiClient";

// const CreateBulkReceipt = () => {
//   const [step, setStep] = useState(1); // 1: Source, 2: File/Bills, 3: (Conditional) Mapping, 4: Payment Details, 5: Preview, 6: Confirmation
//   const [receiptSource, setReceiptSource] = useState('upload'); // 'upload' or 'bills'
//   const [selectedBills, setSelectedBills] = useState([]);
//   const [salesBills, setSalesBills] = useState([]);
//   const [monthlyBills, setMonthlyBills] = useState([]);
//   const [yearlyBills, setYearlyBills] = useState([]);
//   const [file, setFile] = useState(null);
//   const [defaultPaymentMethod, setDefaultPaymentMethod] = useState('online_transfer');
//   const [fileName, setFileName] = useState("No file chosen");
//   const [headers, setHeaders] = useState([]);
//   const [rawData, setRawData] = useState([]);
//   const [receiptData, setReceiptData] = useState([]);
//   const [previewData, setPreviewData] = useState([]);
//   const [editingReceiptIndex, setEditingReceiptIndex] = useState(null);
//   const [mapping, setMapping] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     membershipType: 'monthly',
//     chequeNo: '',
//     chequeDate: '',
//     drawnOnBank: '',
//     cashBankAc: '',
//     referenceNumber: '',
//     transactionId: '',
//     debitType: '',
//     debitOn: '',
//     debitDate: '',
//     gst: '',
//     monthlyPremium: '',
//     paymentType: 'full',
//     installmentAmt: '',
//     nextInstallmentDate: ''
//   });
//   const [banks, setBanks] = useState([]);

//   // State for pagination and filtering for sales bills
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [membershipTypeFilter, setMembershipTypeFilter] = useState('');

//   // Required Fields for Receipt (when using Excel)
//   const receiptFields = {
//     Doctor: "Customer Name",
//     Hospital: "Customer Name", // fallback if no hospital
//     Description: "Unique_Registration_Number",
//     Amount: "Amount",
//     Date: "Date",
//   };

//   // Fetch sales bill data for bill selection option
//   useEffect(() => {
//     if (step === 2 && receiptSource === 'bills') {
//       fetchSalesBills();
//     }
//   }, [step, receiptSource, page, limit, searchTerm, statusFilter, membershipTypeFilter]);

//   const fetchSalesBills = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await apiClient.get('/sales-bills', {
//         params: {
//           page,
//           limit,
//           search: searchTerm,
//           status: statusFilter,
//           membershipType: 'monthly' // Only fetch monthly bills
//         }
//       });
//       if (response.data.success) {
//         const bills = response.data.data;
//         setSalesBills(bills);

//         // Only set monthly bills, no yearly bills
//         setMonthlyBills(bills);
//         setYearlyBills([]); // Ensure yearly bills is empty
//       }
//     } catch (err) {
//       setError('Failed to fetch sales bills: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch bank details for payment options
//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         const response = await apiClient.get('/rec-bank-details');
//         const bankList = response?.data?.data || response?.data || [];
//         setBanks(Array.isArray(bankList) ? bankList : []);
//       } catch (error) {
//         console.error("Error fetching receipt bank details:", error);
//         setBanks([]);
//       }
//     };

//     if (step === 4 && receiptSource === 'bills') { // Only fetch when we reach the payment details step
//       fetchBanks();
//     }
//   }, [step, receiptSource]);

//   // Handle changing receipt source
//   const handleSourceChange = (source) => {
//     setReceiptSource(source);
//     setStep(2);
//   };

//   // Handle File Upload
//   const handleFileUpload = (e) => {
//     const uploadedFile = e.target.files[0];
//     if (!uploadedFile) return;

//     setFile(uploadedFile);
//     setFileName(uploadedFile.name);
//     const reader = new FileReader();

//     reader.onload = (evt) => {
//       const bstr = evt.target.result;
//       const wb = XLSX.read(bstr, { type: "binary" });
//       const wsname = wb.SheetNames[0];
//       const ws = wb.Sheets[wsname];
//       const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
//       const headers = data[0];
//       const rows = data.slice(1);
//       setHeaders(headers);
//       setRawData(rows);
//       setStep(3); // Skip to mapping step
//     };

//     reader.readAsBinaryString(uploadedFile);
//   };

//   // Handle Sales Bill Selection
//   const handleBillSelection = (billId) => {
//     if (selectedBills.includes(billId)) {
//       setSelectedBills(selectedBills.filter(id => id !== billId));
//     } else {
//       setSelectedBills([...selectedBills, billId]);
//     }
//   };

//   // Handle selection for all bills in a category
//   const handleSelectAllInCategory = (category) => {
//     if (category === 'monthly') {
//       const monthlyIds = monthlyBills.map(bill => bill._id);
//       setSelectedBills(prev => {
//         const newSelected = [...prev];
//         monthlyBills.forEach(bill => {
//           if (!newSelected.includes(bill._id)) {
//             newSelected.push(bill._id);
//           }
//         });
//         return newSelected;
//       });
//     } else if (category === 'yearly') {
//       const yearlyIds = yearlyBills.map(bill => bill._id);
//       setSelectedBills(prev => {
//         const newSelected = [...prev];
//         yearlyBills.forEach(bill => {
//           if (!newSelected.includes(bill._id)) {
//             newSelected.push(bill._id);
//           }
//         });
//         return newSelected;
//       });
//     }
//   };

//   // Handle deselect all in a category
//   const handleDeselectAllInCategory = (category) => {
//     if (category === 'monthly') {
//       setSelectedBills(prev => prev.filter(id => !monthlyBills.some(bill => bill._id === id)));
//     } else if (category === 'yearly') {
//       setSelectedBills(prev => prev.filter(id => !yearlyBills.some(bill => bill._id === id)));
//     }
//   };

//   // Load Demo Data (from your real Excel)
//   const loadDemoData = () => {
//     setFileName("NACHACHDR_900000005478_Mumbai_SuccAndFail_07102025.xlsx");
//     const demoHeaders = [
//       "Unique_Registration_Number",
//       "Transaction ID",
//       "Presentment Mode",
//       "Customer Name",
//       "Amount",
//       "Date",
//       "Status",
//       "Reason Code",
//       "Reason description",
//     ];
//     const demoRows = [
//       ["RML-10830/May 2025", "702250332699", "NACH - ACH - DR", "Nilesh Namdeo Nalavade", "1250", "07-10-2025 00:00:00", "Bill Payment Successful", "00", ""],
//       ["RML-10831/May 2025", "702250332700", "NACH - ACH - DR", "Pragati Hospital", "1250", "07-10-2025 00:00:00", "Bill Payment Successful", "00", ""],
//       ["RML-10737/Jan 2025", "702250332647", "NACH - ACH - DR", "Shreyansh Patil", "1199", "07-10-2025 00:00:00", "Bill Payment Successful", "00", ""],
//       ["RML-10782/March 2025", "702250332669", "NACH - ACH - DR", "Chetan Deepak Sugandhi", "1400", "07-10-2025 00:00:00", "Bill Payment Successful", "00", ""],
//       ["RML-10769/FEB2025", "702250332663", "NACH - ACH - DR", "Sandhyarani Ashok Khot", "899", "07-10-2025 00:00:00", "Bill Payment Failed", "04", "Balance Insufficient"],
//     ];
//     setHeaders(demoHeaders);
//     setRawData(demoRows);
//     setStep(3); // Skip to mapping step
//   };

//   // Handle Mapping
//   const handleMappingChange = (receiptField, excelCol) => {
//     setMapping((prev) => ({
//       ...prev,
//       [receiptField]: excelCol,
//     }));
//   };

//   // Apply Mapping → Generate Receipt Data
//   const applyMapping = () => {
//     const required = ["Doctor", "Amount", "Date"];
//     const missing = required.filter((f) => !mapping[f]);
//     if (missing.length > 0) {
//       alert(`Please map: ${missing.join(", ")}`);
//       return;
//     }

//     const receiptData = rawData.map((row, idx) => {
//       const obj = {};
//       headers.forEach((h, i) => {
//         obj[h] = row[i];
//       });

//       return {
//         payer: {
//           name: obj[mapping.Doctor] || "",
//           type: "doctor", // Default to doctor, can be changed based on data
//         },
//         amount: parseFloat(obj[mapping.Amount]) || 0,
//         receiptDate: formatDate(obj[mapping.Date] || ""),
//         description: obj[mapping.Description] || obj["Unique_Registration_Number"] || "",
//         paymentMethod: defaultPaymentMethod, // Use the selected default payment method
//         cashBankAc: '',
//         chequeNo: '',
//         chequeDate: '',
//         drawnOnBank: '',
//         paymentType: 'full', // Default for yearly payments
//         nextInstallmentDate: '',
//         installmentAmt: '',
//         narration: '',
//         membershipType: 'monthly', // Default to monthly
//         debitType: '',
//         debitOn: '',
//         debitDate: '',
//         gst: '',
//         monthlyPremium: parseFloat(obj[mapping.Amount]) || 0,
//         referenceNumber: obj[mapping.Description] || obj["Unique_Registration_Number"] || "",
//         remarks: ''
//       };
//     });

//     setReceiptData(receiptData);
//     generatePreviewData(receiptData);
//     setStep(4);
//   };

//   // Process Sales Bill Selection → Generate Receipt Data
//   const processBillSelection = () => {
//     // Get the selected bills details - only monthly bills since we only fetch monthly bills
//     const selectedBillDetails = salesBills.filter(bill => selectedBills.includes(bill._id));

//     const receiptData = selectedBillDetails.map(bill => {
//       // Calculate the amount based on bill type and outstanding amount
//       let calculatedAmount = bill.outstandingAmount || bill.totalAmount;

//       // Since we only fetch monthly bills, use the monthly premium amount
//       if (bill.membershipType === 'monthly' && bill.items && bill.items.length > 0) {
//         // Find the monthly premium item
//         const monthlyItem = bill.items.find(item =>
//           item.description.toLowerCase().includes('monthly') ||
//           item.serviceType === 'consultation' ||
//           bill.items.length === 1
//         );
//         if (monthlyItem) {
//           calculatedAmount = monthlyItem.unitPrice || monthlyItem.amount || calculatedAmount;
//         }
//       }

//       return {
//         receiptNumber: `RCPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//         receiptDate: new Date().toISOString().split('T')[0],
//         payer: {
//           type: bill.client.type,
//           name: bill.client.name,
//           entityId: bill.client.entityId,
//         },
//         amount: calculatedAmount,
//         currency: bill.currency || 'INR',
//         paymentMethod: defaultPaymentMethod, // Use the default payment method selected by user
//         cashBankAc: '', // Will be set individually
//         chequeNo: '',
//         chequeDate: '',
//         drawnOnBank: '',
//         paymentType: bill.isInstallment ? 'installment' : 'full', // Set based on bill installment status
//         nextInstallmentDate: bill.nextInstallmentDueDate || '',
//         installmentAmt: bill.paidInstallmentAmount || calculatedAmount, // Use installment amount if available
//         narration: '',
//         // Monthly considerations
//         membershipType: 'monthly', // Force to monthly since we only fetch monthly bills
//         isFirstPayment: bill.outstandingAmount === bill.totalAmount, // If outstanding equals total, it's first payment
//         // Additional fields based on membership type
//         debitType: bill.debitType || '',
//         debitOn: bill.debitOn || '',
//         debitDate: bill.debitDate || '',
//         gst: bill.gst || '',
//         monthlyPremium: bill.items && bill.items.length > 0 ? bill.items[0].unitPrice || bill.items[0].amount : bill.totalAmount || 0, // Store the monthly amount
//         paymentAgainst: {
//           type: 'bill',
//           referenceId: bill._id,
//         },
//         referenceNumber: bill.billNumber, // Store the sales bill number for reference
//         relatedDocuments: {
//           billId: bill._id, // Include billId in relatedDocuments for proper linking
//         },
//         // Payment-specific fields based on payment method (will be set individually later)
//         remarks: `Payment against bill ${bill.billNumber}`,
//         // Store bill-specific details for reference
//         billDetails: {
//           totalAmount: bill.totalAmount,
//           outstandingAmount: bill.outstandingAmount,
//           isInstallment: bill.isInstallment,
//           totalInstallmentAmount: bill.totalInstallmentAmount,
//           paidInstallmentAmount: bill.paidInstallmentAmount,
//           remainingInstallmentAmount: bill.remainingInstallmentAmount,
//           nextInstallmentDueDate: bill.nextInstallmentDueDate,
//           planYears: bill.planYears,
//           planTotalPeriods: bill.planTotalPeriods,
//           expectedTotalAmount: bill.expectedTotalAmount,
//           periodsPaid: bill.periodsPaid,
//           totalPaidSoFar: bill.totalPaidSoFar,
//           membershipTracking: bill.membershipTracking
//         }
//       };
//     });

//     setReceiptData(receiptData);
//     // For bills, go to payment details step (4), for Excel go to preview step (4)
//     if (receiptSource === 'bills') {
//       setStep(4); // Go to payment details step (step 4 for bills path)
//     } else {
//       generatePreviewData(receiptData);
//       setStep(4); // Go to preview step (step 4 for Excel path)
//     }
//   };

//   // Update receipt data with payment details and go to preview step
//   const goToPreview = () => {
//     const updatedReceiptData = receiptData.map(receipt => {
//       return {
//         ...receipt,
//         // Apply payment method specific fields
//         ...(defaultPaymentMethod === 'cheque' && {
//           bankDetails: {
//             chequeNumber: formData.chequeNo,
//             chequeDate: formData.chequeDate,
//             bankName: formData.drawnOnBank,
//             drawnOnBank: formData.drawnOnBank
//           }
//         }),
//         ...(defaultPaymentMethod === 'nach' && {
//           bankDetails: {
//             referenceNumber: formData.referenceNumber,
//             transactionId: formData.transactionId,
//             bankName: formData.drawnOnBank
//           }
//         }),
//         // Apply monthly/yearly specific fields
//         ...(formData.membershipType === 'monthly' && {
//           debitType: formData.debitType,
//           debitOn: formData.debitOn,
//           debitDate: formData.debitDate,
//           gst: formData.gst,
//           monthlyPremium: parseFloat(formData.monthlyPremium) || receipt.monthlyPremium
//         }),
//         ...(formData.membershipType === 'yearly' && {
//           paymentType: formData.paymentType,
//           ...(formData.paymentType === 'installment' && {
//             nextInstallmentDate: formData.nextInstallmentDate,
//             installmentAmount: parseFloat(formData.installmentAmt)
//           })
//         })
//       };
//     });

//     setReceiptData(updatedReceiptData);
//     generatePreviewData(updatedReceiptData);
//     setStep(5);
//   };

//   // Format Date
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     const d = new Date(dateStr);
//     return d.toISOString().split("T")[0];
//   };

//   // Generate preview data from receipt data
//   const generatePreviewData = (data) => {
//     const previewItems = data.map((item, index) => ({
//       id: index,
//       receiptNumber: item.receiptNumber || `RCPT-${Date.now()}-${index}`,
//       receiptDate: item.receiptDate,
//       payerName: item.payer.name,
//       payerType: item.payer.type,
//       amount: item.amount,
//       currency: item.currency || 'INR',
//       paymentMethod: item.paymentMethod,
//       membershipType: item.membershipType,
//       billNumber: item.referenceNumber || (item.paymentAgainst?.referenceId ? salesBills.find(b => b._id === item.paymentAgainst.referenceId)?.billNumber : 'N/A'),
//     }));
//     setPreviewData(previewItems);
//   };

//   // Handle individual receipt field update
//   const updateReceiptField = (index, fieldName, value) => {
//     setReceiptData(prevData => {
//       const newData = [...prevData];
//       newData[index] = {
//         ...newData[index],
//         [fieldName]: value
//       };
//       return newData;
//     });

//     // Also update preview data to reflect changes immediately
//     setPreviewData(prevPreview => {
//       const newPreview = [...prevPreview];
//       newPreview[index] = {
//         ...newPreview[index],
//         [fieldName]: value
//       };
//       return newPreview;
//     });
//   };

//   // Handle nested field updates (like customer.address.city)
//   const updateNestedReceiptField = (index, fieldPath, value) => {
//     setReceiptData(prevData => {
//       const newData = [...prevData];
//       const receipt = { ...newData[index] };

//       // Handle nested field updates (e.g., customer.address.city)
//       const fields = fieldPath.split('.');
//       let current = receipt;

//       for (let i = 0; i < fields.length - 1; i++) {
//         current[fields[i]] = { ...current[fields[i]] };
//         current = current[fields[i]];
//       }

//       current[fields[fields.length - 1]] = value;

//       newData[index] = receipt;
//       return newData;
//     });

//     // Also update preview data
//     setPreviewData(prevPreview => {
//       const newPreview = [...prevPreview];
//       const previewItem = { ...newPreview[index] };

//       const fields = fieldPath.split('.');
//       let current = previewItem;

//       for (let i = 0; i < fields.length - 1; i++) {
//         current[fields[i]] = { ...current[fields[i]] };
//         current = current[fields[i]];
//       }

//       current[fields[fields.length - 1]] = value;

//       newPreview[index] = previewItem;
//       return newPreview;
//     });
//   };

//   // Individual receipt editor component
//   const ReceiptEditor = ({ receipt, index, onSave, onCancel }) => {
//     const [localReceipt, setLocalReceipt] = useState({ ...receipt });
//     const [activeTab, setActiveTab] = useState(receipt.membershipType || "monthly");

//     useEffect(() => {
//       setLocalReceipt({ ...receipt });
//       setActiveTab(receipt.membershipType || "monthly");
//     }, [receipt]);

//     const handleFieldChange = (field, value) => {
//       setLocalReceipt(prev => ({
//         ...prev,
//         [field]: value
//       }));
//     };

//     const handleSave = () => {
//       // Update the main receipt data
//       updateReceiptField(index, 'membershipType', localReceipt.membershipType);
//       updateReceiptField(index, 'paymentMethod', localReceipt.paymentMethod);
//       updateReceiptField(index, 'amount', localReceipt.amount);
//       updateReceiptField(index, 'chequeNo', localReceipt.chequeNo);
//       updateReceiptField(index, 'chequeDate', localReceipt.chequeDate);
//       updateReceiptField(index, 'drawnOnBank', localReceipt.drawnOnBank);
//       updateReceiptField(index, 'cashBankAc', localReceipt.cashBankAc);
//       updateReceiptField(index, 'paymentType', localReceipt.paymentType);
//       updateReceiptField(index, 'nextInstallmentDate', localReceipt.nextInstallmentDate);
//       updateReceiptField(index, 'installmentAmt', localReceipt.installmentAmt);
//       updateReceiptField(index, 'narration', localReceipt.narration);
//       updateReceiptField(index, 'debitType', localReceipt.debitType);
//       updateReceiptField(index, 'debitOn', localReceipt.debitOn);
//       updateReceiptField(index, 'debitDate', localReceipt.debitDate);
//       updateReceiptField(index, 'gst', localReceipt.gst);
//       updateReceiptField(index, 'monthlyPremium', localReceipt.monthlyPremium);

//       onSave();
//     };

//     return (
//       <div className="border border-[#398C89] rounded-lg p-4 mb-4 bg-white shadow-sm">
//         <div className="flex justify-between items-center mb-3">
//           <h4 className="font-semibold text-gray-800">Editing Receipt #{index + 1}</h4>
//           <div className="flex space-x-2">
//             <button
//               onClick={handleSave}
//               className="px-3 py-1 bg-[#398C89] text-white rounded text-sm hover:bg-[#2e706e]"
//             >
//               Save
//             </button>
//             <button
//               onClick={onCancel}
//               className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>

//         {/* Tabs for Monthly/Yearly */}
//         <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-4 w-fit">
//           <button
//             onClick={() => {
//               handleFieldChange('membershipType', 'monthly');
//               setActiveTab('monthly');
//             }}
//             className={`px-4 py-1 font-medium rounded-md transition-colors ${activeTab === "monthly" ? "bg-[#398C89] text-white" : "bg-transparent text-gray-700 hover:bg-gray-300"}`}
//           >
//             Monthly
//           </button>
//           <button
//             onClick={() => {
//               handleFieldChange('membershipType', 'yearly');
//               setActiveTab('yearly');
//             }}
//             className={`px-4 py-1 font-medium rounded-md transition-colors ${activeTab === "yearly" ? "bg-[#398C89] text-white" : "bg-transparent text-gray-700 hover:bg-gray-300"}`}
//           >
//             Yearly
//           </button>
//         </div>

//         {/* Payment Mode */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
//           <div className="flex flex-wrap gap-4">
//             {["cash", "cheque", "nach", "neft", "rtgs", "online_transfer", "demand_draft", "credit_card", "debit_card", "upi"].map((mode) => (
//               <label key={mode} className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name={`paymentMode-${index}`}
//                   value={mode}
//                   checked={localReceipt.paymentMethod === mode}
//                   onChange={(e) => handleFieldChange("paymentMethod", e.target.value)}
//                   className="text-[#398C89]"
//                 />
//                 <span className="text-sm text-gray-700 capitalize">{mode.replace("_", " ")}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Amount */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Amount</label>
//           <input
//             type="number"
//             value={localReceipt.amount}
//             onChange={(e) => handleFieldChange("amount", e.target.value)}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//           />
//         </div>

//         {/* Conditional fields based on payment method */}
//         {localReceipt.paymentMethod === "cheque" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Cheque No.</label>
//               <input
//                 type="text"
//                 value={localReceipt.chequeNo}
//                 onChange={(e) => handleFieldChange("chequeNo", e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Cheque Date</label>
//               <input
//                 type="date"
//                 value={localReceipt.chequeDate}
//                 onChange={(e) => handleFieldChange("chequeDate", e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//               />
//             </div>
//           </div>
//         )}

//         {/* Bank Selection (Non-cash) */}
//         {localReceipt.paymentMethod !== "cash" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Our Bank Account</label>
//               <select
//                 value={localReceipt.cashBankAc}
//                 onChange={(e) => handleFieldChange("cashBankAc", e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
//               >
//                 <option value="">Select Bank Account</option>
//                 {banks.map((bank) => (
//                   <option key={bank._id} value={bank._id}>
//                     {bank.bankName} - {bank.accountNumber}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Drawn on Bank</label>
//               <input
//                 type="text"
//                 value={localReceipt.drawnOnBank}
//                 onChange={(e) => handleFieldChange("drawnOnBank", e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//               />
//             </div>
//           </div>
//         )}

//         {/* Yearly Installment */}
//         {localReceipt.membershipType === "yearly" && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Payment Type</label>
//               <select
//                 value={localReceipt.paymentType}
//                 onChange={(e) => handleFieldChange("paymentType", e.target.value)}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
//               >
//                 <option value="full">Full Payment</option>
//                 <option value="installment">Installment</option>
//               </select>
//             </div>
//             {localReceipt.paymentType === "installment" && (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Installment Amount</label>
//                   <input
//                     type="number"
//                     value={localReceipt.installmentAmt}
//                     onChange={(e) => handleFieldChange("installmentAmt", e.target.value)}
//                     className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Next Installment Date</label>
//                   <input
//                     type="date"
//                     value={localReceipt.nextInstallmentDate}
//                     onChange={(e) => handleFieldChange("nextInstallmentDate", e.target.value)}
//                     className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {/* Monthly Details */}
//         {localReceipt.membershipType === "monthly" && (
//           <div className="border-t pt-4 mt-4 bg-gray-50 p-4 rounded-lg">
//             <h4 className="font-medium text-gray-800 mb-3">Monthly Payment Details</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Debit Type</label>
//                 <select
//                   value={localReceipt.debitType}
//                   onChange={(e) => handleFieldChange("debitType", e.target.value)}
//                   className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
//                 >
//                   <option value="">Select</option>
//                   <option value="ach">ACH</option>
//                   <option value="nach">NACH</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Debit On</label>
//                 <input
//                   type="text"
//                   value={localReceipt.debitOn}
//                   onChange={(e) => handleFieldChange("debitOn", e.target.value)}
//                   className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Debit Date</label>
//                 <input
//                   type="date"
//                   value={localReceipt.debitDate}
//                   onChange={(e) => handleFieldChange("debitDate", e.target.value)}
//                   className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">GST</label>
//                 <input
//                   type="text"
//                   value={localReceipt.gst}
//                   onChange={(e) => handleFieldChange("gst", e.target.value)}
//                   className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700">Monthly Premium</label>
//                 <input
//                   type="number"
//                   value={localReceipt.monthlyPremium}
//                   onChange={(e) => handleFieldChange("monthlyPremium", e.target.value)}
//                   className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Narration */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Narration / Remarks</label>
//           <textarea
//             value={localReceipt.narration}
//             onChange={(e) => handleFieldChange("narration", e.target.value)}
//             rows={2}
//             className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//             placeholder="Any additional notes..."
//           />
//         </div>
//       </div>
//     );
//   };

//   // Create receipts in bulk
//   const createReceipts = async () => {
//     setLoading(true);
//     setError('');
//     setMessage('');

//     try {
//       // Prepare receipt data with proper bank details structure
//       const preparedReceipts = receiptData.map(receipt => {
//         return {
//           ...receipt,
//           // Structure bank details properly
//           bankDetails: {
//             ...(receipt.paymentMethod !== 'cash' && {
//               bankName: receipt.cashBankAc || undefined,
//               chequeNumber: receipt.paymentMethod === 'cheque' ? receipt.chequeNo : undefined,
//               chequeDate: receipt.paymentMethod === 'cheque' ? receipt.chequeDate : undefined,
//               referenceNumber: receipt.paymentMethod !== 'cash' ? receipt.referenceNumber : undefined,
//               drawnOnBank: receipt.drawnOnBank || undefined
//             })
//           },
//           // Remove individual field properties that are now in bankDetails
//           cashBankAc: undefined,
//           chequeNo: undefined,
//           chequeDate: undefined,
//           drawnOnBank: undefined,
//         };
//       });

//       const promises = preparedReceipts.map(receipt =>
//         apiClient.post('/receipts', receipt)
//       );

//       const results = await Promise.allSettled(promises);

//       const successful = results.filter(result => result.status === 'fulfilled').length;
//       const failed = results.filter(result => result.status === 'rejected').length;

//       if (failed === 0) {
//         setMessage(`Successfully created ${successful} receipts!`);
//         setStep(6); // Confirmation step
//       } else {
//         setError(`Created ${successful} receipts. ${failed} failed.`);
//         // Still move to confirmation but with error message
//         setStep(6);
//       }
//     } catch (err) {
//       setError('Error creating receipts: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset process
//   const resetProcess = () => {
//     setStep(1);
//     setReceiptSource('upload');
//     setSelectedBills([]);
//     setMonthlyBills([]);
//     setYearlyBills([]);
//     setFile(null);
//     setFileName("No file chosen");
//     setHeaders([]);
//     setRawData([]);
//     setReceiptData([]);
//     setPreviewData([]);
//     setMapping({});
//     setMessage('');
//     setError('');
//   };

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Bulk Receipts</h2>

//       {/* Progress Steps */}
//       <div className="flex flex-wrap items-center mb-8 text-sm font-medium text-gray-600 gap-2">
//         {(receiptSource === 'upload'
//           ? ["Source Selection", "File Import", "Mapping", "Preview", "Confirmation"]
//           : ["Source Selection", "Bill Selection", "Payment Details", "Preview", "Confirmation"]
//         ).map((label, i) => (
//           <React.Fragment key={i}>
//             <div className={`flex items-center ${step > i + 1 ? "text-[#398C89]" : ""}`}>
//               <span className="w-8 h-8 rounded-full border-2 border-[#398C89] flex items-center justify-center text-xs">
//                 {i + 1}
//               </span>
//               <span className="ml-1">{label}</span>
//             </div>
//             {i < 4 && <div className="w-12 h-px bg-gray-300 hidden md:block"></div>}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Step 1: Source Selection */}
//       {step === 1 && (
//         <div className="border rounded-lg p-6 bg-gray-50">
//           <h3 className="text-lg font-semibold mb-4">Select Receipt Source</h3>
//           <p className="text-sm text-gray-600 mb-6">
//             Choose how you want to create bulk receipts
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div
//               className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${receiptSource === 'upload' ? 'border-[#398C89] bg-green-50' : 'border-gray-300 hover:border-[#398C89]'}`}
//               onClick={() => handleSourceChange('upload')}
//             >
//               <div className="flex items-start">
//                 <div className="flex-shrink-0">
//                   <svg className="w-6 h-6 text-[#398C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                   </svg>
//                 </div>
//                 <div className="ml-4">
//                   <h4 className="text-lg font-medium text-gray-900">Import from Excel/CSV</h4>
//                   <p className="mt-1 text-sm text-gray-600">
//                     Upload a file containing receipt data and map columns to fields
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div
//               className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${receiptSource === 'bills' ? 'border-[#398C89] bg-green-50' : 'border-gray-300 hover:border-[#398C89]'}`}
//               onClick={() => handleSourceChange('bills')}
//             >
//               <div className="flex items-start">
//                 <div className="flex-shrink-0">
//                   <svg className="w-6 h-6 text-[#398C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                   </svg>
//                 </div>
//                 <div className="ml-4">
//                   <h4 className="text-lg font-medium text-gray-900">Create from Sales Bills</h4>
//                   <p className="mt-1 text-sm text-gray-600">
//                     Select existing sales bills to create receipts for payments received
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 text-center">
//             <button
//               onClick={() => setStep(2)}
//               disabled={!receiptSource}
//               className={`px-6 py-2 rounded-md ${
//                 receiptSource
//                   ? 'bg-[#398C89] text-white hover:bg-[#2e706e]'
//                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               Continue
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 2: File Import or Bill Selection */}
//       {step === 2 && (
//         <div>
//           {receiptSource === 'upload' && (
//             <div className="border rounded-lg p-6 bg-gray-50">
//               <h3 className="text-lg font-semibold mb-4">(1) Import File</h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 Upload Excel/CSV <span className="text-red-500">*</span>
//               </p>
//               <div className="flex flex-wrap items-center gap-3">
//                 <label className="px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
//                   Choose File
//                   <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
//                 </label>
//                 <span className="text-sm text-gray-600 truncate max-w-xs">{fileName}</span>
//                 <button
//                   onClick={loadDemoData}
//                   className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
//                 >
//                   Load Demo Data
//                 </button>
//               </div>
//               <p className="text-xs text-gray-500 mt-3">
//                 Tip: CSV works instantly. For .xlsx, SheetJS is used.
//               </p>
//             </div>
//           )}

//           {receiptSource === 'bills' && (
//             <div className="border rounded-lg p-6 bg-gray-50">
//               <h3 className="text-lg font-semibold mb-4">(1) Select Sales Bills</h3>

//               {/* Filters */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                     placeholder="Bill number, client name..."
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   >
//                     <option value="">All Statuses</option>
//                     <option value="pending">Pending</option>
//                     <option value="partially_paid">Partially Paid</option>
//                     <option value="paid">Paid</option>
//                     <option value="overdue">Overdue</option>
//                     <option value="draft">Draft</option>
//                     <option value="sent">Sent</option>
//                     <option value="approved">Approved</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
//                   <select
//                     value={membershipTypeFilter}
//                     onChange={(e) => setMembershipTypeFilter(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   >
//                     <option value="">All Types</option>
//                     <option value="monthly">Monthly</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Results per page</label>
//                   <select
//                     value={limit}
//                     onChange={(e) => setLimit(Number(e.target.value))}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   >
//                     <option value={5}>5</option>
//                     <option value={10}>10</option>
//                     <option value={20}>20</option>
//                     <option value={50}>50</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Controls */}
//               <div className="flex justify-between items-center mb-4">
//                 <div className="text-sm text-gray-600">
//                   Showing {salesBills.length} of {totalPages * limit} bills
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setPage(prev => Math.max(prev - 1, 1))}
//                     disabled={page <= 1}
//                     className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   <span className="px-3 py-1">
//                     Page {page} of {totalPages}
//                   </span>
//                   <button
//                     onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={page >= totalPages}
//                     className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>

//               {/* Loading state */}
//               {loading && (
//                 <div className="flex justify-center py-10">
//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#398C89]"></div>
//                 </div>
//               )}

//               {/* Error state */}
//               {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                   {error}
//                 </div>
//               )}

//               {/* Bills categorized by membership type */}
//               {!loading && !error && (
//                 <div>
//                   {/* Monthly Bills Section */}
//                   {monthlyBills.length > 0 && (
//                     <div className="mb-8">
//                       <div className="flex justify-between items-center mb-4">
//                         <h4 className="text-lg font-semibold text-blue-700">Monthly Membership Bills</h4>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleSelectAllInCategory('monthly')}
//                             className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
//                           >
//                             Select All
//                           </button>
//                           <button
//                             onClick={() => handleDeselectAllInCategory('monthly')}
//                             className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
//                           >
//                             Deselect All
//                           </button>
//                         </div>
//                       </div>

//                       <div className="overflow-x-auto border rounded-lg">
//                         <table className="w-full text-sm text-left">
//                           <thead className="bg-blue-100 text-gray-700">
//                             <tr>
//                               <th className="px-4 py-2 w-12"><input
//                                 type="checkbox"
//                                 onChange={(e) => {
//                                   if (e.target.checked) {
//                                     handleSelectAllInCategory('monthly');
//                                   } else {
//                                     handleDeselectAllInCategory('monthly');
//                                   }
//                                 }}
//                               /></th>
//                               <th className="px-4 py-2">Bill Number</th>
//                               <th className="px-4 py-2">Client</th>
//                               <th className="px-4 py-2">Total Amount</th>
//                               <th className="px-4 py-2">Monthly Amount</th>
//                               <th className="px-4 py-2">Outstanding</th>
//                               <th className="px-4 py-2">Status</th>
//                               <th className="px-4 py-2">Due Date</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {monthlyBills.map((bill) => {
//                               // Calculate monthly amount from bill items
//                               let monthlyAmount = bill.totalAmount;
//                               if (bill.items && bill.items.length > 0) {
//                                 const monthlyItem = bill.items.find(item =>
//                                   item.description?.toLowerCase().includes('monthly') ||
//                                   item.serviceType === 'consultation' ||
//                                   bill.items.length === 1
//                                 );
//                                 if (monthlyItem) {
//                                   monthlyAmount = monthlyItem.unitPrice || monthlyItem.amount || bill.totalAmount;
//                                 }
//                               }

//                               return (
//                                 <tr key={bill._id} className={`border-t hover:bg-gray-50 ${selectedBills.includes(bill._id) ? 'bg-blue-50' : ''}`}>
//                                   <td className="px-4 py-2">
//                                     <input
//                                       type="checkbox"
//                                       checked={selectedBills.includes(bill._id)}
//                                       onChange={() => handleBillSelection(bill._id)}
//                                     />
//                                   </td>
//                                   <td className="px-4 py-2 font-medium">{bill.billNumber}</td>
//                                   <td className="px-4 py-2">
//                                     <div>{bill.client.name}</div>
//                                     <div className="text-xs text-gray-500">{bill.client.type}</div>
//                                   </td>
//                                   <td className="px-4 py-2">₹{bill.totalAmount?.toLocaleString('en-IN')}</td>
//                                   <td className="px-4 py-2 font-semibold text-blue-600">₹{monthlyAmount?.toLocaleString('en-IN')}/mo</td>
//                                   <td className="px-4 py-2">₹{bill.outstandingAmount?.toLocaleString('en-IN')}</td>
//                                   <td className="px-4 py-2">
//                                     <span className={`px-2 py-1 rounded-full text-xs ${
//                                       bill.status === 'paid' ? 'bg-green-100 text-green-800' :
//                                       bill.status === 'overdue' ? 'bg-red-100 text-red-800' :
//                                       bill.status === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' :
//                                       'bg-gray-100 text-gray-800'
//                                     }`}>
//                                       {bill.status.replace('_', ' ')}
//                                     </span>
//                                   </td>
//                                   <td className="px-4 py-2">{new Date(bill.dueDate).toLocaleDateString()}</td>
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   )}

//                   {/* No bills message */}
//                   {monthlyBills.length === 0 && (
//                     <div className="text-center py-10 text-gray-500">
//                       No monthly sales bills found matching your criteria.
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Action buttons */}
//               <div className="mt-6 flex justify-between">
//                 <button
//                   onClick={() => setStep(1)}
//                   className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//                 >
//                   Back
//                 </button>
//                 <div className="flex flex-col items-end gap-3">
//                   <div className="flex items-center gap-3">
//                     <label className="text-sm font-medium text-gray-700">Default Payment Method:</label>
//                     <select
//                       value={defaultPaymentMethod}
//                       onChange={(e) => setDefaultPaymentMethod(e.target.value)}
//                       className="p-2 border border-gray-300 rounded-md"
//                     >
//                       <option value="cash">Cash</option>
//                       <option value="cheque">Cheque</option>
//                       <option value="online_transfer">Online Transfer</option>
//                       <option value="nach">NACH</option>
//                       <option value="neft">NEFT</option>
//                       <option value="rtgs">RTGS</option>
//                       <option value="demand_draft">Demand Draft</option>
//                       <option value="credit_card">Credit Card</option>
//                       <option value="debit_card">Debit Card</option>
//                       <option value="upi">UPI</option>
//                     </select>
//                   </div>
//                   <button
//                     onClick={() => processBillSelection()}
//                     disabled={selectedBills.length === 0}
//                     className={`px-6 py-2 rounded-md ${
//                       selectedBills.length > 0
//                         ? 'bg-[#398C89] text-white hover:bg-[#2e706e]'
//                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     }`}
//                   >
//                     Create Receipts for {selectedBills.length} Bills
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Step 3: Mapping (Only for Excel import) */}
//       {step === 3 && receiptSource === 'upload' && (
//         <div className="border rounded-lg p-6 bg-gray-50">
//           <h3 className="text-lg font-semibold mb-4">(2) Map Columns</h3>
//           <p className="text-sm text-gray-600 mb-4">
//             Map Excel columns to receipt fields.
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {Object.keys(receiptFields).map((field) => (
//               <div key={field} className="flex items-center space-x-3">
//                 <span className="w-40 text-sm font-medium text-gray-700">
//                   {field} {["Doctor", "Amount", "Date"].includes(field) && <span className="text-red-500">*</span>}:
//                 </span>
//                 <select
//                   className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-sm"
//                   value={mapping[field] || ""}
//                   onChange={(e) => handleMappingChange(field, e.target.value)}
//                 >
//                   <option value="">Select Column</option>
//                   {headers.map((h, i) => (
//                     <option key={i} value={h}>
//                       {h}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>
//           <div className="mt-6 flex justify-between">
//             <button
//               onClick={() => setStep(2)}
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//             >
//               Back
//             </button>
//             <button
//               onClick={applyMapping}
//               className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
//             >
//               Apply Mapping
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 4: Payment Details (Only for bill selection) */}
//       {step === 4 && receiptSource === 'bills' && (
//         <div className="border rounded-lg p-6 bg-gray-50">
//           <h3 className="text-lg font-semibold mb-4">(2) Payment Details</h3>
//           <p className="text-sm text-gray-600 mb-4">
//             Set payment details for monthly and yearly bills separately.
//           </p>

//           {/* Monthly Bills Payment Details Section */}
//           {monthlyBills.length > 0 && (
//             <div className="border rounded-lg p-4 mb-6 bg-blue-50">
//               <h4 className="text-md font-semibold text-blue-700 mb-4">Monthly Membership Bills ({monthlyBills.length} bills)</h4>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Payment Method</label>
//                   <select
//                     value={formData.monthlyPaymentMethod || defaultPaymentMethod}
//                     onChange={(e) => setFormData({...formData, monthlyPaymentMethod: e.target.value})}
//                     className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                   >
//                     <option value="cash">Cash</option>
//                     <option value="cheque">Cheque</option>
//                     <option value="online_transfer">Online Transfer</option>
//                     <option value="nach">NACH</option>
//                     <option value="neft">NEFT</option>
//                     <option value="rtgs">RTGS</option>
//                     <option value="demand_draft">Demand Draft</option>
//                     <option value="credit_card">Credit Card</option>
//                     <option value="debit_card">Debit Card</option>
//                     <option value="upi">UPI</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Payment Method Specific Fields for Monthly */}
//               {formData.monthlyPaymentMethod === 'cheque' && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Cheque Number</label>
//                     <input
//                       type="text"
//                       value={formData.monthlyChequeNo || ''}
//                       onChange={(e) => setFormData({...formData, monthlyChequeNo: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter cheque number"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Cheque Date</label>
//                     <input
//                       type="date"
//                       value={formData.monthlyChequeDate || ''}
//                       onChange={(e) => setFormData({...formData, monthlyChequeDate: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Drawn On Bank</label>
//                     <input
//                       type="text"
//                       value={formData.monthlyDrawnOnBank || ''}
//                       onChange={(e) => setFormData({...formData, monthlyDrawnOnBank: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter bank name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Cash/Bank Account</label>
//                     <select
//                       value={formData.monthlyCashBankAc || ''}
//                       onChange={(e) => setFormData({...formData, monthlyCashBankAc: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                     >
//                       <option value="">Select Account</option>
//                       {banks.map(bank => (
//                         <option key={bank._id} value={bank._id}>
//                           {bank.bankName} - {bank.accountNumber}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               )}

//               {formData.monthlyPaymentMethod === 'nach' && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Reference Number</label>
//                     <input
//                       type="text"
//                       value={formData.monthlyReferenceNumber || ''}
//                       onChange={(e) => setFormData({...formData, monthlyReferenceNumber: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter reference number"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
//                     <input
//                       type="text"
//                       value={formData.monthlyTransactionId || ''}
//                       onChange={(e) => setFormData({...formData, monthlyTransactionId: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter transaction ID"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Bank Name</label>
//                     <input
//                       type="text"
//                       value={formData.monthlyDrawnOnBank || ''}
//                       onChange={(e) => setFormData({...formData, monthlyDrawnOnBank: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter bank name"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Monthly Specific Fields */}
//               <div className="border-t pt-4 mt-4 bg-white p-4 rounded-lg">
//                 <h5 className="font-medium text-gray-800 mb-3">Monthly Payment Details</h5>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Debit Type</label>
//                     <select
//                       value={formData.monthlyDebitType || ''}
//                       onChange={(e) => setFormData({...formData, monthlyDebitType: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
//                     >
//                       <option value="">Select</option>
//                       <option value="ach">ACH</option>
//                       <option value="nach">NACH</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Debit On</label>
//                     <input
//                       type="text"
//                       value={formData.monthlyDebitOn || ''}
//                       onChange={(e) => setFormData({...formData, monthlyDebitOn: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter debit details"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Debit Date</label>
//                     <input
//                       type="date"
//                       value={formData.monthlyDebitDate || ''}
//                       onChange={(e) => setFormData({...formData, monthlyDebitDate: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">GST</label>
//                     <input
//                       type="text"
//                       value={formData.monthlyGst || ''}
//                       onChange={(e) => setFormData({...formData, monthlyGst: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter GST amount"
//                     />
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700">Monthly Premium</label>
//                     <input
//                       type="number"
//                       value={formData.monthlyMonthlyPremium || ''}
//                       onChange={(e) => setFormData({...formData, monthlyMonthlyPremium: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter monthly premium"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Yearly Bills Payment Details Section */}
//           {yearlyBills.length > 0 && (
//             <div className="border rounded-lg p-4 mb-6 bg-purple-50">
//               <h4 className="text-md font-semibold text-purple-700 mb-4">Yearly Membership Bills ({yearlyBills.length} bills)</h4>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Payment Method</label>
//                   <select
//                     value={formData.yearlyPaymentMethod || defaultPaymentMethod}
//                     onChange={(e) => setFormData({...formData, yearlyPaymentMethod: e.target.value})}
//                     className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                   >
//                     <option value="cash">Cash</option>
//                     <option value="cheque">Cheque</option>
//                     <option value="online_transfer">Online Transfer</option>
//                     <option value="nach">NACH</option>
//                     <option value="neft">NEFT</option>
//                     <option value="rtgs">RTGS</option>
//                     <option value="demand_draft">Demand Draft</option>
//                     <option value="credit_card">Credit Card</option>
//                     <option value="debit_card">Debit Card</option>
//                     <option value="upi">UPI</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Payment Method Specific Fields for Yearly */}
//               {formData.yearlyPaymentMethod === 'cheque' && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Cheque Number</label>
//                     <input
//                       type="text"
//                       value={formData.yearlyChequeNo || ''}
//                       onChange={(e) => setFormData({...formData, yearlyChequeNo: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter cheque number"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Cheque Date</label>
//                     <input
//                       type="date"
//                       value={formData.yearlyChequeDate || ''}
//                       onChange={(e) => setFormData({...formData, yearlyChequeDate: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Drawn On Bank</label>
//                     <input
//                       type="text"
//                       value={formData.yearlyDrawnOnBank || ''}
//                       onChange={(e) => setFormData({...formData, yearlyDrawnOnBank: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter bank name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Cash/Bank Account</label>
//                     <select
//                       value={formData.yearlyCashBankAc || ''}
//                       onChange={(e) => setFormData({...formData, yearlyCashBankAc: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                     >
//                       <option value="">Select Account</option>
//                       {banks.map(bank => (
//                         <option key={bank._id} value={bank._id}>
//                           {bank.bankName} - {bank.accountNumber}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               )}

//               {formData.yearlyPaymentMethod === 'nach' && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Reference Number</label>
//                     <input
//                       type="text"
//                       value={formData.yearlyReferenceNumber || ''}
//                       onChange={(e) => setFormData({...formData, yearlyReferenceNumber: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter reference number"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
//                     <input
//                       type="text"
//                       value={formData.yearlyTransactionId || ''}
//                       onChange={(e) => setFormData({...formData, yearlyTransactionId: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter transaction ID"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Bank Name</label>
//                     <input
//                       type="text"
//                       value={formData.yearlyDrawnOnBank || ''}
//                       onChange={(e) => setFormData({...formData, yearlyDrawnOnBank: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       placeholder="Enter bank name"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Yearly Specific Fields */}
//               <div className="border-t pt-4 mt-4 bg-white p-4 rounded-lg">
//                 <h5 className="font-medium text-gray-800 mb-3">Yearly Payment Details</h5>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Payment Type</label>
//                     <select
//                       value={formData.yearlyPaymentType || 'full'}
//                       onChange={(e) => setFormData({...formData, yearlyPaymentType: e.target.value})}
//                       className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white"
//                     >
//                       <option value="full">Full Payment</option>
//                       <option value="installment">Installment</option>
//                     </select>
//                   </div>
//                 </div>

//                 {formData.yearlyPaymentType === 'installment' && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Installment Amount</label>
//                       <input
//                         type="number"
//                         value={formData.yearlyInstallmentAmt || ''}
//                         onChange={(e) => setFormData({...formData, yearlyInstallmentAmt: e.target.value})}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                         placeholder="Enter installment amount"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Next Installment Date</label>
//                       <input
//                         type="date"
//                         value={formData.yearlyNextInstallmentDate || ''}
//                         onChange={(e) => setFormData({...formData, yearlyNextInstallmentDate: e.target.value})}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-md"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           <div className="mt-6 flex justify-between">
//             <button
//               onClick={() => setStep(2)}
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//             >
//               Back
//             </button>
//             <button
//               onClick={goToPreview}
//               className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
//             >
//               Continue to Preview
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 4: Preview for Excel uploads */}
//       {step === 4 && receiptSource === 'upload' && (
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Preview Receipts</h3>
//           <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4">
//             Ready to create <strong>{previewData.length} receipts</strong>
//           </div>

//           <div className="overflow-x-auto border rounded-lg">
//             <table className="w-full text-sm text-left">
//               <thead className="bg-gray-100 text-gray-700">
//                 <tr>
//                   <th className="px-4 py-2">#</th>
//                   <th className="px-4 py-2">Receipt Number</th>
//                   <th className="px-4 py-2">Date</th>
//                   <th className="px-4 py-2">Payer Name</th>
//                   <th className="px-4 py-2">Amount</th>
//                   <th className="px-4 py-2">Payment Method</th>
//                   <th className="px-4 py-2">Bill Number</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {previewData.map((item, i) => (
//                   <tr key={item.id} className="border-t hover:bg-gray-50">
//                     <td className="px-4 py-2">{i + 1}</td>
//                     <td className="px-4 py-2 font-medium">{item.receiptNumber}</td>
//                     <td className="px-4 py-2">{new Date(item.receiptDate).toLocaleDateString()}</td>
//                     <td className="px-4 py-2 font-medium">{item.payerName}</td>
//                     <td className="px-4 py-2 font-semibold">₹{item.amount?.toLocaleString('en-IN')}</td>
//                     <td className="px-4 py-2 capitalize">{item.paymentMethod?.replace('_', ' ')}</td>
//                     <td className="px-4 py-2">{item.billNumber}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-6 flex justify-between">
//             <button
//               onClick={() => setStep(receiptSource === 'upload' ? 3 : 2)}
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//             >
//               Back
//             </button>
//             <button
//               onClick={createReceipts}
//               className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
//               disabled={loading}
//             >
//               {loading ? 'Creating...' : `Create ${previewData.length} Receipts`}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 5: Preview */}
//       {step === 5 && (
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Preview Receipts</h3>
//           <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4">
//             Ready to create <strong>{previewData.length} receipts</strong>
//           </div>

//           {/* Categorize receipts by membership type */}
//           <div className="mb-8">
//             <h4 className="text-lg font-semibold text-blue-700 mb-3">Monthly Membership Receipts</h4>
//             <div className="overflow-x-auto border rounded-lg">
//               <table className="w-full text-sm text-left">
//                 <thead className="bg-blue-100 text-gray-700">
//                   <tr>
//                     <th className="px-4 py-2">#</th>
//                     <th className="px-4 py-2">Receipt Number</th>
//                     <th className="px-4 py-2">Date</th>
//                     <th className="px-4 py-2">Payer Name</th>
//                     <th className="px-4 py-2">Amount</th>
//                     <th className="px-4 py-2">Payment Method</th>
//                     <th className="px-4 py-2">Bill Number</th>
//                     <th className="px-4 py-2">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {previewData
//                     .filter(item => item.membershipType === 'monthly')
//                     .map((item, i) => {
//                       const globalIndex = previewData.findIndex(p => p.id === item.id);
//                       return (
//                         <React.Fragment key={item.id}>
//                           <tr className={`border-t hover:bg-gray-50 ${editingReceiptIndex === globalIndex ? 'bg-blue-50' : ''}`}>
//                             <td className="px-4 py-2">{i + 1}</td>
//                             <td className="px-4 py-2 font-medium">{item.receiptNumber}</td>
//                             <td className="px-4 py-2">{new Date(item.receiptDate).toLocaleDateString()}</td>
//                             <td className="px-4 py-2 font-medium">{item.payerName}</td>
//                             <td className="px-4 py-2 font-semibold">₹{item.amount?.toLocaleString('en-IN')}</td>
//                             <td className="px-4 py-2 capitalize">{item.paymentMethod?.replace('_', ' ')}</td>
//                             <td className="px-4 py-2">{item.billNumber}</td>
//                             <td className="px-4 py-2">
//                               <button
//                                 onClick={() => setEditingReceiptIndex(globalIndex === editingReceiptIndex ? null : globalIndex)}
//                                 className="text-[#398C89] hover:text-[#2e706e] font-medium text-sm"
//                               >
//                                 {editingReceiptIndex === globalIndex ? 'Cancel Edit' : 'Edit'}
//                               </button>
//                             </td>
//                           </tr>
//                           {editingReceiptIndex === globalIndex && (
//                             <tr>
//                               <td colSpan="8" className="px-4 py-4 bg-white">
//                                 <ReceiptEditor
//                                   receipt={receiptData[globalIndex]}
//                                   index={globalIndex}
//                                   onSave={() => setEditingReceiptIndex(null)}
//                                   onCancel={() => setEditingReceiptIndex(null)}
//                                 />
//                               </td>
//                             </tr>
//                           )}
//                         </React.Fragment>
//                       );
//                     })}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="mb-8">
//             <h4 className="text-lg font-semibold text-purple-700 mb-3">Yearly Membership Receipts</h4>
//             <div className="overflow-x-auto border rounded-lg">
//               <table className="w-full text-sm text-left">
//                 <thead className="bg-purple-100 text-gray-700">
//                   <tr>
//                     <th className="px-4 py-2">#</th>
//                     <th className="px-4 py-2">Receipt Number</th>
//                     <th className="px-4 py-2">Date</th>
//                     <th className="px-4 py-2">Payer Name</th>
//                     <th className="px-4 py-2">Amount</th>
//                     <th className="px-4 py-2">Payment Method</th>
//                     <th className="px-4 py-2">Bill Number</th>
//                     <th className="px-4 py-2">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {previewData
//                     .filter(item => item.membershipType === 'yearly')
//                     .map((item, i) => {
//                       const globalIndex = previewData.findIndex(p => p.id === item.id);
//                       return (
//                         <React.Fragment key={item.id}>
//                           <tr className={`border-t hover:bg-gray-50 ${editingReceiptIndex === globalIndex ? 'bg-purple-50' : ''}`}>
//                             <td className="px-4 py-2">{i + 1}</td>
//                             <td className="px-4 py-2 font-medium">{item.receiptNumber}</td>
//                             <td className="px-4 py-2">{new Date(item.receiptDate).toLocaleDateString()}</td>
//                             <td className="px-4 py-2 font-medium">{item.payerName}</td>
//                             <td className="px-4 py-2 font-semibold">₹{item.amount?.toLocaleString('en-IN')}</td>
//                             <td className="px-4 py-2 capitalize">{item.paymentMethod?.replace('_', ' ')}</td>
//                             <td className="px-4 py-2">{item.billNumber}</td>
//                             <td className="px-4 py-2">
//                               <button
//                                 onClick={() => setEditingReceiptIndex(globalIndex === editingReceiptIndex ? null : globalIndex)}
//                                 className="text-[#398C89] hover:text-[#2e706e] font-medium text-sm"
//                               >
//                                 {editingReceiptIndex === globalIndex ? 'Cancel Edit' : 'Edit'}
//                               </button>
//                             </td>
//                           </tr>
//                           {editingReceiptIndex === globalIndex && (
//                             <tr>
//                               <td colSpan="8" className="px-4 py-4 bg-white">
//                                 <ReceiptEditor
//                                   receipt={receiptData[globalIndex]}
//                                   index={globalIndex}
//                                   onSave={() => setEditingReceiptIndex(null)}
//                                   onCancel={() => setEditingReceiptIndex(null)}
//                                 />
//                               </td>
//                             </tr>
//                           )}
//                         </React.Fragment>
//                       );
//                     })}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="mt-6 flex justify-between">
//             <button
//               onClick={() => {
//                 if (receiptSource === 'upload') {
//                   setStep(3);
//                 } else {
//                   setStep(4); // Go back to payment details step for bill selection path
//                 }
//               }}
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//             >
//               Back
//             </button>
//             <button
//               onClick={createReceipts}
//               className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
//               disabled={loading}
//             >
//               {loading ? 'Creating...' : `Create ${previewData.length} Receipts`}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 6: Confirmation */}
//       {step === 6 && (
//         <div className="text-center py-10">
//           {message && (
//             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
//               {message}
//             </div>
//           )}

//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//               {error}
//             </div>
//           )}

//           <h3 className="text-xl font-bold text-gray-800 mb-4">Receipts Processing Complete!</h3>
//           <p className="text-gray-600 mb-6">
//             You can now view the created receipts in the Receipt List.
//           </p>

//           <div className="flex justify-center gap-4">
//             <button
//               onClick={resetProcess}
//               className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
//             >
//               Create More Receipts
//             </button>
//             <button
//               onClick={() => window.location.href = '/admin/receipts'} // Navigate to receipts list
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//             >
//               View Receipts List
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateBulkReceipt;

























// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import apiClient from "../../../services/apiClient";

// const CreateBulkReceipt = () => {
//   const [step, setStep] = useState(1);
//   const [receiptSource, setReceiptSource] = useState('upload'); // 'upload' or 'bills'
//   const [selectedBills, setSelectedBills] = useState([]);
//   const [salesBills, setSalesBills] = useState([]);
//   const [monthlyBills, setMonthlyBills] = useState([]);
//   const [file, setFile] = useState(null);
//   const [defaultPaymentMethod] = useState('nach'); // Fixed to NACH only
//   const [fileName, setFileName] = useState("No file chosen");
//   const [headers, setHeaders] = useState([]);
//   const [rawData, setRawData] = useState([]);
//   const [receiptData, setReceiptData] = useState([]);
//   const [previewData, setPreviewData] = useState([]);
//   const [editingReceiptIndex, setEditingReceiptIndex] = useState(null);
//   const [mapping, setMapping] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [banks, setBanks] = useState([]);

//   // Pagination and filtering states
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');

//   // Required fields for Excel mapping
//   const receiptFields = {
//     Doctor: "Customer Name",
//     Hospital: "Customer Name", // fallback
//     Description: "Unique_Registration_Number",
//     Amount: "Amount",
//     Date: "Date",
//   };

//   // Fetch only monthly sales bills
//   useEffect(() => {
//     if (step === 2 && receiptSource === 'bills') {
//       fetchSalesBills();
//     }
//   }, [step, receiptSource, page, limit, searchTerm, statusFilter]);

//   const fetchSalesBills = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await apiClient.get('/sales-bills', {
//         params: {
//           page,
//           limit,
//           search: searchTerm,
//           status: statusFilter,
//           membershipType: 'monthly'
//         }
//       });
//       if (response.data.success) {
//         const bills = response.data.data || [];
//         setSalesBills(bills);
//         setMonthlyBills(bills);
//         setTotalPages(response.data.totalPages || 1);
//       }
//     } catch (err) {
//       setError('Failed to fetch sales bills: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch bank details
//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         const response = await apiClient.get('/rec-bank-details');
//         setBanks(response?.data?.data || []);
//       } catch (error) {
//         console.error("Error fetching banks:", error);
//       }
//     };
//     if (step === 4 && receiptSource === 'bills') {
//       fetchBanks();
//     }
//   }, [step, receiptSource]);

//   const handleSourceChange = (source) => {
//     setReceiptSource(source);
//     setStep(2);
//   };

//   const handleFileUpload = (e) => {
//     const uploadedFile = e.target.files[0];
//     if (!uploadedFile) return;
//     setFile(uploadedFile);
//     setFileName(uploadedFile.name);

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const bstr = evt.target.result;
//       const wb = XLSX.read(bstr, { type: "binary" });
//       const wsname = wb.SheetNames[0];
//       const ws = wb.Sheets[wsname];
//       const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
//       setHeaders(data[0]);
//       setRawData(data.slice(1));
//       setStep(3);
//     };
//     reader.readAsBinaryString(uploadedFile);
//   };

//   const handleBillSelection = (billId) => {
//     if (selectedBills.includes(billId)) {
//       setSelectedBills(selectedBills.filter(id => id !== billId));
//     } else {
//       setSelectedBills([...selectedBills, billId]);
//     }
//   };

//   const handleSelectAllInCategory = () => {
//     const ids = monthlyBills.map(bill => bill._id);
//     setSelectedBills(prev => [...new Set([...prev, ...ids])]);
//   };

//   const handleDeselectAllInCategory = () => {
//     const ids = monthlyBills.map(bill => bill._id);
//     setSelectedBills(prev => prev.filter(id => !ids.includes(id)));
//   };

//   const loadDemoData = () => {
//     setFileName("Demo_NACH_File.xlsx");
//     const demoHeaders = [
//       "Unique_Registration_Number",
//       "Transaction ID",
//       "Presentment Mode",
//       "Customer Name",
//       "Amount",
//       "Date",
//       "Status",
//       "Reason Code",
//       "Reason description",
//     ];
//     const demoRows = [
//       ["RML-10830/May 2025", "702250332699", "NACH - ACH - DR", "Nilesh Namdeo Nalavade", "1250", "07-10-2025 00:00:00", "Bill Payment Successful", "00", ""],
//       ["RML-10831/May 2025", "702250332700", "NACH - ACH - DR", "Pragati Hospital", "1250", "07-10-2025 00:00:00", "Bill Payment Successful", "00", ""],
//     ];
//     setHeaders(demoHeaders);
//     setRawData(demoRows);
//     setStep(3);
//   };

//   const handleMappingChange = (receiptField, excelCol) => {
//     setMapping((prev) => ({
//       ...prev,
//       [receiptField]: excelCol,
//     }));
//   };

//   const applyMapping = () => {
//     const required = ["Doctor", "Amount", "Date"];
//     const missing = required.filter((f) => !mapping[f]);
//     if (missing.length > 0) {
//       alert(`Please map: ${missing.join(", ")}`);
//       return;
//     }

//     const generatedReceipts = rawData.map((row) => {
//       const obj = {};
//       headers.forEach((h, i) => obj[h] = row[i]);
//       return {
//         payer: {
//           name: obj[mapping.Doctor] || obj[mapping.Hospital] || "",
//           type: "doctor",
//         },
//         amount: parseFloat(obj[mapping.Amount]) || 0,
//         receiptDate: formatDate(obj[mapping.Date] || ""),
//         description: obj[mapping.Description] || obj["Unique_Registration_Number"] || "",
//         paymentMethod: 'nach', // Fixed NACH
//         membershipType: 'monthly',
//         monthlyPremium: parseFloat(obj[mapping.Amount]) || 0,
//         referenceNumber: obj[mapping.Description] || obj["Unique_Registration_Number"] || "",
//       };
//     });

//     setReceiptData(generatedReceipts);
//     generatePreviewData(generatedReceipts);
//     setStep(5);
//   };

//   const processBillSelection = () => {
//     const selectedBillDetails = salesBills.filter(bill => selectedBills.includes(bill._id));

//     const receipts = selectedBillDetails.map(bill => {
//       let amount = bill.outstandingAmount || bill.totalAmount;

//       if (bill.items?.length > 0) {
//         const monthlyItem = bill.items.find(item =>
//           item.description?.toLowerCase().includes('monthly') ||
//           item.serviceType === 'consultation' ||
//           bill.items.length === 1
//         );
//         if (monthlyItem) {
//           amount = monthlyItem.unitPrice || monthlyItem.amount || amount;
//         }
//       }

//       return {
//         // receiptNumber: `RCPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//         receiptDate: new Date().toISOString().split('T')[0],
//         payer: {
//           type: bill.client.type,
//           name: bill.client.name,
//           entityId: bill.client.entityId,
//         },
//         amount,
//         currency: bill.currency || 'INR',
//         paymentMethod: 'nach', // Fixed NACH
//         membershipType: 'monthly',
//         monthlyPremium: amount,
//         paymentAgainst: { type: 'bill', referenceId: bill._id },
//         referenceNumber: bill.billNumber,
//         relatedDocuments: { billId: bill._id },
//         remarks: `Payment against monthly bill ${bill.billNumber} via NACH`,
//         billDetails: {
//           totalAmount: bill.totalAmount,
//           outstandingAmount: bill.outstandingAmount,
//         },
//         status: 'received'
//       };
//     });

//     setReceiptData(receipts);
//     setStep(4);
//   };

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     const d = new Date(dateStr);
//     return d.toISOString().split("T")[0];
//   };

//   const generatePreviewData = (data) => {
//     setPreviewData(
//       data.map((item, index) => ({
//         id: index,
//         // receiptNumber: item.receiptNumber || `RCPT-${index + 1}`,
//         receiptNumber: null,
//         receiptDate: item.receiptDate,
//         payerName: item.payer.name,
//         amount: item.amount,
//         paymentMethod: item.paymentMethod,
//         billNumber: item.referenceNumber || 'N/A',
//       }))
//     );
//   };

//   const goToPreview = () => {
//     generatePreviewData(receiptData);
//     setStep(5);
//   };

//   const createReceipts = async () => {
//     setLoading(true);
//     setError('');
//     setMessage('');

//     try {
//       const prepared = receiptData.map(r => ({
//         ...r,
//         bankDetails: {
//           referenceNumber: r.referenceNumber || '',
//           // Add other NACH specific fields if needed
//         }
//       }));

//       const promises = prepared.map(receipt => apiClient.post('/receipts', receipt));
//       const results = await Promise.allSettled(promises);

//       const successCount = results.filter(r => r.status === 'fulfilled').length;

//       if (successCount === prepared.length) {
//         setMessage(`Successfully created ${successCount} NACH receipts!`);
//       } else {
//         setError(`Created ${successCount} receipts. Some failed.`);
//       }
//       setStep(6);
//     } catch (err) {
//       setError('Error creating receipts: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetProcess = () => {
//     setStep(1);
//     setReceiptSource('upload');
//     setSelectedBills([]);
//     setMonthlyBills([]);
//     setFile(null);
//     setFileName("No file chosen");
//     setHeaders([]);
//     setRawData([]);
//     setReceiptData([]);
//     setPreviewData([]);
//     setMapping({});
//     setMessage('');
//     setError('');
//   };

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Bulk NACH Receipts (Monthly Only)</h2>

//       {/* Progress Steps */}
//       <div className="flex flex-wrap items-center mb-8 text-sm font-medium text-gray-600 gap-2">
//         {(receiptSource === 'upload'
//           ? ["Source", "File", "Mapping", "Preview", "Confirmation"]
//           : ["Source", "Bills", "Payment", "Preview", "Confirmation"]
//         ).map((label, i) => (
//           <React.Fragment key={i}>
//             <div className={`flex items-center ${step > i + 1 ? "text-[#398C89]" : ""}`}>
//               <span className="w-8 h-8 rounded-full border-2 border-[#398C89] flex items-center justify-center text-xs">
//                 {i + 1}
//               </span>
//               <span className="ml-1">{label}</span>
//             </div>
//             {i < 4 && <div className="w-12 h-px bg-gray-300 hidden md:block"></div>}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* STEP 1 - Source Selection */}
//       {step === 1 && (
//         <div className="border rounded-lg p-6 bg-gray-50">
//           <h3 className="text-lg font-semibold mb-4">Select Receipt Source</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div
//               className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${receiptSource === 'upload' ? 'border-[#398C89] bg-green-50' : 'border-gray-300 hover:border-[#398C89]'}`}
//               onClick={() => handleSourceChange('upload')}
//             >
//               <h4 className="text-lg font-medium">Import from Excel/CSV</h4>
//               <p className="text-sm text-gray-600 mt-1">Upload NACH payment file</p>
//             </div>

//             <div
//               className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${receiptSource === 'bills' ? 'border-[#398C89] bg-green-50' : 'border-gray-300 hover:border-[#398C89]'}`}
//               onClick={() => handleSourceChange('bills')}
//             >
//               <h4 className="text-lg font-medium">From Monthly Sales Bills</h4>
//               <p className="text-sm text-gray-600 mt-1">Select pending monthly bills</p>
//             </div>
//           </div>
//           <div className="mt-6 text-center">
//             <button
//               onClick={() => setStep(2)}
//               disabled={!receiptSource}
//               className={`px-6 py-2 rounded-md ${receiptSource ? 'bg-[#398C89] text-white hover:bg-[#2e706e]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
//             >
//               Continue
//             </button>
//           </div>
//         </div>
//       )}

//       {/* STEP 2 - File Upload or Bill Selection */}
//       {step === 2 && (
//         <>
//           {receiptSource === 'upload' && (
//             <div className="border rounded-lg p-6 bg-gray-50">
//               <h3 className="text-lg font-semibold mb-4">Upload File</h3>
//               <div className="flex flex-wrap items-center gap-3">
//                 <label className="px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
//                   Choose File
//                   <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
//                 </label>
//                 <span className="text-sm text-gray-600 truncate max-w-xs">{fileName}</span>
//                 <button onClick={loadDemoData} className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]">
//                   Load Demo Data
//                 </button>
//               </div>
//               <div className="mt-6 flex justify-between">
//                 <button onClick={() => setStep(1)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
//                   Back
//                 </button>
//               </div>
//             </div>
//           )}

//           {receiptSource === 'bills' && (
//             <div className="border rounded-lg p-6 bg-gray-50">
//               <h3 className="text-lg font-semibold mb-4">Select Monthly Sales Bills</h3>

//               {/* Filters */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Bill number, client name..."
//                   className="p-2 border border-gray-300 rounded-md"
//                 />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="pending">Pending</option>
//                   <option value="partially_paid">Partially Paid</option>
//                   <option value="overdue">Overdue</option>
//                 </select>
//               </div>

//               {/* Select controls */}
//               <div className="flex justify-between items-center mb-4">
//                 <span className="text-sm text-gray-600">Selected: {selectedBills.length} bills</span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleSelectAllInCategory}
//                     className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
//                   >
//                     Select All
//                   </button>
//                   <button
//                     onClick={handleDeselectAllInCategory}
//                     className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
//                   >
//                     Deselect All
//                   </button>
//                 </div>
//               </div>

//               {/* Bills Table */}
//               {loading ? (
//                 <div className="text-center py-10">Loading monthly bills...</div>
//               ) : monthlyBills.length === 0 ? (
//                 <div className="text-center py-10 text-gray-500">No monthly bills found</div>
//               ) : (
//                 <div className="overflow-x-auto border rounded-lg">
//                   <table className="w-full text-sm text-left">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="p-3 w-12"></th>
//                         <th className="p-3">Bill No</th>
//                         <th className="p-3">Client</th>
//                         <th className="p-3">Total</th>
//                         <th className="p-3">Outstanding</th>
//                         <th className="p-3">Due Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {monthlyBills.map(bill => (
//                         <tr
//                           key={bill._id}
//                           className={`border-t hover:bg-gray-50 ${selectedBills.includes(bill._id) ? 'bg-teal-50' : ''}`}
//                         >
//                           <td className="p-3">
//                             <input
//                               type="checkbox"
//                               checked={selectedBills.includes(bill._id)}
//                               onChange={() => handleBillSelection(bill._id)}
//                             />
//                           </td>
//                           <td className="p-3">{bill.billNumber}</td>
//                           <td className="p-3">{bill.client?.name || 'N/A'}</td>
//                           <td className="p-3">₹{bill.totalAmount?.toLocaleString() || '-'}</td>
//                           <td className="p-3">₹{bill.outstandingAmount?.toLocaleString() || '-'}</td>
//                           <td className="p-3">{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : '-'}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               <div className="mt-6 flex justify-between items-center">
//                 <button
//                   onClick={() => setStep(1)}
//                   className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//                 >
//                   Back
//                 </button>

//                 <button
//                   onClick={processBillSelection}
//                   disabled={selectedBills.length === 0 || loading}
//                   className={`px-8 py-2 rounded-md text-white ${selectedBills.length > 0 && !loading
//                     ? 'bg-[#398C89] hover:bg-[#2e706e]'
//                     : 'bg-gray-400 cursor-not-allowed'}`}
//                 >
//                   Proceed with {selectedBills.length} Bills (NACH)
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* STEP 3 - Mapping (Excel only) */}
//       {step === 3 && receiptSource === 'upload' && (
//         <div className="border rounded-lg p-6 bg-gray-50">
//           <h3 className="text-lg font-semibold mb-4">Map Columns</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {Object.keys(receiptFields).map(field => (
//               <div key={field} className="flex items-center space-x-3">
//                 <span className="w-40 font-medium">
//                   {field} {["Doctor", "Amount", "Date"].includes(field) && <span className="text-red-500">*</span>}
//                 </span>
//                 <select
//                   value={mapping[field] || ""}
//                   onChange={e => handleMappingChange(field, e.target.value)}
//                   className="flex-1 p-2 border rounded-md"
//                 >
//                   <option value="">Select Column</option>
//                   {headers.map(h => <option key={h} value={h}>{h}</option>)}
//                 </select>
//               </div>
//             ))}
//           </div>
//           <div className="mt-6 flex justify-between">
//             <button onClick={() => setStep(2)} className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
//               Back
//             </button>
//             <button onClick={applyMapping} className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]">
//               Apply Mapping
//             </button>
//           </div>
//         </div>
//       )}

//       {/* STEP 4 - Payment Details (Bills flow only) */}
//       {step === 4 && receiptSource === 'bills' && (
//         <div className="border rounded-lg p-6 bg-gray-50">
//           <h3 className="text-lg font-semibold mb-4">Payment Details</h3>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
//             <div className="px-4 py-2 bg-[#398C89]/10 border border-[#398C89]/30 rounded-md text-[#398C89] font-medium inline-block">
//               NACH (Auto Debit) - Fixed
//             </div>
//           </div>

//           {/* You can add more NACH specific fields here if needed */}
//           {/* Example:
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm">Debit Date</label>
//               <input type="date" className="w-full p-2 border rounded" />
//             </div>
//             <div>
//               <label className="block text-sm">Reference Number</label>
//               <input type="text" className="w-full p-2 border rounded" />
//             </div>
//           </div> */}

//           <div className="mt-8 flex justify-between">
//             <button onClick={() => setStep(2)} className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
//               Back
//             </button>
//             <button
//               onClick={goToPreview}
//               className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
//             >
//               Continue to Preview
//             </button>
//           </div>
//         </div>
//       )}

//       {/* STEP 5 - Preview */}
//       {step === 5 && (
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Preview Receipts ({previewData.length})</h3>

//           <div className="overflow-x-auto border rounded-lg">
//             <table className="w-full text-sm text-left">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-3">#</th>
//                   {/* <th className="p-3">Receipt No</th> */}
//                   <th className="p-3">Date</th>
//                   <th className="p-3">Payer</th>
//                   <th className="p-3">Amount</th>
//                   <th className="p-3">Method</th>
//                   <th className="p-3">Bill No</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {previewData.map((item, i) => (
//                   <tr key={i} className="border-t hover:bg-gray-50">
//                     <td className="p-3">{i + 1}</td>
//                     {/* <td className="p-3 font-medium">{item.receiptNumber}</td> */}
//                     <td className="p-3">{item.receiptDate}</td>
//                     <td className="p-3">{item.payerName}</td>
//                     <td className="p-3 font-semibold">₹{item.amount?.toLocaleString('en-IN')}</td>
//                     <td className="p-3 text-[#398C89] font-medium">NACH</td>
//                     <td className="p-3">{item.billNumber}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-6 flex justify-between">
//             <button
//               onClick={() => setStep(receiptSource === 'upload' ? 3 : 4)}
//               className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
//             >
//               Back
//             </button>
//             <button
//               onClick={createReceipts}
//               disabled={loading}
//               className={`px-8 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-[#398C89] hover:bg-[#2e706e]'}`}
//             >
//               {loading ? 'Creating...' : `Create ${previewData.length} NACH Receipts`}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* STEP 6 - Confirmation */}
//       {step === 6 && (
//         <div className="text-center py-10">
//           {message && (
//             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
//               {message}
//             </div>
//           )}
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//               {error}
//             </div>
//           )}
//           <h3 className="text-xl font-bold mb-4">Receipts Processing Complete!</h3>
//           <div className="flex justify-center gap-4">
//             <button
//               onClick={resetProcess}
//               className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
//             >
//               Create More Receipts
//             </button>
//             <button
//               onClick={() => window.location.href = '/admin/receipts'}
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//             >
//               View Receipts List
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateBulkReceipt;



















import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import apiClient from "../../../services/apiClient";

const CreateBulkReceipt = () => {
  const [step, setStep] = useState(1);
  const [receiptSource, setReceiptSource] = useState('upload'); // 'upload' or 'bills'
  const [selectedBills, setSelectedBills] = useState([]);
  const [salesBills, setSalesBills] = useState([]);
  const [monthlyBills, setMonthlyBills] = useState([]);
  const [file, setFile] = useState(null);
  const [defaultPaymentMethod] = useState('nach'); // Fixed to NACH only
  const [fileName, setFileName] = useState("No file chosen");
  const [headers, setHeaders] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [receiptData, setReceiptData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [editingReceiptIndex, setEditingReceiptIndex] = useState(null);
  const [mapping, setMapping] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [banks, setBanks] = useState([]);

  // Pagination and filtering states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Required fields for Excel mapping
  const receiptFields = {
    Doctor: "Customer Name",
    Hospital: "Customer Name", // fallback
    Description: "Unique_Registration_Number",
    Amount: "Amount",
    Date: "Date",
  };

  // Fetch only monthly sales bills
  useEffect(() => {
    if (step === 2 && receiptSource === 'bills') {
      fetchSalesBills();
    }
  }, [step, receiptSource, page, limit, searchTerm, statusFilter, fromDate, toDate]);

  const fetchSalesBills = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit,
        search: searchTerm,
        status: statusFilter,
        membershipType: 'monthly'
      };
      
      // Add date filters only if they have values
      if (fromDate) {
        params.fromNextDebitDate = fromDate;
      }
      if (toDate) {
        params.toNextDebitDate = toDate;
      }

      const response = await apiClient.get('/sales-bills', { params });
      if (response.data.success) {
        const bills = response.data.data || [];
        setSalesBills(bills);
        setMonthlyBills(bills);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (err) {
      setError('Failed to fetch sales bills: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bank details
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await apiClient.get('/receipt-bank-details');
        setBanks(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };
    if (step === 4 && receiptSource === 'bills') {
      fetchBanks();
    }
  }, [step, receiptSource]);

  const handleSourceChange = (source) => {
    setReceiptSource(source);
    setStep(2);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setFileName(uploadedFile.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setHeaders(data[0]);
      setRawData(data.slice(1));
      setStep(3);
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleBillSelection = (billId) => {
    if (selectedBills.includes(billId)) {
      setSelectedBills(selectedBills.filter(id => id !== billId));
    } else {
      setSelectedBills([...selectedBills, billId]);
    }
  };

  const handleSelectAllInCategory = () => {
    const ids = monthlyBills.map(bill => bill._id);
    setSelectedBills(prev => [...new Set([...prev, ...ids])]);
  };

  const handleDeselectAllInCategory = () => {
    const ids = monthlyBills.map(bill => bill._id);
    setSelectedBills(prev => prev.filter(id => !ids.includes(id)));
  };

  const loadDemoData = () => {
    setFileName("Demo_NACH_File.xlsx");
    const demoHeaders = [
      "Unique_Registration_Number",
      "Transaction ID",
      "Presentment Mode",
      "Customer Name",
      "Amount",
      "Date",
      "Status",
      "Reason Code",
      "Reason description",
    ];
    const demoRows = [
      ["RML-10830/May 2025", "702250332699", "NACH - ACH - DR", "Nilesh Namdeo Nalavade", "1250", "07-10-2025 00:00:00", "Bill Payment Successful", "00", ""],
      ["RML-10831/May 2025", "702250332700", "NACH - ACH - DR", "Pragati Hospital", "1250", "07-10-2025 00:00:00", "Bill Payment Successful", "00", ""],
    ];
    setHeaders(demoHeaders);
    setRawData(demoRows);
    setStep(3);
  };

  const handleMappingChange = (receiptField, excelCol) => {
    setMapping((prev) => ({
      ...prev,
      [receiptField]: excelCol,
    }));
  };

  const applyMapping = () => {
    const required = ["Doctor", "Amount", "Date"];
    const missing = required.filter((f) => !mapping[f]);
    if (missing.length > 0) {
      alert(`Please map: ${missing.join(", ")}`);
      return;
    }

    const generatedReceipts = rawData.map((row) => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return {
        payer: {
          name: obj[mapping.Doctor] || obj[mapping.Hospital] || "",
          type: "doctor",
        },
        amount: parseFloat(obj[mapping.Amount]) || 0,
        receiptDate: formatDate(obj[mapping.Date] || ""),
        description: obj[mapping.Description] || obj["Unique_Registration_Number"] || "",
        paymentMethod: 'nach', // Fixed NACH
        membershipType: 'monthly',
        monthlyPremium: parseFloat(obj[mapping.Amount]) || 0,
        referenceNumber: obj[mapping.Description] || obj["Unique_Registration_Number"] || "",
      };
    });

    setReceiptData(generatedReceipts);
    generatePreviewData(generatedReceipts);
    setStep(5);
  };

  const processBillSelection = async () => {
    setLoading(true);
    const selectedBillDetails = salesBills.filter(bill => selectedBills.includes(bill._id));

    try {
      // Fetch previous receipts for each doctor to get bank details
      const receipts = await Promise.all(selectedBillDetails.map(async (bill) => {
        let amount = bill.outstandingAmount || bill.totalAmount;

        if (bill.items?.length > 0) {
          const monthlyItem = bill.items.find(item =>
            item.description?.toLowerCase().includes('monthly') ||
            item.serviceType === 'consultation' ||
            bill.items.length === 1
          );
          if (monthlyItem) {
            amount = monthlyItem.unitPrice || monthlyItem.amount || amount;
          }
        }

        // Fetch previous receipt for this doctor to get bank details
        let previousReceiptBankDetails = null;
        if (bill.client?.entityId) {
          try {
            const entityId = typeof bill.client.entityId === 'object' ? bill.client.entityId._id : bill.client.entityId;
            const response = await apiClient.get('/receipts', {
              params: {
                payerType: 'doctor',
                payerEntityId: entityId,
                paymentMethod: 'nach',
                limit: 1,
                sortBy: 'receiptDate',
                sortOrder: 'desc'
              }
            });

            console.log(`Previous receipt response for ${bill.client.name}:`, response.data);

            if (response.data.success && response.data.data?.length > 0) {
              const lastReceipt = response.data.data[0];
              console.log(`Last receipt for ${bill.client.name}:`, lastReceipt);
              
              // Only use bank details if they actually exist
              const hasCashBankAc = lastReceipt.cashBankAc && lastReceipt.cashBankAc._id;
              const hasDrawnOnBank = lastReceipt.drawnOnBank || lastReceipt.bankDetails?.drawnOnBank;
              
              if (hasCashBankAc || hasDrawnOnBank) {
                previousReceiptBankDetails = {
                  cashBankAc: hasCashBankAc ? lastReceipt.cashBankAc._id : lastReceipt.cashBankAc,
                  drawnOnBank: hasDrawnOnBank || '',
                  bankDetails: lastReceipt.bankDetails || null
                };
                console.log(`Using bank details for ${bill.client.name}:`, previousReceiptBankDetails);
              } else {
                console.log(`No bank details found in previous receipt for ${bill.client.name}`);
              }
            } else {
              console.log(`No previous receipt found for ${bill.client.name}`);
            }
          } catch (err) {
            console.error(`Error fetching previous receipt for ${bill.client.name}:`, err);
            // Continue without bank details, user can fill manually later
          }
        }

        return {
          // receiptNumber: `RCPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          receiptDate: new Date().toISOString().split('T')[0],
          payer: {
            type: bill.client.type,
            name: bill.client.name,
            entityId: bill.client.entityId,
          },
          amount,
          currency: bill.currency || 'INR',
          paymentMethod: 'nach', // Fixed NACH
          membershipType: 'monthly',
          monthlyPremium: amount,
          paymentAgainst: { type: 'bill', referenceId: bill._id },
          referenceNumber: bill.billNumber,
          relatedDocuments: { billId: bill._id },
          remarks: '',
          billDetails: {
            totalAmount: bill.totalAmount,
            outstandingAmount: bill.outstandingAmount,
          },
          status: 'received',
          // Carry forward bank details from previous receipt (only if they exist)
          ...(previousReceiptBankDetails && {
            cashBankAc: previousReceiptBankDetails.cashBankAc,
            drawnOnBank: previousReceiptBankDetails.drawnOnBank,
            bankDetails: previousReceiptBankDetails.bankDetails || {
              referenceNumber: bill.billNumber,
              drawnOnBank: previousReceiptBankDetails.drawnOnBank
            }
          })
        };
      }));

      console.log('Final receipts data:', receipts);
      setReceiptData(receipts);
      setStep(4);
    } catch (err) {
      setError('Error processing bills: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  };

  const generatePreviewData = (data) => {
    setPreviewData(
      data.map((item, index) => ({
        id: index,
        // receiptNumber: item.receiptNumber || `RCPT-${index + 1}`,
        receiptNumber: null,
        receiptDate: item.receiptDate,
        payerName: item.payer.name,
        amount: item.amount,
        paymentMethod: item.paymentMethod,
        billNumber: item.referenceNumber || 'N/A',
      }))
    );
  };

  const goToPreview = () => {
    generatePreviewData(receiptData);
    setStep(5);
  };

  const createReceipts = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const prepared = receiptData.map(r => ({
        ...r,
        bankDetails: {
          referenceNumber: r.referenceNumber || '',
          // Add other NACH specific fields if needed
        }
      }));

      const promises = prepared.map(receipt => apiClient.post('/receipts', receipt));
      const results = await Promise.allSettled(promises);

      const successCount = results.filter(r => r.status === 'fulfilled').length;

      if (successCount === prepared.length) {
        setMessage(`Successfully created ${successCount} NACH receipts!`);
      } else {
        setError(`Created ${successCount} receipts. Some failed.`);
      }
      setStep(6);
    } catch (err) {
      setError('Error creating receipts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetProcess = () => {
    setStep(1);
    setReceiptSource('upload');
    setSelectedBills([]);
    setMonthlyBills([]);
    setFile(null);
    setFileName("No file chosen");
    setHeaders([]);
    setRawData([]);
    setReceiptData([]);
    setPreviewData([]);
    setMapping({});
    setMessage('');
    setError('');
  };

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bulk NACH Receipts (Monthly Only)</h2>

      {/* Progress Steps */}
      <div className="flex flex-wrap items-center mb-8 text-sm font-medium text-gray-600 gap-2">
        {(receiptSource === 'upload'
          ? ["Source", "File", "Mapping", "Preview", "Confirmation"]
          : ["Source", "Bills", "Payment", "Preview", "Confirmation"]
        ).map((label, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center ${step > i + 1 ? "text-[#398C89]" : ""}`}>
              <span className="w-8 h-8 rounded-full border-2 border-[#398C89] flex items-center justify-center text-xs">
                {i + 1}
              </span>
              <span className="ml-1">{label}</span>
            </div>
            {i < 4 && <div className="w-12 h-px bg-gray-300 hidden md:block"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1 - Source Selection */}
      {step === 1 && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Select Receipt Source</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <div
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${receiptSource === 'upload' ? 'border-[#398C89] bg-green-50' : 'border-gray-300 hover:border-[#398C89]'}`}
              onClick={() => handleSourceChange('upload')}
            >
              <h4 className="text-lg font-medium">Import from Excel/CSV</h4>
              <p className="text-sm text-gray-600 mt-1">Upload NACH payment file</p>
            </div> */}

            <div
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${receiptSource === 'bills' ? 'border-[#398C89] bg-green-50' : 'border-gray-300 hover:border-[#398C89]'}`}
              onClick={() => handleSourceChange('bills')}
            >
              <h4 className="text-lg font-medium">From Monthly Sales Bills</h4>
              <p className="text-sm text-gray-600 mt-1">Select pending monthly bills</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => setStep(2)}
              disabled={!receiptSource}
              className={`px-6 py-2 rounded-md ${receiptSource ? 'bg-[#398C89] text-white hover:bg-[#2e706e]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 - File Upload or Bill Selection */}
      {step === 2 && (
        <>
          {receiptSource === 'upload' && (
            <div className="border rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Upload File</h3>
              <div className="flex flex-wrap items-center gap-3">
                <label className="px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                  Choose File
                  <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
                </label>
                <span className="text-sm text-gray-600 truncate max-w-xs">{fileName}</span>
                <button onClick={loadDemoData} className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]">
                  Load Demo Data
                </button>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep(1)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                  Back
                </button>
              </div>
            </div>
          )}

          {receiptSource === 'bills' && (
            <div className="border rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Select Monthly Sales Bills</h3>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Bill number, client name..."
                  className="p-2 border border-gray-300 rounded-md"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Statuses</option>
                  {/* <option value="pending">Pending</option>
                  <option value="partially_paid">Partially Paid</option>
                  <option value="overdue">Overdue</option> */}
                </select>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  placeholder="From Next Debit Date"
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  placeholder="To Next Debit Date"
                  className="p-2 border border-gray-300 rounded-md"
                />
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1); // Reset to first page when changing limit
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                  title="Items per page"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>
              </div>

              {/* Select controls */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">Selected: {selectedBills.length} bills</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAllInCategory}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleDeselectAllInCategory}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Bills Table */}
              {loading ? (
                <div className="text-center py-10">Loading monthly bills...</div>
              ) : monthlyBills.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No monthly bills found</div>
              ) : (
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 w-12"></th>
                        <th className="p-3">Bill No</th>
                        <th className="p-3">Client</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Outstanding</th>
                        <th className="p-3">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyBills.map(bill => (
                        <tr
                          key={bill._id}
                          className={`border-t hover:bg-gray-50 ${selectedBills.includes(bill._id) ? 'bg-teal-50' : ''}`}
                        >
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedBills.includes(bill._id)}
                              onChange={() => handleBillSelection(bill._id)}
                            />
                          </td>
                          <td className="p-3">{bill.billNumber}</td>
                          <td className="p-3">{bill.client?.name || 'N/A'}</td>
                          <td className="p-3">₹{bill.totalAmount?.toLocaleString() || '-'}</td>
                          <td className="p-3">₹{bill.outstandingAmount?.toLocaleString() || '-'}</td>
                          <td className="p-3">{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}



{/* Pagination Controls */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages} • {monthlyBills.length} bills on this page
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1 || loading}
              className={`px-4 py-2 rounded-md text-sm ${
                page === 1 || loading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#398C89] text-white hover:bg-[#2e706e]'
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium">
              {page}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages || loading}
              className={`px-4 py-2 rounded-md text-sm ${
                page === totalPages || loading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#398C89] text-white hover:bg-[#2e706e]'
              }`}
            >
              Next
            </button>
          </div>
          </div>



              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Back
                </button>

                <button
                  onClick={processBillSelection}
                  disabled={selectedBills.length === 0 || loading}
                  className={`px-8 py-2 rounded-md text-white ${selectedBills.length > 0 && !loading
                    ? 'bg-[#398C89] hover:bg-[#2e706e]'
                    : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  Proceed with {selectedBills.length} Bills (NACH)
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* STEP 3 - Mapping (Excel only) */}
      {step === 3 && receiptSource === 'upload' && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Map Columns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(receiptFields).map(field => (
              <div key={field} className="flex items-center space-x-3">
                <span className="w-40 font-medium">
                  {field} {["Doctor", "Amount", "Date"].includes(field) && <span className="text-red-500">*</span>}
                </span>
                <select
                  value={mapping[field] || ""}
                  onChange={e => handleMappingChange(field, e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                >
                  <option value="">Select Column</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(2)} className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
              Back
            </button>
            <button onClick={applyMapping} className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]">
              Apply Mapping
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 - Payment Details (Bills flow only) */}
      {step === 4 && receiptSource === 'bills' && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Payment Details</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
            <div className="px-4 py-2 bg-[#398C89]/10 border border-[#398C89]/30 rounded-md text-[#398C89] font-medium inline-block">
              NACH (Auto Debit) - Fixed
            </div>
          </div>

          {/* You can add more NACH specific fields here if needed */}
          {/* Example:
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Debit Date</label>
              <input type="date" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm">Reference Number</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
          </div> */}

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(2)} className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
              Back
            </button>
            <button
              onClick={goToPreview}
              className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
            >
              Continue to Preview
            </button>
          </div>
        </div>
      )}

      {/* STEP 5 - Preview */}
      {step === 5 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Preview Receipts ({previewData.length})</h3>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">#</th>
                  {/* <th className="p-3">Receipt No</th> */}
                  <th className="p-3">Date</th>
                  <th className="p-3">Payer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Bill No</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((item, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-3">{i + 1}</td>
                    {/* <td className="p-3 font-medium">{item.receiptNumber}</td> */}
                    <td className="p-3">{item.receiptDate}</td>
                    <td className="p-3">{item.payerName}</td>
                    <td className="p-3 font-semibold">₹{item.amount?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-[#398C89] font-medium">NACH</td>
                    <td className="p-3">{item.billNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(receiptSource === 'upload' ? 3 : 4)}
              className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={createReceipts}
              disabled={loading}
              className={`px-8 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-[#398C89] hover:bg-[#2e706e]'}`}
            >
              {loading ? 'Creating...' : `Create ${previewData.length} NACH Receipts`}
            </button>
          </div>
        </div>
      )}

      {/* STEP 6 - Confirmation */}
      {step === 6 && (
        <div className="text-center py-10">
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          <h3 className="text-xl font-bold mb-4">Receipts Processing Complete!</h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={resetProcess}
              className="px-6 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
            >
              Create More Receipts
            </button>
            <button
              onClick={() => window.location.href = '/admin/receipts'}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              View Receipts List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBulkReceipt;