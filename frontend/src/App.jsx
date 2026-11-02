import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { AvailableDonations } from './pages/AvailableDonations';
import { DonorDashboard } from './pages/DonorDashboard';
import { NGODashboard } from './pages/NGODashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Contact } from './pages/Contact';
import { AccessDenied } from './pages/AccessDenied';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/donations" element={<AvailableDonations />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* Role-Protected Dashboards */}
              <Route
                path="/dashboard/donor"
                element={
                  <ProtectedRoute allowedRoles={['donor', 'admin']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ngo"
                element={
                  <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                    <NGODashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/volunteer"
                element={
                  <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                    <VolunteerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* STRICTLY PRIVATE ADMIN DASHBOARD */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
