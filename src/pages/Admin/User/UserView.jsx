import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../../../services/apiClient";

const UserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get(`/users/${id}`);
      
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        setError("User not found");
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.response?.data?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-red-100 text-red-800 border border-red-200';
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: 'bg-purple-100 text-purple-800 border border-purple-200',
      super_admin: 'bg-red-100 text-red-800 border border-red-200',
      doctor: 'bg-blue-100 text-blue-800 border border-blue-200',
      salesman: 'bg-orange-100 text-orange-800 border border-orange-200',
      telecaller: 'bg-teal-100 text-teal-800 border border-teal-200',
      advocate: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      expert: 'bg-pink-100 text-pink-800 border border-pink-200',
      sales: 'bg-cyan-100 text-cyan-800 border border-cyan-200'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D78] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <strong className="block mb-1">Error</strong>
            {error || 'User not found'}
          </div>
          <button
            onClick={() => navigate('/admin/all-users')}
            className="bg-[#2E7D78] text-white px-6 py-2 rounded-lg hover:bg-[#256f6a] transition-colors"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate('/admin/all-users')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">User Details</h1>
            </div>
            <p className="text-gray-600 ml-10">View complete user information and permissions</p>
          </div>
          
          <div className="flex gap-3 w-full lg:w-auto">
            <Link
              to={`/admin/users/edit/${user._id}`}
              className="flex-1 lg:flex-none bg-[#2E7D78] text-white px-6 py-3 rounded-lg hover:bg-[#256f6a] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit User
            </Link>
          </div>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-[#2E7D78] to-[#1B504E] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(user.status)}`}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge(user.role)}`}>
                    {user.role?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* User Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                    <p className="text-gray-800 font-mono">{user.userId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                    <p className="text-gray-800">{user.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                    <p className="text-gray-800">{user.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Panel</label>
                    <p className="text-gray-800 capitalize">{user.panel}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Created By</label>
                    <p className="text-gray-800">
                      {user.createdBy?.fullName || 'System'} 
                      {user.createdBy?.email && ` (${user.createdBy.email})`}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
                    <p className="text-gray-800">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleString() 
                        : 'Never logged in'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {user.remarks && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Remarks</label>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Permissions</h3>
          
          {user.permissions && user.permissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Form / Section</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Read</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Write</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Edit</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Delete</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Full Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {user.permissions.map((permission, index) => (
                    <tr key={permission._id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                        {permission.formName}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          permission.read ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {permission.read ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          permission.write ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {permission.write ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          permission.edit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {permission.edit ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          permission.delete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {permission.delete ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          permission.full ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {permission.full ? '✓' : '✗'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-gray-500">No permissions assigned to this user</p>
            </div>
          )}

          {/* Summary */}
          {user.permissions && user.permissions.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="bg-blue-50 px-3 py-2 rounded-lg">
                  <span className="font-medium text-blue-800">Total Forms: </span>
                  <span className="text-blue-600">{user.permissions.length}</span>
                </div>
                <div className="bg-green-50 px-3 py-2 rounded-lg">
                  <span className="font-medium text-green-800">Full Access: </span>
                  <span className="text-green-600">
                    {user.permissions.filter(p => p.full).length}
                  </span>
                </div>
                <div className="bg-purple-50 px-3 py-2 rounded-lg">
                  <span className="font-medium text-purple-800">Read Only: </span>
                  <span className="text-purple-600">
                    {user.permissions.filter(p => p.read && !p.write && !p.edit && !p.delete).length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserView;