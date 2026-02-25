import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Table from "./Table";
import { Link, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { toast } from 'react-toastify';

const AcceptDoctor = () => {
  const navigate = useNavigate();
  const [searchByName, setSearchByName] = useState("");
  const [sortByStatus, setSortByStatus] = useState("All");
  const [sortByDateTo, setSortByDateTo] = useState("");
  const [sortByDateFrom, setSortByDateFrom] = useState("");
  const [sortByMembership, setSortByMembership] = useState("All");
  const [searchByCity, setSearchByCity] = useState("");
  const [searchBySpecialty, setSearchBySpecialty] = useState("");
  const [searchByCreatedBy, setSearchByCreatedBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data, setData] = useState([]);

  // Add pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [limit, setLimit] = useState(10); // Default items per page

  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [newNote, setNewNote] = useState("");
  const [reminderDateTime, setReminderDateTime] = useState("");
  const [role, setRole] = useState("Salesman");
  const [rejectionReason, setRejectionReason] = useState("");

  /* ----------------------  DATA FETCHING  ---------------------- */
  useEffect(() => {
    fetchPendingDoctors(1); // Start with page 1
  }, []);

  const fetchPendingDoctors = async (page = 1) => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: page,
        limit: limit
      });

      // Add filter parameters if they have values
      if (searchByName) params.append('search', searchByName);
      if (sortByStatus && sortByStatus !== 'All') params.append('typeOfEnquiry', sortByStatus);
      if (searchByCity) params.append('city', searchByCity);
      if (searchBySpecialty) params.append('specialization', searchBySpecialty);
      if (searchByCreatedBy) params.append('createdBy', searchByCreatedBy);
      if (sortByMembership && sortByMembership !== 'All') params.append('doctorType', sortByMembership.toLowerCase());
      if (sortByDateFrom) params.append('dateFrom', sortByDateFrom);
      if (sortByDateTo) params.append('dateTo', sortByDateTo);

      const response = await apiClient.get(`${apiEndpoints.doctors.pending}?${params.toString()}`);
      if (response.data.success) {
        // Format the data for the table
        const formattedData = response.data.data.map(doctor => ({
          id: doctor._id,
          date: new Date(doctor.createdAt).toLocaleDateString('en-GB'),
          drName: doctor.fullName,
          contact: doctor.phoneNumber || doctor.contactDetails?.phoneNumber,
          hospitalName: doctor.hospitalName,
          city: doctor.hospitalAddress?.city || doctor.contactDetails?.currentAddress?.city,
          specialty: doctor.specialization?.join(', ') || 'N/A',
          typeOfMembership: doctor.doctorType?.toUpperCase() || 'N/A',
          typeOfEnquires: doctor.typeOfEnquiry || 'N/A',
          status: doctor.status,
          doctorStatus: doctor.doctorStatus,
          createdBy: doctor.createdBy?.fullName || 'Unknown',
          email: doctor.email,
          whatsapp: doctor.whatsappNumber || doctor.contactDetails?.whatsapp,
          qualification: doctor.qualification || 'N/A',
          experience: doctor.experience || 'N/A',
          followUps: doctor.followUps || []
        }));
        setData(formattedData);
        setPagination(response.data.pagination || { current: 1, pages: 1, total: 0 });
      } else {
        toast.error(response.data.message || 'Failed to fetch pending doctors');
      }
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
      setError(error.message);
      toast.error('Error fetching pending doctors');
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      fetchPendingDoctors(page);
    }
  };

  const goToNextPage = () => {
    if (pagination.current < pagination.pages) {
      fetchPendingDoctors(pagination.current + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.current > 1) {
      fetchPendingDoctors(pagination.current - 1);
    }
  };

  const handleView = (row) => {
    setSelectedRow(row);
    setShowViewModal(true);
  };

  const handleAdd = (row) => {
    setSelectedRow(row);
    setShowAddModal(true);
  };

  const handleViewDoctor = (row) => {
    navigate(`/view-doctor/${row.id}`);   // Navigate to doctor detail page
  };

  const handleEdit = (row) => {
    navigate(`/admin/doctors/${row.id}/edit`);   // Navigate to edit page
  };

  const handleAccept = (row) => {
    setSelectedRow(row);
    setShowAcceptModal(true);
  };

  const handleReject = (row) => {
    setSelectedRow(row);
    setRejectionReason('');  // Reset reason
    setShowRejectModal(true);
  };

  const handleAcceptDoctor = async () => {
    if (!selectedRow) return;

    try {
      const response = await apiClient.put(apiEndpoints.doctors.accept(selectedRow.id), {});
      if (response.data.success) {
        toast.success('Doctor approved successfully');
        fetchPendingDoctors(pagination.current);  // Refresh the list
        setShowAcceptModal(false);
      } else {
        toast.error(response.data.message || 'Failed to approve doctor');
      }
    } catch (error) {
      console.error('Error accepting doctor:', error);
      toast.error('Error approving doctor');
    }
  };

  const handleRejectDoctor = async () => {
    if (!selectedRow || !rejectionReason.trim()) return;

    try {
      const response = await apiClient.put(
        apiEndpoints.doctors.reject(selectedRow.id),
        { rejectionReason: rejectionReason.trim() }
      );
      if (response.data.success) {
        toast.success('Doctor rejected successfully');
        fetchPendingDoctors(pagination.current);  // Refresh the list
        setShowRejectModal(false);
      } else {
        toast.error(response.data.message || 'Failed to reject doctor');
      }
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      toast.error('Error rejecting doctor');
    }
  };

  const handleSaveNewFollowUp = () => {
    if (selectedRow && newNote.trim()) {
      // Future implementation for adding follow-ups
      setNewNote("");
      setReminderDateTime("");
      setShowAddModal(false);
    }
  };

  // When filters change, we need to fetch data again with API-level filtering
  useEffect(() => {
    // Reset to page 1 when filters change and fetch updated data
    fetchPendingDoctors(1);
  }, [searchByName, sortByStatus, searchByCity, searchBySpecialty, searchByCreatedBy, sortByMembership, sortByDateFrom, sortByDateTo, limit]);

  /* ----------------------  TABLE ACTIONS  ---------------------- */
  const actions = [
    {
      label: "View Doctor",
      onClick: handleViewDoctor,
      showAsIcon: true,
      icon: <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">View</span>,
    },
    {
      label: "Accept",
      onClick: handleAccept,
      showAsIcon: true,
      icon: <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">Accept</span>,
    },
    {
      label: "Reject",
      onClick: handleReject,
      showAsIcon: true,
      icon: <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">Reject</span>,
    },
    {
      label: "View Details",
      onClick: (row) => {
        setSelectedRow(row);
        setShowViewModal(true);
      },
      useDropdown: true,
    },
  ];

  const extraColumns = [
    {
      header: "Type Of Membership",
      render: (row) => row.typeOfMembership,
    },
    {
      header: "Type Of Enquiries",
      render: (row) => (
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            row.typeOfEnquiries?.toLowerCase() === 'hot' ? 'bg-red-500' :
            row.typeOfEnquiries?.toLowerCase() === 'warm' ? 'bg-yellow-500' : 'bg-gray-500'
          }`}></div>
          {row.typeOfEnquiries}
        </div>
      ),
    },
    {
      header: "Created By",
      render: (row) => row.createdBy,
    },
    {
      header: "Specialty",
      render: (row) => row.specialty,
    },
    {
      header: "Follow Ups",
      render: (row) => (
        <span className="text-sm text-gray-800">{row.followUps?.length || 0} follow-ups</span>
      ),
    },
  ];

  /* ----------------------  RENDER  ---------------------- */
  return (
    <div className="p-2 min-h-screen bg-white max-w-[79vw]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Accept Doctor</h1>
        <div className="flex space-x-2">
          <button
            className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm"
            onClick={() => fetchPendingDoctors(pagination.current)}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search By Name"
          value={searchByName}
          onChange={(e) => setSearchByName(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
        />
        <select
          value={sortByStatus}
          onChange={(e) => setSortByStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
        >
          <option value="All">All Status</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
          <option value="follow_up">Follow Up</option>
          <option value="closed">Closed</option>
          <option value="cancel">Cancel</option>
        </select>
        <input
          type="date"
          placeholder="From Date"
          value={sortByDateFrom}
          onChange={(e) => setSortByDateFrom(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
        />
        <input
          type="date"
          placeholder="To Date"
          value={sortByDateTo}
          onChange={(e) => setSortByDateTo(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
        />
      </div>

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <select
          value={sortByMembership}
          onChange={(e) => setSortByMembership(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
        >
          <option value="All">All Memberships</option>
          <option value="HOSPITAL">Hospital</option>
          <option value="INDIVIDUAL">Individual</option>
          <option value="HOSPITAL + INDIVIDUAL">Hospital + Individual</option>
        </select>
        <input
          type="text"
          placeholder="Search By City"
          value={searchByCity}
          onChange={(e) => setSearchByCity(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
        />
        <input
          type="text"
          placeholder="Search By Specialty"
          value={searchBySpecialty}
          onChange={(e) => setSearchBySpecialty(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
        />
        <input
          type="text"
          placeholder="Search By Created By User"
          value={searchByCreatedBy}
          onChange={(e) => setSearchByCreatedBy(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-auto bg-gray-100"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading pending doctors...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading doctors: {error}</p>
        </div>
      ) : (
        <div>
          <Table data={data} actions={actions} extraColumns={extraColumns} />

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4 p-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Page {pagination.current} of {pagination.pages} ({pagination.total} total)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => goToPage(1)}
                  disabled={pagination.current === 1}
                  className={`px-3 py-1 rounded-md text-sm ${
                    pagination.current === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  First
                </button>

                <button
                  onClick={goToPrevPage}
                  disabled={pagination.current === 1}
                  className={`px-3 py-1 rounded-md text-sm ${
                    pagination.current === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>

                {/* Page number buttons */}
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = Math.min(pagination.current + i - 2, pagination.pages);
                  if (pageNum >= 1 && pageNum <= pagination.pages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          pagination.current === pageNum
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={goToNextPage}
                  disabled={pagination.current === pagination.pages}
                  className={`px-3 py-1 rounded-md text-sm ${
                    pagination.current === pagination.pages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>

                <button
                  onClick={() => goToPage(pagination.pages)}
                  disabled={pagination.current === pagination.pages}
                  className={`px-3 py-1 rounded-md text-sm ${
                    pagination.current === pagination.pages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Last
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Items per page:</label>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    fetchPendingDoctors(1); // Reset to first page when changing limit
                  }}
                  className="p-1 border border-gray-300 rounded-md text-sm bg-gray-100"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------- View Doctor Details Modal -------- */}
      {showViewModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Doctor Details: {selectedRow.drName}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Contact:</strong> {selectedRow.contact}</div>
              <div><strong>Email:</strong> {selectedRow.email}</div>
              <div><strong>WhatsApp:</strong> {selectedRow.whatsapp}</div>
              <div><strong>Hospital:</strong> {selectedRow.hospitalName}</div>
              <div><strong>City:</strong> {selectedRow.city}</div>
              <div><strong>Specialty:</strong> {selectedRow.specialty}</div>
              <div><strong>Qualification:</strong> {selectedRow.qualification}</div>
              <div><strong>Experience:</strong> {selectedRow.experience}</div>
              <div><strong>Membership Type:</strong> {selectedRow.typeOfMembership}</div>
              <div><strong>Enquiry Status:</strong> {selectedRow.typeOfEnquiries}</div>
              <div><strong>Doctor Status:</strong> {selectedRow.doctorStatus}</div>
              <div><strong>Created By:</strong> {selectedRow.createdBy}</div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold mb-2">Follow-ups</h3>
              {selectedRow.followUps?.length > 0 ? (
                <div className="space-y-2">
                  {selectedRow.followUps.map((fu, idx) => (
                    <div key={idx} className="border-b pb-2">
                      <p className="font-medium">{fu.notes || fu.note}</p>
                      <p className="text-sm text-gray-500">{new Date(fu.date).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Created by: {fu.createdBy?.fullName}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No follow ups</p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------- Accept Doctor Modal -------- */}
      {showAcceptModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Accept Doctor</h2>
            <p className="mb-4">Are you sure you want to accept <strong>{selectedRow.drName}</strong>?</p>

            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptDoctor}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------- Reject Doctor Modal -------- */}
      {showRejectModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Reject Doctor</h2>
            <p className="mb-4">Are you sure you want to reject <strong>{selectedRow.drName}</strong>?</p>

            <div className="mb-4">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Enter reason for rejection..."
                required
              />
            </div>

            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectDoctor}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                disabled={!rejectionReason.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptDoctor;