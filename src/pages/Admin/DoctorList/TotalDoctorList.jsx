


// import React, { useState, useEffect, useRef, useCallback } from "react";
// import Table from "./Table";
// import { Link, useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { CSVLink } from "react-csv";
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { FiFilter, FiX, FiDownload, FiEye, FiEdit, FiTrash2, FiCalendar, FiUser, FiMapPin, FiBriefcase, FiUsers, FiMessageSquare, FiRefreshCw } from "react-icons/fi";

// const TotalDoctorList = () => {
//   const navigate = useNavigate();
//   const [searchByName, setSearchByName] = useState("");
//   const [sortByStatus, setSortByStatus] = useState("All");
//   const [sortByDateTo, setSortByDateTo] = useState("");
//   const [sortByDateFrom, setSortByDateFrom] = useState("");
//   const [sortByMembership, setSortByMembership] = useState("All");
//   const [searchByCity, setSearchByCity] = useState("");
//   const [searchBySpecialty, setSearchBySpecialty] = useState("");
//   const [searchBySalesman, setSearchBySalesman] = useState("");
//   const [showFilters, setShowFilters] = useState(false);

//   const [fullData, setFullData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [exportData, setExportData] = useState([]);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportFormat, setExportFormat] = useState("csv");
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [activeFiltersCount, setActiveFiltersCount] = useState(0);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [newNote, setNewNote] = useState("");
//   const [reminderDateTime, setReminderDateTime] = useState("");
//   const [reminderAlert, setReminderAlert] = useState(true);
//   const [followUpType, setFollowUpType] = useState("call");
//   const [menuOpen, setMenuOpen] = useState(null);
//   const menuRef = useRef(null);
//   const menuButtonRefs = useRef({});
//   const csvLinkRef = useRef();

//   // Calculate active filters
//   useEffect(() => {
//     let count = 0;
//     if (searchByName) count++;
//     if (sortByStatus !== "All") count++;
//     if (sortByMembership !== "All") count++;
//     if (searchByCity) count++;
//     if (searchBySpecialty) count++;
//     if (searchBySalesman) count++;
//     if (sortByDateFrom || sortByDateTo) count++;
//     setActiveFiltersCount(count);
//   }, [searchByName, sortByStatus, sortByMembership, searchByCity, searchBySpecialty, searchBySalesman, sortByDateFrom, sortByDateTo]);

//   // Table data for display
//   const tableData = filteredData.map(item => ({
//     id: item.id,
//     _id: item._id,
//     date: item.date,
//     drName: item.drName,
//     contact: item.contact,
//     hospitalName: item.hospitalName,
//     city: item.city,
//     specialty: item.specialty,
//     typeOfMembership: item.typeOfMembership,
//     typeOfEnquires: item.typeOfEnquires,
//     followUps: item.followUps
//   }));

//   // Enhanced filter function
//   const applyFilters = useCallback(() => {
//     let result = [...fullData];

//     // Search by name
//     if (searchByName.trim()) {
//       result = result.filter(item => 
//         item.drName?.toLowerCase().includes(searchByName.toLowerCase()) ||
//         item.hospitalName?.toLowerCase().includes(searchByName.toLowerCase())
//       );
//     }

//     // Filter by status
//     if (sortByStatus && sortByStatus !== "All") {
//       result = result.filter(item => 
//         item.typeOfEnquires?.toLowerCase().includes(sortByStatus.toLowerCase())
//       );
//     }

//     // Filter by membership type
//     if (sortByMembership && sortByMembership !== "All") {
//       result = result.filter(item => 
//         item.typeOfMembership === sortByMembership
//       );
//     }

//     // Filter by city
//     if (searchByCity.trim()) {
//       result = result.filter(item => 
//         item.city?.toLowerCase().includes(searchByCity.toLowerCase())
//       );
//     }

//     // Filter by specialty
//     if (searchBySpecialty.trim()) {
//       result = result.filter(item => 
//         item.specialty?.toLowerCase().includes(searchBySpecialty.toLowerCase())
//       );
//     }

//     // Filter by salesman
//     if (searchBySalesman.trim()) {
//       result = result.filter(item => 
//         item.salesmanName?.toLowerCase().includes(searchBySalesman.toLowerCase()) ||
//         item.createdBy?.toLowerCase().includes(searchBySalesman.toLowerCase())
//       );
//     }

//     // Date range filtering
//     if (sortByDateFrom || sortByDateTo) {
//       result = result.filter(item => {
//         const itemDate = new Date(item.createdAt || item.date);

//         if (sortByDateFrom && sortByDateTo) {
//           const fromDate = new Date(sortByDateFrom);
//           const toDate = new Date(sortByDateTo);
//           toDate.setHours(23, 59, 59, 999);
//           return itemDate >= fromDate && itemDate <= toDate;
//         }

//         if (sortByDateFrom) {
//           const fromDate = new Date(sortByDateFrom);
//           return itemDate >= fromDate;
//         }

//         if (sortByDateTo) {
//           const toDate = new Date(sortByDateTo);
//           toDate.setHours(23, 59, 59, 999);
//           return itemDate <= toDate;
//         }

//         return true;
//       });
//     }

//     setFilteredData(result);
//   }, [fullData, searchByName, sortByStatus, sortByMembership, searchByCity, searchBySpecialty, searchBySalesman, sortByDateFrom, sortByDateTo]);

//   // Prepare export data
//   const prepareExportData = () => {
//     const dataToExport = filteredData.map(item => ({
//       'Doctor ID': item.id,
//       'Date': item.date,
//       'Doctor Name': item.drName,
//       'Contact': item.contact,
//       'Hospital Name': item.hospitalName,
//       'City': item.city,
//       'Specialty': item.specialty,
//       'Membership Type': item.typeOfMembership,
//       'Enquiry Type': item.typeOfEnquires,
//       'Follow-ups Count': item.followUps?.length || 0,
//       'Last Follow-up': item.followUps?.[0]?.date || 'N/A',
//       'Created At': item.createdAt || 'N/A'
//     }));

//     setExportData(dataToExport);
//     return dataToExport;
//   };

//   // Export functions
//   const handleExportCSV = () => {
//     const data = prepareExportData();
//     setIsExporting(true);
//     setTimeout(() => {
//       csvLinkRef.current.link.click();
//       setIsExporting(false);
//       setShowExportModal(false);
//     }, 500);
//   };

//   const handleExportExcel = () => {
//     const data = prepareExportData();
//     setIsExporting(true);

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Doctors");

//     const wscols = [
//       {wch: 10}, {wch: 12}, {wch: 25}, {wch: 15}, {wch: 25},
//       {wch: 15}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 5},
//       {wch: 20}, {wch: 20},
//     ];
//     ws['!cols'] = wscols;

//     XLSX.writeFile(wb, `Doctors_List_${new Date().toISOString().split('T')[0]}.xlsx`);
//     setIsExporting(false);
//     setShowExportModal(false);
//   };

//   const handleExportPDF = () => {
//     const data = prepareExportData();
//     setIsExporting(true);

//     const doc = new jsPDF('landscape');
//     const tableColumn = Object.keys(data[0] || {});
//     const tableRows = data.map(item => Object.values(item));

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       theme: 'grid',
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [41, 128, 185] },
//       margin: { top: 20 },
//       didDrawPage: function (data) {
//         doc.setFontSize(16);
//         doc.text('Doctors List Report', 14, 10);
//         doc.setFontSize(10);
//         doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 18);
//       }
//     });

//     doc.save(`Doctors_List_${new Date().toISOString().split('T')[0]}.pdf`);
//     setIsExporting(false);
//     setShowExportModal(false);
//   };

//   // Reset all filters
//   const handleResetFilters = () => {
//     setSearchByName("");
//     setSortByStatus("All");
//     setSortByDateTo("");
//     setSortByDateFrom("");
//     setSortByMembership("All");
//     setSearchByCity("");
//     setSearchBySpecialty("");
//     setSearchBySalesman("");
//   };

//   // View Follow Ups
//   const handleViewFollowUps = (row) => {
//     setSelectedRow(row);
//     setShowViewModal(true);
//   };

//   // View Doctor Details
//   const handleViewDoctor = (row) => {
//     const doctorId = row._id || row.id;
//     navigate(`/view-doctor/${doctorId}`);
//   };

//   // Add Follow Up
//   const handleAdd = (row) => {
//     setSelectedRow(row);
//     setNewNote("");
//     setReminderDateTime("");
//     setFollowUpType("call");
//     setShowAddModal(true);
//   };

//   // Save Follow Up
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
//         setShowAddModal(false);
//       } catch (err) {
//         console.error("Error saving follow-up:", err);
//         setError("Failed to save follow-up. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // Map API data
//   const mapDoctorData = (doctors) => {
//     return doctors.map((doctor) => {
//       const city = doctor.hospitalAddress?.city ||
//                    doctor.contactDetails?.currentAddress?.city || "";
//       const specialty = doctor.specialization?.[0] || "";
//       const followUps = (doctor.followUps || []).map((fu) => ({
//         note: fu.notes || "",
//         date: fu.date ? new Date(fu.date).toLocaleString() : "",
//         salesman: fu.createdBy?.fullName?.charAt(0) || "U",
//       }));

//       return {
//         id: doctor.doctorId,
//         _id: doctor._id,
//         date: doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString("en-GB").replace(/\//g, ".") : "",
//         drName: doctor.fullName || "",
//         contact: doctor.phoneNumber || "",
//         hospitalName: doctor.hospitalName || "",
//         city: city,
//         specialty: specialty,
//         typeOfMembership: doctor.doctorType === "hospital" ? "Hospital" :
//                          doctor.doctorType === "individual" ? "Individual" :
//                          doctor.doctorType || "Hospital",
//         typeOfEnquires: doctor.typeOfEnquiry ?
//                        doctor.typeOfEnquiry.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') :
//                        "Cold",
//         followUps: followUps,
//         createdAt: doctor.createdAt,
//         salesmanName: doctor.createdBy?.fullName || "Unknown",
//       };
//     });
//   };

//   // Fetch doctors
//   const fetchDoctors = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = {
//         page: 1,
//         limit: 1000,
//       };

//       if (sortByStatus && sortByStatus !== "All") {
//         params.typeOfEnquiry = sortByStatus.toLowerCase();
//       }
//       if (sortByMembership && sortByMembership !== "All") {
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

//       const response = await apiClient.get(apiEndpoints.doctors.list, { params });
//       const doctorsData = response.data.data || response.data || [];
//       const mappedData = mapDoctorData(doctorsData);
//       setFullData(mappedData);
//       setFilteredData(mappedData);
//     } catch (err) {
//       console.error("Error fetching doctors:", err);
//       setError("Failed to load doctors. Please try again.");
//       setFullData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [searchByName, sortByStatus, sortByMembership]);

//   useEffect(() => {
//     fetchDoctors();
//   }, [fetchDoctors]);

//   // Apply filters when filter values change
//   useEffect(() => {
//     applyFilters();
//   }, [applyFilters]);

//   // Toggle menu
//   const handleToggleMenu = (rowId, e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//     setMenuOpen(menuOpen === rowId ? null : rowId);
//   };

//   // Edit doctor
//   const handleEdit = (row) => {
//     setMenuOpen(null);
//     const doctorId = row._id || row.id;
//     navigate(`/view-doctor/${doctorId}?edit=true`);
//   };

//   // Delete doctor
//   const handleDelete = async (row) => {
//     if (window.confirm(`Are you sure you want to delete ${row.drName}?`)) {
//       try {
//         setLoading(true);
//         await apiClient.delete(apiEndpoints.doctors.delete(row._id));
//         await fetchDoctors();
//       } catch (err) {
//         console.error("Error deleting doctor:", err);
//         setError("Failed to delete doctor. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     setMenuOpen(null);
//   };

//   // Click outside menu handler
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

//   // Extra columns for table
//   const extraColumns = [
//     {
//       header: "Specialty",
//       render: (row) => (
//         <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
//           {row.specialty || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Membership",
//       render: (row) => (
//         <span className={`px-2 py-1 rounded text-xs ${
//           row.typeOfMembership === "Hospital" ? "bg-purple-50 text-purple-700" :
//           row.typeOfMembership === "Individual" ? "bg-green-50 text-green-700" :
//           "bg-gray-50 text-gray-700"
//         }`}>
//           {row.typeOfMembership || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Status",
//       render: (row) => {
//         const statusColor = {
//           'Hot': 'bg-red-100 text-red-800',
//           'Follow Up': 'bg-yellow-100 text-yellow-800',
//           'Closed': 'bg-green-100 text-green-800',
//           'Cancel': 'bg-gray-100 text-gray-800',
//           'Cold': 'bg-blue-100 text-blue-800'
//         };

//         const status = row.typeOfEnquires || "";
//         const colorClass = statusColor[status] || "bg-gray-100 text-gray-800";

//         return (
//           <span className={`px-2 py-1 rounded text-xs ${colorClass}`}>
//             {status}
//           </span>
//         );
//       },
//     },
//     {
//       header: "Actions",
//       render: (row, index) => {
//         const rowId = row._id || index;
//         return (
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => handleViewFollowUps(row)}
//               className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded transition"
//               title="View Follow-ups"
//               disabled={!row.followUps || row.followUps.length === 0}
//             >
//               <FiEye size={16} />
//             </button>
//             <button 
//               onClick={() => handleAdd(row)}
//               className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition"
//               title="Add Follow-up"
//             >
//               <FiMessageSquare size={16} />
//             </button>
//             <div className="relative">
//               <button
//                 ref={(el) => { if (el) menuButtonRefs.current[rowId] = el; }}
//                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleMenu(rowId, e); }}
//                 className="p-1.5 border border-gray-300 hover:bg-gray-50 rounded transition"
//               >
//                 <span className="text-gray-600">•••</span>
//               </button>
//               {menuOpen === rowId && (
//                 <div className="absolute right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-md z-50 min-w-[160px]">
//                   <button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       handleViewDoctor(row);
//                       setMenuOpen(null);
//                     }}
//                     className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                   >
//                     <FiEye className="mr-2" size={14} />
//                     View Details
//                   </button>
//                   <button 
//                     onClick={(e) => { 
//                       e.preventDefault(); 
//                       e.stopPropagation(); 
//                       handleEdit(row); 
//                     }} 
//                     className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                   >
//                     <FiEdit className="mr-2" size={14} />
//                     Edit
//                   </button>
//                   <button 
//                     onClick={(e) => { 
//                       e.preventDefault(); 
//                       e.stopPropagation(); 
//                       handleDelete(row); 
//                     }} 
//                     className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
//                   >
//                     <FiTrash2 className="mr-2" size={14} />
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       },
//     }
//   ];

//   return (
//     <div className="p-4 bg-gray-50 w-[80vw] 2xl:w-[84vw] min-h-screen">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Total Doctor List</h1>
//             <p className="text-sm text-gray-600 mt-1">Manage and track all doctors</p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <Link 
//               to='/Superadmin/send-message' 
//               className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition text-sm"
//             >
//               <FiMessageSquare className="mr-2" />
//               Send Message
//             </Link>
//             <Link 
//               to="/Superadmin/dr-followups" 
//               className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm"
//             >
//               <FiEye className="mr-2" />
//               View Follow ups
//             </Link>
//             <button 
//               // onClick={() => setShowExportModal(true)}
//    onClick={() => handleExportCSV()}
//               className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm"
//               disabled={isExporting}
//             >
//               <FiDownload className="mr-2" />
//               {isExporting ? "Exporting..." : "Export"}
//             </button>
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//           <div className="bg-white rounded-lg p-4 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Doctors</p>
//                 <p className="text-2xl font-bold text-gray-800">{fullData.length}</p>
//               </div>
//               <div className="p-2 bg-blue-50 rounded-lg">
//                 <FiUsers className="text-blue-600" size={24} />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Filtered</p>
//                 <p className="text-2xl font-bold text-gray-800">{filteredData.length}</p>
//               </div>
//               <div className="p-2 bg-teal-50 rounded-lg">
//                 <FiFilter className="text-teal-600" size={24} />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Active Filters</p>
//                 <p className="text-2xl font-bold text-gray-800">{activeFiltersCount}</p>
//               </div>
//               <div className="p-2 bg-purple-50 rounded-lg">
//                 <FiFilter className="text-purple-600" size={24} />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Follow-ups</p>
//                 <p className="text-2xl font-bold text-gray-800">
//                   {fullData.reduce((sum, item) => sum + (item.followUps?.length || 0), 0)}
//                 </p>
//               </div>
//               <div className="p-2 bg-green-50 rounded-lg">
//                 <FiMessageSquare className="text-green-600" size={24} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters Card */}
//       <div className="bg-white rounded-lg shadow-sm border mb-6">
//         <div className="p-4 border-b">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <FiFilter className="text-gray-500 mr-2" />
//               <h2 className="font-medium text-gray-800">Filters</h2>
//               {activeFiltersCount > 0 && (
//                 <span className="ml-2 bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full">
//                   {activeFiltersCount} active
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center space-x-2">
//               {activeFiltersCount > 0 && (
//                 <button
//                   onClick={handleResetFilters}
//                   className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
//                 >
//                   <FiRefreshCw className="mr-1" size={14} />
//                   Clear All
//                 </button>
//               )}
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="inline-flex items-center text-sm text-teal-600 hover:text-teal-800"
//               >
//                 {showFilters ? <FiX className="mr-1" /> : <FiFilter className="mr-1" />}
//                 {showFilters ? "Hide Filters" : "Show Filters"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {showFilters && (
//           <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {/* Name Search */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <FiUser className="inline mr-1" size={14} />
//                   Search by Name
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Doctor or hospital name..."
//                   value={searchByName}
//                   onChange={(e) => setSearchByName(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>

//               {/* Status Filter */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Status Type
//                 </label>
//                 <select
//                   value={sortByStatus}
//                   onChange={(e) => setSortByStatus(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 >
//                   <option value="All">All Status</option>
//                   <option value="follow_up">Follow Up</option>
//                   <option value="hot">Hot (Priority)</option>
//                   <option value="closed">Closed (Converted)</option>
//                   <option value="cancel">Cancel (Expired)</option>
//                   <option value="cold">Cold (Not Interested)</option>
//                 </select>
//               </div>

//               {/* Membership Filter */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <FiBriefcase className="inline mr-1" size={14} />
//                   Membership Type
//                 </label>
//                 <select
//                   value={sortByMembership}
//                   onChange={(e) => setSortByMembership(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 >
//                   <option value="All">All Memberships</option>
//                   <option value="Hospital">Hospital</option>
//                   <option value="Individual">Individual</option>
//                   <option value="Hospital + Individual">Hospital + Individual</option>
//                 </select>
//               </div>

//               {/* City Search */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <FiMapPin className="inline mr-1" size={14} />
//                   Search by City
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter city..."
//                   value={searchByCity}
//                   onChange={(e) => setSearchByCity(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>

//               {/* Specialty Search */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Search by Specialty
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter specialty..."
//                   value={searchBySpecialty}
//                   onChange={(e) => setSearchBySpecialty(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>

//               {/* Salesman Search */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <FiUser className="inline mr-1" size={14} />
//                   Search by Salesman
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter salesman name..."
//                   value={searchBySalesman}
//                   onChange={(e) => setSearchBySalesman(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>

//               {/* Date Range */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <FiCalendar className="inline mr-1" size={14} />
//                   From Date
//                 </label>
//                 <input
//                   type="date"
//                   value={sortByDateFrom}
//                   onChange={(e) => setSortByDateFrom(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <FiCalendar className="inline mr-1" size={14} />
//                   To Date
//                 </label>
//                 <input
//                   type="date"
//                   value={sortByDateTo}
//                   onChange={(e) => setSortByDateTo(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-between items-center mt-6 pt-4 border-t">
//               <div className="text-sm text-gray-600">
//                 Showing <span className="font-semibold">{filteredData.length}</span> of{" "}
//                 <span className="font-semibold">{fullData.length}</span> doctors
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={handleResetFilters}
//                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={applyFilters}
//                   className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
//                 >
//                   Apply Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center p-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//             <p className="mt-4 text-gray-600">Loading doctors data...</p>
//           </div>
//         ) : error ? (
//           <div className="p-6">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
//                   <div className="mt-2 text-sm text-red-700">
//                     <p>{error}</p>
//                   </div>
//                   <button
//                     onClick={fetchDoctors}
//                     className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none transition"
//                   >
//                     Retry
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : filteredData.length === 0 ? (
//           <div className="flex flex-col items-center justify-center p-12">
//             <div className="text-center">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 {fullData.length === 0 
//                   ? "No doctors in the system yet." 
//                   : "Try adjusting your search or filter criteria."}
//               </p>
//               <div className="mt-6">
//                 <button
//                   onClick={handleResetFilters}
//                   className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none transition"
//                 >
//                   <FiRefreshCw className="mr-2" size={16} />
//                   Reset Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <Table 
//               data={tableData} 
//               actions={[]} 
//               extraColumns={extraColumns} 
//               pagination={true}
//               itemsPerPage={10}
//               className="min-w-full"
//             />
//           </div>
//         )}
//       </div>

//       {/* Export Modal */}
//       {showExportModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
//                 <button
//                   onClick={() => setShowExportModal(false)}
//                   className="text-gray-400 hover:text-gray-500"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <div className="space-y-4 mb-6">
//                 <p className="text-sm text-gray-600">
//                   Export <span className="font-semibold">{filteredData.length}</span> records
//                 </p>

//                 <div className="grid grid-cols-3 gap-3">
//                   <button
//                     onClick={() => setExportFormat("csv")}
//                     className={`p-4 border rounded-lg flex flex-col items-center transition ${
//                       exportFormat === "csv" 
//                         ? "border-teal-500 bg-teal-50" 
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <span className="text-sm font-medium mb-1">CSV</span>
//                     <span className="text-xs text-gray-500">Excel/CSV</span>
//                   </button>

//                   <button
//                     onClick={() => setExportFormat("excel")}
//                     className={`p-4 border rounded-lg flex flex-col items-center transition ${
//                       exportFormat === "excel" 
//                         ? "border-teal-500 bg-teal-50" 
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <span className="text-sm font-medium mb-1">Excel</span>
//                     <span className="text-xs text-gray-500">.xlsx</span>
//                   </button>

//                   <button
//                     onClick={() => setExportFormat("pdf")}
//                     className={`p-4 border rounded-lg flex flex-col items-center transition ${
//                       exportFormat === "pdf" 
//                         ? "border-teal-500 bg-teal-50" 
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <span className="text-sm font-medium mb-1">PDF</span>
//                     <span className="text-xs text-gray-500">Document</span>
//                   </button>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => setShowExportModal(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
//                   disabled={isExporting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     if (exportFormat === "csv") handleExportCSV();
//                     else if (exportFormat === "excel") handleExportExcel();
//                     else if (exportFormat === "pdf") handleExportPDF();
//                   }}
//                   className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm disabled:opacity-50"
//                   disabled={isExporting || filteredData.length === 0}
//                 >
//                   {isExporting ? (
//                     <span className="flex items-center">
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Exporting...
//                     </span>
//                   ) : (
//                     `Export as ${exportFormat.toUpperCase()}`
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Hidden CSV Link */}
//       <CSVLink
//         ref={csvLinkRef}
//         data={exportData}
//         filename={`Doctors_List_${new Date().toISOString().split('T')[0]}.csv`}
//         className="hidden"
//         target="_blank"
//       />

//       {/* View Follow Ups Modal */}
//       {showViewModal && selectedRow && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
//             <div className="p-6 border-b">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900">Follow-ups</h2>
//                   <p className="text-sm text-gray-600 mt-1">
//                     {selectedRow.drName} • {selectedRow.hospitalName}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setShowViewModal(false)}
//                   className="text-gray-400 hover:text-gray-500"
//                 >
//                   <FiX size={24} />
//                 </button>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6">
//               {selectedRow.followUps && selectedRow.followUps.length === 0 ? (
//                 <div className="text-center py-8">
//                   <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
//                   <h3 className="mt-2 text-sm font-medium text-gray-900">No follow-ups</h3>
//                   <p className="mt-1 text-sm text-gray-500">
//                     No follow-up records found for this doctor.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {selectedRow.followUps.map((fu, idx) => (
//                     <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                             {fu.date}
//                           </span>
//                           <p className="mt-2 text-sm text-gray-700">{fu.note}</p>
//                         </div>
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                           Salesman: {fu.salesman}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="p-6 border-t">
//               <div className="flex justify-end">
//                 <button
//                   onClick={() => setShowViewModal(false)}
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Follow Up Modal */}
//       {showAddModal && selectedRow && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">Add Follow-up</h2>
//                   <p className="text-sm text-gray-600 mt-1">For {selectedRow.drName}</p>
//                 </div>
//                 <button
//                   onClick={() => setShowAddModal(false)}
//                   className="text-gray-400 hover:text-gray-500"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Follow-up Notes *
//                   </label>
//                   <textarea
//                     value={newNote}
//                     onChange={(e) => setNewNote(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                     rows={4}
//                     placeholder="Enter detailed notes..."
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Date
//                     </label>
//                     <input
//                       type="date"
//                       value={reminderDateTime.split('T')[0] || ''}
//                       onChange={(e) => {
//                         const date = e.target.value;
//                         const time = reminderDateTime.split('T')[1] || '00:00';
//                         setReminderDateTime(`${date}T${time}`);
//                       }}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Time
//                     </label>
//                     <input
//                       type="time"
//                       value={reminderDateTime.split('T')[1] || ''}
//                       onChange={(e) => {
//                         const date = reminderDateTime.split('T')[0] || new Date().toISOString().split('T')[0];
//                         setReminderDateTime(`${date}T${e.target.value}`);
//                       }}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Type
//                   </label>
//                   <select
//                     value={followUpType}
//                     onChange={(e) => setFollowUpType(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                   >
//                     <option value="call">Phone Call</option>
//                     <option value="visit">Personal Visit</option>
//                     <option value="email">Email</option>
//                     <option value="message">Message</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="reminderAlert"
//                     checked={reminderAlert}
//                     onChange={(e) => setReminderAlert(e.target.checked)}
//                     className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
//                   />
//                   <label htmlFor="reminderAlert" className="ml-2 text-sm text-gray-700">
//                     Set reminder alert for this follow-up
//                   </label>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
//                 <button
//                   onClick={() => setShowAddModal(false)}
//                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveNewFollowUp}
//                   disabled={!newNote.trim() || loading}
//                   className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm disabled:opacity-50"
//                 >
//                   {loading ? "Saving..." : "Save Follow-up"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TotalDoctorList;











// import React, { useState, useEffect, useRef, useCallback } from "react";
// import Table from "./Table";
// import { Link, useNavigate } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { CSVLink } from "react-csv";
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { FiFilter, FiX, FiDownload, FiEye, FiEdit, FiTrash2, FiCalendar, FiUser, FiMapPin, FiBriefcase, FiUsers, FiMessageSquare, FiRefreshCw } from "react-icons/fi";

// const TotalDoctorList = () => {
//   const navigate = useNavigate();
//   const [searchByName, setSearchByName] = useState("");
//   const [sortByStatus, setSortByStatus] = useState("All");
//   const [sortByDateTo, setSortByDateTo] = useState("");
//   const [sortByDateFrom, setSortByDateFrom] = useState("");
//   const [sortByMembership, setSortByMembership] = useState("All");
//   const [searchByCity, setSearchByCity] = useState("");
//   const [searchBySpecialty, setSearchBySpecialty] = useState("");
//   const [searchBySalesman, setSearchBySalesman] = useState("");
//   const [sortByDoctorStatus, setSortByDoctorStatus] = useState("All");
//   const [showFilters, setShowFilters] = useState(false);

//   const [fullData, setFullData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [exportData, setExportData] = useState([]);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportFormat, setExportFormat] = useState("csv");
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [activeFiltersCount, setActiveFiltersCount] = useState(0);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [newNote, setNewNote] = useState("");
//   const [reminderDateTime, setReminderDateTime] = useState("");
//   const [reminderAlert, setReminderAlert] = useState(true);
//   const [followUpType, setFollowUpType] = useState("call");
//   const [menuOpen, setMenuOpen] = useState(null);
//   const menuRef = useRef(null);
//   const menuButtonRefs = useRef({});
//   const csvLinkRef = useRef();

//   // Calculate active filters
//   useEffect(() => {
//     let count = 0;
//     if (searchByName) count++;
//     if (sortByStatus !== "All") count++;
//     if (sortByMembership !== "All") count++;
//     if (searchByCity) count++;
//     if (searchBySpecialty) count++;
//     if (searchBySalesman) count++;
//     if (sortByDateFrom || sortByDateTo) count++;
//     if (sortByDoctorStatus !== "All") count++;
//     setActiveFiltersCount(count);
//   }, [searchByName, sortByStatus, sortByMembership, searchByCity, searchBySpecialty, searchBySalesman, sortByDateFrom, sortByDateTo, sortByDoctorStatus]);

//   // Table data for display
//   // const tableData = filteredData.map(item => ({
//   //   id: item.id,
//   //   _id: item._id,
//   //   date: item.date,
//   //   drName: item.drName,
//   //   contact: item.contact,
//   //   hospitalName: item.hospitalName,
//   //   city: item.city,
//   //   specialty: item.specialty,
//   //   typeOfMembership: item.typeOfMembership,
//   //   typeOfEnquires: item.typeOfEnquires,
//   //   followUps: item.followUps
//   // }));



// const tableData = filteredData;


//   // Enhanced filter function
//   const applyFilters = useCallback(() => {
//     let result = [...fullData];

//     if (searchByName.trim()) {
//       result = result.filter(item => 
//         item.drName?.toLowerCase().includes(searchByName.toLowerCase()) ||
//         item.hospitalName?.toLowerCase().includes(searchByName.toLowerCase())
//       );
//     }

//     if (sortByStatus && sortByStatus !== "All") {
//       result = result.filter(item => 
//         item.typeOfEnquires?.toLowerCase().includes(sortByStatus.toLowerCase())
//       );
//     }

//     if (sortByMembership && sortByMembership !== "All") {
//       result = result.filter(item => 
//         item.typeOfMembership === sortByMembership
//       );
//     }

//     if (searchByCity.trim()) {
//       result = result.filter(item => 
//         item.city?.toLowerCase().includes(searchByCity.toLowerCase())
//       );
//     }

//     if (searchBySpecialty.trim()) {
//       result = result.filter(item => 
//         item.specialty?.toLowerCase().includes(searchBySpecialty.toLowerCase())
//       );
//     }

//     if (searchBySalesman.trim()) {
//       result = result.filter(item => 
//         item.salesmanName?.toLowerCase().includes(searchBySalesman.toLowerCase()) ||
//         item.createdBy?.toLowerCase().includes(searchBySalesman.toLowerCase())
//       );
//     }

//     if (sortByDoctorStatus && sortByDoctorStatus !== "All") {
//       const filterValue = sortByDoctorStatus.toLowerCase();
//       result = result.filter(item => item.doctorStatus === filterValue);
//     }

//     if (sortByDateFrom || sortByDateTo) {
//       result = result.filter(item => {
//         const itemDate = new Date(item.createdAt || item.date);

//         if (sortByDateFrom && sortByDateTo) {
//           const fromDate = new Date(sortByDateFrom);
//           const toDate = new Date(sortByDateTo);
//           toDate.setHours(23, 59, 59, 999);
//           return itemDate >= fromDate && itemDate <= toDate;
//         }

//         if (sortByDateFrom) {
//           const fromDate = new Date(sortByDateFrom);
//           return itemDate >= fromDate;
//         }

//         if (sortByDateTo) {
//           const toDate = new Date(sortByDateTo);
//           toDate.setHours(23, 59, 59, 999);
//           return itemDate <= toDate;
//         }

//         return true;
//       });
//     }

//     setFilteredData(result);
//   }, [fullData, searchByName, sortByStatus, sortByMembership, searchByCity, searchBySpecialty, searchBySalesman, sortByDateFrom, sortByDateTo, sortByDoctorStatus]);

//   // Prepare export data
//   const prepareExportData = () => {
//     const dataToExport = filteredData.map(item => ({
//       'Doctor ID': item.id,
//       'Date': item.date,
//       'Doctor Name': item.drName,
//       'Contact': item.contact,
//       'Hospital Name': item.hospitalName,
//       'City': item.city,
//       'Specialty': item.specialty,
//       'Membership Type': item.typeOfMembership,
//       'Enquiry Type': item.typeOfEnquires,
//       'Doctor Status': item.doctorStatusDisplay || 'Pending',
//       'Follow-ups Count': item.followUps?.length || 0,
//       'Last Follow-up': item.followUps?.[0]?.date || 'N/A',
//       'Created At': item.createdAt || 'N/A'
//     }));

//     setExportData(dataToExport);
//     return dataToExport;
//   };

//   const handleExportCSV = () => {
//     const data = prepareExportData();
//     setIsExporting(true);
//     setTimeout(() => {
//       csvLinkRef.current.link.click();
//       setIsExporting(false);
//     }, 500);
//   };

//   const handleExportExcel = () => {
//     const data = prepareExportData();
//     setIsExporting(true);

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Doctors");

//     const wscols = [
//       {wch: 10}, {wch: 12}, {wch: 25}, {wch: 15}, {wch: 25},
//       {wch: 15}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 15},
//       {wch: 5}, {wch: 20}, {wch: 20},
//     ];
//     ws['!cols'] = wscols;

//     XLSX.writeFile(wb, `Doctors_List_${new Date().toISOString().split('T')[0]}.xlsx`);
//     setIsExporting(false);
//   };

//   const handleExportPDF = () => {
//     const data = prepareExportData();
//     setIsExporting(true);

//     const doc = new jsPDF('landscape');
//     const tableColumn = Object.keys(data[0] || {});
//     const tableRows = data.map(item => Object.values(item));

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       theme: 'grid',
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [41, 128, 185] },
//       margin: { top: 20 },
//       didDrawPage: function (data) {
//         doc.setFontSize(16);
//         doc.text('Doctors List Report', 14, 10);
//         doc.setFontSize(10);
//         doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 18);
//       }
//     });

//     doc.save(`Doctors_List_${new Date().toISOString().split('T')[0]}.pdf`);
//     setIsExporting(false);
//   };

//   const handleResetFilters = () => {
//     setSearchByName("");
//     setSortByStatus("All");
//     setSortByDateTo("");
//     setSortByDateFrom("");
//     setSortByMembership("All");
//     setSearchByCity("");
//     setSearchBySpecialty("");
//     setSearchBySalesman("");
//     setSortByDoctorStatus("All");
//   };

//   const handleViewFollowUps = (row) => {
//     setSelectedRow(row);
//     setShowViewModal(true);
//   };

//   const handleViewDoctor = (row) => {
//     const doctorId = row._id || row.id;
//     navigate(`/view-doctor/${doctorId}`);
//   };

//   const handleAdd = (row) => {
//     setSelectedRow(row);
//     setNewNote("");
//     setReminderDateTime("");
//     setFollowUpType("call");
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
//                    doctor.contactDetails?.currentAddress?.city || "";
//       const specialty = doctor.specialization?.[0] || "";
//       const followUps = (doctor.followUps || []).map((fu) => ({
//         note: fu.notes || "",
//         // date: fu.date ? new Date(fu.date).toLocaleString() : "",
//         date: fu.date
//   ? `${String(new Date(fu.date).getDate()).padStart(2, "0")}/${
//       String(new Date(fu.date).getMonth() + 1).padStart(2, "0")
//     }/${new Date(fu.date).getFullYear()}`
//   : "",

//         // salesman: fu.createdBy?.fullName?.charAt(0) || "U",
// createdBy: fu.createdBy || { fullName: "Unknown", role: "" }, // ← YE ADD KARO
//   salesman: fu.createdBy?.fullName?.charAt(0)?.toUpperCase() || "U", // optional: agar avatar chahiye
//   // createdAt:fu.createdAt ? new Date(fu.createdAt).toLocaleString() : "",
//   createdAt: fu.createdAt
//   ? `${new Date(fu.createdAt).getDate().toString().padStart(2, "0")}/${
//       (new Date(fu.createdAt).getMonth() + 1).toString().padStart(2, "0")
//     }/${new Date(fu.createdAt).getFullYear()}`
//   : "",


//       }));

//       let doctorStatusDisplay = "Pending";
//       let statusColor = "bg-gray-100 text-gray-800";
//       const apiStatus = doctor.status?.toLowerCase() || "pending";

//       if (apiStatus === "rejected") {
//         doctorStatusDisplay = "Rejected";
//         statusColor = "bg-red-100 text-red-800";
//       } else if (apiStatus === "accepted") {
//         doctorStatusDisplay = "Accepted";
//         statusColor = "bg-green-100 text-green-800";
//       } else if (apiStatus === "active") {
//         doctorStatusDisplay = "Active";
//         statusColor = "bg-blue-100 text-blue-800";
//       } else if (apiStatus === "pending") {
//         doctorStatusDisplay = "Pending";
//         statusColor = "bg-gray-100 text-gray-800";
//       }

//       return {
//         id: doctor.doctorId,
//         _id: doctor._id,
//         date: doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString("en-GB").replace(/\//g, ".") : "",
//         drName: doctor.fullName || "",
//         contact: doctor.phoneNumber || "",
//         hospitalName: doctor.hospitalName || "",
//         city: city,
//         specialty: specialty,
//         typeOfMembership: doctor.doctorType === "hospital" ? "Hospital" :
//                          doctor.doctorType === "individual" ? "Individual" :
//                          doctor.doctorType || "Hospital",
//         typeOfEnquires: doctor.typeOfEnquiry ?
//                        doctor.typeOfEnquiry.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') :
//                        "Cold",
//         followUps: followUps,
//         createdAt: doctor.createdAt,
//         salesmanName: doctor.createdBy?.fullName || "Unknown",
//         doctorStatus: apiStatus,

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

//       if (sortByStatus && sortByStatus !== "All") {
//         params.typeOfEnquiry = sortByStatus.toLowerCase();
//       }
//       if (sortByMembership && sortByMembership !== "All") {
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

//       const response = await apiClient.get(apiEndpoints.doctors.list, { params });
//       const doctorsData = response.data.data || response.data || [];
//       const mappedData = mapDoctorData(doctorsData);
//       setFullData(mappedData);
//       setFilteredData(mappedData);
//     } catch (err) {
//       console.error("Error fetching doctors:", err);
//       setError("Failed to load doctors. Please try again.");
//       setFullData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [searchByName, sortByStatus, sortByMembership]);

//   useEffect(() => {
//     fetchDoctors();
//   }, [fetchDoctors]);

//   useEffect(() => {
//     applyFilters();
//   }, [applyFilters]);

//   const handleToggleMenu = (rowId, e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//     setMenuOpen(menuOpen === rowId ? null : rowId);
//   };

//   const handleEdit = (row) => {
//     setMenuOpen(null);
//     const doctorId = row._id || row.id;
//     navigate(`/view-doctor/${doctorId}?edit=true`);
//   };

//   const handleDelete = async (row) => {
//     if (window.confirm(`Are you sure you want to delete ${row.drName}?`)) {
//       try {
//         setLoading(true);
//         await apiClient.delete(apiEndpoints.doctors.delete(row._id));
//         await fetchDoctors();
//       } catch (err) {
//         console.error("Error deleting doctor:", err);
//         setError("Failed to delete doctor. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     }
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

//   const extraColumns = [
//     // {
//     //   header: "Specialty",
//     //   render: (row) => (
//     //     <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
//     //       {row.specialty || "N/A"}
//     //     </span>
//     //   ),
//     // },
//     // {
//     //   header: "Membership",
//     //   render: (row) => (
//     //     <span className={`px-2 py-1 rounded text-xs ${
//     //       row.typeOfMembership === "Hospital" ? "bg-purple-50 text-purple-700" :
//     //       row.typeOfMembership === "Individual" ? "bg-green-50 text-green-700" :
//     //       "bg-gray-50 text-gray-700"
//     //     }`}>
//     //       {row.typeOfMembership || "N/A"}
//     //     </span>
//     //   ),
//     // },
//     // {
//     //   header: "Doctor Status",
//     //   render: (row) => (
//     //     <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.statusColor}`}>
//     //       {row.doctorStatusDisplay}
//     //     </span>
//     //   ),
//     // },
//     {
//       header: "Status",
//       render: (row) => {
//         const statusColor = {
//           'Hot': 'bg-red-100 text-red-800',
//           'Follow Up': 'bg-yellow-100 text-yellow-800',
//           'Closed': 'bg-green-100 text-green-800',
//           'Cancel': 'bg-gray-100 text-gray-800',
//           'Cold': 'bg-blue-100 text-blue-800'
//         };

//         const status = row.typeOfEnquires || "";
//         const colorClass = statusColor[status] || "bg-gray-100 text-gray-800";

//         return (
//           <span className={`px-2 py-1 rounded text-xs ${colorClass}`}>
//             {status}
//           </span>
//         );
//       },
//     },
//     {
//       header: "Actions",
//       render: (row, index) => {
//         const rowId = row._id || index;
//         return (
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => handleViewFollowUps(row)}
//               className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded transition"
//               title="View Follow-ups"
//               disabled={!row.followUps || row.followUps.length === 0}
//             >
//               <FiEye size={16} />
//             </button>
//             <button 
//               onClick={() => handleAdd(row)}
//               className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition"
//               title="Add Follow-up"
//             >
//               <FiMessageSquare size={16} />
//             </button>
//             <div className="relative">
//               <button
//                 ref={(el) => { if (el) menuButtonRefs.current[rowId] = el; }}
//                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleMenu(rowId, e); }}
//                 className="p-1.5 border border-gray-300 hover:bg-gray-50 rounded transition"
//               >
//                 <span className="text-gray-600">•••</span>
//               </button>
//               {menuOpen === rowId && (
//                 <div className="absolute right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-md z-50 min-w-[160px]">
//                   <button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       handleViewDoctor(row);
//                       setMenuOpen(null);
//                     }}
//                     className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                   >
//                     <FiEye className="mr-2" size={14} />
//                     View Details
//                   </button>
//                   <button 
//                     onClick={(e) => { 
//                       e.preventDefault(); 
//                       e.stopPropagation(); 
//                       handleEdit(row); 
//                     }} 
//                     className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                   >
//                     <FiEdit className="mr-2" size={14} />
//                     Edit
//                   </button>
//                   <button 
//                     onClick={(e) => { 
//                       e.preventDefault(); 
//                       e.stopPropagation(); 
//                       handleDelete(row); 
//                     }} 
//                     className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
//                   >
//                     <FiTrash2 className="mr-2" size={14} />
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       },
//     }
//   ];

//   return (
//     <div className="p-4 bg-gray-50 w-[80vw] 2xl:w-[84vw] min-h-screen">
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Total Doctor List</h1>
//             <p className="text-sm text-gray-600 mt-1">Manage and track all doctors</p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <Link to='/Superadmin/send-message' className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition text-sm">
//               <FiMessageSquare className="mr-2" />
//               Send Message
//             </Link>
//             <Link to="/Superadmin/dr-followups" className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm">
//               <FiEye className="mr-2" />
//               View Follow ups
//             </Link>
//             <button onClick={() => handleExportCSV()} className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm" disabled={isExporting}>
//               <FiDownload className="mr-2" />
//               {isExporting ? "Exporting..." : "Export"}
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//           <div className="bg-white rounded-lg p-4 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Doctors</p>
//                 <p className="text-2xl font-bold text-gray-800">{fullData.length}</p>
//               </div>
//               <div className="p-2 bg-blue-50 rounded-lg">
//                 <FiUsers className="text-blue-600" size={24} />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Filtered</p>
//                 <p className="text-2xl font-bold text-gray-800">{filteredData.length}</p>
//               </div>
//               <div className="p-2 bg-teal-50 rounded-lg">
//                 <FiFilter className="text-teal-600" size={24} />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Active Filters</p>
//                 <p className="text-2xl font-bold text-gray-800">{activeFiltersCount}</p>
//               </div>
//               <div className="p-2 bg-purple-50 rounded-lg">
//                 <FiFilter className="text-purple-600" size={24} />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Follow-ups</p>
//                 <p className="text-2xl font-bold text-gray-800">
//                   {fullData.reduce((sum, item) => sum + (item.followUps?.length || 0), 0)}
//                 </p>
//               </div>
//               <div className="p-2 bg-green-50 rounded-lg">
//                 <FiMessageSquare className="text-green-600" size={24} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border mb-6">
//         <div className="p-4 border-b">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <FiFilter className="text-gray-500 mr-2" />
//               <h2 className="font-medium text-gray-800">Filters</h2>
//               {activeFiltersCount > 0 && (
//                 <span className="ml-2 bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full">
//                   {activeFiltersCount} active
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center space-x-2">
//               {activeFiltersCount > 0 && (
//                 <button onClick={handleResetFilters} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800">
//                   <FiRefreshCw className="mr-1" size={14} />
//                   Clear All
//                 </button>
//               )}
//               <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center text-sm text-teal-600 hover:text-teal-800">
//                 {showFilters ? <FiX className="mr-1" /> : <FiFilter className="mr-1" />}
//                 {showFilters ? "Hide Filters" : "Show Filters"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {showFilters && (
//           <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <FiUser className="inline mr-1" size={14} />
//                   Search by Name
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Doctor or hospital name..."
//                   value={searchByName}
//                   onChange={(e) => setSearchByName(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Status Type
//                 </label>
//                 <select
//                   value={sortByStatus}
//                   onChange={(e) => setSortByStatus(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 >
//                   <option value="All">All Status</option>
//                   <option value="follow_up">Follow Up</option>
//                   <option value="hot">Hot (Priority)</option>
//                   <option value="closed">Closed (Converted)</option>
//                   <option value="cancel">Cancel (Expired)</option>
//                   <option value="cold">Cold (Not Interested)</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Doctor Status
//                 </label>
//                 <select
//                   value={sortByDoctorStatus}
//                   onChange={(e) => setSortByDoctorStatus(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 >
//                   <option value="All">All Status</option>
//                   <option value="accepted">Accepted</option>
//                   <option value="rejected">Rejected</option>
//                   <option value="active">Active</option>
//                   <option value="pending">Pending</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <FiBriefcase className="inline mr-1" size={14} />
//                   Membership Type
//                 </label>
//                 <select
//                   value={sortByMembership}
//                   onChange={(e) => setSortByMembership(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 >
//                   <option value="All">All Memberships</option>
//                   <option value="Hospital">Hospital</option>
//                   <option value="Individual">Individual</option>
//                   <option value="Hospital + Individual">Hospital + Individual</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <FiMapPin className="inline mr-1" size={14} />
//                   Search by City
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter city..."
//                   value={searchByCity}
//                   onChange={(e) => setSearchByCity(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Search by Specialty
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter specialty..."
//                   value={searchBySpecialty}
//                   onChange={(e) => setSearchBySpecialty(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <FiUser className="inline mr-1" size={14} />
//                   Search by Salesman
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter salesman name..."
//                   value={searchBySalesman}
//                   onChange={(e) => setSearchBySalesman(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <FiCalendar className="inline mr-1" size={14} />
//                   From Date
//                 </label>
//                 <input
//                   type="date"
//                   value={sortByDateFrom}
//                   onChange={(e) => setSortByDateFrom(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <FiCalendar className="inline mr-1" size={14} />
//                   To Date
//                 </label>
//                 <input
//                   type="date"
//                   value={sortByDateTo}
//                   onChange={(e) => setSortByDateTo(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-between items-center mt-6 pt-4 border-t">
//               <div className="text-sm text-gray-600">
//                 Showing <span className="font-semibold">{filteredData.length}</span> of <span className="font-semibold">{fullData.length}</span> doctors
//               </div>
//               <div className="flex gap-2">
//                 <button onClick={handleResetFilters} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm">
//                   Reset
//                 </button>
//                 <button onClick={applyFilters} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm">
//                   Apply Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center p-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//             <p className="mt-4 text-gray-600">Loading doctors data...</p>
//           </div>
//         ) : error ? (
//           <div className="p-6">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
//                   <div className="mt-2 text-sm text-red-700">
//                     <p>{error}</p>
//                   </div>
//                   <button onClick={fetchDoctors} className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none transition">
//                     Retry
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : filteredData.length === 0 ? (
//           <div className="flex flex-col items-center justify-center p-12">
//             <div className="text-center">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 {fullData.length === 0 ? "No doctors in the system yet." : "Try adjusting your search or filter criteria."}
//               </p>
//               <div className="mt-6">
//                 <button onClick={handleResetFilters} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none transition">
//                   <FiRefreshCw className="mr-2" size={16} />
//                   Reset Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <Table data={tableData} actions={[]} 
//             excludeColumns={["specialty", "membership", "doctorStatus",'doctorStatusDisplay','statusColor','createdAt','typeOfEnquires','createdBy']} 
//             extraColumns={extraColumns} pagination={true} itemsPerPage={10} className="min-w-full" />
//           </div>
//         )}
//       </div>

//       <CSVLink
//         ref={csvLinkRef}
//         data={exportData}
//         filename={`Doctors_List_${new Date().toISOString().split('T')[0]}.csv`}
//         className="hidden"
//         target="_blank"
//       />

//       {/* View Follow Ups Modal */}
//       {showViewModal && selectedRow && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
//             <div className="p-6 border-b">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900">Follow-ups</h2>
//                   <p className="text-sm text-gray-600 mt-1">
//                     {selectedRow.drName} • {selectedRow.hospitalName}
//                   </p>
//                 </div>
//                 <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-500">
//                   <FiX size={24} />
//                 </button>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6">
//               {selectedRow.followUps && selectedRow.followUps.length === 0 ? (
//                 <div className="text-center py-8">
//                   <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
//                   <h3 className="mt-2 text-sm font-medium text-gray-900">No follow-ups</h3>
//                   <p className="mt-1 text-sm text-gray-500">
//                     No follow-up records found for this doctor.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {selectedRow.followUps.map((fu, idx) => (
//                     <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                             {fu.date}
//                           </span>
//                           <p className="mt-2 text-sm text-gray-700">{fu.note}</p>
//                         </div>
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                           NAME: {fu.createdBy.fullName}

//                         </span>
//                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                         CreatedAt: {fu.createdAt}
//                         </span>
//                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                         Role: {fu.createdBy.role}
//                         </span>

//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="p-6 border-t">
//               <div className="flex justify-end">
//                 <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Follow Up Modal */}
//       {showAddModal && selectedRow && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">Add Follow-up</h2>
//                   <p className="text-sm text-gray-600 mt-1">For {selectedRow.drName}</p>
//                 </div>
//                 <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-500">
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Follow-up Notes *
//                   </label>
//                   <textarea
//                     value={newNote}
//                     onChange={(e) => setNewNote(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                     rows={4}
//                     placeholder="Enter detailed notes..."
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Date
//                     </label>
//                     <input
//                       type="date"
//                       value={reminderDateTime.split('T')[0] || ''}
//                       onChange={(e) => {
//                         const date = e.target.value;
//                         const time = reminderDateTime.split('T')[1] || '00:00';
//                         setReminderDateTime(`${date}T${time}`);
//                       }}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Time
//                     </label>
//                     <input
//                       type="time"
//                       value={reminderDateTime.split('T')[1] || ''}
//                       onChange={(e) => {
//                         const date = reminderDateTime.split('T')[0] || new Date().toISOString().split('T')[0];
//                         setReminderDateTime(`${date}T${e.target.value}`);
//                       }}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Type
//                   </label>
//                   <select
//                     value={followUpType}
//                     onChange={(e) => setFollowUpType(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                   >
//                     <option value="call">Phone Call</option>
//                     <option value="visit">Personal Visit</option>
//                     <option value="email">Email</option>
//                     <option value="message">Message</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="reminderAlert"
//                     checked={reminderAlert}
//                     onChange={(e) => setReminderAlert(e.target.checked)}
//                     className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
//                   />
//                   <label htmlFor="reminderAlert" className="ml-2 text-sm text-gray-700">
//                     Set reminder alert for this follow-up
//                   </label>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
//                 <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm" disabled={loading}>
//                   Cancel
//                 </button>
//                 <button onClick={handleSaveNewFollowUp} disabled={!newNote.trim() || loading} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm disabled:opacity-50">
//                   {loading ? "Saving..." : "Save Follow-up"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TotalDoctorList;






// src/pages/admin/TotalDoctorList.jsx - MODIFIED VERSION
import React, { useState, useEffect, useRef, useCallback } from "react";
import Table from "./Table";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { CSVLink } from "react-csv";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  FiFilter, 
  FiX, 
  FiDownload, 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiCalendar, 
  FiUser, 
  FiMapPin, 
  FiBriefcase, 
  FiUsers, 
  FiMessageSquare, 
  FiRefreshCw,
  FiSearch,
  FiFileText,
  FiChevronRight,
  FiExternalLink
} from "react-icons/fi";
import { FaUserMd, FaHospital } from "react-icons/fa";
import { BsFileEarmarkExcel, BsFileEarmarkPdf } from "react-icons/bs";

const TotalDoctorList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get initial filters from dashboard URL and normalize
  const dashboardStatus = searchParams.get("status")?.toLowerCase() || "all";
  const dashboardMembership = searchParams.get("membership")?.toLowerCase() || "all";

  // State management
  const [searchByName, setSearchByName] = useState("");
  const [sortByStatus, setSortByStatus] = useState(dashboardStatus);
  const [sortByDateTo, setSortByDateTo] = useState("");
  const [sortByDateFrom, setSortByDateFrom] = useState("");
  const [sortByMembership, setSortByMembership] = useState(dashboardMembership);
  const [searchByCity, setSearchByCity] = useState("");
  const [searchBySpecialty, setSearchBySpecialty] = useState("");
  const [searchBySalesman, setSearchBySalesman] = useState("");
  const [sortByDoctorStatus, setSortByDoctorStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [fullData, setFullData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportData, setExportData] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [reminderDateTime, setReminderDateTime] = useState("");
  const [reminderAlert, setReminderAlert] = useState(true);
  const [followUpType, setFollowUpType] = useState("call");
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const menuButtonRefs = useRef({});
  const csvLinkRef = useRef();

  // Calculate active filters
  useEffect(() => {
    let count = 0;
    if (searchByName) count++;
    if (sortByStatus !== "all") count++;
    if (sortByMembership !== "all") count++;
    if (searchByCity) count++;
    if (searchBySpecialty) count++;
    if (searchBySalesman) count++;
    if (sortByDateFrom || sortByDateTo) count++;
    if (sortByDoctorStatus !== "all") count++;
    setActiveFiltersCount(count);
  }, [searchByName, sortByStatus, sortByMembership, searchByCity, searchBySpecialty, searchBySalesman, sortByDateFrom, sortByDateTo, sortByDoctorStatus]);

  // Apply dashboard filters on initial load
  useEffect(() => {
    if (isInitialLoad && (dashboardStatus !== "all" || dashboardMembership !== "all")) {
      setShowFilters(true);
      setIsInitialLoad(false);
    }
  }, [dashboardStatus, dashboardMembership, isInitialLoad]);

  // Enhanced filter function
  const applyFilters = useCallback(() => {
    let result = [...fullData];

    if (searchByName.trim()) {
      result = result.filter(item => 
        item.drName?.toLowerCase().includes(searchByName.toLowerCase()) ||
        item.hospitalName?.toLowerCase().includes(searchByName.toLowerCase())
      );
    }

    if (sortByStatus && sortByStatus !== "all") {
      result = result.filter(item => 
        item.internalEnquiryType === sortByStatus
      );
    }

    if (sortByMembership && sortByMembership !== "all") {
      result = result.filter(item => 
        item.internalDoctorType === sortByMembership
      );
    }

    if (searchByCity.trim()) {
      result = result.filter(item => 
        item.city?.toLowerCase().includes(searchByCity.toLowerCase())
      );
    }

    if (searchBySpecialty.trim()) {
      result = result.filter(item => 
        item.specialty?.toLowerCase().includes(searchBySpecialty.toLowerCase())
      );
    }

    if (searchBySalesman.trim()) {
      result = result.filter(item => 
        item.salesmanName?.toLowerCase().includes(searchBySalesman.toLowerCase()) ||
        item.createdBy?.toLowerCase().includes(searchBySalesman.toLowerCase())
      );
    }

    if (sortByDoctorStatus && sortByDoctorStatus !== "all") {
      result = result.filter(item => item.doctorStatus === sortByDoctorStatus);
    }

    if (sortByDateFrom || sortByDateTo) {
      result = result.filter(item => {
        const itemDate = new Date(item.createdAt || item.date);

        if (sortByDateFrom && sortByDateTo) {
          const fromDate = new Date(sortByDateFrom);
          const toDate = new Date(sortByDateTo);
          toDate.setHours(23, 59, 59, 999);
          return itemDate >= fromDate && itemDate <= toDate;
        }

        if (sortByDateFrom) {
          const fromDate = new Date(sortByDateFrom);
          return itemDate >= fromDate;
        }

        if (sortByDateTo) {
          const toDate = new Date(sortByDateTo);
          toDate.setHours(23, 59, 59, 999);
          return itemDate <= toDate;
        }

        return true;
      });
    }

    setFilteredData(result);
  }, [fullData, searchByName, sortByStatus, sortByMembership, searchByCity, searchBySpecialty, searchBySalesman, sortByDateFrom, sortByDateTo, sortByDoctorStatus]);

  // Prepare export data
  const prepareExportData = () => {
    const dataToExport = filteredData.map(item => ({
      'Doctor ID': item.id,
      'Date': item.date,
      'Doctor Name': item.drName,
      'Contact': item.contact,
      'Hospital Name': item.hospitalName,
      'City': item.city,
      'Specialty': item.specialty,
      'Membership Type': item.typeOfMembership,
      'Status': item.typeOfEnquires,
      'Doctor Status': item.doctorStatusDisplay || 'Pending',
      'Salesman': item.salesmanName,
      'Follow-ups Count': item.followUps?.length || 0,
      'Last Follow-up': item.followUps?.[0]?.date || 'N/A',
      'Created At': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'
    }));

    setExportData(dataToExport);
    return dataToExport;
  };

  const handleExportCSV = () => {
    const data = prepareExportData();
    setIsExporting(true);
    setTimeout(() => {
      csvLinkRef.current.link.click();
      setIsExporting(false);
    }, 500);
  };

  const handleExportExcel = () => {
    const data = prepareExportData();
    setIsExporting(true);

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Doctors");

    const wscols = [
      {wch: 10}, {wch: 12}, {wch: 25}, {wch: 15}, {wch: 25},
      {wch: 15}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 15},
      {wch: 20}, {wch: 5}, {wch: 20}, {wch: 20},
    ];
    ws['!cols'] = wscols;

    const fileName = `Doctors_List_${sortByStatus || 'all'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    setIsExporting(false);
  };

  const handleExportPDF = () => {
    const data = prepareExportData();
    setIsExporting(true);

    const doc = new jsPDF('landscape');
    const tableColumn = Object.keys(data[0] || {});
    const tableRows = data.map(item => Object.values(item));

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 20 },
      didDrawPage: function (data) {
        doc.setFontSize(16);
        doc.text('Doctors List Report', 14, 10);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 18);
      }
    });

    doc.save(`Doctors_List_${new Date().toISOString().split('T')[0]}.pdf`);
    setIsExporting(false);
  };

  const handleResetFilters = () => {
    setSearchByName("");
    setSortByStatus("all");
    setSortByDateTo("");
    setSortByDateFrom("");
    setSortByMembership("all");
    setSearchByCity("");
    setSearchBySpecialty("");
    setSearchBySalesman("");
    setSortByDoctorStatus("all");
  };

  const handleViewFollowUps = (row) => {
    setSelectedRow(row);
    setShowViewModal(true);
  };

  const handleViewDoctor = (row) => {
    const doctorId = row._id || row.id;
    navigate(`/view-doctor/${doctorId}`);
  };

  const handleAddFollowUp = (row) => {
    setSelectedRow(row);
    setNewNote("");
    setReminderDateTime("");
    setFollowUpType("call");
    setShowAddModal(true);
  };

  const handleSaveNewFollowUp = async () => {
    if (selectedRow && newNote.trim()) {
      try {
        setLoading(true);
        await apiClient.post(apiEndpoints.doctors.followup(selectedRow._id), {
          date: reminderDateTime || new Date(),
          type: followUpType || "call",
          notes: newNote,
          outcome: "",
          nextFollowUpDate: reminderDateTime || undefined,
        });

        await fetchDoctors();
        setNewNote("");
        setReminderDateTime("");
        setShowAddModal(false);
      } catch (err) {
        console.error("Error saving follow-up:", err);
        setError("Failed to save follow-up. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const mapDoctorData = (doctors) => {
    return doctors.map((doctor) => {
      const city = doctor.hospitalAddress?.city ||
                   doctor.contactDetails?.currentAddress?.city || "";
      const specialty = doctor.specialization?.[0] || "";
      const followUps = (doctor.followUps || []).map((fu) => ({
        note: fu.notes || "",
        date: fu.date
          ? `${String(new Date(fu.date).getDate()).padStart(2, "0")}/${
              String(new Date(fu.date).getMonth() + 1).padStart(2, "0")
            }/${new Date(fu.date).getFullYear()}`
          : "",
        createdBy: fu.createdBy || { fullName: "Unknown", role: "" },
        createdAt: fu.createdAt
          ? `${new Date(fu.createdAt).getDate().toString().padStart(2, "0")}/${
              (new Date(fu.createdAt).getMonth() + 1).toString().padStart(2, "0")
            }/${new Date(fu.createdAt).getFullYear()}`
          : "",
      }));

      // Map status for display
      let typeOfEnquires = "Cold";
      if (doctor.typeOfEnquiry) {
        const status = doctor.typeOfEnquiry.toLowerCase();
        if (status === "hot") typeOfEnquires = "Hot";
        else if (status === "follow_up") typeOfEnquires = "Follow Up";
        else if (status === "closed") typeOfEnquires = "Closed";
        else if (status === "cancel") typeOfEnquires = "Cancel";
        else if (status === "cold") typeOfEnquires = "Cold";
      }

      // Map doctor status for display
      let doctorStatusDisplay = "Pending";
      let statusColor = "bg-gray-100 text-gray-800";
      const apiStatus = doctor.status?.toLowerCase() || "pending";

      if (apiStatus === "rejected") {
        doctorStatusDisplay = "Rejected";
        statusColor = "bg-red-100 text-red-800";
      } else if (apiStatus === "accepted") {
        doctorStatusDisplay = "Accepted";
        statusColor = "bg-green-100 text-green-800";
      } else if (apiStatus === "active") {
        doctorStatusDisplay = "Active";
        statusColor = "bg-blue-100 text-blue-800";
      } else if (apiStatus === "pending") {
        doctorStatusDisplay = "Pending";
        statusColor = "bg-gray-100 text-gray-800";
      }

      return {
        id: doctor.doctorId || doctor._id,
        _id: doctor._id,
        date: doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString("en-GB").replace(/\//g, ".") : "",
        drName: doctor.fullName || "",
        contact: doctor.phoneNumber || "",
        hospitalName: doctor.hospitalName || "",
        city: city,
        specialty: specialty,
        typeOfMembership: doctor.doctorType === "hospital" ? "Hospital" :
                         doctor.doctorType === "individual" ? "Individual" :
                         doctor.doctorType === "hospital_individual" ? "Hospital + Individual" :
                         doctor.doctorType || "Hospital",
        internalDoctorType: doctor.doctorType?.toLowerCase() || "hospital",
        typeOfEnquires: typeOfEnquires,
        internalEnquiryType: doctor.typeOfEnquiry?.toLowerCase() || "cold",
        followUps: followUps,
        createdAt: doctor.createdAt,
              createdAtTimestamp: doctor.createdAt ? new Date(doctor.createdAt).getTime() : 0, // Add this line

        salesmanName: doctor.createdBy?.fullName || "Unknown",
        createdBy: doctor.createdBy?.fullName || "Unknown",
        doctorStatus: apiStatus,
        doctorStatusDisplay: doctorStatusDisplay,
        statusColor: statusColor,
      };
    });
  };

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: 1,
        limit: 100000, // Increased limit to get all doctors
         sort: '-createdAt', // '-' sign means descending (newest first)
      };

      // Apply filters to API call
      if (sortByStatus && sortByStatus !== "all") {
        params.typeOfEnquiry = sortByStatus;
      }

      if (sortByMembership && sortByMembership !== "all") {
        params.doctorType = sortByMembership;
      }

      if (searchByName) {
        params.search = searchByName;
      }

      const response = await apiClient.get(apiEndpoints.doctors.list, { params });
      const doctorsData = response.data.data || response.data || [];
      const mappedData = mapDoctorData(doctorsData);
      setFullData(mappedData);
      setFilteredData(mappedData);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to load doctors. Please try again.");
      setFullData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [searchByName, sortByStatus, sortByMembership]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleToggleMenu = (rowId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMenuOpen(menuOpen === rowId ? null : rowId);
  };

  const handleEdit = (row) => {
    setMenuOpen(null);
    const doctorId = row._id || row.id;
    navigate(`/admin-edit-doctor/${doctorId}`);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.drName}?`)) {
      try {
        setLoading(true);
        await apiClient.delete(apiEndpoints.doctors.delete(row._id));
        await fetchDoctors();
      } catch (err) {
        console.error("Error deleting doctor:", err);
        setError("Failed to delete doctor. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    setMenuOpen(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen !== null) {
        const clickedElement = event.target;
        const isMenuButton = Object.values(menuButtonRefs.current).some(ref => ref && ref.contains(clickedElement));
        const isMenuDropdown = clickedElement.closest('.z-50');

        if (!isMenuButton && !isMenuDropdown) {
          setMenuOpen(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const extraColumns = [
    {
      header: "Status",
      render: (row) => {
        const statusColor = {
          'Hot': 'bg-red-100 text-red-800 border border-red-200',
          'Follow Up': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
          'Closed': 'bg-green-100 text-green-800 border border-green-200',
          'Cancel': 'bg-gray-100 text-gray-800 border border-gray-200',
          'Cold': 'bg-blue-100 text-blue-800 border border-blue-200'
        };

        const status = row.typeOfEnquires || "";
        const colorClass = statusColor[status] || "bg-gray-100 text-gray-800 border border-gray-200";

        return (
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${colorClass}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: "Membership",
      render: (row) => (
        <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${
          row.typeOfMembership === "Hospital" ? "bg-purple-100 text-purple-800 border border-purple-200" :
          row.typeOfMembership === "Individual" ? "bg-green-100 text-green-800 border border-green-200" :
          row.typeOfMembership === "Hospital + Individual" ? "bg-indigo-100 text-indigo-800 border border-indigo-200" :
          "bg-gray-100 text-gray-800 border border-gray-200"
        }`}>
          {row.typeOfMembership || "N/A"}
        </span>
      ),
    },
    {
      header: "Doctor Status",
      render: (row) => (
        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${row.statusColor || 'bg-gray-100 text-gray-800'}`}>
          {row.doctorStatusDisplay}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row, index) => {
        const rowId = row._id || index;
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewFollowUps(row)}
              className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg transition-all duration-200 hover:scale-105"
              title="View Follow-ups"
              disabled={!row.followUps || row.followUps.length === 0}
            >
              <FiEye size={18} />
            </button>
            <button 
              onClick={() => handleAddFollowUp(row)}
              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-200 hover:scale-105"
              title="Add Follow-up"
            >
              <FiMessageSquare size={18} />
            </button>
            <div className="relative">
              <button
                ref={(el) => { if (el) menuButtonRefs.current[rowId] = el; }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleMenu(rowId, e); }}
                className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <span className="text-gray-600">•••</span>
              </button>
              {menuOpen === rowId && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg z-50 min-w-[180px]">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleViewDoctor(row);
                      setMenuOpen(null);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                  >
                    <FiEye className="mr-2" size={14} />
                    View Details
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      handleEdit(row); 
                    }} 
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                  >
                    <FiEdit className="mr-2" size={14} />
                    Edit Doctor
                  </button>
                  <Link
                    to={`/superadmin/send-message/${row._id}`}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                    onClick={() => setMenuOpen(null)}
                  >
                    <FiMessageSquare className="mr-2" size={14} />
                    Send Message
                  </Link>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      handleDelete(row); 
                    }} 
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 className="mr-2" size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      },
    }
  ];

  // Skeleton Loader
  const renderSkeletonLoader = () => (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="animate-pulse space-y-4">
        {/* Header Skeleton */}
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 rounded"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  // Get page title based on filters
  const getPageTitle = () => {
    const statusDisplay = {
      'hot': 'Hot',
      'cold': 'Cold',
      'follow_up': 'Follow Up',
      'closed': 'Closed',
      'cancel': 'Cancel',
      'all': 'Total'
    }[sortByStatus] || 'Total';

    const membershipDisplay = {
      'hospital': 'Hospital',
      'individual': 'Individual',
      'hospital_individual': 'Hospital + Individual',
      'all': ''
    }[sortByMembership] || '';

    if (sortByStatus !== "all" && sortByMembership !== "all") {
      return `${statusDisplay} Doctors - ${membershipDisplay}`;
    } else if (sortByStatus !== "all") {
      return `${statusDisplay} Doctors`;
    } else if (sortByMembership !== "all") {
      return `${membershipDisplay} Doctors`;
    }
    return "Total Doctor List";
  };

  return (
    <div className="p-6 bg-gray-50 w-[87vw] min-h-screen">


      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {dashboardStatus !== "all" || dashboardMembership !== "all" 
                ? `Showing ${sortByStatus !== "all" ? getPageTitle().split(' ')[0] : ""} ${sortByMembership !== "all" ? getPageTitle().split(' - ')[1] || "" : ""} doctors` 
                : "Manage and track all doctors"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link 
              to='/Superadmin/send-message' 
              className="inline-flex items-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition text-sm font-medium"
            >
              <FiMessageSquare className="mr-2" />
              Send Message
            </Link>
            <Link 
              to="/Superadmin/dr-followups" 
              className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium"
            >
              <FiEye className="mr-2" />
              All Follow-ups
            </Link>
            <div className="relative group">
              <button 
                onClick={() => !isExporting && setIsExporting(true)}
                className="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-medium disabled:opacity-50"
                disabled={filteredData.length === 0 || isExporting}
              >
                <FiDownload className="mr-2" />
                {isExporting ? "Exporting..." : "Export"}
              </button>

              {filteredData.length > 0 && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:block">
                  <div className="py-1">
                    <button
                      onClick={handleExportExcel}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <BsFileEarmarkExcel className="mr-2 text-green-600" size={18} />
                      Export as Excel
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <BsFileEarmarkPdf className="mr-2 text-red-600" size={18} />
                      Export as PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-800">{fullData.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaUserMd className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Filtered Doctors</p>
                <p className="text-2xl font-bold text-gray-800">{filteredData.length}</p>
              </div>
              <div className="p-3 bg-teal-50 rounded-lg">
                <FiFilter className="text-teal-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Filters</p>
                <p className="text-2xl font-bold text-gray-800">{activeFiltersCount}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <FiSearch className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Follow-ups</p>
                <p className="text-2xl font-bold text-gray-800">
                  {fullData.reduce((sum, item) => sum + (item.followUps?.length || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FiMessageSquare className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiFilter className="text-gray-500 mr-2" />
              <h2 className="font-medium text-gray-800">Filters</h2>
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full font-medium">
                  {activeFiltersCount} active
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {activeFiltersCount > 0 && (
                <button 
                  onClick={handleResetFilters} 
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                  <FiRefreshCw className="mr-1" size={14} />
                  Clear All
                </button>
              )}
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="inline-flex items-center text-sm text-teal-600 hover:text-teal-800 font-medium"
              >
                {showFilters ? <FiX className="mr-1" /> : <FiFilter className="mr-1" />}
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Search by Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiSearch className="inline mr-1" />
                  Search by Name
                </label>
                <input
                  type="text"
                  placeholder="Doctor or hospital name..."
                  value={searchByName}
                  onChange={(e) => setSearchByName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Type
                </label>
                <select
                  value={sortByStatus}
                  onChange={(e) => setSortByStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="hot">Hot</option>
                  <option value="cold">Cold</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="closed">Closed</option>
                  <option value="cancel">Cancel</option>
                </select>
              </div>

              {/* Membership Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiBriefcase className="inline mr-1" />
                  Membership Type
                </label>
                <select
                  value={sortByMembership}
                  onChange={(e) => setSortByMembership(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Memberships</option>
                  <option value="hospital">Hospital</option>
                  <option value="individual">Individual</option>
                  <option value="hospital_individual">Hospital + Individual</option>
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMapPin className="inline mr-1" />
                  Search by City
                </label>
                <input
                  type="text"
                  placeholder="Enter city..."
                  value={searchByCity}
                  onChange={(e) => setSearchByCity(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Specialty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty
                </label>
                <input
                  type="text"
                  placeholder="Enter specialty..."
                  value={searchBySpecialty}
                  onChange={(e) => setSearchBySpecialty(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Salesman Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline mr-1" />
                  Search by Salesman
                </label>
                <input
                  type="text"
                  placeholder="Enter salesman name..."
                  value={searchBySalesman}
                  onChange={(e) => setSearchBySalesman(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Doctor Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Status
                </label>
                <select
                  value={sortByDoctorStatus}
                  onChange={(e) => setSortByDoctorStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Doctor Status</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Date Range - From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-1" />
                  From Date
                </label>
                <input
                  type="date"
                  value={sortByDateFrom}
                  onChange={(e) => setSortByDateFrom(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Date Range - To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-1" />
                  To Date
                </label>
                <input
                  type="date"
                  value={sortByDateTo}
                  onChange={(e) => setSortByDateTo(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Showing <span className="font-semibold text-teal-600">{filteredData.length}</span> of{" "}
                <span className="font-semibold text-teal-600">{fullData.length}</span> doctors
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                >
                  Reset All
                </button>
                <button
                  onClick={applyFilters}
                  className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          renderSkeletonLoader()
        ) : error ? (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-red-800">Error loading data</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <button
                    onClick={fetchDoctors}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none transition"
                  >
                    <FiRefreshCw className="mr-2" />
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaUserMd className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
              <p className="text-sm text-gray-500 max-w-md mb-6">
                {fullData.length === 0 ? "No doctors in the system yet." : "Try adjusting your search or filter criteria."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none transition"
                >
                  <FiRefreshCw className="mr-2" size={16} />
                  Reset Filters
                </button>
                <button
                  onClick={() => setShowFilters(true)}
                  className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium transition"
                >
                  <FiFilter className="mr-2" size={16} />
                  Show Filters
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table 
              data={filteredData} 
              actions={[]}
              excludeColumns={[ "membership", "doctorStatus", "doctorStatusDisplay", "statusColor", "createdAt", "typeOfEnquires", "createdAtTimestamp", "salesmanName", "internalEnquiryType", "internalDoctorType"]}
              extraColumns={extraColumns}
              pagination={true}
              defaultPageSize={10}
              className="min-w-full"
            />
          </div>
        )}
      </div>

      {/* Hidden CSV Link for Export */}
      <CSVLink
        ref={csvLinkRef}
        data={exportData}
        filename={`Doctors_List_${new Date().toISOString().split('T')[0]}.csv`}
        className="hidden"
        target="_blank"
      />

      {/* View Follow-ups Modal */}
      {showViewModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Follow-ups</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRow.drName} • {selectedRow.hospitalName}
                  </p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedRow.followUps && selectedRow.followUps.length === 0 ? (
                <div className="text-center py-8">
                  <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No follow-ups</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No follow-up records found for this doctor.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedRow.followUps.map((fu, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {fu.date}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          By: {fu.createdBy.fullName}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{fu.note}</p>
                      {fu.createdAt && (
                        <p className="text-xs text-gray-500">
                          Created: {fu.createdAt}
                          {fu.createdBy.role && ` • Role: ${fu.createdBy.role}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Follow-up Modal */}
      {showAddModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Add Follow-up</h2>
                  <p className="text-sm text-gray-600 mt-1">For {selectedRow.drName}</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Notes *
                  </label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter detailed notes..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={reminderDateTime.split('T')[0] || ''}
                      onChange={(e) => {
                        const date = e.target.value;
                        const time = reminderDateTime.split('T')[1] || '00:00';
                        setReminderDateTime(`${date}T${time}`);
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={reminderDateTime.split('T')[1] || ''}
                      onChange={(e) => {
                        const date = reminderDateTime.split('T')[0] || new Date().toISOString().split('T')[0];
                        setReminderDateTime(`${date}T${e.target.value}`);
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={followUpType}
                    onChange={(e) => setFollowUpType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="call">Phone Call</option>
                    <option value="visit">Personal Visit</option>
                    <option value="email">Email</option>
                    <option value="message">Message</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reminderAlert"
                    checked={reminderAlert}
                    onChange={(e) => setReminderAlert(e.target.checked)}
                    className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="reminderAlert" className="ml-2 text-sm text-gray-700">
                    Set reminder alert for this follow-up
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewFollowUp}
                  disabled={!newNote.trim() || loading}
                  className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-medium disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Follow-up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalDoctorList;












// import React, { useState, useEffect, useRef, useCallback } from "react";
// import Table from "./Table";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import apiClient, { apiEndpoints } from "../../../services/apiClient";
// import { CSVLink } from "react-csv";
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { 
//   FiFilter, 
//   FiX, 
//   FiDownload, 
//   FiEye, 
//   FiEdit, 
//   FiTrash2, 
//   FiCalendar, 
//   FiUser, 
//   FiMapPin, 
//   FiBriefcase, 
//   FiUsers, 
//   FiMessageSquare, 
//   FiRefreshCw 
// } from "react-icons/fi";

// const TotalDoctorList = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   // Get initial filters from dashboard URL if any
//   const dashboardStatus = searchParams.get("status") || "All";
//   const dashboardMembership = searchParams.get("membership") || "All";

//   // State management for filters (Matching Original UI)
//   const [searchByName, setSearchByName] = useState("");
//   const [sortByStatus, setSortByStatus] = useState(dashboardStatus);
//   const [sortByDateTo, setSortByDateTo] = useState("");
//   const [sortByDateFrom, setSortByDateFrom] = useState("");
//   const [sortByMembership, setSortByMembership] = useState(dashboardMembership);
//   const [searchByCity, setSearchByCity] = useState("");
//   const [searchBySpecialty, setSearchBySpecialty] = useState("");
//   const [searchBySalesman, setSearchBySalesman] = useState("");
//   const [sortByDoctorStatus, setSortByDoctorStatus] = useState("All");
//   const [showFilters, setShowFilters] = useState(false);

//   // Data states
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [exportData, setExportData] = useState([]);
//   const [isExporting, setIsExporting] = useState(false);
//   const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalItems, setTotalItems] = useState(0);

//   // Modal and Menu states
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [newNote, setNewNote] = useState("");
//   const [reminderDateTime, setReminderDateTime] = useState("");
//   const [followUpType, setFollowUpType] = useState("call");
//   const [menuOpen, setMenuOpen] = useState(null);
//   const menuButtonRefs = useRef({});
//   const csvLinkRef = useRef();

//   // Calculate active filters count
//   useEffect(() => {
//     let count = 0;
//     if (searchByName) count++;
//     if (sortByStatus !== "All") count++;
//     if (sortByMembership !== "All") count++;
//     if (searchByCity) count++;
//     if (searchBySpecialty) count++;
//     if (searchBySalesman) count++;
//     if (sortByDateFrom || sortByDateTo) count++;
//     if (sortByDoctorStatus !== "All") count++;
//     setActiveFiltersCount(count);
//   }, [searchByName, sortByStatus, sortByMembership, searchByCity, searchBySpecialty, searchBySalesman, sortByDateFrom, sortByDateTo, sortByDoctorStatus]);

//   // Fetch doctors from server with pagination and filters
//   const fetchDoctors = useCallback(async (page = currentPage, limit = pageSize) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = {
//         page,
//         limit,
//         sort: '-createdAt'
//       };

//       // Map filter states to API parameters
//       if (searchByName) params.search = searchByName;
//       if (sortByStatus !== "All") params.typeOfEnquiry = sortByStatus.toLowerCase().replace(" (priority)", "").replace(" (converted)", "").replace(" (expired)", "").replace(" (not interested)", "");
//       if (sortByMembership !== "All") {
//         if (sortByMembership === "Hospital") params.doctorType = "hospital";
//         else if (sortByMembership === "Individual") params.doctorType = "individual";
//         else if (sortByMembership === "Hospital + Individual") params.doctorType = "hospital_individual";
//       }
//       if (searchByCity) params.city = searchByCity;
//       if (searchBySpecialty) params.specialization = searchBySpecialty;
//       if (searchBySalesman) params.salesmanName = searchBySalesman;
//       if (sortByDoctorStatus !== "All") params.status = sortByDoctorStatus.toLowerCase();
//       if (sortByDateFrom) params.dateFrom = sortByDateFrom;
//       if (sortByDateTo) params.dateTo = sortByDateTo;

//       const response = await apiClient.get(apiEndpoints.doctors.listfortotallist, { params });
      
//       const doctorsData = response.data.data || [];
//       const pagination = response.data.pagination || {};
      
//       // Map API data to UI model
//       const mapped = doctorsData.map((doctor) => {
//         const city = doctor.hospitalAddress?.city ||
//                      doctor.contactDetails?.currentAddress?.city || "";
//         const specialty = doctor.specialization?.[0] || "";
//         const followUps = (doctor.followUps || []).map((fu) => ({
//           note: fu.notes || "",
//           date: fu.date ? new Date(fu.date).toLocaleDateString("en-GB") : "",
//           createdBy: fu.createdBy || { fullName: "Unknown" },
//           salesman: fu.createdBy?.fullName?.charAt(0)?.toUpperCase() || "U",
//         }));

//         return {
//           id: doctor.doctorId || doctor._id,
//           _id: doctor._id,
//           date: doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString("en-GB").replace(/\//g, ".") : "",
//           drName: doctor.fullName || "",
//           contact: doctor.phoneNumber || "",
//           hospitalName: doctor.hospitalName || "",
//           city: city,
//           specialty: specialty,
//           typeOfMembership: doctor.doctorType === "hospital" ? "Hospital" :
//                            doctor.doctorType === "individual" ? "Individual" :
//                            doctor.doctorType === "hospital_individual" ? "Hospital + Individual" :
//                            doctor.doctorType || "Hospital",
//           typeOfEnquires: doctor.typeOfEnquiry ? 
//                          doctor.typeOfEnquiry.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 
//                          "Cold",
//           followUps: followUps,
//           salesmanName: doctor.createdBy?.fullName || "Unknown",
//           doctorStatus: doctor.status || "pending",
//         };
//       });

//       setFilteredData(mapped);
//       setTotalItems(pagination.total || mapped.length);
//     } catch (err) {
//       console.error("Error fetching doctors:", err);
//       setError("Failed to load doctors. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [searchByName, sortByStatus, sortByMembership, searchByCity, searchBySpecialty, searchBySalesman, sortByDoctorStatus, sortByDateFrom, sortByDateTo, currentPage, pageSize]);

//   // Initial fetch and on pagination change
//   useEffect(() => {
//     fetchDoctors(currentPage, pageSize);
//   }, [currentPage, pageSize]);

//   // Handle manual Apply Filters button
//   const handleApplyFilters = () => {
//     setCurrentPage(1);
//     fetchDoctors(1, pageSize);
//   };

//   const handleResetFilters = () => {
//     setSearchByName("");
//     setSortByStatus("All");
//     setSortByDateTo("");
//     setSortByDateFrom("");
//     setSortByMembership("All");
//     setSearchByCity("");
//     setSearchBySpecialty("");
//     setSearchBySalesman("");
//     setSortByDoctorStatus("All");
//     setCurrentPage(1);
//     setTimeout(() => fetchDoctors(1, pageSize), 0);
//   };

//   // Export functions
//   const prepareExportData = () => {
//     const dataToExport = filteredData.map(item => ({
//       'Doctor ID': item.id,
//       'Date': item.date,
//       'Doctor Name': item.drName,
//       'Contact': item.contact,
//       'Hospital Name': item.hospitalName,
//       'City': item.city,
//       'Specialty': item.specialty,
//       'Membership Type': item.typeOfMembership,
//       'Enquiry Status': item.typeOfEnquires,
//       'Salesman': item.salesmanName,
//     }));
//     setExportData(dataToExport);
//     return dataToExport;
//   };

//   const handleExportCSV = () => {
//     prepareExportData();
//     setIsExporting(true);
//     setTimeout(() => {
//       csvLinkRef.current.link.click();
//       setIsExporting(false);
//     }, 500);
//   };

//   // Row actions
//   const handleViewFollowUps = (row) => {
//     setSelectedRow(row);
//     setShowViewModal(true);
//   };

//   const handleViewDoctor = (row) => {
//     navigate(`/view-doctor/${row._id}`);
//   };

//   const handleEdit = (row) => {
//     navigate(`/view-doctor/${row._id}?edit=true`);
//   };

//   const handleAddFollowUp = (row) => {
//     setSelectedRow(row);
//     setNewNote("");
//     setReminderDateTime("");
//     setFollowUpType("call");
//     setShowAddModal(true);
//   };

//   const handleSaveNewFollowUp = async () => {
//     if (selectedRow && newNote.trim()) {
//       try {
//         setLoading(true);
//         await apiClient.post(apiEndpoints.doctors.followup(selectedRow._id), {
//           date: reminderDateTime || new Date(),
//           type: followUpType || "call",
//           notes: newNote,
//         });
//         await fetchDoctors(currentPage, pageSize);
//         setShowAddModal(false);
//       } catch (err) {
//         console.error("Error saving follow-up:", err);
//         setError("Failed to save follow-up.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleDelete = async (row) => {
//     if (window.confirm(`Are you sure you want to delete ${row.drName}?`)) {
//       try {
//         setLoading(true);
//         await apiClient.delete(apiEndpoints.doctors.delete(row._id));
//         await fetchDoctors(currentPage, pageSize);
//       } catch (err) {
//         console.error("Error deleting doctor:", err);
//         setError("Failed to delete doctor.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const extraColumns = [
//     {
//       header: "Specialty",
//       render: (row) => (
//         <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
//           {row.specialty || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Membership",
//       render: (row) => (
//         <span className={`px-2 py-1 rounded text-xs ${
//           row.typeOfMembership === "Hospital" ? "bg-purple-50 text-purple-700" :
//           row.typeOfMembership === "Individual" ? "bg-green-50 text-green-700" :
//           "bg-gray-50 text-gray-700"
//         }`}>
//           {row.typeOfMembership || "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Status",
//       render: (row) => {
//         const colors = {
//           'Hot': 'bg-red-100 text-red-800',
//           'Follow Up': 'bg-yellow-100 text-yellow-800',
//           'Closed': 'bg-green-100 text-green-800',
//           'Cancel': 'bg-gray-100 text-gray-800',
//           'Cold': 'bg-blue-100 text-blue-800'
//         };
//         return (
//           <span className={`px-2 py-1 rounded text-xs ${colors[row.typeOfEnquires] || 'bg-gray-100'}`}>
//             {row.typeOfEnquires}
//           </span>
//         );
//       },
//     },
//     {
//       header: "Actions",
//       render: (row, index) => {
//         const rowId = row._id || index;
//         return (
//           <div className="flex items-center space-x-2">
//             <button onClick={() => handleViewFollowUps(row)} className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded transition" title="View Follow-ups">
//               <FiEye size={16} />
//             </button>
//             <button onClick={() => handleAddFollowUp(row)} className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition" title="Add Follow-up">
//               <FiMessageSquare size={16} />
//             </button>
//             <div className="relative">
//               <button 
//                 onClick={() => setMenuOpen(menuOpen === rowId ? null : rowId)}
//                 className="p-1.5 border border-gray-300 hover:bg-gray-50 rounded transition"
//               >
//                 <span className="text-gray-600">•••</span>
//               </button>
//               {menuOpen === rowId && (
//                 <div className="absolute right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-md z-50 min-w-[160px]">
//                   <button onClick={() => handleViewDoctor(row)} className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b">
//                     <FiEye className="mr-2" size={14} /> View Details
//                   </button>
//                   <button onClick={() => handleEdit(row)} className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b">
//                     <FiEdit className="mr-2" size={14} /> Edit
//                   </button>
//                   <button onClick={() => handleDelete(row)} className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
//                     <FiTrash2 className="mr-2" size={14} /> Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       },
//     }
//   ];

//   return (
//     <div className="p-4 bg-gray-50 w-[80vw] 2xl:w-[84vw] min-h-screen">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Total Doctor List</h1>
//             <p className="text-sm text-gray-600 mt-1">Manage and track all doctors ({totalItems} total)</p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <Link to='/Superadmin/send-message' className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition text-sm">
//               <FiMessageSquare className="mr-2" /> Send Message
//             </Link>
//             <Link to="/Superadmin/dr-followups" className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm">
//               <FiEye className="mr-2" /> View Follow ups
//             </Link>
//             <button onClick={handleExportCSV} className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm">
//               <FiDownload className="mr-2" /> {isExporting ? "Exporting..." : "Export"}
//             </button>
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//           <div className="bg-white rounded-lg p-4 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Doctors</p>
//                 <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
//               </div>
//               <div className="p-2 bg-blue-50 rounded-lg"><FiUsers className="text-blue-600" size={24} /></div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div><p className="text-sm text-gray-600">Page Records</p><p className="text-2xl font-bold text-gray-800">{filteredData.length}</p></div>
//               <div className="p-2 bg-teal-50 rounded-lg"><FiFilter className="text-teal-600" size={24} /></div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div><p className="text-sm text-gray-600">Active Filters</p><p className="text-2xl font-bold text-gray-800">{activeFiltersCount}</p></div>
//               <div className="p-2 bg-purple-50 rounded-lg"><FiFilter className="text-purple-600" size={24} /></div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border">
//             <div className="flex items-center justify-between">
//               <div><p className="text-sm text-gray-600">Actions</p><p className="text-2xl font-bold text-gray-800">Available</p></div>
//               <div className="p-2 bg-green-50 rounded-lg"><FiMessageSquare className="text-green-600" size={24} /></div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters (Matching Original UI Grid) */}
//       <div className="bg-white rounded-lg shadow-sm border mb-6">
//         <div className="p-4 border-b flex justify-between items-center">
//           <div className="flex items-center">
//             <FiFilter className="text-gray-500 mr-2" />
//             <h2 className="font-medium text-gray-800">Filters</h2>
//             {activeFiltersCount > 0 && <span className="ml-2 bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full">{activeFiltersCount} active</span>}
//           </div>
//           <div className="flex items-center space-x-2">
//             {activeFiltersCount > 0 && <button onClick={handleResetFilters} className="text-sm text-gray-600 hover:text-gray-800"><FiRefreshCw className="mr-1" size={14} />Clear All</button>}
//             <button onClick={() => setShowFilters(!showFilters)} className="text-sm text-teal-600 font-medium">
//               {showFilters ? "Hide Filters" : "Show Filters"}
//             </button>
//           </div>
//         </div>

//         {showFilters && (
//           <div className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1"><FiUser className="inline mr-1" size={14} />Search by Name</label>
//                 <input type="text" placeholder="Doctor or hospital..." value={searchByName} onChange={(e) => setSearchByName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status Type</label>
//                 <select value={sortByStatus} onChange={(e) => setSortByStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
//                   <option value="All">All Status</option>
//                   <option value="follow_up">Follow Up</option>
//                   <option value="hot">Hot (Priority)</option>
//                   <option value="closed">Closed (Converted)</option>
//                   <option value="cancel">Cancel (Expired)</option>
//                   <option value="cold">Cold (Not Interested)</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Status</label>
//                 <select value={sortByDoctorStatus} onChange={(e) => setSortByDoctorStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
//                   <option value="All">All Status</option>
//                   <option value="accepted">Accepted</option>
//                   <option value="rejected">Rejected</option>
//                   <option value="active">Active</option>
//                   <option value="pending">Pending</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1"><FiBriefcase className="inline mr-1" size={14} />Membership Type</label>
//                 <select value={sortByMembership} onChange={(e) => setSortByMembership(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
//                   <option value="All">All Memberships</option>
//                   <option value="Hospital">Hospital</option>
//                   <option value="Individual">Individual</option>
//                   <option value="Hospital + Individual">Hospital + Individual</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1"><FiMapPin className="inline mr-1" size={14} />City</label>
//                 <input type="text" placeholder="Enter city..." value={searchByCity} onChange={(e) => setSearchByCity(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
//                 <input type="text" placeholder="Enter specialty..." value={searchBySpecialty} onChange={(e) => setSearchBySpecialty(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1"><FiUser className="inline mr-1" size={14} />Salesman</label>
//                 <input type="text" placeholder="Enter salesman..." value={searchBySalesman} onChange={(e) => setSearchBySalesman(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1"><FiCalendar className="inline mr-1" size={14} />From Date</label>
//                 <input type="date" value={sortByDateFrom} onChange={(e) => setSortByDateFrom(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1"><FiCalendar className="inline mr-1" size={14} />To Date</label>
//                 <input type="date" value={sortByDateTo} onChange={(e) => setSortByDateTo(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
//               <button onClick={handleResetFilters} className="px-4 py-2 border rounded-lg text-sm">Reset</button>
//               <button onClick={handleApplyFilters} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm">Apply Filters</button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Table Section */}
//       <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center p-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//             <p className="mt-4 text-gray-600">Loading data...</p>
//           </div>
//         ) : error ? (
//           <div className="p-10 text-center text-red-600">{error}</div>
//         ) : (
//           <Table 
//             data={filteredData}
//             extraColumns={extraColumns}
//             excludeColumns={["_id", "followUps", "doctorStatus"]}
//             pagination={true}
//             serverPagination={true}
//             totalServerItems={totalItems}
//             currentServerPage={currentPage}
//             defaultPageSize={pageSize}
//             onPageChange={(p) => setCurrentPage(p)}
//             onPageSizeChange={(s) => setPageSize(s)}
//           />
//         )}
//       </div>

//       <CSVLink ref={csvLinkRef} data={exportData} filename="Doctors_List.csv" className="hidden" />

//       {/* Follow-ups Modal */}
//       {showViewModal && selectedRow && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
//             <div className="p-6 border-b flex justify-between items-center">
//               <div><h2 className="text-xl font-semibold">Follow-ups</h2><p className="text-sm text-gray-600 mt-1">{selectedRow.drName} • {selectedRow.hospitalName}</p></div>
//               <button onClick={() => setShowViewModal(false)}><FiX size={24} /></button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-6 space-y-4">
//               {selectedRow.followUps.length === 0 ? <p className="text-center py-10 text-gray-500">No follow-ups found.</p> : 
//                 selectedRow.followUps.map((fu, i) => (
//                   <div key={i} className="border rounded-lg p-4 bg-gray-50">
//                     <div className="flex justify-between mb-2">
//                       <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{fu.date}</span>
//                       <span className="text-xs text-gray-500">By: {fu.createdBy.fullName}</span>
//                     </div>
//                     <p className="text-sm text-gray-700">{fu.note}</p>
//                   </div>
//                 ))
//               }
//             </div>
//             <div className="p-6 border-t flex justify-end"><button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Close</button></div>
//           </div>
//         </div>
//       )}

//       {/* Add Follow-up Modal */}
//       {showAddModal && selectedRow && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//             <div className="flex justify-between mb-4">
//               <h2 className="text-lg font-bold">Add Follow-up for {selectedRow.drName}</h2>
//               <button onClick={() => setShowAddModal(false)}><FiX size={20} /></button>
//             </div>
//             <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} className="w-full p-3 border rounded-lg mb-4" rows={4} placeholder="Enter notes..." />
//             <div className="flex justify-end gap-3 mt-4"><button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button><button onClick={handleSaveNewFollowUp} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm">Save</button></div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TotalDoctorList;
