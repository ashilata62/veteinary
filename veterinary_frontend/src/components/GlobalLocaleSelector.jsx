import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import { SUPPORTED_LANGUAGES } from '../i18n';

export const PRESET_REGIONS = [
  { id: 'in', label: 'India', flag: '🇮🇳', lang: 'en', currency: 'INR', desc: 'English • ₹ INR' },
  { id: 'us', label: 'USA', flag: '🇺🇸', lang: 'en', currency: 'USD', desc: 'English • $ USD' },
  { id: 'gb', label: 'UK', flag: '🇬🇧', lang: 'en', currency: 'GBP', desc: 'English • £ GBP' },
  { id: 'eu', label: 'Europe (FR)', flag: '🇫🇷', lang: 'fr', currency: 'EUR', desc: 'Français • € EUR' },
  { id: 'ae', label: 'UAE', flag: '🇦🇪', lang: 'en', currency: 'AED', desc: 'English • AED' },
  { id: 'es', label: 'Spain', flag: '🇪🇸', lang: 'es', currency: 'EUR', desc: 'Español • € EUR' },
  { id: 'au', label: 'Australia', flag: '🇦🇺', lang: 'en', currency: 'AUD', desc: 'English • A$ AUD' }
];

export const GlobalLocaleSelector = ({ compact = false, className = '' }) => {
  const { i18n } = useTranslation();
  const { currency, setCurrency, activeCurrency, currencyList } = useCurrency();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'lang', 'currency'
  const dropdownRef = useRef(null);

  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('petcare_lang') || i18n.language?.split('-')[0] || 'en';
  });

  // Sync with Google Translate if changed externally
  useEffect(() => {
    const syncWithGoogle = () => {
      const masterSelect = document.querySelector("#google_translate_master_container select.goog-te-combo");
      if (masterSelect && masterSelect.value && masterSelect.value !== currentLang) {
        setCurrentLang(masterSelect.value);
        i18n.changeLanguage(masterSelect.value);
        localStorage.setItem('petcare_lang', masterSelect.value);
      }
    };
    const interval = setInterval(syncWithGoogle, 1000);
    return () => clearInterval(interval);
  }, [currentLang, i18n]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerGoogleTranslate = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem('petcare_lang', lang);

    try {
      const domain = window.location.hostname;
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/auto/${lang}; path=/;`;
      if (domain !== 'localhost') {
        document.cookie = `googtrans=/en/${lang}; domain=.${domain}; path=/;`;
        document.cookie = `googtrans=/auto/${lang}; domain=.${domain}; path=/;`;
      }
    } catch (e) {
      console.error(e);
    }

    const select = document.querySelector("#google_translate_master_container select.goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    } else {
      let attempts = 0;
      const retry = setInterval(() => {
        attempts++;
        const s = document.querySelector("#google_translate_master_container select.goog-te-combo");
        if (s) {
          s.value = lang;
          s.dispatchEvent(new Event("change"));
          clearInterval(retry);
        } else if (attempts > 20) {
          clearInterval(retry);
        }
      }, 200);
    }
  };

  const handleLanguageSelect = (langCode) => {
    triggerGoogleTranslate(langCode);
  };

  const handleCurrencySelect = (currCode) => {
    setCurrency(currCode);
  };

  const handlePresetSelect = (preset) => {
    triggerGoogleTranslate(preset.lang);
    setCurrency(preset.currency);
    setOpen(false);
  };

  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className={`relative notranslate ${className}`} ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="notranslate"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: compact ? '4px 8px' : '6px 12px',
          backgroundColor: open ? '#f1f5f9' : '#f8fafc',
          border: '1px solid var(--border, #e2e8f0)',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--text-primary, #1e293b)',
          transition: 'all 0.15s ease',
          boxShadow: open ? '0 0 0 2px rgba(20, 184, 166, 0.2)' : 'none',
        }}
        title="Select Language & Global Currency"
      >
        <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{activeLangObj.flag}</span>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {currentLang}
        </span>
        <span style={{ color: '#cbd5e1' }}>•</span>
        <span style={{ color: 'var(--primary-teal, #0d9488)', fontWeight: 700 }}>
          {activeCurrency.symbol.trim()} {activeCurrency.code}
        </span>
        <ChevronDown size={13} style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div
          className="notranslate animate-fade-in"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: '320px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            overflow: 'hidden',
            fontFamily: 'inherit'
          }}
        >
          {/* Header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Global Settings
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Language & Currency
              </span>
            </div>

            {/* Quick Segmented Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px', backgroundColor: '#e2e8f0', padding: '2px', borderRadius: '6px' }}>
              {[
                { id: 'all', label: 'Regions' },
                { id: 'lang', label: 'Languages' },
                { id: 'currency', label: 'Currencies' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: activeTab === t.id ? '#ffffff' : 'transparent',
                    color: activeTab === t.id ? '#0f172a' : '#64748b',
                    fontWeight: activeTab === t.id ? 700 : 500,
                    fontSize: '0.72rem',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '8px' }}>
            {/* Presets Tab */}
            {activeTab === 'all' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '4px 8px' }}>
                  Quick Country Presets
                </span>
                {PRESET_REGIONS.map((reg) => {
                  const isMatch = reg.lang === currentLang && reg.currency === currency;
                  return (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => handlePresetSelect(reg)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: isMatch ? '#f0fdfa' : 'transparent',
                        color: isMatch ? '#0d9488' : '#334155',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => { if (!isMatch) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                      onMouseLeave={(e) => { if (!isMatch) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{reg.flag}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{reg.label}</div>
                          <div style={{ fontSize: '0.68rem', color: isMatch ? '#14b8a6' : '#94a3b8' }}>{reg.desc}</div>
                        </div>
                      </div>
                      {isMatch && <Check size={16} style={{ color: '#0d9488' }} />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Languages Tab */}
            {activeTab === 'lang' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '4px 8px' }}>
                  Select Display Language
                </span>
                {SUPPORTED_LANGUAGES.map((l) => {
                  const isCurrent = l.code === currentLang;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => handleLanguageSelect(l.code)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: isCurrent ? '#eff6ff' : 'transparent',
                        color: isCurrent ? '#2563eb' : '#334155',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                      onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>{l.flag}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{l.native}</div>
                          <div style={{ fontSize: '0.68rem', color: isCurrent ? '#3b82f6' : '#94a3b8' }}>{l.name} ({l.code.toUpperCase()})</div>
                        </div>
                      </div>
                      {isCurrent && <Check size={16} style={{ color: '#2563eb' }} />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Currency Tab */}
            {activeTab === 'currency' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '4px 8px' }}>
                  Select Base Currency
                </span>
                {currencyList.map((c) => {
                  const isCurrent = c.code === currency;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCurrencySelect(c.code)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: isCurrent ? '#f0fdfa' : 'transparent',
                        color: isCurrent ? '#0d9488' : '#334155',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                      onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>{c.flag}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{c.code} ({c.symbol.trim()})</div>
                          <div style={{ fontSize: '0.68rem', color: isCurrent ? '#14b8a6' : '#94a3b8' }}>{c.name}</div>
                        </div>
                      </div>
                      {isCurrent && <Check size={16} style={{ color: '#0d9488' }} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc', fontSize: '0.68rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Changes apply globally in real-time</span>
            <span style={{ color: '#0d9488', fontWeight: 700 }}>PetCare Pro</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalLocaleSelector;
