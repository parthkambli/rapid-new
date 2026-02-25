






// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";

// const ExpenseForm = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const expenseId = searchParams.get("id");
//   const isEditMode = !!expenseId;

//   // Helper functions for date formatting
//   const formatDateToDDMMYY = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
//     const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
//     return `${day}-${month}-${year}`;
//   };

//   const formatDateToISO = (dateString) => {
//     if (!dateString) return '';
//     const dateParts = dateString.split('-');
//     if (dateParts.length !== 3) return '';
//     const [day, month, yearStr] = dateParts;
//     if (day.length !== 2 || month.length !== 2 || yearStr.length !== 2) return '';
//     const year = `20${yearStr}`; // Assuming 21st century
//     return `${year}-${month}-${day}`;
//   };

//   const [category, setCategory] = useState("");
//   const [paymentMode, setPaymentMode] = useState("Cash");
//   const [caseRows, setCaseRows] = useState([
//     { doctor: "", caseStage: "", amount: "" }
//   ]);
//   const [total, setTotal] = useState(0);
//   const [advocates, setAdvocates] = useState([]);
//   const [experts, setExperts] = useState([]);
//   const [advocateCases, setAdvocateCases] = useState([]);
//   const [expertCases, setExpertCases] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
//   const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [loadingCases, setLoadingCases] = useState(false);
//   const [loadingEmployees, setLoadingEmployees] = useState(false);
//   const [bankDetails, setBankDetails] = useState([]);
//   const [loadingBankDetails, setLoadingBankDetails] = useState(false);

//   // Utility function to convert file path to accessible URL
//   const convertFilePathToUrl = (filePath) => {
//     if (!filePath) return null;

//     // If it's already a URL, return as is
//     if (filePath.startsWith('http')) {
//       return filePath;
//     }

//     // If it starts with /uploads, it's already a relative path
//     if (filePath.startsWith('/uploads')) {
//       const baseURL = apiClient.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:3000';
//       return `${baseURL}${filePath}`;
//     }

//     // If it's an absolute path (Windows or Unix), extract the uploads portion
//     if (filePath.includes('uploads')) {
//       const uploadsIndex = filePath.lastIndexOf('uploads');
//       if (uploadsIndex !== -1) {
//         const relativePath = filePath.substring(uploadsIndex).replace(/\\/g, '/');
//         const baseURL = apiClient.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:3000';
//         return `${baseURL}/${relativePath}`;
//       }
//     }

//     // Default: assume it's a relative path from uploads
//     const baseURL = apiClient.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:3000';
//     return `${baseURL}/uploads/${filePath}`;
//   };

//   const [formData, setFormData] = useState({
//     paymentDate: new Date().toISOString().split('T')[0], // Set to today's date in ISO format
//     paymentDateFormatted: formatDateToDDMMYY(new Date().toISOString().split('T')[0]), // Set to today's date in DD-MM-YY format
//     voucherNo: "",
//     paidBy: "",
//     officeExpenseType: "Stationery",
//     officeRecipient: "",
//     officeAmount: "",
//     officeRemarks: "",
//     bankName: "",
//     bankTxnRef: "",
//     bankAmount: "",
//     bankRemarks: "",
//     advocateName: "",
//     expertName: "",
//     notes: "",
//     attachment: null,
//     taxApplicable: true, // Default to true for backward compatibility
//     taxRate: 18, // Default to 18% for backward compatibility,
//     personType: "", // Added for tracking person type
//     personId: "", // Added for tracking person ID
//     chequeNumber: "", // Added for cheque payments
//     chequeDate: "", // Added for cheque payments
//   });

//   // Fetch advocates and experts when component mounts and when category changes
//   useEffect(() => {
//     const fetchDropdownData = async () => {
//       // Don't show loading spinner when loading for edit mode to avoid UI flickering
//       if (!(isEditMode && expenseId)) {
//         setLoading(true);
//       }

//       try {
//         if (category === "advocate") {
//           const response = await apiClient.get(apiEndpoints.expenses.dropdown.advocates);
//           setAdvocates(response.data.data || []);
//           setExperts([]); // Clear experts when advocate category is selected

//           // Clear the related doctors lists when changing category
//           setDoctorsForAdvocate([]);
//           setDoctorsForExpert([]);
//         } else if (category === "expert") {
//           const response = await apiClient.get(apiEndpoints.expenses.dropdown.experts);
//           setExperts(response.data.data || []);
//           setAdvocates([]); // Clear advocates when expert category is selected

//           // Clear the related doctors lists when changing category
//           setDoctorsForAdvocate([]);
//           setDoctorsForExpert([]);
//         } else {
//           // Clear both when other categories are selected
//           setAdvocates([]);
//           setExperts([]);
//           // Also clear the related doctors lists
//           setDoctorsForAdvocate([]);
//           setDoctorsForExpert([]);
//         }
//       } catch (error) {
//         console.error("Error fetching dropdown data:", error);
//         setAdvocates([]);
//         setExperts([]);
//       } finally {
//         // Don't hide loading spinner when loading for edit mode to avoid UI flickering
//         if (!(isEditMode && expenseId)) {
//           setLoading(false);
//         }
//       }
//     };

//     if (category === "advocate" || category === "expert") {
//       fetchDropdownData();
//     } else {
//       // Clear dropdowns when not in advocate or expert category
//       setAdvocates([]);
//       setExperts([]);
//       // Also clear the related doctors lists
//       setDoctorsForAdvocate([]);
//       setDoctorsForExpert([]);
//     }
//   }, [category]);

//   // Fetch doctors for the selected advocate when advocate is chosen
//   useEffect(() => {
//     const fetchDoctorsForSelectedAdvocate = async () => {
//       if (category === "advocate" && formData.advocateName && advocates.length > 0) {
//         setLoadingDoctors(true);
//         try {
//           // Find the selected advocate by name to get their ID
//           const selectedAdvocate = advocates.find(advocate => advocate.fullName === formData.advocateName);
//           if (selectedAdvocate) {
//             // Fetch cases for this advocate to get related doctors
//             const response = await apiClient.get(`${apiEndpoints.expenses.cases.advocate}/${selectedAdvocate._id}`);

//             if (response.data.success && response.data.data) {
//               // Extract unique doctor names from the cases
//               const uniqueDoctorNames = [...new Set(response.data.data.map(item => item.doctorName))];

//               // Create doctor objects with the required format
//               const doctorObjects = uniqueDoctorNames
//                 .filter(name => name) // Filter out any null/undefined names
//                 .map((doctorName, index) => ({
//                   _id: `doc_${index}`, // Create a temporary ID
//                   fullName: doctorName
//                 }));

//               setDoctorsForAdvocate(doctorObjects);
//             } else {
//               setDoctorsForAdvocate([]);
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching doctors for advocate:", error);
//           setDoctorsForAdvocate([]);
//         } finally {
//           setLoadingDoctors(false);
//         }
//       }
//     };

//     fetchDoctorsForSelectedAdvocate();
//   }, [category, formData.advocateName, advocates]);

//   // Fetch doctors for the selected expert when expert is chosen
//   useEffect(() => {
//     const fetchDoctorsForSelectedExpert = async () => {
//       if (category === "expert" && formData.expertName && experts.length > 0) {
//         setLoadingDoctors(true);
//         try {
//           // Find the selected expert by name to get their ID
//           const selectedExpert = experts.find(expert => expert.fullName === formData.expertName);
//           if (selectedExpert) {
//             // Fetch cases for this expert to get related doctors
//             const response = await apiClient.get(`${apiEndpoints.expenses.cases.expert}/${selectedExpert._id}`);

//             if (response.data.success && response.data.data) {
//               // Extract unique doctor names from the cases
//               const uniqueDoctorNames = [...new Set(response.data.data.map(item => item.doctorName))];

//               // Create doctor objects with the required format
//               const doctorObjects = uniqueDoctorNames
//                 .filter(name => name) // Filter out any null/undefined names
//                 .map((doctorName, index) => ({
//                   _id: `doc_${index}`, // Create a temporary ID
//                   fullName: doctorName
//                 }));

//               setDoctorsForExpert(doctorObjects);
//             } else {
//               setDoctorsForExpert([]);
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching doctors for expert:", error);
//           setDoctorsForExpert([]);
//         } finally {
//           setLoadingDoctors(false);
//         }
//       }
//     };

//     fetchDoctorsForSelectedExpert();
//   }, [category, formData.expertName, experts]);

//   // State to track if advocates/experts are loaded for edit mode
//   const [advocatesLoadedForEdit, setAdvocatesLoadedForEdit] = useState(false);
//   const [expertsLoadedForEdit, setExpertsLoadedForEdit] = useState(false);

//   // Load existing expense data for edit mode
//   useEffect(() => {
//     const loadExpenseData = async () => {
//       if (isEditMode && expenseId) {
//         try {
//           setLoading(true);
//           console.log("Loading expense data for ID:", expenseId);
//           const response = await apiClient.get(apiEndpoints.expenses.get(expenseId));
//           const expense = response.data.data;
//           console.log("Loaded expense data:", expense);

//           // Set form data from the expense
//           const formattedDate = expense.expenseDate ? formatDateToDDMMYY(expense.expenseDate) : "";
//           const officeExpenseType = expense.subCategory || "Stationery";
//           // Determine the value for paidBy field based on available data
//           let paidByValue = expense.vendor?.name || expense.paidBy || "";
//           // If paidBy is empty but bankName exists (especially for bank charges), use bankName
//           if (!paidByValue && expense.bankName) {
//             paidByValue = expense.bankName;
//           }

//           // Set the initial category based on the expense
//           let initialCategory = "";
//           if (expense.category === 'professional_fees') {
//             // Check the relatedPerson type to determine if it's an expert or advocate
//             if (expense.relatedPerson?.type === 'expert') {
//               initialCategory = 'expert';
//             } else if (expense.relatedPerson?.type === 'advocate') {
//               initialCategory = 'advocate';
//             } else {
//               // Fallback to subCategory if relatedPerson type is not available
//               initialCategory = expense.subCategory === 'expert' ? 'expert' : 'advocate';
//             }
//           } else if (expense.category === 'office_supplies') {
//             initialCategory = 'office';
//           } else if (expense.category === 'utilities' || expense.category === 'bank_transfer') {
//             initialCategory = 'bank';
//           }
//           console.log("Determined initial category:", initialCategory);

//           // Set the category state first to trigger loading of advocates/experts
//           console.log("Setting category to:", initialCategory);
//           setCategory(initialCategory);

//           // Set form data with the loaded values (excluding advocateName and expertName for now)
//           const newFormData = {
//             paymentDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().split('T')[0] : "",
//             paymentDateFormatted: formattedDate,
//             voucherNo: expense.voucherNo || "",
//             paidBy: paidByValue,
//             officeExpenseType: officeExpenseType,
//             officeRecipient: expense.vendor?.name || "",
//             officeAmount: expense.amount?.toString() || "",
//             officeRemarks: expense.remarks || "",
//             bankName: expense.bankName || "",
//             bankTxnRef: expense.voucherNo || "",
//             bankAmount: expense.amount?.toString() || "",
//             bankRemarks: expense.remarks || "",
//             // Don't set advocateName or expertName yet - wait for data to load
//             advocateName: "",
//             expertName: "",
//             notes: expense.note || expense.remarks || "",
//             attachment: expense.attachment ? {
//               name: expense.attachment.split('/').pop(),
//               url: convertFilePathToUrl(expense.attachment),
//               exists: true // Flag to indicate this is an existing file
//             } : null,
//             taxApplicable: expense.taxApplicable !== undefined ? expense.taxApplicable : true,
//             taxRate: expense.taxRate !== undefined ? expense.taxRate : 18,
//             personType: expense.relatedPerson?.type || "", // Load person type from expense
//             personId: expense.relatedPerson?.refId || "", // Load person ID from expense
//             chequeNumber: expense.chequeNumber || "", // Load cheque number if available
//             chequeDate: expense.chequeDate ? formatDateToDDMMYY(new Date(expense.chequeDate)) : "", // Load cheque date if available
//             chequeDateISO: expense.chequeDate ? new Date(expense.chequeDate).toISOString().split('T')[0] : "", // Load cheque date in ISO for date picker
//           };
//           console.log("Setting initial form data:", newFormData);

//           // Set form data after category is set but without advocate/expert names initially
//           setFormData(newFormData);

//           // If the category is advocate or expert, we need to wait for the advocates/experts to load
//           // before setting the form data to ensure the dropdown options are available
//           if (initialCategory === 'advocate' || initialCategory === 'expert') {
//             // Wait for advocates or experts to load by checking the state variables
//             await new Promise((resolve, reject) => {
//               const startTime = Date.now();
//               const timeoutDuration = 10000; // 10 seconds timeout (increased to allow for API calls)

//               const checkDataLoaded = () => {
//                 if ((initialCategory === 'advocate' && advocates.length > 0) ||
//                   (initialCategory === 'expert' && experts.length > 0)) {
//                   console.log(`${initialCategory} loaded successfully with ${initialCategory === 'advocate' ? advocates.length : experts.length} items`);
//                   resolve();
//                 } else if (Date.now() - startTime > timeoutDuration) {
//                   // Timeout reached
//                   console.warn(`Timeout waiting for ${initialCategory} to load after ${timeoutDuration}ms`);
//                   resolve(); // Resolve anyway to prevent hanging
//                 } else {
//                   // Retry after a short delay
//                   setTimeout(checkDataLoaded, 200); // Increased delay to give API call time to respond
//                 }
//               };

//               // Start checking immediately
//               checkDataLoaded();
//             });

//             // Now that data is loaded, set the advocate or expert name to trigger selection
//             if (initialCategory === 'advocate') {
//               setFormData(prev => ({
//                 ...prev,
//                 advocateName: expense.vendor?.name || "",
//               }));
//             } else if (initialCategory === 'expert') {
//               setFormData(prev => ({
//                 ...prev,
//                 expertName: expense.vendor?.name || "",
//               }));
//             }
//           }

//           // If editing an employee-related expense, we need to load the employees
//           if (initialCategory === 'office' && (
//             officeExpenseType === 'Employee Salary' ||
//             officeExpenseType === 'Travelling Allowance' ||
//             officeExpenseType === 'Advance' ||
//             officeExpenseType === 'Incentive' ||
//             officeExpenseType === 'Other')) {
//             // Fetch all employees to populate the dropdown
//             setLoadingEmployees(true);
//             try {
//               const allEmployees = [];
//               let page = 1;
//               let hasMore = true;

//               // Fetch all employees using pagination
//               while (hasMore) {
//                 const response = await apiClient.get(apiEndpoints.employees.list, {
//                   params: {
//                     page: page,
//                     limit: 100 // Use a higher limit to reduce API calls
//                   }
//                 });

//                 if (response.data.data && response.data.data.length > 0) {
//                   allEmployees.push(...response.data.data);
//                   // Check if this is the last page
//                   const totalPages = response.data.pagination?.pages || 1;
//                   hasMore = page < totalPages;
//                 } else {
//                   hasMore = false;
//                 }

//                 page++;
//               }

//               setEmployees(allEmployees);
//               setFilteredEmployees(allEmployees); // Initialize filtered list with all employees

//               // If there's a specific employee selected in the expense, set the search term to that employee
//               if (expense.vendor?.name) {
//                 setEmployeeSearchTerm(expense.vendor?.name);
//               }
//             } catch (error) {
//               console.error("Error fetching employees for edit mode:", error);
//               setEmployees([]);
//             } finally {
//               setLoadingEmployees(false);
//             }
//           } else {
//             // If not editing an employee-related expense, clear the employee search term
//             setEmployeeSearchTerm('');
//           }

//           // Set payment mode
//           if (expense.paymentMethod) {
//             const paymentModeMap = {
//               'cash': 'Cash',
//               'neft/rtgs': 'NEFT/RTGS',
//               'cheque': 'Cheque',
//               'upi': 'UPI',
//               'bank_transfer': 'Bank Transfer',
//             };
//             const mappedPaymentMode = paymentModeMap[expense.paymentMethod] || expense.paymentMethod;
//             setPaymentMode(mappedPaymentMode);

//             // If the payment mode is Cash, ensure paidBy is cleared
//             if (mappedPaymentMode === 'Cash') {
//               setFormData(prev => ({
//                 ...prev,
//                 paidBy: ""
//               }));
//             }
//           }

//           // For advocate/expert cases, set case rows if needed
//           if ((initialCategory === 'advocate' || initialCategory === 'expert') && expense.caseRows) {
//             // Load case rows from the existing expense
//             const loadedCaseRows = expense.caseRows.map(row => ({
//               doctor: row.doctor || "",
//               doctorId: row.doctorId || "",
//               caseStage: row.caseStage || "",
//               amount: row.amount?.toString() || "",
//               fromAddButton: false, // Don't automatically mark as fromAddButton, only show dropdown when doctorId exists
//               caseId: row.caseId || undefined
//             }));
//             setCaseRows(loadedCaseRows);

//             // If any of the loaded case rows have doctorId, set flag to fetch doctors after advocates/experts are loaded
//             const hasDoctorIds = expense.caseRows.some(row => row.doctorId);
//             if (hasDoctorIds) {
//               // Set a flag to trigger the doctor fetching after advocates/experts are loaded
//               setShouldFetchDoctorsAfterLoad(true);
//             }
//           } else if ((initialCategory === 'advocate' || initialCategory === 'expert') && (!expense.caseRows || expense.caseRows.length === 0)) {
//             // If there are no case rows in the expense data, initialize with an empty row
//             setCaseRows([{ doctor: "", caseStage: "", amount: "", fromAddButton: false }]);
//           }

//         } catch (error) {
//           console.error("Error loading expense data:", error);
//           alert("Error loading expense data: " + error.message);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     loadExpenseData();
//   }, [isEditMode, expenseId, advocates, experts]); // Add advocates and experts to the dependency array

//   // Calculate total based on category
//   useEffect(() => {
//     let newTotal = 0;
//     if (category === "office") {
//       newTotal = parseFloat(formData.officeAmount) || 0;
//     } else if (category === "bank") {
//       newTotal = parseFloat(formData.bankAmount) || 0;
//     } else if (category === "advocate" || category === "expert") {
//       newTotal = caseRows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
//     }
//     setTotal(newTotal);
//   }, [category, formData, caseRows]);

//   // Fetch employees when category is office and expense type requires employee selection
//   useEffect(() => {
//     const fetchAllEmployees = async () => {
//       if (category === "office" && (
//         formData.officeExpenseType === "Employee Salary" ||
//         formData.officeExpenseType === "Travelling Allowance" ||
//         formData.officeExpenseType === "Advance" ||
//         formData.officeExpenseType === "Incentive" ||
//         formData.officeExpenseType === "Other")) {
//         setLoadingEmployees(true);
//         try {
//           const allEmployees = [];
//           let page = 1;
//           let hasMore = true;

//           // Fetch all employees using pagination
//           while (hasMore) {
//             const response = await apiClient.get(apiEndpoints.employees.list, {
//               params: {
//                 page: page,
//                 limit: 100 // Use a higher limit to reduce API calls
//               }
//             });

//             if (response.data.data && response.data.data.length > 0) {
//               allEmployees.push(...response.data.data);
//               // Check if this is the last page
//               const totalPages = response.data.pagination?.pages || 1;
//               hasMore = page < totalPages;
//             } else {
//               hasMore = false;
//             }

//             page++;
//           }

//           setEmployees(allEmployees);
//           setFilteredEmployees(allEmployees); // Initialize filtered list with all employees
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//           setEmployees([]);
//         } finally {
//           setLoadingEmployees(false);
//         }
//       } else {
//         // Clear employees list when not needed
//         setEmployees([]);
//         // Reset officeRecipient if user switches away from employee-related expense types
//         if (!(formData.officeExpenseType === "Employee Salary" ||
//           formData.officeExpenseType === "Travelling Allowance" ||
//           formData.officeExpenseType === "Advance" ||
//           formData.officeExpenseType === "Incentive" ||
//           formData.officeExpenseType === "Other")) {
//           setFormData(prev => ({
//             ...prev,
//             officeRecipient: "",
//             personType: "",
//             personId: ""
//           }));
//         }
//       }
//     };

//     fetchAllEmployees();
//   }, [category, formData.officeExpenseType]);

//   // Filter employees based on search term
//   useEffect(() => {
//     if (employeeSearchTerm.trim() === '') {
//       setFilteredEmployees(employees);
//     } else {
//       const term = employeeSearchTerm.toLowerCase();
//       const filtered = employees.filter(employee =>
//         employee.fullName.toLowerCase().includes(term) ||
//         employee.employeeId.toLowerCase().includes(term)
//       );
//       setFilteredEmployees(filtered);
//     }
//   }, [employeeSearchTerm, employees]);

//   // Handle office expense type change to ensure employee salary is handled properly
//   useEffect(() => {
//     if (category === 'office' && formData.officeExpenseType === 'Employee Salary') {
//       // Ensure employees are loaded when employee salary is selected
//       if (employees.length === 0 && !loadingEmployees) {
//         const fetchAllEmployees = async () => {
//           setLoadingEmployees(true);
//           try {
//             const allEmployees = [];
//             let page = 1;
//             let hasMore = true;

//             // Fetch all employees using pagination
//             while (hasMore) {
//               const response = await apiClient.get(apiEndpoints.employees.listdropdown, {
//                 // params: {
//                 //   page: page,
//                 //   limit: 100 // Use a higher limit to reduce API calls
//                 // }
//               });

//               if (response.data.data && response.data.data.length > 0) {
//                 allEmployees.push(...response.data.data);
//                 // Check if this is the last page
//                 const totalPages = response.data.pagination?.pages || 1;
//                 hasMore = page < totalPages;
//               } else {
//                 hasMore = false;
//               }

//               page++;
//             }

//             setEmployees(allEmployees);
//             setFilteredEmployees(allEmployees); // Initialize filtered list with all employees
//           } catch (error) {
//             console.error("Error fetching employees for employee salary:", error);
//             setEmployees([]);
//           } finally {
//             setLoadingEmployees(false);
//           }
//         };

//         fetchAllEmployees();
//       }
//     }
//   }, [category, formData.officeExpenseType, employees.length, loadingEmployees]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const employeeDropdownElement = document.getElementById('employee-search-dropdown');
//       if (employeeDropdownElement && !employeeDropdownElement.contains(event.target)) {
//         setShowEmployeeDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Fetch bank details when component mounts
//   useEffect(() => {
//     const fetchBankDetails = async () => {
//       try {
//         setLoadingBankDetails(true);
//         const response = await apiClient.get(apiEndpoints.recBankDetails.list);
//         if (response.data.success) {
//           setBankDetails(response.data.data || []);
//         } else {
//           console.error('Failed to fetch bank details:', response.data.message);
//           setBankDetails([]);
//         }
//       } catch (error) {
//         console.error('Error fetching bank details:', error);
//         setBankDetails([]);
//       } finally {
//         setLoadingBankDetails(false);
//       }
//     };

//     fetchBankDetails();
//   }, []);

//   // Update paidBy selection when bank details are loaded in edit mode
//   useEffect(() => {
//     if (isEditMode && expenseId && bankDetails.length > 0 && formData.paidBy) {
//       // Check if the current paidBy value exists in bank details
//       const bankExists = bankDetails.some(bank => bank.bankName === formData.paidBy);

//       // If it doesn't exist in the bank details, it might be a vendor name for non-bank expenses
//       // In this case, we keep it as is, but we could add logic to distinguish these cases
//     }
//   }, [bankDetails, isEditMode, expenseId, formData.paidBy]);

//   const handleInputChange = async (e) => {
//     const { name, value, files, type, checked } = e.target;

//     // Handle both advocateName and expertName in the same field depending on category
//     if ((name === "advocateName" || name === "expertName") && category === "advocate") {
//       setFormData(prev => ({
//         ...prev,
//         advocateName: value,
//         expertName: "", // Reset expert name when advocate category is selected
//         personType: "", // Reset person type
//         personId: ""    // Reset person ID
//       }));

//       // Fetch related doctors if a valid advocate is selected, but don't auto-populate cases
//       if (value && advocates.length > 0) {
//         const selectedAdvocate = advocates.find(a => a.fullName === value);
//         if (selectedAdvocate) {
//           setLoadingCases(true);
//           try {
//             // Only fetch the doctors associated with this advocate for the dropdown
//             await fetchDoctorsForAdvocate(selectedAdvocate._id);

//             // Clear any existing case rows and initialize with an empty row
//             setCaseRows([{ doctor: "", caseStage: "", amount: "", fromAddButton: false }]);

//             // Update form data to include advocate ID and type
//             setFormData(prev => ({
//               ...prev,
//               personType: 'advocate',
//               personId: selectedAdvocate._id
//             }));
//           } catch (error) {
//             console.error("Error fetching advocate doctors:", error);
//             setCaseRows([{ doctor: "", caseStage: "", amount: "", fromAddButton: false }]);
//           } finally {
//             setLoadingCases(false);
//           }
//         }
//       }
//     } else if ((name === "advocateName" || name === "expertName") && category === "expert") {
//       setFormData(prev => ({
//         ...prev,
//         expertName: value,
//         advocateName: "", // Reset advocate name when expert category is selected
//         personType: "", // Reset person type
//         personId: ""    // Reset person ID
//       }));

//       // Fetch related doctors if a valid expert is selected, but don't auto-populate cases
//       if (value && experts.length > 0) {
//         const selectedExpert = experts.find(e => e.fullName === value);
//         if (selectedExpert) {
//           setLoadingCases(true);
//           try {
//             // Only fetch the doctors associated with this expert for the dropdown
//             await fetchDoctorsForExpert(selectedExpert._id);

//             // Clear any existing case rows and initialize with an empty row
//             setCaseRows([{ doctor: "", caseStage: "", amount: "", fromAddButton: false }]);

//             // Update form data to include expert ID and type
//             setFormData(prev => ({
//               ...prev,
//               personType: 'expert',
//               personId: selectedExpert._id
//             }));
//           } catch (error) {
//             console.error("Error fetching expert doctors:", error);
//             setCaseRows([{ doctor: "", caseStage: "", amount: "", fromAddButton: false }]);
//           } finally {
//             setLoadingCases(false);
//           }
//         }
//       }
//     } else if (name === "taxApplicable") {
//       // Handle checkbox input for taxApplicable
//       setFormData(prev => ({
//         ...prev,
//         taxApplicable: type === 'checkbox' ? checked : value
//       }));
//     } else if (name === "paymentDateFormatted") {
//       // Handle date input in DD-MM-YY format
//       setFormData(prev => ({
//         ...prev,
//         paymentDateFormatted: value,
//         paymentDate: value ? formatDateToISO(value) : "" // Convert to ISO for backend
//       }));
//     } else if (name === "chequeDate") {
//       // Handle date input in ISO format for cheques (from date picker)
//       setFormData(prev => ({
//         ...prev,
//         chequeDate: value ? formatDateToDDMMYY(new Date(value)) : "", // Format for display
//         chequeDateISO: value // Store ISO format for backend
//       }));
//     } else if (name === "employeeSearch") {
//       // Handle employee search input
//       setEmployeeSearchTerm(value);
//     } else if (name === "officeExpenseType") {
//       // When changing office expense type to employee-related types, ensure employees are available
//       setFormData(prev => ({
//         ...prev,
//         [name]: value,
//         // Reset person info when changing expense type
//         personType: "",
//         personId: ""
//       }));
//     } else if (name === "paidBy") {
//       // When paidBy changes, we'll set it but handle bankName logic separately
//       setFormData(prev => ({
//         ...prev,
//         [name]: files ? files[0] : value
//       }));
//     } else if (name === "paymentMode") {
//       // When payment mode changes to Cash, clear the paidBy field
//       setPaymentMode(value);
//       if (value === "Cash") {
//         setFormData(prev => ({
//           ...prev,
//           paidBy: ""
//         }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: files ? files[0] : value
//       }));
//     }
//   };

//   const handleCaseRowChange = (index, field, value) => {
//     const updated = [...caseRows];
//     updated[index][field] = value;
//     setCaseRows(updated);
//   };

//   const [doctorsForAdvocate, setDoctorsForAdvocate] = useState([]);
//   const [doctorsForExpert, setDoctorsForExpert] = useState([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(false);
//   const [casesForAddedDoctor, setCasesForAddedDoctor] = useState({});
//   const [fetchDoctorsForEdit, setFetchDoctorsForEdit] = useState(false);
//   const [shouldFetchDoctorsAfterLoad, setShouldFetchDoctorsAfterLoad] = useState(false);

//   const fetchDoctorsForAdvocate = async (advocateId) => {
//     setLoadingDoctors(true);
//     try {
//       const response = await apiClient.get(apiEndpoints.expenses.cases.advocate(advocateId));
//       if (response.data.success) {
//         // Store the cases data to be able to retrieve case types later
//         setAdvocateCases(response.data.data || []);

//         // Extract unique doctor names and IDs from cases
//         const uniqueDoctorsMap = new Map();
//         response.data.data.forEach(caseItem => {
//           // Use doctorId if available, otherwise use a combination of name and a generated ID
//           const doctorKey = caseItem.doctorId || caseItem.doctorName || caseItem.patientName;
//           if (doctorKey && !uniqueDoctorsMap.has(doctorKey)) {
//             uniqueDoctorsMap.set(doctorKey, {
//               _id: caseItem.doctorId || `temp_${doctorKey}`, // Use actual doctorId if available
//               fullName: caseItem.doctorName || caseItem.patientName || doctorKey
//             });
//           }
//         });

//         const doctorObjects = Array.from(uniqueDoctorsMap.values());
//         setDoctorsForAdvocate(doctorObjects);
//       } else {
//         setDoctorsForAdvocate([]);
//         setAdvocateCases([]);
//       }
//     } catch (error) {
//       console.error("Error fetching doctors for advocate:", error);
//       setDoctorsForAdvocate([]);
//       setAdvocateCases([]);
//     } finally {
//       setLoadingDoctors(false);
//     }
//   };

//   const fetchDoctorsForExpert = async (expertId) => {
//     setLoadingDoctors(true);
//     try {
//       const response = await apiClient.get(apiEndpoints.expenses.cases.expert(expertId));
//       if (response.data.success) {
//         // Store the cases data to be able to retrieve case types later
//         setExpertCases(response.data.data || []);

//         // Extract unique doctor names and IDs from cases
//         const uniqueDoctorsMap = new Map();
//         response.data.data.forEach(caseItem => {
//           // Use doctorId if available, otherwise use a combination of name and a generated ID
//           const doctorKey = caseItem.doctorId || caseItem.doctorName || caseItem.patientName;
//           if (doctorKey && !uniqueDoctorsMap.has(doctorKey)) {
//             uniqueDoctorsMap.set(doctorKey, {
//               _id: caseItem.doctorId || `temp_${doctorKey}`, // Use actual doctorId if available
//               fullName: caseItem.doctorName || caseItem.patientName || doctorKey
//             });
//           }
//         });

//         const doctorObjects = Array.from(uniqueDoctorsMap.values());
//         setDoctorsForExpert(doctorObjects);
//       } else {
//         setDoctorsForExpert([]);
//         setExpertCases([]);
//       }
//     } catch (error) {
//       console.error("Error fetching doctors for expert:", error);
//       setDoctorsForExpert([]);
//       setExpertCases([]);
//     } finally {
//       setLoadingDoctors(false);
//     }
//   };

//   // Effect to fetch doctors after advocates/experts are loaded in edit mode
//   useEffect(() => {
//     if (isEditMode && expenseId && shouldFetchDoctorsAfterLoad &&
//       ((category === 'advocate' && advocates.length > 0) ||
//         (category === 'expert' && experts.length > 0))) {

//       if (category === 'advocate' && formData.advocateName) {
//         const selectedAdvocate = advocates.find(a => a.fullName === formData.advocateName);
//         if (selectedAdvocate) {
//           fetchDoctorsForAdvocate(selectedAdvocate._id);
//         }
//       } else if (category === 'expert' && formData.expertName) {
//         const selectedExpert = experts.find(e => e.fullName === formData.expertName);
//         if (selectedExpert) {
//           fetchDoctorsForExpert(selectedExpert._id);
//         }
//       }

//       // Reset the flag
//       setShouldFetchDoctorsAfterLoad(false);
//     }
//   }, [isEditMode, expenseId, shouldFetchDoctorsAfterLoad, category, advocates, experts, formData.advocateName, formData.expertName]);

//   // Effect to ensure proper doctor selection in case rows after doctors are loaded in edit mode
//   useEffect(() => {
//     // Only run this effect when in edit mode and doctors have been loaded
//     if (isEditMode && expenseId &&
//       ((category === 'advocate' && doctorsForAdvocate.length > 0) ||
//         (category === 'expert' && doctorsForExpert.length > 0)) &&
//       caseRows.length > 0) {

//       // Check if any case row has a doctorId that should be matched to the loaded doctors
//       const updatedCaseRows = caseRows.map(row => {
//         if (row.doctorId) {
//           // Find if this doctorId exists in the loaded doctors list
//           let doctorExists = false;
//           let matchedDoctor = null;

//           if (category === 'advocate') {
//             matchedDoctor = doctorsForAdvocate.find(d => d._id === row.doctorId);
//             doctorExists = !!matchedDoctor;
//           } else if (category === 'expert') {
//             matchedDoctor = doctorsForExpert.find(d => d._id === row.doctorId);
//             doctorExists = !!matchedDoctor;
//           }

//           // If doctor exists in the list but the name doesn't match, update it
//           if (doctorExists && matchedDoctor.fullName !== row.doctor) {
//             return {
//               ...row,
//               doctor: matchedDoctor.fullName
//             };
//           }
//         }

//         // Return the row as is if no changes needed
//         return row;
//       });

//       // Update case rows if any changes were made
//       if (JSON.stringify(caseRows) !== JSON.stringify(updatedCaseRows)) {
//         setCaseRows(updatedCaseRows);
//       }
//     }
//   }, [isEditMode, expenseId, category, doctorsForAdvocate, doctorsForExpert, caseRows]);

//   const addCaseRow = async () => {
//     if (category === "advocate" || category === "expert") {
//       // For advocate/expert categories, add a case row with the first available doctor from the appropriate list
//       let firstAvailableDoctor = "";
//       let firstAvailableDoctorId = "";

//       if (category === "advocate" && doctorsForAdvocate.length > 0) {
//         firstAvailableDoctor = doctorsForAdvocate[0].fullName;
//         firstAvailableDoctorId = doctorsForAdvocate[0]._id;
//       } else if (category === "expert" && doctorsForExpert.length > 0) {
//         firstAvailableDoctor = doctorsForExpert[0].fullName;
//         firstAvailableDoctorId = doctorsForExpert[0]._id;
//       }

//       // Add a case row with the first available doctor and mark it as added via the add button
//       setCaseRows([...caseRows, {
//         doctor: firstAvailableDoctor,
//         caseStage: "",
//         amount: "",
//         doctorId: firstAvailableDoctorId,
//         fromAddButton: true  // Mark this row as being added via the "Add Case" button
//       }]);
//     } else {
//       // For other categories, add an empty row
//       setCaseRows([...caseRows, { doctor: "", caseStage: "", amount: "" }]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Prepare form data for API submission
//       const expenseData = new FormData();

//       // Basic expense data
//       let expenseTitle = '';
//       if (category === 'advocate') {
//         expenseTitle = 'Advocate Payment' || 'Unknown';
//       } else if (category === 'expert') {
//         expenseTitle = 'Expert Payment' || 'Unknown';
//       } else if (category === 'office') {
//         if (formData.officeExpenseType === 'Employee Salary') {
//           expenseTitle = 'Salary Payment' || 'Unknown';
//         } else {
//           expenseTitle = `${formData.officeExpenseType || 'Office'} Expense`;
//         }
//       } else if (category === 'bank') {
//         expenseTitle = 'Bank Charges' || 'Unknown';
//       } else {
//         expenseTitle = 'Professional Payment';
//       }

//       expenseData.append('expenseTitle', expenseTitle);
//       expenseData.append('description', formData.notes || '');
//       // Map frontend category values to backend valid enum values
//       let backendCategory = category;
//       if (category === 'office') {
//         backendCategory = 'office_supplies';
//       } else if (category === 'bank') {
//         backendCategory = 'utilities'; // or another appropriate category
//       } else if (category === 'advocate' || category === 'expert') {
//         backendCategory = 'professional_fees';
//       }

//       expenseData.append('category', backendCategory);
//       expenseData.append('subCategory', formData.officeExpenseType || category); // Use office expense type if available
//       // Calculate amount based on category
//       let finalAmount = total.toString();
//       if (category === 'office') {
//         finalAmount = formData.officeAmount;
//       } else if (category === 'bank') {
//         finalAmount = formData.bankAmount;
//       }

//       // Calculate final amount based on tax applicability
//       let calculatedAmount = parseFloat(finalAmount) || 0;
//       if (formData.taxApplicable) {
//         // If tax is applicable, the amount should be the base amount (before tax)
//         // The tax-inclusive amount would be calculated separately if needed
//         expenseData.append('amount', calculatedAmount.toString());
//       } else {
//         // If tax is not applicable, just use the calculated amount
//         expenseData.append('amount', calculatedAmount.toString());
//       }
//       expenseData.append('expenseDate', formData.paymentDate);
//       expenseData.append('paymentMethod', paymentMode.toLowerCase().replace(' ', '_'));
//       expenseData.append('voucherNo', formData.voucherNo);

//       // Handle bankName - if paidBy contains a bank name, use that regardless of category
//       let finalBankName = formData.bankName;
//       if (formData.paidBy) {
//         const selectedBank = bankDetails.find(bank => bank.bankName === formData.paidBy);
//         if (selectedBank) {
//           finalBankName = formData.paidBy;
//           // Add the bank ID as paidFrom
//           expenseData.append('paidFrom', selectedBank._id);
//         }
//       }
//       // For Cash payments, don't set bankName
//       if (paymentMode !== "Cash") {
//         expenseData.append('bankName', finalBankName || '');
//       }

//       // Add cheque details if payment mode is Cheque
//       if (paymentMode === 'Cheque') {
//         expenseData.append('chequeNumber', formData.chequeNumber || '');
//         expenseData.append('chequeDate', formData.chequeDateISO || ''); // Use ISO format for backend
//       }

//       expenseData.append('remarks', formData.notes);
//       expenseData.append('note', formData.notes);

//       // Add tax information
//       expenseData.append('taxApplicable', formData.taxApplicable);
//       if (formData.taxApplicable) {
//         expenseData.append('taxRate', formData.taxRate.toString());
//       }

//       // Vendor information - use selected advocate/expert name or office recipient
//       const vendorName = category === 'advocate' ? formData.advocateName :
//         category === 'expert' ? formData.expertName :
//           formData.officeRecipient || formData.paidBy;
//       if (vendorName) {
//         expenseData.append('vendor', JSON.stringify({ name: vendorName }));
//       }

//       // Add related person reference for tracking expenses per individual
//       if (category === 'advocate' && formData.advocateName) {
//         // Find the selected advocate by name to get their ID
//         const selectedAdvocate = advocates.find(a => a.fullName === formData.advocateName);
//         if (selectedAdvocate) {
//           expenseData.append('personType', 'advocate');
//           expenseData.append('personId', selectedAdvocate._id);
//           expenseData.append('personName', selectedAdvocate.fullName);
//         } else if (formData.personId && formData.personType === 'advocate') {
//           // Use stored person details if advocate not found in list
//           expenseData.append('personType', 'advocate');
//           expenseData.append('personId', formData.personId);
//           expenseData.append('personName', formData.advocateName);
//         }
//       } else if (category === 'expert' && formData.expertName) {
//         // Find the selected expert by name to get their ID
//         const selectedExpert = experts.find(e => e.fullName === formData.expertName);
//         if (selectedExpert) {
//           expenseData.append('personType', 'expert');
//           expenseData.append('personId', selectedExpert._id);
//           expenseData.append('personName', selectedExpert.fullName);
//         } else if (formData.personId && formData.personType === 'expert') {
//           // Use stored person details if expert not found in list
//           expenseData.append('personType', 'expert');
//           expenseData.append('personId', formData.personId);
//           expenseData.append('personName', formData.expertName);
//         }
//       } else if (category === 'office' && (
//         formData.officeExpenseType === 'Employee Salary' ||
//         formData.officeExpenseType === 'Travelling Allowance' ||
//         formData.officeExpenseType === 'Advance' ||
//         formData.officeExpenseType === 'Incentive' ||
//         formData.officeExpenseType === 'Other'
//       ) && (formData.officeRecipient || formData.personId)) {
//         // Try to find the employee by name or use stored personId
//         let selectedEmployee = employees.find(e => e.fullName === formData.officeRecipient);
//         if (!selectedEmployee && formData.personId) {
//           // If employee wasn't found by name but personId exists, fetch that employee
//           try {
//             // We might not have all employees loaded, so use the stored ID if available
//             selectedEmployee = { _id: formData.personId, fullName: formData.officeRecipient || formData.paidBy };
//           } catch (e) {
//             console.log("Could not find employee, using stored values");
//           }
//         }

//         if (selectedEmployee) {
//           expenseData.append('personType', 'employee');
//           expenseData.append('personId', selectedEmployee._id);
//           expenseData.append('personName', selectedEmployee.fullName);
//         }
//       } else if (formData.personType && formData.personId) {
//         // Use stored personType and personId if available (for office expenses where employee was selected)
//         expenseData.append('personType', formData.personType);
//         expenseData.append('personId', formData.personId);
//         expenseData.append('personName', formData.officeRecipient || formData.paidBy || formData.advocateName || formData.expertName);
//       }

//       // Add case rows data for advocate/expert expenses
//       if ((category === 'advocate' || category === 'expert') && caseRows.length > 0) {
//         // Convert case rows to JSON string for backend
//         const caseRowsData = caseRows.map(row => ({
//           doctor: row.doctor,
//           doctorId: row.doctorId,
//           caseStage: row.caseStage,
//           amount: parseFloat(row.amount) || 0
//         }));
//         expenseData.append('caseRows', JSON.stringify(caseRowsData));
//       }

//       // Add file if provided
//       if (formData.attachment && formData.attachment instanceof File) {
//         expenseData.append('attachment', formData.attachment);
//       }

//       // Submit to API
//       let response;
//       if (isEditMode && expenseId) {
//         // Update existing expense
//         response = await apiClient.put(apiEndpoints.expenses.update(expenseId), expenseData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       } else {
//         // Create new expense
//         response = await apiClient.post(apiEndpoints.expenses.create, expenseData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       }

//       if (response.data.success) {
//         alert(isEditMode ? "Expense updated successfully!" : "Expense created successfully!");
//         navigate("/admin/expense-list");
//       } else {
//         alert(response.data.message || "Failed to save expense");
//       }
//     } catch (error) {
//       console.error("Error submitting expense:", error);
//       alert("Error saving expense: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleCancel = () => {
//     if (window.confirm("Are you sure? Unsaved changes will be lost.")) {
//       navigate("/admin/expense-list");
//     }
//   };

//   return (
//     <div className="mx-auto p-8 min-h-screen max-w-[79vw]">
//       <h1 className="text-2xl mb-6 font-bold text-gray-800">
//         {isEditMode ? "Edit Payment Entry" : "Payment Entry Form"}
//       </h1>

//       <form onSubmit={handleSubmit}>
//         {/* Payment Details */}
//         <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg font-bold mb-6 text-black">Payment Details</h3>
//           <div className="grid grid-cols-1 gap-6">
//             <div className="grid grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-normal text-gray-700 mb-2">
//                   Date of Payment <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="paymentDate"
//                   value={formData.paymentDate}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-normal text-gray-700 mb-2">
//                   Payment ID / Voucher No. <span className="text-red-500"></span>
//                 </label>
//                 <input
//                   type="text"
//                   name="voucherNo"
//                   value={formData.voucherNo}
//                   onChange={handleInputChange}

//                   placeholder="e.g., VCH-001"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-normal text-gray-700 mb-2">
//                   Payment Mode
//                 </label>
//                 <select
//                   name="paymentMode"
//                   value={paymentMode}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                 >
//                   <option value="Cash">Cash</option>
//                   <option value="Bank Transfer">Bank Transfer</option>
//                   <option value="Cheque">Cheque</option>
//                   <option value="UPI">UPI</option>
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               {/* Conditionally show Paid By field based on payment mode */}
//               {paymentMode !== "Cash" && (
//                 <div>
//                   <label className="block text-sm font-normal text-gray-700 mb-2">
//                     Paid By <span className="text-red-500">*</span>
//                   </label>
//                   {loadingBankDetails ? (
//                     <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100">
//                       Loading bank details...
//                     </div>
//                   ) : (
//                     <select
//                       name="paidBy"
//                       value={formData.paidBy}
//                       onChange={handleInputChange}
//                       required={paymentMode !== "Cash"}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
//                       style={{
//                         backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
//                         backgroundRepeat: "no-repeat",
//                         backgroundPosition: "right 1rem center",
//                       }}
//                     >
//                       <option value="">-- Select Bank --</option>
//                       {bankDetails.map((bank) => (
//                         <option key={bank._id} value={bank.bankName}>
//                           {bank.bankName} - {bank.accountNumber}
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                 </div>
//               )}

//               <div>
//                 <label className="block text-sm font-normal text-gray-700 mb-2">
//                   Payment Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   required
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                 >
//                   <option value="">-- Select --</option>
//                   <option value="office">Office Expenses</option>
//                   <option value="bank">Bank Charges</option>
//                   <option value="advocate">Advocate Payment</option>
//                   <option value="expert">Expert Payment</option>
//                 </select>
//               </div>
//             </div>

//             {/* Conditional fields for Cheque payments */}
//             {paymentMode === "Cheque" && (
//               <div className="grid grid-cols-2 gap-6 mt-4">
//                 <div>
//                   <label className="block text-sm font-normal text-gray-700 mb-2">
//                     Cheque Number
//                   </label>
//                   <input
//                     type="text"
//                     name="chequeNumber"
//                     value={formData.chequeNumber}
//                     onChange={handleInputChange}
//                     placeholder="Enter cheque number"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-normal text-gray-700 mb-2">
//                     Cheque Date
//                   </label>
//                   <input
//                     type="date"
//                     name="chequeDate"
//                     value={formData.chequeDateISO || ""}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Office Expenses Section */}
//         {category === "office" && (
//           <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//             <h3 className="text-lg font-bold mb-6 text-black">Office Expenses</h3>
//             <div className="space-y-6">
//               <div className="grid grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-normal text-gray-700 mb-2">Expense Type</label>
//                   <select
//                     name="officeExpenseType"
//                     value={formData.officeExpenseType}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                   >
//                     <option>Stationery</option>
//                     <option>Employee Salary</option>
//                     <option>Advance</option>
//                     <option>Travelling Allowance</option>
//                     <option>Incentive</option>
//                     <option>Other</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-normal text-gray-700 mb-2">Employee / Recipient Name</label>
//                   {(formData.officeExpenseType === "Employee Salary" ||
//                     formData.officeExpenseType === "Travelling Allowance" ||
//                     formData.officeExpenseType === "Advance" ||
//                     formData.officeExpenseType === "Incentive" ||
//                     formData.officeExpenseType === "Other") ? (
//                     loadingEmployees ? (
//                       <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100">
//                         Loading employees...
//                       </div>
//                     ) : (
//                       <div className="relative" id="employee-search-dropdown">
//                         <input
//                           type="text"
//                           name="employeeSearch"
//                           value={employeeSearchTerm}
//                           onChange={handleInputChange}
//                           onFocus={() => setShowEmployeeDropdown(true)}
//                           placeholder="Search employee or enter name..."
//                           className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         {showEmployeeDropdown && (
//                           <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                             {filteredEmployees.length > 0 ? (
//                               <>
//                                 <div className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-50">
//                                   Select Employee
//                                 </div>
//                                 {filteredEmployees.map((employee) => (
//                                   <div
//                                     key={employee._id}
//                                     className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                     onClick={() => {
//                                       setFormData(prev => ({
//                                         ...prev,
//                                         officeRecipient: employee.fullName,
//                                         personType: 'employee',
//                                         personId: employee._id
//                                       }));
//                                       setEmployeeSearchTerm(employee.fullName);
//                                       setShowEmployeeDropdown(false);
//                                     }}
//                                   >
//                                     {employee.fullName} ({employee.employeeId})
//                                   </div>
//                                 ))}
//                                 <div className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-50 border-t border-gray-200">
//                                   Or Enter Custom Name
//                                 </div>
//                                 <div
//                                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium"
//                                   onClick={() => {
//                                     setFormData(prev => ({
//                                       ...prev,
//                                       officeRecipient: employeeSearchTerm,
//                                       personType: '',
//                                       personId: ''
//                                     }));
//                                     setShowEmployeeDropdown(false);
//                                   }}
//                                 >
//                                   Use "{employeeSearchTerm}" as custom name
//                                 </div>
//                               </>
//                             ) : (
//                               <div className="px-4 py-2 text-gray-500">
//                                 No employees found
//                                 <div
//                                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium mt-2"
//                                   onClick={() => {
//                                     setFormData(prev => ({
//                                       ...prev,
//                                       officeRecipient: employeeSearchTerm,
//                                       personType: '',
//                                       personId: ''
//                                     }));
//                                     setShowEmployeeDropdown(false);
//                                   }}
//                                 >
//                                   Use "{employeeSearchTerm}" as custom name
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )
//                   ) : (
//                     <input
//                       type="text"
//                       name="officeRecipient"
//                       value={formData.officeRecipient}
//                       onChange={handleInputChange}
//                       placeholder="Enter name"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-normal text-gray-700 mb-2">Amount</label>
//                   <input
//                     type="number"
//                     name="officeAmount"
//                     value={formData.officeAmount}
//                     onChange={handleInputChange}
//                     step="0.01"
//                     placeholder="0.00"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-normal text-gray-700 mb-2">Remarks</label>
//                 <textarea
//                   name="officeRemarks"
//                   value={formData.officeRemarks}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                 />
//               </div>
//               <div className="text-lg font-bold text-red-700">
//                 Total: ₹ {total.toFixed(2)}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Bank Charges Section */}
//         {category === "bank" && (
//           <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//             <h3 className="text-lg font-bold mb-6 text-black">Bank Charges</h3>
//             <div className="space-y-6">
//               <div className="grid grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-normal text-gray-700 mb-2">Bank Name</label>
//                   <input
//                     type="text"
//                     name="bankName"
//                     value={formData.bankName}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-normal text-gray-700 mb-2">Transaction Reference No.</label>
//                   <input
//                     type="text"
//                     name="bankTxnRef"
//                     value={formData.bankTxnRef}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-normal text-gray-700 mb-2">Amount</label>
//                   <input
//                     type="number"
//                     name="bankAmount"
//                     value={formData.bankAmount}
//                     onChange={handleInputChange}
//                     step="0.01"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-normal text-gray-700 mb-2">Remarks</label>
//                 <textarea
//                   name="bankRemarks"
//                   value={formData.bankRemarks}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                 />
//               </div>
//               <div className="text-lg font-bold text-red-700">
//                 Total: ₹ {total.toFixed(2)}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Advocate / Expert Section */}
//         {(category === "advocate" || category === "expert") && (
//           <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//             <h3 className="text-lg font-bold mb-6 text-black">
//               {category === "advocate" ? "Advocate" : "Expert"} Payment
//             </h3>
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-normal text-gray-700 mb-2">
//                   {category === "advocate" ? "Advocate" : "Expert"} Name
//                 </label>
//                 {loading && (category === "advocate" || category === "expert") ? (
//                   <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100">
//                     Loading...
//                   </div>
//                 ) : (
//                   <select
//                     name={category === "advocate" ? "advocateName" : "expertName"}
//                     value={formData[category === "advocate" ? "advocateName" : "expertName"]}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                   >
//                     <option value="">Select {category === "advocate" ? "Advocate" : "Expert"}</option>
//                     {category === "advocate" && advocates.map((advocate) => (
//                       <option key={advocate._id} value={advocate.fullName}>
//                         {advocate.fullName} ({advocate.barCouncilNumber}) - {advocate.specialization?.join(', ') || 'N/A'}
//                       </option>
//                     ))}
//                     {category === "expert" && experts.map((expert) => (
//                       <option key={expert._id} value={expert.fullName}>
//                         {expert.fullName} - {expert.expertise?.join(', ') || 'N/A'}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>

//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <label className="block text-sm font-bold text-gray-700">Cases</label>
//                 </div>

//                 {caseRows.map((row, index) => (
//                   <div key={index} className="grid grid-cols-3 gap-4">
//                     {loadingDoctors ? (
//                       <select
//                         disabled
//                         className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-500"
//                       >
//                         <option>Loading doctors...</option>
//                       </select>
//                     ) : (
//                       <select
//                         value={row.doctorId || row.doctor} // Use doctorId if available, otherwise use doctor name for backward compatibility
//                         onChange={(e) => {
//                           // Find the selected doctor to get their details
//                           let selectedDoctor;
//                           if (category === 'advocate') {
//                             selectedDoctor = doctorsForAdvocate.find(doc => doc._id === e.target.value);
//                           } else if (category === 'expert') {
//                             selectedDoctor = doctorsForExpert.find(doc => doc._id === e.target.value);
//                           }

//                           // Set both doctor name and ID
//                           handleCaseRowChange(index, "doctor", selectedDoctor ? selectedDoctor.fullName : "");
//                           handleCaseRowChange(index, "doctorId", selectedDoctor ? selectedDoctor._id : "");

//                           // Auto-fill case stage based on selected doctor
//                           if (selectedDoctor) {
//                             try {
//                               // Find the case for the selected doctor from the stored cases
//                               let doctorCase;
//                               if (category === 'advocate') {
//                                 doctorCase = advocateCases.find(
//                                   item => (item.doctorId === selectedDoctor._id) ||
//                                     (item.doctorName === selectedDoctor.fullName) ||
//                                     (item.patientName === selectedDoctor.fullName)
//                                 );
//                               } else if (category === 'expert') {
//                                 doctorCase = expertCases.find(
//                                   item => (item.doctorId === selectedDoctor._id) ||
//                                     (item.doctorName === selectedDoctor.fullName) ||
//                                     (item.patientName === selectedDoctor.fullName)
//                                 );
//                               }

//                               if (doctorCase) {
//                                 // Auto-fill the case stage with the caseType or caseStage from the response
//                                 handleCaseRowChange(index, "caseStage", doctorCase.caseType || doctorCase.caseStage || "");
//                               } else {
//                                 // If no specific case found for this doctor, clear the case stage
//                                 handleCaseRowChange(index, "caseStage", "");
//                               }
//                             } catch (error) {
//                               console.error("Error finding case details for doctor:", error);
//                               // On error, clear the case stage
//                               handleCaseRowChange(index, "caseStage", "");
//                             }
//                           } else {
//                             // If no doctor is selected, clear the case stage
//                             handleCaseRowChange(index, "caseStage", "");
//                           }
//                         }}
//                         className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                       >
//                         <option value="">Select Doctor</option>
//                         {category === 'advocate' && doctorsForAdvocate.map((doctor) => (
//                           <option key={doctor._id} value={doctor._id}>
//                             {doctor.fullName}
//                           </option>
//                         ))}
//                         {category === 'expert' && doctorsForExpert.map((doctor) => (
//                           <option key={doctor._id} value={doctor._id}>
//                             {doctor.fullName}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                     <input
//                       type="text"
//                       placeholder="Case Stage"
//                       value={row.caseStage}
//                       onChange={(e) => handleCaseRowChange(index, "caseStage", e.target.value)}
//                       required
//                       className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="number"
//                         placeholder="Amount"
//                         value={row.amount}
//                         onChange={(e) => handleCaseRowChange(index, "amount", e.target.value)}
//                         required
//                         step="0.01"
//                         className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
//                       />
//                       {index > 0 && ( // Show delete button only for additional rows (not the first one)
//                         <button
//                           type="button"
//                           onClick={() => {
//                             const updatedRows = [...caseRows];
//                             updatedRows.splice(index, 1);
//                             setCaseRows(updatedRows);
//                           }}
//                           className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
//                         >
//                           Delete
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={addCaseRow}
//                   className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
//                 >
//                   + Add More Cases
//                 </button>
//               </div>

//               <div className="text-lg font-bold text-red-700">
//                 Total: ₹ {total.toFixed(2)}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Tax Settings */}
//         <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg font-bold mb-6 text-black">Tax Settings</h3>
//           <div className="grid grid-cols-2 gap-6">
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="taxApplicable"
//                 name="taxApplicable"
//                 checked={formData.taxApplicable}
//                 onChange={handleInputChange}
//                 className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//               />
//               <label htmlFor="taxApplicable" className="ml-3 block text-sm font-medium text-gray-700">
//                 Apply Tax
//               </label>
//             </div>

//             {formData.taxApplicable && (
//               <div>
//                 <label className="block text-sm font-normal text-gray-700 mb-2">
//                   Tax Rate (%)
//                 </label>
//                 <input
//                   type="number"
//                   name="taxRate"
//                   value={formData.taxRate}
//                   onChange={handleInputChange}
//                   min="0"
//                   max="100"
//                   step="0.01"
//                   placeholder="Enter tax rate"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Notes & Attachment */}
//         <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg font-bold mb-6 text-black">Notes & Attachment</h3>
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-normal text-gray-700 mb-2">
//                 Notes / Additional Info
//               </label>
//               <textarea
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleInputChange}
//                 rows="4"
//                 placeholder="Add any extra details"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-normal text-gray-700 mb-2">
//                 Upload Attachment
//               </label>
//               <input
//                 type="file"
//                 name="attachment"
//                 onChange={handleInputChange}
//                 accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
//               />
//               {formData.attachment && (
//                 <div className="mt-2">
//                   {formData.attachment.exists ? (
//                     <div>
//                       <p className="text-sm text-green-600">Existing file: {formData.attachment.name}</p>
//                       <a
//                         href={formData.attachment.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:text-blue-800 underline text-sm inline-block mt-1"
//                       >
//                         View/Download Existing File
//                       </a>
//                       <p className="text-xs text-gray-500 mt-1">Upload a new file to replace the existing one</p>
//                     </div>
//                   ) : (
//                     <p className="text-sm text-green-600">Selected: {formData.attachment.name}</p>
//                   )}
//                 </div>
//               )}
//               <p className="text-xs text-gray-500 mt-2">Max 10MB (PDF, images, docs)</p>
//             </div>
//           </div>
//         </div>

//         {/* Submit Buttons */}
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex justify-between items-center">
//             <div className="text-xl font-bold text-black">
//               Base Amount: <span className="text-red-700 ml-4">₹ {total.toFixed(2)}</span>
//               {formData.taxApplicable && (
//                 <div className="block">
//                   <div className="text-lg font-bold text-black">
//                     Final Amount: <span className="text-red-700">₹ {(total + (total * formData.taxRate) / 100).toFixed(2)}</span>
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     (includes {formData.taxRate}% tax: ₹ {(total * formData.taxRate / 100).toFixed(2)})
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="flex gap-4">
//               <button
//                 type="submit"
//                 className="bg-green-600 text-white px-10 py-3 rounded-lg hover:bg-green-700 font-medium text-lg"
//               >
//                 Save Entry
//               </button>
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="bg-yellow-500 text-white px-10 py-3 rounded-lg hover:bg-yellow-600 font-medium text-lg"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ExpenseForm;








import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from 'react-select';
import apiClient, { apiEndpoints } from "../../../services/apiClient";

// Simple debounce utility
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const ExpenseForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expenseId = searchParams.get("id");
  const isEditMode = !!expenseId;

  // Helper functions for date formatting
  const formatDateToDDMMYY = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
    return `${day}-${month}-${year}`;
  };

  const formatDateToISO = (dateString) => {
    if (!dateString) return '';
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) return '';
    const [day, month, yearStr] = dateParts;
    if (day.length !== 2 || month.length !== 2 || yearStr.length !== 2) return '';
    const year = `20${yearStr}`; // Assuming 21st century
    return `${year}-${month}-${day}`;
  };

  const [category, setCategory] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [caseRows, setCaseRows] = useState([
    { doctor: "", caseStage: "", amount: "" }
  ]);
  const [total, setTotal] = useState(0);
  const [advocateCases, setAdvocateCases] = useState([]);
  const [expertCases, setExpertCases] = useState([]);
  const [doctorsForAdvocate, setDoctorsForAdvocate] = useState([]);
  const [doctorsForExpert, setDoctorsForExpert] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCases, setLoadingCases] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);
  const [loadingBankDetails, setLoadingBankDetails] = useState(false);

  // Search and Page states for dropdowns
  const [advocateOptions, setAdvocateOptions] = useState([]);
  const [loadingAdvocates, setLoadingAdvocates] = useState(false);
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);

  const [expertOptions, setExpertOptions] = useState([]);
  const [loadingExperts, setLoadingExperts] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

  const [employeeOptions, setEmployeeOptions] = useState([]);
  // loadingEmployees already exists
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [doctorOptions, setDoctorOptions] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const advocateSearchRef = useRef(null);
  const expertSearchRef = useRef(null);
  const employeeSearchRef = useRef(null);
  const doctorSearchRef = useRef(null);

  // Utility function to convert file path to accessible URL
  const convertFilePathToUrl = (filePath) => {
    if (!filePath) return null;

    // If it's already a URL, return as is
    if (filePath.startsWith('http')) {
      return filePath;
    }

    // If it starts with /uploads, it's already a relative path
    if (filePath.startsWith('/uploads')) {
      const baseURL = apiClient.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:3000';
      return `${baseURL}${filePath}`;
    }

    // If it's an absolute path (Windows or Unix), extract the uploads portion
    if (filePath.includes('uploads')) {
      const uploadsIndex = filePath.lastIndexOf('uploads');
      if (uploadsIndex !== -1) {
        const relativePath = filePath.substring(uploadsIndex).replace(/\\/g, '/');
        const baseURL = apiClient.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:3000';
        return `${baseURL}/${relativePath}`;
      }
    }

    // Default: assume it's a relative path from uploads
    const baseURL = apiClient.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:3000';
    return `${baseURL}/uploads/${filePath}`;
  };

  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split('T')[0], // Set to today's date in ISO format
    paymentDateFormatted: formatDateToDDMMYY(new Date().toISOString().split('T')[0]), // Set to today's date in DD-MM-YY format
    voucherNo: "",
    paidBy: "",
    officeExpenseType: "Stationery",
    officeRecipient: "",
    officeAmount: "",
    officeRemarks: "",
    bankName: "",
    bankTxnRef: "",
    bankAmount: "",
    bankRemarks: "",
    advocateName: "",
    expertName: "",
    notes: "",
    attachment: null,
    taxApplicable: true, // Default to true for backward compatibility
    taxRate: 18, // Default to 18% for backward compatibility,
    personType: "", // Added for tracking person type
    personId: "", // Added for tracking person ID
    chequeNumber: "", // Added for cheque payments
    chequeDate: "", // Added for cheque payments
  });

  // Debounced search for Advocates
  const fetchAdvocates = useCallback(
    debounce(async (searchQuery) => {
      setLoadingAdvocates(true);
      try {
        const response = await apiClient.get(apiEndpoints.advocates.dropdown, {
          params: { search: searchQuery }
        });
        if (response.data.success) {
          const options = response.data.data.map((advocate) => ({
            value: advocate.fullName,
            label: `${advocate.fullName} (${advocate.barCouncilNumber || "—"}) - ${advocate.specialization?.join(", ") || "N/A"}`,
            _id: advocate._id,
          }));
          setAdvocateOptions(options);
        }
      } catch (error) {
        console.error("Error fetching advocates:", error);
      } finally {
        setLoadingAdvocates(false);
      }
    }, 500),
    []
  );

  // Debounced search for Experts
  const fetchExperts = useCallback(
    debounce(async (searchQuery) => {
      setLoadingExperts(true);
      try {
        const response = await apiClient.get(apiEndpoints.experts.dropdown, {
          params: { search: searchQuery }
        });
        if (response.data.success) {
          const options = response.data.data.map((expert) => ({
            value: expert.fullName,
            label: `${expert.fullName} - ${expert.expertise?.join(", ") || "N/A"}`,
            _id: expert._id,
          }));
          setExpertOptions(options);
        }
      } catch (error) {
        console.error("Error fetching experts:", error);
      } finally {
        setLoadingExperts(false);
      }
    }, 500),
    []
  );

  // Debounced search for Employees
  const fetchEmployees = useCallback(
    debounce(async (searchQuery) => {
      setLoadingEmployees(true);
      try {
        const response = await apiClient.get(apiEndpoints.employees.search, {
          params: { q: searchQuery }
        });
        if (response.data.success) {
          const options = response.data.data.map((employee) => ({
            value: employee.fullName,
            label: `${employee.fullName} (${employee.employeeId})`,
            _id: employee._id,
          }));
          setEmployeeOptions(options);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoadingEmployees(false);
      }
    }, 500),
    []
  );

  // Debounced search for Doctors
  const fetchDoctors = useCallback(
    debounce(async (searchQuery) => {
      setLoadingDoctors(true);
      try {
        // Here we can use the general doctor search
        const response = await apiClient.get(apiEndpoints.doctors.dropdown, {
          params: { search: searchQuery }
        });
        if (response.data.success) {
          const options = response.data.data.map((doctor) => ({
            value: doctor.fullName,
            label: doctor.fullName,
            _id: doctor._id,
          }));
          setDoctorOptions(options);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoadingDoctors(false);
      }
    }, 500),
    []
  );

  // Trigger initial search for advocates/experts when category changes
  useEffect(() => {
    if (category === "advocate") {
      fetchAdvocates("");
    } else if (category === "expert") {
      fetchExperts("");
    } else {
      setAdvocateOptions([]);
      setExpertOptions([]);
    }
  }, [category, fetchAdvocates, fetchExperts]);

  // Fetch doctors for the selected advocate or expert
  const fetchDoctorsForAdvocate = useCallback(async (advocateId) => {
    setLoadingDoctors(true);
    try {
      const response = await apiClient.get(apiEndpoints.expenses.cases.advocate(advocateId));
      if (response.data.success) {
        setAdvocateCases(response.data.data || []);
        const uniqueDoctorsMap = new Map();
        response.data.data.forEach(caseItem => {
          const doctorKey = caseItem.doctorId || caseItem.doctorName || caseItem.patientName;
          if (doctorKey && !uniqueDoctorsMap.has(doctorKey)) {
            uniqueDoctorsMap.set(doctorKey, {
              _id: caseItem.doctorId || `temp_${doctorKey}`,
              fullName: caseItem.doctorName || caseItem.patientName || doctorKey
            });
          }
        });
        setDoctorsForAdvocate(Array.from(uniqueDoctorsMap.values()));
      }
    } catch (error) {
      console.error("Error fetching doctors for advocate:", error);
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  const fetchDoctorsForExpert = useCallback(async (expertId) => {
    setLoadingDoctors(true);
    try {
      const response = await apiClient.get(apiEndpoints.expenses.cases.expert(expertId));
      if (response.data.success) {
        setExpertCases(response.data.data || []);
        const uniqueDoctorsMap = new Map();
        response.data.data.forEach(caseItem => {
          const doctorKey = caseItem.doctorId || caseItem.doctorName || caseItem.patientName;
          if (doctorKey && !uniqueDoctorsMap.has(doctorKey)) {
            uniqueDoctorsMap.set(doctorKey, {
              _id: caseItem.doctorId || `temp_${doctorKey}`,
              fullName: caseItem.doctorName || caseItem.patientName || doctorKey
            });
          }
        });
        setDoctorsForExpert(Array.from(uniqueDoctorsMap.values()));
      }
    } catch (error) {
      console.error("Error fetching doctors for expert:", error);
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  // Placeholder to remove duplicate logic.

  // Load existing expense data for edit mode
  useEffect(() => {
    const loadExpenseData = async () => {
      if (isEditMode && expenseId) {
        try {
          setLoading(true);
          const response = await apiClient.get(apiEndpoints.expenses.get(expenseId));
          const expense = response.data.data;

          const formattedDate = expense.expenseDate ? formatDateToDDMMYY(expense.expenseDate) : "";
          const officeExpenseType = expense.subCategory || "Stationery";
          let paidByValue = expense.vendor?.name || expense.paidBy || "";
          if (!paidByValue && expense.bankName) {
            paidByValue = expense.bankName;
          }

          let initialCategory = "";
          if (expense.category === 'professional_fees') {
            if (expense.relatedPerson?.type === 'expert') {
              initialCategory = 'expert';
            } else if (expense.relatedPerson?.type === 'advocate') {
              initialCategory = 'advocate';
            } else {
              initialCategory = expense.subCategory === 'expert' ? 'expert' : 'advocate';
            }
          } else if (expense.category === 'office_supplies' || expense.category === 'office') {
            initialCategory = 'office';
          } else if (expense.category === 'utilities' || expense.category === 'bank_transfer' || expense.category === 'bank') {
            initialCategory = 'bank';
          }

          setCategory(initialCategory);

          const newFormData = {
            paymentDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().split('T')[0] : "",
            paymentDateFormatted: formattedDate,
            voucherNo: expense.voucherNo || "",
            paidBy: paidByValue,
            officeExpenseType: officeExpenseType,
            officeRecipient: expense.vendor?.name || "",
            officeAmount: expense.amount?.toString() || "",
            officeRemarks: expense.remarks || "",
            bankName: expense.bankName || "",
            bankTxnRef: expense.voucherNo || "",
            bankAmount: expense.amount?.toString() || "",
            bankRemarks: expense.remarks || "",
            advocateName: initialCategory === 'advocate' ? (expense.vendor?.name || "") : "",
            expertName: initialCategory === 'expert' ? (expense.vendor?.name || "") : "",
            notes: expense.note || expense.remarks || "",
            attachment: expense.attachment ? {
              name: expense.attachment.split('/').pop(),
              url: convertFilePathToUrl(expense.attachment),
              exists: true
            } : null,
            taxApplicable: expense.taxApplicable !== undefined ? expense.taxApplicable : true,
            taxRate: expense.taxRate !== undefined ? expense.taxRate : 18,
            personType: expense.relatedPerson?.type || "",
            personId: expense.relatedPerson?.refId || "",
            chequeNumber: expense.chequeNumber || "",
            chequeDate: expense.chequeDate ? formatDateToDDMMYY(new Date(expense.chequeDate)) : "",
            chequeDateISO: expense.chequeDate ? new Date(expense.chequeDate).toISOString().split('T')[0] : "",
          };

          setFormData(newFormData);

          // Initialize selected objects for dropdowns with fallback to vendor name
          const vendorName = expense.vendor?.name || "";

          if (initialCategory === 'advocate') {
            const advocateObj = {
              value: vendorName,
              label: vendorName,
              _id: expense.relatedPerson?.refId || ""
            };
            setSelectedAdvocate(advocateObj);
            setAdvocateOptions([advocateObj]);
            if (expense.relatedPerson?.refId) {
              await fetchDoctorsForAdvocate(expense.relatedPerson.refId);
            }
          } else if (initialCategory === 'expert') {
            const expertObj = {
              value: vendorName,
              label: vendorName,
              _id: expense.relatedPerson?.refId || ""
            };
            setSelectedExpert(expertObj);
            setExpertOptions([expertObj]);
            if (expense.relatedPerson?.refId) {
              await fetchDoctorsForExpert(expense.relatedPerson.refId);
            }
          } else if (initialCategory === 'office') {
            const isEmployeeType = [
              "Employee Salary",
              "Travelling Allowance",
              "Advance",
              "Incentive",
              "Other"
            ].includes(officeExpenseType);

            if (isEmployeeType && vendorName) {
              const employeeObj = {
                value: vendorName,
                label: vendorName,
                _id: expense.relatedPerson?.refId || ""
              };
              setSelectedEmployee(employeeObj);
              setEmployeeOptions([employeeObj]);

              if (expense.relatedPerson?.refId && expense.relatedPerson?.type === 'employee') {
                // Fetch employee data to populate more details
                try {
                  const employeeResponse = await apiClient.get(apiEndpoints.employees.get(expense.relatedPerson.refId));
                  if (employeeResponse.data && employeeResponse.data.success) {
                    const employee = employeeResponse.data.data;
                    const fullEmployeeObj = {
                      value: employee.fullName,
                      label: `${employee.fullName} (${employee.employeeId})`,
                      _id: employee._id
                    };
                    setEmployeeOptions([fullEmployeeObj]);
                    setSelectedEmployee(fullEmployeeObj);
                  }
                } catch (error) {
                  console.error("Error fetching full employee for edit mode:", error);
                }
              }
            }
          }

          if ((initialCategory === 'advocate' || initialCategory === 'expert') && expense.caseRows) {
            setCaseRows(expense.caseRows.map(row => ({
              doctor: row.doctor || "",
              doctorId: row.doctorId || "",
              caseStage: row.caseStage || "",
              amount: row.amount?.toString() || "",
              fromAddButton: false,
              caseId: row.caseId || undefined
            })));
          } else if ((initialCategory === 'advocate' || initialCategory === 'expert')) {
            setCaseRows([{ doctor: "", caseStage: "", amount: "", fromAddButton: false }]);
          }

          if (expense.paymentMethod) {
            const paymentModeMap = {
              'cash': 'Cash',
              'neft/rtgs': 'NEFT/RTGS',
              'cheque': 'Cheque',
              'upi': 'UPI',
              'bank_transfer': 'Bank Transfer',
            };
            setPaymentMode(paymentModeMap[expense.paymentMethod] || expense.paymentMethod);
          }
        } catch (error) {
          console.error("Error loading expense data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadExpenseData();
  }, [isEditMode, expenseId, fetchDoctorsForAdvocate, fetchDoctorsForExpert]);

  // Calculate total
  useEffect(() => {
    let newTotal = 0;
    if (category === "office") {
      newTotal = parseFloat(formData.officeAmount) || 0;
    } else if (category === "bank") {
      newTotal = parseFloat(formData.bankAmount) || 0;
    } else if (category === "advocate" || category === "expert") {
      newTotal = caseRows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
    }
    setTotal(newTotal);
  }, [category, formData.officeAmount, formData.bankAmount, caseRows]);

  // Fetch bank details
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        setLoadingBankDetails(true);
        const response = await apiClient.get(apiEndpoints.recBankDetails.list);
        if (response.data.success) {
          setBankDetails(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching bank details:', error);
      } finally {
        setLoadingBankDetails(false);
      }
    };
    fetchBankDetails();
  }, []);

  const handleInputChange = async (e) => {
    const { name, value, files, type, checked } = e.target;

    if ((name === "advocateName" || name === "expertName") && (category === "advocate" || category === "expert")) {
      const selectedOption = e.target.selectedOption;
      setFormData(prev => ({
        ...prev,
        [name]: value,
        [category === "advocate" ? "expertName" : "advocateName"]: "",
        personType: category,
        personId: selectedOption ? selectedOption._id : ""
      }));

      if (selectedOption && selectedOption._id) {
        setLoadingCases(true);
        try {
          if (category === "advocate") {
            await fetchDoctorsForAdvocate(selectedOption._id);
          } else {
            await fetchDoctorsForExpert(selectedOption._id);
          }
          setCaseRows([{ doctor: "", caseStage: "", amount: "", fromAddButton: false }]);
        } catch (error) {
          console.error("Error fetching doctors:", error);
        } finally {
          setLoadingCases(false);
        }
      } else {
        if (category === "advocate") setDoctorsForAdvocate([]);
        else setDoctorsForExpert([]);
        setCaseRows([{ doctor: "", caseStage: "", amount: "", fromAddButton: false }]);
      }
    } else if (name === "taxApplicable") {
      setFormData(prev => ({ ...prev, taxApplicable: type === 'checkbox' ? checked : value }));
    } else if (name === "paymentDateFormatted") {
      setFormData(prev => ({ ...prev, paymentDateFormatted: value, paymentDate: value ? formatDateToISO(value) : "" }));
    } else if (name === "chequeDate") {
      setFormData(prev => ({
        ...prev,
        chequeDate: value ? formatDateToDDMMYY(new Date(value)) : "",
        chequeDateISO: value
      }));
    } else if (name === "officeExpenseType") {
      setFormData(prev => ({ ...prev, [name]: value, personType: "", personId: "" }));
    } else if (name === "paymentMode") {
      setPaymentMode(value);
      if (value === "Cash") setFormData(prev => ({ ...prev, paidBy: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
    }
  };


  const handleCaseRowChange = (index, field, value) => {
    const updated = [...caseRows];
    updated[index][field] = value;
    setCaseRows(updated);
  };

  // Placeholder to remove duplicate logic. The actual logic was moved above handleInputChange.


  const addCaseRow = async () => {
    if (category === "advocate" || category === "expert") {
      // For advocate/expert categories, add a case row with the first available doctor from the appropriate list
      let firstAvailableDoctor = "";
      let firstAvailableDoctorId = "";

      if (category === "advocate" && doctorsForAdvocate.length > 0) {
        firstAvailableDoctor = doctorsForAdvocate[0].fullName;
        firstAvailableDoctorId = doctorsForAdvocate[0]._id;
      } else if (category === "expert" && doctorsForExpert.length > 0) {
        firstAvailableDoctor = doctorsForExpert[0].fullName;
        firstAvailableDoctorId = doctorsForExpert[0]._id;
      }

      // Add a case row with the first available doctor and mark it as added via the add button
      setCaseRows([...caseRows, {
        doctor: firstAvailableDoctor,
        caseStage: "",
        amount: "",
        doctorId: firstAvailableDoctorId,
        fromAddButton: true  // Mark this row as being added via the "Add Case" button
      }]);
    } else {
      // For other categories, add an empty row
      setCaseRows([...caseRows, { doctor: "", caseStage: "", amount: "" }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare form data for API submission
      const expenseData = new FormData();

      // Basic expense data
      let expenseTitle = '';
      if (category === 'advocate') {
        expenseTitle = 'Advocate Payment' || 'Unknown';
      } else if (category === 'expert') {
        expenseTitle = 'Expert Payment' || 'Unknown';
      } else if (category === 'office') {
        if (formData.officeExpenseType === 'Employee Salary') {
          expenseTitle = 'Salary Payment' || 'Unknown';
        } else {
          expenseTitle = `${formData.officeExpenseType || 'Office'} Expense`;
        }
      } else if (category === 'bank') {
        expenseTitle = 'Bank Charges' || 'Unknown';
      } else {
        expenseTitle = 'Professional Payment';
      }

      expenseData.append('expenseTitle', expenseTitle);
      expenseData.append('description', formData.notes || '');
      // Map frontend category values to backend valid enum values
      let backendCategory = category;
      if (category === 'office') {
        backendCategory = 'office_supplies';
      } else if (category === 'bank') {
        backendCategory = 'utilities'; // or another appropriate category
      } else if (category === 'advocate' || category === 'expert') {
        backendCategory = 'professional_fees';
      }

      expenseData.append('category', backendCategory);
      expenseData.append('subCategory', formData.officeExpenseType || category); // Use office expense type if available
      // Calculate amount based on category
      let finalAmount = total.toString();
      if (category === 'office') {
        finalAmount = formData.officeAmount;
      } else if (category === 'bank') {
        finalAmount = formData.bankAmount;
      }

      // Calculate final amount based on tax applicability
      let calculatedAmount = parseFloat(finalAmount) || 0;
      if (formData.taxApplicable) {
        // If tax is applicable, the amount should be the base amount (before tax)
        // The tax-inclusive amount would be calculated separately if needed
        expenseData.append('amount', calculatedAmount.toString());
      } else {
        // If tax is not applicable, just use the calculated amount
        expenseData.append('amount', calculatedAmount.toString());
      }
      expenseData.append('expenseDate', formData.paymentDate);
      expenseData.append('paymentMethod', paymentMode.toLowerCase().replace(' ', '_'));
      expenseData.append('voucherNo', formData.voucherNo);

      // Handle bankName - if paidBy contains a bank name, use that regardless of category
      let finalBankName = formData.bankName;
      if (formData.paidBy) {
        const selectedBank = bankDetails.find(bank => bank.bankName === formData.paidBy);
        if (selectedBank) {
          finalBankName = formData.paidBy;
          // Add the bank ID as paidFrom
          expenseData.append('paidFrom', selectedBank._id);
        }
      }
      // For Cash payments, don't set bankName
      if (paymentMode !== "Cash") {
        expenseData.append('bankName', finalBankName || '');
      }

      // Add cheque details if payment mode is Cheque
      if (paymentMode === 'Cheque') {
        expenseData.append('chequeNumber', formData.chequeNumber || '');
        expenseData.append('chequeDate', formData.chequeDateISO || ''); // Use ISO format for backend
      }

      expenseData.append('remarks', formData.notes);
      expenseData.append('note', formData.notes);

      // Add tax information
      expenseData.append('taxApplicable', formData.taxApplicable);
      if (formData.taxApplicable) {
        expenseData.append('taxRate', formData.taxRate.toString());
      }

      // Vendor information - use selected advocate/expert name or office recipient
      const vendorName = category === 'advocate' ? formData.advocateName :
        category === 'expert' ? formData.expertName :
          formData.officeRecipient || formData.paidBy;
      if (vendorName) {
        expenseData.append('vendor', JSON.stringify({ name: vendorName }));
      }

      // Add related person reference for tracking expenses per individual
      if (category === 'advocate' && formData.advocateName) {
        expenseData.append('personType', 'advocate');
        expenseData.append('personId', formData.personId || '');
        expenseData.append('personName', formData.advocateName);
      } else if (category === 'expert' && formData.expertName) {
        expenseData.append('personType', 'expert');
        expenseData.append('personId', formData.personId || '');
        expenseData.append('personName', formData.expertName);
      } else if (category === 'office' && (
        formData.officeExpenseType === 'Employee Salary' ||
        formData.officeExpenseType === 'Travelling Allowance' ||
        formData.officeExpenseType === 'Advance' ||
        formData.officeExpenseType === 'Incentive' ||
        formData.officeExpenseType === 'Other'
      ) && (formData.officeRecipient || formData.personId)) {
        expenseData.append('personType', 'employee');
        expenseData.append('personId', formData.personId || '');
        expenseData.append('personName', formData.officeRecipient);
      } else if (formData.personType && formData.personId) {
        // Use stored personType and personId if available (for office expenses where employee was selected)
        expenseData.append('personType', formData.personType);
        expenseData.append('personId', formData.personId);
        expenseData.append('personName', formData.officeRecipient || formData.paidBy || formData.advocateName || formData.expertName);
      }

      // Add case rows data for advocate/expert expenses
      if ((category === 'advocate' || category === 'expert') && caseRows.length > 0) {
        // Convert case rows to JSON string for backend
        const caseRowsData = caseRows.map(row => ({
          doctor: row.doctor,
          doctorId: row.doctorId,
          caseStage: row.caseStage,
          amount: parseFloat(row.amount) || 0
        }));
        expenseData.append('caseRows', JSON.stringify(caseRowsData));
      }

      // Add file if provided
      if (formData.attachment && formData.attachment instanceof File) {
        expenseData.append('attachment', formData.attachment);
      }

      // Submit to API
      let response;
      if (isEditMode && expenseId) {
        // Update existing expense
        response = await apiClient.put(apiEndpoints.expenses.update(expenseId), expenseData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new expense
        response = await apiClient.post(apiEndpoints.expenses.create, expenseData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data.success) {
        alert(isEditMode ? "Expense updated successfully!" : "Expense created successfully!");
        navigate("/admin/expense-list");
      } else {
        alert(response.data.message || "Failed to save expense");
      }
    } catch (error) {
      console.error("Error submitting expense:", error);
      alert("Error saving expense: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure? Unsaved changes will be lost.")) {
      navigate("/admin/expense-list");
    }
  };

  return (
    <div className="mx-auto p-8 min-h-screen max-w-[79vw]">
      <h1 className="text-2xl mb-6 font-bold text-gray-800">
        {isEditMode ? "Edit Payment Entry" : "Payment Entry Form"}
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Payment Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-6 text-black">Payment Details</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Date of Payment <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Payment ID / Voucher No. <span className="text-red-500"></span>
                </label>
                <input
                  type="text"
                  name="voucherNo"
                  value={formData.voucherNo}
                  onChange={handleInputChange}

                  placeholder="e.g., VCH-001"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Payment Mode
                </label>
                <select
                  name="paymentMode"
                  value={paymentMode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Conditionally show Paid By field based on payment mode */}
              {paymentMode !== "Cash" && (
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    Paid By <span className="text-red-500">*</span>
                  </label>
                  {loadingBankDetails ? (
                    <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100">
                      Loading bank details...
                    </div>
                  ) : (
                    <select
                      name="paidBy"
                      value={formData.paidBy}
                      onChange={handleInputChange}
                      required={paymentMode !== "Cash"}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                      }}
                    >
                      <option value="">-- Select Bank --</option>
                      {bankDetails.map((bank) => (
                        <option key={bank._id} value={bank.bankName}>
                          {bank.bankName} - {bank.accountNumber}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Payment Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">-- Select --</option>
                  <option value="office">Office Expenses</option>
                  <option value="bank">Bank Charges</option>
                  <option value="advocate">Advocate Payment</option>
                  <option value="expert">Expert Payment</option>
                </select>
              </div>
            </div>

            {/* Conditional fields for Cheque payments */}
            {paymentMode === "Cheque" && (
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    Cheque Number
                  </label>
                  <input
                    type="text"
                    name="chequeNumber"
                    value={formData.chequeNumber}
                    onChange={handleInputChange}
                    placeholder="Enter cheque number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    Cheque Date
                  </label>
                  <input
                    type="date"
                    name="chequeDate"
                    value={formData.chequeDateISO || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Office Expenses Section */}
        {category === "office" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold mb-6 text-black">Office Expenses</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Expense Type</label>
                  <select
                    name="officeExpenseType"
                    value={formData.officeExpenseType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option>Stationery</option>
                    <option>Employee Salary</option>
                    <option>Advance</option>
                    <option>Travelling Allowance</option>
                    <option>Incentive</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Employee / Recipient Name</label>
                  {(formData.officeExpenseType === "Employee Salary" ||
                    formData.officeExpenseType === "Travelling Allowance" ||
                    formData.officeExpenseType === "Advance" ||
                    formData.officeExpenseType === "Incentive" ||
                    formData.officeExpenseType === "Other") ? (
                    <Select
                      name="officeRecipient"
                      value={selectedEmployee}
                      onInputChange={(inputValue) => {
                        fetchEmployees(inputValue);
                      }}
                      onChange={(selectedOption) => {
                        setSelectedEmployee(selectedOption);
                        setFormData(prev => ({
                          ...prev,
                          officeRecipient: selectedOption ? selectedOption.value : "",
                          personType: selectedOption ? 'employee' : '',
                          personId: selectedOption ? selectedOption._id : ''
                        }));
                      }}
                      options={employeeOptions}
                      isLoading={loadingEmployees}
                      placeholder="Search employee..."
                      isSearchable={true}
                      isClearable={true}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: '#d1d5db',
                          borderRadius: '0.5rem',
                          padding: '0.125rem 0.25rem',
                          boxShadow: 'none',
                          '&:hover': { borderColor: '#9ca3af' },
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: '0.375rem 0.75rem',
                        }),
                        input: (base) => ({
                          ...base,
                          padding: 0,
                          margin: 0,
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: '#9ca3af',
                        }),
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      name="officeRecipient"
                      value={formData.officeRecipient}
                      onChange={handleInputChange}
                      placeholder="Enter name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    name="officeAmount"
                    value={formData.officeAmount}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Remarks</label>
                <textarea
                  name="officeRemarks"
                  value={formData.officeRemarks}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="text-lg font-bold text-red-700">
                Total: ₹ {total.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Bank Charges Section */}
        {category === "bank" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold mb-6 text-black">Bank Charges</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Transaction Reference No.</label>
                  <input
                    type="text"
                    name="bankTxnRef"
                    value={formData.bankTxnRef}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    name="bankAmount"
                    value={formData.bankAmount}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">Remarks</label>
                <textarea
                  name="bankRemarks"
                  value={formData.bankRemarks}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="text-lg font-bold text-red-700">
                Total: ₹ {total.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Advocate / Expert Section */}
        {(category === "advocate" || category === "expert") && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold mb-6 text-black">
              {category === "advocate" ? "Advocate" : "Expert"} Payment
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  {category === "advocate" ? "Advocate" : "Expert"} Name
                </label>

                {loading && (category === "advocate" || category === "expert") ? (
                  <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-500">
                    Loading...
                  </div>
                ) : (
                  <Select
                    name={category === "advocate" ? "advocateName" : "expertName"}
                    value={
                      category === "advocate" ? selectedAdvocate : selectedExpert
                    }
                    onInputChange={(inputValue) => {
                      if (category === "advocate") {
                        fetchAdvocates(inputValue);
                      } else {
                        fetchExperts(inputValue);
                      }
                    }}
                    onChange={async (selectedOption) => {
                      const name = category === "advocate" ? "advocateName" : "expertName";
                      const value = selectedOption ? selectedOption.value : "";

                      // Update selection state
                      if (category === "advocate") {
                        setSelectedAdvocate(selectedOption);
                      } else {
                        setSelectedExpert(selectedOption);
                      }

                      // Trigger handleInputChange logic
                      handleInputChange({
                        target: {
                          name: name,
                          value: value,
                          selectedOption: selectedOption // Pass selectedOption to handle extra logic
                        },
                      });
                    }}
                    options={
                      category === "advocate" ? advocateOptions : expertOptions
                    }
                    isLoading={category === "advocate" ? loadingAdvocates : loadingExperts}
                    placeholder={`Select ${category === "advocate" ? "Advocate" : "Expert"}`}
                    isSearchable={true}
                    isClearable={true}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#d1d5db', // gray-300
                        borderRadius: '0.5rem', // rounded-lg
                        padding: '0.125rem 0.25rem',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#9ca3af' },
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: '0.375rem 0.75rem', // py-3 px-4
                      }),
                      input: (base) => ({
                        ...base,
                        padding: 0,
                        margin: 0,
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: '#9ca3af',
                      }),
                    }}
                  />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-gray-700">Cases</label>
                </div>

                {caseRows.map((row, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <Select
                      value={
                        row.doctorId
                          ? { value: row.doctor, label: row.doctor, _id: row.doctorId }
                          : null
                      }
                      onInputChange={(inputValue) => {
                        if (inputValue) {
                          fetchDoctors(inputValue);
                        }
                      }}
                      onChange={(selectedOption) => {
                        // ... same logic
                        handleCaseRowChange(index, "doctor", selectedOption ? selectedOption.value : "");
                        handleCaseRowChange(index, "doctorId", selectedOption ? selectedOption._id : "");

                        if (selectedOption) {
                          try {
                            let doctorCase;
                            if (category === 'advocate') {
                              doctorCase = advocateCases.find(
                                item => (item.doctorId === selectedOption._id) ||
                                  (item.doctorName === selectedOption.value)
                              );
                            } else if (category === 'expert') {
                              doctorCase = expertCases.find(
                                item => (item.doctorId === selectedOption._id) ||
                                  (item.doctorName === selectedOption.value)
                              );
                            }

                            if (doctorCase) {
                              handleCaseRowChange(index, "caseStage", doctorCase.caseType || doctorCase.caseStage || "");
                            } else {
                              handleCaseRowChange(index, "caseStage", "");
                            }
                          } catch (error) {
                            console.error("Error finding case details for doctor:", error);
                            handleCaseRowChange(index, "caseStage", "");
                          }
                        } else {
                          handleCaseRowChange(index, "caseStage", "");
                        }
                      }}
                      options={
                        doctorOptions.length > 0
                          ? doctorOptions
                          : (category === 'advocate' ? doctorsForAdvocate : doctorsForExpert).map(d => ({
                            value: d.fullName,
                            label: d.fullName,
                            _id: d._id
                          }))
                      }
                      isLoading={loadingDoctors}
                      placeholder="Select Doctor"
                      isSearchable={true}
                      isClearable={true}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: '#d1d5db',
                          borderRadius: '0.5rem',
                          padding: '0.125rem 0.25rem',
                          boxShadow: 'none',
                          '&:hover': { borderColor: '#9ca3af' },
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: '0.375rem 0.75rem',
                        }),
                        input: (base) => ({
                          ...base,
                          padding: 0,
                          margin: 0,
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: '#9ca3af',
                        }),
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Case Stage"
                      value={row.caseStage}
                      onChange={(e) => handleCaseRowChange(index, "caseStage", e.target.value)}
                      required
                      className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={row.amount}
                        onChange={(e) => handleCaseRowChange(index, "amount", e.target.value)}
                        required
                        step="0.01"
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                      />
                      {index > 0 && ( // Show delete button only for additional rows (not the first one)
                        <button
                          type="button"
                          onClick={() => {
                            const updatedRows = [...caseRows];
                            updatedRows.splice(index, 1);
                            setCaseRows(updatedRows);
                          }}
                          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCaseRow}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  + Add More Cases
                </button>
              </div>

              <div className="text-lg font-bold text-red-700">
                Total: ₹ {total.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Tax Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-6 text-black">Tax Settings</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="taxApplicable"
                name="taxApplicable"
                checked={formData.taxApplicable}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="taxApplicable" className="ml-3 block text-sm font-medium text-gray-700">
                Apply Tax
              </label>
            </div>

            {formData.taxApplicable && (
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Enter tax rate"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Notes & Attachment */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-6 text-black">Notes & Attachment</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Notes / Additional Info
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
                placeholder="Add any extra details"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Upload Attachment
              </label>
              <input
                type="file"
                name="attachment"
                onChange={handleInputChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {formData.attachment && (
                <div className="mt-2">
                  {formData.attachment.exists ? (
                    <div>
                      <p className="text-sm text-green-600">Existing file: {formData.attachment.name}</p>
                      <a
                        href={formData.attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm inline-block mt-1"
                      >
                        View/Download Existing File
                      </a>
                      <p className="text-xs text-gray-500 mt-1">Upload a new file to replace the existing one</p>
                    </div>
                  ) : (
                    <p className="text-sm text-green-600">Selected: {formData.attachment.name}</p>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">Max 10MB (PDF, images, docs)</p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-black">
              Base Amount: <span className="text-red-700 ml-4">₹ {total.toFixed(2)}</span>
              {formData.taxApplicable && (
                <div className="block">
                  <div className="text-lg font-bold text-black">
                    Final Amount: <span className="text-red-700">₹ {(total + (total * formData.taxRate) / 100).toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    (includes {formData.taxRate}% tax: ₹ {(total * formData.taxRate / 100).toFixed(2)})
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-10 py-3 rounded-lg hover:bg-green-700 font-medium text-lg"
              >
                Save Entry
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-yellow-500 text-white px-10 py-3 rounded-lg hover:bg-yellow-600 font-medium text-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;