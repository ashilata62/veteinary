import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Supported regional editions (7 Regional & Language Editions)
export const EDITIONS = [
  { code: 'us', short: 'US', label: 'USA ($)', lang: 'en', currency: 'USD', symbol: '$' },
  { code: 'in', short: 'IN', label: 'India (₹)', lang: 'en', currency: 'INR', symbol: '₹' },
  { code: 'ae', short: 'AE', label: 'UAE (AED)', lang: 'en', currency: 'AED', symbol: 'AED' },
  { code: 'fr', short: 'FR', label: 'France (€)', lang: 'fr', currency: 'EUR', symbol: '€' },
  { code: 'es', short: 'ES', label: 'Spain ($)', lang: 'es', currency: 'USD', symbol: '$' },
  { code: 'de', short: 'DE', label: 'Germany (€)', lang: 'de', currency: 'EUR', symbol: '€' },
  { code: 'gb', short: 'GB', label: 'UK (£)', lang: 'en', currency: 'GBP', symbol: '£' }
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'Hindi', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', native: 'Arabic', flag: '🇦🇪', rtl: true },
  { code: 'fr', name: 'French', native: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', native: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', native: 'German', flag: '🇩🇪' }
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      lookupLocalStorage: 'petcare_lang',
      caches: ['localStorage']
    },
    resources: {
      en: { translation: {} },
      hi: { translation: {} },
      ar: { translation: {} },
      fr: { translation: {} },
      es: { translation: {} },
      de: { translation: {} }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
