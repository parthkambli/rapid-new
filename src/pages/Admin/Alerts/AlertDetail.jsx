import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../../services/apiClient';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiClock, FiAlertTriangle, FiCalendar, FiUser } from 'react-icons/fi';

const AlertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlert();
  }, [id]);

  const fetchAlert = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.alerts.get(id));
      if (response.data.success) {
        setAlert(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching alert:', err);
      setError('Failed to load alert details');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async () => {
    try {
      await apiClient.post(apiEndpoints.alerts.acknowledge(id));
      alert('Alert acknowledged successfully');
      fetchAlert();
    } catch (err) {
      alert('Failed to acknowledge alert');
    }
  };

  const handleComplete = async () => {
    try {
      await apiClient.post(apiEndpoints.alerts.complete(id));
      alert('Alert completed successfully');
      fetchAlert();
    } catch (err) {
      alert('Failed to complete alert');
    }
  };

  const handleDismiss = async () => {
    if (!window.confirm('Are you sure you want to dismiss this alert?')) return;
    try {
      await apiClient.post(apiEndpoints.alerts.dismiss(id));
      alert('Alert dismissed successfully');
      fetchAlert();
    } catch (err) {
      alert('Failed to dismiss alert');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      sent: 'bg-blue-100 text-blue-800 border-blue-200',
      acknowledged: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      dismissed: 'bg-gray-100 text-gray-800 border-gray-200',
      expired: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      low: <FiClock className="text-blue-500" size={20} />,
      medium: <FiAlertTriangle className="text-yellow-500" size={20} />,
      high: <FiAlertTriangle className="text-orange-500" size={20} />,
      critical: <FiAlertTriangle className="text-red-500" size={20} />
    };
    return icons[priority] || icons.medium;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiXCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading alert</h3>
          <p className="mt-1 text-sm text-gray-500">{error || 'Alert not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" size={16} />
            Back
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{alert.title}</h1>
              <p className="text-sm text-gray-500 mt-1">Alert ID: {alert.alertId}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(alert.status)}`}>
                {alert.status}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600">
                {getPriorityIcon(alert.priority)}
                {alert.priority}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Message Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Alert Message</h2>
              <p className="text-gray-700 whitespace-pre-line">{alert.message}</p>
              {alert.description && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">{alert.description}</p>
                </div>
              )}
            </div>

            {/* Entity Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Entity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Entity Type</span>
                  <span className="text-sm font-medium text-gray-900">{alert.entityType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Entity ID</span>
                  <span className="text-sm font-medium text-gray-900 font-mono">
                    {typeof alert.entityId === 'object' ? alert.entityId._id || alert.entityId.doctorId || alert.entityId.fullName : alert.entityId}
                  </span>
                </div>
                {typeof alert.entityId === 'object' && alert.entityId.fullName && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Entity Name</span>
                    <span className="text-sm font-medium text-gray-900">{alert.entityId.fullName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dates Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiCalendar className="text-gray-400 mt-1" size={16} />
                  <div>
                    <p className="text-xs text-gray-500">Alert Created</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(alert.alertDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiClock className="text-gray-400 mt-1" size={16} />
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(alert.dueDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                {alert.acknowledgedAt && (
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Acknowledged</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(alert.acknowledgedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {alert.completedAt && (
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(alert.completedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {alert.dismissedAt && (
                  <div className="flex items-start gap-3">
                    <FiXCircle className="text-gray-500 mt-1" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Dismissed</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(alert.dismissedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            {alert.status === 'pending' || alert.status === 'sent' ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={handleAcknowledge}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <FiCheckCircle size={16} />
                    Acknowledge
                  </button>
                  <button
                    onClick={handleComplete}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <FiCheckCircle size={16} />
                    Complete
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    <FiXCircle size={16} />
                    Dismiss
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetail;
