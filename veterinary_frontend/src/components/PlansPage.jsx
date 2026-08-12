import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check } from 'lucide-react';
import '../components/LandingPage.css'; // Reuse landing page CSS

export default function PlansPage() {
  const navigate = useNavigate();

  const handleBuyPlan = (planId) => {
    navigate(`/checkout/${planId}`);
  };

  return (
    <div style={{ padding: '2rem 0', backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          
          {/* Plan: Testing */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name" style={{ color: '#f43f5e' }}>Testing Plan</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price">₹1</span>
                <span className="vet-plan-unit">/ test</span>
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} /> Test Razorpay Integration</li>
                <li className="vet-plan-feature-item"><Check size={16} /> Verify live payment flow</li>
                <li className="vet-plan-feature-item"><Check size={16} /> 1 Rupee only</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleBuyPlan('testing')}>
              Pay ₹1 Now
            </button>
          </div>

          {/* Plan 2: Starter */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">Starter</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price">₹599</span>
                <span className="vet-plan-unit">/ month</span>
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} /> Basic clinic management</li>
                <li className="vet-plan-feature-item"><Check size={16} /> Up to 100 pets</li>
                <li className="vet-plan-feature-item"><Check size={16} /> Email reminders</li>
                <li className="vet-plan-feature-item"><Check size={16} /> Standard support</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleBuyPlan('starter')}>
              Get Started
            </button>
          </div>

          {/* Plan 3: Standard (Most Popular) */}
          <div className="vet-price-card featured">
            <div className="vet-popular-badge">Most Popular</div>
            <div>
              <div className="vet-plan-name" style={{ color: '#14b8a6' }}>Standard</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price">₹799</span>
                <span className="vet-plan-unit">/ month</span>
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} /> Complete features for growing clinics</li>
                <li className="vet-plan-feature-item"><Check size={16} /> Up to 500 pets</li>
                <li className="vet-plan-feature-item"><Check size={16} /> WhatsApp + Email reminders</li>
                <li className="vet-plan-feature-item"><Check size={16} /> Priority support</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleBuyPlan('standard')}>
              Get Started
            </button>
          </div>

          {/* Plan 4: Pro */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">Pro</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price">₹1,299</span>
                <span className="vet-plan-unit">/ month</span>
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} /> Advanced features</li>
                <li className="vet-plan-feature-item"><Check size={16} /> Unlimited pets</li>
                <li className="vet-plan-feature-item"><Check size={16} /> Multi-clinic support</li>
                <li className="vet-plan-feature-item"><Check size={16} /> Custom reports</li>
                <li className="vet-plan-feature-item"><Check size={16} /> Dedicated account manager</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleBuyPlan('pro')}>
              Get Started
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
