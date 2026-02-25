import { useMemo } from 'react';
import { usePermissions } from '../../hooks/usePermissions';

const AdvocateNav = () => {
  const { canRead, hasFullAccess, user } = usePermissions();

  // Define navigation items for advocate panel
  const allNavItems = [
    {
      label: 'Dashboard',
      path: '/advocate/dashboard',
      requiredPermission: 'Dashboard',
      requiredAction: 'read'
    },
    {
      label: 'My Assigned Cases',
      path: '/advocate/cases',
      requiredPermission: 'My Assigned Cases',
      requiredAction: 'read',
      subMenu: [
        {
          label: 'Update Follow-up',
          path: '/advocate/cases/followup',
          requiredPermission: 'Update Follow-up',
          requiredAction: 'write'
        },
        {
          label: 'View History',
          path: '/advocate/cases/history',
          requiredPermission: 'View History',
          requiredAction: 'read'
        },
        {
          label: 'Close Case',
          path: '/advocate/cases/close',
          requiredPermission: 'Close Case',
          requiredAction: 'write'
        }
      ]
    },
    {
      label: 'Reports',
      path: '/advocate/reports',
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

export default AdvocateNav;
