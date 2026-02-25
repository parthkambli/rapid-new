import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const RenewalActionModal = ({ isOpen, onClose, onSuccess, alertData }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        status: 'active',
        renewalDate: '',
        notes: '',
        actionTaken: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URI;


    useEffect(() => {
        if (alertData) {
            setFormData({
                status: alertData.status || 'active',
                renewalDate: alertData.expiryDate ? new Date(alertData.expiryDate.split('/').reverse().join('-')).toISOString().split('T')[0] : '',
                notes: alertData.notes || '',
                actionTaken: ''
            });
        }
    }, [alertData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(` ${API_BASE_URL}/renewal-alerts/${alertData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: formData.status,
                    renewalDate: formData.renewalDate,
                    notes: formData.notes,
                    actionTaken: formData.actionTaken
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update renewal');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Update Renewal</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="active">Active</option>
                            <option value="completed">Completed (Renewed)</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Next Renewal Date
                        </label>
                        <input
                            type="date"
                            name="renewalDate"
                            value={formData.renewalDate}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Action Taken / Notes
                        </label>
                        <textarea
                            name="actionTaken"
                            value={formData.actionTaken}
                            onChange={handleChange}
                            rows="3"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe action taken..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RenewalActionModal;
