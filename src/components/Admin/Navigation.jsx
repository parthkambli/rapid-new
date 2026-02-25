import { useMemo } from 'react';
import { usePermissions } from '../../hooks/usePermissions';

const AdminNav = () => {
  const { canRead, hasFullAccess, isAdmin, user, hasPermission } = usePermissions();

  // Define all possible navigation items with their required permissions
  const allNavItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      requiredPermission: 'Dashboard',
      requiredAction: 'read'
    },
    {
      label: 'Employee Management',
      path: '/admin/employee-list',
      requiredPermission: 'Employee Management',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Employee List',
          path: '/admin/employee-list',
          requiredPermission: 'Employee List',
          requiredAction: 'read'
        },
        {
          label: 'Add Employee',
          path: '/admin/employee/add',
          requiredPermission: 'Add Employee',
          requiredAction: 'write'
        },
        {
          label: 'Salesperson List',
          path: '/admin/employee/salesperson',
          requiredPermission: 'Salesperson List',
          requiredAction: 'read'
        },
        {
          label: 'Telecaller List',
          path: '/admin/employee/Tellecaller',
          requiredPermission: 'Telecaller List',
          requiredAction: 'read'
        },
        {
          label: 'Attendance Record',
          path: '/admin/attendance-record',
          requiredPermission: 'Attendance Record',
          requiredAction: 'read'
        },
        {
          label: 'Salary Management',
          path: '/admin/salary-management',
          requiredPermission: 'Salary Management',
          requiredAction: 'read'
        },
      ],
    },
    {
      label: 'Doctor Management',
      path: '/admin/doctor-list',
      requiredPermission: 'Doctor Management',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Total Doctor List',
          path: '/admin/doctor-list',
          requiredPermission: 'Total Doctor List',
          requiredAction: 'read'
        },
        {
          label: 'Add Doctor',
          path: '/admin/add-doctor',
          requiredPermission: 'Add Doctor',
          requiredAction: 'read'
        },
        {
          label: 'Accept Doctor',
          path: '/admin/accept-doctor',
          requiredPermission: 'Accept Doctor',
          requiredAction: 'read'
        },
        {
          label: 'Doctor Follow-ups',
          path: '/admin/dr-followups',
          requiredPermission: 'Doctor Follow-ups',
          requiredAction: 'read'
        },
      ],
    },
    {
      label: 'Quotation List',
      path: '/admin/quotation-list',
      requiredPermission: 'Quotation List',
      requiredAction: 'read'
    },
    {
      label: 'Sales Bill List',
      path: '/admin/salesbill/list',
      requiredPermission: 'Sales Bill List',
      requiredAction: 'read'
    },
    {
      label: 'Receipt List',
      path: '/admin/receipt-list',
      requiredPermission: 'Receipt List',
      requiredAction: 'read'
    },
    {
      label: 'Policy Management',
      path: '/admin/policy',
      requiredPermission: 'Policy Management',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Policy List',
          path: '/admin/policy',
          requiredPermission: 'Policy List',
          requiredAction: 'read'
        },
        {
          label: 'Add Policy',
          path: '/admin/add-policy',
          requiredPermission: 'Add Policy',
          requiredAction: 'write'
        },
        {
          label: 'Insurance Companies',
          path: '/admin/insurance-companies-list',
          requiredPermission: 'Insurance Companies',
          requiredAction: 'read'
        },
        {
          label: 'Insurance Types',
          path: '/admin/insurance-type-list',
          requiredPermission: 'Insurance Types',
          requiredAction: 'read'
        },
      ],
    },
    {
      label: 'Renewal Alert List',
      path: '/admin/service-alert-list',
      requiredPermission: 'Renewal Alert List',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Service Renewal Alert List',
          path: '/admin/service-alert-list',
          requiredPermission: 'Service Renewal Alert List',
          requiredAction: 'read'
        },
        {
          label: 'Indemnity Renewal Alert List',
          path: '/admin/indemnity-alert-list',
          requiredPermission: 'Indemnity Renewal Alert List',
          requiredAction: 'read'
        },
      ],
    },
    {
      label: 'Services Package List',
      path: '/admin/services-package',
      requiredPermission: 'Services Package List',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Services Package List',
          path: '/admin/services-package',
          requiredPermission: 'Services Package List',
          requiredAction: 'read'
        },
        {
          label: 'Create Service Package',
          path: '/admin/create-service-package',
          requiredPermission: 'Create Service Package',
          requiredAction: 'write'
        },
      ],
    },
    {
      label: 'Queries Management',
      path: '/admin/queries',
      requiredPermission: 'Queries or Case',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Queries or Case Admin',
          path: '/admin/queries',
          requiredPermission: 'Queries or Case',
          requiredAction: 'read'
        },
        {
          label: 'Create Query Case Admin',
          path: '/admin/create-query-case',
          requiredPermission: 'Create Query Case',
          requiredAction: 'write'
        },
      ],
    },
    {
      label: 'User Management',
      path: '/admin/all-users',
      requiredPermission: 'User Management',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'All Users',
          path: '/admin/all-users',
          requiredPermission: 'All Users',
          requiredAction: 'read'
        },
        {
          label: 'Add User',
          path: '/admin/add-user',
          requiredPermission: 'Add User',
          requiredAction: 'write'
        },
      ],
    },
    {
      label: 'Advocate List',
      path: '/admin/advocate-list',
      requiredPermission: 'Advocate List',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Advocate List',
          path: '/admin/advocate-list',
          requiredPermission: 'Advocate List',
          requiredAction: 'read'
        },
        {
          label: 'Create Advocate',
          path: '/admin/create-advocate',
          requiredPermission: 'Advocate List',
          requiredAction: 'write'
        },
      ],
    },
    {
      label: 'Expert List',
      path: '/admin/expert-list',
      requiredPermission: 'Expert List',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Expert List',
          path: '/admin/expert-list',
          requiredPermission: 'Expert List',
          requiredAction: 'read'
        },
        {
          label: 'Create Expert List',
          path: '/admin/create-expert',
          requiredPermission: 'Expert List',
          requiredAction: 'write'
        },
      ],
    },
    {
      label: 'Expense List',
      path: '/admin/expense-list',
      requiredPermission: 'Expense List',
      requiredAction: 'read'
    },
    {
      label: 'Reports',
      path: '/admin/employee-reports',
      requiredPermission: 'Reports',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Employee Reports',
          path: '/admin/employee-reports',
          requiredPermission: 'Employee Reports',
          requiredAction: 'read'
        },
        {
          label: 'Doctor Reports',
          path: '/admin/doctor-reports',
          requiredPermission: 'Doctor Reports',
          requiredAction: 'read'
        },
        {
          label: 'Policy Reports',
          path: '/admin/policy-reports',
          requiredPermission: 'Policy Reports',
          requiredAction: 'read'
        },
        {
          label: 'Quotation Reports',
          path: '/admin/quotation-reports',
          requiredPermission: 'Quotation Reports',
          requiredAction: 'read'
        },
        {
          label: 'Sales Bill Reports',
          path: '/admin/sales-bill-reports',
          requiredPermission: 'Sales Bill Reports',
          requiredAction: 'read'
        },
        {
          label: 'Receipt Reports',
          path: '/admin/receipt-reports',
          requiredPermission: 'Receipt Reports',
          requiredAction: 'read'
        },
        {
          label: 'Attendance Reports',
          path: '/admin/attendance-reports',
          requiredPermission: 'Attendance Reports',
          requiredAction: 'read'
        },
        {
          label: 'Salary Reports',
          path: '/admin/salary-reports',
          requiredPermission: 'Salary Reports',
          requiredAction: 'read'
        },
        {
          label: 'Target Reports',
          path: '/admin/target-reports',
          requiredPermission: 'Target Reports',
          requiredAction: 'read'
        },
        {
          label: 'Task Reports',
          path: '/admin/task-reports',
          requiredPermission: 'Task Reports',
          requiredAction: 'read'
        },
        {
          label: 'Advocate Reports',
          path: '/admin/advocate-reports',
          requiredPermission: 'Advocate Reports',
          requiredAction: 'read'
        },
        {
          label: 'Expert Reports',
          path: '/admin/expert-reports',
          requiredPermission: 'Expert Reports',
          requiredAction: 'read'
        },
        {
          label: 'Expense Reports',
          path: '/admin/expense-reports',
          requiredPermission: 'Expense Reports',
          requiredAction: 'read'
        },
        {
          label: 'Case Wise Reports',
          path: '/admin/case-wise-reports',
          requiredPermission: 'Case Wise Reports',
          requiredAction: 'read'
        },
        {
          label: 'Dr. DOB Reports',
          path: '/admin/dr-dob-reports',
          requiredPermission: 'Dr. DOB Reports',
          requiredAction: 'read'
        },
        {
          label: 'Statement of Account',
          path: '/admin/account-statement-reports',
          requiredPermission: 'Statement of Account',
          requiredAction: 'read'
        },
        // {
        //   label: 'Master Report',
        //   path: '/admin/master-report',
        //   requiredPermission: 'Reports',
        //   requiredAction: 'read'
        // },
      ],
    },
    {
      label: 'API Test',
      path: '/admin/api-test',
      requiredPermission: 'API Test',
      requiredAction: 'read'
    }, // Always available for debugging
  ];

  // Filter navigation items based on user permissions
  const filteredNav = useMemo(() => {
    return allNavItems
      .map(item => {
        // API Test is always available for debugging
        if (item.label === 'API Test') return item;

        // If item has submenu, check children first
        if (item.subMenu) {
          // Filter submenu items based on their individual permissions
          const filteredSubMenu = item.subMenu.filter(subItem =>
            hasPermission({ formName: subItem.requiredPermission, action: subItem.requiredAction || 'read' })
          );

          // Only include main item if:
          // 1. User has access to parent menu, OR
          // 2. User has access to at least one child item
          const hasParentAccess = hasPermission({ formName: item.requiredPermission, action: item.requiredAction || 'read' });

          if (!hasParentAccess && filteredSubMenu.length === 0) {
            return null; // No access to parent and no accessible children
          }

          if (filteredSubMenu.length === 0 && !hasParentAccess) {
            return null; // No children and no parent access
          }

          return {
            ...item,
            subMenu: filteredSubMenu
          };
        }

        // For items without submenu, check direct permission
        const hasAccess = hasPermission({ formName: item.requiredPermission, action: item.requiredAction || 'read' });

        if (!hasAccess) return null;

        return item;
      })
      .filter(Boolean); // Remove null items
  }, [hasPermission, user?.permissions, user?.role]);

  return filteredNav;
};

export default AdminNav;