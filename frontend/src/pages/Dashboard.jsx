// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../axios-config';
import {
  UserCircleIcon,
  CalendarIcon,
  CheckCircleIcon, // Replacing StatusOnlineIcon
  UserGroupIcon,
  BuildingOffice2Icon,
  ClockIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  BanknotesIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('api/patient/profile/dashboard_overview/');
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-gray-600">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Error loading dashboard</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
        <div className="mt-2 md:mt-0 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      {dashboardData && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Personal Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <UserCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                  <UserCircleIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-sm font-semibold text-gray-900">{dashboardData.patient_name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Admission Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(dashboardData.admit_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {dashboardData.is_discharged ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Discharged
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Care Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2 text-blue-600" />
                Medical Care
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                  <UserGroupIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Primary Doctor</p>
                  <p className="text-sm font-semibold text-gray-900">{dashboardData.doctor_name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                  <BuildingOffice2Icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-sm font-semibold text-gray-900">{dashboardData.department}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                  <ClockIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Appointments</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {dashboardData.appointments_count} upcoming
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                  <DocumentTextIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Prescriptions</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {dashboardData.prescriptions_count} active
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-blue-600" />
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <a 
                href="/find-doctors" 
                className="group flex items-center p-3 -m-3 rounded-lg hover:bg-blue-50 transition-colors duration-150"
              >
                <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Find a Doctor</p>
                  <p className="text-xs text-gray-500">Schedule new appointments</p>
                </div>
              </a>
              
              <a 
                href="/invoices" 
                className="group flex items-center p-3 -m-3 rounded-lg hover:bg-blue-50 transition-colors duration-150"
              >
                <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                  <BanknotesIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">View Invoices</p>
                  <p className="text-xs text-gray-500">Check payment history</p>
                </div>
              </a>
              
              <a 
                href="/discharge" 
                className="group flex items-center p-3 -m-3 rounded-lg hover:bg-blue-50 transition-colors duration-150"
              >
                <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                  <DocumentTextIcon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Discharge Details</p>
                  <p className="text-xs text-gray-500">View medical summary</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;