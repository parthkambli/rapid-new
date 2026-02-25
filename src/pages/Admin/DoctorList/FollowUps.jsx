
// import React, { useState, useEffect, useMemo } from "react";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import DateInput from "../../../components/DateInput/DateInput";

// const DoctorFollowUps = () => {
//   const [followUps, setFollowUps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [searchType, setSearchType] = useState("Doctor");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [expandedDoctor, setExpandedDoctor] = useState(null);

//   // Fetch follow-ups from API
//   useEffect(() => {
//     const fetchFollowUps = async () => {
//       try {
//         setLoading(true);
//         // Fetch all doctors which contain follow-up information
//         const response = await apiClient.get(apiEndpoints.doctors.list);
//         if (response.data.success) {
//           // Transform doctor data to follow-up format
//           let transformedData = [];
          
//           const doctors = response.data.data || response.data;
          
//           // Extract all follow-ups from all doctors
//           doctors.forEach((doctor) => {
//             if (doctor.followUps && Array.isArray(doctor.followUps)) {
//               doctor.followUps.forEach((followUp) => {
//                 // Determine status based on next follow-up date
//                 let status = 'Completed';
//                 if (followUp.nextFollowUpDate) {
//                   const nextDate = new Date(followUp.nextFollowUpDate);
//                   const today = new Date();
//                   status = nextDate > today ? 'Pending' : 'Completed';
//                 }
                
//                 transformedData.push({
//                   id: `${doctor._id}-${followUp._id || Date.now()}-${Math.random()}`, // Create unique ID
//                   doctor: doctor.fullName || doctor.name || doctor.doctorName || 'N/A',
//                   hospital: doctor.hospitalName || doctor.hospitalAddress?.name || doctor.hospitalAddress?.hospitalName || 'N/A',
//                   date: followUp.date ? new Date(followUp.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//                   note: followUp.notes || followUp.remarks || followUp.description || 'N/A',
//                   nextFollowUp: followUp.nextFollowUpDate ? new Date(followUp.nextFollowUpDate).toISOString().split('T')[0] : 'N/A',
//                   status: status,
//                   doctorId: doctor._id,
//                   type: followUp.type || 'Follow-up',
//                   outcome: followUp.outcome || 'N/A'
//                 });
//               });
//             }
//           });
          
//           setFollowUps(transformedData);
//         } else {
//           setError(response.data.message || 'Failed to fetch follow-ups');
//         }
//       } catch (err) {
//         console.error('Error fetching follow-ups:', err);
//         setError(err.response?.data?.message || 'Error fetching follow-ups');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFollowUps();
//   }, []);

//   // const filteredData = useMemo(() => {
//   //   let data = followUps;

//   //   if (search) {
//   //     data = data.filter((r) =>
//   //       searchType === "Doctor"
//   //         ? r.doctor.toLowerCase().includes(search.toLowerCase())
//   //         : r.hospital.toLowerCase().includes(search.toLowerCase())
//   //     );
//   //   }
//   //   if (statusFilter !== "All") data = data.filter((r) => r.status === statusFilter);
    
//   //   // Filter by date range
//   //   if (fromDate) {
//   //     data = data.filter((r) => {
//   //       const itemDate = new Date(r.date);
//   //       const filterDate = new Date(fromDate);
//   //       return itemDate >= filterDate;
//   //     });
//   //   }
//   //   if (toDate) {
//   //     data = data.filter((r) => {
//   //       const itemDate = new Date(r.date);
//   //       const filterDate = new Date(toDate);
//   //       return itemDate <= filterDate;
//   //     });
//   //   }

//   //   return data.sort((a, b) => new Date(b.date) - new Date(a.date));
//   // }, [followUps, search, searchType, statusFilter, fromDate, toDate]);



// const filteredData = useMemo(() => {
//   let data = followUps;

//   if (search) {
//     data = data.filter((r) =>
//       searchType === "Doctor"
//         ? r.doctor.toLowerCase().includes(search.toLowerCase())
//         : r.hospital.toLowerCase().includes(search.toLowerCase())
//     );
//   }
//   if (statusFilter !== "All") data = data.filter((r) => r.status === statusFilter);

//   // Date filter - proper conversion
//   if (fromDate && toDate) {
//     // dd-mm-yyyy ko yyyy-mm-dd mein convert karo for safe comparison
//     const convertToISO = (ddmmyyyy) => {
//       if (!ddmmyyyy) return null;
//       const [day, month, year] = ddmmyyyy.split('-');
//       if (!day || !month || !year) return null;
//       return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
//     };

//     const fromISO = convertToISO(fromDate);
//     const toISO = convertToISO(toDate);

//     if (fromISO && toISO) {
//       data = data.filter((r) => {
//         // r.date already yyyy-mm-dd hai
//         return r.date >= fromISO && r.date <= toISO;
//       });
//     }
//   }

//   return data.sort((a, b) => new Date(b.date) - new Date(a.date));
// }, [followUps, search, searchType, statusFilter, fromDate, toDate]);

//   const grouped = useMemo(() => {
//     const map = {};
//     filteredData.forEach((r) => {
//       if (!map[r.doctor]) {
//         map[r.doctor] = { 
//           doctor: r.doctor, 
//           hospital: r.hospital, 
//           entries: [], 
//           latest: null,
//           pending: 0,
//           completed: 0
//         };
//       }
//       map[r.doctor].entries.push(r);
//       if (!map[r.doctor].latest || new Date(r.date) > new Date(map[r.doctor].latest.date)) {
//         map[r.doctor].latest = r;
//       }
//       // Count pending and completed follow-ups for each doctor
//       if (r.status === "Pending") map[r.doctor].pending++;
//       if (r.status === "Completed") map[r.doctor].completed++;
//     });
//     return Object.values(map);
//   }, [filteredData]);

//   const counters = useMemo(() => {
//     const doctors = new Set(filteredData.map((r) => r.doctor)).size;
//     const total = filteredData.length;
//     const pending = filteredData.filter((r) => r.status === "Pending").length;
//     const completed = filteredData.filter((r) => r.status === "Completed").length;
//     return { doctors, total, pending, completed };
//   }, [filteredData]);

//   const exportCSV = () => {
//     const headers = "Date,Doctor,Hospital,Note,Next Follow-up,Status\n";
//     const rows = filteredData
//       .map((r) => {
//         // Properly escape values that might contain commas
//         const values = [
//           `"${r.date || ''}"`,
//           `"${r.doctor || ''}"`,
//           `"${r.hospital || ''}"`,
//           `"${r.note || ''}"`,
//           `"${r.nextFollowUp || ''}"`,
//           `"${r.status || ''}"`
//         ];
//         return values.join(",");
//       })
//       .join("\n");
//     const csv = headers + rows;
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "followups.csv";
//     a.click();
//   };

//   if (loading) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen font-sans flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#157a6e] mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading follow-ups...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen font-sans">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           <strong>Error:</strong> {error}
//         </div>
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-[#157a6e] text-white px-4 py-2 rounded hover:bg-[#0f5c55]"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Doctor Follow-ups — Master View</h1>
//         <p className="text-sm text-gray-600">Today: 2025-10-15</p>
//       </div>

//       {/* Counters */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-teal-500">
//           <p className="text-3xl font-bold text-teal-600">{counters.doctors}</p>
//           <p className="text-sm text-gray-600">Doctors</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-blue-500">
//           <p className="text-3xl font-bold text-blue-600">{counters.total}</p>
//           <p className="text-sm text-gray-600">Total follow-ups</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-orange-500">
//           <p className="text-3xl font-bold text-orange-600">{counters.pending}</p>
//           <p className="text-sm text-gray-600">Pending</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-green-500">
//           <p className="text-3xl font-bold text-green-600">{counters.completed}</p>
//           <p className="text-sm text-gray-600">Completed</p>
//         </div>
//       </div>

//       {/* Filters */}
//       {/* <div className="bg-white p-4 rounded-lg shadow  mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-sm">
//           <input
//             type="text"
//             placeholder="Search (doctor / hospital)"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//           />
//           <select
//             value={searchType}
//             onChange={(e) => setSearchType(e.target.value)}
//             className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//           >
//             <option>Doctor</option>
//             <option>Hospital</option>
//           </select>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//           >
//             <option value="All">All</option>
//             <option value="Pending">Pending</option>
//             <option value="Completed">Completed</option>
//           </select>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="p-2 border rounded-md"
//           />
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="p-2 border rounded-md"
//           />
//           <div className="flex gap-2">
//             <button className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700">
//               Filter
//             </button>
//             <button className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600">
//               Reset
//             </button>
//             <button
//               onClick={exportCSV}
//               className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
//             >
//               Export CSV
//             </button>
//           </div>
//         </div>
//       </div> */}



// <div className="bg-white p-4 rounded-lg shadow mb-6">
//   <div className="grid grid-cols-1 md:grid-cols-8 gap-3 text-sm items-center">
//     <input
//       type="text"
//       placeholder="Search (doctor / hospital)"
//       value={search}
//       onChange={(e) => setSearch(e.target.value)}
//       className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 col-span-2"
//     />

//     <select
//       value={searchType}
//       onChange={(e) => setSearchType(e.target.value)}
//       className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//     >
//       <option>Doctor</option>
//       <option>Hospital</option>
//     </select>

//     <select
//       value={statusFilter}
//       onChange={(e) => setStatusFilter(e.target.value)}
//       className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//     >
//       <option value="All">All</option>
//       <option value="Pending">Pending</option>
//       <option value="Completed">Completed</option>
//     </select>

//     <DateInput
//       // type="date"
//       name="fromDate"
//       value={fromDate}
//       onChange={(e) => setFromDate(e.target.value)}
//       maxDate={toDate}
//       className="p-2 border rounded-md"
//     />
//     <DateInput
//       // type="date"
//       name="toDate"
//       value={toDate}
//       onChange={(e) => setToDate(e.target.value)}
//       minDate={fromDate}
//       className="p-2 border rounded-md"
//     />

//     <div className="flex gap-2 col-span-2 justify-end">
//       <button className="bg-teal-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-700">
//         Filter
//       </button>
//       {/* <button className="bg-gray-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600">
//         Reset
//       </button> */}

// <button 
//   onClick={() => {
//     setSearch("");
//     setSearchType("Doctor");
//     setStatusFilter("All");
//     setFromDate("");
//     setToDate("");
//   }}
//   className="bg-gray-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
// >
//   Reset
// </button>

//       <button
//         onClick={exportCSV}
//         className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
//       >
//         Export
//       </button>
//     </div>
//   </div>
// </div>





//       {/* Master Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-[#f4fffe] text-[#118f84]">
//               <tr>
//                 <th className="px-4 py-3 text-left font-medium">Date</th>
//                 <th className="px-4 py-3 text-left font-medium">Doctor / Hospital</th>
//                 <th className="px-4 py-3 text-left font-medium">Follow-up Note</th>
//                 <th className="px-4 py-3 text-left font-medium">Next Follow-up</th>
//                 <th className="px-4 py-3 text-left font-medium">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {grouped.map((group) => {
//                 const isOpen = expandedDoctor === group.doctor;
//                 const latest = group.latest;
//                 return (
//                   <React.Fragment key={group.doctor}>
//                     {/* Main Row */}
//                     <tr
//                       className="hover:bg-gray-50 cursor-pointer transition"
//                       onClick={() => setExpandedDoctor(isOpen ? null : group.doctor)}
//                     >
//                       <td className="px-4 py-3 text-gray-900">{latest.date}</td>
//                       <td className="px-4 py-3">
//                         <div className="font-medium text-gray-900">{group.doctor}</div>
//                         <div className="text-xs text-gray-500">
//                           {group.hospital} • {group.entries.length} follow-ups
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-gray-700">{latest.note}</td>
//                       <td className="px-4 py-3 text-gray-700">{latest.nextFollowUp}</td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             latest.status === "Completed"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-orange-100 text-orange-800"
//                           }`}
//                         >
//                           {latest.status === "Completed" ? "Completed" : "Pending"}
//                         </span>
//                       </td>
//                     </tr>

//                     {/* Expanded History */}
//                     {isOpen && (
//                       <tr>
//                         <td colSpan="5" className="p-0 bg-gray-50">
//                           <div className="p-6">
//                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                               <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-bold text-gray-800">{group.doctor}</h3>
//                                 <p className="text-sm text-gray-500">
//                                   {group.hospital} • {group.entries.length} follow-ups
//                                 </p>
//                               </div>
//                               <table className="w-full text-sm">
//                                 <thead className="bg-gray-100 text-[#118f84]">
//                                   <tr>
//                                     <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Date
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Note
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Next
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Status
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                   {group.entries.map((entry) => (
//                                     <tr key={entry.id} className="hover:bg-gray-50">
//                                       <td className="px-3 py-2 text-gray-900">{entry.date}</td>
//                                       <td className="px-3 py-2 text-gray-700">{entry.note}</td>
//                                       <td className="px-3 py-2 text-gray-700">{entry.nextFollowUp}</td>
//                                       <td className="px-3 py-2">
//                                         <span
//                                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                             entry.status === "Completed"
//                                               ? "bg-green-100 text-green-800"
//                                               : "bg-orange-100 text-orange-800"
//                                           }`}
//                                         >
//                                           {entry.status === "Completed" ? "Completed" : "Pending"}
//                                         </span>
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                               </table>
//                               <div className="mt-4 text-right">
//                                 <button
//                                   onClick={() => setExpandedDoctor(null)}
//                                   className="text-sm text-teal-600 hover:underline"
//                                 >
//                                   Back to Top
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
//         <p>{grouped.length} shown</p>
//         <select className="p-2 border rounded-md text-sm">
//           <option>Flat Table</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default DoctorFollowUps;




// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import DateInput from "../../../components/DateInput/DateInput";

// const DoctorFollowUps = () => {
//   const [followUps, setFollowUps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [searchType, setSearchType] = useState("Doctor");
//   const [doctorTypeFilter, setDoctorTypeFilter] = useState("All");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [expandedDoctor, setExpandedDoctor] = useState(null);

//   // Helper function to parse dates - useCallback to memoize
//   const parseDate = useCallback((dateString) => {
//     if (!dateString) return null;
    
//     // Check if it's already in dd-mm-yyyy format
//     const parts = dateString.split('-');
//     if (parts.length === 3) {
//       // If first part is 4 digits, it's yyyy-mm-dd
//       if (parts[0].length === 4) {
//         const [year, month, day] = parts;
//         return new Date(year, month - 1, day);
//       } 
//       // Otherwise it's dd-mm-yyyy
//       else if (parts[2].length === 4) {
//         const [day, month, year] = parts;
//         return new Date(year, month - 1, day);
//       }
//     }
    
//     // Try parsing as ISO string
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? null : date;
//   }, []);

//   // Fetch follow-ups from API
//   useEffect(() => {
//     const fetchFollowUps = async () => {
//       try {
//         setLoading(true);
//         const response = await apiClient.get(apiEndpoints.doctors.list);
//         if (response.data.success) {
//           let transformedData = [];
          
//           const doctors = response.data.data || response.data;
          
//           doctors.forEach((doctor) => {
//             if (doctor.followUps && Array.isArray(doctor.followUps)) {
//               doctor.followUps.forEach((followUp) => {
//                 let status = 'Completed';
//                 if (followUp.nextFollowUpDate) {
//                   const nextDate = new Date(followUp.nextFollowUpDate);
//                   const today = new Date();
//                   status = nextDate > today ? 'Pending' : 'Completed';
//                 }
                
//                 transformedData.push({
//                   id: `${doctor._id}-${followUp._id || Date.now()}-${Math.random()}`,
//                   doctor: doctor.fullName || doctor.name || doctor.doctorName || 'N/A',
//                   hospital: doctor.hospitalName || doctor.hospitalAddress?.name || doctor.hospitalAddress?.hospitalName || 'N/A',
//                   date: followUp.date ? new Date(followUp.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//                   note: followUp.notes || followUp.remarks || followUp.description || 'N/A',
//                   nextFollowUp: followUp.nextFollowUpDate ? new Date(followUp.nextFollowUpDate).toISOString().split('T')[0] : 'N/A',
//                   status: status,
//                   doctorId: doctor._id,
//                   doctorType: doctor.doctorType || 'individual',
//                   type: followUp.type || 'Follow-up',
//                   outcome: followUp.outcome || 'N/A',
//                   rawDate: followUp.date ? new Date(followUp.date) : new Date()
//                 });
//               });
//             }
//           });
          
//           setFollowUps(transformedData);
//         } else {
//           setError(response.data.message || 'Failed to fetch follow-ups');
//         }
//       } catch (err) {
//         console.error('Error fetching follow-ups:', err);
//         setError(err.response?.data?.message || 'Error fetching follow-ups');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFollowUps();
//   }, []);

//   // Fixed filter function
//   const filteredData = useMemo(() => {
//     let data = followUps;

//     // Search filter
//     if (search) {
//       data = data.filter((r) => {
//         if (searchType === "Doctor") {
//           return r.doctor.toLowerCase().includes(search.toLowerCase());
//         } else if (searchType === "Hospital") {
//           return r.hospital.toLowerCase().includes(search.toLowerCase());
//         }
//         return true;
//       });
//     }

//     // Doctor Type filter
//     if (doctorTypeFilter !== "All") {
//       data = data.filter((r) => r.doctorType === doctorTypeFilter);
//     }

//     // Date filter
//     if (fromDate) {
//       const from = parseDate(fromDate);
//       if (from) {
//         data = data.filter((r) => {
//           const itemDate = r.rawDate;
//           return itemDate >= from;
//         });
//       }
//     }

//     if (toDate) {
//       const to = parseDate(toDate);
//       if (to) {
//         // Set to end of day for inclusive comparison
//         to.setHours(23, 59, 59, 999);
//         data = data.filter((r) => {
//           const itemDate = r.rawDate;
//           return itemDate <= to;
//         });
//       }
//     }

//     return data.sort((a, b) => b.rawDate - a.rawDate);
//   }, [followUps, search, searchType, doctorTypeFilter, fromDate, toDate, parseDate]);

//   const grouped = useMemo(() => {
//     const map = {};
//     filteredData.forEach((r) => {
//       if (!map[r.doctor]) {
//         map[r.doctor] = { 
//           doctor: r.doctor, 
//           hospital: r.hospital, 
//           doctorType: r.doctorType,
//           entries: [], 
//           latest: null,
//           pending: 0,
//           completed: 0
//         };
//       }
//       map[r.doctor].entries.push(r);
//       if (!map[r.doctor].latest || r.rawDate > map[r.doctor].latest.rawDate) {
//         map[r.doctor].latest = r;
//       }
//       if (r.status === "Pending") map[r.doctor].pending++;
//       if (r.status === "Completed") map[r.doctor].completed++;
//     });
//     return Object.values(map);
//   }, [filteredData]);

//   const counters = useMemo(() => {
//     const doctors = new Set(filteredData.map((r) => r.doctor)).size;
//     const total = filteredData.length;
//     const pending = filteredData.filter((r) => r.status === "Pending").length;
//     const completed = filteredData.filter((r) => r.status === "Completed").length;
//     const individual = filteredData.filter((r) => r.doctorType === 'individual').length;
//     const hospital = filteredData.filter((r) => r.doctorType === 'hospital').length;
//     const hospitalIndividual = filteredData.filter((r) => r.doctorType === 'hospital + individual').length;
    
//     return { doctors, total, pending, completed, individual, hospital, hospitalIndividual };
//   }, [filteredData]);

//   const exportCSV = () => {
//     const headers = "Date,Doctor,Doctor Type,Hospital,Note,Next Follow-up,Status\n";
//     const rows = filteredData
//       .map((r) => {
//         const values = [
//           `"${r.date || ''}"`,
//           `"${r.doctor || ''}"`,
//           `"${r.doctorType || ''}"`,
//           `"${r.hospital || ''}"`,
//           `"${r.note || ''}"`,
//           `"${r.nextFollowUp || ''}"`,
//           `"${r.status || ''}"`
//         ];
//         return values.join(",");
//       })
//       .join("\n");
//     const csv = headers + rows;
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `followups_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   // Get doctor type display name
//   const getDoctorTypeDisplay = (type) => {
//     switch(type) {
//       case 'individual': return 'Individual';
//       case 'hospital': return 'Hospital';
//       case 'hospital + individual': return 'Hospital + Individual';
//       default: return type;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen font-sans flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#157a6e] mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading follow-ups...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen font-sans">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           <strong>Error:</strong> {error}
//         </div>
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-[#157a6e] text-white px-4 py-2 rounded hover:bg-[#0f5c55]"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Doctor Follow-ups — Master View</h1>
//         <p className="text-sm text-gray-600">Today: {new Date().toISOString().split('T')[0]}</p>
//       </div>

//       {/* Counters */}
//       <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-teal-500">
//           <p className="text-3xl font-bold text-teal-600">{counters.doctors}</p>
//           <p className="text-sm text-gray-600">Doctors</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-blue-500">
//           <p className="text-3xl font-bold text-blue-600">{counters.total}</p>
//           <p className="text-sm text-gray-600">Total Follow-ups</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-purple-500">
//           <p className="text-3xl font-bold text-purple-600">{counters.individual}</p>
//           <p className="text-sm text-gray-600">Individual</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-indigo-500">
//           <p className="text-3xl font-bold text-indigo-600">{counters.hospital}</p>
//           <p className="text-sm text-gray-600">Hospital</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-pink-500">
//           <p className="text-3xl font-bold text-pink-600">{counters.hospitalIndividual}</p>
//           <p className="text-sm text-gray-600">Hospital + Individual</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-orange-500">
//           <p className="text-3xl font-bold text-orange-600">{counters.pending}</p>
//           <p className="text-sm text-gray-600">Pending</p>
//         </div>
//       </div>

//       {/* Updated Filters Section */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-10 gap-3 text-sm items-center">
//           {/* Search Input */}
//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 col-span-2"
//           />

//           {/* Search Type Dropdown */}
//           <select
//             value={searchType}
//             onChange={(e) => setSearchType(e.target.value)}
//             className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//           >
//             <option value="Doctor">Doctor</option>
//             <option value="Hospital">Hospital</option>
//           </select>

//           {/* Doctor Type Filter Dropdown */}
//           <select
//             value={doctorTypeFilter}
//             onChange={(e) => setDoctorTypeFilter(e.target.value)}
//             className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//           >
//             <option value="All">All Types</option>
//             <option value="individual">Individual</option>
//             <option value="hospital">Hospital</option>
//             <option value="hospital + individual">Hospital + Individual</option>
//           </select>

//           {/* Status Filter Dropdown (Optional) */}
//           <select
//             value={""}
//             onChange={() => {}}
//             className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 opacity-50 cursor-not-allowed"
//             disabled
//           >
//             <option>Status (Coming Soon)</option>
//           </select>

//           {/* From Date - Fix the jsx warning by removing boolean attribute */}
//           <DateInput
//             name="fromDate"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             placeholderText="From Date"
//             maxDate={toDate}
//             className="p-2 border rounded-md"
//             wrapperClassName="w-full"
//           />

//           {/* To Date */}
//           <DateInput
//             name="toDate"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             placeholderText="To Date"
//             minDate={fromDate}
//             className="p-2 border rounded-md"
//             wrapperClassName="w-full"
//           />

//           {/* Action Buttons */}
//           <div className="flex gap-2 col-span-2 justify-end">
//             <button 
//               onClick={() => {
//                 setSearch("");
//                 setSearchType("Doctor");
//                 setDoctorTypeFilter("All");
//                 setFromDate("");
//                 setToDate("");
//               }}
//               className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition"
//             >
//               Reset
//             </button>
//             <button
//               onClick={exportCSV}
//               className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition"
//             >
//               Export CSV
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Master Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-[#f4fffe] text-[#118f84]">
//               <tr>
//                 <th className="px-4 py-3 text-left font-medium">Date</th>
//                 <th className="px-4 py-3 text-left font-medium">Doctor / Hospital</th>
//                 <th className="px-4 py-3 text-left font-medium">Doctor Type</th>
//                 <th className="px-4 py-3 text-left font-medium">Follow-up Note</th>
//                 <th className="px-4 py-3 text-left font-medium">Next Follow-up</th>
//                 <th className="px-4 py-3 text-left font-medium">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {grouped.map((group) => {
//                 const isOpen = expandedDoctor === group.doctor;
//                 const latest = group.latest;

//                 return (
//                   <React.Fragment key={group.doctor}>
//                     {/* Main Row */}
//                     <tr
//                       className="hover:bg-gray-50 cursor-pointer transition"
//                       onClick={() => setExpandedDoctor(isOpen ? null : group.doctor)}
//                     >
//                       <td className="px-4 py-3 text-gray-900">{latest.date}</td>
//                       <td className="px-4 py-3">
//                         <div className="font-medium text-gray-900">{group.doctor}</div>
//                         <div className="text-xs text-gray-500">
//                           {group.hospital} • {group.entries.length} follow-ups
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           group.doctorType === 'individual' ? 'bg-blue-100 text-blue-800' :
//                           group.doctorType === 'hospital' ? 'bg-indigo-100 text-indigo-800' :
//                           'bg-pink-100 text-pink-800'
//                         }`}>
//                           {getDoctorTypeDisplay(group.doctorType)}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-gray-700">{latest.note}</td>
//                       <td className="px-4 py-3 text-gray-700">{latest.nextFollowUp}</td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             latest.status === "Completed"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-orange-100 text-orange-800"
//                           }`}
//                         >
//                           {latest.status === "Completed" ? "Completed" : "Pending"}
//                         </span>
//                       </td>
//                     </tr>

//                     {/* Expanded History */}
//                     {isOpen && (
//                       <tr>
//                         <td colSpan="6" className="p-0 bg-gray-50">
//                           <div className="p-6">
//                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                               <div className="flex justify-between items-center mb-4">
//                                 <div>
//                                   <h3 className="text-lg font-bold text-gray-800">{group.doctor}</h3>
//                                   <div className="flex items-center gap-2 mt-1">
//                                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                       group.doctorType === 'individual' ? 'bg-blue-100 text-blue-800' :
//                                       group.doctorType === 'hospital' ? 'bg-indigo-100 text-indigo-800' :
//                                       'bg-pink-100 text-pink-800'
//                                     }`}>
//                                       {getDoctorTypeDisplay(group.doctorType)}
//                                     </span>
//                                     <span className="text-sm text-gray-500">•</span>
//                                     <span className="text-sm text-gray-500">{group.hospital}</span>
//                                     <span className="text-sm text-gray-500">•</span>
//                                     <span className="text-sm text-gray-500">{group.entries.length} follow-ups</span>
//                                   </div>
//                                 </div>
//                                 <div className="flex gap-4">
//                                   <div className="text-center">
//                                     <p className="text-2xl font-bold text-orange-600">{group.pending}</p>
//                                     <p className="text-xs text-gray-500">Pending</p>
//                                   </div>
//                                   <div className="text-center">
//                                     <p className="text-2xl font-bold text-green-600">{group.completed}</p>
//                                     <p className="text-xs text-gray-500">Completed</p>
//                                   </div>
//                                 </div>
//                               </div>
                              
//                               <table className="w-full text-sm">
//                                 <thead className="bg-gray-100 text-[#118f84]">
//                                   <tr>
//                                     <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Date
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Note
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Next Follow-up
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Status
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                   {group.entries.map((entry) => (
//                                     <tr key={entry.id} className="hover:bg-gray-50">
//                                       <td className="px-3 py-2 text-gray-900">{entry.date}</td>
//                                       <td className="px-3 py-2 text-gray-700">{entry.note}</td>
//                                       <td className="px-3 py-2 text-gray-700">{entry.nextFollowUp}</td>
//                                       <td className="px-3 py-2">
//                                         <span
//                                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                             entry.status === "Completed"
//                                               ? "bg-green-100 text-green-800"
//                                               : "bg-orange-100 text-orange-800"
//                                           }`}
//                                         >
//                                           {entry.status === "Completed" ? "Completed" : "Pending"}
//                                         </span>
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                               </table>
//                               <div className="mt-4 text-right">
//                                 <button
//                                   onClick={() => setExpandedDoctor(null)}
//                                   className="text-sm text-teal-600 hover:underline"
//                                 >
//                                   Back to Top
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
//         <p>
//           Showing {grouped.length} doctors with {filteredData.length} follow-ups
//           {doctorTypeFilter !== "All" && ` (Filtered by: ${getDoctorTypeDisplay(doctorTypeFilter)})`}
//         </p>
//         <div className="flex gap-2">
//           <select className="p-2 border rounded-md text-sm bg-white">
//             <option>Group by Doctor</option>
//             <option>Flat View</option>
//           </select>
//           <button 
//             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//             className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
//           >
//             Scroll to Top
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorFollowUps;













// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import DateInput from "../../../components/DateInput/DateInput";

// const DoctorFollowUps = () => {
//   const [followUps, setFollowUps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [doctorTypeFilter, setDoctorTypeFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All"); // New status filter
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [expandedDoctor, setExpandedDoctor] = useState(null);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // Helper function to parse dates - useCallback to memoize
//   const parseDate = useCallback((dateString) => {
//     if (!dateString) return null;
    
//     // Check if it's already in dd-mm-yyyy format
//     const parts = dateString.split('-');
//     if (parts.length === 3) {
//       // If first part is 4 digits, it's yyyy-mm-dd
//       if (parts[0].length === 4) {
//         const [year, month, day] = parts;
//         return new Date(year, month - 1, day);
//       } 
//       // Otherwise it's dd-mm-yyyy
//       else if (parts[2].length === 4) {
//         const [day, month, year] = parts;
//         return new Date(year, month - 1, day);
//       }
//     }
    
//     // Try parsing as ISO string
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? null : date;
//   }, []);

//   // Fetch follow-ups from API using the dedicated follow-ups endpoint
//   useEffect(() => {
//     const fetchFollowUps = async () => {
//       try {
//         setLoading(true);

//         // Use the dedicated follow-ups endpoint that returns doctors with their follow-ups
//         const response = await apiClient.get(apiEndpoints.doctors.followUps.all, {
//           params: { page: 1, limit: 1000 } // High limit to get all follow-ups in one call
//         });

//         if (response.data.success) {
//           // The API returns doctors with followUps array, so we can use the data directly
//           setFollowUps(response.data.data);
//         } else {
//           setError(response.data.message || 'Failed to fetch follow-ups');
//         }
//       } catch (err) {
//         console.error('Error fetching follow-ups:', err);
//         setError(err.response?.data?.message || 'Error fetching follow-ups');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFollowUps();
//   }, []);

//   // Fixed filter function - works with the API response structure
//   const filteredData = useMemo(() => {
//     let data = followUps;

//     // Search filter - searches both doctor name and hospital name
//     if (search) {
//       data = data.filter((r) => {
//         return (
//           r.doctorName.toLowerCase().includes(search.toLowerCase()) ||
//           r.hospitalName.toLowerCase().includes(search.toLowerCase())
//         );
//       });
//     }

//     // Doctor Type filter
//     if (doctorTypeFilter !== "All") {
//       data = data.filter((r) => r.doctorType === doctorTypeFilter);
//     }

//     // Status filter - using the status field from API response
//     if (statusFilter !== "All") {
//       data = data.filter((r) => r.status === statusFilter);
//     }

//     // Date filter - using the date field from the API response
//     if (fromDate) {
//       const fromParsed = parseDate(fromDate);
//       if (fromParsed) {
//         data = data.filter((r) => {
//           const itemDate = new Date(r.date);
//           return itemDate >= fromParsed;
//         });
//       }
//     }

//     if (toDate) {
//       const toParsed = parseDate(toDate);
//       if (toParsed) {
//         // Set to end of day for inclusive comparison
//         toParsed.setHours(23, 59, 59, 999);
//         data = data.filter((r) => {
//           const itemDate = new Date(r.date);
//           return itemDate <= toParsed;
//         });
//       }
//     }

//     return data;
//   }, [followUps, search, doctorTypeFilter, statusFilter, fromDate, toDate, parseDate]);

//   // Use filtered data directly since API returns grouped data (each doctor with their follow-ups)
//   const groupedData = filteredData;

//   // Pagination calculations for grouped data
//   const totalPages = Math.ceil(groupedData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentGroupedData = groupedData.slice(startIndex, endIndex);

//   // Reset to first page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, doctorTypeFilter, statusFilter, fromDate, toDate]);

//   const counters = useMemo(() => {
//     const doctors = groupedData.length; // Total number of doctors
//     const total = groupedData.reduce((sum, doctor) => sum + (doctor.followUps?.length || 0), 0); // Total follow-ups
//     const pending = groupedData.reduce((sum, doctor) => {
//       if (doctor.followUps && Array.isArray(doctor.followUps)) {
//         return sum + doctor.followUps.filter(fu => 
//           (fu.nextFollowUpDate && new Date(fu.nextFollowUpDate) > new Date()) || 
//           doctor.status === "pending" || doctor.status === "Pending"
//         ).length;
//       }
//       return sum;
//     }, 0);
//     const completed = total - pending; // Remaining follow-ups are completed
//     const individual = groupedData.filter((r) => r.doctorType === 'individual').length;
//     const hospital = groupedData.filter((r) => r.doctorType === 'hospital').length;
//     const hospitalIndividual = groupedData.filter((r) => r.doctorType === 'hospital + individual').length;
    
//     return { doctors, total, pending, completed, individual, hospital, hospitalIndividual };
//   }, [groupedData]);

//   const exportCSV = () => {
//     const headers = "Date,Doctor,Doctor Type,Hospital,Note,Next Follow-up,Status\n";
//     let allFollowUps = [];
    
//     // Flatten all follow-ups from all doctors
//     groupedData.forEach(doctor => {
//       if (doctor.followUps && Array.isArray(doctor.followUps)) {
//         doctor.followUps.forEach(followUp => {
//           allFollowUps.push({
//             date: followUp.date ? new Date(followUp.date).toISOString().split('T')[0] : 
//                   followUp.createdAt ? new Date(followUp.createdAt).toISOString().split('T')[0] : 'N/A',
//             doctor: doctor.doctorName || doctor.fullName || 'N/A',
//             doctorType: doctor.doctorType || 'N/A',
//             hospital: doctor.hospitalName || 'N/A',
//             note: followUp.notes || followUp.followupNote || 'N/A',
//             nextFollowUp: followUp.nextFollowUpDate ? new Date(followUp.nextFollowUpDate).toISOString().split('T')[0] : 'N/A',
//             status: followUp.nextFollowUpDate && new Date(followUp.nextFollowUpDate) > new Date() ? 'Pending' : 'Completed'
//           });
//         });
//       }
//     });

//     const rows = allFollowUps
//       .map((r) => {
//         const values = [
//           `"${r.date || ''}"`,
//           `"${r.doctor || ''}"`,
//           `"${r.doctorType || ''}"`,
//           `"${r.hospital || ''}"`,
//           `"${r.note || ''}"`,
//           `"${r.nextFollowUp || ''}"`,
//           `"${r.status || ''}"`
//         ];
//         return values.join(",");
//       })
//       .join("\n");
//     const csv = headers + rows;
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `followups_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   // Get doctor type display name
//   const getDoctorTypeDisplay = (type) => {
//     switch(type) {
//       case 'individual': return 'Individual';
//       case 'hospital': return 'Hospital';
//       case 'hospital + individual': return 'Hospital + Individual';
//       default: return type;
//     }
//   };

//   // Pagination controls
//   const renderPagination = () => {
//     const pageNumbers = [];
//     const maxVisiblePages = 5;

//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

//     return (
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-gray-600">
//             Showing {startIndex + 1} to {Math.min(endIndex, groupedData.length)} of {groupedData.length} doctors
//           </span>
//           <select
//             value={itemsPerPage}
//             onChange={(e) => {
//               setItemsPerPage(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="px-2 py-1 border rounded text-sm"
//           >
//             <option value="5">5 per page</option>
//             <option value="10">10 per page</option>
//             <option value="20">20 per page</option>
//             <option value="50">50 per page</option>
//             <option value="100">100 per page</option>
//           </select>
//         </div>
        
//         <div className="flex items-center gap-1">
//           <button
//             onClick={() => setCurrentPage(1)}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             First
//           </button>
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Previous
//           </button>
          
//           {startPage > 1 && (
//             <>
//               <button
//                 onClick={() => setCurrentPage(1)}
//                 className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
//               >
//                 1
//               </button>
//               {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
//             </>
//           )}
          
//           {pageNumbers.map(number => (
//             <button
//               key={number}
//               onClick={() => setCurrentPage(number)}
//               className={`px-3 py-1 border rounded text-sm ${
//                 currentPage === number 
//                   ? 'bg-[#157a6e] text-white border-[#157a6e]' 
//                   : 'hover:bg-gray-50'
//               }`}
//             >
//               {number}
//             </button>
//           ))}
          
//           {endPage < totalPages && (
//             <>
//               {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
//               <button
//                 onClick={() => setCurrentPage(totalPages)}
//                 className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
//               >
//                 {totalPages}
//               </button>
//             </>
//           )}
          
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Next
//           </button>
//           <button
//             onClick={() => setCurrentPage(totalPages)}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Last
//           </button>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen font-sans flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#157a6e] mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading follow-ups...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen font-sans">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           <strong>Error:</strong> {error}
//         </div>
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-[#157a6e] text-white px-4 py-2 rounded hover:bg-[#0f5c55]"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Doctor Follow-ups — Master View</h1>
//         <p className="text-sm text-gray-600">Today: {new Date().toISOString().split('T')[0]}</p>
//       </div>

//       {/* Counters */}
//       <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-teal-500">
//           <p className="text-3xl font-bold text-teal-600">{counters.doctors}</p>
//           <p className="text-sm text-gray-600">Doctors</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-blue-500">
//           <p className="text-3xl font-bold text-blue-600">{counters.total}</p>
//           <p className="text-sm text-gray-600">Total Follow-ups</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-purple-500">
//           <p className="text-3xl font-bold text-purple-600">{counters.individual}</p>
//           <p className="text-sm text-gray-600">Individual</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-indigo-500">
//           <p className="text-3xl font-bold text-indigo-600">{counters.hospital}</p>
//           <p className="text-sm text-gray-600">Hospital</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-pink-500">
//           <p className="text-3xl font-bold text-pink-600">{counters.hospitalIndividual}</p>
//           <p className="text-sm text-gray-600">Hospital + Individual</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-orange-500">
//           <p className="text-3xl font-bold text-orange-600">{counters.pending}</p>
//           <p className="text-sm text-gray-600">Pending</p>
//         </div>
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-9 gap-3 text-sm items-center">
//           {/* Search Input - Now searches both doctor and hospital */}
//           <input
//             type="text"
//             placeholder="Search doctor or hospital..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 col-span-2"
//           />

//           {/* Doctor Type Filter Dropdown */}
//           <select
//             value={doctorTypeFilter}
//             onChange={(e) => setDoctorTypeFilter(e.target.value)}
//             className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//           >
//             <option value="All">All Types</option>
//             <option value="individual">Individual</option>
//             <option value="hospital">Hospital</option>
//             <option value="hospital + individual">Hospital + Individual</option>
//           </select>

//           {/* Status Filter Dropdown */}
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//           >
//             <option value="All">All Status</option>
//             <option value="Pending">Pending</option>
//             <option value="Completed">Completed</option>
//           </select>

//           {/* From Date */}
//           <DateInput
//             name="fromDate"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             placeholderText="From Date"
//             maxDate={toDate}
//             className="p-2 border rounded-md"
//             wrapperClassName="w-full"
//           />

//           {/* To Date */}
//           <DateInput
//             name="toDate"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             placeholderText="To Date"
//             minDate={fromDate}
//             className="p-2 border rounded-md"
//             wrapperClassName="w-full"
//           />

//           {/* Action Buttons */}
//           <div className="flex gap-2 col-span-2 justify-end">
//             <button 
//               onClick={() => {
//                 setSearch("");
//                 setDoctorTypeFilter("All");
//                 setStatusFilter("All");
//                 setFromDate("");
//                 setToDate("");
//                 setCurrentPage(1);
//               }}
//               className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition"
//             >
//               Reset
//             </button>
//             <button
//               onClick={exportCSV}
//               className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition"
//             >
//               Export CSV
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Pagination Info */}
//       <div className="mb-4 flex justify-between items-center">
//         <div className="text-sm text-gray-600">
//           <span className="font-medium">Total Results:</span> {groupedData.length} doctors, {filteredData.length} follow-ups
//           {doctorTypeFilter !== "All" && ` (Type: ${getDoctorTypeDisplay(doctorTypeFilter)})`}
//           {statusFilter !== "All" && ` (Status: ${statusFilter})`}
//         </div>
//         <div className="text-sm text-gray-600">
//           Page {currentPage} of {totalPages}
//         </div>
//       </div>

//       {/* Master Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-[#f4fffe] text-[#118f84]">
//               <tr>
//                 <th className="px-4 py-3 text-left font-medium">Date</th>
//                 <th className="px-4 py-3 text-left font-medium">Doctor / Hospital</th>
//                 <th className="px-4 py-3 text-left font-medium">Doctor Type</th>
//                 <th className="px-4 py-3 text-left font-medium">Follow-up Note</th>
//                 <th className="px-4 py-3 text-left font-medium">Next Follow-up</th>
//                 <th className="px-4 py-3 text-left font-medium">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {currentGroupedData.map((doctor) => {
//                 // Get the latest follow-up for display in the main row
//                 const latestFollowUp = doctor.followUps && doctor.followUps.length > 0
//                   ? doctor.followUps.reduce((latest, current) => {
//                       const currentDate = new Date(current.date || current.createdAt);
//                       const latestDate = new Date(latest.date || latest.createdAt);
//                       return currentDate > latestDate ? current : latest;
//                     }, doctor.followUps[0])
//                   : null;

//                 const isOpen = expandedDoctor === doctor._id;

//                 return (
//                   <React.Fragment key={doctor._id}>
//                     {/* Main Row */}
//                     <tr
//                       className="hover:bg-gray-50 cursor-pointer transition"
//                       onClick={() => setExpandedDoctor(isOpen ? null : doctor._id)}
//                     >
//                       <td className="px-4 py-3 text-gray-900">{latestFollowUp ? new Date(latestFollowUp.date || latestFollowUp.createdAt).toISOString().split('T')[0] : '-'}</td>
//                       <td className="px-4 py-3">
//                         <div className="font-medium text-gray-900">{doctor.doctorName || doctor.fullName || 'N/A'}</div>
//                         <div className="text-xs text-gray-500">
//                           {doctor.hospitalName || 'N/A'} • {doctor.followUps?.length || 0} follow-ups
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           doctor.doctorType === 'individual' ? 'bg-blue-100 text-blue-800' :
//                           doctor.doctorType === 'hospital' ? 'bg-indigo-100 text-indigo-800' :
//                           'bg-pink-100 text-pink-800'
//                         }`}>
//                           {getDoctorTypeDisplay(doctor.doctorType)}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-gray-700">{latestFollowUp?.notes || latestFollowUp?.followupNote || 'N/A'}</td>
//                       <td className="px-4 py-3 text-gray-700">
//                         {latestFollowUp?.nextFollowUpDate ? new Date(latestFollowUp.nextFollowUpDate).toISOString().split('T')[0] : 'N/A'}
//                       </td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             (latestFollowUp?.nextFollowUpDate && new Date(latestFollowUp.nextFollowUpDate) > new Date()) || doctor.status === "pending"
//                               ? "bg-orange-100 text-orange-800"
//                               : "bg-green-100 text-green-800"
//                           }`}
//                         >
//                           {(latestFollowUp?.nextFollowUpDate && new Date(latestFollowUp.nextFollowUpDate) > new Date()) || doctor.status === "pending" 
//                             ? "Pending" 
//                             : "Completed"}
//                         </span>
//                       </td>
//                     </tr>

//                     {/* Expanded History */}
//                     {isOpen && (
//                       <tr>
//                         <td colSpan="6" className="p-0 bg-gray-50">
//                           <div className="p-6">
//                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                               <div className="flex justify-between items-center mb-4">
//                                 <div>
//                                   <h3 className="text-lg font-bold text-gray-800">{doctor.doctorName || doctor.fullName || 'N/A'}</h3>
//                                   <div className="flex items-center gap-2 mt-1">
//                                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                       doctor.doctorType === 'individual' ? 'bg-blue-100 text-blue-800' :
//                                       doctor.doctorType === 'hospital' ? 'bg-indigo-100 text-indigo-800' :
//                                       'bg-pink-100 text-pink-800'
//                                     }`}>
//                                       {getDoctorTypeDisplay(doctor.doctorType)}
//                                     </span>
//                                     <span className="text-sm text-gray-500">•</span>
//                                     <span className="text-sm text-gray-500">{doctor.hospitalName || 'N/A'}</span>
//                                     <span className="text-sm text-gray-500">•</span>
//                                     <span className="text-sm text-gray-500">{doctor.followUps?.length || 0} follow-ups</span>
//                                   </div>
//                                 </div>
//                                 <div className="flex gap-4">
//                                   <div className="text-center">
//                                     <p className="text-2xl font-bold text-orange-600">
//                                       {doctor.followUps?.filter(fu => new Date(fu.nextFollowUpDate) > new Date()).length || 0}
//                                     </p>
//                                     <p className="text-xs text-gray-500">Pending</p>
//                                   </div>
//                                   <div className="text-center">
//                                     <p className="text-2xl font-bold text-green-600">
//                                       {doctor.followUps?.filter(fu => new Date(fu.nextFollowUpDate) <= new Date() || !fu.nextFollowUpDate).length || 0}
//                                     </p>
//                                     <p className="text-xs text-gray-500">Completed</p>
//                                   </div>
//                                 </div>
//                               </div>
                              
//                               <table className="w-full text-sm">
//                                 <thead className="bg-gray-100 text-[#118f84]">
//                                   <tr>
//                                     <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Date
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Note
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Next Follow-up
//                                     </th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                                       Status
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                   {(doctor.followUps || []).map((followUp) => (
//                                     <tr key={followUp._id || followUp.id} className="hover:bg-gray-50">
//                                       <td className="px-3 py-2 text-gray-900">
//                                         {followUp.date ? new Date(followUp.date).toISOString().split('T')[0] : 
//                                          followUp.createdAt ? new Date(followUp.createdAt).toISOString().split('T')[0] : '-'}
//                                       </td>
//                                       <td className="px-3 py-2 text-gray-700">{followUp.notes || followUp.followupNote || 'N/A'}</td>
//                                       <td className="px-3 py-2 text-gray-700">
//                                         {followUp.nextFollowUpDate ? new Date(followUp.nextFollowUpDate).toISOString().split('T')[0] : 'N/A'}
//                                       </td>
//                                       <td className="px-3 py-2">
//                                         <span
//                                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                             followUp.nextFollowUpDate && new Date(followUp.nextFollowUpDate) > new Date()
//                                               ? "bg-orange-100 text-orange-800"
//                                               : "bg-green-100 text-green-800"
//                                           }`}
//                                         >
//                                           {followUp.nextFollowUpDate && new Date(followUp.nextFollowUpDate) > new Date() 
//                                             ? "Pending" 
//                                             : "Completed"}
//                                         </span>
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                               </table>
//                               <div className="mt-4 text-right">
//                                 <button
//                                   onClick={() => setExpandedDoctor(null)}
//                                   className="text-sm text-teal-600 hover:underline"
//                                 >
//                                   Back to Top
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination Controls */}
//       {groupedData.length > 0 && (
//         <div className="bg-white p-4 rounded-lg shadow">
//           {renderPagination()}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoctorFollowUps;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import DateInput from "../../../components/DateInput/DateInput";

const DoctorFollowUps = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [doctorTypeFilter, setDoctorTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // New status filter
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Helper function to parse dates - useCallback to memoize
  const parseDate = useCallback((dateString) => {
    if (!dateString) return null;
    
    // Check if it's already in dd-mm-yyyy format
    const parts = dateString.split('-');
    if (parts.length === 3) {
      // If first part is 4 digits, it's yyyy-mm-dd
      if (parts[0].length === 4) {
        const [year, month, day] = parts;
        return new Date(year, month - 1, day);
      } 
      // Otherwise it's dd-mm-yyyy
      else if (parts[2].length === 4) {
        const [day, month, year] = parts;
        return new Date(year, month - 1, day);
      }
    }
    
    // Try parsing as ISO string
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }, []);

  // Fetch follow-ups from API using the dedicated follow-ups endpoint
  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        setLoading(true);

        // Use the dedicated follow-ups endpoint that returns doctors with their follow-ups
        const response = await apiClient.get(apiEndpoints.doctors.followUps.all, {
          params: { page: 1, limit: 100000 } // High limit to get all follow-ups in one call
        });

        if (response.data.success) {
          // The API returns doctors with followUps array, so we can use the data directly
          setFollowUps(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch follow-ups');
        }
      } catch (err) {
        console.error('Error fetching follow-ups:', err);
        setError(err.response?.data?.message || 'Error fetching follow-ups');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUps();
  }, []);

  // Fixed filter function - works with the API response structure
  const filteredData = useMemo(() => {
    let data = followUps;

    // Search filter - searches both doctor name and hospital name
    if (search) {
      data = data.filter((r) => {
        return (
          r.doctorName.toLowerCase().includes(search.toLowerCase()) ||
          r.hospitalName.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    // Doctor Type filter
    if (doctorTypeFilter !== "All") {
      data = data.filter((r) => r.doctorType === doctorTypeFilter);
    }

    // Status filter - using the same logic as UI display for consistency
    if (statusFilter !== "All") {
      data = data.filter((r) => {
        // Get the latest follow-up to determine status
        const latestFollowUp = r.followUps && r.followUps.length > 0
          ? r.followUps.reduce((latest, current) => {
              const currentDate = new Date(current.nextFollowUpDate || current.date || current.createdAt);
              const latestDate = new Date(latest.nextFollowUpDate || latest.date || latest.createdAt);
              return currentDate > latestDate ? current : latest;
            }, r.followUps[0])
          : null;
        
        // Determine if the record should be considered "Pending" or "Completed"
        const isPending = (latestFollowUp?.nextFollowUpDate && new Date(latestFollowUp.nextFollowUpDate) > new Date()) || r.status === "pending";
        const shouldBeShown = statusFilter === (isPending ? "Pending" : "Completed");
        
        return shouldBeShown;
      });
    }

    // Date filter - using the top-level nextFollowUpDate field (primary) and follow-ups as secondary
    // Both fromDate and toDate conditions must be satisfied for the same nextFollowUpDate
    if (fromDate || toDate) {
      const fromParsed = fromDate ? parseDate(fromDate) : null;
      const toParsed = toDate ? parseDate(toDate) : null;
      
      // Adjust toParsed to end of day if it exists
      if (toParsed) {
        toParsed.setHours(23, 59, 59, 999);
      }
      
      data = data.filter((r) => {
        // Check top-level nextFollowUpDate first
        if (r.nextFollowUpDate) {
          const topLevelDate = new Date(r.nextFollowUpDate);
          
          // Check if it satisfies both conditions (if they exist)
          let fromDateMatch = !fromParsed || topLevelDate >= fromParsed;
          let toDateMatch = !toParsed || topLevelDate <= toParsed;
          
          if (fromDateMatch && toDateMatch) {
            return true;
          }
        }
        
        // If top-level didn't match, check follow-ups
        if (r.followUps && Array.isArray(r.followUps)) {
          return r.followUps.some(followUp => {
            if (followUp.nextFollowUpDate) {
              const followUpDate = new Date(followUp.nextFollowUpDate);
              
              // Check if it satisfies both conditions (if they exist)
              let fromDateMatch = !fromParsed || followUpDate >= fromParsed;
              let toDateMatch = !toParsed || followUpDate <= toParsed;
              
              return fromDateMatch && toDateMatch;
            }
            return false;
          });
        }
        
        return false; // If no nextFollowUpDate at either level, exclude the doctor
      });
    }

    return data;
  }, [followUps, search, doctorTypeFilter, statusFilter, fromDate, toDate, parseDate]);

  // Use filtered data directly since API returns grouped data (each doctor with their follow-ups)
  const groupedData = filteredData;

  // Pagination calculations for grouped data
  const totalPages = Math.ceil(groupedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGroupedData = groupedData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, doctorTypeFilter, statusFilter, fromDate, toDate]);

  const counters = useMemo(() => {
    const doctors = groupedData.length; // Total number of doctors
    const total = groupedData.reduce((sum, doctor) => sum + (doctor.followUps?.length || 0), 0); // Total follow-ups
    const pending = groupedData.reduce((sum, doctor) => {
      if (doctor.followUps && Array.isArray(doctor.followUps)) {
        return sum + doctor.followUps.filter(fu =>
          fu.nextFollowUpDate && new Date(fu.nextFollowUpDate) > new Date()
        ).length;
      }
      return sum;
    }, 0);
    const completed = total - pending; // Remaining follow-ups are completed
    const individual = groupedData.filter((r) => r.doctorType === 'individual').length;
    const hospital = groupedData.filter((r) => r.doctorType === 'hospital').length;
    const hospitalIndividual = groupedData.filter((r) => r.doctorType === 'hospital + individual').length;

    return { doctors, total, pending, completed, individual, hospital, hospitalIndividual };
  }, [groupedData]);

  const exportCSV = () => {
    const headers = "Date,Doctor,Doctor Type,Hospital,Note,Next Follow-up,Status\n";
    let allFollowUps = [];

    // Flatten all follow-ups from all doctors
    groupedData.forEach(doctor => {
      if (doctor.followUps && Array.isArray(doctor.followUps)) {
        doctor.followUps.forEach(followUp => {
          allFollowUps.push({
            date: followUp.createdAt ? new Date(followUp.createdAt).toISOString().split('T')[0] :
                  followUp.date ? new Date(followUp.date).toISOString().split('T')[0] :
                  followUp.nextFollowUpDate ? new Date(followUp.nextFollowUpDate).toISOString().split('T')[0] : 'N/A',
            doctor: doctor.doctorName || doctor.fullName || 'N/A',
            doctorType: doctor.doctorType || 'N/A',
            hospital: doctor.hospitalName || 'N/A',
            note: followUp.notes || followUp.followupNote || 'N/A',
            nextFollowUp: followUp.nextFollowUpDate ? new Date(followUp.nextFollowUpDate).toISOString().split('T')[0] : 'N/A',
            status: followUp.nextFollowUpDate && new Date(followUp.nextFollowUpDate) > new Date() ? 'Pending' : 'Completed'
          });
        });
      }
    });

    const rows = allFollowUps
      .map((r) => {
        const values = [
          `"${r.date || ''}"`,
          `"${r.doctor || ''}"`,
          `"${r.doctorType || ''}"`,
          `"${r.hospital || ''}"`,
          `"${r.note || ''}"`,
          `"${r.nextFollowUp || ''}"`,
          `"${r.status || ''}"`
        ];
        return values.join(",");
      })
      .join("\n");
    const csv = headers + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `followups_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Get doctor type display name
  const getDoctorTypeDisplay = (type) => {
    switch(type) {
      case 'individual': return 'Individual';
      case 'hospital': return 'Hospital';
      case 'hospital + individual': return 'Hospital + Individual';
      default: return type;
    }
  };

  // Pagination controls
  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, groupedData.length)} of {groupedData.length} doctors
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === number 
                  ? 'bg-[#157a6e] text-white border-[#157a6e]' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#157a6e] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading follow-ups...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen font-sans">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#157a6e] text-white px-4 py-2 rounded hover:bg-[#0f5c55]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Follow-ups — Master View</h1>
        <p className="text-sm text-gray-600">Today: {new Date().toISOString().split('T')[0]}</p>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-teal-500">
          <p className="text-3xl font-bold text-teal-600">{counters.doctors}</p>
          <p className="text-sm text-gray-600">Doctors</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-blue-500">
          <p className="text-3xl font-bold text-blue-600">{counters.total}</p>
          <p className="text-sm text-gray-600">Total Follow-ups</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-purple-500">
          <p className="text-3xl font-bold text-purple-600">{counters.individual}</p>
          <p className="text-sm text-gray-600">Individual</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-indigo-500">
          <p className="text-3xl font-bold text-indigo-600">{counters.hospital}</p>
          <p className="text-sm text-gray-600">Hospital</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-pink-500">
          <p className="text-3xl font-bold text-pink-600">{counters.hospitalIndividual}</p>
          <p className="text-sm text-gray-600">Hospital + Individual</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-orange-500">
          <p className="text-3xl font-bold text-orange-600">{counters.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-9 gap-3 text-sm items-center">
          {/* Search Input - Now searches both doctor and hospital */}
          <input
            type="text"
            placeholder="Search doctor or hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 col-span-2"
          />

          {/* Doctor Type Filter Dropdown */}
          <select
            value={doctorTypeFilter}
            onChange={(e) => setDoctorTypeFilter(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Types</option>
            <option value="individual">Individual</option>
            <option value="hospital">Hospital</option>
            <option value="hospital + individual">Hospital + Individual</option>
          </select>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          {/* From Date */}
          <DateInput
            name="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholderText="From Date"
            maxDate={toDate}
            className="p-2 border rounded-md"
            wrapperClassName="w-full"
          />

          {/* To Date */}
          <DateInput
            name="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholderText="To Date"
            minDate={fromDate}
            className="p-2 border rounded-md"
            wrapperClassName="w-full"
          />

          {/* Action Buttons */}
          <div className="flex gap-2 col-span-2 justify-end">
            <button 
              onClick={() => {
                setSearch("");
                setDoctorTypeFilter("All");
                setStatusFilter("All");
                setFromDate("");
                setToDate("");
                setCurrentPage(1);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition"
            >
              Reset
            </button>
            <button
              onClick={exportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Pagination Info */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Total Results:</span> {groupedData.length} doctors, {filteredData.length} follow-ups
          {doctorTypeFilter !== "All" && ` (Type: ${getDoctorTypeDisplay(doctorTypeFilter)})`}
          {statusFilter !== "All" && ` (Status: ${statusFilter})`}
        </div>
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Master Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f4fffe] text-[#118f84]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Doctor / Hospital</th>
                <th className="px-4 py-3 text-left font-medium">Doctor Type</th>
                <th className="px-4 py-3 text-left font-medium">Follow-up Note</th>
                <th className="px-4 py-3 text-left font-medium">Next Follow-up</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentGroupedData.map((doctor, index) => {
                // Get the latest follow-up for display in the main row
                const latestFollowUp = doctor.followUps && doctor.followUps.length > 0
                  ? doctor.followUps.reduce((latest, current) => {
                      const currentDate = new Date(current.createdAt || current.date || current.nextFollowUpDate);
                      const latestDate = new Date(latest.createdAt || latest.date || latest.nextFollowUpDate);
                      return currentDate > latestDate ? current : latest;
                    }, doctor.followUps[0])
                  : null;

                const isOpen = expandedIndex === index;

                return (
                  <React.Fragment key={doctor._id}>
                    {/* Main Row */}
                    <tr
                      className="hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => setExpandedIndex(isOpen ? null : index)}
                    >
                      <td className="px-4 py-3 text-gray-900">{latestFollowUp ? new Date(latestFollowUp.createdAt || latestFollowUp.date || latestFollowUp.nextFollowUpDate).toISOString().split('T')[0] : '-'}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{doctor.doctorName || doctor.fullName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">
                          {doctor.hospitalName || 'N/A'} • {doctor.followUps?.length || 0} follow-ups
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doctor.doctorType === 'individual' ? 'bg-blue-100 text-blue-800' :
                          doctor.doctorType === 'hospital' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-pink-100 text-pink-800'
                        }`}>
                          {getDoctorTypeDisplay(doctor.doctorType)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{latestFollowUp?.notes || latestFollowUp?.followupNote || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {latestFollowUp?.nextFollowUpDate ? new Date(latestFollowUp.nextFollowUpDate).toISOString().split('T')[0] : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            (latestFollowUp?.nextFollowUpDate && new Date(latestFollowUp.nextFollowUpDate) > new Date()) || doctor.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {(latestFollowUp?.nextFollowUpDate && new Date(latestFollowUp.nextFollowUpDate) > new Date()) || doctor.status === "pending" 
                            ? "Pending" 
                            : "Completed"}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded History */}
                    {isOpen && (
                      <tr>
                        <td colSpan="6" className="p-0 bg-gray-50">
                          <div className="p-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                              <div className="flex justify-between items-center mb-4">
                                <div>
                                  <h3 className="text-lg font-bold text-gray-800">{doctor.doctorName || doctor.fullName || 'N/A'}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      doctor.doctorType === 'individual' ? 'bg-blue-100 text-blue-800' :
                                      doctor.doctorType === 'hospital' ? 'bg-indigo-100 text-indigo-800' :
                                      'bg-pink-100 text-pink-800'
                                    }`}>
                                      {getDoctorTypeDisplay(doctor.doctorType)}
                                    </span>
                                    <span className="text-sm text-gray-500">•</span>
                                    <span className="text-sm text-gray-500">{doctor.hospitalName || 'N/A'}</span>
                                    <span className="text-sm text-gray-500">•</span>
                                    <span className="text-sm text-gray-500">{doctor.followUps?.length || 0} follow-ups</span>
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">
                                      {doctor.followUps?.filter(fu => new Date(fu.nextFollowUpDate) > new Date()).length || 0}
                                    </p>
                                    <p className="text-xs text-gray-500">Pending</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                      {doctor.followUps?.filter(fu => new Date(fu.nextFollowUpDate) <= new Date() || !fu.nextFollowUpDate).length || 0}
                                    </p>
                                    <p className="text-xs text-gray-500">Completed</p>
                                  </div>
                                </div>
                              </div>
                              
                              <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-[#118f84]">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                      Date
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                      Note
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                      Next Follow-up
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {(doctor.followUps || []).map((followUp) => (
                                    <tr key={followUp._id || followUp.id} className="hover:bg-gray-50">
                                      <td className="px-3 py-2 text-gray-900">
                                        {followUp.createdAt ? new Date(followUp.createdAt).toISOString().split('T')[0] :
                                         followUp.date ? new Date(followUp.date).toISOString().split('T')[0] :
                                         followUp.nextFollowUpDate ? new Date(followUp.nextFollowUpDate).toISOString().split('T')[0] : '-'}
                                      </td>
                                      <td className="px-3 py-2 text-gray-700">{followUp.notes || followUp.followupNote || 'N/A'}</td>
                                      <td className="px-3 py-2 text-gray-700">
                                        {followUp.nextFollowUpDate ? new Date(followUp.nextFollowUpDate).toISOString().split('T')[0] : 'N/A'}
                                      </td>
                                      <td className="px-3 py-2">
                                        <span
                                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            followUp.nextFollowUpDate && new Date(followUp.nextFollowUpDate) > new Date()
                                              ? "bg-orange-100 text-orange-800"
                                              : "bg-green-100 text-green-800"
                                          }`}
                                        >
                                          {followUp.nextFollowUpDate && new Date(followUp.nextFollowUpDate) > new Date() 
                                            ? "Pending" 
                                            : "Completed"}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="mt-4 text-right">
                                <button
                                  onClick={() => setExpandedIndex(null)}
                                  className="text-sm text-teal-600 hover:underline"
                                >
                                  Back to Top
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {groupedData.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default DoctorFollowUps;