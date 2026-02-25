// const SuperAdminNav = [
// { label: 'Dashboard', path: '/Superadmin/dashboard', },
//   {
//     label: 'Employee',
//     path: '/admin/employee-list',

//     subMenu: [
//       { label: 'Employee list', path: '/Superadmin/employee-list' },
//       { label: 'Attendance Record ', path: '/Superadmin/attendance-record' },
//       { label: 'Salary Management', path: '/Superadmin/salary-management' },

//     ],
//   },
//     { label: 'Salesperson', path: '/Superadmin/employee/salesperson' },
//       { label: 'Telle caller', path: '/Superadmin/employee/Tellecaller' },
//   { label: 'Total Doctor List', path: '/Superadmin/doctor-list',
// subMenu: [
//         { label: 'Add Doctor Form', path: '/Superadmin/add-doctor' },
//         { label: 'Total Doctor List', path: '/Superadmin/doctor-list' },
//       { label: 'Accept Doctor', path: '/Superadmin/accept-doctor' },
//    ,

// ]
//   },

//   { label: 'Quotation', path: '/Superadmin/quotation-list' },
//   { label: 'Sales Bill', path: '/Superadmin/salesbill/list' },
//   { label: 'Recipt list', path: '/Superadmin/receipt-list' },
//   { label: 'Policy', path: '/Superadmin/policy' },
//    {
//     label: 'Renewal Alert List',
//     path: '/Superadmin/service-alert-list',

//     subMenu: [
//       {label:'Service Renewal Alert  List' , path: '/Superadmin/service-alert-list'},
//       {label:'Indemnity Renewal Alert List ' , path: '/Superadmin/indemnity-alert-list'}
//     ]
//    },
//   // { label: 'User Management', path: '/sales/view/quotation-list'},
//   { label: 'Services Package List', path: '/Superadmin/service-package-list'},
//   { label: 'Queries or Case', path: '/Superadmin/queries' },
//   { label: 'User Management', path: '/Superadmin/user' },

//   { label: 'Advocate List', path: '/Superadmin/advocate-list' },
//   { label: 'Expert List', path: '/Superadmin/expert-list' },
//   { label: 'Expense', path: '/Superadmin/expense-list' },
//   { label: 'Reports', path: '/Superadmin/employee-reports' ,

//     subMenu:[
//       {label: 'Employee Reports' , path:'/Superadmin/employee-reports'},
//       {label: 'Doctor Report' , path:'/Superadmin/doctor-reports'},
//       {label: 'Policy Report' , path:'/Superadmin/policy-reports'},
//       {label: 'Advocate Report' , path:'/Superadmin/advocate-reports'},
//       {label: 'Expert Report' , path:'/Superadmin/expert-reports'},
//       {label: 'Expense Report' , path:'/Superadmin/expense-reports'},
//       {label: 'Case Wise Report' , path:'/Superadmin/case-wise-reports'},
//       {label: 'Dr. DOB Report' , path:'/Superadmin/dr-dob-reports'},
//       {label: 'Statement of Account' , path:'/Superadmin/account-statement-reports'},
//       {label: 'Master Report' , path:'/Superadmin/master-report'},
//     ]
//   },
// ];

// export default SuperAdminNav;





// import { useMemo } from 'react';
// import { usePermissions } from '../../hooks/usePermissions';

// const SuperAdminNav = () => {
//   const { hasPermission } = usePermissions();

//   // Define all super admin navigation items
//   const allNavItems = [
//     { label: 'Dashboard', path: '/Superadmin/dashboard' },
//     {
//       label: 'Employee',
//       path: '/Superadmin/employee-list',
//       subMenu: [
//         { label: 'Employee list', path: '/Superadmin/employee-list' },
//         { label: 'Attendance Record', path: '/Superadmin/attendance-record' },
//         { label: 'Salary Management', path: '/Superadmin/salary-management' },
//       ],
//     },
//     { label: 'Salesperson', path: '/Superadmin/employee/salesperson' },
//     { label: 'Telle caller', path: '/Superadmin/employee/Tellecaller' },
//     {
//       label: 'Total Doctor List',
//       path: '/Superadmin/doctor-list',
//       subMenu: [
//         { label: 'Add Doctor Form', path: '/Superadmin/add-doctor' },
//         { label: 'Total Doctor List', path: '/Superadmin/doctor-list' },
//         { label: 'Accept Doctor', path: '/Superadmin/accept-doctor' },
//       ]
//     },
//     { label: 'Quotation', path: '/Superadmin/quotation-list' },
//     { label: 'Sales Bill', path: '/Superadmin/salesbill/list' },
//     { label: 'Recipt list', path: '/Superadmin/receipt-list' },
//     { label: 'Policy', path: '/Superadmin/policy' },
//     {
//       label: 'Renewal Alert List',
//       path: '/Superadmin/service-alert-list',
//       subMenu: [
//         { label: 'Service Renewal Alert List', path: '/Superadmin/service-alert-list' },
//         { label: 'Indemnity Renewal Alert List', path: '/Superadmin/indemnity-alert-list' }
//       ]
//     },
//     { label: 'Services Package List', path: '/Superadmin/service-package-list' },
//     { label: 'Queries or Case', path: '/Superadmin/queries' },
//     { label: 'User Management', path: '/Superadmin/user' },
//     { label: 'Advocate List', path: '/Superadmin/advocate-list' },
//     { label: 'Expert List', path: '/Superadmin/expert-list' },
//     { label: 'Expense', path: '/Superadmin/expense-list' },
//     {
//       label: 'Reports',
//       path: '/Superadmin/employee-reports',
//       subMenu: [
//         { label: 'Employee Reports', path: '/Superadmin/employee-reports' },
//         { label: 'Doctor Report', path: '/Superadmin/doctor-reports' },
//         { label: 'Policy Report', path: '/Superadmin/policy-reports' },
//         { label: 'Advocate Report', path: '/Superadmin/advocate-reports' },
//         { label: 'Expert Report', path: '/Superadmin/expert-reports' },
//         { label: 'Expense Report', path: '/Superadmin/expense-reports' },
//         { label: 'Case Wise Report', path: '/Superadmin/case-wise-reports' },
//         { label: 'Dr. DOB Report', path: '/Superadmin/dr-dob-reports' },
//         { label: 'Statement of Account', path: '/Superadmin/account-statement-reports' },
//         { label: 'Master Report', path: '/Superadmin/master-report' },
//       ]
//     },
//   ];

//   // Super admin ke liye sab permissions allow karein, ya phir filter karein agar needed ho
//   const filteredNav = useMemo(() => {
//     // Super admin ke liye by default sab items show karein
//     // Agar specific permission check karna hai toh yahan add karein
//     return allNavItems.filter(item => {
//       // Yahan aap permission checks add kar sakte hain agar needed ho
//       return true; // Currently super admin ke liye sab allow hai
//     });
//   }, [hasPermission]);

//   return filteredNav;
// };

// export default SuperAdminNav;







import { useMemo } from 'react';

const SuperAdminNav = () => {
  // Super admin ke liye sab navigation items - koi filtering nahi
  const superAdminNavItems = useMemo(() => [
    {
      label: 'Dashboard',
      path: '/superadmin/dashboard'
    },
    {
      label: 'Employee Management',
      path: '/superadmin/employee-list',
      subMenu: [
        { label: 'Employee List', path: '/superadmin/employee-list' },
        { label: 'Add Employee', path: '/superadmin/employee/add' },
        { label: 'Salesperson List', path: '/superadmin/employee/salesperson' },
        { label: 'Telecaller List', path: '/superadmin/employee/telecaller' },
        { label: 'Attendance Record', path: '/superadmin/attendance-record' },
        { label: 'Salary Management', path: '/superadmin/salary-management' },
      ],
    },
    {
      label: 'Doctor Management',
      path: '/superadmin/doctor-list',
      subMenu: [
        { label: 'Total Doctor List', path: '/superadmin/doctor-list' },
        { label: 'Add Doctor', path: '/superadmin/add-doctor' },
        { label: 'Accept Doctor', path: '/superadmin/accept-doctor' },
        { label: 'Doctor Follow-ups', path: '/Superadmin/dr-followups' },
      ],
    },
    {
      label: 'Quotation List',
      path: '/superadmin/quotation-list'
    },
    {
      label: 'Sales Bill List',
      path: '/superadmin/salesbill/list'
    },
    {
      label: 'Receipt List',
      path: '/superadmin/receipt-list'
    },
    {
      label: 'Policy Management',
      path: '/superadmin/policy',
      subMenu: [
        { label: 'Policy List', path: '/superadmin/policy' },
        { label: 'Add Policy', path: '/superadmin/add-policy' },
        { label: 'Insurance Companies', path: '/superadmin/insurance-companies' },
        { label: 'Insurance Types', path: '/superadmin/insurance-types' },
      ],
    },
    {
      label: 'Renewal Alert List',
      path: '/superadmin/service-alert-list',
      subMenu: [
        { label: 'Service Renewal Alert List', path: '/superadmin/service-alert-list' },
        { label: 'Indemnity Renewal Alert List', path: '/superadmin/indemnity-alert-list' },
      ],
    },
    {
      label: 'Services Package List',
      path: '/superadmin/services-package',
      subMenu: [
        { label: 'Services Package List', path: '/superadmin/services-package' },
        { label: 'Create Service Package', path: '/superadmin/create-service-package' },
      ],
    },
    {
      label: 'Queries or Case',
      path: '/superadmin/queries',
      subMenu: [
        { label: 'Queries or Case', path: '/superadmin/queries' },
        { label: 'Create Query Case', path: '/superadmin/create-query-case' },
      ],
    },
    {
      label: 'User Management',
      path: '/superadmin/all-users',
      subMenu: [
        { label: 'All Users', path: '/superadmin/all-users' },
        { label: 'Add User', path: '/superadmin/add-user' },
        // { label: 'Role Management', path: '/superadmin/role-management' },
        // { label: 'Permission Management', path: '/superadmin/permission-management' },
      ],
    },
    {
      label: 'Advocate List',
      path: '/superadmin/advocate-list',
      subMenu: [
        { label: 'Advocate List', path: '/superadmin/advocate-list' },
        { label: 'Create Advocate', path: '/superadmin/create-advocate' },
      ],
    },
    {
      label: 'Expert List',
      path: '/superadmin/expert-list',
      subMenu: [
        { label: 'Expert List', path: '/superadmin/expert-list' },
        { label: 'Create Expert', path: '/superadmin/create-expert' },
      ],
    },
    {
      label: 'Expense List',
      path: '/superadmin/expense-list'
    },
    {
      label: 'Reports',
      path: '/superadmin/reports',
      subMenu: [
        { label: 'Employee Reports', path: '/superadmin/employee-reports' },
        { label: 'Doctor Reports', path: '/superadmin/doctor-reports' },
        { label: 'Policy Reports', path: '/superadmin/policy-reports' },
        { label: 'Advocate Reports', path: '/superadmin/advocate-reports' },
        { label: 'Expert Reports', path: '/superadmin/expert-reports' },
        { label: 'Expense Reports', path: '/superadmin/expense-reports' },
        { label: 'Case Wise Reports', path: '/superadmin/case-wise-reports' },
        { label: 'Dr. DOB Reports', path: '/superadmin/dr-dob-reports' },
        { label: 'Statement of Account', path: '/superadmin/account-statement-reports' },
        // { label: 'Master Report', path: '/superadmin/master-report' },
        { label: 'System Audit Logs', path: '/superadmin/audit-logs' },
      ],
    },
     {
      label: 'Master Report',
      path: '/superadmin/master-report'
    },
    {
      label: 'System Settings',
      path: '/superadmin/system-settings',
      subMenu: [
        { label: 'General Settings', path: '/superadmin/general-settings' },
        { label: 'Email Templates', path: '/superadmin/email-templates' },
        { label: 'SMS Settings', path: '/superadmin/sms-settings' },
        { label: 'Backup & Restore', path: '/superadmin/backup-restore' },
      ],
    },
    {
      label: 'API Test',
      path: '/superadmin/api-test'
    },
  ], []);

  return superAdminNavItems;
};

export default SuperAdminNav;