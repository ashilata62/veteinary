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
} from 'lucide-react';
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
          
          <button className="trial-logout-btn" onClick={handleLogout}>
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
            {/* Hero Section */}
            <div className="trial-hero">
              <div className="trial-lock-icon">
                <Lock size={36} />
              </div>
              <h1 className="trial-hero-title">
                Aapka <span className="trial-hero-highlight">7-Day Free Trial</span> Khatam Ho Gaya
              </h1>
              <p className="trial-hero-subtitle">
                Apni veterinary clinic ka full access wapas paane ke liye ek plan choose karein.
                Aapka saara data safe hai — bas subscribe karein aur wahan se shuru karein jahan chhoda tha.
              </p>

              {/* Locked Features Strip */}
              <div className="trial-locked-strip">
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
              <h2 className="trial-plans-title">Apna Plan Choose Karein</h2>
              <p className="trial-plans-subtitle">Koi bhi hidden charges nahi. Cancel karo kisi bhi waqt.</p>

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
                          {plan.id === 'basic' && <Shield size={20} />}
                          {plan.id === 'pro' && <Zap size={20} />}
                          {plan.id === 'enterprise' && <Star size={20} />}
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
                  {PLANS.find((p) => p.id === selectedPlan)?.name} Plan Subscribe Karein
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
                <HeartPulse size={22} style={{ color: '#ef4444' }} />
                <div>
                  <strong>Instant Activation</strong>
                  <span>Payment ke baad turant active</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="trial-support-section">
              <p>Koi sawaal hai? Hamse sampark karein:</p>
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
