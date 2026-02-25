import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Calendar, User, FileText, Download, Clock } from 'lucide-react';
import apiClient from '../../services/apiClient';

const CaseHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [caseData, setCaseData] = useState(null);

    useEffect(() => {
        const fetchCase = async () => {
            try {
                const response = await apiClient.get(`/query-cases/${id}`);
                if (response.data.success) {
                    setCaseData(response.data.data);
                } else {
                    toast.error('Failed to fetch case details');
                }
            } catch (error) {
                console.error('Error fetching case:', error);
                toast.error('Error loading case details');
            } finally {
                setLoading(false);
            }
        };

        fetchCase();
    }, [id]);

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18B4A5]"></div>
            </div>
        );
    }

    if (!caseData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">Case not found</p>
                    <button
                        onClick={() => navigate('/expert/cases')}
                        className="mt-4 px-4 py-2 bg-[#18B4A5] text-white rounded hover:bg-[#149f91]"
                    >
                        Back to Cases
                    </button>
                </div>
            </div>
        );
    }

    const followUps = caseData.followUps || [];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/expert/cases')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Cases
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Case History</h1>
                <p className="text-gray-600 mt-1">Complete timeline of case updates and follow-ups</p>
            </div>

            {/* Case Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Case ID</label>
                        <p className="mt-1 text-gray-900 font-medium">{caseData.caseId}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Case No</label>
                        <p className="mt-1 text-gray-900 font-medium">{caseData.caseNo || '-'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Doctor Name</label>
                        <p className="mt-1 text-gray-900 font-medium">{caseData.doctorName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Status</label>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${caseData.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                            caseData.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                            {caseData.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Follow-up Timeline</h2>

                {followUps.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No follow-ups recorded yet</p>
                        <button
                            onClick={() => navigate(`/expert/case/${id}/update`)}
                            className="mt-4 px-4 py-2 bg-[#18B4A5] text-white rounded hover:bg-[#149f91]"
                        >
                            Add First Follow-up
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        {/* Timeline Items */}
                        <div className="space-y-6">
                            {followUps.map((followUp, index) => (
                                <div key={followUp._id || index} className="relative pl-16">
                                    {/* Timeline Dot */}
                                    <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-[#18B4A5] border-4 border-white shadow"></div>

                                    {/* Follow-up Card */}
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <User className="h-4 w-4 text-gray-600" />
                                                    <span className="font-medium text-gray-900">{followUp.user || 'Unknown User'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{formatDate(followUp.date)}</span>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-[#18B4A5] text-white text-xs rounded-full">
                                                {followUp.stage || 'N/A'}
                                            </span>
                                        </div>

                                        {/* Notes */}
                                        <div className="mb-3">
                                            <p className="text-gray-700 whitespace-pre-wrap">{followUp.text}</p>
                                        </div>

                                        {/* Next Date */}
                                        {followUp.nextDate && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                <Clock className="h-3 w-3" />
                                                <span>Next Date: {new Date(followUp.nextDate).toLocaleDateString('en-GB')}</span>
                                            </div>
                                        )}

                                        {/* Attachment */}
                                        {followUp.attachment && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <a
                                                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${followUp.attachment}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-[#18B4A5] hover:text-[#149f91]"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    <span>Download Attachment</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
                <button
                    onClick={() => navigate(`/expert/case/${id}/update`)}
                    className="px-6 py-2 bg-[#18B4A5] text-white rounded-lg hover:bg-[#149f91] transition-colors"
                >
                    Add Follow-up
                </button>
                <button
                    onClick={() => navigate('/expert/cases')}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Back to Cases
                </button>
            </div>
        </div>
    );
};

export default CaseHistory;
