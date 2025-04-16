// src/components/Layout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  HomeIcon, UserIcon, ClipboardDocumentIcon, 
  BanknotesIcon, UserGroupIcon, ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Profile', href: '/profile', icon: UserIcon },
    { name: 'Discharge Details', href: '/discharge', icon: ClipboardDocumentIcon },
    { name: 'Invoices', href: '/invoices', icon: BanknotesIcon },
    { name: 'Find Doctors', href: '/find-doctors', icon: UserGroupIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

          {/* Sidebar toggle button */}
      <div className=" fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon  className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white ml-8">PatientView</h1>
            </div>
            {user && (
              // <p className="mt-2 text-sm text-gray-600">
              //   Welcome, {user?.username ?? 'Patient'}
              // </p>
                // <p className="mt-2 text-sm text-gray-600">
                //   {/* Welcome, {user?.profile?.username|| user?.profile?.first_name || 'Patient'} */}
                //   Welcome, {user?.profile?.user?.first_name || 'Patient'}
                // </p>
              <div className="mt-6 flex items-center space-x-3 ml-8">
                <div className="relative">
                  <img
                    src={user?.profile?.profile_pic_url}
                    alt="None"
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user?.profile?.user?.first_name || 'Welcome back'}
                  </p>
                  {/* <p className="text-xs text-blue-100">{user?.profile?.user?.email}</p> */}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-600 shadow-inner'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive(item.href) ? 'text-blue-500' : 'text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
                {isActive(item.href) && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="px-4 py-6 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-6 md:p-8">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;