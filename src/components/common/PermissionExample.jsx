// Example component showing how to use permission-based access control
import React from 'react';
import { usePermissions, PERMISSIONS } from '../../hooks/usePermissions';

const PermissionExample = () => {
  const {
    canRead,
    canWrite,
    canEdit,
    canDelete,
    hasFullAccess,
    getFormPermissions,
    isAdmin
  } = usePermissions();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Permission-Based Access Control Example</h3>

      {/* Admin Check */}
      {isAdmin() && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
          ✅ You are an Admin - You have access to everything!
        </div>
      )}

      {/* User Management Permissions */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">User Management Permissions:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <span className={`px-2 py-1 rounded text-sm ${canRead(PERMISSIONS.USER_MANAGEMENT) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Read: {canRead(PERMISSIONS.USER_MANAGEMENT) ? '✅' : '❌'}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${canWrite(PERMISSIONS.USER_MANAGEMENT) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Write: {canWrite(PERMISSIONS.USER_MANAGEMENT) ? '✅' : '❌'}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${canEdit(PERMISSIONS.USER_MANAGEMENT) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Edit: {canEdit(PERMISSIONS.USER_MANAGEMENT) ? '✅' : '❌'}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${canDelete(PERMISSIONS.USER_MANAGEMENT) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Delete: {canDelete(PERMISSIONS.USER_MANAGEMENT) ? '✅' : '❌'}
          </span>
        </div>
      </div>

      {/* Doctor Management Permissions */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Doctor Management Permissions:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <span className={`px-2 py-1 rounded text-sm ${canRead(PERMISSIONS.DOCTOR_LIST) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Read: {canRead(PERMISSIONS.DOCTOR_LIST) ? '✅' : '❌'}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${canWrite(PERMISSIONS.DOCTOR_LIST) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Write: {canWrite(PERMISSIONS.DOCTOR_LIST) ? '✅' : '❌'}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${canEdit(PERMISSIONS.DOCTOR_LIST) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Edit: {canEdit(PERMISSIONS.DOCTOR_LIST) ? '✅' : '❌'}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${canDelete(PERMISSIONS.DOCTOR_LIST) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Delete: {canDelete(PERMISSIONS.DOCTOR_LIST) ? '✅' : '❌'}
          </span>
        </div>
      </div>

      {/* Conditional Rendering Based on Permissions */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Conditional UI Elements:</h4>

        {canWrite(PERMISSIONS.USER_MANAGEMENT) && (
          <button className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add User
          </button>
        )}

        {canEdit(PERMISSIONS.DOCTOR_LIST) && (
          <button className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Edit Doctor
          </button>
        )}

        {canDelete(PERMISSIONS.POLICY_MANAGEMENT) && (
          <button className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Delete Policy
          </button>
        )}

        {hasFullAccess(PERMISSIONS.REPORTS_MANAGEMENT) && (
          <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Full Reports Access
          </button>
        )}
      </div>

      {/* Permission Details */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Detailed Permissions:</h4>
        <div className="bg-gray-50 p-3 rounded text-sm">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(getFormPermissions(PERMISSIONS.USER_MANAGEMENT), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PermissionExample;
