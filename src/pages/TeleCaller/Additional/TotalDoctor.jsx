

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

      const response = await apiClient.get(apiEndpoints.doctors.list, { params });

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
    navigate(`/sales/addtional/edit-doctor/${doctorId}`);
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

  // Backend already filters the data, so we use the data directly
  // No client-side filtering needed

  // Reset to page 1 whenever filters change (this will trigger fetchDoctors via currentPage dependency)
  useEffect(() => {
    setCurrentPage(1);
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
            data={data}
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