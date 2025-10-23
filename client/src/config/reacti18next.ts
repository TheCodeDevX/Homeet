import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
// import enLng from "../locales/en/home.json"
// import frLng from '../locales/fr/home.json'
import HttpBackend from 'i18next-http-backend'


//  const resources = {
//   en: {
//     translation: enLng
//   },
//   fr: {
//     translation: frLng
//   }
// };


  i18n.use(HttpBackend).use(initReactI18next).init({
    fallbackLng : localStorage.getItem("lang") || "en" as "en" | "ar" | "es" | "fr",
    lng : localStorage.getItem("lang") as "en" | "ar" | "es" | "fr",
    ns : ["home", "common", "sidebar", "status", "nav", "tooltips",
       "card", "headers", "messages", "dashboard", "profile", "modals", "auth", "sort"],
    defaultNS:"home",
     interpolation : {
        escapeValue : false 
     },
     backend : {
      loadPath : "/locales/{{lng}}/{{ns}}.json"
     }
  })

  export default i18n;