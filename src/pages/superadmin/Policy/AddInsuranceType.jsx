// AddInsuranceType.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const AddInsuranceType = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    company: "",
    type: "",
    amount: "",
    premium: "",
    details: "",
  });
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch insurance companies from API
  const fetchInsuranceCompanies = async () => {
    try {
      setLoading(true);
      const response = await apiHelpers.getList(apiEndpoints.insuranceCompanies.list);
      setInsuranceCompanies(response.data || []);
    } catch (error) {
      console.error('Error fetching insurance companies:', error);
      setInsuranceCompanies([]);
      alert('Failed to load insurance companies: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsuranceCompanies();
  }, []);

  const handleSave = async () => {
    // Validation
    const newErrors = {};
    if (!formData.company) newErrors.company = "Insurance Company is required!";
    if (!formData.type.trim()) newErrors.type = "Insurance Type is required!";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);

      // Prepare data for API - for insurance type creation
      const payload = {
        name: formData.type.trim(),
        details: formData.details.trim(),
        category: 'health', // default category
        companyId: formData.company // This will be the company ID
      };

      // Add date only if it's provided
      if (formData.date) {
        payload.startDate = formData.date;
      }

      await apiHelpers.create(apiEndpoints.insuranceTypes.create, payload);

      alert('Insurance type created successfully!');
      navigate("/Superadmin/insurance-type-list"); // Navigate to insurance type list after successful creation
    } catch (error) {
      console.error('Error creating insurance type:', error);
      alert('Failed to create insurance type: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Changes will be lost.")) {
      navigate("/Superadmin/insurance-type-list");
    }
  };

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Add Insurance Type</h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading insurance companies...</p>
          </div>
        )}

        {/* Date & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Company *
            </label>
            <select
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className={`w-full p-3 border ${errors.company ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]`}
              disabled={loading}
            >
              <option value="">--Select Company--</option>
              {insuranceCompanies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
          </div>
        </div>

        {/* Insurance Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insurance Type *
          </label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="Enter Insurance Type Here..."
            className={`w-full p-3 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]`}
          />
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
        </div>

        {/* Amount & Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter Amount Here..."
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Premium</label>
            <input
              type="number"
              value={formData.premium}
              onChange={(e) => setFormData({ ...formData, premium: e.target.value })}
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              step="0.01"
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
          <textarea
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            placeholder="Enter Details Here..."
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#398C89]"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={submitting || loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            disabled={submitting}
            className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInsuranceType;