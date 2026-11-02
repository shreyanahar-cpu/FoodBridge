import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8e0', borderTopColor: '#2d6a4f', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#4a5d4e', fontWeight: 500 }}>Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> send to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check role membership
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If a non-admin specifically tries to hit /admin, send to Access Denied page
    return <Navigate to="/access-denied" state={{ attemptedPath: location.pathname, requiredRoles: allowedRoles }} replace />;
  }

  return children;
};
