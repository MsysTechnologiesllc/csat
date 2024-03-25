import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import { translationEN } from "./en/translation";

const resources = {
  en: {
    translation: translationEN,
  },
};

const ns = ["translation"];
const supportedLngs = ["en", "fr", "ar"];

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    debug: true,
    lng: "en",
    fallbackLng: "en",
    defaultNS: "translation",
    ns,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    supportedLngs,
    resources,
  });

export default i18n;
