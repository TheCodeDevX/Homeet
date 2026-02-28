import { create } from "zustand";


export type Lang = "ar" | "en" | "es" | "fr"

 interface LangugaeStates {
  lang : Lang,
  setLang : (lang:Lang) => void
 }

 export const useLangStore = create<LangugaeStates>((set) => ({
 lang : localStorage?.getItem?.("lang") as Lang || "en",
 setLang : (lang) => {
   set({ lang }),
   localStorage.setItem("lang", lang)
 }
 }))