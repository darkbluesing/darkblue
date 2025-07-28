import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationKO from "./locales/ko/translation.json";
import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";
import translationJA from "./locales/ja/translation.json";
import translationFR from "./locales/fr/translation.json";

const resources = {
  ko: { translation: translationKO },
  en: { translation: translationEN },
  es: { translation: translationES },
  ja: { translation: translationJA },
  fr: { translation: translationFR },
};

// 지역별 언어 감지 함수
function detectLanguage() {
  // 저장된 언어 설정 확인
  const savedLang = localStorage.getItem("lang");
  if (savedLang && resources[savedLang]) {
    return savedLang;
  }

  // 브라우저 언어 감지
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split("-")[0].toLowerCase();
  
  // 지원하는 언어 매핑
  const supportedLangs = {
    "ko": "ko",
    "en": "en",
    "es": "es",
    "ja": "ja",
    "fr": "fr"
  };
  
  return supportedLangs[langCode] || "ko"; // 기본값: 한국어
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(), // 감지된 언어 사용
    fallbackLng: "ko", // 기본 언어
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
