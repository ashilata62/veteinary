import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  ArrowLeft, 
  CheckCircle, 
  MessageSquare, 
  Globe, 
  Instagram, 
  Facebook, 
  Linkedin, 
  ShieldCheck,
  Calendar,
  FileText,
  CreditCard,
  BellRing,
  Hospital,
  BarChart3
} from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    clinicName: '',
    email: '',
    phone: '',
    inquiryType: 'demo',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        clinicName: '',
        email: '',
        phone: '',
        inquiryType: 'demo',
        message: ''
      });
    }, 700);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#0f172a'
    }}>
      {/* Top Navbar */}
      <nav style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.85rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#334155'
            }}
          >
            <ArrowLeft size={16} /> Home
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/kt-logo.png" alt="PetCare Pro Logo" style={{ height: '32px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>
              PetCare <span style={{ color: '#0d9488' }}>Pro</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '7px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            Clinic Login
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '7px 16px',
              backgroundColor: '#0d9488',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
            }}
          >
            Free Trial
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.25rem 4rem' }}>
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            backgroundColor: '#f0fdfa',
            border: '1px solid #ccfbf1',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#0d9488',
            marginBottom: '1rem'
          }}>
            <MessageSquare size={14} /> Get in Touch With Kiaan Technology
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
            We're Here to Power Your Veterinary Practice
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
            Have questions about our cloud modules, want a 1-on-1 walkthrough for your clinic team, or need priority technical support? Reach out directly to us.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
          marginBottom: '4rem'
        }}>
          {/* Column 1: Contact Information Cards */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Card 1: Office Address */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#f0fdfa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={22} color="#0d9488" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem' }}>
                    Headquarters
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                    <strong>Kiaan Tech Craft Pvt. Ltd.</strong><br />
                    2341, Sector E, Sudama Nagar, Indore, Madhya Pradesh 452009, India
                  </p>
                </div>
              </div>

              {/* Card 2: Phone & WhatsApp */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Phone size={22} color="#16a34a" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem' }}>
                    Direct Calling & WhatsApp
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 0.65rem', lineHeight: '1.5' }}>
                    Call us for sales demos, license activation, and quick inquiries:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                    <a
                      href="tel:+919752100980"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        textDecoration: 'none'
                      }}
                    >
                      <Phone size={14} /> +91 97521 00980
                    </a>
                    <a
                      href="https://wa.me/919752100980?text=Hello%20Kiaan%20Technology%2C%20I%20would%20like%20to%20learn%20more%20about%20PetCare%20Pro%20SaaS."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        backgroundColor: '#dcfce7',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#15803d',
                        textDecoration: 'none'
                      }}
                    >
                      WhatsApp Us
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 3: Email Inquiries */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={22} color="#2563eb" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem' }}>
                    Official Email Addresses
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 0.4rem', lineHeight: '1.5' }}>
                    <strong>General & Sales:</strong>{' '}
                    <a href="mailto:info@kiaantechnology.com" style={{ color: '#0d9488', fontWeight: 600, textDecoration: 'none' }}>
                      info@kiaantechnology.com
                    </a>
                  </p>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                    <strong>Support & Data Requests:</strong>{' '}
                    <a href="mailto:support@kiaantechnology.com" style={{ color: '#0d9488', fontWeight: 600, textDecoration: 'none' }}>
                      support@kiaantechnology.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Card 4: Operating Hours */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#faf5ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Clock size={22} color="#9333ea" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem' }}>
                    Working Hours
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                    <strong>Monday – Saturday:</strong> 9:30 AM to 7:30 PM IST<br />
                    <strong>Sunday:</strong> 24/7 on-call support for emergency hospital partners
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Column 2: Interactive Contact / Demo Request Form */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
              Request Demo or Send Message
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 1.5rem' }}>
              Fill out the details below and an onboarding specialist will connect with you.
            </p>

            {submitted ? (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '14px',
                padding: '2rem 1.5rem',
                textAlign: 'center'
              }}>
                <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#166534', margin: '0 0 0.5rem' }}>
                  Thank you for reaching out!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#15803d', lineHeight: '1.5', margin: '0 0 1.5rem' }}>
                  Your message has been received by our clinic deployment team. We will contact you at your email or WhatsApp number shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    padding: '8px 18px',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Amit Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Clinic / Hospital Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Care & Cure Pet Hospital"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="doctor@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Inquiry Type
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="demo">Book a Live Clinic Demo</option>
                    <option value="pricing">Pricing Plans & Custom Quotes</option>
                    <option value="technical">Technical Support & Data Migration</option>
                    <option value="enterprise">Multi-Branch Hospital Enterprise</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Your Message / Requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your clinic size, current software, or any specific requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: '#0d9488',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                    marginTop: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {submitting ? 'Sending Request...' : (
                    <>
                      <Send size={16} /> Send Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Navigation Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '2.5rem 2rem',
          boxShadow: '0 4px 20px -5px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Clinical Modules */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                Clinical Modules
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li><a href="/smart-appointments" onClick={(e) => { e.preventDefault(); navigate('/smart-appointments'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Smart Appointments & Queue</a></li>
                <li><a href="/electronic-medical-records" onClick={(e) => { e.preventDefault(); navigate('/electronic-medical-records'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Electronic Medical Records (EMR)</a></li>
                <li><a href="/pharmacy-pos-billing" onClick={(e) => { e.preventDefault(); navigate('/pharmacy-pos-billing'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Pharmacy & POS Billing</a></li>
                <li><a href="/automated-whatsapp-alerts" onClick={(e) => { e.preventDefault(); navigate('/automated-whatsapp-alerts'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Automated WhatsApp Alerts</a></li>
                <li><a href="/hospitalization-ipd" onClick={(e) => { e.preventDefault(); navigate('/hospitalization-ipd'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Hospitalization & IPD Ward</a></li>
                <li><a href="/multi-branch-reports" onClick={(e) => { e.preventDefault(); navigate('/multi-branch-reports'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Multi-Branch Reports</a></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                Quick Navigation
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Home</a></li>
                <li><a href="/features" onClick={(e) => { e.preventDefault(); navigate('/features'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Features</a></li>
                <li><a href="/pricing" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Pricing Plans</a></li>
                <li><a href="/benefits" onClick={(e) => { e.preventDefault(); navigate('/benefits'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Benefits</a></li>
                <li><a href="/brochure" onClick={(e) => { e.preventDefault(); navigate('/brochure'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Product Brochure</a></li>
                <li><a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Clinic Admin Login</a></li>
                <li><a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>Start Free Trial</a></li>
              </ul>
            </div>

            {/* Legal & Trust */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                Legal & Compliance
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li><a href="/privacy-policy" onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }} style={{ color: '#0d9488', fontWeight: 600, textDecoration: 'none', fontSize: '0.88rem' }}>Privacy Policy</a></li>
                <li><a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} style={{ color: '#0d9488', fontWeight: 600, textDecoration: 'none', fontSize: '0.88rem' }}>Terms & Conditions</a></li>
              </ul>
              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontSize: '0.82rem', fontWeight: 600 }}>
                <ShieldCheck size={16} /> ISO 27001 Certified & HIPAA Ready
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8' }}>
            &copy; {new Date().getFullYear()} PetCare Pro SaaS by Kiaan Tech Craft Pvt. Ltd. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
}
