// src/pages/Admin/Experts/ExpertBills.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/mainComponents/Table";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { Link } from "react-router-dom";
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const ExpertBills = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    expert: "",
    doctor: "",
    caseNo: "",
    caseType: "",
  });
  const [experts, setExperts] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const fetchBills = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = { page: 1, limit: 100000, ...params };
      const response = await apiClient.get(apiEndpoints.expertBills.list, { params: queryParams });
      setBills(response.data.data || []);
    } catch (err) {
      console.error('Error fetching expert bills:', err);
      setError(err.response?.data?.message || 'Failed to fetch expert bills');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterData = async () => {
    try {
      const expertsResponse = await apiClient.get('/experts', { params: { page: 1, limit: 1000 } });
      setExperts(expertsResponse.data.data || []);

      const doctorsResponse = await apiClient.get(apiEndpoints.doctors.list, { params: { page: 1, limit: 1000 } });
      setDoctors(doctorsResponse.data.data || []);
    } catch (err) {
      console.error('Error fetching filter data:', err);
    }
  };

  useEffect(() => {
    fetchBills();
    fetchFilterData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filters.expert) params.expert = filters.expert;
      if (filters.doctor) params.doctor = filters.doctor;
      if (filters.caseNo) params.caseNo = filters.caseNo;
      if (filters.caseType) params.caseType = filters.caseType;
      fetchBills(params);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleView = (row) => navigate(`/admin/expert-bill/${row._id}`);
  const handleEdit = (row) => navigate(`/admin/edit-expert-bill/${row._id}`);
  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete bill for ${row.expert?.fullName || row.expert?.name || 'this expert'}?`)) return;
    try {
      setLoading(true);
      await apiClient.delete(apiEndpoints.expertBills.delete(row._id));
      await fetchBills();
      alert("Expert bill deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete expert bill');
    } finally {
      setLoading(false);
    }
  };

  const handleHistory = (row) => {
    navigate(`/admin/expert-history/${row.expert?._id}`, { state: { expertName: row.expert?.fullName || row.expert?.name } });
  };

  const handleExport = () => {
    try {
      const exportData = bills.map(bill => ({
        'Bill ID': bill._id,
        'Date': bill.createdAt ? format(new Date(bill.createdAt), 'dd/MM/yyyy') : '-',
        'Expert Name': bill.expert?.fullName || bill.expert?.name || '-',
        'Doctor Name': bill.doctor?.fullName || '-',
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
      XLSX.utils.book_append_sheet(wb, ws, "Expert Bills");
      XLSX.writeFile(wb, `expert-bills-${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
    } catch (err) {
      alert('Failed to export data');
    }
  };

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Expert Bills</h2>
        <div className="flex gap-3 mt-3 md:mt-0">
          <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium flex items-center gap-2">
            Export to Excel
          </button>
          <Link to="/admin/create-expert-bill">
            <button className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium">
              Create New Bill
            </button>
          </Link>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      {loading && <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">Loading expert bills...</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        <input type="text" placeholder="Search by Case No, Type, etc." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]" />

        <select value={filters.expert} onChange={(e) => handleFilterChange('expert', e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]">
          <option value="">All Experts</option>
          {experts.map((exp) => (
            <option key={exp._id} value={exp._id}>{exp.fullName || exp.name}</option>
          ))}
        </select>

        <select value={filters.doctor} onChange={(e) => handleFilterChange('doctor', e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]">
          <option value="">All Doctors</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>{doc.fullName}</option>
          ))}
        </select>

        <input type="text" placeholder="Case No" value={filters.caseNo} onChange={(e) => handleFilterChange('caseNo', e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]" />

        <select value={filters.caseType} onChange={(e) => handleFilterChange('caseType', e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]">
          <option value="">All Case Types</option>
          <option value="Medicolegal">Medicolegal</option>
          <option value="Insurance Dispute">Insurance Dispute</option>
          <option value="Consent Issue">Consent Issue</option>
          <option value="Consumer Dispute">Consumer Dispute</option>
          <option value="Other">Other</option>
        </select>

        <button onClick={() => { setSearchTerm(""); setFilters({ expert: "", doctor: "", caseNo: "", caseType: "" }); }}
          className="p-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300">
          Clear Filters
        </button>
      </div>

      {bills.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">
          No expert bills found. {searchTerm || Object.values(filters).some(f => f) ? "Try adjusting your filters." : "Create your first bill!"}
        </div>
      ) : (
        <Table
          data={bills.map(bill => ({
            ...bill,
            expertName: bill.expert?.fullName || bill.expert?.name || '-',
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
                <button onClick={() => handleView(row)} className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700">View</button>
                <button onClick={() => handleEdit(row)} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">Edit</button>
                <button onClick={() => handleHistory(row)} className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700" title="View all bills for this expert">History</button>
                <button onClick={() => handleDelete(row)} className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700">Delete</button>
              </div>
            ),
          }]}
          excludeColumns={['stages', 'totals', 'expert', 'doctor', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'overallGst', 'otherCharges', 'discount', 'remark', '__v']}
          columnOrder={['date', 'expertName', 'doctorName', 'caseDetails', 'amount', 'createdByName']}
          pagination={true}
        />
      )}
    </div>
  );
};

export default ExpertBills;