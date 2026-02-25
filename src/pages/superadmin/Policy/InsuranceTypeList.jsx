// InsuranceTypeList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/mainComponents/Table";
import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const InsuranceTypeList = () => {
  const navigate = useNavigate();
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', details: '', category: 'health' });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', details: '', category: 'health', startDate: '' });

  // Fetch insurance types from API
  const fetchInsuranceTypes = async (search = '') => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const response = await apiHelpers.getList(apiEndpoints.insuranceTypes.list, params);
      setInsuranceTypes(response.data);
    } catch (error) {
      console.error('Error fetching insurance types:', error);
      setInsuranceTypes([]);
      alert('Failed to load insurance types: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Create new insurance type
  const createInsuranceType = async () => {
    if (!formData.name.trim()) {
      alert('Insurance type name is required!');
      return;
    }

    try {
      setSubmitting(true);
      await apiHelpers.create(apiEndpoints.insuranceTypes.create, {
        name: formData.name.trim(),
        details: formData.details.trim(),
        category: formData.category
      });
      setShowAddForm(false);
      setFormData({ name: '', details: '', category: 'health' });
      fetchInsuranceTypes(searchQuery);
      alert('Insurance type created successfully!');
    } catch (error) {
      console.error('Error creating insurance type:', error);
      alert('Failed to create insurance type: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Update insurance type
  const updateInsuranceType = async (typeId, updatedData) => {
    try {
      await apiClient.put(apiEndpoints.insuranceTypes.update(typeId), updatedData);
      fetchInsuranceTypes(searchQuery);
      setEditingId(null);
      setEditData({ name: '', details: '', category: 'health' });
      alert('Insurance type updated successfully!');
    } catch (error) {
      console.error('Error updating insurance type:', error);
      alert('Failed to update insurance type: ' + (error.response?.data?.message || error.message));
    }
  };

  // Delete insurance type
  const deleteInsuranceType = async (typeId, typeName) => {
    if (window.confirm(`Are you sure you want to delete "${typeName}"?`)) {
      try {
        await apiClient.delete(apiEndpoints.insuranceTypes.delete(typeId));
        fetchInsuranceTypes(searchQuery);
        alert('Insurance type deleted successfully!');
      } catch (error) {
        console.error('Error deleting insurance type:', error);
        alert('Failed to delete insurance type: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchInsuranceTypes(query);
  };

  // Start editing a type
  const startEdit = (type) => {
    setEditingId(type.id);
    setEditData({
      name: type.name || '',
      details: type.description || type.details || '',
      category: type.category || 'health',
      startDate: type.startDate || ''
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '', details: '', category: 'health' });
  };

  // Save edited type
  const saveEdit = async (typeId) => {
    if (!editData.name.trim()) {
      alert('Insurance type name is required!');
      return;
    }

    const updatePayload = {
      name: editData.name.trim(),
      details: editData.details.trim(),
      category: editData.category
    };

    // Add date only if it's provided
    if (editData.startDate) {
      updatePayload.startDate = editData.startDate;
    }

    await updateInsuranceType(typeId, updatePayload);
  };

  useEffect(() => {
    fetchInsuranceTypes();
  }, []);

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Insurance Type</h2>

      {/* Top Search + Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search By Type"
          className="w-full sm:max-w-xs p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/superadmin/insurance-companies")}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium transition-colors"
          >
            Insurance Company
          </button>
          <button
            onClick={() => navigate("/Superadmin/add-insurance-type")}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium transition-colors"
          >
            Add Insurance Type
          </button>
          <button
            onClick={() => navigate("/Superadmin/add-policy")}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium transition-colors"
          >
            Add Policy
          </button>
        </div>
      </div>

      {/* Add Form (Inline) */}
      {showAddForm && (
        <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Insurance Type</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter Insurance Type Name Here..."
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                disabled={submitting}
              >
                <option value="health">Health</option>
                <option value="life">Life</option>
                <option value="vehicle">Vehicle</option>
                <option value="property">Property</option>
                <option value="liability">Liability</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Enter Details Here..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md bg-white resize-none"
                disabled={submitting}
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={createInsuranceType}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', details: '', category: 'health' });
                }}
                disabled={submitting}
                className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading insurance types...</p>
        </div>
      )}

      {/* Table */}
      <Table
        data={insuranceTypes.map(type => ({
          date: type.startDate ? new Date(type.startDate).toLocaleDateString('en-IN') : 'N/A',
          company: type.companyName || type.insuranceCompany?.companyName || 'N/A',
          type: type.name,
          category: type.category || 'N/A',
          details: type.details || type.description || 'N/A',
          id: type.id,
          _original: type,
          isEditing: editingId === type.id
        }))}
        headers={["Date", "Insurance Company", "Insurance Type", "Category", "Details"]}
        extraColumns={[
          {
            header: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                {row.isEditing ? (
                  // Edit mode buttons
                  <div className="flex gap-1">
                    <button
                      onClick={() => saveEdit(row.id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs font-medium hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // Normal mode buttons
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(row._original)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteInsuranceType(row.id, row.type)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ),
          },
        ]}
        customRowRender={(row, rowIndex) => {
          if (row.isEditing) {
            return (
              <tr key={rowIndex} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={editData.startDate}
                    onChange={(e) => setEditData({...editData, startDate: e.target.value})}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  {row.company}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                    placeholder="Type name"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({...editData, category: e.target.value})}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="health">Health</option>
                    <option value="life">Life</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="property">Property</option>
                    <option value="liability">Liability</option>
                    <option value="other">Other</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <textarea
                    value={editData.details}
                    onChange={(e) => setEditData({...editData, details: e.target.value})}
                    className="w-full p-1 border border-gray-300 rounded text-sm resize-none"
                    placeholder="Details"
                    rows="2"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => saveEdit(row.id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs font-medium hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            );
          }
          return null; // Let the default table render handle non-editing rows
        }}
      />

      {/* No data message */}
      {!loading && insuranceTypes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No insurance types found.</p>
          {searchQuery && (
            <p className="text-sm mt-2">
              Try adjusting your search query or{' '}
              <button
                onClick={() => handleSearch('')}
                className="text-[#398C89] hover:underline"
              >
                clear the search
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default InsuranceTypeList;