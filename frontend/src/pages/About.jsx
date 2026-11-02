import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldCheck,
  Award,
  Globe2,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const About = () => {
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
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#f4a261',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '18px',
            }}
          >
            <Sparkles size={14} />
            Our Origins & Purpose
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: 1.2, marginBottom: '16px' }}>
            Bridging Compassion With Intelligent Logistics
          </h1>
          <p style={{ fontSize: '18px', color: '#d8f3dc', lineHeight: 1.6 }}>
            FoodBridge was conceived to tackle the paradox of food waste occurring alongside widespread urban food insecurity across Indian metropolitan clusters.
          </p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="container">
        <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '48px' }}>
          <div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#e76f51', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              The Problem We Solve
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#143626', marginTop: '6px', lineHeight: 1.25 }}>
              40% of Prepared Food is Wasted While Millions Go Hungry
            </h2>
            <p style={{ fontSize: '15px', color: '#4a5d4e', lineHeight: 1.7, marginTop: '16px' }}>
              Commercial catering, university hostels, banquet halls, and restaurants frequently prepare surplus food that is fresh, edible, and hygienic. Unfortunately, due to a lack of immediate coordination channels and logistics, this food is routinely discarded into municipal waste.
            </p>
            <p style={{ fontSize: '15px', color: '#4a5d4e', lineHeight: 1.7, marginTop: '12px' }}>
              Meanwhile, charitable shelter homes, community kitchens, and orphanages operate on tight daily budgets, struggling to provide nutritious meals.
            </p>
            <p style={{ fontSize: '15px', color: '#1b4332', fontWeight: '600', lineHeight: 1.7, marginTop: '12px' }}>
              FoodBridge acts as the secure digital infrastructure bridging these two sides: instantly matching surplus food with verified organizations and activating volunteer couriers.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&auto=format&fit=crop&q=80"
              alt="Community kitchen food support"
              style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}
            />
          </div>
        </div>
      </section>

      {/* CORE PILLARS */}
      <section style={{ backgroundColor: '#f4f6f0', padding: '64px 0', borderTop: '1px solid #e5eae3', borderBottom: '1px solid #e5eae3' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#2d6a4f', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Guiding Principles
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#143626', marginTop: '6px' }}>
              The Three Pillars of FoodBridge
            </h2>
          </div>

          <div className="grid grid-cols-3">
            <div className="card" style={{ padding: '30px' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#e8f5ec', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b4332', marginBottom: '18px' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '8px' }}>1. Strict Verification</h3>
              <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.6 }}>
                Every NGO undergoes an administrative verification protocol before receiving authorization to claim food. This prevents misuse and ensures supplies reach authentic beneficiaries.
              </p>
            </div>

            <div className="card" style={{ padding: '30px' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#fff4eb', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e76f51', marginBottom: '18px' }}>
                <Target size={26} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '8px' }}>2. Rapid Response</h3>
              <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.6 }}>
                Cooked food is perishable. Real-time countdowns, SMS alerts, and volunteer dispatch keep transit times short so meals are distributed while completely fresh.
              </p>
            </div>

            <div className="card" style={{ padding: '30px' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#eff6ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '18px' }}>
                <Globe2 size={26} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '8px' }}>3. SDG Alignment</h3>
              <p style={{ fontSize: '14px', color: '#4a5d4e', lineHeight: 1.6 }}>
                Built in direct harmony with UN Sustainable Development Goals: Goal 2 (Zero Hunger) and Goal 12 (Responsible Consumption and Production).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT CREDITS & ACADEMIC CONTEXT */}
      <section className="container">
        <div
          className="card"
          style={{
            padding: '40px',
            borderRadius: '24px',
            backgroundColor: '#ffffff',
            border: '2px solid #e2e8df',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1b4332', marginBottom: '14px' }}>
            <BookOpen size={24} color="#2d6a4f" />
            <h3 style={{ fontSize: '22px', fontWeight: '800' }}>
              Community Engagement Project (CEP) Initiative
            </h3>
          </div>
          <p style={{ fontSize: '15px', color: '#4a5d4e', lineHeight: 1.7 }}>
            FoodBridge was conceptualized and developed as a collaborative College Community Engagement Project (CEP). It reflects our dedication to utilizing full-stack modern engineering to solve practical socio-economic challenges within our surrounding municipalities.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #edf1ec' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#718375', fontWeight: '700', textTransform: 'uppercase' }}>Scope</span>
              <strong style={{ display: 'block', fontSize: '15px', color: '#143626', marginTop: '2px' }}>
                Social Innovation & Urban Tech
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#718375', fontWeight: '700', textTransform: 'uppercase' }}>Focus Area</span>
              <strong style={{ display: 'block', fontSize: '15px', color: '#143626', marginTop: '2px' }}>
                Surplus Food Redistribution
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#718375', fontWeight: '700', textTransform: 'uppercase' }}>Target Impact</span>
              <strong style={{ display: 'block', fontSize: '15px', color: '#143626', marginTop: '2px' }}>
                Zero Food Waste & Zero Hunger
              </strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
