// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import en from "./../Lang/eng/translation.json";

// i18n
//   .use(initReactI18next) // passes i18n down to react-i18next
//   .init({
//     // the translations
//     // (tip move them in a JSON file and import them,
//     // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
//     resources: {
//       en: en,
//     },
//     lng: "en", // if you're using a language detector, do not define the lng option
//     fallbackLng: "en",
//     interpolation: {
//       escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
//     },
//   });
import {I18n} from "i18n-js";
import * as Localization from "expo-localization";
import en from "./../Lang/eng/translation.json";
import zh from "./../Lang/zh/translation.json";
// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
    en,
    zh
  });
// Set the locale once at the beginning of your app.
i18n.defaultLocale = 'en'
i18n.locale = "en";
// i18n.fallbacks = true;

export default i18n;