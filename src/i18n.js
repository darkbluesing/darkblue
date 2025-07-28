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
  try {
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
  } catch (error) {
    console.log("언어 감지 오류:", error);
    return "ko"; // 오류 시 기본값
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(),
    fallbackLng: "ko",
    debug: true, // 디버그 모드 활성화
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    keySeparator: false,
    nsSeparator: false,
  });

export default i18n;
