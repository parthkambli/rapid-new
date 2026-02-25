import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../services/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post(apiEndpoints.auth.login, {
        email,
        password
      });

      if (response.data.success) {
        const userData = response.data.user;
        const token = response.data.token;

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);

        // Update state
        setUser(userData);

        return { success: true, user: userData };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Network error during login';
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Permission checking function
  const hasPermission = (requiredPermission) => {
    if (!user) return false;

    // Check if user has the required permission
    if (!user.permissions || !Array.isArray(user.permissions)) {
      return false;
    }

    const permission = user.permissions.find(p => p.formName === requiredPermission.formName);
    if (!permission) return false;

    // Check specific action (read/write/edit/delete) or full access
    return permission.full || (requiredPermission.action && permission[requiredPermission.action]);
  };

  // Check if user has any of the required permissions (for OR logic)
  const hasAnyPermission = (permissions) => {
    if (!Array.isArray(permissions)) return hasPermission(permissions);
    return permissions.some(permission => hasPermission(permission));
  };

  // Check if user has all required permissions (for AND logic)
  const hasAllPermissions = (permissions) => {
    if (!Array.isArray(permissions)) return hasPermission(permissions);
    return permissions.every(permission => hasPermission(permission));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isSuperAdmin: user?.role === 'superadmin',
    isSales: user?.role === 'sales',
    isTelecaller: user?.role === 'telecaller',
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
