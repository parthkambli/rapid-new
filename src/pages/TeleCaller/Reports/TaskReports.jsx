// import React, { useState, useEffect } from 'react';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const TelecallerTaskReport = () => {
//   // State for tasks and filters
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Filter states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [taskType, setTaskType] = useState('All Task Types');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All Status');

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       // const response = await apiClient.get(apiEndpoints.tasks.list); // Get assigned tasks
//       const response = await apiClient.get(apiEndpoints.tasks.getOtherTask); // Get assigned tasks

//       if (response.data.success) {
//         // Map the API response to the format expected by the UI
//         const mappedTasks = response.data.data.map((task, index) => ({
//           id: task._id || `T-${index + 101}`,
//           task: task.title || task.description || "Task",
//           label: task.taskType || "Call",
//           code: task.taskId || task.code || `T-${index + 101}`,
//           doctor: task.doctor?.name || task.doctorName || "N/A",
//           hospital: task.hospital?.name || task.hospitalName || "N/A",
//           contact: task.doctor?.mobile || task.contact || "N/A",
//           assigned: task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//           due: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//           followup: task.followupNotes || "",
//           status: task.status || "Pending",
//         }));

//         setTasks(mappedTasks);
//         setFilteredTasks(mappedTasks);
//       } else {
//         toast.error("Failed to load task data");
//       }
//     } catch (error) {
//       console.error("Error fetching task data:", error);
//       setError("Failed to load task data");
//       toast.error("Failed to load task data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Apply filters
//   const applyFilters = () => {
//     let filtered = tasks;

//     // Filter by search term
//     if (searchTerm) {
//       filtered = filtered.filter(task =>
//         task.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         task.hospital.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Filter by task type
//     if (taskType !== 'All Task Types') {
//       filtered = filtered.filter(task => task.label === taskType);
//     }

//     // Filter by date range
//     if (fromDate) {
//       filtered = filtered.filter(task => task.assigned >= fromDate);
//     }
//     if (toDate) {
//       filtered = filtered.filter(task => task.due <= toDate);
//     }

//     // Filter by status
//     if (status !== 'All Status') {
//       filtered = filtered.filter(task => task.status === status);
//     }

//     setFilteredTasks(filtered);
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setSearchTerm('');
//     setTaskType('All Task Types');
//     setFromDate('');
//     setToDate('');
//     setStatus('All Status');
//     setFilteredTasks(tasks);
//   };

//   // Update follow-up note
//   const updateFollowup = async (id, newFollowup) => {
//     try {
//       const response = await apiClient.put(`${apiEndpoints.tasks.update(id)}`, {
//         followupNotes: newFollowup
//       });

//       if (response.data.success) {
//         // Update local state
//         const updatedTasks = tasks.map(task =>
//           task.id === id ? { ...task, followup: newFollowup } : task
//         );
//         setTasks(updatedTasks);

//         // Also update filtered tasks if needed
//         const updatedFilteredTasks = filteredTasks.map(task =>
//           task.id === id ? { ...task, followup: newFollowup } : task
//         );
//         setFilteredTasks(updatedFilteredTasks);

//         toast.success("Follow-up updated successfully");
//       } else {
//         throw new Error(response.data.message || "Failed to update follow-up");
//       }
//     } catch (error) {
//       console.error("Error updating follow-up:", error);
//       toast.error("Failed to update follow-up");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading tasks...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen p-4 md:p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">Telecaller Task Report</h1>
//             <p className="text-gray-600 mt-1">
//               View and manage assigned telecaller tasks. Filter by task type, doctor/hospital, date, or status to track progress and follow-ups.
//             </p>
//           </div>

//           <div className="text-red-500 text-center p-4 bg-red-50 rounded">
//             {error}
//             <button
//               onClick={fetchTasks}
//               className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 md:p-6 max-w-[79vw]">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Telecaller Task Report</h1>
//           <p className="text-gray-600 mt-1">
//             View and manage assigned telecaller tasks. Filter by task type, doctor/hospital, date, or status to track progress and follow-ups.
//           </p>
//         </div>

//         {/* Filter Section */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             {/* Search doctor/hospital */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Search doctor / hospital
//               </label>
//               <input
//                 type="text"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 placeholder="e.g. Dr. Sharma"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* Task Type */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Task Type
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 value={taskType}
//                 onChange={(e) => setTaskType(e.target.value)}
//               >
//                 <option value="All Task Types">All Task Types</option>
//                 <option value="Call">Renewal Reminder</option>
//                 <option value="Create Quotation">Create Quotation</option>
//                 <option value="Create Sales Bill">Create Sales Bill</option>
//                 <option value="Collect Documents">Collect Documents</option>
//                 <option value="Renewal">Renewal</option>
//               </select>
//             </div>

//             {/* Date Range */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Date Range
//               </label>
//               <div className="flex space-x-2">
//                 <input
//                   type="date"
//                   className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="From"
//                   value={fromDate}
//                   onChange={(e) => setFromDate(e.target.value)}
//                 />
//                 <input
//                   type="date"
//                   className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="To"
//                   value={toDate}
//                   onChange={(e) => setToDate(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Status */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//               >
//                 <option value="All Status">All Status</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>
//           </div>

//           {/* Filter Buttons */}
//           <div className="flex justify-end space-x-3 mt-4">
//             <button
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//               onClick={resetFilters}
//             >
//               Reset
//             </button>
//             <button
//               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//               onClick={applyFilters}
//             >
//               Apply
//             </button>
//           </div>
//         </div>

//         {/* Task Table */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-green-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Task
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Doctor / Hospital
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Contact
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Assigned / Due
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Follow-up
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredTasks.length > 0 ? (
//                   filteredTasks.map((task) => (
//                     <tr key={task.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {task.task}
//                         </div>
//                         <div className="flex items-center mt-1">
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-gray-800">
//                             {task.label}
//                           </span>
//                           <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800">
//                             {task.code}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {task.doctor}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {task.hospital}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                         {task.contact}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           Assigned: {task.assigned}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           Due: {task.due}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <textarea
//                           className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
//                           rows="2"
//                           value={task.followup}
//                           onChange={(e) => updateFollowup(task.id, e.target.value)}
//                           placeholder="Enter follow-up notes"
//                         />
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             task.status === 'Pending'
//                               ? 'bg-yellow-100 text-yellow-800'
//                               : 'bg-green-100 text-green-800'
//                           }`}
//                         >
//                           {task.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
//                       No tasks found matching your filters.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TelecallerTaskReport;


















// import React, { useState, useEffect } from 'react';
// import apiClient, { apiEndpoints } from '../../../services/apiClient';
// import { toast } from 'react-toastify';

// const TelecallerTaskReport = () => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Filters
//   const [searchTerm, setSearchTerm] = useState('');
//   const [taskType, setTaskType] = useState('All Task Types');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All Status');

//   useEffect(() => {
//     fetchAllTasks();
//   }, []);

//   const fetchAllTasks = async () => {
//     try {
//       setLoading(true);

//       // 1. Call Tasks (telecallertask API)
//       const callResponse = await apiClient.get(apiEndpoints.tasks.getCallingList); // '/tasks/telecallertask'
//       const callTasks = callResponse.data.success ? callResponse.data.data : [];

//       // 2. Other Tasks (jo pehle se chal raha tha)
//       const otherResponse = await apiClient.get(apiEndpoints.tasks.getOtherTask);
//       const otherTasks = otherResponse.data.success ? otherResponse.data.data : [];

//       // Map Call Tasks
//       const mappedCallTasks = callTasks.map(item => {
//         const doctor = item.doctor || {};
//         const source = item.allSources?.[0] || {};
//         const scheduledDate = source.scheduledDate ? new Date(source.scheduledDate) : new Date();

//         return {
//           id: item.taskId + '-' + doctor._id,
//           task: source.taskTitle || 'Call Task',
//           label: source.label || 'Service Call',
//           code: item.taskId,
//           doctor: doctor.fullName?.trim() || '-',
//           hospital: doctor.hospitalName?.trim() || '-',
//           contact: doctor.phoneNumber || doctor.whatsappNumber || '-',
//           assigned: scheduledDate.toISOString().split('T')[0],
//           due: scheduledDate.toISOString().split('T')[0],
//           followup: '',
//           status: item.doctorTaskStatus === 'completed' ? 'Completed' : 'Pending',
//           type: 'call'
//         };
//       });

//       // Map Other Tasks
//       const mappedOtherTasks = otherTasks.map((task, index) => ({
//         id: task._id || `other-${index}`,
//         task: task.title || task.description || 'Other Task',
//         label: 'Other',
//         code: task.taskId || task.code || `O-${index + 101}`,
//         doctor: task.doctor?.name || task.doctorName || '-',
//         hospital: task.hospital?.name || task.hospitalName || '-',
//         contact: task.doctor?.mobile || task.contact || '-',
//         assigned: task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : '-',
//         due: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '-',
//         followup: task.followupNotes || '',
//         status: task.status || 'Pending',
//         type: 'other'
//       }));

//       // Combine both
//       const combined = [...mappedCallTasks, ...mappedOtherTasks];
//       setTasks(combined);
//       setFilteredTasks(combined);

//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//       toast.error("Failed to load tasks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...tasks];

//     if (searchTerm) {
//       filtered = filtered.filter(t =>
//         t.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         t.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         t.contact.includes(searchTerm)
//       );
//     }

//     if (taskType !== 'All Task Types') {
//       filtered = filtered.filter(t => t.label === taskType);
//     }

//     if (fromDate) {
//       filtered = filtered.filter(t => t.assigned >= fromDate);
//     }
//     if (toDate) {
//       filtered = filtered.filter(t => t.due <= toDate);
//     }

//     if (status !== 'All Status') {
//       filtered = filtered.filter(t => t.status === status);
//     }

//     setFilteredTasks(filtered);
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setTaskType('All Task Types');
//     setFromDate('');
//     setToDate('');
//     setStatus('All Status');
//     setFilteredTasks(tasks);
//   };

//   // Follow-up update (only for Other tasks)
//   const updateFollowup = async (id, newNote) => {
//     // Only for other tasks
//     const task = tasks.find(t => t.id === id);
//     if (!task || task.type !== 'other') return;

//     try {
//       await apiClient.put(`${apiEndpoints.tasks.update(id)}`, { followupNotes: newNote });
//       const updated = tasks.map(t => t.id === id ? { ...t, followup: newNote } : t);
//       setTasks(updated);
//       setFilteredTasks(updated);
//       toast.success("Follow-up updated");
//     } catch (err) {
//       toast.error("Failed to update follow-up");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your tasks...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 md:p-6 max-w-[79vw]">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Telecaller Task Report</h1>
//           <p className="text-gray-600 mt-1">
//             All your calling tasks + other assigned tasks in one place.
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//               <input
//                 type="text"
//                 className="w-full border rounded-md px-3 py-2"
//                 placeholder="Doctor / Hospital / Mobile"
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
//               <select className="w-full border rounded-md px-3 py-2" value={taskType} onChange={e => setTaskType(e.target.value)}>
//                 <option value="All Task Types">All Task Types</option>
//                 <option>Salesman Added</option>
//                 <option>Renewal Call</option>
//                 <option>Service Call</option>
//                 <option>Other</option>
//               </select>
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//               <div className="flex gap-2">
//                 <input type="date" className="w-full border rounded-md px-3 py-2" value={fromDate} onChange={e => setFromDate(e.target.value)} />
//                 <input type="date" className="w-full border rounded-md px-3 py-2" value={toDate} onChange={e => setToDate(e.target.value)} />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select className="w-full border rounded-md px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
//                 <option value="All Status">All Status</option>
//                 <option>Pending</option>
//                 <option>Completed</option>
//               </select>
//             </div>
//           </div>
//           <div className="flex justify-end gap-3">
//             <button onClick={resetFilters} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Reset</button>
//             <button onClick={applyFilters} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Apply</button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-green-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Task</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Doctor / Hospital</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Contact</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Assigned / Due</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Follow-up</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredTasks.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                       No tasks found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredTasks.map(task => (
//                     <tr key={task.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">{task.task}</div>
//                         <div className="flex items-center gap-2 mt-1">
//                           <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             task.label === 'Other' ? 'bg-gray-100 text-gray-800' :
//                             task.label === 'Renewal Call' ? 'bg-purple-100 text-purple-800' :
//                             task.label === 'Salesman Added' ? 'bg-blue-100 text-blue-800' :
//                             'bg-green-100 text-green-800'
//                           }`}>
//                             {task.label}
//                           </span>
//                           <span className="text-xs text-gray-500">#{task.code.slice(-6)}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">{task.doctor}</div>
//                         <div className="text-sm text-gray-500">{task.hospital}</div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900 text-right">{task.contact}</td>
//                       <td className="px-6 py-4 text-sm">
//                         <div>Assigned: {task.assigned}</div>
//                         <div className="text-gray-500">Due: {task.due}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <textarea
//                           className="w-full border rounded px-2 py-1 text-sm"
//                           rows="2"
//                           value={task.followup}
//                           onChange={e => updateFollowup(task.id, e.target.value)}
//                           placeholder={task.type === 'call' ? 'Not editable for call tasks' : 'Add note...'}
//                           disabled={task.type === 'call'}
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {task.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TelecallerTaskReport;














import React, { useState, useEffect } from 'react';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { toast } from 'react-toastify';

const TelecallerTaskReport = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [taskType, setTaskType] = useState('All Task Types');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('All Status');

  useEffect(() => {
    fetchAllTasks();
  }, []);

  // Auto-apply filters when filter values change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, taskType, fromDate, toDate, status, tasks]);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);

      // 1. Call Tasks (from CallEntry system)
      const callResponse = await apiClient.get(apiEndpoints.tasks.getCallingList);
      const callTasks = callResponse.data.success ? callResponse.data.data : [];

      // 2. Other Tasks (from normal Task collection)
      const otherResponse = await apiClient.get(apiEndpoints.tasks.getOtherTask);
      const otherTasks = otherResponse.data.success ? otherResponse.data.data : [];

      // Map Call Tasks
      const mappedCallTasks = callTasks.map(item => {
        const doctor = item.doctor || {};
        const source = item.allSources?.[0] || {};
        const scheduledDate = source.scheduledDate ? new Date(source.scheduledDate) : new Date();

        return {
          id: item.taskId + '-' + doctor._id,
          task: source.taskTitle || 'Call Task',
          label: source.label || 'Call',
          code: item.taskId,
          doctor: doctor.fullName?.trim() || '-',
          hospital: doctor.hospitalName?.trim() || '-',
          contact: doctor.phoneNumber || doctor.whatsappNumber || '-',
          assigned: scheduledDate.toISOString().split('T')[0],
          due: scheduledDate.toISOString().split('T')[0],
          followup: '',
          status: item.doctorTaskStatus === 'completed' ? 'Completed' : 'Pending',
          type: 'call'
        };
      });

      // Map Other Tasks — YEH SABSE ZAROORI HAI
      const mappedOtherTasks = otherTasks.map((task, index) => {
        // Latest follow-up nikal lo
        const latestFollowUp = task.followUps && task.followUps.length > 0
          ? task.followUps[task.followUps.length - 1]
          : null;

        const latestNote = latestFollowUp?.note || latestFollowUp?.notes || '';
        const latestDate = latestFollowUp
          ? new Date(latestFollowUp.createdAt).toLocaleDateString('en-IN')
          : null;

        return {
          id: task._id,
          task: task.title || task.description || 'Other Task',
          label: 'Other',
          code: task._id.slice(-6).toUpperCase(),
          doctor: '-',
          hospital: '-',
          contact: '-',
          assigned: task.scheduledDate
            ? new Date(task.scheduledDate).toLocaleDateString('en-IN')
            : new Date(task.createdAt).toLocaleDateString('en-IN'),
          due: task.deadline
            ? new Date(task.deadline).toLocaleDateString('en-IN')
            : '-',
          followup: latestNote,
          followupDate: latestDate,
          status: task.status === 'completed' ? 'Completed' : 'Pending',
          type: 'other',
          rawTaskId: task._id  // update ke liye
        };
      });

      // Combine both
      const combined = [...mappedCallTasks, ...mappedOtherTasks];
      setTasks(combined);
      setFilteredTasks(combined);

    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Update follow-up for Other tasks
  const updateFollowup = async (taskId, newNote) => {
    if (!newNote.trim()) return;

    try {
      await apiClient.put(`/tasks/${taskId}`, {
        followupNote: newNote  // ya jo bhi field hai tere backend me
      });

      const updated = tasks.map(t =>
        t.rawTaskId === taskId
          ? {
              ...t,
              followup: newNote,
              followupDate: new Date().toLocaleDateString('en-IN')
            }
          : t
      );
      setTasks(updated);
      setFilteredTasks(updated);
      toast.success("Follow-up saved");
    } catch (err) {
      toast.error("Failed to save");
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Search filter - search across multiple fields
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        (t.doctor && t.doctor.toLowerCase().includes(searchTermLower)) ||
        (t.hospital && t.hospital.toLowerCase().includes(searchTermLower)) ||
        (t.contact && t.contact.includes(searchTerm)) ||
        (t.task && t.task.toLowerCase().includes(searchTermLower)) ||
        (t.code && t.code.toLowerCase().includes(searchTermLower))
      );
    }

    // Task type filter
    if (taskType !== 'All Task Types') {
      if (taskType === 'Other') {
        filtered = filtered.filter(t => t.type === 'other');
      } else {
        // Handle specific task labels
        filtered = filtered.filter(t =>
          (t.label && t.label.includes(taskType)) ||
          (t.label && t.label === taskType)
        );
      }
    }

    // Date range filters - handle different date formats
    if (fromDate) {
      filtered = filtered.filter(t => {
        if (!t.assigned || t.assigned === '-') return true; // If no assigned date, include the task
        // Parse the assigned date - it could be in DD/MM/YYYY format or ISO format
        let assignedDate;
        if (t.assigned.includes('/')) {
          // Format is DD/MM/YYYY, convert to YYYY-MM-DD for comparison
          const [day, month, year] = t.assigned.split('/');
          assignedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else {
          // Already in ISO format or similar, use as is
          assignedDate = new Date(t.assigned).toISOString().split('T')[0];
        }
        return assignedDate >= fromDate;
      });
    }

    if (toDate) {
      filtered = filtered.filter(t => {
        if (!t.due || t.due === '-') return true; // If no due date, include the task
        // Parse the due date - it could be in DD/MM/YYYY format or ISO format
        let dueDate;
        if (t.due && t.due.includes('/')) {
          // Format is DD/MM/YYYY, convert to YYYY-MM-DD for comparison
          const [day, month, year] = t.due.split('/');
          dueDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else if (t.due && t.due !== '-') {
          // Already in ISO format or similar, use as is
          dueDate = new Date(t.due).toISOString().split('T')[0];
        } else {
          return true; // If no due date, include the task
        }
        return dueDate <= toDate;
      });
    }

    // Status filter
    if (status !== 'All Status') {
      filtered = filtered.filter(t => t.status === status);
    }

    setFilteredTasks(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setTaskType('All Task Types');
    setFromDate('');
    setToDate('');
    setStatus('All Status');
    setFilteredTasks(tasks);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Telecaller Task Report</h1>
        <p className="text-gray-600 mb-6">All calling + office tasks in one place</p>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Search Doctor / Task..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />
            {/* <select value={taskType} onChange={e => setTaskType(e.target.value)} className="border rounded-lg px-4 py-2">
              <option>All Task Types</option>
              <option>Salesman Added</option>
              <option>Renewal Call</option>
              <option>Service Call</option>
              <option>Other</option>
            </select> */}
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border rounded-lg px-4 py-2" />
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border rounded-lg px-4 py-2" />
            <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded-lg px-4 py-2">
              <option>All Status</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={resetFilters} className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Reset</button>
            <button onClick={applyFilters} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Apply Filters</button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Task</th>
                <th className="px-6 py-4 text-left">Doctor / Hospital</th>
                <th className="px-6 py-4 text-left">Contact</th>
                <th className="px-6 py-4 text-left">Assigned / Due</th>
                <th className="px-6 py-4 text-left">Follow-up Notes</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 text-lg">
                    No tasks found
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium">{task.task}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.label === 'Other' ? 'bg-gray-100 text-gray-700' :
                          task.label.includes('Renewal') ? 'bg-purple-100 text-purple-700' :
                          task.label.includes('Salesman') ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.label}
                        </span>
                        <span className="text-xs text-gray-500">#{task.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{task.doctor}</div>
                      <div className="text-sm text-gray-500">{task.hospital}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{task.contact}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>{task.assigned}</div>
                      <div className="text-gray-500">Due: {task.due}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      {task.type === 'other' ? (
                        <div>
                          {task.followup ? (
                            <div className="">
                              {/* <p className="text-sm font-medium text-blue-900">{task.followup}</p> */}
                              {/* {task.followupDate && (
                                <p className="text-xs text-blue-600 mt-1">{task.followupDate}</p>
                              )} */}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm italic mb-2">No follow-up yet</p>
                          )}
                          <textarea
                            className="w-full cursor-not-allowed bg-gray-200 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            rows="2"
                            disabled
                            placeholder="Add new follow-up note..."
                            onBlur={(e) => {
                              if (e.target.value.trim() && e.target.value !== task.followup) {
                                updateFollowup(task.rawTaskId, e.target.value.trim());
                              }
                            }}
                            defaultValue={task.followup}
                          />
                        </div>
                      ) : (
                        <div className="text-gray-500 italic text-sm">
                          Update from call log
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        task.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TelecallerTaskReport;