// src/pages/Signup.jsx
import React, { useState } from 'react';
import api from '../axios-config.js';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '',
    password2: '', first_name: '', last_name: '',
    user_type: 'doctor', image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    // for (let key in formData) form.append(key, formData[key]);
    for (let key in formData) {
      if (key === 'image' && !formData.image) continue; // 🛠 skip if image is not selected
      form.append(key, formData[key]);
    }
    try {
      const res = await api.post('/api/signup/', form);
      console.log(res);
      alert(res.data.message);
    } catch (err) {
      alert('Signup failed');
      console.log(err.response.data);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-10 text-gray-900">
      <h2 className="text-2xl mb-4">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {['username', 'email', 'first_name', 'last_name', 'password', 'password2'].map((field) => (
          <input key={field} name={field} placeholder={field} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        ))}
        <select name="user_type" onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>
        <input type="file" name="image" onChange={handleChange} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
