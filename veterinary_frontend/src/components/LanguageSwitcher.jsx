import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n';

export const LanguageSwitcher = ({ variant = 'dropdown', className = '', inDrawer = false }) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('petcare_lang') || i18n.language?.split('-')[0] || 'en';
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // SYNC REACT STATE IF GOOGLE TRANSLATE CHANGES
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

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // TRIGGER GOOGLE TRANSLATE WHEN LANGUAGE IS SELECTED
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem('petcare_lang', lang);
    setIsOpen(false);

    // Set cookie for Google translate persistence
    try {
      const domain = window.location.hostname;
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/auto/${lang}; path=/;`;
      if (domain !== 'localhost') {
        document.cookie = `googtrans=/en/${lang}; domain=.${domain}; path=/;`;
        document.cookie = `googtrans=/auto/${lang}; domain=.${domain}; path=/;`;
      }
    } catch (e) {
      console.error('Error setting translation cookie', e);
    }

    const triggerSelect = () => {
      const masterSelect = document.querySelector("#google_translate_master_container select.goog-te-combo");
      if (masterSelect) {
        masterSelect.value = lang;
        masterSelect.dispatchEvent(new Event("change"));
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
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  // Mobile Drawer native select or variant='select'
  if (variant === 'select' || inDrawer) {
    return (
      <div className={`notranslate ${className}`} style={{ width: inDrawer ? '100%' : 'auto', display: 'inline-block' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <select
            value={currentLang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px 32px 8px 12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              outline: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
                {l.flag} {l.native} ({l.name})
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>
    );
  }

  // Standard Header Dropdown
  return (
    <div
      className={`vet-lang-dropdown-wrapper notranslate ${className}`}
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block', verticalAlign: 'middle' }}
    >
      <button
        type="button"
        className="vet-lang-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          borderRadius: '8px',
          padding: '7px 12px',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#334155';
          e.currentTarget.style.borderColor = '#14b8a6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1e293b';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
        }}
      >
        <Globe size={15} color="#14b8a6" />
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{currentLangObj.flag}</span>
        <span style={{ color: '#f8fafc', fontWeight: 700 }}>{currentLangObj.name}</span>
        <ChevronDown
          size={14}
          color="#94a3b8"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        />
      </button>

      {isOpen && (
        <div
          className="vet-lang-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '6px',
            minWidth: '200px',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.5), 0 4px 10px rgba(0,0,0,0.3)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div
            style={{
              padding: '6px 10px 4px 10px',
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '4px'
            }}
          >
            Select Language
          </div>

          <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
            {SUPPORTED_LANGUAGES.map((l) => {
              const isSelected = l.code === currentLang;
              return (
                <button
                  key={l.code}
                  type="button"
                  className={`vet-lang-option ${isSelected ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(l.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: isSelected ? '1px solid rgba(20, 184, 166, 0.3)' : '1px solid transparent',
                    backgroundColor: isSelected ? 'rgba(20, 184, 166, 0.2)' : 'transparent',
                    color: isSelected ? '#2dd4bf' : '#e2e8f0',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#e2e8f0';
                    }
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{l.flag}</span>
                    <span>
                      {l.native}{' '}
                      <span style={{ fontSize: '0.72rem', color: isSelected ? '#5eead4' : '#94a3b8' }}>
                        ({l.code.toUpperCase()})
                      </span>
                    </span>
                  </span>
                  {isSelected && <Check size={15} color="#2dd4bf" />}
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

