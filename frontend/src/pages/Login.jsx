// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, user } = useAuth(); // Move useAuth to top level
  // const { login } = useAuth();
  // const { login } = useAuth(); // Only need login here
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
  
    const success = await login({ username, password });
if (success) {
  const userData = JSON.parse(localStorage.getItem('user'));
  if (userData?.user_type === 'doctor') {
    console.log("Navigating to doctor dashboard"); 
    navigate('/doctor/dashboard');
  } else {
    console.log("Navigating to pt dashboard"); 
    navigate('/dashboard');
  }
}
  };
  return (
    <div className="max-w-md mx-auto p-4 mt-10 text-gray-900">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full border px-3 py-2 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" />
        <button className="bg-green-500 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
