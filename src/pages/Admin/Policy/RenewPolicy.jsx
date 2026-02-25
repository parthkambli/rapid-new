// RenewPolicy.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const RenewPolicy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [renewing, setRenewing] = useState(false);

  // Form state initialized with empty values
  const [formData, setFormData] = useState({
    policyHolder: { name: '', type: '' },
    insuranceCompany: '',
    insuranceType: '',
    policyNumber: '',
    coverageAmount: '',
    premiumAmount: '',
    premiumPaidBy: 'By Rapid',
    startDate: '',
    endDate: '',
    duration: 1,
    paymentDate: new Date().toISOString().split('T')[0],
    narration: ''
  });

  // Data for dropdowns
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [allInsuranceTypes, setAllInsuranceTypes] = useState([]);


  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch dropdown data
        const [companiesRes, typesRes] = await Promise.all([
          apiHelpers.getList(apiEndpoints.insuranceCompanies.list),
          apiHelpers.getList(apiEndpoints.insuranceTypes.list)
        ]);

        setInsuranceCompanies(companiesRes.data || []);
        setAllInsuranceTypes(typesRes.data || []);

        // Fetch policy data
        const policyRes = await apiHelpers.getById(apiEndpoints.policies.get, id);
        const policy = policyRes.data;

        if (policy) {
          let latestEndDate = null;

          // FETCH HISTORY to find the REAL latest end date
          try {
            if (policy.policyNumber) {
              const historyRes = await apiHelpers.getList(apiEndpoints.policies.history(policy.policyNumber));
              const historyData = historyRes.data || [];

              // Include current policy in the list to check
              const allPolicies = [policy, ...historyData];

              // Find the maximum end date from all related policies
              allPolicies.forEach(p => {
                if (p.endDate) {
                  // Clean the date string and handle ISO format
                  const dateStr = p.endDate.toString().split('T')[0];
                  const [y, m, d] = dateStr.split('-').map(Number);

                  // Create date object treating it as local time to avoid timezone shifts
                  const pDate = new Date(y, m - 1, d);

                  if (!isNaN(pDate.getTime())) {
                    if (!latestEndDate || pDate > latestEndDate) {
                      latestEndDate = pDate;
                    }
                  }
                }
              });
            }
          } catch (historyError) {
            console.warn("Could not fetch policy history for date calculation", historyError);
            // Fallback to current policy's end date if history fails
            if (policy.endDate) {
              latestEndDate = new Date(policy.endDate);
            }
          }

          // If we still don't have a date, fallback to today
          if (!latestEndDate) {
            latestEndDate = new Date();
          }

          // Renewal Start Date = Latest End Date + 1 Day
          // Create new date object to avoid mutating
          const renewalStart = new Date(latestEndDate);
          renewalStart.setDate(renewalStart.getDate() + 1);
          const formattedStartDate = formatLocalDate(renewalStart);

          // Default Duration is 1 Year
          // End Date = Start Date + 1 Year - 1 Day
          const renewalEnd = new Date(renewalStart);
          renewalEnd.setFullYear(renewalEnd.getFullYear() + 1);
          renewalEnd.setDate(renewalEnd.getDate() - 1);
          const formattedEndDate = formatLocalDate(renewalEnd);

          setFormData({
            policyHolder: {
              name: policy.policyHolder?.name || '',
              type: policy.policyHolder?.type || ''
            },
            insuranceCompany: policy.insuranceCompany?._id || policy.insuranceCompany || '',
            insuranceType: policy.insuranceType?._id || policy.insuranceType || '',
            policyNumber: policy.policyNumber || '',
            coverageAmount: policy.coverageAmount || '',
            premiumAmount: policy.premiumAmount || '',
            premiumPaidBy: policy.paidBy === 'by_company' ? 'By Rapid' :
              policy.paidBy === 'by_doctor' ? 'By Doctor' :
                policy.paidBy === 'by_hospital' ? 'By Hospital' : 'By Rapid',
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            duration: 1,
            paymentDate: new Date().toISOString().split('T')[0],
            narration: ''
          });
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load policy data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle duration change to update end date
  useEffect(() => {
    if (formData.startDate && formData.duration && !isNaN(formData.duration)) {
      // Manual parse to avoid timezone shift
      const [year, month, day] = formData.startDate.split('-').map(Number);
      const start = new Date(year, month - 1, day); // Local date, no timezone conversion

      const end = new Date(start);
      end.setFullYear(end.getFullYear() + parseInt(formData.duration));
      end.setDate(end.getDate() - 1);

      setFormData(prev => ({
        ...prev,
        endDate: formatLocalDate(end)
      }));
    }
  }, [formData.startDate, formData.duration]);



  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRenewal = async (e) => {
    e.preventDefault();
    try {
      setRenewing(true);

      // Check if there are document files to upload
      const hasDocuments = formData.policyDocument || formData.proposalForm || (formData.otherDocuments && formData.otherDocuments.length > 0);

      if (hasDocuments) {
        // Handle renewal with document uploads using multipart/form-data
        const formDataToSend = new FormData();

        // Prepare renewal data matching backend expectation
        const renewalData = {
          termYears: parseInt(formData.duration),
          premiumPaid: parseFloat(formData.premiumAmount),
          paymentDate: formData.paymentDate,
          remarks: formData.narration,
          // Include these to allow changing them during renewal
          insuranceCompany: formData.insuranceCompany,
          insuranceType: formData.insuranceType,
          coverageAmount: parseFloat(formData.coverageAmount),
          policyNumber: formData.policyNumber, // Allow changing policy number
          startDate: formData.startDate // Allow using custom start date
        };

        // Add renewal data as JSON string
        formDataToSend.append('renewalData', JSON.stringify(renewalData));

        // Add document files if they exist
        if (formData.policyDocument) {
          formDataToSend.append('policyDocument', formData.policyDocument);
        }
        if (formData.proposalForm) {
          formDataToSend.append('proposalForm', formData.proposalForm);
        }
        if (formData.otherDocuments && Array.isArray(formData.otherDocuments)) {
          formData.otherDocuments.forEach(file => {
            formDataToSend.append('otherDocuments', file);
          });
        }

        // Submit using multipart/form-data
        await apiClient.put(apiEndpoints.policies.renew(id), formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Handle renewal without document uploads using regular JSON
        const renewalPayload = {
          renewalData: {
            termYears: parseInt(formData.duration),
            premiumPaid: parseFloat(formData.premiumAmount),
            paymentDate: formData.paymentDate,
            remarks: formData.narration,
            // Include these to allow changing them during renewal
            insuranceCompany: formData.insuranceCompany,
            insuranceType: formData.insuranceType,
            coverageAmount: parseFloat(formData.coverageAmount),
            policyNumber: formData.policyNumber, // Allow changing policy number
            startDate: formData.startDate // Allow using custom start date
          }
        };

        await apiClient.put(apiEndpoints.policies.renew(id), renewalPayload);
      }

      alert('Policy renewed successfully!');
      navigate('/admin/policy');
    } catch (error) {
      console.error('Error renewing policy:', error);
      alert('Failed to renew policy');
    } finally {
      setRenewing(false);
    }
  };

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

  return (
    <form onSubmit={handleRenewal}>
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Renew Policy</h2>

        <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Read-only fields for context */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.policyHolder.type === 'hospital' ? 'Hospital Name' : 'Doctor Name'}
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                value={formData.policyHolder.name || ''}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                value={formData.insuranceCompany}
                onChange={(e) => handleChange('insuranceCompany', e.target.value)}
              >
                <option value="">Select Company</option>
                {insuranceCompanies.map(company => (
                  <option key={company._id} value={company._id}>
                    {company.companyName || company.name}
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
              >
                <option value="">Select Type</option>
                {allInsuranceTypes
                  .filter(type => !formData.insuranceCompany || type.companyObjectId === formData.insuranceCompany)
                  .map(type => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Policy No</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                value={formData.policyNumber || ''}
                onChange={(e) => handleChange('policyNumber', e.target.value)}
              />
            </div>

            {/* Editable fields for renewal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                value={formData.coverageAmount || ''}
                onChange={(e) => handleChange('coverageAmount', e.target.value)}
                placeholder="Coverage Amount"
              // Note: Backend might not update this on renewal unless we add logic, but user can see it
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Premium Paid By</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                value={formData.premiumPaidBy}
                onChange={(e) => handleChange('premiumPaidBy', e.target.value)}
              >
                <option value="By Rapid">By Rapid</option>
                <option value="By Doctor">By Doctor</option>
                <option value="By Hospital">By Hospital</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Premium Amount</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                value={formData.premiumAmount || ''}
                onChange={(e) => handleChange('premiumAmount', e.target.value)}
                placeholder="Premium Amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Renewal)</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Years)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                value={formData.endDate}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                value={formData.paymentDate}
                onChange={(e) => handleChange('paymentDate', e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Narration / Remarks</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              rows={3}
              value={formData.narration}
              onChange={(e) => handleChange('narration', e.target.value)}
              placeholder="Enter renewal remarks..."
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Renewal Documents</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Policy Document</label>
                <input
                  type="file"
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-xs"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData(prev => ({
                        ...prev,
                        policyDocument: file
                      }));

                      // Update the label to show the file name
                      e.target.nextElementSibling.textContent = file.name;
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Choose File No file chosen</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Proposal Form</label>
                <input
                  type="file"
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-xs"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData(prev => ({
                        ...prev,
                        proposalForm: file
                      }));

                      // Update the label to show the file name
                      e.target.nextElementSibling.textContent = file.name;
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Choose File No file chosen</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Other Documents</label>
                <input
                  type="file"
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-xs"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                      setFormData(prev => ({
                        ...prev,
                        otherDocuments: files
                      }));

                      // Update the label to show the number of files
                      e.target.nextElementSibling.textContent = `${files.length} file(s) chosen`;
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Choose Files No file chosen</p>
              </div>
            </div>
          </div>
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
