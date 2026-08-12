import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PawPrint,
  CheckCircle,
  Zap,
  Award,
  Calendar,
  FileHeart,
  CreditCard,
  BarChart3,
  Package,
  BellRing,
  Check,
  Star,
  ArrowRight,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  ShieldCheck
} from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminLogin = () => {
    navigate('/login');
  };

  const handleRegister = (planKey = 'free-trial') => {
    navigate(`/register?plan=${planKey}`);
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="vet-landing">
      {/* 1. NAVIGATION BAR (Sticky Top) */}
      <header className="vet-landing-header">
        <div className="vet-header-container">
          {/* Logo */}
          <div className="vet-brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/kt-logo.png" alt="Kiaan Technology Logo" style={{ height: '36px', objectFit: 'contain', cursor: 'pointer' }} />
            <span>VetCare <span className="vet-brand-highlight">Pro</span></span>
          </div>

          {/* Center Links (Desktop) */}
          <ul className="vet-nav-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
            <li><a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }}>Benefits</a></li>
            <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Testimonials</a></li>
            <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
          </ul>

          {/* Right Actions */}
          <div className="vet-header-actions">
            <button className="vet-btn-outline" onClick={handleAdminLogin}>
              Admin Login
            </button>
            <button className="vet-btn-primary" onClick={() => handleRegister('free-trial')}>
              Start Free Trial
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button className="vet-mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="vet-drawer-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className={`vet-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="vet-brand-logo">
            <img src="/kt-logo.png" alt="Kiaan Technology Logo" style={{ height: '32px', objectFit: 'contain' }} />
            <span>VetCare <span className="vet-brand-highlight">Pro</span></span>
          </div>
          <button className="vet-mobile-toggle" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} style={{ color: '#e5e7eb', fontSize: '1.1rem', textDecoration: 'none' }}>Home</a></li>
          <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} style={{ color: '#e5e7eb', fontSize: '1.1rem', textDecoration: 'none' }}>Features</a></li>
          <li><a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }} style={{ color: '#e5e7eb', fontSize: '1.1rem', textDecoration: 'none' }}>Benefits</a></li>
          <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }} style={{ color: '#e5e7eb', fontSize: '1.1rem', textDecoration: 'none' }}>Testimonials</a></li>
          <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} style={{ color: '#e5e7eb', fontSize: '1.1rem', textDecoration: 'none' }}>Pricing</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} style={{ color: '#e5e7eb', fontSize: '1.1rem', textDecoration: 'none' }}>Contact</a></li>
        </ul>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
          <button className="vet-btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAdminLogin}>
            Admin Login
          </button>
          <button className="vet-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleRegister('free-trial')}>
            Start Free Trial
          </button>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section id="home" className="vet-section-container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="vet-hero-grid">
          <div className="vet-hero-content">
            <div className="vet-badge">
              <Award size={15} /> #1 Veterinary Clinic Management Software
            </div>

            <h1 className="vet-hero-title">
              Transform Your <br />
              <span className="vet-text-gradient">Veterinary Practice</span>
            </h1>

            <p className="vet-hero-subtitle">
              The all-in-one solution for modern veterinary clinics and pet hospitals. Streamline appointments, manage pet records, automate billing, and grow your clinic with our powerful practice management system.
            </p>

            <div className="vet-hero-actions">
              <button className="vet-btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }} onClick={() => handleRegister('free-trial')}>
                Start 7-Day Free Trial <ArrowRight size={18} />
              </button>
              <button className="vet-btn-outline" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }} onClick={() => scrollToSection('pricing')}>
                View Pricing Plans
              </button>
            </div>

            {/* Stats Row */}
            <div className="vet-hero-stats">
              <div className="vet-stat-item">
                <div className="vet-stat-value">500+</div>
                <div className="vet-stat-label">Happy Clinics</div>
              </div>
              <div className="vet-stat-item">
                <div className="vet-stat-value">50K+</div>
                <div className="vet-stat-label">Pets Treated</div>
              </div>
              <div className="vet-stat-item">
                <div className="vet-stat-value">99.9%</div>
                <div className="vet-stat-label">Uptime</div>
              </div>
              <div className="vet-stat-item">
                <div className="vet-stat-value">24/7</div>
                <div className="vet-stat-label">Support</div>
              </div>
            </div>
          </div>

          <div className="vet-hero-visual">
            <img
              src="/hero-vet.png"
              alt="Veterinary Doctor with Pet in Modern Clinic"
              className="vet-hero-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1200&q=80';
              }}
            />
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="vet-section-container">
        <div className="vet-section-header">
          <div className="vet-badge"><Zap size={14} /> Features</div>
          <h2 className="vet-section-title">
            Everything You Need to <span className="vet-text-gradient">Manage Your Clinic</span>
          </h2>
          <p className="vet-section-subtitle">
            Comprehensive tools designed specifically for veterinary practices.
          </p>
        </div>

        <div className="vet-features-grid">
          {/* Card 1 */}
          <div className="vet-feature-card">
            <div className="vet-feature-icon-wrapper">
              <Calendar size={26} />
            </div>
            <h3 className="vet-feature-title">Smart Appointments</h3>
            <p className="vet-feature-desc">
              Manage clinic appointments, home visits, vaccination schedules with automated reminders for pet owners.
            </p>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="vet-feature-link">
              Learn more <ChevronRight size={16} />
            </a>
          </div>

          {/* Card 2 */}
          <div className="vet-feature-card">
            <div className="vet-feature-icon-wrapper">
              <FileHeart size={26} />
            </div>
            <h3 className="vet-feature-title">Pet Medical Records</h3>
            <p className="vet-feature-desc">
              Detailed health records, treatment history, vaccination logs with easy search and instant PDF exports.
            </p>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="vet-feature-link">
              Learn more <ChevronRight size={16} />
            </a>
          </div>

          {/* Card 3 */}
          <div className="vet-feature-card">
            <div className="vet-feature-icon-wrapper">
              <CreditCard size={26} />
            </div>
            <h3 className="vet-feature-title">Billing & POS</h3>
            <p className="vet-feature-desc">
              Automated billing, multiple payment methods (UPI, Card, Cash), and GST-compliant receipts.
            </p>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="vet-feature-link">
              Learn more <ChevronRight size={16} />
            </a>
          </div>

          {/* Card 4 */}
          <div className="vet-feature-card">
            <div className="vet-feature-icon-wrapper">
              <BarChart3 size={26} />
            </div>
            <h3 className="vet-feature-title">Reports & Analytics</h3>
            <p className="vet-feature-desc">
              Revenue tracking, pet visit trends, staff performance metrics, and inventory consumption analytics.
            </p>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="vet-feature-link">
              Learn more <ChevronRight size={16} />
            </a>
          </div>

          {/* Card 5 */}
          <div className="vet-feature-card">
            <div className="vet-feature-icon-wrapper">
              <Package size={26} />
            </div>
            <h3 className="vet-feature-title">Inventory Management</h3>
            <p className="vet-feature-desc">
              Stock control for medicines, vaccines, pet food with automated low-stock alerts and batch tracking.
            </p>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="vet-feature-link">
              Learn more <ChevronRight size={16} />
            </a>
          </div>

          {/* Card 6 */}
          <div className="vet-feature-card">
            <div className="vet-feature-icon-wrapper">
              <BellRing size={26} />
            </div>
            <h3 className="vet-feature-title">Email & SMS Reminders</h3>
            <p className="vet-feature-desc">
              Automated appointment reminders, vaccination due alerts, and follow-up notifications.
            </p>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="vet-feature-link">
              Learn more <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US / BENEFITS SECTION */}
      <section id="benefits" className="vet-section-container">
        <div className="vet-why-grid">
          <div className="vet-why-left">
            <div className="vet-badge"><ShieldCheck size={14} /> Why Choose Us</div>
            <h2 className="vet-section-title">
              Why <span className="vet-text-gradient">VetCare Pro</span> Stands Out
            </h2>
            <p className="vet-section-subtitle">
              Designed to help you save time, increase revenue, and provide exceptional care.
            </p>

            <ul className="vet-why-checklist">
              <li className="vet-why-item">
                <span className="vet-check-icon">✓</span>
                Increase clinic efficiency by up to 40%
              </li>
              <li className="vet-why-item">
                <span className="vet-check-icon">✓</span>
                Save 15+ hours per week on administrative tasks
              </li>
              <li className="vet-why-item">
                <span className="vet-check-icon">✓</span>
                Reduce no-shows with automated reminders
              </li>
              <li className="vet-why-item">
                <span className="vet-check-icon">✓</span>
                Boost revenue with streamlined billing and POS
              </li>
              <li className="vet-why-item">
                <span className="vet-check-icon">✓</span>
                Enhance pet owner experience with digital records
              </li>
              <li className="vet-why-item">
                <span className="vet-check-icon">✓</span>
                Make data-driven decisions with real-time analytics
              </li>
            </ul>

            <button className="vet-btn-primary" onClick={() => handleRegister('free-trial')}>
              See All Benefits <ArrowRight size={18} />
            </button>
          </div>

          <div className="vet-why-right">
            <div className="vet-metrics-row">
              <div className="vet-metric-card">
                <div className="vet-metric-val vet-text-teal">40%</div>
                <div className="vet-metric-lbl">Faster Check-ins</div>
              </div>
              <div className="vet-metric-card">
                <div className="vet-metric-val vet-text-teal">15+</div>
                <div className="vet-metric-lbl">Hours Saved Weekly</div>
              </div>
              <div className="vet-metric-card">
                <div className="vet-metric-val vet-text-teal">99.9%</div>
                <div className="vet-metric-lbl">System Uptime</div>
              </div>
            </div>

            <div className="vet-quote-card">
              <p className="vet-quote-text">
                "VetCare Pro transformed how we run our clinic! Automated vaccination reminders and instant digital billing increased our repeat client visits by 40%."
              </p>
              <div className="vet-quote-author">
                <div className="vet-author-avatar">RS</div>
                <div>
                  <div className="vet-author-name">Dr. Rahul Sharma</div>
                  <div className="vet-author-role">Owner, City Vet Clinic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section id="testimonials" className="vet-section-container">
        <div className="vet-section-header">
          <div className="vet-badge"><Star size={14} fill="#f59e0b" color="#f59e0b" /> Testimonials</div>
          <h2 className="vet-section-title">
            What Our <span className="vet-text-gradient">Clients Say</span>
          </h2>
          <p className="vet-section-subtitle">
            Join hundreds of satisfied veterinarians and clinic managers.
          </p>
        </div>

        <div className="vet-testimonials-grid">
          {/* Card 1 */}
          <div className="vet-testimonial-card">
            <div>
              <div className="vet-testimonial-user">
                <div className="vet-author-avatar" style={{ background: '#14b8a6' }}>AV</div>
                <div>
                  <div className="vet-user-name">Dr. Aman Verma</div>
                  <div className="vet-user-clinic">Senior Veterinarian, PetCare Hospital</div>
                </div>
              </div>
              <p className="vet-testimonial-text">
                "VetCare Pro has completely automated our clinic operations. Our team saves 20+ hours every week!"
              </p>
            </div>
            <div className="vet-stars">
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="vet-testimonial-card">
            <div>
              <div className="vet-testimonial-user">
                <div className="vet-author-avatar" style={{ background: '#0d9488' }}>NG</div>
                <div>
                  <div className="vet-user-name">Dr. Neha Gupta</div>
                  <div className="vet-user-clinic">Owner, Paws & Claws Vet Clinic</div>
                </div>
              </div>
              <p className="vet-testimonial-text">
                "Managing pet records, vaccination schedules, and billing has never been easier."
              </p>
            </div>
            <div className="vet-stars">
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="vet-testimonial-card">
            <div>
              <div className="vet-testimonial-user">
                <div className="vet-author-avatar" style={{ background: '#0284c7' }}>KV</div>
                <div>
                  <div className="vet-user-name">Karan Verma</div>
                  <div className="vet-user-clinic">Clinic Manager, Happy Tails Pet Center</div>
                </div>
              </div>
              <p className="vet-testimonial-text">
                "The real-time WhatsApp & email notifications keep our pet owners informed. Highly recommended!"
              </p>
            </div>
            <div className="vet-stars">
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING SECTION (CRITICAL FOR SAAS) */}
      <section id="pricing" className="vet-section-container">
        <div className="vet-section-header">
          <div className="vet-badge"><CreditCard size={14} /> Pricing Plans</div>
          <h2 className="vet-section-title">
            Choose Your <span className="vet-text-gradient">Perfect Plan</span>
          </h2>
          <p className="vet-section-subtitle">
            Flexible pricing options for clinics of all sizes.
          </p>
        </div>

        <div className="vet-pricing-grid">
          {/* Plan 1: Free Trial */}
          <div className="vet-price-card free-trial">
            <div>
              <div className="vet-plan-name" style={{ color: '#10b981' }}>Free Trial</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price">₹0</span>
                <span className="vet-plan-unit">for 7 Days</span>
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} /> Full access for 7 days</li>
                <li className="vet-plan-feature-item"><Check size={16} /> No credit card required</li>
                <li className="vet-plan-feature-item"><Check size={16} /> Quick 2-minute setup</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleRegister('free-trial')}>
              Start Free Trial
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
            <button className="vet-btn-plan" onClick={() => handleRegister('starter')}>
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
            <button className="vet-btn-plan" onClick={() => handleRegister('standard')}>
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
            <button className="vet-btn-plan" onClick={() => handleRegister('pro')}>
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA SECTION */}
      <section className="vet-cta-banner">
        <div className="vet-cta-banner-overlay">
          <h2 className="vet-cta-title">
            Ready to Transform Your Clinic?
          </h2>
          <p className="vet-cta-subtitle">
            Join thousands of veterinarians who have already streamlined their practice.
          </p>
          <button className="vet-btn-cta-lg" onClick={() => handleRegister('free-trial')}>
            Start Free Trial <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer id="contact" className="vet-footer">
        <div className="vet-section-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="vet-footer-grid">
            {/* Column 1: Brand */}
            <div>
              <div className="vet-footer-brand-title">
                <img src="/kt-logo.png" alt="Kiaan Technology Logo" style={{ height: '40px', objectFit: 'contain' }} />
                <span>KIAAN <span className="vet-text-teal">TECHNOLOGY</span></span>
              </div>
              <p className="vet-footer-desc">
                The ultimate management solution for modern veterinary clinics, pet hospitals, and animal care centers.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="vet-footer-col-title">Quick Links</h4>
              <ul className="vet-footer-links">
                <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>About Us</a></li>
                <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a></li>
                <li><a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }}>Blog</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
              </ul>
            </div>

            {/* Column 3: Software Modules */}
            <div>
              <h4 className="vet-footer-col-title">Software Modules</h4>
              <ul className="vet-footer-links">
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Pet Medical Records</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Appointment Scheduling</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Pharmacy & Inventory</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Billing & POS Invoicing</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Home Visits & Encounters</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Reports & Analytics</a></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="vet-footer-col-title">Contact Us</h4>
              <ul className="vet-contact-list">
                <li className="vet-contact-item">
                  <MapPin size={16} /> 2341, Sector E, Sudama Nagar, Indore, Madhya Pradesh 452009
                </li>
                <li className="vet-contact-item">
                  <Phone size={16} /> +91 97521 00980
                </li>
                <li className="vet-contact-item">
                  <Mail size={16} /> info@kiaantechnology.com
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="vet-footer-bottom">
            <div>
              © 2026 <strong>Kiaan Tech Craft</strong>. All rights reserved. Powered by <strong>Kiaan Technology</strong>.
            </div>
            <div className="vet-bottom-links">
              <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              <a href="#terms" onClick={(e) => e.preventDefault()}>Terms & Conditions</a>
              <a href="#docs" onClick={(e) => e.preventDefault()}>Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
