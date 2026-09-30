import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Globe,
  Smartphone,
  Share2,
  Copy,
  Download
} from 'lucide-react';
import { LANGUAGES, PLAN_PRICING, TRANSLATIONS } from '../data/landingTranslations';
import LanguageSwitcher from './LanguageSwitcher';
import './LandingPage.css';

function AndroidIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993s-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9994.4482.9994.9993s-.4483.9997-.9994.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1523-.5676.416.416 0 00-.5676.1523l-2.0223 3.503C15.5898 8.404 13.8488 8 12 8s-3.5898.404-5.1326.95l-2.0223-3.503a.416.416 0 00-.5676-.1523.416.416 0 00-.1523.5676l1.9973 3.4592C2.6884 11.0967.3432 15.0064 0 19.5765h24c-.3432-4.5701-2.6884-8.4798-6.1185-10.2551"/>
    </svg>
  );
}

function AppleIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-1.99.6-2.64 1.36-.57.65-1.07 1.71-.93 2.73 1.01.08 2.04-.47 2.65-1.22z"/>
    </svg>
  );
}

function IosModal({ onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="vet-drawer-backdrop" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 10000 }}>
      <div className="vet-ios-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="vet-ios-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="vet-ios-modal-header">
          <div className="vet-ios-apple-icon">
            <AppleIcon size={30} color="#ffffff" />
          </div>
          <div>
            <h3 className="vet-ios-modal-title">Install PetCare Pro on iOS</h3>
            <p className="vet-ios-modal-sub">Works seamlessly on iPhone & iPad with native PWA speed</p>
          </div>
        </div>

        <div className="vet-ios-steps-container">
          <div className="vet-ios-step-card">
            <div className="vet-ios-step-num">1</div>
            <div className="vet-ios-step-body">
              <strong>Open in Safari</strong>
              <p>Open this website in Apple Safari browser on your iPhone or iPad.</p>
            </div>
          </div>

          <div className="vet-ios-step-card">
            <div className="vet-ios-step-num">2</div>
            <div className="vet-ios-step-body">
              <strong>Tap the Share Button</strong>
              <p>Tap the <strong>Share</strong> icon (<Share2 size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> square with up arrow) in the Safari toolbar.</p>
            </div>
          </div>

          <div className="vet-ios-step-card">
            <div className="vet-ios-step-num">3</div>
            <div className="vet-ios-step-body">
              <strong>Tap "Add to Home Screen"</strong>
              <p>Scroll down and select <strong>"Add to Home Screen"</strong>, then tap <strong>Add</strong> at top right.</p>
            </div>
          </div>
        </div>

        <div className="vet-ios-perks-row">
          <div className="vet-ios-perk"><CheckCircle size={14} color="#14b8a6" /> Fast Offline Access</div>
          <div className="vet-ios-perk"><CheckCircle size={14} color="#14b8a6" /> Fullscreen Native UI</div>
          <div className="vet-ios-perk"><CheckCircle size={14} color="#14b8a6" /> Under 3 MB Size</div>
        </div>

        <div className="vet-ios-modal-actions">
          <button type="button" className="vet-btn-outline" onClick={handleCopyLink} style={{ flex: 1, justifyContent: 'center' }}>
            {copied ? <><Check size={16} color="#14b8a6" /> Link Copied!</> : <><Copy size={16} /> Copy Web App URL</>}
          </button>
          <button type="button" className="vet-btn-primary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
            Got It 👍
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free-trial');
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalType, setLegalType] = useState('privacy');
  const [showIosModal, setShowIosModal] = useState(false);
  const [downloadToast, setDownloadToast] = useState('');

  const handleAndroidDownload = () => {
    setDownloadToast('⬇️ Downloading PetCare Pro Android APK (10 MB)... Once downloaded, open the file to install.');
    setTimeout(() => {
      setDownloadToast('');
    }, 4500);
  };

  // Auto-scroll when visiting /contact, /features, /pricing, /benefits, /testimonials, /mobile-app
  useEffect(() => {
    const rawPath = location.pathname.toLowerCase().replace(/^\//, '');
    if (['features', 'benefits', 'testimonials', 'pricing', 'contact', 'home', 'mobile-app'].includes(rawPath)) {
      const targetId = rawPath === 'home' ? 'home' : rawPath;
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location.pathname]);

  const [selectedRegionId, setSelectedRegionId] = useState(() => {
    return localStorage.getItem('petcare_region') || 'us';
  });

  useEffect(() => {
    const handleRegionEvent = (e) => {
      if (e.detail && e.detail !== selectedRegionId) {
        setSelectedRegionId(e.detail);
      }
    };
    window.addEventListener('petcare_region_changed', handleRegionEvent);
    return () => window.removeEventListener('petcare_region_changed', handleRegionEvent);
  }, [selectedRegionId]);

  const activeRegion = LANGUAGES.find((l) => l.id === selectedRegionId || l.short?.toLowerCase() === selectedRegionId?.toLowerCase()) || LANGUAGES[0];
  const pricing = PLAN_PRICING[activeRegion.currency] || PLAN_PRICING.USD;
  const tData = TRANSLATIONS[selectedRegionId] || TRANSLATIONS[activeRegion.id] || TRANSLATIONS.en || TRANSLATIONS.usa;

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

  const handleAdminLogin = () => {
    navigate('/login');
  };

  const handleRegister = (planKey = 'free-trial') => {
    setSelectedPlan(planKey);
    setShowRegisterModal(true);
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const targetPath = id === 'home' ? '/' : `/${id}`;
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isRTL = false;

  return (
    <div className={`vet-landing ${isRTL ? 'rtl' : ''}`}>
      {/* 1. NAVIGATION BAR (Sticky Top) */}
      <header className="vet-landing-header">
        <div className="vet-header-container">
          {/* Logo */}
          <div className="vet-brand-logo notranslate" translate="no" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/kt-logo.png" alt="PetCare Pro Logo" style={{ height: '36px', objectFit: 'contain', cursor: 'pointer' }} />
            <span className="notranslate" translate="no">PetCare <span className="vet-brand-highlight">Pro</span></span>
          </div>

          {/* Center Links (Desktop) */}
          <ul className="vet-nav-links">
            <li><a href="/" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>{t('nav.home')}</a></li>
            <li><a href="/features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>{t('nav.features')}</a></li>
            <li><a href="/#mobile-app" onClick={(e) => { e.preventDefault(); scrollToSection('mobile-app'); }}>Mobile App 📱</a></li>
            <li><a href="/benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }}>{t('nav.benefits')}</a></li>
            <li><a href="/pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>{t('nav.pricing')}</a></li>
            <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>{t('nav.contact')}</a></li>
            <li><a href="/brochure" onClick={(e) => { e.preventDefault(); navigate('/brochure'); }} className="vet-nav-brochure-link">{t('nav.brochure')} 📄</a></li>
          </ul>

          {/* Right Actions */}
          <div className="vet-header-actions">
            <LanguageSwitcher selectedRegion={selectedRegionId} onRegionChange={setSelectedRegionId} />

            <button className="vet-btn-outline vet-header-login-btn" onClick={handleAdminLogin}>
              {t('nav.adminLogin')}
            </button>
            <button className="vet-btn-primary vet-header-trial-btn" onClick={() => handleRegister('free-trial')}>
              {t('nav.startTrial')}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button className="vet-mobile-toggle" onClick={() => setMobileMenuOpen(true)} aria-label="Toggle menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="vet-drawer-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className={`vet-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="vet-drawer-header">
          <div className="vet-brand-logo notranslate" translate="no" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src="/kt-logo.png" alt="PetCare Pro Logo" style={{ height: '30px', objectFit: 'contain' }} />
            <span className="notranslate" translate="no" style={{ fontSize: '1.2rem' }}>PetCare <span className="vet-brand-highlight">Pro</span></span>
          </div>
          <button className="vet-drawer-close-btn" onClick={() => setMobileMenuOpen(false)} title="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* Mobile Language Selector */}
        <div style={{ padding: '0.5rem 0', width: '100%' }}>
          <LanguageSwitcher selectedRegion={selectedRegionId} onRegionChange={setSelectedRegionId} inDrawer={true} />
        </div>

        {/* Mobile Nav Links */}
        <div>
          <div className="vet-drawer-section-title">
            Navigation
          </div>
          <ul className="vet-drawer-nav-list">
            <li><a href="/" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>{t('nav.home')}</a></li>
            <li><a href="/features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>{t('nav.features')}</a></li>
            <li><a href="/#mobile-app" onClick={(e) => { e.preventDefault(); scrollToSection('mobile-app'); }}>Mobile App 📱</a></li>
            <li><a href="/benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }}>{t('nav.benefits')}</a></li>
            <li><a href="/testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>{t('nav.testimonials')}</a></li>
            <li><a href="/pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>{t('nav.pricing')}</a></li>
            <li><a href="/contact" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/contact'); }}>{t('nav.contact')}</a></li>
            <li><a href="/brochure" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/brochure'); }} style={{ color: '#14b8a6', fontWeight: 'bold' }}>{t('nav.brochure')} 📄</a></li>
            <li><a href="/privacy-policy" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/privacy-policy'); }}>Privacy Policy 🛡️</a></li>
            <li><a href="/terms" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/terms'); }}>Terms & Conditions 📜</a></li>
          </ul>
        </div>

        {/* Mobile App Download Block in Drawer */}
        <div className="vet-drawer-apps-block">
          <div className="vet-drawer-section-title">
            📱 Mobile App
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <a
              href="/PetCare_Veterinary.apk"
              download="PetCare_Veterinary.apk"
              onClick={() => { setMobileMenuOpen(false); handleAndroidDownload(); }}
              className="vet-app-store-btn vet-app-btn-android"
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              <div className="vet-app-icon-wrap android-wrap">
                <AndroidIcon size={22} color="#22c55e" />
              </div>
              <div className="vet-app-text-wrap">
                <span className="vet-app-text-top">Download App for</span>
                <span className="vet-app-text-bottom">Android (APK - 10 MB)</span>
              </div>
            </a>

            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); setShowIosModal(true); }}
              className="vet-app-store-btn vet-app-btn-ios"
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              <div className="vet-app-icon-wrap ios-wrap">
                <AppleIcon size={22} color="#ffffff" />
              </div>
              <div className="vet-app-text-wrap">
                <span className="vet-app-text-top">Download for</span>
                <span className="vet-app-text-bottom">iOS (Apple PWA)</span>
              </div>
            </button>
          </div>
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
              <button className="vet-btn-primary" onClick={() => handleRegister('free-trial')}>
                {t('hero.getStarted')} <ArrowRight size={18} />
              </button>
              <button className="vet-btn-outline" onClick={() => scrollToSection('pricing')}>
                {t('hero.explorePricing')}
              </button>
            </div>

            {/* Mobile App Download Row in Hero */}
            <div className="vet-hero-app-row">
              <div className="vet-hero-app-title">
                <Smartphone size={16} className="vet-text-teal" />
                <span>Download PetCare Pro Mobile App:</span>
              </div>
              <div className="vet-app-buttons-group">
                <a
                  href="/PetCare_Veterinary.apk"
                  download="PetCare_Veterinary.apk"
                  onClick={handleAndroidDownload}
                  className="vet-app-store-btn vet-app-btn-android"
                  title="Download PetCare Pro Android APK"
                >
                  <div className="vet-app-icon-wrap android-wrap">
                    <AndroidIcon size={24} color="#22c55e" />
                  </div>
                  <div className="vet-app-text-wrap">
                    <span className="vet-app-text-top">Download App for</span>
                    <span className="vet-app-text-bottom">Android (APK)</span>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={() => setShowIosModal(true)}
                  className="vet-app-store-btn vet-app-btn-ios"
                  title="Download PetCare Pro for iOS"
                >
                  <div className="vet-app-icon-wrap ios-wrap">
                    <AppleIcon size={24} color="#ffffff" />
                  </div>
                  <div className="vet-app-text-wrap">
                    <span className="vet-app-text-top">Download for</span>
                    <span className="vet-app-text-bottom">iOS (Apple)</span>
                  </div>
                </button>
              </div>
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

      {/* 3.5 MOBILE APP SHOWCASE SECTION */}
      <section id="mobile-app" className="vet-section-container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
        <div className="vet-app-showcase-box">
          <div className="vet-app-showcase-left">
            <div className="vet-badge">
              <Smartphone size={14} /> {t('apps.badge')}
            </div>
            <h2 className="vet-section-title" style={{ textAlign: 'left', marginBottom: '1rem', fontSize: '2.4rem' }}>
              {t('apps.sectionTitle')} <span className="vet-text-gradient">{t('apps.sectionGradient')}</span>
            </h2>
            <p className="vet-section-subtitle" style={{ textAlign: 'left', margin: '0 0 2rem 0', maxWidth: '600px' }}>
              {t('apps.sectionSubtitle')}
            </p>

            <div className="vet-app-bullets-grid">
              <div className="vet-app-bullet-item">
                <div className="vet-app-bullet-icon"><CheckCircle size={18} color="#14b8a6" /></div>
                <div>
                  <div className="vet-app-bullet-title">{t('apps.feature1Title')}</div>
                  <div className="vet-app-bullet-desc">{t('apps.feature1Desc')}</div>
                </div>
              </div>

              <div className="vet-app-bullet-item">
                <div className="vet-app-bullet-icon"><CheckCircle size={18} color="#14b8a6" /></div>
                <div>
                  <div className="vet-app-bullet-title">{t('apps.feature2Title')}</div>
                  <div className="vet-app-bullet-desc">{t('apps.feature2Desc')}</div>
                </div>
              </div>

              <div className="vet-app-bullet-item">
                <div className="vet-app-bullet-icon"><CheckCircle size={18} color="#14b8a6" /></div>
                <div>
                  <div className="vet-app-bullet-title">{t('apps.feature3Title')}</div>
                  <div className="vet-app-bullet-desc">{t('apps.feature3Desc')}</div>
                </div>
              </div>

              <div className="vet-app-bullet-item">
                <div className="vet-app-bullet-icon"><CheckCircle size={18} color="#14b8a6" /></div>
                <div>
                  <div className="vet-app-bullet-title">{t('apps.feature4Title')}</div>
                  <div className="vet-app-bullet-desc">{t('apps.feature4Desc')}</div>
                </div>
              </div>
            </div>

            <div className="vet-app-buttons-group" style={{ marginTop: '2.25rem' }}>
              <a
                href="/PetCare_Veterinary.apk"
                download="PetCare_Veterinary.apk"
                onClick={handleAndroidDownload}
                className="vet-app-store-btn vet-app-btn-android"
                title="Download PetCare Pro Android APK"
              >
                <div className="vet-app-icon-wrap android-wrap">
                  <AndroidIcon size={26} color="#22c55e" />
                </div>
                <div className="vet-app-text-wrap">
                  <span className="vet-app-text-top">Download App for</span>
                  <span className="vet-app-text-bottom">Android (APK)</span>
                </div>
              </a>

              <button
                type="button"
                onClick={() => setShowIosModal(true)}
                className="vet-app-store-btn vet-app-btn-ios"
                title="Download PetCare Pro for iOS"
              >
                <div className="vet-app-icon-wrap ios-wrap">
                  <AppleIcon size={26} color="#ffffff" />
                </div>
                <div className="vet-app-text-wrap">
                  <span className="vet-app-text-top">Download for</span>
                  <span className="vet-app-text-bottom">iOS (Apple)</span>
                </div>
              </button>
            </div>
          </div>

          <div className="vet-app-showcase-right">
            <div className="vet-app-phone-container">
              <div className="vet-app-phone-outer">
                <div className="vet-app-phone-speaker"></div>
                <div className="vet-app-phone-camera"></div>
                <div className="vet-app-phone-screen">
                  <div className="vet-app-screen-header">
                    <div className="vet-app-screen-brand">
                      <img src="/kt-logo.png" alt="Logo" style={{ height: '20px', objectFit: 'contain' }} />
                      <span>PetCare Pro</span>
                    </div>
                    <span className="vet-app-screen-live">● LIVE</span>
                  </div>
                  <img src="/sidebar-vet-dog.png" alt="PetCare Mobile App" className="vet-app-screen-img" />
                  <div className="vet-app-screen-badge">
                    <Zap size={14} color="#14b8a6" /> PWA Mobile Edition Active
                  </div>
                </div>
              </div>
            </div>
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
            {/* Column 1: Brand & Identity */}
            <div className="vet-footer-col-brand">
              <div className="vet-footer-brand-title">
                <img src="/kt-logo.png" alt="Kiaan Technology Logo" style={{ height: '42px', objectFit: 'contain' }} />
                <span>KIAAN <span className="vet-text-teal">TECHNOLOGY</span></span>
              </div>
              <p className="vet-footer-desc">
                {t('footer.tagline')}
              </p>
              
              <div className="vet-footer-social-row">
                <a href="https://www.instagram.com/kiaan_technology4/" target="_blank" rel="noopener noreferrer" 
                   className="vet-social-btn instagram"
                   title="Follow us on Instagram">
                  <Instagram size={18} strokeWidth={2.2} />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61560965313920&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" 
                   className="vet-social-btn facebook"
                   title="Follow us on Facebook">
                  <Facebook size={18} strokeWidth={2.2} />
                </a>
                <a href="https://www.linkedin.com/company/kiaan-technology-pvt-ltd/posts/?feedView=all" target="_blank" rel="noopener noreferrer" 
                   className="vet-social-btn linkedin"
                   title="Follow us on LinkedIn">
                  <Linkedin size={18} strokeWidth={2.2} />
                </a>
                <a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer" 
                   className="vet-social-btn website"
                   title="Visit Official Website">
                  <Globe size={18} strokeWidth={2.2} />
                </a>
              </div>

              <div className="vet-footer-trust-pill">
                <ShieldCheck size={14} style={{ color: '#2dd4bf' }} />
                <span>ISO 27001 Certified & HIPAA Ready</span>
              </div>
            </div>

            {/* Column 2: Clinical Modules */}
            <div>
              <h4 className="vet-footer-col-title">Clinical Modules</h4>
              <ul className="vet-footer-links">
                <li><a href="/smart-appointments" onClick={(e) => { e.preventDefault(); navigate('/smart-appointments'); }}>Smart Appointments & Queue</a></li>
                <li><a href="/electronic-medical-records" onClick={(e) => { e.preventDefault(); navigate('/electronic-medical-records'); }}>Electronic Medical Records (EMR)</a></li>
                <li><a href="/pharmacy-pos-billing" onClick={(e) => { e.preventDefault(); navigate('/pharmacy-pos-billing'); }}>Pharmacy & POS Billing</a></li>
                <li><a href="/automated-whatsapp-alerts" onClick={(e) => { e.preventDefault(); navigate('/automated-whatsapp-alerts'); }}>Automated WhatsApp Alerts</a></li>
                <li><a href="/hospitalization-ipd" onClick={(e) => { e.preventDefault(); navigate('/hospitalization-ipd'); }}>Hospitalization & IPD Ward</a></li>
                <li><a href="/multi-branch-reports" onClick={(e) => { e.preventDefault(); navigate('/multi-branch-reports'); }}>Multi-Branch Reports</a></li>
              </ul>
            </div>

            {/* Column 3: Quick Navigation */}
            <div>
              <h4 className="vet-footer-col-title">{t('footer.quickLinks')}</h4>
              <ul className="vet-footer-links">
                <li><a href="/" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>{t('nav.home')}</a></li>
                <li><a href="/features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>{t('nav.features')}</a></li>
                <li><a href="/pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>{t('nav.pricing')}</a></li>
                <li><a href="/benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }}>{t('nav.benefits')}</a></li>
                <li><a href="/#mobile-app" onClick={(e) => { e.preventDefault(); scrollToSection('mobile-app'); }}>Mobile Apps (Android & iOS)</a></li>
                <li><a href="/PetCare_Veterinary.apk" download="PetCare_Veterinary.apk" onClick={handleAndroidDownload}>Download Android APK</a></li>
                <li><a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Clinic Admin Login</a></li>
                <li><a href="/register?plan=starter" onClick={(e) => { e.preventDefault(); navigate('/register?plan=starter'); }}>Start 7-Day Free Trial</a></li>
              </ul>
            </div>

            {/* Column 4: Contact & Support */}
            <div>
              <h4 className="vet-footer-col-title">{t('footer.contact')}</h4>
              <ul className="vet-contact-list">
                <li className="vet-contact-item">
                  <MapPin size={18} className="vet-contact-icon" />
                  <span>2341, Sector E, Sudama Nagar, Indore, Madhya Pradesh 452009</span>
                </li>
                <li className="vet-contact-item">
                  <Phone size={18} className="vet-contact-icon" />
                  <a href="tel:+919752100980" style={{ color: 'inherit', textDecoration: 'none' }}>+91 97521 00980</a>
                </li>
                <li className="vet-contact-item">
                  <Mail size={18} className="vet-contact-icon" />
                  <a href="mailto:info@kiaantechnology.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@kiaantechnology.com</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="vet-footer-bottom">
            <div className="vet-copyright-text">
              © 2026 <strong>Kiaan Tech Craft Pvt. Ltd.</strong> All rights reserved. PetCare Pro SaaS Platform.
            </div>
            <div className="vet-bottom-links">
              <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }}>Privacy Policy</a>
              <span className="vet-bottom-divider">•</span>
              <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms & Conditions</a>
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
        <RegisterModal 
          plan={selectedPlan} 
          currency={activeRegion.currency}
          pricing={pricing}
          onClose={() => setShowRegisterModal(false)} 
        />
      )}

      {showLegalModal && (
        <LegalModal type={legalType} onClose={() => setShowLegalModal(false)} />
      )}

      {showIosModal && (
        <IosModal onClose={() => setShowIosModal(false)} />
      )}

      {downloadToast && (
        <div className="vet-download-toast">
          <CheckCircle size={18} color="#22c55e" style={{ flexShrink: 0 }} />
          <span>{downloadToast}</span>
        </div>
      )}
    </div>
  );
}
