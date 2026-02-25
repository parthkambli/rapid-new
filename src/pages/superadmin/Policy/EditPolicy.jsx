// EditPolicy.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const EditPolicy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [formData, setFormData] = useState({
    policyNumber: '',
    insuranceCompany: '',
    insuranceType: '',
    coverageAmount: '',
    premiumAmount: '',
    premiumPaidBy: 'By Rapid',
    startDate: '',
    endDate: '',
    status: 'active',
    narration: ''
  });

  // Fetch policy data
  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const response = await apiHelpers.getById(apiEndpoints.policies.get, id);
      setPolicy(response.data);
      setFormData({
        policyNumber: response.data.policyNumber || '',
        insuranceCompany: response.data.insuranceCompany?._id || '',
        insuranceType: response.data.insuranceType?._id || '',
        coverageAmount: response.data.coverageAmount || '',
        premiumAmount: response.data.premiumAmount || '',
        premiumPaidBy: response.data.paidBy === 'by_company' ? 'By Rapid' :
          (response.data.paidBy === 'by_hospital' ? 'By Hospital' : 'By Doctor'),
        startDate: response.data.startDate ? response.data.startDate.split('T')[0] : '',
        endDate: response.data.endDate ? response.data.endDate.split('T')[0] : '',
        status: response.data.status || 'active',
        narration: response.data.narration || ''
      });
    } catch (error) {
      console.error('Error fetching policy:', error);
      alert('Failed to load policy data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      const [companiesRes, typesRes] = await Promise.all([
        apiHelpers.getList(apiEndpoints.insuranceCompanies.list),
        apiHelpers.getList(apiEndpoints.insuranceTypes.list)
      ]);
      setInsuranceCompanies(companiesRes.data);
      setInsuranceTypes(typesRes.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        coverageAmount: parseFloat(formData.coverageAmount) || 0,
        premiumAmount: parseFloat(formData.premiumAmount) || 0,
        paidBy: formData.premiumPaidBy === 'By Rapid' ? 'by_company' :
          (formData.premiumPaidBy === 'By Hospital' ? 'by_hospital' : 'by_doctor')
      };
      delete payload.premiumPaidBy;

      await apiHelpers.update(apiEndpoints.policies.update, id, payload);
      alert('Policy updated successfully!');
      navigate('/superadmin/policy');
    } catch (error) {
      console.error('Error updating policy:', error);
      alert('Failed to update policy');
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'insuranceCompany') {
        newData.insuranceType = '';
      }
      return newData;
    });
  };

  useEffect(() => {
    fetchPolicy();
    fetchDropdownData();
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
    <form onSubmit={handleSubmit}>
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Policy</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.policyNumber}
              onChange={(e) => handleChange('policyNumber', e.target.value)}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.insuranceCompany}
              onChange={(e) => handleChange('insuranceCompany', e.target.value)}
              disabled={saving}
            >
              <option value="">Select Company</option>
              {insuranceCompanies.map(company => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.insuranceType}
              onChange={(e) => handleChange('insuranceType', e.target.value)}
              disabled={saving}
            >
              <option value="">Select Type</option>
              {insuranceTypes
                .filter(type => !formData.insuranceCompany || type.companyObjectId === formData.insuranceCompany)
                .map(type => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.coverageAmount}
              onChange={(e) => handleChange('coverageAmount', e.target.value)}
              disabled={saving}
              placeholder="500000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.premiumAmount}
              onChange={(e) => handleChange('premiumAmount', e.target.value)}
              disabled={saving}
              placeholder="1200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Premium Paid By</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.premiumPaidBy}
              onChange={(e) => handleChange('premiumPaidBy', e.target.value)}
              disabled={saving}
            >
              <option value="By Rapid">By Rapid</option>
              <option value="By Doctor">By Doctor</option>
              <option value="By Hospital">By Hospital</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              disabled={saving}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Narration</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
            rows={3}
            value={formData.narration}
            onChange={(e) => handleChange('narration', e.target.value)}
            disabled={saving}
          />
        </div>

        <div className="flex justify-start space-x-3 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/superadmin/policy')}
            disabled={saving}
            className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditPolicy;
