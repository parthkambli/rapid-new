// // // src/utils/permissionRules.js

// // export const PERMISSION_RULES = {
// //   // === ADD / CREATE FORMS (Write Required, Read Disabled) ===
// //   "Add Doctor": { required: ["write"], disabled: ["read"] },
// //   "Add Employee": { required: ["write"], disabled: ["read"] },
// //   "Add User": { required: ["write"], disabled: ["read"] },
// //   "Add Policy": { required: ["write"], disabled: ["read"] },
// //   "Create Service Package": { required: ["write"], disabled: ["read"] },
// //   "Create Query Case": { required: ["write"], disabled: ["read"] },
// //   "Create Advocate": { required: ["write"], disabled: ["read"] },
// //   "Create Expert List": { required: ["write"], disabled: ["read"] },

// //   // === LIST / VIEW FORMS (Read Required) ===
// //   "Total Doctor List": { required: ["read"] },
// //   "Employee List": { required: ["read"] },
// //   "Policy List": { required: ["read"] },
// //   "Salesperson List": { required: ["read"] },
// //   "Telecaller List": { required: ["read"] },
// //   "Quotation List": { required: ["read"] },
// //   "Sales Bill List": { required: ["read"] },
// //   "Receipt List": { required: ["read"] },

// //   // === REPORTS (Read Only) ===
// //   "Employee Reports": { required: ["read"], disabled: ["write", "edit", "delete"] },
// //   "Doctor Reports": { required: ["read"], disabled: ["write", "edit", "delete"] },
// //   "Policy Reports": { required: ["read"], disabled: ["write", "edit", "delete"] },
// //   "Advocate Reports": { required: ["read"], disabled: ["write", "edit", "delete"] },
// //   "Expert Reports": { required: ["read"], disabled: ["write", "edit", "delete"] },
// //   "Expense Reports": { required: ["read"], disabled: ["write", "edit", "delete"] },

// //   // === DEFAULT: No special rules ===
// //   // "Dashboard", "User Management", etc. → no rules → all enabled
// // };

// // export const getFormRules = (formName) => {
// //   return PERMISSION_RULES[formName] || {};
// // };































// // src/utils/permissionRules.js

// // Panel-specific disabled permissions
// export const PANEL_DISABLED_PERMISSIONS = {
//   // === ALL PANELS ===
//   // Forms that should never have read permission (creation forms)
//   "Add Doctor": { all: ["read"] },
//   "Add Employee": { all: ["read"] },
//   "Add User": { all: ["read"] },
//   "Add Policy": { all: ["read"] },
//   "Create Service Package": { all: ["read"] },
//   "Create Query Case": { all: ["read"] },
//   "Create Advocate": { all: ["read"] },
//   "Create Expert List": { all: ["read"] },

//   // Reports should only have read permission
//   "Employee Reports": { all: ["write", "edit", "delete"] },
//   "Doctor Reports": { all: ["write", "edit", "delete"] },
//   "Policy Reports": { all: ["write", "edit", "delete"] },
//   "Advocate Reports": { all: ["write", "edit", "delete"] },
//   "Expert Reports": { all: ["write", "edit", "delete"] },
//   "Expense Reports": { all: ["write", "edit", "delete"] },
//   "Case Wise Reports": { all: ["write", "edit", "delete"] },
//   "Dr. DOB Reports": { all: ["write", "edit", "delete"] },
//   "Statement of Account": { all: ["write", "edit", "delete"] },

//   // === PANEL SPECIFIC RULES ===

//   // Employee Panel - Limited permissions
//   "Employee Management": {
//     employee: ["write", "edit", "delete"], // Can only read employee data
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"], // Doctors can't manage employees
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Employee List": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Add Employee": {
//     employee: ["read"], // Can only read (can't create)
//     salesman: ["read"],
//     telecaller: ["read"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Attendance Record": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Salary Management": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },

//   // Doctor Management - Salesman/Telecaller can only read
//   "Doctor Management": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"]
//   },
//   "Total Doctor List": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"]
//   },
//   "Add Doctor": {
//     employee: ["read"],
//     salesman: ["read"],
//     telecaller: ["read"]
//   },
//   "Accept Doctor": {
//     employee: ["read", "write"],
//     salesman: ["read", "write", "edit", "delete"],
//     telecaller: ["read", "write", "edit", "delete"]
//   },
//   "Doctor Follow-ups": {
//     employee: ["read", "write"],
//     salesman: ["read", "write", "edit", "delete"],
//     telecaller: ["read", "write", "edit", "delete"]
//   },

//   // Sales/Transaction forms - Limited for non-sales roles
//   "Quotation List": {
//     employee: ["write", "edit", "delete"]
//   },
//   "Sales Bill List": {
//     employee: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"]
//   },
//   "Receipt List": {
//     employee: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"]
//   },

//   // Policy Management - Limited access
//   "Policy Management": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Policy List": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Add Policy": {
//     employee: ["read"],
//     salesman: ["read"],
//     telecaller: ["read"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },

//   // Renewal Alerts - Limited access
//   "Renewal Alert List": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },

//   // Services - Limited access
//   "Services Package List": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Create Service Package": {
//     employee: ["read"],
//     salesman: ["read"],
//     telecaller: ["read"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },

//   // Queries/Cases - Limited access
//   "Queries or Case": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Create Query Case": {
//     employee: ["read"],
//     salesman: ["read"],
//     telecaller: ["read"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },

//   // User Management - Only admin can manage users
//   "User Management": {
//     employee: ["read", "write", "edit", "delete"],
//     salesman: ["read", "write", "edit", "delete"],
//     telecaller: ["read", "write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "All Users": {
//     employee: ["read", "write", "edit", "delete"],
//     salesman: ["read", "write", "edit", "delete"],
//     telecaller: ["read", "write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Add User": {
//     employee: ["read"],
//     salesman: ["read"],
//     telecaller: ["read"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },

//   // Advocate/Expert Management - Limited access
//   "Advocate List": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Create Advocate": {
//     employee: ["read"],
//     salesman: ["read"],
//     telecaller: ["read"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Expert List": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Create Expert List": {
//     employee: ["read"],
//     salesman: ["read"],
//     telecaller: ["read"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },

//   // Expense Management - Limited access
//   "Expense List": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },

//   // Insurance Companies/Types - Limited access
//   "Insurance Companies": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   },
//   "Insurance Types": {
//     employee: ["write", "edit", "delete"],
//     salesman: ["write", "edit", "delete"],
//     telecaller: ["write", "edit", "delete"],
//     doctor: ["read", "write", "edit", "delete"],
//     advocate: ["read", "write", "edit", "delete"],
//     expert: ["read", "write", "edit", "delete"]
//   }
// };

// // Backward compatibility - old function
// export const DISABLED_PERMISSIONS = {
//   "Add Doctor": ["read"],
//   "Add Employee": ["read"],
//   "Add User": ["read"],
//   "Add Policy": ["read"],
//   "Create Service Package": ["read"],
//   "Create Query Case": ["read"],
//   "Create Advocate": ["read"],
//   "Create Expert List": ["read"],
//   "Employee Reports": ["write", "edit", "delete"],
//   "Doctor Reports": ["write", "edit", "delete"],
//   "Policy Reports": ["write", "edit", "delete"],
//   "Advocate Reports": ["write", "edit", "delete"],
//   "Expert Reports": ["write", "edit", "delete"],
//   "Expense Reports": ["write", "edit", "delete"],
//   "Case Wise Reports": ["write", "edit", "delete"],
//   "Dr. DOB Reports": ["write", "edit", "delete"],
//   "Statement of Account": ["write", "edit", "delete"],
// };

// export const isPermissionDisabled = (formName, action) => {
//   return DISABLED_PERMISSIONS[formName]?.includes(action) || false;
// };

// // New panel-aware permission checking
// export const isPermissionDisabledForPanel = (formName, action, panel) => {
//   const panelRules = PANEL_DISABLED_PERMISSIONS[formName];

//   if (!panelRules) return false;

//   // Check if this permission is disabled for all panels
//   if (panelRules.all && panelRules.all.includes(action)) {
//     return true;
//   }

//   // Check if this permission is disabled for specific panel
//   if (panelRules[panel] && panelRules[panel].includes(action)) {
//     return true;
//   }

//   return false;
// };

// // Get available actions for a form and panel
// export const getAvailableActions = (formName, panel) => {
//   const actions = ['read', 'write', 'edit', 'delete'];
//   return actions.filter(action => !isPermissionDisabledForPanel(formName, action, panel));
// };

// // Check if user has permission for a specific action on a form
// export const hasPermission = (userPermissions, formName, action) => {
//   if (!userPermissions || !Array.isArray(userPermissions)) return false;

//   const formPermission = userPermissions.find(p => p.formName === formName);
//   if (!formPermission) return false;

//   return formPermission[action] === true;
// };

// // Get forms available for a panel
// export const getFormsForPanel = (panel) => {
//   const panelFormsMap = {
//     admin: [
//       "Dashboard",
//       "Employee Management", "Employee List", "Add Employee", "Salesperson List", "Telecaller List", "Attendance Record", "Salary Management",
//       "Doctor Management", "Total Doctor List", "Add Doctor", "Accept Doctor", "Doctor Follow-ups",
//       "Quotation List",
//       "Sales Bill List",
//       "Receipt List",
//       "Policy Management", "Policy List", "Add Policy", "Insurance Companies", "Insurance Types",
//       "Renewal Alert List", "Service Renewal Alert List", "Indemnity Renewal Alert List",
//       "Services Package List", "Services Package List", "Create Service Package",
//       "Queries or Case", "Queries or Case", "Create Query Case",
//       "User Management", "All Users", "Add User",
//       "Advocate List", "Advocate List", "Create Advocate",
//       "Expert List", "Expert List", "Create Expert List",
//       "Expense List",
//       "Reports", "Employee Reports", "Doctor Reports", "Policy Reports", "Advocate Reports", "Expert Reports", "Expense Reports", "Case Wise Reports", "Dr. DOB Reports", "Statement of Account"
//     ],
//     employee: [
//       "Dashboard",
//       "Employee Management", "Employee List", "Add Employee", "Salesperson List", "Telecaller List", "Attendance Record", "Salary Management",
//       "User Management", "All Users", "Add User"
//     ],
//     salesman: [
//       "Dashboard",
//       "Doctor Management", "Total Doctor List", "Add Doctor",
//       "Quotation List",
//       "Sales Bill List",
//       "Receipt List"
//     ],
//     telecaller: [
//       "Dashboard",
//       "Doctor Management", "Total Doctor List",
//       "Quotation List"
//     ],
//     doctor: [
//       "Dashboard",
//       "My Profile", "Personal Details", "Membership Details",
//       "Policy History", "Case List", "Case History", "Payments", "Documents"
//     ],
//     advocate: [
//       "My Assigned Cases", "Update Follow-up", "View History", "Close Case", "Reports"
//     ],
//     expert: [
//       "Assigned Cases", "Give Opinion", "Upload Report", "Reports"
//     ]
//   };

//   return panelFormsMap[panel] || [];
// };











// src/utils/permissionRules.js

// Panel-specific disabled permissions
export const PANEL_DISABLED_PERMISSIONS = {
  // === ALL PANELS ===
  // Forms that should never have read permission (creation forms)
  "Add Doctor": { all: ["read"] },
  "Add Employee": { all: ["read"] },
  "Add User": { all: ["read"] },
  "Add Policy": { all: ["read"] },
  "Create Service Package": { all: ["read"] },
  "Create Query Case": { all: ["read"] },
  "Create Advocate": { all: ["read"] },
  "Create Expert List": { all: ["read"] },

  // Reports should only have read permission
  "Employee Reports": { all: ["write", "edit", "delete"] },
  "Doctor Reports": { all: ["write", "edit", "delete"] },
  "Policy Reports": { all: ["write", "edit", "delete"] },
  "Advocate Reports": { all: ["write", "edit", "delete"] },
  "Expert Reports": { all: ["write", "edit", "delete"] },
  "Expense Reports": { all: ["write", "edit", "delete"] },
  "Case Wise Reports": { all: ["write", "edit", "delete"] },
  "Dr. DOB Reports": { all: ["write", "edit", "delete"] },
  "Statement of Account": { all: ["write", "edit", "delete"] },

  // === PANEL SPECIFIC RULES ===

  // Employee Panel - Limited permissions
  "Employee Management": {
    employee: ["write", "edit", "delete"], // Can only read employee data
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"], // Doctors can't manage employees
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Employee List": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Add Employee": {
    employee: ["read"], // Can only read (can't create)
    salesman: ["read"],
    telecaller: ["read"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Attendance Record": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Salary Management": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },

  // Doctor Management - Salesman/Telecaller can only read
  "Doctor Management": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"]
  },
  "Total Doctor List": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"]
  },
  "Add Doctor": {
    employee: ["read"],
    salesman: ["read"],
    telecaller: ["read"]
  },
  "Accept Doctor": {
    employee: ["read", "write"],
    salesman: ["read", "write", "edit", "delete"],
    telecaller: ["read", "write", "edit", "delete"]
  },
  "Doctor Follow-ups": {
    employee: ["read", "write"],
    salesman: ["read", "write", "edit", "delete"],
    telecaller: ["read", "write", "edit", "delete"]
  },

  // Sales/Transaction forms - Limited for non-sales roles
  "Quotation List": {
    employee: ["write", "edit", "delete"]
  },
  "Sales Bill List": {
    employee: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"]
  },
  "Receipt List": {
    employee: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"]
  },

  // Policy Management - Limited access
  "Policy Management": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Policy List": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Add Policy": {
    employee: ["read"],
    salesman: ["read"],
    telecaller: ["read"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },

  // Renewal Alerts - Limited access
  "Renewal Alert List": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },

  // Services - Limited access
  "Services Package List": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Create Service Package": {
    employee: ["read"],
    salesman: ["read"],
    telecaller: ["read"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },

  // Queries/Cases - Limited access
  "Queries or Case": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Create Query Case": {
    employee: ["read"],
    salesman: ["read"],
    telecaller: ["read"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },

  // User Management - Only admin can manage users
  "User Management": {
    employee: ["read", "write", "edit", "delete"],
    salesman: ["read", "write", "edit", "delete"],
    telecaller: ["read", "write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "All Users": {
    employee: ["read", "write", "edit", "delete"],
    salesman: ["read", "write", "edit", "delete"],
    telecaller: ["read", "write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Add User": {
    employee: ["read"],
    salesman: ["read"],
    telecaller: ["read"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },

  // Advocate/Expert Management - Limited access
  "Advocate List": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Create Advocate": {
    employee: ["read"],
    salesman: ["read"],
    telecaller: ["read"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Expert List": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Create Expert List": {
    employee: ["read"],
    salesman: ["read"],
    telecaller: ["read"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },

  // Expense Management - Limited access
  "Expense List": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },

  // Insurance Companies/Types - Limited access
  "Insurance Companies": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  },
  "Insurance Types": {
    employee: ["write", "edit", "delete"],
    salesman: ["write", "edit", "delete"],
    telecaller: ["write", "edit", "delete"],
    doctor: ["read", "write", "edit", "delete"],
    advocate: ["read", "write", "edit", "delete"],
    expert: ["read", "write", "edit", "delete"]
  }
};

// Backward compatibility - old function
export const DISABLED_PERMISSIONS = {
  "Add Doctor": ["read"],
  "Add Employee": ["read"],
  "Add User": ["read"],
  "Add Policy": ["read"],
  "Create Service Package": ["read"],
  "Create Query Case": ["read"],
  "Create Advocate": ["read"],
  "Create Expert List": ["read"],
  "Employee Reports": ["write", "edit", "delete"],
  "Doctor Reports": ["write", "edit", "delete"],
  "Policy Reports": ["write", "edit", "delete"],
  "Advocate Reports": ["write", "edit", "delete"],
  "Expert Reports": ["write", "edit", "delete"],
  "Expense Reports": ["write", "edit", "delete"],
  "Case Wise Reports": ["write", "edit", "delete"],
  "Dr. DOB Reports": ["write", "edit", "delete"],
  "Statement of Account": ["write", "edit", "delete"],
};

export const isPermissionDisabled = (formName, action) => {
  return DISABLED_PERMISSIONS[formName]?.includes(action) || false;
};

// New panel-aware permission checking
export const isPermissionDisabledForPanel = (formName, action, panel) => {
  const panelRules = PANEL_DISABLED_PERMISSIONS[formName];

  if (!panelRules) return false;

  // Check if this permission is disabled for all panels
  if (panelRules.all && panelRules.all.includes(action)) {
    return true;
  }

  // Check if this permission is disabled for specific panel
  if (panelRules[panel] && panelRules[panel].includes(action)) {
    return true;
  }

  return false;
};

// Get available actions for a form and panel
export const getAvailableActions = (formName, panel) => {
  const actions = ['read', 'write', 'edit', 'delete'];
  return actions.filter(action => !isPermissionDisabledForPanel(formName, action, panel));
};

// Check if user has permission for a specific action on a form
export const hasPermission = (userPermissions, formName, action) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;

  const formPermission = userPermissions.find(p => p.formName === formName);
  if (!formPermission) return false;

  return formPermission[action] === true;
};

// Get forms available for a panel
export const getFormsForPanel = (panel) => {
  const panelFormsMap = {
    admin: [
      "Dashboard",
      "Employee Management", "Employee List", "Add Employee", "Salesperson List", "Telecaller List", "Attendance Record", "Salary Management",
      "Doctor Management", "Total Doctor List", "Add Doctor", "Accept Doctor", "Doctor Follow-ups",
      "Quotation List",
      "Sales Bill List",
      "Receipt List",
      "Policy Management", "Policy List", "Add Policy", "Insurance Companies", "Insurance Types",
      "Renewal Alert List", "Service Renewal Alert List", "Indemnity Renewal Alert List",
      "Services Package List", "Services Package List", "Create Service Package",
      "Queries or Case", "Queries or Case", "Create Query Case",
      "User Management", "All Users", "Add User",
      "Advocate List", "Advocate List", "Create Advocate",
      "Expert List", "Expert List", "Create Expert List",
      "Expense List",
      "Reports", "Employee Reports", "Doctor Reports", "Policy Reports", "Advocate Reports", "Expert Reports", "Expense Reports", "Case Wise Reports", "Dr. DOB Reports", "Statement of Account"
    ],
    employee: [
      "Dashboard",
      "Employee Management", "Employee List", "Add Employee", "Salesperson List", "Telecaller List", "Attendance Record", "Salary Management",
      "User Management", "All Users", "Add User"
    ],
    salesman: [
      "Dashboard",
      "Doctor Management", "Total Doctor List", "Add Doctor",
      "Quotation List",
      "Sales Bill List",
      "Receipt List"
    ],
    telecaller: [
      "Dashboard",
      "Doctor Management", "Total Doctor List",
      "Quotation List"
    ],
    doctor: [
      "Dashboard",
      "My Profile", "Personal Details", "Membership Details",
      "Policy History", "Case List", "Case History", "Payments", "Documents"
    ],
    advocate: [
      "My Assigned Cases", "Update Follow-up", "View History", "Close Case", "Reports"
    ],
    expert: [
      "Assigned Cases", "Give Opinion", "Upload Report", "Reports"
    ]
  };

  return panelFormsMap[panel] || [];
};

// NEW: Permission dependency functions
export const getPermissionDependencies = (permission) => {
  const dependencies = {
    'write': ['read'],
    'edit': ['read'], 
    'delete': ['read']
  };
  
  return dependencies[permission] || [];
};

// NEW: Check if permission change should be allowed based on dependencies
export const canChangePermission = (forms, index, permission, newValue, panel) => {
  const form = forms[index];
  
  // If enabling a permission, check if we need to enable dependencies
  if (newValue === true) {
    const dependencies = getPermissionDependencies(permission);
    
    for (const dep of dependencies) {
      if (!form[dep] && !isPermissionDisabledForPanel(form.name, dep, panel)) {
        // Dependency is not enabled and not disabled by panel rules
        return {
          allowed: false,
          reason: `${permission} permission requires ${dep} permission to be enabled first`
        };
      }
    }
  }
  
  // If disabling a permission, check if other permissions depend on it
  if (newValue === false) {
    const dependentPermissions = Object.entries(getPermissionDependencies())
      .filter(([_, deps]) => deps.includes(permission))
      .map(([perm, _]) => perm);
    
    for (const depPerm of dependentPermissions) {
      if (form[depPerm] && !isPermissionDisabledForPanel(form.name, depPerm, panel)) {
        return {
          allowed: false, 
          reason: `Cannot disable ${permission} because ${depPerm} permission depends on it`
        };
      }
    }
  }
  
  return { allowed: true };
};

// NEW: Check if permission should be disabled considering dependencies
export const isPermissionDisabledWithDependencies = (form, permission, panel) => {
  // Check if disabled by panel rules
  if (!isPermissionDisabledForPanel(form.name, permission, panel)) {
    return false;
  }

  // Check dependency rules
  if (permission !== 'read') {
    const dependencies = getPermissionDependencies(permission);
    if (dependencies.includes('read') && !form.read) {
      return true; // Disable if read permission is not granted
    }
  }

  return false;
};

// Default export for backward compatibility
export default {
  PANEL_DISABLED_PERMISSIONS,
  DISABLED_PERMISSIONS,
  isPermissionDisabled,
  isPermissionDisabledForPanel,
  getAvailableActions,
  hasPermission,
  getFormsForPanel,
  getPermissionDependencies,
  canChangePermission,
  isPermissionDisabledWithDependencies
};