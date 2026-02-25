// confirm wala hai ye
// import React, { useState, useEffect } from "react";
// import { Share2, UserCircle, X, Users, MapPin, Stethoscope, IdCard, ArrowRightCircle } from "lucide-react";
// import apiClient from '../../services/apiClient';
// import { toast } from 'react-toastify';

// const TransferDoctor = () => {
//   const [activeTab, setActiveTab] = useState("my-calls");
//   const [myCallsData, setMyCallsData] = useState([]);
//   const [assignedToMeData, setAssignedToMeData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedCallEntry, setSelectedCallEntry] = useState(null);
//   const [telecallersList, setTelecallersList] = useState([]);

//   const fetchMyOriginalCalls = async () => {
//     try {
//       setLoading(true);
//       const res = await apiClient.get('/tasks/telecallertask/my-calls');
//       if (res.data.success) setMyCallsData(res.data.data);
//     } catch (err) {
//       toast.error("Failed to load your calls");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTransferredCalls = async () => {
//     try {
//       setLoading(true);
//       const res = await apiClient.get('/tasks/telecallertask/assigned-to-me');
//       if (res.data.success) setAssignedToMeData(res.data.data);
//     } catch (err) {
//       toast.error("Failed to load transferred calls");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === "my-calls") fetchMyOriginalCalls();
//     else fetchTransferredCalls();
//   }, [activeTab]);

//   const currentData = activeTab === "my-calls" ? myCallsData : assignedToMeData;

//   const fetchTelecallersList = async () => {
//     try {
//       const res = await apiClient.get('/employees/rolefor-telecaller/telecaller');
//       if (res.data.success) {
//         setTelecallersList(res.data.data.map(u => ({
//           id: u._id,
//           userId: u.user,
//           name: u.fullName || "Unknown Telecaller",
//         })));
//       }
//     } catch (err) {
//       toast.error("Failed to load telecallers");
//     }
//   };

//   const openTransferModal = (callEntryId, doctorName) => {
//     setSelectedCallEntry({ callEntryId, doctorName });
//     fetchTelecallersList();
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedCallEntry(null);
//   };

//   const handleTransfer = async (telecaller) => {
//     if (!selectedCallEntry) return;
//     try {
//       await apiClient.post(`/tasks/transfer-call/${selectedCallEntry.callEntryId}`, {
//         newTelecallerId: telecaller.userId,
//         transferNote: "Transferred from dashboard"
//       });
//       toast.success(`${selectedCallEntry.doctorName} → ${telecaller.name}`);
//       closeModal();
//       activeTab === "my-calls" ? fetchMyOriginalCalls() : fetchTransferredCalls();
//     } catch (err) {
//       toast.error("Transfer failed");
//     }
//   };

//   const getStatusBadge = (status) => {
//     if (status === 'completed') return <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">Completed</span>;
//     if (status === 'in_progress') return <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">In Progress</span>;
//     return <span className="px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">Pending</span>;
//   };

//   const getEnquiryBadge = (type, label) => {
//     if (type === 'renewal_call') return <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{label}</span>;
//     if (type === 'salesman_added') return <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">{label}</span>;
//     return <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">{label}</span>;
//   };

//   if (loading) return (
//     <div className="p-10 text-center">
//       <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#15BBB3] mx-auto"></div>
//     </div>
//   );

//   return (
//     <div className="p-4 min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">

//         {/* Tabs */}
//         <div className="flex justify-between items-center mb-5">
//           <h2 className="text-2xl font-bold text-[#15BBB3]">
//             {activeTab === "my-calls" ? "My Calls" : "Assigned to Me"}
//           </h2>
//           <div className="flex bg-gray-100 rounded-lg p-1">
//             <button onClick={() => setActiveTab("my-calls")} className={`px-5 py-2 rounded-md text-sm font-medium ${activeTab === "my-calls" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
//               My Calls ({myCallsData.length})
//             </button>
//             <button onClick={() => setActiveTab("assigned-to-me")} className={`px-5 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${activeTab === "assigned-to-me" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
//               <Users size={14} /> Assigned ({assignedToMeData.length})
//             </button>
//           </div>
//         </div>

//         {/* Transferred Notice */}
//         {activeTab === "assigned-to-me" && assignedToMeData.length > 0 && (
//           <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm flex items-center gap-2">
//             <ArrowRightCircle size={18} />
//             <span>These doctors were transferred to you</span>
//           </div>
//         )}

//         {/* Compact Table */}
//        <div className="bg-white rounded-xl shadow overflow-hidden">
//   {currentData.length === 0 ? (
//     <div className="p-12 text-center text-gray-400">
//       <Users size={48} className="mx-auto mb-3 opacity-50" />
//       <p>No doctors found</p>
//     </div>
//   ) : (
//     <table className="w-full text-xs">
//       <thead className="bg-[#15BBB3] text-white">
//         <tr>
//           <th className="px-3 py-2.5 text-left font-bold">Date</th>
//           <th className="px-3 py-2.5 text-left font-bold">DR Name</th>
//           <th className="px-3 py-2.5 text-left font-bold">Hospital</th>
//           <th className="px-3 py-2.5 text-left font-bold">City</th>
//           <th className="px-3 py-2.5 text-left font-bold">Speciality</th>
//           <th className="px-3 py-2.5 text-left font-bold">Membership ID</th>
//           <th className="px-3 py-2.5 text-left font-bold">Enquiry</th>
//           <th className="px-3 py-2.5 text-left font-bold">Status</th>
//           <th className="px-3 py-2.5 text-center font-bold">Received</th>
//           {activeTab === "my-calls" && (
//             <th className="px-3 py-2.5 text-center font-bold">Action</th>
//           )}
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-gray-100">
//         {currentData.map((row, i) => (
//           <tr key={i} className="hover:bg-gray-50">
//             <td className="px-3 py-3 font-medium text-gray-700">
//               {row.scheduledDate ? new Date(row.scheduledDate).toLocaleDateString('en-GB') : '-'}
//             </td>
//             <td className="px-3 py-3">
//               <div className="flex flex-col">
//                 <span className="font-bold text-gray-900">Dr. {row.doctor.fullName || 'Unknown'}</span>
//                 {row.isTransferred && (
//                   <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mt-1 w-fit">Transferred</span>
//                 )}
//               </div>
//             </td>
//             <td className="px-3 py-3 text-gray-700">{row.doctor.hospitalName || '-'}</td>
//             <td className="px-3 py-3">
//               <div className="flex items-center gap-1 text-gray-600">
//                 <MapPin size={13} /> {row.doctor.city || 'N/A'}
//               </div>
//             </td>
//             <td className="px-3 py-3">
//               <div className="flex items-center gap-1 text-gray-600">
//                 <Stethoscope size={13} /> {row.doctor.specialization || 'General'}
//               </div>
//             </td>
//             <td className="px-3 py-3">
//               <div className="flex items-center gap-1">
//                 <IdCard size={13} className="text-blue-600" />
//                 <span className="font-mono text-blue-700 font-bold">{row.doctor.membershipId || '—'}</span>
//               </div>
//             </td>
//             <td className="px-3 py-3">{getEnquiryBadge(row.source.type, row.source.label)}</td>
//             <td className="px-3 py-3">{getStatusBadge(row.doctorTaskStatus)}</td>
//             <td className="px-3 py-3 text-center">
//               {row.transferredFrom || '-'}
//             </td>
//             {activeTab === "my-calls" && (
//               <td className="px-3 py-3 text-center">
//                 <button
//                   onClick={() => openTransferModal(row.callEntryId, row.doctor.fullName)}
//                   className="bg-[#15BBB3] hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 mx-auto shadow"
//                 >
//                   <Share2 size={14} /> Transfer
//                 </button>
//               </td>
//             )}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )}
// </div>
//       </div>

//       {/* Compact Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-[#15BBB3]">Transfer Doctor</h3>
//               <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
//             </div>
//             <p className="text-gray-600 mb-5">Select telecaller for: <strong>{selectedCallEntry?.doctorName}</strong></p>
//             <div className="space-y-3 max-h-80 overflow-y-auto">
//               {telecallersList.map(tc => (
//                 <div key={tc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
//                   <div className="flex items-center gap-3">
//                     <div className="bg-[#15BBB3] text-white p-2 rounded-full"><UserCircle size={28} /></div>
//                     <div>
//                       <p className="font-semibold">{tc.name}</p>
//                       <p className="text-xs text-gray-500">Telecaller</p>
//                     </div>
//                   </div>
//                   <button onClick={() => handleTransfer(tc)} className="bg-[#15BBB3] hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
//                     Transfer
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransferDoctor;

































// import React, { useState, useEffect } from "react";
// import { Share2, UserCircle, X, Users, MapPin, Stethoscope, IdCard, ArrowRightCircle } from "lucide-react";
// import apiClient from '../../services/apiClient';
// import { toast } from 'react-toastify';

// const TransferDoctor = () => {
//   const [activeTab, setActiveTab] = useState("my-calls");
//   const [taskCalls, setTaskCalls] = useState([]);           // Pehle wale task calls
//   const [myAddedDoctors, setMyAddedDoctors] = useState([]); // Naye added doctors
//   const [combinedData, setCombinedData] = useState([]);     // Final merged list
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);   // { type: 'task' | 'doctor', id, name }
//   const [telecallersList, setTelecallersList] = useState([]);

//   // Fetch Task Calls
//   const fetchTaskCalls = async () => {
//     try {
//       const res = await apiClient.get('/tasks/telecallertask/my-calls');
//       if (res.data.success) {
//         setTaskCalls(res.data.data || []);
//       }
//     } catch (err) {
//       toast.error("Failed to load task calls");
//     }
//   };

//   // Fetch My Added Doctors
//   const fetchMyAddedDoctors = async () => {
//     try {
//       const res = await apiClient.get('/doctors/my-doctors'); // ← Ye API change kar lena agar alag hai
//       if (res.data.success) {
//         setMyAddedDoctors(res.data.data || []);
//       }
//     } catch (err) {
//       toast.error("Failed to load your added doctors");
//     }
//   };

//   // Fetch Transferred to Me (same as before)
//   const fetchTransferredCalls = async () => {
//     try {
//       const res = await apiClient.get('/tasks/telecallertask/assigned-to-me');
//       if (res.data.success) {
//         setCombinedData(res.data.data || []); // Only task-based transferred
//       }
//     } catch (err) {
//       toast.error("Failed to load transferred calls");
//     }
//   };

//   // Merge both lists when in "My Calls"
//   useEffect(() => {
//     if (activeTab === "my-calls") {
//       const merged = [
//         ...taskCalls.map(item => ({ ...item, itemType: 'task' })),
//         ...myAddedDoctors.map(doc => ({
//           ...doc,
//           itemType: 'doctor',
//           isTransferredToMe: doc.isTransferredToMe || false, // ← YE ADD KAR DENA
//           doctor: {
//             fullName: doc.fullName,
//             hospitalName: doc.hospitalName,
//             city: doc.hospitalAddress?.city || doc.contactDetails?.currentAddress?.city || 'N/A',
//             specialization: doc.specialization?.join(', ') || 'General',
//             membershipId: doc.membershipId || doc.doctorId || '—'
//           },
//           doctorTaskStatus: doc.doctorStatus || 'cold', // ya jo bhi status use karte ho
//           source: { type: 'my_added', label: 'My Added' },
//           scheduledDate: doc.createdAt,
//           callEntryId: doc._id, // temporary for modal
//         }))
//       ];
//       setCombinedData(merged);
//       setLoading(false);
//     }
//   }, [taskCalls, myAddedDoctors, activeTab]);

//   // Load data on tab change
//   useEffect(() => {
//     setLoading(true);
//     if (activeTab === "my-calls") {
//       Promise.all([fetchTaskCalls(), fetchMyAddedDoctors()]);
//     } else {
//       fetchTransferredCalls().finally(() => setLoading(false));
//     }
//   }, [activeTab]);

//   const fetchTelecallersList = async () => {
//     try {
//       const res = await apiClient.get('/employees/rolefor-telecaller/telecaller');
//       if (res.data.success) {
//         setTelecallersList(res.data.data.map(u => ({
//           id: u._id,
//           userId: u.user,
//           name: u.fullName || "Unknown Telecaller",
//         })));
//       }
//     } catch (err) {
//       toast.error("Failed to load telecallers");
//     }
//   };

//   const openTransferModal = (item) => {
//     setSelectedItem(item); // { itemType: 'task' | 'doctor', id: callEntryId or _id, name }
//     fetchTelecallersList();
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedItem(null);
//   };

//   const handleTransfer = async (telecaller) => {
//     if (!selectedItem) return;

//     try {
//       if (selectedItem.itemType === 'task') {
//         // Old Task Transfer API
//         await apiClient.post(`/tasks/transfer-call/${selectedItem.id}`, {
//           newTelecallerId: telecaller.userId,
//           transferNote: "Transferred from dashboard"
//         });
//         toast.success(`${selectedItem.doctorName} → ${telecaller.name}`);
//       } else {
//         // New Doctor Transfer API
//         await apiClient.put(`/doctors/transfer-doctor/${selectedItem.id}`, {
//           newTelecallerId: telecaller.userId,
//           reason: "Transferred from telecaller dashboard"
//         });
//         toast.success(`${selectedItem.doctor.fullName} → ${telecaller.name}`);
//       }

//       closeModal();
//       // Refresh data
//       if (activeTab === "my-calls") {
//         fetchTaskCalls();
//         fetchMyAddedDoctors();
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Transfer failed");
//     }
//   };

//   const getStatusBadge = (status) => {
//     const map = {
//       completed: "bg-green-100 text-green-700",
//       in_progress: "bg-yellow-100 text-yellow-700",
//       cold: "bg-red-100 text-red-700",
//       warm: "bg-orange-100 text-orange-700",
//       hot: "bg-pink-100 text-pink-700",
//     };
//     const color = map[status] || "bg-gray-100 text-gray-700";
//     return <span className={`px-2.5 py-0.5 ${color} rounded-full text-xs font-bold`}>{status?.toUpperCase() || 'PENDING'}</span>;
//   };

//   const getEnquiryBadge = (type, label) => {
//     const map = {
//       renewal_call: "bg-blue-100 text-blue-700",
//       salesman_added: "bg-orange-100 text-orange-700",
//       my_added: "bg-purple-100 text-purple-700",
//       cold: "bg-gray-100 text-gray-700",
//     };
//     return <span className={`px-2.5 py-0.5 ${map[type] || 'bg-gray-100 text-gray-700'} rounded-full text-xs font-bold`}>{label}</span>;
//   };

//   if (loading) return (
//     <div className="p-10 text-center">
//       <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#15BBB3] mx-auto"></div>
//     </div>
//   );

//   return (
//     <div className="p-4 min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">

//         <div className="flex justify-between items-center mb-5">
//           <h2 className="text-2xl font-bold text-[#15BBB3]">
//             {activeTab === "my-calls" ? "My Calls & Doctors" : "Assigned to Me"}
//           </h2>
//           <div className="flex bg-gray-100 rounded-lg p-1">
//             <button onClick={() => setActiveTab("my-calls")} className={`px-5 py-2 rounded-md text-sm font-medium ${activeTab === "my-calls" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
//               My Calls ({combinedData.length})
//             </button>
//             <button onClick={() => setActiveTab("assigned-to-me")} className={`px-5 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${activeTab === "assigned-to-me" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
//               <Users size={14} /> Assigned ({combinedData.length})
//             </button>
//           </div>
//         </div>

//         {activeTab === "assigned-to-me" && combinedData.length > 0 && (
//           <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm flex items-center gap-2">
//             <ArrowRightCircle size={18} />
//             <span>These doctors were transferred to you</span>
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow overflow-hidden">
//           {combinedData.length === 0 ? (
//             <div className="p-12 text-center text-gray-400">
//               <Users size={48} className="mx-auto mb-3 opacity-50" />
//               <p>No doctors found</p>
//             </div>
//           ) : (
//             <table className="w-full text-xs">
//               <thead className="bg-[#15BBB3] text-white">
//                 <tr>
//                   <th className="px-3 py-2.5 text-left font-bold">Date</th>
//                   <th className="px-3 py-2.5 text-left font-bold">DR Name</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Hospital</th>
//                   <th className="px-3 py-2.5 text-left font-bold">City</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Speciality</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Membership ID</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Source</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Status</th>
//                   {activeTab === "my-calls" && <th className="px-3 py-2.5 text-center font-bold">Action</th>}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {combinedData.map((row, i) => (
//                   <tr key={i} className="hover:bg-gray-50">
//                     <td className="px-3 py-3 font-medium text-gray-700">
//                       {row.scheduledDate ? new Date(row.scheduledDate).toLocaleDateString('en-GB') : new Date(row.createdAt).toLocaleDateString('en-GB')}
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex flex-col">
//                         <span className="font-bold text-gray-900">Dr. {row.doctor.fullName || 'Unknown'}</span>
//                         {/* {row.itemType === 'doctor' && (
//                           <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1 w-fit">My Added</span>
//                         )} */}


// {row.itemType === 'doctor' && (
//   <>
//     {row.isTransferredToMe ? (
//       <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mt-1 w-fit">
//         Transferred to Me
//       </span>
//     ) : (
//       <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1 w-fit">
//         My Added
//       </span>
//     )}
//   </>
// )}


//                         {row.isTransferred && (
//                           <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mt-1 w-fit">Transferred</span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3 text-gray-700">{row.doctor.hospitalName || '-'}</td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1 text-gray-600">
//                         <MapPin size={13} /> {row.doctor.city || 'N/A'}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1 text-gray-600">
//                         <Stethoscope size={13} /> {row.doctor.specialization || 'General'}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1">
//                         <IdCard size={13} className="text-blue-600" />
//                         <span className="font-mono text-blue-700 font-bold">{row.doctor.membershipId || '—'}</span>
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">{getEnquiryBadge(row.source?.type || row.itemType, row.source?.label || 'My Added')}</td>
//                     <td className="px-3 py-3">{getStatusBadge(row.doctorTaskStatus || row.doctorStatus)}</td>
//                     {activeTab === "my-calls" && (
//                       <td className="px-3 py-3 text-center">
//                         <button
//                           onClick={() => openTransferModal({
//                             itemType: row.itemType,
//                             id: row.itemType === 'task' ? row.callEntryId : row._id,
//                             doctor: row.doctor
//                           })}
//                           className="bg-[#15BBB3] hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 mx-auto shadow"
//                         >
//                           <Share2 size={14} /> Transfer
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* Modal same hi rahega */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-[#15BBB3]">Transfer Doctor</h3>
//               <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
//             </div>
//             <p className="text-gray-600 mb-5">
//               Select telecaller for: <strong>Dr. {selectedItem?.doctor?.fullName}</strong>
//               {selectedItem?.itemType === 'doctor' && <span className="text-purple-600 text-xs ml-2">(My Added)</span>}
//             </p>
//             <div className="space-y-3 max-h-80 overflow-y-auto">
//               {telecallersList.map(tc => (
//                 <div key={tc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
//                   <div className="flex items-center gap-3">
//                     <div className="bg-[#15BBB3] text-white p-2 rounded-full"><UserCircle size={28} /></div>
//                     <div>
//                       <p className="font-semibold">{tc.name}</p>
//                       <p className="text-xs text-gray-500">Telecaller</p>
//                     </div>
//                   </div>
//                   <button onClick={() => handleTransfer(tc)} className="bg-[#15BBB3] hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
//                     Transfer
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransferDoctor;




















































// import React, { useState, useEffect } from "react";
// import { Share2, UserCircle, X, Users, MapPin, Stethoscope, IdCard, ArrowRightCircle } from "lucide-react";
// import apiClient from '../../services/apiClient';
// import { toast } from 'react-toastify';

// const TransferDoctor = () => {
//   const [activeTab, setActiveTab] = useState("my-calls");

//   // Data states
//   const [taskCalls, setTaskCalls] = useState([]);                    // My task calls
//   const [myAddedDoctors, setMyAddedDoctors] = useState([]);          // Tune khud add kiye
//   const [transferredDoctors, setTransferredDoctors] = useState([]);  // Tujhe transfer hue doctors
//   const [assignedTasks, setAssignedTasks] = useState([]);            // Tujhe assign hue tasks

//   const [combinedData, setCombinedData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Modal states
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [telecallersList, setTelecallersList] = useState([]);

//   // Fetch My Task Calls
//   const fetchMyTaskCalls = async () => {
//     try {
//       const res = await apiClient.get('/tasks/telecallertask/my-calls');
//       if (res.data.success) setTaskCalls(res.data.data || []);
//     } catch (err) {
//       toast.error("Failed to load your task calls");
//     }
//   };

//   // Fetch My Added Doctors (sirf jo tune khud add kiye)
//   const fetchMyAddedDoctors = async () => {
//     try {
//       const res = await apiClient.get('/doctors/my-doctors');
//       if (res.data.success) {
//         const onlyMyAdded = (res.data.data || []).filter(doc => !doc.isTransferredToMe);
//         setMyAddedDoctors(onlyMyAdded);
//       }
//     } catch (err) {
//       toast.error("Failed to load your added doctors");
//     }
//   };

//   // Fetch Doctors Transferred to Me
//   const fetchTransferredDoctors = async () => {
//     try {
//       const res = await apiClient.get('/doctors/my-doctors');
//       if (res.data.success) {
//         const onlyTransferred = (res.data.data || []).filter(doc => doc.isTransferredToMe);
//         setTransferredDoctors(onlyTransferred);
//       }
//     } catch (err) {
//       toast.error("Failed to load transferred doctors");
//     }
//   };

//   // Fetch Tasks Assigned to Me
//   const fetchAssignedTasks = async () => {
//     try {
//       const res = await apiClient.get('/tasks/telecallertask/assigned-to-me');
//       if (res.data.success) setAssignedTasks(res.data.data || []);
//     } catch (err) {
//       toast.error("Failed to load assigned tasks");
//     }
//   };

//   // Load data based on tab
//   useEffect(() => {
//     setLoading(true);
//     if (activeTab === "my-calls") {
//       Promise.all([fetchMyTaskCalls(), fetchMyAddedDoctors()]).finally(() => setLoading(false));
//     } else {
//       Promise.all([fetchAssignedTasks(), fetchTransferredDoctors()]).finally(() => setLoading(false));
//     }
//   }, [activeTab]);

//   // Merge data for current tab
//   useEffect(() => {
//     let merged = [];

//     if (activeTab === "my-calls") {
//       merged = [
//         ...taskCalls.map(item => ({ ...item, itemType: 'task', isTransferredToMe: false })),
//         ...myAddedDoctors.map(doc => ({
//           ...doc,
//           itemType: 'doctor',
//           isTransferredToMe: false,
//           doctor: {
//             fullName: doc.fullName,
//             hospitalName: doc.hospitalName,
//             city: doc.hospitalAddress?.city || doc.contactDetails?.currentAddress?.city || 'N/A',
//             specialization: doc.specialization?.join(', ') || 'General',
//             membershipId: doc.membershipId || doc.doctorId || '—'
//           },
//           doctorTaskStatus: doc.doctorStatus || 'cold',
//           source: { type: 'my_added', label: 'My Added' },
//           scheduledDate: doc.createdAt,
//           callEntryId: doc._id,
//         }))
//       ];
//     } else {
//       merged = [
//         ...assignedTasks.map(item => ({ ...item, itemType: 'task', isTransferredToMe: true })),
//         ...transferredDoctors.map(doc => ({
//           ...doc,
//           itemType: 'doctor',
//           isTransferredToMe: true,
//           doctor: {
//             fullName: doc.fullName,
//             hospitalName: doc.hospitalName,
//             city: doc.hospitalAddress?.city || doc.contactDetails?.currentAddress?.city || 'N/A',
//             specialization: doc.specialization?.join(', ') || 'General',
//             membershipId: doc.membershipId || doc.doctorId || '—'
//           },
//           doctorTaskStatus: doc.doctorStatus || 'cold',
//           source: { type: 'transferred', label: 'Transferred to Me' },
//           scheduledDate: doc.createdAt,
//           callEntryId: doc._id,
//         }))
//       ];
//     }

//     setCombinedData(merged);
//   }, [activeTab, taskCalls, myAddedDoctors, assignedTasks, transferredDoctors]);

//   // Fetch telecallers for transfer
//   const fetchTelecallersList = async () => {
//     try {
//       const res = await apiClient.get('/employees/rolefor-telecaller/telecaller');
//       if (res.data.success) {
//         setTelecallersList(res.data.data.map(u => ({
//           id: u._id,
//           userId: u.user,
//           name: u.fullName || "Unknown Telecaller",
//         })));
//       }
//     } catch (err) {
//       toast.error("Failed to load telecallers");
//     }
//   };

//   const openTransferModal = (item) => {
//     setSelectedItem(item);
//     fetchTelecallersList();
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedItem(null);
//   };

//   const handleTransfer = async (telecaller) => {
//     if (!selectedItem) return;

//     try {
//       if (selectedItem.itemType === 'task') {
//         await apiClient.post(`/tasks/transfer-call/${selectedItem.id || selectedItem.callEntryId}`, {
//           newTelecallerId: telecaller.userId,
//           transferNote: "Transferred from dashboard"
//         });
//         toast.success(`Task → ${telecaller.name}`);
//       } else {
//         await apiClient.put(`/doctors/transfer-doctor/${selectedItem._id || selectedItem.callEntryId}`, {
//           newTelecallerId: telecaller.userId,
//           reason: "Transferred from telecaller dashboard"
//         });
//         toast.success(`Dr. ${selectedItem.doctor.fullName} → ${telecaller.name}`);
//       }

//       closeModal();
//       // Refresh current tab
//       if (activeTab === "my-calls") {
//         fetchMyTaskCalls();
//         fetchMyAddedDoctors();
//       } else {
//         fetchAssignedTasks();
//         fetchTransferredDoctors();
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Transfer failed");
//     }
//   };

//   const getStatusBadge = (status) => {
//     const map = {
//       completed: "bg-green-100 text-green-700",
//       in_progress: "bg-yellow-100 text-yellow-700",
//       cold: "bg-red-100 text-red-700",
//       warm: "bg-orange-100 text-orange-700",
//       hot: "bg-pink-100 text-pink-700",
//     };
//     const color = map[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
//     return <span className={`px-2.5 py-0.5 ${color} rounded-full text-xs font-bold`}>{status?.toUpperCase() || 'COLD'}</span>;
//   };

//   if (loading) return (
//     <div className="p-10 text-center">
//       <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#15BBB3] mx-auto"></div>
//     </div>
//   );

//   return (
//     <div className="p-4 min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-5">
//           <h2 className="text-2xl font-bold text-[#15BBB3]">
//             {activeTab === "my-calls" ? "My Calls & My Doctors" : "Assigned to Me"}
//           </h2>
//           <div className="flex bg-gray-100 rounded-lg p-1">
//             <button onClick={() => setActiveTab("my-calls")} className={`px-5 py-2 rounded-md text-sm font-medium ${activeTab === "my-calls" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
//               My Calls ({combinedData.filter(d => !d.isTransferredToMe).length})
//             </button>
//             <button onClick={() => setActiveTab("assigned-to-me")} className={`px-5 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${activeTab === "assigned-to-me" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
//               <Users size={14} /> Assigned ({combinedData.filter(d => d.isTransferredToMe).length})
//             </button>
//           </div>
//         </div>

//         {activeTab === "assigned-to-me" && combinedData.length > 0 && (
//           <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm flex items-center gap-2">
//             <ArrowRightCircle size={18} />
//             <span>These were transferred/assigned to you</span>
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow overflow-hidden">
//           {combinedData.length === 0 ? (
//             <div className="p-12 text-center text-gray-400">
//               <Users size={48} className="mx-auto mb-3 opacity-50" />
//               <p>No data found</p>
//             </div>
//           ) : (
//             <table className="w-full text-xs">
//               <thead className="bg-[#15BBB3] text-white">
//                 <tr>
//                   <th className="px-3 py-2.5 text-left font-bold">Date</th>
//                   <th className="px-3 py-2.5 text-left font-bold">DR Name</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Hospital</th>
//                   <th className="px-3 py-2.5 text-left font-bold">City</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Speciality</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Membership ID</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Source</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Status</th>
//                   {activeTab === "my-calls" && <th className="px-3 py-2.5 text-center font-bold">Action</th>}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {combinedData.map((row, i) => (
//                   <tr key={i} className="hover:bg-gray-50">
//                     <td className="px-3 py-3 font-medium text-gray-700">
//                       {new Date(row.scheduledDate || row.createdAt).toLocaleDateString('en-GB')}
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex flex-col">
//                         <span className="font-bold text-gray-900">Dr. {row.doctor?.fullName || row.doctorName || 'Unknown'}</span>
//                         {row.itemType === 'doctor' && (
//                           <span className={`text-xs px-2 py-0.5 rounded-full mt-1 w-fit ${
//                             row.isTransferredToMe
//                               ? 'bg-orange-100 text-orange-700'
//                               : 'bg-purple-100 text-purple-700'
//                           }`}>
//                             {row.isTransferredToMe ? 'Transferred to Me' : 'My Added'}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3 text-gray-700">{row.doctor?.hospitalName || '-'}</td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1 text-gray-600">
//                         <MapPin size={13} /> {row.doctor?.city || 'N/A'}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1 text-gray-600">
//                         <Stethoscope size={13} /> {row.doctor?.specialization || 'General'}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1">
//                         <IdCard size={13} className="text-blue-600" />
//                         <span className="font-mono text-blue-700 font-bold">
//                           {row.doctor?.membershipId || '—'}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
//                         row.isTransferredToMe ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
//                       }`}>
//                         {row.isTransferredToMe ? 'Transferred' : 'My Added'}
//                       </span>
//                     </td>
//                     <td className="px-3 py-3">{getStatusBadge(row.doctorTaskStatus || row.doctorStatus)}</td>
//                     {activeTab === "my-calls" && (
//                       <td className="px-3 py-3 text-center">
//                         <button
//                           onClick={() => openTransferModal({
//                             itemType: row.itemType,
//                             id: row._id || row.callEntryId,
//                             doctor: row.doctor || { fullName: row.doctorName },
//                             isTransferredToMe: row.isTransferredToMe
//                           })}
//                           className="bg-[#15BBB3] hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 mx-auto shadow"
//                         >
//                           <Share2 size={14} /> Transfer
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* Transfer Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-[#15BBB3]">Transfer Doctor</h3>
//               <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
//             </div>
//             <p className="text-gray-600 mb-5">
//               Select telecaller for: <strong>Dr. {selectedItem?.doctor?.fullName}</strong>
//               {selectedItem?.itemType === 'doctor' && (
//                 <span className={`text-xs ml-2 ${selectedItem.isTransferredToMe ? 'text-orange-600' : 'text-purple-600'}`}>
//                   ({selectedItem.isTransferredToMe ? 'Transferred to Me' : 'My Added'})
//                 </span>
//               )}
//             </p>
//             <div className="space-y-3 max-h-80 overflow-y-auto">
//               {telecallersList.map(tc => (
//                 <div key={tc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
//                   <div className="flex items-center gap-3">
//                     <div className="bg-[#15BBB3] text-white p-2 rounded-full"><UserCircle size={28} /></div>
//                     <div>
//                       <p className="font-semibold">{tc.name}</p>
//                       <p className="text-xs text-gray-500">Telecaller</p>
//                     </div>
//                   </div>
//                   <button onClick={() => handleTransfer(tc)} className="bg-[#15BBB3] hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
//                     Transfer
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransferDoctor;

































// import React, { useState, useEffect } from "react";
// import { Share2, UserCircle, X, Users, MapPin, Stethoscope, IdCard, ArrowRightCircle } from "lucide-react";
// import apiClient from '../../services/apiClient';
// import { toast } from 'react-toastify';

// const TransferDoctor = () => {
//   const [activeTab, setActiveTab] = useState("my-calls");

//   const [taskCalls, setTaskCalls] = useState([]);
//   const [myAddedDoctors, setMyAddedDoctors] = useState([]);
//   const [transferredDoctors, setTransferredDoctors] = useState([]);
//   const [assignedTasks, setAssignedTasks] = useState([]);

//   const [combinedData, setCombinedData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [telecallersList, setTelecallersList] = useState([]);

//   // Fetch functions (same as before)
//   const fetchMyTaskCalls = async () => {
//     try {
//       const res = await apiClient.get('/tasks/telecallertask/my-calls');
//       if (res.data.success) setTaskCalls(res.data.data || []);
//     } catch (err) {
//       toast.error("Failed to load your task calls");
//     }
//   };

//   const fetchMyAddedDoctors = async () => {
//     try {
//       const res = await apiClient.get('/doctors/my-doctors');
//       if (res.data.success) {
//         const onlyMyAdded = (res.data.data || []).filter(doc => !doc.isTransferredToMe);
//         setMyAddedDoctors(onlyMyAdded);
//       }
//     } catch (err) {
//       toast.error("Failed to load your added doctors");
//     }
//   };

//   const fetchTransferredDoctors = async () => {
//     try {
//       const res = await apiClient.get('/doctors/my-doctors');
//       if (res.data.success) {
//         const onlyTransferred = (res.data.data || []).filter(doc => doc.isTransferredToMe);
//         setTransferredDoctors(onlyTransferred);
//       }
//     } catch (err) {
//       toast.error("Failed to load transferred doctors");
//     }
//   };

//   const fetchAssignedTasks = async () => {
//     try {
//       const res = await apiClient.get('/tasks/telecallertask/assigned-to-me');
//       if (res.data.success) setAssignedTasks(res.data.data || []);
//     } catch (err) {
//       toast.error("Failed to load assigned tasks");
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     if (activeTab === "my-calls") {
//       Promise.all([fetchMyTaskCalls(), fetchMyAddedDoctors()]).finally(() => setLoading(false));
//     } else {
//       Promise.all([fetchAssignedTasks(), fetchTransferredDoctors()]).finally(() => setLoading(false));
//     }
//   }, [activeTab]);

//   useEffect(() => {
//     let merged = [];

//     if (activeTab === "my-calls") {
//       merged = [
//         ...taskCalls.map(item => ({
//           ...item,
//           itemType: 'task',
//           isTransferredToMe: false,
//           doctorId: item.doctorId || item._id // GUARANTEED ID
//         })),
//         ...myAddedDoctors.map(doc => ({
//           ...doc,
//           itemType: 'doctor',
//           isTransferredToMe: false,
//           doctorId: doc._id, // 100% sahi ID
//           doctor: {
//             fullName: doc.fullName,
//             hospitalName: doc.hospitalName,
//             city: doc.hospitalAddress?.city || doc.contactDetails?.currentAddress?.city || 'N/A',
//             specialization: doc.specialization?.join(', ') || 'General',
//             membershipId: doc.membershipId || doc.doctorId || '—'
//           },
//           doctorTaskStatus: doc.doctorStatus || 'cold',
//           source: { type: 'my_added', label: 'My Added' },
//           scheduledDate: doc.createdAt,
//         }))
//       ];
//     } else {
//       merged = [
//         ...assignedTasks.map(item => ({
//           ...item,
//           itemType: 'task',
//           isTransferredToMe: true,
//           doctorId: item.doctorId || item._id
//         })),
//         ...transferredDoctors.map(doc => ({
//           ...doc,
//           itemType: 'doctor',
//           isTransferredToMe: true,
//           doctorId: doc._id, // 100% sahi ID
//           doctor: {
//             fullName: doc.fullName,
//             hospitalName: doc.hospitalName,
//             city: doc.hospitalAddress?.city || doc.contactDetails?.currentAddress?.city || 'N/A',
//             specialization: doc.specialization?.join(', ') || 'General',
//             membershipId: doc.membershipId || doc.doctorId || '—'
//           },
//           doctorTaskStatus: doc.doctorStatus || 'cold',
//           source: { type: 'transferred', label: 'Transferred to Me' },
//           scheduledDate: doc.createdAt,
//         }))
//       ];
//     }

//     setCombinedData(merged);
//   }, [activeTab, taskCalls, myAddedDoctors, assignedTasks, transferredDoctors]);

//   const fetchTelecallersList = async () => {
//     try {
//       const res = await apiClient.get('/employees/rolefor-telecaller/telecaller');
//       if (res.data.success) {
//         setTelecallersList(res.data.data.map(u => ({
//           id: u._id,
//           userId: u.user,
//           name: u.fullName || "Unknown Telecaller",
//         })));
//       }
//     } catch (err) {
//       toast.error("Failed to load telecallers");
//     }
//   };

//   const openTransferModal = (row) => {
//     setSelectedItem({
//       itemType: row.itemType,
//       id: row.doctorId || row._id, // YE 100% HAMESHA SAHI ID HOGA
//       doctor: row.doctor || { fullName: row.doctorName || 'Unknown' },
//       isTransferredToMe: row.isTransferredToMe
//     });
//     fetchTelecallersList();
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedItem(null);
//   };

//   const handleTransfer = async (telecaller) => {
//     if (!selectedItem || !selectedItem.id) {
//       toast.error("Invalid doctor/task selected");
//       return;
//     }

//     try {
//       if (selectedItem.itemType === 'task') {
//         await apiClient.post(`/tasks/transfer-call/${selectedItem.id}`, {
//           newTelecallerId: telecaller.userId,
//           transferNote: "Transferred from dashboard"
//         });
//       } else {
//         await apiClient.put(`/doctors/transfer-doctor/${selectedItem.id}`, {
//           newTelecallerId: telecaller.userId,
//           reason: "Transferred from telecaller dashboard"
//         });
//       }

//       toast.success(`Transferred to ${telecaller.name}`);
//       closeModal();

//       // Refresh current tab
//       if (activeTab === "my-calls") {
//         fetchMyTaskCalls();
//         fetchMyAddedDoctors();
//       } else {
//         fetchAssignedTasks();
//         fetchTransferredDoctors();
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Transfer failed");
//     }
//   };

//   const getStatusBadge = (status) => {
//     const map = {
//       completed: "bg-green-100 text-green-700",
//       in_progress: "bg-yellow-100 text-yellow-700",
//       cold: "bg-red-100 text-red-700",
//       warm: "bg-orange-100 text-orange-700",
//       hot: "bg-pink-100 text-pink-700",
//     };
//     const color = map[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
//     return <span className={`px-2.5 py-0.5 ${color} rounded-full text-xs font-bold`}>{(status || 'cold').toUpperCase()}</span>;
//   };

//   if (loading) return (
//     <div className="p-10 text-center">
//       <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#15BBB3] mx-auto"></div>
//     </div>
//   );

//   return (
//     <div className="p-4 min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-5">
//           <h2 className="text-2xl font-bold text-[#15BBB3]">
//             {activeTab === "my-calls" ? "My Calls & My Doctors" : "Assigned to Me"}
//           </h2>
//           <div className="flex bg-gray-100 rounded-lg p-1">
//             <button onClick={() => setActiveTab("my-calls")} className={`px-5 py-2 rounded-md text-sm font-medium ${activeTab === "my-calls" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
//               My Calls ({combinedData.length})
//             </button>
//             <button onClick={() => setActiveTab("assigned-to-me")} className={`px-5 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${activeTab === "assigned-to-me" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
//               <Users size={14} /> Assigned ({combinedData.length})
//             </button>
//           </div>
//         </div>

//         {activeTab === "assigned-to-me" && combinedData.length > 0 && (
//           <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm flex items-center gap-2">
//             <ArrowRightCircle size={18} />
//             <span>These were transferred/assigned to you</span>
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow overflow-hidden">
//           {combinedData.length === 0 ? (
//             <div className="p-12 text-center text-gray-400">
//               <Users size={48} className="mx-auto mb-3 opacity-50" />
//               <p>No data found</p>
//             </div>
//           ) : (
//             <table className="w-full text-xs">
//               <thead className="bg-[#15BBB3] text-white">
//                 <tr>
//                   <th className="px-3 py-2.5 text-left font-bold">Date</th>
//                   <th className="px-3 py-2.5 text-left font-bold">DR Name</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Hospital</th>
//                   <th className="px-3 py-2.5 text-left font-bold">City</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Speciality</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Membership ID</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Source</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Status</th>
//                   {activeTab === "my-calls" && <th className="px-3 py-2.5 text-center font-bold">Action</th>}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {combinedData.map((row, i) => (
//                   <tr key={i} className="hover:bg-gray-50">
//                     <td className="px-3 py-3 font-medium text-gray-700">
//                       {new Date(row.scheduledDate || row.createdAt).toLocaleDateString('en-GB')}
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex flex-col">
//                         <span className="font-bold text-gray-900">
//                           Dr. {row.doctor?.fullName || row.doctorName || 'Unknown'}
//                         </span>
//                         {row.itemType === 'doctor' && (
//                           <span className={`text-xs px-2 py-0.5 rounded-full mt-1 w-fit ${
//                             row.isTransferredToMe
//                               ? 'bg-orange-100 text-orange-700'
//                               : 'bg-purple-100 text-purple-700'
//                           }`}>
//                             {row.isTransferredToMe ? 'Transferred to Me' : 'My Added'}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3 text-gray-700">{row.doctor?.hospitalName || '-'}</td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1 text-gray-600">
//                         <MapPin size={13} /> {row.doctor?.city || 'N/A'}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1 text-gray-600">
//                         <Stethoscope size={13} /> {row.doctor?.specialization || 'General'}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1">
//                         <IdCard size={13} className="text-blue-600" />
//                         <span className="font-mono text-blue-700 font-bold">
//                           {row.doctor?.membershipId || '—'}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
//                         row.isTransferredToMe ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
//                       }`}>
//                         {row.isTransferredToMe ? 'Transferred' : 'My Added'}
//                       </span>
//                     </td>
//                     <td className="px-3 py-3">{getStatusBadge(row.doctorTaskStatus || row.doctorStatus)}</td>
//                     {activeTab === "my-calls" && (
//                       <td className="px-3 py-3 text-center">
//                         <button
//                           onClick={() => openTransferModal(row)}
//                           className="bg-[#15BBB3] hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 mx-auto shadow"
//                         >
//                           <Share2 size={14} /> Transfer
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-[#15BBB3]">Transfer Doctor</h3>
//               <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
//             </div>
//             <p className="text-gray-600 mb-5">
//               Select telecaller for: <strong>Dr. {selectedItem?.doctor?.fullName}</strong>
//               {selectedItem?.itemType === 'doctor' && (
//                 <span className={`text-xs ml-2 ${selectedItem.isTransferredToMe ? 'text-orange-600' : 'text-purple-600'}`}>
//                   ({selectedItem.isTransferredToMe ? 'Transferred to Me' : 'My Added'})
//                 </span>
//               )}
//             </p>
//             <div className="space-y-3 max-h-80 overflow-y-auto">
//               {telecallersList.map(tc => (
//                 <div key={tc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
//                   <div className="flex items-center gap-3">
//                     <div className="bg-[#15BBB3] text-white p-2 rounded-full"><UserCircle size={28} /></div>
//                     <div>
//                       <p className="font-semibold">{tc.name}</p>
//                       <p className="text-xs text-gray-500">Telecaller</p>
//                     </div>
//                   </div>
//                   <button onClick={() => handleTransfer(tc)} className="bg-[#15BBB3] hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
//                     Transfer
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransferDoctor;


















































// import React, { useState, useEffect } from "react";
// import { Share2, UserCircle, X, Users, MapPin, Stethoscope, IdCard, ArrowRightCircle } from "lucide-react";
// import apiClient from '../../services/apiClient';
// import { toast } from 'react-toastify';

// const TransferDoctor = () => {
//   const [activeTab, setActiveTab] = useState("my-calls");

//   const [taskCalls, setTaskCalls] = useState([]);
//   const [myAddedDoctors, setMyAddedDoctors] = useState([]);
//   const [transferredDoctors, setTransferredDoctors] = useState([]);
//   const [assignedTasks, setAssignedTasks] = useState([]);

//   const [combinedData, setCombinedData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [telecallersList, setTelecallersList] = useState([]);

//   // Fetch functions
//   const fetchMyTaskCalls = async () => {
//     try {
//       const res = await apiClient.get('/tasks/telecallertask/my-calls');
//       if (res.data.success) setTaskCalls(res.data.data || []);
//     } catch (err) {
//       toast.error("Failed to load your task calls");
//     }
//   };

//   const fetchMyAddedDoctors = async () => {
//     try {
//       const res = await apiClient.get('/doctors/my-doctors');
//       if (res.data.success) {
//         const onlyMyAdded = (res.data.data || []).filter(doc => !doc.isTransferredToMe);
//         setMyAddedDoctors(onlyMyAdded);
//       }
//     } catch (err) {
//       toast.error("Failed to load your added doctors");
//     }
//   };

//   const fetchTransferredDoctors = async () => {
//     try {
//       const res = await apiClient.get('/doctors/my-doctors');
//       if (res.data.success) {
//         const onlyTransferred = (res.data.data || []).filter(doc => doc.isTransferredToMe);
//         setTransferredDoctors(onlyTransferred);
//       }
//     } catch (err) {
//       toast.error("Failed to load transferred doctors");
//     }
//   };

//   const fetchAssignedTasks = async () => {
//     try {
//       const res = await apiClient.get('/tasks/telecallertask/assigned-to-me');
//       if (res.data.success) setAssignedTasks(res.data.data || []);
//     } catch (err) {
//       toast.error("Failed to load assigned tasks");
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     if (activeTab === "my-calls") {
//       Promise.all([fetchMyTaskCalls(), fetchMyAddedDoctors()]).finally(() => setLoading(false));
//     } else {
//       Promise.all([fetchAssignedTasks(), fetchTransferredDoctors()]).finally(() => setLoading(false));
//     }
//   }, [activeTab]);

//   // MERGE DATA - Source perfect rahega
//   useEffect(() => {
//     let merged = [];

//     if (activeTab === "my-calls") {
//       merged = [
//         // Task Calls → Original source preserve
//         ...taskCalls.map(item => ({
//           ...item,
//           itemType: 'task',
//           isTransferredToMe: false,
//           doctorId: item.doctor?._id,
//           taskId: item.taskId, // Important for transfer
//           doctor: item.doctor || { fullName: 'Unknown', hospitalName: 'N/A' },
//         })),
//         // My Added Doctors → Sirf inko "My Added" label
//         ...myAddedDoctors.map(doc => ({
//           ...doc,
//           itemType: 'doctor',
//           isTransferredToMe: false,
//           doctorId: doc._id,
//           doctor: {
//             fullName: doc.fullName || 'Dr. Unknown',
//             hospitalName: doc.hospitalName || 'N/A',
//             city: doc.hospitalAddress?.city || doc.contactDetails?.currentAddress?.city || 'N/A',
//             specialization: Array.isArray(doc.specialization) ? doc.specialization.join(', ') : (doc.specialization || 'General'),
//             membershipId: doc.membershipId || doc.doctorId || '—'
//           },
//           doctorTaskStatus: doc.doctorStatus || 'cold',
//           source: { type: 'my_added', label: 'My Added' },
//           scheduledDate: doc.createdAt || new Date(),
//         }))
//       ];
//     } else {
//       merged = [
//         ...assignedTasks.map(item => ({
//           ...item,
//           itemType: 'task',
//           isTransferredToMe: true,
//           doctorId: item.doctor?._id,
//           taskId: item.taskId,
//           doctor: item.doctor || { fullName: 'Unknown', hospitalName: 'N/A' },
//         })),
//         ...transferredDoctors.map(doc => ({
//           ...doc,
//           itemType: 'doctor',
//           isTransferredToMe: true,
//           doctorId: doc._id,
//           doctor: {
//             fullName: doc.fullName || 'Dr. Unknown',
//             hospitalName: doc.hospitalName || 'N/A',
//             city: doc.hospitalAddress?.city || doc.contactDetails?.currentAddress?.city || 'N/A',
//             specialization: Array.isArray(doc.specialization) ? doc.specialization.join(', ') : (doc.specialization || 'General'),
//             membershipId: doc.membershipId || doc.doctorId || '—'
//           },
//           doctorTaskStatus: doc.doctorStatus || 'cold',
//           source: { type: 'transferred', label: 'Transferred to Me' },
//           scheduledDate: doc.createdAt || new Date(),
//         }))
//       ];
//     }

//     setCombinedData(merged);
//   }, [activeTab, taskCalls, myAddedDoctors, assignedTasks, transferredDoctors]);

//   // Source label & color
//   const getSourceLabel = (source) => {
//     if (!source?.label) return 'Unknown';
//     if (source.label === 'Salesman Added') return 'Data Store';
//     if (source.label === 'Renewal Call') return 'Renewal';
//     if (source.label === 'Service Call') return 'Service Call';
//     return source.label;
//   };

//   const getSourceColor = (row) => {
//     const label = row.source?.label;
//     if (label === 'My Added') return 'bg-purple-100 text-purple-700';
//     if (row.isTransferredToMe) return 'bg-orange-100 text-orange-700';
//     if (label === 'Salesman Added') return 'bg-blue-100 text-blue-700';
//     if (label === 'Renewal Call') return 'bg-indigo-100 text-indigo-700';
//     if (label === 'Service Call') return 'bg-pink-100 text-pink-700';
//     return 'bg-gray-100 text-gray-700';
//   };

//   const fetchTelecallersList = async () => {
//     try {
//       const res = await apiClient.get('/employees/rolefor-telecaller/telecaller');
//       if (res.data.success) {
//         setTelecallersList(res.data.data.map(u => ({
//           id: u._id,
//           userId: u.user,
//           name: u.fullName || "Unknown Telecaller",
//         })));
//       }
//     } catch (err) {
//       toast.error("Failed to load telecallers");
//     }
//   };

//   // FIXED: Sahi ID pass karo
//   const openTransferModal = (row) => {
//     const transferId = row.itemType === 'task' ? (row.taskId || row._id) : (row.doctorId || row.doctor?._id || row._id);

//     setSelectedItem({
//       id: transferId,
//       itemType: row.itemType,
//       doctor: row.doctor || { fullName: 'Unknown' },
//       isTransferredToMe: row.isTransferredToMe || false
//     });

//     fetchTelecallersList();
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedItem(null);
//   };

//   // FIXED: 100% working transfer with correct API
//   const handleTransfer = async (telecaller) => {
//     if (!selectedItem?.id || !telecaller?.userId) {
//       toast.error("Invalid selection");
//       return;
//     }

//     try {
//       if (selectedItem.itemType === 'task') {
//         await apiClient.post(`/tasks/transfer-call/${selectedItem.id}`, {
//           newTelecallerId: telecaller.userId,
//           transferNote: "Transferred from My Calls dashboard"
//         });
//       } else {
//         await apiClient.put(`/doctors/transfer-doctor/${selectedItem.id}`, {
//           newTelecallerId: telecaller.userId,
//           reason: "Transferred from telecaller dashboard"
//         });
//       }

//       toast.success(`Successfully transferred to ${telecaller.name}`);
//       closeModal();

//       // Refresh data
//       if (activeTab === "my-calls") {
//         await Promise.all([fetchMyTaskCalls(), fetchMyAddedDoctors()]);
//       } else {
//         await Promise.all([fetchAssignedTasks(), fetchTransferredDoctors()]);
//       }
//     } catch (err) {
//       console.error("Transfer failed:", err);
//       toast.error(err.response?.data?.message || "Transfer failed. Try again.");
//     }
//   };

//   const getStatusBadge = (status) => {
//     const map = {
//       completed: "bg-green-100 text-green-700",
//       in_progress: "bg-yellow-100 text-yellow-700",
//       cold: "bg-red-100 text-red-700",
//       warm: "bg-orange-100 text-orange-700",
//       hot: "bg-pink-100 text-pink-700",
//     };
//     const color = map[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
//     return <span className={`px-2.5 py-0.5 ${color} rounded-full text-xs font-bold`}>{(status || 'cold').toUpperCase()}</span>;
//   };

//   if (loading) return (
//     <div className="p-10 text-center">
//       <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#15BBB3] mx-auto"></div>
//       <p className="mt-4 text-gray-600">Loading...</p>
//     </div>
//   );

//   return (
//     <div className="p-4 min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-5">
//           <h2 className="text-2xl font-bold text-[#15BBB3]">
//             {activeTab === "my-calls" ? "My Calls & My Doctors" : "Assigned to Me"}
//           </h2>
//           <div className="flex bg-gray-100 rounded-lg p-1">
//             <button onClick={() => setActiveTab("my-calls")} className={`px-5 py-2 rounded-md text-sm font-medium ${activeTab === "my-calls" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
//               My Calls ({combinedData.length})
//             </button>
//             <button onClick={() => setActiveTab("assigned-to-me")} className={`px-5 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${activeTab === "assigned-to-me" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
//               <Users size={14} /> Assigned ({combinedData.length})
//             </button>
//           </div>
//         </div>

//         {activeTab === "assigned-to-me" && combinedData.length > 0 && (
//           <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm flex items-center gap-2">
//             <ArrowRightCircle size={18} />
//             <span>These were transferred/assigned to you</span>
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow overflow-hidden">
//           {combinedData.length === 0 ? (
//             <div className="p-12 text-center text-gray-400">
//               <Users size={48} className="mx-auto mb-3 opacity-50" />
//               <p>No data found</p>
//             </div>
//           ) : (
//             <table className="w-full text-xs">
//               <thead className="bg-[#15BBB3] text-white">
//                 <tr>
//                   <th className="px-3 py-2.5 text-left font-bold">Date</th>
//                   <th className="px-3 py-2.5 text-left font-bold">DR Name</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Hospital</th>
//                   <th className="px-3 py-2.5 text-left font-bold">City</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Speciality</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Membership ID</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Source</th>
//                   <th className="px-3 py-2.5 text-left font-bold">Status</th>
//                   {activeTab === "my-calls" && <th className="px-3 py-2.5 text-center font-bold">Action</th>}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {combinedData.map((row, i) => (
//                   <tr key={row.taskId || row.doctorId || row._id || i} className="hover:bg-gray-50">
//                     <td className="px-3 py-3 font-medium text-gray-700">
//                       {new Date(row.scheduledDate || row.createdAt || new Date()).toLocaleDateString('en-GB')}
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex flex-col">
//                         <span className="font-bold text-gray-900">
//                           Dr. {row.doctor?.fullName || 'Unknown'}
//                         </span>
//                         {row.itemType === 'doctor' && (
//                           <span className={`text-xs px-2 py-0.5 rounded-full mt-1 w-fit ${row.isTransferredToMe ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
//                             {row.isTransferredToMe ? 'Transferred to Me' : 'My Added'}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3 text-gray-700">{row.doctor?.hospitalName || '-'}</td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1 text-gray-600">
//                         <MapPin size={13} /> {row.doctor?.city || 'N/A'}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1 text-gray-600">
//                         <Stethoscope size={13} /> {row.doctor?.specialization || 'General'}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="flex items-center gap-1">
//                         <IdCard size={13} className="text-blue-600" />
//                         <span className="font-mono text-blue-700 font-bold">
//                           {row.doctor?.membershipId || '—'}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getSourceColor(row)}`}>
//                         {getSourceLabel(row.source)}
//                       </span>
//                     </td>
//                     <td className="px-3 py-3">
//                       {getStatusBadge(row.doctorTaskStatus || row.doctorStatus)}
//                     </td>
//                     {activeTab === "my-calls" && (
//                       <td className="px-3 py-3 text-center">
//                         <button
//                           onClick={() => openTransferModal(row)}
//                           className="bg-[#15BBB3] hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 mx-auto shadow transition"
//                         >
//                           <Share2 size={14} /> Transfer
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* Transfer Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-[#15BBB3]">Transfer Doctor</h3>
//               <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
//             </div>
//             <p className="text-gray-600 mb-5">
//               Select telecaller for: <strong>Dr. {selectedItem?.doctor?.fullName || 'Unknown'}</strong>
//               <span className="text-xs ml-2 text-gray-500">
//                 ({selectedItem?.itemType === 'task' ? 'Task Call' : 'My Doctor'})
//               </span>
//             </p>
//             <div className="space-y-3 max-h-80 overflow-y-auto">
//               {telecallersList.length === 0 ? (
//                 <p className="text-center text-gray-500 py-8">No telecallers available</p>
//               ) : (
//                 telecallersList.map(tc => (
//                   <div key={tc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
//                     <div className="flex items-center gap-3">
//                       <div className="bg-[#15BBB3] text-white p-2 rounded-full"><UserCircle size={28} /></div>
//                       <div>
//                         <p className="font-semibold">{tc.name}</p>
//                         <p className="text-xs text-gray-500">Telecaller</p>
//                       </div>
//                     </div>
//                     <button onClick={() => handleTransfer(tc)} className="bg-[#15BBB3] hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
//                       Transfer
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransferDoctor;






















import React, { useState, useEffect } from "react";
import { Share2, UserCircle, X, Users, MapPin, Stethoscope, IdCard, ArrowRightCircle, History } from "lucide-react";
import apiClient from '../../services/apiClient';
import { toast } from 'react-toastify';

const TransferDoctor = () => {
  const [activeTab, setActiveTab] = useState("my-calls");

  const [taskCalls, setTaskCalls] = useState([]);
  const [myAddedDoctors, setMyAddedDoctors] = useState([]);
  const [transferredDoctors, setTransferredDoctors] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]); // New state for transfer history

  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [telecallersList, setTelecallersList] = useState([]);

  // Fetch functions
  const fetchMyTaskCalls = async () => {
    try {
      const res = await apiClient.get('/tasks/telecallertask/my-calls');
      if (res.data.success) setTaskCalls(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load your task calls");
    }
  };

  const fetchMyAddedDoctors = async () => {
    try {
      const res = await apiClient.get('/doctors/my-doctors');
      if (res.data.success) {
        const onlyMyAdded = (res.data.data || []).filter(doc => !doc.isTransferredToMe);
        setMyAddedDoctors(onlyMyAdded);
      }
    } catch (err) {
      toast.error("Failed to load your added doctors");
    }
  };

  const fetchTransferredDoctors = async () => {
    try {
      const res = await apiClient.get('/doctors/my-doctors');
      if (res.data.success) {
        const onlyTransferred = (res.data.data || []).filter(doc => doc.isTransferredToMe);
        setTransferredDoctors(onlyTransferred);
      }
    } catch (err) {
      toast.error("Failed to load transferred doctors");
    }
  };

  const fetchAssignedTasks = async () => {
    try {
      const res = await apiClient.get('/tasks/telecallertask/assigned-to-me');
      if (res.data.success) setAssignedTasks(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load assigned tasks");
    }
  };

  // Fetch transfer history
  const fetchTransferHistory = async () => {
    try {
      const res = await apiClient.get('/tasks/transfer-history');
      if (res.data.success) {
        setTransferHistory(res.data.data || []);
      } else {
        setTransferHistory([]);
        toast.error(res.data.message || "Failed to load transfer history");
      }
    } catch (err) {
      console.error("Failed to load transfer history:", err);
      setTransferHistory([]);
      toast.error(err.response?.data?.message || "Failed to load transfer history");
    }
  };

  useEffect(() => {
    setLoading(true);
    if (activeTab === "my-calls") {
      Promise.all([fetchMyTaskCalls(), fetchMyAddedDoctors()]).finally(() => setLoading(false));
    } else if (activeTab === "assigned-to-me") {
      Promise.all([fetchAssignedTasks(), fetchTransferredDoctors()]).finally(() => setLoading(false));
    } else if (activeTab === "transfer-history") {
      fetchTransferHistory();
      setLoading(false);
    }
  }, [activeTab]);

  // MERGE DATA - callEntryId preserve kar rahe hain
  useEffect(() => {
    let merged = [];

    if (activeTab === "my-calls") {
      merged = [
        // TASK CALLS → callEntryId preserve karo!
        ...taskCalls.map(item => ({
          ...item,
          itemType: 'task',
          isTransferredToMe: false,
          callEntryId: item.callEntryId,  // YE ZAROORI HAI!
          doctorId: item.doctor?._id,
          doctor: item.doctor || { fullName: 'Unknown', hospitalName: 'N/A' },
        })),
        // MY ADDED DOCTORS
        ...myAddedDoctors.map(doc => ({
          ...doc,
          itemType: 'doctor',
          isTransferredToMe: false,
          doctorId: doc._id,
          doctor: {
            fullName: doc.fullName || 'Dr. Unknown',
            hospitalName: doc.hospitalName || 'N/A',
            city: doc.hospitalAddress?.city || doc.contactDetails?.currentAddress?.city || 'N/A',
            specialization: Array.isArray(doc.specialization) ? doc.specialization.join(', ') : (doc.specialization || 'General'),
            membershipId: doc.membershipId || doc.doctorId || '—'
          },
          doctorTaskStatus: doc.doctorStatus || 'cold',
          source: { type: 'my_added', label: 'My Added' },
          scheduledDate: doc.createdAt || new Date(),
        }))
      ];
    } else if (activeTab === "assigned-to-me") {
      merged = [
        ...assignedTasks.map(item => ({
          ...item,
          itemType: 'task',
          isTransferredToMe: true,
          callEntryId: item.callEntryId,  // Yahan bhi preserve
          doctorId: item.doctor?._id,
          doctor: item.doctor || { fullName: 'Unknown', hospitalName: 'N/A' },
        })),
        ...transferredDoctors.map(doc => ({
          ...doc,
          itemType: 'doctor',
          isTransferredToMe: true,
          doctorId: doc._id,
          doctor: {
            fullName: doc.fullName || 'Dr. Unknown',
            hospitalName: doc.hospitalName || 'N/A',
            city: doc.hospitalAddress?.city || doc.contactDetails?.currentAddress?.city || 'N/A',
            specialization: Array.isArray(doc.specialization) ? doc.specialization.join(', ') : (doc.specialization || 'General'),
            membershipId: doc.membershipId || doc.doctorId || '—'
          },
          doctorTaskStatus: doc.doctorStatus || 'cold',
          source: { type: 'transferred', label: 'Transferred to Me' },
          scheduledDate: doc.createdAt || new Date(),
        }))
      ];
    }

    setCombinedData(merged);
  }, [activeTab, taskCalls, myAddedDoctors, assignedTasks, transferredDoctors]);

  // Source label & color
  const getSourceLabel = (source) => {
    if (!source?.label) return 'Unknown';
    if (source.label === 'Salesman Added') return 'Data Store';
    if (source.label === 'Renewal Call') return 'Renewal';
    if (source.label === 'Service Call') return 'Service Call';
    return source.label;
  };

  const getSourceColor = (row) => {
    const label = row.source?.label;
    if (label === 'My Added') return 'bg-purple-100 text-purple-700';
    if (row.isTransferredToMe) return 'bg-orange-100 text-orange-700';
    if (label === 'Salesman Added') return 'bg-blue-100 text-blue-700';
    if (label === 'Renewal Call') return 'bg-indigo-100 text-indigo-700';
    if (label === 'Service Call') return 'bg-pink-100 text-pink-700';
    return 'bg-gray-100 text-gray-700';
  };

  const fetchTelecallersList = async () => {
    try {
      const res = await apiClient.get('/employees/rolefor-telecaller/telecaller');
      if (res.data.success) {
        setTelecallersList(res.data.data.map(u => ({
          id: u._id,
          userId: u.user,
          name: u.fullName || "Unknown Telecaller",
        })));
      }
    } catch (err) {
      toast.error("Failed to load telecallers");
    }
  };

  // FIXED: callEntryId bhej raha hai task ke liye
  const openTransferModal = (row) => {
    let transferId;

    if (row.itemType === 'task') {
      transferId = row.callEntryId;  // YE HI BHEJNA HAI!
    } else {
      transferId = row.doctorId || row.doctor?._id || row._id;
    }

    if (!transferId) {
      toast.error("Invalid ID for transfer");
      return;
    }

    setSelectedItem({
      id: transferId,
      itemType: row.itemType,
      doctor: row.doctor || { fullName: 'Unknown' },
      isTransferredToMe: row.isTransferredToMe || false
    });

    fetchTelecallersList();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  // PERFECT TRANSFER LOGIC
  const handleTransfer = async (telecaller) => {
    if (!selectedItem?.id || !telecaller?.userId) {
      toast.error("Invalid selection");
      return;
    }

    try {
      if (selectedItem.itemType === 'task') {
        // callEntryId bhej rahe hain → bilkul sahi
        await apiClient.post(`/tasks/transfer-call/${selectedItem.id}`, {
          newTelecallerId: telecaller.userId,
          transferNote: "Transferred from My Calls dashboard"
        });
      } else {
        await apiClient.put(`/doctors/transfer-doctor/${selectedItem.id}`, {
          newTelecallerId: telecaller.userId,
          reason: "Transferred from telecaller dashboard"
        });
      }

      toast.success(`Transferred to ${telecaller.name}`);
      closeModal();

      // Refresh data
      if (activeTab === "my-calls") {
        await Promise.all([fetchMyTaskCalls(), fetchMyAddedDoctors()]);
      } else {
        await Promise.all([fetchAssignedTasks(), fetchTransferredDoctors()]);
      }

      // Refresh transfer history if on that tab
      if (activeTab === "transfer-history") {
        fetchTransferHistory();
      }
    } catch (err) {
      console.error("Transfer error:", err);
      toast.error(err.response?.data?.message || "Transfer failed");
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      completed: "bg-green-100 text-green-700",
      in_progress: "bg-yellow-100 text-yellow-700",
      cold: "bg-red-100 text-red-700",
      warm: "bg-orange-100 text-orange-700",
      hot: "bg-pink-100 text-pink-700",
    };
    const color = map[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
    return <span className={`px-2.5 py-0.5 ${color} rounded-full text-xs font-bold`}>{(status || 'cold').toUpperCase()}</span>;
  };

  if (loading) return (
    <div className="p-10 text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#15BBB3] mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  );

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-[#15BBB3]">
            {activeTab === "my-calls" ? "My Calls & My Doctors" :
             activeTab === "assigned-to-me" ? "Assigned to Me" :
             "Transfer History"}
          </h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setActiveTab("my-calls")} className={`px-5 py-2 rounded-md text-sm font-medium ${activeTab === "my-calls" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
              My Calls ({combinedData.length})
            </button>
            <button onClick={() => setActiveTab("assigned-to-me")} className={`px-5 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${activeTab === "assigned-to-me" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
              <Users size={14} /> Assigned ({combinedData.length})
            </button>
            <button onClick={() => setActiveTab("transfer-history")} className={`px-5 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${activeTab === "transfer-history" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
              <History size={14} /> History ({transferHistory.length})
            </button>
          </div>
        </div>

        {activeTab === "my-calls" && (
          <>
            {combinedData.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm flex items-center gap-2">
                <Share2 size={18} />
                <span>These are your calls and doctors</span>
              </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
              {combinedData.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <Users size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No data found</p>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-[#15BBB3] text-white">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-bold">Date</th>
                      <th className="px-3 py-2.5 text-left font-bold">DR Name</th>
                      <th className="px-3 py-2.5 text-left font-bold">Hospital</th>
                      <th className="px-3 py-2.5 text-left font-bold">City</th>
                      <th className="px-3 py-2.5 text-left font-bold">Speciality</th>
                      <th className="px-3 py-2.5 text-left font-bold">Membership ID</th>
                      <th className="px-3 py-2.5 text-left font-bold">Source</th>
                      <th className="px-3 py-2.5 text-left font-bold">Status</th>
                      <th className="px-3 py-2.5 text-center font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {combinedData.map((row, i) => (
                      <tr key={row.callEntryId || row.doctorId || row._id || i} className="hover:bg-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-700">
                          {new Date(row.scheduledDate || row.createdAt || new Date()).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">
                              Dr. {row.doctor?.fullName || 'Unknown'}
                            </span>
                            {row.itemType === 'doctor' && (
                              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 w-fit ${row.isTransferredToMe ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                {row.isTransferredToMe ? 'Transferred to Me' : 'My Added'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-gray-700">{row.doctor?.hospitalName || '-'}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin size={13} /> {row.doctor?.city || 'N/A'}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Stethoscope size={13} /> {row.doctor?.specialization || 'General'}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <IdCard size={13} className="text-blue-600" />
                            <span className="font-mono text-blue-700 font-bold">
                              {row.doctor?.membershipId || '—'}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getSourceColor(row)}`}>
                            {getSourceLabel(row.source)}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {getStatusBadge(row.doctorTaskStatus || row.doctorStatus)}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => openTransferModal(row)}
                            className="bg-[#15BBB3] hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 mx-auto shadow transition"
                          >
                            <Share2 size={14} /> Transfer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeTab === "assigned-to-me" && (
          <>
            {combinedData.length > 0 && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm flex items-center gap-2">
                <ArrowRightCircle size={18} />
                <span>These were transferred/assigned to you</span>
              </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
              {combinedData.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <Users size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No data found</p>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-[#15BBB3] text-white">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-bold">Date</th>
                      <th className="px-3 py-2.5 text-left font-bold">DR Name</th>
                      <th className="px-3 py-2.5 text-left font-bold">Hospital</th>
                      <th className="px-3 py-2.5 text-left font-bold">City</th>
                      <th className="px-3 py-2.5 text-left font-bold">Speciality</th>
                      <th className="px-3 py-2.5 text-left font-bold">Membership ID</th>
                      <th className="px-3 py-2.5 text-left font-bold">Source</th>
                      <th className="px-3 py-2.5 text-left font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {combinedData.map((row, i) => (
                      <tr key={row.callEntryId || row.doctorId || row._id || i} className="hover:bg-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-700">
                          {new Date(row.scheduledDate || row.createdAt || new Date()).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">
                              Dr. {row.doctor?.fullName || 'Unknown'}
                            </span>
                            {row.itemType === 'doctor' && (
                              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 w-fit ${row.isTransferredToMe ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                {row.isTransferredToMe ? 'Transferred to Me' : 'My Added'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-gray-700">{row.doctor?.hospitalName || '-'}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin size={13} /> {row.doctor?.city || 'N/A'}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Stethoscope size={13} /> {row.doctor?.specialization || 'General'}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <IdCard size={13} className="text-blue-600" />
                            <span className="font-mono text-blue-700 font-bold">
                              {row.doctor?.membershipId || '—'}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getSourceColor(row)}`}>
                            {getSourceLabel(row.source)}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {getStatusBadge(row.doctorTaskStatus || row.doctorStatus)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeTab === "transfer-history" && (
          <>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm flex items-center gap-2">
              <History size={18} />
              <span>Track who transferred doctors to whom</span>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
              {transferHistory.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <History size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No transfer history found</p>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-[#15BBB3] text-white">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-bold">Date</th>
                      <th className="px-3 py-2.5 text-left font-bold">Doctor</th>
                      <th className="px-3 py-2.5 text-left font-bold">From</th>
                      <th className="px-3 py-2.5 text-left font-bold">To</th>
                      <th className="px-3 py-2.5 text-left font-bold">Reason</th>
                      <th className="px-3 py-2.5 text-left font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transferHistory.map((transfer, i) => (
                      <tr key={transfer._id || i} className="hover:bg-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-700">
                          {new Date(transfer.transferDate || transfer.createdAt || new Date()).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-bold text-gray-900">
                            Dr. {transfer.doctorName || transfer.doctor?.fullName || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-gray-700">
                          {transfer.fromTelecallerName || transfer.fromUser?.name || 'Unknown'}
                        </td>
                        <td className="px-3 py-3 text-gray-700">
                          {transfer.toTelecallerName || transfer.toUser?.name || 'Unknown'}
                        </td>
                        <td className="px-3 py-3 text-gray-700">
                          {transfer.reason || transfer.transferNote || 'N/A'}
                        </td>
                        <td className="px-3 py-3">
                          <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

      {/* Transfer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#15BBB3]">Transfer Doctor</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <p className="text-gray-600 mb-5">
              Select telecaller for: <strong>Dr. {selectedItem?.doctor?.fullName || 'Unknown'}</strong>
              <span className="text-xs ml-2 text-gray-500">
                ({selectedItem?.itemType === 'task' ? 'Task Call' : 'My Doctor'})
              </span>
            </p>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {telecallersList.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No telecallers available</p>
              ) : (
                telecallersList.map(tc => (
                  <div key={tc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#15BBB3] text-white p-2 rounded-full"><UserCircle size={28} /></div>
                      <div>
                        <p className="font-semibold">{tc.name}</p>
                        <p className="text-xs text-gray-500">Telecaller</p>
                      </div>
                    </div>
                    <button onClick={() => handleTransfer(tc)} className="bg-[#15BBB3] hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
                      Transfer
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferDoctor;