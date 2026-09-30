import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { EDITIONS } from '../i18n';

// Fallback if not loaded
const FALLBACK_EDITIONS = [
  { code: 'us', short: 'US', label: 'USA ($)', lang: 'en', currency: 'USD', symbol: '$' },
  { code: 'in', short: 'IN', label: 'India (₹)', lang: 'en', currency: 'INR', symbol: '₹' },
  { code: 'ae', short: 'AE', label: 'UAE (AED)', lang: 'en', currency: 'AED', symbol: 'AED' },
  { code: 'fr', short: 'FR', label: 'France (€)', lang: 'fr', currency: 'EUR', symbol: '€' },
  { code: 'es', short: 'ES', label: 'Spain ($)', lang: 'es', currency: 'USD', symbol: '$' },
  { code: 'de', short: 'DE', label: 'Germany (€)', lang: 'de', currency: 'EUR', symbol: '€' },
  { code: 'gb', short: 'GB', label: 'UK (£)', lang: 'en', currency: 'GBP', symbol: '£' },
];

const ALL_EDITIONS = EDITIONS && EDITIONS.length > 0 ? EDITIONS : FALLBACK_EDITIONS;

const normalizeEditionCode = (val) => {
  if (!val) return 'us';
  const low = String(val).toLowerCase();
  if (low === 'usa') return 'us';
  if (low === 'uk') return 'gb';
  if (low === 'uae') return 'ae';
  return low;
};

export const LanguageSwitcher = ({
  selectedRegion,
  onRegionChange,
  variant = 'dropdown',
  className = '',
  inDrawer = false
}) => {
  const { i18n } = useTranslation();
  const { setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [currentRegion, setCurrentRegion] = useState(() => {
    const fromProp = normalizeEditionCode(selectedRegion);
    const stored = typeof window !== 'undefined' ? localStorage.getItem('petcare_region') : null;
    const fromStored = normalizeEditionCode(stored);
    if (ALL_EDITIONS.some((e) => e.code === fromProp)) return fromProp;
    if (ALL_EDITIONS.some((e) => e.code === fromStored)) return fromStored;
    return 'us';
  });

  const activeObj = ALL_EDITIONS.find((e) => e.code === currentRegion) || ALL_EDITIONS[0];

  // Auto-clean any stale foreign translation cookie if active edition is English
  useEffect(() => {
    if (activeObj && activeObj.lang === 'en') {
      const cookies = document.cookie;
      const isStaleTranslated =
        cookies.includes('googtrans=/en/de') ||
        cookies.includes('googtrans=/en/fr') ||
        cookies.includes('googtrans=/en/es') ||
        cookies.includes('googtrans=/en/hi') ||
        cookies.includes('googtrans=/en/ar');

      if (isStaleTranslated) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
        if (window.location.hostname !== 'localhost') {
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.' + window.location.hostname + '; path=/;';
        }
        window.location.reload();
      }
    }
  }, [activeObj]);

  // Sync with prop if provided
  useEffect(() => {
    if (selectedRegion) {
      const code = normalizeEditionCode(selectedRegion);
      if (code !== currentRegion && ALL_EDITIONS.some((e) => e.code === code)) {
        setCurrentRegion(code);
      }
    }
  }, [selectedRegion]);

  // Sync with custom event from outside (e.g. pricing pills)
  useEffect(() => {
    const handleRegionEvent = (e) => {
      if (e.detail) {
        const code = normalizeEditionCode(e.detail);
        if (code !== currentRegion && ALL_EDITIONS.some((ed) => ed.code === code)) {
          setCurrentRegion(code);
        }
      }
    };
    window.addEventListener('petcare_region_changed', handleRegionEvent);
    return () => window.removeEventListener('petcare_region_changed', handleRegionEvent);
  }, [currentRegion]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle selection of regional & language edition
  const handleSelect = (reg) => {
    const prevLang = localStorage.getItem('petcare_lang') || 'en';
    setCurrentRegion(reg.code);
    localStorage.setItem('petcare_region', reg.code);
    setIsOpen(false);

    // 1. Notify parent / LandingPage
    if (onRegionChange) {
      onRegionChange(reg.code);
    }
    window.dispatchEvent(new CustomEvent('petcare_region_changed', { detail: reg.code }));

    // 2. Change Currency Globally
    if (reg.currency) {
      try {
        setCurrency(reg.currency);
      } catch (e) {
        console.error('Error updating currency context', e);
      }
      localStorage.setItem('petcare_currency', reg.currency);
      window.dispatchEvent(new CustomEvent('petcare_currency_changed', { detail: reg.currency }));
    }

    // 3. Change Language / Google Translate
    if (reg.lang) {
      i18n.changeLanguage(reg.lang);
      localStorage.setItem('petcare_lang', reg.lang);

      try {
        const domain = window.location.hostname;
        if (reg.lang === 'en') {
          // Clear all translation cookies
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + domain;
          if (domain !== 'localhost') {
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${domain}; path=/;`;
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=/;`;
          }

          // If the page was translated into German/French/etc., reload to restore 100% original English
          if (prevLang !== 'en' || document.cookie.includes('googtrans=')) {
            window.location.reload();
            return;
          }
        } else {
          document.cookie = `googtrans=/en/${reg.lang}; path=/;`;
          document.cookie = `googtrans=/auto/${reg.lang}; path=/;`;
          if (domain !== 'localhost') {
            document.cookie = `googtrans=/en/${reg.lang}; domain=.${domain}; path=/;`;
            document.cookie = `googtrans=/auto/${reg.lang}; domain=.${domain}; path=/;`;
          }
        }
      } catch (e) {
        console.error('Error setting translation cookie', e);
      }

      const triggerSelect = () => {
        const masterSelect = document.querySelector("#google_translate_master_container select.goog-te-combo");
        if (masterSelect) {
          if (reg.lang === 'en') {
            masterSelect.value = '';
            masterSelect.dispatchEvent(new Event("change"));
          } else {
            masterSelect.value = reg.lang;
            masterSelect.dispatchEvent(new Event("change"));
          }
          return true;
        }
        return false;
      };

      if (!triggerSelect()) {
        let attempts = 0;
        const retry = setInterval(() => {
          attempts++;
          if (triggerSelect() || attempts > 20) {
            clearInterval(retry);
          }
        }, 200);
      }
    }
  };

  // Mobile Drawer native-styled accordion
  if (inDrawer) {
    return (
      <div className={`notranslate ${className}`} style={{ width: '100%', position: 'relative' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '12px',
            padding: '10px 14px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={18} color="#0d9488" strokeWidth={2.2} />
            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{activeObj.short}</span>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>{activeObj.label}</span>
          </div>
          <ChevronDown
            size={16}
            color="#475569"
            strokeWidth={2.5}
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          />
        </button>

        {isOpen && (
          <div
            style={{
              marginTop: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px'
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '6px 10px 8px 10px'
              }}
            >
              REGIONAL & LANGUAGE EDITIONS
            </div>
            {ALL_EDITIONS.map((reg) => {
              const isSelected = reg.code === currentRegion;
              return (
                <button
                  key={reg.code}
                  type="button"
                  onClick={() => handleSelect(reg)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isSelected ? '#ecfdf5' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', minWidth: '24px', color: isSelected ? '#047857' : '#0f172a' }}>
                      {reg.short}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: isSelected ? '#047857' : '#0f172a' }}>
                      {reg.label}
                    </span>
                  </div>
                  {isSelected && <Check size={18} color="#059669" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Standard Header Pill Dropdown (matching screenshot, fully responsive)
  return (
    <div
      className={`vet-edition-dropdown-wrapper notranslate ${className}`}
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block', verticalAlign: 'middle' }}
    >
      <button
        type="button"
        className="vet-edition-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          border: '1.5px solid #0f172a',
          borderRadius: '9999px',
          padding: '6px 14px',
          fontSize: '0.88rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          userSelect: 'none',
          outline: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <Globe size={17} color="#0d9488" strokeWidth={2.2} />
        <span style={{ fontWeight: 800, color: '#0f172a' }}>{activeObj.short}</span>
        <span className="vet-edition-label-full" style={{ fontWeight: 700, color: '#0f172a' }}>
          {activeObj.label}
        </span>
        <ChevronDown
          size={15}
          color="#475569"
          strokeWidth={2.5}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        />
      </button>

      {isOpen && (
        <div
          className="vet-edition-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '10px 8px 12px 8px',
            minWidth: '220px',
            maxWidth: 'min(280px, 92vw)',
            boxShadow: '0 16px 36px -4px rgba(0, 0, 0, 0.16), 0 6px 16px rgba(0, 0, 0, 0.08)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div
            style={{
              padding: '6px 12px 10px 12px',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}
          >
            REGIONAL & LANGUAGE EDITIONS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {ALL_EDITIONS.map((reg) => {
              const isSelected = reg.code === currentRegion;
              return (
                <button
                  key={reg.code}
                  type="button"
                  className={`vet-edition-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelect(reg)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isSelected ? '#ecfdf5' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        minWidth: '24px',
                        color: isSelected ? '#047857' : '#0f172a'
                      }}
                    >
                      {reg.short}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        color: isSelected ? '#047857' : '#0f172a'
                      }}
                    >
                      {reg.label}
                    </span>
                  </div>
                  {isSelected && (
                    <Check size={18} color="#059669" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
