// RenewPolicy.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const RenewPolicy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [renewing, setRenewing] = useState(false);
  const [renewalData, setRenewalData] = useState({
    termYears: 1,
    premiumPaid: '',
    paymentDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  // Fetch policy data
  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const response = await apiHelpers.getById(apiEndpoints.policies.get, id);
      setPolicy(response.data);
    } catch (error) {
      console.error('Error fetching policy:', error);
      alert('Failed to load policy data');
    } finally {
      setLoading(false);
    }
  };

  // Handle renewal
  const handleRenewal = async (e) => {
    e.preventDefault();
    try {
      setRenewing(true);
      await apiClient.put(apiEndpoints.policies.renew(id), {
        renewalData
      });
      alert('Policy renewed successfully!');
      navigate('/admin/policy');
    } catch (error) {
      console.error('Error renewing policy:', error);
      alert('Failed to renew policy');
    } finally {
      setRenewing(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading policy data...</p>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <div className="text-center py-8 text-gray-500">
          <p>Policy not found</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleRenewal}>
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Renew Policy</h2>

        {/* Current Policy Details */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Policy Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Policy Number:</span> {policy.policyNumber}
            </div>
            <div>
              <span className="font-medium">Insurance Company:</span> {policy.insuranceCompany?.companyName || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Insurance Type:</span> {policy.insuranceType?.typeName || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Current End Date:</span> {policy.endDate ? new Date(policy.endDate).toLocaleDateString('en-IN') : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Coverage Amount:</span> ₹{policy.coverageAmount?.toLocaleString() || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Premium Amount:</span> ₹{policy.premiumAmount?.toLocaleString() || 'N/A'}
            </div>
          </div>
        </div>

        {/* Renewal Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Renewal Term (Years)</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={renewalData.termYears}
              onChange={(e) => setRenewalData(prev => ({ ...prev, termYears: parseInt(e.target.value) }))}
              disabled={renewing}
            >
              <option value={1}>1 Year</option>
              <option value={2}>2 Years</option>
              <option value={3}>3 Years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Premium Paid</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={renewalData.premiumPaid}
              onChange={(e) => setRenewalData(prev => ({ ...prev, premiumPaid: e.target.value }))}
              disabled={renewing}
              placeholder="Enter premium amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={renewalData.paymentDate}
              onChange={(e) => setRenewalData(prev => ({ ...prev, paymentDate: e.target.value }))}
              disabled={renewing}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
            rows={3}
            value={renewalData.remarks}
            onChange={(e) => setRenewalData(prev => ({ ...prev, remarks: e.target.value }))}
            disabled={renewing}
            placeholder="Enter renewal remarks..."
          />
        </div>

        <div className="flex justify-start space-x-3 mt-6">
          <button
            type="submit"
            disabled={renewing}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {renewing ? 'Renewing...' : 'Renew Policy'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/policy')}
            disabled={renewing}
            className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default RenewPolicy;
