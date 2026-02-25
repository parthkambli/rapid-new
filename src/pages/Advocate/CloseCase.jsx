import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Calendar, AlertCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';

const CloseCase = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [caseData, setCaseData] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({
        closeDate: new Date().toISOString().split('T')[0],
        resolution: '',
        finalRemarks: ''
    });

    useEffect(() => {
        const fetchCase = async () => {
            try {
                const response = await apiClient.get(`/query-cases/${id}`);
                if (response.data.success) {
                    const data = response.data.data;
                    setCaseData(data);

                    // Check if already closed
                    if (data.status === 'Closed') {
                        toast.warning('This case is already closed');
                    }
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.resolution) {
            toast.error('Please select a resolution');
            return;
        }

        if (!formData.finalRemarks.trim()) {
            toast.error('Please enter final remarks');
            return;
        }

        setShowConfirm(true);
    };

    const confirmClose = async () => {
        setSubmitting(true);
        setShowConfirm(false);

        try {
            const response = await apiClient.patch(`/query-cases/${id}`, {
                status: 'Closed',
                caseStage: 'Closed',
                closedDate: formData.closeDate,
                resolution: formData.resolution,
                finalRemarks: formData.finalRemarks
            });

            if (response.data.success) {
                toast.success('Case closed successfully');
                navigate('/advocate/cases');
            } else {
                toast.error(response.data.message || 'Failed to close case');
            }
        } catch (error) {
            console.error('Error closing case:', error);
            toast.error(error.response?.data?.message || 'Error closing case');
        } finally {
            setSubmitting(false);
        }
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
                        onClick={() => navigate('/advocate/cases')}
                        className="mt-4 px-4 py-2 bg-[#18B4A5] text-white rounded hover:bg-[#149f91]"
                    >
                        Back to Cases
                    </button>
                </div>
            </div>
        );
    }

    const resolutionTypes = ['Won', 'Lost', 'Settled', 'Withdrawn', 'Other'];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/advocate/cases')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Cases
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Close Case</h1>
                <p className="text-gray-600 mt-1">Mark this case as closed with final resolution</p>
            </div>

            {/* Warning if already closed */}
            {caseData.status === 'Closed' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                        <p className="font-medium text-yellow-900">This case is already closed</p>
                        <p className="text-sm text-yellow-700 mt-1">You cannot close an already closed case.</p>
                    </div>
                </div>
            )}

            {/* Case Info Card (Read-Only) */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <label className="block text-sm font-medium text-gray-600">Current Status</label>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${caseData.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                                caseData.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                            }`}>
                            {caseData.status}
                        </span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Case Type</label>
                        <p className="mt-1 text-gray-900">{caseData.caseType || '-'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Patient Name</label>
                        <p className="mt-1 text-gray-900">{caseData.patientName || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Close Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Closure Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Close Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Close Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                name="closeDate"
                                value={formData.closeDate}
                                onChange={handleInputChange}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18B4A5] focus:border-transparent"
                                required
                                disabled={caseData.status === 'Closed'}
                            />
                        </div>
                    </div>

                    {/* Resolution */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Resolution <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="resolution"
                            value={formData.resolution}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18B4A5] focus:border-transparent"
                            required
                            disabled={caseData.status === 'Closed'}
                        >
                            <option value="">Select Resolution</option>
                            {resolutionTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Final Remarks */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Final Remarks <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="finalRemarks"
                        value={formData.finalRemarks}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18B4A5] focus:border-transparent"
                        placeholder="Enter final remarks, outcome, and any important notes about case closure..."
                        required
                        disabled={caseData.status === 'Closed'}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Provide detailed information about the case outcome and resolution.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                    <button
                        type="submit"
                        disabled={submitting || caseData.status === 'Closed'}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitting ? 'Closing...' : 'Close Case'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/advocate/cases')}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Case Closure</h3>
                                <p className="text-gray-600 mb-4">
                                    Are you sure you want to close this case? This action cannot be undone.
                                </p>
                                <div className="bg-gray-50 rounded p-3 mb-4">
                                    <p className="text-sm text-gray-700"><strong>Case ID:</strong> {caseData.caseId}</p>
                                    <p className="text-sm text-gray-700"><strong>Resolution:</strong> {formData.resolution}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={confirmClose}
                                        disabled={submitting}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                                    >
                                        Yes, Close Case
                                    </button>
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        disabled={submitting}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CloseCase;
