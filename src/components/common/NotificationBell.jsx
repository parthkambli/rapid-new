import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../../services/apiClient';

const NotificationBell = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch notifications and unread count
  const fetchNotifications = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get unread count
      const countResponse = await apiClient.get(apiEndpoints.alerts.unreadCount);
      setUnreadCount(countResponse.data?.data?.count || 0);
      
      // Get latest notifications
      const notifResponse = await apiClient.get(
        apiEndpoints.alerts.notifications, 
        { params: { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' } }
      );
      
      setNotifications(notifResponse.data?.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on component mount and when user changes
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling to refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [user?._id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await apiClient.post(apiEndpoints.alerts.markNotificationAsRead(notificationId));
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, status: 'read' } 
            : notif
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await apiClient.post(apiEndpoints.alerts.markAllNotificationsAsRead);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, status: 'read' }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // View all alerts
  const viewAllAlerts = () => {
    setIsOpen(false);
    navigate('/alerts'); // Navigate to alerts page
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);

    // Navigate based on alert type - notification.alertId is the full alert object
    if (notification.alertId) {
      const alertId = notification.alertId._id || notification.alertId;
      const { alertType, entityType, entityId } = notification.alertId;

      // If entityType and entityId exist, navigate to the entity
      if (entityType && entityId) {
        switch (entityType) {
          case 'Doctor':
            navigate(`/admin/doctors/${entityId}`);
            break;
          case 'Task':
            navigate(`/telecaller/tasks/${entityId}`);
            break;
          case 'Policy':
            navigate(`/admin/policies/${entityId}`);
            break;
          case 'Quotation':
            navigate(`/admin/quotations/${entityId}`);
            break;
          default:
            navigate(`/alerts/${alertId}`);
            break;
        }
      } else {
        // No entityType/entityId, just navigate to the alert
        navigate(`/alerts/${alertId}`);
      }
    } else {
      // Fallback: navigate to general alerts page
      navigate('/admin/alerts');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get alert type icon
  const getAlertIcon = (alertType) => {
    const iconMap = {
      'follow_up_reminder': '📅',
      'task_reminder': '✅',
      'policy_renewal': '📄',
      'quotation_expiry': '⚠️',
      'document_due': '📋',
      'payment_due': '💰',
      'overdue_followup': '🚨',
      'assignment_notification': '👤'
    };
    
    return iconMap[alertType] || '🔔';
  };

  // Get alert priority color
  const getPriorityColor = (priority) => {
    const colorMap = {
      'critical': 'text-red-600',
      'high': 'text-orange-500',
      'medium': 'text-yellow-500',
      'low': 'text-green-500'
    };
    
    return colorMap[priority] || 'text-gray-500';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="text-[#398C89] focus:outline-none ml-2 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 max-h-96 overflow-hidden">
          <div className="border-b px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="px-4 py-8 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="px-4 py-3 text-red-600 text-sm">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <span className="text-2xl">🔔</span>
              <p className="mt-2">No notifications</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${
                    notification.status !== 'read' ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <span className="text-lg">
                        {getAlertIcon(notification.alertId?.alertType)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        {notification.alertId?.priority && (
                          <span className={`text-xs font-semibold ${getPriorityColor(notification.alertId.priority)}`}>
                            {notification.alertId.priority.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.createdAt)}
                        {notification.status !== 'read' && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="border-t px-4 py-2 text-center">
            <button
              onClick={viewAllAlerts}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;