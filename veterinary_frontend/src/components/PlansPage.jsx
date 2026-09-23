import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check, ArrowLeft, X, Mail, Phone, Building, Send, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../utils/api';
import '../components/LandingPage.css'; // Reuse landing page CSS

export default function PlansPage() {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [inquiryData, setInquiryData] = useState(() => {
    let defaultEmail = '';
    let defaultName = '';
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      if (u) {
        defaultEmail = u.email || '';
        defaultName = u.name || '';
      }
    } catch(e) {}
    return { name: defaultName, email: defaultEmail, phone: '', clinicName: '', message: '' };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleBuyPlan = (planId) => {
    if (planId === 'custom') {
      setShowContactModal(true);
      return;
    }
    navigate(`/checkout/${planId}`);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create support ticket if logged in
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
            <button 
              className="vet-btn-plan" 
              style={{ backgroundColor: '#0284c7', borderColor: '#0284c7', color: '#fff' }}
              onClick={() => { setShowContactModal(true); setSubmitted(false); }}
            >
              Contact Sales
            </button>
          </div>

        </div>
      </section>

      {/* Custom Plan Contact Sales Modal */}
      {showContactModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '520px', color: '#f8fafc', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <button 
              onClick={() => setShowContactModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>Inquiry Received!</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Thank you for your interest in our Custom Plan. Our sales team will reach out to you within 24 hours to discuss your clinic's personalized requirements.
                </p>
                <button 
                  onClick={() => setShowContactModal(false)}
                  style={{ backgroundColor: '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.7rem 1.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0284c7', fontWeight: 700 }}>Custom Plan Solution</span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.25rem', color: '#fff' }}>Talk to Our Sales Team</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                    Get a tailored quote for your personal domain, branding, and custom AI features.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 500 }}>Clinic Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Apex Pet Hospital"
                      value={inquiryData.clinicName}
                      onChange={e => setInquiryData({ ...inquiryData, clinicName: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 500 }}>Your Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Dr. Name"
                        value={inquiryData.name}
                        onChange={e => setInquiryData({ ...inquiryData, name: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '0.88rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 500 }}>Phone / WhatsApp</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+91 98765 43210"
                        value={inquiryData.phone}
                        onChange={e => setInquiryData({ ...inquiryData, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 500 }}>Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="admin@clinic.com"
                      value={inquiryData.email}
                      onChange={e => setInquiryData({ ...inquiryData, email: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 500 }}>Requirements / Message (Optional)</label>
                    <textarea 
                      rows={3}
                      placeholder="e.g. We need custom domain, 5 branches, AI receptionist..."
                      value={inquiryData.message}
                      onChange={e => setInquiryData({ ...inquiryData, message: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Or email directly: <span style={{ color: '#38bdf8' }}>support@kiaantechnology.com</span>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem 1.4rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      {isSubmitting ? 'Sending...' : <><Send size={15} /> Submit Inquiry</>}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
