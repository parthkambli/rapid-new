import { useMemo } from 'react';
import { usePermissions } from '../../hooks/usePermissions';

const ExpertNav = () => {
  const { canRead, hasFullAccess, user } = usePermissions();

  // Define navigation items for expert panel
  const allNavItems = [
    {
      label: 'Dashboard',
      path: '/expert/dashboard',
      requiredPermission: 'Assigned Cases', // Using 'Assigned Cases' as base permission for dashboard too
      requiredAction: 'read'
    },
    {
      label: 'My Assigned Cases',
      path: '/expert/cases',
      requiredPermission: 'Assigned Cases',
      requiredAction: 'read',
      // subMenu: [
      //   {
      //     label: 'Update Follow-up',
      //     path: '/expert/cases/followup', // These are legacy/placeholder paths in nav, actual action is via case detail
      //     requiredPermission: 'Assigned Cases', // Simplified permission model for now
      //     requiredAction: 'write'
      //   },
      //   // {
      //   //   label: 'View History',
      //   //   path: '/expert/cases/history',
      //   //   requiredPermission: 'Assigned Cases',
      //   //   requiredAction: 'read'
      //   // },
      //   {
      //     label: 'Close Case',
      //     path: '/expert/cases/close',
      //     requiredPermission: 'Assigned Cases',
      //     requiredAction: 'write'
      //   }
      // ]
    },
    {
      label: 'Reports',
      path: '/expert/reports',
      requiredPermission: 'Reports',
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
        item.subMenu = item.subMenu.filter(subItem => {
          // Check appropriate permission for sub-item action
          if (subItem.requiredAction === 'write') {
            return user?.permissions?.find(p => p.formName === subItem.requiredPermission)?.write;
          }
          return canRead(subItem.requiredPermission);
        });
        // Keep parent item even if all sub-items are filtered out, but only if parent is accessible
        return item.subMenu.length > 0 || hasPermission;
      }

      return true;
    });
  }, [allNavItems, canRead, user]);

  return filteredNavItems;
};

export default ExpertNav;
