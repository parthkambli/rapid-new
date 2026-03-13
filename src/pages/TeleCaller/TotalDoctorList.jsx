// import React, { useState, useEffect, useRef, useCallback } from "react";
// import Table from "../../components/mainComponents/Table";
// import { Link, useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../services/apiClient";
// import { useAuth } from "../../hooks/useAuth";

// const TotalDoctorListTele = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   // Get logged in user info for role-based filtering
//   const userId = user?._id;
//   const userRole = user?.role;
//   const [searchByName, setSearchByName] = useState("");
//   const [sortByStatus, setSortByStatus] = useState("All");
//   const [sortByDateTo, setSortByDateTo] = useState("");
//   const [sortByDateFrom, setSortByDateFrom] = useState("");
//   const [sortByMembership, setSortByMembership] = useState("All");
//   const [searchByCity, setSearchByCity] = useState("");
//   const [searchBySpecialty, setSearchBySpecialty] = useState("");
//   const [searchBySalesman, setSearchBySalesman] = useState("");

//   const [fullData, setFullData] = useState([]);  // Pura data
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [newNote, setNewNote] = useState("");
//   const [reminderDateTime, setReminderDateTime] = useState("");
//   const [reminderAlert, setReminderAlert] = useState(true);
//   const [followUpType, setFollowUpType] = useState("call");
//   const [menuOpen, setMenuOpen] = useState(null);
//   const menuRef = useRef(null);
//   const menuButtonRefs = useRef({});

//   // Sirf base fields (7 columns) — Table ko sirf yeh dikhao
//   const tableData = fullData.map(item => ({
//     id: item.id,
//     _id: item._id,
//     date: item.date,
//     drName: item.drName,
//     contact: item.contact,
//     hospitalName: item.hospitalName,
//     city: item.city,
//   }));

//   const handleView = (row) => {
//     setSelectedRow(row);
//     setShowViewModal(true);
//   };

//   const handleAdd = (row) => {
//     setSelectedRow(row);
//     setShowAddModal(true);
//   };

//   const handleSaveNewFollowUp = async () => {
//     if (selectedRow && newNote) {
//       try {
//         setLoading(true);
//         await apiClient.post(apiEndpoints.doctors.followup(selectedRow._id), {
//           date: reminderDateTime || new Date(),
//           type: followUpType || "call",
//           notes: newNote,
//           outcome: "",
//           nextFollowUpDate: reminderDateTime || undefined,
//         });

//         await fetchDoctors();

//         setNewNote("");
//         setReminderDateTime("");
//         setReminderAlert(true);
//         setFollowUpType("call");
//         setShowAddModal(false);
//       } catch (err) {
//         console.error("Error saving follow-up:", err);
//         setError("Failed to save follow-up. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const mapDoctorData = (doctors) => {
//     return doctors.map((doctor) => {
//       const city = doctor.hospitalAddress?.city ||
//         doctor.contactDetails?.currentAddress?.city || "";
//       const specialty = doctor.specialization?.[0] || "";

// // const acceptanceStatus = doctor.acceptanceStatus === "accepted" ? "Accepted" : "Pending";
// const acceptanceStatus = doctor.acceptanceStatus === "accepted"
//     ? "Accepted"
//     : doctor.acceptanceStatus === "rejected"
//     ? "Rejected"
//     : "Pending";


//       const followUps = (doctor.followUps || []).map((fu) => ({
//         note: fu.notes || "",
//         date: fu.date ? new Date(fu.date).toLocaleString() : "",
//         // salesman: fu.createdBy?.fullName?.charAt(0) || "U",

// createdBy: fu.createdBy || { fullName: "Unknown", role: "" }, // ← YE ADD KARO
// salesman: fu.createdBy?.fullName?.charAt(0)?.toUpperCase() || "U", // optional: agar avatar chahiye


//       }));

//       return {
//         id: doctor.doctorId,
//         _id: doctor._id,
//         id: doctor.membershipId || doctor.doctorId || doctor._id,
//         date: doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString("en-GB").replace(/\//g, ".") : "",
//         drName: doctor.fullName || "",
//         contact: doctor.phoneNumber || "",
//         hospitalName: doctor.hospitalName || "",
//         city: city,
//         specialty: specialty,
//         typeOfMembership: doctor.doctorType === "hospital" ? "Hospital" :
//           doctor.doctorType === "individual" ? "Individual" :
//             doctor.doctorType || "Hospital",
//         typeOfEnquires: doctor.typeOfEnquiry ?doctor.doctorStatus :
//           doctor.typeOfEnquiry.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') 
//           ,
//           acceptanceStatus: acceptanceStatus,
//         followUps: followUps,
//       };
//     });
//   };

//   const fetchDoctors = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = {
//         page: 1,
//         limit: 1000,
//       };

//       if (sortByStatus && sortByStatus !== "All" && sortByStatus !== "Sort By Status") {
//         params.typeOfEnquiry = sortByStatus.toLowerCase();
//       }
//       if (sortByMembership && sortByMembership !== "All" && sortByMembership !== "Sort By Membership") {
//         if (sortByMembership === "Hospital") {
//           params.doctorType = "hospital";
//         } else if (sortByMembership === "Individual") {
//           params.doctorType = "individual";
//         } else if (sortByMembership === "Hospital + Individual") {
//           params.doctorType = "hospital_individual";
//         }
//       }
//       if (searchByName) {
//         params.search = searchByName;
//       }

//       const response = await apiClient.get(apiEndpoints.doctors.myDoctors, { params });
//       const doctorsData = response.data.data || response.data || [];
//       const mappedData = mapDoctorData(doctorsData);
//       setFullData(mappedData);
//     } catch (err) {
//       console.error("Error fetching doctors:", err);
//       setError("Failed to load doctors. Please try again.");
//       setFullData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [searchByName, sortByStatus, sortByMembership]);

//   useEffect(() => {
//     fetchDoctors();
//   }, [fetchDoctors]);

//   const handleToggleMenu = (rowId, e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//     setMenuOpen(menuOpen === rowId ? null : rowId);
//   };

//   const handleEdit = async (row) => {
//     try {
//       setMenuOpen(null);
//       const doctorId = row._id || row.id;
//       if (doctorId) {
//         navigate(`/edit-doctor/${doctorId}`);
//       }
//     } catch (err) {
//       console.error("Error navigating to edit:", err);
//       setError("Failed to open edit page. Please try again.");
//     }
//   };



//     const handleViewDetails = async (row) => {
//     try {
//       setMenuOpen(null);
//       const doctorId = row._id || row.id;
//       if (doctorId) {
//         navigate(`/telecaller/view-doctor/${doctorId}`);
//       }
//     } catch (err) {
//       console.error("Error navigating to view details:", err);
//       setError("Failed to open view details page. Please try again.");
//     }
//   };

//   const handleSaveEdit = async () => {
//     if (!editData._id && !editData.id) {
//       setError("Doctor ID is missing. Cannot update.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const doctorId = editData._id || editData.id;

//       const updateData = {
//         fullName: editData.fullName,
//         phoneNumber: editData.phoneNumber,
//         email: editData.email,
//         whatsappNumber: editData.whatsappNumber,
//         hospitalName: editData.hospitalName,
//         typeOfEnquiry: editData.typeOfEnquiry,
//         doctorType: editData.doctorType,
//         specialization: editData.specialization,
//         hospitalAddress: editData.hospitalAddress,
//         contactDetails: editData.contactDetails,
//       };

//       await apiClient.put(apiEndpoints.doctors.update(doctorId), updateData);

//       await fetchDoctors();

//       setShowEditModal(false);
//       setEditData({});
//       setSelectedRow(null);
//     } catch (err) {
//       console.error("Error updating doctor:", err);
//       setError(err.response?.data?.message || "Failed to update doctor. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditInputChange = (field, value) => {
//     setEditData((prev) => {
//       if (field.includes('.')) {
//         const [parent, child] = field.split('.');
//         return {
//           ...prev,
//           [parent]: {
//             ...(prev[parent] || {}),
//             [child]: value,
//           },
//         };
//       }
//       return {
//         ...prev,
//         [field]: value,
//       };
//     });
//   };

//   const handleDelete = (row) => {
//     console.log("Delete", row);
//     setMenuOpen(null);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuOpen !== null) {
//         const clickedElement = event.target;
//         const isMenuButton = Object.values(menuButtonRefs.current).some(ref => ref && ref.contains(clickedElement));
//         const isMenuDropdown = clickedElement.closest('.z-50');

//         if (!isMenuButton && !isMenuDropdown) {
//           setMenuOpen(null);
//         }
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [menuOpen]);

//   // Filter using fullData for extra fields
//   const filteredData = tableData.filter((row) => {
//     const fullRow = fullData.find(f => f._id === row._id);

//     const matchesName = !searchByName || row.drName.toLowerCase().includes(searchByName.toLowerCase());
//     const matchesStatus = !sortByStatus || sortByStatus === "All" || (fullRow?.typeOfEnquires || "").toLowerCase().includes(sortByStatus.toLowerCase());
//     const matchesCity = !searchByCity || row.city.toLowerCase().includes(searchByCity.toLowerCase());
//     const matchesSpecialty = !searchBySpecialty || (fullRow?.specialty || "").toLowerCase().includes(searchBySpecialty.toLowerCase());
//     const matchesMembership = !sortByMembership || sortByMembership === "All" || (fullRow?.typeOfMembership || "") === sortByMembership;

//     return matchesName && matchesStatus && matchesCity && matchesSpecialty && matchesMembership;
//   });

//   const extraColumns = [
//     {
//       header: "Specialty",
//       render: (row, index) => {
//         const fullRow = fullData.find(f => f._id === row._id);
//         return fullRow?.specialty || "";
//       },
//     },
//     {
//       header: "Type Of Membership",
//       render: (row, index) => {
//         const fullRow = fullData.find(f => f._id === row._id);
//         return fullRow?.typeOfMembership || "";
//       },
//     },

// {
//     header: "Status",
//     render: (row) => {
//       const fullRow = fullData.find(f => f._id === row._id);
//       return (
//         // <span className={`font-medium ${fullRow?.acceptanceStatus === "Accepted" ? "text-green-600" : "text-yellow-600"}`}>
//         //   {fullRow?.acceptanceStatus || "Pending"}
//         // {fullRow?.acceptanceStatus=== "Rejected " }
//         // </span>

//  <span
//         className={`font-medium ${
//           fullRow?.acceptanceStatus === "Accepted"
//             ? "text-green-600"
//             : fullRow?.acceptanceStatus === "Rejected"
//             ? "text-red-800"
//             : "text-yellow-600"
//         }`}
//       >
//         {fullRow?.acceptanceStatus || "Pending"}
//       </span>

//       );
//     },
//   },


//     {
//       header: "Type Of Enquires",
//       render: (row, index) => {
//         const fullRow = fullData.find(f => f._id === row._id);
//         return (
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
//             {fullRow?.typeOfEnquires || ""}
//           </div>
//         );
//       },
//     },
//     {
//       header: "Follow Ups",
//       render: (row, index) => {
//         const doctor = fullData.find(f => f._id === row._id);
//         const rowId = doctor?._id || index;
//         return (
//           <div className="flex items-center space-x-2">
//             <button onClick={() => handleView(doctor)} className="bg-green-500 text-white px-2 py-1 rounded text-sm">View</button>
//             <button onClick={() => handleAdd(doctor)} className="bg-green-500 text-white px-2 py-1 rounded text-sm">+</button>
//             <div className="relative">
//               <button
//                 ref={(el) => { if (el) menuButtonRefs.current[rowId] = el; }}
//                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleMenu(rowId, e); }}
//                 className="text-gray-600 hover:text-gray-900 text-sm"
//               >
//                 ...
//               </button>
//               {menuOpen === rowId && (
//                 <div className="absolute right-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-md z-50 min-w-[120px]">
//                   <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleViewDetails(doctor); setMenuOpen(null); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">View Details</button>
//                   <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEdit(doctor); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Edit</button>
//                   {/* <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(doctor); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Delete</button> */}
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       },
//     },
//   ];

//   return (
//     <div className="p-2 min-h-screen bg-white max-w-[79vw]">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl md:text-2xl font-bold">Total Doctor List</h1>
//         <div className="flex space-x-2">
//           <Link to='/telecaller/send-message' className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm">
//             Send Message - Pending
//           </Link>
//           <Link to="/telecaller/dr-followups">
//             <button className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm">
//               View Follow ups
//             </button>
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
//           <option value="All">All</option>
//           <option value="follow_up">Follow Up</option>
//           <option value="hot">Hot (Priority)</option>
//           <option value="closed">Closed (Converted)</option>
//           <option value="cancel">Cancel (Membership Expired)</option>
//           <option value="cold">Cold (Not Interested)</option>
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
//           <option value="All">All</option>
//           <option value="Hospital">Hospital</option>
//           <option value="Individual">Individual</option>
//           <option value="Hospital + Individual">Hospital + Individual</option>
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

//       {loading && (
//         <div className="flex justify-center items-center p-8">
//           <p className="text-gray-500">Loading doctors...</p>
//         </div>
//       )}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
//       {!loading && !error && (
//         <Table data={filteredData} actions={[]} extraColumns={extraColumns} />
//       )}
//       {!loading && !error && filteredData.length === 0 && (
//         <div className="flex justify-center items-center p-8">
//           <p className="text-gray-500">No doctors found.</p>
//         </div>
//       )}

//       {/* View Follow Ups Modal */}
//       {showViewModal && selectedRow && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-4 rounded-md shadow-lg max-w-md w-full">
//             <h2 className="text-lg font-bold mb-2">View Follow ups</h2>
//             <div className="space-y-2 max-h-96 overflow-y-auto">
//               {selectedRow.followUps && selectedRow.followUps.length === 0 ? (
//                 <p className="text-gray-500">No follow ups</p>
//               ) : (
//                 selectedRow.followUps
//                   .filter(followUp => {
//                     // Admin sees all follow-ups, others only see their own
//                     if (userRole === 'admin' || userRole === 'superadmin') {
//                       return true;
//                     } else {
//                       // For non-admin users, only show follow-ups they created
//                       // Check if followUp.createdBy exists and matches current user's ID
//                       if (!followUp.createdBy) {
//                         // If no createdBy info, check if there's a user property that might contain the creator info
//                         // Sometimes the user ID might be stored directly in a different field
//                         return true; // Show if uncertain to avoid hiding data
//                       }
                      
//                       // Compare with logged-in user's ID
//                       return followUp.createdBy._id === userId;
//                     }
//                   })
//                   .map((fu, idx) => (
//                   <div key={idx} className="border-b pb-2">
//                     <p className="font-medium">{fu.note || "No note"}</p>
//                     <p className="text-sm text-gray-500">{fu.date || "No date"}</p>
//                     {/* <p className="text-sm text-gray-500">Salesman: {fu.salesman || "N/A"}</p> */}
//                     <p className="text-sm text-gray-500">Name: {fu.createdBy.fullName || "N/A"}</p>
//                     <p className="text-sm text-gray-500">role: {fu.createdBy.role || "N/A"}</p>
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
//                 <label className="block text-sm font-medium">Follow-up Type</label>
//                 <select
//                   value={followUpType}
//                   onChange={(e) => setFollowUpType(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="call">Call</option>
//                   <option value="visit">Visit</option>
//                   <option value="email">Email</option>
//                   <option value="message">Message</option>
//                 </select>
//               </div>
//               {loading && (
//                 <p className="text-sm text-gray-500">Saving...</p>
//               )}
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

//       {/* Edit Doctor Modal */}
//       {showEditModal && editData && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
//           <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full my-8">
//             <h2 className="text-lg font-bold mb-4">Edit Doctor</h2>
//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                 {error}
//               </div>
//             )}
//             <div className="space-y-4 max-h-[60vh] overflow-y-auto">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Doctor Name</label>
//                 <input
//                   type="text"
//                   value={editData.fullName || ""}
//                   onChange={(e) => handleEditInputChange("fullName", e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Phone Number</label>
//                 <input
//                   type="text"
//                   value={editData.phoneNumber || ""}
//                   onChange={(e) => handleEditInputChange("phoneNumber", e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Email</label>
//                 <input
//                   type="email"
//                   value={editData.email || ""}
//                   onChange={(e) => handleEditInputChange("email", e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
//                 <input
//                   type="text"
//                   value={editData.whatsappNumber || ""}
//                   onChange={(e) => handleEditInputChange("whatsappNumber", e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Hospital Name</label>
//                 <input
//                   type="text"
//                   value={editData.hospitalName || ""}
//                   onChange={(e) => handleEditInputChange("hospitalName", e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Type of Enquiry</label>
//                 <select
//                   value={editData.typeOfEnquiry || "cold"}
//                   onChange={(e) => handleEditInputChange("typeOfEnquiry", e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="follow_up">Follow Up</option>
//                   <option value="hot">Hot (Priority)</option>
//                   <option value="closed">Closed (Converted)</option>
//                   <option value="cancel">Cancel (Membership Expired)</option>
//                   <option value="cold">Cold (Not Interested)</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Doctor Type</label>
//                 <select
//                   value={editData.doctorType || "hospital"}
//                   onChange={(e) => handleEditInputChange("doctorType", e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="hospital">Hospital</option>
//                   <option value="individual">Individual</option>
//                   <option value="hospital_individual">Hospital + Individual</option>
//                 </select>
//               </div>
//               {editData.hospitalAddress && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">City</label>
//                     <input
//                       type="text"
//                       value={editData.hospitalAddress.city || ""}
//                       onChange={(e) => handleEditInputChange("hospitalAddress.city", e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Address</label>
//                     <input
//                       type="text"
//                       value={editData.hospitalAddress.address || ""}
//                       onChange={(e) => handleEditInputChange("hospitalAddress.address", e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                 </>
//               )}
//               {loading && (
//                 <p className="text-sm text-gray-500">Saving changes...</p>
//               )}
//             </div>
//             <div className="flex justify-end mt-6 space-x-2">
//               <button
//                 onClick={handleSaveEdit}
//                 disabled={loading}
//                 className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400"
//               >
//                 {loading ? "Saving..." : "Save Changes"}
//               </button>
//               <button
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setEditData({});
//                   setSelectedRow(null);
//                   setError(null);
//                 }}
//                 disabled={loading}
//                 className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-gray-400"
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

// export default TotalDoctorListTele;





import React, { useState, useEffect, useCallback } from "react";
import Table from "../../components/mainComponents/Table";
import { Link, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../services/apiClient";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

      // Add pagination parameters
      params.page = currentPage;
      params.limit = pageSize;

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
        
        // Update pagination info from backend response
        if (response.data.pagination) {
          setTotalItems(response.data.pagination.total || 0);
          setTotalPages(response.data.pagination.pages || 0);
        }
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
    sortByDateTo,
    currentPage,
    pageSize
  ]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleView = (row) => {
    setSelectedRow(row);
    setShowViewModal(true);
  };

  const handleNavigateView = (row) => {
    navigate(`/telecaller/view-doctor/${row._id}`);
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
    navigate(`/telecaller/edit-doctor/${doctorId}?edit=true`);
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

  // Reset to first page when filters change to avoid "no data" on empty filtered pages
  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [searchByName, sortByStatus, sortByMembership, searchByCity, searchBySpecialty, searchBySalesman, sortByDateFrom, sortByDateTo]);

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
          <Link to="/telecaller/add-doctor" className="bg-teal-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-teal-700">
            Add New Doctor
          </Link>
          <Link to="/telecaller/dr-followups" className="bg-teal-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-teal-700">
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
            serverPagination={true}
            totalServerItems={totalItems}
            currentServerPage={currentPage}
            defaultPageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => setPageSize(size)}
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