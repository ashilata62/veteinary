import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  Linkedin,
  Instagram,
  Facebook,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { LANGUAGES, PLAN_PRICING, TRANSLATIONS } from '../data/landingTranslations';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free-trial');
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalType, setLegalType] = useState('privacy');

  // Language & Currency State
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('petcare_lang') || 'en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);

  // Derive active language and currency
  const activeLang = LANGUAGES.find((l) => l.id === currentLang) || LANGUAGES[0];
  const currency = activeLang.currency || 'USD';
  const pricing = PLAN_PRICING[currency] || PLAN_PRICING.USD;
  const tData = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Translation helper
  const t = (path) => {
    const keys = path.split('.');
    let current = tData;
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = TRANSLATIONS.en;
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) fallback = fallback[fKey];
          else return path;
        }
        return fallback;
      }
    }
    return current;
  };

  const handleLanguageChange = (langId) => {
    setCurrentLang(langId);
    localStorage.setItem('petcare_lang', langId);
    setLangMenuOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const isRTL = currentLang === 'ar';

  return (
    <div className={`vet-landing ${isRTL ? 'rtl' : ''}`}>
      {/* 1. NAVIGATION BAR (Sticky Top) */}
      <header className="vet-landing-header">
        <div className="vet-header-container">
          {/* Logo */}
          <div className="vet-brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/kt-logo.png" alt="PetCare Pro Logo" style={{ height: '36px', objectFit: 'contain', cursor: 'pointer' }} />
            <span>PetCare <span className="vet-brand-highlight">Pro</span></span>
          </div>

          {/* Center Links (Desktop) */}
          <ul className="vet-nav-links">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{t('nav.home')}</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>{t('nav.features')}</a></li>
            <li><a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }}>{t('nav.benefits')}</a></li>
            <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>{t('nav.testimonials')}</a></li>
            <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>{t('nav.pricing')}</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>{t('nav.contact')}</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/brochure'); }} style={{ color: '#14b8a6', fontWeight: 'bold' }}>{t('nav.brochure')}</a></li>
          </ul>

          {/* Right Actions */}
          <div className="vet-header-actions">
            {/* Language & Currency Selector Dropdown */}
            <div className="vet-lang-dropdown-wrapper" ref={langDropdownRef}>
              <button 
                className="vet-lang-btn" 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                title="Select Language & Currency"
              >
                <Globe size={15} className="vet-lang-globe-icon" />
                <span className="vet-lang-text">{activeLang.flag} {activeLang.label}</span>
                <span className="vet-lang-currency-tag">{pricing.code}</span>
                <ChevronDown size={13} style={{ opacity: 0.7 }} />
              </button>

              {langMenuOpen && (
                <div className="vet-lang-menu">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      className={`vet-lang-option ${currentLang === lang.id ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(lang.id)}
                    >
                      <div className="vet-lang-option-left">
                        <span style={{ fontSize: '1.1rem' }}>{lang.flag}</span>
                        <span>{lang.nativeName} ({lang.label})</span>
                      </div>
                      <span className="vet-lang-option-currency">{lang.currency} ({lang.symbol})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="vet-btn-outline vet-header-login-btn" onClick={handleAdminLogin}>
              {t('nav.adminLogin')}
            </button>
            <button className="vet-btn-primary vet-header-trial-btn" onClick={() => handleRegister('free-trial')}>
              {t('nav.startTrial')}
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
        <div className="vet-drawer-header">
          <div className="vet-brand-logo" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src="/kt-logo.png" alt="PetCare Pro Logo" style={{ height: '30px', objectFit: 'contain' }} />
            <span style={{ fontSize: '1.2rem' }}>PetCare <span className="vet-brand-highlight">Pro</span></span>
          </div>
          <button className="vet-drawer-close-btn" onClick={() => setMobileMenuOpen(false)} title="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* Mobile Language Selector */}
        <div>
          <div className="vet-drawer-section-title">
            Language / Currency
          </div>
          <div className="vet-drawer-lang-grid">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => { handleLanguageChange(lang.id); setMobileMenuOpen(false); }}
                className={`vet-drawer-lang-card ${currentLang === lang.id ? 'active' : ''}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginLeft: 'auto' }}>{lang.currency}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Nav Links */}
        <div>
          <div className="vet-drawer-section-title">
            Navigation
          </div>
          <ul className="vet-drawer-nav-list">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>{t('nav.home')}</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>{t('nav.features')}</a></li>
            <li><a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }}>{t('nav.benefits')}</a></li>
            <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>{t('nav.testimonials')}</a></li>
            <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>{t('nav.pricing')}</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>{t('nav.contact')}</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/brochure'); }} style={{ color: '#14b8a6', fontWeight: 'bold' }}>{t('nav.brochure')} 📄</a></li>
          </ul>
        </div>

        {/* Mobile Actions (Buttons) */}
        <div className="vet-drawer-actions">
          <button className="vet-btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMobileMenuOpen(false); handleAdminLogin(); }}>
            {t('nav.adminLogin')}
          </button>
          <button className="vet-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMobileMenuOpen(false); handleRegister('free-trial'); }}>
            {t('nav.startTrial')}
          </button>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section id="home" className="vet-section-container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="vet-hero-grid">
          <div className="vet-hero-content">
            <div className="vet-badge">
              <Award size={15} /> {t('hero.badge')}
            </div>

            <h1 className="vet-hero-title">
              {t('hero.title1')} <br />
              <span className="vet-text-gradient">{t('hero.titleGradient')}</span>
            </h1>

            <p className="vet-hero-subtitle">
              {t('hero.subtitle')}
            </p>

            <div className="vet-hero-actions">
              <button className="vet-btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }} onClick={() => handleRegister('free-trial')}>
                {t('hero.getStarted')} <ArrowRight size={18} />
              </button>
              <button className="vet-btn-outline" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }} onClick={() => scrollToSection('pricing')}>
                {t('hero.explorePricing')}
              </button>
            </div>

            {/* Stats Row */}
            <div className="vet-hero-stats">
              <div className="vet-stat-item">
                <div className="vet-stat-value">50K+</div>
                <div className="vet-stat-label">{t('hero.stats.pets')}</div>
              </div>
              <div className="vet-stat-item">
                <div className="vet-stat-value">500+</div>
                <div className="vet-stat-label">{t('hero.stats.clinics')}</div>
              </div>
              <div className="vet-stat-item">
                <div className="vet-stat-value">99.9%</div>
                <div className="vet-stat-label">{t('hero.stats.satisfaction')}</div>
              </div>
              <div className="vet-stat-item">
                <div className="vet-stat-value">24/7</div>
                <div className="vet-stat-label">{t('hero.stats.support')}</div>
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
          <div className="vet-badge"><Zap size={14} /> {t('features.badge')}</div>
          <h2 className="vet-section-title">
            {t('features.title')} <span className="vet-text-gradient">{t('features.titleGradient')}</span>
          </h2>
          <p className="vet-section-subtitle">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="vet-features-grid">
          {/* Feature 1 */}
          <div className="vet-feature-card">
            <div className="vet-feature-icon-wrapper">
              <Calendar size={26} />
            </div>
            <h3 className="vet-feature-title">{t('features.f1_title')}</h3>
            <p className="vet-feature-desc">{t('features.f1_desc')}</p>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="vet-feature-link">
              {t('nav.pricing')} <ChevronRight size={16} />
            </a>
          </div>

          {/* Feature 2 */}
          <div className="vet-feature-card">
            <div className="vet-feature-icon-wrapper">
              <FileHeart size={26} />
            </div>
            <h3 className="vet-feature-title">{t('features.f2_title')}</h3>
            <p className="vet-feature-desc">{t('features.f2_desc')}</p>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="vet-feature-link">
              {t('nav.pricing')} <ChevronRight size={16} />
            </a>
          </div>

          {/* Feature 3 */}
          <div className="vet-feature-card">
            <div className="vet-feature-icon-wrapper">
              <CreditCard size={26} />
            </div>
            <h3 className="vet-feature-title">{t('features.f3_title')}</h3>
            <p className="vet-feature-desc">{t('features.f3_desc')}</p>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="vet-feature-link">
              {t('nav.pricing')} <ChevronRight size={16} />
            </a>
          </div>

          {/* Feature 4 */}
          <div className="vet-feature-card">
            <div className="vet-feature-icon-wrapper">
              <Package size={26} />
            </div>
            <h3 className="vet-feature-title">{t('features.f4_title')}</h3>
            <p className="vet-feature-desc">{t('features.f4_desc')}</p>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="vet-feature-link">
              {t('nav.pricing')} <ChevronRight size={16} />
            </a>
          </div>

          {/* Feature 5 */}
          <div className="vet-feature-card">
            <div className="vet-feature-icon-wrapper">
              <BellRing size={26} />
            </div>
            <h3 className="vet-feature-title">{t('features.f5_title')}</h3>
            <p className="vet-feature-desc">{t('features.f5_desc')}</p>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="vet-feature-link">
              {t('nav.pricing')} <ChevronRight size={16} />
            </a>
          </div>

          {/* Feature 6 */}
          <div className="vet-feature-card">
            <div className="vet-feature-icon-wrapper">
              <BarChart3 size={26} />
            </div>
            <h3 className="vet-feature-title">{t('features.f6_title')}</h3>
            <p className="vet-feature-desc">{t('features.f6_desc')}</p>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="vet-feature-link">
              {t('nav.pricing')} <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US / BENEFITS SECTION */}
      <section id="benefits" className="vet-section-container">
        <div className="vet-why-grid">
          <div className="vet-why-left">
            <div className="vet-badge"><ShieldCheck size={14} /> {t('benefits.badge')}</div>
            <h2 className="vet-section-title">
              {t('benefits.title')} <span className="vet-text-gradient">{t('benefits.titleGradient')}</span>
            </h2>
            <p className="vet-section-subtitle">
              {t('benefits.subtitle')}
            </p>

            <ul className="vet-why-checklist">
              <li className="vet-why-item"><span className="vet-check-icon">✓</span> {t('benefits.b1')}</li>
              <li className="vet-why-item"><span className="vet-check-icon">✓</span> {t('benefits.b2')}</li>
              <li className="vet-why-item"><span className="vet-check-icon">✓</span> {t('benefits.b3')}</li>
              <li className="vet-why-item"><span className="vet-check-icon">✓</span> {t('benefits.b4')}</li>
              <li className="vet-why-item"><span className="vet-check-icon">✓</span> {t('benefits.b5')}</li>
              <li className="vet-why-item"><span className="vet-check-icon">✓</span> {t('benefits.b6')}</li>
            </ul>

            <button className="vet-btn-primary" onClick={() => scrollToSection('pricing')}>
              {t('benefits.btn')} <ArrowRight size={18} />
            </button>
          </div>

          <div className="vet-why-right">
            <div className="vet-metrics-row">
              <div className="vet-metric-card">
                <div className="vet-metric-val vet-text-teal">40%</div>
                <div className="vet-metric-lbl">{t('benefits.metrics.faster')}</div>
              </div>
              <div className="vet-metric-card">
                <div className="vet-metric-val vet-text-teal">15+</div>
                <div className="vet-metric-lbl">{t('benefits.metrics.saved')}</div>
              </div>
              <div className="vet-metric-card">
                <div className="vet-metric-val vet-text-teal">99.9%</div>
                <div className="vet-metric-lbl">{t('benefits.metrics.uptime')}</div>
              </div>
            </div>

            <div className="vet-quote-card">
              <p className="vet-quote-text">{t('benefits.quote')}</p>
              <div className="vet-quote-author">
                <div className="vet-author-avatar">RS</div>
                <div>
                  <div className="vet-author-name">{t('benefits.author')}</div>
                  <div className="vet-author-role">{t('benefits.authorRole')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section id="testimonials" className="vet-section-container" style={{ paddingBottom: '0.5rem' }}>
        <div className="vet-section-header">
          <div className="vet-badge"><Star size={14} fill="#f59e0b" color="#f59e0b" /> {t('testimonials.badge')}</div>
          <h2 className="vet-section-title">
            {t('testimonials.title')} <span className="vet-text-gradient">{t('testimonials.titleGradient')}</span>
          </h2>
          <p className="vet-section-subtitle">
            {t('testimonials.subtitle')}
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
                    "Kiaan And His Team are truly professional and I'm honored to work with them. They delivered our agency state-of-the-art software! Thank you 🙏🏼"
                  </p>
                </div>
                <div className="vet-stars">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
                </div>
              </div>

              {/* Card 2 */}
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
                    "My experience working with this company is great. I highly recommend everyone to work with this amazing team. Everything is smooth and they are experts in software development."
                  </p>
                </div>
                <div className="vet-stars">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
                </div>
              </div>

              {/* Card 3 */}
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
                    "Strong command over frontend and backend development, ensuring performance and security. Milestones delivered on time with clear communication."
                  </p>
                </div>
                <div className="vet-stars">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DYNAMIC PRICING SECTION */}
      <section id="pricing" className="vet-section-container" style={{ paddingTop: '0.5rem' }}>
        <div className="vet-section-header">
          <div className="vet-badge"><CreditCard size={14} /> {t('pricing.badge')}</div>
          <h2 className="vet-section-title">
            {t('pricing.title')} <span className="vet-text-gradient">{t('pricing.titleGradient')}</span>
          </h2>
          <p className="vet-section-subtitle">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="vet-pricing-grid">
          {/* Plan 1: 7-Day Free Trial */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">{t('pricing.trialName')}</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price">{pricing.symbol}{pricing['free-trial'].price}</span>
                {pricing['free-trial'].unit && <span className="vet-plan-unit">{pricing['free-trial'].unit}</span>}
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.trialFeature1')}</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.trialFeature2')}</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleRegister('free-trial')}>
              {t('pricing.btnGetStarted')}
            </button>
          </div>

          {/* Plan 2: Starter */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">{t('pricing.starterName')}</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price">{pricing.symbol}{pricing.starter.price}</span>
                {pricing.starter.unit && <span className="vet-plan-unit">{pricing.starter.unit}</span>}
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.starterFeature1')}</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.starterFeature2')}</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleRegister('starter')}>
              {t('pricing.btnGetStarted')}
            </button>
          </div>

          {/* Plan 3: Standard (Most Popular) */}
          <div className="vet-price-card featured" style={{ borderColor: '#14b8a6' }}>
            <div className="vet-popular-badge" style={{ backgroundColor: '#14b8a6' }}>{t('pricing.standardBadge')}</div>
            <div>
              <div className="vet-plan-name" style={{ color: '#14b8a6' }}>{t('pricing.standardName')}</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price" style={{ color: '#14b8a6' }}>{pricing.symbol}{pricing.standard.price}</span>
                {pricing.standard.unit && <span className="vet-plan-unit">{pricing.standard.unit}</span>}
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.standardFeature1')}</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.standardFeature2')}</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.standardFeature3')}</li>
              </ul>
            </div>
            <button className="vet-btn-plan" style={{ backgroundColor: '#14b8a6', borderColor: '#14b8a6' }} onClick={() => handleRegister('standard')}>
              {t('pricing.btnGetStarted')}
            </button>
          </div>

          {/* Plan 4: Pro */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">{t('pricing.proName')}</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price" style={{ color: '#14b8a6' }}>{pricing.symbol}{pricing.pro.price}</span>
                {pricing.pro.unit && <span className="vet-plan-unit">{pricing.pro.unit}</span>}
              </div>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.proFeature1')}</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.proFeature2')}</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.proFeature3')}</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleRegister('pro')}>
              {t('pricing.btnGetStarted')}
            </button>
          </div>

          {/* Plan 5: Custom */}
          <div className="vet-price-card">
            <div>
              <div className="vet-plan-name">{t('pricing.customName')}</div>
              <div className="vet-plan-price-row">
                <span className="vet-plan-price" style={{ color: '#14b8a6' }}>{pricing.custom.price}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{t('pricing.customSub')}</p>
              <ul className="vet-plan-features">
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.customFeature1')}</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.customFeature2')}</li>
                <li className="vet-plan-feature-item"><Check size={16} style={{ color: '#14b8a6' }} /> {t('pricing.customFeature3')}</li>
              </ul>
            </div>
            <button className="vet-btn-plan" onClick={() => handleRegister('custom')}>
              {t('pricing.btnContactSales')}
            </button>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA SECTION */}
      <section className="vet-cta-banner">
        <div className="vet-cta-banner-overlay">
          <h2 className="vet-cta-title">
            {t('hero.title1')} {t('hero.titleGradient')}
          </h2>
          <p className="vet-cta-subtitle">
            {t('hero.subtitle')}
          </p>
          <button className="vet-btn-cta-lg" onClick={() => handleRegister('free-trial')}>
            {t('nav.startTrial')} <ArrowRight size={20} />
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
                {t('footer.tagline')}
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem', alignItems: 'center' }}>
                <a href="https://www.instagram.com/kiaan_technology4/" target="_blank" rel="noopener noreferrer" 
                   style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: '#fff', textDecoration: 'none' }} 
                   title="Instagram">
                  <Instagram size={18} strokeWidth={2.5} />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61560965313920&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" 
                   style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: '#1877F2', color: '#fff', textDecoration: 'none' }} 
                   title="Facebook">
                  <Facebook size={18} strokeWidth={2.5} />
                </a>
                <a href="https://www.linkedin.com/company/kiaan-technology-pvt-ltd/posts/?feedView=all" target="_blank" rel="noopener noreferrer" 
                   style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: '#0A66C2', color: '#fff', textDecoration: 'none' }} 
                   title="LinkedIn">
                  <Linkedin size={18} strokeWidth={2.5} />
                </a>
                <a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer" 
                   style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: '#14b8a6', color: '#fff', textDecoration: 'none' }} 
                   title="Website">
                  <Globe size={18} strokeWidth={2.5} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="vet-footer-col-title">{t('footer.quickLinks')}</h4>
              <ul className="vet-footer-links">
                <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>{t('nav.home')}</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>{t('nav.features')}</a></li>
                <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>{t('nav.pricing')}</a></li>
                <li><a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }}>{t('nav.benefits')}</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>{t('nav.contact')}</a></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h4 className="vet-footer-col-title">{t('footer.contact')}</h4>
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
              © 2026 <strong>Kiaan Tech Craft</strong>. {t('footer.rights')}
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
          right: isRTL ? 'auto' : '20px',
          left: isRTL ? '20px' : 'auto',
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
