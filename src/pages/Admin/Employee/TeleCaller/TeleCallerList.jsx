// import React, { useState, useEffect } from 'react';
// import Table from '../../../../components/mainComponents/Table';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';
// import { toast } from 'react-toastify';

// const TeleCallerList = () => {
//   const [searchName, setSearchName] = useState('');
//   const [searchEmpId, setSearchEmpId] = useState('');
//   const [fullData, setFullData] = useState([]);  // Pura data (input ke liye)
//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState(false);

//   // Sirf Table ko dikhane ke liye (input fields hata diye)
//   const tableData = fullData.map(item => ({
//     employeeId: item.employeeId,
//     fullName: item.fullName,
//     totalDoctor: item.totalDoctor,
//     hot: item.hot,
//     close: item.close,
//   }));

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get(apiEndpoints.employees.byRole('telecaller'));
//       if (response.data.success) {
//         const transformedData = response.data.data.map(employee => ({
//           ...employee,
//           addOtherTask: employee.targets?.otherTask || '',
//           addTarget: employee.targets?.dailyTarget || 0,
//           addMonthlyTarget: employee.targets?.monthlyTarget || 0,
//           addYearlyTarget: employee.targets?.yearlyTarget || 0,
//           totalDoctor: employee.performanceMetrics?.totalDoctors || 0,
//           hot: employee.performanceMetrics?.hotLeads || 0,
//           close: employee.performanceMetrics?.converted || 0,
//         }));
//         setFullData(transformedData);
//       }
//     } catch (error) {
//       console.error('Error fetching telecallers:', error);
//       toast.error('Failed to fetch telecaller data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSearch = async () => {
//     try {
//       setLoading(true);
//       let response;
//       if (searchName || searchEmpId) {
//         const query = searchName || searchEmpId;
//         response = await apiClient.get(apiEndpoints.employees.search, {
//           params: { q: query, role: 'telecaller' }
//         });
//       } else {
//         response = await apiClient.get(apiEndpoints.employees.byRole('telecaller'));
//       }

//       if (response.data.success) {
//         const transformedData = response.data.data.map(employee => ({
//           ...employee,
//           addOtherTask: employee.targets?.otherTask || '',
//           addTarget: employee.targets?.dailyTarget || 0,
//           addMonthlyTarget: employee.targets?.monthlyTarget || 0,
//           addYearlyTarget: employee.targets?.yearlyTarget || 0,
//           totalDoctor: employee.performanceMetrics?.totalDoctors || 0,
//           hot: employee.performanceMetrics?.hotLeads || 0,
//           close: employee.performanceMetrics?.converted || 0,
//         }));
//         setFullData(transformedData);
//       }
//     } catch (error) {
//       console.error('Error searching telecallers:', error);
//       toast.error('Failed to search telecallers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e, setter) => {
//     setter(e.target.value);
//   };

//   const handleDataChange = (index, field, value) => {
//     const newData = [...fullData];
//     newData[index] = { ...newData[index], [field]: value };
//     setFullData(newData);
//   };

//   const handleSave = async () => {
//     try {
//       setUpdating(true);
//       const updatePromises = fullData.map(employee =>
//         apiClient.put(apiEndpoints.employees.update(employee._id), {
//           targets: {
//             otherTask: employee.addOtherTask,
//             dailyTarget: employee.addTarget,
//             monthlyTarget: employee.addMonthlyTarget,
//             yearlyTarget: employee.addYearlyTarget,
//           }
//         })
//       );

//       await Promise.all(updatePromises);
//       toast.success('Telecaller targets updated successfully');
//     } catch (error) {
//       console.error('Error updating telecaller targets:', error);
//       toast.error('Failed to update telecaller targets');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleCancel = () => {
//     setSearchName('');
//     setSearchEmpId('');
//     fetchData();
//   };

//   const extraColumns = [
//     {
//       header: 'Add Daily Target & Task',
//       render: (row, index) => (
//         <div className="flex items-center space-x-2">
//           <input
//             className="w-20 h-8 border border-gray-300 px-2 text-sm text-center rounded"
//             value={fullData[index]?.addTarget || ''}
//             onChange={(e) => handleDataChange(index, 'addTarget', e.target.value)}
//             placeholder="Daily"
//           />
//           <button
//             className="text-blue-600 hover:text-blue-800 text-sm"
//             onClick={() => {
//               const task = prompt('Enter task:', fullData[index]?.addOtherTask || '');
//               if (task !== null) {
//                 handleDataChange(index, 'addOtherTask', task);
//               }
//             }}
//           >
//             Task
//           </button>
//         </div>
//       ),
//     },
//     {
//       header: 'Add Monthly Target',
//       render: (row, index) => (
//         <input
//           className="w-20 h-8 border border-gray-300 px-2 text-sm text-center rounded"
//           value={fullData[index]?.addMonthlyTarget || ''}
//           onChange={(e) => handleDataChange(index, 'addMonthlyTarget', e.target.value)}
//           placeholder="Monthly"
//         />
//       ),
//     },
//     {
//       header: 'Add Yearly Target',
//       render: (row, index) => (
//         <input
//           className="w-20 h-8 border border-gray-300 px-2 text-sm text-center rounded"
//           value={fullData[index]?.addYearlyTarget || ''}
//           onChange={(e) => handleDataChange(index, 'addYearlyTarget', e.target.value)}
//           placeholder="Yearly"
//         />
//       ),
//     },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto p-6 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-xl font-semibold text-gray-800 mb-4">Telecaller Management</h1>

//         <div className="flex gap-4 mb-6">
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search By Name</label>
//             <input
//               className="w-48 px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               placeholder="Search By Name"
//               value={searchName}
//               onChange={(e) => handleInputChange(e, setSearchName)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1">Search By Employee ID</label>
//             <input
//               className="w-48 px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
//               placeholder="Search By Employee ID"
//               value={searchEmpId}
//               onChange={(e) => handleInputChange(e, setSearchEmpId)}
//             />
//           </div>
//           <div className="flex items-end">
//             <button
//               className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
//               onClick={handleSearch}
//               disabled={loading}
//             >
//               {loading ? 'Searching...' : 'Search'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
//         {loading ? (
//           <div className="flex justify-center items-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : (
//           <Table
//             data={tableData}  // Sirf read-only fields
//             extraColumns={extraColumns}
//             actions={[]}
//           />
//         )}
//       </div>

//       <div className="flex justify-end gap-3">
//         <button
//           className="px-8 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
//           onClick={handleSave}
//           disabled={updating}
//         >
//           {updating ? 'Saving...' : 'Save Changes'}
//         </button>
//         <button
//           className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
//           onClick={handleCancel}
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TeleCallerList;




// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Table from '../../../../components/mainComponents/Table';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';
// import { toast } from 'react-toastify';

// const TelecallerList = () => {
//   const navigate = useNavigate();
//   const [searchName, setSearchName] = useState('');
//   const [searchEmpId, setSearchEmpId] = useState('');
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch telecallers data with targets
//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       // Get telecaller employees
//       const employeesResponse = await apiClient.get(apiEndpoints.employees.byRole('telecaller'));

//       if (employeesResponse.data.success) {
//         const telecallers = employeesResponse.data.data;

//         // Fetch targets and statistics for each telecaller
//         const telecallersWithData = await Promise.all(
//           telecallers.map(async (telecaller) => {
//             try {
//               // Get targets for this telecaller
//               const targetsResponse = await apiClient.get(`/targets/employee/${telecaller._id}`);

//               // Get statistics
//               const statsResponse = await apiClient.get(`/statistics/employee/${telecaller._id}`);

//               const targets = targetsResponse.data.success ? targetsResponse.data.data : {};
//               const stats = statsResponse.data.success ? statsResponse.data.data : {};

//               return {
//                 _id: telecaller._id,
//                 employeeId: telecaller.employeeId,
//                 fullName: telecaller.fullName,
//                 // Targets
//                 dailyTarget: targets.daily || 0,
//                 monthlyTarget: targets.monthly || 0,
//                 yearlyTarget: targets.yearly || 0,
//                 // Statistics
//                 totalDoctors: stats.totalDoctors || 0,
//                 hotLeads: stats.hotLeads || 0,
//                 closeLeads: stats.closeLeads || 0,
//               };
//             } catch (error) {
//               console.error(`Error fetching data for telecaller ${telecaller.employeeId}:`, error);
//               return {
//                 _id: telecaller._id,
//                 employeeId: telecaller.employeeId,
//                 fullName: telecaller.fullName,
//                 dailyTarget: 0,
//                 monthlyTarget: 0,
//                 yearlyTarget: 0,
//                 totalDoctors: 0,
//                 hotLeads: 0,
//                 closeLeads: 0,
//               };
//             }
//           })
//         );

//         setData(telecallersWithData);
//       }
//     } catch (error) {
//       console.error('Error fetching telecallers data:', error);
//       toast.error('Failed to fetch telecallers data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSearch = async () => {
//     try {
//       setLoading(true);

//       if (searchName || searchEmpId) {
//         const response = await apiClient.get(apiEndpoints.employees.search, {
//           params: {
//             q: searchName || searchEmpId,
//             role: 'telecaller'
//           }
//         });

//         if (response.data.success) {
//           const searchResults = response.data.data.map(telecaller => ({
//             _id: telecaller._id,
//             employeeId: telecaller.employeeId,
//             fullName: telecaller.fullName,
//             dailyTarget: 0,
//             monthlyTarget: 0,
//             yearlyTarget: 0,
//             totalDoctors: 0,
//             hotLeads: 0,
//             closeLeads: 0,
//           }));

//           setData(searchResults);
//         }
//       } else {
//         fetchData();
//       }
//     } catch (error) {
//       console.error('Error searching telecallers:', error);
//       toast.error('Failed to search telecallers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e, setter) => {
//     setter(e.target.value);
//   };

//   // Navigate to Add Task page
//   const handleAddTask = () => {
//     navigate('/admin/employee/Tellecaller/add-task');
//   };

//   // Navigate to View Targets page
//   const handleViewTargets = (employee) => {
//     navigate(`/admin/employee/Tellecaller/view-targets/${employee._id}`, {
//       state: {
//         employeeId: employee._id,
//         employeeData: employee
//       }
//     });
//   };

//   const extraColumns = [
//     {
//       header: 'Actions',
//       render: (row) => (
//         <div className="flex items-center space-x-2">
//           <button
//             className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
//             onClick={() => handleViewTargets(row)}
//             title="View Targets"
//           >
//             View
//           </button>
//         </div>
//       )
//     },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Task To Telecaller</h1>

//         {/* Top Section - Right Aligned */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-end justify-end">
//           {/* Navigation Button - Leftmost */}
//           <div className="flex-1">
//             <button
//               className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium text-sm"
//               onClick={handleAddTask}
//             >
//               Add New Task
//             </button>
//           </div>

//           {/* Search Fields - Right Aligned */}
//           <div className="flex flex-col sm:flex-row gap-4 items-end">
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 mb-1">Search By Name</label>
//               <input
//                 className="w-48 px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter name"
//                 value={searchName}
//                 onChange={(e) => handleInputChange(e, setSearchName)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 mb-1">Search By Employee ID</label>
//               <input
//                 className="w-48 px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter employee ID"
//                 value={searchEmpId}
//                 onChange={(e) => handleInputChange(e, setSearchEmpId)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//               />
//             </div>
//             <div className="flex items-end gap-2">
//               <button
//                 className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium text-sm"
//                 onClick={handleSearch}
//                 disabled={loading}
//               >
//                 {loading ? 'Searching...' : 'Search'}
//               </button>
//               <button
//                 className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors font-medium text-sm"
//                 onClick={fetchData}
//                 disabled={loading}
//               >
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
//         {loading ? (
//           <div className="flex justify-center items-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : (
//           <Table
//             data={data}
//             extraColumns={extraColumns}
//             excludeColumns={['_id']}
//             columnOrder={[
//               'employeeId',
//               'fullName',
//               'dailyTarget',
//               'monthlyTarget',
//               'yearlyTarget',
//               'totalDoctors',
//               'hotLeads',
//               'closeLeads',
//               'Actions'
//             ]}
//             columnHeaders={{
//               employeeId: 'Employee ID',
//               fullName: 'Full Name',
//               dailyTarget: 'Add Daily Target',
//               monthlyTarget: 'Add Monthly Target',
//               yearlyTarget: 'Add Yearly Target',
//               totalDoctors: 'Total Doctor',
//               hotLeads: 'Hot',
//               closeLeads: 'Close',
//               Actions: 'Action'
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TelecallerList;













// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Table from '../../../../components/mainComponents/Table';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';
// import { toast } from 'react-toastify';

// const TelecallerList = () => {
//   const navigate = useNavigate();
//   const [searchName, setSearchName] = useState('');
//   const [searchEmpId, setSearchEmpId] = useState('');
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch telecallers data - SIMPLIFIED VERSION
//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       // Get telecaller employees
//       const employeesResponse = await apiClient.get(apiEndpoints.employees.byRole('telecaller'));

//       if (employeesResponse.data.success) {
//         const telecallers = employeesResponse.data.data;

//         // Simple data mapping - no additional API calls
//         const telecallersWithData = telecallers.map(telecaller => ({
//           _id: telecaller._id,
//           employeeId: telecaller.employeeId,
//           fullName: telecaller.fullName,
//           // Default values for targets and statistics
//           dailyTarget: 0,
//           monthlyTarget: 0,
//           yearlyTarget: 0,
//           totalDoctors: 0,
//           hotLeads: 0,
//           closeLeads: 0,
//         }));

//         setData(telecallersWithData);
//       }
//     } catch (error) {
//       console.error('Error fetching telecallers data:', error);
//       toast.error('Failed to fetch telecallers data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSearch = async () => {
//     try {
//       setLoading(true);

//       if (searchName || searchEmpId) {
//         const response = await apiClient.get(apiEndpoints.employees.search, {
//           params: {
//             q: searchName || searchEmpId,
//             role: 'telecaller'
//           }
//         });

//         if (response.data.success) {
//           const searchResults = response.data.data.map(telecaller => ({
//             _id: telecaller._id,
//             employeeId: telecaller.employeeId,
//             fullName: telecaller.fullName,
//             dailyTarget: 0,
//             monthlyTarget: 0,
//             yearlyTarget: 0,
//             totalDoctors: 0,
//             hotLeads: 0,
//             closeLeads: 0,
//           }));

//           setData(searchResults);
//         }
//       } else {
//         fetchData();
//       }
//     } catch (error) {
//       console.error('Error searching telecallers:', error);
//       toast.error('Failed to search telecallers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e, setter) => {
//     setter(e.target.value);
//   };

//   // Navigate to Add Task page
//   const handleAddTask = () => {
//     navigate('/admin/employee/Tellecaller/add-task');
//   };

//   // Navigate to View Targets page
//   const handleViewTargets = (employee) => {
//     navigate(`/admin/employee/Tellecaller/view-task/${employee._id}`, {
//       state: {
//         employeeId: employee._id,
//         employeeData: employee
//       }
//     });
//   };

//   const extraColumns = [
//     {
//       header: 'Actions',
//       render: (row) => (
//         <div className="flex items-center space-x-2">
//           <button
//             className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
//             onClick={() => handleViewTargets(row)}
//             title="View Targets"
//           >
//             View
//           </button>
//         </div>
//       )
//     },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Task To Telecaller</h1>

//         {/* Top Section - Right Aligned */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-end justify-end">
//           {/* Navigation Button - Leftmost */}
//           <div className="flex-1">
//             <button
//               className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium text-sm"
//               onClick={handleAddTask}
//             >
//               Add New Task
//             </button>
//           </div>

//           {/* Search Fields - Right Aligned */}
//           <div className="flex flex-col sm:flex-row gap-4 items-end">
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 mb-1">Search By Name</label>
//               <input
//                 className="w-48 px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter name"
//                 value={searchName}
//                 onChange={(e) => handleInputChange(e, setSearchName)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 mb-1">Search By Employee ID</label>
//               <input
//                 className="w-48 px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter employee ID"
//                 value={searchEmpId}
//                 onChange={(e) => handleInputChange(e, setSearchEmpId)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//               />
//             </div>
//             <div className="flex items-end gap-2">
//               <button
//                 className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium text-sm"
//                 onClick={handleSearch}
//                 disabled={loading}
//               >
//                 {loading ? 'Searching...' : 'Search'}
//               </button>
//               <button
//                 className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors font-medium text-sm"
//                 onClick={fetchData}
//                 disabled={loading}
//               >
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
//         {loading ? (
//           <div className="flex justify-center items-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : data.length === 0 ? (
//           <div className="flex justify-center items-center h-32">
//             <p className="text-gray-500">No telecallers found</p>
//           </div>
//         ) : (
//           <Table
//             data={data}
//             extraColumns={extraColumns}
//             excludeColumns={['_id']}
//             columnOrder={[
//               'employeeId',
//               'fullName',
//               'dailyTarget',
//               'monthlyTarget',
//               'yearlyTarget',
//               'totalDoctors',
//               'hotLeads',
//               'closeLeads',
//               'Actions'
//             ]}
//             columnHeaders={{
//               employeeId: 'Employee ID',
//               fullName: 'Full Name',
//               dailyTarget: 'Add Daily Target',
//               monthlyTarget: 'Add Monthly Target',
//               yearlyTarget: 'Add Yearly Target',
//               totalDoctors: 'Total Doctor',
//               hotLeads: 'Hot',
//               closeLeads: 'Close',
//               Actions: 'Action'
//             }}
//             pagination={true }
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TelecallerList;

































// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Table from '../../../../components/mainComponents/Table';
// import apiClient from '../../../../services/apiClient';
// import { toast } from 'react-toastify';
// import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';

// const TelecallerList = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingCell, setEditingCell] = useState(null); // { rowId, field: 'monthly' | 'yearly' }
//   const [tempValue, setTempValue] = useState('');

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const res = await apiClient.get('/employees/role/telecaller');
//       if (res.data.success) {
//         const telecallers = res.data.data.map(t => ({
//           _id: t._id,
//           employeeId: t.employeeId,
//           fullName: t.fullName,
//           monthlyTarget: 0,  // ← Pehle 0 rahega, edit karne pe update
//           yearlyTarget: 0,   // ← Same
//           totalDoctors: 0,
//           hotLeads: 0,
//           closeLeads: 0,
//         }));
//         setData(telecallers);
//       }
//     } catch (err) {
//       toast.error('Failed to load telecallers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleEditClick = (rowId, field, currentValue) => {
//     setEditingCell({ rowId, field });
//     setTempValue(currentValue || '');
//   };

//   const handleSave = async (rowId) => {
//     if (!tempValue || isNaN(tempValue) || tempValue < 0) {
//       toast.error('Please enter a valid number');
//       return;
//     }

//     const row = data.find(d => d._id === rowId);
//     const payload = { employeeId: rowId };

//     if (editingCell.field === 'monthly') {
//       const currentMonth = new Date().toISOString().slice(0, 7); // "2025-12"
//       payload.monthly = [{ monthYear: currentMonth, target: parseInt(tempValue) }];
//     } else if (editingCell.field === 'yearly') {
//       payload.yearly = [{ year: new Date().getFullYear(), target: parseInt(tempValue) }];
//     }

//     try {
//       await apiClient.post('/tasks/target', payload);
//       toast.success(`${editingCell.field === 'monthly' ? 'Monthly' : 'Yearly'} target saved!`);

//       setData(prev => prev.map(item =>
//         item._id === rowId
//           ? { ...item, [editingCell.field + 'Target']: parseInt(tempValue) }
//           : item
//       ));

//       setEditingCell(null);
//       setTempValue('');
//     } catch (err) {
//       toast.error('Failed to save target');
//       console.error(err);
//     }
//   };

//   const handleCancel = () => {
//     setEditingCell(null);
//     setTempValue('');
//   };

//   const targetCellRenderer = (row, field, label) => {
//     const isEditing = editingCell?.rowId === row._id && editingCell?.field === field;
//     const value = row[field + 'Target'];

//     if (isEditing) {
//       return (
//         <div className="flex items-center gap-2">
//           <input
//             type="number"
//             value={tempValue}
//             onChange={(e) => setTempValue(e.target.value)}
//             className="w-24 px-3 py-1 border border-gray-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             autoFocus
//             min="0"
//             onKeyDown={(e) => e.key === 'Enter' && handleSave(row._id)}
//           />
//           <button onClick={() => handleSave(row._id)} className="text-green-600 hover:text-green-800">
//             <FiCheck size={18} />
//           </button>
//           <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
//             <FiX size={18} />
//           </button>
//         </div>
//       );
//     }

//     return (
//       <div className="flex items-center justify-between group min-w-32">
//         <span className="font-medium">{value || 0}</span>
//         <button
//           onClick={() => handleEditClick(row._id, field, value)}
//           className="opacity-0 group-hover:opacity-100 transition-opacity ml-3"
//           title={`Set ${label}`}
//         >
//           <FiEdit2 size={16} className="text-blue-600 hover:text-blue-800" />
//         </button>
//       </div>
//     );
//   };

//   const extraColumns = [
//     {
//       header: 'Monthly Target',
//       render: (row) => targetCellRenderer(row, 'monthly', 'Monthly Target')
//     },
//     {
//       header: 'Yearly Target',
//       render: (row) => targetCellRenderer(row, 'yearly', 'Yearly Target')
//     },
//     {
//       header: 'Actions',
//       render: (row) => (
//         <button
//           onClick={() => navigate(`/admin/employee/Tellecaller/view-task/${row._id}`, { state: { employeeData: row } })}
//           className="px-5 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
//         >
//           View Tasks
//         </button>
//       )
//     }
//   ];

//   return (
//     <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Telecaller Target Management</h1>
//         <p className="text-gray-600 mt-2">Click pencil icon to set Monthly or Yearly target</p>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//         {loading ? (
//           <div className="p-16 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
//           </div>
//         ) : data.length === 0 ? (
//           <div className="p-16 text-center text-gray-500 text-lg">No telecallers found</div>
//         ) : (
//           <Table
//             data={data}
//             extraColumns={extraColumns}
//             excludeColumns={['_id', 'totalDoctors', 'hotLeads', 'closeLeads']}
//             columnOrder={['employeeId', 'fullName', 'Monthly Target', 'Yearly Target', 'Actions']}
//             pagination={true}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TelecallerList;























// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Table from '../../../../components/mainComponents/Table';
// import apiClient, { apiEndpoints } from '../../../../services/apiClient';
// import { toast } from 'react-toastify';
// import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';

// const TelecallerList = () => {
//   const navigate = useNavigate();
//   const [searchName, setSearchName] = useState('');
//   const [searchEmpId, setSearchEmpId] = useState('');
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingCell, setEditingCell] = useState(null);
//   const [tempValue, setTempValue] = useState('');

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const res = await apiClient.get(apiEndpoints.employees.byRole('telecaller'));
//       if (res.data.success) {
//         const telecallers = res.data.data.map(t => ({
//           _id: t._id,
//           employeeId: t.employeeId,
//           fullName: t.fullName,
//           dailyTarget: 0,
//           monthlyTarget: 0,
//           yearlyTarget: 0,
//           totalDoctors: 0,
//           hotLeads: 0,
//           closeLeads: 0,
//         }));
//         setData(telecallers);
//       }
//     } catch (err) {
//       toast.error('Failed to load telecallers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSearch = async () => {
//     // ... same as before (tune jo diya tha)
//     try {
//       setLoading(true);
//       if (searchName || searchEmpId) {
//         const res = await apiClient.get(apiEndpoints.employees.search, {
//           params: { q: searchName || searchEmpId, role: 'telecaller' }
//         });
//         if (res.data.success) {
//           const results = res.data.data.map(t => ({
//             _id: t._id,
//             employeeId: t.employeeId,
//             fullName: t.fullName,
//             dailyTarget: 0,
//             monthlyTarget: 0,
//             yearlyTarget: 0,
//             totalDoctors: 0,
//             hotLeads: 0,
//             closeLeads: 0,
//           }));
//           setData(results);
//         }
//       } else {
//         fetchData();
//       }
//     } catch (err) {
//       toast.error('Search failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddTask = () => navigate('/admin/employee/Tellecaller/add-task');
//   const handleViewTargets = (row) => navigate(`/admin/employee/Tellecaller/view-task/${row._id}`, { state: { employeeData: row } });

//   // Edit Logic
//   const handleEdit = (rowId, field, value) => {
//     setEditingCell({ rowId, field });
//     setTempValue(value || '');
//   };

//   const handleSave = async (rowId) => {
//     if (!tempValue || isNaN(tempValue) || tempValue < 0) return toast.error('Invalid value');

//     const payload = { employeeId: rowId };
//     if (editingCell.field === 'monthly') {
//       payload.monthly = [{ monthYear: new Date().toISOString().slice(0, 7), target: +tempValue }];
//     } else {
//       payload.yearly = [{ year: new Date().getFullYear(), target: +tempValue }];
//     }

//     try {
//       await apiClient.post('/tasks/target', payload);
//       toast.success('Target saved!');

//       setData(prev => prev.map(item =>
//         item._id === rowId
//           ? { ...item, [editingCell.field + 'Target']: +tempValue }
//           : item
//       ));
//       setEditingCell(null);
//       setTempValue('');
//     } catch (err) {
//       toast.error('Failed to save');
//     }
//   };

//   const handleCancel = () => {
//     setEditingCell(null);
//     setTempValue('');
//   };

//   const editableCell = (row, field, label) => {
//     const isEditing = editingCell?.rowId === row._id && editingCell?.field === field;
//     const value = row[field + 'Target'];

//     if (isEditing) {
//       return (
//         <div className="flex items-center gap-2">
//           <input
//             type="number"
//             value={tempValue}
//             onChange={e => setTempValue(e.target.value)}
//             className="w-20 px-2 py-1 border rounded text-sm"
//             autoFocus
//             onKeyDown={e => e.key === 'Enter' && handleSave(row._id)}
//           />
//           <button onClick={() => handleSave(row._id)} className="text-green-600"><FiCheck size={16} /></button>
//           <button onClick={handleCancel} className="text-red-600"><FiX size={16} /></button>
//         </div>
//       );
//     }

//     return (
//       <div className="flex items-center justify-between group">
//         <span>{value || 0}</span>
//         <button
//           onClick={() => handleEdit(row._id, field, value)}
//           className="opacity-0 group-hover:opacity-100 ml-2 transition"
//         >
//           <FiEdit2 size={14} className="text-blue-600" />
//         </button>
//       </div>
//     );
//   };

//   const extraColumns = [
//     {
//       header: 'Monthly Target',
//       render: row => editableCell(row, 'monthly')
//     },
//     {
//       header: 'Yearly Target',
//       render: row => editableCell(row, 'yearly')
//     },
//     {
//       header: 'Actions',
//       render: row => (
//         <button
//           onClick={() => handleViewTargets(row)}
//           className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
//         >
//           View
//         </button>
//       )
//     }
//   ];

//   return (
//     <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Task To Telecaller</h1>

//         {/* Top Buttons + Search - SAME AS BEFORE */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-end justify-end">
//           <div className="flex-1">
//             <button onClick={handleAddTask} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium text-sm">
//               Add New Task
//             </button>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 items-end">
//             <div className="flex flex-col">
//               <label classpm className="text-sm text-gray-600 mb-1">Search By Name</label>
//               <input
//                 className="w-48 px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter name"
//                 value={searchName}
//                 onChange={e => setSearchName(e.target.value)}
//                 onKeyPress={e => e.key === 'Enter' && handleSearch()}
//               />
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm text-gray-600 mb-1">Search By Employee ID</label>
//               <input
//                 className="w-48 px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter employee ID"
//                 value={searchEmpId}
//                 onChange={e => setSearchEmpId(e.target.value)}
//                 onKeyPress={e => e.key === 'Enter' && handleSearch()}
//               />
//             </div>
//             <div className="flex gap-2">
//               <button onClick={handleSearch} disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm">
//                 {loading ? 'Searching...' : 'Search'}
//               </button>
//               <button onClick={fetchData} disabled={loading} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 text-sm">
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center items-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : data.length === 0 ? (
//           <div className="text-center py-10 text-gray-500">No telecallers found</div>
//         ) : (
//           <Table
//             data={data}
//             extraColumns={extraColumns}
//             excludeColumns={['_id']}
//             columnOrder={[
//               'employeeId',
//               'fullName',
//               'dailyTarget',
//               'Monthly Target',
//               'Yearly Target',
//               'totalDoctors',
//               'hotLeads',
//               'closeLeads',
//               'Actions'
//             ]}
//             columnHeaders={{
//               employeeId: 'Employee Id',
//               fullName: 'Full Name',
//               dailyTarget: 'Daily Target',
//               totalDoctors: 'Total Doctors',
//               hotLeads: 'Hot Leads',
//               closeLeads: 'Close Leads',
//               Actions: 'Actions'
//             }}
//             pagination={true}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TelecallerList;




























import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../../components/mainComponents/Table';
import apiClient, { apiEndpoints } from '../../../../services/apiClient';
import { toast } from 'react-toastify';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';

const TelecallerList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchEmpId, setSearchEmpId] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('all'); // For future status filtering

  // === FETCH DATA FROM NEW POWERFUL API ===
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/employees/all-with-targets'); // This specific endpoint might not be in apiEndpoints

      if (res.data.success) {
        setData(res.data.data);
      } else {
        toast.error('No data found');
        setData([]);
      }
    } catch (err) {
      toast.error('Failed to load telecallers');
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === EDIT LOGIC (Monthly & Yearly Target) ===
  const handleEdit = (rowId, field, currentValue) => {
    setEditingCell({ rowId, field });
    setTempValue(currentValue || '');
  };

  const handleSave = async (rowId) => {
    if (!tempValue || isNaN(tempValue) || tempValue < 0) {
      toast.error('Invalid value');
      return;
    }

    const payload = { employeeId: rowId };
    if (editingCell.field === 'monthly') {
      payload.monthly = [{ monthYear: new Date().toISOString().slice(0, 7), target: +tempValue }];
    } else {
      payload.yearly = [{ year: new Date().getFullYear(), target: +tempValue }];
    }

    try {
      await apiClient.post('/tasks/target', payload);
      toast.success('Target updated!');

      setData(prev => prev.map(item =>
        item._id === rowId
          ? { ...item, [editingCell.field + 'Target']: +tempValue }
          : item
      ));

      setEditingCell(null);
      setTempValue('');
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const handleCancel = () => {
    setEditingCell(null);
    setTempValue('');
  };

  const editableCell = (row, field) => {
    const isEditing = editingCell?.rowId === row._id && editingCell?.field === field;
    const value = row[field + 'Target'] || 0;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-20 px-2 py-1 border rounded text-sm focus:outline-blue-500"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave(row._id)}
          />
          <button onClick={() => handleSave(row._id)} className="text-green-600 hover:text-green-800">
            <FiCheck size={16} />
          </button>
          <button onClick={handleCancel} className="text-red-600 hover:text-red-800">
            <FiX size={16} />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between group">
        <span className="font-medium">{value}</span>
        <button
          onClick={() => handleEdit(row._id, field, value)}
          className="opacity-0 group-hover:opacity-100 transition ml-2"
        >
          <FiEdit2 size={14} className="text-blue-600" />
        </button>
      </div>
    );
  };

  // === TABLE COLUMNS ===
  const extraColumns = [
    {
      header: 'Monthly Target',
      render: (row) => editableCell(row, 'monthly')
    },
    {
      header: 'Yearly Target',
      render: (row) => editableCell(row, 'yearly')
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/employee/Tellecaller/view-task/${row.userId || row._id}`, { state: { employeeData: row } })}
          className="px-5 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition font-medium"
        >
          View
        </button>
      )
    }
  ];

  const handleSearch = async () => {
    try {
      setLoading(true);

      let res;
      if (searchName || searchEmpId) {
        // Use the search endpoint with role filter
        const query = searchName || searchEmpId;
        res = await apiClient.get(apiEndpoints.employees.search, {
          params: { q: query, role: 'telecaller' }
        });
      } else {
        // If no search terms, fetch all telecallers
        res = await apiClient.get('/employees/all-with-targets');
      }

      if (res.data.success) {
        let filteredData = res.data.data;

        // Apply status filter on client side
        if (filterByStatus !== 'all') {
          filteredData = filteredData.filter(telecaller => {
            // Assuming there's an isActive property or similar in the data
            // If not available, we'll need to adjust this logic
            if (filterByStatus === 'active') {
              return telecaller.isActive !== false; // Default to active if property doesn't exist
            } else {
              return telecaller.isActive === false;
            }
          });
        }

        setData(filteredData);
      } else {
        toast.error('No data found');
        setData([]);
      }
    } catch (err) {
      toast.error('Failed to search telecallers');
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchName('');
    setSearchEmpId('');
    setFilterByStatus('all');
    fetchData(); // Reload all data
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Telecaller Dashboard</h1>
        <p className="text-gray-600">Manage telecaller targets and performance</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search by Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter telecaller name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search by Employee ID</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter employee ID"
              value={searchEmpId}
              onChange={(e) => setSearchEmpId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterByStatus}
              onChange={(e) => setFilterByStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-end space-x-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={handleClearFilters}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-medium"
            >
              Clear
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => navigate('/admin/employee/Tellecaller/add-task')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Add New Task
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-lg">No telecallers found</div>
        ) : (
          <Table
            data={data}
            extraColumns={extraColumns}
            excludeColumns={['_id']}
            columnOrder={[
              'employeeId',
              'fullName',
              'dailyTarget',
              'Monthly Target',
              'Yearly Target',
              'totalDoctors',
              'hotLeads',
              'closeLeads',
              'Actions'
            ]}
            columnHeaders={{
              employeeId: 'Employee Id',
              fullName: 'Full Name',
              dailyTarget: 'Daily Target',
              totalDoctors: 'Total Doctors',
              hotLeads: 'Hot Leads',
              closeLeads: 'Close Leads',
            }}
            pagination={true}
            rowsPerPage={10}
          />
        )}
      </div>
    </div>
  );
};

export default TelecallerList;