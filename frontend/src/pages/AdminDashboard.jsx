import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Utensils,
  Building2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  RefreshCw,
  Search,
  Lock,
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ngos'); // 'ngos', 'donations', 'users', 'messages'
  const [actionFeedback, setActionFeedback] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [resOverview, resUsers, resDonations, resMessages] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminUsers(),
        api.getDonations({ status: 'active' }),
        api.getAdminMessages(),
      ]);

      if (resOverview.success) setOverview(resOverview.data);
      if (resUsers.success) setUsers(resUsers.users);
      if (resDonations.success) setDonations(resDonations.donations);
      if (resMessages.success) setMessages(resMessages.messages);
    } catch (err) {
      setActionFeedback({ type: 'error', text: err.message || 'Failed to load administrative console.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleVerification = async (ngoId, currentStatus, ngoName) => {
    try {
      const res = await api.toggleNgoVerification(ngoId, !currentStatus);
      if (res.success) {
        setActionFeedback({
          type: 'success',
          text: !currentStatus
            ? `NGO '${ngoName}' verified successfully! Food donation claiming has been enabled.`
            : `Verification for '${ngoName}' has been revoked.`,
        });
        loadAdminData();
      }
    } catch (err) {
      setActionFeedback({ type: 'error', text: err.message || 'Failed to update verification status.' });
    }
  };

  const handleDeleteListing = async (donationId, foodTitle) => {
    if (!window.confirm(`Are you sure you want to remove the listing "${foodTitle}"?`)) return;
    try {
      const res = await api.deleteDonationAdmin(donationId);
      if (res.success) {
        setActionFeedback({ type: 'success', text: `Listing "${foodTitle}" successfully removed.` });
        loadAdminData();
      }
    } catch (err) {
      setActionFeedback({ type: 'error', text: err.message || 'Failed to delete listing.' });
    }
  };

  const ngosList = users.filter((u) => u.role === 'ngo');
  const donorsList = users.filter((u) => u.role === 'donor');
  const volunteersList = users.filter((u) => u.role === 'volunteer');

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          padding: '32px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #143626 0%, #1b4332 60%, #15803d 100%)',
          color: '#ffffff',
          marginBottom: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#fca5a5', fontWeight: '700', marginBottom: '4px' }}>
            <Lock size={15} />
            PRIVATE ADMINISTRATION CONSOLE • ROLE-PROTECTED
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#ffffff' }}>
            System Oversight & Moderation
          </h1>
          <p style={{ fontSize: '14px', color: '#d8f3dc', marginTop: '4px' }}>
            Logged in as <strong>{user?.name}</strong> ({user?.email}) • Platform Security Protocol Active
          </p>
        </div>

        <button onClick={loadAdminData} className="btn btn-sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Action Notification */}
      {actionFeedback.text && (
        <div
          style={{
            backgroundColor: actionFeedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${actionFeedback.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            color: actionFeedback.type === 'success' ? '#065f46' : '#991b1b',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{actionFeedback.text}</span>
          <button onClick={() => setActionFeedback({ type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>
            &times;
          </button>
        </div>
      )}

      {/* High-Level Overview Metrics */}
      {overview && (
        <div className="grid grid-cols-4" style={{ marginBottom: '36px' }}>
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#718375', fontWeight: '700' }}>TOTAL DONORS</span>
            <span style={{ display: 'block', fontSize: '30px', fontWeight: '800', color: '#1b4332', marginTop: '4px' }}>
              {overview.stats.registeredDonors}
            </span>
          </div>

          <div className="card" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid #e76f51' }}>
            <span style={{ fontSize: '12px', color: '#718375', fontWeight: '700' }}>PENDING NGO VERIFICATIONS</span>
            <span style={{ display: 'block', fontSize: '30px', fontWeight: '800', color: '#e76f51', marginTop: '4px' }}>
              {overview.pendingNgosCount}
            </span>
          </div>

          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#718375', fontWeight: '700' }}>ACTIVE DONATION LISTINGS</span>
            <span style={{ display: 'block', fontSize: '30px', fontWeight: '800', color: '#2d6a4f', marginTop: '4px' }}>
              {overview.stats.activeDonations}
            </span>
          </div>

          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#718375', fontWeight: '700' }}>MEALS DISTRIBUTED</span>
            <span style={{ display: 'block', fontSize: '30px', fontWeight: '800', color: '#059669', marginTop: '4px' }}>
              {overview.stats.totalMealsDistributed.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5eae3', marginBottom: '28px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('ngos')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'ngos' ? '3px solid #1b4332' : '3px solid transparent',
            color: activeTab === 'ngos' ? '#1b4332' : '#718375',
            fontWeight: activeTab === 'ngos' ? '700' : '600',
            fontSize: '15px',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          NGO Verification Management ({ngosList.length})
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'donations' ? '3px solid #1b4332' : '3px solid transparent',
            color: activeTab === 'donations' ? '#1b4332' : '#718375',
            fontWeight: activeTab === 'donations' ? '700' : '600',
            fontSize: '15px',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          Donation Listings & Moderation ({donations.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'users' ? '3px solid #1b4332' : '3px solid transparent',
            color: activeTab === 'users' ? '#1b4332' : '#718375',
            fontWeight: activeTab === 'users' ? '700' : '600',
            fontSize: '15px',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          All Users Directory ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'messages' ? '3px solid #1b4332' : '3px solid transparent',
            color: activeTab === 'messages' ? '#1b4332' : '#718375',
            fontWeight: activeTab === 'messages' ? '700' : '600',
            fontSize: '15px',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          Contact Inquiries ({messages.length})
        </button>
      </div>

      {/* TAB 1: NGO VERIFICATION */}
      {activeTab === 'ngos' && (
        <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#143626' }}>
            Registered NGO Accounts & Verification Control
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5eae3', color: '#4a5d4e' }}>
                <th style={{ padding: '12px 8px' }}>NGO Organization</th>
                <th style={{ padding: '12px 8px' }}>Reg ID</th>
                <th style={{ padding: '12px 8px' }}>Contact Person</th>
                <th style={{ padding: '12px 8px' }}>City</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Admin Verification Action</th>
              </tr>
            </thead>
            <tbody>
              {ngosList.map((ngo) => {
                const verified = ngo.ngoDetails?.isVerified;
                return (
                  <tr key={ngo._id} style={{ borderBottom: '1px solid #f0f3ee' }}>
                    <td style={{ padding: '14px 8px' }}>
                      <strong style={{ color: '#143626' }}>{ngo.name}</strong>
                      <span style={{ display: 'block', fontSize: '12px', color: '#718375' }}>{ngo.email}</span>
                      {ngo.ngoDetails?.mission && (
                        <span style={{ display: 'block', fontSize: '11px', color: '#4a5d4e', fontStyle: 'italic', maxWidth: '320px', marginTop: '2px' }}>
                          "{ngo.ngoDetails.mission}"
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 8px', fontFamily: 'monospace', fontSize: '13px' }}>
                      {ngo.ngoDetails?.registrationNumber || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      {ngo.ngoDetails?.authorizedPerson || ngo.name}
                      <span style={{ display: 'block', fontSize: '12px', color: '#718375' }}>{ngo.phone}</span>
                    </td>
                    <td style={{ padding: '14px 8px' }}>{ngo.city}</td>
                    <td style={{ padding: '14px 8px' }}>
                      {verified ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#047857', fontWeight: '700', backgroundColor: '#ecfdf5', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px' }}>
                          <ShieldCheck size={14} /> Verified
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#b45309', fontWeight: '700', backgroundColor: '#fef3c7', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px' }}>
                          <AlertTriangle size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleVerification(ngo._id, verified, ngo.name)}
                        className={verified ? 'btn btn-outline btn-sm' : 'btn btn-primary btn-sm'}
                      >
                        {verified ? 'Revoke Approval' : 'Verify & Approve'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: DONATION MODERATION */}
      {activeTab === 'donations' && (
        <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#143626' }}>
            Live Donation Inventory & Content Removal
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5eae3', color: '#4a5d4e' }}>
                <th style={{ padding: '12px 8px' }}>Food Title</th>
                <th style={{ padding: '12px 8px' }}>Category & Qty</th>
                <th style={{ padding: '12px 8px' }}>Donor</th>
                <th style={{ padding: '12px 8px' }}>Expiry Time</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Moderation</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid #f0f3ee' }}>
                  <td style={{ padding: '14px 8px' }}>
                    <strong style={{ color: '#143626' }}>{item.foodTitle}</strong>
                    <span style={{ display: 'block', fontSize: '12px', color: '#718375' }}>
                      {item.pickupLocation?.address}, {item.pickupLocation?.city}
                    </span>
                  </td>
                  <td style={{ padding: '14px 8px' }}>
                    {item.quantity} (~{item.servingsCount} Meals)
                    <span style={{ display: 'block', fontSize: '12px', color: '#2d6a4f' }}>{item.category}</span>
                  </td>
                  <td style={{ padding: '14px 8px' }}>
                    {item.donor?.name || 'Partner Donor'}
                  </td>
                  <td style={{ padding: '14px 8px', fontSize: '13px' }}>
                    {new Date(item.expiryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td style={{ padding: '14px 8px' }}>
                    <StatusBadge status={item.status} />
                  </td>
                  <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteListing(item._id, item.foodTitle)}
                      className="btn btn-danger btn-sm"
                      title="Remove inappropriate or expired listing"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: ALL USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#143626' }}>
            Registered Users ({donorsList.length} Donors, {ngosList.length} NGOs, {volunteersList.length} Volunteers)
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5eae3', color: '#4a5d4e' }}>
                <th style={{ padding: '12px 8px' }}>Name / Org</th>
                <th style={{ padding: '12px 8px' }}>Email</th>
                <th style={{ padding: '12px 8px' }}>Role</th>
                <th style={{ padding: '12px 8px' }}>Phone</th>
                <th style={{ padding: '12px 8px' }}>City</th>
                <th style={{ padding: '12px 8px' }}>Registered On</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #f0f3ee' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <strong style={{ color: '#143626' }}>{u.name}</strong>
                  </td>
                  <td style={{ padding: '12px 8px', color: '#4a5d4e' }}>{u.email}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        backgroundColor:
                          u.role === 'admin'
                            ? '#fee2e2'
                            : u.role === 'donor'
                            ? '#e8f5ec'
                            : u.role === 'ngo'
                            ? '#fff7ed'
                            : '#eff6ff',
                        color:
                          u.role === 'admin'
                            ? '#dc2626'
                            : u.role === 'donor'
                            ? '#1b4332'
                            : u.role === 'ngo'
                            ? '#c2410c'
                            : '#1d4ed8',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>{u.phone || 'N/A'}</td>
                  <td style={{ padding: '12px 8px' }}>{u.city || 'Mumbai'}</td>
                  <td style={{ padding: '12px 8px', fontSize: '13px', color: '#718375' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: CONTACT INQUIRIES */}
      {activeTab === 'messages' && (
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#143626' }}>
            Inquiries Submitted via Contact Form
          </h2>

          {messages.length === 0 ? (
            <p style={{ color: '#718375' }}>No messages submitted yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((m) => (
                <div key={m._id} style={{ padding: '18px', borderRadius: '12px', border: '1px solid #e5eae3', backgroundColor: '#fcfbf7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#143626' }}>{m.subject}</h4>
                      <span style={{ fontSize: '13px', color: '#718375' }}>
                        From: <strong>{m.name}</strong> ({m.email}) • Phone: {m.phone || 'N/A'}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#718375' }}>{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.5, marginTop: '8px' }}>
                    "{m.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
