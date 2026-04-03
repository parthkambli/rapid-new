import React, { useState, useEffect, useMemo } from "react";
import { Share2, UserCircle, X, Users, MapPin, Stethoscope, IdCard, ArrowRightCircle, ChevronLeft, ChevronRight, Search, History } from "lucide-react";
import apiClient from '../../../services/apiClient';
import { toast } from 'react-toastify';

const TransferDoctor = () => {
  const [activeTab, setActiveTab] = useState("my-calls");

  const [taskCalls, setTaskCalls] = useState([]);
  const [myAddedDoctors, setMyAddedDoctors] = useState([]);
  const [transferredDoctors, setTransferredDoctors] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]);

  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [salesmenList, setSalesmenList] = useState([]);

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPagesState, setTotalPagesState] = useState(0);

  // Server-side search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch functions adapted for Salesman with server-side pagination
  const fetchMyTaskCalls = async () => {
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      
      const res = await apiClient.get('/tasks/telecallertask/my-calls', { params });
      if (res.data.success) {
        setTaskCalls(res.data.data || []);
        if (res.data.pagination) {
          setTotalRecords(res.data.pagination.total);
          setTotalPagesState(res.data.pagination.pages);
        }
      }
    } catch (err) {
      setTaskCalls([]);
    }
  };

  const fetchMyAddedDoctors = async () => {
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      
      const res = await apiClient.get('/salesman/doctors', { params });
      if (res.data.success) {
        // For "my-calls" tab, show only doctors NOT transferred to me
        const onlyMyAdded = (res.data.data || []).filter(doc => !doc.isTransferredToMe);
        setMyAddedDoctors(onlyMyAdded);
        if (res.data.pagination) {
          setTotalRecords(res.data.pagination.total);
          setTotalPagesState(res.data.pagination.pages);
        }
      }
    } catch (err) {
      toast.error("Failed to load your added doctors");
    }
  };

  const fetchTransferredDoctors = async () => {
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      
      // Use the new endpoint that returns only doctors transferred TO the current user
      const res = await apiClient.get('/salesman/transferred-to-me', { params });
      if (res.data.success) {
        const allDoctors = res.data.data || [];
        setTransferredDoctors(allDoctors);
        if (res.data.pagination) {
          setTotalRecords(res.data.pagination.total);
          setTotalPagesState(res.data.pagination.pages);
        }
      }
    } catch (err) {
      toast.error("Failed to load transferred doctors");
    }
  };

  const fetchAssignedTasks = async () => {
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      
      const res = await apiClient.get('/tasks/telecallertask/assigned-to-me', { params });
      if (res.data.success) {
        setAssignedTasks(res.data.data || []);
        if (res.data.pagination) {
          setTotalRecords(res.data.pagination.total);
          setTotalPagesState(res.data.pagination.pages);
        }
      }
    } catch (err) {
      setAssignedTasks([]);
    }
  };

  const fetchTransferHistory = async () => {
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      
      // Fetch doctors that I transferred to others
      const res = await apiClient.get('/salesman/transfer-history', { params });
      if (res.data.success) {
        setTransferHistory(res.data.data || []);
        if (res.data.pagination) {
          setTotalRecords(res.data.pagination.total);
          setTotalPagesState(res.data.pagination.pages);
        }
      }
    } catch (err) {
      toast.error("Failed to load transfer history");
    }
  };

  useEffect(() => {
    setLoading(true);
    if (activeTab === "my-calls") {
      Promise.all([fetchMyTaskCalls(), fetchMyAddedDoctors()]).finally(() => setLoading(false));
    } else if (activeTab === "assigned-to-me") {
      Promise.all([fetchAssignedTasks(), fetchTransferredDoctors()]).finally(() => setLoading(false));
    } else if (activeTab === "transfer-history") {
      fetchTransferHistory().finally(() => setLoading(false));
    }
  }, [activeTab, currentPage, itemsPerPage, debouncedSearch]);

  // MERGE DATA
  useEffect(() => {
    let merged = [];

    if (activeTab === "my-calls") {
      merged = [
        ...taskCalls.map(item => ({
          ...item,
          itemType: 'task',
          isTransferredToMe: false,
          callEntryId: item.callEntryId,
          doctorId: item.doctor?._id,
          doctor: item.doctor || { fullName: 'Unknown', hospitalName: 'N/A' },
        })),
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
          callEntryId: item.callEntryId,
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
    } else if (activeTab === "transfer-history") {
      merged = transferHistory.map(doc => ({
        ...doc,
        itemType: 'doctor',
        isTransferredByMe: true,
        doctorId: doc._id,
        doctor: {
          fullName: doc.fullName || 'Dr. Unknown',
          hospitalName: doc.hospitalName || 'N/A',
          city: doc.hospitalAddress?.city || doc.contactDetails?.currentAddress?.city || 'N/A',
          specialization: Array.isArray(doc.specialization) ? doc.specialization.join(', ') : (doc.specialization || 'General'),
          membershipId: doc.membershipId || doc.doctorId || '—'
        },
        doctorTaskStatus: doc.doctorStatus || 'cold',
        source: { type: 'transferred_by_me', label: 'Transferred by Me' },
        scheduledDate: doc.transferredAt || doc.createdAt || new Date(),
        transferredTo: doc.transferredTo,
        transferReason: doc.transferReason || 'Transfer'
      }));
    }

    setCombinedData(merged);
  }, [activeTab, taskCalls, myAddedDoctors, assignedTasks, transferredDoctors, transferHistory]);

  const getSourceLabel = (source) => {
    if (!source?.label) return 'Unknown';
    if (source.label === 'My Added') return 'bg-purple-100 text-purple-700';
    if (source.label === 'Transferred to Me') return 'bg-orange-100 text-orange-700';
    if (source.label === 'Transferred by Me') return 'bg-blue-100 text-blue-700';
    if (source.label === 'Salesman Added') return 'bg-indigo-100 text-indigo-700';
    if (source.label === 'Renewal Call') return 'bg-pink-100 text-pink-700';
    if (source.label === 'Service Call') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getSourceColor = (row) => {
    const label = row.source?.label;
    if (label === 'My Added') return 'bg-purple-100 text-purple-700';
    if (row.isTransferredToMe) return 'bg-orange-100 text-orange-700';
    if (row.isTransferredByMe) return 'bg-blue-100 text-blue-700';
    if (label === 'Salesman Added') return 'bg-indigo-100 text-indigo-700';
    if (label === 'Renewal Call') return 'bg-pink-100 text-pink-700';
    if (label === 'Service Call') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  const fetchSalesmenList = async () => {
    try {
      const res = await apiClient.get('/employees/rolefor-telecaller/salesman');
      if (res.data.success) {
        setSalesmenList(res.data.data.map(u => ({
          id: u._id,
          userId: u.user,
          name: u.fullName || "Unknown Salesman",
        })));
      }
    } catch (err) {
      toast.error("Failed to load salesmen");
    }
  };

  const openTransferModal = (row) => {
    let transferId;
    if (row.itemType === 'task') {
      transferId = row.callEntryId;
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

    fetchSalesmenList();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleTransfer = async (targetSalesman) => {
    if (!selectedItem?.id || !targetSalesman?.userId) {
      toast.error("Invalid selection");
      return;
    }

    try {
      if (selectedItem.itemType === 'task') {
        await apiClient.post(`/tasks/transfer-call/${selectedItem.id}`, {
          newTelecallerId: targetSalesman.userId,
          transferNote: "Transferred from Salesman dashboard"
        });
      } else {
        // Use the newly created salesman doctor transfer endpoint
        await apiClient.post('/salesman/transfer-doctor', {
          doctorId: selectedItem.id,
          newAssignedTo: targetSalesman.userId,
          reason: "Transferred via Salesman dashboard"
        });
      }

      toast.success(`Transferred to ${targetSalesman.name}`);
      closeModal();

      if (activeTab === "my-calls") {
        await Promise.all([fetchMyTaskCalls(), fetchMyAddedDoctors()]);
      } else if (activeTab === "assigned-to-me") {
        await Promise.all([fetchAssignedTasks(), fetchTransferredDoctors()]);
      } else if (activeTab === "transfer-history") {
        await fetchTransferHistory();
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

  // Use combinedData directly since it's already server-side filtered and paginated
  const displayData = combinedData;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPagesState) {
      setCurrentPage(page);
    }
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
            {activeTab === "my-calls" ? "My Doctors & Visits" : activeTab === "assigned-to-me" ? "Assigned to Me" : "Transfer History"}
          </h2>
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
            <button onClick={() => { setActiveTab("my-calls"); setCurrentPage(1); }} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "my-calls" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
              My Doctors ({totalRecords})
            </button>
            <button onClick={() => { setActiveTab("assigned-to-me"); setCurrentPage(1); }} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${activeTab === "assigned-to-me" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
              <Users size={14} /> Assigned ({totalRecords})
            </button>
            <button onClick={() => { setActiveTab("transfer-history"); setCurrentPage(1); }} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${activeTab === "transfer-history" ? "bg-[#15BBB3] text-white" : "text-gray-600"}`}>
              <History size={14} /> History ({totalRecords})
            </button>
          </div>
        </div>

        {activeTab === "assigned-to-me" && totalRecords > 0 && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm flex items-center gap-2">
            <ArrowRightCircle size={18} />
            <span>These doctors were transferred to you</span>
          </div>
        )}

        {activeTab === "transfer-history" && totalRecords > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm flex items-center gap-2">
            <History size={18} />
            <span>Doctors you have transferred to other salesmen</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15BBB3] focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {displayData.length === 0 && !loading ? (
            <div className="p-12 text-center text-gray-400">
              <Users size={48} className="mx-auto mb-3 opacity-50" />
              <p>{searchQuery ? 'No results found for your search' : 'No data found'}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[1000px]">
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
                      {activeTab === "transfer-history" && <th className="px-3 py-2.5 text-left font-bold">Transferred To</th>}
                      {activeTab === "my-calls" && <th className="px-3 py-2.5 text-center font-bold">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayData.map((row, i) => (
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
                              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 w-fit ${row.isTransferredToMe ? 'bg-orange-100 text-orange-700' : row.isTransferredByMe ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                {row.isTransferredToMe ? 'Transferred to Me' : row.isTransferredByMe ? 'Transferred by Me' : 'My Added'}
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
                        {activeTab === "transfer-history" && (
                          <td className="px-3 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">
                                {row.transferredTo?.fullName || 'Unknown'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {row.transferReason || 'Transfer'}
                              </span>
                            </div>
                          </td>
                        )}
                        {activeTab === "my-calls" && (
                          <td className="px-3 py-3 text-center">
                            <button
                              onClick={() => openTransferModal(row)}
                              className="bg-[#15BBB3] hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 mx-auto shadow transition"
                            >
                              <Share2 size={14} /> Transfer
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>Showing</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#15BBB3]"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>of {totalRecords} results</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPagesState || 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: Math.min(5, totalPagesState) }, (_, i) => {
                      let pageNum;
                      if (totalPagesState <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPagesState - 2) {
                        pageNum = totalPagesState - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded border text-sm font-medium transition ${
                            currentPage === pageNum
                              ? 'bg-[#15BBB3] text-white border-[#15BBB3]'
                              : 'border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPagesState}
                      className="px-3 py-1 rounded border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
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
              Select salesman for: <strong>Dr. {selectedItem?.doctor?.fullName || 'Unknown'}</strong>
              <span className="text-xs ml-2 text-gray-500">
                ({selectedItem?.itemType === 'task' ? 'Visit Task' : 'My Doctor'})
              </span>
            </p>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {salesmenList.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No salesmen available</p>
              ) : (
                salesmenList.map(s => (
                  <div key={s.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#15BBB3] text-white p-2 rounded-full"><UserCircle size={28} /></div>
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-xs text-gray-500">Salesman</p>
                      </div>
                    </div>
                    <button onClick={() => handleTransfer(s)} className="bg-[#15BBB3] hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
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