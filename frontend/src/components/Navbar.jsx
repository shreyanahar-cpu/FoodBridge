import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, LogOut, User, Menu, X, ShieldAlert, PlusCircle, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isDonor, isNgo, isVolunteer } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isDonor) return '/dashboard/donor';
    if (isNgo) return '/dashboard/ngo';
    if (isVolunteer) return '/dashboard/volunteer';
    return '/';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5eae3',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(20, 54, 38, 0.04)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => setMobileMenuOpen(false)}>
          <div
            style={{
              width: '42px',
              height: '42px',
              backgroundColor: '#1b4332',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 3px 10px rgba(27, 67, 50, 0.25)',
            }}
          >
            <HeartHandshake size={24} color="#f4a261" />
          </div>
          <div>
            <span style={{ fontSize: '21px', fontWeight: '800', color: '#1b4332', letterSpacing: '-0.5px' }}>
              Food<span style={{ color: '#e76f51' }}>Bridge</span>
            </span>
            <span style={{ display: 'block', fontSize: '10px', color: '#718375', fontWeight: '600', letterSpacing: '0.8px', marginTop: '-3px' }}>
              SURPLUS REDISTRIBUTION
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '26px' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontSize: '15px',
              fontWeight: isActive('/') ? '700' : '500',
              color: isActive('/') ? '#1b4332' : '#4a5d4e',
              transition: 'color 0.2s',
            }}
          >
            Home
          </Link>

          <Link
            to="/donations"
            style={{
              fontSize: '15px',
              fontWeight: isActive('/donations') ? '700' : '500',
              color: isActive('/donations') ? '#1b4332' : '#4a5d4e',
              transition: 'color 0.2s',
            }}
          >
            Available Food
          </Link>

          <Link
            to="/how-it-works"
            style={{
              fontSize: '15px',
              fontWeight: isActive('/how-it-works') ? '700' : '500',
              color: isActive('/how-it-works') ? '#1b4332' : '#4a5d4e',
              transition: 'color 0.2s',
            }}
          >
            How It Works
          </Link>

          <Link
            to="/about"
            style={{
              fontSize: '15px',
              fontWeight: isActive('/about') ? '700' : '500',
              color: isActive('/about') ? '#1b4332' : '#4a5d4e',
              transition: 'color 0.2s',
            }}
          >
            About Us
          </Link>

          <Link
            to="/contact"
            style={{
              fontSize: '15px',
              fontWeight: isActive('/contact') ? '700' : '500',
              color: isActive('/contact') ? '#1b4332' : '#4a5d4e',
              transition: 'color 0.2s',
            }}
          >
            Contact
          </Link>

          {/* If logged in, show their specific role dashboard */}
          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: isAdmin ? '#b91c1c' : '#1b4332',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: isAdmin ? '#fef2f2' : '#e8f5ec',
                padding: '6px 14px',
                borderRadius: '9999px',
                border: isAdmin ? '1px solid #fecaca' : '1px solid #c2e5cf',
              }}
            >
              <LayoutDashboard size={14} />
              {isAdmin ? 'Admin Console' : `${user.role.toUpperCase()} Dashboard`}
            </Link>
          )}
        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: 'none', alignItems: 'center', gap: '12px' }} className="desktop-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332' }}>
                  {user.name}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: isAdmin ? '#dc2626' : '#e76f51',
                    textTransform: 'uppercase',
                  }}
                >
                  {user.role}
                </span>
              </div>

              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Sign Out">
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: '#1b4332',
            display: 'block',
          }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid #e5eae3',
            backgroundColor: '#ffffff',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
          }}
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', fontWeight: '600', color: '#1b4332' }}>
            Home
          </Link>
          <Link to="/donations" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', fontWeight: '600', color: '#1b4332' }}>
            Available Food Donations
          </Link>
          <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', fontWeight: '600', color: '#1b4332' }}>
            How It Works
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', fontWeight: '600', color: '#1b4332' }}>
            About Us
          </Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', fontWeight: '600', color: '#1b4332' }}>
            Contact Us
          </Link>

          {isAuthenticated ? (
            <div style={{ paddingTop: '12px', borderTop: '1px solid #edf1ec', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Go to {isAdmin ? 'Admin' : user.role.toUpperCase()} Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>
                <LogOut size={16} /> Sign Out ({user.name})
              </button>
            </div>
          ) : (
            <div style={{ paddingTop: '12px', borderTop: '1px solid #edf1ec', display: 'flex', gap: '10px' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>
                Log In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* CSS Helper for responsive toggles */}
      <style>{`
        @media (min-width: 820px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
