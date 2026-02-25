// src/pages/Admin/Advocates/ViewAdvocateBill.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";
import { format } from 'date-fns';

const ViewAdvocateBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(apiEndpoints.advocateBills.get(id));
        
        if (response.data.success) {
          setBill(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch bill');
        }
      } catch (err) {
        console.error('Error fetching bill:', err);
        setError(err.response?.data?.message || 'Failed to fetch bill details');
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <p>Loading bill details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
          Error: {error}
        </div>
        <button
          onClick={() => navigate("/admin/advocate-bills")}
          className="px-4 py-2 bg-gray-600 text-white rounded-md"
        >
          Back to Bills
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Advocate Bill Details</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/admin/edit-advocate-bill/${id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Bill
          </button>
          <button
            onClick={() => navigate("/admin/advocate-bills")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Bills
          </button>
        </div>
      </div>

      {/* Bill Details Card */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Bill Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Bill ID:</span> {bill._id}</p>
              <p><span className="font-medium">Created Date:</span> {format(new Date(bill.createdAt), 'dd/MM/yyyy HH:mm')}</p>
              <p><span className="font-medium">Created By:</span> {bill.createdBy?.fullName}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Case Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Case No:</span> {bill.caseNo}</p>
              <p><span className="font-medium">Case Type:</span> {bill.caseType}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Advocate Details</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {bill.advocate?.fullName}</p>
              <p><span className="font-medium">Bar Council No:</span> {bill.advocate?.barCouncilNumber}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Doctor Details</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {bill.doctor?.fullName}</p>
              <p><span className="font-medium">Doctor ID:</span> {bill.doctor?.doctorId}</p>
            </div>
          </div>
        </div>

        {/* Stages Table */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Stage-wise Breakdown</h3>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">Stage</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">Amount (₹)</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">GST %</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">GST Amount (₹)</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {bill.stages.map((stage, index) => (
                  <tr key={stage._id || index} className="border-t border-gray-200">
                    <td className="p-3">{stage.stage}</td>
                    <td className="p-3">{stage.amount.toLocaleString()}</td>
                    <td className="p-3">{stage.gstPercent}%</td>
                    <td className="p-3">{stage.gstAmount.toLocaleString()}</td>
                    <td className="p-3 font-medium">
                      {(stage.amount + stage.gstAmount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subtotal</label>
            <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
              ₹{bill.totals?.subtotal?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GST Total</label>
            <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
              ₹{bill.totals?.gstTotal?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Other Charges</label>
            <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
              ₹{bill.totals?.other?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount</label>
            <div className="p-2 bg-white border border-gray-300 rounded-md text-right font-bold">
              -₹{bill.totals?.disc?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Final Total</label>
            <div className="p-2 bg-[#398C89] text-white rounded-md text-right font-bold text-lg">
              ₹{bill.totals?.finalTotal?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        {/* Remark */}
        {bill.remark && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Remark</h3>
            <div className="p-3 bg-gray-50 border border-gray-300 rounded-md">
              {bill.remark}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="text-sm text-gray-600">
          <p><span className="font-medium">Overall GST:</span> {bill.overallGst || 0}%</p>
          <p><span className="font-medium">Other Charges:</span> ₹{bill.otherCharges || 0}</p>
          <p><span className="font-medium">Discount:</span> ₹{bill.discount || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewAdvocateBill;