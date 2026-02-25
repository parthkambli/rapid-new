import React, { useState, useEffect } from 'react';
import apiClient, { apiEndpoints } from '../../services/apiClient';

const DoctorDocuments = () => {
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const response = await apiClient.get(apiEndpoints.auth.me);
      if (response.data.success && response.data.user.doctor) {
        const doctorData = response.data.user.doctor;
        setDoctor(doctorData);

        // Transform documents object into array for display
        const docs = [];
        if (doctorData.documents) {
          Object.entries(doctorData.documents).forEach(([key, value]) => {
            if (value) {
              // Handle both single string paths and arrays of paths
              if (Array.isArray(value)) {
                value.forEach((path, index) => {
                  docs.push({
                    type: key,
                    name: `${formatDocType(key)} ${index + 1}`,
                    path: path,
                    date: doctorData.updatedAt // Using updated date as upload date proxy if not tracked separately
                  });
                });
              } else {
                docs.push({
                  type: key,
                  name: formatDocType(key),
                  path: value,
                  date: doctorData.updatedAt
                });
              }
            }
          });
        }
        setDocuments(docs);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDocType = (type) => {
    return type
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  const getFileIcon = (path) => {
    const ext = path.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      return (
        <div className="p-2 bg-green-100 rounded-lg mr-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      );
    } else if (ext === 'pdf') {
      return (
        <div className="p-2 bg-red-100 rounded-lg mr-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
      );
    } else {
      return (
        <div className="p-2 bg-blue-100 rounded-lg mr-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>
      );
    }
  };

  const handleView = (path) => {
    // Trim the path to only include the uploads portion
    let cleanPath = path;

    // If the path contains the full server path, extract only the uploads part
    if (path.includes('/uploads/')) {
      // Find the index of '/uploads/' and take everything from there onwards
      const uploadsIndex = path.indexOf('/uploads/');
      cleanPath = path.substring(uploadsIndex);
    } else if (path.includes('uploads\\')) {
      // Handle Windows-style paths
      const uploadsIndex = path.indexOf('uploads\\');
      cleanPath = path.substring(uploadsIndex).replace(/\\/g, '/');
    }

    // Construct full URL if path is relative
    if (cleanPath.startsWith('http')) {
      window.open(cleanPath, '_blank');
      return;
    }

    // Ensure there's only one slash between base URL and path
    const baseUrl = import.meta.env.VITE_API_URI?.replace('/api', '') || 'http://localhost:3000';
    const url = `${baseUrl}/${cleanPath}`.replace(/([^:]\/)\/+/g, '$1'); // Replace multiple slashes with single slash, except in protocol
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600">View your documents</p>
      </div>

      {/* Document List - View Only as per documentation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Document Library</h2>
        </div>

        <div className="p-6">
          {documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    {getFileIcon(doc.path)}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-600">
                        Uploaded on {new Date(doc.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(doc.path)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View / Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No documents available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDocuments;

