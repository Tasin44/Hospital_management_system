// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import ProfileUpdateForm from './ProfileUpdateForm';
import api from '../axios-config';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [emergency, setEmergency] = useState(null);
  const [bed, setBed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/patient/profile/my_profile/');
        console.log(response.data);
        setProfile(response.data);
        setEmergency(response.data.emergency_case);
        setBed(response.data.bed);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
      
      {showUpdateForm && (
        <ProfileUpdateForm
          initialProfile={profile.profile}
          onSuccess={(updatedData) => {
            setProfile((prev) => ({
              ...prev,
              profile: updatedData,
            }));
            setShowUpdateForm(false);
          }}
          onCancel={() => setShowUpdateForm(false)}
        />
      )}
      
      {profile && !showUpdateForm && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile Image Section */}
          <div className="p-6 bg-gray-50 flex flex-col items-center">
            {profile.profile?.profile_pic_url ? (
              <img
                src={profile.profile.profile_pic_url}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow">
                <span className="text-4xl text-blue-500 font-medium">
                  {profile.profile?.user?.first_name?.[0] || 'P'}
                </span>
              </div>
            )}
            <h2 className="mt-4 text-xl font-medium text-gray-900">
              {profile.profile?.user?.first_name} {profile.profile?.user?.last_name}
            </h2>
            <p className="text-gray-600">{profile.profile?.user?.email}</p>
          </div>

          <div className="p-6 flex justify-end">
            <button
              onClick={() => setShowUpdateForm(true)}
              className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-xs"
            >
              Update Profile
            </button>
          </div>

          {/* Information Sections */}
          <div className="divide-y divide-gray-200  ">
            {/* Personal Information */}
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-4 ">
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-gray-800">{profile.profile?.mobile || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-800">{profile.profile?.address || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-gray-800">
                    {profile.profile?.date_of_birth || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Blood Group</p>
                  <p className="text-gray-800">
                    {profile.profile?.blood_group || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Symptoms</p>
                  <p className="text-gray-800">{profile.profile?.symptoms || 'None listed'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Admission Date</p>
                  <p className="text-gray-800">
                    {profile.profile?.admit_date && new Date(profile.profile.admit_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Assigned Doctor</p>
                  <p className="text-gray-800">
                    {profile.profile?.doctor_name !== "Not Assigned"
                      ? `Dr. ${profile.profile?.doctor_name}`
                      : 'Not assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-gray-800">{profile.profile?.department_name || 'N/A'}</p>
                </div>
              </div>
            </div>
  
            {/* Bed Information */}
            {profile.bed && (
              <div className="p-6 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Bed Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bed Number</p>
                    <p className="text-gray-800">{profile.bed.bed_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ward</p>
                    <p className="text-gray-800">{profile.bed.ward}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Assigned On</p>
                    <p className="text-gray-800">
                      {new Date(profile.bed.assigned_date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bed Type</p>
                    <p className="text-gray-800">{profile.bed.bed_type || 'Standard'}</p>
                  </div>
                </div>
              </div>
            )}
  
            {/* Emergency Information */}
            {profile.emergency_case && (
              <div className="p-6 bg-red-50">
                <h2 className="text-lg font-medium text-red-700 mb-4">Emergency Case</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-red-700">Severity</p>
                    <p className="text-gray-800 capitalize">
                      {profile.emergency_case.severity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-700">Reported On</p>
                    <p className="text-gray-800">
                      {new Date(profile.emergency_case.admission_date).toLocaleString()}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-red-700">Description</p>
                    <p className="text-gray-800">
                      {profile.emergency_case.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;