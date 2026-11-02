import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Mail, Phone, MapPin, Globe, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#143626',
        color: '#ffffff',
        borderTop: '1px solid #1f4d37',
        marginTop: 'auto',
      }}
    >
      <div className="container" style={{ paddingTop: '56px', paddingBottom: '36px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  backgroundColor: '#2d6a4f',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <HeartHandshake size={22} color="#f4a261" />
              </div>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff' }}>
                Food<span style={{ color: '#f4a261' }}>Bridge</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#b7d5c3', lineHeight: 1.6, marginBottom: '20px' }}>
              Bridging the gap between commercial surplus edible food and verified charitable organizations to eliminate hunger and reduce environmental waste.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#d8f3dc' }}>
              <ShieldCheck size={16} color="#74c69d" />
              Verified NGOs & Secure Food Protocols
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li>
                <Link to="/" style={{ color: '#b7d5c3', transition: 'color 0.2s' }}>Home</Link>
              </li>
              <li>
                <Link to="/donations" style={{ color: '#b7d5c3', transition: 'color 0.2s' }}>Available Food Donations</Link>
              </li>
              <li>
                <Link to="/how-it-works" style={{ color: '#b7d5c3', transition: 'color 0.2s' }}>How It Works</Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#b7d5c3', transition: 'color 0.2s' }}>About Us</Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#b7d5c3', transition: 'color 0.2s' }}>Contact & Help</Link>
              </li>
            </ul>
          </div>

          {/* User Ecosystem */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }}>
              Join The Mission
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li>
                <Link to="/register" style={{ color: '#b7d5c3' }}>For Food Donors (Restaurants & Messes)</Link>
              </li>
              <li>
                <Link to="/register" style={{ color: '#b7d5c3' }}>For Verified NGOs & Charities</Link>
              </li>
              <li>
                <Link to="/register" style={{ color: '#b7d5c3' }}>For Volunteer Pick-up Drivers</Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#b7d5c3' }}>Partner Sign In</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }}>
              Get In Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#b7d5c3' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#f4a261" />
                <span>support@foodbridge.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#f4a261" />
                <span>+91 (022) 2890-4100 (Toll Free)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="#f4a261" style={{ marginTop: '3px' }} />
                <span>Central Operations Hub, Bandra Kurla Complex, Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #1f4d37',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            color: '#89a896',
            gap: '12px',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} FoodBridge Platform. Built for College Community Engagement Project (CEP).
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>FSSAI Food Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
