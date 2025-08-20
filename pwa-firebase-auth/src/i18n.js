import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Ajusta las rutas/nombres según tus archivos reales
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import fr from "./locales/fr/translation.json";

const savedLang =
  localStorage.getItem("language") ||
  (navigator.language ? navigator.language.slice(0, 2) : "es") ||
  "es";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
    },
    lng: ["en", "es", "fr"].includes(savedLang) ? savedLang : "es",
    fallbackLng: "es",
    interpolation: { escapeValue: false },
  });

export default i18n;

