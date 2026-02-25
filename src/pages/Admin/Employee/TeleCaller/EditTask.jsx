// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import apiClient from '../../../../services/apiClient';
// import DateInput from '../../../../components/DateInput/DateInput';

// const EditTask = () => {
//   const { taskId } = useParams();
//   const navigate = useNavigate();
  
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [telecallersList, setTelecallersList] = useState([]);
  
//   // Task data state
//   const [taskData, setTaskData] = useState(null);
  
//   // Editable fields state (ONLY THESE FIELDS)
//   const [formData, setFormData] = useState({
//     telecallerId: '',
//     telecallerName: '',
//     dailyCallTarget: '',
//     taskDescription: '',
//     priority: 'medium',
//     deadline: ''
//   });
  
//   // Non-editable fields (display only)
//   const [nonEditableFields, setNonEditableFields] = useState({
//     taskId: '',
//     createdDate: '',
//     createdBy: '',
//     taskStatus: '',
//     completedCalls: 0,
//     performanceMetrics: {}
//   });

//   // === FETCH TELE-CALLERS LIST ===
//   const fetchTelecallers = async () => {
//     try {
//       const res = await apiClient.get('/employees/role/telecaller');
//       if (res.data.success) {
//         setTelecallersList(res.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching telecallers:', error);
//     }
//   };

//   // === FETCH TASK DETAILS ===
//   const fetchTaskDetails = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch task by ID
//       const taskRes = await apiClient.get(`/tasks/${taskId}`);
      
//       if (!taskRes.data.success) {
//         toast.error('Task not found');
//         navigate('/admin/employee/Tellecaller');
//         return;
//       }

//       const task = taskRes.data.data;
      
//       // Set editable fields
//       setFormData({
//         telecallerId: task.assignedTo?._id || task.assignedTo || '',
//         telecallerName: task.assignedTo?._id || task.assignedTo || '', // For dropdown
//         dailyCallTarget: task.telecallerData?.dailyCallTarget || '',
//         taskDescription: task.description || '',
//         priority: task.priority || 'medium',
//         deadline: task.telecallerData?.deadline 
//           ? new Date(task.telecallerData.deadline).toISOString().split('T')[0]
//           : ''
//       });

//       // Set non-editable fields
//       setNonEditableFields({
//         taskId: task._id,
//         createdDate: task.createdAt 
//           ? new Date(task.createdAt).toLocaleDateString('en-GB')
//           : 'N/A',
//         createdBy: task.createdBy?.fullName || 'System',
//         taskStatus: task.status,
//         completedCalls: task.telecallerData?.doctors?.filter(d => d.status === 'completed').length || 0,
//         performanceMetrics: task.telecallerData?.performanceMetrics || {}
//       });

//       setTaskData(task);
      
//     } catch (error) {
//       console.error('Error fetching task:', error);
//       toast.error('Failed to load task details');
//       navigate('/admin/employee/Tellecaller');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTelecallers();
//     fetchTaskDetails();
//   }, [taskId]);

//   // === HANDLE INPUT CHANGES ===
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === 'telecallerName') {
//       // Find selected telecaller and set both ID and name
//       const selectedTelecaller = telecallersList.find(tc => tc._id === value || tc.user === value);
//       setFormData(prev => ({
//         ...prev,
//         telecallerName: value,
//         telecallerId: selectedTelecaller?.user || value
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   // === VALIDATION ===
//   const validateForm = () => {
//     if (!formData.telecallerId) {
//       toast.error('Please select a telecaller');
//       return false;
//     }
    
//     if (!formData.taskDescription.trim()) {
//       toast.error('Task description is required');
//       return false;
//     }
    
//     if (formData.dailyCallTarget && (isNaN(formData.dailyCallTarget) || formData.dailyCallTarget <= 0)) {
//       toast.error('Daily call target must be a positive number');
//       return false;
//     }
    
//     if (formData.deadline) {
//       const deadlineDate = new Date(formData.deadline);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       if (deadlineDate < today) {
//         toast.warning('Deadline is in the past. Are you sure?');
//       }
//     }
    
//     return true;
//   };

//   // === UPDATE TASK ===
//   const handleUpdateTask = async () => {
//     if (!validateForm()) return;
    
//     try {
//       setSubmitting(true);
      
//       // Prepare payload with ONLY editable fields
//       const payload = {
//         telecallerId: formData.telecallerId,
//         dailyCallTarget: parseInt(formData.dailyCallTarget) || 0,
//         taskDescription: formData.taskDescription.trim(),
//         priority: formData.priority,
//         deadline: formData.deadline || null
//       };

//       // Send update request
//       const response = await apiClient.put(
//         `/admin/employee/Tellecaller/edit-task/${taskId}`,
//         payload
//       );

//       if (response.data.success) {
//         toast.success('Task updated successfully!');
        
//         // Check if telecaller was changed
//         const oldTelecallerId = taskData.assignedTo?._id || taskData.assignedTo;
//         if (oldTelecallerId !== formData.telecallerId) {
//           toast.info('Task has been reassigned to new telecaller');
//         }
        
//         // Navigate back to task list
//         setTimeout(() => {
//           navigate('/admin/employee/Tellecaller');
//         }, 1500);
//       } else {
//         toast.error(response.data.message || 'Failed to update task');
//       }
      
//     } catch (error) {
//       console.error('Update task error:', error);
//       toast.error(error.response?.data?.message || 'Failed to update task');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // === CANCEL EDIT ===
//   const handleCancel = () => {
//     if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
//       navigate('/admin/employee/Tellecaller');
//     }
//   };

//   // === LOADING STATE ===
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading task details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
        
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">Edit Telecaller Task</h1>
//               <p className="text-gray-600 mt-1">
//                 Edit limited fields. Task ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{nonEditableFields.taskId}</span>
//               </p>
//             </div>
//             <button
//               onClick={handleCancel}
//               className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
//             >
//               Cancel
//             </button>
//           </div>
          
//           <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-yellow-700">
//                   <strong>Note:</strong> Only Telecaller Name, Daily Call Target, Description, Priority, and Deadline can be edited.
//                   Other fields are system-generated and read-only.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          
//           {/* Non-Editable Fields Section */}
//           <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
//             <h2 className="text-lg font-semibold text-gray-800 mb-3">Task Information (Read Only)</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Task ID</label>
//                 <p className="mt-1 text-gray-900 font-mono text-sm">{nonEditableFields.taskId}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Created Date</label>
//                 <p className="mt-1 text-gray-900">{nonEditableFields.createdDate}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Created By</label>
//                 <p className="mt-1 text-gray-900">{nonEditableFields.createdBy}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Current Status</label>
//                 <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                   nonEditableFields.taskStatus === 'completed' 
//                     ? 'bg-green-100 text-green-800'
//                     : nonEditableFields.taskStatus === 'in_progress'
//                     ? 'bg-yellow-100 text-yellow-800'
//                     : 'bg-blue-100 text-blue-800'
//                 }`}>
//                   {nonEditableFields.taskStatus?.replace('_', ' ').toUpperCase() || 'PENDING'}
//                 </span>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Completed Calls</label>
//                 <p className="mt-1 text-gray-900">{nonEditableFields.completedCalls}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Performance</label>
//                 <p className="mt-1 text-gray-900">
//                   {nonEditableFields.performanceMetrics.successRate 
//                     ? `${nonEditableFields.performanceMetrics.successRate}% Success Rate`
//                     : 'N/A'
//                   }
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Editable Fields Section */}
//           <div className="p-6 space-y-6">
//             <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Editable Fields</h2>
            
//             {/* Telecaller Name - REQUIRED */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Telecaller Name <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="telecallerName"
//                 value={formData.telecallerName}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               >
//                 <option value="">Select Telecaller</option>
//                 {telecallersList.map(tc => (
//                   <option 
//                     key={tc._id} 
//                     value={tc.user || tc._id}
//                   >
//                     {tc.employeeId} - {tc.fullName}
//                     {tc.user === taskData?.assignedTo?._id ? ' (Current)' : ''}
//                   </option>
//                 ))}
//               </select>
//               {formData.telecallerName !== (taskData?.assignedTo?._id || taskData?.assignedTo) && (
//                 <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
//                   <div className="flex items-center">
//                     <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                     </svg>
//                     <span className="text-blue-700 text-sm">
//                       <strong>Note:</strong> Changing telecaller will reassign this task to the selected telecaller.
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Daily Call Target */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Daily Call Target
//               </label>
//               <input
//                 type="number"
//                 name="dailyCallTarget"
//                 value={formData.dailyCallTarget}
//                 onChange={handleInputChange}
//                 min="1"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g., 50"
//               />
//               <p className="mt-1 text-sm text-gray-500">Positive number only</p>
//             </div>

//             {/* Task Description - REQUIRED */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Task Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="taskDescription"
//                 value={formData.taskDescription}
//                 onChange={handleInputChange}
//                 rows="4"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
//                 placeholder="Enter task description..."
//                 required
//               />
//             </div>

//             {/* Priority and Deadline */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Priority
//                 </label>
//                 <select
//                   name="priority"
//                   value={formData.priority}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                   <option value="urgent">Urgent</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Deadline (Optional)
//                 </label>
//                 <input
//                   type="date"
//                   name="deadline"
//                   value={formData.deadline}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//                 <p className="mt-1 text-sm text-gray-500">Future date preferred</p>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-8 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
//                 disabled={submitting}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdateTask}
//                 disabled={submitting || !formData.telecallerId || !formData.taskDescription.trim()}
//                 className="px-10 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {submitting ? 'Updating...' : 'Update Task'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Business Flow Explanation */}
//         <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
//           <h3 className="text-lg font-semibold text-blue-800 mb-3">Business Flow</h3>
//           <ul className="space-y-2 text-blue-700">
//             <li className="flex items-start">
//               <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span>Changing telecaller will automatically remove task from old telecaller and assign to new telecaller</span>
//             </li>
//             <li className="flex items-start">
//               <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span>Task can only exist under one telecaller at a time</span>
//             </li>
//             <li className="flex items-start">
//               <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span>If telecaller not changed, only editable fields will be updated</span>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditTask;



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from '../../../../services/apiClient';
import DateInput from '../../../../components/DateInput/DateInput';

const EditTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [telecallersList, setTelecallersList] = useState([]);
  
  const [taskData, setTaskData] = useState(null);
  
  const [formData, setFormData] = useState({
    telecallerId: '',
    telecallerName: '',
    dailyCallTarget: '',
    taskDescription: '',
    priority: 'medium',
    deadline: ''
  });
  
  const [nonEditableFields, setNonEditableFields] = useState({
    taskId: '',
    createdDate: '',
    createdBy: '',
    taskStatus: '',
    completedCalls: 0,
    performanceMetrics: {}
  });

  // === FETCH TELE-CALLERS LIST ===
  const fetchTelecallers = async () => {
    try {
      const res = await apiClient.get(apiEndpoints.employees.byRole('telecaller'));
      if (res.data.success) {
        setTelecallersList(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching telecallers:', error);
      toast.error('Failed to load telecallers list');
    }
  };

  // === FETCH TASK DETAILS ===
  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch task by ID
      const taskRes = await apiClient.get(apiEndpoints.tasks.get(taskId));
      
      if (!taskRes.data.success || !taskRes.data.data) {
        toast.error('Task not found');
        navigate('/admin/employee/Tellecaller');
        return;
      }

      const task = taskRes.data.data;
      console.log('Task data loaded:', task);
      
      // Set editable fields
      setFormData({
        telecallerId: task.assignedTo?._id || task.assignedTo || '',
        telecallerName: task.assignedTo?._id || task.assignedTo || '',
        dailyCallTarget: task.telecallerData?.dailyCallTarget || '',
        taskDescription: task.description || '',
        priority: task.priority || 'medium',
        deadline: task.telecallerData?.deadline 
          ? new Date(task.telecallerData.deadline).toISOString().split('T')[0]
          : ''
      });

      // Set non-editable fields
      setNonEditableFields({
        taskId: task._id,
        createdDate: task.createdAt 
          ? new Date(task.createdAt).toLocaleDateString('en-GB')
          : 'N/A',
        createdBy: task.createdBy?.fullName || 'System',
        taskStatus: task.status,
        completedCalls: task.telecallerData?.doctors?.filter(d => d.status === 'completed').length || 0,
        performanceMetrics: task.telecallerData?.performanceMetrics || {}
      });

      setTaskData(task);
      
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error('Failed to load task details');
      navigate('/admin/employee/Tellecaller');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelecallers();
    fetchTaskDetails();
  }, [taskId]);

  // === HANDLE INPUT CHANGES ===
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'telecallerName') {
      const selectedTelecaller = telecallersList.find(tc => tc._id === value || tc.user === value);
      setFormData(prev => ({
        ...prev,
        telecallerName: value,
        telecallerId: selectedTelecaller?.user || value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // === VALIDATION ===
  const validateForm = () => {
    if (!formData.telecallerId) {
      toast.error('Please select a telecaller');
      return false;
    }
    
    if (!formData.taskDescription.trim()) {
      toast.error('Task description is required');
      return false;
    }
    
    if (formData.dailyCallTarget && (isNaN(formData.dailyCallTarget) || formData.dailyCallTarget <= 0)) {
      toast.error('Daily call target must be a positive number');
      return false;
    }
    
    return true;
  };

  // === UPDATE TASK ===
  const handleUpdateTask = async () => {
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      const payload = {
        telecallerId: formData.telecallerId,
        dailyCallTarget: parseInt(formData.dailyCallTarget) || 0,
        taskDescription: formData.taskDescription.trim(),
        priority: formData.priority,
        deadline: formData.deadline || null
      };

      console.log('Updating task with:', payload);
      console.log('API Endpoint:', apiEndpoints.tasks.editTelecallerTask(taskId));

      // ✅ YEH NAYA ENDPOINT USE KARO
      const response = await apiClient.put(
        apiEndpoints.tasks.editTelecallerTask(taskId), // /tasks/:taskId/edit-telecaller
        payload
      );

      console.log('Update response:', response.data);

      if (response.data.success) {
        toast.success('Task updated successfully!');
        
        // Check if telecaller was changed
        const oldTelecallerId = taskData.assignedTo?._id || taskData.assignedTo;
        if (oldTelecallerId !== formData.telecallerId) {
          toast.info('Task has been reassigned to new telecaller');
        }
        
        // Navigate back
        setTimeout(() => {
          navigate('/admin/employee/Tellecaller');
        }, 1500);
      } else {
        toast.error(response.data.message || 'Failed to update task');
      }
      
    } catch (error) {
      console.error('Update task error:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  // === CANCEL EDIT ===
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/admin/employee/Tellecaller');
    }
  };

  // === LOADING STATE ===
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Telecaller Task</h1>
              <p className="text-gray-600 mt-1">
                Task ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{nonEditableFields.taskId}</span>
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Only Telecaller Name, Daily Call Target, Description, Priority, and Deadline can be edited.
                  Changing telecaller will automatically reassign the task.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          
          {/* Non-Editable Fields Section */}
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Task Information (Read Only)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Task ID</label>
                <p className="mt-1 text-gray-900 font-mono text-sm">{nonEditableFields.taskId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Created Date</label>
                <p className="mt-1 text-gray-900">{nonEditableFields.createdDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Created By</label>
                <p className="mt-1 text-gray-900">{nonEditableFields.createdBy}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Current Status</label>
                <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  nonEditableFields.taskStatus === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : nonEditableFields.taskStatus === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {nonEditableFields.taskStatus?.replace('_', ' ').toUpperCase() || 'PENDING'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Completed Calls</label>
                <p className="mt-1 text-gray-900">{nonEditableFields.completedCalls}</p>
              </div>
            </div>
          </div>

          {/* Editable Fields Section */}
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Editable Fields</h2>
            
            {/* Telecaller Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telecaller Name <span className="text-red-500">*</span>
              </label>
              <select
                name="telecallerName"
                value={formData.telecallerName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Telecaller</option>
                {telecallersList.map(tc => (
                  <option 
                    key={tc._id} 
                    value={tc.user || tc._id}
                  >
                    {tc.employeeId} - {tc.fullName}
                    {tc.user === taskData?.assignedTo?._id ? ' (Current)' : ''}
                  </option>
                ))}
              </select>
              {formData.telecallerName && formData.telecallerName !== (taskData?.assignedTo?._id || taskData?.assignedTo) && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-700 text-sm">
                      <strong>Note:</strong> Changing telecaller will reassign this task.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Daily Call Target */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Call Target
              </label>
              <input
                type="number"
                name="dailyCallTarget"
                value={formData.dailyCallTarget}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 50"
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="taskDescription"
                value={formData.taskDescription}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter task description..."
                required
              />
            </div>

            {/* Priority and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline (Optional)
                </label>
                <DateInput
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                disabled={submitting || !formData.telecallerId || !formData.taskDescription.trim()}
                className="px-10 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Updating...' : 'Update Task'}
              </button>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default EditTask;