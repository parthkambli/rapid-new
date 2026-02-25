import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  loginUser,
  logout,
  fetchCurrentUser,
  refreshPermissions,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectLoading,
  selectError,
  selectPermissions,
  selectUserRole,
  selectPermissionsLoading,
} from '../store/authSlice';

/**
 * Custom hook for authentication and user management using Redux
 * Replaces the old Context API approach
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Selectors
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const permissions = useSelector(selectPermissions);
  const role = useSelector(selectUserRole);
  const permissionsLoading = useSelector(selectPermissionsLoading);


  // Actions
  const login = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    return result;
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const refreshUserData = async () => {
    await dispatch(fetchCurrentUser());
  };

  const refreshUserPermissions = async () => {
    await dispatch(refreshPermissions());
  };

  // Permission checking functions
  const hasPermission = (permissionCheck) => {
    if (!user) return false;

    if (!permissions || !Array.isArray(permissions)) {
      return false;
    }

    // Handle both object {formName, action} and string formName
    const formName = typeof permissionCheck === 'string' ? permissionCheck : permissionCheck.formName;
    const action = typeof permissionCheck === 'string' ? 'read' : (permissionCheck.action || 'read');

    const permission = permissions.find(p => p.formName === formName);
    if (!permission) return false;

    return permission.full || permission[action];
  };

  const hasAnyPermission = (permissionChecks) => {
    if (!Array.isArray(permissionChecks)) {
      return hasPermission(permissionChecks);
    }
    return permissionChecks.some(check => hasPermission(check));
  };

  const hasAllPermissions = (permissionChecks) => {
    if (!Array.isArray(permissionChecks)) {
      return hasPermission(permissionChecks);
    }
    return permissionChecks.every(check => hasPermission(check));
  };

  // Role checks
  const isAdmin = user?.role === 'admin';
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'superadmin';
  const isSales = user?.role === 'sales';
  const isTelecaller = user?.role === 'telecaller';

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,
    permissions,
    role,
    permissionsLoading,
    
    // Role checks
    isAdmin,
    isSuperAdmin,
    isSales,
    isTelecaller,
    
    // Actions
    login,
    logout: handleLogout,
    refreshUserData,
    refreshUserPermissions,
    
    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};

export default useAuth;

