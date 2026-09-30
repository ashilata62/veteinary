import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { SUPPORTED_LANGUAGES } from '../i18n';

export const LanguageSwitcher = ({ variant = 'buttons', className = '' }) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('petcare_lang') || i18n.language?.split('-')[0] || 'en';
  });

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

  // TRIGGER GOOGLE TRANSLATE WHEN CUSTOM BUTTON IS CLICKED
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem('petcare_lang', lang);

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
      // Retry for up to 4 seconds if script is still initializing
      let attempts = 0;
      const retry = setInterval(() => {
        attempts++;
        if (triggerSelect() || attempts > 20) {
          clearInterval(retry);
        }
      }, 200);
    }
  };

  if (variant === 'select') {
    return (
      <div className={clsx("relative inline-block notranslate", className)}>
        <select
          value={currentLang}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.name} ({l.code.toUpperCase()})
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    /* 'notranslate' class prevents Google from translating EN to French or other languages */
    <div className={clsx("flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 h-10 notranslate", className)}>
      <button
        type="button"
        onClick={() => handleLanguageChange('en')}
        className={clsx(
          "px-3 h-full text-[11px] font-black rounded-md transition-all uppercase tracking-wider",
          currentLang === 'en'
            ? "bg-white text-blue-600 shadow-sm border border-slate-100"
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleLanguageChange('fr')}
        className={clsx(
          "px-3 h-full text-[11px] font-black rounded-md transition-all uppercase tracking-wider",
          currentLang === 'fr'
            ? "bg-white text-blue-600 shadow-sm border border-slate-100"
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => handleLanguageChange('hi')}
        className={clsx(
          "px-3 h-full text-[11px] font-black rounded-md transition-all uppercase tracking-wider",
          currentLang === 'hi'
            ? "bg-white text-blue-600 shadow-sm border border-slate-100"
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        HI
      </button>
      <button
        type="button"
        onClick={() => handleLanguageChange('es')}
        className={clsx(
          "px-3 h-full text-[11px] font-black rounded-md transition-all uppercase tracking-wider",
          currentLang === 'es'
            ? "bg-white text-blue-600 shadow-sm border border-slate-100"
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;
