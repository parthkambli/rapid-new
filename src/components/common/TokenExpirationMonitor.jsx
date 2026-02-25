import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Token Expiration Monitor Component
 * Monitors token expiration and automatically logs out the user when token expires
 */
const TokenExpirationMonitor = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for token expiration event dispatched from apiClient
    const handleTokenExpiration = () => {
      logout();
      navigate('/login');
    };

    window.addEventListener('tokenExpired', handleTokenExpiration);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpiration);
    };
  }, [logout, navigate]);

  // Periodically check if token exists in localStorage
  // If token is missing but user is still on protected routes, redirect to login
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Token is missing, force logout
        logout();
        navigate('/login');
      }
    };

    // Check token validity every 30 seconds
    const interval = setInterval(checkTokenValidity, 30000);

    // Initial check
    checkTokenValidity();

    return () => clearInterval(interval);
  }, [logout, navigate]);

  return <>{children}</>;
};

export default TokenExpirationMonitor;