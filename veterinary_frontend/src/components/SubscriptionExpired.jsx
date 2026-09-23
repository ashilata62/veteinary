import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Star, Zap, CheckCircle2, ArrowRight, Phone, Mail, LogOut, Lock, AlertTriangle } from 'lucide-react';
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
      'Email appointment reminders',
      'Billing & POS invoice creation',
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
      'Complete features for growing clinics',
      'Up to 500 active pets',
      'WhatsApp + Email reminders',
      'Inventory & Pharmacy tracking',
      'Priority 24/7 support',
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
      'Advanced multi-clinic management',
      'Unlimited active pet records',
      'Custom reports & financial analytics',
      'WhatsApp, SMS & Email alerts',
      'Dedicated account manager',
    ],
  },
];

export default function SubscriptionExpired({ onLogout, clinicName, plan, expiryDate }) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [showSupport, setShowSupport] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch (e) { return {}; }
  })();
  const role = user.role || localStorage.getItem('role') || '';
  const isAdmin = role === 'Admin' || role === 'ClinicAdmin';

  const handleBuyPlan = () => {
    navigate(`/checkout/${selectedPlan}`);
  };

  return (
    <div className="trial-expired-page">
      <div className="trial-expired-bg" />
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
          <button className="trial-logout-btn" onClick={onLogout}>
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
              Please Contact Your Clinic Administrator
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem', maxWidth: '480px', margin: '0 auto 1.75rem auto' }}>
              Your clinic's subscription plan has expired. Access to the dashboard is temporarily suspended. Please contact your Clinic Administrator to renew the subscription.
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
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{clinicName || user.clinic_name || 'Your Clinic'}</span>
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
              onClick={onLogout}
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
              backgroundColor: '#1E293B', 
              borderRadius: '16px', 
              color: '#f8fafc', 
              overflow: 'hidden', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <Support />
            </div>
          </div>
        ) : (
          <>
            <div className="trial-hero">
              <div className="trial-lock-icon">
                <Shield size={36} />
              </div>
              <h1 className="trial-hero-title">
                Your <span className="trial-hero-highlight">Subscription</span> Has Expired
              </h1>
              <p className="trial-hero-subtitle">
                Your subscription expired on {expiryDate ? new Date(expiryDate).toLocaleDateString('en-GB') : 'recently'}. 
                Renew your subscription to restore uninterrupted access to your clinic.
              </p>
            </div>

            <div className="trial-plans-section">
              <h2 className="trial-plans-title">Renew Your Plan</h2>
              <p className="trial-plans-subtitle">No hidden fees. Upgrade, downgrade or cancel anytime.</p>

              <div className="trial-plans-grid">
                {PLANS.map((planItem) => {
                  const isSelected = selectedPlan === planItem.id;
                  return (
                    <div
                      key={planItem.id}
                      className={`trial-plan-card ${isSelected ? 'trial-plan-card--selected' : ''} ${planItem.badge === 'Most Popular' ? 'trial-plan-card--featured' : ''}`}
                      onClick={() => setSelectedPlan(planItem.id)}
                      style={{ '--plan-color': planItem.color, '--plan-gradient': planItem.gradient }}
                    >
                      {planItem.badge && (
                        <div className="trial-plan-badge" style={{ background: planItem.gradient }}>
                          <Star size={11} fill="currentColor" />
                          {planItem.badge}
                        </div>
                      )}

                      <div className="trial-plan-header">
                        <div className="trial-plan-icon" style={{ background: planItem.gradient }}>
                          {planItem.id === 'starter' && <Shield size={20} />}
                          {planItem.id === 'standard' && <Zap size={20} />}
                          {planItem.id === 'pro' && <Star size={20} />}
                        </div>
                        <h3 className="trial-plan-name">{planItem.name}</h3>
                      </div>

                      <div className="trial-plan-price">
                        <span className="trial-plan-currency">₹</span>
                        <span className="trial-plan-amount">{planItem.price.toLocaleString()}</span>
                        <span className="trial-plan-period">/{planItem.period}</span>
                      </div>

                      <ul className="trial-plan-features">
                        {planItem.features.map((f, i) => (
                          <li key={i}>
                            <CheckCircle2 size={15} style={{ color: planItem.color, flexShrink: 0 }} />
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

              <div className="trial-cta-section">
                <button className="trial-cta-btn" onClick={handleBuyPlan}>
                  Renew {PLANS.find((p) => p.id === selectedPlan)?.name} (₹{PLANS.find((p) => p.id === selectedPlan)?.price.toLocaleString()}/mo)
                  <ArrowRight size={20} />
                </button>
                <p className="trial-cta-note">
                  Secure checkout via Razorpay · 256-bit SSL Encrypted
                </p>
              </div>
            </div>

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
                <Zap size={22} style={{ color: '#f59e0b' }} />
                <div>
                  <strong>Instant Activation</strong>
                  <span>Immediate access after payment</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}