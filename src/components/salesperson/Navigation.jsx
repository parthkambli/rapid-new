

// import { useMemo } from 'react';
// import { usePermissions } from '../../hooks/usePermissions';

// const SalesNav = () => {
//   const { canRead, hasFullAccess, user } = usePermissions();

//   // Define navigation items for salesman panel with required permissions
//   const allNavItems = [
//     {
//       label: 'Dashboard',
//       path: '/sales/dashboard',
//       requiredPermission: 'Dashboard',
//       requiredAction: 'read'
//     },
//     {
//       label: 'Doctor Forms',
//       path: '/sales/add-doctor',
//       requiredPermission: 'Doctor Forms',
//       requiredAction: 'read'
//     },
//     {
//       label: 'Total Doctors',
//       path: '/sales/all-doctors',
//       requiredPermission: 'Total Doctors',
//       requiredAction: 'read'
//     },
//     {
//       label: 'Transfer Doctors',
//       path: '/transfer',
//       requiredPermission: 'Transfer Doctors',
//       requiredAction: 'read'
//     },
//     {
//       label: 'Quotation',
//       path: '/sales/quotation-list',
//       requiredPermission: 'Quotation',
//       requiredAction: 'read'
//     },
//     {
//       label: 'Report',
//       path: '/reports',
//       requiredPermission: 'Report',
//       requiredAction: 'read'
//     }
//   ];

//   // Define a mapping of permission names to their corresponding paths and structures
//   const permissionMapping = {
//     'Dashboard': {
//       label: 'Dashboard',
//       path: '/sales/dashboard',
//       requiredPermission: 'Dashboard',
//       requiredAction: 'read'
//     },
//     'Doctor Forms': {
//       label: 'Doctor Forms',
//       path: '/sales/add-doctor',
//       requiredPermission: 'Doctor Forms',
//       requiredAction: 'read'
//     },
//     'Total Doctors': {
//       label: 'Total Doctors',
//       path: '/sales/all-doctors',
//       requiredPermission: 'Total Doctors',
//       requiredAction: 'read'
//     },
//     'Transfer Doctors': {
//       label: 'Transfer Doctors',
//       path: '/transfer',
//       requiredPermission: 'Transfer Doctors',
//       requiredAction: 'read'
//     },
//     'Quotation': {
//       label: 'Quotation',
//       path: '/sales/add/quotation',
//       requiredPermission: 'Quotation',
//       requiredAction: 'read'
//     },
//     'Report': {
//       label: 'Report',
//       path: '/reports',
//       requiredPermission: 'Report',
//       requiredAction: 'read'
//     },
//     // Add more mappings for other permissions
//     'Policy Management': {
//       label: 'Policy Management',
//       path: '/sales/policy-list',
//       requiredPermission: 'Policy Management',
//       requiredAction: 'read'
//     },
//     'Policy List': {
//       label: 'Policy List',
//       path: '/sales/policy-list',
//       requiredPermission: 'Policy List',
//       requiredAction: 'read'
//     },
//     'Add Policy': {
//       label: 'Add Policy',
//       path: '/sales/add-policy',
//       requiredPermission: 'Add Policy',
//       requiredAction: 'write'
//     },
//     'Insurance Companies': {
//       label: 'Insurance Companies',
//       path: '/sales/insurance-companies-list',
//       requiredPermission: 'Insurance Companies',
//       requiredAction: 'read'
//     },
//     'Insurance Types': {
//       label: 'Insurance Types',
//       path: '/sales/insurance-types',
//       requiredPermission: 'Insurance Types',
//       requiredAction: 'read'
//     },
//     'Renewal Alert List': {
//       label: 'Renewal Alert List',
//       path: '/sales/renewal-alert-list',
//       requiredPermission: 'Renewal Alert List',
//       requiredAction: 'read'
//     },
//     'Service Renewal Alert List': {
//       label: 'Service Renewal Alert List',
//       path: '/sales/service-renewal-alert-list',
//       requiredPermission: 'Service Renewal Alert List',
//       requiredAction: 'read'
//     },
//     'Indemnity Renewal Alert List': {
//       label: 'Indemnity Renewal Alert List',
//       path: '/sales/indemnity-renewal-alert-list',
//       requiredPermission: 'Indemnity Renewal Alert List',
//       requiredAction: 'read'
//     },
//     'Services Package List': {
//       label: 'Services Package List',
//       path: '/sales/service-package-list',
//       requiredPermission: 'Services Package List',
//       requiredAction: 'read'
//     },
//     'Create Service Package': {
//       label: 'Create Service Package',
//       path: '/sales/create-service-package',
//       requiredPermission: 'Create Service Package',
//       requiredAction: 'write'
//     },
//     'Queries or Case': {
//       label: 'Queries or Case',
//       path: '/sales/queries-or-case',
//       requiredPermission: 'Queries or Case',
//       requiredAction: 'read'
//     },
//     'Create Query Case': {
//       label: 'Create Query Case',
//       path: '/sales/create-query-case',
//       requiredPermission: 'Create Query Case',
//       requiredAction: 'write'
//     },
//     'Advocate List': {
//       label: 'Advocate List',
//       path: '/sales/advocate-list',
//       requiredPermission: 'Advocate List',
//       requiredAction: 'read'
//     },
//     'Create Advocate': {
//       label: 'Create Advocate',
//       path: '/sales/create-advocate',
//       requiredPermission: 'Create Advocate',
//       requiredAction: 'write'
//     },
//     'Expert List': {
//       label: 'Expert List',
//       path: '/sales/expert-list',
//       requiredPermission: 'Expert List',
//       requiredAction: 'read'
//     },
//     'Create Expert List': {
//       label: 'Create Expert List',
//       path: '/sales/create-expert-list',
//       requiredPermission: 'Create Expert List',
//       requiredAction: 'write'
//     },
//     'Expense List': {
//       label: 'Expense List',
//       path: '/sales/expense-list',
//       requiredPermission: 'Expense List',
//       requiredAction: 'read'
//     },
//     'Reports': {
//       label: 'Reports',
//       path: '/sales/reports',
//       requiredPermission: 'Reports',
//       requiredAction: 'read'
//     },
//     'Expert List': {
//       label: 'Expert List',
//       path: '/sales/expert-list',
//       requiredPermission: 'Expert List',
//       requiredAction: 'read'
//     },
//     'Create Expert List': {
//       label: 'Create Expert List',
//       path: '/sales/create-expert-list',
//       requiredPermission: 'Create Expert List',
//       requiredAction: 'write'
//     },
//     'Create Expert Bill': {
//       label: 'Create Expert Bill',
//       path: '/sales/create-expert-bill',
//       requiredPermission: 'Create Expert Bill',
//       requiredAction: 'write'
//     },
//     'Create Advocate Bill': {
//       label: 'Create Advocate Bill',
//       path: '/sales/create-advocate-bill',
//       requiredPermission: 'Create Advocate Bill',
//       requiredAction: 'write'
//     },
//     'Create Advocate': {
//       label: 'Create Advocate',
//       path: '/sales/create-advocate',
//       requiredPermission: 'Create Advocate',
//       requiredAction: 'write'
//     },
//     'Create Expense': {
//       label: 'Create Expense',
//       path: '/sales/create-expense',
//       requiredPermission: 'Create Expense',
//       requiredAction: 'write'
//     },
//     'Employee Reports': {
//       label: 'Employee Reports',
//       path: '/sales/employee-reports',
//       requiredPermission: 'Employee Reports',
//       requiredAction: 'read'
//     },
//     'Doctor Reports': {
//       label: 'Doctor Reports',
//       path: '/sales/doctor-reports',
//       requiredPermission: 'Doctor Reports',
//       requiredAction: 'read'
//     },
//     'Policy Reports': {
//       label: 'Policy Reports',
//       path: '/sales/policy-reports',
//       requiredPermission: 'Policy Reports',
//       requiredAction: 'read'
//     },
//     'Advocate Reports': {
//       label: 'Advocate Reports',
//       path: '/sales/advocate-reports',
//       requiredPermission: 'Advocate Reports',
//       requiredAction: 'read'
//     },
//     'Expert Reports': {
//       label: 'Expert Reports',
//       path: '/sales/expert-reports',
//       requiredPermission: 'Expert Reports',
//       requiredAction: 'read'
//     },
//     'Expense Reports': {
//       label: 'Expense Reports',
//       path: '/sales/expense-reports',
//       requiredPermission: 'Expense Reports',
//       requiredAction: 'read'
//     },
//     'Case Wise Reports': {
//       label: 'Case Wise Reports',
//       path: '/sales/case-wise-reports',
//       requiredPermission: 'Case Wise Reports',
//       requiredAction: 'read'
//     },
//     'Dr. DOB Reports': {
//       label: 'Dr. DOB Reports',
//       path: '/sales/dr-dob-reports',
//       requiredPermission: 'Dr. DOB Reports',
//       requiredAction: 'read'
//     },
//     'Statement of Account': {
//       label: 'Statement of Account',
//       path: '/sales/account-statement-reports',
//       requiredPermission: 'Statement of Account',
//       requiredAction: 'read'
//     },
//     'Add Insurance Company': {
//       label: 'Add Insurance Company',
//       path: '/sales/add-insurance-company',
//       requiredPermission: 'Add Insurance Company',
//       requiredAction: 'write'
//     },
//     'Add Insurance Type': {
//       label: 'Add Insurance Type',
//       path: '/sales/add-insurance-type',
//       requiredPermission: 'Add Insurance Type',
//       requiredAction: 'write'
//     },
//     'Add User': {
//       label: 'Add User',
//       path: '/sales/user',
//       requiredPermission: 'Add User',
//       requiredAction: 'write'
//     },
//     'All Users': {
//       label: 'All Users',
//       path: '/sales/all-users',
//       requiredPermission: 'All Users',
//       requiredAction: 'read'
//     },
//     'User Management': {
//       label: 'User Management',
//       path: '/sales/user-management',
//       requiredPermission: 'User Management',
//       requiredAction: 'read'
//     },
//     'View Doctor': {
//       label: 'View Doctor',
//       path: '/sales/all-doctors',
//       requiredPermission: 'Total Doctor List',
//       requiredAction: 'read'
//     },
//     'Attendance Record': {
//       label: 'Attendance Record',
//       path: '/sales/attendance-record',
//       requiredPermission: 'Attendance Record',
//       requiredAction: 'read'
//     },
//     'Salary Management': {
//       label: 'Salary Management',
//       path: '/sales/salary-management',
//       requiredPermission: 'Salary Management',
//       requiredAction: 'read'
//     },
//     'Create Quotation': {
//       label: 'Create Quotation',
//       path: '/sales/create-quotation',
//       requiredPermission: 'Quotation List',
//       requiredAction: 'write'
//     },
//     'Add Salesbill': {
//       label: 'Add Salesbill',
//       path: '/sales/add-salesbill',
//       requiredPermission: 'Sales Bill List',
//       requiredAction: 'write'
//     },
//     'Create Receipt': {
//       label: 'Create Receipt',
//       path: '/sales/create-receipt',
//       requiredPermission: 'Receipt List',
//       requiredAction: 'write'
//     },
//     'Accept Doctor': {
//       label: 'Accept Doctor',
//       path: '/sales/accept-doctor',
//       requiredPermission: 'Accept Doctor',
//       requiredAction: 'write'
//     },
//     'Doctor Follow-ups': {
//       label: 'Doctor Follow-ups',
//       path: '/sales/doctor-follow-ups',
//       requiredPermission: 'Doctor Follow-ups',
//       requiredAction: 'read'
//     },
//     'Send Message': {
//       label: 'Send Message',
//       path: '/sales/send-message',
//       requiredPermission: 'Send Message',
//       requiredAction: 'write'
//     },
//     'Employee List': {
//       label: 'Employee List',
//       path: '/sales/employee-list',
//       requiredPermission: 'Employee List',
//       requiredAction: 'read'
//     },
//     'Salesperson List': {
//       label: 'Salesperson List',
//       path: '/sales/salesperson-list',
//       requiredPermission: 'Salesperson List',
//       requiredAction: 'read'
//     },
//     'Telecaller List': {
//       label: 'Telecaller List',
//       path: '/sales/telecaller-list',
//       requiredPermission: 'Telecaller List',
//       requiredAction: 'read'
//     },
//     'All Users': {
//       label: 'All Users',
//       path: '/sales/all-users',
//       requiredPermission: 'All Users',
//       requiredAction: 'read'
//     },
//     // Add more mappings as needed
//   };

//   // Generate navigation items dynamically from user permissions (from login response)
//   // along with the predefined navigation items
//   const dynamicNavItems = useMemo(() => {
//     if (!user?.permissions || user.permissions.length === 0) {
//       return allNavItems.filter(item => {
//         // Check if user has permission for this item
//         const hasPermission = canRead(item.requiredPermission);
//         if (!hasPermission) return false;

//         // Filter subMenu items if they exist
//         if (item.subMenu) {
//           item.subMenu = item.subMenu.filter(subItem => {
//             // Check appropriate permission for sub-item action
//             if (subItem.requiredAction === 'write') {
//               return user?.permissions?.find(p => p.formName === subItem.requiredPermission)?.write;
//             }
//             return canRead(subItem.requiredPermission);
//           });
//           // Keep parent item even if all sub-items are filtered out, but only if parent is accessible
//           return item.subMenu.length > 0 || hasPermission;
//         }

//         return true;
//       });
//     }

//     const navItems = [...allNavItems]; // Start with predefined items
//     const processedPermissions = new Set();

//     // Add items for permissions that have explicit mappings but aren't already in allNavItems
//     user.permissions.forEach(permission => {
//       const permissionName = permission.formName;

//       // Skip if already processed or doesn't have required access
//       if (processedPermissions.has(permissionName)) {
//         return;
//       }

//       // Check if this permission has read access (or full access)
//       const hasReadAccess = permission.read || permission.full;

//       if (hasReadAccess) {
//         const navConfig = permissionMapping[permissionName];

//         // Only add if not already in the predefined list
//         if (navConfig && !navItems.some(item => item.requiredPermission === permissionName)) {
//           navItems.push({
//             label: navConfig.label,
//             path: navConfig.path,
//             requiredPermission: navConfig.requiredPermission,
//             requiredAction: navConfig.requiredAction,
//             subMenu: navConfig.subMenu || undefined
//           });
//           processedPermissions.add(permissionName);
//         }
//       }
//     });

//     // Filter the combined list by permissions
//     return navItems.filter(item => {
//       const hasPermission = canRead(item.requiredPermission);
//       if (!hasPermission) return false;

//       // Filter subMenu items if they exist
//       if (item.subMenu) {
//         item.subMenu = item.subMenu.filter(subItem => {
//           // Check appropriate permission for sub-item action
//           if (subItem.requiredAction === 'write') {
//             return user?.permissions?.find(p => p.formName === subItem.requiredPermission)?.write;
//           }
//           return canRead(subItem.requiredPermission);
//         });
//         // Keep parent item even if all sub-items are filtered out, but only if parent is accessible
//         return item.subMenu.length > 0 || hasPermission;
//       }

//       return true;
//     });
//   }, [allNavItems, canRead, user]);

//   return dynamicNavItems;
// };

// export default SalesNav;





import { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';

const SalesNav = () => {
  const { user } = useAuth();

  // Define a mapping of ALL possible permission names to their corresponding paths
  const permissionMapping = {
    // Default 6 permissions for salesman
    'Dashboard': {
      label: 'Dashboard',
      path: '/sales/dashboard',
      requiredPermission: 'Dashboard',
      requiredAction: 'read'
    },
    'Doctor Forms': {
      label: 'Doctor Forms',
      path: '/sales/add-doctor',
      requiredPermission: 'Doctor Forms',
      requiredAction: 'read'
    },
    'Total Doctors': {
      label: 'Total Doctors',
      path: '/sales/all-doctors',
      requiredPermission: 'Total Doctors',
      requiredAction: 'read'
    },
    'Transfer Doctors': {
      label: 'Transfer Doctors',
      path: '/sales/transfer',
      requiredPermission: 'Transfer Doctors',
      requiredAction: 'read'
    },
    'Quotation': {
      label: 'Quotation',
      path: '/sales/quotation-list',
      requiredPermission: 'Quotation',
      requiredAction: 'read'
    },
    'Report': {
      label: 'Report',
      path: '/sales/reports',
      requiredPermission: 'Report',
      requiredAction: 'read'
    },
    
    // Additional permissions (jo admin set kar sakta hai user management se)
    'Policy Management': {
      label: 'Policy Management',
      path: '/sales/policy-list',
      requiredPermission: 'Policy Management',
      requiredAction: 'read'
    },
    'Policy List': {
      label: 'Policy List',
      path: '/sales/policy-list',
      requiredPermission: 'Policy List',
      requiredAction: 'read'
    },
    'Add Policy': {
      label: 'Add Policy',
      path: '/sales/add-policy',
      requiredPermission: 'Add Policy',
      requiredAction: 'write'
    },
    'Insurance Companies': {
      label: 'Insurance Companies',
      path: '/sales/insurance-companies-list',
      requiredPermission: 'Insurance Companies',
      requiredAction: 'read'
    },
    'Insurance Types': {
      label: 'Insurance Types',
      path: '/sales/insurance-types',
      requiredPermission: 'Insurance Types',
      requiredAction: 'read'
    },
    'Renewal Alert List': {
      label: 'Renewal Alert List',
      path: '/sales/renewal-alert-list',
      requiredPermission: 'Renewal Alert List',
      requiredAction: 'read'
    },
    'Service Renewal Alert List': {
      label: 'Service Renewal Alert List',
      path: '/sales/service-renewal-alert-list',
      requiredPermission: 'Service Renewal Alert List',
      requiredAction: 'read'
    },
    'Indemnity Renewal Alert List': {
      label: 'Indemnity Renewal Alert List',
      path: '/sales/indemnity-renewal-alert-list',
      requiredPermission: 'Indemnity Renewal Alert List',
      requiredAction: 'read'
    },
    'Services Package List': {
      label: 'Services Package List',
      path: '/sales/service-package-list',
      requiredPermission: 'Services Package List',
      requiredAction: 'read'
    },
    'Create Service Package': {
      label: 'Create Service Package',
      path: '/sales/create-service-package',
      requiredPermission: 'Create Service Package',
      requiredAction: 'write'
    },
    'Queries or Case': {
      label: 'Queries or Case',
      path: '/sales/queries-or-case',
      requiredPermission: 'Queries or Case',
      requiredAction: 'read'
    },
    'Create Query Case': {
      label: 'Create Query Case',
      path: '/sales/create-query-case',
      requiredPermission: 'Create Query Case',
      requiredAction: 'write'
    },
    'Advocate List': {
      label: 'Advocate List',
      path: '/sales/advocate-list',
      requiredPermission: 'Advocate List',
      requiredAction: 'read'
    },
    'Create Advocate': {
      label: 'Create Advocate',
      path: '/sales/create-advocate',
      requiredPermission: 'Advocate List',
      requiredAction: 'write'
    },
    'Expert List': {
      label: 'Expert List',
      path: '/sales/expert-list',
      requiredPermission: 'Expert List',
      requiredAction: 'read'
    },
    'Create Expert List': {
      label: 'Create Expert List',
      path: '/sales/create-expert-list',
      requiredPermission: 'Expert List',
      requiredAction: 'write'
    },
    'Expense List': {
      label: 'Expense List',
      path: '/sales/expense-list',
      requiredPermission: 'Expense List',
      requiredAction: 'read'
    },
    'Reports': {
      label: 'Reports',
      path: '/sales/emp/reports',
      requiredPermission: 'Reports',
      requiredAction: 'read'
    },
    'Create Expert Bill': {
      label: 'Create Expert Bill',
      path: '/sales/create-expert-bill',
      requiredPermission: 'Create Expert Bill',
      requiredAction: 'write'
    },
    'Create Advocate Bill': {
      label: 'Create Advocate Bill',
      path: '/sales/create-advocate-bill',
      requiredPermission: 'Create Advocate Bill',
      requiredAction: 'write'
    },
    'Create Expense': {
      label: 'Create Expense',
      path: '/sales/create-expense',
      requiredPermission: 'Create Expense',
      requiredAction: 'write'
    },
    'Employee Reports': {
      label: 'Employee Reports',
      path: '/sales/employee-reports',
      requiredPermission: 'Employee Reports',
      requiredAction: 'read'
    },
    'Doctor Reports': {
      label: 'Doctor Reports',
      path: '/sales/doctor-reports',
      requiredPermission: 'Doctor Reports',
      requiredAction: 'read'
    },
    'Policy Reports': {
      label: 'Policy Reports',
      path: '/sales/policy-reports',
      requiredPermission: 'Policy Reports',
      requiredAction: 'read'
    },
    'Advocate Reports': {
      label: 'Advocate Reports',
      path: '/sales/advocate-reports',
      requiredPermission: 'Advocate Reports',
      requiredAction: 'read'
    },
    'Expert Reports': {
      label: 'Expert Reports',
      path: '/sales/expert-reports',
      requiredPermission: 'Expert Reports',
      requiredAction: 'read'
    },
    'Expense Reports': {
      label: 'Expense Reports',
      path: '/sales/expense-reports',
      requiredPermission: 'Expense Reports',
      requiredAction: 'read'
    },
    'Case Wise Reports': {
      label: 'Case Wise Reports',
      path: '/sales/case-wise-reports',
      requiredPermission: 'Case Wise Reports',
      requiredAction: 'read'
    },
    'Dr. DOB Reports': {
      label: 'Dr. DOB Reports',
      path: '/sales/dr-dob-reports',
      requiredPermission: 'Dr. DOB Reports',
      requiredAction: 'read'
    },
    'Statement of Account': {
      label: 'Statement of Account',
      path: '/sales/account-statement-reports',
      requiredPermission: 'Statement of Account',
      requiredAction: 'read'
    },
    'Add Insurance Company': {
      label: 'Add Insurance Company',
      path: '/sales/add-insurance-company',
      requiredPermission: 'Add Insurance Company',
      requiredAction: 'write'
    },
    'Add Insurance Type': {
      label: 'Add Insurance Type',
      path: '/sales/add-insurance-type',
      requiredPermission: 'Add Insurance Type',
      requiredAction: 'write'
    },
    'Add User': {
      label: 'Add User',
      path: '/sales/user',
      requiredPermission: 'Add User',
      requiredAction: 'write'
    },
    'All Users': {
      label: 'All Users',
      path: '/sales/all-users',
      requiredPermission: 'All Users',
      requiredAction: 'read'
    },
    'User Management': {
      label: 'User Management',
      path: '/sales/user-management',
      requiredPermission: 'User Management',
      requiredAction: 'read'
    },
    'View Doctor': {
      label: 'View Doctor',
      path: '/sales/all-doctors',
      requiredPermission: 'Total Doctor List',
      requiredAction: 'read'
    },
    'Attendance Record': {
      label: 'Attendance Record',
      path: '/sales/attendance-record',
      requiredPermission: 'Attendance Record',
      requiredAction: 'read'
    },
    'Salary Management': {
      label: 'Salary Management',
      path: '/sales/salary-management',
      requiredPermission: 'Salary Management',
      requiredAction: 'read'
    },
    'Create Quotation': {
      label: 'Create Quotation',
      path: '/sales/create-quotation',
      requiredPermission: 'Create Quotation',
      requiredAction: 'write'
    },
    'Add Salesbill': {
      label: 'Add Salesbill',
      path: '/sales/add-salesbill',
      requiredPermission: 'Add Salesbill',
      requiredAction: 'write'
    },
    'Create Receipt': {
      label: 'Create Receipt',
      path: '/sales/create-receipt',
      requiredPermission: 'Create Receipt',
      requiredAction: 'write'
    },
    'Accept Doctor': {
      label: 'Accept Doctor',
      path: '/sales/accept-doctor',
      requiredPermission: 'Accept Doctor',
      requiredAction: 'write'
    },
    'Doctor Follow-ups': {
      label: 'Doctor Follow-ups',
      path: '/sales/dr-followups',
      requiredPermission: 'Doctor Follow-ups',
      requiredAction: 'read'
    },
    'Send Message': {
      label: 'Send Message',
      path: '/sales/send-message',
      requiredPermission: 'Send Message',
      requiredAction: 'write'
    },
    'Employee List': {
      label: 'Employee List',
      path: '/sales/employee-list',
      requiredPermission: 'Employee List',
      requiredAction: 'read'
    },
    'Salesperson List': {
      label: 'Salesperson List',
      path: '/sales/salesperson-list',
      requiredPermission: 'Salesperson List',
      requiredAction: 'read'
    },
    'Telecaller List': {
      label: 'Telecaller List',
      path: '/sales/telecaller-list',
      requiredPermission: 'Telecaller List',
      requiredAction: 'read'
    },
    // Add more mappings as needed
  };

  // Generate navigation items dynamically from user permissions
  const dynamicNavItems = useMemo(() => {
    if (!user?.permissions || user.permissions.length === 0) {
      return [];
    }

    const navItems = [];
    const processedPermissions = new Set();

    user.permissions.forEach(permission => {
      const permissionName = permission.formName;

      // Skip if already processed or doesn't have required access
      if (processedPermissions.has(permissionName)) {
        return;
      }

      // Check if this permission has read access (or full access)
      const hasReadAccess = permission.read || permission.full;

      if (hasReadAccess) {
        const navConfig = permissionMapping[permissionName];

        if (navConfig) {
          // Add the navigation item
          navItems.push({
            label: navConfig.label,
            path: navConfig.path,
            requiredPermission: navConfig.requiredPermission,
            requiredAction: navConfig.requiredAction,
            subMenu: navConfig.subMenu || undefined
          });
          processedPermissions.add(permissionName);
        }
        // Note: We've removed the generic route generation to prevent 404 errors
        // Only permissions with explicit mapping will appear in navigation
      }
    });

    return navItems;
  }, [user]);

  return dynamicNavItems;
};

export default SalesNav;