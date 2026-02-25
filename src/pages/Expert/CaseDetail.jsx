import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, User, FileText, Calendar, Phone, Mail, MapPin, Edit, History, XCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';

const CaseDetail = () => {
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
            year: 'numeric'
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Case Details</h1>
                        <p className="text-gray-600 mt-1">{caseData.caseId} • {caseData.caseNo}</p>
                    </div>
                    {/* <div className="flex gap-3">
                        <button
                            onClick={() => navigate(`/expert/case/${id}/update`)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#18B4A5] text-white rounded-lg hover:bg-[#149f91] transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                            Update
                        </button>
                        <button
                            onClick={() => navigate(`/expert/case/${id}/history`)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#5A8B8A] text-white rounded-lg hover:bg-[#4a7574] transition-colors"
                        >
                            <History className="h-4 w-4" />
                            History
                        </button>
                        {caseData.status !== 'Closed' && (
                            <button
                                onClick={() => navigate(`/expert/case/${id}/close`)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                <XCircle className="h-4 w-4" />
                                Close Case
                            </button>
                        )}
                    </div> */}

                    <div className="flex gap-3">
                        {caseData.status !== 'Closed' && (
                            <button
                                onClick={() => navigate(`/expert/case/${id}/update`)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#18B4A5] text-white rounded-lg hover:bg-[#149f91]"
                            >
                                <Edit className="h-4 w-4" />
                                Update
                            </button>
                        )}
                        <button
                            onClick={() => navigate(`/expert/case/${id}/history`)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#5A8B8A] text-white rounded-lg hover:bg-[#4a7574]"
                        >
                            <History className="h-4 w-4" />
                            History
                        </button>
                        {caseData.status !== 'Closed' && (
                            <button
                                onClick={() => navigate(`/expert/case/${id}/close`)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                <XCircle className="h-4 w-4" />
                                Close Case
                            </button>
                        )}
                    </div>


                    {caseData.status !== 'Closed' && (
                        <button
                            onClick={() => navigate(`/expert/case/${id}/update`)}
                            className="w-full px-4 py-2 bg-[#18B4A5] text-white rounded-lg hover:bg-[#149f91] text-left flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Add Follow-up
                        </button>
                    )}
                    {/* Close button also hidden when closed */}
                    {caseData.status !== 'Closed' && (
                        <button
                            onClick={() => navigate(`/expert/case/${id}/close`)}
                            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-left flex items-center gap-2"
                        >
                            <XCircle className="h-4 w-4" />
                            Close Case
                        </button>
                    )}
                </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${caseData.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                    caseData.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                    {caseData.status} • {caseData.caseStage || 'Open'}
                </span>
                {caseData.priority && (
                    <span className={`ml-3 inline-block px-4 py-2 rounded-full text-sm font-medium ${caseData.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                        caseData.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                            caseData.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                        }`}>
                        {caseData.priority} Priority
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Case Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-[#18B4A5]" />
                            Case Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Query Type</label>
                                <p className="mt-1 text-gray-900">{caseData.queryType || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Case Type</label>
                                <p className="mt-1 text-gray-900">{caseData.caseType || '-'}</p>
                            </div>
                            {caseData.subType && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Sub Type</label>
                                    <p className="mt-1 text-gray-900">{caseData.subType}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Created Date</label>
                                <p className="mt-1 text-gray-900">{formatDate(caseData.createdAt)}</p>
                            </div>
                            {caseData.nextDate && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Next Date</label>
                                    <p className="mt-1 text-gray-900 font-medium text-[#18B4A5]">{formatDate(caseData.nextDate)}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-600">Query Description</label>
                            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{caseData.queryDescription || '-'}</p>
                        </div>
                        {caseData.tags && caseData.tags.length > 0 && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Tags</label>
                                <div className="flex flex-wrap gap-2">
                                    {caseData.tags.map((tag, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Doctor Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-[#18B4A5]" />
                            Doctor Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Doctor Name</label>
                                <p className="mt-1 text-gray-900 font-medium">{caseData.doctorName}</p>
                            </div>
                            {caseData.doctorId && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Doctor ID</label>
                                    <p className="mt-1 text-gray-900">{caseData.doctorId}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Patient Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-[#18B4A5]" />
                            Patient Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Patient Name</label>
                                <p className="mt-1 text-gray-900 font-medium">{caseData.patientName}</p>
                            </div>
                            {caseData.ageGender && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Age/Gender</label>
                                    <p className="mt-1 text-gray-900">{caseData.ageGender}</p>
                                </div>
                            )}
                            {caseData.contactNo && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Contact Number</label>
                                    <p className="mt-1 text-gray-900 flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        {caseData.contactNo}
                                    </p>
                                </div>
                            )}
                            {caseData.address && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600">Address</label>
                                    <p className="mt-1 text-gray-900 flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                        {caseData.address}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Opponent Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-[#18B4A5]" />
                            Opponent Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Opponent Name</label>
                                <p className="mt-1 text-gray-900 font-medium">{caseData.opponentName || '-'}</p>
                            </div>
                            {caseData.relation && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Relation</label>
                                    <p className="mt-1 text-gray-900">{caseData.relation}</p>
                                </div>
                            )}
                            {caseData.opponentType && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Opponent Type</label>
                                    <p className="mt-1 text-gray-900">{caseData.opponentType}</p>
                                </div>
                            )}
                            {caseData.opponentContact && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Contact</label>
                                    <p className="mt-1 text-gray-900 flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        {caseData.opponentContact}
                                    </p>
                                </div>
                            )}
                            {caseData.opponentEmail && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <p className="mt-1 text-gray-900 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        {caseData.opponentEmail}
                                    </p>
                                </div>
                            )}
                            {caseData.opponentAddress && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600">Address</label>
                                    <p className="mt-1 text-gray-900 flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                        {caseData.opponentAddress}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Quick Info & Actions */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate(`/expert/case/${id}/update`)}
                                className="w-full px-4 py-2 bg-[#18B4A5] text-white rounded-lg hover:bg-[#149f91] transition-colors text-left flex items-center gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Add Follow-up
                            </button>
                            <button
                                onClick={() => navigate(`/expert/case/${id}/history`)}
                                className="w-full px-4 py-2 bg-[#5A8B8A] text-white rounded-lg hover:bg-[#4a7574] transition-colors text-left flex items-center gap-2"
                            >
                                <History className="h-4 w-4" />
                                View History
                            </button>
                            {caseData.status !== 'Closed' && (
                                <button
                                    onClick={() => navigate(`/expert/case/${id}/close`)}
                                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-left flex items-center gap-2"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Close Case
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Case Summary */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Case ID</span>
                                <span className="text-sm font-medium text-gray-900">{caseData.caseId}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Case No</span>
                                <span className="text-sm font-medium text-gray-900">{caseData.caseNo || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Status</span>
                                <span className={`text-sm font-medium ${caseData.status === 'Closed' ? 'text-gray-600' :
                                    caseData.status === 'Pending' ? 'text-yellow-600' :
                                        'text-green-600'
                                    }`}>
                                    {caseData.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Stage</span>
                                <span className="text-sm font-medium text-gray-900">{caseData.caseStage || 'Open'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Priority</span>
                                <span className={`text-sm font-medium ${caseData.priority === 'Critical' ? 'text-red-600' :
                                    caseData.priority === 'High' ? 'text-orange-600' :
                                        caseData.priority === 'Medium' ? 'text-blue-600' :
                                            'text-gray-600'
                                    }`}>
                                    {caseData.priority || 'Medium'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-600">Follow-ups</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {caseData.followUps?.length || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-[#18B4A5]" />
                            Timeline
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Created</label>
                                <p className="mt-1 text-sm text-gray-900">{formatDate(caseData.createdAt)}</p>
                            </div>
                            {caseData.updatedAt && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                                    <p className="mt-1 text-sm text-gray-900">{formatDate(caseData.updatedAt)}</p>
                                </div>
                            )}
                            {caseData.nextDate && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Next Date</label>
                                    <p className="mt-1 text-sm font-medium text-[#18B4A5]">{formatDate(caseData.nextDate)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseDetail;
