// AddInsuranceCompany.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const AddInsuranceCompany = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Insurance Company Name is required!";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      await apiHelpers.create(apiEndpoints.insuranceCompanies.create, {
        name: formData.name.trim(),
        details: formData.details.trim()
      });

      alert('Insurance company created successfully!');
      navigate("/admin/insurance-companies-list");
    } catch (error) {
      console.error('Error creating insurance company:', error);
      alert('Failed to create insurance company: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Changes will be lost.")) {
      navigate("/admin/insurance-companies-list");
    }
  };

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Add Insurance Company</h2>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Insurance Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insurance Company Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter Insurance Company Name Here..."
            className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89] focus:border-transparent`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Details
          </label>
          <textarea
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            placeholder="Enter Details Here..."
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#398C89] focus:border-transparent"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInsuranceCompany;