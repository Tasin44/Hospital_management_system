// src/pages/doctor/Patients.jsx
import React, { useState, useEffect } from 'react';
import api from '../../axios-config';
import {
  UserGroupIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  BeakerIcon,
  ArrowPathIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm]);

  const fetchPatients = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      params.append('page', currentPage);
      
      const response = await api.get(`/api/doctor/profile/my_patients/?${params.toString()}`);
      console.log(response);
      setPatients(response.data.results || response.data);
      
      console.log('All pts:',response.data.results);
       // Handle pagination if the API returns it
      if (response.data.count) {
        setTotalPages(Math.ceil(response.data.count / 5));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients');
      setLoading(false);
    }
  };

  const fetchPatientDetails = async (patientId) => {
    setPatientDetails(null);// Reset details when changing patients
    
    try {
      // Get patient appointments
      const appointmentsResponse = await api.get(`/api/doctor/appointments/`);
      // const patientAppointments = appointmentsResponse.data.filter(
      //   appointment => appointment.patient === patientId
      // );
      const appointmentsData = appointmentsResponse.data.results || appointmentsResponse.data;
      const patientAppointments = appointmentsData.filter(
        appointment => appointment.patient === patientId
      );
            
      const prescriptionsResponse = await api.get(`/api/doctor/prescriptions/`);
            // const patientPrescriptions = prescriptionsResponse.data.filter(
      //   prescription => prescription.patient === patientId
      // );
      const prescriptionsData = prescriptionsResponse.data.results || prescriptionsResponse.data;
      const patientPrescriptions = prescriptionsData.filter(
        prescription => prescription.patient === patientId
      );
      
      setPatientDetails({
        appointments: patientAppointments || [],
        prescriptions: patientPrescriptions || []
      });
    } catch (err) {
      console.error('Error fetching patient details:', err);
      alert('Failed to load patient details');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);// Reset to first page when searching
    fetchPatients();
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    fetchPatientDetails(patient.id);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  if (loading && !patients.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-teal-500 mb-4" />
          <div className="text-gray-600">Loading patients...</div>
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
            <h3 className="text-sm font-medium">Error loading patients</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <UserGroupIcon className="h-8 w-8 text-teal-500 mr-2" />
        My Patients
      </h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-gray-800">
        <div className="flex items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients by name or symptoms..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <button 
            type="submit" 
            className="ml-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </form>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <UserGroupIcon className="h-5 w-5 text-teal-500 mr-2" />
              Patient List
            </h2>
            
            {patients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No patients found
              </div>
            ) : (
              <div className="space-y-3">
                {patients.map((patient) => (
                  <div 
                    key={patient.id}
                    className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
                      selectedPatient?.id === patient.id 
                        ? 'ring-2 ring-teal-500 bg-teal-50' 
                        : 'bg-white hover:shadow-md cursor-pointer'
                    }`}
                    onClick={() => handleSelectPatient(patient)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <UserCircleIcon className="h-5 w-5 text-teal-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {patient.user?.first_name} {patient.user?.last_name}
                        </p>
                        {patient.symptoms && (
                          <p className="text-sm text-gray-500 truncate">
                            <span className="font-medium">Symptoms:</span> {patient.symptoms}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === page 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Patient Details */}
        {selectedPatient && (
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-teal-500 mr-2" />
                Patient Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <UserCircleIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-gray-800">
                        {selectedPatient.user?.first_name} {selectedPatient.user?.last_name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-800">
                        {selectedPatient.user?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {selectedPatient.mobile && (
                    <div className="flex items-start">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Mobile</p>
                        <p className="text-gray-800">{selectedPatient.mobile}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedPatient.address && (
                    <div className="flex items-start">
                      <HomeIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="text-gray-800">{selectedPatient.address}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedPatient.symptoms && (
                    <div className="flex items-start">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Symptoms</p>
                        <p className="text-gray-800">{selectedPatient.symptoms}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Patient Details */}
            {patientDetails ? (
              <div className="space-y-6">
                {/* Appointments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CalendarIcon className="h-5 w-5 text-teal-500 mr-2" />
                    Appointments History
                  </h3>
                  
                  {patientDetails.appointments.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No appointment history
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {patientDetails.appointments.map(appointment => (
                        <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center text-sm text-gray-700">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                              {new Date(appointment.appointment_date).toLocaleString()}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              appointment.is_completed 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-teal-100 text-teal-800'
                            }`}>
                              {appointment.is_completed ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                          {appointment.reason && (
                            <p className="text-sm text-gray-700 mt-2 pl-6">
                              <span className="font-medium">Reason:</span> {appointment.reason}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Prescriptions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <BeakerIcon className="h-5 w-5 text-teal-500 mr-2" />
                    Prescriptions
                  </h3>
                  
                  {patientDetails.prescriptions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No prescriptions issued
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {patientDetails.prescriptions.map(prescription => (
                        <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center text-sm text-gray-700">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                              {new Date(prescription.date_issued).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-2 pl-6 space-y-1">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Medication:</span> {prescription.medication}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Dosage:</span> {prescription.dosage}
                            </p>
                            {prescription.instructions && (
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Instructions:</span> {prescription.instructions}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-center items-center py-8">
                  <ArrowPathIcon className="h-8 w-8 animate-spin text-teal-500 mr-2" />
                  <span className="text-gray-600">Loading patient details...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;