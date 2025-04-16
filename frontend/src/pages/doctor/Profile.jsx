// src/pages/doctor/Profile.jsx
import React, { useState, useEffect } from 'react';
import api from '../../axios-config';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  BriefcaseIcon, // Changed from BriefcaseMedicalIcon
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    mobile: '',
    department: 'Cardiologist'
  });

  const departments = [
    'Cardiologist',
    'Dermatologists',
    'Emergency Medicine Specialists',
    'Allergists/Immunologists',
    'Anesthesiologists',
    'Colon and Rectal Surgeons'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/doctor/profile/my_profile/');
        setProfile(response.data);
        setFormData({
          address: response.data.address || '',
          mobile: response.data.mobile || '',
          department: response.data.department || 'Cardiologist'
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await api.patch(`/api/doctor/profile/${profile.id}/`, formData);
  //     setProfile(response.data);
  //     setIsEditing(false);
  //   } catch (err) {
  //     console.error('Error updating profile:', err);
  //     alert('Failed to update profile');
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('address', formData.address);
    data.append('mobile', formData.mobile);
    data.append('department', formData.department);
    if (imageFile) {
      data.append('profile_pic', imageFile);
    }
  
    try {
      const response = await api.patch(
        `/api/doctor/profile/${profile.id}/`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-teal-500 mb-4" />
          <div className="text-gray-600">Loading your profile...</div>
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
            <h3 className="text-sm font-medium">Error loading profile</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            <PencilSquareIcon className="h-5 w-5 mr-2" />
            Edit Profile
          </button>
        )}
      </div>
      
      {profile && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="md:flex">
            {/* Profile Picture Section */}
            <div className="md:w-1/3 p-6 bg-gradient-to-b from-teal-50 to-white">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                  // src={profile.profile_pic}
                    src={profile?.profile_pic_url || 'https://img.icons8.com/fluency/96/doctor-male.png'}
                    alt="Profile"
                    className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <span className="absolute bottom-3 right-3 block h-4 w-4 rounded-full bg-green-500 ring-2 ring-white"></span>
                </div>
                
                <h2 className="mt-4 text-xl font-semibold text-gray-800 text-center">
                  Dr. {profile.user?.first_name} {profile.user?.last_name}
                </h2>
                <p className="text-sm text-teal-600 text-center">{profile.department}</p>
                
                {isEditing && (
                  <div className="mt-6 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Profile Picture
                    </label>
                    <div className="flex items-center">
                      <label className="flex-1 cursor-pointer">
                        <input 
                          type="file" 
                          onChange={handleImageChange}
                          className="sr-only"
                          accept="image/*"
                        />
                        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center">
                          <span>Choose File</span>
                        </div>
                      </label>
                      {imageFile && (
                        <button 
                          onClick={() => setImageFile(null)}
                          className="ml-2 p-2 text-gray-500 hover:text-red-500"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    {imageFile && (
                      <p className="mt-2 text-xs text-gray-500 truncate">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Details Section */}
            <div className="md:w-2/3 p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Edit Profile Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6 text-gray-800">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <UserCircleIcon className="h-4 w-4 mr-1 text-gray-500" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={`${profile.user?.first_name || ''} ${profile.user?.last_name || ''}`}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.user?.email || ''}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <HomeIcon className="h-4 w-4 mr-1 text-gray-500" />
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        {/* <BriefcaseMedicalIcon className="h-4 w-4 mr-1 text-gray-500" /> */}
                        <BriefcaseIcon className="h-4 w-4 mr-1 text-gray-500" />
                        Department
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                      Personal Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div className="flex items-start">
                        <UserCircleIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Full Name</p>
                          <p className="text-gray-800">
                            Dr. {profile.user?.first_name} {profile.user?.last_name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-gray-800">{profile.user?.email || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p className="text-gray-800">{profile.mobile || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <HomeIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Address</p>
                          <p className="text-gray-800">{profile.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                      Professional Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div className="flex items-start">
                        <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Department</p>
                          <p className="text-gray-800">{profile.department || 'Not assigned'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        {profile.status ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 mt-1" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-400 mr-3 mt-1" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-500">Status</p>
                          <p className="text-gray-800">
                            {profile.status ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Inactive
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;