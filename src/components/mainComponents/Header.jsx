import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../common/NotificationBell';

const Navbar = ({ toggleSidebar, onLogout, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleProfileClick = () => {
    const rolePath = user?.role?.toLowerCase() || 'profile';
    navigate(`/${rolePath}/profile`);
  };

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };

  return (
    <nav className="bg-[#E8EFEF] p-4 shadow-md h-16 md:h-20 w-full flex items-center fixed top-0 left-0 right-0 z-40">
      <div className="w-full px-4 md:px-6 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Logo */}
        <div className="text-xl font-bold md:ml-6">
          <span className="text-blue-600">RAP</span>ID
        </div>

        {/* Profile and Notification Section */}
        <div className="flex items-center space-x-4">
          {/* Profile Details */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleProfileClick}
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                className="focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      navigate('/change-password');
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notification Bell Component */}
          <NotificationBell user={user} />

        </div>
      </div>
    </nav>
  );
};

export default Navbar;