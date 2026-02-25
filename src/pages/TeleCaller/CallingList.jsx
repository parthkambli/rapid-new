// import React, { useState, useEffect } from 'react';
// import Table from '../../components/mainComponents/Table';
// import apiClient, { apiEndpoints } from '../../services/apiClient';
// import { toast } from 'react-toastify';

// const CallingList = () => {
//   const [sortByStatus, setSortByStatus] = useState('all');
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchCallingListData();
//   }, []);

//   const fetchCallingListData = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get(apiEndpoints.tasks.getCallingList); // Get assigned doctors

//       if (response.data.success) {
//         const doctors = response.data.data;
//         const callingListData = doctors.map(doctor => ({
//           id: doctor._id,
//           drName: doctor.name || doctor.fullName || doctor.doctorName || "N/A",
//           hospitalName: doctor.hospitalName || "N/A",
//           contact: doctor.mobile || doctor.phone || "N/A",
//           typeOfEnquiries: doctor.enquiryType || doctor.leadType || "Warm", // Assuming these fields exist
//           status: doctor.status || doctor.followupStatus || "Pending", // Use appropriate status field
//         }));
//         setData(callingListData);
//       } else {
//         toast.error("Failed to load calling list data");
//       }
//     } catch (error) {
//       console.error("Error fetching calling list:", error);
//       setError("Failed to load calling list data");
//       toast.error("Failed to load calling list data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = (e) => {
//     setSortByStatus(e.target.value);
//   };

//   const filteredData = sortByStatus === 'all'
//     ? data
//     : data.filter(item => item.status === sortByStatus);

//   if (loading) {
//     return (
//       <div className="w-full p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading calling list...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full p-6">
//         <h2 className="text-2xl font-semibold mb-4">Calling List</h2>
//         <div className="text-red-500 text-center p-4 bg-red-50 rounded">
//           {error}
//           <button
//             onClick={fetchCallingListData}
//             className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full p-6">
//       <h2 className="text-2xl font-semibold mb-4">Calling List</h2>
//       {/* Top Right Sort by Status Dropdown */}
//       <div className="flex justify-end mb-6 mt-4">
//         <select
//           value={sortByStatus}
//           onChange={handleStatusChange}
//           className="p-2 border border-[#15BBB3] rounded-lg text-sm text-[#000] font-bold bg-[#D0D5D4] px-14"
//         >
//           <option value="all">Sort by Status</option>
//           <option value="all">All</option>
//           <option value="Pending">Pending</option>
//           <option value="Completed">Completed</option>
//           <option value="In Progress">In Progress</option>
//         </select>
//       </div>
//       <Table data={filteredData} />
//     </div>
//   );
// };

// export default CallingList;



































// import React, { useState, useEffect } from 'react';
// import Table from '../../components/mainComponents/Table';
// import apiClient from '../../services/apiClient'; // apiEndpoints ki zarurat nahi ab
// import { toast } from 'react-toastify';

// const CallingList = () => {
//   const [sortByStatus, setSortByStatus] = useState('all');
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchCallingListData();
//   }, []);

//   const fetchCallingListData = async () => {
//     try {
//       setLoading(true);

//       // TERA NUCLEAR API — JO TU CHALA RAHA HAI
//       const response = await apiClient.get('/tasks/telecallertask');

//       if (response.data.success && response.data.data.length > 0) {
//         const doctorsWithSource = response.data.data; // [{ doctor: {...}, source: {...} }]

//         const callingListData = doctorsWithSource.map(item => {
//           const doc = item.doctor;
//           const src = item.source;

//           return {
//             id: doc._id,
//             drName: doc.fullName?.trim() || doc.hospitalName?.trim() || "N/A",
//             hospitalName: doc.hospitalName || "N/A",
//             contact: doc.phoneNumber || doc.whatsappNumber || doc.contactDetails?.phoneNumber || "N/A",

//             // YE TERA TYPE OF ENQUIRY FIELD — AB SOURCE DIKHEGA
//             typeOfEnquiries: src.label || src.type || "Unknown",

//             // Status doctor ke hisaab se
//             status:
//               doc.doctorStatus === 'close' ? 'Completed' :
//               doc.doctorStatus === 'hot' || doc.doctorStatus === 'warm' ? 'In Progress' :
//               'Pending'
//           };
//         });

//         setData(callingListData);
//         toast.success(`Loaded ${callingListData.length} doctors!`);
//       } else {
//         setData([]);
//         toast.info("No doctors found in call tasks");
//       }
//     } catch (error) {
//       console.error("Error fetching calling list:", error);
//       setError("Failed to load calling list data");
//       toast.error("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = (e) => {
//     setSortByStatus(e.target.value);
//   };

//   const filteredData = sortByStatus === 'all'
//     ? data
//     : data.filter(item => item.status === sortByStatus);

//   if (loading) {
//     return (
//       <div className="w-full p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading calling list...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full p-6">
//         <h2 className="text-2xl font-semibold mb-4">Calling List</h2>
//         <div className="text-red-500 text-center p-4 bg-red-50 rounded">
//           {error}
//           <button
//             onClick={fetchCallingListData}
//             className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full p-6">
//       <h2 className="text-2xl font-semibold mb-4">Calling List</h2>

//       {/* TERA PURANA DROPDOWN — WAISA KA WAISA */}
//       <div className="flex justify-end mb-6 mt-4">
//         <select
//           value={sortByStatus}
//           onChange={handleStatusChange}
//           className="p-2 border border-[#15BBB3] rounded-lg text-sm text-[#000] font-bold bg-[#D0D5D4] px-14"
//         >
//           <option value="all">Sort by Status</option>
//           <option value="all">All</option>
//           <option value="Pending">Pending</option>
//           <option value="Completed">Completed</option>
//           <option value="In Progress">In Progress</option>
//         </select>
//       </div>

//       {/* TERA PURANA TABLE — KOI CHANGE NHI */}
//       <Table data={filteredData} />
//     </div>
//   );
// };

// export default CallingList;



































// import React, { useState, useEffect } from 'react';
// import apiClient from '../../services/apiClient';
// import { toast } from 'react-toastify';
// import { Download, Printer } from 'lucide-react';

// const CallingList = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortByEnquiry, setSortByEnquiry] = useState('all');
//   const [sortByStatus, setSortByStatus] = useState('all');

//   useEffect(() => {
//     fetchCallingListData();
//   }, []);

//   const fetchCallingListData = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get('/tasks/telecallertask');

//       if (response.data.success && response.data.data.length > 0) {
//         const rawData = response.data.data;

//         const formattedData = rawData.map((item, index) => {
//           const doc = item.doctor;
//           const src = item.source;

//           // Source ke hisaab se color & text
//           let enquiryType = src.label || 'Unknown';
//           let enquiryColor = 'bg-gray-100 text-gray-800';

//           if (src.type === 'salesman_added') {
//             enquiryType = 'Data Store';
//             enquiryColor = 'bg-orange-100 text-orange-800';
//           } else if (src.type === 'renewal_call') {
//             enquiryType = 'Renewal';
//             enquiryColor = 'bg-blue-100 text-blue-800';
//           } else if (src.type === 'service_call_close') {
//             enquiryType = 'Service Call';
//             enquiryColor = 'bg-purple-100 text-purple-800';
//           }

//           const status = doc.doctorStatus === 'close' ? 'Completed' :
//                         doc.doctorStatus === 'hot' || doc.doctorStatus === 'warm' ? 'In Progress' : 'Pending';

//           return {
//             srNo: index + 1,
//             doctorName: doc.fullName?.trim() || doc.hospitalName?.trim() || 'N/A',
//             hospitalName: doc.hospitalName || 'N/A',
//             contact: doc.phoneNumber || doc.whatsappNumber || 'N/A',
//             typeOfEnquiry: (
//               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${enquiryColor}`}>
//                 {enquiryType}
//               </span>
//             ),
//             followUpDate: doc.performanceMetrics?.nextFollowUpDate
//               ? new Date(doc.performanceMetrics.nextFollowUpDate).toLocaleDateString('en-GB')
//               : new Date().toLocaleDateString('en-GB'),
//             status: status,
//             statusColor: status === 'Completed' ? 'text-green-600' :
//                         status === 'In Progress' ? 'text-yellow-600' : 'text-red-600'
//           };
//         });

//         setData(formattedData);
//         toast.success(`Loaded ${formattedData.length} doctors!`);
//       } else {
//         setData([]);
//         toast.info("No doctors found");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filtering
//   const filteredData = data
//     .filter(item => sortByEnquiry === 'all' ||
//       (sortByEnquiry === 'New Membership' && item.typeOfEnquiry.props.children === 'New Membership') ||
//       (sortByEnquiry === 'Renewal' && item.typeOfEnquiry.props.children === 'Renewal') ||
//       (sortByEnquiry === 'Policy Enquiry' && item.typeOfEnquiry.props.children === 'Policy Enquiry')
//     )
//     .filter(item => sortByStatus === 'all' || item.status === sortByStatus);

//   if (loading) {
//     return (
//       <div className="p-10 text-center">
//         <div className="animate-spin inline-block w-12 h-12 border-4 border-[#15BBB3] border-t-transparent rounded-full"></div>
//         <p className="mt-4 text-gray-600">Loading Calling List...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-800">Calling List</h1>
//           <div className="flex items-center gap-4">
//             {/* Sort by Enquiry */}
//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium text-gray-700">Sort by Enquiry</label>
//               <select
//                 value={sortByEnquiry}
//                 onChange={(e) => setSortByEnquiry(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#15BBB3]"
//               >
//                 <option value="all">All</option>
//                 <option value="New Membership">New Membership</option>
//                 <option value="Renewal">Renewal</option>
//                 <option value="Policy Enquiry">Policy Enquiry</option>
//               </select>
//             </div>

//             {/* Sort by Status */}
//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium text-gray-700">Sort by Status</label>
//               <select
//                 value={sortByStatus}
//                 onChange={(e) => setSortByStatus(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#15BBB3]"
//               >
//                 <option value="all">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>

//             {/* Buttons */}
//             <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
//               <Download size={18} />
//               Export to Excel
//             </button>
//             <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition">
//               <Printer size={18} />
//               Print
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="p-6">
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-[#15BBB3] text-white">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">SR.NO</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">DOCTOR NAME</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">HOSPITAL NAME</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">CONTACT</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">TYPE OF ENQUIRY</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">FOLLOW-UP DATE</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">STATUS</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
//                     No doctors found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((row) => (
//                   <tr key={row.srNo} className="hover:bg-gray-50">
//                     <td className="px-4 py-4 text-sm text-gray-900">{row.srNo}</td>
//                     <td className="px-4 py-4 text-sm font-medium text-gray-900">{row.doctorName}</td>
//                     <td className="px-4 py-4 text-sm text-gray-600">{row.hospitalName}</td>
//                     <td className="px-4 py-4 text-sm text-gray-600">{row.contact}</td>
//                     <td className="px-4 py-4 text-sm">{row.typeOfEnquiry}</td>
//                     <td className="px-4 py-4 text-sm text-gray-600">{row.followUpDate}</td>
//                     <td className="px-4 py-4 text-sm">
//                       <span className={`font-semibold ${row.statusColor}`}>
//                         {row.status}
//                       </span>
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

// export default CallingList;































// import React, { useState, useEffect } from 'react';
// import apiClient from '../../services/apiClient';
// import { toast } from 'react-toastify';
// import { Download, Printer, CheckCircle } from 'lucide-react';

// const CallingList = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortByEnquiry, setSortByEnquiry] = useState('all');
//   const [sortByStatus, setSortByStatus] = useState('all');

//   useEffect(() => {
//     fetchCallingListData();
//   }, []);

//   const fetchCallingListData = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get('/tasks/telecallertask');

//       if (response.data.success && response.data.data.length > 0) {
//         const rawData = response.data.data;

//         const formattedData = rawData.map((item, index) => {
//           const doc = item.doctor;
//           const src = item.source;
//           const taskId = item.taskId;
//           const doctorTaskStatus = item.doctorTaskStatus; // YE NAYA HAI

//           let enquiryType = src.label || 'Unknown';
//           let enquiryColor = 'bg-gray-100 text-gray-800';

//           if (src.type === 'salesman_added') {
//             enquiryType = 'Data Store';
//             enquiryColor = 'bg-orange-100 text-orange-800';
//           } else if (src.type === 'renewal_call') {
//             enquiryType = 'Renewal';
//             enquiryColor = 'bg-blue-100 text-blue-800';
//           } else if (src.type === 'service_call_close') {
//             enquiryType = 'Service Call';
//             enquiryColor = 'bg-purple-100 text-purple-800';
//           }

//           const status = doctorTaskStatus === 'completed' ? 'Completed' :
//                         doctorTaskStatus === 'in_progress' ? 'In Progress' : 'Pending';

//           const statusColor = doctorTaskStatus === 'completed' ? 'text-green-600' :
//                              doctorTaskStatus === 'in_progress' ? 'text-yellow-600' : 'text-red-600';

//           return {
//             srNo: index + 1,
//             doctorName: doc.fullName?.trim() || doc.hospitalName?.trim() || 'N/A',
//             hospitalName: doc.hospitalName || 'N/A',
//             contact: doc.phoneNumber || doc.whatsappNumber || 'N/A',
//             isTransferred: item.isTransferred || false,   // ← YE ZAROORI HAI!
//             typeOfEnquiry: (
//               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${enquiryColor}`}>
//                 {enquiryType}
//               </span>
//             ),
//             followUpDate: doc.performanceMetrics?.nextFollowUpDate
//               ? new Date(doc.performanceMetrics.nextFollowUpDate).toLocaleDateString('en-GB')
//               : new Date().toLocaleDateString('en-GB'),
//             status,
//             statusColor,
//             taskId,
//             doctorId: doc._id,
//             isCompleted: doctorTaskStatus === 'completed'
//           };
//         });

//         setData(formattedData);
//         toast.success(`Loaded ${formattedData.length} doctors!`);
//       } else {
//         setData([]);
//         toast.info("No doctors found");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkComplete = async (taskId, doctorId) => {
//     if (!window.confirm("Are you sure this call is completed?")) return;

//     try {
//       await apiClient.patch(`/tasks/${taskId}/mark-doctor-complete`, {
//         doctorId: doctorId,
//         notes: "Call completed successfully"
//       });

//       toast.success("Call marked as completed!");
//       fetchCallingListData(); // Refresh list
//     } catch (err) {
//       toast.error("Failed to update status");
//     }
//   };

//   const filteredData = data
//     .filter(item => sortByEnquiry === 'all' ||
//       item.typeOfEnquiry.props.children === sortByEnquiry)
//     .filter(item => sortByStatus === 'all' || item.status === sortByStatus);

//   if (loading) {
//     return (
//       <div className="p-10 text-center">
//         <div className="animate-spin inline-block w-12 h-12 border-4 border-[#15BBB3] border-t-transparent rounded-full"></div>
//         <p className="mt-4 text-gray-600">Loading Calling List...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-gray-50 min-h-screen">
//       <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-800">Calling List</h1>
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium text-gray-700">Sort by Enquiry</label>
//               <select value={sortByEnquiry} onChange={(e) => setSortByEnquiry(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#15BBB3]">
//                 <option value="all">All</option>
//                 <option value="Data Store">Data Store</option>
//                 <option value="Renewal">Renewal</option>
//                 <option value="Service Call">Service Call</option>
//               </select>
//             </div>

//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium text-gray-700">Sort by Status</label>
//               <select value={sortByStatus} onChange={(e) => setSortByStatus(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#15BBB3]">
//                 <option value="all">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>

//             <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
//               <Download size={18} /> Export to Excel
//             </button>
//             <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
//               <Printer size={18} /> Print
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-[#15BBB3] text-white">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">SR.NO</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">DOCTOR NAME</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">HOSPITAL NAME</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">CONTACT</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">TYPE OF ENQUIRY</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">FOLLOW-UP DATE</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">STATUS</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">ACTION</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
//                     No doctors found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((row) => (
//                   <tr key={row.srNo} className="hover:bg-gray-50">
//                     <td className="px-4 py-4 text-sm text-gray-900">{row.srNo}</td>
//                     {/* <td className="px-4 py-4 text-sm font-medium text-gray-900">{row.doctorName}</td>
//                      */}
//                      <td className="px-4 py-4 text-sm">
//   <div className="flex flex-col">
//     <span className="font-medium text-gray-900">
//       {row.doctorName || 'N/A'}
//     </span>

//     {/* Transferred Badge */}
//     {row.isTransferred && (
//       <span className="text-xs text-orange-600 font-semibold mt-1 bg-orange-50 px-3 py-1 rounded-full inline-block w-fit border border-orange-200">
//         Transferred Doctor
//       </span>
//     )}
//   </div>
// </td>
//                     <td className="px-4 py-4 text-sm text-gray-600">{row.hospitalName}</td>
//                     <td className="px-4 py-4 text-sm text-gray-600">{row.contact}</td>
//                     <td className="px-4 py-4 text-sm">{row.typeOfEnquiry}</td>
//                     <td className="px-4 py-4 text-sm text-gray-600">{row.followUpDate}</td>
//                     <td className="px-4 py-4 text-sm">
//                       <span className={`font-semibold ${row.statusColor}`}>
//                         {row.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 text-sm">
//                       {row.isCompleted ? (
//                         <span className="text-green-600 flex items-center gap-1">
//                           <CheckCircle size={18} /> Completed
//                         </span>
//                       ) : (
//                         <button
//                           onClick={() => handleMarkComplete(row.taskId, row.doctorId)}
//                           className="px-4 py-2 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition"
//                         >
//                           Mark as Completed
//                         </button>
//                       )}
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

// export default CallingList;

























// import React, { useState, useEffect } from 'react';
// import apiClient from '../../services/apiClient';
// import { toast } from 'react-toastify';
// import { Download, Printer, CheckCircle } from 'lucide-react';

// const CallingList = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortByEnquiry, setSortByEnquiry] = useState('all');
//   const [sortByStatus, setSortByStatus] = useState('all');

//   useEffect(() => {
//     fetchCallingListData();
//   }, []);

//   const fetchCallingListData = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get('/tasks/telecallertask');

//       if (response.data.success && response.data.data.length > 0) {
//         const rawData = response.data.data;

//         const formattedData = rawData.map((item, index) => {
//           const doc = item.doctor || {};
//           const src = item.source || {};
//           const taskId = item.taskId;
//           const doctorTaskStatus = item.doctorTaskStatus || 'pending';

//           // Safely get doctor name
//           const doctorName = doc.fullName?.trim() || doc.hospitalName?.trim() || 'N/A';

//           // Enquiry Type Logic
//           let enquiryType = src.label || 'Unknown';
//           let enquiryColor = 'bg-gray-100 text-gray-800';

//           if (src.type === 'salesman_added') {
//             enquiryType = 'Data Store';
//             enquiryColor = 'bg-orange-100 text-orange-800';
//           } else if (src.type === 'renewal_call') {
//             enquiryType = 'Renewal';
//             enquiryColor = 'bg-blue-100 text-blue-800';
//           } else if (src.type === 'service_call_close') {
//             enquiryType = 'Service Call';
//             enquiryColor = 'bg-purple-100 text-purple-800';
//           }

//           // Status Logic
//           const status = doctorTaskStatus === 'completed' ? 'Completed' :
//                         doctorTaskStatus === 'in_progress' ? 'In Progress' : 'Pending';

//           const statusColor = doctorTaskStatus === 'completed' ? 'text-green-600' :
//                              doctorTaskStatus === 'in_progress' ? 'text-yellow-600' : 'text-red-600';

//           return {
//             srNo: index + 1,
//             doctorName,
//             hospitalName: doc.hospitalName || 'N/A',
//             contact: doc.phoneNumber || doc.whatsappNumber || 'N/A',
//             isTransferred: item.isTransferred || false,
//             typeOfEnquiry: enquiryType,        // ← Ab sirf string hai (JSX nahi)
//             enquiryColor,                      // ← Color alag se pass kiya
//             followUpDate: doc.performanceMetrics?.nextFollowUpDate
//               ? new Date(doc.performanceMetrics.nextFollowUpDate).toLocaleDateString('en-GB')
//               : new Date().toLocaleDateString('en-GB'),
//             status,
//             statusColor,
//             taskId,
//             doctorId: doc._id || null,
//             isCompleted: doctorTaskStatus === 'completed'
//           };
//         });

//         setData(formattedData);
//         toast.success(`Loaded ${formattedData.length} doctors!`);
//       } else {
//         setData([]);
//         toast.info("No doctors found");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkComplete = async (taskId, doctorId) => {
//     if (!doctorId) {
//       toast.error("Doctor ID missing");
//       return;
//     }
//     if (!window.confirm("Are you sure this call is completed?")) return;

//     try {
//       await apiClient.patch(`/tasks/${taskId}/mark-doctor-complete`, {
//         doctorId,
//         notes: "Call completed successfully"
//       });

//       toast.success("Call marked as completed!");
//       fetchCallingListData();
//     } catch (err) {
//       toast.error("Failed to update status");
//     }
//   };

//   // Filtering - Ab perfect kaam karega kyunki typeOfEnquiry string hai
//   const filteredData = data
//     .filter(item => sortByEnquiry === 'all' || item.typeOfEnquiry === sortByEnquiry)
//     .filter(item => sortByStatus === 'all' || item.status === sortByStatus);

//   if (loading) {
//     return (
//       <div className="p-10 text-center">
//         <div className="animate-spin inline-block w-12 h-12 border-4 border-[#15BBB3] border-t-transparent rounded-full"></div>
//         <p className="mt-4 text-gray-600">Loading Calling List...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-gray-50 min-h-screen">
//       <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-800">Calling List</h1>
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium text-gray-700">Sort by Enquiry</label>
//               <select value={sortByEnquiry} onChange={(e) => setSortByEnquiry(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#15BBB3]">
//                 <option value="all">All</option>
//                 <option value="Data Store">Data Store</option>
//                 <option value="Renewal">Renewal</option>
//                 <option value="Service Call">Service Call</option>
//                 <option value="Unknown">Unknown</option>
//               </select>
//             </div>

//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium text-gray-700">Sort by Status</label>
//               <select value={sortByStatus} onChange={(e) => setSortByStatus(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#15BBB3]">
//                 <option value="all">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>

//             <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
//               <Download size={18} /> Export to Excel
//             </button>
//             <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
//               <Printer size={18} /> Print
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-[#15BBB3] text-white">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">SR.NO</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">DOCTOR NAME</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">HOSPITAL NAME</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">CONTACT</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">TYPE OF ENQUIRY</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">FOLLOW-UP DATE</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">STATUS</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">ACTION</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
//                     {data.length === 0 ? "No data available" : "No records match your filter"}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((row) => (
//                   <tr key={row.taskId + row.doctorId} className="hover:bg-gray-50">
//                     <td className="px-4 py-4 text-sm text-gray-900">{row.srNo}</td>
//                     <td className="px-4 py-4 text-sm">
//                       <div className="flex flex-col">
//                         <span className="font-medium text-gray-900">
//                           {row.doctorName}
//                         </span>
//                         {row.isTransferred && (
//                           <span className="text-xs text-orange-600 font-semibold mt-1 bg-orange-50 px-3 py-1 rounded-full inline-block w-fit border border-orange-200">
//                             Transferred Doctor
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-600">{row.hospitalName}</td>
//                     <td className="px-4 py-4 text-sm text-gray-600">{row.contact}</td>
//                     <td className="px-4 py-4 text-sm">
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.enquiryColor}`}>
//                         {row.typeOfEnquiry}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-600">{row.followUpDate}</td>
//                     <td className="px-4 py-4 text-sm">
//                       <span className={`font-semibold ${row.statusColor}`}>
//                         {row.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 text-sm">
//                       {row.isCompleted ? (
//                         <span className="text-green-600 flex items-center gap-1">
//                           <CheckCircle size={18} /> Completed
//                         </span>
//                       ) : (
//                         <button
//                           onClick={() => handleMarkComplete(row.taskId, row.doctorId)}
//                           className="px-4 py-2 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition"
//                         >
//                           Mark as Completed
//                         </button>
//                       )}
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

// export default CallingList;































import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { toast } from 'react-toastify';
import { Download, Printer, CheckCircle, Plus, Eye } from 'lucide-react';

const CallingList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortByEnquiry, setSortByEnquiry] = useState('all');
  const [sortByStatus, setSortByStatus] = useState('all');
  const [searchDoctorName, setSearchDoctorName] = useState('');

  // State for follow-up modal
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showViewFollowUpModal, setShowViewFollowUpModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [reminderDateTime, setReminderDateTime] = useState("");
  const [followUpType, setFollowUpType] = useState("call");

  useEffect(() => {
    fetchCallingListData();
  }, []);


 
  const handleExportExcel = () => {
    // Implement export to Excel functionality here
    // toast.info("Export to Excel feature coming soon!");
    const exportData = data.map(({ srNo, doctorName, hospitalName, contact, typeOfEnquiry, followUpDate, status }) => ({
      "SR.NO": srNo,
      "DOCTOR NAME": doctorName,
      "HOSPITAL NAME": hospitalName,
      "CONTACT": contact,
      "TYPE OF ENQUIRY": typeOfEnquiry,
      "FOLLOW-UP DATE": followUpDate,
      "STATUS": status
    }));

    // Convert to CSV format
    const csvContent = [
      Object.keys(exportData[0]).join(","), // Header row
      ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(",")) // Data rows
    ].join("\n");

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `calling_list_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setLoading(false);
  }



  const fetchCallingListData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/tasks/telecallertask');

      if (response.data.success && response.data.data.length > 0) {
        const rawData = response.data.data;

        const formattedData = rawData.map((item, index) => {
          const doc = item.doctor || {};
          const src = item.source || {};
          const taskId = item.taskId;
          const callEntryId = item.callEntryId;
          const doctorTaskStatus = item.doctorTaskStatus || 'pending';

          // Use the doctor's name (already combined if linked as spouses)
          const doctorName = doc.fullName?.trim() || doc.hospitalName?.trim() || 'N/A';

          let enquiryType = src.label || 'Unknown';
          let enquiryColor = 'bg-gray-100 text-gray-800';

          if (src.type === 'salesman_added') {
            enquiryType = 'Data Store';
            enquiryColor = 'bg-orange-100 text-orange-800';
          } else if (src.type === 'renewal_call') {
            enquiryType = 'Renewal';
            enquiryColor = 'bg-blue-100 text-blue-800';
          } else if (src.type === 'service_call_close') {
            enquiryType = 'Service Call';
            enquiryColor = 'bg-purple-100 text-purple-800';
          }

          const status = doctorTaskStatus === 'completed' ? 'Completed' :
                        doctorTaskStatus === 'in_progress' ? 'In Progress' : 'Pending';

          const statusColor = doctorTaskStatus === 'completed' ? 'text-green-600' :
                             doctorTaskStatus === 'in_progress' ? 'text-yellow-600' : 'text-red-600';

          return {
            srNo: index + 1,
            doctorName,
            hospitalName: doc.hospitalName || 'N/A',
            contact: doc.phoneNumber || doc.whatsappNumber || 'N/A',
            isTransferred: item.isTransferred || false,
            typeOfEnquiry: enquiryType,
            enquiryColor,
            // followUpDate: doc.performanceMetrics?.nextFollowUpDate
            //   ? (() => {
            //       const date = new Date(doc.performanceMetrics.nextFollowUpDate);
            //       return isNaN(date.getTime()) ? new Date().toLocaleDateString('en-GB') : date.toLocaleDateString('en-GB');
            //     })()
            //   : new Date().toLocaleDateString('en-GB'),


            // Line 69-70 ko replace karo:
followUpDate: item.scheduledDate
  ? (() => {
      const date = new Date(item.scheduledDate);
      return isNaN(date.getTime())
        ? new Date().toLocaleDateString('en-GB')
        : date.toLocaleDateString('en-GB');
    })()
  : new Date().toLocaleDateString('en-GB'),

// Ya is format mein bhi kar sakte ho (more concise):
followUpDate: item.scheduledDate
  ? new Date(item.scheduledDate).toLocaleDateString('en-GB')
  : new Date().toLocaleDateString('en-GB'),
            status,
            statusColor,
            taskId,
            doctorId: doc._id || null,
            callEntryId,
            isCompleted: doctorTaskStatus === 'completed'
          };
        });

        setData(formattedData);
        toast.success(`Loaded ${formattedData.length} doctors!`);
      } else {
        setData([]);
        toast.info("No doctors found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load calling list");
    } finally {
      setLoading(false);
    }
  };

  // TERA PURANA FLOW SAME RAKHA — sirf callEntryId add kiya
  const handleMarkComplete = async (taskId, callEntryId, doctorId) => {
    if (!callEntryId) {
      toast.error("Call Entry ID missing!");
      return;
    }

    if (!window.confirm("Mark this call as completed?")) return;

    try {
      await apiClient.patch(`/tasks/${taskId}/mark-doctor-complete`, {
        callEntryId,     // YE SABSE ZAROORI HAI
        doctorId,        // optional safety
        notes: "Call completed successfully"
      });

      toast.success("Call completed!");
      fetchCallingListData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete call");
    }
  };

  // Function to handle adding follow-up
  const handleAddFollowUp = (doctor) => {
    setSelectedDoctor(doctor);
    setShowFollowUpModal(true);
    setNewNote("");
    setReminderDateTime("");
    setFollowUpType("call");
  };

  // Function to handle viewing follow-ups
  const handleViewFollowUps = async (doctor) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/doctors/${doctor.doctorId}`);

      if (response.data.success) {
        const doctorData = response.data.data;
        const followUps = doctorData.followUps || [];

        // Update the selected doctor with follow-ups
        setSelectedDoctor({
          ...doctor,
          followUps: followUps.map(fu => ({
            note: fu.notes || "",
            // date: fu.date ? new Date(fu.date).toLocaleString() : "",
            date: fu.date ? new Date(fu.date).toLocaleDateString('en-GB').split('/').join('-') : "",
            createdBy: fu.createdBy || { fullName: "Unknown", role: "" },
            salesman: fu.createdBy?.fullName?.charAt(0)?.toUpperCase() || "U",
          }))
        });

        setShowViewFollowUpModal(true);
      } else {
        toast.error("Failed to load follow-ups");
      }
    } catch (err) {
      console.error("Error fetching follow-ups:", err);
      toast.error("Failed to load follow-ups");
    } finally {
      setLoading(false);
    }
  };

  // Function to save new follow-up
  const handleSaveFollowUp = async () => {
    if (!selectedDoctor || !newNote.trim()) {
      toast.error("Please enter a note for the follow-up");
      return;
    }

    try {
      setLoading(true);

      await apiClient.post(`/doctors/${selectedDoctor.doctorId}/followup`, {
        date: reminderDateTime || new Date(),
        type: followUpType || "call",
        notes: newNote,
        outcome: "",
        nextFollowUpDate: reminderDateTime || undefined,
      });

      toast.success("Follow-up added successfully!");
      setShowFollowUpModal(false);
      fetchCallingListData(); // Refresh the list
    } catch (err) {
      console.error("Error saving follow-up:", err);
      toast.error("Failed to add follow-up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data
    .filter(item => sortByEnquiry === 'all' || item.typeOfEnquiry === sortByEnquiry)
    .filter(item => sortByStatus === 'all' || item.status === sortByStatus)
    .filter(item =>
      searchDoctorName === '' ||
      item.doctorName.toLowerCase().includes(searchDoctorName.toLowerCase())
    );

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="animate-spin inline-block w-12 h-12 border-4 border-[#15BBB3] border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Calling List</h1>
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Doctor Name"
                value={searchDoctorName}
                onChange={(e) => setSearchDoctorName(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#15BBB3] w-48"
              />
              {searchDoctorName && (
                <button
                  onClick={() => setSearchDoctorName('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            <select value={sortByEnquiry} onChange={(e) => setSortByEnquiry(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm">
              <option value="all">All Enquiry</option>
              <option value="Data Store">Data Store</option>
              <option value="Renewal">Renewal</option>
              <option value="Service Call">Service Call</option>
            </select>

            <select value={sortByStatus} onChange={(e) => setSortByStatus(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm">
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <button onClick={ handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              <Download size={18} /> Export
            </button>
            {/* <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
              <Printer size={18} /> Print
            </button> */}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#15BBB3] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">SR.NO</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">DOCTOR NAME</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">HOSPITAL</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">CONTACT</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">TYPE</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">FOLLOW UP</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">STATUS</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((row) => (
                <tr key={row.callEntryId} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm">{row.srNo}</td>
                  <td className="px-4 py-4 text-sm font-medium">
                    {row.doctorName}
                    {row.isTransferred && (
                      <span className="block text-xs text-orange-600 mt-1">Transferred</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{row.hospitalName}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{row.contact}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.enquiryColor}`}>
                      {row.typeOfEnquiry}
                    </span>
                  </td>
                  {/* <td className="px-4 py-4 text-sm text-gray-600">
                    {(() => {
                      const date = new Date(row.followUpDate);
                      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-GB').replace(/\//g, '.');
                    })()}
                  </td> */}



<td className="px-4 py-4 text-sm text-gray-600">
  {row.followUpDate.split('/').join('.')}
</td>

                  <td className="px-4 py-4">
                    <span className={`font-semibold ${row.statusColor}`}>{row.status}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewFollowUps(row)}
                        className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        title="View Follow-ups"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => handleAddFollowUp(row)}
                        className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        title="Add Follow-up"
                      >
                        <Plus size={16} />
                      </button>

                      {row.isCompleted ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle size={18} /> Done
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkComplete(row.taskId, row.callEntryId, row.doctorId)}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Follow-up Modal */}
      {showFollowUpModal && selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Add Follow-up for {selectedDoctor.doctorName}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Note</label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Enter follow-up note..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Reminder Date & Time</label>
                <input
                  type="datetime-local"
                  value={reminderDateTime}
                  onChange={(e) => setReminderDateTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Follow-up Type</label>
                <select
                  value={followUpType}
                  onChange={(e) => setFollowUpType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="call">Call</option>
                  <option value="visit">Visit</option>
                  <option value="email">Email</option>
                  <option value="message">Message</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFollowUp}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Follow-up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Follow-ups Modal */}
      {showViewFollowUpModal && selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Follow-ups for {selectedDoctor.doctorName}</h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedDoctor.followUps && selectedDoctor.followUps.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No follow-ups recorded</p>
              ) : (
                selectedDoctor.followUps?.map((fu, idx) => (
                  <div key={idx} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{fu.note || "No note"}</p>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{fu.salesman}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{fu.date || "No date"}</p>
                    <p className="text-xs text-gray-400">Added by: {fu.createdBy.fullName || "N/A"}</p>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewFollowUpModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallingList;