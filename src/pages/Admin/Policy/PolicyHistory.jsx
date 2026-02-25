// PolicyHistory.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../../../services/apiClient";

const PolicyHistory = () => {
  const { policyNo } = useParams();
  const decodedPolicyNo = decodeURIComponent(policyNo);
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPolicyDocs, setSelectedPolicyDocs] = useState(null); // For viewing documents





  // Helper to format backend file paths to correct URLs
  const formatBackendPath = (path) => {
    if (!path) return '';
    // Fix Windows paths and absolute paths
    const cleanPath = path.toString().replace(/\\/g, '/');

    // Find where 'uploads/' starts
    const uploadsIndex = cleanPath.indexOf('uploads/');

    if (uploadsIndex !== -1) {
      // Extract part starting from 'uploads/'
      const relativePath = cleanPath.substring(uploadsIndex);

      // Get base URL (remove /api if it exists in the env var)
      const apiBase = import.meta.env.VITE_API_URI || 'http://localhost:3000';
      const baseUrl = apiBase.replace(/\/api\/?$/, ''); // Remove trailing /api

      return `${baseUrl}/${relativePath}`;
    }

    // Fallback for paths that might not contain 'uploads/'
    return path.startsWith('http') ? path : `${import.meta.env.VITE_API_URI || 'http://localhost:3000'}/${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // UTC date ko IST mein convert karo properly
    return date.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Use the history endpoint from apiClient
        const response = await apiClient.get(apiEndpoints.policies.history(decodedPolicyNo));

        // The API returns { success: true, data: [policies], currentPolicy: {...} }
        // For policy lineage history, we want all policies for the same policy holder
        const policies = response.data.data || [];

        // Format the policy lineage history
        const formattedHistory = policies.map((policy, index) => ({
          id: policy._id,
          policyNumber: policy.policyNumber,
          // startDate: policy.startDate ? new Date(policy.startDate).toLocaleDateString('en-GB') : 'N/A',
          // endDate: policy.endDate ? new Date(policy.endDate).toLocaleDateString('en-GB') : 'N/A',


          // Phir use karo:
          startDate: formatDate(policy.startDate),
          endDate: formatDate(policy.endDate),
          createdDate: formatDate(policy.createdAt),
          status: policy.status,
          coverage: `${policy.coverageCurrency || '₹'} ${policy.coverageAmount?.toLocaleString('en-IN') || 0}`,
          premium: `${policy.premiumCurrency || '₹'} ${policy.premiumAmount?.toLocaleString('en-IN') || 0}`,
          company: policy.insuranceCompany?.companyName || 'N/A',
          type: policy.insuranceType?.typeName || 'N/A',
          createdDate: policy.createdAt ? new Date(policy.createdAt).toLocaleDateString('en-GB') : 'N/A',
          renewedFrom: policy.renewedFrom || null,
          renewedFrom: policy.renewedFrom || null,
          renewedTo: policy.renewedTo || null,
          remarks: policy.policyHistory?.length > 0 ? policy.policyHistory[0]?.remarks || 'N/A' : 'N/A',
          documents: policy.documents || { otherDocuments: [] } // Store documents
        }));

        setHistory(formattedHistory);
        setCurrentPolicy(response.data.currentPolicy || policies[0]);
      } catch (err) {
        console.error("Error fetching policy history:", err);
        setError("Failed to load policy history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (policyNo) {
      fetchHistory();
    }
  }, [policyNo]);

  const formatPaidBy = (value) => {
    if (!value) return 'N/A';
    // Convert by_doctor -> By Doctor
    return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Policy History: {decodedPolicyNo}</h2>
          {currentPolicy && (
            <p className="text-sm text-gray-600 mt-1">
              Current Status: <span className="font-semibold">{currentPolicy.status}</span> |
              Current End Date: <span className="font-semibold">{new Date(currentPolicy.endDate).toLocaleDateString('en-GB')}</span>
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="ml-2 text-gray-600">Loading history...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Policy No</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Coverage</th>
                <th className="px-4 py-2">Premium</th>
                <th className="px-4 py-2">Created Date</th>
                <th className="px-4 py-2">Remarks</th>
                <th className="px-4 py-2">Documents</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((row, i) => (
                  <tr key={row.id || i} className={`border-t hover:bg-gray-50 ${row.status === 'active' ? 'bg-green-50' : row.status === 'expired' ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-2 font-medium text-blue-600">{row.policyNumber}</td>
                    <td className="px-4 py-2">{row.startDate}</td>
                    <td className="px-4 py-2">{row.endDate}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${row.status === 'active' ? 'bg-green-100 text-green-800' :
                        row.status === 'expired' ? 'bg-red-100 text-red-800' :
                          row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{row.company}</td>
                    <td className="px-4 py-2 font-semibold">{row.coverage}</td>
                    <td className="px-4 py-2">{row.premium}</td>
                    <td className="px-4 py-2">{row.createdDate}</td>
                    <td className="px-4 py-2">{row.remarks}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setSelectedPolicyDocs({
                          policyNumber: row.policyNumber,
                          documents: row.documents
                        })}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    No history found for this policy holder.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Documents Modal */}
      {selectedPolicyDocs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Documents for Policy: {selectedPolicyDocs.policyNumber}
              </h3>
              <button
                onClick={() => setSelectedPolicyDocs(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              {/* Policy Document */}
              <div className="p-3 bg-gray-50 rounded border">
                <p className="font-semibold text-gray-700 mb-2">Policy Document:</p>
                {selectedPolicyDocs.documents?.policyDocument ? (
                  <a
                    href={formatBackendPath(selectedPolicyDocs.documents.policyDocument)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <span className="mr-2">📄</span> View Document
                  </a>
                ) : (
                  <p className="text-gray-400 italic">No document uploaded</p>
                )}
              </div>

              {/* Proposal Form */}
              <div className="p-3 bg-gray-50 rounded border">
                <p className="font-semibold text-gray-700 mb-2">Proposal Form:</p>
                {selectedPolicyDocs.documents?.proposalForm ? (
                  <a
                    href={formatBackendPath(selectedPolicyDocs.documents.proposalForm)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <span className="mr-2">📝</span> View Proposal Form
                  </a>
                ) : (
                  <p className="text-gray-400 italic">No proposal form uploaded</p>
                )}
              </div>

              {/* Other Documents */}
              <div className="p-3 bg-gray-50 rounded border">
                <p className="font-semibold text-gray-700 mb-2">Other Documents:</p>
                {selectedPolicyDocs.documents?.otherDocuments?.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedPolicyDocs.documents.otherDocuments.map((doc, idx) => (
                      <li key={idx}>
                        <a
                          href={formatBackendPath(doc)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          <span className="mr-2">📎</span> View Document {idx + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic">No other documents</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedPolicyDocs(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyHistory;