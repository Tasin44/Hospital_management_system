// src/pages/DischargeDetails.jsx
import React, { useState, useEffect } from 'react';
import api from '../axios-config';
import {
  CalendarIcon,
  UserIcon,
  HomeIcon,
  PhoneIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  BeakerIcon, // Replaced PillsIcon with BeakerIcon
  ClipboardDocumentCheckIcon,
  ReceiptPercentIcon
} from '@heroicons/react/24/outline';

function DischargeDetails() {
  const [dischargeDetails, setDischargeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDischargeDetails = async () => {
      try {
        const response = await api.get('/api/patient/discharge/');
        setDischargeDetails(Array.isArray(response.data) ? response.data : response.data.results || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching discharge details:', err);
        setError('Failed to load discharge details');
        setLoading(false);
      }
    };

    fetchDischargeDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-gray-600">Loading your discharge details...</div>
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
            <h3 className="text-sm font-medium">Error loading details</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (dischargeDetails.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Discharge Details</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <InformationCircleIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No discharge records found</h3>
          <p className="mt-1 text-sm text-gray-500">You are still admitted to the hospital.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Discharge Details</h1>
      
      {dischargeDetails.map((detail) => (
        <div key={detail.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">
                Discharged on {new Date(detail.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Hospital stay: {detail.days_spent} days
            </p>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Patient Information */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-base font-semibold text-gray-800">Patient Information</h3>
                </div>
                
                <div className="space-y-4 pl-7">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Doctor</p>
                      {/* <span className="font-medium text-gray-950">Doctor:</span> {detail.assigned_doctor_name} */}
                      <p className="text-sm font-semibold text-gray-900">{detail.doctor_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <HomeIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-sm font-semibold text-gray-900">{detail.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <PhoneIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm font-semibold text-gray-900">{detail.mobile}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <InformationCircleIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Symptoms</p>
                      <p className="text-sm font-semibold text-gray-900">{detail.symptoms}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Admitted</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(detail.admit_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Billing Details */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <ReceiptPercentIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-base font-semibold text-gray-800">Billing Details</h3>
                </div>
                
                <div className="space-y-4 pl-7">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <HomeIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Room Charge</p>
                      <p className="text-sm font-semibold text-gray-900">${detail.room_charge}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                    <BeakerIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Medicine Cost</p>
                      <p className="text-sm font-semibold text-gray-900">${detail.medicine_cost}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Doctor Fee</p>
                      <p className="text-sm font-semibold text-gray-900">${detail.doctor_fee}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <CurrencyDollarIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Other Charges</p>
                      <p className="text-sm font-semibold text-gray-900">${detail.other_charge}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start pt-4 border-t border-gray-200">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <CurrencyDollarIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Total Amount</p>
                      <p className="text-lg font-bold text-blue-600">${detail.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DischargeDetails;