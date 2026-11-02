import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Building2,
  Truck,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export const HowItWorks = () => {
  const [activeRoleTab, setActiveRoleTab] = useState('donor');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'What types of food can be donated on FoodBridge?',
      a: 'We accept freshly cooked edible meals (curries, rice, breads, gravies), raw groceries, packaged foods with valid expiry dates, bakery items, fruits, vegetables, and sealed beverages. Spoiled, stale, or contaminated food is strictly prohibited.',
    },
    {
      q: 'How does the NGO verification process work?',
      a: 'When an NGO registers, their account is flagged as Pending Verification. The FoodBridge system administrator examines government registration certificates, authorized person identification, and track record before granting verified status. Only verified NGOs can request and claim food.',
    },
    {
      q: 'Who transports the food from donor to the NGO?',
      a: 'Registered community volunteers with vehicles (two-wheelers, cars, vans) receive notifications of accepted donations and claim collection tasks. NGOs can also send their own staff for pickup if convenient.',
    },
    {
      q: 'Are food donors legally protected in good-faith donations?',
      a: 'Yes. Under the FSSAI (Recovery and Distribution of Surplus Food) Regulations, commercial food establishments donating good-faith surplus edible food following standard hygiene guidelines are protected and encouraged to reduce waste.',
    },
    {
      q: 'What happens if a food listing expires before an NGO claims it?',
      a: 'The system automatically tags listings with an expiry countdown timer. If food passes its safe consumption window, it is flagged as Expired and removed from the active catalog to maintain food safety standards.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', paddingBottom: '80px' }}>
      {/* Header */}
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
            Operational Blueprint
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: 1.2, marginTop: '8px', marginBottom: '16px' }}>
            How FoodBridge Works
          </h1>
          <p style={{ fontSize: '18px', color: '#d8f3dc', lineHeight: 1.6 }}>
            A coordinated, transparent workflow ensuring surplus food safely transitions from commercial kitchens to needy communities in record time.
          </p>
        </div>
      </section>

      {/* 5-STEP LIFECYCLE TIMELINE */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#e76f51', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            End-To-End Journey
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#143626', marginTop: '4px' }}>
            The 5 Steps of a Food Donation
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '840px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#e8f5ec', color: '#1b4332', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>
              1
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#143626' }}>Donor Creates Listing (Status: Available)</h3>
              <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.6, marginTop: '4px' }}>
                Restaurant or mess logs in and submits food title, category, quantity, safe-by expiry time, and pickup address. The listing immediately becomes visible to all eligible NGOs.
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#fff4eb', color: '#e76f51', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>
              2
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#143626' }}>Verified NGO Requests Donation (Status: Requested)</h3>
              <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.6, marginTop: '4px' }}>
                A verified NGO reviews the listing and submits a request with distribution intent notes. (Unverified NGOs are prevented from claiming until approved by admin).
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>
              3
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#143626' }}>Donor Confirms Request (Status: Accepted)</h3>
              <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.6, marginTop: '4px' }}>
                The donor receives the NGO request on their dashboard and accepts it, locking the food and making it ready for pickup.
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>
              4
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#143626' }}>Volunteer Assigned & En Route (Status: In Transit)</h3>
              <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.6, marginTop: '4px' }}>
                A volunteer claims the collection task, travels to the kitchen, collects the food in insulated containers, and updates status to In Transit.
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start', borderLeft: '6px solid #059669' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>
              5
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#143626' }}>Verified Delivery & Meals Served (Status: Delivered)</h3>
              <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.6, marginTop: '4px' }}>
                Food arrives at the NGO shelter kitchen. The volunteer submits delivery handover confirmation, marking the donation Completed and adding the meals to the public impact counter!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROLE-SPECIFIC GUIDES */}
      <section style={{ backgroundColor: '#f4f6f0', padding: '64px 0', borderTop: '1px solid #e5eae3', borderBottom: '1px solid #e5eae3' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#143626' }}>
              Your Role in the FoodBridge Ecosystem
            </h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
            <button
              onClick={() => setActiveRoleTab('donor')}
              className={activeRoleTab === 'donor' ? 'btn btn-primary' : 'btn btn-outline'}
            >
              <Utensils size={16} /> For Donors
            </button>
            <button
              onClick={() => setActiveRoleTab('ngo')}
              className={activeRoleTab === 'ngo' ? 'btn btn-accent' : 'btn btn-outline'}
            >
              <Building2 size={16} /> For NGOs
            </button>
            <button
              onClick={() => setActiveRoleTab('volunteer')}
              className={activeRoleTab === 'volunteer' ? 'btn btn-primary' : 'btn btn-outline'}
            >
              <Truck size={16} /> For Volunteers
            </button>
          </div>

          <div className="card" style={{ padding: '36px' }}>
            {activeRoleTab === 'donor' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1b4332', marginBottom: '14px' }}>
                  Food Donor Journey
                </h3>
                <p style={{ fontSize: '15px', color: '#4a5d4e', lineHeight: 1.7, marginBottom: '20px' }}>
                  If you manage a restaurant, college mess, corporate cafeteria, or banquet hall, donating food takes less than two minutes:
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#2d6a4f' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle size={18} color="#1b4332" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Accurate Quantities:</strong> State realistic headcounts or kilograms so NGOs know how many people they can feed.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle size={18} color="#1b4332" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Temperature Control:</strong> Maintain hot cooked items above 60°C or refrigerate perishables below 5°C until pickup.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle size={18} color="#1b4332" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Dedicated Pickup Gate:</strong> Provide clear instructions (e.g. rear kitchen gate, security guard) for seamless handover.</span>
                  </li>
                </ul>
              </div>
            )}

            {activeRoleTab === 'ngo' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#c2410c', marginBottom: '14px' }}>
                  NGO Beneficiary Journey
                </h3>
                <p style={{ fontSize: '15px', color: '#4a5d4e', lineHeight: 1.7, marginBottom: '20px' }}>
                  Registered welfare societies, orphanages, and community shelters can access guaranteed supplies:
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#2d6a4f' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle size={18} color="#e76f51" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Admin Verification:</strong> Ensure your registration ID is submitted during sign-up for quick approval.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle size={18} color="#e76f51" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Location Filters:</strong> Filter available meals by your ward or municipality for fastest pickup.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle size={18} color="#e76f51" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Immediate Distribution:</strong> Consume or distribute cooked food right away upon delivery.</span>
                  </li>
                </ul>
              </div>
            )}

            {activeRoleTab === 'volunteer' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1d4ed8', marginBottom: '14px' }}>
                  Volunteer Transport Journey
                </h3>
                <p style={{ fontSize: '15px', color: '#4a5d4e', lineHeight: 1.7, marginBottom: '20px' }}>
                  Community drivers power our platform logistics and earn verified civic service credits:
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#2d6a4f' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Claim Deliveries:</strong> Browse confirmed tasks ready in your neighborhood and accept on your phone.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Clean Transport:</strong> Use clean bags or transport boxes to protect food during the drive.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Status Updates:</strong> Tap "In Transit" upon pickup and "Delivered" upon handover.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#143626' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '15px', color: '#4a5d4e', marginTop: '6px' }}>
            Everything you need to know about safety, verification, and logistics.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isOpen ? '1.5px solid #2d6a4f' : '1px solid #e5eae3',
                }}
                onClick={() => toggleFaq(idx)}
              >
                <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#143626' }}>
                    {faq.q}
                  </h4>
                  {isOpen ? <ChevronUp size={18} color="#2d6a4f" /> : <ChevronDown size={18} color="#718375" />}
                </div>
                {isOpen && (
                  <div style={{ padding: '0 22px 20px', fontSize: '14px', color: '#4a5d4e', lineHeight: 1.6, borderTop: '1px solid #f0f3ee', paddingTop: '14px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
