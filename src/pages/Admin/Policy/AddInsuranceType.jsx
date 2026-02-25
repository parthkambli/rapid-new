// AddInsuranceType.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
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
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
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

  // Fetch insurance types from API
  const fetchInsuranceTypes = async () => {
    try {
      setLoadingTypes(true);
      const response = await apiHelpers.getList(apiEndpoints.insuranceTypes.list);
      setInsuranceTypes(response.data || []);
    } catch (error) {
      console.error('Error fetching insurance types:', error);
      setInsuranceTypes([]);
      // Don't show error to user as this is not critical functionality
    } finally {
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    fetchInsuranceCompanies();
    fetchInsuranceTypes();
  }, []);

  const handleSave = async () => {
    // Validation
    const newErrors = {};
    if (!formData.company) newErrors.company = "Insurance Company is required!";

    // Check if type is provided and trimmed
    const trimmedType = formData.type?.trim() || '';
    if (!trimmedType) {
      newErrors.type = "Insurance Type is required!";
    } else if (trimmedType.length < 2) {
      newErrors.type = "Insurance Type must be at least 2 characters long!";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);

      // Prepare data for API - for insurance type creation
      const payload = {
        name: trimmedType,
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
      navigate("/admin/insurance-type-list"); // Navigate to insurance type list after successful creation
    } catch (error) {
      console.error('Error creating insurance type:', error);
      const errorMessage = error.response?.data?.message || error.message;

      // Handle duplicate key error specifically
      if (error.response?.data?.error?.includes('duplicate key error')) {
        alert('This insurance type already exists for the selected company. The same type name can only be used once per company. Try a different name or select a different company.');
      } else {
        alert('Failed to create insurance type: ' + errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Changes will be lost.")) {
      navigate("/admin/insurance-type-list");
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
          <CreatableSelect
            options={insuranceTypes.map(type => ({
              value: type.name,
              label: type.name
            }))}
            value={formData.type ? { value: formData.type, label: formData.type } : null}
            onChange={(selectedOption) => {
              if (selectedOption) {
                setFormData({ ...formData, type: selectedOption.value });
              } else {
                setFormData({ ...formData, type: '' });
              }
            }}
            placeholder="Select or type new Insurance Type..."
            className={`react-select-container ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
            classNamePrefix="react-select"
            styles={{
              control: (provided, state) => ({
                ...provided,
                padding: '0.5rem',
                fontSize: '0.875rem',
                borderRadius: '0.375rem',
                border: errors.type ? '2px solid #ef4444' : '1px solid #d1d5db',
                backgroundColor: 'white',
                minHeight: 'auto',
              }),
              input: (provided) => ({
                ...provided,
                margin: 0,
                padding: 0,
              })
            }}
            formatCreateLabel={(inputValue) => `Create new: "${inputValue}"`}
          />
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
        </div>

        {/* Amount & Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter Amount Here..."
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              step="0.01"
            />
          </div> */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Premium</label>
            <input
              type="number"
              value={formData.premium}
              onChange={(e) => setFormData({ ...formData, premium: e.target.value })}
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
              step="0.01"
            />
          </div> */}
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