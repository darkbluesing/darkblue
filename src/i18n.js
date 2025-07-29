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
async function detectLanguage() {
  try {
    // localStorage 사용하지 않음 - 항상 브라우저/지역(IP) 기반 감지

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
    
    // 브라우저 언어가 지원되는 경우
    if (supportedLangs[langCode]) {
      return supportedLangs[langCode];
    }

    // IP 기반 지역 감지 (선택적)
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const countryCode = data.country_code;
      // 국가별 언어 매핑
      const countryToLang = {
        'KR': 'ko',
        'US': 'en',
        'GB': 'en',
        'CA': 'en', // 캐나다는 영어가 더 일반적
        'AU': 'en',
        'ES': 'es',
        'MX': 'es',
        'AR': 'es',
        'CO': 'es',
        'PE': 'es',
        'JP': 'ja',
        'FR': 'fr',
        'BE': 'fr',
        'CH': 'fr'
      };
      if (countryToLang[countryCode]) {
        return countryToLang[countryCode];
      }
    } catch (error) {
      console.log("IP 기반 언어 감지 실패:", error);
    }
    return "ko"; // 기본값: 한국어
  } catch (error) {
    console.log("언어 감지 오류:", error);
    return "ko"; // 오류 시 기본값
  }
}

// 언어 감지 후 i18n 초기화
async function initializeI18n() {
  const detectedLang = await detectLanguage();
  
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: detectedLang,
      fallbackLng: "ko",
      debug: false, // 프로덕션에서는 디버그 모드 비활성화
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      keySeparator: false,
      nsSeparator: false,
    });
}

// 초기화 실행
initializeI18n();

export default i18n;
