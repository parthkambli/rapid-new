import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiEndpoints, apiHelpers } from "../../../services/apiClient";

const ViewQueries = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [queryCase, setQueryCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get the proper file URL for attachments
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    // Get base URL from apiClient (removes /api if present) or use default
    let baseURL = 'http://localhost:3000/api'; // Default fallback
    try {
      // Try to get the base URL from environment or apiClient
      baseURL = import.meta.env.VITE_API_URI || 'http://localhost:3000/api';
      baseURL = baseURL.replace(/\/api$/, ''); // Remove /api suffix if present
    } catch (err) {
      // Fallback to default
    }

    // Convert server file path to URL
    if (filePath.startsWith('/home/')) {
      // Extract the path after 'uploads'
      const uploadsIndex = filePath.indexOf('uploads/');
      if (uploadsIndex !== -1) {
        const relativePath = filePath.substring(uploadsIndex);
        return `${baseURL}/${relativePath}`.replace(/([^:]\/)\/+/g, '$1'); // Replace multiple slashes with single slash, except in protocol
      }
    }
    // If already a URL, return as is
    if (filePath.startsWith('http')) {
      return filePath;
    }
    // If starts with /uploads, append to base URL
    if (filePath.startsWith('/uploads')) {
      return `${baseURL}${filePath}`.replace(/([^:]\/)\/+/g, '$1'); // Replace multiple slashes with single slash, except in protocol
    }
    // Default: assume it's a relative path from uploads
    return `${baseURL}/uploads/${filePath}`.replace(/([^:]\/)\/+/g, '$1'); // Replace multiple slashes with single slash, except in protocol
  };

  // Fetch query case details
  useEffect(() => {
    fetchQueryCase();
  }, [id]);

  const fetchQueryCase = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiHelpers.getById(apiEndpoints.queryCases.get, id);
      
      if (response.success) {
        setQueryCase(response.data || response);
      } else {
        setError(response.message || 'Failed to fetch query case');
      }
    } catch (err) {
      console.error('Error fetching query case:', err);
      setError(err.response?.data?.message || 'Error fetching query case');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#398C89]"></div>
          <p className="mt-2 text-gray-600">Loading query case...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
        <button
          onClick={() => navigate('/admin/queries')}
          className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
        >
          Back to Queries
        </button>
      </div>
    );
  }

  if (!queryCase) {
    return (
      <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Query case not found
        </div>
        <button
          onClick={() => navigate('/admin/queries')}
          className="px-4 py-2 bg-[#398C89] text-white rounded-md hover:bg-[#2e706e]"
        >
          Back to Queries
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">View Query Case</h2>
        <div className="flex space-x-2">
          <button
            // onClick={() => navigate(`/admin/edit-query-case/${id}`, { state: { editData: queryCase } })}
            onClick={() => navigate("/admin/create-query-case", { state: { editData: queryCase } })}

            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
          >
            Edit Query
          </button>
          <button
            onClick={() => navigate('/admin/queries')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
          >
            Back to List
          </button>
        </div>
      </div>

      {/* Case Information Section */}
      <div className="bg-gray-50 p-6 rounded-lg border mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Case Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Case ID</p>
            <p className="text-sm text-gray-800">{queryCase.id || queryCase.caseId || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Case Number</p>
            <p className="text-sm text-gray-800">{queryCase.caseNo || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Doctor ID</p>
            <p className="text-sm text-gray-800">{queryCase.doctorId || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Doctor Name</p>
            <p className="text-sm text-gray-800">{queryCase.doctorName || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Query Type</p>
            <p className="text-sm text-gray-800">{queryCase.queryType || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Case Type</p>
            <p className="text-sm text-gray-800">{queryCase.caseType || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Sub Type</p>
            <p className="text-sm text-gray-800">{queryCase.subType || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <span className={`text-sm px-2 py-0.5 rounded-full ${
              queryCase.status === 'Open' ? 'bg-green-100 text-green-800' :
              queryCase.status === 'Closed' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {queryCase.status || "N/A"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Priority</p>
            <p className="text-sm text-gray-800">{queryCase.priority || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Case Stage</p>
            <p className="text-sm text-gray-800">{queryCase.caseStage || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Created At</p>
            <p className="text-sm text-gray-800">
              {queryCase.createdAt ? new Date(queryCase.createdAt).toLocaleDateString('en-GB') : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Updated At</p>
            <p className="text-sm text-gray-800">
              {queryCase.updatedAt ? new Date(queryCase.updatedAt).toLocaleDateString('en-GB') : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Patient & Opponent Information */}
      <div className="bg-gray-50 p-6 rounded-lg border mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Patient & Opponent Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Patient Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Patient Name:</span>
                <span className="text-gray-800">{queryCase.patientName || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Age & Gender:</span>
                <span className="text-gray-800">{queryCase.ageGender || "N/A"}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Opponent Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Opponent Name:</span>
                <span className="text-gray-800">{queryCase.opponentName || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Opponent Type:</span>
                <span className="text-gray-800">{queryCase.opponentType || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Contact:</span>
                <span className="text-gray-800">{queryCase.opponentContact || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Email:</span>
                <span className="text-gray-800">{queryCase.opponentEmail || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Address Information */}
      <div className="bg-gray-50 p-6 rounded-lg border mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact & Address</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Contact No:</span>
                <span className="text-gray-800">{queryCase.contactNo || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Email:</span>
                <span className="text-gray-800">{queryCase.email || "N/A"}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Address</h4>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Address:</span>
                <span className="text-gray-800">{queryCase.address || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Opponent Address:</span>
                <span className="text-gray-800">{queryCase.opponentAddress || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Query Description */}
      <div className="bg-gray-50 p-6 rounded-lg border mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Original Query</h3>
        
        <div className="bg-white p-4 rounded border">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{queryCase.originalQuery || queryCase.queryDescription || "No query description available."}</p>
        </div>
      </div>

      {/* Assigned Personnel */}
      <div className="bg-gray-50 p-6 rounded-lg border mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Assigned Personnel</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Assigned Expert</h4>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Expert Name:</span>
                <span className="text-gray-800">
                  {queryCase.assignedExpert?.fullName || queryCase.assignedExpert?.name || queryCase.expert || "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Expert Email:</span>
                <span className="text-gray-800">
                  {queryCase.assignedExpert?.email || "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Expert Phone:</span>
                <span className="text-gray-800">
                  {queryCase.assignedExpert?.phone || "N/A"}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Assigned Advocate</h4>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Advocate Name:</span>
                <span className="text-gray-800">
                  {queryCase.assignedAdvocate?.fullName || queryCase.assignedAdvocate?.name || queryCase.advocate || "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Advocate Email:</span>
                <span className="text-gray-800">
                  {queryCase.assignedAdvocate?.email || "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 min-w-[120px]">Advocate Phone:</span>
                <span className="text-gray-800">
                  {queryCase.assignedAdvocate?.phone || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-ups Section */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">Follow-ups</h3>
          <span className="text-sm text-gray-600">
            Total: {queryCase.followUps?.length || 0} follow-up{queryCase.followUps?.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="space-y-4">
          {queryCase.followUps && queryCase.followUps.length > 0 ? (
            queryCase.followUps.map((followUp) => (
              <div key={followUp._id || followUp.createdAt || Date.now()} className="bg-white p-4 rounded border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium mb-2">{followUp.text || followUp.remark || 'No description'}</p>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-600">Status:</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {followUp.stage || 'N/A'}
                        </span>
                      </div>
                      {followUp.nextDate && queryCase.status && !['Closed', 'Close'].includes(queryCase.status) && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-600">Next Follow-up:</span>
                          <span>{new Date(followUp.nextDate).toLocaleDateString('en-GB')}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>By: {followUp.user || followUp.createdBy || 'System'}</span>
                      <span>On: {(followUp.date || followUp.createdAt) ? new Date(followUp.date || followUp.createdAt).toLocaleDateString('en-GB') : 'No date'}</span>
                      {followUp.attachment && (
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <a
                            href={getFileUrl(followUp.attachment) || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => {
                              if (!followUp.attachment || !getFileUrl(followUp.attachment)) {
                                e.preventDefault();
                                alert('Attachment not available');
                              }
                            }}
                          >
                            Attachment
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic text-center py-4">No follow-ups yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewQueries;