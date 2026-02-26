// src/pages/Admin/Advocates/AdvocateBills.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/mainComponents/Table";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { Link } from "react-router-dom";
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const AdvocateBills = () => {
  const navigate = useNavigate();
  const [allBills, setAllBills] = useState([]); // Store all bills from API
  const [filteredBills, setFilteredBills] = useState([]); // Store filtered bills
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // sirf serious errors ke liye
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    advocate: "",
    doctor: "",
    caseNo: "",
    caseType: "",
  });

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: 1,
        limit: 1000000
      };

      const response = await apiClient.get(apiEndpoints.advocateBills.list, { params: queryParams });
      const bills = response.data.data || [];
      setAllBills(bills);
      setFilteredBills(bills); // Initially show all bills
    } catch (err) {
      console.error('Error fetching advocate bills:', err);
      // Sirf serious error pe message dikhao, normal empty result pe nahi
      if (err.response?.status >= 500 || !err.response) {
        setError('Something went wrong. Please try again later.');
      }
      setAllBills([]);
      setFilteredBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Apply filters whenever search term or filters change
  useEffect(() => {
    let result = [...allBills];

    // Apply global search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(bill =>
        (bill.caseNo && bill.caseNo.toLowerCase().includes(term)) ||
        (bill.caseType && bill.caseType.toLowerCase().includes(term)) ||
        (bill.advocate?.fullName && bill.advocate.fullName.toLowerCase().includes(term)) ||
        (bill.doctor?.fullName && bill.doctor.fullName.toLowerCase().includes(term)) ||
        (bill.advocate?.barCouncilNumber && bill.advocate.barCouncilNumber.toLowerCase().includes(term)) ||
        (bill.doctor?.doctorId && bill.doctor.doctorId.toLowerCase().includes(term))
      );
    }

    // Apply individual filters
    if (filters.advocate) {
      const advocateFilter = filters.advocate.toLowerCase();
      result = result.filter(bill =>
        bill.advocate?.fullName && bill.advocate.fullName.toLowerCase().includes(advocateFilter)
      );
    }

    if (filters.doctor) {
      const doctorFilter = filters.doctor.toLowerCase();
      result = result.filter(bill =>
        bill.doctor?.fullName && bill.doctor.fullName.toLowerCase().includes(doctorFilter)
      );
    }

    if (filters.caseNo) {
      const caseNoFilter = filters.caseNo.toLowerCase();
      result = result.filter(bill =>
        bill.caseNo && bill.caseNo.toLowerCase().includes(caseNoFilter)
      );
    }

    if (filters.caseType) {
      result = result.filter(bill =>
        bill.caseType === filters.caseType
      );
    }

    setFilteredBills(result);
  }, [searchTerm, filters, allBills]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      advocate: "",
      doctor: "",
      caseNo: "",
      caseType: "",
    });
  };

  // Action handlers (same as before)
  const handleView = (row) => {
    navigate(`/admin/advocate-bill/${row._id}`, { state: { viewMode: true, bill: row } });
  };

  const handleEdit = (row) => {
    navigate(`/admin/edit-advocate-bill/${row._id}`, { state: { bill: row } });
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete bill for ${row.advocate?.fullName}?`)) return;

    try {
      setLoading(true);
      await apiClient.delete(apiEndpoints.advocateBills.delete(row._id));
      await fetchBills();
      alert("Advocate bill deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete advocate bill');
    } finally {
      setLoading(false);
    }
  };

  const handleHistory = (row) => {
    navigate(`/admin/advocate-history/${row.advocate?._id}`, {
      state: { advocateName: row.advocate?.fullName }
    });
  };

  const handleExport = () => {
    try {
      const exportData = filteredBills.map(bill => ({
        'Bill ID': bill._id,
        'Date': bill.createdAt ? format(new Date(bill.createdAt), 'dd/MM/yyyy') : '-',
        'Advocate Name': bill.advocate?.fullName || '-',
        'Advocate ID': bill.advocate?.barCouncilNumber || '-',
        'Doctor Name': bill.doctor?.fullName || '-',
        'Doctor ID': bill.doctor?.doctorId || '-',
        'Case No': bill.caseNo || '-',
        'Case Type': bill.caseType || '-',
        'Stages': bill.stages?.map(s => s.stage).join(', ') || '-',
        'Subtotal (₹)': bill.totals?.subtotal || 0,
        'GST Total (₹)': bill.totals?.gstTotal || 0,
        'Discount (₹)': bill.totals?.disc || 0,
        'Final Total (₹)': bill.totals?.finalTotal || 0,
        'Created By': bill.createdBy?.fullName || '-',
        'Remark': bill.remark || '-'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Advocate Bills");
      XLSX.writeFile(wb, `advocate-bills-${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
    } catch (err) {
      alert('Failed to export data');
    }
  };

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Advocate Bills</h2>
        <div className="flex gap-3 mt-3 md:mt-0">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium flex items-center gap-2"
          >
            Export to Excel
          </button>
          <Link to="/admin/create-advocate-bill">
            <button className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium">
              Create New Bill
            </button>
          </Link>
        </div>
      </div>

      {/* Sirf serious error pe dikhega */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Loading advocate bills...
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by Case No, Type, etc."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        />

        <input
          type="text"
          placeholder="Search by Advocate name "
          value={filters.advocate}
          onChange={(e) => handleFilterChange('advocate', e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        />

        <input
          type="text"
          placeholder="Search by Doctor name "
          value={filters.doctor}
          onChange={(e) => handleFilterChange('doctor', e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        />

        <input
          type="text"
          placeholder="Search by Case No"
          value={filters.caseNo}
          onChange={(e) => handleFilterChange('caseNo', e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        />

        <select
          value={filters.caseType}
          onChange={(e) => handleFilterChange('caseType', e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
        >
          <option value="">All Case Types</option>
          <option value="Civil">Civil</option>
          <option value="Criminal">Criminal</option>
          <option value="Consumer">Consumer</option>
        </select>

        <button
          onClick={clearFilters}
          className="p-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* No data message - sabse clean tarika */}
      {filteredBills.length === 0 && !loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">
          {searchTerm || Object.values(filters).some(f => f)
            ? "No advocate bills found matching your filters."
            : "No advocate bills found. Create your first bill!"}
        </div>
      ) : (
        <Table
          data={filteredBills.map(bill => ({
            ...bill,
            advocateName: bill.advocate?.fullName || '-',
            doctorName: bill.doctor?.fullName || '-',
            caseDetails: `${bill.caseNo} (${bill.caseType})`,
            amount: `₹${bill.totals?.finalTotal?.toLocaleString() || 0}`,
            date: bill.createdAt ? format(new Date(bill.createdAt), 'dd/MM/yyyy') : '-',
            createdByName: bill.createdBy?.fullName || '-',
          }))}
          extraColumns={[{
            header: "Actions",
            render: (row) => (
              <div className="flex gap-2 justify-center">
                <button onClick={() => handleView(row)} className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700">
                  View
                </button>
                <button onClick={() => handleEdit(row)} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">
                  Edit
                </button>
                <button onClick={() => handleHistory(row)} className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700" title="View all bills for this advocate">
                  History
                </button>
                <button onClick={() => handleDelete(row)} className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700">
                  Delete
                </button>
              </div>
            ),
          }]}
          excludeColumns={['stages', 'totals', 'advocate', 'doctor', 'createdBy','createdAt', 'updatedBy' , 'updatedAt', 'overallGst', 'otherCharges', 'discount', 'remark', '__v']}
          columnOrder={['date', 'advocateName', 'doctorName', 'caseDetails', 'amount', 'createdByName']}
          pagination={true}
        />
      )}
    </div>
  );
};

export default AdvocateBills;