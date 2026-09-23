import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Star,
  Zap,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  LogOut,
  Stethoscope,
  HeartPulse,
  Clock,
  Users,
  BarChart3,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import './TrialExpired.css';
import Support from './Support';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 999,
    period: 'month',
    badge: null,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    features: [
      'Basic clinic management',
      'Up to 100 active pets',
      'Appointment management & patient records',
      'Email appointment reminders',
      'Standard email support',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 1299,
    period: 'month',
    badge: 'Most Popular',
    color: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    features: [
      'Everything in Starter',
      'Billing & POS invoice creation',
      'Inventory & Pharmacy tracking',
      'Home visit appointments',
      'Priority support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1499,
    period: 'month',
    badge: 'Unlimited',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    features: [
      'Everything in Standard',
      'Hospitalization management module',
      'Custom branding & personal domain',
      '🤖 Kiaan AI Assistant & AI features',
      'Dedicated 24/7 account manager',
    ],
  },
];

const FEATURES_LOCKED = [
  { icon: <HeartPulse size={18} />, label: 'Patient Records' },
  { icon: <Stethoscope size={18} />, label: 'Appointments' },
  { icon: <Users size={18} />, label: 'Staff Management' },
  { icon: <BarChart3 size={18} />, label: 'Reports & Analytics' },
  { icon: <Clock size={18} />, label: 'Shift Management' },
];

export default function TrialExpired({ onLogout }) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [particles, setParticles] = useState([]);
  const [showSupport, setShowSupport] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch (e) { return {}; }
  })();
  const role = user.role || localStorage.getItem('role') || '';
  const isAdmin = role === 'Admin' || role === 'ClinicAdmin';

  // Generate floating particles on mount
  useEffect(() => {
    const pts = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 10,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
    }));
    setParticles(pts);
  }, []);

  const handleBuyPlan = () => {
    navigate(`/checkout/${selectedPlan}`);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <div className="trial-expired-page">
      {/* Animated background particles */}
      <div className="trial-expired-bg">
        {particles.map((p) => (
          <span
            key={p.id}
            className="trial-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="trial-expired-header">
        <div className="trial-expired-logo">
          <img src="/kt-logo.png" alt="PetCare Pro" className="trial-logo-img" />
          <span className="trial-logo-text">PetCare Pro</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAdmin && (
            <button 
              className="trial-support-toggle-btn" 
              onClick={() => setShowSupport(!showSupport)}
              style={{
                background: 'rgba(20, 184, 166, 0.1)',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                color: '#2dd4bf',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              {showSupport ? 'View Subscription Plans' : 'Contact Support'}
            </button>
          )}
          
          <button className="trial-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="trial-expired-content">
        {!isAdmin ? (
          <div style={{
            maxWidth: '640px',
            margin: '3.5rem auto',
            padding: '2.5rem',
            backgroundColor: '#1e293b',
            borderRadius: '20px',
            border: '1px solid #334155',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            textAlign: 'center',
            color: '#f8fafc'
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Lock size={36} />
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.8rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              borderRadius: '999px',
              color: '#f87171',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <AlertTriangle size={14} /> Clinic Subscription Expired
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}>
              Please Contact Your Clinic Admin
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem', maxWidth: '480px', margin: '0 auto 1.75rem auto' }}>
              Your clinic's trial or subscription plan has expired. Access to the dashboard is temporarily suspended. Please contact your Clinic Administrator to renew the subscription.
            </p>

            <div style={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.88rem' }}>
                <span style={{ color: '#64748b' }}>Clinic:</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{user.clinic_name || 'Your Clinic'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.88rem' }}>
                <span style={{ color: '#64748b' }}>Your Account:</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{user.name || user.email} ({role})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: '#64748b' }}>Action Required:</span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>Contact Administrator to Renew</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                padding: '0.75rem 2.25rem',
                backgroundColor: '#334155',
                border: '1px solid #475569',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#475569'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#334155'}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : showSupport ? (
          <div className="trial-expired-support-wrap" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1rem 0' }}>
            <div style={{ 
              backgroundColor: '#1e293b', 
              borderRadius: '16px', 
              color: '#f8fafc', 
              overflow: 'hidden', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1.5rem 2rem'
            }}>
              <Support isDarkTheme={true} />
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div className="trial-hero">
              <div className="trial-lock-icon">
                <Lock size={36} />
              </div>
              <h1 className="trial-hero-title">
                Your <span className="trial-hero-highlight">7-Day Free Trial</span> Has Ended
              </h1>
              <p className="trial-hero-subtitle">
                Choose a plan to regain full access to your veterinary clinic.
                All your patient records and clinic data are safely preserved — simply subscribe to continue right where you left off.
              </p>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/plans')}
                  style={{
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 28px',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(234, 88, 12, 0.4)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                >
                  🚀 Upgrade Plan / Buy Now <ArrowRight size={18} />
                </button>
              </div>

              {/* Locked Features Strip */}
              <div className="trial-locked-strip" style={{ marginTop: '2rem' }}>
                <span className="trial-locked-label">
                  <Lock size={13} /> Locked Features:
                </span>
                {FEATURES_LOCKED.map((f, i) => (
                  <span key={i} className="trial-locked-chip">
                    {f.icon}
                    {f.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Plans Section */}
            <div className="trial-plans-section">
              <h2 className="trial-plans-title">Choose Your Plan</h2>
              <p className="trial-plans-subtitle">No hidden fees. Upgrade or cancel anytime.</p>

              <div className="trial-plans-grid">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      className={`trial-plan-card ${isSelected ? 'trial-plan-card--selected' : ''} ${plan.badge === 'Most Popular' ? 'trial-plan-card--featured' : ''}`}
                      onClick={() => setSelectedPlan(plan.id)}
                      style={{ '--plan-color': plan.color, '--plan-gradient': plan.gradient }}
                    >
                      {plan.badge && (
                        <div
                          className="trial-plan-badge"
                          style={{ background: plan.gradient }}
                        >
                          <Star size={11} fill="currentColor" />
                          {plan.badge}
                        </div>
                      )}

                      <div className="trial-plan-header">
                        <div
                          className="trial-plan-icon"
                          style={{ background: plan.gradient }}
                        >
                          {plan.id === 'starter' && <Shield size={20} />}
                          {plan.id === 'standard' && <Zap size={20} />}
                          {plan.id === 'pro' && <Star size={20} />}
                        </div>
                        <h3 className="trial-plan-name">{plan.name}</h3>
                      </div>

                      <div className="trial-plan-price">
                        <span className="trial-plan-currency">₹</span>
                        <span className="trial-plan-amount">{plan.price.toLocaleString()}</span>
                        <span className="trial-plan-period">/{plan.period}</span>
                      </div>

                      <ul className="trial-plan-features">
                        {plan.features.map((f, i) => (
                          <li key={i}>
                            <CheckCircle2
                              size={15}
                              style={{ color: plan.color, flexShrink: 0 }}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <div className={`trial-plan-select-indicator ${isSelected ? 'active' : ''}`}>
                        {isSelected ? (
                          <>
                            <CheckCircle2 size={16} /> Selected
                          </>
                        ) : (
                          'Select Plan'
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="trial-cta-section">
                <button className="trial-cta-btn" onClick={handleBuyPlan}>
                  Subscribe to {PLANS.find((p) => p.id === selectedPlan)?.name} (₹{PLANS.find((p) => p.id === selectedPlan)?.price.toLocaleString()}/mo)
                  <ArrowRight size={20} />
                </button>
                <p className="trial-cta-note">
                  Secure checkout via Razorpay · 256-bit SSL Encrypted
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="trial-trust-section">
              <div className="trial-trust-card">
                <CheckCircle2 size={22} style={{ color: '#22c55e' }} />
                <div>
                  <strong>Your Data is Safe</strong>
                  <span>All clinic records are preserved</span>
                </div>
              </div>
              <div className="trial-trust-card">
                <Shield size={22} style={{ color: '#3b82f6' }} />
                <div>
                  <strong>Secure Payment</strong>
                  <span>Razorpay powered checkout</span>
                </div>
              </div>
              <div className="trial-trust-card">
                <HeartPulse size={22} style={{ color: '#ef4444' }} />
                <div>
                  <strong>Instant Activation</strong>
                  <span>Immediate access after payment</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="trial-support-section">
              <p>Have questions? Contact our support team:</p>
              <div className="trial-support-links">
                <button 
                  onClick={() => setShowSupport(true)}
                  className="trial-support-chip"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: '#fff', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '999px' }}
                >
                  <Mail size={15} />
                  Open Live Support Chat
                </button>
                <a href="tel:+911234567890" className="trial-support-chip">
                  <Phone size={15} />
                  +91 12345 67890
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
