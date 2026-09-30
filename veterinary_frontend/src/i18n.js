import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Supported language keys
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇦🇪', rtl: true },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' }
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
      fr: { translation: {} },
      es: { translation: {} },
      hi: { translation: {} },
      ar: { translation: {} },
      de: { translation: {} },
      ru: { translation: {} },
      pt: { translation: {} }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
