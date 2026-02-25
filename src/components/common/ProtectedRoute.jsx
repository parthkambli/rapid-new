import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ requiredPermissions, requiredRole, redirectTo = '/login' }) => {
  const { user, loading, hasAllPermissions } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Backward compatibility: if requiredRole is provided, use it
  if (requiredRole && user.role !== requiredRole) {
    const rolePath = user.role === 'superadmin' || user.role === 'super_admin' ? '/superadmin/dashboard' :
                    user.role === 'admin' ? '/admin/dashboard' :
                    user.role === 'sales' ? '/sales/dashboard' :
                    '/telecaller/dashboard';
    return <Navigate to={rolePath} replace />;
  }

  // New permission-based checking
  if (requiredPermissions) {
    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

    // Admin and superadmin have all permissions
    if (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'super_admin') {
      const hasAccess = hasAllPermissions(permissions);

      if (!hasAccess) {
        // Redirect to user's default dashboard based on their role
        const rolePath = user.role === 'admin' ? '/admin/dashboard' :
                        user.role === 'sales' || user.role === 'salesman' ? '/sales/dashboard' :
                        user.role === 'telecaller' ? '/telecaller/dashboard' :
                        user.role === 'superadmin' || user.role === 'super_admin' ? '/superadmin/dashboard' :
                        '/'; // fallback
        return <Navigate to={rolePath} replace />;
      }
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
