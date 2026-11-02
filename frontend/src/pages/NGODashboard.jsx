import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  Truck,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const NGODashboard = () => {
  const { user } = useAuth();
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('claimed'); // 'claimed', 'collected'

  const isVerified = user?.ngoDetails?.isVerified;

  const fetchMyClaims = async () => {
    setLoading(true);
    try {
      const res = await api.getDonations({ ngoId: user?._id });
      if (res.success) {
        setMyDonations(res.donations);
      }
    } catch (err) {
      console.error('Error fetching NGO donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchMyClaims();
    }
  }, [user?._id]);

  const activeClaims = myDonations.filter((d) => ['Requested', 'Accepted', 'Pickup Scheduled', 'In Transit'].includes(d.status));
  const completedHistory = myDonations.filter((d) => d.status === 'Delivered');

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* NGO Profile Header */}
      <div
        className="card"
        style={{
          padding: '32px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
          color: '#ffffff',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f4a261', fontWeight: '700', marginBottom: '4px' }}>
            <Building2 size={16} />
            NGO BENEFICIARY PORTAL
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#ffffff' }}>
              {user?.name}
            </h1>
            {isVerified ? (
              <span
                style={{
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={14} /> Verified Partner
              </span>
            ) : (
              <span
                style={{
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Clock size={14} /> Verification Pending
              </span>
            )}
          </div>
          <p style={{ fontSize: '14px', color: '#d8f3dc', marginTop: '6px' }}>
            Reg No: {user?.ngoDetails?.registrationNumber || 'Pending Filing'} • Authorized: {user?.ngoDetails?.authorizedPerson || user?.name}
          </p>
        </div>

        <Link to="/donations" className="btn btn-accent btn-lg">
          Browse Live Food Inventory
        </Link>
      </div>

      {/* Verification Warning Alert if Not Verified */}
      {!isVerified && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            color: '#92400e',
          }}
        >
          <AlertTriangle size={24} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>
              Administrative Verification in Progress
            </h4>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}>
              Welcome to FoodBridge! In compliance with standard food distribution safety protocols, your NGO registration details are currently being reviewed by our platform administrator. While you can view all live food donations, claiming will be activated as soon as your organization is verified.
            </p>
          </div>
        </div>
      )}

      {/* Quick Impact Metrics */}
      <div className="grid grid-cols-3" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: '#718375', fontWeight: '600' }}>Active Claims / Pickups</span>
          <span style={{ display: 'block', fontSize: '32px', fontWeight: '800', color: '#1b4332', marginTop: '4px' }}>
            {activeClaims.length}
          </span>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: '#718375', fontWeight: '600' }}>Total Delivered Donations</span>
          <span style={{ display: 'block', fontSize: '32px', fontWeight: '800', color: '#059669', marginTop: '4px' }}>
            {completedHistory.length}
          </span>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: '#718375', fontWeight: '600' }}>Account Status</span>
          <span style={{ display: 'block', fontSize: '20px', fontWeight: '800', color: isVerified ? '#15803d' : '#d97706', marginTop: '10px' }}>
            {isVerified ? 'Verified & Active' : 'Pending Verification'}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5eae3', marginBottom: '28px' }}>
        <button
          onClick={() => setActiveTab('claimed')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'claimed' ? '3px solid #1b4332' : '3px solid transparent',
            color: activeTab === 'claimed' ? '#1b4332' : '#718375',
            fontWeight: activeTab === 'claimed' ? '700' : '600',
            fontSize: '15px',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          Active Food Requests & Pickups ({activeClaims.length})
        </button>

        <button
          onClick={() => setActiveTab('collected')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'collected' ? '3px solid #059669' : '3px solid transparent',
            color: activeTab === 'collected' ? '#059669' : '#718375',
            fontWeight: activeTab === 'collected' ? '700' : '600',
            fontSize: '15px',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          Collected & Distributed History ({completedHistory.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: '38px', height: '38px', border: '3px solid #e2e8e0', borderTopColor: '#2d6a4f', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#4a5d4e' }}>Loading your donation claims...</p>
        </div>
      ) : activeTab === 'claimed' ? (
        activeClaims.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e5eae3' }}>
            <Building2 size={40} color="#718375" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>No Active Food Requests</h3>
            <p style={{ fontSize: '14px', color: '#718375', marginTop: '6px', marginBottom: '20px' }}>
              Browse the live catalogue and request surplus food from nearby restaurants and caterers.
            </p>
            <Link to="/donations" className="btn btn-primary">
              Find Food Listings
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activeClaims.map((item) => (
              <div key={item._id} className="card" style={{ padding: '24px', borderLeft: '6px solid #2d6a4f' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ flex: '1 1 340px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <StatusBadge status={item.status} />
                      <span style={{ fontSize: '12px', color: '#718375' }}>
                        Requested: {new Date(item.requestedAt || item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#143626' }}>
                      {item.foodTitle}
                    </h3>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d6a4f', marginTop: '4px' }}>
                      {item.quantity} (~{item.servingsCount} Meals) • Category: {item.category}
                    </div>

                    <div style={{ backgroundColor: '#fdfbf7', border: '1px solid #f2ece0', padding: '14px', borderRadius: '12px', marginTop: '14px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#143626', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <MapPin size={16} color="#e76f51" /> Pickup Location
                      </div>
                      <p style={{ fontSize: '14px', color: '#4a5d4e' }}>
                        {item.pickupLocation?.address}, {item.pickupLocation?.city}
                      </p>
                      {item.pickupLocation?.contactPhone && (
                        <p style={{ fontSize: '13px', color: '#1b4332', fontWeight: '600', marginTop: '4px' }}>
                          Donor Phone: {item.pickupLocation.contactPhone}
                        </p>
                      )}
                      {item.pickupLocation?.instructions && (
                        <p style={{ fontSize: '12px', color: '#718375', fontStyle: 'italic', marginTop: '4px' }}>
                          Note: "{item.pickupLocation.instructions}"
                        </p>
                      )}
                    </div>

                    {item.assignedVolunteer && (
                      <div style={{ marginTop: '12px', backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', color: '#5b21b6' }}>
                        Volunteer Transport Assigned: <strong>{item.assignedVolunteer.name}</strong> ({item.assignedVolunteer.phone})
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: '#718375', display: 'block' }}>Freshness Expiry</span>
                    <strong style={{ fontSize: '14px', color: '#dc2626' }}>
                      {new Date(item.expiryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Completed History */
        completedHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e5eae3' }}>
            <CheckCircle size={40} color="#718375" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>No Completed Distributions Yet</h3>
            <p style={{ fontSize: '14px', color: '#718375', marginTop: '6px' }}>
              Completed donations collected and distributed to your beneficiaries will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {completedHistory.map((item) => (
              <div key={item._id} className="card" style={{ padding: '22px', borderLeft: '6px solid #059669' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <StatusBadge status={item.status} />
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#143626', marginTop: '6px' }}>
                      {item.foodTitle}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#4a5d4e' }}>
                      {item.quantity} ({item.servingsCount} Meals) • Donated by <strong>{item.donor?.name || 'Partner Donor'}</strong>
                    </p>
                    {item.deliveryProofNotes && (
                      <p style={{ fontSize: '13px', color: '#047857', backgroundColor: '#ecfdf5', padding: '6px 12px', borderRadius: '6px', marginTop: '8px' }}>
                        Delivery Proof: "{item.deliveryProofNotes}"
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#718375' }}>
                    Received on: {new Date(item.deliveredAt || item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
