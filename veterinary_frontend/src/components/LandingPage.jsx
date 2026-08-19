import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterModal from './RegisterModal';
import LegalModal from './LegalModal';
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
  ShieldCheck,
  Globe
} from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free-trial');
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalType, setLegalType] = useState('privacy');

  const handleAdminLogin = () => {
    navigate('/login');
  };

  const handleRegister = (planKey = 'free-trial') => {
    setSelectedPlan(planKey);
    setShowRegisterModal(true);
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
            <span>PetCare <span className="vet-brand-highlight">Pro</span></span>
          </div>

          {/* Center Links (Desktop) */}
          <ul className="vet-nav-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
            <li><a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }}>Benefits</a></li>
            <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Testimonials</a></li>
            <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/brochure'); }} style={{ color: '#14b8a6', fontWeight: 'bold' }}>Brochure</a></li>
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
            <span>PetCare <span className="vet-brand-highlight">Pro</span></span>
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
          <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/brochure'); }} style={{ color: '#14b8a6', fontSize: '1.1rem', textDecoration: 'none', fontWeight: 'bold' }}>Brochure</a></li>
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
              Why <span className="vet-text-gradient">PetCare Pro</span> Stands Out
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
                "PetCare Pro transformed how we run our clinic! Automated vaccination reminders and instant digital billing increased our repeat client visits by 40%."
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
      <section id="testimonials" className="vet-section-container" style={{ paddingBottom: "0.5rem" }}>
        <div className="vet-section-header">
          <div className="vet-badge"><Star size={14} fill="#f59e0b" color="#f59e0b" /> Testimonials</div>
          <h2 className="vet-section-title">
            What Our <span className="vet-text-gradient">Clients Say</span>
          </h2>
          <p className="vet-section-subtitle">
            Join hundreds of satisfied veterinarians and clinic managers.
          </p>
        </div>

        <div className="vet-testimonials-slider-container">
          <div className="vet-testimonials-track">
          <div className="vet-testimonials-group">
          {/* Card 1 */}
          <div className="vet-testimonial-card">
            <div>
              <div className="vet-testimonial-user">
                <div className="vet-author-avatar" style={{ background: '#3b82f6' }}>TL</div>
                <div>
                  <div className="vet-user-name">truman42lewis</div>
                  <div className="vet-user-clinic">🇺🇸 United States • 4 months ago</div>
                </div>
              </div>
              <p className="vet-testimonial-text">
                "Kiaan And His Team are truly professional and In honored to work with them. As the have delivered our agency a state of the ark software! Thank you 🙏🏼"
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
                <div className="vet-author-avatar" style={{ background: '#3b82f6' }}>TL</div>
                <div>
                  <div className="vet-user-name">truman42lewis</div>
                  <div className="vet-user-clinic">🇺🇸 United States • 5 months ago</div>
                </div>
              </div>
              <p className="vet-testimonial-text">
                "Kiaan and his team showed up and handled business. Excellent work, professional, and on point. I highly recommend them."
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
                <div className="vet-author-avatar" style={{ background: '#10b981' }}>H</div>
                <div>
                  <div className="vet-user-name">hansdjabs</div>
                  <div className="vet-user-clinic">🇷🇼 Rwanda • 7 months ago</div>
                </div>
              </div>
              <p className="vet-testimonial-text" style={{ fontSize: '0.9rem' }}>
                "my experience working with this company is very great , i highly recommend everyone to work with this amazing team. because everything is smooth by working with them .. and they have expert in software development i can tell you .. whatever you have in mind they can build it with professionalism."
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

          {/* Card 4 */}
          <div className="vet-testimonial-card">
            <div>
              <div className="vet-testimonial-user">
                <div className="vet-author-avatar" style={{ background: '#ef4444' }}>FH</div>
                <div>
                  <div className="vet-user-name">fahimhyder310</div>
                  <div className="vet-user-clinic">🇮🇳 India • 5 months ago</div>
                </div>
              </div>
              <p className="vet-testimonial-text" style={{ fontSize: '0.85rem' }}>
                "They demonstrated strong command over both frontend and backend development, ensuring performance, security, and smooth functionality throughout the build. What stood out most was their deep understanding of the product vision. Their professionalism was consistent throughout the project. Milestones were delivered on time, communication was clear and structured, and they handled feedback with maturity and precision."
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

          {/* Card 5 */}
          <div className="vet-testimonial-card">
            <div>
              <div className="vet-testimonial-user">
                <div className="vet-author-avatar" style={{ background: '#65a30d' }}>P</div>
                <div>
                  <div className="vet-user-name">pop1010</div>
                  <div className="vet-user-clinic">🇺🇸 United States • 3 months ago</div>
                </div>
              </div>
              <p className="vet-testimonial-text">
                "Best developer ever, always listening and make adjustments to every bugs snd response to messages every seconds"
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
          
          <div className="vet-testimonials-group" aria-hidden="true">
          {/* Card 1 */}
          <div className="vet-testimonial-card">
            <div>
              <div className="vet-testimonial-user">
                <div className="vet-author-avatar" style={{ background: '#3b82f6' }}>TL</div>
                <div>
                  <div className="vet-user-name">truman42lewis</div>
                  <div className="vet-user-clinic">🇺🇸 United States • 4 months ago</div>
                </div>
              </div>
              <p className="vet-testimonial-text">
                "Kiaan And His Team are truly professional and In honored to work with them. As the have delivered our agency a state of the ark software! Thank you 🙏🏼"
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
                <div className="vet-author-avatar" style={{ background: '#3b82f6' }}>TL</div>
                <div>
                  <div className="vet-user-name">truman42lewis</div>
                  <div className="vet-user-clinic">🇺🇸 United States • 5 months ago</div>
                </div>
              </div>
              <p className="vet-testimonial-text">
                "Kiaan and his team showed up and handled business. Excellent work, professional, and on point. I highly recommend them."
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
                <div className="vet-author-avatar" style={{ background: '#10b981' }}>H</div>
                <div>
                  <div className="vet-user-name">hansdjabs</div>
                  <div className="vet-user-clinic">🇷🇼 Rwanda • 7 months ago</div>
                </div>
              </div>
              <p className="vet-testimonial-text" style={{ fontSize: '0.9rem' }}>
                "my experience working with this company is very great , i highly recommend everyone to work with this amazing team. because everything is smooth by working with them .. and they have expert in software development i can tell you .. whatever you have in mind they can build it with professionalism."
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

          {/* Card 4 */}
          <div className="vet-testimonial-card">
            <div>
              <div className="vet-testimonial-user">
                <div className="vet-author-avatar" style={{ background: '#ef4444' }}>FH</div>
                <div>
                  <div className="vet-user-name">fahimhyder310</div>
                  <div className="vet-user-clinic">🇮🇳 India • 5 months ago</div>
                </div>
              </div>
              <p className="vet-testimonial-text" style={{ fontSize: '0.85rem' }}>
                "They demonstrated strong command over both frontend and backend development, ensuring performance, security, and smooth functionality throughout the build. What stood out most was their deep understanding of the product vision. Their professionalism was consistent throughout the project. Milestones were delivered on time, communication was clear and structured, and they handled feedback with maturity and precision."
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

          {/* Card 5 */}
          <div className="vet-testimonial-card">
            <div>
              <div className="vet-testimonial-user">
                <div className="vet-author-avatar" style={{ background: '#65a30d' }}>P</div>
                <div>
                  <div className="vet-user-name">pop1010</div>
                  <div className="vet-user-clinic">🇺🇸 United States • 3 months ago</div>
                </div>
              </div>
              <p className="vet-testimonial-text">
                "Best developer ever, always listening and make adjustments to every bugs snd response to messages every seconds"
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
          </div>
        </div>
      </section>

      {/* 6. PRICING SECTION (CRITICAL FOR SAAS) */}
      <section id="pricing" className="vet-section-container" style={{ paddingTop: "0.5rem" }}>
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
          {/* Plan 1: 7-Day Free Trial */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">7-Day Free Trial</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price">₹0</span>
                <span className="vet-plan-unit">per week</span>
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> 7 Days full feature trial access</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> Duration: 7 Days</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleRegister('free-trial')}>
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
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> Essential clinic management features</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> Duration: Monthly</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleRegister('starter')}>
              Get Started
            </button>
          </div>

          {/* Plan 3: Standard (Most Popular) */}
          <div className="vet-price-card featured" style={{ borderColor: '#14b8a6' }}>
            <div className="vet-popular-badge" style={{ backgroundColor: '#14b8a6' }}>Most Popular</div>
            <div>
              <div className="vet-plan-name" style={{ color: '#14b8a6' }}>Standard</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price" style={{ color: '#14b8a6' }}>₹1,299</span>
                <span className="vet-plan-unit">per month</span>
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> Complete features for growing clinics</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> Duration: Monthly</li>
              </ul>
            </div>
            <button className="vet-btn-plan" style={{ backgroundColor: '#14b8a6', borderColor: '#14b8a6' }} onClick={() => handleRegister('standard')}>
              Get Started
            </button>
          </div>

          {/* Plan 4: Pro */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">Pro</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price" style={{ color: '#14b8a6' }}>₹1,499</span>
                <span className="vet-plan-unit">per month</span>
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> 🤖 Kiaan AI Assistant & AI Features</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> Advanced features and priority support</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> Duration: Monthly</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleRegister('pro')}>
              Get Started
            </button>
          </div>

          {/* Plan 5: Custom */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">Custom Plan</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price" style={{ color: '#14b8a6' }}>Custom</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Tailored to your clinic</p>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> SaaS with customization</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> Personal domain</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> Personal branding</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> 🤖 AI and automation</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleRegister('custom')}>
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
              <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem', alignItems: 'center' }}>
                <a href="https://www.instagram.com/kiaan_technology4/" target="_blank" rel="noopener noreferrer" 
                   style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: '#fff', transition: 'transform 0.2s ease, box-shadow 0.2s ease', textDecoration: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }} 
                   onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(225, 48, 108, 0.4)'; }} 
                   onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)'; }} 
                   title="Instagram">
                  <Instagram size={18} strokeWidth={2.5} />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61560965313920&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" 
                   style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: '#1877F2', color: '#fff', transition: 'transform 0.2s ease, box-shadow 0.2s ease', textDecoration: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }} 
                   onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(24, 119, 242, 0.4)'; }} 
                   onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)'; }} 
                   title="Facebook">
                  <Facebook size={18} strokeWidth={2.5} />
                </a>
                <a href="https://www.linkedin.com/company/kiaan-technology-pvt-ltd/posts/?feedView=all" target="_blank" rel="noopener noreferrer" 
                   style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: '#0A66C2', color: '#fff', transition: 'transform 0.2s ease, box-shadow 0.2s ease', textDecoration: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }} 
                   onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(10, 102, 194, 0.4)'; }} 
                   onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)'; }} 
                   title="LinkedIn">
                  <Linkedin size={18} strokeWidth={2.5} />
                </a>
                <a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer" 
                   style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: '#14b8a6', color: '#fff', transition: 'transform 0.2s ease, box-shadow 0.2s ease', textDecoration: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }} 
                   onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(20, 184, 166, 0.4)'; }} 
                   onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)'; }} 
                   title="Website">
                  <Globe size={18} strokeWidth={2.5} />
                </a>
              </div>
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
              <a href="#privacy" onClick={(e) => { e.preventDefault(); setLegalType('privacy'); setShowLegalModal(true); }}>Privacy Policy</a>
              <a href="#terms" onClick={(e) => { e.preventDefault(); setLegalType('terms'); setShowLegalModal(true); }}>Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919752100980?text=Hello%20Kiaan%20Technology%2C%20I%20would%20like%20to%20know%20more%20about%20your%20PetCare%20Pro%20SaaS%20solution."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Kiaan Technology on WhatsApp"
        title="Chat with us on WhatsApp"
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '30px',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37, 211, 102, 0.45)',
          zIndex: 9998,
          textDecoration: 'none',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.12) translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.6)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 211, 102, 0.45)';
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#ffffff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {showRegisterModal && (
        <RegisterModal plan={selectedPlan} onClose={() => setShowRegisterModal(false)} />
      )}

      {showLegalModal && (
        <LegalModal type={legalType} onClose={() => setShowLegalModal(false)} />
      )}
    </div>
  );
}
