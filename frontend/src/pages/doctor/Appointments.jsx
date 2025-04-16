// src/pages/doctor/Appointments.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../axios-config';
import { format } from 'date-fns';
import {
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    symptoms: '',
    medication: '',
    dosage: '',
    instructions: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/api/doctor/appointments/doctor_appointments/');
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
      setLoading(false);
    }
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      symptoms: appointment.reason || '',
      medication: '',
      dosage: '',
      instructions: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    
    try {
      await api.post(
        `/api/doctor/prescriptions/${selectedAppointment.id}/create_from_appointment/`,
        formData
      );
      
      alert('Prescription created successfully');
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      console.error('Error creating prescription:', err);
      alert('Failed to create prescription');
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy - h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-teal-500 mb-4" />
          <div className="text-gray-600">Loading appointments...</div>
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
            <h3 className="text-sm font-medium">Error loading appointments</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CalendarIcon className="h-6 w-6 text-teal-500 mr-2" />
              Upcoming Appointments
            </h2>
            
            {appointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
                      appointment.is_completed ? 'bg-gray-50' : 'bg-white hover:shadow-md cursor-pointer'
                    } ${
                      selectedAppointment?.id === appointment.id ? 'ring-2 ring-teal-500' : ''
                    }`}
                    onClick={() => !appointment.is_completed && handleSelectAppointment(appointment)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-teal-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            Patient ID: {appointment.patient}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {formatDateTime(appointment.appointment_date)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.is_completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {appointment.is_completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    {appointment.reason && (
                      <div className="mt-3 pl-13">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Reason:</span> {appointment.reason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prescription Form */}
        {selectedAppointment && !selectedAppointment.is_completed && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6 text-gray-900">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <DocumentTextIcon className="h-6 w-6 text-teal-500 mr-2" />
                Create Prescription
              </h2>
              
              <div className="mb-4 p-3 bg-teal-50 rounded-lg">
                <p className="text-sm font-medium text-teal-800">
                  Appointment for Patient ID: {selectedAppointment.patient}
                </p>
                <p className="text-xs text-teal-600 mt-1">
                  {formatDateTime(selectedAppointment.appointment_date)}
                </p>
              </div>
              
              <form onSubmit={handleCreatePrescription} className="space-y-4">
                <div>
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                    Symptoms
                  </label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label htmlFor="medication" className="block text-sm font-medium text-gray-700 mb-1">
                    Medication
                  </label>
                  <textarea
                    id="medication"
                    name="medication"
                    value={formData.medication}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    rows="3"
                    placeholder="Enter medication details"
                  />
                </div>
                
                <div>
                  <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    id="dosage"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., 500mg twice daily"
                  />
                </div>
                
                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    rows="3"
                    placeholder="Additional instructions for patient"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAppointment(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                  >
                    Create Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;