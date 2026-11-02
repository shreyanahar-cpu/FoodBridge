import React, { useState } from 'react';
import { Clock, MapPin, Users, Building2, Calendar, Phone, Info, AlertTriangle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../context/AuthContext';

export const DonationCard = ({ donation, onRequest, onClaim, onUpdateStatus, onConfirmRequest }) => {
  const { user, isNgo, isDonor, isVolunteer, isAdmin } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  // Expiry calculation
  const expiryDate = new Date(donation.expiryTime);
  const now = new Date();
  const hoursRemaining = Math.round((expiryDate - now) / (1000 * 60 * 60));
  const isUrgent = hoursRemaining > 0 && hoursRemaining <= 4;
  const isExpired = hoursRemaining <= 0;

  return (
    <>
      <div
        className="card card-interactive"
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e5eae3',
        }}
      >
        {/* Card Image Banner */}
        <div style={{ position: 'relative', height: '180px', overflow: 'hidden', backgroundColor: '#f0f4f1' }}>
          <img
            src={donation.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=60'}
            alt={donation.foodTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Top Badges */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                backgroundColor: 'rgba(20, 54, 38, 0.88)',
                color: '#ffffff',
                backdropFilter: 'blur(4px)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: '600',
              }}
            >
              {donation.category}
            </span>

            <StatusBadge status={donation.status} />
          </div>

          {/* Urgent / Expiry Countdown Tag */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '12px',
              backgroundColor: isExpired ? '#ef4444' : isUrgent ? '#ea580c' : 'rgba(0, 0, 0, 0.7)',
              color: '#ffffff',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isExpired ? (
              <>
                <AlertTriangle size={12} />
                Expired
              </>
            ) : (
              <>
                <Clock size={12} />
                {hoursRemaining > 24 ? `${Math.round(hoursRemaining / 24)} days left` : `${hoursRemaining}h to expiry`}
              </>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#143626', lineHeight: 1.3 }}>
            {donation.foodTitle}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: '#4a5d4e' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
              <Users size={14} color="#2d6a4f" />
              {donation.servingsCount} Meals ({donation.quantity})
            </span>
          </div>

          <div style={{ fontSize: '13px', color: '#55695a', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <MapPin size={15} color="#e76f51" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {donation.pickupLocation?.address}, {donation.pickupLocation?.city}
            </span>
          </div>

          {donation.donor?.name && (
            <div style={{ fontSize: '12px', color: '#718375', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Building2 size={13} />
              Donated by: <strong style={{ color: '#2d6a4f' }}>{donation.donor.name}</strong>
            </div>
          )}

          {donation.description && (
            <p style={{ fontSize: '13px', color: '#4b5563', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {donation.description}
            </p>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #f0f3ee', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setShowDetails(true)}
              className="btn btn-outline btn-sm"
              style={{ flex: 1 }}
            >
              <Info size={14} />
              Details
            </button>

            {/* Role-specific quick actions */}
            {isNgo && donation.status === 'Available' && !isExpired && (
              <button
                onClick={() => onRequest && onRequest(donation)}
                className="btn btn-accent btn-sm"
                style={{ flex: 1.2 }}
              >
                Request Food
              </button>
            )}

            {isVolunteer && donation.status === 'Accepted' && (
              <button
                onClick={() => onClaim && onClaim(donation._id)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1.2 }}
              >
                Claim Pickup
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#e76f51', textTransform: 'uppercase' }}>
                  {donation.category}
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#143626', marginTop: '2px' }}>
                  {donation.foodTitle}
                </h2>
              </div>
              <StatusBadge status={donation.status} />
            </div>

            <img
              src={donation.imageUrl}
              alt={donation.foodTitle}
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '14px', marginBottom: '18px' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div style={{ backgroundColor: '#f8faf7', padding: '12px', borderRadius: '10px' }}>
                <span style={{ fontSize: '12px', color: '#718375', display: 'block' }}>Quantity & Servings</span>
                <strong style={{ fontSize: '15px', color: '#1b4332' }}>{donation.quantity} (~{donation.servingsCount} people)</strong>
              </div>
              <div style={{ backgroundColor: '#f8faf7', padding: '12px', borderRadius: '10px' }}>
                <span style={{ fontSize: '12px', color: '#718375', display: 'block' }}>Freshness Expiry</span>
                <strong style={{ fontSize: '14px', color: isExpired ? '#dc2626' : '#2d6a4f' }}>
                  {new Date(donation.expiryTime).toLocaleString()}
                </strong>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px', color: '#143626' }}>Description</h4>
              <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.5 }}>
                {donation.description || 'No detailed instructions provided.'}
              </p>
            </div>

            <div style={{ marginBottom: '20px', backgroundColor: '#fdfbf7', border: '1px solid #f3ece0', borderRadius: '12px', padding: '14px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#143626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#e76f51" />
                Pickup Location & Instructions
              </h4>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#2d6a4f' }}>
                {donation.pickupLocation?.address}, {donation.pickupLocation?.city}
              </p>
              {donation.pickupLocation?.landmark && (
                <p style={{ fontSize: '13px', color: '#718375', marginTop: '2px' }}>
                  Landmark: {donation.pickupLocation.landmark}
                </p>
              )}
              {donation.pickupLocation?.instructions && (
                <p style={{ fontSize: '13px', color: '#4a5d4e', marginTop: '4px', fontStyle: 'italic' }}>
                  Note: "{donation.pickupLocation.instructions}"
                </p>
              )}
              <p style={{ fontSize: '13px', color: '#143626', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="#2d6a4f" />
                Contact: <strong>{donation.pickupLocation?.contactPhone}</strong>
              </p>
            </div>

            {/* Workflow status tracking timeline */}
            {donation.requestedByNgo && (
              <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', fontSize: '13px' }}>
                <strong style={{ color: '#166534' }}>Claimed by NGO: </strong>
                <span>{donation.requestedByNgo.name || 'Verified NGO'}</span>
                {donation.ngoRequestNotes && (
                  <p style={{ marginTop: '4px', color: '#14532d', fontStyle: 'italic' }}>"{donation.ngoRequestNotes}"</p>
                )}
              </div>
            )}

            {donation.assignedVolunteer && (
              <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f5f3ff', borderRadius: '10px', border: '1px solid #ddd6fe', fontSize: '13px' }}>
                <strong style={{ color: '#5b21b6' }}>Assigned Volunteer: </strong>
                <span>{donation.assignedVolunteer.name || 'Volunteer Driver'} ({donation.assignedVolunteer.phone})</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowDetails(false)} className="btn btn-outline btn-sm">
                Close
              </button>

              {isNgo && donation.status === 'Available' && !isExpired && (
                <button
                  onClick={() => {
                    setShowDetails(false);
                    onRequest && onRequest(donation);
                  }}
                  className="btn btn-accent btn-sm"
                >
                  Request Donation
                </button>
              )}

              {isVolunteer && donation.status === 'Accepted' && (
                <button
                  onClick={() => {
                    setShowDetails(false);
                    onClaim && onClaim(donation._id);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Claim Pickup Task
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
