import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Upload, Calendar } from 'lucide-react';
import apiClient from '../../services/apiClient';

const UpdateCase = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [caseData, setCaseData] = useState(null);
    const [formData, setFormData] = useState({
        text: '',
        stage: 'Initial Review',
        nextDate: new Date().toISOString().split('T')[0],
        attachment: null
    });

    // Fetch case data
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.text.trim()) {
            toast.error('Please enter notes/remarks');
            return;
        }

        setSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append('text', formData.text);
            submitData.append('stage', formData.stage);
            submitData.append('nextDate', formData.nextDate);

            if (formData.attachment) {
                submitData.append('attachment', formData.attachment);
            }

            const response = await apiClient.post(`/query-cases/${id}/follow-up`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success('Follow-up added successfully');
                navigate('/expert/cases');
            } else {
                toast.error(response.data.message || 'Failed to add follow-up');
            }
        } catch (error) {
            console.error('Error adding follow-up:', error);
            toast.error(error.response?.data?.message || 'Error adding follow-up');
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
                        onClick={() => navigate('/expert/cases')}
                        className="mt-4 px-4 py-2 bg-[#18B4A5] text-white rounded hover:bg-[#149f91]"
                    >
                        Back to Cases
                    </button>
                </div>
            </div>
        );
    }

    // const caseStages = ['Initial Review', 'Expert Assigned', 'Document Review', 'Closed', 'Other'];

    const caseStages = [
  '--',
  'Query Raised',
  'Legal Consultation',
  'Expert Opinion',
  'Referred to Civil Surgeon',
  'Show Cause Notice',
  'Notice Received',
  'Notice Replied',
  'Mediation / Settlement',
  'Bill Recovery',
  'FIR / Complaint Filed',
  'Case Filed',
  'Evidence',
  'Cross Examination',
  'Arguments',
  'Order Reserved',
  'Judgement',
  'Appeal',
  'Execution',
  'Other',
  'Close'
];

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
                <h1 className="text-2xl font-bold text-gray-900">Update Case</h1>
                <p className="text-gray-600 mt-1">Add follow-up and update case progress</p>
            </div>

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
                        <label className="block text-sm font-medium text-gray-600">Current Stage</label>
                        <p className="mt-1 text-gray-900 font-medium">{caseData.caseStage || 'Open'}</p>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Case Type</label>
                        <p className="mt-1 text-gray-900">{caseData.caseType || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Update Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Follow-up</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date of Update */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Update <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                name="nextDate"
                                value={formData.nextDate}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18B4A5] focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Next Stage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Next Stage <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="stage"
                            value={formData.stage}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18B4A5] focus:border-transparent"
                            required
                        >
                            {caseStages.map(stage => (
                                <option key={stage} value={stage}>{stage}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Notes/Remarks */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes/Remarks <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="text"
                        value={formData.text}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18B4A5] focus:border-transparent"
                        placeholder="Enter detailed notes about this follow-up..."
                        required
                    />
                </div>

                {/* Attachment */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attachment (Optional)
                    </label>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <Upload className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Choose File</span>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                        </label>
                        {formData.attachment && (
                            <span className="text-sm text-gray-600">{formData.attachment.name}</span>
                        )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-[#18B4A5] text-white rounded-lg hover:bg-[#149f91] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitting ? 'Submitting...' : 'Submit Follow-up'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/expert/cases')}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateCase;
