import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Star, Zap, CheckCircle2, ArrowRight, Phone, Mail, LogOut } from 'lucide-react';
import './TrialExpired.css';
import Support from './Support';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 999,
    period: 'month',
    badge: null,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    features: [
      'Up to 3 Staff Members',
      'Pet & Owner Management',
      'Appointments (100/month)',
      'Basic Reports',
      'Email Support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1999,
    period: 'month',
    badge: 'Most Popular',
    color: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    features: [
      'Unlimited Staff Members',
      'Complete Patient Records',
      'Unlimited Appointments',
      'Billing & Inventory',
      'Advanced Analytics & Reports',
      'WhatsApp Reminders',
      'Priority Support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999,
    period: 'month',
    badge: 'Best Value',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    features: [
      'Everything in Pro',
      'Multi-Branch Support',
      'Custom Integrations',
      'Dedicated Account Manager',
      'Custom Branding',
      'SLA Guarantee',
      '24/7 Phone Support',
    ],
  },
];

export default function SubscriptionExpired({ onLogout, clinicName, plan, expiryDate }) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [showSupport, setShowSupport] = useState(false);

  const handleBuyPlan = () => {
    navigate(`/checkout/${selectedPlan}`);
  };

  return (
    <div className="trial-expired-page">
      <div className="trial-expired-bg" />
      <header className="trial-expired-header">
        <div className="trial-expired-logo">
          <img src="/kt-logo.png" alt="VetCare Pro" className="trial-logo-img" />
          <span className="trial-logo-text">VetCare Pro</span>
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
                Aapka <span className="trial-hero-highlight">Subscription</span> Khatam Ho Gaya
              </h1>
              <p className="trial-hero-subtitle">
                Aapka plan {expiryDate ? new Date(expiryDate).toLocaleDateString('en-GB') : ' recently'} expire ho gaya hai. 
                Apni clinic ka uninterrupted access wapas paane ke liye plan renew karein.
              </p>
            </div>

            <div className="trial-plans-section">
              <h2 className="trial-plans-title">Apna Plan Renew Karein</h2>
              <p className="trial-plans-subtitle">Koi bhi hidden charges nahi. Cancel karo kisi bhi waqt.</p>

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
                          {planItem.id === 'basic' && <Shield size={20} />}
                          {planItem.id === 'pro' && <Zap size={20} />}
                          {planItem.id === 'enterprise' && <Star size={20} />}
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
                  {PLANS.find((p) => p.id === selectedPlan)?.name} Plan Renew Karein
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
                  <strong>Aapka Data Safe Hai</strong>
                  <span>Saare records preserve hain</span>
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
                  <span>Payment ke baad turant active</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}