import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Utensils,
  Building2,
  Truck,
  Lock,
  Mail,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected public role filter for UI convenience (Donor, NGO, Volunteer only!)
  const [selectedRole, setSelectedRole] = useState('donor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
const [showAdminLogin, setShowAdminLogin] = useState(
  new URLSearchParams(window.location.search).get('admin') === '1'
);
  // Demo accounts helper quick-fill
  const demoAccounts = {
    donor: {
      email: 'spicekitchen@donor.org',
      pass: 'Donor@123',
      label: 'Royal Spice Restaurant (Donor)',
    },
    ngo: {
      email: 'roti@ngo.org',
      pass: 'Ngo@123',
      label: 'Roti Bank Foundation (Verified NGO)',
    },
    ngoPending: {
      email: 'hopeforall@ngo.org',
      pass: 'Ngo@123',
      label: 'Hope For All Society (Pending NGO)',
    },
    volunteer: {
      email: 'rahul.vol@volunteer.org',
      pass: 'Vol@123',
      label: 'Rahul Sharma (Volunteer Driver)',
    },
    
  };

  const handleQuickFill = (accKey) => {
    const acc = demoAccounts[accKey];
    if (acc) {
      setEmail(acc.email);
      setPassword(acc.pass);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);

      // Determine redirect path
      const fromPath = location.state?.from?.pathname;

      if (fromPath && fromPath !== '/access-denied') {
        navigate(fromPath);
      } else {
        if (loggedInUser.role === 'admin') {
          navigate('/admin');
        } else if (loggedInUser.role === 'donor') {
          navigate('/dashboard/donor');
        } else if (loggedInUser.role === 'ngo') {
          navigate('/dashboard/ngo');
        } else if (loggedInUser.role === 'volunteer') {
          navigate('/dashboard/volunteer');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '90px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#143626' }}>
            Welcome to FoodBridge
          </h1>
          <p style={{ fontSize: '15px', color: '#4a5d4e', marginTop: '6px' }}>
            Sign in to access your donation dashboard and records.
          </p>
        </div>

        {/* PUBLIC ROLE SELECTOR TABS (Only Donor, NGO, Volunteer!) */}
        {!showAdminLogin && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '6px',
              backgroundColor: '#edf1ec',
              padding: '6px',
              borderRadius: '14px',
              marginBottom: '24px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setSelectedRole('donor');
                handleQuickFill('donor');
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 4px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRole === 'donor' ? '#ffffff' : 'transparent',
                color: selectedRole === 'donor' ? '#1b4332' : '#55695a',
                fontWeight: selectedRole === 'donor' ? '700' : '600',
                fontSize: '13px',
                boxShadow: selectedRole === 'donor' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <Utensils size={16} color={selectedRole === 'donor' ? '#1b4332' : '#718375'} />
              Food Donor
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('ngo');
                handleQuickFill('ngo');
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 4px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRole === 'ngo' ? '#ffffff' : 'transparent',
                color: selectedRole === 'ngo' ? '#e76f51' : '#55695a',
                fontWeight: selectedRole === 'ngo' ? '700' : '600',
                fontSize: '13px',
                boxShadow: selectedRole === 'ngo' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <Building2 size={16} color={selectedRole === 'ngo' ? '#e76f51' : '#718375'} />
              NGO Partner
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('volunteer');
                handleQuickFill('volunteer');
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 4px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRole === 'volunteer' ? '#ffffff' : 'transparent',
                color: selectedRole === 'volunteer' ? '#2563eb' : '#55695a',
                fontWeight: selectedRole === 'volunteer' ? '700' : '600',
                fontSize: '13px',
                boxShadow: selectedRole === 'volunteer' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <Truck size={16} color={selectedRole === 'volunteer' ? '#2563eb' : '#718375'} />
              Volunteer
            </button>
          </div>
        )}

        {/* Admin Login Notice Banner */}
        {showAdminLogin && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#991b1b',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={15} />
              <span>Private System Administrator Portal</span>
            </div>
            <button
              onClick={() => {
                setShowAdminLogin(false);
                setSelectedRole('donor');
                handleQuickFill('donor');
              }}
              style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Return to Public Login
            </button>
          </div>
        )}

        {/* Main Login Form Card */}
        <div
          className="card"
          style={{
            padding: '32px',
            borderRadius: '20px',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {error && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#718375" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <span style={{ fontSize: '12px', color: '#718375' }}>Demo ready</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#718375" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={showAdminLogin ? 'btn btn-primary' : 'btn btn-accent'}
              style={{ width: '100%', padding: '12px', fontSize: '16px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : showAdminLogin ? 'Sign In as Administrator' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #edf1ec' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#718375', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
              <Sparkles size={13} color="#f4a261" /> One-Click Demo Credentials:
            </span>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowAdminLogin(false);
                  setSelectedRole('donor');
                  handleQuickFill('donor');
                }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '12px' }}
              >
                Donor (Spice Kitchen)
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAdminLogin(false);
                  setSelectedRole('ngo');
                  handleQuickFill('ngo');
                }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '12px' }}
              >
                NGO (Roti Bank)
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAdminLogin(false);
                  setSelectedRole('volunteer');
                  handleQuickFill('volunteer');
                }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '12px' }}
              >
                Volunteer (Rahul)
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#4a5d4e' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#1b4332', fontWeight: '700', textDecoration: 'underline' }}>
            Register as Donor, NGO, or Volunteer
          </Link>
        </div>

        
      </div>
    </div>
  );
};
