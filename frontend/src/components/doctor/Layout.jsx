// src/components/doctor/Layout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  HomeIcon, UserIcon, CalendarIcon, 
  DocumentTextIcon, UserGroupIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function DoctorLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: HomeIcon },
    { name: 'My Profile', href: '/doctor/profile', icon: UserIcon },
    { name: 'Appointments', href: '/doctor/appointments', icon: CalendarIcon },
    { name: 'Prescriptions', href: '/doctor/prescriptions', icon: DocumentTextIcon },
    { name: 'My Patients', href: '/doctor/patients', icon: UserGroupIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile menu button */}
      {/* <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-teal-600 hover:text-teal-800 hover:bg-teal-50 transition-all duration-200"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div> */}
            <div className=" fixed top-4 left-4 z-50">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md bg-white shadow-md text-teal-600 hover:text-teal-800 hover:bg-teal-50"
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
          <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-teal-500">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white ml-18">MediDoc</h1>
            </div>
            {user && (
             <div className="mt-6 flex items-center space-x-3">
              
                <div className="relative">
                  <img
                    src={user?.profile_pic_url || 'https://img.icons8.com/fluency/96/doctor-male.png'}
                    alt="Profile"
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Dr. {user.user?.first_name || 'User'}
                  </p>
                  {/* <p className="text-xs text-teal-100">{user.user?.email}</p> */}
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
                    ? 'bg-teal-100 text-teal-600 shadow-inner'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-teal-600'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive(item.href) ? 'text-teal-500' : 'text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
                {isActive(item.href) && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-teal-500"></span>
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

export default DoctorLayout;