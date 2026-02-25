// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import Table from "../../../components/mainComponents/Table";

// const QueriesOrCase = () => {
//   const navigate = useNavigate();
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [followUpModal, setFollowUpModal] = useState(null);
//   const [followUpForm, setFollowUpForm] = useState({
//     stage: "",
//     date: "",
//     nextDate: "",
//     remark: "",
//     attachment: null,
//   });
//   const [cases, setCases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [experts, setExperts] = useState([]);
//   const [advocates, setAdvocates] = useState([]);
//   const [filters, setFilters] = useState({
//     doctorName: "",
//     status: "",
//     caseType: "",
//     patientName: "",
//     opponentName: "",
//   });

//   // Fetch cases from API
//   const fetchCases = async (params = {}) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await apiClient.get('/query-cases/list', {
//         params: {
//           ...params,
//           ...filters
//         }
//       });

//       if (response.data.success) {
//         setCases(response.data.data || []);
//       } else {
//         setError(response.data.message || 'Failed to fetch query cases');
//       }
//     } catch (err) {
//       console.error('Error fetching query cases:', err);
//       setError(err.response?.data?.message || 'Error fetching query cases');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to get the proper file URL for attachments
//   const getFileUrl = (filePath) => {
//     if (!filePath) return null;
//     // Get base URL from apiClient (removes /api if present) or use default
//     let baseURL = apiClient.defaults.baseURL || 'http://localhost:3000/api';
//     // Remove /api suffix for static file serving
//     baseURL = baseURL.replace(/\/api$/, '');

//     // Convert server file path to URL
//     if (filePath.startsWith('/home/')) {
//       // Extract the path after 'uploads'
//       const uploadsIndex = filePath.indexOf('uploads/');
//       if (uploadsIndex !== -1) {
//         const relativePath = filePath.substring(uploadsIndex);
//         return `${baseURL}/${relativePath}`;
//       }
//     }
//     // If already a URL, return as is
//     if (filePath.startsWith('http')) {
//       return filePath;
//     }
//     // If starts with /uploads, append to base URL
//     if (filePath.startsWith('/uploads')) {
//       return `${baseURL}${filePath}`;
//     }
//     // Default: assume it's a relative path from uploads
//     return `${baseURL}/uploads/${filePath}`;
//   };

//   // Load data on component mount
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Handle filter changes
//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle filter change with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchCases();
//     }, 500); // Debounce search for 500ms

//     return () => clearTimeout(timer);
//   }, [filters]);

//   // Fetch cases, experts and advocates
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       await Promise.all([
//         fetchCases(),
//         fetchExperts(),
//         fetchAdvocates()
//       ]);
//     } catch (error) {
//       setError(error.message || 'Error fetching data');
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch experts from API
//   const fetchExperts = async () => {
//     try {
//       const response = await apiClient.get('/experts');
//       if (response.data.success) {
//         setExperts(response.data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching experts:', error);
//     }
//   };

//   // Fetch advocates from API
//   const fetchAdvocates = async () => {
//     try {
//       const response = await apiClient.get('/advocates');
//       if (response.data.success) {
//         setAdvocates(response.data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching advocates:', error);
//     }
//   };

//   const handleView = (row) => {
//     if (!row) return;
//     const id = row._id || row.id;
//     setExpandedRow(expandedRow === id ? null : id);
//   };

//   const handleFollowUp = (row) => {
//     setFollowUpModal(row._id);
//     setFollowUpForm({ stage: "", date: "", nextDate: "", remark: "", attachment: null });
//   };

//   const closeModal = () => {
//     setFollowUpModal(null);
//   };

//   // Assign an expert to a query case
//   const assignExpert = async (caseId, expertId) => {
//     if (!window.confirm('Are you sure you want to assign this expert to the query case?')) {
//       return;
//     }

//     try {
//       const response = await apiClient.put(`/query-cases/${caseId}/assign-expert`, {
//         expertId
//       });

//       if (response.data.success) {
//         // Refresh the entire cases list to ensure consistency across all views
//         await fetchCases();
//         alert('Expert assigned successfully!');
//       } else {
//         alert(response.data.message || 'Failed to assign expert');
//       }
//     } catch (error) {
//       console.error('Error assigning expert:', error);
//       alert(error.response?.data?.message || 'Error assigning expert');
//     }
//   };

//   // Assign an advocate to a query case
//   const assignAdvocate = async (caseId, advocateId) => {
//     if (!window.confirm('Are you sure you want to assign this advocate to the query case?')) {
//       return;
//     }

//     try {
//       const response = await apiClient.put(`/query-cases/${caseId}/assign-advocate`, {
//         advocateId
//       });

//       if (response.data.success) {
//         // Refresh the entire cases list to ensure consistency across all views
//         await fetchCases();
//         alert('Advocate assigned successfully!');
//       } else {
//         alert(response.data.message || 'Failed to assign advocate');
//       }
//     } catch (error) {
//       console.error('Error assigning advocate:', error);
//       alert(error.response?.data?.message || 'Error assigning advocate');
//     }
//   };

//   // PREPARE DATA FOR TABLE: Exclude complex fields like followUps, originalQuery
//   const tableData = cases.map((item) => ({
//     ...item,
//     // Convert followUps to readable string for table
//     followUps: item.followUps ? `${item.followUps.length} follow-up(s)` : "—",
//     // Hide long text fields in table
//     originalQuery: item.originalQuery?.length > 30 ? item.originalQuery.substring(0, 30) + "..." : item.originalQuery,
//   }));

//   return (
//     <div className="max-w-[79vw]  mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Queries or Case</h2>
//         <button
//           onClick={() => navigate("/admin/create-query-case")}
//           className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium"
//         >
//           Create Queries or Case
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Search By Dr. Name"
//           className="p-2 border rounded text-sm bg-gray-100"
//           value={filters.doctorName}
//           onChange={(e) => handleFilterChange('doctorName', e.target.value)}
//         />
//         <select
//           className="p-2 border rounded text-sm bg-gray-100"
//           value={filters.status}
//           onChange={(e) => handleFilterChange('status', e.target.value)}
//         >
//           <option value="">Status</option>
//           <option value="Open">Open</option>
//           <option value="Pending">Pending</option>
//           <option value="Closed">Closed</option>
//         </select>
//         <select
//           className="p-2 border rounded text-sm bg-gray-100"
//           value={filters.caseType}
//           onChange={(e) => handleFilterChange('caseType', e.target.value)}
//         >
//           <option value="">Case Type</option>
//           <option value="">All Cases</option>
//           {/* <option value="Medicolegal">Medicolegal</option>
//           <option value="Consumer Dispute">Consumer Dispute</option>
//           <option value="Insurance">Insurance</option>
//           <option value="Other">Other</option> */}
//           <option value="Civil">Civil</option>
//           <option value="Criminal">Criminal</option>
//           <option value="Consumer">Consumer</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Search By Patient"
//           className="p-2 border rounded text-sm bg-gray-100"
//           value={filters.patientName}
//           onChange={(e) => handleFilterChange('patientName', e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Search By Opponent"
//           className="p-2 border rounded text-sm bg-gray-100"
//           value={filters.opponentName}
//           onChange={(e) => handleFilterChange('opponentName', e.target.value)}
//         />
//       </div>

//       {/* Loading and Error States */}
//       {loading && (
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#398C89]"></div>
//           <p className="mt-2 text-gray-600">Loading query cases...</p>
//         </div>
//       )}

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           Error: {error}
//         </div>
//       )}

//       {/* Table - Safe Data Passed */}
//       {!loading && !error && (
//         <Table
//           data={tableData}
//           extraColumns={[
//             {
//               header: "Action",
//               render: (row) => {
//                 // Find the original row from 'cases' state to ensure we have all data (like full followUps array)
//                 // We compare _id (MongoDB ID) or id (Case ID)
//                 const originalRow = cases.find((r) =>
//                   (r._id && row._id && r._id === row._id) ||
//                   (r.id && row.id && r.id === row.id)
//                 );

//                 // Fallback to row if original not found (though followUps might be stringified)
//                 const rowToView = originalRow || row;

//                 return (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => navigate(`/admin/view-query-case/${rowToView._id || rowToView.id}`)}
//                       className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
//                     >
//                       View
//                     </button>
//                     <button
//                       onClick={() => navigate("/admin/create-query-case", { state: { editData: rowToView } })}
//                       className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 );
//               },
//             },
//             {
//               header: "Assign",
//               render: (row) => {
//                 const originalRow = cases.find((r) => r._id === row._id || r.id === row._id);
//                 return (
//                   <div className="flex flex-col gap-2 items-center">
//                     {/* Expert Assignment Dropdown */}
//                     <select
//                       className="p-1 text-xs border rounded w-24"
//                       onChange={(e) => {
//                         if (e.target.value) {
//                           assignExpert(originalRow._id, e.target.value);
//                         }
//                       }}
//                       defaultValue=""
//                     >
//                       <option value="">Assign Expert</option>
//                       {experts.map((expert) => (
//                         <option key={expert._id} value={expert._id}>
//                           {expert.fullName || expert.name || expert.title}
//                         </option>
//                       ))}
//                     </select>

//                     {/* Advocate Assignment Dropdown */}
//                     <select
//                       className="p-1 text-xs border rounded w-24"
//                       onChange={(e) => {
//                         if (e.target.value) {
//                           assignAdvocate(originalRow._id, e.target.value);
//                         }
//                       }}
//                       defaultValue=""
//                     >
//                       <option value="">Assign Advocate</option>
//                       {advocates.map((advocate) => (
//                         <option key={advocate._id} value={advocate._id}>
//                           {advocate.fullName || advocate.name || advocate.barCouncilNumber}
//                         </option>
//                       ))}
//                     </select>

//                     <button
//                       onClick={() => handleFollowUp(originalRow)}
//                       className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
//                     >
//                       Follow Ups
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//                       </svg>
//                     </button>
//                   </div>
//                 );
//               },
//             },
//           ]}
//           excludeColumns={['id', 'queryType', 'subType', 'queryDescription', 'relation', 'opponentType', 'patientName', 'opponentName', 'opponentContact', 'opponentEmail', 'opponentAddress', 'caseStage', 'priority', 'tags', 'createdBy', 'createdAt', 'updatedAt', '__v', 'updatedBy', 'originalQuery', 'opponent', 'patient', 'ageGender', 'address']}
//           columnOrder={['id', 'caseId', 'caseNo', 'caseType', 'doctorId', 'doctorName', 'opponent', 'patient', 'ageGender', 'contactNo', 'address', 'status',]}
//           pagination={true}
//         />
//       )}

//       {/* Expandable View */}
//       {expandedRow && (
//         <div className="mt-6 p-6 bg-gray-50 border rounded-lg">
//           {(() => {
//             const row = cases.find((r) => (r._id && r._id === expandedRow) || (r.id && r.id === expandedRow));
//             if (!row) return null;

//             return (
//               <>
//                 <div className="flex justify-between items-center text-sm text-gray-600 border-b pb-3 mb-4">
//                   <div>
//                     <span className="font-medium">{row.id || row.caseId}</span> | {row.doctorName} ({row.doctorId}) | Created {row.createdAt?.split('T')[0] || row.createdAt}
//                   </div>
//                   <button
//                     onClick={() => setExpandedRow(null)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     Close
//                   </button>
//                 </div>

//                 <div>
//                   <h4 className="font-semibold text-gray-800 mb-2">Original Query</h4>
//                   <div className="bg-white p-4 rounded border">
//                     <p className="text-sm text-gray-700">{row.originalQuery || row.queryDescription}</p>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
//                     <div className="flex items-center">
//                       <span className="font-medium text-gray-600 min-w-[100px]">Patient:</span>
//                       <span className="text-gray-800">{row.patientName || 'N/A'}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="font-medium text-gray-600 min-w-[100px]">Opponent:</span>
//                       <span className="text-gray-800">{row.opponentName || 'N/A'}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="font-medium text-gray-600 min-w-[100px]">Expert:</span>
//                       <span className="text-gray-800">{row.assignedExpert?.fullName || row.expert || 'N/A'}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="font-medium text-gray-600 min-w-[100px]">Advocate:</span>
//                       <span className="text-gray-800">{row.assignedAdvocate?.fullName || row.advocate || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <h4 className="font-semibold text-gray-800 mb-3">Followups</h4>
//                   <div className="space-y-4">
//                     {row.followUps && row.followUps.length > 0 ? (
//                       row.followUps.map((fu) => (
//                         <div key={fu._id || fu.createdAt || Date.now()} className="bg-white p-4 rounded border border-gray-200">
//                           <div className="flex justify-between items-start">
//                             <div className="flex-1">
//                               <p className="text-sm text-gray-800 font-medium mb-2">{fu.text || fu.remark || 'No description'}</p>
//                               <div className="text-xs space-y-1">
//                                 <div className="flex items-center gap-1">
//                                   <span className="font-medium text-gray-600">Status:</span>
//                                   <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
//                                     {fu.stage || 'N/A'}
//                                   </span>
//                                 </div>
//                                 {fu.nextDate && (
//                                   <div className="flex items-center gap-1">
//                                     <span className="font-medium text-gray-600">Next Follow-up:</span>
//                                     <span>{new Date(fu.nextDate).toLocaleDateString('en-GB')}</span>
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
//                                 <span>By: {fu.user || fu.createdBy || 'System'}</span>
//                                 <span>On: {(fu.date || fu.createdAt) ? new Date(fu.date || fu.createdAt).toLocaleDateString('en-GB') : 'No date'}</span>
//                                 {fu.attachment && (
//                                   <span className="flex items-center gap-1">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
//                                     </svg>
//                                     <a
//                                       href={getFileUrl(fu.attachment) || '#'}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="text-blue-600 hover:underline"
//                                       onClick={(e) => {
//                                         if (!fu.attachment || !getFileUrl(fu.attachment)) {
//                                           e.preventDefault();
//                                           alert('Attachment not available');
//                                         }
//                                       }}
//                                     >
//                                       Attachment
//                                     </a>
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-sm text-gray-500 italic">No follow-ups yet.</p>
//                     )}
//                   </div>
//                 </div>
//               </>
//             );
//           })()}
//         </div>
//       )}

//       {/* Follow-up Modal */}
//       {followUpModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b flex justify-between items-center">
//               <h3 className="text-lg font-semibold">Followup – Add / Update</h3>
//               <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-xl">
//                 ×
//               </button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Stage</label>
//                   <select
//                     value={followUpForm.stage}
//                     onChange={(e) => setFollowUpForm({ ...followUpForm, stage: e.target.value })}
//                     className="w-full p-2 border rounded text-sm"
//                   >
//                     <option>-- Select --</option>
//                     <option> Query Raised</option>
//                     <option> Legal Consultation</option>
//                     <option> Expert Opinion</option>
//                     <option> Referred to Civil Surgeon</option>
//                     <option> Show Cause Notice</option>
//                     <option> Notice Received</option>
//                     <option> Notice Replied</option>
//                     <option> Mediation / Settlement</option>
//                     <option> Bill Recovery</option>
//                     <option> FIR / Complaint Filed</option>
//                     <option> Case Filed</option>
//                     <option> Evidence</option>
//                     <option>Cross Examination</option>
//                     <option>Arguments</option>
//                     <option>Order Reserved</option>
//                     <option>Judgement</option>
//                     <option>Appeal</option>
//                     <option>Execution</option>
//                     <option>Other</option>
//                     <option>Close</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Date</label>
//                   <input
//                     type="date"
//                     value={followUpForm.date}
//                     onChange={(e) => setFollowUpForm({ ...followUpForm, date: e.target.value })}
//                     className="w-full p-2 border rounded text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Next Date</label>
//                   <input
//                     type="date"
//                     value={followUpForm.nextDate}
//                     onChange={(e) => setFollowUpForm({ ...followUpForm, nextDate: e.target.value })}
//                     className="w-full p-2 border rounded text-sm"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Remark</label>
//                 <textarea
//                   value={followUpForm.remark}
//                   onChange={(e) => setFollowUpForm({ ...followUpForm, remark: e.target.value })}
//                   placeholder="Write follow-up remark..."
//                   rows={4}
//                   className="w-full p-3 border rounded text-sm resize-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Attachment (optional)</label>
//                 <input
//                   type="file"
//                   accept=".pdf,.docx,.jpg,.png"
//                   onChange={(e) => setFollowUpForm({ ...followUpForm, attachment: e.target.files[0] })}
//                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#398C89] file:text-white"
//                 />
//               </div>

//               <div className="flex justify-end gap-3 pt-4">
//                 <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Close Query</button>
//                 <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">Close Case</button>
//                 <button
//                   onClick={async () => {
//                     try {
//                       // Prepare form data for API call (use FormData for file uploads)
//                       const formData = new FormData();

//                       // Add text fields
//                       formData.append('text', followUpForm.remark || '');  // Always send the text field
//                       if (followUpForm.stage) formData.append('stage', followUpForm.stage);
//                       if (followUpForm.nextDate) formData.append('nextDate', followUpForm.nextDate);

//                       // Add attachment if it exists
//                       if (followUpForm.attachment && followUpForm.attachment.name) {
//                         formData.append('attachment', followUpForm.attachment);
//                       }

//                       // Make API call to add follow-up using a raw axios call for file upload
//                       const token = localStorage.getItem('token');
//                       const response = await axios.post(
//                         `${apiClient.defaults.baseURL}${apiEndpoints.queryCases.addFollowUp(followUpModal)}`,
//                         formData,
//                         {
//                           headers: {
//                             'Content-Type': 'multipart/form-data',
//                             'Authorization': `Bearer ${token}`
//                           }
//                         }
//                       );

//                       if (response.data.success) {
//                         // Refresh the entire cases list to ensure consistency
//                         await fetchCases();

//                         alert("Follow-up saved successfully!");
//                         closeModal();
//                         // Reset form after successful submission
//                         setFollowUpForm({
//                           stage: "",
//                           date: "",
//                           nextDate: "",
//                           remark: "",
//                           attachment: null,
//                         });
//                       } else {
//                         alert(response.data.message || 'Failed to add follow-up');
//                       }
//                     } catch (error) {
//                       console.error('Error adding follow-up:', error);
//                       alert(error.response?.data?.message || 'Error adding follow-up. Please try again.');
//                     }
//                   }}
//                   className="px-4 py-2 bg-[#398C89] text-white rounded hover:bg-[#2e706e] text-sm"
//                 >
//                   Save Followup
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QueriesOrCase;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import Table from "../../../components/mainComponents/Table";

const QueriesOrCase = () => {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState(null);
  const [followUpModal, setFollowUpModal] = useState(null);
  const [followUpForm, setFollowUpForm] = useState({
    stage: "",
    date: "",
    nextDate: "",
    remark: "",
    attachment: null,
  });
  const [cases, setCases] = useState([]);
  const [allCases, setAllCases] = useState([]); // Store all cases for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [experts, setExperts] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [filters, setFilters] = useState({
    doctorName: "",
    status: "",
    caseType: "",
    patientName: "",
    opponentName: "",
    fromDate: "", // New: From date filter
    toDate: "",   // New: To date filter
  });

  // Function to get the LATEST (most recent) next follow-up date from a case
  const getLatestNextFollowUpDate = (caseItem) => {
    if (!caseItem.followUps || caseItem.followUps.length === 0) {
      return null;
    }
    
    // Filter follow-ups that have nextDate
    const followUpsWithNextDate = caseItem.followUps.filter(fu => fu.nextDate);
    
    if (followUpsWithNextDate.length === 0) {
      return null;
    }
    
    // Sort by nextDate in DESCENDING order (latest/most recent first)
    const sortedFollowUps = followUpsWithNextDate.sort((a, b) => 
      new Date(b.nextDate) - new Date(a.nextDate) // Changed to descending
    );
    
    // Return the latest (most recent) nextDate
    return sortedFollowUps[0].nextDate;
  };

  // Function to check if a date is within range
  const isDateInRange = (dateString, fromDate, toDate) => {
    if (!dateString) return false;
    
    try {
      // Parse the date string
      const date = new Date(dateString);
      
      // If date is invalid, return false
      if (isNaN(date.getTime())) return false;
      
      // Reset time portion to avoid timezone issues
      const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      // Parse from date if provided
      let from = null;
      if (fromDate) {
        from = new Date(fromDate);
        from = new Date(from.getFullYear(), from.getMonth(), from.getDate());
      }
      
      // Parse to date if provided
      let to = null;
      if (toDate) {
        to = new Date(toDate);
        to = new Date(to.getFullYear(), to.getMonth(), to.getDate());
        // Set to end of day for inclusive comparison
        to.setHours(23, 59, 59, 999);
      }
      
      // If only from date is provided
      if (from && !to) {
        return checkDate >= from;
      }
      
      // If only to date is provided
      if (!from && to) {
        return checkDate <= to;
      }
      
      // If both dates are provided
      if (from && to) {
        return checkDate >= from && checkDate <= to;
      }
      
      // No date filters
      return true;
    } catch (error) {
      console.error('Error checking date range:', error);
      return false;
    }
  };

  // Fetch cases from API
  const fetchCases = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/query-cases/list', {
        params: {
          ...params,
          // Don't pass date filters to API, we'll filter client-side
          doctorName: filters.doctorName,
          status: filters.status,
          caseType: filters.caseType,
          patientName: filters.patientName,
          opponentName: filters.opponentName
        }
      });

      if (response.data.success) {
        const fetchedCases = response.data.data || [];
        setAllCases(fetchedCases); // Store all cases
        applyFilters(fetchedCases); // Apply filters to get displayed cases
      } else {
        setError(response.data.message || 'Failed to fetch query cases');
      }
    } catch (err) {
      console.error('Error fetching query cases:', err);
      setError(err.response?.data?.message || 'Error fetching query cases');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to cases
  const applyFilters = (casesList) => {
    let filtered = [...casesList];
    
    // Apply text-based filters
    if (filters.doctorName) {
      filtered = filtered.filter(caseItem => 
        caseItem.doctorName?.toLowerCase().includes(filters.doctorName.toLowerCase())
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(caseItem => 
        caseItem.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    if (filters.caseType) {
      filtered = filtered.filter(caseItem => 
        caseItem.caseType?.toLowerCase() === filters.caseType.toLowerCase()
      );
    }
    
    if (filters.patientName) {
      filtered = filtered.filter(caseItem => 
        caseItem.patientName?.toLowerCase().includes(filters.patientName.toLowerCase())
      );
    }
    
    if (filters.opponentName) {
      filtered = filtered.filter(caseItem => 
        caseItem.opponentName?.toLowerCase().includes(filters.opponentName.toLowerCase())
      );
    }
    
    // Apply next follow-up date range filter
    if (filters.fromDate || filters.toDate) {
      filtered = filtered.filter(caseItem => {
        const latestNextDate = getLatestNextFollowUpDate(caseItem);
        
        if (!latestNextDate) {
          return false; // Skip cases with no next follow-up date
        }
        
        return isDateInRange(latestNextDate, filters.fromDate, filters.toDate);
      });
    }
    
    setCases(filtered);
  };

  // Function to get the proper file URL for attachments
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    // Get base URL from apiClient (removes /api if present) or use default
    let baseURL = apiClient.defaults.baseURL || 'http://localhost:3000/api';
    // Remove /api suffix for static file serving
    baseURL = baseURL.replace(/\/api$/, '');

    // Convert server file path to URL
    if (filePath.startsWith('/home/')) {
      // Extract the path after 'uploads'
      const uploadsIndex = filePath.indexOf('uploads/');
      if (uploadsIndex !== -1) {
        const relativePath = filePath.substring(uploadsIndex);
        return `${baseURL}/${relativePath}`;
      }
    }
    // If already a URL, return as is
    if (filePath.startsWith('http')) {
      return filePath;
    }
    // If starts with /uploads, append to base URL
    if (filePath.startsWith('/uploads')) {
      return `${baseURL}${filePath}`;
    }
    // Default: assume it's a relative path from uploads
    return `${baseURL}/uploads/${filePath}`;
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle filter change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters(allCases); // Re-apply filters to all cases
    }, 300); // Debounce search for 300ms

    return () => clearTimeout(timer);
  }, [filters, allCases]);

  // Fetch cases, experts and advocates
  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCases(),
        fetchExperts(),
        fetchAdvocates()
      ]);
    } catch (error) {
      setError(error.message || 'Error fetching data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch experts from API
  const fetchExperts = async () => {
    try {
      const response = await apiClient.get('/experts/dropdown');
      if (response.data.success) {
        setExperts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
    }
  };

  // Fetch advocates from API
  const fetchAdvocates = async () => {
    try {
      const response = await apiClient.get('/advocates/dropdown');
      if (response.data.success) {
        setAdvocates(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching advocates:', error);
    }
  };

  const handleView = (row) => {
    if (!row) return;
    const id = row._id || row.id;
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleFollowUp = (row) => {
    setFollowUpModal(row._id);
    setFollowUpForm({ stage: "", date: "", nextDate: "", remark: "", attachment: null });
  };

  const closeModal = () => {
    setFollowUpModal(null);
  };

  // Assign an expert to a query case
  const assignExpert = async (caseId, expertId) => {
    if (!window.confirm('Are you sure you want to assign this expert to the query case?')) {
      return;
    }

    try {
      const response = await apiClient.put(`/query-cases/${caseId}/assign-expert`, {
        expertId
      });

      if (response.data.success) {
        // Refresh the entire cases list to ensure consistency across all views
        await fetchCases();
        alert('Expert assigned successfully!');
      } else {
        alert(response.data.message || 'Failed to assign expert');
      }
    } catch (error) {
      console.error('Error assigning expert:', error);
      alert(error.response?.data?.message || 'Error assigning expert');
    }
  };

  // Assign an advocate to a query case
  const assignAdvocate = async (caseId, advocateId) => {
    if (!window.confirm('Are you sure you want to assign this advocate to the query case?')) {
      return;
    }

    try {
      const response = await apiClient.put(`/query-cases/${caseId}/assign-advocate`, {
        advocateId
      });

      if (response.data.success) {
        // Refresh the entire cases list to ensure consistency across all views
        await fetchCases();
        alert('Advocate assigned successfully!');
      } else {
        alert(response.data.message || 'Failed to assign advocate');
      }
    } catch (error) {
      console.error('Error assigning advocate:', error);
      alert(error.response?.data?.message || 'Error assigning advocate');
    }
  };

  // Get next follow-up date display for a case
  const getNextFollowUpDisplay = (caseItem) => {
    const latestNextDate = getLatestNextFollowUpDate(caseItem);
    if (!latestNextDate) return "—";
    
    const date = new Date(latestNextDate);
    return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Clear date filters
  const clearDateFilters = () => {
    setFilters(prev => ({
      ...prev,
      fromDate: "",
      toDate: ""
    }));
  };

  // PREPARE DATA FOR TABLE: Exclude complex fields like followUps, originalQuery
  const tableData = cases.map((item) => ({
    ...item,
    // Convert followUps to readable string for table
    followUps: item.followUps ? `${item.followUps.length} follow-up(s)` : "—",
    // Hide long text fields in table
    originalQuery: item.originalQuery?.length > 30 ? item.originalQuery.substring(0, 30) + "..." : item.originalQuery,
  }));

  return (
    <div className="max-w-[79vw]  mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Queries or Case</h2>
        <button
          onClick={() => navigate("/admin/create-query-case")}
          className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium"
        >
          Create Queries or Case
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-6">
        <input
          type="text"
          placeholder="Search By Dr. Name"
          className="p-2 border rounded text-sm bg-gray-100"
          value={filters.doctorName}
          onChange={(e) => handleFilterChange('doctorName', e.target.value)}
        />
        <select
          className="p-2 border rounded text-sm bg-gray-100"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Status</option>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          className="p-2 border rounded text-sm bg-gray-100"
          value={filters.caseType}
          onChange={(e) => handleFilterChange('caseType', e.target.value)}
        >
          <option value="">Case Type</option>
          <option value="">All Cases</option>
          <option value="Civil">Civil</option>
          <option value="Criminal">Criminal</option>
          <option value="Consumer">Consumer</option>
        </select>
        <input
          type="text"
          placeholder="Search By Patient"
          className="p-2 border rounded text-sm bg-gray-100"
          value={filters.patientName}
          onChange={(e) => handleFilterChange('patientName', e.target.value)}
        />
        <input
          type="text"
          placeholder="Search By Opponent"
          className="p-2 border rounded text-sm bg-gray-100"
          value={filters.opponentName}
          onChange={(e) => handleFilterChange('opponentName', e.target.value)}
        />
        
        {/* From Date Filter */}
        <div className="relative">
          <input
            type="date"
            placeholder="From Date"
            className="p-2 border rounded text-sm bg-gray-100 w-full"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
            max={filters.toDate || undefined}
          />
          {filters.fromDate && (
            <button
              onClick={() => handleFilterChange('fromDate', '')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          )}
        </div>
        
        {/* To Date Filter */}
        <div className="relative">
          <input
            type="date"
            placeholder="To Date"
            className="p-2 border rounded text-sm bg-gray-100 w-full"
            value={filters.toDate}
            onChange={(e) => handleFilterChange('toDate', e.target.value)}
            min={filters.fromDate || undefined}
          />
          {filters.toDate && (
            <button
              onClick={() => handleFilterChange('toDate', '')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter summary */}
      {(filters.fromDate || filters.toDate) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <div className="flex justify-between items-center">
            <div>
              <strong>📅 Next Follow-up Date Range:</strong>
              {filters.fromDate && ` From: ${formatDate(filters.fromDate)}`}
              {filters.fromDate && filters.toDate && ' → '}
              {filters.toDate && ` To: ${formatDate(filters.toDate)}`}
              <span className="ml-2 text-gray-600">
                (Showing {cases.length} cases with upcoming follow-ups in this range)
              </span>
            </div>
            <button
              onClick={clearDateFilters}
              className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-medium"
            >
              Clear Dates
            </button>
          </div>
        </div>
      )}

      {/* Instruction text below date filters */}
      <div className="mb-6 text-sm text-black flex justify-end">
        {/* Note: The above date filters are used to search cases based on the Next Follow-Up Date. */}
       <span className="text-red-500 mr-2">( Note : </span> Date filters are used to search cases based on the Next Follow-Up Date. )
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Queries Card */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Total Queries</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{cases.length}</div>
          <div className="text-xs text-gray-400 mt-1">All queries/cases</div>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">
            {cases.filter(c => c.status?.toLowerCase() === 'pending').length}
          </div>
          {/* <div className="text-xs text-gray-400 mt-1">Based on Status = Pending</div> */}
        </div>

        {/* Closed Card */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Closed</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {cases.filter(c => c.status?.toLowerCase() === 'closed').length}
          </div>
          {/* <div className="text-xs text-gray-400 mt-1">Based on Status = Closed</div> */}
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#398C89]"></div>
          <p className="mt-2 text-gray-600">Loading query cases...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {/* Table - Safe Data Passed */}
      {!loading && !error && (
        <Table
          data={tableData}
          extraColumns={[
            {
              header: "Next Follow-up",
              render: (row) => {
                const originalRow = cases.find((r) =>
                  (r._id && row._id && r._id === row._id) ||
                  (r.id && row.id && r.id === row.id)
                );

                // Don't show next follow-up date if case is closed
                if ((originalRow || row).status && ['Closed', 'Close'].includes((originalRow || row).status)) {
                  return <span className="text-gray-500 text-xs">—</span>;
                }

                const nextDate = getLatestNextFollowUpDate(originalRow || row);

                if (!nextDate) {
                  return <span className="text-gray-500 text-xs">—</span>;
                }

                const date = new Date(nextDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                date.setHours(0, 0, 0, 0);

                // Check if date is in the past
                if (date < today) {
                  return (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                      {date.toLocaleDateString('en-GB')} (Overdue)
                    </span>
                  );
                }

                // Check if date is today
                if (date.getTime() === today.getTime()) {
                  return (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                      {date.toLocaleDateString('en-GB')} (Today)
                    </span>
                  );
                }

                // Check if date is within next 7 days
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);
                if (date <= nextWeek) {
                  return (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      {date.toLocaleDateString('en-GB')} (Soon)
                    </span>
                  );
                }

                // Future date
                return (
                  <span className="text-gray-700 text-xs">
                    {date.toLocaleDateString('en-GB')}
                  </span>
                );
              },
            },
            {
              header: "Action",
              render: (row) => {
                // Find the original row from 'cases' state to ensure we have all data (like full followUps array)
                const originalRow = cases.find((r) =>
                  (r._id && row._id && r._id === row._id) ||
                  (r.id && row.id && r.id === row.id)
                );

                // Fallback to row if original not found (though followUps might be stringified)
                const rowToView = originalRow || row;

                return (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/view-query-case/${rowToView._id || rowToView.id}`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate("/admin/create-query-case", { state: { editData: rowToView } })}
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      Edit
                    </button>
                  </div>
                );
              },
            },
            {
              header: "Assign",
              render: (row) => {
                const originalRow = cases.find((r) => r._id === row._id || r.id === row._id);
                return (
                  <div className="flex flex-col gap-2 items-center">
                    {/* Expert Assignment Dropdown */}
                    <select
                      className="p-1 text-xs border rounded w-24"
                      onChange={(e) => {
                        if (e.target.value) {
                          assignExpert(originalRow._id, e.target.value);
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="">Assign Expert</option>
                      {experts.map((expert) => (
                        <option key={expert._id} value={expert._id}>
                          {expert.fullName || expert.name || expert.title}
                        </option>
                      ))}
                    </select>

                    {/* Advocate Assignment Dropdown */}
                    <select
                      className="p-1 text-xs border rounded w-24"
                      onChange={(e) => {
                        if (e.target.value) {
                          assignAdvocate(originalRow._id, e.target.value);
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="">Assign Advocate</option>
                      {advocates.map((advocate) => (
                        <option key={advocate._id} value={advocate._id}>
                          {advocate.fullName || advocate.name || advocate.barCouncilNumber}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => originalRow.status && ['Closed', 'Close'].includes(originalRow.status) ? null : handleFollowUp(originalRow)}
                      disabled={originalRow.status && ['Closed', 'Close'].includes(originalRow.status)}
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                        originalRow.status && ['Closed', 'Close'].includes(originalRow.status)
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Follow Ups
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 010-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>

                    <button
                      onClick={() => navigate(`/admin/queries/close-case/${originalRow._id}`)}
                      disabled={originalRow.status && ['Closed', 'Close'].includes(originalRow.status)}
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                        originalRow.status && ['Closed', 'Close'].includes(originalRow.status)
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      Close Case
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                );
              },
            },
          ]}
          excludeColumns={['id', 'queryType', 'subType', 'queryDescription', 'relation', 'opponentType', 'patientName', 'opponentName', 'opponentContact', 'opponentEmail', 'opponentAddress', 'caseStage', 'priority', 'tags', 'createdBy', 'createdAt', 'updatedAt', '__v', 'updatedBy', 'originalQuery', 'opponent', 'patient', 'ageGender', 'address', 'nextFollowUpDate']} // Removed 'nextFollowUpDate' from excludeColumns
          columnOrder={['id', 'caseId', 'caseNo', 'caseType', 'doctorId', 'doctorName', 'opponent', 'patient', 'ageGender', 'contactNo', 'address', 'status']}
          pagination={true}
        />
      )}

      {/* Expandable View */}
      {expandedRow && (
        <div className="mt-6 p-6 bg-gray-50 border rounded-lg">
          {(() => {
            const row = cases.find((r) => (r._id && r._id === expandedRow) || (r.id && r.id === expandedRow));
            if (!row) return null;

            // Get next follow-up date for this case
            const nextFollowUpDate = getLatestNextFollowUpDate(row);

            return (
              <>
                <div className="flex justify-between items-center text-sm text-gray-600 border-b pb-3 mb-4">
                  <div>
                    <span className="font-medium">{row.id || row.caseId}</span> | {row.doctorName} ({row.doctorId}) | Created {row.createdAt?.split('T')[0] || row.createdAt}
                  </div>
                  <button
                    onClick={() => setExpandedRow(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>

                {/* Next Follow-up Date Display */}
                {nextFollowUpDate && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-blue-800">Latest Next Follow-up:</span>
                      <span className="ml-2 text-blue-700">
                        {new Date(nextFollowUpDate).toLocaleDateString('en-GB', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Original Query</h4>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-gray-700">{row.originalQuery || row.queryDescription}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 min-w-[100px]">Patient:</span>
                      <span className="text-gray-800">{row.patientName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 min-w-[100px]">Opponent:</span>
                      <span className="text-gray-800">{row.opponentName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 min-w-[100px]">Expert:</span>
                      <span className="text-gray-800">{row.assignedExpert?.fullName || row.expert || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 min-w-[100px]">Advocate:</span>
                      <span className="text-gray-800">{row.assignedAdvocate?.fullName || row.advocate || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Followups (Latest first)</h4>
                  <div className="space-y-4">
                    {row.followUps && row.followUps.length > 0 ? (
                      // Sort follow-ups by date descending (latest first)
                      [...row.followUps].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)).map((fu) => (
                        <div key={fu._id || fu.createdAt || Date.now()} className="bg-white p-4 rounded border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm text-gray-800 font-medium mb-2">{fu.text || fu.remark || 'No description'}</p>
                              <div className="text-xs space-y-1">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-gray-600">Stage:</span>
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {fu.stage || 'N/A'}
                                  </span>
                                </div>
                                {fu.nextDate && row.status && !['Closed', 'Close'].includes(row.status) && (
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-600">Next Follow-up:</span>
                                    <span className={new Date(fu.nextDate) < new Date() ? 'text-red-600 font-medium' : 'text-green-600'}>
                                      {new Date(fu.nextDate).toLocaleDateString('en-GB')}
                                      {new Date(fu.nextDate) < new Date() && ' (Overdue)'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>By: {fu.user || fu.createdBy || 'System'}</span>
                                <span>On: {(fu.date || fu.createdAt) ? new Date(fu.date || fu.createdAt).toLocaleDateString('en-GB') : 'No date'}</span>
                                {fu.attachment && (
                                  <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    <a
                                      href={getFileUrl(fu.attachment) || '#'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                      onClick={(e) => {
                                        if (!fu.attachment || !getFileUrl(fu.attachment)) {
                                          e.preventDefault();
                                          alert('Attachment not available');
                                        }
                                      }}
                                    >
                                      Attachment
                                    </a>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No follow-ups yet.</p>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Follow-up Modal */}
      {followUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Followup – Add / Update</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-xl">
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stage</label>
                  <select
                    value={followUpForm.stage}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, stage: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                  >
                    <option>-- Select --</option>
                    <option> Query Raised</option>
                    <option> Legal Consultation</option>
                    <option> Expert Opinion</option>
                    <option> Referred to Civil Surgeon</option>
                    <option> Show Cause Notice</option>
                    <option> Notice Received</option>
                    <option> Notice Replied</option>
                    <option> Mediation / Settlement</option>
                    <option> Bill Recovery</option>
                    <option> FIR / Complaint Filed</option>
                    <option> Case Filed</option>
                    <option> Evidence</option>
                    <option>Cross Examination</option>
                    <option>Arguments</option>
                    <option>Order Reserved</option>
                    <option>Judgement</option>
                    <option>Appeal</option>
                    <option>Execution</option>
                    <option>Other</option>
                    <option>Close</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={followUpForm.date}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, date: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Next Date</label>
                  <input
                    type="date"
                    value={followUpForm.nextDate}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, nextDate: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Remark</label>
                <textarea
                  value={followUpForm.remark}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, remark: e.target.value })}
                  placeholder="Write follow-up remark..."
                  rows={4}
                  className="w-full p-3 border rounded text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Attachment (optional)</label>
                <input
                  type="file"
                  accept=".pdf,.docx,.jpg,.png"
                  onChange={(e) => setFollowUpForm({ ...followUpForm, attachment: e.target.files[0] })}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#398C89] file:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                {/* <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Close Query</button> */}
                {/* <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">Close Case</button> */}
                <button
                  onClick={async () => {
                    // Get the current case to check its status
                    const currentCase = cases.find(c => c._id === followUpModal);

                    if (currentCase && ['Closed', 'Close'].includes(currentCase.status)) {
                      alert("Cannot add follow-up to a closed case.");
                      return;
                    }

                    try {
                      // Prepare form data for API call (use FormData for file uploads)
                      const formData = new FormData();

                      // Add text fields
                      formData.append('text', followUpForm.remark || '');  // Always send the text field
                      if (followUpForm.stage) formData.append('stage', followUpForm.stage);
                      if (followUpForm.nextDate) formData.append('nextDate', followUpForm.nextDate);

                      // Add attachment if it exists
                      if (followUpForm.attachment && followUpForm.attachment.name) {
                        formData.append('attachment', followUpForm.attachment);
                      }

                      // Make API call to add follow-up using a raw axios call for file upload
                      const token = localStorage.getItem('token');
                      const response = await axios.post(
                        `${apiClient.defaults.baseURL}${apiEndpoints.queryCases.addFollowUp(followUpModal)}`,
                        formData,
                        {
                          headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                          }
                        }
                      );

                      if (response.data.success) {
                        // Refresh the entire cases list to ensure consistency
                        await fetchCases();

                        alert("Follow-up saved successfully!");
                        closeModal();
                        // Reset form after successful submission
                        setFollowUpForm({
                          stage: "",
                          date: "",
                          nextDate: "",
                          remark: "",
                          attachment: null,
                        });
                      } else {
                        alert(response.data.message || 'Failed to add follow-up');
                      }
                    } catch (error) {
                      console.error('Error adding follow-up:', error);
                      alert(error.response?.data?.message || 'Error adding follow-up. Please try again.');
                    }
                  }}
                  className="px-4 py-2 bg-[#398C89] text-white rounded hover:bg-[#2e706e] text-sm"
                >
                  Save Followup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueriesOrCase;