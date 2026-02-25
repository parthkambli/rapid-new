// import { useAuth } from './useAuth';

// // Custom hook for permission checking
// export const usePermissions = () => {
//   const { user, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

//   // Check if user can perform a specific action on a form
//   const canAccess = (formName, action = 'read') => {
//     return hasPermission({ formName, action });
//   };


//   // Check if user can read a form
//   const canRead = (formName) => {
//     return canAccess(formName, 'read');
//   };

//   // Check if user can write/create in a form
//   const canWrite = (formName) => {
//     return canAccess(formName, 'write');
//   };

//   // Check if user can edit/update in a form
//   const canEdit = (formName) => {
//     return canAccess(formName, 'edit');
//   };

//   // Check if user can delete in a form
//   const canDelete = (formName) => {
//     return canAccess(formName, 'delete');
//   };

//   // Check if user has full access to a form
//   const hasFullAccess = (formName) => {
//     if (!user) return false;

//     const permission = user.permissions?.find(p => p.formName === formName);
//     return permission?.full || false;
//   };

//   // Get user's permissions for a specific form
//   const getFormPermissions = (formName) => {
//     if (!user) return null;

//     return user.permissions?.find(p => p.formName === formName) || null;
//   };

//   // Check if user is admin (has all permissions)
//   const isAdmin = () => {
//     return user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'super_admin';
//   };

//   // Get all user permissions
//   const getAllPermissions = () => {
//     return user?.permissions || [];
//   };

//   return {
//     canAccess,
//     canRead,
//     canWrite,
//     canEdit,
//     canDelete,
//     hasFullAccess,
//     getFormPermissions,
//     isAdmin,
//     getAllPermissions,
//     hasPermission,
//     hasAnyPermission,
//     hasAllPermissions
//   };
// };

// // Permission constants for consistency
// export const PERMISSIONS = {
//   // User Management
//   USER_MANAGEMENT: 'User Management',

//   // Employee Management
//   EMPLOYEE_MANAGEMENT: 'Employee Management',
//   SALESMAN_MANAGEMENT: 'Salesman Management',
//   TELECALLER_MANAGEMENT: 'Telecaller Management',

//   // Business Operations
//   DOCTOR_LIST: 'Doctor List',
//   QUOTATION_MANAGEMENT: 'Quotation Management',
//   SALES_BILL_MANAGEMENT: 'Sales Bill Management',
//   RECEIPT_MANAGEMENT: 'Receipt Management',
//   POLICY_MANAGEMENT: 'Policy Management',

//   // Legal Services
//   ADVOCATE_LIST_MANAGEMENT: 'Advocate List Management',
//   EXPERT_LIST_MANAGEMENT: 'Expert List Management',

//   // Financial
//   EXPENSE_MANAGEMENT: 'Expense Management',

//   // System
//   RENEWAL_ALERT_LIST_MANAGEMENT: 'Renewal Alert List Management',
//   SERVICES_PACKAGE_LIST_MANAGEMENT: 'Services Package List Management',
//   QUERIES_OR_CASE_MANAGEMENT: 'Queries or Case Management',

//   // Reports
//   REPORTS_MANAGEMENT: 'Reports Management',
//   EMPLOYEE_REPORT_MANAGEMENT: 'Employee Report Management',
//   DOCTOR_REPORT_MANAGEMENT: 'Doctor Report Management',
//   POLICY_REPORT_MANAGEMENT: 'Policy Report Management',
//   ADVOCATE_REPORT_MANAGEMENT: 'Advocate Report Management',
//   EXPERT_REPORT: 'Expert Report',
//   EXPENSE_REPORT: 'Expense Report',
//   CASE_WISE_REPORT: 'Case Wise Report',
//   DOCTOR_DOB_REPORT: 'Dr. DOB Report',
//   STATEMENT_OF_ACCOUNT: 'Statement of Account'
// };

// // Common permission combinations
// export const PERMISSION_GROUPS = {
//   // Admin permissions
//   ADMIN_FULL: [
//     { formName: PERMISSIONS.USER_MANAGEMENT, action: 'read' },
//     { formName: PERMISSIONS.USER_MANAGEMENT, action: 'write' },
//     { formName: PERMISSIONS.USER_MANAGEMENT, action: 'edit' },
//     { formName: PERMISSIONS.USER_MANAGEMENT, action: 'delete' }
//   ],

//   // Sales permissions
//   SALES_BASIC: [
//     { formName: PERMISSIONS.DOCTOR_LIST, action: 'read' },
//     { formName: PERMISSIONS.DOCTOR_LIST, action: 'write' },
//     { formName: PERMISSIONS.DOCTOR_LIST, action: 'edit' },
//     { formName: PERMISSIONS.QUOTATION_MANAGEMENT, action: 'read' },
//     { formName: PERMISSIONS.QUOTATION_MANAGEMENT, action: 'write' }
//   ],

//   // Telecaller permissions
//   TELECALLER_BASIC: [
//     { formName: PERMISSIONS.DOCTOR_LIST, action: 'read' },
//     { formName: PERMISSIONS.QUOTATION_MANAGEMENT, action: 'read' },
//     { formName: PERMISSIONS.QUOTATION_MANAGEMENT, action: 'write' }
//   ]
// };











// src/hooks/usePermissions.js
import { useAuth } from './useAuth';

// Custom hook for permission checking
export const usePermissions = () => {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  // Check if user can perform a specific action on a form
  const canAccess = (formName, action = 'read') => {
    return hasPermission({ formName, action });
  };


  // Check if user can read a form
  const canRead = (formName) => {
    return canAccess(formName, 'read');
  };

  // Check if user can write/create in a form
  const canWrite = (formName) => {
    return canAccess(formName, 'write');
  };

  // Check if user can edit/update in a form
  const canEdit = (formName) => {
    return canAccess(formName, 'edit');
  };

  // Check if user can delete in a form
  const canDelete = (formName) => {
    return canAccess(formName, 'delete');
  };

  // Check if user has full access to a form
  const hasFullAccess = (formName) => {
    if (!user) return false;

    const permission = user.permissions?.find(p => p.formName === formName);
    return permission?.full || false;
  };

  // Get user's permissions for a specific form
  const getFormPermissions = (formName) => {
    if (!user) return null;

    return user.permissions?.find(p => p.formName === formName) || null;
  };

  // Check if user is admin (has all permissions)
  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'super_admin';
  };

  // Get all user permissions
  const getAllPermissions = () => {
    return user?.permissions || [];
  };

  return {
    canAccess,
    canRead,
    canWrite,
    canEdit,
    canDelete,
    hasFullAccess,
    getFormPermissions,
    isAdmin,
    getAllPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};

// Permission constants for consistency
export const PERMISSIONS = {
  // User Management
  USER_MANAGEMENT: 'User Management',

  // Employee Management
  EMPLOYEE_MANAGEMENT: 'Employee Management',
  SALESMAN_MANAGEMENT: 'Salesman Management',
  TELECALLER_MANAGEMENT: 'Telecaller Management',

  // Business Operations
  DOCTOR_LIST: 'Doctor List',
  QUOTATION_MANAGEMENT: 'Quotation Management',
  SALES_BILL_MANAGEMENT: 'Sales Bill Management',
  RECEIPT_MANAGEMENT: 'Receipt Management',
  POLICY_MANAGEMENT: 'Policy Management',


  // og
  //   ADVOCATE_LIST_MANAGEMENT: 'Advocate List Management',
  // EXPERT_LIST_MANAGEMENT: 'Expert List Management',

  // Legal Services
  ADVOCATE_LIST: 'Advocate List',
  EXPERT_LIST: 'Expert List',

  // Financial
  EXPENSE_MANAGEMENT: 'Expense Management',

  // System
  RENEWAL_ALERT_LIST_MANAGEMENT: 'Renewal Alert List Management',
  SERVICES_PACKAGE_LIST_MANAGEMENT: 'Services Package List Management',
  QUERIES_OR_CASE_MANAGEMENT: 'Queries or Case Management',

  // Reports
  REPORTS_MANAGEMENT: 'Reports Management',
  EMPLOYEE_REPORT_MANAGEMENT: 'Employee Report Management',
  DOCTOR_REPORT_MANAGEMENT: 'Doctor Report Management',
  POLICY_REPORT_MANAGEMENT: 'Policy Report Management',
  ADVOCATE_REPORT_MANAGEMENT: 'Advocate Report Management',
  EXPERT_REPORT: 'Expert Report',
  EXPENSE_REPORT: 'Expense Report',
  CASE_WISE_REPORT: 'Case Wise Report',
  DOCTOR_DOB_REPORT: 'Dr. DOB Report',
  STATEMENT_OF_ACCOUNT: 'Statement of Account'
};

// Common permission combinations
export const PERMISSION_GROUPS = {
  // Admin permissions
  ADMIN_FULL: [
    { formName: PERMISSIONS.USER_MANAGEMENT, action: 'read' },
    { formName: PERMISSIONS.USER_MANAGEMENT, action: 'write' },
    { formName: PERMISSIONS.USER_MANAGEMENT, action: 'edit' },
    { formName: PERMISSIONS.USER_MANAGEMENT, action: 'delete' }
  ],

  // Sales permissions
  SALES_BASIC: [
    { formName: PERMISSIONS.DOCTOR_LIST, action: 'read' },
    { formName: PERMISSIONS.DOCTOR_LIST, action: 'write' },
    { formName: PERMISSIONS.DOCTOR_LIST, action: 'edit' },
    { formName: PERMISSIONS.QUOTATION_MANAGEMENT, action: 'read' },
    { formName: PERMISSIONS.QUOTATION_MANAGEMENT, action: 'write' }
  ],

  // Telecaller permissions
  TELECALLER_BASIC: [
    { formName: PERMISSIONS.DOCTOR_LIST, action: 'read' },
    { formName: PERMISSIONS.QUOTATION_MANAGEMENT, action: 'read' },
    { formName: PERMISSIONS.QUOTATION_MANAGEMENT, action: 'write' }
  ]
};

// Default export
export default usePermissions;