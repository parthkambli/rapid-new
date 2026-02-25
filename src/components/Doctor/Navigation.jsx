import { useMemo } from 'react';
import { usePermissions } from '../../hooks/usePermissions';

const DoctorNav = () => {
  const { canRead, hasFullAccess, user } = usePermissions();

  // Define navigation items for doctor panel
  const allNavItems = [
    {
      label: 'Dashboard',
      path: '/doctor/dashboard',
      requiredPermission: 'Dashboard',
      requiredAction: 'read'
    },
    {
      label: 'My Profile',
      path: '/doctor/profile',
      requiredPermission: 'My Profile',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Membership Details',
          path: '/doctor/profile/personal',
          requiredPermission: 'Personal Details',
          requiredAction: 'read'
        }
      ]
    },
    {
      label: 'Policy History',
      path: '/doctor/policies',
      requiredPermission: 'Policy History',
      requiredAction: 'read'
    },
    {
      label: 'Case List',
      path: '/doctor/cases',
      requiredPermission: 'Case List',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Case History',
          path: '/doctor/cases/history',
          requiredPermission: 'Case History',
          requiredAction: 'read'
        }
      ]
    },
    {
      label: 'Receipt & Bills',
      path: '/doctor/payments',
      requiredPermission: 'Payments',
      requiredAction: 'read'
    },
    {
      label: 'Documents',
      path: '/doctor/documents',
      requiredPermission: 'Documents',
      requiredAction: 'read'
    }
  ];

  // Filter navigation items based on user permissions
  const filteredNavItems = useMemo(() => {
    return allNavItems.filter(item => {
      // Check if user has permission for this item
      const hasPermission = canRead(item.requiredPermission);
      if (!hasPermission) return false;

      // Filter subMenu items if they exist
      if (item.subMenu) {
        item.subMenu = item.subMenu.filter(subItem => canRead(subItem.requiredPermission));
        // Keep parent item even if all sub-items are filtered out, but only if parent is accessible
        return item.subMenu.length > 0 || hasPermission;
      }

      return true;
    });
  }, [allNavItems, canRead]);

  return filteredNavItems;
};

export default DoctorNav;
