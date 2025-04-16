// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../axios-config.js';

const AuthContext = createContext();
//React Context is a way to share data (like authentication info, user, theme, etc.) between components without passing props manually at every level.

export const AuthProvider = ({ children }) => {//Here, children is whatever is placed inside <AuthProvider>...</AuthProvider> when used.
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('access');
    return token ? jwtDecode(token) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


const fetchUser = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('access');
    if (token) {
      const decoded = jwtDecode(token);//jwtDecode is a JavaScript function (usually from the jwt-decode library) that lets you read the contents of a JWT (JSON Web Token) without verifying it.
      const userType = decoded.user_type;
      
      let response;
      if (userType === 'doctor') {
        response = await api.get('/api/doctor/profile/my_profile/');
        console.log('Doctor profile response:', response.data);
      } else if (userType === 'patient') {
        response = await api.get('/api/patient/profile/my_profile/');
        console.log('Patient profile response:', response.data);
      } else {
        throw new Error('Unknown user type');
      }

      const userData = { ...response.data, user_type: userType };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));//It converts a JavaScript object (userData) into a JSON string.
    }
  } catch (err) {
    console.error('Error fetching user:', err);
    // Clear invalid tokens
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setUser(null);
  } finally {
    setLoading(false);
  }
};


  const login = async (credentials) => {
    try {
      setLoading(true);
      const res = await api.post('/api/login/', credentials);
      
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      
      // Immediately decode and set auth state
      const decoded = jwtDecode(res.data.access);
      setAuth(decoded);
      console.log('Decoded token:', jwtDecode(localStorage.getItem('access')));
      // Wait for user data to be fetched before proceeding
      await fetchUser();
      
      // return true;
      return { success: true, data: res.data }; // Return more detailed success object
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed');
      // return false;
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    const refresh = localStorage.getItem('refresh');
    try {
      await api.post('/api/logout/', { refresh_token: refresh });
    } catch (err) {
      console.warn('Logout request failed:', err);
    }

    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setAuth(null);
    setUser(null);
  };
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token && !isTokenExpired(token)) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, auth, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
