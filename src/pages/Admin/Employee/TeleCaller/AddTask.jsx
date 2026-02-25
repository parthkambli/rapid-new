

// // final

// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';

// const AddTask = () => {
//   const [formData, setFormData] = useState({
//     telecallerName: '',
//     date: new Date().toISOString().split('T')[0],
//     dailyCallTarget: '',
//     salesmen: [],
//     dateRangeFrom: '',
//     dateRangeTo: '',
//     callType: 'All',
//     renewalMonth: '',
//     serviceDateFrom: '',
//     serviceDateTo: '',
//     serviceCallType: 'Close',
//     description: '',
//     priority: 'medium',
//     deadline: ''
//   });

//   const [openSections, setOpenSections] = useState({
//     general: true,
//     callData: false,
//     renewal: false,
//     service: false,
//     additional: false
//   });

//   const [salesmenList, setSalesmenList] = useState([]);
//   const [telecallersList, setTelecallersList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // NAYA ADD KIYA — DOCTORS LIST KE LIYE
//   const [doctorsList, setDoctorsList] = useState([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(false);

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       setLoading(true);
//   //       const [salesmenRes, telecallersRes] = await Promise.all([
//   //         apiClient.get(apiEndpoints.employees.byRole('salesman')),
//   //         apiClient.get(apiEndpoints.employees.byRole('telecaller'))
//   //       ]);

//   //       if (salesmenRes.data.success) setSalesmenList(salesmenRes.data.data);
//   //       if (telecallersRes.data.success) setTelecallersList(telecallersRes.data.data);
//   //     } catch (error) {
//   //       toast.error('Failed to load data');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchData();
//   // }, []);









// // 1. Jab salesmen list fetch karo → user._id bhejna hai, employee._id nahi!
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [salesmenRes, telecallersRes] = await Promise.all([
//         apiClient.get(apiEndpoints.employees.byRole('salesman')),
//         apiClient.get(apiEndpoints.employees.byRole('telecaller'))
//       ]);

//       if (salesmenRes.data.success) {
//         // YEH CHANGE KAR DE — user._id bhejo, employee._id nahi!
//         const salesmenWithUserId = salesmenRes.data.data.map(s => ({
//           ...s,
//           userId: s.user?._id || s.user // agar populated hai to ._id, warna direct
//         }));
//         setSalesmenList(salesmenWithUserId);
//       }
//       if (telecallersRes.data.success) setTelecallersList(telecallersRes.data.data);
//     } catch (error) {
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchData();
// }, []);


//   const toggleSection = (section) => {
//     setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => {
//       if (type === 'checkbox' && name === 'salesmen') {
//         return {
//           ...prev,
//           salesmen: checked ? [...prev.salesmen, value] : prev.salesmen.filter(id => id !== value)
//         };
//       }
//       return { ...prev, [name]: value };
//     });
//   };

//   const handlePriorityChange = (e) => {
//     const map = { 'Normal': 'medium', 'High': 'high' };
//     setFormData(prev => ({ ...prev, priority: map[e.target.value] }));
//   };

//   // YE NAYA FUNCTION — RENEWAL + SERVICE DOCTORS LOAD KAREGA
//   const fetchDoctorsForTask = async () => {
//     if (!formData.telecallerName) return toast.error("Pehle telecaller select karo!");

//     setLoadingDoctors(true);
//     setDoctorsList([]);

//     try {
//       let ids = [];

//       if (formData.renewalMonth) {
//         const [year, month] = formData.renewalMonth.split('-');
//         const res = await apiClient.get(apiEndpoints.salesBills.getRenewalCallsDoctors, {
//           params: { month: parseInt(month), year: parseInt(year) }
//         });
//         if (res.data.success) {
//           ids = res.data.data.map(d => d.doctorId);
//         }
//       }
//       else if (formData.serviceDateFrom && formData.serviceDateTo) {
//         const res = await apiClient.get(apiEndpoints.doctors.closeOnlyIds, {
//           params: { fromDate: formData.serviceDateFrom, toDate: formData.serviceDateTo }
//         });
//         if (res.data.success) {
//           ids = res.data.doctorIds;
//         }
//       }

//       setDoctorsList(ids);
//       toast.success(`${ids.length} doctors loaded!`);
//     } catch (err) {
//       toast.error("Doctors load nahi hue");
//     } finally {
//       setLoadingDoctors(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!formData.telecallerName) return toast.error('Telecaller select karo');
//     if (!formData.description.trim()) return toast.error('Description daalo');


// const [userId, employeeId] = formData.telecallerName.split('|||');
//   if (!userId || !employeeId) return toast.error("Telecaller selection galat hai!");

//     const isRenewal = !!formData.renewalMonth;
//     const isService = !!formData.serviceDateFrom && !!formData.serviceDateTo;

//     if ((isRenewal || isService) && doctorsList.length === 0) {
//       return toast.error("Pehle 'Load Doctors' button dabao!");
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         title: formData.description.substring(0, 100),
//         description: formData.description,
//         taskType: 'call',
//         priority: formData.priority,
//         scheduledDate: new Date(formData.date).toISOString(),
//         // employeeId: formData.telecallerName,
//         // assignedToId: formData.telecallerName,
//         assignedToId: userId,        // ← User ID (D4) → assignedTo me jayega
//     employeeId: employeeId,      // ← Employee ID (D2) → employee field me jayega
//         notes: formData.description,

//         telecallerData: {
//           dailyCallTarget: parseInt(formData.dailyCallTarget) || 0,
//           salesmen: formData.salesmen.length > 0 ? formData.salesmen : undefined,
//           dateRangeFrom: formData.dateRangeFrom || undefined,
//           dateRangeTo: formData.dateRangeTo || undefined,
//           callType: formData.callType,




// useCallEntrySystem: true,   // ← YEHI HAI TERA SUPERPOWER SWITCH


//           // Renewal doctors
//           ...(isRenewal && {
//             renewalCalls: {
//               renewalMonth: formData.renewalMonth,
//               callType: formData.serviceCallType || "Close",
//               doctors: doctorsList
//             }
//           }),

//           // Service doctors
//           ...(isService && {
//             serviceCalls: {
//               serviceType: formData.serviceCallType || "Service",
//               dateRangeFrom: formData.serviceDateFrom,
//               dateRangeTo: formData.serviceDateTo,
//               doctors: doctorsList
//             }
//           }),

//           deadline: formData.deadline || undefined
//         }
//       };

//       // Clean undefined fields
//       Object.keys(payload.telecallerData).forEach(key => {
//         if (payload.telecallerData[key] === undefined) delete payload.telecallerData[key];
//       });

//       await apiClient.post('/tasks', payload);
//       toast.success('Task successfully ban gaya with doctors!');

//       // Reset
//       setFormData({ ...formData, description: '', renewalMonth: '', serviceDateFrom: '', serviceDateTo: '', salesmen: [] });
//       setDoctorsList([]);

//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Task nahi bana');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const CollapsibleSection = React.memo(({ title, sectionKey, children, isOpen, onToggle }) => (
//     <div className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
//       <button type="button" onClick={() => onToggle(sectionKey)} className="w-full px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left">
//         <h3 className="font-semibold text-gray-800 text-lg flex items-center">
//           <span className={`mr-3 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
//           {title}
//         </h3>
//       </button>
//       {isOpen && <div className="p-6 bg-white border-t border-gray-200">{children}</div>}
//     </div>
//   ));

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
//           <h1 className="text-2xl font-bold">Add Task to Telecaller</h1>
//         </div>

//         <div className="p-6">
//           {loading ? (
//             <div className="text-center py-10">
//               <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//             </div>
//           ) : (
//             <>
//               {/* General Info */}
//               <CollapsibleSection title="General Info" sectionKey="general" isOpen={openSections.general} onToggle={toggleSection}>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Telecaller Name:</label>
//                     <select name="telecallerName" value={formData.telecallerName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500">
//                       <option value="">Select</option>
//                       {telecallersList.map(tc => <option key={tc._id}value={`${tc.user}|||${tc._id}`}>{tc.employeeId} - {tc.fullName}</option>)}
//                       {/* {telecallersList.map(tc => <option key={tc._id} value={tc._id}>{tc.employeeId} - {tc.fullName}</option>)} */}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
//                     <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Daily Target:</label>
//                     <input type="number" name="dailyCallTarget" value={formData.dailyCallTarget} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
//                   </div>
//                 </div>
//               </CollapsibleSection>

//               {/* Call Data Source — PURA WAPAS AA GAYA */}
//               <CollapsibleSection title="Call Data Source" sectionKey="callData" isOpen={openSections.callData} onToggle={toggleSection}>
//                 <div className="space-y-5">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Salesmen:</label>
//                     <div className="max-h-40 overflow-y-auto border rounded-md p-3 bg-gray-50">
//                       {salesmenList.map(s => (
//                         <label key={s._id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer">
//                           <input type="checkbox" name="salesmen"
//                           //  value={s._id}
//                           value={s.user?._id || s.user}   // YE CHANGE — USER ID BHEJO! 
//                           checked={formData.salesmen.includes(s.user?._id || s.user)}
//                           // checked={formData.salesmen.includes(s._id)} 
//                           onChange={handleInputChange} className="w-4 h-4" />
//                           <span>{s.employeeId} - {s.fullName}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <input type="date" name="dateRangeFrom" value={formData.dateRangeFrom} onChange={handleInputChange} className="px-3 py-2 border rounded-md" placeholder="From" />
//                     <input type="date" name="dateRangeTo" value={formData.dateRangeTo} onChange={handleInputChange} className="px-3 py-2 border rounded-md" placeholder="To" />
//                   </div>
//                   <select name="callType" value={formData.callType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
//                     <option value="All">All</option>
//                     <option value="Hot">Hot</option>
//                     <option value="Cold">Cold</option>
//                     <option value="Close">Close</option>
//                     <option value="Follow Up">Follow Up</option>
//                   </select>
//                 </div>
//               </CollapsibleSection>

//               {/* Renewal Calls + Load Button */}
//               <CollapsibleSection title="Renewal Calls" sectionKey="renewal" isOpen={openSections.renewal} onToggle={toggleSection}>
//                 <div className="flex items-center gap-4">
//                   <input type="month" name="renewalMonth" value={formData.renewalMonth} onChange={handleInputChange} className="flex-1 px-3 py-2 border rounded-md" />
//                   <button
//                     type="button"
//                     onClick={fetchDoctorsForTask}
//                     disabled={!formData.renewalMonth || loadingDoctors}
//                     className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//                   >
//                     {loadingDoctors ? 'Loading...' : 'Load Doctors'}
//                   </button>
//                 </div>
//                 {doctorsList.length > 0 && formData.renewalMonth && (
//                   <p className="text-green-600 font-medium mt-3">Success: {doctorsList.length} renewal doctors loaded!</p>
//                 )}
//               </CollapsibleSection>

//               {/* Service Calls + Load Button */}
//               <CollapsibleSection title="Service Calls" sectionKey="service" isOpen={openSections.service} onToggle={toggleSection}>
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <input type="date" name="serviceDateFrom" value={formData.serviceDateFrom} onChange={handleInputChange} className="px-3 py-2 border rounded-md" />
//                     <input type="date" name="serviceDateTo" value={formData.serviceDateTo} onChange={handleInputChange} className="px-3 py-2 border rounded-md" />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={fetchDoctorsForTask}
//                     disabled={!formData.serviceDateFrom || !formData.serviceDateTo || loadingDoctors}
//                     className="w-full px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
//                   >
//                     {loadingDoctors ? 'Loading...' : 'Load Service Doctors'}
//                   </button>
//                   {doctorsList.length > 0 && formData.serviceDateFrom && (
//                     <p className="text-green-600 font-medium text-center">Success: {doctorsList.length} service doctors loaded!</p>
//                   )}
//                 </div>
//               </CollapsibleSection>

//               {/* Additional Task */}
//               <CollapsibleSection title="Additional Office Task" sectionKey="additional" isOpen={openSections.additional} onToggle={toggleSection}>
//                 <div className="space-y-5">
//                   <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Task description..." className="w-full px-4 py-3 border rounded-md resize-none" />
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Priority:</label>
//                       <select value={formData.priority === 'medium' ? 'Normal' : 'High'} onChange={handlePriorityChange} className="w-full px-3 py-2 border rounded-md">
//                         <option>Normal</option>
//                         <option>High</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Deadline:</label>
//                       <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
//                     </div>
//                   </div>
//                 </div>
//               </CollapsibleSection>

//               {/* Buttons */}
//               <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
//                 <button type="button" className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
//                 <button
//                   type="button"
//                   onClick={handleSave}
//                   disabled={submitting}
//                   className="px-8 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
//                 >
//                   {submitting ? 'Assigning...' : 'Assign Task'}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTask;






















// import React, { useState, useEffect, useRef } from 'react';
// import { toast } from 'react-toastify';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';

// const AddTask = () => {
//   const scrollRef = useRef(null); // ← Yeh scroll jump rokega

//   const [formData, setFormData] = useState({
//     telecallerName: '',
//     date: new Date().toISOString().split('T')[0],
//     dailyCallTarget: '',
//     salesmen: [],
//     dateRangeFrom: '',
//     dateRangeTo: '',
//     callType: 'All',
//     renewalMonth: '',
//     serviceDateFrom: '',
//     serviceDateTo: '',
//     serviceCallType: 'Close',
//     description: '',
//     priority: 'medium',
//     deadline: ''
//   });

//   const [openSections, setOpenSections] = useState({
//     general: true,
//     callData: false,
//     renewal: false,
//     service: false,
//     additional: false
//   });

//   const [salesmenList, setSalesmenList] = useState([]);
//   const [telecallersList, setTelecallersList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // ALAG-ALAG DOCTORS LIST — BUG FREE
//   const [renewalDoctors, setRenewalDoctors] = useState([]);
//   const [serviceDoctors, setServiceDoctors] = useState([]);
//   const [loadingRenewal, setLoadingRenewal] = useState(false);
//   const [loadingService, setLoadingService] = useState(false);

//   // Fetch salesmen + telecallers
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [salesmenRes, telecallersRes] = await Promise.all([
//           apiClient.get(apiEndpoints.employees.byRole('salesman')),
//           apiClient.get(apiEndpoints.employees.byRole('telecaller'))
//         ]);

//         if (salesmenRes.data.success) {
//           const formatted = salesmenRes.data.data.map(s => ({
//             ...s,
//             userId: s.user?._id || s.user || s._id
//           }));
//           setSalesmenList(formatted);
//         }
//         if (telecallersRes.data.success) {
//           setTelecallersList(telecallersRes.data.data);
//         }
//       } catch (error) {
//         toast.error('Failed to load employees');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const toggleSection = (section) => {
//     setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => {
//       if (type === 'checkbox' && name === 'salesmen') {
//         return {
//           ...prev,
//           salesmen: checked
//             ? [...prev.salesmen, value]
//             : prev.salesmen.filter(id => id !== value)
//         };
//       }
//       return { ...prev, [name]: value };
//     });
//   };

//   const handlePriorityChange = (e) => {
//     const map = { 'Normal': 'medium', 'High': 'high' };
//     setFormData(prev => ({ ...prev, priority: map[e.target.value] }));
//   };

//   // Renewal Doctors Load
//   const loadRenewalDoctors = async () => {
//     if (!formData.renewalMonth) return toast.error('Renewal month select karo');

//     setLoadingRenewal(true);
//     try {
//       const [year, month] = formData.renewalMonth.split('-');
//       const res = await apiClient.get(apiEndpoints.salesBills.getRenewalCallsDoctors, {
//         params: { month: parseInt(month), year: parseInt(year) }
//       });

//       if (res.data.success && res.data.data?.length > 0) {
//         const ids = res.data.data.map(d => d.doctorId || d._id);
//         setRenewalDoctors(ids);
//         toast.success(`${ids.length} renewal doctors loaded`);
//       } else {
//         setRenewalDoctors([]);
//         toast.info('No renewal doctors found');
//       }
//     } catch (err) {
//       toast.error('Failed to load renewal doctors');
//       setRenewalDoctors([]);
//     } finally {
//       setLoadingRenewal(false);
//     }
//   };

//   // Service Doctors Load
//   const loadServiceDoctors = async () => {
//     if (!formData.serviceDateFrom || !formData.serviceDateTo) {
//       return toast.error('Both dates are required');
//     }

//     setLoadingService(true);
//     try {
//       const res = await apiClient.get(apiEndpoints.doctors.getCloseDoctorIdsOnly, {
//         params: {
//           fromDate: formData.serviceDateFrom,
//           toDate: formData.serviceDateTo
//         }
//       });

//       if (res.data.success && res.data.doctorIds?.length > 0) {
//         setServiceDoctors(res.data.doctorIds);
//         toast.success(`${res.data.doctorIds.length} service doctors loaded`);
//       } else {
//         setServiceDoctors([]);
//         toast.info('No service doctors found');
//       }
//     } catch (err) {
//       toast.error('Failed to load service doctors');
//       setServiceDoctors([]);
//     } finally {
//       setLoadingService(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!formData.telecallerName) return toast.error('Telecaller select karo');
//     if (!formData.description.trim()) return toast.error('Description likho');

//     const [userId, employeeId] = formData.telecallerName.split('|||');
//     if (!userId || !employeeId) return toast.error('Invalid telecaller selection');

//     // Validation: agar renewal/service bhara hai toh doctors load hone chahiye
//     if (formData.renewalMonth && renewalDoctors.length === 0) {
//       return toast.error('Renewal doctors load karo pehle!');
//     }
//     if (formData.serviceDateFrom && formData.serviceDateTo && serviceDoctors.length === 0) {
//       return toast.error('Service doctors load karo pehle!');
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         title: formData.description.substring(0, 100) || 'Telecaller Task',
//         description: formData.description,
//         taskType: 'call',
//         priority: formData.priority,
//         scheduledDate: new Date(formData.date).toISOString(),
//         assignedTo: userId,      // User ID
//         employee: employeeId,    // Employee ID
//         notes: formData.description,

//         telecallerData: {
//           dailyCallTarget: parseInt(formData.dailyCallTarget) || 0,
//           salesmen: formData.salesmen.length > 0 ? formData.salesmen : undefined,
//           dateRangeFrom: formData.dateRangeFrom || undefined,
//           dateRangeTo: formData.dateRangeTo || undefined,
//           callType: formData.callType || 'All',
//           useCallEntrySystem: true,

//           // Renewal Calls
//           ...(formData.renewalMonth && renewalDoctors.length > 0 && {
//             renewalCalls: {
//               renewalMonth: formData.renewalMonth,
//               callType: formData.serviceCallType || 'Close',
//               doctors: renewalDoctors.map(id => ({ doctor: id }))
//             }
//           }),

//           // Service Calls
//           ...(formData.serviceDateFrom && formData.serviceDateTo && serviceDoctors.length > 0 && {
//             serviceCalls: {
//               serviceType: formData.serviceCallType || 'Service',
//               dateRangeFrom: formData.serviceDateFrom,
//               dateRangeTo: formData.serviceDateTo,
//               doctors: serviceDoctors.map(id => ({ doctor: id }))
//             }
//           }),

//           deadline: formData.deadline || undefined
//         }
//       };

//       // Remove undefined fields
//       // Clean up empty/zero fields (optional but clean)
// if (payload.telecallerData.dailyCallTarget <= 0) {
//   delete payload.telecallerData.dailyCallTarget;
// }
// Object.keys(payload.telecallerData).forEach(key => {
//   if (payload.telecallerData[key] === undefined || 
//       payload.telecallerData[key] === null || 
//       (Array.isArray(payload.telecallerData[key]) && payload.telecallerData[key].length === 0)) {
//     delete payload.telecallerData[key];
//   }
// });

//       await apiClient.post('/tasks', payload);
//       toast.success('Task assigned successfully!');

//       // Reset form
//       setFormData(prev => ({
//         ...prev,
//         description: '',
//         dailyCallTarget: '',
//         salesmen: [],
//         dateRangeFrom: '',
//         dateRangeTo: '',
//         renewalMonth: '',
//         serviceDateFrom: '',
//         serviceDateTo: '',
//         deadline: ''
//       }));
//       setRenewalDoctors([]);
//       setServiceDoctors([]);

//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to create task');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const CollapsibleSection = React.memo(({ title, sectionKey, children, isOpen, onToggle }) => (
//     <div className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
//       <button
//         type="button"
//         onClick={() => onToggle(sectionKey)}
//         className="w-full px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
//       >
//         <h3 className="font-semibold text-gray-800 text-lg flex items-center">
//           <span className={`mr-3 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>Right Arrow</span>
//           {title}
//         </h3>
//       </button>
//       {isOpen && <div className="p-6 bg-white border-t border-gray-200">{children}</div>}
//     </div>
//   ));

//   return (
//     <div className="max-w-4xl mx-auto p-6" ref={scrollRef}>
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
//           <h1 className="text-2xl font-bold">Add Task to Telecaller</h1>
//         </div>

//         <div className="p-6">
//           {loading ? (
//             <div className="text-center py-10">
//               <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//             </div>
//           ) : (
//             <>
//               {/* General Info */}
//               <CollapsibleSection title="General Info" sectionKey="general" isOpen={openSections.general} onToggle={toggleSection}>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Telecaller Name:</label>
//                     <select
//                       name="telecallerName"
//                       value={formData.telecallerName}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">Select Telecaller</option>
//                       {telecallersList.map(tc => (
//                         <option key={tc._id} value={`${tc.user}|||${tc._id}`}>
//                           {tc.employeeId} - {tc.fullName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
//                     <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Daily Target:</label>
//                     <input
//                       type="number"
//                       name="dailyCallTarget"
//                       value={formData.dailyCallTarget}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border rounded-md"
//                       placeholder="e.g. 100"
//                     />
//                   </div>
//                 </div>
//               </CollapsibleSection>

//               {/* Call Data Source */}
//               <CollapsibleSection title="Call Data Source" sectionKey="callData" isOpen={openSections.callData} onToggle={toggleSection}>
//                 <div className="space-y-5">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Select Salesmen:</label>
//                     <div className="max-h-40 overflow-y-auto border rounded-md p-3 bg-gray-50">
//                       {salesmenList.map(s => (
//                         <label key={s._id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer">
//                           <input
//                             type="checkbox"
//                             name="salesmen"
//                             value={s.userId}
//                             checked={formData.salesmen.includes(s.userId)}
//                             onChange={handleInputChange}
//                             className="w-4 h-4"
//                           />
//                           <span>{s.employeeId} - {s.fullName}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <input type="date" name="dateRangeFrom" value={formData.dateRangeFrom} onChange={handleInputChange} className="px-3 py-2 border rounded-md" />
//                     <input type="date" name="dateRangeTo" value={formData.dateRangeTo} onChange={handleInputChange} className="px-3 py-2 border rounded-md" />
//                   </div>
//                   <select name="callType" value={formData.callType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
//                     <option value="All">All</option>
//                     <option value="Hot">Hot</option>
//                     <option value="Cold">Cold</option>
//                     <option value="Close">Close</option>
//                     <option value="Follow Up">Follow Up</option>
//                   </select>
//                 </div>
//               </CollapsibleSection>

//               {/* Renewal Calls */}
//               <CollapsibleSection title="Renewal Calls" sectionKey="renewal" isOpen={openSections.renewal} onToggle={toggleSection}>
//                 <div className="flex items-center gap-4">
//                   <input
//                     type="month"
//                     name="renewalMonth"
//                     value={formData.renewalMonth}
//                     onChange={handleInputChange}
//                     className="flex-1 px-3 py-2 border rounded-md"
//                   />
//                   <button
//                     onClick={loadRenewalDoctors}
//                     disabled={loadingRenewal}
//                     className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
//                   >
//                     {loadingRenewal ? 'Loading...' : 'Load Renewal Doctors'}
//                   </button>
//                 </div>
//                 {renewalDoctors.length > 0 && (
//                   <p className="text-green-600 font-medium mt-3">
//                     Success: {renewalDoctors.length} renewal doctors loaded
//                   </p>
//                 )}
//               </CollapsibleSection>

//               {/* Service Calls */}
//               <CollapsibleSection title="Service Calls" sectionKey="service" isOpen={openSections.service} onToggle={toggleSection}>
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <input type="date" name="serviceDateFrom" value={formData.serviceDateFrom} onChange={handleInputChange} className="px-3 py-2 border rounded-md" />
//                     <input type="date" name="serviceDateTo" value={formData.serviceDateTo} onChange={handleInputChange} className="px-3 py-2 border rounded-md" />
//                   </div>
//                   <button
//                     onClick={loadServiceDoctors}
//                     disabled={loadingService}
//                     className="w-full px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
//                   >
//                     {loadingService ? 'Loading...' : 'Load Service Doctors'}
//                   </button>
//                   {serviceDoctors.length > 0 && (
//                     <p className="text-green-600 font-medium text-center">
//                       Success: {serviceDoctors.length} service doctors loaded
//                     </p>
//                   )}
//                 </div>
//               </CollapsibleSection>

//               {/* Additional Task */}
//               <CollapsibleSection title="Additional Office Task" sectionKey="additional" isOpen={openSections.additional} onToggle={toggleSection}>
//                 <div className="space-y-5">
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows={4}
//                     placeholder="Enter task description..."
//                     className="w-full px-4 py-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Priority:</label>
//                       <select
//                         value={formData.priority === 'medium' ? 'Normal' : 'High'}
//                         onChange={handlePriorityChange}
//                         className="w-full px-3 py-2 border rounded-md"
//                       >
//                         <option>Normal</option>
//                         <option>High</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Deadline:</label>
//                       <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
//                     </div>
//                   </div>
//                 </div>
//               </CollapsibleSection>

//               {/* Buttons */}
//               <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
//                 <button
//                   type="button"
//                   onClick={handleSave}
//                   disabled={submitting}
//                   className="px-8 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {submitting ? 'Assigning Task...' : 'Assign Task'}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTask;


















// import React, { useState, useEffect, useRef } from 'react';
// import { toast } from 'react-toastify';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';

// const AddTask = () => {
//   const scrollRef = useRef(null); // scroll jump fix

//   const [formData, setFormData] = useState({
//     telecallerName: '',
//     date: new Date().toISOString().split('T')[0],
//     dailyCallTarget: '',
//     salesmen: [],
//     dateRangeFrom: '',
//     dateRangeTo: '',
//     callType: 'All',
//     renewalMonth: '',
//     serviceDateFrom: '',
//     serviceDateTo: '',
//     serviceCallType: 'Close',
//     description: '',
//     priority: 'medium',
//     deadline: ''
//   });

//   const [openSections, setOpenSections] = useState({
//     general: true,
//     callData: false,
//     renewal: false,
//     service: false,
//     additional: false
//   });

//   const [salesmenList, setSalesmenList] = useState([]);
//   const [telecallersList, setTelecallersList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // Alag doctors list — bug free
//   const [renewalDoctors, setRenewalDoctors] = useState([]);
//   const [serviceDoctors, setServiceDoctors] = useState([]);
//   const [loadingRenewal, setLoadingRenewal] = useState(false);
//   const [loadingService, setLoadingService] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [salesmenRes, telecallersRes] = await Promise.all([
//           apiClient.get(apiEndpoints.employees.byRole('salesman')),
//           apiClient.get(apiEndpoints.employees.byRole('telecaller'))
//         ]);

//         if (salesmenRes.data.success) {
//           const formatted = salesmenRes.data.data.map(s => ({
//             ...s,
//             userId: s.user?._id || s.user
//           }));
//           setSalesmenList(formatted);
//         }
//         if (telecallersRes.data.success) {
//           setTelecallersList(telecallersRes.data.data);
//         }
//       } catch (error) {
//         toast.error('Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const toggleSection = (section) => {
//     setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => {
//       if (type === 'checkbox' && name === 'salesmen') {
//         return {
//           ...prev,
//           salesmen: checked ? [...prev.salesmen, value] : prev.salesmen.filter(id => id !== value)
//         };
//       }
//       return { ...prev, [name]: value };
//     });
//   };

//   const handlePriorityChange = (e) => {
//     const map = { 'Normal': 'medium', 'High': 'high' };
//     setFormData(prev => ({ ...prev, priority: map[e.target.value] }));
//   };

//   // Renewal Doctors
//   const loadRenewalDoctors = async () => {
//     if (!formData.renewalMonth) return toast.error('Renewal month select karo');
//     setLoadingRenewal(true);
//     try {
//       const [year, month] = formData.renewalMonth.split('-');
//       const res = await apiClient.get(apiEndpoints.salesBills.getRenewalCallsDoctors, {
//         params: { month: parseInt(month), year: parseInt(year) }
//       });
//       if (res.data.success && res.data.data?.length > 0) {
//         const ids = res.data.data.map(d => d.doctorId);
//         setRenewalDoctors(ids);
//         toast.success(`${ids.length} renewal doctors loaded!`);
//       } else {
//         setRenewalDoctors([]);
//         toast.info('No renewal doctors found');
//       }
//     } catch (err) {
//       toast.error('Renewal doctors load nahi hue');
//       setRenewalDoctors([]);
//     } finally {
//       setLoadingRenewal(false);
//     }
//   };

//   // Service Doctors
//   const loadServiceDoctors = async () => {
//     if (!formData.serviceDateFrom || !formData.serviceDateTo) return toast.error('Both dates daalo');
//     setLoadingService(true);
//     try {
//       const res = await apiClient.get(apiEndpoints.doctors.getCloseDoctorIdsOnly, {
//         params: { fromDate: formData.serviceDateFrom, toDate: formData.serviceDateTo }
//       });
//       if (res.data.success && res.data.doctorIds?.length > 0) {
//         setServiceDoctors(res.data.doctorIds);
//         toast.success(`${res.data.doctorIds.length} service doctors loaded!`);
//       } else {
//         setServiceDoctors([]);
//         toast.info('No service doctors found');
//       }
//     } catch (err) {
//       toast.error('Service doctors load nahi hue');
//       setServiceDoctors([]);
//     } finally {
//       setLoadingService(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!formData.telecallerName) return toast.error('Telecaller select karo');
//     if (!formData.description.trim()) return toast.error('Description daalo');

//     const [userId, employeeId] = formData.telecallerName.split('|||');
//     if (!userId || !employeeId) return toast.error("Telecaller selection galat hai!");

//     if (formData.renewalMonth && renewalDoctors.length === 0) {
//       return toast.error("Pehle renewal doctors load karo!");
//     }
//     if (formData.serviceDateFrom && formData.serviceDateTo && serviceDoctors.length === 0) {
//       return toast.error("Pehle service doctors load karo!");
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         title: formData.description.substring(0, 100),
//         description: formData.description,
//         taskType: 'call',
//         priority: formData.priority,
//         scheduledDate: new Date(formData.date).toISOString(),
//         assignedToId: userId,      // ← EXACTLY PEHLE JAISA
//         employeeId: employeeId,    // ← EXACTLY PEHLE JAISA
//         notes: formData.description,

//         telecallerData: {
//           dailyCallTarget: parseInt(formData.dailyCallTarget) || 0,
//           salesmen: formData.salesmen.length > 0 ? formData.salesmen : undefined,
//           dateRangeFrom: formData.dateRangeFrom || undefined,
//           dateRangeTo: formData.dateRangeTo || undefined,
//           callType: formData.callType,
//           useCallEntrySystem: true,

//           ...(formData.renewalMonth && renewalDoctors.length > 0 && {
//             renewalCalls: {
//               renewalMonth: formData.renewalMonth,
//               callType: formData.serviceCallType || "Close",
//               doctors: renewalDoctors.map(id => ({ doctor: id }))
//             }
//           }),

//           ...(formData.serviceDateFrom && formData.serviceDateTo && serviceDoctors.length > 0 && {
//             serviceCalls: {
//               serviceType: formData.serviceCallType || "Service",
//               dateRangeFrom: formData.serviceDateFrom,
//               dateRangeTo: formData.serviceDateTo,
//               doctors: serviceDoctors.map(id => ({ doctor: id }))
//             }
//           }),

//           deadline: formData.deadline || undefined
//         }
//       };

//       // Clean undefined fields (pehla wala logic)
//       Object.keys(payload.telecallerData).forEach(key => {
//         if (payload.telecallerData[key] === undefined) {
//           delete payload.telecallerData[key];
//         }
//       });

//       await apiClient.post('/tasks', payload);
//       toast.success('Task successfully ban gaya with doctors!');

//       // Reset exactly pehle jaisa
//       setFormData(prev => ({
//         ...prev,
//         description: '',
//         dailyCallTarget: '',
//         salesmen: [],
//         dateRangeFrom: '',
//         dateRangeTo: '',
//         renewalMonth: '',
//         serviceDateFrom: '',
//         serviceDateTo: '',
//         deadline: ''
//       }));
//       setRenewalDoctors([]);
//       setServiceDoctors([]);

//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Task nahi bana');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const CollapsibleSection = React.memo(({ title, sectionKey, children, isOpen, onToggle }) => (
//     <div className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
//       <button type="button" onClick={() => onToggle(sectionKey)} className="w-full px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left">
//         <h3 className="font-semibold text-gray-800 text-lg flex items-center">
//           <span className={`mr-3 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
//           {title}
//         </h3>
//       </button>
//       {isOpen && <div className="p-6 bg-white border-t border-gray-200">{children}</div>}
//     </div>
//   ));

//   return (
//     <div className="max-w-4xl mx-auto p-6" ref={scrollRef}>
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
//           <h1 className="text-2xl font-bold">Add Task to Telecaller</h1>
//         </div>

//         <div className="p-6">
//           {loading ? (
//             <div className="text-center py-10">
//               <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//             </div>
//           ) : (
//             <>
//               {/* General Info */}
//               <CollapsibleSection title="General Info" sectionKey="general" isOpen={openSections.general} onToggle={toggleSection}>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Telecaller Name:</label>
//                     <select name="telecallerName" value={formData.telecallerName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500">
//                       <option value="">Select</option>
//                       {telecallersList.map(tc => (
//                         <option key={tc._id} value={`${tc.user}|||${tc._id}`}>
//                           {tc.employeeId} - {tc.fullName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
//                     <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Daily Target:</label>
//                     <input type="number" name="dailyCallTarget" value={formData.dailyCallTarget} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
//                   </div>
//                 </div>
//               </CollapsibleSection>

//               {/* Call Data Source */}
//               <CollapsibleSection title="Call Data Source" sectionKey="callData" isOpen={openSections.callData} onToggle={toggleSection}>
//                 <div className="space-y-5">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Salesmen:</label>
//                     <div className="max-h-40 overflow-y-auto border rounded-md p-3 bg-gray-50">
//                       {salesmenList.map(s => (
//                         <label key={s._id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer">
//                           <input
//                             type="checkbox"
//                             name="salesmen"
//                             value={s.userId}
//                             checked={formData.salesmen.includes(s.userId)}
//                             onChange={handleInputChange}
//                             className="w-4 h-4"
//                           />
//                           <span>{s.employeeId} - {s.fullName}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <input type="date" name="dateRangeFrom" value={formData.dateRangeFrom} onChange={handleInputChange} className="px-3 py-2 border rounded-md" placeholder="From" />
//                     <input type="date" name="dateRangeTo" value={formData.dateRangeTo} onChange={handleInputChange} className="px-3 py-2 border rounded-md" placeholder="To" />
//                   </div>
//                   <select name="callType" value={formData.callType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
//                     <option value="All">All</option>
//                     <option value="Hot">Hot</option>
//                     <option value="Cold">Cold</option>
//                     <option value="Close">Close</option>
//                     <option value="Follow Up">Follow Up</option>
//                   </select>
//                 </div>
//               </CollapsibleSection>

//               {/* Renewal Calls */}
//               <CollapsibleSection title="Renewal Calls" sectionKey="renewal" isOpen={openSections.renewal} onToggle={toggleSection}>
//                 <div className="flex items-center gap-4">
//                   <input type="month" name="renewalMonth" value={formData.renewalMonth} onChange={handleInputChange} className="flex-1 px-3 py-2 border rounded-md" />
//                   <button
//                     type="button"
//                     onClick={loadRenewalDoctors}
//                     disabled={loadingRenewal}
//                     className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//                   >
//                     {loadingRenewal ? 'Loading...' : 'Load Doctors'}
//                   </button>
//                 </div>
//                 {renewalDoctors.length > 0 && formData.renewalMonth && (
//                   <p className="text-green-600 font-medium mt-3">Success: {renewalDoctors.length} renewal doctors loaded!</p>
//                 )}
//               </CollapsibleSection>

//               {/* Service Calls */}
//               <CollapsibleSection title="Service Calls" sectionKey="service" isOpen={openSections.service} onToggle={toggleSection}>
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <input type="date" name="serviceDateFrom" value={formData.serviceDateFrom} onChange={handleInputChange} className="px-3 py-2 border rounded-md" />
//                     <input type="date" name="serviceDateTo" value={formData.serviceDateTo} onChange={handleInputChange} className="px-3 py-2 border rounded-md" />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={loadServiceDoctors}
//                     disabled={loadingService}
//                     className="w-full px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
//                   >
//                     {loadingService ? 'Loading...' : 'Load Service Doctors'}
//                   </button>
//                   {serviceDoctors.length > 0 && formData.serviceDateFrom && (
//                     <p className="text-green-600 font-medium text-center">Success: {serviceDoctors.length} service doctors loaded!</p>
//                   )}
//                 </div>
//               </CollapsibleSection>

//               {/* Additional Task */}
//               <CollapsibleSection title="Additional Office Task" sectionKey="additional" isOpen={openSections.additional} onToggle={toggleSection}>
//                 <div className="space-y-5">
//                   <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Task description..." className="w-full px-4 py-3 border rounded-md resize-none" />
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Priority:</label>
//                       <select value={formData.priority === 'medium' ? 'Normal' : 'High'} onChange={handlePriorityChange} className="w-full px-3 py-2 border rounded-md">
//                         <option>Normal</option>
//                         <option>High</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Deadline:</label>
//                       <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
//                     </div>
//                   </div>
//                 </div>
//               </CollapsibleSection>

//               {/* Buttons */}
//               <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
//                 <button type="button" className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
//                 <button
//                   type="button"
//                   onClick={handleSave}
//                   disabled={submitting}
//                   className="px-8 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
//                 >
//                   {submitting ? 'Assigning...' : 'Assign Task'}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTask;


























import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from '../../../../services/apiClient';
import DateInput from '../../../../components/DateInput/DateInput';

const AddTask = () => {

  const todayDDMMYYYY = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};



  const [formData, setFormData] = useState({
    telecallerName: '',
    // date: new Date().toISOString().split('T')[0],
    date: todayDDMMYYYY(),
    dailyCallTarget: '',
    salesmen: [],
    dateRangeFrom: '',
    dateRangeTo: '',
    callType: 'All',
    renewalMonth: '',
    serviceDateFrom: '',
    serviceDateTo: '',
    serviceCallType: 'Close',
    description: '',
    priority: 'medium',
    deadline: ''
  });

  const [salesmenList, setSalesmenList] = useState([]);
  const [telecallersList, setTelecallersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Doctors lists
  const [renewalDoctors, setRenewalDoctors] = useState([]);
  const [serviceDoctors, setServiceDoctors] = useState([]);
  const [loadingRenewal, setLoadingRenewal] = useState(false);
  const [loadingService, setLoadingService] = useState(false);



// dekh raha hu 
const [renewalLoaded, setRenewalLoaded] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salesmenRes, telecallersRes] = await Promise.all([
          apiClient.get(apiEndpoints.employees.byRole('salesman')),
          apiClient.get(apiEndpoints.employees.byRole('telecaller'))
        ]);

        if (salesmenRes.data.success) {
          const formatted = salesmenRes.data.data.map(s => ({
            ...s,
            userId: s.user?._id || s.user
          }));
          setSalesmenList(formatted);
        }
        if (telecallersRes.data.success) {
          setTelecallersList(telecallersRes.data.data);
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      if (type === 'checkbox' && name === 'salesmen') {
        return {
          ...prev,
          salesmen: checked ? [...prev.salesmen, value] : prev.salesmen.filter(id => id !== value)
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handlePriorityChange = (e) => {
    const map = { 'Normal': 'medium', 'High': 'high' };
    setFormData(prev => ({ ...prev, priority: map[e.target.value] }));
  };

  // Load Renewal Doctors
  const loadRenewalDoctors = async () => {
    if (!formData.renewalMonth) return toast.error('Renewal month select karo');
    setLoadingRenewal(true);
    try {
      const [year, month] = formData.renewalMonth.split('-');
      const res = await apiClient.get(apiEndpoints.salesBills.getRenewalCallsDoctors, {
        params: { month: parseInt(month), year: parseInt(year) }
      });


// dekh raha hu 
  setRenewalLoaded(true); // 🔥 Most important line


      if (res.data.success && res.data.data?.length > 0) {
        const ids = res.data.data.map(d => d.doctorId);
        setRenewalDoctors(ids);
        toast.success(`${ids.length} renewal doctors loaded!`);
      } else {
        setRenewalDoctors([]);
        toast.info('No renewal doctors found');
      }
    } catch (err) {
      toast.error('Renewal doctors load nahi hue');
      setRenewalDoctors([]);
    } finally {
      setLoadingRenewal(false);
    }
  };

  // Load Service Doctors
  // const loadServiceDoctors = async () => {
  //   if (!formData.serviceDateFrom || !formData.serviceDateTo) return toast.error('Both dates daalo');
  //   setLoadingService(true);
  //   try {
  //     const res = await apiClient.get(apiEndpoints.doctors.getCloseDoctorIdsOnly, {
  //       params: { fromDate: formData.serviceDateFrom, toDate: formData.serviceDateTo }
  //     });
  //     if (res.data.success && res.data.doctorIds?.length > 0) {
  //       setServiceDoctors(res.data.doctorIds);
  //       toast.success(`${res.data.doctorIds.length} service doctors loaded!`);
  //     } else {
  //       setServiceDoctors([]);
  //       toast.info('No service doctors found');
  //     }
  //   } catch (err) {
  //     toast.error('Service doctors load nahi hue');
  //     setServiceDoctors([]);
  //   } finally {
  //     setLoadingService(false);
  //   }
  // };





// Load Service Doctors
const loadServiceDoctors = async () => {
  if (!formData.serviceDateFrom || !formData.serviceDateTo) return toast.error('Both dates daalo');
  
  setLoadingService(true);
  try {
    // Convert dd-mm-yyyy to yyyy-mm-dd
    const convertToYYYYMMDD = (ddmmyyyy) => {
      if (!ddmmyyyy) return null;
      const [day, month, year] = ddmmyyyy.split('-');
      return `${year}-${month}-${day}`;
    };

    const fromDateISO = convertToYYYYMMDD(formData.serviceDateFrom);
    const toDateISO = convertToYYYYMMDD(formData.serviceDateTo);

    const res = await apiClient.get(apiEndpoints.doctors.getCloseDoctorIdsOnly, {
      params: { 
        fromDate: fromDateISO, 
        toDate: toDateISO 
      }
    });

    if (res.data.success && res.data.doctorIds?.length > 0) {
      setServiceDoctors(res.data.doctorIds);
      toast.success(`${res.data.doctorIds.length} service doctors loaded!`);
    } else {
      setServiceDoctors([]);
      toast.info('No service doctors found');
    }
  } catch (err) {
    console.error('Service doctors error:', err);
    toast.error('Service doctors load nahi hue');
    setServiceDoctors([]);
  } finally {
    setLoadingService(false);
  }
};


 


  // const handleSave = async () => {
  //   if (!formData.telecallerName) return toast.error('Telecaller select karo');
  //   if (!formData.description.trim()) return toast.error('Description daalo');

  //   const [userId, employeeId] = formData.telecallerName.split('|||');
  //   if (!userId || !employeeId) return toast.error("Telecaller selection galat hai!");

  //   // if (formData.renewalMonth && renewalDoctors.length === 0) {
  //   if (formData.renewalMonth && !renewalLoaded) {
  //     return toast.error("Pehle renewal doctors load karo!");
  //   }
  //   if (formData.serviceDateFrom && formData.serviceDateTo && serviceDoctors.length === 0) {
  //     return toast.error("Pehle service doctors load karo!");
  //   }

  //   try {
  //     setSubmitting(true);

  //     const payload = {
  //       title: formData.description.substring(0, 100),
  //       description: formData.description,
  //       taskType: 'call',
  //       priority: formData.priority,
  //       // scheduledDate: new Date(formData.date).toISOString(),
  //       scheduledDate: new Date(formData.date.split('-').reverse().join('-')).toISOString(),
  //       assignedToId: userId,
  //       employeeId: employeeId,
  //       notes: formData.description,

  //       telecallerData: {
  //         dailyCallTarget: parseInt(formData.dailyCallTarget) || 0,
  //         salesmen: formData.salesmen.length > 0 ? formData.salesmen : undefined,
  //         dateRangeFrom: formData.dateRangeFrom || undefined,
  //         dateRangeTo: formData.dateRangeTo || undefined,
  //         callType: formData.callType,
  //         useCallEntrySystem: true,

  //         ...(formData.renewalMonth && renewalDoctors.length > 0 && {
  //           renewalCalls: {
  //             renewalMonth: formData.renewalMonth,
  //             callType: formData.serviceCallType || "Close",
  //             doctors: renewalDoctors.map(id => ({ doctor: id }))
  //           }
  //         }),

  //         ...(formData.serviceDateFrom && formData.serviceDateTo && serviceDoctors.length > 0 && {
  //           serviceCalls: {
  //             serviceType: formData.serviceCallType || "Service",
  //             dateRangeFrom: formData.serviceDateFrom,
  //             dateRangeTo: formData.serviceDateTo,
  //             doctors: serviceDoctors.map(id => ({ doctor: id }))
  //           }
  //         }),

  //         deadline: formData.deadline || undefined
  //       }
  //     };

  //     Object.keys(payload.telecallerData).forEach(key => {
  //       if (payload.telecallerData[key] === undefined) {
  //         delete payload.telecallerData[key];
  //       }
  //     });

  //     await apiClient.post('/tasks', payload);
  //     toast.success('Task successfully ban gaya!');

  //     // Reset form
  //     setFormData({
  //       ...formData,
  //       description: '',
  //       dailyCallTarget: '',
  //       salesmen: [],
  //       dateRangeFrom: '',
  //       dateRangeTo: '',
  //       renewalMonth: '',
  //       serviceDateFrom: '',
  //       serviceDateTo: '',
  //       deadline: ''
  //     });
  //     setRenewalDoctors([]);
  //     setServiceDoctors([]);

  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Task nahi bana');
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };




const handleSave = async () => {
  if (!formData.telecallerName) return toast.error('Telecaller select karo');
  if (!formData.description.trim()) return toast.error('Description daalo');

  const [userId, employeeId] = formData.telecallerName.split('|||');
  if (!userId || !employeeId) return toast.error("Telecaller selection galat hai!");

  if (formData.renewalMonth && !renewalLoaded) {
    return toast.error("Pehle renewal doctors load karo!");
  }
  if (formData.serviceDateFrom && formData.serviceDateTo && serviceDoctors.length === 0) {
    return toast.error("Pehle service doctors load karo!");
  }

  // NEW: Task Date validation
  if (!formData.date) {
    return toast.error('Task Date select karo!');
  }

  try {
    setSubmitting(true);

    // Helper function - dd-mm-yyyy → yyyy-mm-dd (safe)
    const toYYYYMMDD = (ddmmyyyy) => {
      if (!ddmmyyyy) return undefined;
      const parts = ddmmyyyy.split('-');
      if (parts.length !== 3) return undefined;
      const [day, month, year] = parts.map(Number);
      if (!day || !month || !year) return undefined;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    // Safe scheduledDate
    const taskDateISO = toYYYYMMDD(formData.date);
    if (!taskDateISO) {
      return toast.error('Task Date invalid hai!');
    }

    const payload = {
      title: formData.description.substring(0, 100),
      description: formData.description,
      taskType: 'call',
      priority: formData.priority,
      scheduledDate: new Date(taskDateISO).toISOString(), // Ab safe hai
      assignedToId: userId,
      employeeId: employeeId,
      notes: formData.description,

      telecallerData: {
        dailyCallTarget: parseInt(formData.dailyCallTarget) || 0,
        salesmen: formData.salesmen.length > 0 ? formData.salesmen : undefined,
        dateRangeFrom: formData.dateRangeFrom ? toYYYYMMDD(formData.dateRangeFrom) : undefined,
        dateRangeTo: formData.dateRangeTo ? toYYYYMMDD(formData.dateRangeTo) : undefined,
        callType: formData.callType,
        useCallEntrySystem: true,

        ...(formData.renewalMonth && renewalDoctors.length > 0 && {
          renewalCalls: {
            renewalMonth: formData.renewalMonth,
            callType: formData.serviceCallType || "Close",
            doctors: renewalDoctors.map(id => ({ doctor: id }))
          }
        }),

        ...(formData.serviceDateFrom && formData.serviceDateTo && serviceDoctors.length > 0 && {
          serviceCalls: {
            serviceType: formData.serviceCallType || "Service",
            dateRangeFrom: toYYYYMMDD(formData.serviceDateFrom),
            dateRangeTo: toYYYYMMDD(formData.serviceDateTo),
            doctors: serviceDoctors.map(id => ({ doctor: id }))
          }
        }),

        deadline: formData.deadline ? toYYYYMMDD(formData.deadline) : undefined
      }
    };

    // Clean undefined
    Object.keys(payload.telecallerData).forEach(key => {
      if (payload.telecallerData[key] === undefined) {
        delete payload.telecallerData[key];
      }
    });

    console.log('Final Payload:', payload); // Debug ke liye

    await apiClient.post('/tasks', payload);
    toast.success('Task successfully ban gaya!');

    // Reset
    setFormData({
      ...formData,
      description: '',
      dailyCallTarget: '',
      salesmen: [],
      dateRangeFrom: '',
      dateRangeTo: '',
      renewalMonth: '',
      serviceDateFrom: '',
      serviceDateTo: '',
      deadline: '',
      date: new Date().toISOString().split('T')[0] // Task Date bhi reset (yyyy-mm-dd mein rahega)
    });
    setRenewalDoctors([]);
    setServiceDoctors([]);
    setRenewalLoaded(false);

  } catch (error) {
    console.error('Task create error:', error);
    toast.error(error.response?.data?.message || 'Task nahi bana');
  } finally {
    setSubmitting(false);
  }
};



  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-10 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <h1 className="text-3xl font-bold">Add Telecaller Task (One-Go)</h1>
          <p className="text-blue-100 mt-1">Fill everything in one screen — fast & easy!</p>
        </div>

        <div className="p-8 space-y-8">

          {/* General Info */}
          <div className="bg-gray-50 rounded-lg p-6 border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telecaller Name <span className="text-red-500">*</span></label>
                <select name="telecallerName" value={formData.telecallerName} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Telecaller</option>
                  {telecallersList.map(tc => (
                    <option key={tc._id} value={`${tc.user}|||${tc._id}`}>
                      {tc.employeeId} - {tc.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Date</label>
                <DateInput  name="date" value={formData.date} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Call Target</label>
                <input type="number" name="dailyCallTarget" value={formData.dailyCallTarget} onChange={handleInputChange} placeholder="e.g. 50" className="w-full px-4 py-3 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Salesmen & Call Filters */}
          <div className="bg-gray-50 rounded-lg p-6 border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Call Data from Salesmen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Salesmen</label>
                <div className="max-h-48 overflow-y-auto border rounded-lg p-4 bg-white space-y-2">
                  {salesmenList.map(s => (
                    <label key={s._id} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded cursor-pointer">
                      <input type="checkbox" name="salesmen" value={s.userId} checked={formData.salesmen.includes(s.userId)} onChange={handleInputChange} className="w-5 h-5" />
                      <span>{s.employeeId} - {s.fullName}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <DateInput type="date" name="dateRangeFrom" value={formData.dateRangeFrom} onChange={handleInputChange} className="px-4 py-3 border rounded-lg" placeholder="From Date" />
                  <DateInput type="date" name="dateRangeTo" value={formData.dateRangeTo} onChange={handleInputChange} className="px-4 py-3 border rounded-lg" placeholder="To Date" />
                </div>
                <select name="callType" value={formData.callType} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg">
                  <option value="All">All Calls</option>
                  <option value="Hot">Hot</option>
                  <option value="Cold">Cold</option>
                  <option value="Close">Close</option>
                  <option value="Follow Up">Follow Up</option>
                </select>
              </div>
            </div>
          </div>

          {/* Renewal Calls */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Renewal Calls</h2>
            <div className="flex items-center gap-4">
              <input type="month" name="renewalMonth" value={formData.renewalMonth} onChange={handleInputChange} className="flex-1 px-4 py-3 border rounded-lg" />
              <button onClick={loadRenewalDoctors} disabled={loadingRenewal} className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-60">
                {loadingRenewal ? 'Loading...' : 'Load Doctors'}
              </button>
            </div>
            {renewalDoctors.length > 0 && <p className="mt-3 text-green-700 font-bold text-lg">Loaded: {renewalDoctors.length} Renewal Doctors</p>}
          </div>

          {/* Service Calls */}
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Calls (Close Doctors)</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <DateInput type="date" name="serviceDateFrom" value={formData.serviceDateFrom} onChange={handleInputChange} className="px-4 py-3 border rounded-lg" />
              <DateInput type="date" name="serviceDateTo" value={formData.serviceDateTo} onChange={handleInputChange} className="px-4 py-3 border rounded-lg" />
            </div>
            <button onClick={loadServiceDoctors} disabled={loadingService} className="w-full px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-60">
              {loadingService ? 'Loading...' : 'Load Service Doctors'}
            </button>
            {serviceDoctors.length > 0 && <p className="mt-3 text-purple-700 font-bold text-lg text-center">Loaded: {serviceDoctors.length} Service Doctors</p>}
          </div>

          {/* Task Description & Priority */}
          <div className="bg-red-50 rounded-lg p-6 border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Description & Priority</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              placeholder="Yahan task ka full description likho... (yeh mandatory hai)"
              className="w-full px-4 py-3 border rounded-lg resize-none text-lg"
            />
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select value={formData.priority === 'medium' ? 'Normal' : 'High'} onChange={handlePriorityChange} className="w-full px-4 py-3 border rounded-lg text-lg">
                  <option>Normal</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline (Optional)</label>
                <DateInput type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg text-lg" />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-6 pt-6 border-t">
            <button type="button" className="px-10 py-4 bg-gray-600 text-white text-lg font-medium rounded-lg hover:bg-gray-700">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={submitting}
              className="px-12 py-4 bg-green-600 text-white text-xl font-bold rounded-lg hover:bg-green-700 disabled:opacity-60 shadow-lg"
            >
              {submitting ? 'Assigning Task...' : 'Assign Task Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;