import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  AlertCircle,
  Building2,
  Navigation,
  FileCheck,
} from 'lucide-react';

export const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Delivery status update modal
  const [updatingTask, setUpdatingTask] = useState(null);
  const [targetStatus, setTargetStatus] = useState('In Transit');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // 1. Available tasks ready to be claimed (status: 'Accepted' and no volunteer assigned yet)
      const resAvailable = await api.getDonations({ status: 'Accepted' });
      if (resAvailable.success) {
        setAvailableTasks(resAvailable.donations.filter((d) => !d.assignedVolunteer));
      }

      // 2. Tasks claimed by this volunteer
      const resMy = await api.getDonations({ volunteerId: user?._id });
      if (resMy.success) {
        setMyTasks(resMy.donations);
      }
    } catch (err) {
      console.error('Error fetching volunteer tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchTasks();
    }
  }, [user?._id]);

  const handleClaimTask = async (donationId) => {
    try {
      const res = await api.claimTask(donationId);
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Task successfully assigned to you! Please review pickup details below.' });
        fetchTasks();
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to claim task.' });
    }
  };

  const handleOpenUpdateModal = (task, newStatus) => {
    setUpdatingTask(task);
    setTargetStatus(newStatus);
    setDeliveryNotes(task.deliveryProofNotes || '');
  };

  const handleConfirmStatusUpdate = async () => {
    if (!updatingTask) return;
    setIsSubmitting(true);
    try {
      const res = await api.updateDeliveryStatus(updatingTask._id, targetStatus, deliveryNotes);
      if (res.success) {
        setStatusMsg({
          type: 'success',
          text: targetStatus === 'Delivered'
            ? 'Food delivery completed! Thank you for reducing hunger today.'
            : 'Donation marked as In Transit. Have a safe drive!',
        });
        setUpdatingTask(null);
        fetchTasks();
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update status.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeMyTasks = myTasks.filter((t) => ['Pickup Scheduled', 'In Transit'].includes(t.status));
  const completedMyTasks = myTasks.filter((t) => t.status === 'Delivered');

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Volunteer Header */}
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
            <Truck size={16} />
            VOLUNTEER FLEET • {user?.volunteerDetails?.vehicleType?.replace('_', ' ').toUpperCase() || 'DELIVERY HERO'}
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#ffffff' }}>
            Welcome, {user?.name}
          </h1>
          <p style={{ fontSize: '14px', color: '#d8f3dc', marginTop: '4px' }}>
            Availability: {user?.volunteerDetails?.availability || 'Flexible'} • City: {user?.city || 'Mumbai'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#d8f3dc' }}>Active Deliveries</span>
            <span style={{ display: 'block', fontSize: '24px', fontWeight: '800' }}>{activeMyTasks.length}</span>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#d8f3dc' }}>Completed Runs</span>
            <span style={{ display: 'block', fontSize: '24px', fontWeight: '800' }}>{completedMyTasks.length}</span>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {statusMsg.text && (
        <div
          style={{
            backgroundColor: statusMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${statusMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            color: statusMsg.type === 'success' ? '#065f46' : '#991b1b',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg({ type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>
            &times;
          </button>
        </div>
      )}

      {/* SECTION 1: MY ACTIVE ASSIGNMENTS */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#143626', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={22} color="#2d6a4f" />
          My Active Delivery Tasks ({activeMyTasks.length})
        </h2>

        {activeMyTasks.length === 0 ? (
          <div style={{ padding: '32px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5eae3', textAlign: 'center' }}>
            <Truck size={36} color="#718375" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '15px', color: '#4a5d4e' }}>You currently have no active pickup tasks assigned.</p>
            <p style={{ fontSize: '13px', color: '#718375', marginTop: '4px' }}>Claim an available collection task below to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {activeMyTasks.map((task) => (
              <div
                key={task._id}
                className="card"
                style={{
                  padding: '24px',
                  borderLeft: `6px solid ${task.status === 'In Transit' ? '#7c3aed' : '#2563eb'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: '1 1 360px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <StatusBadge status={task.status} />
                      <span style={{ fontSize: '12px', color: '#718375' }}>
                        Safe Expiry: {new Date(task.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#143626' }}>
                      {task.foodTitle}
                    </h3>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#2d6a4f', marginTop: '2px' }}>
                      {task.quantity} (~{task.servingsCount} Meals)
                    </p>

                    {/* Step 1: Donor Pickup Location */}
                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 14px', borderRadius: '10px', marginTop: '12px' }}>
                      <strong style={{ fontSize: '13px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={15} color="#166534" /> 1. Pickup From Donor: {task.donor?.name || 'Restaurant'}
                      </strong>
                      <p style={{ fontSize: '13px', color: '#14532d', marginTop: '4px' }}>
                        {task.pickupLocation?.address}, {task.pickupLocation?.city}
                      </p>
                      {task.pickupLocation?.contactPhone && (
                        <p style={{ fontSize: '13px', color: '#166534', marginTop: '2px', fontWeight: '600' }}>
                          Donor Phone: {task.pickupLocation.contactPhone}
                        </p>
                      )}
                      {task.pickupLocation?.instructions && (
                        <p style={{ fontSize: '12px', color: '#15803d', fontStyle: 'italic', marginTop: '4px' }}>
                          Note: "{task.pickupLocation.instructions}"
                        </p>
                      )}
                    </div>

                    {/* Step 2: NGO Beneficiary Drop Location */}
                    <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', padding: '12px 14px', borderRadius: '10px', marginTop: '10px' }}>
                      <strong style={{ fontSize: '13px', color: '#9a3412', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={15} color="#9a3412" /> 2. Deliver To NGO: {task.requestedByNgo?.name || 'NGO Beneficiary'}
                      </strong>
                      <p style={{ fontSize: '13px', color: '#7c2d12', marginTop: '4px' }}>
                        {task.requestedByNgo?.address || 'Community Kitchen Distribution Site'}, {task.requestedByNgo?.city || task.pickupLocation?.city}
                      </p>
                      {task.requestedByNgo?.phone && (
                        <p style={{ fontSize: '13px', color: '#9a3412', marginTop: '2px', fontWeight: '600' }}>
                          NGO Coordinator Phone: {task.requestedByNgo.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Progression Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '200px' }}>
                    {task.status === 'Pickup Scheduled' && (
                      <button
                        onClick={() => handleOpenUpdateModal(task, 'In Transit')}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                      >
                        <Truck size={16} />
                        Mark as Picked Up (In Transit)
                      </button>
                    )}

                    {task.status === 'In Transit' && (
                      <button
                        onClick={() => handleOpenUpdateModal(task, 'Delivered')}
                        className="btn btn-accent"
                        style={{ width: '100%' }}
                      >
                        <CheckCircle2 size={16} />
                        Complete Delivery
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: AVAILABLE TASKS TO CLAIM */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#143626', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={22} color="#e76f51" />
          Available Food Pickups Needing Volunteers ({availableTasks.length})
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8e0', borderTopColor: '#2d6a4f', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }}></div>
            <p style={{ color: '#718375' }}>Scanning for ready pickups...</p>
          </div>
        ) : availableTasks.length === 0 ? (
          <div style={{ padding: '32px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5eae3', textAlign: 'center' }}>
            <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '15px', color: '#4a5d4e' }}>All accepted food donations are currently covered by volunteer drivers!</p>
            <p style={{ fontSize: '13px', color: '#718375', marginTop: '4px' }}>Check back soon as new restaurant donations are confirmed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {availableTasks.map((item) => (
              <div key={item._id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <StatusBadge status={item.status} />
                  <span style={{ fontSize: '12px', color: '#e76f51', fontWeight: '700' }}>
                    {item.category}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#143626' }}>
                  {item.foodTitle}
                </h3>
                <p style={{ fontSize: '13px', color: '#4a5d4e', marginTop: '2px' }}>
                  {item.quantity} (~{item.servingsCount} Meals)
                </p>

                <div style={{ fontSize: '13px', color: '#55695a', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#e76f51" />
                  Pickup: {item.pickupLocation?.address}, {item.pickupLocation?.city}
                </div>

                <div style={{ fontSize: '13px', color: '#2d6a4f', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} />
                  Destined for: <strong>{item.requestedByNgo?.name || 'Verified NGO'}</strong>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f0f3ee' }}>
                  <button
                    onClick={() => handleClaimTask(item._id)}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <Truck size={14} />
                    Volunteer for this Delivery
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UPDATE STATUS MODAL */}
      {updatingTask && (
        <div className="modal-overlay" onClick={() => setUpdatingTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#143626', marginBottom: '8px' }}>
              Update Delivery Status: <span style={{ color: targetStatus === 'Delivered' ? '#059669' : '#7c3aed' }}>{targetStatus}</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#4a5d4e', marginBottom: '20px' }}>
              Updating task for: <strong>{updatingTask.foodTitle}</strong>
            </p>

            <div className="form-group">
              <label className="form-label">
                {targetStatus === 'Delivered' ? 'Delivery Handover Notes & Confirmation' : 'Pickup Notes (Optional)'}
              </label>
              <textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder={
                  targetStatus === 'Delivered'
                    ? 'E.g., Handed over 45 meal packs directly to NGO In-charge Mrs. Sunita at the Dadar kitchen gate...'
                    : 'E.g., Collected all 45 boxes in insulated thermal bag. En route now.'
                }
                className="form-textarea"
                rows={3}
                required={targetStatus === 'Delivered'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setUpdatingTask(null)}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusUpdate}
                className={targetStatus === 'Delivered' ? 'btn btn-accent' : 'btn btn-primary'}
                disabled={isSubmitting || (targetStatus === 'Delivered' && !deliveryNotes.trim())}
              >
                {isSubmitting ? 'Updating...' : `Confirm ${targetStatus}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
