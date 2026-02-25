// src/pages/Admin/Advocates/AdvocateHistory.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import Table from "../../../components/mainComponents/Table";
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const AdvocateHistory = () => {
  const { advocateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [advocate, setAdvocate] = useState(null);

  useEffect(() => {
    const fetchAdvocateAndBills = async () => {
      try {
        setLoading(true);
        
        // Fetch advocate details
        const advocateResponse = await apiClient.get(apiEndpoints.advocates.get(advocateId));
        if (advocateResponse.data.success) {
          setAdvocate(advocateResponse.data.data);
        }

        // Fetch bills for this advocate
        const billsResponse = await apiClient.get(apiEndpoints.advocateBills.list, {
          params: { advocate: advocateId, limit: 100000 }
        });
        
        if (billsResponse.data.success) {
          setBills(billsResponse.data.data || []);
        } else {
          setError(billsResponse.data.message || 'Failed to fetch bills');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch advocate history');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocateAndBills();
  }, [advocateId]);

  const handleExport = () => {
    try {
      const exportData = bills.map(bill => ({
        'Bill ID': bill._id,
        'Date': bill.createdAt ? format(new Date(bill.createdAt), 'dd/MM/yyyy') : '-',
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
      XLSX.utils.book_append_sheet(wb, ws, "Advocate Bills History");
      XLSX.writeFile(wb, `${advocate?.fullName || 'advocate'}-bills-${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      alert('Failed to export data');
    }
  };

  const calculateTotal = (field) => {
    return bills.reduce((sum, bill) => sum + (bill.totals?.[field] || 0), 0);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <p>Loading advocate history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Bill History for {advocate?.fullName || 'Advocate'}
          </h2>
          {advocate?.barCouncilNumber && (
            <p className="text-gray-600">Bar Council: {advocate.barCouncilNumber}</p>
          )}
        </div>
        <div className="flex gap-3 mt-3 md:mt-0">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
          >
            Export History
          </button>
          <button
            onClick={() => navigate("/admin/advocate-bills")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
          >
            Back to Bills
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Total Bills</p>
          <p className="text-2xl font-bold text-blue-900">{bills.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 font-medium">Total Amount</p>
          <p className="text-2xl font-bold text-green-900">
            ₹{calculateTotal('finalTotal').toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-700 font-medium">Total GST</p>
          <p className="text-2xl font-bold text-purple-900">
            ₹{calculateTotal('gstTotal').toLocaleString()}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700 font-medium">Total Discount</p>
          <p className="text-2xl font-bold text-yellow-900">
            ₹{calculateTotal('disc').toLocaleString()}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Bills Table */}
      {bills.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No bills found for this advocate.
        </div>
      ) : (
        <Table
          data={bills.map(bill => ({
            ...bill,
            doctorName: bill.doctor?.fullName || '-',
            caseDetails: `${bill.caseNo} (${bill.caseType})`,
            amount: `₹${bill.totals?.finalTotal?.toLocaleString() || 0}`,
            date: bill.createdAt ? format(new Date(bill.createdAt), 'dd/MM/yyyy') : '-',
            createdByName: bill.createdBy?.fullName || '-',
            stagesCount: bill.stages?.length || 0,
          }))}
          extraColumns={[
            {
              header: "Actions",
              render: (row) => (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => navigate(`/admin/advocate-bill/${row._id}`)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/admin/edit-advocate-bill/${row._id}`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </div>
              ),
            },
          ]}
          excludeColumns={['stages', 'totals', 'advocate', 'doctor', 'createdBy','createdAt', 'updatedBy' , 'updatedAt', '__v']}
          columnOrder={['date', 'doctorName', 'caseDetails', 'stagesCount', 'amount', 'createdByName']}
          pagination={true}
        />
      )}
    </div>
  );
};

export default AdvocateHistory;