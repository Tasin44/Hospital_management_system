// src/pages/ProfileUpdateForm.jsx
import React, { useState } from 'react';
import api from '../axios-config';

function ProfileUpdateForm({ initialProfile, onSuccess }) {
  const [mobile, setMobile] = useState(initialProfile?.mobile || '');
  const [address, setAddress] = useState(initialProfile?.address || '');

  const [blood_group, setBlood] = useState(initialProfile?.blood_group || '');
  const [date_of_birth, setBirth] = useState(initialProfile?.date_of_birth || '');

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('address', address);
    // if (profileImage) {
    //   formData.append('profile_image', profileImage);
    // }
    formData.append('blood_group', blood_group); 
    formData.append('date_of_birth', date_of_birth); 
    if (profileImage) {
      formData.append('profile_pic', profileImage); 
    }

    try {
      const response = await api.put('/api/patient/profile/update_profile/', formData);
      console.log(response);
      setMessage(response.data.message);
      onSuccess && onSuccess(response.data.data);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white shadow p-6 rounded text-gray-800" >
      <h2 className="text-xl font-semibold text-gray-800">Update Profile</h2>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Blood Group</label>
        <input
          type="text"
          value={blood_group}
          onChange={(e) => setBlood(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
        {/* <input
          type="text"
          value={date_of_birth}
          onChange={(e) => setBirth(e.target.value)}

        /> */}
         <input
            type="date"
            value={date_of_birth}
            onChange={(e) => setBirth(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
        /> 
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Mobile</label>
        <input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfileImage(e.target.files[0])}
          className="mt-1 block w-full text-sm text-gray-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}

export default ProfileUpdateForm;
