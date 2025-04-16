// src/components/Navbar.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { 
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { auth, logout } = useAuth();
//   const { auth, logoutUser } = useContext(AuthContext);
  return (
<nav className="bg-[#3f95bd] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-white flex items-center">
              <svg 
                className="h-8 w-8 mr-2" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
                />
              </svg>
              <span className="text-xl font-bold tracking-tight">MediCare+</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {auth ? (
              <>
                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-6 w-6 text-blue-100" />
                  <span className="text-white font-medium">
                    Welcome, {auth.username || 'User'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200"
                >
                  <UserPlusIcon className="h-5 w-5 mr-1" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;