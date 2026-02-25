// EditInsuranceType.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const EditInsuranceType = () => {
  const { id } = useParams(); // Get the insurance type ID from URL params
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    category: "health",
    startDate: "",
    companyId: ""
  });
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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

  // Fetch insurance types from API (for the creatable select)
  const fetchInsuranceTypes = async () => {
    try {
      const response = await apiHelpers.getList(apiEndpoints.insuranceTypes.list);
      setInsuranceTypes(response.data || []);
    } catch (error) {
      console.error('Error fetching insurance types:', error);
      setInsuranceTypes([]);
      // Don't show error to user as this is not critical functionality
    }
  };

  // Fetch the specific insurance type for editing
  const fetchInsuranceType = async () => {
    try {
      setLoadingData(true);
      const response = await apiClient.get(apiEndpoints.insuranceTypes.get(id));
      
      if (response.data.success) {
        const type = response.data.data;
        setFormData({
          name: type.typeName || type.name || "",  // ← typeName ko pehle check karo
          details: type.description || type.details || "",
          category: type.category || "health",
          startDate: type.startDate ? new Date(type.startDate).toISOString().split("T")[0] : "",
          companyId: type.insuranceCompany?._id || type.insuranceCompany || ""
        });
      } else {
        alert('Failed to fetch insurance type: ' + response.data.message);
        navigate("/admin/insurance-type-list");
      }
    } catch (error) {
      console.error('Error fetching insurance type:', error);
      alert('Failed to fetch insurance type: ' + (error.response?.data?.message || error.message));
      navigate("/admin/insurance-type-list");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchInsuranceCompanies();
    fetchInsuranceTypes();
    fetchInsuranceType();
  }, [id]);

  const handleSave = async () => {
    // Validation
    const newErrors = {};
    if (!formData.companyId) newErrors.companyId = "Insurance Company is required!";
    
    // Check if type name is provided and trimmed
    const trimmedName = formData.name?.trim() || '';
    if (!trimmedName) {
      newErrors.name = "Insurance Type name is required!";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Insurance Type name must be at least 2 characters long!";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);

      // Prepare data for API - for insurance type update
      const payload = {
        name: trimmedName,
        details: formData.details.trim(),
        category: formData.category,
        insuranceCompany: formData.companyId
      };

      // Add date only if it's provided
      if (formData.startDate) {
        payload.startDate = formData.startDate;
      }

      // Update the insurance type
      const response = await apiClient.put(apiEndpoints.insuranceTypes.update(id), payload);

      if (response.data.success) {
        alert('Insurance type updated successfully!');
        navigate("/admin/insurance-type-list"); // Navigate back to list after successful update
      } else {
        alert('Failed to update insurance type: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating insurance type:', error);
      const errorMessage = error.response?.data?.message || error.message;
      
      // Handle duplicate key error specifically
      if (error.response?.data?.error?.includes('duplicate key error')) {
        alert('An insurance type with this name already exists for the selected company. Please choose a different name.');
      } else {
        alert('Failed to update insurance type: ' + errorMessage);
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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear the error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-[79vw] mx-auto p-6 bg-white">
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading insurance type...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Edit Insurance Type</h2>

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
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Company *
            </label>
            <Select
              options={insuranceCompanies.map(company => ({
                value: company.id || company._id,
                label: company.name
              }))}
              value={
                insuranceCompanies.find(company => 
                  company.id === formData.companyId || company._id === formData.companyId
                ) ? {
                  value: formData.companyId,
                  label: insuranceCompanies.find(company => 
                    company.id === formData.companyId || company._id === formData.companyId
                  ).name
                } : null
              }
              onChange={(selectedOption) => {
                handleChange('companyId', selectedOption ? selectedOption.value : '');
              }}
              placeholder="Select Company..."
              className={`react-select-container ${errors.companyId ? 'border-red-500' : 'border-gray-300'}`}
              classNamePrefix="react-select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  borderRadius: '0.375rem',
                  border: errors.companyId ? '2px solid #ef4444' : '1px solid #d1d5db',
                  backgroundColor: 'white',
                  minHeight: 'auto',
                }),
                input: (provided) => ({
                  ...provided,
                  margin: 0,
                  padding: 0,
                })
              }}
              isDisabled={loading} // Disable while loading companies
            />
            {errors.companyId && <p className="text-red-500 text-xs mt-1">{errors.companyId}</p>}
          </div>
        </div>

        {/* Insurance Type Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insurance Type Name *
          </label>
          <CreatableSelect
            options={[
              // Include current type name as an option if it's not in the insuranceTypes list
              ...(formData.name && !insuranceTypes.some(type => type.name === formData.name)
                ? [{ value: formData.name, label: formData.name }]
                : []),
              // Then add all other insurance types (excluding current if it exists in the list)
              ...insuranceTypes
                .filter(type => type.name !== formData.name)
                .map(type => ({
                  value: type.name,
                  label: type.name
                }))
            ]}
            value={formData.name ? { value: formData.name, label: formData.name } : null}
            onChange={(selectedOption) => {
              if (selectedOption) {
                handleChange('name', selectedOption.value);
              } else {
                handleChange('name', '');
              }
            }}
            placeholder="Select or type new Insurance Type Name..."
            className={`react-select-container ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            classNamePrefix="react-select"
            styles={{
              control: (provided, state) => ({
                ...provided,
                padding: '0.5rem',
                fontSize: '0.875rem',
                borderRadius: '0.375rem',
                border: errors.name ? '2px solid #ef4444' : '1px solid #d1d5db',
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
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
          >
            <option value="health">Health</option>
            <option value="life">Life</option>
            <option value="property">Property</option>
            <option value="motor">Motor</option>
            <option value="travel">Travel</option>
            <option value="liability">Liability</option>
            <option value="marine">Marine</option>
            <option value="crop">Crop</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
          <textarea
            value={formData.details}
            onChange={(e) => handleChange('details', e.target.value)}
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
            {submitting ? 'Saving...' : 'Update'}
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

export default EditInsuranceType;