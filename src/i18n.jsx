import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './translations/en/translation.json';
import translationAR from './translations/ar/translation.json';
import translationTR from './translations/tr/translation.json';

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
  tr: { translation: translationTR },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: (() => {
      const saved = localStorage.getItem('language');
      if (saved) return saved;
      const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
      const supported = ['en', 'ar', 'tr'];
      if (supported.includes(browserLang)) return browserLang;
      return 'en'; // default to English
    })(),
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar', 'tr'],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
