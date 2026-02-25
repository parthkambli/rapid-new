// ViewPolicy.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiEndpoints, apiHelpers } from "../../../services/apiClient";
import DateInput from "../../../components/DateInput/DateInput"; // Keeping for consistent styling, but will be disabled

// Reusing helper from other files for document links
const formatBackendPath = (path) => {
    if (!path) return '';
    const cleanPath = path.toString().replace(/\\/g, '/');
    const uploadsIndex = cleanPath.indexOf('uploads/');
    if (uploadsIndex !== -1) {
        const relativePath = cleanPath.substring(uploadsIndex);
        const apiBase = import.meta.env.VITE_API_URI || 'http://localhost:3000';
        const baseUrl = apiBase.replace(/\/api\/?$/, ''); // Remove trailing /api
        return `${baseUrl}/${relativePath}`;
    }
    return path.startsWith('http') ? path : `${import.meta.env.VITE_API_URI || 'http://localhost:3000'}/${path}`;
};

const ViewPolicy = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch policy data
    const fetchPolicy = async () => {
        try {
            setLoading(true);
            const response = await apiHelpers.getById(apiEndpoints.policies.get, id);
            setPolicy(response.data);
        } catch (error) {
            console.error('Error fetching policy:', error);
            alert('Failed to load policy data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicy();
    }, [id]);

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        // Manually split string to avoid timezone shifts
        const datePart = isoString.split('T')[0];
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
    }

    // Helper to render value or N/A
    const renderValue = (val) => val || 'N/A';

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
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const documentButtonStyle = "inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200 text-sm font-medium transition-colors mr-2 mb-2";

    return (
        <div className="max-w-[79vw] mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Policy Details</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => navigate(`/admin/edit-policy/${policy._id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Back
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Policy Information */}
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Policy Number</label>
                            <p className="font-medium text-gray-900">{renderValue(policy.policyNumber)}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Status</label>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize
                        ${policy.status === 'active' ? 'bg-green-100 text-green-800' :
                                    policy.status === 'expired' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                {renderValue(policy.status)}
                            </span>
                        </div>
                        {/* <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Renewal Status</label>
                            <p className="font-medium text-gray-900 capitalize">{renderValue(policy.renewalStatus || 'Not Due')}</p>
                        </div> */}
                    </div>
                </div>

                {/* Policy Holder */}
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Policy Holder</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Name</label>
                            <p className="font-medium text-gray-900">{renderValue(policy.policyHolder?.name)}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Type</label>
                            <p className="font-medium text-gray-900 capitalize">{renderValue(policy.policyHolder?.type)}</p>
                        </div>
                        {/* Add more holder details if available in entityId population if needed */}
                    </div>
                </div>

                {/* Insurance Details */}
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Insurance Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Company</label>
                            <p className="font-medium text-gray-900">{renderValue(policy.insuranceCompany?.companyName || policy.insuranceCompany?.name)}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Type</label>
                            <p className="font-medium text-gray-900">{renderValue(policy.insuranceType?.typeName || policy.insuranceType?.name)}</p>
                        </div>
                    </div>
                </div>

                {/* Financials & Dates */}
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Dates & Financials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Start Date</label>
                            <p className="font-medium text-gray-900">{formatDate(policy.startDate)}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">End Date</label>
                            <p className="font-medium text-gray-900">{formatDate(policy.endDate)}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Duration</label>
                            <p className="font-medium text-gray-900">{renderValue(policy.duration)} Years</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Coverage Amount</label>
                            <p className="font-medium text-gray-900">₹ {policy.coverageAmount?.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Premium Amount</label>
                            <p className="font-medium text-gray-900">₹ {policy.premiumAmount?.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Paid By</label>
                            <p className="font-medium text-gray-900">
                                {policy.paidBy === 'by_company' ? 'By Rapid' :
                                    policy.paidBy === 'by_hospital' ? 'By Hospital' :
                                        policy.paidBy === 'by_doctor' ? 'By Doctor' : policy.paidBy}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-3">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Documents</h3>
                    <div className="flex flex-wrap">
                        {policy.documents?.policyDocument && (
                            <a
                                href={formatBackendPath(policy.documents.policyDocument)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={documentButtonStyle}
                            >
                                📄 Policy Document
                            </a>
                        )}
                        {policy.documents?.proposalForm && (
                            <a
                                href={formatBackendPath(policy.documents.proposalForm)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={documentButtonStyle}
                            >
                                📝 Proposal Form
                            </a>
                        )}
                        {policy.documents?.otherDocuments?.map((doc, idx) => (
                            <a
                                key={idx}
                                href={formatBackendPath(doc)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={documentButtonStyle}
                            >
                                📎 Document {idx + 1}
                            </a>
                        ))}

                        {!policy.documents?.policyDocument && !policy.documents?.proposalForm && (!policy.documents?.otherDocuments || policy.documents.otherDocuments.length === 0) && (
                            <p className="text-sm text-gray-500 italic">No documents uploaded.</p>
                        )}
                    </div>
                </div>

                {/* Narration */}
                {policy.narration && (
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-3">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Narration</h3>
                        <p className="text-gray-800 whitespace-pre-wrap">{policy.narration}</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ViewPolicy;
