import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Utensils,
  Building2,
  Truck,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // ONLY 3 permitted public roles: 'donor', 'ngo', 'volunteer'
  const [role, setRole] = useState('donor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');

  // Donor-specific
  const [businessType, setBusinessType] = useState('restaurant');
  const [fssaiLicense, setFssaiLicense] = useState('');

  // NGO-specific
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [authorizedPerson, setAuthorizedPerson] = useState('');
  const [mission, setMission] = useState('');

  // Volunteer-specific
  const [vehicleType, setVehicleType] = useState('two_wheeler');
  const [availability, setAvailability] = useState('Evenings & Weekends');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        phone,
        address,
        city,
      };

      if (role === 'donor') {
        payload.donorDetails = { businessType, fssaiLicense };
      } else if (role === 'ngo') {
        payload.ngoDetails = {
          registrationNumber,
          authorizedPerson: authorizedPerson || name,
          mission,
        };
      } else if (role === 'volunteer') {
        payload.volunteerDetails = { vehicleType, availability };
      }

      const res = await register(payload);

      if (role === 'donor') {
        navigate('/dashboard/donor');
      } else if (role === 'ngo') {
        navigate('/dashboard/ngo');
      } else if (role === 'volunteer') {
        navigate('/dashboard/volunteer');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '90px' }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#143626' }}>
            Join the FoodBridge Network
          </h1>
          <p style={{ fontSize: '15px', color: '#4a5d4e', marginTop: '6px' }}>
            Choose your role and register to begin donating, claiming, or delivering surplus food.
          </p>
        </div>

        {/* ROLE SELECTION TABS (Strictly Donor, NGO, Volunteer!) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            backgroundColor: '#edf1ec',
            padding: '6px',
            borderRadius: '16px',
            marginBottom: '28px',
          }}
        >
          <button
            type="button"
            onClick={() => setRole('donor')}
            style={{
              padding: '12px 6px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: role === 'donor' ? '#ffffff' : 'transparent',
              color: role === 'donor' ? '#1b4332' : '#55695a',
              fontWeight: role === 'donor' ? '700' : '600',
              fontSize: '14px',
              boxShadow: role === 'donor' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Utensils size={18} color={role === 'donor' ? '#1b4332' : '#718375'} />
            Food Donor
          </button>

          <button
            type="button"
            onClick={() => setRole('ngo')}
            style={{
              padding: '12px 6px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: role === 'ngo' ? '#ffffff' : 'transparent',
              color: role === 'ngo' ? '#e76f51' : '#55695a',
              fontWeight: role === 'ngo' ? '700' : '600',
              fontSize: '14px',
              boxShadow: role === 'ngo' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Building2 size={18} color={role === 'ngo' ? '#e76f51' : '#718375'} />
            Verified NGO
          </button>

          <button
            type="button"
            onClick={() => setRole('volunteer')}
            style={{
              padding: '12px 6px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: role === 'volunteer' ? '#ffffff' : 'transparent',
              color: role === 'volunteer' ? '#2563eb' : '#55695a',
              fontWeight: role === 'volunteer' ? '700' : '600',
              fontSize: '14px',
              boxShadow: role === 'volunteer' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Truck size={18} color={role === 'volunteer' ? '#2563eb' : '#718375'} />
            Volunteer
          </button>
        </div>

        {/* Form Card */}
        <div
          className="card"
          style={{
            padding: '36px',
            borderRadius: '24px',
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
            {/* Primary Details */}
            <div className="form-group">
              <label className="form-label">
                {role === 'donor'
                  ? 'Restaurant / Establishment Name *'
                  : role === 'ngo'
                  ? 'NGO / Trust Organization Name *'
                  : 'Full Legal Name *'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  role === 'donor'
                    ? 'E.g., Royal Spice Restaurant'
                    : role === 'ngo'
                    ? 'E.g., Roti Bank Welfare Trust'
                    : 'E.g., Rahul Sharma'
                }
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Official Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@example.org"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password (min 6 characters) *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Contact Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 00000"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai, Delhi, Pune..."
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Physical Address / Headquarters *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, building, landmark..."
                className="form-input"
                required
              />
            </div>

            {/* ROLE-SPECIFIC FIELDS */}
            {role === 'donor' && (
              <div style={{ backgroundColor: '#f8faf7', border: '1px solid #e3e8e1', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1b4332', marginBottom: '12px' }}>
                  Food Donor Credentials
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Food Business Type</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="form-select"
                    >
                      <option value="restaurant">Restaurant / Bistro</option>
                      <option value="hotel">Hotel / Banquet Hall</option>
                      <option value="mess">Mess / University Cafeteria</option>
                      <option value="packaged_food">Packaged Food Manufacturer</option>
                      <option value="caterer">Event Caterer</option>
                      <option value="other">Other Food Facility</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">FSSAI License / Reg ID</label>
                    <input
                      type="text"
                      value={fssaiLicense}
                      onChange={(e) => setFssaiLicense(e.target.value)}
                      placeholder="FSSAI-1152200100XXXX"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === 'ngo' && (
              <div style={{ backgroundColor: '#fffbf7', border: '1px solid #fed7aa', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#c2410c', marginBottom: '12px' }}>
                  NGO Verification & Compliance Details
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Govt NGO Registration No *</label>
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="NGO-MH-2024-00123"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Authorized Signatory / Incharge</label>
                    <input
                      type="text"
                      value={authorizedPerson}
                      onChange={(e) => setAuthorizedPerson(e.target.value)}
                      placeholder="Designated representative"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Community Mission / Target Beneficiaries</label>
                  <textarea
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    placeholder="Briefly describe the communities or shelters your NGO serves..."
                    className="form-textarea"
                    rows={2}
                  />
                </div>

                <p style={{ fontSize: '12px', color: '#9a3412', marginTop: '10px' }}>
                  Note: In accordance with FoodBridge security policies, newly registered NGOs undergo administrator verification before food donation requests are unlocked.
                </p>
              </div>
            )}

            {role === 'volunteer' && (
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1d4ed8', marginBottom: '12px' }}>
                  Volunteer Transport Details
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Vehicle Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="form-select"
                    >
                      <option value="two_wheeler">Two-Wheeler (Motorcycle / Scooter)</option>
                      <option value="car">Car / Hatchback / Sedan</option>
                      <option value="van">Van / Small Commercial Tempo</option>
                      <option value="auto">Auto-Rickshaw</option>
                      <option value="none">Bicycle / Public Transport</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">General Availability</label>
                    <input
                      type="text"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      placeholder="E.g., Evenings 6-9 PM, Weekends"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={role === 'ngo' ? 'btn btn-accent' : 'btn btn-primary'}
              style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : `Register as ${role.toUpperCase()}`}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#4a5d4e' }}>
          Already registered on FoodBridge?{' '}
          <Link to="/login" style={{ color: '#1b4332', fontWeight: '700', textDecoration: 'underline' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
