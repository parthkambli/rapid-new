




















// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const CreateQuotation = () => {
//   const [isPreview, setIsPreview] = useState(false);
//   const [doctors, setDoctors] = useState([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(true);
//   const [membershipTypeLocked, setMembershipTypeLocked] = useState(false);

//   // Selected years as array: ['2', '3', '5']
//   const [selectedYears, setSelectedYears] = useState([]);

//   const [formData, setFormData] = useState({
//     trno: '',
//     quotationDate: '',
//     doctorId: '',
//     doctorName: '',
//     membershipType: 'INDIVIDUAL MEMBERSHIP',
//     specialization: 'Dental',
//     area: 'All India',
//     narration: '',
//     monthly: false,
//     indemnityCover: false,
//   });

//   const navigate = useNavigate();

//   // Fetch doctors
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         setLoadingDoctors(true);
//         const response = await apiClient.get(apiEndpoints.doctors.list, {
//           params: { limit: 1000 }
//         });
//         setDoctors(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching doctors:', error);
//         toast.error('Failed to load doctors list');
//       } finally {
//         setLoadingDoctors(false);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked, type: inputType } = e.target;

//     if (name === 'doctorName') {
//       const selectedDoctor = doctors.find(doctor =>
//         doctor.doctorId === value || `${doctor.fullName} (${doctor.doctorId})` === value
//       );

//       if (selectedDoctor) {
//         let membershipType = 'INDIVIDUAL MEMBERSHIP';
//         if (selectedDoctor.doctorType === 'hospital') {
//           membershipType = 'HOSPITAL MEMBERSHIP';
//         } else if (selectedDoctor.doctorType === 'hospital_individual') {
//           membershipType = 'HOSPITAL + INDIVIDUAL MEMBERSHIP';
//         }

//         const specialization = selectedDoctor.specialization?.join(', ') || '';

//         setFormData({
//           ...formData,
//           doctorId: selectedDoctor._id,
//           doctorName: value,
//           membershipType,
//           specialization,
//         });
//         setMembershipTypeLocked(true);
//       } else {
//         setFormData({
//           ...formData,
//           doctorId: '',
//           doctorName: value,
//           membershipType: 'INDIVIDUAL MEMBERSHIP',
//           specialization: '',
//         });
//         setMembershipTypeLocked(false);
//       }
//     } 
//     // Handle year checkboxes
//     else if (name.startsWith('year_')) {
//       const year = name.split('_')[1];
//       setSelectedYears(prev => 
//         prev.includes(year) 
//           ? prev.filter(y => y !== year)
//           : [...prev, year].sort((a, b) => a - b)
//       );
//     }
//     else {
//       if (name === 'membershipType' && membershipTypeLocked) {
//         toast.info('Membership type cannot be changed once auto-selected');
//         return;
//       }

//       setFormData({
//         ...formData,
//         [name]: inputType === 'checkbox' ? checked : value,
//       });
//     }
//   };

//   const handlePreview = () => {
//     if (selectedYears.length === 0) {
//       toast.error('Please select at least one membership year');
//       return;
//     }
//     setIsPreview(true);
//   };

//   const handleEdit = () => setIsPreview(false);

//   const handleSave = async () => {
//     try {
//       if (!formData.doctorId) {
//         toast.error('Please select a doctor');
//         return;
//       }

//       let requesterType = 'doctor';
//       if (formData.membershipType === 'HOSPITAL MEMBERSHIP') {
//         requesterType = 'hospital';
//       }

//       const quotationData = {
//         requester: {
//           type: requesterType,
//           name: formData.doctorName.split(' (')[0],
//           entityId: formData.doctorId,
//           contactPerson: formData.doctorName.split(' (')[0]
//         },
//         requestDetails: {
//           coverageAmount: 2500000,
//           coverageCurrency: 'INR',
//           policyTerms: selectedYears.map(y => parseInt(y)), // [2, 3]
//           paymentFrequency: formData.monthly ? 'monthly' : 'yearly',
//           additionalRequirements: formData.narration,
//           specialConditions: formData.indemnityCover ? 'Indemnity Cover Required' : ''
//         },
//         status: 'responses_pending',
//         priority: 'medium',
//         assignedTo: null,
//         ...(formData.trno && { trno: formData.trno })
//       };

//       const response = await apiClient.post(apiEndpoints.quotations.create, quotationData);
//       if (response.data.success) {
//         toast.success('Quotation created successfully!');
//         navigate('/admin/quotation-list');
//       } else {
//         toast.error(response.data.message || 'Failed to create quotation');
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to create quotation');
//     }
//   };

//   return (
//     <div className="mx-auto m-4 sm:mt-14 p-2 max-w-7xl">
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h1 className="mb-6 text-2xl font-bold text-gray-800">Quotation</h1>

//         <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

//           {/* Top Row */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 TRNO <span className="text-xs text-gray-500 font-normal">(Optional)</span>
//               </label>
//               <input
//                 type="text"
//                 name="trno"
//                 value={formData.trno}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#15BBB3] focus:border-[#15BBB3]"
//                 placeholder="Auto-generated if empty"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
//               <select
//                 name="doctorName"
//                 value={formData.doctorName}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 disabled={loadingDoctors}
//               >
//                 <option value="">{loadingDoctors ? 'Loading...' : 'Select Doctor'}</option>
//                 {doctors.map((doctor) => (
//                   <option key={doctor._id} value={`${doctor.fullName} (${doctor.doctorId})`}>
//                     {doctor.fullName} ({doctor.doctorId}) - {doctor.specialization?.join(', ') || 'N/A'}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Area</label>
//               <input
//                 type="text"
//                 name="area"
//                 value={formData.area}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 placeholder="All India"
//               />
//             </div>
//           </div>

//           {/* Middle Row */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Quotation date</label>
//               <input
//                 type="date"
//                 name="quotationDate"
//                 value={formData.quotationDate}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Membership Type
//                 {membershipTypeLocked && (
//                   <span className="ml-2 text-xs text-green-600 font-normal">(Auto-selected)</span>
//                 )}
//               </label>
//               <select
//                 name="membershipType"
//                 value={formData.membershipType}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
//                   membershipTypeLocked
//                     ? 'border-green-300 bg-green-50 text-green-800 cursor-not-allowed'
//                     : 'border-gray-300'
//                 }`}
//                 disabled={membershipTypeLocked}
//               >
//                 <option value="">Select Type</option>
//                 <option value="INDIVIDUAL MEMBERSHIP">INDIVIDUAL MEMBERSHIP</option>
//                 <option value="HOSPITAL MEMBERSHIP">HOSPITAL MEMBERSHIP</option>
//                 <option value="HOSPITAL + INDIVIDUAL MEMBERSHIP">HOSPITAL + INDIVIDUAL MEMBERSHIP</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Specialization</label>
//               <input
//                 type="text"
//                 value={formData.specialization}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
//                 disabled
//               />
//             </div>
//           </div>

//           {/* Narration */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Narration</label>
//             <input
//               type="text"
//               name="narration"
//               value={formData.narration}
//               onChange={handleChange}
//               placeholder="Additional notes"
//               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//             />
//           </div>

//           {/* MEMBERSHIP YEARS - CHECKBOXES */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Membership Year (Select one or more)</label>
//             <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
//               {[...Array(10)].map((_, i) => {
//                 const year = i + 1;
//                 const yearStr = year.toString();
//                 return (
//                   <label key={year} className="flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name={`year_${yearStr}`}
//                       checked={selectedYears.includes(yearStr)}
//                       onChange={handleChange}
//                       className="mr-2 w-5 h-5 accent-[#15BBB3] rounded"
//                     />
//                     <span className="text-sm">{year} Year</span>
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Monthly & Indemnity */}
//           <div className="flex gap-6">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="monthly"
//                 checked={formData.monthly}
//                 onChange={handleChange}
//                 className="mr-2 w-5 h-5 accent-[#15BBB3] rounded"
//               />
//               <span className="text-sm">Monthly Payment</span>
//             </label>

//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="indemnityCover"
//                 checked={formData.indemnityCover}
//                 onChange={handleChange}
//                 className="mr-2 w-5 h-5 accent-[#15BBB3] rounded"
//               />
//               <span className="text-sm">Indemnity Cover</span>
//             </label>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-wrap gap-3">
//             <button
//               type="button"
//               onClick={() => alert('Add Doctor')}
//               className="bg-[#15BBB3] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#13a89e] transition"
//             >
//               <span className="text-xl">+</span> Add Doctor
//             </button>

//             <button
//               type="button"
//               onClick={handlePreview}
//               className="bg-[#15BBB3] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#13a89e] transition"
//             >
//               Preview Quotation
//             </button>

//             <button
//               type="button"
//               onClick={() => alert('Generate PDF')}
//               className="bg-[#15BBB3] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#13a89e] transition"
//             >
//               Generate Quotation
//             </button>
//           </div>
//         </form>

//         {/* PREVIEW TABLE */}
//         {isPreview && (
//           <div className="mt-10 border-t pt-8">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview Quotation</h2>
//             <PricePreviewTable
//               membershipType={formData.membershipType}
//               specialization={formData.specialization}
//               selectedYears={selectedYears}
//               showMonthly={formData.monthly}
//               onEdit={handleEdit}
//               onSave={handleSave}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ====================== DYNAMIC PRICE PREVIEW TABLE ======================
// const PricePreviewTable = ({ membershipType, specialization, selectedYears, showMonthly, onEdit, onSave }) => {
//   // Default pricing (you can make this dynamic later)
//   const defaultPrices = {
//     '25 Lakh': { monthly: '899/-', '1': '899/-', '2': '1699/-', '3': '2499/-', '4': '3199/-', '5': '3899/-', '6': '4499/-', '7': '5099/-', '8': '5699/-', '9': '6299/-', '10': '6899/-' },
//     '50 Lakh': { monthly: '999/-', '1': '999/-', '2': '1899/-', '3': '2799/-', '4': '3599/-', '5': '4399/-', '6': '5099/-', '7': '5799/-', '8': '6499/-', '9': '7199/-', '10': '7899/-' },
//     '1 Cr':    { monthly: '1499/-', '1': '1499/-', '2': '2899/-', '3': '4299/-', '4': '5599/-', '5': '6899/-', '6': '8099/-', '7': '9299/-', '8': '10499/-', '9': '11699/-', '10': '12899/-' },
//   };

//   const indemnityOptions = ['25 Lakh', '50 Lakh', '1 Cr'];
//   const [priceMatrix, setPriceMatrix] = useState(
//     indemnityOptions.map(ind => ({
//       indemnity: ind,
//       monthly: defaultPrices[ind].monthly,
//       ...selectedYears.reduce((acc, year) => {
//         acc[`y${year}`] = defaultPrices[ind][year] || 'N/A';
//         return acc;
//       }, {})
//     }))
//   );

//   const updateCell = (rowIdx, field, value) => {
//     const newMatrix = [...priceMatrix];
//     newMatrix[rowIdx][field] = value;
//     setPriceMatrix(newMatrix);
//   };

//   // Dynamic headers: Monthly + selected years
//   const headers = [
//     ...(showMonthly ? [{ key: 'monthly', label: 'Monthly' }] : []),
//     ...selectedYears.map(year => ({ key: `y${year}`, label: `${year} Year` }))
//   ];

//   return (
//     <>
//       <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100 border-b">
//             <tr>
//               <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r">Membership Type</th>
//               <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r">Specialization</th>
//               <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r">Indemnity Cover</th>
//               {headers.map(h => (
//                 <th key={h.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r">
//                   {h.label}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {priceMatrix.map((row, i) => {
//               const isOdd = i % 2 === 1;
//               return (
//                 <tr key={i} className={`border-b ${isOdd ? 'bg-gray-50' : ''}`}>
//                   {i === 0 && (
//                     <>
//                       <td rowSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 border-r align-middle bg-white">
//                         {membershipType}
//                       </td>
//                       <td rowSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 border-r align-middle bg-white">
//                         {specialization}
//                       </td>
//                     </>
//                   )}
//                   <td className="px-4 py-3 text-sm border-r">{row.indemnity}</td>
//                   {showMonthly && (
//                     <td className="px-4 py-3 border-r">
//                       <input
//                         type="text"
//                         value={row.monthly}
//                         onChange={(e) => updateCell(i, 'monthly', e.target.value)}
//                         className="w-full border border-gray-300 rounded px-1 py-0.5 text-sm focus:ring-[#15BBB3] focus:border-[#15BBB3]"
//                       />
//                     </td>
//                   )}
//                   {selectedYears.map(year => (
//                     <td key={`y${year}`} className="px-4 py-3 border-r">
//                       <input
//                         type="text"
//                         value={row[`y${year}`]}
//                         onChange={(e) => updateCell(i, `y${year}`, e.target.value)}
//                         className="w-full border border-gray-300 rounded px-1 py-0.5 text-sm focus:ring-[#15BBB3] focus:border-[#15BBB3]"
//                       />
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-end gap-3 mt-6">
//         <button onClick={onEdit} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">
//           Edit
//         </button>
//         <button onClick={onSave} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">
//           Save
//         </button>
//       </div>
//     </>
//   );
// };

// export default CreateQuotation;














































































// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import apiClient from '../../../services/apiClient';
// import { toast } from 'react-toastify';
// import IndividualMembershipInvoice from './invoices/IndividualMembershipInvoice';
// import HospitalMembershipInvoice from './invoices/HospitalMembershipInvoice';
// import CombinedMembershipInvoice from './invoices/CombinedMembershipInvoice';

// const CreateQuotation = () => {
//   const [isPreview, setIsPreview] = useState(false);
//   const [doctors, setDoctors] = useState([]);
//   const [packages, setPackages] = useState([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(true);
//   const [membershipTypeLocked, setMembershipTypeLocked] = useState(false);
//   const [selectedYears, setSelectedYears] = useState([]);
//   const [priceMatrix, setPriceMatrix] = useState([]); // ← Lifted state

//   const [formData, setFormData] = useState({
//     trno: '',
//     quotationDate: new Date().toISOString().split('T')[0],
//     doctorId: '',
//     doctorName: '',
//     membershipType: 'INDIVIDUAL MEMBERSHIP',
//     specialization: '',
//     area: 'All India',
//     narration: '',
//     monthly: false,
//     indemnityCover: false,
//   });

//   const navigate = useNavigate();

//   // === FETCH DOCTORS ===
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         setLoadingDoctors(true);
//         const response = await apiClient.get('/doctors', { params: { limit: 1000 } });
//         setDoctors(response.data.data || []);
//       } catch (error) {
//         toast.error('Failed to load doctors');
//       } finally {
//         setLoadingDoctors(false);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   // === FETCH PACKAGES ===
//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         const response = await apiClient.get('/service-packages/list');
//         const data = response.data.data || [];
//         setPackages(data);
//       } catch (error) {
//         toast.error('Failed to load packages');
//       }
//     };
//     fetchPackages();
//   }, []);

//   // === HANDLE CHANGE ===
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name === 'doctorName') {
//       const selectedDoctor = doctors.find(d =>
//         d.doctorId === value || `${d.fullName} (${d.doctorId})` === value
//       );

//       if (selectedDoctor) {
//         let mType = 'INDIVIDUAL MEMBERSHIP';
//         if (selectedDoctor.doctorType === 'hospital') mType = 'HOSPITAL MEMBERSHIP';
//         else if (selectedDoctor.doctorType === 'hospital_individual') mType = 'HOSPITAL + INDIVIDUAL MEMBERSHIP';

//         setFormData({
//           ...formData,
//           doctorId: selectedDoctor._id,
//           doctorName: value,
//           membershipType: mType,
//           specialization: selectedDoctor.specialization?.join(', ') || 'N/A',
//         });
//         setMembershipTypeLocked(true);
//       } else {
//         setFormData({ ...formData, doctorId: '', doctorName: value, membershipType: 'INDIVIDUAL MEMBERSHIP', specialization: '' });
//         setMembershipTypeLocked(false);
//       }
//     } 
//     else if (name.startsWith('year_')) {
//       const year = name.split('_')[1];
//       setSelectedYears(prev =>
//         prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year].sort((a, b) => a - b)
//       );
//     }
//     else {
//       if (name === 'membershipType' && membershipTypeLocked) {
//         toast.info('Membership type is auto-selected');
//         return;
//       }
//       setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
//     }
//   };

//   // === PREVIEW & SAVE ===
//   const handlePreview = () => {
//     if (!formData.doctorName) {
//       toast.error('Please select a doctor');
//       return;
//     }
//     if (selectedYears.length === 0) {
//       toast.error('Select at least one year');
//       return;
//     }
//     setIsPreview(true);
//   };

//   const handleEdit = () => setIsPreview(false);

//   const handleGeneratePDF = () => {
//     toast.success('PDF generation feature will be implemented soon!');
//   };

//   const handleSave = async () => {
//     if (!formData.doctorId) {
//       toast.error('Select a doctor');
//       return;
//     }

//     if (!priceMatrix || priceMatrix.length === 0 || priceMatrix[0].indemnity === 'No packages found') {
//       toast.error('No pricing data to save');
//       return;
//     }

//     const requesterType = formData.membershipType.includes('HOSPITAL') ? 'hospital' : 'doctor';

//     const requestDetails = {
//       policyTerms: selectedYears.map(Number),
//       paymentFrequency: formData.monthly ? 'monthly' : 'yearly',
//       additionalRequirements: formData.narration,
//       specialConditions: formData.indemnityCover ? 'Indemnity Cover Required' : '',
//       items: priceMatrix.map(row => {
//         const item = { indemnity: row.indemnity };
//         selectedYears.forEach(y => {
//           if (row[`y${y}`]) item[`year_${y}`] = row[`y${y}`];
//         });
//         if (formData.monthly && row.monthly) item.monthly = row.monthly;
//         return item;
//       })
//     };

//     const quotationData = {
//       requester: {
//         type: requesterType,
//         name: formData.doctorName.split(' (')[0],
//         entityId: formData.doctorId,
//         contactPerson: formData.doctorName.split(' (')[0]
//       },
//       requestDetails,
//       status: 'responses_pending',
//       priority: 'medium',
//       ...(formData.trno && { trno: formData.trno })
//     };

//     try {
//       const response = await apiClient.post('/quotations', quotationData);
//       if (response.data.success) {
//         toast.success('Quotation created!');
//         navigate('/admin/quotation-list');
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to save');
//     }
//   };

//   return (
//     <div className="mx-auto m-4 sm:mt-14 p-2 max-w-7xl">
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h1 className="mb-6 text-2xl font-bold text-gray-800">Create Quotation</h1>

//         <form onSubmit={e => e.preventDefault()} className="space-y-6">

//           {/* Top Row */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 TRNO <span className="text-xs text-gray-500">(Optional)</span>
//               </label>
//               <input
//                 type="text"
//                 name="trno"
//                 value={formData.trno}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 placeholder="Auto-generated"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
//               <select
//                 name="doctorName"
//                 value={formData.doctorName}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 disabled={loadingDoctors}
//               >
//                 <option value="">{loadingDoctors ? 'Loading...' : 'Select Doctor'}</option>
//                 {doctors.map(d => (
//                   <option key={d._id} value={`${d.fullName} (${d.doctorId})`}>
//                     {d.fullName} ({d.doctorId}) - {d.specialization?.join(', ') || 'N/A'}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Area</label>
//               <input
//                 type="text"
//                 name="area"
//                 value={formData.area}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           </div>

//           {/* Middle Row */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Quotation Date</label>
//               <input
//                 type="date"
//                 name="quotationDate"
//                 value={formData.quotationDate}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Membership Type
//                 {membershipTypeLocked && <span className="ml-2 text-xs text-green-600">(Auto)</span>}
//               </label>
//               <select
//                 name="membershipType"
//                 value={formData.membershipType}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full border rounded-md p-2 ${membershipTypeLocked ? 'bg-green-50 border-green-300 cursor-not-allowed' : 'border-gray-300'}`}
//                 disabled={membershipTypeLocked}
//               >
//                 <option value="">Select</option>
//                 <option value="INDIVIDUAL MEMBERSHIP">INDIVIDUAL MEMBERSHIP</option>
//                 <option value="HOSPITAL MEMBERSHIP">HOSPITAL MEMBERSHIP</option>
//                 <option value="HOSPITAL + INDIVIDUAL MEMBERSHIP">HOSPITAL + INDIVIDUAL</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Specialization</label>
//               <input
//                 type="text"
//                 value={formData.specialization}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
//                 disabled
//               />
//             </div>
//           </div>

//           {/* Narration */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Narration</label>
//             <input
//               type="text"
//               name="narration"
//               value={formData.narration}
//               onChange={handleChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>

//           {/* Membership Years */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Membership Year</label>
//             <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
//               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => {
//                 const y = year.toString();
//                 return (
//                   <label key={year} className="flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name={`year_${y}`}
//                       checked={selectedYears.includes(y)}
//                       onChange={handleChange}
//                       className="mr-2 w-5 h-5 accent-[#15BBB3] rounded"
//                     />
//                     <span className="text-sm">{year} Year</span>
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Monthly & Indemnity */}
//           <div className="flex gap-6">
//             <label className="flex items-center">
//               <input type="checkbox" name="monthly" checked={formData.monthly} onChange={handleChange} className="mr-2 w-5 h-5 accent-[#15BBB3]" />
//               <span className="text-sm">Monthly Payment</span>
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" name="indemnityCover" checked={formData.indemnityCover} onChange={handleChange} className="mr-2 w-5 h-5 accent-[#15BBB3]" />
//               <span className="text-sm">Indemnity Cover</span>
//             </label>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-wrap gap-3">
//             <button type="button" onClick={() => alert('Add Doctor')} className="bg-[#15BBB3] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#13a89e]">
//               <span className="text-xl">+</span> Add Doctor
//             </button>
//             <button type="button" onClick={handlePreview} className="bg-[#15BBB3] text-white px-6 py-2 rounded-lg hover:bg-[#13a89e]">
//               Preview
//             </button>
//             <button type="button" onClick={() => alert('PDF')} className="bg-[#15BBB3] text-white px-6 py-2 rounded-lg hover:bg-[#13a89e]">
//               Generate PDF
//             </button>
//           </div>
//         </form>

//         {/* PREVIEW TABLE */}
//         {isPreview && (
//           <div className="mt-10 border-t pt-8">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview Quotation</h2>
//             <PricePreviewTable
//               membershipType={formData.membershipType}
//               selectedYears={selectedYears}
//               showMonthly={formData.monthly}
//               packages={packages}
//               specialization={formData.specialization}
//               setPriceMatrix={setPriceMatrix}  // ← Sync state
//               onEdit={handleEdit}
//               onSave={handleSave}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ==================== DYNAMIC PRICE TABLE ====================
// const PricePreviewTable = ({ 
//   membershipType, 
//   selectedYears, 
//   showMonthly, 
//   packages, 
//   specialization, 
//   setPriceMatrix, 
//   onEdit, 
//   onSave 
// }) => {
//   const [localMatrix, setLocalMatrix] = useState([]);

//   useEffect(() => {
//     if (!packages.length || selectedYears.length === 0) {
//       setLocalMatrix([]);
//       setPriceMatrix([]);
//       return;
//     }

//     const normalizeYear = (yearStr) => {
//       if (!yearStr) return null;
//       if (yearStr.toLowerCase().includes('month')) return 'monthly';
//       const match = yearStr.match(/(\d+)/);
//       return match ? match[1] : null;
//     };

//     const grouped = {};

//     packages.forEach(pkg => {
//       const normYear = normalizeYear(pkg.year);
//       if (!normYear) return;

//       const typeMatch = pkg.detail?.toLowerCase() === 'doctors' ||
//                        membershipType.toLowerCase().includes(pkg.detail?.toLowerCase());

//       const yearSelected = selectedYears.includes(normYear) || 
//                           (showMonthly && normYear === 'monthly');

//       if (typeMatch && yearSelected) {
//         const key = pkg.indemnity;
//         if (!grouped[key]) grouped[key] = { indemnity: pkg.indemnity };
//         if (normYear === 'monthly') {
//           grouped[key].monthly = pkg.amount;
//         } else {
//           grouped[key][`y${normYear}`] = pkg.amount;
//         }
//       }
//     });

//     const matrix = Object.values(grouped);

//     if (matrix.length === 0) {
//       matrix.push({
//         indemnity: 'No packages found',
//         ...selectedYears.reduce((acc, y) => ({ ...acc, [`y${y}`]: '—' }), {}),
//         ...(showMonthly && { monthly: '—' })
//       });
//     }

//     setLocalMatrix(matrix);
//     setPriceMatrix(matrix); // ← Sync with parent
//   }, [packages, membershipType, selectedYears, showMonthly, setPriceMatrix]);

//   const updateCell = (i, field, val) => {
//     const updated = [...localMatrix];
//     updated[i][field] = val;
//     setLocalMatrix(updated);
//     setPriceMatrix(updated); // ← Keep parent updated
//   };

//   const headers = [
//     ...(showMonthly ? [{ key: 'monthly', label: 'Monthly' }] : []),
//     ...selectedYears.map(y => ({ key: `y${y}`, label: `${y} Year` }))
//   ];

//   return (
//     <>
//       <div className="overflow-x-auto border border-gray-300 rounded-lg">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold border-r">Type</th>
//               <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold border-r">Specialization</th>
//               <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold border-r">Indemnity</th>
//               {headers.map(h => (
//                 <th key={h.key} className="px-4 py-3 text-left text-sm font-semibold border-r">{h.label}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {localMatrix.map((row, i) => (
//               <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
//                 {i === 0 && (
//                   <>
//                     <td rowSpan={localMatrix.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
//                       {membershipType}
//                     </td>
//                     <td rowSpan={localMatrix.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
//                       {specialization || 'All'}
//                     </td>
//                   </>
//                 )}
//                 <td className="px-4 py-3 text-sm border-r">{row.indemnity}</td>
//                 {showMonthly && (
//                   <td className="px-4 py-3 border-r">
//                     <input
//                       type="text"
//                       value={row.monthly || ''}
//                       onChange={e => updateCell(i, 'monthly', e.target.value)}
//                       className="w-full border rounded px-1 py-0.5 text-sm focus:ring-[#15BBB3]"
//                     />
//                   </td>
//                 )}
//                 {selectedYears.map(y => (
//                   <td key={`y${y}`} className="px-4 py-3 border-r">
//                     <input
//                       type="text"
//                       value={row[`y${y}`] || ''}
//                       onChange={e => updateCell(i, `y${y}`, e.target.value)}
//                       className="w-full border rounded px-1 py-0.5 text-sm focus:ring-[#15BBB3]"
//                     />
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-end gap-3 mt-6">
//         <button onClick={onEdit} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Edit</button>
//         <button onClick={onSave} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Save</button>
//       </div>
//     </>
//   );
// };

// export default CreateQuotation;



















































// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import apiClient from '../../../services/apiClient';
// import { toast } from 'react-toastify';
// import IndividualMembershipInvoice from './invoices/IndividualMembershipInvoice';
// import HospitalMembershipInvoice from './invoices/HospitalMembershipInvoice';
// import CombinedMembershipInvoice from './invoices/CombinedMembershipInvoice';

// const CreateQuotation = () => {
//   const [isPreview, setIsPreview] = useState(false);
//   const [doctors, setDoctors] = useState([]);
//   const [packages, setPackages] = useState([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(true);
//   const [membershipTypeLocked, setMembershipTypeLocked] = useState(false);
//   const [selectedYears, setSelectedYears] = useState([]);
//   const [priceMatrix, setPriceMatrix] = useState([]);

//   const [formData, setFormData] = useState({
//     trno: '',
//     quotationDate: new Date().toISOString().split('T')[0],
//     doctorId: '',
//     doctorName: '',
//     membershipType: 'INDIVIDUAL MEMBERSHIP',
//     specialization: '',
//     area: 'All India',
//     narration: '',
//     monthly: false,
//     indemnityCover: false,
//   });

//   const navigate = useNavigate();

//   // === FETCH DOCTORS ===
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         setLoadingDoctors(true);
//         const response = await apiClient.get('/doctors', { params: { limit: 1000 } });
//         setDoctors(response.data.data || []);
//       } catch (error) {
//         toast.error('Failed to load doctors');
//       } finally {
//         setLoadingDoctors(false);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   // === FETCH PACKAGES ===
//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         const response = await apiClient.get('/service-packages/list');
//         const data = response.data.data || [];
//         setPackages(data);
//       } catch (error) {
//         toast.error('Failed to load packages');
//       }
//     };
//     fetchPackages();
//   }, []);

//   // === HANDLE CHANGE ===
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name === 'doctorName') {
//       const selectedDoctor = doctors.find(d =>
//         d.doctorId === value || `${d.fullName} (${d.doctorId})` === value
//       );

//       if (selectedDoctor) {
//         let mType = 'INDIVIDUAL MEMBERSHIP';
//         if (selectedDoctor.doctorType === 'hospital') mType = 'HOSPITAL MEMBERSHIP';
//         else if (selectedDoctor.doctorType === 'hospital_individual') mType = 'HOSPITAL + INDIVIDUAL MEMBERSHIP';

//         setFormData({
//           ...formData,
//           doctorId: selectedDoctor._id,
//           doctorName: value,
//           membershipType: mType,
//           specialization: selectedDoctor.specialization?.join(', ') || 'N/A',
//         });
//         setMembershipTypeLocked(true);
//       } else {
//         setFormData({ ...formData, doctorId: '', doctorName: value, membershipType: 'INDIVIDUAL MEMBERSHIP', specialization: '' });
//         setMembershipTypeLocked(false);
//       }
//     } 
//     else if (name.startsWith('year_')) {
//       const year = name.split('_')[1];
//       setSelectedYears(prev =>
//         prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year].sort((a, b) => a - b)
//       );
//     }
//     else {
//       if (name === 'membershipType' && membershipTypeLocked) {
//         toast.info('Membership type is auto-selected');
//         return;
//       }
//       setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
//     }
//   };

//   // === PREVIEW & SAVE ===
//   const handlePreview = () => {
//     if (!formData.doctorName) {
//       toast.error('Please select a doctor');
//       return;
//     }
//     if (selectedYears.length === 0) {
//       toast.error('Select at least one year');
//       return;
//     }
//     setIsPreview(true);
//   };

//   const handleEdit = () => setIsPreview(false);

//   const handleGeneratePDF = () => {
//     toast.success('PDF generation feature will be implemented soon!');
//   };

//   const handleSave = async () => {
//     if (!formData.doctorId) {
//       toast.error('Select a doctor');
//       return;
//     }

//     if (!priceMatrix || priceMatrix.length === 0 || priceMatrix[0].indemnity === 'No packages found') {
//       toast.error('No pricing data to save');
//       return;
//     }

//     const requesterType = formData.membershipType.includes('HOSPITAL') ? 'hospital' : 'doctor';

//     const requestDetails = {
//       policyTerms: selectedYears.map(Number),
//       paymentFrequency: formData.monthly ? 'monthly' : 'yearly',
//       additionalRequirements: formData.narration,
//       specialConditions: formData.indemnityCover ? 'Indemnity Cover Required' : '',
//       items: priceMatrix.map(row => {
//         const item = { indemnity: row.indemnity };
//         selectedYears.forEach(y => {
//           if (row[`y${y}`] && row[`y${y}`] !== '—') item[`year_${y}`] = Number(row[`y${y}`].replace(/,/g, ''));
//         });
//         if (formData.monthly && row.monthly && row.monthly !== '—') item.monthly = Number(row.monthly.replace(/,/g, ''));
//         return item;
//       })
//     };

//     const quotationData = {
//       requester: {
//         type: requesterType,
//         name: formData.doctorName.split(' (')[0],
//         entityId: formData.doctorId,
//         contactPerson: formData.doctorName.split(' (')[0]
//       },
//       requestDetails,
//       status: 'responses_pending',
//       priority: 'medium',
//       ...(formData.trno && { trno: formData.trno })
//     };

//     try {
//       const response = await apiClient.post('/quotations', quotationData);
//       if (response.data.success) {
//         toast.success('Quotation created!');
//         navigate('/admin/quotation-list');
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to save');
//     }
//   };

//   return (
//     <div className="mx-auto m-4 sm:mt-14 p-2 max-w-7xl">
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h1 className="mb-6 text-2xl font-bold text-gray-800">Create Quotation</h1>

//         <form onSubmit={e => e.preventDefault()} className="space-y-6">

//           {/* Top Row */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 TRNO <span className="text-xs text-gray-500">(Optional)</span>
//               </label>
//               <input
//                 type="text"
//                 name="trno"
//                 value={formData.trno}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 placeholder="Auto-generated"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
//               <select
//                 name="doctorName"
//                 value={formData.doctorName}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 disabled={loadingDoctors}
//               >
//                 <option value="">{loadingDoctors ? 'Loading...' : 'Select Doctor'}</option>
//                 {doctors.map(d => (
//                   <option key={d._id} value={`${d.fullName} (${d.doctorId})`}>
//                     {d.fullName} ({d.doctorId}) - {d.specialization?.join(', ') || 'N/A'}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Area</label>
//               <input
//                 type="text"
//                 name="area"
//                 value={formData.area}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           </div>

//           {/* Middle Row */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Quotation Date</label>
//               <input
//                 type="date"
//                 name="quotationDate"
//                 value={formData.quotationDate}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Membership Type
//                 {membershipTypeLocked && <span className="ml-2 text-xs text-green-600">(Auto)</span>}
//               </label>
//               <select
//                 name="membershipType"
//                 value={formData.membershipType}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full border rounded-md p-2 ${membershipTypeLocked ? 'bg-green-50 border-green-300 cursor-not-allowed' : 'border-gray-300'}`}
//                 disabled={membershipTypeLocked}
//               >
//                 <option value="">Select</option>
//                 <option value="INDIVIDUAL MEMBERSHIP">INDIVIDUAL MEMBERSHIP</option>
//                 <option value="HOSPITAL MEMBERSHIP">HOSPITAL MEMBERSHIP</option>
//                 <option value="HOSPITAL + INDIVIDUAL MEMBERSHIP">HOSPITAL + INDIVIDUAL</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Specialization</label>
//               <input
//                 type="text"
//                 value={formData.specialization}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
//                 disabled
//               />
//             </div>
//           </div>

//           {/* Narration */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Narration</label>
//             <input
//               type="text"
//               name="narration"
//               value={formData.narration}
//               onChange={handleChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>

//           {/* Membership Years */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Membership Year</label>
//             <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
//               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => {
//                 const y = year.toString();
//                 return (
//                   <label key={year} className="flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name={`year_${y}`}
//                       checked={selectedYears.includes(y)}
//                       onChange={handleChange}
//                       className="mr-2 w-5 h-5 accent-[#15BBB3] rounded"
//                     />
//                     <span className="text-sm">{year} Year</span>
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Monthly & Indemnity */}
//           <div className="flex gap-6">
//             <label className="flex items-center">
//               <input type="checkbox" name="monthly" checked={formData.monthly} onChange={handleChange} className="mr-2 w-5 h-5 accent-[#15BBB3]" />
//               <span className="text-sm">Monthly Payment</span>
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" name="indemnityCover" checked={formData.indemnityCover} onChange={handleChange} className="mr-2 w-5 h-5 accent-[#15BBB3]" />
//               <span className="text-sm">Indemnity Cover</span>
//             </label>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-wrap gap-3">
//             <button type="button" onClick={() => alert('Add Doctor')} className="bg-[#15BBB3] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#13a89e]">
//               <span className="text-xl">+</span> Add Doctor
//             </button>
//             <button type="button" onClick={handlePreview} className="bg-[#15BBB3] text-white px-6 py-2 rounded-lg hover:bg-[#13a89e]">
//               Preview
//             </button>
//             <button type="button" onClick={handleGeneratePDF} className="bg-[#15BBB3] text-white px-6 py-2 rounded-lg hover:bg-[#13a89e]">
//               Generate PDF
//             </button>
//           </div>
//         </form>

//         {/* PREVIEW TABLE */}
//         {isPreview && (
//           <div className="mt-10 border-t pt-8">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview Quotation</h2>
//             <PricePreviewTable
//               membershipType={formData.membershipType}
//               selectedYears={selectedYears}
//               showMonthly={formData.monthly}
//               packages={packages}
//               specialization={formData.specialization}
//               setPriceMatrix={setPriceMatrix}
//               onEdit={handleEdit}
//               onSave={handleSave}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ==================== DYNAMIC PRICE TABLE ====================
// const PricePreviewTable = ({ 
//   membershipType, 
//   selectedYears, 
//   showMonthly, 
//   packages, 
//   specialization, 
//   setPriceMatrix, 
//   onEdit, 
//   onSave 
// }) => {
//   const [localMatrix, setLocalMatrix] = useState([]);

//   // Format number with Indian commas
//   const formatNumber = (num) => {
//     if (num === null || num === undefined || num === '—') return '—';
//     return Number(num).toLocaleString('en-IN');
//   };

//   // Parse formatted number back to raw
//   const parseNumber = (str) => {
//     if (!str || str === '—') return '—';
//     return str.replace(/,/g, '');
//   };

//   useEffect(() => {
//     if (!packages.length || selectedYears.length === 0) {
//       setLocalMatrix([]);
//       setPriceMatrix([]);
//       return;
//     }

//     const normalizeYear = (yearStr) => {
//       if (!yearStr) return null;
//       if (yearStr.toLowerCase().includes('month')) return 'monthly';
//       const match = yearStr.match(/(\d+)/);
//       return match ? match[1] : null;
//     };

//     const getChargeForYear = (yearlyCharges, targetYear) => {
//       if (!yearlyCharges || !Array.isArray(yearlyCharges)) return null;
//       const chargeObj = yearlyCharges.find(c => c.year === targetYear);
//       return chargeObj ? chargeObj.charge : null;
//     };

//     const grouped = {};

//     packages.forEach(pkg => {
//       const normYear = normalizeYear(pkg.year);
//       if (!normYear) return;

//       const typeMatch = pkg.detail?.toLowerCase() === 'doctors' ||
//                         membershipType.toLowerCase().includes(pkg.detail?.toLowerCase());

//       const isSelectedYear = selectedYears.includes(normYear);
//       const isMonthly = showMonthly && normYear === 'monthly';

//       if (!typeMatch || (!isSelectedYear && !isMonthly)) return;

//       const key = pkg.indemnity;
//       if (!grouped[key]) grouped[key] = { indemnity: pkg.indemnity };

//       if (normYear === 'monthly') {
//         const amount = pkg.amount.replace('₹', '').replace(/,/g, '').trim();
//         grouped[key].monthly = amount;
//       } else {
//         const packageYear = parseInt(normYear);
//         const charges = pkg.yearlyCharges || [];

//         selectedYears.forEach(y => {
//           const yearNum = parseInt(y);
//           if (yearNum <= packageYear) {
//             const charge = getChargeForYear(charges, yearNum);
//             if (charge !== null) {
//               grouped[key][`y${y}`] = charge;
//             }
//           }
//         });
//       }
//     });

//     let matrix = Object.values(grouped);

//     if (matrix.length === 0) {
//       matrix = [{
//         indemnity: 'No packages found',
//         ...selectedYears.reduce((acc, y) => ({ ...acc, [`y${y}`]: '—' }), {}),
//         ...(showMonthly && { monthly: '—' })
//       }];
//     } else {
//       matrix = matrix.map(row => {
//         const filled = { ...row };
//         selectedYears.forEach(y => {
//           if (!( `y${y}` in filled )) filled[`y${y}`] = '—';
//         });
//         if (showMonthly && !('monthly' in filled)) filled.monthly = '—';
//         return filled;
//       });
//     }

//     setLocalMatrix(matrix);
//     setPriceMatrix(matrix);
//   }, [packages, membershipType, selectedYears, showMonthly, setPriceMatrix]);

//   const updateCell = (i, field, val) => {
//     const updated = [...localMatrix];
//     updated[i][field] = parseNumber(val);
//     setLocalMatrix(updated);
//     setPriceMatrix(updated);
//   };

//   const headers = [
//     ...(showMonthly ? [{ key: 'monthly', label: 'Monthly' }] : []),
//     ...selectedYears.map(y => ({ key: `y${y}`, label: `${y} Year` }))
//   ];

//   return (
//     <>
//       <div className="overflow-x-auto border border-gray-300 rounded-lg">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold border-r">Type</th>
//               <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold border-r">Specialization</th>
//               <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold border-r">Indemnity</th>
//               {headers.map(h => (
//                 <th key={h.key} className="px-4 py-3 text-left text-sm font-semibold border-r">{h.label}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {localMatrix.map((row, i) => (
//               <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
//                 {i === 0 && (
//                   <>
//                     <td rowSpan={localMatrix.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
//                       {membershipType}
//                     </td>
//                     <td rowSpan={localMatrix.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
//                       {specialization || 'All'}
//                     </td>
//                   </>
//                 )}
//                 <td className="px-4 py-3 text-sm border-r">{row.indemnity}</td>
//                 {showMonthly && (
//                   <td className="px-4 py-3 border-r">
//                     <input
//                       type="text"
//                       value={formatNumber(row.monthly)}
//                       onChange={e => updateCell(i, 'monthly', e.target.value)}
//                       className="w-full border rounded px-1 py-0.5 text-sm focus:ring-[#15BBB3]"
//                     />
//                   </td>
//                 )}
//                 {selectedYears.map(y => (
//                   <td key={`y${y}`} className="px-4 py-3 border-r">
//                     <input
//                       type="text"
//                       value={formatNumber(row[`y${y}`])}
//                       onChange={e => updateCell(i, `y${y}`, e.target.value)}
//                       className="w-full border rounded px-1 py-0.5 text-sm focus:ring-[#15BBB3]"
//                     />
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-end gap-3 mt-6">
//         <button onClick={onEdit} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Edit</button>
//         <button onClick={onSave} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Save</button>
//       </div>
//     </>
//   );
// };

// export default CreateQuotation;




















































// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const CreateQuotation = () => {
//   const [isPreview, setIsPreview] = useState(false);
//   const [doctors, setDoctors] = useState([]);
//   const [packages, setPackages] = useState([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(true);
//   const [membershipTypeLocked, setMembershipTypeLocked] = useState(false);
//   const [selectedYears, setSelectedYears] = useState([]);
//   const [priceMatrix, setPriceMatrix] = useState([]);

//   const [formData, setFormData] = useState({
//     trno: '',
//     quotationDate: new Date().toISOString().split('T')[0],
//     doctorId: '',
//     doctorName: '',
//     membershipType: 'INDIVIDUAL MEMBERSHIP',
//     specialization: '',
//     area: 'All India',
//     narration: '',
//     monthly: false,
//     indemnityCover: false,
//   });

//   const navigate = useNavigate();

//   // === FETCH DOCTORS ===
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         setLoadingDoctors(true);
//         const response = await apiClient.get('/doctors', { params: { limit: 1000 } });
//         setDoctors(response.data.data || []);
//       } catch (error) {
//         toast.error('Failed to load doctors');
//       } finally {
//         setLoadingDoctors(false);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   // === FETCH PACKAGES ===
//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         const response = await apiClient.get('/service-packages/list');
//         const data = response.data.data || [];
//         setPackages(data);
//       } catch (error) {
//         toast.error('Failed to load packages');
//       }
//     };
//     fetchPackages();
//   }, []);

//   // === HANDLE CHANGE ===
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name === 'doctorName') {
//       const selectedDoctor = doctors.find(d =>
//         d.doctorId === value || `${d.fullName} (${d.doctorId})` === value
//       );

//       if (selectedDoctor) {
//         let mType = 'INDIVIDUAL MEMBERSHIP';
//         if (selectedDoctor.doctorType === 'hospital') mType = 'HOSPITAL MEMBERSHIP';
//         else if (selectedDoctor.doctorType === 'hospital_individual') mType = 'HOSPITAL + INDIVIDUAL MEMBERSHIP';

//         setFormData({
//           ...formData,
//           doctorId: selectedDoctor._id,
//           doctorName: value,
//           membershipType: mType,
//           specialization: selectedDoctor.specialization?.join(', ') || 'N/A',
//         });
//         setMembershipTypeLocked(true);
//       } else {
//         setFormData({ ...formData, doctorId: '', doctorName: value, membershipType: 'INDIVIDUAL MEMBERSHIP', specialization: '' });
//         setMembershipTypeLocked(false);
//       }
//     } 
//     else if (name.startsWith('year_')) {
//       const year = name.split('_')[1];
//       setSelectedYears(prev =>
//         prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year].sort((a, b) => a - b)
//       );
//     }
//     else {
//       if (name === 'membershipType' && membershipTypeLocked) {
//         toast.info('Membership type is auto-selected');
//         return;
//       }
//       setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
//     }
//   };

//   // === PREVIEW & SAVE ===
//   const handlePreview = () => {
//     if (!formData.doctorName) {
//       toast.error('Please select a doctor');
//       return;
//     }
//     if (selectedYears.length === 0) {
//       toast.error('Select at least one year');
//       return;
//     }
//     setIsPreview(true);
//   };

//   const handleEdit = () => setIsPreview(false);

//   const handleSave = async () => {
//     console.log('handleSave called'); // Debug log
//     console.log('formData:', formData); // Debug log
//     console.log('priceMatrix:', priceMatrix); // Debug log
//     console.log('selectedYears:', selectedYears); // Debug log

//     if (!formData.doctorId) {
//       toast.error('Select a doctor');
//       return;
//     }

//     if (!priceMatrix || priceMatrix.length === 0 || priceMatrix[0].indemnity === 'No packages found') {
//       toast.error('No pricing data to save');
//       return;
//     }

//     const requesterType = formData.membershipType.includes('HOSPITAL') ? 'hospital' : 'doctor';

//     const requestDetails = {
//       policyTerms: selectedYears.map(Number),
//       paymentFrequency: formData.monthly ? 'monthly' : 'yearly',
//       additionalRequirements: formData.narration,
//       specialConditions: formData.indemnityCover ? 'Indemnity Cover Required' : '',
//       items: priceMatrix.map(row => {
//         const item = { indemnity: row.indemnity };
//         selectedYears.forEach(y => {
//           const val = row[`y${y}`];
//           if (val && val !== '—') {
//             // Check if val is a string before calling replace
//             const processedVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
//             item[`year_${y}`] = Number(processedVal);
//           }
//         });
//         if (formData.monthly && row.monthly && row.monthly !== '—') {
//           // Check if row.monthly is a string before calling replace
//           const processedMonthly = typeof row.monthly === 'string' ? row.monthly.replace(/,/g, '') : row.monthly;
//           item.monthly = Number(processedMonthly);
//         }
//         return item;
//       })
//     };

//     const quotationData = {
//       requester: {
//         type: requesterType,
//         name: formData.doctorName.split(' (')[0],
//         entityId: formData.doctorId,
//         contactPerson: formData.doctorName.split(' (')[0]
//       },
//       requestDetails,
//       status: 'responses_pending',
//       priority: 'medium',
//       ...(formData.trno && { trno: formData.trno })
//     };

//     console.log('Sending quotationData:', quotationData); // Debug log

//     try {
//       const response = await apiClient.post(apiEndpoints.quotations.create, quotationData);
//       console.log('API Response:', response); // Debug log
//       if (response.data.success) {
//         toast.success('Quotation created!');
//         navigate('/admin/quotation-list');
//       }
//     } catch (error) {
//       console.error('Error creating quotation:', error);
//       console.error('Error response:', error.response); // Debug log
//       toast.error(error.response?.data?.message || 'Failed to save quotation');
//     }
//   };

//   return (
//     <div className="mx-auto m-4 sm:mt-14 p-2 max-w-7xl">
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h1 className="mb-6 text-2xl font-bold text-gray-800">Create Quotation</h1>

//         <form onSubmit={e => e.preventDefault()} className="space-y-6">

//           {/* Top Row */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 TRNO <span className="text-xs text-gray-500">(Optional)</span>
//               </label>
//               <input
//                 type="text"
//                 name="trno"
//                 value={formData.trno}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 placeholder="Auto-generated"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
//               <select
//                 name="doctorName"
//                 value={formData.doctorName}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                 disabled={loadingDoctors}
//               >
//                 <option value="">{loadingDoctors ? 'Loading...' : 'Select Doctor'}</option>
//                 {doctors.map(d => (
//                   <option key={d._id} value={`${d.fullName} (${d.doctorId})`}>
//                     {d.fullName} ({d.doctorId}) - {d.specialization?.join(', ') || 'N/A'}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Area</label>
//               <input
//                 type="text"
//                 name="area"
//                 value={formData.area}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           </div>

//           {/* Middle Row */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Quotation Date</label>
//               <input
//                 type="date"
//                 name="quotationDate"
//                 value={formData.quotationDate}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Membership Type
//                 {membershipTypeLocked && <span className="ml-2 text-xs text-green-600">(Auto)</span>}
//               </label>
//               <select
//                 name="membershipType"
//                 value={formData.membershipType}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full border rounded-md p-2 ${membershipTypeLocked ? 'bg-green-50 border-green-300 cursor-not-allowed' : 'border-gray-300'}`}
//                 disabled={membershipTypeLocked}
//               >
//                 <option value="">Select</option>
//                 <option value="INDIVIDUAL MEMBERSHIP">INDIVIDUAL MEMBERSHIP</option>
//                 <option value="HOSPITAL MEMBERSHIP">HOSPITAL MEMBERSHIP</option>
//                 <option value="HOSPITAL + INDIVIDUAL MEMBERSHIP">HOSPITAL + INDIVIDUAL</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Specialization</label>
//               <input
//                 type="text"
//                 value={formData.specialization}
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
//                 disabled
//               />
//             </div>
//           </div>

//           {/* Narration */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Narration</label>
//             <input
//               type="text"
//               name="narration"
//               value={formData.narration}
//               onChange={handleChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>

//           {/* Membership Years */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Membership Year</label>
//             <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
//               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => {
//                 const y = year.toString();
//                 return (
//                   <label key={year} className="flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name={`year_${y}`}
//                       checked={selectedYears.includes(y)}
//                       onChange={handleChange}
//                       className="mr-2 w-5 h-5 accent-[#15BBB3] rounded"
//                     />
//                     <span className="text-sm">{year} Year</span>
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Monthly & Indemnity */}
//           <div className="flex gap-6">
//             <label className="flex items-center">
//               <input type="checkbox" name="monthly" checked={formData.monthly} onChange={handleChange} className="mr-2 w-5 h-5 accent-[#15BBB3]" />
//               <span className="text-sm">Monthly Payment</span>
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" name="indemnityCover" checked={formData.indemnityCover} onChange={handleChange} className="mr-2 w-5 h-5 accent-[#15BBB3]" />
//               <span className="text-sm">Indemnity Cover</span>
//             </label>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-wrap gap-3">
//             <button type="button" onClick={() => alert('Add Doctor')} className="bg-[#15BBB3] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#13a89e]">
//               <span className="text-xl">+</span> Add Doctor
//             </button>
//             <button type="button" onClick={handlePreview} className="bg-[#15BBB3] text-white px-6 py-2 rounded-lg hover:bg-[#13a89e]">
//               Preview
//             </button>
//             <button type="button" onClick={() => toast.info('PDF coming soon!')} className="bg-[#15BBB3] text-white px-6 py-2 rounded-lg hover:bg-[#13a89e]">
//               Generate PDF
//             </button>
//           </div>
//         </form>

//         {/* PREVIEW TABLE */}
//         {isPreview && (
//           <div className="mt-10 border-t pt-8">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview Quotation</h2>
//             <PricePreviewTable
//               membershipType={formData.membershipType}
//               selectedYears={selectedYears}
//               showMonthly={formData.monthly}
//               packages={packages}
//               specialization={formData.specialization}
//               setPriceMatrix={setPriceMatrix}
//               onEdit={handleEdit}
//               onSave={handleSave}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ==================== PRICE PREVIEW TABLE ====================
// const PricePreviewTable = ({ 
//   membershipType, 
//   selectedYears, 
//   showMonthly, 
//   packages, 
//   specialization, 
//   setPriceMatrix, 
//   onEdit, 
//   onSave 
// }) => {
//   const [localMatrix, setLocalMatrix] = useState([]);

//   // Format & Parse
//   const formatNumber = (num) => (num === null || num === undefined || num === '—') ? '—' : Number(num).toLocaleString('en-IN');
//   const parseNumber = (str) => (!str || str === '—') ? '—' : str.replace(/,/g, '');

//   useEffect(() => {
//     if (!packages.length || selectedYears.length === 0) {
//       setLocalMatrix([]);
//       setPriceMatrix([]);
//       return;
//     }

//     const normalizeYear = (yearStr) => {
//       if (!yearStr) return null;
//       if (yearStr.toLowerCase().includes('month')) return 'monthly';
//       const match = yearStr.match(/(\d+)/);
//       return match ? match[1] : null;
//     };

//     const getChargeForYear = (yearlyCharges, targetYear) => {
//       if (!yearlyCharges || !Array.isArray(yearlyCharges)) return null;
//       const chargeObj = yearlyCharges.find(c => c.year === targetYear);
//       return chargeObj ? chargeObj.charge : null;
//     };

//     const grouped = {};

//     packages.forEach(pkg => {
//       const normYear = normalizeYear(pkg.year);
//       if (!normYear) return;

//       const typeMatch = pkg.detail?.toLowerCase() === 'doctors' ||
//                         membershipType.toLowerCase().includes(pkg.detail?.toLowerCase());

//       // Monthly
//       if (normYear === 'monthly') {
//         if (showMonthly && typeMatch) {
//           const key = pkg.indemnity;
//           if (!grouped[key]) grouped[key] = { indemnity: pkg.indemnity };
//           const amount = pkg.amount.replace('₹', '').replace(/,/g, '').trim();
//           grouped[key].monthly = Math.min(grouped[key].monthly || Infinity, Number(amount));
//         }
//         return;
//       }

//       const packageYear = parseInt(normYear);
//       if (isNaN(packageYear)) return;

//       const coversAnySelectedYear = selectedYears.some(y => parseInt(y) <= packageYear);
//       if (!typeMatch || !coversAnySelectedYear) return;

//       const key = pkg.indemnity;
//       if (!grouped[key]) grouped[key] = { indemnity: pkg.indemnity };

//       selectedYears.forEach(y => {
//         const yearNum = parseInt(y);
//         if (yearNum <= packageYear) {
//           const charge = getChargeForYear(pkg.yearlyCharges, yearNum);
//           if (charge !== null) {
//             const existing = grouped[key][`y${y}`] || Infinity;
//             grouped[key][`y${y}`] = Math.min(existing, charge);
//           }
//         }
//       });
//     });

//     let matrix = Object.values(grouped).map(row => {
//       const filled = { ...row };
//       selectedYears.forEach(y => {
//         if (!(`y${y}` in filled)) filled[`y${y}`] = '—';
//       });
//       if (showMonthly && !('monthly' in filled)) filled.monthly = '—';
//       return filled;
//     });

//     if (matrix.length === 0) {
//       matrix = [{
//         indemnity: 'No packages found',
//         ...selectedYears.reduce((acc, y) => ({ ...acc, [`y${y}`]: '—' }), {}),
//         ...(showMonthly && { monthly: '—' })
//       }];
//     }

//     setLocalMatrix(matrix);
//     setPriceMatrix(matrix);
//   }, [packages, membershipType, selectedYears, showMonthly, setPriceMatrix]);

//   const updateCell = (i, field, val) => {
//     const updated = [...localMatrix];
//     updated[i][field] = parseNumber(val);
//     setLocalMatrix(updated);
//     setPriceMatrix(updated);
//   };

//   const headers = [
//     ...(showMonthly ? [{ key: 'monthly', label: 'Monthly' }] : []),
//     ...selectedYears.map(y => ({ key: `y${y}`, label: `${y} Year` }))
//   ];

//   return (
//     <>
//       <div className="overflow-x-auto border border-gray-300 rounded-lg">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold border-r">Type</th>
//               <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold border-r">Specialization</th>
//               <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold border-r">Indemnity</th>
//               {headers.map(h => (
//                 <th key={h.key} className="px-4 py-3 text-left text-sm font-semibold border-r">{h.label}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {localMatrix.map((row, i) => (
//               <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
//                 {i === 0 && (
//                   <>
//                     <td rowSpan={localMatrix.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
//                       {membershipType}
//                     </td>
//                     <td rowSpan={localMatrix.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
//                       {specialization || 'All'}
//                     </td>
//                   </>
//                 )}
//                 <td className="px-4 py-3 text-sm border-r">{row.indemnity}</td>
//                 {showMonthly && (
//                   <td className="px-4 py-3 border-r">
//                     <input
//                       type="text"
//                       value={formatNumber(row.monthly)}
//                       onChange={e => updateCell(i, 'monthly', e.target.value)}
//                       className="w-full border rounded px-1 py-0.5 text-sm focus:ring-[#15BBB3]"
//                     />
//                   </td>
//                 )}
//                 {selectedYears.map(y => (
//                   <td key={`y${y}`} className="px-4 py-3 border-r">
//                     <input
//                       type="text"
//                       value={formatNumber(row[`y${y}`])}
//                       onChange={e => updateCell(i, `y${y}`, e.target.value)}
//                       className="w-full border rounded px-1 py-0.5 text-sm focus:ring-[#15BBB3]"
//                     />
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-end gap-3 mt-6">
//         <button onClick={onEdit} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Edit</button>
//         <button onClick={onSave} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Save</button>
//       </div>
//     </>
//   );
// };

// export default CreateQuotation;







































































import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from 'react-toastify';

const CreateQuotation = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [membershipTypeLocked, setMembershipTypeLocked] = useState(false);
  const [selectedYears, setSelectedYears] = useState([]);
  const [priceMatrix, setPriceMatrix] = useState([]); // Final data for save

  const [formData, setFormData] = useState({
    trno: '',
    quotationDate: new Date().toISOString().split('T')[0],
    doctorId: '',
    doctorName: '',
    membershipType: 'INDIVIDUAL MEMBERSHIP',
    specialization: '',
    area: 'All India',
    narration: '',
    monthly: false,
    indemnityCover: false,
  });

  const navigate = useNavigate();

  // Fetch Doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await apiClient.get('/doctors', { params: { limit: 1000 } });
        setDoctors(response.data.data || []);
      } catch (error) {
        toast.error('Failed to load doctors');
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch Packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await apiClient.get('/service-packages/list');
        setPackages(response.data.data || []);
      } catch (error) {
        toast.error('Failed to load packages');
      }
    };
    fetchPackages();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'doctorName') {
      const selectedDoctor = doctors.find(d =>
        d.doctorId === value || `${d.fullName} (${d.doctorId})` === value
      );

      if (selectedDoctor) {
        let mType = 'INDIVIDUAL MEMBERSHIP';
        if (selectedDoctor.doctorType === 'hospital') mType = 'HOSPITAL MEMBERSHIP';
        else if (selectedDoctor.doctorType === 'hospital_individual') mType = 'HOSPITAL + INDIVIDUAL MEMBERSHIP';

        setFormData({
          ...formData,
          doctorId: selectedDoctor._id,
          doctorName: value,
          membershipType: mType,
          specialization: selectedDoctor.specialization?.join(', ') || 'N/A',
        });
        setMembershipTypeLocked(true);
      } else {
        setFormData({ ...formData, doctorId: '', doctorName: value, membershipType: 'INDIVIDUAL MEMBERSHIP', specialization: '' });
        setMembershipTypeLocked(false);
      }
    } 
    else if (name.startsWith('year_')) {
      const year = name.split('_')[1];
      setSelectedYears(prev =>
        prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year].sort((a, b) => a - b)
      );
    }
    else {
      if (name === 'membershipType' && membershipTypeLocked) {
        toast.info('Membership type is auto-selected');
        return;
      }
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handlePreview = () => {
    if (!formData.doctorName) {
      toast.error('Please select a doctor');
      return;
    }
    if (selectedYears.length === 0) {
      toast.error('Select at least one year');
      return;
    }
    setIsPreview(true);
  };

  const handleEdit = () => setIsPreview(false);

  const handleGeneratePDF = () => {
    if (!formData.doctorId) {
      toast.error('Please select a doctor before generating PDF');
      return;
    }

    if (!priceMatrix || priceMatrix.length === 0 || priceMatrix[0].indemnity === 'No packages found') {
      toast.error('No pricing data available for PDF generation');
      return;
    }

    // Prepare data to pass to the invoice preview page
    const invoiceData = {
      membershipType: formData.membershipType,
      doctorData: {
        name: formData.doctorName.split(' (')[0],
      },
      hospitalData: {
        name: formData.doctorName.split(' (')[0],
        address: formData.area,
      },
      membershipData: {
        specialization: formData.specialization,
        indemnityCover: priceMatrix[0]?.indemnity || 'N/A',
        monthly: priceMatrix[0]?.monthly || 'N/A',
        yearly: selectedYears.length > 0 ? priceMatrix[0]?.[`y${selectedYears[0]}`] || 'N/A' : 'N/A',
        fiveYear: selectedYears.length > 4 ? priceMatrix[0]?.[`y5`] || 'N/A' : 'N/A',
        numberOfBeds: 'N/A',
      }
    };

    // Navigate to the invoice preview page with membership type as URL parameter
    const url = `/admin/invoice-preview?type=${encodeURIComponent(formData.membershipType)}`;
    window.open(url, '_blank');
  };

  const handleSave = async () => {
    if (!formData.doctorId) {
      toast.error('Select a doctor');
      return;
    }

    if (!priceMatrix || priceMatrix.length === 0 || priceMatrix[0]?.disabled) {
      toast.error('No pricing data to save');
      return;
    }

    const requesterType = formData.membershipType.includes('HOSPITAL') ? 'hospital' : 'doctor';

    const requestDetails = {
      policyTerms: selectedYears.map(Number),
      paymentFrequency: formData.monthly ? 'monthly' : 'yearly',
      additionalRequirements: formData.narration,
      specialConditions: formData.indemnityCover ? 'Indemnity Cover Required' : '',
      items: priceMatrix.map(row => {
        const item = { indemnity: row.indemnity || 'Custom' };
        selectedYears.forEach(y => {
          const val = row[`y${y}`];
          if (val != null && val !== '') item[`year_${y}`] = Number(val);
        });
        if (formData.monthly && row.monthly != null && row.monthly !== '') {
          item.monthly = Number(row.monthly);
        }
        return item;
      }).filter(item => Object.keys(item).length > 1) // Remove empty items
    };

    const quotationData = {
      requester: {
        type: requesterType,
        name: formData.doctorName.split(' (')[0],
        entityId: formData.doctorId,
        contactPerson: formData.doctorName.split(' (')[0]
      },
      requestDetails,
      status: 'responses_pending',
      priority: 'medium',
      ...(formData.trno && { trno: formData.trno })
    };

    try {
      const response = await apiClient.post(apiEndpoints.quotations.create, quotationData);
      if (response.data.success) {
        toast.success('Quotation created successfully!');
        navigate('/admin/quotation-list');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save quotation');
    }
  };

  return (
    <div className="mx-auto m-4 sm:mt-14 p-2 max-w-7xl">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Create Quotation</h1>

        <form onSubmit={e => e.preventDefault()} className="space-y-6">

          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                TRNO <span className="text-xs text-gray-500">(Optional)</span>
              </label>
              <input type="text" name="trno" value={formData.trno} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Auto-generated" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
              <select name="doctorName" value={formData.doctorName} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" disabled={loadingDoctors}>
                <option value="">{loadingDoctors ? 'Loading...' : 'Select Doctor'}</option>
                {doctors.map(d => (
                  <option key={d._id} value={`${d.fullName} (${d.doctorId})`}>
                    {d.fullName} ({d.doctorId}) - {d.specialization?.join(', ') || 'N/A'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Area</label>
              <input type="text" name="area" value={formData.area} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quotation Date</label>
              <input type="date" name="quotationDate" value={formData.quotationDate} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Membership Type {membershipTypeLocked && <span className="ml-2 text-xs text-green-600">(Auto)</span>}
              </label>
              <select name="membershipType" value={formData.membershipType} onChange={handleChange}
                className={`mt-1 block w-full border rounded-md p-2 ${membershipTypeLocked ? 'bg-green-50 border-green-300 cursor-not-allowed' : 'border-gray-300'}`}
                disabled={membershipTypeLocked}>
                <option value="">Select</option>
                <option value="INDIVIDUAL MEMBERSHIP">INDIVIDUAL MEMBERSHIP</option>
                <option value="HOSPITAL MEMBERSHIP">HOSPITAL MEMBERSHIP</option>
                <option value="HOSPITAL + INDIVIDUAL MEMBERSHIP">HOSPITAL + INDIVIDUAL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input type="text" value={formData.specialization} disabled
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Narration</label>
            <input type="text" name="narration" value={formData.narration} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Membership Year</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => (
                <label key={year} className="flex items-center cursor-pointer">
                  <input type="checkbox" name={`year_${year}`} checked={selectedYears.includes(year.toString())}
                    onChange={handleChange} className="mr-2 w-5 h-5 accent-[#15BBB3] rounded" />
                  <span className="text-sm">{year} Year</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center">
              <input type="checkbox" name="monthly" checked={formData.monthly} onChange={handleChange}
                className="mr-2 w-5 h-5 accent-[#15BBB3]" />
              <span className="text-sm">Monthly Payment</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="indemnityCover" checked={formData.indemnityCover} onChange={handleChange}
                className="mr-2 w-5 h-5 accent-[#15BBB3]" />
              <span className="text-sm">Indemnity Cover</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handlePreview}
              className="bg-[#15BBB3] text-white px-6 py-2 rounded-lg hover:bg-[#13a89e]">
              Preview
            </button>
            <button
              type="button"
              onClick={handleGeneratePDF}
              className="bg-[#15BBB3] text-white px-6 py-2 rounded-lg hover:bg-[#13a89e]"
            >
              Generate PDF
            </button>
          </div>
        </form>

        {/* PREVIEW TABLE */}
        {isPreview && (
          <div className="mt-10 border-t pt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview Quotation</h2>
            <PricePreviewTable
              membershipType={formData.membershipType}
              selectedYears={selectedYears}
              showMonthly={formData.monthly}
              packages={packages}
              specialization={formData.specialization}
              setPriceMatrix={setPriceMatrix}
              onEdit={handleEdit}
              onSave={handleSave}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== FINAL PRICE PREVIEW TABLE (100% WORKING) ====================
const PricePreviewTable = ({ 
  membershipType, 
  selectedYears, 
  showMonthly, 
  packages, 
  specialization, 
  setPriceMatrix, 
  onEdit, 
  onSave 
}) => {
  const [rows, setRows] = useState([]);

  const formatNumber = (num) => (num == null || num === '') ? '' : Number(num).toLocaleString('en-IN');
  const parseNumber = (str) => str === '' ? null : Number(str.replace(/,/g, ''));

  useEffect(() => {
    if (!packages.length || selectedYears.length === 0) {
      setRows([]);
      setPriceMatrix([]);
      return;
    }

    const normalizeYear = (yearStr) => {
      if (!yearStr) return null;
      if (yearStr.toLowerCase().includes('month')) return 'monthly';
      const match = yearStr.match(/(\d+)/);
      return match ? match[1] : null;
    };

    const getChargeForYear = (yearlyCharges, targetYear) => {
      if (!yearlyCharges || !Array.isArray(yearlyCharges)) return null;
      const chargeObj = yearlyCharges.find(c => c.year === targetYear);
      return chargeObj ? chargeObj.charge : null;
    };

    const newRows = [];

    packages.forEach(pkg => {
      const normYear = normalizeYear(pkg.year);
      if (!normYear) return;

      const typeMatch = pkg.detail?.toLowerCase() === 'doctors' ||
                        membershipType.toLowerCase().includes(pkg.detail?.toLowerCase()) ||
                        pkg.detail?.toLowerCase().includes('all');

      if (!typeMatch) return;

      const row = {
        id: pkg._id + '_' + Date.now(),
        indemnity: pkg.indemnity,
        packageId: pkg._id,
      };

      if (normYear === 'monthly' && showMonthly) {
        const amount = pkg.amount.replace('₹', '').replace(/,/g, '').trim();
        row.monthly = Number(amount);
      }

      const packageYear = parseInt(normYear);
      if (!isNaN(packageYear)) {
        selectedYears.forEach(y => {
          const yearNum = parseInt(y);
          if (yearNum <= packageYear) {
            const charge = getChargeForYear(pkg.yearlyCharges, yearNum);
            if (charge !== null) row[`y${y}`] = charge;
          }
        });
      }

      const hasValue = showMonthly ? row.monthly : false || selectedYears.some(y => row[`y${y}`] != null);
      if (hasValue) newRows.push(row);
    });

    if (newRows.length === 0) {
      newRows.push({ id: 'no-data', indemnity: 'No packages found for selected criteria', disabled: true });
    }

    setRows(newRows);
    setPriceMatrix(newRows.filter(r => !r.disabled));
  }, [packages, membershipType, selectedYears, showMonthly, setPriceMatrix]);

  const updateRow = (id, field, value) => {
    const updated = rows.map(row => row.id === id ? { ...row, [field]: parseNumber(value) || '' } : row);
    setRows(updated);
    setPriceMatrix(updated.filter(r => !r.disabled));
  };

  const deleteRow = (id) => {
    const updated = rows.filter(row => row.id !== id);
    setRows(updated);
    setPriceMatrix(updated.filter(r => !r.disabled));
  };

  const addCustomRow = () => {
    const newRow = {
      id: 'custom_' + Date.now(),
      indemnity: 'Custom Limit',
      isCustom: true,
      monthly: null,
      ...selectedYears.reduce((acc, y) => ({ ...acc, [`y${y}`]: null }), {})
    };
    setRows([...rows.filter(r => !r.disabled), newRow]);
    setPriceMatrix(prev => [...prev, newRow]);
  };

  return (
    <>
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r">Specialization</th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r">Indemnity Limit</th>
              {showMonthly && <th className="px-4 py-3 text-left text-sm font-semibold border-r">Monthly</th>}
              {selectedYears.map(y => (
                <th key={y} className="px-4 py-3 text-left text-sm font-semibold border-r">{y} Year</th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-semibold w-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={`${i % 2 === 1 ? 'bg-gray-50' : ''} ${row.disabled ? 'opacity-60' : ''}`}>
                {i === 0 && (
                  <>
                    <td rowSpan={rows.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
                      {membershipType}
                    </td>
                    <td rowSpan={rows.length} className="px-4 py-3 text-sm font-medium border-r align-middle bg-white">
                      {specialization || 'All'}
                    </td>
                  </>
                )}
                <td className="px-4 py-3 border-r">
                  {row.disabled ? (
                    <span className="text-red-600">{row.indemnity}</span>
                  ) : (
                    <input
                      type="text"
                      value={row.indemnity || ''}
                      onChange={(e) => updateRow(row.id, 'indemnity', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-[#15BBB3]"
                      placeholder="e.g. 10 Cr"
                    />
                  )}
                </td>

                {showMonthly && (
                  <td className="px-4 py-3 border-r">
                    <input
                      type="text"
                      disabled={row.disabled}
                      value={formatNumber(row.monthly)}
                      onChange={(e) => updateRow(row.id, 'monthly', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-[#15BBB3]"
                    />
                  </td>
                )}

                {selectedYears.map(y => (
                  <td key={`y${y}`} className="px-4 py-3 border-r">
                    <input
                      type="text"
                      disabled={row.disabled}
                      value={formatNumber(row[`y${y}`])}
                      onChange={(e) => updateRow(row.id, `y${y}`, e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-[#15BBB3]"
                    />
                  </td>
                ))}

                <td className="px-4 py-3 text-center">
                  {!row.disabled && (
                    <button onClick={() => deleteRow(row.id)} className="text-red-600 hover:text-red-800 font-bold text-xl">
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button onClick={addCustomRow} className="text-[#15BBB3] font-medium hover:underline flex items-center gap-2">
          <span className="text-xl">+</span> Add Custom Indemnity Limit
        </button>

        <div className="flex gap-3">
          <button onClick={onEdit} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            Edit Form
          </button>
          <button 
            onClick={onSave}
            disabled={rows.length === 0 || rows.every(r => r.disabled)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Quotation
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateQuotation;