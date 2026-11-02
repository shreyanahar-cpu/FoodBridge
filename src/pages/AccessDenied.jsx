import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Lock, LogOut } from 'lucide-react';

export const AccessDenied = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitchAccount = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '100px' }}>
      <div
        className="card"
        style={{
          maxWidth: '560px',
          margin: '0 auto',
          padding: '48px 36px',
          textAlign: 'center',
          borderRadius: '24px',
          border: '1.5px solid #fecaca',
          boxShadow: 'var(--shadow-xl)',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            backgroundColor: '#fee2e2',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#dc2626',
            margin: '0 auto 20px',
          }}
        >
          <ShieldAlert size={36} />
        </div>

        <span
          style={{
            fontSize: '12px',
            fontWeight: '800',
            color: '#dc2626',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            backgroundColor: '#fef2f2',
            padding: '4px 12px',
            borderRadius: '9999px',
          }}
        >
          403 FORBIDDEN • ACCESS RESTRICTED
        </span>

        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#143626', marginTop: '14px', marginBottom: '12px' }}>
          Access Denied
        </h1>

        <p style={{ fontSize: '15px', color: '#4a5d4e', lineHeight: 1.6, marginBottom: '24px' }}>
          You do not have the required role-based permissions to view this private console. In accordance with FoodBridge security policies, administration tools are accessible exclusively to verified system administrators.
        </p>

        {user && (
          <div
            style={{
              backgroundColor: '#f8faf7',
              border: '1px solid #e2e8df',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '13px',
              color: '#55695a',
              marginBottom: '28px',
            }}
          >
            Signed in as: <strong style={{ color: '#1b4332' }}>{user.name}</strong> ({user.email})<br />
            Assigned Role: <strong style={{ color: '#e76f51', textTransform: 'uppercase' }}>{user.role}</strong>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            Return to Homepage
          </Link>

          <button onClick={handleSwitchAccount} className="btn btn-outline">
            <LogOut size={16} />
            Switch Account
          </button>
        </div>
      </div>
    </div>
  );
};
