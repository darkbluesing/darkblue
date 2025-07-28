import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationKO from './locales/ko/translation.json';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationJA from './locales/ja/translation.json';
import translationFR from './locales/fr/translation.json';

const resources = {
  ko: { translation: translationKO },
  en: { translation: translationEN },
  es: { translation: translationES },
  ja: { translation: translationJA },
  fr: { translation: translationFR },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 