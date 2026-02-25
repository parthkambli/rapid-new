import { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Using useAuth directly to access user from Redux state

const TeleNav = () => {
  const { user } = useAuth(); // Using useAuth to get user from Redux state

  // Define a mapping of permission names to their corresponding paths and structures
  const permissionMapping = {
    'Dashboard': {
      label: 'Dashboard',
      path: '/telecaller/dashboard',
      requiredPermission: 'Dashboard',
      requiredAction: 'read'
    },
    'Doctor Management': {
      label: 'Doctor Management',
      path: '/telecaller/doctor-management',
      requiredPermission: 'Doctor Management',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Total Doctor List',
          path: '/telecaller/all-doctors',
          requiredPermission: 'Total Doctor List',
          requiredAction: 'read'
        }
      ]
    },
    'Total Doctor List': {
      label: 'Total Doctor List',
      path: '/telecaller/all-doctors',
      requiredPermission: 'Total Doctor List',
      requiredAction: 'read'
    },
    'Add Doctor': {
      label: 'Add Doctor',
      path: '/telecaller/add-doctor',
      requiredPermission: 'Add Doctor',
      requiredAction: 'write'
    },

    'Calling List': {
      label: 'Calling List',
      path: '/telecaller/calling-list',
      requiredPermission: 'Calling List',
      requiredAction: 'write'
    },



    'Quotation List': {
      label: 'Quotation List',
      path: '/telecaller/quotation-list',
      requiredPermission: 'Quotation List',
      requiredAction: 'read'
    },


    'Task Assignment': {
      label: 'Other Task Assign',
      path: '/telecaller/other-task/assign',
      requiredPermission: 'Task Assignment',
      requiredAction: 'write',
    },

    'Task Report': {
      label: 'Task Report',
      path: '/telecaller/task-reports',
      requiredPermission: 'Task Report',
      requiredAction: 'read'
    },


    'Transfer Doctor': {
      label: 'Transfer Doctor',
      path: '/telecaller/transfer-doctor',
      requiredPermission: 'Transfer Doctor',
      requiredAction: 'write'
    },


    'User Management': {
      label: 'User Management',
      path: '/telecaller/user-management',
      requiredPermission: 'User Management',
      requiredAction: 'read'
    },
    'Employee Management': {
      label: 'Employee Management',
      path: '/telecaller/employee-management',
      requiredPermission: 'Employee Management',
      requiredAction: 'read'
    },
    'Add Employee': {
      label: 'Add Employee',
      path: '/telecaller/add-employee',
      requiredPermission: 'Add Employee',
      requiredAction: 'write'
    },
    'Employee List': {
      label: 'Employee List',
      path: '/telecaller/employee-list',
      requiredPermission: 'Employee List',
      requiredAction: 'read'
    },
    'Salesperson List': {
      label: 'Salesperson List',
      path: '/telecaller/salesperson-list',
      requiredPermission: 'Salesperson List',
      requiredAction: 'read'
    },
    'Telecaller List': {
      label: 'Telecaller List',
      path: '/telecaller/telecaller-list',
      requiredPermission: 'Telecaller List',
      requiredAction: 'read'
    },
    // Add more mappings for other permissions
    'Policy Management': {
      label: 'Policy Management',
      path: '/telecaller/policy-list',
      requiredPermission: 'Policy Management',
      requiredAction: 'read'
    },
    'Policy List': {
      label: 'Policy List',
      path: '/telecaller/policy-list',
      requiredPermission: 'Policy List',
      requiredAction: 'read'
    },
    'Add Policy': {
      label: 'Add Policy',
      path: '/telecaller/add-policy',
      requiredPermission: 'Add Policy',
      requiredAction: 'write'
    },
    'Insurance Companies': {
      label: 'Insurance Companies',
      path: '/telecaller/insurance-companies-list',
      requiredPermission: 'Insurance Companies',
      requiredAction: 'read'
    },
    'Insurance Types': {
      label: 'Insurance Types',
      path: '/telecaller/insurance-types',
      requiredPermission: 'Insurance Types',
      requiredAction: 'read'
    },
    'Renewal Alert List': {
      label: 'Renewal Alert List',
      path: '/telecaller/renewal-alert-list',
      requiredPermission: 'Renewal Alert List',
      requiredAction: 'read'
    },
    'Service Renewal Alert List': {
      label: 'Service Renewal Alert List',
      path: '/telecaller/service-renewal-alert-list',
      requiredPermission: 'Service Renewal Alert List',
      requiredAction: 'read'
    },
    'Indemnity Renewal Alert List': {
      label: 'Indemnity Renewal Alert List',
      path: '/telecaller/indemnity-renewal-alert-list',
      requiredPermission: 'Indemnity Renewal Alert List',
      requiredAction: 'read'
    },
    'Services Package List': {
      label: 'Services Package List',
      path: '/telecaller/service-package-list',
      requiredPermission: 'Services Package List',
      requiredAction: 'read'
    },
    'Create Service Package': {
      label: 'Create Service Package',
      path: '/telecaller/create-service-package',
      requiredPermission: 'Create Service Package',
      requiredAction: 'write'
    },
    'Queries or Case': {
      label: 'Queries or Case',
      path: '/telecaller/queries-or-case',
      requiredPermission: 'Queries or Case',
      requiredAction: 'read'
    },
    'Create Query Case': {
      label: 'Create Query Case',
      path: '/telecaller/create-query-case',
      requiredPermission: 'Create Query Case',
      requiredAction: 'write'
    },
    'Advocate List': {
      label: 'Advocate List',
      path: '/telecaller/advocate-list',
      requiredPermission: 'Advocate List',
      requiredAction: 'read'
    },
    'Create Advocate': {
      label: 'Create Advocate',
      path: '/telecaller/create-advocate',
      requiredPermission: 'Advocate List',
      requiredAction: 'write'
    },
    'Expert List': {
      label: 'Expert List',
      path: '/telecaller/expert-list',
      requiredPermission: 'Expert List',
      requiredAction: 'read'
    },
    'Create Expert List': {
      label: 'Create Expert List',
      path: '/telecaller/create-expert-list',
      requiredPermission: 'Expert List',
      requiredAction: 'write'
    },
    'Expense List': {
      label: 'Expense List',
      path: '/telecaller/expense-list',
      requiredPermission: 'Expense List',
      requiredAction: 'read'
    },
    'Reports': {
      label: 'Reports',
      path: '/telecaller/reports',
      requiredPermission: 'Reports',
      requiredAction: 'read'
    },






    // 'Reports': {
    //     label: 'Task Reports',
    //     path: '/telecaller/task-reports',
    //     requiredPermission: 'Reports',
    //     requiredAction: 'read'
    //   },





    'Create Expert Bill': {
      label: 'Create Expert Bill',
      path: '/telecaller/create-expert-bill',
      requiredPermission: 'Create Expert Bill',
      requiredAction: 'write'
    },
    'Create Advocate Bill': {
      label: 'Create Advocate Bill',
      path: '/telecaller/create-advocate-bill',
      requiredPermission: 'Create Advocate Bill',
      requiredAction: 'write'
    },
    'Create Advocate': {
      label: 'Create Advocate',
      path: '/telecaller/create-advocate',
      requiredPermission: 'Create Advocate',
      requiredAction: 'write'
    },
    'Create Expense': {
      label: 'Create Expense',
      path: '/telecaller/create-expense',
      requiredPermission: 'Create Expense',
      requiredAction: 'write'
    },
    'Employee Reports': {
      label: 'Employee Reports',
      path: '/telecaller/employee-reports',
      requiredPermission: 'Employee Reports',
      requiredAction: 'read'
    },
    'Doctor Reports': {
      label: 'Doctor Reports',
      path: '/telecaller/doctor-reports',
      requiredPermission: 'Doctor Reports',
      requiredAction: 'read'
    },
    'Policy Reports': {
      label: 'Policy Reports',
      path: '/telecaller/policy-reports',
      requiredPermission: 'Policy Reports',
      requiredAction: 'read'
    },
    'Advocate Reports': {
      label: 'Advocate Reports',
      path: '/telecaller/advocate-reports',
      requiredPermission: 'Advocate Reports',
      requiredAction: 'read'
    },
    'Expert Reports': {
      label: 'Expert Reports',
      path: '/telecaller/expert-reports',
      requiredPermission: 'Expert Reports',
      requiredAction: 'read'
    },
    'Expense Reports': {
      label: 'Expense Reports',
      path: '/telecaller/expense-reports',
      requiredPermission: 'Expense Reports',
      requiredAction: 'read'
    },
    'Case Wise Reports': {
      label: 'Case Wise Reports',
      path: '/telecaller/case-wise-reports',
      requiredPermission: 'Case Wise Reports',
      requiredAction: 'read'
    },
    'Dr. DOB Reports': {
      label: 'Dr. DOB Reports',
      path: '/telecaller/dr-dob-reports',
      requiredPermission: 'Dr. DOB Reports',
      requiredAction: 'read'
    },
    'Statement of Account': {
      label: 'Statement of Account',
      path: '/telecaller/account-statement-reports',
      requiredPermission: 'Statement of Account',
      requiredAction: 'read'
    },
    'Add Insurance Company': {
      label: 'Add Insurance Company',
      path: '/telecaller/add-insurance-company',
      requiredPermission: 'Add Insurance Company',
      requiredAction: 'write'
    },
    'Add Insurance Type': {
      label: 'Add Insurance Type',
      path: '/telecaller/add-insurance-type',
      requiredPermission: 'Add Insurance Type',
      requiredAction: 'write'
    },
    'Add User': {
      label: 'Add User',
      path: '/telecaller/user',
      requiredPermission: 'Add User',
      requiredAction: 'write'
    },
    'All Users': {
      label: 'All Users',
      path: '/telecaller/all-users',
      requiredPermission: 'All Users',
      requiredAction: 'read'
    },
    'User Management': {
      label: 'User Management',
      path: '/telecaller/user-management',
      requiredPermission: 'User Management',
      requiredAction: 'read'
    },
    'View Doctor': {
      label: 'View Doctor',
      path: '/telecaller/all-doctors',
      requiredPermission: 'Total Doctor List',
      requiredAction: 'read'
    },
    'Attendance Record': {
      label: 'Attendance Record',
      path: '/telecaller/attendance-record',
      requiredPermission: 'Attendance Record',
      requiredAction: 'read'
    },
    'Salary Management': {
      label: 'Salary Management',
      path: '/telecaller/salary-management',
      requiredPermission: 'Salary Management',
      requiredAction: 'read'
    },
    'Create Quotation': {
      label: 'Create Quotation',
      path: '/telecaller/create-quotation',
      requiredPermission: 'Quotation List',
      requiredAction: 'write'
    },
    'Add Salesbill': {
      label: 'Add Salesbill',
      path: '/telecaller/add-salesbill',
      requiredPermission: 'Sales Bill List',
      requiredAction: 'write'
    },
    'Create Receipt': {
      label: 'Create Receipt',
      path: '/telecaller/create-receipt',
      requiredPermission: 'Receipt List',
      requiredAction: 'write'
    },
    'Accept Doctor': {
      label: 'Accept Doctor',
      path: '/telecaller/accept-doctor',
      requiredPermission: 'Accept Doctor',
      requiredAction: 'write'
    },
    'Doctor Follow-ups': {
      label: 'Doctor Follow-ups',
      path: '/telecaller/doctor-follow-ups',
      requiredPermission: 'Doctor Follow-ups',
      requiredAction: 'read'
    },
    'Send Message': {
      label: 'Send Message',
      path: '/telecaller/send-message',
      requiredPermission: 'Send Message',
      requiredAction: 'write'
    },
    'Employee List': {
      label: 'Employee List',
      path: '/telecaller/employee-list',
      requiredPermission: 'Employee List',
      requiredAction: 'read'
    },
    'Salesperson List': {
      label: 'Salesperson List',
      path: '/telecaller/salesperson-list',
      requiredPermission: 'Salesperson List',
      requiredAction: 'read'
    },
    'Telecaller List': {
      label: 'Telecaller List',
      path: '/telecaller/telecaller-list',
      requiredPermission: 'Telecaller List',
      requiredAction: 'read'
    },
    'All Users': {
      label: 'All Users',
      path: '/telecaller/all-users',
      requiredPermission: 'All Users',
      requiredAction: 'read'
    },
    'Quotation List': {
      label: 'Quotation List',
      path: '/telecaller/quotation-list',
      requiredPermission: 'Quotation List',
      requiredAction: 'read'
    },
    'Sales Bill List': {
      label: 'Sales Bill List',
      path: '/telecaller/salesbill/list',
      requiredPermission: 'Sales Bill List',
      requiredAction: 'read'
    },
    'Receipt List': {
      label: 'Receipt List',
      path: '/telecaller/receipt-list',
      requiredPermission: 'Receipt List',
      requiredAction: 'read'
    },
    'Policy Management': {
      label: 'Policy Management',
      path: '/telecaller/policy',
      requiredPermission: 'Policy Management',
      requiredAction: 'read'
    },
    'Policy List': {
      label: 'Policy List',
      path: '/telecaller/policy',
      requiredPermission: 'Policy List',
      requiredAction: 'read'
    },
    'Policy History': {
      label: 'Policy History',
      path: '/telecaller/policy-history/:policyNo',
      requiredPermission: 'Policy History',
      requiredAction: 'read'
    },
    'Add Policy': {
      label: 'Add Policy',
      path: '/telecaller/add-policy',
      requiredPermission: 'Add Policy',
      requiredAction: 'write'
    },
    'Edit Policy': {
      label: 'Edit Policy',
      path: '/telecaller/edit-policy/:id',
      requiredPermission: 'Add Policy',
      requiredAction: 'edit'
    },
    'Renew Policy': {
      label: 'Renew Policy',
      path: '/telecaller/renew-policy/:id',
      requiredPermission: 'Add Policy',
      requiredAction: 'write'
    },
    'Insurance Companies': {
      label: 'Insurance Companies',
      path: '/telecaller/insurance-companies-list',
      requiredPermission: 'Insurance Companies',
      requiredAction: 'read'
    },
    'Add Insurance Company': {
      label: 'Add Insurance Company',
      path: '/telecaller/add-insurance-company',
      requiredPermission: 'Add Insurance Company',
      requiredAction: 'write'
    },
    'Insurance Types': {
      label: 'Insurance Types',
      path: '/telecaller/insurance-type-list',
      requiredPermission: 'Insurance Types',
      requiredAction: 'read'
    },
    'Add Insurance Type': {
      label: 'Add Insurance Type',
      path: '/telecaller/add-insurance-type',
      requiredPermission: 'Add Insurance Type',
      requiredAction: 'write'
    },
    'Services Package List': {
      label: 'Services Package List',
      path: '/telecaller/service-package-list',
      requiredPermission: 'Services Package List',
      requiredAction: 'read'
    },
    'Create Service Package': {
      label: 'Create Service Package',
      path: '/telecaller/create-service-package',
      requiredPermission: 'Create Service Package',
      requiredAction: 'write'
    },
    'Queries or Case': {
      label: 'Queries or Case',
      path: '/telecaller/queries',
      requiredPermission: 'Queries or Case',
      requiredAction: 'read'
    },
    'Advocate List': {
      label: 'Advocate List',
      path: '/telecaller/advocate-list',
      requiredPermission: 'Advocate List',
      requiredAction: 'read'
    },
    'Create Advocate': {
      label: 'Create Advocate',
      path: '/telecaller/create-advocate',
      requiredPermission: 'Create Advocate',
      requiredAction: 'write'
    },
    'Expert List': {
      label: 'Expert List',
      path: '/telecaller/expert-list',
      requiredPermission: 'Expert List',
      requiredAction: 'read'
    },
    'Create Expert List': {
      label: 'Create Expert List',
      path: '/telecaller/create-expert-list',
      requiredPermission: 'Create Expert List',
      requiredAction: 'write'
    },
    'Expense List': {
      label: 'Expense List',
      path: '/telecaller/expense-list',
      requiredPermission: 'Expense List',
      requiredAction: 'read'
    },
    'Total Doctor List': {
      label: 'Total Doctor List',
      path: '/telecaller/doctor-list',
      requiredPermission: 'Total Doctor List',
      requiredAction: 'read'
    },
    'API Test': {
      label: 'API Test',
      path: '/telecaller/api-test',
      requiredPermission: 'API Test',
      requiredAction: 'read'
    },
    'Master Report': {
      label: 'Master Report',
      path: '/telecaller/master-report',
      requiredPermission: 'Reports',
      requiredAction: 'read'
    },
    // Add more mappings as needed
  };

  // Generate navigation items dynamically from user permissions (from login response)
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

export default TeleNav;