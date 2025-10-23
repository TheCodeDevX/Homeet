import { create } from "zustand";
import { languages } from "../constants";
import i18n from "../config/reacti18next";


export type Lang = "ar" | "en" | "es" | "fr"

 interface LangugaeStates {
  lang : Lang
  setLang : (lang:Lang) => void
 }

 export const useLangStore = create<LangugaeStates>((set) => ({
 lang : localStorage?.getItem("lang") as Lang,
 setLang : (lang) => {
    set({ lang }),
    localStorage.setItem("lang", lang)
 }
 }))