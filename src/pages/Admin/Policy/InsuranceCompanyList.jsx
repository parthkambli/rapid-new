// InsuranceCompanyList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/mainComponents/Table";
import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const InsuranceCompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', details: '' });
  const [submitting, setSubmitting] = useState(false);

  // Fetch companies from API
  const fetchCompanies = async (search = '') => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const response = await apiHelpers.getList(apiEndpoints.insuranceCompanies.list, params);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching insurance companies:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new insurance company
  const createInsuranceCompany = async () => {
    if (!formData.name.trim()) {
      alert('Company name is required!');
      return;
    }

    try {
      setSubmitting(true);
      await apiHelpers.create(apiEndpoints.insuranceCompanies.create, {
        name: formData.name.trim(),
        details: formData.details.trim()
      });
      setShowAddForm(false);
      setFormData({ name: '', details: '' });
      fetchCompanies(searchQuery);
      alert('Insurance company created successfully!');
    } catch (error) {
      console.error('Error creating insurance company:', error);
      alert('Failed to create insurance company: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Update insurance company
  const updateInsuranceCompany = async (companyId, newName, newDetails) => {
    try {
      await apiClient.put(apiEndpoints.insuranceCompanies.update(companyId), {
        name: newName.trim(),
        details: newDetails.trim()
      });
      fetchCompanies(searchQuery);
      alert('Insurance company updated successfully!');
    } catch (error) {
      console.error('Error updating insurance company:', error);
      alert('Failed to update insurance company: ' + (error.response?.data?.message || error.message));
    }
  };

  // Delete insurance company
  const deleteInsuranceCompany = async (companyId, companyName) => {
    if (window.confirm(`Are you sure you want to delete "${companyName}"?`)) {
      try {
        await apiClient.delete(apiEndpoints.insuranceCompanies.delete(companyId));
        fetchCompanies(searchQuery);
        alert('Insurance company deleted successfully!');
      } catch (error) {
        console.error('Error deleting insurance company:', error);
        alert('Failed to delete insurance company: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchCompanies(query);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', details: '' });

  // Start editing a company
  const startEdit = (company) => {
    setEditingId(company.id);
    setEditData({
      name: company.name,
      details: company.details || ''
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '', details: '' });
  };

  // Save edited company
  const saveEdit = async (companyId) => {
    if (!editData.name.trim()) {
      alert('Company name is required!');
      return;
    }

    await updateInsuranceCompany(companyId, editData.name.trim(), editData.details.trim());
    setEditingId(null);
    setEditData({ name: '', details: '' });
  };

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Insurance Company List</h2>

      {/* Top Search + Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search By Company"
          className="w-full sm:max-w-xs p-2 border border-gray-300 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#398C89]"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium transition-colors"
          >
            Add Insurance Company
          </button>
          <button
            onClick={() => navigate("/admin/add-insurance-type")}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium transition-colors"
          >
            Add Insurance Type
          </button>
          <button
            onClick={() => navigate("/admin/insurance-type-list")}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium transition-colors"
          >
            Insurance Types
          </button>
          <button
            onClick={() => navigate("/admin/add-policy")}
            className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e] text-sm font-medium transition-colors"
          >
            Add Policy
          </button>
        </div>
      </div>

      {/* Add Form (Inline) */}
      {showAddForm && (
        <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Insurance Company</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter Insurance Company Name Here..."
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                disabled={submitting}
              />
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
                onClick={createInsuranceCompany}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', details: '' });
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
          <p className="mt-2 text-gray-600">Loading companies...</p>
        </div>
      )}

      {/* Table */}
      <Table
        data={companies.map(company => ({
          name: company.name,
          details: company.details || 'N/A',
          id: company.id,
          _original: company,
          isEditing: editingId === company.id
        }))}
        headers={["Insurance Company Name", "Details"]}
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
                      onClick={() => deleteInsuranceCompany(row.id, row.name)}
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
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    placeholder="Company name"
                  />
                </td>
                <td className="px-4 py-3">
                  <textarea
                    value={editData.details}
                    onChange={(e) => setEditData({...editData, details: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
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
      {!loading && companies.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No insurance companies found.</p>
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

export default InsuranceCompanyList;