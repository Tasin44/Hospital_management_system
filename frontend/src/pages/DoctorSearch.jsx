// src/pages/DoctorSearch.jsx
import React, { useState, useEffect } from 'react';
import api from '../axios-config';

function DoctorSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch departments for dropdown (this would be fetched from an API in a real application)
  useEffect(() => {
    // Example departments - in a real app, you would fetch these from the backend
    setDepartments([
      'Cardiologist',
      'Dermatologists',
      'Emergency Medicine Specialists',
      'Allergists/Immunologists',
      'Anesthesiologists',
      'Colon and Rectal Surgeons',
    ]);
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (department) params.department = department;
      
      // const response = await api.get('/api/patients/search_doctors/', { params });
      const response = await api.get('/api/patient/profile/search_doctors/', { params });
      console.log(response);
      console.log(response.data);
      setDoctors(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error searching doctors:', err);
      setError('Failed to search doctors');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Find a Doctor</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearchSubmit}>
          <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name
              </label>
              <input
                type="text"
                id="searchTerm"
                className="w-full rounded-md text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter doctor name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="md:w-1/3">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                id="department"
                className="w-full rounded-md text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:flex md:items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto  bg-blue-600 hover:bg-blue-700 text-black font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="px-6 py-4 bg-gray-50 border-b border-gray-200 text-lg font-medium text-gray-900">
          Doctors
        </h2>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">Searching for doctors...</div>
        ) : doctors.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No doctors found. Try adjusting your search criteria.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {doctors.map((doctor) => (
              <li key={doctor.id} className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {doctor.profile_pic ? (
                      <img
                      className="h-12 w-12 rounded-full text-black"
                      src={doctor.profile_pic ? `${import.meta.env.VITE_API_URL}${doctor.profile_pic}` : '/default-avatar.png'}
                      alt={`${doctor.user.first_name}`}
                    />
                    ) : (
                      <div className="h-12 w-12 rounded-full text-black bg-blue-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-blue-500">
                          {doctor.user.first_name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {doctor.user.first_name} {doctor.user.last_name}
                    </h3>
                    <div className="mt-1 text-sm text-gray-900">
                      <p>{doctor.department}</p>
                      <p className="mt-1">{doctor.specialization}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DoctorSearch;

