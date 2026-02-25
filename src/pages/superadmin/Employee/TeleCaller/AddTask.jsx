
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';

// const AddTask = ({ isOpen, onClose, employee, onSave }) => {
//   const [formData, setFormData] = useState({
//     // General Info
//     telecallerName: '',
//     date: new Date().toISOString().split('T')[0],
//     dailyCallTarget: '',
    
//     // Call Data Source
//     salesmen: [],
//     dateRangeFrom: '',
//     dateRangeTo: '',
//     callType: 'all',
    
//     // Renewal Calls
//     renewalMonth: '',
    
//     // Service Calls
//     serviceDateFrom: '',
//     serviceDateTo: '',
//     serviceCallType: 'close',
    
//     // Additional Office Task
//     description: '',
//     priority: 'normal',
//     deadline: ''
//   });

//   const [salesmenList, setSalesmenList] = useState([]);
//   const [telecallersList, setTelecallersList] = useState([]);
//   const [activeSection, setActiveSection] = useState('general');

//   // Fetch salesmen and telecallers list
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch salesmen
//         const salesmenResponse = await apiClient.get(apiEndpoints.employees.byRole('salesman'));
//         if (salesmenResponse.data.success) {
//           setSalesmenList(salesmenResponse.data.data);
//         }

//         // Fetch telecallers
//         const telecallersResponse = await apiClient.get(apiEndpoints.employees.byRole('telecaller'));
//         if (telecallersResponse.data.success) {
//           setTelecallersList(telecallersResponse.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Set telecaller name when employee is selected
//   useEffect(() => {
//     if (employee) {
//       setFormData(prev => ({
//         ...prev,
//         telecallerName: employee._id
//       }));
//     }
//   }, [employee]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     if (type === 'checkbox') {
//       if (name === 'salesmen') {
//         setFormData(prev => ({
//           ...prev,
//           salesmen: checked 
//             ? [...prev.salesmen, value]
//             : prev.salesmen.filter(id => id !== value)
//         }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleSave = () => {
//     if (!formData.description.trim()) {
//       toast.error('Task description is required');
//       return;
//     }

//     if (!formData.telecallerName) {
//       toast.error('Please select a telecaller');
//       return;
//     }

//     onSave(formData, null);
//   };

//   if (!isOpen) return null;

//   const SectionHeader = ({ title, sectionKey, children }) => (
//     <div className="border border-gray-200 rounded-lg mb-4">
//       <div 
//         className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
//         onClick={() => setActiveSection(activeSection === sectionKey ? '' : sectionKey)}
//       >
//         <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
//         <span className="text-gray-600 text-lg">
//           {activeSection === sectionKey ? '▲' : '▼'}
//         </span>
//       </div>
//       {activeSection === sectionKey && (
//         <div className="p-6 bg-white">
//           {children}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
//           <h2 className="text-xl font-bold text-gray-800">
//             Add Task to Telecaller
//           </h2>
//           {employee && (
//             <p className="text-sm text-gray-600 mt-1">
//               For: {employee.fullName} ({employee.employeeId})
//             </p>
//           )}
//         </div>

//         {/* Body */}
//         <div className="px-6 py-4 space-y-4">
//           {/* 1. General Info */}
//           <SectionHeader title="1. General Info" sectionKey="general">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Telecaller Name *
//                 </label>
//                 <select
//                   name="telecallerName"
//                   value={formData.telecallerName}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="">Select Telecaller</option>
//                   {employee ? (
//                     <option value={employee._id}>
//                       {employee.employeeId} - {employee.fullName}
//                     </option>
//                   ) : (
//                     telecallersList.map(tc => (
//                       <option key={tc._id} value={tc._id}>
//                         {tc.employeeId} - {tc.fullName}
//                       </option>
//                     ))
//                   )}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Date *
//                 </label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
              
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Daily Call Target
//                 </label>
//                 <input
//                   type="number"
//                   name="dailyCallTarget"
//                   value={formData.dailyCallTarget}
//                   onChange={handleInputChange}
//                   placeholder="Enter target number"
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </SectionHeader>

//           {/* 2. Call Data Source */}
//           <SectionHeader title="2. Call Data Source" sectionKey="callData">
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   Salesmen (Multiple Selection)
//                 </label>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded">
//                   {salesmenList.map(salesman => (
//                     <label key={salesman._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
//                       <input
//                         type="checkbox"
//                         name="salesmen"
//                         value={salesman._id}
//                         checked={formData.salesmen.includes(salesman._id)}
//                         onChange={handleInputChange}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="text-sm text-gray-700">
//                         {salesman.employeeId} - {salesman.fullName}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date Range From
//                   </label>
//                   <input
//                     type="date"
//                     name="dateRangeFrom"
//                     value={formData.dateRangeFrom}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date Range To
//                   </label>
//                   <input
//                     type="date"
//                     name="dateRangeTo"
//                     value={formData.dateRangeTo}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Call Type
//                   </label>
//                   <select
//                     name="callType"
//                     value={formData.callType}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Calls</option>
//                     <option value="hot">Hot</option>
//                     <option value="cold">Cold</option>
//                     <option value="warm">Warm</option>
//                     <option value="followup">Follow Up</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </SectionHeader>

//           {/* 3. Renewal Calls */}
//           <SectionHeader title="3. Renewal Calls" sectionKey="renewal">
//             <div className="max-w-md">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Month for Renewal Calls
//               </label>
//               <input
//                 type="month"
//                 name="renewalMonth"
//                 value={formData.renewalMonth}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <p className="text-xs text-gray-500 mt-2">
//                 Select the month for which renewal calls need to be made
//               </p>
//             </div>
//           </SectionHeader>

//           {/* 4. Service Calls */}
//           <SectionHeader title="4. Service Calls" sectionKey="service">
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Service Date From
//                   </label>
//                   <input
//                     type="date"
//                     name="serviceDateFrom"
//                     value={formData.serviceDateFrom}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Service Date To
//                   </label>
//                   <input
//                     type="date"
//                     name="serviceDateTo"
//                     value={formData.serviceDateTo}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Service Call Type
//                   </label>
//                   <select
//                     name="serviceCallType"
//                     value={formData.serviceCallType}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="close">Close</option>
//                     <option value="followup">Follow Up</option>
//                     <option value="service">Service</option>
//                     <option value="support">Support</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </SectionHeader>

//           {/* 5. Additional Office Task */}
//           <SectionHeader title="5. Additional Office Task" sectionKey="additional">
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Task Description *
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows="4"
//                   placeholder="Enter detailed task description..."
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Priority Level
//                   </label>
//                   <select
//                     name="priority"
//                     value={formData.priority}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="normal">Normal</option>
//                     <option value="high">High</option>
//                     <option value="urgent">Urgent</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Deadline Date
//                   </label>
//                   <input
//                     type="date"
//                     name="deadline"
//                     value={formData.deadline}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </SectionHeader>
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
//           <button
//             onClick={handleSave}
//             className="px-8 py-3 bg-green-600 text-white text-base font-medium rounded hover:bg-green-700 transition-colors shadow-sm"
//           >
//             Assign Task
//           </button>
//           <button
//             onClick={onClose}
//             className="px-8 py-3 bg-gray-600 text-white text-base font-medium rounded hover:bg-gray-700 transition-colors"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTask;







// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';

// const AddTask = ({ isOpen, onClose, employee, onSave }) => {
//   const [formData, setFormData] = useState({
//     // General Info
//     telecallerName: '',
//     date: new Date().toISOString().split('T')[0],
//     dailyCallTarget: '',
    
//     // Call Data Source
//     salesmen: [],
//     dateRangeFrom: '',
//     dateRangeTo: '',
//     callType: 'All',
    
//     // Renewal Calls
//     renewalMonth: '',
    
//     // Service Calls
//     serviceDateFrom: '',
//     serviceDateTo: '',
//     serviceCallType: 'Close',
    
//     // Additional Office Task
//     description: '',
//     priority: 'Normal',
//     deadline: ''
//   });

//   const [salesmenList, setSalesmenList] = useState([]);
//   const [telecallersList, setTelecallersList] = useState([]);
//   const [activeSections, setActiveSections] = useState({
//     general: true,
//     callData: false,
//     renewal: false,
//     service: false,
//     additional: false
//   });

//   // Fetch salesmen and telecallers list
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch salesmen
//         const salesmenResponse = await apiClient.get(apiEndpoints.employees.byRole('salesman'));
//         if (salesmenResponse.data.success) {
//           setSalesmenList(salesmenResponse.data.data);
//         }

//         // Fetch telecallers
//         const telecallersResponse = await apiClient.get(apiEndpoints.employees.byRole('telecaller'));
//         if (telecallersResponse.data.success) {
//           setTelecallersList(telecallersResponse.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Set telecaller name when employee is selected
//   useEffect(() => {
//     if (employee) {
//       setFormData(prev => ({
//         ...prev,
//         telecallerName: employee._id
//       }));
//     }
//   }, [employee]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     if (type === 'checkbox') {
//       if (name === 'salesmen') {
//         setFormData(prev => ({
//           ...prev,
//           salesmen: checked 
//             ? [...prev.salesmen, value]
//             : prev.salesmen.filter(id => id !== value)
//         }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const toggleSection = (section) => {
//     setActiveSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       if (!formData.telecallerName) {
//         toast.error('Please select a telecaller');
//         return;
//       }

//       if (!formData.description.trim()) {
//         toast.error('Task description is required');
//         return;
//       }

//       // Prepare task data for backend
//       const taskPayload = {
//         title: formData.description.substring(0, 100),
//         description: formData.description,
//         taskType: 'telecaller_task',
//         priority: formData.priority.toLowerCase(),
//         scheduledDate: new Date().toISOString(),
//         employeeId: formData.telecallerName,
//         assignedToId: formData.telecallerName, // Same as employee for telecaller
//         notes: formData.description,
//         status: 'pending',
//         // Telecaller specific fields
//         telecallerData: {
//           dailyCallTarget: parseInt(formData.dailyCallTarget) || 0,
//           salesmen: formData.salesmen,
//           dateRangeFrom: formData.dateRangeFrom,
//           dateRangeTo: formData.dateRangeTo,
//           callType: formData.callType,
//           renewalMonth: formData.renewalMonth,
//           serviceDateFrom: formData.serviceDateFrom,
//           serviceDateTo: formData.serviceDateTo,
//           serviceCallType: formData.serviceCallType,
//           deadline: formData.deadline
//         }
//       };

//       // Call API to create task
//       const response = await apiClient.post('/tasks', taskPayload);
      
//       if (response.data.success) {
//         toast.success('Task assigned successfully');
//         onClose();
//         // Reset form
//         setFormData({
//           telecallerName: '',
//           date: new Date().toISOString().split('T')[0],
//           dailyCallTarget: '',
//           salesmen: [],
//           dateRangeFrom: '',
//           dateRangeTo: '',
//           callType: 'All',
//           renewalMonth: '',
//           serviceDateFrom: '',
//           serviceDateTo: '',
//           serviceCallType: 'Close',
//           description: '',
//           priority: 'Normal',
//           deadline: ''
//         });
//       }
//     } catch (error) {
//       console.error('Error creating task:', error);
//       toast.error('Failed to assign task');
//     }
//   };

//   if (!isOpen) return null;

//   const SectionHeader = ({ title, sectionKey, children }) => (
//     <div className="border border-gray-300 rounded-lg mb-4 bg-white">
//       <div 
//         className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-300"
//         onClick={() => toggleSection(sectionKey)}
//       >
//         <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
//         <span className="text-gray-600 text-lg font-bold">
//           {activeSections[sectionKey] ? '▲' : '▼'}
//         </span>
//       </div>
//       {activeSections[sectionKey] && (
//         <div className="p-6 bg-white">
//           {children}
//         </div>
//       )}
//     </div>
//   );

//   // Format date for display (DD/MM/YYYY)
//   const formatDateForDisplay = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB');
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-300 bg-blue-50">
//           <h2 className="text-xl font-bold text-gray-800">
//             Add Task to Telecaller
//           </h2>
//           {employee && (
//             <p className="text-sm text-gray-600 mt-1">
//               For: {employee.fullName} ({employee.employeeId})
//             </p>
//           )}
//         </div>

//         {/* Body */}
//         <div className="px-6 py-4 space-y-4">
//           {/* 1. General Info */}
//           <SectionHeader title="General Info" sectionKey="general">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Telecaller Name:
//                 </label>
//                 <select
//                   name="telecallerName"
//                   value={formData.telecallerName}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                   required
//                 >
//                   <option value="">Select Telecaller</option>
//                   {employee ? (
//                     <option value={employee._id}>
//                       {employee.employeeId} - {employee.fullName}
//                     </option>
//                   ) : (
//                     telecallersList.map(tc => (
//                       <option key={tc._id} value={tc._id}>
//                         {tc.employeeId} - {tc.fullName}
//                       </option>
//                     ))
//                   )}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Date:
//                 </label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <span className="text-xs text-gray-500 mt-1">
//                   {formatDateForDisplay(formData.date)}
//                 </span>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Daily Call Target:
//                 </label>
//                 <input
//                   type="number"
//                   name="dailyCallTarget"
//                   value={formData.dailyCallTarget}
//                   onChange={handleInputChange}
//                   placeholder="Enter target"
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </SectionHeader>

//           {/* 2. Call Data Source */}
//           <SectionHeader title="Call Data Source" sectionKey="callData">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Salesmen (Multiple):
//                 </label>
//                 <div className="max-h-32 overflow-y-auto border border-gray-300 rounded p-2">
//                   {salesmenList.map(salesman => (
//                     <label key={salesman._id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
//                       <input
//                         type="checkbox"
//                         name="salesmen"
//                         value={salesman._id}
//                         checked={formData.salesmen.includes(salesman._id)}
//                         onChange={handleInputChange}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="text-sm text-gray-700">
//                         {salesman.employeeId} - {salesman.fullName}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date Range From:
//                   </label>
//                   <input
//                     type="date"
//                     name="dateRangeFrom"
//                     value={formData.dateRangeFrom}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <span className="text-xs text-gray-500 mt-1">
//                     {formatDateForDisplay(formData.dateRangeFrom)}
//                   </span>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     To:
//                   </label>
//                   <input
//                     type="date"
//                     name="dateRangeTo"
//                     value={formData.dateRangeTo}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <span className="text-xs text-gray-500 mt-1">
//                     {formatDateForDisplay(formData.dateRangeTo)}
//                   </span>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Call Type:
//                 </label>
//                 <select
//                   name="callType"
//                   value={formData.callType}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="All">All</option>
//                   <option value="Hot">Hot</option>
//                   <option value="Cold">Cold</option>
//                   <option value="Warm">Warm</option>
//                   <option value="Follow Up">Follow Up</option>
//                 </select>
//               </div>
//             </div>
//           </SectionHeader>

//           {/* 3. Renewal Calls */}
//           <SectionHeader title="Renewal Calls" sectionKey="renewal">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Month:
//               </label>
//               <input
//                 type="month"
//                 name="renewalMonth"
//                 value={formData.renewalMonth}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </SectionHeader>

//           {/* 4. Service Calls */}
//           <SectionHeader title="Service Calls" sectionKey="service">
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date From:
//                   </label>
//                   <input
//                     type="date"
//                     name="serviceDateFrom"
//                     value={formData.serviceDateFrom}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <span className="text-xs text-gray-500 mt-1">
//                     {formatDateForDisplay(formData.serviceDateFrom)}
//                   </span>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     To:
//                   </label>
//                   <input
//                     type="date"
//                     name="serviceDateTo"
//                     value={formData.serviceDateTo}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <span className="text-xs text-gray-500 mt-1">
//                     {formatDateForDisplay(formData.serviceDateTo)}
//                   </span>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Call Type:
//                 </label>
//                 <select
//                   name="serviceCallType"
//                   value={formData.serviceCallType}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Close">Close</option>
//                   <option value="Follow Up">Follow Up</option>
//                   <option value="Service">Service</option>
//                   <option value="Support">Support</option>
//                 </select>
//               </div>
//             </div>
//           </SectionHeader>

//           {/* 5. Additional Office Task */}
//           <SectionHeader title="Additional Office Task" sectionKey="additional">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Task Description:
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows="3"
//                   placeholder="Enter task description"
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Priority Level:
//                   </label>
//                   <select
//                     name="priority"
//                     value={formData.priority}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="Normal">Normal</option>
//                     <option value="High">High</option>
//                     <option value="Urgent">Urgent</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Deadline Date:
//                   </label>
//                   <input
//                     type="date"
//                     name="deadline"
//                     value={formData.deadline}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <span className="text-xs text-gray-500 mt-1">
//                     {formatDateForDisplay(formData.deadline)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </SectionHeader>
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
//           <button
//             onClick={handleSave}
//             className="px-6 py-2 bg-green-600 text-white text-base font-medium rounded hover:bg-green-700 transition-colors shadow-sm"
//           >
//             Assign Task
//           </button>
//           <button
//             onClick={onClose}
//             className="px-6 py-2 bg-gray-600 text-white text-base font-medium rounded hover:bg-gray-700 transition-colors"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTask;







// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';

// const AddTask = ({ isOpen, onClose, employee, onSave }) => {
//   const [formData, setFormData] = useState({
//     // General Info
//     telecallerName: '',
//     date: new Date().toISOString().split('T')[0],
//     dailyCallTarget: '',
    
//     // Call Data Source
//     salesmen: [],
//     dateRangeFrom: '',
//     dateRangeTo: '',
//     callType: 'All',
    
//     // Renewal Calls
//     renewalMonth: '',
    
//     // Service Calls
//     serviceDateFrom: '',
//     serviceDateTo: '',
//     serviceCallType: 'Close',
    
//     // Additional Office Task
//     description: '',
//     priority: 'Normal',
//     deadline: ''
//   });

//   const [salesmenList, setSalesmenList] = useState([]);
//   const [telecallersList, setTelecallersList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [activeSections, setActiveSections] = useState({
//     general: true,
//     callData: false,
//     renewal: false,
//     service: false,
//     additional: false
//   });

//   // Fetch salesmen and telecallers list
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         // Fetch salesmen
//         const salesmenResponse = await apiClient.get(apiEndpoints.employees.byRole('salesman'));
//         if (salesmenResponse.data.success) {
//           setSalesmenList(salesmenResponse.data.data);
//         }

//         // Fetch telecallers
//         const telecallersResponse = await apiClient.get(apiEndpoints.employees.byRole('telecaller'));
//         if (telecallersResponse.data.success) {
//           setTelecallersList(telecallersResponse.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error('Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (isOpen) {
//       fetchData();
//     }
//   }, [isOpen]);

//   // Set telecaller name when employee is selected
//   useEffect(() => {
//     if (employee) {
//       setFormData(prev => ({
//         ...prev,
//         telecallerName: employee._id
//       }));
//     }
//   }, [employee]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     if (type === 'checkbox') {
//       if (name === 'salesmen') {
//         setFormData(prev => ({
//           ...prev,
//           salesmen: checked 
//             ? [...prev.salesmen, value]
//             : prev.salesmen.filter(id => id !== value)
//         }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const toggleSection = (section) => {
//     setActiveSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       if (!formData.telecallerName) {
//         toast.error('Please select a telecaller');
//         return;
//       }

//       if (!formData.description.trim()) {
//         toast.error('Task description is required');
//         return;
//       }

//       // Prepare task data for backend
//       const taskPayload = {
//         title: formData.description.substring(0, 100),
//         description: formData.description,
//         taskType: 'telecaller_task',
//         priority: formData.priority.toLowerCase(),
//         scheduledDate: new Date().toISOString(),
//         employeeId: formData.telecallerName,
//         assignedToId: formData.telecallerName,
//         notes: formData.description,
//         status: 'pending',
//         // Telecaller specific fields
//         telecallerData: {
//           dailyCallTarget: parseInt(formData.dailyCallTarget) || 0,
//           salesmen: formData.salesmen,
//           dateRangeFrom: formData.dateRangeFrom,
//           dateRangeTo: formData.dateRangeTo,
//           callType: formData.callType,
//           renewalMonth: formData.renewalMonth,
//           serviceDateFrom: formData.serviceDateFrom,
//           serviceDateTo: formData.serviceDateTo,
//           serviceCallType: formData.serviceCallType,
//           deadline: formData.deadline
//         }
//       };

//       // Call API to create task
//       const response = await apiClient.post('/tasks', taskPayload);
      
//       if (response.data.success) {
//         toast.success('Task assigned successfully');
//         onClose();
//         // Reset form
//         setFormData({
//           telecallerName: '',
//           date: new Date().toISOString().split('T')[0],
//           dailyCallTarget: '',
//           salesmen: [],
//           dateRangeFrom: '',
//           dateRangeTo: '',
//           callType: 'All',
//           renewalMonth: '',
//           serviceDateFrom: '',
//           serviceDateTo: '',
//           serviceCallType: 'Close',
//           description: '',
//           priority: 'Normal',
//           deadline: ''
//         });
//       }
//     } catch (error) {
//       console.error('Error creating task:', error);
//       toast.error('Failed to assign task');
//     }
//   };

//   const handleClose = () => {
//     setFormData({
//       telecallerName: '',
//       date: new Date().toISOString().split('T')[0],
//       dailyCallTarget: '',
//       salesmen: [],
//       dateRangeFrom: '',
//       dateRangeTo: '',
//       callType: 'All',
//       renewalMonth: '',
//       serviceDateFrom: '',
//       serviceDateTo: '',
//       serviceCallType: 'Close',
//       description: '',
//       priority: 'Normal',
//       deadline: ''
//     });
//     onClose();
//   };

//   if (!isOpen) return null;

//   const SectionHeader = ({ title, sectionKey, children }) => (
//     <div className="border border-gray-300 rounded-lg mb-4 bg-white">
//       <div 
//         className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-300"
//         onClick={() => toggleSection(sectionKey)}
//       >
//         <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
//         <span className="text-gray-600 text-lg font-bold">
//           {activeSections[sectionKey] ? '▲' : '▼'}
//         </span>
//       </div>
//       {activeSections[sectionKey] && (
//         <div className="p-6 bg-white">
//           {children}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-300 bg-blue-50">
//           <h2 className="text-xl font-bold text-gray-800">
//             Add Task to Telecaller
//           </h2>
//           {employee && (
//             <p className="text-sm text-gray-600 mt-1">
//               For: {employee.fullName} ({employee.employeeId})
//             </p>
//           )}
//         </div>

//         {/* Body */}
//         <div className="px-6 py-4 space-y-4">
//           {loading ? (
//             <div className="flex justify-center items-center h-32">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             </div>
//           ) : (
//             <>
//               {/* 1. General Info */}
//               <SectionHeader title="General Info" sectionKey="general">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Telecaller Name:
//                     </label>
//                     <select
//                       name="telecallerName"
//                       value={formData.telecallerName}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                       required
//                     >
//                       <option value="">Select Telecaller</option>
//                       {employee ? (
//                         <option value={employee._id}>
//                           {employee.employeeId} - {employee.fullName}
//                         </option>
//                       ) : (
//                         telecallersList.map(tc => (
//                           <option key={tc._id} value={tc._id}>
//                             {tc.employeeId} - {tc.fullName}
//                           </option>
//                         ))
//                       )}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Date:
//                     </label>
//                     <input
//                       type="date"
//                       name="date"
//                       value={formData.date}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Daily Call Target:
//                     </label>
//                     <input
//                       type="number"
//                       name="dailyCallTarget"
//                       value={formData.dailyCallTarget}
//                       onChange={handleInputChange}
//                       placeholder="Enter target"
//                       className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
//               </SectionHeader>

//               {/* 2. Call Data Source */}
//               <SectionHeader title="Call Data Source" sectionKey="callData">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Salesmen (Multiple):
//                     </label>
//                     <div className="max-h-32 overflow-y-auto border border-gray-300 rounded p-2">
//                       {salesmenList.length > 0 ? (
//                         salesmenList.map(salesman => (
//                           <label key={salesman._id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
//                             <input
//                               type="checkbox"
//                               name="salesmen"
//                               value={salesman._id}
//                               checked={formData.salesmen.includes(salesman._id)}
//                               onChange={handleInputChange}
//                               className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                             />
//                             <span className="text-sm text-gray-700">
//                               {salesman.employeeId} - {salesman.fullName}
//                             </span>
//                           </label>
//                         ))
//                       ) : (
//                         <p className="text-sm text-gray-500 p-2">No salesmen found</p>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Date Range From:
//                       </label>
//                       <input
//                         type="date"
//                         name="dateRangeFrom"
//                         value={formData.dateRangeFrom}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         To:
//                       </label>
//                       <input
//                         type="date"
//                         name="dateRangeTo"
//                         value={formData.dateRangeTo}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Call Type:
//                     </label>
//                     <select
//                       name="callType"
//                       value={formData.callType}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="All">All</option>
//                       <option value="Hot">Hot</option>
//                       <option value="Cold">Cold</option>
//                       <option value="Warm">Warm</option>
//                       <option value="Follow Up">Follow Up</option>
//                     </select>
//                   </div>
//                 </div>
//               </SectionHeader>

//               {/* 3. Renewal Calls */}
//               <SectionHeader title="Renewal Calls" sectionKey="renewal">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Select Month:
//                   </label>
//                   <input
//                     type="month"
//                     name="renewalMonth"
//                     value={formData.renewalMonth}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </SectionHeader>

//               {/* 4. Service Calls */}
//               <SectionHeader title="Service Calls" sectionKey="service">
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Date From:
//                       </label>
//                       <input
//                         type="date"
//                         name="serviceDateFrom"
//                         value={formData.serviceDateFrom}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         To:
//                       </label>
//                       <input
//                         type="date"
//                         name="serviceDateTo"
//                         value={formData.serviceDateTo}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Call Type:
//                     </label>
//                     <select
//                       name="serviceCallType"
//                       value={formData.serviceCallType}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="Close">Close</option>
//                       <option value="Follow Up">Follow Up</option>
//                       <option value="Service">Service</option>
//                       <option value="Support">Support</option>
//                     </select>
//                   </div>
//                 </div>
//               </SectionHeader>

//               {/* 5. Additional Office Task */}
//               <SectionHeader title="Additional Office Task" sectionKey="additional">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Task Description:
//                     </label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       rows="3"
//                       placeholder="Enter task description"
//                       className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Priority Level:
//                       </label>
//                       <select
//                         name="priority"
//                         value={formData.priority}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="Normal">Normal</option>
//                         <option value="High">High</option>
//                         <option value="Urgent">Urgent</option>
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Deadline Date:
//                       </label>
//                       <input
//                         type="date"
//                         name="deadline"
//                         value={formData.deadline}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </SectionHeader>
//             </>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="px-6 py-2 bg-green-600 text-white text-base font-medium rounded hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
//           >
//             {loading ? 'Assigning...' : 'Assign Task'}
//           </button>
//           <button
//             onClick={handleClose}
//             disabled={loading}
//             className="px-6 py-2 bg-gray-600 text-white text-base font-medium rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTask;



// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';

// const AddTask = () => {
//   const [formData, setFormData] = useState({
//     // General Info
//     telecallerName: '',
//     date: new Date().toISOString().split('T')[0],
//     dailyCallTarget: '',
    
//     // Call Data Source
//     salesmen: [],
//     dateRangeFrom: '',
//     dateRangeTo: '',
//     callType: 'All',
    
//     // Renewal Calls
//     renewalMonth: '',
    
//     // Service Calls
//     serviceDateFrom: '',
//     serviceDateTo: '',
//     serviceCallType: 'Close',
    
//     // Additional Office Task
//     description: '',
//     priority: 'medium', // Changed to match schema enum
//     deadline: ''
//   });

//   const [salesmenList, setSalesmenList] = useState([]);
//   const [telecallersList, setTelecallersList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // Fetch salesmen and telecallers list
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch salesmen
//         const salesmenResponse = await apiClient.get(apiEndpoints.employees.byRole('salesman'));
//         if (salesmenResponse.data.success) {
//           setSalesmenList(salesmenResponse.data.data);
//         }

//         // Fetch telecallers
//         const telecallersResponse = await apiClient.get(apiEndpoints.employees.byRole('telecaller'));
//         if (telecallersResponse.data.success) {
//           setTelecallersList(telecallersResponse.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error('Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     if (type === 'checkbox') {
//       if (name === 'salesmen') {
//         setFormData(prev => ({
//           ...prev,
//           salesmen: checked 
//             ? [...prev.salesmen, value]
//             : prev.salesmen.filter(id => id !== value)
//         }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleSave = async () => {
//     try {
//       if (!formData.telecallerName) {
//         toast.error('Please select a telecaller');
//         return;
//       }

//       if (!formData.description.trim()) {
//         toast.error('Task description is required');
//         return;
//       }

//       setSubmitting(true);

//       // Get current user from localStorage
//       const currentUser = JSON.parse(localStorage.getItem('user'));
      
//       // Map frontend values to backend schema enum values
//       const priorityMap = {
//         'Normal': 'medium',
//         'High': 'high', 
//         'Urgent': 'urgent'
//       };

//       // Prepare task data for backend - MATCHING SCHEMA ENUM VALUES
//       const taskPayload = {
//         title: formData.description.substring(0, 100),
//         description: formData.description,
//         taskType: 'call', // Using 'call' instead of 'telecaller_task' to match schema
//         priority: priorityMap[formData.priority] || 'medium', // Map to schema enum
//         scheduledDate: new Date(formData.date).toISOString(),
//         employeeId: formData.telecallerName,
//         assignedToId: currentUser?._id || formData.telecallerName,
//         notes: formData.description,
//         status: 'pending',
//         // Store telecaller specific data in notes or separate field
//         telecallerData: {
//           dailyCallTarget: parseInt(formData.dailyCallTarget) || 0,
//           salesmen: formData.salesmen,
//           dateRangeFrom: formData.dateRangeFrom,
//           dateRangeTo: formData.dateRangeTo,
//           callType: formData.callType,
//           renewalMonth: formData.renewalMonth,
//           serviceDateFrom: formData.serviceDateFrom,
//           serviceDateTo: formData.serviceDateTo,
//           serviceCallType: formData.serviceCallType,
//           deadline: formData.deadline
//         }
//       };

//       console.log('Sending task data:', taskPayload);

//       // Call API to create task
//       const response = await apiClient.post('/tasks', taskPayload);
      
//       if (response.data.success) {
//         toast.success('Task assigned successfully');
        
//         // Reset form
//         setFormData({
//           telecallerName: '',
//           date: new Date().toISOString().split('T')[0],
//           dailyCallTarget: '',
//           salesmen: [],
//           dateRangeFrom: '',
//           dateRangeTo: '',
//           callType: 'All',
//           renewalMonth: '',
//           serviceDateFrom: '',
//           serviceDateTo: '',
//           serviceCallType: 'Close',
//           description: '',
//           priority: 'medium', // Reset to schema enum value
//           deadline: ''
//         });
//       }
//     } catch (error) {
//       console.error('Error creating task:', error);
//       if (error.response?.data?.message) {
//         toast.error(`Failed to assign task: ${error.response.data.message}`);
//       } else {
//         toast.error('Failed to assign task');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const SectionHeader = ({ title, children }) => (
//     <div className="border border-gray-300 rounded-lg mb-4 bg-white">
//       <div className="p-4 bg-gray-50 border-b border-gray-300">
//         <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
//       </div>
//       <div className="p-6 bg-white">
//         {children}
//       </div>
//     </div>
//   );

//   // Map backend priority values to display values
//   const getDisplayPriority = (value) => {
//     const priorityMap = {
//       'medium': 'Normal',
//       'high': 'High',
//       'urgent': 'Urgent'
//     };
//     return priorityMap[value] || 'Normal';
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Add Task to Telecaller</h1>
//         <p className="text-gray-600 mt-2">Assign tasks to telecallers with detailed information</p>
//       </div>

//       {/* Body */}
//       {loading ? (
//         <div className="flex justify-center items-center h-32">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           <span className="ml-2 text-gray-600">Loading...</span>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {/* 1. General Info */}
//           <SectionHeader title="General Info">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Telecaller Name:
//                 </label>
//                 <select
//                   name="telecallerName"
//                   value={formData.telecallerName}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                   required
//                 >
//                   <option value="">Select Telecaller</option>
//                   {telecallersList.map(tc => (
//                     <option key={tc._id} value={tc._id}>
//                       {tc.employeeId} - {tc.fullName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Date:
//                 </label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Daily Call Target:
//                 </label>
//                 <input
//                   type="number"
//                   name="dailyCallTarget"
//                   value={formData.dailyCallTarget}
//                   onChange={handleInputChange}
//                   placeholder="Enter target"
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </SectionHeader>

//           {/* 2. Call Data Source */}
//           <SectionHeader title="Call Data Source">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Salesmen (Multiple):
//                 </label>
//                 <div className="max-h-32 overflow-y-auto border border-gray-300 rounded p-2 bg-white">
//                   {salesmenList.length > 0 ? (
//                     salesmenList.map(salesman => (
//                       <label key={salesman._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
//                         <input
//                           type="checkbox"
//                           name="salesmen"
//                           value={salesman._id}
//                           checked={formData.salesmen.includes(salesman._id)}
//                           onChange={handleInputChange}
//                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                         />
//                         <span className="text-sm text-gray-700">
//                           {salesman.employeeId} - {salesman.fullName}
//                         </span>
//                       </label>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-500 p-2 text-center">No salesmen found</p>
//                   )}
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date Range From:
//                   </label>
//                   <input
//                     type="date"
//                     name="dateRangeFrom"
//                     value={formData.dateRangeFrom}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     To:
//                   </label>
//                   <input
//                     type="date"
//                     name="dateRangeTo"
//                     value={formData.dateRangeTo}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Call Type:
//                 </label>
//                 <select
//                   name="callType"
//                   value={formData.callType}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="All">All</option>
//                   <option value="Hot">Hot</option>
//                   <option value="Cold">Cold</option>
//                   <option value="Warm">Warm</option>
//                   <option value="Follow Up">Follow Up</option>
//                 </select>
//               </div>
//             </div>
//           </SectionHeader>

//           {/* 3. Renewal Calls */}
//           <SectionHeader title="Renewal Calls">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Month:
//               </label>
//               <input
//                 type="month"
//                 name="renewalMonth"
//                 value={formData.renewalMonth}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </SectionHeader>

//           {/* 4. Service Calls */}
//           <SectionHeader title="Service Calls">
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date From:
//                   </label>
//                   <input
//                     type="date"
//                     name="serviceDateFrom"
//                     value={formData.serviceDateFrom}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     To:
//                   </label>
//                   <input
//                     type="date"
//                     name="serviceDateTo"
//                     value={formData.serviceDateTo}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Call Type:
//                 </label>
//                 <select
//                   name="serviceCallType"
//                   value={formData.serviceCallType}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Close">Close</option>
//                   <option value="Follow Up">Follow Up</option>
//                   <option value="Service">Service</option>
//                   <option value="Support">Support</option>
//                 </select>
//               </div>
//             </div>
//           </SectionHeader>

//           {/* 5. Additional Office Task */}
//           <SectionHeader title="Additional Office Task">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Task Description:
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows="3"
//                   placeholder="Enter task description"
//                   className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Priority Level:
//                   </label>
//                   <select
//                     name="priority"
//                     value={getDisplayPriority(formData.priority)}
//                     onChange={(e) => {
//                       const priorityMap = {
//                         'Normal': 'medium',
//                         'High': 'high',
//                         'Urgent': 'urgent'
//                       };
//                       setFormData(prev => ({
//                         ...prev,
//                         priority: priorityMap[e.target.value] || 'medium'
//                       }));
//                     }}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="Normal">Normal</option>
//                     <option value="High">High</option>
//                     <option value="Urgent">Urgent</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Deadline Date:
//                   </label>
//                   <input
//                     type="date"
//                     name="deadline"
//                     value={formData.deadline}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </SectionHeader>

//           {/* Submit Button */}
//           <div className="flex justify-end gap-3 mt-6">
//             <button
//               onClick={handleSave}
//               disabled={submitting}
//               className="px-6 py-2 bg-green-600 text-white text-base font-medium rounded hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {submitting ? 'Assigning...' : 'Assign Task'}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddTask;




















import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from '../../../../services/apiClient';

const AddTask = () => {
  const [formData, setFormData] = useState({
    telecallerName: '',
    date: new Date().toISOString().split('T')[0],
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
  const loadServiceDoctors = async () => {
    if (!formData.serviceDateFrom || !formData.serviceDateTo) return toast.error('Both dates daalo');
    setLoadingService(true);
    try {
      const res = await apiClient.get(apiEndpoints.doctors.getCloseDoctorIdsOnly, {
        params: { fromDate: formData.serviceDateFrom, toDate: formData.serviceDateTo }
      });
      if (res.data.success && res.data.doctorIds?.length > 0) {
        setServiceDoctors(res.data.doctorIds);
        toast.success(`${res.data.doctorIds.length} service doctors loaded!`);
      } else {
        setServiceDoctors([]);
        toast.info('No service doctors found');
      }
    } catch (err) {
      toast.error('Service doctors load nahi hue');
      setServiceDoctors([]);
    } finally {
      setLoadingService(false);
    }
  };

  const handleSave = async () => {
    if (!formData.telecallerName) return toast.error('Telecaller select karo');
    if (!formData.description.trim()) return toast.error('Description daalo');

    const [userId, employeeId] = formData.telecallerName.split('|||');
    if (!userId || !employeeId) return toast.error("Telecaller selection galat hai!");

    if (formData.renewalMonth && renewalDoctors.length === 0) {
      return toast.error("Pehle renewal doctors load karo!");
    }
    if (formData.serviceDateFrom && formData.serviceDateTo && serviceDoctors.length === 0) {
      return toast.error("Pehle service doctors load karo!");
    }

    try {
      setSubmitting(true);

      const payload = {
        title: formData.description.substring(0, 100),
        description: formData.description,
        taskType: 'call',
        priority: formData.priority,
        scheduledDate: new Date(formData.date).toISOString(),
        assignedToId: userId,
        employeeId: employeeId,
        notes: formData.description,

        telecallerData: {
          dailyCallTarget: parseInt(formData.dailyCallTarget) || 0,
          salesmen: formData.salesmen.length > 0 ? formData.salesmen : undefined,
          dateRangeFrom: formData.dateRangeFrom || undefined,
          dateRangeTo: formData.dateRangeTo || undefined,
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
              dateRangeFrom: formData.serviceDateFrom,
              dateRangeTo: formData.serviceDateTo,
              doctors: serviceDoctors.map(id => ({ doctor: id }))
            }
          }),

          deadline: formData.deadline || undefined
        }
      };

      Object.keys(payload.telecallerData).forEach(key => {
        if (payload.telecallerData[key] === undefined) {
          delete payload.telecallerData[key];
        }
      });

      await apiClient.post('/tasks', payload);
      toast.success('Task successfully ban gaya!');

      // Reset form
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
        deadline: ''
      });
      setRenewalDoctors([]);
      setServiceDoctors([]);

    } catch (error) {
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
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" />
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
                  <input type="date" name="dateRangeFrom" value={formData.dateRangeFrom} onChange={handleInputChange} className="px-4 py-3 border rounded-lg" placeholder="From Date" />
                  <input type="date" name="dateRangeTo" value={formData.dateRangeTo} onChange={handleInputChange} className="px-4 py-3 border rounded-lg" placeholder="To Date" />
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
              <input type="date" name="serviceDateFrom" value={formData.serviceDateFrom} onChange={handleInputChange} className="px-4 py-3 border rounded-lg" />
              <input type="date" name="serviceDateTo" value={formData.serviceDateTo} onChange={handleInputChange} className="px-4 py-3 border rounded-lg" />
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
                <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg text-lg" />
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