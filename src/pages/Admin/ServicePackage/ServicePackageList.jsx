// // src/pages/Admin/ServicePackageList/ServicePackageList.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../../components/mainComponents/Table";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from "react-toastify";

// const ServicePackageList = () => {
//   const navigate = useNavigate();
//   const [packages, setPackages] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     fetchPackages();
//   }, []);

//   const fetchPackages = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get(apiEndpoints.servicePackages.list);
//       if (response.data.success) {
//         setPackages(response.data.data);
//       } else {
//         toast.error(response.data.message || "Failed to load service packages!");
//       }
//     } catch (error) {
//       console.error("Error fetching service packages:", error);
//       toast.error(error.response?.data?.message || "Error loading service packages!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (pkg) => {
//     if (!window.confirm(`Are you sure you want to delete ${pkg.name}?`)) {
//       return;
//     }

//     try {
//       const response = await apiClient.delete(apiEndpoints.servicePackages.delete(pkg._id));
//       if (response.data.success) {
//         toast.success("Service package deleted successfully!");
//         fetchPackages(); // Refresh the list
//       } else {
//         toast.error(response.data.message || "Failed to delete service package!");
//       }
//     } catch (error) {
//       console.error("Error deleting service package:", error);
//       toast.error(error.response?.data?.message || "Error deleting service package!");
//     }
//   };

//   // Yearly charges helpers for edit modal
//   const addYearlyCharge = () => {
//     setEditData((prev) => ({
//       ...prev,
//       yearlyCharges: [...(prev.yearlyCharges || []), { year: 1, charge: '', description: '' }]
//     }));
//   };

//   const updateYearlyCharge = (index, field, value) => {
//     setEditData((prev) => {
//       const yc = Array.isArray(prev.yearlyCharges) ? [...prev.yearlyCharges] : [];
//       if (field === 'year') {
//         yc[index] = { ...yc[index], [field]: value };
//       } else if (field === 'charge') {
//         yc[index] = { ...yc[index], [field]: value };
//       } else {
//         yc[index] = { ...yc[index], [field]: value };
//       }
//       return { ...prev, yearlyCharges: yc };
//     });
    
//     // Validate this specific yearly charge after update
//     const updatedCharge = {
//       ...editData.yearlyCharges[index],
//       [field]: value
//     };
//     const chargeErrors = validateYearlyCharge(updatedCharge, index);
//     setErrors(prev => ({ ...prev, ...chargeErrors }));
//   };

//   const removeYearlyCharge = (index) => {
//     setEditData((prev) => {
//       const yc = Array.isArray(prev.yearlyCharges) ? [...prev.yearlyCharges] : [];
//       yc.splice(index, 1);
//       return { ...prev, yearlyCharges: yc };
//     });
//   };

//   // Validation function
//   const validateField = (name, value) => {
//     switch (name) {
//       case 'name':
//         if (!value || value.trim() === '') {
//           return 'Package name is required';
//         }
//         if (value.length < 2) {
//           return 'Package name must be at least 2 characters';
//         }
//         return '';
//       case 'basePrice':
//       case 'finalPrice':
//         if (value !== '' && value !== null && value !== undefined) {
//           const num = parseFloat(value);
//           if (isNaN(num) || num < 0) {
//             return `${name === 'basePrice' ? 'Base' : 'Final'} price must be a valid non-negative number`;
//           }
//         }
//         return '';
//       case 'discountPercentage':
//         if (value !== '' && value !== null && value !== undefined) {
//           const num = parseFloat(value);
//           if (!isNaN(num) && (num < 0 || num > 100)) {
//             return 'Discount percentage must be between 0 and 100';
//           }
//         }
//         return '';
//       case 'indemnityCover':
//         if (value !== '' && value !== null && value !== undefined) {
//           const num = parseFloat(value);
//           if (isNaN(num) || num < 0) {
//             return 'Indemnity cover must be a valid non-negative number';
//           }
//         }
//         return '';
//       case 'validityValue':
//         if (value !== '' && value !== null && value !== undefined) {
//           const num = parseInt(value);
//           if (isNaN(num) || num <= 0) {
//             return 'Validity period value must be a positive number';
//           }
//         }
//         return '';
//       default:
//         return '';
//     }
//   };

//   // Real-time validation function for yearly charges
//   const validateYearlyCharge = (charge, index) => {
//     const errors = {};
    
//     if (charge.year === null || charge.year === undefined || charge.year === '') {
//       errors[`yearlyCharge_${index}_year`] = 'Year is required';
//     } else if (isNaN(parseInt(charge.year)) || parseInt(charge.year) < 1 || parseInt(charge.year) > 10) {
//       errors[`yearlyCharge_${index}_year`] = 'Year must be between 1 and 10';
//     }
    
//     if (charge.charge === null || charge.charge === undefined || charge.charge === '') {
//       errors[`yearlyCharge_${index}_charge`] = 'Charge is required';
//     } else {
//       const chargeValue = parseFloat(charge.charge);
//       if (isNaN(chargeValue) || chargeValue < 0) {
//         errors[`yearlyCharge_${index}_charge`] = 'Charge must be a valid non-negative number';
//       }
//     }
    
//     return errors;
//   };

//   const handleEditClick = (row) => {
//     setSelectedPackage(row);
//     // Ensure editData contains all package fields for editing
//     setEditData({ 
//       ...row,
//       _id: row._id,
//       // Ensure validityPeriod is properly structured
//       validityPeriod: row.validityPeriod || { value: 12, unit: 'months' },
//       // Ensure yearlyCharges is properly structured
//       yearlyCharges: row.yearlyCharges || []
//     });
//     // Clear errors when opening edit modal
//     setErrors({});
//   };

//   const handleSaveEdit = async () => {
//     // Client-side validation
//     if (!editData || !editData._id) {
//       toast.error('No package selected for update');
//       return;
//     }

//     if (!editData.name || editData.name.trim() === '') {
//       toast.error('Package name is required');
//       return;
//     }

//     if (editData.name.length < 2) {
//       toast.error('Package name must be at least 2 characters');
//       return;
//     }

//     // Validate base price and final price
//     const basePrice = parseFloat(editData.basePrice);
//     const finalPrice = parseFloat(editData.finalPrice);
//     if (isNaN(basePrice) || basePrice < 0) {
//       toast.error('Base price must be a valid non-negative number');
//       return;
//     }
//     if (isNaN(finalPrice) || finalPrice < 0) {
//       toast.error('Final price must be a valid non-negative number');
//       return;
//     }

//     // Validate discount percentage
//     const discount = parseFloat(editData.discountPercentage);
//     if (!isNaN(discount) && (discount < 0 || discount > 100)) {
//       toast.error('Discount percentage must be between 0 and 100');
//       return;
//     }

//     // Validate indemnity cover
//     const indemnity = parseFloat(editData.indemnityCover);
//     if (isNaN(indemnity) || indemnity < 0) {
//       toast.error('Indemnity cover must be a valid non-negative number');
//       return;
//     }

//     // Validate validity period
//     const validityValue = parseInt(editData.validityPeriod?.value);
//     if (isNaN(validityValue) || validityValue <= 0) {
//       toast.error('Validity period value must be a positive number');
//       return;
//     }

//     // Validate yearly charges if they exist
//     if (editData.yearlyCharges && editData.yearlyCharges.length > 0) {
//       for (let i = 0; i < editData.yearlyCharges.length; i++) {
//         const yc = editData.yearlyCharges[i];
//         const year = parseInt(yc.year);
//         const charge = parseFloat(yc.charge);
        
//         if (isNaN(year) || year < 1 || year > 10) {
//           toast.error(`Year value in row ${i + 1} must be between 1 and 10`);
//           return;
//         }
        
//         if (isNaN(charge) || charge < 0) {
//           toast.error(`Charge value in row ${i + 1} must be a valid non-negative number`);
//           return;
//         }
        
//         // Check for duplicate years
//         const yearCount = editData.yearlyCharges.filter(item => parseInt(item.year) === year).length;
//         if (yearCount > 1) {
//           toast.error(`Duplicate year value detected: Year ${year}. Each year should be unique.`);
//           return;
//         }
//       }
//     }

//     try {
//       // Normalize yearlyCharges and numeric fields before sending
//       const normalizedYC = (editData.yearlyCharges || []).map((y) => ({
//         year: parseInt(y.year) || 1,
//         charge: parseFloat(y.charge) || 0,
//         description: y.description || ''
//       }));

//       // Prepare the full package update payload
//       const payload = {
//         packageName: editData.name || editData.packageName,
//         description: editData.description,
//         category: editData.category || 'basic',
//         targetAudience: editData.targetAudience || 'doctors',
//         basePrice: parseFloat(editData.basePrice) || 0,
//         finalPrice: parseFloat(editData.finalPrice) || 0,
//         discountPercentage: parseFloat(editData.discountPercentage) || 0,
//         indemnityCover: parseFloat(editData.indemnityCover) || 0,
//         validityPeriod: {
//           value: parseInt(editData.validityPeriod?.value) || 12,
//           unit: editData.validityPeriod?.unit || 'months'
//         },
//         status: editData.status || 'active',
//         yearlyCharges: normalizedYC
//       };

//       setLoading(true);
//       // Use the correct PUT endpoint for full package update
//       const response = await apiClient.put(apiEndpoints.servicePackages.update(editData._id), payload);
//       if (response.data.success) {
//         toast.success('Service package updated successfully');
//         setSelectedPackage(null);
//         fetchPackages();
//       } else {
//         toast.error(response.data.message || 'Failed to update package');
//       }
//     } catch (error) {
//       console.error('Error updating package:', error);
//       toast.error(error.response?.data?.message || 'Error updating package');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // View modal state
//   const [viewPackage, setViewPackage] = useState(null);

//   const handleView = (row) => {
//     setViewPackage(row);
//   };

//   const filteredPackages = packages.filter((pkg) =>
//     (pkg.name || pkg.packageName || '').toString().toLowerCase().includes((searchTerm || '').toLowerCase())
//   );

//   // Map packages to a clean table shape. Keep _id for actions but Table will hide it from UI.
//   const tableRows = filteredPackages.map((pkg) => ({
//     name: pkg.name || pkg.packageName || '',
//     year: pkg.year || (pkg.validityPeriod ? `${pkg.validityPeriod.value} ${pkg.validityPeriod.unit}` : ''),
//     indemnity: pkg.indemnity || (pkg.indemnityCover ? pkg.indemnityCover : ''),
//     amount: pkg.amount || pkg.finalPrice || pkg.totalPrice || '',
//     detail: pkg.detail || pkg.targetAudience || '',
//     user: pkg.user || (pkg.createdBy ? (pkg.createdBy.fullName || pkg.createdBy.name) : 'admin'),
//     yearlyCharges: pkg.yearlyCharges || [],
//     totalCharges: pkg.totalCharges || (pkg.yearlyCharges ? pkg.yearlyCharges.reduce((s, y) => s + (y.charge || 0), 0) : (pkg.finalPrice || 0)),
//     _id: pkg._id,
//   }));

//   const amountColumn = {
//     header: 'amount',
//     render: (row) => {
//       const val = row.amount;
//       if (val === null || val === undefined || val === '') return '-';
//       const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, ''));
//       if (isNaN(num)) return String(val);
//       return `\u20b9${num.toLocaleString('en-IN')}`;
//     }
//   };

//   const indemnityColumn = {
//     header: 'indemnity',
//     render: (row) => {
//       const val = row.indemnity;
//       if (val === null || val === undefined || val === '') return '-';
//       const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, ''));
//       if (isNaN(num)) return String(val);
//       return `\u20b9${num.toLocaleString('en-IN')}`;
//     }
//   };

//   const yearlyChargesColumn = {
//     header: 'yearlyCharges',
//     render: (row) => {
//       const yc = row.yearlyCharges || [];
//       if (!yc || yc.length === 0) return '-';
//       return (
//         <div className="text-sm">
//           <span className="font-semibold text-green-600">{yc.length} yr</span>
//           <div className="mt-1 max-h-20 overflow-y-auto">
//             {yc.slice(0, 3).map((y, i) => (
//               <div key={i} className="text-xs">Y{y.year}: \u20b9{Number(y.charge).toLocaleString('en-IN')}</div>
//             ))}
//             {yc.length > 3 && <div className="text-xs text-gray-500">+{yc.length - 3} more</div>}
//           </div>
//         </div>
//       );
//     }
//   };

//   const actions = [
//     {
//       label: 'Edit',
//       icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//       </svg>,
//       showAsIcon: true,
//       onClick: (row) => handleEditClick(row),
//     },
//     {
//       label: 'View',
//       icon: <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
//       showAsIcon: true,
//       onClick: (row) => handleView(row),
//     },
//     {
//       label: 'Delete',
//       icon: <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//       </svg>,
//       showAsIcon: true,
//       onClick: (row) => handleDelete(row),
//     }
//   ];

//   return (
//     <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Service Package List</h2>
//         <button
//           onClick={() => navigate("/admin/create-service-package")}
//           className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium transition-colors"
//         >
//           Create Service Package
//         </button>
//       </div>

//       {/* Search */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search Service Packages"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full max-w-xs p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
//         />
//       </div>

//       {/* Loading indicator */}
//       {loading && (
//         <div className="flex justify-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#398C89]"></div>
//         </div>
//       )}

//       {/* Table */}
//       {!loading && (
//         <Table
//           data={filteredPackages}
//           actions={actions}
//           extraColumns={[yearlyChargesColumn]}
//           headers={["ID", "SERVICE PACKAGE NAME", "YEAR", "INDEMNITY COVER (₹)", "AMOUNT (₹)", "DETAIL", "USER"]}
//         />
//       )}

//       {/* Edit Modal */}
//       {selectedPackage && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto">
//             <h2 className="text-lg font-semibold mb-4">Edit Package</h2>
            
//             {/* Basic Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={editData.name || ""}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setEditData({ ...editData, name: value });
//                     const error = validateField('name', value);
//                     setErrors(prev => ({ ...prev, name: error }));
//                   }}
//                   className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border rounded'}`}
//                 />
//                 {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="category"
//                   value={editData.category || "basic"}
//                   onChange={(e) => setEditData({ ...editData, category: e.target.value })}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="medical">Medical</option>
//                   <option value="legal">Legal</option>
//                   <option value="insurance">Insurance</option>
//                   <option value="consultation">Consultation</option>
//                   <option value="premium">Premium</option>
//                   <option value="basic">Basic</option>
//                   <option value="custom">Custom</option>
//                 </select>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
//                 <select
//                   name="targetAudience"
//                   value={editData.targetAudience || "doctors"}
//                   onChange={(e) => setEditData({ ...editData, targetAudience: e.target.value })}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="doctors">Doctors</option>
//                   <option value="hospitals">Hospitals</option>
//                   <option value="advocates">Advocates</option>
//                   <option value="experts">Experts</option>
//                   <option value="individuals">Individuals</option>
//                   <option value="organizations">Organizations</option>
//                   <option value="all">All</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <select
//                   name="status"
//                   value={editData.status || "active"}
//                   onChange={(e) => setEditData({ ...editData, status: e.target.value })}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                   <option value="discontinued">Discontinued</option>
//                   <option value="draft">Draft</option>
//                 </select>
//               </div>
//             </div>

//             {/* Pricing Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
//                 <input
//                   type="text"
//                   name="basePrice"
//                   value={editData.basePrice || ""}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setEditData({ ...editData, basePrice: value });
//                     const error = validateField('basePrice', value);
//                     setErrors(prev => ({ ...prev, basePrice: error }));
//                   }}
//                   className={`w-full p-2 border ${errors.basePrice ? 'border-red-500' : 'border rounded'}`}
//                 />
//                 {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Final Price (₹)</label>
//                 <input
//                   type="text"
//                   name="finalPrice"
//                   value={editData.finalPrice || ""}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setEditData({ ...editData, finalPrice: value });
//                     const error = validateField('finalPrice', value);
//                     setErrors(prev => ({ ...prev, finalPrice: error }));
//                   }}
//                   className={`w-full p-2 border ${errors.finalPrice ? 'border-red-500' : 'border rounded'}`}
//                 />
//                 {errors.finalPrice && <p className="text-red-500 text-xs mt-1">{errors.finalPrice}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
//                 <input
//                   type="text"
//                   name="discountPercentage"
//                   value={editData.discountPercentage || ""}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setEditData({ ...editData, discountPercentage: value });
//                     const error = validateField('discountPercentage', value);
//                     setErrors(prev => ({ ...prev, discountPercentage: error }));
//                   }}
//                   className={`w-full p-2 border ${errors.discountPercentage ? 'border-red-500' : 'border rounded'}`}
//                 />
//                 {errors.discountPercentage && <p className="text-red-500 text-xs mt-1">{errors.discountPercentage}</p>}
//               </div>
//             </div>

//             {/* Indemnity and Validity */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Indemnity Cover (₹)</label>
//                 <input
//                   type="text"
//                   name="indemnityCover"
//                   value={editData.indemnityCover || ""}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setEditData({ ...editData, indemnityCover: value });
//                     const error = validateField('indemnityCover', value);
//                     setErrors(prev => ({ ...prev, indemnityCover: error }));
//                   }}
//                   className={`w-full p-2 border ${errors.indemnityCover ? 'border-red-500' : 'border rounded'}`}
//                 />
//                 {errors.indemnityCover && <p className="text-red-500 text-xs mt-1">{errors.indemnityCover}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Validity Period</label>
//                 <div className="flex space-x-2">
//                   <input
//                     type="number"
//                     name="validityValue"
//                     placeholder="Value"
//                     value={editData.validityPeriod?.value || ""}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       setEditData({ 
//                         ...editData, 
//                         validityPeriod: { 
//                           ...editData.validityPeriod, 
//                           value: parseInt(value) || 0 
//                         } 
//                       });
//                       const error = validateField('validityValue', value);
//                       setErrors(prev => ({ ...prev, validityValue: error }));
//                     }}
//                     className={`w-full p-2 border ${errors.validityValue ? 'border-red-500' : 'border rounded'}`}
//                   />
//                   <select
//                     name="validityUnit"
//                     value={editData.validityPeriod?.unit || "months"}
//                     onChange={(e) => setEditData({ 
//                       ...editData, 
//                       validityPeriod: { 
//                         ...editData.validityPeriod, 
//                         unit: e.target.value 
//                       } 
//                     })}
//                     className="w-full p-2 border rounded"
//                   >
//                     <option value="days">Days</option>
//                     <option value="weeks">Weeks</option>
//                     <option value="months">Months</option>
//                     <option value="years">Years</option>
//                   </select>
//                 </div>
//                 {errors.validityValue && <p className="text-red-500 text-xs mt-1">{errors.validityValue}</p>}
//               </div>
//             </div>

//             {/* Description */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 name="description"
//                 value={editData.description || ""}
//                 onChange={(e) => setEditData({ ...editData, description: e.target.value })}
//                 rows="3"
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             {/* Yearly Charges Editor */}
//             <div className="mb-4">
//               <div className="flex items-center justify-between mb-2">
//                 <label className="block text-sm font-medium text-gray-700">Yearly Charges</label>
//                 <button
//                   type="button"
//                   className="text-sm px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//                   onClick={addYearlyCharge}
//                 >
//                   + Add Year
//                 </button>
//               </div>

//               <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded">
//                 {(editData.yearlyCharges || []).map((yc, idx) => (
//                   <div key={idx} className={`flex items-start space-x-2 p-2 rounded ${errors[`yearlyCharge_${idx}`] ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
//                     <input
//                       className={`w-16 p-2 border text-sm ${errors[`yearlyCharge_${idx}_year`] ? 'border-red-500' : 'border rounded'}`}
//                       placeholder="Year"
//                       type="number"
//                       min="1"
//                       max="10"
//                       value={yc.year || ''}
//                       onChange={(e) => updateYearlyCharge(idx, 'year', parseInt(e.target.value) || '')}
//                     />
//                     <input
//                       className={`w-28 p-2 border text-sm ${errors[`yearlyCharge_${idx}_charge`] ? 'border-red-500' : 'border rounded'}`}
//                       placeholder="Charge (₹)"
//                       type="text"
//                       value={yc.charge || ''}
//                       onChange={(e) => updateYearlyCharge(idx, 'charge', e.target.value)}
//                     />
//                     <input
//                       className="flex-1 p-2 border rounded text-sm"
//                       placeholder="Description"
//                       value={yc.description || ''}
//                       onChange={(e) => updateYearlyCharge(idx, 'description', e.target.value)}
//                     />
//                     <button
//                       type="button"
//                       className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                       onClick={() => removeYearlyCharge(idx)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//                 {(!editData.yearlyCharges || editData.yearlyCharges.length === 0) && (
//                   <div className="text-sm text-gray-500 text-center py-4">No yearly charges configured</div>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end space-x-4 mt-4">
//               <button
//                 onClick={() => setSelectedPackage(null)}
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveEdit}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Modal for full details */}
//       {viewPackage && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Service Package Details</h2>
//               <button onClick={() => setViewPackage(null)} className="text-gray-600">Close</button>
//             </div>
//             <div className="space-y-3 text-sm text-gray-700">
//               <div><strong>Name:</strong> {viewPackage.name}</div>
//               <div><strong>Year/Validity:</strong> {viewPackage.year}</div>
//               <div><strong>Amount:</strong> {amountColumn.render(viewPackage)}</div>
//               <div><strong>Indemnity Cover:</strong> {indemnityColumn.render(viewPackage)}</div>
//               <div><strong>Detail / Audience:</strong> {viewPackage.detail}</div>
//               <div><strong>User:</strong> {viewPackage.user}</div>
//               <div>
//                 <strong>Yearly Charges:</strong>
//                 {viewPackage.yearlyCharges && viewPackage.yearlyCharges.length > 0 ? (
//                   <ul className="list-disc ml-6 mt-2 text-xs">
//                     {viewPackage.yearlyCharges.map((yc, i) => (
//                       <li key={i}>Year {yc.year}: ₹{Number(yc.charge).toLocaleString('en-IN')} – {yc.description || ''}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <div className="text-sm text-gray-500">None</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ServicePackageList;




















// src/pages/Admin/ServicePackageList/ServicePackageList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/mainComponents/Table";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";

const ServicePackageList = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewPackage, setViewPackage] = useState(null); // Only for View modal

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.servicePackages.list);
      if (response.data.success) {
        setPackages(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to load service packages!");
      }
    } catch (error) {
      console.error("Error fetching service packages:", error);
      toast.error(error.response?.data?.message || "Error loading service packages!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pkg) => {
    if (!window.confirm(`Are you sure you want to delete ${pkg.name || pkg.packageName}?`)) {
      return;
    }

    try {
      const response = await apiClient.delete(apiEndpoints.servicePackages.delete(pkg._id));
      if (response.data.success) {
        toast.success("Service package deleted successfully!");
        fetchPackages(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to delete service package!");
      }
    } catch (error) {
      console.error("Error deleting service package:", error);
      toast.error(error.response?.data?.message || "Error deleting service package!");
    }
  };

  // NEW: Edit handler - navigates to dedicated edit page
  const handleEditClick = (row) => {
    navigate(`/admin/edit-service-package/${row._id}`);
  };

  const handleView = (row) => {
    setViewPackage(row);
  };

  const filteredPackages = packages.filter((pkg) =>
    (pkg.name || pkg.packageName || '').toString().toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  // Map packages to table rows
  const tableRows = filteredPackages.map((pkg) => ({
    name: pkg.name || pkg.packageName || '',
    year: pkg.year || (pkg.validityPeriod ? `${pkg.validityPeriod.value} ${pkg.validityPeriod.unit}` : ''),
    indemnity: pkg.indemnity || (pkg.indemnityCover ? pkg.indemnityCover : ''),
    amount: pkg.amount || pkg.finalPrice || pkg.totalPrice || '',
    detail: pkg.detail || pkg.targetAudience || '',
    user: pkg.user || (pkg.createdBy ? (pkg.createdBy.fullName || pkg.createdBy.name) : 'admin'),
    yearlyCharges: pkg.yearlyCharges || [],
    _id: pkg._id,
  }));

  const amountColumn = {
    header: 'amount',
    render: (row) => {
      const val = row.amount;
      if (val === null || val === undefined || val === '') return '-';
      const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return String(val);
      return `\u20b9${num.toLocaleString('en-IN')}`;
    }
  };

  const indemnityColumn = {
    header: 'indemnity',
    render: (row) => {
      const val = row.indemnity;
      if (val === null || val === undefined || val === '') return '-';
      const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return String(val);
      return `\u20b9${num.toLocaleString('en-IN')}`;
    }
  };

  const yearlyChargesColumn = {
    header: 'yearlyCharges',
    render: (row) => {
      const yc = row.yearlyCharges || [];
      if (!yc || yc.length === 0) return '-';
      return (
        <div className="text-sm">
          <span className="font-semibold text-green-600">{yc.length} yr</span>
          <div className="mt-1 max-h-20 overflow-y-auto">
            {yc.slice(0, 3).map((y, i) => (
              <div key={i} className="text-xs">Y{y.year}: \u20b9{Number(y.charge).toLocaleString('en-IN')}</div>
            ))}
            {yc.length > 3 && <div className="text-xs text-gray-500">+{yc.length - 3} more</div>}
          </div>
        </div>
      );
    }
  };

  const actions = [
    {
      label: 'Edit',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>,
      showAsIcon: true,
      onClick: (row) => handleEditClick(row),
    },
    {
      label: 'View',
      icon: <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      </svg>,
      showAsIcon: true,
      onClick: (row) => handleView(row),
    },
    {
      label: 'Delete',
      icon: <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>,
      showAsIcon: true,
      onClick: (row) => handleDelete(row),
    }
  ];

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Service Package List</h2>
        <button
          onClick={() => navigate("/admin/create-service-package")}
          className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium transition-colors"
        >
          Create Service Package
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Service Packages"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        />
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#398C89]"></div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <Table
          data={tableRows}
          actions={actions}
          extraColumns={[yearlyChargesColumn, amountColumn, indemnityColumn]}
          headers={["SERVICE PACKAGE NAME", "YEAR", "INDEMNITY COVER (₹)", "AMOUNT (₹)", "DETAIL", "USER"]}
        />
      )}

      {/* View Modal */}
      {viewPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Service Package Details</h2>
              <button onClick={() => setViewPackage(null)} className="text-gray-600 hover:text-gray-800">
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div><strong>Name:</strong> {viewPackage.name || viewPackage.packageName}</div>
              <div><strong>Year/Validity:</strong> {viewPackage.year}</div>
              <div><strong>Amount:</strong> {amountColumn.render(viewPackage)}</div>
              <div><strong>Indemnity Cover:</strong> {indemnityColumn.render(viewPackage)}</div>
              <div><strong>Detail / Audience:</strong> {viewPackage.detail}</div>
              <div><strong>User:</strong> {viewPackage.user}</div>
              <div>
                <strong>Yearly Charges:</strong>
                {viewPackage.yearlyCharges && viewPackage.yearlyCharges.length > 0 ? (
                  <ul className="list-disc ml-6 mt-2 text-xs">
                    {viewPackage.yearlyCharges.map((yc, i) => (
                      <li key={i}>
                        Year {yc.year}: ₹{Number(yc.charge).toLocaleString('en-IN')} – {yc.description || 'No description'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 ml-6">None</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePackageList;