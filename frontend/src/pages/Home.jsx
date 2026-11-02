import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Utensils,
  Building2,
  Truck,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Award,
  Users,
  CheckCircle,
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated, isDonor, isNgo, isVolunteer } = useAuth();
  const [stats, setStats] = useState({
    totalMealsDistributed: 14350,
    registeredNgos: 21,
    registeredDonors: 37,
    availableMeals: 185,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getStats();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        // Fallback to initial stats
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #143626 0%, #1b4332 50%, #2d6a4f 100%)',
          color: '#ffffff',
          paddingTop: '80px',
          paddingBottom: '90px',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(244, 162, 97, 0.18) 0%, rgba(27, 67, 50, 0) 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            {/* Pill Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#f4a261',
                marginBottom: '24px',
              }}
            >
              <Sparkles size={14} />
              Empowering Zero-Waste Communities
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: '800',
                lineHeight: 1.15,
                color: '#ffffff',
                marginBottom: '24px',
                letterSpacing: '-0.02em',
              }}
            >
              Bridging the Gap Between Surplus Food and Empty Plates.
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: 'clamp(16px, 2vw, 19px)',
                lineHeight: 1.6,
                color: '#d1e3d7',
                marginBottom: '36px',
                maxWidth: '680px',
                marginInline: 'auto',
              }}
            >
              FoodBridge connects restaurants, hotels, messes, and packaged-food providers having surplus edible food with verified NGOs and volunteer fleets to feed communities in need.
            </p>

            {/* Prominent Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <Link
                to={isDonor ? '/dashboard/donor' : '/register'}
                className="btn btn-accent btn-lg"
                style={{ minWidth: '180px' }}
              >
                <Utensils size={18} />
                Donate Food
              </Link>

              <Link
                to="/donations"
                className="btn btn-lg"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1b4332',
                  minWidth: '180px',
                }}
              >
                Find Food
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS COUNTER SECTION */}
      <section className="container" style={{ marginTop: '-40px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid #e3e8e1',
            padding: '36px 28px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              textAlign: 'center',
            }}
          >
            <div>
              <span style={{ display: 'block', fontSize: '38px', fontWeight: '800', color: '#1b4332' }}>
                {stats.totalMealsDistributed.toLocaleString()}+
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#4a5d4e' }}>
                Meals Distributed
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: '#718375', marginTop: '4px' }}>
                Verified distribution drives
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '38px', fontWeight: '800', color: '#e76f51' }}>
                {stats.registeredDonors}+
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#4a5d4e' }}>
                Registered Food Donors
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: '#718375', marginTop: '4px' }}>
                Restaurants, hotels, & messes
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '38px', fontWeight: '800', color: '#2d6a4f' }}>
                {stats.registeredNgos}
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#4a5d4e' }}>
                Verified NGOs & Charities
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: '#718375', marginTop: '4px' }}>
                Authorized distribution network
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '38px', fontWeight: '800', color: '#8b5cf6' }}>
                {stats.availableMeals}+
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#4a5d4e' }}>
                Live Available Meals
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: '#718375', marginTop: '4px' }}>
                Ready for immediate pickup
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f0f3ed', fontSize: '12px', color: '#718375' }}>
            Impact statistics reflect verified platform contributions & simulated demo data for presentation purposes.
          </div>
        </div>
      </section>

      {/* HOW FOODBRIDGE WORKS */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#e76f51', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Seamless Workflow
          </span>
          <h2 style={{ fontSize: '34px', fontWeight: '800', color: '#143626', marginTop: '6px' }}>
            How FoodBridge Works
          </h2>
          <p style={{ fontSize: '16px', color: '#4a5d4e', marginTop: '10px' }}>
            From surplus preparation to hungry bellies in four clear, verified steps.
          </p>
        </div>

        <div className="grid grid-cols-4">
          <div className="card" style={{ padding: '28px 24px', position: 'relative' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#e8f5ec',
                color: '#1b4332',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                fontWeight: '800',
                fontSize: '18px',
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>List Surplus Food</h3>
            <p style={{ fontSize: '14px', color: '#55695a', lineHeight: 1.5 }}>
              A food donor lists surplus meals, quantity, prep time, expiry countdown, and pickup location.
            </p>
          </div>

          <div className="card" style={{ padding: '28px 24px', position: 'relative' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fff4eb',
                color: '#e76f51',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                fontWeight: '800',
                fontSize: '18px',
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>NGO Requests & Claims</h3>
            <p style={{ fontSize: '14px', color: '#55695a', lineHeight: 1.5 }}>
              Verified NGOs browse available donations and submit request notes for immediate community delivery.
            </p>
          </div>

          <div className="card" style={{ padding: '28px 24px', position: 'relative' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                fontWeight: '800',
                fontSize: '18px',
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Volunteer Transport</h3>
            <p style={{ fontSize: '14px', color: '#55695a', lineHeight: 1.5 }}>
              Registered volunteers claim pickup tasks, collect hot meals from donors, and drive safely to NGO distribution sites.
            </p>
          </div>

          <div className="card" style={{ padding: '28px 24px', position: 'relative' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#f5f3ff',
                color: '#7c3aed',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                fontWeight: '800',
                fontSize: '18px',
              }}
            >
              4
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Verified Delivery</h3>
            <p style={{ fontSize: '14px', color: '#55695a', lineHeight: 1.5 }}>
              The food is safely received, status is marked Delivered, and real-time impact is recorded on the public ledger.
            </p>
          </div>
        </div>
      </section>

      {/* USER ROLES SHOWCASE CARDS */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#2d6a4f', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Tailored User Experiences
          </span>
          <h2 style={{ fontSize: '34px', fontWeight: '800', color: '#143626', marginTop: '6px' }}>
            A Platform Designed For Every Contributor
          </h2>
        </div>

        <div className="grid grid-cols-3">
          {/* Card 1: Food Donors */}
          <div
            className="card card-interactive"
            style={{
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              borderTop: '4px solid #1b4332',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                backgroundColor: '#e8f5ec',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1b4332',
                marginBottom: '20px',
              }}
            >
              <Utensils size={28} />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>Food Donors</h3>
            <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.6, marginBottom: '20px' }}>
              Designed for restaurants, hotels, wedding caterers, university messes, and packaged food distributors.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#2d6a4f', marginBottom: '28px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#1b4332" /> Create listings in under 60 seconds
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#1b4332" /> Real-time NGO request approvals
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#1b4332" /> Full CSR & tax exemption records
              </li>
            </ul>

            <Link
              to={isDonor ? '/dashboard/donor' : '/register'}
              className="btn btn-outline"
              style={{ marginTop: 'auto', width: '100%' }}
            >
              {isDonor ? 'Go to Donor Dashboard' : 'Register as Donor'}
            </Link>
          </div>

          {/* Card 2: NGOs */}
          <div
            className="card card-interactive"
            style={{
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              borderTop: '4px solid #e76f51',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                backgroundColor: '#fff4eb',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e76f51',
                marginBottom: '20px',
              }}
            >
              <Building2 size={28} />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>Verified NGOs</h3>
            <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.6, marginBottom: '20px' }}>
              Empowering registered charities, shelter homes, and soup kitchens with verified food supplies.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#2d6a4f', marginBottom: '28px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#e76f51" /> Browse nearby edible food listings
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#e76f51" /> Admin verification badge protection
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#e76f51" /> Instant pickup notifications
              </li>
            </ul>

            <Link
              to={isNgo ? '/dashboard/ngo' : '/register'}
              className="btn btn-accent"
              style={{ marginTop: 'auto', width: '100%' }}
            >
              {isNgo ? 'Go to NGO Dashboard' : 'Register as NGO'}
            </Link>
          </div>

          {/* Card 3: Volunteers */}
          <div
            className="card card-interactive"
            style={{
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              borderTop: '4px solid #2d6a4f',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                backgroundColor: '#eff6ff',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
                marginBottom: '20px',
              }}
            >
              <Truck size={28} />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>Volunteers</h3>
            <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.6, marginBottom: '20px' }}>
              The crucial logistics backbone helping transport hot meals from kitchens to distribution points.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#2d6a4f', marginBottom: '28px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#2563eb" /> Claim nearby delivery tasks
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#2563eb" /> Complete route & pickup details
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#2563eb" /> Update delivery status in real-time
              </li>
            </ul>

            <Link
              to={isVolunteer ? '/dashboard/volunteer' : '/register'}
              className="btn btn-outline"
              style={{ marginTop: 'auto', width: '100%' }}
            >
              {isVolunteer ? 'Go to Volunteer Dashboard' : 'Join as Volunteer'}
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION & IMPACT SECTION */}
      <section
        style={{
          backgroundColor: '#f4f6f0',
          borderTop: '1px solid #e2e8df',
          borderBottom: '1px solid #e2e8df',
          padding: '80px 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#e76f51', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Our Mission & Vision
              </span>
              <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#143626', marginTop: '6px', lineHeight: 1.2 }}>
                Tackling India's Dual Challenge: Food Waste & Hunger
              </h2>
              <p style={{ fontSize: '16px', color: '#4a5d4e', lineHeight: 1.7, marginTop: '16px' }}>
                Over 40% of food produced in India is wasted across supply chains and commercial dining, while millions of children and daily wage workers lack guaranteed access to a square meal.
              </p>
              <p style={{ fontSize: '15px', color: '#55695a', lineHeight: 1.7, marginTop: '12px' }}>
                FoodBridge transforms this inefficiency into an opportunity through intelligent, transparent digital coordination. By creating accountability between certified hospitality establishments, verified charities, and altruistic volunteers, we ensure edible food never ends up in a landfill.
              </p>

              <div style={{ display: 'flex', gap: '20px', marginTop: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="#1b4332" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#1b4332' }}>FSSAI Compliant</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={20} color="#e76f51" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#1b4332' }}>SDG-2 & SDG-12 Aligned</span>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&auto=format&fit=crop&q=80"
                alt="Community food distribution"
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'cover',
                  borderRadius: '24px',
                  boxShadow: 'var(--shadow-xl)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '20px',
                  backgroundColor: '#ffffff',
                  padding: '16px 22px',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid #e2e8df',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: '#d8f3dc',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1b4332',
                  }}
                >
                  <HeartHandshake size={22} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '17px', fontWeight: '800', color: '#143626' }}>
                    100% Edible & Fresh
                  </span>
                  <span style={{ fontSize: '12px', color: '#718375' }}>Strict hygiene verification protocol</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
            borderRadius: '28px',
            padding: '60px 32px',
            color: '#ffffff',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#ffffff', marginBottom: '14px' }}>
            Ready to Make an Immediate Difference?
          </h2>
          <p style={{ fontSize: '17px', color: '#d8f3dc', maxWidth: '620px', margin: '0 auto 32px' }}>
            Whether you run a commercial kitchen with extra portions or an NGO feeding urban shelter residents, FoodBridge is ready for you.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-accent btn-lg">
              Create Free Account
            </Link>
            <Link
              to="/donations"
              className="btn btn-lg"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Browse Active Donations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
