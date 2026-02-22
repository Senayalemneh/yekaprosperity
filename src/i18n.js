// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import your translations
import en from "./locales/en/translation.json";
import am from './locales/am/translation.json';
import or from './locales/or/translation.json';

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en: { translation: en },
      am: { translation: am },
      or: { translation: or },
    },
    fallbackLng: 'am',
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
  });

export default i18n;
