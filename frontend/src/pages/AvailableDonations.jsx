import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DonationCard } from '../components/DonationCard';
import { Search, Filter, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const AvailableDonations = () => {
  const { user, isNgo, isAuthenticated } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('');
  const [statusFilter, setStatusFilter] = useState('Available');

  // Request Modal state
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const fetchDonations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getDonations({
        search,
        category: category !== 'All' ? category : undefined,
        city: city || undefined,
        status: statusFilter,
      });
      if (res.success) {
        setDonations(res.donations);
      }
    } catch (err) {
      setError(err.message || 'Failed to load food listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [category, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonations();
  };

  const handleOpenRequest = (donation) => {
    if (!isAuthenticated) {
      alert('Please log in with a verified NGO account to request food donations.');
      return;
    }
    if (!isNgo) {
      alert('Only registered NGOs can request food donations.');
      return;
    }
    if (!user.ngoDetails?.isVerified) {
      alert('Your NGO account is currently PENDING verification by the FoodBridge Administrator. You cannot claim food until verified.');
      return;
    }
    setSelectedDonation(donation);
    setRequestNotes('');
  };

  const handleSubmitRequest = async () => {
    if (!selectedDonation) return;
    setSubmittingRequest(true);
    try {
      const res = await api.requestDonation(selectedDonation._id, requestNotes);
      if (res.success) {
        setSuccessMsg(`Food donation request submitted successfully for "${selectedDonation.foodTitle}"! Donor has been notified.`);
        setSelectedDonation(null);
        fetchDonations();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit donation request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#e76f51', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Real-Time Inventory
        </span>
        <h1 style={{ fontSize: '34px', fontWeight: '800', color: '#143626', marginTop: '4px' }}>
          Available Food Donations
        </h1>
        <p style={{ fontSize: '16px', color: '#4a5d4e', marginTop: '6px' }}>
          Browse surplus food listed by restaurants, messes, and banquet halls ready for collection.
        </p>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065f46', fontWeight: '700' }}>
            &times;
          </button>
        </div>
      )}

      {/* NGO Verification Status Alert for Logged In NGOs */}
      {isNgo && !user.ngoDetails?.isVerified && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#92400e',
            padding: '16px 20px',
            borderRadius: '14px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <Info size={22} style={{ flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
          <div>
            <strong style={{ display: 'block', fontSize: '15px' }}>Account Pending Verification</strong>
            <span style={{ fontSize: '13px', lineHeight: 1.5 }}>
              Your NGO profile ({user.name}) is currently under review by our administrator. You can freely browse available food listings, but requesting food will unlock once your NGO credentials are verified.
            </span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '20px',
          borderRadius: '18px',
          marginBottom: '32px',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          {/* Search Field */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={18} color="#718375" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food title, city, or description..."
              className="form-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>

          {/* Category Dropdown */}
          <div style={{ flex: '0 1 180px' }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              <option value="All">All Categories</option>
              <option value="Cooked Meals">Cooked Meals</option>
              <option value="Bakery & Snacks">Bakery & Snacks</option>
              <option value="Packaged Food">Packaged Food</option>
              <option value="Raw Groceries">Raw Groceries</option>
              <option value="Fruits & Vegetables">Fruits & Veg</option>
              <option value="Dairy & Milk Products">Dairy Products</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* City Input */}
          <div style={{ flex: '0 1 150px' }}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (e.g. Mumbai)"
              className="form-input"
            />
          </div>

          {/* Status Tab */}
          <div style={{ flex: '0 1 150px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="Available">Available Only</option>
              <option value="active">All Active</option>
              <option value="Delivered">Completed / Delivered</option>
            </select>
          </div>

          {/* Action Buttons */}
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
            Search
          </button>

          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategory('All');
              setCity('');
              setStatusFilter('Available');
              fetchDonations();
            }}
            className="btn btn-outline btn-sm"
            title="Reset Filters"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </form>
      </div>

      {/* Donations Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: '42px', height: '42px', border: '3px solid #e2e8e0', borderTopColor: '#2d6a4f', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#4a5d4e', fontWeight: 500 }}>Fetching live surplus food listings...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fef2f2', borderRadius: '16px', color: '#991b1b' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 12px' }} />
          <p>{error}</p>
          <button onClick={fetchDonations} className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>
            Retry
          </button>
        </div>
      ) : donations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8df' }}>
          <Info size={40} color="#718375" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#143626' }}>No Food Listings Found</h3>
          <p style={{ fontSize: '15px', color: '#55695a', maxWidth: '440px', margin: '8px auto 20px' }}>
            There are currently no listings matching your selected search criteria. Try removing filters or checking back shortly!
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setCity('');
              setStatusFilter('Available');
              fetchDonations();
            }}
            className="btn btn-primary"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {donations.map((donation) => (
            <DonationCard
              key={donation._id}
              donation={donation}
              onRequest={handleOpenRequest}
            />
          ))}
        </div>
      )}

      {/* NGO Food Request Modal */}
      {selectedDonation && (
        <div className="modal-overlay" onClick={() => setSelectedDonation(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#143626', marginBottom: '8px' }}>
              Request Food Donation
            </h2>
            <p style={{ fontSize: '14px', color: '#4a5d4e', marginBottom: '20px' }}>
              You are requesting: <strong>{selectedDonation.foodTitle}</strong> ({selectedDonation.quantity})
            </p>

            <div style={{ backgroundColor: '#f4f7f4', padding: '14px', borderRadius: '12px', marginBottom: '18px' }}>
              <div style={{ fontSize: '13px', color: '#2d6a4f', marginBottom: '4px' }}>
                Pickup Address: <strong>{selectedDonation.pickupLocation?.address}, {selectedDonation.pickupLocation?.city}</strong>
              </div>
              <div style={{ fontSize: '13px', color: '#2d6a4f' }}>
                Donor Contact: <strong>{selectedDonation.pickupLocation?.contactPhone}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Distribution Purpose & Pickup Notes (Required):
              </label>
              <textarea
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                placeholder="E.g., We will collect this food by 6:30 PM today to distribute at the Chembur transit camp..."
                className="form-textarea"
                rows={4}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="btn btn-outline"
                disabled={submittingRequest}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitRequest}
                className="btn btn-accent"
                disabled={submittingRequest || !requestNotes.trim()}
              >
                {submittingRequest ? 'Submitting...' : 'Confirm Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
