import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Star, Zap, CheckCircle2, ArrowRight, Phone, Mail, LogOut } from 'lucide-react';
import './TrialExpired.css';
import Support from './Support';
import { Capacitor } from '@capacitor/core';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 599,
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
    price: 799,
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
    price: 1299,
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
  const [showNativeNotice, setShowNativeNotice] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  const handleBuyPlan = () => {
    if (isNative) {
      setShowNativeNotice(true);
      return;
    }
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
          <button className="trial-logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="trial-expired-content">
        {showSupport ? (
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
                  {isNative ? 'Manage Subscription Plan' : `Renew ${PLANS.find((p) => p.id === selectedPlan)?.name} (₹${PLANS.find((p) => p.id === selectedPlan)?.price.toLocaleString()}/mo)`}
                  <ArrowRight size={20} />
                </button>
                <p className="trial-cta-note">
                  {isNative ? 'Multiplatform SaaS · Manage via Web Portal' : 'Secure checkout via Razorpay · 256-bit SSL Encrypted'}
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
                  <strong>Enterprise Security</strong>
                  <span>{isNative ? 'Cloud Synchronized' : 'Razorpay powered checkout'}</span>
                </div>
              </div>
              <div className="trial-trust-card">
                <Zap size={22} style={{ color: '#f59e0b' }} />
                <div>
                  <strong>Instant Activation</strong>
                  <span>Immediate access after activation</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showNativeNotice && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(6px)' }}>
          <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px', color: '#f8fafc', position: 'relative', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(20, 184, 166, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
              <Shield size={28} color="#14b8a6" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>Clinic Subscription Portal</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              PetCare Pro is an enterprise multiplatform veterinary system. To manage, upgrade, or renew your clinic plan, please access your account via any browser:
            </p>
            <div style={{ background: '#09090b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #27272a', color: '#2dd4bf', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.5rem', wordBreak: 'break-all' }}>
              https://veterinary-saas.kiaantechnology.com
            </div>
            <p style={{ color: '#71717a', fontSize: '0.8rem', margin: '0 0 1.5rem 0' }}>
              All plan renewals sync instantly with this mobile app.
            </p>
            <button 
              onClick={() => setShowNativeNotice(false)}
              style={{ width: '100%', backgroundColor: '#14b8a6', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}