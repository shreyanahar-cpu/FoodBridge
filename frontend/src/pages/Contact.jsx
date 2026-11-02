import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Building,
  HeartHandshake,
} from 'lucide-react';

export const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.submitContact(form);
      if (res.success) {
        setSuccess(true);
        setForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit contact request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', paddingBottom: '80px' }}>
      {/* Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #143626 0%, #1b4332 60%, #2d6a4f 100%)',
          color: '#ffffff',
          padding: '70px 0',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '780px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#f4a261', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            We're Here For You
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: 1.2, marginTop: '8px', marginBottom: '16px' }}>
            Contact the FoodBridge Team
          </h1>
          <p style={{ fontSize: '18px', color: '#d8f3dc', lineHeight: 1.6 }}>
            Have a question about food safety standards, partnering your restaurant chain, or enrolling your charitable organization? Reach out to us.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="container">
        <div className="grid grid-cols-2" style={{ gap: '48px', alignItems: 'flex-start' }}>
          {/* Left Column: Direct Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#e76f51', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Operational Support
              </span>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#143626', marginTop: '4px' }}>
                Quick Assistance Channels
              </h2>
              <p style={{ fontSize: '15px', color: '#4a5d4e', marginTop: '8px', lineHeight: 1.6 }}>
                Our dispatch coordination team monitors active listings and assists both donating establishments and receiving charities 7 days a week.
              </p>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#e8f5ec', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b4332', flexShrink: 0 }}>
                <Phone size={22} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#718375', fontWeight: '600' }}>TOLL-FREE HELPLINE</span>
                <strong style={{ display: 'block', fontSize: '16px', color: '#143626', marginTop: '2px' }}>
                  +91 (022) 2890-4100
                </strong>
                <span style={{ fontSize: '12px', color: '#2d6a4f' }}>Available 8:00 AM – 10:00 PM Daily</span>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#fff4eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e76f51', flexShrink: 0 }}>
                <Mail size={22} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#718375', fontWeight: '600' }}>DIRECT EMAIL INQUIRIES</span>
                <strong style={{ display: 'block', fontSize: '16px', color: '#143626', marginTop: '2px' }}>
                  support@foodbridge.org
                </strong>
                <span style={{ fontSize: '12px', color: '#2d6a4f' }}>Typical response time: under 2 hours</span>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0 }}>
                <MapPin size={22} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#718375', fontWeight: '600' }}>CENTRAL LOGISTICS HEADQUARTERS</span>
                <strong style={{ display: 'block', fontSize: '15px', color: '#143626', marginTop: '2px' }}>
                  Bandra Kurla Complex (BKC), Mumbai 400051
                </strong>
                <span style={{ fontSize: '12px', color: '#718375' }}>Secondary Hubs: Delhi NCR, Pune, Bengaluru</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div
            className="card"
            style={{
              padding: '36px',
              borderRadius: '24px',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#143626', marginBottom: '8px' }}>
              Send an Inquiry Message
            </h3>
            <p style={{ fontSize: '14px', color: '#4a5d4e', marginBottom: '24px' }}>
              Complete the form below and an operations coordinator will reply directly to your email.
            </p>

            {success ? (
              <div
                style={{
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#065f46',
                  padding: '24px',
                  borderRadius: '16px',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={44} style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '18px', fontWeight: '700' }}>Message Received!</h4>
                <p style={{ fontSize: '14px', marginTop: '6px', lineHeight: 1.5 }}>
                  Thank you for reaching out to FoodBridge. Our team has received your inquiry and will respond shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '16px' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div
                    style={{
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#dc2626',
                      padding: '12px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      marginBottom: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Your Name / Organization *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="E.g., Priya Deshmukh / Grand Horizon Hotel"
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="priya@example.com"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98200 00000"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject / Purpose *</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                    placeholder="E.g., Commercial Food Donation Partnership"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message Details *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    placeholder="Describe your inquiry, daily surplus volumes, or NGO support request..."
                    className="form-textarea"
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-accent"
                  style={{ width: '100%', padding: '12px' }}
                  disabled={loading}
                >
                  <Send size={16} />
                  {loading ? 'Submitting Message...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
