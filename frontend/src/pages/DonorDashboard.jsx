import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  PlusCircle,
  Utensils,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertCircle,
  Building2,
  Calendar,
  Sparkles,
  Phone,
} from 'lucide-react';

export const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'requests', 'completed'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Create Form State
  const [form, setForm] = useState({
    foodTitle: '',
    category: 'Cooked Meals',
    quantity: '',
    servingsCount: 20,
    preparationTime: '',
    expiryTime: '',
    address: user?.address || '',
    city: user?.city || 'Mumbai',
    landmark: '',
    contactPhone: user?.phone || '',
    instructions: '',
    description: '',
    imageUrl: '',
  });

  const fetchMyDonations = async () => {
    setLoading(true);
    try {
      const res = await api.getDonations({ donorId: user?._id });
      if (res.success) {
        setDonations(res.donations);
      }
    } catch (err) {
      console.error('Error fetching donor donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchMyDonations();
    }
  }, [user?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateDonation = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        foodTitle: form.foodTitle,
        category: form.category,
        quantity: form.quantity,
        servingsCount: Number(form.servingsCount) || 10,
        preparationTime: form.preparationTime || new Date().toISOString(),
        expiryTime: form.expiryTime,
        pickupLocation: {
          address: form.address,
          city: form.city,
          landmark: form.landmark,
          contactPhone: form.contactPhone,
          instructions: form.instructions,
        },
        description: form.description,
        imageUrl: form.imageUrl,
      };

      const res = await api.createDonation(payload);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Food donation published successfully!' });
        setShowCreateModal(false);
        // Reset form
        setForm({
          foodTitle: '',
          category: 'Cooked Meals',
          quantity: '',
          servingsCount: 20,
          preparationTime: '',
          expiryTime: '',
          address: user?.address || '',
          city: user?.city || 'Mumbai',
          landmark: '',
          contactPhone: user?.phone || '',
          instructions: '',
          description: '',
          imageUrl: '',
        });
        fetchMyDonations();
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to create donation.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmRequest = async (donationId, action) => {
    try {
      const res = await api.confirmRequest(donationId, action);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: action === 'accept'
            ? 'NGO Request accepted! Pickup arrangements have been initiated.'
            : 'NGO Request declined.',
        });
        fetchMyDonations();
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update request.' });
    }
  };

  const handleDeleteDonation = async (donationId) => {
    if (!window.confirm('Are you sure you want to cancel and remove this donation listing?')) return;
    try {
      const res = await api.deleteDonation(donationId);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Listing removed successfully.' });
        fetchMyDonations();
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to remove listing.' });
    }
  };

  // Groupings
  const activeDonations = donations.filter((d) => ['Available', 'Accepted', 'Pickup Scheduled', 'In Transit'].includes(d.status));
  const pendingRequests = donations.filter((d) => d.status === 'Requested');
  const completedDonations = donations.filter((d) => d.status === 'Delivered');

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header Profile Section */}
      <div
        className="card"
        style={{
          padding: '32px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#f4a261', fontWeight: '700', marginBottom: '4px' }}>
            <Building2 size={16} />
            DONOR PORTAL • {user?.donorDetails?.businessType?.toUpperCase() || 'RESTAURANT'}
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#ffffff' }}>
            {user?.name}
          </h1>
          <p style={{ fontSize: '14px', color: '#d8f3dc', marginTop: '4px' }}>
            {user?.address}, {user?.city} • License: {user?.donorDetails?.fssaiLicense || 'FSSAI-Compliant'}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-accent btn-lg"
          style={{ boxShadow: '0 4px 18px rgba(231, 111, 81, 0.4)' }}
        >
          <PlusCircle size={20} />
          Donate Surplus Food
        </button>
      </div>

      {/* Status Messages */}
      {statusMessage.text && (
        <div
          style={{
            backgroundColor: statusMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${statusMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            color: statusMessage.type === 'success' ? '#065f46' : '#991b1b',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage({ type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>
            &times;
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-4" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: '#718375', fontWeight: '600' }}>Total Listed</span>
          <span style={{ display: 'block', fontSize: '32px', fontWeight: '800', color: '#1b4332', marginTop: '4px' }}>
            {donations.length}
          </span>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: '#718375', fontWeight: '600' }}>NGO Requests Waiting</span>
          <span style={{ display: 'block', fontSize: '32px', fontWeight: '800', color: '#e76f51', marginTop: '4px' }}>
            {pendingRequests.length}
          </span>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: '#718375', fontWeight: '600' }}>Active / In Delivery</span>
          <span style={{ display: 'block', fontSize: '32px', fontWeight: '800', color: '#2d6a4f', marginTop: '4px' }}>
            {activeDonations.length}
          </span>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: '#718375', fontWeight: '600' }}>Completed Deliveries</span>
          <span style={{ display: 'block', fontSize: '32px', fontWeight: '800', color: '#059669', marginTop: '4px' }}>
            {completedDonations.length}
          </span>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e5eae3', marginBottom: '28px' }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'active' ? '3px solid #1b4332' : '3px solid transparent',
            color: activeTab === 'active' ? '#1b4332' : '#718375',
            fontWeight: activeTab === 'active' ? '700' : '600',
            fontSize: '15px',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          Active Listings ({activeDonations.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'requests' ? '3px solid #e76f51' : '3px solid transparent',
            color: activeTab === 'requests' ? '#e76f51' : '#718375',
            fontWeight: activeTab === 'requests' ? '700' : '600',
            fontSize: '15px',
            cursor: 'pointer',
            marginBottom: '-2px',
            position: 'relative',
          }}
        >
          NGO Requests Waiting ({pendingRequests.length})
          {pendingRequests.length > 0 && (
            <span style={{ marginLeft: '6px', backgroundColor: '#e76f51', color: '#fff', fontSize: '11px', padding: '2px 7px', borderRadius: '9999px' }}>
              Action Required
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'completed' ? '3px solid #059669' : '3px solid transparent',
            color: activeTab === 'completed' ? '#059669' : '#718375',
            fontWeight: activeTab === 'completed' ? '700' : '600',
            fontSize: '15px',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          Delivered History ({completedDonations.length})
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: '38px', height: '38px', border: '3px solid #e2e8e0', borderTopColor: '#2d6a4f', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#4a5d4e' }}>Loading your donations...</p>
        </div>
      ) : activeTab === 'requests' ? (
        /* Requests Requiring Donor Approval */
        pendingRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e5eae3' }}>
            <Clock size={40} color="#718375" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>No Pending NGO Requests</h3>
            <p style={{ fontSize: '14px', color: '#718375', marginTop: '6px' }}>
              When a verified NGO requests one of your food listings, it will appear here for your confirmation.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingRequests.map((item) => (
              <div
                key={item._id}
                className="card"
                style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', borderLeft: '6px solid #e76f51' }}
              >
                <div style={{ flex: '1 1 350px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <StatusBadge status={item.status} />
                    <span style={{ fontSize: '13px', color: '#718375' }}>
                      Requested: {new Date(item.requestedAt || item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#143626' }}>
                    {item.foodTitle}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#2d6a4f', fontWeight: '600', marginTop: '4px' }}>
                    Quantity: {item.quantity} (~{item.servingsCount} meals)
                  </div>

                  <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '12px', marginTop: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#9a3412' }}>
                      Requesting NGO: {item.requestedByNgo?.name || 'Verified NGO Partner'}
                    </div>
                    {item.ngoRequestNotes && (
                      <p style={{ fontSize: '13px', color: '#7c2d12', marginTop: '4px', fontStyle: 'italic' }}>
                        "{item.ngoRequestNotes}"
                      </p>
                    )}
                    <div style={{ fontSize: '12px', color: '#9a3412', marginTop: '6px' }}>
                      Contact: {item.requestedByNgo?.phone || 'Provided upon acceptance'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => handleConfirmRequest(item._id, 'accept')}
                    className="btn btn-primary"
                    style={{ padding: '10px 22px' }}
                  >
                    <CheckCircle2 size={16} />
                    Accept Request
                  </button>

                  <button
                    onClick={() => handleConfirmRequest(item._id, 'reject')}
                    className="btn btn-danger btn-sm"
                  >
                    <XCircle size={16} />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'completed' ? (
        /* Completed Donations */
        completedDonations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e5eae3' }}>
            <CheckCircle2 size={40} color="#718375" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>No Completed Donations Yet</h3>
            <p style={{ fontSize: '14px', color: '#718375', marginTop: '6px' }}>
              Once your surplus food is delivered by volunteers to NGOs, verified records will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {completedDonations.map((item) => (
              <div key={item._id} className="card" style={{ padding: '22px', borderLeft: '6px solid #059669' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <StatusBadge status={item.status} />
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#143626', marginTop: '8px' }}>
                      {item.foodTitle}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#4a5d4e' }}>
                      {item.quantity} ({item.servingsCount} Meals) • Distributed to <strong>{item.requestedByNgo?.name || 'NGO Beneficiary'}</strong>
                    </p>
                    {item.deliveryProofNotes && (
                      <p style={{ fontSize: '13px', color: '#047857', backgroundColor: '#ecfdf5', padding: '6px 12px', borderRadius: '6px', marginTop: '8px' }}>
                        Delivery Proof: "{item.deliveryProofNotes}"
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#718375' }}>
                    Delivered on: {new Date(item.deliveredAt || item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Active Listings */
        activeDonations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e5eae3' }}>
            <Utensils size={40} color="#718375" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>No Active Donations</h3>
            <p style={{ fontSize: '14px', color: '#718375', marginTop: '6px', marginBottom: '20px' }}>
              Have extra edible food today? List it now to help someone in need!
            </p>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              <PlusCircle size={16} /> Create Food Donation
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeDonations.map((item) => (
              <div
                key={item._id}
                className="card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <div style={{ flex: '1 1 350px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <StatusBadge status={item.status} />
                    <span style={{ fontSize: '12px', color: '#718375' }}>
                      Expires: {new Date(item.expiryTime).toLocaleString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#143626' }}>
                    {item.foodTitle}
                  </h3>

                  <div style={{ fontSize: '14px', color: '#4a5d4e', marginTop: '4px' }}>
                    {item.quantity} (~{item.servingsCount} Meals) • Category: <strong>{item.category}</strong>
                  </div>

                  <div style={{ fontSize: '13px', color: '#718375', marginTop: '4px' }}>
                    Pickup: {item.pickupLocation?.address}, {item.pickupLocation?.city}
                  </div>

                  {item.assignedVolunteer && (
                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#6d28d9', backgroundColor: '#f5f3ff', padding: '6px 10px', borderRadius: '6px' }}>
                      Driver Assigned: <strong>{item.assignedVolunteer.name}</strong> ({item.assignedVolunteer.phone})
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={() => handleDeleteDonation(item._id)}
                    className="btn btn-danger btn-sm"
                    title="Cancel Listing"
                  >
                    <Trash2 size={14} />
                    Cancel Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* CREATE FOOD DONATION MODAL */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#143626' }}>
                New Surplus Food Donation
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#718375' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateDonation}>
              <div className="form-group">
                <label className="form-label">Food Title / Dish Name *</label>
                <input
                  type="text"
                  name="foodTitle"
                  value={form.foodTitle}
                  onChange={handleInputChange}
                  placeholder="E.g., 40 Boxes of Vegetable Pulao with Dal"
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" value={form.category} onChange={handleInputChange} className="form-select">
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Bakery & Snacks">Bakery & Snacks</option>
                    <option value="Packaged Food">Packaged Food</option>
                    <option value="Raw Groceries">Raw Groceries</option>
                    <option value="Fruits & Vegetables">Fruits & Veg</option>
                    <option value="Dairy & Milk Products">Dairy Products</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity & Package *</label>
                  <input
                    type="text"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleInputChange}
                    placeholder="E.g., 40 foil packs / 15 kg"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Approx Servings (People Fed)</label>
                  <input
                    type="number"
                    name="servingsCount"
                    value={form.servingsCount}
                    onChange={handleInputChange}
                    min={1}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expiry Time / Safe By *</label>
                  <input
                    type="datetime-local"
                    name="expiryTime"
                    value={form.expiryTime}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pickup Address *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  placeholder="Street address, kitchen gate, etc."
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone *</label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Pickup Instructions</label>
                <input
                  type="text"
                  name="instructions"
                  value={form.instructions}
                  onChange={handleInputChange}
                  placeholder="E.g., Inquire with security at rear kitchen dock..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Food Description & Ingredients</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Details on preparation, spice level, vegetarian / non-veg, packaging type..."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Food Image URL (Optional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://... (or leave blank for high quality category image)"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-outline"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent" disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish Food Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
