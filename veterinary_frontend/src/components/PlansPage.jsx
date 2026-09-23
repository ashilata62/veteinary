import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Check, ArrowLeft, X, Mail, Phone, Building, Send, 
  CheckCircle2, Sparkles, Shield, Zap, Lock, HelpCircle, ArrowRight, Star,
  Loader2, ShieldCheck, FileText, CheckCircle
} from 'lucide-react';
import { apiFetch } from '../utils/api';

const PLAN_PRICES = {
  starter: {
    id: 'plan-starter',
    name: 'Starter Practice',
    monthlyPrice: 999,
    yearlyPerMonth: 799,
    yearlyTotal: 9588
  },
  standard: {
    id: 'plan-standard',
    name: 'Standard Growth',
    monthlyPrice: 1299,
    yearlyPerMonth: 1039,
    yearlyTotal: 12468
  },
  pro: {
    id: 'plan-pro',
    name: 'Pro Enterprise',
    monthlyPrice: 1499,
    yearlyPerMonth: 1199,
    yearlyTotal: 14388
  }
};

export default function PlansPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [showContactModal, setShowContactModal] = useState(false);
  const [purchasingPlan, setPurchasingPlan] = useState(null); // 'starter' | 'standard' | 'pro' | null
  const [successPayment, setSuccessPayment] = useState(null);
  
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch(e) {
      return {};
    }
  });

  const [inquiryData, setInquiryData] = useState(() => {
    let defaultEmail = currentUser.email || '';
    let defaultName = currentUser.name || '';
    return { name: defaultName, email: defaultEmail, phone: '', clinicName: '', message: '' };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const isYearly = billingCycle === 'yearly';

  const handleBuyPlan = (planKey) => {
    if (planKey === 'custom') {
      setShowContactModal(true);
      return;
    }

    const planConfig = PLAN_PRICES[planKey];
    if (!planConfig) return;

    const totalAmount = isYearly ? planConfig.yearlyTotal : planConfig.monthlyPrice;
    navigate(`/checkout/${planConfig.id}?billing=${billingCycle}&amount=${totalAmount}`);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch('/api/v1/support-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `Custom Plan Inquiry - ${inquiryData.clinicName || inquiryData.name || 'Clinic'}`,
          category: 'Account',
          priority: 'High',
          description: `Custom Plan Request:\nClinic: ${inquiryData.clinicName}\nContact: ${inquiryData.name}\nPhone: ${inquiryData.phone}\nEmail: ${inquiryData.email}\nDetails: ${inquiryData.message || 'Interested in Custom Plan'}`
        })
      });
    } catch (err) {
      console.warn('Could not post ticket, showing local confirmation:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#090d16', 
      minHeight: '100vh', 
      color: '#f8fafc',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      paddingBottom: '5rem'
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Top Navigation */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2.5rem',
        maxWidth: '1360px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            color: '#94a3b8', 
            background: 'rgba(30, 41, 59, 0.6)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '10px',
            padding: '8px 16px',
            cursor: 'pointer', 
            fontSize: '0.88rem', 
            fontWeight: 600,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0d9488'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/kt-logo.png" alt="Logo" style={{ width: '36px', height: 'auto', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            PetCare <span style={{ color: '#2dd4bf' }}>Pro</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '1rem 1.5rem', position: 'relative', zIndex: 1 }}>
        
        {/* Header Title Section */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '1rem auto 3rem auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(20, 184, 166, 0.12)',
            border: '1px solid rgba(45, 212, 191, 0.3)',
            color: '#2dd4bf',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={14} /> Transparent & Flexible Plans
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 0 1rem 0'
          }}>
            Supercharge Your Clinic with the <span style={{
              background: 'linear-gradient(135deg, #2dd4bf 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Right SaaS Plan</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
            Simple, predictable pricing with zero setup fees. Unlock powerful AI diagnostics, billing, inpatient care, and inventory anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '999px',
            padding: '4px',
            marginTop: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                backgroundColor: !isYearly ? '#0d9488' : 'transparent',
                color: !isYearly ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '999px',
                padding: '8px 20px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                backgroundColor: isYearly ? '#0d9488' : 'transparent',
                color: isYearly ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '999px',
                padding: '8px 20px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Annual Billing</span>
              <span style={{
                backgroundColor: '#fbbf24',
                color: '#78350f',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px'
              }}>
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem',
          alignItems: 'stretch'
        }}>

          {/* 1. Starter Plan */}
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '20px',
            padding: '2rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            position: 'relative',
            transition: 'transform 0.2s, border-color 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#374151'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1f2937'; }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Starter Practice
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0' }}>Starter</h3>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>
                  {isYearly ? '₹799' : '₹999'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>/ month</span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Essential practice management for solo practitioners and starting clinics.
              </p>

              <div style={{ borderTop: '1px solid #1f2937', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '0.85rem', letterSpacing: '0.05em' }}>
                  Included Features:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Patient & Pet Medical Records',
                    'In-Clinic Appointments & Scheduling',
                    'Pet Owner Profiles & Contact Directory',
                    'Digital Prescriptions & Treatment Notes',
                    'Staff Accounts & Shift Attendance',
                    'Standard Email Reminders',
                    'Basic Practice Settings & Support'
                  ].map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#e5e7eb', lineHeight: 1.35 }}>
                      <Check size={16} color="#14b8a6" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleBuyPlan('starter')}
              disabled={purchasingPlan !== null}
              style={{
                width: '100%',
                backgroundColor: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
                borderRadius: '12px',
                padding: '13px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: purchasingPlan ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: purchasingPlan && purchasingPlan !== 'starter' ? 0.6 : 1
              }}
              onMouseEnter={(e) => { if (!purchasingPlan) e.currentTarget.style.backgroundColor = '#374151'; }}
              onMouseLeave={(e) => { if (!purchasingPlan) e.currentTarget.style.backgroundColor = '#1f2937'; }}
            >
              {purchasingPlan === 'starter' ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Opening Razorpay...</span>
                </>
              ) : (
                <>
                  <span>Choose Starter ({isYearly ? '₹9,588/yr' : '₹999/mo'})</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* 2. Standard Growth (Featured / Most Popular) */}
          <div style={{
            backgroundColor: '#0f172a',
            border: '2px solid #0d9488',
            borderRadius: '20px',
            padding: '2.5rem 1.85rem 2rem 1.85rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 40px -15px rgba(13, 148, 136, 0.35)',
            position: 'relative',
            transform: 'scale(1.02)',
            zIndex: 2
          }}>
            {/* Most Popular Badge */}
            <div style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
              color: '#ffffff',
              padding: '4px 16px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}>
              <Star size={12} fill="#fff" /> Most Popular Choice
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Growing Clinics
              </div>
              <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0' }}>Standard Growth</h3>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.7rem', fontWeight: 900, color: '#2dd4bf' }}>
                  {isYearly ? '₹1,039' : '₹1,299'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>/ month</span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Complete operations suite for busy veterinary clinics needing POS billing and pharmacy.
              </p>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2dd4bf', textTransform: 'uppercase', marginBottom: '0.85rem', letterSpacing: '0.05em' }}>
                  Everything in Starter, Plus:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Billing, POS & Digital GST Invoicing',
                    'Pharmacy & Drug Inventory Management',
                    'Home Visit Appointments & Field Tracking',
                    'Financial & Revenue Reports & Analytics',
                    'WhatsApp & SMS Automated Reminders',
                    'Up to 5 Doctors & 15 Staff Accounts'
                  ].map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: '#f1f5f9', lineHeight: 1.35, fontWeight: 500 }}>
                      <Check size={16} color="#2dd4bf" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleBuyPlan('standard')}
              disabled={purchasingPlan !== null}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                fontWeight: 800,
                fontSize: '0.98rem',
                cursor: purchasingPlan ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 20px rgba(13, 148, 136, 0.4)',
                transition: 'all 0.2s',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: purchasingPlan && purchasingPlan !== 'standard' ? 0.6 : 1
              }}
              onMouseEnter={(e) => { if (!purchasingPlan) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(13, 148, 136, 0.5)'; } }}
              onMouseLeave={(e) => { if (!purchasingPlan) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(13, 148, 136, 0.4)'; } }}
            >
              {purchasingPlan === 'standard' ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Opening Razorpay...</span>
                </>
              ) : (
                <>
                  <span>Choose Standard ({isYearly ? '₹12,468/yr' : '₹1,299/mo'})</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* 3. Pro Enterprise */}
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '20px',
            padding: '2rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            position: 'relative',
            transition: 'transform 0.2s, border-color 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#0284c7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1f2937'; }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Full Hospital Suite
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0' }}>Pro Enterprise</h3>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>
                  {isYearly ? '₹1,199' : '₹1,499'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>/ month</span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Advanced veterinary hospitals requiring in-depth inpatient management and AI diagnostics.
              </p>

              <div style={{ borderTop: '1px solid #1f2937', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.85rem', letterSpacing: '0.05em' }}>
                  Everything in Standard, Plus:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Hospitalization & Inpatient Cage Tracking',
                    'Audit Logs & Clinical Activity Security',
                    '🤖 AI Diagnostic Assistant & Insights',
                    'Automated Cloud DB Backup & Restore',
                    'Custom Clinic Branding & PDF Prescriptions',
                    'Unlimited Doctors, Staff & 24/7 VIP Support'
                  ].map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#e5e7eb', lineHeight: 1.35 }}>
                      <Check size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleBuyPlan('pro')}
              disabled={purchasingPlan !== null}
              style={{
                width: '100%',
                backgroundColor: '#0284c7',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '13px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: purchasingPlan ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '1rem',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: purchasingPlan && purchasingPlan !== 'pro' ? 0.6 : 1
              }}
              onMouseEnter={(e) => { if (!purchasingPlan) { e.currentTarget.style.backgroundColor = '#0369a1'; } }}
              onMouseLeave={(e) => { if (!purchasingPlan) { e.currentTarget.style.backgroundColor = '#0284c7'; } }}
            >
              {purchasingPlan === 'pro' ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Opening Razorpay...</span>
                </>
              ) : (
                <>
                  <span>Choose Pro ({isYearly ? '₹14,388/yr' : '₹1,499/mo'})</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* 4. Custom Plan */}
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '20px',
            padding: '2rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            position: 'relative',
            transition: 'transform 0.2s, border-color 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#8b5cf6'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1f2937'; }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Multi-Branch & Chains
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0' }}>Custom Enterprise</h3>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#a78bfa' }}>Custom</span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>tailored quote</span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Tailored solutions for veterinary hospital chains with personal domain and lab integrations.
              </p>

              <div style={{ borderTop: '1px solid #1f2937', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', marginBottom: '0.85rem', letterSpacing: '0.05em' }}>
                  Enterprise Capabilities:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Personal Domain (e.g. app.yourclinic.com)',
                    'White-label Brand Customization',
                    'Lab & Imaging Machine Integrations',
                    'Central Multi-branch Management',
                    'Dedicated Cloud Server & 99.9% SLA',
                    'Dedicated Account Manager'
                  ].map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#e5e7eb', lineHeight: 1.35 }}>
                      <Check size={16} color="#a78bfa" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => { setShowContactModal(true); setSubmitted(false); }}
              style={{
                width: '100%',
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                color: '#c4b5fd',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginTop: '1rem'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#8b5cf6'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.15)'; e.currentTarget.style.color = '#c4b5fd'; }}
            >
              Contact Enterprise Sales
            </button>
          </div>

        </div>

        {/* Trust & Guarantee Banner */}
        <div style={{
          marginTop: '4rem',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(20, 184, 166, 0.15)', color: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>Instant Activation</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Pay online and all modules unlock immediately.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>100% Secure Razorpay</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Encrypted payments via UPI, Cards & NetBanking.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>Cancel Anytime</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>No lock-ins. Switch plans or pause whenever needed.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={20} />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#fff' }}>24/7 Dedicated Support</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Always here to help with training and setup.</p>
          </div>
        </div>

      </main>

      {/* Custom Plan Contact Sales Modal */}
      {showContactModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(6px)' }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '520px', color: '#f8fafc', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}>
            <button 
              onClick={() => setShowContactModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={56} color="#2dd4bf" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: '#f8fafc' }}>Inquiry Received!</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Thank you for your interest in our Custom Enterprise Plan. Our technical consulting team will contact you within 24 hours.
                </p>
                <button 
                  onClick={() => setShowContactModal(false)}
                  style={{ backgroundColor: '#0d9488', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.8rem 2rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Back to Plans
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#38bdf8', fontWeight: 800 }}>Custom Enterprise Solution</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem', color: '#fff' }}>Talk to Our Solutions Team</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                    Tell us your requirements for custom domain, white-label branding, and hardware integrations.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Clinic / Hospital Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Apex Pet Hospital"
                      value={inquiryData.clinicName}
                      onChange={e => setInquiryData({ ...inquiryData, clinicName: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem 0.9rem', backgroundColor: '#090d16', border: '1px solid #374151', borderRadius: '10px', color: '#fff', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Doctor / Contact Person</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Dr. Name"
                        value={inquiryData.name}
                        onChange={e => setInquiryData({ ...inquiryData, name: e.target.value })}
                        style={{ width: '100%', padding: '0.7rem 0.9rem', backgroundColor: '#090d16', border: '1px solid #374151', borderRadius: '10px', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Phone / WhatsApp</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+91 98765 43210"
                        value={inquiryData.phone}
                        onChange={e => setInquiryData({ ...inquiryData, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.7rem 0.9rem', backgroundColor: '#090d16', border: '1px solid #374151', borderRadius: '10px', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="admin@clinic.com"
                      value={inquiryData.email}
                      onChange={e => setInquiryData({ ...inquiryData, email: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem 0.9rem', backgroundColor: '#090d16', border: '1px solid #374151', borderRadius: '10px', color: '#fff', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Requirements / Message</label>
                    <textarea 
                      rows={3}
                      placeholder="e.g. Need 5 branches, custom lab integration, dedicated domain..."
                      value={inquiryData.message}
                      onChange={e => setInquiryData({ ...inquiryData, message: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem 0.9rem', backgroundColor: '#090d16', border: '1px solid #374151', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Email: <span style={{ color: '#2dd4bf' }}>info@kiaantechnology.com</span>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      style={{ backgroundColor: '#0d9488', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.75rem 1.6rem', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      {isSubmitting ? 'Submitting...' : <><Send size={15} /> Submit Inquiry</>}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Payment Success Celebratory Modal */}
      {successPayment && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            border: '2px solid #0d9488',
            borderRadius: '24px',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '520px',
            color: '#f8fafc',
            textAlign: 'center',
            boxShadow: '0 25px 60px -15px rgba(13, 148, 136, 0.5)',
            position: 'relative'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)'
            }}>
              <CheckCircle2 size={42} />
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              <Sparkles size={13} /> Payment & Subscription Active!
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
              Welcome to {successPayment.planName}!
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
              Your payment of <strong style={{ color: '#2dd4bf' }}>₹{successPayment.amount.toLocaleString()}</strong> ({successPayment.billingCycle} billing) has been processed securely. All features of this plan have been unlocked for your clinic.
            </p>

            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'left',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Tax Invoice Number:</span>
                <span style={{ fontWeight: 700, color: '#2dd4bf', fontFamily: 'monospace' }}>{successPayment.invoiceNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Payment Method:</span>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>Razorpay (100% Verified)</span>
              </div>
              {successPayment.validTill && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Subscription Valid Until:</span>
                  <span style={{ fontWeight: 600, color: '#38bdf8' }}>{new Date(successPayment.validTill).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setSuccessPayment(null);
                  navigate('/dashboard');
                }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(13, 148, 136, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Go to Clinic Dashboard</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
