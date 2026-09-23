import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', short: 'HI', flag: '🇮🇳' },
  { code: 'gu', label: 'ગુજરાતી', short: 'GU', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', short: 'MR', flag: '🇮🇳' },
  { code: 'fr', label: 'Français', short: 'FR', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    const raw = i18n.language?.split('-')[0] || 'en';
    return LANGUAGES.some(l => l.code === raw) ? raw : 'en';
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync React state if Google Translate widget changes
  useEffect(() => {
    const syncWithGoogle = () => {
      const masterSelect = document.querySelector("#google_translate_master_container select.goog-te-combo");
      if (masterSelect && masterSelect.value && masterSelect.value !== currentLang) {
        setCurrentLang(masterSelect.value);
        i18n.changeLanguage(masterSelect.value);
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

  // Trigger Google Translate when custom language is selected
  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);

    const masterSelect = document.querySelector("#google_translate_master_container select.goog-te-combo");
    if (masterSelect) {
      masterSelect.value = langCode;
      masterSelect.dispatchEvent(new Event("change"));
    }
  };

  const activeLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="notranslate" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '6px 10px',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#334155',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.backgroundColor = '#f0fdfa'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
        title="Select Application Language"
      >
        <Globe size={15} style={{ color: '#14b8a6' }} />
        <span>{activeLangObj.flag} {activeLangObj.short}</span>
        <ChevronDown size={14} style={{ color: '#94a3b8', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>

      {/* Language Selection Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '6px',
          width: '160px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '4px 8px', letterSpacing: '0.05em' }}>
            5 Languages
          </div>

          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isSelected ? '#f0fdfa' : 'transparent',
                  color: isSelected ? '#0f766e' : '#334155',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
                {isSelected && <Check size={14} style={{ color: '#14b8a6' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
