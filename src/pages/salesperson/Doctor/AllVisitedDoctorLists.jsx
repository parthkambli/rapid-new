// import React from "react";
// import Table from "../../../components/mainComponents/Table";
// import { useNavigate } from "react-router-dom";

// const AllVisitedDoctorLists = () => {
//   const navigate = useNavigate();

//   const data = [
//     {
//       drName: "Dr. Ram Kumar",
//       hospitalName: "City Hospital",
//       address: "Vasai West",
//       typeOfEnquiries: "Hot",
//       status: "Pending",
//     },
//     {
//       drName: "Dr. Meena Shah",
//       hospitalName: "Apollo Clinic",
//       address: "Borivali East",
//       typeOfEnquiries: "Cold",
//       status: "Completed",
//     },
//   ];

//   const actions = [
//     {
//       label: "View",
//       onClick: (row) => {
//         alert(`Viewing details of ${row.drName}`);
//         // future: open modal with row details
//       },
//     },
//     {
//       label: "Quotation",
//       onClick: (row) => {
//         navigate("/quotation"); // future: navigate to quotation page
//       },
//     },
//       {
//       label: "edit",
//       onClick: (row) => {
//         alert(`Viewing details of ${row.drName}`);
//          navigate("/sales/edit-doctor"); // future: navigate to quotation page
//         // future: open modal with row details
//       },
//     },
//   ];

//   return (
//     <div className="p-6 ">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">
//         All Visited Doctor Lists
//       </h2>
//       <Table data={data} actions={actions} />
//     </div>
//   );
// };

// export default AllVisitedDoctorLists;










// import React, { useState, useEffect, useRef } from "react";
// import Table from "../../../components/mainComponents/Table"; // Assuming the path is correct
// import { Link } from "react-router-dom";

// const TotalDoctorList = () => {
//   const [searchByName, setSearchByName] = useState("");
//   const [sortByStatus, setSortByStatus] = useState("Hot");
//   const [sortByDateTo, setSortByDateTo] = useState("");
//   const [sortByDateFrom, setSortByDateFrom] = useState("");
//   const [sortByMembership, setSortByMembership] = useState("Hospital");
//   const [searchByCity, setSearchByCity] = useState("");
//   const [searchBySpecialty, setSearchBySpecialty] = useState("");
//   const [searchBySalesman, setSearchBySalesman] = useState("");

//   const [data, setData] = useState([
//     {
//       id: 1,
//       date: "12.09.25",
//       drName: "Dr. Ram Kumar",
//       contact: "234884023",
//       hospitalName: "City Hospital",
//       city: "Vasai",
//       specialty: "Dental",
//       typeOfMembership: "Hospital",
//       typeOfEnquires: "Hot",
//       followUps: [
//         { note: "Call to: Raj Sharma", date: "13:00AM 30/09/2025", salesman: "W" },
//         { note: "sdkjabkjafcsfndfcfl impkajfcvpjypvo w:", date: "13:00AM 30/09/2025", salesman: "W" },
//         { note: "fmpkajfcpjypvo w:", date: "13:00AM 30/09/2025", salesman: "W" },
//         { note: "impkajfcpjypvo w:", date: "13:00AM 30/09/2025", salesman: "W" },
//       ],
//     },
//     {
//       id: 2,
//       date: "12.09.25",
//       drName: "Dr. Ram Kumar",
//       contact: "234884023",
//       hospitalName: "City Hospital",
//       city: "Vasai",
//       specialty: "Dental",
//       typeOfMembership: "Hospital",
//       typeOfEnquires: "Hot",
//       followUps: [],
//     },
//     {
//       id: 3,
//       date: "12.09.25",
//       drName: "Dr. Ram Kumar",
//       contact: "234884023",
//       hospitalName: "City Hospital",
//       city: "Vasai",
//       specialty: "Dental",
//       typeOfMembership: "Hospital",
//       typeOfEnquires: "Hot",
//       followUps: [],
//     },
//     {
//       id: 4,
//       date: "12.09.25",
//       drName: "Dr. Ram Kumar",
//       contact: "234884023",
//       hospitalName: "City Hospital",
//       city: "Vasai",
//       specialty: "Dental",
//       typeOfMembership: "Hospital",
//       typeOfEnquires: "Hot",
//       followUps: [],
//     },
//   ]);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [newNote, setNewNote] = useState("");
//   const [reminderDateTime, setReminderDateTime] = useState("");
//   const [reminderAlert, setReminderAlert] = useState(true);
//   const [role, setRole] = useState("Salesman");
//   const [menuOpen, setMenuOpen] = useState(null);
//   const menuRef = useRef(null);

//   const handleView = (row) => {
//     setSelectedRow(row);
//     setShowViewModal(true);
//   };

//   const handleAdd = (row) => {
//     setSelectedRow(row);
//     setShowAddModal(true);
//   };

//   const handleSaveNewFollowUp = () => {
//     if (selectedRow && newNote) {
//       const updatedData = data.map((item) =>
//         item.id === selectedRow.id
//           ? {
//               ...item,
//               followUps: [
//                 ...item.followUps,
//                 { note: newNote, date: reminderDateTime || new Date().toLocaleString(), salesman: role.charAt(0) },
//               ],
//             }
//           : item
//       );
//       setData(updatedData);
//       setNewNote("");
//       setReminderDateTime("");
//       setReminderAlert(true);
//       setRole("Salesman");
//       setShowAddModal(false);
//     }
//   };

//   const handleToggleMenu = (index) => {
//     setMenuOpen(menuOpen === index ? null : index);
//   };

//   const handleEdit = (row) => {
//     console.log("Edit", row);
//     setMenuOpen(null);
//   };

//   const handleDelete = (row) => {
//     console.log("Delete", row);
//     setMenuOpen(null);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const filteredData = data
//     .filter((row) => {
//       return (
//         row.drName.toLowerCase().includes(searchByName.toLowerCase()) &&
//         (sortByStatus === "Hot" ? row.typeOfEnquires === "Hot" : true) &&
//         row.city.toLowerCase().includes(searchByCity.toLowerCase()) &&
//         row.specialty.toLowerCase().includes(searchBySpecialty.toLowerCase()) &&
//         (sortByMembership === "Hospital" ? row.typeOfMembership === "Hospital" : true)
//         // Add more filters as needed, e.g., salesman, date range
//       );
//     })
//     .sort((a, b) => {
//       if (sortByDateFrom && sortByDateTo) {
//         return new Date(a.date) - new Date(b.date); // Adjust date parsing as needed
//       }
//       return 0;
//     });

//   const extraColumns = [
//     {
//       header: "Type Of Membership",
//       render: (row) => row.typeOfMembership,
//     },
//     {
//       header: "Type Of Enquires",
//       render: (row) => (
//         <div className="flex items-center">
//           <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
//           {row.typeOfEnquires}
//         </div>
//       ),
//     },
//     {
//       header: "Follow Ups",
//       render: (row, index) => (
//         <div className="flex items-center space-x-2" ref={menuRef}>
//           <button
//             onClick={() => handleView(row)}
//             className="bg-green-500 text-white px-2 py-1 rounded text-sm"
//           >
//             View
//           </button>
//           <button
//             onClick={() => handleAdd(row)}
//             className="bg-green-500 text-white px-2 py-1 rounded text-sm"
//           >
//             +
//           </button>
//           <div className="relative">
//             <button
//               onClick={() => handleToggleMenu(index)}
//               className="text-gray-600 hover:text-gray-900 text-sm"
//             >
//               ...
//             </button>
//             {menuOpen === index && (
//               <div className="absolute right-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-md z-10">
//                 <button
//                   onClick={() => handleView(row)}
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                 >
//                   View
//                 </button>
//                 <button
//                   onClick={() => handleEdit(row)}
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(row)}
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                 >
//                   Delete
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-2 min-h-screen  bg-white max-w-[79vw]">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl md:text-2xl font-bold">Total Doctor List</h1>
//         <div className="flex space-x-2">
//           <Link to='/admin/send-message' className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm">
//             Send Message
//           </Link>
//           <Link to="/admin/dr-followups">
//           <button className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm">
//             View Follow ups
//           </button>
//           </Link>
//         </div>
//       </div>
//       <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
//         <input
//           type="text"
//           placeholder="Search By Name"
//           value={searchByName}
//           onChange={(e) => setSearchByName(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
//         />
//         <select
//           value={sortByStatus}
//           onChange={(e) => setSortByStatus(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
//         >
//           <option>Sort By Status</option>
//           <option value="Hot">Hot</option>
//           <option value="Cold">Cold</option>
//         </select>
//         <select
//           value={sortByDateTo}
//           onChange={(e) => setSortByDateTo(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
//         >
//           <option>Sort By Date</option>
//           <option>To Date</option>
//         </select>
//         <input
//           type="date"
//           placeholder="From Date"
//           value={sortByDateFrom}
//           onChange={(e) => setSortByDateFrom(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
//         />
//       </div>
//       <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
//         <select
//           value={sortByMembership}
//           onChange={(e) => setSortByMembership(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
//         >
//           <option>Sort By Membership</option>
//           <option value="Hospital">Hospital</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Search By City"
//           value={searchByCity}
//           onChange={(e) => setSearchByCity(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
//         />
//         <input
//           type="text"
//           placeholder="Search By Specialty"
//           value={searchBySpecialty}
//           onChange={(e) => setSearchBySpecialty(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
//         />
//         <input
//           type="text"
//           placeholder="Search By Salesman"
//           value={searchBySalesman}
//           onChange={(e) => setSearchBySalesman(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
//         />
//       </div>
//       <Table data={filteredData} actions={[]} extraColumns={extraColumns} />

//       {/* View Follow Ups Modal */}
//       {showViewModal && selectedRow && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-4 rounded-md shadow-lg max-w-md w-full">
//             <h2 className="text-lg font-bold mb-2">View Follow ups</h2>
//             <div className="space-y-2">
//               {selectedRow.followUps.length === 0 ? (
//                 <p>No follow ups</p>
//               ) : (
//                 selectedRow.followUps.map((fu, idx) => (
//                   <div key={idx} className="border-b pb-2">
//                     <p>{fu.note}</p>
//                     <p className="text-sm text-gray-500">{fu.date}</p>
//                     <p className="text-sm text-gray-500">{fu.salesman}</p>
//                   </div>
//                 ))
//               )}
//             </div>
//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="bg-red-500 text-white px-4 py-2 rounded-md"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add New Follow Up Modal */}
//       {showAddModal && selectedRow && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-4 rounded-md shadow-lg max-w-md w-full">
//             <h2 className="text-lg font-bold mb-2">Add New Follow up</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium">Note</label>
//                 <textarea
//                   value={newNote}
//                   onChange={(e) => setNewNote(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   rows={3}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">Reminder Date & Time</label>
//                 <input
//                   type="datetime-local"
//                   value={reminderDateTime}
//                   onChange={(e) => setReminderDateTime(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="flex items-center">
//                 <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
//                 <label className="text-sm font-medium">Reminder Alert</label>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">Role</label>
//                 <select
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option>Salesman</option>
//                 </select>
//               </div>
//             </div>
//             <div className="flex justify-end mt-4 space-x-2">
//               <button
//                 onClick={handleSaveNewFollowUp}
//                 className="bg-green-500 text-white px-4 py-2 rounded-md"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="bg-red-500 text-white px-4 py-2 rounded-md"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TotalDoctorList;















// import React, { useState } from "react";
// import Table from "../../../pages/Admin/DoctorList/Table";
// import { Link } from "react-router-dom";

// const TotalDoctorList = () => {
//   const [searchByName, setSearchByName] = useState("");
//   const [sortByStatus, setSortByStatus] = useState("All");
//   const [sortByMembership, setSortByMembership] = useState("All");
//   const [searchByCity, setSearchByCity] = useState("");
//   const [searchBySpecialty, setSearchBySpecialty] = useState("");
//   const [searchBySalesman, setSearchBySalesman] = useState("");
//   const [sortByDateFrom, setSortByDateFrom] = useState("");
//   const [sortByDateTo, setSortByDateTo] = useState("");

//   const [data, setData] = useState([
//     {
//       id: 1,
//       date: "12.09.25",
//       drName: "Dr. Ram Kumar",
//       contact: "234884023",
//       hospitalName: "City Hospital",
//       city: "Vasai",
//       specialty: "Dental",
//       typeOfMembership: "Hospital",
//       typeOfEnquires: "Hot",
//       followUps: [
//         { note: "Call to: Raj Sharma", date: "13:00 AM 30/09/2025", salesman: "W" },
//         { note: "Follow up on pricing", date: "14:00 PM 30/09/2025", salesman: "W" },
//       ],
//     },
//     {
//       id: 2,
//       date: "11.09.25",
//       drName: "Dr. Shyam",
//       contact: "987654321",
//       hospitalName: "Apollo",
//       city: "Mumbai",
//       specialty: "Cardio",
//       typeOfMembership: "Individual",
//       typeOfEnquires: "Cold",
//       followUps: [],
//     },
//     {
//       id: 3,
//       date: "10.09.25",
//       drName: "Dr. Priya",
//       contact: "876543210",
//       hospitalName: "Fortis",
//       city: "Pune",
//       specialty: "Neuro",
//       typeOfMembership: "Hospital",
//       typeOfEnquires: "Hot",
//       followUps: [],
//     },
//   ]);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [newNote, setNewNote] = useState("");
//   const [reminderDateTime, setReminderDateTime] = useState("");
//   const [role, setRole] = useState("Salesman");

//   const handleView = (row) => {
//     setSelectedRow(row);
//     setShowViewModal(true);
//   };

//   const handleAdd = (row) => {
//     setSelectedRow(row);
//     setShowAddModal(true);
//   };

//   const handleEdit = (row) => {
//     alert(`Edit Doctor: ${row.drName}`);
//   };

//   const handleDelete = (row) => {
//     if (window.confirm(`Delete ${row.drName}?`)) {
//       setData(data.filter((d) => d.id !== row.id));
//     }
//   };

//   const handleSaveNewFollowUp = () => {
//     if (selectedRow && newNote.trim()) {
//       const newFollowUp = {
//         note: newNote,
//         date: reminderDateTime || new Date().toLocaleString(),
//         salesman: role.charAt(0),
//       };
//       const updatedData = data.map((item) =>
//         item.id === selectedRow.id
//           ? { ...item, followUps: [...item.followUps, newFollowUp] }
//           : item
//       );
//       setData(updatedData);
//       setNewNote("");
//       setReminderDateTime("");
//       setShowAddModal(false);
//     }
//   };

//   const filteredData = data.filter((row) => {
//     const matchesName = row.drName.toLowerCase().includes(searchByName.toLowerCase());
//     const matchesStatus = sortByStatus === "All" || row.typeOfEnquires === sortByStatus;
//     const matchesMembership = sortByMembership === "All" || row.typeOfMembership === sortByMembership;
//     const matchesCity = row.city.toLowerCase().includes(searchByCity.toLowerCase());
//     const matchesSpecialty = row.specialty.toLowerCase().includes(searchBySpecialty.toLowerCase());
//     const matchesSalesman = searchBySalesman === "" || row.followUps.some((f) => f.salesman === searchBySalesman);

//     return matchesName && matchesStatus && matchesMembership && matchesCity && matchesSpecialty && matchesSalesman;
//   });

//   // === extraColumns (for custom rendering) ===
//   const extraColumns = [
//     {
//       header: "Type Of Membership",
//       render: (row) => <span className="font-medium">{row.typeOfMembership}</span>,
//     },
//     {
//       header: "Type Of Enquires",
//       render: (row) => (
//         <div className="flex items-center gap-2">
//           <div
//             className={`w-3 h-3 rounded-full ${
//               row.typeOfEnquires === "Hot" ? "bg-red-500" : row.typeOfEnquires === "Cold" ? "bg-blue-500" : "bg-gray-500"
//             }`}
//           ></div>
//           <span>{row.typeOfEnquires}</span>
//         </div>
//       ),
//     },
//   ];

//   // === actions (for dropdown menu) ===
//   const actions = [
//     {
//       label: "View Follow-ups",
//       onClick: handleView,
//       useDropdown: true,
//     },
//     {
//       label: "Add Follow-up",
//       onClick: handleAdd,
//       useDropdown: true,
//     },
//     {
//       label: "Edit",
//       onClick: handleEdit,
//       useDropdown: true,
//     },
//     {
//       label: "Delete",
//       onClick: handleDelete,
//       useDropdown: true,
//     },
//   ];

//   return (
//     <div className="p-6 max-w-[79vw] bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Total Doctor List</h1>
//         <div className="flex gap-3">
//           <Link
//             to="/admin/send-message"
//             className="bg-teal-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-teal-700 transition"
//           >
//             Send Message
//           </Link>
//           <Link
//             to="/admin/dr-followups"
//             className="bg-teal-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-teal-700 transition"
//           >
//             View Follow ups
//           </Link>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
//         <input
//           type="text"
//           placeholder="Search By Name"
//           value={searchByName}
//           onChange={(e) => setSearchByName(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-teal-500 outline-none"
//         />
//         <select
//           value={sortByStatus}
//           onChange={(e) => setSortByStatus(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-teal-500 outline-none"
//         >
//           <option value="All">All Status</option>
//           <option value="Hot">Hot</option>
//           <option value="Cold">Cold</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Search By City"
//           value={searchByCity}
//           onChange={(e) => setSearchByCity(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-teal-500 outline-none"
//         />
//         <input
//           type="text"
//           placeholder="Search By Specialty"
//           value={searchBySpecialty}
//           onChange={(e) => setSearchBySpecialty(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-teal-500 outline-none"
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
//         <select
//           value={sortByMembership}
//           onChange={(e) => setSortByMembership(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-teal-500 outline-none"
//         >
//           <option value="All">All Membership</option>
//           <option value="Hospital">Hospital</option>
//           <option value="Individual">Individual</option>
//         </select>
//         <input
//           type="date"
//           value={sortByDateFrom}
//           onChange={(e) => setSortByDateFrom(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-teal-500 outline-none"
//         />
//         <input
//           type="date"
//           value={sortByDateTo}
//           onChange={(e) => setSortByDateTo(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-teal-500 outline-none"
//         />
//         <input
//           type="text"
//           placeholder="Search By Salesman"
//           value={searchBySalesman}
//           onChange={(e) => setSearchBySalesman(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-teal-500 outline-none"
//         />
//       </div>

//       {/* Table with your custom Table component */}
//       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//         <Table data={filteredData} extraColumns={extraColumns} actions={actions} />
//       </div>

//       {/* === MODALS (Same as before) === */}
//       {/* View Modal */}
//       {showViewModal && selectedRow && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-96 overflow-y-auto p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Follow-ups</h2>
//             {selectedRow.followUps.length === 0 ? (
//               <p className="text-gray-500 italic">No follow-ups added yet.</p>
//             ) : (
//               <div className="space-y-3">
//                 {selectedRow.followUps.map((fu, i) => (
//                   <div key={i} className="border-b border-gray-200 pb-3 last:border-0">
//                     <p className="font-medium text-gray-800">{fu.note}</p>
//                     <p className="text-sm text-gray-600">{fu.date}</p>
//                     <p className="text-xs text-gray-500">by {fu.salesman === "W" ? "Salesman" : fu.salesman}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <button
//               onClick={() => setShowViewModal(false)}
//               className="mt-5 w-full bg-red-600 text-white py-2.5 rounded-md font-medium hover:bg-red-700 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Add Modal */}
//       {showAddModal && selectedRow && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Follow-up</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
//                 <textarea
//                   value={newNote}
//                   onChange={(e) => setNewNote(e.target.value)}
//                   placeholder="Enter follow-up note..."
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//                   rows="3"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Date & Time</label>
//                 <input
//                   type="datetime-local"
//                   value={reminderDateTime}
//                   onChange={(e) => setReminderDateTime(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//                 <select
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//                 >
//                   <option>Salesman</option>
//                   <option>Manager</option>
//                 </select>
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={handleSaveNewFollowUp}
//                 className="bg-green-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-green-700 transition"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="bg-gray-500 text-white px-5 py-2.5 rounded-md font-medium hover:bg-gray-600 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TotalDoctorList;




















// import React, { useState, useEffect, useCallback } from "react";
// import Table from "../../../components/mainComponents/Table";
// import { Link, useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { toast } from "react-toastify";
// import { useAuth } from "../../../hooks/useAuth";

// const AllVisitedDoctorLists = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [searchByName, setSearchByName] = useState("");
//   const [sortByStatus, setSortByStatus] = useState("All");
//   const [sortByMembership, setSortByMembership] = useState("All");
//   const [searchByCity, setSearchByCity] = useState("");
//   const [searchBySpecialty, setSearchBySpecialty] = useState("");
//   const [searchBySalesman, setSearchBySalesman] = useState("");
//   const [sortByDateFrom, setSortByDateFrom] = useState("");
//   const [sortByDateTo, setSortByDateTo] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [data, setData] = useState([]);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [newNote, setNewNote] = useState("");
//   const [reminderDateTime, setReminderDateTime] = useState("");
//   const [role, setRole] = useState("Salesman");

//   // Fetch doctors assigned to current user (salesman)
//   const fetchDoctors = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = {};
//       if (searchByName) params.q = searchByName;
//       if (sortByStatus && sortByStatus !== "All") params.typeOfEnquiry = sortByStatus.toLowerCase();
//       if (searchByCity) params.city = searchByCity;
//       if (searchBySpecialty) params.specialization = searchBySpecialty;
//       if (sortByDateFrom) params.dateFrom = sortByDateFrom;
//       if (sortByDateTo) params.dateTo = sortByDateTo;
//       if (sortByMembership && sortByMembership !== "All") params.doctorType = sortByMembership.toLowerCase();

//       const response = await apiClient.get(apiEndpoints.doctors.myDoctorss, { params });

//       if (response.data.success) {
//         const mappedData = response.data.data.map(doctor => ({
//           _id: doctor._id,
//           id: doctor.doctorId || doctor._id,
//           date: doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString("en-GB").replace(/\//g, ".") : "",
//           drName: doctor.fullName || "",
//           contact: doctor.phoneNumber || "",
//           hospitalName: doctor.hospitalName || "",
//           city: doctor.hospitalAddress?.city || doctor.contactDetails?.currentAddress?.city || "",
//           specialty: (doctor.specialization && doctor.specialization[0]) || "",
//           typeOfMembership: doctor.doctorType || "Hospital",
//           // typeOfEnquiries: doctor.typeOfEnquiry || "Cold",
//           typeOfEnquiries: doctor.doctorStatus || "Cold",
//           followUps: (doctor.followUps || []).map(fu => ({
//             note: fu.notes || "",
//             date: fu.date ? new Date(fu.date).toLocaleString() : "",
//             salesman: fu.createdBy?.fullName?.charAt(0) || "U"
//           }))
//         }));
//         setData(mappedData);
//       } else {
//         toast.error("Failed to fetch doctors");
//       }
//     } catch (error) {
//       console.error("Error fetching doctors:", error);
//       toast.error("Error fetching doctors: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [searchByName, sortByStatus, searchByCity, searchBySpecialty, sortByDateFrom, sortByDateTo, sortByMembership]);

//   // Fetch data on component mount and when filters change
//   useEffect(() => {
//     fetchDoctors();
//   }, [fetchDoctors]);

//   // Also refetch when filters change (except for search fields that trigger on change)
//   useEffect(() => {
//     fetchDoctors();
//   }, [sortByStatus, sortByMembership, sortByDateFrom, sortByDateTo]);

//   const handleView = (row) => {
//     setSelectedRow(row);
//     setShowViewModal(true);
//   };


// const handleNavigateView = (row) => {
//     navigate(`/sales/view-doctor/${row._id}`); // Navigate to doctor follow-ups page
//   }

//   const handleAdd = (row) => {
//     setSelectedRow(row);
//     setShowAddModal(true);
//   };

//   const handleRevisit = (row) => {
//     navigate(`/sales/revisit-doctor/${row._id}`); // Navigate to doctor detail page
//   };

//   // const handleEdit = (row) => {
//   //   navigate(`/sales/edit-doctor/${row._id}`); // Navigate to doctor edit page
//   // };


// const handleEdit = (row) => {
//     // setMenuOpen(null);
//     const doctorId = row._id || row.id;
//     navigate(`/sales/edit-doctor/${doctorId}?edit=true`);
//   };


//   const handleDelete = async (row) => {
//     if (window.confirm(`Are you sure you want to delete doctor ${row.drName}?`)) {
//       try {
//         await apiClient.delete(apiEndpoints.doctors.delete(row._id));
//         toast.success("Doctor deleted successfully");
//         fetchDoctors(); // Refresh the list
//       } catch (error) {
//         console.error("Error deleting doctor:", error);
//         toast.error("Error deleting doctor: " + error.message);
//       }
//     }
//   };

//   const handleSaveNewFollowUp = async () => {
//     if (selectedRow && newNote.trim()) {
//       try {
//         await apiClient.post(apiEndpoints.doctors.followup(selectedRow._id), {
//           date: reminderDateTime || new Date(),
//           type: "call", // Default follow-up type
//           notes: newNote,
//           outcome: "",
//           nextFollowUpDate: reminderDateTime ? new Date(reminderDateTime) : undefined
//         });

//         toast.success("Follow-up added successfully");
//         setShowAddModal(false);
//         setNewNote("");
//         setReminderDateTime("");
//         fetchDoctors(); // Refresh the data
//       } catch (error) {
//         console.error("Error adding follow-up:", error);
//         toast.error("Error adding follow-up: " + error.message);
//       }
//     }
//   };

//   // Filter the data based on search fields (client-side for now)
//   const filteredData = data.filter((row) => {
//     const matchesName = row.drName.toLowerCase().includes(searchByName.toLowerCase());
//     const matchesStatus = sortByStatus === "All" || row.typeOfEnquiries.toLowerCase() === sortByStatus.toLowerCase();
//     const matchesMembership = sortByMembership === "All" || row.typeOfMembership.toLowerCase() === sortByMembership.toLowerCase();
//     const matchesCity = row.city.toLowerCase().includes(searchByCity.toLowerCase());
//     const matchesSpecialty = row.specialty.toLowerCase().includes(searchBySpecialty.toLowerCase());
//     const matchesSalesman = searchBySalesman === "" || row.followUps.some((f) => f.salesman === searchBySalesman);

//     // Date filters would be handled in the API call, but we can add them here too if needed
//     return matchesName && matchesStatus && matchesMembership && matchesCity && matchesSpecialty && matchesSalesman;
//   });

//   // === extraColumns ===
//   const extraColumns = [
//     {
//       header: "Type Of Membership",
//       render: (row) => <span className="font-medium">{row.typeOfMembership}</span>,
//     },
//     {
//       header: "Type Of Enquiries",
//       render: (row) => (
//         <div className="flex items-center gap-2">
//           <div className={`w-3 h-3 rounded-full ${row.typeOfEnquiries === "Hot" ? "bg-red-500" : "bg-blue-500"}`}></div>
//           <span>{row.typeOfEnquiries}</span>
//         </div>
//       ),
//     },
//     {
//       header: "Follow Ups",
//       render: (row) => (
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handleView(row)}
//             className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700"
//           >
//             View
//           </button>
//           <button
//             onClick={() => handleAdd(row)}
//             className="bg-green-600 text-white w-7 h-7 rounded flex items-center justify-center text-xs font-bold hover:bg-green-700"
//           >
//             +
//           </button>
//         </div>
//       ),
//     },
//   ];

//   // === actions for ... menu ===
//   const actions = [
//     {
//       label: "View",
//       onClick: handleNavigateView,
//       useDropdown: true,
//     },
//     {
//       label: "Edit",
//       onClick: handleEdit,
//       useDropdown: true,
//     },
//     {
//       label: "Re-visit",
//       onClick: handleRevisit,
//       useDropdown: true,
//     },
//     {
//       label: "Delete",
//       onClick: handleDelete,
//       useDropdown: true,
//     },
//   ];

//   return (
//     <div className="p-6 max-w-[79vw] bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">All Visited Doctor List</h1>
//         <div className="flex gap-3">
//           <Link to="/sales/add-doctor" className="bg-teal-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-teal-700">
//             Add New Doctor
//           </Link>
//           <Link to="/sales/dr-followups" className="bg-teal-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-teal-700">
//             View Follow ups
//           </Link>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
//         <input
//           type="text"
//           placeholder="Search By Name"
//           value={searchByName}
//           onChange={(e) => setSearchByName(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white"
//         />
//         <select
//           value={sortByStatus}
//           onChange={(e) => setSortByStatus(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white"
//         >
//           <option value="All">Sort by Status</option>
//           <option value="Hot">Hot</option>
//           <option value="Cold">Cold</option>
//           <option value="Warm">Warm</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Search By City"
//           value={searchByCity}
//           onChange={(e) => setSearchByCity(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white"
//         />
//         <input
//           type="text"
//           placeholder="Search By Specialty"
//           value={searchBySpecialty}
//           onChange={(e) => setSearchBySpecialty(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white"
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
//         <select
//           value={sortByMembership}
//           onChange={(e) => setSortByMembership(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white"
//         >
//           <option value="All">Sort by Membership</option>
//           <option value="Hospital">Hospital</option>
//           <option value="Individual">Individual</option>
//         </select>
//         <input
//           type="date"
//           placeholder="To Date"
//           value={sortByDateTo}
//           onChange={(e) => setSortByDateTo(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white"
//         />
//         <input
//           type="date"
//           placeholder="From Date"
//           value={sortByDateFrom}
//           onChange={(e) => setSortByDateFrom(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white"
//         />
//         <input
//           type="text"
//           placeholder="Search By Salesman"
//           value={searchBySalesman}
//           onChange={(e) => setSearchBySalesman(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md bg-white"
//         />
//       </div>

//       {/* Loading Indicator */}
//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
//           <span className="ml-3 text-gray-600">Loading doctors...</span>
//         </div>
//       )}

//       {/* Table */}
//       {!loading && (
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <Table data={filteredData} extraColumns={extraColumns} actions={actions}

//             excludeColumns={["typeOfMembership", "typeOfEnquiries"]}
//             pagination={true} 
//           />
//         </div>
//       )}

//       {/* === MODALS === */}
//       {showViewModal && selectedRow && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-96 overflow-y-auto p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Follow-ups</h2>
//             {selectedRow.followUps.length === 0 ? (
//               <p className="text-gray-500 italic">No follow-ups added yet.</p>
//             ) : (
//               <div className="space-y-3">
//                 {selectedRow.followUps.map((fu, i) => (
//                   <div key={i} className="border-b border-gray-200 pb-3 last:border-0">
//                     <p className="font-medium text-gray-800">{fu.note}</p>
//                     <p className="text-sm text-gray-600">{fu.date}</p>
//                     <p className="text-xs text-gray-500">by {fu.salesman === "W" ? "Salesman" : fu.salesman}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <button
//               onClick={() => setShowViewModal(false)}
//               className="mt-5 w-full bg-red-600 text-white py-2.5 rounded-md font-medium hover:bg-red-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {showAddModal && selectedRow && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Follow-up</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
//                 <textarea
//                   value={newNote}
//                   onChange={(e) => setNewNote(e.target.value)}
//                   placeholder="Enter follow-up note..."
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
//                   rows="3"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Date & Time</label>
//                 <input
//                   type="datetime-local"
//                   value={reminderDateTime}
//                   onChange={(e) => setReminderDateTime(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//                 <select
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md"
//                 >
//                   <option>Salesman</option>
//                   <option>Manager</option>
//                 </select>
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={handleSaveNewFollowUp}
//                 className="bg-green-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-green-700"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="bg-gray-500 text-white px-5 py-2.5 rounded-md font-medium hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllVisitedDoctorLists;




import React, { useState, useEffect, useCallback } from "react";
import Table from "../../../components/mainComponents/Table";
import { Link, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";

const AllVisitedDoctorLists = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchByName, setSearchByName] = useState("");
  const [sortByStatus, setSortByStatus] = useState("All");
  const [sortByMembership, setSortByMembership] = useState("All");
  const [searchByCity, setSearchByCity] = useState("");
  const [searchBySpecialty, setSearchBySpecialty] = useState("");
  const [searchBySalesman, setSearchBySalesman] = useState("");
  const [sortByDateFrom, setSortByDateFrom] = useState("");
  const [sortByDateTo, setSortByDateTo] = useState("");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [reminderDateTime, setReminderDateTime] = useState("");
  const [role, setRole] = useState("Salesman");
  
  // Get logged in user info for role-based filtering
  const userId = user?._id;
  const userRole = user?.role;
  
  // Debugging logs
  console.log("Current user:", user);
  console.log("Current user ID:", userId);
  console.log("Current user role:", userRole);


 const  handleResetFilters = () => {
    setSearchByName("");
    setSortByStatus("All");
    setSortByMembership("All");
    setSearchByCity("");
    setSearchBySpecialty("");
    setSearchBySalesman("");
    setSortByDateFrom("");
    setSortByDateTo("");
  }


  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};

      if (searchByName.trim()) params.q = searchByName.trim();
      if (sortByStatus && sortByStatus !== "All") params.typeOfEnquiry = sortByStatus.toLowerCase();
      if (searchByCity.trim()) params.city = searchByCity.trim();
      if (searchBySpecialty.trim()) params.specialization = searchBySpecialty.trim();
      if (sortByMembership && sortByMembership !== "All") params.doctorType = sortByMembership.toLowerCase();

      // Still send dates to backend (in case it supports it later)
      if (sortByDateFrom) params.dateFrom = sortByDateFrom;
      if (sortByDateTo) params.dateTo = sortByDateTo;

      const response = await apiClient.get(apiEndpoints.doctors.myDoctorss, { params });

      if (response.data.success) {
        const mappedData = response.data.data.map(doctor => ({
          _id: doctor._id,
          id: doctor.doctorId || doctor._id,
          // Keep original createdAt for accurate date parsing
          createdAt: doctor.createdAt ? new Date(doctor.createdAt) : null,
          date: doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString("en-GB").replace(/\//g, ".") : "",
          drName: doctor.fullName || "",
          contact: doctor.phoneNumber || "",
          hospitalName: doctor.hospitalName || "",
          city: doctor.hospitalAddress?.city || doctor.contactDetails?.currentAddress?.city || "",
          specialty: (doctor.specialization && doctor.specialization[0]) || "",
          typeOfMembership: doctor.doctorType || "Hospital",
          typeOfEnquiries: doctor.doctorStatus || "Cold",
          followUps: (doctor.followUps || []).map(fu => ({
            note: fu.notes || "",
            date: fu.date ? new Date(fu.date).toLocaleString() : "",
            salesman: fu.createdBy?.fullName?.charAt(0).toUpperCase() || "U",
            createdBy: fu.createdBy?._id || null  // Add the created by ID for filtering
          }))
        }));
        setData(mappedData);
      } else {
        toast.error("Failed to fetch doctors");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Error fetching doctors: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, [
    searchByName,
    sortByStatus,
    searchByCity,
    searchBySpecialty,
    sortByMembership,
    sortByDateFrom,
    sortByDateTo
  ]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleView = (row) => {
    setSelectedRow(row);
    setShowViewModal(true);
  };

  const handleNavigateView = (row) => {
    navigate(`/sales/view-doctor/${row._id}`);
  };

  const handleAdd = (row) => {
    setSelectedRow(row);
    setShowAddModal(true);
  };

  const handleRevisit = (row) => {
    navigate(`/sales/revisit-doctor/${row._id}`);
  };

  const handleEdit = (row) => {
    const doctorId = row._id || row.id;
    navigate(`/sales/edit-doctor/${doctorId}?edit=true`);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete doctor ${row.drName}?`)) {
      try {
        await apiClient.delete(apiEndpoints.doctors.delete(row._id));
        toast.success("Doctor deleted successfully");
        fetchDoctors();
      } catch (error) {
        console.error("Error deleting doctor:", error);
        toast.error("Error deleting doctor: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleSaveNewFollowUp = async () => {
    if (selectedRow && newNote.trim()) {
      try {
        await apiClient.post(apiEndpoints.doctors.followup(selectedRow._id), {
          date: reminderDateTime || new Date(),
          type: "call",
          notes: newNote,
          outcome: "",
          nextFollowUpDate: reminderDateTime ? new Date(reminderDateTime) : undefined
        });

        toast.success("Follow-up added successfully");
        setShowAddModal(false);
        setNewNote("");
        setReminderDateTime("");
        fetchDoctors();
      } catch (error) {
        console.error("Error adding follow-up:", error);
        toast.error("Error adding follow-up: " + (error.response?.data?.message || error.message));
      }
    }
  };

  // === Client-side filtering (including robust date range) ===
  const filteredData = data.filter((row) => {
    // Name
    if (searchByName && !row.drName.toLowerCase().includes(searchByName.toLowerCase())) return false;

    // Status
    if (sortByStatus !== "All" && row.typeOfEnquiries.toLowerCase() !== sortByStatus.toLowerCase()) return false;

    // Membership
    if (sortByMembership !== "All" && row.typeOfMembership.toLowerCase() !== sortByMembership.toLowerCase()) return false;

    // City
    if (searchByCity && !row.city.toLowerCase().includes(searchByCity.toLowerCase())) return false;

    // Specialty
    if (searchBySpecialty && !row.specialty.toLowerCase().includes(searchBySpecialty.toLowerCase())) return false;

    // Salesman (initial letter search)
    if (searchBySalesman) {
      const matchesSalesman = row.followUps.some(fu =>
        fu.salesman.toLowerCase().includes(searchBySalesman.toLowerCase())
      );
      if (!matchesSalesman) return false;
    }

    // === DATE RANGE FILTER (Client-side) ===
    if (row.createdAt) {
      const doctorDate = row.createdAt;

      if (sortByDateFrom) {
        const fromDate = new Date(sortByDateFrom);
        fromDate.setHours(0, 0, 0, 0); // Start of day
        if (doctorDate < fromDate) return false;
      }

      if (sortByDateTo) {
        const toDate = new Date(sortByDateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        if (doctorDate > toDate) return false;
      }
    } else if (sortByDateFrom || sortByDateTo) {
      // If no createdAt but date filter applied → exclude
      return false;
    }

    return true;
  });

  const extraColumns = [
    {
      header: "Type Of Membership",
      render: (row) => <span className="font-medium">{row.typeOfMembership}</span>,
    },
    {
      header: "Type Of Enquiries",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${row.typeOfEnquiries === "Hot" ? "bg-red-500" : "bg-blue-500"}`}></div>
          <span>{row.typeOfEnquiries}</span>
        </div>
      ),
    },
    {
      header: "Follow Ups",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(row)}
            className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700"
          >
            View
          </button>
          <button
            onClick={() => handleAdd(row)}
            className="bg-green-600 text-white w-7 h-7 rounded flex items-center justify-center text-xs font-bold hover:bg-green-700"
          >
            +
          </button>
        </div>
      ),
    },
  ];

  const actions = [
    { label: "View", onClick: handleNavigateView, useDropdown: true },
    { label: "Edit", onClick: handleEdit, useDropdown: true },
    // { label: "Re-visit", onClick: handleRevisit, useDropdown: true },
    // { label: "Delete", onClick: handleDelete, useDropdown: true },
  ];

  return (
    <div className="p-6 max-w-[79vw] bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Visited Doctor List</h1>
        <div className="flex gap-3">
          <Link to="/sales/add-doctor" className="bg-teal-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-teal-700">
            Add New Doctor
          </Link>
          <Link to="/sales/dr-followups" className="bg-teal-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-teal-700">
            View Follow ups
          </Link>
        </div>
      </div>

      {/* Filters Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <input
          type="text"
          placeholder="Search By Name"
          value={searchByName}
          onChange={(e) => setSearchByName(e.target.value)}
          className="p-3 border border-gray-300 rounded-md bg-white"
        />
        <select
          value={sortByStatus}
          onChange={(e) => setSortByStatus(e.target.value)}
          className="p-3 border border-gray-300 rounded-md bg-white"
        >
          <option value="All">Sort by Status</option>
          <option value="Cold">Cold</option>
          <option value="Hot">Hot</option>
          <option value="Close">Close</option>
          <option value="followup">Followup</option>
          <option value="cancel">Cancel</option>
        </select>
        <input
          type="text"
          placeholder="Search By City"
          value={searchByCity}
          onChange={(e) => setSearchByCity(e.target.value)}
          className="p-3 border border-gray-300 rounded-md bg-white"
        />
        <input
          type="text"
          placeholder="Search By Specialty"
          value={searchBySpecialty}
          onChange={(e) => setSearchBySpecialty(e.target.value)}
          className="p-3 border border-gray-300 rounded-md bg-white"
        />
      </div>

      {/* Filters Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <select
          value={sortByMembership}
          onChange={(e) => setSortByMembership(e.target.value)}
          className="p-3 border border-gray-300 rounded-md bg-white"
        >
          <option value="All">Sort by Membership</option>
          <option value="Hospital">Hospital</option>
          <option value="Individual">Individual</option>
          <option value="hospital_individual">Hospital + Individual</option>
        </select>
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">From Date</label>
          <input
            type="date"
            value={sortByDateFrom}
            onChange={(e) => setSortByDateFrom(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md bg-white"
          />
        </div>
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600">To Date</label>
          <input
            type="date"
            value={sortByDateTo}
            onChange={(e) => setSortByDateTo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md bg-white"
          />
        </div>
      <button type="reset" onClick={handleResetFilters} className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600">
        Reset Filters
      </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-gray-600">Loading doctors...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table
            data={filteredData}
            extraColumns={extraColumns}
            actions={actions}
            excludeColumns={["typeOfMembership", "typeOfEnquiries", "createdAt"]}
            pagination={true}
          />
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-96 overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Follow-ups</h2>
            {selectedRow.followUps.length === 0 ? (
              <p className="text-gray-500 italic">No follow-ups added yet.</p>
            ) : (
              <div className="space-y-3">
                {selectedRow.followUps
                  .filter(followUp => {
                    // Admin sees all follow-ups, others only see their own
                    if (userRole === 'admin' || userRole === 'superadmin') {
                      return true;
                    } else {
                      // For non-admin users, only show follow-ups they created
                      // Check if followUp.createdBy exists and matches current user's ID
                      if (!followUp.createdBy) {
                        // If no createdBy info, check if there's a user property that might contain the creator info
                        // Sometimes the user ID might be stored directly in a different field
                        console.log("No createdBy info for follow-up:", followUp);
                        return true; // Show if uncertain to avoid hiding data
                      }
                      
                      // Compare with logged-in user's ID - check both direct ID and nested _id
                      const matches = followUp.createdBy === userId || followUp.createdBy._id === userId;
                      console.log("Follow-up filter check:", {
                        followUpCreatedBy: followUp.createdBy,
                        userId: userId,
                        matches: matches
                      });
                      return matches;
                    }
                  })
                  .map((fu, i) => (
                  <div key={i} className="border-b border-gray-200 pb-3 last:border-0">
                    <p className="font-medium text-gray-800">{fu.note}</p>
                    <p className="text-sm text-gray-600">{fu.date}</p>
                    <p className="text-xs text-gray-500">by {fu.salesman}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowViewModal(false)}
              className="mt-5 w-full bg-red-600 text-white py-2.5 rounded-md font-medium hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Follow-up Modal */}
      {showAddModal && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Follow-up</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter follow-up note..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Date & Time</label>
                <input
                  type="datetime-local"
                  value={reminderDateTime}
                  onChange={(e) => setReminderDateTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option>Salesman</option>
                  <option>Manager</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleSaveNewFollowUp}
                className="bg-green-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewNote("");
                  setReminderDateTime("");
                }}
                className="bg-gray-500 text-white px-5 py-2.5 rounded-md font-medium hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllVisitedDoctorLists;