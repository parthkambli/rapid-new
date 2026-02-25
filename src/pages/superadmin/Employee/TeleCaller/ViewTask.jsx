// import React, { useState, useEffect } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';

// const TaskSummary = () => {
//   const { employeeId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [taskData, setTaskData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [employeeInfo, setEmployeeInfo] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Check if data is passed via state
//         if (location.state?.employeeData) {
//           setEmployeeInfo(location.state.employeeData);
//         } else if (employeeId) {
//           // Fetch employee data if not passed
//           const employeeResponse = await apiClient.get(apiEndpoints.employees.get(employeeId));
//           if (employeeResponse.data.success) {
//             setEmployeeInfo(employeeResponse.data.data);
//           }
//         }

//         // Fetch tasks for this employee
//         if (employeeId) {
//           const tasksResponse = await apiClient.get(`/tasks/employee/${employeeId}`);
//           if (tasksResponse.data.success && tasksResponse.data.data.length > 0) {
//             // Get the latest task or use the first one
//             const latestTask = tasksResponse.data.data[0];
//             setTaskData(latestTask);
//           }
//         }

//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error('Failed to load task data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [employeeId, location.state]);

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-GB');
//   };

//   // Get priority display text
//   const getPriorityText = (priority) => {
//     const priorityMap = {
//       'low': 'Low',
//       'medium': 'Normal',
//       'high': 'High',
//       'urgent': 'Urgent'
//     };
//     return priorityMap[priority] || 'Normal';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         <span className="ml-3 text-gray-600">Loading task summary...</span>
//       </div>
//     );
//   }

//   if (!taskData && !employeeInfo) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">No Task Data Found</h2>
//           <p className="text-gray-600 mb-6">No task information available for this telecaller.</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Summary</h1>
//           <p className="text-gray-600">Detailed overview of assigned tasks and targets</p>
//         </div>

//         {/* Main Card */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Telecaller Info Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-bold">
//                   {employeeInfo?.employeeId || 'T001'} - {employeeInfo?.fullName || 'Alice'}
//                 </h2>
//                 <p className="text-blue-100">Telecaller Performance Summary</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-blue-100">Date: {formatDate(taskData?.scheduledDate) || formatDate(new Date())}</p>
//               </div>
//             </div>
//           </div>

//           {/* Task Details */}
//           <div className="p-6">
//             {/* General Info Section */}
//             <div className="mb-8">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                 General Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-blue-50 p-4 rounded-lg">
//                   <p className="text-sm text-blue-600 font-medium">Daily Target</p>
//                   <p className="text-xl font-bold text-gray-800">
//                     {taskData?.telecallerData?.dailyCallTarget || 100}
//                   </p>
//                 </div>
//                 <div className="bg-green-50 p-4 rounded-lg">
//                   <p className="text-sm text-green-600 font-medium">Priority Level</p>
//                   <p className="text-xl font-bold text-gray-800">
//                     {getPriorityText(taskData?.priority)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Salesmen Information */}
//             {taskData?.telecallerData?.salesmen && taskData.telecallerData.salesmen.length > 0 && (
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                   Assigned Salesmen
//                 </h3>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex flex-wrap gap-2">
//                     {taskData.telecallerData.salesmen.map((salesmanId, index) => (
//                       <span key={index} className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-300">
//                         Salesman {index + 1}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Call Data Source */}
//             <div className="mb-8">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                 Call Data Source
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Date Range</p>
//                   <p className="font-medium text-gray-800">
//                     {formatDate(taskData?.telecallerData?.dateRangeFrom) || '2025-09-10'} to {formatDate(taskData?.telecallerData?.dateRangeTo) || '2025-09-17'}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Call Type</p>
//                   <p className="font-medium text-gray-800">
//                     {taskData?.telecallerData?.callType || 'Hot'}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Renewal Calls */}
//             {taskData?.telecallerData?.renewalMonth && (
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                   Renewal Calls
//                 </h3>
//                 <div className="bg-yellow-50 p-4 rounded-lg">
//                   <p className="text-sm text-yellow-600 font-medium">Selected Month</p>
//                   <p className="text-lg font-bold text-gray-800">
//                     {taskData.telecallerData.renewalMonth || 'September 2025'}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Service Calls */}
//             {(taskData?.telecallerData?.serviceDateFrom || taskData?.telecallerData?.serviceCallType) && (
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                   Service Calls
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Service Date Range</p>
//                     <p className="font-medium text-gray-800">
//                       {formatDate(taskData?.telecallerData?.serviceDateFrom) || '2025-09-10'} to {formatDate(taskData?.telecallerData?.serviceDateTo) || '2025-09-17'}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Service Call Type</p>
//                     <p className="font-medium text-gray-800">
//                       {taskData?.telecallerData?.serviceCallType || 'Close'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Task Description */}
//             <div className="mb-8">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                 Task Description
//               </h3>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-gray-800 leading-relaxed">
//                   {taskData?.description || 'Check the data of renewal of membership'}
//                 </p>
//               </div>
//             </div>

//             {/* Deadline */}
//             {taskData?.telecallerData?.deadline && (
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
//                   Deadline
//                 </h3>
//                 <div className="bg-red-50 p-4 rounded-lg">
//                   <p className="text-sm text-red-600 font-medium">Due Date</p>
//                   <p className="text-lg font-bold text-gray-800">
//                     {formatDate(taskData.telecallerData.deadline) || '2025-09-18'}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Status Information */}
//             <div className="mt-8 pt-6 border-t border-gray-200">
//               <div className="flex flex-wrap justify-between items-center">
//                 <div>
//                   <p className="text-sm text-gray-600">Task Status</p>
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                     taskData?.status === 'completed' 
//                       ? 'bg-green-100 text-green-800'
//                       : taskData?.status === 'in_progress'
//                       ? 'bg-yellow-100 text-yellow-800'
//                       : 'bg-blue-100 text-blue-800'
//                   }`}>
//                     {taskData?.status ? taskData.status.replace('_', ' ').toUpperCase() : 'PENDING'}
//                   </span>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-gray-600">Last Updated</p>
//                   <p className="text-gray-800 font-medium">
//                     {formatDate(taskData?.updatedAt) || formatDate(new Date())}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-4 mt-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//           >
//             Back to List
//           </button>
//           <button
//             onClick={() => window.print()}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Print Summary
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskSummary;
















import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../../../services/apiClient';

const ViewTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskSummary = async () => {
      try {
        setLoading(true);
        // Use id as telecallerId since the backend route uses telecallerId
        const response = await apiClient.get(`/tasks/${id}/task-summary`);
        if (response.data.success) {
          setTaskData(response.data);
        } else {
          toast.error('Failed to fetch task summary');
        }
      } catch (error) {
        console.error('Error fetching task summary:', error);
        toast.error('Failed to fetch task summary');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTaskSummary();
    }
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Format date as "DD MMM YYYY"
  const formatToDDMMMYYYY = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading task summary...</span>
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Task Data Found</h2>
          <p className="text-gray-600 mb-6">No task summary available for this employee.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-sm border-b">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Telecaller {id} - Task Summary</h1>
            <span className={`px-4 py-2 rounded-full text-white font-medium text-sm ${
              taskData.summary?.overallProgress === 100 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {taskData.summary?.overallProgress === 100 ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-lg rounded-b-lg">
          <h2 className="text-xl font-semibold text-gray-800 px-6 py-4 border-b">
            Task Summary
          </h2>

          <div className="p-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total Tasks</p>
                <p className="text-xl font-bold text-gray-800">{taskData.summary?.totalTasks || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Total Target</p>
                <p className="text-xl font-bold text-gray-800">{taskData.summary?.totalTarget || 0}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 font-medium">Total Achieved</p>
                <p className="text-xl font-bold text-gray-800">{taskData.summary?.totalAchieved || 0}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Overall Progress</p>
                <p className="text-xl font-bold text-gray-800">{taskData.summary?.overallProgress || 0}%</p>
              </div>
            </div>

            {/* Individual Tasks */}
            {taskData.tasks && taskData.tasks.length > 0 && (
              <div className="space-y-4">
                {taskData.tasks.map((task) => (
                  <div key={task._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.status ? task.status.replace('_', ' ').toUpperCase() : 'PENDING'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Telecaller:</label>
                          <p className="text-gray-800 font-medium">{task.detail?.telecaller || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Employee:</label>
                          <p className="text-gray-800 font-medium">{task.detail?.employee || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Salesman:</label>
                          <p className="text-gray-800 font-medium">{task.detail?.salesman || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Date Range:</label>
                          <p className="text-gray-800 font-medium">{task.detail?.dateRange || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Call Type:</label>
                          <p className="text-gray-800 font-medium">{task.detail?.callType || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Renewal Month:</label>
                          <p className="text-gray-800 font-medium">{task.detail?.renewalMonth || 'N/A'}</p>
                        </div>
                      </div>

                      <div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Service Call Type:</label>
                          <p className="text-gray-800 font-medium">{task.detail?.serviceCallType || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Task Description:</label>
                          <p className="text-gray-800 font-medium">{task.detail?.taskDescription || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Priority:</label>
                          <p className="text-gray-800 font-medium">{task.detail?.priority || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Deadline:</label>
                          <p className="text-gray-800 font-medium">{task.detail?.deadline || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Daily Target:</label>
                          <p className="text-gray-800 font-medium">{task.detail?.dailyTarget || 'N/A'}</p>
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Task Progress:</label>
                          <p className="text-gray-800 font-medium">{task.detail?.taskProgress || 0}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Task Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Daily Target</p>
                        <p className="text-lg font-bold text-blue-600">{task.dailyTarget || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Achieved</p>
                        <p className="text-lg font-bold text-green-600">{task.achieved || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-lg font-bold text-yellow-600">{task.pending || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Calls</p>
                        <p className="text-lg font-bold text-purple-600">{task.totalDoctorsOrCalls || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Progress</p>
                        <p className="text-lg font-bold text-blue-600">{task.progress || 0}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="text-lg font-bold text-gray-800">{formatToDDMMMYYYY(task.scheduledDate)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Daily Stats Table */}
            {taskData.summary?.dailyStats && taskData.summary.dailyStats.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Daily Performance
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achieved</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {taskData.summary.dailyStats.map((stat, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatToDDMMMYYYY(stat.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.dayName || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.totalTasks || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.totalTarget || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.totalAchieved || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    stat.progress >= 70 ? 'bg-green-500' :
                                    stat.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${stat.progress}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm text-gray-600">{stat.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Call Type Breakdown */}
            {taskData.summary?.callTypeBreakdown && Object.keys(taskData.summary.callTypeBreakdown).length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Call Type Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(taskData.summary.callTypeBreakdown).map(([callType, breakdown], index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">{callType}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Count:</span>
                          <span className="text-sm font-medium">{breakdown.count || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Target:</span>
                          <span className="text-sm font-medium">{breakdown.totalTarget || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Achieved:</span>
                          <span className="text-sm font-medium">{breakdown.totalAchieved || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Progress:</span>
                          <span className="text-sm font-medium">{breakdown.progress || 0}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Breakdown */}
            {taskData.summary?.statusBreakdown && Object.keys(taskData.summary.statusBreakdown).length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Status Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(taskData.summary.statusBreakdown).map(([status, breakdown], index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2 capitalize">{status}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Count:</span>
                          <span className="text-sm font-medium">{breakdown.count || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Target:</span>
                          <span className="text-sm font-medium">{breakdown.totalTarget || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Achieved:</span>
                          <span className="text-sm font-medium">{breakdown.totalAchieved || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Progress:</span>
                          <span className="text-sm font-medium">{breakdown.progress || 0}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
            <button
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={() => alert('Edit functionality would be implemented here')}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;