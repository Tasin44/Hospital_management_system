// src/pages/doctor/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../axios-config';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  XCircleIcon,
  ClockIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

function Dashboard() {
  const [stats, setStats] = useState({
    assigned_patients: 0,
    appointments: 0,
    discharged_patients: 0
  });
  
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch doctor stats
        const statsResponse = await api.get('/api/doctor/profile/dashboard_stats/');
        setStats(statsResponse.data);
        
        // Fetch upcoming appointments
        const appointmentsResponse = await api.get('/api/doctor/appointments/doctor_appointments/');
        // Filter for upcoming appointments only and sort by date
        const upcoming = appointmentsResponse.data
          .filter(app => !app.is_completed && new Date(app.appointment_date) >= new Date())
          .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
          .slice(0, 5); // Get only the next 5 appointments
          
        setUpcomingAppointments(upcoming);
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
          <ArrowPathIcon className="h-12 w-12 animate-spin text-teal-500 mb-4" />
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-500" />
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
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <UserCircleIcon className="h-8 w-8 text-teal-500 mr-2" />
        Doctor Dashboard
      </h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Assigned Patients Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-teal-100 text-teal-600 mr-4">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Assigned Patients</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.assigned_patients}</p>
            </div>
          </div>
          {/* <div className="mt-4 flex items-center text-sm text-teal-600">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            <span>View all patients</span>
          </div> */}
        </div>
        
        {/* Total Appointments Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Appointments</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.appointments}</p>
            </div>
          </div>
          {/* <div className="mt-4 flex items-center text-sm text-blue-600">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            <span>View calendar</span>
          </div> */}
        </div>
        
        {/* Discharged Patients Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
              <ClipboardDocumentCheckIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Discharged Patients</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.discharged_patients}</p>
            </div>
          </div>
          {/* <div className="mt-4 flex items-center text-sm text-purple-600">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            <span>View records</span>
          </div> */}
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <ClockIcon className="h-5 w-5 text-teal-500 mr-2" />
            Upcoming Appointments
          </h2>
          <Link 
            to="/doctor/appointments" 
            className="text-sm font-medium text-teal-600 hover:text-teal-500 flex items-center"
          >
            View all
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="divide-y divide-gray-200">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900 flex items-center">
                      <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                      {appointment.patient_name || 'Patient #' + appointment.patient}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                      <span className="mx-1">•</span>
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {new Date(appointment.appointment_date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {appointment.reason && (
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Reason:</span> {appointment.reason}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      Upcoming
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No upcoming appointments scheduled</p>
              <Link 
                to="/doctor/appointments" 
                className="mt-2 inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-500"
              >
                Schedule an appointment
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;