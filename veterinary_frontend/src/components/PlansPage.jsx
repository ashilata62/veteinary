import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check, ArrowLeft } from 'lucide-react';
import '../components/LandingPage.css'; // Reuse landing page CSS

export default function PlansPage() {
  const navigate = useNavigate();

  const handleBuyPlan = (planId) => {
    navigate(`/checkout/${planId}`);
  };

  return (
    <div style={{ padding: '2rem 0', backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>
      <section id="pricing" className="vet-section-container" style={{ width: '100%' }}>
        <div className="vet-section-header">
          <div className="vet-badge" style={{ margin: '0 auto 1rem auto', display: 'inline-flex' }}>
            <CreditCard size={14} /> Pricing Plans
          </div>
          <h2 className="vet-section-title">
            Choose Your <span className="vet-text-gradient">Perfect Plan</span>
          </h2>
          <p className="vet-section-subtitle">
            Flexible pricing options for clinics of all sizes.
          </p>
        </div>

        <div className="vet-pricing-grid" style={{ justifyContent: 'center', marginTop: '3rem' }}>
          {/* Plan 1: 7-Day Free Trial */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">7-Day Free Trial</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price">₹0</span>
                <span className="vet-plan-unit">per week</span>
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> 7 Days full feature trial access</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> Duration: 7 Days</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleBuyPlan('free-trial')}>
              Get Started
            </button>
          </div>

          {/* Plan 2: Starter */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">Starter</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price">₹999</span>
                <span className="vet-plan-unit">per month</span>
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> Essential clinic management features</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> Duration: Monthly</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleBuyPlan('starter')}>
              Get Started
            </button>
          </div>

          {/* Plan 3: Standard (Most Popular) */}
          <div className="vet-price-card featured" style={{ borderColor: '#ea580c' }}>
            <div className="vet-popular-badge" style={{ backgroundColor: '#f43f5e' }}>Most Popular</div>
            <div>
              <div className="vet-plan-name" style={{ color: '#ea580c' }}>Standard</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price" style={{ color: '#ea580c' }}>₹1,299</span>
                <span className="vet-plan-unit">per month</span>
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> Complete features for growing clinics</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> Duration: Monthly</li>
              </ul>
            </div>
            <button className="vet-btn-plan" style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }} onClick={() => handleBuyPlan('standard')}>
              Get Started
            </button>
          </div>

          {/* Plan 4: Pro */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">Pro</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price" style={{ color: '#ea580c' }}>₹1,499</span>
                <span className="vet-plan-unit">per month</span>
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> 🤖 Kiaan AI Assistant & AI Features</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> Advanced features and priority support</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> Duration: Monthly</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleBuyPlan('pro')}>
              Get Started
            </button>
          </div>

          {/* Plan 5: Custom */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">Custom Plan</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price" style={{ color: '#ea580c' }}>Custom</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Tailored to your clinic</p>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> SaaS with customization</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> Personal domain</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> Personal branding</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#ea580c' }} /> 🤖 AI and automation</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleBuyPlan('custom')}>
              Get Started
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
