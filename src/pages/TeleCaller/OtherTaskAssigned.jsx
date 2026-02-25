// import React, { useState } from 'react';
// import Table from '../../components/mainComponents/Table'; // Assuming Table component is available

// const OtherTaskAssigned = () => {
//   const [data, setData] = useState([
//     { id: 1, task: "Follow up with Dr. Amit Sharma", followup: "" },
//     { id: 2, task: "Schedule meeting with Apollo Hospital", followup: "" },
//     { id: 3, task: "Send quotation to Max Healthcare", followup: "" },
//     { id: 4, task: "Call Dr. Priya Patel for feedback", followup: "" },
//   ]);

//   const extraColumns = [
//     {
//       header: "Followup",
//       render: (row, index) => (
//         <input
//           type="text"
//           value={row.followup}
//           onChange={(e) => {
//             const newData = [...data];
//             newData[index].followup = e.target.value;
//             setData(newData);
//           }}
//           className="w-full p-2 border border-[#15BBB3] rounded-lg text-sm text-gray-700 bg-[#F2F2F2]"
//           placeholder="Enter followup result"
//         />
//       ),
//     },
//   ];

//   return (
//     <div className="w-full bg-white p-6">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Task Assign</h2>
//       <div className="w-full overflow-x-auto">
//         <Table
//           data={data}
//           extraColumns={extraColumns}
//           expandedRow={() => null}
//         />
//       </div>
//     </div>
//   );
// };

// export default OtherTaskAssigned;


// import React, { useState } from "react";
// import Table from "../../components/mainComponents/Table";

// const OtherTaskAssigned = () => {
//   const [data, setData] = useState([
//     { id: 1, task: "Follow up with Dr. Amit Sharma" },
//     { id: 2, task: "Schedule meeting with Apollo Hospital" },
//     { id: 3, task: "Send quotation to Max Healthcare" },
//     { id: 4, task: "Call Dr. Priya Patel for feedback" },
//   ]);
  
//   // New: Separate state for followups (use an object keyed by id for scalability)
//   const [followups, setFollowups] = useState({});

//   const extraColumns = [
//     {
//       header: "Followup",
//       render: (row, index) => {
//         if (index === 0) {
//           return (
//             <input
//               type="text"
//               value={followups[row.id] || ""}
//               onChange={(e) => {
//                 setFollowups({
//                   ...followups,
//                   [row.id]: e.target.value,
//                 });
//               }}
//               className="w-full p-2 border border-[#15BBB3] rounded-lg text-sm text-gray-700 bg-[#F2F2F2]"
//               placeholder="Enter followup result"
//             />
//           );
//         }
//         return null; // Empty for other rows
//       },
//     },
//   ];

//   return (
//     <div className="w-full bg-white p-6">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">Other Task Assign</h2>
//       <div className="w-full overflow-x-auto">
//         <Table
//           data={data}
//           extraColumns={extraColumns}
//           expandedRow={() => null}
//         />
//       </div>
//     </div>
//   );
// };

// export default OtherTaskAssigned;





// import React, { useState, useEffect, useMemo } from 'react';
// import apiClient, { apiEndpoints } from '../../services/apiClient';
// import { toast } from 'react-toastify';

// const AssignedList = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [taskTypeFilter, setTaskTypeFilter] = useState('All Task Types');
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchTaskData();
//   }, []);

//   const fetchTaskData = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get(apiEndpoints.tasks.list); // Get assigned tasks

//       if (response.data.success) {
//         // Map the API response to the format expected by the UI
//         const mappedTasks = response.data.data.map(task => ({
//           id: task._id || `T-${Math.floor(Math.random() * 1000)}`,
//           task: task.title || task.description || "Task",
//           badges: [task.taskType || "Call"], // Map to badges
//           doctor: task.doctor?.name || task.doctorName || "N/A",
//           hospital: task.hospital?.name || task.hospitalName || "N/A",
//           contact: task.doctor?.mobile || task.contact || "N/A",
//           assignedDate: task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//           dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//           followup: task.followupNotes || "",
//           status: task.status || "Pending",
//         }));
//         setTasks(mappedTasks);
//       } else {
//         toast.error("Failed to load task data");
//       }
//     } catch (error) {
//       console.error("Error fetching task data:", error);
//       setError("Failed to load task data");
//       toast.error("Failed to load task data");

//       // Fallback to empty array so the component still works
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update task status in the backend
//   const updateTaskStatus = async (taskId, newStatus) => {
//     try {
//       const response = await apiClient.put(`${apiEndpoints.tasks.update(taskId)}`, {
//         status: newStatus
//       });

//       if (response.data.success) {
//         // Update local state
//         setTasks(prevTasks =>
//           prevTasks.map(task =>
//             task.id === taskId ? { ...task, status: newStatus } : task
//           )
//         );
//         toast.success("Task status updated successfully");
//       } else {
//         throw new Error(response.data.message || "Failed to update task status");
//       }
//     } catch (error) {
//       console.error("Error updating task status:", error);
//       toast.error("Failed to update task status");
//       // Revert the status in UI since API call failed
//       fetchTaskData(); // Refresh data to show correct status
//     }
//   };

//   // Update followup in the backend
//   const updateFollowup = async (taskId, newFollowup) => {
//     try {
//       const response = await apiClient.put(`${apiEndpoints.tasks.update(taskId)}`, {
//         followupNotes: newFollowup
//       });

//       if (response.data.success) {
//         // Update local state
//         setTasks(prevTasks =>
//           prevTasks.map(task =>
//             task.id === taskId ? { ...task, followup: newFollowup } : task
//           )
//         );
//         toast.success("Follow-up updated successfully");
//       } else {
//         throw new Error(response.data.message || "Failed to update follow-up");
//       }
//     } catch (error) {
//       console.error("Error updating follow-up:", error);
//       toast.error("Failed to update follow-up");
//       // Revert the followup in UI since API call failed
//       fetchTaskData(); // Refresh data to show correct followup
//     }
//   };

//   // Get unique task types from badges
//   const taskTypes = useMemo(() => {
//     const types = new Set();
//     tasks.forEach(task => {
//       if (task.badges && Array.isArray(task.badges)) {
//         task.badges.forEach(badge => types.add(badge));
//       }
//     });
//     return ['All Task Types', ...Array.from(types)];
//   }, [tasks]);

//   // Filter tasks based on search and task type
//   const filteredTasks = useMemo(() => {
//     return tasks.filter(task => {
//       const matchesSearch =
//         task.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         task.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         task.task.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesTaskType =
//         taskTypeFilter === 'All Task Types' ||
//         (task.badges && task.badges.includes(taskTypeFilter));

//       return matchesSearch && matchesTaskType;
//     });
//   }, [tasks, searchTerm, taskTypeFilter]);

//   const handleStatusChange = (taskId, newStatus) => {
//     updateTaskStatus(taskId, newStatus);
//   };

//   const handleFollowupChange = (taskId, newFollowup) => {
//     updateFollowup(taskId, newFollowup);
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setTaskTypeFilter('All Task Types');
//   };

//   // Get status badge class
//   const getStatusBadgeClass = (status) => {
//     return status === 'Pending'
//       ? 'bg-yellow-100 text-yellow-800'
//       : 'bg-green-100 text-green-800';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading tasks...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//         <div className="max-w-[79vw] mx-auto">
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">Assigned List</h1>
//             <p className="text-gray-600 mt-1">
//               Display and manage all tasks assigned to telecallers or sales staff.
//             </p>
//           </div>

//           <div className="text-red-500 text-center p-4 bg-red-50 rounded">
//             {error}
//             <button
//               onClick={fetchTaskData}
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
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-[79vw] mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Assigned List</h1>
//           <p className="text-gray-600 mt-1">
//             Display and manage all tasks assigned to telecallers or sales staff.
//           </p>
//         </div>

//         {/* Filter Section */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Search */}
//             <div className="lg:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Search
//               </label>
//               <input
//                 type="text"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 placeholder="Search by doctor / hospital"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* Task Type Filter */}
//             <div className="lg:col-span-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Task Type
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 value={taskTypeFilter}
//                 onChange={(e) => setTaskTypeFilter(e.target.value)}
//               >
//                 {taskTypes.map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Action Buttons */}
//             <div className="lg:col-span-1 flex items-end">
//               <button
//                 className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
//                 onClick={resetFilters}
//               >
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Table Section */}
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
//                   filteredTasks.map((task, index) => (
//                     <tr key={task.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
//                       {/* Task Column */}
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col space-y-2">
//                           <div className="text-sm font-medium text-gray-900">
//                             {task.task}
//                           </div>
//                           <div className="flex flex-wrap gap-1">
//                             {task.badges && Array.isArray(task.badges) ? (
//                               task.badges.map((badge, badgeIndex) => (
//                                 <span
//                                   key={badgeIndex}
//                                   className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
//                                 >
//                                   {badge}
//                                 </span>
//                               ))
//                             ) : (
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                 Call
//                               </span>
//                             )}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {task.id}
//                           </div>
//                         </div>
//                       </td>

//                       {/* Doctor/Hospital Column */}
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col">
//                           <div className="text-sm font-medium text-gray-900">
//                             {task.doctor}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {task.hospital}
//                           </div>
//                         </div>
//                       </td>

//                       {/* Contact Column */}
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {task.contact}
//                       </td>

//                       {/* Dates Column */}
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col space-y-1">
//                           <div className="text-sm text-gray-900">
//                             <span className="text-xs text-gray-500">Assigned: </span>
//                             {task.assignedDate}
//                           </div>
//                           <div className="text-sm text-gray-900">
//                             <span className="text-xs text-gray-500">Due: </span>
//                             {task.dueDate}
//                           </div>
//                         </div>
//                       </td>

//                       {/* Follow-up Column */}
//                       <td className="px-6 py-4">
//                         <input
//                           type="text"
//                           className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                           placeholder="Type follow-up..."
//                           value={task.followup}
//                           onChange={(e) => handleFollowupChange(task.id, e.target.value)}
//                         />
//                       </td>

//                       {/* Status Column */}
//                       <td className="px-6 py-4">
//                         <select
//                           value={task.status}
//                           onChange={(e) => handleStatusChange(task.id, e.target.value)}
//                           className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
//                             task.status === 'Pending'
//                               ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
//                               : 'bg-green-100 text-green-800 border-green-300'
//                           }`}
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="Completed">Completed</option>
//                         </select>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
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

// export default AssignedList;





































// import React, { useState, useEffect } from 'react';
// import apiClient, { apiEndpoints } from '../../services/apiClient';
// import { toast } from 'react-toastify';

// const AssignedList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [taskTypeFilter, setTaskTypeFilter] = useState('All Task Types');

//   useEffect(() => {
//     fetchTaskData();
//   }, []);

//   const fetchTaskData = async () => {
//     try {
//       setLoading(true);
//       const res = await apiClient.get(apiEndpoints.tasks.list);
//       if (res.data.success) {
//         const mapped = res.data.data.map(task => ({
//           id: task._id,
//           title: task.title || "Untitled Task",
//           taskType: task.priority || "medium",
//           doctor: task.relatedEntities?.find(e => e.entityType === 'Doctor')?.entityName || 
//                   task.doctors?.[0]?.name || "N/A",
//           assignedDate: task.scheduledDate ? new Date(task.scheduledDate).toLocaleDateString('en-IN') : "N/A",
//           dueDate: task.telecallerData.deadline ? new Date( task.telecallerData.deadline).toLocaleDateString('en-IN') : "N/A",
//           status: task.status === 'completed' || task.status === 'Completed' ? 'Completed' : 'Pending',
//           followUps: task.followUps || []
//         }));
//         setTasks(mapped);
//       }
//     } catch (err) {
//       toast.error("Failed to load tasks");
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add Follow-up
//   const addFollowUp = async (taskId, note) => {
//     try {
//       const res = await apiClient.put(apiEndpoints.tasks.update(taskId), {
//         followUpNote: note
//       });
//       if (res.data.success) {
//         setTasks(prev => prev.map(t =>
//           t.id === taskId ? { ...t, followUps: res.data.data.followUps || t.followUps } : t
//         ));
//         toast.success("Follow-up added!");
//       }
//     } catch (err) {
//       toast.error("Failed to save follow-up");
//     }
//   };

//   // Update Status (with optional follow-up)
//   const updateStatusWithFollowUp = async (taskId, newStatus, followUpNote = "") => {
//     try {
//       const payload = { status: newStatus };
//       if (followUpNote.trim()) {
//         payload.followUpNote = followUpNote.trim();
//       }

//       const res = await apiClient.put(apiEndpoints.tasks.update(taskId), payload);

//       if (res.data.success) {
//         setTasks(prev => prev.map(t => {
//           if (t.id === taskId) {
//             return {
//               ...t,
//               status: newStatus,
//               followUps: res.data.data.followUps || t.followUps
//             };
//           }
//           return t;
//         }));
//         toast.success(newStatus === 'Completed' ? "Task Completed!" : "Status updated");
//       }
//     } catch (err) {
//       toast.error("Update failed");
//       fetchTaskData();
//     }
//   };

//   const filteredTasks = tasks.filter(t =>
//     (t.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
//      t.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
//     (taskTypeFilter === 'All Task Types' || t.taskType === taskTypeFilter.toLowerCase())
//   );

//   if (loading) return <div className="p-20 text-center text-xl">Loading tasks...</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Assigned Tasks</h1>
//         <p className="text-gray-600 mb-6">Manage your daily calls & follow-ups</p>

//         {/* Filters */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <input
//               type="text"
//               placeholder="Search doctor or task..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
//             />
//             <select
//               value={taskTypeFilter}
//               onChange={e => setTaskTypeFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
//             >
//               <option>All Task Types</option>
//               <option>call</option>
//               <option>visit</option>
//               <option>meeting</option>
//               <option>followup</option>
//               <option>email</option>
//             </select>
//             <button
//               onClick={() => { setSearchTerm(''); setTaskTypeFilter('All Task Types'); }}
//               className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
//             >
//               Reset Filters
//             </button>
//           </div>
//         </div>

//         {/* Tasks Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-green-600 text-white">
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Task</th>
          
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Dates</th>
              
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Follow-up History</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredTasks.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-10 text-gray-500">
//                     No tasks found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredTasks.map(task => (
//                   <tr key={task.id} className="hover:bg-gray-50 transition">
//                     {/* Task */}
//                     <td className="px-6 py-4">
//                       <div className="font-semibold text-gray-900">{task.title}</div>
//                       <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
//                         {task.taskType}
//                       </span>
//                     </td>

//                     {/* Doctor */}
                  
//                     {/* Dates */}
//                     <td className="px-6 py-4 text-xs text-gray-600">
//                       <div>Assigned: {task.assignedDate}</div>
//                       {task.dueDate !== "N/A" && <div>Deadline: {task.dueDate}</div>}
//                     </td>






//                     {/* Follow-up Column */}
//                     <td className="px-6 py-4 max-w-xs">
//                       <div className="space-y-3">
//                         {/* History */}
//                         <div className="max-h-40 overflow-y-auto space-y-2 text-xs">
//                           {task.followUps.length > 0 ? (
//                             task.followUps
//                               .slice()
//                               .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//                               .map((f, i) => (
//                                 <div key={i} className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded">
//                                   <p className="font-medium text-gray-800">{f.note}</p>
//                                   <p className="text-gray-600">
//                                     {new Date(f.createdAt).toLocaleString('en-IN', {
//                                       day: '2-digit',
//                                       month: 'short',
//                                       hour: '2-digit',
//                                       minute: '2-digit'
//                                     })}
//                                     {f.createdByName && ` - ${f.createdByName}`}
//                                   </p>
//                                 </div>
//                               ))
//                           ) : (
//                             <p className="text-gray-400 italic">No follow-up yet</p>
//                           )}
//                         </div>

//                         {/* New Follow-up Input */}
//                         <input
//                           type="text"
//                           placeholder="Add follow-up & press Enter"
//                           className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
//                           onKeyDown={(e) => {
//                             if (e.key === 'Enter' && e.target.value.trim()) {
//                               addFollowUp(task.id, e.target.value.trim());
//                               e.target.value = '';
//                             }
//                           }}
//                         />
//                       </div>
//                     </td>

//                     {/* Status */}
//                     <td className="px-6 py-4">
//                       <select
//                         value={task.status}
//                         onChange={(e) => {
//                           const newStatus = e.target.value;
//                           const inputField = e.currentTarget.closest('tr').querySelector('input[placeholder*="Add follow-up"]');
//                           const pendingNote = inputField?.value || "";

//                           updateStatusWithFollowUp(task.id, newStatus, pendingNote);

//                           // Clear input after sending
//                           if (inputField) inputField.value = "";
//                         }}
//                         className={`px-4 py-2 rounded font-medium text-sm transition ${
//                           task.status === 'Completed'
//                             ? 'bg-green-100 text-green-800 border border-green-300'
//                             : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
//                         }`}
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Completed">Completed</option>
//                       </select>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignedList;






















// new


import React, { useState, useEffect } from 'react';
import apiClient, { apiEndpoints } from '../../services/apiClient';
import { toast } from 'react-toastify';

const AssignedList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [taskTypeFilter, setTaskTypeFilter] = useState('All Task Types');

  // Get current logged-in user ID from localStorage (persist:root)
  const getCurrentUserId = () => {
    try {
      const persistData = localStorage.getItem('persist:root');
      if (!persistData) return null;

      const parsed = JSON.parse(persistData);
      const authData = parsed.auth ? JSON.parse(parsed.auth) : null;
      
      return authData?.user?._id || null;
    } catch (err) {
      console.error("Error reading user from localStorage", err);
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (currentUserId) {
      fetchTaskData();
    } else {
      toast.error("User not logged in");
      setLoading(false);
    }
  }, [currentUserId]);

  const fetchTaskData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(apiEndpoints.tasks.list);
      if (res.data.success) {
        // Filter tasks jo sirf current user ko assigned hain
        const myTasks = res.data.data.filter(task => 
          task.assignedTo?._id === currentUserId
        );

        const mapped = myTasks.map(task => ({
          id: task._id,
          title: task.title || "Untitled Task",
          taskType: task.taskType || task.priority || "medium",
          doctor: task.relatedEntities?.find(e => e.entityType === 'Doctor')?.entityName || 
                  task.doctors?.[0]?.name || "N/A",
          assignedDate: task.scheduledDate ? new Date(task.scheduledDate).toLocaleDateString('en-IN') : "N/A",
          dueDate: task.telecallerData?.deadline ? new Date(task.telecallerData.deadline).toLocaleDateString('en-IN') : "N/A",
          status: task.status === 'completed' || task.status === 'Completed' ? 'Completed' : 'Pending',
          followUps: task.followUps || []
        }));
        setTasks(mapped);
      }
    } catch (err) {
      toast.error("Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Add Follow-up
  const addFollowUp = async (taskId, note) => {
    try {
      const res = await apiClient.put(apiEndpoints.tasks.update(taskId), {
        followUpNote: note
      });
      if (res.data.success) {
        setTasks(prev => prev.map(t =>
          t.id === taskId ? { ...t, followUps: res.data.data.followUps || t.followUps } : t
        ));
        toast.success("Follow-up added!");
      }
    } catch (err) {
      toast.error("Failed to save follow-up");
    }
  };

  // Update Status
  const updateStatusWithFollowUp = async (taskId, newStatus, followUpNote = "") => {
    try {
      const payload = { status: newStatus };
      if (followUpNote.trim()) {
        payload.followUpNote = followUpNote.trim();
      }

      const res = await apiClient.put(apiEndpoints.tasks.update(taskId), payload);

      if (res.data.success) {
        setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              status: newStatus,
              followUps: res.data.data.followUps || t.followUps
            };
          }
          return t;
        }));
        toast.success(newStatus === 'Completed' ? "Task Completed!" : "Status updated");
      }
    } catch (err) {
      toast.error("Update failed");
      fetchTaskData();
    }
  };

  const filteredTasks = tasks.filter(t =>
    (t.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
     t.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (taskTypeFilter === 'All Task Types' || t.taskType === taskTypeFilter.toLowerCase())
  );

  if (!currentUserId) {
    return <div className="p-20 text-center text-red-600">User not authenticated. Please login again.</div>;
  }

  if (loading) return <div className="p-20 text-center text-xl">Loading your tasks...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Assigned Tasks</h1>
        <p className="text-gray-600 mb-6">Only tasks assigned to you are shown</p>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search doctor or task..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
            <select
              value={taskTypeFilter}
              onChange={e => setTaskTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option>All Task Types</option>
              <option>call</option>
              <option>visit</option>
              <option>meeting</option>
              <option>followup</option>
              <option>email</option>
              <option>other</option>
            </select>
            <button
              onClick={() => { setSearchTerm(''); setTaskTypeFilter('All Task Types'); }}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Task</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Dates</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Follow-up History</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    {tasks.length === 0 
                      ? "No tasks assigned to you yet" 
                      : "No tasks match your search"}
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{task.title}</div>
                      <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {task.taskType}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div>Assigned: {task.assignedDate}</div>
                      {task.dueDate !== "N/A" && <div>Deadline: {task.dueDate}</div>}
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <div className="space-y-3">
                        <div className="max-h-40 overflow-y-auto space-y-2 text-xs">
                          {task.followUps.length > 0 ? (
                            task.followUps
                              .slice()
                              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                              .map((f, i) => (
                                <div key={i} className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded">
                                  <p className="font-medium text-gray-800">{f.note}</p>
                                  <p className="text-gray-600">
                                    {new Date(f.createdAt).toLocaleString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                    {f.createdByName && ` - ${f.createdByName}`}
                                  </p>
                                </div>
                              ))
                          ) : (
                            <p className="text-gray-400 italic">No follow-up yet</p>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="Add follow-up & press Enter"
                          className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              addFollowUp(task.id, e.target.value.trim());
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          const inputField = e.currentTarget.closest('tr').querySelector('input[placeholder*="Add follow-up"]');
                          const pendingNote = inputField?.value || "";

                          updateStatusWithFollowUp(task.id, newStatus === 'Completed' ? 'completed' : 'pending', pendingNote);

                          if (inputField) inputField.value = "";
                        }}
                        className={`px-4 py-2 rounded font-medium text-sm transition ${
                          task.status === 'Completed'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
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

export default AssignedList;