// src/axios-config.jsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',

});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access'); // Use correct key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
