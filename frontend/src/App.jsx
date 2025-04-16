import './App.css'

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import ProfileUpdateForm from './pages/ProfileUpdateForm.jsx';
import DischargeDetails from './pages/DischargeDetails.jsx';
import Invoices from './pages/Invoices.jsx';
import DoctorSearch from './pages/DoctorSearch.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Navbar from './components/Navbar.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ActivateAccount from './pages/ActivateAccount.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
// App.jsx modifications
import DoctorDashboard from './pages/doctor/Dashboard.jsx';//done
import DoctorProfile from './pages/doctor/Profile.jsx';//done
import DoctorAppointments from './pages/doctor/Appointments.jsx';
import DoctorPrescriptions from './pages/doctor/Prescriptions.jsx';
import DoctorPatients from './pages/doctor/Patients.jsx';
import DoctorLayout from './components/doctor/Layout.jsx';//done
function App() {
  return (
    <AuthProvider>
      <Router>
      <Navbar />
 
<Routes>
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />
  <Route path="/api/activate/:token" element={<ActivateAccount />} />
  <Route path="/" element={<Navigate to="/dashboard" replace />} />
  
  {/* Patient routes */}
  <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/ProfileUpdateForm" element={<ProfileUpdateForm />} />
    <Route path="/discharge" element={<DischargeDetails />} />
    <Route path="/invoices" element={<Invoices />} />
    <Route path="/find-doctors" element={<DoctorSearch />} />
  </Route>
  
  {/* Doctor routes - move this outside of the patient routes */}
  <Route element={<ProtectedRoute><DoctorLayout /></ProtectedRoute>}>
    <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
    <Route path="/doctor/profile" element={<DoctorProfile />} />
    <Route path="/doctor/appointments" element={<DoctorAppointments />} />
    <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
    <Route path="/doctor/patients" element={<DoctorPatients />} />
  </Route>
</Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;